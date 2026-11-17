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
import { MAX_MATCH3_STAGE } from '../data/match3Levels';
import { flushFarmSave, identity, request } from '../hpvn/bridge';
import { houseWeekPoints } from '../hpvn/houseCup';

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
    cupTitleVi: 'Cúp Đại Sư Bùa Gặt Honeydukes (7.777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh vượt qua, Điểm Bùa Gặt & Chuỗi Thắng Liên Tiếp',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Phép',
    detailColVi: 'Thắng & Chuỗi',
  },
  caro: {
    id: 'caro',
    icon: '🗺️',
    spriteIcon: '/game/trang-trai-hang-soc/paintings/caro/phoenix_seal.webp',
    shortVi: 'Ngũ Ấn Đạo Tặc',
    tabVi: 'Ngũ Ấn',
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
    spriteIcon: '/game/trang-trai-hang-soc/sprites/m3_piece_scroll.webp',
    shortVi: 'Số Học Huyền Bí',
    tabVi: 'Số Học',
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
    spriteIcon: '/game/trang-trai-hang-soc/paintings/chess/wk.webp?v=stone',
    shortVi: 'Cờ Phù Thủy',
    tabVi: 'Cờ Phù Thủy',
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
    spriteIcon: '/game/trang-trai-hang-soc/sprites/beast_niffler.webp',
    shortVi: 'Sinh Vật Huyền Bí',
    tabVi: 'Sinh Vật',
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
    spriteIcon: '/game/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp',
    shortVi: 'Tranh Ghép Phép Thuật',
    tabVi: 'Tranh Ghép',
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
  avatarUrl?: string;
  portraitSprite?: string;
  house: HouseName;
  isPlayer: boolean;
  isFriend: boolean;
  isCloudPlayer?: boolean;
  neighborId?: string;
  primaryValue: number;
  primaryDisplayVi: string;
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
}

export interface PersonalDisciplineSummaryRow {
  gameId: LeaderboardGameId;
  meta: LeaderboardGameMeta;
  valleyRank: number;
  valleyTotal: number;
  friendsRank: number;
  friendsTotal: number;
  primaryDisplayVi: string;
  ratingDisplayVi: string;
  detailDisplayVi: string;
  bestSessionScore: number;
  league: LeaderboardLeagueBadge;
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

