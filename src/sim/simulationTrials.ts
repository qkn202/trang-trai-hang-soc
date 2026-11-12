// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.

import {
  computeExamStreakReductionSec,
  computeRealTimeBuildSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FarmWorkshopRecipe,
  formatDurationCompactVi,
  getCatalogItem,
  getFarmItemMeta,
  getMinRemainingBuildFloorSec,
  getStageSawtoothTag,
  MINIGAME_CLEAR_REDUCTION_SEC,
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
  isCandyHogwartsBossStage,
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
  PhoenixTalismanDailyUsageState,
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
  syncAllPlayerCloudLeaderboards,
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

export function trialsGetDisciplineStageInfo(sim: ParkSimulation, kind: MinigameTrialKind): {
    currentStage: number;
    clearedStages: number;
    maxStage: number;
    isMaxed: boolean;
  } {
    const pa = sim.state.puzzleArcade;
    const m3 = sim.state.match3;
    let currentStage = 1;
    let clearedStages = 0;
    if (kind === 'match3') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, m3.currentLevel ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, m3.maxClearedLevel ?? Math.max(0, currentStage - 1))
      );
    } else if (kind === 'sudoku') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.sudokuStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.sudokuCleared ?? Math.max(0, currentStage - 1))
      );
    } else if (kind === 'caro') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.caroStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.caroCleared ?? Math.max(0, currentStage - 1))
      );
    } else if (kind === 'chess') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.chessStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.chessCleared ?? Math.max(0, currentStage - 1))
      );
    } else {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.blockStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.blockCleared ?? Math.max(0, currentStage - 1))
      );
    }
    return {
      currentStage,
      clearedStages,
      maxStage: MAX_MINIGAME_STAGE,
      isMaxed: clearedStages >= MAX_MINIGAME_STAGE,
    };
}

export function trialsGetTotalTowerClearedStages(sim: ParkSimulation): { cleared: number; total: number } {
    const kinds: MinigameTrialKind[] = ['match3', 'caro', 'sudoku', 'chess', 'blocks'];
    let cleared = 0;
    for (const k of kinds) {
      cleared += trialsGetDisciplineStageInfo(sim, k).clearedStages;
    }
    return { cleared, total: TOTAL_MINIGAME_STAGES };
}

export function trialsGetWinsProgressForCurrentLevel(sim: ParkSimulation): { current: number; required: number } {
    if (sim.state.level >= MAX_LEVEL) {
      const reqMax = getWinsRequiredForNextLevel(MAX_LEVEL - 1);
      return { current: reqMax, required: reqMax };
    }
    const required = getWinsRequiredForNextLevel(sim.state.level);
    const current = Math.max(
      0,
      Math.min(required, Math.round(sim.state.puzzleLevelWinsProgress ?? 0))
    );
    return { current, required };
}

export function trialsGetRequiredLevelTrial(sim: ParkSimulation): LevelTrialRequirement | null {
    if (sim.state.level >= MAX_LEVEL) return null;
    const maxedKinds = new Set<MinigameTrialKind>();
    for (const k of ['match3', 'caro', 'sudoku', 'chess', 'blocks'] as const) {
      if (trialsGetDisciplineStageInfo(sim, k).isMaxed) {
        maxedKinds.add(k);
      }
    }
    return getLevelTrialRequirement(sim.state.level, maxedKinds);
}

const VALID_LAST_PLAYED_MINIGAMES: ReadonlySet<LeaderboardGameId> = new Set([
  'match3',
  'caro',
  'sudoku',
  'chess',
  'blocks',
  'seedquiz',
]);

export function trialsGetLastPlayedMinigame(sim: ParkSimulation): LeaderboardGameId {
    const raw = sim.state.lastPlayedMinigame;
    if (raw && VALID_LAST_PLAYED_MINIGAMES.has(raw)) {
      return raw;
    }
    return 'match3';
}

export function trialsSetLastPlayedMinigame(
    sim: ParkSimulation,
    gameId: LeaderboardGameId
): LeaderboardGameId {
    const safe: LeaderboardGameId = VALID_LAST_PLAYED_MINIGAMES.has(gameId) ? gameId : 'match3';
    if (sim.state.lastPlayedMinigame !== safe) {
      sim.state.lastPlayedMinigame = safe;
      if (!sim.isHeadmasterPreview) {
        sim.saveToStorage();
      }
    }
    return safe;
}

export function trialsIsCurrentLevelTrialPassed(sim: ParkSimulation): boolean {
    return sim.state.level >= MAX_LEVEL || sim.state.sandboxMode || sim.isHeadmasterPreview;
}

export function trialsIsWaitingOnLevelTrial(sim: ParkSimulation): boolean {
    return false;
}

