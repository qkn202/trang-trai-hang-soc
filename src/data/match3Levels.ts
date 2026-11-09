import { CatalogItem, Match3BoosterId, Match3ProgressionState, ZoneDef, ZoneId } from '../types/game';
import { ZONES } from './zones';

export const MATCH3_BOARD_SIZE = 8;
export const MAX_MINIGAME_STAGE = 777;
export const TOTAL_MINIGAME_STAGES = MAX_MINIGAME_STAGE * 5; // 5 disciplines × 777 levels = 3,885 stages
export const MAX_MATCH3_HEARTS = 5;
export const HEART_REGEN_MS = 5 * 60 * 1000; // 5 minutes per heart
export const EXTRA_MOVES_COUNT = 5;
export const EXTRA_MOVES_GOLD_COST = 120;
export const REFILL_HEARTS_GOLD_COST = 150;

export interface MinigameDifficultyTier {
  tierIndex: number; // 1..7
  label: string;
  badgeEmoji: string;
}

export const MILESTONE_BOSS_STAGES: ReadonlyArray<number> = [
  25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 777,
];

const MILESTONE_BOSS_SET = new Set<number>(MILESTONE_BOSS_STAGES);

export function isMilestoneBossStage(rawStage: number): boolean {
  return MILESTONE_BOSS_SET.has(Math.floor(rawStage));
}

export interface MilestoneBossMeta {
  stage: number;
  bossTitleVi: string;
  bossGuardianVi: string;
  mechanicTagVi: string;
}

const MILESTONE_BOSS_TITLES: Record<number, { guardian: string; title: string; tag: string }> = {
  25: {
    guardian: 'Vua Tinh Nghịch Vườn Bí',
    title: 'Đại Tiệc Sương Giá Đầu Mùa',
    tag: 'Thập Tự Băng Kép & Thùng Gỗ Đối Xứng',
  },
  50: {
    guardian: 'Quản Gia Yêu Tinh Gringotts',
    title: 'Khoá Đồng Hồ Cát Vàng Ròng',
    tag: 'Pháo Đài Đồng Hồ Cát & Thư Cú Phong Ấn',
  },
  100: {
    guardian: 'Giáo Sư Severus Snape',
    title: 'Đại Khảo Thí Bách Niên Hầm Độc Dược',
    tag: 'Kim Cương Cổ Ngữ & Phong Ấn Đa Tầng',
  },
  150: {
    guardian: 'Quý Bà Rosmerta & Chúa Ong Vàng',
    title: 'Bão Mật Hoa Thung Lũng Hogsmeade',
    tag: 'Tổ Sáp Ong Vàng & Khiên Thùng Gỗ 3 Lớp',
  },
  200: {
    guardian: 'Giáo Sư Minerva McGonagall',
    title: 'Trận Đồ Thạch Quân Biến Hình',
    tag: 'Thành Luỹ Cẩm Thạch 4 Góc & Băng Tuyết',
  },
  300: {
    guardian: 'Bác Rubeus Hagrid & Buckbeak',
    title: 'Thử Lửa Giữa Bìa Rừng Cấm',
    tag: 'Mạng Tơ Nhện Rừng Sâu & Sáp Mật Cổ Thụ',
  },
  400: {
    guardian: 'Bellatrix Lestrange',
    title: 'Hầm Khóa Ngân Hàng Cổ Đại',
    tag: 'Xiềng Xích Băng Đen & Hòm Sắt Ba Khóa',
  },
  500: {
    guardian: 'Phượng Hoàng Fawkes',
    title: 'Ngọn Lửa Tái Sinh Tháp Thiên Văn',
    tag: 'Đôi Cánh Phượng Hoàng & 5 Thư Cú Hỏa Ấn',
  },
  600: {
    guardian: 'Rồng Đuôi Gai Hungary',
    title: 'Lãnh Địa Lửa Đỏ Thung Lũng Rồng',
    tag: 'Vảy Rồng Đá Hắc Diện & Sương Lạnh Núi Cao',
  },
  700: {
    guardian: 'Cụ Albus Dumbledore',
    title: 'Phòng Tuyến Tối Thượng Đũa Cơm Nguội',
    tag: 'Mê Cung Bảo Bối 6 Sắc & Ấn Chì Tối Cổ',
  },
  777: {
    guardian: 'Chúa Tể Hắc Ám — Đỉnh Priori Incantatem',
    title: 'Vương Miện Huyền Thoại Đỉnh Tháp 777',
    tag: 'Đại Kết Giới Toàn Năng 777 — Trận Cuối Cùng',
  },
};

