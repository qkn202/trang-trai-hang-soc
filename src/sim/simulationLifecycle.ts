// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.

import {
  computeRealTimeBuildSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FarmWorkshopRecipe,
  formatDurationCompactVi,
  getCatalogItem,
  getFarmItemMeta,
  getMinRemainingBuildFloorSec,
  PASTURE_ANIMALS,
  TIME_SAND_SKIP_SECONDS,
} from '../data/catalog';
import {
  getLevelInfo,
  getLevelTrialRequirement,
  getNextLevelXp,
  getWinsRequiredForNextLevel,
  MAX_LEVEL,
} from '../data/levels';
import { HOUSES } from '../data/names';
import {
  createDailyQuests,
  createOwlOrderQuest,
  HARVEST_FEAST_TIERS,
  STORY_QUESTS,
  TUTORIAL_STEPS,
} from '../data/quests';
import {
  ActiveSynergyResult,
  CRAFT_RECIPES,
  CraftRecipeDef,
  createCargoCrates,
  createInitialSupplyState,
  DISTRICT_SYNERGIES,
  evaluateDistrictSynergies,
  RAW_INGREDIENTS_INFO,
} from '../data/synergiesAndSupply';
import {
  CREATURE_SPECIES_PROFILES,
  createInitialSuitcaseState,
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
  createInitialMatch3State,
  getExtraMovesGoldCost,
  getItemPuzzleStarCost,
  getMatch3LevelDef,
  getUpgradePuzzleStarCost,
  getZonePuzzleStarCost,
  HEART_REGEN_MS,
  MATCH3_BOOSTERS,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
  REFILL_HEARTS_GOLD_COST,
  TOTAL_MINIGAME_STAGES,
} from '../data/match3Levels';
import { getZoneAt, getZoneById, GRID_SIZE, ZONES } from '../data/zones';
import { MagicalAudio } from '../engine/audio';
import { findNextStepOnPaths, getRandomUnlockedPathTile } from '../engine/pathfinding';
import {
  BuildReductionResult,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  EscapedCreatureEntity,
  FarmBarnState,
  FarmCropId,
  FarmGoodId,
  FarmItemId,
  FarmOwlOrder,
  FestivalType,
  FireworkBurst,
  FloatingEffect,
  FlyRewardKind,
  GameState,
  HarvestFeastState,
  HarvestFeastTierDef,
  HeatmapMode,
  HomeOwlLanternMark,
  HouseName,
  IsoDirection,
  LanguageQuizState,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  LevelTrialRequirement,
  Match3BoosterId,
  MAX_STAFF_PER_ROLE,
  MinigameLeaderboardState,
  MinigameRescueContext,
  PastureAnimalId,
  MinigameTrialKind,
  NeighborGardenHelpKind,
  NeighborMinigameSos,
  NeighborPresetNoteId,
  NeighborProfileState,
  NeighborSocialState,
  OfflineReport,
  PlacedBuilding,
  PuzzleArcadeMode,
  QuestDef,
  QuestObjectiveType,
  RibbonUnveilCelebration,
  StaffEntity,
  SuitcaseExpeditionId,
  TileCell,
  TutorialState,
  TutorialStepDef,
  TutorialStepId,
  ValleyVillagerEntity,
  ValleyVillagerId,
  VerifiedRealPlayerProfile,
  WeatherForecastSlot,
  WeatherKind,
  ZoneId,
} from '../types/game';
import { buildSampleCoasterLoop, TrackWaypoint, traceCoasterCircuit } from './coaster';
import {
  buildNeighborValleySnapshot,
  CANON_NPC_NEIGHBOR_IDS,
  classifyBuildingGardenHelpKind,
  createFriendNeighborFromCode,
  createInitialNeighborSocialState,
  FRIENDSHIP_CHEST_TOKEN_COST,
  getGardenHelpMetaVi,
  getLocalCalendarResetKey,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  isNpcNeighborProfile,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  MAX_HOME_LANTERN_MARKS,
  pickSimulatedHomeLanternMark,
  syncNeighborSocialDailyReset,
} from './neighborSocial';
import {
  buildAllPersonalRecordsSummary,
  buildMinigameLeaderboard,
  ensureMinigameLeaderboardState,
  getAllCachedCloudLeaderboards,
  getCachedCloudLeaderboardEntries,
  getPlayerHogwartsHouse,
  HOGWARTS_HOUSE_META,
  isScoredLeaderboardGame,
  LeaderboardStandingResult,
  normalizeScoredLeaderboardGame,
  PersonalDisciplineSummaryRow,
  recordMinigameSessionResult,
  rollSortingHatHouse,
  setPlayerHogwartsHouse,
  submitPlayerCloudLeaderboardEntry,
} from './minigameLeaderboard';
import {
  createInitialPuzzleArcadeState,
  JIGSAW_PAINTINGS,
  PuzzleRewardSpec,
} from './puzzleArcadeEngine';
import {
  ActiveQuizChallenge,
  createInitialLanguageQuizState,
  QuizAttemptOutcome,
  recordQuizAttempt,
  sanitizeLanguageQuizState,
} from './languageQuizEngine';
import {
  BackstageEvaluation,
  BiomeEvaluation,
  evaluateBackstageShielding,
  evaluateHabitatBiome,
  getBuildingGates,
  traceQueueSlots,
} from './zooAndBackstage';
import {
  FARM_HARVEST_CHEST_XP,
  MAX_PHOENIX_TALISMANS,
  CANON_OWL_SENDERS,
  clampFinite,
  createCanonFarmOwlOrder,
  createInitialFarmBarnState,
  createInitialGameState,
  createInitialHarvestFeastState,
  createInitialTutorialState,
  deltaToFacing,
  FIREWORK_COLORS,
  formatHarvestFeastRewardVi,
  getItemPriceBounds,
  getLocalDateKey,
  getUpgradeCost,
  migrateLoadedState,
  PHOENIX_FORGE_ELIGIBLE_GOODS,
  PHOENIX_FORGE_GOLD_COST,
  PLAYFUL_BREAKDOWNS,
  sanitizePlainText,
  sanitizeQuestList,
  SAVE_KEY,
  starIncomeMultiplier,
  VALLEY_VILLAGER_PROFILES,
} from './simulationData';
import type { ParkSimulation } from './simulation';

