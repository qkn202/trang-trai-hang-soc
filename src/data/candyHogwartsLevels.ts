// 7 Năm Học Hogwarts × Candy Crush Saga — Nén Chuẩn 777 Màn (7 Năm × 111 Màn, 77 Chương)
// Đồng bộ 100% với trần MAX_MINIGAME_STAGE = 777 & kinh tế Sao Phép Thuật của Thung Lũng Hang Sóc.

import { HouseName } from '../types/game';
import { getStageStarReward, isMilestoneBossStage, MAX_MINIGAME_STAGE } from './match3Levels';

export const CANDY_HOGWARTS_TOTAL_SEASONS = 7;
export const CANDY_HOGWARTS_LEVELS_PER_SEASON = 111;
export const CANDY_HOGWARTS_TOTAL_LEVELS = MAX_MINIGAME_STAGE; // 7 × 111 = 777 màn
export const CANDY_HOGWARTS_CHAPTERS_PER_SEASON = 11;
export const CANDY_HOGWARTS_TOTAL_CHAPTERS =
  CANDY_HOGWARTS_TOTAL_SEASONS * CANDY_HOGWARTS_CHAPTERS_PER_SEASON; // 77 chương

export type CandyHouseId = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';

export type CandyDifficultyTier = 'normal' | 'hard' | 'nightmare' | 'exam' | 'boss' | 'finale';

export type CandySpecialType =
  | 'firecracker'
  | 'bomb'
  | 'dynamite'
  | 'tnt'
  | 'color_bomb'
  | 'seeker'
  | 'striped_h'
  | 'striped_v'
  | 'wrapped';

export function isRadialExplosiveSpecial(special: CandySpecialType | null | undefined): boolean {
  return (
    special === 'firecracker' ||
    special === 'bomb' ||
    special === 'dynamite' ||
    special === 'tnt' ||
    special === 'wrapped'
  );
}

export function getGardenscapesBlastRadius(
  special: CandySpecialType | null | undefined
): { gridRadius: number; maxHypot: number } | null {
  if (special === 'firecracker') return { gridRadius: 1, maxHypot: 1.45 };
  if (special === 'bomb' || special === 'wrapped') return { gridRadius: 2, maxHypot: 2.25 };
  if (special === 'dynamite') return { gridRadius: 3, maxHypot: 3.2 };
  if (special === 'tnt') return { gridRadius: 4, maxHypot: 4.25 };
  return null;
}

export function getSpecialRainbowChargeGain(
  special: CandySpecialType | null | undefined
): number {
  if (special === 'seeker') return 22;
  if (special === 'firecracker' || special === 'striped_h' || special === 'striped_v') return 28;
  if (special === 'bomb' || special === 'wrapped') return 45;
  if (special === 'dynamite') return 68;
  if (special === 'tnt') return 95;
  return 0;
}

/** Chuỗi thắng liên tiếp kích hoạt Siêu Cầu Vồng (Super Rainbow Blast — chuẩn Gardenscapes 2026) */
export const SUPER_RAINBOW_WIN_STREAK = 5;

export function isSuperRainbowActiveForStreak(winStreak: number | undefined | null): boolean {
  return Math.floor(Number(winStreak || 0)) >= SUPER_RAINBOW_WIN_STREAK;
}

export type CandyObjectiveType =
  | 'collect'
  | 'jelly'
  | 'ice'
  | 'frosting'
  | 'chocolate'
  | 'cauldron'
  | 'key_lock'
  | 'ingredient'
  | 'special_order'
  | 'petrify'
  | 'dementor'
  | 'decree'
  | 'fiendfyre'
  | 'horcrux'
  | 'boss'
  | 'score';

export interface CandySeasonDef {
  id: number; // 1..7
  yearLabel: string;
  title: string;
  fullTitle: string;
  range: [number, number];
  examLevelId: number | null;
  finaleLevelId: number;
  signatureKey: 'core' | 'petrify' | 'dementor' | 'maze' | 'decree' | 'fiendfyre' | 'horcrux';
  signatureIcon: string;
  signatureName: string;
  signatureDesc: string;
  accentColor: string;
}

export interface CandyChapterDef {
  id: number;
  globalChapterId: number;
  seasonId: number;
  chapterIndexInSeason: number;
  roman: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  range: [number, number];
  levelCount: number;
  accentColor: string;
}

export interface CandyHouseDef {
  id: CandyHouseId;
  houseName: HouseName;
  name: string;
  vnTitle: string;
  traits: string;
  primary: string;
  secondary: string;
  gradient: string;
  patronusName: string;
  patronusEmoji: string;
  passiveTitle: string;
  passiveDesc: string;
  activeDesc: string;
  emblemSvg: string;
}

export interface CandyTileTypeDef {
  id: number;
  key: string;
  name: string;
  shortName: string;
  color: string;
  light: string;
  dark: string;
  webp: string;
  png: string;
}

export interface CandyBossConfig {
  levelId: number;
  name: string;
  shortTitle: string;
  emoji: string;
  maxHp: number;
  castInterval: number;
  enrageBelowPct: number;
  hexType: 'swirl' | 'ice' | 'chocolate' | 'petrify' | 'fiendfyre' | 'dark_curse';
  hexName: string;
  isFinaleBoss: boolean;
}

export interface CandyPortalPair {
  from: { r: number; c: number };
  to: { r: number; c: number };
  color: string;
}

export interface CandyBombConfig {
  initialCount: number;
  intervalMoves: number;
  startTimer: number;
}

export interface CandyMazeConfig {
  intervalMoves: number;
  rows: number[];
}

export interface CandyObjectiveSpec {
  type: CandyObjectiveType;
  target?: number;
  tileId?: number;
  specialKind?: 'striped' | 'wrapped' | 'color_bomb' | 'seeker';
  label?: string;
}

export interface CandyHogwartsLevel {
  id: number;
  seasonId: number;
  chapterId: number;
  globalChapterId: number;
  chapterIndexInSeason: number;
  title: string;
  difficultyTier: CandyDifficultyTier;
  legacyDifficulty: 'normal' | 'hard' | 'boss';
  starReward: number;
  isBoss: boolean;
  isChapterBoss: boolean;
  isSeasonFinale: boolean;
  isExamTrial: boolean;
  bossConfig: CandyBossConfig | null;
  size: number;
  numColors: number;
  moves: number;
  stars: [number, number, number];
  rewardGalleons: number;
  mask: number[][];
  jellyGrid: number[][];
  iceGrid: number[][];
  frostingGrid: number[][];
  chocolateGrid: number[][];
  cauldronGrid: number[][];
  lockGrid: number[][];
  swirlGrid: number[][];
  petrifyGrid: number[][];
  dementorGrid: number[][];
  decreeGrid: number[][];
  fiendfyreGrid: number[][];
  horcruxGrid: number[][];
  mazeConfig: CandyMazeConfig | null;
  conveyorLoops: Array<Array<{ r: number; c: number }>>;
  ingredientTarget: number;
  ingredientSpawnCols: number[];
  ingredientExitCells: Array<{ r: number; c: number }>;
  portals: CandyPortalPair[];
  bombConfig: CandyBombConfig | null;
  objectives: CandyObjectiveSpec[];
}

export const HOGWARTS_SEASONS: ReadonlyArray<CandySeasonDef> = [
  {
    id: 1,
    yearLabel: 'Năm 1',
    title: 'Hòn Đá Phù Thủy',
    fullTitle: 'Năm 1: Hòn Đá Phù Thủy',
    range: [1, 111],
    examLevelId: null,
    finaleLevelId: 111,
    signatureKey: 'core',
    signatureIcon: '💎',
    signatureName: 'Kho Thuốc Nổ & Cầu Vồng Tích Năng',
    signatureDesc:
      'Lối chơi Gardenscapes Phép Thuật: Ghép 4 tạo Pháo Hoa, 5 tạo Bom, 6 tạo Thuốc Nổ, 7+ tạo Thùng TNT, vuông 2×2 tạo Chong Chóng Snitch & tích đầy 🌈 Cầu Vồng!',
    accentColor: '#d97706',
  },
  {
    id: 2,
    yearLabel: 'Năm 2',
    title: 'Phòng Chứa Bí Mật',
    fullTitle: 'Năm 2: Phòng Chứa Bí Mật',
    range: [112, 222],
    examLevelId: 112,
    finaleLevelId: 222,
    signatureKey: 'petrify',
    signatureIcon: '🐍',
    signatureName: 'Hoá Đá Tử Xà (1–3 lớp)',
    signatureDesc:
      'Ánh nhìn Tử Xà hoá đá viên kẹo khiến nó không thể đổi chỗ, rơi hay ghép màu cho tới khi nứt vỏ đá bởi ghép cạnh bên hoặc Kẹo Phép!',
    accentColor: '#10b981',
  },
  {
    id: 3,
    yearLabel: 'Năm 3',
    title: 'Tên Tù Nhân Ngục Azkaban',
    fullTitle: 'Năm 3: Tên Tù Nhân Ngục Azkaban',
    range: [223, 333],
    examLevelId: 223,
    finaleLevelId: 333,
    signatureKey: 'dementor',
    signatureIcon: '👻',
    signatureName: 'Giám Ngục Sương Băng (2–4 HP)',
    signatureDesc:
      'Giám Ngục chặn ô và phả sương băng sau 3 lượt. Ghép kẹo cạnh bên, kích nổ Kẹo Phép hoặc gọi Bạn Đồng Hành để xua tan Giám Ngục!',
    accentColor: '#38bdf8',
  },
  {
    id: 4,
    yearLabel: 'Năm 4',
    title: 'Chiếc Cốc Lửa',
    fullTitle: 'Năm 4: Chiếc Cốc Lửa',
    range: [334, 444],
    examLevelId: 334,
    finaleLevelId: 444,
    signatureKey: 'maze',
    signatureIcon: '🌪️',
    signatureName: 'Gió Lốc Mê Cung & Khay 10×10',
    signatureDesc:
      'Mở khoá Đại Bàn Cờ 10×10! Cứ mỗi 2–3 lượt, Gió Lốc Mê Cung Tam Pháp Thuật tự cuốn dịch chuyển hàng kẹo tạo biến số chiến thuật.',
    accentColor: '#f59e0b',
  },
  {
    id: 5,
    yearLabel: 'Năm 5',
    title: 'Hội Phượng Hoàng',
    fullTitle: 'Năm 5: Hội Phượng Hoàng',
    range: [445, 555],
    examLevelId: 445,
    finaleLevelId: 555,
    signatureKey: 'decree',
    signatureIcon: '📜',
    signatureName: 'Bia Sắc Lệnh Umbridge (2–4 HP)',
    signatureDesc:
      'Bia Sắc Lệnh Hồng toả vùng cấm phép 3×3: ghép 4, 5 hay T/L sát bia sẽ chỉ nổ thường mà không kết tinh Kẹo Phép cho đến khi đập vỡ bia!',
    accentColor: '#ec4899',
  },
  {
    id: 6,
    yearLabel: 'Năm 6',
    title: 'Hoàng Tử Lai',
    fullTitle: 'Năm 6: Hoàng Tử Lai',
    range: [556, 666],
    examLevelId: 556,
    finaleLevelId: 666,
    signatureKey: 'fiendfyre',
    signatureIcon: '🔥',
    signatureName: 'Lửa Địa Ngục Fiendfyre (2 HP)',
    signatureDesc:
      'Ngọn lửa hắc ám tự bùng lan thêm ô mới sau mỗi 2 lượt không bị dập và nung ngắn ngòi nổ Bom Đếm Ngược đứng gần!',
    accentColor: '#f97316',
  },
  {
    id: 7,
    yearLabel: 'Năm 7',
    title: 'Bảo Bối Tử Thần',
    fullTitle: 'Năm 7: Bảo Bối Tử Thần',
    range: [667, 777],
    examLevelId: 667,
    finaleLevelId: 777,
    signatureKey: 'horcrux',
    signatureIcon: '💀',
    signatureName: 'Trường Sinh Linh Giá (4–5 HP)',
    signatureDesc:
      'Khiên Hồn Tối Thượng (HP ≥ 4) miễn nhiễm ghép kẹo thường cạnh bên — dùng Kẹo Phép, Bạn Đồng Hành hoặc Búa Kẹo phá khiên trước! Nổ vỡ trừ thẳng 600 HP Trùm!',
    accentColor: '#c084fc',
  },
];

export function getCandySeasonByLevel(levelId: number): CandySeasonDef {
  const safe = Math.max(1, Math.min(CANDY_HOGWARTS_TOTAL_LEVELS, Math.floor(Number(levelId) || 1)));
  const idx = Math.min(
    CANDY_HOGWARTS_TOTAL_SEASONS - 1,
    Math.floor((safe - 1) / CANDY_HOGWARTS_LEVELS_PER_SEASON)
  );
  return HOGWARTS_SEASONS[idx];
}

