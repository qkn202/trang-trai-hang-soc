// HPVN: House points are the server's (functions/games/trang-trai-hang-soc-boards.js). The page keeps no point counter
// and stores nothing about the cup, in the save or on the device: this is a memory copy of the server's numbers.
// The load and every save reply carry the member's own numbers; op 'cup' adds the week's totals per HPVN house
// (supporting both legacy flat week totals and per-discipline Medal Bracket arenas without daily caps).
import { flushFarmSave, request } from './bridge';
import type { HouseName } from '../types/game';

export type HouseCupDisciplineId = 'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'jigsaw' | 'derby';

export const HOUSE_CUP_DISCIPLINE_ORDER: readonly HouseCupDisciplineId[] = [
  'match3',
  'caro',
  'sudoku',
  'chess',
  'blocks',
  'jigsaw',
];

export const HOUSE_CUP_ALL_DISCIPLINE_ORDER: readonly HouseCupDisciplineId[] = [
  ...HOUSE_CUP_DISCIPLINE_ORDER,
  'derby',
];

/** Giới hạn chống gian lận điểm Derby tuần của mỗi thành viên (Môn #7). */
export const HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS = 2500;
/** Thành viên cần hoàn thành tối thiểu 2 nhiệm vụ Derby trong tuần để ghi điểm Nhà cho Môn #7. */
export const HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS = 2;

export const HOUSE_CUP_DEFAULT_MEDAL_POINTS: readonly [number, number, number, number] = [
  100,
  75,
  50,
  25,
];

/** Chỉ cần vượt qua tối thiểu 5 màn là người chơi chắc chắn ghi điểm cho Nhà; hạng càng cao điểm càng nhiều. */
export const HOUSE_CUP_MIN_STAGES_FOR_POINTS = 5;

/** Quỹ thưởng tuần cho Liên Minh đứng Hạng 1 Cúp Nhà: bắt đầu tính điểm 17:00 Thứ Sáu, kết thúc & chốt thưởng 16:00 Thứ Sáu tuần sau (giờ VN). */
export const HOUSE_CUP_ALLIANCE_PRIZE_POOL = 200_000;
export const HOUSE_CUP_ALLIANCE_MIN_GAMES = 5;
export const HOUSE_CUP_SEASON_START_WEEKDAY_VN = 5; // 5 = Thứ Sáu
export const HOUSE_CUP_SEASON_START_HOUR_VN = 17;   // 17:00 Thứ Sáu: bắt đầu tính điểm tuần mới
export const HOUSE_CUP_PAYOUT_WEEKDAY_VN = 5;       // 5 = Thứ Sáu (0=CN..6=T7)
export const HOUSE_CUP_PAYOUT_HOUR_VN = 16;         // 16:00 Thứ Sáu tuần sau: kết thúc & chốt thưởng (UTC+7)

/** Tham số F2 — Cân bằng quân số Liên Minh khóa cứng từ 17:00 Thứ Sáu đầu tuần (trung bình trượt 3 tuần, sàn 4 người/LM, trần 2.5×). */
export const HOUSE_CUP_ALLIANCE_ROSTER_WINDOW_WEEKS = 3;
export const HOUSE_CUP_ALLIANCE_ROSTER_FLOOR = 4;
export const HOUSE_CUP_ALLIANCE_MULTIPLIER_CAP = 2.5;

export interface HouseCupRankPointTier {
  maxRank: number | null; // null = mọi thứ hạng còn lại miễn đạt >= minStagesForPoints
  points: number;
  labelVi: string;
}

export interface HouseCupStageScoreBand {
  maxStage: number | null; // null = màn cao nhất trở lên (VD 81+)
  pointsPerStage: number;
  labelVi: string;
}

/**
 * Cách A — Hệ số điểm mỗi màn vượt mới trong tuần theo độ khó màn:
 * Tuần mới mọi người đều bắt đầu từ 0; màn càng cao điểm/màn càng lớn để người đang ở Màn 60 không bị thiệt so với Màn 5.
 */
export const HOUSE_CUP_DEFAULT_STAGE_SCORE_BANDS: readonly HouseCupStageScoreBand[] = [
  { maxStage: 15, pointsPerStage: 20, labelVi: 'Màn 1–15' },
  { maxStage: 40, pointsPerStage: 25, labelVi: 'Màn 16–40' },
  { maxStage: 80, pointsPerStage: 30, labelVi: 'Màn 41–80' },
  { maxStage: null, pointsPerStage: 35, labelVi: 'Màn 81+' },
];

export const HOUSE_CUP_DEFAULT_RANK_TIERS: readonly HouseCupRankPointTier[] = [
  { maxRank: 1, points: 100, labelVi: 'Hạng 1' },
  { maxRank: 2, points: 80, labelVi: 'Hạng 2' },
  { maxRank: 3, points: 65, labelVi: 'Hạng 3' },
  { maxRank: 5, points: 50, labelVi: 'Top 5' },
  { maxRank: 10, points: 35, labelVi: 'Top 10' },
  { maxRank: null, points: 20, labelVi: 'Hạng 11+' },
];

/** Trả về điểm tuần nhận được khi vượt mới chính xác màn `stageNumber` (1-based) theo hệ số độ khó. */
export function computeStageDifficultyPoints(
  stageNumber: number,
  bands: readonly HouseCupStageScoreBand[] = HOUSE_CUP_DEFAULT_STAGE_SCORE_BANDS
): number {
  const s = Math.floor(Number(stageNumber) || 0);
  if (s < 1) return 0;
  for (const band of bands) {
    if (band.maxStage === null || s <= band.maxStage) {
      return Math.max(0, Math.floor(band.pointsPerStage));
    }
  }
  return bands.length > 0 ? Math.max(0, Math.floor(bands[bands.length - 1].pointsPerStage)) : 20;
}

/**
 * Tính số màn vượt mới (`deltaStages`) và tổng điểm tuần có trọng số độ khó (`weightedScore`)
 * khi người chơi đi từ `prevCleared` lên `nextCleared` (có chặn anti-spike `maxDeltaPerSave`).
 */
export function computeWeeklyStageProgressScore(
  prevCleared: number,
  nextCleared: number,
  maxDeltaPerSave = 10,
  bands: readonly HouseCupStageScoreBand[] = HOUSE_CUP_DEFAULT_STAGE_SCORE_BANDS
): { deltaStages: number; weightedScore: number } {
  const prev = Math.max(0, Math.floor(Number(prevCleared) || 0));
  const next = Math.max(0, Math.floor(Number(nextCleared) || 0));
  if (next <= prev) return { deltaStages: 0, weightedScore: 0 };
  const cap = Number.isFinite(maxDeltaPerSave)
    ? Math.max(0, Math.floor(maxDeltaPerSave))
    : next - prev;
  const deltaStages = Math.min(cap, next - prev);
  let weightedScore = 0;
  for (let s = prev + 1; s <= prev + deltaStages; s++) {
    weightedScore += computeStageDifficultyPoints(s, bands);
  }
  return { deltaStages, weightedScore };
}

/**
 * Cách A — Xếp hạng người chơi trong 1 môn dựa trên tổng điểm tuần có trọng số độ khó (`weeklyWeightedScore`):
 * - Đầu tuần ai cũng về 0; chỉ người vượt ít nhất `minStages` (mặc định 5) màn mới trong tuần mới ghi điểm cho Nhà.
 * - Hạng cao hơn nhận điểm đóng góp cho Nhà lớn hơn (`100 / 80 / 65 / 50 / 35 / 20`).
 */
export function rankAndScoreDisciplineFromWeeklyPlayers<
  T extends { house: HouseName; weeklyCleared: number; weeklyWeightedScore: number }
>(
  entries: ReadonlyArray<T>,
  minStages = HOUSE_CUP_MIN_STAGES_FOR_POINTS,
  tiers: readonly HouseCupRankPointTier[] = HOUSE_CUP_DEFAULT_RANK_TIERS
): {
  houses: Record<HouseName, number>;
  qualifiedCounts: Record<HouseName, number>;
  ranked: Array<T & { rank: number; contributionPoints: number }>;
} {
  const safeMin = Math.max(1, Math.floor(Number(minStages) || HOUSE_CUP_MIN_STAGES_FOR_POINTS));
  const eligible = entries
    .filter((e) => HOUSE_SET.has(e.house) && Math.floor(Number(e.weeklyCleared) || 0) >= safeMin)
    .sort(
      (a, b) =>
        (Number(b.weeklyWeightedScore) || 0) - (Number(a.weeklyWeightedScore) || 0) ||
        (Number(b.weeklyCleared) || 0) - (Number(a.weeklyCleared) || 0)
    );

  const houses: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const qualifiedCounts: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const ranked: Array<T & { rank: number; contributionPoints: number }> = [];

  let activeRank = 0;
  let prevScore = -1;
  for (let i = 0; i < eligible.length; i++) {
    const entry = eligible[i];
    const score = Math.max(0, Math.floor(Number(entry.weeklyWeightedScore) || 0));
    if (score !== prevScore) {
      activeRank = i + 1;
      prevScore = score;
    }
    const pts = computeHousePointsForLeaderboardRank(
      activeRank,
      entry.weeklyCleared,
      safeMin,
      tiers
    );
    if (pts > 0) {
      houses[entry.house] += pts;
      qualifiedCounts[entry.house] += 1;
    }
    ranked.push({ ...entry, rank: activeRank, contributionPoints: pts });
  }
  return { houses, qualifiedCounts, ranked };
}

