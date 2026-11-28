import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';
import {
  getJigsawValleyAuraMultiplier,
  getJigsawValleyAuraPct,
  MINIGAME_FARM_SPECIALTIES,
} from '../minigameSynergy';
import type { ActiveQuizChallenge } from '../languageQuizEngine';

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

describe('Bước B — Thưởng Đặc Chủng Riêng Từng Minigame (Minigame -> Nông Trại)', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('defines distinct farm specialty metadata for all 7 minigames', () => {
    const keys = Object.keys(MINIGAME_FARM_SPECIALTIES);
    expect(keys.sort()).toEqual(['blocks', 'caro', 'chess', 'jigsaw', 'match3', 'seedquiz', 'sudoku']);
    for (const def of Object.values(MINIGAME_FARM_SPECIALTIES)) {
      expect(def.shortTagVi.length).toBeGreaterThan(3);
      expect(def.fullDescVi).not.toMatch(/0G\b/);
    }
  });

  it('Match-3 accelerates active workshop queue by >=25% (min 5m), or drops flour when idle', () => {
    const sim = new ParkSimulation(createMockAudio());
    const now = Date.now();
    // 1) Idle workshop fallback -> +1 fine_wheat_flour
    const flourBefore = sim.getFarmItemCount('fine_wheat_flour');
    const idleWin = sim.completeMatch3LevelVictory(10);
    expect(idleWin.specialtyReward?.gameId).toBe('match3');
    expect(sim.getFarmItemCount('fine_wheat_flour')).toBe(flourBefore + 1);

    // 2) Active workshop -> shaves at least 25% (or 5m) from workshopQueue[0]
    const endsAtBefore = now + 3600 * 1000;
    sim.state.buildings.push({
      uid: 'spec_bakery_test',
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
        { goodId: 'cinnamon_apple_pie', startedAt: now, endsAt: endsAtBefore },
      ],
    });
    const rushWin = sim.completeMatch3LevelVictory(10);
    expect(rushWin.specialtyReward?.workshopsAccelerated).toBe(1);
    // Gameplay reduction shaves 900s (3600 -> 2700s), then Match-3 specialty shaves 25% of 2700s = 675s on top!
    expect(rushWin.specialtyReward?.workshopShavedSec).toBeGreaterThanOrEqual(600);
    const bakery = sim.state.buildings.find((b) => b.uid === 'spec_bakery_test')!;
    expect(bakery.workshopQueue![0].endsAt).toBeLessThan(endsAtBefore - 1_400_000);
  });

  it('Minesweeper (caro) drops Herbal Compost & cuts construction timer 1.5x faster; Sudoku drops Morning Dew', () => {
    const sim = new ParkSimulation(createMockAudio());
    const now = Date.now();
    sim.state.buildings.push({
      uid: 'spec_build_test',
      itemId: 'burrow_chicken_coop',
      gx: 22,
      gy: 22,
      rotation: 0,
      stars: 1,
      placedAt: now,
      constructEndsAt: now + 7200 * 1000,
      lastTickAt: now + 7200 * 1000,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
    });
    const compostBefore = sim.state.herbalCompost ?? 0;
    const caroWin = sim.completePuzzleArcadeVictory('caro', { stars: 2, sand: 0, gold: 40, xp: 20 });
    expect(caroWin.specialtyReward?.compostAdded).toBeGreaterThanOrEqual(1);
    expect(sim.state.herbalCompost).toBeGreaterThan(compostBefore);
    // 1st streak = 600s -> Minesweeper 1.5x = 900s!
    expect(caroWin.buildReduction?.reducedSec).toBe(900);

    const dewBefore = sim.state.morningDewPhials ?? 0;
    const sudWin = sim.completePuzzleArcadeVictory('sudoku', { stars: 2, sand: 0, gold: 40, xp: 20 });
    expect(sudWin.specialtyReward?.morningDewAdded).toBe(1);
    expect(sim.state.morningDewPhials).toBe(dewBefore + 1);
  });

  it('Fish Shooter (chess) grants +35% Sickle & activates Pasture Gourmet 2x; Onet (blocks) grants +25 Creature Bond', () => {
    const sim = new ParkSimulation(createMockAudio());
    const now = Date.now();
    sim.state.buildings.push({
      uid: 'spec_pasture_test',
      itemId: 'burrow_animal_pasture',
      gx: 18,
      gy: 18,
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
      pastureAnimalId: 'burrow_hen',
      pastureStockedAt: now,
      pastureReadyAt: now + 1800 * 1000,
      pastureGourmetBoost: false,
    });
    const fishWin = sim.completePuzzleArcadeVictory('chess', { stars: 2, sand: 0, gold: 100, xp: 20 });
    expect(fishWin.specialtyReward?.extraSickleBonus).toBeGreaterThanOrEqual(35);
    expect(fishWin.goldEarned).toBeGreaterThanOrEqual(135);
    expect(fishWin.specialtyReward?.pastureGourmetCount).toBe(1);
    expect(sim.state.buildings.find((b) => b.uid === 'spec_pasture_test')!.pastureGourmetBoost).toBe(true);

    // Add a creature habitat for Onet (blocks) bond XP
    sim.state.buildings.push({
      uid: 'spec_niffler_test',
      itemId: 'niffler_den',
      gx: 24,
      gy: 24,
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
      creatureStage: 'adult',
      creatureBondLevel: 1,
      creatureBondXp: 0,
    });
    const onetWin = sim.completePuzzleArcadeVictory('blocks', { stars: 2, sand: 0, gold: 40, xp: 20 });
    expect(onetWin.specialtyReward?.bondXpAdded).toBe(25);
    const den = sim.state.buildings.find((b) => b.uid === 'spec_niffler_test')!;
    expect((den.creatureBondXp ?? 0) + ((den.creatureBondLevel ?? 1) - 1) * 100).toBeGreaterThanOrEqual(25);
  });

  it('Jigsaw grants permanent Valley Aura (0..25%) that scales real farm building production', () => {
    const sim = new ParkSimulation(createMockAudio());
    const shopItem = getCatalogItem('molly_apple_bakery')!;
    const now = Date.now();
    const shop = {
      uid: 'aura_shop_test',
      itemId: 'molly_apple_bakery',
      gx: 16,
      gy: 16,
      rotation: 0 as const,
      stars: 1,
      placedAt: now - 5000,
      constructEndsAt: 0,
      lastTickAt: now,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
    };
    sim.state.buildings.push(shop);

    expect(getJigsawValleyAuraPct(sim.state)).toBe(0);
    expect(getJigsawValleyAuraMultiplier(sim.state)).toBe(1);
    const baseGold = sim.getBuildingProductionPerCycle(shop, shopItem).galleons;

    sim.state.puzzleArcade.restoredPaintings = ['p1', 'p2', 'p3', 'p4', 'p5'];
    sim.state.puzzleArcade.jigsawCleared = 50; // 5*2 + 10 = 20%
    expect(getJigsawValleyAuraPct(sim.state)).toBe(20);
    expect(sim.getJigsawValleyAuraPct()).toBe(20);
    const boostedGold = sim.getBuildingProductionPerCycle(shop, shopItem).galleons;
    expect(boostedGold).toBeGreaterThan(baseGold);

    // Cap at 25%
    sim.state.puzzleArcade.jigsawCleared = 500;
    expect(getJigsawValleyAuraPct(sim.state)).toBe(25);
  });

  it('Language Quiz (seedquiz) triggers whole-valley Aguamenti watering every 5-answer streak', () => {
    const sim = new ParkSimulation(createMockAudio());
    const now = Date.now();
    const plot = {
      uid: 'quiz_rain_plot',
      itemId: 'farmland_plot',
      gx: 16,
      gy: 16,
      rotation: 0 as const,
      stars: 1,
      placedAt: now - 5000,
      constructEndsAt: 0,
      lastTickAt: now,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
      cropId: 'ottery_wheat' as const,
      cropPlantedAt: now,
      cropReadyAt: now + 14400 * 1000,
      cropWateredBoost: false,
    };
    sim.state.buildings.push(plot);

    const baseChallenge: ActiveQuizChallenge = {
      qId: 'q_spec_1',
      lang: 'en',
      tier: 'beginner',
      format: 'cloze_choice',
      prompt: 'Test',
      fullSentence: 'Test',
      ttsPromptText: 'Test',
      meaningVi: 'Kiểm tra',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      correctAnswer: 'A',
      topic: 'general',
    } as unknown as ActiveQuizChallenge;

    let res5: ReturnType<typeof sim.completeSeedLanguageQuizAttempt> | undefined;
    for (let i = 1; i <= 5; i++) {
      res5 = sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...baseChallenge, qId: `q_spec_${i}` }, true);
    }
    expect(res5?.specialtyReward?.plotsWateredCount).toBeGreaterThanOrEqual(1);
    expect(plot.cropWateredBoost).toBe(true);
    expect(plot.cropReadyAt!).toBeLessThan(now + 14400 * 1000);
  });
});
