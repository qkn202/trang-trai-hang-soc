/**
 * BurrowAuthoritativeBackend — Lõi Backend Ủy Quyền Độc Lập cho 'Trang Trại Hang Sóc'
 * Tham khảo mô hình kiến trúc Server-Authoritative nhưng tách độc lập 100% không gian dữ liệu (`burrow_*`):
 *  1. Lịch chuẩn Việt Nam `Asia/Ho_Chi_Minh` (`UTC+7`) tính thuần trên đồng hồ máy chủ (`vnDayKey`, `vnWeekKey`).
 *  2. Chống ghi đè & chống trả tiền đúp bằng `requestId` (nhật ký `ops` hoàn trả `receipt` cũ, chặn `request-id-conflict`).
 *  3. Khóa đồng thời lạc quan `expectedRevision` -> `revision` (`revision-conflict` khi mở 2 tab).
 *  4. Tối ưu băng thông `catalogHash` (lược bỏ `catalog` khi mã băm không đổi).
 *  5. Ví kép Gringotts riêng của Hang Sóc (`burrow_wallets`, sổ cái bất biến `burrow_ledger`, kiểm nguyên liệu trước rồi mới trừ Galleons sau cùng).
 *  6. Chu kỳ kinh tế ủy quyền `1h -> 2^n` & giảm `-10 phút` khi thắng mini game, chặn tua đồng hồ máy khách.
 *  7. Thăm thung lũng người chơi thật, khóa cứng `5 lượt hỗ trợ/ngày` theo lịch VN, ghi `burrow_helpers` thông báo cho chủ vườn.
 *  8. Bộ Callable RPC riêng miền `Burrow` (`*Burrow*`), hoàn toàn độc lập và không chạm tới backend Hagrid Farm.
 */

export interface MemberIdentityProfile {
  house?: HogwartsHouseName;
  username?: string;
  avatarUrl?: string;
}

export interface BackendKVStore {
  get(key: string, type?: 'text'): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  transact?<T>(
    keys: string[],
    fn: (txStore: Pick<BackendKVStore, 'get' | 'put' | 'delete'>) => Promise<T>
  ): Promise<T>;
  appendLedgerEntries?(uid: string, entries: GringottsLedgerEntry[]): Promise<void>;
  mutateWallet?(
    uid: string,
    mutator: (current: GringottsWalletDoc | null) => GringottsWalletDoc
  ): Promise<GringottsWalletDoc>;
  incrementHouseCup?(
    weekKey: string,
    house: HogwartsHouseName,
    delta: number,
    nowMs: number,
    rewardMin: number
  ): Promise<HouseCupWeekDoc>;
  resolveMemberIdentityProfile?(uid: string): Promise<MemberIdentityProfile | null>;
}

export class MemoryBackendKVStore implements BackendKVStore {
  private readonly map = new Map<string, { value: string; expiresAt: number | null }>();
  private readonly nowFn: () => number;

  constructor(nowFn: () => number = () => Date.now()) {
    this.nowFn = nowFn;
  }

  public async get(key: string): Promise<string | null> {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && this.nowFn() >= entry.expiresAt) {
      this.map.delete(key);
      return null;
    }
    return entry.value;
  }

  public async put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void> {
    const expiresAt =
      options?.expirationTtl && options.expirationTtl > 0
        ? this.nowFn() + options.expirationTtl * 1000
        : null;
    this.map.set(key, { value, expiresAt });
  }

  public async delete(key: string): Promise<void> {
    this.map.delete(key);
  }

  public dumpEntries(): Record<string, string> {
    const out: Record<string, string> = {};
    const now = this.nowFn();
    for (const [k, v] of this.map.entries()) {
      if (v.expiresAt === null || now < v.expiresAt) {
        out[k] = v.value;
      }
    }
    return out;
  }
}

export type HogwartsHouseName = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

export type ServerRefusalReason =
  | 'invalid-request-id'
  | 'request-id-conflict'
  | 'revision-conflict'
  | 'missing-crops'
  | 'missing-supply'
  | 'insufficient-galleons'
  | 'insufficient-balance'
  | 'insufficient-stars'
  | 'wallet-frozen'
  | 'market-closed'
  | 'price-changed'
  | 'daily-cap'
  | 'daily-help-cap'
  | 'host-help-cap'
  | 'stock-cap'
  | 'already-claimed'
  | 'already-helped'
  | 'already-boosted'
  | 'nothing-to-help'
  | 'visit-not-found'
  | 'quest-incomplete'
  | 'festival-incomplete'
  | 'festival-not-found'
  | 'timer-not-ready'
  | 'timer-ready'
  | 'invalid-boost-target'
  | 'invalid-care-target'
  | 'invalid-action-input'
  | 'action-noop'
  | 'unknown-action'
  | 'unknown-callable'
  | 'unknown-item'
  | 'unknown-order'
  | 'not-for-sale'
  | 'no-fire'
  | 'frame-locked'
  | 'forbidden-admin'
  | 'unauthorized'
  | 'rate-limited'
  | 'server-misconfigured'
  | 'sandbox-forbidden'
  | 'friend-code-taken'
  | 'payload-too-large';

export class BurrowServerError extends Error {
  public readonly definitive = true;
  public readonly reason: ServerRefusalReason;
  public readonly details: Record<string, unknown>;
  public readonly httpStatus: number;

  constructor(
    reason: ServerRefusalReason,
    message: string,
    details: Record<string, unknown> = {},
    httpStatus = 400
  ) {
    super(message);
    this.name = 'BurrowServerError';
    this.reason = reason;
    this.details = { reason, ...details };
    this.httpStatus = httpStatus;
  }
}

export const VN_TIMEZONE_OFFSET_MS = 7 * 3600_000; // Asia/Ho_Chi_Minh (cố định UTC+7, không DST)
export const BASE_ECONOMIC_CYCLE_MS = 60 * 60 * 1000; // Chu kỳ kinh tế lần đầu = 1 giờ
export const MAX_ECONOMIC_CYCLE_MS = 6 * 60 * 60 * 1000; // Trần tối đa chu kỳ kinh tế = 6 tiếng
export const MINIGAME_WIN_REDUCTION_MS = 10 * 60 * 1000; // Thắng 1 màn mini game giảm 10 phút
export const FRIEND_HELP_SPEEDUP_MS = 15 * 60 * 1000; // Bạn bè sang chăm giúp giảm 15 phút
export const CARE_BOOST_SPEED_SHARE = 0.25; // Tưới nước / Nước phép giảm 25% thời gian
export const MAX_DAILY_FRIEND_HELPS = 5; // Khóa cứng 5 lượt hỗ trợ bạn bè / ngày VN
export const MAX_DAILY_HOST_HELPS_RECEIVED = 10; // Tối đa 10 lượt nhận chăm giúp / thung lũng / ngày VN
export const FLOO_VISIT_UNLOCK_LEVEL = 10; // Cấp mở Cổng Bay Floo Cộng Đồng chuẩn Hagrid's Garden
export const MAX_DAILY_HOUSE_CUP_MEMBER_POINTS = 60; // Tối đa 60 điểm Cúp Nhà / thành viên / ngày VN
export const HOUSE_CUP_REWARD_MIN_POINTS = 20; // Tối thiểu 20 điểm tuần để nhận thưởng Cúp Nhà
export const CATALOG_VERSION = 'burrow-25.1';

const GENERIC_SERVER_PLAYER_NAMES = new Set([
  'trang trại hang sóc',
  'phù thủy hang sóc',
  'người chơi trực tuyến',
  'điền trang phép thuật',
  'tân phù thủy hang sóc',
  'người chơi thật',
  'bạn',
  'bạn hpvn',
  'khách',
  'anonymous',
  'anonymous_user',
  'local_player',
]);

function isGeneratedGuestBackendUid(uid: unknown): boolean {
  const clean = typeof uid === 'string' ? uid.trim() : '';
  if (!clean) return true;
  return /^(hs_[a-z0-9]+_[a-z0-9]+|anon(?:ymous)?(?:_user)?|local_player)$/i.test(clean);
}

function isPlaceholderServerFriendCode(code: unknown): boolean {
  const clean = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!clean) return true;
  return (
    clean === 'HS-YOU1-01' ||
    clean === 'HS-CLUD-00' ||
    clean === 'HS-CLUD-01' ||
    clean === 'HS-PLAYER-01' ||
    clean.startsWith('FLOO-') ||
    clean.startsWith('HS-SEED-')
  );
}

function normalizeDistinctServerNickname(rawName: unknown): string | null {
  if (typeof rawName !== 'string') return null;
  const stripped = rawName
    .replace(/\s*\(Bạn\)\s*$/iu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
  if (stripped.length < 2) return null;
  if (GENERIC_SERVER_PLAYER_NAMES.has(stripped)) return null;
  if (/^phù thủy\s+[a-z0-9_-]{1,12}$/iu.test(stripped)) return null;
  if (/^thung lũng(?:\s+của)?\s+/iu.test(stripped)) return null;
  if (/^người chơi\s+[a-z0-9-]*$/iu.test(stripped)) return null;
  return stripped;
}

function visitRowAuthorityScore(row: VisitDirectorySummaryRow): number {
  let score = 0;
  if (!isGeneratedGuestBackendUid(row.uid)) score += 1000;
  if (row.houseVerified) score += 200;
  if (row.house && row.house !== 'Gryffindor') score += 80;
  if (!isPlaceholderServerFriendCode(row.friendCode)) score += 30;
  if (normalizeDistinctServerNickname(row.username) !== null) score += 20;
  if (row.avatarUrl) score += 15;
  return score;
}

function mergeVisitDirectoryRows(
  a: VisitDirectorySummaryRow,
  b: VisitDirectorySummaryRow
): VisitDirectorySummaryRow {
  const diff = visitRowAuthorityScore(b) - visitRowAuthorityScore(a);
  const primary =
    diff > 0 || (diff === 0 && (b.updatedAt || 0) > (a.updatedAt || 0)) ? b : a;
  const secondary = primary === a ? b : a;
  return {
    ...secondary,
    ...primary,
    uid: primary.uid,
    friendCode: !isPlaceholderServerFriendCode(primary.friendCode)
      ? primary.friendCode
      : secondary.friendCode || primary.friendCode,
    username:
      normalizeDistinctServerNickname(primary.username) !== null
        ? primary.username
        : normalizeDistinctServerNickname(secondary.username) !== null
          ? secondary.username
          : primary.username,
    parkName: primary.parkName || secondary.parkName,
    house:
      primary.houseVerified || !isGeneratedGuestBackendUid(primary.uid)
        ? primary.house === 'Gryffindor' &&
          !primary.houseVerified &&
          secondary.house &&
          secondary.house !== 'Gryffindor'
          ? secondary.house
          : primary.house
        : secondary.house && secondary.house !== 'Gryffindor'
          ? secondary.house
          : primary.house,
    ...(primary.houseVerified || secondary.houseVerified ? { houseVerified: true } : {}),
    avatarEmoji: primary.avatarEmoji || secondary.avatarEmoji,
    ...(primary.avatarUrl || secondary.avatarUrl
      ? { avatarUrl: primary.avatarUrl || secondary.avatarUrl }
      : {}),
    level: Math.max(primary.level || 1, secondary.level || 1),
    updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0),
  };
}

function deduplicateVisitDirectoryRows(
  rows: ReadonlyArray<VisitDirectorySummaryRow>
): VisitDirectorySummaryRow[] {
  const out: VisitDirectorySummaryRow[] = [];
  for (const row of rows) {
    if (!row || !row.uid) continue;
    const code = (row.friendCode || '').trim().toUpperCase();
    const hasCode = !isPlaceholderServerFriendCode(code);
    const nick = normalizeDistinctServerNickname(row.username);

    const idx = out.findIndex((ex) => {
      if (ex.uid === row.uid) return true;
      const exCode = (ex.friendCode || '').trim().toUpperCase();
      if (hasCode && !isPlaceholderServerFriendCode(exCode) && exCode === code) return true;
      const exNick = normalizeDistinctServerNickname(ex.username);
      return nick !== null && exNick !== null && nick === exNick;
    });

    if (idx >= 0) {
      out[idx] = mergeVisitDirectoryRows(out[idx], row);
    } else {
      out.push(row);
    }
  }
  return out;
}

function serverLeaderboardItemAuthority(
  item: Record<string, unknown>,
  dirByUid: Map<string, VisitDirectorySummaryRow>
): number {
  const uid = String(item.userId || '');
  const dirRow = dirByUid.get(uid);
  let score = 0;
  if (!isGeneratedGuestBackendUid(uid)) score += 1000;
  if (dirRow?.houseVerified) score += 200;
  const h = normalizeHogwartsHouse(item.house);
  if (h && h !== 'Gryffindor') score += 80;
  if (!isPlaceholderServerFriendCode(item.friendCode)) score += 30;
  if (normalizeDistinctServerNickname(item.name) !== null) score += 20;
  return score;
}

