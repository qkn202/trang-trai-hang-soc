import type { ValleyVillagerId } from '../../types/game';
import type { SkeletalEntityPose } from './spineAdapter';

export const SPINE_SKEL_URL = '/game/trang-trai-hang-soc/paintings/spine/villagers.skel.json';
export const SPINE_ATLAS_URL = '/game/trang-trai-hang-soc/paintings/spine/villagers.atlas';
export const SPINE_WEBP_URL = '/game/trang-trai-hang-soc/paintings/spine/villagers_atlas.webp';

/**
 * Stride (floats) per evaluated slot quad in `SpinePoseEvaluator.quads`:
 * [x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, shade, emissive]
 */
export const SPINE_QUAD_STRIDE = 14;
export const MAX_SPINE_QUADS = 12;

const MAX_BONES = 16;

export interface SpineAtlasRegion {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export interface SpineAtlasData {
  imageName: string;
  width: number;
  height: number;
  regions: Map<string, SpineAtlasRegion>;
}

export interface SpineBoneDef {
  index: number;
  name: string;
  parentIndex: number;
  parentName: string | null;
  x: number;
  y: number;
  rotation: number;
}

export interface SpineSlotDef {
  index: number;
  name: string;
  boneIndex: number;
  boneName: string;
  attachment: string | null;
}

export interface SpineSkinAttachment {
  slotName: string;
  regionName: string;
  region: SpineAtlasRegion | null;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  emissive: number;
}

export interface SpineKeyTranslate {
  time: number;
  x: number;
  y: number;
}

export interface SpineKeyRotate {
  time: number;
  value: number;
}

export interface SpineKeyScale {
  time: number;
  x: number;
  y: number;
}

export interface SpineBoneTimeline {
  translate?: SpineKeyTranslate[];
  rotate?: SpineKeyRotate[];
  scale?: SpineKeyScale[];
}

export interface SpineAnimationDef {
  name: string;
  duration: number;
  bonesByIndex: Array<SpineBoneTimeline | null>;
}

export interface SpineSkinPhysics {
  propStabilize: number;
  greetScale: number;
}

export interface SpineSkeletonData {
  version: string;
  bones: SpineBoneDef[];
  boneIndexByName: Map<string, number>;
  slots: SpineSlotDef[];
  skins: Map<string, Map<string, SpineSkinAttachment>>;
  skinBones: Map<string, Float32Array>;
  skinSizes: Map<string, [number, number]>;
  skinPhysics: Map<string, SpineSkinPhysics>;
  animations: Map<string, SpineAnimationDef>;
}

export interface SharedVillagerSpineBundle {
  loading: boolean;
  ready: boolean;
  failed: boolean;
  atlas: SpineAtlasData | null;
  skeleton: SpineSkeletonData | null;
  atlasImage: HTMLImageElement | null;
}

/**
 * Parse standard libGDX / Spine `.atlas` text into normalized UV regions.
 */
export function parseSpineTextureAtlas(atlasText: string): SpineAtlasData {
  const lines = atlasText.split(/\r?\n/);
  let imageName = 'villagers_atlas.webp';
  let atlasW = 1024;
  let atlasH = 212;
  const regions = new Map<string, SpineAtlasRegion>();

  let currentName: string | null = null;
  let curX = 0;
  let curY = 0;
  let curW = 0;
  let curH = 0;
  let hasXY = false;

  const commitRegion = () => {
    if (!currentName || curW <= 0 || curH <= 0 || atlasW <= 0 || atlasH <= 0) {
      currentName = null;
      hasXY = false;
      return;
    }
    regions.set(currentName, {
      name: currentName,
      x: curX,
      y: curY,
      width: curW,
      height: curH,
      u0: curX / atlasW,
      v0: curY / atlasH,
      u1: (curX + curW) / atlasW,
      v1: (curY + curH) / atlasH,
    });
    currentName = null;
    hasXY = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) {
      commitRegion();
      continue;
    }
    if (trimmed.endsWith('.webp') || trimmed.endsWith('.png')) {
      imageName = trimmed;
      continue;
    }
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      commitRegion();
      currentName = trimmed;
      curX = 0;
      curY = 0;
      curW = 0;
      curH = 0;
      hasXY = false;
      continue;
    }
    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim();
    if (!currentName) {
      if (key === 'size') {
        const parts = val.split(',');
        const w = Number(parts[0]);
        const h = Number(parts[1]);
        if (Number.isFinite(w) && w > 0) atlasW = w;
        if (Number.isFinite(h) && h > 0) atlasH = h;
      }
      continue;
    }
    if (key === 'xy' || key === 'bounds') {
      const parts = val.split(',');
      curX = Number(parts[0]) || 0;
      curY = Number(parts[1]) || 0;
      if (parts.length >= 4) {
        curW = Number(parts[2]) || 0;
        curH = Number(parts[3]) || 0;
        hasXY = true;
      } else {
        hasXY = true;
      }
    } else if (key === 'size' && hasXY) {
      const parts = val.split(',');
      curW = Number(parts[0]) || 0;
      curH = Number(parts[1]) || 0;
      commitRegion();
    }
  }
  commitRegion();

  return { imageName, width: atlasW, height: atlasH, regions };
}

