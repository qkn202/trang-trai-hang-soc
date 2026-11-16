import type {
  CandyHouseId,
} from '../data/candyHogwartsLevels';
import type {
  LanguageQuizState,
  Match3BoosterId,
  QuizLanguageId,
  SavedJigsawSession,
  SavedMatch3Session,
  SavedOnetSession,
  SavedSudokuSession,
} from '../types/game';

export type OfflineGameId = 'match3' | 'jigsaw' | 'sudoku' | 'blocks' | 'seedQuiz';

export type OfflineUiLanguage = 'vi' | 'en';

export interface OfflinePuzzleDisciplineRecord<TSession> {
  currentStage: number;
  maxClearedStage: number;
  highScore: number;
  totalWins: number;
  bestStreak: number;
  currentStreak: number;
  activeSession: TSession | null;
}

export interface OfflineMatch3Progress {
  currentLevel: number;
  maxClearedLevel: number;
  highScore: number;
  totalWins: number;
  winStreak: number;
  bestStreak: number;
  house: CandyHouseId;
  boosters: Record<Match3BoosterId, number>;
  phoenixTalismans: number;
}

export interface OfflineJigsawProgress extends OfflinePuzzleDisciplineRecord<SavedJigsawSession> {
  restoredPaintings: string[];
}

export interface OfflineSeedQuizProgress {
  quizState: LanguageQuizState;
  highScore: number;
  totalCorrect: number;
  totalAnswered: number;
  currentStreak: number;
  bestStreak: number;
}

export interface OfflineSettingsState {
  sound: boolean;
  haptics: boolean;
  language: OfflineUiLanguage;
}

/**
 * State riêng biệt cho bản Mini-game Offline (§4.1 OFFLINE_MINIGAME_HANDOFF.md).
 * Hoàn toàn tách rời khỏi `ParkSimulation` và `burrow_hogsmeade_777_v3`.
 */
export interface OfflineMiniGameState {
  version: 1;
  coins: number;
  xp: number;
  match3: SavedMatch3Session | null;
  match3Progress: OfflineMatch3Progress;
  puzzleArcade: {
    jigsaw: OfflineJigsawProgress & Record<string, unknown>;
    sudoku: OfflinePuzzleDisciplineRecord<SavedSudokuSession> & Record<string, unknown>;
    blocks: OfflinePuzzleDisciplineRecord<SavedOnetSession> & Record<string, unknown>;
    phoenixTalismans: number;
  };
  seedQuiz: OfflineSeedQuizProgress & Record<string, unknown>;
  settings: OfflineSettingsState;
  lastActiveGame: OfflineGameId | null;
  updatedAt: number;
}

export interface OfflineLocalRecordRow {
  gameId: OfflineGameId;
  title: string;
  icon: string;
  stageLabel: string;
  highScoreLabel: string;
  winsLabel: string;
  hasActiveSession: boolean;
}

export type {
  CandyHouseId,
  LanguageQuizState,
  Match3BoosterId,
  QuizLanguageId,
  SavedJigsawSession,
  SavedMatch3Session,
  SavedOnetSession,
  SavedSudokuSession,
};
