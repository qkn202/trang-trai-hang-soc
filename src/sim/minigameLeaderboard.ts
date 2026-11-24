import {
  GameState,
  HouseName,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  MinigameLeaderboardState,
  MinigamePersonalRecord,
  MinigameWeeklyProgress,
  NeighborProfileState,
} from '../types/game';
import { isNpcNeighborProfile } from './neighborSocial';
import { CURRENT_ARCADE_DISCIPLINE_REV } from './puzzleShared';
import { MAX_MATCH3_STAGE } from '../data/match3Levels';
import { flushFarmSave, identity, request } from '../hpvn/bridge';
import {
  computeHousePointsForLeaderboardRank,
  computeStageDifficultyPoints,
  computeWeeklyStageProgressScore,
  getActiveHouseCupWeekKey,
  houseCup,
  houseCupMinStagesForPoints,
  houseCupRankTiers,
  houseCupStageScoreBands,
  houseWeekPoints,
} from '../hpvn/houseCup';

export const SCORED_LEADERBOARD_GAMES: ReadonlyArray<LeaderboardGameId> = [
  'match3',
  'caro',
  'sudoku',
  'chess',
  'blocks',
  'jigsaw',
];

export const ALL_LEADERBOARD_GAMES: ReadonlyArray<LeaderboardGameId> = SCORED_LEADERBOARD_GAMES;

export function isScoredLeaderboardGame(
  gameId: string
): gameId is 'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'jigsaw' {
  return (
    gameId === 'match3' ||
    gameId === 'caro' ||
    gameId === 'sudoku' ||
    gameId === 'chess' ||
    gameId === 'blocks' ||
    gameId === 'jigsaw'
  );
}

export function normalizeScoredLeaderboardGame(gameId?: string): LeaderboardGameId {
  return gameId && isScoredLeaderboardGame(gameId) ? gameId : 'match3';
}

export const MAX_PUZZLE_TOWER_STAGE = 777;

export interface LeaderboardGameMeta {
  id: LeaderboardGameId;
  icon: string;
  spriteIcon: string;
  shortVi: string;
  /** HPVN: the tab's label, whole words («Cờ Phù Thủy», not a cut «Cờ Phù») */
  tabVi: string;
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
    spriteIcon: '/game/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp',
    shortVi: 'Bùa Gặt Honeydukes',
    tabVi: 'Bùa Gặt',
    titleVi: 'Bùa Gặt Honeydukes',
    cupTitleVi: 'BXH Tuần Bùa Gặt Honeydukes (Khớp Cúp Nhà)',
    subtitleVi: 'BXH cá nhân từng tuần — xếp hạng theo Điểm Tuần có trọng số độ khó màn vượt mới',
    primaryColVi: 'Màn Tuần',
    secondaryColVi: 'Điểm Tuần',
    detailColVi: 'Thắng Tuần & Chuỗi',
  },
  caro: {
    id: 'caro',
    icon: '🧨',
    spriteIcon: '/game/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1',
    shortVi: 'Dò Mìn Phép Thuật',
    tabVi: 'Dò Mìn',
    titleVi: 'Dò Mìn Phép Thuật',
    cupTitleVi: 'BXH Tuần Dò Mìn Phép Thuật (Khớp Cúp Nhà)',
    subtitleVi: 'BXH cá nhân từng tuần — xếp hạng theo Điểm Tuần có trọng số độ khó màn vượt mới',
    primaryColVi: 'Màn Tuần',
    secondaryColVi: 'Điểm Tuần',
    detailColVi: 'Thắng Tuần & Chuỗi',
  },
  sudoku: {
    id: 'sudoku',
    icon: '🔢',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/m3_piece_scroll.webp',
    shortVi: 'Số Học Huyền Bí',
    tabVi: 'Số Học',
    titleVi: 'Số Học Huyền Bí',
    cupTitleVi: 'BXH Tuần Số Học Huyền Bí (Khớp Cúp Nhà)',
    subtitleVi: 'BXH cá nhân từng tuần — xếp hạng theo Điểm Tuần có trọng số độ khó màn vượt mới',
    primaryColVi: 'Màn Tuần',
    secondaryColVi: 'Điểm Tuần',
    detailColVi: 'Thắng Tuần & Chuỗi',
  },
  chess: {
    id: 'chess',
    icon: '🎯',
    spriteIcon: '/game/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2',
    shortVi: 'Bắn Cá Hồ Đen',
    tabVi: 'Bắn Cá',
    titleVi: 'Bắn Cá Hồ Đen',
    cupTitleVi: 'BXH Tuần Bắn Cá Hồ Đen (Khớp Cúp Nhà)',
    subtitleVi: 'BXH cá nhân từng tuần — xếp hạng theo Điểm Tuần có trọng số độ khó màn vượt mới',
    primaryColVi: 'Màn Tuần',
    secondaryColVi: 'Điểm Tuần',
    detailColVi: 'Thắng Tuần & Chuỗi',
  },
  blocks: {
    id: 'blocks',
    icon: '🦄',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/beast_niffler.webp',
    shortVi: 'Sinh Vật Huyền Bí',
    tabVi: 'Sinh Vật',
    titleVi: 'Sinh Vật Huyền Bí',
    cupTitleVi: 'BXH Tuần Sinh Vật Huyền Bí (Khớp Cúp Nhà)',
    subtitleVi: 'BXH cá nhân từng tuần — xếp hạng theo Điểm Tuần có trọng số độ khó màn vượt mới',
    primaryColVi: 'Màn Tuần',
    secondaryColVi: 'Điểm Tuần',
    detailColVi: 'Thắng Tuần & Chuỗi',
  },
  jigsaw: {
    id: 'jigsaw',
    icon: '🧩',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp',
    shortVi: 'Tranh Ghép Phép Thuật',
    tabVi: 'Tranh Ghép',
    titleVi: 'Tranh Ghép Phép Thuật',
    cupTitleVi: 'BXH Tuần Tranh Ghép Phép Thuật (Khớp Cúp Nhà)',
    subtitleVi: 'BXH cá nhân từng tuần — xếp hạng theo Điểm Tuần có trọng số độ khó màn vượt mới',
    primaryColVi: 'Màn Tuần',
    secondaryColVi: 'Điểm Tuần',
    detailColVi: 'Thắng Tuần & Chuỗi',
  },
  seedquiz: {
    id: 'seedquiz',
    icon: '🪄',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/ui_icon_accio.webp',
    shortVi: 'Học Viện Thần Chú',
    tabVi: 'Thần Chú',
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
  /** HPVN profile picture (server: normalizeShoutAvatarUrl), only when the member has one */
  avatarUrl?: string;
  house: HouseName;
  /** Mã tuần Cúp Nhà của dòng BXH này (VD '2026-W48'); khớp với houseCup()?.weekKey */
  weekKey?: string;
  /** Số màn vượt mới trong tuần (Cách A Cúp Nhà) */
  weeklyCleared?: number;
  /** Điểm tuần có trọng số độ khó màn (Cách A: 20/25/30/35 đ/màn) */
  weeklyScore?: number;
  /** Số trận thắng trong tuần */
  weeklyWins?: number;
  /** Màn đỉnh tích luỹ trọn đời (chỉ để tham khảo, KHÔNG dùng xếp hạng tuần) */
  bestStage?: number;
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
  weekKey: string;
  name: string;
  titleVi: string;
  parkName: string;
  friendCode: string;
  avatarEmoji: string;
  avatarUrl?: string;
  portraitSprite?: string;
  house: HouseName;
  isPlayer: boolean;
  isFriend: boolean;
  isCloudPlayer?: boolean;
  neighborId?: string;
  /** Số màn vượt mới trong tuần (dùng đối chiếu mốc >= 5 màn Cúp Nhà) */
  primaryValue: number;
  primaryDisplayVi: string;
  /** Điểm tuần có trọng số độ khó màn (Cách A — khóa sắp xếp chính của BXH tuần) */
  ratingScore: number;
  ratingDisplayVi: string;
  totalWins: number;
  bestStreak: number;
  detailDisplayVi: string;
  /** Màn cao nhất tích luỹ (chỉ tham khảo ở tab Kỷ Lục, không dùng xếp hạng tuần) */
  allTimeBestStage?: number;
  allTimeStageDisplayVi?: string;
  /** Điểm đóng góp cho Nhà trong tuần này theo đúng bảng bậc hạng Cúp Nhà (100/80/65/50/35/20, 0 nếu < 5 màn tuần) */
  cupContributionPoints: number;
  league: LeaderboardLeagueBadge;
}

