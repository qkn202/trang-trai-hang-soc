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

export function buildingsGetCropIconImage(self: IsometricRenderer, cropId: FarmCropId): CanvasImageSource | undefined {
    return self.sprites.get(FARM_CROPS[cropId].iconKey);
}

export function buildingsDrawPlacedBuilding(self: IsometricRenderer, 
    sim: ParkSimulation,
    b: PlacedBuilding,
    item: CatalogItem,
    bw: number,
    bh: number,
    elev: number,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    isNight: boolean,
    shadowVec: { dx: number; dy: number; alpha: number },
    isSelected: boolean,
    cutaway = false
  ): void {
    const ctx = self.ctx;
    const zOff = elev * ELEV_PX;
    const { pTop, pRight, pBottom, pLeft } = self.rectScreenCorners(
      b.gx,
      b.gy,
      bw,
      bh,
      cam,
      viewW,
      viewH,
      zOff
    );

    const centerX = (pLeft.sx + pRight.sx) * 0.5;
    const bottomY = pBottom.sy;
    const footprintW = (bw + bh) * (TILE_W * 0.5) * cam.zoom;
    const connGroup = item.connectableGroup;
    const isConnectablePlot = Boolean(connGroup);
    const plotConnMask = connGroup
      ? buildingsComputePlotConnMask(self, sim, b.gx, b.gy, bw, bh, elev, connGroup, cam.viewRot ?? 0, now)
      : 0;

    // Dynamic Time-of-Day Ground Shadow + Snug Ambient Occlusion Contact Shadow
    // Skip overlapping cast shadows across connected plots so merged soil/sand stays 100% seamless!
    if (!isConnectablePlot || (plotConnMask & 0xff) === 0) {
      const centerGroundY = (pTop.sy + pBottom.sy) * 0.5;
      ctx.save();
      ctx.fillStyle = isNight
        ? `rgba(8, 12, 26, ${cutaway ? shadowVec.alpha * 0.35 : shadowVec.alpha * (isConnectablePlot ? 0.55 : 1)})`
        : `rgba(34, 56, 26, ${cutaway ? shadowVec.alpha * 0.32 : shadowVec.alpha * (isConnectablePlot ? 0.5 : 0.92)})`;
      ctx.beginPath();
      ctx.ellipse(
        centerX + shadowVec.dx * cam.zoom * (isConnectablePlot ? 0.45 : 1),
        centerGroundY + shadowVec.dy * cam.zoom * (isConnectablePlot ? 0.45 : 1),
        footprintW * (isConnectablePlot ? 0.39 : 0.43),
        footprintW * (isConnectablePlot ? 0.19 : 0.21),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Snug warm AO contact shadow + Honey-Limestone Courtyard Flagstone Apron hugging building foundation!
      if (!cutaway) {
        const hasFlagstoneApron =
          !isConnectablePlot &&
          !item.isFarmlandPlot &&
          !item.spriteKey?.startsWith('env_') &&
          item.id !== 'black_lake_boats' &&
          item.id !== 'hogsmeade_stone_bridge' &&
          (bw >= 2 || bh >= 2);
        if (hasFlagstoneApron) {
          const padR = footprintW * 0.42;
          ctx.fillStyle = isNight ? '#3a3026' : '#8a6842';
          ctx.beginPath();
          ctx.ellipse(centerX, centerGroundY + 5.2 * cam.zoom, padR, padR * 0.48, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = isNight ? '#7a6f61' : '#ead4ab';
          ctx.strokeStyle = isNight ? '#3a3026' : '#5e4326';
          ctx.lineWidth = Math.max(0.95, 1.3 * cam.zoom);
          ctx.beginPath();
          ctx.ellipse(centerX, centerGroundY + 3.6 * cam.zoom, padR * 0.98, padR * 0.46, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Front doorstep stepping stones jutting onto lawn
          for (const [ox, oy, sr] of [
            [-0.26, 0.36, 6.2],
            [0.02, 0.42, 6.8],
            [0.28, 0.34, 5.9],
          ] as Array<[number, number, number]>) {
            const stX = centerX + ox * footprintW;
            const stY = centerGroundY + oy * footprintW * 0.48 + 3.5 * cam.zoom;
            ctx.fillStyle = isNight ? '#8a7e6e' : '#f7e6c4';
            ctx.beginPath();
            ctx.ellipse(stX, stY, sr * cam.zoom, sr * 0.48 * cam.zoom, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }

        ctx.fillStyle = isNight ? 'rgba(10, 12, 24, 0.30)' : 'rgba(54, 34, 14, 0.25)';
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerGroundY + 3.5 * cam.zoom,
          footprintW * 0.36,
          footprintW * 0.175,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();
    }

    const isFlatGroundStructure = Boolean(
      isConnectablePlot ||
        item.isFarmlandPlot ||
        item.id === 'burrow_reed_pond_mill' ||
        item.id === 'hogsmeade_stone_bridge' ||
        item.id === 'burrow_puffskein_pasture'
    );
    const fadeInCutaway =
      cutaway && !isFlatGroundStructure && (bw >= 2 || bh >= 2 || item.id === 'snowy_pines');
    const showCutawayFootprint = fadeInCutaway && Boolean(sim.state.settings.showGrid);

    if (isSelected || showCutawayFootprint) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pTop.sx, pTop.sy);
      ctx.lineTo(pRight.sx, pRight.sy);
      ctx.lineTo(pBottom.sx, pBottom.sy);
      ctx.lineTo(pLeft.sx, pLeft.sy);
      ctx.closePath();
      if (showCutawayFootprint && !isSelected) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
        ctx.fill();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)';
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3;
      }
      ctx.stroke();
      ctx.restore();

      // Show Rotated Entrance (🟢) & Exit (🔵) Gate Markers when selected!
      if (isSelected && (item.category === 'ride' || item.category === 'shop')) {
        buildingsDrawGateIndicators(self, sim, b, bw, bh, cam, viewW, viewH);
      }
    }

    const buildingHotspot: ScreenHotspot = {
      kind: 'building',
      id: b.uid,
      sx: centerX,
      sy: bottomY - footprintW * 0.35,
      radius: Math.max(22, footprintW * 0.36),
    };
    if (!fadeInCutaway) {
      self.hotspots.push(buildingHotspot);
    }

    // Under construction / Egg incubating state (Real-time wall-clock scaffolding & progress!)
    if (now < b.constructEndsAt) {
      const totalMs = Math.max(
        1000,
        item.buildDurationSec * 1000,
        b.constructEndsAt - (b.placedAt || now - 1000) + (b.buildReducedSec ?? 0) * 1000
      );
      const progress = Math.max(0.04, Math.min(0.99, 1 - (b.constructEndsAt - now) / totalMs));

      ctx.save();
      // 1. Isometric earth & stone construction foundation pad
      ctx.beginPath();
      ctx.moveTo(pTop.sx, pTop.sy);
      ctx.lineTo(pRight.sx, pRight.sy);
      ctx.lineTo(pBottom.sx, pBottom.sy);
      ctx.lineTo(pLeft.sx, pLeft.sy);
      ctx.closePath();
      ctx.fillStyle = item.isCreatureHabitat
        ? 'rgba(146, 100, 42, 0.68)'
        : 'rgba(92, 64, 38, 0.72)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.75)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const scafH = Math.max(26, footprintW * 0.42);

      if (item.isCreatureHabitat) {
        // Warm straw nest + rocking spotted magical egg
        const nestCy = (pTop.sy + pBottom.sy) * 0.5 + 2 * cam.zoom;
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(centerX, nestCy, 19 * cam.zoom, 9 * cam.zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const wobble = Math.sin(self.tick * 0.1) * 0.12;
        ctx.save();
        ctx.translate(centerX, nestCy - 11 * cam.zoom);
        ctx.rotate(wobble);
        const eggGrad = ctx.createRadialGradient(-3 * cam.zoom, -4 * cam.zoom, 2, 0, 0, 16 * cam.zoom);
        eggGrad.addColorStop(0, '#fef9c3');
        eggGrad.addColorStop(0.55, '#f59e0b');
        eggGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = eggGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 11.5 * cam.zoom, 15.5 * cam.zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      } else {
        // 2. Rising magical blueprint silhouette of the actual structure!
        const sprite = self.sprites.get(item.spriteKey);
        if (sprite) {
          const isNonSquare = item.width !== item.height;
          const drawW = footprintW * (isNonSquare ? 1.0 : 1.05);
          const drawH = drawW * (sprite.height / sprite.width);
          const drawX = centerX - drawW * 0.5;
          const drawY = bottomY - drawH + 8 * cam.zoom;

          // Faint ghost blueprint of full height
          ctx.globalAlpha = 0.22;
          ctx.drawImage(sprite, drawX, drawY, drawW, drawH);

          // Solidifying bottom-up portion proportional to real-time progress!
          const revealH = drawH * progress;
          const crestY = drawY + drawH - revealH;
          ctx.save();
          ctx.beginPath();
          ctx.rect(drawX, crestY, drawW, revealH);
          ctx.clip();
          ctx.globalAlpha = 0.78;
          ctx.drawImage(sprite, drawX, drawY, drawW, drawH);
          ctx.restore();
          ctx.globalAlpha = 1;

          // Golden magical construction scanline at crest
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
          ctx.lineWidth = 2 * cam.zoom;
          ctx.beginPath();
          ctx.moveTo(centerX - drawW * 0.34, crestY);
          ctx.lineTo(centerX + drawW * 0.34, crestY);
          ctx.stroke();
        }

        // 3. 2.5D Painted Timber Scaffolding (`prop_construction_site`) + Enchanted Hammer Sparks!
        const scafSp = self.sprites.get('prop_construction_site');
        if (scafSp) {
          const scafW = footprintW * 1.04;
          const scafDrawH = scafW * (scafSp.height / scafSp.width);
          ctx.globalAlpha = 0.92;
          ctx.drawImage(scafSp, centerX - scafW * 0.5, bottomY - scafDrawH + 6 * cam.zoom, scafW, scafDrawH);
          ctx.globalAlpha = 1;
        } else {
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = Math.max(1.5, 2.2 * cam.zoom);
          const corners = [pTop, pRight, pBottom, pLeft];
          const postTopH = scafH * (0.45 + 0.55 * progress);
          for (const pt of corners) {
            ctx.beginPath();
            ctx.moveTo(pt.sx, pt.sy);
            ctx.lineTo(pt.sx, pt.sy - postTopH);
            ctx.stroke();
          }
        }

        const hammerSp = self.sprites.get('ui_icon_hammer_wand');
        if (hammerSp && !self.reducedMotion) {
          const swing = Math.sin(self.tick * 0.14 + b.gx) * 0.24;
          const hSize = Math.max(22, 32 * cam.zoom);
          const hx = centerX + footprintW * 0.22;
          const hy = bottomY - scafH * (0.58 + 0.28 * progress) + Math.sin(self.tick * 0.1) * 3 * cam.zoom;
          self.drawRadialGlow(hx, hy, 14 * cam.zoom, 'rgba(253, 224, 71, 0.45)');
          ctx.save();
          ctx.translate(hx, hy);
          ctx.rotate(swing);
          ctx.drawImage(hammerSp, -hSize * 0.5, -hSize * 0.5, hSize, hSize);
          ctx.restore();
        }
      }

      // Crisp floating countdown pill + progress bar is rendered in top overlay pass (drawInWorldWaitTimers)
      ctx.restore();
      return;
    }

    // Procedural Decor Props (Marble Bench, Floating Candles, House Banners, Patronus Ward Lantern)
    if (item.id === 'marble_bench') {
      buildingsDrawMarbleBenchProp(self, centerX, bottomY, cam.zoom, isNight);
      return;
    }
    if (item.id === 'floating_candles_post') {
      buildingsDrawFloatingCandlesProp(self, centerX, bottomY, cam.zoom, isNight);
      return;
    }
    if (item.id === 'house_banners') {
      buildingsDrawHouseBannerProp(self, centerX, bottomY, cam.zoom, b.gx + b.gy);
      return;
    }
    if (item.id === 'patronus_ward_lantern') {
      buildingsDrawPatronusLanternProp(self, centerX, bottomY, cam.zoom);
      return;
    }

    // Unified 4-Stage Farmland Plot resolution on the single `crop_plot_tilled` / `crop_plot_sprouts` frame!
    let activeSpriteKey = item.spriteKey;
    let plotGrowRatio = 0;
    if (item.isFarmlandPlot) {
      if (!b.cropId) {
        activeSpriteKey = 'crop_plot_tilled';
      } else {
        const plantedAt = b.cropPlantedAt ?? now - 10_000;
        const readyAt = b.cropReadyAt ?? now;
        const totalGrowMs = Math.max(1000, readyAt - plantedAt);
        plotGrowRatio = now >= readyAt ? 1 : Math.max(0, Math.min(0.99, (now - plantedAt) / totalGrowMs));
        if (plotGrowRatio >= 0.25 && plotGrowRatio < 0.66) {
          activeSpriteKey = 'crop_plot_sprouts';
        } else {
          activeSpriteKey = 'crop_plot_tilled';
        }
      }
    }

    const rawSprite = self.sprites.get(activeSpriteKey);
    if (rawSprite) {
      const isNonSquare = item.width !== item.height;
      const scaleMult = item.spriteScale ?? (isNonSquare ? 1.0 : 1.05);
      const drawW = footprintW * scaleMult;
      const drawH = drawW * (rawSprite.height / rawSprite.width);
      const sprite = isConnectablePlot
        ? (self.sprites.getConnectedFarmlandSprite(
            activeSpriteKey as
              | 'crop_plot_tilled'
              | 'crop_plot_sprouts'
              | 'burrow_pumpkin_gnomes'
              | 'burrow_chicken_coop'
              | 'burrow_flower_garden'
              | 'burrow_animal_pasture',
            plotConnMask,
            drawW * self.dpr
          ) ?? rawSprite)
        : (self.sprites.getMip(activeSpriteKey, drawW * self.dpr) ?? rawSprite);

      const cropNocturnalGlow =
        item.isFarmlandPlot && b.cropId ? FARM_CROPS[b.cropId]?.nocturnalGlowColor : undefined;
      if (item.isFlooPortal) {
        self.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.45,
          drawW * 0.55,
          `rgba(52, 211, 153, ${0.38 + Math.sin(self.tick * 0.1) * 0.12})`
        );
      } else if (cropNocturnalGlow) {
        self.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.48,
          drawW * (isNight ? 0.64 : 0.42),
          cropNocturnalGlow
        );
      } else if (isNight && (!isConnectablePlot || b.cropId === 'glow_mushroom')) {
        self.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.42,
          drawW * 0.55,
          item.isFarmlandPlot ? 'rgba(56, 189, 248, 0.22)' : 'rgba(251, 191, 36, 0.24)'
        );
      } else if (!isNight && !fadeInCutaway && !isConnectablePlot && (bw >= 2 || bh >= 2)) {
        // Warm Golden Hour sunlit rooftop & gable rim bounce (Mockup 1)
        self.drawRadialGlow(
          centerX + drawW * 0.12,
          bottomY - drawH * 0.68,
          drawW * 0.46,
          'rgba(255, 248, 196, 0.22)'
        );
      }

      const rotTotal = (b.rotation + (cam.viewRot ?? 0)) % 4;
      const flipSprite = isConnectablePlot
        ? false
        : isNonSquare
          ? (rotTotal & 1) === 1
          : rotTotal === 1 || rotTotal === 2;
      const squash = self.getSquashScale(b.uid, now);
      const completion = self.getCompletionPop(b.uid, now);

      // Attach pixel-accurate bounding box + alpha mask reference to building hotspot
      buildingHotspot.spriteKey = activeSpriteKey;
      buildingHotspot.flipX = flipSprite;
      buildingHotspot.boxLeft = centerX - drawW * 0.5;
      buildingHotspot.boxTop = bottomY - drawH + 4 * cam.zoom;
      buildingHotspot.boxW = drawW;
      buildingHotspot.boxH = drawH;
      buildingHotspot.sy = bottomY - drawH * 0.45;
      buildingHotspot.radius = Math.max(26, Math.max(drawW, drawH) * 0.52);

      // Warm golden sunburst halo right behind a newly unveiled building!
      if (completion.ring > 0 && completion.ring < 0.72) {
        const haloAlpha = (1 - completion.ring / 0.72) * 0.52;
        self.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.46,
          Math.max(drawW, drawH) * 0.76,
          `rgba(254, 240, 138, ${haloAlpha})`
        );
      }

      const isActivelyCrafting = Boolean(
        !self.reducedMotion && b.workshopQueue && b.workshopQueue.length > 0
      );
      const craftBreathX = isActivelyCrafting
        ? 1 + Math.sin(self.tick * 0.13 + b.gx * 1.7) * 0.013
        : 1;
      const craftBreathY = isActivelyCrafting
        ? 1 - Math.sin(self.tick * 0.13 + b.gx * 1.7) * 0.015
        : 1;
      const isFoliageProp =
        Boolean(item.spriteKey?.startsWith('env_')) && item.spriteKey !== 'env_mossy_rock';
      const foliageShear =
        !self.reducedMotion && isFoliageProp
          ? Math.sin(self.tick * 0.038 - b.gx * 0.26 - b.gy * 0.18) * 0.048
          : 0;

      ctx.save();
      if (fadeInCutaway) {
        ctx.globalAlpha = 0.28;
      }
      ctx.translate(centerX, bottomY + (4 - completion.liftY) * cam.zoom);
      if (foliageShear !== 0) {
        ctx.transform(1, 0, foliageShear, 1, 0, 0);
      }
      ctx.scale(
        (flipSprite ? -1 : 1) * squash.sx * completion.scale * craftBreathX,
        squash.sy * completion.scale * craftBreathY
      );
      ctx.drawImage(sprite, -drawW * 0.5, -drawH, drawW, drawH);

      if (item.isFarmlandPlot) {
        // Flip back horizontally inside local space so crops & sign details stay crisp
        if (flipSprite) {
          ctx.scale(-1, 1);
        }
        if (!b.cropId && self.activeSeedBrushCropId) {
          self.drawEmptyPlotSeedCue(drawW, drawH);
        } else if (b.cropId && plotGrowRatio < 0.25) {
          self.drawFarmlandSeedlings(drawW, drawH, plotGrowRatio, Boolean(b.cropWateredBoost));
        } else if (b.cropId && plotGrowRatio >= 0.66) {
          self.drawFarmlandCropRows(
            b.cropId,
            drawW,
            drawH,
            plotGrowRatio,
            Boolean(b.cropWateredBoost),
            b.gx * 7 + b.gy * 13
          );
        }
      } else if (item.isAnimalPasturePlot && !b.pastureAnimalId && self.activePastureBrushAnimalId) {
        if (flipSprite) {
          ctx.scale(-1, 1);
        }
        self.drawEmptyPastureAnimalCue(drawW, drawH);
      }
      ctx.restore();

      // Just-finished celebration: golden shockwave ring + rising sparkles.
      if (completion.ring > 0) {
        self.drawCompletionShockwave(
          centerX,
          bottomY,
          drawW,
          drawH,
          cam.zoom,
          completion.ring,
          isNight
        );
        self.drawCompletionSparkles(centerX, bottomY, drawW, drawH, cam.zoom, completion.ring, isNight);
      }

      if (!cutaway) {
        // Tiny Glade-style foreground grass & clover tufts hugging the base on grass/forest tiles!
        const groundTerrain = sim.grid[b.gy]?.[b.gx]?.terrain;
        if (
          (groundTerrain === 'grass' || groundTerrain === 'forest') &&
          item.id !== 'black_lake_boats'
        ) {
          const openSW = !isConnectablePlot || (plotConnMask & ((1 << 6) | (1 << 7))) === 0;
          const openSE = !isConnectablePlot || (plotConnMask & ((1 << 4) | (1 << 5))) === 0;
          if (openSW || openSE) {
            buildingsDrawBuildingBaseGrassTufts(self, 
              pLeft,
              pBottom,
              pRight,
              b.gx * 19 + b.gy * 11,
              cam.zoom,
              isNight,
              openSW,
              openSE
            );
          }
        }
        // Live Animated Ride Vehicles, Roaming Enclosure Creatures & Star Evolution!
        buildingsDrawLiveBuildingAnimations(self, 
          b,
          item,
          centerX,
          bottomY,
          drawW,
          drawH,
          cam.zoom,
          isNight,
          plotConnMask
        );
      }
      if (!item.isRuralFarmstead) {
        buildingsDrawStarArchitecturalEvolution(self, b.stars, centerX, bottomY, drawW, drawH, cam.zoom);
      }

      // V3 System #3: Subtle Golden Synergy Shimmer when part of an active District Combo!
      if ((sim.activeSynergies.buildingGoldMult.get(b.uid) ?? 1) > 1.01) {
        self.drawRadialGlow(
          centerX + Math.cos(self.tick * 0.06 + b.gx) * drawW * 0.28,
          bottomY - drawH * 0.72,
          8 * cam.zoom,
          'rgba(253, 224, 71, 0.7)'
        );
      }

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
      const statusLabelY = bottomY - drawH - (hasFloatingBubble ? 54 * cam.zoom : 6);

      // V3 System #1: Disconnected Road Warning Badge!
      if (!sim.isBuildingConnected(b.uid)) {
        const bob = Math.sin(self.tick * 0.1) * 3;
        ctx.save();
        ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1c130d';
        ctx.lineWidth = 3.2;
        ctx.strokeText('🚧 Chưa nối đường!', centerX, statusLabelY + bob);
        ctx.fillStyle = '#fde047';
        ctx.fillText('🚧 Chưa nối đường!', centerX, statusLabelY + bob);
        ctx.restore();
      } else if (b.isBrokenDown) {
        // V3 System #2: Playful Breakdown Sparks & Badge!
        const spX = centerX + Math.sin(self.tick * 0.25) * 14 * cam.zoom;
        const spY = bottomY - drawH * 0.55 + Math.cos(self.tick * 0.3) * 8 * cam.zoom;
        self.drawRadialGlow(spX, spY, 16 * cam.zoom, 'rgba(192, 132, 252, 0.85)');
        ctx.save();
        ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1c130d';
        ctx.lineWidth = 3.2;
        ctx.strokeText('⚙️ Sự cố! Cần Reparo', centerX, statusLabelY);
        ctx.fillStyle = '#e9d5ff';
        ctx.fillText('⚙️ Sự cố! Cần Reparo', centerX, statusLabelY);
        ctx.restore();
      } else if (item.isBackstage) {
        const sh = sim.backstageCache.get(b.uid);
        if (sh && !sh.isShielded) {
          ctx.save();
          ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#1c130d';
          ctx.lineWidth = 3.2;
          ctx.strokeText('📦 Cần Hàng Rào Cây che!', centerX, statusLabelY);
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('📦 Cần Hàng Rào Cây che!', centerX, statusLabelY);
          ctx.restore();
        }
      }

      if (b.isEscaped) {
        ctx.save();
        ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1c130d';
        ctx.lineWidth = 3.2;
        ctx.strokeText('🚨 Đang dạo chơi!', centerX, statusLabelY);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('🚨 Đang dạo chơi!', centerX, statusLabelY);
        ctx.restore();
      } else if (
        item.isCreatureHabitat &&
        !item.isRuralFarmstead &&
        !hasFloatingBubble &&
        (b.creatureHunger ?? 100) < 35
      ) {
        ctx.save();
        ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1c130d';
        ctx.lineWidth = 3.2;
        ctx.strokeText('🥩 Đói bụng!', centerX, statusLabelY);
        ctx.fillStyle = '#fde047';
        ctx.fillText('🥩 Đói bụng!', centerX, statusLabelY);
        ctx.restore();
      } else if (isSelected && item.isCreatureHabitat && !item.isRuralFarmstead) {
        const nick = b.creatureNickname || item.creatureName || item.name;
        const morphIcon =
          b.creatureMorph === 'radiant' ? '✨' : b.creatureMorph === 'mystic' ? '🌙' : '🐾';
        const isOnExp = sim.state.suitcase.activeExpedition?.habitatUid === b.uid;
        const tag = `${morphIcon} ${nick} · Lv.${b.creatureBondLevel ?? 1}💝${isOnExp ? ' (🧭 Thám hiểm)' : ''}`;
        ctx.save();
        ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1c130d';
        ctx.lineWidth = 3.2;
        ctx.strokeText(tag, centerX, statusLabelY - 2);
        ctx.fillStyle = b.creatureMorph === 'radiant' ? '#fde047' : b.creatureMorph === 'mystic' ? '#7dd3fc' : '#fef3c7';
        ctx.fillText(tag, centerX, statusLabelY - 2);
        ctx.restore();
      }
    }
}