interface RawSkeletonJson {
  skeleton?: { spine?: string };
  bones?: Array<{ name: string; parent?: string; x?: number; y?: number; rotation?: number }>;
  slots?: Array<{ name: string; bone: string; attachment?: string }>;
  skins?: Array<{
    name: string;
    attachments?: Record<
      string,
      Record<
        string,
        {
          name?: string;
          x?: number;
          y?: number;
          rotation?: number;
          width?: number;
          height?: number;
          emissive?: number;
        }
      >
    >;
  }>;
  skinBones?: Record<string, Record<string, [number, number, number]>>;
  skinSizes?: Record<string, [number, number]>;
  skinPhysics?: Record<string, { propStabilize?: number; greetScale?: number }>;
  animations?: Record<
    string,
    {
      bones?: Record<
        string,
        {
          translate?: Array<{ time?: number; x?: number; y?: number }>;
          rotate?: Array<{ time?: number; value?: number; angle?: number }>;
          scale?: Array<{ time?: number; x?: number; y?: number }>;
        }
      >;
    }
  >;
}

const DEFAULT_ANIM_DURATIONS: Record<string, number> = {
  idle: 2.4,
  walk: 1.0,
  greet: 0.9,
  tend: 1.8,
};

/**
 * Parse exported Spine 4.1.24 JSON together with its parsed texture atlas.
 */
