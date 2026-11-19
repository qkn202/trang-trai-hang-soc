// Track B5: Single Skeletal Animation Standard — Spine 2D Slot Adapter (`@esotericsoftware/spine-pixi-v8` + Articulated 2.5D GPU Rig).
// - Iron Law #3: Designed specifically for Range-Sliced `IsoSceneSortedPass` interleaving:
//     flushSceneRange(0, k) -> spineAdapter.renderSlot(...) -> flushSceneRange(k + 1, N)
//   so characters walk seamlessly BEHIND fences/roofs in front of them and IN FRONT OF ground/crops behind them!
// - Zero Rive runtime (single bone pipeline = Spine 2D).

import { ValleyVillagerId } from '../../types/game';
import {
  ensureSharedVillagerSpineRuntime,
  MAX_SPINE_QUADS,
  SPINE_QUAD_STRIDE,
  SpinePoseEvaluator,
} from './spineSkeletonRuntime';

export interface SkeletalEntityPose {
  villagerId: ValleyVillagerId;
  wx: number;
  wy: number;
  drawW: number;
  drawH: number;
  spriteId: number;
  walkPhase: number;
  isWalking: boolean;
  facingLeft: boolean;
  alpha: number;
  greetWave?: number;
  tendingLean?: number;
  phaseSeed?: number;
}

export interface RangeSliceSegment {
  kind: 'instanced_range' | 'skeletal_slot';
  firstInstance: number;
  instanceCount: number;
  skeletalSlotIndex: number;
}

/**
 * Pure deterministic planner for Iron Law #3:
 * Splits `[0 .. totalInstances)` around sorted skeletal indices `skeletalSortedIndices[0..skeletalCount)`
 * into an ordered sequence of GPU draw slices with ZERO dynamic object allocation in Steady State.
 */
export function buildIsoSceneRangeSlices(
  totalInstances: number,
  skeletalSortedIndices: Int32Array,
  skeletalCount: number,
  outSlices: RangeSliceSegment[]
): number {
  let sliceLen = 0;
  const pushSlice = (
    kind: 'instanced_range' | 'skeletal_slot',
    firstInstance: number,
    instanceCount: number,
    skeletalSlotIndex: number
  ): void => {
    if (sliceLen < outSlices.length) {
      const s = outSlices[sliceLen];
      s.kind = kind;
      s.firstInstance = firstInstance;
      s.instanceCount = instanceCount;
      s.skeletalSlotIndex = skeletalSlotIndex;
    } else {
      outSlices.push({ kind, firstInstance, instanceCount, skeletalSlotIndex });
    }
    sliceLen++;
  };

  if (totalInstances <= 0) return 0;
  if (skeletalCount <= 0) {
    pushSlice('instanced_range', 0, totalInstances, -1);
    return sliceLen;
  }

  let cursor = 0;
  for (let k = 0; k < skeletalCount; k++) {
    const slotInstanceIdx = skeletalSortedIndices[k];
    if (slotInstanceIdx < cursor || slotInstanceIdx >= totalInstances) continue;
    if (slotInstanceIdx > cursor) {
      pushSlice('instanced_range', cursor, slotInstanceIdx - cursor, -1);
    }
    pushSlice('skeletal_slot', slotInstanceIdx, 1, k);
    cursor = slotInstanceIdx + 1;
  }
  if (cursor < totalInstances) {
    pushSlice('instanced_range', cursor, totalInstances - cursor, -1);
  }
  return sliceLen;
}

const PUPPET_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aLocal; // x in [-0.5..0.5], y in [0..1] (0 = feet, 1 = crown)

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform vec4 uPoseRect;    // (wx, wy, signedDrawW, drawH)
uniform vec4 uBoneParams;  // (timeSec, walkPhase, isWalking, spriteId)
uniform vec4 uPoseExtra;   // (greetWave, tendingLean, phaseSeed, 0.0)

out vec2 vLocalUv;
out float vSpriteId;
out float vShade;

