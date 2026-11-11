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

export interface JigsawPaintingDef {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  accentColor: string;
}

export const JIGSAW_PAINTINGS: JigsawPaintingDef[] = [
  {
    id: 'p1_hogwarts_express',
    title: 'Tàu Tốc Hành Qua Cầu Đá Hoàng Hôn',
    subtitle: 'Đoàn tàu đỏ thẫm phun khói bụi sao băng qua cầu cạn vùng cao nguyên Scotland.',
    imageUrl: '/paintings/p1_hogwarts_express.jpg',
    accentColor: '#ea580c',
  },
  {
    id: 'p2_great_hall',
    title: 'Đại Sảnh Đường Ngàn Ngọn Nến Bay',
    subtitle: 'Bầu trời đêm đầy sao được phù phép trên vòm trần bên dưới hàng trăm ngọn nến lơ lửng.',
    imageUrl: '/paintings/p2_great_hall.jpg',
    accentColor: '#eab308',
  },
  {
    id: 'p3_hogsmeade_snow',
    title: 'Làng Tuyết Hogsmeade Đêm Đông Ấm Áp',
    subtitle: 'Ánh đèn lồng vàng óng hắt lên con phố đá cuội phủ tuyết trắng trước tiệm kẹo & đũa phép.',
    imageUrl: '/paintings/p3_hogsmeade_snow.jpg',
    accentColor: '#38bdf8',
  },
  {
    id: 'p4_quidditch_snitch',
    title: 'Đấu Trường Quidditch & Trái Snitch Vàng',
    subtitle: 'Cuộc rượt đuổi ngoạn mục giữa các tòa tháp cờ hiệu 4 Nhà rực rỡ nắng vàng.',
    imageUrl: '/paintings/p4_quidditch_snitch.jpg',
    accentColor: '#10b981',
  },
  {
    id: 'p5_unicorn_lake',
    title: 'Độc Giác Thú Bạc Bên Hồ Rừng Cấm',
    subtitle: ' Sinh vật thuần khiết tỏa hào quang lam ngọc giữa thảm nấm phát sáng huyền ảo.',
    imageUrl: '/paintings/p5_unicorn_lake.jpg',
    accentColor: '#06b6d4',
  },
  {
    id: 'p6_phoenix_astronomy',
    title: 'Phượng Hoàng Lửa Trên Đỉnh Tháp Thiên Văn',
    subtitle: 'Chim bất tử khoe bộ lông đỏ vàng rực cháy bên quả cầu thiên체 bằng đồng cổ.',
    imageUrl: '/paintings/p6_phoenix_astronomy.jpg',
    accentColor: '#f43f5e',
  },
  {
    id: 'p7_gringotts_dragon',
    title: 'Rồng Hoàng Kim Canh Giữ Hầm Báu Vật',
    subtitle: 'Kho vàng Galleon và cúp ngọc lấp lánh dưới ngọn đuốc lam sâu trong lòng đất.',
    imageUrl: '/paintings/p7_gringotts_dragon.jpg',
    accentColor: '#f59e0b',
  },
  {
    id: 'p8_hogwarts_moon',
    title: 'Đại Lâu Đài Hogwarts Dưới Ánh Trăng Tròn',
    subtitle: 'Đoàn thuyền đèn lồng lướt nhẹ trên mặt Hồ Đen phẳng lặng như gương.',
    imageUrl: '/paintings/p8_hogwarts_moon.jpg',
    accentColor: '#8b5cf6',
  },
];

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
    sudokuSession: null,
    caroSession: null,
    chessSession: null,
    onetSession: null,
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

