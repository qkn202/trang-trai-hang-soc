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
  MORNING_DEW_REDUCTION_SEC,
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
  getJigsawValleyAuraPct,
  getMinigameFarmSpecialty,
  MinigameFarmSpecialtyDef,
  MinigameFarmSpecialtyOutcome,
  ResolvedMollySupplyKit,
  resolveMollySupplyForMinigame,
} from './minigameSynergy';
import {
  acceptFarmVisitorOffer,
  buyNewspaperClassifiedAd,
  dismissFarmVisitorOffer,
  ensureDailyProphetNewspaper,
  ensureFarmVisitors,
  expandWorkshopQueueSlot,
  getActiveFarmVisitorsCount,
  getEffectiveWorkshopQueueCapacity,
  getHayDayWheatingProgress,
  getNextWorkshopExtraSlotCost,
  getWorkshopMasteryInfo,
  refreshDailyProphetNewspaperEarly,
  WorkshopMasteryInfo,
} from './hayDayFarming';
import {
  abandonWeeklyDerbyActiveTask,
  acceptWeeklyDerbyTask,
  claimWeeklyDerbyMilestone,
  completeWeeklyDerbyActiveTask,
  ensureWeeklyDerbyState,
  getWeeklyDerbySummary,
  instantRestoreWeeklyDerbySlot,
  recordWeeklyDerbyProgress,
  trashWeeklyDerbyBoardTask,
  unlockBonusWeeklyDerbySlot,
  type WeeklyDerbySummary,
} from './weeklyDerbyEngine';
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
import { YULE_EVENT_END, YULE_EVENT_START, YULE_SCHEDULE, yuleAssetPrice, yuleDayIndex, yuleTaskComplete, yuleTaskProgress } from './yuleEvent';
import type { YuleDayDef } from './yuleEvent';
import { CATALOG } from '../data/catalog';
import { MagicalAudio } from '../engine/audio';
import { findNextStepOnPaths, getRandomUnlockedPathTile } from '../engine/pathfinding';
import {
  BuildReductionResult,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  DailyProphetNewspaperState,
  EscapedCreatureEntity,
  ExpressCargoCrate,
  FarmBarnState,
  FarmCropId,
  FarmGoodId,
  FarmItemId,
  FarmOwlOrder,
  FarmVisitorOffer,
  FestivalType,
  FieldMicroEvent,
  FieldMicroEventKind,
  FireworkBurst,
  FloatingEffect,
  FlooVisitDirectoryRow,
  FlyRewardKind,
  GameState,
  HarvestFeastState,
  HarvestFeastTierDef,
  HeatmapMode,
  HogsmeadeMarketFairState,
  HomeOwlLanternMark,
  HonorGardenTourDef,
  HouseName,
  IsoDirection,
  LanguageQuizState,
  LayoutPresetEntry,
  LayoutPresetId,
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
  SoilFertilityTier,
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
  WeeklyDerbyEventKind,
  WeeklyDerbyState,
  ZoneId,
  AlmanacChapterId,
  CoopSupplyCrateState,
  PostcardFrameThemeId,
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
  captureEconomyBaseline,
  EconomyBaselineSnapshot,
  EconomyIntegrityVerdict,
  verifyFarmEconomyDelta,
} from './economyIntegrity';
import type { ProofOfPlayEnvelope } from './proofOfPlay';
import {
  createInitialPuzzleArcadeState,
  JIGSAW_PAINTINGS,
  PuzzleRewardSpec,
} from './puzzleShared';
import {
  ActiveQuizChallenge,
  createInitialLanguageQuizState,
  QUIZ_STREAK_MILESTONES,
  QuizAttemptOutcome,
  recordQuizAttempt,
  sanitizeLanguageQuizState,
} from './languageQuizEngine';
import {
  ACHIEVEMENT_REGISTRY,
  answerVillagerDialogue,
  claimAchievementReward,
  claimAllUnlockedAchievements,
  claimDailyRetentionReward,
  DAY_1_TO_7_REWARDS,
  ensureRetentionState,
  evaluateAchievements,
  getClaimableRetentionCount,
  loadFromNamedSlot,
  SaveSlotId,
  SaveSlotMetadata,
  saveToNamedSlot,
  STORY_CUTSCENE_CHAPTERS,
} from './retentionAndNarrative';
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
  IS_SANDBOX_BUILD_ENABLED,
  isSandboxRuntimeAllowed,
  migrateLoadedState,
  PHOENIX_FORGE_ELIGIBLE_GOODS,
  PHOENIX_FORGE_GOLD_COST,
  sanitizePlainText,
  sanitizeQuestList,
  SAVE_KEY,
  starIncomeMultiplier,
  VALLEY_VILLAGER_PROFILES,
} from './simulationData';

export {
  createCanonFarmOwlOrder,
  createInitialFarmBarnState,
  createInitialGameState,
  createInitialHarvestFeastState,
  createInitialTutorialState,
  formatHarvestFeastRewardVi,
  getItemPriceBounds,
  getLocalDateKey,
  getUpgradeCost,
  IS_SANDBOX_BUILD_ENABLED,
  isSandboxRuntimeAllowed,
  MAX_PHOENIX_TALISMANS,
  PHOENIX_FORGE_ELIGIBLE_GOODS,
  PHOENIX_FORGE_GOLD_COST,
  starIncomeMultiplier,
  VALLEY_VILLAGER_PROFILES,
} from './simulationData';
export { FARM_HARVEST_CHEST_XP } from './simulationData';
export type { ValleyVillagerProfile } from './simulationData';

import {
  BarnUpgradeCostInfo,
  farmEnsureFarmBarn,
  farmGetBarnTotalUsed,
  farmGetBarnUpgradeCostInfo,
  farmGetFarmItemCount,
  farmAddFarmItemToBarn,
  farmConsumeFarmItemFromBarn,
  farmUpgradeFarmBarn,
  farmSellFarmItemFromBarn,
  farmEnsureLanguageQuiz,
  farmGetSeedCount,
  farmGetPlantableSeedCount,
  farmAddCropSeeds,
  farmBuyCropSeedWithGold,
  farmCompleteSeedLanguageQuizAttempt,
  farmPlantCropOnPlot,
  farmWaterCropPlot,
  farmHarvestCropPlot,
  farmStockAnimalOnPasture,
  farmFeedAnimalPasture,
  farmHarvestAnimalPasture,
  farmClearAnimalFromPasture,
  farmBatchWaterCrops,
  farmBatchHarvestCrops,
  farmBatchFeedPastures,
  farmBatchHarvestPastures,
  farmBatchPlantCrops,
  farmGetPlotEffectiveSoilTier,
  farmGetPlotSoilUpgradeCostInfo,
  farmUpgradePlotSoilTier,
  farmFertilizeCropPlotWithCompost,
  farmGetAvailableGourmetFeedCrop,
  farmFeedAnimalPastureGourmet,
  farmEnsureMarketFairState,
  farmIsItemMarketSpotlight,
  farmGetOwlOrderSpotlightBonus,
  farmSellMarketSpotlightLot,
  farmFulfillMarketFairDeal,
  farmRerollMarketFairDeals,
  farmReplantPlotLastCrop,
  farmBatchReplantLastCrops,
  farmReviveFruitTree,
  farmLocateItemSource,
} from './simulationFarm';
import type { FarmBatchResult, LocatedItemSource, PlotSoilUpgradeCostInfo } from './simulationFarm';
import {
  castStrollCareWave,
  claimVillagerKeepsake,
  cyclePlayerStrollRobe,
  giftItemToVillager,
  petRoamingCompanion,
  RoamingPetRuntime,
  setActiveRoamingPet,
  setPlayerStrollRobe,
  setStrollDestination,
  StrollAvatarRuntime,
  StrollRobeMeta,
  togglePlayerStrollMode,
  updateRoamingPetAndStroll,
} from './villagerGiftsPetAndStroll';
import {
  AlmanacChapterSummary,
  claimAlmanacChapterReward,
  claimCoopCrateMilestone,
  claimDailyTetLiXi,
  claimHomeVisitorMysteryGift,
  claimSeasonalFestivalTask,
  contributeToCoopSupplyCrate,
  ensureCoopSupplyCrate,
  evaluateCollectionAlmanac,
  getActiveSeasonalFestivalDef,
  getNeighborhoodCoopSummary,
  getSeasonalFestivalTaskProgress,
  leaveMysteryGiftForNeighbor,
  maybeSpawnHomeVisitorGift,
  NeighborhoodCoopSummary,
  SeasonalFestivalDef,
  setPostcardFrameTheme,
} from './socialFestivalsAndAlmanac';
import {
  activateFarmHelper,
  advertiseRoadsideStandSlot,
  buyVisitedNeighborRoadsideOffer,
  claimFieldMicroEvent,
  claimRoadsideStandSlot,
  ensureRoadsideStand,
  getNeighborRoadsideOffer,
  isFarmHelperActive,
  listOnRoadsideStand,
  RoadsidePriceTier,
  spawnFieldMicroEvent,
  tickFarmHelperAutoTend,
  tickRoadsideStandBuyers,
} from './roadsideStandAndEvents';
import {
  buildTxnBeginStroke,
  buildTxnCommitStroke,
  buildTxnCanUndo,
  buildTxnCanRedo,
  buildTxnCancelStroke,
  buildTxnUndo,
  buildTxnRedo,
  buildTxnNoteMutation,
  type BuildSnapshot,
} from './buildTransactions';

import {
  economyGetEffectivePrice,
  economyGetPriceValueVerdict,
  economySetBuildingCustomPrice,
  economyGetEffectiveItemStarCost,
  economyUpgradeBuildingStar,
  economyGetBuildingMinFloorSec,
  economyApplyConstructionReductionFromGameplay,
  economySpeedUpWithTimeSand,
  economyGetBuildingProductionPerCycle,
  economyTickProductionToTimestamp,
  economyGetActiveConstructions,
  economySetParkEntryFee,
} from './simulationEconomy';

import {
  worldRebuildGrid,
  worldIsBuildingConnected,
  worldRecomputeAllCoastersAndBiomes,
  worldAutoBuildCoasterForStation,
  worldMoveBuilding,
  worldRotatePlacedBuilding,
  isDragPaintableCatalogItem,
  isRepeatableCatalogItem,
  worldGetBuildingFootprint,
  worldIsCatalogItemUnlocked,
  worldCanPlaceItem,
  worldPlaceItem,
  worldUnlockZone,
  worldBridgeZoneWithCobblePath,
  worldFindSmartSpotForStoryBuilding,
  worldRemoveAtTile,
  worldEraseBrushAtTile,
  worldGetRemovalLossText,
  worldCanStashBuilding,
  worldStashBuilding,
} from './simulationWorld';
export { isDragPaintableCatalogItem, isRepeatableCatalogItem } from './simulationWorld';
export type { BarnUpgradeCostInfo, FarmBatchResult, PlotSoilUpgradeCostInfo } from './simulationFarm';

import {
  creaturesFeedCreature,
  creaturesCatchEscapedCreature,
  creaturesTriggerPlayfulEscape,
  creaturesSpawnEscapedFromHabitat,
  creaturesCastAccioHarvestAll,
  creaturesGetBuiltCreatureHabitats,
  creaturesGetSuitcaseReadySummary,
  creaturesRegisterDiscoveredMorph,
  creaturesAddCreatureBondXp,
  creaturesRenameCreature,
  creaturesGroomCreature,
  creaturesTrainCreatureTrick,
  creaturesGetMorphIncubationCost,
  creaturesStartMorphIncubation,
  creaturesSpeedUpIncubationWithSand,
  creaturesClaimMorphIncubation,
  creaturesStartSuitcaseExpedition,
  creaturesSpeedUpExpeditionWithSand,
  creaturesClaimSuitcaseExpedition,
} from './simulationCreatures';

import {
  trialsGetDisciplineStageInfo,
  trialsGetTotalTowerClearedStages,
  trialsGetWinsProgressForCurrentLevel,
  trialsGetRequiredLevelTrial,
  trialsGetLastPlayedMinigame,
  trialsSetLastPlayedMinigame,
  trialsIsCurrentLevelTrialPassed,
  trialsIsWaitingOnLevelTrial,
  trialsAdvanceMasterPuzzleLevel,
  trialsTryAdvancePendingLevels,
  trialsTickMatch3Hearts,
  trialsCanStartMatch3Level,
  trialsLoseMatch3Heart,
  trialsRefillMatch3Hearts,
  trialsBuyMatch3ExtraMoves,
  trialsSpendOrBuyMatch3Booster,
  trialsEnsureMinigameLeaderboard,
  trialsGetPlayerHouse,
  trialsSetPlayerHouse,
  trialsLockPlayerHouse,
  trialsRollPlayerSortingHat,
  trialsGetMinigameLeaderboard,
  trialsGetPlayerMinigameRank,
  trialsGetAllPersonalLeaderboardSummaries,
  trialsCompleteMatch3LevelVictory,
  trialsSpendPuzzleHelperGold,
  trialsGetPhoenixTalismanDailyStatus,
  trialsIsPhoenixTalismanUsedToday,
  trialsCanUsePhoenixTalismanInGame,
  trialsGetPhoenixTalismanCount,
  trialsGrantPhoenixTalisman,
  trialsConsumePhoenixTalisman,
  trialsRefundPhoenixTalismanAttempt,
  trialsGetCraftablePhoenixBarnGood,
  trialsCraftPhoenixTalismanFromBarn,
  trialsCompletePuzzleArcadeVictory,
  trialsRecordMinigamePlay,
  type MinigamePlayDisciplineId,
} from './simulationTrials';

import {
  questsTryDropWizardCard,
  questsGrantBuildingIngredientDrop,
  questsHarvestBuildingBubble,
  questsAddXp,
  questsGetActiveStoryQuest,
  questsComputeObjectiveSnapshot,
  questsRecordQuestProgress,
  questsClaimQuest,
  questsGetStoryAutoActionPreview,
  questsCompleteStoryStepWithStar,
  questsClaimOwlPostDelivery,
  questsGetWorkshopRecipesForBuilding,
  questsEnqueueWorkshopRecipe,
  questsSpeedUpWorkshopSlot,
  questsGetOwlRequirementHelpState,
  questsCanFulfillFarmOwlOrder,
  questsGetReadyOwlOrdersCount,
  questsFulfillFarmOwlOrder,
  questsRefreshFarmOwlOrder,
  questsGetOwlRerollsLeft,
  questsTrashFarmOwlOrder,
  questsTickTrashedOwlOrders,
  questsInstantRestoreTrashedOwlOrder,
  questsGetBrewDurationSec,
  questsQuickHarvestHerbs,
  questsStartBrewing,
  questsSpeedUpBrewing,
  questsUseCraftedGood,
  questsGetCargoCrateStockInfo,
  questsFulfillCargoCrate,
  questsUnveilBuilding,
  questsEnsureHarvestFeast,
  questsAddHarvestFeastPoints,
  questsGetClaimableHarvestFeastCount,
  questsGrantHarvestFeastTierRewardInternal,
  questsClaimHarvestFeastTier,
  questsClaimAllHarvestFeastTiers,
  questsStartNextHarvestFeastCycle,
} from './simulationQuests';
import type { CargoCrateStockInfo } from './simulationQuests';
export type { CargoCrateStockInfo } from './simulationQuests';

import {
  socialEnsureNeighborSocial,
  socialPushSocialActivity,
  socialGetActiveVisitingNeighbor,
  socialGetHomeOwnerParkName,
  socialEnterNeighborVisit,
  socialExitNeighborVisit,
  socialCycleNextNeighborVisit,
  socialSetNeighborPresetNote,
  socialAddFriendByCode,
  socialAddVerifiedRealFriend,
  socialSyncVerifiedFriendSnapshot,
  socialRemoveNeighborFriend,
  socialGetVisitedBuildingHelpStatus,
  socialHelpVisitedNeighborBuilding,
  socialLikeVisitedNeighborFarm,
  socialCanClaimVisitedMysteryGift,
  socialClaimVisitedNeighborMysteryGift,
  socialFulfillNeighborOwlCrate,
  socialCanRescueNeighborMinigame,
  socialCompleteNeighborMinigameRescue,
  socialOpenFriendshipChest,
  socialClaimHomeLanternMark,
  socialRequestPlayerOwlCrateHelp,
  socialRequestPlayerMinigameSos,
  socialClaimPlayerMinigameSosRescue,
  socialTickNeighborSocialBackground,
  socialGetActiveHonorGardenTour,
  socialEnterHonorGardenTour,
  socialCycleHonorGardenTour,
  socialSyncFlooDirectoryMembers,
  socialHelpVisitedFlooMemberWholeGarden,
  socialRecordFlooShareOrPostcard,
  socialRequestCargoCrateHelp,
} from './simulationSocial';

