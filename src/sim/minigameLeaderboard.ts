import {
  GameState,
  HouseName,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  MinigameLeaderboardState,
  MinigamePersonalRecord,
  NeighborProfileState,
} from '../types/game';
import { isNpcNeighborProfile } from './neighborSocial';
import { acquireSessionBearerToken, getCachedSessionBearerToken } from '../ui/cloudSave';

export const SCORED_LEADERBOARD_GAMES: ReadonlyArray<LeaderboardGameId> = [
  'match3',
  'sudoku',
  'blocks',
  'jigsaw',
];

export const ALL_LEADERBOARD_GAMES: ReadonlyArray<LeaderboardGameId> = SCORED_LEADERBOARD_GAMES;

export function isScoredLeaderboardGame(
  gameId: string
): gameId is 'match3' | 'sudoku' | 'blocks' | 'jigsaw' {
  return (
    gameId === 'match3' ||
    gameId === 'sudoku' ||
    gameId === 'blocks' ||
    gameId === 'jigsaw'
  );
}

export function normalizeScoredLeaderboardGame(gameId?: string): LeaderboardGameId {
  return gameId && isScoredLeaderboardGame(gameId) ? gameId : 'match3';
}

export const MAX_PUZZLE_TOWER_STAGE = 777;
const CLIENT_UID_STORAGE_KEY = 'hangsoc_client_uid_v1';

export interface LeaderboardGameMeta {
  id: LeaderboardGameId;
  icon: string;
  spriteIcon: string;
  shortVi: string;
  titleVi: string;
  cupTitleVi: string;
  subtitleVi: string;
  primaryColVi: string;
  secondaryColVi: string;
  detailColVi: string;
}

export const LEADERBOARD_GAME_META: Record<LeaderboardGameId, LeaderboardGameMeta> = {
  match3: {
    id: 'match3',
    icon: '🍬',
    spriteIcon: '/sprites/m3_farm_pinwheel.png',
    shortVi: 'Bùa Gặt Honeydukes',
    titleVi: 'Bùa Gặt Honeydukes',
    cupTitleVi: 'Cúp Đại Sư Bùa Gặt Honeydukes (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh vượt qua, Điểm Bùa Gặt & Chuỗi Thắng Liên Tiếp',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Phép',
    detailColVi: 'Thắng & Chuỗi',
  },
  caro: {
    id: 'caro',
    icon: '🗺️',
    spriteIcon: '/paintings/caro/phoenix_seal.png',
    shortVi: 'Ngũ Ấn Đạo Tặc',
    titleVi: 'Ngũ Ấn Đạo Tặc',
    cupTitleVi: 'Cúp Chiến Lược Ngũ Ấn Đạo Tặc (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Trận Pháp & Nước Thắng Nhanh Nhất',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Trận Pháp',
    detailColVi: 'Thắng & Tối Ưu',
  },
  sudoku: {
    id: 'sudoku',
    icon: '🔢',
    spriteIcon: '/sprites/m3_piece_scroll.png',
    shortVi: 'Số Học Huyền Bí',
    titleVi: 'Số Học Huyền Bí',
    cupTitleVi: 'Cúp Bậc Thầy Số Học Huyền Bí (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Chuẩn Xác & Ván Không Sai Sót',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Chuẩn Xác',
    detailColVi: 'Thắng & Độ Chuẩn',
  },
  chess: {
    id: 'chess',
    icon: '🏰',
    spriteIcon: '/paintings/chess/wk.png',
    shortVi: 'Cờ Phù Thủy',
    titleVi: 'Cờ Phù Thủy',
    cupTitleVi: 'Cúp Đại Kiện Tướng Cờ Phù Thủy (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Kiện Tướng & Tốc Độ Chiếu Bí',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Kiện Tướng',
    detailColVi: 'Thắng & Chiếu Bí',
  },
  blocks: {
    id: 'blocks',
    icon: '🦄',
    spriteIcon: '/sprites/beast_niffler.png',
    shortVi: 'Sinh Vật Huyền Bí',
    titleVi: 'Sinh Vật Huyền Bí',
    cupTitleVi: 'Cúp Kiện Tướng Sinh Vật Huyền Bí (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Ghép Cặp & Kỷ Lục Chuỗi Combo',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Sinh Vật',
    detailColVi: 'Thắng & Đỉnh Combo',
  },
  jigsaw: {
    id: 'jigsaw',
    icon: '🧩',
    spriteIcon: '/sprites/ui_icon_jigsaw.png',
    shortVi: 'Tranh Ghép Phép Thuật',
    titleVi: 'Tranh Ghép Phép Thuật',
    cupTitleVi: 'Cúp Đại Sư Tranh Ghép Phép Thuật (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Tuyệt Tác & Kỷ Lục Chuỗi Khớp Tranh',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Tuyệt Tác',
    detailColVi: 'Thắng & Chuỗi Khớp',
  },
  seedquiz: {
    id: 'seedquiz',
    icon: '🪄',
    spriteIcon: '/sprites/ui_icon_accio.png',
    shortVi: 'Học Viện Thần Chú',
    titleVi: 'Học Viện Thần Chú',
    cupTitleVi: 'Cúp Thủ Khoa Học Viện Thần Chú (EN • KO • ZH • ES • JA)',
    subtitleVi: 'Xếp hạng theo Tổng Câu Thần Chú Đúng, Điểm Thông Thạo & Từ Thuộc Hộp 5 SRS',
    primaryColVi: 'Thần Chú Đúng',
    secondaryColVi: 'Điểm Thông Thạo',
    detailColVi: 'SRS Hộp 5 & Chuỗi',
  },
};

export const ALL_HOGWARTS_HOUSES: ReadonlyArray<HouseName> = [
  'Gryffindor',
  'Slytherin',
  'Ravenclaw',
  'Hufflepuff',
];

export interface HogwartsHouseMeta {
  house: HouseName;
  cssSlug: 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';
  vnTitle: string;
  founderVi: string;
  mascotEmoji: string;
  gemNameVi: string;
  gemShortVi: string;
  gemEmoji: string;
  traitsVi: string;
  quoteVi: string;
  patronusNameVi: string;
  patronusEmoji: string;
  emblemSvg: string;
  hourglassSvg: string;
}