export function trialsAdvanceMasterPuzzleLevel(sim: ParkSimulation, 
    modeOrKind: MinigameTrialKind,
    countWinProgress = true
  ): {
    leveledUp: boolean;
    newLevel: number;
    wasFeatured: boolean;
  } {
    const req = trialsGetRequiredLevelTrial(sim);
    const wasFeatured = Boolean(
      countWinProgress &&
        req &&
        req.kind === modeOrKind &&
        !sim.state.sandboxMode &&
        !sim.isHeadmasterPreview
    );

    sim.state.stats.minigamesWon = (sim.state.stats.minigamesWon ?? 0) + 1;
    sim.recordQuestProgress('win_minigame', modeOrKind, 1);

    if (!countWinProgress || sim.state.level >= MAX_LEVEL || sim.isHeadmasterPreview) {
      return { leveledUp: false, newLevel: sim.state.level, wasFeatured };
    }

    let wins = Math.max(0, Math.round(sim.state.puzzleLevelWinsProgress ?? 0)) + 1;
    let leveledUp = false;
    while (sim.state.level < MAX_LEVEL) {
      const reqWins = getWinsRequiredForNextLevel(sim.state.level);
      if (wins < reqWins) break;
      wins -= reqWins;
      sim.state.level += 1;
      sim.state.levelUpTrialCompletedLevel = sim.state.level;
      const info = getLevelInfo(sim.state.level);
      sim.state.galleons += info.rewardGalleons;
      sim.state.timeSand += info.rewardTimeSand;
      sim.recordQuestProgress('reach_level', undefined, sim.state.level);
      leveledUp = true;
    }
    sim.state.puzzleLevelWinsProgress = sim.state.level >= MAX_LEVEL ? 0 : wins;
    if (leveledUp) {
      sim.syncValleyVillagers();
      sim.onLevelUp?.(sim.state.level);
    }

    return { leveledUp, newLevel: sim.state.level, wasFeatured };
}

export function trialsTryAdvancePendingLevels(sim: ParkSimulation, _silentGateToast = false): boolean {
    return false;
}

export function trialsTickMatch3Hearts(sim: ParkSimulation, now = Date.now()): void {
    const m3 = sim.state.match3;
    if (!m3) return;
    if (m3.hearts >= MAX_MATCH3_HEARTS) {
      m3.hearts = MAX_MATCH3_HEARTS;
      m3.nextHeartAt = 0;
      return;
    }
    if (!m3.nextHeartAt || m3.nextHeartAt <= 0) {
      m3.nextHeartAt = now + HEART_REGEN_MS;
      return;
    }
    while (m3.hearts < MAX_MATCH3_HEARTS && now >= m3.nextHeartAt) {
      m3.hearts += 1;
      if (m3.hearts >= MAX_MATCH3_HEARTS) {
        m3.nextHeartAt = 0;
      } else {
        m3.nextHeartAt += HEART_REGEN_MS;
      }
    }
}

export function trialsCanStartMatch3Level(sim: ParkSimulation): { ok: boolean; msg?: string } {
    trialsTickMatch3Hearts(sim, Date.now());
    if (sim.state.sandboxMode || sim.state.match3.hearts > 0) {
      return { ok: true };
    }
    const leftSec = Math.max(1, Math.ceil((sim.state.match3.nextHeartAt - Date.now()) / 1000));
    const mins = Math.floor(leftSec / 60);
    const secs = String(leftSec % 60).padStart(2, '0');
    return {
      ok: false,
      msg: `Đã hết ❤️ Tim! Tự hồi 1 Tim sau ${mins}:${secs}, hoặc dùng ${REFILL_HEARTS_GOLD_COST}G / Bia Bơ để hồi đầy ngay!`,
    };
}

export function trialsLoseMatch3Heart(sim: ParkSimulation): void {
    if (sim.state.sandboxMode) return;
    const m3 = sim.state.match3;
    const now = Date.now();
    trialsTickMatch3Hearts(sim, now);
    if (m3.hearts > 0) {
      m3.hearts -= 1;
      if (m3.hearts < MAX_MATCH3_HEARTS && !m3.nextHeartAt) {
        m3.nextHeartAt = now + HEART_REGEN_MS;
      }
    }
    m3.winStreak = 0;
    sim.state.examWinStreak = 0;
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function trialsRefillMatch3Hearts(sim: ParkSimulation): { ok: boolean; msg: string } {
    trialsTickMatch3Hearts(sim, Date.now());
    const m3 = sim.state.match3;
    if (m3.hearts >= MAX_MATCH3_HEARTS) {
      return { ok: false, msg: 'Tim của bạn đang đầy 5/5 ❤️ rồi!' };
    }
    // Check if player has Aged Butterbeer in stock first (free heart refill!)
    if ((sim.state.supply.goods.aged_butterbeer ?? 0) >= 1) {
      return sim.useCraftedGood('aged_butterbeer');
    }
    if (!sim.state.sandboxMode && sim.state.galleons < REFILL_HEARTS_GOLD_COST) {
      return {
        ok: false,
        msg: `Cần ${REFILL_HEARTS_GOLD_COST} Galleon (hoặc 1 Thùng Bia Bơ Ủ Tuyết) để hồi đầy 5 ❤️ Tim!`,
      };
    }
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= REFILL_HEARTS_GOLD_COST;
    }
    m3.hearts = MAX_MATCH3_HEARTS;
    m3.nextHeartAt = 0;
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: '❤️ Đã hồi đầy 5/5 Tim Phép Thuật — Sẵn sàng chinh phục tháp!' };
}

