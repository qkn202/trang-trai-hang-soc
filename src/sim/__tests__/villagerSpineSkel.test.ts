import { describe, expect, it } from 'vitest';
import { VALLEY_VILLAGER_PROFILES } from '../simulationData';
import type { SkeletalEntityPose } from '../../render/spine/spineAdapter';
import {
  parseSpineSkeletonJson,
  parseSpineTextureAtlas,
  SPINE_ATLAS_URL,
  SPINE_QUAD_STRIDE,
  SPINE_SKEL_URL,
  SPINE_WEBP_URL,
  SpinePoseEvaluator,
} from '../../render/spine/spineSkeletonRuntime';

type MinimalNodeFs = {
  readFileSync: {
    (p: string, enc: string): string;
    (p: string): Uint8Array;
  };
  existsSync: (p: string) => boolean;
};

async function loadSpinePaths() {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as unknown as MinimalNodeFs;
  const path = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
    join: (...parts: string[]) => string;
    resolve: (...parts: string[]) => string;
  };
  const proc = (globalThis as unknown as { process: { cwd: () => string } }).process;
  const rootDir = path.resolve(proc.cwd());
  const spineDir = path.join(rootDir, 'public/paintings/spine');
  return {
    fs,
    atlasPath: path.join(spineDir, 'villagers.atlas'),
    skelPath: path.join(spineDir, 'villagers.skel.json'),
    webpPath: path.join(spineDir, 'villagers_atlas.webp'),
  };
}

function makePose(overrides: Partial<SkeletalEntityPose> = {}): SkeletalEntityPose {
  return {
    villagerId: 'molly',
    wx: 200,
    wy: 300,
    drawW: 30,
    drawH: 52,
    spriteId: 0,
    walkPhase: 0,
    isWalking: false,
    facingLeft: false,
    alpha: 1,
    greetWave: 0,
    tendingLean: 0,
    phaseSeed: 0,
    ...overrides,
  };
}

async function loadParsedSpine() {
  const { fs, atlasPath, skelPath } = await loadSpinePaths();
  const atlasText = fs.readFileSync(atlasPath, 'utf8');
  const skelJson = JSON.parse(fs.readFileSync(skelPath, 'utf8')) as unknown;
  const atlas = parseSpineTextureAtlas(atlasText);
  const skel = parseSpineSkeletonJson(skelJson, atlas);
  return { atlas, skel };
}

function getActiveSlotQuadIndex(
  skel: ReturnType<typeof parseSpineSkeletonJson>,
  villagerId: SkeletalEntityPose['villagerId'],
  slotName: string
): number {
  const skin = skel.skins.get(villagerId);
  if (!skin) return -1;
  let q = 0;
  for (const slot of skel.slots) {
    const att = skin.get(slot.name);
    if (!att || !att.region) continue;
    if (slot.name === slotName) return q;
    q++;
  }
  return -1;
}

