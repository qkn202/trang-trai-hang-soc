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
export {
  JuiceFX,
  MAX_WEATHER_PARTICLES,
  buildLockedSceneryCatalog,
  computeWeatherParticleBudget,
  resolveBuildingInWorldTimerInfo,
  rotTileToWorldTile,
  TERRAIN_PALETTE,
} from "./rendererShared";
export type {
  InWorldTimerBadgeInfo,
  InWorldTimerKind,
  JuiceEventKind,
  LockedSceneryProp,
  ScreenHotspot,
  TopologicalDrawCmd,
} from "./rendererShared";

import {
  terrainDrawSkyBackdrop,
  terrainDrawFloatingIslandRim,
  terrainRenderGroundTilesLayer,
  terrainDrawCachedOrLiveGround,
  terrainDrawScrollingCloudShadows,
  terrainDrawAutoTiledPath,
  terrainDrawAutoTiledZooFence,
  terrainDrawCoasterTrackPiece,
  terrainDrawCoasterVehicleSprite,
  terrainRebuildHeatmapCache,
  terrainComputeTileHeatmapColor,
  terrainDrawDiamondOutline,
  terrainRectScreenCorners,
  terrainDrawLockedForestProp,
  terrainDrawScenicRiverBridge,
  terrainDrawSculptedHomesteadWallSeg,
} from './renderTerrain';

import {
  waterDrawOrganicWaterShorelines,
  waterDrawSeamlessWaterDetails,
} from './renderWater';

import {
  buildingsGetCropIconImage,
  buildingsDrawPlacedBuilding,
  buildingsDrawGateIndicators,
  buildingsDrawStarArchitecturalEvolution,
  buildingsDrawLiveBuildingAnimations,
  buildingsComputePlotConnMask,
  buildingsDrawBuildingBaseGrassTufts,
  buildingsDrawMarbleBenchProp,
  buildingsDrawFloatingCandlesProp,
  buildingsDrawHouseBannerProp,
  buildingsDrawPatronusLanternProp,
  buildingsDrawSynergyLinks,
} from './renderBuildings';

import {
  cropsDrawEmptyPlotSeedCue,
  cropsDrawEmptyPastureAnimalCue,
  cropsGetPlotFurrowGrid,
  cropsDrawFarmlandSeedlings,
  cropsGetPlotClusterGrid,
  cropsDrawFarmlandCropRows,
  cropsDrawHarvestBubble,
  cropsDrawInWorldWaitTimers,
  cropsDrawInWorldTimerPill,
  cropsDrawNeighborVisitOverlays,
  cropsDrawHomeOwlLanternMarks,
  cropsDrawTutorialWorldTarget,
  cropsDrawHarvestOverflowPill,
  cropsDrawGhostPlacement,
  cropsDrawLockedZonePlaque,
} from './renderCropsAndTimers';

import {
  entitiesGetCompletionPop,
  entitiesDrawCompletionShockwave,
  entitiesDrawCompletionSparkles,
  entitiesCollectOwlPostParcel,
  entitiesGetSquashScale,
  entitiesGetSunShadowVector,
  entitiesSortDrawablesTopological,
  entitiesDrawSkyFireworks,
  entitiesDrawEscapedCreature,
  entitiesDrawValleyVillager,
  entitiesDrawRadialGlow,
  entitiesDrawNightCandlelightPass,
  entitiesDrawWeatherParticles,
  entitiesDrawAndTickOwlPostEvent,
  entitiesDrawGoldenAtmosphereAndVignette,
  entitiesDrawHarvestBloom,
  entitiesDrawDayNightLightLayer,
  entitiesRenderMinimap,
} from './renderEntitiesAndWeather';
import {
  PresentationCeilingController,
  resolveSeasonFromDayCount,
} from './presentationCeiling';

