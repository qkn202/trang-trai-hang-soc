// HPVN «Quầy Gringotts» in the Sổ Cái dialog + Weekly Alliance #1 Galleons Reward (Start Fri 17:00 → End next Fri 16:00 ICT):
// 1. Forward exchange: HPVN Galleons → farm Sickles (`op: 'sickles'`, priced & debited by server ACP rate).
// 2. Reverse exchange (Cách 1 — server-authoritative with asymmetric rate, daily/weekly caps & Sickle delta audit):
//    farm Sickles → HPVN Galleons (`op: 'galleons'`, default rate 1.000.000 Sickle = 100.000 Galleons, i.e. 10:1).
// 3. Weekly House Cup Alliance #1 Prize Pool: 200.000 Galleons split evenly at Friday 16:00 ICT (scoring window
//    Friday 17:00 → next Friday 16:00 ICT) among all members of the #1 Alliance with >= 5 matches in any 1 minigame.
import { deliverInbox, flushFarmSave, isStandaloneLocal, request } from './bridge';
import {
  HOUSE_CUP_ALLIANCE_MIN_GAMES,
  HOUSE_CUP_ALLIANCE_PRIZE_POOL,
  HOUSE_CUP_DISCIPLINE_ORDER,
  HOUSE_CUP_PAYOUT_HOUR_VN,
  HOUSE_CUP_PAYOUT_WEEKDAY_VN,
  HOUSE_CUP_SEASON_START_HOUR_VN,
  HOUSE_CUP_SEASON_START_WEEKDAY_VN,
  houseCupAllianceReward,
  type HouseCupAllianceStanding,
  type HouseCupDisciplineId,
  type HouseCupView,
} from './houseCup';
import type { GameHUD } from '../ui/hud';

const vn = (n: number) => n.toLocaleString('vi-VN');
const VN_UTC_OFFSET_MS = 7 * 3_600_000;
const DAY_MS = 86_400_000;
const DISCIPLINE_LABEL_VI: Record<HouseCupDisciplineId, string> = {
  match3: 'Bùa Gặt',
  caro: 'Dò Mìn',
  sudoku: 'Số Học',
  chess: 'Bắn Cá',
  blocks: 'Sinh Vật',
  jigsaw: 'Tranh Ghép',
};
const WEEKDAY_LABEL_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'] as const;

export const ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS = HOUSE_CUP_ALLIANCE_PRIZE_POOL;       // 200.000 Galleons
export const ALLIANCE_WEEKLY_MIN_GAMES = HOUSE_CUP_ALLIANCE_MIN_GAMES;                 // 5 ván của 1 mini game bất kỳ
export const ALLIANCE_WEEKLY_START_WEEKDAY_VN = HOUSE_CUP_SEASON_START_WEEKDAY_VN;     // Thứ Sáu
export const ALLIANCE_WEEKLY_START_HOUR_VN = HOUSE_CUP_SEASON_START_HOUR_VN;           // 17:00 bắt đầu tính điểm (UTC+7)
export const ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN = HOUSE_CUP_PAYOUT_WEEKDAY_VN;          // Thứ Sáu tuần kế tiếp
export const ALLIANCE_WEEKLY_PAYOUT_HOUR_VN = HOUSE_CUP_PAYOUT_HOUR_VN;                // 16:00 kết thúc & chốt thưởng (UTC+7)
/** Mốc khai màn kỳ đua đầu tiên: 17:00 Thứ Sáu 20/11/2026 (UTC+7) → kết thúc 16:00 Thứ Sáu 27/11/2026. */
export const ALLIANCE_FIRST_SEASON_START_MS = Date.UTC(2026, 10, 20, 10, 0, 0, 0);
const esc = (raw: string) =>
  String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const DEFAULT_REVERSE_SICKLE_PER_GALLEON = 10; // 1.000.000 Sickle → 100.000 Galleons
export const DEFAULT_REVERSE_SICKLE_PACKS: readonly number[] = [1_000_000];
export const DEFAULT_REVERSE_MIN_LEVEL = 10;
export const DEFAULT_REVERSE_DAILY_CAP_GALLEONS = 100_000;
export const DEFAULT_REVERSE_WEEKLY_CAP_GALLEONS = 300_000;