export function getMilestoneBossMeta(rawStage: number): MilestoneBossMeta | null {
  const s = Math.floor(rawStage);
  const found = MILESTONE_BOSS_TITLES[s];
  if (!found) return null;
  return {
    stage: s,
    bossTitleVi: found.title,
    bossGuardianVi: found.guardian,
    mechanicTagVi: found.tag,
  };
}

export function getMinigameDifficultyTier(rawStage: number): MinigameDifficultyTier {
  const s = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(rawStage)));
  if (s <= 25) return { tierIndex: 1, label: 'Tân Sinh Nhập Môn', badgeEmoji: '🌱' };
  if (s <= 100) return { tierIndex: 2, label: 'Học Trò Hang Sóc', badgeEmoji: '🌿' };
  if (s <= 220) return { tierIndex: 3, label: 'Phù Thủy Thực Chiến', badgeEmoji: '⚡' };
  if (s <= 380) return { tierIndex: 4, label: 'Cao Thủ Thần Sáng', badgeEmoji: '🔥' };
  if (s <= 560) return { tierIndex: 5, label: 'Bậc Thầy Hội Phượng Hoàng', badgeEmoji: '🦅' };
  if (s <= 700) return { tierIndex: 6, label: 'Đại Pháp Sư Cổ Ngữ', badgeEmoji: '🔮' };
  return { tierIndex: 7, label: 'Huyền Thoại Đỉnh 777', badgeEmoji: '👑' };
}

/**
 * Unified base Star reward curve across Stages 1..777 for every mini-game.
 * Sums to exactly 1,455 🌟 per 777-level discipline (5 × 1,455 + 3 starter = 7,278 🌟 base,
 * vs 7,150 🌟 total estate Star cost -> guaranteed zero soft-lock, 200+ hours marathon).
 */
export function getStageStarReward(rawStage: number): number {
  const s = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(rawStage)));
  if (s === MAX_MINIGAME_STAGE) return 6;
  if (s % 10 === 0) return s >= 500 ? 5 : s >= 200 ? 4 : 3;
  if (s % 10 === 5) return s >= 300 ? 3 : 2;
  if (s >= 250 && s % 5 === 3) return 2;
  if (s >= 320 && s % 2 === 0) return 2;
  if (s >= 560) return 2;
  return 1;
}

export function getExtraMovesGoldCost(rawLevel: number): number {
  const lv = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(rawLevel)));
  return Math.min(420, EXTRA_MOVES_GOLD_COST + Math.floor(lv / 20) * 12);
}

export type GemColor = 'ruby' | 'sapphire' | 'emerald' | 'topaz' | 'amethyst' | 'candy_pink';

export type SpecialKind = 'none' | 'rocket_h' | 'rocket_v' | 'bomb' | 'snitch';

export interface GemColorMeta {
  id: GemColor;
  name: string;
  emoji: string;
  fillPrimary: string;
  fillLight: string;
  stroke: string;
  glow: string;
}

export const GEM_COLORS: GemColor[] = [
  'ruby',
  'sapphire',
  'emerald',
  'topaz',
  'amethyst',
  'candy_pink',
];

