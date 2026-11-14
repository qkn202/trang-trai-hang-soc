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
  mode: 'caro' | 'chess' | 'blocks' | 'jigsaw';
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
  {
    id: 'p9_burrow_autumn',
    title: 'Toàn Cảnh Trang Trại Hang Sóc Hoàng Hôn Thu',
    subtitle: 'Mái ngói nghiêng ấm khói bếp bên vườn bí ngô chín mọng và suối guồng nước Ottery.',
    imageUrl: '/paintings/jigsaw_burrow_autumn.jpg',
    accentColor: '#d97706',
  },
  {
    id: 'p10_steam_platform',
    title: 'Sân Ga Hơi Nước Đỏ Thẫm & Cú Tuyết Trắng',
    subtitle: 'Đầu máy hơi nước rực sáng làn khói sao bên rương da cổ điển và đèn lồng đồng.',
    imageUrl: '/paintings/jigsaw_steam_platform.jpg',
    accentColor: '#dc2626',
  },
  {
    id: 'p11_magic_alley',
    title: 'Phố Phép Đá Cuội Đêm Đèn Lồng Tím Biếc',
    subtitle: 'Tiệm đũa phép, cửa hiệu độc dược và sách cổ toả ánh vàng ấm dọc con hẻm quanh co.',
    imageUrl: '/paintings/jigsaw_magic_alley.jpg',
    accentColor: '#a855f7',
  },
  {
    id: 'p12_herbology_conservatory',
    title: 'Nhà Kính Thảo Dược & Vườn Chậu Mandrake',
    subtitle: 'Nắng mật ong xuyên qua vòm kính sắt rèn chiếu sáng dây leo phát quang và chuông lam.',
    imageUrl: '/paintings/jigsaw_herbology_conservatory.jpg',
    accentColor: '#16a34a',
  },
  {
    id: 'p13_silver_stag_lake',
    title: 'Thần Hộ Mệnh Hươu Bạc Bên Hồ Đen Cực Quang',
    subtitle: 'Hào quang bạc lam xoắn ốc phản chiếu lung linh giữa thảm nấm ngọc rừng khuya.',
    imageUrl: '/paintings/jigsaw_silver_stag_lake.jpg',
    accentColor: '#38bdf8',
  },
  {
    id: 'p14_butterbeer_hearth',
    title: 'Quán Ba Cây Chổi & Bếp Lửa Lục Bảo Đêm Tuyết',
    subtitle: 'Những cốc bia bơ sủi bọt kem béo ngậy bên lò sưởi ấm cúng nhìn ra mái làng phủ tuyết.',
    imageUrl: '/paintings/jigsaw_butterbeer_hearth.jpg',
    accentColor: '#f59e0b',
  },
  {
    id: 'p15_burrow_parlor',
    title: 'Phòng Khách Lò Sưởi Ấm Áp Gia Đình Weasley',
    subtitle: 'Đồng hồ phép 9 kim, khăn đan tự động và ánh lửa bập bùng trong đêm đoàn viên.',
    imageUrl: '/paintings/burrow_parlor_bg.jpg',
    accentColor: '#ea580c',
  },
  {
    id: 'p16_burrow_attic',
    title: 'Gác Xép Bùa Gặt & Kệ Mứt Ngọt Hang Sóc',
    subtitle: 'Gác gỗ thơm mùi quế hồi, hũ mứt dâu đỏ, lồng đèn sao và ô cửa tròn nhìn ra đồi thu.',
    imageUrl: '/paintings/burrow_attic_bg.jpg',
    accentColor: '#e11d48',
  },
  {
    id: 'p17_great_hall_chess',
    title: 'Đại Sảnh Cẩm Thạch & Bàn Cờ Phù Thủy Cổ Đại',
    subtitle: 'Những chiến binh đá cẩm thạch uy nghiêm dưới hàng cờ hiệu rực rỡ và ánh đuốc vàng.',
    imageUrl: '/paintings/great_hall_chess_bg.jpg',
    accentColor: '#ca8a04',
  },
  {
    id: 'p18_marauder_parchment',
    title: 'Mật Thất Bản Đồ Đạo Tặc & Hành Lang Cổ',
    subtitle: ' Tấm bản đồ giấy da cất giữ mọi lối đi bí mật dưới ánh nến tháp canh đêm khuya.',
    imageUrl: '/paintings/marauder_caro_bg.jpg',
    accentColor: '#b45309',
  },
  {
    id: 'p19_potions_dungeon',
    title: 'Hầm Độc Dược Lục Bảo & Vạc Đồng Cổ Ngữ',
    subtitle: 'Làn khói lục huyền ảo toả lên từ vạc thuốc bên dãy bình pha lê lấp lánh dưới hầm đá.',
    imageUrl: '/paintings/potions_runes_sudoku_bg.jpg',
    accentColor: '#10b981',
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
    jigsawCleared: 0,
    blockCleared: 0,
    featuredWinsCount: 0,
    restoredPaintings: [],
    totalPuzzlesSolved: 0,
    sudokuSession: null,
    caroSession: null,
    chessSession: null,
    onetSession: null,
    jigsawSession: null,
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

