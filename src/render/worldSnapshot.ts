// Mốc 1–3: Zero-Allocation TypedArray WorldRenderSnapshot + IsoSceneSortedPass Collector.
// - Tách biệt hoàn toàn khỏi mutation của ParkSimulation.
// - Địa hình (5.184 ô), sông Ottery và thảm cỏ GPU chỉ cập nhật khi `terrainRevision` đổi (0.00ms CPU mỗi frame khi kéo/zoom camera).
// - Toàn bộ công trình, ruộng cây, cầu đá, rừng cây và dân làng trộn chung vào 1 đồ thị tô-pô Kahn (`IsoSceneSortedPass`) để giữ chuẩn 100% thứ tự che khuất Isometric 2.5D.

import { FARM_CROPS, getCatalogItem, PASTURE_ANIMALS } from '../data/catalog';
import { GRID_SIZE } from '../data/zones';
import {
  Camera,
  ELEV_PX,
  getCameraFocusGrid,
  rotateGridPoint,
  rotateGridRect,
  TILE_H,
  TILE_W,
  worldIso,
} from '../engine/isometric';
import { resolveSeasonFromDayCount, SeasonId } from '../engine/presentationCeiling';
import {
  buildLockedSceneryCatalog,
  LockedSceneryProp,
  resolveWinterScenerySpriteKey,
  rotTileToWorldTile,
  ScreenHotspot,
  WINTER_VALLEY_CHRISTMAS_SPOTS,
} from '../engine/rendererShared';
import { resolveCatalogPropSpriteKey } from '../engine/spriteLoader';
import { getHarmonizedSpriteScale } from './spriteLightingProfile';
import { computeWorkshopKineticState } from './workshopKinetics';
import type { ParkSimulation } from '../sim/simulation';
import {
  CatalogItem,
  ConnectablePlotGroup,
  PlacedBuilding,
  ValleyVillagerId,
  WeatherKind,
} from '../types/game';
import type { SkeletalEntityPose } from './spine/spineAdapter';

export const TERRAIN_STRIDE = 8; // [wx, wy, r, g, b, pathKind, elev, seed]
export const WATER_STRIDE = 6;   // [wx, wy, shoreMask, depthFactor, unlocked, seed]
export const GRASS_STRIDE = 6;   // [wx, wy, heightPx, hueVar, phaseSeed, flowerFlag]
export const SCENE_STRIDE = 12;  // [wx, wy, drawW, drawH, spriteId, swayAmp, rotRad, pivotY, alpha, shadowScale, emissiveBoost, phaseSeed]
export const LIGHT_STRIDE = 8;   // [wx, wy, zHeight, radius, r, g, b, intensity]
export const INTERACTOR_STRIDE = 4; // [wx, wy, radius, strength]
export const PARTICLE_STRIDE = 6; // [wx, wy, size, r, g, b]

const MAX_SCENE_INSTANCES = 2048;
const MAX_GRASS_CAPACITY = 8000;
const MAX_LIGHT_SLOTS = 16;
const MAX_INTERACTOR_SLOTS = 16;
const MAX_PARTICLE_INSTANCES = 200;

export interface SpriteAtlasHandle {
  id: number;
  width: number;
  height: number;
}

export interface SpriteIdResolver {
  resolve(key: string): SpriteAtlasHandle | undefined;
}

export interface YuleMagicalLightProfile {
  family: 'ice-patronus' | 'fairy-violet' | 'slytherin-emerald' | 'festive-gold';
  rgb: [number, number, number];
  radius: number;
  intensity: number;
  emissiveBoost: number;
  activeInDaySnow: boolean;
  secondaryLakePool?: boolean;
}

const YULE_ICE_PATRONUS_IDS: ReadonlySet<string> = new Set([
  'yule_goblet_blue_brazier',
  'yule_hermione_bluebell_jars',
  'yule_stag_patronus_topiary',
  'yule_ice_phoenix_fountain',
  'yule_ice_stag_sculpture',
  'yule_ice_swan_arch',
  'yule_sword_frozen_pool',
  'yule_mirror_of_erised',
  'yule_castle_snowglobe',
  'yule_crystal_banquet_table',
  'yule_crystal_lotus_fountain_pot',
  'yule_blue_spruce_starlight',
  'yule_hogwarts_boathouse_ice',
]);

const YULE_FAIRY_VIOLET_IDS: ReadonlySet<string> = new Set([
  'yule_glowing_puffapod_bush',
  'yule_birch_fairy_grove',
  'yule_weasley_wheezes_facade',
  'yule_poinsettia_cauldron',
  'yule_sugarplum_tower',
]);

const YULE_EMERALD_IDS: ReadonlySet<string> = new Set([
  'yule_slytherin_serpent_mascot',
  'yule_four_house_hourglasses',
]);

/**
 * Bảng phân màu đèn GPU chuyên biệt cho bộ sưu tập Giáng Sinh `yule_*` (0 đụng file PNG):
 * - Lửa Cốc Lửa / Lọ Chuông Xanh Hermione / Hươu Patronus / Tượng Băng -> Lam Băng & Bạc Patronus
 * - Bụi Puffapod / Rừng Tiên / Tiệm Phù Thủy Quỷ Quái -> Tím Hồng Phép Thuật
 * - Linh Vật Slytherin / Đồng Hồ Cát Nhà -> Lục Bảo
 * - Cây Thông Đại Sảnh / Lâu Đài Hogwarts Thu Nhỏ / Đèn Hogsmeade -> Vàng Nến Ấm Áp
 */
export function resolveYuleMagicalLightProfile(itemId: string): YuleMagicalLightProfile | null {
  if (!itemId.startsWith('yule_')) return null;
  if (YULE_ICE_PATRONUS_IDS.has(itemId)) {
    return {
      family: 'ice-patronus',
      rgb: [0.28, 0.80, 1.0],
      radius: 175,
      intensity: 1.38,
      emissiveBoost: 1.28,
      activeInDaySnow: true,
    };
  }
  if (YULE_FAIRY_VIOLET_IDS.has(itemId)) {
    return {
      family: 'fairy-violet',
      rgb: [0.94, 0.52, 1.0],
      radius: 170,
      intensity: 1.25,
      emissiveBoost: 1.18,
      activeInDaySnow: false,
    };
  }
  if (YULE_EMERALD_IDS.has(itemId)) {
    return {
      family: 'slytherin-emerald',
      rgb: [0.20, 0.94, 0.62],
      radius: 155,
      intensity: 1.16,
      emissiveBoost: 1.12,
      activeInDaySnow: false,
    };
  }
  const isGrandYuleLandmark =
    itemId === 'yule_mini_hogwarts_castle' ||
    itemId === 'yule_great_hall_tree' ||
    itemId === 'yule_gringotts_dragon_dome' ||
    itemId === 'yule_hogwarts_snow_loco';
  return {
    family: 'festive-gold',
    rgb: [1.0, 0.76, 0.30],
    radius: isGrandYuleLandmark ? 215 : 162,
    intensity: isGrandYuleLandmark ? 1.44 : 1.08,
    emissiveBoost: isGrandYuleLandmark ? 1.26 : 1.05,
    activeInDaySnow: false,
    secondaryLakePool: itemId === 'yule_mini_hogwarts_castle',
  };
}

export type SceneTintFlag = 0 | 1 | 2 | 3 | 4; // 0=normal, 1=valid-ghost, 2=invalid-ghost, 3=selected, 4=bulldoze

export interface GameplayRenderOverlay {
  hoverTile?: { gx: number; gy: number } | null;
  selectedCatalogItem?: CatalogItem | null;
  rotation?: 0 | 1 | 2 | 3;
  bulldozerActive?: boolean;
  selectedBuildingUid?: string | null;
  movingBuildingUid?: string | null;
  hotspotsOut?: ScreenHotspot[];
  skipReadyBubbleSprites?: boolean;
}

const MAX_SKELETAL_SLOTS = 32;

interface TopoSceneSlot {
  rxMin: number;
  ryMin: number;
  rxMax: number;
  ryMax: number;
  depth: number;
  wx: number;
  wy: number;
  drawW: number;
  drawH: number;
  spriteId: number;
  swayAmp: number;
  rotRad: number;
  pivotY: number;
  alpha: number;
  tintFlag: SceneTintFlag;
  skeletalPoseIdx: number; // -1 for instanced sprite, >=0 for articulated Spine slot!
  shadowScale: number;
  emissiveBoost: number;
  phaseSeed: number;
  extraCount: number; // 0..4 attached overlay sprites (rotor / crop cluster / scaffolding / unveil ribbon / ready bubble)
  extraStart: number;
}

interface ExtraOverlaySprite {
  wx: number;
  wy: number;
  drawW: number;
  drawH: number;
  spriteId: number;
  swayAmp: number;
  rotRad: number;
  pivotY: number;
  alpha: number;
  tintFlag: SceneTintFlag;
  emissiveBoost: number;
  phaseSeed: number;
}

