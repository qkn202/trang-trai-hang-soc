import {
  CreatureMorphVariant,
  RawIngredientId,
  SuitcaseExpeditionId,
  SuitcaseSanctuaryState,
} from '../types/game';

export const MAX_BOND_LEVEL = 10;
export const GROOM_COOLDOWN_MS = 40_000; // 40s cozy cooldown
export const TRAIN_COOLDOWN_MS = 55_000; // 55s trick training cooldown
export const INCUBATION_DURATION_MS = 75_000; // 75s rune egg incubation

export interface CreatureSpeciesProfile {
  habitatItemId: string;
  speciesName: string;
  emoji: string;
  beastSpriteKey: string;
  sanctuaryRoomTitle: string;
  dioramaGradient: string;
  favoriteTreat: string;
  trickName: string;
  loreNote: string;
  morphNames: Record<CreatureMorphVariant, string>;
}

export const CREATURE_SPECIES_PROFILES: CreatureSpeciesProfile[] = [
  {
    habitatItemId: 'niffler_den',
    speciesName: 'Đào Mỏ Niffler',
    emoji: '🪙',
    beastSpriteKey: 'beast_niffler',
    sanctuaryRoomTitle: 'Hang Kho Báu Nhung Đỏ',
    dioramaGradient: 'linear-gradient(135deg, #451a03 0%, #92400e 55%, #f59e0b 100%)',
    favoriteTreat: 'Đồng xu Sô-cô-la Mạ Vàng',
    trickName: 'Đánh Hơi Mạch Vàng Ẩn',
    loreNote: 'Chiếc túi trước bụng Niffler được yểm bùa không đáy, chứa được cả đống trang sức lấp lánh!',
    morphNames: {
      normal: 'Lông Đen Tuyền Nguyên Bản',
      mystic: 'Niffler Ánh Bạc Ngân Hà',
      radiant: 'Niffler Hoàng Kim Bạch Ngọc',
    },
  },
  {
    habitatItemId: 'hagrid_bowtruckle',
    speciesName: 'Vệ Thần Cây Bowtruckle',
    emoji: '🌱',
    beastSpriteKey: 'hagrid_bowtruckle',
    sanctuaryRoomTitle: 'Tán Cây Gỗ Đũa Phép Xanh Biếc',
    dioramaGradient: 'linear-gradient(135deg, #064e3b 0%, #15803d 58%, #86efac 100%)',
    favoriteTreat: 'Hạt Sương Mầm Cây Mandrake',
    trickName: 'Mở Khóa Cổ Ngữ Nhánh Cây',
    loreNote: 'Vệ thần tí hon canh giữ những gốc cây quý dùng để chế tác đũa phép thượng hạng.',
    morphNames: {
      normal: 'Chồi Xanh Lá Mạ Nguyên Bản',
      mystic: 'Bowtruckle Sương Lam Đêm Trăng',
      radiant: 'Bowtruckle Lá Thu Vàng Ròng',
    },
  },
  {
    habitatItemId: 'hippogriff_glade',
    speciesName: 'Bằng Mã Hippogriff',
    emoji: '🦅',
    beastSpriteKey: 'beast_hippogriff',
    sanctuaryRoomTitle: 'Trảng Rừng Sương Sớm Cúi Chào',
    dioramaGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 52%, #93c5fd 100%)',
    favoriteTreat: 'Cá Tuyết Tươi Hồ Đen',
    trickName: 'Lượn Vòng Chào Lễ Nghĩa Hoàng Gia',
    loreNote: 'Sinh vật kiêu hãnh chỉ cho phép những phù thủy biết cúi đầu lịch sự vuốt ve bộ lông cánh bạc.',
    morphNames: {
      normal: 'Cánh Xám Bạc Nguyên Bản',
      mystic: 'Bằng Mã Bão Tuyết Lam Băng',
      radiant: 'Bằng Mã Lông Vàng Mặt Trời',
    },
  },
  {
    habitatItemId: 'thestral_grove',
    speciesName: 'Vong Mã Thestral',
    emoji: '🦇',
    beastSpriteKey: 'beast_thestral',
    sanctuaryRoomTitle: 'Thung Lũng Chạng Vạng Đom Đóm',
    dioramaGradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 58%, #818cf8 100%)',
    favoriteTreat: 'Quả Dâu Đêm Rừng Cấm',
    trickName: 'Định Hướng Xuyên Màn Sương',
    loreNote: 'Loài tuấn mã có cánh cực kỳ thông thái và trung thành, sở hữu khả năng tìm đường không bao giờ lạc.',
    morphNames: {
      normal: 'Cánh Đêm Huyền Mặc Nguyên Bản',
      mystic: 'Vong Mã Tinh Vân Tím Biếc',
      radiant: 'Vong Mã Hào Quang Sao Băng',
    },
  },
  {
    habitatItemId: 'unicorn_glade',
    speciesName: 'Kỳ Lân Trắng Unicorn',
    emoji: '🦄',
    beastSpriteKey: 'beast_unicorn',
    sanctuaryRoomTitle: 'Suối Nguồn Ánh Trăng Tinh Khiết',
    dioramaGradient: 'linear-gradient(135deg, #1e1b4b 0%, #0284c7 52%, #e0f2fe 100%)',
    favoriteTreat: 'Cỏ Bạc Hà Ngậm Ánh Trăng',
    trickName: 'Ban Phước Tịnh Thủy Suối Tiên',
    loreNote: 'Lông đuôi Kỳ Lân là một trong ba lõi đũa phép tối thượng của cụ Ollivander.',
    morphNames: {
      normal: 'Bạch Tuyết Sừng Vàng Nguyên Bản',
      mystic: 'Kỳ Lân Cực Quang Lam Ngọc',
      radiant: 'Kỳ Lân Tinh Tú Kim Cương',
    },
  },
  {
    habitatItemId: 'phoenix_perch',
    speciesName: 'Phượng Hoàng Lửa Fawkes',
    emoji: '🔥',
    beastSpriteKey: 'beast_phoenix',
    sanctuaryRoomTitle: 'Đài Son Khúc Ca Tái Sinh',
    dioramaGradient: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 54%, #fde047 100%)',
    favoriteTreat: 'Quả Hỏa Châu Quế Thơm',
    trickName: 'Khúc Hát Chữa Lành & Vũ Điệu Lửa',
    loreNote: 'Tiếng hót của Phượng Hoàng tiếp thêm lòng dũng cảm và nước mắt của nó chữa lành mọi vết thương.',
    morphNames: {
      normal: 'Đỏ Son Viền Vàng Nguyên Bản',
      mystic: 'Phượng Hoàng Lửa Lam Tinh Khiết',
      radiant: 'Phượng Hoàng Thái Dương Vĩnh Cửu',
    },
  },
  {
    habitatItemId: 'dragon_lair',
    speciesName: 'Rồng Đuôi Gai Hungary',
    emoji: '🐉',
    beastSpriteKey: 'beast_dragon',
    sanctuaryRoomTitle: 'Hẻm Núi Dung Nham Tổ Vàng',
    dioramaGradient: 'linear-gradient(135deg, #27272a 0%, #9a3412 55%, #fb923c 100%)',
    favoriteTreat: 'Đùi Nướng Gia Vị Lửa Rồng',
    trickName: 'Phun Vòng Pháo Lửa Mừng Lễ Hội',
    loreNote: 'Chúa tể bầu trời thế giới phép thuật với lớp vảy đồng cứng như thép và hơi thở rực sáng.',
    morphNames: {
      normal: 'Vảy Đồng Đỏ Lửa Nguyên Bản',
      mystic: 'Rồng Hắc Diện Thạch Lửa Tím',
      radiant: 'Hoàng Long Vảy Vàng Thần Thoại',
    },
  },
];