export function buildingsDrawGateIndicators(self: IsometricRenderer, 
    sim: ParkSimulation,
    b: PlacedBuilding,
    bw: number,
    bh: number,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const ctx = self.ctx;
    const gates = getBuildingGates(b, bw, bh);
    const eElev = sim.grid[gates.entranceGy]?.[gates.entranceGx]?.elevation ?? 0;
    const xElev = sim.grid[gates.exitGy]?.[gates.exitGx]?.elevation ?? 0;
    const inPt = gridToScreen(gates.entranceGx + 0.5, gates.entranceGy + 0.5, cam, viewW, viewH, eElev * ELEV_PX + 8);
    const outPt = gridToScreen(gates.exitGx + 0.5, gates.exitGy + 0.5, cam, viewW, viewH, xElev * ELEV_PX + 8);

    ctx.save();
    ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#1c130d';
    ctx.lineWidth = 3;
    ctx.strokeText('🟢 Cổng Vào', inPt.sx, inPt.sy);
    ctx.fillStyle = '#86efac';
    ctx.fillText('🟢 Cổng Vào', inPt.sx, inPt.sy);

    ctx.strokeText('🔵 Cổng Ra', outPt.sx, outPt.sy);
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('🔵 Cổng Ra', outPt.sx, outPt.sy);
    ctx.restore();
}