export const HOGWARTS_HOUSE_META: Record<HouseName, HogwartsHouseMeta> = {
  Gryffindor: {
    house: 'Gryffindor',
    cssSlug: 'gryffindor',
    vnTitle: 'Nhà Sư Tử Đỏ',
    founderVi: 'Godric Gryffindor',
    mascotEmoji: '🦁',
    gemNameVi: 'Hồng Ngọc (Ruby)',
    gemShortVi: 'Hồng Ngọc',
    gemEmoji: '♦️',
    traitsVi: 'Can Đảm • Gan Dạ • Thượng Võ',
    quoteVi:
      '“Có lẽ ngươi thuộc Gryffindor, nơi tụ hội những trái tim dũng cảm và gan góc bậc nhất!”',
    patronusNameVi: 'Hươu Bạc',
    patronusEmoji: '🦌',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#B91C1C" stroke="#FDE047" stroke-width="3.5"/><path d="M32 17L36 25L45 26L38.5 32.5L40 41.5L32 37L24 41.5L25.5 32.5L19 26L28 25L32 17Z" fill="#FDE047"/></svg>`,
    hourglassSvg: `<svg viewBox="0 0 36 48" fill="none" aria-hidden="true"><rect x="6" y="3" width="24" height="4" rx="2" fill="#FDE047"/><rect x="6" y="41" width="24" height="4" rx="2" fill="#FDE047"/><path d="M10 7H26L20 22L26 41H10L16 22L10 7Z" fill="rgba(255,255,255,0.16)" stroke="#FDE047" stroke-width="2"/><path d="M13 11H23L18.5 21H17.5L13 11Z" fill="#FB7185"/><path d="M12 39L16.5 26H19.5L24 39H12Z" fill="#E11D48"/><circle cx="18" cy="24" r="1.6" fill="#FFE4E6"/></svg>`,
  },
  Slytherin: {
    house: 'Slytherin',
    cssSlug: 'slytherin',
    vnTitle: 'Nhà Rắn Xanh',
    founderVi: 'Salazar Slytherin',
    mascotEmoji: '🐍',
    gemNameVi: 'Ngọc Lục Bảo (Emerald)',
    gemShortVi: 'Ngọc Lục Bảo',
    gemEmoji: '💚',
    traitsVi: 'Tham Vọng • Khôn Ngoan • Quyết Đoán',
    quoteVi:
      '“Hay ở Slytherin, nơi ngươi kết giao những người bạn chân chính và dùng mưu trí vươn tới đỉnh cao!”',
    patronusNameVi: 'Rắn Thần',
    patronusEmoji: '🐍',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#047857" stroke="#E2E8F0" stroke-width="3.5"/><path d="M38 20C28 18 22 25 32 30C42 35 36 43 25 41" stroke="#A7F3D0" stroke-width="5" stroke-linecap="round"/></svg>`,
    hourglassSvg: `<svg viewBox="0 0 36 48" fill="none" aria-hidden="true"><rect x="6" y="3" width="24" height="4" rx="2" fill="#E2E8F0"/><rect x="6" y="41" width="24" height="4" rx="2" fill="#E2E8F0"/><path d="M10 7H26L20 22L26 41H10L16 22L10 7Z" fill="rgba(255,255,255,0.16)" stroke="#E2E8F0" stroke-width="2"/><path d="M13 11H23L18.5 21H17.5L13 11Z" fill="#6EE7B7"/><path d="M12 39L16.5 26H19.5L24 39H12Z" fill="#10B981"/><circle cx="18" cy="24" r="1.6" fill="#D1FAE5"/></svg>`,
  },
  Ravenclaw: {
    house: 'Ravenclaw',
    cssSlug: 'ravenclaw',
    vnTitle: 'Nhà Đại Bàng',
    founderVi: 'Rowena Ravenclaw',
    mascotEmoji: '🦅',
    gemNameVi: 'Lam Ngọc (Sapphire)',
    gemShortVi: 'Lam Ngọc',
    gemEmoji: '💠',
    traitsVi: 'Trí Tuệ • Uyên Bác • Sáng Tạo',
    quoteVi:
      '“Hoặc giả Ravenclaw thông thái, nơi những bộ óc minh mẫn và ham học hỏi luôn tìm thấy đồng môn!”',
    patronusNameVi: 'Đại Bàng',
    patronusEmoji: '🦅',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#1D4ED8" stroke="#FBBF24" stroke-width="3.5"/><path d="M20 35C25 24 32 20 32 20C32 20 39 24 44 35L32 30L20 35Z" fill="#BAE6FD"/></svg>`,
    hourglassSvg: `<svg viewBox="0 0 36 48" fill="none" aria-hidden="true"><rect x="6" y="3" width="24" height="4" rx="2" fill="#FBBF24"/><rect x="6" y="41" width="24" height="4" rx="2" fill="#FBBF24"/><path d="M10 7H26L20 22L26 41H10L16 22L10 7Z" fill="rgba(255,255,255,0.16)" stroke="#FBBF24" stroke-width="2"/><path d="M13 11H23L18.5 21H17.5L13 11Z" fill="#7DD3FC"/><path d="M12 39L16.5 26H19.5L24 39H12Z" fill="#0284C7"/><circle cx="18" cy="24" r="1.6" fill="#E0F2FE"/></svg>`,
  },
  Hufflepuff: {
    house: 'Hufflepuff',
    cssSlug: 'hufflepuff',
    vnTitle: 'Nhà Lửng Vàng',
    founderVi: 'Helga Hufflepuff',
    mascotEmoji: '🦡',
    gemNameVi: 'Hoàng Ngọc (Topaz)',
    gemShortVi: 'Hoàng Ngọc',
    gemEmoji: '💛',
    traitsVi: 'Trung Thành • Kiên Nhẫn • Chân Thật',
    quoteVi:
      '“Có thể ngươi thuộc Hufflepuff, nơi của những tấm lòng trung hậu, kiên trì và chẳng ngại gian lao!”',
    patronusNameVi: 'Lửng Vàng',
    patronusEmoji: '🦡',
    emblemSvg: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 10H52V32C52 46 32 56 32 56C32 56 12 46 12 32V10Z" fill="#D97706" stroke="#FEF08A" stroke-width="3.5"/><path d="M23 23L32 18L41 23V35L32 42L23 35V23Z" fill="#422006" stroke="#FEF08A" stroke-width="2.5"/></svg>`,
    hourglassSvg: `<svg viewBox="0 0 36 48" fill="none" aria-hidden="true"><rect x="6" y="3" width="24" height="4" rx="2" fill="#FEF08A"/><rect x="6" y="41" width="24" height="4" rx="2" fill="#FEF08A"/><path d="M10 7H26L20 22L26 41H10L16 22L10 7Z" fill="rgba(255,255,255,0.16)" stroke="#FEF08A" stroke-width="2"/><path d="M13 11H23L18.5 21H17.5L13 11Z" fill="#FDE047"/><path d="M12 39L16.5 26H19.5L24 39H12Z" fill="#F59E0B"/><circle cx="18" cy="24" r="1.6" fill="#FEF9C3"/></svg>`,
  },
};

export interface HouseCupStanding {
  house: HouseName;
  rank: number;
  meta: HogwartsHouseMeta;
  members: number;
  totalPrimaryValue: number;
  totalStars: number;
  totalWins: number;
  points: number;
  fillPercent: number;
  isPlayerHouse: boolean;
}

export interface LeaderboardLeagueBadge {
  tierId: 'legend' | 'grandmaster' | 'gold' | 'silver' | 'bronze';
  icon: string;
  labelVi: string;
}

export interface CloudLeaderboardEntry {
  userId: string;
  name: string;
  parkName: string;
  friendCode: string;
  avatarEmoji: string;
  house: HouseName;
  primaryValue: number;
  ratingScore: number;
  totalWins: number;
  bestStreak: number;
  detailLabelVi: string;
  updatedAt: number;
}

export interface LeaderboardRowEntry {
  id: string;
  rank: number;
  name: string;
  titleVi: string;
  parkName: string;
  friendCode: string;
  avatarEmoji: string;
  portraitSprite?: string;
  house: HouseName;
  isPlayer: boolean;
  isFriend: boolean;
  isCloudPlayer?: boolean;
  isSeededRival?: boolean;
  neighborId?: string;
  primaryValue: number;
  primaryDisplayVi: string;
  stars: number;
  ratingScore: number;
  ratingDisplayVi: string;
  totalWins: number;
  bestStreak: number;
  detailDisplayVi: string;
  league: LeaderboardLeagueBadge;
}

export interface LeaderboardStandingResult {
  gameId: LeaderboardGameId;
  meta: LeaderboardGameMeta;
  scope: Exclude<LeaderboardScope, 'personal'>;
  entries: LeaderboardRowEntry[];
  playerEntry: LeaderboardRowEntry;
  playerRank: number;
  totalEntries: number;
  nextRivalAbove: LeaderboardRowEntry | null;
  houseStandings: HouseCupStanding[];
  playerHouse: HouseName;
  activeHouseFilter: 'all' | HouseName;
  includeSeededRivals: boolean;
}

export interface PersonalDisciplineSummaryRow {
  gameId: LeaderboardGameId;
  meta: LeaderboardGameMeta;
  valleyRank: number;
  valleyTotal: number;
  friendsRank: number;
  friendsTotal: number;
  primaryValue: number;
  primaryDisplayVi: string;
  stars: number;
  ratingScore: number;
  ratingDisplayVi: string;
  detailDisplayVi: string;
  bestSessionScore: number;
  league: LeaderboardLeagueBadge;
}

export interface SeededHogwartsRivalSpec {
  id: string;
  name: string;
  parkName: string;
  avatarEmoji: string;
  house: HouseName;
  stats: Record<
    'match3' | 'sudoku' | 'blocks' | 'jigsaw',
    { stage: number; stars: number; score: number; streak: number }
  >;
}

