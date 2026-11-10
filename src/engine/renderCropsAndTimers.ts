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

export function cropsDrawEmptyPlotSeedCue(self: IsometricRenderer, drawW: number, drawH: number): void {
    const ctx = self.ctx;
    const pulse = 0.55 + Math.sin(self.tick * 0.11) * 0.25;
    const cy = -drawH * 0.54;
    const rx = drawW * 0.35;
    const ry = drawW * 0.175;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, cy - ry);
    ctx.lineTo(rx, cy);
    ctx.lineTo(0, cy + ry);
    ctx.lineTo(-rx, cy);
    ctx.closePath();
    ctx.fillStyle = `rgba(134, 239, 172, ${0.18 * pulse})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(187, 247, 208, ${0.55 * pulse})`;
    ctx.lineWidth = Math.max(1.5, drawW * 0.012);
    ctx.stroke();
    ctx.restore();
}

export function cropsDrawEmptyPastureAnimalCue(self: IsometricRenderer, drawW: number, drawH: number): void {
    const ctx = self.ctx;
    const pulse = 0.58 + Math.sin(self.tick * 0.11) * 0.24;
    const cy = -drawH * 0.5;
    const rx = drawW * 0.36;
    const ry = drawW * 0.18;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, cy - ry);
    ctx.lineTo(rx, cy);
    ctx.lineTo(0, cy + ry);
    ctx.lineTo(-rx, cy);
    ctx.closePath();
    ctx.fillStyle = `rgba(253, 224, 71, ${0.2 * pulse})`;
    ctx.fill();
    ctx.setLineDash([Math.max(4, drawW * 0.03), Math.max(3, drawW * 0.02)]);
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.78 * pulse})`;
    ctx.lineWidth = Math.max(1.8, drawW * 0.014);
    ctx.stroke();
    ctx.restore();
}

export function cropsGetPlotFurrowGrid(self: IsometricRenderer, drawW: number, drawH: number): Array<{ x: number; y: number; idx: number }> {
    // Exact normalized coordinates of the 4 plowed soil ridge crests in `crop_plot_tilled.png` (372×223)
    const ridgeCenters: ReadonlyArray<readonly [number, number]> = [
      [-0.1344, -0.6682],
      [-0.0524, -0.6009],
      [0.0470, -0.5179],
      [0.1438, -0.4372],
    ];
    const alongX = drawW * 0.1129;
    const alongY = -drawH * 0.0942;
    const pts: Array<{ x: number; y: number; idx: number }> = [];
    let idx = 0;
    for (const [rx, ry] of ridgeCenters) {
      for (const along of [1, 0, -1] as const) {
        pts.push({
          x: rx * drawW + along * alongX,
          y: ry * drawH + along * alongY,
          idx: idx++,
        });
      }
    }
    pts.sort((a, b) => a.y - b.y || a.x - b.x);
    return pts;
}

export function cropsDrawFarmlandSeedlings(self: IsometricRenderer, 
    drawW: number,
    drawH: number,
    growRatio: number,
    watered: boolean
  ): void {
    const ctx = self.ctx;
    const pts = cropsGetPlotFurrowGrid(self, drawW, drawH);
    const u = drawW * 0.0088;
    const shootScale = 0.55 + (growRatio / 0.25) * 0.45;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (watered) {
      ctx.fillStyle = 'rgba(28, 16, 8, 0.24)';
      ctx.beginPath();
      ctx.moveTo(0, -drawH * 0.86);
      ctx.lineTo(drawW * 0.36, -drawH * 0.54);
      ctx.lineTo(0, -drawH * 0.22);
      ctx.lineTo(-drawW * 0.36, -drawH * 0.54);
      ctx.closePath();
      ctx.fill();
    }

    for (const p of pts) {
      // Rich dark soil mound
      ctx.fillStyle = '#3b2110';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 1.2 * u, 4.4 * u, 2.3 * u, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tiny germinating seed + twin cotyledon tips
      const h = 6.2 * u * shootScale;
      ctx.strokeStyle = '#3e2211';
      ctx.lineWidth = Math.max(1.1, 1.45 * u);
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.ellipse(p.x - 2.1 * u, p.y - h * 0.55, 2.4 * u, 1.4 * u, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(p.x + 2.1 * u, p.y - h * 0.55, 2.4 * u, 1.4 * u, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
}

export function cropsGetPlotClusterGrid(self: IsometricRenderer, drawW: number, drawH: number): Array<{ x: number; y: number; idx: number }> {
    // Symmetric 3×3 isometric diamond grid across the plowed soil bed of `crop_plot_tilled.png` (372×223)
    const uvGrid = [0.24, 0.5, 0.76] as const;
    const pts: Array<{ x: number; y: number; idx: number }> = [];
    let idx = 0;
    for (const u of uvGrid) {
      for (const v of uvGrid) {
        pts.push({
          x: (u - v) * (drawW * 0.455),
          y: -drawH * 0.4888 + (u + v - 1.0) * (drawH * 0.395),
          idx: idx++,
        });
      }
    }
    pts.sort((a, b) => a.y - b.y || a.x - b.x);
    return pts;
}

export function cropsDrawFarmlandCropRows(self: IsometricRenderer, 
    cropId: FarmCropId,
    drawW: number,
    drawH: number,
    growRatio: number,
    watered: boolean,
    seedHash: number
  ): void {
    const cropSprite = self.sprites.get(FARM_CROPS[cropId].iconKey);
    if (!cropSprite) return;

    const ctx = self.ctx;
    const pts = cropsGetPlotClusterGrid(self, drawW, drawH);
    const isRipe = growRatio >= 1;
    const stageT = isRipe ? 1 : Math.max(0, Math.min(1, (growRatio - 0.66) / 0.34));
    const stageScale = isRipe ? 1 : 0.68 + stageT * 0.24;

    let baseScaleMult = 0.285;
    if (
      cropId === 'garden_pumpkin' ||
      cropId === 'crisp_cabbage' ||
      cropId === 'ruby_strawberry' ||
      cropId === 'dew_blueberry' ||
      cropId === 'blush_peony' ||
      cropId === 'honey_carrot'
    ) {
      baseScaleMult = 0.295;
    } else if (
      cropId === 'burrow_apple' ||
      cropId === 'golden_corn' ||
      cropId === 'ruby_tomato' ||
      cropId === 'hedge_sunflower'
    ) {
      baseScaleMult = 0.305;
    } else if (cropId === 'baby_mandrake') {
      baseScaleMult = 0.275;
    }

    const srcW = cropSprite.width;
    const isCarrotInSoil = cropId === 'honey_carrot';
    const srcH = isCarrotInSoil ? Math.round(cropSprite.height * 0.738) : cropSprite.height;
    const anchorYRatio = isCarrotInSoil ? 0.94 : 0.9;
    const swayDamp =
      cropId === 'garden_pumpkin' ||
      cropId === 'crisp_cabbage' ||
      cropId === 'baby_mandrake' ||
      cropId === 'glow_mushroom'
        ? 0.28
        : 0.75;

    ctx.save();

    if (watered) {
      ctx.fillStyle = 'rgba(24, 14, 7, 0.22)';
      ctx.beginPath();
      ctx.moveTo(0, -drawH * 0.86);
      ctx.lineTo(drawW * 0.36, -drawH * 0.54);
      ctx.lineTo(0, -drawH * 0.22);
      ctx.lineTo(-drawW * 0.36, -drawH * 0.54);
      ctx.closePath();
      ctx.fill();
    }

    // Pass 1: Warm dark-loam ambient occlusion shadows under all 9 roots (never overdrawing front leaves)
    const baseClW = drawW * baseScaleMult * stageScale;
    ctx.fillStyle = 'rgba(26, 13, 5, 0.36)';
    for (const p of pts) {
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + drawH * 0.009, baseClW * 0.32, baseClW * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pass 2: Depth-sorted 2.5D painted crop/flower bushes
    for (const p of pts) {
      const tuftJitter = 0.97 + (((p.idx * 7 + Math.abs(seedHash)) % 5) * 0.015);
      const clW = baseClW * tuftJitter;
      const clH = clW * (srcH / srcW);
      const sway = self.reducedMotion
        ? 0
        : Math.sin(self.tick * 0.05 + p.idx * 0.85 + seedHash) * 0.038 * swayDamp;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (sway !== 0) ctx.rotate(sway);
      ctx.drawImage(cropSprite, 0, 0, srcW, srcH, -clW * 0.5, -clH * anchorYRatio, clW, clH);
      ctx.restore();
    }

    // Subtle golden harvest sun-motes shimmering above ripe plots
    if (isRipe && !self.reducedMotion) {
      const moteR = Math.max(1.5, drawW * 0.016);
      for (let m = 0; m < 3; m++) {
        const phase = (self.tick * 0.03 + m * 0.33 + seedHash * 0.07) % 1;
        const mx = Math.sin(m * 2.4 + seedHash) * drawW * 0.24;
        const my = -drawH * (0.52 + phase * 0.36);
        const alpha = Math.sin(phase * Math.PI) * 0.85;
        ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.beginPath();
        ctx.arc(mx, my, moteR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
}

export function cropsDrawHarvestBubble(self: IsometricRenderer, b: PlacedBuilding, sx: number, sy: number, zoom: number): void {
    const ctx = self.ctx;
    const bob = Math.sin(self.tick * 0.075 + b.gx * 1.7 + b.gy) * 4;
    const item = getCatalogItem(b.itemId);
    const prodIcon: CanvasImageSource | undefined =
      b.readyFarmGoods && b.readyFarmGoods.length > 0
        ? self.sprites.get(FARM_GOODS[b.readyFarmGoods[0]]?.iconKey)
        : item?.isFarmlandPlot && b.cropId
          ? self.getCropIconImage(b.cropId)
          : item?.isAnimalPasturePlot && b.pastureAnimalId
            ? self.sprites.get(PASTURE_ANIMALS[b.pastureAnimalId]?.iconKey)
            : item?.productIconKey
              ? self.sprites.get(item.productIconKey)
              : undefined;
    const sickleIcon =
      item?.isFarmlandPlot && b.cropId ? self.sprites.get('ui_icon_golden_sickle') : undefined;

    if (prodIcon) {
      // Playrix Township Glossy Plump Circular Speech-Pin Product Bubble!
      const r = Math.max(
        25,
        Math.min(38, (item?.isFarmlandPlot || item?.isAnimalPasturePlot ? 28 : 33) * zoom)
      );
      const bx = sx + 8 * zoom;
      const by = sy - 12 * zoom + bob;

      self.hotspots.push({
        kind: 'bubble',
        id: b.uid,
        sx: bx,
        sy: by,
        radius: r + 10,
      });

      self.drawRadialGlow(bx, by, r * 1.85, 'rgba(253, 224, 71, 0.62)');

      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Speech-pin pointer tail pointing down-left toward the workshop/oven!
      const drawPinShape = (): void => {
        ctx.beginPath();
        ctx.arc(bx, by, r, 0.72 * Math.PI, 2.52 * Math.PI);
        ctx.lineTo(bx - r * 0.62, by + r * 1.16);
        ctx.closePath();
      };

      // Drop shadow
      ctx.save();
      ctx.translate(0, 3 * zoom);
      drawPinShape();
      ctx.fillStyle = 'rgba(46, 26, 8, 0.28)';
      ctx.fill();
      ctx.restore();

      // Warm cream-gold radial gradient fill + glossy golden border
      const bgGrad = ctx.createRadialGradient(
        bx - r * 0.25,
        by - r * 0.3,
        r * 0.1,
        bx,
        by,
        r
      );
      bgGrad.addColorStop(0, '#fffdf4');
      bgGrad.addColorStop(0.72, '#fef0c2');
      bgGrad.addColorStop(1, '#f7d683');

      drawPinShape();
      ctx.fillStyle = bgGrad;
      ctx.fill();
      ctx.strokeStyle = '#5c330a';
      ctx.lineWidth = Math.max(2.4, 3.2 * zoom);
      ctx.stroke();
      ctx.strokeStyle = '#e5a932';
      ctx.lineWidth = Math.max(1.4, 1.9 * zoom);
      ctx.stroke();

      // Crisp 3D product sprite inside bubble
      const iconSz = r * 1.48;
      ctx.drawImage(prodIcon, bx - iconSz * 0.5, by - iconSz * 0.52, iconSz, iconSz);

      // Gleaming Golden Sickle badge on ripe Farmland Plots (or stack count on Workshops!)
      if (sickleIcon) {
        const skSz = r * 0.88;
        ctx.drawImage(sickleIcon, bx + r * 0.25, by - r * 0.95, skSz, skSz);
      } else if (b.readyFarmGoods && b.readyFarmGoods.length > 1) {
        ctx.fillStyle = '#16a34a';
        ctx.strokeStyle = '#fffdf4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bx + r * 0.68, by - r * 0.62, Math.max(9, 10 * zoom), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${Math.max(10, Math.round(10.5 * zoom))}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`x${b.readyFarmGoods.length}`, bx + r * 0.68, by - r * 0.62 + 0.5);
      }
      ctx.restore();
      return;
    }

    const by = sy + bob;
    const r = Math.max(19, Math.min(25, 20 * zoom));

    self.hotspots.push({
      kind: 'bubble',
      id: b.uid,
      sx,
      sy: by,
      radius: r + 10,
    });

    self.drawRadialGlow(sx, by, r * 1.7, 'rgba(251, 191, 36, 0.55)');

    ctx.save();
    ctx.font = '800 12px "Be Vietnam Pro", sans-serif';
    const labelText = `+${b.storedGalleons}`;
    const textW = ctx.measureText(labelText).width;
    const pillW = Math.max(54, textW + 28);
    const pillH = 26;

    ctx.fillStyle = 'rgba(255, 248, 220, 0.97)';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(sx - pillW * 0.5, by - pillH * 0.5, pillW, pillH, pillH * 0.5);
    ctx.fill();
    ctx.stroke();

    const coinX = sx - pillW * 0.5 + 12;
    ctx.fillStyle = '#eab308';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(coinX, by, 6.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#5c2d0c';
    ctx.fillText(labelText, coinX + 9, by + 0.5);
    ctx.restore();
}

export function cropsDrawInWorldWaitTimers(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    activeFestival: string,
    selectedUid: string | null,
    movingBuildingUid: string | null
  ): void {
    const zoom = cam.zoom;
    for (const b of sim.state.buildings) {
      if (movingBuildingUid === b.uid) continue;
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const isSelected = selectedUid === b.uid;
      const info = resolveBuildingInWorldTimerInfo(b, item, now, activeFestival, isSelected);
      if (!info) continue;

      // Keep bird's-eye overview clean at extreme zoom-out while preserving actionable & build timers
      if (
        zoom < 0.42 &&
        !isSelected &&
        info.kind !== 'construction' &&
        info.kind !== 'unveil_ribbon' &&
        info.kind !== 'water_crop' &&
        info.kind !== 'feed_pasture' &&
        info.kind !== 'workshop_craft'
      ) {
        continue;
      }

      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const hasFloatingBubble =
        now >= b.constructEndsAt &&
        (b.storedGalleons > 0 ||
          Boolean(b.readyFarmGoods && b.readyFarmGoods.length > 0) ||
          Boolean(item.isFarmlandPlot && b.cropId && b.cropReadyAt && now >= b.cropReadyAt) ||
          Boolean(
            item.isAnimalPasturePlot &&
              b.pastureAnimalId &&
              b.pastureReadyAt &&
              now >= b.pastureReadyAt
          ));

      let zLift: number;
      if (info.kind === 'construction') {
        zLift = 36 + Math.max(bw, bh) * 13;
      } else if (info.kind === 'unveil_ribbon') {
        zLift = 42 + Math.max(bw, bh) * 15;
      } else if (info.kind === 'water_crop') {
        zLift = 12;
      } else if (
        info.kind === 'growing_crop' ||
        info.kind === 'feed_pasture' ||
        info.kind === 'grazing_pasture'
      ) {
        zLift = 14;
      } else if (hasFloatingBubble) {
        zLift = 16 + Math.max(bw, bh) * 5;
      } else if (item.connectableGroup) {
        zLift = 20;
      } else {
        zLift = 38 + Math.max(bw, bh) * 14;
      }

      const pt = gridToScreen(
        b.gx + bw * 0.5,
        b.gy + bh * 0.5,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + zLift
      );
      if (pt.sx < -90 || pt.sx > viewW + 90 || pt.sy < -90 || pt.sy > viewH + 90) continue;

      const isActionable = Boolean(info.interactiveHotspotKind);
      const bob =
        self.reducedMotion || (!isActionable && info.kind !== 'construction')
          ? 0
          : Math.sin(self.tick * 0.08 + b.gx * 1.3 + b.gy * 0.9) * (isActionable ? 2.6 : 1.8);
      const py = pt.sy + bob;

      if (info.interactiveHotspotKind === 'water_crop') {
        self.hotspots.push({
          kind: 'water_crop',
          id: b.uid,
          sx: pt.sx,
          sy: py - 8 * zoom,
          radius: Math.max(28, 32 * zoom),
        });
      } else if (info.interactiveHotspotKind === 'feed_pasture') {
        self.hotspots.push({
          kind: 'feed_pasture',
          id: b.uid,
          sx: pt.sx,
          sy: py,
          radius: Math.max(26, 28 * zoom),
        });
      } else if (info.interactiveHotspotKind === 'unveil_building') {
        self.hotspots.push({
          kind: 'unveil_building',
          id: b.uid,
          sx: pt.sx,
          sy: py,
          radius: Math.max(30, 34 * zoom),
        });
      }

      cropsDrawInWorldTimerPill(self, info, pt.sx, py, zoom, isSelected);
    }
}

export function cropsDrawInWorldTimerPill(self: IsometricRenderer, 
    info: InWorldTimerBadgeInfo,
    sx: number,
    sy: number,
    zoom: number,
    isSelected: boolean
  ): void {
    const ctx = self.ctx;
    const isActionable = Boolean(info.interactiveHotspotKind);
    const useFullLabel = zoom >= 0.72 || isSelected || info.kind === 'construction';
    const text = useFullLabel ? info.label : info.compactLabel;

    let bgFill = 'rgba(255, 248, 225, 0.94)';
    let rimStroke = '#b45309';
    let textColor = '#5c2d0c';
    let barStart = '#f59e0b';
    let barEnd = '#fde047';
    let trackBg = 'rgba(92, 45, 12, 0.16)';
    let glowColor: string | null = null;

    switch (info.kind) {
      case 'construction':
        bgFill = 'rgba(23, 37, 64, 0.94)';
        rimStroke = '#fbbf24';
        textColor = '#fef9c3';
        barStart = '#34d399';
        barEnd = '#fbbf24';
        trackBg = 'rgba(255, 255, 255, 0.22)';
        glowColor = 'rgba(251, 191, 36, 0.38)';
        break;
      case 'unveil_ribbon':
        bgFill = 'rgba(153, 27, 27, 0.96)';
        rimStroke = '#fde047';
        textColor = '#fef9c3';
        barStart = '#fde047';
        barEnd = '#fb923c';
        trackBg = 'rgba(255, 255, 255, 0.25)';
        glowColor = 'rgba(253, 224, 71, 0.55)';
        break;
      case 'water_crop':
        bgFill = 'rgba(240, 249, 255, 0.97)';
        rimStroke = '#0284c7';
        textColor = '#0c4a6e';
        barStart = '#38bdf8';
        barEnd = '#22c55e';
        trackBg = 'rgba(2, 132, 199, 0.18)';
        glowColor = 'rgba(56, 189, 248, 0.45)';
        break;
      case 'feed_pasture':
        bgFill = 'rgba(254, 252, 232, 0.97)';
        rimStroke = '#15803d';
        textColor = '#14532d';
        barStart = '#4ade80';
        barEnd = '#eab308';
        trackBg = 'rgba(21, 128, 61, 0.18)';
        glowColor = 'rgba(74, 222, 128, 0.42)';
        break;
      case 'growing_crop':
      case 'grazing_pasture':
        bgFill = 'rgba(255, 251, 235, 0.94)';
        rimStroke = '#4d7c0f';
        textColor = '#365314';
        barStart = '#22c55e';
        barEnd = '#facc15';
        trackBg = 'rgba(54, 83, 20, 0.16)';
        break;
      case 'workshop_craft':
        bgFill = 'rgba(255, 247, 237, 0.97)';
        rimStroke = '#ea580c';
        textColor = '#7c2d12';
        barStart = '#fb923c';
        barEnd = '#facc15';
        trackBg = 'rgba(124, 45, 18, 0.16)';
        glowColor = 'rgba(251, 146, 60, 0.34)';
        break;
      default:
        break;
    }

    const fontPx = isActionable || info.kind === 'construction' ? 11.5 : 11;
    const iconSprite = info.spriteKey ? self.sprites.get(info.spriteKey) : undefined;
    const iconSz = isActionable ? 16 : 14;

    ctx.save();
    ctx.font = `800 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    const textW = ctx.measureText(text).width;
    const padX = 9;
    const gap = 5;
    const contentW = iconSz + gap + textW;
    const pillW = Math.max(54, Math.ceil(contentW + padX * 2));
    const pillH = isActionable || info.kind === 'construction' ? 26 : 23;
    const leftX = sx - pillW * 0.5;
    const topY = sy - pillH * 0.5;

    if (glowColor) {
      self.drawRadialGlow(sx, sy, pillW * 0.54, glowColor);
    }

    // Warm subtle drop shadow so badge separates cleanly from foliage & roofs
    ctx.fillStyle = 'rgba(28, 19, 13, 0.24)';
    ctx.beginPath();
    ctx.roundRect(leftX, topY + 2, pillW, pillH, pillH * 0.48);
    ctx.fill();

    // Pill body + crisp Storybook rim
    ctx.fillStyle = bgFill;
    ctx.strokeStyle = isSelected ? '#facc15' : rimStroke;
    ctx.lineWidth = isActionable || isSelected ? 2.2 : 1.75;
    ctx.beginPath();
    ctx.roundRect(leftX, topY, pillW, pillH, pillH * 0.48);
    ctx.fill();
    ctx.stroke();

    // Icon + Countdown text on upper row
    const rowY = topY + (pillH - 4.5) * 0.5;
    const iconCenterX = leftX + padX + iconSz * 0.5;
    if (iconSprite) {
      ctx.drawImage(iconSprite, iconCenterX - iconSz * 0.5, rowY - iconSz * 0.5, iconSz, iconSz);
    } else {
      ctx.font = `${Math.round(iconSz * 0.88)}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(info.fallbackEmoji, iconCenterX, rowY + 0.5);
    }

    ctx.font = `800 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(text, leftX + padX + iconSz + gap, rowY + 0.5);

    // Smooth integrated progress bar nested along inner bottom edge
    const barInset = 8;
    const barW = Math.max(16, pillW - barInset * 2);
    const barH = 3.4;
    const barX = leftX + barInset;
    const barY = topY + pillH - barH - 2.6;

    ctx.fillStyle = trackBg;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 2);
    ctx.fill();

    const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    fillGrad.addColorStop(0, barStart);
    fillGrad.addColorStop(1, barEnd);
    ctx.fillStyle = fillGrad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, Math.max(3.5, barW * info.progress), barH, 2);
    ctx.fill();

    ctx.restore();
}

