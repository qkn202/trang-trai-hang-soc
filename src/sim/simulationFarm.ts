// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.


import {
  COMPOST_SHORTAGE_BUYOUT_SICKLE,
  computeEconomicCycleSeconds,
  computeRealTimeBuildSeconds,
  computeStrategicPlotGrowSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FarmWorkshopRecipe,
  formatDurationCompactVi,
  getCatalogItem,
  getCropFamily,
  getCropMasteryTierInfo,
  getFarmItemMeta,
  getMinRemainingBuildFloorSec,
  getSoilTierInfo,
  GOURMET_FEED_CROP_PRIORITY,
  GOURMET_FEED_QTY,
  MINIGAME_CLEAR_REDUCTION_SEC,
  PASTURE_ANIMALS,
  SOIL_TIERS,
  SoilTierMeta,
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
  HogsmeadeMarketFairState,
  HomeOwlLanternMark,
  HouseName,
  IsoDirection,
  LanguageQuizState,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  LevelTrialRequirement,
  MarketFairDeal,
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
  getVietnamCalendarKey,
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
  MAX_PHOENIX_TALISMANS,
  PHOENIX_FORGE_ELIGIBLE_GOODS,
  PHOENIX_FORGE_GOLD_COST,
  starIncomeMultiplier,
  VALLEY_VILLAGER_PROFILES,
} from './simulationData';
export { FARM_HARVEST_CHEST_XP } from './simulationData';
export type { ValleyVillagerProfile } from './simulationData';
import type { ParkSimulation } from './simulation';

// HPVN: rewarded correct Học Viện Thần Chú answers per VN day
export const QUIZ_DAILY_REWARD_CAP = 30;


export function farmEnsureFarmBarn(sim: ParkSimulation): FarmBarnState {
    if (!sim.state.farmBarn) {
      sim.state.farmBarn = createInitialFarmBarnState();
    }
    return sim.state.farmBarn;
}

export function farmGetBarnTotalUsed(sim: ParkSimulation): number {
    const barn = sim.ensureFarmBarn();
    const cropSum = Object.values(barn.crops).reduce((a, b) => a + (b || 0), 0);
    const goodSum = Object.entries(barn.goods).reduce(
      (a, [key, val]) => (key === 'muggle_plug_kit' ? a : a + (val || 0)),
      0
    );
    return cropSum + goodSum;
}

export function farmGetFarmItemCount(sim: ParkSimulation, itemId: FarmItemId): number {
    const barn = sim.ensureFarmBarn();
    if (itemId in FARM_CROPS) {
      return barn.crops[itemId as FarmCropId] ?? 0;
    }
    return barn.goods[itemId as FarmGoodId] ?? 0;
}

export function farmAddFarmItemToBarn(sim: ParkSimulation, itemId: FarmItemId, qty: number): number {
    if (qty <= 0) return 0;
    const barn = sim.ensureFarmBarn();
    const used = sim.getBarnTotalUsed();
    const space = Math.max(0, barn.capacity - used);
    const actual = Math.min(qty, Math.max(1, space)); // Always allow at least 1 if barn just hit cap, or clamp cleanly
    const safeAdd = space <= 0 ? 0 : actual;
    if (safeAdd <= 0) {
      return 0;
    }
    if (itemId in FARM_CROPS) {
      const cid = itemId as FarmCropId;
      barn.crops[cid] = (barn.crops[cid] ?? 0) + safeAdd;
    } else {
      const gid = itemId as FarmGoodId;
      barn.goods[gid] = (barn.goods[gid] ?? 0) + safeAdd;
    }
    return safeAdd;
}

export function farmConsumeFarmItemFromBarn(sim: ParkSimulation, itemId: FarmItemId, qty: number): void {
    const barn = sim.ensureFarmBarn();
    if (itemId in FARM_CROPS) {
      const cid = itemId as FarmCropId;
      barn.crops[cid] = Math.max(0, (barn.crops[cid] ?? 0) - qty);
    } else {
      const gid = itemId as FarmGoodId;
      barn.goods[gid] = Math.max(0, (barn.goods[gid] ?? 0) - qty);
    }
}

export interface BarnUpgradeCostInfo {
  plugCost: number;
  plugsInBarn: number;
  hasPlug: boolean;
  baseGoldCost: number;
  plugShortageBuyout: number;
  effectiveGoldCost: number;
  canAfford: boolean;
}

export function farmGetBarnUpgradeCostInfo(sim: ParkSimulation): BarnUpgradeCostInfo {
  const barn = sim.ensureFarmBarn();
  const tier = Math.max(1, Math.round((barn.capacity - 40) / 20));
  const baseGoldCost = 160 + tier * 90;
  const plugCost = 1;
  const plugShortageBuyout = 120;
  const plugsInBarn = Math.max(0, barn.goods.muggle_plug_kit ?? 0);
  const hasPlug = plugsInBarn >= plugCost;
  const effectiveGoldCost = hasPlug ? baseGoldCost : baseGoldCost + plugShortageBuyout;
  const canAfford = Boolean(sim.state.sandboxMode) || sim.state.galleons >= effectiveGoldCost;
  return {
    plugCost,
    plugsInBarn,
    hasPlug,
    baseGoldCost,
    plugShortageBuyout,
    effectiveGoldCost,
    canAfford,
  };
}

export function farmUpgradeFarmBarn(sim: ParkSimulation): { ok: boolean; msg: string } {
    const barn = sim.ensureFarmBarn();
    const costInfo = farmGetBarnUpgradeCostInfo(sim);
    const {
      plugCost,
      plugsInBarn,
      hasPlug,
      baseGoldCost,
      plugShortageBuyout,
      effectiveGoldCost,
    } = costInfo;

    let spentDetail = '';
    if (!sim.state.sandboxMode) {
      if (hasPlug) {
        if (sim.state.galleons < baseGoldCost) {
          return {
            ok: false,
            msg: `Cần ${plugCost} 🔌 Bộ Phích Cắm Muggle & ${baseGoldCost} Sickle để nâng cấp Kho Nông Sản (+20 ô)!`,
          };
        }
        barn.goods.muggle_plug_kit = Math.max(0, plugsInBarn - plugCost);
        sim.state.galleons -= baseGoldCost;
        spentDetail = ` (-${plugCost}🔌, -${baseGoldCost} Sickle)`;
      } else {
        if (sim.state.galleons < effectiveGoldCost) {
          return {
            ok: false,
            msg: `Chưa có 🔌 Bộ Phích Cắm Muggle: cần ${effectiveGoldCost} Sickle (${baseGoldCost} Sickle + ${plugShortageBuyout} Sickle bù 1🔌) hoặc chế 1🔌 ở Kho Ông Arthur để nâng với ${baseGoldCost} Sickle!`,
          };
        }
        sim.state.galleons -= effectiveGoldCost;
        spentDetail = ` (-${effectiveGoldCost} Sickle gồm ${baseGoldCost} Sickle + ${plugShortageBuyout} Sickle bù 1🔌)`;
      }
    }

    barn.capacity += 20;
    sim.addXp(45);
    sim.audio.playLevelUp();
    const msg = `Kho Nông Sản Hang Sóc đã mở rộng lên ${barn.capacity} ô chứa${spentDetail} (+45 ⭐)!`;
    sim.onToast?.(msg, '🏡');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return { ok: true, msg };
}

