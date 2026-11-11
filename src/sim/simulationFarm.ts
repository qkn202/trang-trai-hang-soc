// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.


import {
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

export function farmUpgradeFarmBarn(sim: ParkSimulation): { ok: boolean; msg: string } {
    const barn = sim.ensureFarmBarn();
    const tier = Math.max(1, Math.round((barn.capacity - 40) / 20));
    const goldCost = 160 + tier * 90;
    const plugCost = 1;
    const curPlugs = barn.goods.muggle_plug_kit ?? 0;

    if (!sim.state.sandboxMode) {
      if (curPlugs < plugCost && sim.state.galleons < goldCost + 120) {
        return {
          ok: false,
          msg: `Cần ${plugCost} 🔌 Bộ Phích Cắm Muggle (từ Chòi Ông Arthur / Đơn Cú) & ${goldCost}G để nới rộng Kho!`,
        };
      }
      if (curPlugs >= plugCost) {
        if (sim.state.galleons < goldCost) {
          return { ok: false, msg: `Cần ${goldCost} Galleon để nâng cấp Kho Nông Sản (+20 ô)!` };
        }
        barn.goods.muggle_plug_kit = Math.max(0, curPlugs - plugCost);
        sim.state.galleons -= goldCost;
      } else {
        sim.state.galleons -= goldCost + 120;
      }
    }

    barn.capacity += 20;
    sim.addXp(45);
    sim.audio.playLevelUp();
    const msg = `🏡 Kho Nông Sản Hang Sóc đã mở rộng lên ${barn.capacity} ô chứa (+45 ⭐)!`;
    sim.onToast?.(msg, '🏡');
    sim.saveToStorage();
    sim.onUiChange?.();
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
    const msg = `🪙 Đã bán ${take} ${meta.emoji} ${meta.name} thu về +${gold}G & +${xp} ⭐!`;
    sim.onToast?.(msg, meta.emoji);
    sim.saveToStorage();
    sim.onUiChange?.();
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
    const crop = FARM_CROPS[cropId];
    if (!sim.state.sandboxMode && sim.state.level < crop.unlockLevel) {
      return {
        ok: false,
        msg: `${crop.emoji} ${crop.name} mở khóa ở Cấp ${crop.unlockLevel}!`,
        newSeedCount: sim.getSeedCount(cropId),
      };
    }
    const count = Math.max(1, Math.min(20, Math.floor(qty)));
    const totalCost = crop.seedCost * count;
    if (sim.state.galleons < totalCost) {
      return {
        ok: false,
        msg: `Cần ${totalCost.toLocaleString('vi-VN')}G để mua ${count} hạt ${crop.name} — hãy niệm Thần Chú Đa Ngữ (0G) để nhận ngay 1–2 hạt miễn phí!`,
        newSeedCount: sim.getSeedCount(cropId),
      };
    }

    sim.state.galleons -= totalCost;
    sim.state.finance.constructionSpent += totalCost;
    const newSeedCount = sim.addCropSeeds(cropId, count);
    sim.audio.playHarvestBubble();
    sim.advanceTutorialStep('seed_quiz_or_buy');
    const msg = `🪙 Đã mua ${count} hạt giống ${crop.emoji} ${crop.name} (-${totalCost.toLocaleString('vi-VN')}G • Túi có: ${newSeedCount} hạt)!`;
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg, newSeedCount };
}