function mergeServerLeaderboardItems(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  dirByUid: Map<string, VisitDirectorySummaryRow>
): Record<string, unknown> {
  const authDiff =
    serverLeaderboardItemAuthority(b, dirByUid) -
    serverLeaderboardItemAuthority(a, dirByUid);
  const pvA = Math.max(0, Math.floor(Number(a.primaryValue) || 0));
  const pvB = Math.max(0, Math.floor(Number(b.primaryValue) || 0));
  const rsA = Math.max(0, Math.floor(Number(a.ratingScore) || 0));
  const rsB = Math.max(0, Math.floor(Number(b.ratingScore) || 0));
  const twA = Math.max(0, Math.floor(Number(a.totalWins) || 0));
  const twB = Math.max(0, Math.floor(Number(b.totalWins) || 0));
  const bsA = Math.max(0, Math.floor(Number(a.bestStreak) || 0));
  const bsB = Math.max(0, Math.floor(Number(b.bestStreak) || 0));
  const upA = Math.floor(Number(a.updatedAt) || 0);
  const upB = Math.floor(Number(b.updatedAt) || 0);

  const primary =
    authDiff > 0 ||
    (authDiff === 0 &&
      (pvB > pvA ||
        (pvB === pvA && rsB > rsA) ||
        (pvB === pvA && rsB === rsA && upB > upA)))
      ? b
      : a;
  const secondary = primary === a ? b : a;

  const bestPrimary = Math.max(pvA, pvB);
  const bestRating =
    pvB > pvA ? rsB : pvA > pvB ? rsA : Math.max(rsA, rsB);
  const bestWins = Math.max(twA, twB);
  const bestStreak = Math.max(bsA, bsB);
  const bestDetail =
    pvB > pvA
      ? String(b.detailLabelVi || a.detailLabelVi || '')
      : pvA > pvB
        ? String(a.detailLabelVi || b.detailLabelVi || '')
        : String(primary.detailLabelVi || secondary.detailLabelVi || '');

  const pUid = String(primary.userId || '');
  const sUid = String(secondary.userId || '');
  const pDir = dirByUid.get(pUid);
  const pHouse = normalizeHogwartsHouse(primary.house);
  const sHouse = normalizeHogwartsHouse(secondary.house);
  const resolvedHouse: HogwartsHouseName =
    pDir?.houseVerified && pHouse
      ? pHouse
      : !isGeneratedGuestBackendUid(pUid) && pHouse
        ? pHouse === 'Gryffindor' &&
          sHouse &&
          sHouse !== 'Gryffindor' &&
          !isGeneratedGuestBackendUid(sUid)
          ? sHouse
          : pHouse
        : sHouse && sHouse !== 'Gryffindor'
          ? sHouse
          : pHouse ?? sHouse ?? 'Gryffindor';

  const resolvedCode = !isPlaceholderServerFriendCode(primary.friendCode)
    ? String(primary.friendCode)
    : !isPlaceholderServerFriendCode(secondary.friendCode)
      ? String(secondary.friendCode)
      : String(primary.friendCode || secondary.friendCode || 'HS-CLUD-01');

  const resolvedName =
    normalizeDistinctServerNickname(primary.name) !== null
      ? String(primary.name)
      : normalizeDistinctServerNickname(secondary.name) !== null
        ? String(secondary.name)
        : String(primary.name || secondary.name || 'Phù Thủy Hang Sóc');

  return {
    ...secondary,
    ...primary,
    userId: pUid,
    name: resolvedName.slice(0, 42),
    parkName: String(primary.parkName || secondary.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
    friendCode: resolvedCode,
    avatarEmoji: String(primary.avatarEmoji || secondary.avatarEmoji || '🧙‍♂️').slice(0, 8),
    house: resolvedHouse,
    primaryValue: bestPrimary,
    ratingScore: bestRating,
    totalWins: bestWins,
    bestStreak: bestStreak,
    detailLabelVi: bestDetail.slice(0, 64),
    updatedAt: Math.max(upA, upB),
  };
}

function deduplicateServerLeaderboardItems(
  items: ReadonlyArray<Record<string, unknown>>,
  dirByUid: Map<string, VisitDirectorySummaryRow>
): Array<Record<string, unknown>> {
  const out: Array<Record<string, unknown>> = [];
  for (const item of items) {
    if (!item || typeof item.userId !== 'string' || !item.userId.trim()) continue;
    const uid = item.userId.trim();
    const code = String(item.friendCode || '').trim().toUpperCase();
    const hasCode = !isPlaceholderServerFriendCode(code);
    const nick = normalizeDistinctServerNickname(item.name);

    const idx = out.findIndex((ex) => {
      if (String(ex.userId || '').trim() === uid) return true;
      const exCode = String(ex.friendCode || '').trim().toUpperCase();
      if (hasCode && !isPlaceholderServerFriendCode(exCode) && exCode === code) return true;
      const exNick = normalizeDistinctServerNickname(ex.name);
      return nick !== null && exNick !== null && nick === exNick;
    });

    if (idx >= 0) {
      out[idx] = mergeServerLeaderboardItems(out[idx], item, dirByUid);
    } else {
      out.push(item);
    }
  }
  return out;
}

export const FREE_ACTION_CAPS: Readonly<Record<string, number>> = Object.freeze({
  pet: 3,
  rotate: 3,
  postcard: 1,
  shareFloo: 1,
  startTour: 1,
  care: 3,
  moveBuilding: 1,
});

/**
 * Tính khóa ngày `YYYY-MM-DD` chuẩn múi giờ Việt Nam (`Asia/Ho_Chi_Minh`, UTC+7) từ đồng hồ máy chủ.
 * Tuyệt đối miễn nhiễm với việc người chơi chỉnh giờ hoặc đổi múi giờ trên thiết bị.
 */
export function vnDayKey(nowMs: number): string {
  const d = new Date(nowMs + VN_TIMEZONE_OFFSET_MS);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function vnYesterdayKey(dayKey: string): string {
  const noonVnMs = Date.parse(`${dayKey}T12:00:00+07:00`);
  return vnDayKey(noonVnMs - 86_400_000);
}

/**
 * Khóa tuần ISO neo vào Thứ Hai 00:00 giờ Việt Nam (`YYYY-Www`) cho Cúp Nhà Hogwarts hàng tuần.
 */
export function vnWeekKey(nowMs: number): string {
  const d = new Date(nowMs + VN_TIMEZONE_OFFSET_MS);
  const utcDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = utcDate.getUTCDay() || 7; // Thứ Hai = 1 .. Chủ Nhật = 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Chuẩn hóa JSON theo thứ tự khóa từ điển để băm payload `requestId` nhất quán 100%.
 */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(',')}}`;
}

export function fnv1aHashHex(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * Công thức chu kỳ kinh tế ủy quyền (trừ mini game):
 * - Lần đầu tiên (`completedCount === 0`): đúng `1 tiếng` (`3.600.000 ms`).
 * - Các lần tiếp theo: tăng theo cấp số nhân `1h × 2^completedCount` (`2h`, `4h`) và kẹp trần tối đa `6 tiếng`.
 */
export function computeAuthoritativeEconomicDurationMs(completedCount: number): number {
  const safeCount = Math.max(0, Math.min(10, Math.floor(Number(completedCount) || 0)));
  return Math.min(MAX_ECONOMIC_CYCLE_MS, BASE_ECONOMIC_CYCLE_MS * Math.pow(2, safeCount));
}

export interface StoreCatalogEntry {
  id: string;
  label: string;
  kind: 'seed' | 'water' | 'boost' | 'supply' | 'decoration';
  price: number;
  quantity: number;
  unlockLevel: number;
  dailyLimit: number;
  overflowMultiplier?: number;
  stockCap?: number;
  cropId?: string;
  supplyKey?: 'phoenixTalismans' | 'timeSand';
  forSale?: boolean;
}

export const BURROW_STORE_CATALOG: ReadonlyArray<StoreCatalogEntry> = Object.freeze([
  {
    id: 'seed_wheat',
    label: 'Hạt Lúa Mì Hang Sóc (×3)',
    kind: 'seed',
    cropId: 'wheat',
    price: 6,
    quantity: 3,
    unlockLevel: 1,
    dailyLimit: 20,
    overflowMultiplier: 1.5,
  },
  {
    id: 'seed_pumpkin',
    label: 'Hạt Bí Ngô Khổng Lồ (×3)',
    kind: 'seed',
    cropId: 'pumpkin',
    price: 12,
    quantity: 3,
    unlockLevel: 1,
    dailyLimit: 15,
    overflowMultiplier: 1.5,
  },
  {
    id: 'seed_strawberry',
    label: 'Hạt Dâu Tây Mọng Đỏ (×3)',
    kind: 'seed',
    cropId: 'strawberry',
    price: 18,
    quantity: 3,
    unlockLevel: 3,
    dailyLimit: 12,
  },
  {
    id: 'seed_mandrake',
    label: 'Mầm Nhân Sâm Mandrake (×2)',
    kind: 'seed',
    cropId: 'mandrake',
    price: 35,
    quantity: 2,
    unlockLevel: 8,
    dailyLimit: 8,
  },
  {
    id: 'water_pack',
    label: 'Bình Nước Phép Aguamenti (×6)',
    kind: 'water',
    price: 10,
    quantity: 6,
    unlockLevel: 1,
    dailyLimit: 15,
    overflowMultiplier: 1.5,
  },
  {
    id: 'herb_boost',
    label: 'Phân Bón Thảo Dược Bà Sprout',
    kind: 'boost',
    price: 28,
    quantity: 1,
    unlockLevel: 2,
    dailyLimit: 6,
    stockCap: 25,
  },
  {
    id: 'phoenix_talisman_pack',
    label: 'Bùa Hộ Mệnh Phượng Hoàng 🔥',
    kind: 'supply',
    supplyKey: 'phoenixTalismans',
    price: 95,
    quantity: 1,
    unlockLevel: 5,
    dailyLimit: 2,
    stockCap: 12,
  },
  {
    id: 'decor_burrow_lantern',
    label: 'Đèn Lồng Ấm Hang Sóc',
    kind: 'decoration',
    price: 120,
    quantity: 1,
    unlockLevel: 4,
    dailyLimit: 1,
  },
  {
    id: 'decor_broom_rack',
    label: 'Giá Treo Chổi Bay Quidditch',
    kind: 'decoration',
    price: 240,
    quantity: 1,
    unlockLevel: 10,
    dailyLimit: 1,
  },
]);

export const MARKET_SELL_PRICES: Readonly<Record<string, number>> = Object.freeze({
  wheat: 8,
  pumpkin: 16,
  strawberry: 24,
  carrot: 10,
  corn: 14,
  apple: 20,
  mandrake: 48,
  gillyweed: 52,
  milk: 22,
  egg: 18,
  wool: 28,
  honey: 32,
  apple_pie: 65,
  butterbeer_cask: 85,
  pumpkin_pasties: 58,
  treacle_tart: 72,
  // 22 giống cây trồng & hoa cảnh chuẩn catalog Hang Sóc (`FARM_CROPS`)
  ottery_wheat: 3,
  honey_carrot: 4,
  garden_pumpkin: 5,
  golden_corn: 7,
  crisp_cabbage: 8,
  ruby_strawberry: 10,
  burrow_apple: 6,
  burrow_potato: 14,
  baby_mandrake: 18,
  ruby_tomato: 21,
  dew_blueberry: 30,
  dried_lavender: 38,
  hedge_sunflower: 62,
  glow_mushroom: 80,
  meadow_daisy: 4,
  english_rose: 6,
  golden_daffodil: 11,
  rainbow_tulip: 16,
  forest_bluebell: 25,
  blush_peony: 48,
  moonlight_flower: 104,
  phoenix_fireflower: 136,
  // 14 đặc sản xưởng chế biến Hang Sóc (`FARM_GOODS`)
  cinnamon_apple_pie: 16,
  pumpkin_pie: 17,
  cream_mushroom_soup: 22,
  weasley_sweater_w: 19,
  farm_egg_wool: 11,
  fine_wheat_flour: 10,
  blossom_honey_jar: 17,
  honey_apple_cider: 22,
  muggle_plug_kit: 24,
  frothy_butterbeer: 24,
  choc_frog_sweet: 25,
  sprout_growth_elixir: 28,
  floral_bouquet_gift: 20,
  creamy_dairy_milk: 15,
});

export interface BuildBlueprintSpec {
  id: string;
  label: string;
  unlockLevel: number;
  starCost: number;
  galleonCost: number;
  cropCost: Record<string, number>;
}

export const AUTHORITATIVE_BUILD_SPECS: Readonly<Record<string, BuildBlueprintSpec>> = Object.freeze({
  molly_bakery: {
    id: 'molly_bakery',
    label: 'Lò Nướng Bánh Táo Bà Molly',
    unlockLevel: 1,
    starCost: 1,
    galleonCost: 120,
    cropCost: { wheat: 3 },
  },
  butterbeer_mill: {
    id: 'butterbeer_mill',
    label: 'Xưởng Ủ Bia Bơ Hogsmeade',
    unlockLevel: 3,
    starCost: 2,
    galleonCost: 350,
    cropCost: { wheat: 6, pumpkin: 4 },
  },
  honeydukes_sweetshop: {
    id: 'honeydukes_sweetshop',
    label: 'Tiệm Kẹo Công Tước Mật',
    unlockLevel: 5,
    starCost: 3,
    galleonCost: 750,
    cropCost: { strawberry: 6, pumpkin: 6 },
  },
  pasture_barn_expansion: {
    id: 'pasture_barn_expansion',
    label: 'Đồng Cỏ Chăn Thả Mở Rộng',
    unlockLevel: 4,
    starCost: 2,
    galleonCost: 480,
    cropCost: { wheat: 8 },
  },
});

export type EconomicDomain = 'crop' | 'pasture' | 'workshop' | 'brew' | 'construction';

export interface AuthoritativeTimerEntry {
  timerId: string;
  domain: EconomicDomain;
  targetId: string;
  qty: number;
  startedAt: number;
  readyAt: number;
  boosted: boolean;
  cared: boolean;
}

export interface DailyQuestItem {
  id: string;
  title: string;
  triggers: string[];
  target: number;
  progress: number;
  claimed: boolean;
  reward: {
    kind: 'water' | 'boost' | 'galleons';
    amount: number;
    label: string;
  };
}

export interface BurrowAuthoritativeStateDoc {
  uid: string;
  revision: number;
  createdAt: number;
  updatedAt: number;
  parkName: string;
  playerName: string;
  friendCode: string;
  avatarEmoji: string;
  avatarUrl?: string;
  house: HogwartsHouseName;
  houseSource?: 'hpvn' | 'player' | 'default';
  level: number;
  xp: number;
  magicStars: number;
  timeSand: number;
  phoenixTalismans: number;
  friendshipTokens: number;
  inventory: Record<string, number>;
  supplies: {
    seeds: Record<string, number>;
    water: number;
    boost: number;
  };
  decorations: {
    owned: string[];
    placements: Array<string | null>;
    rotations: Record<string, 'default' | 'right'>;
    scene: {
      weather: string;
      atmosphere: string;
      event: string;
    };
  };
  flooFrames: {
    unlocked: string[];
    worn: string;
  };
  economicCycles: Record<EconomicDomain, number>;
  timers: AuthoritativeTimerEntry[];
  builtIds: string[];
  guideDone: string[];
  festival: {
    seasonKey: string;
    points: number;
    claimedMilestones: string[];
  };
  achievementsClaimed: string[];
  clearanceUsed: boolean;
  minigameRecords: Record<
    string,
    {
      bestStage: number;
      ratingScore: number;
      totalWins: number;
      bestStreak: number;
      updatedAt: number;
    }
  >;
  rawClientSave?: Record<string, unknown>;
}

export interface OpReceiptRecord {
  hash: string;
  receipt: Record<string, unknown>;
  committedAt: number;
}

export interface BurrowDailyDoc {
  dayKey: string;
  uid: string;
  streakDays: number;
  quests: DailyQuestItem[];
  chestClaimed: boolean;
  bonusQuests: DailyQuestItem[];
  bonusChestClaimed: boolean;
  helpsGivenCount: number;
  helpedHostUids: string[];
  rescuesGivenCount: number;
  rescuedHostUids: string[];
  owlHelpsRequestedCount: number;
  freeActions: Record<string, number>;
  storeBoughtByItem: Record<string, number>;
  marketEarnedGalleons: number;
  marketSoldByItem: Record<string, number>;
  houseCupPointsToday: number;
  ops: Record<string, OpReceiptRecord>;
}

export interface GringottsWalletDoc {
  uid: string;
  spendable: number;
  balance: number;
  bankBalance: number;
  frozen: boolean;
  updatedAt: number;
}

export interface GringottsLedgerEntry {
  txId: string;
  requestId: string;
  uid: string;
  type: 'debit' | 'credit';
  amount: number;
  fromBank: number;
  fromPocket: number;
  balanceAfter: number;
  sourceType:
    | 'burrow-garden-store'
    | 'burrow-garden-build'
    | 'burrow-garden-market'
    | 'burrow-garden-order'
    | 'burrow-garden-visit'
    | 'burrow-garden-fire'
    | 'burrow-garden-admin';
  reasonCode: string;
  createdAt: number;
}

export interface HelperVisitNotification {
  id: string;
  uid: string;
  name: string;
  avatarEmoji: string;
  avatarUrl?: string;
  kind: 'water_crop' | 'tend_yard' | 'stoke_workshop';
  buildingUid?: string;
  noteText: string;
  at: number;
}

export interface SalesAdminConfigDoc {
  revision: number;
  marketOff: boolean;
  discountPercent: number; // 0..40
  priceOverrides: Record<string, number>;
  dailyCapGalleons: number;
  masteryDailyCapGalleons: number;
  perItemDailyCap: number;
  updatedAt: number;
}

export interface HouseCupWeekDoc {
  weekKey: string;
  houses: Record<HogwartsHouseName, number>;
  rewardMin: number;
  updatedAt: number;
}

export interface CoopAssistanceRequestDoc {
  requestId: string;
  hostUid: string;
  hostName: string;
  hostEmoji: string;
  kind: 'owl_crate' | 'minigame_sos';
  orderId?: string;
  reqIndex?: number;
  itemId?: string;
  qty?: number;
  minigameKind?: string;
  stage?: number;
  createdAt: number;
  fulfilledAt?: number;
  helperUid?: string;
  helperName?: string;
  helperEmoji?: string;
  ghostReplaySummaryVi?: string;
  ghostReplayMoves?: string[];
}

export interface VerifiedSessionIdentity {
  uid: string;
  house: HogwartsHouseName;
  houseExplicit?: boolean;
  role: 'member' | 'saleAdmin';
  authenticatedVia:
    | 'hmac-jwt'
    | 'firebase-id-token'
    | 'hpvn-ticket'
    | 'emulator-jwt'
    | 'hpvn-header'
    | 'legacy-header';
  username?: string;
  avatarUrl?: string;
}

export interface BurrowBackendOptions {
  store: BackendKVStore;
  now?: () => number;
  hmacSecret?: string;
  adminToken?: string;
  allowEmulatorTokens?: boolean;
  isProduction?: boolean;
  requireVerifiedAuth?: boolean;
  verifyExternalToken?: (rawToken: string) => Promise<VerifiedSessionIdentity | null>;
  initialGalleons?: number;
  initialBankGalleons?: number;
}

export const KNOWN_WEAK_DEV_SECRETS = new Set<string>([
  'burrow-hogsmeade-default-dev-hmac-v1',
  'hpvn-burrow-asia-southeast1-hmac-v1',
  'burrow-hph-admin-token',
  'hpvn-burrow-sale-admin',
]);

export const SCORED_SERVER_LEADERBOARD_GAMES = new Set<string>([
  'match3',
  'sudoku',
  'blocks',
  'jigsaw',
]);

export function isWeakOrDefaultSecret(secret: string | undefined | null): boolean {
  if (typeof secret !== 'string') return true;
  const trimmed = secret.trim();
  if (trimmed.length < 12) return true;
  return KNOWN_WEAK_DEV_SECRETS.has(trimmed);
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i++) {
    const av = i < aBytes.length ? aBytes[i] : 0;
    const bv = i < bBytes.length ? bBytes[i] : 0;
    diff |= av ^ bv;
  }
  return diff === 0;
}

export function extractSanitizedPublicValleySave(
  saveBody: Record<string, unknown>
): Record<string, unknown> {
  const cleanBuildings: Array<Record<string, unknown>> = [];
  if (Array.isArray(saveBody.buildings)) {
    for (const rawB of saveBody.buildings.slice(0, 260)) {
      if (!rawB || typeof rawB !== 'object') continue;
      const b = rawB as Record<string, unknown>;
      if (typeof b.uid !== 'string' || typeof b.itemId !== 'string') continue;
      const item: Record<string, unknown> = {
        uid: b.uid.slice(0, 64),
        itemId: b.itemId.slice(0, 64),
        gx: Math.floor(Number(b.gx) || 0),
        gy: Math.floor(Number(b.gy) || 0),
        rotation: Math.floor(Number(b.rotation) || 0) % 4,
        stars: Math.max(0, Math.min(5, Math.floor(Number(b.stars) || 0))),
      };
      if (typeof b.cropId === 'string') item.cropId = b.cropId.slice(0, 48);
      if (typeof b.cropPlantedAt === 'number' && Number.isFinite(b.cropPlantedAt)) {
        item.cropPlantedAt = Math.floor(b.cropPlantedAt);
      }
      if (typeof b.cropReadyAt === 'number' && Number.isFinite(b.cropReadyAt)) {
        item.cropReadyAt = Math.floor(b.cropReadyAt);
      }
      if (typeof b.cropWateredBoost === 'boolean') item.cropWateredBoost = b.cropWateredBoost;
      if (typeof b.pastureAnimalId === 'string') item.pastureAnimalId = b.pastureAnimalId.slice(0, 48);
      if (typeof b.pastureReadyAt === 'number' && Number.isFinite(b.pastureReadyAt)) {
        item.pastureReadyAt = Math.floor(b.pastureReadyAt);
      }
      if (typeof b.constructionFinishAt === 'number' && Number.isFinite(b.constructionFinishAt)) {
        item.constructionFinishAt = Math.floor(b.constructionFinishAt);
      }
      if (typeof b.pendingRibbonUnveil === 'boolean') {
        item.pendingRibbonUnveil = b.pendingRibbonUnveil;
      }
      cleanBuildings.push(item);
    }
  }

  let cleanOverrides: Record<string, unknown> | undefined;
  if (saveBody.tileOverrides && typeof saveBody.tileOverrides === 'object' && !Array.isArray(saveBody.tileOverrides)) {
    const entries = Object.entries(saveBody.tileOverrides as Record<string, unknown>).slice(0, 1500);
    if (entries.length > 0) {
      cleanOverrides = Object.fromEntries(entries);
    }
  }

  const cleanZones = Array.isArray(saveBody.unlockedZones)
    ? saveBody.unlockedZones
        .filter((z): z is string => typeof z === 'string')
        .map((z) => z.slice(0, 40))
        .slice(0, 12)
    : undefined;

  return {
    version: Math.max(1, Math.floor(Number(saveBody.version) || 1)),
    parkName: String(saveBody.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
    name: String(saveBody.name || saveBody.parkName || 'Phù Thủy Hang Sóc').slice(0, 42),
    level: Math.max(1, Math.min(100, Math.floor(Number(saveBody.level) || 1))),
    ...(typeof saveBody.house === 'string' ? { house: saveBody.house.slice(0, 24) } : {}),
    ...(cleanBuildings.length > 0 ? { buildings: cleanBuildings } : {}),
    ...(cleanOverrides ? { tileOverrides: cleanOverrides } : {}),
    ...(cleanZones && cleanZones.length > 0 ? { unlockedZones: cleanZones } : {}),
  };
}

const VALID_HOUSES = new Set<HogwartsHouseName>([
  'Gryffindor',
  'Hufflepuff',
  'Ravenclaw',
  'Slytherin',
]);

/**
 * Chuẩn hóa tên Nhà Hogwarts không phân biệt hoa/thường, slug viết tắt hoặc tên tiếng Việt.
 * Trả về `null` khi không có giá trị hoặc không khớp 4 nhà (không tự ý ép sang Gryffindor sớm).
 */
export function normalizeHogwartsHouse(raw: unknown): HogwartsHouseName | null {
  if (typeof raw !== 'string') return null;
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  if (
    s === 'hufflepuff' ||
    s === 'huff' ||
    s.includes('hufflepuff') ||
    s.includes('lửng')
  ) {
    return 'Hufflepuff';
  }
  if (
    s === 'ravenclaw' ||
    s === 'raven' ||
    s.includes('ravenclaw') ||
    s.includes('ưng') ||
    s.includes('quạ')
  ) {
    return 'Ravenclaw';
  }
  if (
    s === 'slytherin' ||
    s === 'slyth' ||
    s.includes('slytherin') ||
    s.includes('rắn')
  ) {
    return 'Slytherin';
  }
  if (
    s === 'gryffindor' ||
    s === 'gryff' ||
    s.includes('gryffindor') ||
    s.includes('sư tử')
  ) {
    return 'Gryffindor';
  }
  return null;
}

const HOUSE_CANDIDATE_KEYS = [
  'house',
  'hogwartsHouse',
  'hogwarts_house',
  'houseName',
  'house_name',
  'houseId',
  'house_id',
  'sortedHouse',
  'sorted_house',
  'faction',
] as const;

export function extractHouseFromRecord(
  obj: Record<string, unknown> | undefined | null
): HogwartsHouseName | null {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of HOUSE_CANDIDATE_KEYS) {
    const parsed = normalizeHogwartsHouse(obj[key]);
    if (parsed) return parsed;
  }
  for (const nestedKey of ['profile', 'member', 'character', 'claims', 'customClaims'] as const) {
    const nested = obj[nestedKey];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      const nObj = nested as Record<string, unknown>;
      for (const key of HOUSE_CANDIDATE_KEYS) {
        const parsed = normalizeHogwartsHouse(nObj[key]);
        if (parsed) return parsed;
      }
    }
  }
  return null;
}

export function extractMemberProfileFields(
  obj: Record<string, unknown> | undefined | null
): MemberIdentityProfile {
  if (!obj || typeof obj !== 'object') return {};
  const house = extractHouseFromRecord(obj) ?? undefined;
  const pickString = (
    source: Record<string, unknown>,
    keys: ReadonlyArray<string>,
    maxLen: number
  ): string | undefined => {
    for (const k of keys) {
      const val = source[k];
      if (typeof val === 'string' && val.trim()) {
        return val.trim().slice(0, maxLen);
      }
    }
    return undefined;
  };
  const nameKeys = ['username', 'displayName', 'name', 'characterName', 'nickname', 'fullName'];
  const avatarKeys = ['avatarUrl', 'photoURL', 'photoUrl', 'avatar', 'picture'];

  let username = pickString(obj, nameKeys, 42);
  let avatarUrl = pickString(obj, avatarKeys, 260);

  for (const nestedKey of ['profile', 'member', 'character'] as const) {
    const nested = obj[nestedKey];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      const nObj = nested as Record<string, unknown>;
      if (!username) username = pickString(nObj, nameKeys, 42);
      if (!avatarUrl) avatarUrl = pickString(nObj, avatarKeys, 260);
    }
  }

  return {
    ...(house ? { house } : {}),
    ...(username ? { username } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
  };
}

const FEAST_MILESTONES = Object.freeze([
  {
    key: 'feast_tier_1',
    title: 'Mâm Cỗ Đầu Mùa Hang Sóc',
    points: 30,
    reward: { kind: 'water' as const, amount: 10, label: '+10 Nước Phép Aguamenti' },
  },
  {
    key: 'feast_tier_2',
    title: 'Lồng Đèn Bí Ngô Hogsmeade',
    points: 80,
    reward: { kind: 'boost' as const, amount: 2, label: '+2 Phân Bón Thảo Dược' },
  },
  {
    key: 'feast_tier_3',
    title: 'Đại Tiệc Bàn Dài Gia Đình Weasley',
    points: 160,
    reward: { kind: 'galleons' as const, amount: 250, label: '+250 Galleons' },
  },
]);

const BURROW_ACHIEVEMENTS = Object.freeze([
  {
    id: 'ach_first_harvest',
    title: 'Mùa Gặt Đầu Tiên',
    minLevel: 1,
    reward: { kind: 'water' as const, amount: 8, label: '+8 Nước' },
    check: (s: BurrowAuthoritativeStateDoc) =>
      s.economicCycles.crop >= 1 || s.level >= 2,
  },
  {
    id: 'ach_tower_challenger',
    title: 'Tân Binh Khảo Thí Hogwarts',
    minLevel: 2,
    reward: { kind: 'boost' as const, amount: 1, label: '+1 Phân Bón Thảo Dược' },
    check: (s: BurrowAuthoritativeStateDoc) =>
      Object.values(s.minigameRecords).some((r) => r.totalWins >= 1) || s.magicStars >= 3,
  },
  {
    id: 'ach_valley_architect',
    title: 'Kiến Trúc Sư Thung Lũng (Lv.20)',
    minLevel: 20,
    reward: { kind: 'galleons' as const, amount: 300, label: '+300 Galleons' },
    check: (s: BurrowAuthoritativeStateDoc) => s.level >= 20,
  },
]);

function utf8ToBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUtf8(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function hmacSha256Base64Url(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return bytesToBase64Url(new Uint8Array(sig));
}

export function sanitizeBackendUid(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.trim()) return 'default_player';
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  return cleaned || 'default_player';
}

export function sanitizeFriendCode(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 18);
}

export function packTotal(
  entry: StoreCatalogEntry,
  packages: number,
  salesConfig: SalesAdminConfigDoc,
  alreadyBoughtToday = 0
): number {
  const qty = Math.max(1, Math.floor(Number(packages) || 1));
  const rawUnitPrice = salesConfig.priceOverrides[entry.id] ?? entry.price;
  const discountRatio = Math.max(0, Math.min(40, salesConfig.discountPercent)) / 100;
  const discountedUnit = Math.max(1, Math.round(rawUnitPrice * (1 - discountRatio)));

  let total = 0;
  for (let i = 0; i < qty; i++) {
    const idxToday = alreadyBoughtToday + i;
    if (idxToday < entry.dailyLimit) {
      total += discountedUnit;
    } else if (entry.overflowMultiplier && entry.overflowMultiplier > 1) {
      total += Math.ceil(discountedUnit * entry.overflowMultiplier);
    } else {
      total += discountedUnit;
    }
  }
  return total;
}

function buildDailyQuestsForDay(dayKey: string): DailyQuestItem[] {
  const seed = parseInt(fnv1aHashHex(dayKey), 16);
  const harvestTarget = 2 + (seed % 3);
  return [
    {
      id: 'q_plant',
      title: 'Gieo hạt hoặc bắt đầu chu kỳ sản xuất',
      triggers: ['plant', 'startEconomicCycle'],
      target: 2,
      progress: 0,
      claimed: false,
      reward: { kind: 'water', amount: 6, label: '+6 Nước Phép' },
    },
    {
      id: 'q_harvest',
      title: `Thu hoạch ${harvestTarget} mẻ nông sản / chuồng trại`,
      triggers: ['harvest', 'completeEconomicCycle', 'claimAnimals'],
      target: harvestTarget,
      progress: 0,
      claimed: false,
      reward: { kind: 'water', amount: 8, label: '+8 Nước Phép' },
    },
    {
      id: 'q_minigame',
      title: 'Chiến thắng 1 màn Khảo Thí Pháp Thuật',
      triggers: ['minigameClear', 'deliverOrder'],
      target: 1,
      progress: 0,
      claimed: false,
      reward: { kind: 'boost', amount: 1, label: '+1 Phân Bón Thảo Dược' },
    },
  ];
}

function buildBonusQuests(): DailyQuestItem[] {
  return [
    {
      id: 'q_pet',
      title: 'Vuốt ve sinh vật huyền bí 3 lần',
      triggers: ['pet'],
      target: 3,
      progress: 0,
      claimed: false,
      reward: { kind: 'water', amount: 4, label: '+4 Nước Phép' },
    },
    {
      id: 'q_help',
      title: 'Sang chăm giúp 1 thung lũng bạn bè',
      triggers: ['help'],
      target: 1,
      progress: 0,
      claimed: false,
      reward: { kind: 'water', amount: 6, label: '+6 Nước Phép' },
    },
    {
      id: 'q_share',
      title: 'Khoe thung lũng lên Mạng Floo / Bưu thiếp',
      triggers: ['postcard', 'shareFloo'],
      target: 1,
      progress: 0,
      claimed: false,
      reward: { kind: 'water', amount: 4, label: '+4 Nước Phép' },
    },
  ];
}

function buildDailyOwlOrders(dayKey: string, level: number): Array<{
  id: string;
  sender: string;
  items: Record<string, number>;
  galleons: number;
  xp: number;
  cupPoints: number;
}> {
  const h = parseInt(fnv1aHashHex(`orders:${dayKey}:${Math.min(100, level)}`), 16);
  const wheatQty = 2 + (h % 3);
  const pumpkinQty = 1 + ((h >>> 3) % 3);
  return [
    {
      id: `owl-${dayKey}-1`,
      sender: 'Bà Molly Weasley',
      items: { wheat: wheatQty },
      galleons: wheatQty * 14,
      xp: 35,
      cupPoints: 10,
    },
    {
      id: `owl-${dayKey}-2`,
      sender: 'Quán Ba Cây Chổi',
      items: { pumpkin: pumpkinQty },
      galleons: pumpkinQty * 26,
      xp: 50,
      cupPoints: 15,
    },
  ];
}

interface VisitDirectorySummaryRow {
  uid: string;
  friendCode: string;
  username: string;
  parkName: string;
  house: HogwartsHouseName;
  houseVerified?: boolean;
  avatarEmoji: string;
  avatarUrl?: string;
  level: number;
  growing: number;
  timerReadyAts?: number[];
  helpsReceivedDayKey?: string;
  helpsReceivedCount?: number;
  fire?: { mode: string; since: number; until: number } | null;
  scene: { weather: string; atmosphere: string; event: string };
  updatedAt: number;
}

export class BurrowAuthoritativeBackend {
  private readonly store: BackendKVStore;
  private readonly now: () => number;
  private readonly hmacSecret: string;
  private readonly adminToken: string;
  private readonly allowEmulatorTokens: boolean;
  private readonly isProduction: boolean;
  private readonly requireVerifiedAuth: boolean;
  private readonly verifyExternalToken?: (
    rawToken: string
  ) => Promise<VerifiedSessionIdentity | null>;
  private readonly initialGalleons: number;
  private readonly initialBankGalleons: number;
  private readonly rateBuckets = new Map<string, number[]>();
  private readonly scopeLocks = new Map<string, Promise<void>>();

  constructor(options: BurrowBackendOptions) {
    this.store = options.store;
    this.now = options.now ?? (() => Date.now());
    this.isProduction = options.isProduction === true;
    this.requireVerifiedAuth = options.requireVerifiedAuth === true;
    this.verifyExternalToken = options.verifyExternalToken;

    if (this.isProduction && isWeakOrDefaultSecret(options.hmacSecret)) {
      throw new BurrowServerError(
        'server-misconfigured',
        'Máy chủ thiếu cấu hình khóa bí mật HMAC_SECRET hợp lệ cho môi trường production.',
        {},
        500
      );
    }

    this.hmacSecret = options.hmacSecret || 'burrow-hogsmeade-default-dev-hmac-v1';
    if (this.isProduction) {
      this.adminToken =
        options.adminToken && !isWeakOrDefaultSecret(options.adminToken)
          ? options.adminToken
          : '';
      this.allowEmulatorTokens = false;
    } else {
      this.adminToken = options.adminToken || 'burrow-hph-admin-token';
      this.allowEmulatorTokens = options.allowEmulatorTokens ?? true;
    }
    this.initialGalleons = options.initialGalleons ?? 650;
    this.initialBankGalleons = options.initialBankGalleons ?? 350;
  }

  /**
   * Tuần tự hóa nguyên tử theo thứ tự khóa từ điển (`scopeLocks`) để chống hoàn toàn Race Condition /
   * Lost Update và chống vượt trần ngày khi nhiều request đồng thời đổ về cùng 1 tài khoản, BXH hoặc Cúp Nhà.
   */
  public async withScopeLocks<T>(scopes: string[], fn: () => Promise<T>): Promise<T> {
    const ordered = Array.from(new Set(scopes.filter(Boolean))).sort();
    if (ordered.length === 0) return fn();

    const acquireChain = async (idx: number): Promise<T> => {
      if (idx >= ordered.length) {
        return fn();
      }
      const key = ordered[idx];
      const prev = this.scopeLocks.get(key) ?? Promise.resolve();
      let release!: () => void;
      const current = new Promise<void>((resolve) => {
        release = resolve;
      });
      const chained = prev.then(() => current);
      this.scopeLocks.set(key, chained);

      await prev;
      try {
        return await acquireChain(idx + 1);
      } finally {
        release();
        if (this.scopeLocks.get(key) === chained) {
          this.scopeLocks.delete(key);
        }
      }
    };

    return acquireChain(0);
  }

  public checkRateLimit(bucketKey: string, maxRequests: number, windowMs = 60_000): void {
    const nowMs = this.now();
    const cutoff = nowMs - windowMs;

    if (this.rateBuckets.size >= 5000 && !this.rateBuckets.has(bucketKey)) {
      for (const [k, ts] of this.rateBuckets.entries()) {
        if (ts.length === 0 || ts[ts.length - 1] <= cutoff) {
          this.rateBuckets.delete(k);
        }
        if (this.rateBuckets.size < 4000) break;
      }
      while (this.rateBuckets.size >= 5000) {
        const oldestKey = this.rateBuckets.keys().next().value;
        if (!oldestKey) break;
        this.rateBuckets.delete(oldestKey);
      }
    }

    const prev = this.rateBuckets.get(bucketKey) ?? [];
    const active = prev.filter((t) => t > cutoff);
    if (active.length >= maxRequests) {
      this.rateBuckets.set(bucketKey, active);
      throw new BurrowServerError(
        'rate-limited',
        'Thao tác quá nhanh, vui lòng đợi giây lát rồi thử lại.',
        { retryAfterMs: Math.max(1000, active[0] + windowMs - nowMs) },
        429
      );
    }
    active.push(nowMs);
    this.rateBuckets.delete(bucketKey);
    this.rateBuckets.set(bucketKey, active);
  }

  public isStaticAdminTokenValid(candidate: string | null | undefined): boolean {
    if (!candidate || !this.adminToken) return false;
    return timingSafeEqualStr(candidate, this.adminToken);
  }

  /**
   * Xác minh vé ký số ngắn hạn từ máy chủ diễn đàn HPVN (`<payloadB64>.<hmacSigB64>` hoặc JWT `HS256`).
   */
  public async verifySignedHpvnTicket(rawTicket: string): Promise<VerifiedSessionIdentity> {
    const trimmed = String(rawTicket || '').trim();
    const parts = trimmed.split('.');
    if (parts.length === 3) {
      const fakeHeaders = {
        get: (name: string) =>
          name.toLowerCase() === 'authorization' ? `Bearer ${trimmed}` : null,
      };
      const verified = await this.verifyIdentityFromHeaders(fakeHeaders);
      return { ...verified, authenticatedVia: 'hpvn-ticket' };
    }
    if (parts.length !== 2) {
      throw new BurrowServerError('unauthorized', 'Định dạng vé phiên HPVN không hợp lệ.', {}, 401);
    }
    const expectedSig = await hmacSha256Base64Url(this.hmacSecret, parts[0]);
    if (!timingSafeEqualStr(expectedSig, parts[1])) {
      throw new BurrowServerError('unauthorized', 'Chữ ký vé phiên HPVN không hợp lệ.', {}, 401);
    }
    let payload: Record<string, unknown> & {
      uid?: string;
      sub?: string;
      house?: string;
      role?: string;
      saleAdmin?: boolean;
      username?: string;
      name?: string;
      avatarUrl?: string;
      picture?: string;
      exp?: number;
    };
    try {
      payload = JSON.parse(base64UrlToUtf8(parts[0])) as typeof payload;
    } catch {
      throw new BurrowServerError('unauthorized', 'Không thể giải mã vé phiên HPVN.', {}, 401);
    }
    const nowSec = Math.floor(this.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < nowSec) {
      throw new BurrowServerError('unauthorized', 'Vé phiên HPVN đã hết hạn.', {}, 401);
    }
    const rawUid = payload.uid || payload.sub;
    if (typeof rawUid !== 'string' || !rawUid.trim()) {
      throw new BurrowServerError('unauthorized', 'Vé phiên HPVN thiếu định danh uid.', {}, 401);
    }
    const memberFields = extractMemberProfileFields(payload);
    const house: HogwartsHouseName = memberFields.house ?? 'Gryffindor';
    return {
      uid: sanitizeBackendUid(rawUid),
      house,
      houseExplicit: Boolean(memberFields.house),
      role: payload.saleAdmin === true || payload.role === 'saleAdmin' ? 'saleAdmin' : 'member',
      authenticatedVia: 'hpvn-ticket',
      ...(memberFields.username ? { username: memberFields.username } : {}),
      ...(memberFields.avatarUrl ? { avatarUrl: memberFields.avatarUrl } : {}),
    };
  }

  /**
   * Cấp phát JWT phiên đăng nhập ký HMAC-SHA256 (`HS256`) cho thiết bị / thành viên HPVN.
   */
  public async issueSessionToken(params: {
    uid: string;
    house?: string;
    houseExplicit?: boolean;
    role?: 'member' | 'saleAdmin';
    username?: string;
    avatarUrl?: string;
    ttlSec?: number;
  }): Promise<{ token: string; uid: string; expiresAt: number }> {
    const uid = sanitizeBackendUid(params.uid);
    const parsedHouse = normalizeHogwartsHouse(params.house);
    const house: HogwartsHouseName = parsedHouse ?? 'Gryffindor';
    const houseExplicit =
      params.houseExplicit !== undefined ? params.houseExplicit : Boolean(parsedHouse);
    const role = params.role === 'saleAdmin' ? 'saleAdmin' : 'member';
    const username = typeof params.username === 'string' ? params.username.trim().slice(0, 42) : undefined;
    const avatarUrl = typeof params.avatarUrl === 'string' ? params.avatarUrl.trim().slice(0, 260) : undefined;
    const iat = Math.floor(this.now() / 1000);
    const exp = iat + Math.max(60, params.ttlSec ?? 86_400 * 7);

    const headerB64 = utf8ToBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadB64 = utf8ToBase64Url(
      JSON.stringify({
        iss: 'burrow-hogsmeade-auth',
        aud: 'congviengiaitri',
        sub: uid,
        user_id: uid,
        house,
        houseExplicit,
        role,
        ...(username ? { name: username } : {}),
        ...(avatarUrl ? { picture: avatarUrl } : {}),
        iat,
        exp,
      })
    );
    const signingInput = `${headerB64}.${payloadB64}`;
    const sigB64 = await hmacSha256Base64Url(this.hmacSecret, signingInput);
    return {
      token: `${signingInput}.${sigB64}`,
      uid,
      expiresAt: exp * 1000,
    };
  }

  /**
   * Xác thực danh tính từ Header `Authorization: Bearer <JWT>`, `X-Admin-Token`, hoặc fallback `X-User-Id`.
   */
  public async verifyIdentityFromHeaders(
    headers: { get(name: string): string | null },
    fallbackQueryUid?: string | null
  ): Promise<VerifiedSessionIdentity> {
    const adminHeader = headers.get('x-admin-token') || headers.get('X-Admin-Token');
    const isAdminHeader = this.isStaticAdminTokenValid(adminHeader);
    const rawHeaderName = headers.get('x-user-name') || headers.get('X-User-Name');
    let headerUsername: string | undefined;
    if (rawHeaderName) {
      try {
        headerUsername = decodeURIComponent(rawHeaderName).trim().slice(0, 42) || undefined;
      } catch {
        headerUsername = rawHeaderName.trim().slice(0, 42) || undefined;
      }
    }
    const rawHeaderAvatar = headers.get('x-user-avatar') || headers.get('X-User-Avatar');
    const headerAvatarUrl = rawHeaderAvatar ? rawHeaderAvatar.trim().slice(0, 260) || undefined : undefined;

    const authHeader = headers.get('authorization') || headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const rawToken = authHeader.slice(7).trim();
      if (!rawToken) {
        throw new BurrowServerError('unauthorized', 'Định dạng phiên đăng nhập không hợp lệ.', {}, 401);
      }

      const parts = rawToken.split('.');
      type DecodedJwtPayload = Record<string, unknown> & {
        iss?: string;
        sub?: string;
        user_id?: string;
        house?: string;
        houseExplicit?: boolean;
        role?: string;
        name?: string;
        username?: string;
        picture?: string;
        avatarUrl?: string;
        exp?: number;
      };
      let headerObj: { alg?: string } | null = null;
      let payloadObj: DecodedJwtPayload | null = null;

      if (parts.length === 3) {
        try {
          headerObj = JSON.parse(base64UrlToUtf8(parts[0])) as { alg?: string };
          payloadObj = JSON.parse(base64UrlToUtf8(parts[1])) as DecodedJwtPayload;
        } catch {
          headerObj = null;
          payloadObj = null;
        }
      }

      if (headerObj && payloadObj) {
        const nowSec = Math.floor(this.now() / 1000);
        if (typeof payloadObj.exp === 'number' && payloadObj.exp < nowSec) {
          throw new BurrowServerError('unauthorized', 'Phiên đăng nhập đã hết hạn.', {}, 401);
        }

        const memberFields = extractMemberProfileFields(payloadObj);
        const tokenUsername = memberFields.username || headerUsername;
        const tokenAvatarUrl = memberFields.avatarUrl || headerAvatarUrl;

        if (headerObj.alg === 'HS256') {
          const expectedSig = await hmacSha256Base64Url(this.hmacSecret, `${parts[0]}.${parts[1]}`);
          if (timingSafeEqualStr(expectedSig, parts[2])) {
            const uid = sanitizeBackendUid(payloadObj.user_id || payloadObj.sub);
            const house: HogwartsHouseName = memberFields.house ?? 'Gryffindor';
            const houseExplicit =
              typeof payloadObj.houseExplicit === 'boolean'
                ? payloadObj.houseExplicit
                : Boolean(memberFields.house);
            return {
              uid,
              house,
              houseExplicit,
              role: isAdminHeader || payloadObj.role === 'saleAdmin' ? 'saleAdmin' : 'member',
              authenticatedVia: 'hmac-jwt',
              username: tokenUsername,
              avatarUrl: tokenAvatarUrl,
            };
          }
          if (payloadObj.iss === 'burrow-hangsoc' || !this.verifyExternalToken) {
            throw new BurrowServerError('unauthorized', 'Chữ ký phiên đăng nhập không hợp lệ.', {}, 401);
          }
        }

        if (
          headerObj.alg === 'none' &&
          this.allowEmulatorTokens &&
          !this.isProduction &&
          typeof payloadObj.iss === 'string' &&
          payloadObj.iss.startsWith('https://securetoken.google.com/')
        ) {
          const uid = sanitizeBackendUid(payloadObj.user_id || payloadObj.sub);
          return {
            uid,
            house: memberFields.house ?? 'Gryffindor',
            houseExplicit: Boolean(memberFields.house),
            role: isAdminHeader ? 'saleAdmin' : 'member',
            authenticatedVia: 'emulator-jwt',
            username: tokenUsername,
            avatarUrl: tokenAvatarUrl,
          };
        }
      }

      if (this.verifyExternalToken && (!headerObj || headerObj.alg !== 'none')) {
        const externalIdentity = await this.verifyExternalToken(rawToken);
        if (externalIdentity) {
          return {
            ...externalIdentity,
            username: externalIdentity.username || headerUsername,
            avatarUrl: externalIdentity.avatarUrl || headerAvatarUrl,
            role: isAdminHeader || externalIdentity.role === 'saleAdmin' ? 'saleAdmin' : 'member',
          };
        }
        throw new BurrowServerError('unauthorized', 'Firebase ID Token không hợp lệ hoặc đã thu hồi.', {}, 401);
      }

      throw new BurrowServerError('unauthorized', 'Định dạng hoặc thuật toán xác thực không được phép.', {}, 401);
    }

    if (this.requireVerifiedAuth && !isAdminHeader) {
      throw new BurrowServerError(
        'unauthorized',
        'Cần phiên đăng nhập xác thực hợp lệ (Bearer Token / Firebase Auth) để truy cập máy chủ HPVN.',
        {},
        401
      );
    }

    const hpvnUid = headers.get('x-hpvn-uid') || headers.get('X-Hpvn-Uid');
    if (hpvnUid) {
      return {
        uid: sanitizeBackendUid(hpvnUid),
        house: 'Gryffindor',
        houseExplicit: false,
        role: isAdminHeader ? 'saleAdmin' : 'member',
        authenticatedVia: 'hpvn-header',
        username: headerUsername,
        avatarUrl: headerAvatarUrl,
      };
    }

    const legacyUid =
      headers.get('x-user-id') || headers.get('X-User-Id') || fallbackQueryUid || 'default_player';
    return {
      uid: sanitizeBackendUid(legacyUid),
      house: 'Gryffindor',
      houseExplicit: false,
      role: isAdminHeader ? 'saleAdmin' : 'member',
      authenticatedVia: 'legacy-header',
      username: headerUsername,
      avatarUrl: headerAvatarUrl,
    };
  }

  private async readJson<T>(key: string): Promise<T | null> {
    const raw = await this.store.get(key, 'text');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private async writeJson(key: string, value: unknown, expirationTtl = 31_536_000): Promise<void> {
    await this.store.put(key, JSON.stringify(value), { expirationTtl });
  }

  public async getOrCreateSalesConfig(): Promise<SalesAdminConfigDoc> {
    const existing = await this.readJson<SalesAdminConfigDoc>('burrow_sales_config');
    if (existing) return existing;
    const fresh: SalesAdminConfigDoc = {
      revision: 0,
      marketOff: false,
      discountPercent: 0,
      priceOverrides: {},
      dailyCapGalleons: 2500,
      masteryDailyCapGalleons: 5000,
      perItemDailyCap: 100,
      updatedAt: this.now(),
    };
    await this.writeJson('burrow_sales_config', fresh);
    return fresh;
  }

  public async getOrCreateState(
    uid: string,
    defaultHouse: HogwartsHouseName = 'Gryffindor',
    defaultHouseSource: 'hpvn' | 'player' | 'default' = 'default'
  ): Promise<BurrowAuthoritativeStateDoc> {
    const key = `burrow_states:${uid}`;
    const existing = await this.readJson<BurrowAuthoritativeStateDoc>(key);
    if (existing) return existing;

    const nowMs = this.now();
    const codeHash = fnv1aHashHex(uid).slice(0, 4).toUpperCase();
    const codeNum = String((parseInt(codeHash, 16) % 89) + 10);
    const fresh: BurrowAuthoritativeStateDoc = {
      uid,
      revision: 0,
      createdAt: nowMs,
      updatedAt: nowMs,
      parkName: 'Trang Trại Hang Sóc',
      playerName: 'Phù Thủy Hang Sóc',
      friendCode: `HS-${codeHash}-${codeNum}`,
      avatarEmoji: '🧙‍♂️',
      house: defaultHouse,
      houseSource: defaultHouseSource,
      level: 1,
      xp: 0,
      magicStars: 2,
      timeSand: 0,
      phoenixTalismans: 1,
      friendshipTokens: 0,
      inventory: {
        wheat: 4,
        pumpkin: 2,
      },
      supplies: {
        seeds: {
          wheat: 6,
          pumpkin: 3,
          strawberry: 0,
          mandrake: 0,
        },
        water: 12,
        boost: 1,
      },
      decorations: {
        owned: ['decor_burrow_lantern'],
        placements: ['decor_burrow_lantern', null, null, null, null, null],
        rotations: { decor_burrow_lantern: 'default' },
        scene: {
          weather: 'clear',
          atmosphere: 'day',
          event: 'harvest_feast',
        },
      },
      flooFrames: {
        unlocked: ['starter_wood'],
        worn: 'starter_wood',
      },
      economicCycles: {
        crop: 0,
        pasture: 0,
        workshop: 0,
        brew: 0,
        construction: 0,
      },
      timers: [],
      builtIds: [],
      guideDone: [],
      festival: {
        seasonKey: `harvest_feast@${vnDayKey(nowMs).slice(0, 4)}`,
        points: 0,
        claimedMilestones: [],
      },
      achievementsClaimed: [],
      clearanceUsed: false,
      minigameRecords: {},
    };
    await this.writeJson(key, fresh);
    await this.registerVisitDirectoryEntry(fresh);
    return fresh;
  }

  public async getOrCreateWallet(uid: string): Promise<GringottsWalletDoc> {
    const key = `burrow_wallets:${uid}`;
    const existing = await this.readJson<Record<string, unknown>>(key);
    if (existing && typeof existing === 'object') {
      const balance = Math.max(0, Math.floor(Number(existing.balance) || 0));
      const bankBalance = Math.max(0, Math.floor(Number(existing.bankBalance) || 0));
      return {
        uid,
        balance,
        bankBalance,
        spendable: balance + bankBalance,
        frozen: Boolean(existing.frozen),
        updatedAt: Math.floor(Number(existing.updatedAt) || this.now()),
      };
    }
    const total = this.initialGalleons + this.initialBankGalleons;
    const fresh: GringottsWalletDoc = {
      uid,
      balance: this.initialGalleons,
      bankBalance: this.initialBankGalleons,
      spendable: total,
      frozen: false,
      updatedAt: this.now(),
    };
    await this.writeJson(key, fresh);
    return fresh;
  }

  public async getLedger(uid: string): Promise<GringottsLedgerEntry[]> {
    return (await this.readJson<GringottsLedgerEntry[]>(`burrow_ledger:${uid}`)) ?? [];
  }

  private debitWalletInMemory(
    wallet: GringottsWalletDoc,
    ledger: GringottsLedgerEntry[],
    params: {
      requestId: string;
      cost: number;
      sourceType: GringottsLedgerEntry['sourceType'];
      reasonCode: string;
      refusalReason?: 'insufficient-galleons' | 'insufficient-balance';
    }
  ): void {
    if (wallet.frozen) {
      throw new BurrowServerError(
        'wallet-frozen',
        'Tài khoản Gringotts hiện đang tạm khóa bảo vệ.',
        {},
        403
      );
    }
    const cost = Math.max(0, Math.floor(params.cost));
    if (cost === 0) return;
    const spendable = wallet.balance + wallet.bankBalance;
    if (spendable < cost) {
      const reason = params.refusalReason ?? 'insufficient-galleons';
      throw new BurrowServerError(reason, 'Chưa đủ Galleons trong ví Gringotts.', {
        required: cost,
        spendable,
        shortBy: cost - spendable,
      });
    }
    // Chuẩn HPVNN Gringotts: trừ từ két sắt `bankBalance` trước, phần còn lại trừ túi `balance`
    const fromBank = Math.min(wallet.bankBalance, cost);
    const fromPocket = cost - fromBank;
    wallet.bankBalance -= fromBank;
    wallet.balance -= fromPocket;
    wallet.spendable = wallet.balance + wallet.bankBalance;
    wallet.updatedAt = this.now();

    ledger.push({
      txId: `tx_${fnv1aHashHex(`${wallet.uid}:${params.requestId}`)}`,
      requestId: params.requestId,
      uid: wallet.uid,
      type: 'debit',
      amount: cost,
      fromBank,
      fromPocket,
      balanceAfter: wallet.spendable,
      sourceType: params.sourceType,
      reasonCode: params.reasonCode,
      createdAt: wallet.updatedAt,
    });
  }

  private creditWalletInMemory(
    wallet: GringottsWalletDoc,
    ledger: GringottsLedgerEntry[],
    params: {
      requestId: string;
      amount: number;
      sourceType: GringottsLedgerEntry['sourceType'];
      reasonCode: string;
    }
  ): void {
    if (wallet.frozen) {
      throw new BurrowServerError(
        'wallet-frozen',
        'Tài khoản Gringotts hiện đang tạm khóa bảo vệ.',
        {},
        403
      );
    }
    const amount = Math.max(0, Math.floor(params.amount));
    if (amount === 0) return;
    wallet.balance += amount;
    wallet.spendable = wallet.balance + wallet.bankBalance;
    wallet.updatedAt = this.now();

    ledger.push({
      txId: `tx_${fnv1aHashHex(`${wallet.uid}:${params.requestId}:cr`)}`,
      requestId: params.requestId,
      uid: wallet.uid,
      type: 'credit',
      amount,
      fromBank: 0,
      fromPocket: amount,
      balanceAfter: wallet.spendable,
      sourceType: params.sourceType,
      reasonCode: params.reasonCode,
      createdAt: wallet.updatedAt,
    });
  }

  public async getOrCreateDaily(uid: string, dayKey = vnDayKey(this.now())): Promise<BurrowDailyDoc> {
    const key = `burrow_daily:${uid}:${dayKey}`;
    const existing = await this.readJson<BurrowDailyDoc>(key);
    if (existing) return existing;

    const yesterday = await this.readJson<BurrowDailyDoc>(
      `burrow_daily:${uid}:${vnYesterdayKey(dayKey)}`
    );
    const fresh: BurrowDailyDoc = {
      dayKey,
      uid,
      streakDays: yesterday ? yesterday.streakDays + 1 : 1,
      quests: buildDailyQuestsForDay(dayKey),
      chestClaimed: false,
      bonusQuests: buildBonusQuests(),
      bonusChestClaimed: false,
      helpsGivenCount: 0,
      helpedHostUids: [],
      rescuesGivenCount: 0,
      rescuedHostUids: [],
      owlHelpsRequestedCount: 0,
      freeActions: {},
      storeBoughtByItem: {},
      marketEarnedGalleons: 0,
      marketSoldByItem: {},
      houseCupPointsToday: 0,
      ops: {},
    };
    await this.writeJson(key, fresh, 86_400 * 14);
    return fresh;
  }

  public async getOrCreateHouseCup(weekKey = vnWeekKey(this.now())): Promise<HouseCupWeekDoc> {
    const key = `burrow_house_cup:${weekKey}`;
    const existing = await this.readJson<HouseCupWeekDoc>(key);
    if (existing) return existing;
    const fresh: HouseCupWeekDoc = {
      weekKey,
      houses: {
        Gryffindor: 120,
        Hufflepuff: 115,
        Ravenclaw: 118,
        Slytherin: 112,
      },
      rewardMin: HOUSE_CUP_REWARD_MIN_POINTS,
      updatedAt: this.now(),
    };
    await this.writeJson(key, fresh, 86_400 * 21);
    return fresh;
  }

  private async persistWalletAndLedger(
    uid: string,
    wallet: GringottsWalletDoc,
    ledger: GringottsLedgerEntry[],
    prevLedgerLength: number
  ): Promise<void> {
    await this.writeJson(`burrow_wallets:${uid}`, wallet);
    await this.writeJson(`burrow_ledger:${uid}`, ledger.slice(-500));
    const newEntries = ledger.slice(prevLedgerLength);
    if (newEntries.length > 0 && typeof this.store.appendLedgerEntries === 'function') {
      await this.store.appendLedgerEntries(uid, newEntries);
    }
  }

  private async addHouseCupPoints(
    house: HogwartsHouseName,
    daily: BurrowDailyDoc,
    rawPoints: number
  ): Promise<{ added: number; cup: HouseCupWeekDoc }> {
    const nowMs = this.now();
    const weekKey = vnWeekKey(nowMs);
    const remainingCap = Math.max(0, MAX_DAILY_HOUSE_CUP_MEMBER_POINTS - daily.houseCupPointsToday);
    const added = Math.max(0, Math.min(Math.floor(rawPoints), remainingCap));
    if (added > 0) {
      daily.houseCupPointsToday += added;
      if (typeof this.store.incrementHouseCup === 'function') {
        const cup = await this.store.incrementHouseCup(
          weekKey,
          house,
          added,
          nowMs,
          HOUSE_CUP_REWARD_MIN_POINTS
        );
        return { added, cup };
      }
      const cup = await this.getOrCreateHouseCup(weekKey);
      cup.houses[house] = (cup.houses[house] || 0) + added;
      cup.updatedAt = nowMs;
      await this.writeJson(`burrow_house_cup:${cup.weekKey}`, cup, 86_400 * 21);
      return { added, cup };
    }
    const cup = await this.getOrCreateHouseCup(weekKey);
    return { added: 0, cup };
  }

  public async getHelpersForHost(
    hostUid: string,
    dayKey = vnDayKey(this.now())
  ): Promise<HelperVisitNotification[]> {
    return (
      (await this.readJson<HelperVisitNotification[]>(`burrow_helpers:${hostUid}:${dayKey}`)) ?? []
    );
  }

  private async appendHelperForHost(
    hostUid: string,
    dayKey: string,
    helper: HelperVisitNotification
  ): Promise<HelperVisitNotification[]> {
    const key = `burrow_helpers:${hostUid}:${dayKey}`;
    const current = await this.getHelpersForHost(hostUid, dayKey);
    const updated = [...current, helper].slice(-20);
    await this.writeJson(key, updated, 86_400 * 3);
    return updated;
  }

  public async syncVisitDirectoryForState(state: BurrowAuthoritativeStateDoc): Promise<void> {
    await this.withScopeLocks(['visit_dir'], () => this.registerVisitDirectoryEntry(state));
  }

  public async syncIdentityProfileForState(
    state: BurrowAuthoritativeStateDoc,
    identity: VerifiedSessionIdentity
  ): Promise<void> {
    await this.applyIdentityProfileToState(state, identity);
  }

  private async resolveEffectiveIdentityProfile(
    identity: VerifiedSessionIdentity,
    skipExternalLookup = false
  ): Promise<{ house: HogwartsHouseName | null; username?: string; avatarUrl?: string }> {
    let house: HogwartsHouseName | null = null;
    const hasKnownNonDefaultHouse =
      VALID_HOUSES.has(identity.house) && identity.house !== 'Gryffindor';
    if (identity.houseExplicit === true || hasKnownNonDefaultHouse) {
      house = normalizeHogwartsHouse(identity.house);
    } else if (
      identity.houseExplicit === undefined &&
      identity.authenticatedVia !== 'emulator-jwt' &&
      identity.authenticatedVia !== 'hpvn-header' &&
      identity.authenticatedVia !== 'legacy-header' &&
      VALID_HOUSES.has(identity.house)
    ) {
      house = identity.house;
    }

    let username = identity.username?.trim() ? identity.username.trim().slice(0, 42) : undefined;
    let avatarUrl = identity.avatarUrl?.trim() ? identity.avatarUrl.trim().slice(0, 260) : undefined;

    if (
      !skipExternalLookup &&
      typeof this.store.resolveMemberIdentityProfile === 'function' &&
      (!house || !username)
    ) {
      try {
        const docProfile = await this.store.resolveMemberIdentityProfile(identity.uid);
        if (docProfile) {
          if (docProfile.house && !house) {
            house = docProfile.house;
          }
          if (!username && docProfile.username) {
            username = docProfile.username.trim().slice(0, 42);
          }
          if (!avatarUrl && docProfile.avatarUrl) {
            avatarUrl = docProfile.avatarUrl.trim().slice(0, 260);
          }
        }
      } catch {
        // Fallback an toàn nếu kết nối đọc hồ sơ phụ tạm gián đoạn
      }
    }

    return { house, username, avatarUrl };
  }

  private async refreshUserMetadataInLeaderboards(
    state: BurrowAuthoritativeStateDoc
  ): Promise<void> {
    for (const gameId of SCORED_SERVER_LEADERBOARD_GAMES) {
      const kvKey = `burrow_lb:${gameId}`;
      const existing = (await this.readJson<Array<Record<string, unknown>>>(kvKey)) ?? [];
      if (existing.length === 0) continue;
      let modified = false;
      for (const item of existing) {
        if (item && item.userId === state.uid) {
          if (item.house !== state.house) {
            item.house = state.house;
            modified = true;
          }
          if (
            state.playerName &&
            state.playerName !== 'Phù Thủy Hang Sóc' &&
            (item.name === 'Trang Trại Hang Sóc' || item.name === 'Phù Thủy Hang Sóc' || !item.name)
          ) {
            item.name = state.playerName;
            modified = true;
          }
          if (state.friendCode && item.friendCode !== state.friendCode) {
            item.friendCode = state.friendCode;
            modified = true;
          }
        }
      }
      if (modified) {
        await this.writeJson(kvKey, existing, 86_400 * 180);
      }
    }
  }

  private async applyIdentityProfileToState(
    state: BurrowAuthoritativeStateDoc,
    identity: VerifiedSessionIdentity
  ): Promise<void> {
    const alreadyComplete =
      state.houseSource === 'hpvn' &&
      Boolean(state.playerName) &&
      state.playerName !== 'Phù Thủy Hang Sóc' &&
      state.playerName !== 'Trang Trại Hang Sóc';
    const resolved = await this.resolveEffectiveIdentityProfile(identity, alreadyComplete);
    let changed = false;
    let leaderboardMetaChanged = false;

    if (resolved.house) {
      if (state.house !== resolved.house || state.houseSource !== 'hpvn') {
        state.house = resolved.house;
        state.houseSource = 'hpvn';
        changed = true;
        leaderboardMetaChanged = true;
      }
    }

    if (resolved.username && resolved.username.trim()) {
      const nextName = resolved.username.trim().slice(0, 42);
      if (
        state.playerName === 'Phù Thủy Hang Sóc' ||
        state.playerName === 'Trang Trại Hang Sóc' ||
        !state.playerName
      ) {
        if (state.playerName !== nextName) {
          state.playerName = nextName;
          changed = true;
          leaderboardMetaChanged = true;
        }
      }
    }
    if (resolved.avatarUrl && resolved.avatarUrl.trim()) {
      const nextAvatar = resolved.avatarUrl.trim().slice(0, 260);
      if (state.avatarUrl !== nextAvatar) {
        state.avatarUrl = nextAvatar;
        changed = true;
      }
    }
    if (changed) {
      state.updatedAt = this.now();
      await this.writeJson(`burrow_states:${state.uid}`, state);
      await this.registerVisitDirectoryEntry(state);
      if (leaderboardMetaChanged) {
        await this.refreshUserMetadataInLeaderboards(state);
      }
    }
  }

  private async getHealedVisitDirectory(): Promise<VisitDirectorySummaryRow[]> {
    const indexKey = 'burrow_visit_directory';
    const rawCurrent = (await this.readJson<VisitDirectorySummaryRow[]>(indexKey)) ?? [];
    if (rawCurrent.length === 0) {
      return rawCurrent;
    }
    const current = deduplicateVisitDirectoryRows(rawCurrent);
    let modified = current.length !== rawCurrent.length;
    if (typeof this.store.resolveMemberIdentityProfile === 'function') {
      const toCheck = current
        .filter((r) => !r.houseVerified && r.house === 'Gryffindor')
        .slice(0, 8);
      await Promise.all(
        toCheck.map(async (row) => {
          try {
            const prof = await this.store.resolveMemberIdentityProfile!(row.uid);
            row.houseVerified = true;
            modified = true;
            if (!prof) return;
            if (prof.house && row.house !== prof.house) {
              row.house = prof.house;
            }
            if (
              prof.username &&
              (row.username === 'Phù Thủy Hang Sóc' ||
                row.username === 'Trang Trại Hang Sóc' ||
                !row.username)
            ) {
              row.username = prof.username;
            }
            if (prof.avatarUrl && !row.avatarUrl) {
              row.avatarUrl = prof.avatarUrl;
            }
          } catch {
            // Bỏ qua lỗi đọc đơn lẻ
          }
        })
      );
    }

    const dedupedAfterHeal = deduplicateVisitDirectoryRows(current);
    if (modified || dedupedAfterHeal.length !== current.length) {
      await this.writeJson(indexKey, dedupedAfterHeal, 86_400 * 60);
    }
    return dedupedAfterHeal;
  }

  private async registerVisitDirectoryEntry(
    state: BurrowAuthoritativeStateDoc,
    extras?: {
      helpsReceivedDayKey?: string;
      helpsReceivedCount?: number;
      fire?: { mode: string; since: number; until: number } | null;
    }
  ): Promise<void> {
    const indexKey = 'burrow_visit_directory';
    const current = (await this.readJson<VisitDirectorySummaryRow[]>(indexKey)) ?? [];

    const nowMs = this.now();
    const activeTimerReadyAts = state.timers
      .filter((t) => t.readyAt > nowMs)
      .map((t) => t.readyAt)
      .slice(0, 32);
    const prevRow = current.find((r) => r.uid === state.uid);
    const resolvedFire =
      extras && 'fire' in extras
        ? extras.fire
        : prevRow?.fire && prevRow.fire.until > nowMs
          ? prevRow.fire
          : null;
    const todayKey = vnDayKey(nowMs);
    const resolvedHelpsDayKey =
      extras?.helpsReceivedDayKey ??
      (prevRow?.helpsReceivedDayKey === todayKey ? todayKey : todayKey);
    const resolvedHelpsCount =
      typeof extras?.helpsReceivedCount === 'number'
        ? extras.helpsReceivedCount
        : prevRow?.helpsReceivedDayKey === todayKey
          ? prevRow.helpsReceivedCount ?? 0
          : 0;

    const nextRow: VisitDirectorySummaryRow = {
      uid: state.uid,
      friendCode: state.friendCode,
      username: state.playerName,
      parkName: state.parkName,
      house: state.house,
      ...(state.houseSource === 'hpvn' || state.houseSource === 'player'
        ? { houseVerified: true }
        : prevRow?.houseVerified
          ? { houseVerified: true }
          : {}),
      avatarEmoji: state.avatarEmoji,
      ...(state.avatarUrl ? { avatarUrl: state.avatarUrl } : {}),
      level: state.level,
      growing: activeTimerReadyAts.length,
      timerReadyAts: activeTimerReadyAts,
      helpsReceivedDayKey: resolvedHelpsDayKey,
      helpsReceivedCount: resolvedHelpsCount,
      ...(resolvedFire ? { fire: resolvedFire } : { fire: null }),
      scene: state.decorations.scene,
      updatedAt: nowMs,
    };

    const byUid = new Map(current.map((r) => [r.uid, r]));
    byUid.set(state.uid, nextRow);
    const trimmed = deduplicateVisitDirectoryRows(Array.from(byUid.values()))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 120);
    await this.writeJson(indexKey, trimmed, 86_400 * 60);
  }

  private async updateVisitDirectoryFireStatus(
    targetUid: string,
    fire: { mode: string; since: number; until: number } | null
  ): Promise<void> {
    const indexKey = 'burrow_visit_directory';
    const current = (await this.readJson<VisitDirectorySummaryRow[]>(indexKey)) ?? [];
    const targetIdx = current.findIndex((r) => r.uid === targetUid);
    if (targetIdx < 0) return;
    current[targetIdx] = {
      ...current[targetIdx],
      fire,
      updatedAt: this.now(),
    };
    await this.writeJson(indexKey, current, 86_400 * 60);
  }

  private validateAndCheckIdempotency(
    requestId: unknown,
    payloadForHash: Record<string, unknown>,
    daily: BurrowDailyDoc
  ): { reqId: string; hash: string; cachedReceipt: Record<string, unknown> | null } {
    if (typeof requestId !== 'string' || !requestId.trim() || requestId.length > 128) {
      throw new BurrowServerError('invalid-request-id', 'Mã thao tác (requestId) không hợp lệ.');
    }
    const reqId = requestId.trim();
    const hash = fnv1aHashHex(canonicalJson(payloadForHash));
    const seen = daily.ops[reqId];
    if (seen) {
      if (seen.hash !== hash) {
        throw new BurrowServerError(
          'request-id-conflict',
          'Mã thao tác đã được sử dụng cho một dữ liệu khác.',
          { requestId: reqId },
          409
        );
      }
      return { reqId, hash, cachedReceipt: seen.receipt };
    }
    return { reqId, hash, cachedReceipt: null };
  }

  private buildCatalogView(
    level: number,
    daily: BurrowDailyDoc,
    salesConfig: SalesAdminConfigDoc
  ): {
    catalog: Array<
      StoreCatalogEntry & { effectivePrice: number; dailyRemaining: number }
    >;
    catalogHash: string;
  } {
    const unlocked = BURROW_STORE_CATALOG.filter((item) => item.unlockLevel <= level).map(
      (item) => {
        const bought = daily.storeBoughtByItem[item.id] || 0;
        return {
          ...item,
          effectivePrice: packTotal(item, 1, salesConfig, bought),
          dailyRemaining: Math.max(0, item.dailyLimit - bought),
        };
      }
    );
    // Hash phụ thuộc vào danh mục theo cấp + cấu hình giá/flash sale (không phụ thuộc dailyRemaining cá nhân)
    const staticDescriptor = BURROW_STORE_CATALOG.filter((i) => i.unlockLevel <= level).map((i) => ({
      id: i.id,
      p: salesConfig.priceOverrides[i.id] ?? i.price,
      d: salesConfig.discountPercent,
      f: i.forSale !== false,
    }));
    const catalogHash = fnv1aHashHex(`${CATALOG_VERSION}:${canonicalJson(staticDescriptor)}`);
    return { catalog: unlocked, catalogHash };
  }

  private async buildSnapshotResponse(params: {
    identity: VerifiedSessionIdentity;
    state: BurrowAuthoritativeStateDoc;
    wallet: GringottsWalletDoc;
    daily: BurrowDailyDoc;
    salesConfig: SalesAdminConfigDoc;
    knownCatalogHash?: string;
    receipt?: Record<string, unknown> | null;
  }): Promise<Record<string, unknown>> {
    const nowMs = this.now();
    const { identity, state, wallet, daily, salesConfig } = params;
    const { catalog, catalogHash } = this.buildCatalogView(state.level, daily, salesConfig);
    const houseCup = await this.getOrCreateHouseCup(vnWeekKey(nowMs));
    const helpers = await this.getHelpersForHost(state.uid, daily.dayKey);
    const fire = await this.readJson<{ mode: string; since: number; until: number }>(
      `burrow_fire:${state.uid}`
    );

    const questsDoneCount = daily.quests.filter((q) => q.progress >= q.target).length;
    const allBonusAndDailyDone = [...daily.quests, ...daily.bonusQuests].every(
      (q) => q.progress >= q.target
    );

    const milestoneViews = FEAST_MILESTONES.map((m) => {
      const claimed = state.festival.claimedMilestones.includes(m.key);
      return {
        key: m.key,
        title: m.title,
        points: m.points,
        reward: m.reward,
        claimed,
        claimable: !claimed && state.festival.points >= m.points,
      };
    });

    const achievementItems = BURROW_ACHIEVEMENTS.map((a) => {
      const unlocked = state.level >= a.minLevel && a.check(state);
      const claimed = state.achievementsClaimed.includes(a.id);
      return {
        id: a.id,
        title: a.title,
        minLevel: a.minLevel,
        reward: a.reward,
        unlocked,
        claimed,
        claimable: unlocked && !claimed,
      };
    });

    const omitCatalog =
      typeof params.knownCatalogHash === 'string' && params.knownCatalogHash === catalogHash;
    const [lbMatch3, lbSudoku, lbBlocks, lbJigsaw] = await Promise.all([
      this.getLeaderboardEntries('match3'),
      this.getLeaderboardEntries('sudoku'),
      this.getLeaderboardEntries('blocks'),
      this.getLeaderboardEntries('jigsaw'),
    ]);

    return {
      uid: state.uid,
      garden: {
        progression: {
          revision: state.revision,
          level: state.level,
          xp: state.xp,
          magicStars: state.magicStars,
          timeSand: state.timeSand,
          phoenixTalismans: state.phoenixTalismans,
          friendshipTokens: state.friendshipTokens,
          house: state.house,
          houseSource: state.houseSource ?? 'default',
          parkName: state.parkName,
          friendCode: state.friendCode,
          inventory: state.inventory,
          economicCycles: state.economicCycles,
          timers: state.timers,
          builtIds: state.builtIds,
          minigameRecords: state.minigameRecords,
        },
        supplies: state.supplies,
        decorations: state.decorations,
        festival: state.festival,
        tutorial: { guide: state.guideDone },
      },
      wallet: {
        spendable: wallet.balance + wallet.bankBalance,
        balance: wallet.balance,
        bankBalance: wallet.bankBalance,
        frozen: wallet.frozen,
      },
      ...(omitCatalog ? {} : { catalog }),
      catalogVersion: CATALOG_VERSION,
      catalogHash,
      dayKey: daily.dayKey,
      weekKey: houseCup.weekKey,
      daily: {
        dayKey: daily.dayKey,
        streakDays: daily.streakDays,
        helpsLeft: Math.max(0, MAX_DAILY_FRIEND_HELPS - daily.helpsGivenCount),
        maxDailyHelps: MAX_DAILY_FRIEND_HELPS,
        helpsGivenCount: daily.helpsGivenCount,
        helpedHostUids: daily.helpedHostUids,
        quests: daily.quests,
        chest: {
          claimed: daily.chestClaimed,
          ready: !daily.chestClaimed && questsDoneCount >= 3,
          reward: {
            kind: 'boost',
            amount: 1,
            waterBonus: 12,
            label: 'Rương Cú Vàng: +1 Phân Bón, +12 Nước, +20 điểm Đại Tiệc',
          },
        },
        bonusQuests: daily.bonusQuests,
        bonusChest: {
          claimed: daily.bonusChestClaimed,
          ready: !daily.bonusChestClaimed && allBonusAndDailyDone,
          reward: {
            kind: 'boost',
            amount: 1,
            waterBonus: 24,
            label: 'Rương Bà Molly: +1 Phân Bón, +24 Nước, +30 điểm Đại Tiệc',
          },
        },
        freeActions: Object.fromEntries(
          Object.entries(FREE_ACTION_CAPS).map(([k, cap]) => [
            k,
            { used: daily.freeActions[k] || 0, cap },
          ])
        ),
        market: {
          marketOff: salesConfig.marketOff,
          earnedToday: daily.marketEarnedGalleons,
          dailyCap:
            state.level >= 25
              ? salesConfig.masteryDailyCapGalleons
              : salesConfig.dailyCapGalleons,
          perItemDailyCap: salesConfig.perItemDailyCap,
          soldByItem: daily.marketSoldByItem,
        },
      },
      festival: {
        active: {
          seasonKey: state.festival.seasonKey,
          points: state.festival.points,
          milestones: milestoneViews,
        },
      },
      achievements: {
        items: achievementItems,
        unlockedCount: achievementItems.filter((i) => i.unlocked).length,
        claimableCount: achievementItems.filter((i) => i.claimable).length,
      },
      orders: buildDailyOwlOrders(daily.dayKey, state.level).map((o) => ({
        ...o,
        delivered: Boolean(daily.ops[`order_done_${o.id}`]),
      })),
      houseCup: {
        weekKey: houseCup.weekKey,
        houses: houseCup.houses,
        memberTodayPoints: daily.houseCupPointsToday,
        memberDailyCap: MAX_DAILY_HOUSE_CUP_MEMBER_POINTS,
        rewardMin: houseCup.rewardMin,
      },
      flooFrames: {
        frames: state.flooFrames.unlocked,
        worn: state.flooFrames.worn,
      },
      helpers,
      fire: fire && fire.until > nowMs ? fire : null,
      saleAdmin: identity.role === 'saleAdmin',
      serverNow: nowMs,
      profile: {
        uid: state.uid,
        username: state.playerName,
        parkName: state.parkName,
        friendCode: state.friendCode,
        house: state.house,
        houseSource: state.houseSource ?? 'default',
        avatarEmoji: state.avatarEmoji,
        ...(state.avatarUrl ? { avatarUrl: state.avatarUrl } : {}),
      },
      leaderboards: {
        match3: lbMatch3,
        sudoku: lbSudoku,
        blocks: lbBlocks,
        jigsaw: lbJigsaw,
      },
      ...(params.receipt ? { receipt: params.receipt } : {}),
    };
  }

  /**
   * Router thực thi toàn bộ Callable RPC độc lập của Trang Trại Hang Sóc `{ data } -> { result | error }`.
   */
  public async handleCallable(
    callableName: string,
    rawData: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const data = rawData && typeof rawData === 'object' ? rawData : {};

    // Money-callable rate limit (120 req/phút/tài khoản)
    this.checkRateLimit(`rpc:${identity.uid}`, 120, 60_000);

    switch (callableName) {
      case 'getBurrowGarden': {
        const state = await this.getOrCreateState(
          identity.uid,
          identity.house,
          identity.houseExplicit ? 'hpvn' : 'default'
        );
        await this.applyIdentityProfileToState(state, identity);
        const wallet = await this.getOrCreateWallet(identity.uid);
        const daily = await this.getOrCreateDaily(identity.uid);
        const salesConfig = await this.getOrCreateSalesConfig();
        return this.buildSnapshotResponse({
          identity,
          state,
          wallet,
          daily,
          salesConfig,
          knownCatalogHash:
            typeof data.catalogHash === 'string' ? data.catalogHash : undefined,
        });
      }

      case 'performBurrowAction': {
        const actName = typeof data.action === 'string' ? data.action : '';
        const touchesLb =
          actName === 'submitLeaderboard' ||
          actName === 'minigameClear' ||
          actName === 'syncProfile' ||
          actName === 'syncSaveSnapshot';
        return this.withScopeLocks(
          [
            `user:${identity.uid}`,
            `cup:${vnWeekKey(this.now())}`,
            'visit_dir',
            ...(touchesLb ? ['lb:match3', 'lb:sudoku', 'lb:blocks'] : []),
          ],
          () => this.performAction(data, identity)
        );
      }

      case 'getBurrowLeaderboard': {
        const gameId = typeof data.gameId === 'string' ? data.gameId : 'match3';
        const entries = await this.getLeaderboardEntries(gameId);
        return {
          ok: true,
          gameId: SCORED_SERVER_LEADERBOARD_GAMES.has(gameId) ? gameId : 'match3',
          entries,
        };
      }

      case 'submitBurrowLeaderboard': {
        const gameId = typeof data.gameId === 'string' ? data.gameId : 'match3';
        const entry =
          data.entry && typeof data.entry === 'object'
            ? (data.entry as Record<string, unknown>)
            : {};
        const state = await this.getOrCreateState(
          identity.uid,
          identity.house,
          identity.houseExplicit ? 'hpvn' : 'default'
        );
        await this.applyIdentityProfileToState(state, identity);
        const res = await this.submitLeaderboardScore({
          uid: identity.uid,
          gameId,
          entry,
        });
        return { ok: true, ...res };
      }

      case 'buyBurrowSupplies':
        return this.withScopeLocks([`user:${identity.uid}`], () =>
          this.buySupplies(data, identity)
        );

      case 'sellBurrowGoods':
        return this.withScopeLocks([`user:${identity.uid}`], () =>
          this.sellGoods(data, identity)
        );

      case 'settleBurrowWallet':
        return this.withScopeLocks([`user:${identity.uid}`], () =>
          this.settleWallet(data, identity)
        );

      case 'visitBurrowGarden':
        return this.visitNeighbor(data, identity);

      case 'extinguishBurrowGarden': {
        const targetUid =
          typeof data.hostUid === 'string' && data.hostUid
            ? sanitizeBackendUid(data.hostUid)
            : identity.uid;
        return this.withScopeLocks(
          [`user:${identity.uid}`, `fire:${targetUid}`, 'visit_dir'],
          () => this.extinguishFire(data, identity)
        );
      }

      case 'setBurrowFlooFrame':
        return this.withScopeLocks([`user:${identity.uid}`], () =>
          this.setFlooFrame(data, identity)
        );

      case 'manageBurrowSales':
        return this.withScopeLocks(['sales_config', 'visit_dir'], () =>
          this.manageSales(data, identity)
        );

      case 'getBurrowHouseCupStandings':
      case 'getWeeklyHouseCupStandings':
        return this.getWeeklyHouseCupStandings(data, identity);

      case 'contributeBurrowHouseCup':
      case 'contributeWeeklyHouseCup':
        return this.withScopeLocks(
          [`user:${identity.uid}`, `cup:${vnWeekKey(this.now())}`],
          () => this.contributeWeeklyHouseCup(data, identity)
        );

      case 'postBurrowCoopRequest':
      case 'postCoopAssistanceRequest':
        return this.withScopeLocks([`user:${identity.uid}`, `coop:${identity.uid}`], () =>
          this.postCoopAssistanceRequest(data, identity)
        );

      case 'fulfillBurrowCoopRequest':
      case 'fulfillCoopAssistanceRequest': {
        const hostUid = sanitizeBackendUid(data.hostUid);
        return this.withScopeLocks(
          [
            `user:${identity.uid}`,
            `coop:${hostUid}`,
            `helpers:${hostUid}`,
            `cup:${vnWeekKey(this.now())}`,
          ],
          () => this.fulfillCoopAssistanceRequest(data, identity)
        );
      }

      case 'getBurrowCoopRequests':
      case 'getCoopAssistanceRequests':
        return this.getCoopAssistanceRequests(data, identity);

      default:
        throw new BurrowServerError(
          'unknown-callable',
          `Lệnh máy chủ không tồn tại: ${callableName}`,
          { callableName },
          404
        );
    }
  }

  private async performAction(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(
      identity.uid,
      identity.house,
      identity.houseExplicit ? 'hpvn' : 'default'
    );
    await this.applyIdentityProfileToState(state, identity);
    const wallet = await this.getOrCreateWallet(identity.uid);
    const daily = await this.getOrCreateDaily(identity.uid);
    const salesConfig = await this.getOrCreateSalesConfig();

    const { requestId, catalogHash: clientCatalogHash, ...payloadWithoutReqId } = data;
    const { reqId, hash, cachedReceipt } = this.validateAndCheckIdempotency(
      requestId,
      payloadWithoutReqId,
      daily
    );
    if (cachedReceipt) {
      return this.buildSnapshotResponse({
        identity,
        state,
        wallet,
        daily,
        salesConfig,
        knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
        receipt: cachedReceipt,
      });
    }

    const action = String(data.action || '');
    const nonRevisionActions = new Set([
      'freeAction',
      'guideDone',
      'setScene',
      'owlSeen',
      'syncProfile',
      'submitLeaderboard',
      'getLeaderboard',
    ]);
    if (!nonRevisionActions.has(action)) {
      if (data.expectedRevision !== state.revision) {
        throw new BurrowServerError(
          'revision-conflict',
          'Thung lũng vừa được cập nhật ở phiên khác; đang tải lại trạng thái mới nhất.',
          {
            expectedRevision: data.expectedRevision ?? null,
            actualRevision: state.revision,
          },
          409
        );
      }
    }

    // Thao tác trên bản sao (atomic clone) — nếu bất kỳ bước nào lỗi (như thiếu Galleons cuối cùng), không ghi bẩn state
    const nextState: BurrowAuthoritativeStateDoc = structuredClone(state);
    const nextDaily: BurrowDailyDoc = structuredClone(daily);
    const nextWallet: GringottsWalletDoc = structuredClone(wallet);
    const nextLedger = await this.getLedger(identity.uid);
    const prevLedgerLength = nextLedger.length;
    const nowMs = this.now();
    const extraReceipt: Record<string, unknown> = {};
    const pendingLeaderboardSubmissions: Array<{
      gameId: string;
      entry: Record<string, unknown>;
      awardImprovementCup?: boolean;
    }> = [];
    let galleonsToCharge = 0;

    const recordQuestProgress = (trigger: string, amount = 1) => {
      for (const q of nextDaily.quests) {
        if (!q.claimed && q.triggers.includes(trigger)) {
          q.progress = Math.min(q.target, q.progress + amount);
        }
      }
    };

    switch (action) {
      case 'startEconomicCycle':
      case 'plant':
      case 'craft':
      case 'adopt': {
        const domainRaw = String(
          data.domain ||
            (action === 'plant' ? 'crop' : action === 'adopt' ? 'pasture' : 'workshop')
        ) as EconomicDomain;
        const validDomains = new Set<EconomicDomain>([
          'crop',
          'pasture',
          'workshop',
          'brew',
          'construction',
        ]);
        const domain: EconomicDomain = validDomains.has(domainRaw) ? domainRaw : 'crop';
        const targetId = String(data.targetId || data.species || data.recipeId || 'wheat');
        const qty = Math.max(1, Math.min(20, Math.floor(Number(data.qty) || 1)));

        if (domain === 'crop') {
          if ((nextState.supplies.water || 0) < qty) {
            throw new BurrowServerError(
              'missing-supply',
              'Không đủ Nước Phép Aguamenti cho số ô gieo mới.',
              { resource: 'water', required: qty, have: nextState.supplies.water || 0 }
            );
          }
          if ((nextState.supplies.seeds[targetId] ?? 0) < qty) {
            throw new BurrowServerError(
              'missing-supply',
              'Không đủ hạt giống trong túi cho số ô gieo mới.',
              {
                resource: `seeds.${targetId}`,
                required: qty,
                have: nextState.supplies.seeds[targetId] ?? 0,
              }
            );
          }
          nextState.supplies.water -= qty;
          nextState.supplies.seeds[targetId] -= qty;
        }

        const completedBefore = nextState.economicCycles[domain] || 0;
        const durationMs = computeAuthoritativeEconomicDurationMs(completedBefore);
        const timerId = String(
          data.timerId || `${domain}_${targetId}_${nextState.revision + 1}`
        );
        const timer: AuthoritativeTimerEntry = {
          timerId,
          domain,
          targetId,
          qty,
          startedAt: nowMs,
          readyAt: nowMs + durationMs,
          boosted: false,
          cared: false,
        };
        nextState.timers.push(timer);
        nextState.revision += 1;
        recordQuestProgress('plant', qty);
        extraReceipt.timer = timer;
        extraReceipt.durationMs = durationMs;
        break;
      }

      case 'minigameClear': {
        const gameId = String(data.gameId || 'match3');
        const stage = Math.max(1, Math.min(777, Math.floor(Number(data.stage) || 1)));
        const score = Math.max(0, Math.min(9_999_999, Math.floor(Number(data.score) || 100)));

        // Giảm đúng 10 phút cho toàn bộ các hoạt động kinh tế đang chờ
        let spedCount = 0;
        for (const t of nextState.timers) {
          if (t.readyAt > nowMs) {
            t.startedAt -= MINIGAME_WIN_REDUCTION_MS;
            t.readyAt -= MINIGAME_WIN_REDUCTION_MS;
            spedCount += 1;
          }
        }

        const prevRec = nextState.minigameRecords[gameId] ?? {
          bestStage: 0,
          ratingScore: 0,
          totalWins: 0,
          bestStreak: 0,
          updatedAt: nowMs,
        };
        const updatedRec = {
          bestStage: Math.max(prevRec.bestStage, stage),
          ratingScore: Math.max(prevRec.ratingScore, score),
          totalWins: prevRec.totalWins + 1,
          bestStreak: Math.max(prevRec.bestStreak, Number(data.streak) || 1),
          updatedAt: nowMs,
        };
        nextState.minigameRecords[gameId] = updatedRec;
        nextState.magicStars += 1;
        nextState.xp += 25;
        nextState.level = Math.min(100, Math.max(nextState.level, 1 + Math.floor(nextState.xp / 120)));
        nextState.festival.points += 10;
        nextState.revision += 1;
        recordQuestProgress('minigameClear', 1);

        if (SCORED_SERVER_LEADERBOARD_GAMES.has(gameId)) {
          pendingLeaderboardSubmissions.push({
            gameId,
            entry: {
              name: nextState.playerName,
              parkName: nextState.parkName,
              friendCode: nextState.friendCode,
              avatarEmoji: nextState.avatarEmoji,
              house: nextState.house,
              primaryValue: updatedRec.bestStage,
              ratingScore: updatedRec.ratingScore,
              totalWins: updatedRec.totalWins,
              bestStreak: updatedRec.bestStreak,
            },
            awardImprovementCup: false,
          });
        }

        const cupRes = await this.addHouseCupPoints(nextState.house, nextDaily, 10);
        extraReceipt.spedTimersCount = spedCount;
        extraReceipt.reducedMs = MINIGAME_WIN_REDUCTION_MS;
        extraReceipt.magicStars = nextState.magicStars;
        extraReceipt.cupPointsAdded = cupRes.added;
        break;
      }

      case 'completeEconomicCycle':
      case 'harvest':
      case 'claimAnimals':
      case 'claimCraft': {
        const timerId = typeof data.timerId === 'string' ? data.timerId : null;
        const idx = timerId
          ? nextState.timers.findIndex((t) => t.timerId === timerId)
          : nextState.timers.findIndex((t) => t.readyAt <= nowMs);
        if (idx < 0) {
          throw new BurrowServerError(
            'invalid-action-input',
            'Không tìm thấy chu kỳ sản xuất hợp lệ để thu hoạch.'
          );
        }
        const timer = nextState.timers[idx];
        if (nowMs < timer.readyAt) {
          throw new BurrowServerError(
            'timer-not-ready',
            'Mẻ thu hoạch chưa chín theo đồng hồ máy chủ.',
            {
              timerId: timer.timerId,
              readyAt: timer.readyAt,
              serverNow: nowMs,
              remainingMs: timer.readyAt - nowMs,
            }
          );
        }
        nextState.timers.splice(idx, 1);
        nextState.economicCycles[timer.domain] =
          (nextState.economicCycles[timer.domain] || 0) + 1;
        nextState.inventory[timer.targetId] =
          (nextState.inventory[timer.targetId] || 0) + timer.qty;
        nextState.xp += 18 * timer.qty;
        const beforeLv = nextState.level;
        nextState.level = Math.min(100, Math.max(nextState.level, 1 + Math.floor(nextState.xp / 120)));
        if (nextState.level > beforeLv && nextState.level <= 19) {
          nextState.supplies.boost += nextState.level - beforeLv;
        }
        nextState.festival.points += 5;
        nextState.revision += 1;
        recordQuestProgress('harvest', timer.qty);
        extraReceipt.harvested = {
          itemId: timer.targetId,
          qty: timer.qty,
          domain: timer.domain,
          completedCountAfter: nextState.economicCycles[timer.domain],
          nextDurationMs: computeAuthoritativeEconomicDurationMs(
            nextState.economicCycles[timer.domain]
          ),
        };
        break;
      }

      case 'care': {
        const usedCare = nextDaily.freeActions.care || 0;
        if (usedCare >= FREE_ACTION_CAPS.care) {
          throw new BurrowServerError(
            'daily-cap',
            `Hôm nay đã tưới chăm đủ ${FREE_ACTION_CAPS.care} lượt miễn phí; mai quay lại nhé.`
          );
        }
        const timerId = typeof data.timerId === 'string' ? data.timerId : '';
        const timer = timerId
          ? nextState.timers.find((t) => t.timerId === timerId)
          : nextState.timers.find((t) => !t.cared && t.readyAt > nowMs);
        if (!timer || timer.readyAt <= nowMs || timer.cared) {
          throw new BurrowServerError(
            'invalid-care-target',
            'Không có cây hoặc chuồng đang lớn chưa chăm để tưới nước.'
          );
        }
        const cut = Math.floor((timer.readyAt - timer.startedAt) * CARE_BOOST_SPEED_SHARE);
        timer.startedAt -= cut;
        timer.readyAt = Math.max(nowMs, timer.readyAt - cut);
        timer.cared = true;
        nextDaily.freeActions.care = usedCare + 1;
        nextState.revision += 1;
        extraReceipt.caredTimerId = timer.timerId;
        extraReceipt.cutMs = cut;
        break;
      }

      case 'boost': {
        const timerId = String(data.timerId || '');
        const timer = nextState.timers.find((t) => t.timerId === timerId);
        if (!timer) {
          throw new BurrowServerError(
            'invalid-boost-target',
            'Không tìm thấy mẻ sản xuất cần bón thúc.'
          );
        }
        if (timer.readyAt <= nowMs) {
          throw new BurrowServerError('timer-ready', 'Mẻ này đã hoàn thành, không cần bón thúc.');
        }
        if (timer.boosted) {
          throw new BurrowServerError(
            'already-boosted',
            'Mẻ này đã được dùng Phân Bón Thảo Dược rồi.'
          );
        }
        if (nextState.supplies.boost < 1) {
          throw new BurrowServerError(
            'missing-supply',
            'Không còn Phân Bón Thảo Dược trong kho.',
            { resource: 'boost', required: 1, have: 0 }
          );
        }
        const cut = Math.floor((timer.readyAt - timer.startedAt) * CARE_BOOST_SPEED_SHARE);
        timer.startedAt -= cut;
        timer.readyAt -= cut;
        timer.boosted = true;
        nextState.supplies.boost -= 1;
        nextState.revision += 1;
        extraReceipt.boostedTimerId = timer.timerId;
        extraReceipt.cutMs = cut;
        break;
      }

      case 'build': {
        const blueprintId = String(data.blueprintId || data.expansionId || '');
        const spec = AUTHORITATIVE_BUILD_SPECS[blueprintId];
        if (!spec) {
          throw new BurrowServerError('invalid-action-input', 'Công trình xây dựng không hợp lệ.', {
            blueprintId,
          });
        }
        if (nextState.builtIds.includes(spec.id)) {
          throw new BurrowServerError('already-claimed', 'Công trình này đã được xây dựng rồi.');
        }
        // Quy tắc vàng từ `hagridfarm`: kiểm tra nông sản TRƯỚC, Sao Phép thứ hai, trừ Galleons CUỐI CÙNG!
        const missing = Object.entries(spec.cropCost)
          .map(([resource, required]) => ({
            resource,
            required,
            have: nextState.inventory[resource] || 0,
          }))
          .filter((m) => m.have < m.required);
        if (missing.length > 0) {
          throw new BurrowServerError(
            'missing-crops',
            'Chưa đủ nông sản trong Kho Đỏ cho công trình này.',
            { missing }
          );
        }
        if (nextState.magicStars < spec.starCost) {
          throw new BurrowServerError(
            'insufficient-stars',
            'Chưa đủ Sao Phép Thuật để khởi công.',
            { required: spec.starCost, have: nextState.magicStars }
          );
        }
        for (const [resource, required] of Object.entries(spec.cropCost)) {
          nextState.inventory[resource] -= required;
        }
        nextState.magicStars -= spec.starCost;
        nextState.builtIds.push(spec.id);
        nextState.xp += 60;
        nextState.level = Math.min(100, Math.max(nextState.level, 1 + Math.floor(nextState.xp / 120)));
        nextState.festival.points += 15;
        nextState.revision += 1;
        galleonsToCharge = spec.galleonCost;
        extraReceipt.blueprintId = spec.id;
        break;
      }

      case 'deliverOrder': {
        const orderId = String(data.orderId || '');
        const order = buildDailyOwlOrders(nextDaily.dayKey, nextState.level).find(
          (o) => o.id === orderId
        );
        if (!order) {
          throw new BurrowServerError('unknown-order', 'Không tìm thấy Đơn Hàng Cú này hôm nay.');
        }
        if (nextDaily.ops[`order_done_${order.id}`]) {
          throw new BurrowServerError('already-claimed', 'Đơn Hàng Cú này đã được giao rồi.');
        }
        const missing = Object.entries(order.items)
          .map(([resource, required]) => ({
            resource,
            required,
            have: nextState.inventory[resource] || 0,
          }))
          .filter((m) => m.have < m.required);
        if (missing.length > 0) {
          throw new BurrowServerError('missing-crops', 'Kho Đỏ chưa đủ hàng cho Đơn Cú này.', {
            missing,
          });
        }
        for (const [resource, required] of Object.entries(order.items)) {
          nextState.inventory[resource] -= required;
        }
        this.creditWalletInMemory(nextWallet, nextLedger, {
          requestId: reqId,
          amount: order.galleons,
          sourceType: 'burrow-garden-order',
          reasonCode: 'owl_order_delivery',
        });
        nextState.xp += order.xp;
        nextState.level = Math.min(100, Math.max(nextState.level, 1 + Math.floor(nextState.xp / 120)));
        nextState.supplies.boost += 1;
        nextState.festival.points += 12;
        nextState.revision += 1;
        nextDaily.ops[`order_done_${order.id}`] = {
          hash: order.id,
          receipt: { orderId: order.id },
          committedAt: nowMs,
        };
        recordQuestProgress('deliverOrder', 1);
        const cupRes = await this.addHouseCupPoints(nextState.house, nextDaily, order.cupPoints);
        extraReceipt.orderId = order.id;
        extraReceipt.galleonsEarned = order.galleons;
        extraReceipt.cupPointsAdded = cupRes.added;
        break;
      }

      case 'claimQuest': {
        const questId = String(data.questId || '');
        const allQ = [...nextDaily.quests, ...nextDaily.bonusQuests];
        const q = allQ.find((item) => item.id === questId);
        if (!q) {
          throw new BurrowServerError('invalid-action-input', 'Không tìm thấy nhiệm vụ trong ngày.');
        }
        if (q.claimed) {
          throw new BurrowServerError('already-claimed', 'Nhiệm vụ này đã nhận thưởng rồi.');
        }
        if (q.progress < q.target) {
          throw new BurrowServerError('quest-incomplete', 'Nhiệm vụ chưa hoàn thành đủ chỉ tiêu.');
        }
        q.claimed = true;
        if (q.reward.kind === 'water') nextState.supplies.water += q.reward.amount;
        else if (q.reward.kind === 'boost') nextState.supplies.boost += q.reward.amount;
        nextState.festival.points += 15;
        nextState.revision += 1;
        extraReceipt.questId = q.id;
        extraReceipt.reward = q.reward;
        extraReceipt.festivalPoints = 15;
        break;
      }

      case 'claimChest': {
        const isBonus = data.chest === 'bonus';
        if (isBonus) {
          if (nextDaily.bonusChestClaimed) {
            throw new BurrowServerError('already-claimed', 'Rương Bà Molly hôm nay đã mở rồi.');
          }
          const ready = [...nextDaily.quests, ...nextDaily.bonusQuests].every(
            (q) => q.progress >= q.target
          );
          if (!ready) {
            throw new BurrowServerError(
              'quest-incomplete',
              'Cần hoàn thành đủ cả nhiệm vụ chính và Việc thêm để mở Rương Bà Molly.'
            );
          }
          nextDaily.bonusChestClaimed = true;
          nextState.supplies.boost += 1;
          nextState.supplies.water += 24;
          nextState.festival.points += 30;
          extraReceipt.chest = 'bonus';
          extraReceipt.festivalPoints = 30;
        } else {
          if (nextDaily.chestClaimed) {
            throw new BurrowServerError('already-claimed', 'Rương Cú Vàng hôm nay đã mở rồi.');
          }
          const done = nextDaily.quests.filter((q) => q.progress >= q.target).length;
          if (done < 3) {
            throw new BurrowServerError(
              'quest-incomplete',
              'Cần hoàn thành đủ 3 nhiệm vụ Cú Đưa Thư để mở Rương Cú Vàng.'
            );
          }
          nextDaily.chestClaimed = true;
          nextState.supplies.boost += 1;
          nextState.supplies.water += 12;
          nextState.festival.points += 20;
          extraReceipt.chest = 'normal';
          extraReceipt.festivalPoints = 20;
        }
        nextState.revision += 1;
        break;
      }

      case 'claimFestival': {
        const milestoneKey = String(data.milestoneKey || '');
        const m = FEAST_MILESTONES.find((item) => item.key === milestoneKey);
        if (!m) {
          throw new BurrowServerError('festival-not-found', 'Không tìm thấy mốc Đại Tiệc Mùa Gặt.');
        }
        if (nextState.festival.claimedMilestones.includes(m.key)) {
          throw new BurrowServerError('already-claimed', 'Mốc Đại Tiệc này đã nhận thưởng rồi.');
        }
        if (nextState.festival.points < m.points) {
          throw new BurrowServerError('festival-incomplete', 'Chưa đủ điểm Đại Tiệc để nhận mốc này.');
        }
        nextState.festival.claimedMilestones.push(m.key);
        if (m.reward.kind === 'water') nextState.supplies.water += m.reward.amount;
        else if (m.reward.kind === 'boost') nextState.supplies.boost += m.reward.amount;
        else if (m.reward.kind === 'galleons') {
          this.creditWalletInMemory(nextWallet, nextLedger, {
            requestId: reqId,
            amount: m.reward.amount,
            sourceType: 'burrow-garden-order',
            reasonCode: 'festival_milestone',
          });
        }
        nextState.revision += 1;
        extraReceipt.milestoneKey = m.key;
        extraReceipt.reward = m.reward;
        break;
      }

      case 'claimAchievement': {
        const achievementId = String(data.achievementId || '');
        const ach = BURROW_ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!ach) {
          throw new BurrowServerError('invalid-action-input', 'Không tìm thấy thành tựu này.');
        }
        if (nextState.achievementsClaimed.includes(ach.id)) {
          throw new BurrowServerError('already-claimed', 'Thành tựu này đã nhận thưởng rồi.');
        }
        if (nextState.level < ach.minLevel || !ach.check(nextState)) {
          throw new BurrowServerError('quest-incomplete', 'Thành tựu chưa mở khóa.');
        }
        nextState.achievementsClaimed.push(ach.id);
        if (ach.reward.kind === 'water') nextState.supplies.water += ach.reward.amount;
        else if (ach.reward.kind === 'boost') nextState.supplies.boost += ach.reward.amount;
        else {
          this.creditWalletInMemory(nextWallet, nextLedger, {
            requestId: reqId,
            amount: ach.reward.amount,
            sourceType: 'burrow-garden-order',
            reasonCode: 'achievement_reward',
          });
        }
        nextState.revision += 1;
        extraReceipt.achievementId = ach.id;
        break;
      }

      case 'freeAction': {
        const kind = String(data.kind || '');
        const allowedFree = new Set(['pet', 'rotate', 'postcard', 'shareFloo', 'startTour']);
        if (!allowedFree.has(kind)) {
          throw new BurrowServerError(
            'invalid-action-input',
            'Thao tác miễn phí không hợp lệ.',
            { kind }
          );
        }
        const used = nextDaily.freeActions[kind] || 0;
        const cap = FREE_ACTION_CAPS[kind] ?? 1;
        const counted = used < cap;
        if (counted) {
          nextDaily.freeActions[kind] = used + 1;
          nextState.festival.points += 5;
          for (const bq of nextDaily.bonusQuests) {
            if (!bq.claimed && bq.triggers.includes(kind)) {
              bq.progress = Math.min(bq.target, bq.progress + 1);
            }
          }
        }
        extraReceipt.freeAction = {
          kind,
          counted,
          used: nextDaily.freeActions[kind] || used,
          cap,
        };
        break;
      }

      case 'placeDecoration': {
        const itemId = String(data.itemId || '');
        if (!nextState.decorations.owned.includes(itemId)) {
          throw new BurrowServerError('invalid-action-input', 'Chưa sở hữu vật trang trí này.');
        }
        const facing =
          data.facing === 'right' || data.facing === 'default' ? data.facing : undefined;
        const currentSlot = nextState.decorations.placements.indexOf(itemId);
        const targetSlot =
          data.slot === null
            ? null
            : typeof data.slot === 'number'
              ? Math.max(0, Math.min(5, Math.floor(data.slot)))
              : currentSlot;
        const turned =
          facing !== undefined &&
          facing !== (nextState.decorations.rotations[itemId] || 'default');

        if (targetSlot === currentSlot && !turned) {
          throw new BurrowServerError(
            'action-noop',
            'Đồ trang trí đã nằm sẵn ở vị trí và hướng này.'
          );
        }
        if (facing !== undefined) {
          nextState.decorations.rotations[itemId] = facing;
        }
        if (targetSlot === null) {
          if (currentSlot >= 0) nextState.decorations.placements[currentSlot] = null;
        } else if (targetSlot !== currentSlot) {
          if (nextState.decorations.placements[targetSlot] !== null) {
            throw new BurrowServerError(
              'invalid-action-input',
              'Ô trang trí này đang có vật phẩm khác.'
            );
          }
          nextState.decorations.placements[targetSlot] = itemId;
          if (currentSlot >= 0) nextState.decorations.placements[currentSlot] = null;
        }
        const usedRotate = nextDaily.freeActions.rotate || 0;
        const counted = usedRotate < FREE_ACTION_CAPS.rotate;
        if (counted) nextDaily.freeActions.rotate = usedRotate + 1;
        nextState.revision += 1;
        extraReceipt.freeAction = {
          kind: 'rotate',
          counted,
          used: nextDaily.freeActions.rotate || usedRotate,
          cap: FREE_ACTION_CAPS.rotate,
        };
        break;
      }

      case 'guideDone': {
        const lessonId = String(data.lessonId || '');
        if (!/^[a-z0-9_-]{1,40}$/i.test(lessonId)) {
          throw new BurrowServerError('invalid-action-input', 'Mã bài hướng dẫn không hợp lệ.');
        }
        if (nextState.guideDone.includes(lessonId)) {
          throw new BurrowServerError('action-noop', 'Bài hướng dẫn này đã hoàn thành trước đó.');
        }
        nextState.guideDone.push(lessonId);
        extraReceipt.lessonId = lessonId;
        break;
      }

      case 'setScene': {
        const scene = data.scene as Record<string, unknown> | undefined;
        if (!scene || typeof scene !== 'object') {
          throw new BurrowServerError('invalid-action-input', 'Khung cảnh không hợp lệ.');
        }
        nextState.decorations.scene = {
          weather: String(scene.weather || 'clear').slice(0, 24),
          atmosphere: String(scene.atmosphere || 'day').slice(0, 24),
          event: String(scene.event || 'harvest_feast').slice(0, 32),
        };
        extraReceipt.scene = nextState.decorations.scene;
        break;
      }

      case 'syncProfile': {
        if (
          data.sandboxMode === true ||
          data.sandboxTainted === true ||
          data.isHeadmasterPreview === true
        ) {
          throw new BurrowServerError(
            'sandbox-forbidden',
            'Phiên chơi Sandbox / Xem trước không được đồng bộ hồ sơ lên máy chủ HPVN.',
            {},
            403
          );
        }
        if (typeof data.playerName === 'string' && data.playerName.trim()) {
          nextState.playerName = data.playerName.trim().slice(0, 42);
        }
        if (typeof data.parkName === 'string' && data.parkName.trim()) {
          nextState.parkName = data.parkName.trim().slice(0, 42);
        }
        if (typeof data.avatarUrl === 'string') {
          const cleanAvatar = data.avatarUrl.trim().slice(0, 260);
          if (!cleanAvatar) {
            nextState.avatarUrl = undefined;
          } else if (/^(\/|https?:\/\/|data:image\/)/i.test(cleanAvatar)) {
            nextState.avatarUrl = cleanAvatar;
          }
        }
        if (typeof data.avatarEmoji === 'string' && data.avatarEmoji.trim()) {
          nextState.avatarEmoji = data.avatarEmoji.trim().slice(0, 8);
        }
        const incomingHouse = normalizeHogwartsHouse(data.house);
        if (incomingHouse) {
          if (nextState.houseSource === 'hpvn') {
            // Giữ nguyên Nhà Hogwarts chính thức từ hồ sơ diễn đàn HPVN (chỉ cho phép đổi khi có cờ allowOverrideHpvnHouse)
            if (data.allowOverrideHpvnHouse === true) {
              nextState.house = incomingHouse;
            }
          } else if (data.houseExplicit === true) {
            nextState.house = incomingHouse;
            nextState.houseSource = 'player';
          } else if (
            (!nextState.houseSource || nextState.houseSource === 'default') &&
            incomingHouse !== 'Gryffindor'
          ) {
            nextState.house = incomingHouse;
          }
        }
        if (typeof data.level === 'number' && Number.isFinite(data.level)) {
          nextState.level = Math.max(nextState.level, Math.min(100, Math.floor(data.level)));
        }
        if (data.scene && typeof data.scene === 'object') {
          const sc = data.scene as Record<string, unknown>;
          nextState.decorations.scene = {
            weather: String(sc.weather || nextState.decorations.scene.weather || 'clear').slice(0, 24),
            atmosphere: String(sc.atmosphere || nextState.decorations.scene.atmosphere || 'day').slice(0, 24),
            event: String(sc.event || nextState.decorations.scene.event || 'harvest_feast').slice(0, 32),
          };
        }
        if (data.rawClientSave && typeof data.rawClientSave === 'object') {
          const rawSave = data.rawClientSave as Record<string, unknown>;
          if (typeof rawSave.version === 'number' && rawSave.version > 0) {
            this.reconcileClientSaveIntoState(rawSave, nextState, nextDaily);
            for (const item of this.extractScoredLeaderboardEntriesFromSave(rawSave, nextState)) {
              pendingLeaderboardSubmissions.push({ ...item, awardImprovementCup: true });
            }
          }
        }
        if (data.leaderboardEntries && typeof data.leaderboardEntries === 'object') {
          for (const [gid, rawEntry] of Object.entries(
            data.leaderboardEntries as Record<string, unknown>
          )) {
            if (
              SCORED_SERVER_LEADERBOARD_GAMES.has(gid) &&
              rawEntry &&
              typeof rawEntry === 'object'
            ) {
              pendingLeaderboardSubmissions.push({
                gameId: gid,
                entry: rawEntry as Record<string, unknown>,
                awardImprovementCup: true,
              });
            }
          }
        }
        extraReceipt.syncedProfile = {
          playerName: nextState.playerName,
          parkName: nextState.parkName,
          house: nextState.house,
          avatarUrl: nextState.avatarUrl ?? null,
          level: nextState.level,
        };
        break;
      }

      case 'submitLeaderboard': {
        if (
          data.sandboxMode === true ||
          data.sandboxTainted === true ||
          data.isHeadmasterPreview === true ||
          (data.entry &&
            typeof data.entry === 'object' &&
            ((data.entry as Record<string, unknown>).sandboxMode === true ||
              (data.entry as Record<string, unknown>).sandboxTainted === true ||
              (data.entry as Record<string, unknown>).isHeadmasterPreview === true))
        ) {
          throw new BurrowServerError(
            'sandbox-forbidden',
            'Không cho phép gửi điểm từ Chế Độ Thử Nghiệm (Sandbox)!',
            {},
            403
          );
        }
        if (data.houseExplicit === true && nextState.houseSource !== 'hpvn') {
          const explicitHouse = normalizeHogwartsHouse(data.house);
          if (explicitHouse) {
            nextState.house = explicitHouse;
            nextState.houseSource = 'player';
          }
        }
        if (data.entriesByGame && typeof data.entriesByGame === 'object') {
          for (const [gid, rawEntry] of Object.entries(
            data.entriesByGame as Record<string, unknown>
          )) {
            if (
              SCORED_SERVER_LEADERBOARD_GAMES.has(gid) &&
              rawEntry &&
              typeof rawEntry === 'object'
            ) {
              pendingLeaderboardSubmissions.push({
                gameId: gid,
                entry: rawEntry as Record<string, unknown>,
                awardImprovementCup: true,
              });
            }
          }
        }
        if (typeof data.gameId === 'string' && data.entry && typeof data.entry === 'object') {
          if (SCORED_SERVER_LEADERBOARD_GAMES.has(data.gameId)) {
            pendingLeaderboardSubmissions.push({
              gameId: data.gameId,
              entry: data.entry as Record<string, unknown>,
              awardImprovementCup: true,
            });
          }
        }
        extraReceipt.submittedGames = pendingLeaderboardSubmissions.map((s) => s.gameId);
        break;
      }

      case 'getLeaderboard': {
        const reqGame = typeof data.gameId === 'string' ? data.gameId : 'match3';
        extraReceipt.gameId = SCORED_SERVER_LEADERBOARD_GAMES.has(reqGame) ? reqGame : 'match3';
        break;
      }

      case 'syncSaveSnapshot': {
        const rawSave =
          data.save && typeof data.save === 'object'
            ? (data.save as Record<string, unknown>)
            : null;
        if (!rawSave || typeof rawSave.version !== 'number' || rawSave.version <= 0) {
          throw new BurrowServerError('invalid-action-input', 'Bản lưu đồng bộ không hợp lệ.');
        }
        this.reconcileClientSaveIntoState(rawSave, nextState, nextDaily);
        for (const item of this.extractScoredLeaderboardEntriesFromSave(rawSave, nextState)) {
          pendingLeaderboardSubmissions.push({ ...item, awardImprovementCup: true });
        }
        nextState.revision += 1;
        extraReceipt.syncedRevision = nextState.revision;
        break;
      }

      default:
        throw new BurrowServerError(
          'unknown-action',
          `Hành động khu vườn không được hỗ trợ: ${action}`,
          { action }
        );
    }

    // Trừ Galleons CUỐI CÙNG (nếu không đủ tiền, throw ở đây và toàn bộ clone bị hủy sạch)
    if (galleonsToCharge > 0) {
      this.debitWalletInMemory(nextWallet, nextLedger, {
        requestId: reqId,
        cost: galleonsToCharge,
        sourceType: 'burrow-garden-build',
        reasonCode: 'garden_build',
        refusalReason: 'insufficient-galleons',
      });
      extraReceipt.galleons = galleonsToCharge;
      extraReceipt.balance = nextWallet.spendable;
    }

    if (pendingLeaderboardSubmissions.length > 0) {
      let totalLbCupAdded = 0;
      for (const sub of pendingLeaderboardSubmissions) {
        const lbRes = await this.upsertLeaderboardEntryUnlocked({
          uid: identity.uid,
          gameId: sub.gameId,
          entry: sub.entry,
          state: nextState,
          daily: nextDaily,
          awardImprovementCup: sub.awardImprovementCup !== false,
        });
        totalLbCupAdded += lbRes.cupPointsAdded;
      }
      if (totalLbCupAdded > 0) {
        extraReceipt.leaderboardCupPointsAdded = totalLbCupAdded;
      }
    }

    nextState.updatedAt = nowMs;
    const receipt: Record<string, unknown> = {
      ...extraReceipt,
      action,
      requestId: reqId,
      expectedRevision: state.revision,
      revision: nextState.revision,
      committedAt: nowMs,
    };
    nextDaily.ops[reqId] = { hash, receipt, committedAt: nowMs };

    // Ghi bền vững toàn bộ thay đổi
    await this.writeJson(`burrow_states:${identity.uid}`, nextState);
    await this.writeJson(`burrow_daily:${identity.uid}:${nextDaily.dayKey}`, nextDaily, 86_400 * 14);
    if (nextLedger.length !== prevLedgerLength) {
      await this.persistWalletAndLedger(identity.uid, nextWallet, nextLedger, prevLedgerLength);
    }
    await this.registerVisitDirectoryEntry(nextState);
    if (action === 'syncProfile' || action === 'submitLeaderboard') {
      await this.refreshUserMetadataInLeaderboards(nextState);
    }

    return this.buildSnapshotResponse({
      identity,
      state: nextState,
      wallet: nextWallet,
      daily: nextDaily,
      salesConfig,
      knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
      receipt,
    });
  }

  /**
   * Mua vật tư / hạt giống / trang trí (`buyBurrowSupplies`)
   */
  private async buySupplies(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(identity.uid, identity.house);
    const wallet = await this.getOrCreateWallet(identity.uid);
    const daily = await this.getOrCreateDaily(identity.uid);
    const salesConfig = await this.getOrCreateSalesConfig();

    const { requestId, catalogHash: clientCatalogHash, ...payloadWithoutReqId } = data;
    const { reqId, hash, cachedReceipt } = this.validateAndCheckIdempotency(
      requestId,
      payloadWithoutReqId,
      daily
    );
    if (cachedReceipt) {
      return this.buildSnapshotResponse({
        identity,
        state,
        wallet,
        daily,
        salesConfig,
        knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
        receipt: cachedReceipt,
      });
    }

    const itemId = String(data.itemId || '');
    const entry = BURROW_STORE_CATALOG.find(
      (i) => i.id === itemId && i.unlockLevel <= state.level
    );
    if (!entry) {
      throw new BurrowServerError('unknown-item', 'Mặt hàng chưa mở khóa hoặc không tồn tại.', {
        itemId,
      });
    }
    if (entry.forSale === false) {
      throw new BurrowServerError('not-for-sale', 'Mặt hàng này hiện đang tạm ngừng bán.');
    }
    if (data.catalogVersion && data.catalogVersion !== CATALOG_VERSION) {
      throw new BurrowServerError(
        'price-changed',
        'Danh mục cửa hàng vừa cập nhật phiên bản mới; hãy tải lại giá.'
      );
    }

    const qty = Math.max(1, Math.min(50, Math.floor(Number(data.quantity) || 1)));
    const boughtToday = daily.storeBoughtByItem[entry.id] || 0;
    if (!entry.overflowMultiplier && boughtToday + qty > entry.dailyLimit) {
      throw new BurrowServerError('daily-cap', 'Đã đạt hạn mức mua mặt hàng này trong ngày.', {
        itemId: entry.id,
        dailyRemaining: Math.max(0, entry.dailyLimit - boughtToday),
      });
    }

    const actualCost = packTotal(entry, qty, salesConfig, boughtToday);
    if (typeof data.expectedTotal === 'number' && data.expectedTotal !== actualCost) {
      throw new BurrowServerError('price-changed', 'Giá mặt hàng vừa thay đổi.', {
        expectedTotal: data.expectedTotal,
        actualTotal: actualCost,
      });
    }

    const nextState = structuredClone(state);
    const nextDaily = structuredClone(daily);
    const nextWallet = structuredClone(wallet);
    const nextLedger = await this.getLedger(identity.uid);
    const prevLedgerLen = nextLedger.length;

    if (entry.kind === 'seed' && entry.cropId) {
      nextState.supplies.seeds[entry.cropId] =
        (nextState.supplies.seeds[entry.cropId] || 0) + entry.quantity * qty;
    } else if (entry.kind === 'water') {
      nextState.supplies.water += entry.quantity * qty;
    } else if (entry.kind === 'boost') {
      if (entry.stockCap && nextState.supplies.boost + entry.quantity * qty > entry.stockCap) {
        throw new BurrowServerError(
          'stock-cap',
          `Kho chỉ chứa tối đa ${entry.stockCap} ${entry.label}.`
        );
      }
      nextState.supplies.boost += entry.quantity * qty;
    } else if (entry.kind === 'supply' && entry.supplyKey === 'phoenixTalismans') {
      const add = entry.quantity * qty;
      if (entry.stockCap && nextState.phoenixTalismans + add > entry.stockCap) {
        throw new BurrowServerError(
          'stock-cap',
          `Chỉ mang tối đa ${entry.stockCap} Bùa Hộ Mệnh Phượng Hoàng.`
        );
      }
      nextState.phoenixTalismans += add;
    } else if (entry.kind === 'decoration') {
      if (nextState.decorations.owned.includes(entry.id)) {
        throw new BurrowServerError('already-claimed', 'Bạn đã sở hữu món trang trí này rồi.');
      }
      nextState.decorations.owned.push(entry.id);
    }

    this.debitWalletInMemory(nextWallet, nextLedger, {
      requestId: reqId,
      cost: actualCost,
      sourceType: 'burrow-garden-store',
      reasonCode: `buy_${entry.id}`,
      refusalReason: 'insufficient-balance',
    });

    nextDaily.storeBoughtByItem[entry.id] = boughtToday + qty;
    nextState.updatedAt = this.now();
    const receipt = {
      itemId: entry.id,
      quantity: qty,
      total: actualCost,
      balance: nextWallet.spendable,
      requestId: reqId,
    };
    nextDaily.ops[reqId] = { hash, receipt, committedAt: nextState.updatedAt };

    await this.writeJson(`burrow_states:${identity.uid}`, nextState);
    await this.writeJson(`burrow_daily:${identity.uid}:${nextDaily.dayKey}`, nextDaily, 86_400 * 14);
    await this.persistWalletAndLedger(identity.uid, nextWallet, nextLedger, prevLedgerLen);

    return this.buildSnapshotResponse({
      identity,
      state: nextState,
      wallet: nextWallet,
      daily: nextDaily,
      salesConfig,
      knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
      receipt,
    });
  }

  /**
   * Quầy Chợ Nông Sản Hogsmeade (`sellBurrowGoods`)
   */
  private async sellGoods(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(identity.uid, identity.house);
    const wallet = await this.getOrCreateWallet(identity.uid);
    const daily = await this.getOrCreateDaily(identity.uid);
    const salesConfig = await this.getOrCreateSalesConfig();

    if (salesConfig.marketOff) {
      throw new BurrowServerError(
        'market-closed',
        'Quầy chợ Hogsmeade đang tạm nghỉ kiểm kê từ Bộ Pháp Thuật.',
        {},
        503
      );
    }

    const { requestId, catalogHash: clientCatalogHash, ...payloadWithoutReqId } = data;
    const { reqId, hash, cachedReceipt } = this.validateAndCheckIdempotency(
      requestId,
      payloadWithoutReqId,
      daily
    );
    if (cachedReceipt) {
      return this.buildSnapshotResponse({
        identity,
        state,
        wallet,
        daily,
        salesConfig,
        knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
        receipt: cachedReceipt,
      });
    }

    const nextState = structuredClone(state);
    const nextDaily = structuredClone(daily);
    const nextWallet = structuredClone(wallet);
    const nextLedger = await this.getLedger(identity.uid);
    const prevLedgerLen = nextLedger.length;

    const isClearance = data.clearance === true;
    const itemsMap: Record<string, number> = isClearance
      ? Object.fromEntries(
          Object.entries(nextState.inventory).filter(
            ([id, count]) => count > 0 && MARKET_SELL_PRICES[id] !== undefined
          )
        )
      : ((data.items && typeof data.items === 'object' ? data.items : {}) as Record<
          string,
          number
        >);

    if (isClearance && nextState.clearanceUsed) {
      throw new BurrowServerError('already-claimed', 'Quyền xả kho một lần đã được sử dụng.');
    }

    const entries = Object.entries(itemsMap).filter(([, n]) => Number(n) > 0);
    if (entries.length === 0) {
      throw new BurrowServerError('invalid-action-input', 'Chưa chọn nông sản nào để bán.');
    }

    let totalGalleons = 0;
    const missing: Array<{ resource: string; required: number; have: number }> = [];
    for (const [itemId, rawQty] of entries) {
      const qty = Math.floor(Number(rawQty));
      const unitPrice = MARKET_SELL_PRICES[itemId];
      if (!unitPrice || qty <= 0) {
        throw new BurrowServerError('unknown-item', `Nông sản không thể bán: ${itemId}`);
      }
      const have = nextState.inventory[itemId] || 0;
      if (have < qty) {
        missing.push({ resource: itemId, required: qty, have });
        continue;
      }
      if (!isClearance) {
        const soldItemToday = nextDaily.marketSoldByItem[itemId] || 0;
        if (soldItemToday + qty > salesConfig.perItemDailyCap) {
          throw new BurrowServerError(
            'daily-cap',
            `Hôm nay quầy chợ chỉ thu mua tối đa ${salesConfig.perItemDailyCap} ${itemId}.`
          );
        }
      }
      totalGalleons += unitPrice * qty;
    }

    if (missing.length > 0) {
      throw new BurrowServerError('missing-crops', 'Kho Đỏ không đủ số lượng nông sản để bán.', {
        missing,
      });
    }

    const dailyGalleonCap =
      nextState.level >= 25
        ? salesConfig.masteryDailyCapGalleons
        : salesConfig.dailyCapGalleons;
    if (!isClearance && nextDaily.marketEarnedGalleons + totalGalleons > dailyGalleonCap) {
      throw new BurrowServerError(
        'daily-cap',
        `Đã chạm trần thu mua ${dailyGalleonCap} G/ngày của Quầy Chợ Hogsmeade.`,
        {
          earnedToday: nextDaily.marketEarnedGalleons,
          dailyCap: dailyGalleonCap,
        }
      );
    }

    if (typeof data.expectedTotal === 'number' && data.expectedTotal !== totalGalleons) {
      throw new BurrowServerError('price-changed', 'Giá thu mua nông sản vừa thay đổi.', {
        expectedTotal: data.expectedTotal,
        actualTotal: totalGalleons,
      });
    }

    for (const [itemId, rawQty] of entries) {
      const qty = Math.floor(Number(rawQty));
      nextState.inventory[itemId] -= qty;
      if (!isClearance) {
        nextDaily.marketSoldByItem[itemId] = (nextDaily.marketSoldByItem[itemId] || 0) + qty;
      }
    }
    if (isClearance) {
      nextState.clearanceUsed = true;
    } else {
      nextDaily.marketEarnedGalleons += totalGalleons;
    }

    this.creditWalletInMemory(nextWallet, nextLedger, {
      requestId: reqId,
      amount: totalGalleons,
      sourceType: 'burrow-garden-market',
      reasonCode: isClearance ? 'garden_clearance' : 'garden_sale',
    });

    nextState.revision += 1;
    nextState.updatedAt = this.now();
    const receipt = {
      clearance: isClearance,
      total: totalGalleons,
      balance: nextWallet.spendable,
      requestId: reqId,
    };
    nextDaily.ops[reqId] = { hash, receipt, committedAt: nextState.updatedAt };

    await this.writeJson(`burrow_states:${identity.uid}`, nextState);
    await this.writeJson(`burrow_daily:${identity.uid}:${nextDaily.dayKey}`, nextDaily, 86_400 * 14);
    await this.persistWalletAndLedger(identity.uid, nextWallet, nextLedger, prevLedgerLen);

    return this.buildSnapshotResponse({
      identity,
      state: nextState,
      wallet: nextWallet,
      daily: nextDaily,
      salesConfig,
      knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
      receipt,
    });
  }

  /**
   * Quyết toán nguyên tử giao dịch Galleon trong gameplay Hang Sóc trực tiếp với Ví Gringotts HPVN (`settleBurrowWallet`):
   *  - Chi tiêu (`direction: 'debit'`): trừ két sắt `bankBalance` trước, phần còn lại trừ túi `balance`, chặn khi `frozen` hoặc thiếu tiền.
   *  - Thu nhập (`direction: 'credit'`): kiểm tra `!salesConfig.marketOff`, khóa trần đơn giao dịch (`<= 1.000 G`) và trần thu nhập ngày (`dailyCapGalleons` / `masteryDailyCapGalleons`).
   *  - Chống thanh toán đúp 100% qua `requestId` trong `daily.ops` và ghi dòng kiểm toán bất biến `galleons_ledger_rows/{txId}`.
   */
  private async settleWallet(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(identity.uid, identity.house);
    const daily = await this.getOrCreateDaily(identity.uid);
    const salesConfig = await this.getOrCreateSalesConfig();

    const { requestId, catalogHash: clientCatalogHash, ...payloadWithoutReqId } = data;
    const { reqId, hash, cachedReceipt } = this.validateAndCheckIdempotency(
      requestId,
      payloadWithoutReqId,
      daily
    );
    if (cachedReceipt) {
      const wallet = await this.getOrCreateWallet(identity.uid);
      return this.buildSnapshotResponse({
        identity,
        state,
        wallet,
        daily,
        salesConfig,
        knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
        receipt: cachedReceipt,
      });
    }

    const direction = data.direction === 'credit' ? 'credit' : data.direction === 'debit' ? 'debit' : null;
    if (!direction) {
      throw new BurrowServerError('invalid-action-input', 'Hướng giao dịch ví không hợp lệ.');
    }

    const rawAmount = Math.floor(Number(data.amount));
    if (!Number.isFinite(rawAmount) || rawAmount <= 0 || rawAmount > 50_000) {
      throw new BurrowServerError(
        'invalid-action-input',
        'Số lượng Galleons giao dịch phải là số nguyên dương hợp lệ (1–50.000 G).'
      );
    }

    const validSources = new Set<GringottsLedgerEntry['sourceType']>([
      'burrow-garden-store',
      'burrow-garden-build',
      'burrow-garden-market',
      'burrow-garden-order',
      'burrow-garden-visit',
      'burrow-garden-fire',
    ]);
    const rawSource = typeof data.sourceType === 'string' ? data.sourceType : '';
    const sourceType: GringottsLedgerEntry['sourceType'] = validSources.has(
      rawSource as GringottsLedgerEntry['sourceType']
    )
      ? (rawSource as GringottsLedgerEntry['sourceType'])
      : direction === 'debit'
        ? 'burrow-garden-store'
        : 'burrow-garden-market';

    const rawReason = typeof data.reasonCode === 'string' ? data.reasonCode.trim() : '';
    const reasonCode = (rawReason.replace(/[^a-zA-Z0-9_:-]/g, '').slice(0, 64) ||
      (direction === 'debit' ? 'burrow_spend' : 'burrow_earn'));

    const nextDaily = structuredClone(daily);
    const boundedClientLevel = Math.min(
      state.level + 2,
      Math.min(100, Math.max(1, Math.floor(Number(data.clientLevel) || 1)))
    );
    const maxLevelHint = Math.max(state.level, boundedClientLevel);

    if (direction === 'credit') {
      if (salesConfig.marketOff) {
        throw new BurrowServerError(
          'market-closed',
          'Quầy giao dịch Hogsmeade đang tạm nghỉ kiểm kê từ Bộ Pháp Thuật.',
          {},
          503
        );
      }
      const MAX_SINGLE_SETTLE_CREDIT = 1000;
      if (rawAmount > MAX_SINGLE_SETTLE_CREDIT) {
        throw new BurrowServerError(
          'daily-cap',
          `Mỗi giao dịch thu nhập nông trại tối đa ${MAX_SINGLE_SETTLE_CREDIT} Galleons.`,
          { maxSingleCredit: MAX_SINGLE_SETTLE_CREDIT, requested: rawAmount }
        );
      }
      const dailyGalleonCap =
        maxLevelHint >= 25
          ? salesConfig.masteryDailyCapGalleons
          : salesConfig.dailyCapGalleons;
      if (nextDaily.marketEarnedGalleons + rawAmount > dailyGalleonCap) {
        throw new BurrowServerError(
          'daily-cap',
          `Đã chạm trần thu nhập ${dailyGalleonCap} G/ngày từ Thung Lũng Hang Sóc.`,
          {
            earnedToday: nextDaily.marketEarnedGalleons,
            dailyCap: dailyGalleonCap,
          }
        );
      }
      nextDaily.marketEarnedGalleons += rawAmount;
    }

    const nextLedger = await this.getLedger(identity.uid);
    const prevLedgerLen = nextLedger.length;
    let committedEntry: GringottsLedgerEntry | null = null;

    let updatedWallet: GringottsWalletDoc;
    if (typeof this.store.mutateWallet === 'function') {
      updatedWallet = await this.store.mutateWallet(identity.uid, (liveCurrent) => {
        const base: GringottsWalletDoc = liveCurrent
          ? structuredClone(liveCurrent)
          : {
              uid: identity.uid,
              balance: this.initialGalleons,
              bankBalance: this.initialBankGalleons,
              spendable: this.initialGalleons + this.initialBankGalleons,
              frozen: false,
              updatedAt: this.now(),
            };
        const tempLedger: GringottsLedgerEntry[] = [];
        if (direction === 'debit') {
          this.debitWalletInMemory(base, tempLedger, {
            requestId: reqId,
            cost: rawAmount,
            sourceType,
            reasonCode,
            refusalReason: 'insufficient-balance',
          });
        } else {
          this.creditWalletInMemory(base, tempLedger, {
            requestId: reqId,
            amount: rawAmount,
            sourceType,
            reasonCode,
          });
        }
        committedEntry = tempLedger[0] ?? null;
        return base;
      });
      if (committedEntry) {
        nextLedger.push(committedEntry);
      }
      await this.writeJson(`burrow_ledger:${identity.uid}`, nextLedger.slice(-500));
      if (committedEntry && typeof this.store.appendLedgerEntries === 'function') {
        await this.store.appendLedgerEntries(identity.uid, [committedEntry]);
      }
    } else {
      const currentWallet = await this.getOrCreateWallet(identity.uid);
      updatedWallet = structuredClone(currentWallet);
      if (direction === 'debit') {
        this.debitWalletInMemory(updatedWallet, nextLedger, {
          requestId: reqId,
          cost: rawAmount,
          sourceType,
          reasonCode,
          refusalReason: 'insufficient-balance',
        });
      } else {
        this.creditWalletInMemory(updatedWallet, nextLedger, {
          requestId: reqId,
          amount: rawAmount,
          sourceType,
          reasonCode,
        });
      }
      await this.persistWalletAndLedger(identity.uid, updatedWallet, nextLedger, prevLedgerLen);
    }

    const nowMs = this.now();
    const receipt = {
      direction,
      amount: rawAmount,
      reasonCode,
      balance: updatedWallet.spendable,
      bankBalance: updatedWallet.bankBalance,
      pocketBalance: updatedWallet.balance,
      requestId: reqId,
    };
    nextDaily.ops[reqId] = { hash, receipt, committedAt: nowMs };
    await this.writeJson(
      `burrow_daily:${identity.uid}:${nextDaily.dayKey}`,
      nextDaily,
      86_400 * 14
    );

    return this.buildSnapshotResponse({
      identity,
      state,
      wallet: updatedWallet,
      daily: nextDaily,
      salesConfig,
      knownCatalogHash: typeof clientCatalogHash === 'string' ? clientCatalogHash : undefined,
      receipt,
    });
  }

  /**
   * Thăm Thung Lũng & Tương Trợ Bạn Bè (`visitBurrowGarden`)
   * Khóa cứng `5 lần hỗ trợ/ngày` theo lịch VN `UTC+7` & ghi nhận `burrow_helpers` sang vườn chủ nhà!
   */
  private async visitNeighbor(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    // Chế độ danh sách: chỉ tốn đúng 3 lượt đọc (visitorState + visitorDaily + burrow_visit_directory),
    // thay vì 1 + 48 × 3 = 145 lượt đọc Firestore rời rạc!
    if (!data.hostUid && !data.friendCode) {
      const visitorState = await this.getOrCreateState(
        identity.uid,
        identity.house,
        identity.houseExplicit || identity.house !== 'Gryffindor' ? 'hpvn' : 'default'
      );
      const visitorDaily = await this.getOrCreateDaily(identity.uid);
      const nowMs = this.now();
      const rawDirectory = (await this.readJson<VisitDirectorySummaryRow[]>('burrow_visit_directory')) ?? [];
      const directory = deduplicateVisitDirectoryRows(rawDirectory);
      const helpsLeft = Math.max(0, MAX_DAILY_FRIEND_HELPS - visitorDaily.helpsGivenCount);
      const visitorNick = normalizeDistinctServerNickname(visitorState.playerName);
      const visitorCode = (visitorState.friendCode || '').trim().toUpperCase();
      const hasVisitorCode = !isPlaceholderServerFriendCode(visitorCode);

      const candidates = directory
        .filter((row) => {
          if (row.uid === identity.uid) return false;
          const rCode = (row.friendCode || '').trim().toUpperCase();
          if (hasVisitorCode && !isPlaceholderServerFriendCode(rCode) && rCode === visitorCode) {
            return false;
          }
          const rNick = normalizeDistinctServerNickname(row.username);
          if (visitorNick !== null && rNick !== null && rNick === visitorNick) {
            return false;
          }
          return true;
        })
        .slice(0, 48);
      const enriched = candidates.map((row) => {
        const liveGrowing = Array.isArray(row.timerReadyAts)
          ? row.timerReadyAts.filter((readyAt) => readyAt > nowMs).length
          : row.growing;
        const activeFire = row.fire && row.fire.until > nowMs ? row.fire : null;
        const receivedToday =
          row.helpsReceivedDayKey === visitorDaily.dayKey
            ? Math.max(0, Math.floor(Number(row.helpsReceivedCount) || 0))
            : 0;
        const hostHelpsLeft = Math.max(0, MAX_DAILY_HOST_HELPS_RECEIVED - receivedToday);
        const helped = visitorDaily.helpedHostUids.includes(row.uid);
        return {
          uid: row.uid,
          friendCode: row.friendCode,
          username: row.username,
          parkName: row.parkName,
          house: row.house,
          avatarEmoji: row.avatarEmoji,
          ...(row.avatarUrl ? { avatarUrl: row.avatarUrl } : {}),
          level: row.level,
          growing: liveGrowing,
          scene: row.scene,
          updatedAt: row.updatedAt,
          helped,
          hostHelpsLeft,
          fire: activeFire,
        };
      });

      const visits = enriched.sort((a, b) => {
        const aHelpable = !a.helped && (Boolean(a.fire) || (a.growing > 0 && a.hostHelpsLeft > 0));
        const bHelpable = !b.helped && (Boolean(b.fire) || (b.growing > 0 && b.hostHelpsLeft > 0));
        return (
          Number(bHelpable) - Number(aHelpable) ||
          Number(Boolean(b.fire)) - Number(Boolean(a.fire)) ||
          b.growing - a.growing ||
          b.level - a.level
        );
      });

      return {
        helpsLeft,
        maxDailyHelps: MAX_DAILY_FRIEND_HELPS,
        dayKey: visitorDaily.dayKey,
        visitLevel: FLOO_VISIT_UNLOCK_LEVEL,
        visits,
      };
    }

    let resolvedHostUid = typeof data.hostUid === 'string' ? sanitizeBackendUid(data.hostUid) : '';
    if (!resolvedHostUid && typeof data.friendCode === 'string') {
      const code = sanitizeFriendCode(data.friendCode);
      const friendProfile = await this.readJson<{ userId: string }>(`burrow_friend:${code}`);
      if (friendProfile?.userId) resolvedHostUid = sanitizeBackendUid(friendProfile.userId);
    }

    if (!resolvedHostUid || resolvedHostUid === identity.uid) {
      throw new BurrowServerError(
        'visit-not-found',
        'Không tìm thấy thung lũng của người bạn này.',
        {},
        404
      );
    }

    const hostUid = resolvedHostUid;
    const executeVisitOrHelp = async (): Promise<Record<string, unknown>> => {
      const visitorState = await this.getOrCreateState(identity.uid, identity.house);
      await this.applyIdentityProfileToState(visitorState, identity);
      const visitorDaily = await this.getOrCreateDaily(identity.uid);
      const nowMs = this.now();

      const hostState = await this.readJson<BurrowAuthoritativeStateDoc>(`burrow_states:${hostUid}`);
      if (!hostState) {
        throw new BurrowServerError(
          'visit-not-found',
          'Thành viên này chưa khởi tạo thung lũng trên máy chủ.',
          { hostUid },
          404
        );
      }

      const hostHelpersBefore = await this.getHelpersForHost(hostUid, visitorDaily.dayKey);
      const hostFire = await this.readJson<{ mode: string; since: number; until: number }>(
        `burrow_fire:${hostUid}`
      );
      const activeFire = hostFire && hostFire.until > nowMs ? hostFire : null;
      let reward: Record<string, unknown> | undefined;
      const alreadyHelped = visitorDaily.helpedHostUids.includes(hostUid);

      if (data.help === true) {
        if (alreadyHelped) {
          throw new BurrowServerError(
            'already-helped',
            'Hôm nay bạn đã chăm giúp thung lũng này rồi (1 lần/bạn/ngày).'
          );
        }
        if (visitorDaily.helpsGivenCount >= MAX_DAILY_FRIEND_HELPS) {
          throw new BurrowServerError(
            'daily-help-cap',
            `Hôm nay bạn đã dùng hết ${MAX_DAILY_FRIEND_HELPS}/${MAX_DAILY_FRIEND_HELPS} lượt hỗ trợ bạn bè. Quay lại sau 00:00 (giờ VN) nhé!`,
            { maxDailyHelps: MAX_DAILY_FRIEND_HELPS, used: visitorDaily.helpsGivenCount }
          );
        }
        if (hostHelpersBefore.length >= MAX_DAILY_HOST_HELPS_RECEIVED) {
          throw new BurrowServerError(
            'host-help-cap',
            `Thung lũng này hôm nay đã nhận đủ ${MAX_DAILY_HOST_HELPS_RECEIVED} lượt chăm giúp từ cộng đồng.`,
            { maxHostHelps: MAX_DAILY_HOST_HELPS_RECEIVED }
          );
        }

        const growingTimers = hostState.timers.filter((t) => t.readyAt > nowMs);
        if (growingTimers.length === 0 && data.requireGrowing === true) {
          throw new BurrowServerError(
            'nothing-to-help',
            'Thung lũng này hiện không có mẻ sản xuất nào đang chờ.'
          );
        }

        // Tăng tốc 15 phút cho các mẻ đang lớn của chủ vườn
        for (const t of growingTimers) {
          t.startedAt -= FRIEND_HELP_SPEEDUP_MS;
          t.readyAt = Math.max(nowMs, t.readyAt - FRIEND_HELP_SPEEDUP_MS);
        }
        hostState.updatedAt = nowMs;
        await this.writeJson(`burrow_states:${hostUid}`, hostState);

        // Ghi dấu `helpers` để khi chủ vườn mở game sẽ nhận thông báo "🤝 <Bạn> đã sang chăm giúp!"
        const helpKind =
          data.kind === 'tend_yard' || data.kind === 'stoke_workshop' ? data.kind : 'water_crop';
        const inferredBuildingUid = growingTimers
          .find((t) => t.timerId.startsWith('sim:'))
          ?.timerId.split(':')
          .slice(2)
          .join(':');
        const updatedHelpers = await this.appendHelperForHost(hostUid, visitorDaily.dayKey, {
          id: `hlp_${fnv1aHashHex(`${identity.uid}:${hostUid}:${nowMs}`)}`,
          uid: identity.uid,
          name: visitorState.playerName,
          avatarEmoji: visitorState.avatarEmoji,
          ...(visitorState.avatarUrl ? { avatarUrl: visitorState.avatarUrl } : {}),
          kind: helpKind,
          buildingUid:
            typeof data.buildingUid === 'string' && data.buildingUid
              ? data.buildingUid
              : inferredBuildingUid || undefined,
          noteText: String(
            data.noteText || 'Gửi chút nắng ấm Hang Sóc sang tiếp sức thung lũng bạn!'
          ).slice(0, 120),
          at: nowMs,
        });

        await this.registerVisitDirectoryEntry(hostState, {
          helpsReceivedDayKey: visitorDaily.dayKey,
          helpsReceivedCount: updatedHelpers.length,
          fire: activeFire,
        });

        // Cập nhật bộ đếm 5/ngày của khách thăm + cộng thưởng
        visitorDaily.helpsGivenCount += 1;
        visitorDaily.helpedHostUids.push(hostUid);
        for (const bq of visitorDaily.bonusQuests) {
          if (!bq.claimed && bq.triggers.includes('help')) {
            bq.progress = Math.min(bq.target, bq.progress + 1);
          }
        }
        visitorState.supplies.water += 6;
        visitorState.friendshipTokens += 1;
        visitorState.xp += 14;
        visitorState.updatedAt = nowMs;

        const visitorWallet = await this.getOrCreateWallet(identity.uid);
        const visitorLedger = await this.getLedger(identity.uid);
        const prevLedgerLen = visitorLedger.length;
        this.creditWalletInMemory(visitorWallet, visitorLedger, {
          requestId: `visit_${identity.uid}_${hostUid}_${visitorDaily.dayKey}`,
          amount: 5,
          sourceType: 'burrow-garden-visit',
          reasonCode: 'neighbor_help_reward',
        });

        await this.writeJson(`burrow_states:${identity.uid}`, visitorState);
        await this.writeJson(
          `burrow_daily:${identity.uid}:${visitorDaily.dayKey}`,
          visitorDaily,
          86_400 * 14
        );
        await this.persistWalletAndLedger(
          identity.uid,
          visitorWallet,
          visitorLedger,
          prevLedgerLen
        );

        reward = {
          galleons: 5,
          water: 6,
          friendshipTokens: 1,
          xp: 14,
          label: '+5 G · +6 Nước · +1 Huy Hiệu Tình Bạn',
        };
      }

      const publicLayout =
        (await this.readJson<Record<string, unknown>>(`burrow_public_layout:${hostUid}`)) ??
        (hostState.rawClientSave
          ? extractSanitizedPublicValleySave(hostState.rawClientSave)
          : undefined);
      const totalHostHelpersNow = hostHelpersBefore.length + (reward ? 1 : 0);

      return {
        ...(reward ? { ok: true, reward } : {}),
        helpsLeft: Math.max(0, MAX_DAILY_FRIEND_HELPS - visitorDaily.helpsGivenCount),
        maxDailyHelps: MAX_DAILY_FRIEND_HELPS,
        dayKey: visitorDaily.dayKey,
        visit: {
          uid: hostState.uid,
          username: hostState.playerName,
          parkName: hostState.parkName,
          friendCode: hostState.friendCode,
          house: hostState.house,
          avatarEmoji: hostState.avatarEmoji,
          ...(hostState.avatarUrl ? { avatarUrl: hostState.avatarUrl } : {}),
          level: hostState.level,
          hostHelpsLeft: Math.max(0, MAX_DAILY_HOST_HELPS_RECEIVED - totalHostHelpersNow),
          progression: {
            level: hostState.level,
            timers: hostState.timers,
            builtIds: hostState.builtIds,
          },
          decorations: hostState.decorations,
          ...(publicLayout ? { rawClientSave: publicLayout } : {}),
          helped: visitorDaily.helpedHostUids.includes(hostUid),
          fire: activeFire,
        },
      };
    };

    if (data.help === true) {
      return this.withScopeLocks(
        [`user:${identity.uid}`, `user:${hostUid}`, `helpers:${hostUid}`, 'visit_dir'],
        executeVisitOrHelp
      );
    }
    return executeVisitOrHelp();
  }

  /**
   * Dập lửa sự cố thung lũng (`extinguishBurrowGarden`)
   */
  private async extinguishFire(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const targetUid =
      typeof data.hostUid === 'string' && data.hostUid
        ? sanitizeBackendUid(data.hostUid)
        : identity.uid;
    const nowMs = this.now();
    const fire = await this.readJson<{ mode: string; since: number; until: number }>(
      `burrow_fire:${targetUid}`
    );
    if (!fire || fire.until <= nowMs) {
      throw new BurrowServerError('no-fire', 'Thung lũng này hiện không có đám cháy nào.');
    }

    const price = Math.min(500, Math.max(1, Math.ceil((fire.until - nowMs) / 3_600_000)) * 10);
    if (typeof data.expectedPrice === 'number' && price > data.expectedPrice) {
      throw new BurrowServerError('price-changed', `Chi phí dập lửa hiện tại là ${price} G.`, {
        expectedPrice: data.expectedPrice,
        actualPrice: price,
      });
    }

    const wallet = await this.getOrCreateWallet(identity.uid);
    const ledger = await this.getLedger(identity.uid);
    const prevLedgerLen = ledger.length;
    const reqId =
      typeof data.requestId === 'string' && data.requestId
        ? data.requestId
        : `fire_${targetUid}_${nowMs}`;
    this.debitWalletInMemory(wallet, ledger, {
      requestId: reqId,
      cost: price,
      sourceType: 'burrow-garden-fire',
      reasonCode: 'extinguish_valley_fire',
      refusalReason: 'insufficient-balance',
    });

    await this.store.delete(`burrow_fire:${targetUid}`);
    await this.updateVisitDirectoryFireStatus(targetUid, null);
    await this.persistWalletAndLedger(identity.uid, wallet, ledger, prevLedgerLen);

    return {
      ok: true,
      price,
      hostUid: targetUid,
      balance: wallet.spendable,
    };
  }

  /**
   * Đổi Khung Ảnh Hồ Sơ Mạng Floo (`setBurrowFlooFrame`)
   */
  private async setFlooFrame(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(identity.uid, identity.house);
    const frameKey = String(data.frameKey || 'starter_wood');
    if (state.level >= 20 && !state.flooFrames.unlocked.includes('house_champion')) {
      state.flooFrames.unlocked.push('house_champion');
    }
    if (
      Object.values(state.minigameRecords).some((r) => r.bestStage >= 777) &&
      !state.flooFrames.unlocked.includes('tower_777')
    ) {
      state.flooFrames.unlocked.push('tower_777');
    }
    if (!state.flooFrames.unlocked.includes(frameKey)) {
      throw new BurrowServerError('frame-locked', 'Khung Floo này chưa được mở khóa.');
    }
    state.flooFrames.worn = frameKey;
    state.updatedAt = this.now();
    await this.writeJson(`burrow_states:${identity.uid}`, state);
    return {
      ok: true,
      frames: state.flooFrames.unlocked,
      worn: state.flooFrames.worn,
    };
  }

  /**
   * Bảng Quản Trị Kinh Tế & Flash Sale (`manageBurrowSales`)
   */
  private async manageSales(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const config = await this.getOrCreateSalesConfig();
    const mode = String(data.mode || 'get');

    if (mode === 'get') {
      return {
        config,
        store: BURROW_STORE_CATALOG,
        market: {
          prices: MARKET_SELL_PRICES,
          marketOff: config.marketOff,
        },
      };
    }

    if (identity.role !== 'saleAdmin') {
      throw new BurrowServerError(
        'forbidden-admin',
        'Chỉ Quản Trị Viên Hội Phượng Hoàng (HPH) mới có quyền thay đổi kinh tế.',
        {},
        403
      );
    }

    if (typeof data.expectedRevision === 'number' && data.expectedRevision !== config.revision) {
      throw new BurrowServerError(
        'revision-conflict',
        'Cấu hình cửa hàng vừa được quản trị viên khác thay đổi.',
        { expectedRevision: data.expectedRevision, actualRevision: config.revision },
        409
      );
    }

    if (mode === 'update') {
      if (typeof data.marketOff === 'boolean') {
        config.marketOff = data.marketOff;
      }
      if (typeof data.discountPercent === 'number') {
        config.discountPercent = Math.max(0, Math.min(40, Math.floor(data.discountPercent)));
      }
      if (data.priceOverrides && typeof data.priceOverrides === 'object') {
        for (const [k, v] of Object.entries(data.priceOverrides as Record<string, unknown>)) {
          if (typeof v === 'number' && v > 0) config.priceOverrides[k] = Math.floor(v);
        }
      }
      config.revision += 1;
      config.updatedAt = this.now();
      await this.writeJson('burrow_sales_config', config);
      return { ok: true, config };
    }

    if (mode === 'triggerFire' && typeof data.targetUid === 'string') {
      const targetUid = sanitizeBackendUid(data.targetUid);
      const fireMode = data.fireMode === 'real' ? 'real' : 'visual';
      const nowMs = this.now();
      const fireDoc = {
        mode: fireMode,
        since: nowMs,
        until: nowMs + 2 * 3_600_000,
      };
      await this.writeJson(`burrow_fire:${targetUid}`, fireDoc, 86_400);
      await this.updateVisitDirectoryFireStatus(targetUid, fireDoc);
      return { ok: true, targetUid, fire: fireDoc };
    }

    throw new BurrowServerError('invalid-action-input', `Chế độ quản trị không hợp lệ: ${mode}`);
  }

  /**
   * Đồng bộ & khóa chuẩn `GameState` từ `/api/save` vào trạng thái ủy quyền trên máy chủ,
   * đảm bảo lịch ngày VN `UTC+7`, chặn Sandbox/Preview cheat, khóa sở hữu `friendCode`,
   * và chỉ trích xuất layout công khai gọn nhẹ thay vì nhồi `rawClientSave` đầy vào `burrow_states`!
   */
  public reconcileClientSaveIntoState(
    saveBody: Record<string, unknown>,
    state: BurrowAuthoritativeStateDoc,
    daily: BurrowDailyDoc
  ): Record<string, unknown> {
    if (
      saveBody.sandboxMode === true ||
      saveBody.sandboxTainted === true ||
      saveBody.isHeadmasterPreview === true
    ) {
      throw new BurrowServerError(
        'sandbox-forbidden',
        'Chế độ Sandbox / Xem trước không được phép lưu hoặc đồng bộ lên máy chủ HPVN.',
        {},
        403
      );
    }

    if (typeof saveBody.parkName === 'string' && saveBody.parkName.trim()) {
      state.parkName = saveBody.parkName.trim().slice(0, 42);
    }
    if (typeof saveBody.name === 'string' && saveBody.name.trim()) {
      state.playerName = saveBody.name.trim().slice(0, 42);
    }
    if (typeof saveBody.level === 'number' && Number.isFinite(saveBody.level)) {
      state.level = Math.max(1, Math.min(100, Math.floor(saveBody.level)));
    }
    if (typeof saveBody.xp === 'number' && Number.isFinite(saveBody.xp) && saveBody.xp >= 0) {
      state.xp = Math.floor(saveBody.xp);
    }

    const m3Obj =
      saveBody.match3 && typeof saveBody.match3 === 'object'
        ? (saveBody.match3 as Record<string, unknown>)
        : null;
    const rawMagicStars =
      typeof m3Obj?.stars === 'number' && Number.isFinite(m3Obj.stars)
        ? m3Obj.stars
        : typeof saveBody.magicStars === 'number' && Number.isFinite(saveBody.magicStars)
          ? saveBody.magicStars
          : null;
    if (rawMagicStars !== null) {
      state.magicStars = Math.max(0, Math.min(99_999, Math.floor(rawMagicStars)));
    }

    // Đồng bộ các mẻ cây trồng, thú chăn thả, xưởng & công trình đang chạy từ ParkSimulation
    // sang `state.timers` để danh bạ Cổng Bay Floo hiển thị đúng `growing > 0` và cho phép bạn thật chăm giúp!
    if (Array.isArray(saveBody.buildings)) {
      const nowMs = this.now();
      const nonSimTimers = (state.timers ?? []).filter(
        (t) => !t.timerId.startsWith('sim:') && t.readyAt > nowMs
      );
      const syncedSimTimers: AuthoritativeTimerEntry[] = [];
      for (const rawB of saveBody.buildings) {
        if (syncedSimTimers.length + nonSimTimers.length >= 48) break;
        if (!rawB || typeof rawB !== 'object') continue;
        const b = rawB as Record<string, unknown>;
        const uid = typeof b.uid === 'string' && b.uid.trim() ? b.uid.trim().slice(0, 48) : '';
        if (!uid) continue;
        const itemId = typeof b.itemId === 'string' ? b.itemId.slice(0, 48) : 'plot';

        const cropReadyAt = Number(b.cropReadyAt || 0);
        if (Number.isFinite(cropReadyAt) && cropReadyAt > nowMs) {
          syncedSimTimers.push({
            timerId: `sim:crop:${uid}`,
            domain: 'crop',
            targetId: typeof b.cropId === 'string' ? b.cropId.slice(0, 48) : itemId,
            qty: 1,
            startedAt: Math.min(nowMs, Math.max(0, Math.floor(Number(b.cropPlantedAt) || nowMs))),
            readyAt: Math.floor(cropReadyAt),
            boosted: b.cropWatered === true || b.cropWateredBoost === true,
            cared: b.cropWatered === true || b.cropWateredBoost === true,
          });
          continue;
        }

        const pastureReadyAt = Number(b.pastureReadyAt || 0);
        if (Number.isFinite(pastureReadyAt) && pastureReadyAt > nowMs) {
          syncedSimTimers.push({
            timerId: `sim:pasture:${uid}`,
            domain: 'pasture',
            targetId:
              typeof b.pastureAnimalId === 'string' ? b.pastureAnimalId.slice(0, 48) : itemId,
            qty: 1,
            startedAt: Math.min(nowMs, Math.max(0, Math.floor(Number(b.pastureFedAt) || nowMs))),
            readyAt: Math.floor(pastureReadyAt),
            boosted: false,
            cared: false,
          });
          continue;
        }

        const queue = Array.isArray(b.workshopQueue)
          ? (b.workshopQueue as Array<Record<string, unknown>>)
          : [];
        const headReadyAt = Number(queue[0]?.endsAt || 0);
        if (Number.isFinite(headReadyAt) && headReadyAt > nowMs) {
          syncedSimTimers.push({
            timerId: `sim:workshop:${uid}`,
            domain: 'workshop',
            targetId:
              typeof queue[0]?.goodId === 'string'
                ? String(queue[0].goodId).slice(0, 48)
                : itemId,
            qty: 1,
            startedAt: Math.min(nowMs, Math.max(0, Math.floor(Number(queue[0]?.startedAt) || nowMs))),
            readyAt: Math.floor(headReadyAt),
            boosted: false,
            cared: false,
          });
          continue;
        }

        const constructEndsAt = Number(b.constructEndsAt || 0);
        if (Number.isFinite(constructEndsAt) && constructEndsAt > nowMs) {
          syncedSimTimers.push({
            timerId: `sim:construction:${uid}`,
            domain: 'construction',
            targetId: itemId,
            qty: 1,
            startedAt: Math.min(nowMs, Math.max(0, Math.floor(Number(b.placedAt) || nowMs))),
            readyAt: Math.floor(constructEndsAt),
            boosted: false,
            cared: false,
          });
        }
      }
      state.timers = [...nonSimTimers, ...syncedSimTimers].slice(0, 48);
    }

    const soc =
      saveBody.neighborSocial && typeof saveBody.neighborSocial === 'object'
        ? (saveBody.neighborSocial as Record<string, unknown>)
        : null;
    if (soc) {
      // Bảo vệ quyền sở hữu Mã Thung Lũng: chỉ nhận mã từ client nếu tài khoản chưa có mã trên server,
      // ngược lại luôn giữ mã chính chủ trên máy chủ để chống chiếm đoạt mã của quản trị viên / top player!
      if (!state.friendCode || state.friendCode.length < 4) {
        const code = sanitizeFriendCode(soc.playerFriendCode);
        if (code.length >= 4) state.friendCode = code;
      } else {
        soc.playerFriendCode = state.friendCode;
      }
      if (typeof soc.playerDisplayName === 'string' && soc.playerDisplayName.trim()) {
        state.playerName = soc.playerDisplayName.trim().slice(0, 42);
      }
      if (typeof soc.playerAvatarUrl === 'string' && soc.playerAvatarUrl.trim()) {
        state.avatarUrl = soc.playerAvatarUrl.trim().slice(0, 260);
      }

      // Ép khóa ngày xã hội theo đồng hồ máy chủ Việt Nam `UTC+7` & giữ mức cao nhất để chống reset lậu
      const clientHelps = Math.max(0, Math.floor(Number(soc.dailyGardenHelpsCount) || 0));
      daily.helpsGivenCount = Math.min(
        MAX_DAILY_FRIEND_HELPS,
        Math.max(daily.helpsGivenCount, clientHelps)
      );
      soc.lastSocialResetKey = daily.dayKey;
      soc.dailyGardenHelpsCount = daily.helpsGivenCount;

      const clientOwlReq = Math.max(0, Math.floor(Number(soc.dailyOwlHelpRequestedCount) || 0));
      daily.owlHelpsRequestedCount = Math.min(
        MAX_DAILY_FRIEND_HELPS,
        Math.max(daily.owlHelpsRequestedCount, clientOwlReq)
      );
      soc.dailyOwlHelpRequestedCount = daily.owlHelpsRequestedCount;
    }

    saveBody.lastDailyResetKey = daily.dayKey;
    saveBody.serverRevision = state.revision;
    saveBody.serverDayKey = daily.dayKey;

    const lbObj =
      saveBody.minigameLeaderboard && typeof saveBody.minigameLeaderboard === 'object'
        ? (saveBody.minigameLeaderboard as Record<string, unknown>)
        : null;
    if (lbObj) {
      const saveHouse = normalizeHogwartsHouse(lbObj.playerHouse);
      if (state.houseSource === 'hpvn') {
        lbObj.playerHouse = state.house;
        lbObj.playerHouseLockedByServer = true;
      } else if (saveHouse && lbObj.playerHouseExplicit === true) {
        state.house = saveHouse;
        state.houseSource = 'player';
      } else if (
        saveHouse &&
        saveHouse !== 'Gryffindor' &&
        (!state.houseSource || state.houseSource === 'default')
      ) {
        state.house = saveHouse;
      }
    }

    state.rawClientSave = extractSanitizedPublicValleySave(saveBody);
    return saveBody;
  }

  /**
   * Trích xuất kỷ lục 3 bộ môn tính điểm (`match3`, `sudoku`, `blocks`) từ bản lưu client
   * để tự động điền lên Bảng Xếp Hạng máy chủ ngay cả khi người chơi lưu qua `/api/save` hoặc `syncProfile`.
   */
  public extractScoredLeaderboardEntriesFromSave(
    saveBody: Record<string, unknown>,
    state: BurrowAuthoritativeStateDoc
  ): Array<{ gameId: string; entry: Record<string, unknown> }> {
    const out: Array<{ gameId: string; entry: Record<string, unknown> }> = [];
    const lbObj =
      saveBody.minigameLeaderboard && typeof saveBody.minigameLeaderboard === 'object'
        ? (saveBody.minigameLeaderboard as Record<string, unknown>)
        : null;
    const recordsObj =
      lbObj?.records && typeof lbObj.records === 'object'
        ? (lbObj.records as Record<string, unknown>)
        : null;
    const m3Obj =
      saveBody.match3 && typeof saveBody.match3 === 'object'
        ? (saveBody.match3 as Record<string, unknown>)
        : null;
    const paObj =
      saveBody.puzzleArcade && typeof saveBody.puzzleArcade === 'object'
        ? (saveBody.puzzleArcade as Record<string, unknown>)
        : null;
    const sharedStreak = Math.max(0, Math.floor(Number(m3Obj?.winStreak) || 0));

    for (const gameId of ['match3', 'sudoku', 'blocks', 'jigsaw'] as const) {
      const rec =
        recordsObj?.[gameId] && typeof recordsObj[gameId] === 'object'
          ? (recordsObj[gameId] as Record<string, unknown>)
          : null;
      let fallbackCleared = 0;
      let fallbackWins = 0;
      let fallbackRating = 0;
      if (gameId === 'match3') {
        fallbackCleared = Math.max(
          0,
          Math.min(
            777,
            Math.floor(
              Number(
                m3Obj?.maxClearedLevel ?? Math.max(0, (Number(m3Obj?.currentLevel) || 1) - 1)
              ) || 0
            )
          )
        );
        fallbackWins = Math.max(fallbackCleared, Math.floor(Number(m3Obj?.levelsWon) || 0));
        fallbackRating = fallbackCleared * 150 + fallbackWins * 25 + sharedStreak * 40;
      } else if (gameId === 'sudoku') {
        fallbackCleared = Math.max(
          0,
          Math.min(
            777,
            Math.floor(
              Number(
                paObj?.sudokuCleared ?? Math.max(0, (Number(paObj?.sudokuStage) || 1) - 1)
              ) || 0
            )
          )
        );
        fallbackWins = fallbackCleared;
        fallbackRating = fallbackCleared * 155 + fallbackCleared * 22 + sharedStreak * 35;
      } else if (gameId === 'jigsaw') {
        fallbackCleared = Math.max(
          0,
          Math.min(
            777,
            Math.floor(
              Number(
                paObj?.jigsawCleared ?? Math.max(0, (Number(paObj?.jigsawStage) || 1) - 1)
              ) || 0
            )
          )
        );
        fallbackWins = fallbackCleared;
        fallbackRating = fallbackCleared * 155 + fallbackCleared * 22 + sharedStreak * 35;
      } else {
        fallbackCleared = Math.max(
          0,
          Math.min(
            777,
            Math.floor(
              Number(paObj?.blockCleared ?? Math.max(0, (Number(paObj?.blockStage) || 1) - 1)) || 0
            )
          )
        );
        fallbackWins = fallbackCleared;
        fallbackRating = fallbackCleared * 155 + fallbackCleared * 22 + sharedStreak * 35;
      }

      const bestStage = Math.max(
        fallbackCleared,
        Math.min(777, Math.floor(Number(rec?.bestStage) || 0))
      );
      const ratingScore = Math.max(
        fallbackRating,
        Math.floor(Number(rec?.highScore ?? rec?.ratingScore) || 0)
      );
      const totalWins = Math.max(fallbackWins, Math.floor(Number(rec?.totalWins) || 0));
      const bestStreak = Math.max(sharedStreak, Math.floor(Number(rec?.bestStreak) || 0));

      if (bestStage <= 0 && totalWins <= 0) continue;

      out.push({
        gameId,
        entry: {
          name: state.playerName,
          parkName: state.parkName,
          friendCode: state.friendCode,
          avatarEmoji: state.avatarEmoji,
          house: state.house,
          primaryValue: bestStage,
          ratingScore,
          totalWins,
          bestStreak,
        },
      });
    }
    return out;
  }

  public async syncSaveLeaderboardsForState(
    saveBody: Record<string, unknown>,
    state: BurrowAuthoritativeStateDoc,
    daily: BurrowDailyDoc
  ): Promise<void> {
    const items = this.extractScoredLeaderboardEntriesFromSave(saveBody, state);
    if (items.length === 0) return;
    await this.withScopeLocks(['lb:match3', 'lb:sudoku', 'lb:blocks'], async () => {
      for (const item of items) {
        await this.upsertLeaderboardEntryUnlocked({
          uid: state.uid,
          gameId: item.gameId,
          entry: item.entry,
          state,
          daily,
          awardImprovementCup: false,
        });
      }
    });
  }

  /**
   * Đọc danh sách Bảng Xếp Hạng của một bộ môn trực tuyến (`match3`, `sudoku`, `blocks`),
   * tự động kết hợp các kỷ lục điểm đã nộp với danh bạ người chơi thật trong Thung Lũng (`burrow_visit_directory`)
   * và đối chiếu hồ sơ Nhà Hogwarts thực tế từ HPVN để người chơi luôn thấy đầy đủ cộng đồng!
   */
  public async getLeaderboardEntries(
    gameId: string
  ): Promise<Array<Record<string, unknown>>> {
    if (!SCORED_SERVER_LEADERBOARD_GAMES.has(gameId)) {
      return [];
    }

    const kvKey = `burrow_lb:${gameId}`;
    const [existingRaw, directory] = await Promise.all([
      this.readJson<Array<Record<string, unknown>>>(kvKey),
      this.getHealedVisitDirectory(),
    ]);
    const existing = Array.isArray(existingRaw) ? existingRaw : [];
    const dirByUid = new Map<string, VisitDirectorySummaryRow>();
    for (const row of directory) {
      if (row && typeof row.uid === 'string' && row.uid) {
        dirByUid.set(row.uid, row);
      }
    }

    const byUser = new Map<string, Record<string, unknown>>();
    for (const item of existing) {
      if (!item || typeof item.userId !== 'string' || !item.userId) continue;
      const dirRow = dirByUid.get(item.userId);
      const resolvedHouse =
        (dirRow?.houseVerified ? normalizeHogwartsHouse(dirRow.house) : null) ??
        normalizeHogwartsHouse(item.house) ??
        normalizeHogwartsHouse(dirRow?.house) ??
        'Gryffindor';
      const rawItemName = typeof item.name === 'string' ? item.name.trim() : '';
      const resolvedName =
        dirRow?.username &&
        dirRow.username !== 'Phù Thủy Hang Sóc' &&
        (!rawItemName || rawItemName === 'Trang Trại Hang Sóc' || rawItemName === 'Phù Thủy Hang Sóc')
          ? dirRow.username
          : rawItemName || dirRow?.username || dirRow?.parkName || 'Phù Thủy Hang Sóc';
      const resolvedFriendCode =
        dirRow?.friendCode || sanitizeFriendCode(item.friendCode) || 'HS-CLUD-01';

      byUser.set(item.userId, {
        ...item,
        userId: item.userId,
        name: String(resolvedName).slice(0, 42),
        parkName: String(item.parkName || dirRow?.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
        friendCode: resolvedFriendCode,
        avatarEmoji: String(item.avatarEmoji || dirRow?.avatarEmoji || '🧙‍♂️').slice(0, 8),
        house: resolvedHouse,
        primaryValue: Math.max(0, Math.floor(Number(item.primaryValue) || 0)),
        ratingScore: Math.max(0, Math.floor(Number(item.ratingScore) || 0)),
        totalWins: Math.max(0, Math.floor(Number(item.totalWins) || 0)),
        bestStreak: Math.max(0, Math.floor(Number(item.bestStreak) || 0)),
        detailLabelVi: String(item.detailLabelVi || '').slice(0, 64),
        updatedAt: Math.floor(Number(item.updatedAt) || 0),
      });
    }

    // Bổ sung thành viên thật trong thung lũng chưa có bản ghi ở bộ môn này để mọi người chơi đều thấy nhau trong BXH Toàn Thung Lũng & Cúp 4 Nhà
    for (const row of directory) {
      if (!row || !row.uid || byUser.has(row.uid)) continue;
      const resolvedHouse = normalizeHogwartsHouse(row.house) ?? 'Gryffindor';
      const displayName =
        row.username && row.username !== 'Phù Thủy Hang Sóc'
          ? row.username
          : row.parkName || row.username || 'Phù Thủy Hang Sóc';
      byUser.set(row.uid, {
        userId: row.uid,
        name: String(displayName).slice(0, 42),
        parkName: String(row.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
        friendCode: row.friendCode || 'HS-CLUD-01',
        avatarEmoji: String(row.avatarEmoji || '🧙‍♂️').slice(0, 8),
        house: resolvedHouse,
        primaryValue: 0,
        ratingScore: 0,
        totalWins: 0,
        bestStreak: 0,
        detailLabelVi: 'Chưa có kỷ lục môn này',
        updatedAt: Math.floor(Number(row.updatedAt) || 0),
      });
    }

    return deduplicateServerLeaderboardItems(Array.from(byUser.values()), dirByUid)
      .sort(
        (a, b) =>
          Number(b.primaryValue || 0) - Number(a.primaryValue || 0) ||
          Number(b.ratingScore || 0) - Number(a.ratingScore || 0) ||
          Number(b.totalWins || 0) - Number(a.totalWins || 0) ||
          Number(b.updatedAt || 0) - Number(a.updatedAt || 0)
      )
      .slice(0, 50);
  }

  private async upsertLeaderboardEntryUnlocked(params: {
    uid: string;
    gameId: string;
    entry: Record<string, unknown>;
    state?: BurrowAuthoritativeStateDoc | null;
    daily?: BurrowDailyDoc | null;
    awardImprovementCup?: boolean;
  }): Promise<{ improved: boolean; cupPointsAdded: number }> {
    const { uid, gameId, state } = params;
    if (!SCORED_SERVER_LEADERBOARD_GAMES.has(gameId)) {
      return { improved: false, cupPointsAdded: 0 };
    }

    const maxPrimary = 777;
    const entryHouse = normalizeHogwartsHouse(params.entry.house);
    const house: HogwartsHouseName =
      state?.houseSource === 'hpvn'
        ? state.house
        : entryHouse && (entryHouse !== 'Gryffindor' || !state?.house)
          ? entryHouse
          : state?.house ?? entryHouse ?? 'Gryffindor';

    const rawEntryName = typeof params.entry.name === 'string' ? params.entry.name.trim() : '';
    const resolvedName =
      state?.playerName &&
      state.playerName !== 'Phù Thủy Hang Sóc' &&
      (!rawEntryName || rawEntryName === 'Trang Trại Hang Sóc' || rawEntryName === 'Phù Thủy Hang Sóc')
        ? state.playerName
        : rawEntryName || state?.playerName || state?.parkName || 'Trang Trại Hang Sóc';

    const resolvedParkName = String(
      params.entry.parkName || state?.parkName || 'Trang Trại Hang Sóc'
    ).slice(0, 42);

    const rawEntryCode = sanitizeFriendCode(params.entry.friendCode);
    const isPlaceholderCode =
      !rawEntryCode ||
      rawEntryCode === 'HS-YOU1-01' ||
      rawEntryCode === 'HS-CLUD-01' ||
      rawEntryCode === 'HS-CLUD-00';
    const resolvedFriendCode =
      state?.friendCode || (!isPlaceholderCode ? rawEntryCode : '') || `HS-${fnv1aHashHex(uid).slice(0, 4).toUpperCase()}-01`;

    const nowMs = this.now();
    const incomingPrimary = Math.max(
      0,
      Math.min(maxPrimary, Math.floor(Number(params.entry.primaryValue) || 0))
    );
    const incomingRating = Math.max(
      0,
      Math.min(9_999_999, Math.floor(Number(params.entry.ratingScore) || 0))
    );
    const incomingWins = Math.max(
      0,
      Math.min(999_999, Math.floor(Number(params.entry.totalWins) || 0))
    );
    const incomingStreak = Math.max(
      0,
      Math.min(99_999, Math.floor(Number(params.entry.bestStreak) || 0))
    );

    const kvKey = `burrow_lb:${gameId}`;
    const existing = (await this.readJson<Array<Record<string, unknown>>>(kvKey)) ?? [];
    const targetCodeNorm = resolvedFriendCode.trim().toUpperCase();
    const hasTargetCode = !isPlaceholderServerFriendCode(targetCodeNorm);
    const targetNick = normalizeDistinctServerNickname(resolvedName);

    let prev: Record<string, unknown> | undefined;
    const byUser = new Map<string, Record<string, unknown>>();
    for (const item of existing) {
      if (!item || typeof item.userId !== 'string') continue;
      const itemUid = item.userId.trim();
      const itemCode = String(item.friendCode || '').trim().toUpperCase();
      const itemNick = normalizeDistinctServerNickname(item.name);
      const isSamePlayerGhost =
        itemUid === uid ||
        (hasTargetCode && !isPlaceholderServerFriendCode(itemCode) && itemCode === targetCodeNorm) ||
        (targetNick !== null &&
          itemNick !== null &&
          itemNick === targetNick &&
          (!isGeneratedGuestBackendUid(uid) || isGeneratedGuestBackendUid(itemUid)));

      if (isSamePlayerGhost) {
        prev = prev
          ? mergeServerLeaderboardItems(prev, item, new Map())
          : item;
        if (itemUid !== uid && !isGeneratedGuestBackendUid(uid)) {
          // Hấp thụ bản ghi bóng ma `hs_...` vào UID chính danh
          continue;
        }
      }
      byUser.set(itemUid, item);
    }

    const prevPrimary = Math.max(0, Math.floor(Number(prev?.primaryValue) || 0));
    const prevRating = Math.max(0, Math.floor(Number(prev?.ratingScore) || 0));
    const prevWins = Math.max(0, Math.floor(Number(prev?.totalWins) || 0));
    const prevStreak = Math.max(0, Math.floor(Number(prev?.bestStreak) || 0));

    const improved = (!prev && incomingPrimary > 0) || incomingPrimary > prevPrimary;
    const bestPrimary = Math.max(prevPrimary, incomingPrimary);
    const bestRating =
      incomingPrimary > prevPrimary ? incomingRating : Math.max(prevRating, incomingRating);
    const bestWins = Math.max(prevWins, incomingWins);
    const bestStreak = Math.max(prevStreak, incomingStreak);

    const mergedEntry = {
      userId: uid,
      name: String(resolvedName).slice(0, 42),
      parkName: resolvedParkName,
      friendCode: resolvedFriendCode,
      avatarEmoji: String(params.entry.avatarEmoji || state?.avatarEmoji || prev?.avatarEmoji || '🧙‍♂️').slice(
        0,
        8
      ),
      house,
      primaryValue: bestPrimary,
      ratingScore: bestRating,
      totalWins: bestWins,
      bestStreak: bestStreak,
      detailLabelVi: String(params.entry.detailLabelVi || prev?.detailLabelVi || '').slice(0, 64),
      updatedAt: nowMs,
    };

    byUser.set(uid, mergedEntry);

    if (state) {
      const prevStateRec = state.minigameRecords[gameId] ?? {
        bestStage: 0,
        ratingScore: 0,
        totalWins: 0,
        bestStreak: 0,
        updatedAt: nowMs,
      };
      state.minigameRecords[gameId] = {
        bestStage: Math.max(prevStateRec.bestStage, bestPrimary),
        ratingScore: Math.max(prevStateRec.ratingScore, bestRating),
        totalWins: Math.max(prevStateRec.totalWins, bestWins),
        bestStreak: Math.max(prevStateRec.bestStreak, bestStreak),
        updatedAt: nowMs,
      };
    }

    const topEntries = deduplicateServerLeaderboardItems(Array.from(byUser.values()), new Map())
      .sort(
        (a, b) =>
          Number(b.primaryValue || 0) - Number(a.primaryValue || 0) ||
          Number(b.ratingScore || 0) - Number(a.ratingScore || 0) ||
          Number(b.totalWins || 0) - Number(a.totalWins || 0)
      )
      .slice(0, 50);

    await this.writeJson(kvKey, topEntries, 86_400 * 180);

    let cupPointsAdded = 0;
    if (improved && bestPrimary > 0 && params.awardImprovementCup !== false && params.daily) {
      const cupRes = await this.addHouseCupPoints(house, params.daily, 5);
      cupPointsAdded = cupRes.added;
    }

    return { improved, cupPointsAdded };
  }

  /**
   * Ghi nhận điểm Bảng Xếp Hạng mini game kèm cộng điểm Cúp Nhà Hogwarts hàng tuần.
   * Đồng bộ chặt chẽ với 3 bộ môn tính điểm chính thức (`match3`, `sudoku`, `blocks`).
   */
  public async submitLeaderboardScore(params: {
    uid: string;
    gameId: string;
    entry: Record<string, unknown>;
  }): Promise<{ gameId: string; entries: Array<Record<string, unknown>>; cupPointsAdded: number }> {
    const validGames = new Set(['match3', 'sudoku', 'blocks', 'jigsaw', 'caro', 'chess', 'seedquiz']);
    const gameId = validGames.has(params.gameId) ? params.gameId : 'match3';

    if (!SCORED_SERVER_LEADERBOARD_GAMES.has(gameId)) {
      return { gameId, entries: [], cupPointsAdded: 0 };
    }

    return this.withScopeLocks(
      [`lb:${gameId}`, `user:${params.uid}`, `cup:${vnWeekKey(this.now())}`, 'visit_dir'],
      async () => {
        const entryHouse = normalizeHogwartsHouse(params.entry.house);
        const state = await this.getOrCreateState(
          params.uid,
          entryHouse ?? 'Gryffindor',
          'default'
        );
        if (typeof this.store.resolveMemberIdentityProfile === 'function') {
          await this.applyIdentityProfileToState(state, {
            uid: params.uid,
            house: state.house,
            houseExplicit: state.houseSource === 'hpvn',
            role: 'member',
            authenticatedVia: 'hmac-jwt',
          });
        }
        const daily = await this.getOrCreateDaily(params.uid);
        const res = await this.upsertLeaderboardEntryUnlocked({
          uid: params.uid,
          gameId,
          entry: params.entry,
          state,
          daily,
          awardImprovementCup: true,
        });
        await this.writeJson(`burrow_states:${params.uid}`, state);
        if (res.cupPointsAdded > 0) {
          await this.writeJson(`burrow_daily:${params.uid}:${daily.dayKey}`, daily, 86_400 * 14);
        }
        await this.registerVisitDirectoryEntry(state);
        const entries = await this.getLeaderboardEntries(gameId);
        return { gameId, entries, cupPointsAdded: res.cupPointsAdded };
      }
    );
  }

  /**
   * Bảng xếp hạng Cúp 4 Nhà Hogwarts hàng tuần (chốt chủ nhật 23:59 giờ Việt Nam `UTC+7`).
   */
  public async getWeeklyHouseCupStandings(
    _data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const nowMs = this.now();
    const cup = await this.getOrCreateHouseCup(vnWeekKey(nowMs));
    const daily = await this.getOrCreateDaily(identity.uid);
    return {
      ok: true,
      weekKey: cup.weekKey,
      totals: cup.houses,
      playerContribution: daily.houseCupPointsToday,
      memberDailyCap: MAX_DAILY_HOUSE_CUP_MEMBER_POINTS,
      rewardMin: cup.rewardMin,
      updatedAt: cup.updatedAt,
    };
  }

  /**
   * Ghi điểm đóng góp Cúp 4 Nhà có kiểm soát trần thành viên/ngày (`MAX_DAILY_HOUSE_CUP_MEMBER_POINTS`).
   */
  public async contributeWeeklyHouseCup(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(
      identity.uid,
      identity.house,
      identity.houseExplicit ? 'hpvn' : 'default'
    );
    await this.applyIdentityProfileToState(state, identity);
    const daily = await this.getOrCreateDaily(identity.uid);
    const requestedHouse = normalizeHogwartsHouse(data.house);
    const house: HogwartsHouseName =
      state.houseSource === 'hpvn'
        ? state.house
        : requestedHouse && (requestedHouse !== 'Gryffindor' || !state.house)
          ? requestedHouse
          : state.house;
    const rawPts = Math.max(1, Math.min(30, Math.floor(Number(data.points) || 5)));
    const { added, cup } = await this.addHouseCupPoints(house, daily, rawPts);
    await this.writeJson(`burrow_daily:${identity.uid}:${daily.dayKey}`, daily, 86_400 * 14);
    return {
      ok: true,
      added,
      weekKey: cup.weekKey,
      totals: cup.houses,
      playerContribution: daily.houseCupPointsToday,
      memberDailyCap: MAX_DAILY_HOUSE_CUP_MEMBER_POINTS,
      updatedAt: cup.updatedAt,
    };
  }

  /**
   * Đăng yêu cầu Co-op người thật (Đóng hộ kiện Đơn Cú hoặc Giải cứu màn khó Khảo Thí).
   */
  public async postCoopAssistanceRequest(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const state = await this.getOrCreateState(identity.uid, identity.house);
    const daily = await this.getOrCreateDaily(identity.uid);
    const nowMs = this.now();
    const kind = data.kind === 'owl_crate' ? 'owl_crate' : 'minigame_sos';

    if (kind === 'owl_crate' && daily.owlHelpsRequestedCount >= MAX_DAILY_FRIEND_HELPS) {
      throw new BurrowServerError(
        'daily-help-cap',
        `Hôm nay bạn đã gửi tối đa ${MAX_DAILY_FRIEND_HELPS}/${MAX_DAILY_FRIEND_HELPS} yêu cầu nhờ đóng Đơn Cú!`
      );
    }

    const kvKey = `burrow_coop_req:${identity.uid}`;
    const current = (await this.readJson<CoopAssistanceRequestDoc[]>(kvKey)) ?? [];
    const reqDoc: CoopAssistanceRequestDoc = {
      requestId: String(data.requestId || `coop_${identity.uid}_${nowMs}`),
      hostUid: identity.uid,
      hostName: state.playerName,
      hostEmoji: state.avatarEmoji,
      kind,
      ...(typeof data.orderId === 'string' ? { orderId: data.orderId.slice(0, 64) } : {}),
      ...(typeof data.reqIndex === 'number' ? { reqIndex: Math.max(0, Math.floor(data.reqIndex)) } : {}),
      ...(typeof data.itemId === 'string' ? { itemId: data.itemId.slice(0, 48) } : {}),
      ...(typeof data.qty === 'number' ? { qty: Math.max(1, Math.min(50, Math.floor(data.qty))) } : {}),
      ...(typeof data.minigameKind === 'string' ? { minigameKind: data.minigameKind.slice(0, 24) } : {}),
      ...(typeof data.stage === 'number' ? { stage: Math.max(1, Math.min(777, Math.floor(data.stage))) } : {}),
      createdAt: nowMs,
    };

    if (kind === 'owl_crate') {
      daily.owlHelpsRequestedCount += 1;
      await this.writeJson(`burrow_daily:${identity.uid}:${daily.dayKey}`, daily, 86_400 * 14);
    }

    const updated = [
      reqDoc,
      ...current.filter((r) => r.requestId !== reqDoc.requestId),
    ].slice(0, 10);
    await this.writeJson(kvKey, updated, 86_400 * 3);
    return { ok: true, request: reqDoc, requests: updated };
  }

  public async getCoopAssistanceRequests(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const targetUid =
      typeof data.hostUid === 'string' && data.hostUid.trim()
        ? sanitizeBackendUid(data.hostUid)
        : identity.uid;
    const list = (await this.readJson<CoopAssistanceRequestDoc[]>(`burrow_coop_req:${targetUid}`)) ?? [];
    return { ok: true, hostUid: targetUid, requests: list };
  }

  /**
   * Bạn bè người thật hoàn tất yêu cầu Co-op (Đơn Cú hoặc Giải cứu Màn Khó kèm Linh Ảnh Ghost Replay).
   */
  public async fulfillCoopAssistanceRequest(
    data: Record<string, unknown>,
    identity: VerifiedSessionIdentity
  ): Promise<Record<string, unknown>> {
    const hostUid = sanitizeBackendUid(data.hostUid);
    if (!hostUid || hostUid === identity.uid) {
      throw new BurrowServerError(
        'invalid-action-input',
        'Không thể tự giải cứu hoặc đóng hộ yêu cầu của chính mình!'
      );
    }

    const helperState = await this.getOrCreateState(identity.uid, identity.house);
    const helperDaily = await this.getOrCreateDaily(identity.uid);
    const helperWallet = await this.getOrCreateWallet(identity.uid);
    const helperLedger = await this.getLedger(identity.uid);
    const prevHelperLedgerLen = helperLedger.length;

    if (helperDaily.helpsGivenCount >= MAX_DAILY_FRIEND_HELPS) {
      throw new BurrowServerError(
        'daily-help-cap',
        `Hôm nay bạn đã dùng hết ${MAX_DAILY_FRIEND_HELPS}/${MAX_DAILY_FRIEND_HELPS} lượt tương trợ bạn bè (reset 00:00 giờ VN)!`
      );
    }

    const kvKey = `burrow_coop_req:${hostUid}`;
    const list = (await this.readJson<CoopAssistanceRequestDoc[]>(kvKey)) ?? [];
    const reqId = typeof data.targetRequestId === 'string' ? data.targetRequestId : '';
    const target = reqId
      ? list.find((r) => r.requestId === reqId && !r.fulfilledAt)
      : list.find((r) => !r.fulfilledAt);
    if (!target) {
      throw new BurrowServerError('nothing-to-help', 'Yêu cầu tương trợ này đã được bạn khác hoàn tất!');
    }

    if (target.kind === 'minigame_sos' && helperDaily.rescuedHostUids.includes(hostUid)) {
      throw new BurrowServerError(
        'already-helped',
        'Hôm nay bạn đã giải cứu Khảo Thí cho người bạn này rồi (tối đa 1 lần/bạn/ngày)!'
      );
    }

    const nowMs = this.now();
    target.fulfilledAt = nowMs;
    target.helperUid = identity.uid;
    target.helperName = helperState.playerName;
    target.helperEmoji = helperState.avatarEmoji;

    if (target.kind === 'minigame_sos') {
      const stageNum = target.stage ?? 1;
      const movesUsed = Math.max(4, Math.min(60, Math.floor(Number(data.movesUsed) || 14)));
      const rawMoves = Array.isArray(data.ghostReplayMoves)
        ? data.ghostReplayMoves.map((m) => String(m).slice(0, 64)).slice(0, 6)
        : [
            `Nước #3: Mở khóa cụm trung tâm Màn ${stageNum}`,
            `Nước #${Math.max(4, movesUsed - 2)}: Chuỗi phép phá chướng ngại`,
            `Nước #${movesUsed}: Dứt điểm hoàn hảo!`,
          ];
      target.ghostReplayMoves = rawMoves;
      target.ghostReplaySummaryVi =
        typeof data.ghostReplaySummaryVi === 'string' && data.ghostReplaySummaryVi.trim()
          ? data.ghostReplaySummaryVi.trim().slice(0, 140)
          : `👻 Linh ảnh ${helperState.playerName}: Phá đảo Màn ${stageNum} chỉ trong ${movesUsed} nước!`;
      helperDaily.rescuesGivenCount += 1;
      helperDaily.rescuedHostUids.push(hostUid);
    } else if (!helperDaily.helpedHostUids.includes(hostUid)) {
      helperDaily.helpedHostUids.push(hostUid);
    }

    helperDaily.helpsGivenCount += 1;
    const tokensEarned = target.kind === 'minigame_sos' ? 3 : 2;
    const goldEarned = target.kind === 'minigame_sos' ? 95 : 45;
    helperState.friendshipTokens += tokensEarned;
    helperState.xp += 35;
    helperState.updatedAt = nowMs;

    this.creditWalletInMemory(helperWallet, helperLedger, {
      requestId: `coop_reward_${target.requestId}_${identity.uid}`,
      amount: goldEarned,
      sourceType: 'burrow-garden-visit',
      reasonCode: target.kind === 'minigame_sos' ? 'friend_sos_rescue' : 'friend_owl_crate',
    });
    const cupRes = await this.addHouseCupPoints(helperState.house, helperDaily, 6);

    await this.writeJson(kvKey, list, 86_400 * 3);
    await this.writeJson(`burrow_states:${identity.uid}`, helperState);
    await this.writeJson(
      `burrow_daily:${identity.uid}:${helperDaily.dayKey}`,
      helperDaily,
      86_400 * 14
    );
    await this.persistWalletAndLedger(
      identity.uid,
      helperWallet,
      helperLedger,
      prevHelperLedgerLen
    );

    await this.appendHelperForHost(hostUid, helperDaily.dayKey, {
      id: `hlp_${nowMs}_${identity.uid.slice(0, 6)}`,
      uid: identity.uid,
      name: helperState.playerName,
      avatarEmoji: helperState.avatarEmoji,
      ...(helperState.avatarUrl ? { avatarUrl: helperState.avatarUrl } : {}),
      kind: target.kind === 'minigame_sos' ? 'stoke_workshop' : 'tend_yard',
      noteText:
        target.ghostReplaySummaryVi ??
        `${helperState.playerName} đã đóng phụ kiện hàng Đơn Cú giúp bạn!`,
      at: nowMs,
    });

    return {
      ok: true,
      request: target,
      tokensEarned,
      goldEarned,
      cupPointsAdded: cupRes.added,
      helpsLeft: Math.max(0, MAX_DAILY_FRIEND_HELPS - helperDaily.helpsGivenCount),
    };
  }
}