export function lifecycleLoadFromStorage(sim: ParkSimulation): GameState | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GameState;
      if (!parsed || typeof parsed.level !== 'number' || !Array.isArray(parsed.buildings)) {
        return null;
      }
      return migrateLoadedState(parsed);
    } catch {
      return null;
    }
}

export function lifecycleSyncPlayerPrimitivesToHomeState(sim: ParkSimulation): void {
    if (!sim.homeStateWhileVisiting) return;
    const h = sim.homeStateWhileVisiting;
    h.level = sim.state.level;
    h.xp = sim.state.xp;
    h.galleons = sim.state.galleons;
    h.timeSand = sim.state.timeSand;
    h.phoenixTalismans = sim.state.phoenixTalismans;
    h.quizTalismanProgress = sim.state.quizTalismanProgress;
    h.levelUpTrialCompletedLevel = sim.state.levelUpTrialCompletedLevel;
    h.puzzleLevelWinsProgress = sim.state.puzzleLevelWinsProgress;
    h.featuredStarClaimedLevel = sim.state.featuredStarClaimedLevel;
    h.houseCupMilestoneTier = sim.state.houseCupMilestoneTier;
    h.lastDailyResetKey = sim.state.lastDailyResetKey;
    h.storyQuestIndex = sim.state.storyQuestIndex;
    h.storyClaimedIds = sim.state.storyClaimedIds;
    h.storyQuestProgress = sim.state.storyQuestProgress;
    h.owlQuests = sim.state.owlQuests;
    h.dailyQuests = sim.state.dailyQuests;
    h.farmBarn = sim.state.farmBarn;
    h.languageQuiz = sim.state.languageQuiz;
    h.tutorial = sim.state.tutorial;
    h.harvestFeast = sim.state.harvestFeast;
    h.neighborSocial = sim.state.neighborSocial;
    h.match3 = sim.state.match3;
    h.puzzleArcade = sim.state.puzzleArcade;
    h.supply = sim.state.supply;
    h.suitcase = sim.state.suitcase;
    h.finance = sim.state.finance;
    h.stats = sim.state.stats;
    h.settings = sim.state.settings;
    h.lastSavedAt = sim.state.lastSavedAt;
}

