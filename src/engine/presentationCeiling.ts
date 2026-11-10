// P1 — Presentation Ceiling Canvas 2D:
// 1. Pooled Particle Manager (7 loại hạt, 0 cấp phát mỗi frame, culling, delta-time clamp, reduced-motion guard)
// 2. Chu kỳ 4 Mùa (60 ngày = 4 × 15 ngày: Xuân / Hạ / Thu / Đông) + bảng màu lá & thiên hướng thời tiết
// 3. Parallax 3 lớp (Bầu trời & Đỉnh núi xa / Đồi sương thung lũng / Cỏ tiền cảnh)
// 4. Ánh sáng cửa sổ/đèn lồng động ban đêm + Bề mặt ướt phản chiếu sau mưa
// 5. Sương mù chiều sâu isometric (Depth Fog), LUT màu theo thời tiết, Event Bloom, Film Grain & Chromatic Aberration

import { getCatalogItem } from '../data/catalog';
import type { ParkSimulation } from '../sim/simulation';
import { WeatherKind } from '../types/game';
import { Camera, ELEV_PX, gridToScreen } from './isometric';

export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';

export type PooledParticleKind =
  | 'harvest_sparkle'
  | 'water_splash'
  | 'autumn_leaf'
  | 'snow_flake'
  | 'footstep_dust'
  | 'festival_lantern'
  | 'night_firefly';

export interface SeasonProfile {
  id: SeasonId;
  nameVi: string;
  emoji: string;
  dayInSeason: number;
  daysPerSeason: number;
  dayProgress: number;
  foliageTint: string;
  grassDayTint: string;
  grassNightTint: string;
  ambientParticleKind: PooledParticleKind;
  cropSpeedMultiplier: number;
  weatherBias: Record<WeatherKind, number>;
}

export const DAYS_PER_SEASON = 15;
export const YEAR_CYCLE_DAYS = DAYS_PER_SEASON * 4;
export const MAX_PARTICLE_POOL_SLOTS = 320;
export const WET_SURFACE_LINGER_MS = 90_000;

export const SEASON_PROFILES: Record<SeasonId, Omit<SeasonProfile, 'dayInSeason' | 'daysPerSeason' | 'dayProgress'>> = {
  spring: {
    id: 'spring',
    nameVi: 'Mùa Xuân Lộc Biếc',
    emoji: '🌸',
    foliageTint: 'rgba(244, 114, 182, 0.14)',
    grassDayTint: 'rgba(134, 239, 172, 0.08)',
    grassNightTint: 'rgba(45, 212, 191, 0.08)',
    ambientParticleKind: 'harvest_sparkle',
    cropSpeedMultiplier: 1.1,
    weatherBias: {
      sunny: 0.44,
      cloudy: 0.22,
      rain: 0.22,
      storm: 0.05,
      snow: 0.0,
      fog: 0.07,
    },
  },
  summer: {
    id: 'summer',
    nameVi: 'Mùa Hạ Nắng Mật',
    emoji: '🌻',
    foliageTint: 'rgba(250, 204, 21, 0.12)',
    grassDayTint: 'rgba(253, 224, 71, 0.09)',
    grassNightTint: 'rgba(56, 189, 248, 0.08)',
    ambientParticleKind: 'night_firefly',
    cropSpeedMultiplier: 1.15,
    weatherBias: {
      sunny: 0.61,
      cloudy: 0.16,
      rain: 0.12,
      storm: 0.08,
      snow: 0.0,
      fog: 0.03,
    },
  },
  autumn: {
    id: 'autumn',
    nameVi: 'Mùa Thu Lá Phong',
    emoji: '🍁',
    foliageTint: 'rgba(249, 115, 22, 0.18)',
    grassDayTint: 'rgba(251, 191, 36, 0.11)',
    grassNightTint: 'rgba(217, 119, 6, 0.08)',
    ambientParticleKind: 'autumn_leaf',
    cropSpeedMultiplier: 1.2,
    weatherBias: {
      sunny: 0.38,
      cloudy: 0.24,
      rain: 0.18,
      storm: 0.07,
      snow: 0.02,
      fog: 0.11,
    },
  },
  winter: {
    id: 'winter',
    nameVi: 'Mùa Đông Tuyết Ấm',
    emoji: '❄️',
    foliageTint: 'rgba(186, 230, 253, 0.22)',
    grassDayTint: 'rgba(224, 242, 254, 0.15)',
    grassNightTint: 'rgba(125, 211, 252, 0.12)',
    ambientParticleKind: 'snow_flake',
    cropSpeedMultiplier: 1.0,
    weatherBias: {
      sunny: 0.28,
      cloudy: 0.22,
      rain: 0.06,
      storm: 0.06,
      snow: 0.28,
      fog: 0.10,
    },
  },
};

