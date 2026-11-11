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

export function creaturesFeedCreature(sim: ParkSimulation, uid: string): boolean {
    if (sim.isVisitingNeighbor) return false;
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return false;
    const item = getCatalogItem(b.itemId);
    if (!item || !item.isCreatureHabitat || Date.now() < b.constructEndsAt) return false;

    const feedCost = Math.max(8, Math.round(item.cost * 0.04));
    if (!sim.state.sandboxMode && sim.state.galleons < feedCost) {
      sim.onToast?.(`Cần ${feedCost} Galleon mua khẩu phần thức ăn phép thuật!`, '🥩');
      return false;
    }
    if (!sim.state.sandboxMode) sim.state.galleons -= feedCost;

    b.creatureHunger = 100;
    b.creatureHappiness = 100;
    b.durability = 100;
    b.feedCount = (b.feedCount ?? 0) + 1;
    if (b.creatureStage === 'baby' && b.feedCount >= 3) {
      b.creatureStage = 'adult';
      sim.onToast?.(`🎉 ${item.creatureName} đã lớn thành Trưởng Thành khỏe mạnh!`, '🦄');
    }

    const xpGain = Math.max(12, Math.round(item.xpPerCollect * 0.6));
    sim.addXp(xpGain);
    creaturesAddCreatureBondXp(sim, b, item, 22);
    creaturesRegisterDiscoveredMorph(sim, item.id, b.creatureMorph ?? 'normal');
    sim.state.stats.creaturesFed++;
    sim.recordQuestProgress('feed_creatures', item.id, 1);
    sim.recordQuestProgress('serve_butterbeer', item.id, 1);
    sim.audio.playSpell();
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, `💖 Măm măm! +${xpGain} ⭐`, '#f472b6');
    sim.tryDropWizardCard(b.gx + 1, b.gy + 1, 0.12);
    sim.checkAndToastAchievements?.();
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function creaturesCatchEscapedCreature(sim: ParkSimulation, escId: string): boolean {
    const idx = sim.escapedCreatures.findIndex((e) => e.id === escId);
    if (idx === -1) return false;
    const esc = sim.escapedCreatures[idx];
    sim.escapedCreatures.splice(idx, 1);

    const home = sim.state.buildings.find((b) => b.uid === esc.buildingUid);
    if (home) {
      home.isEscaped = false;
      home.creatureHunger = 85;
      home.durability = 95;
    }

    const reward = esc.stolenCoins + 5;
    sim.state.galleons += reward;
    sim.addXp(22);
    sim.state.stats.nifflersCaught++;
    sim.audio.playSpell();
    sim.spawnFloatingText(esc.gx, esc.gy, `Accio! Thu hồi +${reward} 🪙`, '#60a5fa');
    sim.onRewardFly?.('galleons', reward, esc.gx, esc.gy);
    sim.tryDropWizardCard(esc.gx, esc.gy, 0.25);
    sim.onToast?.(`Đã đưa ${esc.name} về chuồng an toàn và thu hồi ${reward} Galleon!`, '🐾');
    sim.onUiChange?.();
    return true;
}

export function creaturesTriggerPlayfulEscape(sim: ParkSimulation): void {
    const hab = sim.state.buildings.find((b) => {
      const it = getCatalogItem(b.itemId);
      return it?.canEscape && !b.isEscaped && Date.now() >= b.constructEndsAt;
    });
    if (!hab) {
      sim.onToast?.('Hãy xây Khu Bảo Tồn Đào Mỏ (Niffler) ở Cấp 4 để xem thú tinh nghịch nhé!', '🐾');
      return;
    }
    creaturesSpawnEscapedFromHabitat(sim, hab);
}