export const SEEDED_HOGWARTS_RIVALS: ReadonlyArray<SeededHogwartsRivalSpec> = [
  {
    id: 'npc_1',
    name: 'Minh Khôi Potter',
    parkName: 'Thung Lũng Godric',
    avatarEmoji: '⚡',
    house: 'Gryffindor',
    stats: {
      match3: { stage: 19, stars: 48, score: 9840, streak: 7 },
      sudoku: { stage: 16, stars: 41, score: 8120, streak: 5 },
      blocks: { stage: 22, stars: 58, score: 11250, streak: 9 },
      jigsaw: { stage: 18, stars: 46, score: 9420, streak: 7 },
    },
  },
  {
    id: 'npc_2',
    name: 'Bảo Ngọc Granger',
    parkName: 'Thư Viện Tháp Cao',
    avatarEmoji: '📚',
    house: 'Ravenclaw',
    stats: {
      match3: { stage: 21, stars: 53, score: 10420, streak: 9 },
      sudoku: { stage: 24, stars: 66, score: 12680, streak: 11 },
      blocks: { stage: 19, stars: 49, score: 9640, streak: 7 },
      jigsaw: { stage: 23, stars: 62, score: 11980, streak: 10 },
    },
  },
  {
    id: 'npc_3',
    name: 'Hoàng Long Malfoy',
    parkName: 'Thái Ấp Lục Bảo',
    avatarEmoji: '🐍',
    house: 'Slytherin',
    stats: {
      match3: { stage: 18, stars: 45, score: 9680, streak: 6 },
      sudoku: { stage: 20, stars: 52, score: 10340, streak: 8 },
      blocks: { stage: 17, stars: 44, score: 8920, streak: 6 },
      jigsaw: { stage: 19, stars: 49, score: 9890, streak: 7 },
    },
  },
  {
    id: 'npc_4',
    name: 'Thanh Thảo Diggory',
    parkName: 'Đồi Lửng Vàng',
    avatarEmoji: '🦡',
    house: 'Hufflepuff',
    stats: {
      match3: { stage: 17, stars: 44, score: 9150, streak: 6 },
      sudoku: { stage: 15, stars: 39, score: 7840, streak: 5 },
      blocks: { stage: 21, stars: 56, score: 10890, streak: 8 },
      jigsaw: { stage: 20, stars: 52, score: 10450, streak: 8 },
    },
  },
  {
    id: 'npc_5',
    name: 'Gia Huy Weasley',
    parkName: 'Vườn Táo Hang Sóc',
    avatarEmoji: '🦊',
    house: 'Gryffindor',
    stats: {
      match3: { stage: 12, stars: 31, score: 6430, streak: 4 },
      sudoku: { stage: 10, stars: 25, score: 5180, streak: 3 },
      blocks: { stage: 14, stars: 36, score: 7290, streak: 5 },
      jigsaw: { stage: 13, stars: 33, score: 6780, streak: 5 },
    },
  },
  {
    id: 'npc_6',
    name: 'Khánh Linh Lovegood',
    parkName: 'Trảng Trăng Non',
    avatarEmoji: '🌙',
    house: 'Ravenclaw',
    stats: {
      match3: { stage: 14, stars: 35, score: 7190, streak: 5 },
      sudoku: { stage: 17, stars: 45, score: 8760, streak: 6 },
      blocks: { stage: 15, stars: 39, score: 7650, streak: 5 },
      jigsaw: { stage: 16, stars: 42, score: 8340, streak: 6 },
    },
  },
  {
    id: 'npc_7',
    name: 'Đức Anh Zabini',
    parkName: 'Biệt Dinh Đá Đen',
    avatarEmoji: '🧪',
    house: 'Slytherin',
    stats: {
      match3: { stage: 13, stars: 33, score: 6850, streak: 4 },
      sudoku: { stage: 14, stars: 36, score: 7310, streak: 5 },
      blocks: { stage: 13, stars: 33, score: 6790, streak: 4 },
      jigsaw: { stage: 12, stars: 31, score: 6410, streak: 4 },
    },
  },
  {
    id: 'npc_8',
    name: 'Phương Nhi Abbott',
    parkName: 'Nhà Kính Thảo Dược',
    avatarEmoji: '🌻',
    house: 'Hufflepuff',
    stats: {
      match3: { stage: 12, stars: 30, score: 6320, streak: 4 },
      sudoku: { stage: 11, stars: 28, score: 5790, streak: 4 },
      blocks: { stage: 16, stars: 42, score: 8240, streak: 6 },
      jigsaw: { stage: 15, stars: 39, score: 7810, streak: 6 },
    },
  },
];

export function computeDisciplineStars(
  primaryValue: number,
  totalWins: number,
  bestStreak: number,
  ratingScore: number
): number {
  const stages = Math.max(0, Math.min(MAX_PUZZLE_TOWER_STAGE, Math.floor(primaryValue || 0)));
  if (stages <= 0) return 0;
  const maxStars = stages * 3;
  const baseStars = stages * 2;
  const extraFromMastery =
    Math.floor((Math.max(0, totalWins - stages) + Math.max(0, bestStreak)) * 0.5) +
    Math.floor(Math.max(0, ratingScore - stages * 155) / 140);
  const stagePerformance =
    ratingScore >= stages * 175 ? Math.ceil(stages * 0.75) : Math.ceil(stages * 0.45);
  return Math.max(1, Math.min(maxStars, baseStars + Math.max(stagePerformance, extraFromMastery)));
}

export function getLeaderboardLeagueBadge(
  gameId: LeaderboardGameId,
  primaryValue: number
): LeaderboardLeagueBadge {
  if (gameId === 'seedquiz') {
    if (primaryValue >= 450) {
      return { tierId: 'legend', icon: '👑', labelVi: 'Đại Học Giả 5 Ngữ' };
    }
    if (primaryValue >= 180) {
      return { tierId: 'grandmaster', icon: '💎', labelVi: 'Thủ Khoa N.E.W.T.' };
    }
    if (primaryValue >= 60) {
      return { tierId: 'gold', icon: '🥇', labelVi: 'Ưu Tú O.W.L.' };
    }
    if (primaryValue >= 15) {
      return { tierId: 'silver', icon: '🥈', labelVi: 'Học Giả Bạc' };
    }
    return { tierId: 'bronze', icon: '🥉', labelVi: 'Tân Sinh Đồng' };
  }

  if (primaryValue >= MAX_PUZZLE_TOWER_STAGE) {
    return { tierId: 'legend', icon: '👑', labelVi: 'Huyền Thoại 777' };
  }
  if (primaryValue >= 300) {
    return { tierId: 'grandmaster', icon: '💎', labelVi: 'Đại Kiện Tướng' };
  }
  if (primaryValue >= 100) {
    return { tierId: 'gold', icon: '🥇', labelVi: 'Quán Quân Vàng' };
  }
  if (primaryValue >= 25) {
    return { tierId: 'silver', icon: '🥈', labelVi: 'Học Giả Bạc' };
  }
  return { tierId: 'bronze', icon: '🥉', labelVi: 'Tân Binh Đồng' };
}

function deriveBaseRecordFromState(
  state: GameState,
  gameId: LeaderboardGameId
): MinigamePersonalRecord {
  if (!isScoredLeaderboardGame(gameId)) {
    return {
      bestStage: 0,
      highScore: 0,
      bestSessionScore: 0,
      totalWins: 0,
      bestStreak: 0,
      bestEfficiency: undefined,
      updatedAt: 0,
    };
  }

  const m3 = state.match3;
  const pa = state.puzzleArcade;
  const sharedStreak = Math.max(0, Math.floor(m3?.winStreak ?? 0));

  if (gameId === 'match3') {
    const cleared = Math.max(
      0,
      Math.min(
        MAX_PUZZLE_TOWER_STAGE,
        m3?.maxClearedLevel ?? Math.max(0, (m3?.currentLevel ?? 1) - 1)
      )
    );
    const wins = Math.max(cleared, Math.floor(m3?.levelsWon ?? 0));
    const rating = cleared * 150 + wins * 25 + sharedStreak * 40;
    return {
      bestStage: cleared,
      highScore: rating,
      bestSessionScore: cleared > 0 ? 1200 + cleared * 85 : 0,
      totalWins: wins,
      bestStreak: sharedStreak,
      bestEfficiency: cleared > 0 ? 1200 + cleared * 85 : undefined,
      updatedAt: 0,
    };
  }

  const stageMap: Record<'sudoku' | 'blocks' | 'jigsaw', number> = {
    sudoku: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.sudokuCleared ?? Math.max(0, (pa?.sudokuStage ?? 1) - 1))
    ),
    blocks: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.blockCleared ?? Math.max(0, (pa?.blockStage ?? 1) - 1))
    ),
    jigsaw: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.jigsawCleared ?? Math.max(0, (pa?.jigsawStage ?? 1) - 1))
    ),
  };

  const cleared = stageMap[gameId];
  const rating = cleared * 155 + cleared * 22 + sharedStreak * 35;
  return {
    bestStage: cleared,
    highScore: rating,
    bestSessionScore: cleared > 0 ? 900 + cleared * 70 : 0,
    totalWins: cleared,
    bestStreak: sharedStreak,
    bestEfficiency: undefined,
    updatedAt: 0,
  };
}

export function ensureMinigameLeaderboardState(state: GameState): MinigameLeaderboardState {
  if (!state.minigameLeaderboard || typeof state.minigameLeaderboard !== 'object') {
    state.minigameLeaderboard = {
      records: {
        match3: deriveBaseRecordFromState(state, 'match3'),
        caro: deriveBaseRecordFromState(state, 'caro'),
        sudoku: deriveBaseRecordFromState(state, 'sudoku'),
        chess: deriveBaseRecordFromState(state, 'chess'),
        blocks: deriveBaseRecordFromState(state, 'blocks'),
        jigsaw: deriveBaseRecordFromState(state, 'jigsaw'),
        seedquiz: deriveBaseRecordFromState(state, 'seedquiz'),
      },
    };
  }

  for (const gid of SCORED_LEADERBOARD_GAMES) {
    const base = deriveBaseRecordFromState(state, gid);
    const cur = state.minigameLeaderboard.records[gid];
    if (!cur) {
      state.minigameLeaderboard.records[gid] = base;
    } else {
      cur.bestStage = Math.max(cur.bestStage ?? 0, base.bestStage);
      cur.totalWins = Math.max(cur.totalWins ?? 0, base.totalWins);
      cur.bestStreak = Math.max(cur.bestStreak ?? 0, base.bestStreak);
      cur.highScore = Math.max(cur.highScore ?? 0, base.highScore);
      cur.bestSessionScore = Math.max(cur.bestSessionScore ?? 0, base.bestSessionScore);
    }
  }

  // Các game không tính điểm (Caro, Cờ Phù Thủy, Học Viện Thần Chú) luôn giữ 0 điểm trên BXH
  for (const unscoredGid of ['caro', 'chess', 'seedquiz'] as const) {
    state.minigameLeaderboard.records[unscoredGid] = {
      bestStage: 0,
      highScore: 0,
      bestSessionScore: 0,
      totalWins: 0,
      bestStreak: 0,
      bestEfficiency: undefined,
      updatedAt: 0,
    };
  }

  return state.minigameLeaderboard;
}