export interface LeaderboardStandingResult {
  gameId: LeaderboardGameId;
  meta: LeaderboardGameMeta;
  scope: Exclude<LeaderboardScope, 'personal'>;
  weekKey: string;
  isLegacyCloudFallback?: boolean;
  entries: LeaderboardRowEntry[];
  playerEntry: LeaderboardRowEntry;
  playerRank: number;
  totalEntries: number;
  nextRivalAbove: LeaderboardRowEntry | null;
  houseStandings: HouseCupStanding[];
  playerHouse: HouseName;
  activeHouseFilter: 'all' | HouseName;
}

export interface PersonalDisciplineSummaryRow {
  gameId: LeaderboardGameId;
  meta: LeaderboardGameMeta;
  weekKey: string;
  valleyRank: number;
  valleyTotal: number;
  friendsRank: number;
  friendsTotal: number;
  primaryDisplayVi: string;
  ratingDisplayVi: string;
  detailDisplayVi: string;
  allTimeBestStage: number;
  allTimeStageDisplayVi: string;
  cupContributionPoints: number;
  bestSessionScore: number;
  league: LeaderboardLeagueBadge;
}

export function getLeaderboardLeagueBadge(
  gameId: LeaderboardGameId,
  weeklyCleared: number
): LeaderboardLeagueBadge {
  if (gameId === 'seedquiz') {
    if (weeklyCleared >= 120) {
      return { tierId: 'legend', icon: '👑', labelVi: 'Đại Học Giả Tuần' };
    }
    if (weeklyCleared >= 60) {
      return { tierId: 'grandmaster', icon: '💎', labelVi: 'Thủ Khoa Tuần' };
    }
    if (weeklyCleared >= 25) {
      return { tierId: 'gold', icon: '🥇', labelVi: 'Ưu Tú O.W.L.' };
    }
    if (weeklyCleared >= 10) {
      return { tierId: 'silver', icon: '🥈', labelVi: 'Học Giả Bạc' };
    }
    return { tierId: 'bronze', icon: '🥉', labelVi: 'Tân Sinh Tuần' };
  }

  if (weeklyCleared >= 35) {
    return { tierId: 'legend', icon: '👑', labelVi: 'Huyền Thoại Tuần' };
  }
  if (weeklyCleared >= 20) {
    return { tierId: 'grandmaster', icon: '💎', labelVi: 'Đại Kiện Tướng' };
  }
  if (weeklyCleared >= 10) {
    return { tierId: 'gold', icon: '🥇', labelVi: 'Quán Quân Vàng' };
  }
  if (weeklyCleared >= 5) {
    return { tierId: 'silver', icon: '🥈', labelVi: 'Học Giả Bạc' };
  }
  return { tierId: 'bronze', icon: '🥉', labelVi: 'Tân Binh Tuần' };
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
        MAX_MATCH3_STAGE,
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

  const rev = Math.floor(Number(pa?.arcadeDisciplineRev) || 0);
  const stageMap: Record<'caro' | 'sudoku' | 'chess' | 'blocks' | 'jigsaw', number> = {
    caro:
      rev >= CURRENT_ARCADE_DISCIPLINE_REV
        ? Math.max(
            0,
            Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.caroCleared ?? Math.max(0, (pa?.caroStage ?? 1) - 1))
          )
        : 0,
    sudoku: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.sudokuCleared ?? Math.max(0, (pa?.sudokuStage ?? 1) - 1))
    ),
    chess:
      rev >= CURRENT_ARCADE_DISCIPLINE_REV
        ? Math.max(
            0,
            Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.chessCleared ?? Math.max(0, (pa?.chessStage ?? 1) - 1))
          )
        : 0,
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

const cloudEntriesMemoryCache: Partial<Record<LeaderboardGameId, CloudLeaderboardEntry[]>> = {};
const cloudBoardWeekKeyCache: Partial<Record<LeaderboardGameId, string>> = {};
const cloudBoardLegacyFlagCache: Partial<Record<LeaderboardGameId, boolean>> = {};

export function getActiveLeaderboardWeekKey(
  nowMs?: number,
  gameId?: LeaderboardGameId
): string {
  const cupWeek = houseCup()?.weekKey?.trim() ?? '';
  if (cupWeek && cupWeek.toLowerCase() !== 'local') {
    return cupWeek;
  }
  if (gameId) {
    const cloudWeek = cloudBoardWeekKeyCache[gameId]?.trim() ?? '';
    if (cloudWeek && cloudWeek.toLowerCase() !== 'local') {
      return cloudWeek;
    }
  }
  return getActiveHouseCupWeekKey(nowMs);
}

function createEmptyWeeklyProgress(weekKey: string): MinigameWeeklyProgress {
  return {
    weekKey,
    stagesCleared: 0,
    weightedScore: 0,
    wins: 0,
    bestStreak: 0,
    bestSessionScore: 0,
    updatedAt: 0,
  };
}

function ensureWeeklyProgressRecord(
  rec: MinigamePersonalRecord,
  weekKey: string
): MinigameWeeklyProgress {
  if (!rec.weekly || rec.weekly.weekKey !== weekKey) {
    rec.weekly = createEmptyWeeklyProgress(weekKey);
    rec.lastRankValley = undefined;
    return rec.weekly;
  }
  rec.weekly.stagesCleared = Math.max(0, Math.floor(Number(rec.weekly.stagesCleared) || 0));
  rec.weekly.weightedScore = Math.max(0, Math.floor(Number(rec.weekly.weightedScore) || 0));
  rec.weekly.wins = Math.max(0, Math.floor(Number(rec.weekly.wins) || 0));
  rec.weekly.bestStreak = Math.max(0, Math.floor(Number(rec.weekly.bestStreak) || 0));
  rec.weekly.bestSessionScore = Math.max(0, Math.floor(Number(rec.weekly.bestSessionScore) || 0));
  rec.weekly.updatedAt = Math.max(0, Math.floor(Number(rec.weekly.updatedAt) || 0));
  return rec.weekly;
}