export function creaturesSpawnEscapedFromHabitat(sim: ParkSimulation, hab: PlacedBuilding): void {
    const item = getCatalogItem(hab.itemId);
    if (!item) return;
    hab.isEscaped = true;
    const species =
      item.id === 'dragon_lair'
        ? 'dragon'
        : item.id === 'hippogriff_glade'
          ? 'hippogriff'
          : 'niffler';

    const pathSpot = getRandomUnlockedPathTile(sim.grid, new Set(sim.state.unlockedZones)) ?? {
      gx: hab.gx + 1,
      gy: hab.gy + 1,
    };

    sim.escapedCreatures.push({
      id: `esc_${Date.now()}_${Math.random()}`,
      buildingUid: hab.uid,
      species,
      name: item.creatureName ?? 'Niffler',
      gx: pathSpot.gx,
      gy: pathSpot.gy,
      vx: 0.8,
      vy: 0.6,
      stolenCoins: 2,
    });

    sim.audio.playCheekyAlert();
    sim.onToast?.(
      `${item.creatureName} vừa lách qua Bùa Chắn ra đường dạo chơi! Bấm vào nó (hoặc chờ Thần Sáng) để đưa về nhé!`,
      '🚨'
    );
    sim.onUiChange?.();
}

export function creaturesCastAccioHarvestAll(sim: ParkSimulation): void {
    if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) {
      sim.onToast?.('🦉 Chế độ Khách Tham Quan — không thể dùng Accio gom tài nguyên vườn bạn!', '🦉');
      return;
    }
    let count = 0;
    let sumG = 0;
    let sumX = 0;
    const now = Date.now();
    for (const b of sim.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (it?.isFarmlandPlot) {
        if (b.cropId && b.cropReadyAt && now >= b.cropReadyAt) {
          if (sim.harvestCropPlot(b.uid).ok) {
            count++;
          }
        }
        continue;
      }
      let remainingGoods: FarmGoodId[] = [];
      let collectedAnyGood = false;
      if (b.readyFarmGoods && b.readyFarmGoods.length > 0) {
        for (const gid of b.readyFarmGoods) {
          if (sim.addFarmItemToBarn(gid, 1) > 0) {
            collectedAnyGood = true;
          } else {
            remainingGoods.push(gid);
          }
        }
        b.readyFarmGoods = remainingGoods;
        if (collectedAnyGood && b.storedGalleons <= 0) {
          count++;
        }
      }
      if (b.storedGalleons > 0) {
        sumG += b.storedGalleons;
        sumX += b.storedXp;
        b.storedGalleons = 0;
        b.storedXp = 0;
        b.readyBubbles = remainingGoods.length > 0 ? Math.min(8, remainingGoods.length) : 0;
        if (it?.grantsButterbeer) {
          sim.state.stats.butterbeerServed++;
          sim.recordQuestProgress('serve_butterbeer', undefined, 1);
        }
        sim.grantBuildingIngredientDrop(b, it, false);
        count++;
      } else if (remainingGoods.length === 0 && collectedAnyGood) {
        b.readyBubbles = 0;
      }
    }
    for (const esc of [...sim.escapedCreatures]) {
      creaturesCatchEscapedCreature(sim, esc.id);
    }
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (sim.grid[y][x].hasLitter) {
          sim.grid[y][x].hasLitter = false;
          sim.stateRevision++;
          if (sim.state.tileOverrides[`${x},${y}`]) {
            sim.state.tileOverrides[`${x},${y}`].hasLitter = false;
          }
          sumX += 3;
        }
      }
    }

    if (count > 0 || sumX > 0) {
      sim.state.galleons += sumG;
      sim.state.finance.harvestRevenue += sumG;
      sim.state.stats.totalGalleonsHarvested += sumG;
      sim.addXp(sumX);
      if (sumG > 0) {
        sim.recordQuestProgress('harvest_galleons', undefined, sumG);
        sim.onRewardFly?.('galleons', sumG);
      }
      sim.audio.playSpell();
      sim.onToast?.(`⚡ Accio! Đã gom sạch ${sumG} Galleon & ${sumX} XP từ ${count} công trình!`, '🪄');
      sim.onUiChange?.();
    } else {
      sim.onToast?.('Hiện các mái nhà đang tích lũy vàng, chờ thêm chút xíu nhé!', '✨');
    }
}