export function trialsBuyMatch3ExtraMoves(sim: ParkSimulation, levelOverride?: number): { ok: boolean; msg: string; cost: number } {
    const lv = levelOverride ?? sim.state.match3.currentLevel;
    const cost = getExtraMovesGoldCost(lv);
    if (!sim.state.sandboxMode && sim.state.galleons < cost) {
      return {
        ok: false,
        cost,
        msg: `Cần ${cost} Galleon từ Điền Trang để mua thêm +5 Lượt Đi!`,
      };
    }
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= cost;
    }
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, cost, msg: `🪄 Đã cộng thêm +5 Lượt Đi (-${cost}G) & giữ vững Chuỗi Thắng!` };
}

export function trialsSpendOrBuyMatch3Booster(sim: ParkSimulation, boosterId: Match3BoosterId): { ok: boolean; msg: string } {
    const def = MATCH3_BOOSTERS.find((b) => b.id === boosterId);
    if (!def) return { ok: false, msg: 'Bùa không hợp lệ.' };

    const curQty = sim.state.match3.boosters[boosterId] ?? 0;
    if (sim.state.sandboxMode) {
      return { ok: true, msg: `Đã kích hoạt ${def.name}!` };
    }
    if (curQty > 0) {
      sim.state.match3.boosters[boosterId] = curQty - 1;
      sim.saveToStorage();
      sim.onUiChange?.();
      return { ok: true, msg: `Đã dùng 1 ${def.emoji} ${def.name}!` };
    }
    if (sim.state.galleons < def.goldCost) {
      return {
        ok: false,
        msg: `Hết ${def.shortLabel} — Cần ${def.goldCost}G từ Công Viên để mua & dùng ngay!`,
      };
    }
    sim.state.galleons -= def.goldCost;
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: `Đã mua & kích hoạt ${def.emoji} ${def.name} (-${def.goldCost}G)!` };
}

export function trialsEnsureMinigameLeaderboard(sim: ParkSimulation): MinigameLeaderboardState {
    sim.ensureNeighborSocial();
    return ensureMinigameLeaderboardState(sim.state);
}

export function trialsGetPlayerHouse(sim: ParkSimulation): HouseName {
    trialsEnsureMinigameLeaderboard(sim);
    return getPlayerHogwartsHouse(sim.state);
}

export function trialsSetPlayerHouse(sim: ParkSimulation, house: HouseName, activeGameId?: LeaderboardGameId): HouseName {
    const lb = trialsEnsureMinigameLeaderboard(sim);
    if (lb.playerHouseLockedByServer && lb.playerHouse) {
      const lockedMeta = HOGWARTS_HOUSE_META[lb.playerHouse];
      sim.audio.playClick();
      sim.onToast?.(
        `🏰 Nhà Hogwarts của bạn được đồng bộ chính thức theo tài khoản HPVN: ${lockedMeta.mascotEmoji} ${lb.playerHouse}!`,
        lockedMeta.mascotEmoji
      );
      return lb.playerHouse;
    }
    const chosen = setPlayerHogwartsHouse(sim.state, house, { explicit: true });
    const meta = HOGWARTS_HOUSE_META[chosen];
    sim.audio.playSpell();
    sim.onToast?.(
      `${meta.mascotEmoji} Đã gia nhập ${meta.vnTitle} (${chosen}) — Đồng Hồ Cát ${meta.gemNameVi}!`,
      meta.mascotEmoji
    );
    sim.saveToStorage();
    sim.onUiChange?.();
    if (activeGameId && isScoredLeaderboardGame(activeGameId)) {
      void submitPlayerCloudLeaderboardEntry(sim.state, activeGameId);
    } else {
      void syncAllPlayerCloudLeaderboards(sim.state);
    }
    return chosen;
}

export function trialsRollPlayerSortingHat(sim: ParkSimulation, activeGameId?: LeaderboardGameId): HouseName {
    const lb = trialsEnsureMinigameLeaderboard(sim);
    if (lb.playerHouseLockedByServer && lb.playerHouse) {
      const lockedMeta = HOGWARTS_HOUSE_META[lb.playerHouse];
      sim.audio.playClick();
      sim.onToast?.(
        `🎩 Chiếc Nón Phân Loại mỉm cười: Hồ sơ HPVN của bạn đã thuộc về ${lockedMeta.mascotEmoji} ${lb.playerHouse}!`,
        '🎩'
      );
      return lb.playerHouse;
    }
    const chosen = rollSortingHatHouse(sim.state);
    const meta = HOGWARTS_HOUSE_META[chosen];
    sim.audio.playLevelUp();
    sim.onToast?.(
      `🎩 Chiếc Nón Phân Loại hô vang: "${chosen.toUpperCase()} — ${meta.vnTitle}!" ${meta.quoteVi}`,
      '🎩'
    );
    sim.saveToStorage();
    sim.onUiChange?.();
    if (activeGameId && isScoredLeaderboardGame(activeGameId)) {
      void submitPlayerCloudLeaderboardEntry(sim.state, activeGameId);
    } else {
      void syncAllPlayerCloudLeaderboards(sim.state);
    }
    return chosen;
}