export const CANDY_HOUSES: Record<CandyHouseId, CandyHouseDef> = {
  gryffindor: {
    id: 'gryffindor',
    houseName: 'Gryffindor',
    name: 'Gryffindor',
    vnTitle: 'Nhà Sư Tử Đỏ',
    traits: 'Can Đảm • Gan Dạ • Thượng Võ',
    primary: '#dc2626',
    secondary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 58%, #f59e0b 100%)',
    patronusName: 'Hươu Bạc',
    patronusEmoji: '🦌',
    passiveTitle: 'Trái Tim Sư Tử',
    passiveDesc: '+15% điểm nổ Pháo/Bom & +25% sát thương lên Trùm.',
    activeDesc:
      'Thanh tẩy mọi Giám Ngục, Chữ Thập Ánh Bạc quét tâm bàn, xuyên Khiên Linh Giá & tặng 1 Bom Nổ + 1 Pháo Hoa!',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#B91C1C" stroke="#FDE047" stroke-width="3.5"/><path d="M32 17L36 25L45 26L38.5 32.5L40 41.5L32 37L24 41.5L25.5 32.5L19 26L28 25L32 17Z" fill="#FDE047"/></svg>`,
  },
  slytherin: {
    id: 'slytherin',
    houseName: 'Slytherin',
    name: 'Slytherin',
    vnTitle: 'Nhà Rắn Xanh',
    traits: 'Tham Vọng • Khôn Ngoan • Quyết Đoán',
    primary: '#059669',
    secondary: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 62%, #94a3b8 100%)',
    patronusName: 'Rắn Thần',
    patronusEmoji: '🐍',
    passiveTitle: 'Uy Quyền Hầm Ngục',
    passiveDesc: 'Kìm hãm Sô-cô-la tự lan chậm đi một nửa & +25% điểm phá mọi Vật Cản.',
    activeDesc:
      'Thanh tẩy mọi Giám Ngục, phá tới 5 ô Vật Cản Hắc Ám / Khiên Linh Giá, lùi +3 nhịp Bom & kết tinh 1 Cầu Vồng!',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#047857" stroke="#E2E8F0" stroke-width="3.5"/><path d="M38 20C28 18 22 25 32 30C42 35 36 43 25 41" stroke="#A7F3D0" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  ravenclaw: {
    id: 'ravenclaw',
    houseName: 'Ravenclaw',
    name: 'Ravenclaw',
    vnTitle: 'Nhà Đại Bàng',
    traits: 'Trí Tuệ • Uyên Bác • Sáng Tạo',
    primary: '#0284c7',
    secondary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #0284c7 65%, #f59e0b 100%)',
    patronusName: 'Đại Bàng',
    patronusEmoji: '🦅',
    passiveTitle: 'Nhãn Quan Thông Thái',
    passiveDesc: 'Tích năng lượng nhanh +20%, gợi ý sớm (2.6s) & ưu tiên chỉ nước tạo Pháo/Bom.',
    activeDesc:
      'Thanh tẩy mọi Giám Ngục & triệu hồi 4 Chong Chóng Snitch bắn tỉa thẳng vào Bom / Linh Giá / Mục tiêu quan trọng nhất!',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#1D4ED8" stroke="#FBBF24" stroke-width="3.5"/><path d="M20 35C25 24 32 20 32 20C32 20 39 24 44 35L32 30L20 35Z" fill="#BAE6FD"/></svg>`,
  },
  hufflepuff: {
    id: 'hufflepuff',
    houseName: 'Hufflepuff',
    name: 'Hufflepuff',
    vnTitle: 'Nhà Lửng Vàng',
    traits: 'Trung Thành • Kiên Nhẫn • Chân Thật',
    primary: '#d97706',
    secondary: '#422006',
    gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 60%, #fde047 100%)',
    patronusName: 'Lửng Vàng',
    patronusEmoji: '🦡',
    passiveTitle: 'Phúc Lành Bền Bỉ',
    passiveDesc: 'Vào trận có sẵn 25% Hộ Mệnh & +12% điểm ghép kẹo.',
    activeDesc:
      'Thanh tẩy mọi Giám Ngục, tặng ngay +2 Lượt Đi Miễn Phí (lùi +2 nhịp Bom) & hoá phép 3 Pháo Hoa / Bom / Chong Chóng!',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#D97706" stroke="#FEF08A" stroke-width="3.5"/><path d="M23 23L32 18L41 23V35L32 42L23 35V23Z" fill="#422006" stroke="#FEF08A" stroke-width="2.5"/></svg>`,
  },
};

export function toCandyHouseId(house?: HouseName | string | null): CandyHouseId {
  const lower = String(house || 'gryffindor').toLowerCase();
  if (lower === 'slytherin' || lower === 'ravenclaw' || lower === 'hufflepuff') {
    return lower;
  }
  return 'gryffindor';
}

export function toEstateHouseName(houseId: CandyHouseId): HouseName {
  return CANDY_HOUSES[houseId].houseName;
}

export const CANDY_ASSET_REV = 'hs2';

export const CANDY_TILE_TYPES: ReadonlyArray<CandyTileTypeDef> = [
  {
    id: 0,
    key: 'bertie_red',
    name: 'Kẹo Dâu Mật Hang Sóc',
    shortName: 'Kẹo Dâu',
    color: '#e62e3d',
    light: '#ff7585',
    dark: '#9e1322',
    webp: `/paintings/candy-hogwarts/candy-0.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/candy-0.png?v=${CANDY_ASSET_REV}`,
  },
  {
    id: 1,
    key: 'bertie_orange',
    name: 'Kẹo Bí Ngô Bơ Đường',
    shortName: 'Kẹo Bí Ngô',
    color: '#f97316',
    light: '#ffb84d',
    dark: '#b45309',
    webp: `/paintings/candy-hogwarts/candy-1.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/candy-1.png?v=${CANDY_ASSET_REV}`,
  },
  {
    id: 2,
    key: 'bertie_green',
    name: 'Kẹo Lá Táo Bạc Hà',
    shortName: 'Kẹo Lá Táo',
    color: '#2fb638',
    light: '#86efac',
    dark: '#166534',
    webp: `/paintings/candy-hogwarts/candy-2.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/candy-2.png?v=${CANDY_ASSET_REV}`,
  },
  {
    id: 3,
    key: 'bertie_blue',
    name: 'Kẹo Việt Quất Sao Đêm',
    shortName: 'Kẹo Việt Quất',
    color: '#1d9bf0',
    light: '#7dd3fc',
    dark: '#0369a1',
    webp: `/paintings/candy-hogwarts/candy-3.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/candy-3.png?v=${CANDY_ASSET_REV}`,
  },
  {
    id: 4,
    key: 'chocolate_frog',
    name: 'Ếch Sô-cô-la Sữa',
    shortName: 'Ếch Sô-cô-la',
    color: '#8b4513',
    light: '#f5b041',
    dark: '#4a2511',
    webp: `/paintings/candy-hogwarts/candy-4.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/candy-4.png?v=${CANDY_ASSET_REV}`,
  },
  {
    id: 5,
    key: 'bertie_yellow',
    name: 'Kẹo Mật Ong Chanh Vàng',
    shortName: 'Kẹo Mật Ong',
    color: '#eab308',
    light: '#fef08a',
    dark: '#a16207',
    webp: `/paintings/candy-hogwarts/candy-5.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/candy-5.png?v=${CANDY_ASSET_REV}`,
  },
];

export const CANDY_OBSTACLE_ICONS: Record<string, string> = {
  jelly: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><rect x="4" y="4" width="36" height="36" rx="10" fill="rgba(190, 24, 93, 0.82)" stroke="#3b1e0e" stroke-width="3"/><rect x="6.5" y="6.5" width="31" height="31" rx="7.5" fill="none" stroke="#fbcfe8" stroke-width="1.6"/><path d="M11 13C15 9 25 9 31 13" stroke="#fff1f2" stroke-width="3" stroke-linecap="round"/></svg>`,
  ice: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><rect x="4" y="4" width="36" height="36" rx="9" fill="rgba(14, 116, 144, 0.72)" stroke="#3b1e0e" stroke-width="2.8"/><path d="M9 9L35 35M35 9L9 35" stroke="#e0f2fe" stroke-width="3.2" stroke-linecap="round"/></svg>`,
  frosting: `<picture><source srcset="/paintings/candy-hogwarts/candy-frosting.webp?v=${CANDY_ASSET_REV}" type="image/webp" /><img src="/paintings/candy-hogwarts/candy-frosting.png?v=${CANDY_ASSET_REV}" alt="" class="m3-goal-sprite" /></picture>`,
  chocolate: `<picture><source srcset="/paintings/candy-hogwarts/candy-chocolate.webp?v=${CANDY_ASSET_REV}" type="image/webp" /><img src="/paintings/candy-hogwarts/candy-chocolate.png?v=${CANDY_ASSET_REV}" alt="" class="m3-goal-sprite" /></picture>`,
  swirl: `<picture><source srcset="/paintings/candy-hogwarts/candy-swirl.webp?v=${CANDY_ASSET_REV}" type="image/webp" /><img src="/paintings/candy-hogwarts/candy-swirl.png?v=${CANDY_ASSET_REV}" alt="" class="m3-goal-sprite" /></picture>`,
  ingredient: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><polygon points="22,3 38,16 32,39 12,39 6,16" fill="#dc2626" stroke="#fde047" stroke-width="3"/><polygon points="22,8 31,18 22,33 13,18" fill="#fca5a5" opacity="0.65"/></svg>`,
  cauldron: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><ellipse cx="22" cy="13" rx="13" ry="5" fill="#10b981" stroke="#fde047" stroke-width="2.4"/><path d="M8 15H36L33 34C32 38 28 40 22 40C16 40 12 38 11 34L8 15Z" fill="#1e1b4b" stroke="#c084fc" stroke-width="2.6"/><circle cx="18" cy="11" r="2.5" fill="#bef264"/><circle cx="26" cy="9" r="2" fill="#bef264"/></svg>`,
  key_lock: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><path d="M14 19V13C14 8.5 17.5 5 22 5C26.5 5 30 8.5 30 13V19" fill="none" stroke="#fde047" stroke-width="3.6" stroke-linecap="round"/><rect x="9" y="18" width="26" height="21" rx="6" fill="#92400e" stroke="#fde047" stroke-width="2.8"/><circle cx="22" cy="27" r="3" fill="#fef08a"/><path d="M22 30V34" stroke="#fef08a" stroke-width="2.8" stroke-linecap="round"/></svg>`,
  petrify: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><rect x="4" y="4" width="36" height="36" rx="10" fill="#334155" stroke="#6ee7b7" stroke-width="2.8"/><path d="M15 30C15 23 29 21 29 14" stroke="#34d399" stroke-width="3.4" stroke-linecap="round"/><circle cx="29" cy="14" r="3" fill="#fde047"/><path d="M10 13L18 20M34 26L26 33" stroke="#cbd5e1" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  dementor: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><path d="M22 5C13 5 8 13 8 23L11 39L18 34L22 40L26 34L33 39L36 23C36 13 31 5 22 5Z" fill="#0f172a" stroke="#7dd3fc" stroke-width="2.6"/><ellipse cx="22" cy="18" rx="6" ry="7" fill="#020617" stroke="#38bdf8" stroke-width="1.8"/><circle cx="19.5" cy="17" r="1.5" fill="#bae6fd"/><circle cx="24.5" cy="17" r="1.5" fill="#bae6fd"/></svg>`,
  maze: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><rect x="4" y="4" width="36" height="36" rx="10" fill="#064e3b" stroke="#fde047" stroke-width="2.6"/><path d="M11 16H29L25 12M33 28H15L19 32" fill="none" stroke="#6ee7b7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  decree: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><rect x="6" y="4" width="32" height="36" rx="6" fill="#831843" stroke="#f9a8d4" stroke-width="2.8"/><rect x="11" y="9" width="22" height="26" rx="3" fill="none" stroke="#fde047" stroke-width="1.8"/><path d="M15 16H29M15 22H29M15 28H23" stroke="#fbcfe8" stroke-width="2.5" stroke-linecap="round"/><circle cx="28" cy="29" r="3.5" fill="#ec4899" stroke="#fde047" stroke-width="1.5"/></svg>`,
  fiendfyre: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><path d="M22 4C27 12 36 16 35 27C34 35 28 40 22 40C16 40 10 35 9 27C8 19 14 14 16 10C17 15 20 15 22 4Z" fill="#ea580c" stroke="#fde047" stroke-width="2.5"/><path d="M22 16C25 21 28 24 27 30C26 34 24 36 22 36C20 36 18 34 17 30C16 25 19 21 22 16Z" fill="#fef08a"/></svg>`,
  horcrux: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><polygon points="22,3 38,14 34,36 22,41 10,36 6,14" fill="#1e1b4b" stroke="#fde047" stroke-width="2.8"/><polygon points="22,10 31,18 28,32 22,35 16,32 13,18" fill="#064e3b" stroke="#34d399" stroke-width="2"/><circle cx="22" cy="22" r="4.5" fill="#a855f7" stroke="#fef08a" stroke-width="1.8"/></svg>`,
  boss: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><polygon points="22,3 39,13 35,35 22,41 9,35 5,13" fill="#581c87" stroke="#fde047" stroke-width="2.8"/><path d="M15 19L20 23M29 19L24 23" stroke="#f87171" stroke-width="3" stroke-linecap="round"/><path d="M16 31C19 28 25 28 28 31" stroke="#fde047" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  score: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><path d="M22 4L27.5 15.5L40 17.3L31 26.1L33.1 38.5L22 32.6L10.9 38.5L13 26.1L4 17.3L16.5 15.5L22 4Z" fill="#f59e0b" stroke="#fef9c3" stroke-width="2.6"/></svg>`,
  special_seeker: `<svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true"><path d="M3 16C10 10 15 14 17 20C11 22 6 21 3 16Z" fill="#fde047"/><path d="M41 16C34 10 29 14 27 20C33 22 38 21 41 16Z" fill="#fde047"/><circle cx="22" cy="23" r="10" fill="#f59e0b" stroke="#fef9c3" stroke-width="2.5"/></svg>`,
};

export const CANDY_COMBO_PRAISES = [
  'Sweet! • Ngọt Ngào!',
  'Tasty! • Tuyệt Hảo!',
  'Delicious! • Xuất Thần!',
  'Divine! • Thần Sầu!',
  'Bertie Crush!',
];

// 7 Bậc Tinh Thông Đũa Phép tự động mở theo Năm Học (1..7) để cân bằng chuẩn HP Đại Trùm ở 777 màn
export interface CandyWandMastery {
  rank: number;
  title: string;
  scoreBonusPct: number;
  bossDmgPct: number;
  patronusBonusPct: number;
}

const WAND_MASTERY_BY_YEAR: ReadonlyArray<CandyWandMastery> = [
  { rank: 1, title: 'Đũa Tập Sự Năm 1', scoreBonusPct: 0, bossDmgPct: 0, patronusBonusPct: 0 },
  { rank: 2, title: 'Đũa Phòng Vệ Năm 2', scoreBonusPct: 8, bossDmgPct: 12, patronusBonusPct: 5 },
  { rank: 3, title: 'Đũa Hộ Mệnh Năm 3', scoreBonusPct: 16, bossDmgPct: 24, patronusBonusPct: 10 },
  { rank: 4, title: 'Đũa Tam Pháp Thuật Năm 4', scoreBonusPct: 26, bossDmgPct: 38, patronusBonusPct: 12 },
  { rank: 5, title: 'Đũa Đoàn Quân Năm 5', scoreBonusPct: 36, bossDmgPct: 52, patronusBonusPct: 15 },
  { rank: 6, title: 'Đũa Hoàng Tử Lai Năm 6', scoreBonusPct: 48, bossDmgPct: 68, patronusBonusPct: 18 },
  { rank: 7, title: 'Đũa Cơm Nguội Tối Thượng', scoreBonusPct: 62, bossDmgPct: 85, patronusBonusPct: 20 },
];