export function creaturesGetBuiltCreatureHabitats(sim: ParkSimulation): Array<{ building: PlacedBuilding; item: CatalogItem }> {
    if (sim.isHeadmasterPreview) return [];
    const now = Date.now();
    const sourceBuildings = (sim.homeStateWhileVisiting ?? sim.state).buildings;
    const list: Array<{ building: PlacedBuilding; item: CatalogItem }> = [];
    for (const b of sourceBuildings) {
      if (now < b.constructEndsAt) continue;
      const item = getCatalogItem(b.itemId);
      if (item?.isCreatureHabitat) {
        list.push({ building: b, item });
      }
    }
    return list;
}

export function creaturesGetSuitcaseReadySummary(sim: ParkSimulation, now = Date.now()): {
    incubationReady: boolean;
    expeditionReady: boolean;
    hungryCount: number;
    badgeCount: number;
  } {
    const inc = sim.state.suitcase.activeIncubation;
    const exp = sim.state.suitcase.activeExpedition;
    const incubationReady = Boolean(inc && now >= inc.endsAt);
    const expeditionReady = Boolean(exp && now >= exp.endsAt);
    let hungryCount = 0;
    for (const { building, item } of creaturesGetBuiltCreatureHabitats(sim)) {
      if (!item.isRuralFarmstead && (building.creatureHunger ?? 100) < 40) hungryCount++;
    }
    const badgeCount = (incubationReady ? 1 : 0) + (expeditionReady ? 1 : 0) + hungryCount;
    return { incubationReady, expeditionReady, hungryCount, badgeCount };
}

export function creaturesRegisterDiscoveredMorph(sim: ParkSimulation, itemId: string, morph: CreatureMorphVariant): boolean {
    if (!CREATURE_SPECIES_PROFILES.some((p) => p.habitatItemId === itemId)) return false;
    const key = `${itemId}:${morph}`;
    if (!sim.state.suitcase.discoveredMorphs.includes(key)) {
      sim.state.suitcase.discoveredMorphs.push(key);
      return true;
    }
    return false;
}

export function creaturesAddCreatureBondXp(sim: ParkSimulation, b: PlacedBuilding, item: CatalogItem, amount: number): void {
    b.creatureBondLevel = Math.max(1, Math.min(MAX_BOND_LEVEL, b.creatureBondLevel ?? 1));
    b.creatureBondXp = Math.max(0, b.creatureBondXp ?? 0);
    if (b.creatureBondLevel >= MAX_BOND_LEVEL) {
      b.creatureBondXp = 0;
      return;
    }
    b.creatureBondXp += amount;
    let leveledUp = false;
    while (b.creatureBondLevel < MAX_BOND_LEVEL) {
      const req = getBondXpRequiredForNext(b.creatureBondLevel);
      if (b.creatureBondXp < req) break;
      b.creatureBondXp -= req;
      b.creatureBondLevel += 1;
      leveledUp = true;
      sim.addXp(25 * b.creatureBondLevel);
    }
    if (b.creatureBondLevel >= MAX_BOND_LEVEL) {
      b.creatureBondXp = 0;
    }
    if (leveledUp) {
      const petLabel = b.creatureNickname || item.creatureName || item.name;
      const pct = Math.round((getBondIncomeMultiplier(b.creatureBondLevel) - 1) * 100);
      sim.audio.playLevelUp();
      sim.onToast?.(
        `💝 Độ gắn kết của "${petLabel}" đạt Cấp ${b.creatureBondLevel}! (+${pct}% sản lượng chuồng)`,
        '🐾'
      );
    }
}

