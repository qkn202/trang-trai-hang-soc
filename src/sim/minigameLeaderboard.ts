import {
  GameState,
  HouseName,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  MinigameLeaderboardState,
  MinigamePersonalRecord,
  NeighborProfileState,
  QuizLanguageId,
} from '../types/game';

export const ALL_LEADERBOARD_GAMES: ReadonlyArray<LeaderboardGameId> = [
  'match3',
  'caro',
  'sudoku',
  'chess',
  'blocks',
  'seedquiz',
];

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
    icon: '🍓',
    spriteIcon: '/sprites/m3_farm_pinwheel.png',
    shortVi: 'Bùa Gặt Honeydukes',
    titleVi: 'Gác Xép Bùa Gặt Honeydukes',
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
    titleVi: 'Trận Pháp Ngũ Ấn Đạo Tặc 13×13',
    cupTitleVi: 'Cúp Chiến Lược Bản Đồ Đạo Tặc (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Trận Pháp & Nước Thắng Nhanh Nhất',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Trận Pháp',
    detailColVi: 'Thắng & Tối Ưu',
  },
  sudoku: {
    id: 'sudoku',
    icon: '🔮',
    spriteIcon: '/paintings/sudoku/relic_1.png',
    shortVi: 'Cửu Bảo Bối',
    titleVi: 'Ma Trận Cửu Bảo Bối 9×9',
    cupTitleVi: 'Cúp Bậc Thầy Giả Kim & Bảo Bối (777 Màn)',
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
    titleVi: 'Cờ Phù Thủy Đại Sảnh Đường 8×8',
    cupTitleVi: 'Cúp Đại Kiện Tướng McGonagall (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Kiện Tướng & Tốc Độ Chiếu Bí',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Kiện Tướng',
    detailColVi: 'Thắng & Chiếu Bí',
  },
  blocks: {
    id: 'blocks',
    icon: '🧱',
    spriteIcon: '/sprites/m3_piece_scroll.png',
    shortVi: 'Khảm Cổ Ngữ',
    titleVi: 'Khảm Đá Cổ Ngữ Runes 8×8',
    cupTitleVi: 'Cúp Điêu Khắc Cổ Ngữ Bắc Âu (777 Màn)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Nổ Runes & Kỷ Lục Hàng Phá',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Cổ Ngữ',
    detailColVi: 'Thắng & Hàng Nổ',
  },
  seedquiz: {
    id: 'seedquiz',
    icon: '🪄',
    spriteIcon: '/sprites/ui_icon_accio.png',
    shortVi: 'Học Viện Thần Chú',
    titleVi: 'Học Viện Thần Chú Đa Ngữ Hogwarts',
    cupTitleVi: 'Cúp Thủ Khoa Cổ Ngữ 5 Bộ Môn (EN • KO • ZH • ES • JA)',
    subtitleVi: 'Xếp hạng theo Tổng Câu Thần Chú Đúng, Điểm Thông Thạo & Từ Thuộc Hộp 5 SRS',
    primaryColVi: 'Thần Chú Đúng',
    secondaryColVi: 'Điểm Thông Thạo',
    detailColVi: 'SRS Hộp 5 & Chuỗi',
  },
};

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

interface WizardingRivalSeed {
  id: string;
  name: string;
  titleVi: string;
  parkName: string;
  friendCode: string;
  avatarEmoji: string;
  portraitSprite?: string;
  house: HouseName;
  stages: Record<LeaderboardGameId, number>;
  bonusScore: Record<LeaderboardGameId, number>;
  streaks: Record<LeaderboardGameId, number>;
  efficiency: Record<LeaderboardGameId, number>;
}