export function getWandMasteryForLevel(levelId: number): CandyWandMastery {
  const season = getCandySeasonByLevel(levelId);
  return WAND_MASTERY_BY_YEAR[Math.min(WAND_MASTERY_BY_YEAR.length - 1, Math.max(0, season.id - 1))];
}

// 77 Chương Cốt Truyện Chính Thức xuyên suốt 7 Năm Học (11 Chương / Năm: Ch.1–10 = 10 màn, Ch.11 = 11 màn = 111 màn/Năm)
const SEASON_CHAPTER_CATALOG: Record<number, ReadonlyArray<[string, string]>> = {
  1: [
    ['Số 4 Đường Privet & Đàn Cú Đưa Thư', 'Mưa thư nhập học & Người Giữ Khoá giữa bão đêm'],
    ['Hẻm Xéo & Hầm Sâu Gringotts', 'Chuyến xe hầm mỏ, Khoá Gringotts & Đũa Phép chọn chủ'],
    ['Sân Ga 9¾ & Đại Sảnh Ngàn Nến', 'Tàu Tốc Hành Đỏ Thẫm, Kẹo Đậu Bertie & Ếch Sô-cô-la'],
    ['Chiếc Nón Phân Loại & Cầu Thang Xoay', 'Bốn Nhà Hogwarts & 142 nhịp cầu thang dịch chuyển'],
    ['Hầm Độc Dược & Đêm Halloween', 'Vạc Độc Dược sôi sục & Quỷ Khổng Lồ Núi hung hãn'],
    ['Chổi Nimbus 2000 & Trái Snitch Vàng', 'Tầm Thủ trẻ nhất thế kỷ trên bầu trời Quidditch'],
    ['Khu Cấm Thư Viện & Tấm Gương Erised', 'Áo Khoác Tàng Hình & khát vọng trong gương cổ'],
    ['Trứng Rồng Na Uy & Tháp Thiên Văn', 'Chú rồng lửa Norbert & chuyến đưa rồng lúc nửa đêm'],
    ['Hình Phạt Cấm Túc Trong Rừng Cấm', 'Dấu máu Bạch Kỳ Lân & bóng đen u tối dưới tán rừng'],
    ['Cửa Sập Fluffy & Bàn Cờ Khổng Lồ', 'Tiếng đàn ru ngủ, Chìa Khoá Cánh & ván cờ McGonagall'],
    ['Bảy Bình Độc Dược & Hòn Đá Phù Thủy', 'Vượt tường lửa đen đối đầu Quirrell & Bóng Ma Chúa Tể'],
  ],
  2: [
    ['Lời Cảnh Báo Của Gia Tinh Dobby', 'Phong ấn thư từ & rắc rối phép thuật đầu mùa hạ'],
    ['Trang Trại Hang Sóc & Xe Ford Bay', 'Giải cứu lúc nửa đêm & mái nhà ấm áp họ Weasley'],
    ['Hẻm Xéo Knockturn & Cây Liễu Roi', 'Bột Floo lạc lối & cú quật dữ dội của Cây Liễu cổ thụ'],
    ['Yêu Tinh Xanh & Lời Thì Thầm Trong Tường', 'Tiếng Xà Ngữ lạnh sống lưng dọc hành lang ngập nước'],
    ['Dòng Chữ Trên Tường & Bludger Điên', 'Phòng Chứa Bí Mật đã mở & hiểm nguy trên sân bay'],
    ['Câu Lạc Bộ Đấu Tay Đôi & Xà Ngữ', 'Bùa Giải Giới Expelliarmus & con rắn hổ mang đen'],
    ['Thuốc Đa Dịch & Nhà Vệ Sinh Myrtle', 'Một tháng ninh độc dược & manh mối chiếc bồn rửa cổ'],
    ['Cuốn Nhật Ký Đen Của Tom Riddle', 'Ký ức năm mươi năm trước hút người đọc vào trang giấy'],
    ['Theo Đàn Nhện Vào Rừng Cấm', 'Đại Nhện Aragog & vòng vây tơ trắng giữa rừng khuya'],
    ['Đường Ống Ngầm Của Tử Xà Nghìn Năm', 'Ánh nhìn Hoá Đá Tử Xà & lớp xác rắn khổng lồ'],
    ['Thanh Kiếm Gryffindor & Phòng Bí Mật', 'Tiếng hát Phượng Hoàng Fawkes & nanh độc huỷ Nhật Ký'],
  ],
  3: [
    ['Chuyến Xe Đò Hiệp Sĩ Giữa Đêm Đen', 'Ba tầng xe tím lao vun vút qua màn sương đêm'],
    ['Cơn Lạnh Giám Ngục Trên Tàu Tốc Hành', 'Sương băng phủ kín cửa kính & viên Sô-cô-la hồi sức'],
    ['Bằng Mã Buckbeak & Chiếc Tủ Ông Kẹ', 'Cái cúi chào kiêu hãnh & câu thần chú Riddikulus!'],
    ['Bản Đồ Đạo Tặc & Lối Ngầm Hogsmeade', 'Tôi xin trịnh trọng thề rằng tôi đang mưu đồ bất chính'],
    ['Tia Chớp Lửa & Thần Chú Hộ Mệnh Bạc', 'Luyện tập Expecto Patronum đẩy lùi bóng tối hút hồn'],
    ['Điềm Gở Grim & Lời Tiên Tri Cổ', 'Bã trà đen trong tách sứ & vận mệnh người hầu quay lại'],
    ['Căn Lều Hét Dưới Gốc Liễu Roi', 'Đường hầm bí mật dẫn tới sự thật mười hai năm trước'],
    ['Bí Mật Đuôi Trùn & Chân Nhồi Bông', 'Bốn người bạn Đạo Tặc lộ diện trong đêm định mệnh'],
    ['Trăng Tròn Biến Hình & Vòng Vây Azkaban', 'Tiếng hú Ma Sói & hơi lạnh trăm Giám Ngục áp sát'],
    ['Ba Vòng Xoay Thời Gian Của Hermione', 'Chạy đua từng khắc đồng hồ cát giải cứu hai sinh mạng'],
    ['Hươu Bạc Bờ Hồ Đen & Giải Cứu Sirius', 'Quang năng Thần Hộ Mệnh thanh tẩy trăm Giám Ngục!'],
  ],
  4: [
    ['Dấu Hiệu Hắc Ám Tại Cúp Thế Giới', 'Lều phép thuật vạn người & bầu trời rực lửa xanh'],
    ['Đoàn Xe Beauxbatons & Thuyền Durmstrang', 'Ngựa có cánh vượt mây & chiến thuyền trồi lên Hồ Đen'],
    ['Ngọn Lửa Xanh Của Chiếc Cốc Lửa', 'Bốn mảnh giấy da bật khỏi ngọn lửa cổ xưa'],
    ['Cảnh Giác Thường Trực Cùng Mắt Điên', 'Con mắt phép xoay tròn & bài học phòng thủ khắc nghiệt'],
    ['Bài Thi Thứ Nhất: Rồng Đuôi Gai', 'Triệu hồi chổi bay lượn qua biển lửa đoạt Trứng Vàng'],
    ['Dạ Vũ Giáng Sinh & Bí Ẩn Trứng Vàng', 'Đại Sảnh phủ băng bạc & giai điệu Nhân Ngư dưới nước'],
    ['Bài Thi Thứ Hai: Đáy Sâu Hồ Đen', 'Cỏ Mang Cá & một giờ giải cứu con tin giữa dòng xoáy'],
    ['Chậu Tưởng Ký & Phiên Xét Xử Cũ', 'Lật mở ký ức bạc trắng về những Tử Thần Thực Tử'],
    ['Bước Vào Mê Cung Tam Pháp Thuật', 'Bờ giậu sống khép mở & Gió Lốc Mê Cung đảo chiều kẹo'],
    ['Chiếc Cúp Khóa Cảng & Nghĩa Địa Đêm', 'Cạm bẫy dịch chuyển tới ngôi mộ đá Little Hangleton'],
    ['Voldemort Tái Sinh & Song Đũa Kết Nối', 'Sợi tơ vàng Priori Incantatem mở đường máu trở về'],
  ],
  5: [
    ['Giám Ngục Tấn Công Hẻm Magnolia', 'Ánh chớp Hộ Mệnh giữa khu phố Muggle oi bức'],
    ['Số 12 Quảng Trường Grimmauld', 'Tổng hành dinh Hội Phượng Hoàng ẩn giữa hai dãy phố'],
    ['Bút Lông Máu & Bia Sắc Lệnh Hồng', 'Vùng cấm phép 3×3 của Thanh Tra Tối Cao Umbridge'],
    ['Lời Thề Quán Đầu Heo & Đoàn Quân DA', 'Hai mươi tám chữ ký rèn luyện phép thuật thực chiến'],
    ['Phòng Cần Thiết & Hộ Mệnh Toàn Đội', 'Căn phòng biến hoá theo ý nguyện tiếp sức kháng cự'],
    ['Giấc Mơ Hành Lang Đen & Đòn Rắn Cắn', 'Thị kiến xuyên màn đêm sâu dưới tầng ngầm Bộ Pháp Thuật'],
    ['Bế Quan Bí Thuật Dưới Hầm Lạnh', 'Cuộc đấu trí căng thẳng khóa chặt tâm thức trước Chúa Tể'],
    ['Pháo Hoa Nổi Loạn Anh Em Weasley', 'Đầm lầy phép thuật & màn tung bay chấn động Hogwarts'],
    ['Kỳ Thi Pháp Thuật Thường Đẳng O.W.L.', 'Đại khảo hạch lý thuyết lẫn thực hành bùa chú toàn khóa'],
    ['Cưỡi Vong Mã Bay Tới Sở Bảo Mật', 'Vượt màn đêm tới căn phòng chín vạn quả cầu tiên tri'],
    ['Đại Chiến Sở Bảo Mật & Ánh Lửa Dumbledore', 'Sóng xung kích phép thuật nghiền nát trùng vây hắc ám'],
  ],
  6: [
    ['Lời Thề Bất Khả Bội Đường Bàn Xoay', 'Sợi lửa vàng quấn chặt cổ tay giữa đêm mưa tầm tã'],
    ['Cuốn Sách Cũ Của Hoàng Tử Lai', 'Những dòng chú giải bí mật biến đổi mọi công thức dược'],
    ['Một Giọt Phúc Lạc Dược Felix Felicis', 'Ánh vàng may mắn dẫn lối qua mọi khe hẹp hiểm nghèo'],
    ['Ký Ức Đen Tối Về Gia Tộc Gaunt', 'Chiếc Nhẫn Đá Đen & nguồn cội của Chúa Tể Hắc Ám'],
    ['Dây Chuyền Nguyền Rủa & Rượu Độc', 'Âm mưu thâm độc rình rập phía sau các hành lang tuyết'],
    ['Bí Mật Bảy Mảnh Trường Sinh Linh Giá', 'Ký ức thật sự của Slughorn mở khóa tử huyệt Voldemort'],
    ['Chiếc Tủ Biến Mất Trong Phòng Cần Thiết', 'Cầu nối bóng tối lén mở cổng thành cho Tử Thần Thực Tử'],
    ['Sectumsempra & Nước Mắt Tưởng Ký', 'Lưỡi kiếm vô hình & hiểm hoạ từ những trang sách lạ'],
    ['Hang Đá Biển Đen & Chén Độc Tuyệt Vọng', 'Vượt sóng dữ tìm Mề Đay giữa mặt hồ đen tĩnh lặng'],
    ['Biển Lửa Địa Ngục Đẩy Lùi Âm Binh', 'Vòng bão lửa hắc ám thiêu rụi hàng trăm bàn tay lạnh'],
    ['Dấu Hiệu Hắc Ám Đỉnh Tháp Thiên Văn', 'Đêm bi tráng khắc sâu lời thề quyết chiến cuối cùng'],
  ],
  7: [
    ['Trận Không Chiến Bảy Potter', 'Bầu trời rực chớp phép & cuộc hộ tống sinh tử trong đêm'],
    ['Đột Nhập Bộ Pháp Thuật Đoạt Mề Đay', 'Cải trang Đa Dịch phá huỷ sào huyệt Thanh Tra Hắc Ám'],
    ['Rừng Dean Tuyết Trắng & Kiếm Dưới Hồ', 'Hươu Bạc dẫn lối chém vỡ Mề Đay Trường Sinh Linh Giá'],
    ['Huyền Thoại Ba Bảo Bối Tử Thần', 'Đũa Cơm Nguội, Đá Phục Sinh & Áo Khoác Tàng Hình'],
    ['Phá Vòng Vây Phủ Thái Ấp Malfoy', 'Cú độn thổ anh dũng của Dobby giữa cơn mưa nguyền rủa'],
    ['Đột Phá Hầm Ngục Nhà Lestrange', 'Chiếc Cúp Hufflepuff nhân bản & Rồng Thép phun lửa trắng'],
    ['Đường Hầm Đầu Heo Về Thành Hogwarts', 'Hiệu triệu toàn trường dựng đại kết giới bảo vệ lâu đài'],
    ['Nanh Tử Xà & Bão Lửa Fiendfyre', 'Thiêu huỷ Vương Miện Ravenclaw giữa biển lửa Phòng Cần Thiết'],
    ['Ký Ức Hoàng Tử Lai & Sự Thật Cuối', 'Giọt nước mắt bạc & lòng trung thành bất diệt: Always'],
    ['Viên Đá Phục Sinh Trong Rừng Cấm', 'Bước chân tĩnh tại đối mặt lời nguyền giữa vòng vây'],
    ['ĐẠI CHIẾN HOGWARTS: Bình Minh Toàn Thắng', 'Neville chém đứt Nagini & đòn phản nguyền hạ gục Voldemort!'],
  ],
};