export function creaturesRenameCreature(sim: ParkSimulation, uid: string, rawName: string): { ok: boolean; name: string; msg: string } {
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, name: '', msg: 'Không tìm thấy sinh vật này.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat) {
      return { ok: false, name: '', msg: 'Công trình này không phải Khu Bảo Tồn Sinh Vật.' };
    }
    const cleaned = rawName.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 28);
    b.creatureNickname = cleaned || undefined;
    const finalDisplay = cleaned || item.creatureName || item.name;
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      name: finalDisplay,
      msg: cleaned
        ? `🏷️ Đã đặt tên thân mật cho thú cưng là "${cleaned}"!`
        : `🏷️ Đã khôi phục tên loài mặc định "${finalDisplay}".`,
    };
}

export function creaturesGroomCreature(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    const now = Date.now();
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy chuồng thú.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn vẫn đang xây dựng.' };
    }
    const elapsed = now - (b.lastGroomedAt ?? 0);
    if (!sim.state.sandboxMode && elapsed < GROOM_COOLDOWN_MS) {
      const waitSec = Math.ceil((GROOM_COOLDOWN_MS - elapsed) / 1000);
      return { ok: false, msg: `Thú cưng đang lim dim tận hưởng — chờ ${waitSec}s nữa nhé!` };
    }

    b.lastGroomedAt = now;
    b.creatureHappiness = 100;
    b.creatureHunger = Math.min(100, (b.creatureHunger ?? 80) + 12);
    sim.state.suitcase.totalGrooms += 1;
    creaturesRegisterDiscoveredMorph(sim, item.id, b.creatureMorph ?? 'normal');
    creaturesAddCreatureBondXp(sim, b, item, 30);
    sim.addXp(18);

    const petLabel = b.creatureNickname || item.creatureName || item.name;
    let giftSuffix = '';
    if (Math.random() < 0.35) {
      if (Math.random() < 0.5) {
        const giftGold = Math.max(1, Math.round((25 + sim.state.level * 1.2) / 5));
        sim.state.galleons += giftGold;
        sim.state.finance.harvestRevenue += giftGold;
        giftSuffix = ` Nó dụi đầu tặng lại bạn +${giftGold}🪙 lấp lánh!`;
      } else {
        sim.state.supply.ingredients.starlight_dust = Math.min(
          99,
          (sim.state.supply.ingredients.starlight_dust ?? 0) + 1
        );
        giftSuffix = ' Bộ lông rũ ra +1 ✨ Bụi Ánh Sao quý hiếm!';
      }
    }

    sim.audio.playHarvestBubble();
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, `🪮 Chải lông êm ái! +30 💝`, '#f9a8d4');
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🪮 Bạn chải mượt bộ lông của ${petLabel} (+30 Điểm Gắn Kết, Vui vẻ 100%).${giftSuffix}`,
    };
}

export function creaturesTrainCreatureTrick(sim: ParkSimulation, uid: string): { ok: boolean; msg: string } {
    const now = Date.now();
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy chuồng thú.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn vẫn đang xây dựng.' };
    }
    const elapsed = now - (b.lastTrainedAt ?? 0);
    if (!sim.state.sandboxMode && elapsed < TRAIN_COOLDOWN_MS) {
      const waitSec = Math.ceil((TRAIN_COOLDOWN_MS - elapsed) / 1000);
      return { ok: false, msg: `Thú cưng vừa biểu diễn xong — nghỉ ngơi ${waitSec}s nữa nhé!` };
    }
    const trainCost = 20;
    if (!sim.state.sandboxMode && sim.state.galleons < trainCost) {
      return { ok: false, msg: `Cần ${trainCost}G mua bánh thưởng huấn luyện tiết mục!` };
    }
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= trainCost;
    }

    b.lastTrainedAt = now;
    b.creatureHappiness = 100;
    creaturesRegisterDiscoveredMorph(sim, item.id, b.creatureMorph ?? 'normal');
    creaturesAddCreatureBondXp(sim, b, item, 45);
    sim.addXp(38);
    sim.recordQuestProgress('feed_creatures', item.id, 1);

    const profile = getSpeciesProfile(item.id);
    const trickLabel = profile?.trickName ?? 'Vũ Điệu Phép Thuật';
    const petLabel = b.creatureNickname || item.creatureName || item.name;
    sim.audio.playSpell();
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, `🎾 ${trickLabel}! +45 💝`, '#fde047');
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🎾 ${petLabel} trình diễn tiết mục "${trickLabel}" tuyệt đẹp! (+45 Điểm Gắn Kết & +38 ⭐)`,
    };
}