export interface FarmWallet {
  enabled: boolean;
  sicklePerGalleon: number;
  packs: number[];
  balance: number;
  reverseEnabled?: boolean;
  reverseSicklePerGalleon?: number; // default 10 (1.000.000 Sickle → 100.000 Galleons)
  reversePacks?: number[];          // Sickle pack sizes, e.g. [1_000_000]
  reverseMinLevel?: number;         // minimum farm level required to reverse-exchange
  reverseDailyCapGalleons?: number; // hard server daily cap in Galleons
  reverseTodayGalleons?: number;    // Galleons already redeemed today
  reverseWeeklyCapGalleons?: number;// hard server weekly cap in Galleons
  reverseWeekGalleons?: number;     // Galleons already redeemed this week
  reverseFlagged?: boolean;         // true if server flagged an abnormal Sickle jump
  reverseBlockedReason?: string;
}

export interface ReverseExchangeResult {
  balance: number;
  galleons: number;
  sicklesDeducted: number;
  remainingSickles?: number;
  reverseTodayGalleons?: number;
  reverseDailyCapGalleons?: number;
  reverseWeekGalleons?: number;
  reverseWeeklyCapGalleons?: number;
  inbox?: unknown[];
}

export function computeReverseGalleonsOut(
  sickles: number,
  reverseSicklePerGalleon = DEFAULT_REVERSE_SICKLE_PER_GALLEON
): number {
  const s = Math.max(0, Math.floor(Number(sickles) || 0));
  const rate = Math.max(1, Math.floor(Number(reverseSicklePerGalleon) || DEFAULT_REVERSE_SICKLE_PER_GALLEON));
  if (s < rate) return 0;
  return Math.floor(s / rate);
}

export function validateReverseExchangeEligibility(
  wallet: FarmWallet,
  farmSickles: number,
  farmLevel: number,
  packSickles: number
): { ok: boolean; galleonsOut: number; reason?: string } {
  const rate = Math.max(
    1,
    Math.floor(Number(wallet.reverseSicklePerGalleon) || DEFAULT_REVERSE_SICKLE_PER_GALLEON)
  );
  const galleonsOut = computeReverseGalleonsOut(packSickles, rate);
  if (!wallet.reverseEnabled) {
    return { ok: false, galleonsOut, reason: 'Chiều đổi Sickle sang Galleons đang đóng.' };
  }
  if (wallet.reverseFlagged) {
    return {
      ok: false,
      galleonsOut,
      reason:
        wallet.reverseBlockedReason ||
        'Tài khoản đang tạm khóa đổi ngược do phát hiện biến động Sickle bất thường.',
    };
  }
  const minLv = Math.max(1, Math.floor(Number(wallet.reverseMinLevel) || DEFAULT_REVERSE_MIN_LEVEL));
  if (farmLevel < minLv) {
    return {
      ok: false,
      galleonsOut,
      reason: `Cần Điền Trang đạt Cấp ${minLv} trở lên để đổi Sickle sang Galleons.`,
    };
  }
  if (galleonsOut <= 0 || packSickles <= 0) {
    return { ok: false, galleonsOut: 0, reason: 'Gói quy đổi không hợp lệ.' };
  }
  if (farmSickles < packSickles) {
    return {
      ok: false,
      galleonsOut,
      reason: `Chưa đủ ${vn(packSickles)} Sickle trong trang trại.`,
    };
  }
  const dailyCap = Math.max(0, Math.floor(Number(wallet.reverseDailyCapGalleons) || 0));
  const todayUsed = Math.max(0, Math.floor(Number(wallet.reverseTodayGalleons) || 0));
  if (dailyCap > 0 && todayUsed + galleonsOut > dailyCap) {
    return {
      ok: false,
      galleonsOut,
      reason: `Vượt hạn mức ngày (${vn(todayUsed)}/${vn(dailyCap)} Galleons).`,
    };
  }
  const weeklyCap = Math.max(0, Math.floor(Number(wallet.reverseWeeklyCapGalleons) || 0));
  const weekUsed = Math.max(0, Math.floor(Number(wallet.reverseWeekGalleons) || 0));
  if (weeklyCap > 0 && weekUsed + galleonsOut > weeklyCap) {
    return {
      ok: false,
      galleonsOut,
      reason: `Vượt hạn mức tuần (${vn(weekUsed)}/${vn(weeklyCap)} Galleons).`,
    };
  }
  return { ok: true, galleonsOut };
}

function buildLocalWalletPreview(): FarmWallet {
  return {
    enabled: true,
    sicklePerGalleon: 1,
    packs: [100, 500, 1_000],
    balance: 250_000,
    reverseEnabled: true,
    reverseSicklePerGalleon: DEFAULT_REVERSE_SICKLE_PER_GALLEON,
    reversePacks: [...DEFAULT_REVERSE_SICKLE_PACKS],
    reverseMinLevel: DEFAULT_REVERSE_MIN_LEVEL,
    reverseDailyCapGalleons: DEFAULT_REVERSE_DAILY_CAP_GALLEONS,
    reverseTodayGalleons: 0,
    reverseWeeklyCapGalleons: DEFAULT_REVERSE_WEEKLY_CAP_GALLEONS,
    reverseWeekGalleons: 0,
    reverseFlagged: false,
  };
}