const VALLEY_FLORA_SPOTS: ReadonlyArray<[number, number, string, number, boolean]> = [
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

const SCENIC_RIVER_BRIDGES: ReadonlyArray<[number, number, number, number]> = [
  [4, 22, 4.18, 22.25],
  [4, 34, 4.55, 34.25],
];

function hash2d(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = ((h ^ (h >>> 13)) * 1274126177) | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function parseRgbaRgb(cssColor: string | undefined, fallback: [number, number, number]): [number, number, number] {
  if (!cssColor) return fallback;
  const m = cssColor.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return fallback;
  return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255];
}

export class WorldRenderSnapshotCollector {
  // Dirty-cached static GPU buffers (only rebuilt when grid/zones/rotation/grassBudget changes)
  public readonly terrainData = new Float32Array(GRID_SIZE * GRID_SIZE * TERRAIN_STRIDE);
  public terrainCount = 0;

  public readonly waterData = new Float32Array(GRID_SIZE * GRID_SIZE * WATER_STRIDE);
  public waterCount = 0;

  public readonly grassData = new Float32Array(MAX_GRASS_CAPACITY * GRASS_STRIDE);
  public grassCount = 0;

  public staticDirtyGeneration = 0;
  private cachedStaticKey = '';

  public get terrainRevision(): number {
    return this.staticDirtyGeneration;
  }

  // Dynamic per-frame pre-allocated SoA TypedArrays (0 GC allocation per frame!)
  public readonly sceneData = new Float32Array(MAX_SCENE_INSTANCES * SCENE_STRIDE);
  public readonly sceneSpriteIds = new Uint16Array(MAX_SCENE_INSTANCES);
  public readonly sceneTintFlags = new Uint8Array(MAX_SCENE_INSTANCES);
  public sceneCount = 0;

  // Range-sliced Spine / Articulated Skeletal slot interleaving (Iron Law #3)
  public readonly skeletalSortedIndices = new Int32Array(MAX_SKELETAL_SLOTS);
  public readonly skeletalPoses: SkeletalEntityPose[] = Array.from(
    { length: MAX_SKELETAL_SLOTS },
    () => ({
      villagerId: 'molly' as ValleyVillagerId,
      wx: 0,
      wy: 0,
      drawW: 0,
      drawH: 0,
      spriteId: 0,
      walkPhase: 0,
      isWalking: false,
      facingLeft: false,
      alpha: 1,
      greetWave: 0,
      tendingLean: 0,
      phaseSeed: 0,
    })
  );
  private readonly rawSkeletalPoses: SkeletalEntityPose[] = Array.from(
    { length: MAX_SKELETAL_SLOTS },
    () => ({
      villagerId: 'molly' as ValleyVillagerId,
      wx: 0,
      wy: 0,
      drawW: 0,
      drawH: 0,
      spriteId: 0,
      walkPhase: 0,
      isWalking: false,
      facingLeft: false,
      alpha: 1,
      greetWave: 0,
      tendingLean: 0,
      phaseSeed: 0,
    })
  );
  public skeletalCount = 0;

  private readonly chimneyEmitters = new Float32Array(12 * 3); // [wx, wy, seed]
  public chimneyCount = 0;

  public readonly lightData = new Float32Array(MAX_LIGHT_SLOTS * LIGHT_STRIDE);
  public lightCount = 0;

  public readonly interactorData = new Float32Array(MAX_INTERACTOR_SLOTS * INTERACTOR_STRIDE);
  public interactorCount = 0;

  public readonly particleData = new Float32Array(MAX_PARTICLE_INSTANCES * PARTICLE_STRIDE);
  public particleCount = 0;

  public period: 'dawn' | 'day' | 'dusk' | 'night' = 'day';
  public weatherKind: WeatherKind = 'sunny';
  public seasonId: SeasonId = 'spring';
  public sunShadowDx = 9;
  public sunShadowDy = 4.5;

  private readonly lockedScenery: LockedSceneryProp[] = buildLockedSceneryCatalog();
  private readonly unlockedZonesSet = new Set<string>();

  // Pre-allocated Topological Sort pools
  private readonly slots: TopoSceneSlot[] = Array.from({ length: MAX_SCENE_INSTANCES }, () => ({
    rxMin: 0,
    ryMin: 0,
    rxMax: 0,
    ryMax: 0,
    depth: 0,
    wx: 0,
    wy: 0,
    drawW: 0,
    drawH: 0,
    spriteId: 0,
    swayAmp: 0,
    rotRad: 0,
    pivotY: 0,
    alpha: 1,
    tintFlag: 0,
    skeletalPoseIdx: -1,
    shadowScale: 1,
    emissiveBoost: 0,
    phaseSeed: 0,
    extraCount: 0,
    extraStart: 0,
  }));
  private readonly extras: ExtraOverlaySprite[] = Array.from({ length: MAX_SCENE_INSTANCES }, () => ({
    wx: 0,
    wy: 0,
    drawW: 0,
    drawH: 0,
    spriteId: 0,
    swayAmp: 0,
    rotRad: 0,
    pivotY: 0,
    alpha: 1,
    tintFlag: 0,
    emissiveBoost: 0,
    phaseSeed: 0,
  }));

  private topoHead = new Int32Array(MAX_SCENE_INSTANCES);
  private topoTail = new Int32Array(MAX_SCENE_INSTANCES);
  private topoInDeg = new Int32Array(MAX_SCENE_INSTANCES);
  private topoReady = new Int32Array(MAX_SCENE_INSTANCES);
  private topoEmitted = new Uint8Array(MAX_SCENE_INSTANCES);
  private topoEdgeCap = 8192;
  private topoNext = new Int32Array(8192);
  private topoTo = new Int32Array(8192);

  // Pre-allocated light candidate buffer for nearest-light selection
  private readonly lightCandidates: Array<{
    distSq: number;
    wx: number;
    wy: number;
    z: number;
    radius: number;
    r: number;
    g: number;
    b: number;
    intensity: number;
  }> = Array.from({ length: 128 }, () => ({
    distSq: 0,
    wx: 0,
    wy: 0,
    z: 0,
    radius: 0,
    r: 1,
    g: 1,
    b: 1,
    intensity: 1,
  }));

  private ensureEdgeCap(needed: number): void {
    if (needed <= this.topoEdgeCap) return;
    this.topoEdgeCap = Math.max(this.topoEdgeCap * 2, needed);
    const next = new Int32Array(this.topoEdgeCap);
    const to = new Int32Array(this.topoEdgeCap);
    next.set(this.topoNext);
    to.set(this.topoTo);
    this.topoNext = next;
    this.topoTo = to;
  }

  public collect(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    nowMs: number,
    sprites: SpriteIdResolver,
    maxGrassInstances: number,
    maxPointLights: number,
    pointerWorld: { wx: number; wy: number; active: boolean },
    lumosWandEnabled: boolean,
    overlay?: GameplayRenderOverlay
  ): void {
    const viewRot = cam.viewRot ?? 0;
    this.period = sim.getRealTimePeriod();
    const weather = sim.getCurrentWeather(nowMs);
    this.weatherKind = weather.kind;
    const yuleMode = sim.state?.settings?.yuleThemeMode ?? 'auto';
    const yuleActive =
      yuleMode === 'off'
        ? sim.state?.settings?.activeFestival === 'christmas'
        : (typeof sim.isWinterMainMapActive === 'function' && sim.isWinterMainMapActive()) ||
          sim.getActiveFestival() === 'christmas' ||
          (typeof sim.isYuleVisualThemeActive === 'function' && sim.isYuleVisualThemeActive());
    const season = resolveSeasonFromDayCount(sim.state.level ?? 1, yuleActive ? 'winter' : 'auto');
    this.seasonId = season.id;

    if (this.period === 'dawn') {
      this.sunShadowDx = 14;
      this.sunShadowDy = 5.5;
    } else if (this.period === 'dusk') {
      this.sunShadowDx = -15;
      this.sunShadowDy = 6.0;
    } else if (this.period === 'night') {
      this.sunShadowDx = 8;
      this.sunShadowDy = 4.5;
    } else {
      this.sunShadowDx = 9.5;
      this.sunShadowDy = 4.2;
    }

    this.unlockedZonesSet.clear();
    for (const zid of sim.state.unlockedZones) {
      this.unlockedZonesSet.add(zid);
    }

    const staticKey = `${sim.stateRevision}|${viewRot}|${season.id}|${yuleActive ? 1 : 0}|${sim.state.sandboxMode ? 1 : 0}|${maxGrassInstances}`;
    if (this.cachedStaticKey !== staticKey) {
      this.cachedStaticKey = staticKey;
      this.rebuildStaticValleyBuffers(sim, viewRot, yuleActive, season.id, maxGrassInstances);
      this.staticDirtyGeneration++;
    }

    this.collectInteractors(sim, viewRot, pointerWorld);
    this.collectSortedSceneAndLights(
      sim,
      cam,
      viewW,
      viewH,
      nowMs,
      sprites,
      maxPointLights,
      pointerWorld,
      lumosWandEnabled,
      overlay
    );
    this.collectAtmosphericParticles(cam, nowMs);
  }

  private rebuildStaticValleyBuffers(
    sim: ParkSimulation,
    viewRot: 0 | 1 | 2 | 3,
    yuleActive: boolean,
    seasonId: SeasonId,
    maxGrassInstances: number
  ): void {
    let tCount = 0;
    let wCount = 0;
    const grassEligibleTiles: Array<[number, number, number]> = [];

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      const row = sim.grid[gy];
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const c = row[gx];
        const unlocked = sim.state.sandboxMode || this.unlockedZonesSet.has(c.zoneId);
        const { rx0, ry0 } = rotateGridRect(gx, gy, 1, 1, viewRot);
        const elev = c.elevation ?? 0;
        const wx = (rx0 - ry0) * (TILE_W * 0.5);
        const wy = (rx0 + ry0 + 1) * (TILE_H * 0.5) - elev * ELEV_PX;
        const seed = hash2d(gx, gy);

        if (c.terrain === 'water') {
          // Encode neighbor land flags (ry-1, rx+1, ry+1, rx-1 in rotated diamond space) for shoreline SDF foam
          let shoreMask = 0;
          const neighbors: ReadonlyArray<[number, number]> = [
            [gx, gy - 1],
            [gx + 1, gy],
            [gx, gy + 1],
            [gx - 1, gy],
          ];
          for (const [ngx, ngy] of neighbors) {
            if (sim.grid[ngy]?.[ngx]?.terrain !== 'water') {
              const { rx0: nrx, ry0: nry } = rotateGridRect(ngx, ngy, 1, 1, viewRot);
              const drx = nrx - rx0;
              const dry = nry - ry0;
              if (dry === -1) shoreMask |= 1;
              else if (drx === 1) shoreMask |= 2;
              else if (dry === 1) shoreMask |= 4;
              else if (drx === -1) shoreMask |= 8;
            }
          }
          const depthFactor = shoreMask === 0 ? 1.0 : 0.42;

          const wi = wCount * WATER_STRIDE;
          this.waterData[wi] = wx;
          this.waterData[wi + 1] = wy;
          this.waterData[wi + 2] = shoreMask;
          this.waterData[wi + 3] = depthFactor;
          this.waterData[wi + 4] = unlocked ? 1.0 : 0.55;
          this.waterData[wi + 5] = seed;
          wCount++;
          continue;
        }

        let r = 0.36;
        let g = 0.63;
        let b = 0.175;
        let terrainKindCode = 0; // 0 = meadow grass, 1 = forest, 2 = stone plaza, 3 = snow field
        const effectiveTerrain = c.terrain;

        // Zero per-tile random RGB jumps on natural terrain so adjacent isometric diamonds
        // weld with 0.00 seam; all rolling hills, clover beds & snow drifts are Continuous FBM in TERRAIN_FS!
        if (effectiveTerrain === 'snow') {
          r = 0.92;
          g = 0.95;
          b = 0.99;
          terrainKindCode = 3;
        } else if (effectiveTerrain === 'stone') {
          r = 0.82 + (seed - 0.5) * 0.03;
          g = 0.74 + (seed - 0.5) * 0.03;
          b = 0.61 + (seed - 0.5) * 0.025;
          terrainKindCode = 2;
        } else if (effectiveTerrain === 'forest') {
          r = 0.26;
          g = 0.55;
          b = 0.175;
          terrainKindCode = 1;
        } else {
          terrainKindCode = 0;
          if (seasonId === 'autumn') {
            r = 0.42;
            g = 0.63;
            b = 0.165;
          } else {
            // Vibrant sunlit Hang Sóc emerald meadow (#5ea82b -> #84cc36)
            r = 0.365;
            g = 0.655;
            b = 0.168;
          }
        }

        if (!unlocked) {
          r = r * 0.90 + 0.06;
          g = g * 0.91 + 0.06;
          b = b * 0.92 + 0.07;
        }

        let basePathKind = 0;
        if (c.path === 'cobble') basePathKind = 1;
        else if (c.path === 'wood_pier') basePathKind = 2;
        else if (c.path !== 'none') basePathKind = 3;

        let pathCode = 0;
        if (basePathKind > 0) {
          // Encode non-path neighbor edges (1=ry-1, 2=rx+1, 4=ry+1, 8=rx-1) so connected road tiles weld seamlessly!
          let curbMask = 0;
          const roadNeighbors: ReadonlyArray<[number, number]> = [
            [gx, gy - 1],
            [gx + 1, gy],
            [gx, gy + 1],
            [gx - 1, gy],
          ];
          for (const [ngx, ngy] of roadNeighbors) {
            const nc = sim.grid[ngy]?.[ngx];
            if (!nc || nc.path === 'none') {
              const { rx0: nrx, ry0: nry } = rotateGridRect(ngx, ngy, 1, 1, viewRot);
              const drx = nrx - rx0;
              const dry = nry - ry0;
              if (dry === -1) curbMask |= 1;
              else if (drx === 1) curbMask |= 2;
              else if (dry === 1) curbMask |= 4;
              else if (drx === -1) curbMask |= 8;
            }
          }
          pathCode = basePathKind + curbMask * 4;
        }

        const ti = tCount * TERRAIN_STRIDE;
        this.terrainData[ti] = wx;
        this.terrainData[ti + 1] = wy;
        this.terrainData[ti + 2] = r;
        this.terrainData[ti + 3] = g;
        this.terrainData[ti + 4] = b;
        this.terrainData[ti + 5] = pathCode;
        this.terrainData[ti + 6] = elev + (unlocked ? 0 : 10);
        this.terrainData[ti + 7] = terrainKindCode;
        tCount++;

        if (
          unlocked &&
          (c.terrain === 'grass' || c.terrain === 'forest') &&
          c.path === 'none' &&
          !c.buildingUid
        ) {
          grassEligibleTiles.push([wx, wy, seed]);
        }
      }
    }

    this.terrainCount = tCount;
    this.waterCount = wCount;

    // Scatter GPU instanced painterly multi-blade tufts & cozy wildflowers in natural organic clumps
    // (leaving smooth velvety mowed lawn clearings between lush clover/tuft pillows — zero mechanical stubble!)
    const targetGrass = Math.min(MAX_GRASS_CAPACITY, Math.max(0, maxGrassInstances));
    let gCount = 0;
    if (grassEligibleTiles.length > 0 && targetGrass > 0) {
      const maxPerClumpTile = Math.max(2, Math.min(5, Math.ceil((targetGrass * 1.65) / grassEligibleTiles.length)));
      for (let i = 0; i < grassEligibleTiles.length && gCount < targetGrass; i++) {
        const [twx, twy, tSeed] = grassEligibleTiles[i];
        const isoY = twy * 1.9;
        const clumpField =
          Math.sin(twx * 0.017 + isoY * 0.015) +
          Math.cos(twx * 0.026 - isoY * 0.021) +
          0.55 * Math.sin(twx * 0.051 + isoY * 0.043);
        // Open lawn clearings stay clean & velvety; lush patches get grouped multi-blade tufts & daisies
        if (clumpField < -0.05) {
          if (hash2d(i * 19, 311) > 0.90 && gCount < targetGrass) {
            const ox = (hash2d(i * 7, 41) - 0.5) * (TILE_W * 0.45);
            const oy = (hash2d(i * 11, 83) - 1.0) * (TILE_H * 0.45);
            const gi = gCount * GRASS_STRIDE;
            this.grassData[gi] = twx + ox;
            this.grassData[gi + 1] = twy + oy;
            this.grassData[gi + 2] = 6.5 + tSeed * 2.5;
            this.grassData[gi + 3] = tSeed;
            this.grassData[gi + 4] = tSeed * 6.28318;
            this.grassData[gi + 5] = 0.0;
            gCount++;
          }
          continue;
        }

        const densityFrac = Math.min(1, (clumpField + 0.05) / 1.85);
        const tuftCount = Math.max(1, Math.round(1 + densityFrac * (maxPerClumpTile - 1)));
        const anchorU = 0.25 + hash2d(i * 5, 67) * 0.5;
        const anchorV = 0.25 + hash2d(i * 9, 131) * 0.5;
        const patchHasBlooms = clumpField > 0.58 && hash2d(i * 17, 257) > 0.42;

        for (let k = 0; k < tuftCount && gCount < targetGrass; k++) {
          const s1 = hash2d(i * 13 + k * 7, 91);
          const s2 = hash2d(i * 29 + k * 11, 173);
          const u = Math.max(0.08, Math.min(0.92, anchorU + (s1 - 0.5) * 0.58));
          const v = Math.max(0.08, Math.min(0.92, anchorV + (s2 - 0.5) * 0.58));
          const ox = (u - v) * (TILE_W * 0.42);
          const oy = (u + v - 1.0) * (TILE_H * 0.42);
          const isFlower = patchHasBlooms && hash2d(i + k * 31, 409) > 0.56 ? 1.0 : 0.0;
          const gi = gCount * GRASS_STRIDE;
          this.grassData[gi] = twx + ox;
          this.grassData[gi + 1] = twy + oy;
          this.grassData[gi + 2] = (isFlower > 0.5 ? 8.2 : 7.2) + hash2d(i * 3 + k, 53) * 4.4;
          this.grassData[gi + 3] = hash2d(i * 23 + k * 17, 509);
          this.grassData[gi + 4] = (s1 * 6.28318 + s2 * 3.14159) % 6.28318;
          this.grassData[gi + 5] = isFlower;
          gCount++;
        }
      }
    }
    this.grassCount = gCount;
  }

  private collectInteractors(
    sim: ParkSimulation,
    viewRot: 0 | 1 | 2 | 3,
    pointerWorld: { wx: number; wy: number; active: boolean }
  ): void {
    let count = 0;
    if (pointerWorld.active) {
      this.interactorData[0] = pointerWorld.wx;
      this.interactorData[1] = pointerWorld.wy;
      this.interactorData[2] = 66.0;
      this.interactorData[3] = 1.35;
      count = 1;
    }

    for (let i = 0; i < sim.villagers.length && count < MAX_INTERACTOR_SLOTS; i++) {
      const v = sim.villagers[i];
      const vGx = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(v.gx)));
      const vGy = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(v.gy)));
      const elev = sim.grid[vGy]?.[vGx]?.elevation ?? 0;
      const iso = worldIso(v.gx, v.gy, viewRot);
      const base = count * INTERACTOR_STRIDE;
      this.interactorData[base] = iso.wx;
      this.interactorData[base + 1] = iso.wy - elev * ELEV_PX;
      this.interactorData[base + 2] = 34.0;
      this.interactorData[base + 3] = 0.95;
      count++;
    }
    this.interactorCount = count;
  }

  private collectSortedSceneAndLights(
    sim: ParkSimulation,
    cam: Camera,
    viewW: number,
    viewH: number,
    nowMs: number,
    sprites: SpriteIdResolver,
    maxPointLights: number,
    pointerWorld: { wx: number; wy: number; active: boolean },
    lumosWandEnabled: boolean,
    overlay?: GameplayRenderOverlay
  ): void {
    const viewRot = cam.viewRot ?? 0;
    const cutaway = Boolean(sim.state.settings.cutawayMode);
    const reducedMotion =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    const invZoom = 1 / Math.max(0.15, cam.zoom);
    const marginW = (viewW * 0.5 + 380) * invZoom;
    const marginH = (viewH * 0.5 + 420) * invZoom;
    const minWx = cam.x - marginW;
    const maxWx = cam.x + marginW;
    const minWy = cam.y - marginH;
    const maxWy = cam.y + marginH;

    let slotCount = 0;
    let extraCountTotal = 0;
    let rawSkelCount = 0;
    let lightCandCount = 0;
    this.chimneyCount = 0;
    const hasSupplyBrew = Boolean(
      sim.state.supply.activeBrew && sim.state.supply.activeBrew.endsAt > nowMs
    );
    const hoveredBulldozeUid =
      overlay?.bulldozerActive && overlay.hoverTile
        ? (sim.grid[overlay.hoverTile.gy]?.[overlay.hoverTile.gx]?.buildingUid ?? null)
        : null;
    const focus = getCameraFocusGrid(cam);
    const focusIso = worldIso(focus.fgx, focus.fgy, viewRot);

    const pushLightCandidate = (
      wx: number,
      wy: number,
      z: number,
      radius: number,
      r: number,
      g: number,
      b: number,
      intensity: number
    ): void => {
      if (lightCandCount >= this.lightCandidates.length) return;
      const dx = wx - focusIso.wx;
      const dy = wy - focusIso.wy;
      const cand = this.lightCandidates[lightCandCount++];
      cand.distSq = dx * dx + dy * dy;
      cand.wx = wx;
      cand.wy = wy;
      cand.z = z;
      cand.radius = radius;
      cand.r = r;
      cand.g = g;
      cand.b = b;
      cand.intensity = intensity;
    };

      // 1. Scenic River Stone Bridges
    const isNightLike = this.period === 'night' || this.period === 'dusk';
    const bridgeHandle = sprites.resolve('hogsmeade_stone_bridge');
    if (bridgeHandle) {
      for (const [bgx, bgy, cgx, cgy] of SCENIC_RIVER_BRIDGES) {
        const bCell = sim.grid[bgy]?.[bgx];
        if (!bCell || bCell.buildingUid || bCell.terrain !== 'water') continue;
        if (!sim.state.sandboxMode && !this.unlockedZonesSet.has(bCell.zoneId)) continue;
        const iso = worldIso(cgx, cgy, viewRot);
        const wy = iso.wy - bCell.elevation * ELEV_PX + 12;
        if (iso.wx < minWx || iso.wx > maxWx || wy < minWy || wy > maxWy) continue;
        if (slotCount >= MAX_SCENE_INSTANCES) break;
        const { rx0, ry0, rbw, rbh } = rotateGridRect(bgx - 1, bgy, 3, 1, viewRot);
        const drawW = 148;
        const drawH = drawW * (bridgeHandle.height / bridgeHandle.width);
        const s = this.slots[slotCount++];
        s.rxMin = rx0 + 0.05;
        s.ryMin = ry0 + 0.05;
        s.rxMax = rx0 + rbw - 0.05;
        s.ryMax = ry0 + rbh - 0.05;
        s.depth = rx0 + rbw + ry0 + rbh - 0.12;
        s.wx = iso.wx;
        s.wy = wy;
        s.drawW = drawW;
        s.drawH = drawH;
        s.spriteId = bridgeHandle.id;
        s.swayAmp = 0;
        s.rotRad = 0;
        s.pivotY = 0;
        s.alpha = 1;
        s.tintFlag = 0;
        s.skeletalPoseIdx = -1;
        s.shadowScale = 0.85;
        s.emissiveBoost = 0.35;
        s.phaseSeed = bgx * 0.7 + bgy;
        s.extraCount = 0;
        s.extraStart = 0;

        // Warm bridge lantern reflecting into River Ottery at dusk/night!
        if (isNightLike) {
          pushLightCandidate(iso.wx, wy - 14, 30, 155, 1.0, 0.76, 0.30, 1.25);
        }
      }
    }

    // 2. Placed Buildings, Connected Farmland, Mature Crop Clusters & Kinetic Rotors
    const buildingByUid = new Map<string, PlacedBuilding>();
    for (let i = 0; i < sim.state.buildings.length; i++) {
      const b = sim.state.buildings[i];
      buildingByUid.set(b.uid, b);
    }

    let ghostConnRect: {
      gx: number;
      gy: number;
      bw: number;
      bh: number;
      elev: number;
      group: ConnectablePlotGroup;
    } | null = null;
    if (overlay?.hoverTile && !overlay.bulldozerActive) {
      const movingB = overlay.movingBuildingUid
        ? buildingByUid.get(overlay.movingBuildingUid)
        : undefined;
      const gItem =
        overlay.selectedCatalogItem ?? (movingB ? getCatalogItem(movingB.itemId) : undefined);
      if (gItem?.connectableGroup) {
        const gRot = overlay.rotation ?? 0;
        if (
          sim.canPlaceItem(
            gItem,
            overlay.hoverTile.gx,
            overlay.hoverTile.gy,
            gRot,
            overlay.movingBuildingUid ?? undefined
          ).ok
        ) {
          const { bw: gbw, bh: gbh } = sim.getBuildingFootprint(gItem, gRot);
          ghostConnRect = {
            gx: overlay.hoverTile.gx,
            gy: overlay.hoverTile.gy,
            bw: gbw,
            bh: gbh,
            elev: sim.grid[overlay.hoverTile.gy]?.[overlay.hoverTile.gx]?.elevation ?? 0,
            group: gItem.connectableGroup,
          };
        }
      }
    }

    const computeConnMask = (
      gx: number,
      gy: number,
      bw: number,
      bh: number,
      elev: number,
      group: ConnectablePlotGroup
    ): number => {
      const { rx0: crx0, ry0: cry0 } = rotateGridRect(gx, gy, bw, bh, viewRot);
      const isSameGroupAtRot = (rx: number, ry: number): boolean => {
        const { gx: wx, gy: wy } = rotTileToWorldTile(rx, ry, viewRot);
        if (wx < 0 || wy < 0 || wx >= GRID_SIZE || wy >= GRID_SIZE) return false;
        if (
          ghostConnRect &&
          ghostConnRect.group === group &&
          ghostConnRect.elev === elev &&
          wx >= ghostConnRect.gx &&
          wx < ghostConnRect.gx + ghostConnRect.bw &&
          wy >= ghostConnRect.gy &&
          wy < ghostConnRect.gy + ghostConnRect.bh
        ) {
          return true;
        }
        const cell = sim.grid[wy]?.[wx];
        if (!cell || !cell.buildingUid || cell.buildingUid === overlay?.movingBuildingUid) {
          return false;
        }
        if ((cell.elevation ?? 0) !== elev) return false;
        const nb = buildingByUid.get(cell.buildingUid);
        if (!nb || nowMs < nb.constructEndsAt) return false;
        return getCatalogItem(nb.itemId)?.connectableGroup === group;
      };

      let mask = 0;
      if (isSameGroupAtRot(crx0 - 1, cry0)) mask |= 1 << 0;
      if (isSameGroupAtRot(crx0 - 1, cry0 + 1)) mask |= 1 << 1;
      if (isSameGroupAtRot(crx0, cry0 - 1)) mask |= 1 << 2;
      if (isSameGroupAtRot(crx0 + 1, cry0 - 1)) mask |= 1 << 3;
      if (isSameGroupAtRot(crx0 + 2, cry0)) mask |= 1 << 4;
      if (isSameGroupAtRot(crx0 + 2, cry0 + 1)) mask |= 1 << 5;
      if (isSameGroupAtRot(crx0, cry0 + 2)) mask |= 1 << 6;
      if (isSameGroupAtRot(crx0 + 1, cry0 + 2)) mask |= 1 << 7;
      if (isSameGroupAtRot(crx0 - 1, cry0 - 1)) mask |= 1 << 8;
      if (isSameGroupAtRot(crx0 + 2, cry0 - 1)) mask |= 1 << 9;
      if (isSameGroupAtRot(crx0 + 2, cry0 + 2)) mask |= 1 << 10;
      if (isSameGroupAtRot(crx0 - 1, cry0 + 2)) mask |= 1 << 11;
      return mask;
    };

    for (let i = 0; i < sim.state.buildings.length && slotCount < MAX_SCENE_INSTANCES; i++) {
      const b = sim.state.buildings[i];
      const item = getCatalogItem(b.itemId);
      if (!item) continue;

      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const { rx0, ry0, rbw, rbh } = rotateGridRect(b.gx, b.gy, bw, bh, viewRot);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;

      const worldCx = ((rx0 - ry0) + (rbw - rbh) * 0.5) * (TILE_W * 0.5);
      const worldBottomY = (rx0 + rbw + ry0 + rbh) * (TILE_H * 0.5) - elev * ELEV_PX;
      if (worldCx < minWx || worldCx > maxWx || worldBottomY < minWy || worldBottomY > maxWy) {
        continue;
      }

      const underConstruction = nowMs < b.constructEndsAt;
      let activeKey = underConstruction
        ? 'prop_construction_site'
        : resolveCatalogPropSpriteKey(item.id, item.spriteKey);
      let plotGrowRatio = 0;

      if (!underConstruction && item.isFarmlandPlot) {
        if (!b.cropId) {
          activeKey = 'crop_plot_tilled';
        } else {
          const plantedAt = b.cropPlantedAt ?? nowMs - 10_000;
          const readyAt = b.cropReadyAt ?? nowMs;
          const totalMs = Math.max(1000, readyAt - plantedAt);
          plotGrowRatio = nowMs >= readyAt ? 1 : Math.max(0, Math.min(0.99, (nowMs - plantedAt) / totalMs));
          activeKey = plotGrowRatio >= 0.25 && plotGrowRatio < 0.66 ? 'crop_plot_sprouts' : 'crop_plot_tilled';
        }
      }

      if (!activeKey) continue;
      const isConnectable = Boolean(item.connectableGroup);
      const plotConnMask =
        !underConstruction && item.connectableGroup
          ? computeConnMask(b.gx, b.gy, bw, bh, elev, item.connectableGroup)
          : 0;
      const spHandle =
        (plotConnMask > 0 ? sprites.resolve(`conn:${activeKey}:${plotConnMask}`) : undefined) ??
        sprites.resolve(activeKey);
      if (!spHandle) continue;

      const isNonSquare = item.width !== item.height;
      const scaleMult = underConstruction ? 1.04 : getHarmonizedSpriteScale(item);
      const footprintW = (bw + bh) * (TILE_W * 0.5);
      const drawW = footprintW * scaleMult;
      const drawH = drawW * (spHandle.height / spHandle.width);
      const wsKin = computeWorkshopKineticState(item, b, nowMs, reducedMotion, hasSupplyBrew);

      const rotTotal = (b.rotation + viewRot) % 4;
      const flipX = isConnectable
        ? false
        : isNonSquare
          ? (rotTotal & 1) === 1
          : rotTotal === 1 || rotTotal === 2;

      const isFoliage = Boolean(activeKey.startsWith('env_')) && activeKey !== 'env_mossy_rock';
      const isTallForCutaway = cutaway && !isConnectable && (bw >= 2 || bh >= 2 || drawH > 95);

      const isBeingMoved = overlay?.movingBuildingUid === b.uid;
      const buildingTint: SceneTintFlag =
        hoveredBulldozeUid === b.uid
          ? 4
          : overlay?.selectedBuildingUid === b.uid
            ? 3
            : 0;

      const s = this.slots[slotCount++];
      s.rxMin = rx0 + 0.04;
      s.ryMin = ry0 + 0.04;
      s.rxMax = rx0 + rbw - 0.04;
      s.ryMax = ry0 + rbh - 0.04;
      s.depth = rx0 + rbw + ry0 + rbh - 0.05;
      s.wx = worldCx;
      s.wy = worldBottomY + 4.0;
      const effDrawW = drawW * wsKin.scaleX;
      const effDrawH = drawH * wsKin.scaleY;
      s.drawW = flipX ? -effDrawW : effDrawW;
      s.drawH = effDrawH;
      s.spriteId = spHandle.id;
      s.swayAmp = isFoliage ? 3.8 : item.category === 'creature' ? 1.4 : 0.0;
      s.rotRad = 0;
      s.pivotY = 0;
      s.alpha = isBeingMoved ? 0.35 : isTallForCutaway ? 0.3 : 1.0;
      s.tintFlag = buildingTint;
      s.skeletalPoseIdx = -1;
      const yuleLight = resolveYuleMagicalLightProfile(item.id);
      s.shadowScale = isConnectable ? 0.0 : 1.0;
      s.emissiveBoost =
        (item.isFlooPortal
          ? 1.35
          : yuleLight
            ? yuleLight.emissiveBoost
            : isConnectable
              ? 0.0
              : 0.85) + wsKin.furnaceGlowBoost;
      s.phaseSeed = b.gx * 1.7 + b.gy * 2.3;
      s.extraStart = extraCountTotal;
      s.extraCount = 0;

      if (!underConstruction && wsKin.smokeIntensity > 0 && this.chimneyCount < 12) {
        const cb = this.chimneyCount * 3;
        this.chimneyEmitters[cb] = worldCx + drawW * 0.14;
        this.chimneyEmitters[cb + 1] = worldBottomY - drawH * 0.82;
        this.chimneyEmitters[cb + 2] = s.phaseSeed;
        this.chimneyCount++;
      }

      // Enchanted Construction Hammer Overlay
      if (underConstruction) {
        const scaffHandle = sprites.resolve('ui_icon_hammer_wand');
        if (scaffHandle && extraCountTotal < this.extras.length) {
          const ex = this.extras[extraCountTotal++];
          const hammerSize = Math.min(36, Math.max(22, drawW * 0.28));
          ex.wx = worldCx + drawW * 0.2;
          ex.wy = worldBottomY - drawH * 0.62 + Math.sin(nowMs * 0.006 + s.phaseSeed) * 3;
          ex.drawW = hammerSize;
          ex.drawH = hammerSize * (scaffHandle.height / scaffHandle.width);
          ex.spriteId = scaffHandle.id;
          ex.swayAmp = 0;
          ex.rotRad = Math.sin(nowMs * 0.008 + b.gx) * 0.24;
          ex.pivotY = 0.5;
          ex.alpha = 0.95;
          ex.tintFlag = 0;
          ex.emissiveBoost = 0.85;
          ex.phaseSeed = s.phaseSeed;
          s.extraCount++;
        }
      } else if (b.awaitingUnveil) {
        // Bouncing Grand Ribbon Unveil Overlay!
        const ribHandle = sprites.resolve('prop_ribbon_unveil');
        if (ribHandle && extraCountTotal < this.extras.length) {
          const ex = this.extras[extraCountTotal++];
          const bob = Math.sin(nowMs * 0.005 + s.phaseSeed) * 4.5;
          const ribSize = Math.min(54, Math.max(32, drawW * 0.42));
          ex.wx = worldCx;
          ex.wy = worldBottomY - drawH * 0.55 + bob;
          ex.drawW = ribSize;
          ex.drawH = ribSize * (ribHandle.height / ribHandle.width);
          ex.spriteId = ribHandle.id;
          ex.swayAmp = 0;
          ex.rotRad = Math.sin(nowMs * 0.0035) * 0.06;
          ex.pivotY = 0.5;
          ex.alpha = 1.0;
          ex.tintFlag = 0;
          ex.emissiveBoost = 1.15;
          ex.phaseSeed = s.phaseSeed;
          s.extraCount++;
        }
      }

      // Attach spinning windmill sails / waterwheel rotor & active workshop crafting emblem
      if (!underConstruction && item.id === 'burrow_windmill_canon') {
        const sailHandle = sprites.resolve('prop_windmill_sails');
        if (sailHandle && extraCountTotal < this.extras.length) {
          const ex = this.extras[extraCountTotal++];
          const sailSize = drawW * 0.78;
          ex.wx = worldCx - drawW * 0.06;
          ex.wy = worldBottomY + 4.0 - drawH * 0.67;
          ex.drawW = sailSize;
          ex.drawH = sailSize;
          ex.spriteId = sailHandle.id;
          ex.swayAmp = 0;
          ex.rotRad = reducedMotion ? 0.38 : (nowMs * 0.0013 + wsKin.extraRotorRad) % 6.28318;
          ex.pivotY = 0.5;
          ex.alpha = s.alpha;
          ex.tintFlag = buildingTint;
          ex.emissiveBoost = 0.1;
          ex.phaseSeed = s.phaseSeed;
          s.extraCount++;
        }
      } else if (!underConstruction && item.id === 'burrow_reed_pond_mill') {
        const wheelHandle = sprites.resolve('prop_waterwheel_rotor');
        if (wheelHandle && extraCountTotal < this.extras.length) {
          const ex = this.extras[extraCountTotal++];
          const wheelSize = drawW * 0.44;
          ex.wx = worldCx + drawW * 0.18;
          ex.wy = worldBottomY + 4.0 - drawH * 0.34;
          ex.drawW = wheelSize;
          ex.drawH = wheelSize;
          ex.spriteId = wheelHandle.id;
          ex.swayAmp = 0;
          ex.rotRad = reducedMotion ? 0.2 : (nowMs * 0.0018 + wsKin.extraRotorRad) % 6.28318;
          ex.pivotY = 0.5;
          ex.alpha = s.alpha;
          ex.tintFlag = buildingTint;
          ex.emissiveBoost = 0.05;
          ex.phaseSeed = s.phaseSeed;
          s.extraCount++;
        }
      }

      // Floating subtle crafting-good badge above actively baking/milling workshops when ready shelf is empty
      if (
        !underConstruction &&
        wsKin.isActive &&
        wsKin.activeGoodIconKey &&
        !(b.readyFarmGoods && b.readyFarmGoods.length > 0) &&
        !(b.readyBubbles && b.readyBubbles > 0) &&
        extraCountTotal < this.extras.length
      ) {
        const goodHandle = sprites.resolve(wsKin.activeGoodIconKey);
        if (goodHandle) {
          const ex = this.extras[extraCountTotal++];
          const gBob = reducedMotion ? 0 : Math.sin(nowMs * 0.0052 + s.phaseSeed) * 2.8;
          const gSize = Math.min(26, Math.max(18, drawW * 0.2));
          ex.wx = worldCx;
          ex.wy = worldBottomY - Math.max(30, drawH * 0.72) + gBob;
          ex.drawW = gSize;
          ex.drawH = gSize * (goodHandle.height / goodHandle.width);
          ex.spriteId = goodHandle.id;
          ex.swayAmp = 0;
          ex.rotRad = 0;
          ex.pivotY = 0.5;
          ex.alpha = 0.9 * s.alpha;
          ex.tintFlag = 0;
          ex.emissiveBoost = 0.65;
          ex.phaseSeed = s.phaseSeed;
          s.extraCount++;
        }
      }

      // Attach swaying 2.5D crop icons on growing/ready farmland plots
      if (!underConstruction && item.isFarmlandPlot && b.cropId && plotGrowRatio >= 0.45) {
        const cropMeta = FARM_CROPS[b.cropId];
        const cropHandle = cropMeta ? sprites.resolve(cropMeta.iconKey) : undefined;
        if (cropHandle) {
          const growthScale = plotGrowRatio >= 1 ? 1.0 : 0.68 + plotGrowRatio * 0.32;
          const offsets: ReadonlyArray<[number, number]> = [
            [-11, -13],
            [11, -13],
            [0, -6],
          ];
          for (let cIdx = 0; cIdx < offsets.length && extraCountTotal < this.extras.length; cIdx++) {
            const ex = this.extras[extraCountTotal++];
            const cSize = 23 * growthScale;
            ex.wx = worldCx + offsets[cIdx][0];
            ex.wy = worldBottomY + offsets[cIdx][1];
            ex.drawW = cSize;
            ex.drawH = cSize * (cropHandle.height / cropHandle.width);
            ex.spriteId = cropHandle.id;
            ex.swayAmp = 2.6;
            ex.rotRad = 0;
            ex.pivotY = 0;
            ex.alpha = 1.0;
            ex.tintFlag = 0;
            ex.emissiveBoost = cropMeta?.nocturnalGlowColor ? 1.15 : 0.08;
            ex.phaseSeed = s.phaseSeed + cIdx * 1.9;
            s.extraCount++;
          }
        }
      }

      // Attach live roaming 2-frame livestock & magical beasts inside Connectable Animal Pastures (`burrow_animal_pasture`)!
      if (!underConstruction && item.isAnimalPasturePlot && b.pastureAnimalId) {
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
              ? 48
              : b.pastureAnimalId === 'ottery_sheep'
                ? 44
                : 38;
          const tickApprox = Math.floor(nowMs / 16.67);
          const baseBottomY = worldBottomY + 4.0;
          const pastureRipe = Boolean(b.pastureReadyAt && nowMs >= b.pastureReadyAt);
          const isNightDoze = this.period === 'night' && !pastureRipe;
          const roamSpeedMult = isNightDoze ? 0.25 : 1.0;

          for (let idx = 0; idx < 2 && extraCountTotal < this.extras.length; idx++) {
            const useAction =
              !reducedMotion &&
              !isNightDoze &&
              Math.floor((tickApprox + b.gx * 11 + b.gy * 17 + idx * 29) / 42) % 2 === 1;
            const spKey = animalMeta.spritePair[useAction ? 1 : 0];
            const animalHandle =
              sprites.resolve(spKey) ?? sprites.resolve(animalMeta.spritePair[0]);
            if (!animalHandle) continue;

            const phase =
              nowMs * (idx === 0 ? 0.00144 : 0.00114) * roamSpeedMult +
              b.gx * 1.9 +
              b.gy * 1.3 +
              idx * 2.6;
            const ax =
              worldCx + Math.sin(phase) * spanX + (idx === 0 ? -drawW * 0.06 : drawW * 0.09);
            const hop =
              reducedMotion || isNightDoze
                ? 0
                : Math.abs(Math.sin(nowMs * 0.0066 + idx * 1.7 + b.gx)) * 2.4;
            const dozeBreath =
              !reducedMotion && isNightDoze
                ? Math.sin(nowMs * 0.0016 + b.gx * 1.3 + idx * 2.1) * 0.022
                : 0;
            const ay =
              baseBottomY -
              drawH * (idx === 0 ? 0.44 : 0.32) +
              Math.cos(phase * 0.85) * spanY -
              hop;
            const szScale = idx === 0 ? 1.0 : 0.82;
            const bwPx = baseScale * szScale * (1 - dozeBreath * 0.7);
            const bhPx = baseScale * szScale * (animalHandle.height / animalHandle.width) * (1 + dozeBreath);
            const facingLeft = Math.cos(phase) < 0;

            const ex = this.extras[extraCountTotal++];
            ex.wx = ax;
            ex.wy = ay;
            ex.drawW = facingLeft ? -bwPx : bwPx;
            ex.drawH = bhPx;
            ex.spriteId = animalHandle.id;
            ex.swayAmp = 0;
            ex.rotRad = 0;
            ex.pivotY = 0;
            ex.alpha = 1.0;
            ex.tintFlag = 0;
            ex.emissiveBoost = b.pastureAnimalId === 'moon_unicorn' ? 0.55 : 0.10;
            ex.phaseSeed = s.phaseSeed + idx * 1.7;
            s.extraCount++;
          }
        }
      }

      // Attach roaming 2-frame Magical Beasts inside Creature Sanctuaries (`hippogriff_glade`, `unicorn_glade`, etc.) & Lake Boats!
      if (!underConstruction && item.isCreatureHabitat && !item.isRuralFarmstead && !b.isEscaped) {
        const beastPair: [string, string] | null =
          item.id === 'hippogriff_glade'
            ? ['beast_hippogriff', 'beast_hippogriff_bow']
            : item.id === 'thestral_grove'
              ? ['beast_thestral', 'beast_thestral_wings']
              : item.id === 'unicorn_glade'
                ? ['beast_unicorn', 'beast_unicorn_prance']
                : item.id === 'phoenix_perch'
                  ? ['beast_phoenix', 'beast_phoenix_soar']
                  : item.id === 'dragon_lair'
                    ? ['beast_dragon', 'beast_dragon_roar']
                    : item.id === 'hagrid_bowtruckle'
                      ? null
                      : ['beast_niffler', 'beast_niffler_play'];
        if (beastPair && extraCountTotal < this.extras.length) {
          const tickApprox = Math.floor(nowMs / 16.67);
          const usePose = Math.floor((tickApprox + b.gx * 13 + b.gy * 7) / 48) % 2 === 1;
          const beastHandle =
            sprites.resolve(beastPair[usePose ? 1 : 0]) ?? sprites.resolve(beastPair[0]);
          if (beastHandle) {
            const stageScale =
              b.creatureStage === 'baby' ? 0.58 : b.creatureStage === 'legendary' ? 1.05 : 0.84;
            const phase = nowMs * 0.00192 + b.gx * 2.1 + b.gy;
            const roamX = worldCx + Math.sin(phase) * drawW * 0.22;
            const hopY = Math.abs(Math.sin(nowMs * 0.0072 + b.gx)) * 3.5;
            const baseBottomY = worldBottomY + 4.0;
            const roamY = baseBottomY - drawH * 0.22 - hopY;
            const bwPx = 38 * stageScale;
            const bhPx = bwPx * (beastHandle.height / beastHandle.width);
            const ex = this.extras[extraCountTotal++];
            ex.wx = roamX;
            ex.wy = roamY;
            ex.drawW = Math.cos(phase) < 0 ? -bwPx : bwPx;
            ex.drawH = bhPx;
            ex.spriteId = beastHandle.id;
            ex.swayAmp = 0;
            ex.rotRad = 0;
            ex.pivotY = 0;
            ex.alpha = 1.0;
            ex.tintFlag = 0;
            ex.emissiveBoost =
              b.creatureMorph === 'radiant' || b.creatureMorph === 'mystic' ? 0.85 : 0.14;
            ex.phaseSeed = s.phaseSeed;
            s.extraCount++;

            if (b.hasBabyOffspring && extraCountTotal < this.extras.length) {
              const babyPhase = phase - 0.9;
              const babyW = 22;
              const babyH = babyW * (beastHandle.height / beastHandle.width);
              const babyEx = this.extras[extraCountTotal++];
              babyEx.wx = worldCx + Math.sin(babyPhase) * drawW * 0.2;
              babyEx.wy = baseBottomY - drawH * 0.16 - Math.abs(Math.cos(nowMs * 0.0096)) * 3.0;
              babyEx.drawW = Math.cos(babyPhase) < 0 ? -babyW : babyW;
              babyEx.drawH = babyH;
              babyEx.spriteId = beastHandle.id;
              babyEx.swayAmp = 0;
              babyEx.rotRad = 0;
              babyEx.pivotY = 0;
              babyEx.alpha = 1.0;
              babyEx.tintFlag = 0;
              babyEx.emissiveBoost = 0.14;
              babyEx.phaseSeed = s.phaseSeed + 2.3;
              s.extraCount++;
            }
          }
        }
      } else if (!underConstruction && item.id === 'black_lake_boats') {
        const boatHandle = sprites.resolve('vehicle_lake_boat');
        if (boatHandle) {
          const baseBottomY = worldBottomY + 4.0;
          for (let i = 0; i < 2 && extraCountTotal < this.extras.length; i++) {
            const a = nowMs * 0.0015 + i * Math.PI;
            const w = 36;
            const h = w * (boatHandle.height / boatHandle.width);
            const ex = this.extras[extraCountTotal++];
            ex.wx = worldCx + Math.cos(a) * drawW * 0.34;
            ex.wy = baseBottomY - drawH * 0.16 + Math.sin(a) * drawH * 0.11 + h * 0.25;
            ex.drawW = -Math.sin(a) < 0 ? -w : w;
            ex.drawH = h;
            ex.spriteId = boatHandle.id;
            ex.swayAmp = 0;
            ex.rotRad = 0;
            ex.pivotY = 0;
            ex.alpha = 1.0;
            ex.tintFlag = 0;
            ex.emissiveBoost = 0.25;
            ex.phaseSeed = s.phaseSeed + i;
            s.extraCount++;
          }
        }
      }

      // Ready-to-harvest floating icon (skipped when crisp screen-space `renderWorldUiOverlays` draws glass bubbles)
      if (
        !overlay?.skipReadyBubbleSprites &&
        !underConstruction &&
        !b.awaitingUnveil &&
        extraCountTotal < this.extras.length
      ) {
        let readyIconKey: string | undefined;
        if (item.isFarmlandPlot && b.cropId && plotGrowRatio >= 1) {
          readyIconKey = FARM_CROPS[b.cropId]?.iconKey;
        } else if (
          item.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          nowMs >= b.pastureReadyAt
        ) {
          readyIconKey = PASTURE_ANIMALS[b.pastureAnimalId]?.iconKey;
        } else if ((b.readyFarmGoods?.length ?? 0) > 0 || (b.readyBubbles ?? 0) > 0) {
          readyIconKey = 'ui_icon_golden_sickle';
        }
        const readyHandle = readyIconKey ? sprites.resolve(readyIconKey) : undefined;
        if (readyHandle) {
          const ex = this.extras[extraCountTotal++];
          const bob = Math.sin(nowMs * 0.0046 + s.phaseSeed) * 3.8;
          ex.wx = worldCx;
          ex.wy = worldBottomY - Math.max(34, drawH * 0.78) + bob;
          ex.drawW = 24;
          ex.drawH = 24 * (readyHandle.height / readyHandle.width);
          ex.spriteId = readyHandle.id;
          ex.swayAmp = 0;
          ex.rotRad = 0;
          ex.pivotY = 0.5;
          ex.alpha = 0.98;
          ex.tintFlag = 0;
          ex.emissiveBoost = 1.18;
          ex.phaseSeed = s.phaseSeed;
          s.extraCount++;
        }
      }

      // Emit dynamic 2.5D point lights for portals, cottages, workshops & bioluminescent crops
      if (!underConstruction) {
        if (item.isFlooPortal) {
          const flicker = 0.92 + Math.sin(nowMs * 0.006 + b.gx) * 0.12;
          pushLightCandidate(
            worldCx,
            worldBottomY - 8,
            34,
            195,
            0.16,
            0.96,
            0.64,
            (isNightLike ? 1.65 : 0.95) * flicker
          );
        } else if (item.isFarmlandPlot && b.cropId) {
          const glowCss = FARM_CROPS[b.cropId]?.nocturnalGlowColor;
          if (glowCss) {
            const [lr, lg, lb] = parseRgbaRgb(glowCss, [0.35, 0.82, 0.98]);
            pushLightCandidate(
              worldCx,
              worldBottomY - 10,
              20,
              96,
              lr,
              lg,
              lb,
              isNightLike ? 1.15 : 0.45
            );
          }
        } else if (yuleLight) {
          const isSnowOrWinter = this.weatherKind === 'snow' || this.seasonId === 'winter';
          if (isNightLike || (yuleLight.activeInDaySnow && isSnowOrWinter)) {
            const flicker = 0.94 + Math.sin(nowMs * 0.0052 + b.gx * 1.9 + b.gy * 1.3) * 0.06;
            const dayAtten = isNightLike ? 1.0 : 0.38;
            pushLightCandidate(
              worldCx,
              worldBottomY - (yuleLight.secondaryLakePool ? 24 : 12),
              yuleLight.secondaryLakePool ? 52 : 36,
              yuleLight.radius,
              yuleLight.rgb[0],
              yuleLight.rgb[1],
              yuleLight.rgb[2],
              yuleLight.intensity * dayAtten * flicker
            );
            if (isNightLike && yuleLight.secondaryLakePool) {
              // Phản chiếu mặt băng Hồ Đen xanh lam dưới chân Lâu Đài Hogwarts Thu Nhỏ
              pushLightCandidate(
                worldCx + 18,
                worldBottomY - 4,
                22,
                135,
                0.30,
                0.78,
                1.0,
                0.98 * flicker
              );
            }
          }
        } else if (bw >= 2 || bh >= 2 || item.category === 'shop' || item.category === 'decor') {
          const isWarmHearth =
            item.id === 'burrow_house_canon' ||
            item.id === 'molly_apple_bakery' ||
            item.id === 'burrow_broomsticks_canon' ||
            item.id === 'burrow_honeydukes_canon' ||
            item.id === 'burrow_feast_marquee';
          if (isNightLike) {
            const flicker = 0.95 + Math.sin(nowMs * 0.0045 + b.gx * 2.1) * 0.06;
            pushLightCandidate(
              worldCx,
              worldBottomY - (item.id === 'burrow_house_canon' ? 26 : 14),
              item.id === 'burrow_house_canon' ? 56 : 42,
              isWarmHearth ? 200 : 140,
              1.0,
              0.72,
              0.26,
              (isWarmHearth ? 1.35 : 0.85) * flicker
            );
            if (item.id === 'burrow_house_canon') {
              // Signature emerald Floo hearth spill at the foot of Hang Sóc
              pushLightCandidate(
                worldCx - 16,
                worldBottomY - 6,
                28,
                130,
                0.14,
                0.95,
                0.52,
                1.15 * (0.92 + Math.sin(nowMs * 0.0068) * 0.08)
              );
            }
          } else if (wsKin.isActive) {
            const furnaceFlicker = 0.9 + Math.sin(nowMs * 0.009 + b.gx * 1.7) * 0.1;
            pushLightCandidate(
              worldCx,
              worldBottomY - 12,
              36,
              150,
              1.0,
              0.68,
              0.24,
              0.75 * furnaceFlicker
            );
          }
        }
      }
    }

    // 3. Open-Valley Riverside Flora & Winter Christmas Welcome Landmarks
    const isWinterScene = this.seasonId === 'winter';
    const activeFloraSpots = isWinterScene ? WINTER_VALLEY_CHRISTMAS_SPOTS : VALLEY_FLORA_SPOTS;
    for (const [fgx, fgy, spriteKey, scale, flipX] of activeFloraSpots) {
      if (slotCount >= MAX_SCENE_INSTANCES) break;
      const fCell = sim.grid[fgy]?.[fgx];
      if (!fCell || fCell.buildingUid || fCell.path !== 'none' || fCell.terrain !== 'grass') continue;
      if (!sim.state.sandboxMode && !this.unlockedZonesSet.has(fCell.zoneId)) continue;
      if (
        scale >= 1.4 &&
        (sim.grid[fgy - 1]?.[fgx]?.buildingUid ||
          sim.grid[fgy + 1]?.[fgx]?.buildingUid ||
          sim.grid[fgy]?.[fgx - 1]?.buildingUid ||
          sim.grid[fgy]?.[fgx + 1]?.buildingUid)
      ) {
        continue;
      }
      const iso = worldIso(fgx + 0.5, fgy + 0.5, viewRot);
      const wy = iso.wy - fCell.elevation * ELEV_PX;
      if (iso.wx < minWx || iso.wx > maxWx || wy < minWy || wy > maxWy) continue;
      const h = sprites.resolve(spriteKey);
      if (!h) continue;
      const { rx, ry } = rotateGridPoint(fgx + 0.5, fgy + 0.5, viewRot);
      const isGroundCover =
        spriteKey === 'env_flower_patch' ||
        spriteKey === 'env_bush_flowers' ||
        spriteKey === 'env_mossy_rock' ||
        spriteKey === 'yule_holly_hedgerow' ||
        spriteKey === 'yule_snowdrop_moss_log' ||
        spriteKey === 'yule_edelweiss_alpine_rockery' ||
        spriteKey === 'yule_puffskein_snowballs';
      const baseW = (isGroundCover ? 36 : 58) * scale;
      const drawH = baseW * (h.height / h.width);
      const yuleLandmarkLight = resolveYuleMagicalLightProfile(spriteKey);
      const s = this.slots[slotCount++];
      s.rxMin = rx - 0.22;
      s.ryMin = ry - 0.22;
      s.rxMax = rx + 0.22;
      s.ryMax = ry + 0.22;
      s.depth = rx + ry + 0.28;
      s.wx = iso.wx;
      s.wy = wy;
      s.drawW = flipX ? -baseW : baseW;
      s.drawH = drawH;
      s.spriteId = h.id;
      s.swayAmp = spriteKey === 'env_mossy_rock' || spriteKey.startsWith('yule_') ? 0 : 2.8;
      s.rotRad = 0;
      s.pivotY = 0;
      s.alpha = 1;
      s.tintFlag = 0;
      s.skeletalPoseIdx = -1;
      s.shadowScale = 0.72;
      s.emissiveBoost = yuleLandmarkLight ? yuleLandmarkLight.emissiveBoost : 0;
      s.phaseSeed = fgx * 1.3 + fgy * 0.9;
      s.extraCount = 0;
      s.extraStart = 0;

      if (yuleLandmarkLight && (isNightLike || yuleLandmarkLight.activeInDaySnow)) {
        pushLightCandidate(
          iso.wx,
          wy - 12,
          36,
          yuleLandmarkLight.radius * 0.82,
          yuleLandmarkLight.rgb[0],
          yuleLandmarkLight.rgb[1],
          yuleLandmarkLight.rgb[2],
          yuleLandmarkLight.intensity * (isNightLike ? 0.58 : 0.24)
        );
      }
    }

    // 3b. Build-Mode / Move-Mode Ghost Preview (Valid Emerald = tintFlag 1, Invalid Crimson = tintFlag 2)
    if (overlay?.hoverTile && slotCount < MAX_SCENE_INSTANCES) {
      const movingBuilding = overlay.movingBuildingUid
        ? sim.state.buildings.find((x) => x.uid === overlay.movingBuildingUid)
        : undefined;
      const ghostItem =
        overlay.selectedCatalogItem ??
        (movingBuilding ? getCatalogItem(movingBuilding.itemId) : undefined);
      const ghostKey = ghostItem
        ? resolveCatalogPropSpriteKey(ghostItem.id, ghostItem.spriteKey)
        : undefined;
      if (ghostItem && ghostKey) {
        const gRot = overlay.rotation ?? 0;
        const gHandle = sprites.resolve(ghostKey);
        if (gHandle) {
          const { gx, gy } = overlay.hoverTile;
          const { bw, bh } = sim.getBuildingFootprint(ghostItem, gRot);
          const { rx0, ry0, rbw, rbh } = rotateGridRect(gx, gy, bw, bh, viewRot);
          const elev = sim.grid[gy]?.[gx]?.elevation ?? 0;
          const worldCx = ((rx0 - ry0) + (rbw - rbh) * 0.5) * (TILE_W * 0.5);
          const worldBottomY = (rx0 + rbw + ry0 + rbh) * (TILE_H * 0.5) - elev * ELEV_PX;
          const isNonSquare = ghostItem.width !== ghostItem.height;
          const isConnectable = Boolean(ghostItem.connectableGroup);
          const scaleMult = ghostItem.spriteScale ?? (isNonSquare ? 1.0 : 1.05);
          const drawW = (bw + bh) * (TILE_W * 0.5) * scaleMult;
          const drawH = drawW * (gHandle.height / gHandle.width);
          const rotTotal = (gRot + viewRot) % 4;
          const flipX = isConnectable
            ? false
            : isNonSquare
              ? (rotTotal & 1) === 1
              : rotTotal === 1 || rotTotal === 2;
          const canPlace = sim.canPlaceItem(
            ghostItem,
            gx,
            gy,
            gRot,
            overlay.movingBuildingUid ?? undefined
          ).ok;

          const s = this.slots[slotCount++];
          s.rxMin = rx0 + 0.04;
          s.ryMin = ry0 + 0.04;
          s.rxMax = rx0 + rbw - 0.04;
          s.ryMax = ry0 + rbh - 0.04;
          s.depth = rx0 + rbw + ry0 + rbh + 0.02;
          s.wx = worldCx;
          s.wy = worldBottomY + 4.0 - Math.abs(Math.sin(nowMs * 0.005)) * 2.5;
          s.drawW = flipX ? -drawW : drawW;
          s.drawH = drawH;
          s.spriteId = gHandle.id;
          s.swayAmp = 0;
          s.rotRad = 0;
          s.pivotY = 0;
          s.alpha = 0.82;
          s.tintFlag = canPlace ? 1 : 2;
          s.skeletalPoseIdx = -1;
          s.shadowScale = 0.5;
          s.emissiveBoost = 0.45;
          s.phaseSeed = gx + gy;
          s.extraCount = 0;
          s.extraStart = 0;
        }
      }
    }

    // 4. Walking Weasley Family & Hogsmeade Villagers (Articulated Spine 2D Slots — Iron Law #3!)
    for (let i = 0; i < sim.villagers.length && slotCount < MAX_SCENE_INSTANCES; i++) {
      const v = sim.villagers[i];
      const vGx = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(v.gx)));
      const vGy = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(v.gy)));
      const elev = sim.grid[vGy]?.[vGx]?.elevation ?? 0;
      const iso = worldIso(v.gx, v.gy, viewRot);
      const wy = iso.wy - elev * ELEV_PX;
      if (iso.wx < minWx || iso.wx > maxWx || wy < minWy || wy > maxWy) continue;

      const isWalking = v.state === 'walking';
      const useWalkPose = isWalking && Math.floor(v.walkPhase * 1.4) % 2 === 1;
      const spHandle = sprites.resolve(useWalkPose ? v.walkSprite : v.idleSprite) ?? sprites.resolve(v.idleSprite);
      if (!spHandle) continue;

      const baseH = v.id === 'hagrid' ? 62 : 52;
      const drawW = baseH * (spHandle.width / spHandle.height);
      const hop = isWalking
        ? Math.abs(Math.sin(v.walkPhase * 2.1)) * 2.8
        : Math.sin(nowMs * 0.003 + v.gx * 1.7) * 0.7;
      const strideLean = isWalking ? Math.sin(v.walkPhase * 1.05) * 0.045 : 0;
      const { rx, ry } = rotateGridPoint(v.gx, v.gy, viewRot);

      let skelIdx = -1;
      if (rawSkelCount < MAX_SKELETAL_SLOTS) {
        skelIdx = rawSkelCount++;
        const sp = this.rawSkeletalPoses[skelIdx];
        sp.villagerId = v.id;
        sp.wx = iso.wx;
        sp.wy = wy - hop;
        sp.drawW = v.facingLeft ? -drawW : drawW;
        sp.drawH = baseH;
        sp.spriteId = spHandle.id;
        sp.walkPhase = v.walkPhase;
        sp.isWalking = isWalking;
        sp.facingLeft = Boolean(v.facingLeft);
        sp.alpha = 1.0;
        sp.greetWave = reducedMotion
          ? 0
          : Math.min(1, Math.max(0, (v.greetReactTimer ?? 0) / 0.6));
        sp.tendingLean = !reducedMotion && !isWalking && (v.tendingSpotTimer ?? 0) > 0 ? 1 : 0;
        sp.phaseSeed = i * 2.1;
      }

      const s = this.slots[slotCount++];
      s.rxMin = rx - 0.18;
      s.ryMin = ry - 0.18;
      s.rxMax = rx + 0.18;
      s.ryMax = ry + 0.18;
      s.depth = rx + ry + 0.30;
      s.wx = iso.wx;
      s.wy = wy - hop;
      s.drawW = v.facingLeft ? -drawW : drawW;
      s.drawH = baseH;
      s.spriteId = spHandle.id;
      s.swayAmp = 0.8;
      s.rotRad = strideLean;
      s.pivotY = 0;
      s.alpha = 1.0;
      s.tintFlag = 0;
      s.skeletalPoseIdx = skelIdx;
      s.shadowScale = 0.72;
      s.emissiveBoost = 0.12;
      s.phaseSeed = i * 2.1;
      s.extraCount = 0;
      s.extraStart = 0;
    }

    // 5. Locked Enchanted Forest Canopy Trees & Rocks
    if (!sim.state.sandboxMode) {
      for (let i = 0; i < this.lockedScenery.length && slotCount < MAX_SCENE_INSTANCES; i++) {
        const prop = this.lockedScenery[i];
        if (this.unlockedZonesSet.has(prop.zoneId)) continue;
        const gxInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(prop.gx)));
        const gyInt = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(prop.gy)));
        const elev = sim.grid[gyInt]?.[gxInt]?.elevation ?? 0;
        const iso = worldIso(prop.gx + 0.5, prop.gy + 0.5, viewRot);
        const wy = iso.wy - elev * ELEV_PX;
        if (iso.wx < minWx || iso.wx > maxWx || wy < minWy || wy > maxWy) continue;

        const effKey = isWinterScene ? resolveWinterScenerySpriteKey(prop) : prop.spriteKey;
        const h = sprites.resolve(effKey);
        if (!h) continue;
        const isGroundCover =
          effKey === 'env_flower_patch' ||
          effKey === 'env_bush_flowers' ||
          effKey === 'env_mossy_rock' ||
          effKey === 'yule_holly_hedgerow' ||
          effKey === 'yule_snowdrop_moss_log' ||
          effKey === 'yule_edelweiss_alpine_rockery';
        const baseW = (isGroundCover ? 34 : 58) * prop.scale;
        const drawH = baseW * (h.height / h.width);
        const { rx, ry } = rotateGridPoint(prop.gx + 0.5, prop.gy + 0.5, viewRot);

        const s = this.slots[slotCount++];
        s.rxMin = rx - 0.32;
        s.ryMin = ry - 0.32;
        s.rxMax = rx + 0.32;
        s.ryMax = ry + 0.32;
        s.depth = rx + ry + 0.42;
        s.wx = iso.wx;
        s.wy = wy;
        s.drawW = prop.flipX ? -baseW : baseW;
        s.drawH = drawH;
        s.spriteId = h.id;
        s.swayAmp = prop.spriteKey === 'env_mossy_rock' ? 0 : isGroundCover ? 2.6 : 4.8;
        s.rotRad = 0;
        s.pivotY = 0;
        s.alpha = 1.0;
        s.tintFlag = 0;
        s.skeletalPoseIdx = -1;
        s.shadowScale = 0.85;
        s.emissiveBoost = prop.spriteKey === 'env_tree_magic' ? 0.55 : 0.0;
        s.phaseSeed = prop.gx * 0.9 + prop.gy * 1.4;
        s.extraCount = 0;
        s.extraStart = 0;
      }
    }

    // 6. Kahn's Topological 2.5D Depth Sort -> write directly into contiguous `this.sceneData`
    this.sortAndPackSceneInstances(slotCount);

    // 7. Pack Dynamic Point Lights (Lumos Wand cursor spotlight disabled so map stays evenly & clearly lit!)
    let outLights = 0;
    const maxL = Math.min(MAX_LIGHT_SLOTS, Math.max(0, maxPointLights));
    void lumosWandEnabled;
    void pointerWorld;

    // Partial selection sort for closest K lights (zero array allocation)
    for (let k = 0; k < lightCandCount && outLights < maxL; k++) {
      let bestIdx = k;
      let bestDist = this.lightCandidates[k].distSq;
      for (let j = k + 1; j < lightCandCount; j++) {
        if (this.lightCandidates[j].distSq < bestDist) {
          bestDist = this.lightCandidates[j].distSq;
          bestIdx = j;
        }
      }
      if (bestIdx !== k) {
        const tmp = this.lightCandidates[k];
        this.lightCandidates[k] = this.lightCandidates[bestIdx];
        this.lightCandidates[bestIdx] = tmp;
      }
      const c = this.lightCandidates[k];
      if (c.intensity <= 0.02) continue;
      const base = outLights * LIGHT_STRIDE;
      this.lightData[base] = c.wx;
      this.lightData[base + 1] = c.wy;
      this.lightData[base + 2] = c.z;
      this.lightData[base + 3] = c.radius;
      this.lightData[base + 4] = c.r;
      this.lightData[base + 5] = c.g;
      this.lightData[base + 6] = c.b;
      this.lightData[base + 7] = c.intensity;
      outLights++;
    }
    this.lightCount = outLights;
  }

  private sortAndPackSceneInstances(n: number): void {
    this.skeletalCount = 0;
    if (n === 0) {
      this.sceneCount = 0;
      return;
    }

    this.topoHead.fill(-1, 0, n);
    this.topoTail.fill(-1, 0, n);
    this.topoInDeg.fill(0, 0, n);
    this.topoEmitted.fill(0, 0, n);

    let edgeCount = 0;
    const eps = 0.04;

    const addEdge = (u: number, v: number): void => {
      this.ensureEdgeCap(edgeCount + 1);
      const e = edgeCount++;
      this.topoTo[e] = v;
      this.topoNext[e] = -1;
      if (this.topoHead[u] === -1) {
        this.topoHead[u] = e;
        this.topoTail[u] = e;
      } else {
        this.topoNext[this.topoTail[u]] = e;
        this.topoTail[u] = e;
      }
      this.topoInDeg[v]++;
    };

    for (let i = 0; i < n; i++) {
      const a = this.slots[i];
      const aIsoL = a.rxMin - a.ryMax;
      const aIsoR = a.rxMax - a.ryMin;
      for (let j = i + 1; j < n; j++) {
        const b = this.slots[j];
        const bIsoL = b.rxMin - b.ryMax;
        const bIsoR = b.rxMax - b.ryMin;
        if (aIsoR <= bIsoL + eps || bIsoR <= aIsoL + eps) continue;

        const aBehindB =
          (a.rxMax <= b.rxMin + eps && a.ryMin < b.ryMax - eps) ||
          (a.ryMax <= b.ryMin + eps && a.rxMin < b.rxMax - eps);
        const bBehindA =
          (b.rxMax <= a.rxMin + eps && b.ryMin < a.ryMax - eps) ||
          (b.ryMax <= a.ryMin + eps && b.rxMin < a.rxMax - eps);

        if (aBehindB && !bBehindA) {
          addEdge(i, j);
        } else if (bBehindA && !aBehindB) {
          addEdge(j, i);
        }
      }
    }

    let readyHead = 0;
    let readyTail = 0;
    for (let i = 0; i < n; i++) {
      if (this.topoInDeg[i] === 0) {
        const d = this.slots[i].depth;
        let lo = readyHead;
        let hi = readyTail;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (this.slots[this.topoReady[mid]].depth <= d) lo = mid + 1;
          else hi = mid;
        }
        if (lo < readyTail) {
          this.topoReady.copyWithin(lo + 1, lo, readyTail);
        }
        this.topoReady[lo] = i;
        readyTail++;
      }
    }

    let outCount = 0;
    const emitSlot = (idx: number): void => {
      if (outCount >= MAX_SCENE_INSTANCES) return;
      const s = this.slots[idx];
      if (s.skeletalPoseIdx >= 0 && this.skeletalCount < MAX_SKELETAL_SLOTS) {
        const dstIdx = this.skeletalCount++;
        this.skeletalSortedIndices[dstIdx] = outCount;
        const srcPose = this.rawSkeletalPoses[s.skeletalPoseIdx];
        const dstPose = this.skeletalPoses[dstIdx];
        dstPose.villagerId = srcPose.villagerId;
        dstPose.wx = srcPose.wx;
        dstPose.wy = srcPose.wy;
        dstPose.drawW = srcPose.drawW;
        dstPose.drawH = srcPose.drawH;
        dstPose.spriteId = srcPose.spriteId;
        dstPose.walkPhase = srcPose.walkPhase;
        dstPose.isWalking = srcPose.isWalking;
        dstPose.facingLeft = srcPose.facingLeft;
        dstPose.alpha = srcPose.alpha;
        dstPose.greetWave = srcPose.greetWave ?? 0;
        dstPose.tendingLean = srcPose.tendingLean ?? 0;
        dstPose.phaseSeed = srcPose.phaseSeed ?? 0;
      }

      const base = outCount * SCENE_STRIDE;
      this.sceneSpriteIds[outCount] = s.spriteId;
      this.sceneTintFlags[outCount] = s.tintFlag;
      this.sceneData[base] = s.wx;
      this.sceneData[base + 1] = s.wy;
      this.sceneData[base + 2] = s.drawW;
      this.sceneData[base + 3] = s.drawH;
      this.sceneData[base + 4] = s.spriteId;
      this.sceneData[base + 5] = s.swayAmp;
      this.sceneData[base + 6] = s.rotRad;
      this.sceneData[base + 7] = s.pivotY;
      this.sceneData[base + 8] = s.alpha + s.tintFlag * 2.0;
      this.sceneData[base + 9] = s.shadowScale;
      this.sceneData[base + 10] = s.emissiveBoost;
      this.sceneData[base + 11] = s.phaseSeed;
      outCount++;

      for (let eIdx = 0; eIdx < s.extraCount && outCount < MAX_SCENE_INSTANCES; eIdx++) {
        const ex = this.extras[s.extraStart + eIdx];
        this.sceneSpriteIds[outCount] = ex.spriteId;
        this.sceneTintFlags[outCount] = ex.tintFlag;
        const eb = outCount * SCENE_STRIDE;
        this.sceneData[eb] = ex.wx;
        this.sceneData[eb + 1] = ex.wy;
        this.sceneData[eb + 2] = ex.drawW;
        this.sceneData[eb + 3] = ex.drawH;
        this.sceneData[eb + 4] = ex.spriteId;
        this.sceneData[eb + 5] = ex.swayAmp;
        this.sceneData[eb + 6] = ex.rotRad;
        this.sceneData[eb + 7] = ex.pivotY;
        this.sceneData[eb + 8] = ex.alpha + ex.tintFlag * 2.0;
        this.sceneData[eb + 9] = 0.0; // overlays don't cast separate ground shadow
        this.sceneData[eb + 10] = ex.emissiveBoost;
        this.sceneData[eb + 11] = ex.phaseSeed;
        outCount++;
      }
    };

    while (readyHead < readyTail) {
      const cur = this.topoReady[readyHead++];
      this.topoEmitted[cur] = 1;
      emitSlot(cur);
      for (let e = this.topoHead[cur]; e !== -1; e = this.topoNext[e]) {
        const nxt = this.topoTo[e];
        this.topoInDeg[nxt]--;
        if (this.topoInDeg[nxt] === 0) {
          const d = this.slots[nxt].depth;
          let lo = readyHead;
          let hi = readyTail;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (this.slots[this.topoReady[mid]].depth <= d) lo = mid + 1;
            else hi = mid;
          }
          if (lo < readyTail) {
            this.topoReady.copyWithin(lo + 1, lo, readyTail);
          }
          this.topoReady[lo] = nxt;
          readyTail++;
        }
      }
    }

    // Cycle fallback if any overlapping multi-tile footprints occur
    for (let i = 0; i < n; i++) {
      if (!this.topoEmitted[i]) {
        emitSlot(i);
      }
    }

    this.sceneCount = outCount;
  }

  private collectAtmosphericParticles(cam: Camera, nowMs: number): void {
    const t = nowMs * 0.001;
    const isNightLike = this.period === 'night' || this.period === 'dusk';
    const isRainOrFog =
      this.weatherKind === 'rain' || this.weatherKind === 'storm' || this.weatherKind === 'fog';
    const isSnow = !isRainOrFog && (this.weatherKind === 'snow' || this.seasonId === 'winter');
    const chimneyParticles = Math.min(48, this.chimneyCount * 4);
    const maxWeather = Math.max(0, MAX_PARTICLE_INSTANCES - chimneyParticles);
    const rawWeatherCount = isRainOrFog ? 0 : isSnow ? 140 : isNightLike ? 130 : 80;
    const weatherCount = Math.min(rawWeatherCount, maxWeather);
    const zoomSafe = Math.max(0.42, cam.zoom);
    const spanX = Math.max(920, 780 / zoomSafe);
    const spanY = Math.max(580, 500 / zoomSafe);
    const snowZoomComp = 1 / Math.max(0.65, Math.min(1.25, cam.zoom));

    for (let i = 0; i < weatherCount; i++) {
      const s1 = hash2d(i, 17);
      const s2 = hash2d(i, 89);
      const s3 = hash2d(i, 233);
      // Wrap smoothly around camera focus in world space
      const fallSpeed = 38 + s2 * 34;
      const driftX = isSnow
        ? t * (14 + s1 * 10) + Math.sin(t * (0.85 + s3 * 0.55) + i) * 26
        : Math.sin(t * 0.65 + i * 1.7) * 38;
      const driftY = isSnow
        ? t * fallSpeed
        : -t * 12 + Math.cos(t * 0.8 + i * 1.3) * 24;
      const rawWx = s1 * spanX * 2 + driftX;
      const rawWy = s2 * spanY * 2 + driftY;
      const wx = cam.x - spanX + (((rawWx % (spanX * 2)) + spanX * 2) % (spanX * 2));
      const wy = cam.y - spanY + (((rawWy % (spanY * 2)) + spanY * 2) % (spanY * 2));

      const base = i * PARTICLE_STRIDE;
      this.particleData[base] = wx;
      this.particleData[base + 1] = wy;

      if (isSnow) {
        // Steady crystal & powder snowflakes (no firefly blinking); vColor encodes [spinPhase, styleSeed, alpha]
        const flakeSize = (1.5 + s3 * 1.9) * snowZoomComp;
        this.particleData[base + 2] = flakeSize;
        this.particleData[base + 3] = (s3 + t * (0.07 + s1 * 0.06)) % 1.0;
        this.particleData[base + 4] = s1;
        this.particleData[base + 5] = 0.80 + 0.18 * s2;
      } else {
        const pulse = 0.45 + 0.55 * Math.sin(t * (2.2 + s3 * 2.0) + i * 3.1);
        this.particleData[base + 2] = (2.6 + s3 * 4.2) * pulse;
        if (i % 5 === 0) {
          // Emerald Floo spark
          this.particleData[base + 3] = 0.25;
          this.particleData[base + 4] = 1.35;
          this.particleData[base + 5] = 0.82;
        } else {
          // Warm golden firefly / sunlit pollen
          this.particleData[base + 3] = 1.45;
          this.particleData[base + 4] = 1.12;
          this.particleData[base + 5] = 0.36;
        }
      }
    }

    let outCount = weatherCount;
    for (let c = 0; c < this.chimneyCount; c++) {
      const cb = c * 3;
      const eWx = this.chimneyEmitters[cb];
      const eWy = this.chimneyEmitters[cb + 1];
      const seed = this.chimneyEmitters[cb + 2];
      for (let p = 0; p < 4 && outCount < MAX_PARTICLE_INSTANCES; p++) {
        const life = (t * 0.55 + p * 0.25 + seed * 0.17) % 1.0;
        const base = outCount * PARTICLE_STRIDE;
        this.particleData[base] = eWx + Math.sin(t * 1.8 + seed + p * 1.6) * (3 + life * 8);
        this.particleData[base + 1] = eWy - life * 34;
        this.particleData[base + 2] = 4.5 + life * 7.5;
        this.particleData[base + 3] = -1.0;
        this.particleData[base + 4] = Math.sin(life * Math.PI) * 0.46;
        this.particleData[base + 5] = 0.65;
        outCount++;
      }
    }
    this.particleCount = outCount;
  }
}
