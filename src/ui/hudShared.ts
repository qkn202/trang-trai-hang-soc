// Tách tự động từ src/ui/hud.ts (P0.3 — shared helpers & types).
import {
  CATALOG,
  FARM_CROPS,
  FARM_GOODS,
  formatDurationCompactVi,
  formatDurationCountdownVi,
  getCatalogItem,
  getFarmItemIconSrc,
  getFarmItemMeta,
  PASTURE_ANIMALS,
} from '../data/catalog';
import {
  getLevelInfo,
  getNextLevelXp,
  getPlayerTitle,
  getWinsRequiredForNextLevel,
  LEVELS,
  MAX_LEVEL,
} from '../data/levels';
import {
  HARVEST_FEAST_TIERS,
  STORY_CHAPTER_TITLES_VI,
  STORY_QUESTS,
  TUTORIAL_STEPS,
} from '../data/quests';
import {
  CRAFT_RECIPES,
  DISTRICT_SYNERGIES,
  RAW_INGREDIENTS_INFO,
} from '../data/synergiesAndSupply';
import {
  CREATURE_SPECIES_PROFILES,
  getBondIncomeMultiplier,
  getBondXpRequiredForNext,
  getCompendiumMasteryBonusPct,
  getSpeciesProfile,
  GROOM_COOLDOWN_MS,
  INCUBATION_DURATION_MS,
  MAX_BOND_LEVEL,
  MORPH_INFO,
  SUITCASE_EXPEDITIONS,
  TRAIN_COOLDOWN_MS,
} from '../data/suitcase';
import {
  getItemPuzzleStarCost,
  getUpgradePuzzleStarCost,
  getZonePuzzleStarCost,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
} from '../data/match3Levels';
import { getZoneById, GRID_SIZE, ZONES } from '../data/zones';
import {
  Camera,
  centerCameraOnGrid,
  COMPASS_LABELS_VI,
  rotateCamera90,
  unrotateGridPoint,
} from '../engine/isometric';
import { SpriteRegistry } from '../engine/spriteLoader';
import {
  FARM_HARVEST_CHEST_XP,
  formatHarvestFeastRewardVi,
  getItemPriceBounds,
  getUpgradeCost,
  MAX_PHOENIX_TALISMANS,
  ParkSimulation,
  PHOENIX_FORGE_GOLD_COST,
} from '../sim/simulation';
import {
  FRIENDSHIP_CHEST_TOKEN_COST,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  NEIGHBOR_PRESET_NOTES,
} from '../sim/neighborSocial';
import {
  BuildingCategory,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  FarmCropId,
  FarmItemId,
  FestivalType,
  FlyRewardKind,
  HeatmapMode,
  HouseName,
  LeaderboardGameId,
  LeaderboardScope,
  MAX_RIDE_QUEUE,
  MAX_STAFF_PER_ROLE,
  MinigameRescueContext,
  MinigameTrialKind,
  NeighborPresetNoteId,
  OfflineReport,
  PastureAnimalId,
  PuzzleArcadeMode,
  QuizFormatKind,
  QuizLanguageId,
  QuizProficiencyTier,
  RawIngredientId,
  RibbonUnveilCelebration,
  SuitcaseExpeditionId,
  TimeOverride,
  WeatherOverride,
  ZoneId,
} from '../types/game';
import { LeaderboardModalController } from './leaderboardModal';
import {
  lookupRealPlayerByFriendCode,
  registerRealPlayerProfileOnline,
} from './cloudSave';
import type { Match3ModalController } from './match3Modal';
import type { PuzzleArcadeModalController } from './puzzleArcadeModal';
import { SeedQuizModalController } from './seedQuizModal';

export function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type InspectSelection =
  | { kind: 'building'; uid: string }
  | { kind: 'staff'; id: string }
  | { kind: 'zone'; zoneId: ZoneId }
  | null;

export const BUILD_HUD_CATEGORIES: ReadonlyArray<BuildingCategory> = [
  'path',
  'shop',
  'creature',
  'decor',
];

