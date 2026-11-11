// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.

import {
  computeRealTimeBuildSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FarmWorkshopRecipe,
  formatDurationCompactVi,
  getBuildingEffectiveCycleSec,
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
import {
  farmEnsureFarmBarn,
  farmGetBarnTotalUsed,
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
import type { ParkSimulation } from './simulation';

export function economyGetEffectivePrice(sim: ParkSimulation, b: PlacedBuilding, item: CatalogItem): number {
    const bounds = getItemPriceBounds(item);
    if (typeof b.customPrice === 'number' && Number.isFinite(b.customPrice)) {
      return Math.max(bounds.min, Math.min(bounds.max, b.customPrice));
    }
    return item.ticketPrice ?? 12;
}

export function economyGetPriceValueVerdict(sim: ParkSimulation, b: PlacedBuilding, item: CatalogItem): {
    label: string;
    color: string;
    demandMult: number;
  } {
    const fairPrice = (item.ticketPrice ?? 12) * (1 + (b.stars - 1) * 0.14);
    const cur = economyGetEffectivePrice(sim, b, item);
    const ratio = cur / Math.max(1, fairPrice);
    if (ratio <= 0.85) {
      return { label: '💚 Giá Hời Hút Khách (+Đông)', color: '#15803d', demandMult: 1.24 };
    }
    if (ratio <= 1.18) {
      return { label: '✨ Giá Hợp Lý Chuẩn Mực', color: '#b45309', demandMult: 1.02 };
    }
    if (ratio <= 1.38) {
      return { label: '⚖️ Hơi Cao (Chỉ khách rủng rỉnh mua)', color: '#d97706', demandMult: 0.86 };
    }
    // Steep realistic price elasticity above 1.38x so overpricing reduces total revenue instead of exploiting!
    const elasticDemand = Math.max(0.18, 0.86 * Math.pow(1.38 / ratio, 2.25));
    return { label: '⚠️ Quá Đắt! (Khách lắc đầu bỏ đi)', color: '#dc2626', demandMult: elasticDemand };
}

export function economySetBuildingCustomPrice(sim: ParkSimulation, uid: string, price: number): void {
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return;
    const item = getCatalogItem(b.itemId);
    if (!item) return;
    const bounds = getItemPriceBounds(item);
    b.customPrice = Math.max(bounds.min, Math.min(bounds.max, Math.round(price)));
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function economyGetEffectiveItemStarCost(sim: ParkSimulation, item: CatalogItem): number {
    const baseStars = getItemPuzzleStarCost(item);
    if (baseStars <= 0) return 0;
    if (
      (item.connectableGroup || item.isFlooPortal) &&
      sim.state.buildings.some((b) => b.itemId === item.id)
    ) {
      return 0;
    }
    return baseStars;
}

export function economyUpgradeBuildingStar(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể nâng cấp công trình vườn bạn!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy công trình' };
    if (Date.now() < b.constructEndsAt) return { ok: false, msg: 'Công trình đang xây/ấp trứng' };
    if (b.stars >= 5) return { ok: false, msg: 'Đã đạt tối đa 5 Sao Huyền Thoại!' };

    const item = getCatalogItem(b.itemId);
    if (!item) return { ok: false, msg: 'Dữ liệu không hợp lệ' };

    const cost = getUpgradeCost(item, b.stars);
    const starCost = getUpgradePuzzleStarCost(b.stars, item);
    if (!sim.state.sandboxMode && (sim.state.match3?.stars ?? 0) < starCost) {
      return {
        ok: false,
        msg: `Cần ${starCost} 🌟 Sao Phép Thuật để nâng lên ${b.stars + 1}★ — Hãy vượt thêm các màn Giải Đố (1–${MAX_MINIGAME_STAGE})!`,
      };
    }
    if (!sim.state.sandboxMode && sim.state.galleons < cost) {
      return { ok: false, msg: `Cần ${cost} Galleon để nâng lên ${b.stars + 1}★` };
    }

    if (!sim.state.sandboxMode) {
      sim.state.galleons -= cost;
      sim.state.finance.constructionSpent += cost;
      sim.state.match3.stars = Math.max(0, sim.state.match3.stars - starCost);
    }
    b.stars += 1;
    if (item.isCreatureHabitat) {
      if (b.stars >= 4) b.creatureStage = 'legendary';
      else if (b.stars >= 2) b.creatureStage = 'adult';
      b.creatureHunger = 100;
      b.creatureHappiness = 100;
    }
    b.durability = 100;

    const bonusXp = Math.round(25 * b.stars + item.xpPerCollect);
    sim.addXp(bonusXp);
    sim.state.stats.starUpgradesDone++;
    sim.recordQuestProgress('upgrade_star', item.id, 1);
    sim.audio.playSpell();
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, `Kiến trúc ${b.stars}★! +${bonusXp} ⭐`, '#f59e0b');
    sim.checkAndToastAchievements?.();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: `Đã nâng cấp lên ${b.stars}★!` };
}

export function economyGetBuildingMinFloorSec(sim: ParkSimulation, b: PlacedBuilding): number {
    const item = getCatalogItem(b.itemId);
    const baseSec = Math.max(
      item?.buildDurationSec ?? 0,
      Math.round((b.constructEndsAt - (b.placedAt || b.constructEndsAt)) / 1000) +
        (b.buildReducedSec ?? 0)
    );
    return getMinRemainingBuildFloorSec(baseSec);
}

export function economyApplyConstructionReductionFromGameplay(sim: ParkSimulation, 
    rawReduceSec: number,
    sourceLabelVi = 'Giải Đố',
    preferredUid?: string
  ): BuildReductionResult {
    const budgetSec = Math.max(0, Math.round(rawReduceSec));
    const targetState = sim.homeStateWhileVisiting ?? sim.state;
    const targetBuildings = targetState.buildings;
    const now = Date.now();
    const budgetMs = budgetSec * 1000;

    // Rút ngắn thời gian các hoạt động kinh tế đang chạy (cây trồng, chăn thả, lò chế biến, vạc phép, chu kỳ thu hoạch)
    let anyEcoReduced = false;
    if (budgetMs > 0) {
      for (const b of targetBuildings) {
        const item = getCatalogItem(b.itemId);
        if (!item) continue;
        if (b.cropId && b.cropReadyAt && now < b.cropReadyAt) {
          b.cropReadyAt = Math.max(now, b.cropReadyAt - budgetMs);
          anyEcoReduced = true;
        }
        if (b.pastureAnimalId && b.pastureReadyAt && now < b.pastureReadyAt) {
          b.pastureReadyAt = Math.max(now, b.pastureReadyAt - budgetMs);
          anyEcoReduced = true;
        }
        if (b.workshopQueue && b.workshopQueue.length > 0) {
          for (const slot of b.workshopQueue) {
            slot.startedAt = Math.max(0, slot.startedAt - budgetMs);
            slot.endsAt = Math.max(now, slot.endsAt - budgetMs);
          }
          anyEcoReduced = true;
        }
        if (
          now >= b.constructEndsAt &&
          item.cycleSec > 0 &&
          item.baseIncome > 0 &&
          !item.isFarmlandPlot &&
          !item.isAnimalPasturePlot &&
          item.id !== 'burrow_honeydukes_canon'
        ) {
          b.lastTickAt = (b.lastTickAt || now) - budgetMs;
          anyEcoReduced = true;
        }
      }
      if (targetState.supply?.activeBrew && now < targetState.supply.activeBrew.endsAt) {
        targetState.supply.activeBrew.endsAt = Math.max(
          now,
          targetState.supply.activeBrew.endsAt - budgetMs
        );
        anyEcoReduced = true;
      }
      if (anyEcoReduced && !sim.isVisitingNeighbor) {
        economyTickProductionToTimestamp(sim, now, true);
      }
    }

    const actives = targetBuildings
      .filter((x) => now < x.constructEndsAt)
      .sort((a, b) => {
        if (preferredUid) {
          if (a.uid === preferredUid) return -1;
          if (b.uid === preferredUid) return 1;
        }
        return (a.placedAt || 0) - (b.placedAt || 0) || a.constructEndsAt - b.constructEndsAt;
      });

    if (actives.length === 0 || budgetSec <= 0) {
      return { reducedSec: anyEcoReduced ? budgetSec : 0, activeCount: actives.length };
    }

    let remainingMs = budgetSec * 1000;
    let totalAppliedMs = 0;
    let primaryTarget: PlacedBuilding | undefined;
    let primaryFloorSec = 0;
    let primaryHitFloor = false;
    let atFloorCount = 0;

    for (const b of actives) {
      const floorSec = economyGetBuildingMinFloorSec(sim, b);
      const floorEndsAt = now + floorSec * 1000;
      const reducibleMs = Math.max(0, b.constructEndsAt - floorEndsAt);
      if (reducibleMs <= 0) {
        atFloorCount++;
        continue;
      }
      if (remainingMs <= 0) break;

      const shaveMs = Math.min(remainingMs, reducibleMs);
      b.constructEndsAt -= shaveMs;
      b.lastTickAt = b.constructEndsAt;
      const shaveSec = Math.max(1, Math.round(shaveMs / 1000));
      b.buildReducedSec = (b.buildReducedSec ?? 0) + shaveSec;
      remainingMs -= shaveMs;
      totalAppliedMs += shaveMs;

      if (!primaryTarget) {
        primaryTarget = b;
        primaryFloorSec = floorSec;
        primaryHitFloor = b.constructEndsAt <= floorEndsAt + 500;
      }

      if (!sim.isVisitingNeighbor) {
        const item = getCatalogItem(b.itemId);
        sim.onBuildingTactile?.(b.uid);
        sim.spawnFloatingText(
          b.gx + (item?.width ?? 2) * 0.5,
          b.gy + (item?.height ?? 2) * 0.5,
          `🔨 -${formatDurationCompactVi(shaveSec)} (${sourceLabelVi})!`,
          '#34d399'
        );
      }
    }

    if (totalAppliedMs <= 0) {
      const firstB = actives[0];
      const fItem = firstB ? getCatalogItem(firstB.itemId) : undefined;
      return {
        reducedSec: 0,
        targetUid: firstB?.uid,
        targetName: fItem?.name,
        remainAfterSec: firstB ? Math.max(1, Math.ceil((firstB.constructEndsAt - now) / 1000)) : undefined,
        floorSec: firstB ? economyGetBuildingMinFloorSec(sim, firstB) : undefined,
        allActiveAtFloor: atFloorCount === actives.length,
        activeCount: actives.length,
      };
    }

    const totalReducedSec = Math.max(1, Math.round(totalAppliedMs / 1000));
    const pItem = primaryTarget ? getCatalogItem(primaryTarget.itemId) : undefined;
    const remainAfterSec = primaryTarget
      ? Math.max(1, Math.ceil((primaryTarget.constructEndsAt - now) / 1000))
      : undefined;

    return {
      reducedSec: totalReducedSec,
      targetUid: primaryTarget?.uid,
      targetName: pItem?.name,
      remainAfterSec,
      floorSec: primaryFloorSec,
      hitMinFloor: primaryHitFloor,
      allActiveAtFloor: false,
      activeCount: actives.length,
    };
}

export function economySpeedUpWithTimeSand(sim: ParkSimulation, uid: string, finishAll = false): boolean {
    if (sim.isVisitingNeighbor) return false;
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return false;
    const now = Date.now();
    if (now >= b.constructEndsAt) return false;

    if (!sim.state.sandboxMode) {
      const floorLabel = formatDurationCompactVi(economyGetBuildingMinFloorSec(sim, b));
      sim.onToast?.(
        `🔨 Công trình không dùng Cát ⏳ để bỏ qua trắng — hãy vượt Khảo Thí Pháp Thuật hoặc niệm Thần Chú Đa Ngữ để giảm giờ xây (tối đa còn ${floorLabel} để hoàn thành)!`,
        '🔨'
      );
      return false;
    }

    const remainSec = Math.max(1, Math.ceil((b.constructEndsAt - now) / 1000));
    const sandNeeded = finishAll ? Math.max(1, Math.ceil(remainSec / TIME_SAND_SKIP_SECONDS)) : 1;
    b.constructEndsAt = finishAll
      ? now
      : Math.max(now, b.constructEndsAt - sandNeeded * TIME_SAND_SKIP_SECONDS * 1000);
    b.lastTickAt = b.constructEndsAt;
    if (now >= b.constructEndsAt) {
      economyTickProductionToTimestamp(sim, now, false);
    } else {
      sim.saveToStorage();
    }
    sim.audio.playSpell();
    sim.onUiChange?.();
    return true;
}

export function economyGetBuildingProductionPerCycle(sim: ParkSimulation, b: PlacedBuilding, item: CatalogItem): { galleons: number; xp: number } {
    if (item.baseIncome <= 0 || item.cycleSec <= 0) return { galleons: 0, xp: 0 };
    let mult = starIncomeMultiplier(b.stars);

    if (item.isCreatureHabitat) {
      if (b.creatureStage === 'baby') mult *= 1.0;
      else if (b.creatureStage === 'adult') mult *= 1.35;
      else if (b.creatureStage === 'legendary') mult *= 1.85;
      if (b.hasBabyOffspring) mult *= 1.35; // Zoo Tycoon Breeding Bonus!
      // Magical Suitcase Sanctuary: Bond Closeness + Rare Morph + Compendium Mastery!
      mult *= getBondIncomeMultiplier(b.creatureBondLevel ?? 1);
      mult *= MORPH_INFO[b.creatureMorph ?? 'normal'].incomeMult;
      const masteryPct = getCompendiumMasteryBonusPct(sim.state.suitcase?.discoveredMorphs.length ?? 0);
      mult *= 1 + masteryPct * 0.01;
    }

    // Custom Coaster Excitement bonus
    if (item.isCustomCoasterStation && b.coasterStats) {
      mult *= 0.7 + b.coasterStats.excitement * 0.16;
    }

    // Backstage Logistics Supply boost (+25% for nearby shops!)
    if (item.category === 'shop' && !item.isBackstage) {
      const hasNearbyBackstage = sim.state.buildings.some(
        (other) =>
          Boolean(getCatalogItem(other.itemId)?.isBackstage) &&
          Date.now() >= other.constructEndsAt &&
          Math.hypot(other.gx - b.gx, other.gy - b.gy) <= 7
      );
      if (hasNearbyBackstage) mult *= 1.25;
    }

    // Price slider influence (bounded realistic elasticity: sweet spot ~1.18x-1.25x, never infinite!)
    if (item.ticketPrice) {
      const eff = economyGetEffectivePrice(sim, b, item);
      const verdict = economyGetPriceValueVerdict(sim, b, item);
      const priceFactor = (eff / item.ticketPrice) * verdict.demandMult;
      mult *= Math.max(0.45, Math.min(1.45, priceFactor));
    }

    const underCell = sim.grid[b.gy]?.[b.gx];
    if (underCell) {
      if (item.grantsButterbeer && underCell.terrain === 'snow') mult *= 1.25;
      if (item.isCreatureHabitat && underCell.terrain === 'forest') mult *= 1.15;
      if (item.id === 'dragon_lair' && underCell.terrain === 'volcanic') mult *= 1.25;
    }

    const fest = sim.getActiveFestival();
    if (fest === 'halloween' && item.id === 'halloween_arch') mult *= 2.0;
    if (fest === 'christmas') mult *= 1.25;
    if (fest === 'quidditch_cup' && item.id === 'burrow_feast_marquee') mult *= 2.0;

    if (sim.state.level >= 100) mult *= 1.5;

    // V3 System #1: Disconnected buildings yield only 25% passive income until linked by path!
    if (!sim.isBuildingConnected(b.uid)) {
      mult *= 0.25;
    }
    // V3 System #2: Broken-down rides pause passive bonus down to 20%
    if (b.isBrokenDown) {
      mult *= 0.2;
    }

    // V3 System #3: District Synergy Aura Multipliers!
    mult *= sim.activeSynergies.buildingGoldMult.get(b.uid) ?? 1.0;

    // V3 System #4: Aged Butterbeer & Felix Felicis Workshop Buffs!
    const now = Date.now();
    if (item.category === 'shop' && (sim.state.supply?.butterbeerBoostEndsAt ?? 0) > now) {
      mult *= 1.85;
    }

    let xpMult =
      (fest === 'halloween' ? 1.35 : 1.0) *
      (sim.activeSynergies.buildingXpMult.get(b.uid) ?? 1.0);
    if ((sim.state.supply?.felixBoostEndsAt ?? 0) > now) {
      xpMult *= 1.35;
    }

    return {
      galleons: Math.max(1, Math.round(item.baseIncome * mult)),
      xp: Math.max(1, Math.round(item.xpPerCollect * starIncomeMultiplier(b.stars) * xpMult)),
    };
}

export function economyTickProductionToTimestamp(sim: ParkSimulation, now: number, silent = false): void {
    sim.tickMatch3Hearts(now);
    if (sim.isVisitingNeighbor) {
      return;
    }
    // Check Workshop Brewing cauldron completion!
    const activeBrew = sim.state.supply?.activeBrew;
    if (activeBrew && now >= activeBrew.endsAt) {
      const rec = CRAFT_RECIPES.find((r) => r.id === activeBrew.goodId);
      sim.state.supply.goods[activeBrew.goodId] =
        (sim.state.supply.goods[activeBrew.goodId] ?? 0) + 1;
      sim.state.supply.brewCompletedCount = (sim.state.supply.brewCompletedCount ?? 0) + 1;
      sim.state.supply.activeBrew = null;
      if (rec && !silent) {
        sim.audio.playHarvestBubble();
        sim.onToast?.(`🧪 Vạc Chế Biến vừa ra lò 1 ${rec.emoji} ${rec.name}!`, rec.emoji);
      }
      sim.onUiChange?.();
    }

    let anyJustConstructed = false;
    for (const b of sim.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;

      if (now < b.constructEndsAt) {
        b.lastTickAt = b.constructEndsAt;
        continue;
      }

      if (item.isCreatureHabitat && b.creatureStage === 'egg') {
        b.creatureStage = 'baby';
        b.creatureHunger = 92;
        b.creatureHappiness = 95;
        b.lastTickAt = Math.max(b.lastTickAt, b.constructEndsAt);
        anyJustConstructed = true;
      }

      if (b.constructionNotified === false) {
        b.constructionNotified = true;
        b.lastTickAt = Math.max(b.lastTickAt, b.constructEndsAt);
        anyJustConstructed = true;
        const canCeremonialUnveil =
          !item.isFarmlandPlot &&
          !item.isAnimalPasturePlot &&
          !item.connectableGroup &&
          !item.isCreatureHabitat &&
          !item.isCoasterTrackPiece &&
          item.category !== 'decor' &&
          b.constructEndsAt > (b.placedAt || 0);
        if (canCeremonialUnveil && !sim.state.sandboxMode && !sim.isHeadmasterPreview) {
          b.awaitingUnveil = true;
        }
        const finishXp = Math.max(4, item.xpPerCollect);
        sim.addXp(finishXp);
        if (!silent) {
          sim.audio.playBuildComplete();
          sim.onBuildingCompleted?.(b.uid);
          sim.audio.playHarvestBubble();
          sim.spawnFloatingText(
            b.gx + item.width * 0.5,
            b.gy + item.height * 0.5,
            item.isCreatureHabitat
              ? `🐣 Trứng nở! +${finishXp} ⭐`
              : b.awaitingUnveil
                ? `🎀 Sẵn sàng Cắt Băng Khánh Thành! +${finishXp} ⭐`
                : `✨ Xây xong! +${finishXp} ⭐`,
            '#fde047'
          );
          sim.onToast?.(
            item.isCreatureHabitat
              ? `🐣 ${item.creatureName ?? item.name} vừa nở sau thời gian ấp trứng!`
              : b.awaitingUnveil
                ? `🎀 Công trình "${item.name}" đã hoàn tất — nhấp vào dải băng đỏ trên bản đồ để Cắt Băng Khánh Thành!`
                : `🏗️ Công trình "${item.name}" đã hoàn tất xây dựng & sẵn sàng hoạt động!`,
            item.isCreatureHabitat ? '🐣' : b.awaitingUnveil ? '🎀' : '🏗️'
          );
        }
      }

      // Honeydukes is a pure Match-3 Attic launcher (no coin or goods collection)
      if (item.id === 'burrow_honeydukes_canon') {
        b.storedGalleons = 0;
        b.storedXp = 0;
        b.readyBubbles = 0;
        b.workshopQueue = undefined;
        b.readyFarmGoods = undefined;
        b.lastTickAt = now;
        continue;
      }

      // Process Workshop Oven / Craft Queue slots (Playrix Township queue!)
      if (b.workshopQueue && b.workshopQueue.length > 0) {
        let finishedAnySlot = false;
        while (b.workshopQueue.length > 0 && now >= b.workshopQueue[0].endsAt) {
          const doneSlot = b.workshopQueue.shift()!;
          const gMeta = FARM_GOODS[doneSlot.goodId];
          b.readyFarmGoods = [...(b.readyFarmGoods ?? []), doneSlot.goodId];
          b.readyBubbles = Math.min(8, b.readyBubbles + 1);
          b.storedGalleons += Math.max(8, Math.round(gMeta.sellValue * 0.45));
          b.storedXp += gMeta.xp;
          finishedAnySlot = true;
          if (!silent) {
            sim.audio.playHarvestBubble();
            sim.onToast?.(
              `${gMeta.emoji} ${item.name} vừa ra lò 1 ${gMeta.name}! Bấm bong bóng để thu vào Kho Nông Sản!`,
              gMeta.emoji
            );
          }
        }
        if (finishedAnySlot) {
          anyJustConstructed = true;
        }
      }

      // 4-Stage Farmland Plot lifecycle (Plant -> Sprout/Water -> Ripe -> Harvest!)
      if (item.isFarmlandPlot) {
        if (b.cropId && b.cropReadyAt && now >= b.cropReadyAt) {
          const cMeta = FARM_CROPS[b.cropId];
          b.readyBubbles = Math.max(1, b.readyBubbles);
          b.storedGalleons = Math.max(cMeta.sellValue, b.storedGalleons);
          b.storedXp = Math.max(cMeta.xp, b.storedXp);
        }
        b.lastTickAt = now;
        continue;
      }

      // Connectable Animal Pasture lifecycle (Stock -> Graze/Feed -> Ready -> Auto-Restart Grazing!)
      if (item.isAnimalPasturePlot) {
        if (b.pastureAnimalId && b.pastureReadyAt && now >= b.pastureReadyAt) {
          const aMeta = PASTURE_ANIMALS[b.pastureAnimalId];
          if (aMeta) {
            b.readyBubbles = Math.max(1, b.readyBubbles);
            b.storedGalleons = Math.max(aMeta.sellValue, b.storedGalleons);
            b.storedXp = Math.max(aMeta.xp, b.storedXp);
          }
        }
        b.lastTickAt = now;
        continue;
      }

      if (item.cycleSec <= 0 || item.baseIncome <= 0) {
        b.lastTickAt = now;
        continue;
      }

      if (b.isEscaped) {
        b.lastTickAt = now;
        continue;
      }

      const maxCap = item.maxStorageCycles + (b.stars - 1) * 3;
      const elapsedSec = (now - b.lastTickAt) / 1000;
      const festSpeed = sim.getActiveFestival() === 'quidditch_cup' ? 0.85 : 1.0;
      const effectiveCycle = getBuildingEffectiveCycleSec(b, item) * festSpeed;

      if (elapsedSec >= effectiveCycle) {
        const cycles = Math.floor(elapsedSec / effectiveCycle);
        b.lastTickAt += cycles * effectiveCycle * 1000;
        if (b.readyBubbles < maxCap) {
          const addCycles = Math.min(cycles, maxCap - b.readyBubbles);
          const prod = economyGetBuildingProductionPerCycle(sim, b, item);
          b.readyBubbles += addCycles;
          b.storedGalleons += prod.galleons * addCycles;
          b.storedXp += prod.xp * addCycles;
          if (
            addCycles > 0 &&
            (item.id === 'burrow_chicken_coop' || item.id === 'burrow_puffskein_pasture')
          ) {
            const curGoods = b.readyFarmGoods ?? [];
            const canAdd = Math.min(addCycles, Math.max(0, 4 - curGoods.length));
            if (canAdd > 0) {
              b.readyFarmGoods = [...curGoods, ...Array(canAdd).fill('farm_egg_wool')];
            }
          } else if (addCycles > 0 && item.id === 'burrow_flower_garden') {
            const curGoods = b.readyFarmGoods ?? [];
            const canAdd = Math.min(addCycles, Math.max(0, 3 - curGoods.length));
            if (canAdd > 0) {
              b.readyFarmGoods = [...curGoods, ...Array(canAdd).fill('floral_bouquet_gift')];
            }
          }
        }
      }
    }

    if (anyJustConstructed) {
      sim.recomputeAllCoastersAndBiomes();
      sim.saveToStorage();
      sim.onUiChange?.();
    }
}

export function economyGetActiveConstructions(sim: ParkSimulation, now = Date.now()): PlacedBuilding[] {
    return sim.state.buildings
      .filter((b) => now < b.constructEndsAt)
      .sort((a, b) => a.constructEndsAt - b.constructEndsAt);
}

export function economySetParkEntryFee(sim: ParkSimulation, fee: number): void {
    sim.state.parkEntryFee = Math.max(0, Math.min(50, Math.round(fee)));
    sim.saveToStorage();
    sim.onUiChange?.();
}