export function lifecycleSaveToStorage(sim: ParkSimulation): void {
    if (sim.isHeadmasterPreview) return;
    try {
      const now = Date.now();
      sim.state.lastSavedAt = now;
      lifecycleSyncPlayerPrimitivesToHomeState(sim);
      const baseState = sim.homeStateWhileVisiting ?? sim.state;
      const persistedState: GameState = {
        ...baseState,
        lastSavedAt: now,
        settings: {
          ...baseState.settings,
          showGrid: false,
          cutawayMode: false,
        },
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(persistedState));
    } catch {
      // Ignore quota errors
    }
}

export function lifecycleExportSaveJson(sim: ParkSimulation): string {
    sim.state.lastSavedAt = Date.now();
    lifecycleSyncPlayerPrimitivesToHomeState(sim);
    const baseState = sim.homeStateWhileVisiting ?? sim.state;
    return JSON.stringify(baseState, null, 2);
}

export function lifecycleImportSaveJson(sim: ParkSimulation, jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr) as GameState;
      if (!parsed || typeof parsed.level !== 'number' || !Array.isArray(parsed.buildings)) {
        return false;
      }
      sim.isHeadmasterPreview = false;
      sim.activeVisitNeighborId = null;
      sim.homeStateWhileVisiting = null;
      sim.backupMainStateJson = null;
      sim.state = migrateLoadedState(parsed);
      sim.audio.enabled = sim.state.settings.soundEnabled;
      sim.audio.bgmEnabled = sim.state.settings.bgmEnabled;
      sim.rebuildGrid();
      sim.syncStaffEntities();
      sim.syncValleyVillagers();
      sim.escapedCreatures = [];
      sim.rideQueues.clear();
      lifecycleSaveToStorage(sim);
      sim.onUiChange?.();
      return true;
    } catch {
      return false;
    }
}

export function lifecycleResetNewGame(sim: ParkSimulation): void {
    sim.isHeadmasterPreview = false;
    sim.activeVisitNeighborId = null;
    sim.homeStateWhileVisiting = null;
    sim.backupMainStateJson = null;
    sim.state = createInitialGameState();
    sim.rebuildGrid();
    sim.escapedCreatures = [];
    sim.rideQueues.clear();
    sim.syncStaffEntities();
    sim.syncValleyVillagers();
    lifecycleSaveToStorage(sim);
    sim.onUiChange?.();
}