export function trialsGetMinigameLeaderboard(sim: ParkSimulation, 
    gameId: LeaderboardGameId,
    scope: Exclude<LeaderboardScope, 'personal'> = 'valley',
    houseFilter: 'all' | HouseName = 'all'
  ): LeaderboardStandingResult {
    sim.ensureNeighborSocial();
    const scoredGameId = normalizeScoredLeaderboardGame(gameId);
    return buildMinigameLeaderboard(
      sim.state,
      scoredGameId,
      scope,
      getCachedCloudLeaderboardEntries(scoredGameId),
      houseFilter
    );
}

export function trialsGetPlayerMinigameRank(sim: ParkSimulation, 
    gameId: LeaderboardGameId,
    scope: Exclude<LeaderboardScope, 'personal'> = 'valley'
  ): number {
    return trialsGetMinigameLeaderboard(sim, gameId, scope).playerRank;
}

export function trialsGetAllPersonalLeaderboardSummaries(sim: ParkSimulation): PersonalDisciplineSummaryRow[] {
    sim.ensureNeighborSocial();
    return buildAllPersonalRecordsSummary(sim.state, getAllCachedCloudLeaderboards());
}

export function trialsCompleteMatch3LevelVictory(sim: ParkSimulation, 
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
  } {
    const prevLbRank = trialsGetPlayerMinigameRank(sim, 'match3', 'valley');
    sim.state.lastPlayedMinigame = 'match3';
    const m3 = sim.state.match3;
    const pa = sim.state.puzzleArcade;
    const playedStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, m3.currentLevel ?? 1));
    const prevCleared = Math.max(
      0,
      Math.min(MAX_MINIGAME_STAGE, m3.maxClearedLevel ?? Math.max(0, playedStage - 1))
    );
    const isFirstClear = prevCleared < MAX_MINIGAME_STAGE && playedStage > prevCleared;

    const def = getMatch3LevelDef(playedStage);
    const isBossStage = Boolean(isCandyHogwartsBossStage(playedStage) || def.difficulty === 'boss');
    const reqBefore = trialsGetRequiredLevelTrial(sim);
    const featuredKind =
      reqBefore?.kind ??
      getLevelTrialRequirement(MAX_LEVEL + (pa.featuredWinsCount ?? 0))?.kind ??
      'match3';
    const featuredBonusApplied = Boolean(
      isFirstClear &&
        featuredKind === 'match3' &&
        !sim.state.sandboxMode &&
        !sim.isHeadmasterPreview
    );

    const streakMult = 1 + Math.min(3, m3.winStreak ?? 0) * 0.15;
    let starsEarned = 0;
    let sandEarned = 0;
    let goldEarned = 0;
    let xpEarned = 0;
    let boosterReward: Match3BoosterId | undefined;

    if (isFirstClear) {
      let featuredBonusStars = 0;
      if (featuredBonusApplied) {
        pa.featuredWinsCount = (pa.featuredWinsCount ?? 0) + 1;
        if ((sim.state.featuredStarClaimedLevel ?? 0) < sim.state.level) {
          featuredBonusStars += 1;
          sim.state.featuredStarClaimedLevel = sim.state.level;
        }
        if (pa.featuredWinsCount % 5 === 0) {
          featuredBonusStars += 1;
        }
      }
      const sawtooth = getStageSawtoothTag(playedStage);
      starsEarned = def.starReward + featuredBonusStars;
      sandEarned = Math.max(def.bonusSandReward, isBossStage ? 1 : 0) + (featuredBonusApplied ? 1 : 0);
      goldEarned = Math.round(
        (def.goldReward + Math.max(0, Math.round(bonusCoinsFromMoves))) *
          streakMult *
          sawtooth.bonusGoldMult *
          (featuredBonusApplied ? 1.35 : 1)
      );
      xpEarned = def.xpReward;
      boosterReward = def.bonusBoosterReward ?? (isBossStage ? 'reparo_hammer' : undefined);

      m3.maxClearedLevel = Math.min(MAX_MINIGAME_STAGE, Math.max(prevCleared, playedStage));
      m3.currentLevel = Math.min(MAX_MINIGAME_STAGE, m3.maxClearedLevel + 1);
      m3.stars += starsEarned;
      m3.totalStarsEarned += starsEarned;
      if (boosterReward) {
        m3.boosters[boosterReward] = (m3.boosters[boosterReward] ?? 0) + 1;
      }
    } else {
      m3.maxClearedLevel = Math.min(MAX_MINIGAME_STAGE, Math.max(prevCleared, playedStage));
      m3.currentLevel = Math.min(MAX_MINIGAME_STAGE, m3.maxClearedLevel + 1);
      if (prevCleared >= MAX_MINIGAME_STAGE && playedStage === MAX_MINIGAME_STAGE) {
        starsEarned = 1;
        m3.stars += 1;
        m3.totalStarsEarned += 1;
      }
      goldEarned = Math.max(
        20,
        Math.round((def.goldReward + Math.max(0, Math.round(bonusCoinsFromMoves))) * 0.5)
      );
      xpEarned = Math.max(10, Math.round(def.xpReward * 0.5));
    }
    m3.activeSession = null;

    m3.levelsWon += 1;
    m3.winStreak += 1;
    const examStreak = (sim.state.examWinStreak ?? 0) + 1;
    sim.state.examWinStreak = examStreak;
    const streakInfo = computeExamStreakReductionSec(examStreak);
    if (streakInfo.dewPhialAwarded > 0) {
      sim.state.morningDewPhials = Math.min(20, (sim.state.morningDewPhials ?? 0) + streakInfo.dewPhialAwarded);
      sim.onToast?.(
        `🧪 Chuỗi thắng Khảo Thí ×${examStreak} (${streakInfo.multiplierLabel}): Nhận +${streakInfo.dewPhialAwarded} Bình Sương Mai (-15p có chọn lọc)!`,
        '🧪'
      );
    }

    sim.state.galleons += goldEarned;
    sim.state.finance.harvestRevenue += goldEarned;
    sim.state.timeSand += sandEarned;

    const lvRes = trialsAdvanceMasterPuzzleLevel(sim, 'match3', isFirstClear);
    sim.addXp(xpEarned);
    sim.addHarvestFeastPoints(isFirstClear ? (isBossStage ? 40 : 28) : 14);
    sim.recordQuestProgress('cast_spells', undefined, 3);
    sim.checkAndToastAchievements?.();
    if (isFirstClear && (isBossStage || playedStage === MAX_MINIGAME_STAGE)) {
      sim.launchFireworksShow(playedStage === MAX_MINIGAME_STAGE ? 18 : 10);
    }

    const rawReduceSec = streakInfo.rawReduceSec;
    const buildReduction = sim.applyConstructionReductionFromGameplay(
      rawReduceSec,
      'Bùa Gặt Honeydukes'
    );

    const sessionPts = Math.max(
      1200 + playedStage * 95 + Math.max(0, Math.round(bonusCoinsFromMoves)) * 12,
      Math.round(sessionMetrics?.sessionScore ?? 0)
    );
    const leaderboardRankUp = recordMinigameSessionResult(sim.state, 'match3', {
      clearedStage: m3.maxClearedLevel,
      sessionScore: sessionPts,
      efficiency: sessionPts,
      streak: m3.winStreak,
      previousRankOverride: prevLbRank,
    });
    void submitPlayerCloudLeaderboardEntry(sim.state, 'match3');

    sim.audio.playLevelUp();
    if (starsEarned > 0) sim.onRewardFly?.('stars', starsEarned);
    if (goldEarned > 0) sim.onRewardFly?.('galleons', goldEarned);
    if (sandEarned > 0) sim.onRewardFly?.('sand', sandEarned);
    sim.advanceTutorialStep('earn_magic_star');
    sim.saveToStorage();
    sim.onUiChange?.();

    return {
      starsEarned,
      goldEarned,
      xpEarned,
      sandEarned,
      boosterReward,
      nextLevel: m3.currentLevel,
      featuredBonusApplied,
      newMasterLevel: lvRes.newLevel,
      isMasterReplay: !isFirstClear,
      buildReduction,
      leaderboardRankUp,
    };
}