  if (gameId === 'match3') {
    if (primaryValue >= MAX_MATCH3_STAGE) {
      return { tierId: 'legend', icon: '👑', labelVi: 'Huyền Thoại 7777' };
    }
    if (primaryValue >= 777) {
      return { tierId: 'legend', icon: '👑', labelVi: 'Huyền Thoại 777+' };
    }
  } else if (primaryValue >= MAX_PUZZLE_TOWER_STAGE) {
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

function formatPrimaryDisplayVi(gameId: LeaderboardGameId, primaryVal: number): string {
  if (gameId === 'seedquiz') {
    return `${primaryVal.toLocaleString('vi-VN')} câu đúng`;
  }
  const maxStage = gameId === 'match3' ? MAX_MATCH3_STAGE : MAX_PUZZLE_TOWER_STAGE;
  if (primaryVal >= maxStage) {
    return `👑 ${maxStage}/${maxStage}`;
  }
  return `Màn ${primaryVal}/${maxStage}`;
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

function isBetterCloudEntry(
  candidate: CloudLeaderboardEntry,
  prev: CloudLeaderboardEntry
): boolean {
  const cPv = Math.max(0, Math.floor(candidate.primaryValue || 0));
  const pPv = Math.max(0, Math.floor(prev.primaryValue || 0));
  if (cPv !== pPv) return cPv > pPv;
  const cRs = Math.max(0, Math.floor(candidate.ratingScore || 0));
  const pRs = Math.max(0, Math.floor(prev.ratingScore || 0));
  if (cRs !== pRs) return cRs > pRs;
  const cTw = Math.max(0, Math.floor(candidate.totalWins || 0));
  const pTw = Math.max(0, Math.floor(prev.totalWins || 0));
  if (cTw !== pTw) return cTw > pTw;
  return (candidate.updatedAt || 0) > (prev.updatedAt || 0);
}

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
  cloudMatch?: CloudLeaderboardEntry
): Omit<LeaderboardRowEntry, 'rank'> {
  if (cloudMatch) {
    const pv = Math.max(0, Math.floor(cloudMatch.primaryValue || 0));
    const rs = Math.max(0, Math.floor(cloudMatch.ratingScore || 0));
    const tw = Math.max(0, Math.floor(cloudMatch.totalWins || 0));
    const bs = Math.max(0, Math.floor(cloudMatch.bestStreak || 0));
    const resolvedHouse: HouseName =
      cloudMatch.house && ALL_HOGWARTS_HOUSES.includes(cloudMatch.house)
        ? cloudMatch.house
        : neighbor.house || 'Gryffindor';
    return {
      id: `friend:${neighbor.id}`,
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
      primaryValue: pv,
      primaryDisplayVi: formatPrimaryDisplayVi(gameId, pv),
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
    avatarUrl: neighbor.avatarUrl,
    portraitSprite: neighbor.portraitSprite,
    house: neighbor.house,
    isPlayer: false,
    isFriend: true,
    neighborId: neighbor.id,
    primaryValue: 0,
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, 0),
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
  gameId: LeaderboardGameId,
  selfCloud?: CloudLeaderboardEntry
): Omit<LeaderboardRowEntry, 'rank'> {
  const lb = ensureMinigameLeaderboardState(state);
  const rec = lb.records[gameId];
  const friendCode = state.neighborSocial?.playerFriendCode || 'HS-YOU1-01';
  const house = getPlayerHogwartsHouse(state);
  const baseDisplayName =
    identity?.displayName?.trim() ||
    selfCloud?.name?.trim() ||
    state.neighborSocial?.playerDisplayName?.trim() ||
    state.parkName ||
    'Trang Trại Hang Sóc';
  const primaryValue = Math.max(rec.bestStage, Math.max(0, Math.floor(selfCloud?.primaryValue || 0)));
  const ratingScore = Math.max(rec.highScore, Math.max(0, Math.floor(selfCloud?.ratingScore || 0)));
  const totalWins = Math.max(rec.totalWins, Math.max(0, Math.floor(selfCloud?.totalWins || 0)));
  const bestStreak = Math.max(rec.bestStreak, Math.max(0, Math.floor(selfCloud?.bestStreak || 0)));
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
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, primaryValue),
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
    league: getLeaderboardLeagueBadge(gameId, primaryValue),
  };
}

function compareEntries(
  a: Omit<LeaderboardRowEntry, 'rank'>,
  b: Omit<LeaderboardRowEntry, 'rank'>
): number {
  if (b.primaryValue !== a.primaryValue) return b.primaryValue - a.primaryValue;
  if (b.ratingScore !== a.ratingScore) return b.ratingScore - a.ratingScore;
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
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>
): Array<Omit<LeaderboardRowEntry, 'rank'>> {
  const effectiveCloud = extraCloudEntries ?? cloudEntriesMemoryCache[gameId] ?? [];
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
  const playerRaw = buildPlayerLeaderboardEntry(state, gameId, selfCloud);
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

    return buildNeighborLeaderboardEntry(n, gameId, cMatch);
  });

  const pool: Array<Omit<LeaderboardRowEntry, 'rank'>> = [playerRaw, ...friendEntries];

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
      pool.push({
        id: `cloud:${ceUid}`,
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
        primaryValue: Math.max(0, Math.floor(ce.primaryValue || 0)),
        primaryDisplayVi: formatPrimaryDisplayVi(
          gameId,
          Math.max(0, Math.floor(ce.primaryValue || 0))
        ),
        ratingScore: Math.max(0, Math.floor(ce.ratingScore || 0)),
        ratingDisplayVi: `${Math.max(0, Math.floor(ce.ratingScore || 0)).toLocaleString('vi-VN')} đ`,
        totalWins: Math.max(0, Math.floor(ce.totalWins || 0)),
        bestStreak: Math.max(0, Math.floor(ce.bestStreak || 0)),
        detailDisplayVi:
          ce.detailLabelVi ||
          formatDetailDisplayVi(gameId, ce.totalWins || 0, ce.bestStreak || 0),
        league: getLeaderboardLeagueBadge(gameId, Math.max(0, Math.floor(ce.primaryValue || 0))),
      });
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
      gid === activeGameId ? extraCloudEntries : undefined
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
  };
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
      primaryDisplayVi: valley.playerEntry.primaryDisplayVi,
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

  // HPVN: no house points here: the server awards them from the saved wins (trang-trai-hang-soc-boards.js)
  const playerHouse = getPlayerHogwartsHouse(state);

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
    playerHouse,
    houseRank,
  };
}

export function getClientLeaderboardUserId(): string {
  return identity?.uid ?? 'local_player';
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

// HPVN: the boards come from the HPVN server (trangTraiHangSoc op 'board'), which reads each member's scores from
// the farm save it stores; the page never posts a score.
export async function fetchCloudLeaderboardEntries(gameId: LeaderboardGameId): Promise<CloudLeaderboardEntry[]> {
  if (!isScoredLeaderboardGame(gameId) || !identity) return cloudEntriesMemoryCache[gameId] ?? [];
  try {
    const result = await request<{ entries?: CloudLeaderboardEntry[] }>('farm', { op: 'board', game: gameId });
    if (Array.isArray(result?.entries)) cloudEntriesMemoryCache[gameId] = result.entries;
  } catch {
    // keep the last board
  }
  return cloudEntriesMemoryCache[gameId] ?? [];
}

/** HPVN: «submit» sends the pending farm save now, so the server ranks the latest scores. */
export async function submitPlayerCloudLeaderboardEntry(_state: GameState, _gameId: LeaderboardGameId): Promise<void> {
  if (identity) await flushFarmSave();
}
