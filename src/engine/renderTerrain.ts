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
    skipCull = false
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

    for (let sum = 0; sum <= (GRID_SIZE - 1) * 2; sum++) {
      const rxStart = Math.max(0, sum - (GRID_SIZE - 1));
      const rxEnd = Math.min(GRID_SIZE - 1, sum);
      for (let rx0 = rxStart; rx0 <= rxEnd; rx0++) {
        const ry0 = sum - rx0;
        const { gx, gy } = rotTileToWorldTile(rx0, ry0, viewRot);
        const cell = sim.grid[gy][gx];
        const zOff = cell.elevation * ELEV_PX;
        const p = rotatedTileDiamondToScreen(gx, gy, cam, viewW, viewH, zOff);
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

        // Smooth multi-tile sunlit meadow patches & dainty clover/wildflower clusters (NO per-tile checkerboard!)
        if (!cell.buildingUid && cell.path === 'none') {
          const meadowWave = Math.sin(gx * 0.42 + gy * 0.29) + Math.cos(gx * 0.21 - gy * 0.37);
          if ((cell.terrain === 'grass' || cell.terrain === 'forest') && !isNightLike) {
            if (unlocked) {
              // Warm golden morning sunlight lift on active village meadows so the unlocked park glows!
              ctx.fillStyle = meadowWave > 0.35 ? 'rgba(250, 246, 148, 0.2)' : 'rgba(232, 250, 162, 0.1)';
              ctx.fill();
            } else if (meadowWave > 0.55) {
              ctx.fillStyle = 'rgba(226, 252, 168, 0.14)';
              ctx.fill();
            } else if (meadowWave < -0.65) {
              ctx.fillStyle = 'rgba(38, 108, 48, 0.065)';
              ctx.fill();
            }
          }
          const hVal = (gx * 37 + gy * 23) % 19;
          if (cell.terrain === 'grass' && hVal < 5) {
            ctx.fillStyle = isNightLike ? '#325f45' : '#58a84a';
            ctx.beginPath();
            ctx.arc(p.sx - 3 * cam.zoom, p.sy + hh, 2.2 * cam.zoom, 0, Math.PI * 2);
            ctx.arc(p.sx + 0.5 * cam.zoom, p.sy + hh - 1.2 * cam.zoom, 2.4 * cam.zoom, 0, Math.PI * 2);
            ctx.fill();
            if (hVal <= 1 && !isNightLike) {
              ctx.fillStyle = (gx + gy) % 2 === 0 ? '#fef08a' : '#fff7ed';
              ctx.beginPath();
              ctx.arc(p.sx + 4 * cam.zoom, p.sy + hh + 1.2 * cam.zoom, 1.8 * cam.zoom, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (cell.terrain === 'snow' && hVal < 3) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
            ctx.beginPath();
            ctx.ellipse(p.sx, p.sy + hh, 3.2 * cam.zoom, 1.5 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.fill();
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
            isNightLike
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

        // 2e. Litter / Spell Backfire puddle
        if (cell.hasLitter && unlocked) {
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
    const useStaticCache =
      cam.zoom <= 0.78 && sim.heatmapMode === 'none' && !showGridLines;

    if (!useStaticCache) {
      terrainRenderGroundTilesLayer(self, sim, cam, viewW, viewH, isNightLike, showGridLines, unlockedSet, false);
      return;
    }

    const viewRot = cam.viewRot ?? 0;
    const key = `${viewRot}|${isNightLike ? 1 : 0}|${sim.stateRevision}|${sim.state.sandboxMode ? 1 : 0}`;
    const worldSpanW = GRID_SIZE * TILE_W + 140;
    const worldSpanH = GRID_SIZE * TILE_H + 260;
    const wyCenter = GRID_SIZE * TILE_H * 0.5 + 16;
    const cacheZoom = 0.8;
    const cacheW = Math.ceil(worldSpanW * cacheZoom);
    const cacheH = Math.ceil(worldSpanH * cacheZoom);

    if (!self.groundCacheCanvas || self.groundCacheKey !== key) {
      if (!self.groundCacheCanvas) {
        self.groundCacheCanvas = document.createElement('canvas');
      }
      self.groundCacheCanvas.width = cacheW;
      self.groundCacheCanvas.height = cacheH;
      const cCtx = self.groundCacheCanvas.getContext('2d');
      if (cCtx) {
        cCtx.clearRect(0, 0, cacheW, cacheH);
        const savedCtx = self.ctx;
        self.ctx = cCtx;
        const cacheCam: Camera = { x: 0, y: wyCenter, zoom: cacheZoom, viewRot };
        terrainRenderGroundTilesLayer(self, 
          sim,
          cacheCam,
          cacheW,
          cacheH,
          isNightLike,
          false,
          unlockedSet,
          true
        );
        self.ctx = savedCtx;
        self.groundCacheKey = key;
      }
    }

    if (self.groundCacheCanvas) {
      const destX = viewW * 0.5 + (-worldSpanW * 0.5 - cam.x) * cam.zoom;
      const destY = viewH * 0.5 + (wyCenter - worldSpanH * 0.5 - cam.y) * cam.zoom;
      const destW = worldSpanW * cam.zoom;
      const destH = worldSpanH * cam.zoom;
      self.ctx.drawImage(self.groundCacheCanvas, destX, destY, destW, destH);
    }
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

    // Rustic Flat Isometric Oak Plank Boardwalk Bridge when path crosses water!
    if (overWater) {
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

    const { gx: tileGx, gy: tileGy } = rotTileToWorldTile(rx0, ry0, viewRot);
    const groundTerrain = sim.grid[tileGy]?.[tileGx]?.terrain ?? 'grass';

    // Rural Hang Sóc Stepping Flagstones (`cobble` on grass): 2 neat rows of bevelled limestone slabs!
    if (path === 'cobble' && groundTerrain === 'grass') {
      ctx.save();
      const alongSE = (connE || connW) && !(connN && connS);
      const slabs: Array<[number, number, number, number]> = alongSE
        ? [
            [-0.36, -0.22, 6.8, 3.8],
            [0.14, -0.22, 6.5, 3.6],
            [-0.18, 0.24, 6.6, 3.7],
            [0.32, 0.24, 6.8, 3.8],
          ]
        : [
            [-0.22, -0.34, 6.8, 3.8],
            [-0.22, 0.16, 6.5, 3.6],
            [0.24, -0.18, 6.6, 3.7],
            [0.24, 0.32, 6.8, 3.8],
          ];
      for (const [u, v, rw, rh] of slabs) {
        const px = sx + (u - v) * hw * 0.46;
        const py = sy + hh + (u + v) * hh * 0.46;
        // Slab thickness shadow
        ctx.fillStyle = isNight ? '#3f3d3a' : '#847c72';
        ctx.beginPath();
        ctx.ellipse(px, py + 1.5 * zoom, rw * zoom, rh * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        // Top warm limestone surface
        ctx.fillStyle = isNight ? '#878278' : '#d8d0c3';
        ctx.strokeStyle = '#524a40';
        ctx.lineWidth = Math.max(0.9, 1.25 * zoom);
        ctx.beginPath();
        ctx.ellipse(px, py, rw * zoom, rh * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
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

    // Gentle wind sway on Enchanted Forest trees, with a lighter rustle
    // for flowers & bushes so the meadow never feels frozen. Rocks stay rigid.
    const isRock = prop.spriteKey === 'env_mossy_rock';
    const sway = self.reducedMotion || isRock
      ? 0
      : Math.sin(self.tick * 0.032 + prop.gx * 1.7 + prop.gy) * (isGroundCover ? 0.012 : 0.025);
    ctx.translate(sx, sy + 4 * zoom);
    if (sway !== 0) ctx.rotate(sway);
    if (prop.flipX) ctx.scale(-1, 1);
    ctx.globalAlpha = isNight ? 0.86 : 0.96;
    ctx.drawImage(sp, -baseW * 0.5, -drawH, baseW, drawH);
    ctx.restore();
}