export function trialsSpendPuzzleHelperGold(sim: ParkSimulation, goldCost: number): { ok: boolean; msg: string } {
    const cost = Math.max(0, Math.round(goldCost));
    if (sim.state.sandboxMode || cost === 0) {
      return { ok: true, msg: 'Đã kích hoạt trợ giúp phép thuật!' };
    }
    if (sim.state.galleons < cost) {
      return {
        ok: false,
        msg: `Cần ${cost}G từ Trang Trại (Đơn Hàng Cú & Thu Hoạch) để dùng thêm trợ giúp!`,
      };
    }
    sim.state.galleons -= cost;
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: `Đã dùng ${cost}G kích hoạt trợ giúp phép thuật!` };
}

export const PHOENIX_TALISMAN_DISCIPLINES: readonly MinigameTrialKind[] = [
  'match3',
  'sudoku',
  'caro',
  'chess',
  'blocks',
];
export const MAX_DAILY_PHOENIX_TALISMANS = PHOENIX_TALISMAN_DISCIPLINES.length; // 5 lần/ngày (1 lần/môn)

function ensurePhoenixTalismanDailyState(
  state: GameState,
  nowMs?: number
): PhoenixTalismanDailyUsageState {
  const todayKey = getLocalCalendarResetKey(nowMs);
  if (state.phoenixTalismanDaily && state.phoenixTalismanDaily.dayKey > todayKey) {
    if (!state.phoenixTalismanDaily.usedByGame) {
      state.phoenixTalismanDaily.usedByGame = {};
    }
    return state.phoenixTalismanDaily;
  }
  if (!state.phoenixTalismanDaily || state.phoenixTalismanDaily.dayKey !== todayKey) {
    state.phoenixTalismanDaily = {
      dayKey: todayKey,
      usedByGame: {},
    };
  } else if (!state.phoenixTalismanDaily.usedByGame) {
    state.phoenixTalismanDaily.usedByGame = {};
  }
  return state.phoenixTalismanDaily;
}

