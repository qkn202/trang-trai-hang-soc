// P5 — Production & Ship:
// 1. SlidingWindowRateLimiter (chống spam /api/save & /api/track theo userId/IP)
// 2. Cloud Save Schema Validator & Rollback Backup Snapshot (khôi phục an toàn nếu cloud save lỗi)
// 3. ProductionTelemetryCollector (Crash-free session, FPS avg/p5, Asset-load latency, Offline Recovery Queue)

import { GameState } from '../types/game';

export class SlidingWindowRateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly hits = new Map<string, number[]>();

  constructor(maxRequests = 30, windowMs = 60_000) {
    this.maxRequests = Math.max(1, maxRequests);
    this.windowMs = Math.max(1000, windowMs);
  }

  public check(key: string, now = Date.now()): {
    allowed: boolean;
    remaining: number;
    retryAfterMs: number;
  } {
    const cleanKey = (key || 'anon').slice(0, 64);
    const cutoff = now - this.windowMs;
    const prev = this.hits.get(cleanKey) ?? [];
    const active = prev.filter((ts) => ts > cutoff);

    if (active.length >= this.maxRequests) {
      const oldest = active[0] ?? now;
      const retryAfterMs = Math.max(0, oldest + this.windowMs - now);
      this.hits.set(cleanKey, active);
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs,
      };
    }

    active.push(now);
    this.hits.set(cleanKey, active);
    return {
      allowed: true,
      remaining: Math.max(0, this.maxRequests - active.length),
      retryAfterMs: 0,
    };
  }
}

export interface SaveSchemaValidationResult {
  valid: boolean;
  reason?: string;
  sanitizedVersion?: number;
}

export function validateCloudSaveSchema(payload: unknown): SaveSchemaValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, reason: 'not_an_object' };
  }
  const obj = payload as Record<string, unknown>;
  if (typeof obj.version !== 'number' || !Number.isFinite(obj.version) || obj.version <= 0) {
    return { valid: false, reason: 'invalid_version' };
  }
  if (obj.level !== undefined) {
    const lvl = Number(obj.level);
    if (!Number.isFinite(lvl) || lvl < 1 || lvl > 100) {
      return { valid: false, reason: 'invalid_level_bounds' };
    }
  }
  if (obj.galleons !== undefined) {
    const gal = Number(obj.galleons);
    if (!Number.isFinite(gal) || gal < 0) {
      return { valid: false, reason: 'negative_galleons' };
    }
  }
  if (obj.buildings !== undefined) {
    if (!Array.isArray(obj.buildings) || obj.buildings.length > 600) {
      return { valid: false, reason: 'invalid_buildings_array' };
    }
  }
  return {
    valid: true,
    sanitizedVersion: Math.floor(obj.version),
  };
}

const ROLLBACK_BACKUP_KEY = 'burrow_rollback_backup_v12';

export function createRollbackSaveBackup(
  state: GameState,
  storage?: Pick<Storage, 'setItem'>
): string {
  const snapshot = JSON.stringify({
    backedUpAt: Date.now(),
    state,
  });
  const target = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
  try {
    target?.setItem(ROLLBACK_BACKUP_KEY, snapshot);
  } catch {
    // Quota guard
  }
  return snapshot;
}

export function restoreRollbackSaveBackup(
  storage?: Pick<Storage, 'getItem'>
): { ok: boolean; backedUpAt?: number; state?: GameState } {
  const target = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
  const raw = target?.getItem(ROLLBACK_BACKUP_KEY);
  if (!raw) return { ok: false };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.state) {
      return { ok: false };
    }
    return {
      ok: true,
      backedUpAt: Number(parsed.backedUpAt) || 0,
      state: parsed.state as GameState,
    };
  } catch {
    return { ok: false };
  }
}

export interface TelemetryHealthReport {
  sessionCrashFree: boolean;
  unhandledErrorCount: number;
  avgFps: number;
  p5LowFps: number;
  assetLoadLatencyMs: number;
  pendingOfflineEvents: number;
}

export class ProductionTelemetryCollector {
  private unhandledErrors = 0;
  private fpsSamples: number[] = [];
  private assetLoadLatencyMs = 0;
  private offlineQueue: Array<{ event: string; props: Record<string, unknown>; queuedAt: number }> = [];

  public recordFrameFps(fps: number): void {
    if (!Number.isFinite(fps) || fps <= 0) return;
    const clamped = Math.max(1, Math.min(240, fps));
    this.fpsSamples.push(clamped);
    if (this.fpsSamples.length > 120) {
      this.fpsSamples.shift();
    }
  }

  public recordAssetLoadLatency(ms: number): void {
    if (!Number.isFinite(ms) || ms < 0) return;
    this.assetLoadLatencyMs = Math.round(ms);
  }

  public recordUnhandledError(): void {
    this.unhandledErrors++;
  }

  public enqueueOfflineEvent(event: string, props: Record<string, unknown> = {}, now = Date.now()): void {
    if (this.offlineQueue.length >= 100) {
      this.offlineQueue.shift();
    }
    this.offlineQueue.push({ event, props, queuedAt: now });
  }

  public flushOfflineQueue(
    sender: (batch: Array<{ event: string; props: Record<string, unknown>; queuedAt: number }>) => boolean
  ): number {
    if (this.offlineQueue.length === 0) return 0;
    const copy = [...this.offlineQueue];
    const ok = sender(copy);
    if (ok) {
      this.offlineQueue = [];
      return copy.length;
    }
    return 0;
  }

  public getHealthReport(): TelemetryHealthReport {
    const count = this.fpsSamples.length;
    let avgFps = 60;
    let p5LowFps = 60;
    if (count > 0) {
      const sum = this.fpsSamples.reduce((a, b) => a + b, 0);
      avgFps = Number((sum / count).toFixed(1));
      const sorted = [...this.fpsSamples].sort((a, b) => a - b);
      const p5Idx = Math.max(0, Math.floor((count - 1) * 0.05));
      p5LowFps = Number(sorted[p5Idx].toFixed(1));
    }
    return {
      sessionCrashFree: this.unhandledErrors === 0,
      unhandledErrorCount: this.unhandledErrors,
      avgFps,
      p5LowFps,
      assetLoadLatencyMs: this.assetLoadLatencyMs,
      pendingOfflineEvents: this.offlineQueue.length,
    };
  }
}