export class IsometricRenderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public sprites: SpriteRegistry;
  public presentation = new PresentationCeilingController();
  public dpr = 1;
  public adaptiveDprCap = 2;
  public hotspots: ScreenHotspot[] = [];
  public particles: Array<{ x: number; y: number; r: number; vy: number; vx: number; hue: string }> = [];
  public rainStreaks: Array<{ x: number; y: number; len: number; speed: number }> = [];
  public skyClouds: Array<{ x: number; y: number; scale: number; speed: number; alpha: number }> = [];
  public tick = 0;
  public buildingMap = new Map<string, PlacedBuilding>();
  public heatmapCache: Array<string | null> = new Array(GRID_SIZE * GRID_SIZE).fill(null);
  public heatmapCacheAt = 0;
  public heatmapCacheMode: HeatmapMode = 'none';
  public heatmapCacheBuildingCount = -1;
  public reducedMotion = false;
  public juiceFx: JuiceFX;
  public harvestBloom: { x: number; y: number; startedAt: number } | null = null;
  private prevRipePlots = new Set<string>();
  private prevRipeSceneKey = '';
  public activeSeedBrushCropId: FarmCropId | null = null;
  public activePastureBrushAnimalId: PastureAnimalId | null = null;
  public activeMovingUid: string | null = null;
  public ghostConnectableRect: {
    gx: number;
    gy: number;
    bw: number;
    bh: number;
    elev: number;
    group: ConnectablePlotGroup;
  } | null = null;

  public getCropIconImage(cropId: FarmCropId): CanvasImageSource | undefined { return buildingsGetCropIconImage(this, cropId); }

  // Tactile Squash-and-Stretch spring physics map (entity id -> trigger timestamp ms)
  public squashMap = new Map<string, number>();

  // "Just finished building!" celebration pops (entity id -> trigger timestamp ms).
  // These give the player the one dopamine beat the park was missing: the
  // moment a construction site turns into a working building.
  public completionPopMap = new Map<string, number>();

  // Offscreen Static Ground Cache for 60fps zoomed-out rendering
  public groundCacheCanvas: HTMLCanvasElement | null = null;
  public groundCacheKey = '';

  // Pre-smoothed organic lake shoreline loops (recomputed only when the
  // map layout changes, keyed by state revision).
  public waterLoops: WaterLoop[] = [];
  public waterLoopsRevision = -1;
  private lockedScenery: LockedSceneryProp[] = buildLockedSceneryCatalog();

  // Owl Post Delivery & Storm Lightning state
  public lightningFlashAlpha = 0;
  public nextLightningAt = 0;
  public nextOwlSpawnAt = 0;
  public owlFlight: {
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
  public owlParcel: {
    gx: number;
    gy: number;
    droppedAt: number;
    expiresAt: number;
  } | null = null;
  public owlCollectBurst: { gx: number; gy: number; startedAt: number } | null = null;

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
        this.presentation.particlePool.spawnBurst('harvest_sparkle', cx, cy, 10, this.reducedMotion);
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
  public getCompletionPop(
    uid: string,
    now: number
  ): { scale: number; liftY: number; ring: number } { return entitiesGetCompletionPop(this, uid, now); }

  public drawCompletionShockwave(
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    ringT: number,
    isNight: boolean
  ): void { return entitiesDrawCompletionShockwave(this, cx, bottomY, drawW, drawH, zoom, ringT, isNight); }

  /** Festive confetti ribbons + twinkling 4-point golden stars bursting from a completed building. */
  public drawCompletionSparkles(
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number,
    ringT: number,
    isNight: boolean
  ): void { return entitiesDrawCompletionSparkles(this, cx, bottomY, drawW, drawH, zoom, ringT, isNight); }

  public collectOwlPostParcel(): { gx: number; gy: number } | null { return entitiesCollectOwlPostParcel(this); }

  public getSquashScale(id: string, now: number): { sx: number; sy: number } { return entitiesGetSquashScale(this, id, now); }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.adaptiveDprCap);
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
  } { return entitiesGetSunShadowVector(this, period); }

  private sortDrawablesTopological(items: TopologicalDrawCmd[]): TopologicalDrawCmd[] { return entitiesSortDrawablesTopological(this, items); }

  private drawSkyBackdrop(
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void { return terrainDrawSkyBackdrop(this, viewW, viewH, period, weather); }

  private drawFloatingIslandRim(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean
  ): void { return terrainDrawFloatingIslandRim(this, sim, cam, viewW, viewH, isNightLike); }

  private renderGroundTilesLayer(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean,
    showGridLines: boolean,
    unlockedSet: Set<string>,
    skipCull = false
  ): void { return terrainRenderGroundTilesLayer(this, sim, cam, viewW, viewH, isNightLike, showGridLines, unlockedSet, skipCull); }

  private drawCachedOrLiveGround(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    isNightLike: boolean,
    showGridLines: boolean,
    unlockedSet: Set<string>
  ): void { return terrainDrawCachedOrLiveGround(this, sim, cam, viewW, viewH, isNightLike, showGridLines, unlockedSet); }

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
  ): void { return waterDrawOrganicWaterShorelines(this, sim, cam, viewW, viewH, isNight, unlockedSet); }

  private drawScrollingCloudShadows(
    cam: Camera,
    viewW: number,
    viewH: number,
    period: 'dawn' | 'day' | 'dusk' | 'night',
    weather: WeatherForecastSlot
  ): void { return terrainDrawScrollingCloudShadows(this, cam, viewW, viewH, period, weather); }

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
    const season = resolveSeasonFromDayCount(sim.state.level ?? 1, this.presentation.seasonOverride);
    this.presentation.drawParallaxHorizonLayer(ctx, cam, viewW, viewH, period, season);

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

    // 3d. AAA Scenic 2.5D Arched Mossy Stone River Bridges, Chunky Homestead Stone Walls & Non-Blocking Valley Flora!
    const scenicRiverBridges: Array<[number, number, number, number]> = [
      [4, 22, 4.18, 22.25],
      [4, 34, 4.55, 34.25],
    ];
    for (const [bgx, bgy, cgx, cgy] of scenicRiverBridges) {
      const bCell = sim.grid[bgy]?.[bgx];
      if (!bCell || bCell.buildingUid || bCell.terrain !== 'water') continue;
      if (!sim.state.sandboxMode && !unlockedSet.has(bCell.zoneId)) continue;
      const bAnchor = gridToScreen(cgx, cgy, cam, viewW, viewH, bCell.elevation * ELEV_PX);
      if (
        bAnchor.sx < -margin * 2 ||
        bAnchor.sx > viewW + margin * 2 ||
        bAnchor.sy < -margin * 2 ||
        bAnchor.sy > viewH + margin * 2
      ) {
        continue;
      }
      const { rx0, ry0, rbw, rbh } = rotateGridRect(bgx - 1, bgy, 3, 1, viewRot);
      drawList.push({
        rxMin: rx0 + 0.05,
        ryMin: ry0 + 0.05,
        rxMax: rx0 + rbw - 0.05,
        ryMax: ry0 + rbh - 0.05,
        depth: rx0 + rbw + ry0 + rbh - 0.12,
        draw: () =>
          terrainDrawScenicRiverBridge(
            this,
            cgx,
            cgy,
            bCell.elevation,
            cam,
            viewW,
            viewH,
            isNightLike
          ),
      });
    }

    // Chunky 2.5D Stacked Grey-Limestone & Emerald-Moss Homestead Walls framing the River Ottery bank & Hang Sóc terraces (auto-hides if built upon!)
    const pushHomesteadWall = (wgx: number, wgy: number, axis: 'ew' | 'ns', isGatePost: boolean) => {
      const wCell = sim.grid[wgy]?.[wgx];
      if (!wCell || wCell.buildingUid || wCell.path !== 'none' || wCell.terrain !== 'grass') return;
      if (!sim.state.sandboxMode && !unlockedSet.has(wCell.zoneId)) return;
      const wp = rotatedTileDiamondToScreen(wgx, wgy, cam, viewW, viewH, wCell.elevation * ELEV_PX);
      if (wp.sx < -margin || wp.sx > viewW + margin || wp.sy < -margin || wp.sy > viewH + margin) return;
      const { rx0, ry0 } = rotateGridRect(wgx, wgy, 1, 1, viewRot);
      drawList.push({
        rxMin: rx0 + 0.12,
        ryMin: ry0 + 0.12,
        rxMax: rx0 + 0.88,
        ryMax: ry0 + 0.88,
        depth: rx0 + ry0 + 1.02,
        draw: () =>
          terrainDrawSculptedHomesteadWallSeg(
            this,
            wgx,
            wgy,
            wCell.elevation,
            axis,
            isGatePost,
            cam,
            viewW,
            viewH,
            isNightLike
          ),
      });
    };
    for (let wgy = 14; wgy <= 20; wgy++) pushHomesteadWall(6, wgy, 'ns', wgy === 14 || wgy === 20);
    for (let wgy = 26; wgy <= 31; wgy++) pushHomesteadWall(6, wgy, 'ns', wgy === 26 || wgy === 31);
    for (let wgx = 7; wgx <= 12; wgx++) pushHomesteadWall(wgx, 13, 'ew', wgx === 12);
    for (let wgx = 19; wgx <= 25; wgx++) pushHomesteadWall(wgx, 13, 'ew', wgx === 19 || wgx === 25);
    for (let wgx = 8; wgx <= 14; wgx++) pushHomesteadWall(wgx, 30, 'ew', wgx === 8 || wgx === 14);

    // Curated non-blocking 2.5D riverside flowering bushes, wildflowers & mossy rocks on open unlocked grass tiles!
    const valleyFloraSpots: Array<[number, number, string, number, boolean]> = [
      [2, 17, 'env_bush_flowers', 1.02, false],
      [2, 20, 'env_mossy_rock', 0.96, true],
      [2, 24, 'env_bush_flowers', 1.05, true],
      [2, 28, 'env_flower_patch', 0.98, false],
      [5, 19, 'env_mossy_rock', 0.92, false],
      [5, 25, 'env_mossy_rock', 0.95, true],
      [7, 17, 'env_bush_flowers', 0.98, false],
      [7, 21, 'env_flower_patch', 1.04, true],
      [7, 27, 'env_bush_flowers', 1.02, true],
      [8, 19, 'env_flower_patch', 0.96, false],
      [11, 21, 'env_bush_flowers', 0.95, false],
      [15, 28, 'env_flower_patch', 1.0, true],
      [22, 21, 'env_bush_flowers', 1.02, true],
      [22, 26, 'env_flower_patch', 0.98, false],
      [24, 17, 'env_bush_flowers', 1.04, false],
      [28, 18, 'env_mossy_rock', 0.94, true],
      [30, 23, 'env_bush_flowers', 1.05, false],
      [33, 21, 'env_flower_patch', 1.02, true],
    ];
    for (const [fgx, fgy, spriteKey, scale, flipX] of valleyFloraSpots) {
      const fCell = sim.grid[fgy]?.[fgx];
      if (!fCell || fCell.buildingUid || fCell.path !== 'none' || fCell.terrain !== 'grass') continue;
      if (!sim.state.sandboxMode && !unlockedSet.has(fCell.zoneId)) continue;
      const fp = gridToScreen(fgx + 0.5, fgy + 0.5, cam, viewW, viewH, fCell.elevation * ELEV_PX);
      if (fp.sx < -margin || fp.sx > viewW + margin || fp.sy < -margin || fp.sy > viewH + margin) continue;
      const { rx, ry } = rotateGridPoint(fgx + 0.5, fgy + 0.5, viewRot);
      const floraProp: LockedSceneryProp = { gx: fgx, gy: fgy, zoneId: fCell.zoneId, spriteKey, scale, flipX };
      drawList.push({
        rxMin: rx - 0.22,
        ryMin: ry - 0.22,
        rxMax: rx + 0.22,
        ryMax: ry + 0.22,
        depth: rx + ry + 0.28,
        draw: () => this.drawLockedForestProp(floraProp, fp.sx, fp.sy, cam.zoom, shadowVec, isNightLike),
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
    this.presentation.drawDynamicNightAndWetPass(
      ctx,
      sim,
      cam,
      viewW,
      viewH,
      now,
      period,
      weather.kind
    );

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

    // 6b. Internal Juice Hook: Track harvested plots automatically (reset cleanly on scene switch)
    const sceneKey = `${sim.isVisitingNeighbor ? sim.getActiveVisitingNeighbor()?.id ?? 'visit' : 'home'}|${sim.isHeadmasterPreview ? 'preview' : 'live'}`;
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
    if (this.prevRipeSceneKey && this.prevRipeSceneKey === sceneKey) {
      for (const prevUid of this.prevRipePlots) {
        if (!currentRipePlots.has(prevUid)) {
          const b = this.buildingMap.get(prevUid);
          if (b) {
            const pt = gridToScreen(b.gx + 0.5, b.gy + 0.5, cam, viewW, viewH, 18);
            this.notifyJuice('harvest', pt.sx, pt.sy);
          }
        }
      }
    }
    this.prevRipeSceneKey = sceneKey;
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
    this.presentation.drawPostFxAndForegroundCeiling(
      ctx,
      sim,
      cam,
      viewW,
      viewH,
      now,
      period,
      weather.kind,
      festival !== 'none',
      this.reducedMotion,
      Math.hypot(shake.x, shake.y)
    );

    if (hasWorldShake) {
      ctx.restore();
    }

    // 11. Fullscreen Juice Overlays: FlashFX & ConfettiFX
    this.juiceFx.applyTo(ctx, viewW, viewH);
  }

  public drawSeamlessWaterDetails(
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
  ): void { return waterDrawSeamlessWaterDetails(this, sim, rx0, ry0, viewRot, gx, gy, sx, sy, hw, hh, zoom, isNight); }

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
  ): void { return terrainDrawAutoTiledPath(this, sim, rx0, ry0, viewRot, sx, sy, hw, hh, path, overWater, isNight, zoom); }

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
  ): void { return terrainDrawAutoTiledZooFence(this, sim, rx0, ry0, viewRot, sx, sy, hw, hh, zoom); }

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
  ): void { return terrainDrawCoasterTrackPiece(this, sim, rx0, ry0, viewRot, elev, sx, sy, hw, hh, zoom); }

  private drawCoasterVehicleSprite(sx: number, sy: number, zoom: number, _flipX: boolean): void { return terrainDrawCoasterVehicleSprite(this, sx, sy, zoom, _flipX); }

  private rebuildHeatmapCache(
    sim: ParkSimulation,
    mode: HeatmapMode,
    unlockedSet: Set<string>,
    now: number
  ): void { return terrainRebuildHeatmapCache(this, sim, mode, unlockedSet, now); }

  private computeTileHeatmapColor(
    sim: ParkSimulation,
    gx: number,
    gy: number,
    mode: HeatmapMode,
    wonderEmitters?: Array<{ cx: number; cy: number; power: number }>
  ): string | null { return terrainComputeTileHeatmapColor(this, sim, gx, gy, mode, wonderEmitters); }

  private drawDiamondOutline(
    sx: number,
    sy: number,
    hw: number,
    hh: number,
    fill: string,
    stroke: string
  ): void { return terrainDrawDiamondOutline(this, sx, sy, hw, hh, fill, stroke); }

  public rectScreenCorners(
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
  } { return terrainRectScreenCorners(this, gx, gy, bw, bh, cam, viewW, viewH, zOff); }

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
  ): void { return buildingsDrawPlacedBuilding(this, sim, b, item, bw, bh, elev, cam, viewW, viewH, now, isNight, shadowVec, isSelected, cutaway); }

  public drawGateIndicators(
    sim: ParkSimulation,
    b: PlacedBuilding,
    bw: number,
    bh: number,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void { return buildingsDrawGateIndicators(this, sim, b, bw, bh, cam, viewW, viewH); }

  private drawStarArchitecturalEvolution(
    stars: number,
    cx: number,
    bottomY: number,
    drawW: number,
    drawH: number,
    zoom: number
  ): void { return buildingsDrawStarArchitecturalEvolution(this, stars, cx, bottomY, drawW, drawH, zoom); }

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
  ): void { return buildingsDrawLiveBuildingAnimations(this, b, item, cx, bottomY, drawW, drawH, zoom, isNight, plotConnMask); }

  private drawLockedForestProp(
    prop: LockedSceneryProp,
    sx: number,
    sy: number,
    zoom: number,
    shadowVec: { dx: number; dy: number; alpha: number },
    isNight: boolean
  ): void { return terrainDrawLockedForestProp(this, prop, sx, sy, zoom, shadowVec, isNight); }

  public computePlotConnMask(
    sim: ParkSimulation,
    gx: number,
    gy: number,
    bw: number,
    bh: number,
    elev: number,
    group: ConnectablePlotGroup,
    viewRot: 0 | 1 | 2 | 3,
    now: number
  ): number { return buildingsComputePlotConnMask(this, sim, gx, gy, bw, bh, elev, group, viewRot, now); }

  private drawBuildingBaseGrassTufts(
    pLeft: { sx: number; sy: number },
    pBottom: { sx: number; sy: number },
    pRight: { sx: number; sy: number },
    seed: number,
    zoom: number,
    isNight: boolean,
    openSW = true,
    openSE = true
  ): void { return buildingsDrawBuildingBaseGrassTufts(this, pLeft, pBottom, pRight, seed, zoom, isNight, openSW, openSE); }

  private drawMarbleBenchProp(cx: number, bottomY: number, zoom: number, isNight: boolean): void { return buildingsDrawMarbleBenchProp(this, cx, bottomY, zoom, isNight); }

  private drawFloatingCandlesProp(cx: number, bottomY: number, zoom: number, isNight: boolean): void { return buildingsDrawFloatingCandlesProp(this, cx, bottomY, zoom, isNight); }

  private drawHouseBannerProp(cx: number, bottomY: number, zoom: number, seed: number): void { return buildingsDrawHouseBannerProp(this, cx, bottomY, zoom, seed); }

  private drawPatronusLanternProp(cx: number, bottomY: number, zoom: number): void { return buildingsDrawPatronusLanternProp(this, cx, bottomY, zoom); }

  private drawSynergyLinks(
    sim: ParkSimulation,
    selectedUid: string | null,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void { return buildingsDrawSynergyLinks(this, sim, selectedUid, cam, viewW, viewH); }

  private drawSkyFireworks(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void { return entitiesDrawSkyFireworks(this, sim, cam, viewW, viewH); }

  private drawEscapedCreature(id: string, species: string, sx: number, sy: number, zoom: number): void { return entitiesDrawEscapedCreature(this, id, species, sx, sy, zoom); }

  public drawEmptyPlotSeedCue(drawW: number, drawH: number): void { return cropsDrawEmptyPlotSeedCue(this, drawW, drawH); }

  public drawEmptyPastureAnimalCue(drawW: number, drawH: number): void { return cropsDrawEmptyPastureAnimalCue(this, drawW, drawH); }

  private getPlotFurrowGrid(drawW: number, drawH: number): Array<{ x: number; y: number; idx: number }> { return cropsGetPlotFurrowGrid(this, drawW, drawH); }

  public drawFarmlandSeedlings(
    drawW: number,
    drawH: number,
    growRatio: number,
    watered: boolean
  ): void { return cropsDrawFarmlandSeedlings(this, drawW, drawH, growRatio, watered); }

  private getPlotClusterGrid(drawW: number, drawH: number): Array<{ x: number; y: number; idx: number }> { return cropsGetPlotClusterGrid(this, drawW, drawH); }

  public drawFarmlandCropRows(
    cropId: FarmCropId,
    drawW: number,
    drawH: number,
    growRatio: number,
    watered: boolean,
    seedHash: number
  ): void { return cropsDrawFarmlandCropRows(this, cropId, drawW, drawH, growRatio, watered, seedHash); }

  private drawHarvestBubble(b: PlacedBuilding, sx: number, sy: number, zoom: number): void { return cropsDrawHarvestBubble(this, b, sx, sy, zoom); }

  private drawInWorldWaitTimers(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    activeFestival: string,
    selectedUid: string | null,
    movingBuildingUid: string | null
  ): void { return cropsDrawInWorldWaitTimers(this, sim, cam, viewW, viewH, now, activeFestival, selectedUid, movingBuildingUid); }

  private drawValleyVillager(
    v: ValleyVillagerEntity,
    sx: number,
    sy: number,
    zoom: number,
    isNight: boolean
  ): void { return entitiesDrawValleyVillager(this, v, sx, sy, zoom, isNight); }

  private drawInWorldTimerPill(
    info: InWorldTimerBadgeInfo,
    sx: number,
    sy: number,
    zoom: number,
    isSelected: boolean
  ): void { return cropsDrawInWorldTimerPill(this, info, sx, sy, zoom, isSelected); }

  private drawNeighborVisitOverlays(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number
  ): void { return cropsDrawNeighborVisitOverlays(this, sim, cam, viewW, viewH, now); }

  private drawHomeOwlLanternMarks(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void { return cropsDrawHomeOwlLanternMarks(this, sim, cam, viewW, viewH); }

  private drawTutorialWorldTarget(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void { return cropsDrawTutorialWorldTarget(this, sim, cam, viewW, viewH); }

  /** Compact "+N" pill shown when more than MAX_BUBBLES_ON_SCREEN harvests
   *  are ready at once — anchored cleanly above the speech-pin crest so it never overlaps icons. */
  private drawHarvestOverflowPill(sx: number, sy: number, zoom: number, overflow: number): void { return cropsDrawHarvestOverflowPill(this, sx, sy, zoom, overflow); }

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
  ): void { return cropsDrawGhostPlacement(this, sim, item, gx, gy, rotation, cam, viewW, viewH, ignoreBuildingUid); }

  private drawLockedZonePlaque(
    sim: ParkSimulation,
    z: ZoneDef,
    cam: Camera,
    viewW: number,
    viewH: number
  ): void { return cropsDrawLockedZonePlaque(this, sim, z, cam, viewW, viewH); }

  public drawRadialGlow(x: number, y: number, r: number, color: string): void { return entitiesDrawRadialGlow(this, x, y, r, color); }

  private drawNightCandlelightPass(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    now: number,
    isFullNight: boolean
  ): void { return entitiesDrawNightCandlelightPass(this, sim, cam, viewW, viewH, now, isFullNight); }

  private drawWeatherParticles(
    sim: ParkSimulation,
    viewW: number,
    viewH: number,
    isNight: boolean,
    festival: string,
    weather: WeatherForecastSlot,
    now: number
  ): void { return entitiesDrawWeatherParticles(this, sim, viewW, viewH, isNight, festival, weather, now); }

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
  ): void { return entitiesDrawAndTickOwlPostEvent(this, sim, cam, viewW, viewH, now, isNight, hideInteractive); }

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
  ): void { return entitiesDrawGoldenAtmosphereAndVignette(this, viewW, viewH, period, weather); }

  /**
   * Post-FX Layer 1: Warm Golden-Violet Radial Bloom on crop / good / gnome harvest.
   * Draws a soft expanding ring with alpha <= 0.35 at the latest harvest location.
   */
  private drawHarvestBloom(now: number, zoom: number): void { return entitiesDrawHarvestBloom(this, now, zoom); }

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
  ): void { return entitiesDrawDayNightLightLayer(this, viewW, viewH, period); }

  // Interactive Isometric Minimap Radar Renderer (rotation-aware)!
  public renderMinimap(minimapCanvas: HTMLCanvasElement, sim: ParkSimulation, cam: Camera): void { return entitiesRenderMinimap(this, minimapCanvas, sim, cam); }
}