export const GEM_META: Record<GemColor, GemColorMeta> = {
  ruby: {
    id: 'ruby',
    name: 'Dâu Tây Đỏ Mọng',
    emoji: '🍓',
    fillPrimary: '#dc2626',
    fillLight: '#fca5a5',
    stroke: '#7f1d1d',
    glow: 'rgba(239, 68, 68, 0.55)',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Việt Quất Đồi Gió',
    emoji: '🫐',
    fillPrimary: '#2563eb',
    fillLight: '#93c5fd',
    stroke: '#1e3a8a',
    glow: 'rgba(59, 130, 246, 0.55)',
  },
  emerald: {
    id: 'emerald',
    name: 'Lê Xanh Vườn Sóc',
    emoji: '🍐',
    fillPrimary: '#16a34a',
    fillLight: '#86efac',
    stroke: '#14532d',
    glow: 'rgba(34, 197, 94, 0.55)',
  },
  topaz: {
    id: 'topaz',
    name: 'Bí Ngô Mùa Gặt',
    emoji: '🎃',
    fillPrimary: '#ea580c',
    fillLight: '#fdba74',
    stroke: '#7c2d12',
    glow: 'rgba(249, 115, 22, 0.6)',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Mận Tím Hang Sóc',
    emoji: '🍑',
    fillPrimary: '#9333ea',
    fillLight: '#d8b4fe',
    stroke: '#581c87',
    glow: 'rgba(168, 85, 247, 0.55)',
  },
  candy_pink: {
    id: 'candy_pink',
    name: 'Hũ Mật Ong Vàng',
    emoji: '🍯',
    fillPrimary: '#d97706',
    fillLight: '#fde68a',
    stroke: '#78350f',
    glow: 'rgba(245, 158, 11, 0.55)',
  },
};

export interface Match3BoosterDef {
  id: Match3BoosterId;
  name: string;
  shortLabel: string;
  emoji: string;
  goldCost: number;
  requiresCellTarget: boolean;
  description: string;
}

export const MATCH3_BOOSTERS: Match3BoosterDef[] = [
  {
    id: 'reparo_hammer',
    name: 'Xẻng Bạc Làm Vườn',
    shortLabel: 'Xẻng Bạc',
    emoji: '🪏',
    goldCost: 65,
    requiresCellTarget: true,
    description: 'Xúc gọn ngay 1 nông sản hoặc gỡ 1 lớp thùng gỗ/sương giá tại ô chọn (không tốn lượt).',
  },
  {
    id: 'row_col_cannon',
    name: 'Bình Tưới Phép Thuật',
    shortLabel: 'Bình Tưới',
    emoji: '🚿',
    goldCost: 95,
    requiresCellTarget: true,
    description: 'Tưới bừng sáng thu hoạch trọn 1 hàng ngang + 1 cột dọc qua ô chọn (không tốn lượt).',
  },
  {
    id: 'alohomora_shuffle',
    name: 'Đũa Phép Mùa Gặt',
    shortLabel: 'Đũa Xáo',
    emoji: '🪄',
    goldCost: 55,
    requiresCellTarget: false,
    description: 'Vẩy đũa trộn mới toàn bộ nông sản trên gác xép và tạo 1 Hũ Mứt Nổ (không tốn lượt).',
  },
];

export type Match3GoalKind = 'gem' | 'ice' | 'box' | 'web' | 'scroll' | 'honey';

export interface Match3GoalDef {
  kind: Match3GoalKind;
  color?: GemColor;
  target: number;
}

export interface Match3CellBlueprint {
  hole?: boolean;
  ice?: number; // 0..2
  box?: number; // 0..3
  web?: boolean;
  honey?: boolean;
}

export type Match3Difficulty = 'normal' | 'hard' | 'boss';

export interface Match3LevelDef {
  level: number;
  chapterIndex: number; // 0..9
  chapterName: string;
  title: string;
  difficulty: Match3Difficulty;
  moves: number;
  activeColors: GemColor[];
  starReward: number; // 1..6 (from getStageStarReward)
  goldReward: number;
  xpReward: number;
  bonusSandReward: number;
  bonusBoosterReward?: Match3BoosterId;
  scrollsTotal: number;
  goals: Match3GoalDef[];
  cells: Match3CellBlueprint[][]; // 8x8
}

export function createInitialMatch3State(): Match3ProgressionState {
  return {
    stars: 3, // Warm Gardenscapes start so player can immediately build Hang Sóc (3 🌟)!
    totalStarsEarned: 3,
    currentLevel: 1,
    maxClearedLevel: 0,
    winStreak: 0,
    hearts: MAX_MATCH3_HEARTS,
    nextHeartAt: 0,
    boosters: {
      reparo_hammer: 2,
      row_col_cannon: 1,
      alohomora_shuffle: 2,
    },
    levelsWon: 0,
  };
}