export function farmSellFarmItemFromBarn(sim: ParkSimulation, itemId: FarmItemId, qty = 1): { ok: boolean; msg: string } {
    const have = sim.getFarmItemCount(itemId);
    const take = Math.min(have, Math.max(1, qty));
    if (take <= 0) {
      return { ok: false, msg: 'Không còn mặt hàng này trong Kho Nông Sản!' };
    }
    const meta = getFarmItemMeta(itemId);
    farmConsumeFarmItemFromBarn(sim, itemId, take);
    const gold = meta.sellValue * take;
    const xp = Math.max(2, Math.round(meta.sellValue * 0.25 * take));
    sim.state.galleons += gold;
    sim.state.finance.shopRevenue += gold;
    sim.addXp(xp);
    sim.audio.playHarvestBubble();
    const msg = `🪙 Đã bán ${take} ${meta.emoji} ${meta.name} thu về +${gold} Sickle & +${xp} ⭐!`;
    sim.onToast?.(msg, meta.emoji);
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return { ok: true, msg };
}

export function farmEnsureLanguageQuiz(sim: ParkSimulation): LanguageQuizState {
    if (!sim.state.languageQuiz) {
      sim.state.languageQuiz = createInitialLanguageQuizState();
    }
    return sim.state.languageQuiz;
}

export function farmGetSeedCount(sim: ParkSimulation, cropId: FarmCropId): number {
    const barn = sim.ensureFarmBarn();
    if (!barn.seeds) barn.seeds = {};
    return Math.max(0, Math.floor(barn.seeds[cropId] ?? 0));
}

export function farmAddCropSeeds(sim: ParkSimulation, cropId: FarmCropId, qty: number): number {
    const barn = sim.ensureFarmBarn();
    if (!barn.seeds) barn.seeds = {};
    const add = Math.max(0, Math.floor(qty));
    barn.seeds[cropId] = Math.max(0, (barn.seeds[cropId] ?? 0) + add);
    return barn.seeds[cropId] ?? 0;
}

export function farmBuyCropSeedWithGold(sim: ParkSimulation, 
    cropId: FarmCropId,
    qty = 1
  ): { ok: boolean; msg: string; newSeedCount: number } {
    if (sim.isVisitingNeighbor) {
      return {
        ok: false,
        msg: 'Chế độ Khách Tham Quan — không thể mua hạt giống khi đang thăm bạn bè!',
        newSeedCount: sim.getSeedCount(cropId),
      };
    }
    const crop = FARM_CROPS[cropId];
    if (!sim.state.sandboxMode && sim.state.level < crop.unlockLevel) {
      return {
        ok: false,
        msg: `${crop.emoji} ${crop.name} mở khóa ở Cấp ${crop.unlockLevel}!`,
        newSeedCount: sim.getSeedCount(cropId),
      };
    }
    const count = Math.max(1, Math.min(20, Math.floor(qty)));
    const totalCost = sim.state.sandboxMode ? 0 : crop.seedCost * count;
    if (!sim.state.sandboxMode && sim.state.galleons < totalCost) {
      return {
        ok: false,
        msg: `Cần ${totalCost.toLocaleString('vi-VN')} Sickle để mua ${count} hạt ${crop.name} — hãy niệm Thần Chú Đa Ngữ (0 Sickle) để nhận ngay 1–2 hạt miễn phí!`,
        newSeedCount: sim.getSeedCount(cropId),
      };
    }

    if (totalCost > 0) {
      sim.state.galleons -= totalCost;
      sim.state.finance.constructionSpent += totalCost;
    }
    const newSeedCount = sim.addCropSeeds(cropId, count);
    sim.audio.playHarvestBubble();
    sim.advanceTutorialStep('seed_quiz_or_buy');
    const msg = `🪙 Đã mua ${count} hạt giống ${crop.emoji} ${crop.name} (-${totalCost.toLocaleString('vi-VN')} Sickle • Túi có: ${newSeedCount} hạt)!`;
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return { ok: true, msg, newSeedCount };
}

export function farmCompleteSeedLanguageQuizAttempt(sim: ParkSimulation, 
    cropId: FarmCropId,
    challenge: ActiveQuizChallenge,
    correct: boolean
  ): QuizAttemptOutcome & { newSeedCount: number; cropName: string } {
    const quiz = sim.ensureLanguageQuiz();
    const crop = FARM_CROPS[cropId];
    // HPVN: at most QUIZ_DAILY_REWARD_CAP rewarded correct answers per VN day, then practice only
    const dayKey = getVietnamCalendarKey();
    if (sim.state.quizRewardDaily?.dayKey !== dayKey) sim.state.quizRewardDaily = { dayKey, count: 0 };
    const daily = sim.state.quizRewardDaily;
    const rewarded = daily.count < QUIZ_DAILY_REWARD_CAP;
    const outcome = recordQuizAttempt(quiz, challenge, correct, rewarded);
    if (correct && rewarded) daily.count += 1;
    let newSeedCount = sim.getSeedCount(cropId);
    if (outcome.seedsAwarded > 0) {
      newSeedCount = sim.addCropSeeds(cropId, outcome.seedsAwarded);
    }
    if (outcome.xpAwarded > 0) {
      sim.addXp(outcome.xpAwarded);
    }

    let phoenixTalismanAwarded = 0;
    let buildReduction: BuildReductionResult | undefined;
    const leaderboardRankUp: LeaderboardRankChange | undefined = undefined;
    let talismanProgress = Math.max(0, Math.min(7, Math.floor(sim.state.quizTalismanProgress ?? 0)));
    if (correct && rewarded) {
      const nextProg = talismanProgress + 1;
      if (nextProg >= 8) {
        talismanProgress = 0;
        sim.state.quizTalismanProgress = 0;
        phoenixTalismanAwarded = sim.grantPhoenixTalisman(1);
      } else {
        talismanProgress = nextProg;
        sim.state.quizTalismanProgress = nextProg;
      }
      const quizReduceSec = MINIGAME_CLEAR_REDUCTION_SEC;
      buildReduction = sim.applyConstructionReductionFromGameplay(
        quizReduceSec,
        'Học Viện Thần Chú'
      );
      sim.addHarvestFeastPoints(challenge.tier === 'advanced' ? 12 : 9);
      if (outcome.tierAutoPromoted || phoenixTalismanAwarded > 0) {
        sim.audio.playLevelUp();
      } else {
        sim.audio.playMatchPop(outcome.seedsAwarded);
      }
      sim.advanceTutorialStep('seed_quiz_or_buy');
      sim.checkAndToastAchievements?.();
    } else {
      sim.audio.playClick();
    }
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ...outcome,
      capReached: daily.count >= QUIZ_DAILY_REWARD_CAP,
      phoenixTalismanAwarded,
      talismanProgress,
      buildReduction,
      leaderboardRankUp,
      newSeedCount,
      cropName: crop.name,
    };
}

