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
  FlooVisitDirectoryRow,
  FlyRewardKind,
  GameState,
  HarvestFeastState,
  HarvestFeastTierDef,
  HeatmapMode,
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
} from './puzzleShared';
import {
  ActiveQuizChallenge,
  createInitialLanguageQuizState,
  QuizAttemptOutcome,
  recordQuizAttempt,
  sanitizeLanguageQuizState,
} from './languageQuizEngine';
import {
  ACHIEVEMENT_REGISTRY,
  answerVillagerDialogue,
  claimAchievementReward,
  claimDailyRetentionReward,
  DAY_1_TO_7_REWARDS,
  ensureRetentionState,
  evaluateAchievements,
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
  PLAYFUL_BREAKDOWNS,
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
} from './simulationFarm';

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
  BulldozeHazardWarning,
  worldRebuildGrid,
  worldIsBuildingConnected,
  worldRecomputeAllCoastersAndBiomes,
  worldAutoBuildCoasterForStation,
  worldMoveBuilding,
  worldGetBuildingFootprint,
  worldCanPlaceItem,
  worldPlaceItem,
  worldUnlockZone,
  worldBridgeZoneWithCobblePath,
  worldFindSmartSpotForStoryBuilding,
  worldGetBulldozeHazardWarning,
  worldRemoveAtTile,
} from './simulationWorld';
export type { BarnUpgradeCostInfo } from './simulationFarm';
export type { BulldozeHazardWarning } from './simulationWorld';

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
} from './simulationTrials';

import {
  questsTryDropWizardCard,
  questsAwardHousePoints,
  questsClaimHouseCupReward,
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
  questsGetBrewDurationSec,
  questsQuickHarvestHerbs,
  questsStartBrewing,
  questsSpeedUpBrewing,
  questsUseCraftedGood,
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
} from './simulationSocial';