export function ensureMinigameLeaderboardState(
  state: GameState,
  nowMs?: number
): MinigameLeaderboardState {
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

  const activeWeekKey = getActiveLeaderboardWeekKey(nowMs);
  state.minigameLeaderboard.activeWeekKey = activeWeekKey;

  const rev = Math.floor(Number(state.puzzleArcade?.arcadeDisciplineRev) || 0);
  for (const gid of SCORED_LEADERBOARD_GAMES) {
    if ((gid === 'caro' || gid === 'chess') && rev < CURRENT_ARCADE_DISCIPLINE_REV) {
      state.minigameLeaderboard.records[gid] = {
        bestStage: 0,
        highScore: 0,
        bestSessionScore: 0,
        totalWins: 0,
        bestStreak: 0,
        bestEfficiency: undefined,
        updatedAt: 0,
        weekly: createEmptyWeeklyProgress(activeWeekKey),
      };
      continue;
    }
    const base = deriveBaseRecordFromState(state, gid);
    const cur = state.minigameLeaderboard.records[gid];
    if (!cur) {
      state.minigameLeaderboard.records[gid] = {
        ...base,
        weekly: createEmptyWeeklyProgress(activeWeekKey),
      };
    } else {
      cur.bestStage = Math.max(cur.bestStage ?? 0, base.bestStage);
      cur.totalWins = Math.max(cur.totalWins ?? 0, base.totalWins);
      cur.bestStreak = Math.max(cur.bestStreak ?? 0, base.bestStreak);
      cur.highScore = Math.max(cur.highScore ?? 0, base.highScore);
      cur.bestSessionScore = Math.max(cur.bestSessionScore ?? 0, base.bestSessionScore);
      ensureWeeklyProgressRecord(cur, activeWeekKey);
    }
  }

  // Chỉ giữ Học Viện Thần Chú (seedquiz) ngoài BXH & Cúp 4 Nhà; đủ 6 game mini (Bùa Gặt, Dò Mìn, Số Học, Bắn Cá, Sinh Vật, Tranh Ghép) đều tính điểm
  state.minigameLeaderboard.records.seedquiz = {
    bestStage: 0,
    highScore: 0,
    bestSessionScore: 0,
    totalWins: 0,
    bestStreak: 0,
    bestEfficiency: undefined,
    updatedAt: 0,
    weekly: createEmptyWeeklyProgress(activeWeekKey),
  };

  return state.minigameLeaderboard;
}

export function getPlayerHogwartsHouse(state: GameState): HouseName {
  const chosen = state.minigameLeaderboard?.playerHouse;
  if (chosen && ALL_HOGWARTS_HOUSES.includes(chosen)) {
    return chosen;
  }
  return 'Gryffindor'; // HPVN: main.ts locks the HPVN house; the page keeps no house points to guess from
}

export function setPlayerHogwartsHouse(state: GameState, house: HouseName): HouseName {
  const safeHouse: HouseName = ALL_HOGWARTS_HOUSES.includes(house) ? house : 'Gryffindor';
  const lb = ensureMinigameLeaderboardState(state);
  lb.playerHouse = safeHouse;
  return safeHouse;
}

export function rollSortingHatHouse(state: GameState, randomFn = Math.random): HouseName {
  const current = getPlayerHogwartsHouse(state);
  const candidates = ALL_HOGWARTS_HOUSES.filter((h) => h !== current);
  const pick =
    candidates[Math.floor(Math.max(0, Math.min(0.9999, randomFn())) * candidates.length)] ??
    ALL_HOGWARTS_HOUSES[0];
  return setPlayerHogwartsHouse(state, pick);
}

export function formatAllTimeStageDisplayVi(gameId: LeaderboardGameId, bestStage: number): string {
  const safeVal = Math.max(0, Math.floor(bestStage || 0));
  if (gameId === 'seedquiz') {
    return `${safeVal.toLocaleString('vi-VN')} câu đúng`;
  }
  const maxStage = gameId === 'match3' ? MAX_MATCH3_STAGE : MAX_PUZZLE_TOWER_STAGE;
  if (safeVal >= maxStage) {
    return `👑 ${maxStage}/${maxStage}`;
  }
  return `Màn ${safeVal}/${maxStage}`;
}

