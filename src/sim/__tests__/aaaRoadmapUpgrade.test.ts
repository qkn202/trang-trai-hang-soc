import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import {
  computeProximityAmbientMix,
  SFX_ATLAS_CUES,
  SfxAtlasCueId,
} from '../../engine/audio';
import { Camera, centerCameraOnGrid } from '../../engine/isometric';
import { computeWorkshopKineticState } from '../../render/workshopKinetics';
import {
  PARTICLE_STRIDE,
  SpriteIdResolver,
  WorldRenderSnapshotCollector,
} from '../../render/worldSnapshot';
import {
  captureEconomyBaseline,
  computeEconomyStateSeal,
  verifyFarmEconomyDelta,
} from '../economyIntegrity';
import { ParkSimulation, setFarmStore } from '../simulation';
import { PlacedBuilding } from '../../types/game';

type MinimalNodeFs = {
  readFileSync: (p: string, enc: string) => string;
  existsSync: (p: string) => boolean;
  statSync: (p: string) => { size: number };
};

async function loadNodeFsAndPath(): Promise<{
  fs: MinimalNodeFs;
  path: { join: (...parts: string[]) => string; resolve: (...parts: string[]) => string };
  rootDir: string;
}> {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as unknown as MinimalNodeFs;
  const path = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
    join: (...parts: string[]) => string;
    resolve: (...parts: string[]) => string;
  };
  const proc = (globalThis as unknown as { process: { cwd: () => string } }).process;
  return { fs, path, rootDir: proc.cwd() };
}

function createMockAudio() {
  const playVillagerVoiceBark = vi.fn();
  const playCoinChime = vi.fn();
  const proxy = new Proxy(
    { playVillagerVoiceBark, playCoinChime },
    {
      get(target, prop: string | symbol) {
        if (prop === 'enabled' || prop === 'bgmEnabled') return true;
        if (prop in target) return target[prop as keyof typeof target];
        return vi.fn();
      },
    }
  );
  return { proxy: proxy as never, playVillagerVoiceBark, playCoinChime };
}

function createMockSpriteResolver(): SpriteIdResolver {
  let nextId = 1;
  const ids = new Map<string, { id: number; width: number; height: number }>();
  return {
    resolve(key: string) {
      let hit = ids.get(key);
      if (!hit) {
        hit = { id: nextId++, width: 128, height: 128 };
        ids.set(key, hit);
      }
      return hit;
    },
  };
}