export function lifecycleToggleHeadmasterPreview(sim: ParkSimulation, targetLevel = 100): void {
    if (sim.isVisitingNeighbor) {
      sim.exitNeighborVisit(true);
    }
    if (!sim.isHeadmasterPreview) {
      const prevSettings = { ...sim.state.settings };
      sim.backupMainStateJson = JSON.stringify(sim.state);
      sim.state = createInitialGameState();
      sim.state.settings = prevSettings;
      sim.isHeadmasterPreview = true;
      sim.state.level = targetLevel;
      sim.state.galleons = 999999;
      sim.state.timeSand = 99;
      sim.state.sandboxMode = true;
      sim.state.unlockedZones = ZONES.filter((z) => z.unlockLevel <= targetLevel).map((z) => z.id);
      sim.state.collectedCards = {};
      sim.state.housePoints = {
        Gryffindor: 840,
        Ravenclaw: 815,
        Hufflepuff: 790,
        Slytherin: 805,
      };
      sim.state.finance = {
        harvestRevenue: 48200,
        ticketRevenue: 19450,
        shopRevenue: 14680,
        gateRevenue: 5120,
        constructionSpent: 31500,
        staffWagesPaid: 2480,
      };
      sim.state.storyClaimedIds = STORY_QUESTS.map((q) => q.id);
      sim.state.storyQuestIndex = STORY_QUESTS.length;
      sim.state.owlQuests = [
        createOwlOrderQuest(targetLevel, 0),
        createOwlOrderQuest(targetLevel, 2),
        createOwlOrderQuest(targetLevel, 4),
      ];
      sim.state.dailyQuests = createDailyQuests(targetLevel, sim.state.lastDailyResetKey);
      sim.state.levelUpTrialCompletedLevel = targetLevel;
      sim.state.puzzleLevelWinsProgress = 0;
      sim.state.featuredStarClaimedLevel = targetLevel;
      sim.state.phoenixTalismans = MAX_PHOENIX_TALISMANS;
      sim.state.quizTalismanProgress = 0;
      sim.state.puzzleArcade = {
        activeMode: 'chess',
        sudokuStage: MAX_MINIGAME_STAGE,
        caroStage: MAX_MINIGAME_STAGE,
        chessStage: MAX_MINIGAME_STAGE,
        jigsawStage: 9,
        blockStage: MAX_MINIGAME_STAGE,
        tileStage: 10,
        sudokuCleared: MAX_MINIGAME_STAGE,
        caroCleared: MAX_MINIGAME_STAGE,
        chessCleared: MAX_MINIGAME_STAGE,
        blockCleared: MAX_MINIGAME_STAGE,
        featuredWinsCount: MAX_MINIGAME_STAGE,
        restoredPaintings: JIGSAW_PAINTINGS.map((p) => p.id),
        totalPuzzlesSolved: TOTAL_MINIGAME_STAGES,
      };
      sim.state.buildings = [];
      sim.rideQueues.clear();
      sim.rebuildGrid();

      const showcaseList: Array<{
        id: string;
        gx: number;
        gy: number;
        stars: number;
        gold: number;
        crop?: FarmCropId;
        animal?: PastureAnimalId;
      }> = [
        { id: 'burrow_house_canon', gx: 10, gy: 26, stars: 5, gold: 320 },
        { id: 'burrow_self_knitting_loom', gx: 14, gy: 26, stars: 5, gold: 180 },
        { id: 'arthur_ford_shed', gx: 9, gy: 20, stars: 5, gold: 240 },
        { id: 'burrow_cider_apiary', gx: 10, gy: 15, stars: 5, gold: 260 },
        { id: 'burrow_apple_orchard', gx: 14, gy: 15, stars: 5, gold: 150 },
        { id: 'molly_apple_bakery', gx: 15, gy: 20, stars: 5, gold: 220 },
        // Đồng Cỏ Chăn Thả 4×4 ghép liền rào (Bò Sữa, Cừu Lông Xù, Đàn Gà, Puffskein)
        { id: 'burrow_animal_pasture', gx: 19, gy: 20, stars: 5, gold: 46, animal: 'daisy_cow' },
        { id: 'burrow_animal_pasture', gx: 21, gy: 20, stars: 5, gold: 34, animal: 'ottery_sheep' },
        { id: 'burrow_animal_pasture', gx: 19, gy: 22, stars: 5, gold: 26, animal: 'burrow_hen' },
        { id: 'burrow_animal_pasture', gx: 21, gy: 22, stars: 5, gold: 62, animal: 'golden_puffskein' },
        // Ô Vườn Hoa Cảnh Hang Sóc 4×2 & Vườn Bí Ngô 4×2 ghép liền rào
        { id: 'burrow_flower_garden', gx: 25, gy: 20, stars: 5, gold: 52 },
        { id: 'burrow_flower_garden', gx: 27, gy: 20, stars: 5, gold: 0 },
        { id: 'burrow_pumpkin_gnomes', gx: 25, gy: 22, stars: 5, gold: 160 },
        { id: 'burrow_pumpkin_gnomes', gx: 27, gy: 22, stars: 5, gold: 0 },
        { id: 'burrow_owl_post', gx: 20, gy: 14, stars: 5, gold: 210 },
        { id: 'hogsmeade_stone_bridge', gx: 26, gy: 13, stars: 5, gold: 180 },
        { id: 'burrow_honeydukes_canon', gx: 29, gy: 7, stars: 5, gold: 0 },
        { id: 'burrow_broomsticks_canon', gx: 35, gy: 7, stars: 5, gold: 340 },
        { id: 'hogsmeade_harvest_fountain', gx: 41, gy: 7, stars: 5, gold: 860 },
        { id: 'burrow_greenhouse_canon', gx: 38, gy: 16, stars: 5, gold: 420 },
        { id: 'burrow_reed_pond_mill', gx: 31, gy: 26, stars: 5, gold: 210 },
        { id: 'burrow_puffskein_pasture', gx: 35, gy: 26, stars: 5, gold: 280 },
        { id: 'burrow_windmill_canon', gx: 7, gy: 14, stars: 5, gold: 480 },
        { id: 'burrow_feast_marquee', gx: 15, gy: 8, stars: 5, gold: 620 },
        // Cánh đồng Thửa Đất Canh Tác ghép rào liền mạch (Hoa Cảnh + Nông Sản)
        { id: 'farmland_plot', gx: 16, gy: 32, stars: 5, gold: 48, crop: 'english_rose' },
        { id: 'farmland_plot', gx: 18, gy: 32, stars: 5, gold: 52, crop: 'rainbow_tulip' },
        { id: 'farmland_plot', gx: 20, gy: 32, stars: 5, gold: 54, crop: 'meadow_daisy' },
        { id: 'farmland_plot', gx: 22, gy: 32, stars: 5, gold: 56, crop: 'blush_peony' },
        { id: 'farmland_plot', gx: 24, gy: 32, stars: 5, gold: 56, crop: 'forest_bluebell' },
        { id: 'farmland_plot', gx: 16, gy: 34, stars: 5, gold: 62, crop: 'moonlight_flower' },
        { id: 'farmland_plot', gx: 18, gy: 34, stars: 5, gold: 68, crop: 'phoenix_fireflower' },
        { id: 'farmland_plot', gx: 20, gy: 34, stars: 5, gold: 74, crop: 'hedge_sunflower' },
        { id: 'farmland_plot', gx: 22, gy: 34, stars: 5, gold: 82, crop: 'garden_pumpkin' },
        { id: 'farmland_plot', gx: 24, gy: 34, stars: 5, gold: 56, crop: 'ruby_strawberry' },
        { id: 'hagrid_pumpkin_hut', gx: 44, gy: 16, stars: 5, gold: 780 },
        { id: 'hippogriff_glade', gx: 42, gy: 26, stars: 5, gold: 1120 },
        { id: 'unicorn_glade', gx: 42, gy: 32, stars: 5, gold: 1960 },
        { id: 'black_lake_boats', gx: 58, gy: 47, stars: 5, gold: 1450 },
      ];

      sim.state.farmBarn = {
        ...createInitialFarmBarnState(),
        capacity: 240,
        ordersDelivered: 42,
        crops: Object.fromEntries(
          (Object.keys(FARM_CROPS) as FarmCropId[]).map((cid) => [cid, 8])
        ) as Record<FarmCropId, number>,
      };

      sim.state.supply = {
        ...createInitialSupplyState(targetLevel),
        ingredients: {
          mandrake_leaf: 18,
          sweet_pumpkin: 16,
          starlight_dust: 14,
          magic_cacao: 15,
        },
        goods: {
          aged_butterbeer: 4,
          felix_potion: 3,
          golden_choc_box: 3,
          dragon_firework: 5,
        },
      };

      const showcasePetMeta: Record<string, { name: string; morph: CreatureMorphVariant; bond: number }> = {
        niffler_den: { name: 'Bụng Bự Vàng', morph: 'radiant', bond: 9 },
        hippogriff_glade: { name: 'Buckbeak Kiêu Hãnh', morph: 'mystic', bond: 8 },
        thestral_grove: { name: 'Bóng Đêm Tinh Tú', morph: 'mystic', bond: 7 },
        unicorn_glade: { name: 'Ánh Trăng Bạc', morph: 'radiant', bond: 10 },
        dragon_lair: { name: 'Norbert Lửa Thiêng', morph: 'radiant', bond: 9 },
        phoenix_perch: { name: 'Fawkes Tái Sinh', morph: 'radiant', bond: 10 },
        hagrid_bowtruckle: { name: 'Pickett Nhỏ Xíu', morph: 'normal', bond: 6 },
      };

      const now = Date.now();
      for (const s of showcaseList) {
        const it = getCatalogItem(s.id);
        if (!it) continue;
        if (sim.canPlaceItem(it, s.gx, s.gy, 0).ok) {
          const petMeta = showcasePetMeta[s.id];
          const plotCrop = it.isFarmlandPlot ? (s.crop ?? 'ottery_wheat') : undefined;
          const pastureAnimal = it.isAnimalPasturePlot ? (s.animal ?? 'daisy_cow') : undefined;
          sim.state.buildings.push({
            uid: `preview_${s.id}_${s.gx}_${s.gy}`,
            itemId: s.id,
            gx: s.gx,
            gy: s.gy,
            rotation: 0,
            stars: s.stars,
            placedAt: now,
            constructEndsAt: now,
            lastTickAt: now,
            storedGalleons: s.gold,
            storedXp: Math.round(s.gold * 0.35),
            readyBubbles: s.gold > 0 ? 1 : 0,
            durability: 100,
            visitorsServed: 45,
            cropId: plotCrop,
            cropPlantedAt: plotCrop ? now - 180_000 : undefined,
            cropReadyAt: plotCrop ? now - 5_000 : undefined,
            pastureAnimalId: pastureAnimal,
            pastureStockedAt: pastureAnimal ? now - 120_000 : undefined,
            pastureReadyAt: pastureAnimal ? now - 5_000 : undefined,
            creatureStage: it.isCreatureHabitat ? 'legendary' : undefined,
            creatureHunger: it.isCreatureHabitat ? 96 : undefined,
            creatureHappiness: it.isCreatureHabitat ? 98 : undefined,
            hasBabyOffspring: it.isCreatureHabitat ? true : undefined,
            creatureNickname: it.isCreatureHabitat ? petMeta?.name : undefined,
            creatureMorph: it.isCreatureHabitat ? (petMeta?.morph ?? 'normal') : undefined,
            creatureBondLevel: it.isCreatureHabitat ? (petMeta?.bond ?? 5) : undefined,
            creatureBondXp: it.isCreatureHabitat ? 25 : undefined,
          });
          sim.rebuildGrid();
        }
      }

      sim.state.suitcase = {
        discoveredMorphs: CREATURE_SPECIES_PROFILES.flatMap((sp) => [
          `${sp.habitatItemId}:normal`,
          `${sp.habitatItemId}:mystic`,
        ]),
        activeIncubation: null,
        activeExpedition: null,
        totalGrooms: 28,
        totalExpeditions: 14,
        totalMorphsHatched: 9,
      };

      sim.state.match3 = {
        stars: 999,
        totalStarsEarned: 8154,
        currentLevel: MAX_MINIGAME_STAGE,
        maxClearedLevel: MAX_MINIGAME_STAGE,
        winStreak: 5,
        hearts: MAX_MATCH3_HEARTS,
        nextHeartAt: 0,
        boosters: {
          reparo_hammer: 9,
          row_col_cannon: 9,
          alohomora_shuffle: 9,
        },
        levelsWon: MAX_MINIGAME_STAGE,
      };

      sim.rebuildGrid();
      sim.syncStaffEntities();
      sim.syncValleyVillagers();

      sim.onToast?.(
        `🌾 Đã bật Chế độ Xem Thử Đại Điền Trang Hang Sóc & Thung Lũng Hogsmeade (Cấp ${targetLevel})!`,
        '🌻'
      );
    } else if (sim.backupMainStateJson) {
      sim.state = migrateLoadedState(JSON.parse(sim.backupMainStateJson) as GameState);
      sim.isHeadmasterPreview = false;
      sim.backupMainStateJson = null;
      sim.escapedCreatures = [];
      sim.fireworks = [];
      sim.rideQueues.clear();
      sim.rebuildGrid();
      sim.syncStaffEntities();
      sim.syncValleyVillagers();
      sim.onToast?.('Đã quay về Trang Trại Hang Sóc của bạn!', '🦉');
    }
    sim.onUiChange?.();
}