import {
  villagersHireStaff,
  villagersDismissStaff,
  villagersGetHourlyStaffWage,
  villagersSyncStaffEntities,
  villagersSetStaffPatrolZone,
  villagersRepairBuilding,
  villagersDropPickedEntity,
  villagersUpdateStaff,
  villagersEnsureTutorialState,
  villagersIsTutorialActive,
  villagersGetCurrentTutorialStep,
  villagersGetTutorialWorldTarget,
  villagersAdvanceTutorialStep,
  villagersSkipTutorial,
  villagersRestartTutorial,
  villagersCollectVillagerWalkSpots,
  villagersSyncValleyVillagers,
  villagersUpdateValleyVillagers,
  villagersGreetVillager,
} from './simulationVillagers';

import {
  lifecycleLoadFromStorage,
  lifecycleSyncPlayerPrimitivesToHomeState,
  lifecycleSaveToStorage,
  lifecycleExportSaveJson,
  lifecycleImportSaveJson,
  lifecycleResetNewGame,
  lifecycleToggleHeadmasterPreview,
  lifecycleGetRealTimePeriod,
  lifecycleGetActiveFestival,
  lifecycleIsYuleVisualThemeActive,
  lifecycleIsWinterMainMapActive,
  lifecycleResolveWeatherSlotKind,
  lifecycleDescribeWeatherSlot,
  lifecycleGetCurrentWeather,
  lifecycleGetWeatherForecast,
  lifecycleCheckDailyReset,
  lifecycleProcessOfflineProgress,
} from './simulationLifecycle';

export { setFarmStore } from './simulationLifecycle';

export class ParkSimulation {
  public state: GameState;
  public grid: TileCell[][] = [];
  public staff: StaffEntity[] = [];
  public villagers: ValleyVillagerEntity[] = [];
  public escapedCreatures: EscapedCreatureEntity[] = [];
  public effects: FloatingEffect[] = [];
  public fireworks: FireworkBurst[] = [];
  public audio: MagicalAudio;
  public isHeadmasterPreview = false;
  public activeVisitNeighborId: string | null = null;
  public activeHonorTourId: string | null = null;
  /** Public (internal): module domain (neighborSocial/economy) đọc-ghi state khi thăm hàng xóm. */
  public homeStateWhileVisiting: GameState | null = null;
  private socialSimAcc = 0;
  public heatmapMode: HeatmapMode = 'none';
  public backupMainStateJson: string | null = null;

  public get isVisitingNeighbor(): boolean {
    return (
      (this.activeVisitNeighborId !== null || this.activeHonorTourId !== null) &&
      this.homeStateWhileVisiting !== null
    );
  }

  public get isVisitingHonorTour(): boolean {
    return this.activeHonorTourId !== null && this.homeStateWhileVisiting !== null;
  }

  // Cached V2/V3 coaster circuits, biome evaluations, backstage, road connectivity, queues & synergies
  public coasterCircuits = new Map<string, { waypoints: TrackWaypoint[]; isClosed: boolean }>();
  public biomeCache = new Map<string, BiomeEvaluation>();
  public backstageCache = new Map<string, BackstageEvaluation>();
  public activeSynergies: ActiveSynergyResult = {
    activeIds: new Set(),
    buildingGoldMult: new Map(),
    buildingXpMult: new Map(),
    links: [],
  };
  public connectedPathTiles = new Set<string>();
  public connectedBuildingUids = new Set<string>();
  public queueTileToRideUid = new Map<string, string>();
  public rideQueueTailSpot = new Map<string, { gx: number; gy: number }>();
  public rideQueues = new Map<string, string[]>();

  public owlSeedCounter = 10;
  private wageTickAcc = 0;
  private autoSaveAcc = 0;
  private nightFireworkAcc = 0;
  public simSpeed: 1 | 2 = 1;
  public stateRevision = 1;
  public onUiChange: (() => void) | null = null;
  public onToast: ((msg: string, icon?: string) => void) | null = null;
  public onLevelUp: ((newLevel: number) => void) | null = null;
  public onRewardFly: ((kind: FlyRewardKind, amount: number, gx?: number, gy?: number) => void) | null = null;
  public onBuildingTactile: ((uid: string) => void) | null = null;
  /** Fired the moment a construction site turns into a finished building.
   *  Not fired during offline catch-up (silent ticks) so a long absence
   *  doesn't trigger dozens of celebration pops at once. */
  public onBuildingCompleted: ((uid: string) => void) | null = null;
  public onRibbonUnveiled: ((info: RibbonUnveilCelebration) => void) | null = null;
  public onZoneUnlocked: ((zoneId: ZoneId, cx: number, cy: number) => void) | null = null;
  public onTutorialStepChanged: ((stepId: TutorialStepId) => void) | null = null;
  public villagerGreetCooldown = new Map<ValleyVillagerId, number>();
  /** Công trình đang xây được người chơi bấm rút ngắn trực tiếp trong #inspectorPanel. */
  public preferredSpeedupBuildingUid: string | null = null;
  /**
   * Guard cho thao tác batch (Feed All / Collect All / brush). Khi active,
   * saveToStorage() và onUiChange() bị gộp lại ở cuối batch (1 lần commit)
   * để tránh 40 lần serialize bản lưu + 40 lần refresh DOM gây GC stutter.
   */
  public batchOperationActive = false;
  /**
   * Build Mode Transaction (P0.3): khi người chơi đang kéo brush build/move/brush
   * trên canvas, N lần saveToStorage + onUiChange (mà từng worldPlaceItem /
   * worldMoveBuilding / farm brush gọi bên trong) bị gộp lại ở cuối stroke
   * (buildTxnCommitStroke) — tránh GC stutter.
   */
  public suppressPerActionSave = false;
  public pendingBuildStroke: BuildSnapshot | null = null;
  public buildStrokeMutated = false;
  public buildUndoStack: BuildSnapshot[] = [];
  public buildRedoStack: BuildSnapshot[] = [];
  /** Backup onUiChange khi stroke build active (buildTxnCommitStroke khôi phục). */
  public buildStrokeOnUiChangeBackup: (() => void) | null | undefined;
  public economyBaseline: EconomyBaselineSnapshot | null = null;
  public pendingInboxSickles = 0;
  public pendingInboxSand = 0;
  public fieldMicroEvent: FieldMicroEvent | null = null;
  public nextMicroEventAt = Date.now() + 38_000;
  private helperAndStandAcc = 0;
  private productionTickAcc = 0.25;
  private cachedUnlockedZonesSig = '';
  private cachedUnlockedZonesSet = new Set<string>();
  public layoutEditSnapshot: {
    buildings: PlacedBuilding[];
    tileOverrides: GameState['tileOverrides'];
    stashedDecorInventory?: Record<string, number>;
    stashedDecorStars?: Record<string, number[]>;
    galleons: number;
    prevShowGrid: boolean;
  } | null = null;
  public activePresetSlot: LayoutPresetId = 'layout_1';
  public roamingPet: RoamingPetRuntime | null = null;
  public strollModeActive = false;
  public playerStrollAvatar: StrollAvatarRuntime | null = null;

  constructor(audio: MagicalAudio) {
    this.audio = audio;
    const loaded = this.loadFromStorage();
    this.state = loaded ?? createInitialGameState();
    this.economyBaseline = captureEconomyBaseline(this.state);
    this.audio.enabled = this.state.settings.soundEnabled;
    this.audio.bgmEnabled = this.state.settings.bgmEnabled;
    this.rebuildGrid();
    this.syncStaffEntities();
    this.syncValleyVillagers();
  }

  public creditVerifiedInboxGrant(sickles = 0, sand = 0): void {
    if (Number.isFinite(sickles) && sickles > 0) {
      this.pendingInboxSickles += Math.floor(sickles);
    }
    if (Number.isFinite(sand) && sand > 0) {
      this.pendingInboxSand += Math.floor(sand);
    }
  }

  public verifyEconomyDeltaFrom(
    prevState: GameState | EconomyBaselineSnapshot,
    elapsedMs: number
  ): EconomyIntegrityVerdict {
    return verifyFarmEconomyDelta(prevState, this.state, elapsedMs, {
      allowInboxSickles: this.pendingInboxSickles,
      allowInboxSand: this.pendingInboxSand,
    });
  }

  public loadFromStorage(): GameState | null { return lifecycleLoadFromStorage(this); }

  public syncPlayerPrimitivesToHomeState(): void { return lifecycleSyncPlayerPrimitivesToHomeState(this); }

  public saveToStorage(touchTimestamp = true): void { return lifecycleSaveToStorage(this, touchTimestamp); }

  public exportSaveJson(): string { return lifecycleExportSaveJson(this); }

  public importSaveJson(jsonStr: string): boolean { return lifecycleImportSaveJson(this, jsonStr); }

  public resetNewGame(): void { return lifecycleResetNewGame(this); }

  public toggleHeadmasterPreview(targetLevel = 100): void { return lifecycleToggleHeadmasterPreview(this, targetLevel); }

  public rebuildGrid(): void { return worldRebuildGrid(this); }

  public isBuildingConnected(uid: string): boolean { return worldIsBuildingConnected(this, uid); }

  public recomputeAllCoastersAndBiomes(): void { return worldRecomputeAllCoastersAndBiomes(this); }

  public autoBuildCoasterForStation(uid: string): boolean { return worldAutoBuildCoasterForStation(this, uid); }

  public setBuildingCustomPrice(uid: string, price: number): void { return economySetBuildingCustomPrice(this, uid, price); }

  public setParkEntryFee(fee: number): void { return economySetParkEntryFee(this, fee); }

  public getEffectivePrice(b: PlacedBuilding, item: CatalogItem): number { return economyGetEffectivePrice(this, b, item); }

  public getPriceValueVerdict(b: PlacedBuilding, item: CatalogItem): {
    label: string;
    color: string;
    demandMult: number;
  } { return economyGetPriceValueVerdict(this, b, item); }

  public moveBuilding(
    uid: string,
    newGx: number,
    newGy: number,
    newRot: 0 | 1 | 2 | 3
  ): { ok: boolean; reason?: string } { return worldMoveBuilding(this, uid, newGx, newGy, newRot); }

  public rotatePlacedBuilding(
    uid: string,
    step: 1 | -1 = 1
  ): { ok: boolean; reason?: string; newRotation?: 0 | 1 | 2 | 3 } {
    return worldRotatePlacedBuilding(this, uid, step);
  }

  public getRealTimePeriod(now = new Date()): 'dawn' | 'day' | 'dusk' | 'night' { return lifecycleGetRealTimePeriod(this, now); }

  public getActiveFestival(now = new Date()): FestivalType { return lifecycleGetActiveFestival(this, now); }

  public enableInfiniteSandbox(): void {
    if (!IS_SANDBOX_BUILD_ENABLED || !isSandboxRuntimeAllowed()) return;
    this.state.sandboxMode = true;
    this.state.sandboxTainted = true;
    this.state.galleons = 999_999_999;
    if (this.state.match3) {
      this.state.match3.stars = 999_999;
      this.state.match3.hearts = 5;
    }
    this.state.timeSand = 999;
    this.state.morningDewPhials = 999;
    this.state.herbalCompost = 999;
    this.state.phoenixTalismans = 12;
    this.state.unlockedZones = ZONES.map((z) => z.id);
    const now = Date.now();
    for (const b of this.state.buildings) {
      if (b.constructEndsAt > now) {
        b.constructEndsAt = now - 1000;
        b.constructionNotified = true;
      }
    }
    if (this.isTutorialActive()) {
      this.skipTutorial();
    }
    this.rebuildGrid();
    this.saveToStorage();
    this.onUiChange?.();
  }

  public debugYuleDayOverride: number | null = null;

  private resolveEffectiveYuleDay(now?: Date): number {
    if (!now && this.debugYuleDayOverride !== null && this.debugYuleDayOverride >= 1 && this.debugYuleDayOverride <= YULE_SCHEDULE.length) {
      return this.debugYuleDayOverride;
    }
    return yuleDayIndex(now ?? new Date());
  }

  public getYuleEventStatus(now?: Date): { active: boolean; day: number; dayDef: YuleDayDef | null; claimedMainDays: number[]; claimedSideTaskIds: string[]; unlockedAssetIds: string[] } {
    const y = this.state.yuleEvent ?? { schemaVersion: 1, claimedMainDays: [], claimedSideTaskIds: [], unlockedAssetIds: [], purchasedAssetIds: [] };
    const day = this.resolveEffectiveYuleDay(now);
    return { active: day > 0, day, dayDef: day > 0 ? (YULE_SCHEDULE[day - 1] ?? null) : null, claimedMainDays: [...y.claimedMainDays], claimedSideTaskIds: [...y.claimedSideTaskIds], unlockedAssetIds: [...y.unlockedAssetIds] };
  }