void main() {
  float h = aLocal.y; // 0 feet -> 1 head
  float t = uBoneParams.x;
  float phase = uBoneParams.y;
  float walking = uBoneParams.z;
  float greetWave = uPoseExtra.x;
  float tendingLean = uPoseExtra.y;
  float pSeed = uPoseExtra.z;

  // 5-Zone Anatomical 2.5D Rig (8x10 grid): L/R Alternating Feet, Hip Bob, Counter Arms, Torso Breath, Greet Wave & Tending Nod
  float idleMask = 1.0 - walking;
  float upperWeight = smoothstep(0.35, 0.72, h);
  float breath = sin(t * 2.4 + pSeed) * (0.4 + 0.75 * idleMask);
  float chestIdleWave = sin(t * 2.4 + pSeed) * 1.15 * idleMask * upperWeight;
  float hipBob = abs(sin(phase)) * 2.4 * walking * smoothstep(0.05, 0.35, h);
  float greetHop = abs(sin(t * 8.5)) * 4.5 * greetWave * smoothstep(0.05, 0.35, h);

  // Zone 1 & 2: Left vs Right foot alternating stride + vertical lift
  float legWeight = 1.0 - smoothstep(0.08, 0.30, h);
  float sideSign = clamp(aLocal.x * 6.0, -1.0, 1.0);
  float legSwing = sin(phase) * sideSign;
  float footLiftY = max(0.0, legSwing) * 3.2 * walking * legWeight;
  float footStrideX = legSwing * 2.6 * walking * legWeight;

  // Zone 3: Outer arms & cloak sleeves counter-swinging opposite legs + cheerful greet wave
  float armMask =
    smoothstep(0.24, 0.38, h) *
    (1.0 - smoothstep(0.64, 0.76, h)) *
    smoothstep(0.12, 0.28, abs(aLocal.x));
  float headArmMask = max(armMask, smoothstep(0.55, 0.90, h));
  float armSwingX = -sin(phase) * sideSign * 3.0 * walking * armMask;
  float waveOscX = sin(t * 11.0 + pSeed) * 4.2 * greetWave * headArmMask;
  float waveLiftY = max(0.0, sin(t * 11.0 + pSeed)) * 2.4 * greetWave * armMask;
  float tendNodX = sin(t * 3.2 + pSeed) * 1.8 * tendingLean * idleMask * upperWeight;

  // Zone 4 & 5: Torso breath stretch + head/hat follow-through tilt
  float verticalStretch = 1.0 + breath * 0.022 * smoothstep(0.20, 0.95, h);
  float headMask = smoothstep(0.66, 0.92, h);
  float headTiltX = (walking * sin(phase * 1.05 - 0.38) * 2.3 + breath * 0.7) * headMask;

  vec2 deformed = vec2(
    aLocal.x * uPoseRect.z + footStrideX + armSwingX + headTiltX + chestIdleWave + waveOscX + tendNodX,
    -aLocal.y * uPoseRect.w * verticalStretch - hipBob - footLiftY - greetHop - waveLiftY
  );

  vec2 wp = uPoseRect.xy + deformed;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  vLocalUv = vec2(aLocal.x + 0.5, 1.0 - aLocal.y);
  vSpriteId = uBoneParams.w;
  float dirSign = uPoseRect.z < 0.0 ? -1.0 : 1.0;
  float sunRim = clamp(0.5 - aLocal.x * dirSign, 0.0, 1.0) * smoothstep(0.35, 0.95, h);
  vShade = 0.95 + 0.06 * h + 0.05 * sunRim;
}
`;

const PUPPET_FS = `#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 vLocalUv;
in float vSpriteId;
in float vShade;

uniform sampler2DArray uAlbedo;
uniform sampler2D uUvTable;
uniform vec3 uAmbientTint;
uniform float uAlpha;

out vec4 fragColor;