export function farmPlantCropOnPlot(sim: ParkSimulation, 
    uid: string,
    cropId: FarmCropId
  ): { ok: boolean; needSeedAcquire?: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể gieo hạt trên ruộng của bạn bè!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy thửa đất canh tác!' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isFarmlandPlot) return { ok: false, msg: 'Công trình này không phải thửa đất canh tác!' };
    if (b.cropId) {
      return { ok: false, msg: 'Thửa đất đã có hạt giống đang mọc!' };
    }

    const crop = FARM_CROPS[cropId];
    if (!sim.state.sandboxMode && sim.state.level < crop.unlockLevel) {
      return { ok: false, msg: `${crop.emoji} ${crop.name} mở khóa ở Cấp ${crop.unlockLevel}!` };
    }

    const haveSeeds = sim.getSeedCount(cropId);
    if (haveSeeds <= 0) {
      return {
        ok: false,
        needSeedAcquire: true,
        msg: `Túi chưa có hạt giống ${crop.emoji} ${crop.name} — hãy mua bằng Sickle (${crop.seedCost.toLocaleString('vi-VN')} Sickle/hạt) hoặc Niệm Thần Chú Đa Ngữ (0 Sickle)!`,
      };
    }

    const barn = sim.ensureFarmBarn();
    if (!barn.seeds) barn.seeds = {};
    const leftSeeds = Math.max(0, haveSeeds - 1);
    barn.seeds[cropId] = leftSeeds;

    const now = Date.now();
    const soilKey = `${b.gx},${b.gy}`;
    const prevSoil = sim.state.plotSoilState?.[soilKey];
    const fatigueStep = Math.max(b.harvestCycleCount ?? 0, prevSoil?.fatigueStep ?? 0);
    const curFamily = getCropFamily(cropId);
    const rotatedFamily = Boolean(prevSoil && prevSoil.lastFamily !== curFamily);
    const masteryHarvests = sim.state.cropMastery?.[cropId] ?? 0;
    const strat = computeStrategicPlotGrowSeconds(
      fatigueStep,
      rotatedFamily,
      masteryHarvests,
      crop.growSec
    );
    const effectiveGrowSec = strat.growSec;
    const growMs = sim.state.sandboxMode ? 4000 : effectiveGrowSec * 1000;
    b.cropId = cropId;
    b.cropPlantedAt = now;
    b.cropReadyAt = now + growMs;
    b.cropWateredBoost = false;
    b.cropRotatedBonus = strat.isRotatedBonus;
    b.readyBubbles = 0;
    b.storedSickle = 0;
    b.storedXp = 0;

    sim.audio.playPlace();
    sim.onBuildingTactile?.(b.uid);
    const rotNote = strat.isRotatedBonus ? ' • 🍀 Luân Canh Vàng!' : '';
    sim.spawnFloatingText(
      b.gx + item.width * 0.5,
      b.gy + item.height * 0.5,
      `🌱 Gieo ${crop.emoji} ${crop.name}${strat.isRotatedBonus ? ' (Luân Canh ×2!)' : ` (còn ${leftSeeds} hạt)`}!`,
      '#86efac'
    );
    sim.advanceTutorialStep('sow_and_merge_plot');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ok: true,
      msg: `🌱 Đã gieo 1 hạt ${crop.emoji} ${crop.name} (Túi còn ${leftSeeds} hạt • ${formatDurationCompactVi(effectiveGrowSec)} chín${rotNote})!`,
    };
}

export function farmWaterCropPlot(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return sim.helpVisitedNeighborBuilding(uid);
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.cropId || !b.cropReadyAt) {
      return { ok: false, msg: 'Thửa ruộng chưa gieo hạt giống!' };
    }
    const now = Date.now();
    if (now >= b.cropReadyAt) {
      return { ok: false, msg: 'Nông sản đã chín vàng — hãy bấm Liềm Vàng để gặt ngay!' };
    }
    if (b.cropWateredBoost) {
      return { ok: false, msg: 'Luống cây này đã được tưới đẫm nước mát rồi!' };
    }
    const leftMs = b.cropReadyAt - now;
    const savedMs = Math.max(3000, Math.round(leftMs * 0.3));
    b.cropReadyAt = Math.max(now + 1000, b.cropReadyAt - savedMs);
    b.cropWateredBoost = true;
    sim.addXp(4);
    if (typeof sim.audio.playWaterSplash === 'function') {
      sim.audio.playWaterSplash();
    } else {
      sim.audio.playSpell();
    }
    sim.onBuildingTactile?.(b.uid);
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, '💧 Aguamenti! Chín nhanh +30%!', '#38bdf8');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return { ok: true, msg: '💧 Đã tưới nước suối mát — cây lớn nhanh hơn 30% (+4 ⭐)!' };
}

export function farmHarvestCropPlot(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể thu hoạch nông sản của bạn bè!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.cropId || !b.cropReadyAt) {
      return { ok: false, msg: 'Thửa ruộng đang trống — hãy chọn hạt giống để gieo nhé!' };
    }
    const now = Date.now();
    if (now < b.cropReadyAt) {
      const left = Math.ceil((b.cropReadyAt - now) / 1000);
      return { ok: false, msg: `Cây đang lớn xanh tốt (${left}s nữa chín)!` };
    }

    const item = getCatalogItem(b.itemId);
    const crop = FARM_CROPS[b.cropId];
    const soilTier = farmGetPlotEffectiveSoilTier(sim, b);
    const soilMeta = getSoilTierInfo(soilTier);
    const isGoldenRotation = Boolean(b.cropRotatedBonus);
    const wasCompost = Boolean(b.cropCompostBoost);
    const baseYield = crop.yieldQty + (b.stars >= 3 ? 1 : 0) + soilMeta.yieldBonus;
    const yieldQty =
      (isGoldenRotation ? baseYield * 2 : baseYield) +
      (wasCompost ? 2 : 0) +
      (isGoldenRotation ? soilMeta.extraRotateYield : 0);
    const added = sim.addFarmItemToBarn(crop.id, yieldQty);
    // HPVN: a full Kho sells the load at the normal sell value (same as selling it from the Kho), no flat bonus
    const soldDirect = added === 0 ? getFarmItemMeta(crop.id).sellValue * yieldQty : 0;

    const prevMastery = sim.state.cropMastery?.[crop.id] ?? 0;
    const nextMastery = prevMastery + 1;
    sim.state.cropMastery = {
      ...(sim.state.cropMastery ?? {}),
      [crop.id]: nextMastery,
    };
    const masteryBefore = getCropMasteryTierInfo(prevMastery);
    const masteryAfter = getCropMasteryTierInfo(nextMastery);
    const gold = Math.round(crop.sellValue * masteryBefore.valueMult * soilMeta.harvestGoldXpMult);
    const xp = Math.round(
      (crop.xp + (isGoldenRotation ? 4 : 0) + (wasCompost ? 8 : 0)) * soilMeta.harvestGoldXpMult
    );

    // Persist soil rotation, permanent soil fertility tier & anti-bulldoze-exploit fatigue by tile coordinate!
    const soilKey = `${b.gx},${b.gy}`;
    const prevSoil = sim.state.plotSoilState?.[soilKey];
    const prevFatigue = Math.max(b.harvestCycleCount ?? 0, prevSoil?.fatigueStep ?? 0);
    const nextFatigue = wasCompost
      ? 0
      : isGoldenRotation && soilMeta.rejuvenateOnRotate
        ? Math.max(0, prevFatigue - 1)
        : isGoldenRotation
          ? Math.max(1, prevFatigue)
          : prevFatigue + 1;
    b.soilTier = soilTier;
    sim.state.plotSoilState = {
      ...(sim.state.plotSoilState ?? {}),
      [soilKey]: {
        lastFamily: getCropFamily(crop.id),
        fatigueStep: nextFatigue,
        ...(soilTier > 1 ? { soilTier } : {}),
        updatedAt: now,
      },
    };

    // Clear plot to freshly-tilled dark loam ready for Seed Picker!
    b.harvestCycleCount = nextFatigue;
    b.cropId = undefined;
    b.cropPlantedAt = undefined;
    b.cropReadyAt = undefined;
    b.cropWateredBoost = false;
    b.cropRotatedBonus = false;
    b.cropCompostBoost = false;
    b.readyBubbles = 0;
    b.storedSickle = 0;
    b.storedXp = 0;

    sim.state.galleons += gold;
    sim.state.finance.harvestRevenue += gold;
    sim.state.stats.totalSickleHarvested += gold;
    sim.state.stats.farmHarvestsCount = (sim.state.stats.farmHarvestsCount ?? 0) + 1;
    sim.addXp(xp);
    sim.addHarvestFeastPoints(crop.isFlowerCrop ? 7 : 5);
    sim.recordQuestProgress('harvest_galleons', undefined, gold);
    if (masteryAfter.tier > masteryBefore.tier) {
      sim.onToast?.(
        `🌾 Thông Thạo ${crop.emoji} ${crop.name} thăng Bậc ${masteryAfter.labelRom} (Giá bán ×${masteryAfter.valueMult.toFixed(2)})!`,
        '🏅'
      );
    }
    sim.checkAndToastAchievements?.();

    sim.audio.playHarvestBubble();
    const cx = b.gx + (item ? item.width * 0.5 : 1);
    const cy = b.gy + (item ? item.height * 0.5 : 1);
    sim.onRewardFly?.('galleons', gold, cx, cy);
    sim.spawnFloatingText(
      cx,
      cy,
      added > 0
        ? `🌾 +${added} ${crop.emoji}  +${gold} 🪙  +${xp} ⭐`
        : `🏡 Kho đầy! Bán thẳng +${gold + soldDirect} 🪙  +${xp} ⭐`,
      '#fde047'
    );
    if (soldDirect > 0) {
      sim.state.galleons += soldDirect;
      sim.state.finance.shopRevenue += soldDirect;
    }
    sim.advanceTutorialStep('harvest_wheat');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ok: true,
      msg:
        added > 0
          ? `🌾 Đã gặt +${added} ${crop.emoji} ${crop.name} cất vào Kho Nông Sản (+${gold} Sickle, +${xp} ⭐)!`
          : `🏡 Kho Nông Sản đã đầy — bán trực tiếp thu +${gold + soldDirect} Sickle!`,
    };
}