  public claimYuleMainDay(day: number, now?: Date): { ok: boolean; msg: string; unlockedAssetIds?: string[] } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return { ok: false, msg: 'Hãy về Trang Trại Hang Sóc để nhận quà Yule nhé!' };
    }
    const current = this.resolveEffectiveYuleDay(now);
    const def = YULE_SCHEDULE[day - 1];
    if (!def || current === 0 || day > current) return { ok: false, msg: 'Ngày Yule này chưa mở hoặc event đã kết thúc.' };
    const y = (this.state.yuleEvent ??= { schemaVersion: 1, claimedMainDays: [], claimedSideTaskIds: [], unlockedAssetIds: [], purchasedAssetIds: [] });
    if (y.claimedMainDays.includes(day)) return { ok: false, msg: 'Nhiệm vụ chính ngày này đã nhận rồi.' };
    if (!yuleTaskComplete(this.state, def.main)) return { ok: false, msg: `Chưa hoàn thành: ${def.main.titleVi}` };
    y.claimedMainDays.push(day);
    const ids = def.unlockIds.filter((id) => !y.unlockedAssetIds.includes(id));
    y.unlockedAssetIds.push(...ids);
    this.addXp(def.main.rewardXp);
    if (this.debugYuleDayOverride !== null) this.state.sandboxTainted = true;
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `Hoàn thành ngày ${day}: ${def.main.titleVi}`, unlockedAssetIds: ids };
  }

  public claimYuleSideTask(taskId: string, now?: Date): { ok: boolean; msg: string; rewardSickles?: number } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return { ok: false, msg: 'Hãy về Trang Trại Hang Sóc để nhận thưởng nhiệm vụ phụ Yule!' };
    }
    const current = this.resolveEffectiveYuleDay(now);
    if (current === 0) return { ok: false, msg: 'Event Yule chưa mở hoặc đã kết thúc.' };
    const task = YULE_SCHEDULE.flatMap((d) => d.side).find((t) => t.id === taskId);
    const taskDay = Number(taskId.split('_')[2]);
    if (!task || !Number.isInteger(taskDay) || taskDay < 1 || taskDay > current) return { ok: false, msg: 'Nhiệm vụ phụ này chưa mở hoặc event đã kết thúc.' };
    const y = (this.state.yuleEvent ??= { schemaVersion: 1, claimedMainDays: [], claimedSideTaskIds: [], unlockedAssetIds: [], purchasedAssetIds: [] });
    if (y.claimedSideTaskIds.includes(taskId)) return { ok: false, msg: 'Nhiệm vụ phụ đã nhận rồi.' };
    if (!yuleTaskComplete(this.state, task)) return { ok: false, msg: `Chưa hoàn thành: ${task.titleVi}` };
    const reward = Math.min(5000, task.rewardSickles);
    y.claimedSideTaskIds.push(taskId);
    this.state.galleons += reward;
    this.addXp(task.rewardXp);
    if (this.debugYuleDayOverride !== null) this.state.sandboxTainted = true;
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `Nhận +${reward.toLocaleString('vi-VN')} Sickle`, rewardSickles: reward };
  }

  public purchaseYuleAsset(itemId: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return { ok: false, msg: 'Hãy về Trang Trại Hang Sóc để mua vật phẩm Yule!' };
    }
    const item = CATALOG.find((x) => x.id === itemId);
    if (!item?.id.startsWith('yule_')) return { ok: false, msg: 'Asset này không thuộc bộ Yule.' };
    const y = (this.state.yuleEvent ??= {
      schemaVersion: 1,
      claimedMainDays: [],
      claimedSideTaskIds: [],
      unlockedAssetIds: [],
      purchasedAssetIds: [],
    });
    if (y.unlockedAssetIds.includes(itemId) || y.purchasedAssetIds.includes(itemId)) return { ok: false, msg: 'Asset Yule này đã được mở.' };
    const price = yuleAssetPrice(itemId);
    if (!this.state.sandboxMode) {
      if (this.state.galleons < price) return { ok: false, msg: `Cần ${price.toLocaleString('vi-VN')} Sickle.` };
      this.state.galleons -= price;
    }
    y.purchasedAssetIds.push(itemId);
    y.unlockedAssetIds.push(itemId);
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: this.state.sandboxMode
        ? `Đã mở ${item.name} miễn phí (Sandbox).`
        : `Đã mở ${item.name} với ${price.toLocaleString('vi-VN')} Sickle.`,
    };
  }

  public getYuleAssetPrice(itemId: string): number { return yuleAssetPrice(itemId); }

  public getYuleTaskProgress(taskId: string): number {
    const task = YULE_SCHEDULE.flatMap((d) => [d.main, ...d.side]).find((t) => t.id === taskId);
    return task ? yuleTaskProgress(this.state, task) : 0;
  }

  public getYuleTaskTarget(taskId: string): number {
    const task = YULE_SCHEDULE.flatMap((d) => [d.main, ...d.side]).find((t) => t.id === taskId);
    return task ? task.amount : 1;
  }

  public isYuleVisualThemeActive(now = new Date()): boolean { return lifecycleIsYuleVisualThemeActive(this, now); }

  public isWinterMainMapActive(): boolean { return lifecycleIsWinterMainMapActive(this); }

  public toggleYuleVisualTheme(now = new Date()): boolean {
    const mode = this.state.settings.yuleThemeMode ?? 'auto';
    const currentlyActive =
      mode === 'on'
        ? true
        : mode === 'off'
          ? false
          : this.isYuleVisualThemeActive(now) || this.isWinterMainMapActive();
    const nextActive = !currentlyActive;
    this.state.settings.yuleThemeMode = nextActive ? 'on' : 'off';
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.yuleTheme = nextActive ? 'true' : 'false';
    }
    this.saveToStorage();
    this.onUiChange?.();
    return nextActive;
  }

  private resolveWeatherSlotKind(slotIdx: number, dateAtSlot: Date): WeatherKind { return lifecycleResolveWeatherSlotKind(this, slotIdx, dateAtSlot); }

  private describeWeatherSlot(
    kind: WeatherKind,
    startsInSec: number,
    isRainbow = false
  ): WeatherForecastSlot { return lifecycleDescribeWeatherSlot(this, kind, startsInSec, isRainbow); }

  public getCurrentWeather(nowMs = Date.now()): WeatherForecastSlot { return lifecycleGetCurrentWeather(this, nowMs); }

  public getWeatherForecast(count = 4, nowMs = Date.now()): WeatherForecastSlot[] { return lifecycleGetWeatherForecast(this, count, nowMs); }

  public checkDailyReset(now = new Date()): void { return lifecycleCheckDailyReset(this, now); }

  public processOfflineProgress(): OfflineReport | null { return lifecycleProcessOfflineProgress(this); }

  public getBuildingFootprint(item: CatalogItem, rotation: 0 | 1 | 2 | 3): { bw: number; bh: number } { return worldGetBuildingFootprint(this, item, rotation); }

  public getBuildingProductionPerCycle(b: PlacedBuilding, item: CatalogItem): { galleons: number; xp: number } { return economyGetBuildingProductionPerCycle(this, b, item); }

  public getActiveConstructions(now = Date.now()): PlacedBuilding[] { return economyGetActiveConstructions(this, now); }

  public tickProductionToTimestamp(now: number, silent = false, skipRoadsideStand = false): void {
    return economyTickProductionToTimestamp(this, now, silent, skipRoadsideStand);
  }

  public getEffectiveItemStarCost(item: CatalogItem): number { return economyGetEffectiveItemStarCost(this, item); }

  public isCatalogItemUnlocked(item: CatalogItem): boolean { return worldIsCatalogItemUnlocked(this, item); }

  public canPlaceItem(
    item: CatalogItem,
    gx: number,
    gy: number,
    rotation: 0 | 1 | 2 | 3,
    ignoreBuildingUid?: string
  ): { ok: boolean; reason?: string } { return worldCanPlaceItem(this, item, gx, gy, rotation, ignoreBuildingUid); }

  public placeItem(item: CatalogItem, gx: number, gy: number, rotation: 0 | 1 | 2 | 3): boolean { return worldPlaceItem(this, item, gx, gy, rotation); }

  public removeAtTile(gx: number, gy: number): boolean { return worldRemoveAtTile(this, gx, gy); }

  public getRemovalLossText(gx: number, gy: number): string | null { return worldGetRemovalLossText(this, gx, gy); }

  public tryDropWizardCard(_gx: number, _gy: number, _baseChance = 0.08): void { return questsTryDropWizardCard(this, _gx, _gy, _baseChance); }



  public grantBuildingIngredientDrop(
    b: PlacedBuilding,
    item: CatalogItem | undefined,
    showFloat = true
  ): void { return questsGrantBuildingIngredientDrop(this, b, item, showFloat); }

  public harvestBuildingBubble(uid: string): boolean { return questsHarvestBuildingBubble(this, uid); }

  public upgradeBuildingStar(uid: string): { ok: boolean; msg: string } { return economyUpgradeBuildingStar(this, uid); }

  public getBuildingMinFloorSec(b: PlacedBuilding): number { return economyGetBuildingMinFloorSec(this, b); }

  /**
   * Rút ngắn thời gian xây dựng công trình tự động khi người chơi thắng Minigame
   * (Match-3, Caro, Sudoku, Cờ Phù Thủy, Xếp Khối) hoặc trả lời đúng Quiz Ngoại Ngữ:
   * - Giảm tối đa xuống mức sàn còn lại tối thiểu (1 tiếng đối với công trình >= 1 tiếng; 5–10 phút với công trình cấp đầu).
   * - Nếu công trình đầu tiên chạm mức sàn mà vẫn dư số giây thưởng, phần dư tự động chuyển sang công trình đang xây kế tiếp!
   */
  public applyConstructionReductionFromGameplay(
    rawReduceSec: number,
    sourceLabelVi = 'Giải Đố',
    preferredUid?: string
  ): BuildReductionResult { return economyApplyConstructionReductionFromGameplay(this, rawReduceSec, sourceLabelVi, preferredUid); }

  public speedUpWithTimeSand(uid: string, finishAll = false): boolean { return economySpeedUpWithTimeSand(this, uid, finishAll); }

  public feedCreature(uid: string): boolean { return creaturesFeedCreature(this, uid); }

  public unlockZone(zoneId: ZoneId): { ok: boolean; msg: string } { return worldUnlockZone(this, zoneId); }

  public catchEscapedCreature(escId: string): boolean { return creaturesCatchEscapedCreature(this, escId); }

  public triggerPlayfulEscape(): void { return creaturesTriggerPlayfulEscape(this); }

  private spawnEscapedFromHabitat(hab: PlacedBuilding): void { return creaturesSpawnEscapedFromHabitat(this, hab); }

  public castAccioHarvestAll(): void { return creaturesCastAccioHarvestAll(this); }

  public getDisciplineStageInfo(kind: MinigameTrialKind): {
    currentStage: number;
    clearedStages: number;
    maxStage: number;
    isMaxed: boolean;
  } { return trialsGetDisciplineStageInfo(this, kind); }

  public getTotalTowerClearedStages(): { cleared: number; total: number } { return trialsGetTotalTowerClearedStages(this); }

  public getWinsProgressForCurrentLevel(): { current: number; required: number } { return trialsGetWinsProgressForCurrentLevel(this); }

  public getRequiredLevelTrial(): LevelTrialRequirement | null { return trialsGetRequiredLevelTrial(this); }

  public getLastPlayedMinigame(): LeaderboardGameId { return trialsGetLastPlayedMinigame(this); }

  public setLastPlayedMinigame(gameId: LeaderboardGameId): LeaderboardGameId { return trialsSetLastPlayedMinigame(this, gameId); }

  public isCurrentLevelTrialPassed(): boolean { return trialsIsCurrentLevelTrialPassed(this); }

  public isWaitingOnLevelTrial(): boolean { return trialsIsWaitingOnLevelTrial(this); }

  /**
   * Vòng lặp Tháp Giải Đố 6×7.777 Màn (200+ giờ):
   * Thắng màn mới (1..7.777) của bất kỳ môn giải đố nào sẽ tích lũy tiến trình Cấp Giải Đố Tổng (3.435 trận -> Cấp 100),
   * mở khóa bản vẽ công trình, cây trồng & vùng đất mới!
   * Nếu chơi lại Màn 7777 đã phá đảo (countWinProgress = false), chỉ cộng thống kê & nhiệm vụ, không cày vô hạn Cấp.
   */
  private advanceMasterPuzzleLevel(
    modeOrKind: MinigameTrialKind,
    countWinProgress = true
  ): {
    leveledUp: boolean;
    newLevel: number;
    wasFeatured: boolean;
  } { return trialsAdvanceMasterPuzzleLevel(this, modeOrKind, countWinProgress); }

  public tryAdvancePendingLevels(_silentGateToast = false): boolean { return trialsTryAdvancePendingLevels(this, _silentGateToast); }

  /**
   * XP Điền Trang (từ thu hoạch nông sản, làm bánh, Đơn Hàng Cú, Quiz ngôn ngữ) tích lũy vào
   * Rương Mùa Gặt Điền Trang (mỗi 200 XP tặng ngay +65 🪙 Sickle + 1 ⏳ Cát Thời Gian + định kỳ Bùa Trợ Lực),
   * hoàn toàn không thay thế Cấp Giải Đố Tổng để giữ đúng vòng lặp cày Mini-game mở khóa Nhà!
   */
  public addXp(amount: number): void { return questsAddXp(this, amount); }

  public getActiveStoryQuest(): QuestDef | null { return questsGetActiveStoryQuest(this); }

  private computeObjectiveSnapshot(
    type: QuestObjectiveType,
    targetId: string | undefined,
    questId: string,
    isStory: boolean
  ): number { return questsComputeObjectiveSnapshot(this, type, targetId, questId, isStory); }

  public recordQuestProgress(type: QuestObjectiveType, targetId: string | undefined, delta: number): void { return questsRecordQuestProgress(this, type, targetId, delta); }

  public claimQuest(questId: string): boolean { return questsClaimQuest(this, questId); }

  public hireStaff(role: keyof GameState['staffHired']): boolean { return villagersHireStaff(this, role); }

  public dismissStaff(role: keyof GameState['staffHired']): boolean { return villagersDismissStaff(this, role); }

  public getHourlyStaffWage(): number { return villagersGetHourlyStaffWage(this); }

  public syncStaffEntities(): void { return villagersSyncStaffEntities(this); }

  public setStaffPatrolZone(staffId: string, zone: ZoneId | 'all'): void { return villagersSetStaffPatrolZone(this, staffId, zone); }

  public repairBuilding(uid: string, byStaffName?: string): boolean { return villagersRepairBuilding(this, uid, byStaffName); }

  public dropPickedEntity(
    kind: 'staff',
    id: string,
    gx: number,
    gy: number
  ): boolean { return villagersDropPickedEntity(this, kind, id, gx, gy); }

  // ==================== HỆ THỐNG #4: XƯỞNG CHẾ BIẾN & TÀU HÀNG TỐC HÀNH ====================

  public getBrewDurationSec(recipe: CraftRecipeDef): number { return questsGetBrewDurationSec(this, recipe); }

  public quickHarvestHerbs(): { ok: boolean; msg: string } { return questsQuickHarvestHerbs(this); }

  public startBrewing(goodId: CraftedGoodId): { ok: boolean; msg: string } { return questsStartBrewing(this, goodId); }

  public speedUpBrewing(): boolean { return questsSpeedUpBrewing(this); }

  public useCraftedGood(goodId: CraftedGoodId): { ok: boolean; msg: string } { return questsUseCraftedGood(this, goodId); }

  public getCargoCrateStockInfo(crate: ExpressCargoCrate): CargoCrateStockInfo {
    return questsGetCargoCrateStockInfo(this, crate);
  }

  public fulfillCargoCrate(crateId: string): { ok: boolean; msg: string } { return questsFulfillCargoCrate(this, crateId); }

  public requestCargoCrateHelp(crateId: string): { ok: boolean; msg: string } {
    return socialRequestCargoCrateHelp(this, crateId);
  }

  // ==================== HỆ THỐNG #5: PHÁO HOA BẦU TRỜI & KHÁCH VIP NHẬT BÁO TIÊN TRI ====================

  public launchFireworksShow(burstCount = 8): void {
    const launchers = this.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isFireworksLauncher && Date.now() >= b.constructEndsAt
    );
    for (let i = 0; i < burstCount; i++) {
      const anchor =
        launchers.length > 0
          ? launchers[i % launchers.length]
          : this.state.buildings[i % Math.max(1, this.state.buildings.length)];
      const gx = (anchor ? anchor.gx + 1 : 10) + (Math.random() - 0.5) * 6;
      const gy = (anchor ? anchor.gy + 1 : 16) + (Math.random() - 0.5) * 6;
      this.fireworks.push({
        id: `fw_${Date.now()}_${i}_${Math.random()}`,
        gx,
        gy,
        zHeight: 55 + Math.random() * 55,
        color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
        life: -i * 0.18, // Staggered burst sequence!
        maxLife: 1.9 + Math.random() * 0.6,
      });
    }
    this.audio.playSpell();
  }

  public spawnFloatingText(gx: number, gy: number, text: string, color: string): void {
    this.effects.push({
      id: `fx_${Math.random()}`,
      gx,
      gy,
      text,
      color,
      life: 0,
      maxLife: 1.65,
    });
  }

  public getParkWonderScore(): number {
    let sum = 4.0;
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it || Date.now() < b.constructEndsAt) continue;
      if (it.isBackstage) {
        const sh = this.backstageCache.get(b.uid);
        sum += sh?.isShielded ? 0.15 : -0.35;
      } else {
        const morphWonder = it.isCreatureHabitat ? MORPH_INFO[b.creatureMorph ?? 'normal'].wonderBonus : 0;
        const bondWonder = it.isCreatureHabitat ? ((b.creatureBondLevel ?? 1) - 1) * 0.08 : 0;
        sum += (it.wonder + morphWonder + bondWonder) * 0.08 * b.stars;
      }
    }
    const restoredBonus = Math.min(0.8, (this.state.puzzleArcade?.restoredPaintings?.length ?? 0) * 0.02);
    return Math.max(1.0, Math.min(5.0, Math.round((sum + restoredBonus) * 10) / 10));
  }

  public update(dt: number): void {
    if (!isSandboxRuntimeAllowed() && !import.meta.env.VITEST) {
      if (this.simSpeed !== 1) {
        this.simSpeed = 1;
      }
      if (this.isHeadmasterPreview) {
        this.isHeadmasterPreview = false;
      }
      if (this.state.sandboxMode) {
        this.state.sandboxMode = false;
        this.state.sandboxTainted = true;
      }
      if (this.homeStateWhileVisiting?.sandboxMode) {
        this.homeStateWhileVisiting.sandboxMode = false;
        this.homeStateWhileVisiting.sandboxTainted = true;
      }
    } else if (this.state.sandboxMode && !this.isVisitingNeighbor) {
      if (this.state.galleons < 999_999_999) this.state.galleons = 999_999_999;
      if (this.state.match3 && this.state.match3.stars < 999_999) {
        this.state.match3.stars = 999_999;
      }
      if ((this.state.timeSand ?? 0) < 999) this.state.timeSand = 999;
      if ((this.state.morningDewPhials ?? 0) < 999) this.state.morningDewPhials = 999;
      if ((this.state.phoenixTalismans ?? 0) < 12) this.state.phoenixTalismans = 12;
    }
    const clampedDt = Math.min(0.1, dt) * this.simSpeed;
    const now = Date.now();

    const unlockedZones = this.state.unlockedZones;
    const zonesSig = `${this.stateRevision}|${unlockedZones.length}|${unlockedZones[unlockedZones.length - 1] ?? ''}`;
    if (this.cachedUnlockedZonesSig !== zonesSig) {
      this.cachedUnlockedZonesSet.clear();
      for (let i = 0; i < unlockedZones.length; i++) {
        this.cachedUnlockedZonesSet.add(unlockedZones[i]);
      }
      this.cachedUnlockedZonesSig = zonesSig;
    }
    const unlockedSet = this.cachedUnlockedZonesSet;

    this.productionTickAcc += clampedDt;
    const isCatchupStep = dt >= 0.08;
    const runProductionTick = isCatchupStep || this.productionTickAcc >= 0.2;
    if (runProductionTick) {
      this.productionTickAcc = 0;
    }

    if (!this.isVisitingNeighbor) {
      if (runProductionTick) {
        this.tickProductionToTimestamp(now, false, !isCatchupStep);
      }
      this.helperAndStandAcc += clampedDt;
      if (this.helperAndStandAcc >= 2.0) {
        this.helperAndStandAcc = 0;
        tickRoadsideStandBuyers(this, now, false);
        tickFarmHelperAutoTend(this, now, false);
        maybeSpawnHomeVisitorGift(this, now);
      }
      if (this.fieldMicroEvent && now > this.fieldMicroEvent.expiresAt) {
        this.fieldMicroEvent = null;
        this.nextMicroEventAt = now + 52_000;
      } else if (!this.fieldMicroEvent && now >= this.nextMicroEventAt) {
        spawnFieldMicroEvent(this, now);
        this.nextMicroEventAt = now + 95_000;
      }
    }

    this.autoSaveAcc += clampedDt;
    if (this.autoSaveAcc >= 15) {
      this.autoSaveAcc = 0;
      this.checkDailyReset();
      if (!this.isVisitingNeighbor) {
        this.checkAndToastAchievements(now);
      }
      const isTabHidden = typeof document !== 'undefined' && document.hidden;
      this.saveToStorage(!isTabHidden);
      this.onUiChange?.();
    }

    this.socialSimAcc += clampedDt;
    if (this.socialSimAcc >= 3) {
      this.socialSimAcc = 0;
      this.tickNeighborSocialBackground(now);
    }

    if (!this.isVisitingNeighbor) {
      // Periodic gentle staff wage accounting every 45s
      this.wageTickAcc += clampedDt;
      if (this.wageTickAcc >= 45) {
        this.wageTickAcc = 0;
        const wage = this.getHourlyStaffWage();
        if (!this.state.sandboxMode && this.state.galleons > wage * 3) {
          this.state.galleons -= wage;
          // HPVN: say once why Sickle drops while idle (there is no dismiss option, so no way to stop it)
          if (wage > 0 && !this.state.wageToastShown) {
            this.state.wageToastShown = true;
            this.onToast?.(`Lương phụ tá: các phụ tá của bạn (Lao Công Phép Thuật, Phù Thủy Bảo Trì, Nhà Sinh Vật Học…) nhận ${wage} Sickle mỗi 45 giây. Bạn có thể cho phụ tá tạm nghỉ bất cứ lúc nào trong mục Nhân Sự.`, '🪙');
          }
        }
        this.state.finance.staffWagesPaid += wage;
      }

      // Update Contraption Wear & Breakdowns (throttled to 4 Hz)
      if (runProductionTick) {
        this.updateRideQueues(clampedDt, now);
      }

      // Creature hunger (slowed down if a Creature Feeder is nearby; rural farmstead coops/pastures are auto-tended!)
      for (const b of this.state.buildings) {
        const it = getCatalogItem(b.itemId);
        if (!it || !it.isCreatureHabitat || now < b.constructEndsAt || b.isEscaped) continue;
        if (it.isRuralFarmstead) {
          b.creatureHunger = 96;
          b.creatureHappiness = 98;
          continue;
        }
        const bio = this.biomeCache.get(b.uid);
        const decayRate = bio?.hasFeeder ? 0.08 : 0.18;
        b.creatureHunger = Math.max(5, (b.creatureHunger ?? 90) - clampedDt * decayRate);
        if (it.canEscape && (b.creatureHunger ?? 90) < 16 && this.escapedCreatures.length < 2) {
          if (Math.random() < clampedDt * 0.08) {
            this.spawnEscapedFromHabitat(b);
          }
        }
      }

      for (const esc of this.escapedCreatures) {
        esc.gx += esc.vx * clampedDt;
        esc.gy += esc.vy * clampedDt;
        const cell = this.grid[Math.floor(esc.gy)]?.[Math.floor(esc.gx)];
        if (!cell || !unlockedSet.has(cell.zoneId) || Math.random() < 0.03) {
          const spot = getRandomUnlockedPathTile(this.grid, unlockedSet);
          if (spot) {
            const angle = Math.atan2(spot.gy - esc.gy, spot.gx - esc.gx);
            esc.vx = Math.cos(angle) * 1.35;
            esc.vy = Math.sin(angle) * 1.35;
          } else {
            esc.vx *= -1;
            esc.vy *= -1;
          }
        }
        if (Math.random() < clampedDt * 0.35) {
          esc.stolenCoins += 1;
        }
      }

      this.updateStaff(clampedDt, unlockedSet);
    }

    // Automatic nighttime fireworks when Fireworks Pavilion is built!
    if (runProductionTick) {
      const period = this.getRealTimePeriod();
      if (period === 'dusk' || period === 'night') {
        const hasPavilion = this.state.buildings.some(
          (b) => getCatalogItem(b.itemId)?.isFireworksLauncher && now >= b.constructEndsAt
        );
        if (hasPavilion) {
          this.nightFireworkAcc += 0.25;
          if (this.nightFireworkAcc >= 3.2) {
            this.nightFireworkAcc = 0;
            this.launchFireworksShow(2);
          }
        }
      }
    }

    this.updateValleyVillagers(clampedDt, unlockedSet);
    updateRoamingPetAndStroll(this, clampedDt);

    for (let i = this.effects.length - 1; i >= 0; i--) {
      this.effects[i].life += clampedDt;
      if (this.effects[i].life >= this.effects[i].maxLife) {
        this.effects.splice(i, 1);
      }
    }

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      this.fireworks[i].life += clampedDt;
      if (this.fireworks[i].life >= this.fireworks[i].maxLife) {
        this.fireworks.splice(i, 1);
      }
    }
  }

  private updateRideQueues(_dt: number, now: number): void {
    // Cozy farmstead mode: no random contraption breakdowns during normal operation.
    for (const b of this.state.buildings) {
      if (now < b.constructEndsAt) continue;
      if (!b.isBrokenDown && (b.durability ?? 100) < 100) {
        b.durability = 100;
      }
    }
  }

  private updateStaff(dt: number, unlockedSet: Set<string>): void { return villagersUpdateStaff(this, dt, unlockedSet); }

  // ==================== HỆ THỐNG VALI BẢO TỒN SINH VẬT HUYỀN BÍ (SUITCASE SANCTUARY) ====================

  public getBuiltCreatureHabitats(): Array<{ building: PlacedBuilding; item: CatalogItem }> { return creaturesGetBuiltCreatureHabitats(this); }

  public getSuitcaseReadySummary(now = Date.now()): {
    incubationReady: boolean;
    expeditionReady: boolean;
    hungryCount: number;
    badgeCount: number;
  } { return creaturesGetSuitcaseReadySummary(this, now); }

  public registerDiscoveredMorph(itemId: string, morph: CreatureMorphVariant): boolean { return creaturesRegisterDiscoveredMorph(this, itemId, morph); }

  public addCreatureBondXp(b: PlacedBuilding, item: CatalogItem, amount: number): void { return creaturesAddCreatureBondXp(this, b, item, amount); }

  public renameCreature(uid: string, rawName: string): { ok: boolean; name: string; msg: string } { return creaturesRenameCreature(this, uid, rawName); }

  public groomCreature(uid: string): { ok: boolean; msg: string } { return creaturesGroomCreature(this, uid); }

  public trainCreatureTrick(uid: string): { ok: boolean; msg: string } { return creaturesTrainCreatureTrick(this, uid); }

  public getMorphIncubationCost(item: CatalogItem): number { return creaturesGetMorphIncubationCost(this, item); }

  public startMorphIncubation(habitatUid: string, useStarlight: boolean): { ok: boolean; msg: string } { return creaturesStartMorphIncubation(this, habitatUid, useStarlight); }

  public speedUpIncubationWithSand(): { ok: boolean; msg: string } { return creaturesSpeedUpIncubationWithSand(this); }

  public claimMorphIncubation(): {
    ok: boolean;
    morph?: CreatureMorphVariant;
    isNew?: boolean;
    msg: string;
  } { return creaturesClaimMorphIncubation(this); }

  public startSuitcaseExpedition(
    habitatUid: string,
    expeditionId: SuitcaseExpeditionId
  ): { ok: boolean; msg: string } { return creaturesStartSuitcaseExpedition(this, habitatUid, expeditionId); }

  public speedUpExpeditionWithSand(): { ok: boolean; msg: string } { return creaturesSpeedUpExpeditionWithSand(this); }

  public claimSuitcaseExpedition(): { ok: boolean; msg: string } { return creaturesClaimSuitcaseExpedition(this); }

  // ==================== HỆ THỐNG LEO THÁP MATCH-3 & SAO PHÉP THUẬT (ROYAL MATCH / GARDENSCAPES) ====================

  public tickMatch3Hearts(now = Date.now()): void { return trialsTickMatch3Hearts(this, now); }

  public getStoryAutoActionPreview(): {
    kind: 'claim_free' | 'auto_paths' | 'auto_build' | 'auto_unlock_zone' | 'open_match3' | 'none';
    shortLabel: string;
    longLabel: string;
    starCost: number;
    goldCost: number;
  } { return questsGetStoryAutoActionPreview(this); }

  public bridgeZoneWithCobblePath(zoneId: ZoneId): void { return worldBridgeZoneWithCobblePath(this, zoneId); }

  public findSmartSpotForStoryBuilding(
    item: CatalogItem,
    rotation: 0 | 1 | 2 | 3 = 0
  ): { gx: number; gy: number } | null {
    return worldFindSmartSpotForStoryBuilding(this, item, rotation);
  }

  public completeStoryStepWithStar(): {
    ok: boolean;
    msg: string;
    reason?: 'missing_stars' | 'missing_gold' | 'locked_level' | 'no_space' | 'open_match3';
    placedGx?: number;
    placedGy?: number;
  } { return questsCompleteStoryStepWithStar(this); }

  public canStartMatch3Level(): { ok: boolean; msg?: string } { return trialsCanStartMatch3Level(this); }

  public loseMatch3Heart(): void { return trialsLoseMatch3Heart(this); }

  public refillMatch3Hearts(): { ok: boolean; msg: string } { return trialsRefillMatch3Hearts(this); }

  public buyMatch3ExtraMoves(levelOverride?: number): { ok: boolean; msg: string; cost: number } { return trialsBuyMatch3ExtraMoves(this, levelOverride); }

  public spendOrBuyMatch3Booster(boosterId: Match3BoosterId): { ok: boolean; msg: string } { return trialsSpendOrBuyMatch3Booster(this, boosterId); }

  public ensureMinigameLeaderboard(): MinigameLeaderboardState { return trialsEnsureMinigameLeaderboard(this); }

  public getPlayerHouse(): HouseName { return trialsGetPlayerHouse(this); }

  /** HPVN: set when the member's HPVN house is a real house; setPlayerHouse / rollPlayerSortingHat then change nothing */
  public lockedHouse: HouseName | null = null;

  public lockPlayerHouse(house: HouseName): HouseName { return trialsLockPlayerHouse(this, house); }

  public setPlayerHouse(house: HouseName, activeGameId?: LeaderboardGameId): HouseName { return trialsSetPlayerHouse(this, house, activeGameId); }

  public rollPlayerSortingHat(activeGameId?: LeaderboardGameId): HouseName { return trialsRollPlayerSortingHat(this, activeGameId); }

  public getMinigameLeaderboard(
    gameId: LeaderboardGameId,
    scope: Exclude<LeaderboardScope, 'personal'> = 'valley',
    houseFilter: 'all' | HouseName = 'all'
  ): LeaderboardStandingResult { return trialsGetMinigameLeaderboard(this, gameId, scope, houseFilter); }

  public getPlayerMinigameRank(
    gameId: LeaderboardGameId,
    scope: Exclude<LeaderboardScope, 'personal'> = 'valley'
  ): number { return trialsGetPlayerMinigameRank(this, gameId, scope); }

  public getAllPersonalLeaderboardSummaries(): PersonalDisciplineSummaryRow[] { return trialsGetAllPersonalLeaderboardSummaries(this); }

  public completeMatch3LevelVictory(
    bonusCoinsFromMoves = 0,
    sessionMetrics?: {
      sessionScore?: number;
      proofOfPlay?: ProofOfPlayEnvelope;
      completedStage?: number;
    }
  ): {
    starsEarned: number;
    goldEarned: number;
    xpEarned: number;
    sandEarned: number;
    boosterReward?: Match3BoosterId;
    nextLevel: number;
    featuredBonusApplied: boolean;
    newMasterLevel: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
    specialtyReward?: MinigameFarmSpecialtyOutcome;
  } { return trialsCompleteMatch3LevelVictory(this, bonusCoinsFromMoves, sessionMetrics); }

  public spendPuzzleHelperGold(goldCost: number): { ok: boolean; msg: string } { return trialsSpendPuzzleHelperGold(this, goldCost); }

  public getPhoenixTalismanDailyStatus(nowMs?: number) {
    return trialsGetPhoenixTalismanDailyStatus(this, nowMs);
  }

  public isPhoenixTalismanUsedToday(kind: MinigameTrialKind, nowMs?: number): boolean {
    return trialsIsPhoenixTalismanUsedToday(this, kind, nowMs);
  }

  public canUsePhoenixTalismanInGame(kind: MinigameTrialKind, nowMs?: number) {
    return trialsCanUsePhoenixTalismanInGame(this, kind, nowMs);
  }

  public getPhoenixTalismanCount(): number { return trialsGetPhoenixTalismanCount(this); }

  public grantPhoenixTalisman(qty = 1): number { return trialsGrantPhoenixTalisman(this, qty); }

  public consumePhoenixTalisman(kind?: MinigameTrialKind, nowMs?: number): { ok: boolean; msg: string } {
    return trialsConsumePhoenixTalisman(this, kind, nowMs);
  }

  public refundPhoenixTalismanAttempt(kind: MinigameTrialKind, nowMs?: number): void {
    trialsRefundPhoenixTalismanAttempt(this, kind, nowMs);
  }

  public getCraftablePhoenixBarnGood(): FarmGoodId | null { return trialsGetCraftablePhoenixBarnGood(this); }

  public craftPhoenixTalismanFromBarn(): { ok: boolean; msg: string } { return trialsCraftPhoenixTalismanFromBarn(this); }

  public recordMinigamePlay(kind: MinigamePlayDisciplineId): number {
    return trialsRecordMinigamePlay(this, kind, true, false);
  }

  public completePuzzleArcadeVictory(
    mode: PuzzleArcadeMode,
    reward: PuzzleRewardSpec,
    sessionMetrics?: {
      sessionScore?: number;
      efficiency?: number;
      proofOfPlay?: ProofOfPlayEnvelope;
      completedStage?: number;
      skipPlayCount?: boolean;
    }
  ): {
    starsEarned: number;
    sandEarned: number;
    goldEarned: number;
    xpEarned: number;
    newlyRestoredPainting: boolean;
    nextStage: number;
    featuredBonusApplied: boolean;
    newMasterLevel: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
    specialtyReward?: MinigameFarmSpecialtyOutcome;
  } { return trialsCompletePuzzleArcadeVictory(this, mode, reward, sessionMetrics); }

  public getJigsawValleyAuraPct(): number {
    return getJigsawValleyAuraPct(this.state);
  }

  public getMinigameFarmSpecialty(gameId: LeaderboardGameId): MinigameFarmSpecialtyDef {
    return getMinigameFarmSpecialty(gameId);
  }

  public claimOwlPostDelivery(gx: number, gy: number): void { return questsClaimOwlPostDelivery(this, gx, gy); }

  // ==================== HỆ THỐNG NÔNG TRẠI HANG SÓC (CANON PLAYRIX TOWNSHIP FARM LOOP) ====================

  public ensureFarmBarn(): FarmBarnState { return farmEnsureFarmBarn(this); }

  public getBarnTotalUsed(): number { return farmGetBarnTotalUsed(this); }

  public getFarmItemCount(itemId: FarmItemId): number { return farmGetFarmItemCount(this, itemId); }

  public addFarmItemToBarn(itemId: FarmItemId, qty: number): number { return farmAddFarmItemToBarn(this, itemId, qty); }

  public consumeFarmItemFromBarn(itemId: FarmItemId, qty: number): void { return farmConsumeFarmItemFromBarn(this, itemId, qty); }

  public getBarnUpgradeCostInfo(): BarnUpgradeCostInfo { return farmGetBarnUpgradeCostInfo(this); }

  public upgradeFarmBarn(): { ok: boolean; msg: string } { return farmUpgradeFarmBarn(this); }

  public sellFarmItemFromBarn(itemId: FarmItemId, qty = 1): { ok: boolean; msg: string } { return farmSellFarmItemFromBarn(this, itemId, qty); }

  public ensureLanguageQuiz(): LanguageQuizState { return farmEnsureLanguageQuiz(this); }

  public getSeedCount(cropId: FarmCropId): number { return farmGetSeedCount(this, cropId); }

  public getPlantableSeedCount(cropId: FarmCropId): number { return farmGetPlantableSeedCount(this, cropId); }

  public getHayDayWheatingProgress(): { current: number; threshold: number; totalDrops: number } {
    return getHayDayWheatingProgress(this);
  }

  public getWorkshopMastery(workshopGroupId: string): WorkshopMasteryInfo {
    const count = Math.max(0, Math.floor(this.state.workshopMastery?.[workshopGroupId] ?? 0));
    return getWorkshopMasteryInfo(count);
  }

  public getEffectiveWorkshopQueueCapacity(b: Pick<PlacedBuilding, 'stars' | 'extraQueueSlots'>): number {
    return getEffectiveWorkshopQueueCapacity(b);
  }

  public getNextWorkshopExtraSlotCost(b: Pick<PlacedBuilding, 'extraQueueSlots'>): number | null {
    return getNextWorkshopExtraSlotCost(b);
  }

  public expandWorkshopQueueSlot(uid: string): { ok: boolean; msg: string; newCapacity?: number } {
    return expandWorkshopQueueSlot(this, uid);
  }

  public getFarmVisitors(nowMs = Date.now()): FarmVisitorOffer[] {
    return ensureFarmVisitors(this, nowMs);
  }

  public getActiveFarmVisitorsCount(nowMs = Date.now()): number {
    return getActiveFarmVisitorsCount(this, nowMs);
  }

  public acceptFarmVisitorOffer(
    visitorId: string,
    nowMs = Date.now()
  ): { ok: boolean; msg: string; earnedSickle: number } {
    return acceptFarmVisitorOffer(this, visitorId, nowMs);
  }

  public dismissFarmVisitorOffer(visitorId: string, nowMs = Date.now()): { ok: boolean; msg: string } {
    return dismissFarmVisitorOffer(this, visitorId, nowMs);
  }

  public getDailyProphetNewspaper(nowMs = Date.now()): DailyProphetNewspaperState {
    return ensureDailyProphetNewspaper(this, nowMs);
  }

  public buyNewspaperClassifiedAd(adId: string, nowMs = Date.now()): { ok: boolean; msg: string } {
    return buyNewspaperClassifiedAd(this, adId, nowMs);
  }

  public refreshDailyProphetNewspaperEarly(
    nowMs = Date.now()
  ): { ok: boolean; msg: string; edition: DailyProphetNewspaperState } {
    return refreshDailyProphetNewspaperEarly(this, nowMs);
  }

  public addCropSeeds(cropId: FarmCropId, qty: number): number { return farmAddCropSeeds(this, cropId, qty); }

  public buyCropSeedWithGold(
    cropId: FarmCropId,
    qty = 1
  ): { ok: boolean; msg: string; newSeedCount: number } { return farmBuyCropSeedWithGold(this, cropId, qty); }

  public completeSeedLanguageQuizAttempt(
    cropId: FarmCropId,
    challenge: ActiveQuizChallenge,
    correct: boolean
  ): QuizAttemptOutcome & {
    newSeedCount: number;
    cropName: string;
    specialtyReward?: MinigameFarmSpecialtyOutcome;
    streakShieldConsumed?: boolean;
  } { return farmCompleteSeedLanguageQuizAttempt(this, cropId, challenge, correct); }

  public plantCropOnPlot(
    uid: string,
    cropId: FarmCropId
  ): { ok: boolean; needSeedAcquire?: boolean; msg: string } { return farmPlantCropOnPlot(this, uid, cropId); }

  public waterCropPlot(uid: string): { ok: boolean; msg: string } { return farmWaterCropPlot(this, uid); }

  public harvestCropPlot(uid: string): { ok: boolean; msg: string } { return farmHarvestCropPlot(this, uid); }

  public stockAnimalOnPasture(
    uid: string,
    animalId: PastureAnimalId
  ): { ok: boolean; msg: string } { return farmStockAnimalOnPasture(this, uid, animalId); }

  public feedAnimalPasture(uid: string): { ok: boolean; msg: string } { return farmFeedAnimalPasture(this, uid); }

  public harvestAnimalPasture(uid: string): { ok: boolean; msg: string } { return farmHarvestAnimalPasture(this, uid); }

  public clearAnimalFromPasture(uid: string): { ok: boolean; msg: string } { return farmClearAnimalFromPasture(this, uid); }

  public getPlotEffectiveSoilTier(b: Pick<PlacedBuilding, 'gx' | 'gy' | 'soilTier'>): SoilFertilityTier {
    return farmGetPlotEffectiveSoilTier(this, b);
  }

  public getPlotSoilUpgradeCostInfo(uid: string): PlotSoilUpgradeCostInfo | null {
    return farmGetPlotSoilUpgradeCostInfo(this, uid);
  }

  public upgradePlotSoilTier(uid: string): { ok: boolean; msg: string; newTier?: SoilFertilityTier } {
    return farmUpgradePlotSoilTier(this, uid);
  }

  public fertilizeCropPlotWithCompost(uid: string): { ok: boolean; msg: string } {
    return farmFertilizeCropPlotWithCompost(this, uid);
  }

  public getAvailableGourmetFeedCrop(): FarmCropId | null {
    return farmGetAvailableGourmetFeedCrop(this);
  }

  public feedAnimalPastureGourmet(uid: string): { ok: boolean; msg: string; cropUsed?: FarmCropId } {
    return farmFeedAnimalPastureGourmet(this, uid);
  }

  public ensureMarketFairState(): HogsmeadeMarketFairState {
    return farmEnsureMarketFairState(this);
  }

  public isItemMarketSpotlight(itemId: FarmItemId): boolean {
    return farmIsItemMarketSpotlight(this, itemId);
  }

  public getOwlOrderSpotlightBonus(order: Pick<FarmOwlOrder, 'requirements'>): {
    hasSpotlight: boolean;
    bonusCompost: number;
    bonusXp: number;
    bonusFeastPoints: number;
  } {
    return farmGetOwlOrderSpotlightBonus(this, order);
  }

  public sellMarketSpotlightLot(kind: 'crop' | 'good'): { ok: boolean; msg: string } {
    return farmSellMarketSpotlightLot(this, kind);
  }

  public fulfillMarketFairDeal(dealId: string): { ok: boolean; msg: string } {
    return farmFulfillMarketFairDeal(this, dealId);
  }

  public rerollMarketFairDeals(): { ok: boolean; msg: string } {
    return farmRerollMarketFairDeals(this);
  }

  public replantPlotLastCrop(uid: string): { ok: boolean; needSeedAcquire?: boolean; cropId?: FarmCropId; msg: string } {
    return farmReplantPlotLastCrop(this, uid);
  }

  public batchReplantLastCrops(): { ok: boolean; count: number; msg: string } {
    return farmBatchReplantLastCrops(this);
  }

  public reviveFruitTree(uid: string, friendHelperName?: string): { ok: boolean; msg: string } {
    return farmReviveFruitTree(this, uid, friendHelperName);
  }

  public locateItemSource(itemId: FarmItemId): LocatedItemSource {
    return farmLocateItemSource(this, itemId);
  }

  public ensureRoadsideStand() {
    return ensureRoadsideStand(this.state);
  }

  public listOnRoadsideStand(
    slotIndex: number,
    itemId: FarmItemId,
    qty: number,
    tier: RoadsidePriceTier = 'fair',
    nowMs = Date.now()
  ): { ok: boolean; msg: string } {
    return listOnRoadsideStand(this, slotIndex, itemId, qty, tier, nowMs);
  }

  public tickRoadsideStandBuyers(nowMs = Date.now(), silent = false): boolean {
    return tickRoadsideStandBuyers(this, nowMs, silent);
  }

  public claimRoadsideStandSlot(slotIndex: number): { ok: boolean; msg: string; earnedSickle: number } {
    return claimRoadsideStandSlot(this, slotIndex);
  }

  public advertiseRoadsideStandSlot(slotIndex: number, nowMs = Date.now()): { ok: boolean; msg: string } {
    return advertiseRoadsideStandSlot(this, slotIndex, nowMs);
  }

  public getNeighborRoadsideOffer(neighbor: NeighborProfileState) {
    return getNeighborRoadsideOffer(neighbor);
  }

  public buyVisitedNeighborRoadsideOffer(
    options?: { atomicServerVerified?: boolean; expectedSlotIndex?: number }
  ): { ok: boolean; msg: string } {
    return buyVisitedNeighborRoadsideOffer(this, options);
  }

  public isFarmHelperActive(nowMs = Date.now()): boolean {
    return isFarmHelperActive(this.state, nowMs);
  }

  public activateFarmHelper(
    mode: 'free_daily' | 'feast_points' | 'sickle',
    nowMs = Date.now()
  ): { ok: boolean; msg: string; endsAt: number } {
    return activateFarmHelper(this, mode, nowMs);
  }

  public spawnFieldMicroEvent(nowMs = Date.now(), forcedKind?: FieldMicroEventKind): FieldMicroEvent | null {
    return spawnFieldMicroEvent(this, nowMs, forcedKind);
  }

  public claimFieldMicroEvent(nowMs = Date.now()): { ok: boolean; msg: string; earnedSickle: number } {
    return claimFieldMicroEvent(this, nowMs);
  }

  public beginBuildStroke(): void { return buildTxnBeginStroke(this); }
  public commitBuildStroke(): void { return buildTxnCommitStroke(this); }
  public noteBuildMutation(): void { return buildTxnNoteMutation(this); }
  public canUndoBuild(): boolean { return buildTxnCanUndo(this); }
  public canRedoBuild(): boolean { return buildTxnCanRedo(this); }
  public cancelBuildStroke(): void { return buildTxnCancelStroke(this); }
  public undoBuild(): boolean { return buildTxnUndo(this); }
  public redoBuild(): boolean { return buildTxnRedo(this); }

  public batchWaterCropPlots(uids: string[]): FarmBatchResult { return farmBatchWaterCrops(this, uids); }

  public batchHarvestCropPlots(uids: string[]): FarmBatchResult { return farmBatchHarvestCrops(this, uids); }

  public batchFeedAnimalPastures(uids: string[]): FarmBatchResult { return farmBatchFeedPastures(this, uids); }

  public batchHarvestAnimalPastures(uids: string[]): FarmBatchResult { return farmBatchHarvestPastures(this, uids); }

  public batchPlantCropPlots(uids: string[], cropId: FarmCropId): FarmBatchResult {
    return farmBatchPlantCrops(this, uids, cropId);
  }

  public getWorkshopRecipesForBuilding(item: CatalogItem): FarmWorkshopRecipe[] { return questsGetWorkshopRecipesForBuilding(this, item); }

  public enqueueWorkshopRecipe(uid: string, recipeId: string): { ok: boolean; msg: string } { return questsEnqueueWorkshopRecipe(this, uid, recipeId); }

  public speedUpWorkshopSlot(uid: string): boolean { return questsSpeedUpWorkshopSlot(this, uid); }

  public getOwlRequirementHelpState(
    orderId: string,
    reqIndex: number
  ): NeighborSocialState['playerOwlHelpRequests'][number] | undefined { return questsGetOwlRequirementHelpState(this, orderId, reqIndex); }

  public canFulfillFarmOwlOrder(order: FarmOwlOrder): boolean { return questsCanFulfillFarmOwlOrder(this, order); }

  public getReadyOwlOrdersCount(): number { return questsGetReadyOwlOrdersCount(this); }

  public fulfillFarmOwlOrder(orderId: string): { ok: boolean; msg: string } { return questsFulfillFarmOwlOrder(this, orderId); }

  public refreshFarmOwlOrder(orderId: string): boolean { return questsRefreshFarmOwlOrder(this, orderId); }

  public getOwlRerollsLeft(): number { return questsGetOwlRerollsLeft(this); }

  public trashFarmOwlOrder(orderId: string, nowMs = Date.now()): { ok: boolean; msg: string } {
    return questsTrashFarmOwlOrder(this, orderId, nowMs);
  }

  public tickTrashedOwlOrders(nowMs = Date.now()): boolean {
    return questsTickTrashedOwlOrders(this, nowMs);
  }

  public instantRestoreTrashedOwlOrder(orderId: string, nowMs = Date.now()): { ok: boolean; msg: string } {
    return questsInstantRestoreTrashedOwlOrder(this, orderId, nowMs);
  }

  // =========================================================================
  // HỆ THỐNG THAM QUAN, TƯƠNG TRỢ VƯỜN & GIẢI CỨU MÀN KHÓ (1 NGÀY 1 LẦN / BẠN)
  // =========================================================================

  public ensureNeighborSocial(): NeighborSocialState { return socialEnsureNeighborSocial(this); }

  private pushSocialActivity(icon: string, textVi: string, now = Date.now()): void { return socialPushSocialActivity(this, icon, textVi, now); }

  public getActiveVisitingNeighbor(): NeighborProfileState | null { return socialGetActiveVisitingNeighbor(this); }

  public getHomeOwnerParkName(): string { return socialGetHomeOwnerParkName(this); }

  public enterNeighborVisit(neighborId: string): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } { return socialEnterNeighborVisit(this, neighborId); }

  public exitNeighborVisit(silent = false): {
    ok: boolean;
    focusGx: number;
    focusGy: number;
  } { return socialExitNeighborVisit(this, silent); }

  public cycleNextNeighborVisit(): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } { return socialCycleNextNeighborVisit(this); }

  public setNeighborPresetNote(noteId: NeighborPresetNoteId): void { return socialSetNeighborPresetNote(this, noteId); }

  public addFriendByCode(
    rawCode: string,
    customName?: string,
    verifiedProfile?: VerifiedRealPlayerProfile
  ): { ok: boolean; msg: string; neighbor?: NeighborProfileState } { return socialAddFriendByCode(this, rawCode, customName, verifiedProfile); }

  public addVerifiedRealFriend(
    profile: VerifiedRealPlayerProfile,
    customName?: string
  ): { ok: boolean; msg: string; neighbor?: NeighborProfileState } { return socialAddVerifiedRealFriend(this, profile, customName); }

  public syncVerifiedFriendSnapshot(profile: VerifiedRealPlayerProfile): boolean { return socialSyncVerifiedFriendSnapshot(this, profile); }

  public removeNeighborFriend(neighborId: string): { ok: boolean; msg: string } { return socialRemoveNeighborFriend(this, neighborId); }

  public getVisitedBuildingHelpStatus(
    b: PlacedBuilding,
    now = Date.now()
  ): {
    canHelp: boolean;
    kind: NeighborGardenHelpKind | null;
    existingMark?: NeighborProfileState['helpedMarksToday'][number];
  } { return socialGetVisitedBuildingHelpStatus(this, b, now); }

  public helpVisitedNeighborBuilding(buildingUid: string): { ok: boolean; msg: string } { return socialHelpVisitedNeighborBuilding(this, buildingUid); }

  public likeVisitedNeighborFarm(targetNeighborId?: string): { ok: boolean; msg: string } { return socialLikeVisitedNeighborFarm(this, targetNeighborId); }

  public canClaimVisitedMysteryGift(): boolean { return socialCanClaimVisitedMysteryGift(this); }

  public claimVisitedNeighborMysteryGift(): { ok: boolean; msg: string } { return socialClaimVisitedNeighborMysteryGift(this); }

  public fulfillNeighborOwlCrate(
    neighborId: string,
    crateId: string
  ): { ok: boolean; msg: string } { return socialFulfillNeighborOwlCrate(this, neighborId, crateId); }

  public canRescueNeighborMinigame(neighborId: string): {
    ok: boolean;
    reason?: string;
    sos?: NeighborMinigameSos;
    neighbor?: NeighborProfileState;
  } { return socialCanRescueNeighborMinigame(this, neighborId); }

  public completeNeighborMinigameRescue(ctx: MinigameRescueContext): {
    ok: boolean;
    msg: string;
    tokensEarned: number;
    goldEarned: number;
    xpEarned: number;
    buildReduction?: BuildReductionResult;
  } { return socialCompleteNeighborMinigameRescue(this, ctx); }

  public openFriendshipChest(): {
    ok: boolean;
    msg: string;
    starsEarned: number;
    talismanEarned: number;
    sandEarned: number;
    goldEarned: number;
    seedCropId?: FarmCropId;
    seedQty?: number;
  } { return socialOpenFriendshipChest(this); }

  public claimHomeLanternMark(markIdOrBuildingUid: string): { ok: boolean; msg: string } { return socialClaimHomeLanternMark(this, markIdOrBuildingUid); }

  public requestPlayerOwlCrateHelp(
    orderId: string,
    reqIndex: number
  ): { ok: boolean; msg: string } { return socialRequestPlayerOwlCrateHelp(this, orderId, reqIndex); }

  public requestPlayerMinigameSos(
    kind: MinigameTrialKind,
    stage: number
  ): { ok: boolean; msg: string } { return socialRequestPlayerMinigameSos(this, kind, stage); }

  public claimPlayerMinigameSosRescue(): {
    ok: boolean;
    msg: string;
    kind?: MinigameTrialKind;
    clearedStage?: number;
    nextStage?: number;
  } { return socialClaimPlayerMinigameSosRescue(this); }

  public getActiveHonorGardenTour(): HonorGardenTourDef | null {
    return socialGetActiveHonorGardenTour(this);
  }

  public enterHonorGardenTour(tourId = 'tour_hagrid'): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } {
    return socialEnterHonorGardenTour(this, tourId);
  }

  public cycleHonorGardenTour(dir: 1 | -1 = 1): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } {
    return socialCycleHonorGardenTour(this, dir);
  }

  public syncFlooDirectoryMembers(
    rows: ReadonlyArray<FlooVisitDirectoryRow>,
    ownUid?: string,
    nowMs = Date.now()
  ): NeighborProfileState[] {
    return socialSyncFlooDirectoryMembers(this, rows, ownUid, nowMs);
  }

  public helpVisitedFlooMemberWholeGarden(options?: {
    alreadySyncedServer?: boolean;
    serverHelpsLeft?: number;
  }): { ok: boolean; msg: string; helpsLeft: number } {
    return socialHelpVisitedFlooMemberWholeGarden(this, options);
  }

  public recordFlooShareOrPostcard(kind: 'postcard' | 'shareFloo'): {
    rewarded: boolean;
    msg: string;
  } {
    return socialRecordFlooShareOrPostcard(this, kind);
  }

  /**
   * Mô phỏng phản hồi hai chiều sống động từ hội bạn bè Canon/Mã Cú (sẵn sàng thay bằng WebSocket/REST sau này).
   */
  public tickNeighborSocialBackground(now = Date.now()): void { return socialTickNeighborSocialBackground(this, now); }

  public ensureTutorialState(): TutorialState { return villagersEnsureTutorialState(this); }

  public isTutorialActive(): boolean { return villagersIsTutorialActive(this); }

  public getCurrentTutorialStep(): TutorialStepDef | null { return villagersGetCurrentTutorialStep(this); }

  public getTutorialWorldTarget(): {
    uid: string;
    gx: number;
    gy: number;
    bw: number;
    bh: number;
    label: string;
  } | null { return villagersGetTutorialWorldTarget(this); }

  public advanceTutorialStep(expectedStepId?: TutorialStepId): boolean { return villagersAdvanceTutorialStep(this, expectedStepId); }

  public skipTutorial(): void { return villagersSkipTutorial(this); }

  public restartTutorial(): void { return villagersRestartTutorial(this); }

  // ==================== DÂN LÀNG HANG SÓC DẠO BỘ, LỄ CẮT BĂNG & ĐẠI TIỆC MÙA GẶT 30 BẬC ====================

  private collectVillagerWalkSpots(): Array<{ gx: number; gy: number; isPoi: boolean }> { return villagersCollectVillagerWalkSpots(this); }

  public syncValleyVillagers(): void { return villagersSyncValleyVillagers(this); }

  private updateValleyVillagers(dt: number, unlockedSet: Set<string>): void { return villagersUpdateValleyVillagers(this, dt, unlockedSet); }

  public greetVillager(id: ValleyVillagerId): { ok: boolean; msg: string; bonusSickle: number } { return villagersGreetVillager(this, id); }

  public unveilBuilding(uid: string): RibbonUnveilCelebration | null { return questsUnveilBuilding(this, uid); }

  public ensureHarvestFeast(): HarvestFeastState { return questsEnsureHarvestFeast(this); }

  public addHarvestFeastPoints(pts: number): { added: number; newlyUnlockedTiers: number[] } { return questsAddHarvestFeastPoints(this, pts); }

  public getClaimableHarvestFeastCount(): number { return questsGetClaimableHarvestFeastCount(this); }

  private grantHarvestFeastTierRewardInternal(tier: number): string | null { return questsGrantHarvestFeastTierRewardInternal(this, tier); }

  public claimHarvestFeastTier(tier: number): { ok: boolean; msg: string } { return questsClaimHarvestFeastTier(this, tier); }

  public claimAllHarvestFeastTiers(): { ok: boolean; claimedCount: number; msg: string } { return questsClaimAllHarvestFeastTiers(this); }

  public startNextHarvestFeastCycle(): { ok: boolean; msg: string } { return questsStartNextHarvestFeastCycle(this); }

  // ==================== AAA P3–P5: THÀNH TỰU, ĐIỂM DANH 7 NGÀY, TÌNH BẠN NPC, SAVE SLOTS & KIẾN TRÚC SƯ BỐ CỤC ====================

  public checkAndToastAchievements(now = Date.now()): string[] {
    if (this.isHeadmasterPreview || this.isVisitingHonorTour) return [];
    if (this.homeStateWhileVisiting) {
      this.syncPlayerPrimitivesToHomeState();
    }
    const targetState = this.homeStateWhileVisiting ?? this.state;
    if (targetState.sandboxMode) return [];

    const newlyUnlocked = evaluateAchievements(targetState, now);
    const ret = ensureRetentionState(targetState);
    if (this.homeStateWhileVisiting) {
      this.state.retention = ret;
    }
    let stateMutated = newlyUnlocked.length > 0;

    // Auto-unlock story cutscene chapters by level
    for (const chap of STORY_CUTSCENE_CHAPTERS) {
      if (targetState.level >= chap.unlockLevel && !ret.unlockedStoryChapters.includes(chap.id)) {
        ret.unlockedStoryChapters.push(chap.id);
        stateMutated = true;
        this.onToast?.(`🎬 Mở khoá Phim Cốt Truyện: ${chap.titleVi}!`, '🎬');
      }
    }

    if (this.onToast && ret.pendingToasts.length > 0) {
      const toDisplay: Array<(typeof ACHIEVEMENT_REGISTRY)[number]> = [];
      while (ret.pendingToasts.length > 0) {
        const achId = ret.pendingToasts.shift()!;
        const entry = ret.achievements[achId];
        if (!entry?.unlockedAt || entry.notifiedAt) {
          stateMutated = true;
          continue;
        }
        entry.notifiedAt = now;
        stateMutated = true;
        const def = ACHIEVEMENT_REGISTRY.find((a) => a.id === achId);
        if (def) {
          toDisplay.push(def);
        }
      }

      if (toDisplay.length === 1) {
        const def = toDisplay[0];
        this.onToast(
          `🏅 Đạt Thành Tựu: ${def.titleVi} (+${def.rewardSickle} Sickle, +${def.rewardStars} 🌟 — nhận tại Hồ Sơ!)`,
          def.icon
        );
      } else if (toDisplay.length > 1) {
        const top = toDisplay[toDisplay.length - 1];
        const sumGold = toDisplay.reduce((acc, d) => acc + d.rewardSickle, 0);
        const sumStars = toDisplay.reduce((acc, d) => acc + d.rewardStars, 0);
        this.onToast(
          `🏅 Mở khoá ${toDisplay.length} Thành Tựu mới (${top.titleVi}...) • +${sumGold} Sickle, +${sumStars} 🌟 — nhận tại Hồ Sơ!`,
          top.icon
        );
      }
    }

    if (stateMutated) {
      this.saveToStorage();
    }
    return newlyUnlocked;
  }

  /**
   * Đồng bộ ngược ví nguyên thuỷ & trạng thái lễ hội/bách khoa đã cộng vào `homeStateWhileVisiting`
   * sang `this.state` trước khi `saveToStorage()` chạy `lifecycleSyncPlayerPrimitivesToHomeState`.
   */
  public syncClaimedHomePrimitivesToVisitState(): void {
    const h = this.homeStateWhileVisiting;
    if (!h) return;
    this.state.galleons = h.galleons;
    this.state.timeSand = h.timeSand;
    this.state.phoenixTalismans = h.phoenixTalismans;
    this.state.herbalCompost = h.herbalCompost;
    this.state.morningDewPhials = h.morningDewPhials;
    if (h.seasonalFestivalState) this.state.seasonalFestivalState = h.seasonalFestivalState;
    if (h.almanacState) this.state.almanacState = h.almanacState;
  }

  public claimAchievement(achId: string): {
    ok: boolean;
    msg: string;
    rewardSickle: number;
    rewardStars: number;
  } {
    if (this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return { ok: false, msg: 'Đang ở chế độ tham quan — hãy về vườn nhà để nhận thưởng!', rewardSickle: 0, rewardStars: 0 };
    }
    const targetState = this.homeStateWhileVisiting ?? this.state;
    const def = ACHIEVEMENT_REGISTRY.find((a) => a.id === achId);
    const res = claimAchievementReward(targetState, achId);
    if (!res.ok || !def) {
      return { ok: false, msg: 'Thành tựu chưa mở khoá hoặc đã nhận thưởng!', rewardSickle: 0, rewardStars: 0 };
    }
    if (res.rewardStars > 0) {
      targetState.match3.stars += res.rewardStars;
      targetState.match3.totalStarsEarned += res.rewardStars;
      this.onRewardFly?.('stars', res.rewardStars);
    }
    if (res.rewardSickle > 0) {
      this.onRewardFly?.('galleons', res.rewardSickle);
    }
    this.syncClaimedHomePrimitivesToVisitState();
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🎖️ Đã nhận thưởng "${def.titleVi}": +${res.rewardSickle} Sickle & +${res.rewardStars} 🌟!`,
      rewardSickle: res.rewardSickle,
      rewardStars: res.rewardStars,
    };
  }

  public claimAllAchievements(): {
    ok: boolean;
    msg: string;
    claimedCount: number;
    rewardSickle: number;
    rewardStars: number;
  } {
    if (this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return {
        ok: false,
        msg: 'Đang ở chế độ tham quan — hãy về vườn nhà để nhận thưởng!',
        claimedCount: 0,
        rewardSickle: 0,
        rewardStars: 0,
      };
    }
    const targetState = this.homeStateWhileVisiting ?? this.state;
    const res = claimAllUnlockedAchievements(targetState);
    if (res.claimedIds.length === 0) {
      return {
        ok: false,
        msg: 'Hiện chưa có thành tựu mới chờ nhận thưởng!',
        claimedCount: 0,
        rewardSickle: 0,
        rewardStars: 0,
      };
    }
    if (res.totalStars > 0) {
      targetState.match3.stars += res.totalStars;
      targetState.match3.totalStarsEarned += res.totalStars;
      this.onRewardFly?.('stars', res.totalStars);
    }
    if (res.totalSickle > 0) {
      this.onRewardFly?.('galleons', res.totalSickle);
    }
    this.syncClaimedHomePrimitivesToVisitState();
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🎖️ Đã nhận gộp ${res.claimedIds.length} Thành Tựu: +${res.totalSickle.toLocaleString('vi-VN')} Sickle & +${res.totalStars} 🌟!`,
      claimedCount: res.claimedIds.length,
      rewardSickle: res.totalSickle,
      rewardStars: res.totalStars,
    };
  }

  public getClaimableRetentionCount(): {
    claimableAchievements: number;
    claimableLoginDays: number;
    total: number;
  } {
    const targetState = this.homeStateWhileVisiting ?? this.state;
    if (this.isHeadmasterPreview || this.isVisitingHonorTour || targetState.sandboxMode) {
      return { claimableAchievements: 0, claimableLoginDays: 0, total: 0 };
    }
    return getClaimableRetentionCount(targetState, this.getUnlockedLoginDayMax(targetState));
  }

  public getUnlockedLoginDayMax(targetState = this.homeStateWhileVisiting ?? this.state): number {
    const ret = ensureRetentionState(targetState);
    const todayKey = getLocalDateKey();
    if (ret.lastLoginClaimDayKey === todayKey) {
      return Math.min(7, Math.max(1, ret.claimedLoginDays.length));
    }
    return Math.min(7, Math.max(1, ret.claimedLoginDays.length + 1));
  }

  public claimLoginDayReward(dayNumber: number): { ok: boolean; msg: string } {
    if (this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return { ok: false, msg: 'Đang ở chế độ tham quan — hãy về vườn nhà để nhận quà điểm danh!' };
    }
    const targetState = this.homeStateWhileVisiting ?? this.state;
    const ret = ensureRetentionState(targetState);
    const todayKey = getLocalDateKey();
    if (ret.claimedLoginDays.includes(dayNumber)) {
      return { ok: false, msg: 'Quà điểm danh ngày này đã được nhận!' };
    }
    if (ret.lastLoginClaimDayKey === todayKey) {
      return { ok: false, msg: 'Hôm nay bạn đã nhận quà điểm danh rồi — hẹn quay lại vào ngày mai nhé!' };
    }
    const maxDay = this.getUnlockedLoginDayMax(targetState);
    if (dayNumber !== maxDay) {
      return { ok: false, msg: `Hãy nhận quà Ngày ${maxDay} trước nhé!` };
    }
    const res = claimDailyRetentionReward(targetState, dayNumber, todayKey);
    if (!res.ok || !res.reward) {
      return { ok: false, msg: 'Quà điểm danh ngày này đã được nhận!' };
    }
    if (res.reward.magicStars > 0) {
      targetState.match3.stars += res.reward.magicStars;
      targetState.match3.totalStarsEarned += res.reward.magicStars;
      this.onRewardFly?.('stars', res.reward.magicStars);
    }
    this.syncClaimedHomePrimitivesToVisitState();
    this.onRewardFly?.('galleons', res.reward.galleons);
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📅 Nhận ${res.reward.titleVi}: +${res.reward.galleons} Sickle, +${res.reward.magicStars} 🌟${
        res.reward.phoenixTalismans > 0 ? `, +${res.reward.phoenixTalismans} Bùa` : ''
      }!`,
    };
  }

  public talkWithVillagerChoice(
    villagerId: ValleyVillagerId,
    choiceIndex: 0 | 1
  ): { ok: boolean; msg: string; level: number; leveledUp: boolean } {
    const todayKey = getLocalDateKey();
    const ret = ensureRetentionState(this.state);
    const alreadyTalkedToday = ret.npcFriendship[villagerId]?.lastTalkedDayKey === todayKey;
    if (alreadyTalkedToday) {
      return {
        ok: false,
        msg: 'Hôm nay bạn đã trò chuyện tâm tình cùng cư dân này rồi — mai ghé lại nhé!',
        level: ret.npcFriendship[villagerId]?.level ?? 1,
        leveledUp: false,
      };
    }
    const res = answerVillagerDialogue(this.state, villagerId, choiceIndex, todayKey);
    const vEntity = this.villagers.find((x) => x.id === villagerId);
    if (vEntity) {
      vEntity.greetReactTimer = 2.4;
      vEntity.pauseTimer = Math.max(vEntity.pauseTimer, 3.2);
    }
    this.audio.playVillagerVoiceBark?.(villagerId);
    const bonusGold = res.leveledUp ? 25 : 6;
    this.state.galleons += bonusGold;
    this.addXp(res.leveledUp ? 15 : 5);
    if (res.leveledUp) {
      this.state.match3.stars += 1;
      this.state.match3.totalStarsEarned += 1;
      this.audio.playLevelUp();
    } else {
      this.audio.playSpell();
    }
    this.checkAndToastAchievements();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `💝 "${res.replyVi}" (+${bonusGold} Sickle${res.leveledUp ? `, Lên Cấp Thân Thiết ${res.level} +1 🌟!` : ''})`,
      level: res.level,
      leveledUp: res.leveledUp,
    };
  }

  public giftItemToVillager(
    villagerId: ValleyVillagerId,
    itemId: FarmItemId
  ): { ok: boolean; msg: string; isFavorite: boolean; newLevel: number; leveledUp: boolean } {
    return giftItemToVillager(this, villagerId, itemId);
  }

  public claimVillagerKeepsake(villagerId: ValleyVillagerId): { ok: boolean; msg: string } {
    return claimVillagerKeepsake(this, villagerId);
  }

  public setActiveRoamingPet(habitatUid: string | null): { ok: boolean; msg: string } {
    return setActiveRoamingPet(this, habitatUid);
  }

  public petRoamingCompanion(nowMs = Date.now()): { ok: boolean; msg: string; earnedSickle: number } {
    return petRoamingCompanion(this, nowMs);
  }

  public toggleStrollMode(force?: boolean): { ok: boolean; active: boolean; msg: string } {
    return togglePlayerStrollMode(this, force);
  }

  public setStrollDestination(gx: number, gy: number): boolean {
    return setStrollDestination(this, gx, gy);
  }

  public castStrollCareWave(): { tendedCount: number; msg: string } {
    return castStrollCareWave(this);
  }

  public setStrollRobe(robeId: import('../types/game').StrollRobeId): {
    ok: boolean;
    robe: StrollRobeMeta;
    msg: string;
  } {
    return setPlayerStrollRobe(this, robeId);
  }

  public cycleStrollRobe(): { ok: boolean; robe: StrollRobeMeta; msg: string } {
    return cyclePlayerStrollRobe(this);
  }

  public ensureCoopSupplyCrate(nowMs = Date.now()): CoopSupplyCrateState {
    return ensureCoopSupplyCrate(this.homeStateWhileVisiting ?? this.state, nowMs);
  }

  public getNeighborhoodCoopSummary(nowMs = Date.now()): NeighborhoodCoopSummary {
    return getNeighborhoodCoopSummary(this, nowMs);
  }

  public contributeToCoopSupplyCrate(
    itemId: FarmItemId,
    qty = 2
  ): { ok: boolean; msg: string; addedPoints: number } {
    return contributeToCoopSupplyCrate(this, itemId, qty);
  }

  public claimCoopCrateMilestone(step: 1 | 2 | 3): { ok: boolean; msg: string } {
    return claimCoopCrateMilestone(this, step);
  }

  public setPostcardFrameTheme(theme: PostcardFrameThemeId): { ok: boolean; theme: PostcardFrameThemeId } {
    return setPostcardFrameTheme(this, theme);
  }

  public leaveMysteryGiftForNeighbor(): { ok: boolean; msg: string } {
    return leaveMysteryGiftForNeighbor(this);
  }

  public claimHomeVisitorMysteryGift(giftId?: string): { ok: boolean; msg: string; earnedSickle: number } {
    return claimHomeVisitorMysteryGift(this, giftId);
  }

  public getActiveSeasonalFestivalDef(now = new Date()): SeasonalFestivalDef | null {
    return getActiveSeasonalFestivalDef(this, now);
  }

  public getSeasonalFestivalTaskProgress(taskId: string): number {
    return getSeasonalFestivalTaskProgress(this, taskId);
  }

  public claimSeasonalFestivalTask(taskId: string): { ok: boolean; msg: string } {
    return claimSeasonalFestivalTask(this, taskId);
  }

  public claimDailyTetLiXi(nowMs = Date.now()): { ok: boolean; msg: string } {
    return claimDailyTetLiXi(this, nowMs);
  }

  public evaluateCollectionAlmanac(): {
    chapters: AlmanacChapterSummary[];
    claimableCount: number;
    allChaptersClaimed: boolean;
    grandTrophyClaimed: boolean;
  } {
    return evaluateCollectionAlmanac(this);
  }

  public claimAlmanacChapterReward(
    chapterId: AlmanacChapterId | 'grand_trophy'
  ): { ok: boolean; msg: string } {
    return claimAlmanacChapterReward(this, chapterId);
  }

  public claimQuizDailyStreakMilestone(days: 3 | 7 | 14 | 30): { ok: boolean; msg: string } {
    if (this.isHeadmasterPreview || this.isVisitingHonorTour) {
      return { ok: false, msg: 'Hãy về vườn nhà để nhận quà Chuỗi Học Hằng Ngày!' };
    }
    const targetState = this.homeStateWhileVisiting ?? this.state;
    const quiz = this.ensureLanguageQuiz();
    const def = QUIZ_STREAK_MILESTONES.find((m) => m.days === days);
    if (!def) return { ok: false, msg: 'Mốc Chuỗi Học không hợp lệ!' };
    if (!Array.isArray(quiz.claimedStreakMilestones)) {
      quiz.claimedStreakMilestones = [];
    }
    if (quiz.claimedStreakMilestones.includes(days)) {
      return { ok: false, msg: 'Bạn đã nhận phần thưởng mốc Chuỗi Học này rồi!' };
    }
    const bestStreak = Math.max(quiz.dailyStreakCount ?? 0, quiz.bestDailyStreakCount ?? 0);
    if (!targetState.sandboxMode && bestStreak < days) {
      return {
        ok: false,
        msg: `Cần duy trì Chuỗi Học ${days} ngày (hiện đạt ${bestStreak}/${days} ngày)!`,
      };
    }
    quiz.claimedStreakMilestones.push(days);
    targetState.galleons += def.rewardSickle;
    const parts = [`+${def.rewardSickle} Sickle`];
    if (def.rewardCompost) {
      targetState.herbalCompost = (targetState.herbalCompost ?? 0) + def.rewardCompost;
      parts.push(`+${def.rewardCompost} 🌿`);
    }
    if (def.rewardSand) {
      targetState.timeSand += def.rewardSand;
      parts.push(`+${def.rewardSand} ⏳`);
    }
    if (def.rewardStars) {
      targetState.match3.stars += def.rewardStars;
      targetState.match3.totalStarsEarned += def.rewardStars;
      parts.push(`+${def.rewardStars} 🌟`);
    }
    this.syncClaimedHomePrimitivesToVisitState();
    this.onRewardFly?.('galleons', def.rewardSickle);
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📖 Đã nhận thưởng "${def.labelVi}": ${parts.join(' · ')}!`,
    };
  }

  public saveNamedProfileSlot(slotId: SaveSlotId): SaveSlotMetadata {
    const baseState = this.homeStateWhileVisiting ?? this.state;
    const meta = saveToNamedSlot(baseState, slotId);
    this.saveToStorage();
    this.onUiChange?.();
    return meta;
  }

  public loadNamedProfileSlot(_slotId: SaveSlotId): { ok: boolean; msg: string } {
    // HPVN: the server keeps one farm; there are no browser save slots to load
    return { ok: false, msg: 'Trang trại lưu trên máy chủ HPVN, không có hồ sơ khác.' };
  }

  public isLayoutEditModeActive(): boolean {
    return this.layoutEditSnapshot !== null;
  }

  public enterLayoutEditMode(): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview) {
      return { ok: false, msg: 'Chỉ có thể mở Chế Độ Quy Hoạch tại Trang Trại Hang Sóc của bạn!' };
    }
    if (this.layoutEditSnapshot) {
      return { ok: true, msg: 'Đang ở trong Chế Độ Quy Hoạch Toàn Cảnh!' };
    }
    this.layoutEditSnapshot = {
      buildings: structuredClone(this.state.buildings),
      tileOverrides: structuredClone(this.state.tileOverrides),
      stashedDecorInventory: this.state.stashedDecorInventory
        ? structuredClone(this.state.stashedDecorInventory)
        : undefined,
      stashedDecorStars: this.state.stashedDecorStars
        ? structuredClone(this.state.stashedDecorStars)
        : undefined,
      galleons: this.state.galleons,
      prevShowGrid: Boolean(this.state.settings.showGrid),
    };
    this.state.settings.showGrid = true;
    this.audio.playClick();
    this.onUiChange?.();
    return {
      ok: true,
      msg: '🔨 Đã bật Chế Độ Quy Hoạch Toàn Cảnh — tự do dời nhà, cất trang trí rồi bấm Lưu hoặc Hủy!',
    };
  }

  public commitLayoutEditMode(): { ok: boolean; msg: string } {
    if (!this.layoutEditSnapshot) {
      return { ok: false, msg: 'Hiện không ở trong Chế Độ Quy Hoạch!' };
    }
    const prevGrid = this.layoutEditSnapshot.prevShowGrid;
    this.layoutEditSnapshot = null;
    this.state.settings.showGrid = prevGrid;
    this.rebuildGrid();
    this.syncValleyVillagers();
    this.audio.playBuildComplete();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '✓ Đã lưu bố cục quy hoạch mới của Trang Trại Hang Sóc!' };
  }

  public cancelLayoutEditMode(): { ok: boolean; msg: string } {
    if (!this.layoutEditSnapshot) {
      return { ok: false, msg: 'Hiện không ở trong Chế Độ Quy Hoạch!' };
    }
    const snap = this.layoutEditSnapshot;
    this.layoutEditSnapshot = null;
    this.state.buildings = structuredClone(snap.buildings);
    this.state.tileOverrides = structuredClone(snap.tileOverrides);
    this.state.stashedDecorInventory = snap.stashedDecorInventory
      ? structuredClone(snap.stashedDecorInventory)
      : undefined;
    this.state.stashedDecorStars = snap.stashedDecorStars
      ? structuredClone(snap.stashedDecorStars)
      : undefined;
    // Giữ nguyên số dư Sickle hiện hành để tránh ghi đè thu nhập/chi tiêu không thuộc bố cục
    this.buildUndoStack = [];
    this.buildRedoStack = [];
    this.state.settings.showGrid = snap.prevShowGrid;
    this.rebuildGrid();
    this.syncValleyVillagers();
    this.audio.playClick();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '↩ Đã hoàn nguyên về bố cục trước khi quy hoạch!' };
  }

  public saveLayoutPreset(presetId: LayoutPresetId, customLabel?: string): LayoutPresetEntry {
    const targetState = this.homeStateWhileVisiting ?? this.state;
    const labels: Record<LayoutPresetId, string> = {
      layout_1: 'Bố Cục Mùa Thu',
      layout_2: 'Bố Cục Lễ Hội',
      layout_3: 'Bố Cục Tối Ưu Xưởng',
    };
    const pathMap: NonNullable<LayoutPresetEntry['pathMap']> = {};
    for (const [k, ov] of Object.entries(targetState.tileOverrides)) {
      if (ov?.path && ov.path !== 'none') {
        pathMap[k] = ov.path;
      }
    }
    const entry: LayoutPresetEntry = {
      id: presetId,
      label: customLabel?.trim() || labels[presetId],
      savedAt: Date.now(),
      placements: targetState.buildings.map((b) => ({
        uid: b.uid,
        itemId: b.itemId,
        gx: b.gx,
        gy: b.gy,
        rotation: b.rotation,
      })),
      ...(Object.keys(pathMap).length > 0 ? { pathMap } : {}),
    };
    targetState.layoutPresets = {
      ...(targetState.layoutPresets ?? {}),
      [presetId]: entry,
    };
    this.activePresetSlot = presetId;
    this.saveToStorage();
    this.onUiChange?.();
    return entry;
  }

  public applyLayoutPreset(presetId: LayoutPresetId): { ok: boolean; msg: string; movedCount: number } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview) {
      return { ok: false, msg: 'Chỉ có thể đổi bố cục tại Trang Trại Hang Sóc của bạn!', movedCount: 0 };
    }
    const entry = this.state.layoutPresets?.[presetId];
    if (!entry) {
      return { ok: false, msg: 'Bản vẽ bố cục này chưa được lưu!', movedCount: 0 };
    }
    const unlockedSet = new Set(this.state.unlockedZones);
    const prevByUid = new Map(
      this.state.buildings.map((b) => [b.uid, { gx: b.gx, gy: b.gy, rotation: b.rotation }])
    );
    const targetByUid = new Map(entry.placements.map((p) => [p.uid, p]));
    const revertedUids = new Set<string>();

    const isTerrainValid = (gx: number, gy: number, bw: number, bh: number): boolean => {
      for (let dy = 0; dy < bh; dy++) {
        for (let dx = 0; dx < bw; dx++) {
          const cell = this.grid[gy + dy]?.[gx + dx];
          if (!cell || !unlockedSet.has(cell.zoneId) || cell.terrain === 'water') {
            return false;
          }
        }
      }
      return true;
    };

    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      const target = targetByUid.get(b.uid);
      if (!it || !target) {
        revertedUids.add(b.uid);
        continue;
      }
      const { bw, bh } = this.getBuildingFootprint(it, target.rotation);
      if (!isTerrainValid(target.gx, target.gy, bw, bh)) {
        revertedUids.add(b.uid);
      }
    }

    // Iteratively resolve footprint collisions so no two buildings can ever stack on one tile!
    let changed = true;
    while (changed) {
      changed = false;
      const occupied = new Set<string>();
      for (const b of this.state.buildings) {
        if (!revertedUids.has(b.uid)) continue;
        const it = getCatalogItem(b.itemId);
        if (!it) continue;
        const prev = prevByUid.get(b.uid)!;
        const pFp = this.getBuildingFootprint(it, prev.rotation);
        for (let dy = 0; dy < pFp.bh; dy++) {
          for (let dx = 0; dx < pFp.bw; dx++) {
            occupied.add(`${prev.gx + dx},${prev.gy + dy}`);
          }
        }
      }
      for (const b of this.state.buildings) {
        if (revertedUids.has(b.uid)) continue;
        const it = getCatalogItem(b.itemId);
        const target = targetByUid.get(b.uid);
        if (!it || !target) {
          revertedUids.add(b.uid);
          changed = true;
          continue;
        }
        const { bw, bh } = this.getBuildingFootprint(it, target.rotation);
        let collides = false;
        for (let dy = 0; dy < bh && !collides; dy++) {
          for (let dx = 0; dx < bw; dx++) {
            if (occupied.has(`${target.gx + dx},${target.gy + dy}`)) {
              collides = true;
              break;
            }
          }
        }
        if (collides) {
          revertedUids.add(b.uid);
          changed = true;
        } else {
          for (let dy = 0; dy < bh; dy++) {
            for (let dx = 0; dx < bw; dx++) {
              occupied.add(`${target.gx + dx},${target.gy + dy}`);
            }
          }
        }
      }
    }

    let movedCount = 0;
    for (const b of this.state.buildings) {
      if (revertedUids.has(b.uid)) continue;
      const target = targetByUid.get(b.uid);
      if (!target) continue;
      if (b.gx !== target.gx || b.gy !== target.gy || b.rotation !== target.rotation) {
        movedCount++;
      }
      b.gx = target.gx;
      b.gy = target.gy;
      b.rotation = target.rotation;
    }

    if (entry.pathMap) {
      const occupiedFootprint = new Set<string>();
      for (const b of this.state.buildings) {
        const it = getCatalogItem(b.itemId);
        if (!it || it.isBench) continue;
        const { bw, bh } = this.getBuildingFootprint(it, b.rotation);
        for (let dy = 0; dy < bh; dy++) {
          for (let dx = 0; dx < bw; dx++) {
            occupiedFootprint.add(`${b.gx + dx},${b.gy + dy}`);
          }
        }
      }
      for (const [k, ov] of Object.entries(this.state.tileOverrides)) {
        if (ov?.path && ov.path !== 'none' && !entry.pathMap[k]) {
          this.state.tileOverrides[k] = { ...ov, path: 'none' };
        }
      }
      for (const [k, pathType] of Object.entries(entry.pathMap)) {
        if (occupiedFootprint.has(k)) continue;
        const [kx, ky] = k.split(',').map(Number);
        const c = this.grid[ky]?.[kx];
        if (!c || !unlockedSet.has(c.zoneId) || c.terrain === 'water') continue;
        this.state.tileOverrides[k] = {
          ...(this.state.tileOverrides[k] ?? {}),
          path: pathType,
        };
      }
    }
    this.activePresetSlot = presetId;

    this.rebuildGrid();
    this.syncValleyVillagers();
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📐 Đã áp dụng "${entry.label}" (sắp xếp lại ${movedCount} công trình)!`,
      movedCount,
    };
  }

  public canStashBuilding(uid: string): boolean {
    return worldCanStashBuilding(this, uid);
  }

  public stashBuilding(uid: string): { ok: boolean; msg: string } {
    return worldStashBuilding(this, uid);
  }

  public eraseBrushAtTile(gx: number, gy: number): boolean {
    return worldEraseBrushAtTile(this, gx, gy);
  }

  public stashAllDecorItems(): { ok: boolean; msg: string; count: number } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview) {
      return { ok: false, msg: 'Không thể cất trang trí khi đang thăm vườn!', count: 0 };
    }
    const now = Date.now();
    const stash = { ...(this.state.stashedDecorInventory ?? {}) };
    const stashStars: Record<string, number[]> = {};
    for (const [k, arr] of Object.entries(this.state.stashedDecorStars ?? {})) {
      if (Array.isArray(arr)) stashStars[k] = [...arr];
    }
    const kept: PlacedBuilding[] = [];
    let count = 0;
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (
        it &&
        it.category === 'decor' &&
        !b.isIndestructible &&
        !b.builtInSandbox &&
        !it.isFlooPortal &&
        !it.isFarmlandPlot &&
        !it.isAnimalPasturePlot &&
        !it.isRuralFarmstead &&
        now >= b.constructEndsAt
      ) {
        stash[b.itemId] = (stash[b.itemId] ?? 0) + 1;
        if (!stashStars[b.itemId]) stashStars[b.itemId] = [];
        stashStars[b.itemId].push(Math.max(1, Math.min(5, Math.floor(b.stars || 1))));
        count++;
      } else {
        kept.push(b);
      }
    }
    if (count === 0) {
      return {
        ok: false,
        msg: 'Hiện không có vật phẩm trang trí đã hoàn thiện nào ngoài sân để cất!',
        count: 0,
      };
    }
    this.state.buildings = kept;
    this.state.stashedDecorInventory = stash;
    this.state.stashedDecorStars = stashStars;
    this.buildUndoStack = [];
    this.buildRedoStack = [];
    this.rebuildGrid();
    this.audio.playClick();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📦 Đã cất gọn ${count} vật phẩm Trang Trí vào Kho Kiến Trúc (đặt lại miễn phí 0 Sickle)!`,
      count,
    };
  }

  public restoreAllStashedDecor(): { ok: boolean; msg: string; placed: number } {
    if (this.isVisitingNeighbor || this.isHeadmasterPreview) {
      return { ok: false, msg: 'Chỉ có thể bày lại trang trí tại Trang Trại Hang Sóc của bạn!', placed: 0 };
    }
    const stash = { ...(this.state.stashedDecorInventory ?? {}) };
    const stashStars: Record<string, number[]> = {};
    for (const [k, arr] of Object.entries(this.state.stashedDecorStars ?? {})) {
      if (Array.isArray(arr)) stashStars[k] = [...arr];
    }
    let placed = 0;
    const now = Date.now();
    for (const [itemId, qty] of Object.entries(stash)) {
      const it = getCatalogItem(itemId);
      if (!it || qty <= 0) continue;
      let left = qty;
      while (left > 0) {
        let spot = this.findSmartSpotForStoryBuilding(it);
        if (!spot) {
          for (let gy = 14; gy < GRID_SIZE - 4 && !spot; gy++) {
            for (let gx = 10; gx < GRID_SIZE - 4; gx++) {
              if (this.canPlaceItem(it, gx, gy, 0, '__stash_restore__').ok) {
                spot = { gx, gy };
                break;
              }
            }
          }
        }
        if (!spot) break;
        const restoredStar = stashStars[itemId]?.pop() ?? 1;
        this.state.buildings.push({
          uid: `decor_${itemId}_${now}_${placed}`,
          itemId,
          gx: spot.gx,
          gy: spot.gy,
          rotation: 0,
          stars: Math.max(1, Math.min(5, restoredStar)),
          placedAt: now,
          constructEndsAt: now,
          lastTickAt: now,
          storedSickle: 0,
          storedXp: 0,
          readyBubbles: 0,
          durability: 100,
          visitorsServed: 0,
        });
        this.rebuildGrid();
        left--;
        placed++;
      }
      if (left <= 0) {
        delete stash[itemId];
        delete stashStars[itemId];
      } else {
        stash[itemId] = left;
      }
    }
    this.state.stashedDecorInventory = stash;
    this.state.stashedDecorStars = stashStars;
    if (placed === 0) {
      return { ok: false, msg: 'Kho Trang Trí đang trống hoặc sân không còn ô trống!', placed: 0 };
    }
    this.buildUndoStack = [];
    this.buildRedoStack = [];
    this.audio.playPlace();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🌸 Đã bày lại ${placed} vật phẩm Trang Trí từ Kho Kiến Trúc ra sân (0 Sickle)!`,
      placed,
    };
  }

  public resetExamWinStreak(): void {
    this.state.examWinStreak = 0;
    this.saveToStorage();
  }

  public useMorningDewPhial(uid: string): { ok: boolean; msg: string; reducedSec: number } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Không thể dùng Bình Sương Mai tại vườn bạn bè!', reducedSec: 0 };
    }
    const have = Math.max(0, Math.floor(this.state.morningDewPhials ?? 0));
    if (have <= 0 && !this.state.sandboxMode) {
      return {
        ok: false,
        msg: 'Chưa có 🧪 Bình Sương Mai — đạt chuỗi 3 trận thắng Khảo Thí liên tiếp để nhận!',
        reducedSec: 0,
      };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy công trình!', reducedSec: 0 };

    const now = Date.now();
    // Support construction, growing crop, or grazing pasture on the chosen building!
    if (now < b.constructEndsAt) {
      const res = this.applyConstructionReductionFromGameplay(
        MORNING_DEW_REDUCTION_SEC,
        'Bình Sương Mai',
        uid
      );
      if (res.reducedSec <= 0) {
        return { ok: false, msg: 'Công trình này đã chạm sàn thời gian tối thiểu!', reducedSec: 0 };
      }
      if (!this.state.sandboxMode) {
        this.state.morningDewPhials = Math.max(0, have - 1);
      }
      this.audio.playSpell();
      this.saveToStorage();
      this.onUiChange?.();
      return {
        ok: true,
        msg: `🧪 Đã tưới Bình Sương Mai rút ngắn ${formatDurationCompactVi(res.reducedSec)} cho ${res.targetName ?? 'công trình'}!`,
        reducedSec: res.reducedSec,
      };
    }
    if (b.cropId && b.cropReadyAt && now < b.cropReadyAt) {
      const savedMs = Math.min(b.cropReadyAt - now - 1000, MORNING_DEW_REDUCTION_SEC * 1000);
      if (savedMs <= 0) return { ok: false, msg: 'Luống cây đã sắp chín ngay!', reducedSec: 0 };
      b.cropReadyAt -= savedMs;
      if (!this.state.sandboxMode) this.state.morningDewPhials = Math.max(0, have - 1);
      this.audio.playSpell();
      this.saveToStorage();
      this.onUiChange?.();
      return {
        ok: true,
        msg: `🧪 Bình Sương Mai giúp luống cây chín sớm ${formatDurationCompactVi(Math.round(savedMs / 1000))}!`,
        reducedSec: Math.round(savedMs / 1000),
      };
    }
    if (b.pastureAnimalId && b.pastureReadyAt && now < b.pastureReadyAt) {
      const savedMs = Math.min(b.pastureReadyAt - now - 1000, MORNING_DEW_REDUCTION_SEC * 1000);
      if (savedMs <= 0) return { ok: false, msg: 'Đồng cỏ đã sắp thu hoạch!', reducedSec: 0 };
      b.pastureReadyAt -= savedMs;
      if (!this.state.sandboxMode) this.state.morningDewPhials = Math.max(0, have - 1);
      this.audio.playSpell();
      this.saveToStorage();
      this.onUiChange?.();
      return {
        ok: true,
        msg: `🧪 Bình Sương Mai rút ngắn ${formatDurationCompactVi(Math.round(savedMs / 1000))} tại Đồng Cỏ!`,
        reducedSec: Math.round(savedMs / 1000),
      };
    }
    return {
      ok: false,
      msg: 'Công trình này hiện không có đồng hồ chờ để dùng Bình Sương Mai!',
      reducedSec: 0,
    };
  }

  public getActiveMinigameCompanion(): {
    nameVi: string;
    emoji: string;
    speciesId: string;
    bondLevel: number;
    chargeEveryMoves: number;
  } {
    const ownState = this.homeStateWhileVisiting ?? this.state;
    const habitats = ownState.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isCreatureHabitat && Date.now() >= b.constructEndsAt
    );
    if (habitats.length > 0) {
      habitats.sort((a, b) => (b.creatureBondLevel ?? 1) - (a.creatureBondLevel ?? 1));
      const best = habitats[0];
      const sp = getSpeciesProfile(best.itemId);
      const bond = Math.max(1, best.creatureBondLevel ?? 1);
      return {
        nameVi: best.creatureNickname || sp?.speciesName || 'Niffler Trợ Chiến',
        emoji: sp?.emoji || '🐾',
        speciesId: best.itemId,
        bondLevel: bond,
        chargeEveryMoves: bond >= 5 ? 4 : 5,
      };
    }
    return {
      nameVi: 'Niffler Nhỏ Hang Sóc',
      emoji: '🐾',
      speciesId: 'niffler_den',
      bondLevel: 1,
      chargeEveryMoves: 5,
    };
  }

  public boostLowestBondCreature(amount: number): number {
    const now = Date.now();
    const habitats: Array<{ b: PlacedBuilding; item: CatalogItem }> = [];
    for (const b of this.state.buildings) {
      if (now < b.constructEndsAt) continue;
      const item = getCatalogItem(b.itemId);
      if (item?.isCreatureHabitat) {
        habitats.push({ b, item });
      }
    }
    if (habitats.length === 0) return 0;
    habitats.sort(
      (a, c) =>
        (a.b.creatureBondLevel ?? 1) - (c.b.creatureBondLevel ?? 1) ||
        (a.b.creatureBondXp ?? 0) - (c.b.creatureBondXp ?? 0)
    );
    const pick = habitats[0];
    const safeAmount = Math.max(1, Math.round(amount));
    creaturesAddCreatureBondXp(this, pick.b, pick.item, safeAmount);
    return safeAmount;
  }

  public getMollySupplyForMinigame(mode: MinigameTrialKind): ResolvedMollySupplyKit {
    return resolveMollySupplyForMinigame(this, mode);
  }

  public consumeMollySupplyKit(mode: MinigameTrialKind): {
    ok: boolean;
    msg: string;
    itemId: FarmItemId;
    isSignature: boolean;
    remaining: number;
  } {
    const kit = resolveMollySupplyForMinigame(this, mode);
    if (!kit.ready) {
      return {
        ok: false,
        msg: kit.tooltipVi,
        itemId: kit.itemId,
        isSignature: false,
        remaining: kit.haveQty,
      };
    }
    if (!this.state.sandboxMode) {
      this.consumeFarmItemFromBarn(kit.itemId, kit.qtyNeeded);
    }
    this.recordWeeklyDerbyProgress('molly_supply', 1);
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    const rem = this.state.sandboxMode ? 99 : this.getFarmItemCount(kit.itemId);
    return {
      ok: true,
      msg: `${kit.itemEmoji} Hộp Tiếp Tế Bà Molly (${kit.shortLabelVi}): ${kit.effectSummaryVi}!`,
      itemId: kit.itemId,
      isSignature: kit.isSignature,
      remaining: rem,
    };
  }

  public consumeMollyMinigameSnack(
    snackId: 'cinnamon_apple_pie' | 'frothy_butterbeer'
  ): { ok: boolean; msg: string; remaining: number } {
    const meta = FARM_GOODS[snackId];
    if (this.state.sandboxMode) {
      this.audio.playSpell();
      return {
        ok: true,
        msg: `${meta.emoji} Đã thưởng thức ${meta.name} Bà Molly!`,
        remaining: 99,
      };
    }
    const have = this.getFarmItemCount(snackId);
    if (have <= 0) {
      return {
        ok: false,
        msg: `Kho Đỏ chưa có ${meta.emoji} ${meta.name} — hãy nướng tại Lò Bánh Bà Molly hoặc Quầy Bia Bơ nhé!`,
        remaining: 0,
      };
    }
    this.consumeFarmItemFromBarn(snackId, 1);
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `${meta.emoji} Đã dùng 1 ${meta.name} Bà Molly trợ lực khảo thí!`,
      remaining: Math.max(0, have - 1),
    };
  }

  public ensureWeeklyDerby(nowMs?: number): WeeklyDerbyState {
    return ensureWeeklyDerbyState(this, nowMs);
  }

  public getWeeklyDerbySummary(nowMs?: number): WeeklyDerbySummary {
    return getWeeklyDerbySummary(this, nowMs);
  }

  public acceptWeeklyDerbyTask(taskId: string, nowMs?: number): { ok: boolean; msg: string } {
    return acceptWeeklyDerbyTask(this, taskId, nowMs);
  }

  public trashWeeklyDerbyBoardTask(taskId: string, nowMs?: number): { ok: boolean; msg: string } {
    return trashWeeklyDerbyBoardTask(this, taskId, nowMs);
  }

  public instantRestoreWeeklyDerbySlot(taskId: string, nowMs?: number): { ok: boolean; msg: string } {
    return instantRestoreWeeklyDerbySlot(this, taskId, nowMs);
  }

  public abandonWeeklyDerbyActiveTask(nowMs?: number): { ok: boolean; msg: string } {
    return abandonWeeklyDerbyActiveTask(this, nowMs);
  }

  public completeWeeklyDerbyActiveTask(nowMs?: number): { ok: boolean; msg: string; pointsEarned: number } {
    return completeWeeklyDerbyActiveTask(this, nowMs);
  }

  public unlockBonusWeeklyDerbySlot(nowMs?: number): { ok: boolean; msg: string } {
    return unlockBonusWeeklyDerbySlot(this, nowMs);
  }

  public claimWeeklyDerbyMilestone(tier: 1 | 2 | 3 | 4 | 5, nowMs?: number): { ok: boolean; msg: string } {
    return claimWeeklyDerbyMilestone(this, tier, nowMs);
  }

  public recordWeeklyDerbyProgress(
    eventKind: WeeklyDerbyEventKind,
    amount = 1,
    nowMs?: number
  ): { progressed: boolean; justCompleted: boolean } {
    return recordWeeklyDerbyProgress(this, eventKind, amount, nowMs);
  }
}

export {
  ACHIEVEMENT_REGISTRY,
  answerVillagerDialogue,
  buildSaveSlotMeta,
  claimAchievementReward,
  claimAllUnlockedAchievements,
  claimDailyRetentionReward,
  CURRENT_SAVE_SCHEMA_VERSION,
  DAY_1_TO_7_REWARDS,
  ensureRetentionState,
  evaluateAchievements,
  exportSavePayload,
  getAchievementCodexSummary,
  getCategoryMetricValue,
  getClaimableRetentionCount,
  getNpcScheduleForPeriod,
  importSavePayload,
  loadFromNamedSlot,
  reconcileRetentionStateOnLoad,
  resolveCloudSaveConflict,
  saveToNamedSlot,
  STORY_CUTSCENE_CHAPTERS,
} from './retentionAndNarrative';
export type {
  AchievementCategory,
  AchievementDef,
  CloudConflictPolicy,
  NpcScheduleSlot,
  RetentionNarrativeState,
  SaveSlotId,
  SaveSlotMetadata,
  StoryCutsceneChapter,
} from './retentionAndNarrative';
