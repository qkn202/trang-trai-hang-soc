// Tách tự động từ src/engine/renderer.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `self` để giữ nguyên state, không đổi hành vi.

import {
  FARM_CROPS,
  FARM_GOODS,
  formatDurationCountdownVi,
  getCatalogItem,
  PASTURE_ANIMALS,
} from '../data/catalog';
import { getZonePuzzleStarCost } from '../data/match3Levels';
import { getZoneById, GRID_SIZE, ZONES } from '../data/zones';
import { sampleCoasterTrainPositions } from '../sim/coaster';
import { getGardenHelpMetaVi, getPresetNoteMeta } from '../sim/neighborSocial';
import type { ParkSimulation } from '../sim/simulation';
import { getBuildingGates } from '../sim/zooAndBackstage';
import {
  CatalogItem,
  ConnectablePlotGroup,
  FarmCropId,
  HeatmapMode,
  HomeOwlLanternMark,
  NeighborGardenHelpKind,
  PastureAnimalId,
  PlacedBuilding,
  TerrainType,
  ValleyVillagerEntity,
  WeatherForecastSlot,
  ZoneDef,
} from '../types/game';
import {
  Camera,
  ELEV_PX,
  getCameraFocusGrid,
  gridToScreen,
  rotatedTileDiamondToScreen,
  rotateGridPoint,
  rotateGridRect,
  TILE_H,
  TILE_W,
} from './isometric';
import { SpriteRegistry } from './spriteLoader';
import { computeWaterShoreLoops, WaterLoop } from './waterOutlines';
import { JuiceFX } from './juiceFx';
import {
  InWorldTimerBadgeInfo,
  InWorldTimerKind,
  JuiceEventKind,
  LockedSceneryProp,
  MAX_WEATHER_PARTICLES,
  ScreenHotspot,
  TERRAIN_PALETTE,
  TopologicalDrawCmd,
  buildLockedSceneryCatalog,
  computeWeatherParticleBudget,
  resolveBuildingInWorldTimerInfo,
  rotTileToWorldTile,
} from "./rendererShared";
import type { IsometricRenderer } from './renderer';

export function entitiesGetCompletionPop(self: IsometricRenderer, 
    uid: string,
    now: number
  ): { scale: number; liftY: number; ring: number } {
    const started = self.completionPopMap.get(uid);
    if (!started) return { scale: 1, liftY: 0, ring: 0 };
    const t = (now - started) / 1300; // 1.3s celebratory reveal
    if (t >= 1 || t < 0) {
      self.completionPopMap.delete(uid);
      return { scale: 1, liftY: 0, ring: 0 };
    }
    // Elastic bounce-in: pop from 0.72 -> 1.13 overshoot -> settle to 1.0
    const spring = Math.sin(t * Math.PI * 2.8) * Math.exp(-t * 3.4);
    const scale = t < 0.11 ? 0.72 + (t / 0.11) * 0.34 : 1 + spring * 0.13;
    const hop = t < 0.36 ? Math.sin((t / 0.36) * Math.PI) * 14 : 0;
    return { scale, liftY: hop, ring: t };
}

