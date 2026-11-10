import { describe, expect, it } from 'vitest';
import { getActiveLocale, I18N_DICTIONARY, setActiveLocale, t } from '../../data/i18n';
import { MagicalAudio } from '../../engine/audio';
import {
  createRollbackSaveBackup,
  ProductionTelemetryCollector,
  restoreRollbackSaveBackup,
  SlidingWindowRateLimiter,
  validateCloudSaveSchema,
} from '../../ui/productionShip';
import { ParkSimulation } from '../simulation';

describe('P5 — Production & Ship (i18n, Cloud Schema & Rate Limit, Rollback Backup & Telemetry Health)', () => {
  it('translates UI strings across Vietnamese (vi) and English (en) with parameter interpolation', () => {
    setActiveLocale('vi');
    expect(getActiveLocale()).toBe('vi');
    expect(t('hud.level', { level: 12 })).toBe('Cấp 12');
    expect(t('hud.stars', { count: 45 })).toBe('45 Sao Phép');

    setActiveLocale('en');
    expect(getActiveLocale()).toBe('en');
    expect(t('hud.level', { level: 12 })).toBe('Level 12');
    expect(t('minigame.match3')).toBe('Honeydukes Harvest Loft');

    // Every Vietnamese key has a matching English key
    expect(Object.keys(I18N_DICTIONARY.en)).toEqual(Object.keys(I18N_DICTIONARY.vi));
    setActiveLocale('vi');
  });

  it('enforces sliding-window rate limits and validates cloud save schemas', () => {
    const limiter = new SlidingWindowRateLimiter(3, 10_000);
    expect(limiter.check('user_1', 1000).allowed).toBe(true);
    expect(limiter.check('user_1', 2000).allowed).toBe(true);
    expect(limiter.check('user_1', 3000).allowed).toBe(true);
    const blocked = limiter.check('user_1', 4000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(5000);

    // After window expires, allowed again
    expect(limiter.check('user_1', 12000).allowed).toBe(true);

    expect(validateCloudSaveSchema({ version: 12, level: 25, galleons: 500, buildings: [] }).valid).toBe(true);
    expect(validateCloudSaveSchema({ version: 0 }).valid).toBe(false);
    expect(validateCloudSaveSchema({ version: 12, level: 999 }).valid).toBe(false);
    expect(validateCloudSaveSchema({ version: 12, galleons: -10 }).valid).toBe(false);
  });

  it('creates and restores rollback save backups and tracks FPS/crash-free telemetry + offline recovery', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.parkName = 'Hang Sóc Trước Khi Đồng Bộ';
    sim.state.galleons = 777;

    const memStore = new Map<string, string>();
    const storageMock = {
      setItem: (k: string, v: string) => memStore.set(k, v),
      getItem: (k: string) => memStore.get(k) ?? null,
    };

    createRollbackSaveBackup(sim.state, storageMock);
    const restored = restoreRollbackSaveBackup(storageMock);
    expect(restored.ok).toBe(true);
    expect(restored.state?.parkName).toBe('Hang Sóc Trước Khi Đồng Bộ');
    expect(restored.state?.galleons).toBe(777);

    const telemetry = new ProductionTelemetryCollector();
    for (let i = 0; i < 20; i++) {
      telemetry.recordFrameFps(i === 0 ? 45 : 60);
    }
    telemetry.recordAssetLoadLatency(312);
    telemetry.enqueueOfflineEvent('save_queued', { slot: 'slot_1' }, 1000);
    telemetry.enqueueOfflineEvent('trial_win', { mode: 'chess' }, 2000);

    const reportBefore = telemetry.getHealthReport();
    expect(reportBefore.sessionCrashFree).toBe(true);
    expect(reportBefore.avgFps).toBeGreaterThan(55);
    expect(reportBefore.p5LowFps).toBe(45);
    expect(reportBefore.assetLoadLatencyMs).toBe(312);
    expect(reportBefore.pendingOfflineEvents).toBe(2);

    let flushedCount = 0;
    const flushed = telemetry.flushOfflineQueue((batch) => {
      flushedCount = batch.length;
      return true;
    });
    expect(flushed).toBe(2);
    expect(flushedCount).toBe(2);
    expect(telemetry.getHealthReport().pendingOfflineEvents).toBe(0);
  });
});