void main() {
  int id = int(vSpriteId + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(id, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(id, 1), 0);
  vec2 uv = mix(uvRect.xy, uvRect.zw, clamp(vLocalUv, vec2(0.0), vec2(1.0)));
  vec4 texel = texture(uAlbedo, vec3(uv, meta.x));
  if (texel.a < 0.015) discard;
  vec3 lit = texel.rgb * uAmbientTint * vShade;
  fragColor = vec4(lit * uAlpha, texel.a * uAlpha);
}
`;

const SKEL_MULTI_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aWorldPos;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec2 aShadeEmissive;

uniform vec3 uCamera;
uniform vec2 uViewport;

out vec2 vUv;
out float vShade;
out float vEmissive;

void main() {
  vec2 sp = uViewport * 0.5 + (aWorldPos - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vUv = aUv;
  vShade = aShadeEmissive.x;
  vEmissive = aShadeEmissive.y;
}
`;

const SKEL_MULTI_FS = `#version 300 es
precision highp float;

in vec2 vUv;
in float vShade;
in float vEmissive;

uniform sampler2D uSpineAtlas;
uniform vec3 uAmbientTint;
uniform float uAlpha;

out vec4 fragColor;

void main() {
  vec4 texel = texture(uSpineAtlas, vUv);
  if (texel.a < 0.012) discard;
  vec3 tint = mix(uAmbientTint * vShade, vec3(1.08, 0.95, 0.74), clamp(vEmissive, 0.0, 1.0));
  fragColor = vec4(texel.rgb * tint * uAlpha, texel.a * uAlpha);
}
`;

function compileProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, fsSrc);
  gl.compileShader(fs);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

/**
 * Articulated Multi-Part Spine 2D Slot Adapter (`.skel.json` + `.atlas` + `.webp`)
 * with instant 8x10 GPU Ribbon Grid fallback while assets load.
 */
export class SpineSlotAdapter {
  private readonly gl: WebGL2RenderingContext;
  private readonly prog: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly vbo: WebGLBuffer;
  private readonly ibo: WebGLBuffer;
  private readonly indexCount: number;
  private readonly uAlbedoLoc: WebGLUniformLocation | null;
  private readonly uUvTableLoc: WebGLUniformLocation | null;
  private readonly uCameraLoc: WebGLUniformLocation | null;
  private readonly uViewportLoc: WebGLUniformLocation | null;
  private readonly uPoseRectLoc: WebGLUniformLocation | null;
  private readonly uBoneParamsLoc: WebGLUniformLocation | null;
  private readonly uPoseExtraLoc: WebGLUniformLocation | null;
  private readonly uAmbientTintLoc: WebGLUniformLocation | null;
  private readonly uAlphaLoc: WebGLUniformLocation | null;

  private readonly spineProg: WebGLProgram;
  private readonly spineVao: WebGLVertexArrayObject;
  private readonly spineVbo: WebGLBuffer;
  private readonly spineIbo: WebGLBuffer;
  private readonly uSpineAtlasLoc: WebGLUniformLocation | null;
  private readonly uSpineCameraLoc: WebGLUniformLocation | null;
  private readonly uSpineViewportLoc: WebGLUniformLocation | null;
  private readonly uSpineAmbientLoc: WebGLUniformLocation | null;
  private readonly uSpineAlphaLoc: WebGLUniformLocation | null;
  private readonly spineVertData = new Float32Array(MAX_SPINE_QUADS * 4 * 6);
  private readonly evaluator = new SpinePoseEvaluator();
  private spineAtlasTex: WebGLTexture | null = null;
  public externalSpineLoaded = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    const prog = compileProgram(gl, PUPPET_VS, PUPPET_FS);
    this.prog = prog;