export function farmStockAnimalOnPasture(sim: ParkSimulation, 
    uid: string,
    animalId: PastureAnimalId
  ): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể thả thú trên đồng cỏ bạn bè!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy ô Đồng Cỏ Chăn Thả!' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isAnimalPasturePlot) {
      return { ok: false, msg: 'Công trình này không phải Đồng Cỏ Chăn Thả!' };
    }
    if (b.pastureAnimalId) {
      const cur = PASTURE_ANIMALS[b.pastureAnimalId];
      return {
        ok: false,
        msg: `Ô đồng cỏ này đang nuôi ${cur?.emoji ?? '🐾'} ${cur?.name ?? 'vật nuôi'} rồi!`,
      };
    }

    const animal = PASTURE_ANIMALS[animalId];
    if (!animal) return { ok: false, msg: 'Loài thú không hợp lệ!' };
    if (!sim.state.sandboxMode && sim.state.level < animal.unlockLevel) {
      return {
        ok: false,
        msg: `${animal.emoji} ${animal.name} mở khóa ở Cấp ${animal.unlockLevel}!`,
      };
    }
    const isMollyTutorialHenSubsidy = Boolean(
      !sim.state.sandboxMode &&
        animalId === 'burrow_hen' &&
        sim.state.tutorial?.active &&
        !sim.state.tutorial.skipped &&
        !sim.state.tutorial.completedAt &&
        TUTORIAL_STEPS[sim.state.tutorial.stepIndex]?.id === 'pasture_harvest_and_stock' &&
        sim.state.galleons < animal.cost
    );
    if (!sim.state.sandboxMode && !isMollyTutorialHenSubsidy && sim.state.galleons < animal.cost) {
      return {
        ok: false,
        msg: `Cần ${animal.cost.toLocaleString('vi-VN')} 🪙 Sickle để thả ${animal.emoji} ${animal.name} vào đồng cỏ!`,
      };
    }

    if (!sim.state.sandboxMode) {
      sim.state.galleons = isMollyTutorialHenSubsidy ? 0 : sim.state.galleons - animal.cost;
    }

    const now = Date.now();
    const effectiveCycleSec = computeEconomicCycleSeconds(b.harvestCycleCount ?? 0, animal.cycleSec);
    const cycleMs = sim.state.sandboxMode ? 5000 : effectiveCycleSec * 1000;
    b.pastureAnimalId = animalId;
    b.pastureStockedAt = now;
    b.pastureReadyAt = now + cycleMs;
    b.pastureFedBoost = false;
    b.readyBubbles = 0;
    b.storedSickle = 0;
    b.storedXp = 0;

    sim.audio.playPlace();
    sim.onBuildingTactile?.(b.uid);
    sim.spawnFloatingText(
      b.gx + item.width * 0.5,
      b.gy + item.height * 0.5,
      `🐾 Thả ${animal.emoji} ${animal.name}!`,
      '#86efac'
    );
    sim.advanceTutorialStep('pasture_harvest_and_stock');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ok: true,
      msg: `🐾 Đã thả ${animal.emoji} ${animal.name} vào Đồng Cỏ Chăn Thả (${formatDurationCompactVi(effectiveCycleSec)}/mẻ)!`,
    };
}

export function farmFeedAnimalPasture(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return sim.helpVisitedNeighborBuilding(uid);
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.pastureAnimalId || !b.pastureReadyAt) {
      return { ok: false, msg: 'Đồng cỏ đang trống — hãy chọn thú để thả vào nhé!' };
    }
    const now = Date.now();
    if (now >= b.pastureReadyAt) {
      return { ok: false, msg: 'Sản vật đồng cỏ đã sẵn sàng — hãy bấm thu hoạch ngay!' };
    }
    if (b.pastureFedBoost) {
      return { ok: false, msg: 'Đàn thú trên đồng cỏ này đã được cho ăn no nê rồi!' };
    }
    const leftMs = b.pastureReadyAt - now;
    const savedMs = Math.max(3000, Math.round(leftMs * 0.35));
    b.pastureReadyAt = Math.max(now + 1000, b.pastureReadyAt - savedMs);
    b.pastureFedBoost = true;
    sim.addXp(5);
    sim.recordQuestProgress('feed_creatures', undefined, 1);
    sim.audio.playSpell();
    sim.onBuildingTactile?.(b.uid);
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, '🌾 Cỏ Mật! Nhanh +35%!', '#86efac');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ok: true,
      msg: '🌾 Đã cho đàn thú ăn cỏ ba lá mật — thu hoạch nhanh hơn 35% (+5 ⭐)!',
    };
}

export function farmHarvestAnimalPasture(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể thu hoạch đồng cỏ của bạn bè!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.pastureAnimalId || !b.pastureReadyAt) {
      return { ok: false, msg: 'Đồng cỏ đang trống — hãy chọn thú để thả vào nhé!' };
    }
    const now = Date.now();
    if (now < b.pastureReadyAt) {
      const left = Math.ceil((b.pastureReadyAt - now) / 1000);
      return { ok: false, msg: `Đàn thú đang thong thả gặm cỏ (${left}s nữa thu hoạch)!` };
    }

    const item = getCatalogItem(b.itemId);
    const animal = PASTURE_ANIMALS[b.pastureAnimalId];
    const goodMeta = FARM_GOODS[animal.goodId];
    const wasGourmet = Boolean(b.pastureGourmetBoost);
    const baseYield = animal.yieldQty + (b.stars >= 3 ? 1 : 0);
    const yieldQty = wasGourmet ? baseYield * 2 : baseYield;
    const added = sim.addFarmItemToBarn(animal.goodId, yieldQty);
    // HPVN: a full Kho sells the load at the normal sell value (same as selling it from the Kho), no flat bonus
    const soldDirect = added === 0 ? getFarmItemMeta(animal.goodId).sellValue * yieldQty : 0;
    const gold = wasGourmet ? Math.round(animal.sellValue * 1.5) : animal.sellValue;
    const xp = wasGourmet ? Math.round(animal.xp * 1.5) : animal.xp;
    const compostGain = wasGourmet ? 2 : 1;
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + compostGain);

    // Automatically restart the next grazing cycle so the animal stays happily on the pasture!
    b.harvestCycleCount = (b.harvestCycleCount ?? 0) + 1;
    const nextCycleSec = computeEconomicCycleSeconds(b.harvestCycleCount, animal.cycleSec);
    const nextCycleMs = sim.state.sandboxMode ? 5000 : nextCycleSec * 1000;
    b.pastureStockedAt = now;
    b.pastureReadyAt = now + nextCycleMs;
    b.pastureFedBoost = false;
    b.pastureGourmetBoost = false;
    b.readyBubbles = 0;
    b.storedSickle = 0;
    b.storedXp = 0;

    sim.state.galleons += gold;
    sim.state.finance.harvestRevenue += gold;
    sim.state.stats.totalSickleHarvested += gold;
    sim.state.stats.farmHarvestsCount = (sim.state.stats.farmHarvestsCount ?? 0) + 1;
    sim.addXp(xp);
    sim.addHarvestFeastPoints(6);
    sim.recordQuestProgress('harvest_galleons', undefined, gold);
    sim.checkAndToastAchievements?.();

    sim.audio.playHarvestBubble();
    const cx = b.gx + (item ? item.width * 0.5 : 1);
    const cy = b.gy + (item ? item.height * 0.5 : 1);
    sim.onRewardFly?.('galleons', gold, cx, cy);
    sim.spawnFloatingText(
      cx,
      cy,
      added > 0
        ? `🐾 +${added} ${goodMeta.emoji}  +${gold} 🪙  +${xp} ⭐`
        : `🏡 Kho đầy! Bán thẳng +${gold + soldDirect} 🪙  +${xp} ⭐`,
      '#fde047'
    );
    if (soldDirect > 0) {
      sim.state.galleons += soldDirect;
      sim.state.finance.shopRevenue += soldDirect;
    }
    if (sim.isTutorialActive() && sim.state.tutorial?.stepId === 'pasture_harvest_and_stock') {
      sim.state.tutorial.pastureHarvestedInStep3 = true;
      sim.state.tutorial.minimized = false;
      const hasEmptyPasture = sim.state.buildings.some(
        (x) => getCatalogItem(x.itemId)?.isAnimalPasturePlot && !x.pastureAnimalId
      );
      if (!hasEmptyPasture) {
        sim.advanceTutorialStep('pasture_harvest_and_stock');
      }
    }
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ok: true,
      msg:
        added > 0
          ? `🐾 Thu hoạch +${added} ${goodMeta.emoji} ${goodMeta.name} từ ${animal.name} (+${compostGain} 🌿 Phân Ủ, +${gold} Sickle, +${xp} ⭐)!`
          : `🏡 Kho Nông Sản đã đầy — bán trực tiếp sản vật thu +${gold + soldDirect} Sickle (+${compostGain} 🌿 Phân Ủ)!`,
    };
}