export function normalizeClientHogwartsHouse(raw: unknown): HouseName | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return null;
  if (cleaned === 'gryffindor' || cleaned === 'gryff' || cleaned === 'gry' || cleaned.includes('sư tử')) {
    return 'Gryffindor';
  }
  if (cleaned === 'hufflepuff' || cleaned === 'huff' || cleaned === 'huf' || cleaned.includes('lửng')) {
    return 'Hufflepuff';
  }
  if (cleaned === 'ravenclaw' || cleaned === 'raven' || cleaned === 'rav' || cleaned.includes('ưng')) {
    return 'Ravenclaw';
  }
  if (cleaned === 'slytherin' || cleaned === 'slyth' || cleaned === 'sly' || cleaned.includes('rắn')) {
    return 'Slytherin';
  }
  return null;
}

export function getPlayerHogwartsHouse(state: GameState): HouseName {
  const chosen = normalizeClientHogwartsHouse(state.minigameLeaderboard?.playerHouse);
  if (chosen && ALL_HOGWARTS_HOUSES.includes(chosen)) {
    return chosen;
  }
  const hp = state.housePoints;
  if (!hp) return 'Gryffindor';
  const order: HouseName[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
  let best: HouseName = 'Gryffindor';
  let bestVal = -1;
  for (const h of order) {
    const v = hp[h] ?? 0;
    if (v > bestVal) {
      bestVal = v;
      best = h;
    }
  }
  return best;
}

export function setPlayerHogwartsHouse(
  state: GameState,
  house: HouseName,
  options?: { explicit?: boolean; lockedByServer?: boolean }
): HouseName {
  const normalized = normalizeClientHogwartsHouse(house);
  const safeHouse: HouseName =
    normalized && ALL_HOGWARTS_HOUSES.includes(normalized) ? normalized : 'Gryffindor';
  const lb = ensureMinigameLeaderboardState(state);
  lb.playerHouse = safeHouse;
  if (options?.explicit !== undefined) {
    lb.playerHouseExplicit = options.explicit;
  }
  if (options?.lockedByServer !== undefined) {
    lb.playerHouseLockedByServer = options.lockedByServer;
  }
  if (!state.housePoints || typeof state.housePoints !== 'object') {
    state.housePoints = {
      Gryffindor: 0,
      Slytherin: 0,
      Ravenclaw: 0,
      Hufflepuff: 0,
    };
  }
  return safeHouse;
}

export function rollSortingHatHouse(state: GameState, randomFn = Math.random): HouseName {
  const current = getPlayerHogwartsHouse(state);
  const candidates = ALL_HOGWARTS_HOUSES.filter((h) => h !== current);
  const pick =
    candidates[Math.floor(Math.max(0, Math.min(0.9999, randomFn())) * candidates.length)] ??
    ALL_HOGWARTS_HOUSES[0];
  return setPlayerHogwartsHouse(state, pick, { explicit: true });
}

export function sanitizeWizardDisplayName(raw: unknown, fallback = 'Phù Thủy Hang Sóc'): string {
  if (typeof raw !== 'string') return fallback;
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, 26);
  return cleaned || fallback;
}

export function toggleLeaderboardSeededRivals(
  state: GameState,
  forceValue?: boolean
): boolean {
  const lb = ensureMinigameLeaderboardState(state);
  lb.includeSeededRivals =
    typeof forceValue === 'boolean' ? forceValue : !Boolean(lb.includeSeededRivals);
  return Boolean(lb.includeSeededRivals);
}

export function updatePlayerWizardProfile(
  state: GameState,
  rawName: string,
  house: HouseName
): { name: string; house: HouseName; houseLockedByServer: boolean } {
  const lb = ensureMinigameLeaderboardState(state);
  const defaultFallback = state.parkName?.trim() || 'Phù Thủy Hang Sóc';
  const cleanName = sanitizeWizardDisplayName(rawName, defaultFallback);
  if (state.neighborSocial && typeof state.neighborSocial === 'object') {
    state.neighborSocial.playerDisplayName = cleanName;
  }
  const locked = Boolean(lb.playerHouseLockedByServer && lb.playerHouse);
  const finalHouse = locked
    ? getPlayerHogwartsHouse(state)
    : setPlayerHogwartsHouse(state, house, { explicit: true });
  return {
    name: cleanName,
    house: finalHouse,
    houseLockedByServer: locked,
  };
}

function formatPrimaryDisplayVi(gameId: LeaderboardGameId, primaryVal: number): string {
  if (gameId === 'seedquiz') {
    return `${primaryVal.toLocaleString('vi-VN')} câu đúng`;
  }
  if (primaryVal >= MAX_PUZZLE_TOWER_STAGE) {
    return `👑 777/777`;
  }
  return `Màn ${primaryVal}/777`;
}

function formatDetailDisplayVi(
  gameId: LeaderboardGameId,
  totalWins: number,
  bestStreak: number,
  efficiency?: number
): string {
  if (gameId === 'seedquiz') {
    const box5 = Math.max(0, Math.floor(efficiency ?? 0));
    return `📦 ${box5} từ Hộp 5 • 🔥×${bestStreak}`;
  }
  if (gameId === 'caro') {
    const eff = efficiency && efficiency > 0 ? ` • ⚡${efficiency} nước` : '';
    return `${totalWins} thắng • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'chess') {
    const eff = efficiency && efficiency > 0 ? ` • ♟️${efficiency} nước` : '';
    return `${totalWins} thắng • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'sudoku') {
    const eff =
      efficiency !== undefined && efficiency >= 0
        ? efficiency === 0
          ? ' • ✨0 lỗi'
          : ` • ≤${efficiency} lỗi`
        : '';
    return `${totalWins} thắng • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'blocks') {
    const eff = efficiency && efficiency > 0 ? ` • ⚡Combo ×${efficiency}` : '';
    return `${totalWins} thắng • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'jigsaw') {
    const eff = efficiency && efficiency > 0 ? ` • 🧩Combo ×${efficiency}` : '';
    return `${totalWins} thắng • 🔥×${bestStreak}${eff}`;
  }
  const bestRun = efficiency && efficiency > 0 ? ` • 🎯${efficiency.toLocaleString('vi-VN')}đ` : '';
  return `${totalWins} thắng • 🔥×${bestStreak}${bestRun}`;
}

function buildNeighborLeaderboardEntry(
  neighbor: NeighborProfileState,
  gameId: LeaderboardGameId,
  cloudMatch?: CloudLeaderboardEntry
): Omit<LeaderboardRowEntry, 'rank'> {
  if (cloudMatch) {
    const pv = Math.max(0, Math.floor(cloudMatch.primaryValue || 0));
    const rs = Math.max(0, Math.floor(cloudMatch.ratingScore || 0));
    const tw = Math.max(0, Math.floor(cloudMatch.totalWins || 0));
    const bs = Math.max(0, Math.floor(cloudMatch.bestStreak || 0));
    return {
      id: `friend:${neighbor.id}`,
      name: neighbor.name,
      titleVi: neighbor.titleVi || 'Người Chơi Thật • Hàng Xóm',
      parkName: neighbor.parkName,
      friendCode: neighbor.friendCode,
      avatarEmoji: neighbor.avatarEmoji || cloudMatch.avatarEmoji || '🧙',
      portraitSprite: neighbor.portraitSprite,
      house: neighbor.house || cloudMatch.house || 'Gryffindor',
      isPlayer: false,
      isFriend: true,
      isCloudPlayer: true,
      neighborId: neighbor.id,
      primaryValue: pv,
      primaryDisplayVi: formatPrimaryDisplayVi(gameId, pv),
      stars: computeDisciplineStars(pv, tw, bs, rs),
      ratingScore: rs,
      ratingDisplayVi: `${rs.toLocaleString('vi-VN')} đ`,
      totalWins: tw,
      bestStreak: bs,
      detailDisplayVi:
        cloudMatch.detailLabelVi || formatDetailDisplayVi(gameId, tw, bs),
      league: getLeaderboardLeagueBadge(gameId, pv),
    };
  }

  // Người chơi thật trong danh bạ nhưng chưa có kỷ lục trực tuyến ở bộ môn này -> hiển thị 0 thật (không bịa điểm ảo)
  return {
    id: `friend:${neighbor.id}`,
    name: neighbor.name,
    titleVi: neighbor.titleVi || 'Người Chơi Thật • Hàng Xóm',
    parkName: neighbor.parkName,
    friendCode: neighbor.friendCode,
    avatarEmoji: neighbor.avatarEmoji || '🧙',
    portraitSprite: neighbor.portraitSprite,
    house: neighbor.house,
    isPlayer: false,
    isFriend: true,
    neighborId: neighbor.id,
    primaryValue: 0,
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, 0),
    stars: 0,
    ratingScore: 0,
    ratingDisplayVi: '0 đ',
    totalWins: 0,
    bestStreak: 0,
    detailDisplayVi: 'Chưa có kỷ lục môn này',
    league: getLeaderboardLeagueBadge(gameId, 0),
  };
}

