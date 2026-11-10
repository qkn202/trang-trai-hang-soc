/**
 * CloudSave — Đồng bộ tiến trình chơi game 'Trang Trại Hang Sóc' lên Cloudflare / API backend
 * Thao tác trực tiếp trên localStorage key 'burrow_hogsmeade_777_v3' (không cần instance Sim)
 */

import type { HouseName, VerifiedRealPlayerProfile } from '../types/game';

export const SAVE_KEY = 'burrow_hogsmeade_777_v3';
export const USER_ID_STORAGE_KEY = 'hangsoc_client_uid_v1';
export const DEFAULT_SAVE_ENDPOINT = '/api/save';
export const FRIEND_REGISTER_ENDPOINT = '/api/friends/register';
export const FRIEND_LOOKUP_ENDPOINT = '/api/friends/lookup';
export const DEFAULT_SYNC_INTERVAL_MS = 60_000;

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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    };
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

export class CloudSave {
  public readonly endpoint: string;
  public readonly syncIntervalMs: number;
  public onUploadSuccess?: (detail: { savedAt: number; version: number }) => void;

  private isUploading = false;
  private isDownloading = false;
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
      // Guard: Chỉ poll khi cửa sổ có tiêu điểm và mạng khả dụng
      if (typeof document !== 'undefined' && typeof document.hasFocus === 'function' && !document.hasFocus()) {
        return;
      }
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }

      try {
        // Tải trước để kiểm tra nếu có tiến trình mới hơn từ thiết bị khác
        await this.downloadNow();
        // Sau đó đẩy tiến trình hiện tại nếu chưa được upload
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
  public async uploadNow(): Promise<boolean> {
    if (this.isUploading) return false;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
    if (typeof fetch !== 'function') {
      console.debug('[CloudSave] fetch API không khả dụng');
      return false;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.debug('[CloudSave] Thiết bị đang offline, bỏ qua upload');
      return false;
    }

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

    // Version guard: Save bắt buộc phải có thuộc tính version hợp lệ
    if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number' || parsed.version <= 0) {
      console.warn('[CloudSave] Dữ liệu save thiếu version hợp lệ, hủy upload');
      return false;
    }

    const savedAt = Number(parsed.savedAt || parsed.lastSavedAt || 0);
    // Nếu save hiện tại giống hệt lần đã upload trước đó, tránh spam network
    if (savedAt > 0 && savedAt === this.lastUploadedSavedAt) {
      return true;
    }

    // Đảm bảo cả hai trường timestamp savedAt & lastSavedAt cùng tồn tại để tương thích tối đa
    if (savedAt > 0) {
      parsed.savedAt = savedAt;
      parsed.lastSavedAt = parsed.lastSavedAt || savedAt;
    }

    this.isUploading = true;
    const userId = this.getUserId();

    try {
      const url = `${this.endpoint}?userId=${encodeURIComponent(userId)}`;
      const jsonText = JSON.stringify(parsed);
      const gzBuffer = await tryGzipText(jsonText);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      };
      if (gzBuffer) {
        headers['Content-Encoding'] = 'gzip';
      }
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: gzBuffer ?? jsonText,
      });

      if (!res.ok) {
        console.debug(`[CloudSave] Server trả về mã lỗi upload: ${res.status}`);
        return false;
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

    this.isDownloading = true;
    const userId = this.getUserId();

    try {
      const url = `${this.endpoint}?userId=${encodeURIComponent(userId)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-User-Id': userId,
        },
      });

      if (res.status === 204 || res.status === 404) {
        // Chưa có save trên server — hoàn toàn bình thường đối với người chơi mới
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

      const serverJson = (await res.json()) as SaveMetadataGuard;

      // Version guard cho dữ liệu tải từ server
      if (
        !serverJson ||
        typeof serverJson !== 'object' ||
        typeof serverJson.version !== 'number' ||
        serverJson.version <= 0
      ) {
        console.warn('[CloudSave] Save từ server không đạt chuẩn version guard, bỏ qua');
        return false;
      }

      const serverSavedAt = Number(serverJson.savedAt || serverJson.lastSavedAt || 0);

      // Đọc save hiện tại trong máy
      let localSavedAt = 0;
      let localVersion = 0;
      try {
        const localRaw = localStorage.getItem(SAVE_KEY);
        if (localRaw) {
          const localParsed = JSON.parse(localRaw) as SaveMetadataGuard;
          if (localParsed && typeof localParsed === 'object') {
            localSavedAt = Number(localParsed.savedAt || localParsed.lastSavedAt || 0);
            localVersion = Number(localParsed.version || 0);
          }
        }
      } catch {
        localSavedAt = 0;
      }

      // Tránh hạ cấp version game
      if (localVersion > serverJson.version) {
        console.debug('[CloudSave] Phiên bản máy cao hơn server, bỏ qua tải về');
        return false;
      }

      // Nếu server mới hơn (hoặc máy chưa từng có save): cập nhật localStorage
      if (serverSavedAt > localSavedAt || (localSavedAt === 0 && serverSavedAt > 0)) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(serverJson));
        this.lastUploadedSavedAt = serverSavedAt;

        // Bắn sự kiện thông báo game state đã được cập nhật từ đám mây
        window.dispatchEvent(
          new CustomEvent('gamesave:updated', {
            detail: {
              savedAt: serverSavedAt,
              version: serverJson.version,
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
   * Khởi tạo CloudSave: thử download tiến trình mới nhất và khởi động chu kỳ đồng bộ
   */
  public init(): void {
    // Thử đồng bộ ngay khi khởi động và đăng ký Mã Thung Lũng của người chơi thật
    this.downloadNow()
      .catch(() => {})
      .finally(() => {
        registerRealPlayerProfileOnline().catch(() => {});
        this.startSyncLoop();
      });

    // Tự động tải lại khi mạng kết nối trở lại
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.downloadNow()
          .catch(() => {})
          .then(() => {
            registerRealPlayerProfileOnline().catch(() => {});
            return this.uploadNow().catch(() => {});
          });
      });
    }
  }
}