export function lifecycleGetRealTimePeriod(sim: ParkSimulation, now = new Date()): 'dawn' | 'day' | 'dusk' | 'night' {
    if (sim.state.settings.timeOverride !== 'realtime') {
      return sim.state.settings.timeOverride;
    }
    const h = now.getHours();
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 17) return 'day';
    if (h >= 17 && h < 19) return 'dusk';
    return 'night';
}

export function lifecycleGetActiveFestival(sim: ParkSimulation, now = new Date()): FestivalType {
    if (sim.state.settings.activeFestival !== 'auto') {
      return sim.state.settings.activeFestival;
    }
    const m = now.getMonth();
    const d = now.getDate();
    if (m === 9 || (m === 10 && d <= 5)) return 'halloween';
    if (m === 11) return 'christmas';
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'quidditch_cup';
    return 'none';
}

export function lifecycleResolveWeatherSlotKind(sim: ParkSimulation, slotIdx: number, dateAtSlot: Date): WeatherKind {
    // MurmurHash3 32-bit finalizer for deterministic cozy weather forecast
    let h = Math.imul(slotIdx ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35) >>> 0;
    h ^= h >>> 16;
    const roll = (h >>> 0) % 100;

    const period = lifecycleGetRealTimePeriod(sim, dateAtSlot);
    const fest = lifecycleGetActiveFestival(sim, dateAtSlot);
    if (fest === 'christmas') {
      if (roll < 52) return 'snow';
      if (roll < 76) return 'sunny';
      return 'cloudy';
    }
    if (period === 'dawn' && roll < 32) {
      return 'fog';
    }
    if (roll < 38) return 'sunny';
    if (roll < 60) return 'cloudy';
    if (roll < 77) return 'rain';
    if (roll < 88) return 'snow';
    if (roll < 95) return 'fog';
    return 'storm';
}