const FIRST_100_TITLES = [
  'Đứa Bé Sống Sót',
  'Chiếc Môtô Bay Của Sirius',
  'Gầm Cầu Thang Chật Hẹp',
  'Nhà Bò Sát Trong Sở Thú',
  'Tấm Kính Biến Mất Kỳ Lạ',
  'Phong Thư Đề Mực Xanh Ngọc',
  'Con Dấu Sáp Đỏ Chữ H',
  'Phòng Ngủ Nhỏ Tầng Hai',
  'Trận Mưa Thư Qua Ống Khói',
  'TRÙM: Đàn Cú Bao Vây Đường Privet',
  'Chuyến Chạy Trốn Trong Mưa',
  'Khách Sạn Đường Tàu Cũ',
  'Một Trăm Lá Thư Chủ Nhật',
  'Con Thuyền Ra Mỏm Đá Biển',
  'Chòi Gỗ Giữa Cơn Bão Đêm',
  'Đồng Hồ Điểm Mười Hai Giờ',
  'Tiếng Đập Cửa Rung Chuyển',
  'Chiếc Bánh Sinh Nhật Hơi Bẹp',
  'Chiếc Dù Hồng Của Hagrid',
  'TRÙM: Người Giữ Khoá Trường Hogwarts',
  'Tờ Nhật Báo Tiên Tri Buổi Sáng',
  'Quán Cái Vạc Lủng',
  'Ba Viên Gạch Phía Trên Thùng Rác',
  'Cánh Cổng Mở Vào Hẻm Xéo',
  'TRÙM MỐC: Ngân Hàng Phù Thủy Gringotts',
  'Lời Cảnh Báo Của Yêu Tinh',
  'Chuyến Xe Kéo Lao Xuống Vực Sâu',
  'Ngọn Lửa Rồng Dưới Lòng Đất',
  'Hầm Chứa Vàng Nhà Potter',
  'TRÙM: Bí Mật Hầm Số 713',
  'Tiệm Áo Chùng Phu Nhân Malkin',
  'Cuộc Chạm Trán Cậu Ấm Tóc Bạch Kim',
  'Hiệu Sách Phú Quý Và Cơ Hàn',
  'Vạc Đồng Thiếc Cỡ Số 2',
  'Tiệm Dược Liệu Mùi Thảo Mộc',
  'Đôi Mắt Hổ Phách Của Cú Hedwig',
  'Tiệm Đũa Phép Ollivanders',
  'Gỗ Nhựa Ruồi Và Lông Phượng Hoàng',
  'Cây Đũa Phép Tự Chọn Chủ Nhân',
  'TRÙM: Hai Lõi Phượng Hoàng Song Sinh',
  'Nhà Ga Ngã Tư Vua Nhộn Nhịp',
  'Lao Xuyên Bức Tường Ga 9¾',
  'Tàu Tốc Hành Đỏ Thẫm Hogwarts',
  'Khoang Tàu Cuối Toa Và Cậu Bạn Ron',
  'Kẹo Đậu Đủ Vị Bertie Bott',
  'Thẻ Bài Ếch Sô-cô-la Dumbledore',
  'Con Cóc Trevor Đi Lạc',
  'Cô Bạn Tóc Xù Biết Tuốt',
  'Đoàn Thuyền Vượt Mặt Hồ Đen',
  'TRÙM: Bầu Trời Ngàn Nến Đại Sảnh Đường',
  'Bài Hát Của Chiếc Nón Phân Loại',
  'Bốn Chiếc Bàn Dài Của Bốn Nhà',
  'Đại Tiệc Khai Giảng Linh Đình',
  'Mật Khẩu Bà Béo Canh Cửa',
  'Một Trăm Bốn Mươi Hai Cầu Thang',
  'Lớp Biến Hình Của Cô McGonagall',
  'Hầm Độc Dược Lạnh Lẽo Của Thầy Snape',
  'Lớp Bùa Chú: Wingardium Leviosa!',
  'Đêm Lễ Hội Hóa Trang Halloween',
  'TRÙM: Quỷ Khổng Lồ Núi Trong Nhà Vệ Sinh',
  'Cây Chổi Tia Chớp Nimbus 2000',
  'Ba Trái Bóng Trên Sân Quidditch',
  'Tầm Thủ Trẻ Nhất Một Thế Kỷ',
  'Cây Chổi Bị Ếm Bùa Giữa Không Trung',
  'Áo Chùng Bốc Cháy Trên Khán Đài',
  'Cú Đớp Trái Snitch Ngoạn Mục',
  'Chòi Gỗ Thơm Mùi Trà Của Hagrid',
  'Cái Tên Nicolas Flamel Bí Ẩn',
  'Buổi Sáng Giáng Sinh Ở Hogwarts',
  'TRÙM: Tấm Áo Khoác Tàng Hình Gia Truyền',
  'Hành Lang Đêm Khu Cấm Thư Viện',
  'Cuốn Sách Gào Thét Trong Bóng Tối',
  'Căn Phòng Bỏ Trống Và Tấm Gương Lớn',
  'Khát Vọng Sâu Thẳm: Erised',
  'Lời Khuyên Của Cụ Dumbledore',
  'Quả Trứng Rồng Đen Trên Bếp Lửa',
  'Chú Rồng Lưng Xoáy Na Uy Norbert',
  'Chuyến Đưa Rồng Lên Tháp Thiên Văn',
  'Hình Phạt Cấm Túc Lúc Nửa Đêm',
  'TRÙM: Bóng Đen Uống Máu Kỳ Lân Rừng Cấm',
  'Kỳ Thi Cuối Năm Nóng Bức',
  'Vết Thẹo Tia Chớp Đau Nhói',
  'Bí Mật Quả Trứng Rồng Bị Lộ',
  'Tiếng Đàn Hạc Ru Ngủ Fluffy',
  'Cánh Cửa Sập Mở Vào Đêm Đen',
  'Vòng Xiết Của Bẫy Thực Vật Quỷ',
  'Ánh Nắng Mặt Trời Lumos Solem!',
  'Đàn Chìa Khoá Cổ Có Cánh Bạc',
  'Chiếc Chìa Khoá Gãy Cánh Giữa Bầu Trời',
  'TRÙM: Bàn Cờ Phù Thủy Khổng Lồ Của McGonagall',
  'Nước Cờ Thí Mình Của Hiệp Sĩ Ron',
  'Căn Phòng Mùi Quỷ Khổng Lồ',
  'Bức Tường Lửa Đen Và Lửa Tím',
  'Câu Đố Bảy Bình Độc Dược Của Snape',
  'Giọt Thuốc Nhỏ Tiến Qua Ngọn Lửa Đen',
  'Người Đứng Trước Tấm Gương Ảo Ảnh',
  'Bí Mật Sau Chiếc Khăn Quấn Đầu',
  'Viên Đá Đỏ Trong Túi Áo Harry',
  'Sức Mạnh Tình Thương Cổ Xưa',
  'ĐẠI TRÙM CHƯƠNG X: Hộ Vệ Gương Ảo Ảnh Erised',
];

const STAGE_ACTION_PREFIXES = [
  'Mật Đạo',
  'Giải Mã',
  'Phá Ấn',
  'Vượt Ải',
  'Truy Vết',
  'Kết Giới',
  'Đột Kích',
  'Thắp Sáng',
  'Khảo Hạch',
  'Huyền Bí',
];

export function getSeasonChapters(seasonId: number): CandyChapterDef[] {
  const sIdx = Math.max(
    1,
    Math.min(CANDY_HOGWARTS_TOTAL_SEASONS, Math.floor(Number(seasonId) || 1))
  );
  const seasonMeta = HOGWARTS_SEASONS[sIdx - 1];
  const entries = SEASON_CHAPTER_CATALOG[sIdx] || SEASON_CHAPTER_CATALOG[1];
  const seasonStart = seasonMeta.range[0];

  return entries.map(([title, subtitle], idx) => {
    const chInSeason = idx + 1;
    const globalId = (sIdx - 1) * CANDY_HOGWARTS_CHAPTERS_PER_SEASON + chInSeason;
    const start = seasonStart + idx * 10;
    const end =
      chInSeason === CANDY_HOGWARTS_CHAPTERS_PER_SEASON ? seasonMeta.range[1] : start + 9;
    return {
      id: globalId,
      globalChapterId: globalId,
      seasonId: sIdx,
      chapterIndexInSeason: chInSeason,
      roman: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][idx],
      title: `Chương ${chInSeason}: ${title}`,
      shortTitle: title,
      subtitle,
      range: [start, end],
      levelCount: end - start + 1,
      accentColor: seasonMeta.accentColor,
    };
  });
}

export function getCandyChapterForLevel(levelId: number): CandyChapterDef {
  const safe = Math.max(1, Math.min(CANDY_HOGWARTS_TOTAL_LEVELS, Math.floor(Number(levelId) || 1)));
  const season = getCandySeasonByLevel(safe);
  const offset = safe - season.range[0];
  const chIdx = Math.min(CANDY_HOGWARTS_CHAPTERS_PER_SEASON - 1, Math.floor(offset / 10));
  return getSeasonChapters(season.id)[chIdx];
}

const BOSS_ROSTER_EARLY: Record<number, Omit<CandyBossConfig, 'isFinaleBoss'>> = {
  10: {
    levelId: 10,
    name: 'Đàn Cú Phép Đường Privet',
    shortTitle: 'Đàn Cú Phép',
    emoji: '🦉',
    maxHp: 1550,
    castInterval: 4,
    enrageBelowPct: 0.5,
    hexType: 'swirl',
    hexName: 'Thả Thư Xoáy Cam Thảo',
  },
  20: {
    levelId: 20,
    name: 'Người Giữ Khoá Rubeus',
    shortTitle: 'Người Giữ Khoá',
    emoji: '🔑',
    maxHp: 1850,
    castInterval: 4,
    enrageBelowPct: 0.5,
    hexType: 'ice',
    hexName: 'Gió Bão Đóng Băng',
  },
  25: {
    levelId: 25,
    name: 'Quản Kho Yêu Tinh Hầm Gringotts',
    shortTitle: 'Yêu Tinh Gringotts',
    emoji: '🏦',
    maxHp: 1980,
    castInterval: 4,
    enrageBelowPct: 0.5,
    hexType: 'swirl',
    hexName: 'Khoá Sắt Ngân Khố',
  },
  30: {
    levelId: 30,
    name: 'Rồng Lửa Hầm Gringotts',
    shortTitle: 'Rồng Gringotts',
    emoji: '🐉',
    maxHp: 2100,
    castInterval: 4,
    enrageBelowPct: 0.5,
    hexType: 'swirl',
    hexName: 'Khói Đá Hầm Sâu',
  },
  40: {
    levelId: 40,
    name: 'Ảo Ảnh Đũa Phép Song Sinh',
    shortTitle: 'Đũa Song Sinh',
    emoji: '⚡',
    maxHp: 2350,
    castInterval: 4,
    enrageBelowPct: 0.5,
    hexType: 'ice',
    hexName: 'Tia Phép Phong Băng',
  },
  50: {
    levelId: 50,
    name: 'Nam Tước Đẫm Máu',
    shortTitle: 'Nam Tước Ma',
    emoji: '🕯️',
    maxHp: 2580,
    castInterval: 4,
    enrageBelowPct: 0.5,
    hexType: 'chocolate',
    hexName: 'Bóng Đêm Sô-cô-la',
  },
  60: {
    levelId: 60,
    name: 'Quỷ Khổng Lồ Núi',
    shortTitle: 'Quỷ Khổng Lồ',
    emoji: '🧌',
    maxHp: 2820,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'swirl',
    hexName: 'Chùy Gỗ Nện Bàn',
  },
  70: {
    levelId: 70,
    name: 'Hồn Ma Khu Cấm Thư Viện',
    shortTitle: 'Ma Cấm Thư',
    emoji: '📜',
    maxHp: 3050,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'ice',
    hexName: 'Hơi Lạnh Cấm Thư',
  },
  80: {
    levelId: 80,
    name: 'Bóng Đen Rừng Cấm',
    shortTitle: 'Bóng Đen Rừng Cấm',
    emoji: '🌑',
    maxHp: 3280,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'chocolate',
    hexName: 'Lời Nguyền Bóng Tối',
  },
  90: {
    levelId: 90,
    name: 'Hoàng Hậu Cờ Phù Thủy',
    shortTitle: 'Hậu Cờ Phép',
    emoji: '♟️',
    maxHp: 3480,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'ice',
    hexName: 'Chiếu Tướng Băng Giá',
  },
  100: {
    levelId: 100,
    name: 'Hộ Vệ Gương Ảo Ảnh Erised',
    shortTitle: 'Gương Ảo Ảnh',
    emoji: '🪞',
    maxHp: 3750,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'dark_curse',
    hexName: 'Bùa Chú Ảo Ảnh',
  },
};

const YEAR_BOSS_ARCHETYPES: Record<
  number,
  ReadonlyArray<{
    name: string;
    shortTitle: string;
    emoji: string;
    hexType: CandyBossConfig['hexType'];
    hexName: string;
  }>
