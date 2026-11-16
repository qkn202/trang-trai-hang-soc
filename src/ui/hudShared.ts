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

const CUSTOM_CATALOG_PREVIEW_IDS = new Set([
  'path_cobble',
  'path_snow_brick',
  'path_wood_pier',
  'marble_bench',
  'floating_candles_post',
  'patronus_ward_lantern',
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
    return `/sprites/${item.spriteKey}.png`;
  }
  if (CUSTOM_CATALOG_PREVIEW_IDS.has(item.id)) {
    return `/paintings/catalog/${item.id}.png`;
  }
  return null;
}

export interface BuildToolModeHost {
  selectedCatalogItem: CatalogItem | null;
  moveModeActive: boolean;
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
  hud.movingBuildingUid = null;
  hud.bulldozerActive = false;
  hud.pincerActive = false;
  hud.pincerPicked = null;
  hud.pendingTouchTile = null;
  hud.onBuildStateReset?.();
}

export const RECENT_DECOR_STORAGE_KEY = 'hangsoc_recent_decor_v1';
const MAX_RECENT_DECOR_ITEMS = 12;

export function loadRecentDecorIds(): string[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(RECENT_DECOR_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is string => typeof x === 'string' && x.length > 0)
      .slice(0, MAX_RECENT_DECOR_ITEMS);
  } catch {
    return [];
  }
}

export function pushRecentDecorId(current: ReadonlyArray<string>, itemId: string): string[] {
  const next = [itemId, ...current.filter((id) => id !== itemId)].slice(0, MAX_RECENT_DECOR_ITEMS);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(RECENT_DECOR_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore storage quota errors
  }
  return next;
}

export const HEATMAP_CYCLE: Array<{ mode: HeatmapMode; label: string }> = [
  { mode: 'none', label: '🌡️ Nhiệt' },
  { mode: 'cleanliness', label: '🧹 Vệ Sinh' },
  { mode: 'wonder', label: '✨ Kỳ Diệu' },
  { mode: 'biome', label: '🌿 Sinh Thái' },
];