export function creaturesGetMorphIncubationCost(sim: ParkSimulation, item: CatalogItem): number {
    return Math.max(85, Math.round(item.cost * 0.14));
}

export function creaturesStartMorphIncubation(sim: ParkSimulation, habitatUid: string, useStarlight: boolean): { ok: boolean; msg: string } {
    const now = Date.now();
    if (sim.state.suitcase.activeIncubation) {
      return { ok: false, msg: 'Lồng Ấp Cổ Ngữ đang ấp một quả trứng khác rồi!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === habitatUid);
    if (!b) return { ok: false, msg: 'Không tìm thấy sinh vật để kết tinh trứng cổ ngữ.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn phải xây xong mới có thể ấp biến thể.' };
    }

    const goldCost = creaturesGetMorphIncubationCost(sim, item);
    if (!sim.state.sandboxMode) {
      if (sim.state.galleons < goldCost) {
        return { ok: false, msg: `Cần ${goldCost}G để thắp Lồng Ấp Cổ Ngữ cho loài này!` };
      }
      if (useStarlight && (sim.state.supply.ingredients.starlight_dust ?? 0) < 1) {
        return { ok: false, msg: 'Chưa có ✨ Bụi Ánh Sao trong kho nguyên liệu!' };
      }
      sim.state.galleons -= goldCost;
      if (useStarlight) {
        sim.state.supply.ingredients.starlight_dust -= 1;
      }
    }

    sim.state.suitcase.activeIncubation = {
      habitatUid: b.uid,
      itemId: item.id,
      startedAt: now,
      endsAt: now + INCUBATION_DURATION_MS,
      boostedWithStarlight: useStarlight,
    };
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🥚 Đã đặt Trứng Cổ Ngữ của ${item.creatureName ?? item.name} vào Lồng Ấp (${Math.round(INCUBATION_DURATION_MS / 1000)}s)!`,
    };
}

export function creaturesSpeedUpIncubationWithSand(sim: ParkSimulation): { ok: boolean; msg: string } {
    const inc = sim.state.suitcase.activeIncubation;
    const now = Date.now();
    if (!inc || now >= inc.endsAt) {
      return { ok: false, msg: 'Trứng đã sẵn sàng nở rồi!' };
    }
    if (!sim.state.sandboxMode && sim.state.timeSand < 1) {
      return { ok: false, msg: 'Cần 1 ⏳ Cát Thời Gian để ấp nở tức thì!' };
    }
    if (!sim.state.sandboxMode) {
      sim.state.timeSand -= 1;
    }
    inc.endsAt = now;
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: '⏳ Cát Thời Gian lấp lánh — Trứng Cổ Ngữ đã nứt vỏ sẵn sàng!' };
}

export function creaturesClaimMorphIncubation(sim: ParkSimulation): {
    ok: boolean;
    morph?: CreatureMorphVariant;
    isNew?: boolean;
    msg: string;
  } {
    const inc = sim.state.suitcase.activeIncubation;
    const now = Date.now();
    if (!inc) return { ok: false, msg: 'Không có trứng nào trong Lồng Ấp.' };
    if (now < inc.endsAt) {
      const left = Math.ceil((inc.endsAt - now) / 1000);
      return { ok: false, msg: `Trứng đang kết tinh phép thuật (${left}s nữa)!` };
    }

    const b = sim.state.buildings.find((x) => x.uid === inc.habitatUid);
    const item = getCatalogItem(inc.itemId);
    const roll = Math.random();
    let hatchedMorph: CreatureMorphVariant = 'normal';
    if (inc.boostedWithStarlight) {
      if (roll < 0.36) hatchedMorph = 'radiant';
      else if (roll < 0.9) hatchedMorph = 'mystic';
      else hatchedMorph = 'normal';
      if (hatchedMorph === 'normal' && (!b?.creatureMorph || b.creatureMorph === 'normal')) {
        hatchedMorph = 'mystic';
      }
    } else {
      if (roll < 0.16) hatchedMorph = 'radiant';
      else if (roll < 0.62) hatchedMorph = 'mystic';
      else hatchedMorph = 'normal';
    }

    const isNew = creaturesRegisterDiscoveredMorph(sim, inc.itemId, hatchedMorph);
    sim.state.suitcase.totalMorphsHatched += 1;
    sim.state.suitcase.activeIncubation = null;

    const rank: Record<CreatureMorphVariant, number> = { normal: 0, mystic: 1, radiant: 2 };
    if (b && item) {
      const cur = b.creatureMorph ?? 'normal';
      if (rank[hatchedMorph] >= rank[cur]) {
        b.creatureMorph = hatchedMorph;
      }
      b.creatureHappiness = 100;
      creaturesAddCreatureBondXp(sim, b, item, 40);
      sim.spawnFloatingText(
        b.gx + 1,
        b.gy + 1,
        `${MORPH_INFO[hatchedMorph].badge}!`,
        hatchedMorph === 'radiant' ? '#fde047' : '#38bdf8'
      );
    }

    const profile = getSpeciesProfile(inc.itemId);
    const variantTitle = profile ? profile.morphNames[hatchedMorph] : MORPH_INFO[hatchedMorph].badge;
    sim.addXp(hatchedMorph === 'radiant' ? 140 : hatchedMorph === 'mystic' ? 85 : 45);
    sim.audio.playLevelUp();
    sim.checkAndToastAchievements?.();
    sim.saveToStorage();
    sim.onUiChange?.();

    const msg = `🐣 Trứng nở thành công: ${variantTitle} (${MORPH_INFO[hatchedMorph].badge})${isNew ? ' — Mở khóa mục mới trong Sổ Tay Newt (+2% sản lượng toàn bộ thú)!' : '!'}`;
    sim.onToast?.(msg, hatchedMorph === 'radiant' ? '✨' : '🌙');
    return { ok: true, morph: hatchedMorph, isNew, msg };
}

export function creaturesStartSuitcaseExpedition(sim: ParkSimulation, 
    habitatUid: string,
    expeditionId: SuitcaseExpeditionId
  ): { ok: boolean; msg: string } {
    const now = Date.now();
    if (sim.state.suitcase.activeExpedition) {
      return { ok: false, msg: 'Đội thám hiểm thú cưng đang trên đường đi rồi!' };
    }
    const exp = SUITCASE_EXPEDITIONS.find((e) => e.id === expeditionId);
    if (!exp) return { ok: false, msg: 'Không tìm thấy tuyến thám hiểm.' };
    if (!sim.state.sandboxMode && sim.state.level < exp.minParkLevel) {
      return { ok: false, msg: `Cần Công viên đạt Cấp ${exp.minParkLevel} để mở tuyến "${exp.name}"!` };
    }

    const b = sim.state.buildings.find((x) => x.uid === habitatUid);
    if (!b) return { ok: false, msg: 'Hãy chọn một sinh vật khỏe mạnh để cử đi thám hiểm.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn vẫn đang xây dựng.' };
    }
    if (!sim.state.sandboxMode && (b.creatureHunger ?? 80) < 30) {
      return { ok: false, msg: 'Thú cưng đang đói bụng (<30%) — hãy cho ăn trước khi lên đường nhé!' };
    }

    sim.state.suitcase.activeExpedition = {
      expeditionId: exp.id,
      habitatUid: b.uid,
      startedAt: now,
      endsAt: now + exp.durationSec * 1000,
    };
    const petLabel = b.creatureNickname || item.creatureName || item.name;
    sim.audio.playPlace();
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: `🧭 ${petLabel} đã phóng khỏi Vali tiến vào "${exp.name}" (${exp.durationSec}s)!`,
    };
}

export function creaturesSpeedUpExpeditionWithSand(sim: ParkSimulation): { ok: boolean; msg: string } {
    const act = sim.state.suitcase.activeExpedition;
    const now = Date.now();
    if (!act || now >= act.endsAt) {
      return { ok: false, msg: 'Thú cưng đã mang chiến lợi phẩm về tới cửa Vali rồi!' };
    }
    if (!sim.state.sandboxMode && sim.state.timeSand < 1) {
      return { ok: false, msg: 'Cần 1 ⏳ Cát Thời Gian để đón thú về tức thì!' };
    }
    if (!sim.state.sandboxMode) {
      sim.state.timeSand -= 1;
    }
    act.endsAt = now;
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: '⏳ Thú cưng đã vượt thời gian trở về cùng túi quà đầy ắp!' };
}

export function creaturesClaimSuitcaseExpedition(sim: ParkSimulation): { ok: boolean; msg: string } {
    const act = sim.state.suitcase.activeExpedition;
    const now = Date.now();
    if (!act) return { ok: false, msg: 'Hiện không có chuyến thám hiểm nào.' };
    if (now < act.endsAt) {
      const left = Math.ceil((act.endsAt - now) / 1000);
      return { ok: false, msg: `Thú cưng đang thám hiểm (${left}s nữa sẽ về)!` };
    }

    const exp = SUITCASE_EXPEDITIONS.find((e) => e.id === act.expeditionId) ?? SUITCASE_EXPEDITIONS[0];
    const b = sim.state.buildings.find((x) => x.uid === act.habitatUid);
    const item = b ? getCatalogItem(b.itemId) : undefined;

    const bondMult = getBondIncomeMultiplier(b?.creatureBondLevel ?? 1);
    const morphMult = MORPH_INFO[b?.creatureMorph ?? 'normal'].incomeMult;
    const totalMult = bondMult * morphMult;

    const rewardGold = Math.round(exp.baseGold * totalMult);
    const rewardXp = Math.round(exp.baseXp * totalMult);
    const bonusHerb = (b?.creatureBondLevel ?? 1) >= 5 ? 1 : 0;

    sim.state.galleons += rewardGold;
    sim.state.finance.harvestRevenue += rewardGold;
    sim.addXp(rewardXp);

    const herbParts: string[] = [];
    for (const ing of exp.guaranteedIngredients) {
      const qty = ing.qty + bonusHerb;
      sim.state.supply.ingredients[ing.id] = Math.min(
        99,
        (sim.state.supply.ingredients[ing.id] ?? 0) + qty
      );
      herbParts.push(`+${qty} ${RAW_INGREDIENTS_INFO[ing.id].emoji}`);
    }

    sim.state.suitcase.totalExpeditions += 1;
    sim.state.suitcase.activeExpedition = null;

    if (b && item) {
      creaturesAddCreatureBondXp(sim, b, item, 35);
      sim.tryDropWizardCard(b.gx + 1, b.gy + 1, exp.cardDropChance);
      sim.spawnFloatingText(b.gx + 1, b.gy + 1, `🧭 +${rewardGold}G ${herbParts.join(' ')}`, '#fde047');
    } else {
      sim.tryDropWizardCard(24, 24, exp.cardDropChance);
    }

    sim.audio.playHarvestBubble();
    sim.saveToStorage();
    sim.onUiChange?.();

    const petLabel = b?.creatureNickname || item?.creatureName || 'Thú cưng';
    const msg = `🎒 ${petLabel} trở về từ "${exp.name}": +${rewardGold}G, +${rewardXp} ⭐ & ${herbParts.join(', ')}!`;
    sim.onToast?.(msg, '🧭');
    return { ok: true, msg };
}
