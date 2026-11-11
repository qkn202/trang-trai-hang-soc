import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BurrowAuthoritativeBackend,
  MAX_DAILY_HOUSE_CUP_MEMBER_POINTS,
  MemoryBackendKVStore,
} from '../../../server/burrowBackendCore';
import {
  computeExamStreakReductionSec,
  computeStrategicPlotGrowSeconds,
  FIRST_ECONOMIC_CYCLE_SEC,
  getCropFamily,
  getCropMasteryTierInfo,
  getStageSawtoothTag,
  MORNING_DEW_REDUCTION_SEC,
  TACTICAL_SOIL_FATIGUE_CAP_SEC,
} from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { PlacedBuilding } from '../../types/game';
import { ACHIEVEMENT_REGISTRY, ensureRetentionState, ParkSimulation } from '../simulation';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

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
    playComboChime: vi.fn(),
    setModalMuffle: vi.fn(),
    setModalDucking: vi.fn(),
    updateSoundscape: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  } as unknown as MagicalAudio;
}

describe('AAA Transformation Suite (Tactical Economy 2.0, Minigame Synergy, Living World & HPVN Cup/SOS)', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('1. Tactical Economy 2.0: Soil Rotation, 12h Soft Cap, Anti-Bulldoze & Crop Mastery', () => {
    it('classifies crops into 4 distinct botanical families and scales Mastery Tier I–V', () => {
      expect(getCropFamily('ottery_wheat')).toBe('grain');
      expect(getCropFamily('garden_pumpkin')).toBe('produce');
      expect(getCropFamily('meadow_daisy')).toBe('flower');
      expect(getCropFamily('baby_mandrake')).toBe('magical');

      expect(getCropMasteryTierInfo(0)).toMatchObject({ tier: 1, valueMult: 1.0, speedMult: 1.0 });
      expect(getCropMasteryTierInfo(5)).toMatchObject({ tier: 2, valueMult: 1.1, speedMult: 1.0 });
      expect(getCropMasteryTierInfo(10)).toMatchObject({ tier: 3, valueMult: 1.2, speedMult: 0.97 });
      expect(getCropMasteryTierInfo(15)).toMatchObject({ tier: 4, valueMult: 1.35, speedMult: 0.94 });
      expect(getCropMasteryTierInfo(25)).toMatchObject({ tier: 5, valueMult: 1.5, speedMult: 0.9 });
    });

    it('caps monoculture soil fatigue at 6h (21,600s) and drops fatigue + grants 2x Golden Harvest on family rotation', () => {
      const highMono = computeStrategicPlotGrowSeconds(9, false, 0, FIRST_ECONOMIC_CYCLE_SEC);
      expect(TACTICAL_SOIL_FATIGUE_CAP_SEC).toBe(21_600);
      expect(highMono.growSec).toBe(TACTICAL_SOIL_FATIGUE_CAP_SEC);
      expect(highMono.isRotatedBonus).toBe(false);

      const rotated = computeStrategicPlotGrowSeconds(2, true, 0, FIRST_ECONOMIC_CYCLE_SEC);
      expect(rotated.isRotatedBonus).toBe(true);
      expect(rotated.effectiveFatigueStep).toBe(1);
      expect(rotated.growSec).toBe(FIRST_ECONOMIC_CYCLE_SEC * 2);
    });

    it('persists soil fatigue at (gx,gy) across bulldozing and doubles harvest yield when rotated', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.galleons = 50_000;
      const barn = sim.ensureFarmBarn();
      barn.seeds = {
        ...(barn.seeds ?? {}),
        ottery_wheat: 10,
        garden_pumpkin: 10,
      };

      const targetPlot: PlacedBuilding = {
        uid: 'aaa_test_plot_16_16',
        itemId: 'farmland_plot',
        gx: 16,
        gy: 16,
        rotation: 0,
        stars: 1,
        placedAt: Date.now() - 5000,
        constructEndsAt: 0,
        lastTickAt: Date.now(),
        storedGalleons: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        harvestCycleCount: 0,
      };
      sim.state.buildings.push(targetPlot);
      const coordKey = `${targetPlot.gx},${targetPlot.gy}`;
      delete sim.state.plotSoilState?.[coordKey];

      // 1st plant: Lúa Mì (grain) -> baseline 1h, fatigue 0
      expect(sim.plantCropOnPlot(targetPlot.uid, 'ottery_wheat').ok).toBe(true);
      expect(targetPlot.cropRotatedBonus).toBe(false);

      // Ripen & harvest #1 -> records lastFamily = 'grain', fatigueStep = 1
      targetPlot.cropReadyAt = Date.now() - 1000;
      const wheatBefore = sim.getFarmItemCount('ottery_wheat');
      expect(sim.harvestCropPlot(targetPlot.uid).ok).toBe(true);
      const baseWheatDelta = sim.getFarmItemCount('ottery_wheat') - wheatBefore;
      expect(baseWheatDelta).toBe(2);
      expect(sim.state.cropMastery?.ottery_wheat).toBe(1);
      expect(sim.state.plotSoilState?.[coordKey]).toMatchObject({
        lastFamily: 'grain',
        fatigueStep: 1,
      });

      // 2nd plant same family (grain) -> monoculture 2h = 7,200s
      expect(sim.plantCropOnPlot(targetPlot.uid, 'ottery_wheat').ok).toBe(true);
      const monoDurationSec = Math.round(
        ((targetPlot.cropReadyAt ?? 0) - (targetPlot.cropPlantedAt ?? 0)) / 1000
      );
      expect(monoDurationSec).toBe(7200);
      targetPlot.cropReadyAt = Date.now() - 1000;
      expect(sim.harvestCropPlot(targetPlot.uid).ok).toBe(true);
      expect(sim.state.plotSoilState?.[coordKey]?.fatigueStep).toBe(2);

      // Anti-Bulldoze Exploit check: remove building from state, rebuild brand-new plot at same (gx,gy)
      sim.state.buildings = sim.state.buildings.filter((b) => b.uid !== targetPlot.uid);
      expect(sim.state.plotSoilState?.[coordKey]?.fatigueStep).toBe(2);

      const rebuiltPlot: PlacedBuilding = {
        ...structuredClone(targetPlot),
        uid: 'aaa_test_plot_rebuilt_16_16',
        harvestCycleCount: 0,
      };
      sim.state.buildings.push(rebuiltPlot);

      // Rotate to Bí Ngô (produce) at (16,16) -> drops effective fatigue 2 -> 1 (7200s instead of 14400s) & cropRotatedBonus = true!
      expect(sim.plantCropOnPlot(rebuiltPlot.uid, 'garden_pumpkin').ok).toBe(true);
      expect(rebuiltPlot.cropRotatedBonus).toBe(true);
      const rotatedDurationSec = Math.round(
        ((rebuiltPlot.cropReadyAt ?? 0) - (rebuiltPlot.cropPlantedAt ?? 0)) / 1000
      );
      expect(rotatedDurationSec).toBe(7200);

      // Harvest rotated pumpkin -> receives 2x Golden Harvest yield (4 instead of 2)!
      rebuiltPlot.cropReadyAt = Date.now() - 1000;
      const pumpkinBefore = sim.getFarmItemCount('garden_pumpkin');
      expect(sim.harvestCropPlot(rebuiltPlot.uid).ok).toBe(true);
      const rotatedPumpkinDelta = sim.getFarmItemCount('garden_pumpkin') - pumpkinBefore;
      expect(rotatedPumpkinDelta).toBe(4);
    });
  });

  describe('2. Exam Win-Streak, Sawtooth Pacing & Morning Dew Phials', () => {
    it('scales Exam Win-Streak timer cuts (600 -> 900 -> 1200 -> 1800s) and awards +1 Dew Phial on 3rd win', () => {
      expect(computeExamStreakReductionSec(1)).toMatchObject({ rawReduceSec: 600, dewPhialAwarded: 0 });
      expect(computeExamStreakReductionSec(2)).toMatchObject({ rawReduceSec: 900, dewPhialAwarded: 0 });
      expect(computeExamStreakReductionSec(3)).toMatchObject({ rawReduceSec: 1200, dewPhialAwarded: 1 });
      expect(computeExamStreakReductionSec(4)).toMatchObject({ rawReduceSec: 1800, dewPhialAwarded: 0 });

      expect(getStageSawtoothTag(3).kind).toBe('normal');
      expect(getStageSawtoothTag(4).kind).toBe('hard');
      expect(getStageSawtoothTag(5).kind).toBe('treasure');
      expect(getStageSawtoothTag(10).kind).toBe('boss');

      const sim = new ParkSimulation(createMockAudio());
      expect(sim.state.examWinStreak ?? 0).toBe(0);
      expect(sim.state.morningDewPhials ?? 0).toBe(0);

      // Win 3 consecutive Puzzle Arcade stages
      sim.completePuzzleArcadeVictory('caro', { stars: 3, sand: 1, gold: 40, xp: 25 });
      expect(sim.state.examWinStreak).toBe(1);
      sim.completePuzzleArcadeVictory('sudoku', { stars: 3, sand: 1, gold: 40, xp: 25 });
      expect(sim.state.examWinStreak).toBe(2);
      sim.completePuzzleArcadeVictory('chess', { stars: 3, sand: 1, gold: 40, xp: 25 });
      expect(sim.state.examWinStreak).toBe(3);
      expect(sim.state.morningDewPhials).toBe(1);

      // Apply Morning Dew Phial (-15m = 900s) to a growing crop plot
      const now = Date.now();
      const dewPlot = {
        uid: 'dew_test_plot',
        itemId: 'farmland_plot',
        gx: 18,
        gy: 18,
        rotation: 0 as const,
        stars: 1,
        placedAt: now - 5000,
        constructEndsAt: 0,
        lastTickAt: now,
        storedGalleons: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        cropId: 'ottery_wheat' as const,
        cropPlantedAt: now,
        cropReadyAt: now + 3600 * 1000,
      };
      sim.state.buildings.push(dewPlot);

      const dewRes = sim.useMorningDewPhial(dewPlot.uid);
      expect(dewRes.ok).toBe(true);
      expect(dewRes.reducedSec).toBe(MORNING_DEW_REDUCTION_SEC);
      expect(sim.state.morningDewPhials).toBe(0);

      // Losing heart resets examWinStreak back to 0
      sim.loseMatch3Heart();
      expect(sim.state.examWinStreak).toBe(0);
    });
  });

  describe('3. Diegetic Farm-to-Minigame Synergy (Companions & Điểm Tâm Bà Molly)', () => {
    it('selects highest-bonded creature companion and consumes Molly snacks from Red Barn', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.buildings.push({
        uid: 'test_phoenix_hab',
        itemId: 'phoenix_perch',
        gx: 20,
        gy: 20,
        rotation: 0,
        stars: 2,
        placedAt: Date.now() - 10_000,
        constructEndsAt: 0,
        lastTickAt: Date.now(),
        storedGalleons: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        creatureBondLevel: 6,
        creatureNickname: 'Fawkes Rực Lửa',
      });

      const comp = sim.getActiveMinigameCompanion();
      expect(comp.nameVi).toBe('Fawkes Rực Lửa');
      expect(comp.bondLevel).toBe(6);
      expect(comp.chargeEveryMoves).toBe(4);

      const snackBarn = sim.ensureFarmBarn();
      snackBarn.goods.cinnamon_apple_pie = 0;
      expect(sim.consumeMollyMinigameSnack('cinnamon_apple_pie').ok).toBe(false);

      snackBarn.goods.cinnamon_apple_pie = 2;
      const snackRes = sim.consumeMollyMinigameSnack('cinnamon_apple_pie');
      expect(snackRes.ok).toBe(true);
      expect(snackRes.remaining).toBe(1);
      expect(sim.getFarmItemCount('cinnamon_apple_pie')).toBe(1);
    });
  });

  describe('4. Living World, Audio Muffle & P3–P5 Platform Wiring', () => {
    it('wires 7-Day Login, Achievements, Villager Dialogue, Layout Presets, Decor Stash & Named Save Slots', () => {
      const sim = new ParkSimulation(createMockAudio());

      // 7-Day Login Day 1 credits Galleons & Magic Stars
      const starsBefore = sim.state.match3.stars;
      const loginRes = sim.claimLoginDayReward(1);
      expect(loginRes.ok).toBe(true);
      expect(sim.state.match3.stars).toBeGreaterThanOrEqual(starsBefore);
      expect(sim.claimLoginDayReward(1).ok).toBe(false);

      // Unlock & claim achievement when unlocked
      sim.state.stats.totalGalleonsHarvested = 10_000;
      sim.state.level = 10;
      sim.checkAndToastAchievements();
      const ret = ensureRetentionState(sim.state);
      const anyUnlocked = ACHIEVEMENT_REGISTRY.find((a) => Boolean(ret.achievements[a.id]?.unlockedAt));
      expect(anyUnlocked).toBeDefined();
      const achRes = sim.claimAchievement(anyUnlocked!.id);
      expect(achRes.ok).toBe(true);

      // Villager dialogue choice once per day
      const talk1 = sim.talkWithVillagerChoice('molly', 0);
      expect(talk1.ok).toBe(true);
      expect(sim.talkWithVillagerChoice('molly', 1).ok).toBe(false);

      // Layout Preset save & apply + Quick Decor Stash/Restore
      sim.state.buildings.push({
        uid: 'test_decor_bush',
        itemId: 'snowy_pines',
        gx: 24,
        gy: 24,
        rotation: 0,
        stars: 1,
        placedAt: Date.now(),
        constructEndsAt: 0,
        lastTickAt: Date.now(),
        storedGalleons: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
      });
      const preset = sim.saveLayoutPreset('layout_1', 'Vườn Hoa Thử Nghiệm');
      expect(preset.label).toBe('Vườn Hoa Thử Nghiệm');
      expect(sim.applyLayoutPreset('layout_1').ok).toBe(true);

      const stashRes = sim.stashAllDecorItems();
      expect(stashRes.ok).toBe(true);
      expect(stashRes.count).toBeGreaterThanOrEqual(1);
      const restoreRes = sim.restoreAllStashedDecor();
      expect(restoreRes.ok).toBe(true);
      expect(restoreRes.placed).toBeGreaterThanOrEqual(1);

      // Named Save Slot round-trip
      sim.state.parkName = 'Hang Sóc Huyền Thoại';
      const meta = sim.saveNamedProfileSlot('slot_1');
      expect(meta.parkName).toBe('Hang Sóc Huyền Thoại');
      sim.state.parkName = 'Tên Tạm';
      const loadRes = sim.loadNamedProfileSlot('slot_1');
      expect(loadRes.ok).toBe(true);
      expect(sim.state.parkName).toBe('Hang Sóc Huyền Thoại');

      // Real MagicalAudio modal warm-muffle state toggle
      const realAudio = new MagicalAudio();
      expect(realAudio.isModalMuffled()).toBe(false);
      realAudio.setModalMuffle(true);
      expect(realAudio.isModalMuffled()).toBe(true);
      expect(realAudio.ceiling.isModalDucked()).toBe(true);
      realAudio.setModalMuffle(false);
      expect(realAudio.isModalMuffled()).toBe(false);
    });
  });

  describe('5. Authoritative HPVN Weekly 4-House Cup & Co-op SOS Ghost Replay', () => {
    it('aggregates Weekly 4-House Cup points with daily member cap and fulfills Co-op SOS with Ghost Replay', async () => {
      const nowMs = Date.parse('2026-11-11T10:00:00+07:00');
      const backend = new BurrowAuthoritativeBackend({
        store: new MemoryBackendKVStore(() => nowMs),
        now: () => nowMs,
        initialGalleons: 400,
        initialBankGalleons: 200,
      });

      const ronAuth = {
        uid: 'ron_weasley',
        house: 'Gryffindor' as const,
        role: 'member' as const,
        authenticatedVia: 'hmac-jwt' as const,
        username: 'Ron Weasley',
      };
      const hermioneAuth = {
        uid: 'hermione_granger',
        house: 'Gryffindor' as const,
        role: 'member' as const,
        authenticatedVia: 'hmac-jwt' as const,
        username: 'Hermione Granger',
      };

      const initialCup = await backend.handleCallable('getWeeklyHouseCupStandings', {}, ronAuth);
      const baseGryffindor = (initialCup.totals as Record<string, number>).Gryffindor;

      // Contribute points up to daily member cap (150)
      const c1 = await backend.handleCallable(
        'contributeWeeklyHouseCup',
        { points: 25 },
        ronAuth
      );
      expect(c1.added).toBe(25);
      expect((c1.totals as Record<string, number>).Gryffindor).toBe(baseGryffindor + 25);

      for (let i = 0; i < 6; i++) {
        await backend.handleCallable('contributeWeeklyHouseCup', { points: 30 }, ronAuth);
      }
      const standings = await backend.handleCallable('getWeeklyHouseCupStandings', {}, ronAuth);
      expect(standings.playerContribution).toBe(MAX_DAILY_HOUSE_CUP_MEMBER_POINTS);
      expect((standings.totals as Record<string, number>).Gryffindor).toBe(
        baseGryffindor + MAX_DAILY_HOUSE_CUP_MEMBER_POINTS
      );

      // Ron posts a Minigame SOS on Stage 42
      const postRes = await backend.handleCallable(
        'postCoopAssistanceRequest',
        {
          requestId: 'sos_ron_chess_42',
          kind: 'minigame_sos',
          minigameKind: 'chess',
          stage: 42,
        },
        ronAuth
      );
      expect(postRes.ok).toBe(true);

      // Self-fulfill is strictly forbidden
      await expect(
        backend.handleCallable(
          'fulfillCoopAssistanceRequest',
          { hostUid: 'ron_weasley', targetRequestId: 'sos_ron_chess_42' },
          ronAuth
        )
      ).rejects.toMatchObject({ reason: 'invalid-action-input' });

      // Hermione fulfills Ron's SOS with a tactical Ghost Replay -> earns +95G, +3 Friendship Tokens, +6 House Cup pts
      const fulfillRes = await backend.handleCallable(
        'fulfillCoopAssistanceRequest',
        {
          hostUid: 'ron_weasley',
          targetRequestId: 'sos_ron_chess_42',
          movesUsed: 11,
          ghostReplayMoves: ['Nước #2: Thí Mã mở cột E', 'Nước #11: Chiếu hết Hậu D8!'],
        },
        hermioneAuth
      );
      expect(fulfillRes.ok).toBe(true);
      expect(fulfillRes.goldEarned).toBe(95);
      expect(fulfillRes.tokensEarned).toBe(3);
      const fulfilledReq = fulfillRes.request as {
        ghostReplaySummaryVi?: string;
        ghostReplayMoves?: string[];
      };
      expect(fulfilledReq.ghostReplaySummaryVi).toContain('Màn 42');
      expect(fulfilledReq.ghostReplayMoves).toHaveLength(2);

      // Hermione's Gringotts wallet increased by +95G
      const hermioneSnap = (await backend.handleCallable('getBurrowGarden', {}, hermioneAuth)) as {
        wallet: { spendable: number };
      };
      expect(hermioneSnap.wallet.spendable).toBe(600 + 95);

      // Ron posts a second SOS today, but Hermione already rescued Ron once today -> 1/friend/day cap!
      await backend.handleCallable(
        'postCoopAssistanceRequest',
        {
          requestId: 'sos_ron_blocks_43',
          kind: 'minigame_sos',
          minigameKind: 'blocks',
          stage: 43,
        },
        ronAuth
      );
      await expect(
        backend.handleCallable(
          'fulfillCoopAssistanceRequest',
          { hostUid: 'ron_weasley', targetRequestId: 'sos_ron_blocks_43' },
          hermioneAuth
        )
      ).rejects.toMatchObject({ reason: 'already-helped' });
    });
  });
});