export interface FarmBatchResult {
  ok: boolean;
  processed: number;
  skipped: number;
  totalGold: number;
  totalXp: number;
  msg: string;
}

interface FarmBatchOptions {
  icon: string;
  action: (uid: string) => { ok: boolean; msg: string };
}

function farmRunBatch(sim: ParkSimulation, uids: string[], options: FarmBatchOptions): FarmBatchResult {
  if (sim.isVisitingNeighbor) {
    return {
      ok: false,
      processed: 0,
      skipped: uids.length,
      totalGold: 0,
      totalXp: 0,
      msg: 'Chế độ Khách Tham Quan — thao tác hàng loạt chỉ dùng trong thung lũng của bạn.',
    };
  }

  const uniqueUids = [...new Set(uids)];
  const beforeGold = sim.state.galleons;
  const beforeXp = sim.state.xp;

  // Gộp N lần saveToStorage + N lần onUiChange (mà từng API đơn lẻ gọi bên trong)
  // xuống đúng 1 lần commit ở cuối batch — tránh serialize bản lưu + refresh DOM
  // từng ô gây GC stutter khi kéo brush / bấm "Tất cả".
  sim.batchOperationActive = true;
  const savedOnUiChange = sim.onUiChange;
  sim.onUiChange = null;
  let processed = 0;
  try {
    for (const uid of uniqueUids) {
      if (options.action(uid).ok) processed++;
    }
  } finally {
    sim.onUiChange = savedOnUiChange;
    sim.batchOperationActive = false;
    if (processed > 0) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
  }

  const totalGold = Math.max(0, sim.state.galleons - beforeGold);
  const totalXp = Math.max(0, sim.state.xp - beforeXp);
  const skipped = uniqueUids.length - processed;
  return {
    ok: processed > 0,
    processed,
    skipped,
    totalGold,
    totalXp,
    msg: processed > 0
      ? `${options.icon} Đã xử lý ${processed} khu vực${skipped > 0 ? `, bỏ qua ${skipped}` : ''}.`
      : 'Không có khu vực nào sẵn sàng để xử lý.',
  };
}

export function farmBatchWaterCrops(sim: ParkSimulation, uids: string[]): FarmBatchResult {
  return farmRunBatch(sim, uids, { icon: '💧', action: (uid) => farmWaterCropPlot(sim, uid) });
}

export function farmBatchHarvestCrops(sim: ParkSimulation, uids: string[]): FarmBatchResult {
  return farmRunBatch(sim, uids, { icon: '🌾', action: (uid) => farmHarvestCropPlot(sim, uid) });
}

export function farmBatchFeedPastures(sim: ParkSimulation, uids: string[]): FarmBatchResult {
  return farmRunBatch(sim, uids, { icon: '🌾', action: (uid) => farmFeedAnimalPasture(sim, uid) });
}

export function farmBatchHarvestPastures(sim: ParkSimulation, uids: string[]): FarmBatchResult {
  return farmRunBatch(sim, uids, { icon: '🐾', action: (uid) => farmHarvestAnimalPasture(sim, uid) });
}

export function farmBatchPlantCrops(
  sim: ParkSimulation,
  uids: string[],
  cropId: FarmCropId
): FarmBatchResult {
  return farmRunBatch(sim, uids, {
    icon: '🌱',
    action: (uid) => farmPlantCropOnPlot(sim, uid, cropId),
  });
}

export function farmClearAnimalFromPasture(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể đổi thú trên đồng cỏ bạn bè!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.pastureAnimalId) {
      return { ok: false, msg: 'Đồng cỏ đang trống sẵn rồi!' };
    }
    const animal = PASTURE_ANIMALS[b.pastureAnimalId];
    const refund = Math.round((animal?.cost ?? 0) * 0.5);
    b.pastureAnimalId = null;
    b.pastureStockedAt = undefined;
    b.pastureReadyAt = undefined;
    b.pastureFedBoost = false;
    b.pastureGourmetBoost = false;
    b.readyBubbles = 0;
    b.storedSickle = 0;
    b.storedXp = 0;
    if (!sim.state.sandboxMode && refund > 0) {
      sim.state.galleons += refund;
    }
    sim.audio.playClick();
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return {
      ok: true,
      msg: `🐾 Đã đưa ${animal?.emoji ?? '🐾'} ${animal?.name ?? 'thú'} về chuồng nghỉ${refund > 0 ? ` (hoàn +${refund} Sickle)` : ''} — có thể chọn thú mới!`,
    };
}

// ==================== BẬC ĐẤT MÀU MỠ (I..V), PHÂN Ủ THẢO DƯỢC & THỨC ĂN THƯỢNG HẠNG ====================

export interface PlotSoilUpgradeCostInfo {
  currentTier: SoilFertilityTier;
  currentMeta: SoilTierMeta;
  nextTier: SoilFertilityTier | null;
  nextMeta: SoilTierMeta | null;
  compostCost: number;
  compostOwned: number;
  missingCompost: number;
  baseSickleCost: number;
  effectiveSickleCost: number;
  unlockedByLevel: boolean;
  canAfford: boolean;
}

export function farmGetPlotEffectiveSoilTier(
  sim: ParkSimulation,
  b: Pick<PlacedBuilding, 'gx' | 'gy' | 'soilTier'>
): SoilFertilityTier {
  const fromCoord = sim.state.plotSoilState?.[`${b.gx},${b.gy}`]?.soilTier ?? 1;
  const raw = Math.max(1, Math.min(5, Math.max(b.soilTier ?? 1, fromCoord)));
  return raw as SoilFertilityTier;
}