import {
  villagersHireStaff,
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
  lifecycleResolveWeatherSlotKind,
  lifecycleDescribeWeatherSlot,
  lifecycleGetCurrentWeather,
  lifecycleGetWeatherForecast,
  lifecycleCheckDailyReset,
  lifecycleProcessOfflineProgress,
} from './simulationLifecycle';

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
  public onTutorialStepChanged: ((stepId: TutorialStepId) => void) | null = null;
  public onRequestBulldozeConfirm: ((warning: BulldozeHazardWarning) => void) | null = null;
  public villagerGreetCooldown = new Map<ValleyVillagerId, number>();

  constructor(audio: MagicalAudio) {
    this.audio = audio;
    const loaded = this.loadFromStorage();
    this.state = loaded ?? createInitialGameState();
    this.audio.enabled = this.state.settings.soundEnabled;
    this.audio.bgmEnabled = this.state.settings.bgmEnabled;
    this.rebuildGrid();
    this.syncStaffEntities();
    this.syncValleyVillagers();
  }

  public loadFromStorage(): GameState | null { return lifecycleLoadFromStorage(this); }

  public syncPlayerPrimitivesToHomeState(): void { return lifecycleSyncPlayerPrimitivesToHomeState(this); }

  public saveToStorage(): void { return lifecycleSaveToStorage(this); }

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

  public getRealTimePeriod(now = new Date()): 'dawn' | 'day' | 'dusk' | 'night' { return lifecycleGetRealTimePeriod(this, now); }

  public getActiveFestival(now = new Date()): FestivalType { return lifecycleGetActiveFestival(this, now); }

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

  public tickProductionToTimestamp(now: number, silent = false): void { return economyTickProductionToTimestamp(this, now, silent); }

  public getEffectiveItemStarCost(item: CatalogItem): number { return economyGetEffectiveItemStarCost(this, item); }

  public canPlaceItem(
    item: CatalogItem,
    gx: number,
    gy: number,
    rotation: 0 | 1 | 2 | 3,
    ignoreBuildingUid?: string
  ): { ok: boolean; reason?: string } { return worldCanPlaceItem(this, item, gx, gy, rotation, ignoreBuildingUid); }

  public placeItem(item: CatalogItem, gx: number, gy: number, rotation: 0 | 1 | 2 | 3): boolean { return worldPlaceItem(this, item, gx, gy, rotation); }

  public getBulldozeHazardWarning(gx: number, gy: number): BulldozeHazardWarning | null {
    return worldGetBulldozeHazardWarning(this, gx, gy);
  }

  public removeAtTile(gx: number, gy: number, force = false): boolean {
    return worldRemoveAtTile(this, gx, gy, force);
  }

  public tryDropWizardCard(_gx: number, _gy: number, _baseChance = 0.08): void { return questsTryDropWizardCard(this, _gx, _gy, _baseChance); }

  public awardHousePoints(house: HouseName, pts: number): void { return questsAwardHousePoints(this, house, pts); }

  public claimHouseCupReward(): boolean { return questsClaimHouseCupReward(this); }

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
   * Vòng lặp Tháp Giải Đố 5×777 Màn (200+ giờ):
   * Thắng màn mới (1..777) của bất kỳ môn giải đố nào sẽ tích lũy tiến trình Cấp Giải Đố Tổng (3.435 trận -> Cấp 100),
   * mở khóa bản vẽ công trình, cây trồng & vùng đất mới!
   * Nếu chơi lại Màn 777 đã phá đảo (countWinProgress = false), chỉ cộng thống kê & nhiệm vụ, không cày vô hạn Cấp.
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
   * Rương Mùa Gặt Điền Trang (mỗi 200 XP tặng ngay +65 🪙 Galleon + 1 ⏳ Cát Thời Gian + định kỳ Bùa Trợ Lực),
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

  public fulfillCargoCrate(crateId: string): { ok: boolean; msg: string } { return questsFulfillCargoCrate(this, crateId); }

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
    }
    const clampedDt = Math.min(0.1, dt) * this.simSpeed;
    const now = Date.now();

    if (!this.isVisitingNeighbor) {
      this.tickProductionToTimestamp(now);
    }

    this.autoSaveAcc += clampedDt;
    if (this.autoSaveAcc >= 15) {
      this.autoSaveAcc = 0;
      this.checkDailyReset();
      if (!this.isVisitingNeighbor) {
        this.checkAndToastAchievements(now);
      }
      this.saveToStorage();
      this.onUiChange?.();
    }

    this.socialSimAcc += clampedDt;
    if (this.socialSimAcc >= 3) {
      this.socialSimAcc = 0;
      this.tickNeighborSocialBackground(now);
    }

    const unlockedSet = new Set(this.state.unlockedZones);

    if (!this.isVisitingNeighbor) {
      // Periodic gentle staff wage accounting every 45s
      this.wageTickAcc += clampedDt;
      if (this.wageTickAcc >= 45) {
        this.wageTickAcc = 0;
        const wage = this.getHourlyStaffWage();
        if (!this.state.sandboxMode && this.state.galleons > wage * 3) {
          this.state.galleons -= wage;
        }
        this.state.finance.staffWagesPaid += wage;
      }

      // Update Contraption Wear & Breakdowns!
      this.updateRideQueues(clampedDt, now);

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
    const period = this.getRealTimePeriod();
    if (period === 'dusk' || period === 'night') {
      const hasPavilion = this.state.buildings.some(
        (b) => getCatalogItem(b.itemId)?.isFireworksLauncher && now >= b.constructEndsAt
      );
      if (hasPavilion) {
        this.nightFireworkAcc += clampedDt;
        if (this.nightFireworkAcc >= 3.2) {
          this.nightFireworkAcc = 0;
          this.launchFireworksShow(2);
        }
      }
    }

    this.updateValleyVillagers(clampedDt, unlockedSet);

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

  private updateRideQueues(dt: number, now: number): void {
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (
        !it ||
        it.category !== 'ride' ||
        it.isThemeParkLegacy ||
        it.isCoasterTrackPiece ||
        it.isFlooPortal
      ) {
        continue;
      }
      if (now < b.constructEndsAt) continue;

      // Gentle ambient wear & playful breakdown check!
      if (!b.isBrokenDown) {
        b.durability = Math.max(15, (b.durability ?? 100) - dt * 0.14);
        if (b.durability <= 22) {
          b.isBrokenDown = true;
          b.breakdownReason =
            PLAYFUL_BREAKDOWNS[Math.floor(Math.random() * PLAYFUL_BREAKDOWNS.length)];
          this.spawnFloatingText(b.gx + 1, b.gy + 1, '⚙️ Cần Reparo!', '#c084fc');
          if (!this.isHeadmasterPreview) {
            this.onToast?.(
              `🔧 ${it.name} tạm dừng: "${b.breakdownReason}" — Phù Thủy Bảo Trì đang tới hoặc bấm Reparo!`,
              '🪄'
            );
          }
          this.onUiChange?.();
        }
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

  public findSmartSpotForStoryBuilding(item: CatalogItem): { gx: number; gy: number } | null { return worldFindSmartSpotForStoryBuilding(this, item); }

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
    sessionMetrics?: { sessionScore?: number }
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

  public completePuzzleArcadeVictory(
    mode: PuzzleArcadeMode,
    reward: PuzzleRewardSpec,
    sessionMetrics?: { sessionScore?: number; efficiency?: number }
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
  } { return trialsCompletePuzzleArcadeVictory(this, mode, reward, sessionMetrics); }

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

  public addCropSeeds(cropId: FarmCropId, qty: number): number { return farmAddCropSeeds(this, cropId, qty); }

  public buyCropSeedWithGold(
    cropId: FarmCropId,
    qty = 1
  ): { ok: boolean; msg: string; newSeedCount: number } { return farmBuyCropSeedWithGold(this, cropId, qty); }

  public completeSeedLanguageQuizAttempt(
    cropId: FarmCropId,
    challenge: ActiveQuizChallenge,
    correct: boolean
  ): QuizAttemptOutcome & { newSeedCount: number; cropName: string } { return farmCompleteSeedLanguageQuizAttempt(this, cropId, challenge, correct); }

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

  public greetVillager(id: ValleyVillagerId): { ok: boolean; msg: string; bonusGalleons: number } { return villagersGreetVillager(this, id); }

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
          `🏅 Đạt Thành Tựu: ${def.titleVi} (+${def.rewardGalleons}G, +${def.rewardStars} 🌟 — nhận tại Sổ Vàng!)`,
          def.icon
        );
      } else if (toDisplay.length > 1) {
        const top = toDisplay[toDisplay.length - 1];
        const sumGold = toDisplay.reduce((acc, d) => acc + d.rewardGalleons, 0);
        const sumStars = toDisplay.reduce((acc, d) => acc + d.rewardStars, 0);
        this.onToast(
          `🏅 Mở khoá ${toDisplay.length} Thành Tựu mới (${top.titleVi}...) • +${sumGold}G, +${sumStars} 🌟 — nhận tại Sổ Vàng!`,
          top.icon
        );
      }
    }

    if (stateMutated) {
      this.saveToStorage();
    }
    return newlyUnlocked;
  }

  public claimAchievement(achId: string): {
    ok: boolean;
    msg: string;
    rewardGalleons: number;
    rewardStars: number;
  } {
    const def = ACHIEVEMENT_REGISTRY.find((a) => a.id === achId);
    const res = claimAchievementReward(this.state, achId);
    if (!res.ok || !def) {
      return { ok: false, msg: 'Thành tựu chưa mở khoá hoặc đã nhận thưởng!', rewardGalleons: 0, rewardStars: 0 };
    }
    if (res.rewardStars > 0) {
      this.state.match3.stars += res.rewardStars;
      this.state.match3.totalStarsEarned += res.rewardStars;
      this.onRewardFly?.('stars', res.rewardStars);
    }
    if (res.rewardGalleons > 0) {
      this.onRewardFly?.('galleons', res.rewardGalleons);
    }
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🎖️ Đã nhận thưởng "${def.titleVi}": +${res.rewardGalleons}G & +${res.rewardStars} 🌟!`,
      rewardGalleons: res.rewardGalleons,
      rewardStars: res.rewardStars,
    };
  }

  public getUnlockedLoginDayMax(): number {
    const ret = ensureRetentionState(this.state);
    const todayKey = getLocalDateKey();
    if (ret.lastLoginClaimDayKey === todayKey) {
      return Math.min(7, Math.max(1, ret.claimedLoginDays.length));
    }
    return Math.min(7, Math.max(1, ret.claimedLoginDays.length + 1));
  }

  public claimLoginDayReward(dayNumber: number): { ok: boolean; msg: string } {
    const ret = ensureRetentionState(this.state);
    const todayKey = getLocalDateKey();
    if (ret.claimedLoginDays.includes(dayNumber)) {
      return { ok: false, msg: 'Quà điểm danh ngày này đã được nhận!' };
    }
    if (ret.lastLoginClaimDayKey === todayKey) {
      return { ok: false, msg: 'Hôm nay bạn đã nhận quà điểm danh rồi — hẹn quay lại vào ngày mai nhé!' };
    }
    const maxDay = this.getUnlockedLoginDayMax();
    if (dayNumber !== maxDay) {
      return { ok: false, msg: `Hãy nhận quà Ngày ${maxDay} trước nhé!` };
    }
    const res = claimDailyRetentionReward(this.state, dayNumber, todayKey);
    if (!res.ok || !res.reward) {
      return { ok: false, msg: 'Quà điểm danh ngày này đã được nhận!' };
    }
    if (res.reward.magicStars > 0) {
      this.state.match3.stars += res.reward.magicStars;
      this.state.match3.totalStarsEarned += res.reward.magicStars;
      this.onRewardFly?.('stars', res.reward.magicStars);
    }
    this.onRewardFly?.('galleons', res.reward.galleons);
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📅 Nhận ${res.reward.titleVi}: +${res.reward.galleons}G, +${res.reward.magicStars} 🌟${
        res.reward.phoenixTalismans > 0 ? `, +${res.reward.phoenixTalismans} 🔥` : ''
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
      msg: `💝 "${res.replyVi}" (+${bonusGold}G${res.leveledUp ? `, Lên Cấp Thân Thiết ${res.level} +1 🌟!` : ''})`,
      level: res.level,
      leveledUp: res.leveledUp,
    };
  }

  public saveNamedProfileSlot(slotId: SaveSlotId): SaveSlotMetadata {
    const baseState = this.homeStateWhileVisiting ?? this.state;
    const meta = saveToNamedSlot(baseState, slotId);
    this.saveToStorage();
    this.onUiChange?.();
    return meta;
  }

  public loadNamedProfileSlot(slotId: SaveSlotId): { ok: boolean; msg: string } {
    const loaded = loadFromNamedSlot(slotId);
    if (!loaded.ok || !loaded.state) {
      return { ok: false, msg: 'Ô hồ sơ này hiện đang trống!' };
    }
    if (
      !isSandboxRuntimeAllowed() &&
      (loaded.state.sandboxMode === true || loaded.state.sandboxTainted === true)
    ) {
      return {
        ok: false,
        msg: 'Hồ sơ thử nghiệm Sandbox đã bị khóa trong bản game chính thức!',
      };
    }
    const ok = this.importSaveJson(JSON.stringify(loaded.state));
    if (!ok) {
      return { ok: false, msg: 'Không thể khôi phục hồ sơ này!' };
    }
    return {
      ok: true,
      msg: `💾 Đã tải ${loaded.meta?.label ?? slotId} (${loaded.meta?.parkName ?? 'Hang Sóc'} • Cấp ${loaded.state.level})!`,
    };
  }

  public saveLayoutPreset(presetId: LayoutPresetId, customLabel?: string): LayoutPresetEntry {
    const targetState = this.homeStateWhileVisiting ?? this.state;
    const labels: Record<LayoutPresetId, string> = {
      layout_1: 'Bố Cục Mùa Xuân',
      layout_2: 'Bố Cục Lễ Hội',
      layout_3: 'Bố Cục Tối Ưu Xưởng',
    };
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
    };
    targetState.layoutPresets = {
      ...(targetState.layoutPresets ?? {}),
      [presetId]: entry,
    };
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
    this.rebuildGrid();
    this.audio.playClick();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📦 Đã cất gọn ${count} vật phẩm Trang Trí vào Kho Kiến Trúc (đặt lại miễn phí 0G)!`,
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
              if (this.canPlaceItem(it, gx, gy, 0).ok) {
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
          storedGalleons: 0,
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
    this.audio.playPlace();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🌸 Đã bày lại ${placed} vật phẩm Trang Trí từ Kho Kiến Trúc ra sân (0G)!`,
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
}

export {
  ACHIEVEMENT_REGISTRY,
  answerVillagerDialogue,
  buildSaveSlotMeta,
  claimAchievementReward,
  claimDailyRetentionReward,
  CURRENT_SAVE_SCHEMA_VERSION,
  DAY_1_TO_7_REWARDS,
  ensureRetentionState,
  evaluateAchievements,
  exportSavePayload,
  getAchievementCodexSummary,
  getCategoryMetricValue,
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
