import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import {
  BONUS_ARCADE_MAX_SINGLE_RUN_COMBO,
  BONUS_ARCADE_MAX_SINGLE_RUN_SCORE,
  BONUS_ARCADE_MAX_STAGE,
  BONUS_ARCADE_MAX_STAGE_JUMP,
  BONUS_ARCADE_META,
  BONUS_ARCADE_ORDER,
  buildBonusArcadeRunProof,
  completeBonusArcadeVictory,
  consumeBonusArcadeMollySupply,
  ensureBonusArcadeState,
  isBonusArcadeGameId,
  recordBonusArcadeScore,
  resolveBonusArcadeMollySupply,
} from '../bonusArcadeGames';
import { ParkSimulation } from '../simulation';
import { migrateLoadedState } from '../simulationData';
import type { BonusArcadeGameId, FarmItemId } from '../../types/game';

type MinimalNodeFs = {
  readFileSync: (p: string, enc: string) => string;
  existsSync: (p: string) => boolean;
};

async function loadNodeFsAndPath(): Promise<{
  fs: MinimalNodeFs;
  path: { join: (...parts: string[]) => string };
  rootDir: string;
}> {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as unknown as MinimalNodeFs;
  const pathMod = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
    join: (...parts: string[]) => string;
  };
  const proc = (globalThis as unknown as { process: { cwd: () => string } }).process;
  return { fs, path: pathMod, rootDir: proc.cwd() };
}

const storageMap = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => storageMap.get(k) ?? null,
  setItem: (k: string, v: string) => storageMap.set(k, String(v)),
  removeItem: (k: string) => storageMap.delete(k),
  clear: () => storageMap.clear(),
});

function createMockAudio(): MagicalAudio {
  return {
    enabled: true,
    bgmEnabled: true,
    playTone: vi.fn(),
    playSfx: vi.fn(),
    playClick: vi.fn(),
    playSpell: vi.fn(),
    playPlace: vi.fn(),
    playHarvestBubble: vi.fn(),
    playBuildComplete: vi.fn(),
    playLevelUp: vi.fn(),
    playCheekyAlert: vi.fn(),
    playOwlHoot: vi.fn(),
    playMatchPop: vi.fn(),
    playPowerupBlast: vi.fn(),
    playThunder: vi.fn(),
    playCardFound: vi.fn(),
    playCoinChime: vi.fn(),
    playWaterSplash: vi.fn(),
    updateSoundscape: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  } as unknown as MagicalAudio;
}

function createFreshSim(): ParkSimulation {
  const sim = new ParkSimulation(createMockAudio());
  sim.state.sandboxMode = false;
  sim.state.galleons = 2000;
  sim.state.match3.stars = 5;
  sim.state.match3.totalStarsEarned = 5;
  sim.state.herbalCompost = 0;
  sim.state.morningDewPhials = 0;
  const barn = sim.ensureFarmBarn();
  for (const k of Object.keys(barn.crops) as Array<keyof typeof barn.crops>) barn.crops[k] = 0;
  for (const k of Object.keys(barn.goods) as Array<keyof typeof barn.goods>) barn.goods[k] = 0;
  return sim;
}

function addBuildingUnderConstruction(sim: ParkSimulation, now: number, remainingSec = 10_800): string {
  const uid = `bonus_build_${Math.random().toString(36).slice(2, 8)}`;
  sim.state.buildings.push({
    uid,
    itemId: 'burrow_chicken_coop',
    gx: 24,
    gy: 24,
    rotation: 0,
    stars: 1,
    placedAt: now,
    constructEndsAt: now + remainingSec * 1000,
    lastTickAt: now + remainingSec * 1000,
    storedSickle: 0,
    storedXp: 0,
    readyBubbles: 0,
    durability: 100,
    visitorsServed: 0,
  });
  return uid;
}

function attachDerbyObjective(
  sim: ParkSimulation,
  eventKind: 'minigame_win' | 'molly_supply',
  now: number,
  target = 5
) {
  const derby = sim.ensureWeeklyDerby(now);
  const template = derby.boardTasks[0];
  derby.activeTask = {
    ...template,
    acceptedAt: now,
    expiresAt: now + 3_600_000,
    objectives: [
      {
        eventKind,
        labelVi: eventKind === 'minigame_win' ? 'Thắng mini game' : 'Dùng Hộp Tiếp Tế Bà Molly',
        target,
        progress: 0,
      },
    ],
  };
  return derby.activeTask;
}

