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
  resolveBuildingInWorldTimerInfo,
  rotTileToWorldTile,
} from "./rendererShared";
import type { IsometricRenderer } from './renderer';

export function waterDrawOrganicWaterShorelines(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNight: boolean,
    unlockedSet: Set<string>
  ): void {
    if (self.waterLoopsRevision !== sim.stateRevision) {
      const size = GRID_SIZE;
      const water: boolean[] = new Array(size * size).fill(false);
      const elev: number[] = new Array(size * size).fill(0);
      for (let gy = 0; gy < size; gy++) {
        for (let gx = 0; gx < size; gx++) {
          const cell = sim.grid[gy]?.[gx];
          if (!cell) continue;
          if (cell.terrain === 'water') water[gy * size + gx] = true;
          elev[gy * size + gx] = cell.elevation ?? 0;
        }
      }
      self.waterLoops = computeWaterShoreLoops(water, elev, size, (gx, gy) =>
        sim.grid[gy]?.[gx]?.zoneId ?? ''
      );
      self.waterLoopsRevision = sim.stateRevision;
    }

    if (self.waterLoops.length === 0) return;

    const ctx = self.ctx;
    const zoom = cam.zoom;

    // Project every loop once into screen space, then stroke the shore in
    // three passes (wet sand, damp edge, foam lap).
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const passes: Array<{ color: string; width: (z: number) => number; offset: number }> = [
      {
        color: isNight ? 'rgba(34, 62, 48, 0.76)' : 'rgba(72, 134, 38, 0.92)',
        width: (z) => Math.max(4.5, 9.2 * z),
        offset: 0,
      },
      {
        color: isNight ? 'rgba(84, 118, 92, 0.52)' : 'rgba(214, 192, 146, 0.78)',
        width: (z) => Math.max(2.2, 4.4 * z),
        offset: 0,
      },
      {
        color: isNight ? 'rgba(186, 230, 253, 0.50)' : 'rgba(240, 253, 255, 0.85)',
        width: (z) => Math.max(1.3, 2.4 * z),
        offset: 1,
      },
    ];

    for (const loop of self.waterLoops) {
      // Skip lakes that live entirely inside locked (undiscovered) zones —
      // their mist glaze should stay unbroken.
      const visible = loop.zones.some(
        (z) => sim.state.sandboxMode || unlockedSet.has(z)
      );
      if (!visible) continue;

      // Project the loop corners to screen.
      const screen: Array<{ x: number; y: number }> = [];
      for (const p of loop.pts) {
        const s = gridToScreen(
          p.i,
          p.j,
          cam,
          viewW,
          viewH,
          loop.elev * ELEV_PX
        );
        screen.push({ x: s.sx, y: s.sy });
      }
      if (screen.length < 3) continue;

      // Cheap cull: skip lakes entirely off-screen.
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const s of screen) {
        if (s.x < minX) minX = s.x;
        if (s.x > maxX) maxX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.y > maxY) maxY = s.y;
      }
      const pad = 40 * zoom;
      if (maxX < -pad || minX > viewW + pad || maxY < -pad || minY > viewH + pad) continue;

      for (const pass of passes) {
        ctx.strokeStyle = pass.color;
        ctx.lineWidth = pass.width(zoom);
        ctx.beginPath();
        for (let k = 0; k < screen.length; k++) {
          const p = screen[k];
          if (k === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.stroke();

        // The foam lap sits just inside the shore: redraw the same loop
        // slightly shrunk toward its own centroid.
        if (pass.offset === 1) {
          let cx = 0;
          let cy = 0;
          for (const s of screen) {
            cx += s.x;
            cy += s.y;
          }
          cx /= screen.length;
          cy /= screen.length;
          ctx.beginPath();
          for (let k = 0; k < screen.length; k++) {
            const p = screen[k];
            const ix = p.x + (cx - p.x) * 0.06;
            const iy = p.y + (cy - p.y) * 0.06;
            if (k === 0) ctx.moveTo(ix, iy);
            else ctx.lineTo(ix, iy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    ctx.restore();
}

export function waterDrawSeamlessWaterDetails(self: IsometricRenderer, 
    sim: ParkSimulation,
    rx0: number,
    ry0: number,
    viewRot: 0 | 1 | 2 | 3,
    gx: number,
    gy: number,
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    zoom: number,
    isNight: boolean,
    forStaticCache = false
  ): void {
    const ctx = self.ctx;
    const cell = sim.grid[gy]?.[gx];
    if (cell?.path && cell.path !== 'none') return;

    const isLand = (nx: number, ny: number): boolean => {
      const nc = sim.grid[ny]?.[nx];
      return Boolean(nc && nc.terrain !== 'water');
    };
    const nearBank =
      isLand(gx - 1, gy) || isLand(gx + 1, gy) || isLand(gx, gy - 1) || isLand(gx, gy + 1);
    const hash = Math.abs((gx * 73 + gy * 137) % 17);

    // 0. AAA River Ottery Depth Gradient & Submerged Shallows Boulders (Mockup 1 & 2)
    if (!nearBank) {
      // Deeper jewel sapphire-teal mid-channel core
      ctx.fillStyle = isNight ? 'rgba(6, 30, 56, 0.52)' : 'rgba(10, 96, 126, 0.42)';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + hw, sy + hh);
      ctx.lineTo(sx, sy + hh * 2);
      ctx.lineTo(sx - hw, sy + hh);
      ctx.closePath();
      ctx.fill();
    } else {
      // Sunlit crystal-turquoise bankside shallows + smooth submerged river boulders
      ctx.fillStyle = isNight ? 'rgba(56, 189, 248, 0.14)' : 'rgba(134, 244, 254, 0.34)';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + hw, sy + hh);
      ctx.lineTo(sx, sy + hh * 2);
      ctx.lineTo(sx - hw, sy + hh);
      ctx.closePath();
      ctx.fill();

      if (hash % 3 === 1 && zoom >= 0.5) {
        ctx.fillStyle = isNight ? 'rgba(51, 65, 85, 0.55)' : 'rgba(120, 113, 108, 0.48)';
        ctx.beginPath();
        ctx.ellipse(sx - 5.4 * zoom, sy + hh + 2.2 * zoom, 3.6 * zoom, 1.8 * zoom, 0.2, 0, Math.PI * 2);
        ctx.ellipse(sx + 4.6 * zoom, sy + hh - 1.6 * zoom, 2.8 * zoom, 1.4 * zoom, -0.2, 0, Math.PI * 2);
        ctx.fill();
        if (!isNight) {
          ctx.fillStyle = 'rgba(245, 245, 244, 0.42)';
          ctx.beginPath();
          ctx.ellipse(sx - 6.0 * zoom, sy + hh + 1.7 * zoom, 1.8 * zoom, 0.85 * zoom, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 1. Refractive Golden Sunlight / Moonlight Caustic Webs & Shimmer Ripples
    if (!forStaticCache) {
      const wavePhase = self.reducedMotion ? 0 : self.tick * 0.05;
      if ((gx + gy) % 2 === 0) {
        const wave = Math.sin(wavePhase + gx * 0.8 + gy * 0.6) * 3.8 * zoom;
        ctx.strokeStyle = isNight ? 'rgba(165, 243, 252, 0.44)' : 'rgba(255, 252, 214, 0.72)';
        ctx.lineWidth = Math.max(1.1, 1.65 * zoom);
        ctx.beginPath();
        ctx.moveTo(sx - 9.8 * zoom + wave, sy + hh - 1.6 * zoom);
        ctx.quadraticCurveTo(sx + wave * 0.5, sy + hh - 3.8 * zoom, sx + 9.8 * zoom + wave, sy + hh - 0.8 * zoom);
        ctx.moveTo(sx - 5.2 * zoom - wave * 0.6, sy + hh + 2.4 * zoom);
        ctx.quadraticCurveTo(sx, sy + hh + 4.0 * zoom, sx + 6.4 * zoom - wave * 0.6, sy + hh + 1.8 * zoom);
        ctx.stroke();
      } else if (hash % 3 === 1) {
        const glint = self.reducedMotion ? 0.6 : 0.42 + 0.52 * Math.abs(Math.sin(wavePhase * 1.3 + hash));
        ctx.strokeStyle = isNight
          ? `rgba(186, 230, 253, ${(glint * 0.48).toFixed(2)})`
          : `rgba(240, 253, 255, ${(glint * 0.78).toFixed(2)})`;
        ctx.lineWidth = Math.max(1.0, 1.35 * zoom);
        ctx.beginPath();
        ctx.moveTo(sx - 6.8 * zoom, sy + hh + 2.2 * zoom);
        ctx.lineTo(sx + 6.8 * zoom, sy + hh + 1.2 * zoom);
        ctx.stroke();
      }
    }

    // 2. Round notched green lily pads, layered pink-cream lotus blossoms & marsh frogs!
    if (hash % 3 === 0) {
      const lx = sx + ((hash % 5) - 2) * 3.6 * zoom;
      const ly = sy + hh + ((hash % 3) - 1) * 2.2 * zoom;
      ctx.save();
      ctx.fillStyle = isNight ? '#1e6b38' : '#52be42';
      ctx.strokeStyle = '#1f4d18';
      ctx.lineWidth = Math.max(1.0, 1.25 * zoom);
      ctx.beginPath();
      ctx.ellipse(lx, ly, 6.8 * zoom, 3.8 * zoom, 0, 0.25, Math.PI * 1.92);
      ctx.lineTo(lx, ly);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (hash === 3 || hash === 9 || hash === 12) {
        // Blooming layered pink-and-cream marsh water lily
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.ellipse(lx + 0.8 * zoom, ly - 1.2 * zoom, 3.6 * zoom, 2.1 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(lx + 0.8 * zoom, ly - 1.6 * zoom, 2.2 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(lx + 0.8 * zoom, ly - 1.8 * zoom, 1.15 * zoom, 0, Math.PI * 2);
        ctx.fill();
      } else if (hash === 6 && !isNight) {
        // Cute little green frog perched on lily pad!
        ctx.fillStyle = '#65c436';
        ctx.strokeStyle = '#264d14';
        ctx.lineWidth = Math.max(0.9, 1.1 * zoom);
        ctx.beginPath();
        ctx.ellipse(lx, ly - 2.2 * zoom, 3.4 * zoom, 2.6 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lx - 1.4 * zoom, ly - 4.2 * zoom, 1.0 * zoom, 0, Math.PI * 2);
        ctx.arc(lx + 1.4 * zoom, ly - 4.2 * zoom, 1.0 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Tall swaying Devon Cattail Reeds (`đầm lau sậy` Canon Hang Sóc!) along marsh & river banks
    if (nearBank && (hash % 2 === 0 || hash % 5 === 1)) {
      const sway =
        forStaticCache || self.reducedMotion
          ? 0
          : Math.sin(self.tick * 0.048 + gx * 0.9 + gy * 1.3) * 2.6 * zoom;
      const baseX = sx + ((hash % 3) - 1) * 6.2 * zoom;
      const baseY = sy + hh + 1.2 * zoom;
      ctx.save();
      ctx.lineCap = 'round';
      for (const [dxBlade, hBlade, hasHead] of [
        [-5.2, 22, true],
        [-1.4, 27, true],
        [2.8, 20, false],
        [5.6, 24, hash % 3 === 0],
      ] as Array<[number, number, boolean]>) {
        const bx1 = baseX + dxBlade * 0.35 * zoom;
        const tx1 = baseX + dxBlade * zoom + sway;
        const ty1 = baseY - hBlade * zoom;
        ctx.strokeStyle = '#244612';
        ctx.lineWidth = Math.max(1.6, 2.7 * zoom);
        ctx.beginPath();
        ctx.moveTo(bx1, baseY);
        ctx.quadraticCurveTo(bx1 + sway * 0.4, baseY - hBlade * 0.55 * zoom, tx1, ty1);
        ctx.stroke();

        ctx.strokeStyle = isNight ? '#3c782a' : '#74ba36';
        ctx.lineWidth = Math.max(1.1, 1.75 * zoom);
        ctx.stroke();

        if (hasHead) {
          // Plump chocolate-brown cattail sausage spike (`bông sậy nâu`)
          const hx = baseX + dxBlade * 0.82 * zoom + sway * 0.82;
          const hy = baseY - hBlade * 0.76 * zoom;
          ctx.strokeStyle = '#291508';
          ctx.lineWidth = Math.max(2.8, 4.9 * zoom);
          ctx.beginPath();
          ctx.moveTo(hx, hy + 2.8 * zoom);
          ctx.lineTo(hx + sway * 0.14, hy - 4.2 * zoom);
          ctx.stroke();

          ctx.strokeStyle = '#8a4f20';
          ctx.lineWidth = Math.max(1.9, 3.3 * zoom);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
}

/**
 * Lightweight 60fps overlay drawn on top of the cached static ground layer:
 * batches River Ottery shimmering caustic ripples into a single stroke path and
 * renders dynamic litter puddles without re-drawing 5,184 terrain tiles.
 */
export function waterDrawAnimatedGroundOverlays(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  isNight: boolean,
  unlockedSet: Set<string>
): void {
  const ctx = self.ctx;
  const zoom = cam.zoom;
  const viewRot = cam.viewRot ?? 0;
  const hh = TILE_H * 0.5 * zoom;
  const margin = Math.max(64, 110 * zoom);
  const win = computeVisibleRotatedTileWindow(cam, viewW, viewH, margin);
  const wavePhase = self.reducedMotion ? 0 : self.tick * 0.05;
  const sandbox = sim.state.sandboxMode;

  let hasRipples = false;
  ctx.save();
  ctx.strokeStyle = isNight ? 'rgba(165, 243, 252, 0.44)' : 'rgba(255, 252, 214, 0.72)';
  ctx.lineWidth = Math.max(1.1, 1.65 * zoom);
  ctx.beginPath();

  for (let sum = win.sumMin; sum <= win.sumMax; sum++) {
    const rxStart = Math.max(0, sum - (GRID_SIZE - 1), Math.floor((sum + win.diffMin) * 0.5) - 1);
    const rxEnd = Math.min(GRID_SIZE - 1, sum, Math.ceil((sum + win.diffMax) * 0.5) + 1);
    for (let rx0 = rxStart; rx0 <= rxEnd; rx0++) {
      const ry0 = sum - rx0;
      const { gx, gy } = rotTileToWorldTile(rx0, ry0, viewRot);
      const cell = sim.grid[gy]?.[gx];
      if (!cell) continue;
      if (cell.terrain !== 'water' && !cell.hasLitter) continue;
      if (!sandbox && !unlockedSet.has(cell.zoneId)) continue;

      const sx = viewW * 0.5 + ((rx0 - ry0) * (TILE_W * 0.5) - cam.x) * zoom;
      const sy = viewH * 0.5 + (sum * (TILE_H * 0.5) - cell.elevation * ELEV_PX - cam.y) * zoom;

      if (cell.terrain === 'water' && (!cell.path || cell.path === 'none') && (gx + gy) % 2 === 0) {
        const wave = Math.sin(wavePhase + gx * 0.8 + gy * 0.6) * 3.8 * zoom;
        ctx.moveTo(sx - 9.8 * zoom + wave, sy + hh - 1.6 * zoom);
        ctx.quadraticCurveTo(
          sx + wave * 0.5,
          sy + hh - 3.8 * zoom,
          sx + 9.8 * zoom + wave,
          sy + hh - 0.8 * zoom
        );
        ctx.moveTo(sx - 5.2 * zoom - wave * 0.6, sy + hh + 2.4 * zoom);
        ctx.quadraticCurveTo(
          sx,
          sy + hh + 4.0 * zoom,
          sx + 6.4 * zoom - wave * 0.6,
          sy + hh + 1.8 * zoom
        );
        hasRipples = true;
      }
    }
  }

  if (hasRipples) {
    ctx.stroke();
  }

  // Second lightweight pass only if any visible tile has litter
  for (let sum = win.sumMin; sum <= win.sumMax; sum++) {
    const rxStart = Math.max(0, sum - (GRID_SIZE - 1), Math.floor((sum + win.diffMin) * 0.5) - 1);
    const rxEnd = Math.min(GRID_SIZE - 1, sum, Math.ceil((sum + win.diffMax) * 0.5) + 1);
    for (let rx0 = rxStart; rx0 <= rxEnd; rx0++) {
      const ry0 = sum - rx0;
      const { gx, gy } = rotTileToWorldTile(rx0, ry0, viewRot);
      const cell = sim.grid[gy]?.[gx];
      if (!cell || !cell.hasLitter) continue;
      if (!sandbox && !unlockedSet.has(cell.zoneId)) continue;
      const sx = viewW * 0.5 + ((rx0 - ry0) * (TILE_W * 0.5) - cam.x) * zoom;
      const sy = viewH * 0.5 + (sum * (TILE_H * 0.5) - cell.elevation * ELEV_PX - cam.y) * zoom;
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.ellipse(sx, sy + hh, 7 * zoom, 4 * zoom, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(sx + 2 * zoom, sy + hh - 2 * zoom, 2.6 * zoom, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