export function lifecycleDescribeWeatherSlot(sim: ParkSimulation, 
    kind: WeatherKind,
    startsInSec: number,
    isRainbow = false
  ): WeatherForecastSlot {
    if (isRainbow && (kind === 'sunny' || kind === 'cloudy')) {
      return {
        kind,
        icon: '🌈',
        labelVi: 'Cầu Vồng Sau Mưa',
        buffVi: 'Kỳ Diệu +20% • Toàn công viên +15% Vàng thu hoạch!',
        startsInSec,
        isRainbow: true,
      };
    }
    switch (kind) {
      case 'rain':
        return {
          kind,
          icon: '🌧️',
          labelVi: 'Mưa Phép Thuật',
          buffVi: 'Vườn Thảo Dược & Chuồng Thú +20% sản lượng',
          startsInSec,
        };
      case 'storm':
        return {
          kind,
          icon: '⛈️',
          labelVi: 'Giông Sấm Kỳ Bí',
          buffVi: 'Tiệm Đũa & Xưởng Độc Dược +25% doanh thu',
          startsInSec,
        };
      case 'snow':
        return {
          kind,
          icon: '❄️',
          labelVi: 'Tuyết Rơi Hogsmeade',
          buffVi: 'Tiệm Kẹo & Quán Ba Cây Chổi +20% vàng',
          startsInSec,
        };
      case 'fog':
        return {
          kind,
          icon: '🌫️',
          labelVi: 'Sương Sớm Hồ Đen',
          buffVi: 'Hồ Đen huyền ảo • Sinh vật huyền bí vui vẻ hơn',
          startsInSec,
        };
      case 'cloudy':
        return {
          kind,
          icon: '⛅',
          labelVi: 'Mây Bồng Bềnh',
          buffVi: 'Tiết trời dịu mát • Khách dạo chơi thư thả',
          startsInSec,
        };
      default:
        return {
          kind: 'sunny',
          icon: '☀️',
          labelVi: 'Nắng Ấm Đẹp Trời',
          buffVi: 'Khách ghé thăm đông hơn • Quầy Bia Bơ đắt khách',
          startsInSec,
        };
    }
}