export function trialsGetPhoenixTalismanDailyStatus(
  sim: ParkSimulation,
  nowMs?: number
): {
  dayKey: string;
  usedCount: number;
  maxDaily: number;
  remainingToday: number;
  usedByGame: Partial<Record<MinigameTrialKind, boolean>>;
} {
  const daily = ensurePhoenixTalismanDailyState(sim.state, nowMs);
  let usedCount = 0;
  for (const kind of PHOENIX_TALISMAN_DISCIPLINES) {
    if (daily.usedByGame[kind] === true) {
      usedCount += 1;
    }
  }
  return {
    dayKey: daily.dayKey,
    usedCount,
    maxDaily: MAX_DAILY_PHOENIX_TALISMANS,
    remainingToday: Math.max(0, MAX_DAILY_PHOENIX_TALISMANS - usedCount),
    usedByGame: { ...daily.usedByGame },
  };
}

export function trialsIsPhoenixTalismanUsedToday(
  sim: ParkSimulation,
  kind: MinigameTrialKind,
  nowMs?: number
): boolean {
  const daily = ensurePhoenixTalismanDailyState(sim.state, nowMs);
  return daily.usedByGame[kind] === true;
}

export function trialsCanUsePhoenixTalismanInGame(
  sim: ParkSimulation,
  kind: MinigameTrialKind,
  nowMs?: number
): {
  ok: boolean;
  usedTodayInGame: boolean;
  usedCountToday: number;
  maxDaily: number;
  msg: string;
} {
  const status = trialsGetPhoenixTalismanDailyStatus(sim, nowMs);
  if (status.usedByGame[kind] === true) {
    const meta = getMinigameKindLabelVi(kind);
    return {
      ok: false,
      usedTodayInGame: true,
      usedCountToday: status.usedCount,
      maxDaily: status.maxDaily,
      msg: `Hôm nay bạn đã dùng 🔥 Bùa Phượng Hoàng ở môn ${meta.nameVi} rồi (giới hạn 1 lần/môn/ngày • đã dùng ${status.usedCount}/${status.maxDaily} môn hôm nay, mở lại sau 00:00)!`,
    };
  }
  if (status.usedCount >= status.maxDaily) {
    return {
      ok: false,
      usedTodayInGame: true,
      usedCountToday: status.usedCount,
      maxDaily: status.maxDaily,
      msg: `Hôm nay bạn đã dùng hết ${status.maxDaily}/${status.maxDaily} lượt 🔥 Bùa Phượng Hoàng trên cả 5 môn khảo thí! Hẹn mở lại sau 00:00.`,
    };
  }
  if (!sim.state.sandboxMode && trialsGetPhoenixTalismanCount(sim) <= 0) {
    return {
      ok: false,
      usedTodayInGame: false,
      usedCountToday: status.usedCount,
      maxDaily: status.maxDaily,
      msg: 'Chưa có 🔥 Bùa Phượng Hoàng — hãy niệm đúng 8 câu Thần Chú Đa Ngữ, giao Đơn Cú hoặc rèn tại Kho Nông Sản!',
    };
  }
  return {
    ok: true,
    usedTodayInGame: false,
    usedCountToday: status.usedCount,
    maxDaily: status.maxDaily,
    msg: '',
  };
}

export function trialsGetPhoenixTalismanCount(sim: ParkSimulation): number {
    return Math.max(
      0,
      Math.min(MAX_PHOENIX_TALISMANS, Math.floor(sim.state.phoenixTalismans ?? 0))
    );
}

export function trialsGrantPhoenixTalisman(sim: ParkSimulation, qty = 1): number {
    const cur = trialsGetPhoenixTalismanCount(sim);
    const next = Math.max(cur, Math.min(MAX_PHOENIX_TALISMANS, cur + Math.max(0, Math.floor(qty))));
    const added = next - cur;
    sim.state.phoenixTalismans = next;
    return added;
}

export function trialsConsumePhoenixTalisman(
  sim: ParkSimulation,
  kind?: MinigameTrialKind,
  nowMs?: number
): { ok: boolean; msg: string } {
    if (kind) {
      const gate = trialsCanUsePhoenixTalismanInGame(sim, kind, nowMs);
      if (!gate.ok) {
        return { ok: false, msg: gate.msg };
      }
    } else if (!sim.state.sandboxMode && trialsGetPhoenixTalismanCount(sim) <= 0) {
      return {
        ok: false,
        msg: 'Chưa có 🔥 Bùa Phượng Hoàng — hãy niệm đúng 8 câu Thần Chú Đa Ngữ, giao Đơn Cú hoặc rèn tại Kho Nông Sản!',
      };
    }

    if (!sim.state.sandboxMode) {
      const cur = trialsGetPhoenixTalismanCount(sim);
      sim.state.phoenixTalismans = Math.max(0, cur - 1);
    }
    if (kind) {
      const daily = ensurePhoenixTalismanDailyState(sim.state, nowMs);
      daily.usedByGame[kind] = true;
    }
    if (typeof sim.audio.playTalismanBlast === 'function') {
      sim.audio.playTalismanBlast();
    } else {
      sim.audio.playSpell();
    }
    sim.saveToStorage();
    sim.onUiChange?.();
    const afterStatus = trialsGetPhoenixTalismanDailyStatus(sim, nowMs);
    return {
      ok: true,
      msg: kind
        ? `🔥 Đã kích hoạt Bùa Phượng Hoàng (${afterStatus.usedCount}/${afterStatus.maxDaily} môn hôm nay)!`
        : '🔥 Đã kích hoạt Bùa Trợ Chiến Phượng Hoàng!',
    };
}

