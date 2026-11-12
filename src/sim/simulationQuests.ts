// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.

import {
  computeEconomicCycleSeconds,
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

export function questsTryDropWizardCard(sim: ParkSimulation, _gx: number, _gy: number, _baseChance = 0.08): void {
    // Chocolate Frog Wizard Card collection removed per design update.
}

export function questsAwardHousePoints(sim: ParkSimulation, house: HouseName, pts: number): void {
    sim.state.housePoints[house] = (sim.state.housePoints[house] ?? 0) + pts;
}

export function questsClaimHouseCupReward(sim: ParkSimulation): boolean {
    const totalPts = Object.values(sim.state.housePoints).reduce((a, b) => a + b, 0);
    const target = sim.state.houseCupMilestoneTier * 300;
    if (totalPts < target) return false;

    const entries = Object.entries(sim.state.housePoints) as Array<[HouseName, number]>;
    entries.sort((a, b) => b[1] - a[1]);
    const winner = entries[0][0];
    const rewardGold = Math.max(1, Math.round((180 + sim.state.houseCupMilestoneTier * 140) / 5));
    const rewardXp = 90 + sim.state.houseCupMilestoneTier * 65;

    sim.state.galleons += rewardGold;
    sim.state.timeSand += 1;
    sim.state.houseCupMilestoneTier += 1;
    questsAddXp(sim, rewardXp);
    sim.audio.playLevelUp();
    sim.onToast?.(
      `🏆 Nhà ${winner} dẫn đầu Cúp Nhà! Thưởng Quản Lý +${rewardGold}G, +${rewardXp} XP & +1 ⏳!`,
      '🏆'
    );
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function questsGrantBuildingIngredientDrop(sim: ParkSimulation, 
    b: PlacedBuilding,
    item: CatalogItem | undefined,
    showFloat = true
  ): void {
    if (!item?.producesIngredient || !sim.state.supply) return;
    const ing = item.producesIngredient;
    const qty =
      item.id === 'burrow_greenhouse_canon' ||
      item.id === 'molly_apple_bakery' ||
      item.id === 'burrow_cider_apiary'
        ? 2
        : 1;
    sim.state.supply.ingredients[ing] = Math.min(
      99,
      (sim.state.supply.ingredients[ing] ?? 0) + qty
    );
    if (item.id === 'burrow_greenhouse_canon') {
      sim.state.supply.ingredients.sweet_pumpkin = Math.min(
        99,
        (sim.state.supply.ingredients.sweet_pumpkin ?? 0) + 1
      );
    }
    if (showFloat) {
      const info = RAW_INGREDIENTS_INFO[ing];
      sim.spawnFloatingText(b.gx + 0.5, b.gy, `+${qty} ${info.emoji}`, '#86efac');
    }
}

export function questsHarvestBuildingBubble(sim: ParkSimulation, uid: string): boolean {
    if (sim.isVisitingNeighbor) return false;
    if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) return false;
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || b.itemId === 'burrow_honeydukes_canon') return false;
    const item = getCatalogItem(b.itemId);

    if (item?.isFarmlandPlot) {
      if (b.cropId && b.cropReadyAt && Date.now() >= b.cropReadyAt) {
        return sim.harvestCropPlot(uid).ok;
      }
      return false;
    }

    if (item?.isAnimalPasturePlot) {
      if (b.pastureAnimalId && b.pastureReadyAt && Date.now() >= b.pastureReadyAt) {
        return sim.harvestAnimalPasture(uid).ok;
      }
      return false;
    }

    const hasGoods = Boolean(b.readyFarmGoods && b.readyFarmGoods.length > 0);
    if (b.storedGalleons <= 0 && !hasGoods) return false;

    const counts = new Map<FarmGoodId, number>();
    const remainingGoods: FarmGoodId[] = [];
    if (b.readyFarmGoods && b.readyFarmGoods.length > 0) {
      for (const gid of b.readyFarmGoods) {
        const added = sim.addFarmItemToBarn(gid, 1);
        if (added > 0) {
          counts.set(gid, (counts.get(gid) ?? 0) + added);
        } else {
          remainingGoods.push(gid);
        }
      }
      if (counts.size === 0 && b.storedGalleons <= 0) {
        sim.onToast?.(
          '📦 Kho Nông Sản Đỏ đã đầy! Hãy giao Đơn Hàng Cú hoặc nâng cấp Kho trước khi thu hàng xưởng nhé.',
          '📦'
        );
        return false;
      }
      b.readyFarmGoods = remainingGoods;
      if (remainingGoods.length > 0) {
        sim.onToast?.(
          `📦 Kho Nông Sản đã đầy — còn ${remainingGoods.length} sản phẩm chờ lấy trên mái xưởng!`,
          '📦'
        );
      }
    }

    const g = b.storedGalleons;
    const x = b.storedXp;
    b.storedGalleons = 0;
    b.storedXp = 0;
    b.readyBubbles = remainingGoods.length > 0 ? Math.min(8, remainingGoods.length) : 0;
    b.harvestCycleCount = (b.harvestCycleCount ?? 0) + 1;
    b.lastTickAt = Date.now();

    let goodsLabel = '';
    if (counts.size > 0) {
      const parts: string[] = [];
      for (const [gid, qty] of counts.entries()) {
        parts.push(`+${qty} ${FARM_GOODS[gid].emoji}`);
      }
      if (parts.length > 0) {
        goodsLabel = `  ${parts.join(' ')}`;
      }
    }

    sim.state.galleons += g;
    sim.state.finance.harvestRevenue += g;
    sim.state.stats.totalGalleonsHarvested += g;
    questsAddXp(sim, x);
    questsAddHarvestFeastPoints(sim, hasGoods ? 10 : 4);
    if (g > 0) {
      questsRecordQuestProgress(sim, 'harvest_galleons', undefined, g);
    }
    if (item?.grantsButterbeer) {
      sim.state.stats.butterbeerServed++;
      questsRecordQuestProgress(sim, 'serve_butterbeer', undefined, 1);
    }
    questsGrantBuildingIngredientDrop(sim, b, item, true);

    sim.audio.playHarvestBubble();
    const cx = b.gx + (item ? item.width * 0.5 : 0.5);
    const cy = b.gy + (item ? item.height * 0.5 : 0.5);
    sim.spawnFloatingText(
      cx,
      cy,
      g > 0 ? `+${g} 🪙  +${x} ⭐${goodsLabel}` : `📦 Thu kho:${goodsLabel}`,
      '#fde047'
    );
    if (g > 0) {
      sim.onRewardFly?.('galleons', g, cx, cy);
    }
    questsTryDropWizardCard(sim, cx, cy, sim.getCurrentWeather().kind === 'fog' ? 0.12 : 0.09);
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function questsAddXp(sim: ParkSimulation, amount: number): void {
    if (amount <= 0) return;
    const prevTier = Math.floor(Math.max(0, sim.state.xp) / FARM_HARVEST_CHEST_XP);
    sim.state.xp += amount;
    const nextTier = Math.floor(Math.max(0, sim.state.xp) / FARM_HARVEST_CHEST_XP);
    const chestsEarned = nextTier - prevTier;
    if (chestsEarned > 0 && !sim.state.sandboxMode && !sim.isHeadmasterPreview) {
      const bonusGold = chestsEarned * 13;
      const bonusSand = chestsEarned;
      sim.state.galleons += bonusGold;
      sim.state.finance.harvestRevenue += bonusGold;
      sim.state.timeSand += bonusSand;
      let boosterGiftTag = '';
      if (nextTier % 3 === 0 && sim.state.match3) {
        const cycle: Match3BoosterId[] = ['reparo_hammer', 'row_col_cannon', 'alohomora_shuffle'];
        const pick = cycle[nextTier % cycle.length];
        sim.state.match3.boosters[pick] = (sim.state.match3.boosters[pick] ?? 0) + 1;
        const bMeta = MATCH3_BOOSTERS.find((b) => b.id === pick);
        if (bMeta) boosterGiftTag = ` +1 ${bMeta.emoji} ${bMeta.shortLabel}`;
      }
      sim.onRewardFly?.('galleons', bonusGold);
      sim.onRewardFly?.('sand', bonusSand);
      sim.onToast?.(
        `🎁 Rương Mùa Gặt Điền Trang! Nhận +${bonusGold}G +${bonusSand} ⏳ Cát${boosterGiftTag} hỗ trợ Giải Đố!`,
        '🎁'
      );
      sim.saveToStorage();
    }
}

export function questsGetActiveStoryQuest(sim: ParkSimulation): QuestDef | null {
    const raw = STORY_QUESTS[sim.state.storyQuestIndex];
    if (!raw) return null;
    const progress = questsComputeObjectiveSnapshot(sim, raw.objectiveType, raw.targetId, raw.id, true);
    return {
      ...raw,
      progress,
      completed: progress >= raw.targetAmount,
      claimed: false,
    };
}

export function questsComputeObjectiveSnapshot(sim: ParkSimulation, 
    type: QuestObjectiveType,
    targetId: string | undefined,
    questId: string,
    isStory: boolean
  ): number {
    if (type === 'build_item' && targetId) {
      return sim.state.buildings.filter((b) => b.itemId === targetId).length;
    }
    if (type === 'unlock_zone' && targetId) {
      return sim.state.unlockedZones.includes(targetId as ZoneId) ? 1 : 0;
    }
    if (type === 'reach_level') {
      return sim.state.level;
    }
    if (isStory) {
      const tracked = sim.state.storyQuestProgress[questId] ?? 0;
      if (type === 'place_paths') return Math.max(tracked, sim.state.stats.pathsPlaced);
      if (type === 'serve_butterbeer') return Math.max(tracked, sim.state.stats.butterbeerServed);
      if (type === 'sell_wands') return Math.max(tracked, sim.state.stats.wandsSold);
      if (type === 'cast_spells') return Math.max(tracked, sim.state.stats.spellsCastByGuests);
      if (type === 'feed_creatures') return Math.max(tracked, sim.state.stats.creaturesFed);
      if (type === 'upgrade_star') return Math.max(tracked, sim.state.stats.starUpgradesDone);
      if (type === 'harvest_galleons') return Math.max(tracked, sim.state.stats.totalGalleonsHarvested);
      if (type === 'win_minigame' && !targetId) return Math.max(tracked, sim.state.stats.minigamesWon ?? 0);
      return tracked;
    }
    return 0;
}

export function questsRecordQuestProgress(sim: ParkSimulation, type: QuestObjectiveType, targetId: string | undefined, delta: number): void {
    const storyRaw = STORY_QUESTS[sim.state.storyQuestIndex];
    if (storyRaw && storyRaw.objectiveType === type) {
      if (!storyRaw.targetId || storyRaw.targetId === targetId) {
        sim.state.storyQuestProgress[storyRaw.id] =
          (sim.state.storyQuestProgress[storyRaw.id] ?? 0) + delta;
      }
    }

    for (const q of [...sim.state.owlQuests, ...sim.state.dailyQuests]) {
      if (q.claimed) continue;
      if (q.objectiveType === type && (!q.targetId || q.targetId === targetId)) {
        q.progress = Math.min(q.targetAmount, q.progress + delta);
        if (q.progress >= q.targetAmount) {
          q.completed = true;
        }
      }
    }
}

export function questsClaimQuest(sim: ParkSimulation, questId: string): boolean {
    const story = questsGetActiveStoryQuest(sim);
    if (story && story.id === questId && story.completed) {
      sim.state.galleons += story.rewardGalleons;
      sim.state.timeSand += story.rewardTimeSand;
      sim.state.storyClaimedIds.push(story.id);
      sim.state.storyQuestIndex += 1;
      questsAddXp(sim, story.rewardXp);
      sim.audio.playLevelUp();
      sim.onRewardFly?.('galleons', story.rewardGalleons);
      if (story.rewardTimeSand > 0) sim.onRewardFly?.('sand', story.rewardTimeSand);
      sim.onToast?.(
        `Hoàn thành ${story.title}! Nhận +${story.rewardGalleons}G & +${story.rewardXp} XP!`,
        '🦉'
      );
      sim.saveToStorage();
      sim.onUiChange?.();
      return true;
    }

    const owlIdx = sim.state.owlQuests.findIndex((q) => q.id === questId && q.completed && !q.claimed);
    if (owlIdx !== -1) {
      const q = sim.state.owlQuests[owlIdx];
      q.claimed = true;
      sim.state.galleons += q.rewardGalleons;
      sim.state.timeSand += q.rewardTimeSand;
      questsAddXp(sim, q.rewardXp);
      sim.owlSeedCounter++;
      const canFeedCreatures = sim.state.buildings.some((b) => {
        const it = getCatalogItem(b.itemId);
        return Boolean((it?.isCreatureHabitat || it?.isAnimalPasturePlot) && Date.now() >= b.constructEndsAt);
      });
      const canUpgradeStar =
        sim.state.match3.stars > 0 &&
        sim.state.buildings.some((b) => b.stars < 5 && Date.now() >= b.constructEndsAt);
      sim.state.owlQuests[owlIdx] = createOwlOrderQuest(sim.state.level, sim.owlSeedCounter, {
        canFeedCreatures,
        canUpgradeStar,
      });
      sim.audio.playHarvestBubble();
      sim.onRewardFly?.('galleons', q.rewardGalleons);
      if (q.rewardTimeSand > 0) sim.onRewardFly?.('sand', q.rewardTimeSand);
      sim.onToast?.(`Đã giao thư Cú! +${q.rewardGalleons}G & +${q.rewardXp} XP`, '✉️');
      sim.saveToStorage();
      sim.onUiChange?.();
      return true;
    }

    const daily = sim.state.dailyQuests.find((q) => q.id === questId && q.completed && !q.claimed);
    if (daily) {
      daily.claimed = true;
      sim.state.galleons += daily.rewardGalleons;
      sim.state.timeSand += daily.rewardTimeSand;
      questsAddXp(sim, daily.rewardXp);
      sim.audio.playSpell();
      sim.onRewardFly?.('galleons', daily.rewardGalleons);
      if (daily.rewardTimeSand > 0) sim.onRewardFly?.('sand', daily.rewardTimeSand);
      sim.onToast?.(`Nhận thưởng Nhiệm Vụ Hàng Ngày! +${daily.rewardGalleons}G`, '📰');
      sim.saveToStorage();
      sim.onUiChange?.();
      return true;
    }

    return false;
}

export function questsGetStoryAutoActionPreview(sim: ParkSimulation): {
    kind: 'claim_free' | 'auto_paths' | 'auto_build' | 'auto_unlock_zone' | 'open_match3' | 'none';
    shortLabel: string;
    longLabel: string;
    starCost: number;
    goldCost: number;
  } {
    const story = questsGetActiveStoryQuest(sim);
    if (!story) {
      return { kind: 'none', shortLabel: '', longLabel: '', starCost: 0, goldCost: 0 };
    }
    if (story.completed) {
      return {
        kind: 'claim_free',
        shortLabel: `🎁 Nhận +${story.rewardGalleons}G`,
        longLabel: '🎁 Nhận Phần Thưởng Nhiệm Vụ Cốt Truyện!',
        starCost: 0,
        goldCost: 0,
      };
    }
    if (story.objectiveType === 'place_paths') {
      return {
        kind: 'auto_paths',
        shortLabel: '🌟 1 Sao Lát Ngay',
        longLabel: '🌟 Dùng 1 Sao Phép Thuật Lát Đường Đá Tự Động & Hoàn Tất Ngay!',
        starCost: 1,
        goldCost: 0,
      };
    }
    if (story.objectiveType === 'unlock_zone' && story.targetId) {
      const z = getZoneById(story.targetId as ZoneId);
      const zStars = getZonePuzzleStarCost(z);
      if (!sim.state.sandboxMode && sim.state.level < z.unlockLevel) {
        return {
          kind: 'open_match3',
          shortLabel: `▶️ Cày lên Cấp ${z.unlockLevel}`,
          longLabel: `🔒 Cần đạt Cấp Giải Đố ${z.unlockLevel} để mở "${z.name}" — Chơi Giải Đố tăng cấp & nhận x2 🌟 Sao!`,
          starCost: zStars,
          goldCost: 0,
        };
      }
      return {
        kind: 'auto_unlock_zone',
        shortLabel: `🔓 Mở Khu (${zStars} 🌟)`,
        longLabel: `🔓 Phá Phong Ấn "${z.name}" (${zStars} 🌟 Sao Phép Thuật) & Nhận Thưởng!`,
        starCost: zStars,
        goldCost: 0,
      };
    }
    if (story.objectiveType === 'build_item' && story.targetId) {
      const item = getCatalogItem(story.targetId);
      if (item) {
        const starCost = getItemPuzzleStarCost(item);
        const effStar = Math.max(1, starCost);
        const effGold = starCost > 0 ? 0 : item.cost;
        if (!sim.state.sandboxMode && sim.state.level < item.unlockLevel) {
          return {
            kind: 'open_match3',
            shortLabel: `▶️ Cày lên Cấp ${item.unlockLevel}`,
            longLabel: `🔒 Bản vẽ "${item.name}" mở ở Cấp Giải Đố ${item.unlockLevel} — Bấm Chơi Giải Đố Lên Cấp Ngay!`,
            starCost: effStar,
            goldCost: effGold,
          };
        }
        return {
          kind: 'auto_build',
          shortLabel: effGold > 0 ? `🌟 Xây (${effStar}🌟 + ${effGold}🪙)` : `🌟 Xây Ngay (${effStar} 🌟)`,
          longLabel:
            effGold > 0
              ? `🌟 Xây Tự Động "${item.name}" (${effStar}🌟 + ${effGold.toLocaleString('vi-VN')}🪙) & Hoàn Tất Ngay!`
              : `🌟 Dùng ${effStar} Sao Khởi Công "${item.name}" & Nhận Thưởng!`,
          starCost: effStar,
          goldCost: effGold,
        };
      }
    }
    return {
      kind: 'open_match3',
      shortLabel: '🧩 Giải Đố Tăng Cấp',
      longLabel: '🧩 Chơi Tháp Giải Đố Kiếm Thêm XP & Sao Phép Thuật!',
      starCost: 0,
      goldCost: 0,
    };
}

export function questsCompleteStoryStepWithStar(sim: ParkSimulation): {
    ok: boolean;
    msg: string;
    reason?: 'missing_stars' | 'missing_gold' | 'locked_level' | 'no_space' | 'open_match3';
    placedGx?: number;
    placedGy?: number;
  } {
    const story = questsGetActiveStoryQuest(sim);
    if (!story) {
      return { ok: false, msg: 'Bạn đã hoàn thành trọn vẹn toàn bộ Cốt Truyện Công Viên!' };
    }

    // 0. Already completed naturally -> claim for FREE (0 Stars wasted)!
    if (story.completed) {
      questsClaimQuest(sim, story.id);
      return { ok: true, msg: `🎁 Đã nhận thưởng "${story.title}"!` };
    }

    // 1. Auto-lay cobblestone paths (`place_paths`) using Gold only (0 Magic Stars burned!)
    if (story.objectiveType === 'place_paths') {
      const needed = Math.max(1, story.targetAmount - story.progress);
      const pathItem = getCatalogItem('path_cobble');
      const unitGold = pathItem?.cost ?? 10;
      if (!sim.state.sandboxMode && sim.state.galleons < unitGold) {
        return {
          ok: false,
          reason: 'missing_gold',
          msg: `Cần ít nhất ${unitGold} 🪙 Galleon để lát Đường Đá tự động!`,
        };
      }
      const unlockedSet = new Set(sim.state.unlockedZones);
      let laid = 0;
      let lastGx = 7;
      let lastGy = 17;

      while (laid < needed) {
        if (!sim.state.sandboxMode && sim.state.galleons < unitGold) break;
        let bestTile: [number, number] | null = null;
        let bestScore = -9999;
        for (const pk of sim.connectedPathTiles) {
          const [px, py] = pk.split(',').map(Number);
          for (const [dx, dy] of [
            [1, 0],
            [0, 1],
            [0, -1],
            [-1, 0],
          ]) {
            const nx = px + dx;
            const ny = py + dy;
            const cell = sim.grid[ny]?.[nx];
            if (!cell || (!sim.state.sandboxMode && !unlockedSet.has(cell.zoneId))) continue;
            if (cell.path !== 'none' || cell.buildingUid || cell.coasterTrack) continue;
            // Prefer extending the main Hogsmeade avenue (y = 17..18) eastward cleanly
            const sc = (ny === 17 ? 50 : ny === 18 ? 35 : 10) + nx * 2;
            if (sc > bestScore) {
              bestScore = sc;
              bestTile = [nx, ny];
            }
          }
        }
        if (!bestTile) break;
        const [tx, ty] = bestTile;
        if (!sim.state.sandboxMode) {
          sim.state.galleons -= unitGold;
        }
        sim.grid[ty][tx].path = 'cobble';
        sim.state.tileOverrides[`${tx},${ty}`] = {
          ...sim.state.tileOverrides[`${tx},${ty}`],
          path: 'cobble',
        };
        sim.connectedPathTiles.add(`${tx},${ty}`);
        sim.state.stats.pathsPlaced += 1;
        questsRecordQuestProgress(sim, 'place_paths', 'path_cobble', 1);
        sim.spawnFloatingText(tx, ty, '🌟 Lát đá!', '#fde047');
        lastGx = tx;
        lastGy = ty;
        laid++;
      }

      sim.recomputeAllCoastersAndBiomes();
      const claimed = questsClaimQuest(sim, story.id);
      if (claimed) sim.launchFireworksShow(4);
      const msg = claimed
        ? `🪨 Đã lát tự động ${laid} ô Đường Đá & hoàn thành "${story.title}" (+${story.rewardGalleons}G)!`
        : `🪨 Đã lát thêm ${laid} ô Đường Đá cho "${story.title}"!`;
      sim.onToast?.(msg, '🪨');
      return { ok: laid > 0, msg, placedGx: lastGx, placedGy: lastGy };
    }

    // 2. Unlock fogged zone (`unlock_zone`) cleanly respecting level, Star, and Gold costs!
    if (story.objectiveType === 'unlock_zone' && story.targetId) {
      const z = getZoneById(story.targetId as ZoneId);
      const zStars = getZonePuzzleStarCost(z);
      if (!sim.state.sandboxMode && sim.state.level < z.unlockLevel) {
        return {
          ok: false,
          reason: 'locked_level',
          msg: `🔒 Cần đạt Cấp ${z.unlockLevel} để mở "${z.name}" — Hãy chơi Giải Đố & thu hoạch Vàng tích XP!`,
        };
      }
      if (!sim.state.sandboxMode && sim.state.match3.stars < zStars) {
        return {
          ok: false,
          reason: 'missing_stars',
          msg: `Cần ${zStars} 🌟 Sao Phép Thuật để phá phong ấn "${z.name}" — Vào Màn ${sim.state.match3.currentLevel} ngay!`,
        };
      }
      if (!sim.state.sandboxMode && sim.state.galleons < z.unlockCost) {
        return {
          ok: false,
          reason: 'missing_gold',
          msg: `Cần ${z.unlockCost.toLocaleString('vi-VN')} 🪙 Galleon để phá phong ấn "${z.name}"!`,
        };
      }
      const uRes = sim.unlockZone(z.id);
      if (!uRes.ok) {
        return { ok: false, msg: uRes.msg };
      }
      sim.bridgeZoneWithCobblePath(z.id);
      questsClaimQuest(sim, story.id);
      sim.launchFireworksShow(6);
      const cx = (z.x1 + z.x2) * 0.5;
      const cy = (z.y1 + z.y2) * 0.5;
      return {
        ok: true,
        msg: `🗺️ Đã phá phong ấn "${z.name}" & nhận thưởng "${story.title}" (+${story.rewardGalleons}G)!`,
        placedGx: cx,
        placedGy: cy,
      };
    }

    // 3. Auto-construct Story Building (`build_item`) right onto the park map!
    if (story.objectiveType === 'build_item' && story.targetId) {
      const item = getCatalogItem(story.targetId);
      if (!item) {
        return { ok: false, msg: 'Không tìm thấy công trình nhiệm vụ.' };
      }
      if (!sim.state.sandboxMode && sim.state.level < item.unlockLevel) {
        return {
          ok: false,
          reason: 'locked_level',
          msg: `🔒 "${item.name}" mở khóa ở Cấp ${item.unlockLevel} — Hãy chơi Giải Đố kiếm thêm XP!`,
        };
      }

      const effectiveStars = sim.getEffectiveItemStarCost(item);
      if (!sim.state.sandboxMode && effectiveStars > 0 && sim.state.match3.stars < effectiveStars) {
        return {
          ok: false,
          reason: 'missing_stars',
          msg: `Cần ${effectiveStars} 🌟 Sao Phép Thuật để kiến tạo "${item.name}" — Hãy chơi Giải Đố nhận thêm Sao!`,
        };
      }
      if (!sim.state.sandboxMode && effectiveStars === 0 && sim.state.galleons < item.cost) {
        return {
          ok: false,
          reason: 'missing_gold',
          msg: `Cần ${item.cost.toLocaleString('vi-VN')} 🪙 Galleon để xây "${item.name}"!`,
        };
      }

      const neededCount = Math.max(1, story.targetAmount - story.progress);
      let placedCount = 0;
      let lastSpot: { gx: number; gy: number } | null = null;
      while (placedCount < neededCount) {
        const nextStars = sim.getEffectiveItemStarCost(item);
        if (!sim.state.sandboxMode) {
          if (nextStars > 0 && sim.state.match3.stars < nextStars) break;
          if (nextStars === 0 && sim.state.galleons < item.cost) break;
        }
        const spot = sim.findSmartSpotForStoryBuilding(item);
        if (!spot) break;
        if (!sim.placeItem(item, spot.gx, spot.gy, 0)) break;
        lastSpot = spot;
        placedCount++;
      }

      if (placedCount === 0 || !lastSpot) {
        return {
          ok: false,
          reason: 'no_space',
          msg: `Chưa có ô đất trống phù hợp cạnh đường đi để đặt "${item.name}" — Hãy mở thêm khu đất mới hoặc dọn chỗ nhé!`,
        };
      }

      const built = sim.state.buildings[sim.state.buildings.length - 1];
      const waitSec =
        built && built.constructEndsAt > Date.now()
          ? Math.ceil((built.constructEndsAt - Date.now()) / 1000)
          : 0;
      const waitTag = waitSec > 0 ? ` (⏳ hoàn tất sau ${formatDurationCompactVi(waitSec)} thực tế)` : '';

      const claimed = questsClaimQuest(sim, story.id);
      if (claimed) sim.launchFireworksShow(4);
      const msg = claimed
        ? `🔨 Đã khởi công "${item.name}"${waitTag} & hoàn thành "${story.title}" (+${story.rewardGalleons}G)!`
        : `🔨 Đã đặt ${placedCount} "${item.name}"${waitTag} cho nhiệm vụ "${story.title}"!`;
      sim.onToast?.(msg, '🔨');
      return {
        ok: true,
        msg,
        placedGx: lastSpot.gx + item.width * 0.5,
        placedGy: lastSpot.gy + item.height * 0.5,
      };
    }

    return {
      ok: false,
      reason: 'open_match3',
      msg: `🧩 Hãy tích lũy XP từ Công Viên & Tháp Giải Đố để hoàn thành "${story.title}"!`,
    };
}

export function questsClaimOwlPostDelivery(sim: ParkSimulation, gx: number, gy: number): void {
    const gold = Math.round(28 + Math.min(60, sim.state.level * 2.5));
    const xp = Math.round(8 + Math.min(24, sim.state.level * 1.2));
    if (!sim.state.sandboxMode) {
      sim.state.galleons += gold;
      sim.state.finance.harvestRevenue += gold;
    }
    questsAddXp(sim, xp);
    sim.audio.playOwlHoot(0.036);
    sim.audio.playCardFound();
    sim.onRewardFly?.('galleons', gold, gx, gy);
    sim.spawnFloatingText(gx, gy, `🦉 Bưu kiện Cú +${gold}G +${xp}⭐`, '#fde047');
    sim.onToast?.(
      `🦉 Cú Tuyết vừa chuyển phát bưu kiện ấm áp từ Hogsmeade (+${gold} Vàng Galleon, +${xp} XP)!`,
      '🦉'
    );
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function questsGetWorkshopRecipesForBuilding(sim: ParkSimulation, item: CatalogItem): FarmWorkshopRecipe[] {
    if (!item.workshopGroupId) return [];
    return FARM_WORKSHOP_RECIPES.filter((r) => r.workshopGroupId === item.workshopGroupId);
}

export function questsEnqueueWorkshopRecipe(sim: ParkSimulation, uid: string, recipeId: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể đặt khay lò nhà bạn bè!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy xưởng chế biến!' };
    const item = getCatalogItem(b.itemId);
    if (!item?.workshopGroupId) return { ok: false, msg: 'Công trình này không có lò chế biến!' };
    if (Date.now() < b.constructEndsAt) return { ok: false, msg: 'Xưởng đang hoàn thiện xây dựng!' };

    const recipe = FARM_WORKSHOP_RECIPES.find(
      (r) => r.id === recipeId && r.workshopGroupId === item.workshopGroupId
    );
    if (!recipe) return { ok: false, msg: 'Công thức không hợp lệ!' };

    const maxQueue = 3 + Math.min(2, Math.max(0, b.stars - 1));
    const curQueue = b.workshopQueue ?? [];
    if (curQueue.length >= maxQueue) {
      return { ok: false, msg: `Hàng đợi lò đã đầy (${maxQueue}/${maxQueue} khay)!` };
    }

    if (!sim.state.sandboxMode) {
      if (sim.state.level < recipe.unlockLevel) {
        return { ok: false, msg: `Công thức này mở khóa ở Cấp ${recipe.unlockLevel}!` };
      }
      for (const req of recipe.inputs) {
        const have = sim.getFarmItemCount(req.itemId);
        if (have < req.qty) {
          const meta = getFarmItemMeta(req.itemId);
          return {
            ok: false,
            msg: `Thiếu ${req.qty - have} ${meta.emoji} ${meta.name} trong Kho Nông Sản!`,
          };
        }
      }
      for (const req of recipe.inputs) {
        sim.consumeFarmItemFromBarn(req.itemId, req.qty);
      }
    }

    const now = Date.now();
    const starSpeed = Math.max(0.65, 1 - (b.stars - 1) * 0.08);
    const slotOrder = (b.harvestCycleCount ?? 0) + (b.readyFarmGoods?.length ?? 0) + curQueue.length;
    const baseCraftSec = computeEconomicCycleSeconds(slotOrder, recipe.craftSec);
    const durMs = sim.state.sandboxMode
      ? 3000
      : Math.max(5000, Math.round(baseCraftSec * starSpeed * 1000));
    const startAt = curQueue.length > 0 ? Math.max(now, curQueue[curQueue.length - 1].endsAt) : now;
    const nextSlot = {
      goodId: recipe.goodId,
      startedAt: startAt,
      endsAt: startAt + durMs,
    };
    b.workshopQueue = [...curQueue, nextSlot];

    const outMeta = FARM_GOODS[recipe.goodId];
    const recipeTitle = recipe.name ?? outMeta.name;
    const durLabel = formatDurationCompactVi(Math.ceil(durMs / 1000));
    sim.audio.playPlace();
    sim.onBuildingTactile?.(b.uid);
    sim.spawnFloatingText(
      b.gx + item.width * 0.5,
      b.gy + item.height * 0.5,
      `🔥 Lên khay ${outMeta.emoji} ${recipeTitle}!`,
      '#fde047'
    );
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🔥 Đã đưa ${outMeta.emoji} ${recipeTitle} vào lò (${durLabel})!`,
    };
}

export function questsSpeedUpWorkshopSlot(sim: ParkSimulation, uid: string): boolean {
    if (sim.isVisitingNeighbor) return false;
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.workshopQueue || b.workshopQueue.length === 0) return false;
    if (!sim.state.sandboxMode && sim.state.timeSand < 1) {
      sim.onToast?.('Cần 1 ⏳ Cát Xoay Thời Gian để ra lò ngay mẻ bánh hiện tại!', '⏳');
      return false;
    }
    if (!sim.state.sandboxMode) {
      sim.state.timeSand -= 1;
    }
    const now = Date.now();
    const savedMs = Math.max(0, b.workshopQueue[0].endsAt - now);
    b.workshopQueue[0].endsAt = now - 1;
    for (let i = 1; i < b.workshopQueue.length; i++) {
      b.workshopQueue[i].startedAt = Math.max(now, b.workshopQueue[i].startedAt - savedMs);
      b.workshopQueue[i].endsAt = Math.max(now + 1000, b.workshopQueue[i].endsAt - savedMs);
    }
    sim.tickProductionToTimestamp(now, false);
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function questsGetOwlRequirementHelpState(sim: ParkSimulation, 
    orderId: string,
    reqIndex: number
  ): NeighborSocialState['playerOwlHelpRequests'][number] | undefined {
    const social = sim.ensureNeighborSocial();
    return social.playerOwlHelpRequests.find(
      (r) => r.orderId === orderId && r.reqIndex === reqIndex
    );
}

export function questsCanFulfillFarmOwlOrder(sim: ParkSimulation, order: FarmOwlOrder): boolean {
    if (sim.state.sandboxMode) return true;
    return order.requirements.every((req, reqIdx) => {
      const helped = questsGetOwlRequirementHelpState(sim, order.id, reqIdx);
      if (helped?.fulfilledAt) return true;
      return sim.getFarmItemCount(req.itemId) >= req.qty;
    });
}

export function questsGetReadyOwlOrdersCount(sim: ParkSimulation): number {
    const barn = sim.ensureFarmBarn();
    return barn.owlOrders.filter((o) => questsCanFulfillFarmOwlOrder(sim, o)).length;
}

export function questsFulfillFarmOwlOrder(sim: ParkSimulation, orderId: string): { ok: boolean; msg: string } {
    const barn = sim.ensureFarmBarn();
    const idx = barn.owlOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) return { ok: false, msg: 'Không tìm thấy đơn hàng Cú này!' };
    const order = barn.owlOrders[idx];

    if (!questsCanFulfillFarmOwlOrder(sim, order)) {
      const missing = order.requirements.find((r, reqIdx) => {
        const helped = questsGetOwlRequirementHelpState(sim, order.id, reqIdx);
        if (helped?.fulfilledAt) return false;
        return sim.getFarmItemCount(r.itemId) < r.qty;
      });
      const mMeta = missing ? getFarmItemMeta(missing.itemId) : null;
      return {
        ok: false,
        msg: mMeta
          ? `Kho còn thiếu ${mMeta.emoji} ${mMeta.name} — hãy gieo trồng, nướng thêm hoặc bấm "🤝 Nhờ bạn" nhé!`
          : 'Chưa đủ nông sản trong Kho!',
      };
    }

    if (!sim.state.sandboxMode) {
      for (let reqIdx = 0; reqIdx < order.requirements.length; reqIdx++) {
        const helped = questsGetOwlRequirementHelpState(sim, order.id, reqIdx);
        if (helped?.fulfilledAt) continue;
        const req = order.requirements[reqIdx];
        sim.consumeFarmItemFromBarn(req.itemId, req.qty);
      }
    }

    const social = sim.ensureNeighborSocial();
    social.playerOwlHelpRequests = social.playerOwlHelpRequests.filter(
      (r) => r.orderId !== order.id
    );

    sim.state.galleons += order.rewardGalleons;
    sim.state.finance.shopRevenue += order.rewardGalleons;
    sim.state.stats.butterbeerServed += 1;
    if (order.rewardMugglePlug) {
      barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + order.rewardMugglePlug;
    }
    barn.ordersDelivered = (barn.ordersDelivered ?? 0) + 1;

    // Farm -> Mini-game Fuel: Feast Orders grant +1 Time Sand & every 2 Owl Orders gift +1 Booster!
    const sandBonus = order.isFeastMarquee ? 1 : 0;
    if (sandBonus > 0) {
      sim.state.timeSand += sandBonus;
      sim.onRewardFly?.('sand', sandBonus, 14.5, 19.5);
    }
    let boosterTag = '';
    if (barn.ordersDelivered % 2 === 0 && sim.state.match3) {
      const cycle: Match3BoosterId[] = ['reparo_hammer', 'row_col_cannon', 'alohomora_shuffle'];
      const pick = cycle[(barn.ordersDelivered / 2) % cycle.length];
      sim.state.match3.boosters[pick] = (sim.state.match3.boosters[pick] ?? 0) + 1;
      const bMeta = MATCH3_BOOSTERS.find((b) => b.id === pick);
      if (bMeta) boosterTag = ` +1 ${bMeta.emoji} ${bMeta.shortLabel}`;
    }

    let talismanTag = '';
    if (order.isFeastMarquee || barn.ordersDelivered % 3 === 0) {
      if (sim.grantPhoenixTalisman(1) > 0) {
        talismanTag = ' +1 🔥 Bùa Phượng Hoàng';
      }
    }

    questsAddXp(sim, order.rewardXp);
    questsAddHarvestFeastPoints(sim, order.isFeastMarquee ? 30 : 22);
    questsRecordQuestProgress(sim, 'serve_butterbeer', undefined, 1);
    questsRecordQuestProgress(sim, 'harvest_galleons', undefined, order.rewardGalleons);

    sim.owlSeedCounter += 1;
    barn.owlOrders[idx] = createCanonFarmOwlOrder(sim.state.level, sim.owlSeedCounter + idx * 3);

    sim.audio.playOwlHoot(0.045);
    sim.audio.playHarvestBubble();
    sim.onRewardFly?.('galleons', order.rewardGalleons, 14.5, 19.5);
    const plugTag = order.rewardMugglePlug ? ` +${order.rewardMugglePlug} 🔌 Phích Cắm` : '';
    const sandTag = sandBonus > 0 ? ` +${sandBonus} ⏳ Cát` : '';
    const msg = `🦉 Cú ${order.owlName} giao đơn cho ${order.senderName}! Nhận +${order.rewardGalleons}G${sandTag}${talismanTag}${boosterTag}${plugTag}!`;
    sim.onToast?.(msg, '🦉');
    sim.advanceTutorialStep('build_and_owl_order');
    sim.checkAndToastAchievements?.();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function questsRefreshFarmOwlOrder(sim: ParkSimulation, orderId: string): boolean {
    const barn = sim.ensureFarmBarn();
    const idx = barn.owlOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) return false;
    const social = sim.ensureNeighborSocial();
    social.playerOwlHelpRequests = social.playerOwlHelpRequests.filter(
      (r) => r.orderId !== orderId
    );
    sim.owlSeedCounter += 1;
    barn.owlOrders[idx] = createCanonFarmOwlOrder(sim.state.level, sim.owlSeedCounter + idx * 5);
    sim.audio.playOwlHoot(0.03);
    sim.onToast?.('🦉 Cú đưa thư vừa mang tới một mảnh giấy da cừu đặt hàng mới!', '✉️');
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function questsGetBrewDurationSec(sim: ParkSimulation, recipe: CraftRecipeDef): number {
    const ownBuildings = (sim.homeStateWhileVisiting ?? sim.state).buildings;
    const hasWorkshop = ownBuildings.some(
      (b) => getCatalogItem(b.itemId)?.isWorkshopBrewery && Date.now() >= b.constructEndsAt
    );
    const hasSynergy = !sim.isVisitingNeighbor && sim.activeSynergies.activeIds.has('combo_herb_brewery');
    let sec = computeEconomicCycleSeconds(sim.state.supply?.brewCompletedCount ?? 0, recipe.brewSec);
    if (hasWorkshop) sec *= 0.55;
    if (hasSynergy) sec *= 0.78;
    return Math.max(4, Math.round(sec));
}

export function questsQuickHarvestHerbs(sim: ParkSimulation): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) {
      return { ok: false, msg: 'Chỉ có thể thu hoạch luống thảo dược tại vườn nhà của bạn!' };
    }
    const now = Date.now();
    const waitMs = 20_000;
    const elapsed = now - (sim.state.supply.lastHerbPlotHarvestAt || 0);
    if (!sim.state.sandboxMode && elapsed < waitMs) {
      const left = Math.ceil((waitMs - elapsed) / 1000);
      return { ok: false, msg: `Luống thảo dược đang mọc mầm mới (${left}s nữa)!` };
    }
    sim.state.supply.lastHerbPlotHarvestAt = now;
    const bonus = sim.state.buildings.some(
      (b) => b.itemId === 'burrow_greenhouse_canon' && now >= b.constructEndsAt
    )
      ? 2
      : 1;
    sim.state.supply.ingredients.mandrake_leaf = Math.min(
      99,
      (sim.state.supply.ingredients.mandrake_leaf ?? 0) + 2 * bonus
    );
    sim.state.supply.ingredients.sweet_pumpkin = Math.min(
      99,
      (sim.state.supply.ingredients.sweet_pumpkin ?? 0) + 2 * bonus
    );
    sim.state.supply.ingredients.starlight_dust = Math.min(
      99,
      (sim.state.supply.ingredients.starlight_dust ?? 0) + 1 * bonus
    );
    sim.state.supply.ingredients.magic_cacao = Math.min(
      99,
      (sim.state.supply.ingredients.magic_cacao ?? 0) + 1 * bonus
    );
    questsAddXp(sim, 14);
    sim.audio.playHarvestBubble();
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🌿 Đã thu hoạch rổ Thảo Dược tươi (+${2 * bonus}🌿 +${2 * bonus}🎃 +${bonus}✨ +${bonus}🍫)!`,
    };
}

export function questsStartBrewing(sim: ParkSimulation, goodId: CraftedGoodId): { ok: boolean; msg: string } {
    if (sim.state.supply.activeBrew) {
      return { ok: false, msg: 'Vạc phép thuật đang bận ủ mẻ hiện tại!' };
    }
    const recipe = CRAFT_RECIPES.find((r) => r.id === goodId);
    if (!recipe) return { ok: false, msg: 'Không tìm thấy công thức' };

    if (!sim.state.sandboxMode) {
      for (const [ingKey, reqQty] of Object.entries(recipe.inputs)) {
        const k = ingKey as keyof GameState['supply']['ingredients'];
        if ((sim.state.supply.ingredients[k] ?? 0) < (reqQty ?? 0)) {
          return {
            ok: false,
            msg: `Thiếu ${RAW_INGREDIENTS_INFO[k].emoji} ${RAW_INGREDIENTS_INFO[k].name}!`,
          };
        }
      }
      for (const [ingKey, reqQty] of Object.entries(recipe.inputs)) {
        const k = ingKey as keyof GameState['supply']['ingredients'];
        sim.state.supply.ingredients[k] -= reqQty ?? 0;
      }
    }

    const durSec = sim.state.sandboxMode ? 1 : questsGetBrewDurationSec(sim, recipe);
    sim.state.supply.activeBrew = {
      goodId,
      endsAt: Date.now() + durSec * 1000,
    };
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: `🧪 Bắt đầu ủ ${recipe.name} (${formatDurationCompactVi(durSec)})!` };
}