export function entitiesDrawCompletionShockwave(self: IsometricRenderer, 
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    ringT: number,
    isNight: boolean
  ): void {
    const ctx = self.ctx;
    const r = Math.max(drawW * 0.44, drawH * 0.5) + ringT * 46 * zoom;
    const alpha = Math.max(0, 1 - ringT) * 0.72;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = isNight ? '#fcd34d' : '#fef08a';
    ctx.lineWidth = Math.max(2.2, 5 * zoom * (1 - ringT));
    ctx.beginPath();
    ctx.ellipse(cx, bottomY, r * 1.38, r * 0.56, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Inner warm gold ripple
    ctx.globalAlpha = alpha * 0.7;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = Math.max(1.2, 2.6 * zoom * (1 - ringT));
    ctx.beginPath();
    ctx.ellipse(cx, bottomY, r * 1.02, r * 0.41, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

export function entitiesDrawCompletionSparkles(self: IsometricRenderer, 
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    ringT: number,
    isNight: boolean
  ): void {
    const ctx = self.ctx;
    const confettiColors = ['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#fb923c', '#fde047'];

    // 1. Fountain of colorful storybook confetti ribbons with gentle gravity & flutter
    const confettiCount = 22;
    ctx.save();
    for (let i = 0; i < confettiCount; i++) {
      const seed = (i * 73 + 19) % 97;
      const launchAngle = -Math.PI * (0.18 + (seed / 97) * 0.64);
      const speed = (36 + (i % 5) * 14) * zoom;
      const vx = Math.cos(launchAngle) * speed * (i % 2 === 0 ? 1 : -0.88);
      const vy = Math.sin(launchAngle) * speed;
      const gravity = 82 * zoom * ringT * ringT;
      const px = cx + vx * ringT * 1.45;
      const py = bottomY - drawH * 0.52 + vy * ringT * 1.4 + gravity;
      const fade = Math.max(0, 1 - Math.max(0, (ringT - 0.25) / 0.75));
      if (fade <= 0.02) continue;

      ctx.save();
      ctx.globalAlpha = fade * 0.94;
      ctx.translate(px, py);
      ctx.rotate(ringT * (5 + (i % 4) * 2) + i);
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      const cw = (4.8 - ringT * 1.2) * zoom;
      const ch = (2.6 - ringT * 0.6) * zoom;
      ctx.fillRect(-cw * 0.5, -ch * 0.5, cw, ch);
      ctx.restore();
    }
    ctx.restore();

    // 2. Twinkling 4-point golden magic stars rising around the roof
    const starCount = 12;
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + 0.4;
      const spread = (0.32 + ((i * 37) % 10) / 13) * drawW * 0.56;
      const rise = ringT * (28 + ((i * 53) % 9) * 5.5) * zoom;
      const px = cx + Math.cos(angle) * spread;
      const py = bottomY - drawH * 0.35 - rise;
      const alpha = Math.max(0, 1 - ringT) * 0.95;
      const r = (3.2 - ringT * 1.5) * zoom;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = i % 3 === 0 ? '#fffbeb' : isNight ? '#fcd34d' : '#fbbf24';
      ctx.beginPath();
      const spikes = 4;
      for (let k = 0; k < spikes * 2; k++) {
        const a = (k / (spikes * 2)) * Math.PI * 2;
        const rad = k % 2 === 0 ? r * 2.25 : r * 0.75;
        const vx = px + Math.cos(a) * rad;
        const vy = py + Math.sin(a) * rad * 0.85;
        if (k === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
}

export function entitiesCollectOwlPostParcel(self: IsometricRenderer): { gx: number; gy: number } | null {
    if (!self.owlParcel) return null;
    const pos = { gx: self.owlParcel.gx, gy: self.owlParcel.gy };
    self.owlCollectBurst = { gx: pos.gx, gy: pos.gy, startedAt: Date.now() };
    self.owlParcel = null;
    self.nextOwlSpawnAt = Date.now() + 52_000;
    self.notifyJuice('harvest');
    return pos;
}

export function entitiesGetSquashScale(self: IsometricRenderer, id: string, now: number): { sx: number; sy: number } {
    const started = self.squashMap.get(id);
    if (!started) return { sx: 1, sy: 1 };
    const t = (now - started) / 380;
    if (t >= 1 || t < 0) {
      self.squashMap.delete(id);
      return { sx: 1, sy: 1 };
    }
    const wave = Math.sin(t * Math.PI * 3.2) * Math.exp(-t * 4.2) * 0.14;
    return { sx: 1 + wave, sy: 1 - wave * 0.88 };
}

export function entitiesGetSunShadowVector(self: IsometricRenderer, period: 'dawn' | 'day' | 'dusk' | 'night'): {
    dx: number;
    dy: number;
    alpha: number;
  } {
    if (period === 'dawn') return { dx: -16, dy: 5, alpha: 0.24 };
    if (period === 'dusk') return { dx: 18, dy: 6, alpha: 0.28 };
    if (period === 'night') return { dx: -9, dy: 4, alpha: 0.22 };
    return { dx: 9, dy: 4, alpha: 0.22 };
}

export function entitiesSortDrawablesTopological(self: IsometricRenderer, items: TopologicalDrawCmd[]): TopologicalDrawCmd[] {
    const n = items.length;
    if (n <= 1) return items;

    const adj: number[][] = Array.from({ length: n }, () => []);
    const inDeg = new Int32Array(n);
    const eps = 0.04;

    for (let i = 0; i < n; i++) {
      const a = items[i];
      const aIsoL = a.rxMin - a.ryMax;
      const aIsoR = a.rxMax - a.ryMin;
      for (let j = i + 1; j < n; j++) {
        const b = items[j];
        const bIsoL = b.rxMin - b.ryMax;
        const bIsoR = b.rxMax - b.ryMin;
        // Skip pair if horizontally disjoint in isometric screen X
        if (aIsoR <= bIsoL + eps || bIsoR <= aIsoL + eps) continue;

        const aBehindB =
          (a.rxMax <= b.rxMin + eps && a.ryMin < b.ryMax - eps) ||
          (a.ryMax <= b.ryMin + eps && a.rxMin < b.rxMax - eps);
        const bBehindA =
          (b.rxMax <= a.rxMin + eps && b.ryMin < a.ryMax - eps) ||
          (b.ryMax <= a.ryMin + eps && b.rxMin < a.rxMax - eps);

        if (aBehindB && !bBehindA) {
          adj[i].push(j);
          inDeg[j]++;
        } else if (bBehindA && !aBehindB) {
          adj[j].push(i);
          inDeg[i]++;
        }
      }
    }

    const ready: number[] = [];
    for (let i = 0; i < n; i++) {
      if (inDeg[i] === 0) ready.push(i);
    }
    ready.sort((u, v) => items[u].depth - items[v].depth);

    const ordered: TopologicalDrawCmd[] = [];
    const emitted = new Uint8Array(n);

    while (ready.length > 0) {
      const cur = ready.shift()!;
      emitted[cur] = 1;
      ordered.push(items[cur]);
      for (const nxt of adj[cur]) {
        inDeg[nxt]--;
        if (inDeg[nxt] === 0) {
          // Binary insert by tie-breaker depth
          const d = items[nxt].depth;
          let lo = 0;
          let hi = ready.length;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (items[ready[mid]].depth <= d) lo = mid + 1;
            else hi = mid;
          }
          ready.splice(lo, 0, nxt);
        }
      }
    }

    if (ordered.length < n) {
      const rest: TopologicalDrawCmd[] = [];
      for (let i = 0; i < n; i++) {
        if (!emitted[i]) rest.push(items[i]);
      }
      rest.sort((a, b) => a.depth - b.depth);
      for (const r of rest) ordered.push(r);
    }
    return ordered;
}

export function entitiesDrawSkyFireworks(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    if (sim.fireworks.length === 0) return;
    const ctx = self.ctx;
    for (const fw of sim.fireworks) {
      if (fw.life < 0) continue;
      const t = fw.life / fw.maxLife;
      const pt = gridToScreen(fw.gx, fw.gy, cam, viewW, viewH, fw.zHeight + t * 28);
      if (pt.sx < -100 || pt.sx > viewW + 100 || pt.sy < -100 || pt.sy > viewH + 100) continue;

      const alpha = Math.max(0, 1 - Math.pow(t, 1.35));
      const radius = (8 + t * 44) * cam.zoom;
      ctx.save();
      ctx.globalAlpha = alpha;
      entitiesDrawRadialGlow(self, pt.sx, pt.sy, radius * 1.15, fw.color);
      ctx.strokeStyle = fw.color;
      ctx.lineWidth = 2.1 * cam.zoom;
      for (let ray = 0; ray < 12; ray++) {
        const ang = (ray * Math.PI * 2) / 12 + t * 0.35;
        const r0 = radius * 0.22;
        const r1 = radius * (ray % 2 === 0 ? 1.0 : 0.68);
        ctx.beginPath();
        ctx.moveTo(pt.sx + Math.cos(ang) * r0, pt.sy + Math.sin(ang) * r0);
        ctx.lineTo(pt.sx + Math.cos(ang) * r1, pt.sy + Math.sin(ang) * r1 + t * 8 * cam.zoom);
        ctx.stroke();
      }
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(pt.sx, pt.sy, 3 * cam.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
}

export function entitiesDrawEscapedCreature(self: IsometricRenderer, id: string, species: string, sx: number, sy: number, zoom: number): void {
    const ctx = self.ctx;
    self.hotspots.push({
      kind: 'escaped',
      id,
      sx,
      sy: sy - 12 * zoom,
      radius: Math.max(22, 26 * zoom),
    });

    const pulse = 16 + Math.sin(self.tick * 0.15) * 4;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(sx, sy - 3 * zoom, pulse * zoom, pulse * 0.55 * zoom, 0, 0, Math.PI * 2);
    ctx.stroke();

    const hop = Math.abs(Math.sin(self.tick * 0.22)) * 6 * zoom;
    const poseOn = !self.reducedMotion && Math.floor(self.tick / 18) % 2 === 1;
    const spKey =
      species === 'dragon'
        ? poseOn
          ? 'beast_dragon_roar'
          : 'beast_dragon'
        : species === 'hippogriff'
          ? poseOn
            ? 'beast_hippogriff_bow'
            : 'beast_hippogriff'
          : species === 'unicorn'
            ? poseOn
              ? 'beast_unicorn_prance'
              : 'beast_unicorn'
            : species === 'thestral'
              ? poseOn
                ? 'beast_thestral_wings'
                : 'beast_thestral'
              : species === 'phoenix'
                ? poseOn
                  ? 'beast_phoenix_soar'
                  : 'beast_phoenix'
                : poseOn
                  ? 'beast_niffler_play'
                  : 'beast_niffler';
    const sp = self.sprites.get(spKey);
    if (sp) {
      const h = 32 * zoom;
      const w = h * (sp.width / sp.height);
      ctx.drawImage(sp, sx - w * 0.5, sy - h - hop, w, h);
    }

    ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#1c130d';
    ctx.lineWidth = 3;
    ctx.strokeText('🐾 Bấm bắt!', sx, sy - 34 * zoom - hop);
    ctx.fillStyle = '#fef08a';
    ctx.fillText('🐾 Bấm bắt!', sx, sy - 34 * zoom - hop);
}

export function entitiesDrawValleyVillager(self: IsometricRenderer, 
    v: ValleyVillagerEntity,
    sx: number,
    sy: number,
    zoom: number,
    isNight: boolean
  ): void {
    const ctx = self.ctx;
    const useWalkPose =
      !self.reducedMotion && v.state === 'walking' && Math.floor(v.walkPhase * 1.4) % 2 === 1;
    const spKey = useWalkPose ? v.walkSprite : v.idleSprite;
    const sp = self.sprites.get(spKey) ?? self.sprites.get(v.idleSprite);
    if (!sp) return;

    const baseH = (v.id === 'hagrid' ? 62 : 52) * zoom;
    const drawW = baseH * (sp.width / sp.height);
    const isWalking = !self.reducedMotion && v.state === 'walking';
    const hop = self.reducedMotion
      ? 0
      : isWalking
        ? Math.abs(Math.sin(v.walkPhase * 2.1)) * 2.8 * zoom
        : Math.sin(self.tick * 0.05 + v.gx * 1.7) * 0.7 * zoom;
    // AAA 2.5D Procedural Puppet Breathing & Stride Tilt
    const breathPhase = self.tick * 0.065 + v.gx * 1.3 + v.gy * 0.9;
    const puppetScaleX = self.reducedMotion
      ? 1
      : isWalking
        ? 1 + Math.sin(v.walkPhase * 2.1) * 0.024
        : 1 + Math.sin(breathPhase) * 0.018;
    const puppetScaleY = self.reducedMotion
      ? 1
      : isWalking
        ? 1 - Math.sin(v.walkPhase * 2.1) * 0.022
        : 1 - Math.sin(breathPhase) * 0.020;
    const strideLean = isWalking ? Math.sin(v.walkPhase * 1.05) * 0.038 : 0;
    const shadowScale = Math.max(0.78, 1 - hop / Math.max(12, 24 * zoom));

    ctx.save();
    // Warm sunlit contact shadow beneath boots (shrinks subtly mid-hop!)
    ctx.fillStyle = isNight ? 'rgba(10, 16, 28, 0.44)' : 'rgba(34, 62, 24, 0.32)';
    ctx.beginPath();
    ctx.ellipse(
      sx,
      sy + 2 * zoom,
      drawW * 0.28 * shadowScale,
      drawW * 0.13 * shadowScale,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.translate(sx, sy - hop);
    if (v.facingLeft) {
      ctx.scale(-1, 1);
    }
    if (strideLean !== 0 || puppetScaleX !== 1 || puppetScaleY !== 1) {
      ctx.transform(puppetScaleX, 0, strideLean, puppetScaleY, 0, 0);
    }
    ctx.drawImage(sp, -drawW * 0.5, -baseH, drawW, baseH);

    // Enchanted Self-Floating Umbrella Canopy when raining in the valley!
    if (v.moodBubble === '☔') {
      const umbY = -baseH - 4 * zoom + (self.reducedMotion ? 0 : Math.sin(self.tick * 0.08 + v.gx) * 1.4 * zoom);
      const umbR = Math.max(10, 13.5 * zoom);
      ctx.fillStyle = v.id === 'molly' || v.id === 'ginny' ? '#dc2626' : '#2563eb';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = Math.max(1, 1.3 * zoom);
      ctx.beginPath();
      ctx.arc(0, umbY, umbR, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(0, umbY);
      ctx.lineTo(0, umbY + 9 * zoom);
      ctx.stroke();
    }
    ctx.restore();

    self.hotspots.push({
      kind: 'villager',
      id: v.id,
      sx,
      sy: sy - baseH * 0.5,
      radius: Math.max(20, 24 * zoom),
    });

    if (v.bubbleTimer > 0 && zoom >= 0.48) {
      const bob = self.reducedMotion ? 0 : Math.sin(self.tick * 0.09 + v.gx) * 2 * zoom;
      const bx = sx;
      const by = sy - baseH - 12 * zoom + bob;
      const r = Math.max(11, 13 * zoom);
      ctx.save();
      ctx.fillStyle = 'rgba(255, 251, 235, 0.96)';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = Math.max(1.4, 1.8 * zoom);
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = `${Math.max(11, Math.round(13 * zoom))}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.moodBubble, bx, by + 0.5);
      ctx.restore();
    }
}

export function entitiesDrawRadialGlow(self: IsometricRenderer, x: number, y: number, r: number, color: string): void {
    if (r <= 1) return;
    const g = self.ctx.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    self.ctx.fillStyle = g;
    self.ctx.beginPath();
    self.ctx.arc(x, y, r, 0, Math.PI * 2);
    self.ctx.fill();
}

export function entitiesDrawNightCandlelightPass(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    isFullNight: boolean
  ): void {
    const ctx = self.ctx;
    ctx.save();

    // 1. Cozy twilight indigo/amber veil using multiply so daytime sprites settle into dusk/night
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = isFullNight ? 'rgba(178, 194, 234, 0.88)' : 'rgba(238, 204, 186, 0.92)';
    ctx.fillRect(0, 0, viewW, viewH);

    // 2. AAA 2.5D Point-Light Pass: Multi-Window Cottage Bounce Pools, Roaring Emerald Floo Hearth & Bioluminescent Crops!
    ctx.globalCompositeOperation = 'lighter';
    const flicker = self.reducedMotion ? 1 : 0.93 + Math.sin(self.tick * 0.09) * 0.07;
    for (const b of sim.state.buildings) {
      if (now < b.constructEndsAt) continue;
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const pt = gridToScreen(
        b.gx + bw * 0.5,
        b.gy + bh * 0.5,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + 18 + Math.max(bw, bh) * 8
      );
      if (pt.sx < -160 || pt.sx > viewW + 160 || pt.sy < -160 || pt.sy > viewH + 160) continue;

      if (item.isFlooPortal) {
        // Dramatic Emerald-Green Floo Hearth ground spill + glowing fireplace core (Mockup 2)!
        const groundPt = gridToScreen(b.gx + bw * 0.5, b.gy + bh * 0.5, cam, viewW, viewH, elev * ELEV_PX + 2);
        const flooRad = Math.max(58, (bw + bh) * 38) * cam.zoom * flicker;
        entitiesDrawRadialGlow(self, groundPt.sx, groundPt.sy + 8 * cam.zoom, flooRad * 1.28, 'rgba(16, 185, 129, 0.48)');
        entitiesDrawRadialGlow(self, pt.sx, pt.sy - 4 * cam.zoom, flooRad * 0.78, 'rgba(110, 231, 183, 0.62)');
        continue;
      }

      // Bioluminescent Magical Crops & Flowers (`glow_mushroom`, `moonlight_flower`, `phoenix_fireflower`, `rainbow_tulip`)
      if (item.isFarmlandPlot) {
        if (!b.cropId) continue;
        const bioColor =
          b.cropId === 'glow_mushroom'
            ? 'rgba(56, 189, 248, 0.42)'
            : b.cropId === 'moonlight_flower'
              ? 'rgba(167, 139, 250, 0.38)'
              : b.cropId === 'phoenix_fireflower'
                ? 'rgba(251, 146, 60, 0.42)'
                : b.cropId === 'rainbow_tulip'
                  ? 'rgba(244, 114, 182, 0.32)'
                  : FARM_CROPS[b.cropId]?.nocturnalGlowColor;
        if (bioColor) {
          entitiesDrawRadialGlow(self, pt.sx, pt.sy + 4 * cam.zoom, 42 * cam.zoom * flicker, bioColor);
        }
        continue;
      }

      if (item.isAnimalPasturePlot || item.spriteKey?.startsWith('env_')) continue;

      const rad = Math.max(36, (bw + bh) * 24) * cam.zoom * flicker;
      const color =
        item.id === 'patronus_ward_lantern'
          ? 'rgba(125, 211, 252, 0.38)'
          : isFullNight
            ? 'rgba(251, 191, 36, 0.28)'
            : 'rgba(251, 146, 60, 0.24)';
      entitiesDrawRadialGlow(self, pt.sx, pt.sy, rad, color);

      // Warm front-porch ground bounce ellipse & multi-story cottage window glints (Mockup 2)
      if (bw >= 2 || bh >= 2) {
        const porchPt = gridToScreen(b.gx + bw * 0.65, b.gy + bh * 0.65, cam, viewW, viewH, elev * ELEV_PX + 2);
        entitiesDrawRadialGlow(
          self,
          porchPt.sx,
          porchPt.sy + 5 * cam.zoom,
          rad * 0.72,
          isFullNight ? 'rgba(253, 224, 71, 0.26)' : 'rgba(251, 146, 60, 0.22)'
        );
        if (item.id === 'burrow_house_canon') {
          entitiesDrawRadialGlow(self, pt.sx - 6 * cam.zoom, pt.sy - 34 * cam.zoom, 28 * cam.zoom * flicker, 'rgba(253, 224, 71, 0.36)');
          entitiesDrawRadialGlow(self, pt.sx + 5 * cam.zoom, pt.sy - 58 * cam.zoom, 24 * cam.zoom * flicker, 'rgba(251, 191, 36, 0.34)');
          entitiesDrawRadialGlow(self, pt.sx - 2 * cam.zoom, pt.sy - 82 * cam.zoom, 18 * cam.zoom * flicker, 'rgba(254, 240, 138, 0.30)');
        }
      }
    }

    ctx.restore();
}

export function entitiesDrawWeatherParticles(self: IsometricRenderer, 
    sim: ParkSimulation,
    viewW: number,
    viewH: number,
    isNight: boolean,
    festival: string,
    weather: WeatherForecastSlot,
    now: number
  ): void {
    const ctx = self.ctx;

    // 1. Morning Mist / Black Lake Fog Ribbons
    if (weather.kind === 'fog') {
      ctx.save();
      const drift = self.reducedMotion ? 0 : (self.tick * 0.45) % viewW;
      for (let i = 0; i < 4; i++) {
        const fx = ((drift + i * (viewW * 0.34)) % (viewW + 360)) - 180;
        const fy = viewH * (0.28 + i * 0.17);
        const g = ctx.createRadialGradient(fx, fy, 10, fx, fy, 240);
        g.addColorStop(0, 'rgba(241, 245, 249, 0.24)');
        g.addColorStop(1, 'rgba(241, 245, 249, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(fx, fy, 260, 74, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Magical Rain & Storm Streaks + Ground Ripples + Delayed Thunder!
    if ((weather.kind === 'rain' || weather.kind === 'storm') && !self.reducedMotion) {
      const isStorm = weather.kind === 'storm';
      const count = isStorm ? self.rainStreaks.length : 70;
      ctx.save();
      ctx.strokeStyle = isStorm ? 'rgba(226, 232, 240, 0.52)' : 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = isStorm ? 1.5 : 1.2;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const r = self.rainStreaks[i];
        r.y = (r.y + r.speed * (isStorm ? 1.35 : 1.0)) % 1;
        r.x = (r.x - r.speed * 0.22 + 1) % 1;
        const rx = r.x * viewW;
        const ry = r.y * viewH;
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - r.len * 0.28, ry + r.len);
      }
      ctx.stroke();

      // Subtle raindrop splash rings across cobbles & ponds
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < (isStorm ? 14 : 8); i++) {
        const phase = ((self.tick * 0.045 + i * 0.31) % 1);
        const sx = ((i * 197 + Math.floor(self.tick / 22) * 53) % Math.max(1, viewW));
        const sy = ((i * 131 + Math.floor(self.tick / 22) * 29) % Math.max(1, viewH));
        ctx.globalAlpha = (1 - phase) * 0.45;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 3 + phase * 11, 1.5 + phase * 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Storm lightning flash + delayed Web Audio Thunder!
      if (isStorm) {
        if (self.nextLightningAt === 0) {
          self.nextLightningAt = now + 7_500;
        } else if (now >= self.nextLightningAt) {
          self.lightningFlashAlpha = 0.34;
          self.nextLightningAt = now + 9_000 + Math.random() * 8_000;
          sim.audio.playThunder(0.8, 0.36);
        }
      }
    }

    if (self.lightningFlashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(248, 250, 252, ${self.lightningFlashAlpha})`;
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.restore();
      self.lightningFlashAlpha *= 0.84;
    }

    // 3. Snowflakes, Sunlit Dandelion Pollen Motes & Golden Nighttime Fireflies
    const mode = sim.state.settings.weatherOverride;
    if (self.reducedMotion) return;

    const isSnow = weather.kind === 'snow';
    const showFireflies =
      mode !== 'clear' &&
      !isSnow &&
      weather.kind !== 'rain' &&
      weather.kind !== 'storm' &&
      (festival === 'halloween' || isNight || mode === 'fireflies');
    const showSunPollen =
      !isNight &&
      !isSnow &&
      weather.kind !== 'rain' &&
      weather.kind !== 'storm' &&
      weather.kind !== 'fog';

    if (!isSnow && !showFireflies && !showSunPollen) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const particleBudget = computeWeatherParticleBudget(dpr, Math.max(viewW, self.canvas.width));
    const rawLimit = Math.min(self.particles.length, particleBudget);
    const particleLimit = showSunPollen && !showFireflies ? Math.min(28, rawLimit) : rawLimit;

    ctx.save();
    for (let i = 0; i < particleLimit; i++) {
      const p = self.particles[i];
      p.y = (p.y + (isSnow ? p.vy : -p.vy * 0.45) + 1) % 1;
      p.x = (p.x + p.vx + Math.sin(self.tick * 0.015 + p.r) * 0.0005 + 1) % 1;

      if (isSnow) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.beginPath();
        ctx.arc(p.x * viewW, p.y * viewH, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (showFireflies) {
        const pulse = 0.45 + 0.45 * Math.sin(self.tick * 0.08 + p.x * 20);
        const fx = p.x * viewW;
        const fy = p.y * viewH;
        const haloR = p.r * 3.6;
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, haloR);
        if (festival === 'halloween') {
          g.addColorStop(0, `rgba(255, 231, 176, ${pulse})`);
          g.addColorStop(0.35, `rgba(251, 146, 60, ${pulse * 0.5})`);
          g.addColorStop(1, 'rgba(251, 146, 60, 0)');
        } else {
          g.addColorStop(0, `rgba(255, 247, 214, ${pulse})`);
          g.addColorStop(0.35, `rgba(253, 224, 71, ${pulse * 0.45})`);
          g.addColorStop(1, 'rgba(253, 224, 71, 0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(fx, fy, haloR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 235, 0.9)';
        ctx.beginPath();
        ctx.arc(fx, fy, p.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (showSunPollen) {
        // AAA Glowing Starburst Dandelion Wish-Seeds & Warm Golden Meadow Pollen Motes (Mockup 1)
        const pulse = 0.42 + 0.38 * Math.sin(self.tick * 0.05 + i * 1.7);
        const fx = p.x * viewW;
        const fy = p.y * viewH;
        if (i % 3 === 0) {
          const seedR = Math.max(4.5, p.r * 2.4);
          const halo = ctx.createRadialGradient(fx, fy, 0.5, fx, fy, seedR * 2.4);
          halo.addColorStop(0, `rgba(255, 253, 232, ${pulse * 0.85})`);
          halo.addColorStop(0.45, `rgba(253, 224, 71, ${pulse * 0.42})`);
          halo.addColorStop(1, 'rgba(253, 224, 71, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(fx, fy, seedR * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // 8 delicate starburst dandelion pappus filaments + curved seed stem
          const tilt = Math.sin(self.tick * 0.025 + i) * 0.25;
          ctx.strokeStyle = `rgba(255, 252, 235, ${Math.min(0.95, pulse + 0.18)})`;
          ctx.lineWidth = 1.05;
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const ang = tilt + (Math.PI * 2 * k) / 8;
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx + Math.cos(ang) * seedR, fy + Math.sin(ang) * seedR);
          }
          ctx.moveTo(fx, fy);
          ctx.quadraticCurveTo(fx + 1.8, fy + seedR * 0.9, fx + 0.6, fy + seedR * 1.55);
          ctx.stroke();

          ctx.fillStyle = '#fffbeb';
          ctx.beginPath();
          ctx.arc(fx, fy, 1.65, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = i % 2 === 0 ? `rgba(255, 251, 235, ${pulse * 0.78})` : `rgba(254, 240, 138, ${pulse * 0.82})`;
          ctx.beginPath();
          ctx.arc(fx, fy, Math.max(1.4, p.r * 0.78), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
}

export function entitiesDrawAndTickOwlPostEvent(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    isNight: boolean,
    hideInteractive: boolean
  ): void {
    const ctx = self.ctx;
    const zoom = cam.zoom;

    // 1. Spawn initial "Hello Beat" owl right after entering the park, then every ~58s
    if (self.nextOwlSpawnAt === 0) {
      self.nextOwlSpawnAt = now + 200;
    }

    if (!self.owlFlight && !self.owlParcel && now >= self.nextOwlSpawnAt) {
      // Pick a cozy sunlit meadow tile near the center of the Level 1 valley, avoiding any active tutorial highlight plot
      const tutTarget = sim.getTutorialWorldTarget();
      let dropGx = 16.5;
      let dropGy = 23.5;
      for (let r = 0; r <= 9; r++) {
        let found = false;
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            const tx = 16 + dx;
            const ty = 23 + dy;
            const cell = sim.grid[ty]?.[tx];
            if (!cell || cell.path === 'none' || cell.buildingUid || cell.terrain === 'water') {
              continue;
            }
            if (
              tutTarget &&
              Math.hypot(
                tx + 0.5 - (tutTarget.gx + tutTarget.bw * 0.5),
                ty + 0.5 - (tutTarget.gy + tutTarget.bh * 0.5)
              ) < 4.2
            ) {
              continue;
            }
            dropGx = tx + 0.5;
            dropGy = ty + 0.5;
            found = true;
          }
        }
        if (found) break;
      }

      self.owlFlight = {
        startedAt: now,
        durationMs: 3600,
        startGx: dropGx - 6.2,
        startGy: dropGy - 4.6,
        dropGx,
        dropGy,
        endGx: dropGx + 6.4,
        endGy: dropGy + 3.8,
        dropped: false,
      };
      self.nextOwlSpawnAt = now + 58_000;
    }

    // 2. Expire unclaimed parcel gently after 28s so it never clutters the plaza
    if (self.owlParcel && now >= self.owlParcel.expiresAt) {
      self.owlParcel = null;
      self.nextOwlSpawnAt = now + 45_000;
    }

    // 3. Draw parcel resting on the cobblestone plaza (with clickable hotspot!)
    if (self.owlParcel && !sim.isHeadmasterPreview) {
      const gxInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(self.owlParcel.gx)));
      const gyInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(self.owlParcel.gy)));
      const elev = sim.grid[gyInt]?.[gxInt]?.elevation ?? 0;
      const ageMs = now - self.owlParcel.droppedAt;
      const dropT = Math.min(1, ageMs / 420);
      // Parabolic drop from owl height down onto cobbles + gentle idle bob
      const airLift = (1 - dropT) * (1 - dropT) * 44;
      const bob = dropT >= 1 && !self.reducedMotion ? Math.sin(self.tick * 0.09) * 2.5 : 0;
      const pt = gridToScreen(
        self.owlParcel.gx,
        self.owlParcel.gy,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + airLift + bob
      );
      const shadowPt = gridToScreen(
        self.owlParcel.gx,
        self.owlParcel.gy,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX
      );

      if (pt.sx >= -60 && pt.sx <= viewW + 60 && pt.sy >= -60 && pt.sy <= viewH + 60) {
        ctx.save();
        // Ground contact shadow
        ctx.fillStyle = 'rgba(58, 36, 18, 0.26)';
        ctx.beginPath();
        ctx.ellipse(shadowPt.sx, shadowPt.sy, 11 * zoom, 5.5 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();

        // Warm golden aura under parcel
        entitiesDrawRadialGlow(self, 
          pt.sx,
          pt.sy - 6 * zoom,
          24 * zoom,
          isNight ? 'rgba(253, 224, 71, 0.45)' : 'rgba(254, 240, 138, 0.55)'
        );

        // Cream parchment parcel tied with scarlet Hogsmeade ribbon & wax seal
        const bw = 16 * zoom;
        const bh = 12 * zoom;
        const bx = pt.sx - bw * 0.5;
        const by = pt.sy - bh - 2 * zoom;
        ctx.fillStyle = '#fdf4dc';
        ctx.strokeStyle = '#4a2c16';
        ctx.lineWidth = Math.max(1.4, 2 * zoom);
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 3.5 * zoom);
        ctx.fill();
        ctx.stroke();

        // Crossed scarlet ribbon + bow
        ctx.strokeStyle = '#c83e37';
        ctx.lineWidth = Math.max(1.5, 2.2 * zoom);
        ctx.beginPath();
        ctx.moveTo(pt.sx, by);
        ctx.lineTo(pt.sx, by + bh);
        ctx.moveTo(bx, by + bh * 0.5);
        ctx.lineTo(bx + bw, by + bh * 0.5);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pt.sx, by + bh * 0.5, 2.4 * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Cozy floating invite badge above parcel (auto-deoverlapped from active tutorial world callout)
        if (!hideInteractive) {
          let pillY = by - 13 * zoom;
          const tutTarget = sim.getTutorialWorldTarget();
          if (tutTarget) {
            const tElev = sim.grid[tutTarget.gy]?.[tutTarget.gx]?.elevation ?? 0;
            const tutPin = gridToScreen(
              tutTarget.gx + tutTarget.bw * 0.5,
              tutTarget.gy + tutTarget.bh * 0.5,
              cam,
              viewW,
              viewH,
              tElev * ELEV_PX + 98
            );
            if (Math.abs(pt.sx - tutPin.sx) < 155 && Math.abs(pillY - tutPin.sy) < 48) {
              pillY = by + bh + 13 * zoom;
            }
          }
          const label = '🦉 Quà Thư Cú!';
          ctx.font = `800 ${Math.max(10.5, Math.round(11 * zoom))}px "Be Vietnam Pro", sans-serif`;
          const tw = ctx.measureText(label).width;
          const pw = tw + 14 * zoom;
          const ph = 18 * zoom;
          ctx.fillStyle = '#fffdf4';
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = Math.max(1.3, 1.8 * zoom);
          ctx.beginPath();
          ctx.roundRect(pt.sx - pw * 0.5, pillY - ph * 0.5, pw, ph, ph * 0.5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#5c2d0c';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, pt.sx, pillY + 0.5);

          self.hotspots.push({
            kind: 'owl_post',
            id: 'owl_parcel',
            sx: pt.sx,
            sy: pt.sy - 10 * zoom,
            radius: Math.max(28, 30 * zoom),
          });
        }
        ctx.restore();
      }
    }

    // 4. Draw burst sparkles when player collects the Owl Post parcel
    if (self.owlCollectBurst) {
      const bt = (now - self.owlCollectBurst.startedAt) / 700;
      if (bt >= 1) {
        self.owlCollectBurst = null;
      } else {
        const bp = gridToScreen(self.owlCollectBurst.gx, self.owlCollectBurst.gy, cam, viewW, viewH, 16);
        entitiesDrawCompletionSparkles(self, bp.sx, bp.sy, 46 * zoom, 42 * zoom, zoom, bt, isNight);
      }
    }

    // 5. Draw the Snowy Owl swooping gracefully across the village sky!
    if (self.owlFlight) {
      const ft = (now - self.owlFlight.startedAt) / self.owlFlight.durationMs;
      if (ft >= 1) {
        self.owlFlight = null;
      } else {
        if (!self.owlFlight.dropped && ft >= 0.48) {
          self.owlFlight.dropped = true;
          if (!sim.isHeadmasterPreview) {
            self.owlParcel = {
              gx: self.owlFlight.dropGx,
              gy: self.owlFlight.dropGy,
              droppedAt: now,
              expiresAt: now + 28_000,
            };
          }
        }

        const curGx =
          ft < 0.5
            ? self.owlFlight.startGx + (self.owlFlight.dropGx - self.owlFlight.startGx) * (ft / 0.5)
            : self.owlFlight.dropGx + (self.owlFlight.endGx - self.owlFlight.dropGx) * ((ft - 0.5) / 0.5);
        const curGy =
          ft < 0.5
            ? self.owlFlight.startGy + (self.owlFlight.dropGy - self.owlFlight.startGy) * (ft / 0.5)
            : self.owlFlight.dropGy + (self.owlFlight.endGy - self.owlFlight.dropGy) * ((ft - 0.5) / 0.5);

        // Swoop low over the plaza at ft=0.5, higher at entry & exit
        const swoopArc = Math.pow((ft - 0.5) * 2, 2);
        const altPx = 52 + swoopArc * 68;
        const owlScreen = gridToScreen(curGx, curGy, cam, viewW, viewH, altPx);
        const groundScreen = gridToScreen(curGx, curGy, cam, viewW, viewH, 0);

        if (owlScreen.sx >= -90 && owlScreen.sx <= viewW + 90 && owlScreen.sy >= -90 && owlScreen.sy <= viewH + 90) {
          ctx.save();
          // Soft gliding shadow on the sunlit meadow below
          ctx.fillStyle = 'rgba(42, 64, 32, 0.18)';
          ctx.beginPath();
          ctx.ellipse(groundScreen.sx, groundScreen.sy, 14 * zoom, 6.5 * zoom, -0.2, 0, Math.PI * 2);
          ctx.fill();

          const flap = self.reducedMotion ? 0.3 : Math.sin(now * 0.018);
          ctx.translate(owlScreen.sx, owlScreen.sy);
          const s = Math.max(0.75, zoom * 0.95);
          ctx.scale(s, s);

          // Carried parcel before drop
          if (!self.owlFlight.dropped && !sim.isHeadmasterPreview) {
            ctx.fillStyle = '#fdf4dc';
            ctx.strokeStyle = '#4a2c16';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(-6, 7, 12, 9, 2.5);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#c83e37';
            ctx.beginPath();
            ctx.moveTo(0, 7);
            ctx.lineTo(0, 16);
            ctx.stroke();
          }

          // Back wing
          ctx.fillStyle = '#eef2f6';
          ctx.strokeStyle = '#4a2c16';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-4, -2);
          ctx.quadraticCurveTo(-22, -16 * flap - 6, -28, -10 * flap + 2);
          ctx.quadraticCurveTo(-16, 4, -3, 3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Plump storybook snowy owl body & head
          ctx.fillStyle = '#fffdf7';
          ctx.beginPath();
          ctx.ellipse(0, 1, 11, 8.5, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(8, -4, 6.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Front wing
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(2, 0);
          ctx.quadraticCurveTo(-12, -20 * flap - 8, -20, -13 * flap + 4);
          ctx.quadraticCurveTo(-6, 7, 4, 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Warm amber eyes & tiny beak
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(10.5, -4.8, 1.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#4a2c16';
          ctx.beginPath();
          ctx.arc(10.8, -4.8, 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(14, -4);
          ctx.lineTo(17.5, -2.5);
          ctx.lineTo(13.8, -1.5);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }
    }
}

function paintGoldenAtmosphereAndVignetteToCtx(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  period: 'dawn' | 'day' | 'dusk' | 'night',
  weather: WeatherForecastSlot
): void {
  const isOvercast = weather.kind === 'rain' || weather.kind === 'storm';

  // 1. Diagonal Golden Hour Sunbeams & Warm Honey Sun-Bloom
  if (!isOvercast && (period === 'day' || period === 'dawn' || period === 'dusk')) {
    const sunX = w * (period === 'dawn' ? 0.2 : period === 'dusk' ? 0.8 : 0.76);
    const sunY = Math.max(29, h * 0.14);

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    const bloomR = Math.max(w, h) * 0.56;
    const bloom = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, bloomR);
    if (period === 'dusk') {
      bloom.addColorStop(0, 'rgba(255, 206, 138, 0.28)');
      bloom.addColorStop(0.42, 'rgba(251, 164, 116, 0.11)');
      bloom.addColorStop(1, 'rgba(251, 146, 60, 0)');
    } else {
      bloom.addColorStop(0, 'rgba(255, 248, 196, 0.30)');
      bloom.addColorStop(0.38, 'rgba(254, 235, 148, 0.12)');
      bloom.addColorStop(1, 'rgba(254, 240, 138, 0)');
    }
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);

    const rayAngles = period === 'dawn' ? [0.52, 0.74, 0.98] : [2.08, 2.30, 2.54];
    const rayLen = Math.hypot(w, h) * 0.92;

    for (let i = 0; i < rayAngles.length; i++) {
      const ang = rayAngles[i];
      const halfSpread = 0.055 + i * 0.012;
      const endX1 = sunX + Math.cos(ang - halfSpread) * rayLen;
      const endY1 = sunY + Math.sin(ang - halfSpread) * rayLen;
      const endX2 = sunX + Math.cos(ang + halfSpread) * rayLen;
      const endY2 = sunY + Math.sin(ang + halfSpread) * rayLen;

      const rayGrad = ctx.createLinearGradient(
        sunX,
        sunY,
        sunX + Math.cos(ang) * rayLen * 0.85,
        sunY + Math.sin(ang) * rayLen * 0.85
      );
      const peakAlpha = period === 'dusk' ? 0.13 : 0.145 - i * 0.02;
      rayGrad.addColorStop(0, `rgba(255, 250, 214, ${peakAlpha})`);
      rayGrad.addColorStop(0.5, `rgba(254, 236, 162, ${peakAlpha * 0.56})`);
      rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(endX1, endY1);
      ctx.lineTo(endX2, endY2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // 1b. AAA Soft Painterly Foreground Cloud Banks framing the outer viewport edges
  if (weather.kind !== 'storm') {
    ctx.save();
    const cloudAnchors: Array<[number, number, number]> = [
      [w * 0.67, h * 0.03, 1.05],
      [w * 0.96, h * 0.27, 0.92],
      [w * 0.04, h * 0.77, 0.96],
      [w * 0.63, h * 0.97, 1.12],
    ];
    const baseR = Math.max(34, Math.min(w, h) * 0.115);
    for (const [bx, by, sc] of cloudAnchors) {
      const puffs: Array<[number, number, number]> = [
        [-baseR * 0.62 * sc, baseR * 0.1 * sc, baseR * 0.76 * sc],
        [0, -baseR * 0.08 * sc, baseR * 0.96 * sc],
        [baseR * 0.66 * sc, baseR * 0.12 * sc, baseR * 0.78 * sc],
      ];
      for (const [ox, oy, pr] of puffs) {
        const cg = ctx.createRadialGradient(bx + ox, by + oy, pr * 0.12, bx + ox, by + oy, pr);
        if (period === 'night') {
          cg.addColorStop(0, 'rgba(148, 163, 198, 0.24)');
          cg.addColorStop(0.58, 'rgba(100, 116, 158, 0.10)');
          cg.addColorStop(1, 'rgba(30, 41, 59, 0)');
        } else if (period === 'dusk') {
          cg.addColorStop(0, 'rgba(255, 228, 205, 0.46)');
          cg.addColorStop(0.58, 'rgba(251, 182, 148, 0.20)');
          cg.addColorStop(1, 'rgba(251, 146, 60, 0)');
        } else {
          cg.addColorStop(0, 'rgba(255, 253, 246, 0.58)');
          cg.addColorStop(0.56, 'rgba(254, 249, 232, 0.26)');
          cg.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.ellipse(bx + ox, by + oy, pr * 1.28, pr * 0.78, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 2. Cozy Storybook Vignette framing the viewport corners toward the village heart
  const cx = w * 0.5;
  const cy = h * 0.48;
  const outerR = Math.hypot(w, h) * 0.58;
  const innerR = outerR * 0.56;
  const vig = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  if (period === 'night') {
    vig.addColorStop(1, 'rgba(10, 14, 34, 0.30)');
  } else if (period === 'dusk') {
    vig.addColorStop(1, 'rgba(68, 30, 40, 0.22)');
  } else {
    vig.addColorStop(1, 'rgba(92, 52, 18, 0.16)');
  }
  ctx.save();
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function entitiesDrawGoldenAtmosphereAndVignette(self: IsometricRenderer, 
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void {
    if (viewW <= 4 || viewH <= 4) return;
    if (typeof document === 'undefined') {
      paintGoldenAtmosphereAndVignetteToCtx(self.ctx, viewW, viewH, period, weather);
      return;
    }

    // Bake soft atmospheric gradients at 0.5x resolution once per (viewport, period, weather)
    // so 60fps rendering uses a single GPU-accelerated source-over blit instead of 16 gradients/frame.
    const cw = Math.max(16, Math.min(960, Math.round(viewW * 0.5)));
    const ch = Math.max(16, Math.min(640, Math.round(viewH * 0.5)));
    const key = `${cw}|${ch}|${period}|${weather.kind}`;
    if (!self.atmosCacheCanvas || self.atmosCacheKey !== key) {
      if (!self.atmosCacheCanvas) {
        self.atmosCacheCanvas = document.createElement('canvas');
      }
      self.atmosCacheCanvas.width = cw;
      self.atmosCacheCanvas.height = ch;
      const aCtx = self.atmosCacheCanvas.getContext('2d');
      if (!aCtx) {
        paintGoldenAtmosphereAndVignetteToCtx(self.ctx, viewW, viewH, period, weather);
        return;
      }
      aCtx.clearRect(0, 0, cw, ch);
      paintGoldenAtmosphereAndVignetteToCtx(aCtx, cw, ch, period, weather);
      self.atmosCacheKey = key;
    }

    self.ctx.drawImage(self.atmosCacheCanvas, 0, 0, viewW, viewH);
}

export function entitiesDrawHarvestBloom(self: IsometricRenderer, now: number, zoom: number): void {
    if (!self.harvestBloom) return;
    const elapsed = now - self.harvestBloom.startedAt;
    const duration = 650;
    if (elapsed >= duration || elapsed < 0) {
      self.harvestBloom = null;
      return;
    }
    const t = elapsed / duration;
    const alpha = Math.max(0, (1 - t) * 0.35);
    const rad = Math.max(18, (24 + t * 76) * zoom);
    const { x, y } = self.harvestBloom;

    const ctx = self.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, `rgba(254, 240, 138, ${alpha})`);
    grad.addColorStop(0.42, `rgba(251, 191, 36, ${alpha * 0.72})`);
    grad.addColorStop(0.78, `rgba(192, 132, 252, ${alpha * 0.48})`);
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

export function entitiesDrawDayNightLightLayer(self: IsometricRenderer, 
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night'
  ): void {
    // Daylight tint is 0.02..0.04 yellow already covered by sun-bloom; skip fullscreen overdraw in day!
    if (period === 'day') return;

    const ctx = self.ctx;
    const gradKey = `${Math.round(viewH)}|${period}`;
    if (!self.dayNightGradCache || self.dayNightGradCache.key !== gradKey) {
      const grad = ctx.createLinearGradient(0, 0, 0, viewH);
      if (period === 'night') {
        grad.addColorStop(0, 'rgba(20, 42, 108, 0.15)');
        grad.addColorStop(0.55, 'rgba(18, 30, 74, 0.13)');
        grad.addColorStop(1, 'rgba(12, 19, 38, 0.17)');
      } else if (period === 'dusk') {
        grad.addColorStop(0, 'rgba(249, 115, 22, 0.09)');
        grad.addColorStop(0.6, 'rgba(234, 88, 12, 0.075)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0.10)');
      } else {
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.065)');
        grad.addColorStop(1, 'rgba(244, 114, 182, 0.05)');
      }
      self.dayNightGradCache = { key: gradKey, grad };
    }

    // Hardware-accelerated source-over instead of soft-light (which triggers slow CPU readback on iOS WebKit)
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = self.dayNightGradCache.grad;
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();
}

export function entitiesRenderMinimap(self: IsometricRenderer, minimapCanvas: HTMLCanvasElement, sim: ParkSimulation, cam: Camera): void {
    const mCtx = minimapCanvas.getContext('2d');
    if (!mCtx) return;
    const w = minimapCanvas.width;
    const h = minimapCanvas.height;
    if (w <= 0 || h <= 0) return;
    mCtx.clearRect(0, 0, w, h);

    const rot = cam.viewRot ?? 0;
    const scaleX = (w * 0.46) / GRID_SIZE;
    const scaleY = (h * 0.44) / GRID_SIZE;
    const originX = w * 0.5;
    const originY = 8;

    const cacheKey = `${w}|${h}|${rot}|${sim.stateRevision}|${sim.state.sandboxMode ? 1 : 0}|${sim.state.unlockedZones.length}`;
    if (typeof document !== 'undefined') {
      if (!self.minimapCacheCanvas || self.minimapCacheKey !== cacheKey) {
        if (!self.minimapCacheCanvas) {
          self.minimapCacheCanvas = document.createElement('canvas');
        }
        self.minimapCacheCanvas.width = w;
        self.minimapCacheCanvas.height = h;
        const cCtx = self.minimapCacheCanvas.getContext('2d');
        if (cCtx) {
          cCtx.clearRect(0, 0, w, h);
          const unlockedSet = new Set(sim.state.unlockedZones);
          for (let gy = 0; gy < GRID_SIZE; gy++) {
            for (let gx = 0; gx < GRID_SIZE; gx++) {
              const c = sim.grid[gy][gx];
              const unlocked = sim.state.sandboxMode || unlockedSet.has(c.zoneId);
              const { rx, ry } = rotateGridPoint(gx + 0.5, gy + 0.5, rot);
              const mx = originX + (rx - ry) * scaleX;
              const my = originY + (rx + ry) * scaleY;

              if (!unlocked) {
                cCtx.fillStyle = 'rgba(84, 136, 92, 0.72)';
              } else if (c.buildingUid) {
                cCtx.fillStyle = '#fbbf24';
              } else if (c.coasterTrack) {
                cCtx.fillStyle = '#f97316';
              } else if (c.path !== 'none') {
                cCtx.fillStyle = '#d6d3d1';
              } else if (c.terrain === 'water') {
                cCtx.fillStyle = '#38bdf8';
              } else if (c.terrain === 'snow') {
                cCtx.fillStyle = '#e2e8f0';
              } else {
                cCtx.fillStyle = '#4ade80';
              }
              cCtx.fillRect(mx - 1.5, my - 1, 3.2, 2.2);
            }
          }
          self.minimapCacheKey = cacheKey;
        }
      }
    }

    if (self.minimapCacheCanvas && self.minimapCacheKey === cacheKey) {
      mCtx.drawImage(self.minimapCacheCanvas, 0, 0);
    } else {
      const unlockedSet = new Set(sim.state.unlockedZones);
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        for (let gx = 0; gx < GRID_SIZE; gx++) {
          const c = sim.grid[gy][gx];
          const unlocked = sim.state.sandboxMode || unlockedSet.has(c.zoneId);
          const { rx, ry } = rotateGridPoint(gx + 0.5, gy + 0.5, rot);
          const mx = originX + (rx - ry) * scaleX;
          const my = originY + (rx + ry) * scaleY;

          if (!unlocked) {
            mCtx.fillStyle = 'rgba(84, 136, 92, 0.72)';
          } else if (c.buildingUid) {
            mCtx.fillStyle = '#fbbf24';
          } else if (c.coasterTrack) {
            mCtx.fillStyle = '#f97316';
          } else if (c.path !== 'none') {
            mCtx.fillStyle = '#d6d3d1';
          } else if (c.terrain === 'water') {
            mCtx.fillStyle = '#38bdf8';
          } else if (c.terrain === 'snow') {
            mCtx.fillStyle = '#e2e8f0';
          } else {
            mCtx.fillStyle = '#4ade80';
          }
          mCtx.fillRect(mx - 1.5, my - 1, 3.2, 2.2);
        }
      }
    }

    // Escaped creature red blips
    for (const esc of sim.escapedCreatures) {
      const { rx, ry } = rotateGridPoint(esc.gx + 0.5, esc.gy + 0.5, rot);
      const mx = originX + (rx - ry) * scaleX;
      const my = originY + (rx + ry) * scaleY;
      mCtx.fillStyle = '#ef4444';
      mCtx.beginPath();
      mCtx.arc(mx, my, 3, 0, Math.PI * 2);
      mCtx.fill();
    }

    // Camera center crosshair box (rotation-aware!)
    const focus = getCameraFocusGrid(cam);
    const rf = rotateGridPoint(focus.fgx, focus.fgy, rot);
    const cx = originX + (rf.rx - rf.ry) * scaleX;
    const cy = originY + (rf.rx + rf.ry) * scaleY;
    const boxW = Math.max(14, 28 / cam.zoom);
    const boxH = Math.max(9, 18 / cam.zoom);
    mCtx.strokeStyle = '#ffffff';
    mCtx.lineWidth = 1.6;
    mCtx.strokeRect(cx - boxW * 0.5, cy - boxH * 0.5, boxW, boxH);
}