export function buildPlayerLeaderboardEntry(
  state: GameState,
  gameId: LeaderboardGameId
): Omit<LeaderboardRowEntry, 'rank'> {
  const lb = ensureMinigameLeaderboardState(state);
  const rec = lb.records[gameId];
  const friendCode = state.neighborSocial?.playerFriendCode || 'HS-YOU1-01';
  const house = getPlayerHogwartsHouse(state);
  const playerTitle =
    state.level >= 80
      ? 'Đại Điền Chủ Thung Lũng'
      : state.level >= 40
        ? 'Phù Thủy Kiến Thiết Cấp Cao'
        : state.level >= 15
          ? 'Chủ Trang Trại Đang Lên'
          : 'Tân Phù Thủy Hang Sóc';

  const displayBase =
    state.neighborSocial?.playerDisplayName?.trim() ||
    state.parkName ||
    'Trang Trại Hang Sóc';

  return {
    id: 'player:self',
    name: `${displayBase} (Bạn)`,
    titleVi: `${playerTitle} • Cấp ${state.level}`,
    parkName: state.parkName || 'Trang Trại Hang Sóc',
    friendCode,
    avatarEmoji: '🧙‍♂️',
    house,
    isPlayer: true,
    isFriend: true,
    primaryValue: rec.bestStage,
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, rec.bestStage),
    stars: computeDisciplineStars(rec.bestStage, rec.totalWins, rec.bestStreak, rec.highScore),
    ratingScore: rec.highScore,
    ratingDisplayVi: `${rec.highScore.toLocaleString('vi-VN')} đ`,
    totalWins: rec.totalWins,
    bestStreak: rec.bestStreak,
    detailDisplayVi: formatDetailDisplayVi(
      gameId,
      rec.totalWins,
      rec.bestStreak,
      rec.bestEfficiency
    ),
    league: getLeaderboardLeagueBadge(gameId, rec.bestStage),
  };
}

function compareEntries(
  a: Omit<LeaderboardRowEntry, 'rank'>,
  b: Omit<LeaderboardRowEntry, 'rank'>
): number {
  if (b.primaryValue !== a.primaryValue) return b.primaryValue - a.primaryValue;
  if (b.ratingScore !== a.ratingScore) return b.ratingScore - a.ratingScore;
  if (b.stars !== a.stars) return b.stars - a.stars;
  if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
  if (a.isPlayer !== b.isPlayer) return a.isPlayer ? -1 : 1;
  return a.id.localeCompare(b.id);
}

export function buildHouseCupStandings(
  state: GameState,
  entries: ReadonlyArray<Omit<LeaderboardRowEntry, 'rank'>>
): HouseCupStanding[] {
  const playerHouse = getPlayerHogwartsHouse(state);
  const map = new Map<
    HouseName,
    {
      house: HouseName;
      members: number;
      totalPrimaryValue: number;
      totalStars: number;
      totalWins: number;
      points: number;
    }
  >();

  for (const h of ALL_HOGWARTS_HOUSES) {
    const valleyBonus = Math.max(0, Math.floor(state.housePoints?.[h] ?? 0));
    map.set(h, {
      house: h,
      members: 0,
      totalPrimaryValue: 0,
      totalStars: 0,
      totalWins: 0,
      points: valleyBonus,
    });
  }

  for (const row of entries) {
    const h: HouseName = ALL_HOGWARTS_HOUSES.includes(row.house) ? row.house : 'Gryffindor';
    const rec = map.get(h)!;
    rec.members += 1;
    rec.totalPrimaryValue += Math.max(0, row.primaryValue);
    rec.totalStars += Math.max(0, row.stars);
    rec.totalWins += Math.max(0, row.totalWins);
    rec.points +=
      Math.round(Math.max(0, row.ratingScore) / 10) +
      Math.max(0, row.primaryValue) * 35 +
      Math.max(0, row.stars) * 4 +
      Math.max(0, row.totalWins) * 15 +
      Math.max(0, row.bestStreak) * 10;
  }

  const rawList = ALL_HOGWARTS_HOUSES.map((h) => map.get(h)!).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
    if (b.totalPrimaryValue !== a.totalPrimaryValue) {
      return b.totalPrimaryValue - a.totalPrimaryValue;
    }
    if (b.members !== a.members) return b.members - a.members;
    if ((a.house === playerHouse) !== (b.house === playerHouse)) {
      return a.house === playerHouse ? -1 : 1;
    }
    return ALL_HOGWARTS_HOUSES.indexOf(a.house) - ALL_HOGWARTS_HOUSES.indexOf(b.house);
  });

  const maxPts = Math.max(100, ...rawList.map((r) => r.points));

  return rawList.map((item, idx) => ({
    house: item.house,
    rank: idx + 1,
    meta: HOGWARTS_HOUSE_META[item.house],
    members: item.members,
    totalPrimaryValue: item.totalPrimaryValue,
    totalStars: item.totalStars,
    totalWins: item.totalWins,
    points: item.points,
    fillPercent:
      item.points <= 0
        ? 10
        : Math.max(12, Math.min(100, Math.round((item.points / maxPts) * 100))),
    isPlayerHouse: item.house === playerHouse,
  }));
}

const PLACEHOLDER_FRIEND_CODES: ReadonlySet<string> = new Set([
  '',
  'HS-YOU1-01',
  'HS-CLUD-00',
  'HS-CLUD-01',
]);

function buildRawPoolForScoredGame(
  state: GameState,
  gameId: LeaderboardGameId,
  scope: Exclude<LeaderboardScope, 'personal'>,
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>
): Array<Omit<LeaderboardRowEntry, 'rank'>> {
  const scoredGameId = isScoredLeaderboardGame(gameId) ? gameId : 'match3';
  const playerRaw = buildPlayerLeaderboardEntry(state, scoredGameId);
  const neighbors = (state.neighborSocial?.neighbors ?? []).filter(
    (n) => !isNpcNeighborProfile(n)
  );
  const effectiveCloud = extraCloudEntries ?? cloudEntriesMemoryCache[scoredGameId] ?? [];
  const cloudByCode = new Map<string, CloudLeaderboardEntry>();
  const cloudByUid = new Map<string, CloudLeaderboardEntry>();
  for (const ce of effectiveCloud) {
    if (!ce) continue;
    const ceCode = (ce.friendCode || '').trim().toUpperCase();
    if (ceCode && !PLACEHOLDER_FRIEND_CODES.has(ceCode)) {
      cloudByCode.set(ceCode, ce);
    }
    if (ce.userId) cloudByUid.set(ce.userId, ce);
  }
  const friendCodeSet = new Set<string>(
    neighbors
      .map((n) => n.friendCode.trim().toUpperCase())
      .filter((code) => !PLACEHOLDER_FRIEND_CODES.has(code))
  );
  const friendUidSet = new Set<string>(
    neighbors.map((n) => n.remoteUserId || '').filter((uid) => uid.length > 0)
  );
  const friendEntries = neighbors.map((n) => {
    const cleanNeighborCode = n.friendCode.trim().toUpperCase();
    const cMatch =
      (n.remoteUserId ? cloudByUid.get(n.remoteUserId) : undefined) ??
      (!PLACEHOLDER_FRIEND_CODES.has(cleanNeighborCode)
        ? cloudByCode.get(cleanNeighborCode)
        : undefined);
    return buildNeighborLeaderboardEntry(n, scoredGameId, cMatch);
  });

  const pool: Array<Omit<LeaderboardRowEntry, 'rank'>> = [playerRaw, ...friendEntries];

  if (scope === 'valley') {
    const localUid = getClientLeaderboardUserId();
    const normPlayerCode = playerRaw.friendCode.trim().toUpperCase();
    const hasDistinctPlayerCode = !PLACEHOLDER_FRIEND_CODES.has(normPlayerCode);
    for (const ce of effectiveCloud) {
      if (!ce || !ce.userId) continue;
      const normCode = (ce.friendCode || '').trim().toUpperCase();
      const hasDistinctCloudCode = !PLACEHOLDER_FRIEND_CODES.has(normCode);
      if (
        ce.userId === localUid ||
        friendUidSet.has(ce.userId) ||
        (hasDistinctPlayerCode && hasDistinctCloudCode && normCode === normPlayerCode) ||
        (hasDistinctCloudCode && friendCodeSet.has(normCode))
      ) {
        continue;
      }
      const normalizedHouse = normalizeClientHogwartsHouse(ce.house) ?? 'Gryffindor';
      const pv = Math.max(0, Math.floor(ce.primaryValue || 0));
      const rs = Math.max(0, Math.floor(ce.ratingScore || 0));
      const tw = Math.max(0, Math.floor(ce.totalWins || 0));
      const bs = Math.max(0, Math.floor(ce.bestStreak || 0));
      pool.push({
        id: `cloud:${ce.userId}`,
        name: ce.name || ce.parkName || 'Người Chơi Trực Tuyến',
        titleVi: 'Người Chơi Thật Trực Tuyến',
        parkName: ce.parkName || 'Điền Trang Phép Thuật',
        friendCode: ce.friendCode || 'HS-CLUD-00',
        avatarEmoji: ce.avatarEmoji || '🌐',
        house: normalizedHouse,
        isPlayer: false,
        isFriend: false,
        isCloudPlayer: true,
        primaryValue: pv,
        primaryDisplayVi: formatPrimaryDisplayVi(scoredGameId, pv),
        stars: computeDisciplineStars(pv, tw, bs, rs),
        ratingScore: rs,
        ratingDisplayVi: `${rs.toLocaleString('vi-VN')} đ`,
        totalWins: tw,
        bestStreak: bs,
        detailDisplayVi:
          ce.detailLabelVi || formatDetailDisplayVi(scoredGameId, tw, bs),
        league: getLeaderboardLeagueBadge(scoredGameId, pv),
      });
    }

    if (state.minigameLeaderboard?.includeSeededRivals) {
      for (const rival of SEEDED_HOGWARTS_RIVALS) {
        const st = rival.stats[scoredGameId];
        pool.push({
          id: `rival:${rival.id}`,
          name: rival.name,
          titleVi: 'Học Viên Mẫu Hogwarts',
          parkName: rival.parkName,
          friendCode: `HS-SEED-${rival.id.toUpperCase()}`,
          avatarEmoji: rival.avatarEmoji,
          house: rival.house,
          isPlayer: false,
          isFriend: false,
          isCloudPlayer: false,
          isSeededRival: true,
          primaryValue: st.stage,
          primaryDisplayVi: formatPrimaryDisplayVi(scoredGameId, st.stage),
          stars: st.stars,
          ratingScore: st.score,
          ratingDisplayVi: `${st.score.toLocaleString('vi-VN')} đ`,
          totalWins: st.stage,
          bestStreak: st.streak,
          detailDisplayVi: formatDetailDisplayVi(scoredGameId, st.stage, st.streak),
          league: getLeaderboardLeagueBadge(scoredGameId, st.stage),
        });
      }
    }
  }

  return pool;
}