/** The HPVN wallet's balance and the exchange's rate and packs (ACP sets them). */
const loadFarmWallet = () =>
  isStandaloneLocal
    ? Promise.resolve(buildLocalWalletPreview())
    : request<FarmWallet>('farm', { op: 'wallet' });

// a failed exchange keeps its id for the next tap on the same pack, so a reply lost after the charge never charges twice
let pendingExchange: { galleons: number; requestId: string } | null = null;
let pendingReverseExchange: { sickles: number; requestId: string } | null = null;

/** The page names only a pack and a request id; the server prices it, debits the wallet and sends the Sickles as an
 * inbox entry (applied once). */
export async function exchangeSickles(galleons: number): Promise<{ balance: number; sickle: number }> {
  if (pendingExchange?.galleons !== galleons) pendingExchange = { galleons, requestId: crypto.randomUUID() };
  const result = await request<{ balance: number; sickle: number; inbox?: unknown[] }>('farm', { op: 'sickles', ...pendingExchange });
  pendingExchange = null;
  deliverInbox(result?.inbox);
  return result;
}

/**
 * Reverse exchange (Sickle → HPVN Galleons): flushes the latest farm save first, then asks the server
 * to atomically verify Sickle integrity + daily/weekly caps, deduct Sickles in Firestore, and credit Galleons.
 */
export async function exchangeGalleons(sickles: number): Promise<ReverseExchangeResult> {
  const safeSickles = Math.max(1, Math.floor(Number(sickles) || 0));
  if (pendingReverseExchange?.sickles !== safeSickles) {
    pendingReverseExchange = { sickles: safeSickles, requestId: crypto.randomUUID() };
  }
  await flushFarmSave();
  const result = await request<ReverseExchangeResult>('farm', { op: 'galleons', ...pendingReverseExchange });
  pendingReverseExchange = null;
  deliverInbox(result?.inbox);
  return result;
}

export function resetPendingReverseExchangeForTest(): void {
  pendingReverseExchange = null;
}

export interface AllianceWeeklyScheduleState {
  phase: 'upcoming' | 'active' | 'break';
  startsAt: number;
  endsAt: number;
  targetAt: number;
  cycleKey: string;
  labelVi: string;
}