export const MORPH_INFO: Record<
  CreatureMorphVariant,
  {
    badge: string;
    shortLabel: string;
    incomeMult: number;
    wonderBonus: number;
    cssFilter: string;
    glowColor: string;
    textColor: string;
  }
> = {
  normal: {
    badge: '🐾 Nguyên Bản',
    shortLabel: 'Nguyên Bản',
    incomeMult: 1.0,
    wonderBonus: 0,
    cssFilter: 'none',
    glowColor: 'rgba(253, 224, 71, 0)',
    textColor: '#5c2d0c',
  },
  mystic: {
    badge: '🌙 Biến Thể Lam Tinh (+35%G)',
    shortLabel: 'Lam Tinh',
    incomeMult: 1.35,
    wonderBonus: 0.6,
    cssFilter: 'hue-rotate(175deg) saturate(1.35) brightness(1.08)',
    glowColor: 'rgba(56, 189, 248, 0.68)',
    textColor: '#0369a1',
  },
  radiant: {
    badge: '✨ Hoàng Kim Thần Thoại (+75%G)',
    shortLabel: 'Hoàng Kim',
    incomeMult: 1.75,
    wonderBonus: 1.3,
    cssFilter: 'sepia(0.45) saturate(2.15) hue-rotate(-12deg) brightness(1.14)',
    glowColor: 'rgba(250, 204, 21, 0.85)',
    textColor: '#b45309',
  },
};

