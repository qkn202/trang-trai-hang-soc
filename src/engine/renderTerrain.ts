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
  computeVisibleRotatedTileWindow,
  computeWeatherParticleBudget,
  isTouchOrIOSDevice,
  resolveBuildingInWorldTimerInfo,
  rotTileToWorldTile,
} from "./rendererShared";
import {
  waterDrawAnimatedGroundOverlays,
  waterDrawOrganicWaterShorelines,
} from './renderWater';
import type { IsometricRenderer } from './renderer';

export function terrainDrawSkyBackdrop(self: IsometricRenderer, 
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void {
    const ctx = self.ctx;
    const isNightLike = period === 'night' || period === 'dusk';
    const isOvercast = weather.kind === 'rain' || weather.kind === 'storm';

    const sky = ctx.createLinearGradient(0, 0, 0, viewH);
    if (period === 'night') {
      sky.addColorStop(0, '#0b1030');
      sky.addColorStop(0.55, '#1a2350');
      sky.addColorStop(1, '#2b2350');
    } else if (period === 'dusk') {
      sky.addColorStop(0, '#3b2c66');
      sky.addColorStop(0.55, '#8a5570');
      sky.addColorStop(1, '#e0a071');
    } else if (isOvercast) {
      sky.addColorStop(0, weather.kind === 'storm' ? '#3d4f66' : '#587694');
      sky.addColorStop(0.58, weather.kind === 'storm' ? '#5c6f84' : '#85a2bc');
      sky.addColorStop(1, '#b8cad8');
    } else if (period === 'dawn') {
      sky.addColorStop(0, '#6fa3d4');
      sky.addColorStop(0.55, '#bcd0e4');
      sky.addColorStop(1, '#f6cfae');
    } else {
      sky.addColorStop(0, '#62bae6');
      sky.addColorStop(0.52, '#a7def4');
      sky.addColorStop(1, '#e8f4e2');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Twinkling stars at night/dusk
    if (isNightLike && weather.kind !== 'storm') {
      ctx.fillStyle = 'rgba(255, 248, 210, 0.72)';
      for (let i = 0; i < 48; i++) {
        const sx = (i * 173) % viewW;
        const sy = (i * 67) % Math.max(120, viewH * 0.45);
        const tw = 1.2 + Math.sin(self.tick * 0.05 + i) * 0.65;
        ctx.fillRect(sx, sy, tw, tw);
      }
    }

    // Sun or Crescent Moon on upper arc
    if (!isOvercast) {
      const orbX = viewW * (period === 'dawn' ? 0.2 : period === 'dusk' ? 0.8 : 0.76);
      const orbY = Math.max(58, viewH * 0.14);
      if (period === 'night') {
        self.drawRadialGlow(orbX, orbY, 54, 'rgba(254, 243, 199, 0.28)');
        ctx.save();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(orbX, orbY, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#141b41';
        ctx.beginPath();
        ctx.arc(orbX + 6, orbY - 4, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        self.drawRadialGlow(orbX, orbY, 76, 'rgba(254, 240, 138, 0.42)');
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.arc(orbX, orbY, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Post-Rain 7-Band Storybook Rainbow Arc!
    if (weather.isRainbow && period !== 'night') {
      const bands = [
        'rgba(248, 113, 113, 0.24)',
        'rgba(251, 146, 60, 0.24)',
        'rgba(250, 204, 21, 0.24)',
        'rgba(74, 222, 128, 0.24)',
        'rgba(56, 189, 248, 0.24)',
        'rgba(129, 140, 248, 0.22)',
        'rgba(192, 132, 252, 0.22)',
      ];
      const rcx = viewW * 0.5;
      const rcy = viewH * 0.72;
      const baseR = Math.min(viewW, viewH) * 0.58;
      ctx.save();
      ctx.lineCap = 'round';
      bands.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(rcx, rcy, baseR - idx * 6.5, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
      });
      ctx.restore();
    }

    // Parallax puffy storybook clouds drifting gently across sky
    ctx.save();
    for (const c of self.skyClouds) {
      if (!self.reducedMotion) {
        c.x = (c.x + c.speed) % 1.25;
      }
      const cx = (c.x - 0.12) * viewW;
      const cy = c.y * viewH;
      const s = c.scale;
      ctx.fillStyle = isNightLike
        ? `rgba(148, 163, 198, ${c.alpha * 0.25})`
        : isOvercast
          ? `rgba(203, 213, 225, ${c.alpha * 0.85})`
          : `rgba(255, 253, 246, ${c.alpha * 0.82})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 24 * s, 0, Math.PI * 2);
      ctx.arc(cx + 20 * s, cy - 6 * s, 20 * s, 0, Math.PI * 2);
      ctx.arc(cx - 20 * s, cy - 3 * s, 18 * s, 0, Math.PI * 2);
      ctx.arc(cx + 36 * s, cy + 3 * s, 15 * s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
}

export function terrainDrawFloatingIslandRim(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean
  ): void {
    const ctx = self.ctx;
    const viewRot = cam.viewRot ?? 0;
    const hw = TILE_W * 0.5 * cam.zoom;
    const hh = TILE_H * 0.5 * cam.zoom;
    const rimDepth = 54 * cam.zoom;

    const toScreenRot = (rx: number, ry: number, zOff = 0) => {
      const wx = (rx - ry) * (TILE_W * 0.5);
      const wy = (rx + ry) * (TILE_H * 0.5);
      return {
        sx: viewW * 0.5 + (wx - cam.x) * cam.zoom,
        sy: viewH * 0.5 + (wy - zOff - cam.y) * cam.zoom,
      };
    };

    const pLeft = toScreenRot(0, GRID_SIZE, 0);
    const pBottom = toScreenRot(GRID_SIZE, GRID_SIZE, 0);
    const pRight = toScreenRot(GRID_SIZE, 0, 0);

    // Quick off-screen cull if zoomed deep into northern interior
    if (
      Math.min(pLeft.sy, pRight.sy) > viewH + rimDepth * 2 ||
      pBottom.sy < -rimDepth * 2 ||
      pRight.sx < -120 ||
      pLeft.sx > viewW + 120
    ) {
      return;
    }

    ctx.save();
    // 1. Soft floating island sky-shadow underneath the tapered rock base
    ctx.fillStyle = isNightLike ? 'rgba(6, 10, 26, 0.36)' : 'rgba(28, 52, 78, 0.18)';
    ctx.beginPath();
    ctx.moveTo(pLeft.sx + hw * 2, pLeft.sy + rimDepth * 0.75);
    ctx.lineTo(pBottom.sx, pBottom.sy + rimDepth * 1.48);
    ctx.lineTo(pRight.sx - hw * 2, pRight.sy + rimDepth * 0.75);
    ctx.quadraticCurveTo(pBottom.sx, pBottom.sy + rimDepth * 0.9, pLeft.sx + hw * 2, pLeft.sy + rimDepth * 0.75);
    ctx.fill();

    // 1b. Drifting mist bank under the island's rim. Visible mainly when the
    // camera zooms out enough to show the floating-island edge, so the valley
    // reads as a piece of land above the clouds instead of the map's corner.
    if (pBottom.sy < viewH + rimDepth) {
      const mistY = pBottom.sy + rimDepth * 1.15;
      const puffs = 4;
      for (let i = 0; i < puffs; i++) {
        const fx =
          (pLeft.sx + pRight.sx) / 2 +
          Math.cos((i / puffs) * Math.PI * 2 + 0.6) * (pRight.sx - pLeft.sx) * 0.32;
        const fy = mistY + Math.sin(i * 2.3 + 1.1) * rimDepth * 0.5;
        const fr = (90 + (i % 2) * 30) * cam.zoom;
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        g.addColorStop(0, isNightLike ? 'rgba(150, 160, 190, 0.22)' : 'rgba(255, 255, 255, 0.32)');
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Left-Front Floating Cliff Skirt (ry = GRID_SIZE, rx0 = 0..GRID_SIZE-1)
    for (let rx0 = 0; rx0 < GRID_SIZE; rx0++) {
      const { gx, gy } = rotTileToWorldTile(rx0, GRID_SIZE - 1, viewRot);
      const cell = sim.grid[gy]?.[gx];
      const elev = cell?.elevation ?? 0;
      const p = rotatedTileDiamondToScreen(gx, gy, cam, viewW, viewH, elev * ELEV_PX);
      if (p.sx + hw < -60 || p.sx - hw > viewW + 60 || p.sy > viewH + rimDepth + 40) continue;

      const jag = ((rx0 * 19 + 7) % 5) * 3.2 * cam.zoom;
      const drop = rimDepth + elev * ELEV_PX * cam.zoom + jag;

      ctx.beginPath();
      ctx.moveTo(p.sx - hw, p.sy + hh);
      ctx.lineTo(p.sx, p.sy + hh * 2);
      ctx.lineTo(p.sx, p.sy + hh * 2 + drop);
      ctx.lineTo(p.sx - hw, p.sy + hh + drop * 0.92);
      ctx.closePath();
      ctx.fillStyle = isNightLike ? '#3b3345' : '#9c7a5b';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42, 26, 16, 0.42)';
      ctx.lineWidth = Math.max(0.8, 1.1 * cam.zoom);
      ctx.stroke();

      // Grassy / snowy / mossy overhang lip
      const lipCol =
        cell?.terrain === 'snow'
          ? isNightLike
            ? '#9fb6d0'
            : '#f1f6fc'
          : cell?.terrain === 'water'
            ? '#38bdf8'
            : isNightLike
              ? '#2e5d46'
              : '#65ad55';
      ctx.fillStyle = lipCol;
      ctx.beginPath();
      ctx.moveTo(p.sx - hw, p.sy + hh);
      ctx.lineTo(p.sx, p.sy + hh * 2);
      ctx.lineTo(p.sx, p.sy + hh * 2 + 5.5 * cam.zoom);
      ctx.lineTo(p.sx - hw, p.sy + hh + 5.5 * cam.zoom);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Right-Front Floating Cliff Skirt (rx = GRID_SIZE, ry0 = 0..GRID_SIZE-1)
    for (let ry0 = 0; ry0 < GRID_SIZE; ry0++) {
      const { gx, gy } = rotTileToWorldTile(GRID_SIZE - 1, ry0, viewRot);
      const cell = sim.grid[gy]?.[gx];
      const elev = cell?.elevation ?? 0;
      const p = rotatedTileDiamondToScreen(gx, gy, cam, viewW, viewH, elev * ELEV_PX);
      if (p.sx + hw < -60 || p.sx - hw > viewW + 60 || p.sy > viewH + rimDepth + 40) continue;

      const jag = ((ry0 * 23 + 11) % 5) * 3.2 * cam.zoom;
      const drop = rimDepth + elev * ELEV_PX * cam.zoom + jag;

      ctx.beginPath();
      ctx.moveTo(p.sx, p.sy + hh * 2);
      ctx.lineTo(p.sx + hw, p.sy + hh);
      ctx.lineTo(p.sx + hw, p.sy + hh + drop * 0.92);
      ctx.lineTo(p.sx, p.sy + hh * 2 + drop);
      ctx.closePath();
      ctx.fillStyle = isNightLike ? '#2a2434' : '#785c43';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42, 26, 16, 0.45)';
      ctx.lineWidth = Math.max(0.8, 1.1 * cam.zoom);
      ctx.stroke();

      const lipCol =
        cell?.terrain === 'snow'
          ? isNightLike
            ? '#8aa2be'
            : '#e2edf8'
          : cell?.terrain === 'water'
            ? '#0ea5e9'
            : isNightLike
              ? '#234937'
              : '#4f9342';
      ctx.fillStyle = lipCol;
      ctx.beginPath();
      ctx.moveTo(p.sx, p.sy + hh * 2);
      ctx.lineTo(p.sx + hw, p.sy + hh);
      ctx.lineTo(p.sx + hw, p.sy + hh + 5.5 * cam.zoom);
      ctx.lineTo(p.sx, p.sy + hh * 2 + 5.5 * cam.zoom);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
}

export function terrainRenderGroundTilesLayer(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean,
    showGridLines: boolean,
    unlockedSet: Set<string>,
    skipCull = false,
    forStaticCache = false
  ): void {
    const ctx = self.ctx;
    const viewRot = cam.viewRot ?? 0;
    const hw = TILE_W * 0.5 * cam.zoom;
    const hh = TILE_H * 0.5 * cam.zoom;
    const margin = Math.max(130, 280 * cam.zoom);

    terrainDrawFloatingIslandRim(self, sim, cam, viewW, viewH, isNightLike);

    const getRotNeighborElev = (rx0: number, ry0: number): number => {
      if (rx0 < 0 || ry0 < 0 || rx0 >= GRID_SIZE || ry0 >= GRID_SIZE) return 0;
      const { gx: ngx, gy: ngy } = rotTileToWorldTile(rx0, ry0, viewRot);
      return sim.grid[ngy]?.[ngx]?.elevation ?? 0;
    };

    const win = skipCull
      ? { sumMin: 0, sumMax: (GRID_SIZE - 1) * 2, diffMin: -GRID_SIZE, diffMax: GRID_SIZE }
      : computeVisibleRotatedTileWindow(cam, viewW, viewH, margin);
    const p = { sx: 0, sy: 0 };

    for (let sum = win.sumMin; sum <= win.sumMax; sum++) {
      const rxStart = skipCull
        ? Math.max(0, sum - (GRID_SIZE - 1))
        : Math.max(0, sum - (GRID_SIZE - 1), Math.floor((sum + win.diffMin) * 0.5) - 1);
      const rxEnd = skipCull
        ? Math.min(GRID_SIZE - 1, sum)
        : Math.min(GRID_SIZE - 1, sum, Math.ceil((sum + win.diffMax) * 0.5) + 1);
      for (let rx0 = rxStart; rx0 <= rxEnd; rx0++) {
        const ry0 = sum - rx0;
        const { gx, gy } = rotTileToWorldTile(rx0, ry0, viewRot);
        const cell = sim.grid[gy][gx];
        const zOff = cell.elevation * ELEV_PX;
        p.sx = viewW * 0.5 + ((rx0 - ry0) * (TILE_W * 0.5) - cam.x) * cam.zoom;
        p.sy = viewH * 0.5 + (sum * (TILE_H * 0.5) - zOff - cam.y) * cam.zoom;
        if (
          !skipCull &&
          (p.sx < -margin || p.sx > viewW + margin || p.sy < -margin || p.sy > viewH + margin)
        ) {
          continue;
        }

        const unlocked = sim.state.sandboxMode || unlockedSet.has(cell.zoneId);
        const pal = TERRAIN_PALETTE[cell.terrain];

        // 2a. 3D Isometric Rock Cliff Walls if elevated above screen-front neighbors!
        if (cell.elevation > 0) {
          const leftFrontElev = getRotNeighborElev(rx0, ry0 + 1);
          const rightFrontElev = getRotNeighborElev(rx0 + 1, ry0);
          if (cell.elevation > leftFrontElev) {
            const dropPx = (cell.elevation - leftFrontElev) * ELEV_PX * cam.zoom;
            ctx.beginPath();
            ctx.moveTo(p.sx - hw, p.sy + hh);
            ctx.lineTo(p.sx, p.sy + hh * 2);
            ctx.lineTo(p.sx, p.sy + hh * 2 + dropPx);
            ctx.lineTo(p.sx - hw, p.sy + hh + dropPx);
            ctx.closePath();
            ctx.fillStyle = isNightLike ? '#3b3746' : '#a39383';
            ctx.fill();
            ctx.strokeStyle = 'rgba(20, 16, 14, 0.55)';
            ctx.lineWidth = 1.1;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.sx - hw, p.sy + hh + dropPx * 0.5);
            ctx.lineTo(p.sx, p.sy + hh * 2 + dropPx * 0.5);
            ctx.strokeStyle = 'rgba(255, 248, 230, 0.2)';
            ctx.stroke();
          }
          if (cell.elevation > rightFrontElev) {
            const dropPx = (cell.elevation - rightFrontElev) * ELEV_PX * cam.zoom;
            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy + hh * 2);
            ctx.lineTo(p.sx + hw, p.sy + hh);
            ctx.lineTo(p.sx + hw, p.sy + hh + dropPx);
            ctx.lineTo(p.sx, p.sy + hh * 2 + dropPx);
            ctx.closePath();
            ctx.fillStyle = isNightLike ? '#292533' : '#7d6f61';
            ctx.fill();
            ctx.strokeStyle = 'rgba(20, 16, 14, 0.55)';
            ctx.lineWidth = 1.1;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy + hh * 2 + dropPx * 0.5);
            ctx.lineTo(p.sx + hw, p.sy + hh + dropPx * 0.5);
            ctx.strokeStyle = 'rgba(15, 12, 10, 0.35)';
            ctx.stroke();
          }
        }

        // 2b. Top Diamond Surface (expanded 0.45px so adjacent sunlit meadow tiles fuse seamlessly!)
        const shw = hw + 0.45;
        const shh = hh + 0.35;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy - 0.35);
        ctx.lineTo(p.sx + shw, p.sy + hh);
        ctx.lineTo(p.sx, p.sy + hh + shh);
        ctx.lineTo(p.sx - shw, p.sy + hh);
        ctx.closePath();

        ctx.fillStyle = isNightLike ? pal.night : pal.day;
        ctx.fill();

        // AAA 2.5D Multi-Layered Sunlit Rolling Meadow Relief, Clover Patches, Wildflowers & Sculpted Devon Stone Walls
        if (!cell.buildingUid && cell.path === 'none') {
          const hillMacro = Math.sin(gx * 0.17 + gy * 0.13) + Math.cos(gx * 0.11 - gy * 0.19);
          const meadowWave = Math.sin(gx * 0.39 + gy * 0.27) + Math.cos(gx * 0.23 - gy * 0.34);
          if ((cell.terrain === 'grass' || cell.terrain === 'forest') && !isNightLike) {
            // Layer 1: High-contrast warm golden-olive hill crests vs deep forest-emerald valley hollows (Mockup 1)
            if (hillMacro > 0.04) {
              const sunAmt = Math.min(0.48, (hillMacro - 0.04) * (unlocked ? 0.28 : 0.19));
              ctx.fillStyle = `rgba(222, 242, 82, ${sunAmt.toFixed(3)})`;
              ctx.fill();
              if (hillMacro > 0.55 && unlocked) {
                ctx.fillStyle = 'rgba(254, 245, 134, 0.24)';
                ctx.fill();
              }
            } else if (hillMacro < -0.06) {
              const shadeAmt = Math.min(0.38, (-hillMacro - 0.06) * (unlocked ? 0.22 : 0.16));
              ctx.fillStyle = `rgba(20, 74, 26, ${shadeAmt.toFixed(3)})`;
              ctx.fill();
            }
            // Layer 2: Sun-dappled micro meadow patches
            if (meadowWave > 0.24) {
              ctx.fillStyle = unlocked
                ? 'rgba(244, 252, 146, 0.24)'
                : 'rgba(226, 252, 168, 0.15)';
              ctx.fill();
            } else if (meadowWave < -0.32) {
              ctx.fillStyle = 'rgba(22, 86, 34, 0.18)';
              ctx.fill();
            }
          } else if ((cell.terrain === 'grass' || cell.terrain === 'forest') && isNightLike) {
            if (hillMacro > 0.28) {
              ctx.fillStyle = 'rgba(74, 222, 180, 0.08)';
              ctx.fill();
            } else if (hillMacro < -0.28) {
              ctx.fillStyle = 'rgba(6, 18, 24, 0.22)';
              ctx.fill();
            }
          } else if (cell.terrain === 'stone') {
            // Hogsmeade Stone Plaza: warm bevelled cobblestone slabs instead of flat grey!
            const stTone = (gx + gy) % 2 === 0
              ? (isNightLike ? '#6c6372' : '#ead7b7')
              : (isNightLike ? '#5d5564' : '#d8c19d');
            ctx.fillStyle = isNightLike ? '#3b3442' : '#967856';
            ctx.beginPath();
            ctx.ellipse(p.sx - 4.5 * cam.zoom, p.sy + hh + 1.1 * cam.zoom, 5.2 * cam.zoom, 2.7 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.ellipse(p.sx + 4.8 * cam.zoom, p.sy + hh - 0.5 * cam.zoom, 4.8 * cam.zoom, 2.5 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = stTone;
            ctx.beginPath();
            ctx.ellipse(p.sx - 4.5 * cam.zoom, p.sy + hh, 5.2 * cam.zoom, 2.7 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.ellipse(p.sx + 4.8 * cam.zoom, p.sy + hh - 1.5 * cam.zoom, 4.8 * cam.zoom, 2.5 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          const hVal = Math.abs((gx * 37 + gy * 23 + ((gx ^ gy) * 7)) % 23);
          if (cell.terrain === 'grass') {
            // Painterly emerald clover & sunlit chartreuse grass cushions
            if (hVal < 16) {
              ctx.fillStyle = isNightLike
                ? '#295740'
                : hillMacro > 0.22
                  ? '#7bc43a'
                  : hVal % 2 === 0
                    ? '#4d9832'
                    : '#3f8429';
              ctx.beginPath();
              ctx.ellipse(p.sx - 3.8 * cam.zoom, p.sy + hh + 0.6 * cam.zoom, 4.1 * cam.zoom, 2.0 * cam.zoom, 0, 0, Math.PI * 2);
              ctx.ellipse(p.sx + 1.8 * cam.zoom, p.sy + hh - 1.2 * cam.zoom, 3.5 * cam.zoom, 1.7 * cam.zoom, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            // Sculpted 3-blade grass tufts with sunlit tips
            if (cam.zoom >= 0.52 && hVal % 2 === 0) {
              const bladeSway =
                forStaticCache || self.reducedMotion
                  ? 0
                  : Math.sin(self.tick * 0.045 + gx * 0.6 + gy * 0.4) * 1.4 * cam.zoom;
              const bx = p.sx + ((hVal % 5) - 2) * 3.4 * cam.zoom;
              const by = p.sy + hh + ((hVal % 3) - 1) * 1.8 * cam.zoom;
              ctx.strokeStyle = isNightLike ? '#3c7a57' : '#357822';
              ctx.lineWidth = Math.max(1.05, 1.55 * cam.zoom);
              ctx.beginPath();
              ctx.moveTo(bx - 2.2 * cam.zoom, by);
              ctx.lineTo(bx - 3.4 * cam.zoom + bladeSway, by - 5.2 * cam.zoom);
              ctx.moveTo(bx, by + 0.5 * cam.zoom);
              ctx.lineTo(bx + bladeSway * 1.15, by - 6.3 * cam.zoom);
              ctx.moveTo(bx + 2.2 * cam.zoom, by);
              ctx.lineTo(bx + 3.3 * cam.zoom + bladeSway, by - 4.8 * cam.zoom);
              ctx.stroke();
            }
            // Lush wildflower clusters: golden buttercups, cream daisies with amber centers, lavender & wild rose!
            if (hVal <= 5) {
              const flowerCol = isNightLike
                ? hVal % 2 === 0
                  ? 'rgba(110, 231, 183, 0.82)'
                  : 'rgba(196, 181, 253, 0.78)'
                : hVal === 0 || hVal === 4
                  ? '#fde047'
                  : hVal === 1 || hVal === 5
                    ? '#fffdf2'
                    : hVal === 2
                      ? '#d8b4fe'
                      : '#fbcfe8';
              const fx1 = p.sx + 4.4 * cam.zoom;
              const fy1 = p.sy + hh + 1.1 * cam.zoom;
              const fx2 = p.sx + 1.4 * cam.zoom;
              const fy2 = p.sy + hh + 2.7 * cam.zoom;
              ctx.fillStyle = isNightLike ? '#1d4d38' : '#3f8729';
              ctx.beginPath();
              ctx.arc(fx1, fy1 + 0.8 * cam.zoom, 2.4 * cam.zoom, 0, Math.PI * 2);
              ctx.arc(fx2, fy2 + 0.7 * cam.zoom, 1.9 * cam.zoom, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = flowerCol;
              ctx.beginPath();
              ctx.arc(fx1, fy1, 2.15 * cam.zoom, 0, Math.PI * 2);
              ctx.arc(fx2, fy2, 1.65 * cam.zoom, 0, Math.PI * 2);
              if (hVal <= 2) {
                ctx.arc(p.sx - 4.8 * cam.zoom, p.sy + hh - 1.4 * cam.zoom, 1.85 * cam.zoom, 0, Math.PI * 2);
              }
              ctx.fill();
              if (!isNightLike && (hVal === 1 || hVal === 5)) {
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(fx1, fy1, 0.85 * cam.zoom, 0, Math.PI * 2);
                ctx.arc(fx2, fy2, 0.65 * cam.zoom, 0, Math.PI * 2);
                ctx.fill();
              }
            } else if (unlocked && hVal === 14 && gx >= 10 && gx <= 26 && gy >= 21 && gy <= 30) {
              // Warm honey-limestone garden stepping stones scattered naturally around the central Hang Sóc yard!
              ctx.fillStyle = isNightLike ? '#47403a' : '#8a7254';
              ctx.beginPath();
              ctx.ellipse(p.sx - 2.2 * cam.zoom, p.sy + hh + 1.3 * cam.zoom, 4.2 * cam.zoom, 2.1 * cam.zoom, 0.12, 0, Math.PI * 2);
              ctx.ellipse(p.sx + 3.6 * cam.zoom, p.sy + hh - 0.6 * cam.zoom, 3.1 * cam.zoom, 1.6 * cam.zoom, -0.15, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = isNightLike ? '#8a8175' : '#ead8b8';
              ctx.beginPath();
              ctx.ellipse(p.sx - 2.2 * cam.zoom, p.sy + hh + 0.3 * cam.zoom, 4.1 * cam.zoom, 2.0 * cam.zoom, 0.12, 0, Math.PI * 2);
              ctx.ellipse(p.sx + 3.6 * cam.zoom, p.sy + hh - 1.4 * cam.zoom, 3.0 * cam.zoom, 1.5 * cam.zoom, -0.15, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (cell.terrain === 'snow' && hVal < 4) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.76)';
            ctx.beginPath();
            ctx.ellipse(p.sx, p.sy + hh, 3.4 * cam.zoom, 1.6 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // AAA 2.5D Sculpted Mossy Devon Dry-Stone Homestead Perimeter Walls along unlocked zone frontiers!
          if (unlocked && cell.terrain === 'grass' && !sim.state.sandboxMode) {
            const nCellN = sim.grid[gy - 1]?.[gx];
            const nCellW = sim.grid[gy]?.[gx - 1];
            const borderN = Boolean(nCellN && !unlockedSet.has(nCellN.zoneId) && nCellN.terrain !== 'water');
            const borderW = Boolean(nCellW && !unlockedSet.has(nCellW.zoneId) && nCellW.terrain !== 'water');
            if (borderN || borderW) {
              const isGateGap = (gx + gy) % 6 === 2;
              ctx.save();
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              const wallH = Math.max(5.5, 9.8 * cam.zoom);
              const outlineCol = isNightLike ? '#1d1c26' : '#3b2818';
              const wallFaceDark = isNightLike ? '#4f5163' : '#8b7e6e';
              const wallFaceMid = isNightLike ? '#63667a' : '#a69886';
              const wallCapLight = isNightLike ? '#8b8ea3' : '#e6dccb';
              const mossBase = isNightLike ? '#265c3e' : '#53a634';
              const mossHighlight = isNightLike ? '#3c8459' : '#8ce04a';

              const drawStonePillar = (px: number, py: number) => {
                const pw = Math.max(3.6, 6.2 * cam.zoom);
                const ph = wallH * 1.24;
                ctx.fillStyle = isNightLike ? 'rgba(10, 14, 24, 0.52)' : 'rgba(46, 34, 18, 0.36)';
                ctx.beginPath();
                ctx.ellipse(px + 1.5 * cam.zoom, py + 2.2 * cam.zoom, pw * 0.95, pw * 0.52, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = wallFaceDark;
                ctx.strokeStyle = outlineCol;
                ctx.lineWidth = Math.max(1.0, 1.45 * cam.zoom);
                ctx.beginPath();
                ctx.roundRect(px - pw * 0.5, py - ph, pw, ph + 1.5 * cam.zoom, 2.2 * cam.zoom);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = wallCapLight;
                ctx.beginPath();
                ctx.ellipse(px, py - ph, pw * 0.62, pw * 0.36, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = mossBase;
                ctx.beginPath();
                ctx.ellipse(px - 0.6 * cam.zoom, py - ph - 0.4 * cam.zoom, pw * 0.38, pw * 0.22, 0, 0, Math.PI * 2);
                ctx.fill();
              };

              const drawSculptedStoneWall = (ax: number, ay: number, bx: number, by: number, shadedRight: boolean) => {
                if (isGateGap) {
                  drawStonePillar(ax + (bx - ax) * 0.14, ay + (by - ay) * 0.14);
                  drawStonePillar(ax + (bx - ax) * 0.86, ay + (by - ay) * 0.86);
                  return;
                }
                // 1. Warm cast shadow on meadow grass
                ctx.strokeStyle = isNightLike ? 'rgba(8, 12, 24, 0.56)' : 'rgba(44, 34, 18, 0.38)';
                ctx.lineWidth = Math.max(3.0, 6.2 * cam.zoom);
                ctx.beginPath();
                ctx.moveTo(ax + 1.5 * cam.zoom, ay + 2.6 * cam.zoom);
                ctx.lineTo(bx + 1.5 * cam.zoom, by + 2.6 * cam.zoom);
                ctx.stroke();

                // 2. 3D Isometric Stacked Stone Wall Extrusion Quad
                ctx.fillStyle = shadedRight ? wallFaceDark : wallFaceMid;
                ctx.strokeStyle = outlineCol;
                ctx.lineWidth = Math.max(1.0, 1.45 * cam.zoom);
                ctx.beginPath();
                ctx.moveTo(ax, ay + 1.2 * cam.zoom);
                ctx.lineTo(bx, by + 1.2 * cam.zoom);
                ctx.lineTo(bx, by - wallH);
                ctx.lineTo(ax, ay - wallH);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 3. Individual rounded stone course seams inside the wall face
                ctx.strokeStyle = isNightLike ? 'rgba(24, 24, 36, 0.68)' : 'rgba(62, 42, 24, 0.58)';
                ctx.lineWidth = Math.max(0.8, 1.1 * cam.zoom);
                ctx.beginPath();
                ctx.moveTo(ax, ay - wallH * 0.46);
                ctx.lineTo(bx, by - wallH * 0.46);
                for (const tJoint of [0.28, 0.56, 0.82]) {
                  const jx = ax + (bx - ax) * tJoint;
                  const jy = ay + (by - ay) * tJoint;
                  ctx.moveTo(jx, jy + 0.8 * cam.zoom);
                  ctx.lineTo(jx, jy - wallH * 0.46);
                  const jx2 = ax + (bx - ax) * (tJoint - 0.13);
                  const jy2 = ay + (by - ay) * (tJoint - 0.13);
                  ctx.moveTo(jx2, jy2 - wallH * 0.46);
                  ctx.lineTo(jx2, jy2 - wallH);
                }
                ctx.stroke();

                // 4. Sunlit Bevelled Cream-Limestone Top Capstone Coping
                ctx.strokeStyle = outlineCol;
                ctx.lineWidth = Math.max(2.6, 4.8 * cam.zoom);
                ctx.beginPath();
                ctx.moveTo(ax, ay - wallH);
                ctx.lineTo(bx, by - wallH);
                ctx.stroke();

                ctx.strokeStyle = wallCapLight;
                ctx.lineWidth = Math.max(1.6, 3.0 * cam.zoom);
                ctx.beginPath();
                ctx.moveTo(ax, ay - wallH);
                ctx.lineTo(bx, by - wallH);
                ctx.stroke();

                // 5. Plump Velvet-Emerald Moss Cushions draped over stone coping
                for (const mPos of [0.26, 0.72]) {
                  if ((gx + gy) % 2 === 1 && mPos > 0.5) continue;
                  const mx = ax + (bx - ax) * mPos;
                  const my = ay + (by - ay) * mPos - wallH - 0.5 * cam.zoom;
                  ctx.fillStyle = mossBase;
                  ctx.beginPath();
                  ctx.ellipse(mx, my, 4.2 * cam.zoom, 2.0 * cam.zoom, shadedRight ? 0.22 : -0.22, 0, Math.PI * 2);
                  ctx.fill();
                  if (!isNightLike) {
                    ctx.fillStyle = mossHighlight;
                    ctx.beginPath();
                    ctx.ellipse(mx - 0.8 * cam.zoom, my - 0.5 * cam.zoom, 2.3 * cam.zoom, 1.0 * cam.zoom, 0, 0, Math.PI * 2);
                    ctx.fill();
                  }
                }
              };
              if (borderN) {
                drawSculptedStoneWall(p.sx, p.sy, p.sx + hw, p.sy + hh, true);
              }
              if (borderW) {
                drawSculptedStoneWall(p.sx - hw, p.sy + hh, p.sx, p.sy, false);
              }
              ctx.restore();
            }
          }
        }

        if (showGridLines && unlocked) {
          ctx.strokeStyle = 'rgba(255, 248, 224, 0.32)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 2c. Seamless Auto-Tiled Water Shorelines, Lilypads & Ripples
        if (cell.terrain === 'water' && unlocked) {
          self.drawSeamlessWaterDetails(
            sim,
            rx0,
            ry0,
            viewRot,
            gx,
            gy,
            p.sx,
            p.sy,
            hw,
            hh,
            cam.zoom,
            isNightLike,
            forStaticCache
          );
        }

        // 2d. Seamless Auto-Tiled Footpaths, Velvet Queue Ropes & Automatic Arched Wooden Bridges!
        const hasStandingBuilding = Boolean(
          cell.buildingUid && cell.buildingUid !== self.activeMovingUid
        );
        if (cell.path !== 'none' && !hasStandingBuilding && unlocked) {
          terrainDrawAutoTiledPath(self, 
            sim,
            rx0,
            ry0,
            viewRot,
            p.sx,
            p.sy,
            hw,
            hh,
            cell.path,
            cell.terrain === 'water',
            isNightLike,
            cam.zoom
          );
        }

        // 2e. Litter / Spell Backfire puddle (rendered dynamically via overlay when using static ground cache)
        if (!forStaticCache && cell.hasLitter && unlocked) {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.ellipse(p.sx, p.sy + hh, 7 * cam.zoom, 4 * cam.zoom, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(p.sx + 2 * cam.zoom, p.sy + hh - 2 * cam.zoom, 2.6 * cam.zoom, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2f. Active Heatmap Overlay! (O(1) cached lookup per tile)
        if (sim.heatmapMode !== 'none' && unlocked) {
          const heatColor = self.heatmapCache[gy * GRID_SIZE + gx];
          if (heatColor) {
            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(p.sx + hw, p.sy + hh);
            ctx.lineTo(p.sx, p.sy + hh * 2);
            ctx.lineTo(p.sx - hw, p.sy + hh);
            ctx.closePath();
            ctx.fillStyle = heatColor;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // 2g. Sunlit Enchanted Forest Mist Glaze on Locked Zones (bright pastel mist in day, never dark grey!)
        if (!unlocked) {
          ctx.fillStyle = isNightLike
            ? 'rgba(20, 28, 54, 0.46)'
            : cell.terrain === 'snow'
              ? 'rgba(238, 246, 255, 0.26)'
              : 'rgba(218, 242, 216, 0.22)';
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy - 0.35);
          ctx.lineTo(p.sx + shw, p.sy + hh);
          ctx.lineTo(p.sx, p.sy + hh + shh);
          ctx.lineTo(p.sx - shw, p.sy + hh);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
}

export function terrainDrawCachedOrLiveGround(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean,
    showGridLines: boolean,
    unlockedSet: Set<string>
  ): void {
    const canUseViewportCache =
      sim.heatmapMode === 'none' &&
      !showGridLines &&
      viewW > 4 &&
      viewH > 4 &&
      typeof document !== 'undefined';

    if (!canUseViewportCache) {
      terrainRenderGroundTilesLayer(
        self,
        sim,
        cam,
        viewW,
        viewH,
        isNightLike,
        showGridLines,
        unlockedSet,
        false,
        false
      );
      waterDrawOrganicWaterShorelines(self, sim, cam, viewW, viewH, isNightLike, unlockedSet);
      return;
    }

    const viewRot = cam.viewRot ?? 0;
    const stateKey = `aaa_v5|${viewRot}|${isNightLike ? 1 : 0}|${sim.stateRevision}|${sim.state.sandboxMode ? 1 : 0}|${self.activeMovingUid ?? ''}`;
    const zoomChanged = Math.abs(cam.zoom - self.groundCacheLastLiveZoom) > 1e-4;
    self.groundCacheLastLiveZoom = cam.zoom;
    self.groundCacheZoomStableFrames = zoomChanged
      ? 0
      : Math.min(10, self.groundCacheZoomStableFrames + 1);

    if (
      self.groundCacheCanvas &&
      self.groundCacheKey === stateKey &&
      self.groundCacheLogicalW > 0 &&
      self.groundCacheZoom > 0
    ) {
      const scaleRatio = cam.zoom / self.groundCacheZoom;
      const destW = self.groundCacheLogicalW * scaleRatio;
      const destH = self.groundCacheLogicalH * scaleRatio;
      const destX =
        viewW * 0.5 +
        (-self.groundCacheLogicalW * 0.5 / self.groundCacheZoom + self.groundCacheCamX - cam.x) *
          cam.zoom;
      const destY =
        viewH * 0.5 +
        (-self.groundCacheLogicalH * 0.5 / self.groundCacheZoom + self.groundCacheCamY - cam.y) *
          cam.zoom;

      const coversViewport =
        destX <= 0.5 &&
        destY <= 0.5 &&
        destX + destW >= viewW - 0.5 &&
        destY + destH >= viewH - 0.5;
      const exactZoomAndDpr =
        Math.abs(cam.zoom - self.groundCacheZoom) < 1e-4 &&
        Math.abs(self.dpr - self.groundCacheReqDpr) < 0.05;
      const allowTransientZoomScale =
        self.groundCacheZoomStableFrames < 3 && scaleRatio >= 0.62 && scaleRatio <= 1.55;

      if (coversViewport && (exactZoomAndDpr || allowTransientZoomScale)) {
        self.ctx.drawImage(self.groundCacheCanvas, destX, destY, destW, destH);
        waterDrawAnimatedGroundOverlays(self, sim, cam, viewW, viewH, isNightLike, unlockedSet);
        return;
      }
    }

    // While actively pinch-zooming out beyond cached bounds, draw culled 1x viewport until zoom settles
    if (self.groundCacheZoomStableFrames < 2 && zoomChanged) {
      terrainRenderGroundTilesLayer(
        self,
        sim,
        cam,
        viewW,
        viewH,
        isNightLike,
        false,
        unlockedSet,
        false,
        false
      );
      waterDrawOrganicWaterShorelines(self, sim, cam, viewW, viewH, isNightLike, unlockedSet);
      return;
    }

    const padCssX = Math.round(Math.min(340, Math.max(128, viewW * 0.26)));
    const padCssY = Math.round(Math.min(300, Math.max(128, viewH * 0.26)));
    const logicalW = Math.max(1, Math.ceil(viewW + padCssX * 2));
    const logicalH = Math.max(1, Math.ceil(viewH + padCssY * 2));

    // Keep offscreen backing store well below iOS 16 Safari's 16.77M-pixel single-canvas limit
    // and tight on mobile VRAM (<= 4.5M px on touch/iOS, <= 8.5M px on desktop).
    const maxSafeArea = isTouchOrIOSDevice() ? 4_500_000 : 8_500_000;
    const reqDpr = Math.max(1, self.dpr || 1);
    const rawArea = logicalW * logicalH * reqDpr * reqDpr;
    const cacheDpr = rawArea > maxSafeArea ? reqDpr * Math.sqrt(maxSafeArea / rawArea) : reqDpr;
    const cacheW = Math.max(1, Math.round(logicalW * cacheDpr));
    const cacheH = Math.max(1, Math.round(logicalH * cacheDpr));

    if (!self.groundCacheCanvas) {
      self.groundCacheCanvas = document.createElement('canvas');
    }
    if (self.groundCacheCanvas.width !== cacheW || self.groundCacheCanvas.height !== cacheH) {
      self.groundCacheCanvas.width = cacheW;
      self.groundCacheCanvas.height = cacheH;
    }

    const cCtx = self.groundCacheCanvas.getContext('2d');
    if (!cCtx) {
      terrainRenderGroundTilesLayer(
        self,
        sim,
        cam,
        viewW,
        viewH,
        isNightLike,
        false,
        unlockedSet,
        false,
        false
      );
      waterDrawOrganicWaterShorelines(self, sim, cam, viewW, viewH, isNightLike, unlockedSet);
      return;
    }

    cCtx.setTransform(cacheDpr, 0, 0, cacheDpr, 0, 0);
    cCtx.clearRect(0, 0, logicalW, logicalH);

    const savedCtx = self.ctx;
    self.ctx = cCtx;
    const cacheCam: Camera = {
      x: cam.x,
      y: cam.y,
      zoom: cam.zoom,
      viewRot,
    };
    try {
      terrainRenderGroundTilesLayer(
        self,
        sim,
        cacheCam,
        logicalW,
        logicalH,
        isNightLike,
        false,
        unlockedSet,
        false,
        true
      );
      waterDrawOrganicWaterShorelines(self, sim, cacheCam, logicalW, logicalH, isNightLike, unlockedSet);
    } finally {
      self.ctx = savedCtx;
    }

    self.groundCacheKey = stateKey;
    self.groundCacheCamX = cam.x;
    self.groundCacheCamY = cam.y;
    self.groundCacheZoom = cam.zoom;
    self.groundCacheLogicalW = logicalW;
    self.groundCacheLogicalH = logicalH;
    self.groundCacheReqDpr = reqDpr;

    self.ctx.drawImage(self.groundCacheCanvas, -padCssX, -padCssY, logicalW, logicalH);
    waterDrawAnimatedGroundOverlays(self, sim, cam, viewW, viewH, isNightLike, unlockedSet);
}

export function terrainDrawScrollingCloudShadows(self: IsometricRenderer, 
    cam: Camera,
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void {
    if (period === 'night' || weather.kind === 'storm' || weather.kind === 'rain') return;
    const ctx = self.ctx;
    ctx.save();
    const alpha = weather.kind === 'cloudy' ? 0.085 : 0.055;
    ctx.fillStyle = `rgba(22, 38, 62, ${alpha})`;
    const t = self.reducedMotion ? 0 : self.tick * 0.35;
    const spanX = GRID_SIZE * TILE_W;
    const spanY = GRID_SIZE * TILE_H * 0.88;
    for (let i = 0; i < 7; i++) {
      const wx = ((i * 820 + t) % spanX) - spanX * 0.5;
      const wy = 180 + ((i * 390 + t * 0.35) % spanY);
      const sx = viewW * 0.5 + (wx - cam.x) * cam.zoom;
      const sy = viewH * 0.5 + (wy - cam.y) * cam.zoom;
      const rx = (210 + (i % 3) * 65) * cam.zoom;
      const ry = rx * 0.48;
      if (sx + rx < 0 || sx - rx > viewW || sy + ry < 0 || sy - ry > viewH) continue;
      ctx.beginPath();
      ctx.ellipse(sx, sy, rx, ry, -0.18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
}

export function terrainDrawAutoTiledPath(self: IsometricRenderer, 
    sim: ParkSimulation,
    rx0: number,
    ry0: number,
    viewRot: 0 | 1 | 2 | 3,
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    path: string,
    overWater: boolean,
    isNight: boolean,
    zoom: number
  ): void {
    const ctx = self.ctx;
    const hasNeighborRot = (nrx: number, nry: number) => {
      if (nrx < 0 || nry < 0 || nrx >= GRID_SIZE || nry >= GRID_SIZE) return false;
      const { gx: nx, gy: ny } = rotTileToWorldTile(nrx, nry, viewRot);
      const nc = sim.grid[ny]?.[nx];
      return Boolean(nc && (nc.path !== 'none' || Boolean(nc.buildingUid)));
    };

    const connN = hasNeighborRot(rx0, ry0 - 1); // Screen top-right edge
    const connE = hasNeighborRot(rx0 + 1, ry0); // Screen bottom-right edge
    const connS = hasNeighborRot(rx0, ry0 + 1); // Screen bottom-left edge
    const connW = hasNeighborRot(rx0 - 1, ry0); // Screen top-left edge

    const { gx: tileGx, gy: tileGy } = rotTileToWorldTile(rx0, ry0, viewRot);

    // Rustic Flat Isometric Oak Plank Boardwalk Bridge when path crosses water — EXCEPT at the 2 scenic 2.5D Arched Stone River Bridges!
    if (overWater) {
      if (tileGx >= 3 && tileGx <= 5 && (tileGy === 22 || tileGy === 34)) {
        return;
      }
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Soft marsh water shadow beneath boardwalk planks
      ctx.fillStyle = 'rgba(14, 38, 42, 0.38)';
      ctx.beginPath();
      ctx.moveTo(sx, sy + 4 * zoom);
      ctx.lineTo(sx + hw * 0.96, sy + hh + 4 * zoom);
      ctx.lineTo(sx, sy + hh * 2 + 4 * zoom);
      ctx.lineTo(sx - hw * 0.96, sy + hh + 4 * zoom);
      ctx.closePath();
      ctx.fill();

      // Submerged oak timber pilings on front corners
      ctx.fillStyle = '#4a2912';
      ctx.strokeStyle = '#261407';
      ctx.lineWidth = Math.max(1, 1.3 * zoom);
      for (const pxOff of [-hw * 0.62, 0, hw * 0.62]) {
        const pyBase = sy + hh + (1 - Math.abs(pxOff) / hw) * hh;
        ctx.fillRect(sx + pxOff - 2.4 * zoom, pyBase - 2 * zoom, 4.8 * zoom, 9 * zoom);
        ctx.strokeRect(sx + pxOff - 2.4 * zoom, pyBase - 2 * zoom, 4.8 * zoom, 9 * zoom);
      }

      const deckLift = 2.5 * zoom;
      const dTop = { x: sx, y: sy - deckLift };
      const dRight = { x: sx + hw * 0.96, y: sy + hh - deckLift };
      const dBottom = { x: sx, y: sy + hh * 2 - deckLift };
      const dLeft = { x: sx - hw * 0.96, y: sy + hh - deckLift };

      // 3D front plank thickness skirt
      const skirt = 4.2 * zoom;
      ctx.fillStyle = isNight ? '#5c3518' : '#8c5125';
      ctx.strokeStyle = '#361c0a';
      ctx.lineWidth = Math.max(1.1, 1.5 * zoom);
      ctx.beginPath();
      ctx.moveTo(dLeft.x, dLeft.y);
      ctx.lineTo(dBottom.x, dBottom.y);
      ctx.lineTo(dRight.x, dRight.y);
      ctx.lineTo(dRight.x, dRight.y + skirt);
      ctx.lineTo(dBottom.x, dBottom.y + skirt);
      ctx.lineTo(dLeft.x, dLeft.y + skirt);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sunlit oak boardwalk deck surface
      ctx.fillStyle = isNight ? '#7c4d2b' : '#c98445';
      ctx.strokeStyle = '#3b1f0c';
      ctx.lineWidth = Math.max(1.2, 1.7 * zoom);
      ctx.beginPath();
      ctx.moveTo(dTop.x, dTop.y);
      ctx.lineTo(dRight.x, dRight.y);
      ctx.lineTo(dBottom.x, dBottom.y);
      ctx.lineTo(dLeft.x, dLeft.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Individual transverse wooden plank seams + warm grain highlights
      const alongSE = (connE || connW) && !(connN && connS);
      ctx.strokeStyle = 'rgba(58, 30, 10, 0.68)';
      ctx.lineWidth = Math.max(1, 1.35 * zoom);
      for (const u of [-0.6, -0.2, 0.2, 0.6]) {
        ctx.beginPath();
        if (alongSE) {
          // Bridge runs top-left to bottom-right (+gx): planks run bottom-left to top-right!
          const cxP = sx + u * hw * 0.48;
          const cyP = sy + hh - deckLift + u * hh * 0.48;
          ctx.moveTo(cxP - hw * 0.45, cyP + hh * 0.45);
          ctx.lineTo(cxP + hw * 0.45, cyP - hh * 0.45);
        } else {
          const cxP = sx + u * hw * 0.48;
          const cyP = sy + hh - deckLift - u * hh * 0.48;
          ctx.moveTo(cxP - hw * 0.45, cyP - hh * 0.45);
          ctx.lineTo(cxP + hw * 0.45, cyP + hh * 0.45);
        }
        ctx.stroke();
      }

      // Low rustic side stringer timbers on open water edges (no modern streetlamps!)
      const sideBeams: Array<[boolean, { x: number; y: number }, { x: number; y: number }]> = [
        [!connN, dTop, dRight],
        [!connE, dRight, dBottom],
        [!connS, dBottom, dLeft],
        [!connW, dLeft, dTop],
      ];
      for (const [openEdge, p1, p2] of sideBeams) {
        if (!openEdge) continue;
        ctx.strokeStyle = '#3b1f0c';
        ctx.lineWidth = Math.max(2.4, 3.8 * zoom);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.strokeStyle = isNight ? '#8c5830' : '#deb887';
        ctx.lineWidth = Math.max(1.2, 1.9 * zoom);
        ctx.stroke();
      }

      ctx.restore();
      return;
    }

    const groundTerrain = sim.grid[tileGy]?.[tileGx]?.terrain ?? 'grass';

    // AAA Warm Honey-Gold 2.5D Homestead Cobblestone Lane (`cobble` on grass/stone/forest): 9 chunky bevelled river stones + grass tufts!
    if (path === 'cobble' && (groundTerrain === 'grass' || groundTerrain === 'forest' || groundTerrain === 'stone')) {
      const inN = connN ? 1.05 : 0.88;
      const inE = connE ? 1.05 : 0.88;
      const inS = connS ? 1.05 : 0.88;
      const inW = connW ? 1.05 : 0.88;
      const pTopC = { x: sx, y: sy + hh * (1 - (inN + inW) * 0.5) };
      const pRightC = { x: sx + hw * ((inN + inE) * 0.5), y: sy + hh };
      const pBottomC = { x: sx, y: sy + hh * (1 + (inE + inS) * 0.5) };
      const pLeftC = { x: sx - hw * ((inS + inW) * 0.5), y: sy + hh };
      const mortarCol = isNight ? '#524234' : '#c49c68';
      const curbColC = isNight ? '#2e2116' : '#54391d';

      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // 1. Seamless warm golden-tan mortar roadbed connecting neighboring cobble tiles
      ctx.beginPath();
      ctx.moveTo(pTopC.x, pTopC.y);
      ctx.lineTo(pRightC.x, pRightC.y);
      ctx.lineTo(pBottomC.x, pBottomC.y);
      ctx.lineTo(pLeftC.x, pLeftC.y);
      ctx.closePath();
      ctx.fillStyle = mortarCol;
      ctx.fill();
      if (!connN || !connE || !connS || !connW) {
        ctx.strokeStyle = mortarCol;
        ctx.lineWidth = Math.max(2.6, 5.2 * zoom);
        ctx.stroke();
      }

      // 2. Nine interlocking multi-toned honey-gold 2.5D cobble slabs with 3D bottom drop & sunlit top rim
      const alongSE = (connE || connW) && !(connN && connS);
      const slabs: Array<[number, number, number, number, number]> = alongSE
        ? [
            [-0.58, -0.32, 6.2, 3.3, 0],
            [-0.08, -0.36, 6.6, 3.5, 1],
            [0.44, -0.28, 6.0, 3.2, 2],
            [-0.36, 0.04, 6.4, 3.4, 2],
            [0.14, 0.0, 6.8, 3.6, 0],
            [0.60, 0.10, 5.6, 3.0, 1],
            [-0.46, 0.38, 5.8, 3.1, 1],
            [0.02, 0.36, 6.5, 3.4, 2],
            [0.48, 0.40, 5.9, 3.1, 0],
          ]
        : [
            [-0.32, -0.58, 6.2, 3.3, 0],
            [-0.36, -0.08, 6.6, 3.5, 1],
            [-0.28, 0.44, 6.0, 3.2, 2],
            [0.04, -0.36, 6.4, 3.4, 2],
            [0.0, 0.14, 6.8, 3.6, 0],
            [0.10, 0.60, 5.6, 3.0, 1],
            [0.38, -0.46, 5.8, 3.1, 1],
            [0.36, 0.02, 6.5, 3.4, 2],
            [0.40, 0.48, 5.9, 3.1, 0],
          ];
      const stoneTonesDay = ['#faebd0', '#eed5a7', '#dfb97f'];
      const stoneTonesNight = ['#968a7a', '#847868', '#746858'];
      for (const [u, v, rw, rh, toneIdx] of slabs) {
        const px = sx + (u - v) * hw * 0.46;
        const py = sy + hh + (u + v) * hh * 0.46;
        // 3D bottom bevel shadow
        ctx.fillStyle = isNight ? '#2a221b' : '#6e4d2c';
        ctx.beginPath();
        ctx.ellipse(px, py + 1.85 * zoom, rw * zoom, rh * zoom, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sculpted honey-limestone face
        ctx.fillStyle = isNight ? stoneTonesNight[toneIdx] : stoneTonesDay[toneIdx];
        ctx.strokeStyle = isNight ? '#382e25' : '#54391d';
        ctx.lineWidth = Math.max(0.95, 1.35 * zoom);
        ctx.beginPath();
        ctx.ellipse(px, py, rw * zoom, rh * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sunlit top-left specular bevel highlight
        if (!isNight) {
          ctx.fillStyle = 'rgba(255, 253, 240, 0.72)';
          ctx.beginPath();
          ctx.ellipse(px - 1.2 * zoom, py - 0.85 * zoom, rw * 0.54 * zoom, rh * 0.45 * zoom, -0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Rounded stone curb + lush emerald grass tufts overlapping outer road shoulders
      const cobbleCurbs: Array<[boolean, { x: number; y: number }, { x: number; y: number }]> = [
        [!connN, pTopC, pRightC],
        [!connE, pRightC, pBottomC],
        [!connS, pBottomC, pLeftC],
        [!connW, pLeftC, pTopC],
      ];
      ctx.strokeStyle = curbColC;
      ctx.lineWidth = Math.max(1.2, 1.85 * zoom);
      for (const [isOuter, a, bPt] of cobbleCurbs) {
        if (!isOuter) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(bPt.x, bPt.y);
        ctx.stroke();

        if (groundTerrain === 'grass') {
          const mx = (a.x + bPt.x) * 0.5;
          const my = (a.y + bPt.y) * 0.5;
          ctx.fillStyle = isNight ? '#2c6144' : '#5bb538';
          ctx.beginPath();
          ctx.ellipse(mx, my, 3.0 * zoom, 1.45 * zoom, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return;
    }

    // Rural Hang Sóc Warm Garden Dirt Trail (`wood_pier` on grass) — seamless auto-tiled ribbon!
    if (path === 'wood_pier' && groundTerrain === 'grass') {
      const inN = connN ? 1.03 : 0.78;
      const inE = connE ? 1.03 : 0.78;
      const inS = connS ? 1.03 : 0.78;
      const inW = connW ? 1.03 : 0.78;
      const pTopD = { x: sx, y: sy + hh * (1 - (inN + inW) * 0.5) };
      const pRightD = { x: sx + hw * ((inN + inE) * 0.5), y: sy + hh };
      const pBottomD = { x: sx, y: sy + hh * (1 + (inE + inS) * 0.5) };
      const pLeftD = { x: sx - hw * ((inS + inW) * 0.5), y: sy + hh };
      const dirtFill = isNight ? '#6e553b' : '#cfa876';
      const dirtCurb = isNight ? '#4a3724' : '#8f693e';

      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pTopD.x, pTopD.y);
      ctx.lineTo(pRightD.x, pRightD.y);
      ctx.lineTo(pBottomD.x, pBottomD.y);
      ctx.lineTo(pLeftD.x, pLeftD.y);
      ctx.closePath();
      ctx.fillStyle = dirtFill;
      ctx.fill();
      if (!connN || !connE || !connS || !connW) {
        ctx.strokeStyle = dirtFill;
        ctx.lineWidth = Math.max(2, 3.8 * zoom);
        ctx.stroke();
      }

      // Subtle sunlit garden pebbles
      ctx.fillStyle = isNight ? 'rgba(42, 30, 18, 0.25)' : 'rgba(138, 98, 56, 0.24)';
      ctx.beginPath();
      ctx.ellipse(sx - 5 * zoom, sy + hh - 1.5 * zoom, 3.1 * zoom, 1.5 * zoom, 0, 0, Math.PI * 2);
      ctx.ellipse(sx + 4.8 * zoom, sy + hh + 1.8 * zoom, 3.2 * zoom, 1.5 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isNight ? 'rgba(226, 210, 185, 0.12)' : 'rgba(255, 244, 218, 0.36)';
      ctx.beginPath();
      ctx.ellipse(sx + 0.8 * zoom, sy + hh - 2.6 * zoom, 2.8 * zoom, 1.3 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soft grassy dirt edge ONLY on unconnected outer sides (no per-tile grid boxes!)
      const dirtEdges: Array<[boolean, { x: number; y: number }, { x: number; y: number }]> = [
        [!connN, pTopD, pRightD],
        [!connE, pRightD, pBottomD],
        [!connS, pBottomD, pLeftD],
        [!connW, pLeftD, pTopD],
      ];
      ctx.strokeStyle = dirtCurb;
      ctx.lineWidth = Math.max(1.1, 1.7 * zoom);
      for (const [isOuter, a, bPt] of dirtEdges) {
        if (!isOuter) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(bPt.x, bPt.y);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // Palette selection — warm sunlit Hogsmeade cream-sandstone cobbles & cozy rounded curbs!
    let fillCol = isNight ? '#877a6b' : '#e4d5b7';
    let curbCol = isNight ? '#4a3726' : '#7a5638';
    let stoneDotDark = isNight ? 'rgba(42, 30, 20, 0.22)' : 'rgba(138, 102, 66, 0.24)';
    let stoneDotLight = isNight ? 'rgba(226, 214, 196, 0.12)' : 'rgba(255, 250, 238, 0.48)';
    if (path === 'snow_brick') {
      fillCol = isNight ? '#94a3b8' : '#e2edf8';
      curbCol = '#64748b';
      stoneDotDark = 'rgba(100, 116, 139, 0.22)';
      stoneDotLight = 'rgba(255, 255, 255, 0.65)';
    } else if (path === 'queue_gold') {
      fillCol = isNight ? '#7f1d1d' : '#b91c1c';
      curbCol = '#fbbf24';
      stoneDotDark = 'rgba(69, 10, 10, 0.24)';
      stoneDotLight = 'rgba(254, 202, 202, 0.18)';
    } else if (path === 'wood_pier') {
      fillCol = isNight ? '#5c3a21' : '#9a5b2d';
      curbCol = '#4a2c16';
      stoneDotDark = 'rgba(69, 26, 3, 0.26)';
      stoneDotLight = 'rgba(253, 230, 138, 0.16)';
    }

    // Full seamless tile fill when connected, inset softly with rounded corners on unconnected edges!
    const inN = connN ? 1.03 : 0.84;
    const inE = connE ? 1.03 : 0.84;
    const inS = connS ? 1.03 : 0.84;
    const inW = connW ? 1.03 : 0.84;

    const pTop = { x: sx, y: sy + hh * (1 - (inN + inW) * 0.5) };
    const pRight = { x: sx + hw * ((inN + inE) * 0.5), y: sy + hh };
    const pBottom = { x: sx, y: sy + hh * (1 + (inE + inS) * 0.5) };
    const pLeft = { x: sx - hw * ((inS + inW) * 0.5), y: sy + hh };

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.lineTo(pBottom.x, pBottom.y);
    ctx.lineTo(pLeft.x, pLeft.y);
    ctx.closePath();
    ctx.fillStyle = fillCol;
    ctx.fill();
    // Rounded stroke in same fillCol softens sharp diamond corners on path ends & bends!
    if (!connN || !connE || !connS || !connW) {
      ctx.strokeStyle = fillCol;
      ctx.lineWidth = Math.max(2, 4.2 * zoom);
      ctx.stroke();
    }

    // Warm storybook cobblestone pebbles
    ctx.fillStyle = stoneDotDark;
    ctx.beginPath();
    ctx.ellipse(sx - 6 * zoom, sy + hh - 2 * zoom, 3.6 * zoom, 1.8 * zoom, 0, 0, Math.PI * 2);
    ctx.ellipse(sx + 5.5 * zoom, sy + hh + 2.2 * zoom, 3.8 * zoom, 1.8 * zoom, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = stoneDotLight;
    ctx.beginPath();
    ctx.ellipse(sx + 1 * zoom, sy + hh - 3.2 * zoom, 3.0 * zoom, 1.4 * zoom, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw outer stone curbs / velvet queue ropes ONLY on unconnected borders!
    const curbEdges: Array<[boolean, { x: number; y: number }, { x: number; y: number }]> = [
      [!connN, pTop, pRight],
      [!connE, pRight, pBottom],
      [!connS, pBottom, pLeft],
      [!connW, pLeft, pTop],
    ];
    ctx.strokeStyle = curbCol;
    ctx.lineWidth = path === 'queue_gold' ? Math.max(1.6, 2.3 * zoom) : Math.max(1, 1.6 * zoom);
    for (const [isOuter, a, bPt] of curbEdges) {
      if (!isOuter) continue;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(bPt.x, bPt.y);
      ctx.stroke();

      // Golden velvet stanchion posts on Queue Gold!
      if (path === 'queue_gold') {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(a.x - 1.5 * zoom, a.y - 6 * zoom, 3 * zoom, 6 * zoom);
      }
    }
    ctx.restore();
}

export function terrainDrawAutoTiledZooFence(self: IsometricRenderer, 
    sim: ParkSimulation,
    rx0: number,
    ry0: number,
    viewRot: 0 | 1 | 2 | 3,
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    zoom: number
  ): void {
    const ctx = self.ctx;
    const cy = sy + hh;
    const hasFenceRot = (nrx: number, nry: number) => {
      if (nrx < 0 || nry < 0 || nrx >= GRID_SIZE || nry >= GRID_SIZE) return false;
      const { gx: nx, gy: ny } = rotTileToWorldTile(nrx, nry, viewRot);
      return Boolean(sim.grid[ny]?.[nx] && (sim.grid[ny][nx].zooFence || sim.grid[ny][nx].buildingUid !== null));
    };

    // Center stone rune pillar
    ctx.fillStyle = '#78716c';
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1.4;
    ctx.fillRect(sx - 3 * zoom, cy - 13 * zoom, 6 * zoom, 13 * zoom);
    ctx.strokeRect(sx - 3 * zoom, cy - 13 * zoom, 6 * zoom, 13 * zoom);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sx, cy - 15 * zoom, 2.4 * zoom, 0, Math.PI * 2);
    ctx.fill();

    // Connect iron rails to neighboring fence tiles
    const dirs: Array<[boolean, number, number]> = [
      [hasFenceRot(rx0, ry0 - 1), sx + hw * 0.5, sy + hh * 0.5],
      [hasFenceRot(rx0 + 1, ry0), sx + hw * 0.5, sy + hh * 1.5],
      [hasFenceRot(rx0, ry0 + 1), sx - hw * 0.5, sy + hh * 1.5],
      [hasFenceRot(rx0 - 1, ry0), sx - hw * 0.5, sy + hh * 0.5],
    ];
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 2.2 * zoom;
    for (const [conn, tx, ty] of dirs) {
      if (!conn) continue;
      ctx.beginPath();
      ctx.moveTo(sx, cy - 9 * zoom);
      ctx.lineTo(tx, ty - 9 * zoom);
      ctx.moveTo(sx, cy - 4 * zoom);
      ctx.lineTo(tx, ty - 4 * zoom);
      ctx.stroke();
    }
}

export function terrainDrawCoasterTrackPiece(self: IsometricRenderer, 
    sim: ParkSimulation,
    rx0: number,
    ry0: number,
    viewRot: 0 | 1 | 2 | 3,
    elev: number,
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    zoom: number
  ): void {
    const ctx = self.ctx;
    const cy = sy + hh - 6 * zoom;

    // Wooden trestle support structure down to ground!
    const supportHeight = (8 + elev * ELEV_PX) * zoom;
    ctx.strokeStyle = '#5c3a21';
    ctx.lineWidth = 2.2 * zoom;
    ctx.beginPath();
    ctx.moveTo(sx - 6 * zoom, cy);
    ctx.lineTo(sx - 6 * zoom, cy + supportHeight);
    ctx.moveTo(sx + 6 * zoom, cy);
    ctx.lineTo(sx + 6 * zoom, cy + supportHeight);
    ctx.stroke();

    const isTrackOrStationRot = (nrx: number, nry: number): { ok: boolean; nElev: number } => {
      if (nrx < 0 || nry < 0 || nrx >= GRID_SIZE || nry >= GRID_SIZE) return { ok: false, nElev: elev };
      const { gx: nx, gy: ny } = rotTileToWorldTile(nrx, nry, viewRot);
      const c = sim.grid[ny]?.[nx];
      if (!c) return { ok: false, nElev: elev };
      if (c.coasterTrack) return { ok: true, nElev: c.elevation };
      if (c.buildingUid) {
        const b = self.buildingMap.get(c.buildingUid);
        const bit = b ? getCatalogItem(b.itemId) : undefined;
        return { ok: Boolean(bit?.isCustomCoasterStation), nElev: c.elevation };
      }
      return { ok: false, nElev: elev };
    };

    const neighbors: Array<[number, number, number, number]> = [
      [rx0, ry0 - 1, sx + hw * 0.5, sy + hh * 0.5],
      [rx0 + 1, ry0, sx + hw * 0.5, sy + hh * 1.5],
      [rx0, ry0 + 1, sx - hw * 0.5, sy + hh * 1.5],
      [rx0 - 1, ry0, sx - hw * 0.5, sy + hh * 0.5],
    ];

    let drewAny = false;
    for (const [nrx, nry, ex, ey] of neighbors) {
      const check = isTrackOrStationRot(nrx, nry);
      if (!check.ok) continue;
      drewAny = true;
      const eDiffPx = ((check.nElev - elev) * ELEV_PX * 0.5) * zoom;
      const targetY = ey - 6 * zoom - eDiffPx;

      // Cross-tie & twin brass rails
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 5 * zoom;
      ctx.beginPath();
      ctx.moveTo(sx, cy);
      ctx.lineTo(ex, targetY);
      ctx.stroke();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2 * zoom;
      ctx.beginPath();
      ctx.moveTo(sx - 2 * zoom, cy - 1 * zoom);
      ctx.lineTo(ex - 2 * zoom, targetY - 1 * zoom);
      ctx.moveTo(sx + 2 * zoom, cy + 1 * zoom);
      ctx.lineTo(ex + 2 * zoom, targetY + 1 * zoom);
      ctx.stroke();

      // V3 System #5: Brass Chain-Lift Teeth on uphill slopes!
      if (check.nElev !== elev) {
        ctx.save();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.6 * zoom;
        ctx.setLineDash([2.2 * zoom, 2.2 * zoom]);
        ctx.beginPath();
        ctx.moveTo(sx, cy);
        ctx.lineTo(ex, targetY);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (!drewAny) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(sx, cy, 9 * zoom, 5 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();
    }
}

export function terrainDrawCoasterVehicleSprite(self: IsometricRenderer, sx: number, sy: number, zoom: number, _flipX: boolean): void {
    const ctx = self.ctx;
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(sx, sy, 8 * zoom, 0, Math.PI * 2);
    ctx.fill();
}

export function terrainRebuildHeatmapCache(self: IsometricRenderer, 
    sim: ParkSimulation,
    mode: HeatmapMode,
    unlockedSet: Set<string>,
    now: number
  ): void {
    self.heatmapCacheAt = now;
    self.heatmapCacheMode = mode;
    self.heatmapCacheBuildingCount = sim.state.buildings.length;

    const wonderEmitters: Array<{ cx: number; cy: number; power: number }> = [];
    if (mode === 'wonder') {
      for (const b of sim.state.buildings) {
        const it = getCatalogItem(b.itemId);
        if (!it || it.wonder <= 0) continue;
        wonderEmitters.push({
          cx: b.gx + 0.5,
          cy: b.gy + 0.5,
          power: it.wonder * b.stars,
        });
      }
    }

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const cell = sim.grid[gy][gx];
        const idx = gy * GRID_SIZE + gx;
        if (!sim.state.sandboxMode && !unlockedSet.has(cell.zoneId)) {
          self.heatmapCache[idx] = null;
          continue;
        }
        self.heatmapCache[idx] = terrainComputeTileHeatmapColor(self, sim, gx, gy, mode, wonderEmitters);
      }
    }
}

export function terrainComputeTileHeatmapColor(self: IsometricRenderer, 
    sim: ParkSimulation,
    gx: number,
    gy: number,
    mode: HeatmapMode,
    wonderEmitters?: Array<{ cx: number; cy: number; power: number }>
  ): string | null {
    const cell = sim.grid[gy][gx];
    if (mode === 'cleanliness') {
      if (cell.hasLitter) return 'rgba(239, 68, 68, 0.72)';
      // Check backstage shielding / penalty radius
      for (const [uid, ev] of sim.backstageCache.entries()) {
        const hut = self.buildingMap.get(uid);
        if (!hut) continue;
        if (Math.hypot(hut.gx + 1 - gx, hut.gy + 1 - gy) <= 3.8) {
          return ev.isShielded ? 'rgba(16, 185, 129, 0.55)' : 'rgba(239, 68, 68, 0.62)';
        }
      }
      return cell.path !== 'none' ? 'rgba(34, 197, 94, 0.42)' : 'rgba(56, 189, 248, 0.12)';
    }

    if (mode === 'wonder') {
      let score = 0;
      const emitters = wonderEmitters ?? [];
      for (const em of emitters) {
        const dx = em.cx - gx;
        const dy = em.cy - gy;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) continue;
        const d = Math.hypot(dx, dy);
        if (d <= 5) score += em.power * (1 - d / 6);
      }
      if (score >= 8) return 'rgba(250, 204, 21, 0.45)';
      if (score >= 3) return 'rgba(56, 189, 248, 0.32)';
      return 'rgba(148, 163, 184, 0.18)';
    }

    if (mode === 'biome') {
      for (const [uid, bio] of sim.biomeCache.entries()) {
        const hab = self.buildingMap.get(uid);
        if (!hab) continue;
        if (Math.hypot(hab.gx + 1 - gx, hab.gy + 1 - gy) <= 4) {
          return bio.score >= 80
            ? 'rgba(34, 197, 94, 0.45)'
            : bio.score >= 55
              ? 'rgba(250, 204, 21, 0.38)'
              : 'rgba(248, 113, 113, 0.42)';
        }
      }
      return null;
    }

    return null;
}

export function terrainDrawDiamondOutline(self: IsometricRenderer, 
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    fill: string,
    stroke: string
  ): void {
    const ctx = self.ctx;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + hw, sy + hh);
    ctx.lineTo(sx, sy + hh * 2);
    ctx.lineTo(sx - hw, sy + hh);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
}

export function terrainRectScreenCorners(self: IsometricRenderer, 
    gx: number,
    gy: number,
    bw: number,
    bh: number,
    cam: Camera,
    viewW: number,
    viewH: number,
    zOff: number
  ): {
    pTop: { sx: number; sy: number };
    pRight: { sx: number; sy: number };
    pBottom: { sx: number; sy: number };
    pLeft: { sx: number; sy: number };
  } {
    const { rx0, ry0, rbw, rbh } = rotateGridRect(gx, gy, bw, bh, cam.viewRot ?? 0);
    const toScreen = (rx: number, ry: number) => {
      const wx = (rx - ry) * (TILE_W * 0.5);
      const wy = (rx + ry) * (TILE_H * 0.5);
      return {
        sx: viewW * 0.5 + (wx - cam.x) * cam.zoom,
        sy: viewH * 0.5 + (wy - zOff - cam.y) * cam.zoom,
      };
    };
    return {
      pTop: toScreen(rx0, ry0),
      pRight: toScreen(rx0 + rbw, ry0),
      pBottom: toScreen(rx0 + rbw, ry0 + rbh),
      pLeft: toScreen(rx0, ry0 + rbh),
    };
}

export function terrainDrawLockedForestProp(self: IsometricRenderer, 
    prop: LockedSceneryProp,
    sx: number,
    sy: number,
    zoom: number,
    shadowVec: { dx: number; dy: number; alpha: number },
    isNight: boolean
  ): void {
    const rawSp = self.sprites.get(prop.spriteKey);
    if (!rawSp) return;
    const ctx = self.ctx;
    const isGroundCover =
      prop.spriteKey === 'env_flower_patch' ||
      prop.spriteKey === 'env_bush_flowers' ||
      prop.spriteKey === 'env_mossy_rock';
    const baseW = (isGroundCover ? 34 : 58) * prop.scale * zoom;
    const drawH = baseW * (rawSp.height / rawSp.width);
    const sp = self.sprites.getMip(prop.spriteKey, baseW * self.dpr) ?? rawSp;

    ctx.save();
    // Soft dappled forest canopy shadow
    ctx.fillStyle = isNight ? 'rgba(10, 14, 28, 0.26)' : 'rgba(34, 62, 28, 0.2)';
    ctx.beginPath();
    ctx.ellipse(
      sx + shadowVec.dx * 0.35 * zoom,
      sy + 1.5 * zoom,
      baseW * 0.36,
      baseW * 0.17,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 2.5D Traveling Wind Gust Shear: roots stay planted on soil while canopy sways organically!
    const isRock = prop.spriteKey === 'env_mossy_rock';
    const windWave =
      self.reducedMotion || isRock
        ? 0
        : Math.sin(self.tick * 0.036 - prop.gx * 0.28 - prop.gy * 0.19) *
          (isGroundCover ? 0.028 : 0.046);
    ctx.translate(sx, sy + 4 * zoom);
    if (windWave !== 0) {
      ctx.transform(1, 0, windWave, 1, 0, 0);
    }
    if (prop.flipX) ctx.scale(-1, 1);
    ctx.globalAlpha = isNight ? 0.86 : 0.96;
    ctx.drawImage(sp, -baseW * 0.5, -drawH, baseW, drawH);
    ctx.restore();
}

/**
 * AAA Scenic 2.5D Arched Mossy Stone Bridge spanning River Ottery crossings (`gy = 22` & `gy = 34`),
 * complete with foaming whitewater mist & river-boulder abutments (Mockup 1).
 */
export function terrainDrawScenicRiverBridge(
  self: IsometricRenderer,
  gxCenter: number,
  gyCenter: number,
  elev: number,
  cam: Camera,
  viewW: number,
  viewH: number,
  isNight: boolean
): void {
  const rawBridge = self.sprites.get('hogsmeade_stone_bridge');
  if (!rawBridge) return;
  const ctx = self.ctx;
  const zoom = cam.zoom;
  const pt = gridToScreen(gxCenter, gyCenter, cam, viewW, viewH, elev * ELEV_PX);
  const drawW = TILE_W * 2.58 * zoom;
  const drawH = drawW * (rawBridge.height / rawBridge.width);
  const sp = self.sprites.getMip('hogsmeade_stone_bridge', drawW * self.dpr) ?? rawBridge;

  ctx.save();
  // 1. Foaming whitewater mist & shimmering turquoise arch reflection beneath bridge
  const mistPulse = self.reducedMotion ? 1 : 0.88 + Math.sin(self.tick * 0.06 + gyCenter) * 0.12;
  const mistGrad = ctx.createRadialGradient(
    pt.sx,
    pt.sy + 6 * zoom,
    4 * zoom,
    pt.sx,
    pt.sy + 6 * zoom,
    drawW * 0.46
  );
  mistGrad.addColorStop(
    0,
    isNight ? `rgba(165, 243, 252, ${0.28 * mistPulse})` : `rgba(255, 255, 255, ${0.56 * mistPulse})`
  );
  mistGrad.addColorStop(0.55, isNight ? 'rgba(56, 189, 248, 0.12)' : 'rgba(224, 247, 250, 0.28)');
  mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = mistGrad;
  ctx.beginPath();
  ctx.ellipse(pt.sx, pt.sy + 6 * zoom, drawW * 0.46, drawW * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Warm bridge arch shadow cast into river current
  ctx.fillStyle = isNight ? 'rgba(8, 22, 38, 0.44)' : 'rgba(14, 58, 72, 0.34)';
  ctx.beginPath();
  ctx.ellipse(pt.sx + 4 * zoom, pt.sy + 9 * zoom, drawW * 0.38, drawW * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. 2.5D Painted Arched Mossy Stone Bridge Sprite
  const rotMod = (cam.viewRot ?? 0) % 4;
  ctx.translate(pt.sx, pt.sy + drawH * 0.34);
  if (rotMod === 1 || rotMod === 3) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(sp, -drawW * 0.5, -drawH, drawW, drawH);
  ctx.restore();
}

/**
 * AAA Chunky 2.5D Isometric Stacked Grey-Limestone & Velvet-Emerald Moss Dry-Stone Homestead Wall Segment
 * (depth-sorted in `renderer.ts` along the River Ottery bank & Hang Sóc homestead terraces — Mockup 1).
 */
export function terrainDrawSculptedHomesteadWallSeg(
  self: IsometricRenderer,
  gx: number,
  gy: number,
  elev: number,
  axis: 'ew' | 'ns',
  isGatePost: boolean,
  cam: Camera,
  viewW: number,
  viewH: number,
  isNight: boolean
): void {
  const ctx = self.ctx;
  const zoom = cam.zoom;
  const zOff = elev * ELEV_PX;
  const p = rotatedTileDiamondToScreen(gx, gy, cam, viewW, viewH, zOff);
  const hw = TILE_W * 0.5 * zoom;
  const hh = TILE_H * 0.5 * zoom;

  const viewRot = cam.viewRot ?? 0;
  // Project axis in rotated isometric view so walls stay glued to tile spine at any rotation!
  const alongRightEdge =
    (axis === 'ew' && (viewRot === 0 || viewRot === 2)) ||
    (axis === 'ns' && (viewRot === 1 || viewRot === 3));

  const ax = alongRightEdge ? p.sx - hw * 0.52 : p.sx + hw * 0.52;
  const ay = p.sy + hh * 0.48;
  const bx = alongRightEdge ? p.sx + hw * 0.52 : p.sx - hw * 0.52;
  const by = p.sy + hh * 1.52;

  const wallH = Math.max(8, 15.5 * zoom);
  const outlineCol = isNight ? '#1c1b26' : '#382618';
  const wallFaceDark = isNight ? '#505368' : '#857a6e';
  const wallFaceLight = isNight ? '#686b82' : '#aba092';
  const wallCapLight = isNight ? '#9397b0' : '#ebe3d5';
  const mossDark = isNight ? '#1f5438' : '#3f8f29';
  const mossBright = isNight ? '#388558' : '#87dc42';

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (isGatePost) {
    const cx = (ax + bx) * 0.5;
    const cy = (ay + by) * 0.5;
    const pw = Math.max(7, 12.5 * zoom);
    const ph = wallH * 1.32;

    // Ground shadow
    ctx.fillStyle = isNight ? 'rgba(8, 12, 24, 0.52)' : 'rgba(34, 48, 22, 0.38)';
    ctx.beginPath();
    ctx.ellipse(cx + 3 * zoom, cy + 3 * zoom, pw * 0.85, pw * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone Gate Pillar body
    ctx.fillStyle = wallFaceLight;
    ctx.strokeStyle = outlineCol;
    ctx.lineWidth = Math.max(1.1, 1.65 * zoom);
    ctx.beginPath();
    ctx.roundRect(cx - pw * 0.5, cy - ph, pw, ph + 2 * zoom, 3.2 * zoom);
    ctx.fill();
    ctx.stroke();

    // Horizontal course mortar lines
    ctx.strokeStyle = isNight ? 'rgba(24, 24, 38, 0.65)' : 'rgba(56, 38, 24, 0.55)';
    ctx.lineWidth = Math.max(0.9, 1.2 * zoom);
    ctx.beginPath();
    ctx.moveTo(cx - pw * 0.46, cy - ph * 0.62);
    ctx.lineTo(cx + pw * 0.46, cy - ph * 0.62);
    ctx.moveTo(cx - pw * 0.46, cy - ph * 0.28);
    ctx.lineTo(cx + pw * 0.46, cy - ph * 0.28);
    ctx.stroke();

    // Rounded limestone capstone + moss cushion
    ctx.fillStyle = wallCapLight;
    ctx.strokeStyle = outlineCol;
    ctx.lineWidth = Math.max(1.1, 1.55 * zoom);
    ctx.beginPath();
    ctx.ellipse(cx, cy - ph, pw * 0.62, pw * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mossDark;
    ctx.beginPath();
    ctx.ellipse(cx - 1.2 * zoom, cy - ph - 0.8 * zoom, pw * 0.38, pw * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isNight) {
      ctx.fillStyle = mossBright;
      ctx.beginPath();
      ctx.ellipse(cx - 1.8 * zoom, cy - ph - 1.2 * zoom, pw * 0.22, pw * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // Normal orthogonal thickness vector for chunky 3D wall top coping!
  const nx = alongRightEdge ? -4.2 * zoom : 4.2 * zoom;
  const ny = -2.2 * zoom;

  // 1. Cast shadow on sunlit grass
  ctx.strokeStyle = isNight ? 'rgba(8, 12, 24, 0.54)' : 'rgba(30, 52, 20, 0.38)';
  ctx.lineWidth = Math.max(5, 9.5 * zoom);
  ctx.beginPath();
  ctx.moveTo(ax + 3.2 * zoom, ay + 3.2 * zoom);
  ctx.lineTo(bx + 3.2 * zoom, by + 3.2 * zoom);
  ctx.stroke();

  // 2. Front 3D stacked-boulder extrusion face
  ctx.fillStyle = alongRightEdge ? wallFaceLight : wallFaceDark;
  ctx.strokeStyle = outlineCol;
  ctx.lineWidth = Math.max(1.1, 1.6 * zoom);
  ctx.beginPath();
  ctx.moveTo(ax, ay + 1.5 * zoom);
  ctx.lineTo(bx, by + 1.5 * zoom);
  ctx.lineTo(bx, by - wallH);
  ctx.lineTo(ax, ay - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Individual rounded dry-stone courses & mortar seams
  ctx.strokeStyle = isNight ? 'rgba(24, 24, 38, 0.7)' : 'rgba(56, 38, 24, 0.62)';
  ctx.lineWidth = Math.max(0.9, 1.25 * zoom);
  ctx.beginPath();
  ctx.moveTo(ax, ay - wallH * 0.48);
  ctx.lineTo(bx, by - wallH * 0.48);
  for (const tJ of [0.25, 0.54, 0.8]) {
    const jx = ax + (bx - ax) * tJ;
    const jy = ay + (by - ay) * tJ;
    ctx.moveTo(jx, jy + 1.2 * zoom);
    ctx.lineTo(jx, jy - wallH * 0.48);
    const jx2 = ax + (bx - ax) * (tJ - 0.12);
    const jy2 = ay + (by - ay) * (tJ - 0.12);
    ctx.moveTo(jx2, jy2 - wallH * 0.48);
    ctx.lineTo(jx2, jy2 - wallH);
  }
  ctx.stroke();

  // 4. Chunky 3D Bevelled Cream-Limestone Top Capstone Coping Quad
  ctx.fillStyle = wallCapLight;
  ctx.strokeStyle = outlineCol;
  ctx.lineWidth = Math.max(1.05, 1.5 * zoom);
  ctx.beginPath();
  ctx.moveTo(ax, ay - wallH);
  ctx.lineTo(bx, by - wallH);
  ctx.lineTo(bx + nx, by - wallH + ny);
  ctx.lineTo(ax + nx, ay - wallH + ny);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. Plump Velvet-Emerald Moss Cushions & Base Clover Tufts
  const seed = (gx * 17 + gy * 31) % 5;
  for (const mT of [0.24, 0.68]) {
    if (seed === 2 && mT > 0.5) continue;
    const mx = ax + (bx - ax) * mT + nx * 0.42;
    const my = ay + (by - ay) * mT - wallH + ny * 0.42;
    ctx.fillStyle = mossDark;
    ctx.beginPath();
    ctx.ellipse(mx, my, 5.4 * zoom, 2.5 * zoom, alongRightEdge ? 0.22 : -0.22, 0, Math.PI * 2);
    ctx.fill();
    if (!isNight) {
      ctx.fillStyle = mossBright;
      ctx.beginPath();
      ctx.ellipse(mx - 1.1 * zoom, my - 0.6 * zoom, 3.1 * zoom, 1.35 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Base grass tuft hugging stone foot
  const fx = (ax + bx) * 0.5;
  const fy = (ay + by) * 0.5 + 1.8 * zoom;
  ctx.fillStyle = isNight ? '#24593c' : '#4fa330';
  ctx.beginPath();
  ctx.ellipse(fx, fy, 4.5 * zoom, 1.9 * zoom, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
