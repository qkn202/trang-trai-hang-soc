/**
 * CloudSave — Đồng bộ tiến trình 'Trang Trại Hang Sóc' với Authoritative Backend
 * Nâng cấp chuẩn HPVNN (`thachanhgau/hagridfarm`):
 *  - Hỗ trợ phiên xác thực ký HMAC-SHA256 (`POST /api/auth/session` -> `Authorization: Bearer <token>`).
 *  - Khóa nguyên tử đa tab bằng Web Locks API (`navigator.locks.request`) quanh mọi thao tác đọc/ghi `localStorage`.
 *  - Đối soát khóa ngày Việt Nam `UTC+7` (`serverDayKey`), trần `5 lượt hỗ trợ bạn bè/ngày`,
 *    và tự động nhận thông báo `helpers` khi bạn bè sang chăm giúp thung lũng.
 */

import { useServerCalendarDayKey } from '../sim/neighborSocial';
import type { HomeOwlLanternMark, HouseName, VerifiedRealPlayerProfile } from '../types/game';

export const SAVE_KEY = 'burrow_hogsmeade_777_v3';
export const USER_ID_STORAGE_KEY = 'hangsoc_client_uid_v1';
export const DEFAULT_SAVE_ENDPOINT = '/api/save';
export const SESSION_AUTH_ENDPOINT = '/api/auth/session';
export const FRIEND_REGISTER_ENDPOINT = '/api/friends/register';
export const FRIEND_LOOKUP_ENDPOINT = '/api/friends/lookup';
export const DEFAULT_SYNC_INTERVAL_MS = 60_000;

let cachedSessionToken: string | null = null;
let cachedSessionExpiresAt = 0;

export function getCachedSessionBearerToken(): string | null {
  if (cachedSessionToken && Date.now() < cachedSessionExpiresAt) {
    return cachedSessionToken;
  }
  return null;
}

/**
 * Gắn định danh tài khoản HPVN đã xác thực làm UID chuẩn thống nhất cho CloudSave,
 * Bảng Xếp Hạng và Sổ Hàng Xóm trên thiết bị hiện tại.
 */
export function setAuthenticatedUserId(rawUid: string): string {
  const clean = String(rawUid || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 64);
  if (!clean) return getOrCreateClientUserId();
  if (typeof localStorage !== 'undefined') {
    try {
      const prev = localStorage.getItem(USER_ID_STORAGE_KEY);
      if (prev !== clean) {
        localStorage.setItem(USER_ID_STORAGE_KEY, clean);
        cachedSessionToken = null;
        cachedSessionExpiresAt = 0;
      }
    } catch {
      // Bỏ qua lỗi ghi localStorage ở chế độ ẩn danh khóa bộ nhớ
    }
  }
  return clean;
}

export function getOrCreateClientUserId(): string {
  if (typeof localStorage === 'undefined') return 'anonymous_user';
  try {
    let uid = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!uid) {
      const rand = Math.random().toString(36).substring(2, 10);
      uid = `hs_${Date.now().toString(36)}_${rand}`;
      localStorage.setItem(USER_ID_STORAGE_KEY, uid);
    }
    return uid;
  } catch {
    return 'anonymous_user';
  }
}