describe('Bonus Arcade Games (Khảm Ngọc / Hợp Quả / Vườn Thủ)', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  describe('1. completeBonusArcadeVictory — Rewards, Farm Specialties, Derby & runId Deduplication', () => {
    it('awards Stars, Sickle, XP, Harvest Feast, construction reduction, Derby progress, and Workshop + Plug specialty for Block Blast', () => {
      const sim = createFreshSim();
      const now = Date.now();
      const buildUid = addBuildingUnderConstruction(sim, now, 10_800);
      const derbyTask = attachDerbyObjective(sim, 'minigame_win', now, 5);

      // Active bakery workshop queue (1 hour remaining)
      const queueEndsBefore = now + 3600 * 1000;
      sim.state.buildings.push({
        uid: 'bb_bakery_ws',
        itemId: 'molly_apple_bakery',
        gx: 14,
        gy: 14,
        rotation: 0,
        stars: 1,
        placedAt: now - 5000,
        constructEndsAt: 0,
        lastTickAt: now,
        storedSickle: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        workshopQueue: [
          { goodId: 'cinnamon_apple_pie', startedAt: now, endsAt: queueEndsBefore },
        ],
      });

      const starsBefore = sim.state.match3.stars;
      const sickleBefore = sim.state.galleons;
      const xpBefore = sim.state.xp;
      const feastBefore = sim.state.harvestFeast?.points ?? 0;
      const constructBefore = sim.state.buildings.find((b) => b.uid === buildUid)!.constructEndsAt;

      // Win #1: active workshop accelerates >= 25% (min 5m)
      const w1 = sim.completeBonusArcadeVictory('block_blast', {
        stage: 1,
        score: 1600,
        combo: 6,
        isBoss: false,
        runId: 'bb_test_win_1',
      });
      expect(w1.ok).toBe(true);
      expect(w1.starsEarned).toBe(1);
      expect(sim.state.match3.stars).toBe(starsBefore + 1);
      expect(w1.sickleEarned).toBeGreaterThanOrEqual(24);
      expect(sim.state.galleons).toBe(sickleBefore + w1.sickleEarned);
      expect(w1.xpEarned).toBeGreaterThanOrEqual(18);
      expect(sim.state.xp).toBeGreaterThan(xpBefore);
      expect(sim.state.harvestFeast?.points).toBe(feastBefore + 8);
      expect(w1.buildReducedSec).toBeGreaterThanOrEqual(600);
      expect(sim.state.buildings.find((b) => b.uid === buildUid)!.constructEndsAt).toBeLessThan(constructBefore);
      expect(derbyTask.objectives[0].progress).toBe(1);
      expect(w1.specialtySummaryVi).toContain('Ủ');
      const bakeryAfter = sim.state.buildings.find((b) => b.uid === 'bb_bakery_ws')!;
      expect(bakeryAfter.workshopQueue![0].endsAt).toBeLessThanOrEqual(queueEndsBefore - 890_000);
      expect(sim.getFarmItemCount('muggle_plug_kit')).toBe(0);

      // Clear workshop queue -> Win #2 grants fallback +1 fine_wheat_flour
      bakeryAfter.workshopQueue = [];
      const flourBefore = sim.getFarmItemCount('fine_wheat_flour');
      const w2 = completeBonusArcadeVictory(sim, 'block_blast', {
        stage: 2,
        score: 2100,
        combo: 4,
        runId: 'bb_test_win_2',
      });
      expect(w2.ok).toBe(true);
      expect(sim.getFarmItemCount('fine_wheat_flour')).toBe(flourBefore + 1);
      expect(sim.getFarmItemCount('muggle_plug_kit')).toBe(0);
      expect(derbyTask.objectives[0].progress).toBe(2);

      // Win #3 (boss + 3rd win milestone): +2 Stars and +1 muggle_plug_kit!
      const w3 = sim.completeBonusArcadeVictory('block_blast', {
        stage: 3,
        score: 3200,
        combo: 9,
        isBoss: true,
        runId: 'bb_test_win_3',
      });
      expect(w3.ok).toBe(true);
      expect(w3.starsEarned).toBe(2);
      expect(w3.record.winsCount).toBe(3);
      expect(w3.record.unlockedStage).toBe(4);
      expect(sim.getFarmItemCount('muggle_plug_kit')).toBe(1);
      expect(w3.specialtySummaryVi).toContain('Phích Cắm');
      expect(derbyTask.objectives[0].progress).toBe(3);
    });

    it('awards rotating +2 Farm Crops & +1 Herbal Compost specialty plus core rewards for Suika', () => {
      const sim = createFreshSim();
      const now = Date.now();
      addBuildingUnderConstruction(sim, now, 10_800);
      const derbyTask = attachDerbyObjective(sim, 'minigame_win', now, 5);

      const feastBefore = sim.state.harvestFeast?.points ?? 0;
      const starsBefore = sim.state.match3.stars;
      const sickleBefore = sim.state.galleons;

      const s1 = sim.completeBonusArcadeVictory('suika', {
        stage: 1,
        score: 1000,
        combo: 7,
        runId: 'suika_test_m1',
      });
      expect(s1.ok).toBe(true);
      expect(s1.starsEarned).toBe(1);
      expect(sim.state.match3.stars).toBe(starsBefore + 1);
      expect(sim.state.galleons).toBe(sickleBefore + s1.sickleEarned);
      expect(sim.state.harvestFeast?.points).toBe(feastBefore + 8);
      expect(s1.buildReducedSec).toBeGreaterThanOrEqual(600);
      expect(sim.getFarmItemCount('burrow_apple')).toBe(2);
      expect(sim.state.herbalCompost).toBe(1);
      expect(derbyTask.objectives[0].progress).toBe(1);

      const s2 = sim.completeBonusArcadeVictory('suika', {
        stage: 2,
        score: 2500,
        combo: 8,
        runId: 'suika_test_m2',
      });
      expect(s2.ok).toBe(true);
      expect(sim.getFarmItemCount('garden_pumpkin')).toBe(2);
      expect(sim.state.herbalCompost).toBe(2);

      const s3 = sim.completeBonusArcadeVictory('suika', {
        stage: 5,
        score: 8500,
        combo: 10,
        isBoss: true,
        runId: 'suika_test_m5_boss',
      });
      expect(s3.ok).toBe(true);
      expect(s3.starsEarned).toBe(2);
      expect(sim.getFarmItemCount('ruby_strawberry')).toBe(2);
      expect(sim.state.herbalCompost).toBe(3);
      expect(derbyTask.objectives[0].progress).toBe(3);
    });

    it('waters all growing unwatered farmland plots (-30%) & grants +1 Morning Dew specialty for PvZ', () => {
      const sim = createFreshSim();
      const now = Date.now();
      addBuildingUnderConstruction(sim, now, 10_800);
      const derbyTask = attachDerbyObjective(sim, 'minigame_win', now, 5);

      const readyAtBefore = now + 2000 * 1000;
      const plotUids: string[] = [];
      for (let i = 0; i < 2; i++) {
        const uid = `pvz_test_plot_${i}`;
        plotUids.push(uid);
        sim.state.buildings.push({
          uid,
          itemId: 'farmland_plot',
          gx: 16 + i,
          gy: 16,
          rotation: 0,
          stars: 1,
          placedAt: now - 5000,
          constructEndsAt: 0,
          lastTickAt: now,
          storedSickle: 0,
          storedXp: 0,
          readyBubbles: 0,
          durability: 100,
          visitorsServed: 0,
          cropId: 'ottery_wheat',
          cropPlantedAt: now - 10_000,
          cropReadyAt: readyAtBefore,
          cropWateredBoost: false,
        });
      }

      const dewBefore = sim.state.morningDewPhials ?? 0;
      const feastBefore = sim.state.harvestFeast?.points ?? 0;

      const pvzWin = sim.completeBonusArcadeVictory('pvz', {
        stage: 1,
        score: 2400,
        combo: 5,
        isBoss: false,
        runId: 'pvz_test_stage_1',
      });
      expect(pvzWin.ok).toBe(true);
      expect(pvzWin.starsEarned).toBe(1);
      expect(pvzWin.sickleEarned).toBeGreaterThanOrEqual(24);
      expect(pvzWin.xpEarned).toBeGreaterThanOrEqual(18);
      expect(sim.state.harvestFeast?.points).toBe(feastBefore + 8);
      expect(pvzWin.buildReducedSec).toBeGreaterThanOrEqual(600);
      expect(sim.state.morningDewPhials).toBe(dewBefore + 1);
      expect(pvzWin.specialtySummaryVi).toContain('Tưới 2 ruộng');
      expect(pvzWin.specialtySummaryVi).toContain('Sương Mai');
      expect(derbyTask.objectives[0].progress).toBe(1);

      for (const uid of plotUids) {
        const plot = sim.state.buildings.find((b) => b.uid === uid)!;
        expect(plot.cropWateredBoost).toBe(true);
        // -30% of 2000s = -600s saved
        expect(plot.cropReadyAt!).toBeLessThanOrEqual(readyAtBefore - 590_000);
      }
    });

    it('deduplicates repeated runId per gameId without double-awarding rewards, while allowing same runId on another gameId', () => {
      const sim = createFreshSim();
      const first = sim.completeBonusArcadeVictory('block_blast', {
        stage: 1,
        score: 1200,
        runId: 'shared_dedupe_run_42',
      });
      expect(first.ok).toBe(true);

      const starsAfterFirst = sim.state.match3.stars;
      const sickleAfterFirst = sim.state.galleons;
      const winsAfterFirst = sim.getBonusArcadeRecord('block_blast').winsCount;

      const duplicate = sim.completeBonusArcadeVictory('block_blast', {
        stage: 1,
        score: 1200,
        runId: 'shared_dedupe_run_42',
      });
      expect(duplicate.ok).toBe(false);
      expect(duplicate.starsEarned).toBe(0);
      expect(duplicate.sickleEarned).toBe(0);
      expect(sim.state.match3.stars).toBe(starsAfterFirst);
      expect(sim.state.galleons).toBe(sickleAfterFirst);
      expect(sim.getBonusArcadeRecord('block_blast').winsCount).toBe(winsAfterFirst);

      // Different gameId with same runId string succeeds (namespaced `${gameId}:${runId}`)
      const otherGame = sim.completeBonusArcadeVictory('pvz', {
        stage: 1,
        score: 1500,
        runId: 'shared_dedupe_run_42',
      });
      expect(otherGame.ok).toBe(true);
    });

    it('blocks reward payout while visiting a neighbor and records monotonic best score updates', () => {
      const sim = createFreshSim();
      const rec1 = recordBonusArcadeScore(sim, 'suika', { bestScore: 3400, bestCombo: 8, unlockedStage: 3 });
      expect(rec1.bestScore).toBe(3400);
      expect(rec1.bestCombo).toBe(8);
      expect(rec1.unlockedStage).toBe(3);

      // Lower values never regress saved highs
      const rec2 = sim.recordBonusArcadeScore('suika', { bestScore: 1200, bestCombo: 4, unlockedStage: 1 });
      expect(rec2.bestScore).toBe(3400);
      expect(rec2.bestCombo).toBe(8);
      expect(rec2.unlockedStage).toBe(3);

      const visitSpy = vi.spyOn(sim, 'isVisitingNeighbor', 'get').mockReturnValue(true);
      const blocked = sim.completeBonusArcadeVictory('suika', { stage: 2, score: 5000, runId: 'neighbor_block_1' });
      expect(blocked.ok).toBe(false);
      expect(blocked.starsEarned).toBe(0);
      visitSpy.mockRestore();
    });
  });

  describe('2. Molly Supply Resolution & Consumption (Primary Dish, Wheat Fallback & Derby Progress)', () => {
    it('prioritizes primary dish over 3x ottery_wheat fallback and records Weekly Derby molly_supply progress', () => {
      const sim = createFreshSim();
      const now = Date.now();
      const derbyTask = attachDerbyObjective(sim, 'molly_supply', now, 10);

      const expectedPrimary: Record<BonusArcadeGameId, FarmItemId> = {
        block_blast: 'cinnamon_apple_pie',
        suika: 'honey_apple_cider',
        pvz: 'cream_mushroom_soup',
      };

      let expectedDerbyProgress = 0;

      for (const gameId of BONUS_ARCADE_ORDER) {
        // Empty barn -> not ready
        const emptyRes = resolveBonusArcadeMollySupply(sim, gameId);
        expect(emptyRes.ready).toBe(false);
        expect(emptyRes.itemId).toBe(expectedPrimary[gameId]);
        expect(consumeBonusArcadeMollySupply(sim, gameId).ok).toBe(false);

        // Add 3 ottery_wheat -> fallback ready & consumed
        sim.addFarmItemToBarn('ottery_wheat', 3);
        const fbSupply = sim.getBonusArcadeMollySupply(gameId);
        expect(fbSupply.ready).toBe(true);
        expect(fbSupply.isPrimary).toBe(false);
        expect(fbSupply.itemId).toBe('ottery_wheat');
        expect(fbSupply.qtyNeeded).toBe(3);

        const fbConsume = sim.consumeBonusArcadeMollySupply(gameId);
        expect(fbConsume.ok).toBe(true);
        expect(fbConsume.boostKind).toBe(BONUS_ARCADE_META[gameId].mollyBoostKind);
        expect(sim.getFarmItemCount('ottery_wheat')).toBe(0);
        expectedDerbyProgress += 1;
        expect(derbyTask.objectives[0].progress).toBe(expectedDerbyProgress);

        // Add both wheat AND primary dish -> primary dish prioritized & consumed, wheat untouched!
        sim.addFarmItemToBarn('ottery_wheat', 4);
        sim.addFarmItemToBarn(expectedPrimary[gameId], 1);
        const primarySupply = resolveBonusArcadeMollySupply(sim, gameId);
        expect(primarySupply.ready).toBe(true);
        expect(primarySupply.isPrimary).toBe(true);
        expect(primarySupply.itemId).toBe(expectedPrimary[gameId]);
        expect(primarySupply.qtyNeeded).toBe(1);

        const primaryConsume = consumeBonusArcadeMollySupply(sim, gameId);
        expect(primaryConsume.ok).toBe(true);
        expect(primaryConsume.remaining).toBe(0);
        expect(sim.getFarmItemCount(expectedPrimary[gameId])).toBe(0);
        expect(sim.getFarmItemCount('ottery_wheat')).toBe(4);
        expectedDerbyProgress += 1;
        expect(derbyTask.objectives[0].progress).toBe(expectedDerbyProgress);

        // Clean remaining wheat before next game
        sim.consumeFarmItemFromBarn('ottery_wheat', 4);
      }

      // Sandbox mode: always ready without consuming Barn inventory
      sim.state.sandboxMode = true;
      const sbSupply = resolveBonusArcadeMollySupply(sim, 'pvz');
      expect(sbSupply.ready).toBe(true);
      expect(sbSupply.haveQty).toBe(99);
      const sbConsume = consumeBonusArcadeMollySupply(sim, 'pvz');
      expect(sbConsume.ok).toBe(true);
      expect(sbConsume.remaining).toBe(99);
    });
  });

  describe('3. Save / Load Migration (migrateLoadedState)', () => {
    it('preserves valid bonusArcade records and safely clamps tampered or malformed fields', () => {
      const sim = createFreshSim();
      const bonus = ensureBonusArcadeState(sim.state);
      bonus.block_blast = {
        unlockedStage: 7,
        clearedStages: 6,
        bestScore: 14_500,
        bestCombo: 9,
        winsCount: 8,
        lastPlayedAt: 1_730_000_000_000,
      };
      bonus.suika = {
        unlockedStage: 4,
        clearedStages: 3,
        bestScore: 6250,
        bestCombo: 10,
        winsCount: 5,
      };
      bonus.pvz = {
        unlockedStage: 5,
        clearedStages: 4,
        bestScore: 9100,
        bestCombo: 12,
        winsCount: 4,
        lastPlayedAt: 1_730_000_123_000,
      };

      const roundTripped = migrateLoadedState(JSON.parse(JSON.stringify(sim.state)));
      expect(roundTripped.bonusArcade).toBeDefined();
      expect(roundTripped.bonusArcade!.block_blast).toEqual(bonus.block_blast);
      expect(roundTripped.bonusArcade!.suika).toEqual(bonus.suika);
      expect(roundTripped.bonusArcade!.pvz).toEqual(bonus.pvz);

      // Tampered payload gets safely clamped
      const tampered = JSON.parse(JSON.stringify(sim.state));
      tampered.bonusArcade = {
        block_blast: {
          unlockedStage: -5,
          clearedStages: 999_999,
          bestScore: Number.NaN,
          bestCombo: -2,
          winsCount: 123_456,
          lastPlayedAt: -99,
        },
        suika: 'corrupted',
        pvz: null,
      };
      const sanitized = migrateLoadedState(tampered);
      expect(sanitized.bonusArcade!.block_blast.unlockedStage).toBe(1);
      expect(sanitized.bonusArcade!.block_blast.clearedStages).toBe(99_999);
      expect(sanitized.bonusArcade!.block_blast.bestScore).toBe(0);
      expect(sanitized.bonusArcade!.block_blast.bestCombo).toBe(0);
      expect(sanitized.bonusArcade!.block_blast.winsCount).toBe(99_999);
      expect(sanitized.bonusArcade!.block_blast.lastPlayedAt).toBeUndefined();
      expect(sanitized.bonusArcade!.suika).toEqual({
        unlockedStage: 1,
        clearedStages: 0,
        bestScore: 0,
        bestCombo: 0,
        winsCount: 0,
      });
      expect(sanitized.bonusArcade!.pvz.unlockedStage).toBe(1);

      // Legacy save without bonusArcade migrates cleanly without crashing
      const legacy = JSON.parse(JSON.stringify(sim.state));
      delete legacy.bonusArcade;
      const migratedLegacy = migrateLoadedState(legacy);
      expect(migratedLegacy.bonusArcade).toBeUndefined();
      expect(isBonusArcadeGameId('block_blast')).toBe(true);
      expect(isBonusArcadeGameId('suika')).toBe(true);
      expect(isBonusArcadeGameId('pvz')).toBe(true);
      expect(isBonusArcadeGameId('caro')).toBe(false);
    });
  });

  describe('4. Embedded public/minigames/*.html Asset & Bridge Invariants', () => {
    const expectedFiles: Array<{ id: BonusArcadeGameId; file: string }> = [
      { id: 'block_blast', file: 'block-blast.html' },
      { id: 'suika', file: 'suika.html' },
      { id: 'pvz', file: 'pvz.html' },
    ];

    it.each(expectedFiles)(
      'verifies public/minigames/$file exists, implements hs-bonus-arcade bridge, uses ../ asset paths, and has zero legacy image formats',
      async ({ id, file }) => {
        const { fs, path, rootDir } = await loadNodeFsAndPath();
        const publicDir = path.join(rootDir, 'public');
        const fullPath = path.join(publicDir, 'minigames', file);
        expect(fs.existsSync(fullPath)).toBe(true);
        const html = fs.readFileSync(fullPath, 'utf8');
        expect(html.length).toBeGreaterThan(5000);

        // Bridge channel and exact gameId present
        expect(html).toContain('hs-bonus-arcade');
        expect(html).toContain(id);

        // Zero unrewritten ./sprites/, ./fonts/, or ./paintings/ paths
        const unrewritten = [...html.matchAll(/(?<!\.)\.\/(sprites|fonts|paintings)\//g)];
        expect(unrewritten).toEqual([]);

        // Zero .png / .jpg / .jpeg / .gif image paths
        const legacyImg = [...html.matchAll(/\.(png|jpe?g|gif)\b/gi)];
        expect(legacyImg).toEqual([]);

        // Zero outside http(s) URLs (except SVG namespace)
        const outsideUrls = [...html.matchAll(/https?:\/\/(?!www\.w3\.org)/gi)];
        expect(outsideUrls).toEqual([]);

        // Every referenced ../(sprites|fonts|paintings)/* file exists under public/
        const refs = [...new Set([...html.matchAll(/\.\.\/(sprites|fonts|paintings)\/[^'"`\s)]+/g)].map((m) => m[0]))];
        expect(refs.length).toBeGreaterThan(0);
        const missing = refs.filter((rel) => !fs.existsSync(path.join(publicDir, rel.slice(3))));
        expect(missing).toEqual([]);

        // Verify BONUS_ARCADE_META spriteIcon exists under public/sprites/
        const iconRel = BONUS_ARCADE_META[id].spriteIcon.replace(/^\/game\/trang-trai-hang-soc\//, '');
        expect(fs.existsSync(path.join(publicDir, iconRel))).toBe(true);
        expect(getCatalogItem('farmland_plot')?.isFarmlandPlot).toBe(true);
      }
    );
  });

  describe('5. Anti-Cheat Proof Digest & Anti-Spike Bounds', () => {
    it('builds deterministic ba1:<hex8>-<hex8> proof digests and clamps extreme inputs identically', () => {
      const p1 = buildBonusArcadeRunProof('block_blast', 4, 18_500, 12, 'run_det_1');
      const p2 = buildBonusArcadeRunProof('block_blast', 4, 18_500, 12, 'run_det_1');
      expect(p1).toMatch(/^ba1:[0-9a-f]{8}-[0-9a-f]{8}$/);
      expect(p1).toBe(p2);

      // Sensitivity to every input field
      expect(buildBonusArcadeRunProof('suika', 4, 18_500, 12, 'run_det_1')).not.toBe(p1);
      expect(buildBonusArcadeRunProof('block_blast', 5, 18_500, 12, 'run_det_1')).not.toBe(p1);
      expect(buildBonusArcadeRunProof('block_blast', 4, 18_501, 12, 'run_det_1')).not.toBe(p1);
      expect(buildBonusArcadeRunProof('block_blast', 4, 18_500, 13, 'run_det_1')).not.toBe(p1);
      expect(buildBonusArcadeRunProof('block_blast', 4, 18_500, 12, 'run_det_2')).not.toBe(p1);

      // Clamping consistency at upper & lower bounds
      expect(
        buildBonusArcadeRunProof('pvz', 999_999, 99_999_999, 88_888, 'clamp_hi')
      ).toBe(
        buildBonusArcadeRunProof(
          'pvz',
          BONUS_ARCADE_MAX_STAGE,
          BONUS_ARCADE_MAX_SINGLE_RUN_SCORE,
          BONUS_ARCADE_MAX_SINGLE_RUN_COMBO,
          'clamp_hi'
        )
      );
      expect(
        buildBonusArcadeRunProof('pvz', -10, Number.NaN, -5, 'clamp_lo')
      ).toBe(buildBonusArcadeRunProof('pvz', 1, 0, 0, 'clamp_lo'));
    });

    it('enforces anti-spike bounds on completeBonusArcadeVictory and recordBonusArcadeScore with monotonic highs', () => {
      const sim = createFreshSim();
      expect(BONUS_ARCADE_MAX_SINGLE_RUN_SCORE).toBe(500_000);
      expect(BONUS_ARCADE_MAX_STAGE_JUMP).toBe(2);

      // Tampered score report gets clamped to <= 500_000, combo <= 999, stage jump <= prevUnlocked + 2
      const rec = recordBonusArcadeScore(sim, 'block_blast', {
        bestScore: 9_999_999,
        bestCombo: 5_000,
        unlockedStage: 500,
      });
      expect(rec.bestScore).toBe(BONUS_ARCADE_MAX_SINGLE_RUN_SCORE);
      expect(rec.bestCombo).toBe(BONUS_ARCADE_MAX_SINGLE_RUN_COMBO);
      expect(rec.unlockedStage).toBe(1 + BONUS_ARCADE_MAX_STAGE_JUMP);

      // Tampered victory payload on fresh gameId clamps stage jump, score, combo & emits matching proofDigest
      const outcome = completeBonusArcadeVictory(sim, 'pvz', {
        stage: 999,
        score: 2_500_000,
        combo: 4_321,
        isBoss: true,
        runId: 'anti_spike_pvz_1',
      });
      expect(outcome.ok).toBe(true);
      expect(outcome.record.unlockedStage).toBe(1 + BONUS_ARCADE_MAX_STAGE_JUMP);
      expect(outcome.record.bestScore).toBe(BONUS_ARCADE_MAX_SINGLE_RUN_SCORE);
      expect(outcome.record.bestCombo).toBe(BONUS_ARCADE_MAX_SINGLE_RUN_COMBO);
      expect(outcome.proofDigest).toBe(
        buildBonusArcadeRunProof(
          'pvz',
          1 + BONUS_ARCADE_MAX_STAGE_JUMP,
          BONUS_ARCADE_MAX_SINGLE_RUN_SCORE,
          BONUS_ARCADE_MAX_SINGLE_RUN_COMBO,
          'anti_spike_pvz_1'
        )
      );

      // Subsequent lower victory never regresses monotonic highs
      const followUp = completeBonusArcadeVictory(sim, 'pvz', {
        stage: 1,
        score: 1200,
        combo: 2,
        runId: 'anti_spike_pvz_2',
      });
      expect(followUp.ok).toBe(true);
      expect(followUp.record.bestScore).toBe(BONUS_ARCADE_MAX_SINGLE_RUN_SCORE);
      expect(followUp.record.bestCombo).toBe(BONUS_ARCADE_MAX_SINGLE_RUN_COMBO);
      expect(followUp.record.unlockedStage).toBe(1 + BONUS_ARCADE_MAX_STAGE_JUMP);
    });
  });

  describe('6. CSS Line Budget & Single-Toast Embed Regression Guards', () => {
    it('keeps src/styles/main.css safely below 8,500 lines and preserves 2-group tab styles in puzzleArcadeBonus.css', async () => {
      const { fs, path, rootDir } = await loadNodeFsAndPath();
      const mainCssPath = path.join(rootDir, 'src', 'styles', 'main.css');
      const bonusCssPath = path.join(rootDir, 'src', 'styles', 'puzzleArcadeBonus.css');

      const mainCss = fs.readFileSync(mainCssPath, 'utf8');
      const mainLineCount = mainCss.split(/\r?\n/).length;
      expect(mainLineCount).toBeLessThan(8500);

      expect(fs.existsSync(bonusCssPath)).toBe(true);
      const bonusCss = fs.readFileSync(bonusCssPath, 'utf8');
      expect(bonusCss).toContain('.pa-mode-tabs-wrap');
      expect(bonusCss).toContain('.pa-tab-group-label');
      expect(bonusCss).toMatch(/\.pa-mode-tab(?:\.is-bonus-tab|:is\([^)]*\.is-bonus-tab)/);
    });

    it.each([
      {
        file: 'block-blast.html',
        fnName: 'applyMollyClearRescue',
        innerToastRegex: /showToast\(/g,
        expectedGuardedBranches: 1,
      },
      {
        file: 'suika.html',
        fnName: 'applyMollyUpgradeOrbBoost',
        innerToastRegex: /showBanner\(/g,
        expectedGuardedBranches: 2,
      },
      {
        file: 'pvz.html',
        fnName: 'applyMollySunSurge',
        innerToastRegex: /state\.waveBannerText\s*=/g,
        expectedGuardedBranches: 1,
      },
    ])(
      'ensures $file ($fnName) suppresses inner DOM toast when IS_EMBED is true (single-toast UX)',
      async ({ file, fnName, innerToastRegex, expectedGuardedBranches }) => {
        const { fs, path, rootDir } = await loadNodeFsAndPath();
        const html = fs.readFileSync(path.join(rootDir, 'public', 'minigames', file), 'utf8');
        const fnStart = html.indexOf(`function ${fnName}(`);
        expect(fnStart).toBeGreaterThan(-1);

        // Slice until next top-level function declaration in script
        const afterStart = html.slice(fnStart + 10);
        const nextFnOffset = afterStart.search(/\n\s{4}function\s+[a-zA-Z0-9_]+\(/);
        const fnBody = nextFnOffset > 0 ? html.slice(fnStart, fnStart + 10 + nextFnOffset) : html.slice(fnStart, fnStart + 6000);

        // Must notify parent bridge so parent displays the single toast
        expect(fnBody).toContain('boost-applied');

        // Every inner toast/banner trigger in the Molly boost handler must be guarded by if (!IS_EMBED)
        const toastCalls = [...fnBody.matchAll(innerToastRegex)];
        expect(toastCalls.length).toBe(expectedGuardedBranches);
        const embedGuards = [...fnBody.matchAll(/if\s*\(\s*!\s*IS_EMBED\s*\)/g)];
        expect(embedGuards.length).toBeGreaterThanOrEqual(expectedGuardedBranches);

        for (const match of toastCalls) {
          const idx = match.index ?? 0;
          const preceding = fnBody.slice(Math.max(0, idx - 260), idx);
          expect(preceding).toMatch(/if\s*\(\s*!\s*IS_EMBED\s*\)\s*\{[^}]*$/);
        }
      }
    );
  });
});