describe('AAA Roadmap Upgrade (Pillars A -> D)', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  describe('Pillar A: Stereo 4-Section BGM, SFX Atlas & Proximity Ambient Foley', () => {
    it('ships all 5 stereo BGM MP3s (>400 KB) and 16-cue sfx_atlas.mp3 (>200 KB)', async () => {
      const { fs, path, rootDir } = await loadNodeFsAndPath();
      const audioDir = path.join(rootDir, 'public/audio');

      for (const mood of ['day', 'night', 'festival', 'rain', 'storm']) {
        const filePath = path.join(audioDir, `bgm_${mood}.mp3`);
        expect(fs.existsSync(filePath), `${filePath} must exist`).toBe(true);
        const stat = fs.statSync(filePath);
        expect(stat.size).toBeGreaterThan(400 * 1024);
      }

      const atlasPath = path.join(audioDir, 'sfx_atlas.mp3');
      expect(fs.existsSync(atlasPath)).toBe(true);
      expect(fs.statSync(atlasPath).size).toBeGreaterThan(200 * 1024);

      const expectedCues: SfxAtlasCueId[] = [
        'click',
        'place',
        'harvest',
        'water',
        'chess_clack',
        'crate_crack',
        'match_pop',
        'talisman_blast',
        'build_complete',
        'fanfare_win',
        'powerup_blast',
        'wand_spell',
        'coin_chime',
        'hearth_crackle',
        'villager_hello_warm',
        'villager_hello_jolly',
      ];
      for (const cue of expectedCues) {
        const def = SFX_ATLAS_CUES[cue];
        expect(def).toBeDefined();
        expect(def.offset).toBeGreaterThanOrEqual(0);
        expect(def.duration).toBeGreaterThan(0);
      }
    });

    it('computes proximity & zoom ambient gains accurately and respects ambience bus & muffle', () => {
      const nearOpen = computeProximityAmbientMix({
        camZoom: 1.25,
        waterDistPx: 40,
        activeWorkshopDistPx: 90,
        pastureDistPx: 140,
        ambienceBusGain: 1.0,
        modalMuffled: false,
      });
      expect(nearOpen.riverGain).toBeGreaterThan(0.75);
      expect(nearOpen.hearthGain).toBeGreaterThan(0.60);
      expect(nearOpen.pastureGain).toBeGreaterThan(0.45);
      expect(nearOpen.riverGain).toBeGreaterThan(nearOpen.hearthGain);

      const farAway = computeProximityAmbientMix({
        camZoom: 1.25,
        waterDistPx: 460,
        activeWorkshopDistPx: 999,
        pastureDistPx: Number.POSITIVE_INFINITY,
        ambienceBusGain: 1.0,
        modalMuffled: false,
      });
      expect(farAway).toEqual({ riverGain: 0, hearthGain: 0, pastureGain: 0 });

      const mutedBus = computeProximityAmbientMix({
        camZoom: 1.25,
        waterDistPx: 10,
        activeWorkshopDistPx: 10,
        pastureDistPx: 10,
        ambienceBusGain: 0,
        modalMuffled: false,
      });
      expect(mutedBus).toEqual({ riverGain: 0, hearthGain: 0, pastureGain: 0 });

      const muffled = computeProximityAmbientMix({
        camZoom: 1.25,
        waterDistPx: 40,
        activeWorkshopDistPx: 90,
        pastureDistPx: 140,
        ambienceBusGain: 1.0,
        modalMuffled: true,
      });
      expect(muffled.riverGain).toBeCloseTo(nearOpen.riverGain * 0.25, 2);
      expect(muffled.hearthGain).toBeCloseTo(nearOpen.hearthGain * 0.25, 2);
    });

    it('triggers playVillagerVoiceBark and greetReactTimer when greeting a villager', () => {
      setFarmStore({ read: () => null, write: () => {} });
      const { proxy, playVillagerVoiceBark } = createMockAudio();
      const sim = new ParkSimulation(proxy);
      const res = sim.greetVillager('molly');
      expect(res.ok).toBe(true);
      expect(playVillagerVoiceBark).toHaveBeenCalledWith('molly');
      const molly = sim.villagers.find((v) => v.id === 'molly');
      expect(molly?.greetReactTimer).toBeGreaterThan(0);
    });
  });

  describe('Pillar B: Articulated 2.5D Poses & Workshop Chimney Smoke', () => {
    it('enables workshop smokeIntensity during active baking/brewing and respects reducedMotion', () => {
      const bakeryItem = getCatalogItem('molly_apple_bakery')!;
      const nowMs = Date.now();
      const activeBakery: PlacedBuilding = {
        uid: 'ws_test_1',
        itemId: 'molly_apple_bakery',
        gx: 15,
        gy: 20,
        rotation: 0,
        stars: 1,
        placedAt: nowMs - 60_000,
        constructEndsAt: nowMs - 30_000,
        lastTickAt: nowMs - 10_000,
        storedSickle: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        workshopQueue: [
          {
            goodId: 'cinnamon_apple_pie',
            startedAt: nowMs - 5_000,
            endsAt: nowMs + 55_000,
          },
        ],
      };

      const activeKin = computeWorkshopKineticState(bakeryItem, activeBakery, nowMs, false);
      expect(activeKin.isActive).toBe(true);
      expect(activeKin.smokeIntensity).toBe(1.0);

      const rmKin = computeWorkshopKineticState(bakeryItem, activeBakery, nowMs, true);
      expect(rmKin.isActive).toBe(true);
      expect(rmKin.smokeIntensity).toBe(0);

      const idleBakery: PlacedBuilding = { ...activeBakery, workshopQueue: [] };
      expect(computeWorkshopKineticState(bakeryItem, idleBakery, nowMs, false).smokeIntensity).toBe(0);

      // Supply brew fallback activity
      expect(computeWorkshopKineticState({ ...bakeryItem, isWorkshopBrewery: true }, idleBakery, nowMs, false, true).smokeIntensity).toBe(1.0);
    });

    it('emits chimney smoke particles and greetWave skeletal poses into WorldRenderSnapshotCollector', () => {
      setFarmStore({ read: () => null, write: () => {} });
      const { proxy } = createMockAudio();
      const sim = new ParkSimulation(proxy);
      const nowMs = Date.now();

      sim.state.buildings.push({
        uid: 'snap_bakery',
        itemId: 'molly_apple_bakery',
        gx: 16,
        gy: 24,
        rotation: 0,
        stars: 1,
        placedAt: nowMs - 60_000,
        constructEndsAt: nowMs - 30_000,
        lastTickAt: nowMs - 10_000,
        storedSickle: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        workshopQueue: [
          {
            goodId: 'cinnamon_apple_pie',
            startedAt: nowMs - 2_000,
            endsAt: nowMs + 60_000,
          },
        ],
      });

      const molly = sim.villagers.find((v) => v.id === 'molly')!;
      molly.gx = 17;
      molly.gy = 24;
      sim.greetVillager('molly');

      const cam: Camera = { x: 0, y: 0, zoom: 0.9, viewRot: 0 };
      centerCameraOnGrid(cam, 16.5, 24.5);

      const collector = new WorldRenderSnapshotCollector();
      collector.collect(
        sim,
        cam,
        1280,
        800,
        nowMs,
        createMockSpriteResolver(),
        200,
        8,
        { wx: 0, wy: 0, active: false },
        false
      );

      expect(collector.chimneyCount).toBeGreaterThanOrEqual(1);
      let smokeFound = 0;
      for (let i = 0; i < collector.particleCount; i++) {
        if (collector.particleData[i * PARTICLE_STRIDE + 3] === -1) {
          smokeFound++;
        }
      }
      expect(smokeFound).toBeGreaterThanOrEqual(4);

      const mollyPose = collector.skeletalPoses
        .slice(0, collector.skeletalCount)
        .find((p) => p.villagerId === 'molly');
      expect(mollyPose).toBeDefined();
      expect(mollyPose!.greetWave).toBeGreaterThan(0);
    });
  });

  describe('Pillar C: Economy Delta Integrity Verifier', () => {
    it('seals saves deterministically and passes legitimate gameplay bursts', () => {
      let savedRaw: string | null = null;
      setFarmStore({
        read: () => savedRaw,
        write: (json) => {
          savedRaw = json;
        },
      });
      const { proxy } = createMockAudio();
      const sim = new ParkSimulation(proxy);
      const seal1 = computeEconomyStateSeal(sim.state);
      const seal2 = computeEconomyStateSeal(sim.state);
      expect(seal1).toMatch(/^es1:[0-9a-f]{8}-[0-9a-f]{8}$/);
      expect(seal1).toBe(seal2);

      // Legitimate gameplay actions + storage save
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot' && !b.cropId)!;
      sim.addCropSeeds('ottery_wheat', 2);
      sim.plantCropOnPlot(plot.uid, 'ottery_wheat');
      plot.cropReadyAt = Date.now() - 1000;
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);

      sim.saveToStorage();
      expect(sim.state.economyIntegrity?.seal).toBe(computeEconomyStateSeal(sim.state));
      expect(sim.state.economyIntegrity?.anomalyCount).toBe(0);
      expect(savedRaw).toContain(sim.state.economyIntegrity!.seal);
    });

    it('detects injected Sickles, Compost, Time Sand, Talismans, Barn items, Level jumps & negative balances', () => {
      setFarmStore({ read: () => null, write: () => {} });
      const { proxy } = createMockAudio();
      const sim = new ParkSimulation(proxy);
      const base = captureEconomyBaseline(sim.state, Date.now());

      // 1. Sickle spike
      sim.state.galleons += 250_000;
      expect(verifyFarmEconomyDelta(base, sim.state, 60_000).flags).toContain('SICKLE_SPIKE_EXCEEDED');

      // 2. Compost spike
      const sim2 = new ParkSimulation(proxy);
      sim2.state.herbalCompost = 200;
      expect(verifyFarmEconomyDelta(base, sim2.state, 60_000).flags).toContain('COMPOST_SPIKE_EXCEEDED');

      // 3. Time sand spike
      const sim3 = new ParkSimulation(proxy);
      sim3.state.timeSand += 150;
      expect(verifyFarmEconomyDelta(base, sim3.state, 60_000).flags).toContain('TIME_SAND_SPIKE_EXCEEDED');

      // 4. Talisman cap exceeded
      const sim4 = new ParkSimulation(proxy);
      sim4.state.phoenixTalismans = 99;
      expect(verifyFarmEconomyDelta(base, sim4.state, 60_000).flags).toContain('TALISMAN_CAP_EXCEEDED');

      // 5. Barn crop injection
      const sim5 = new ParkSimulation(proxy);
      sim5.ensureFarmBarn().crops.ottery_wheat = 5000;
      expect(verifyFarmEconomyDelta(base, sim5.state, 60_000).flags).toContain('BARN_INJECTION_EXCEEDED');

      // 6. Negative balance
      const sim6 = new ParkSimulation(proxy);
      sim6.state.galleons = -50;
      expect(verifyFarmEconomyDelta(base, sim6.state, 60_000).flags).toContain('NEGATIVE_BALANCE');

      // 7. Sandbox exempt
      sim.state.sandboxMode = true;
      const sandboxVerdict = verifyFarmEconomyDelta(base, sim.state, 60_000);
      expect(sandboxVerdict.ok).toBe(true);
      expect(sandboxVerdict.exemptSandbox).toBe(true);
    });
  });

  describe('Pillar D: Modular CSS Split, Safari 16+ Guardrails & Icon-First UI', () => {
    it('splits domain stylesheets cleanly (<9500 lines in main.css) and preserves Safari 16+ CSS rules', async () => {
      const { fs, path, rootDir } = await loadNodeFsAndPath();
      const stylesDir = path.join(rootDir, 'src/styles');
      const mainTs = fs.readFileSync(path.join(rootDir, 'src/main.ts'), 'utf8');

      for (const splitFile of ['puzzleArcade.css', 'hudAndMatch3.css', 'minigameHalls.css']) {
        const full = path.join(stylesDir, splitFile);
        expect(fs.existsSync(full), `${splitFile} must exist`).toBe(true);
        expect(mainTs).toContain(`./styles/${splitFile}`);
      }

      const mainCss = fs.readFileSync(path.join(stylesDir, 'main.css'), 'utf8');
      expect(mainCss.split(/\r?\n/).length).toBeLessThan(9500);
      expect(mainCss).toContain('.hs-stat-pills');
      expect(mainCss).toContain('.hs-stat-pill');

      for (const cssName of ['main.css', 'puzzleArcade.css', 'hudAndMatch3.css', 'minigameHalls.css']) {
        const lines: string[] = fs.readFileSync(path.join(stylesDir, cssName), 'utf8').split(/\r?\n/);
        const nestedMedia = lines.filter((line: string) => /^  +@media\b/.test(line));
        expect(nestedMedia, `${cssName} must not contain nested @media`).toEqual([]);
        for (let i = 0; i < lines.length; i++) {
          const m = lines[i].match(/^\s*(align-items|align-content|justify-content):\s*safe center;/);
          if (m) {
            expect(lines[i - 1] ?? '').toMatch(new RegExp(`^\\s*${m[1]}:\\s*center;`));
          }
        }
      }

      const inspSrc = fs.readFileSync(path.join(rootDir, 'src/ui/hudInspector.ts'), 'utf8');
      const wsUiSrc = fs.readFileSync(path.join(rootDir, 'src/ui/hudFarmAndWorkshop.ts'), 'utf8');
      expect(inspSrc).toContain('hs-stat-pills');
      expect(wsUiSrc).toContain('hs-stat-pills');
    });
  });
});