export function parseSpineSkeletonJson(
  rawInput: unknown,
  atlas: SpineAtlasData
): SpineSkeletonData {
  const raw = (typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput) as RawSkeletonJson;
  const rawBones = Array.isArray(raw?.bones) ? raw.bones : [];
  const bones: SpineBoneDef[] = [];
  const boneIndexByName = new Map<string, number>();

  for (let i = 0; i < rawBones.length && i < MAX_BONES; i++) {
    const rb = rawBones[i];
    const parentName = rb.parent ?? null;
    const parentIndex = parentName ? (boneIndexByName.get(parentName) ?? -1) : -1;
    bones.push({
      index: i,
      name: rb.name,
      parentIndex,
      parentName,
      x: Number(rb.x) || 0,
      y: Number(rb.y) || 0,
      rotation: Number(rb.rotation) || 0,
    });
    boneIndexByName.set(rb.name, i);
  }

  const slots: SpineSlotDef[] = [];
  const rawSlots = Array.isArray(raw?.slots) ? raw.slots : [];
  for (let i = 0; i < rawSlots.length; i++) {
    const rs = rawSlots[i];
    const boneIndex = boneIndexByName.get(rs.bone) ?? 0;
    slots.push({
      index: i,
      name: rs.name,
      boneIndex,
      boneName: rs.bone,
      attachment: rs.attachment ?? null,
    });
  }

  const skins = new Map<string, Map<string, SpineSkinAttachment>>();
  const rawSkins = Array.isArray(raw?.skins) ? raw.skins : [];
  for (let i = 0; i < rawSkins.length; i++) {
    const rSkin = rawSkins[i];
    const slotMap = new Map<string, SpineSkinAttachment>();
    const rawAttSlots = rSkin.attachments ?? {};
    for (const slotName of Object.keys(rawAttSlots)) {
      const slotEntries = rawAttSlots[slotName];
      const attKeys = Object.keys(slotEntries);
      if (attKeys.length === 0) continue;
      const attKey = attKeys[0];
      const attVal = slotEntries[attKey];
      const regionName = attVal.name ?? attKey;
      const region = atlas.regions.get(regionName) ?? atlas.regions.get(attKey) ?? null;
      slotMap.set(slotName, {
        slotName,
        regionName,
        region,
        x: Number(attVal.x) || 0,
        y: Number(attVal.y) || 0,
        rotation: Number(attVal.rotation) || 0,
        width: Number(attVal.width) || region?.width || 0,
        height: Number(attVal.height) || region?.height || 0,
        emissive: Number(attVal.emissive) || 0,
      });
    }
    skins.set(rSkin.name, slotMap);
  }

  const skinBones = new Map<string, Float32Array>();
  const rawSkinBones = raw?.skinBones ?? {};
  for (const cid of Object.keys(rawSkinBones)) {
    const arr = new Float32Array(bones.length * 3);
    const charBones = rawSkinBones[cid];
    for (let b = 0; b < bones.length; b++) {
      const bDef = bones[b];
      const override = charBones[bDef.name];
      arr[b * 3] = override ? Number(override[0]) || 0 : bDef.x;
      arr[b * 3 + 1] = override ? Number(override[1]) || 0 : bDef.y;
      arr[b * 3 + 2] = override ? Number(override[2]) || 0 : bDef.rotation;
    }
    skinBones.set(cid, arr);
  }

  const skinSizes = new Map<string, [number, number]>();
  const rawSkinSizes = raw?.skinSizes ?? {};
  for (const cid of Object.keys(rawSkinSizes)) {
    const sz = rawSkinSizes[cid];
    skinSizes.set(cid, [Number(sz[0]) || 105, Number(sz[1]) || 188]);
  }

  const skinPhysics = new Map<string, SpineSkinPhysics>();
  const rawSkinPhysics = raw?.skinPhysics ?? {};
  for (const cid of Object.keys(rawSkinPhysics)) {
    const phy = rawSkinPhysics[cid];
    skinPhysics.set(cid, {
      propStabilize: Number(phy?.propStabilize) || 0.5,
      greetScale: Number(phy?.greetScale) || 0.35,
    });
  }

  const animations = new Map<string, SpineAnimationDef>();
  const rawAnims = raw?.animations ?? {};
  for (const animName of Object.keys(rawAnims)) {
    const animObj = rawAnims[animName];
    const bonesByIndex: Array<SpineBoneTimeline | null> = new Array(bones.length).fill(null);
    let maxTime = 0;
    const animBones = animObj?.bones ?? {};
    for (const bName of Object.keys(animBones)) {
      const bIdx = boneIndexByName.get(bName);
      if (bIdx === undefined) continue;
      const rawTl = animBones[bName];
      const tl: SpineBoneTimeline = {};

      if (Array.isArray(rawTl.translate) && rawTl.translate.length > 0) {
        tl.translate = rawTl.translate.map((kf) => {
          const t = Number(kf.time) || 0;
          if (t > maxTime) maxTime = t;
          return { time: t, x: Number(kf.x) || 0, y: Number(kf.y) || 0 };
        });
      }
      if (Array.isArray(rawTl.rotate) && rawTl.rotate.length > 0) {
        tl.rotate = rawTl.rotate.map((kf) => {
          const t = Number(kf.time) || 0;
          if (t > maxTime) maxTime = t;
          const v = kf.value ?? kf.angle ?? 0;
          return { time: t, value: Number(v) || 0 };
        });
      }
      if (Array.isArray(rawTl.scale) && rawTl.scale.length > 0) {
        tl.scale = rawTl.scale.map((kf) => {
          const t = Number(kf.time) || 0;
          if (t > maxTime) maxTime = t;
          return {
            time: t,
            x: kf.x !== undefined ? Number(kf.x) : 1,
            y: kf.y !== undefined ? Number(kf.y) : 1,
          };
        });
      }
      bonesByIndex[bIdx] = tl;
    }
    const duration = DEFAULT_ANIM_DURATIONS[animName] ?? (maxTime > 0 ? maxTime : 1.0);
    animations.set(animName, { name: animName, duration, bonesByIndex });
  }

  return {
    version: raw?.skeleton?.spine ?? '4.1.24',
    bones,
    boneIndexByName,
    slots,
    skins,
    skinBones,
    skinSizes,
    skinPhysics,
    animations,
  };
}