export function farmCompleteSeedLanguageQuizAttempt(sim: ParkSimulation, 
    cropId: FarmCropId,
    challenge: ActiveQuizChallenge,
    correct: boolean
  ): QuizAttemptOutcome & { newSeedCount: number; cropName: string } {
    const quiz = sim.ensureLanguageQuiz();
    const crop = FARM_CROPS[cropId];
    const outcome = recordQuizAttempt(quiz, challenge, correct);
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
    if (correct) {
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
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ...outcome,
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
        msg: `Túi chưa có hạt giống ${crop.emoji} ${crop.name} — hãy chọn Mua Vàng (${crop.seedCost.toLocaleString('vi-VN')}G/hạt) hoặc Niệm Thần Chú Đa Ngữ (0G)!`,
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
    b.storedGalleons = 0;
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
    sim.saveToStorage();
    sim.onUiChange?.();
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
    sim.saveToStorage();
    sim.onUiChange?.();
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
    const isGoldenRotation = Boolean(b.cropRotatedBonus);
    const baseYield = crop.yieldQty + (b.stars >= 3 ? 1 : 0);
    const yieldQty = isGoldenRotation ? baseYield * 2 : baseYield;
    const added = sim.addFarmItemToBarn(crop.id, yieldQty);

    const prevMastery = sim.state.cropMastery?.[crop.id] ?? 0;
    const nextMastery = prevMastery + 1;
    sim.state.cropMastery = {
      ...(sim.state.cropMastery ?? {}),
      [crop.id]: nextMastery,
    };
    const masteryBefore = getCropMasteryTierInfo(prevMastery);
    const masteryAfter = getCropMasteryTierInfo(nextMastery);
    const gold = Math.round(crop.sellValue * masteryBefore.valueMult);
    const xp = crop.xp + (isGoldenRotation ? 4 : 0);

    // Persist soil rotation & anti-bulldoze-exploit fatigue by tile coordinate!
    const soilKey = `${b.gx},${b.gy}`;
    const prevSoil = sim.state.plotSoilState?.[soilKey];
    const prevFatigue = Math.max(b.harvestCycleCount ?? 0, prevSoil?.fatigueStep ?? 0);
    const nextFatigue = isGoldenRotation ? Math.max(1, prevFatigue) : prevFatigue + 1;
    sim.state.plotSoilState = {
      ...(sim.state.plotSoilState ?? {}),
      [soilKey]: {
        lastFamily: getCropFamily(crop.id),
        fatigueStep: nextFatigue,
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
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;

    sim.state.galleons += gold;
    sim.state.finance.harvestRevenue += gold;
    sim.state.stats.totalGalleonsHarvested += gold;
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
        : `🏡 Kho đầy! Bán thẳng +${gold + 10} 🪙  +${xp} ⭐`,
      '#fde047'
    );
    if (added === 0) {
      sim.state.galleons += 10;
    }
    sim.advanceTutorialStep('harvest_wheat');
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg:
        added > 0
          ? `🌾 Đã gặt +${added} ${crop.emoji} ${crop.name} cất vào Kho Nông Sản (+${gold}G, +${xp} ⭐)!`
          : `🏡 Kho Nông Sản đã đầy — bán trực tiếp thu +${gold + 10}G!`,
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
    if (!sim.state.sandboxMode && sim.state.galleons < animal.cost) {
      return {
        ok: false,
        msg: `Cần ${animal.cost.toLocaleString('vi-VN')} 🪙 Vàng để thả ${animal.emoji} ${animal.name} vào đồng cỏ!`,
      };
    }

    if (!sim.state.sandboxMode) {
      sim.state.galleons -= animal.cost;
    }

    const now = Date.now();
    const effectiveCycleSec = computeEconomicCycleSeconds(b.harvestCycleCount ?? 0, animal.cycleSec);
    const cycleMs = sim.state.sandboxMode ? 5000 : effectiveCycleSec * 1000;
    b.pastureAnimalId = animalId;
    b.pastureStockedAt = now;
    b.pastureReadyAt = now + cycleMs;
    b.pastureFedBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
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
    sim.saveToStorage();
    sim.onUiChange?.();
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
    sim.saveToStorage();
    sim.onUiChange?.();
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
    const yieldQty = animal.yieldQty + (b.stars >= 3 ? 1 : 0);
    const added = sim.addFarmItemToBarn(animal.goodId, yieldQty);
    const gold = animal.sellValue;
    const xp = animal.xp;

    // Automatically restart the next grazing cycle so the animal stays happily on the pasture!
    b.harvestCycleCount = (b.harvestCycleCount ?? 0) + 1;
    const nextCycleSec = computeEconomicCycleSeconds(b.harvestCycleCount, animal.cycleSec);
    const nextCycleMs = sim.state.sandboxMode ? 5000 : nextCycleSec * 1000;
    b.pastureStockedAt = now;
    b.pastureReadyAt = now + nextCycleMs;
    b.pastureFedBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;

    sim.state.galleons += gold;
    sim.state.finance.harvestRevenue += gold;
    sim.state.stats.totalGalleonsHarvested += gold;
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
        : `🏡 Kho đầy! Bán thẳng +${gold + 12} 🪙  +${xp} ⭐`,
      '#fde047'
    );
    if (added === 0) {
      sim.state.galleons += 12;
    }
    if (sim.isTutorialActive() && sim.state.tutorial?.stepId === 'pasture_harvest_and_stock') {
      sim.state.tutorial.pastureHarvestedInStep3 = true;
      const hasEmptyPasture = sim.state.buildings.some(
        (x) => getCatalogItem(x.itemId)?.isAnimalPasturePlot && !x.pastureAnimalId
      );
      if (!hasEmptyPasture) {
        sim.advanceTutorialStep('pasture_harvest_and_stock');
      }
    }
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg:
        added > 0
          ? `🐾 Thu hoạch +${added} ${goodMeta.emoji} ${goodMeta.name} từ ${animal.name} (+${gold}G, +${xp} ⭐)!`
          : `🏡 Kho Nông Sản đã đầy — bán trực tiếp sản vật thu +${gold + 12}G!`,
    };
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
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;
    if (!sim.state.sandboxMode && refund > 0) {
      sim.state.galleons += refund;
    }
    sim.audio.playClick();
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🐾 Đã đưa ${animal?.emoji ?? '🐾'} ${animal?.name ?? 'thú'} về chuồng nghỉ${refund > 0 ? ` (hoàn +${refund}G)` : ''} — có thể chọn thú mới!`,
    };
}
