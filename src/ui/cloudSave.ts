/**
 * CloudSave — Đồng bộ tiến trình chơi game 'Trang Trại Hang Sóc' lên Cloudflare / API backend
 * Thao tác trực tiếp trên localStorage key 'burrow_hogsmeade_777_v3' (không cần instance Sim)
 */

export const SAVE_KEY = 'burrow_hogsmeade_777_v3';
export const USER_ID_STORAGE_KEY = 'hangsoc_client_uid_v1';
export const DEFAULT_SAVE_ENDPOINT = '/api/save';
export const DEFAULT_SYNC_INTERVAL_MS = 60_000;

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
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify(parsed),
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
    // Thử đồng bộ ngay khi khởi động
    this.downloadNow()
      .catch(() => {})
      .finally(() => {
        this.startSyncLoop();
      });

    // Tự động tải lại khi mạng kết nối trở lại
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.downloadNow()
          .catch(() => {})
          .then(() => this.uploadNow().catch(() => {}));
      });
    }
  }
}