/**
 * Môn #7 (Derby Nông Trại) — Hàm thuần đồng nhất với máy chủ HPVN để xếp hạng thành viên & tính điểm đóng góp Nhà:
 * - Yêu cầu hoàn thành ít nhất `minTasks` (mặc định 2) nhiệm vụ Derby trong tuần và có điểm > 0.
 * - Kẹp điểm mỗi thành viên tối đa `maxMemberScore` (mặc định 2.500 đ) trước khi xếp hạng theo đúng luật `rankAndScoreDisciplineFromWeeklyPlayers`.
 */
export function computeDerbyDisciplineHouseTotals(
  entries: ReadonlyArray<{ house: HouseName; weeklyDerbyScore: number; weeklyDerbyTasks: number }>,
  minTasks = HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS,
  maxMemberScore = HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS,
  tiers: readonly HouseCupRankPointTier[] = HOUSE_CUP_DEFAULT_RANK_TIERS
): {
  houses: Record<HouseName, number>;
  qualifiedCounts: Record<HouseName, number>;
  ranked: Array<{
    house: HouseName;
    cappedScore: number;
    weeklyDerbyTasks: number;
    rank: number;
    contributionPoints: number;
  }>;
} {
  const safeMinTasks = Math.max(
    1,
    Math.floor(Number(minTasks) || HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS)
  );
  const safeMaxScore = Math.max(
    0,
    Math.floor(
      Number.isFinite(Number(maxMemberScore))
        ? Number(maxMemberScore)
        : HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS
    )
  );

  const mapped = entries
    .map((e) => {
      const weeklyDerbyTasks = Math.max(0, Math.floor(Number(e.weeklyDerbyTasks) || 0));
      const cappedScore = Math.min(
        safeMaxScore,
        Math.max(0, Math.floor(Number(e.weeklyDerbyScore) || 0))
      );
      return {
        house: e.house,
        cappedScore,
        weeklyDerbyTasks,
        weeklyCleared: weeklyDerbyTasks,
        weeklyWeightedScore: cappedScore,
      };
    })
    .filter((e) => e.cappedScore > 0);

  const scored = rankAndScoreDisciplineFromWeeklyPlayers(mapped, safeMinTasks, tiers);
  return {
    houses: scored.houses,
    qualifiedCounts: scored.qualifiedCounts,
    ranked: scored.ranked.map((r) => ({
      house: r.house,
      cappedScore: r.cappedScore,
      weeklyDerbyTasks: r.weeklyDerbyTasks,
      rank: r.rank,
      contributionPoints: r.contributionPoints,
    })),
  };
}

/**
 * Tính điểm đóng góp cho Nhà từ thứ hạng cá nhân trên BXH & số màn đã vượt qua:
 * - Chưa đủ `minStages` (mặc định 5 màn): 0 đ.
 * - Đạt từ `minStages` màn trở lên: chắc chắn có điểm (tối thiểu bậc sàn +20 đ),
 *   xếp thứ hạng càng cao thì điểm thưởng cho Nhà càng lớn (tối đa +100 đ cho Hạng 1).
 */
export function computeHousePointsForLeaderboardRank(
  rank: number,
  clearedStages: number,
  minStages = HOUSE_CUP_MIN_STAGES_FOR_POINTS,
  tiers: readonly HouseCupRankPointTier[] = HOUSE_CUP_DEFAULT_RANK_TIERS
): number {
  const safeMin = Math.max(1, Math.floor(Number(minStages) || HOUSE_CUP_MIN_STAGES_FOR_POINTS));
  const safeStages = Math.max(0, Math.floor(Number(clearedStages) || 0));
  const safeRank = Math.floor(Number(rank) || 0);
  if (safeStages < safeMin || safeRank < 1) return 0;
  for (const tier of tiers) {
    if (tier.maxRank === null || safeRank <= tier.maxRank) {
      return Math.max(0, Math.floor(tier.points));
    }
  }
  return tiers.length > 0 ? Math.max(0, Math.floor(tiers[tiers.length - 1].points)) : 0;
}

/** Tổng hợp điểm đóng góp cho 4 Nhà từ danh sách xếp hạng cá nhân (mọi người đạt >= 5 màn đều có điểm theo hạng). */
export function computeHousePointsFromLeaderboardEntries(
  entries: ReadonlyArray<{ house: HouseName; rank: number; clearedStages: number }>,
  minStages = HOUSE_CUP_MIN_STAGES_FOR_POINTS,
  tiers: readonly HouseCupRankPointTier[] = HOUSE_CUP_DEFAULT_RANK_TIERS
): {
  houses: Record<HouseName, number>;
  qualifiedCounts: Record<HouseName, number>;
} {
  const houses: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const qualifiedCounts: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  for (const entry of entries) {
    if (!HOUSE_SET.has(entry.house)) continue;
    const pts = computeHousePointsForLeaderboardRank(
      entry.rank,
      entry.clearedStages,
      minStages,
      tiers
    );
    if (pts > 0) {
      houses[entry.house] += pts;
      qualifiedCounts[entry.house] += 1;
    }
  }
  return { houses, qualifiedCounts };
}

export interface HouseCupDisciplineRow {
  house: HouseName;
  rawPoints: number;
  rank: number; // 1..4 (0-point houses share rank 4 with 0 cupPoints)
  cupPoints: number;
  gapToFirst: number;
}

export interface HouseCupDisciplineSummary {
  id: HouseCupDisciplineId;
  rows: HouseCupDisciplineRow[];
  leaderHouse: HouseName | null;
  leaderRawPoints: number;
  byHouse: Record<HouseName, HouseCupDisciplineRow>;
}

export interface HouseCupAllianceSpec {
  id: 'alliance_a' | 'alliance_b';
  nameVi: string;
  houses: readonly [HouseName, HouseName];
}

export interface HouseCupAllianceBalanceEntry {
  activeAvg: number; // Trung bình số người hoạt động 3 tuần gần nhất của Liên Minh (tổng 2 Nhà)
  effectiveRoster: number; // Math.max(rosterFloor, activeAvg)
  multiplier: number; // Hệ số cân bằng quân số khóa đầu tuần (1.0 .. 2.5)
  rawPoints?: number; // Tổng điểm gốc 6 môn trước khi nhân hệ số
  scaledPoints?: number; // Math.round(rawPoints * multiplier)
}

export interface HouseCupAllianceBalanceInfo {
  windowWeeks: number;
  rosterFloor: number;
  multiplierCap: number;
  lockedAt?: number;
  houseActiveAvg?: Record<HouseName, number>;
  byAlliance: Record<'alliance_a' | 'alliance_b', HouseCupAllianceBalanceEntry>;
}

export interface HouseCupAllianceStanding {
  id: 'alliance_a' | 'alliance_b';
  nameVi: string;
  houses: readonly [HouseName, HouseName];
  points: number;
  rawPoints: number;
  balanceMultiplier: number;
  activeRosterAvg?: number;
  memberHouseScores: readonly [number, number];
  firstPlaceCount: number;
  sharePercent: number;
  rank: 1 | 2;
  isPlayerAlliance: boolean;
  allyHouse: HouseName | null;
}

export interface HouseCupAllianceLastPayout {
  cycleKey: string;
  allianceNameVi: string;
  houses: readonly [HouseName, HouseName];
  poolAmount: number;
  qualifiedCount: number;
  perMemberAmount: number;
  paidAt?: number;
}

export interface HouseCupAllianceRewardInfo {
  enabled: boolean;
  poolAmount: number;
  minGamesAnyMinigame: number;
  startWeekdayVn?: number;
  startHourVn?: number;
  payoutWeekdayVn: number;
  payoutHourVn: number;
  cycleKey?: string;
  seasonStartsAt?: number;
  nextPayoutAt?: number;
  qualifiedCount?: number;
  estimatedPerMember?: number;
  memberBestPlays?: number;
  memberBestDiscipline?: HouseCupDisciplineId | null;
  memberQualified?: boolean;
  lastPayout?: HouseCupAllianceLastPayout | null;
}

export interface HouseCupView {
  weekKey?: string;
  mode?: 'f2' | 'medals' | 'legacy';
  unlimited?: boolean;
  medalPoints?: readonly [number, number, number, number];
  minStagesForPoints?: number;
  rankTiers?: readonly HouseCupRankPointTier[];
  stageScoreBands?: readonly HouseCupStageScoreBand[];
  alliances?: readonly [HouseCupAllianceSpec, HouseCupAllianceSpec];
  allianceBalance?: HouseCupAllianceBalanceInfo;
  allianceReward?: HouseCupAllianceRewardInfo;
  houses?: Record<HouseName, number>; // F2: tổng điểm đóng góp 6 môn mỗi Nhà; medals: tổng huy chương; legacy: tổng phẳng
  disciplines?: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>>; // điểm đóng góp theo thứ hạng từng môn của 4 Nhà
  house?: string | null; // the member's HPVN house (null: none, no points)
  memberTodayPoints: number;
  memberDailyCap: number;
  memberBank: number; // points toward the next «Cúp Đợt» reward
  memberTier: number;
  perTier: number;
}