export type ClassicDecorSubFilter =
  | 'all'
  | 'recent'
  | 'stashed'
  | 'nature'
  | 'fences'
  | 'lights'
  | 'landmarks';

export function classifyClassicDecorSubFilter(
  item: CatalogItem
): 'nature' | 'fences' | 'lights' | 'landmarks' {
  if (
    item.isZooFence ||
    item.id === 'burrow_stone_rune_fence' ||
    item.id === 'halloween_arch' ||
    item.id === 'hogsmeade_stone_bridge' ||
    item.id === 'floo_fireplace_gate'
  ) {
    return 'fences';
  }
  if (
    item.isBench ||
    item.id === 'floating_candles_post' ||
    item.id === 'patronus_ward_lantern'
  ) {
    return 'lights';
  }
  if (
    item.isFarmlandPlot ||
    Boolean(item.connectableGroup) ||
    item.id === 'burrow_apple_orchard' ||
    item.id === 'whomping_willow' ||
    item.id === 'burrow_oak_tree' ||
    item.id === 'burrow_pine_tree' ||
    item.id === 'burrow_magic_tree'
  ) {
    return 'nature';
  }
  return 'landmarks';
}

const CUSTOM_CATALOG_PREVIEW_IDS = new Set([
  'path_cobble',
  'path_snow_brick',
  'path_wood_pier',
  'marble_bench',
  'floating_candles_post',
  'patronus_ward_lantern',
  'burrow_stone_rune_fence',
]);

export function isWinterChristmasBuildItem(
  item: Pick<CatalogItem, 'id' | 'yuleCollection'>
): boolean {
  return Boolean(item.yuleCollection) || item.id.startsWith('yule_') || item.id === 'snowy_pines';
}

export function getCatalogCardImageSrc(
  item: Pick<CatalogItem, 'id' | 'spriteKey'>
): string | null {
  if (item.spriteKey) {
    return `/game/trang-trai-hang-soc/sprites/${item.spriteKey}.webp`;
  }
  if (CUSTOM_CATALOG_PREVIEW_IDS.has(item.id)) {
    return `/game/trang-trai-hang-soc/paintings/catalog/${item.id}.webp`;
  }
  return null;
}

export interface BuildToolModeHost {
  selectedCatalogItem: CatalogItem | null;
  moveModeActive: boolean;
  moveKeepActiveAfterDrop?: boolean;
  movingBuildingUid: string | null;
  bulldozerActive: boolean;
  pincerActive: boolean;
  pincerPicked: { kind: 'staff'; id: string; label: string } | null;
  pendingTouchTile: { gx: number; gy: number; label: string } | null;
  onBuildStateReset?: (() => void) | null;
}

export function clearBuildToolModes(hud: BuildToolModeHost): void {
  hud.selectedCatalogItem = null;
  hud.moveModeActive = false;
  hud.moveKeepActiveAfterDrop = false;
  hud.movingBuildingUid = null;
  hud.bulldozerActive = false;
  hud.pincerActive = false;
  hud.pincerPicked = null;
  hud.pendingTouchTile = null;
  hud.onBuildStateReset?.();
}

export const RECENT_DECOR_STORAGE_KEY = 'hangsoc_recent_decor_v1';
const MAX_RECENT_DECOR_ITEMS = 12;

// HPVN: nothing on the device (owner 13/11): the recent list lives for this visit only
export function loadRecentDecorIds(): string[] {
  return [];
}

export function pushRecentDecorId(current: ReadonlyArray<string>, itemId: string): string[] {
  const next = [itemId, ...current.filter((id) => id !== itemId)].slice(0, MAX_RECENT_DECOR_ITEMS);
  return next;
}

export const HEATMAP_CYCLE: Array<{ mode: HeatmapMode; label: string }> = [
  { mode: 'none', label: 'Nhiệt' },
  { mode: 'cleanliness', label: 'Vệ Sinh' },
  { mode: 'wonder', label: 'Kỳ Diệu' },
  { mode: 'biome', label: 'Sinh Thái' },
];