export async function acquireSessionBearerToken(uid = getOrCreateClientUserId()): Promise<string | null> {
  if (cachedSessionToken && Date.now() + 30_000 < cachedSessionExpiresAt) {
    return cachedSessionToken;
  }
  if (typeof fetch !== 'function' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return null;
  }
  try {
    const globalWin =
      typeof window !== 'undefined'
        ? (window as Window & {
            __HPVN_GET_ID_TOKEN__?: () => Promise<string | null>;
            __HPVN_CONFIG__?: { getIdToken?: () => Promise<string | null> };
          })
        : undefined;
    const getIdTokenFn =
      globalWin?.__HPVN_CONFIG__?.getIdToken ?? globalWin?.__HPVN_GET_ID_TOKEN__;
    const idToken = getIdTokenFn ? await getIdTokenFn().catch(() => null) : null;
    const rawHash = typeof window !== 'undefined' && window.location?.hash ? window.location.hash.slice(1) : '';
    const hashParams = rawHash ? new URLSearchParams(rawHash) : null;
    const ticket = hashParams ? hashParams.get('burrow-ticket') ?? hashParams.get('hpvn-ticket') : null;

    const res = await fetch(SESSION_AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': uid,
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({
        uid,
        ...(idToken ? { idToken } : {}),
        ...(ticket ? { ticket } : {}),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      token?: string;
      uid?: string;
      expiresAt?: number;
      dayKey?: string;
    };
    if (typeof data.uid === 'string' && data.uid) {
      setAuthenticatedUserId(data.uid);
    }
    if (typeof data.dayKey === 'string') {
      useServerCalendarDayKey(data.dayKey);
    }
    if (typeof data.token === 'string' && data.token) {
      cachedSessionToken = data.token;
      cachedSessionExpiresAt = Number(data.expiresAt || Date.now() + 3_600_000);
      return cachedSessionToken;
    }
  } catch {
    // Im lặng fallback về X-User-Id khi chạy ngoại tuyến
  }
  return null;
}

function buildAuthHeaders(
  userId: string,
  extra: Record<string, string> = {}
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-User-Id': userId,
    ...extra,
  };
  if (cachedSessionToken && Date.now() < cachedSessionExpiresAt) {
    headers.Authorization = `Bearer ${cachedSessionToken}`;
  }
  return headers;
}

async function withSaveStorageLock<T>(fn: () => Promise<T> | T): Promise<T> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const locks =
    nav && 'locks' in nav ? (nav as Navigator & { locks?: LockManager }).locks : undefined;
  if (locks && typeof locks.request === 'function') {
    return locks.request('hangsoc_cloud_save_tx', async () => fn());
  }
  return fn();
}