const HOUSES: HouseName[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
const HOUSE_SET = new Set<string>(HOUSES);
const VALID_DISCIPLINES = new Set<string>(HOUSE_CUP_ALL_DISCIPLINE_ORDER);

/**
 * 3 cặp Liên Minh độc nhất được ghép từ 4 Nhà Hogwarts, xoay vòng liên tục mỗi tuần
 * sao cho 2 tuần liên tiếp không bao giờ lặp lại cùng cặp và cứ 3 tuần mỗi Nhà sẽ
 * bắt tay đủ với cả 3 Nhà còn lại.
 */
export const HOUSE_CUP_ALLIANCE_ROTATION: readonly [
  readonly [HouseCupAllianceSpec, HouseCupAllianceSpec],
  readonly [HouseCupAllianceSpec, HouseCupAllianceSpec],
  readonly [HouseCupAllianceSpec, HouseCupAllianceSpec],
] = [
  [
    { id: 'alliance_a', nameVi: 'Liên Minh Ánh Dương', houses: ['Gryffindor', 'Hufflepuff'] },
    { id: 'alliance_b', nameVi: 'Liên Minh Nguyệt Ảnh', houses: ['Slytherin', 'Ravenclaw'] },
  ],
  [
    { id: 'alliance_a', nameVi: 'Liên Minh Lửa & Trí', houses: ['Gryffindor', 'Ravenclaw'] },
    { id: 'alliance_b', nameVi: 'Liên Minh Ngọc Rừng', houses: ['Slytherin', 'Hufflepuff'] },
  ],
  [
    { id: 'alliance_a', nameVi: 'Liên Minh Song Hùng', houses: ['Gryffindor', 'Slytherin'] },
    { id: 'alliance_b', nameVi: 'Liên Minh Tinh Tú', houses: ['Ravenclaw', 'Hufflepuff'] },
  ],
];

export type HouseCupAllianceFlooFrameKey =
  | 'alliance-anh-duong'
  | 'alliance-lua-va-tri'
  | 'alliance-ngoc-rung'
  | 'alliance-nguyet-anh'
  | 'alliance-song-hung'
  | 'alliance-tinh-tu';

export interface HouseCupAllianceFlooFrameMeta {
  key: HouseCupAllianceFlooFrameKey;
  nameVi: string;
  houses: readonly [HouseName, HouseName];
  iconFile: string;
}

/** Bảng 6 khung bong bóng Mạng Floo riêng biệt thay thế khung `alliance-cup` cũ, tương ứng đủ 6 cặp Liên Minh 2 Nhà. */
export const HOUSE_CUP_ALLIANCE_FLOO_FRAMES: readonly HouseCupAllianceFlooFrameMeta[] = [
  { key: 'alliance-anh-duong', nameVi: 'Cúp Liên Minh Ánh Dương', houses: ['Gryffindor', 'Hufflepuff'], iconFile: 'anh-duong.webp' },
  { key: 'alliance-lua-va-tri', nameVi: 'Cúp Liên Minh Lửa & Trí', houses: ['Gryffindor', 'Ravenclaw'], iconFile: 'lua-va-tri.webp' },
  { key: 'alliance-ngoc-rung', nameVi: 'Cúp Liên Minh Ngọc Rừng', houses: ['Slytherin', 'Hufflepuff'], iconFile: 'ngoc-rung.webp' },
  { key: 'alliance-nguyet-anh', nameVi: 'Cúp Liên Minh Nguyệt Ảnh', houses: ['Slytherin', 'Ravenclaw'], iconFile: 'nguyet-anh.webp' },
  { key: 'alliance-song-hung', nameVi: 'Cúp Liên Minh Song Hùng', houses: ['Gryffindor', 'Slytherin'], iconFile: 'song-hung.webp' },
  { key: 'alliance-tinh-tu', nameVi: 'Cúp Liên Minh Tinh Tú', houses: ['Ravenclaw', 'Hufflepuff'], iconFile: 'tinh-tu.webp' },
];

const ALLIANCE_PAIR_TO_FLOO_KEY: Record<string, HouseCupAllianceFlooFrameKey> = {
  'Gryffindor+Hufflepuff': 'alliance-anh-duong',
  'Gryffindor+Ravenclaw': 'alliance-lua-va-tri',
  'Gryffindor+Slytherin': 'alliance-song-hung',
  'Hufflepuff+Ravenclaw': 'alliance-tinh-tu',
  'Hufflepuff+Slytherin': 'alliance-ngoc-rung',
  'Ravenclaw+Slytherin': 'alliance-nguyet-anh',
};

/** Ánh xạ 2 Nhà của Liên Minh thắng Cúp Tuần (không phân biệt thứ tự) sang đúng mã khung Mạng Floo riêng. */
export function getAllianceFlooFrameKey(
  houses: readonly [HouseName, HouseName]
): HouseCupAllianceFlooFrameKey | null {
  if (!Array.isArray(houses) || houses.length !== 2) return null;
  const pairKey = [...houses].sort().join('+');
  return ALLIANCE_PAIR_TO_FLOO_KEY[pairKey] ?? null;
}

const HOUSE_CUP_VN_OFFSET_MS = 7 * 3_600_000;
const HOUSE_CUP_DAY_MS = 86_400_000;
const HOUSE_CUP_FIRST_SEASON_START_MS = Date.UTC(2026, 10, 20, 10, 0, 0, 0); // 2026-11-20 17:00:00+07:00

/** Mã tuần ISO 8601 (`YYYY-Www`) tính theo giờ Việt Nam (UTC+7). */
export function getVietnamIsoWeekKey(epochMs = Date.now()): string {
  const vn = new Date(epochMs + HOUSE_CUP_VN_OFFSET_MS);
  const utcDay = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()));
  const dayNum = utcDay.getUTCDay() || 7; // Mon=1..Sun=7
  utcDay.setUTCDate(utcDay.getUTCDate() + 4 - dayNum); // Nearest Thursday determines ISO year
  const isoYear = utcDay.getUTCFullYear();
  const yearStart = Date.UTC(isoYear, 0, 1);
  const weekNo = Math.ceil((((utcDay.getTime() - yearStart) / HOUSE_CUP_DAY_MS) + 1) / 7);
  return `${isoYear}-W${String(weekNo).padStart(2, '0')}`;
}

export interface HouseCupWeeklyCycleInfo {
  phase: 'upcoming' | 'active' | 'break';
  startsAt: number;
  endsAt: number;
  cycleKey: string;
  weekKey: string;
}

/**
 * Chu kỳ tuần Cúp Nhà chuẩn (giờ Việt Nam UTC+7):
 * - Bắt đầu: 17:00 Thứ Sáu (mùa đầu 2026-11-20 17:00 ICT)
 * - Kết thúc & chốt thưởng: 16:00 Thứ Sáu tuần kế tiếp
 * - Cả 6 ngày 23 giờ trong 1 kỳ đua dùng chung 1 `weekKey` (tuần ISO của ngày Thứ Sáu chốt sổ `endsAt`),
 *   nên Cúp Nhà và BXH cá nhân từng tuần reset & chốt thưởng trùng khớp từng phút.
 */
export function getHouseCupWeeklyCycle(nowMs = Date.now()): HouseCupWeeklyCycleInfo {
  const startDay = HOUSE_CUP_SEASON_START_WEEKDAY_VN;
  const startHour = HOUSE_CUP_SEASON_START_HOUR_VN;
  const endDay = HOUSE_CUP_PAYOUT_WEEKDAY_VN;
  const endHour = HOUSE_CUP_PAYOUT_HOUR_VN;
  const endDaysOffset = (endDay - startDay + 7) % 7 || 7;
  const seasonDurationMs = endDaysOffset * HOUSE_CUP_DAY_MS + (endHour - startHour) * 3_600_000;
  const fmtVnDate = (ms: number) => {
    const d = new Date(ms + HOUSE_CUP_VN_OFFSET_MS);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  };

  if (nowMs < HOUSE_CUP_FIRST_SEASON_START_MS) {
    const startsAt = HOUSE_CUP_FIRST_SEASON_START_MS;
    const endsAt = startsAt + seasonDurationMs;
    return { phase: 'upcoming', startsAt, endsAt, cycleKey: fmtVnDate(endsAt), weekKey: getVietnamIsoWeekKey(endsAt) };
  }

  const vnNowMs = nowMs + HOUSE_CUP_VN_OFFSET_MS;
  const d = new Date(vnNowMs);
  const daysSinceStart = (d.getUTCDay() - startDay + 7) % 7;
  let startVnMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - daysSinceStart, startHour, 0, 0, 0);
  if (startVnMs > vnNowMs) startVnMs -= 7 * HOUSE_CUP_DAY_MS;
  const startsAt = startVnMs - HOUSE_CUP_VN_OFFSET_MS;
  const endsAt = startsAt + seasonDurationMs;

  if (nowMs < endsAt) {
    return { phase: 'active', startsAt, endsAt, cycleKey: fmtVnDate(endsAt), weekKey: getVietnamIsoWeekKey(endsAt) };
  }
  const nextStartsAt = startsAt + 7 * HOUSE_CUP_DAY_MS;
  const nextEndsAt = nextStartsAt + seasonDurationMs;
  return { phase: 'break', startsAt: nextStartsAt, endsAt: nextEndsAt, cycleKey: fmtVnDate(nextEndsAt), weekKey: getVietnamIsoWeekKey(nextEndsAt) };
}