export function lifecycleGetCurrentWeather(sim: ParkSimulation, nowMs = Date.now()): WeatherForecastSlot {
    const ov = sim.state.settings.weatherOverride;
    if (ov && ov !== 'auto') {
      const mapped: WeatherKind =
        ov === 'clear' || ov === 'fireflies'
          ? 'sunny'
          : ov === 'cloudy' || ov === 'rain' || ov === 'storm' || ov === 'snow' || ov === 'fog'
            ? ov
            : 'sunny';
      return lifecycleDescribeWeatherSlot(sim, mapped, 0, false);
    }
    if (sim.state.level <= 2 && sim.state.buildings.length <= 2) {
      return lifecycleDescribeWeatherSlot(sim, 'sunny', 0, false);
    }
    const slotLenMs = 120_000;
    const slotIdx = Math.floor(nowMs / slotLenMs);
    const curKind = lifecycleResolveWeatherSlotKind(sim, slotIdx, new Date(nowMs));
    const prevKind = lifecycleResolveWeatherSlotKind(sim, slotIdx - 1, new Date(nowMs - slotLenMs));
    const isRainbow =
      (curKind === 'sunny' || curKind === 'cloudy') && (prevKind === 'rain' || prevKind === 'storm');
    return lifecycleDescribeWeatherSlot(sim, curKind, 0, isRainbow);
}