export function formatWeeklyStagesDisplayVi(gameId: LeaderboardGameId, weeklyCleared: number): string {
  const safeVal = Math.max(0, Math.floor(weeklyCleared || 0));
  if (gameId === 'seedquiz') {
    return `${safeVal.toLocaleString('vi-VN')} câu tuần`;
  }
  return `${safeVal.toLocaleString('vi-VN')} màn tuần`;
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
    const eff = efficiency && efficiency > 0 ? ` • ⚡${efficiency} lượt` : '';
    return `${totalWins} thắng tuần • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'chess') {
    const eff = efficiency && efficiency > 0 ? ` • ⚡Combo ×${efficiency}` : '';
    return `${totalWins} thắng tuần • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'sudoku') {
    const eff =
      efficiency !== undefined && efficiency >= 0
        ? efficiency === 0
          ? ' • ✨0 lỗi'
          : ` • ≤${efficiency} lỗi`
        : '';
    return `${totalWins} thắng tuần • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'blocks') {
    const eff = efficiency && efficiency > 0 ? ` • ⚡Combo ×${efficiency}` : '';
    return `${totalWins} thắng tuần • 🔥×${bestStreak}${eff}`;
  }
  if (gameId === 'jigsaw') {
    const eff = efficiency && efficiency > 0 ? ` • 🧩Combo ×${efficiency}` : '';
    return `${totalWins} thắng tuần • 🔥×${bestStreak}${eff}`;
  }
  const bestRun = efficiency && efficiency > 0 ? ` • 🎯${efficiency.toLocaleString('vi-VN')}đ` : '';
  return `${totalWins} thắng tuần • 🔥×${bestStreak}${bestRun}`;
}

function normalizeValidFriendCode(code?: string): string {
  const norm = (code || '').trim().toUpperCase();
  return norm && norm !== 'HS-CLUD-00' ? norm : '';
}

function toUidSlug(uid?: string): string {
  return (uid || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function normalizeMemberHandle(name?: string): string {
  return (name || '').trim().toLowerCase();
}

function extractCloudWeeklyMetrics(ce: CloudLeaderboardEntry): {
  weeklyCleared: number;
  weeklyScore: number;
  weeklyWins: number;
  bestStreak: number;
  allTimeBestStage?: number;
} {
  const weeklyCleared = Math.max(0, Math.floor(Number(ce.weeklyCleared ?? ce.primaryValue) || 0));
  const weeklyScore = Math.max(0, Math.floor(Number(ce.weeklyScore ?? ce.ratingScore) || 0));
  const weeklyWins = Math.max(
    weeklyCleared,
    Math.floor(Number(ce.weeklyWins ?? ce.totalWins) || 0)
  );
  const bestStreak = Math.max(0, Math.floor(Number(ce.bestStreak) || 0));
  const allTimeBestStage =
    typeof ce.bestStage === 'number' && Number.isFinite(ce.bestStage)
      ? Math.max(0, Math.floor(ce.bestStage))
      : undefined;
  return { weeklyCleared, weeklyScore, weeklyWins, bestStreak, allTimeBestStage };
}

function isCloudEntryInActiveWeek(ce: CloudLeaderboardEntry, activeWeekKey: string): boolean {
  const entryWeek = typeof ce.weekKey === 'string' ? ce.weekKey.trim() : '';
  if (!entryWeek || entryWeek.toLowerCase() === 'local') return true;
  return entryWeek === activeWeekKey;
}

function isBetterCloudEntry(
  candidate: CloudLeaderboardEntry,
  prev: CloudLeaderboardEntry
): boolean {
  const cm = extractCloudWeeklyMetrics(candidate);
  const pm = extractCloudWeeklyMetrics(prev);
  if (cm.weeklyScore !== pm.weeklyScore) return cm.weeklyScore > pm.weeklyScore;
  if (cm.weeklyCleared !== pm.weeklyCleared) return cm.weeklyCleared > pm.weeklyCleared;
  if (cm.weeklyWins !== pm.weeklyWins) return cm.weeklyWins > pm.weeklyWins;
  return (candidate.updatedAt || 0) > (prev.updatedAt || 0);
}

type UnrankedLeaderboardRow = Omit<LeaderboardRowEntry, 'rank' | 'cupContributionPoints'>;

function dedupeCloudEntries(
  raw: ReadonlyArray<CloudLeaderboardEntry>
): CloudLeaderboardEntry[] {
  const result: CloudLeaderboardEntry[] = [];
  const byUid = new Map<string, number>();
  const byCode = new Map<string, number>();

  for (const ce of raw) {
    if (!ce) continue;
    const uid = (ce.userId || '').trim();
    const code = normalizeValidFriendCode(ce.friendCode);
    const usableCode = code && !code.startsWith('FLOO-') ? code : '';
    const existingIdx =
      (uid ? byUid.get(uid) : undefined) ??
      (usableCode ? byCode.get(usableCode) : undefined);

    if (existingIdx === undefined) {
      const idx = result.length;
      result.push(ce);
      if (uid) byUid.set(uid, idx);
      if (usableCode) byCode.set(usableCode, idx);
      continue;
    }

    const prev = result[existingIdx];
    const nextBest = isBetterCloudEntry(ce, prev) ? ce : prev;
    const other = nextBest === ce ? prev : ce;
    const merged: CloudLeaderboardEntry = {
      ...nextBest,
      name: (nextBest.name || '').trim() || other.name,
      avatarUrl: nextBest.avatarUrl || other.avatarUrl,
      friendCode:
        normalizeValidFriendCode(nextBest.friendCode) ||
        normalizeValidFriendCode(other.friendCode) ||
        nextBest.friendCode,
    };
    result[existingIdx] = merged;
    if (uid) byUid.set(uid, existingIdx);
    if (usableCode) byCode.set(usableCode, existingIdx);
    const prevUid = (prev.userId || '').trim();
    const prevCode = normalizeValidFriendCode(prev.friendCode);
    if (prevUid) byUid.set(prevUid, existingIdx);
    if (prevCode && !prevCode.startsWith('FLOO-')) byCode.set(prevCode, existingIdx);
  }

  return result;
}

function buildNeighborLeaderboardEntry(
  neighbor: NeighborProfileState,
  gameId: LeaderboardGameId,
  activeWeekKey: string,
  cloudMatch?: CloudLeaderboardEntry
): UnrankedLeaderboardRow {
  if (cloudMatch) {
    const m = extractCloudWeeklyMetrics(cloudMatch);
    const resolvedHouse: HouseName =
      cloudMatch.house && ALL_HOGWARTS_HOUSES.includes(cloudMatch.house)
        ? cloudMatch.house
        : neighbor.house || 'Gryffindor';
    return {
      id: `friend:${neighbor.id}`,
      weekKey: activeWeekKey,
      name: (cloudMatch.name || '').trim() || neighbor.name,
      titleVi: neighbor.titleVi || 'Người Chơi Thật • Hàng Xóm',
      parkName: (cloudMatch.parkName || '').trim() || neighbor.parkName,
      friendCode: normalizeValidFriendCode(cloudMatch.friendCode) || neighbor.friendCode,
      avatarEmoji: cloudMatch.avatarEmoji || neighbor.avatarEmoji || '🧙',
      avatarUrl: cloudMatch.avatarUrl || neighbor.avatarUrl,
      portraitSprite: neighbor.portraitSprite,
      house: resolvedHouse,
      isPlayer: false,
      isFriend: true,
      isCloudPlayer: true,
      neighborId: neighbor.id,
      primaryValue: m.weeklyCleared,
      primaryDisplayVi: formatWeeklyStagesDisplayVi(gameId, m.weeklyCleared),
      ratingScore: m.weeklyScore,
      ratingDisplayVi: `${m.weeklyScore.toLocaleString('vi-VN')} đ`,
      totalWins: m.weeklyWins,
      bestStreak: m.bestStreak,
      detailDisplayVi:
        cloudMatch.detailLabelVi || formatDetailDisplayVi(gameId, m.weeklyWins, m.bestStreak),
      ...(m.allTimeBestStage !== undefined
        ? {
            allTimeBestStage: m.allTimeBestStage,
            allTimeStageDisplayVi: formatAllTimeStageDisplayVi(gameId, m.allTimeBestStage),
          }
        : {}),
      league: getLeaderboardLeagueBadge(gameId, m.weeklyCleared),
    };
  }

  // Người chơi thật trong danh bạ nhưng chưa có điểm tuần ở bộ môn này -> hiển thị 0 thật (không bịa điểm ảo)
  return {
    id: `friend:${neighbor.id}`,
    weekKey: activeWeekKey,
    name: neighbor.name,
    titleVi: neighbor.titleVi || 'Người Chơi Thật • Hàng Xóm',
    parkName: neighbor.parkName,
    friendCode: neighbor.friendCode,
    avatarEmoji: neighbor.avatarEmoji || '🧙',
    avatarUrl: neighbor.avatarUrl,
    portraitSprite: neighbor.portraitSprite,
    house: neighbor.house,
    isPlayer: false,
    isFriend: true,
    neighborId: neighbor.id,
    primaryValue: 0,
    primaryDisplayVi: formatWeeklyStagesDisplayVi(gameId, 0),
    ratingScore: 0,
    ratingDisplayVi: '0 đ',
    totalWins: 0,
    bestStreak: 0,
    detailDisplayVi: 'Chưa ghi điểm tuần này',
    league: getLeaderboardLeagueBadge(gameId, 0),
  };
}

export function buildPlayerLeaderboardEntry(
  state: GameState,
  gameId: LeaderboardGameId,
  selfCloud?: CloudLeaderboardEntry,
  nowMs?: number
): UnrankedLeaderboardRow {
  const activeWeekKey = getActiveLeaderboardWeekKey(nowMs, gameId);
  const lb = ensureMinigameLeaderboardState(state, nowMs);
  const rec = lb.records[gameId];
  const weekly = ensureWeeklyProgressRecord(rec, activeWeekKey);
  const friendCode = state.neighborSocial?.playerFriendCode || 'HS-YOU1-01';
  const house = getPlayerHogwartsHouse(state);
  const baseDisplayName =
    identity?.displayName?.trim() ||
    selfCloud?.name?.trim() ||
    state.neighborSocial?.playerDisplayName?.trim() ||
    state.parkName ||
    'Trang Trại Hang Sóc';

  const validSelfCloud =
    selfCloud && isCloudEntryInActiveWeek(selfCloud, activeWeekKey)
      ? extractCloudWeeklyMetrics(selfCloud)
      : null;

  const primaryValue = Math.max(weekly.stagesCleared, validSelfCloud?.weeklyCleared ?? 0);
  const ratingScore = Math.max(weekly.weightedScore, validSelfCloud?.weeklyScore ?? 0);
  const totalWins = Math.max(weekly.wins, validSelfCloud?.weeklyWins ?? 0);
  const bestStreak = Math.max(weekly.bestStreak, validSelfCloud?.bestStreak ?? 0);
  const allTimeBestStage = Math.max(rec.bestStage, validSelfCloud?.allTimeBestStage ?? 0);
  const playerTitle =
    state.level >= 80
      ? 'Đại Điền Chủ Thung Lũng'
      : state.level >= 40
        ? 'Phù Thủy Kiến Thiết Cấp Cao'
        : state.level >= 15
          ? 'Chủ Trang Trại Đang Lên'
          : 'Tân Phù Thủy Hang Sóc';

  return {
    id: 'player:self',
    weekKey: activeWeekKey,
    name: `${baseDisplayName} (Bạn)`,
    titleVi: `${playerTitle} • Cấp ${state.level}`,
    parkName: state.parkName || 'Trang Trại Hang Sóc',
    friendCode,
    avatarEmoji: '🧙‍♂️',
    avatarUrl: state.neighborSocial?.playerAvatarUrl || selfCloud?.avatarUrl,
    house,
    isPlayer: true,
    isFriend: true,
    primaryValue,
    primaryDisplayVi: formatWeeklyStagesDisplayVi(gameId, primaryValue),
    ratingScore,
    ratingDisplayVi: `${ratingScore.toLocaleString('vi-VN')} đ`,
    totalWins,
    bestStreak,
    detailDisplayVi: formatDetailDisplayVi(
      gameId,
      totalWins,
      bestStreak,
      rec.bestEfficiency
    ),
    allTimeBestStage,
    allTimeStageDisplayVi: formatAllTimeStageDisplayVi(gameId, allTimeBestStage),
    league: getLeaderboardLeagueBadge(gameId, primaryValue),
  };
}

function compareEntries(
  a: UnrankedLeaderboardRow,
  b: UnrankedLeaderboardRow
): number {
  // Khớp 100% Cúp Nhà Cách A: xếp hạng tuần theo Điểm Tuần có trọng số độ khó trước, hòa mới xét số màn tuần
  if (b.ratingScore !== a.ratingScore) return b.ratingScore - a.ratingScore;
  if (b.primaryValue !== a.primaryValue) return b.primaryValue - a.primaryValue;
  if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
  if (a.isPlayer !== b.isPlayer) return a.isPlayer ? -1 : 1;
  return a.id.localeCompare(b.id);
}

export function buildHouseCupStandings(
  state: GameState,
  entries: ReadonlyArray<Pick<LeaderboardRowEntry, 'house' | 'primaryValue' | 'totalWins'>>
): HouseCupStanding[] {
  const playerHouse = getPlayerHogwartsHouse(state);
  const map = new Map<
    HouseName,
    {
      house: HouseName;
      members: number;
      totalPrimaryValue: number;
      totalWins: number;
      points: number;
    }
  >();

  for (const h of ALL_HOGWARTS_HOUSES) {
    const valleyBonus = houseWeekPoints(h); // HPVN: the server's week total, the only house points
    map.set(h, {
      house: h,
      members: 0,
      totalPrimaryValue: 0,
      totalWins: 0,
      points: valleyBonus,
    });
  }

  for (const row of entries) {
    const h: HouseName = ALL_HOGWARTS_HOUSES.includes(row.house) ? row.house : 'Gryffindor';
    const rec = map.get(h)!;
    rec.members += 1;
    rec.totalPrimaryValue += Math.max(0, row.primaryValue);
    rec.totalWins += Math.max(0, row.totalWins);
  }

  const rawList = ALL_HOGWARTS_HOUSES.map((h) => map.get(h)!).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
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
    totalWins: item.totalWins,
    points: item.points,
    fillPercent:
      item.points <= 0
        ? 10
        : Math.max(12, Math.min(100, Math.round((item.points / maxPts) * 100))),
    isPlayerHouse: item.house === playerHouse,
  }));
}

function buildRawPoolForScoredGame(
  state: GameState,
  gameId: LeaderboardGameId,
  scope: Exclude<LeaderboardScope, 'personal'>,
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>,
  nowMs?: number
): Array<UnrankedLeaderboardRow> {
  const activeWeekKey = getActiveLeaderboardWeekKey(nowMs, gameId);
  const effectiveCloud = (extraCloudEntries ?? cloudEntriesMemoryCache[gameId] ?? []).filter(
    (ce) => ce && isCloudEntryInActiveWeek(ce, activeWeekKey)
  );
  const dedupedCloud = dedupeCloudEntries(effectiveCloud);

  const cloudByCode = new Map<string, CloudLeaderboardEntry>();
  const cloudByUid = new Map<string, CloudLeaderboardEntry>();
  const cloudByUidSlug = new Map<string, CloudLeaderboardEntry>();
  const cloudHandleCount = new Map<string, number>();
  const cloudByHandleCandidate = new Map<string, CloudLeaderboardEntry>();

  for (const ce of dedupedCloud) {
    const uid = (ce.userId || '').trim();
    const slug = toUidSlug(uid);
    const code = normalizeValidFriendCode(ce.friendCode);
    const handle = normalizeMemberHandle(ce.name);
    if (uid && !cloudByUid.has(uid)) cloudByUid.set(uid, ce);
    if (slug && !cloudByUidSlug.has(slug)) cloudByUidSlug.set(slug, ce);
    if (code && !code.startsWith('FLOO-') && !cloudByCode.has(code)) {
      cloudByCode.set(code, ce);
    }
    if (handle) {
      cloudHandleCount.set(handle, (cloudHandleCount.get(handle) ?? 0) + 1);
      if (!cloudByHandleCandidate.has(handle)) cloudByHandleCandidate.set(handle, ce);
    }
  }
  const cloudByHandle = new Map<string, CloudLeaderboardEntry>();
  for (const [handle, ce] of cloudByHandleCandidate) {
    if (cloudHandleCount.get(handle) === 1) {
      cloudByHandle.set(handle, ce);
    }
  }

  const localUid = getClientLeaderboardUserId().trim();
  const hasRealLocalUid = Boolean(localUid && localUid !== 'local_player');
  const localSlug = toUidSlug(localUid);
  const selfCloud = hasRealLocalUid
    ? (cloudByUid.get(localUid) ?? (localSlug ? cloudByUidSlug.get(localSlug) : undefined))
    : undefined;
  const playerRaw = buildPlayerLeaderboardEntry(state, gameId, selfCloud, nowMs);
  const playerCode = normalizeValidFriendCode(playerRaw.friendCode);
  const selfHandle = normalizeMemberHandle(identity?.displayName);

  const rawNeighbors = (state.neighborSocial?.neighbors ?? []).filter(
    (n) => !isNpcNeighborProfile(n)
  );
  const seenFriendUids = new Set<string>();
  const seenFriendSlugs = new Set<string>();
  const seenFriendCodes = new Set<string>();
  const neighbors: NeighborProfileState[] = [];

  for (const n of rawNeighbors) {
    const nUid = (n.remoteUserId || '').trim();
    const nSlug = toUidSlug(nUid || (n.id.startsWith('floo_') ? n.id.slice(5) : ''));
    const nCode = normalizeValidFriendCode(n.friendCode);
    if (
      (hasRealLocalUid && (nUid === localUid || (nSlug && nSlug === localSlug))) ||
      (playerCode && nCode === playerCode)
    ) {
      continue;
    }
    if (
      (nUid && seenFriendUids.has(nUid)) ||
      (nSlug && seenFriendSlugs.has(nSlug)) ||
      (nCode && seenFriendCodes.has(nCode))
    ) {
      continue;
    }
    neighbors.push(n);
    if (nUid) seenFriendUids.add(nUid);
    if (nSlug) seenFriendSlugs.add(nSlug);
    if (nCode) seenFriendCodes.add(nCode);
  }

  const matchedCloudRefs = new Set<CloudLeaderboardEntry>();
  const friendUidSet = new Set<string>();
  const friendUidSlugSet = new Set<string>();
  const friendCodeSet = new Set<string>();

  const friendEntries = neighbors.map((n) => {
    const nUid = (n.remoteUserId || '').trim();
    const nSlug = toUidSlug(nUid || (n.id.startsWith('floo_') ? n.id.slice(5) : ''));
    const nCode = normalizeValidFriendCode(n.friendCode);
    if (nUid) friendUidSet.add(nUid);
    if (nSlug) friendUidSlugSet.add(nSlug);
    if (nCode) friendCodeSet.add(nCode);

    let cMatch =
      (nUid ? cloudByUid.get(nUid) : undefined) ??
      (nSlug ? cloudByUidSlug.get(nSlug) : undefined) ??
      (nCode && !nCode.startsWith('FLOO-') ? cloudByCode.get(nCode) : undefined) ??
      ((n.isVerifiedPlayer || n.id.startsWith('floo_')) && !nUid
        ? cloudByHandle.get(normalizeMemberHandle(n.name))
        : undefined);

    if (
      cMatch &&
      ((hasRealLocalUid && cMatch.userId.trim() === localUid) || matchedCloudRefs.has(cMatch))
    ) {
      cMatch = undefined;
    }

    if (cMatch) {
      matchedCloudRefs.add(cMatch);
      const cUid = cMatch.userId.trim();
      if (cUid) {
        friendUidSet.add(cUid);
        const cSlug = toUidSlug(cUid);
        if (cSlug) friendUidSlugSet.add(cSlug);
      }
      const cCode = normalizeValidFriendCode(cMatch.friendCode);
      if (cCode) friendCodeSet.add(cCode);
    }

    return buildNeighborLeaderboardEntry(n, gameId, activeWeekKey, cMatch);
  });

  const pool: Array<UnrankedLeaderboardRow> = [playerRaw, ...friendEntries];

  if (scope === 'valley') {
    for (const ce of dedupedCloud) {
      const ceUid = (ce?.userId || '').trim();
      if (!ce || !ceUid) continue;
      if (matchedCloudRefs.has(ce)) continue;
      const ceSlug = toUidSlug(ceUid);
      if (hasRealLocalUid && (ceUid === localUid || (ceSlug && ceSlug === localSlug))) {
        continue;
      }
      if (hasRealLocalUid && selfHandle && normalizeMemberHandle(ce.name) === selfHandle) {
        continue;
      }
      if (friendUidSet.has(ceUid) || (ceSlug && friendUidSlugSet.has(ceSlug))) {
        continue;
      }
      const normCode = normalizeValidFriendCode(ce.friendCode);
      if (normCode !== '' && (normCode === playerCode || friendCodeSet.has(normCode))) {
        continue;
      }
      const m = extractCloudWeeklyMetrics(ce);
      pool.push({
        id: `cloud:${ceUid}`,
        weekKey: activeWeekKey,
        name: ce.name || ce.parkName || 'Người Chơi Trực Tuyến',
        titleVi: 'Người Chơi Thật Trực Tuyến',
        parkName: ce.parkName || 'Điền Trang Phép Thuật',
        friendCode: ce.friendCode || 'HS-CLUD-00',
        avatarEmoji: ce.avatarEmoji || '🌐',
        avatarUrl: ce.avatarUrl,
        house: ce.house || 'Gryffindor',
        isPlayer: false,
        isFriend: false,
        isCloudPlayer: true,
        primaryValue: m.weeklyCleared,
        primaryDisplayVi: formatWeeklyStagesDisplayVi(gameId, m.weeklyCleared),
        ratingScore: m.weeklyScore,
        ratingDisplayVi: `${m.weeklyScore.toLocaleString('vi-VN')} đ`,
        totalWins: m.weeklyWins,
        bestStreak: m.bestStreak,
        detailDisplayVi:
          ce.detailLabelVi ||
          formatDetailDisplayVi(gameId, m.weeklyWins, m.bestStreak),
        ...(m.allTimeBestStage !== undefined
          ? {
              allTimeBestStage: m.allTimeBestStage,
              allTimeStageDisplayVi: formatAllTimeStageDisplayVi(gameId, m.allTimeBestStage),
            }
          : {}),
        league: getLeaderboardLeagueBadge(gameId, m.weeklyCleared),
      });
    }
  }

  return pool;
}

function buildUnifiedHouseCupStandings(
  state: GameState,
  scope: Exclude<LeaderboardScope, 'personal'>,
  activeGameId: LeaderboardGameId,
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>,
  nowMs?: number
): HouseCupStanding[] {
  const playerHouse = getPlayerHogwartsHouse(state);
  const map = new Map<
    HouseName,
    {
      house: HouseName;
      memberKeys: Set<string>;
      totalPrimaryValue: number;
      totalWins: number;
      points: number;
    }
  >();

  for (const h of ALL_HOGWARTS_HOUSES) {
    const valleyBonus = houseWeekPoints(h); // HPVN: the server's week total, the only house points
    map.set(h, {
      house: h,
      memberKeys: new Set<string>(),
      totalPrimaryValue: 0,
      totalWins: 0,
      points: valleyBonus,
    });
  }

  for (const gid of SCORED_LEADERBOARD_GAMES) {
    const gPool = buildRawPoolForScoredGame(
      state,
      gid,
      scope,
      gid === activeGameId ? extraCloudEntries : undefined,
      nowMs
    );
    for (const row of gPool) {
      const h: HouseName = ALL_HOGWARTS_HOUSES.includes(row.house) ? row.house : 'Gryffindor';
      const rec = map.get(h)!;
      const memberKey = row.isPlayer ? 'self' : row.id;
      rec.memberKeys.add(memberKey);
      rec.totalPrimaryValue += Math.max(0, row.primaryValue);
      rec.totalWins += Math.max(0, row.totalWins);
    }
  }

  const rawList = ALL_HOGWARTS_HOUSES.map((h) => {
    const item = map.get(h)!;
    return {
      house: item.house,
      members: item.memberKeys.size,
      totalPrimaryValue: item.totalPrimaryValue,
      totalWins: item.totalWins,
      points: item.points,
    };
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
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
  houseFilter: 'all' | HouseName = 'all',
  nowMs?: number
): LeaderboardStandingResult {
  const gameId = normalizeScoredLeaderboardGame(rawGameId);
  const weekKey = getActiveLeaderboardWeekKey(nowMs, gameId);
  const pool = buildRawPoolForScoredGame(state, gameId, scope, extraCloudEntries, nowMs);
  pool.sort(compareEntries);

  const houseStandings = buildUnifiedHouseCupStandings(
    state,
    scope,
    gameId,
    extraCloudEntries,
    nowMs
  );

  // Tính điểm đóng góp cho Nhà theo đúng công thức Cúp Nhà Cách A (rankAndScoreDisciplineFromWeeklyPlayers):
  // chỉ tính hạng trong nhóm người chơi đã vượt >= minStages (mặc định 5) màn mới trong tuần, đồng điểm cùng hạng.
  const minStages = houseCupMinStagesForPoints();
  const rankTiers = houseCupRankTiers();
  let qualifiedRank = 0;
  let qualifiedCount = 0;
  let prevQualifiedScore = -1;
  const fullEntries: LeaderboardRowEntry[] = pool.map((item, idx) => {
    let cupContributionPoints = 0;
    if (item.primaryValue >= minStages) {
      qualifiedCount += 1;
      if (item.ratingScore !== prevQualifiedScore) {
        qualifiedRank = qualifiedCount;
        prevQualifiedScore = item.ratingScore;
      }
      cupContributionPoints = computeHousePointsForLeaderboardRank(
        qualifiedRank,
        item.primaryValue,
        minStages,
        rankTiers
      );
    }
    return {
      ...item,
      rank: idx + 1,
      cupContributionPoints,
    };
  });

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
    weekKey,
    isLegacyCloudFallback:
      extraCloudEntries === undefined ? Boolean(cloudBoardLegacyFlagCache[gameId]) : false,
    entries: filteredEntries,
    playerEntry,
    playerRank: playerEntry.rank,
    totalEntries: fullEntries.length,
    nextRivalAbove,
    houseStandings,
    playerHouse: playerEntry.house,
    activeHouseFilter: houseFilter,
  };
}

export function buildAllPersonalRecordsSummary(
  state: GameState,
  cloudCache?: Partial<Record<LeaderboardGameId, CloudLeaderboardEntry[]>>,
  nowMs?: number
): PersonalDisciplineSummaryRow[] {
  const lb = ensureMinigameLeaderboardState(state, nowMs);
  return ALL_LEADERBOARD_GAMES.map((gid) => {
    const valley = buildMinigameLeaderboard(state, gid, 'valley', cloudCache?.[gid], 'all', nowMs);
    const friends = buildMinigameLeaderboard(state, gid, 'friends', cloudCache?.[gid], 'all', nowMs);
    const rec = lb.records[gid];
    const allTimeBestStage = Math.max(rec.bestStage, valley.playerEntry.allTimeBestStage ?? 0);
    return {
      gameId: gid,
      meta: LEADERBOARD_GAME_META[gid],
      weekKey: valley.weekKey,
      valleyRank: valley.playerRank,
      valleyTotal: valley.totalEntries,
      friendsRank: friends.playerRank,
      friendsTotal: friends.totalEntries,
      primaryDisplayVi: valley.playerEntry.primaryDisplayVi,
      ratingDisplayVi: valley.playerEntry.ratingDisplayVi,
      detailDisplayVi: valley.playerEntry.detailDisplayVi,
      allTimeBestStage,
      allTimeStageDisplayVi: formatAllTimeStageDisplayVi(gid, allTimeBestStage),
      cupContributionPoints: valley.playerEntry.cupContributionPoints,
      bestSessionScore: rec.bestSessionScore,
      league: valley.playerEntry.league,
    };
  });
}

export interface MinigameSessionMetricInput {
  previousClearedStage?: number;
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
  // Đủ 6 game mini (Bùa Gặt, Dò Mìn, Số Học, Bắn Cá, Sinh Vật, Tranh Ghép) đều tính điểm BXH Tuần & Cúp 4 Nhà
  if (!isScoredLeaderboardGame(gameId)) {
    const playerHouse = getPlayerHogwartsHouse(state);
    return {
      gameId,
      previousRank: 1,
      newRank: 1,
      rankUpBy: 0,
      totalEntries: 1,
      playerHouse,
      houseRank: 1,
    };
  }

  // Ghi nhận bestStage trước khi ensureMinigameLeaderboardState đồng bộ từ state (vốn có thể đã cộng màn mới)
  const existingRecordBeforeEnsure = state.minigameLeaderboard?.records?.[gameId];
  const existingBestStageBeforeEnsure = existingRecordBeforeEnsure?.bestStage;
  const activeWeekKey = getActiveLeaderboardWeekKey(input.nowMs, gameId);
  const sameWeekAsSnapshot = existingRecordBeforeEnsure?.weekly?.weekKey === activeWeekKey;

  const previousRankFromSnapshot =
    input.previousRankOverride && input.previousRankOverride > 0
      ? input.previousRankOverride
      : sameWeekAsSnapshot
        ? existingRecordBeforeEnsure?.lastRankValley
        : undefined;

  const beforeStanding = !previousRankFromSnapshot
    ? buildMinigameLeaderboard(state, gameId, 'valley', undefined, 'all', input.nowMs)
    : null;
  const lb = ensureMinigameLeaderboardState(state, input.nowMs);
  const rec = lb.records[gameId];
  const weekly = ensureWeeklyProgressRecord(rec, activeWeekKey);
  const previousRank = previousRankFromSnapshot ?? beforeStanding?.playerRank ?? 1;

  const baseAfter = deriveBaseRecordFromState(state, gameId);
  const prevBestStage =
    input.previousClearedStage !== undefined && Number.isFinite(input.previousClearedStage)
      ? Math.max(0, Math.floor(input.previousClearedStage))
      : existingBestStageBeforeEnsure !== undefined
        ? Math.max(0, Math.floor(existingBestStageBeforeEnsure))
        : 0;
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
    if (gameId === 'sudoku' || gameId === 'caro') {
      // Lower mistakes (Sudoku) or fewer moves (Dò Mìn) is better!
      if (rec.bestEfficiency === undefined || eff < rec.bestEfficiency) {
        rec.bestEfficiency = eff;
      }
    } else {
      // Higher combo / score is better!
      rec.bestEfficiency = Math.max(rec.bestEfficiency ?? 0, eff);
    }
  }

  // Recompute all-time personal composite score (kept for backwards save compatibility)
  const effBonus =
    gameId === 'sudoku'
      ? rec.bestEfficiency !== undefined
        ? Math.max(0, (5 - rec.bestEfficiency) * 90)
        : 0
      : gameId === 'caro'
        ? rec.bestEfficiency !== undefined
          ? Math.max(0, Math.min(250, 260 - rec.bestEfficiency * 3))
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

  // Cập nhật điểm tuần Cách A khớp 100% Cúp Nhà (20 / 25 / 30 / 35 đ/màn theo khung độ khó màn vượt mới)
  const maxStage = gameId === 'match3' ? MAX_MATCH3_STAGE : MAX_PUZZLE_TOWER_STAGE;
  const stageBands = houseCupStageScoreBands();
  if (nextBestStage > prevBestStage) {
    const progress = computeWeeklyStageProgressScore(prevBestStage, nextBestStage, 10, stageBands);
    weekly.stagesCleared += progress.deltaStages;
    weekly.weightedScore += progress.weightedScore;
  } else if (prevBestStage >= maxStage) {
    // Người chơi đã chạm đỉnh tháp (777 / 7777): chơi thắng lại màn đỉnh vẫn ghi 1 màn tuần theo khung cao nhất
    weekly.stagesCleared += 1;
    weekly.weightedScore += computeStageDifficultyPoints(maxStage, stageBands);
  }
  weekly.wins += 1;
  weekly.bestStreak = Math.max(weekly.bestStreak, Math.floor(input.streak ?? 0), 1);
  if (sessionScore > 0) {
    weekly.bestSessionScore = Math.max(weekly.bestSessionScore, sessionScore);
  }
  const nowTs = input.nowMs ?? Date.now();
  weekly.updatedAt = nowTs;
  rec.updatedAt = nowTs;

  // HPVN: no house points here: the server awards them from the saved wins (trang-trai-hang-soc-boards.js)
  const playerHouse = getPlayerHogwartsHouse(state);

  const afterStanding = buildMinigameLeaderboard(state, gameId, 'valley', undefined, 'all', input.nowMs);
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
    playerHouse,
    houseRank,
  };
}

export function getClientLeaderboardUserId(): string {
  return identity?.uid ?? 'local_player';
}

export function getCachedCloudLeaderboardEntries(
  gameId: LeaderboardGameId
): CloudLeaderboardEntry[] {
  return cloudEntriesMemoryCache[gameId] ?? [];
}

export function setCachedCloudLeaderboardEntries(
  gameId: LeaderboardGameId,
  entries: ReadonlyArray<CloudLeaderboardEntry>,
  weekKey?: string
): void {
  cloudEntriesMemoryCache[gameId] = [...entries];
  cloudBoardLegacyFlagCache[gameId] = false;
  if (typeof weekKey === 'string' && weekKey.trim()) {
    cloudBoardWeekKeyCache[gameId] = weekKey.trim();
  }
}

export function isCloudLeaderboardLegacyFallback(gameId: LeaderboardGameId): boolean {
  return Boolean(cloudBoardLegacyFlagCache[gameId]);
}

export function clearCachedCloudLeaderboards(): void {
  for (const gid of ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw', 'seedquiz'] as const) {
    delete cloudEntriesMemoryCache[gid];
    delete cloudBoardWeekKeyCache[gid];
    delete cloudBoardLegacyFlagCache[gid];
  }
}

export function getAllCachedCloudLeaderboards(): Partial<
  Record<LeaderboardGameId, CloudLeaderboardEntry[]>
> {
  return cloudEntriesMemoryCache;
}

interface CloudBoardReply {
  period?: string;
  weekKey?: string;
  cycleKey?: string;
  entries?: CloudLeaderboardEntry[];
}

// HPVN: the boards come from the HPVN server (trangTraiHangSoc op 'board'), which ranks each member's
// weekly Cách A progress matching Cúp Nhà; the page never posts a score.
export async function fetchCloudLeaderboardEntries(gameId: LeaderboardGameId): Promise<CloudLeaderboardEntry[]> {
  if (!isScoredLeaderboardGame(gameId) || !identity) return cloudEntriesMemoryCache[gameId] ?? [];
  const requestedWeekKey = getActiveLeaderboardWeekKey(undefined, gameId);
  try {
    const result = await request<CloudBoardReply>('farm', {
      op: 'board',
      game: gameId,
      period: 'weekly',
      weekKey: requestedWeekKey,
    });
    if (Array.isArray(result?.entries)) {
      const respWeekKey = typeof result.weekKey === 'string' ? result.weekKey.trim() : '';
      const hasWeeklyMarker =
        result.period === 'weekly' ||
        Boolean(respWeekKey) ||
        result.entries.length === 0 ||
        result.entries.some(
          (e) =>
            (typeof e?.weekKey === 'string' && e.weekKey.trim().length > 0) ||
            typeof e?.weeklyScore === 'number' ||
            typeof e?.weeklyCleared === 'number'
        );

      if (hasWeeklyMarker) {
        cloudBoardLegacyFlagCache[gameId] = false;
        if (respWeekKey && respWeekKey.toLowerCase() !== 'local') {
          cloudBoardWeekKeyCache[gameId] = respWeekKey;
        }
        cloudEntriesMemoryCache[gameId] = respWeekKey
          ? result.entries.map((e) => (e.weekKey ? e : { ...e, weekKey: respWeekKey }))
          : result.entries;
      } else {
        // Máy chủ chưa bật patch BXH tuần (trả BXH tổng theo level cũ): không trộn điểm tổng vào BXH tuần
        cloudBoardLegacyFlagCache[gameId] = true;
        cloudEntriesMemoryCache[gameId] = [];
      }
    }
  } catch {
    // keep the last board
  }
  return cloudEntriesMemoryCache[gameId] ?? [];
}

/** HPVN: «submit» sends the pending farm save now, so the server ranks the latest weekly scores. */
export async function submitPlayerCloudLeaderboardEntry(_state: GameState, _gameId: LeaderboardGameId): Promise<void> {
  if (identity) await flushFarmSave();
}
