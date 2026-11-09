/**
 * Analytics — Quản lý sự kiện, xếp hàng đợi và gửi dữ liệu hàng loạt (batching) cho 'Trang Trại Hang Sóc'
 * Best-effort, không chặn luồng game, hỗ trợ flush khi chuyển tab / đóng trang.
 */

import type { CloudSave } from './cloudSave';

export interface AnalyticsEvent {
  id: string;
  name: string;
  props?: Record<string, unknown>;
  timestamp: number;
}

export interface AnalyticsBatchPayload {
  events: AnalyticsEvent[];
  sentAt: number;
}

export interface AnalyticsOptions {
  endpoint?: string;
  batchSize?: number;
  batchIntervalMs?: number;
}

export const DEFAULT_TRACK_ENDPOINT = '/api/track';
export const DEFAULT_BATCH_SIZE = 25;
export const DEFAULT_BATCH_INTERVAL_MS = 30_000;

export class Analytics {
  public readonly endpoint: string;
  public readonly batchSize: number;
  public readonly batchIntervalMs: number;

  private queue: AnalyticsEvent[] = [];
  private timer: number | null = null;
  private lastLevel: number | null = null;
  private isFlushing = false;
  private isInitialized = false;

  constructor(options: AnalyticsOptions = {}) {
    this.endpoint = options.endpoint || DEFAULT_TRACK_ENDPOINT;
    this.batchSize = options.batchSize || DEFAULT_BATCH_SIZE;
    this.batchIntervalMs = options.batchIntervalMs || DEFAULT_BATCH_INTERVAL_MS;
  }

  /**
   * Ghi nhận một sự kiện vào hàng đợi phân tích
   */
  public track(name: string, props?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      name,
      props: props ? { ...props } : undefined,
      timestamp: Date.now(),
    };

    this.queue.push(event);

    // Kích hoạt gửi ngay nếu đạt ngưỡng batchSize (25 sự kiện)
    if (this.queue.length >= this.batchSize) {
      this.flush().catch(() => {});
    }
  }

  /**
   * Báo cáo sự kiện upload save đã thành công
   */
  public reportUpload(detail?: Record<string, unknown>): void {
    this.track('save_uploaded', detail);
  }

  /**
   * Đẩy toàn bộ sự kiện đang chờ lên backend /api/track (best-effort)
   */
  public async flush(isExiting = false): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing) return;
    if (typeof window === 'undefined' || typeof fetch !== 'function') return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    // Lấy toàn bộ hàng đợi hiện tại ra để gửi
    const batch = this.queue.splice(0, this.queue.length);
    if (batch.length === 0) return;

    const payload: AnalyticsBatchPayload = {
      events: batch,
      sentAt: Date.now(),
    };
    const bodyStr = JSON.stringify(payload);

    // Khi đóng trang (pagehide / unload): ưu tiên navigator.sendBeacon
    if (isExiting && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const blob = new Blob([bodyStr], { type: 'application/json' });
        const queued = navigator.sendBeacon(this.endpoint, blob);
        if (queued) return;
      } catch {
        // Fallback sang fetch nếu sendBeacon thất bại
      }
    }

    this.isFlushing = true;
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyStr,
        keepalive: true,
      });
    } catch {
      // Nuốt lỗi im lặng theo chuẩn best-effort — không block game hoặc ném unhandled error
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Khởi tạo hệ thống tự động theo dõi (Auto-track)
   */
  public init(cloudSave?: CloudSave): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Tự động ghi nhận session_start khi mở game
    this.trackSessionStart();

    // 2. Định kỳ gửi batch mỗi 30 giây
    if (typeof window !== 'undefined') {
      this.timer = window.setInterval(() => {
        this.flush().catch(() => {});
      }, this.batchIntervalMs);

      // 3. Flush ngay khi người chơi chuyển tab hoặc ẩn trình duyệt
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush().catch(() => {});
        }
      });

      // 4. Flush ngay khi đóng hoặc điều hướng rời khỏi trang
      window.addEventListener('pagehide', () => {
        this.flush(true).catch(() => {});
      });

      // 5. Nghe sự kiện 'game:tick' (detail: { level?: number; galleons?: number })
      window.addEventListener('game:tick', (e: Event) => {
        this.handleGameTick(e);
      });

      // 6. Nghe sự kiện 'gamesave:uploaded' từ CloudSave
      window.addEventListener('gamesave:uploaded', (e: Event) => {
        const custom = e as CustomEvent<Record<string, unknown>>;
        this.track('save_uploaded', custom.detail || {});
      });
    }

    // 7. Gắn trực tiếp callback vào CloudSave nếu được truyền vào
    if (cloudSave) {
      const prevCallback = cloudSave.onUploadSuccess;
      cloudSave.onUploadSuccess = (detail) => {
        if (prevCallback) {
          try {
            prevCallback(detail);
          } catch {
            // Nuốt lỗi
          }
        }
        this.track('save_uploaded', detail);
      };
    }
  }

  public destroy(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isInitialized = false;
  }

  private trackSessionStart(): void {
    let screenRes = 'unknown';
    let lang = 'unknown';
    let ua = 'unknown';

    if (typeof window !== 'undefined') {
      screenRes = `${window.innerWidth}x${window.innerHeight}`;
      lang = navigator.language || 'vi';
      ua = navigator.userAgent || '';
    }

    this.track('session_start', {
      screen: screenRes,
      language: lang,
      userAgent: ua,
      referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
    });
  }

  private handleGameTick(e: Event): void {
    const custom = e as CustomEvent<{ level?: number; galleons?: number }>;
    const detail = custom.detail;
    if (!detail) return;

    this.track('game:tick', {
      level: detail.level,
      galleons: detail.galleons,
    });

    // So sánh kiểm tra level tăng để bắn level_up
    if (typeof detail.level === 'number') {
      if (this.lastLevel !== null && detail.level > this.lastLevel) {
        this.track('level_up', {
          oldLevel: this.lastLevel,
          newLevel: detail.level,
        });
      }
      this.lastLevel = detail.level;
    }
  }

  private generateEventId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
