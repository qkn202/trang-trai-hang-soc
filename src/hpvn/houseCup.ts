// HPVN: House points are the server's (functions/games/trang-trai-hang-soc-boards.js). The page keeps no point counter
// and stores nothing about the cup, in the save or on the device: this is a memory copy of the server's numbers.
// The load and every save reply carry the member's own numbers; op 'cup' adds the week's totals per HPVN house
// (supporting both legacy flat week totals and per-discipline Medal Bracket arenas without daily caps).
import { request } from './bridge';
import type { HouseName } from '../types/game';

export type HouseCupDisciplineId = 'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'jigsaw';

export const HOUSE_CUP_DISCIPLINE_ORDER: readonly HouseCupDisciplineId[] = [
  'match3',
  'caro',
  'sudoku',
  'chess',
  'blocks',
  'jigsaw',
];

export const HOUSE_CUP_DEFAULT_MEDAL_POINTS: readonly [number, number, number, number] = [
  100,
  75,
  50,
  25,
];

/** Chỉ cần vượt qua tối thiểu 5 màn là người chơi chắc chắn ghi điểm cho Nhà; hạng càng cao điểm càng nhiều. */
export const HOUSE_CUP_MIN_STAGES_FOR_POINTS = 5;

/** Quỹ thưởng tuần cho Liên Minh đứng Hạng 1 Cúp Nhà: chia đều mỗi 17:00 Thứ Sáu (giờ VN) cho thành viên chơi tối thiểu 5 ván của 1 mini game bất kỳ. */
export const HOUSE_CUP_ALLIANCE_PRIZE_POOL = 200_000;
export const HOUSE_CUP_ALLIANCE_MIN_GAMES = 5;
export const HOUSE_CUP_PAYOUT_WEEKDAY_VN = 5; // 5 = Thứ Sáu (0=CN..6=T7)
export const HOUSE_CUP_PAYOUT_HOUR_VN = 17;   // 17:00 Asia/Ho_Chi_Minh (UTC+7)

export interface HouseCupRankPointTier {
  maxRank: number | null; // null = mọi thứ hạng còn lại miễn đạt >= minStagesForPoints
  points: number;
  labelVi: string;
}

export const HOUSE_CUP_DEFAULT_RANK_TIERS: readonly HouseCupRankPointTier[] = [
  { maxRank: 1, points: 100, labelVi: 'Hạng 1' },
  { maxRank: 2, points: 80, labelVi: 'Hạng 2' },
  { maxRank: 3, points: 65, labelVi: 'Hạng 3' },
  { maxRank: 5, points: 50, labelVi: 'Top 5' },
  { maxRank: 10, points: 35, labelVi: 'Top 10' },
  { maxRank: null, points: 20, labelVi: 'Hạng 11+' },
];

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

export interface HouseCupAllianceStanding {
  id: 'alliance_a' | 'alliance_b';
  nameVi: string;
  houses: readonly [HouseName, HouseName];
  points: number;
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
  payoutWeekdayVn: number;
  payoutHourVn: number;
  cycleKey?: string;
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
  mode?: 'medals' | 'legacy';
  unlimited?: boolean;
  medalPoints?: readonly [number, number, number, number];
  minStagesForPoints?: number;
  rankTiers?: readonly HouseCupRankPointTier[];
  alliances?: readonly [HouseCupAllianceSpec, HouseCupAllianceSpec];
  allianceReward?: HouseCupAllianceRewardInfo;
  houses?: Record<HouseName, number>; // this week, every member of the house (or medal bracket totals)
  disciplines?: Partial<Record<HouseCupDisciplineId, Record<HouseName, number>>>; // unlimited raw weekly points per discipline
  house?: string | null; // the member's HPVN house (null: none, no points)
  memberTodayPoints: number;
  memberDailyCap: number;
  memberBank: number; // points toward the next «Cúp Đợt» reward
  memberTier: number;
  perTier: number;
}