export function buildingsDrawStarArchitecturalEvolution(self: IsometricRenderer, 
    stars: number,
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number
  ): void {
    if (stars <= 1) return;
    const ctx = self.ctx;
    ctx.save();

    // 2★+: Twin golden filigree lanterns at front corners
    if (stars >= 2) {
      self.drawRadialGlow(cx - drawW * 0.34, bottomY - drawH * 0.16, 9 * zoom, 'rgba(253, 224, 71, 0.65)');
      self.drawRadialGlow(cx + drawW * 0.34, bottomY - drawH * 0.16, 9 * zoom, 'rgba(253, 224, 71, 0.65)');
    }

    // 3★+: Fluttering crimson-and-gold rooftop pennants!
    if (stars >= 3) {
      const wave = Math.sin(self.tick * 0.1 + cx) * 3 * zoom;
      const topY = bottomY - drawH * 0.88;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8 * zoom;
      ctx.beginPath();
      ctx.moveTo(cx - drawW * 0.18, topY + 8 * zoom);
      ctx.lineTo(cx - drawW * 0.18, topY - 10 * zoom);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx - drawW * 0.18, topY - 10 * zoom);
      ctx.lineTo(cx - drawW * 0.18 + 11 * zoom + wave, topY - 6 * zoom);
      ctx.lineTo(cx - drawW * 0.18, topY - 2 * zoom);
      ctx.closePath();
      ctx.fill();
    }

    // 4★+: Arcane golden halo arch behind roof
    if (stars >= 4) {
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.52)';
      ctx.lineWidth = 2 * zoom;
      ctx.beginPath();
      ctx.arc(cx, bottomY - drawH * 0.52, drawW * 0.42, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }

    // 5★: Grand Master Golden Crown Crest + orbiting sparkles!
    if (stars >= 5) {
      const orbAngle = self.tick * 0.05;
      const ox = cx + Math.cos(orbAngle) * drawW * 0.38;
      const oy = bottomY - drawH * 0.62 + Math.sin(orbAngle) * 8 * zoom;
      self.drawRadialGlow(ox, oy, 8 * zoom, 'rgba(254, 240, 138, 0.9)');
    }

    // Crisp Star Badge at base
    ctx.font = `700 ${Math.max(10, Math.round(11 * zoom))}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    const starsStr = '★'.repeat(stars);
    ctx.strokeStyle = '#1c130d';
    ctx.lineWidth = 3;
    ctx.strokeText(starsStr, cx, bottomY - 4 * zoom);
    ctx.fillStyle = '#fde047';
    ctx.fillText(starsStr, cx, bottomY - 4 * zoom);
    ctx.restore();
}

export function buildingsDrawLiveBuildingAnimations(self: IsometricRenderer, 
    b: PlacedBuilding,
    item: CatalogItem,
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    isNight: boolean,
    plotConnMask = 0
  ): void {
    const ctx = self.ctx;
    const itemId = item.id;

    // 0a. Ceremonial Red-and-Gold Ribbon Unveiling Crown (`prop_ribbon_unveil`)!
    if (b.awaitingUnveil) {
      const ribbonSp = self.sprites.get('prop_ribbon_unveil');
      const bobR = self.reducedMotion ? 0 : Math.sin(self.tick * 0.09 + b.gx) * 3.5 * zoom;
      const pulseR = self.reducedMotion ? 1 : 1 + Math.sin(self.tick * 0.11) * 0.045;
      const ribY = bottomY - drawH * 0.44 + bobR;
      self.drawRadialGlow(cx, ribY, Math.max(24, drawW * 0.34), 'rgba(253, 224, 71, 0.52)');
      if (ribbonSp) {
        const ribW = Math.min(drawW * 0.72, Math.max(46 * zoom, drawW * 0.56)) * pulseR;
        const ribH = ribW * (ribbonSp.height / ribbonSp.width);
        ctx.drawImage(ribbonSp, cx - ribW * 0.5, ribY - ribH * 0.5, ribW, ribH);
      }
      self.hotspots.push({
        kind: 'unveil_building',
        id: b.uid,
        sx: cx,
        sy: ribY,
        radius: Math.max(28, drawW * 0.36),
      });
    }

    // 0b. Kinetic Spinning Windmill Sails (`burrow_windmill_canon` + `prop_windmill_sails`)!
    if (itemId === 'burrow_windmill_canon') {
      const sailsSp = self.sprites.get('prop_windmill_sails');
      if (sailsSp) {
        const hubX = cx - drawW * 0.06;
        const hubY = bottomY - drawH * 0.67;
        const sailSize = drawW * 0.78;
        const angle = self.reducedMotion ? 0.38 : self.tick * 0.022;
        ctx.save();
        ctx.translate(hubX, hubY);
        // Foreshorten onto the SW-facing isometric windmill dome plane!
        ctx.transform(0.88, 0.22, -0.12, 0.96, 0, 0);
        ctx.rotate(angle);
        ctx.drawImage(sailsSp, -sailSize * 0.5, -sailSize * 0.5, sailSize, sailSize);
        ctx.restore();

        if (!self.reducedMotion) {
          for (let m = 0; m < 3; m++) {
            const mp = ((self.tick * 0.018 + m * 0.33 + b.gx * 0.1) % 1);
            const mx = cx - drawW * 0.14 + Math.sin(mp * Math.PI * 2 + m) * 8 * zoom;
            const my = bottomY - drawH * 0.32 + mp * 14 * zoom;
            ctx.fillStyle = `rgba(254, 249, 195, ${(1 - mp) * 0.65})`;
            ctx.beginPath();
            ctx.arc(mx, my, 2 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 0c. Kinetic Spinning Stream Waterwheel (`burrow_reed_pond_mill` + `prop_waterwheel_rotor`)!
    if (itemId === 'burrow_reed_pond_mill') {
      const wheelSp = self.sprites.get('prop_waterwheel_rotor');
      if (wheelSp) {
        const wheelX = cx + drawW * 0.21;
        const wheelY = bottomY - drawH * 0.33;
        const wheelSize = drawW * 0.40;
        const angle = self.reducedMotion ? 0.2 : self.tick * 0.032;
        ctx.save();
        ctx.translate(wheelX, wheelY);
        // Foreshorten onto the SE-facing stone millrace wall!
        ctx.transform(0.80, -0.26, 0.12, 0.94, 0, 0);
        ctx.rotate(angle);
        ctx.drawImage(wheelSp, -wheelSize * 0.5, -wheelSize * 0.5, wheelSize, wheelSize);
        ctx.restore();

        if (!self.reducedMotion) {
          for (let d = 0; d < 4; d++) {
            const dp = ((self.tick * 0.045 + d * 0.25) % 1);
            const sx = wheelX + (d - 1.5) * 4.5 * zoom + dp * 6 * zoom;
            const sy = wheelY + wheelSize * 0.34 - Math.sin(dp * Math.PI) * 6 * zoom;
            ctx.fillStyle = `rgba(224, 242, 254, ${(1 - dp) * 0.8})`;
            ctx.beginPath();
            ctx.arc(sx, sy, (1.6 + (1 - dp) * 1.4) * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 0d. Active Workshop Warm Hearth Glow & Fragrant Steam + Cozy Cottage Chimney Puffs + Floo Emerald Fire!
    const hasCottageChimney =
      itemId === 'burrow_house_canon' ||
      itemId === 'molly_apple_bakery' ||
      itemId === 'three_broomsticks' ||
      itemId === 'hagrid_pumpkin_hut';
    if (b.workshopQueue && b.workshopQueue.length > 0 && !b.isBrokenDown) {
      const pulse = self.reducedMotion ? 1 : 0.85 + Math.sin(self.tick * 0.12 + b.gx) * 0.15;
      self.drawRadialGlow(
        cx,
        bottomY - drawH * 0.26,
        Math.max(20, drawW * 0.32) * pulse,
        `rgba(251, 146, 60, ${0.42 * pulse})`
      );
      if (!self.reducedMotion) {
        for (let s = 0; s < 4; s++) {
          const sp = ((self.tick * 0.022 + s * 0.25 + b.gy * 0.17) % 1);
          const sx = cx + sp * 10 * zoom + Math.sin(sp * Math.PI * 2 + s) * 6 * zoom;
          const sy = bottomY - drawH * (0.72 + sp * 0.30);
          ctx.fillStyle = `rgba(254, 243, 199, ${Math.sin(sp * Math.PI) * 0.72})`;
          ctx.beginPath();
          ctx.arc(sx, sy, (2.8 + sp * 4.8) * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (hasCottageChimney && !self.reducedMotion && !b.isBrokenDown) {
      // Cozy gentle woodsmoke curls from The Burrow, Bakery, Three Broomsticks & Hagrid's Hut
      const chX = itemId === 'burrow_house_canon' ? cx + drawW * 0.08 : cx - drawW * 0.12;
      const chY = bottomY - drawH * (itemId === 'burrow_house_canon' ? 0.90 : 0.80);
      for (let s = 0; s < 3; s++) {
        const sp = ((self.tick * 0.014 + s * 0.33 + b.gx * 0.13) % 1);
        const sx = chX + sp * 13 * zoom + Math.sin(sp * Math.PI * 2 + s) * 4 * zoom;
        const sy = chY - sp * 22 * zoom;
        const alpha = Math.sin(sp * Math.PI) * (isNight ? 0.34 : 0.48);
        ctx.fillStyle = isNight ? `rgba(226, 232, 240, ${alpha})` : `rgba(255, 250, 240, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, (2.2 + sp * 4.4) * zoom, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 0d-2. Arthur's Enchanted Tinker Sparks at Ford Anglia Shed (`arthur_ford_shed`)
    if (!self.reducedMotion && itemId === 'arthur_ford_shed' && !b.isBrokenDown) {
      const sparkBurst = Math.sin(self.tick * 0.16 + b.gx) > 0.35;
      if (sparkBurst) {
        const spx = cx + drawW * 0.08;
        const spy = bottomY - drawH * 0.28;
        self.drawRadialGlow(spx, spy, 13 * zoom, 'rgba(56, 189, 248, 0.52)');
        for (let k = 0; k < 3; k++) {
          const ang = self.tick * 0.28 + k * 2.1;
          ctx.fillStyle = k % 2 === 0 ? '#fde047' : '#7dd3fc';
          ctx.beginPath();
          ctx.arc(spx + Math.cos(ang) * 6 * zoom, spy + Math.sin(ang) * 4 * zoom, 1.5 * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 0d-3. Roaring Emerald-Green Floo Hearth Fire & Rising Magical Embers (`floo_fireplace_gate`)!
    if (item.isFlooPortal && !b.isBrokenDown) {
      const flooPulse = self.reducedMotion ? 1 : 0.88 + Math.sin(self.tick * 0.15 + b.gx) * 0.12;
      const hearthY = bottomY - drawH * 0.24;
      // Ground emerald spill onto flagstones
      ctx.save();
      ctx.fillStyle = `rgba(16, 185, 129, ${(isNight ? 0.34 : 0.22) * flooPulse})`;
      ctx.beginPath();
      ctx.ellipse(cx, bottomY - 2 * zoom, drawW * 0.42 * flooPulse, drawW * 0.20 * flooPulse, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      self.drawRadialGlow(
        cx,
        hearthY,
        Math.max(22, drawW * 0.38) * flooPulse,
        `rgba(52, 211, 153, ${(isNight ? 0.62 : 0.42) * flooPulse})`
      );
      if (!self.reducedMotion) {
        for (let e = 0; e < 5; e++) {
          const ep = ((self.tick * 0.032 + e * 0.2 + b.gy * 0.11) % 1);
          const ex = cx + Math.sin(ep * Math.PI * 3 + e * 1.4) * (drawW * 0.16);
          const ey = hearthY - ep * drawH * 0.62;
          const eAlpha = Math.sin(ep * Math.PI) * 0.88;
          ctx.fillStyle = e % 2 === 0 ? `rgba(110, 231, 183, ${eAlpha})` : `rgba(52, 211, 153, ${eAlpha})`;
          ctx.beginPath();
          ctx.arc(ex, ey, (1.6 + (1 - ep) * 1.8) * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 0e. Orbiting Golden Honeybees around Cider & Honey Apiary (`burrow_cider_apiary`)!
    if (!self.reducedMotion && itemId === 'burrow_cider_apiary') {
      for (let bee = 0; bee < 4; bee++) {
        const t = self.tick * 0.055 + bee * 1.57 + b.gx;
        const bx = cx + Math.cos(t) * drawW * (0.18 + (bee % 2) * 0.09);
        const by = bottomY - drawH * (0.36 + (bee % 3) * 0.11) + Math.sin(t * 2) * 4.5 * zoom;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(bx - 1.2 * zoom, by - 2.2 * zoom, 2.2 * zoom, 1.2 * zoom, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(bx, by, 2.6 * zoom, 1.8 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#451a03';
        ctx.fillRect(bx - 0.6 * zoom, by - 1.5 * zoom, 1.1 * zoom, 3 * zoom);
        ctx.restore();
      }
    }

    // 0f. Daytime Fluttering Butterflies over Blooming Flower Gardens & Ripe Flower Crops!
    const hasBloomingFlowers =
      !isNight &&
      !self.reducedMotion &&
      (itemId === 'burrow_flower_garden' ||
        Boolean(
          item.isFarmlandPlot &&
            b.cropId &&
            FARM_CROPS[b.cropId]?.isFlowerCrop &&
            b.cropReadyAt &&
            Date.now() >= b.cropReadyAt
        ));
    if (hasBloomingFlowers) {
      const wingPalette = ['#f472b6', '#38bdf8', '#fde047'];
      for (let bf = 0; bf < 2; bf++) {
        const t = self.tick * 0.042 + bf * 2.4 + b.gx * 1.3 + b.gy * 0.7;
        const fx = cx + Math.sin(t) * drawW * 0.24;
        const fy = bottomY - drawH * 0.56 + Math.cos(t * 1.7) * 5.5 * zoom;
        const flap = Math.abs(Math.sin(self.tick * 0.28 + bf)) * 3.2 * zoom + 1.0 * zoom;
        const col = wingPalette[(b.gx + b.gy + bf) % wingPalette.length];
        ctx.save();
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(fx - flap * 0.6, fy, flap, 2.2 * zoom, -0.3, 0, Math.PI * 2);
        ctx.ellipse(fx + flap * 0.6, fy, flap, 2.2 * zoom, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 0. Roaming Livestock & Magical Beasts inside Connectable Animal Pastures (`burrow_animal_pasture`)!
    if (item.isAnimalPasturePlot && b.pastureAnimalId) {
      const animalMeta = PASTURE_ANIMALS[b.pastureAnimalId];
      if (animalMeta) {
        const mergedHoriz = (plotConnMask & ((1 << 2) | (1 << 3) | (1 << 6) | (1 << 7))) !== 0;
        const mergedVert = (plotConnMask & ((1 << 0) | (1 << 1) | (1 << 4) | (1 << 5))) !== 0;
        const spanX = drawW * (mergedHoriz ? 0.30 : 0.20);
        const spanY = drawH * (mergedVert ? 0.14 : 0.09);
        const baseScale =
          b.pastureAnimalId === 'daisy_cow' ||
          b.pastureAnimalId === 'silver_hippogriff' ||
          b.pastureAnimalId === 'shadow_thestral' ||
          b.pastureAnimalId === 'moon_unicorn'
            ? 44
            : b.pastureAnimalId === 'ottery_sheep'
              ? 40
              : 34;

        for (let idx = 0; idx < 2; idx++) {
          const useAction =
            !self.reducedMotion &&
            Math.floor((self.tick + b.gx * 11 + b.gy * 17 + idx * 29) / 42) % 2 === 1;
          const spKey = animalMeta.spritePair[useAction ? 1 : 0];
          const beastSp = self.sprites.get(spKey) ?? self.sprites.get(animalMeta.spritePair[0]);
          if (!beastSp) continue;

          const phase = self.tick * (idx === 0 ? 0.024 : 0.019) + b.gx * 1.9 + b.gy * 1.3 + idx * 2.6;
          const ax = cx + Math.sin(phase) * spanX + (idx === 0 ? -drawW * 0.06 : drawW * 0.09);
          const hop = self.reducedMotion
            ? 0
            : Math.abs(Math.sin(self.tick * 0.11 + idx * 1.7 + b.gx)) * 2.4 * zoom;
          const ay =
            bottomY -
            drawH * (idx === 0 ? 0.44 : 0.32) +
            Math.cos(phase * 0.85) * spanY -
            hop;
          const szScale = idx === 0 ? 1.0 : 0.8;
          const bwPx = baseScale * szScale * zoom;
          const bhPx = bwPx * (beastSp.height / beastSp.width);

          if (b.pastureAnimalId === 'moon_unicorn') {
            self.drawRadialGlow(ax, ay - bhPx * 0.45, 18 * zoom, 'rgba(224, 242, 254, 0.5)');
          }

          ctx.save();
          // Warm ground AO contact shadow beneath paws/hooves
          ctx.fillStyle = isNight ? 'rgba(12, 18, 30, 0.34)' : 'rgba(34, 62, 24, 0.28)';
          ctx.beginPath();
          ctx.ellipse(ax, ay + hop * 0.6, bwPx * 0.34, bwPx * 0.15, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.translate(ax, ay);
          if (Math.cos(phase) < 0) ctx.scale(-1, 1);
          ctx.drawImage(beastSp, -bwPx * 0.5, -bhPx, bwPx, bhPx);
          ctx.restore();
        }

        // Golden happy grazing motes when fed (+35% speed boost active)!
        if (!self.reducedMotion && b.pastureFedBoost && b.pastureReadyAt && Date.now() < b.pastureReadyAt) {
          for (let m = 0; m < 2; m++) {
            const p = ((self.tick * 0.03 + m * 0.5 + b.gx * 0.2) % 1);
            const mx = cx + Math.sin(m * 3.1 + b.gy) * drawW * 0.18;
            const my = bottomY - drawH * (0.48 + p * 0.32);
            ctx.fillStyle = `rgba(253, 224, 71, ${Math.sin(p * Math.PI) * 0.85})`;
            ctx.beginPath();
            ctx.arc(mx, my, 2.4 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 1. Roaming Magical Beasts inside every Creature Habitat (2-Frame Articulated Action Poses!)
    if (item.isCreatureHabitat && !item.isRuralFarmstead && !b.isEscaped) {
      const beastPair: [string, string] | null =
        itemId === 'hippogriff_glade'
          ? ['beast_hippogriff', 'beast_hippogriff_bow']
          : itemId === 'thestral_grove'
            ? ['beast_thestral', 'beast_thestral_wings']
            : itemId === 'unicorn_glade'
              ? ['beast_unicorn', 'beast_unicorn_prance']
              : itemId === 'phoenix_perch'
                ? ['beast_phoenix', 'beast_phoenix_soar']
                : itemId === 'dragon_lair'
                  ? ['beast_dragon', 'beast_dragon_roar']
                  : itemId === 'hagrid_bowtruckle'
                    ? null
                    : ['beast_niffler', 'beast_niffler_play'];
      if (itemId === 'hagrid_bowtruckle') {
        const auraColor =
          b.creatureMorph === 'radiant'
            ? 'rgba(250, 204, 21, 0.55)'
            : b.creatureMorph === 'mystic'
              ? 'rgba(56, 189, 248, 0.5)'
              : 'rgba(74, 222, 128, 0.35)';
        self.drawRadialGlow(cx, bottomY - drawH * 0.45, 22 * zoom, auraColor);
      }
      const usePoseFrame =
        !self.reducedMotion && Math.floor((self.tick + b.gx * 13 + b.gy * 7) / 48) % 2 === 1;
      const activeBeastKey = beastPair ? beastPair[usePoseFrame ? 1 : 0] : null;
      const beastSp = activeBeastKey
        ? self.sprites.get(activeBeastKey) ?? self.sprites.get(beastPair![0])
        : undefined;
      if (beastSp) {
        const stageScale =
          b.creatureStage === 'baby' ? 0.58 : b.creatureStage === 'legendary' ? 1.05 : 0.84;
        const phase = self.tick * 0.032 + b.gx * 2.1 + b.gy;
        const roamX = cx + Math.sin(phase) * drawW * 0.22;
        const hopY = Math.abs(Math.sin(self.tick * 0.12 + b.gx)) * 3.5 * zoom;
        const roamY = bottomY - drawH * 0.22 - hopY;
        const bwPx = 38 * stageScale * zoom;
        const bhPx = bwPx * (beastSp.height / beastSp.width);

        if (b.creatureMorph === 'radiant') {
          self.drawRadialGlow(roamX, roamY - bhPx * 0.45, 26 * zoom, 'rgba(250, 204, 21, 0.72)');
        } else if (b.creatureMorph === 'mystic') {
          self.drawRadialGlow(roamX, roamY - bhPx * 0.45, 24 * zoom, 'rgba(56, 189, 248, 0.62)');
        } else if (b.creatureStage === 'legendary') {
          self.drawRadialGlow(roamX, roamY - bhPx * 0.4, 22 * zoom, 'rgba(253, 224, 71, 0.55)');
        }

        ctx.save();
        ctx.translate(roamX, roamY);
        if (Math.cos(phase) < 0) ctx.scale(-1, 1);
        ctx.drawImage(beastSp, -bwPx * 0.5, -bhPx, bwPx, bhPx);
        ctx.restore();

        // Zoo Tycoon Breeding Offspring: adorable Baby Beast following parent!
        if (b.hasBabyOffspring) {
          const babyX = cx + Math.sin(phase - 0.9) * drawW * 0.2;
          const babyY = bottomY - drawH * 0.16 - Math.abs(Math.cos(self.tick * 0.16)) * 3 * zoom;
          const babyW = 22 * zoom;
          const babyH = babyW * (beastSp.height / beastSp.width);
          ctx.save();
          ctx.translate(babyX, babyY);
          if (Math.cos(phase - 0.9) < 0) ctx.scale(-1, 1);
          ctx.drawImage(beastSp, -babyW * 0.5, -babyH, babyW, babyH);
          ctx.restore();
        }
      }
    }

    // 2. Live Lake Rowboats & Sanctuary Glow!
    if (itemId === 'black_lake_boats') {
      // Lantern Rowboats gliding smoothly across Black Lake!
      const boatSp = self.sprites.get('vehicle_lake_boat');
      if (boatSp) {
        for (let i = 0; i < 2; i++) {
          const a = self.tick * 0.025 + i * Math.PI;
          const bx = cx + Math.cos(a) * drawW * 0.34;
          const by = bottomY - drawH * 0.16 + Math.sin(a) * drawH * 0.11;
          const w = 36 * zoom;
          const h = w * (boatSp.height / boatSp.width);
          ctx.save();
          ctx.translate(bx, by);
          if (-Math.sin(a) < 0) ctx.scale(-1, 1);
          ctx.drawImage(boatSp, -w * 0.5, -h * 0.75, w, h);
          ctx.restore();
        }
      }
    } else if (itemId === 'phoenix_perch' || itemId === 'hogsmeade_harvest_fountain') {
      self.drawRadialGlow(
        cx,
        bottomY - drawH * 0.65,
        (22 + Math.sin(self.tick * 0.08) * 5) * zoom,
        'rgba(251, 191, 36, 0.42)'
      );
    }

    // 3. Cozy Burrow & Hogsmeade Chimney Smoke Puffs & Magical Shopfront Sparkles!
    if (!self.reducedMotion && !b.isBrokenDown) {
      if (
        itemId === 'burrow_house_canon' ||
        itemId === 'molly_apple_bakery' ||
        itemId === 'burrow_broomsticks_canon' ||
        itemId === 'burrow_honeydukes_canon' ||
        itemId === 'hagrid_pumpkin_hut' ||
        itemId === 'hagrid_bowtruckle' ||
        itemId === 'owlery_elf_hut'
      ) {
        const smokeOffX =
          itemId === 'burrow_house_canon'
            ? -drawW * 0.04
            : itemId === 'molly_apple_bakery'
              ? drawW * 0.16
              : drawW * 0.14;
        const smokeOffY =
          itemId === 'burrow_house_canon'
            ? drawH * 0.96
            : itemId === 'molly_apple_bakery'
              ? drawH * 0.88
              : drawH * 0.86;
        for (let i = 0; i < 3; i++) {
          const phase = ((self.tick * 0.42 + i * 24 + b.gx * 9) % 72) / 72;
          const sx = cx + smokeOffX + Math.sin(phase * Math.PI * 2 + i) * 5 * zoom;
          const sy = bottomY - smokeOffY - phase * 24 * zoom;
          ctx.fillStyle = `rgba(255, 251, 240, ${(1 - phase) * 0.62})`;
          ctx.beginPath();
          ctx.arc(sx, sy, (3.2 + phase * 7.0) * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Enchanted Floating Maroon 'W' Sweater on Knitting Needles beside Molly's Bakery!
      if (itemId === 'molly_apple_bakery') {
        const swSp = self.sprites.get('ui_icon_sweater_ready');
        if (swSp) {
          const bobSw = Math.sin(self.tick * 0.065) * 4 * zoom;
          const tiltSw = Math.sin(self.tick * 0.05) * 0.08;
          const swSize = 54 * zoom;
          const swX = cx + drawW * 0.36;
          const swY = bottomY - drawH * 0.56 + bobSw;
          self.drawRadialGlow(swX, swY, 24 * zoom, 'rgba(254, 240, 138, 0.52)');
          ctx.save();
          ctx.translate(swX, swY);
          ctx.rotate(tiltSw);
          ctx.drawImage(swSp, -swSize * 0.5, -swSize * 0.5, swSize, swSize);
          ctx.restore();
        }
      }

      // Hovering Copper Watering Can pouring sparkling droplets over Growing Unwatered Farmland Plots!
      const isGrowingUnwateredPlot = Boolean(
        item.isFarmlandPlot &&
          b.cropId &&
          b.cropReadyAt &&
          Date.now() < b.cropReadyAt &&
          !b.cropWateredBoost
      );
      if (isGrowingUnwateredPlot) {
        const canSp = self.sprites.get('ui_icon_watering_can');
        if (canSp) {
          const bobCan = Math.sin(self.tick * 0.075) * 3.5 * zoom;
          const tiltCan = -0.14 + Math.sin(self.tick * 0.06) * 0.06;
          const canSize = 48 * zoom;
          const canX = cx + drawW * 0.14;
          const canY = bottomY - drawH * 0.92 + bobCan;
          ctx.save();
          ctx.translate(canX, canY);
          ctx.rotate(tiltCan);
          ctx.drawImage(canSp, -canSize * 0.5, -canSize * 0.5, canSize, canSize);
          ctx.restore();

          // Sparkling water droplets arcing from the spout onto the crops!
          const spoutX = canX - 20 * zoom;
          const spoutY = canY + 7 * zoom;
          for (let d = 0; d < 6; d++) {
            const t = ((self.tick * 0.055 + d * 0.17) % 1);
            const dropX = spoutX - t * 20 * zoom + Math.sin(d * 2.1) * 3 * zoom;
            const dropY = spoutY + t * t * 34 * zoom;
            ctx.fillStyle = `rgba(186, 242, 255, ${(1 - t * 0.5) * 0.92})`;
            ctx.beginPath();
            ctx.ellipse(dropX, dropY, 1.8 * zoom, 2.8 * zoom, 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Active Workshop Baking / Crafting Warm Oven Glow!
      if (b.workshopQueue && b.workshopQueue.length > 0) {
        const pulse = 0.48 + 0.22 * Math.sin(self.tick * 0.1);
        self.drawRadialGlow(
          cx,
          bottomY - drawH * 0.34,
          drawW * 0.38,
          `rgba(251, 146, 60, ${pulse})`
        );
      }

      if (
        itemId === 'butterbeer_cart' ||
        itemId === 'burrow_honeydukes_canon' ||
        itemId === 'eeylops_owl_emporium' ||
        itemId === 'hogsmeade_harvest_fountain'
      ) {
        const spPhase = self.tick * 0.07 + b.gx * 2.3 + b.gy;
        const glX = cx + Math.cos(spPhase) * drawW * 0.24;
        const glY = bottomY - drawH * (0.48 + Math.sin(spPhase * 1.4) * 0.12);
        const pulse = 0.45 + 0.45 * Math.sin(spPhase * 2.1);
        self.drawRadialGlow(glX, glY, 9 * zoom, `rgba(254, 240, 138, ${pulse * 0.78})`);
      }
    }
}

export function buildingsComputePlotConnMask(self: IsometricRenderer, 
    sim: ParkSimulation,
    gx: number,
    gy: number,
    bw: number,
    bh: number,
    elev: number,
    group: ConnectablePlotGroup,
    viewRot: 0 | 1 | 2 | 3,
    now: number
  ): number {
    const { rx0, ry0 } = rotateGridRect(gx, gy, bw, bh, viewRot);
    const ghost = self.ghostConnectableRect;
    const isSameGroupAtRot = (rx: number, ry: number): boolean => {
      const { gx: wx, gy: wy } = rotTileToWorldTile(rx, ry, viewRot);
      if (wx < 0 || wy < 0 || wx >= GRID_SIZE || wy >= GRID_SIZE) return false;
      if (
        ghost &&
        ghost.group === group &&
        ghost.elev === elev &&
        wx >= ghost.gx &&
        wx < ghost.gx + ghost.bw &&
        wy >= ghost.gy &&
        wy < ghost.gy + ghost.bh
      ) {
        return true;
      }
      const cell = sim.grid[wy]?.[wx];
      if (!cell || !cell.buildingUid || cell.buildingUid === self.activeMovingUid) return false;
      if ((cell.elevation ?? 0) !== elev) return false;
      const nb = self.buildingMap.get(cell.buildingUid);
      if (!nb || now < nb.constructEndsAt) return false;
      return getCatalogItem(nb.itemId)?.connectableGroup === group;
    };

    let mask = 0;
    if (isSameGroupAtRot(rx0 - 1, ry0)) mask |= 1 << 0;
    if (isSameGroupAtRot(rx0 - 1, ry0 + 1)) mask |= 1 << 1;
    if (isSameGroupAtRot(rx0, ry0 - 1)) mask |= 1 << 2;
    if (isSameGroupAtRot(rx0 + 1, ry0 - 1)) mask |= 1 << 3;
    if (isSameGroupAtRot(rx0 + 2, ry0)) mask |= 1 << 4;
    if (isSameGroupAtRot(rx0 + 2, ry0 + 1)) mask |= 1 << 5;
    if (isSameGroupAtRot(rx0, ry0 + 2)) mask |= 1 << 6;
    if (isSameGroupAtRot(rx0 + 1, ry0 + 2)) mask |= 1 << 7;
    if (isSameGroupAtRot(rx0 - 1, ry0 - 1)) mask |= 1 << 8;
    if (isSameGroupAtRot(rx0 + 2, ry0 - 1)) mask |= 1 << 9;
    if (isSameGroupAtRot(rx0 + 2, ry0 + 2)) mask |= 1 << 10;
    if (isSameGroupAtRot(rx0 - 1, ry0 + 2)) mask |= 1 << 11;
    return mask;
}

export function buildingsDrawBuildingBaseGrassTufts(self: IsometricRenderer, 
    pLeft: { sx: number; sy: number },
    pBottom: { sx: number; sy: number },
    pRight: { sx: number; sy: number },
    seed: number,
    zoom: number,
    isNight: boolean,
    openSW = true,
    openSE = true
  ): void {
    if (zoom < 0.42) return;
    const ctx = self.ctx;
    const anchors: Array<{ x: number; y: number; big?: boolean }> = [];
    if (openSW) {
      anchors.push({
        x: pLeft.sx + (pBottom.sx - pLeft.sx) * 0.16,
        y: pLeft.sy + (pBottom.sy - pLeft.sy) * 0.16,
      });
    }
    if (openSW && openSE) {
      anchors.push({ x: pBottom.sx, y: pBottom.sy + 1.5 * zoom, big: true });
    }
    if (openSE) {
      anchors.push({
        x: pRight.sx + (pBottom.sx - pRight.sx) * 0.16,
        y: pRight.sy + (pBottom.sy - pRight.sy) * 0.16,
      });
    }
    if (anchors.length === 0) return;
    ctx.save();
    const ink = isNight ? '#1a2e22' : '#4a2c16';
    const leafDark = isNight ? '#28523c' : '#4d9c44';
    const leafBright = isNight ? '#386b4f' : '#84d068';
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      const r = (a.big ? 3.8 : 3.2) * zoom;
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(a.x - r * 0.9, a.y, r + 1 * zoom, 0, Math.PI * 2);
      ctx.arc(a.x + r * 0.9, a.y, r + 1 * zoom, 0, Math.PI * 2);
      ctx.arc(a.x, a.y - r * 0.55, r * 1.1 + 1 * zoom, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = leafDark;
      ctx.beginPath();
      ctx.arc(a.x - r * 0.9, a.y, r, 0, Math.PI * 2);
      ctx.arc(a.x + r * 0.9, a.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = leafBright;
      ctx.beginPath();
      ctx.arc(a.x, a.y - r * 0.55, r * 1.05, 0, Math.PI * 2);
      ctx.fill();

      if (!isNight && (seed + i) % 2 === 0) {
        ctx.fillStyle = (seed + i) % 4 === 0 ? '#fef08a' : '#fff7ed';
        ctx.beginPath();
        ctx.arc(a.x + r * 0.4, a.y - r * 0.7, 1.5 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
}

export function buildingsDrawMarbleBenchProp(self: IsometricRenderer, cx: number, bottomY: number, zoom: number, isNight: boolean): void {
    const ctx = self.ctx;
    // Carved marble bench seat & backrest
    ctx.fillStyle = '#e7e5e4';
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(cx - 14 * zoom, bottomY - 14 * zoom, 28 * zoom, 8 * zoom, 3 * zoom);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(cx - 12 * zoom, bottomY - 20 * zoom, 24 * zoom, 6 * zoom);
    ctx.strokeRect(cx - 12 * zoom, bottomY - 20 * zoom, 24 * zoom, 6 * zoom);

    // Floating candle beside bench
    const bob = Math.sin(self.tick * 0.08 + cx) * 2.5 * zoom;
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(cx + 15 * zoom, bottomY - 28 * zoom + bob, 3.5 * zoom, 8 * zoom);
    self.drawRadialGlow(
      cx + 16.5 * zoom,
      bottomY - 30 * zoom + bob,
      (isNight ? 15 : 8) * zoom,
      'rgba(253, 224, 71, 0.85)'
    );
}

export function buildingsDrawFloatingCandlesProp(self: IsometricRenderer, cx: number, bottomY: number, zoom: number, isNight: boolean): void {
    const ctx = self.ctx;
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#1c130d';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8 * zoom, 10 * zoom, 5 * zoom, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const offsets = [
      [-8, -28, 0],
      [0, -38, 1.5],
      [9, -25, 3.1],
    ];
    for (const [ox, oy, ph] of offsets) {
      const bob = Math.sin(self.tick * 0.07 + ph) * 3.5 * zoom;
      const x = cx + ox * zoom;
      const y = bottomY + oy * zoom + bob;
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(x - 2 * zoom, y, 4 * zoom, 10 * zoom);
      ctx.strokeRect(x - 2 * zoom, y, 4 * zoom, 10 * zoom);
      self.drawRadialGlow(x, y - 2 * zoom, (isNight ? 18 : 9) * zoom, 'rgba(253, 224, 71, 0.88)');
    }
}

export function buildingsDrawHouseBannerProp(self: IsometricRenderer, cx: number, bottomY: number, zoom: number, seed: number): void {
    const ctx = self.ctx;
    const colors = ['#b91c1c', '#15803d', '#1d4ed8', '#ca8a04'];
    const col = colors[seed % 4];
    ctx.strokeStyle = '#1c130d';
    ctx.lineWidth = 2.5 * zoom;
    ctx.beginPath();
    ctx.moveTo(cx, bottomY - 6 * zoom);
    ctx.lineTo(cx, bottomY - 44 * zoom);
    ctx.stroke();

    const wave = Math.sin(self.tick * 0.08 + seed) * 3 * zoom;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(cx, bottomY - 42 * zoom);
    ctx.lineTo(cx + 15 * zoom + wave, bottomY - 37 * zoom);
    ctx.lineTo(cx + 12 * zoom + wave, bottomY - 22 * zoom);
    ctx.lineTo(cx, bottomY - 25 * zoom);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.stroke();
}

export function buildingsDrawPatronusLanternProp(self: IsometricRenderer, cx: number, bottomY: number, zoom: number): void {
    const ctx = self.ctx;
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    ctx.fillRect(cx - 4 * zoom, bottomY - 26 * zoom, 8 * zoom, 20 * zoom);
    ctx.strokeRect(cx - 4 * zoom, bottomY - 26 * zoom, 8 * zoom, 20 * zoom);

    const bob = Math.sin(self.tick * 0.08 + cx) * 3 * zoom;
    const oy = bottomY - 34 * zoom + bob;
    self.drawRadialGlow(cx, oy, 22 * zoom, 'rgba(186, 230, 253, 0.85)');
    ctx.fillStyle = '#f0f9ff';
    ctx.beginPath();
    ctx.arc(cx, oy, 5.5 * zoom, 0, Math.PI * 2);
    ctx.fill();
}

export function buildingsDrawSynergyLinks(self: IsometricRenderer, 
    sim: ParkSimulation,
    selectedUid: string | null,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const ctx = self.ctx;
    for (const link of sim.activeSynergies.links) {
      if (selectedUid && link.aUid !== selectedUid && link.bUid !== selectedUid) continue;
      const ba = self.buildingMap.get(link.aUid);
      const bb = self.buildingMap.get(link.bUid);
      if (!ba || !bb) continue;
      const pa = gridToScreen(ba.gx + 1, ba.gy + 1, cam, viewW, viewH, 34);
      const pb = gridToScreen(bb.gx + 1, bb.gy + 1, cam, viewW, viewH, 34);

      ctx.save();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.6;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(pa.sx, pa.sy);
      const midX = (pa.sx + pb.sx) * 0.5;
      const midY = (pa.sy + pb.sy) * 0.5 - 24 * cam.zoom;
      ctx.quadraticCurveTo(midX, midY, pb.sx, pb.sy);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#1c130d';
      ctx.lineWidth = 3.2;
      const badge = `${link.emoji} Combo`;
      ctx.strokeText(badge, midX, midY + 4);
      ctx.fillStyle = '#fef08a';
      ctx.fillText(badge, midX, midY + 4);
      ctx.restore();
    }
}