export function cropsDrawNeighborVisitOverlays(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number
  ): void {
    const nb = sim.getActiveVisitingNeighbor();
    if (!nb) return;
    const ctx = self.ctx;
    const zoom = cam.zoom;
    const helpedLeft = Math.max(0, 6 - nb.helpedMarksToday.length);
    const placedScreenPts: Array<{ sx: number; sy: number }> = [];

    // 1. Draw either interactive Help Bubbles (💧/🌾/🔥) OR glowing Owl Post Lantern marks (🏮) on buildings
    for (const b of sim.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const status = sim.getVisitedBuildingHelpStatus(b, now);
      if (!status.kind) continue;

      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const zLift =
        item.isFarmlandPlot || item.isAnimalPasturePlot || item.connectableGroup === 'flower_garden'
          ? 30
          : 50 + Math.max(bw, bh) * 16;
      const pt = gridToScreen(
        b.gx + bw * 0.5,
        b.gy + bh * 0.5,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + zLift
      );
      if (pt.sx < -90 || pt.sx > viewW + 90 || pt.sy < -90 || pt.sy > viewH + 90) continue;

      if (status.existingMark) {
        const note = getPresetNoteMeta(status.existingMark.noteId);
        const bob = Math.sin(self.tick * 0.06 + b.gx + b.gy) * 3;
        const py = pt.sy - 6 * zoom + bob;
        const text = `🏮 ${note.emoji} ${note.shortVi}`;
        ctx.save();
        ctx.font = '800 11.5px "Be Vietnam Pro", sans-serif';
        const tw = ctx.measureText(text).width;
        const pw = Math.max(96, tw + 22);
        const ph = 25;
        self.drawRadialGlow(pt.sx, py, pw * 0.55, 'rgba(251, 191, 36, 0.42)');
        ctx.fillStyle = 'rgba(72, 34, 12, 0.92)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(pt.sx - pw * 0.5, py - ph * 0.5, pw, ph, ph * 0.5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef3c7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, pt.sx, py + 0.5);
        ctx.restore();
        continue;
      }

      if (helpedLeft <= 0 || !status.canHelp) continue;

      // Avoid crowding merged 2x2 plot clusters with overlapping bubbles
      const minGap = item.connectableGroup && !item.isFarmlandPlot ? 58 * zoom : 30 * zoom;
      if (placedScreenPts.some((p) => Math.hypot(p.sx - pt.sx, p.sy - pt.sy) < minGap)) {
        continue;
      }
      placedScreenPts.push({ sx: pt.sx, sy: pt.sy });

      const meta = getGardenHelpMetaVi(status.kind);
      const bob = Math.sin(self.tick * 0.085 + b.gx * 1.4 + b.gy) * 4;
      const by = pt.sy + bob;
      const r = Math.max(22, Math.min(31, 25 * zoom));

      self.hotspots.push({
        kind: 'neighbor_help',
        id: b.uid,
        sx: pt.sx,
        sy: by,
        radius: r + 12,
      });

      const glowColor =
        status.kind === 'water_crop'
          ? 'rgba(56, 189, 248, 0.58)'
          : status.kind === 'stoke_workshop'
            ? 'rgba(251, 146, 60, 0.62)'
            : 'rgba(134, 239, 172, 0.58)';
      self.drawRadialGlow(pt.sx, by, r * 1.85, glowColor);

      ctx.save();
      ctx.font = '800 12px "Be Vietnam Pro", sans-serif';
      const label = meta.badgeVi;
      const tw = ctx.measureText(label).width;
      const pw = Math.max(76, tw + 22);
      const ph = 28;

      ctx.fillStyle = 'rgba(255, 251, 235, 0.97)';
      ctx.strokeStyle =
        status.kind === 'water_crop'
          ? '#0284c7'
          : status.kind === 'stoke_workshop'
            ? '#ea580c'
            : '#15803d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(pt.sx - pw * 0.5, by - ph * 0.5, pw, ph, ph * 0.5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#3b1d0a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, pt.sx, by + 0.5);
      ctx.restore();
    }

    // 2. Daily Mystery Gift Basket (🎁 Quà Bí Ẩn 1 lần/ngày/bạn)
    if (sim.canClaimVisitedMysteryGift()) {
      const gx = nb.mysteryGiftGx;
      const gy = nb.mysteryGiftGy;
      const elev = sim.grid[gy]?.[gx]?.elevation ?? 0;
      const gpt = gridToScreen(gx + 0.5, gy + 0.5, cam, viewW, viewH, elev * ELEV_PX + 18);
      if (gpt.sx >= -90 && gpt.sx <= viewW + 90 && gpt.sy >= -90 && gpt.sy <= viewH + 90) {
        const bob = Math.sin(self.tick * 0.09) * 4.5;
        const py = gpt.sy + bob;

        self.hotspots.push({
          kind: 'visitor_gift',
          id: nb.id,
          sx: gpt.sx,
          sy: py,
          radius: Math.max(32, 34 * zoom),
        });

        self.drawRadialGlow(gpt.sx, py, 44 * zoom, 'rgba(250, 204, 21, 0.75)');

        ctx.save();
        // Cozy golden chest/basket body
        const boxW = Math.max(26, 28 * zoom);
        const boxH = Math.max(22, 24 * zoom);
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.roundRect(gpt.sx - boxW * 0.5, py - boxH * 0.4, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = `${Math.max(18, Math.round(20 * zoom))}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎁', gpt.sx, py + 2);

        // Floating pill above Mystery Gift
        ctx.font = '800 11.5px "Be Vietnam Pro", sans-serif';
        const tag = '🎁 Quà Bí Ẩn (+1 🍀)';
        const tw = ctx.measureText(tag).width;
        const pw = tw + 18;
        const ph = 22;
        const tagY = py - boxH * 0.85 - 10;
        ctx.fillStyle = 'rgba(120, 53, 15, 0.95)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(gpt.sx - pw * 0.5, tagY - ph * 0.5, pw, ph, ph * 0.5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef9c3';
        ctx.fillText(tag, gpt.sx, tagY + 0.5);
        ctx.restore();
      }
    }
}

export function cropsDrawHomeOwlLanternMarks(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const marks: HomeOwlLanternMark[] = sim.state.neighborSocial?.homeLanternMarks ?? [];
    if (marks.length === 0) return;
    const ctx = self.ctx;
    const zoom = cam.zoom;

    for (const mark of marks) {
      const b = self.buildingMap.get(mark.buildingUid);
      if (!b) continue;
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const zLift = item.isFarmlandPlot ? 78 : 88 + Math.max(bw, bh) * 16;
      const pt = gridToScreen(
        b.gx + bw * 0.5,
        b.gy + bh * 0.5,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + zLift
      );
      if (pt.sx < -90 || pt.sx > viewW + 90 || pt.sy < -90 || pt.sy > viewH + 90) continue;

      const bob = Math.sin(self.tick * 0.075 + b.gx * 2.1 + b.gy) * 4;
      const py = pt.sy + bob;

      self.hotspots.push({
        kind: 'home_lantern',
        id: mark.id,
        sx: pt.sx,
        sy: py,
        radius: Math.max(30, 32 * zoom),
      });

      self.drawRadialGlow(pt.sx, py, 38 * zoom, 'rgba(251, 146, 60, 0.65)');

      ctx.save();
      ctx.font = '800 11.5px "Be Vietnam Pro", sans-serif';
      const label = `🏮 ${mark.helperEmoji} ${mark.helperName} giúp!`;
      const tw = ctx.measureText(label).width;
      const pw = Math.max(106, tw + 22);
      const ph = 26;

      ctx.fillStyle = 'rgba(124, 45, 18, 0.95)';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(pt.sx - pw * 0.5, py - ph * 0.5, pw, ph, ph * 0.5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef3c7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, pt.sx, py + 0.5);
      ctx.restore();
    }
}

export function cropsDrawTutorialWorldTarget(self: IsometricRenderer, 
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const target = sim.getTutorialWorldTarget();
    if (!target) return;
    const ctx = self.ctx;
    const zoom = cam.zoom;
    const elev = sim.grid[target.gy]?.[target.gx]?.elevation ?? 0;
    const zBase = elev * ELEV_PX;

    const c00 = gridToScreen(target.gx, target.gy, cam, viewW, viewH, zBase + 2);
    const c10 = gridToScreen(target.gx + target.bw, target.gy, cam, viewW, viewH, zBase + 2);
    const c11 = gridToScreen(target.gx + target.bw, target.gy + target.bh, cam, viewW, viewH, zBase + 2);
    const c01 = gridToScreen(target.gx, target.gy + target.bh, cam, viewW, viewH, zBase + 2);
    const centerGround = gridToScreen(
      target.gx + target.bw * 0.5,
      target.gy + target.bh * 0.5,
      cam,
      viewW,
      viewH,
      zBase + 4
    );
    const topPin = gridToScreen(
      target.gx + target.bw * 0.5,
      target.gy + target.bh * 0.5,
      cam,
      viewW,
      viewH,
      zBase + 98
    );

    if (
      centerGround.sx < -140 ||
      centerGround.sx > viewW + 140 ||
      centerGround.sy < -140 ||
      centerGround.sy > viewH + 140
    ) {
      return;
    }

    const pulse = self.reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(self.tick * 0.1);
    const bob = self.reducedMotion ? 0 : Math.sin(self.tick * 0.12) * 5.5;

    ctx.save();
    // 1. Soft sunlit golden radial aura on the ground
    self.drawRadialGlow(
      centerGround.sx,
      centerGround.sy,
      (68 + pulse * 14) * zoom,
      `rgba(253, 224, 71, ${(0.28 + pulse * 0.18).toFixed(2)})`
    );

    // 2. Pulsing isometric golden diamond border around the plot footprint
    ctx.beginPath();
    ctx.moveTo(c00.sx, c00.sy);
    ctx.lineTo(c10.sx, c10.sy);
    ctx.lineTo(c11.sx, c11.sy);
    ctx.lineTo(c01.sx, c01.sy);
    ctx.closePath();
    ctx.fillStyle = `rgba(254, 240, 138, ${(0.14 + pulse * 0.12).toFixed(2)})`;
    ctx.fill();
    ctx.lineWidth = Math.max(2.6, 3.6 * zoom);
    ctx.strokeStyle = '#fde047';
    ctx.stroke();

    // 3. Bouncing Township-style callout pill + downward pointer arrow above the plot
    const py = topPin.sy + bob;
    ctx.font = '800 12.5px "Be Vietnam Pro", sans-serif';
    const tw = ctx.measureText(target.label).width;
    const pw = Math.max(134, tw + 26);
    const ph = 30;

    // Downward pointer arrow
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#3a2212';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(topPin.sx - 8, py + ph * 0.5 - 2);
    ctx.lineTo(topPin.sx + 8, py + ph * 0.5 - 2);
    ctx.lineTo(topPin.sx, py + ph * 0.5 + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rounded cream-and-gold pill
    ctx.fillStyle = '#fffbeb';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.roundRect(topPin.sx - pw * 0.5, py - ph * 0.5, pw, ph, ph * 0.5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4a2c16';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(target.label, topPin.sx, py + 0.5);
    ctx.restore();
}

export function cropsDrawHarvestOverflowPill(self: IsometricRenderer, sx: number, sy: number, zoom: number, overflow: number): void {
    const ctx = self.ctx;
    const bob = Math.sin(self.tick * 0.08 + overflow) * 2.5;
    const r = Math.max(25, Math.min(38, 33 * zoom));
    const px = sx + 8 * zoom;
    const py = sy - 12 * zoom - r - 14 + bob;

    ctx.save();
    ctx.font = '800 11px "Be Vietnam Pro", sans-serif';
    const label = `+${overflow} còn`;
    const tw = ctx.measureText(label).width;
    const pw = Math.max(50, tw + 22);
    const ph = 22;

    ctx.globalAlpha = 0.92;
    ctx.fillStyle = 'rgba(255, 248, 220, 0.94)';
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(px - pw * 0.5, py - ph * 0.5, pw, ph, ph * 0.5);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#78350f';
    ctx.fillText(label, px, py);
    ctx.restore();
}

export function cropsDrawGhostPlacement(self: IsometricRenderer, 
    sim: ParkSimulation,
    item: CatalogItem,
    gx: number,
    gy: number,
    rotation: 0 | 1 | 2 | 3,
    cam: Camera,
    viewW: number,
    viewH: number,
    ignoreBuildingUid?: string
  ): void {
    const ctx = self.ctx;
    const check = sim.canPlaceItem(item, gx, gy, rotation, ignoreBuildingUid);
    const { bw, bh } = sim.getBuildingFootprint(item, rotation);
    const elev = sim.grid[gy]?.[gx]?.elevation ?? 0;
    const zOff = elev * ELEV_PX;

    const { pTop, pRight, pBottom, pLeft } = self.rectScreenCorners(
      gx,
      gy,
      bw,
      bh,
      cam,
      viewW,
      viewH,
      zOff
    );

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pTop.sx, pTop.sy);
    ctx.lineTo(pRight.sx, pRight.sy);
    ctx.lineTo(pBottom.sx, pBottom.sy);
    ctx.lineTo(pLeft.sx, pLeft.sy);
    ctx.closePath();
    ctx.fillStyle = check.ok ? 'rgba(74, 222, 128, 0.36)' : 'rgba(248, 113, 113, 0.42)';
    ctx.fill();
    ctx.strokeStyle = check.ok ? '#4ade80' : '#f87171';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    const baseSprite = self.sprites.get(item.spriteKey);
    if (baseSprite) {
      const isNonSquare = item.width !== item.height;
      const footprintW = (bw + bh) * (TILE_W * 0.5) * cam.zoom;
      const scaleMult = item.spriteScale ?? (isNonSquare ? 1.0 : 1.05);
      const drawW = footprintW * scaleMult;
      const drawH = drawW * (baseSprite.height / baseSprite.width);
      const ghostStageKey = (item.isFarmlandPlot ? 'crop_plot_tilled' : item.spriteKey) as
        | 'crop_plot_tilled'
        | 'burrow_pumpkin_gnomes'
        | 'burrow_chicken_coop'
        | 'burrow_flower_garden'
        | 'burrow_animal_pasture';
      const sprite =
        item.connectableGroup && check.ok
          ? (self.sprites.getConnectedFarmlandSprite(
              ghostStageKey,
              self.computePlotConnMask(
                sim,
                gx,
                gy,
                bw,
                bh,
                elev,
                item.connectableGroup,
                cam.viewRot ?? 0,
                Date.now()
              ),
              drawW * self.dpr
            ) ?? baseSprite)
          : baseSprite;
      const centerX = (pLeft.sx + pRight.sx) * 0.5;
      const rotTotal = (rotation + (cam.viewRot ?? 0)) % 4;
      const flipGhost = item.connectableGroup
        ? false
        : isNonSquare
          ? (rotTotal & 1) === 1
          : rotTotal === 1 || rotTotal === 2;
      ctx.globalAlpha = item.connectableGroup && check.ok ? 0.88 : 0.72;
      if (flipGhost) {
        ctx.save();
        ctx.translate(centerX, pBottom.sy);
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, -drawW * 0.5, -drawH + 4 * cam.zoom, drawW, drawH);
        ctx.restore();
      } else {
        ctx.drawImage(sprite, centerX - drawW * 0.5, pBottom.sy - drawH + 4 * cam.zoom, drawW, drawH);
      }
    }

    // Preview rotated Entrance/Exit gates right while placing!
    if (check.ok && (item.category === 'ride' || item.category === 'shop')) {
      ctx.globalAlpha = 1;
      const fakeB = { gx, gy, rotation } as PlacedBuilding;
      self.drawGateIndicators(sim, fakeB, bw, bh, cam, viewW, viewH);
    }

    if (!check.ok && check.reason) {
      ctx.globalAlpha = 1;
      ctx.font = '600 12px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#1c130d';
      ctx.lineWidth = 3;
      ctx.strokeText(check.reason, pBottom.sx, pTop.sy - 8);
      ctx.fillStyle = '#fecaca';
      ctx.fillText(check.reason, pBottom.sx, pTop.sy - 8);
    }
    ctx.restore();
}

export function cropsDrawLockedZonePlaque(self: IsometricRenderer, 
    sim: ParkSimulation,
    z: ZoneDef,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    if (sim.isVisitingNeighbor) return;
    const cx = (z.x1 + z.x2 + 1) * 0.5;
    const cy = (z.y1 + z.y2 + 1) * 0.5;
    const pt = gridToScreen(cx, cy, cam, viewW, viewH, 14);
    if (pt.sx < -140 || pt.sx > viewW + 140 || pt.sy < -100 || pt.sy > viewH + 100) return;

    const canUnlock = sim.state.level >= z.unlockLevel;
    const isNight = sim.getRealTimePeriod() === 'night' || sim.getRealTimePeriod() === 'dusk';
    const ctx = self.ctx;
    const titleStr = `🌲 ${z.name}`;
    const zoneStarCost = getZonePuzzleStarCost(z);
    const costBadge = zoneStarCost > 0 ? `🌟 ${zoneStarCost} Sao` : `${z.unlockCost} 🪙`;
    const sub = canUnlock
      ? `🔓 Mở khóa ngay (${costBadge})`
      : `Cấp ${z.unlockLevel} • ${costBadge}`;

    ctx.save();
    ctx.font = '800 12.5px "Be Vietnam Pro", sans-serif';
    const titleW = ctx.measureText(titleStr).width;
    ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
    const subW = ctx.measureText(sub).width;
    const w = Math.max(186, Math.ceil(Math.max(titleW, subW)) + 28);
    const h = 56;

    self.hotspots.push({
      kind: 'zone_plaque',
      id: z.id,
      sx: pt.sx,
      sy: pt.sy,
      radius: 56,
    });

    // Soft drifting cream-white storybook mist clouds floating lazily over the Enchanted Forest clearing
    const drift = self.reducedMotion ? 0 : Math.sin(self.tick * 0.018 + z.x1) * 14 * cam.zoom;
    ctx.fillStyle = isNight ? 'rgba(186, 206, 238, 0.22)' : 'rgba(255, 253, 246, 0.56)';
    ctx.beginPath();
    ctx.ellipse(pt.sx - 62 * cam.zoom + drift, pt.sy + 12 * cam.zoom, 42 * cam.zoom, 15 * cam.zoom, 0, 0, Math.PI * 2);
    ctx.ellipse(pt.sx + 66 * cam.zoom - drift, pt.sy - 8 * cam.zoom, 38 * cam.zoom, 14 * cam.zoom, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chunky 3D warm espresso drop shadow under signpost pill
    ctx.fillStyle = 'rgba(74, 44, 22, 0.34)';
    ctx.beginPath();
    ctx.roundRect(pt.sx - w * 0.5, pt.sy - h * 0.5 + 3.5, w, h, 16);
    ctx.fill();

    const grad = ctx.createLinearGradient(0, pt.sy - h * 0.5, 0, pt.sy + h * 0.5);
    if (canUnlock) {
      grad.addColorStop(0, '#fef9c3');
      grad.addColorStop(1, '#fcd34d');
    } else {
      grad.addColorStop(0, '#fffdf7');
      grad.addColorStop(1, '#f3e5c8');
    }
    ctx.fillStyle = grad;
    ctx.strokeStyle = canUnlock ? '#b45309' : '#7a5638';
    ctx.lineWidth = canUnlock ? 2.6 : 2.0;
    ctx.beginPath();
    ctx.roundRect(pt.sx - w * 0.5, pt.sy - h * 0.5, w, h, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '800 12.5px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#3d2310';
    ctx.fillText(titleStr, pt.sx, pt.sy - 7);

    ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = canUnlock ? '#15803d' : '#7c5329';
    ctx.fillText(sub, pt.sx, pt.sy + 12);
    ctx.restore();
}