export function resolveSeasonFromDayCount(
  dayCount: number,
  overrideSeason?: SeasonId | 'auto'
): SeasonProfile {
  const safeDay = Math.max(1, Math.floor(Number.isFinite(dayCount) ? dayCount : 1));
  const zeroIdx = (safeDay - 1) % YEAR_CYCLE_DAYS;
  const seasonOrder: SeasonId[] = ['spring', 'summer', 'autumn', 'winter'];
  const computedId = seasonOrder[Math.floor(zeroIdx / DAYS_PER_SEASON) % 4];
  const activeId =
    overrideSeason && overrideSeason !== 'auto' && overrideSeason in SEASON_PROFILES
      ? overrideSeason
      : computedId;
  const dayInSeason = (zeroIdx % DAYS_PER_SEASON) + 1;
  const base = SEASON_PROFILES[activeId];
  return {
    ...base,
    dayInSeason,
    daysPerSeason: DAYS_PER_SEASON,
    dayProgress: Number(((dayInSeason - 1) / DAYS_PER_SEASON).toFixed(3)),
  };
}

export interface PooledParticleSlot {
  active: boolean;
  kind: PooledParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  maxAge: number;
  rotation: number;
  vRot: number;
  color: string;
  alpha: number;
}

const PARTICLE_DEFAULT_COLORS: Record<PooledParticleKind, readonly string[]> = {
  harvest_sparkle: ['#fde047', '#facc15', '#fef08a', '#fb923c'],
  water_splash: ['#7dd3fc', '#38bdf8', '#bae6fd', '#e0f2fe'],
  autumn_leaf: ['#f97316', '#ea580c', '#f59e0b', '#dc2626'],
  snow_flake: ['#f8fafc', '#e0f2fe', '#bae6fd'],
  footstep_dust: ['#d6d3d1', '#e7e5e4', '#a8a29e'],
  festival_lantern: ['#fbbf24', '#f59e0b', '#fde68a'],
  night_firefly: ['#bef264', '#fde047', '#a3e635'],
};

export class ParticlePoolManager {
  public readonly capacity: number;
  public readonly slots: PooledParticleSlot[];
  private cursor = 0;
  private ambientSpawnAcc = 0;