    this.uAlbedoLoc = gl.getUniformLocation(prog, 'uAlbedo');
    this.uUvTableLoc = gl.getUniformLocation(prog, 'uUvTable');
    this.uCameraLoc = gl.getUniformLocation(prog, 'uCamera');
    this.uViewportLoc = gl.getUniformLocation(prog, 'uViewport');
    this.uPoseRectLoc = gl.getUniformLocation(prog, 'uPoseRect');
    this.uBoneParamsLoc = gl.getUniformLocation(prog, 'uBoneParams');
    this.uPoseExtraLoc = gl.getUniformLocation(prog, 'uPoseExtra');
    this.uAmbientTintLoc = gl.getUniformLocation(prog, 'uAmbientTint');
    this.uAlphaLoc = gl.getUniformLocation(prog, 'uAlpha');

    // Build 8x10 subdivided anatomical ribbon mesh as instant fallback
    const cols = 8;
    const rows = 10;
    const verts: number[] = [];
    const indices: number[] = [];
    for (let r = 0; r <= rows; r++) {
      const y = r / rows;
      for (let c = 0; c <= cols; c++) {
        const x = c / cols - 0.5;
        verts.push(x, y);
      }
    }
    const stride = cols + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i0 = r * stride + c;
        const i1 = i0 + 1;
        const i2 = i0 + stride;
        const i3 = i2 + 1;
        indices.push(i0, i1, i2, i1, i3, i2);
      }
    }
    this.indexCount = indices.length;

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    this.vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.ibo = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    // Multi-part Spine quad shader & dynamic interleaved buffer
    const spineProg = compileProgram(gl, SKEL_MULTI_VS, SKEL_MULTI_FS);
    this.spineProg = spineProg;
    this.uSpineAtlasLoc = gl.getUniformLocation(spineProg, 'uSpineAtlas');
    this.uSpineCameraLoc = gl.getUniformLocation(spineProg, 'uCamera');
    this.uSpineViewportLoc = gl.getUniformLocation(spineProg, 'uViewport');
    this.uSpineAmbientLoc = gl.getUniformLocation(spineProg, 'uAmbientTint');
    this.uSpineAlphaLoc = gl.getUniformLocation(spineProg, 'uAlpha');

    const spineIndices = new Uint16Array(MAX_SPINE_QUADS * 6);
    for (let q = 0; q < MAX_SPINE_QUADS; q++) {
      const vb = q * 4;
      const ib = q * 6;
      spineIndices[ib] = vb;
      spineIndices[ib + 1] = vb + 1;
      spineIndices[ib + 2] = vb + 2;
      spineIndices[ib + 3] = vb;
      spineIndices[ib + 4] = vb + 2;
      spineIndices[ib + 5] = vb + 3;
    }

    this.spineVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.spineVao);
    this.spineVbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.spineVbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.spineVertData.byteLength, gl.DYNAMIC_DRAW);
    const floatBytes = 4;
    const vertStrideBytes = 6 * floatBytes;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, vertStrideBytes, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, vertStrideBytes, 2 * floatBytes);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, vertStrideBytes, 4 * floatBytes);

    this.spineIbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.spineIbo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, spineIndices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    ensureSharedVillagerSpineRuntime();
  }

  private ensureSpineAtlasTexture(img: HTMLImageElement): WebGLTexture {
    if (this.spineAtlasTex) return this.spineAtlasTex;
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.activeTexture(gl.TEXTURE0);
    this.spineAtlasTex = tex;
    this.externalSpineLoaded = true;
    return tex;
  }

  public renderArticulatedSlot(
    pose: SkeletalEntityPose,
    camX: number,
    camY: number,
    camZoom: number,
    cssW: number,
    cssH: number,
    timeSec: number,
    ambient: [number, number, number],
    albedoArrayTex: WebGLTexture,
    uvTableTex: WebGLTexture
  ): void {
    const gl = this.gl;
    const bundle = ensureSharedVillagerSpineRuntime();
    if (bundle.ready && bundle.skeleton && bundle.atlasImage) {
      const quadCount = this.evaluator.evaluate(bundle.skeleton, pose, timeSec);
      if (quadCount > 0) {
        const atlasTex = this.ensureSpineAtlasTexture(bundle.atlasImage);
        const quads = this.evaluator.quads;
        const vbuf = this.spineVertData;
        for (let q = 0; q < quadCount; q++) {
          const qb = q * SPINE_QUAD_STRIDE;
          const vb = q * 24;
          const u0 = quads[qb + 8];
          const v0 = quads[qb + 9];
          const u1 = quads[qb + 10];
          const v1 = quads[qb + 11];
          const shade = quads[qb + 12];
          const emissive = quads[qb + 13];

          vbuf[vb] = quads[qb];
          vbuf[vb + 1] = quads[qb + 1];
          vbuf[vb + 2] = u0;
          vbuf[vb + 3] = v0;
          vbuf[vb + 4] = shade;
          vbuf[vb + 5] = emissive;

          vbuf[vb + 6] = quads[qb + 2];
          vbuf[vb + 7] = quads[qb + 3];
          vbuf[vb + 8] = u1;
          vbuf[vb + 9] = v0;
          vbuf[vb + 10] = shade;
          vbuf[vb + 11] = emissive;

          vbuf[vb + 12] = quads[qb + 4];
          vbuf[vb + 13] = quads[qb + 5];
          vbuf[vb + 14] = u1;
          vbuf[vb + 15] = v1;
          vbuf[vb + 16] = shade;
          vbuf[vb + 17] = emissive;

          vbuf[vb + 18] = quads[qb + 6];
          vbuf[vb + 19] = quads[qb + 7];
          vbuf[vb + 20] = u0;
          vbuf[vb + 21] = v1;
          vbuf[vb + 22] = shade;
          vbuf[vb + 23] = emissive;
        }

        gl.useProgram(this.spineProg);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, atlasTex);
        gl.uniform1i(this.uSpineAtlasLoc, 3);
        gl.uniform3f(this.uSpineCameraLoc, camX, camY, camZoom);
        gl.uniform2f(this.uSpineViewportLoc, cssW, cssH);
        gl.uniform3fv(this.uSpineAmbientLoc, ambient);
        gl.uniform1f(this.uSpineAlphaLoc, pose.alpha);

        gl.bindVertexArray(this.spineVao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spineVbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vbuf.subarray(0, quadCount * 24));
        gl.drawElements(gl.TRIANGLES, quadCount * 6, gl.UNSIGNED_SHORT, 0);
        gl.activeTexture(gl.TEXTURE0);
        return;
      }
    }

    gl.useProgram(this.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, albedoArrayTex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, uvTableTex);

    gl.uniform1i(this.uAlbedoLoc, 0);
    gl.uniform1i(this.uUvTableLoc, 2);
    gl.uniform3f(this.uCameraLoc, camX, camY, camZoom);
    gl.uniform2f(this.uViewportLoc, cssW, cssH);
    gl.uniform4f(
      this.uPoseRectLoc,
      pose.wx,
      pose.wy,
      pose.drawW,
      pose.drawH
    );
    gl.uniform4f(
      this.uBoneParamsLoc,
      timeSec,
      pose.walkPhase,
      pose.isWalking ? 1.0 : 0.0,
      pose.spriteId
    );
    gl.uniform4f(
      this.uPoseExtraLoc,
      pose.greetWave ?? 0,
      pose.tendingLean ?? 0,
      pose.phaseSeed ?? 0,
      0
    );
    gl.uniform3fv(this.uAmbientTintLoc, ambient);
    gl.uniform1f(this.uAlphaLoc, pose.alpha);

    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  public destroy(): void {
    const gl = this.gl;
    gl.deleteProgram(this.prog);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.vbo);
    gl.deleteBuffer(this.ibo);
    gl.deleteProgram(this.spineProg);
    gl.deleteVertexArray(this.spineVao);
    gl.deleteBuffer(this.spineVbo);
    gl.deleteBuffer(this.spineIbo);
    if (this.spineAtlasTex) {
      gl.deleteTexture(this.spineAtlasTex);
      this.spineAtlasTex = null;
    }
  }
}