const WIZARDING_VALLEY_RIVALS: ReadonlyArray<WizardingRivalSeed> = [
  {
    id: 'rival_colin',
    name: 'Colin Creevey',
    titleVi: 'Nhiếp Ảnh Gia Tân Binh',
    parkName: ' hiên Nắng Máy Ảnh Phép',
    friendCode: 'HS-CLN1-11',
    avatarEmoji: '📷',
    house: 'Gryffindor',
    stages: { match3: 1, caro: 1, sudoku: 1, chess: 1, blocks: 1, seedquiz: 1 },
    bonusScore: { match3: 180, caro: 150, sudoku: 160, chess: 140, blocks: 170, seedquiz: 95 },
    streaks: { match3: 1, caro: 1, sudoku: 1, chess: 1, blocks: 1, seedquiz: 2 },
    efficiency: { match3: 980, caro: 21, sudoku: 3, chess: 26, blocks: 4, seedquiz: 0 },
  },
  {
    id: 'rival_dean',
    name: 'Dean Thomas',
    titleVi: 'Họa Sĩ Ký Họa Thung Lũng',
    parkName: 'Đồi Cỏ Màu Nước',
    friendCode: 'HS-DEAN-18',
    avatarEmoji: '🎨',
    house: 'Gryffindor',
    stages: { match3: 3, caro: 2, sudoku: 2, chess: 2, blocks: 4, seedquiz: 4 },
    bonusScore: { match3: 420, caro: 310, sudoku: 290, chess: 300, blocks: 520, seedquiz: 240 },
    streaks: { match3: 2, caro: 2, sudoku: 1, chess: 2, blocks: 3, seedquiz: 3 },
    efficiency: { match3: 1650, caro: 18, sudoku: 2, chess: 22, blocks: 7, seedquiz: 1 },
  },
  {
    id: 'rival_hanna',
    name: 'Hannah Abbott',
    titleVi: 'Chủ Quán Cái Vạc Lủng Tương Lai',
    parkName: 'Vườn Hoa Cúc Hufflepuff',
    friendCode: 'HS-HNAH-24',
    avatarEmoji: '🌼',
    house: 'Hufflepuff',
    stages: { match3: 9, caro: 6, sudoku: 8, chess: 5, blocks: 10, seedquiz: 11 },
    bonusScore: { match3: 860, caro: 540, sudoku: 720, chess: 480, blocks: 940, seedquiz: 510 },
    streaks: { match3: 4, caro: 3, sudoku: 3, chess: 2, blocks: 4, seedquiz: 5 },
    efficiency: { match3: 2800, caro: 16, sudoku: 2, chess: 20, blocks: 12, seedquiz: 3 },
  },
  {
    id: 'rival_ginny',
    name: 'Ginny Weasley',
    titleVi: 'Truy Thủ Tia Chớp Hang Sóc',
    parkName: 'Sân Quidditch Đồi Táo',
    friendCode: 'HS-GINY-31',
    avatarEmoji: '⚡',
    portraitSprite: 'villager_ginny',
    house: 'Gryffindor',
    stages: { match3: 26, caro: 28, sudoku: 19, chess: 24, blocks: 22, seedquiz: 22 },
    bonusScore: { match3: 2150, caro: 2340, sudoku: 1520, chess: 1980, blocks: 1890, seedquiz: 980 },
    streaks: { match3: 6, caro: 7, sudoku: 4, chess: 5, blocks: 5, seedquiz: 7 },
    efficiency: { match3: 4900, caro: 13, sudoku: 1, chess: 16, blocks: 19, seedquiz: 7 },
  },
  {
    id: 'rival_cho',
    name: 'Cho Chang',
    titleVi: 'Tầm Thủ Tháp Ravenclaw',
    parkName: 'Thung Lũng Hồ Thiên Nga',
    friendCode: 'HS-CHOC-42',
    avatarEmoji: '🦢',
    house: 'Ravenclaw',
    stages: { match3: 58, caro: 52, sudoku: 74, chess: 46, blocks: 64, seedquiz: 48 },
    bonusScore: { match3: 4100, caro: 3820, sudoku: 5600, chess: 3450, blocks: 4680, seedquiz: 1920 },
    streaks: { match3: 8, caro: 7, sudoku: 10, chess: 6, blocks: 8, seedquiz: 11 },
    efficiency: { match3: 7200, caro: 12, sudoku: 0, chess: 15, blocks: 28, seedquiz: 16 },
  },
  {
    id: 'rival_cedric',
    name: 'Cedric Diggory',
    titleVi: 'Quán Quân Tam Pháp Thuật',
    parkName: 'Đồi Sồi Vàng Ottery',
    friendCode: 'HS-CEDR-55',
    avatarEmoji: '🏆',
    house: 'Hufflepuff',
    stages: { match3: 135, caro: 120, sudoku: 128, chess: 118, blocks: 142, seedquiz: 88 },
    bonusScore: { match3: 8400, caro: 7600, sudoku: 8100, chess: 7900, blocks: 8900, seedquiz: 3400 },
    streaks: { match3: 11, caro: 10, sudoku: 11, chess: 9, blocks: 12, seedquiz: 15 },
    efficiency: { match3: 11800, caro: 10, sudoku: 0, chess: 12, blocks: 42, seedquiz: 32 },
  },
  {
    id: 'rival_fleur',
    name: 'Fleur Delacour',
    titleVi: 'Sứ Giả Đa Ngữ Beauxbatons',
    parkName: 'Vườn Oải Hương Ánh Bạc',
    friendCode: 'HS-FLER-68',
    avatarEmoji: '🦋',
    house: 'Ravenclaw',
    stages: { match3: 245, caro: 190, sudoku: 230, chess: 195, blocks: 215, seedquiz: 210 },
    bonusScore: { match3: 14200, caro: 11200, sudoku: 13800, chess: 11900, blocks: 12600, seedquiz: 7600 },
    streaks: { match3: 14, caro: 11, sudoku: 13, chess: 11, blocks: 12, seedquiz: 24 },
    efficiency: { match3: 16400, caro: 10, sudoku: 0, chess: 11, blocks: 55, seedquiz: 74 },
  },
  {
    id: 'rival_ron',
    name: 'Ron Weasley',
    titleVi: 'Kỵ Sĩ Cờ Phù Thủy Hang Sóc',
    parkName: 'Gác Xép Chudley Cannons',
    friendCode: 'HS-RONW-77',
    avatarEmoji: '♟️',
    portraitSprite: 'villager_ron',
    house: 'Gryffindor',
    stages: { match3: 310, caro: 340, sudoku: 210, chess: 520, blocks: 290, seedquiz: 115 },
    bonusScore: { match3: 16800, caro: 18900, sudoku: 12400, chess: 31500, blocks: 15900, seedquiz: 4100 },
    streaks: { match3: 13, caro: 15, sudoku: 9, chess: 21, blocks: 13, seedquiz: 12 },
    efficiency: { match3: 19200, caro: 8, sudoku: 1, chess: 7, blocks: 64, seedquiz: 38 },
  },
  {
    id: 'rival_bill',
    name: 'Bill Weasley',
    titleVi: 'Chuyên Gia Phá Nguyền Gringotts',
    parkName: 'Ốc Đảo Cổ Ngữ Vỏ Sò',
    friendCode: 'HS-BILL-89',
    avatarEmoji: '🐉',
    house: 'Gryffindor',
    stages: { match3: 460, caro: 495, sudoku: 510, chess: 470, blocks: 680, seedquiz: 320 },
    bonusScore: { match3: 24500, caro: 26800, sudoku: 27900, chess: 25400, blocks: 38400, seedquiz: 11400 },
    streaks: { match3: 17, caro: 18, sudoku: 19, chess: 16, blocks: 26, seedquiz: 28 },
    efficiency: { match3: 26500, caro: 7, sudoku: 0, chess: 8, blocks: 112, seedquiz: 118 },
  },
  {
    id: 'rival_mcgonagall',
    name: 'Giáo Sư M. McGonagall',
    titleVi: 'Chủ Nhiệm Khảo Thí Biến Hình & Đại Sảnh',
    parkName: 'Tháp Đá Cẩm Thạch Hogwarts',
    friendCode: 'HS-MCGN-99',
    avatarEmoji: '👑',
    house: 'Gryffindor',
    stages: { match3: 700, caro: 715, sudoku: 740, chess: 777, blocks: 735, seedquiz: 440 },
    bonusScore: { match3: 36500, caro: 37800, sudoku: 39200, chess: 42500, blocks: 38900, seedquiz: 16200 },
    streaks: { match3: 24, caro: 25, sudoku: 28, chess: 32, blocks: 27, seedquiz: 36 },
    efficiency: { match3: 38000, caro: 6, sudoku: 0, chess: 5, blocks: 148, seedquiz: 168 },
  },
];