export function trialsRefundPhoenixTalismanAttempt(
  sim: ParkSimulation,
  kind: MinigameTrialKind,
  nowMs?: number
): void {
  const daily = ensurePhoenixTalismanDailyState(sim.state, nowMs);
  delete daily.usedByGame[kind];
  if (!sim.state.sandboxMode) {
    trialsGrantPhoenixTalisman(sim, 1);
  }
  sim.saveToStorage();
  sim.onUiChange?.();
}

export function trialsGetCraftablePhoenixBarnGood(sim: ParkSimulation): FarmGoodId | null {
    for (const gid of PHOENIX_FORGE_ELIGIBLE_GOODS) {
      if (sim.getFarmItemCount(gid) >= 1) return gid;
    }
    return null;
}

export function trialsCraftPhoenixTalismanFromBarn(sim: ParkSimulation): { ok: boolean; msg: string } {
    const cur = trialsGetPhoenixTalismanCount(sim);
    if (cur >= MAX_PHOENIX_TALISMANS) {
      return {
        ok: false,
        msg: `Túi Bùa Phượng Hoàng đã đầy tối đa (${MAX_PHOENIX_TALISMANS}/${MAX_PHOENIX_TALISMANS} 🔥)!`,
      };
    }
    const gid = trialsGetCraftablePhoenixBarnGood(sim);
    if (!sim.state.sandboxMode) {
      if (!gid) {
        return {
          ok: false,
          msg: 'Cần ít nhất 1 thành phẩm Xưởng (Bánh Táo, Bánh Bí Ngô, Mật Ong, Bia Bơ...) trong Kho Nông Sản để rèn Bùa Phượng Hoàng!',
        };
      }
      if (sim.state.galleons < PHOENIX_FORGE_GOLD_COST) {
        return {
          ok: false,
          msg: `Cần ${PHOENIX_FORGE_GOLD_COST}G + 1 thành phẩm Xưởng để rèn 1 🔥 Bùa Phượng Hoàng!`,
        };
      }
      sim.consumeFarmItemFromBarn(gid, 1);
      sim.state.galleons -= PHOENIX_FORGE_GOLD_COST;
      sim.state.finance.constructionSpent += PHOENIX_FORGE_GOLD_COST;
    }

    const usedMeta = gid ? FARM_GOODS[gid] : null;
    trialsGrantPhoenixTalisman(sim, 1);
    sim.addXp(18);
    sim.audio.playLevelUp();
    const msg = usedMeta
      ? `🔥 Đã rèn +1 Bùa Trợ Chiến Phượng Hoàng từ 1 ${usedMeta.emoji} ${usedMeta.name} & ${PHOENIX_FORGE_GOLD_COST}G (Đang có: ${trialsGetPhoenixTalismanCount(sim)}/${MAX_PHOENIX_TALISMANS})!`
      : `🔥 Đã rèn +1 Bùa Trợ Chiến Phượng Hoàng (Đang có: ${trialsGetPhoenixTalismanCount(sim)}/${MAX_PHOENIX_TALISMANS})!`;
    sim.onToast?.(msg, '🔥');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function trialsCompletePuzzleArcadeVictory(sim: ParkSimulation, 
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
  } {
    const isScoredMode = isScoredLeaderboardGame(mode);
    sim.state.lastPlayedMinigame = mode;
    const prevLbRank = isScoredMode ? trialsGetPlayerMinigameRank(sim, mode, 'valley') : 0;
    const pa = sim.state.puzzleArcade;
    const m3 = sim.state.match3;

    const infoBefore = trialsGetDisciplineStageInfo(sim, mode);
    const playedStage = infoBefore.currentStage;
    const prevCleared = infoBefore.clearedStages;
    const isFirstClear = prevCleared < MAX_MINIGAME_STAGE && playedStage > prevCleared;

    const reqBefore = trialsGetRequiredLevelTrial(sim);
    const featuredKind =
      reqBefore?.kind ??
      getLevelTrialRequirement(MAX_LEVEL + (pa.featuredWinsCount ?? 0))?.kind ??
      'match3';
    const featuredBonusApplied = Boolean(
      isFirstClear &&
        featuredKind === mode &&
        !sim.state.sandboxMode &&
        !sim.isHeadmasterPreview
    );

    const streakMult = 1 + Math.min(3, m3.winStreak ?? 0) * 0.15;
    let starsEarned = 0;
    let sandEarned = 0;
    let goldEarned = 0;
    let xpEarned = 0;

    if (isFirstClear) {
      const baseStars = Math.max(1, Math.round(reward.stars));
      let featuredBonusStars = 0;
      if (featuredBonusApplied) {
        pa.featuredWinsCount = (pa.featuredWinsCount ?? 0) + 1;
        if ((sim.state.featuredStarClaimedLevel ?? 0) < sim.state.level) {
          featuredBonusStars += 1;
          sim.state.featuredStarClaimedLevel = sim.state.level;
        }
        if (pa.featuredWinsCount % 5 === 0) {
          featuredBonusStars += 1;
        }
      }
      const sawtooth = getStageSawtoothTag(playedStage);
      starsEarned = baseStars + featuredBonusStars;
      sandEarned = Math.max(0, Math.round(reward.sand)) + (featuredBonusApplied ? 1 : 0);
      goldEarned = Math.round(
        Math.max(0, reward.gold) * streakMult * sawtooth.bonusGoldMult * (featuredBonusApplied ? 1.35 : 1)
      );
      xpEarned = Math.max(0, Math.round(reward.xp));

      m3.stars += starsEarned;
      m3.totalStarsEarned += starsEarned;
    } else {
      if (prevCleared >= MAX_MINIGAME_STAGE && playedStage === MAX_MINIGAME_STAGE) {
        starsEarned = 1;
        m3.stars += 1;
        m3.totalStarsEarned += 1;
      }
      goldEarned = Math.max(18, Math.round(Math.max(0, reward.gold) * 0.5));
      xpEarned = Math.max(10, Math.round(Math.max(0, reward.xp) * 0.5));
    }

    m3.winStreak = (m3.winStreak ?? 0) + 1;
    const examStreak = (sim.state.examWinStreak ?? 0) + 1;
    sim.state.examWinStreak = examStreak;
    const streakInfo = computeExamStreakReductionSec(examStreak);
    if (streakInfo.dewPhialAwarded > 0) {
      sim.state.morningDewPhials = Math.min(20, (sim.state.morningDewPhials ?? 0) + streakInfo.dewPhialAwarded);
      sim.onToast?.(
        `🧪 Chuỗi thắng Khảo Thí ×${examStreak} (${streakInfo.multiplierLabel}): Nhận +${streakInfo.dewPhialAwarded} Bình Sương Mai (-15p có chọn lọc)!`,
        '🧪'
      );
    }
    sim.state.timeSand += sandEarned;
    sim.state.galleons += goldEarned;
    sim.state.finance.harvestRevenue += goldEarned;

    pa.activeMode = mode;
    pa.totalPuzzlesSolved += 1;

    const newCleared = Math.min(MAX_MINIGAME_STAGE, Math.max(prevCleared, playedStage));
    const nextStage = Math.min(MAX_MINIGAME_STAGE, newCleared + 1);

    if (mode === 'sudoku') {
      pa.sudokuStage = nextStage;
      pa.sudokuCleared = newCleared;
      pa.sudokuSession = null;
    } else if (mode === 'caro') {
      pa.caroStage = nextStage;
      pa.caroCleared = newCleared;
      pa.caroSession = null;
    } else if (mode === 'chess') {
      pa.chessStage = nextStage;
      pa.chessCleared = newCleared;
      pa.chessSession = null;
    } else {
      pa.blockStage = nextStage;
      pa.blockCleared = newCleared;
      pa.onetSession = null;
    }

    let newlyRestoredPainting = false;
    if (isFirstClear && reward.paintingId && !pa.restoredPaintings.includes(reward.paintingId)) {
      pa.restoredPaintings.push(reward.paintingId);
      newlyRestoredPainting = true;
    }

    const lvRes = trialsAdvanceMasterPuzzleLevel(sim, mode, isFirstClear);
    sim.addXp(xpEarned);
    sim.addHarvestFeastPoints(isFirstClear ? (playedStage % 25 === 0 ? 40 : 28) : 14);
    sim.recordQuestProgress('cast_spells', undefined, 2);
    sim.checkAndToastAchievements?.();
    if (isFirstClear && playedStage === MAX_MINIGAME_STAGE) {
      sim.launchFireworksShow(18);
    }

    const rawReduceSec = streakInfo.rawReduceSec;
    const buildReduction = sim.applyConstructionReductionFromGameplay(
      rawReduceSec,
      'Đại Sảnh Khảo Thí'
    );

    let leaderboardRankUp: LeaderboardRankChange | undefined;
    if (isScoredMode) {
      const sessionPts = Math.max(
        950 + playedStage * 80,
        Math.round(sessionMetrics?.sessionScore ?? 0)
      );
      leaderboardRankUp = recordMinigameSessionResult(sim.state, mode, {
        clearedStage: newCleared,
        sessionScore: sessionPts,
        efficiency: sessionMetrics?.efficiency,
        streak: m3.winStreak,
        previousRankOverride: prevLbRank,
      });
      void submitPlayerCloudLeaderboardEntry(sim.state, mode);
    }

    sim.audio.playLevelUp();
    if (starsEarned > 0) sim.onRewardFly?.('stars', starsEarned);
    if (goldEarned > 0) sim.onRewardFly?.('galleons', goldEarned);
    if (sandEarned > 0) sim.onRewardFly?.('sand', sandEarned);
    sim.advanceTutorialStep('earn_magic_star');
    sim.saveToStorage();
    sim.onUiChange?.();

    return {
      starsEarned,
      sandEarned,
      goldEarned,
      xpEarned,
      newlyRestoredPainting,
      nextStage,
      featuredBonusApplied,
      newMasterLevel: lvRes.newLevel,
      isMasterReplay: !isFirstClear,
      buildReduction,
      leaderboardRankUp,
    };
}
