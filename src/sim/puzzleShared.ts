// Tách tự động từ src/sim/puzzleArcadeEngine.ts (P0.5 — tách puzzle engine theo môn).
import {
  MAX_MINIGAME_STAGE,
  MilestoneBossMeta,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
} from "../data/match3Levels";
import { PuzzleArcadeMode, PuzzleArcadeState } from "../types/game";

export {
  MAX_MINIGAME_STAGE,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
};
export type { MilestoneBossMeta, PuzzleArcadeMode, PuzzleArcadeState };

export type WizardingPortraitKey =
  | 'ron'
  | 'molly'
  | 'arthur'
  | 'hagrid'
  | 'professor'
  | 'deatheater'
  | 'thestral'
  | 'snape'
  | 'bellatrix'
  | 'voldemort';

export interface TurningPointReview {
  mode: 'caro' | 'chess' | 'blocks';
  plyNumber: number;
  outcomeTagVi: string;
  playedCoordVi: string;
  recommendedCoordVi: string;
  summaryVi: string;
  highlightCells: Array<{ r: number; c: number; role: 'played' | 'best' }>;
}

export interface PuzzleRewardSpec {
  stars: number;
  sand: number;
  gold: number;
  xp: number;
  paintingId?: string;
  isMasterpiece?: boolean;
}

export function isArcadeSubModeLocked(stage: number): boolean {
  return Math.floor(stage) > 10;
}

export function createInitialPuzzleArcadeState(): PuzzleArcadeState {
  return {
    activeMode: 'caro',
    sudokuStage: 1,
    caroStage: 1,
    chessStage: 1,
    jigsawStage: 1,
    blockStage: 1,
    tileStage: 1,
    sudokuCleared: 0,
    caroCleared: 0,
    chessCleared: 0,
    blockCleared: 0,
    featuredWinsCount: 0,
    restoredPaintings: [],
    totalPuzzlesSolved: 0,
  };
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