function hashCodeStr(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
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

function summarizeQuizState(state: GameState): {
  totalCorrect: number;
  combinedMastery: number;
  maxStreak: number;
  masteredBox5Words: number;
  totalSeedsEarned: number;
} {
  const q = state.languageQuiz;
  if (!q?.profiles) {
    return {
      totalCorrect: 0,
      combinedMastery: 0,
      maxStreak: 0,
      masteredBox5Words: 0,
      totalSeedsEarned: 0,
    };
  }
  const langs: QuizLanguageId[] = ['en', 'ko', 'zh', 'es', 'ja'];
  let totalCorrect = 0;
  let combinedMastery = 0;
  let maxStreak = 0;
  let masteredBox5Words = 0;
  let totalSeedsEarned = 0;

  for (const lid of langs) {
    const p = q.profiles[lid];
    if (!p) continue;
    totalCorrect += Math.max(0, Math.floor(p.totalCorrect ?? 0));
    combinedMastery += Math.max(0, Math.floor(p.masteryScore ?? 0));
    maxStreak = Math.max(maxStreak, Math.max(0, Math.floor(p.streak ?? 0)));
    totalSeedsEarned += Math.max(0, Math.floor(p.seedsEarned ?? 0));
    const boxes = p.srsBoxes ?? {};
    for (const rec of Object.values(boxes)) {
      if (rec && rec.box >= 5) {
        masteredBox5Words += 1;
      }
    }
  }

  return {
    totalCorrect,
    combinedMastery,
    maxStreak,
    masteredBox5Words,
    totalSeedsEarned,
  };
}

function deriveBaseRecordFromState(
  state: GameState,
  gameId: LeaderboardGameId
): MinigamePersonalRecord {
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

  if (gameId === 'seedquiz') {
    const qs = summarizeQuizState(state);
    const rating =
      qs.totalCorrect * 45 +
      qs.combinedMastery * 18 +
      qs.masteredBox5Words * 60 +
      qs.maxStreak * 30;
    return {
      bestStage: qs.totalCorrect,
      highScore: rating,
      bestSessionScore: qs.combinedMastery,
      totalWins: qs.totalCorrect,
      bestStreak: qs.maxStreak,
      bestEfficiency: qs.masteredBox5Words,
      updatedAt: 0,
    };
  }

  const stageMap: Record<'caro' | 'sudoku' | 'chess' | 'blocks', number> = {
    caro: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.caroCleared ?? Math.max(0, (pa?.caroStage ?? 1) - 1))
    ),
    sudoku: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.sudokuCleared ?? Math.max(0, (pa?.sudokuStage ?? 1) - 1))
    ),
    chess: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.chessCleared ?? Math.max(0, (pa?.chessStage ?? 1) - 1))
    ),
    blocks: Math.max(
      0,
      Math.min(MAX_PUZZLE_TOWER_STAGE, pa?.blockCleared ?? Math.max(0, (pa?.blockStage ?? 1) - 1))
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
        seedquiz: deriveBaseRecordFromState(state, 'seedquiz'),
      },
    };
  }

  for (const gid of ALL_LEADERBOARD_GAMES) {
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
      if (gid === 'seedquiz') {
        cur.bestEfficiency = Math.max(cur.bestEfficiency ?? 0, base.bestEfficiency ?? 0);
      }
    }
  }

  return state.minigameLeaderboard;
}