function formatVnDateKey(epochMs: number): string {
  const vnDate = new Date(epochMs + VN_UTC_OFFSET_MS);
  const y = vnDate.getUTCFullYear();
  const m = String(vnDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(vnDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Lịch chuẩn hàng tuần (giờ Việt Nam UTC+7):
 * - Bắt đầu tính điểm: 17:00 Thứ Sáu (mùa đầu khai màn 17:00 Thứ Sáu 20/11/2026).
 * - Kết thúc tính điểm & chốt thưởng: 16:00 Thứ Sáu tuần kế tiếp (VD 16:00 Thứ Sáu 27/11/2026).
 * - Khung 16:00 → 17:00 Thứ Sáu: 1 giờ nghỉ tổng kết chờ mở mùa tuần mới lúc 17:00.
 */
export function getAllianceWeeklyScheduleState(
  nowMs = Date.now(),
  opts?: {
    startWeekdayVn?: number;
    startHourVn?: number;
    payoutWeekdayVn?: number;
    payoutHourVn?: number;
    firstSeasonStartMs?: number;
  }
): AllianceWeeklyScheduleState {
  const startDay = Math.max(0, Math.min(6, Math.floor(Number(opts?.startWeekdayVn ?? ALLIANCE_WEEKLY_START_WEEKDAY_VN))));
  const startHour = Math.max(0, Math.min(23, Math.floor(Number(opts?.startHourVn ?? ALLIANCE_WEEKLY_START_HOUR_VN))));
  const endDay = Math.max(0, Math.min(6, Math.floor(Number(opts?.payoutWeekdayVn ?? ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN))));
  const endHour = Math.max(0, Math.min(23, Math.floor(Number(opts?.payoutHourVn ?? ALLIANCE_WEEKLY_PAYOUT_HOUR_VN))));
  const firstStartMs = opts?.firstSeasonStartMs ?? ALLIANCE_FIRST_SEASON_START_MS;

  const endDaysOffset = (endDay - startDay + 7) % 7 || 7;
  const seasonDurationMs = endDaysOffset * DAY_MS + (endHour - startHour) * 3_600_000;
  const startLabel = `Bắt đầu ${String(startHour).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[startDay] ?? 'Thứ Sáu'}`;
  const endLabel = `Kết thúc ${String(endHour).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[endDay] ?? 'Thứ Sáu'}`;

  if (nowMs < firstStartMs) {
    const startsAt = firstStartMs;
    const endsAt = startsAt + seasonDurationMs;
    return {
      phase: 'upcoming',
      startsAt,
      endsAt,
      targetAt: startsAt,
      cycleKey: formatVnDateKey(endsAt),
      labelVi: startLabel,
    };
  }

  const vnNowMs = nowMs + VN_UTC_OFFSET_MS;
  const vnDate = new Date(vnNowMs);
  const daysSinceStart = (vnDate.getUTCDay() - startDay + 7) % 7;
  let startVnMs = Date.UTC(
    vnDate.getUTCFullYear(),
    vnDate.getUTCMonth(),
    vnDate.getUTCDate() - daysSinceStart,
    startHour,
    0,
    0,
    0
  );
  if (startVnMs > vnNowMs) {
    startVnMs -= 7 * DAY_MS;
  }
  const startsAt = startVnMs - VN_UTC_OFFSET_MS;
  const endsAt = startsAt + seasonDurationMs;

  if (nowMs < endsAt) {
    return {
      phase: 'active',
      startsAt,
      endsAt,
      targetAt: endsAt,
      cycleKey: formatVnDateKey(endsAt),
      labelVi: endLabel,
    };
  }

  const nextStartsAt = startsAt + 7 * DAY_MS;
  const nextEndsAt = nextStartsAt + seasonDurationMs;
  return {
    phase: 'break',
    startsAt: nextStartsAt,
    endsAt: nextEndsAt,
    targetAt: nextStartsAt,
    cycleKey: formatVnDateKey(nextEndsAt),
    labelVi: startLabel,
  };
}

/** Tính mốc thời gian kết thúc & chốt thưởng (16:00 Thứ Sáu tuần kế tiếp, UTC+7) của kỳ hiện tại/sắp mở. */
export function getNextFridayPayoutTimeMs(
  nowMs = Date.now(),
  payoutWeekdayVn = ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN,
  payoutHourVn = ALLIANCE_WEEKLY_PAYOUT_HOUR_VN
): number {
  return getAllianceWeeklyScheduleState(nowMs, { payoutWeekdayVn, payoutHourVn }).endsAt;
}

/** Mã kỳ phát thưởng theo ngày Thứ Sáu kết thúc kỳ giờ Việt Nam (`YYYY-MM-DD`, ví dụ `'2026-11-27'`). */
export function getFridayPayoutCycleKey(
  nowMs = Date.now(),
  payoutWeekdayVn = ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN,
  payoutHourVn = ALLIANCE_WEEKLY_PAYOUT_HOUR_VN
): string {
  return getAllianceWeeklyScheduleState(nowMs, { payoutWeekdayVn, payoutHourVn }).cycleKey;
}

/** Chuỗi đếm ngược tới mốc bắt đầu hoặc kết thúc kỳ thưởng. */
export function formatCountdownToFridayPayoutVi(
  targetAt: number,
  nowMs = Date.now(),
  soonLabel = 'Sắp mở'
): string {
  const diffMs = Math.max(0, Math.floor(targetAt - nowMs));
  if (diffMs < 60_000) return soonLabel;
  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
  if (hours > 0) return mins > 0 ? `Còn ${hours} giờ ${mins} phút` : `Còn ${hours} giờ`;
  return `Còn ${mins} phút`;
}

/** Chia đều quỹ 200.000 Galleons cho tất cả thành viên đủ điều kiện thuộc Liên Minh đứng Hạng 1. */
export function computeAllianceWeeklyPrizeSplit(
  qualifiedMembers: number,
  poolGalleons = ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS
): {
  poolGalleons: number;
  qualifiedMembers: number;
  perMemberGalleons: number;
  remainderGalleons: number;
} {
  const pool = Math.max(0, Math.floor(Number(poolGalleons) || 0));
  const count = Math.max(0, Math.floor(Number(qualifiedMembers) || 0));
  if (count <= 0 || pool <= 0) {
    return { poolGalleons: pool, qualifiedMembers: count, perMemberGalleons: 0, remainderGalleons: pool };
  }
  const perMemberGalleons = Math.floor(pool / count);
  return {
    poolGalleons: pool,
    qualifiedMembers: count,
    perMemberGalleons,
    remainderGalleons: pool - perMemberGalleons * count,
  };
}

/**
 * Kiểm tra điều kiện nhận thưởng Galleons hàng tuần của thành viên:
 * phải chơi ít nhất `minGames` (mặc định 5) ván của 1 mini game bất kỳ.
 */
export function evaluateAllianceWeeklyRewardEligibility(
  playsByDiscipline: Partial<Record<HouseCupDisciplineId, number>> | null | undefined,
  minGames = ALLIANCE_WEEKLY_MIN_GAMES
): {
  qualified: boolean;
  bestPlays: number;
  bestDiscipline: HouseCupDisciplineId | null;
  remainingGames: number;
} {
  const req = Math.max(1, Math.floor(Number(minGames) || ALLIANCE_WEEKLY_MIN_GAMES));
  let bestPlays = 0;
  let bestDiscipline: HouseCupDisciplineId | null = null;
  if (playsByDiscipline) {
    for (const disc of HOUSE_CUP_DISCIPLINE_ORDER) {
      const cnt = Math.max(0, Math.floor(Number(playsByDiscipline[disc]) || 0));
      if (cnt > bestPlays) {
        bestPlays = cnt;
        bestDiscipline = disc;
      }
    }
  }
  return {
    qualified: bestPlays >= req,
    bestPlays,
    bestDiscipline,
    remainingGames: Math.max(0, req - bestPlays),
  };
}

/** Dựng thẻ thông tin quỹ thưởng 200.000 Galleons mỗi 17:00 Thứ Sáu cho giao diện Cúp Nhà. */
export function buildAllianceWeeklyRewardBannerHtml(opts: {
  cup: HouseCupView | null;
  leadingAlliance: HouseCupAllianceStanding;
  playerAlliance: HouseCupAllianceStanding | null;
  noHouse: boolean;
  localPlays?: Partial<Record<HouseCupDisciplineId, number>>;
  nowMs?: number;
}): string {
  const info = opts.cup?.allianceReward ?? houseCupAllianceReward();
  if (!info.enabled) return '';
  const nowMs = opts.nowMs ?? Date.now();
  const pool = Math.max(0, Math.floor(info.poolAmount || ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS));
  const minGames = Math.max(1, Math.floor(info.minGamesAnyMinigame || ALLIANCE_WEEKLY_MIN_GAMES));
  const startDay = info.startWeekdayVn ?? ALLIANCE_WEEKLY_START_WEEKDAY_VN;
  const startHour = info.startHourVn ?? ALLIANCE_WEEKLY_START_HOUR_VN;
  const endDay = info.payoutWeekdayVn ?? ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN;
  const endHour = info.payoutHourVn ?? ALLIANCE_WEEKLY_PAYOUT_HOUR_VN;
  const sched = getAllianceWeeklyScheduleState(nowMs, {
    startWeekdayVn: startDay,
    startHourVn: startHour,
    payoutWeekdayVn: endDay,
    payoutHourVn: endHour,
  });
  let scheduleLabel = sched.labelVi;
  let targetAt = sched.targetAt;
  let soonLabel = sched.phase === 'active' ? 'Sắp chốt thưởng' : 'Sắp bắt đầu';
  if (typeof info.seasonStartsAt === 'number' && info.seasonStartsAt > nowMs) {
    targetAt = info.seasonStartsAt;
    scheduleLabel = `Bắt đầu ${String(startHour).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[startDay] ?? 'Thứ Sáu'}`;
    soonLabel = 'Sắp bắt đầu';
  } else if (typeof info.nextPayoutAt === 'number' && info.nextPayoutAt > nowMs) {
    targetAt = info.nextPayoutAt;
    scheduleLabel = `Kết thúc ${String(endHour).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[endDay] ?? 'Thứ Sáu'}`;
    soonLabel = 'Sắp chốt thưởng';
  }
  const countdown = formatCountdownToFridayPayoutVi(targetAt, nowMs, soonLabel);

  const hasServerPlays = typeof info.memberBestPlays === 'number';
  const localEval = evaluateAllianceWeeklyRewardEligibility(opts.localPlays, minGames);
  const bestPlays = hasServerPlays ? Math.max(0, Math.floor(info.memberBestPlays!)) : localEval.bestPlays;
  const bestDisc = hasServerPlays ? (info.memberBestDiscipline ?? null) : localEval.bestDiscipline;
  const memberQualified = hasServerPlays
    ? Boolean(info.memberQualified ?? bestPlays >= minGames)
    : localEval.qualified;
  const discLabel = bestDisc ? ` · ${DISCIPLINE_LABEL_VI[bestDisc]}` : '';

  const splitEst =
    typeof info.qualifiedCount === 'number' && info.qualifiedCount > 0
      ? computeAllianceWeeklyPrizeSplit(info.qualifiedCount, pool)
      : null;
  const estLine = splitEst
    ? `<div class="hs-cup-prize-meta"><strong>~${vn(info.estimatedPerMember || splitEst.perMemberGalleons)} Galleons/người</strong> · ${vn(splitEst.qualifiedMembers)} thành viên</div>`
    : '';

  const inLeadingAlliance = Boolean(
    !opts.noHouse && opts.playerAlliance && opts.playerAlliance.id === opts.leadingAlliance.id
  );
  let statusHtml = '';
  if (opts.noHouse) {
    statusHtml = `<div class="hs-cup-prize-status">Chưa phân Nhà</div>`;
  } else if (memberQualified) {
    statusHtml = `<div class="hs-cup-prize-status is-ok">Đủ điều kiện (${vn(bestPlays)}/${minGames} ván${discLabel})${inLeadingAlliance ? ' · Đang dẫn đầu' : ''}</div>`;
  } else {
    statusHtml = `<div class="hs-cup-prize-status">${vn(bestPlays)}/${minGames} ván${discLabel}</div>`;
  }

  const lastPayoutHtml = info.lastPayout
    ? `<div class="hs-cup-prize-meta">Kỳ trước (${esc(info.lastPayout.cycleKey)}): <strong>${esc(info.lastPayout.allianceNameVi)}</strong> · +${vn(info.lastPayout.perMemberAmount)} Galleons/người</div>`
    : '';

  return `
    <div class="hs-cup-prize">
      <div class="hs-cup-prize-head">
        <strong>Thưởng Liên Minh #1 · ${vn(pool)} Galleons</strong>
        <span class="hs-cup-prize-pill">${scheduleLabel} · ${countdown}</span>
      </div>
      ${estLine}
      ${statusHtml}
      ${lastPayoutHtml}
    </div>`;
}

/** Dòng thể lệ thưởng Galleons Liên Minh #1 (dùng cho test/handoff). */
export function buildAllianceWeeklyRewardRuleHtml(cup: HouseCupView | null): string {
  const info = cup?.allianceReward ?? houseCupAllianceReward();
  const pool = Math.max(0, Math.floor(info.poolAmount || ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS));
  const minGames = Math.max(1, Math.floor(info.minGamesAnyMinigame || ALLIANCE_WEEKLY_MIN_GAMES));
  const startDay = info.startWeekdayVn ?? ALLIANCE_WEEKLY_START_WEEKDAY_VN;
  const startHour = info.startHourVn ?? ALLIANCE_WEEKLY_START_HOUR_VN;
  const endDay = info.payoutWeekdayVn ?? ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN;
  const endHour = info.payoutHourVn ?? ALLIANCE_WEEKLY_PAYOUT_HOUR_VN;
  const startLabel = `${String(startHour).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[startDay] ?? 'Thứ Sáu'}`;
  const endLabel = `${String(endHour).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[endDay] ?? 'Thứ Sáu'}`;
  return `<li><strong>Thưởng ${vn(pool)} Galleons (${startLabel} → ${endLabel} tuần sau):</strong> Tính điểm từ <strong>${startLabel}</strong> đến <strong>${endLabel} tuần kế tiếp</strong>; quỹ <strong>${vn(pool)} Galleons</strong> chia đều vào ví HPVN cho thành viên <strong>Liên Minh đứng Hạng 1</strong> chơi ít nhất <strong>${minGames} ván</strong> của <strong>1 mini game bất kỳ</strong>.</li>`;
}

export function renderFarmExchange(box: HTMLElement, hud: GameHUD): void {
  box.className = 'quest-card-mini hpvn-exchange';
  box.style.cssText = 'padding:12px;margin-top:12px;';
  if (hud.sim.isHeadmasterPreview || hud.sim.state.sandboxMode) {
    box.textContent = '🏦 Quầy Gringotts không mở trong chế độ thử.';
    return;
  }
  box.textContent = '🏦 Đang mở quầy Gringotts…';
  loadFarmWallet().then((wallet) => {
    if (!box.isConnected) return;
    if (!wallet.enabled && !wallet.reverseEnabled) {
      box.textContent = '🏦 Quầy Gringotts đang đóng.';
      return;
    }

    const farmSickles = Math.max(0, Math.floor(hud.sim.state.galleons ?? 0));
    const farmLevel = Math.max(1, Math.floor(hud.sim.state.level ?? 1));
    const forwardHtml = wallet.enabled
      ? `
        <div class="hs-gringotts-head">
          <span>🏦 Đổi Galleons → Sickle</span><span>Ví: ${vn(wallet.balance)} Galleons</span>
        </div>
        <div class="hs-gringotts-packs">${wallet.packs.map((g) => `
          <button type="button" class="brass-btn" data-pack="${g}" ${wallet.balance < g ? 'disabled' : ''}>${vn(g)} Galleons → ${vn(g * wallet.sicklePerGalleon)} Sickle</button>`).join('')}
        </div>`
      : '';

    let reverseHtml = `<div class="hs-gringotts-note">Một chiều: Sickle không đổi lại được Galleons.</div>`;
    if (wallet.reverseEnabled) {
      const rate = Math.max(
        1,
        Math.floor(Number(wallet.reverseSicklePerGalleon) || DEFAULT_REVERSE_SICKLE_PER_GALLEON)
      );
      const packs =
        Array.isArray(wallet.reversePacks) && wallet.reversePacks.length > 0
          ? wallet.reversePacks.filter((p) => Number.isFinite(p) && p >= rate)
          : [...DEFAULT_REVERSE_SICKLE_PACKS];
      const refSickles = packs[0] ?? 1_000_000;
      const refGalleons = computeReverseGalleonsOut(refSickles, rate);
      const dailyCap = Math.max(0, Math.floor(Number(wallet.reverseDailyCapGalleons) || 0));
      const todayUsed = Math.max(0, Math.floor(Number(wallet.reverseTodayGalleons) || 0));
      const weeklyCap = Math.max(0, Math.floor(Number(wallet.reverseWeeklyCapGalleons) || 0));
      const weekUsed = Math.max(0, Math.floor(Number(wallet.reverseWeekGalleons) || 0));
      const minLv = Math.max(1, Math.floor(Number(wallet.reverseMinLevel) || DEFAULT_REVERSE_MIN_LEVEL));

      const capParts: string[] = [`Tỷ lệ: ${vn(refSickles)} Sickle = ${vn(refGalleons)} Galleons`];
      if (dailyCap > 0) capParts.push(`Hôm nay: ${vn(todayUsed)}/${vn(dailyCap)}`);
      if (weeklyCap > 0) capParts.push(`Tuần: ${vn(weekUsed)}/${vn(weeklyCap)}`);

      const firstCheck = validateReverseExchangeEligibility(wallet, farmSickles, farmLevel, refSickles);
      const alertLine = wallet.reverseFlagged
        ? `<div class="hs-gringotts-warn">${esc(wallet.reverseBlockedReason || 'Tài khoản đang tạm khóa đổi ngược để kiểm tra biến động Sickle bất thường.')}</div>`
        : farmLevel < minLv
          ? `<div class="hs-gringotts-note">Cần Điền Trang đạt Cấp ${minLv} trở lên mới mở đổi ngược (hiện Cấp ${farmLevel}).</div>`
          : !firstCheck.ok && firstCheck.reason
            ? `<div class="hs-gringotts-note">${esc(firstCheck.reason)}</div>`
            : '';

      const reverseBtnsHtml = packs
        .map((s) => {
          const check = validateReverseExchangeEligibility(wallet, farmSickles, farmLevel, s);
          return `<button type="button" class="brass-btn" data-reverse-pack="${s}" ${check.ok ? '' : 'disabled'}>${vn(s)} Sickle → ${vn(check.galleonsOut)} Galleons</button>`;
        })
        .join('');

      reverseHtml = `
        <div class="hs-gringotts-reverse">
          <div class="hs-gringotts-head">
            <span>Đổi Sickle → Galleons</span><span>Trang trại: ${vn(farmSickles)} Sickle</span>
          </div>
          <div class="hs-gringotts-packs">${reverseBtnsHtml}</div>
          <div class="hs-gringotts-note">${capParts.join(' · ')}</div>
          ${alertLine}
        </div>`;
    }

    const prizeInfo = houseCupAllianceReward();
    const prizePool = Math.max(0, Math.floor(prizeInfo.poolAmount || ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS));
    const prizeNow = Date.now();
    const prizeSched = getAllianceWeeklyScheduleState(prizeNow, {
      startWeekdayVn: prizeInfo.startWeekdayVn,
      startHourVn: prizeInfo.startHourVn,
      payoutWeekdayVn: prizeInfo.payoutWeekdayVn,
      payoutHourVn: prizeInfo.payoutHourVn,
    });
    const prizeTarget =
      typeof prizeInfo.seasonStartsAt === 'number' && prizeInfo.seasonStartsAt > prizeNow
        ? prizeInfo.seasonStartsAt
        : typeof prizeInfo.nextPayoutAt === 'number' && prizeInfo.nextPayoutAt > prizeNow
          ? prizeInfo.nextPayoutAt
          : prizeSched.targetAt;
    const prizeLbl =
      typeof prizeInfo.seasonStartsAt === 'number' && prizeInfo.seasonStartsAt > prizeNow
        ? `Bắt đầu ${String(prizeInfo.startHourVn ?? ALLIANCE_WEEKLY_START_HOUR_VN).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[prizeInfo.startWeekdayVn ?? ALLIANCE_WEEKLY_START_WEEKDAY_VN] ?? 'Thứ Sáu'}`
        : typeof prizeInfo.nextPayoutAt === 'number' && prizeInfo.nextPayoutAt > prizeNow
          ? `Kết thúc ${String(prizeInfo.payoutHourVn ?? ALLIANCE_WEEKLY_PAYOUT_HOUR_VN).padStart(2, '0')}:00 ${WEEKDAY_LABEL_VI[prizeInfo.payoutWeekdayVn ?? ALLIANCE_WEEKLY_PAYOUT_WEEKDAY_VN] ?? 'Thứ Sáu'}`
          : prizeSched.labelVi;
    const prizeStripHtml = prizeInfo.enabled
      ? `<div class="hs-gringotts-prize"><strong>Thưởng Liên Minh #1:</strong> ${vn(prizePool)} Galleons · ${prizeLbl} (${formatCountdownToFridayPayoutVi(prizeTarget, prizeNow, prizeSched.phase === 'active' ? 'Sắp chốt thưởng' : 'Sắp bắt đầu')})</div>`
      : '';

    box.innerHTML = `${forwardHtml}${reverseHtml}${prizeStripHtml}`;

    const disarmAll = () => {
      box.querySelectorAll<HTMLButtonElement>('[data-armed="1"]').forEach((other) => {
        other.dataset.armed = '';
        other.textContent = other.dataset.label ?? '';
      });
    };

    box.querySelectorAll<HTMLButtonElement>('[data-pack]').forEach((btn) => {
      const label = btn.textContent ?? '';
      btn.addEventListener('click', () => {
        if (btn.dataset.armed !== '1') { // two taps: Galleons are HPVN money
          disarmAll();
          btn.dataset.armed = '1'; btn.dataset.label = label; btn.textContent = `Chạm lần nữa: trừ ${vn(Number(btn.dataset.pack))} Galleons`;
          return;
        }
        box.querySelectorAll<HTMLButtonElement>('[data-pack], [data-reverse-pack]').forEach((b) => { b.disabled = true; });
        exchangeSickles(Number(btn.dataset.pack)).then(
          () => renderFarmExchange(box, hud),
          (error: Error) => { hud.showToast(error.message || 'Chưa đổi được, thử lại nhé.', '🦉'); renderFarmExchange(box, hud); },
        );
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-reverse-pack]').forEach((btn) => {
      const label = btn.textContent ?? '';
      const packSickles = Number(btn.dataset.reversePack);
      btn.addEventListener('click', () => {
        if (btn.dataset.armed !== '1') { // two taps: irreversible Sickle deduction
          disarmAll();
          btn.dataset.armed = '1';
          btn.dataset.label = label;
          btn.textContent = `Chạm lần nữa: trừ ${vn(packSickles)} Sickle`;
          return;
        }
        box.querySelectorAll<HTMLButtonElement>('[data-pack], [data-reverse-pack]').forEach((b) => { b.disabled = true; });
        exchangeGalleons(packSickles).then(
          (res) => {
            const deducted = Math.max(0, Math.floor(Number(res?.sicklesDeducted) || packSickles));
            const curSickles = Math.max(0, Math.floor(hud.sim.state.galleons ?? 0));
            const nextSickles =
              typeof res?.remainingSickles === 'number' && Number.isFinite(res.remainingSickles)
                ? Math.max(0, Math.min(curSickles, Math.floor(res.remainingSickles)))
                : Math.max(0, curSickles - deducted);
            hud.sim.state.galleons = nextSickles;
            hud.sim.saveToStorage();
            hud.refreshAll();
            const outGal = Math.max(
              0,
              Math.floor(
                Number(res?.galleons) ||
                  computeReverseGalleonsOut(packSickles, wallet.reverseSicklePerGalleon)
              )
            );
            hud.showToast(`Đã đổi ${vn(deducted)} Sickle → +${vn(outGal)} Galleons vào ví HPVN!`, '🦉');
            renderFarmExchange(box, hud);
          },
          (error: Error) => {
            hud.showToast(error.message || 'Chưa đổi ngược được, thử lại nhé.', '🦉');
            renderFarmExchange(box, hud);
          },
        );
      });
    });
  }, (error: Error) => { if (box.isConnected) box.textContent = `🏦 ${error.message || 'Chưa mở được quầy Gringotts.'}`; });
}