/**
 * Mã tuần Cúp Nhà đang chạy: ưu tiên `weekKey` máy chủ HPVN trả về (khi không phải stub `'Local'`),
 * dự phòng theo đúng chu kỳ 17:00 Thứ Sáu → 16:00 Thứ Sáu tuần sau (ICT).
 */
export function getActiveHouseCupWeekKey(nowMs = Date.now()): string {
  const serverWeek = typeof view?.weekKey === 'string' ? view.weekKey.trim() : '';
  if (serverWeek && serverWeek.toLowerCase() !== 'local') {
    return serverWeek;
  }
  return getHouseCupWeeklyCycle(nowMs).weekKey;
}

/** Chuỗi ngắn hiển thị mốc chốt sổ / khai màn Cúp Nhà tuần hiện tại (dùng chung cho Cúp Nhà & BXH Tuần). */
export function formatHouseCupWeeklySchedulePillVi(nowMs = Date.now()): string {
  const cycle = getHouseCupWeeklyCycle(nowMs);
  const ar = view?.allianceReward;
  let label = cycle.phase === 'active' ? 'Chốt 16:00 T6' : 'Mở 17:00 T6';
  let targetAt = cycle.phase === 'active' ? cycle.endsAt : cycle.startsAt;
  let soonLabel = cycle.phase === 'active' ? 'Sắp chốt sổ' : 'Sắp mở tuần mới';

  if (typeof ar?.seasonStartsAt === 'number' && ar.seasonStartsAt > nowMs) {
    targetAt = ar.seasonStartsAt;
    label = `Mở ${String(ar.startHourVn ?? HOUSE_CUP_SEASON_START_HOUR_VN).padStart(2, '0')}:00 T6`;
    soonLabel = 'Sắp mở tuần mới';
  } else if (typeof ar?.nextPayoutAt === 'number' && ar.nextPayoutAt > nowMs) {
    targetAt = ar.nextPayoutAt;
    label = `Chốt ${String(ar.payoutHourVn ?? HOUSE_CUP_PAYOUT_HOUR_VN).padStart(2, '0')}:00 T6`;
    soonLabel = 'Sắp chốt sổ';
  }

  const diffMs = Math.max(0, Math.floor(targetAt - nowMs));
  if (diffMs < 60_000) return `${label} · ${soonLabel}`;
  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;
  const countdown =
    days > 0
      ? `Còn ${days} ngày ${hours} giờ`
      : hours > 0
        ? mins > 0
          ? `Còn ${hours} giờ ${mins} phút`
          : `Còn ${hours} giờ`
        : `Còn ${mins} phút`;
  return `${label} · ${countdown}`;
}

/** Chỉ dùng cho kiểm thử tự động: xoá bộ nhớ tạm `view` của Cúp Nhà giữa các ca test. */
export function resetHouseCupViewForTest(): void {
  view = null;
  fetchedAt = 0;
  inFlight = null;
  cupCacheVersion = 0;
}

/** Converts an ISO week key (`YYYY-Www`) to a continuous Monday-based week serial so consecutive weeks always advance by +1 (even across year boundaries). */
export function getIsoWeekSerial(weekKey?: string, nowMs = Date.now()): number {
  const m = typeof weekKey === 'string' ? /^(\d{4})-W(\d{1,2})$/i.exec(weekKey.trim()) : null;
  if (m) {
    const year = Number(m[1]);
    const week = Number(m[2]);
    if (year >= 1970 && week >= 1 && week <= 53) {
      // Jan 4 is always in ISO week 1; find Monday of ISO week 1 in UTC
      const jan4 = Date.UTC(year, 0, 4);
      const jan4Day = new Date(jan4).getUTCDay() || 7; // Mon=1..Sun=7
      const week1Monday = jan4 - (jan4Day - 1) * 86_400_000;
      const targetMonday = week1Monday + (week - 1) * 7 * 86_400_000;
      // Offset from 1970-01-05 (first Monday of Unix epoch)
      return Math.round((targetMonday - Date.UTC(1970, 0, 5)) / (7 * 86_400_000));
    }
  }
  // Fallback for non-ISO week keys (e.g. 'Local'): Vietnam UTC+7 Monday-based week serial
  const vnNow = nowMs + 7 * 3_600_000;
  return Math.floor((vnNow - Date.UTC(1970, 0, 5)) / (7 * 86_400_000));
}

export function getWeeklyHouseAlliances(
  weekKey?: string,
  nowMs = Date.now()
): readonly [HouseCupAllianceSpec, HouseCupAllianceSpec] {
  const serial = getIsoWeekSerial(weekKey, nowMs);
  const idx = ((serial % 3) + 3) % 3;
  return HOUSE_CUP_ALLIANCE_ROTATION[idx];
}

function normalizeServerAlliances(
  raw: unknown
): readonly [HouseCupAllianceSpec, HouseCupAllianceSpec] | undefined {
  if (!Array.isArray(raw) || raw.length !== 2) return undefined;
  const seen = new Set<HouseName>();
  const parsed: HouseCupAllianceSpec[] = [];
  for (let i = 0; i < 2; i++) {
    const item = raw[i];
    if (!item || typeof item !== 'object') return undefined;
    const obj = item as Record<string, unknown>;
    if (!Array.isArray(obj.houses) || obj.houses.length !== 2) return undefined;
    const h0 = String(obj.houses[0]);
    const h1 = String(obj.houses[1]);
    if (!HOUSE_SET.has(h0) || !HOUSE_SET.has(h1) || h0 === h1) return undefined;
    const hh0 = h0 as HouseName;
    const hh1 = h1 as HouseName;
    if (seen.has(hh0) || seen.has(hh1)) return undefined;
    seen.add(hh0);
    seen.add(hh1);
    const id: 'alliance_a' | 'alliance_b' = i === 0 ? 'alliance_a' : 'alliance_b';
    const rawName = typeof obj.nameVi === 'string' && obj.nameVi.trim()
      ? obj.nameVi.trim()
      : typeof obj.name === 'string' && obj.name.trim()
        ? obj.name.trim()
        : `Liên Minh ${hh0} & ${hh1}`;
    parsed.push({ id, nameVi: rawName, houses: [hh0, hh1] });
  }
  if (seen.size !== 4) return undefined;
  return [parsed[0], parsed[1]];
}
const n = (value: unknown) => Math.max(0, Math.floor(Number(value) || 0));
let view: HouseCupView | null = null;
let listener: () => void = () => {};

function normalizeMedalPoints(raw: unknown): readonly [number, number, number, number] {
  if (!Array.isArray(raw) || raw.length < 4) return HOUSE_CUP_DEFAULT_MEDAL_POINTS;
  const parsed = [n(raw[0]), n(raw[1]), n(raw[2]), n(raw[3])] as const;
  return parsed[0] > 0 ? parsed : HOUSE_CUP_DEFAULT_MEDAL_POINTS;
}

/**
 * Computes per-discipline Medal Bracket rankings & total House Cup points from unlimited raw discipline totals.
 * Each discipline awards [100, 75, 50, 25] Cup points independently (0 Cup points if a House has 0 raw points),
 * so grinding a single discipline cannot overpower the entire House Cup.
 */
export function computeDisciplineBracketTotals(
  disciplines: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>>,
  medalPoints: readonly [number, number, number, number] = HOUSE_CUP_DEFAULT_MEDAL_POINTS
): {
  houses: Record<HouseName, number>;
  firstPlaceCounts: Record<HouseName, number>;
  summaries: HouseCupDisciplineSummary[];
} {
  const houses: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const firstPlaceCounts: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const summaries: HouseCupDisciplineSummary[] = [];

  for (const id of HOUSE_CUP_ALL_DISCIPLINE_ORDER) {
    const rawMap = disciplines[id];
    if (!rawMap) continue;
    const sorted = HOUSES.map((house) => ({
      house,
      rawPoints: n(rawMap[house]),
    })).sort((a, b) => b.rawPoints - a.rawPoints);

    const leaderRawPoints = sorted[0]?.rawPoints ?? 0;
    const leaderHouse = leaderRawPoints > 0 ? sorted[0].house : null;

    const rows: HouseCupDisciplineRow[] = [];
    const byHouse = {} as Record<HouseName, HouseCupDisciplineRow>;

    let activeRank = 0;
    let prevRaw = -1;
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      if (entry.rawPoints <= 0) {
        const row: HouseCupDisciplineRow = {
          house: entry.house,
          rawPoints: 0,
          rank: 4,
          cupPoints: 0,
          gapToFirst: leaderRawPoints,
        };
        rows.push(row);
        byHouse[entry.house] = row;
        continue;
      }
      if (entry.rawPoints !== prevRaw) {
        activeRank = i + 1;
        prevRaw = entry.rawPoints;
      }
      const cupPoints = medalPoints[Math.min(3, Math.max(0, activeRank - 1))] ?? 0;
      houses[entry.house] += cupPoints;
      if (activeRank === 1) {
        firstPlaceCounts[entry.house] += 1;
      }
      const row: HouseCupDisciplineRow = {
        house: entry.house,
        rawPoints: entry.rawPoints,
        rank: activeRank,
        cupPoints,
        gapToFirst: Math.max(0, leaderRawPoints - entry.rawPoints),
      };
      rows.push(row);
      byHouse[entry.house] = row;
    }

    summaries.push({
      id,
      rows,
      leaderHouse,
      leaderRawPoints,
      byHouse,
    });
  }

  return { houses, firstPlaceCounts, summaries };
}

