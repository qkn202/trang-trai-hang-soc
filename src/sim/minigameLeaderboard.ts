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
import { isNpcNeighborProfile } from './neighborSocial';

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
    icon: '🦄',
    spriteIcon: '/sprites/beast_niffler.png',
    shortVi: 'Nối Sinh Vật',
    titleVi: 'Nối Hình Sinh Vật Huyền Bí',
    cupTitleVi: 'Cúp Bảo Tồn Sinh Vật Huyền Bí (777 Màn Cổ Điển)',
    subtitleVi: 'Xếp hạng theo Màn Đỉnh, Điểm Ghép Cặp & Kỷ Lục Chuỗi Combo',
    primaryColVi: 'Màn Đỉnh',
    secondaryColVi: 'Điểm Linh Thú',
    detailColVi: 'Thắng & Đỉnh Combo',
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
    const eff = efficiency && efficiency > 0 ? ` • ⚡Combo ×${efficiency}` : '';
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
  const neighbors = (state.neighborSocial?.neighbors ?? []).filter(
    (n) => !isNpcNeighborProfile(n)
  );
  const effectiveCloud = extraCloudEntries ?? cloudEntriesMemoryCache[gameId] ?? [];
  const cloudByCode = new Map<string, CloudLeaderboardEntry>();
  const cloudByUid = new Map<string, CloudLeaderboardEntry>();
  for (const ce of effectiveCloud) {
    if (!ce) continue;
    if (ce.friendCode) cloudByCode.set(ce.friendCode.trim().toUpperCase(), ce);
    if (ce.userId) cloudByUid.set(ce.userId, ce);
  }
  const friendCodeSet = new Set<string>(
    neighbors.map((n) => n.friendCode.trim().toUpperCase())
  );
  const friendEntries = neighbors.map((n) => {
    const cMatch =
      (n.remoteUserId ? cloudByUid.get(n.remoteUserId) : undefined) ??
      cloudByCode.get(n.friendCode.trim().toUpperCase());
    return buildNeighborLeaderboardEntry(n, gameId, cMatch);
  });

  const pool: Array<Omit<LeaderboardRowEntry, 'rank'>> = [playerRaw, ...friendEntries];

  if (scope === 'valley') {
    const localUid = getClientLeaderboardUserId();
    for (const ce of effectiveCloud) {
      if (!ce || !ce.userId) continue;
      const normCode = (ce.friendCode || '').trim().toUpperCase();
      if (
        ce.userId === localUid ||
        normCode === playerRaw.friendCode.trim().toUpperCase() ||
        friendCodeSet.has(normCode)
      ) {
        continue;
      }
      pool.push({
        id: `cloud:${ce.userId}`,
        name: ce.name || ce.parkName || 'Người Chơi Trực Tuyến',
        titleVi: 'Người Chơi Thật Trực Tuyến',
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

export function setCachedCloudLeaderboardEntries(
  gameId: LeaderboardGameId,
  entries: ReadonlyArray<CloudLeaderboardEntry>
): void {
  cloudEntriesMemoryCache[gameId] = [...entries];
}

export function clearCachedCloudLeaderboards(): void {
  for (const gid of ALL_LEADERBOARD_GAMES) {
    delete cloudEntriesMemoryCache[gid];
  }
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