> = {
  1: [
    { name: 'Chó Ba Đầu Fluffy Canh Cửa Sập', shortTitle: 'Fluffy Ba Đầu', emoji: '🐕', hexType: 'swirl', hexName: 'Tiếng Gầm Ba Đầu' },
    { name: 'Bẫy Thực Vật Quỷ Khổng Lồ', shortTitle: 'Thực Vật Quỷ', emoji: '🌿', hexType: 'chocolate', hexName: 'Dây Leo Siết Chặt' },
    { name: 'Đàn Chìa Khoá Cánh Bạc Cổ Xưa', shortTitle: 'Chúa Chìa Khoá', emoji: '🗝️', hexType: 'ice', hexName: 'Cơn Lốc Cánh Thép' },
    { name: 'Kỵ Sĩ Đá Cờ Phù Thủy McGonagall', shortTitle: 'Kỵ Sĩ Cờ Đá', emoji: '♟️', hexType: 'swirl', hexName: 'Nước Chiếu Huỷ Diệt' },
    { name: 'Ảo Ảnh Lửa Đen Độc Dược Snape', shortTitle: 'Tường Lửa Đen', emoji: '🧪', hexType: 'dark_curse', hexName: 'Bức Tường Lửa Tím' },
  ],
  2: [
    { name: 'Cây Liễu Roi Điên Cuồng', shortTitle: 'Cây Liễu Roi', emoji: '🌳', hexType: 'petrify', hexName: 'Cành Cây Hoá Thạch' },
    { name: 'Bầy Yêu Tinh Xanh Cornwall', shortTitle: 'Yêu Tinh Xanh', emoji: '🧚', hexType: 'swirl', hexName: 'Trò Quậy Phá Khung Bàn' },
    { name: 'Trái Bludger Bị Ếm Bùa Độc', shortTitle: 'Bludger Điên', emoji: '☄️', hexType: 'petrify', hexName: 'Cú Đập Hoá Đá' },
    { name: 'Đại Nhện Aragog Rừng Cấm', shortTitle: 'Nhện Chúa Aragog', emoji: '🕷️', hexType: 'chocolate', hexName: 'Mạng Tơ Hắc Ám' },
    { name: 'Bóng Ma Ký Ức Nhật Ký Riddle', shortTitle: 'Ký Ức Riddle', emoji: '📓', hexType: 'petrify', hexName: 'Ánh Nhìn Tử Xà' },
  ],
  3: [
    { name: 'Ông Kẹ Boggart Biến Ảo', shortTitle: 'Ông Kẹ Boggart', emoji: '🎭', hexType: 'ice', hexName: 'Nỗi Sợ Băng Giá' },
    { name: 'Đội Trưởng Giám Ngục Azkaban', shortTitle: 'Giám Ngục Trưởng', emoji: '👻', hexType: 'ice', hexName: 'Nụ Hôn Hút Hồn' },
    { name: 'Tướng Quân Lều Hét Đêm Trăng', shortTitle: 'Bóng Đêm Lều Hét', emoji: '🐺', hexType: 'swirl', hexName: 'Tiếng Hú Đêm Trăng' },
    { name: 'Đao Phủ Hắc Ám Bộ Pháp Thuật', shortTitle: 'Đao Phủ Hắc Ám', emoji: '🪓', hexType: 'chocolate', hexName: 'Xiềng Xích U Ám' },
    { name: 'Kẻ Phản Bội Đuôi Trùn', shortTitle: 'Đuôi Trùn Bạc', emoji: '🐀', hexType: 'dark_curse', hexName: 'Bùa Phản Trắc' },
  ],
  4: [
    { name: 'Rồng Đuôi Gai Hungary Hung Hãn', shortTitle: 'Rồng Đuôi Gai', emoji: '🐲', hexType: 'fiendfyre', hexName: 'Hơi Thở Lửa Rồng' },
    { name: 'Thuỷ Quái Nhân Ngư Đáy Hồ Đen', shortTitle: 'Thuỷ Quái Hồ Đen', emoji: '🧜', hexType: 'ice', hexName: 'Xoáy Nước Đáy Hồ' },
    { name: 'Nhân Sư Canh Mê Cung Tam Pháp Thuật', shortTitle: 'Nhân Sư Mê Cung', emoji: '🦁', hexType: 'petrify', hexName: 'Câu Đố Hoá Đá' },
    { name: 'Barty Crouch Con Cải Trang', shortTitle: 'Barty Crouch Jr', emoji: '👁️', hexType: 'dark_curse', hexName: 'Lời Nguyền Độc Đoán' },
    { name: 'Tử Thần Thực Tử Nghĩa Địa Little Hangleton', shortTitle: 'Tử Thần Thực Tử', emoji: '💀', hexType: 'dark_curse', hexName: 'Dấu Hiệu Hắc Ám' },
  ],
  5: [
    { name: 'Thanh Tra Tối Cao Dolores Umbridge', shortTitle: 'Bà Umbridge', emoji: '🎀', hexType: 'petrify', hexName: 'Bút Lông Khắc Chữ' },
    { name: 'Đội Thẩm Vấn Bộ Pháp Thuật', shortTitle: 'Đội Thẩm Vấn', emoji: '📜', hexType: 'ice', hexName: 'Sắc Lệnh Phong Toả' },
    { name: 'Lucius Malfoy Tại Sở Bảo Mật', shortTitle: 'Lucius Malfoy', emoji: '🐍', hexType: 'dark_curse', hexName: 'Trượng Rắn Hắc Ám' },
    { name: 'Antonin Dolohov Lời Nguyền Tím', shortTitle: 'Phù Thủy Dolohov', emoji: '⚡', hexType: 'chocolate', hexName: 'Lưỡi Lửa Tím Câm Lặng' },
    { name: 'Bellatrix Lestrange Cuồng Loạn', shortTitle: 'Bellatrix', emoji: '🗡️', hexType: 'dark_curse', hexName: 'Crucio Xoáy Đen' },
  ],
  6: [
    { name: 'Thủ Lĩnh Sói Xám Fenrir Greyback', shortTitle: 'Sói Xám Fenrir', emoji: '🐺', hexType: 'chocolate', hexName: 'Vết Cào Hắc Ám' },
    { name: 'Dây Chuyền Opal Bị Nguyền Rủa', shortTitle: 'Cổ Vật Nguyền Rủa', emoji: '📿', hexType: 'ice', hexName: 'Băng Độc Thấm Tim' },
    { name: 'Đàn Âm Binh Inferi Dưới Hồ Đen', shortTitle: 'Đàn Âm Binh', emoji: '🧟', hexType: 'ice', hexName: 'Bàn Tay Lạnh Kéo Chìm' },
    { name: 'Tử Thần Thực Tử Tháp Thiên Văn', shortTitle: 'Tử Thần Tháp Cao', emoji: '🌩️', hexType: 'fiendfyre', hexName: 'Lửa Xanh Hắc Ám' },
    { name: 'Hoàng Tử Lai & Bùa Cắt Sâu', shortTitle: 'Hoàng Tử Lai', emoji: '📘', hexType: 'dark_curse', hexName: 'Sectumsempra Phản Đòn' },
  ],
  7: [
    { name: 'Yaxley & Bộ Pháp Thuật Sụp Đổ', shortTitle: 'Thủ Lĩnh Yaxley', emoji: '🦅', hexType: 'dark_curse', hexName: 'Lưới Tầm Nã Cấm Kỵ' },
    { name: 'Đại Xà Nagini Tại Thung Lũng Godric', shortTitle: 'Đại Xà Nagini', emoji: '🐍', hexType: 'petrify', hexName: 'Nọc Độc Tử Thần' },
    { name: 'Rồng Thép Bảo Vệ Hầm Lestrange', shortTitle: 'Rồng Hầm Sâu', emoji: '🐉', hexType: 'fiendfyre', hexName: 'Lửa Trắng Hầm Ngục' },
    { name: 'Binh Đoàn Khổng Lồ Vây Thành Hogwarts', shortTitle: 'Khổng Lồ Hắc Ám', emoji: '🗿', hexType: 'petrify', hexName: 'Đá Tảng Vỡ Thành' },
    { name: 'Bellatrix & Cận Vệ Chúa Tể Hắc Ám', shortTitle: 'Cận Vệ Hắc Ám', emoji: '💀', hexType: 'fiendfyre', hexName: 'Bão Lửa Địa Ngục' },
  ],
};

const SEASON_FINALE_BOSSES: Record<number, CandyBossConfig> = {
  111: {
    levelId: 111,
    name: 'ĐẠI KẾT CỤC NĂM 1: Giáo Sư Quirrell & Bóng Ma Voldemort',
    shortTitle: 'Quirrell & Voldemort',
    emoji: '🐍',
    maxHp: 4200,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'dark_curse',
    hexName: 'Lời Nguyền Chiếm Đoạt Đá Đỏ',
    isFinaleBoss: true,
  },
  222: {
    levelId: 222,
    name: 'ĐẠI KẾT CỤC NĂM 2: Tử Xà Basilisk & Ký Ức Tom Riddle',
    shortTitle: 'Tử Xà Basilisk',
    emoji: '🐍',
    maxHp: 5600,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'petrify',
    hexName: 'Ánh Nhìn Tử Thần Phòng Bí Mật',
    isFinaleBoss: true,
  },
  333: {
    levelId: 333,
    name: 'ĐẠI KẾT CỤC NĂM 3: Trăm Giám Ngục Bờ Hồ Đen',
    shortTitle: 'Chúa Giám Ngục',
    emoji: '👻',
    maxHp: 7200,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'ice',
    hexName: 'Bão Tuyết Tuyệt Vọng Azkaban',
    isFinaleBoss: true,
  },
  444: {
    levelId: 444,
    name: 'ĐẠI KẾT CỤC NĂM 4: Chúa Tể Voldemort Tái Sinh',
    shortTitle: 'Voldemort Tái Sinh',
    emoji: '💀',
    maxHp: 8800,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'dark_curse',
    hexName: 'Priori Incantatem Nghĩa Địa',
    isFinaleBoss: true,
  },
  555: {
    levelId: 555,
    name: 'ĐẠI KẾT CỤC NĂM 5: Đại Chiến Sở Bảo Mật',
    shortTitle: 'Đại Trùm Sở Bảo Mật',
    emoji: '🔮',
    maxHp: 10600,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'dark_curse',
    hexName: 'Vỡ Cầu Tiên Tri Bóng Tối',
    isFinaleBoss: true,
  },
  666: {
    levelId: 666,
    name: 'ĐẠI KẾT CỤC NĂM 6: Đỉnh Tháp Thiên Văn & Hang Âm Binh',
    shortTitle: 'Bão Hắc Ám Tháp Cao',
    emoji: '🔥',
    maxHp: 12400,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'fiendfyre',
    hexName: 'Biển Lửa Hang Đá Độc Dược',
    isFinaleBoss: true,
  },
  777: {
    levelId: 777,
    name: 'ĐẠI CHIẾN HOGWARTS: Chúa Tể Voldemort Tối Thượng',
    shortTitle: 'Chúa Tể Voldemort',
    emoji: '👑',
    maxHp: 14800,
    castInterval: 3,
    enrageBelowPct: 0.5,
    hexType: 'fiendfyre',
    hexName: 'Avada Kedavra Tối Thượng',
    isFinaleBoss: true,
  },
};

export function getCandyBossForLevel(levelId: number): CandyBossConfig | null {
  if (SEASON_FINALE_BOSSES[levelId]) {
    return { ...SEASON_FINALE_BOSSES[levelId] };
  }
  if (BOSS_ROSTER_EARLY[levelId]) {
    return { ...BOSS_ROSTER_EARLY[levelId], isFinaleBoss: false };
  }
  const season = getCandySeasonByLevel(levelId);
  const isChapterEnd = levelId % 10 === 0 || isMilestoneBossStage(levelId);
  if (!isChapterEnd) return null;

  const seasonIdx = season.id;
  const offsetInSeason = levelId - season.range[0];
  const archetypes = YEAR_BOSS_ARCHETYPES[seasonIdx] || YEAR_BOSS_ARCHETYPES[1];
  const pick = archetypes[Math.floor(levelId / 10) % archetypes.length];
  const isHundredMilestone = levelId % 100 === 0 || isMilestoneBossStage(levelId);

  const baseHp =
    2600 +
    (seasonIdx - 1) * 1450 +
    Math.round((offsetInSeason / CANDY_HOGWARTS_LEVELS_PER_SEASON) * 1100) +
    (isHundredMilestone ? 550 : 0);

  return {
    levelId,
    name: isHundredMilestone ? `ĐẠI TRÙM MỐC: ${pick.name}` : pick.name,
    shortTitle: pick.shortTitle,
    emoji: pick.emoji,
    maxHp: Math.round(baseHp / 50) * 50,
    castInterval: seasonIdx >= 4 || isHundredMilestone ? 3 : 4,
    enrageBelowPct: 0.5,
    hexType: pick.hexType,
    hexName: pick.hexName,
    isFinaleBoss: false,
  };
}

export function getCandyDifficultyTier(levelNum: number): CandyDifficultyTier {
  const season = getCandySeasonByLevel(levelNum);
  if (levelNum === season.finaleLevelId) return 'finale';
  if (levelNum % 10 === 0 || isMilestoneBossStage(levelNum)) return 'boss';
  if (season.examLevelId && levelNum === season.examLevelId) return 'exam';
  const pos = ((levelNum - 1) % 10) + 1;
  if (levelNum >= 9 && (pos === 5 || pos === 9)) return 'nightmare';
  if (levelNum >= 7 && (pos === 3 || pos === 7)) return 'hard';
  return 'normal';
}

export function getCandyDifficultyBadgeMeta(tier: CandyDifficultyTier): {
  tier: CandyDifficultyTier;
  icon: string;
  label: string;
  shortLabel: string;
} {
  switch (tier) {
    case 'finale':
      return { tier, icon: '👑', label: 'ĐẠI KẾT CỤC NĂM', shortLabel: 'KẾT NĂM' };
    case 'boss':
      return { tier, icon: '👑', label: 'ĐẠI TRÙM 2 PHA', shortLabel: 'TRÙM 2 PHA' };
    case 'exam':
      return { tier, icon: '🎓', label: 'THI VƯỢT NĂM O.W.L.', shortLabel: 'KHẢO HẠCH' };
    case 'nightmare':
      return { tier, icon: '💀', label: 'MÀN ÁC MỘNG', shortLabel: 'ÁC MỘNG' };
    case 'hard':
      return { tier, icon: '🔮', label: 'MÀN KHÓ PHÙ THỦY', shortLabel: 'MÀN KHÓ' };
    default:
      return { tier: 'normal', icon: '🍬', label: 'Kẹo Phép Thuật', shortLabel: 'Thường' };
  }
}