function buildUnifiedHouseCupStandings(
  state: GameState,
  scope: Exclude<LeaderboardScope, 'personal'>,
  activeGameId: LeaderboardGameId,
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>
): HouseCupStanding[] {
  const playerHouse = getPlayerHogwartsHouse(state);
  const map = new Map<
    HouseName,
    {
      house: HouseName;
      memberKeys: Set<string>;
      totalPrimaryValue: number;
      totalStars: number;
      totalWins: number;
      points: number;
    }
  >();

  for (const h of ALL_HOGWARTS_HOUSES) {
    const valleyBonus = Math.max(0, Math.floor(state.housePoints?.[h] ?? 0));
    map.set(h, {
      house: h,
      memberKeys: new Set<string>(),
      totalPrimaryValue: 0,
      totalStars: 0,
      totalWins: 0,
      points: valleyBonus,
    });
  }

  for (const gid of SCORED_LEADERBOARD_GAMES) {
    const gPool = buildRawPoolForScoredGame(
      state,
      gid,
      scope,
      gid === activeGameId ? extraCloudEntries : undefined
    );
    for (const row of gPool) {
      const h: HouseName = ALL_HOGWARTS_HOUSES.includes(row.house) ? row.house : 'Gryffindor';
      const rec = map.get(h)!;
      const normMemberCode = (row.friendCode || '').trim().toUpperCase();
      const memberKey = row.isPlayer
        ? 'self'
        : !PLACEHOLDER_FRIEND_CODES.has(normMemberCode) &&
            !row.id.startsWith('cloud:') &&
            !row.id.startsWith('rival:')
          ? normMemberCode
          : row.id;
      rec.memberKeys.add(memberKey);
      rec.totalPrimaryValue += Math.max(0, row.primaryValue);
      rec.totalStars += Math.max(0, row.stars);
      rec.totalWins += Math.max(0, row.totalWins);
      rec.points +=
        Math.round(Math.max(0, row.ratingScore) / 10) +
        Math.max(0, row.primaryValue) * 35 +
        Math.max(0, row.stars) * 4 +
        Math.max(0, row.totalWins) * 15 +
        Math.max(0, row.bestStreak) * 10;
    }
  }

  const rawList = ALL_HOGWARTS_HOUSES.map((h) => {
    const item = map.get(h)!;
    return {
      house: item.house,
      members: item.memberKeys.size,
      totalPrimaryValue: item.totalPrimaryValue,
      totalStars: item.totalStars,
      totalWins: item.totalWins,
      points: item.points,
    };
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
    if (b.totalPrimaryValue !== a.totalPrimaryValue) {
      return b.totalPrimaryValue - a.totalPrimaryValue;
    }
    if (b.members !== a.members) return b.members - a.members;
    if ((a.house === playerHouse) !== (b.house === playerHouse)) {
      return a.house === playerHouse ? -1 : 1;
    }
    return ALL_HOGWARTS_HOUSES.indexOf(a.house) - ALL_HOGWARTS_HOUSES.indexOf(b.house);
  });

  const maxPts = Math.max(100, ...rawList.map((r) => r.points));

  return rawList.map((item, idx) => ({
    house: item.house,
    rank: idx + 1,
    meta: HOGWARTS_HOUSE_META[item.house],
    members: item.members,
    totalPrimaryValue: item.totalPrimaryValue,
    totalStars: item.totalStars,
    totalWins: item.totalWins,
    points: item.points,
    fillPercent:
      item.points <= 0
        ? 10
        : Math.max(12, Math.min(100, Math.round((item.points / maxPts) * 100))),
    isPlayerHouse: item.house === playerHouse,
  }));
}

export function buildMinigameLeaderboard(
  state: GameState,
  rawGameId: LeaderboardGameId,
  scope: Exclude<LeaderboardScope, 'personal'> = 'valley',
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>,
  houseFilter: 'all' | HouseName = 'all'
): LeaderboardStandingResult {
  const gameId = normalizeScoredLeaderboardGame(rawGameId);
  const pool = buildRawPoolForScoredGame(state, gameId, scope, extraCloudEntries);
  pool.sort(compareEntries);

  const houseStandings = buildUnifiedHouseCupStandings(
    state,
    scope,
    gameId,
    extraCloudEntries
  );
  const fullEntries: LeaderboardRowEntry[] = pool.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const playerIdx = fullEntries.findIndex((e) => e.isPlayer);
  const playerEntry = fullEntries[Math.max(0, playerIdx)];
  const nextRivalAbove = playerIdx > 0 ? fullEntries[playerIdx - 1] : null;

  const filteredEntries =
    houseFilter === 'all'
      ? fullEntries
      : fullEntries
          .filter((e) => e.house === houseFilter)
          .map((item, idx) => ({
            ...item,
            rank: idx + 1,
          }));

  return {
    gameId,
    meta: LEADERBOARD_GAME_META[gameId],
    scope,
    entries: filteredEntries,
    playerEntry,
    playerRank: playerEntry.rank,
    totalEntries: fullEntries.length,
    nextRivalAbove,
    houseStandings,
    playerHouse: playerEntry.house,
    activeHouseFilter: houseFilter,
    includeSeededRivals: Boolean(state.minigameLeaderboard?.includeSeededRivals),
  };
}