// ==================== 200+ HOUR MARATHON STAR ECONOMY (7,150 🌟 TOTAL ESTATE) ====================

const ITEM_STAR_COST_BY_ID: Record<string, number> = {
  // Chapter 1 (Lv.1..6 — 90 🌟)
  burrow_house_canon: 3,
  molly_apple_bakery: 5,
  butterbeer_cart: 7,
  burrow_chicken_coop: 11,
  burrow_self_knitting_loom: 16,
  burrow_pumpkin_gnomes: 20,
  burrow_owl_post: 28,
  // Chapter 2 (Lv.7..21 — 741 🌟)
  arthur_ford_shed: 36,
  burrow_reed_pond_mill: 44,
  burrow_apple_orchard: 54,
  niffler_den: 65,
  burrow_cider_apiary: 78,
  burrow_puffskein_pasture: 92,
  burrow_honeydukes_canon: 110,
  hogsmeade_stone_bridge: 124,
  halloween_arch: 138,
  // Chapter 3 (Lv.24..44 — 1,493 🌟)
  burrow_windmill_canon: 155,
  burrow_broomsticks_canon: 175,
  burrow_greenhouse_canon: 195,
  floo_fireplace_gate: 212,
  hagrid_bowtruckle: 232,
  burrow_feast_marquee: 252,
  eeylops_owl_emporium: 272,
  // Chapter 4 (Lv.48..70 — 2,072 🌟)
  hagrid_pumpkin_hut: 292,
  whomping_willow: 310,
  owlery_elf_hut: 330,
  hogsmeade_harvest_fountain: 355,
  hippogriff_glade: 380,
  black_lake_boats: 405,
  // Chapter 5 (Lv.75..96 — 1,878 🌟)
  thestral_grove: 405,
  unicorn_glade: 431,
  phoenix_perch: 465,
  dragon_lair: 577,
};

const ZONE_STAR_COST_BY_ID: Record<ZoneId, number> = {
  ga_hogsmeade: 0,
  hem_xeo: 0,
  bia_rung_cam: 12,
  ho_den: 28,
  lang_tuyet: 50,
  vuon_thao_duoc: 78,
  ham_gringotts: 110,
  san_quidditch: 148,
  thung_lung_rong: 195,
  lau_dai_hogwarts: 255,
};

export function getItemPuzzleStarCost(item: CatalogItem): number {
  if (
    item.category === 'path' ||
    item.category === 'terrain' ||
    Boolean(item.isFarmlandPlot) ||
    Boolean(item.isAnimalPasturePlot) ||
    item.connectableGroup === 'flower_garden' ||
    Boolean(item.isCoasterTrackPiece) ||
    Boolean(item.isZooFence) ||
    Boolean(item.isCreatureFeeder) ||
    Boolean(item.elevationDelta)
  ) {
    return 0; // Paths, terrain, farmland plots & small helpers stay Gold-only for free layout!
  }
  if (
    item.category === 'decor' &&
    item.baseIncome <= 0 &&
    !item.isRuralFarmstead &&
    !item.isFlooPortal
  ) {
    return 0; // Small benches, pines, floating candles & lanterns stay Gold-only!
  }
  const explicitCost = ITEM_STAR_COST_BY_ID[item.id];
  if (typeof explicitCost === 'number') {
    return explicitCost;
  }
  if (item.unlockLevel <= 3) return 8;
  if (item.unlockLevel <= 12) return 45;
  if (item.unlockLevel <= 30) return 150;
  if (item.unlockLevel <= 60) return 300;
  return 440;
}

export function getUpgradePuzzleStarCost(currentStars: number, item?: CatalogItem): number {
  const baseStars = item ? Math.max(3, getItemPuzzleStarCost(item)) : 20;
  const tierFactor = currentStars >= 4 ? 0.08 : currentStars >= 3 ? 0.06 : 0.04;
  return Math.max(currentStars >= 3 ? 4 : 2, Math.min(28, Math.round(baseStars * tierFactor)));
}

