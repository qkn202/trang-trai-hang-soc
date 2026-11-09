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
  const effectiveCycle = Math.max(1, item.cycleSec * festSpeed);
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

interface TopologicalDrawCmd {
  rxMin: number;
  ryMin: number;
  rxMax: number;
  ryMax: number;
  depth: number;
  draw: () => void;
}

function rotTileToWorldTile(
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
const TERRAIN_PALETTE: Record<TerrainType, { day: string; night: string; border: string }> = {
  grass: { day: '#6bc238', night: '#2b5241', border: 'rgba(54, 102, 42, 0.24)' },
  snow: { day: '#f2f7fd', night: '#8ea7c4', border: 'rgba(130, 158, 188, 0.24)' },
  stone: { day: '#cfc3b2', night: '#56505e', border: 'rgba(92, 76, 62, 0.24)' },
  forest: { day: '#539e49', night: '#214034', border: 'rgba(34, 72, 42, 0.26)' },
  water: { day: '#45b5c4', night: '#154b6b', border: 'rgba(176, 240, 252, 0.28)' },
  volcanic: { day: '#886e74', night: '#33263a', border: 'rgba(249, 145, 62, 0.28)' },
};

interface LockedSceneryProp {
  gx: number;
  gy: number;
  zoneId: string;
  spriteKey: string;
  scale: number;
  flipX: boolean;
}

function buildLockedSceneryCatalog(): LockedSceneryProp[] {
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

export class IsometricRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: SpriteRegistry;
  private dpr = 1;
  public hotspots: ScreenHotspot[] = [];
  private particles: Array<{ x: number; y: number; r: number; vy: number; vx: number; hue: string }> = [];
  private rainStreaks: Array<{ x: number; y: number; len: number; speed: number }> = [];
  private skyClouds: Array<{ x: number; y: number; scale: number; speed: number; alpha: number }> = [];
  private tick = 0;
  private buildingMap = new Map<string, PlacedBuilding>();
  private heatmapCache: Array<string | null> = new Array(GRID_SIZE * GRID_SIZE).fill(null);
  private heatmapCacheAt = 0;
  private heatmapCacheMode: HeatmapMode = 'none';
  private heatmapCacheBuildingCount = -1;
  private reducedMotion = false;
  public juiceFx: JuiceFX;
  private harvestBloom: { x: number; y: number; startedAt: number } | null = null;
  private prevRipePlots = new Set<string>();
  public activeSeedBrushCropId: FarmCropId | null = null;
  public activePastureBrushAnimalId: PastureAnimalId | null = null;
  private activeMovingUid: string | null = null;
  private ghostConnectableRect: {
    gx: number;
    gy: number;
    bw: number;
    bh: number;
    elev: number;
    group: ConnectablePlotGroup;
  } | null = null;

  private getCropIconImage(cropId: FarmCropId): CanvasImageSource | undefined {
    return this.sprites.get(FARM_CROPS[cropId].iconKey);
  }

  // Tactile Squash-and-Stretch spring physics map (entity id -> trigger timestamp ms)
  private squashMap = new Map<string, number>();

  // "Just finished building!" celebration pops (entity id -> trigger timestamp ms).
  // These give the player the one dopamine beat the park was missing: the
  // moment a construction site turns into a working building.
  private completionPopMap = new Map<string, number>();

  // Offscreen Static Ground Cache for 60fps zoomed-out rendering
  private groundCacheCanvas: HTMLCanvasElement | null = null;
  private groundCacheKey = '';

  // Pre-smoothed organic lake shoreline loops (recomputed only when the
  // map layout changes, keyed by state revision).
  private waterLoops: WaterLoop[] = [];
  private waterLoopsRevision = -1;
  private lockedScenery: LockedSceneryProp[] = buildLockedSceneryCatalog();

  // Owl Post Delivery & Storm Lightning state
  private lightningFlashAlpha = 0;
  private nextLightningAt = 0;
  private nextOwlSpawnAt = 0;
  private owlFlight: {
    startedAt: number;
    durationMs: number;
    startGx: number;
    startGy: number;
    dropGx: number;
    dropGy: number;
    endGx: number;
    endGy: number;
    dropped: boolean;
  } | null = null;
  private owlParcel: {
    gx: number;
    gy: number;
    droppedAt: number;
    expiresAt: number;
  } | null = null;
  private owlCollectBurst: { gx: number; gy: number; startedAt: number } | null = null;

  constructor(canvas: HTMLCanvasElement, sprites: SpriteRegistry) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.sprites = sprites;

    const mq =
      typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-reduced-motion: reduce)')
        : undefined;
    if (mq) {
      this.reducedMotion = mq.matches;
      mq.addEventListener?.('change', (ev) => {
        this.reducedMotion = ev.matches;
        this.juiceFx?.setReducedMotion(ev.matches);
      });
    }

    this.juiceFx = new JuiceFX({ reducedMotion: this.reducedMotion });

    for (let i = 0; i < MAX_WEATHER_PARTICLES; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        r: 1.4 + Math.random() * 2.4,
        vy: 0.0008 + Math.random() * 0.0016,
        vx: (Math.random() - 0.5) * 0.0006,
        hue: i % 3 === 0 ? '#fde68a' : '#f8fafc',
      });
    }

    for (let i = 0; i < 120; i++) {
      this.rainStreaks.push({
        x: Math.random(),
        y: Math.random(),
        len: 14 + Math.random() * 14,
        speed: 0.018 + Math.random() * 0.014,
      });
    }

    for (let i = 0; i < 8; i++) {
      this.skyClouds.push({
        x: i / 8 + Math.random() * 0.08,
        y: 0.06 + (i % 3) * 0.065 + Math.random() * 0.025,
        scale: 0.75 + (i % 3) * 0.28,
        speed: 0.00018 + (i % 4) * 0.00006,
        alpha: 0.42 + (i % 3) * 0.14,
      });
    }
  }

  public triggerSquash(id: string): void {
    if (this.reducedMotion) return;
    this.squashMap.set(id, Date.now());
  }

  /** Marks a building as just finishing construction, so the next few
   *  render frames show a brief sparkle shockwave + springy pop-in. */
  public triggerCompletionPop(uid: string): void {
    if (this.reducedMotion) return;
    this.completionPopMap.set(uid, Date.now());
    this.notifyJuice('levelup');
  }

  /** Triggers a shake-free celebratory burst + confetti ribbons when the player cuts a ribbon! */
  public triggerRibbonUnveilPop(uid: string, sx?: number, sy?: number): void {
    if (this.reducedMotion) return;
    this.completionPopMap.set(uid, Date.now());
    const cx = sx ?? this.canvas.clientWidth * 0.5;
    const cy = sy ?? this.canvas.clientHeight * 0.5;
    this.harvestBloom = { x: cx, y: cy, startedAt: Date.now() };
    this.juiceFx.addFlash('#fde047', 0.24, 380);
    this.juiceFx.emitConfetti(cx, cy, 42, ['🎀', '✨', '🎉', '🌟', '🥧']);
  }

  public getJuiceFX(): JuiceFX {
    return this.juiceFx;
  }

  public notifyJuice(
    kind: 'harvest' | 'levelup' | 'victory',
    x?: number,
    y?: number
  ): void {
    const cx = x ?? this.canvas.clientWidth * 0.5;
    const cy = y ?? this.canvas.clientHeight * 0.5;

    if (kind === 'harvest') {
      this.harvestBloom = { x: cx, y: cy, startedAt: Date.now() };
      if (!this.reducedMotion) {
        this.juiceFx.emitConfetti(cx, cy, 14, ['✨', '🌾', '⭐']);
      }
    } else if (kind === 'levelup') {
      this.juiceFx.addFlash('#fde047', 0.32, 450);
      if (!this.reducedMotion) {
        this.juiceFx.addShake(5.5);
        this.juiceFx.emitConfetti(cx, cy, 40, ['⭐', '🌟', '🎉', '🪄']);
      }
    } else if (kind === 'victory') {
      this.juiceFx.addFlash('#f59e0b', 0.42, 600);
      if (!this.reducedMotion) {
        this.juiceFx.addShake(8);
        this.juiceFx.emitConfetti(cx, cy, 65, ['🏆', '✨', '👑', '🎉', '🦉']);
      }
    }
  }

  /** Returns a springy overshoot scale + vertical hop + celebration progress
   *  in [0,1] when a building finishes construction ("Hero Moment" reveal). */
  private getCompletionPop(
    uid: string,
    now: number
  ): { scale: number; liftY: number; ring: number } {
    const started = this.completionPopMap.get(uid);
    if (!started) return { scale: 1, liftY: 0, ring: 0 };
    const t = (now - started) / 1300; // 1.3s celebratory reveal
    if (t >= 1 || t < 0) {
      this.completionPopMap.delete(uid);
      return { scale: 1, liftY: 0, ring: 0 };
    }
    // Elastic bounce-in: pop from 0.72 -> 1.13 overshoot -> settle to 1.0
    const spring = Math.sin(t * Math.PI * 2.8) * Math.exp(-t * 3.4);
    const scale = t < 0.11 ? 0.72 + (t / 0.11) * 0.34 : 1 + spring * 0.13;
    const hop = t < 0.36 ? Math.sin((t / 0.36) * Math.PI) * 14 : 0;
    return { scale, liftY: hop, ring: t };
  }

  private drawCompletionShockwave(
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    ringT: number,
    isNight: boolean
  ): void {
    const ctx = this.ctx;
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

  /** Festive confetti ribbons + twinkling 4-point golden stars bursting from a completed building. */
  private drawCompletionSparkles(
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    ringT: number,
    isNight: boolean
  ): void {
    const ctx = this.ctx;
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

  public collectOwlPostParcel(): { gx: number; gy: number } | null {
    if (!this.owlParcel) return null;
    const pos = { gx: this.owlParcel.gx, gy: this.owlParcel.gy };
    this.owlCollectBurst = { gx: pos.gx, gy: pos.gy, startedAt: Date.now() };
    this.owlParcel = null;
    this.nextOwlSpawnAt = Date.now() + 52_000;
    this.notifyJuice('harvest');
    return pos;
  }

  private getSquashScale(id: string, now: number): { sx: number; sy: number } {
    const started = this.squashMap.get(id);
    if (!started) return { sx: 1, sy: 1 };
    const t = (now - started) / 380;
    if (t >= 1 || t < 0) {
      this.squashMap.delete(id);
      return { sx: 1, sy: 1 };
    }
    const wave = Math.sin(t * Math.PI * 3.2) * Math.exp(-t * 4.2) * 0.14;
    return { sx: 1 + wave, sy: 1 - wave * 0.88 };
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = dpr;
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private getSunShadowVector(period: 'dawn' | 'day' | 'dusk' | 'night'): {
    dx: number;
    dy: number;
    alpha: number;
  } {
    if (period === 'dawn') return { dx: -16, dy: 5, alpha: 0.24 };
    if (period === 'dusk') return { dx: 18, dy: 6, alpha: 0.28 };
    if (period === 'night') return { dx: -9, dy: 4, alpha: 0.22 };
    return { dx: 9, dy: 4, alpha: 0.22 };
  }

  private sortDrawablesTopological(items: TopologicalDrawCmd[]): TopologicalDrawCmd[] {
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

  private drawSkyBackdrop(
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void {
    const ctx = this.ctx;
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
        const tw = 1.2 + Math.sin(this.tick * 0.05 + i) * 0.65;
        ctx.fillRect(sx, sy, tw, tw);
      }
    }

    // Sun or Crescent Moon on upper arc
    if (!isOvercast) {
      const orbX = viewW * (period === 'dawn' ? 0.2 : period === 'dusk' ? 0.8 : 0.76);
      const orbY = Math.max(58, viewH * 0.14);
      if (period === 'night') {
        this.drawRadialGlow(orbX, orbY, 54, 'rgba(254, 243, 199, 0.28)');
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
        this.drawRadialGlow(orbX, orbY, 76, 'rgba(254, 240, 138, 0.42)');
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
    for (const c of this.skyClouds) {
      if (!this.reducedMotion) {
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

  private drawFloatingIslandRim(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean
  ): void {
    const ctx = this.ctx;
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

  private renderGroundTilesLayer(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean,
    showGridLines: boolean,
    unlockedSet: Set<string>,
    skipCull = false
  ): void {
    const ctx = this.ctx;
    const viewRot = cam.viewRot ?? 0;
    const hw = TILE_W * 0.5 * cam.zoom;
    const hh = TILE_H * 0.5 * cam.zoom;
    const margin = Math.max(130, 280 * cam.zoom);

    this.drawFloatingIslandRim(sim, cam, viewW, viewH, isNightLike);

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
          this.drawSeamlessWaterDetails(
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
          cell.buildingUid && cell.buildingUid !== this.activeMovingUid
        );
        if (cell.path !== 'none' && !hasStandingBuilding && unlocked) {
          this.drawAutoTiledPath(
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
          const heatColor = this.heatmapCache[gy * GRID_SIZE + gx];
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

  private drawCachedOrLiveGround(
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
      this.renderGroundTilesLayer(sim, cam, viewW, viewH, isNightLike, showGridLines, unlockedSet, false);
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

    if (!this.groundCacheCanvas || this.groundCacheKey !== key) {
      if (!this.groundCacheCanvas) {
        this.groundCacheCanvas = document.createElement('canvas');
      }
      this.groundCacheCanvas.width = cacheW;
      this.groundCacheCanvas.height = cacheH;
      const cCtx = this.groundCacheCanvas.getContext('2d');
      if (cCtx) {
        cCtx.clearRect(0, 0, cacheW, cacheH);
        const savedCtx = this.ctx;
        this.ctx = cCtx;
        const cacheCam: Camera = { x: 0, y: wyCenter, zoom: cacheZoom, viewRot };
        this.renderGroundTilesLayer(
          sim,
          cacheCam,
          cacheW,
          cacheH,
          isNightLike,
          false,
          unlockedSet,
          true
        );
        this.ctx = savedCtx;
        this.groundCacheKey = key;
      }
    }

    if (this.groundCacheCanvas) {
      const destX = viewW * 0.5 + (-worldSpanW * 0.5 - cam.x) * cam.zoom;
      const destY = viewH * 0.5 + (wyCenter - worldSpanH * 0.5 - cam.y) * cam.zoom;
      const destW = worldSpanW * cam.zoom;
      const destH = worldSpanH * cam.zoom;
      this.ctx.drawImage(this.groundCacheCanvas, destX, destY, destW, destH);
    }
  }

  /**
   * Draws one continuous, rounded shoreline around every water body.
   *
   * The lake outline is computed from the water mask in grid space (cached
   * per map revision), then projected to screen every frame with the same
   * isometric transform the terrain uses — so it stays glued to the water
   * at any zoom or camera rotation.
   */
  private drawOrganicWaterShorelines(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNight: boolean,
    unlockedSet: Set<string>
  ): void {
    if (this.waterLoopsRevision !== sim.stateRevision) {
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
      this.waterLoops = computeWaterShoreLoops(water, elev, size, (gx, gy) =>
        sim.grid[gy]?.[gx]?.zoneId ?? ''
      );
      this.waterLoopsRevision = sim.stateRevision;
    }

    if (this.waterLoops.length === 0) return;

    const ctx = this.ctx;
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

    for (const loop of this.waterLoops) {
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

  private drawScrollingCloudShadows(
    cam: Camera,
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void {
    if (period === 'night' || weather.kind === 'storm' || weather.kind === 'rain') return;
    const ctx = this.ctx;
    ctx.save();
    const alpha = weather.kind === 'cloudy' ? 0.085 : 0.055;
    ctx.fillStyle = `rgba(22, 38, 62, ${alpha})`;
    const t = this.reducedMotion ? 0 : this.tick * 0.35;
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

  public render(
    sim: ParkSimulation,
    cam: Camera,
    hoverTile: { gx: number; gy: number } | null,
    activeBuildItem: CatalogItem | null,
    rotation: 0 | 1 | 2 | 3,
    bulldozerActive: boolean,
    selectedUid: string | null,
    movingBuildingUid: string | null = null,
    pincerPickedLabel: string | null = null
  ): void {
    this.resize();
    if (!this.reducedMotion) {
      this.tick++;
    }
    this.hotspots = [];

    const now = Date.now();
    this.buildingMap.clear();
    for (const b of sim.state.buildings) {
      this.buildingMap.set(b.uid, b);
    }

    const viewW = this.canvas.clientWidth;
    const viewH = this.canvas.clientHeight;
    const ctx = this.ctx;

    this.juiceFx.tick(1 / 60);
    const shake = this.juiceFx.getShakeOffset();
    const hasWorldShake = !this.reducedMotion && (shake.x !== 0 || shake.y !== 0);
    if (hasWorldShake) {
      ctx.save();
      ctx.translate(shake.x, shake.y);
    }

    const viewRot = cam.viewRot ?? 0;
    const cutaway = Boolean(sim.state.settings.cutawayMode);
    const period = sim.getRealTimePeriod();
    const festival = sim.getActiveFestival();
    const weather = sim.getCurrentWeather(now);
    const isNightLike = period === 'night' || period === 'dusk';
    const shadowVec = this.getSunShadowVector(period);
    const unlockedSet = new Set(sim.state.unlockedZones);

    if (
      sim.heatmapMode !== 'none' &&
      (now - this.heatmapCacheAt > 450 ||
        this.heatmapCacheMode !== sim.heatmapMode ||
        this.heatmapCacheBuildingCount !== sim.state.buildings.length)
    ) {
      this.rebuildHeatmapCache(sim, sim.heatmapMode, unlockedSet, now);
    }
    const showGridLines =
      sim.state.settings.showGrid ||
      cutaway ||
      Boolean(activeBuildItem) ||
      bulldozerActive ||
      Boolean(movingBuildingUid) ||
      Boolean(pincerPickedLabel);

    // 1. Sky Backdrop (Time-of-day + Weather tint + Sun/Moon + Rainbow + Drifting Clouds)
    this.drawSkyBackdrop(viewW, viewH, period, weather);

    const hw = TILE_W * 0.5 * cam.zoom;
    const hh = TILE_H * 0.5 * cam.zoom;
    const margin = Math.max(130, 280 * cam.zoom);
    this.activeMovingUid = movingBuildingUid ?? null;

    // 2. Render 3D Floating Island Rim + Isometric Ground Tiles (Offscreen cached when zoomed out!)
    this.drawCachedOrLiveGround(sim, cam, viewW, viewH, isNightLike, showGridLines, unlockedSet);

    // 2g. Organic lake shorelines: one continuous rounded shore per water
    //     body, drawn over the tiled water so lakes stop looking like
    //     stacked hard-cornered squares.
    this.drawOrganicWaterShorelines(sim, cam, viewW, viewH, isNightLike, unlockedSet);

    // 2h. Soft scrolling cloud shadows gliding over sunlit terrain
    this.drawScrollingCloudShadows(cam, viewW, viewH, period, weather);

    // 3. Kahn's Topological 2.5D Depth-Sorted Drawables (Multi-tile Buildings, Fences, Coasters, Guests, Staff, Beasts)
    const drawList: TopologicalDrawCmd[] = [];
    const timeSec = now / 1000;

    // 3a. Zoo Fences & Custom Coaster Track Tiles (rotation-aware!)
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const c = sim.grid[gy][gx];
        if (!c.zooFence && !c.coasterTrack) continue;
        const p = rotatedTileDiamondToScreen(gx, gy, cam, viewW, viewH, c.elevation * ELEV_PX);
        if (p.sx < -margin || p.sx > viewW + margin || p.sy < -margin || p.sy > viewH + margin) continue;
        const { rx0, ry0 } = rotateGridRect(gx, gy, 1, 1, viewRot);

        if (c.zooFence) {
          drawList.push({
            rxMin: rx0 + 0.08,
            ryMin: ry0 + 0.08,
            rxMax: rx0 + 0.92,
            ryMax: ry0 + 0.92,
            depth: rx0 + ry0 + 1.05,
            draw: () => this.drawAutoTiledZooFence(sim, rx0, ry0, viewRot, p.sx, p.sy, hw, hh, cam.zoom),
          });
        }
        if (c.coasterTrack) {
          drawList.push({
            rxMin: rx0 + 0.08,
            ryMin: ry0 + 0.08,
            rxMax: rx0 + 0.92,
            ryMax: ry0 + 0.92,
            depth: rx0 + ry0 + 1.12,
            draw: () => this.drawCoasterTrackPiece(sim, rx0, ry0, viewRot, c.elevation, p.sx, p.sy, hw, hh, cam.zoom),
          });
        }
      }
    }

    // 3b. Live 3-Car Custom Coaster Trains racing along player-built tracks!
    const originRot = rotateGridPoint(0, 0, viewRot);
    for (const [, circuit] of sim.coasterCircuits.entries()) {
      const cars = sampleCoasterTrainPositions(circuit.waypoints, circuit.isClosed, timeSec, 3);
      for (const car of cars) {
        const cp = gridToScreen(car.gx + 0.5, car.gy + 0.5, cam, viewW, viewH, car.elev * ELEV_PX + 10);
        const { rx, ry } = rotateGridPoint(car.gx + 0.5, car.gy + 0.5, viewRot);
        const vecRot = rotateGridPoint(car.dirGx, car.dirGy, viewRot);
        const screenIsoDx = vecRot.rx - originRot.rx - (vecRot.ry - originRot.ry);
        drawList.push({
          rxMin: rx - 0.25,
          ryMin: ry - 0.25,
          rxMax: rx + 0.25,
          ryMax: ry + 0.25,
          depth: rx + ry + 1.18,
          draw: () => this.drawCoasterVehicleSprite(cp.sx, cp.sy, cam.zoom, screenIsoDx < 0),
        });
      }
    }

    // 3c. Buildings (plus Roaming Habitat Creatures & Mechanical Vehicles!)
    this.ghostConnectableRect = null;
    if (
      hoverTile &&
      hoverTile.gx >= 0 &&
      hoverTile.gy >= 0 &&
      hoverTile.gx < GRID_SIZE &&
      hoverTile.gy < GRID_SIZE &&
      !pincerPickedLabel &&
      !bulldozerActive
    ) {
      const ghostItem = movingBuildingUid
        ? (() => {
            const mb = this.buildingMap.get(movingBuildingUid);
            return mb ? getCatalogItem(mb.itemId) : undefined;
          })()
        : activeBuildItem ?? undefined;
      if (ghostItem?.connectableGroup) {
        const gCheck = sim.canPlaceItem(ghostItem, hoverTile.gx, hoverTile.gy, rotation, movingBuildingUid ?? undefined);
        if (gCheck.ok) {
          const { bw: gbw, bh: gbh } = sim.getBuildingFootprint(ghostItem, rotation);
          const gElev = sim.grid[hoverTile.gy]?.[hoverTile.gx]?.elevation ?? 0;
          this.ghostConnectableRect = {
            gx: hoverTile.gx,
            gy: hoverTile.gy,
            bw: gbw,
            bh: gbh,
            elev: gElev,
            group: ghostItem.connectableGroup,
          };
        }
      }
    }

    for (const b of sim.state.buildings) {
      if (movingBuildingUid === b.uid) continue; // Currently picked up on cursor!
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const { rx0, ry0, rbw, rbh } = rotateGridRect(b.gx, b.gy, bw, bh, viewRot);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const anchor = rotatedTileDiamondToScreen(b.gx, b.gy, cam, viewW, viewH, elev * ELEV_PX);
      if (
        anchor.sx < -margin * 2.5 ||
        anchor.sx > viewW + margin * 2.5 ||
        anchor.sy < -margin * 2.5 ||
        anchor.sy > viewH + margin * 2.5
      ) {
        continue;
      }

      drawList.push({
        rxMin: rx0 + 0.04,
        ryMin: ry0 + 0.04,
        rxMax: rx0 + rbw - 0.04,
        ryMax: ry0 + rbh - 0.04,
        depth: rx0 + rbw + ry0 + rbh - 0.05,
        draw: () =>
          this.drawPlacedBuilding(
            sim,
            b,
            item,
            bw,
            bh,
            elev,
            cam,
            viewW,
            viewH,
            now,
            isNightLike,
            shadowVec,
            selectedUid === b.uid,
            cutaway
          ),
      });
    }

    // 3f. Escaped Creatures (Hand-Inked Beast Sprites!)
    for (const esc of sim.escapedCreatures) {
      const ep = gridToScreen(esc.gx + 0.5, esc.gy + 0.5, cam, viewW, viewH);
      const { rx, ry } = rotateGridPoint(esc.gx + 0.5, esc.gy + 0.5, viewRot);
      drawList.push({
        rxMin: rx - 0.22,
        ryMin: ry - 0.22,
        rxMax: rx + 0.22,
        ryMax: ry + 0.22,
        depth: rx + ry + 0.35,
        draw: () => this.drawEscapedCreature(esc.id, esc.species, ep.sx, ep.sy, cam.zoom),
      });
    }

    // 3f-1. Walking Weasley Family & Hogsmeade Villagers strolling along paths & gardens!
    for (const v of sim.villagers) {
      const vGx = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(v.gx)));
      const vGy = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(v.gy)));
      const vElev = sim.grid[vGy]?.[vGx]?.elevation ?? 0;
      const vp = gridToScreen(v.gx, v.gy, cam, viewW, viewH, vElev * ELEV_PX);
      if (vp.sx < -margin || vp.sx > viewW + margin || vp.sy < -margin || vp.sy > viewH + margin) {
        continue;
      }
      const { rx, ry } = rotateGridPoint(v.gx, v.gy, viewRot);
      drawList.push({
        rxMin: rx - 0.18,
        ryMin: ry - 0.18,
        rxMax: rx + 0.18,
        ryMax: ry + 0.18,
        depth: rx + ry + 0.30,
        draw: () => this.drawValleyVillager(v, vp.sx, vp.sy, cam.zoom, isNightLike),
      });
    }

    // 3f-2. Sunlit Enchanted Forest Scenery in Locked Zones (viewport-culled, clears magically on unlock!)
    if (!sim.state.sandboxMode) {
      for (const prop of this.lockedScenery) {
        if (unlockedSet.has(prop.zoneId as ZoneDef['id'])) continue;
        const gxInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(prop.gx)));
        const gyInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(prop.gy)));
        const elev = sim.grid[gyInt]?.[gxInt]?.elevation ?? 0;
        const pp = gridToScreen(prop.gx + 0.5, prop.gy + 0.5, cam, viewW, viewH, elev * ELEV_PX);
        if (pp.sx < -margin || pp.sx > viewW + margin || pp.sy < -margin || pp.sy > viewH + margin) {
          continue;
        }
        const { rx, ry } = rotateGridPoint(prop.gx + 0.5, prop.gy + 0.5, viewRot);
        drawList.push({
          rxMin: rx - 0.32,
          ryMin: ry - 0.32,
          rxMax: rx + 0.32,
          ryMax: ry + 0.32,
          depth: rx + ry + 0.42,
          draw: () => this.drawLockedForestProp(prop, pp.sx, pp.sy, cam.zoom, shadowVec, isNightLike),
        });
      }
    }

    const sortedDrawList = this.sortDrawablesTopological(drawList);
    for (const cmd of sortedDrawList) {
      cmd.draw();
    }

    // 3g. District Synergy Golden Combo Links — hidden by default, only shown when Wonder heatmap is active!
    if (sim.heatmapMode === 'wonder') {
      this.drawSynergyLinks(sim, selectedUid, cam, viewW, viewH);
    }

    // 3h. Nighttime Candlelight Atmospheric Glow Pass (multiply twilight veil + lighter lantern pools)
    if (isNightLike) {
      this.drawNightCandlelightPass(sim, cam, viewW, viewH, now, period === 'night');
    }

    // 4. Ghost Build / Move / Pincer / Bulldozer Preview snapped to Grid!
    if (
      hoverTile &&
      hoverTile.gx >= 0 &&
      hoverTile.gy >= 0 &&
      hoverTile.gx < GRID_SIZE &&
      hoverTile.gy < GRID_SIZE
    ) {
      const hElev = sim.grid[hoverTile.gy][hoverTile.gx].elevation;
      if (pincerPickedLabel) {
        const hp = rotatedTileDiamondToScreen(hoverTile.gx, hoverTile.gy, cam, viewW, viewH, hElev * ELEV_PX);
        this.drawDiamondOutline(hp.sx, hp.sy, hw, hh, 'rgba(56, 189, 248, 0.38)', '#38bdf8');
        ctx.save();
        ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1c130d';
        ctx.lineWidth = 3.5;
        ctx.strokeText(`🤏 Thả: ${pincerPickedLabel}`, hp.sx, hp.sy - 8);
        ctx.fillStyle = '#bae6fd';
        ctx.fillText(`🤏 Thả: ${pincerPickedLabel}`, hp.sx, hp.sy - 8);
        ctx.restore();
      } else if (bulldozerActive) {
        const hp = rotatedTileDiamondToScreen(hoverTile.gx, hoverTile.gy, cam, viewW, viewH, hElev * ELEV_PX);
        this.drawDiamondOutline(hp.sx, hp.sy, hw, hh, 'rgba(239, 68, 68, 0.45)', '#fca5a5');
      } else if (movingBuildingUid) {
        const mb = this.buildingMap.get(movingBuildingUid);
        const mItem = mb ? getCatalogItem(mb.itemId) : undefined;
        if (mb && mItem) {
          this.drawGhostPlacement(
            sim,
            mItem,
            hoverTile.gx,
            hoverTile.gy,
            rotation,
            cam,
            viewW,
            viewH,
            movingBuildingUid
          );
        }
      } else if (activeBuildItem) {
        this.drawGhostPlacement(sim, activeBuildItem, hoverTile.gx, hoverTile.gy, rotation, cam, viewW, viewH);
      }
    }

    // 5. Locked Zone Mist Plaques
    if (!sim.state.sandboxMode) {
      for (const z of ZONES) {
        if (!unlockedSet.has(z.id)) {
          this.drawLockedZonePlaque(sim, z, cam, viewW, viewH);
        }
      }
    }

    // 6. Collectible Galleon / XP Rooftop Bubbles (Home) OR Neighbor Co-op Help Bubbles & Mystery Gift (Visiting)!
    if (sim.isVisitingNeighbor) {
      this.drawNeighborVisitOverlays(sim, cam, viewW, viewH, now);
    } else {
      const bubbleCandidates: Array<{
        b: PlacedBuilding;
        sx: number;
        sy: number;
        value: number;
      }> = [];
      for (const b of sim.state.buildings) {
        if (now < b.constructEndsAt || movingBuildingUid === b.uid) continue;
        const item = getCatalogItem(b.itemId);
        if (!item || item.id === 'burrow_honeydukes_canon') continue;
        const isRipePlot = Boolean(
          item.isFarmlandPlot && b.cropId && b.cropReadyAt && now >= b.cropReadyAt
        );
        const isRipePasture = Boolean(
          item.isAnimalPasturePlot &&
            b.pastureAnimalId &&
            b.pastureReadyAt &&
            now >= b.pastureReadyAt
        );
        const hasReadyGoods = Boolean(b.readyFarmGoods && b.readyFarmGoods.length > 0);
        if (b.storedGalleons > 0 || hasReadyGoods || isRipePlot || isRipePasture) {
          const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
          const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
          const zLift =
            item.isFarmlandPlot ||
            item.isAnimalPasturePlot ||
            item.connectableGroup === 'flower_garden'
              ? 26
              : 48 + Math.max(bw, bh) * 18;
          const topPt = gridToScreen(
            b.gx + bw * 0.5,
            b.gy + bh * 0.5,
            cam,
            viewW,
            viewH,
            elev * ELEV_PX + zLift
          );
          if (topPt.sx < -60 || topPt.sx > viewW + 60 || topPt.sy < -60 || topPt.sy > viewH + 60) continue;
          const prioVal =
            (hasReadyGoods ? 500 : 0) +
            (isRipePasture ? 360 : 0) +
            (isRipePlot ? 350 : 0) +
            b.storedGalleons;
          bubbleCandidates.push({ b, sx: topPt.sx, sy: topPt.sy, value: prioVal });
        }
      }
      const MAX_BUBBLES_ON_SCREEN = 28;
      bubbleCandidates.sort((a, c) => c.value - a.value);
      const overflow = bubbleCandidates.length - MAX_BUBBLES_ON_SCREEN;
      for (const cand of bubbleCandidates.slice(0, MAX_BUBBLES_ON_SCREEN)) {
        this.drawHarvestBubble(cand.b, cand.sx, cand.sy, cam.zoom);
      }
      if (overflow > 0) {
        const anchor = bubbleCandidates[0];
        this.drawHarvestOverflowPill(anchor.sx, anchor.sy, cam.zoom, overflow);
      }

      // 6a-timers. Real-time In-World Countdown Badges & 1-Tap Crop Watering / Pasture Feeding Pills!
      this.drawInWorldWaitTimers(
        sim,
        cam,
        viewW,
        viewH,
        now,
        festival,
        selectedUid,
        movingBuildingUid
      );

      // 6a-lantern. Owl Post Lantern Marks left by visiting neighbors on Home Farm!
      this.drawHomeOwlLanternMarks(sim, cam, viewW, viewH);

      // 6a-tutorial. Bà Molly's soft sunlit spotlight diamond & bouncing pointer on target farm plot!
      this.drawTutorialWorldTarget(sim, cam, viewW, viewH);
    }

    // 6b. Internal Juice Hook: Track harvested plots automatically
    const currentRipePlots = new Set<string>();
    for (const b of sim.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (
        (item?.isFarmlandPlot && b.cropId && b.cropReadyAt && now >= b.cropReadyAt) ||
        (item?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt)
      ) {
        currentRipePlots.add(b.uid);
      }
    }
    for (const prevUid of this.prevRipePlots) {
      if (!currentRipePlots.has(prevUid)) {
        const b = this.buildingMap.get(prevUid);
        if (b) {
          const pt = gridToScreen(b.gx + 0.5, b.gy + 0.5, cam, viewW, viewH, 18);
          this.notifyJuice('harvest', pt.sx, pt.sy);
        }
      }
    }
    this.prevRipePlots = currentRipePlots;

    // 7. Floating Text Feedback
    for (const fx of sim.effects) {
      const progress = fx.life / fx.maxLife;
      const fp = gridToScreen(fx.gx, fx.gy, cam, viewW, viewH, 32 + progress * 38);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#1c130d';
      ctx.lineWidth = 3.5;
      ctx.strokeText(fx.text, fp.sx, fp.sy);
      ctx.fillStyle = fx.color;
      ctx.fillText(fx.text, fp.sx, fp.sy);
      ctx.restore();
    }

    // 7b. Sky Dragon Fireworks Show!
    this.drawSkyFireworks(sim, cam, viewW, viewH);

    // 7c. Live Narrative Pulse: Snowy Owl Post Delivery & Interactive Parcel!
    if (!sim.isVisitingNeighbor) {
      this.drawAndTickOwlPostEvent(
        sim,
        cam,
        viewW,
        viewH,
        now,
        isNightLike,
        Boolean(movingBuildingUid || activeBuildItem || bulldozerActive)
      );
    }

    // 8. Cozy Weather, Rain/Storm/Lightning, Morning Mist & Seasonal Particles
    this.drawWeatherParticles(sim, viewW, viewH, isNightLike, festival, weather, now);

    // 9. Sunlit Golden Hour God-Rays, Sun-Bloom & Cozy Storybook Vignette
    this.drawGoldenAtmosphereAndVignette(viewW, viewH, period, weather);

    // 10. Post-FX Juice: Harvest Warm Bloom & Day/Night Atmospheric Light Layer
    this.drawHarvestBloom(now, cam.zoom);
    this.drawDayNightLightLayer(viewW, viewH, period);

    if (hasWorldShake) {
      ctx.restore();
    }

    // 11. Fullscreen Juice Overlays: FlashFX & ConfettiFX
    this.juiceFx.applyTo(ctx, viewW, viewH);
  }

  private drawSeamlessWaterDetails(
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
    const ctx = this.ctx;
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
      const wave = Math.sin(this.tick * 0.05 + gx + gy) * 3 * zoom;
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
      const sway = this.reducedMotion ? 0 : Math.sin(this.tick * 0.045 + gx * 0.9 + gy * 1.3) * 2.2 * zoom;
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

  private drawAutoTiledPath(
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
    const ctx = this.ctx;
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

  private drawAutoTiledZooFence(
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
    const ctx = this.ctx;
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

  private drawCoasterTrackPiece(
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
    const ctx = this.ctx;
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
        const b = this.buildingMap.get(c.buildingUid);
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

  private drawCoasterVehicleSprite(sx: number, sy: number, zoom: number, _flipX: boolean): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(sx, sy, 8 * zoom, 0, Math.PI * 2);
    ctx.fill();
  }

  private rebuildHeatmapCache(
    sim: ParkSimulation,
    mode: HeatmapMode,
    unlockedSet: Set<string>,
    now: number
  ): void {
    this.heatmapCacheAt = now;
    this.heatmapCacheMode = mode;
    this.heatmapCacheBuildingCount = sim.state.buildings.length;

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
          this.heatmapCache[idx] = null;
          continue;
        }
        this.heatmapCache[idx] = this.computeTileHeatmapColor(sim, gx, gy, mode, wonderEmitters);
      }
    }
  }

  private computeTileHeatmapColor(
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
        const hut = this.buildingMap.get(uid);
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
        const hab = this.buildingMap.get(uid);
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

  private drawDiamondOutline(
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    fill: string,
    stroke: string
  ): void {
    const ctx = this.ctx;
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

  private rectScreenCorners(
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

  private drawPlacedBuilding(
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
    const ctx = this.ctx;
    const zOff = elev * ELEV_PX;
    const { pTop, pRight, pBottom, pLeft } = this.rectScreenCorners(
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
      ? this.computePlotConnMask(sim, b.gx, b.gy, bw, bh, elev, connGroup, cam.viewRot ?? 0, now)
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

      // Snug warm AO contact shadow hugging the building foundation
      if (!cutaway) {
        ctx.fillStyle = isNight ? 'rgba(10, 12, 24, 0.26)' : 'rgba(58, 38, 18, 0.22)';
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
        this.drawGateIndicators(sim, b, bw, bh, cam, viewW, viewH);
      }
    }

    const buildingHotspot: ScreenHotspot = {
      kind: 'building',
      id: b.uid,
      sx: centerX,
      sy: bottomY - footprintW * 0.35,
      radius: Math.max(22, footprintW * 0.36),
    };
    this.hotspots.push(buildingHotspot);

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

        const wobble = Math.sin(this.tick * 0.1) * 0.12;
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
        const sprite = this.sprites.get(item.spriteKey);
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
        const scafSp = this.sprites.get('prop_construction_site');
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

        const hammerSp = this.sprites.get('ui_icon_hammer_wand');
        if (hammerSp && !this.reducedMotion) {
          const swing = Math.sin(this.tick * 0.14 + b.gx) * 0.24;
          const hSize = Math.max(22, 32 * cam.zoom);
          const hx = centerX + footprintW * 0.22;
          const hy = bottomY - scafH * (0.58 + 0.28 * progress) + Math.sin(this.tick * 0.1) * 3 * cam.zoom;
          this.drawRadialGlow(hx, hy, 14 * cam.zoom, 'rgba(253, 224, 71, 0.45)');
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
      this.drawMarbleBenchProp(centerX, bottomY, cam.zoom, isNight);
      return;
    }
    if (item.id === 'floating_candles_post') {
      this.drawFloatingCandlesProp(centerX, bottomY, cam.zoom, isNight);
      return;
    }
    if (item.id === 'house_banners') {
      this.drawHouseBannerProp(centerX, bottomY, cam.zoom, b.gx + b.gy);
      return;
    }
    if (item.id === 'patronus_ward_lantern') {
      this.drawPatronusLanternProp(centerX, bottomY, cam.zoom);
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

    const rawSprite = this.sprites.get(activeSpriteKey);
    if (rawSprite) {
      const isNonSquare = item.width !== item.height;
      const scaleMult = item.spriteScale ?? (isNonSquare ? 1.0 : 1.05);
      const drawW = footprintW * scaleMult;
      const drawH = drawW * (rawSprite.height / rawSprite.width);
      const sprite = isConnectablePlot
        ? (this.sprites.getConnectedFarmlandSprite(
            activeSpriteKey as
              | 'crop_plot_tilled'
              | 'crop_plot_sprouts'
              | 'burrow_pumpkin_gnomes'
              | 'burrow_chicken_coop'
              | 'burrow_flower_garden'
              | 'burrow_animal_pasture',
            plotConnMask,
            drawW * this.dpr
          ) ?? rawSprite)
        : (this.sprites.getMip(activeSpriteKey, drawW * this.dpr) ?? rawSprite);

      const cropNocturnalGlow =
        item.isFarmlandPlot && b.cropId ? FARM_CROPS[b.cropId]?.nocturnalGlowColor : undefined;
      if (item.isFlooPortal) {
        this.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.45,
          drawW * 0.55,
          `rgba(52, 211, 153, ${0.38 + Math.sin(this.tick * 0.1) * 0.12})`
        );
      } else if (cropNocturnalGlow) {
        this.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.48,
          drawW * (isNight ? 0.64 : 0.42),
          cropNocturnalGlow
        );
      } else if (isNight && (!isConnectablePlot || b.cropId === 'glow_mushroom')) {
        this.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.42,
          drawW * 0.55,
          item.isFarmlandPlot ? 'rgba(56, 189, 248, 0.22)' : 'rgba(251, 191, 36, 0.24)'
        );
      }

      const rotTotal = (b.rotation + (cam.viewRot ?? 0)) % 4;
      const flipSprite = isConnectablePlot
        ? false
        : isNonSquare
          ? (rotTotal & 1) === 1
          : rotTotal === 1 || rotTotal === 2;
      const squash = this.getSquashScale(b.uid, now);
      const completion = this.getCompletionPop(b.uid, now);

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
        this.drawRadialGlow(
          centerX,
          bottomY - drawH * 0.46,
          Math.max(drawW, drawH) * 0.76,
          `rgba(254, 240, 138, ${haloAlpha})`
        );
      }

      const isActivelyCrafting = Boolean(
        !this.reducedMotion && b.workshopQueue && b.workshopQueue.length > 0
      );
      const craftBreathX = isActivelyCrafting
        ? 1 + Math.sin(this.tick * 0.13 + b.gx * 1.7) * 0.013
        : 1;
      const craftBreathY = isActivelyCrafting
        ? 1 - Math.sin(this.tick * 0.13 + b.gx * 1.7) * 0.015
        : 1;

      ctx.save();
      if (fadeInCutaway) {
        ctx.globalAlpha = 0.28;
      }
      ctx.translate(centerX, bottomY + (4 - completion.liftY) * cam.zoom);
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
        if (!b.cropId && this.activeSeedBrushCropId) {
          this.drawEmptyPlotSeedCue(drawW, drawH);
        } else if (b.cropId && plotGrowRatio < 0.25) {
          this.drawFarmlandSeedlings(drawW, drawH, plotGrowRatio, Boolean(b.cropWateredBoost));
        } else if (b.cropId && plotGrowRatio >= 0.66) {
          this.drawFarmlandCropRows(
            b.cropId,
            drawW,
            drawH,
            plotGrowRatio,
            Boolean(b.cropWateredBoost),
            b.gx * 7 + b.gy * 13
          );
        }
      } else if (item.isAnimalPasturePlot && !b.pastureAnimalId && this.activePastureBrushAnimalId) {
        if (flipSprite) {
          ctx.scale(-1, 1);
        }
        this.drawEmptyPastureAnimalCue(drawW, drawH);
      }
      ctx.restore();

      // Just-finished celebration: golden shockwave ring + rising sparkles.
      if (completion.ring > 0) {
        this.drawCompletionShockwave(
          centerX,
          bottomY,
          drawW,
          drawH,
          cam.zoom,
          completion.ring,
          isNight
        );
        this.drawCompletionSparkles(centerX, bottomY, drawW, drawH, cam.zoom, completion.ring, isNight);
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
            this.drawBuildingBaseGrassTufts(
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
        this.drawLiveBuildingAnimations(
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
        this.drawStarArchitecturalEvolution(b.stars, centerX, bottomY, drawW, drawH, cam.zoom);
      }

      // V3 System #3: Subtle Golden Synergy Shimmer when part of an active District Combo!
      if ((sim.activeSynergies.buildingGoldMult.get(b.uid) ?? 1) > 1.01) {
        this.drawRadialGlow(
          centerX + Math.cos(this.tick * 0.06 + b.gx) * drawW * 0.28,
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
        const bob = Math.sin(this.tick * 0.1) * 3;
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
        const spX = centerX + Math.sin(this.tick * 0.25) * 14 * cam.zoom;
        const spY = bottomY - drawH * 0.55 + Math.cos(this.tick * 0.3) * 8 * cam.zoom;
        this.drawRadialGlow(spX, spY, 16 * cam.zoom, 'rgba(192, 132, 252, 0.85)');
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

  private drawGateIndicators(
    sim: ParkSimulation,
    b: PlacedBuilding,
    bw: number,
    bh: number,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const ctx = this.ctx;
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

  private drawStarArchitecturalEvolution(
    stars: number,
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number
  ): void {
    if (stars <= 1) return;
    const ctx = this.ctx;
    ctx.save();

    // 2★+: Twin golden filigree lanterns at front corners
    if (stars >= 2) {
      this.drawRadialGlow(cx - drawW * 0.34, bottomY - drawH * 0.16, 9 * zoom, 'rgba(253, 224, 71, 0.65)');
      this.drawRadialGlow(cx + drawW * 0.34, bottomY - drawH * 0.16, 9 * zoom, 'rgba(253, 224, 71, 0.65)');
    }

    // 3★+: Fluttering crimson-and-gold rooftop pennants!
    if (stars >= 3) {
      const wave = Math.sin(this.tick * 0.1 + cx) * 3 * zoom;
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
      const orbAngle = this.tick * 0.05;
      const ox = cx + Math.cos(orbAngle) * drawW * 0.38;
      const oy = bottomY - drawH * 0.62 + Math.sin(orbAngle) * 8 * zoom;
      this.drawRadialGlow(ox, oy, 8 * zoom, 'rgba(254, 240, 138, 0.9)');
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

  private drawLiveBuildingAnimations(
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
    const ctx = this.ctx;
    const itemId = item.id;

    // 0a. Ceremonial Red-and-Gold Ribbon Unveiling Crown (`prop_ribbon_unveil`)!
    if (b.awaitingUnveil) {
      const ribbonSp = this.sprites.get('prop_ribbon_unveil');
      const bobR = this.reducedMotion ? 0 : Math.sin(this.tick * 0.09 + b.gx) * 3.5 * zoom;
      const pulseR = this.reducedMotion ? 1 : 1 + Math.sin(this.tick * 0.11) * 0.045;
      const ribY = bottomY - drawH * 0.44 + bobR;
      this.drawRadialGlow(cx, ribY, Math.max(24, drawW * 0.34), 'rgba(253, 224, 71, 0.52)');
      if (ribbonSp) {
        const ribW = Math.min(drawW * 0.72, Math.max(46 * zoom, drawW * 0.56)) * pulseR;
        const ribH = ribW * (ribbonSp.height / ribbonSp.width);
        ctx.drawImage(ribbonSp, cx - ribW * 0.5, ribY - ribH * 0.5, ribW, ribH);
      }
      this.hotspots.push({
        kind: 'unveil_building',
        id: b.uid,
        sx: cx,
        sy: ribY,
        radius: Math.max(28, drawW * 0.36),
      });
    }

    // 0b. Kinetic Spinning Windmill Sails (`burrow_windmill_canon` + `prop_windmill_sails`)!
    if (itemId === 'burrow_windmill_canon') {
      const sailsSp = this.sprites.get('prop_windmill_sails');
      if (sailsSp) {
        const hubX = cx - drawW * 0.06;
        const hubY = bottomY - drawH * 0.67;
        const sailSize = drawW * 0.78;
        const angle = this.reducedMotion ? 0.38 : this.tick * 0.022;
        ctx.save();
        ctx.translate(hubX, hubY);
        // Foreshorten onto the SW-facing isometric windmill dome plane!
        ctx.transform(0.88, 0.22, -0.12, 0.96, 0, 0);
        ctx.rotate(angle);
        ctx.drawImage(sailsSp, -sailSize * 0.5, -sailSize * 0.5, sailSize, sailSize);
        ctx.restore();

        if (!this.reducedMotion) {
          for (let m = 0; m < 3; m++) {
            const mp = ((this.tick * 0.018 + m * 0.33 + b.gx * 0.1) % 1);
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
      const wheelSp = this.sprites.get('prop_waterwheel_rotor');
      if (wheelSp) {
        const wheelX = cx + drawW * 0.21;
        const wheelY = bottomY - drawH * 0.33;
        const wheelSize = drawW * 0.40;
        const angle = this.reducedMotion ? 0.2 : this.tick * 0.032;
        ctx.save();
        ctx.translate(wheelX, wheelY);
        // Foreshorten onto the SE-facing stone millrace wall!
        ctx.transform(0.80, -0.26, 0.12, 0.94, 0, 0);
        ctx.rotate(angle);
        ctx.drawImage(wheelSp, -wheelSize * 0.5, -wheelSize * 0.5, wheelSize, wheelSize);
        ctx.restore();

        if (!this.reducedMotion) {
          for (let d = 0; d < 4; d++) {
            const dp = ((this.tick * 0.045 + d * 0.25) % 1);
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

    // 0d. Active Workshop Warm Hearth Glow & Fragrant Steam vs Calm Idle State!
    if (b.workshopQueue && b.workshopQueue.length > 0 && !b.isBrokenDown) {
      const pulse = this.reducedMotion ? 1 : 0.85 + Math.sin(this.tick * 0.12 + b.gx) * 0.15;
      this.drawRadialGlow(
        cx,
        bottomY - drawH * 0.26,
        Math.max(20, drawW * 0.32) * pulse,
        `rgba(251, 146, 60, ${0.42 * pulse})`
      );
      if (!this.reducedMotion) {
        for (let s = 0; s < 3; s++) {
          const sp = ((this.tick * 0.022 + s * 0.33 + b.gy * 0.17) % 1);
          const sx = cx + Math.sin(sp * Math.PI * 2 + s) * 7 * zoom;
          const sy = bottomY - drawH * (0.68 + sp * 0.28);
          ctx.fillStyle = `rgba(254, 243, 199, ${Math.sin(sp * Math.PI) * 0.68})`;
          ctx.beginPath();
          ctx.arc(sx, sy, (2.6 + sp * 4.2) * zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 0e. Orbiting Golden Honeybees around Cider & Honey Apiary (`burrow_cider_apiary`)!
    if (!this.reducedMotion && itemId === 'burrow_cider_apiary') {
      for (let bee = 0; bee < 4; bee++) {
        const t = this.tick * 0.055 + bee * 1.57 + b.gx;
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
      !this.reducedMotion &&
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
        const t = this.tick * 0.042 + bf * 2.4 + b.gx * 1.3 + b.gy * 0.7;
        const fx = cx + Math.sin(t) * drawW * 0.24;
        const fy = bottomY - drawH * 0.56 + Math.cos(t * 1.7) * 5.5 * zoom;
        const flap = Math.abs(Math.sin(this.tick * 0.28 + bf)) * 3.2 * zoom + 1.0 * zoom;
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
            !this.reducedMotion &&
            Math.floor((this.tick + b.gx * 11 + b.gy * 17 + idx * 29) / 42) % 2 === 1;
          const spKey = animalMeta.spritePair[useAction ? 1 : 0];
          const beastSp = this.sprites.get(spKey) ?? this.sprites.get(animalMeta.spritePair[0]);
          if (!beastSp) continue;

          const phase = this.tick * (idx === 0 ? 0.024 : 0.019) + b.gx * 1.9 + b.gy * 1.3 + idx * 2.6;
          const ax = cx + Math.sin(phase) * spanX + (idx === 0 ? -drawW * 0.06 : drawW * 0.09);
          const hop = this.reducedMotion
            ? 0
            : Math.abs(Math.sin(this.tick * 0.11 + idx * 1.7 + b.gx)) * 2.4 * zoom;
          const ay =
            bottomY -
            drawH * (idx === 0 ? 0.44 : 0.32) +
            Math.cos(phase * 0.85) * spanY -
            hop;
          const szScale = idx === 0 ? 1.0 : 0.8;
          const bwPx = baseScale * szScale * zoom;
          const bhPx = bwPx * (beastSp.height / beastSp.width);

          if (b.pastureAnimalId === 'moon_unicorn') {
            this.drawRadialGlow(ax, ay - bhPx * 0.45, 18 * zoom, 'rgba(224, 242, 254, 0.5)');
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
        if (!this.reducedMotion && b.pastureFedBoost && b.pastureReadyAt && Date.now() < b.pastureReadyAt) {
          for (let m = 0; m < 2; m++) {
            const p = ((this.tick * 0.03 + m * 0.5 + b.gx * 0.2) % 1);
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
        this.drawRadialGlow(cx, bottomY - drawH * 0.45, 22 * zoom, auraColor);
      }
      const usePoseFrame =
        !this.reducedMotion && Math.floor((this.tick + b.gx * 13 + b.gy * 7) / 48) % 2 === 1;
      const activeBeastKey = beastPair ? beastPair[usePoseFrame ? 1 : 0] : null;
      const beastSp = activeBeastKey
        ? this.sprites.get(activeBeastKey) ?? this.sprites.get(beastPair![0])
        : undefined;
      if (beastSp) {
        const stageScale =
          b.creatureStage === 'baby' ? 0.58 : b.creatureStage === 'legendary' ? 1.05 : 0.84;
        const phase = this.tick * 0.032 + b.gx * 2.1 + b.gy;
        const roamX = cx + Math.sin(phase) * drawW * 0.22;
        const hopY = Math.abs(Math.sin(this.tick * 0.12 + b.gx)) * 3.5 * zoom;
        const roamY = bottomY - drawH * 0.22 - hopY;
        const bwPx = 38 * stageScale * zoom;
        const bhPx = bwPx * (beastSp.height / beastSp.width);

        if (b.creatureMorph === 'radiant') {
          this.drawRadialGlow(roamX, roamY - bhPx * 0.45, 26 * zoom, 'rgba(250, 204, 21, 0.72)');
        } else if (b.creatureMorph === 'mystic') {
          this.drawRadialGlow(roamX, roamY - bhPx * 0.45, 24 * zoom, 'rgba(56, 189, 248, 0.62)');
        } else if (b.creatureStage === 'legendary') {
          this.drawRadialGlow(roamX, roamY - bhPx * 0.4, 22 * zoom, 'rgba(253, 224, 71, 0.55)');
        }

        ctx.save();
        ctx.translate(roamX, roamY);
        if (Math.cos(phase) < 0) ctx.scale(-1, 1);
        ctx.drawImage(beastSp, -bwPx * 0.5, -bhPx, bwPx, bhPx);
        ctx.restore();

        // Zoo Tycoon Breeding Offspring: adorable Baby Beast following parent!
        if (b.hasBabyOffspring) {
          const babyX = cx + Math.sin(phase - 0.9) * drawW * 0.2;
          const babyY = bottomY - drawH * 0.16 - Math.abs(Math.cos(this.tick * 0.16)) * 3 * zoom;
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
      const boatSp = this.sprites.get('vehicle_lake_boat');
      if (boatSp) {
        for (let i = 0; i < 2; i++) {
          const a = this.tick * 0.025 + i * Math.PI;
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
      this.drawRadialGlow(
        cx,
        bottomY - drawH * 0.65,
        (22 + Math.sin(this.tick * 0.08) * 5) * zoom,
        'rgba(251, 191, 36, 0.42)'
      );
    }

    // 3. Cozy Burrow & Hogsmeade Chimney Smoke Puffs & Magical Shopfront Sparkles!
    if (!this.reducedMotion && !b.isBrokenDown) {
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
          const phase = ((this.tick * 0.42 + i * 24 + b.gx * 9) % 72) / 72;
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
        const swSp = this.sprites.get('ui_icon_sweater_ready');
        if (swSp) {
          const bobSw = Math.sin(this.tick * 0.065) * 4 * zoom;
          const tiltSw = Math.sin(this.tick * 0.05) * 0.08;
          const swSize = 54 * zoom;
          const swX = cx + drawW * 0.36;
          const swY = bottomY - drawH * 0.56 + bobSw;
          this.drawRadialGlow(swX, swY, 24 * zoom, 'rgba(254, 240, 138, 0.52)');
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
        const canSp = this.sprites.get('ui_icon_watering_can');
        if (canSp) {
          const bobCan = Math.sin(this.tick * 0.075) * 3.5 * zoom;
          const tiltCan = -0.14 + Math.sin(this.tick * 0.06) * 0.06;
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
            const t = ((this.tick * 0.055 + d * 0.17) % 1);
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
        const pulse = 0.48 + 0.22 * Math.sin(this.tick * 0.1);
        this.drawRadialGlow(
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
        const spPhase = this.tick * 0.07 + b.gx * 2.3 + b.gy;
        const glX = cx + Math.cos(spPhase) * drawW * 0.24;
        const glY = bottomY - drawH * (0.48 + Math.sin(spPhase * 1.4) * 0.12);
        const pulse = 0.45 + 0.45 * Math.sin(spPhase * 2.1);
        this.drawRadialGlow(glX, glY, 9 * zoom, `rgba(254, 240, 138, ${pulse * 0.78})`);
      }
    }
  }

  private drawLockedForestProp(
    prop: LockedSceneryProp,
    sx: number,
    sy: number,
    zoom: number,
    shadowVec: { dx: number; dy: number; alpha: number },
    isNight: boolean
  ): void {
    const rawSp = this.sprites.get(prop.spriteKey);
    if (!rawSp) return;
    const ctx = this.ctx;
    const isGroundCover =
      prop.spriteKey === 'env_flower_patch' ||
      prop.spriteKey === 'env_bush_flowers' ||
      prop.spriteKey === 'env_mossy_rock';
    const baseW = (isGroundCover ? 34 : 58) * prop.scale * zoom;
    const drawH = baseW * (rawSp.height / rawSp.width);
    const sp = this.sprites.getMip(prop.spriteKey, baseW * this.dpr) ?? rawSp;

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
    const sway = this.reducedMotion || isRock
      ? 0
      : Math.sin(this.tick * 0.032 + prop.gx * 1.7 + prop.gy) * (isGroundCover ? 0.012 : 0.025);
    ctx.translate(sx, sy + 4 * zoom);
    if (sway !== 0) ctx.rotate(sway);
    if (prop.flipX) ctx.scale(-1, 1);
    ctx.globalAlpha = isNight ? 0.86 : 0.96;
    ctx.drawImage(sp, -baseW * 0.5, -drawH, baseW, drawH);
    ctx.restore();
  }

  private computePlotConnMask(
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
    const ghost = this.ghostConnectableRect;
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
      if (!cell || !cell.buildingUid || cell.buildingUid === this.activeMovingUid) return false;
      if ((cell.elevation ?? 0) !== elev) return false;
      const nb = this.buildingMap.get(cell.buildingUid);
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

  private drawBuildingBaseGrassTufts(
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
    const ctx = this.ctx;
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

  private drawMarbleBenchProp(cx: number, bottomY: number, zoom: number, isNight: boolean): void {
    const ctx = this.ctx;
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
    const bob = Math.sin(this.tick * 0.08 + cx) * 2.5 * zoom;
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(cx + 15 * zoom, bottomY - 28 * zoom + bob, 3.5 * zoom, 8 * zoom);
    this.drawRadialGlow(
      cx + 16.5 * zoom,
      bottomY - 30 * zoom + bob,
      (isNight ? 15 : 8) * zoom,
      'rgba(253, 224, 71, 0.85)'
    );
  }

  private drawFloatingCandlesProp(cx: number, bottomY: number, zoom: number, isNight: boolean): void {
    const ctx = this.ctx;
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
      const bob = Math.sin(this.tick * 0.07 + ph) * 3.5 * zoom;
      const x = cx + ox * zoom;
      const y = bottomY + oy * zoom + bob;
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(x - 2 * zoom, y, 4 * zoom, 10 * zoom);
      ctx.strokeRect(x - 2 * zoom, y, 4 * zoom, 10 * zoom);
      this.drawRadialGlow(x, y - 2 * zoom, (isNight ? 18 : 9) * zoom, 'rgba(253, 224, 71, 0.88)');
    }
  }

  private drawHouseBannerProp(cx: number, bottomY: number, zoom: number, seed: number): void {
    const ctx = this.ctx;
    const colors = ['#b91c1c', '#15803d', '#1d4ed8', '#ca8a04'];
    const col = colors[seed % 4];
    ctx.strokeStyle = '#1c130d';
    ctx.lineWidth = 2.5 * zoom;
    ctx.beginPath();
    ctx.moveTo(cx, bottomY - 6 * zoom);
    ctx.lineTo(cx, bottomY - 44 * zoom);
    ctx.stroke();

    const wave = Math.sin(this.tick * 0.08 + seed) * 3 * zoom;
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

  private drawPatronusLanternProp(cx: number, bottomY: number, zoom: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    ctx.fillRect(cx - 4 * zoom, bottomY - 26 * zoom, 8 * zoom, 20 * zoom);
    ctx.strokeRect(cx - 4 * zoom, bottomY - 26 * zoom, 8 * zoom, 20 * zoom);

    const bob = Math.sin(this.tick * 0.08 + cx) * 3 * zoom;
    const oy = bottomY - 34 * zoom + bob;
    this.drawRadialGlow(cx, oy, 22 * zoom, 'rgba(186, 230, 253, 0.85)');
    ctx.fillStyle = '#f0f9ff';
    ctx.beginPath();
    ctx.arc(cx, oy, 5.5 * zoom, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSynergyLinks(
    sim: ParkSimulation,
    selectedUid: string | null,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const ctx = this.ctx;
    for (const link of sim.activeSynergies.links) {
      if (selectedUid && link.aUid !== selectedUid && link.bUid !== selectedUid) continue;
      const ba = this.buildingMap.get(link.aUid);
      const bb = this.buildingMap.get(link.bUid);
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

  private drawSkyFireworks(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    if (sim.fireworks.length === 0) return;
    const ctx = this.ctx;
    for (const fw of sim.fireworks) {
      if (fw.life < 0) continue;
      const t = fw.life / fw.maxLife;
      const pt = gridToScreen(fw.gx, fw.gy, cam, viewW, viewH, fw.zHeight + t * 28);
      if (pt.sx < -100 || pt.sx > viewW + 100 || pt.sy < -100 || pt.sy > viewH + 100) continue;

      const alpha = Math.max(0, 1 - Math.pow(t, 1.35));
      const radius = (8 + t * 44) * cam.zoom;
      ctx.save();
      ctx.globalAlpha = alpha;
      this.drawRadialGlow(pt.sx, pt.sy, radius * 1.15, fw.color);
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

  private drawEscapedCreature(id: string, species: string, sx: number, sy: number, zoom: number): void {
    const ctx = this.ctx;
    this.hotspots.push({
      kind: 'escaped',
      id,
      sx,
      sy: sy - 12 * zoom,
      radius: Math.max(22, 26 * zoom),
    });

    const pulse = 16 + Math.sin(this.tick * 0.15) * 4;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(sx, sy - 3 * zoom, pulse * zoom, pulse * 0.55 * zoom, 0, 0, Math.PI * 2);
    ctx.stroke();

    const hop = Math.abs(Math.sin(this.tick * 0.22)) * 6 * zoom;
    const poseOn = !this.reducedMotion && Math.floor(this.tick / 18) % 2 === 1;
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
    const sp = this.sprites.get(spKey);
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

  private drawEmptyPlotSeedCue(drawW: number, drawH: number): void {
    const ctx = this.ctx;
    const pulse = 0.55 + Math.sin(this.tick * 0.11) * 0.25;
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

  private drawEmptyPastureAnimalCue(drawW: number, drawH: number): void {
    const ctx = this.ctx;
    const pulse = 0.58 + Math.sin(this.tick * 0.11) * 0.24;
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

  private getPlotFurrowGrid(drawW: number, drawH: number): Array<{ x: number; y: number; idx: number }> {
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

  private drawFarmlandSeedlings(
    drawW: number,
    drawH: number,
    growRatio: number,
    watered: boolean
  ): void {
    const ctx = this.ctx;
    const pts = this.getPlotFurrowGrid(drawW, drawH);
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

  private getPlotClusterGrid(drawW: number, drawH: number): Array<{ x: number; y: number; idx: number }> {
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

  private drawFarmlandCropRows(
    cropId: FarmCropId,
    drawW: number,
    drawH: number,
    growRatio: number,
    watered: boolean,
    seedHash: number
  ): void {
    const cropSprite = this.sprites.get(FARM_CROPS[cropId].iconKey);
    if (!cropSprite) return;

    const ctx = this.ctx;
    const pts = this.getPlotClusterGrid(drawW, drawH);
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
      const sway = this.reducedMotion
        ? 0
        : Math.sin(this.tick * 0.05 + p.idx * 0.85 + seedHash) * 0.038 * swayDamp;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (sway !== 0) ctx.rotate(sway);
      ctx.drawImage(cropSprite, 0, 0, srcW, srcH, -clW * 0.5, -clH * anchorYRatio, clW, clH);
      ctx.restore();
    }

    // Subtle golden harvest sun-motes shimmering above ripe plots
    if (isRipe && !this.reducedMotion) {
      const moteR = Math.max(1.5, drawW * 0.016);
      for (let m = 0; m < 3; m++) {
        const phase = (this.tick * 0.03 + m * 0.33 + seedHash * 0.07) % 1;
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

  private drawHarvestBubble(b: PlacedBuilding, sx: number, sy: number, zoom: number): void {
    const ctx = this.ctx;
    const bob = Math.sin(this.tick * 0.075 + b.gx * 1.7 + b.gy) * 4;
    const item = getCatalogItem(b.itemId);
    const prodIcon: CanvasImageSource | undefined =
      b.readyFarmGoods && b.readyFarmGoods.length > 0
        ? this.sprites.get(FARM_GOODS[b.readyFarmGoods[0]]?.iconKey)
        : item?.isFarmlandPlot && b.cropId
          ? this.getCropIconImage(b.cropId)
          : item?.isAnimalPasturePlot && b.pastureAnimalId
            ? this.sprites.get(PASTURE_ANIMALS[b.pastureAnimalId]?.iconKey)
            : item?.productIconKey
              ? this.sprites.get(item.productIconKey)
              : undefined;
    const sickleIcon =
      item?.isFarmlandPlot && b.cropId ? this.sprites.get('ui_icon_golden_sickle') : undefined;

    if (prodIcon) {
      // Playrix Township Glossy Plump Circular Speech-Pin Product Bubble!
      const r = Math.max(
        25,
        Math.min(38, (item?.isFarmlandPlot || item?.isAnimalPasturePlot ? 28 : 33) * zoom)
      );
      const bx = sx + 8 * zoom;
      const by = sy - 12 * zoom + bob;

      this.hotspots.push({
        kind: 'bubble',
        id: b.uid,
        sx: bx,
        sy: by,
        radius: r + 10,
      });

      this.drawRadialGlow(bx, by, r * 1.85, 'rgba(253, 224, 71, 0.62)');

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

    this.hotspots.push({
      kind: 'bubble',
      id: b.uid,
      sx,
      sy: by,
      radius: r + 10,
    });

    this.drawRadialGlow(sx, by, r * 1.7, 'rgba(251, 191, 36, 0.55)');

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

  private drawInWorldWaitTimers(
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
        this.reducedMotion || (!isActionable && info.kind !== 'construction')
          ? 0
          : Math.sin(this.tick * 0.08 + b.gx * 1.3 + b.gy * 0.9) * (isActionable ? 2.6 : 1.8);
      const py = pt.sy + bob;

      if (info.interactiveHotspotKind === 'water_crop') {
        this.hotspots.push({
          kind: 'water_crop',
          id: b.uid,
          sx: pt.sx,
          sy: py - 8 * zoom,
          radius: Math.max(28, 32 * zoom),
        });
      } else if (info.interactiveHotspotKind === 'feed_pasture') {
        this.hotspots.push({
          kind: 'feed_pasture',
          id: b.uid,
          sx: pt.sx,
          sy: py,
          radius: Math.max(26, 28 * zoom),
        });
      } else if (info.interactiveHotspotKind === 'unveil_building') {
        this.hotspots.push({
          kind: 'unveil_building',
          id: b.uid,
          sx: pt.sx,
          sy: py,
          radius: Math.max(30, 34 * zoom),
        });
      }

      this.drawInWorldTimerPill(info, pt.sx, py, zoom, isSelected);
    }
  }

  private drawValleyVillager(
    v: ValleyVillagerEntity,
    sx: number,
    sy: number,
    zoom: number,
    isNight: boolean
  ): void {
    const ctx = this.ctx;
    const useWalkPose =
      !this.reducedMotion && v.state === 'walking' && Math.floor(v.walkPhase * 1.4) % 2 === 1;
    const spKey = useWalkPose ? v.walkSprite : v.idleSprite;
    const sp = this.sprites.get(spKey) ?? this.sprites.get(v.idleSprite);
    if (!sp) return;

    const baseH = (v.id === 'hagrid' ? 62 : 52) * zoom;
    const drawW = baseH * (sp.width / sp.height);
    const hop = this.reducedMotion
      ? 0
      : v.state === 'walking'
        ? Math.abs(Math.sin(v.walkPhase * 2.1)) * 2.6 * zoom
        : Math.sin(this.tick * 0.05 + v.gx * 1.7) * 0.8 * zoom;

    ctx.save();
    // Warm sunlit contact shadow beneath boots
    ctx.fillStyle = isNight ? 'rgba(10, 16, 28, 0.42)' : 'rgba(34, 62, 24, 0.30)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * zoom, drawW * 0.28, drawW * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(sx, sy - hop);
    if (v.facingLeft) {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(sp, -drawW * 0.5, -baseH, drawW, baseH);
    ctx.restore();

    this.hotspots.push({
      kind: 'villager',
      id: v.id,
      sx,
      sy: sy - baseH * 0.5,
      radius: Math.max(20, 24 * zoom),
    });

    if (v.bubbleTimer > 0 && zoom >= 0.48) {
      const bob = this.reducedMotion ? 0 : Math.sin(this.tick * 0.09 + v.gx) * 2 * zoom;
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

  private drawInWorldTimerPill(
    info: InWorldTimerBadgeInfo,
    sx: number,
    sy: number,
    zoom: number,
    isSelected: boolean
  ): void {
    const ctx = this.ctx;
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
    const iconSprite = info.spriteKey ? this.sprites.get(info.spriteKey) : undefined;
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
      this.drawRadialGlow(sx, sy, pillW * 0.54, glowColor);
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

  private drawNeighborVisitOverlays(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number
  ): void {
    const nb = sim.getActiveVisitingNeighbor();
    if (!nb) return;
    const ctx = this.ctx;
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
        const bob = Math.sin(this.tick * 0.06 + b.gx + b.gy) * 3;
        const py = pt.sy - 6 * zoom + bob;
        const text = `🏮 ${note.emoji} ${note.shortVi}`;
        ctx.save();
        ctx.font = '800 11.5px "Be Vietnam Pro", sans-serif';
        const tw = ctx.measureText(text).width;
        const pw = Math.max(96, tw + 22);
        const ph = 25;
        this.drawRadialGlow(pt.sx, py, pw * 0.55, 'rgba(251, 191, 36, 0.42)');
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
      const bob = Math.sin(this.tick * 0.085 + b.gx * 1.4 + b.gy) * 4;
      const by = pt.sy + bob;
      const r = Math.max(22, Math.min(31, 25 * zoom));

      this.hotspots.push({
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
      this.drawRadialGlow(pt.sx, by, r * 1.85, glowColor);

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
        const bob = Math.sin(this.tick * 0.09) * 4.5;
        const py = gpt.sy + bob;

        this.hotspots.push({
          kind: 'visitor_gift',
          id: nb.id,
          sx: gpt.sx,
          sy: py,
          radius: Math.max(32, 34 * zoom),
        });

        this.drawRadialGlow(gpt.sx, py, 44 * zoom, 'rgba(250, 204, 21, 0.75)');

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

  private drawHomeOwlLanternMarks(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const marks: HomeOwlLanternMark[] = sim.state.neighborSocial?.homeLanternMarks ?? [];
    if (marks.length === 0) return;
    const ctx = this.ctx;
    const zoom = cam.zoom;

    for (const mark of marks) {
      const b = this.buildingMap.get(mark.buildingUid);
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

      const bob = Math.sin(this.tick * 0.075 + b.gx * 2.1 + b.gy) * 4;
      const py = pt.sy + bob;

      this.hotspots.push({
        kind: 'home_lantern',
        id: mark.id,
        sx: pt.sx,
        sy: py,
        radius: Math.max(30, 32 * zoom),
      });

      this.drawRadialGlow(pt.sx, py, 38 * zoom, 'rgba(251, 146, 60, 0.65)');

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

  private drawTutorialWorldTarget(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void {
    const target = sim.getTutorialWorldTarget();
    if (!target) return;
    const ctx = this.ctx;
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

    const pulse = this.reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(this.tick * 0.1);
    const bob = this.reducedMotion ? 0 : Math.sin(this.tick * 0.12) * 5.5;

    ctx.save();
    // 1. Soft sunlit golden radial aura on the ground
    this.drawRadialGlow(
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

  /** Compact "+N" pill shown when more than MAX_BUBBLES_ON_SCREEN harvests
   *  are ready at once — anchored cleanly above the speech-pin crest so it never overlaps icons. */
  private drawHarvestOverflowPill(sx: number, sy: number, zoom: number, overflow: number): void {
    const ctx = this.ctx;
    const bob = Math.sin(this.tick * 0.08 + overflow) * 2.5;
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

  private drawGhostPlacement(
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
    const ctx = this.ctx;
    const check = sim.canPlaceItem(item, gx, gy, rotation, ignoreBuildingUid);
    const { bw, bh } = sim.getBuildingFootprint(item, rotation);
    const elev = sim.grid[gy]?.[gx]?.elevation ?? 0;
    const zOff = elev * ELEV_PX;

    const { pTop, pRight, pBottom, pLeft } = this.rectScreenCorners(
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

    const baseSprite = this.sprites.get(item.spriteKey);
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
          ? (this.sprites.getConnectedFarmlandSprite(
              ghostStageKey,
              this.computePlotConnMask(
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
              drawW * this.dpr
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
      this.drawGateIndicators(sim, fakeB, bw, bh, cam, viewW, viewH);
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

  private drawLockedZonePlaque(
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
    const ctx = this.ctx;
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

    this.hotspots.push({
      kind: 'zone_plaque',
      id: z.id,
      sx: pt.sx,
      sy: pt.sy,
      radius: 56,
    });

    // Soft drifting cream-white storybook mist clouds floating lazily over the Enchanted Forest clearing
    const drift = this.reducedMotion ? 0 : Math.sin(this.tick * 0.018 + z.x1) * 14 * cam.zoom;
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

  private drawRadialGlow(x: number, y: number, r: number, color: string): void {
    if (r <= 1) return;
    const g = this.ctx.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = g;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawNightCandlelightPass(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    isFullNight: boolean
  ): void {
    const ctx = this.ctx;
    ctx.save();

    // 1. Subtle cozy twilight indigo veil using multiply so daytime sprites settle into dusk/night
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = isFullNight ? 'rgba(186, 198, 232, 0.88)' : 'rgba(236, 206, 192, 0.92)';
    ctx.fillRect(0, 0, viewW, viewH);

    // 2. Additive warm Hogsmeade candlelight pools over active buildings & street lamps!
    ctx.globalCompositeOperation = 'lighter';
    const flicker = this.reducedMotion ? 1 : 0.94 + Math.sin(this.tick * 0.09) * 0.06;
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
      if (pt.sx < -140 || pt.sx > viewW + 140 || pt.sy < -140 || pt.sy > viewH + 140) continue;

      const rad = Math.max(28, (bw + bh) * 20) * cam.zoom * flicker;
      const color = item.isFlooPortal
        ? 'rgba(52, 211, 153, 0.18)'
        : item.id === 'patronus_ward_lantern'
          ? 'rgba(125, 211, 252, 0.24)'
          : isFullNight
            ? 'rgba(251, 191, 36, 0.19)'
            : 'rgba(251, 146, 60, 0.13)';
      this.drawRadialGlow(pt.sx, pt.sy, rad, color);
    }

    ctx.restore();
  }

  private drawWeatherParticles(
    sim: ParkSimulation,
    viewW: number,
    viewH: number,
    isNight: boolean,
    festival: string,
    weather: WeatherForecastSlot,
    now: number
  ): void {
    const ctx = this.ctx;

    // 1. Morning Mist / Black Lake Fog Ribbons
    if (weather.kind === 'fog') {
      ctx.save();
      const drift = this.reducedMotion ? 0 : (this.tick * 0.45) % viewW;
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
    if ((weather.kind === 'rain' || weather.kind === 'storm') && !this.reducedMotion) {
      const isStorm = weather.kind === 'storm';
      const count = isStorm ? this.rainStreaks.length : 70;
      ctx.save();
      ctx.strokeStyle = isStorm ? 'rgba(226, 232, 240, 0.52)' : 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = isStorm ? 1.5 : 1.2;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const r = this.rainStreaks[i];
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
        const phase = ((this.tick * 0.045 + i * 0.31) % 1);
        const sx = ((i * 197 + Math.floor(this.tick / 22) * 53) % Math.max(1, viewW));
        const sy = ((i * 131 + Math.floor(this.tick / 22) * 29) % Math.max(1, viewH));
        ctx.globalAlpha = (1 - phase) * 0.45;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 3 + phase * 11, 1.5 + phase * 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Storm lightning flash + delayed Web Audio Thunder!
      if (isStorm) {
        if (this.nextLightningAt === 0) {
          this.nextLightningAt = now + 7_500;
        } else if (now >= this.nextLightningAt) {
          this.lightningFlashAlpha = 0.34;
          this.nextLightningAt = now + 9_000 + Math.random() * 8_000;
          sim.audio.playThunder(0.8, 0.36);
        }
      }
    }

    if (this.lightningFlashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(248, 250, 252, ${this.lightningFlashAlpha})`;
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.restore();
      this.lightningFlashAlpha *= 0.84;
    }

    // 3. Snowflakes & Golden Nighttime Fireflies
    const mode = sim.state.settings.weatherOverride;
    if (mode === 'clear' || this.reducedMotion) return;

    const isSnow = weather.kind === 'snow';
    const showFireflies =
      !isSnow &&
      weather.kind !== 'rain' &&
      weather.kind !== 'storm' &&
      (festival === 'halloween' || isNight || mode === 'fireflies');

    if (!isSnow && !showFireflies) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const particleBudget = computeWeatherParticleBudget(dpr, Math.max(viewW, this.canvas.width));
    const particleLimit = Math.min(this.particles.length, particleBudget);

    ctx.save();
    for (let i = 0; i < particleLimit; i++) {
      const p = this.particles[i];
      p.y = (p.y + (isSnow ? p.vy : -p.vy * 0.55) + 1) % 1;
      p.x = (p.x + p.vx + Math.sin(this.tick * 0.015 + p.r) * 0.0005 + 1) % 1;

      if (isSnow) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.beginPath();
        ctx.arc(p.x * viewW, p.y * viewH, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (showFireflies) {
        const pulse = 0.45 + 0.45 * Math.sin(this.tick * 0.08 + p.x * 20);
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
        // Bright pin-point core on top of the halo.
        ctx.fillStyle = 'rgba(255, 255, 235, 0.9)';
        ctx.beginPath();
        ctx.arc(fx, fy, p.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /**
   * Live Narrative Pulse ("Hello Beat" + periodic village surprise):
   * A Snowy Owl glides across the sunlit village with a ribbon-tied parcel and
   * drops an interactive gift onto the Hogsmeade Station cobbles.
   */
  private drawAndTickOwlPostEvent(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    isNight: boolean,
    hideInteractive: boolean
  ): void {
    const ctx = this.ctx;
    const zoom = cam.zoom;

    // 1. Spawn initial "Hello Beat" owl right after entering the park, then every ~58s
    if (this.nextOwlSpawnAt === 0) {
      this.nextOwlSpawnAt = now + 200;
    }

    if (!this.owlFlight && !this.owlParcel && now >= this.nextOwlSpawnAt) {
      // Pick a cozy sunlit meadow tile near the center of the Level 1 valley (or any nearby path tile)
      let dropGx = 16.5;
      let dropGy = 23.5;
      for (let r = 0; r <= 5; r++) {
        let found = false;
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            const tx = 16 + dx;
            const ty = 23 + dy;
            const cell = sim.grid[ty]?.[tx];
            if (cell && cell.path !== 'none' && !cell.buildingUid && cell.terrain !== 'water') {
              dropGx = tx + 0.5;
              dropGy = ty + 0.5;
              found = true;
            }
          }
        }
        if (found) break;
      }

      this.owlFlight = {
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
      this.nextOwlSpawnAt = now + 58_000;
    }

    // 2. Expire unclaimed parcel gently after 28s so it never clutters the plaza
    if (this.owlParcel && now >= this.owlParcel.expiresAt) {
      this.owlParcel = null;
      this.nextOwlSpawnAt = now + 45_000;
    }

    // 3. Draw parcel resting on the cobblestone plaza (with clickable hotspot!)
    if (this.owlParcel && !sim.isHeadmasterPreview) {
      const gxInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(this.owlParcel.gx)));
      const gyInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(this.owlParcel.gy)));
      const elev = sim.grid[gyInt]?.[gxInt]?.elevation ?? 0;
      const ageMs = now - this.owlParcel.droppedAt;
      const dropT = Math.min(1, ageMs / 420);
      // Parabolic drop from owl height down onto cobbles + gentle idle bob
      const airLift = (1 - dropT) * (1 - dropT) * 44;
      const bob = dropT >= 1 && !this.reducedMotion ? Math.sin(this.tick * 0.09) * 2.5 : 0;
      const pt = gridToScreen(
        this.owlParcel.gx,
        this.owlParcel.gy,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + airLift + bob
      );
      const shadowPt = gridToScreen(
        this.owlParcel.gx,
        this.owlParcel.gy,
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
        this.drawRadialGlow(
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

        // Cozy floating invite badge above parcel
        if (!hideInteractive) {
          const pillY = by - 13 * zoom;
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

          this.hotspots.push({
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
    if (this.owlCollectBurst) {
      const bt = (now - this.owlCollectBurst.startedAt) / 700;
      if (bt >= 1) {
        this.owlCollectBurst = null;
      } else {
        const bp = gridToScreen(this.owlCollectBurst.gx, this.owlCollectBurst.gy, cam, viewW, viewH, 16);
        this.drawCompletionSparkles(bp.sx, bp.sy, 46 * zoom, 42 * zoom, zoom, bt, isNight);
      }
    }

    // 5. Draw the Snowy Owl swooping gracefully across the village sky!
    if (this.owlFlight) {
      const ft = (now - this.owlFlight.startedAt) / this.owlFlight.durationMs;
      if (ft >= 1) {
        this.owlFlight = null;
      } else {
        if (!this.owlFlight.dropped && ft >= 0.48) {
          this.owlFlight.dropped = true;
          if (!sim.isHeadmasterPreview) {
            this.owlParcel = {
              gx: this.owlFlight.dropGx,
              gy: this.owlFlight.dropGy,
              droppedAt: now,
              expiresAt: now + 28_000,
            };
          }
        }

        const curGx =
          ft < 0.5
            ? this.owlFlight.startGx + (this.owlFlight.dropGx - this.owlFlight.startGx) * (ft / 0.5)
            : this.owlFlight.dropGx + (this.owlFlight.endGx - this.owlFlight.dropGx) * ((ft - 0.5) / 0.5);
        const curGy =
          ft < 0.5
            ? this.owlFlight.startGy + (this.owlFlight.dropGy - this.owlFlight.startGy) * (ft / 0.5)
            : this.owlFlight.dropGy + (this.owlFlight.endGy - this.owlFlight.dropGy) * ((ft - 0.5) / 0.5);

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

          const flap = this.reducedMotion ? 0.3 : Math.sin(now * 0.018);
          ctx.translate(owlScreen.sx, owlScreen.sy);
          const s = Math.max(0.75, zoom * 0.95);
          ctx.scale(s, s);

          // Carried parcel before drop
          if (!this.owlFlight.dropped && !sim.isHeadmasterPreview) {
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

  /**
   * Commits the "Sunlit Hogsmeade" golden-hour visual hook:
   *  - Warm honey sun-bloom + diagonal god-rays slanting gently from the sun
   *  - Soft warm storybook vignette framing the four corners toward the village center
   */
  private drawGoldenAtmosphereAndVignette(
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void {
    const ctx = this.ctx;
    const isOvercast = weather.kind === 'rain' || weather.kind === 'storm';

    // 1. Diagonal Golden Hour Sunbeams & Warm Honey Sun-Bloom
    if (!isOvercast && (period === 'day' || period === 'dawn' || period === 'dusk')) {
      const sunX = viewW * (period === 'dawn' ? 0.2 : period === 'dusk' ? 0.8 : 0.76);
      const sunY = Math.max(58, viewH * 0.14);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Broad warm honey sun-bloom bathing the upper sky & village rooftops
      const bloomR = Math.max(viewW, viewH) * 0.56;
      const bloom = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, bloomR);
      if (period === 'dusk') {
        bloom.addColorStop(0, 'rgba(255, 206, 138, 0.30)');
        bloom.addColorStop(0.42, 'rgba(251, 164, 116, 0.12)');
        bloom.addColorStop(1, 'rgba(251, 146, 60, 0)');
      } else {
        bloom.addColorStop(0, 'rgba(255, 248, 196, 0.32)');
        bloom.addColorStop(0.38, 'rgba(254, 235, 148, 0.13)');
        bloom.addColorStop(1, 'rgba(254, 240, 138, 0)');
      }
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, viewW, viewH);

      // Three gentle diagonal god-ray ribbons slanting across the meadow
      const rayAngles =
        period === 'dawn' ? [0.52, 0.74, 0.98] : [2.08, 2.30, 2.54];
      const rayLen = Math.hypot(viewW, viewH) * 0.92;
      const shimmer = this.reducedMotion ? 0 : Math.sin(this.tick * 0.016) * 0.015;

      for (let i = 0; i < rayAngles.length; i++) {
        const ang = rayAngles[i] + shimmer * (i % 2 === 0 ? 1 : -1);
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
        const peakAlpha = period === 'dusk' ? 0.095 : 0.105 - i * 0.015;
        rayGrad.addColorStop(0, `rgba(255, 250, 214, ${peakAlpha})`);
        rayGrad.addColorStop(0.5, `rgba(254, 236, 162, ${peakAlpha * 0.55})`);
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

    // 2. Cozy Storybook Vignette framing the viewport corners toward the village heart
    const cx = viewW * 0.5;
    const cy = viewH * 0.48;
    const outerR = Math.hypot(viewW, viewH) * 0.58;
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
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();
  }

  /**
   * Post-FX Layer 1: Warm Golden-Violet Radial Bloom on crop / good / gnome harvest.
   * Draws a soft expanding ring with alpha <= 0.35 at the latest harvest location.
   */
  private drawHarvestBloom(now: number, zoom: number): void {
    if (!this.harvestBloom) return;
    const elapsed = now - this.harvestBloom.startedAt;
    const duration = 650;
    if (elapsed >= duration || elapsed < 0) {
      this.harvestBloom = null;
      return;
    }
    const t = elapsed / duration;
    const alpha = Math.max(0, (1 - t) * 0.35);
    const rad = Math.max(18, (24 + t * 76) * zoom);
    const { x, y } = this.harvestBloom;

    const ctx = this.ctx;
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

  /**
   * Post-FX Layer 2: Day / Night Atmospheric Tint Overlay.
   * Night: cold navy-blue tint (alpha <= 0.18).
   * Dusk: warm sunset-orange glow (alpha <= 0.12).
   * Uses 'soft-light' blend mode with graceful fallback to 'source-over'.
   */
  private drawDayNightLightLayer(
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night'
  ): void {
    const ctx = this.ctx;
    ctx.save();

    try {
      ctx.globalCompositeOperation = 'soft-light';
    } catch {
      ctx.globalCompositeOperation = 'source-over';
    }
    if (ctx.globalCompositeOperation !== 'soft-light') {
      ctx.globalCompositeOperation = 'source-over';
    }

    const grad = ctx.createLinearGradient(0, 0, 0, viewH);

    if (period === 'night') {
      grad.addColorStop(0, 'rgba(30, 58, 138, 0.16)');
      grad.addColorStop(0.55, 'rgba(23, 37, 84, 0.14)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.18)');
    } else if (period === 'dusk') {
      grad.addColorStop(0, 'rgba(249, 115, 22, 0.11)');
      grad.addColorStop(0.6, 'rgba(234, 88, 12, 0.09)');
      grad.addColorStop(1, 'rgba(180, 83, 9, 0.12)');
    } else if (period === 'dawn') {
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
      grad.addColorStop(1, 'rgba(244, 114, 182, 0.06)');
    } else {
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.04)');
      grad.addColorStop(1, 'rgba(253, 224, 71, 0.02)');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();
  }

  // Interactive Isometric Minimap Radar Renderer (rotation-aware)!
  public renderMinimap(minimapCanvas: HTMLCanvasElement, sim: ParkSimulation, cam: Camera): void {
    const mCtx = minimapCanvas.getContext('2d');
    if (!mCtx) return;
    const w = minimapCanvas.width;
    const h = minimapCanvas.height;
    mCtx.clearRect(0, 0, w, h);

    const rot = cam.viewRot ?? 0;
    const unlockedSet = new Set(sim.state.unlockedZones);
    const scaleX = (w * 0.46) / GRID_SIZE;
    const scaleY = (h * 0.44) / GRID_SIZE;
    const originX = w * 0.5;
    const originY = 8;

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
}