export const houseCup = (): HouseCupView | null => view;
export const setHouseCupListener = (fn: () => void) => { listener = fn; };
/** The week's points of one house, 0 until the server answered. */
export const houseWeekPoints = (house: HouseName): number => view?.houses?.[house] ?? 0;
/** Ngưỡng số màn tối thiểu để người chơi ghi điểm cho Nhà (mặc định 5 màn). */
export const houseCupMinStagesForPoints = (): number =>
  Math.max(1, Math.floor(view?.minStagesForPoints ?? HOUSE_CUP_MIN_STAGES_FOR_POINTS));
/** Bảng điểm thưởng Nhà theo thứ hạng cá nhân trên BXH. */
export const houseCupRankTiers = (): readonly HouseCupRankPointTier[] =>
  view?.rankTiers && view.rankTiers.length > 0 ? view.rankTiers : HOUSE_CUP_DEFAULT_RANK_TIERS;
/** Bảng hệ số điểm tuần cho từng khung độ khó màn (Cách A). */
export const houseCupStageScoreBands = (): readonly HouseCupStageScoreBand[] =>
  view?.stageScoreBands && view.stageScoreBands.length > 0
    ? view.stageScoreBands
    : HOUSE_CUP_DEFAULT_STAGE_SCORE_BANDS;
/** Thông tin quỹ thưởng tuần (bắt đầu 17:00 Thứ Sáu → kết thúc 16:00 Thứ Sáu tuần sau) cho Liên Minh đứng Hạng 1 Cúp Nhà. */
export const houseCupAllianceReward = (): HouseCupAllianceRewardInfo => ({
  enabled: true,
  poolAmount: HOUSE_CUP_ALLIANCE_PRIZE_POOL,
  minGamesAnyMinigame: HOUSE_CUP_ALLIANCE_MIN_GAMES,
  startWeekdayVn: HOUSE_CUP_SEASON_START_WEEKDAY_VN,
  startHourVn: HOUSE_CUP_SEASON_START_HOUR_VN,
  payoutWeekdayVn: HOUSE_CUP_PAYOUT_WEEKDAY_VN,
  payoutHourVn: HOUSE_CUP_PAYOUT_HOUR_VN,
  ...(view?.allianceReward ?? {}),
});

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** Định dạng hệ số cân bằng quân số gọn gàng theo chuẩn tiếng Việt (VD 1.5 -> "1,5", 2 -> "2"). */
export function formatAllianceMultiplierVi(multiplier: number): string {
  const safe = Number.isFinite(multiplier) && multiplier > 0 ? round2(multiplier) : 1;
  return String(safe).replace('.', ',');
}

/**
 * F2 — Tính tổng điểm đóng góp trực tiếp 6 bộ môn cho từng Nhà (`Σ disciplines[disc][house]`),
 * không nén nhị phân 100/75/50/25 nên 100% đóng góp từ thành viên mới (≥ 5 màn = +20 đ) đều cộng thẳng vào tổng Liên Minh.
 */
export function computeF2HouseTotals(
  disciplines: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>>
): {
  houses: Record<HouseName, number>;
  firstPlaceCounts: Record<HouseName, number>;
  summaries: HouseCupDisciplineSummary[];
} {
  const houses: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const firstPlaceCounts: Record<HouseName, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };
  const summaries: HouseCupDisciplineSummary[] = [];

  for (const id of HOUSE_CUP_ALL_DISCIPLINE_ORDER) {
    const rawMap = disciplines[id];
    if (!rawMap) continue;
    const sorted = HOUSES.map((house) => ({
      house,
      rawPoints: n(rawMap[house]),
    })).sort((a, b) => b.rawPoints - a.rawPoints);

    const leaderRawPoints = sorted[0]?.rawPoints ?? 0;
    const leaderHouse = leaderRawPoints > 0 ? sorted[0].house : null;

    const rows: HouseCupDisciplineRow[] = [];
    const byHouse = {} as Record<HouseName, HouseCupDisciplineRow>;

    let activeRank = 0;
    let prevRaw = -1;
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      if (entry.rawPoints <= 0) {
        const row: HouseCupDisciplineRow = {
          house: entry.house,
          rawPoints: 0,
          rank: 4,
          cupPoints: 0,
          gapToFirst: leaderRawPoints,
        };
        rows.push(row);
        byHouse[entry.house] = row;
        continue;
      }
      if (entry.rawPoints !== prevRaw) {
        activeRank = i + 1;
        prevRaw = entry.rawPoints;
      }
      houses[entry.house] += entry.rawPoints;
      if (activeRank === 1) {
        firstPlaceCounts[entry.house] += 1;
      }
      const row: HouseCupDisciplineRow = {
        house: entry.house,
        rawPoints: entry.rawPoints,
        rank: activeRank,
        cupPoints: entry.rawPoints,
        gapToFirst: Math.max(0, leaderRawPoints - entry.rawPoints),
      };
      rows.push(row);
      byHouse[entry.house] = row;
    }

    summaries.push({
      id,
      rows,
      leaderHouse,
      leaderRawPoints,
      byHouse,
    });
  }

  return { houses, firstPlaceCounts, summaries };
}

/**
 * F2 — Tính hệ số cân bằng quân số khóa đầu tuần (17:00 Thứ Sáu) từ trung bình trượt 3 tuần gần nhất
 * của số thành viên hoạt động từng Nhà:
 * - Sàn tối thiểu `rosterFloor` (mặc định 4 người/Liên Minh) để tránh hệ số quá ảo khi Nhà siêu vắng.
 * - Trần tối đa `multiplierCap` (mặc định 2.5×).
 * - Cold-start (chưa có lịch sử hoạt động của cả 2 Liên Minh): hệ số 1.0× cho cả hai bên.
 */
export function computeAllianceHeadcountMultipliers(
  alliances: readonly [HouseCupAllianceSpec, HouseCupAllianceSpec],
  houseActiveAvg?: Partial<Record<HouseName, number>> | null,
  options?: {
    windowWeeks?: number;
    rosterFloor?: number;
    multiplierCap?: number;
    lockedAt?: number;
  }
): HouseCupAllianceBalanceInfo {
  const windowWeeks = Math.max(
    1,
    Math.floor(Number(options?.windowWeeks) || HOUSE_CUP_ALLIANCE_ROSTER_WINDOW_WEEKS)
  );
  const rosterFloor = Math.max(
    1,
    Number.isFinite(Number(options?.rosterFloor)) && Number(options?.rosterFloor) > 0
      ? Number(options?.rosterFloor)
      : HOUSE_CUP_ALLIANCE_ROSTER_FLOOR
  );
  const multiplierCap = Math.max(
    1,
    Number.isFinite(Number(options?.multiplierCap)) && Number(options?.multiplierCap) >= 1
      ? Number(options?.multiplierCap)
      : HOUSE_CUP_ALLIANCE_MULTIPLIER_CAP
  );

  const safeHouseAvg: Record<HouseName, number> = {
    Gryffindor: Math.max(0, round2(Number(houseActiveAvg?.Gryffindor) || 0)),
    Slytherin: Math.max(0, round2(Number(houseActiveAvg?.Slytherin) || 0)),
    Ravenclaw: Math.max(0, round2(Number(houseActiveAvg?.Ravenclaw) || 0)),
    Hufflepuff: Math.max(0, round2(Number(houseActiveAvg?.Hufflepuff) || 0)),
  };

  const avgA = round2(safeHouseAvg[alliances[0].houses[0]] + safeHouseAvg[alliances[0].houses[1]]);
  const avgB = round2(safeHouseAvg[alliances[1].houses[0]] + safeHouseAvg[alliances[1].houses[1]]);
  const hasHistory = avgA > 0 || avgB > 0;
  const effA = hasHistory ? Math.max(rosterFloor, avgA) : rosterFloor;
  const effB = hasHistory ? Math.max(rosterFloor, avgB) : rosterFloor;

  let multA = 1;
  let multB = 1;
  if (hasHistory) {
    if (effA < effB) {
      multA = round2(Math.min(multiplierCap, effB / effA));
    } else if (effB < effA) {
      multB = round2(Math.min(multiplierCap, effA / effB));
    }
  }

  return {
    windowWeeks,
    rosterFloor,
    multiplierCap,
    ...(typeof options?.lockedAt === 'number' && Number.isFinite(options.lockedAt) && options.lockedAt > 0
      ? { lockedAt: options.lockedAt }
      : {}),
    houseActiveAvg: safeHouseAvg,
    byAlliance: {
      [alliances[0].id]: {
        activeAvg: avgA,
        effectiveRoster: round2(effA),
        multiplier: multA,
      },
      [alliances[1].id]: {
        activeAvg: avgB,
        effectiveRoster: round2(effB),
        multiplier: multB,
      },
    } as Record<'alliance_a' | 'alliance_b', HouseCupAllianceBalanceEntry>,
  };
}