export function exportMinigameLeaderboardCSV(
  state: GameState,
  rawGameId: LeaderboardGameId,
  scope: Exclude<LeaderboardScope, 'personal'> = 'valley',
  houseFilter: 'all' | HouseName = 'all',
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>
): string {
  const standing = buildMinigameLeaderboard(
    state,
    rawGameId,
    scope,
    extraCloudEntries,
    houseFilter
  );
  const header = [
    'Hang',
    'Ten Phu Thuy',
    'Nha Hogwarts',
    'Tong Diem',
    'Tong Sao',
    'Man Cao Nhat',
    'Loai',
  ];
  const escapeCsvCell = (raw: unknown): string => {
    const str = String(raw ?? '').replace(/"/g, '""');
    const formulaSafe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
    return `"${formulaSafe}"`;
  };
  const rows = standing.entries.map((entry) => {
    const cleanWizardName = entry.isPlayer
      ? entry.name.replace(/\s*\(Bạn\)\s*$/u, '').trim() || entry.name
      : entry.name;
    const kindLabel = entry.isSeededRival
      ? 'Hoc vien mau'
      : entry.isFriend && !entry.isPlayer
        ? 'Ban be'
        : 'Nguoi choi that';
    return [
      entry.rank,
      escapeCsvCell(cleanWizardName),
      entry.house.toUpperCase(),
      entry.ratingScore,
      entry.stars,
      entry.primaryValue,
      kindLabel,
    ];
  });
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function buildAllPersonalRecordsSummary(
  state: GameState,
  cloudCache?: Partial<Record<LeaderboardGameId, CloudLeaderboardEntry[]>>
): PersonalDisciplineSummaryRow[] {
  const lb = ensureMinigameLeaderboardState(state);
  return ALL_LEADERBOARD_GAMES.map((gid) => {
    const valley = buildMinigameLeaderboard(state, gid, 'valley', cloudCache?.[gid]);
    const friends = buildMinigameLeaderboard(state, gid, 'friends', cloudCache?.[gid]);
    const rec = lb.records[gid];
    return {
      gameId: gid,
      meta: LEADERBOARD_GAME_META[gid],
      valleyRank: valley.playerRank,
      valleyTotal: valley.totalEntries,
      friendsRank: friends.playerRank,
      friendsTotal: friends.totalEntries,
      primaryValue: valley.playerEntry.primaryValue,
      primaryDisplayVi: valley.playerEntry.primaryDisplayVi,
      stars: valley.playerEntry.stars,
      ratingScore: valley.playerEntry.ratingScore,
      ratingDisplayVi: valley.playerEntry.ratingDisplayVi,
      detailDisplayVi: valley.playerEntry.detailDisplayVi,
      bestSessionScore: rec.bestSessionScore,
      league: valley.playerEntry.league,
    };
  });
}

export interface MinigameSessionMetricInput {
  clearedStage?: number;
  sessionScore?: number;
  efficiency?: number;
  streak?: number;
  previousRankOverride?: number;
  nowMs?: number;
}

export function recordMinigameSessionResult(
  state: GameState,
  gameId: LeaderboardGameId,
  input: MinigameSessionMetricInput = {}
): LeaderboardRankChange {
  // Chỉ tính điểm xếp hạng & Cúp 4 Nhà ở 3 game: Match-3, Sudoku và Pikachu (blocks)
  if (!isScoredLeaderboardGame(gameId)) {
    const playerHouse = getPlayerHogwartsHouse(state);
    return {
      gameId,
      previousRank: 1,
      newRank: 1,
      rankUpBy: 0,
      totalEntries: 1,
      housePointsAwarded: 0,
      playerHouse,
      houseRank: 1,
    };
  }

  const previousRankFromSnapshot =
    input.previousRankOverride && input.previousRankOverride > 0
      ? input.previousRankOverride
      : state.minigameLeaderboard?.records?.[gameId]?.lastRankValley;

  const beforeStanding = !previousRankFromSnapshot
    ? buildMinigameLeaderboard(state, gameId, 'valley')
    : null;
  const lb = ensureMinigameLeaderboardState(state);
  const rec = lb.records[gameId];
  const previousRank = previousRankFromSnapshot ?? beforeStanding?.playerRank ?? 1;

  const baseAfter = deriveBaseRecordFromState(state, gameId);
  const prevBestStage = rec.bestStage;
  const nextBestStage = Math.max(
    rec.bestStage,
    baseAfter.bestStage,
    Math.floor(input.clearedStage ?? 0)
  );
  const advancedStage = nextBestStage > prevBestStage;
  rec.bestStage = nextBestStage;
  rec.totalWins = Math.max(rec.totalWins, baseAfter.totalWins);
  rec.bestStreak = Math.max(
    rec.bestStreak,
    baseAfter.bestStreak,
    Math.floor(input.streak ?? 0)
  );

  const sessionScore = Math.max(0, Math.round(input.sessionScore ?? 0));
  if (sessionScore > 0) {
    rec.bestSessionScore = Math.max(rec.bestSessionScore, sessionScore);
  }

  if (input.efficiency !== undefined && Number.isFinite(input.efficiency)) {
    const eff = Math.max(0, Math.round(input.efficiency));
    if (gameId === 'sudoku') {
      // Lower mistakes is better!
      if (rec.bestEfficiency === undefined || eff < rec.bestEfficiency) {
        rec.bestEfficiency = eff;
      }
    } else {
      // Higher combo / score is better!
      rec.bestEfficiency = Math.max(rec.bestEfficiency ?? 0, eff);
    }
  }

  // Recompute authoritative composite rating score for the 3 scored games (match3, sudoku, blocks)
  // Cap effectiveWins relative to bestStage so spamming Stage 1 cannot farm infinite rating points!
  const effBonus =
    gameId === 'sudoku'
      ? rec.bestEfficiency !== undefined
        ? Math.max(0, (5 - rec.bestEfficiency) * 90)
        : 0
      : Math.round((rec.bestEfficiency ?? 0) * 0.25);
  const effectiveWins = Math.min(rec.totalWins, rec.bestStage * 2 + 10);
  const computedRating = Math.max(
    baseAfter.highScore,
    rec.bestStage * 155 +
      effectiveWins * 28 +
      rec.bestStreak * 40 +
      Math.round(rec.bestSessionScore * 0.18) +
      effBonus
  );
  rec.highScore = Math.max(
    advancedStage ? rec.highScore + (sessionScore > 0 ? 15 : 8) : rec.highScore,
    computedRating
  );
  rec.updatedAt = input.nowMs ?? Date.now();

  const playerHouse = getPlayerHogwartsHouse(state);
  if (!state.housePoints || typeof state.housePoints !== 'object') {
    state.housePoints = {
      Gryffindor: 0,
      Slytherin: 0,
      Ravenclaw: 0,
      Hufflepuff: 0,
    };
  }
  const housePointsAwarded = 20 + Math.min(30, Math.floor(rec.bestStage * 0.25));
  state.housePoints[playerHouse] = Math.max(
    0,
    Math.floor(state.housePoints[playerHouse] ?? 0) + housePointsAwarded
  );

  const afterStanding = buildMinigameLeaderboard(state, gameId, 'valley');
  const newRank = afterStanding.playerRank;
  const rankUpBy = Math.max(0, previousRank - newRank);
  rec.lastRankValley = newRank;
  const houseRank =
    afterStanding.houseStandings.find((h) => h.house === playerHouse)?.rank ?? 1;

  return {
    gameId,
    previousRank,
    newRank,
    rankUpBy,
    totalEntries: afterStanding.totalEntries,
    housePointsAwarded,
    playerHouse,
    houseRank,
  };
}

export function getClientLeaderboardUserId(): string {
  if (typeof localStorage === 'undefined') return 'local_player';
  try {
    return localStorage.getItem(CLIENT_UID_STORAGE_KEY) || 'local_player';
  } catch {
    return 'local_player';
  }
}

const cloudEntriesMemoryCache: Partial<Record<LeaderboardGameId, CloudLeaderboardEntry[]>> = {};

export function getCachedCloudLeaderboardEntries(
  gameId: LeaderboardGameId
): CloudLeaderboardEntry[] {
  return cloudEntriesMemoryCache[gameId] ?? [];
}

export function setCachedCloudLeaderboardEntries(
  gameId: LeaderboardGameId,
  entries: ReadonlyArray<CloudLeaderboardEntry>
): void {
  cloudEntriesMemoryCache[gameId] = [...entries];
}

export function clearCachedCloudLeaderboards(): void {
  for (const gid of ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw', 'seedquiz'] as const) {
    delete cloudEntriesMemoryCache[gid];
  }
}

export function getAllCachedCloudLeaderboards(): Partial<
  Record<LeaderboardGameId, CloudLeaderboardEntry[]>
> {
  return cloudEntriesMemoryCache;
}

export interface AuthoritativeLeaderboardTransport {
  fetchLeaderboards: (
    gameId: LeaderboardGameId
  ) => Promise<unknown>;
  submitLeaderboard: (
    payload: Record<string, unknown>
  ) => Promise<unknown>;
}

let authoritativeLeaderboardTransport: AuthoritativeLeaderboardTransport | null = null;

export function registerAuthoritativeLeaderboardTransport(
  transport: AuthoritativeLeaderboardTransport | null
): void {
  authoritativeLeaderboardTransport = transport;
}

function sanitizeCloudEntry(raw: Record<string, unknown>): CloudLeaderboardEntry | null {
  const userId = typeof raw.userId === 'string' ? raw.userId.trim() : '';
  if (!userId) return null;
  const house = normalizeClientHogwartsHouse(raw.house) ?? 'Gryffindor';
  return {
    userId,
    name: String(raw.name || raw.parkName || 'Phù Thủy Hang Sóc').slice(0, 42),
    parkName: String(raw.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
    friendCode: String(raw.friendCode || 'HS-CLUD-01').slice(0, 24),
    avatarEmoji: String(raw.avatarEmoji || '🧙‍♂️').slice(0, 8),
    house,
    primaryValue: Math.max(0, Math.floor(Number(raw.primaryValue) || 0)),
    ratingScore: Math.max(0, Math.floor(Number(raw.ratingScore) || 0)),
    totalWins: Math.max(0, Math.floor(Number(raw.totalWins) || 0)),
    bestStreak: Math.max(0, Math.floor(Number(raw.bestStreak) || 0)),
    detailLabelVi: String(raw.detailLabelVi || '').slice(0, 64),
    updatedAt: Math.floor(Number(raw.updatedAt) || 0),
  };
}

export function hydrateCloudLeaderboardsFromSnapshot(rawLeaderboards: unknown): boolean {
  if (!rawLeaderboards || typeof rawLeaderboards !== 'object') return false;
  const obj = rawLeaderboards as Record<string, unknown>;
  let updated = false;
  for (const gid of SCORED_LEADERBOARD_GAMES) {
    const rawList = obj[gid];
    if (!Array.isArray(rawList)) continue;
    const cleaned: CloudLeaderboardEntry[] = [];
    for (const item of rawList) {
      if (item && typeof item === 'object') {
        const parsed = sanitizeCloudEntry(item as Record<string, unknown>);
        if (parsed) cleaned.push(parsed);
      }
    }
    cloudEntriesMemoryCache[gid] = cleaned;
    updated = true;
  }
  return updated;
}

function buildCloudEntryFromPlayerState(
  state: GameState,
  gameId: LeaderboardGameId
): CloudLeaderboardEntry {
  const player = buildPlayerLeaderboardEntry(state, gameId);
  const userId = getClientLeaderboardUserId();
  const displayName =
    state.neighborSocial?.playerDisplayName?.trim() ||
    state.parkName ||
    'Trang Trại Hang Sóc';
  return {
    userId,
    name: displayName,
    parkName: state.parkName || 'Trang Trại Hang Sóc',
    friendCode: player.friendCode,
    avatarEmoji: player.avatarEmoji,
    house: player.house,
    primaryValue: player.primaryValue,
    ratingScore: player.ratingScore,
    totalWins: player.totalWins,
    bestStreak: player.bestStreak,
    detailLabelVi: player.detailDisplayVi,
    updatedAt: Date.now(),
  };
}

export async function fetchCloudLeaderboardEntries(
  gameId: LeaderboardGameId,
  endpoint = '/api/leaderboard'
): Promise<CloudLeaderboardEntry[]> {
  if (!isScoredLeaderboardGame(gameId)) {
    return [];
  }

  // Ưu tiên kênh RPC ủy quyền (`performBurrowAction: getLeaderboard` / `getBurrowGarden`) — hoạt động 100% trong cả iframe `#burrow-ticket` của HPVN!
  if (endpoint === '/api/leaderboard' && authoritativeLeaderboardTransport) {
    try {
      const snapOrMap = await authoritativeLeaderboardTransport.fetchLeaderboards(gameId);
      if (snapOrMap && typeof snapOrMap === 'object') {
        const maybeSnap = snapOrMap as Record<string, unknown>;
        const lbContainer =
          maybeSnap.leaderboards && typeof maybeSnap.leaderboards === 'object'
            ? maybeSnap.leaderboards
            : maybeSnap;
        if (hydrateCloudLeaderboardsFromSnapshot(lbContainer)) {
          return cloudEntriesMemoryCache[gameId] ?? [];
        }
      }
    } catch {
      // Fallback sang HTTP GET `/api/leaderboard` nếu kênh RPC tạm gián đoạn
    }
  }

  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return cloudEntriesMemoryCache[gameId] ?? [];
  }
  if (
    endpoint === '/api/leaderboard' &&
    typeof navigator !== 'undefined' &&
    /jsdom/i.test(navigator.userAgent || '')
  ) {
    return cloudEntriesMemoryCache[gameId] ?? [];
  }
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${endpoint}?game=${encodeURIComponent(gameId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!res.ok) return cloudEntriesMemoryCache[gameId] ?? [];
    const data = (await res.json()) as { entries?: Array<Record<string, unknown>> };
    if (Array.isArray(data?.entries)) {
      const cleaned = data.entries
        .map((r) => (r && typeof r === 'object' ? sanitizeCloudEntry(r) : null))
        .filter((r): r is CloudLeaderboardEntry => r !== null);
      cloudEntriesMemoryCache[gameId] = cleaned;
      return cleaned;
    }
  } catch {
    // Offline-first fallback: silently retain local + cached leaderboard
  }
  return cloudEntriesMemoryCache[gameId] ?? [];
}

export async function submitPlayerCloudLeaderboardEntry(
  state: GameState,
  gameId: LeaderboardGameId,
  endpoint = '/api/leaderboard'
): Promise<void> {
  if (!isScoredLeaderboardGame(gameId)) return;
  if (state.sandboxMode || state.sandboxTainted) return;

  const entry = buildCloudEntryFromPlayerState(state, gameId);
  const houseExplicit = Boolean(state.minigameLeaderboard?.playerHouseExplicit);

  // 1. Ưu tiên gửi qua kênh RPC ủy quyền (`performBurrowAction: submitLeaderboard`) để chạy xuyên iframe `#burrow-ticket` HPVN!
  if (endpoint === '/api/leaderboard' && authoritativeLeaderboardTransport) {
    try {
      const snapOrMap = await authoritativeLeaderboardTransport.submitLeaderboard({
        gameId,
        entry,
        ...(houseExplicit ? { house: entry.house, houseExplicit: true } : {}),
      });
      if (snapOrMap && typeof snapOrMap === 'object') {
        const maybeSnap = snapOrMap as Record<string, unknown>;
        const lbContainer =
          maybeSnap.leaderboards && typeof maybeSnap.leaderboards === 'object'
            ? maybeSnap.leaderboards
            : maybeSnap;
        hydrateCloudLeaderboardsFromSnapshot(lbContainer);
      }
      return;
    } catch {
      // Fallback sang HTTP POST `/api/leaderboard` nếu kênh RPC tạm gián đoạn
    }
  }

  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  // Avoid noisy network calls in Vitest / headless JSDOM when no custom endpoint is set
  if (
    endpoint === '/api/leaderboard' &&
    typeof navigator !== 'undefined' &&
    /jsdom/i.test(navigator.userAgent || '')
  ) {
    return;
  }

  try {
    const userId = getClientLeaderboardUserId();
    const bearer =
      getCachedSessionBearerToken() ?? (await acquireSessionBearerToken(userId).catch(() => null));
    const payload = {
      gameId,
      entry,
    };
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3500);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    };
    if (bearer) {
      headers.Authorization = `Bearer ${bearer}`;
    }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { entries?: Array<Record<string, unknown>> };
      if (Array.isArray(data?.entries)) {
        const cleaned = data.entries
          .map((r) => (r && typeof r === 'object' ? sanitizeCloudEntry(r) : null))
          .filter((r): r is CloudLeaderboardEntry => r !== null);
        cloudEntriesMemoryCache[gameId] = cleaned;
      }
    }
  } catch {
    // Silent offline-first fallback
  }
}