function getDominantPlayerHouse(state: GameState): HouseName {
  const hp = state.housePoints;
  if (!hp) return 'Gryffindor';
  const order: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
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
    const eff = efficiency && efficiency > 0 ? ` • 💥${efficiency} hàng` : '';
    return `${totalWins} thắng • 🔥×${bestStreak}${eff}`;
  }
  const bestRun = efficiency && efficiency > 0 ? ` • 🎯${efficiency.toLocaleString('vi-VN')}đ` : '';
  return `${totalWins} thắng • 🔥×${bestStreak}${bestRun}`;
}

function buildNeighborLeaderboardEntry(
  neighbor: NeighborProfileState,
  gameId: LeaderboardGameId
): Omit<LeaderboardRowEntry, 'rank'> {
  const seed = hashCodeStr(`${neighbor.id}:${neighbor.friendCode}:${gameId}`);
  const lv = Math.max(1, Math.min(100, neighbor.level || 1));

  // Canon specialization multipliers so each Hogsmeade neighbor shines in their lore discipline!
  let specialtyMult = 1.0;
  if (neighbor.id === 'hermione_valley') {
    if (gameId === 'sudoku' || gameId === 'seedquiz') specialtyMult = 1.65;
    else if (gameId === 'chess') specialtyMult = 1.3;
  } else if (neighbor.id === 'twins_valley') {
    if (gameId === 'caro' || gameId === 'match3') specialtyMult = 1.55;
    else if (gameId === 'blocks') specialtyMult = 1.25;
  } else if (neighbor.id === 'luna_valley') {
    if (gameId === 'blocks' || gameId === 'sudoku') specialtyMult = 1.45;
    else if (gameId === 'seedquiz') specialtyMult = 1.25;
  } else if (neighbor.id === 'neville_valley') {
    if (gameId === 'match3' || gameId === 'seedquiz') specialtyMult = 1.35;
  } else if (neighbor.id === 'hagrid_valley') {
    specialtyMult = 0.72; // Warm welcoming neighbor benchmark!
  }

  let primaryValue = 1;
  let totalWins = 1;
  let bestStreak = 2 + (seed % 9);
  let efficiency: number | undefined;
  let ratingScore = 200;

  if (gameId === 'seedquiz') {
    primaryValue = Math.max(
      2,
      Math.min(480, Math.round((lv * 3.4 + (seed % 14)) * specialtyMult))
    );
    totalWins = primaryValue;
    efficiency = Math.max(1, Math.round(primaryValue * 0.36));
    ratingScore = primaryValue * 45 + lv * 32 + efficiency * 60 + bestStreak * 30;
  } else {
    primaryValue = Math.max(
      2,
      Math.min(
        MAX_PUZZLE_TOWER_STAGE,
        Math.round((lv * 4.8 + (seed % 17)) * specialtyMult)
      )
    );
    totalWins = primaryValue + (seed % 12);
    if (gameId === 'caro') efficiency = Math.max(7, 19 - Math.floor(lv / 8));
    else if (gameId === 'chess') efficiency = Math.max(6, 22 - Math.floor(lv / 7));
    else if (gameId === 'sudoku') efficiency = lv >= 20 ? 0 : 1;
    else if (gameId === 'blocks') efficiency = 6 + Math.floor(primaryValue * 0.35);
    else efficiency = 1100 + primaryValue * 88;
    ratingScore = primaryValue * 155 + totalWins * 22 + bestStreak * 35 + (seed % 190);
  }

  return {
    id: `friend:${neighbor.id}`,
    name: neighbor.name,
    titleVi: neighbor.titleVi || 'Hàng Xóm Thung Lũng',
    parkName: neighbor.parkName,
    friendCode: neighbor.friendCode,
    avatarEmoji: neighbor.avatarEmoji || '🧙',
    portraitSprite: neighbor.portraitSprite,
    house: neighbor.house,
    isPlayer: false,
    isFriend: true,
    neighborId: neighbor.id,
    primaryValue,
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, primaryValue),
    ratingScore,
    ratingDisplayVi: `${ratingScore.toLocaleString('vi-VN')} đ`,
    totalWins,
    bestStreak,
    detailDisplayVi: formatDetailDisplayVi(gameId, totalWins, bestStreak, efficiency),
    league: getLeaderboardLeagueBadge(gameId, primaryValue),
  };
}