/**
 * F2 — Hàm thuần tính trọn bộ bảng tổng sắp 4 Nhà & 2 Liên Minh từ bảng điểm đóng góp 6 môn + hệ số quân số khóa đầu tuần.
 */
export function computeF2AllianceStandingsFromDisciplines(
  disciplines: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>>,
  alliances: readonly [HouseCupAllianceSpec, HouseCupAllianceSpec],
  options?: {
    houseActiveAvg?: Partial<Record<HouseName, number>> | null;
    balance?: HouseCupAllianceBalanceInfo | null;
    playerHouse?: HouseName | null;
    windowWeeks?: number;
    rosterFloor?: number;
    multiplierCap?: number;
  }
): {
  houses: Record<HouseName, number>;
  firstPlaceCounts: Record<HouseName, number>;
  summaries: HouseCupDisciplineSummary[];
  balance: HouseCupAllianceBalanceInfo;
  standings: readonly [HouseCupAllianceStanding, HouseCupAllianceStanding];
} {
  const { houses, firstPlaceCounts, summaries } = computeF2HouseTotals(disciplines);
  const baseBalance =
    options?.balance ??
    computeAllianceHeadcountMultipliers(alliances, options?.houseActiveAvg, {
      windowWeeks: options?.windowWeeks,
      rosterFloor: options?.rosterFloor,
      multiplierCap: options?.multiplierCap,
    });

  const enrichedByAlliance = {} as Record<'alliance_a' | 'alliance_b', HouseCupAllianceBalanceEntry>;
  const rawList = alliances.map((spec) => {
    const [h0, h1] = spec.houses;
    const p0 = houses[h0] ?? 0;
    const p1 = houses[h1] ?? 0;
    const rawPoints = p0 + p1;
    const entry = baseBalance.byAlliance[spec.id];
    const mult = entry && Number.isFinite(entry.multiplier) && entry.multiplier >= 1 ? round2(entry.multiplier) : 1;
    const points = Math.round(rawPoints * mult);
    enrichedByAlliance[spec.id] = {
      activeAvg: entry?.activeAvg ?? 0,
      effectiveRoster: entry?.effectiveRoster ?? baseBalance.rosterFloor,
      multiplier: mult,
      rawPoints,
      scaledPoints: points,
    };
    const isMine = Boolean(options?.playerHouse && (h0 === options.playerHouse || h1 === options.playerHouse));
    const allyHouse: HouseName | null = isMine ? (h0 === options?.playerHouse ? h1 : h0) : null;
    return {
      spec,
      points,
      rawPoints,
      balanceMultiplier: mult,
      activeRosterAvg: entry?.activeAvg,
      memberHouseScores: [p0, p1] as readonly [number, number],
      firstPlaceCount: (firstPlaceCounts[h0] ?? 0) + (firstPlaceCounts[h1] ?? 0),
      isPlayerAlliance: isMine,
      allyHouse,
    };
  });

  const totalPts = rawList[0].points + rawList[1].points;
  const sorted = [...rawList].sort(
    (a, b) =>
      b.points - a.points ||
      b.firstPlaceCount - a.firstPlaceCount ||
      b.rawPoints - a.rawPoints
  );

  const toStanding = (item: (typeof rawList)[number], rank: 1 | 2): HouseCupAllianceStanding => ({
    id: item.spec.id,
    nameVi: item.spec.nameVi,
    houses: item.spec.houses,
    points: item.points,
    rawPoints: item.rawPoints,
    balanceMultiplier: item.balanceMultiplier,
    ...(item.activeRosterAvg !== undefined ? { activeRosterAvg: item.activeRosterAvg } : {}),
    memberHouseScores: item.memberHouseScores,
    firstPlaceCount: item.firstPlaceCount,
    sharePercent: totalPts > 0 ? Math.round((item.points / totalPts) * 100) : 50,
    rank,
    isPlayerAlliance: item.isPlayerAlliance,
    allyHouse: item.allyHouse,
  });

  return {
    houses,
    firstPlaceCounts,
    summaries,
    balance: { ...baseBalance, byAlliance: enrichedByAlliance },
    standings: [toStanding(sorted[0], 1), toStanding(sorted[1], 2)],
  };
}

/** Ordered per-discipline standings when the server provides discipline totals, or empty array in legacy mode. */
export function houseCupDisciplineSummaries(): HouseCupDisciplineSummary[] {
  if (!view?.disciplines) return [];
  if (view.mode === 'f2') {
    return computeF2HouseTotals(view.disciplines).summaries;
  }
  return computeDisciplineBracketTotals(
    view.disciplines,
    view.medalPoints ?? HOUSE_CUP_DEFAULT_MEDAL_POINTS
  ).summaries;
}

