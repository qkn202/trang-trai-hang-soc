import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  classifySaveError,
  clearPendingProofOfPlaysForTest,
  computeSaveRetryDelayMs,
  enqueueProofOfPlay,
  getPendingProofOfPlayCount,
  resetClientDiagnosticStateForTest,
  shouldAcceptClientDiagnostic,
} from '../bridge';
import { MagicalAudio } from '../../engine/audio';
import { ProofOfPlayRecorder } from '../../sim/proofOfPlay';
import { ParkSimulation } from '../../sim/simulation';

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

describe('Bước 2 AAA — Bridge Save Auto-Retry, Structured Conflicts, PoP Forwarding & Error Telemetry', () => {
  beforeEach(() => {
    storageMap.clear();
    clearPendingProofOfPlaysForTest();
    resetClientDiagnosticStateForTest();
  });

  it('classifies structured conflict/size codes first and falls back safely to legacy messages', () => {
    expect(classifySaveError(Object.assign(new Error('conflict'), { code: 'SESSION_REPLACED' }))).toBe('replaced');
    expect(classifySaveError(Object.assign(new Error('x'), { code: 'functions/failed_precondition' }))).toBe('replaced');
    expect(classifySaveError(Object.assign(new Error('x'), { code: 'PAYLOAD_TOO_LARGE' }))).toBe('too-big');
    expect(classifySaveError(new Error('Bạn đang chơi ở thiết bị khác'))).toBe('replaced');
    expect(classifySaveError(new Error('Save quá lớn > 1 MiB'))).toBe('too-big');
    expect(classifySaveError(new Error('Kết nối HPVN hết thời gian chờ.'))).toBe('retryable');
  });

  it('computes bounded exponential backoff retry delays (4s -> 8s -> 16s -> 32s -> 60s)', () => {
    expect(computeSaveRetryDelayMs(0)).toBe(4_000);
    expect(computeSaveRetryDelayMs(1)).toBe(8_000);
    expect(computeSaveRetryDelayMs(2)).toBe(16_000);
    expect(computeSaveRetryDelayMs(3)).toBe(32_000);
    expect(computeSaveRetryDelayMs(4)).toBe(60_000);
    expect(computeSaveRetryDelayMs(99)).toBe(60_000);
  });

  it('queues verified ProofOfPlay envelopes on minigame victories, rejects tampered ones, and caps queue at 16', () => {
    const sim = new ParkSimulation(createMockAudio());

    // Build a valid Match-3 PoP with human cadence
    const recM3 = new ProofOfPlayRecorder('match3', 1, 1000);
    recM3.recordMove(0x101, 1450);
    recM3.recordMove(0x102, 2100);
    recM3.recordMove(0x103, 2850);
    const validM3Pop = recM3.seal(4200, 3400);

    sim.completeMatch3LevelVictory(5, { sessionScore: 4200, proofOfPlay: validM3Pop, completedStage: 1 });
    expect(getPendingProofOfPlayCount()).toBe(1);

    // Duplicate nonce is ignored
    expect(enqueueProofOfPlay(validM3Pop)).toBe(false);
    expect(getPendingProofOfPlayCount()).toBe(1);

    // Tampered PoP (forged score breaking chain digest) is rejected by simulationTrials!
    const forgedSudokuRec = new ProofOfPlayRecorder('sudoku', 1, 1000);
    forgedSudokuRec.recordMove(0x201, 1600);
    forgedSudokuRec.recordMove(0x202, 2200);
    forgedSudokuRec.recordMove(0x203, 2900);
    forgedSudokuRec.recordMove(0x204, 3600);
    const validSudokuPop = forgedSudokuRec.seal(2600, 4200);
    const tamperedPop = { ...validSudokuPop, sessionScore: 999999 };
    sim.completePuzzleArcadeVictory(
      'sudoku',
      { stars: 2, sand: 0, gold: 40, xp: 20 },
      { sessionScore: 999999, proofOfPlay: tamperedPop, completedStage: 1 }
    );
    expect(getPendingProofOfPlayCount()).toBe(1); // still 1 — tampered proof NOT queued!

    // Valid Sudoku PoP IS queued!
    const recSud2 = new ProofOfPlayRecorder('sudoku', 2, 1000);
    recSud2.recordMove(0x201, 1700);
    recSud2.recordMove(0x202, 2400);
    recSud2.recordMove(0x203, 3100);
    recSud2.recordMove(0x204, 3900);
    const validSud2 = recSud2.seal(2400, 4600);
    sim.completePuzzleArcadeVictory(
      'sudoku',
      { stars: 2, sand: 0, gold: 40, xp: 20 },
      { sessionScore: 2400, proofOfPlay: validSud2, completedStage: 2 }
    );
    expect(getPendingProofOfPlayCount()).toBe(2);

    // Queue caps cleanly at 16 envelopes
    for (let i = 0; i < 25; i++) {
      enqueueProofOfPlay({ ...validSud2, nonce: `nonce_cap_${i}` });
    }
    expect(getPendingProofOfPlayCount()).toBe(16);
  });

  it('rate-limits (5/60s) and deduplicates client diagnostic reports', () => {
    const t0 = 1_000_000;
    expect(shouldAcceptClientDiagnostic('error:boom', t0)).toBe(true);
    // Duplicate within 60s suppressed
    expect(shouldAcceptClientDiagnostic('error:boom', t0 + 1000)).toBe(false);
    // 4 more distinct errors accepted (total 5)
    expect(shouldAcceptClientDiagnostic('error:e2', t0 + 2000)).toBe(true);
    expect(shouldAcceptClientDiagnostic('error:e3', t0 + 3000)).toBe(true);
    expect(shouldAcceptClientDiagnostic('error:e4', t0 + 4000)).toBe(true);
    expect(shouldAcceptClientDiagnostic('error:e5', t0 + 5000)).toBe(true);
    // 6th within window rate-limited
    expect(shouldAcceptClientDiagnostic('error:e6', t0 + 6000)).toBe(false);
    // After 60s window expires, accepted again
    expect(shouldAcceptClientDiagnostic('error:boom', t0 + 65_000)).toBe(true);
  });
});