function sampleRotate(frames: SpineKeyRotate[] | undefined, t: number): number {
  if (!frames || frames.length === 0) return 0;
  if (frames.length === 1 || t <= frames[0].time) return frames[0].value;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t <= b.time) {
      const span = b.time - a.time;
      const alpha = span > 1e-6 ? (t - a.time) / span : 0;
      return a.value + (b.value - a.value) * alpha;
    }
  }
  return frames[frames.length - 1].value;
}

function sampleTranslateX(frames: SpineKeyTranslate[] | undefined, t: number): number {
  if (!frames || frames.length === 0) return 0;
  if (frames.length === 1 || t <= frames[0].time) return frames[0].x;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t <= b.time) {
      const span = b.time - a.time;
      const alpha = span > 1e-6 ? (t - a.time) / span : 0;
      return a.x + (b.x - a.x) * alpha;
    }
  }
  return frames[frames.length - 1].x;
}

function sampleTranslateY(frames: SpineKeyTranslate[] | undefined, t: number): number {
  if (!frames || frames.length === 0) return 0;
  if (frames.length === 1 || t <= frames[0].time) return frames[0].y;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t <= b.time) {
      const span = b.time - a.time;
      const alpha = span > 1e-6 ? (t - a.time) / span : 0;
      return a.y + (b.y - a.y) * alpha;
    }
  }
  return frames[frames.length - 1].y;
}

function sampleScaleX(frames: SpineKeyScale[] | undefined, t: number): number {
  if (!frames || frames.length === 0) return 1;
  if (frames.length === 1 || t <= frames[0].time) return frames[0].x;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t <= b.time) {
      const span = b.time - a.time;
      const alpha = span > 1e-6 ? (t - a.time) / span : 0;
      return a.x + (b.x - a.x) * alpha;
    }
  }
  return frames[frames.length - 1].x;
}

function sampleScaleY(frames: SpineKeyScale[] | undefined, t: number): number {
  if (!frames || frames.length === 0) return 1;
  if (frames.length === 1 || t <= frames[0].time) return frames[0].y;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t <= b.time) {
      const span = b.time - a.time;
      const alpha = span > 1e-6 ? (t - a.time) / span : 0;
      return a.y + (b.y - a.y) * alpha;
    }
  }
  return frames[frames.length - 1].y;
}

function positiveMod(val: number, period: number): number {
  if (period <= 0) return 0;
  const r = val % period;
  return r < 0 ? r + period : r;
}

function slotShadeFactor(slotName: string): number {
  if (slotName === 'leg_l' || slotName === 'arm_back') return 0.91;
  if (slotName === 'head' || slotName === 'prop_main') return 1.03;
  return 1.0;
}

/**
 * Zero-allocation Forward Kinematics evaluator for multi-part villager skeletons.
 * All intermediate matrices and output slot quads live inside pre-allocated TypedArrays.
 */
export class SpinePoseEvaluator {
  public readonly quads = new Float32Array(MAX_SPINE_QUADS * SPINE_QUAD_STRIDE);
  public readonly quadPixelRects = new Int32Array(MAX_SPINE_QUADS * 4);
  public quadCount = 0;

  private readonly wa = new Float32Array(MAX_BONES);
  private readonly wb = new Float32Array(MAX_BONES);
  private readonly wc = new Float32Array(MAX_BONES);
  private readonly wd = new Float32Array(MAX_BONES);
  private readonly wx = new Float32Array(MAX_BONES);
  private readonly wy = new Float32Array(MAX_BONES);
  private readonly cumRot = new Float32Array(MAX_BONES);
  private lastEvaluatedCount = 0;