export function lifecycleGetWeatherForecast(sim: ParkSimulation, count = 4, nowMs = Date.now()): WeatherForecastSlot[] {
    const slotLenMs = 120_000;
    const baseSlot = Math.floor(nowMs / slotLenMs);
    const list: WeatherForecastSlot[] = [lifecycleGetCurrentWeather(sim, nowMs)];
    if (sim.state.settings.weatherOverride !== 'auto') {
      return list;
    }
    let prevKind = list[0].kind;
    for (let i = 1; i < count; i++) {
      const startMs = (baseSlot + i) * slotLenMs;
      const startsInSec = Math.max(1, Math.ceil((startMs - nowMs) / 1000));
      const kind = lifecycleResolveWeatherSlotKind(sim, baseSlot + i, new Date(startMs));
      const isRainbow =
        (kind === 'sunny' || kind === 'cloudy') && (prevKind === 'rain' || prevKind === 'storm');
      list.push(lifecycleDescribeWeatherSlot(sim, kind, startsInSec, isRainbow));
      prevKind = kind;
    }
    return list;
}

export function lifecycleCheckDailyReset(sim: ParkSimulation, now = new Date()): void {
    const key = getLocalDateKey(now);
    let changed = false;
    if (sim.state.lastDailyResetKey !== key) {
      sim.state.lastDailyResetKey = key;
      sim.state.dailyQuests = createDailyQuests(sim.state.level, key);
      sim.onToast?.('Nhật Báo Tiên Tri vừa giao Nhiệm Vụ Hàng Ngày mới!', '📰');
      changed = true;
    }
    const social = sim.ensureNeighborSocial();
    if (syncNeighborSocialDailyReset(social, now.getTime())) {
      sim.onToast?.('🦉 Qua 00:00 ngày mới — lượt Giải Cứu Màn Khó & Quà Thăm Vườn đã làm mới!', '🍀');
      changed = true;
    }
    if (changed) {
      sim.onUiChange?.();
    }
}

export function lifecycleProcessOfflineProgress(sim: ParkSimulation): OfflineReport | null {
    const now = Date.now();
    lifecycleCheckDailyReset(sim, new Date(now));
    const awayMs = now - (sim.state.lastSavedAt || now);
    const awaySec = Math.floor(awayMs / 1000);
    if (awaySec < 45) {
      sim.tickProductionToTimestamp(now, false);
      return null;
    }

    let buildingsFinished = 0;
    for (const b of sim.state.buildings) {
      if (b.constructEndsAt > sim.state.lastSavedAt && b.constructEndsAt <= now) {
        buildingsFinished++;
      }
    }

    sim.tickProductionToTimestamp(now, true);

    const elfCount =
      sim.state.staffHired.house_elf +
      sim.state.buildings.filter((b) => b.itemId === 'owlery_elf_hut' && b.constructEndsAt <= now).length;

    let autoGalleons = 0;
    let autoXp = 0;
    let collectedCount = 0;

    if (elfCount > 0 || awaySec >= 180) {
      const ratio = elfCount > 0 ? Math.min(1, 0.55 + elfCount * 0.2) : 0.35;
      for (const b of sim.state.buildings) {
        if (b.storedGalleons > 0) {
          const takeG = Math.floor(b.storedGalleons * ratio);
          const takeX = Math.floor(b.storedXp * ratio);
          if (takeG > 0) {
            b.storedGalleons -= takeG;
            b.storedXp -= takeX;
            b.readyBubbles = Math.max(b.storedGalleons > 0 ? 1 : 0, Math.floor(b.readyBubbles * (1 - ratio)));
            autoGalleons += takeG;
            autoXp += takeX;
            collectedCount++;
          }
        }
      }
      if (autoGalleons > 0 || autoXp > 0) {
        sim.state.galleons += autoGalleons;
        sim.state.finance.harvestRevenue += autoGalleons;
        sim.addXp(autoXp);
        sim.recordQuestProgress('harvest_galleons', undefined, autoGalleons);
      }
    }

    lifecycleSaveToStorage(sim);
    if (autoGalleons === 0 && buildingsFinished === 0 && awaySec < 120) {
      return null;
    }

    return {
      awaySeconds: awaySec,
      galleonsEarned: autoGalleons,
      xpEarned: autoXp,
      buildingsFinished,
      houseElfAutoCollected: collectedCount,
    };
}