export function farmGetPlotSoilUpgradeCostInfo(
  sim: ParkSimulation,
  uid: string
): PlotSoilUpgradeCostInfo | null {
  const b = sim.state.buildings.find((x) => x.uid === uid);
  if (!b) return null;
  const item = getCatalogItem(b.itemId);
  if (!item?.isFarmlandPlot) return null;
  const currentTier = farmGetPlotEffectiveSoilTier(sim, b);
  const currentMeta = getSoilTierInfo(currentTier);
  const nextTier = currentTier < 5 ? ((currentTier + 1) as SoilFertilityTier) : null;
  const nextMeta = nextTier ? SOIL_TIERS[nextTier] : null;
  const compostOwned = Math.max(0, Math.floor(sim.state.herbalCompost ?? 0));
  if (!nextMeta) {
    return {
      currentTier,
      currentMeta,
      nextTier: null,
      nextMeta: null,
      compostCost: 0,
      compostOwned,
      missingCompost: 0,
      baseSickleCost: 0,
      effectiveSickleCost: 0,
      unlockedByLevel: false,
      canAfford: false,
    };
  }
  const unlockedByLevel = Boolean(sim.state.sandboxMode) || sim.state.level >= nextMeta.unlockLevel;
  const compostUsed = Math.min(compostOwned, nextMeta.upgradeCompost);
  const missingCompost = Math.max(0, nextMeta.upgradeCompost - compostUsed);
  const baseSickleCost = nextMeta.upgradeSickle;
  const effectiveSickleCost = sim.state.sandboxMode
    ? 0
    : baseSickleCost + missingCompost * COMPOST_SHORTAGE_BUYOUT_SICKLE;
  const canAfford =
    unlockedByLevel && (Boolean(sim.state.sandboxMode) || sim.state.galleons >= effectiveSickleCost);
  return {
    currentTier,
    currentMeta,
    nextTier,
    nextMeta,
    compostCost: nextMeta.upgradeCompost,
    compostOwned,
    missingCompost,
    baseSickleCost,
    effectiveSickleCost,
    unlockedByLevel,
    canAfford,
  };
}

export function farmUpgradePlotSoilTier(
  sim: ParkSimulation,
  uid: string
): { ok: boolean; msg: string; newTier?: SoilFertilityTier } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể cải tạo đất của bạn bè!' };
  }
  const b = sim.state.buildings.find((x) => x.uid === uid);
  if (!b) return { ok: false, msg: 'Không tìm thấy thửa đất canh tác!' };
  const info = farmGetPlotSoilUpgradeCostInfo(sim, uid);
  if (!info || !info.nextTier || !info.nextMeta) {
    return { ok: false, msg: 'Thửa ruộng đã đạt Đỉnh Đất Tro Phượng Hoàng (Bậc V)!' };
  }
  if (!info.unlockedByLevel) {
    return {
      ok: false,
      msg: `🌿 ${info.nextMeta.nameVi} (Bậc ${info.nextMeta.labelRom}) mở khoá ở Cấp ${info.nextMeta.unlockLevel}!`,
    };
  }
  if (!sim.state.sandboxMode && sim.state.galleons < info.effectiveSickleCost) {
    return {
      ok: false,
      msg: `Cần ${info.effectiveSickleCost.toLocaleString('vi-VN')} Sickle để nâng lên ${info.nextMeta.nameVi}!`,
    };
  }

  const now = Date.now();
  let spendDesc = '';
  if (!sim.state.sandboxMode) {
    const usedCompost = Math.min(info.compostOwned, info.compostCost);
    sim.state.herbalCompost = Math.max(0, info.compostOwned - usedCompost);
    sim.state.galleons -= info.effectiveSickleCost;
    sim.state.finance.constructionSpent += info.effectiveSickleCost;
    spendDesc = ` (-${usedCompost} 🌿, -${info.effectiveSickleCost.toLocaleString('vi-VN')} Sickle)`;
  }

  const soilKey = `${b.gx},${b.gy}`;
  const prevEntry = sim.state.plotSoilState?.[soilKey];
  b.soilTier = info.nextTier;
  sim.state.plotSoilState = {
    ...(sim.state.plotSoilState ?? {}),
    [soilKey]: {
      lastFamily: prevEntry?.lastFamily ?? 'grain',
      fatigueStep: prevEntry?.fatigueStep ?? Math.max(0, b.harvestCycleCount ?? 0),
      soilTier: info.nextTier,
      updatedAt: now,
    },
  };

  const xpGain = 18 * info.nextTier;
  sim.addXp(xpGain);
  sim.addHarvestFeastPoints(8);
  sim.audio.playLevelUp();
  sim.onBuildingTactile?.(b.uid);
  sim.spawnFloatingText(
    b.gx + 1,
    b.gy + 1,
    `🌱 ${info.nextMeta.nameVi} (Bậc ${info.nextMeta.labelRom})!`,
    '#34d399'
  );
  if (!sim.batchOperationActive) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
  return {
    ok: true,
    newTier: info.nextTier,
    msg: `🌱 Nâng thành công lên ${info.nextMeta.nameVi} (Bậc ${info.nextMeta.labelRom} • +${info.nextMeta.yieldBonus} nông sản/vụ, ×${info.nextMeta.harvestGoldXpMult.toFixed(2)} 🪙/⭐)${spendDesc}!`,
  };
}

export function farmFertilizeCropPlotWithCompost(
  sim: ParkSimulation,
  uid: string
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể bón phân cho ruộng bạn bè!' };
  }
  const b = sim.state.buildings.find((x) => x.uid === uid);
  if (!b) return { ok: false, msg: 'Không tìm thấy thửa đất canh tác!' };
  const item = getCatalogItem(b.itemId);
  if (!item?.isFarmlandPlot) {
    return { ok: false, msg: 'Chỉ thửa đất canh tác mới bón được Phân Ủ Thảo Dược!' };
  }
  if (b.cropCompostBoost) {
    return { ok: false, msg: 'Thửa đất này đã được bón 🌿 Phân Ủ Thảo Dược cho vụ hiện tại rồi!' };
  }
  const haveCompost = Math.max(0, Math.floor(sim.state.herbalCompost ?? 0));
  if (!sim.state.sandboxMode && haveCompost < 1) {
    return {
      ok: false,
      msg: 'Túi chưa có 🌿 Phân Ủ Thảo Dược — hãy thu hoạch Đồng Cỏ Chăn Thả hoặc Chợ Phiên để nhận thêm!',
    };
  }

  if (!sim.state.sandboxMode) {
    sim.state.herbalCompost = haveCompost - 1;
  }
  const now = Date.now();
  b.cropCompostBoost = true;
  b.harvestCycleCount = 0;
  const soilKey = `${b.gx},${b.gy}`;
  const prevSoil = sim.state.plotSoilState?.[soilKey];
  const curTier = farmGetPlotEffectiveSoilTier(sim, b);
  sim.state.plotSoilState = {
    ...(sim.state.plotSoilState ?? {}),
    [soilKey]: {
      lastFamily: prevSoil?.lastFamily ?? 'grain',
      fatigueStep: 0,
      ...(curTier > 1 ? { soilTier: curTier } : {}),
      updatedAt: now,
    },
  };
  sim.addXp(6);
  sim.audio.playSpell();
  sim.onBuildingTactile?.(b.uid);
  sim.spawnFloatingText(b.gx + 1, b.gy + 1, '🌿 Bón Phân Ủ! +2 Vụ & Hết Mỏi Đất!', '#4ade80');
  if (!sim.batchOperationActive) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
  return {
    ok: true,
    msg: '🌿 Đã bón 1 Phân Ủ Thảo Dược! Vụ này thu thêm +2 nông sản và đã xoá sạch mỏi đất (+6 ⭐)!',
  };
}

export function farmGetAvailableGourmetFeedCrop(sim: ParkSimulation): FarmCropId | null {
  for (const cid of GOURMET_FEED_CROP_PRIORITY) {
    if (sim.getFarmItemCount(cid) >= GOURMET_FEED_QTY) {
      return cid;
    }
  }
  return null;
}