  public evaluate(
    skel: SpineSkeletonData,
    pose: SkeletalEntityPose,
    timeSec: number
  ): number {
    this.quadCount = 0;
    const cid: ValleyVillagerId = pose.villagerId;
    const skin = skel.skins.get(cid);
    if (!skin) return 0;

    const skinSize = skel.skinSizes.get(cid);
    const refH = skinSize ? skinSize[1] : 188;
    const scale = refH > 0 ? pose.drawH / refH : 1;
    const dir = pose.facingLeft || pose.drawW < 0 ? -1 : 1;

    const physics = skel.skinPhysics.get(cid);
    const propStabilize = physics ? physics.propStabilize : 0.5;
    const greetScale = physics ? physics.greetScale : 0.35;

    const bones = skel.bones;
    const boneCount = Math.min(bones.length, MAX_BONES);
    const skinSetup = skel.skinBones.get(cid);

    const walkWeight = pose.isWalking ? 1 : 0;
    const idleWeight = 1 - walkWeight;

    const animIdle = skel.animations.get('idle') ?? null;
    const animWalk = skel.animations.get('walk') ?? null;
    const animGreet = skel.animations.get('greet') ?? null;
    const animTend = skel.animations.get('tend') ?? null;

    const phaseSeed = pose.phaseSeed ?? 0;
    const idleT = animIdle ? positiveMod(timeSec + phaseSeed * 0.37, animIdle.duration) : 0;
    const walkT = animWalk
      ? positiveMod(pose.walkPhase / (Math.PI * 2), 1.0) * animWalk.duration
      : 0;

    const greetRaw = pose.greetWave ? Math.max(0, Math.min(1, pose.greetWave)) : 0;
    const greetWeight = greetRaw > 0.001 ? Math.sin(greetRaw * Math.PI * 0.5) : 0;
    const greetT = animGreet ? positiveMod((1 - greetRaw) * 0.68 + 0.22, animGreet.duration) : 0;

    const tendWeight =
      !pose.isWalking && pose.tendingLean
        ? Math.max(0, Math.min(1, pose.tendingLean))
        : 0;
    const tendT = animTend ? positiveMod(timeSec * 0.9 + phaseSeed * 0.2, animTend.duration) : 0;

    const degToRad = Math.PI / 180;

    for (let i = 0; i < boneCount; i++) {
      const b = bones[i];
      if (b.parentIndex < 0) {
        this.wa[i] = 1;
        this.wb[i] = 0;
        this.wc[i] = 0;
        this.wd[i] = 1;
        this.wx[i] = 0;
        this.wy[i] = 0;
        this.cumRot[i] = 0;
        continue;
      }

      const baseIdx = i * 3;
      const setupX = skinSetup ? skinSetup[baseIdx] : b.x;
      const setupY = skinSetup ? skinSetup[baseIdx + 1] : b.y;
      const setupRot = skinSetup ? skinSetup[baseIdx + 2] : b.rotation;

      let dx = 0;
      let dy = 0;
      let dRot = 0;
      let sx = 1;
      let sy = 1;

      if (idleWeight > 0.0001 && animIdle) {
        const tl = animIdle.bonesByIndex[i];
        if (tl) {
          dx += sampleTranslateX(tl.translate, idleT) * idleWeight;
          dy += sampleTranslateY(tl.translate, idleT) * idleWeight;
          dRot += sampleRotate(tl.rotate, idleT) * idleWeight;
          sx += (sampleScaleX(tl.scale, idleT) - 1) * idleWeight;
          sy += (sampleScaleY(tl.scale, idleT) - 1) * idleWeight;
        }
      }

      if (walkWeight > 0.0001 && animWalk) {
        const tl = animWalk.bonesByIndex[i];
        if (tl) {
          dx += sampleTranslateX(tl.translate, walkT) * walkWeight;
          dy += sampleTranslateY(tl.translate, walkT) * walkWeight;
          dRot += sampleRotate(tl.rotate, walkT) * walkWeight;
          sx += (sampleScaleX(tl.scale, walkT) - 1) * walkWeight;
          sy += (sampleScaleY(tl.scale, walkT) - 1) * walkWeight;
        }
      }

      if (greetWeight > 0.001 && animGreet) {
        const tl = animGreet.bonesByIndex[i];
        if (tl) {
          dx += sampleTranslateX(tl.translate, greetT) * greetWeight;
          dy += sampleTranslateY(tl.translate, greetT) * greetWeight;
          const grRot = sampleRotate(tl.rotate, greetT);
          dRot +=
            (b.name === 'arm_front' ? grRot * greetScale : grRot) * greetWeight;
          sx += (sampleScaleX(tl.scale, greetT) - 1) * greetWeight;
          sy += (sampleScaleY(tl.scale, greetT) - 1) * greetWeight;
        }
      }

      if (tendWeight > 0.001 && animTend) {
        const tl = animTend.bonesByIndex[i];
        if (tl) {
          dx += sampleTranslateX(tl.translate, tendT) * tendWeight;
          dy += sampleTranslateY(tl.translate, tendT) * tendWeight;
          dRot += sampleRotate(tl.rotate, tendT) * tendWeight;
          sx += (sampleScaleX(tl.scale, tendT) - 1) * tendWeight;
          sy += (sampleScaleY(tl.scale, tendT) - 1) * tendWeight;
        }
      }

      const pIdx = b.parentIndex;
      const pCumRot = this.cumRot[pIdx];
      if (b.name === 'prop_main') {
        dRot = -pCumRot * propStabilize + dRot * (1 - propStabilize * 0.5);
      }
      this.cumRot[i] = pCumRot + dRot;

      const rad = (setupRot + dRot) * degToRad;
      const cr = Math.cos(rad);
      const sr = Math.sin(rad);
      const la = cr * sx;
      const lb = -sr * sy;
      const lc = sr * sx;
      const ld = cr * sy;

      const lx = setupX + dx;
      const ly = setupY + dy;
      const pa = this.wa[pIdx];
      const pb = this.wb[pIdx];
      const pc = this.wc[pIdx];
      const pd = this.wd[pIdx];

      this.wa[i] = pa * la + pb * lc;
      this.wb[i] = pa * lb + pb * ld;
      this.wc[i] = pc * la + pd * lc;
      this.wd[i] = pc * lb + pd * ld;
      this.wx[i] = pa * lx + pb * ly + this.wx[pIdx];
      this.wy[i] = pc * lx + pd * ly + this.wy[pIdx];
    }
    this.lastEvaluatedCount = boneCount;

    const slots = skel.slots;
    let qIdx = 0;
    for (let s = 0; s < slots.length && qIdx < MAX_SPINE_QUADS; s++) {
      const slot = slots[s];
      const att = skin.get(slot.name);
      if (!att || !att.region) continue;

      const bi = slot.boneIndex;
      if (bi < 0 || bi >= boneCount) continue;

      const ma = this.wa[bi];
      const mb = this.wb[bi];
      const mc = this.wc[bi];
      const md = this.wd[bi];
      const mx = this.wx[bi];
      const my = this.wy[bi];

      const ar = att.rotation * degToRad;
      const ca = Math.cos(ar);
      const sa = Math.sin(ar);
      const hw = att.width * 0.5;
      const hh = att.height * 0.5;
      const ax = att.x;
      const ay = att.y;

      // Corner vectors from attachment center in bone-local coords:
      // (+-) hw along ca/sa and (+-) hh along -sa/ca
      const uAx = ca * hw;
      const uAy = sa * hw;
      const vAx = -sa * hh;
      const vAy = ca * hh;

      // Top-left (-hw, +hh)
      const b0x = ax - uAx + vAx;
      const b0y = ay - uAy + vAy;
      const sp0x = ma * b0x + mb * b0y + mx;
      const sp0y = mc * b0x + md * b0y + my;

      // Top-right (+hw, +hh)
      const b1x = ax + uAx + vAx;
      const b1y = ay + uAy + vAy;
      const sp1x = ma * b1x + mb * b1y + mx;
      const sp1y = mc * b1x + md * b1y + my;

      // Bottom-right (+hw, -hh)
      const b2x = ax + uAx - vAx;
      const b2y = ay + uAy - vAy;
      const sp2x = ma * b2x + mb * b2y + mx;
      const sp2y = mc * b2x + md * b2y + my;

      // Bottom-left (-hw, -hh)
      const b3x = ax - uAx - vAx;
      const b3y = ay - uAy - vAy;
      const sp3x = ma * b3x + mb * b3y + mx;
      const sp3y = mc * b3x + md * b3y + my;

      const base = qIdx * SPINE_QUAD_STRIDE;
      this.quads[base] = pose.wx + dir * sp0x * scale;
      this.quads[base + 1] = pose.wy - sp0y * scale;
      this.quads[base + 2] = pose.wx + dir * sp1x * scale;
      this.quads[base + 3] = pose.wy - sp1y * scale;
      this.quads[base + 4] = pose.wx + dir * sp2x * scale;
      this.quads[base + 5] = pose.wy - sp2y * scale;
      this.quads[base + 6] = pose.wx + dir * sp3x * scale;
      this.quads[base + 7] = pose.wy - sp3y * scale;
      this.quads[base + 8] = att.region.u0;
      this.quads[base + 9] = att.region.v0;
      this.quads[base + 10] = att.region.u1;
      this.quads[base + 11] = att.region.v1;
      this.quads[base + 12] = slotShadeFactor(slot.name);
      this.quads[base + 13] = att.emissive;

      const rBase = qIdx * 4;
      this.quadPixelRects[rBase] = att.region.x;
      this.quadPixelRects[rBase + 1] = att.region.y;
      this.quadPixelRects[rBase + 2] = att.region.width;
      this.quadPixelRects[rBase + 3] = att.region.height;

      qIdx++;
    }

    this.quadCount = qIdx;
    return qIdx;
  }