export async function registerRealPlayerProfileOnline(
  stateOverride?: Record<string, unknown>
): Promise<boolean> {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return false;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
  try {
    let parsed = stateOverride ?? null;
    if (!parsed && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        parsed = JSON.parse(raw) as Record<string, unknown>;
      }
    }
    if (!parsed || typeof parsed !== 'object') return false;
    if (
      parsed.sandboxMode === true ||
      parsed.sandboxTainted === true ||
      parsed.isHeadmasterPreview === true
    ) {
      return false;
    }
    const soc =
      parsed.neighborSocial && typeof parsed.neighborSocial === 'object'
        ? (parsed.neighborSocial as Record<string, unknown>)
        : null;
    const friendCode = String(soc?.playerFriendCode ?? '')
      .trim()
      .toUpperCase();
    if (friendCode.length < 4) return false;

    const userId = getOrCreateClientUserId();
    const payload = JSON.stringify({
      userId,
      friendCode,
      parkName: parsed.parkName || 'Trang Trại Hang Sóc',
      level: parsed.level || 1,
      housePoints: parsed.housePoints,
      buildings: Array.isArray(parsed.buildings) ? parsed.buildings.slice(0, 260) : undefined,
      tileOverrides: parsed.tileOverrides,
      unlockedZones: parsed.unlockedZones,
    });
    const gz = await tryGzipText(payload);
    const headers = buildAuthHeaders(userId, { 'Content-Type': 'application/json' });
    if (gz) headers['Content-Encoding'] = 'gzip';
    const res = await fetch(FRIEND_REGISTER_ENDPOINT, {
      method: 'POST',
      headers,
      body: gz ?? payload,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function lookupRealPlayerByFriendCode(rawCode: string): Promise<{
  ok: boolean;
  msg: string;
  profile?: VerifiedRealPlayerProfile;
}> {
  const cleaned = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 18);
  if (cleaned.length < 4) {
    return {
      ok: false,
      msg: 'Mã Thung Lũng cần ít nhất 4 ký tự (ví dụ: HS-ABCD-12)!',
    };
  }
  if (
    ['HS-HAGRID-01', 'HS-LUNA-02', 'HS-NEVILLE-03', 'HS-HERMIONE-04', 'HS-WEASLEY-05'].includes(
      cleaned
    )
  ) {
    return {
      ok: false,
      msg: 'Sổ Hàng Xóm chỉ cho phép thêm người chơi thật, không nhận mã NPC!',
    };
  }
  if (typeof fetch !== 'function' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return {
      ok: false,
      msg: 'Bạn đang ngoại tuyến — cần kết nối mạng để xác thực Mã Thung Lũng của người chơi thật!',
    };
  }

  try {
    const res = await fetch(`${FRIEND_LOOKUP_ENDPOINT}?code=${encodeURIComponent(cleaned)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const ctype = (res.headers.get('content-type') || '').toLowerCase();
    if (!ctype.includes('application/json')) {
      return {
        ok: false,
        msg: 'Chưa kết nối được máy chủ Hàng Xóm Online (/api/friends/lookup) để xác thực người chơi thật!',
      };
    }
    const data = (await res.json()) as {
      ok?: boolean;
      found?: boolean;
      error?: string;
      profile?: VerifiedRealPlayerProfile;
    };
    if (!res.ok || !data?.found || !data?.profile || !data.profile.friendCode) {
      return {
        ok: false,
        msg:
          data?.error ||
          `Không tìm thấy người chơi thật nào có mã ${cleaned}! Nhờ bạn mở Sổ Hàng Xóm để đồng bộ mã trước nhé.`,
      };
    }
    const ownUid = getOrCreateClientUserId();
    if (data.profile.userId && data.profile.userId === ownUid) {
      return {
        ok: false,
        msg: 'Đây là Mã Thung Lũng của chính tài khoản bạn!',
      };
    }
    const validHouses = new Set<HouseName>(['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin']);
    const house: HouseName = validHouses.has(data.profile.house)
      ? data.profile.house
      : 'Gryffindor';
    return {
      ok: true,
      msg: 'Đã xác thực người chơi thật!',
      profile: {
        ...data.profile,
        house,
      },
    };
  } catch {
    return {
      ok: false,
      msg: 'Không thể kết nối máy chủ để xác thực người chơi thật. Vui lòng thử lại!',
    };
  }
}

async function tryGzipText(text: string): Promise<ArrayBuffer | null> {
  if (text.length < 1024 || typeof CompressionStream === 'undefined') {
    return null;
  }
  try {
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
    return await new Response(stream).arrayBuffer();
  } catch {
    return null;
  }
}

interface IncomingServerHelper {
  id: string;
  uid: string;
  name: string;
  avatarEmoji?: string;
  kind?: 'water_crop' | 'tend_yard' | 'stoke_workshop';
  buildingUid?: string;
  noteText?: string;
  at: number;
}

function mergeServerAuthoritativeMetaIntoLocalSave(meta: {
  dayKey?: string;
  helpsLeft?: number;
  helpers?: IncomingServerHelper[];
}): void {
  if (typeof meta.dayKey === 'string') {
    useServerCalendarDayKey(meta.dayKey);
  }
  if (typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return;
    const soc =
      parsed.neighborSocial && typeof parsed.neighborSocial === 'object'
        ? (parsed.neighborSocial as Record<string, unknown>)
        : null;
    if (!soc) return;

    let mutated = false;
    if (typeof meta.dayKey === 'string' && soc.lastSocialResetKey !== meta.dayKey) {
      soc.lastSocialResetKey = meta.dayKey;
      mutated = true;
    }
    if (typeof meta.helpsLeft === 'number') {
      const serverUsed = Math.max(0, Math.min(5, 5 - Math.floor(meta.helpsLeft)));
      const localUsed = Math.max(0, Math.floor(Number(soc.dailyGardenHelpsCount) || 0));
      if (serverUsed > localUsed) {
        soc.dailyGardenHelpsCount = serverUsed;
        mutated = true;
      }
    }

    if (Array.isArray(meta.helpers) && meta.helpers.length > 0) {
      const existingMarks = Array.isArray(soc.homeLanternMarks)
        ? (soc.homeLanternMarks as HomeOwlLanternMark[])
        : [];
      const seenIds = new Set(existingMarks.map((m) => m.id));
      const buildings = Array.isArray(parsed.buildings)
        ? (parsed.buildings as Array<{ uid?: string }>)
        : [];
      const fallbackBuildingUid = buildings[0]?.uid || 'burrow_main_gate';

      const newHelpers: IncomingServerHelper[] = [];
      for (const h of meta.helpers) {
        if (!h?.id || seenIds.has(h.id)) continue;
        seenIds.add(h.id);
        newHelpers.push(h);
        if (existingMarks.length < 5) {
          existingMarks.push({
            id: h.id,
            buildingUid: h.buildingUid || fallbackBuildingUid,
            helperId: h.uid,
            helperName: h.name || 'Hàng Xóm Hang Sóc',
            helperEmoji: h.avatarEmoji || '🧙‍♂️',
            kind: h.kind || 'water_crop',
            noteVi: h.noteText || 'Đã sang chăm giúp thung lũng của bạn!',
            createdAt: h.at || Date.now(),
          });
        }
      }

      if (newHelpers.length > 0) {
        soc.homeLanternMarks = existingMarks;
        mutated = true;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('gamesave:helpers', {
              detail: {
                helpers: newHelpers,
                summaryVi: `🤝 ${newHelpers.map((h) => h.name).join(', ')} đã chăm giúp thung lũng của bạn!`,
              },
            })
          );
        }
      }
    }

    if (mutated) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('gamesave:server-meta', {
            detail: {
              dayKey: typeof soc.lastSocialResetKey === 'string' ? soc.lastSocialResetKey : undefined,
              dailyGardenHelpsCount:
                typeof soc.dailyGardenHelpsCount === 'number'
                  ? soc.dailyGardenHelpsCount
                  : undefined,
            },
          })
        );
      }
    }
  } catch {
    // Bỏ qua lỗi parse save cục bộ
  }
}

export interface SaveMetadataGuard {
  version: number;
  savedAt?: number;
  lastSavedAt?: number;
  [key: string]: unknown;
}

export interface CloudSaveOptions {
  endpoint?: string;
  syncIntervalMs?: number;
  onUploadSuccess?: (detail: { savedAt: number; version: number }) => void;
}

function isTutorialProgressedOrDone(rawTut: unknown): boolean {
  if (!rawTut || typeof rawTut !== 'object') return false;
  const tut = rawTut as {
    completed?: boolean;
    completedAt?: number;
    skipped?: boolean;
    stepId?: string;
    stepIndex?: number;
    step?: number;
  };
  return (
    tut.completed === true ||
    tut.skipped === true ||
    tut.stepId === 'completed' ||
    (typeof tut.completedAt === 'number' && tut.completedAt > 0) ||
    (typeof tut.stepIndex === 'number' && tut.stepIndex > 0) ||
    (typeof tut.step === 'number' && tut.step > 0)
  );
}

export function isUnplayedFreshSave(parsed: Record<string, unknown> | null | undefined): boolean {
  if (!parsed || typeof parsed !== 'object') return true;
  const level = Math.floor(Number(parsed.level || 1));
  const xp = Math.floor(Number(parsed.xp || 0));
  const guests = Math.floor(Number(parsed.totalGuestsEver || 0));
  return level <= 1 && xp <= 0 && guests <= 0 && !isTutorialProgressedOrDone(parsed.tutorial);
}

export function shouldHydrateFromServerSave(
  localParsed: SaveMetadataGuard | null,
  serverJson: SaveMetadataGuard
): boolean {
  if (!localParsed || typeof localParsed !== 'object') return true;
  const localVersion = Number(localParsed.version || 0);
  if (localVersion > serverJson.version) return false;

  const serverSavedAt = Number(serverJson.savedAt || serverJson.lastSavedAt || 0);
  const localSavedAt = Number(localParsed.savedAt || localParsed.lastSavedAt || 0);
  const serverLevel = Math.floor(Number(serverJson.level || 1));
  const localLevel = Math.floor(Number(localParsed.level || 1));
  const serverXp = Math.floor(Number(serverJson.xp || 0));
  const serverTutDone = isTutorialProgressedOrDone(serverJson.tutorial);

  // Thiết bị mới mở tab lần đầu có save Lv.1 vừa sinh (`Date.now()`) -> luôn nhận bản lưu đám mây có tiến trình thật!
  if (
    isUnplayedFreshSave(localParsed) &&
    (serverLevel > 1 || serverXp > 0 || serverTutDone)
  ) {
    return true;
  }

  // Bản lưu trên đám mây vượt tiến trình cấp độ rõ rệt so với máy hiện tại
  if (serverLevel > localLevel + 1) {
    return true;
  }

  return serverSavedAt > localSavedAt || (localSavedAt === 0 && serverSavedAt > 0);
}

export class CloudSave {
  public readonly endpoint: string;
  public readonly syncIntervalMs: number;
  public onUploadSuccess?: (detail: { savedAt: number; version: number }) => void;

  private isUploading = false;
  private isDownloading = false;
  private initialHydrationPending = false;
  private syncTimer: number | null = null;
  private lastUploadedSavedAt = 0;

  constructor(options: CloudSaveOptions = {}) {
    this.endpoint = options.endpoint || DEFAULT_SAVE_ENDPOINT;
    this.syncIntervalMs = options.syncIntervalMs || DEFAULT_SYNC_INTERVAL_MS;
    this.onUploadSuccess = options.onUploadSuccess;
  }

  /**
   * Lấy hoặc sinh mã định danh người chơi duy nhất (Client UUID) lưu trong localStorage
   */
  public getUserId(): string {
    return getOrCreateClientUserId();
  }

  /**
   * Khởi động vòng lặp đồng bộ định kỳ khi cửa sổ có tiêu điểm (document.hasFocus)
   */
  public syncLoop(intervalMs?: number): void {
    this.startSyncLoop(intervalMs);
  }

  public startSyncLoop(intervalMs?: number): void {
    if (this.syncTimer !== null) return;
    const interval = intervalMs || this.syncIntervalMs;

    this.syncTimer = window.setInterval(async () => {
      if (
        typeof document !== 'undefined' &&
        typeof document.hasFocus === 'function' &&
        !document.hasFocus()
      ) {
        return;
      }
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }

      try {
        await acquireSessionBearerToken(this.getUserId());
        await this.downloadNow();
        await this.uploadNow();
      } catch (err) {
        console.debug('[CloudSave] Lỗi chu kỳ syncLoop (đã nuốt lỗi an toàn):', err);
      }
    }, interval);
  }

  public stopSyncLoop(): void {
    if (this.syncTimer !== null) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Đẩy save hiện tại trong localStorage lên server (POST /api/save)
   */
  public async uploadNow(options?: { keepalive?: boolean }): Promise<boolean> {
    if (this.isUploading || this.initialHydrationPending) return false;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
    if (typeof fetch !== 'function') {
      console.debug('[CloudSave] fetch API không khả dụng');
      return false;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.debug('[CloudSave] Thiết bị đang offline, bỏ qua upload');
      return false;
    }

    const useKeepalive = Boolean(options?.keepalive);
    const runUpload = async (): Promise<boolean> => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(SAVE_KEY);
      } catch (err) {
        console.debug('[CloudSave] Không thể đọc localStorage:', err);
        return false;
      }

      if (!raw) {
        console.debug('[CloudSave] Không tìm thấy dữ liệu save trong localStorage');
        return false;
      }

      let parsed: SaveMetadataGuard;
      try {
        parsed = JSON.parse(raw) as SaveMetadataGuard;
      } catch (err) {
        console.warn('[CloudSave] Dữ liệu save cục bộ hỏng JSON, bỏ qua upload:', err);
        return false;
      }

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        typeof parsed.version !== 'number' ||
        parsed.version <= 0
      ) {
        console.warn('[CloudSave] Dữ liệu save thiếu version hợp lệ, hủy upload');
        return false;
      }

      if (
        parsed.sandboxMode === true ||
        parsed.sandboxTainted === true ||
        parsed.isHeadmasterPreview === true
      ) {
        console.debug('[CloudSave] Bỏ qua upload cho bản lưu Chế Độ Thử Nghiệm (Sandbox)');
        return false;
      }

      const savedAt = Number(parsed.savedAt || parsed.lastSavedAt || 0);
      if (savedAt > 0 && savedAt === this.lastUploadedSavedAt) {
        return true;
      }

      if (savedAt > 0) {
        parsed.savedAt = savedAt;
        parsed.lastSavedAt = parsed.lastSavedAt || savedAt;
      }

      this.isUploading = true;
      const userId = this.getUserId();

      try {
        const url = `${this.endpoint}?userId=${encodeURIComponent(userId)}`;
        const jsonText = JSON.stringify(parsed);
        const rawUtf8Bytes =
          typeof TextEncoder !== 'undefined'
            ? new TextEncoder().encode(jsonText).byteLength
            : jsonText.length * 2;
        // Khi tắt màn hình / pagehide (keepalive=true), gửi thẳng JSON nếu <= 58KB để fetch()
        // bắn ngay trong cùng microtask trước khi trình duyệt đóng băng JS trên di động.
        const gzBuffer =
          useKeepalive && rawUtf8Bytes <= 58_000 ? null : await tryGzipText(jsonText);
        const headers = buildAuthHeaders(userId, { 'Content-Type': 'application/json' });
        if (gzBuffer) {
          headers['Content-Encoding'] = 'gzip';
        }
        const bodyBytes = gzBuffer ? gzBuffer.byteLength : rawUtf8Bytes;
        const initFetch: RequestInit = {
          method: 'POST',
          headers,
          body: gzBuffer ?? jsonText,
        };
        if (useKeepalive && bodyBytes <= 60_000) {
          initFetch.keepalive = true;
        }
        const res = await fetch(url, initFetch);

        if (!res.ok) {
          console.debug(`[CloudSave] Server trả về mã lỗi upload: ${res.status}`);
          return false;
        }

        try {
          const reply = (await res.json()) as {
            dayKey?: string;
            helpsLeft?: number;
            helpers?: IncomingServerHelper[];
          };
          mergeServerAuthoritativeMetaIntoLocalSave(reply);
        } catch {
          // Một số môi trường mock trả body rỗng vẫn hợp lệ
        }

        this.lastUploadedSavedAt = savedAt;
        this.reportUpload({ savedAt, version: parsed.version });
        return true;
      } catch (err) {
        console.debug('[CloudSave] Upload thất bại (nuốt lỗi im lặng):', err);
        return false;
      } finally {
        this.isUploading = false;
      }
    };

    if (useKeepalive) {
      return runUpload();
    }
    return withSaveStorageLock(runUpload);
  }

  /**
   * Tải save từ server (GET /api/save) và ghi đè localStorage nếu server mới hơn
   */
  public async downloadNow(): Promise<boolean> {
    if (this.isDownloading) return false;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
    if (typeof fetch !== 'function') {
      console.debug('[CloudSave] fetch API không khả dụng');
      return false;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.debug('[CloudSave] Thiết bị đang offline, bỏ qua download');
      return false;
    }

    return withSaveStorageLock(async () => {
      this.isDownloading = true;
      const userId = this.getUserId();

      try {
        const url = `${this.endpoint}?userId=${encodeURIComponent(userId)}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: buildAuthHeaders(userId, { Accept: 'application/json' }),
        });

        if (res.status === 204 || res.status === 404) {
          return false;
        }

        if (!res.ok) {
          console.debug(`[CloudSave] Download server phản hồi lỗi: ${res.status}`);
          return false;
        }

        const contentType = res.headers.get('content-type') || '';
        if (contentType && !contentType.includes('application/json')) {
          return false;
        }

        const serverJson = (await res.json()) as SaveMetadataGuard & {
          serverDayKey?: string;
          serverHelpsLeft?: number;
          serverHelpers?: IncomingServerHelper[];
        };

        if (
          !serverJson ||
          typeof serverJson !== 'object' ||
          typeof serverJson.version !== 'number' ||
          serverJson.version <= 0
        ) {
          console.warn('[CloudSave] Save từ server không đạt chuẩn version guard, bỏ qua');
          return false;
        }

        mergeServerAuthoritativeMetaIntoLocalSave({
          dayKey: serverJson.serverDayKey,
          helpsLeft: serverJson.serverHelpsLeft,
          helpers: serverJson.serverHelpers,
        });

        const serverSavedAt = Number(serverJson.savedAt || serverJson.lastSavedAt || 0);

        let localParsed: SaveMetadataGuard | null = null;
        try {
          const localRaw = localStorage.getItem(SAVE_KEY);
          if (localRaw) {
            const parsed = JSON.parse(localRaw) as SaveMetadataGuard;
            if (parsed && typeof parsed === 'object') {
              localParsed = parsed;
            }
          }
        } catch {
          localParsed = null;
        }

        if (shouldHydrateFromServerSave(localParsed, serverJson)) {
          const cleanSave: Record<string, unknown> = { ...serverJson };
          delete cleanSave.serverNow;
          delete cleanSave.serverDayKey;
          delete cleanSave.serverHelpsLeft;
          delete cleanSave.serverHelpers;
          const cleanSaveJson = JSON.stringify(cleanSave);

          localStorage.setItem(SAVE_KEY, cleanSaveJson);
          this.lastUploadedSavedAt = serverSavedAt;

          window.dispatchEvent(
            new CustomEvent('gamesave:updated', {
              detail: {
                savedAt: serverSavedAt,
                version: serverJson.version,
                saveJson: cleanSaveJson,
              },
            })
          );
          return true;
        }

        return false;
      } catch (err) {
        console.debug('[CloudSave] Download thất bại (nuốt lỗi im lặng):', err);
        return false;
      } finally {
        this.isDownloading = false;
      }
    });
  }

  /**
   * Báo cáo sự kiện upload thành công cho analytics hoặc các subscriber khác
   */
  public reportUpload(detail: { savedAt: number; version: number }): void {
    if (this.onUploadSuccess) {
      try {
        this.onUploadSuccess(detail);
      } catch {
        // Nuốt lỗi callback
      }
    }

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent('gamesave:uploaded', {
            detail,
          })
        );
      } catch {
        // Nuốt lỗi event
      }
    }
  }

  /**
   * Khởi tạo CloudSave: xin cấp phiên xác thực HMAC, tải tiến trình mới nhất và khởi động chu kỳ đồng bộ
   */
  public init(): void {
    this.initialHydrationPending = true;
    acquireSessionBearerToken(this.getUserId())
      .catch(() => null)
      .then(() => this.downloadNow())
      .catch(() => {})
      .finally(() => {
        this.initialHydrationPending = false;
        registerRealPlayerProfileOnline().catch(() => {});
        this.startSyncLoop();
      });

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // Chạy ở microtask ngay sau khi toàn bộ listener đồng bộ (Sudoku/Caro/Chess/Onet/Match3/Sim)
          // vừa ghi xong bản lưu mới nhất vào localStorage.
          queueMicrotask(() => {
            void this.uploadNow({ keepalive: true });
          });
        } else {
          void this.uploadNow();
        }
      });
    }

    if (typeof window !== 'undefined') {
      const flushCloudOnHide = () => {
        queueMicrotask(() => {
          void this.uploadNow({ keepalive: true });
        });
      };
      window.addEventListener('pagehide', flushCloudOnHide);
      window.addEventListener('hangsoc:before-sw-reload', flushCloudOnHide);

      window.addEventListener('online', () => {
        acquireSessionBearerToken(this.getUserId())
          .catch(() => null)
          .then(() => this.downloadNow())
          .catch(() => {})
          .then(() => {
            registerRealPlayerProfileOnline().catch(() => {});
            return this.uploadNow().catch(() => {});
          });
      });
    }
  }
}