export interface SuitcaseExpeditionDef {
  id: SuitcaseExpeditionId;
  name: string;
  emoji: string;
  minParkLevel: number;
  durationSec: number;
  description: string;
  baseGold: number;
  baseXp: number;
  guaranteedIngredients: Array<{ id: RawIngredientId; qty: number }>;
  cardDropChance: number;
}

export const SUITCASE_EXPEDITIONS: SuitcaseExpeditionDef[] = [
  {
    id: 'glowing_mushroom_cave',
    name: 'Hang Nấm Phát Sáng Bìa Rừng',
    emoji: '🍄',
    minParkLevel: 4,
    durationSec: 60,
    description: 'Thú cưng luồn qua hốc cây cổ thụ tìm Lá Mandrake tươi và Bí Ngô Ngọt mang về Xưởng Ủ Phép.',
    baseGold: 19,
    baseXp: 55,
    guaranteedIngredients: [
      { id: 'mandrake_leaf', qty: 2 },
      { id: 'sweet_pumpkin', qty: 2 },
    ],
    cardDropChance: 0,
  },
  {
    id: 'moonlit_black_lake',
    name: 'Ghềnh Đá Ánh Trăng Hồ Đen',
    emoji: '🌌',
    minParkLevel: 18,
    durationSec: 90,
    description: 'Thu thập Bụi Ánh Sao rơi trên mặt hồ phẳng lặng và Hạt Ca-cao Phép quý hiếm.',
    baseGold: 48,
    baseXp: 135,
    guaranteedIngredients: [
      { id: 'starlight_dust', qty: 2 },
      { id: 'magic_cacao', qty: 2 },
    ],
    cardDropChance: 0,
  },
  {
    id: 'ancient_dragon_ridge',
    name: 'Đỉnh Cổ Ngữ Thung Lũng Rồng',
    emoji: '🏔️',
    minParkLevel: 35,
    durationSec: 120,
    description: 'Chuyến thám hiểm xa mang về rương Vàng Galleon cổ đại, Bụi Ánh Sao và Hạt Ca-cao Phép quý hiếm!',
    baseGold: 112,
    baseXp: 290,
    guaranteedIngredients: [
      { id: 'starlight_dust', qty: 3 },
      { id: 'magic_cacao', qty: 2 },
    ],
    cardDropChance: 0,
  },
];

export function getSpeciesProfile(itemId: string): CreatureSpeciesProfile | undefined {
  return CREATURE_SPECIES_PROFILES.find((p) => p.habitatItemId === itemId);
}

export function getBondXpRequiredForNext(bondLevel: number): number {
  return 50 + (bondLevel - 1) * 45;
}

export function getBondIncomeMultiplier(bondLevel = 1): number {
  const clamped = Math.max(1, Math.min(MAX_BOND_LEVEL, bondLevel));
  return 1 + (clamped - 1) * 0.06; // Up to +54% at Bond Lv 10!
}

export function getCompendiumMasteryBonusPct(discoveredCount: number): number {
  // Each discovered morph grants +2% income & XP to ALL creature sanctuaries!
  return discoveredCount * 2;
}

export function createInitialSuitcaseState(): SuitcaseSanctuaryState {
  return {
    discoveredMorphs: [],
    activeIncubation: null,
    activeExpedition: null,
    totalGrooms: 0,
    totalExpeditions: 0,
    totalMorphsHatched: 0,
  };
}