export function farmFeedAnimalPastureGourmet(
  sim: ParkSimulation,
  uid: string
): { ok: boolean; msg: string; cropUsed?: FarmCropId } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể dùng khẩu phần thượng hạng trên đồng cỏ bạn!' };
  }
  const b = sim.state.buildings.find((x) => x.uid === uid);
  if (!b || !b.pastureAnimalId || !b.pastureReadyAt) {
    return { ok: false, msg: 'Đồng cỏ đang trống — hãy chọn thú thả vào trước nhé!' };
  }
  const now = Date.now();
  if (now >= b.pastureReadyAt) {
    return { ok: false, msg: 'Sản vật đồng cỏ đã sẵn sàng — hãy thu hoạch ngay!' };
  }
  if (b.pastureGourmetBoost) {
    return { ok: false, msg: 'Đàn thú đã được ăn Khẩu Phần Thượng Hạng (×2 sản lượng & +2 🌿) ở chu kỳ này rồi!' };
  }

  const pickCrop = sim.state.sandboxMode ? 'ottery_wheat' : farmGetAvailableGourmetFeedCrop(sim);
  if (!pickCrop) {
    return {
      ok: false,
      msg: `Cần ${GOURMET_FEED_QTY} nông sản đồng (Lúa Mì/Bắp/Cà Rốt/Bắp Cải/Bí Ngô/Khoai Tây) trong Kho Đỏ để thưởng Bữa Thượng Hạng!`,
    };
  }
  const cropMeta = FARM_CROPS[pickCrop];
  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(pickCrop, GOURMET_FEED_QTY);
  }

  b.pastureGourmetBoost = true;
  if (!b.pastureFedBoost) {
    const leftMs = b.pastureReadyAt - now;
    const savedMs = Math.max(3000, Math.round(leftMs * 0.35));
    b.pastureReadyAt = Math.max(now + 1000, b.pastureReadyAt - savedMs);
    b.pastureFedBoost = true;
  }
  sim.addXp(10);
  sim.recordQuestProgress('feed_creatures', undefined, 1);
  sim.audio.playLevelUp();
  sim.onBuildingTactile?.(b.uid);
  sim.spawnFloatingText(b.gx + 1, b.gy + 1, '🌽 Thượng Hạng! ×2 Sản Lượng & +2 🌿!', '#fde047');
  if (!sim.batchOperationActive) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
  return {
    ok: true,
    cropUsed: pickCrop,
    msg: `🌽 Đã thưởng ${GOURMET_FEED_QTY} ${cropMeta.emoji} ${cropMeta.name}: Chu kỳ này thu ×2 sản phẩm, +50% Sickle/XP & +2 🌿 Phân Ủ!`,
  };
}

// ==================== CHỢ PHIÊN HOGSMEADE (TIÊU ĐIỂM +50% & THƯƠNG VỤ HÀNG NGÀY) ====================

const MARKET_GOOD_CANDIDATES: ReadonlyArray<{ id: FarmGoodId; minLevel: number }> = [
  { id: 'cinnamon_apple_pie', minLevel: 1 },
  { id: 'fine_wheat_flour', minLevel: 1 },
  { id: 'farm_egg_wool', minLevel: 1 },
  { id: 'creamy_dairy_milk', minLevel: 1 },
  { id: 'pumpkin_pie', minLevel: 2 },
  { id: 'blossom_honey_jar', minLevel: 3 },
  { id: 'weasley_sweater_w', minLevel: 3 },
  { id: 'honey_apple_cider', minLevel: 4 },
  { id: 'frothy_butterbeer', minLevel: 6 },
  { id: 'choc_frog_sweet', minLevel: 6 },
  { id: 'sprout_growth_elixir', minLevel: 6 },
  { id: 'floral_bouquet_gift', minLevel: 6 },
];

function hashStringSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildDailyMarketFairState(level: number, dayKey: string, seedOffset = 0): HogsmeadeMarketFairState {
  const safeLevel = Math.max(1, Math.floor(level || 1));
  const seed = hashStringSeed(`${dayKey}#${seedOffset}`);
  const unlockedCrops = (Object.keys(FARM_CROPS) as FarmCropId[]).filter(
    (cid) => !cid.startsWith('yule_') && !cid.startsWith('vn_') && FARM_CROPS[cid].unlockLevel <= safeLevel
  );
  const cropPool: FarmCropId[] = unlockedCrops.length > 0 ? unlockedCrops : ['ottery_wheat'];
  const unlockedGoods = MARKET_GOOD_CANDIDATES.filter(
    (g) => g.minLevel <= safeLevel && g.id in FARM_GOODS
  ).map((g) => g.id);
  const goodPool: FarmGoodId[] = unlockedGoods.length > 0 ? unlockedGoods : ['cinnamon_apple_pie'];

  const spotlightCropId = cropPool[seed % cropPool.length];
  const spotlightGoodId = goodPool[(seed >>> 3) % goodPool.length];

  const bulkCrop = cropPool[(seed + seedOffset + 1) % cropPool.length];
  const bulkMeta = FARM_CROPS[bulkCrop];
  const bulkQty = safeLevel >= 10 ? 4 : 3;

  const barterInputs: FarmItemId[] = ['ottery_wheat', 'honey_carrot', 'garden_pumpkin', 'farm_egg_wool', 'creamy_dairy_milk'];
  const barterInput = barterInputs[(seed + seedOffset + 2) % barterInputs.length];
  const seedRewardCrop = cropPool[(seed + seedOffset + 3) % cropPool.length];

  const artisanGood = goodPool[(seed + seedOffset + 1) % goodPool.length];
  const artisanMeta = FARM_GOODS[artisanGood];
  const artisanQty = safeLevel >= 14 ? 2 : 1;

  const deals: MarketFairDeal[] = [
    {
      id: `deal_bulk_${dayKey}_${seedOffset}`,
      kind: 'bulk_buyout',
      merchantName: 'Bà Rosmerta • Quầy Sỉ Ba Cây Chổi',
      merchantEmoji: '🍺',
      inputItemId: bulkCrop,
      inputQty: bulkQty,
      rewardSickle: Math.max(20, Math.round(bulkMeta.sellValue * bulkQty * 1.65) + 12),
      rewardXp: 20,
      rewardCompost: 2,
      rewardFeastPoints: 14,
      claimed: false,
    },
    {
      id: `deal_seed_${dayKey}_${seedOffset}`,
      kind: 'seed_barter',
      merchantName: 'Giáo Sư Sprout • Quầy Ươm Giống',
      merchantEmoji: '🌿',
      inputItemId: barterInput,
      inputQty: 2,
      rewardSickle: 10,
      rewardXp: 18,
      rewardSeedCropId: seedRewardCrop,
      rewardSeedQty: 3,
      rewardMorningDew: 1,
      rewardFeastPoints: 14,
      claimed: false,
    },
    {
      id: `deal_plug_${dayKey}_${seedOffset}`,
      kind: 'artisan_plug',
      merchantName: 'Ông Arthur • Sạp Cơ Khí Hang Sóc',
      merchantEmoji: '🔌',
      inputItemId: artisanGood,
      inputQty: artisanQty,
      rewardSickle: Math.max(28, Math.round(artisanMeta.sellValue * artisanQty * 1.55) + 18),
      rewardXp: 24,
      rewardMugglePlug: 1,
      rewardTimeSand: 1,
      rewardFeastPoints: 24,
      claimed: false,
    },
  ];

  return {
    dayKey,
    spotlightCropId,
    spotlightGoodId,
    spotlightLotsSold: 0,
    rerollsUsed: 0,
    seedOffset,
    deals,
  };
}