function buildRivalLeaderboardEntry(
  rival: WizardingRivalSeed,
  gameId: LeaderboardGameId
): Omit<LeaderboardRowEntry, 'rank'> {
  const primaryValue = rival.stages[gameId];
  const bestStreak = rival.streaks[gameId];
  const efficiency = rival.efficiency[gameId];
  const totalWins =
    gameId === 'seedquiz'
      ? primaryValue
      : primaryValue + Math.max(1, Math.floor(primaryValue * 0.08));
  const ratingScore =
    gameId === 'seedquiz'
      ? primaryValue * 45 + rival.bonusScore[gameId] + efficiency * 60 + bestStreak * 30
      : primaryValue * 155 + rival.bonusScore[gameId] + totalWins * 20 + bestStreak * 35;

  return {
    id: rival.id,
    name: rival.name,
    titleVi: rival.titleVi,
    parkName: rival.parkName.trim(),
    friendCode: rival.friendCode,
    avatarEmoji: rival.avatarEmoji,
    portraitSprite: rival.portraitSprite,
    house: rival.house,
    isPlayer: false,
    isFriend: false,
    primaryValue,
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, primaryValue),
    ratingScore,
    ratingDisplayVi: `${ratingScore.toLocaleString('vi-VN')} đ`,
    totalWins,
    bestStreak,
    detailDisplayVi: formatDetailDisplayVi(gameId, totalWins, bestStreak, efficiency),
    league: getLeaderboardLeagueBadge(gameId, primaryValue),
  };
}

