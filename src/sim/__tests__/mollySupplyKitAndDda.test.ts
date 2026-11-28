import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCandyLevelById } from '../../data/candyHogwartsLevels';
import { MagicalAudio } from '../../engine/audio';
import { CandyHogwartsEngine } from '../candyHogwartsEngine';
import {
  computeMatch3DdaBonusMoves,
  MOLLY_SUPPLY_KIT_RECIPES,
  resolveMollySupplyForMinigame,
} from '../minigameSynergy';
import { ParkSimulation } from '../simulation';
import { SudokuPuzzleEngine } from '../sudokuEngine';
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

describe('Bước C — Hộp Tiếp Tế Bà Molly (Nông Trại -> Minigame), Match-3 DDA & Sudoku Peer Scan', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('resolves signature farm item priority per minigame and falls back cleanly to Cinnamon Apple Pie', () => {
    const sim = new ParkSimulation(createMockAudio());
    // Clear starting barn items to start from empty
    const barn = sim.ensureFarmBarn();
    for (const k of Object.keys(barn.crops) as Array<keyof typeof barn.crops>) barn.crops[k] = 0;
    for (const k of Object.keys(barn.goods) as Array<keyof typeof barn.goods>) barn.goods[k] = 0;

    // All 6 played minigames have recipes defined
    expect(Object.keys(MOLLY_SUPPLY_KIT_RECIPES).sort()).toEqual([
      'blocks',
      'caro',
      'chess',
      'jigsaw',
      'match3',
      'sudoku',
    ]);

    // Empty barn -> not ready
    expect(resolveMollySupplyForMinigame(sim, 'match3').ready).toBe(false);
    expect(sim.consumeMollySupplyKit('match3').ok).toBe(false);

    // Add universal apple pie -> ready (non-signature)
    sim.addFarmItemToBarn('cinnamon_apple_pie', 1);
    const fallbackKit = resolveMollySupplyForMinigame(sim, 'match3');
    expect(fallbackKit.ready).toBe(true);
    expect(fallbackKit.itemId).toBe('cinnamon_apple_pie');
    expect(fallbackKit.isSignature).toBe(false);

    // Add signature pumpkin_pie -> prioritized over apple pie!
    sim.addFarmItemToBarn('pumpkin_pie', 1);
    const sigKit = resolveMollySupplyForMinigame(sim, 'match3');
    expect(sigKit.ready).toBe(true);
    expect(sigKit.itemId).toBe('pumpkin_pie');
    expect(sigKit.isSignature).toBe(true);

    const consumed = sim.consumeMollySupplyKit('match3');
    expect(consumed.ok).toBe(true);
    expect(consumed.isSignature).toBe(true);
    expect(consumed.itemId).toBe('pumpkin_pie');
    expect(sim.getFarmItemCount('pumpkin_pie')).toBe(0);
    expect(sim.getFarmItemCount('cinnamon_apple_pie')).toBe(1);

    // Verify Fish Shooter accepts 2 golden_corn farm crops as signature bait
    sim.addFarmItemToBarn('golden_corn', 2);
    const fishRes = sim.consumeMollySupplyKit('chess');
    expect(fishRes.ok).toBe(true);
    expect(fishRes.isSignature).toBe(true);
    expect(fishRes.itemId).toBe('golden_corn');
    expect(sim.getFarmItemCount('golden_corn')).toBe(0);
  });

  it('activates Sudoku Peer Scan on Molly Supply without breaking default blind-check hasConflict()', () => {
    const engine = new SudokuPuzzleEngine(1);
    // Find a blank cell and a row given digit to create a deliberate row duplicate
    let blank: { r: number; c: number } | null = null;
    let dupDigit = 0;
    for (let r = 0; r < 9 && !blank; r++) {
      for (let c = 0; c < 9; c++) {
        if (!engine.given[r][c] && engine.grid[r][c] === 0) {
          const rowGiven = engine.grid[r].find((v) => v >= 1 && v <= 9);
          if (rowGiven) {
            blank = { r, c };
            dupDigit = rowGiven;
            break;
          }
        }
      }
    }
    expect(blank).not.toBeNull();
    engine.selectCell(blank!.r, blank!.c);
    engine.inputDigit(dupDigit);

    // Default blind-check invariant preserved
    expect(engine.hasConflict(blank!.r, blank!.c)).toBe(false);
    expect(engine.hasVisiblePeerDuplicate(blank!.r, blank!.c)).toBe(false);

    // Activate Molly Supply Peer Scan -> immediately flags the duplicate cell!
    engine.peerScanActive = true;
    expect(engine.hasConflict(blank!.r, blank!.c)).toBe(false);
    expect(engine.hasVisiblePeerDuplicate(blank!.r, blank!.c)).toBe(true);
  });

  it('triggers Match-3 Early DDA bonus moves only after >= 3 consecutive losses on a stage', () => {
    expect(computeMatch3DdaBonusMoves(1, 0)).toBe(0);
    expect(computeMatch3DdaBonusMoves(1, 2)).toBe(0);
    expect(computeMatch3DdaBonusMoves(1, 3)).toBe(4);
    expect(computeMatch3DdaBonusMoves(15, 3)).toBe(3);
    expect(computeMatch3DdaBonusMoves(15, 10)).toBe(5); // capped at +5

    const lv = getCandyLevelById(2);
    const eng = new CandyHogwartsEngine(null);
    eng.loadLevel(lv, { instantAnimations: true, extraDdaMoves: 4 });
    expect(eng.movesLeft).toBe(lv.moves + 4);
  });

  it('grants a Quiz Streak Shield every 10 farm harvests and protects quiz streak on a wrong answer', () => {
    const sim = new ParkSimulation(createMockAudio());
    const now = Date.now();
    sim.state.stats.farmHarvestsCount = 9;
    sim.state.quizStreakShields = 0;

    // 10th harvest grants +1 Quiz Streak Shield!
    const plot = {
      uid: 'shield_harvest_plot',
      itemId: 'farmland_plot',
      gx: 15,
      gy: 15,
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
      cropPlantedAt: now - 600_000,
      cropReadyAt: now - 1000,
      cropWateredBoost: false,
    };
    sim.state.buildings.push(plot);
    expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
    expect(sim.state.quizStreakShields).toBe(1);

    // Build a 3-answer streak, then miss once -> shield preserves streak = 3!
    const baseChallenge: ActiveQuizChallenge = {
      qId: 'q_sh_1',
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

    for (let i = 1; i <= 3; i++) {
      sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...baseChallenge, qId: `q_sh_${i}` }, true);
    }
    expect(sim.ensureLanguageQuiz().profiles.en.streak).toBe(3);

    const shieldedMiss = sim.completeSeedLanguageQuizAttempt(
      'ottery_wheat',
      { ...baseChallenge, qId: 'q_sh_miss' },
      false
    );
    expect(shieldedMiss.streakShieldConsumed).toBe(true);
    expect(shieldedMiss.newStreak).toBe(3);
    expect(sim.ensureLanguageQuiz().profiles.en.streak).toBe(3);
    expect(sim.state.quizStreakShields).toBe(0);
  });
});