export function questsSpeedUpBrewing(sim: ParkSimulation): boolean {
    if (!sim.state.supply.activeBrew) return false;
    if (!sim.state.sandboxMode && sim.state.timeSand < 1) {
      sim.onToast?.('Cần 1 ⏳ Cát Xoay Thời Gian để hoàn tất mẻ ủ ngay lập tức!', '⏳');
      return false;
    }
    if (!sim.state.sandboxMode) sim.state.timeSand -= 1;
    sim.state.supply.activeBrew.endsAt = Date.now() - 1;
    sim.tickProductionToTimestamp(Date.now());
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function questsUseCraftedGood(sim: ParkSimulation, goodId: CraftedGoodId): { ok: boolean; msg: string } {
    if ((sim.state.supply.goods[goodId] ?? 0) < 1 && !sim.state.sandboxMode) {
      return { ok: false, msg: 'Chưa có thành phẩm trong kho — hãy nấu ở Vạc Chế Biến trước nhé!' };
    }
    if (!sim.state.sandboxMode) {
      sim.state.supply.goods[goodId] -= 1;
    }
    const now = Date.now();
    let msg = '';
    if (goodId === 'aged_butterbeer') {
      sim.state.supply.butterbeerBoostEndsAt =
        Math.max(now, sim.state.supply.butterbeerBoostEndsAt || 0) + 240_000;
      if (sim.state.match3) {
        sim.state.match3.hearts = MAX_MATCH3_HEARTS;
        sim.state.match3.nextHeartAt = 0;
      }
      msg = '🍻 Đã cấp Thùng Bia Bơ Ủ Tuyết: +85% doanh thu Cửa Tiệm (4p) & hồi đầy 5 ❤️ Tim Bùa Gặt Honeydukes!';
    } else if (goodId === 'felix_potion') {
      sim.state.supply.felixBoostEndsAt =
        Math.max(now, sim.state.supply.felixBoostEndsAt || 0) + 240_000;
      msg = '✨ Phúc Lạc Dược phát huy: +35% Sao XP toàn trang trại trong 4 phút!';
    } else if (goodId === 'golden_choc_box') {
      const gold = Math.max(1, Math.round((180 + sim.state.level * 35) / 5));
      sim.state.galleons += gold;
      sim.state.finance.shopRevenue += gold;
      questsAddXp(sim, 65);
      msg = `🎁 Mở Hộp Quà Hoàng Kim nhận +${gold} Galleon & +65 XP!`;
    } else if (goodId === 'dragon_firework') {
      sim.launchFireworksShow(12);
      for (const h of HOUSES) questsAwardHousePoints(sim, h, 15);
      msg = '🎆 ĐẠI TIỆC PHÁO HOA RỒNG LỬA RỰC SÁNG BẦU TRỜI (+15 Điểm mỗi Nhà & Khách cực vui)!';
    }
    sim.audio.playLevelUp();
    sim.onToast?.(msg, '✨');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function questsFulfillCargoCrate(sim: ParkSimulation, crateId: string): { ok: boolean; msg: string } {
    const crate = sim.state.supply.cargoCrates.find((c) => c.id === crateId);
    if (!crate || crate.fulfilled) {
      return { ok: false, msg: 'Kiện hàng này đã đóng xong rồi!' };
    }
    if (!sim.state.sandboxMode && (sim.state.supply.goods[crate.goodId] ?? 0) < crate.qtyRequired) {
      return { ok: false, msg: 'Chưa đủ thành phẩm yêu cầu trong kho Xưởng!' };
    }
    if (!sim.state.sandboxMode) {
      sim.state.supply.goods[crate.goodId] -= crate.qtyRequired;
    }
    crate.fulfilled = true;
    sim.state.galleons += crate.rewardGalleons;
    sim.state.finance.harvestRevenue += crate.rewardGalleons;
    sim.state.timeSand += crate.rewardTimeSand;
    questsAddXp(sim, crate.rewardXp);
    questsRecordQuestProgress(sim, 'harvest_galleons', undefined, crate.rewardGalleons);
    sim.audio.playHarvestBubble();

    const allDone = sim.state.supply.cargoCrates.every((c) => c.fulfilled);
    if (allDone) {
      const bonusG = Math.max(1, Math.round((240 + sim.state.level * 40) / 5));
      const bonusXp = Math.round(160 + sim.state.level * 25);
      sim.state.galleons += bonusG;
      sim.state.timeSand += 2;
      questsAddXp(sim, bonusXp);
      sim.state.stats.cargoTrainsSent = (sim.state.stats.cargoTrainsSent ?? 0) + 1;
      sim.state.supply.cargoTrainIndex += 1;
      sim.state.supply.cargoCrates = createCargoCrates(
        sim.state.level,
        sim.state.supply.cargoTrainIndex
      );
      sim.audio.playTrainWhistle();
      sim.launchFireworksShow(6);
      const msg = `🚂 Tuuu!! Tàu Hàng Tốc Hành xuất bến! Thưởng trọn chuyến +${bonusG}G, +${bonusXp} XP & +2⏳ Cát Thời Gian!`;
      sim.onToast?.(msg, '🚂');
      sim.saveToStorage();
      sim.onUiChange?.();
      return { ok: true, msg };
    }

    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `📦 Đã chất kiện hàng lên tàu (+${crate.rewardGalleons}G, +${crate.rewardXp} XP, +${crate.rewardTimeSand}⏳)!`,
    };
}

export function questsUnveilBuilding(sim: ParkSimulation, uid: string): RibbonUnveilCelebration | null {
    if (sim.isVisitingNeighbor) return null;
    const target = sim.state.buildings.find((x) => x.uid === uid && Boolean(x.awaitingUnveil));
    if (!target) return null;

    const item = getCatalogItem(target.itemId);
    if (!item) {
      target.awaitingUnveil = undefined;
      return null;
    }

    target.awaitingUnveil = undefined;
    const unveiledSet = new Set(sim.state.unveiledItemIds ?? []);
    if (unveiledSet.has(item.id)) {
      sim.saveToStorage();
      sim.onUiChange?.();
      sim.onToast?.(
        `Công trình "${item.name}" xây lại đã mở hoạt động (thưởng cắt băng mỗi loại chỉ nhận 1 lần)!`,
        '🎀'
      );
      return null;
    }
    unveiledSet.add(item.id);
    sim.state.unveiledItemIds = Array.from(unveiledSet);
    const finishXpSet = new Set(sim.state.finishXpItemIds ?? []);
    if (!finishXpSet.has(item.id)) {
      finishXpSet.add(item.id);
      sim.state.finishXpItemIds = Array.from(finishXpSet);
    }

    const bonusGalleons = Math.max(
      6,
      Math.round((item.baseIncome || 5) * 1.6 + Math.max(1, item.unlockLevel) * 0.8)
    );
    const bonusXp = Math.max(15, Math.round(Math.max(8, item.xpPerCollect) * 1.6));
    const feastPoints = 25;

    sim.state.galleons += bonusGalleons;
    sim.state.finance.harvestRevenue += bonusGalleons;
    questsAddXp(sim, bonusXp);
    const feast = questsEnsureHarvestFeast(sim);
    feast.unveilsCompleted = (feast.unveilsCompleted ?? 0) + 1;
    questsAddHarvestFeastPoints(sim, feastPoints);
    questsRecordQuestProgress(sim, 'harvest_galleons', undefined, bonusGalleons);

    const targetZoneId = getZoneAt(target.gx, target.gy).id;
    let speakerName = 'Bà Molly Weasley';
    let speakerEmoji = '🥧';
    let quoteVi = `Chúc mừng khánh thành "${item.name}"! Cả nhà Weasley mang bánh táo nóng hổi sang mừng tân gia đây!`;

    if (item.id.includes('arthur') || item.category === 'ride') {
      speakerName = 'Ông Arthur Weasley';
      speakerEmoji = '🔌';
      quoteVi = `Tuyệt vời! Cơ cấu bánh răng và bùa chú của "${item.name}" vận hành trơn tru không chê vào đâu được!`;
    } else if (item.id.includes('hagrid') || targetZoneId === 'bia_rung_cam' || targetZoneId === 'ho_den') {
      speakerName = 'Rubeus Hagrid';
      speakerEmoji = '🎃';
      quoteVi = `Hoành tráng hết sảy! "${item.name}" ấm cúng thế này thì cả Hogsmeade đều muốn ghé thăm mỗi ngày!`;
    } else if (item.id.includes('greenhouse') || item.id.includes('owl')) {
      speakerName = 'Hermione Granger';
      speakerEmoji = '📚';
      quoteVi = `Bố cục ánh sáng và thông gió của "${item.name}" đạt chuẩn xuất sắc theo sách Thảo Dược Học Hogwarts!`;
    } else if (item.id.includes('honeydukes') || item.id.includes('broomsticks')) {
      speakerName = 'Ron Weasley';
      speakerEmoji = '🍬';
      quoteVi = `Mơ ước thành sự thật rồi! "${item.name}" vừa cắt băng đã tỏa hương kẹo bơ ngọt lịm khắp con dốc!`;
    }

    const { bw, bh } = sim.getBuildingFootprint(item, target.rotation);
    const cx = target.gx + bw * 0.5;
    const cy = target.gy + bh * 0.5;

    if (typeof sim.audio.playRibbonCut === 'function') {
      sim.audio.playRibbonCut();
    } else {
      sim.audio.playBuildComplete();
    }
    sim.onBuildingTactile?.(target.uid);
    sim.onRewardFly?.('galleons', bonusGalleons, cx, cy);
    sim.spawnFloatingText(
      cx,
      cy,
      `🎀 Khánh thành! +${bonusGalleons}G +${bonusXp}⭐ +${feastPoints}🍁`,
      '#fde047'
    );

    const celebration: RibbonUnveilCelebration = {
      uid: target.uid,
      itemId: item.id,
      buildingName: item.name,
      gx: cx,
      gy: cy,
      bonusGalleons,
      bonusXp,
      feastPoints,
      speakerName,
      speakerEmoji,
      quoteVi,
    };

    sim.onRibbonUnveiled?.(celebration);
    sim.checkAndToastAchievements?.();
    sim.saveToStorage();
    sim.onUiChange?.();
    return celebration;
}

export function questsEnsureHarvestFeast(sim: ParkSimulation): HarvestFeastState {
    if (!sim.state.harvestFeast) {
      sim.state.harvestFeast = createInitialHarvestFeastState();
    }
    return sim.state.harvestFeast;
}

export function questsAddHarvestFeastPoints(sim: ParkSimulation, pts: number): { added: number; newlyUnlockedTiers: number[] } {
    if (pts <= 0 || sim.isHeadmasterPreview) {
      return { added: 0, newlyUnlockedTiers: [] };
    }
    const feast = questsEnsureHarvestFeast(sim);
    const maxPts = HARVEST_FEAST_TIERS[HARVEST_FEAST_TIERS.length - 1]?.pointsRequired ?? 5300;
    const before = feast.points;
    const after = Math.min(maxPts, before + Math.round(pts));
    const added = Math.max(0, after - before);
    feast.points = after;
    feast.totalPointsAllTime = (feast.totalPointsAllTime ?? 0) + Math.round(pts);

    const newlyUnlockedTiers: number[] = [];
    for (const def of HARVEST_FEAST_TIERS) {
      if (before < def.pointsRequired && after >= def.pointsRequired) {
        newlyUnlockedTiers.push(def.tier);
      }
    }

    if (newlyUnlockedTiers.length > 0) {
      const topTier = newlyUnlockedTiers[newlyUnlockedTiers.length - 1];
      const def = HARVEST_FEAST_TIERS.find((t) => t.tier === topTier);
      if (def) {
        sim.onToast?.(
          `🍁 Đại Tiệc Mùa Gặt mở khóa Bậc ${def.tier}/${HARVEST_FEAST_TIERS.length}: "${def.titleVi}" (${formatHarvestFeastRewardVi(def)})!`,
          '🍁'
        );
      }
    }
    return { added, newlyUnlockedTiers };
}

export function questsGetClaimableHarvestFeastCount(sim: ParkSimulation): number {
    const feast = questsEnsureHarvestFeast(sim);
    const claimedSet = new Set(feast.claimedTiers);
    let count = 0;
    for (const def of HARVEST_FEAST_TIERS) {
      if (feast.points >= def.pointsRequired && !claimedSet.has(def.tier)) {
        count++;
      }
    }
    return count;
}

export function questsGrantHarvestFeastTierRewardInternal(sim: ParkSimulation, tier: number): string | null {
    const feast = questsEnsureHarvestFeast(sim);
    const def = HARVEST_FEAST_TIERS.find((t) => t.tier === tier);
    if (!def) return null;
    if (feast.points < def.pointsRequired || feast.claimedTiers.includes(def.tier)) {
      return null;
    }

    feast.claimedTiers.push(def.tier);
    feast.claimedTiers.sort((a, b) => a - b);

    if (def.rewardGalleons && def.rewardGalleons > 0) {
      sim.state.galleons += def.rewardGalleons;
      sim.state.finance.harvestRevenue += def.rewardGalleons;
      sim.onRewardFly?.('galleons', def.rewardGalleons);
    }
    if (def.rewardXp && def.rewardXp > 0) {
      questsAddXp(sim, def.rewardXp);
    }
    if (def.rewardTimeSand && def.rewardTimeSand > 0) {
      sim.state.timeSand += def.rewardTimeSand;
      sim.onRewardFly?.('sand', def.rewardTimeSand);
    }
    if (def.rewardMugglePlug && def.rewardMugglePlug > 0) {
      const barn = sim.ensureFarmBarn();
      barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + def.rewardMugglePlug;
    }
    if (def.rewardPhoenixTalisman && def.rewardPhoenixTalisman > 0) {
      const addedTal = sim.grantPhoenixTalisman(def.rewardPhoenixTalisman);
      if (addedTal < def.rewardPhoenixTalisman) {
        sim.state.timeSand += def.rewardPhoenixTalisman - addedTal;
      }
    }
    if (def.rewardSeedCropId && (def.rewardSeedQty ?? 0) > 0) {
      sim.addCropSeeds(def.rewardSeedCropId, def.rewardSeedQty!);
    }
    if (def.rewardGoodId && (def.rewardGoodQty ?? 0) > 0) {
      const addedGood = sim.addFarmItemToBarn(def.rewardGoodId, def.rewardGoodQty!);
      if (addedGood < def.rewardGoodQty!) {
        const meta = getFarmItemMeta(def.rewardGoodId);
        sim.state.galleons += meta.sellValue * (def.rewardGoodQty! - addedGood);
      }
    }
    return formatHarvestFeastRewardVi(def);
}

export function questsClaimHarvestFeastTier(sim: ParkSimulation, tier: number): { ok: boolean; msg: string } {
    const label = questsGrantHarvestFeastTierRewardInternal(sim, tier);
    if (!label) {
      return { ok: false, msg: 'Bậc thưởng Đại Tiệc Mùa Gặt này chưa đủ điểm hoặc đã nhận rồi!' };
    }
    sim.audio.playLevelUp();
    const msg = `🍁 Nhận quà Đại Tiệc Mùa Gặt Bậc ${tier}: ${label}!`;
    sim.onToast?.(msg, '🍁');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function questsClaimAllHarvestFeastTiers(sim: ParkSimulation): { ok: boolean; claimedCount: number; msg: string } {
    const feast = questsEnsureHarvestFeast(sim);
    let claimedCount = 0;
    for (const def of HARVEST_FEAST_TIERS) {
      if (feast.points >= def.pointsRequired && !feast.claimedTiers.includes(def.tier)) {
        if (questsGrantHarvestFeastTierRewardInternal(sim, def.tier)) {
          claimedCount++;
        }
      }
    }
    if (claimedCount <= 0) {
      return { ok: false, claimedCount: 0, msg: 'Hiện chưa có bậc thưởng mới để nhận!' };
    }
    sim.audio.playLevelUp();
    if (claimedCount >= 3) {
      sim.launchFireworksShow(8);
    }
    const msg = `🍁 Đã nhận trọn ${claimedCount} bậc quà Đại Tiệc Mùa Gặt Hang Sóc!`;
    sim.onToast?.(msg, '🍁');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, claimedCount, msg };
}

export function questsStartNextHarvestFeastCycle(sim: ParkSimulation): { ok: boolean; msg: string } {
    const feast = questsEnsureHarvestFeast(sim);
    if (feast.claimedTiers.length < HARVEST_FEAST_TIERS.length) {
      return {
        ok: false,
        msg: `Hãy hoàn thành và nhận đủ ${HARVEST_FEAST_TIERS.length}/${HARVEST_FEAST_TIERS.length} bậc của Mùa #${feast.seasonCycle} trước nhé!`,
      };
    }
    feast.seasonCycle += 1;
    feast.points = 0;
    feast.claimedTiers = [];
    sim.audio.playLevelUp();
    sim.launchFireworksShow(12);
    const msg = `🎉 Khai hội Đại Tiệc Mùa Gặt Chu Kỳ #${feast.seasonCycle}! Mọi hoạt động nông trại & giải đố tiếp tục tích điểm nhận 30 mốc quà mới!`;
    sim.onToast?.(msg, '🎉');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}