function buildMask(size: number, patternId: number): number[][] {
  const m = Array.from({ length: size }, () => Array<number>(size).fill(1));
  const last = size - 1;
  const mid = Math.floor(size / 2);

  switch (patternId) {
    case 0:
      break;
    case 1:
      m[0][0] = m[0][last] = m[last][0] = m[last][last] = 0;
      break;
    case 2:
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2 - r; c++) {
          m[r][c] = m[r][last - c] = m[last - r][c] = m[last - r][last - c] = 0;
        }
      }
      break;
    case 3:
      m[mid][0] = m[mid][last] = 0;
      if (size >= 8) m[mid - 1][0] = m[mid - 1][last] = 0;
      break;
    case 4:
      if (size % 2 === 0) {
        m[mid - 1][mid - 1] = m[mid - 1][mid] = m[mid][mid - 1] = m[mid][mid] = 0;
      } else {
        m[mid][mid] = 0;
      }
      break;
    case 5:
      m[0][mid] = m[last][mid] = 0;
      if (size % 2 === 0) m[0][mid - 1] = m[last][mid - 1] = 0;
      break;
    case 6:
      if (size >= 8) {
        for (const r of [0, 1, last - 1, last]) {
          for (const c of [0, 1, last - 1, last]) m[r][c] = 0;
        }
      } else {
        m[0][0] = m[0][last] = m[last][0] = m[last][last] = 0;
      }
      break;
    case 7:
      m[2][2] = m[2][last - 2] = m[last - 2][2] = m[last - 2][last - 2] = 0;
      break;
    case 8:
      m[0][mid] = m[1][mid] = m[last][mid] = m[last - 1][mid] = 0;
      break;
    case 9:
      m[last][0] = m[last][1] = m[last][last] = m[last][last - 1] = 0;
      m[last - 1][0] = m[last - 1][last] = 0;
      break;
    case 10:
      m[0][last] = m[0][last - 1] = m[1][last] = 0;
      m[last][0] = m[last][1] = m[last - 1][0] = 0;
      break;
    case 11:
      m[1][1] = m[1][mid] = m[1][last - 1] = 0;
      break;
    case 12:
      m[0][mid] = 0;
      if (size % 2 === 0) m[0][mid - 1] = 0;
      m[last][0] = m[last][last] = 0;
      m[mid][0] = m[mid][last] = 0;
      break;
    case 13:
      m[0][1] = m[0][last - 1] = 0;
      if (size >= 8) m[0][3] = m[0][last - 3] = 0;
      break;
    case 14:
      m[2][2] = m[2][last - 2] = 0;
      m[last - 2][2] = m[last - 2][last - 2] = 0;
      m[0][0] = m[0][last] = m[last][0] = m[last][last] = 0;
      break;
    case 15:
      m[0][0] = m[1][0] = m[0][last] = m[1][last] = 0;
      m[mid][mid] = 0;
      break;
    case 16:
      m[0][0] = m[0][1] = m[1][0] = 0;
      m[0][last] = m[0][last - 1] = m[1][last] = 0;
      if (size >= 8) m[3][3] = m[3][last - 3] = 0;
      break;
    case 17:
      m[0][0] = m[0][1] = m[1][0] = 0;
      m[0][last] = m[0][last - 1] = m[1][last] = 0;
      m[last][0] = m[last][1] = m[last - 1][0] = 0;
      m[last][last] = m[last][last - 1] = m[last - 1][last] = 0;
      m[mid][mid] = 0;
      break;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (m[r][c] === 0) continue;
      let hCount = 1;
      for (let cc = c - 1; cc >= 0 && m[r][cc] === 1; cc--) hCount++;
      for (let cc = c + 1; cc < size && m[r][cc] === 1; cc++) hCount++;
      let vCount = 1;
      for (let rr = r - 1; rr >= 0 && m[rr][c] === 1; rr--) vCount++;
      for (let rr = r + 1; rr < size && m[rr][c] === 1; rr++) vCount++;
      if (hCount < 3 && vCount < 3) {
        if (c + 1 < size) m[r][c + 1] = 1;
        if (c - 1 >= 0) m[r][c - 1] = 1;
      }
    }
  }
  return m;
}

function seededRand(seed: number): () => number {
  let s = ((Math.abs(Math.floor(seed)) % 2147483647) * 16807 + 12345) % 2147483647;
  if (s <= 0) s = 13579;
  return () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
}

function pickLayerCount(maxLayer: number, rand: () => number, hardBias = 0): number {
  if (maxLayer <= 1) return 1;
  const roll = Math.min(0.999, rand() + hardBias);
  if (maxLayer >= 5 && roll > 0.78) return 5;
  if (maxLayer >= 4 && roll > 0.56) return 4;
  if (maxLayer >= 3 && roll > 0.34) return 3;
  if (maxLayer >= 2 && roll > 0.16) return 2;
  return 1;
}

function placeSymmetricalGrid(
  size: number,
  mask: number[][],
  count: number,
  maxLayer: number,
  seed: number,
  preferCenter = true,
  forbiddenFn: ((r: number, c: number) => boolean) | null = null,
  hardBias = 0,
  minLayer = 1
): number[][] {
  const grid = Array.from({ length: size }, () => Array<number>(size).fill(0));
  if (count <= 0) return grid;
  const rand = seededRand(seed);

  const candidates: Array<{ r: number; c: number; score: number }> = [];
  const center = (size - 1) / 2;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= Math.floor((size - 1) / 2); c++) {
      if (mask[r][c] === 0) continue;
      if (forbiddenFn?.(r, c)) continue;
      const dist = Math.hypot(r - center, c - center);
      candidates.push({
        r,
        c,
        score: preferCenter ? -dist + rand() * 1.8 : dist + rand() * 1.8,
      });
    }
  }
  candidates.sort((a, b) => b.score - a.score);

  let placed = 0;
  for (const cell of candidates) {
    if (placed >= count) break;
    const mirrorC = size - 1 - cell.c;
    const rawLayer = pickLayerCount(maxLayer, rand, hardBias);
    const layer = Math.max(minLayer, Math.min(maxLayer, rawLayer));

    if (
      mask[cell.r][cell.c] === 1 &&
      grid[cell.r][cell.c] === 0 &&
      !forbiddenFn?.(cell.r, cell.c)
    ) {
      grid[cell.r][cell.c] = layer;
      placed++;
    }
    if (
      placed < count &&
      mirrorC !== cell.c &&
      mask[cell.r][mirrorC] === 1 &&
      grid[cell.r][mirrorC] === 0 &&
      !forbiddenFn?.(cell.r, mirrorC)
    ) {
      grid[cell.r][mirrorC] = layer;
      placed++;
    }
  }
  return grid;
}

function countNonZeroCells(grid: number[][]): { cells: number; sum: number } {
  let cells = 0;
  let sum = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] > 0) {
        cells++;
        sum += grid[r][c];
      }
    }
  }
  return { cells, sum };
}

function buildRectLoop(
  rTop: number,
  cLeft: number,
  rBot: number,
  cRight: number,
  reverse = false
): Array<{ r: number; c: number }> {
  if (rBot - rTop < 1 || cRight - cLeft < 1) return [];
  const ring: Array<{ r: number; c: number }> = [];
  for (let c = cLeft; c <= cRight; c++) ring.push({ r: rTop, c });
  for (let r = rTop + 1; r <= rBot; r++) ring.push({ r, c: cRight });
  for (let c = cRight - 1; c >= cLeft; c--) ring.push({ r: rBot, c });
  for (let r = rBot - 1; r >= rTop + 1; r--) ring.push({ r, c: cLeft });
  return reverse ? ring.reverse() : ring;
}

function buildConveyorLoops(
  size: number,
  mask: number[][],
  levelNum: number,
  isForbidden: (r: number, c: number) => boolean
): Array<Array<{ r: number; c: number }>> {
  const candidates: Array<[number, number, number, number]> = [
    [2, 2, size - 3, size - 3],
    [2, 1, size - 3, size - 2],
    [1, 2, size - 2, size - 3],
    [1, 1, size - 2, size - 2],
    [2, 1, size - 2, size - 2],
  ];
  const reverse = levelNum % 2 === 1;
  for (const [rTop, cLeft, rBot, cRight] of candidates) {
    const loop = buildRectLoop(rTop, cLeft, rBot, cRight, reverse);
    if (loop.length < 6) continue;
    const valid = loop.every((pt) => mask[pt.r]?.[pt.c] === 1 && !isForbidden(pt.r, pt.c));
    if (valid) return [loop];
  }
  return [];
}

function buildMazeConfig(
  size: number,
  mask: number[][],
  levelNum: number,
  isConveyorCell: (r: number, c: number) => boolean,
  difficultyTier: CandyDifficultyTier
): CandyMazeConfig | null {
  const validRows: number[] = [];
  for (let r = 2; r <= size - 3; r++) {
    let activeInRow = 0;
    let touchesConveyor = false;
    for (let c = 0; c < size; c++) {
      if (mask[r][c] === 1) activeInRow++;
      if (isConveyorCell(r, c)) touchesConveyor = true;
    }
    if (activeInRow >= 5 && !touchesConveyor) {
      validRows.push(r);
    }
  }
  if (validRows.length === 0) return null;

  const picked: number[] = [];
  const startIdx = levelNum % validRows.length;
  const maxRows =
    size >= 9 &&
    (difficultyTier === 'nightmare' || difficultyTier === 'boss' || difficultyTier === 'finale')
      ? 3
      : 2;
  for (let i = 0; i < validRows.length && picked.length < maxRows; i++) {
    const rowCandidate = validRows[(startIdx + i * 2) % validRows.length];
    if (!picked.includes(rowCandidate)) picked.push(rowCandidate);
  }
  if (picked.length < 2 && validRows.length >= 2) {
    for (const r of validRows) {
      if (!picked.includes(r)) {
        picked.push(r);
        if (picked.length >= 2) break;
      }
    }
  }
  picked.sort((a, b) => a - b);

  const intervalMoves = difficultyTier === 'finale' || difficultyTier === 'nightmare' ? 2 : 3;
  return {
    intervalMoves,
    rows: picked,
  };
}

const FIRST_100_INGREDIENT = new Set([12, 18, 26, 34, 42, 52, 62, 72, 82, 92, 98, 100]);
const FIRST_100_SPECIAL_ORDERS: Record<
  number,
  { specialKind: 'striped' | 'wrapped' | 'color_bomb' | 'seeker'; target: number }
> = {
  27: { specialKind: 'striped', target: 5 },
  33: { specialKind: 'seeker', target: 4 },
  45: { specialKind: 'wrapped', target: 4 },
  57: { specialKind: 'striped', target: 6 },
  69: { specialKind: 'seeker', target: 5 },
  77: { specialKind: 'wrapped', target: 4 },
  89: { specialKind: 'color_bomb', target: 3 },
  95: { specialKind: 'striped', target: 6 },
};

function isIngredientDropLevel(
  levelNum: number,
  seasonId: number,
  isBoss: boolean,
  isSeasonFinale: boolean
): boolean {
  if (isSeasonFinale) return false;
  if (levelNum <= 100) return FIRST_100_INGREDIENT.has(levelNum);
  if (isBoss) return levelNum % 40 === 0;
  return levelNum % 9 === 2 || (seasonId >= 3 && levelNum % 13 === 4);
}

function getSpecialOrderSpec(
  levelNum: number,
  seasonId: number,
  isBoss: boolean,
  isSeasonFinale: boolean,
  hasDecree: boolean
): { specialKind: 'striped' | 'wrapped' | 'color_bomb' | 'seeker'; target: number } | null {
  if (isBoss || isSeasonFinale || hasDecree) return null;
  if (levelNum <= 100) return FIRST_100_SPECIAL_ORDERS[levelNum] || null;
  if (levelNum % 14 !== 5) return null;

  const kinds: Array<'striped' | 'seeker' | 'wrapped' | 'color_bomb'> = [
    'striped',
    'seeker',
    'wrapped',
    'color_bomb',
  ];
  const kind = kinds[(Math.floor(levelNum / 14) + seasonId) % kinds.length];
  const bonus = Math.min(3, Math.floor(seasonId / 2));
  if (kind === 'color_bomb') {
    return { specialKind: 'color_bomb', target: 2 + Math.floor(seasonId / 3) };
  }
  if (kind === 'wrapped') return { specialKind: 'wrapped', target: 4 + bonus };
  if (kind === 'seeker') return { specialKind: 'seeker', target: 4 + bonus };
  return { specialKind: 'striped', target: 5 + bonus };
}