describe('Multi-part Villager Spine 2D Skeleton & Forward Kinematics', () => {
  it('ships valid Spine 4.1 assets under HPVN /game/trang-trai-hang-soc/ & 150 KB budget', async () => {
    expect(SPINE_SKEL_URL).toBe('/game/trang-trai-hang-soc/paintings/spine/villagers.skel.json');
    expect(SPINE_ATLAS_URL).toBe('/game/trang-trai-hang-soc/paintings/spine/villagers.atlas');
    expect(SPINE_WEBP_URL).toBe('/game/trang-trai-hang-soc/paintings/spine/villagers_atlas.webp');

    const { fs, atlasPath, skelPath, webpPath } = await loadSpinePaths();
    expect(fs.existsSync(atlasPath)).toBe(true);
    expect(fs.existsSync(skelPath)).toBe(true);
    expect(fs.existsSync(webpPath)).toBe(true);

    const webpBuf = fs.readFileSync(webpPath);
    expect(webpBuf.byteLength).toBeGreaterThan(1024);
    expect(webpBuf.byteLength).toBeLessThanOrEqual(150 * 1024);
    const riffTag = String.fromCharCode(webpBuf[0], webpBuf[1], webpBuf[2], webpBuf[3]);
    const webpTag = String.fromCharCode(webpBuf[8], webpBuf[9], webpBuf[10], webpBuf[11]);
    expect(riffTag).toBe('RIFF');
    expect(webpTag).toBe('WEBP');
  });

  it('parses 11 bones, 9 slots, 4 animations, and all 6 villager skins with valid UV regions', async () => {
    const { atlas, skel } = await loadParsedSpine();
    expect(atlas.width).toBeGreaterThan(0);
    expect(atlas.height).toBeGreaterThan(0);
    expect(skel.bones.length).toBe(11);
    expect(skel.slots.length).toBe(9);
    expect([...skel.animations.keys()].sort()).toEqual(['greet', 'idle', 'tend', 'walk']);

    for (const profile of VALLEY_VILLAGER_PROFILES) {
      const skin = skel.skins.get(profile.id);
      expect(skin, `Missing skin for ${profile.id}`).toBeDefined();
      expect(skin!.size).toBeGreaterThanOrEqual(7);
      for (const [, att] of skin!) {
        expect(att.region, `Missing atlas region ${att.regionName}`).not.toBeNull();
        const r = att.region!;
        expect(r.u0).toBeGreaterThanOrEqual(0);
        expect(r.u1).toBeLessThanOrEqual(1);
        expect(r.u1).toBeGreaterThan(r.u0);
        expect(r.v0).toBeGreaterThanOrEqual(0);
        expect(r.v1).toBeLessThanOrEqual(1);
        expect(r.v1).toBeGreaterThan(r.v0);
      }
    }
  });

  it('evaluates opposite leg stride & alternating foot lift across walk phases', async () => {
    const { skel } = await loadParsedSpine();
    const evaluator = new SpinePoseEvaluator();

    // Foot vertical lift peaks at walkT=0.25 (walkPhase = PI/2) for leg_l and walkT=0.75 (3*PI/2) for leg_r
    evaluator.evaluate(skel, makePose({ villagerId: 'arthur', isWalking: true, walkPhase: Math.PI * 0.5 }), 0);
    const lLiftA = evaluator.getBoneWorld(skel, makePose({ villagerId: 'arthur' }), 'leg_l')!;
    const rLiftA = evaluator.getBoneWorld(skel, makePose({ villagerId: 'arthur' }), 'leg_r')!;

    evaluator.evaluate(skel, makePose({ villagerId: 'arthur', isWalking: true, walkPhase: Math.PI * 1.5 }), 0);
    const lLiftB = evaluator.getBoneWorld(skel, makePose({ villagerId: 'arthur' }), 'leg_l')!;
    const rLiftB = evaluator.getBoneWorld(skel, makePose({ villagerId: 'arthur' }), 'leg_r')!;

    expect(lLiftA.localY).toBeGreaterThan(lLiftB.localY + 2);
    expect(rLiftB.localY).toBeGreaterThan(rLiftA.localY + 2);

    // Leg quad center X swaps between stride extreme A (walkPhase = 0) and extreme B (walkPhase = PI)
    const legLQ = getActiveSlotQuadIndex(skel, 'arthur', 'leg_l');
    const legRQ = getActiveSlotQuadIndex(skel, 'arthur', 'leg_r');
    expect(legLQ).toBeGreaterThanOrEqual(0);
    expect(legRQ).toBeGreaterThanOrEqual(0);

    const stridePoseA = makePose({ villagerId: 'arthur', isWalking: true, walkPhase: 0 });
    evaluator.evaluate(skel, stridePoseA, 0);
    const lCxA =
      (evaluator.quads[legLQ * SPINE_QUAD_STRIDE] +
        evaluator.quads[legLQ * SPINE_QUAD_STRIDE + 2] +
        evaluator.quads[legLQ * SPINE_QUAD_STRIDE + 4] +
        evaluator.quads[legLQ * SPINE_QUAD_STRIDE + 6]) *
      0.25;
    const rCxA =
      (evaluator.quads[legRQ * SPINE_QUAD_STRIDE] +
        evaluator.quads[legRQ * SPINE_QUAD_STRIDE + 2] +
        evaluator.quads[legRQ * SPINE_QUAD_STRIDE + 4] +
        evaluator.quads[legRQ * SPINE_QUAD_STRIDE + 6]) *
      0.25;

    const stridePoseB = makePose({ villagerId: 'arthur', isWalking: true, walkPhase: Math.PI });
    evaluator.evaluate(skel, stridePoseB, 0);
    const lCxB =
      (evaluator.quads[legLQ * SPINE_QUAD_STRIDE] +
        evaluator.quads[legLQ * SPINE_QUAD_STRIDE + 2] +
        evaluator.quads[legLQ * SPINE_QUAD_STRIDE + 4] +
        evaluator.quads[legLQ * SPINE_QUAD_STRIDE + 6]) *
      0.25;
    const rCxB =
      (evaluator.quads[legRQ * SPINE_QUAD_STRIDE] +
        evaluator.quads[legRQ * SPINE_QUAD_STRIDE + 2] +
        evaluator.quads[legRQ * SPINE_QUAD_STRIDE + 4] +
        evaluator.quads[legRQ * SPINE_QUAD_STRIDE + 6]) *
      0.25;

    // leg_l and leg_r swing in opposite directions across half-stride
    expect((lCxA - lCxB) * (rCxA - rCxB)).toBeLessThan(0);
  });

  it('produces energetic greet hop, Hagrid glowing lantern, upright Molly pie, and symmetric mirror flip', async () => {
    const { skel } = await loadParsedSpine();
    const evaluator = new SpinePoseEvaluator();

    // Cheerful greet hop lifts hip & arms
    const idlePose = makePose({ villagerId: 'ginny', greetWave: 0 });
    evaluator.evaluate(skel, idlePose, 0);
    const hipIdle = evaluator.getBoneWorld(skel, idlePose, 'hip')!;

    const greetPose = makePose({ villagerId: 'ginny', greetWave: 1 });
    evaluator.evaluate(skel, greetPose, 0);
    const hipGreet = evaluator.getBoneWorld(skel, greetPose, 'hip')!;
    expect(hipGreet.localY).toBeGreaterThan(hipIdle.localY + 5);

    // Hagrid lantern slot has high emissive factor and swings cleanly
    const hagridPose = makePose({
      villagerId: 'hagrid',
      drawW: 48,
      drawH: 62,
      isWalking: true,
      walkPhase: 0.4,
    });
    const hagridQuads = evaluator.evaluate(skel, hagridPose, 0);
    expect(hagridQuads).toBeGreaterThanOrEqual(7);
    const hagridPropQ = getActiveSlotQuadIndex(skel, 'hagrid', 'prop_main');
    expect(hagridPropQ).toBeGreaterThanOrEqual(0);
    expect(evaluator.quads[hagridPropQ * SPINE_QUAD_STRIDE + 13]).toBeGreaterThan(0.9);

    // Molly's pie stays stabilized upright during greet cheer (top edge above bottom edge in Y-down screen coords)
    const mollyCheer = makePose({ villagerId: 'molly', greetWave: 1 });
    evaluator.evaluate(skel, mollyCheer, 0);
    const mollyPropQ = getActiveSlotQuadIndex(skel, 'molly', 'prop_main');
    const qb = mollyPropQ * SPINE_QUAD_STRIDE;
    const topMidY = (evaluator.quads[qb + 1] + evaluator.quads[qb + 3]) * 0.5;
    const botMidY = (evaluator.quads[qb + 5] + evaluator.quads[qb + 7]) * 0.5;
    expect(topMidY).toBeLessThan(botMidY);

    // FacingLeft mirrors quad X around pose.wx symmetrically
    const rightPose = makePose({ villagerId: 'hermione', wx: 150, facingLeft: false });
    const countR = evaluator.evaluate(skel, rightPose, 0.5);
    const rightFirstX = evaluator.quads[0];
    const leftPose = makePose({ villagerId: 'hermione', wx: 150, facingLeft: true });
    const countL = evaluator.evaluate(skel, leftPose, 0.5);
    const leftFirstX = evaluator.quads[0];

    expect(countR).toBe(countL);
    expect(leftFirstX - 150).toBeCloseTo(-(rightFirstX - 150), 4);
  });
});