  /**
   * Read the last evaluated world + Spine-local coordinates for a named bone.
   */
  public getBoneWorld(
    skel: SpineSkeletonData,
    pose: SkeletalEntityPose,
    boneName: string
  ): { x: number; y: number; localX: number; localY: number } | null {
    const idx = skel.boneIndexByName.get(boneName);
    if (idx === undefined || idx >= this.lastEvaluatedCount) return null;
    const skinSize = skel.skinSizes.get(pose.villagerId);
    const refH = skinSize ? skinSize[1] : 188;
    const scale = refH > 0 ? pose.drawH / refH : 1;
    const dir = pose.facingLeft || pose.drawW < 0 ? -1 : 1;
    const lx = this.wx[idx];
    const ly = this.wy[idx];
    return {
      x: pose.wx + dir * lx * scale,
      y: pose.wy - ly * scale,
      localX: lx,
      localY: ly,
    };
  }
}

let sharedBundle: SharedVillagerSpineBundle | null = null;

/**
 * Lazy singleton loader for `/game/trang-trai-hang-soc/paintings/spine/villagers.*`.
 * Safe no-op in Node/Vitest environments lacking DOM/fetch.
 */
export function ensureSharedVillagerSpineRuntime(): SharedVillagerSpineBundle {
  if (sharedBundle) return sharedBundle;

  const bundle: SharedVillagerSpineBundle = {
    loading: false,
    ready: false,
    failed: false,
    atlas: null,
    skeleton: null,
    atlasImage: null,
  };
  sharedBundle = bundle;

  if (
    typeof window === 'undefined' ||
    typeof fetch !== 'function' ||
    typeof Image === 'undefined'
  ) {
    return bundle;
  }

  bundle.loading = true;
  let dataDone = false;
  let imgDone = false;
  const finalizeIfReady = () => {
    if (dataDone && imgDone && bundle.atlas && bundle.skeleton && bundle.atlasImage) {
      bundle.ready = true;
      bundle.loading = false;
    }
  };

  Promise.all([
    fetch(SPINE_ATLAS_URL).then((r) => {
      if (!r.ok) throw new Error(`Spine atlas HTTP ${r.status}`);
      return r.text();
    }),
    fetch(SPINE_SKEL_URL).then((r) => {
      if (!r.ok) throw new Error(`Spine skeleton HTTP ${r.status}`);
      return r.json();
    }),
  ])
    .then(([atlasText, skelJson]) => {
      const atlas = parseSpineTextureAtlas(atlasText);
      const skeleton = parseSpineSkeletonJson(skelJson, atlas);
      bundle.atlas = atlas;
      bundle.skeleton = skeleton;
      dataDone = true;
      finalizeIfReady();
    })
    .catch(() => {
      bundle.failed = true;
      bundle.loading = false;
    });

  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    if (img.naturalWidth > 0) {
      bundle.atlasImage = img;
      imgDone = true;
      finalizeIfReady();
    } else {
      bundle.failed = true;
      bundle.loading = false;
    }
  };
  img.onerror = () => {
    bundle.failed = true;
    bundle.loading = false;
  };
  img.src = SPINE_WEBP_URL;

  return bundle;
}