export function generateCandyHogwartsLevel(rawLevelNum: number): CandyHogwartsLevel {
  const levelNum = Math.max(
    1,
    Math.min(CANDY_HOGWARTS_TOTAL_LEVELS, Math.floor(Number(rawLevelNum) || 1))
  );
  const season = getCandySeasonByLevel(levelNum);
  const seasonId = season.id;
  const chapter = getCandyChapterForLevel(levelNum);
  const difficultyTier = getCandyDifficultyTier(levelNum);
  const isSeasonFinale = levelNum === season.finaleLevelId;
  const isBoss = isSeasonFinale || levelNum % 10 === 0 || isMilestoneBossStage(levelNum);
  const isChapterBoss = isSeasonFinale || levelNum === chapter.range[1] || levelNum % 100 === 0;
  const isExamTrial = season.examLevelId === levelNum;
  const seasonProgress =
    (levelNum - season.range[0]) / Math.max(1, CANDY_HOGWARTS_LEVELS_PER_SEASON - 1);

  let title = '';
  if (levelNum <= 100 && FIRST_100_TITLES[levelNum - 1]) {
    title = FIRST_100_TITLES[levelNum - 1];
  } else if (isSeasonFinale) {
    const boss = getCandyBossForLevel(levelNum);
    title = boss ? boss.name : `ĐẠI KẾT CỤC ${season.yearLabel.toUpperCase()}: ${season.title}`;
  } else if (isBoss) {
    const boss = getCandyBossForLevel(levelNum);
    title = boss ? `TRÙM: ${boss.name}` : `TRÙM: ${chapter.shortTitle}`;
  } else if (isExamTrial) {
    title = `KHẢO HẠCH O.W.L. ${season.yearLabel.toUpperCase()}: ${season.title}`;
  } else {
    const stepInChapter = levelNum - chapter.range[0] + 1;
    const prefix =
      STAGE_ACTION_PREFIXES[(levelNum + chapter.chapterIndexInSeason) % STAGE_ACTION_PREFIXES.length];
    title = `${prefix}: ${chapter.shortTitle} (${stepInChapter}/${chapter.levelCount})`;
  }

  const rewardGalleons = isSeasonFinale
    ? 320 + seasonId * 40
    : isChapterBoss
      ? 140 + seasonId * 15
      : isBoss
        ? 85 + seasonId * 8
        : difficultyTier === 'nightmare'
          ? 45 + seasonId * 4
          : difficultyTier === 'hard'
            ? 36 + seasonId * 3
            : 26 + seasonId * 2;

  const isSpike =
    difficultyTier === 'hard' ||
    difficultyTier === 'nightmare' ||
    difficultyTier === 'exam' ||
    isBoss ||
    isSeasonFinale;
  const hardBias =
    difficultyTier === 'finale'
      ? 0.22
      : difficultyTier === 'nightmare' || difficultyTier === 'boss' || difficultyTier === 'exam'
        ? 0.14
        : difficultyTier === 'hard'
          ? 0.08
          : 0;

  const bossConfig = isBoss ? getCandyBossForLevel(levelNum) : null;

  // 1. Kích thước bàn cờ: 7×7 → 8×8 → 9×9 → Đại Bàn Cờ 10×10 (mở từ Năm 4+)
  let size = 8;
  if (levelNum <= 3 || (seasonId === 1 && levelNum < 35 && levelNum % 8 === 3 && !isSpike)) {
    size = 7;
  } else if (
    seasonId >= 4 &&
    (isSeasonFinale ||
      isChapterBoss ||
      isExamTrial ||
      difficultyTier === 'nightmare' ||
      (isBoss && levelNum % 20 === 0) ||
      (difficultyTier === 'hard' && levelNum % 2 === 1))
  ) {
    size = 10;
  } else if (
    isBoss ||
    isExamTrial ||
    difficultyTier === 'nightmare' ||
    (seasonId >= 2 && (difficultyTier === 'hard' || levelNum % 3 === 0)) ||
    (seasonId === 1 && levelNum >= 20 && (difficultyTier === 'hard' || levelNum % 4 === 0))
  ) {
    size = 9;
  }

  let patternId = 0;
  if (levelNum === 1 || levelNum === 3) patternId = 0;
  else if (levelNum === 2) patternId = 1;
  else if (isSeasonFinale) patternId = 17;
  else if (isBoss) patternId = [2, 6, 8, 12, 14, 16, 17][Math.floor(levelNum / 10) % 7];
  else patternId = (levelNum * 7 + seasonId * 5) % 18;

  const mask = buildMask(size, patternId);
  let activeCells = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (mask[r][c] === 1) activeCells++;
    }
  }

  const maxTotalBlockers = Math.max(12, Math.floor(activeCells * 0.48));
  let usedBlockerCells = 0;

  // 2. Cột Thả Hòn Đá Phù Thủy (Drop Ingredients)
  const hasIngredients = isIngredientDropLevel(levelNum, seasonId, isBoss, isSeasonFinale);
  let ingredientTarget = 0;
  const ingredientSpawnCols: number[] = [];
  const ingredientExitCells: Array<{ r: number; c: number }> = [];
  if (hasIngredients) {
    ingredientTarget =
      levelNum <= 20
        ? 2
        : levelNum <= 60
          ? 3
          : Math.min(6, 3 + Math.floor(seasonId * 0.45) + (isSpike ? 1 : 0));

    for (let c = 1; c < size - 1; c++) {
      let fullCol = true;
      for (let r = 0; r < size; r++) {
        if (mask[r][c] === 0) {
          fullCol = false;
          break;
        }
      }
      if (fullCol) ingredientSpawnCols.push(c);
    }
    if (ingredientSpawnCols.length === 0) {
      for (let c = 1; c < size - 1; c++) {
        if (mask[0][c] === 1) ingredientSpawnCols.push(c);
      }
    }
    if (ingredientSpawnCols.length === 0) {
      for (let c = 0; c < size; c++) {
        if (mask[0][c] === 1) ingredientSpawnCols.push(c);
      }
    }
    for (let c = 0; c < size; c++) {
      if (mask[size - 1][c] === 1) ingredientExitCells.push({ r: size - 1, c });
    }
  }

  const isExitCell = (r: number, c: number) =>
    ingredientExitCells.some((ex) => ex.r === r && ex.c === c);
  const isProtectedSpawnCol = (c: number) =>
    hasIngredients && ingredientSpawnCols.length <= 2 && ingredientSpawnCols.includes(c);

  // 3. Cổng Bột Floo Dịch Chuyển (Portals)
  const portals: CandyPortalPair[] = [];
  const wantsPortals =
    levelNum <= 100
      ? [36, 48, 54, 58, 66, 74, 84, 94, 100].includes(levelNum)
      : (seasonId >= 2 && levelNum % 8 === 2) || (isSeasonFinale && seasonId >= 5);
  if (wantsPortals) {
    const leftC = 1;
    const rightC = size - 2;
    const midR = Math.floor(size / 2);
    const outR = Math.min(size - 2, midR + 1);
    if (mask[midR - 1]?.[leftC] === 1 && mask[outR]?.[rightC] === 1) {
      portals.push({
        from: { r: midR - 1, c: leftC },
        to: { r: outR, c: rightC },
        color: '#10b981',
      });
    }
    if (mask[midR - 1]?.[rightC] === 1 && mask[outR]?.[leftC] === 1) {
      portals.push({
        from: { r: midR - 1, c: rightC },
        to: { r: outR, c: leftC },
        color: '#a855f7',
      });
    }
  }
  const isPortalCell = (r: number, c: number) =>
    portals.some((p) => (p.from.r === r && p.from.c === c) || (p.to.r === r && p.to.c === c));

  // 4. Băng Chuyền Cầu Thang Dịch Chuyển (Conveyor Belt)
  const wantsConveyor =
    levelNum <= 100
      ? [32, 46, 55, 68, 78, 88, 96, 99].includes(levelNum)
      : levelNum % 7 === 4 ||
        (isBoss && seasonId >= 3 && levelNum % 30 === 0) ||
        levelNum === 777;
  const conveyorLoops = wantsConveyor
    ? buildConveyorLoops(size, mask, levelNum, (r, c) => isExitCell(r, c) || isPortalCell(r, c))
    : [];
  const isConveyorCell = (r: number, c: number) =>
    conveyorLoops.some((loop) => loop.some((pt) => pt.r === r && pt.c === c));

  // 5. Gió Lốc Mê Cung Tam Pháp Thuật (Năm 4+: tự dịch chuyển hàng kẹo mỗi 2–3 lượt!)
  const wantsMaze =
    seasonId === 4
      ? isExamTrial || isSeasonFinale || isBoss || levelNum % 3 !== 1
      : seasonId >= 5 &&
        (levelNum % 5 === 1 || (isBoss && levelNum % 40 === 10) || isSeasonFinale);
  const mazeConfig = wantsMaze
    ? buildMazeConfig(size, mask, levelNum, isConveyorCell, difficultyTier)
    : null;

  const occupied = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const markOccupied = (grid: number[][]) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] > 0 && !occupied[r][c]) {
          occupied[r][c] = true;
          usedBlockerCells++;
        }
      }
    }
  };
  const baseStaticForbidden = (r: number, c: number) =>
    r <= 1 ||
    r === size - 1 ||
    occupied[r][c] ||
    isExitCell(r, c) ||
    isPortalCell(r, c) ||
    isConveyorCell(r, c) ||
    isProtectedSpawnCol(c);

  // 6A. [NĂM 7] Trường Sinh Linh Giá (Horcrux 4–5 HP: Khiên Hồn miễn nhiễm ghép thường khi HP >= 4!)
  let horcruxTarget = 0;
  if (seasonId === 7 && (isExamTrial || isSeasonFinale || isBoss || levelNum % 3 !== 2)) {
    horcruxTarget = isSeasonFinale ? 6 : isBoss || difficultyTier === 'nightmare' ? 4 : 2;
  }
  const horcruxBudget = Math.min(horcruxTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const horcruxMaxHp = isSeasonFinale || difficultyTier === 'nightmare' || isBoss ? 5 : 4;
  const horcruxGrid = placeSymmetricalGrid(
    size,
    mask,
    horcruxBudget,
    horcruxMaxHp,
    levelNum * 97 + 19,
    false,
    baseStaticForbidden,
    hardBias,
    4
  );
  markOccupied(horcruxGrid);

  // 6B. [NĂM 3+] Giám Ngục Hút Nộ (Dementor 2–4 HP)
  let dementorTarget = 0;
  if (seasonId === 3 && (isExamTrial || isSeasonFinale || isBoss || levelNum % 3 !== 1)) {
    dementorTarget = isSeasonFinale ? 6 : isBoss || difficultyTier === 'nightmare' ? 4 : 2;
  } else if (
    seasonId >= 4 &&
    (levelNum % 6 === 3 || (isBoss && levelNum % 30 === 20) || levelNum === 777)
  ) {
    dementorTarget = isSeasonFinale ? 4 : difficultyTier === 'nightmare' || isBoss ? 4 : 2;
  }
  const dementorBudget = Math.min(dementorTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const dementorMaxHp =
    seasonId >= 5 || isSeasonFinale || difficultyTier === 'nightmare' ? 4 : isSpike ? 3 : 2;
  const dementorGrid = placeSymmetricalGrid(
    size,
    mask,
    dementorBudget,
    dementorMaxHp,
    levelNum * 89 + 23,
    false,
    baseStaticForbidden,
    hardBias,
    2
  );
  markOccupied(dementorGrid);

  // 6C. [NĂM 5+] Bia Sắc Lệnh Umbridge (Decree Plaque 2–4 HP: vùng 3×3 cấm kết tinh Kẹo Phép!)
  let decreeTarget = 0;
  if (seasonId === 5 && (isExamTrial || isSeasonFinale || isBoss || levelNum % 3 !== 2)) {
    decreeTarget = isSeasonFinale ? 4 : isBoss || difficultyTier === 'nightmare' ? 4 : 2;
  } else if (seasonId >= 6 && (levelNum % 7 === 2 || (isBoss && levelNum % 40 === 20))) {
    decreeTarget = 2;
  }
  const decreeBudget = Math.min(decreeTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const decreeMaxHp = seasonId >= 6 || difficultyTier === 'nightmare' || isBoss ? 4 : 3;
  const decreeGrid = placeSymmetricalGrid(
    size,
    mask,
    decreeBudget,
    decreeMaxHp,
    levelNum * 83 + 29,
    false,
    baseStaticForbidden,
    hardBias,
    2
  );
  markOccupied(decreeGrid);

  // 6D. [NĂM 6+] Lửa Địa Ngục Fiendfyre (2 HP)
  let fiendfyreTarget = 0;
  if (seasonId === 6 && (isExamTrial || isSeasonFinale || isBoss || levelNum % 3 !== 1)) {
    fiendfyreTarget = isSeasonFinale ? 4 : difficultyTier === 'nightmare' || isBoss ? 4 : 2;
  } else if (
    seasonId === 7 &&
    (levelNum % 4 === 1 || isSeasonFinale || (isBoss && levelNum % 20 === 0))
  ) {
    fiendfyreTarget = isSeasonFinale ? 4 : 2;
  }
  const fiendfyreBudget = Math.min(
    fiendfyreTarget,
    Math.max(0, maxTotalBlockers - usedBlockerCells)
  );
  const rawFiendfyre = placeSymmetricalGrid(
    size,
    mask,
    fiendfyreBudget,
    2,
    levelNum * 73 + 31,
    false,
    baseStaticForbidden,
    0,
    2
  );
  const fiendfyreGrid = rawFiendfyre.map((row) => row.map((v) => (v > 0 ? 2 : 0)));
  markOccupied(fiendfyreGrid);

  // 6E. Vạc Độc Dược (Magic Cauldron 3 HP)
  let cauldronTarget = 0;
  if (levelNum <= 100) {
    if ([43, 57, 65, 75, 85, 94, 99].includes(levelNum)) cauldronTarget = levelNum >= 75 ? 4 : 2;
  } else if (levelNum % 8 === 5 || (isBoss && levelNum % 50 === 0 && seasonId <= 5)) {
    cauldronTarget = seasonId >= 3 ? 4 : 2;
  }
  const cauldronBudget = Math.min(cauldronTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const rawCauldron = placeSymmetricalGrid(
    size,
    mask,
    cauldronBudget,
    3,
    levelNum * 67 + 13,
    false,
    baseStaticForbidden,
    0,
    3
  );
  const cauldronGrid = rawCauldron.map((row) => row.map((v) => (v > 0 ? 3 : 0)));
  markOccupied(cauldronGrid);

  // 6F. Đá Cổ Ngữ (Frosting 1–5 lớp)
  let frostingTarget = 0;
  let maxFrostingLayer = 1;
  if (levelNum >= 11 && (levelNum % 2 === 1 || isBoss || hasIngredients || isSpike)) {
    const baseFrost =
      levelNum <= 100 ? 4 + Math.floor((levelNum - 10) * 0.09) : 6 + seasonId;
    frostingTarget = Math.min(size >= 9 ? 14 : 10, baseFrost + (isSpike ? 2 : 0));
    if (seasonId >= 5) maxFrostingLayer = isSpike ? 5 : 4;
    else if (seasonId >= 3) maxFrostingLayer = isSpike ? 4 : 3;
    else if (seasonId === 2) maxFrostingLayer = isSpike ? 4 : 3;
    else maxFrostingLayer = levelNum >= 65 ? 3 : levelNum >= 28 ? 2 : 1;
  }
  const frostingBudget = Math.min(frostingTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const frostingGrid = placeSymmetricalGrid(
    size,
    mask,
    frostingBudget,
    maxFrostingLayer,
    levelNum * 23 + 7,
    true,
    (r, c) =>
      r <= 1 ||
      r === size - 1 ||
      occupied[r][c] ||
      isExitCell(r, c) ||
      isPortalCell(r, c) ||
      isConveyorCell(r, c),
    hardBias
  );
  markOccupied(frostingGrid);

  // 6G. Sô-cô-la Hắc Ám Tự Lan
  let chocolateTarget = 0;
  if (
    fiendfyreBudget === 0 &&
    levelNum >= 31 &&
    (levelNum % 5 === 0 || levelNum === 44 || levelNum === 75 || levelNum === 97)
  ) {
    chocolateTarget = levelNum >= 70 || seasonId >= 2 ? 4 : 2;
  }
  const chocolateBudget = Math.min(
    chocolateTarget,
    Math.max(0, maxTotalBlockers - usedBlockerCells)
  );
  const chocolateGrid = placeSymmetricalGrid(
    size,
    mask,
    chocolateBudget,
    1,
    levelNum * 41 + 9,
    false,
    baseStaticForbidden
  );
  markOccupied(chocolateGrid);

  // 6H. Xoáy Cam Thảo (Licorice Swirl)
  let swirlTarget = 0;
  if (levelNum >= 24 && (levelNum % 4 === 3 || (isBoss && levelNum % 30 === 0))) {
    swirlTarget = Math.min(8, 4 + Math.floor(seasonId * 0.7));
  }
  const swirlBudget = Math.min(swirlTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const swirlGrid = placeSymmetricalGrid(
    size,
    mask,
    swirlBudget,
    1,
    levelNum * 53 + 5,
    true,
    (r, c) =>
      r <= 1 ||
      occupied[r][c] ||
      isExitCell(r, c) ||
      isPortalCell(r, c) ||
      isConveyorCell(r, c)
  );
  markOccupied(swirlGrid);

  // 6I. Chìa Khoá Đường Vàng & Ô Khoá Hầm Gringotts
  let lockTarget = 0;
  if (levelNum <= 100) {
    if ([22, 28, 38, 48, 63, 73, 83, 88, 91].includes(levelNum)) lockTarget = levelNum >= 63 ? 6 : 4;
  } else if (levelNum % 9 === 6) {
    lockTarget = seasonId >= 4 ? 8 : 6;
  }
  const lockBudget = Math.min(lockTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const lockGrid = placeSymmetricalGrid(
    size,
    mask,
    lockBudget,
    1,
    levelNum * 79 + 17,
    false,
    baseStaticForbidden
  );
  markOccupied(lockGrid);

  // 6J. [NĂM 2+] Hoá Đá Tử Xà (Petrify 1–3 lớp)
  let petrifyTarget = 0;
  let maxPetrifyLayer = 1;
  if (seasonId === 2 && (isExamTrial || isSeasonFinale || isBoss || levelNum % 3 !== 0)) {
    petrifyTarget = isSeasonFinale ? 14 : isSpike ? 10 : 8;
    maxPetrifyLayer =
      isSeasonFinale || difficultyTier === 'nightmare' || isBoss
        ? 3
        : isSpike || seasonProgress > 0.35
          ? 2
          : 1;
  } else if (
    seasonId >= 3 &&
    (levelNum % 5 === 2 || levelNum === 444 || levelNum === 777)
  ) {
    petrifyTarget = isSpike ? 8 : 6;
    maxPetrifyLayer = seasonId >= 5 ? 3 : 2;
  }
  const petrifyBudget = Math.min(petrifyTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const petrifyGrid = placeSymmetricalGrid(
    size,
    mask,
    petrifyBudget,
    maxPetrifyLayer,
    levelNum * 61 + 37,
    true,
    (r, c) =>
      r <= 1 ||
      occupied[r][c] ||
      isExitCell(r, c) ||
      isPortalCell(r, c) ||
      isConveyorCell(r, c),
    hardBias
  );
  markOccupied(petrifyGrid);

  // 6K. Băng Ngục Azkaban (Ice Lock 1–5 lớp)
  let iceTarget = 0;
  let maxIceLayer = 1;
  if (levelNum >= 14 && (isSpike || levelNum % 3 === 1 || seasonId === 3)) {
    iceTarget = Math.min(size >= 9 ? 16 : 12, 4 + Math.floor(seasonId * 1.4) + (isSpike ? 3 : 0));
    if (seasonId >= 6) maxIceLayer = isSpike ? 5 : 4;
    else if (seasonId >= 4) maxIceLayer = isSpike ? 4 : 3;
    else if (seasonId >= 2) maxIceLayer = isSpike ? 3 : 2;
    else maxIceLayer = levelNum >= 65 ? 3 : levelNum >= 35 ? 2 : 1;
  }
  const iceBudget = Math.min(iceTarget, Math.max(0, maxTotalBlockers - usedBlockerCells));
  const iceGrid = placeSymmetricalGrid(
    size,
    mask,
    iceBudget,
    maxIceLayer,
    levelNum * 31 + 11,
    false,
    (r, c) =>
      r <= 1 ||
      occupied[r][c] ||
      isExitCell(r, c) ||
      isPortalCell(r, c) ||
      isConveyorCell(r, c),
    hardBias
  );
  markOccupied(iceGrid);

  // 6L. Thạch Hắc Ám (Jelly 1–5 lớp dưới kẹo)
  const isScoreOnly = levelNum === 4 || levelNum === 9;
  let jellyCount = 0;
  let maxJellyLayer = 1;
  if (levelNum >= 5 && !isScoreOnly) {
    const wantsJelly =
      isBoss ||
      isSeasonFinale ||
      isExamTrial ||
      (!hasIngredients && levelNum % 3 !== 1) ||
      seasonId >= 2;
    if (wantsJelly) {
      jellyCount = Math.min(
        Math.floor(activeCells * 0.72),
        10 + Math.floor(Math.min(100, levelNum) * 0.22) + (seasonId - 1) * 5 + (isSpike ? 6 : 0)
      );
      if (seasonId >= 6) maxJellyLayer = isSpike ? 5 : 4;
      else if (seasonId >= 4) maxJellyLayer = isSpike ? 5 : 3;
      else if (seasonId >= 2) maxJellyLayer = isSpike ? 4 : 3;
      else maxJellyLayer = levelNum >= 70 ? 3 : levelNum >= 25 ? 2 : 1;
    }
  }
  const jellyGrid = placeSymmetricalGrid(
    size,
    mask,
    jellyCount,
    maxJellyLayer,
    levelNum * 17 + 3,
    true,
    (r, c) =>
      cauldronGrid[r][c] > 0 ||
      dementorGrid[r][c] > 0 ||
      decreeGrid[r][c] > 0 ||
      fiendfyreGrid[r][c] > 0 ||
      horcruxGrid[r][c] > 0,
    hardBias
  );

  // 7. Thống kê số lượng thực tế đặt lên bàn
  const { sum: actualJelly } = countNonZeroCells(jellyGrid);
  const { sum: actualIce } = countNonZeroCells(iceGrid);
  const { sum: actualFrosting } = countNonZeroCells(frostingGrid);
  const { cells: actualChocolate } = countNonZeroCells(chocolateGrid);
  const { cells: actualCauldrons } = countNonZeroCells(cauldronGrid);
  const { cells: actualLocks } = countNonZeroCells(lockGrid);
  const { sum: actualPetrify } = countNonZeroCells(petrifyGrid);
  const { cells: actualDementors } = countNonZeroCells(dementorGrid);
  const { cells: actualDecrees } = countNonZeroCells(decreeGrid);
  const { cells: actualFiendfyre } = countNonZeroCells(fiendfyreGrid);
  const { cells: actualHorcruxes } = countNonZeroCells(horcruxGrid);

  // 8. Bom Kẹo Hắc Ám Đếm Ngược
  let bombConfig: CandyBombConfig | null = null;
  const wantsBombs =
    levelNum <= 100
      ? [39, 50, 64, 70, 76, 80, 86, 90, 96, 100].includes(levelNum)
      : difficultyTier === 'nightmare' ||
        isSeasonFinale ||
        (isBoss && levelNum % 20 === 0) ||
        (seasonId >= 3 && levelNum % 6 === 0);
  if (wantsBombs) {
    const startTimer =
      actualFiendfyre > 0
        ? 11
        : seasonId >= 5
          ? 9
          : seasonId >= 3
            ? 10
            : levelNum >= 80
              ? 10
              : 12;
    bombConfig = {
      initialCount:
        isSeasonFinale || (seasonId >= 4 && difficultyTier === 'nightmare') ? 2 : 1,
      intervalMoves: seasonId >= 5 ? 5 : 6,
      startTimer,
    };
  }

  // 9. Số màu kẹo trên bàn cờ
  const specialOrder = getSpecialOrderSpec(
    levelNum,
    seasonId,
    isBoss,
    isSeasonFinale,
    actualDecrees > 0
  );
  let numColors = 6;
  if (levelNum <= 6) {
    numColors = 5;
  } else if (specialOrder) {
    numColors = seasonId >= 5 && specialOrder.specialKind !== 'color_bomb' ? 6 : 5;
  } else if (seasonId === 1) {
    numColors =
      isSpike || levelNum >= 30
        ? levelNum % 5 === 1 && !isSpike
          ? 5
          : 6
        : levelNum % 2 === 0
          ? 6
          : 5;
  } else {
    numColors = !isSpike && levelNum % 11 === 4 ? 5 : 6;
  }

  // 10. Ngân sách Lượt đi chuẩn Candy Crush Saga
  let moves = 18;
  if (levelNum <= 3) {
    moves = levelNum === 3 ? 17 : 18;
  } else if (levelNum <= 100) {
    if (isBoss) moves = levelNum === 100 ? 24 : 20 + Math.floor(levelNum / 45);
    else if (difficultyTier === 'nightmare') moves = 15 + (levelNum >= 60 ? 1 : 0);
    else if (difficultyTier === 'hard') moves = 16 + (levelNum % 2);
    else moves = 17 + (levelNum % 3);
  } else {
    const highYearPad = seasonId >= 5 ? 2 : seasonId >= 3 ? 1 : 0;
    if (isSeasonFinale) moves = 25 + Math.floor(seasonId / 3);
    else if (isBoss) moves = 21 + highYearPad;
    else if (difficultyTier === 'nightmare' || isExamTrial) moves = 16 + highYearPad;
    else if (difficultyTier === 'hard') moves = 17 + highYearPad;
    else moves = 18 + (levelNum % 2) + highYearPad;
  }

  if (hasIngredients && !isBoss) moves += 1;
  if (actualHorcruxes >= 4 && !isBoss) moves += 1;

  // 11. Ngưỡng 1–2–3 Sao
  const baseStar1 =
    2600 +
    Math.min(100, levelNum) * 160 +
    (seasonId - 1) * 5200 +
    Math.round(seasonProgress * 3800) +
    (isSeasonFinale ? 6500 : isBoss ? 2400 : isSpike ? 1100 : 0);
  const stars: [number, number, number] = [
    Math.round(baseStar1 / 100) * 100,
    Math.round((baseStar1 * 1.72) / 100) * 100,
    Math.round((baseStar1 * 2.55) / 100) * 100,
  ];

  // 12. Tối đa 3 Mục Tiêu cho bảng Mục Tiêu dọc
  const objectives: CandyObjectiveSpec[] = [];

  if (isScoreOnly) {
    objectives.push({ type: 'score', target: stars[1], label: 'Điểm Phép Thuật' });
  } else {
    if (bossConfig) {
      objectives.push({ type: 'boss', target: bossConfig.maxHp, label: bossConfig.shortTitle });
    }
    if (ingredientTarget > 0 && objectives.length < 3) {
      objectives.push({ type: 'ingredient', target: ingredientTarget, label: 'Thả Đá Phù Thủy' });
    }
    if (actualHorcruxes > 0 && objectives.length < 3) {
      objectives.push({ type: 'horcrux', target: actualHorcruxes, label: 'Huỷ Linh Giá' });
    }
    if (actualDementors > 0 && (seasonId === 3 || objectives.length < 2) && objectives.length < 3) {
      objectives.push({ type: 'dementor', target: actualDementors, label: 'Đuổi Giám Ngục' });
    }
    if (actualDecrees > 0 && (seasonId === 5 || objectives.length < 2) && objectives.length < 3) {
      objectives.push({ type: 'decree', target: actualDecrees, label: 'Đập Sắc Lệnh' });
    }
    if (actualFiendfyre > 0 && (seasonId === 6 || objectives.length < 2) && objectives.length < 3) {
      objectives.push({ type: 'fiendfyre', label: 'Dập Lửa Địa Ngục' });
    }
    if (actualPetrify > 0 && (seasonId === 2 || objectives.length === 0) && objectives.length < 3) {
      objectives.push({ type: 'petrify', target: actualPetrify, label: 'Giải Hoá Đá' });
    }
    if (actualCauldrons > 0 && objectives.length < 3) {
      objectives.push({ type: 'cauldron', target: actualCauldrons, label: 'Phá Vạc Độc' });
    }
    if (actualLocks > 0 && objectives.length < 3) {
      objectives.push({ type: 'key_lock', target: actualLocks, label: 'Mở Khoá Hầm' });
    }
    if (specialOrder && objectives.length < 3) {
      objectives.push({
        type: 'special_order',
        specialKind: specialOrder.specialKind,
        target: specialOrder.target,
      });
    }
    if (actualJelly > 0 && objectives.length < 3) {
      objectives.push({ type: 'jelly', target: actualJelly, label: 'Phá Thạch Hắc Ám' });
    }
    if (
      actualFrosting > 0 &&
      objectives.length < 3 &&
      (objectives.length === 0 || levelNum % 2 === 1)
    ) {
      objectives.push({ type: 'frosting', target: actualFrosting, label: 'Đập Đá Cổ Ngữ' });
    }
    if (actualChocolate > 0 && objectives.length < 3) {
      objectives.push({ type: 'chocolate', label: 'Diệt Sô-cô-la Lan' });
    }
    if (
      actualIce > 0 &&
      objectives.length < 3 &&
      (objectives.length === 0 || levelNum % 2 === 0)
    ) {
      objectives.push({ type: 'ice', target: actualIce, label: 'Phá Băng Azkaban' });
    }

    if (objectives.length < 2 && !bossConfig && ingredientTarget === 0) {
      let preferredTile = (levelNum + seasonId * 2) % numColors;
      if (levelNum <= 12) preferredTile = levelNum % 2 === 0 ? 4 : 2;
      const multiplier = isSpike ? 1.95 : numColors === 6 ? 1.65 : 1.85;
      const collectTarget = Math.max(22, Math.round(moves * multiplier + seasonId * 3));
      objectives.push({
        type: 'collect',
        tileId: preferredTile,
        target: collectTarget,
      });

      if (objectives.length === 1 && levelNum >= 2) {
        const secondTile = (preferredTile + 2) % numColors;
        objectives.push({
          type: 'collect',
          tileId: secondTile,
          target: Math.max(18, Math.round(collectTarget * 0.85)),
        });
      }
    }
  }

  if (levelNum === 1) {
    objectives.length = 0;
    objectives.push({ type: 'collect', tileId: 4, target: 24 });
    objectives.push({ type: 'collect', tileId: 0, target: 24 });
  }

  const legacyDifficulty: 'normal' | 'hard' | 'boss' = isBoss
    ? 'boss'
    : difficultyTier === 'hard' || difficultyTier === 'nightmare' || difficultyTier === 'exam'
      ? 'hard'
      : 'normal';

  return {
    id: levelNum,
    seasonId,
    chapterId: chapter.globalChapterId,
    globalChapterId: chapter.globalChapterId,
    chapterIndexInSeason: chapter.chapterIndexInSeason,
    title,
    difficultyTier,
    legacyDifficulty,
    starReward: getStageStarReward(levelNum),
    isBoss,
    isChapterBoss,
    isSeasonFinale,
    isExamTrial,
    bossConfig,
    size,
    numColors,
    moves,
    stars,
    rewardGalleons,
    mask,
    jellyGrid,
    iceGrid,
    frostingGrid,
    chocolateGrid,
    cauldronGrid,
    lockGrid,
    swirlGrid,
    petrifyGrid,
    dementorGrid,
    decreeGrid,
    fiendfyreGrid,
    horcruxGrid,
    mazeConfig,
    conveyorLoops,
    ingredientTarget,
    ingredientSpawnCols,
    ingredientExitCells,
    portals,
    bombConfig,
    objectives,
  };
}

const CANDY_LEVEL_CACHE = new Map<number, CandyHogwartsLevel>();
const MAX_CACHE_ENTRIES = 64;

export function getCandyLevelById(id: number): CandyHogwartsLevel {
  const clamped = Math.max(
    1,
    Math.min(CANDY_HOGWARTS_TOTAL_LEVELS, Math.floor(Number(id) || 1))
  );
  const cached = CANDY_LEVEL_CACHE.get(clamped);
  if (cached) return cached;
  const generated = generateCandyHogwartsLevel(clamped);
  if (CANDY_LEVEL_CACHE.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = CANDY_LEVEL_CACHE.keys().next().value;
    if (oldestKey !== undefined) {
      CANDY_LEVEL_CACHE.delete(oldestKey);
    }
  }
  CANDY_LEVEL_CACHE.set(clamped, generated);
  return generated;
}