export function farmEnsureMarketFairState(sim: ParkSimulation): HogsmeadeMarketFairState {
  const dayKey = getVietnamCalendarKey();
  const cur = sim.state.marketFair;
  if (!cur || cur.dayKey !== dayKey || !Array.isArray(cur.deals) || cur.deals.length === 0) {
    const next = buildDailyMarketFairState(sim.state.level, dayKey, 0);
    sim.state.marketFair = next;
    return next;
  }
  return cur;
}

export function farmIsItemMarketSpotlight(sim: ParkSimulation, itemId: FarmItemId): boolean {
  const fair = farmEnsureMarketFairState(sim);
  return itemId === fair.spotlightCropId || itemId === fair.spotlightGoodId;
}

export function farmGetOwlOrderSpotlightBonus(
  sim: ParkSimulation,
  order: Pick<FarmOwlOrder, 'requirements'>
): { hasSpotlight: boolean; bonusCompost: number; bonusXp: number; bonusFeastPoints: number } {
  const fair = farmEnsureMarketFairState(sim);
  const hasSpotlight = order.requirements.some(
    (r) => r.itemId === fair.spotlightCropId || r.itemId === fair.spotlightGoodId
  );
  if (!hasSpotlight) {
    return { hasSpotlight: false, bonusCompost: 0, bonusXp: 0, bonusFeastPoints: 0 };
  }
  return {
    hasSpotlight: true,
    bonusCompost: 1,
    bonusXp: 8,
    bonusFeastPoints: 6,
  };
}

export function farmSellMarketSpotlightLot(
  sim: ParkSimulation,
  kind: 'crop' | 'good'
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — hãy về trang trại nhà để bán hàng Chợ Phiên!' };
  }
  const fair = farmEnsureMarketFairState(sim);
  if (fair.spotlightLotsSold >= 3) {
    return { ok: false, msg: 'Hôm nay sạp Tiêu Điểm đã thu mua đủ 3/3 lô sỉ (hẹn ngày mai 00:00)!' };
  }
  const itemId: FarmItemId = kind === 'crop' ? fair.spotlightCropId : fair.spotlightGoodId;
  const qty = kind === 'crop' ? 2 : 1;
  const have = sim.getFarmItemCount(itemId);
  if (!sim.state.sandboxMode && have < qty) {
    const meta = getFarmItemMeta(itemId);
    return { ok: false, msg: `Cần ${qty} ${meta.emoji} ${meta.name} trong Kho Đỏ để bán 1 lô sỉ Tiêu Điểm!` };
  }

  const meta = getFarmItemMeta(itemId);
  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(itemId, qty);
  }
  const gold = Math.max(16, Math.round(meta.sellValue * qty * 1.6) + 12);
  const xp = 15;
  fair.spotlightLotsSold += 1;
  sim.state.galleons += gold;
  sim.state.finance.shopRevenue += gold;
  sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
  sim.addXp(xp);
  sim.addHarvestFeastPoints(12);
  sim.recordQuestProgress('harvest_galleons', undefined, gold);
  sim.audio.playCoinChime?.();
  sim.audio.playHarvestBubble();
  const msg = `🎪 Bán lô sỉ Tiêu Điểm ${qty} ${meta.emoji} ${meta.name} (${fair.spotlightLotsSold}/3): +${gold} Sickle, +1 🌿 Phân Ủ & +${xp} ⭐!`;
  sim.onToast?.(msg, '🎪');
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg };
}

export function farmFulfillMarketFairDeal(
  sim: ParkSimulation,
  dealId: string
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể giao dịch Chợ Phiên ở vườn bạn!' };
  }
  const fair = farmEnsureMarketFairState(sim);
  const deal = fair.deals.find((d) => d.id === dealId);
  if (!deal) return { ok: false, msg: 'Không tìm thấy sạp thương vụ này!' };
  if (deal.claimed) return { ok: false, msg: 'Thương vụ này đã chốt đơn hôm nay rồi!' };

  const have = sim.getFarmItemCount(deal.inputItemId);
  const inMeta = getFarmItemMeta(deal.inputItemId);
  if (!sim.state.sandboxMode && have < deal.inputQty) {
    return {
      ok: false,
      msg: `Cần ${deal.inputQty} ${inMeta.emoji} ${inMeta.name} trong Kho Đỏ để đổi với ${deal.merchantName}!`,
    };
  }

  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(deal.inputItemId, deal.inputQty);
  }
  deal.claimed = true;

  sim.state.galleons += deal.rewardSickle;
  sim.state.finance.shopRevenue += deal.rewardSickle;
  if (deal.rewardCompost) {
    sim.state.herbalCompost = Math.min(
      99999,
      Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + deal.rewardCompost
    );
  }
  if (deal.rewardSeedCropId && deal.rewardSeedQty) {
    sim.addCropSeeds(deal.rewardSeedCropId, deal.rewardSeedQty);
  }
  if (deal.rewardMorningDew) {
    sim.state.morningDewPhials = Math.min(99, (sim.state.morningDewPhials ?? 0) + deal.rewardMorningDew);
  }
  if (deal.rewardMugglePlug) {
    const barn = sim.ensureFarmBarn();
    barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + deal.rewardMugglePlug;
  }
  if (deal.rewardTimeSand) {
    sim.state.timeSand += deal.rewardTimeSand;
  }
  sim.addXp(deal.rewardXp);
  sim.addHarvestFeastPoints(deal.rewardFeastPoints ?? 14);
  sim.recordQuestProgress('harvest_galleons', undefined, deal.rewardSickle);
  sim.audio.playCoinChime?.();
  sim.audio.playLevelUp();

  const extras: string[] = [];
  if (deal.rewardCompost) extras.push(`+${deal.rewardCompost} 🌿`);
  if (deal.rewardSeedCropId && deal.rewardSeedQty) {
    const sc = FARM_CROPS[deal.rewardSeedCropId];
    extras.push(`+${deal.rewardSeedQty} hạt ${sc.emoji}`);
  }
  if (deal.rewardMorningDew) extras.push(`+${deal.rewardMorningDew} 🧪`);
  if (deal.rewardMugglePlug) extras.push(`+${deal.rewardMugglePlug} 🔌`);
  if (deal.rewardTimeSand) extras.push(`+${deal.rewardTimeSand} ⏳`);

  const msg = `🎪 Đã chốt sạp ${deal.merchantEmoji} ${deal.merchantName}: +${deal.rewardSickle} Sickle, +${deal.rewardXp} ⭐${extras.length ? ` (${extras.join(', ')})` : ''}!`;
  sim.onToast?.(msg, deal.merchantEmoji);
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg };
}

export function farmRerollMarketFairDeals(sim: ParkSimulation): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể làm mới Chợ Phiên ở vườn bạn!' };
  }
  const fair = farmEnsureMarketFairState(sim);
  if (fair.rerollsUsed >= 1) {
    return { ok: false, msg: 'Hôm nay đã dùng hết lượt làm mới 3 thương vụ Chợ Phiên (reset lúc 00:00)!' };
  }
  const nextOffset = fair.seedOffset + 1;
  const fresh = buildDailyMarketFairState(sim.state.level, fair.dayKey, nextOffset);
  const mergedDeals = fresh.deals.map((d, i) =>
    fair.deals[i]?.claimed ? fair.deals[i] : d
  );
  sim.state.marketFair = {
    ...fresh,
    deals: mergedDeals,
    spotlightCropId: fair.spotlightCropId,
    spotlightGoodId: fair.spotlightGoodId,
    spotlightLotsSold: fair.spotlightLotsSold,
    rerollsUsed: 1,
    seedOffset: nextOffset,
  };
  sim.audio.playClick();
  const msg = '🔄 Đã mời đoàn thương lái Chợ Phiên Hogsmeade mới mở 3 sạp giao dịch!';
  sim.onToast?.(msg, '🎪');
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg };
}