const HOUSES: HouseName[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
const HOUSE_SET = new Set<string>(HOUSES);
const VALID_DISCIPLINES = new Set<string>(HOUSE_CUP_DISCIPLINE_ORDER);

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

  for (const id of HOUSE_CUP_DISCIPLINE_ORDER) {
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
/** Thông tin quỹ thưởng tuần (17:00 Thứ Sáu) cho Liên Minh đứng Hạng 1 Cúp Nhà. */
export const houseCupAllianceReward = (): HouseCupAllianceRewardInfo => ({
  enabled: true,
  poolAmount: HOUSE_CUP_ALLIANCE_PRIZE_POOL,
  minGamesAnyMinigame: HOUSE_CUP_ALLIANCE_MIN_GAMES,
  payoutWeekdayVn: HOUSE_CUP_PAYOUT_WEEKDAY_VN,
  payoutHourVn: HOUSE_CUP_PAYOUT_HOUR_VN,
  ...(view?.allianceReward ?? {}),
});

/** Ordered per-discipline medal standings when the server provides discipline totals, or empty array in legacy mode. */
export function houseCupDisciplineSummaries(): HouseCupDisciplineSummary[] {
  if (!view?.disciplines) return [];
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
  return computeDisciplineBracketTotals(
    view.disciplines,
    view.medalPoints ?? HOUSE_CUP_DEFAULT_MEDAL_POINTS
  ).firstPlaceCounts;
}

/** Active 2 weekly Alliances formed from the 4 Houses (server override if sent, else deterministic weekly rotation). */
export function houseCupAlliances(): readonly [HouseCupAllianceSpec, HouseCupAllianceSpec] {
  if (view?.alliances) return view.alliances;
  return getWeeklyHouseAlliances(view?.weekKey);
}

/** Computed standings for the 2 weekly Alliances, combining each Alliance's 2 Houses' Cup points. */
export function houseCupAllianceStandings(
  playerHouse?: HouseName | null
): readonly [HouseCupAllianceStanding, HouseCupAllianceStanding] {
  const pair = houseCupAlliances();
  const firstCounts = houseCupFirstPlaceCounts();
  const raw = pair.map((spec) => {
    const [h0, h1] = spec.houses;
    const p0 = houseWeekPoints(h0);
    const p1 = houseWeekPoints(h1);
    const points = p0 + p1;
    const isMine = Boolean(playerHouse && (h0 === playerHouse || h1 === playerHouse));
    const allyHouse: HouseName | null = isMine ? (h0 === playerHouse ? h1 : h0) : null;
    return {
      spec,
      points,
      memberHouseScores: [p0, p1] as readonly [number, number],
      firstPlaceCount: (firstCounts[h0] ?? 0) + (firstCounts[h1] ?? 0),
      isPlayerAlliance: isMine,
      allyHouse,
    };
  });

  const totalPts = raw[0].points + raw[1].points;
  const sorted = [...raw].sort(
    (a, b) => b.points - a.points || b.firstPlaceCount - a.firstPlaceCount
  );

  const toStanding = (
    item: (typeof raw)[number],
    rank: 1 | 2
  ): HouseCupAllianceStanding => ({
    id: item.spec.id,
    nameVi: item.spec.nameVi,
    houses: item.spec.houses,
    points: item.points,
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

  const nextMode: 'medals' | 'legacy' =
    r.mode === 'medals' || Boolean(nextDisciplines && Object.keys(nextDisciplines).length > 0)
      ? 'medals'
      : 'legacy';

  let resolvedHouses = view?.houses;
  if (housesObj) {
    resolvedHouses = Object.fromEntries(HOUSES.map((h) => [h, n(housesObj[h])])) as Record<HouseName, number>;
  } else if (nextMode === 'medals' && nextDisciplines) {
    resolvedHouses = computeDisciplineBracketTotals(nextDisciplines, medalPoints).houses;
  }

  const rawDailyCap =
    'memberDailyCap' in r ? n(r.memberDailyCap) : (view?.memberDailyCap ?? 0);
  const nextUnlimited =
    typeof r.unlimited === 'boolean'
      ? r.unlimited
      : nextMode === 'medals' && rawDailyCap === 0
        ? true
        : (view?.unlimited ?? false);

  const nextAlliances =
    'alliances' in r
      ? normalizeServerAlliances(r.alliances)
      : view?.alliances;

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

  let nextAllianceReward: HouseCupAllianceRewardInfo | undefined = view?.allianceReward;
  if (r.allianceReward && typeof r.allianceReward === 'object') {
    const ar = r.allianceReward as Record<string, unknown>;
    const rawPool = n(ar.poolAmount) || HOUSE_CUP_ALLIANCE_PRIZE_POOL;
    const rawMinGames = Math.max(1, n(ar.minGamesAnyMinigame) || HOUSE_CUP_ALLIANCE_MIN_GAMES);
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
      payoutWeekdayVn: rawWeekday,
      payoutHourVn: rawHour,
      ...(typeof ar.cycleKey === 'string' && ar.cycleKey.trim() ? { cycleKey: ar.cycleKey.trim() } : {}),
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
    ...(nextAlliances ? { alliances: nextAlliances } : { alliances: undefined }),
    ...(nextAllianceReward ? { allianceReward: nextAllianceReward } : {}),
    ...(resolvedHouses ? { houses: resolvedHouses } : {}),
    ...(nextDisciplines ? { disciplines: nextDisciplines } : { disciplines: undefined }),
    ...('house' in r ? { house: typeof r.house === 'string' ? r.house : null } : {}),
    memberTodayPoints: n(r.memberTodayPoints),
    memberDailyCap: rawDailyCap,
    memberBank: n(r.memberBank),
    memberTier: Math.max(1, n(r.memberTier)),
    perTier: n(r.perTier) || 300,
  };
  listener();
}

let inFlight: Promise<HouseCupView | null> | null = null;
let fetchedAt = 0;
/** The week's totals (op 'cup'); one call in flight, at most one a minute. */
export function fetchHouseCup(): Promise<HouseCupView | null> {
  if (inFlight) return inFlight;
  if (Date.now() - fetchedAt < 60_000) return Promise.resolve(view);
  fetchedAt = Date.now();
  inFlight = request('farm', { op: 'cup' })
    .then((reply) => { applyHouseCup(reply); return view; })
    .finally(() => { inFlight = null; });
  return inFlight;
}