/** Number of #1 disciplines currently held by each House (all zeros in legacy mode). */
export function houseCupFirstPlaceCounts(): Record<HouseName, number> {
  if (!view?.disciplines) {
    return { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  }
  if (view.mode === 'f2') {
    return computeF2HouseTotals(view.disciplines).firstPlaceCounts;
  }
  return computeDisciplineBracketTotals(
    view.disciplines,
    view.medalPoints ?? HOUSE_CUP_DEFAULT_MEDAL_POINTS
  ).firstPlaceCounts;
}

/** Thông tin hệ số cân bằng quân số Liên Minh (F2) nếu máy chủ gửi xuống. */
export function houseCupAllianceBalance(): HouseCupAllianceBalanceInfo | null {
  return view?.allianceBalance ?? null;
}

/** Active 2 weekly Alliances formed from the 4 Houses (server override if sent, else deterministic weekly rotation). */
export function houseCupAlliances(): readonly [HouseCupAllianceSpec, HouseCupAllianceSpec] {
  if (view?.alliances) return view.alliances;
  return getWeeklyHouseAlliances(view?.weekKey);
}

/** Computed standings for the 2 weekly Alliances, combining each Alliance's 2 Houses' Cup points (with locked F2 balance multiplier when active). */
export function houseCupAllianceStandings(
  playerHouse?: HouseName | null
): readonly [HouseCupAllianceStanding, HouseCupAllianceStanding] {
  const pair = houseCupAlliances();
  const firstCounts = houseCupFirstPlaceCounts();
  const balance = view?.allianceBalance;
  const raw = pair.map((spec) => {
    const [h0, h1] = spec.houses;
    const p0 = houseWeekPoints(h0);
    const p1 = houseWeekPoints(h1);
    const bEntry = balance?.byAlliance?.[spec.id];
    const rawPoints =
      bEntry && typeof bEntry.rawPoints === 'number' && Number.isFinite(bEntry.rawPoints)
        ? Math.max(0, Math.round(bEntry.rawPoints))
        : p0 + p1;
    const balanceMultiplier =
      bEntry && typeof bEntry.multiplier === 'number' && Number.isFinite(bEntry.multiplier) && bEntry.multiplier > 1
        ? round2(bEntry.multiplier)
        : 1;
    const points =
      bEntry && typeof bEntry.scaledPoints === 'number' && Number.isFinite(bEntry.scaledPoints)
        ? Math.max(0, Math.round(bEntry.scaledPoints))
        : Math.round(rawPoints * balanceMultiplier);
    const isMine = Boolean(playerHouse && (h0 === playerHouse || h1 === playerHouse));
    const allyHouse: HouseName | null = isMine ? (h0 === playerHouse ? h1 : h0) : null;
    return {
      spec,
      points,
      rawPoints,
      balanceMultiplier,
      activeRosterAvg:
        bEntry && typeof bEntry.activeAvg === 'number' && Number.isFinite(bEntry.activeAvg)
          ? bEntry.activeAvg
          : undefined,
      memberHouseScores: [p0, p1] as readonly [number, number],
      firstPlaceCount: (firstCounts[h0] ?? 0) + (firstCounts[h1] ?? 0),
      isPlayerAlliance: isMine,
      allyHouse,
    };
  });

  const totalPts = raw[0].points + raw[1].points;
  const sorted = [...raw].sort(
    (a, b) =>
      b.points - a.points ||
      b.firstPlaceCount - a.firstPlaceCount ||
      b.rawPoints - a.rawPoints
  );

  const toStanding = (
    item: (typeof raw)[number],
    rank: 1 | 2
  ): HouseCupAllianceStanding => ({
    id: item.spec.id,
    nameVi: item.spec.nameVi,
    houses: item.spec.houses,
    points: item.points,
    rawPoints: item.rawPoints,
    balanceMultiplier: item.balanceMultiplier,
    ...(item.activeRosterAvg !== undefined ? { activeRosterAvg: item.activeRosterAvg } : {}),
    memberHouseScores: item.memberHouseScores,
    firstPlaceCount: item.firstPlaceCount,
    sharePercent: totalPts > 0 ? Math.round((item.points / totalPts) * 100) : 50,
    rank,
    isPlayerAlliance: item.isPlayerAlliance,
    allyHouse: item.allyHouse,
  });

  return [toStanding(sorted[0], 1), toStanding(sorted[1], 2)];
}

/** Takes a server reply (load/save `cup`, or op 'cup'); anything missing keeps the last server value. */
export function applyHouseCup(raw: unknown): void {
  if (!raw || typeof raw !== 'object') return;
  const r = raw as Record<string, unknown>;
  const housesObj = r.houses && typeof r.houses === 'object' ? (r.houses as Record<string, unknown>) : null;
  const medalPoints =
    r.medalPoints !== undefined
      ? normalizeMedalPoints(r.medalPoints)
      : (view?.medalPoints ?? HOUSE_CUP_DEFAULT_MEDAL_POINTS);

  let nextDisciplines: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>> | undefined =
    view?.disciplines;
  if (r.disciplines && typeof r.disciplines === 'object') {
    const rawDisc = r.disciplines as Record<string, unknown>;
    const parsedDisc: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>> = {};
    let discCount = 0;
    for (const [k, v] of Object.entries(rawDisc)) {
      if (!VALID_DISCIPLINES.has(k) || !v || typeof v !== 'object') continue;
      const hm = v as Record<string, unknown>;
      parsedDisc[k as HouseCupDisciplineId] = Object.fromEntries(
        HOUSES.map((h) => [h, n(hm[h])])
      ) as Record<HouseName, number>;
      discCount += 1;
    }
    if (discCount > 0) {
      nextDisciplines = parsedDisc;
    }
  } else if (r.disciplines === null) {
    nextDisciplines = undefined;
  }

  const hasDisciplines = Boolean(nextDisciplines && Object.keys(nextDisciplines).length > 0);
  const nextMode: 'f2' | 'medals' | 'legacy' =
    r.mode === 'f2'
      ? 'f2'
      : r.mode === 'medals'
        ? 'medals'
        : r.mode === 'legacy'
          ? 'legacy'
          : r.allianceBalance && typeof r.allianceBalance === 'object'
            ? 'f2'
            : view?.mode === 'f2' && !('mode' in r)
              ? 'f2'
              : hasDisciplines
                ? 'medals'
                : 'legacy';

  let resolvedHouses = view?.houses;
  if (housesObj) {
    resolvedHouses = Object.fromEntries(HOUSES.map((h) => [h, n(housesObj[h])])) as Record<HouseName, number>;
  } else if (nextMode === 'f2' && nextDisciplines) {
    resolvedHouses = computeF2HouseTotals(nextDisciplines).houses;
  } else if (nextMode === 'medals' && nextDisciplines) {
    resolvedHouses = computeDisciplineBracketTotals(nextDisciplines, medalPoints).houses;
  }

  const rawDailyCap =
    'memberDailyCap' in r ? n(r.memberDailyCap) : (view?.memberDailyCap ?? 0);
  const nextUnlimited =
    typeof r.unlimited === 'boolean'
      ? r.unlimited
      : (nextMode === 'f2' || nextMode === 'medals') && rawDailyCap === 0
        ? true
        : (view?.unlimited ?? false);

  const nextWeekKey = typeof r.weekKey === 'string' ? r.weekKey : view?.weekKey;
  const nextAlliances =
    'alliances' in r
      ? normalizeServerAlliances(r.alliances)
      : view?.alliances;

  let nextAllianceBalance: HouseCupAllianceBalanceInfo | undefined =
    nextMode === 'f2' ? view?.allianceBalance : undefined;
  if (r.allianceBalance === null) {
    nextAllianceBalance = undefined;
  } else if (r.allianceBalance && typeof r.allianceBalance === 'object') {
    const ab = r.allianceBalance as Record<string, unknown>;
    const activePair = nextAlliances ?? getWeeklyHouseAlliances(nextWeekKey);
    const windowWeeks = Math.max(
      1,
      Math.floor(Number(ab.windowWeeks) || HOUSE_CUP_ALLIANCE_ROSTER_WINDOW_WEEKS)
    );
    const rosterFloor =
      typeof ab.rosterFloor === 'number' && Number.isFinite(ab.rosterFloor) && ab.rosterFloor > 0
        ? ab.rosterFloor
        : HOUSE_CUP_ALLIANCE_ROSTER_FLOOR;
    const multiplierCap =
      typeof ab.multiplierCap === 'number' && Number.isFinite(ab.multiplierCap) && ab.multiplierCap >= 1
        ? ab.multiplierCap
        : HOUSE_CUP_ALLIANCE_MULTIPLIER_CAP;
    const lockedAt =
      typeof ab.lockedAt === 'number' && Number.isFinite(ab.lockedAt) && ab.lockedAt > 0
        ? ab.lockedAt
        : undefined;
    const rawHouseAvg =
      ab.houseActiveAvg && typeof ab.houseActiveAvg === 'object'
        ? (ab.houseActiveAvg as Record<string, unknown>)
        : null;
    const parsedHouseAvg: Partial<Record<HouseName, number>> | undefined = rawHouseAvg
      ? (Object.fromEntries(
          HOUSES.map((h) => [h, Math.max(0, round2(Number(rawHouseAvg[h]) || 0))])
        ) as Record<HouseName, number>)
      : undefined;

    const derived = computeAllianceHeadcountMultipliers(activePair, parsedHouseAvg, {
      windowWeeks,
      rosterFloor,
      multiplierCap,
      lockedAt,
    });

    const rawBy =
      ab.byAlliance && typeof ab.byAlliance === 'object'
        ? (ab.byAlliance as Record<string, unknown>)
        : null;
    if (rawBy) {
      const mergedBy = { ...derived.byAlliance };
      for (const aid of ['alliance_a', 'alliance_b'] as const) {
        const rawEntry = rawBy[aid];
        if (!rawEntry || typeof rawEntry !== 'object') continue;
        const e = rawEntry as Record<string, unknown>;
        const rawMult = Number(e.multiplier);
        const safeMult =
          Number.isFinite(rawMult) && rawMult >= 1
            ? round2(Math.min(multiplierCap, rawMult))
            : derived.byAlliance[aid].multiplier;
        const rawAvg = Number(e.activeAvg);
        const safeAvg =
          Number.isFinite(rawAvg) && rawAvg >= 0 ? round2(rawAvg) : derived.byAlliance[aid].activeAvg;
        const rawEff = Number(e.effectiveRoster);
        const safeEff =
          Number.isFinite(rawEff) && rawEff > 0
            ? round2(rawEff)
            : Math.max(rosterFloor, safeAvg);
        mergedBy[aid] = {
          activeAvg: safeAvg,
          effectiveRoster: safeEff,
          multiplier: safeMult,
          ...(typeof e.rawPoints === 'number' && Number.isFinite(e.rawPoints)
            ? { rawPoints: Math.max(0, Math.round(e.rawPoints)) }
            : {}),
          ...(typeof e.scaledPoints === 'number' && Number.isFinite(e.scaledPoints)
            ? { scaledPoints: Math.max(0, Math.round(e.scaledPoints)) }
            : {}),
        };
      }
      nextAllianceBalance = { ...derived, byAlliance: mergedBy };
    } else {
      nextAllianceBalance = derived;
    }
  }

  const nextMinStages =
    'minStagesForPoints' in r
      ? Math.max(1, n(r.minStagesForPoints) || HOUSE_CUP_MIN_STAGES_FOR_POINTS)
      : (view?.minStagesForPoints ?? HOUSE_CUP_MIN_STAGES_FOR_POINTS);

  let nextRankTiers = view?.rankTiers ?? HOUSE_CUP_DEFAULT_RANK_TIERS;
  if (Array.isArray(r.rankTiers) && r.rankTiers.length > 0) {
    const parsedTiers: HouseCupRankPointTier[] = [];
    for (const rawTier of r.rankTiers) {
      if (!rawTier || typeof rawTier !== 'object') continue;
      const t = rawTier as Record<string, unknown>;
      const ptsVal = n(t.points);
      if (ptsVal <= 0) continue;
      const maxR = t.maxRank === null || t.maxRank === undefined ? null : Math.max(1, n(t.maxRank));
      const lbl =
        typeof t.labelVi === 'string' && t.labelVi.trim()
          ? t.labelVi.trim()
          : maxR === null
            ? 'Còn lại'
            : maxR <= 3
              ? `Hạng ${maxR}`
              : `Top ${maxR}`;
      parsedTiers.push({ maxRank: maxR, points: ptsVal, labelVi: lbl });
    }
    if (parsedTiers.length > 0) {
      nextRankTiers = parsedTiers;
    }
  }

  let nextStageScoreBands = view?.stageScoreBands ?? HOUSE_CUP_DEFAULT_STAGE_SCORE_BANDS;
  if (Array.isArray(r.stageScoreBands) && r.stageScoreBands.length > 0) {
    const parsedBands: HouseCupStageScoreBand[] = [];
    for (const rawBand of r.stageScoreBands) {
      if (!rawBand || typeof rawBand !== 'object') continue;
      const b = rawBand as Record<string, unknown>;
      const ptsPer = n(b.pointsPerStage);
      if (ptsPer <= 0) continue;
      const maxS = b.maxStage === null || b.maxStage === undefined ? null : Math.max(1, n(b.maxStage));
      const lbl =
        typeof b.labelVi === 'string' && b.labelVi.trim()
          ? b.labelVi.trim()
          : maxS === null
            ? 'Màn cao'
            : `Tới Màn ${maxS}`;
      parsedBands.push({ maxStage: maxS, pointsPerStage: ptsPer, labelVi: lbl });
    }
    if (parsedBands.length > 0) {
      nextStageScoreBands = parsedBands;
    }
  }

  let nextAllianceReward: HouseCupAllianceRewardInfo | undefined = view?.allianceReward;
  if (r.allianceReward && typeof r.allianceReward === 'object') {
    const ar = r.allianceReward as Record<string, unknown>;
    const rawPool = n(ar.poolAmount) || HOUSE_CUP_ALLIANCE_PRIZE_POOL;
    const rawMinGames = Math.max(1, n(ar.minGamesAnyMinigame) || HOUSE_CUP_ALLIANCE_MIN_GAMES);
    const rawStartWeekday =
      typeof ar.startWeekdayVn === 'number' && Number.isFinite(ar.startWeekdayVn)
        ? Math.max(0, Math.min(6, Math.floor(ar.startWeekdayVn)))
        : HOUSE_CUP_SEASON_START_WEEKDAY_VN;
    const rawStartHour =
      typeof ar.startHourVn === 'number' && Number.isFinite(ar.startHourVn)
        ? Math.max(0, Math.min(23, Math.floor(ar.startHourVn)))
        : HOUSE_CUP_SEASON_START_HOUR_VN;
    const rawWeekday =
      typeof ar.payoutWeekdayVn === 'number' && Number.isFinite(ar.payoutWeekdayVn)
        ? Math.max(0, Math.min(6, Math.floor(ar.payoutWeekdayVn)))
        : HOUSE_CUP_PAYOUT_WEEKDAY_VN;
    const rawHour =
      typeof ar.payoutHourVn === 'number' && Number.isFinite(ar.payoutHourVn)
        ? Math.max(0, Math.min(23, Math.floor(ar.payoutHourVn)))
        : HOUSE_CUP_PAYOUT_HOUR_VN;
    const bestDiscStr = typeof ar.memberBestDiscipline === 'string' ? ar.memberBestDiscipline : '';
    const bestDisc = VALID_DISCIPLINES.has(bestDiscStr)
      ? (bestDiscStr as HouseCupDisciplineId)
      : null;
    const bestPlays =
      typeof ar.memberBestPlays === 'number' && Number.isFinite(ar.memberBestPlays)
        ? n(ar.memberBestPlays)
        : undefined;
    const qualifiedCount =
      typeof ar.qualifiedCount === 'number' && Number.isFinite(ar.qualifiedCount)
        ? n(ar.qualifiedCount)
        : undefined;
    const estPerMember =
      typeof ar.estimatedPerMember === 'number' && Number.isFinite(ar.estimatedPerMember)
        ? n(ar.estimatedPerMember)
        : qualifiedCount && qualifiedCount > 0
          ? Math.floor(rawPool / qualifiedCount)
          : undefined;
    let lastPayout: HouseCupAllianceLastPayout | null | undefined = undefined;
    if (ar.lastPayout && typeof ar.lastPayout === 'object') {
      const lp = ar.lastPayout as Record<string, unknown>;
      const lpHouses = Array.isArray(lp.houses) && lp.houses.length === 2
        ? [String(lp.houses[0]), String(lp.houses[1])]
        : null;
      if (
        lpHouses &&
        HOUSE_SET.has(lpHouses[0]) &&
        HOUSE_SET.has(lpHouses[1]) &&
        typeof lp.cycleKey === 'string' &&
        lp.cycleKey.trim()
      ) {
        const lpPool = n(lp.poolAmount) || rawPool;
        const lpQ = n(lp.qualifiedCount);
        lastPayout = {
          cycleKey: lp.cycleKey.trim(),
          allianceNameVi:
            typeof lp.allianceNameVi === 'string' && lp.allianceNameVi.trim()
              ? lp.allianceNameVi.trim()
              : `Liên Minh ${lpHouses[0]} & ${lpHouses[1]}`,
          houses: [lpHouses[0] as HouseName, lpHouses[1] as HouseName],
          poolAmount: lpPool,
          qualifiedCount: lpQ,
          perMemberAmount: n(lp.perMemberAmount) || (lpQ > 0 ? Math.floor(lpPool / lpQ) : 0),
          ...(typeof lp.paidAt === 'number' && Number.isFinite(lp.paidAt) ? { paidAt: lp.paidAt } : {}),
        };
      }
    } else if (ar.lastPayout === null) {
      lastPayout = null;
    }

    nextAllianceReward = {
      enabled: ar.enabled !== false,
      poolAmount: rawPool,
      minGamesAnyMinigame: rawMinGames,
      startWeekdayVn: rawStartWeekday,
      startHourVn: rawStartHour,
      payoutWeekdayVn: rawWeekday,
      payoutHourVn: rawHour,
      ...(typeof ar.cycleKey === 'string' && ar.cycleKey.trim() ? { cycleKey: ar.cycleKey.trim() } : {}),
      ...(typeof ar.seasonStartsAt === 'number' && Number.isFinite(ar.seasonStartsAt) && ar.seasonStartsAt > 0
        ? { seasonStartsAt: ar.seasonStartsAt }
        : {}),
      ...(typeof ar.nextPayoutAt === 'number' && Number.isFinite(ar.nextPayoutAt) && ar.nextPayoutAt > 0
        ? { nextPayoutAt: ar.nextPayoutAt }
        : {}),
      ...(qualifiedCount !== undefined ? { qualifiedCount } : {}),
      ...(estPerMember !== undefined ? { estimatedPerMember: estPerMember } : {}),
      ...(bestPlays !== undefined ? { memberBestPlays: bestPlays } : {}),
      ...(bestDisc !== null || ar.memberBestDiscipline === null ? { memberBestDiscipline: bestDisc } : {}),
      ...(typeof ar.memberQualified === 'boolean'
        ? { memberQualified: ar.memberQualified }
        : bestPlays !== undefined
          ? { memberQualified: bestPlays >= rawMinGames }
          : {}),
      ...(lastPayout !== undefined ? { lastPayout } : {}),
    };
  }

  view = {
    ...view,
    ...(typeof r.weekKey === 'string' ? { weekKey: r.weekKey } : {}),
    mode: nextMode,
    unlimited: nextUnlimited,
    medalPoints,
    minStagesForPoints: nextMinStages,
    rankTiers: nextRankTiers,
    stageScoreBands: nextStageScoreBands,
    ...(nextAlliances ? { alliances: nextAlliances } : { alliances: undefined }),
    ...(nextAllianceBalance ? { allianceBalance: nextAllianceBalance } : { allianceBalance: undefined }),
    ...(nextAllianceReward ? { allianceReward: nextAllianceReward } : {}),
    ...(resolvedHouses ? { houses: resolvedHouses } : {}),
    ...(nextDisciplines ? { disciplines: nextDisciplines } : { disciplines: undefined }),
    ...('house' in r ? { house: typeof r.house === 'string' ? r.house : null } : {}),
    memberTodayPoints: 'memberTodayPoints' in r ? n(r.memberTodayPoints) : ('house' in r && r.house === null ? 0 : (view?.memberTodayPoints ?? 0)),
    memberDailyCap: rawDailyCap,
    memberBank: 'memberBank' in r ? n(r.memberBank) : ('house' in r && r.house === null ? 0 : (view?.memberBank ?? 0)),
    memberTier: 'memberTier' in r ? Math.max(1, n(r.memberTier)) : ('house' in r && r.house === null ? 1 : (view?.memberTier ?? 1)),
    perTier: 'perTier' in r ? (n(r.perTier) || 300) : (view?.perTier ?? 300),
  };
  // Khi phản hồi từ op: 'save' chỉ mang số liệu cá nhân (không kèm houses/disciplines), xoá cache 60s để lần mở Tab Cúp kế tiếp tải bảng tổng 4 Nhà mới nhất ngay.
  if (!housesObj && !(r.disciplines && typeof r.disciplines === 'object')) {
    invalidateHouseCupCache();
  }
  listener();
}

let inFlight: Promise<HouseCupView | null> | null = null;
let fetchedAt = 0;
let cupCacheVersion = 0;

/** Xoá cache 60 giây của `op: 'cup'` (VD ngay sau khi `op: 'save'` ghi nhận màn thắng mới) để lần mở Cúp Nhà kế tiếp tải bảng điểm mới nhất. */
export function invalidateHouseCupCache(): void {
  cupCacheVersion += 1;
  fetchedAt = 0;
}

/** The week's totals (op 'cup'); flushes any pending save first so newly cleared stages (incl. Bắn Cá) reach the server before reading totals, one call in flight, at most one a minute. */
export function fetchHouseCup(): Promise<HouseCupView | null> {
  if (inFlight) return inFlight;
  const flushPending =
    typeof flushFarmSave === 'function'
      ? flushFarmSave().catch(() => {})
      : Promise.resolve();
  inFlight = flushPending
    .then(() => {
      if (fetchedAt > 0 && Date.now() - fetchedAt < 60_000) return view;
      const reqVersion = cupCacheVersion;
      return request('farm', { op: 'cup' }).then((reply) => {
        applyHouseCup(reply);
        if (cupCacheVersion === reqVersion) {
          fetchedAt = Date.now();
        }
        return view;
      });
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}