  constructor(capacity = MAX_PARTICLE_POOL_SLOTS) {
    this.capacity = Math.max(16, Math.min(MAX_PARTICLE_POOL_SLOTS, Math.floor(capacity)));
    this.slots = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.slots[i] = {
        active: false,
        kind: 'harvest_sparkle',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 3,
        age: 0,
        maxAge: 1,
        rotation: 0,
        vRot: 0,
        color: '#fde047',
        alpha: 1,
      };
    }
  }

  public getActiveCount(): number {
    let count = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.slots[i].active) count++;
    }
    return count;
  }

  public clearAll(): void {
    for (let i = 0; i < this.capacity; i++) {
      this.slots[i].active = false;
    }
  }

  private acquireSlot(): PooledParticleSlot {
    for (let i = 0; i < this.capacity; i++) {
      const idx = (this.cursor + i) % this.capacity;
      if (!this.slots[idx].active) {
        this.cursor = (idx + 1) % this.capacity;
        return this.slots[idx];
      }
    }
    const fallback = this.slots[this.cursor];
    this.cursor = (this.cursor + 1) % this.capacity;
    return fallback;
  }

  public spawnBurst(
    kind: PooledParticleKind,
    x: number,
    y: number,
    count = 8,
    reducedMotion = false
  ): number {
    if (reducedMotion || count <= 0) return 0;
    const safeCount = Math.min(32, Math.max(1, Math.floor(count)));
    const palette = PARTICLE_DEFAULT_COLORS[kind];
    for (let i = 0; i < safeCount; i++) {
      const slot = this.acquireSlot();
      const angle = (Math.PI * 2 * i) / safeCount + (Math.random() - 0.5) * 0.45;
      const speed =
        kind === 'water_splash'
          ? 38 + Math.random() * 52
          : kind === 'harvest_sparkle'
            ? 28 + Math.random() * 64
            : kind === 'footstep_dust'
              ? 10 + Math.random() * 18
              : 14 + Math.random() * 26;
      slot.active = true;
      slot.kind = kind;
      slot.x = x + (Math.random() - 0.5) * 10;
      slot.y = y + (Math.random() - 0.5) * 10;
      slot.vx = Math.cos(angle) * speed;
      slot.vy =
        kind === 'festival_lantern'
          ? -22 - Math.random() * 18
          : kind === 'autumn_leaf' || kind === 'snow_flake'
            ? 18 + Math.random() * 24
            : Math.sin(angle) * speed - (kind === 'harvest_sparkle' || kind === 'water_splash' ? 26 : 6);
      slot.size =
        kind === 'festival_lantern'
          ? 5.5 + Math.random() * 3
          : kind === 'autumn_leaf'
            ? 4.2 + Math.random() * 2.8
            : 2.5 + Math.random() * 2.8;
      slot.age = 0;
      slot.maxAge =
        kind === 'footstep_dust'
          ? 0.45 + Math.random() * 0.25
          : kind === 'water_splash' || kind === 'harvest_sparkle'
            ? 0.65 + Math.random() * 0.45
            : 2.2 + Math.random() * 1.4;
      slot.rotation = Math.random() * Math.PI * 2;
      slot.vRot = (Math.random() - 0.5) * 3.2;
      slot.color = palette[i % palette.length];
      slot.alpha = 1;
    }
    return safeCount;
  }

  public tick(
    rawDt: number,
    viewW: number,
    viewH: number,
    opts: {
      reducedMotion?: boolean;
      tabHidden?: boolean;
      ambientKind?: PooledParticleKind;
      isNightLike?: boolean;
      festivalActive?: boolean;
    } = {}
  ): void {
    if (opts.reducedMotion || opts.tabHidden) {
      if (opts.reducedMotion) this.clearAll();
      return;
    }
    const dt = Math.min(0.05, Math.max(0, Number.isFinite(rawDt) ? rawDt : 1 / 60));
    if (dt <= 0) return;

    this.ambientSpawnAcc += dt;
    if (this.ambientSpawnAcc >= 0.35 && this.getActiveCount() < this.capacity - 16) {
      this.ambientSpawnAcc = 0;
      const ambKind: PooledParticleKind = opts.festivalActive
        ? 'festival_lantern'
        : opts.isNightLike
          ? 'night_firefly'
          : opts.ambientKind ?? 'autumn_leaf';
      const sx = Math.random() * Math.max(320, viewW);
      const sy =
        ambKind === 'festival_lantern'
          ? Math.max(240, viewH) - 18
          : ambKind === 'night_firefly'
            ? Math.random() * Math.max(240, viewH)
            : 12;
      this.spawnBurst(ambKind, sx, sy, 1, false);
    }

    const margin = 80;
    for (let i = 0; i < this.capacity; i++) {
      const s = this.slots[i];
      if (!s.active) continue;
      s.age += dt;
      if (s.age >= s.maxAge) {
        s.active = false;
        continue;
      }
      if (s.kind === 'water_splash' || s.kind === 'harvest_sparkle') {
        s.vy += 88 * dt;
      } else if (s.kind === 'autumn_leaf') {
        s.vx += Math.sin(s.age * 4 + i) * 14 * dt;
      } else if (s.kind === 'night_firefly') {
        s.vx += Math.cos(s.age * 3 + i) * 10 * dt;
        s.vy += Math.sin(s.age * 2.5 + i) * 8 * dt;
      }
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.rotation += s.vRot * dt;
      const lifeRatio = s.age / s.maxAge;
      s.alpha = lifeRatio < 0.15 ? lifeRatio / 0.15 : Math.max(0, 1 - (lifeRatio - 0.15) / 0.85);

      if (
        s.x < -margin ||
        s.x > viewW + margin ||
        s.y < -margin ||
        s.y > viewH + margin
      ) {
        s.active = false;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, reducedMotion = false): void {
    if (reducedMotion) return;
    ctx.save();
    for (let i = 0; i < this.capacity; i++) {
      const s = this.slots[i];
      if (!s.active || s.alpha <= 0.02) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, s.alpha);
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.fillStyle = s.color;
      if (s.kind === 'harvest_sparkle') {
        const r = s.size;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.4);
        ctx.lineTo(r * 0.45, -r * 0.45);
        ctx.lineTo(r * 1.4, 0);
        ctx.lineTo(r * 0.45, r * 0.45);
        ctx.lineTo(0, r * 1.4);
        ctx.lineTo(-r * 0.45, r * 0.45);
        ctx.lineTo(-r * 1.4, 0);
        ctx.lineTo(-r * 0.45, -r * 0.45);
        ctx.closePath();
        ctx.fill();
      } else if (s.kind === 'autumn_leaf') {
        ctx.beginPath();
        ctx.ellipse(0, 0, s.size * 1.25, s.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (s.kind === 'festival_lantern') {
        ctx.fillRect(-s.size * 0.6, -s.size * 0.85, s.size * 1.2, s.size * 1.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }
}

export interface AtmosphereColorGradeLut {
  tintColor: string;
  depthFogTopColor: string;
  depthFogHeightRatio: number;
}

export function resolveAtmosphereColorGradeLut(
  period: 'dawn' | 'day' | 'dusk' | 'night',
  weatherKind: WeatherKind,
  seasonId: SeasonId
): AtmosphereColorGradeLut {
  if (weatherKind === 'storm') {
    return {
      tintColor: 'rgba(15, 23, 42, 0.16)',
      depthFogTopColor: 'rgba(30, 41, 59, 0.28)',
      depthFogHeightRatio: 0.26,
    };
  }
  if (weatherKind === 'snow' || seasonId === 'winter') {
    return {
      tintColor: isNightPeriod(period) ? 'rgba(30, 58, 138, 0.14)' : 'rgba(224, 242, 254, 0.10)',
      depthFogTopColor: 'rgba(226, 232, 240, 0.24)',
      depthFogHeightRatio: 0.24,
    };
  }
  if (period === 'dawn') {
    return {
      tintColor: 'rgba(251, 146, 60, 0.08)',
      depthFogTopColor: 'rgba(254, 215, 170, 0.22)',
      depthFogHeightRatio: 0.22,
    };
  }
  if (period === 'dusk') {
    return {
      tintColor: 'rgba(217, 119, 6, 0.10)',
      depthFogTopColor: 'rgba(124, 45, 18, 0.20)',
      depthFogHeightRatio: 0.22,
    };
  }
  if (period === 'night') {
    return {
      tintColor: 'rgba(15, 23, 42, 0.14)',
      depthFogTopColor: 'rgba(15, 23, 42, 0.26)',
      depthFogHeightRatio: 0.24,
    };
  }
  return {
    tintColor: SEASON_PROFILES[seasonId].grassDayTint,
    depthFogTopColor: 'rgba(254, 249, 195, 0.16)',
    depthFogHeightRatio: 0.18,
  };
}

function isNightPeriod(period: 'dawn' | 'day' | 'dusk' | 'night'): boolean {
  return period === 'night' || period === 'dusk';
}

export class PresentationCeilingController {
  public readonly particlePool = new ParticlePoolManager(MAX_PARTICLE_POOL_SLOTS);
  public lastWetWeatherAt = 0;
  public seasonOverride: SeasonId | 'auto' = 'auto';
  private lastTickMs = 0;

  public getWetSurfaceStrength(now: number, currentWeather: WeatherKind): number {
    if (currentWeather === 'rain' || currentWeather === 'storm') {
      this.lastWetWeatherAt = now;
      return currentWeather === 'storm' ? 0.85 : 0.65;
    }
    if (this.lastWetWeatherAt <= 0) return 0;
    const elapsed = now - this.lastWetWeatherAt;
    if (elapsed <= 0 || elapsed >= WET_SURFACE_LINGER_MS) return 0;
    return Number((0.55 * (1 - elapsed / WET_SURFACE_LINGER_MS)).toFixed(3));
  }

  public drawParallaxHorizonLayer(
    ctx: CanvasRenderingContext2D,
    cam: Camera,
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    season: SeasonProfile
  ): void {
    const horizonY = Math.min(220, viewH * 0.28);
    const shiftFar = ((cam.x * 0.08) % 240 + 240) % 240;
    const shiftMid = ((cam.x * 0.18) % 320 + 320) % 320;

    ctx.save();
    // Layer 1: Distant Scottish Highland / Valley Silhouette
    ctx.fillStyle =
      period === 'night'
        ? 'rgba(15, 23, 42, 0.28)'
        : period === 'dusk'
          ? 'rgba(67, 20, 7, 0.20)'
          : 'rgba(51, 65, 85, 0.12)';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = -240; x <= viewW + 240; x += 120) {
      const px = x - shiftFar;
      const peakH = 26 + ((Math.abs(Math.floor(x / 120)) * 37) % 28);
      ctx.quadraticCurveTo(px + 60, horizonY - peakH, px + 120, horizonY);
    }
    ctx.lineTo(viewW, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Layer 2: Mid-distance Ottery Valley rolling hills + seasonal foliage tint
    ctx.fillStyle = season.foliageTint;
    ctx.beginPath();
    ctx.moveTo(0, horizonY + 18);
    for (let x = -320; x <= viewW + 320; x += 160) {
      const px = x - shiftMid;
      ctx.quadraticCurveTo(px + 80, horizonY - 12, px + 160, horizonY + 18);
    }
    ctx.lineTo(viewW, horizonY + 34);
    ctx.lineTo(0, horizonY + 34);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  public drawDynamicNightAndWetPass(
    ctx: CanvasRenderingContext2D,
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weatherKind: WeatherKind
  ): void {
    const wetStrength = this.getWetSurfaceStrength(now, weatherKind);
    const isNight = period === 'night' || period === 'dusk';
    if (wetStrength <= 0 && !isNight) return;

    ctx.save();
    if (wetStrength > 0) {
      const sheen = ctx.createLinearGradient(0, 0, viewW, viewH);
      sheen.addColorStop(0, `rgba(186, 230, 253, ${(wetStrength * 0.06).toFixed(3)})`);
      sheen.addColorStop(0.5, `rgba(224, 242, 254, ${(wetStrength * 0.11).toFixed(3)})`);
      sheen.addColorStop(1, `rgba(56, 189, 248, ${(wetStrength * 0.05).toFixed(3)})`);
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, viewW, viewH);
    }

    if (isNight) {
      ctx.globalCompositeOperation = 'screen';
      const maxLights = 24;
      let drawn = 0;
      for (const b of sim.state.buildings) {
        if (drawn >= maxLights) break;
        if (now < b.constructEndsAt) continue;
        const item = getCatalogItem(b.itemId);
        if (!item || item.isFarmlandPlot || item.isAnimalPasturePlot || item.category === 'path') {
          continue;
        }
        const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
        const pt = gridToScreen(b.gx + 0.5, b.gy + 0.5, cam, viewW, viewH, elev * ELEV_PX + 28);
        if (pt.sx < -80 || pt.sx > viewW + 80 || pt.sy < -80 || pt.sy > viewH + 80) continue;
        const radius = Math.max(24, 46 * cam.zoom);
        const grad = ctx.createRadialGradient(pt.sx, pt.sy, 2, pt.sx, pt.sy, radius);
        grad.addColorStop(0, 'rgba(253, 224, 71, 0.26)');
        grad.addColorStop(0.55, 'rgba(251, 146, 60, 0.11)');
        grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, radius, 0, Math.PI * 2);
        ctx.fill();
        drawn++;
      }
    }
    ctx.restore();
  }

  public drawPostFxAndForegroundCeiling(
    ctx: CanvasRenderingContext2D,
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weatherKind: WeatherKind,
    festivalActive: boolean,
    reducedMotion: boolean,
    shakeMagnitude = 0
  ): void {
    const dt = this.lastTickMs > 0 ? (now - this.lastTickMs) / 1000 : 1 / 60;
    this.lastTickMs = now;
    const season = resolveSeasonFromDayCount(sim.state.level ?? 1, this.seasonOverride);
    const tabHidden = typeof document !== 'undefined' && Boolean(document.hidden);

    this.particlePool.tick(dt, viewW, viewH, {
      reducedMotion,
      tabHidden,
      ambientKind: season.ambientParticleKind,
      isNightLike: period === 'night' || period === 'dusk',
      festivalActive,
    });
    this.particlePool.render(ctx, reducedMotion);

    // Depth Fog + Weather/Season LUT
    const lut = resolveAtmosphereColorGradeLut(period, weatherKind, season.id);
    ctx.save();
    const fogH = Math.max(48, viewH * lut.depthFogHeightRatio);
    const fogGrad = ctx.createLinearGradient(0, 0, 0, fogH);
    fogGrad.addColorStop(0, lut.depthFogTopColor);
    fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, viewW, fogH);

    ctx.fillStyle = lut.tintColor;
    ctx.fillRect(0, 0, viewW, viewH);

    // Layer 3: Foreground soft grass silhouette along bottom viewport edge (1.15x parallax)
    const fgShift = ((cam.x * 1.15) % 180 + 180) % 180;
    ctx.fillStyle =
      period === 'night' ? 'rgba(6, 78, 59, 0.16)' : 'rgba(22, 101, 52, 0.10)';
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    for (let x = -180; x <= viewW + 180; x += 90) {
      const gx = x - fgShift;
      ctx.quadraticCurveTo(gx + 45, viewH - 14, gx + 90, viewH);
    }
    ctx.closePath();
    ctx.fill();

    // Bounded impact chromatic aberration fringe when screen shake > 3.5px (skipped on reducedMotion)
    if (!reducedMotion && shakeMagnitude > 3.5) {
      const shiftPx = Math.min(3, (shakeMagnitude - 3.5) * 0.45);
      ctx.strokeStyle = `rgba(244, 63, 94, ${(0.14 * (shiftPx / 3)).toFixed(3)})`;
      ctx.lineWidth = shiftPx * 2;
      ctx.strokeRect(shiftPx, shiftPx, viewW - shiftPx * 2, viewH - shiftPx * 2);
    }
    ctx.restore();
  }
}