export function getZonePuzzleStarCost(zone: ZoneDef): number {
  const explicit = ZONE_STAR_COST_BY_ID[zone.id];
  if (typeof explicit === 'number') {
    return explicit;
  }
  if (zone.unlockLevel <= 1) return 0;
  if (zone.unlockLevel <= 8) return 28;
  if (zone.unlockLevel <= 25) return 78;
  if (zone.unlockLevel <= 50) return 148;
  return 255;
}

export function getWinStreakGifts(winStreak: number): SpecialKind[] {
  if (winStreak <= 0) return [];
  if (winStreak === 1) return ['rocket_h'];
  if (winStreak === 2) return ['rocket_v', 'bomb'];
  return ['rocket_h', 'bomb', 'snitch'];
}

// ==================== DETERMINISTIC 777-LEVEL HARVEST ATTIC GENERATOR ====================

const ROMAN_ACTS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

function seededRand(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  if (s === 0) s = 1234567;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export function getMatch3LevelDef(rawLevel: number): Match3LevelDef {
  const level = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(rawLevel)));
  const totalChapter = Math.floor((level - 1) / 10); // 0..77 (78 chapters across 777 stages)
  const chapterIndex = totalChapter % 10;
  const actIndex = Math.min(ROMAN_ACTS.length - 1, Math.floor(totalChapter / 10));
  const zone = ZONES[chapterIndex] ?? ZONES[0];
  const stageInChapter = ((level - 1) % 10) + 1;

  const isGrandFinale = level === MAX_MINIGAME_STAGE;
  const milestoneBoss = getMilestoneBossMeta(level);
  const isExtraHard = level >= 250 && level % 5 === 3;
  const difficulty: Match3Difficulty =
    isGrandFinale || Boolean(milestoneBoss) || stageInChapter === 10
      ? 'boss'
      : stageInChapter === 5 || isExtraHard
        ? 'hard'
        : 'normal';

  const starReward = getStageStarReward(level);
  const numColors =
    level <= 4
      ? 4
      : level <= 120
        ? difficulty === 'boss' && level >= 40
          ? 6
          : 5
        : level <= 240
          ? difficulty !== 'normal' || level % 2 === 0
            ? 6
            : 5
          : 6;
  const activeColors = GEM_COLORS.slice(0, numColors);

  const rng = seededRand(level * 977 + 31);

  // Initialize empty 8x8 blueprint
  const cells: Match3CellBlueprint[][] = Array.from({ length: MATCH3_BOARD_SIZE }, () =>
    Array.from({ length: MATCH3_BOARD_SIZE }, () => ({}))
  );

  // 6 symmetric cutout topologies across 777 stages (always preserving central columns & scroll exits!)
  if (milestoneBoss && !isGrandFinale) {
    // Hand-crafted emblem arena cutouts for Milestone Boss stages (25..700)
    if (level === 50 || level === 300 || level === 700) {
      // Hourglass Vault Arena
      cells[3][0].hole = true;
      cells[4][0].hole = true;
      cells[3][7].hole = true;
      cells[4][7].hole = true;
    } else if (level === 100 || level === 200 || level === 400 || level === 600) {
      // Royal Diamond Bastion
      cells[0][0].hole = true;
      cells[0][7].hole = true;
      cells[7][0].hole = true;
      cells[7][7].hole = true;
    }
  } else if (level >= 8 && !isGrandFinale) {
    const topo = (level + totalChapter) % 9;
    if (topo === 0) {
      cells[0][0].hole = true;
      cells[0][7].hole = true;
    } else if (topo === 2 && level >= 35) {
      cells[0][0].hole = true;
      cells[0][7].hole = true;
      cells[7][0].hole = true;
      cells[7][7].hole = true;
    } else if (topo === 4 && level >= 90) {
      cells[3][0].hole = true;
      cells[4][0].hole = true;
      cells[3][7].hole = true;
      cells[4][7].hole = true;
    } else if (topo === 6 && level >= 180) {
      cells[0][0].hole = true;
      cells[1][0].hole = true;
      cells[0][7].hole = true;
      cells[1][7].hole = true;
    } else if (topo === 8 && level >= 320) {
      cells[0][3].hole = true;
      cells[0][4].hole = true;
      cells[7][0].hole = true;
      cells[7][7].hole = true;
    }
  }

  let totalIceLayers = 0;
  let totalBoxLayers = 0;
  let totalWebs = 0;
  let totalHoney = 0;
  let scrollsTotal = 0;

  // Symmetric coordinate helper so every board looks hand-crafted like Royal Match!
  const applySymmetric = (
    coords: Array<[number, number]>,
    fn: (cell: Match3CellBlueprint, r: number, c: number) => void
  ) => {
    const visited = new Set<string>();
    for (const [r, c] of coords) {
      for (const [rr, cc] of [
        [r, c],
        [r, 7 - c],
      ]) {
        if (rr < 0 || rr >= 8 || cc < 0 || cc >= 8) continue;
        const k = `${rr},${cc}`;
        if (visited.has(k)) continue;
        visited.add(k);
        if (!cells[rr][cc].hole) {
          fn(cells[rr][cc], rr, cc);
        }
      }
    }
  };

  // Progressive obstacle recipes across Levels 1 -> 777 (capped at <= 3 families per stage so every obstacle is an active goal!)
  let useIce = level >= 3 && (level <= 5 || level % 3 !== 2 || difficulty !== 'normal');
  let useBoxes = level >= 6 && (level % 2 === 0 || difficulty !== 'normal' || level >= 220);
  let useWebs =
    level >= 11 &&
    (level % 3 === 0 || difficulty === 'hard' || difficulty === 'boss' || (level >= 350 && level % 2 === 1));
  let useScrolls =
    level >= 14 &&
    (level % 4 === 2 || stageInChapter === 8 || difficulty === 'boss' || (level >= 420 && level % 3 === 1));
  let useHoney =
    level >= 160 &&
    !isGrandFinale &&
    (level % 3 === 1 || (difficulty === 'boss' && level % 2 === 0));

  if (isGrandFinale) {
    useIce = true;
    useBoxes = true;
    useScrolls = true;
    useWebs = false;
    useHoney = false;
  } else {
    // Cap at <= 3 active obstacle families per stage (preserving useHoney when scheduled!)
    let activeFamilies =
      (useIce ? 1 : 0) +
      (useBoxes ? 1 : 0) +
      (useWebs ? 1 : 0) +
      (useScrolls ? 1 : 0) +
      (useHoney ? 1 : 0);
    const dropOrder = (level + totalChapter) % 4;
    const candidates: Array<'web' | 'box' | 'ice' | 'scroll'> = [
      'web',
      'box',
      'ice',
      'scroll',
    ];
    for (let k = 0; k < 4 && activeFamilies > 3; k++) {
      const pick = candidates[(dropOrder + k) % 4];
      if (pick === 'web' && useWebs) {
        useWebs = false;
        activeFamilies--;
      } else if (pick === 'box' && useBoxes) {
        useBoxes = false;
        activeFamilies--;
      } else if (pick === 'ice' && useIce) {
        useIce = false;
        activeFamilies--;
      } else if (pick === 'scroll' && useScrolls) {
        useScrolls = false;
        activeFamilies--;
      }
    }
  }

  if (useIce) {
    const iceTier = level >= 25 && (difficulty !== 'normal' || level % 2 === 0 || level >= 160) ? 2 : 1;
    const pattern = level % 4;
    const coords: Array<[number, number]> =
      pattern === 0
        ? [
            [2, 2],
            [2, 3],
            [3, 2],
            [3, 3],
            [4, 2],
            [4, 3],
            [5, 2],
            [5, 3],
          ]
        : pattern === 1
          ? [
              [1, 1],
              [1, 2],
              [2, 1],
              [5, 1],
              [6, 1],
              [6, 2],
              [3, 3],
              [4, 3],
            ]
          : pattern === 2
            ? [
                [2, 1],
                [3, 2],
                [4, 2],
                [5, 1],
                [2, 3],
                [5, 3],
              ]
            : [
                [1, 2],
                [1, 3],
                [2, 2],
                [3, 1],
                [4, 1],
                [5, 2],
                [6, 2],
                [6, 3],
              ];
    if (level >= 280) {
      coords.push([2, 0], [5, 0]);
    }
    applySymmetric(coords, (cell, r) => {
      const layers =
        iceTier === 2 && (level >= 300 || (r >= 2 && r <= 5 && (difficulty !== 'normal' || r >= 3)))
          ? 2
          : 1;
      cell.ice = layers;
      totalIceLayers += layers;
    });
  }

  if (useBoxes) {
    const maxBoxHp = level >= 55 ? 3 : level >= 22 ? 2 : 1;
    const boxPattern = (level + 1) % 4;
    const boxCoords: Array<[number, number]> =
      boxPattern === 0
        ? [
            [3, 1],
            [4, 1],
            [3, 3],
            [4, 3],
          ]
        : boxPattern === 1
          ? [
              [2, 2],
              [5, 2],
              [3, 0],
              [4, 0],
            ]
          : boxPattern === 2
            ? [
                [1, 3],
                [2, 3],
                [5, 2],
                [6, 2],
              ]
            : [
                [2, 1],
                [3, 2],
                [4, 2],
                [5, 1],
                [6, 3],
              ];
    if (level >= 240 && difficulty !== 'normal') {
      boxCoords.push([5, 3]);
    }
    applySymmetric(boxCoords, (cell, r) => {
      if (useScrolls && (r === 0 || r === 7)) return;
      if (cell.ice && cell.ice > 0) {
        totalIceLayers = Math.max(0, totalIceLayers - cell.ice);
        cell.ice = 0;
      }
      const hp = level >= 380 || (r >= 3 && r <= 4) ? maxBoxHp : Math.max(1, maxBoxHp - 1);
      cell.box = hp;
      cell.web = false;
      totalBoxLayers += hp;
    });
  }

  if (useWebs) {
    const webCoords: Array<[number, number]> = [
      [2, 1],
      [2, 3],
      [5, 1],
      [5, 3],
    ];
    if (difficulty !== 'normal' || level >= 260) {
      webCoords.push([4, 2]);
    }
    if (level >= 480) {
      webCoords.push([6, 1]);
    }
    applySymmetric(webCoords, (cell, r, c) => {
      if (r <= 2 && (c === 3 || c === 4) && (cells[r][2]?.box || useScrolls)) return;
      if (!cell.box) {
        cell.web = true;
        totalWebs += 1;
      }
    });
  }

  if (useScrolls) {
    scrollsTotal = isGrandFinale
      ? 6
      : level >= 550 && difficulty === 'boss'
        ? 6
        : level >= 350 && difficulty !== 'normal'
          ? 5
          : difficulty === 'boss' || level >= 220
            ? 4
            : level >= 45
              ? 3
              : 2;
  }

  if (useHoney) {
    const honeyPattern = level % 3;
    const honeyCoords: Array<[number, number]> =
      honeyPattern === 0
        ? [
            [2, 2],
            [3, 1],
            [4, 1],
            [5, 2],
          ]
        : honeyPattern === 1
          ? [
              [1, 2],
              [3, 3],
              [4, 3],
              [6, 2],
            ]
          : [
              [2, 1],
              [2, 3],
              [5, 1],
              [5, 3],
            ];
    if (level >= 360 || difficulty !== 'normal') {
      honeyCoords.push([4, 2]);
    }
    applySymmetric(honeyCoords, (cell, r) => {
      if (useScrolls && (r === 0 || r === 7)) return;
      if (!cell.box && !cell.web) {
        if (cell.ice && cell.ice > 0) {
          totalIceLayers = Math.max(0, totalIceLayers - cell.ice);
          cell.ice = 0;
        }
        cell.honey = true;
        totalHoney += 1;
      }
    });
  }

  const goals: Match3GoalDef[] = [];
  if (totalHoney > 0) {
    goals.push({ kind: 'honey', target: totalHoney });
  }
  if (totalIceLayers > 0) {
    goals.push({ kind: 'ice', target: totalIceLayers });
  }
  if (totalBoxLayers > 0 && goals.length < 3) {
    goals.push({ kind: 'box', target: totalBoxLayers });
  }
  if (totalWebs > 0 && goals.length < 3) {
    goals.push({ kind: 'web', target: totalWebs });
  }
  if (scrollsTotal > 0 && goals.length < 3) {
    goals.push({ kind: 'scroll', target: scrollsTotal });
  }

  const finalGoals = goals.slice(0, 3);
  if (!finalGoals.some((g) => g.kind === 'scroll')) {
    scrollsTotal = 0;
  }

  // Always include 1-2 gem goals when obstacle goals < 2 so every stage feels colorful!
  const lateGemScale = Math.min(26, Math.floor(level * 0.045));
  if (finalGoals.length === 0) {
    const c1 = activeColors[Math.floor(rng() * activeColors.length)];
    let c2 = activeColors[(activeColors.indexOf(c1) + 1) % activeColors.length];
    if (c2 === c1) c2 = 'sapphire';
    const baseTarget = level <= 2 ? 15 : 22 + lateGemScale;
    finalGoals.push({ kind: 'gem', color: c1, target: baseTarget });
    finalGoals.push({ kind: 'gem', color: c2, target: baseTarget - 3 });
  } else if (finalGoals.length === 1) {
    const c1 = activeColors[Math.floor(rng() * activeColors.length)];
    finalGoals.push({
      kind: 'gem',
      color: c1,
      target: 18 + lateGemScale,
    });
  }

  // Move budget tightens across 1..777 so late tiers demand Rocket+Bomb / Chong Chóng combos
  const workloadMoves =
    14 +
    Math.ceil(totalIceLayers * 0.31) +
    Math.ceil(totalBoxLayers * 0.42) +
    Math.ceil(totalWebs * 0.35) +
    Math.ceil(totalHoney * 0.48) +
    Math.ceil(scrollsTotal * (totalBoxLayers > 0 ? 2.35 : 1.95)) +
    (numColors >= 6 ? 3 : 0);
  const lateTighten =
    level >= 620 ? -4 : level >= 450 ? -3 : level >= 260 ? -2 : level >= 120 ? -1 : 0;
  const earlyCushion = level <= 5 ? 5 : level <= 25 ? 3 : difficulty === 'normal' ? 1 : 0;
  const maxMoves = difficulty === 'boss' ? 32 : difficulty === 'hard' ? 29 : 28;
  const minMoves = level >= 400 ? 15 : 16;
  const moves = Math.max(minMoves, Math.min(maxMoves, workloadMoves + earlyCushion + lateTighten));

  const actTag = actIndex > 0 ? ` • Hồi ${ROMAN_ACTS[actIndex]}` : '';
  const diffTitle = isGrandFinale
    ? `👑 Đỉnh Tháp Mùa Gặt 777: ${milestoneBoss?.bossTitleVi ?? zone.name}`
    : milestoneBoss
      ? `👑 Đại Trùm Mốc ${level} — ${milestoneBoss.bossTitleVi}`
      : difficulty === 'boss'
        ? `🔥 Trùm Phong Ấn Cấp ${totalChapter + 1}: ${zone.name}`
        : difficulty === 'hard'
          ? `💀 Thử Thách Khó: ${zone.name}${actTag}`
          : `Chương ${totalChapter + 1}: ${zone.name}${actTag}`;

  const boosterCycle: Match3BoosterId[] = [
    'reparo_hammer',
    'alohomora_shuffle',
    'row_col_cannon',
  ];

  const effectiveStageCap = Math.min(level, 260) + Math.floor(Math.max(0, level - 260) * 0.35);
  return {
    level,
    chapterIndex,
    chapterName: `${zone.name}${actTag}`,
    title: diffTitle,
    difficulty,
    moves,
    activeColors,
    starReward,
    goldReward: Math.round((45 + effectiveStageCap * 4.5) * Math.min(3, starReward) * 0.72),
    xpReward: Math.round((30 + effectiveStageCap * 3) * Math.min(3, starReward) * 0.75),
    bonusSandReward: isGrandFinale ? 5 : difficulty === 'boss' ? 2 : difficulty === 'hard' ? 1 : 0,
    bonusBoosterReward:
      difficulty !== 'normal' ? boosterCycle[level % boosterCycle.length] : undefined,
    scrollsTotal,
    goals: finalGoals.slice(0, 3),
    cells,
  };
}
