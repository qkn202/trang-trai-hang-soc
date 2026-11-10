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
        color: isNight ? 'rgba(42, 68, 52, 0.65)' : 'rgba(84, 138, 44, 0.88)',
        width: (z) => Math.max(3.5, 7.5 * z),
        offset: 0,
      },
      {
        color: isNight ? 'rgba(74, 118, 86, 0.45)' : 'rgba(138, 188, 68, 0.72)',
        width: (z) => Math.max(1.4, 3.0 * z),
        offset: 0,
      },
      {
        color: isNight ? 'rgba(186, 230, 253, 0.34)' : 'rgba(198, 244, 246, 0.55)',
        width: (z) => Math.max(1, 1.6 * z),
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
    isNight: boolean
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

    // 1. Soft water shimmer ripples
    if ((gx + gy) % 2 === 0) {
      const wave = Math.sin(self.tick * 0.05 + gx + gy) * 3 * zoom;
      ctx.strokeStyle = isNight ? 'rgba(148, 212, 238, 0.28)' : 'rgba(210, 250, 252, 0.48)';
      ctx.lineWidth = 1.2 * zoom;
      ctx.beginPath();
      ctx.moveTo(sx - 7 * zoom + wave, sy + hh);
      ctx.lineTo(sx + 7 * zoom + wave, sy + hh);
      ctx.stroke();
    }

    // 2. Round notched green lily pads, lotus blossoms & little green marsh frogs!
    if (hash % 3 === 0) {
      const lx = sx + ((hash % 5) - 2) * 3.5 * zoom;
      const ly = sy + hh + ((hash % 3) - 1) * 2.2 * zoom;
      ctx.save();
      ctx.fillStyle = isNight ? '#216e39' : '#58b947';
      ctx.strokeStyle = '#25521b';
      ctx.lineWidth = Math.max(0.9, 1.1 * zoom);
      ctx.beginPath();
      ctx.ellipse(lx, ly, 5.8 * zoom, 3.2 * zoom, 0, 0.25, Math.PI * 1.92);
      ctx.lineTo(lx, ly);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (hash === 3 || hash === 12) {
        // Blooming white-pink marsh water lily
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(lx + 1 * zoom, ly - 1.4 * zoom, 2.4 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(lx + 1 * zoom, ly - 1.6 * zoom, 1.2 * zoom, 0, Math.PI * 2);
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

    // 3. Tall swaying Devon Cattail Reeds (`đầm lau sậy` Canon Hang Sóc!) along marsh banks
    if (nearBank && hash % 2 === 0) {
      const sway = self.reducedMotion ? 0 : Math.sin(self.tick * 0.045 + gx * 0.9 + gy * 1.3) * 2.2 * zoom;
      const baseX = sx + ((hash % 3) - 1) * 6 * zoom;
      const baseY = sy + hh + 1 * zoom;
      ctx.save();
      ctx.lineCap = 'round';
      for (const [dxBlade, hBlade, hasHead] of [
        [-4.5, 19, true],
        [-1.2, 23, true],
        [2.6, 17, false],
        [5.0, 21, hash % 4 === 0],
      ] as Array<[number, number, boolean]>) {
        const bx1 = baseX + dxBlade * 0.35 * zoom;
        const tx1 = baseX + dxBlade * zoom + sway;
        const ty1 = baseY - hBlade * zoom;
        ctx.strokeStyle = '#2b4d16';
        ctx.lineWidth = Math.max(1.4, 2.3 * zoom);
        ctx.beginPath();
        ctx.moveTo(bx1, baseY);
        ctx.quadraticCurveTo(bx1 + sway * 0.4, baseY - hBlade * 0.55 * zoom, tx1, ty1);
        ctx.stroke();

        ctx.strokeStyle = isNight ? '#3d6e29' : '#6aa832';
        ctx.lineWidth = Math.max(1.0, 1.5 * zoom);
        ctx.stroke();

        if (hasHead) {
          // Warm chocolate-brown cattail sausage spike (`bông sậy nâu`)
          const hx = baseX + dxBlade * 0.82 * zoom + sway * 0.82;
          const hy = baseY - hBlade * 0.76 * zoom;
          ctx.strokeStyle = '#2d180a';
          ctx.lineWidth = Math.max(2.4, 4.2 * zoom);
          ctx.beginPath();
          ctx.moveTo(hx, hy + 2.5 * zoom);
          ctx.lineTo(hx + sway * 0.14, hy - 3.6 * zoom);
          ctx.stroke();

          ctx.strokeStyle = '#7c471e';
          ctx.lineWidth = Math.max(1.6, 2.8 * zoom);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
}
