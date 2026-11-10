// Tách tự động từ src/engine/renderer.ts (P0.4 — shared helpers & types).
import {
  FARM_CROPS,
  FARM_GOODS,
  formatDurationCountdownVi,
  getBuildingEffectiveCycleSec,
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


export type JuiceEventKind = 'harvest' | 'levelup' | 'victory';
export { JuiceFX };

export const MAX_WEATHER_PARTICLES = 400;

export function computeWeatherParticleBudget(
  dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  canvasWidth = 1200
): number {
  let budget = MAX_WEATHER_PARTICLES;
  if (dpr > 1.5) {
    budget = Math.round(budget * 0.65);
  }
  if (canvasWidth > 1500) {
    budget = Math.round(budget * 0.7);
  }
  return Math.max(30, Math.min(MAX_WEATHER_PARTICLES, budget));
}

export type InWorldTimerKind =
  | 'construction'
  | 'unveil_ribbon'
  | 'water_crop'
  | 'growing_crop'
  | 'feed_pasture'
  | 'grazing_pasture'
  | 'workshop_craft'
  | 'passive_cycle';

export interface InWorldTimerBadgeInfo {
  kind: InWorldTimerKind;
  remainSec: number;
  progress: number;
  label: string;
  compactLabel: string;
  spriteKey?: string;
  fallbackEmoji: string;
  interactiveHotspotKind?: 'water_crop' | 'feed_pasture' | 'unveil_building';
  queueCount?: number;
}

export function resolveBuildingInWorldTimerInfo(
  b: PlacedBuilding,
  item: CatalogItem,
  now: number,
  activeFestival = 'none',
  isSelected = false
): InWorldTimerBadgeInfo | null {
  if (now < b.constructEndsAt) {
    const remainSec = Math.max(1, Math.ceil((b.constructEndsAt - now) / 1000));
    const totalMs = Math.max(
      1000,
      item.buildDurationSec * 1000,
      b.constructEndsAt - (b.placedAt || now - 1000) + (b.buildReducedSec ?? 0) * 1000
    );
    const progress = Math.max(0.03, Math.min(0.99, 1 - (b.constructEndsAt - now) / totalMs));
    const pct = Math.floor(progress * 100);
    const fallbackEmoji = item.isCreatureHabitat ? '🥚' : '🔨';
    const timeText = formatDurationCountdownVi(remainSec);
    return {
      kind: 'construction',
      remainSec,
      progress,
      label: `${timeText} (${pct}%)`,
      compactLabel: timeText,
      fallbackEmoji,
    };
  }

  if (b.awaitingUnveil) {
    return {
      kind: 'unveil_ribbon',
      remainSec: 0,
      progress: 1,
      label: 'Cắt Băng Khánh Thành!',
      compactLabel: 'Cắt băng!',
      spriteKey: 'prop_ribbon_unveil',
      fallbackEmoji: '🎀',
      interactiveHotspotKind: 'unveil_building',
    };
  }

  if (item.isFarmlandPlot) {
    if (!b.cropId || !b.cropReadyAt || now >= b.cropReadyAt) return null;
    const crop = FARM_CROPS[b.cropId];
    if (!crop) return null;
    const remainSec = Math.max(1, Math.ceil((b.cropReadyAt - now) / 1000));
    const plantedAt = b.cropPlantedAt ?? b.cropReadyAt - crop.growSec * 1000;
    const totalMs = Math.max(1000, b.cropReadyAt - plantedAt);
    const progress = Math.max(0.05, Math.min(0.99, (now - plantedAt) / totalMs));
    const timeText = formatDurationCountdownVi(remainSec);
    if (!b.cropWateredBoost) {
      return {
        kind: 'water_crop',
        remainSec,
        progress,
        label: `Tưới • ${timeText}`,
        compactLabel: timeText,
        spriteKey: 'ui_icon_watering_can',
        fallbackEmoji: '💧',
        interactiveHotspotKind: 'water_crop',
      };
    }
    return {
      kind: 'growing_crop',
      remainSec,
      progress,
      label: timeText,
      compactLabel: timeText,
      spriteKey: crop.iconKey,
      fallbackEmoji: crop.emoji,
    };
  }

  if (item.isAnimalPasturePlot) {
    if (!b.pastureAnimalId || !b.pastureReadyAt || now >= b.pastureReadyAt) return null;
    const animal = PASTURE_ANIMALS[b.pastureAnimalId];
    if (!animal) return null;
    const remainSec = Math.max(1, Math.ceil((b.pastureReadyAt - now) / 1000));
    const stockedAt = b.pastureStockedAt ?? b.pastureReadyAt - animal.cycleSec * 1000;
    const totalMs = Math.max(1000, b.pastureReadyAt - stockedAt);
    const progress = Math.max(0.05, Math.min(0.99, (now - stockedAt) / totalMs));
    const timeText = formatDurationCountdownVi(remainSec);
    if (!b.pastureFedBoost) {
      return {
        kind: 'feed_pasture',
        remainSec,
        progress,
        label: `Cho ăn • ${timeText}`,
        compactLabel: timeText,
        spriteKey: 'ui_icon_crop_ottery_wheat',
        fallbackEmoji: '🌾',
        interactiveHotspotKind: 'feed_pasture',
      };
    }
    return {
      kind: 'grazing_pasture',
      remainSec,
      progress,
      label: timeText,
      compactLabel: timeText,
      spriteKey: animal.iconKey,
      fallbackEmoji: animal.emoji,
    };
  }

  if (b.workshopQueue && b.workshopQueue.length > 0) {
    const slot = b.workshopQueue[0];
    if (slot && now < slot.endsAt) {
      const goodMeta = FARM_GOODS[slot.goodId];
      const remainSec = Math.max(1, Math.ceil((slot.endsAt - now) / 1000));
      const startedAt = slot.startedAt || slot.endsAt - 20_000;
      const totalMs = Math.max(1000, slot.endsAt - startedAt);
      const progress = Math.max(0.04, Math.min(0.99, (now - startedAt) / totalMs));
      const timeText = formatDurationCountdownVi(remainSec);
      const qSuffix = b.workshopQueue.length > 1 ? ` ×${b.workshopQueue.length}` : '';
      return {
        kind: 'workshop_craft',
        remainSec,
        progress,
        label: `${timeText}${qSuffix}`,
        compactLabel: timeText,
        spriteKey: goodMeta?.iconKey ?? item.productIconKey,
        fallbackEmoji: goodMeta?.emoji ?? '🔥',
        queueCount: b.workshopQueue.length,
      };
    }
  }

  if (
    item.id === 'burrow_honeydukes_canon' ||
    item.cycleSec <= 0 ||
    item.baseIncome <= 0 ||
    b.isEscaped
  ) {
    return null;
  }

  const hasReadyOutput =
    b.storedGalleons > 0 || Boolean(b.readyFarmGoods && b.readyFarmGoods.length > 0);
  const maxCap = item.maxStorageCycles + (b.stars - 1) * 3;
  if (hasReadyOutput && (!isSelected || b.readyBubbles >= maxCap)) {
    return null;
  }

  const festSpeed = activeFestival === 'quidditch_cup' ? 0.85 : 1.0;
  const effectiveCycle = Math.max(1, getBuildingEffectiveCycleSec(b, item) * festSpeed);
  const rawElapsed = Math.max(0, (now - (b.lastTickAt || now)) / 1000);
  const elapsedSec = rawElapsed >= effectiveCycle ? rawElapsed % effectiveCycle : rawElapsed;
  const remainSec = Math.max(1, Math.ceil(effectiveCycle - elapsedSec));
  const progress = Math.max(0.03, Math.min(0.99, elapsedSec / effectiveCycle));
  const timeText = formatDurationCountdownVi(remainSec);

  return {
    kind: 'passive_cycle',
    remainSec,
    progress,
    label: timeText,
    compactLabel: timeText,
    spriteKey: item.productIconKey,
    fallbackEmoji: item.isCreatureHabitat ? '🐾' : '⏳',
  };
}

export interface ScreenHotspot {
  kind:
    | 'owl_post'
    | 'neighbor_help'
    | 'visitor_gift'
    | 'home_lantern'
    | 'bubble'
    | 'water_crop'
    | 'feed_pasture'
    | 'unveil_building'
    | 'villager'
    | 'building'
    | 'escaped'
    | 'zone_plaque';
  id: string;
  sx: number;
  sy: number;
  radius: number;
  spriteKey?: string;
  flipX?: boolean;
  boxLeft?: number;
  boxTop?: number;
  boxW?: number;
  boxH?: number;
}

export interface TopologicalDrawCmd {
  rxMin: number;
  ryMin: number;
  rxMax: number;
  ryMax: number;
  depth: number;
  draw: () => void;
}

export function rotTileToWorldTile(
  rx0: number,
  ry0: number,
  viewRot: 0 | 1 | 2 | 3 = 0
): { gx: number; gy: number } {
  switch (viewRot) {
    case 1:
      return { gx: ry0, gy: GRID_SIZE - 1 - rx0 };
    case 2:
      return { gx: GRID_SIZE - 1 - rx0, gy: GRID_SIZE - 1 - ry0 };
    case 3:
      return { gx: GRID_SIZE - 1 - ry0, gy: rx0 };
    default:
      return { gx: rx0, gy: ry0 };
  }
}

/**
 * Daylight palette — brighter and warmer than the original night-leaning
 * colours so the park reads as a sunlit storybook (reference technique),
 * while night keeps the Hogsmeade candlelight mood.
 */
export const TERRAIN_PALETTE: Record<TerrainType, { day: string; night: string; border: string }> = {
  grass: { day: '#6bc238', night: '#2b5241', border: 'rgba(54, 102, 42, 0.24)' },
  snow: { day: '#f2f7fd', night: '#8ea7c4', border: 'rgba(130, 158, 188, 0.24)' },
  stone: { day: '#cfc3b2', night: '#56505e', border: 'rgba(92, 76, 62, 0.24)' },
  forest: { day: '#539e49', night: '#214034', border: 'rgba(34, 72, 42, 0.26)' },
  water: { day: '#45b5c4', night: '#154b6b', border: 'rgba(176, 240, 252, 0.28)' },
  volcanic: { day: '#886e74', night: '#33263a', border: 'rgba(249, 145, 62, 0.28)' },
};

export interface LockedSceneryProp {
  gx: number;
  gy: number;
  zoneId: string;
  spriteKey: string;
  scale: number;
  flipX: boolean;
}

export function buildLockedSceneryCatalog(): LockedSceneryProp[] {
  const props: LockedSceneryProp[] = [];
  for (const z of ZONES) {
    if (z.unlockLevel <= 1) continue;
    const zcx = (z.x1 + z.x2 + 1) * 0.5;
    const zcy = (z.y1 + z.y2 + 1) * 0.5;
    const palette: string[] =
      z.id === 'lang_tuyet'
        ? ['env_pine_snow', 'env_pine_snow', 'env_mossy_rock', 'env_bush_flowers']
        : z.id === 'bia_rung_cam'
          ? ['env_tree_magic', 'env_tree_pine', 'env_tree_oak', 'env_mossy_rock', 'env_bush_flowers']
          : z.id === 'thung_lung_rong'
            ? ['env_mossy_rock', 'env_tree_pine', 'env_tree_magic', 'env_mossy_rock']
            : z.id === 'vuon_thao_duoc' || z.id === 'ho_den' || z.id === 'san_quidditch'
              ? ['env_tree_oak', 'env_bush_flowers', 'env_flower_patch', 'env_tree_pine', 'env_tree_magic']
              : ['env_tree_oak', 'env_tree_magic', 'env_bush_flowers', 'env_mossy_rock', 'env_flower_patch'];

    for (let gy = z.y1 + 1; gy <= z.y2 - 1; gy += 4) {
      for (let gx = z.x1 + 1; gx <= z.x2 - 1; gx += 4) {
        const h = Math.abs((gx * 73856093) ^ (gy * 19349663));
        if (h % 10 < 3) continue; // Organic spacing so sunlit meadows breathe between trees
        const jx = gx + ((h % 3) - 1) * 0.45;
        const jy = gy + (((h >> 3) % 3) - 1) * 0.45;
        // Leave an inviting sunny clearing around the zone's center signpost plaque
        if (Math.hypot(jx + 0.5 - zcx, jy + 0.5 - zcy) < 2.85) continue;
        const spriteKey = palette[(h >> 5) % palette.length];
        const isGroundCover =
          spriteKey === 'env_flower_patch' ||
          spriteKey === 'env_bush_flowers' ||
          spriteKey === 'env_mossy_rock';
        props.push({
          gx: Math.max(z.x1 + 0.3, Math.min(z.x2 - 0.3, jx)),
          gy: Math.max(z.y1 + 0.3, Math.min(z.y2 - 0.3, jy)),
          zoneId: z.id,
          spriteKey,
          scale: (isGroundCover ? 0.85 : 1.18) + ((h >> 8) % 5) * 0.06,
          flipX: ((h >> 11) & 1) === 1,
        });
      }
    }
  }
  return props;
}