export function buildPlayerLeaderboardEntry(
  state: GameState,
  gameId: LeaderboardGameId
): Omit<LeaderboardRowEntry, 'rank'> {
  const lb = ensureMinigameLeaderboardState(state);
  const rec = lb.records[gameId];
  const friendCode = state.neighborSocial?.playerFriendCode || 'HS-YOU1-01';
  const house = getDominantPlayerHouse(state);
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
    name: `${state.parkName || 'Trang Trại Hang Sóc'} (Bạn)`,
    titleVi: `${playerTitle} • Cấp ${state.level}`,
    parkName: state.parkName || 'Trang Trại Hang Sóc',
    friendCode,
    avatarEmoji: '🧙‍♂️',
    house,
    isPlayer: true,
    isFriend: true,
    primaryValue: rec.bestStage,
    primaryDisplayVi: formatPrimaryDisplayVi(gameId, rec.bestStage),
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
  if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
  if (a.isPlayer !== b.isPlayer) return a.isPlayer ? -1 : 1;
  return a.id.localeCompare(b.id);
}

export function buildMinigameLeaderboard(
  state: GameState,
  gameId: LeaderboardGameId,
  scope: Exclude<LeaderboardScope, 'personal'> = 'valley',
  extraCloudEntries?: ReadonlyArray<CloudLeaderboardEntry>
): LeaderboardStandingResult {
  const playerRaw = buildPlayerLeaderboardEntry(state, gameId);
  const neighbors = state.neighborSocial?.neighbors ?? [];
  const friendEntries = neighbors.map((n) => buildNeighborLeaderboardEntry(n, gameId));

  const pool: Array<Omit<LeaderboardRowEntry, 'rank'>> = [playerRaw, ...friendEntries];

  if (scope === 'valley') {
    for (const rival of WIZARDING_VALLEY_RIVALS) {
      pool.push(buildRivalLeaderboardEntry(rival, gameId));
    }
    const localUid = getClientLeaderboardUserId();
    if (extraCloudEntries && extraCloudEntries.length > 0) {
      for (const ce of extraCloudEntries) {
        if (!ce || !ce.userId) continue;
        if (ce.userId === localUid || ce.friendCode === playerRaw.friendCode) continue;
        pool.push({
          id: `cloud:${ce.userId}`,
          name: ce.name || ce.parkName || 'Phù Thủy Đám Mây',
          titleVi: 'Phù Thủy Trực Tuyến Toàn Cầu',
          parkName: ce.parkName || 'Điền Trang Phép Thuật',
          friendCode: ce.friendCode || 'HS-CLUD-00',
          avatarEmoji: ce.avatarEmoji || '🌐',
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
  }

  pool.sort(compareEntries);

  const entries: LeaderboardRowEntry[] = pool.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const playerIdx = entries.findIndex((e) => e.isPlayer);
  const playerEntry = entries[Math.max(0, playerIdx)];
  const nextRivalAbove = playerIdx > 0 ? entries[playerIdx - 1] : null;

  return {
    gameId,
    meta: LEADERBOARD_GAME_META[gameId],
    scope,
    entries,
    playerEntry,
    playerRank: playerEntry.rank,
    totalEntries: entries.length,
    nextRivalAbove,
  };
}

export function buildAllPersonalRecordsSummary(
  state: GameState,
  cloudCache?: Partial<Record<LeaderboardGameId, CloudLeaderboardEntry[]>>
): PersonalDisciplineSummaryRow[] {
  const lb = ensureMinigameLeaderboardState(state);
  return ALL_LEADERBOARD_GAMES.map((gid) => {
    const valley = buildMinigameLeaderboard(state, gid, 'valley', cloudCache?.[gid]);
    const friends = buildMinigameLeaderboard(state, gid, 'friends');
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
  rec.bestStage = Math.max(rec.bestStage, baseAfter.bestStage, Math.floor(input.clearedStage ?? 0));
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
    if (gameId === 'caro' || gameId === 'chess' || gameId === 'sudoku') {
      // Lower moves / fewer mistakes is better!
      if (rec.bestEfficiency === undefined || eff < rec.bestEfficiency) {
        rec.bestEfficiency = eff;
      }
    } else {
      // Higher lines / score / mastered words is better!
      rec.bestEfficiency = Math.max(rec.bestEfficiency ?? 0, eff);
    }
  } else if (gameId === 'seedquiz' && baseAfter.bestEfficiency !== undefined) {
    rec.bestEfficiency = Math.max(rec.bestEfficiency ?? 0, baseAfter.bestEfficiency);
  }

  // Recompute authoritative composite rating score so winning replays or higher session scores always progresses!
  let computedRating = baseAfter.highScore;
  if (gameId === 'seedquiz') {
    computedRating = Math.max(
      computedRating,
      rec.bestStage * 45 +
        rec.bestSessionScore * 18 +
        (rec.bestEfficiency ?? 0) * 60 +
        rec.bestStreak * 30
    );
  } else {
    const effBonus =
      gameId === 'caro' || gameId === 'chess'
        ? rec.bestEfficiency
          ? Math.max(0, (30 - rec.bestEfficiency) * 18)
          : 0
        : gameId === 'sudoku'
          ? rec.bestEfficiency !== undefined
            ? Math.max(0, (5 - rec.bestEfficiency) * 90)
            : 0
          : Math.round((rec.bestEfficiency ?? 0) * 0.25);
    computedRating = Math.max(
      computedRating,
      rec.bestStage * 155 +
        rec.totalWins * 28 +
        rec.bestStreak * 40 +
        Math.round(rec.bestSessionScore * 0.18) +
        effBonus
    );
  }
  rec.highScore = Math.max(rec.highScore + (sessionScore > 0 ? 15 : 8), computedRating);
  rec.updatedAt = input.nowMs ?? Date.now();

  const afterStanding = buildMinigameLeaderboard(state, gameId, 'valley');
  const newRank = afterStanding.playerRank;
  const rankUpBy = Math.max(0, previousRank - newRank);
  rec.lastRankValley = newRank;

  return {
    gameId,
    previousRank,
    newRank,
    rankUpBy,
    totalEntries: afterStanding.totalEntries,
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

export function getAllCachedCloudLeaderboards(): Partial<
  Record<LeaderboardGameId, CloudLeaderboardEntry[]>
> {
  return cloudEntriesMemoryCache;
}

export async function fetchCloudLeaderboardEntries(
  gameId: LeaderboardGameId,
  endpoint = '/api/leaderboard'
): Promise<CloudLeaderboardEntry[]> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
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
    const data = (await res.json()) as { entries?: CloudLeaderboardEntry[] };
    if (Array.isArray(data?.entries)) {
      cloudEntriesMemoryCache[gameId] = data.entries;
      return data.entries;
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
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  // Avoid noisy network calls in Vitest / headless JSDOM
  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '')) return;

  try {
    const player = buildPlayerLeaderboardEntry(state, gameId);
    const userId = getClientLeaderboardUserId();
    const payload = {
      gameId,
      entry: {
        userId,
        name: state.parkName || 'Trang Trại Hang Sóc',
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
      } satisfies CloudLeaderboardEntry,
    };
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3500);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { entries?: CloudLeaderboardEntry[] };
      if (Array.isArray(data?.entries)) {
        cloudEntriesMemoryCache[gameId] = data.entries;
      }
    }
  } catch {
    // Silent offline-first fallback
  }
}