export async function syncAllPlayerCloudLeaderboards(state: GameState): Promise<void> {
  if (state.sandboxMode || state.sandboxTainted) return;
  ensureMinigameLeaderboardState(state);

  const entriesByGame: Record<string, CloudLeaderboardEntry> = {};
  let hasProgress = false;
  for (const gid of SCORED_LEADERBOARD_GAMES) {
    const entry = buildCloudEntryFromPlayerState(state, gid);
    if (entry.primaryValue > 0 || entry.totalWins > 0) {
      entriesByGame[gid] = entry;
      hasProgress = true;
    }
  }

  if (authoritativeLeaderboardTransport) {
    try {
      if (hasProgress) {
        const houseExplicit = Boolean(state.minigameLeaderboard?.playerHouseExplicit);
        const snap = await authoritativeLeaderboardTransport.submitLeaderboard({
          entriesByGame,
          ...(houseExplicit
            ? { house: getPlayerHogwartsHouse(state), houseExplicit: true }
            : {}),
        });
        if (snap && typeof snap === 'object') {
          const maybeSnap = snap as Record<string, unknown>;
          hydrateCloudLeaderboardsFromSnapshot(maybeSnap.leaderboards ?? maybeSnap);
        }
      } else {
        const snap = await authoritativeLeaderboardTransport.fetchLeaderboards('match3');
        if (snap && typeof snap === 'object') {
          const maybeSnap = snap as Record<string, unknown>;
          hydrateCloudLeaderboardsFromSnapshot(maybeSnap.leaderboards ?? maybeSnap);
        }
      }
      return;
    } catch {
      // Fallback sang từng game qua HTTP
    }
  }

  if (hasProgress) {
    for (const gid of Object.keys(entriesByGame) as LeaderboardGameId[]) {
      await submitPlayerCloudLeaderboardEntry(state, gid);
    }
  }
}
