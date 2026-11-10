import { describe, expect, it } from 'vitest';
import {
  DAYS_PER_SEASON,
  MAX_PARTICLE_POOL_SLOTS,
  ParticlePoolManager,
  PresentationCeilingController,
  resolveAtmosphereColorGradeLut,
  resolveSeasonFromDayCount,
  SEASON_PROFILES,
  WET_SURFACE_LINGER_MS,
} from '../presentationCeiling';

describe('P1 — Presentation Ceiling (Canvas 2D)', () => {
  it('resolves 4 seasons deterministically from dayCount with override support', () => {
    expect(DAYS_PER_SEASON).toBe(15);
    expect(resolveSeasonFromDayCount(1).id).toBe('spring');
    expect(resolveSeasonFromDayCount(15).id).toBe('spring');
    expect(resolveSeasonFromDayCount(16).id).toBe('summer');
    expect(resolveSeasonFromDayCount(31).id).toBe('autumn');
    expect(resolveSeasonFromDayCount(46).id).toBe('winter');
    expect(resolveSeasonFromDayCount(61).id).toBe('spring');
    expect(resolveSeasonFromDayCount(3, 'winter').id).toBe('winter');

    expect(SEASON_PROFILES.spring.ambientParticleKind).toBe('harvest_sparkle');
    expect(SEASON_PROFILES.summer.ambientParticleKind).toBe('night_firefly');
    expect(SEASON_PROFILES.autumn.ambientParticleKind).toBe('autumn_leaf');
    expect(SEASON_PROFILES.winter.ambientParticleKind).toBe('snow_flake');
  });

  it('reuses fixed particle pool slots without exceeding capacity or leaking', () => {
    const pool = new ParticlePoolManager(40);
    expect(pool.capacity).toBe(40);
    expect(pool.getActiveCount()).toBe(0);

    // Spawn 100 particles into a 40-slot pool — must cap at 40
    for (let i = 0; i < 10; i++) {
      pool.spawnBurst('harvest_sparkle', 200, 200, 10, false);
    }
    expect(pool.getActiveCount()).toBeLessThanOrEqual(40);
    expect(MAX_PARTICLE_POOL_SLOTS).toBe(320);

    // Advance with huge dt (simulating background tab resume) — dt must clamp to <= 0.05s
    const beforeCount = pool.getActiveCount();
    pool.tick(10.0, 800, 600, { ambientKind: 'harvest_sparkle' });
    expect(pool.getActiveCount()).toBeLessThanOrEqual(beforeCount);

    // Advance enough steps to expire burst particles
    for (let step = 0; step < 60; step++) {
      pool.tick(0.05, 800, 600, { ambientKind: 'autumn_leaf' });
    }
    expect(pool.getActiveCount()).toBeLessThanOrEqual(40);
  });

  it('culls off-screen particles and respects reducedMotion & tabHidden', () => {
    const pool = new ParticlePoolManager(32);
    // Spawn far outside viewport
    pool.spawnBurst('autumn_leaf', -500, -500, 4, false);
    expect(pool.getActiveCount()).toBe(4);
    pool.tick(0.03, 800, 600, { ambientKind: 'autumn_leaf' });
    // Off-screen particles are immediately culled
    expect(pool.getActiveCount()).toBe(0);

    // reducedMotion = true clears active slots and skips spawnBurst
    pool.spawnBurst('harvest_sparkle', 200, 200, 6, false);
    expect(pool.getActiveCount()).toBe(6);
    pool.tick(0.03, 800, 600, { reducedMotion: true });
    expect(pool.getActiveCount()).toBe(0);

    pool.spawnBurst('harvest_sparkle', 100, 100, 8, true);
    expect(pool.getActiveCount()).toBe(0);

    // tabHidden pauses particle updates without clearing
    pool.spawnBurst('water_splash', 200, 200, 4, false);
    const prevX = pool.slots[0].x;
    pool.tick(0.05, 800, 600, { tabHidden: true });
    expect(pool.slots[0].x).toBe(prevX);
  });

  it('tracks wet surface shimmer during rain/storm and lingers after rain stops', () => {
    const ctrl = new PresentationCeilingController();
    expect(ctrl.getWetSurfaceStrength(1000, 'sunny')).toBe(0);
    expect(ctrl.getWetSurfaceStrength(2000, 'rain')).toBeCloseTo(0.65);
    expect(ctrl.getWetSurfaceStrength(3000, 'storm')).toBeCloseTo(0.85);

    // 10 seconds after storm ends -> still wet (> 0.4)
    const linger10s = ctrl.getWetSurfaceStrength(13000, 'sunny');
    expect(linger10s).toBeGreaterThan(0.4);

    // After WET_SURFACE_LINGER_MS -> completely dry (0)
    expect(ctrl.getWetSurfaceStrength(3000 + WET_SURFACE_LINGER_MS + 100, 'sunny')).toBe(0);
  });

  it('computes atmosphere color-grading LUT across timeOfDay, weather, and season', () => {
    const duskAutumn = resolveAtmosphereColorGradeLut('dusk', 'sunny', 'autumn');
    expect(duskAutumn.depthFogHeightRatio).toBeGreaterThan(0.2);

    const stormLut = resolveAtmosphereColorGradeLut('day', 'storm', 'summer');
    const sunnyLut = resolveAtmosphereColorGradeLut('day', 'sunny', 'summer');
    expect(stormLut.depthFogHeightRatio).toBeGreaterThan(sunnyLut.depthFogHeightRatio);
  });
});
