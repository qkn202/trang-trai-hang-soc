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
import type { ParkSimulation } from './simulation';

export function worldRebuildGrid(sim: ParkSimulation): void {
    sim.grid = Array.from({ length: GRID_SIZE }, (_, gy) =>
      Array.from({ length: GRID_SIZE }, (__, gx) => {
        const zone = getZoneAt(gx, gy);
        const ov = sim.state.tileOverrides[`${gx},${gy}`];
        return {
          gx,
          gy,
          zoneId: zone.id,
          terrain: ov?.terrain ?? zone.defaultTerrain,
          path: ov?.path ?? 'none',
          elevation: ov?.elevation ?? 0,
          coasterTrack: Boolean(ov?.coasterTrack),
          zooFence: Boolean(ov?.zooFence),
          buildingUid: null,
          hasLitter: Boolean(ov?.hasLitter),
        };
      })
    );

    for (const b of sim.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const bw = b.rotation % 2 === 1 ? item.height : item.width;
      const bh = b.rotation % 2 === 1 ? item.width : item.height;
      for (let dy = 0; dy < bh; dy++) {
        for (let dx = 0; dx < bw; dx++) {
          const tx = b.gx + dx;
          const ty = b.gy + dy;
          if (tx >= 0 && ty >= 0 && tx < GRID_SIZE && ty < GRID_SIZE) {
            sim.grid[ty][tx].buildingUid = b.uid;
          }
        }
      }
    }

    worldRecomputeAllCoastersAndBiomes(sim, );
}

export function worldIsBuildingConnected(sim: ParkSimulation, uid: string): boolean {
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (b && getCatalogItem(b.itemId)?.isRuralFarmstead) return true;
    if (sim.connectedBuildingUids.size === 0) return true;
    return sim.connectedBuildingUids.has(uid);
}

export function worldRecomputeAllCoastersAndBiomes(sim: ParkSimulation): void {
    sim.stateRevision++;
    sim.coasterCircuits.clear();
    sim.biomeCache.clear();
    sim.backstageCache.clear();
    sim.connectedPathTiles.clear();
    sim.connectedBuildingUids.clear();
    sim.queueTileToRideUid.clear();
    sim.rideQueueTailSpot.clear();

    const now = Date.now();
    // 1. BFS Road Network Connectivity from Burrow Homestead & Floo Network Portals!
    const bfsQ: Array<[number, number]> = [];
    for (const b of sim.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it) continue;
      if (it.id === 'burrow_house_canon' || (it.isFlooPortal && now >= b.constructEndsAt)) {
        sim.connectedBuildingUids.add(b.uid);
        const { bw, bh } = worldGetBuildingFootprint(sim, it, b.rotation);
        for (let dy = -1; dy <= bh; dy++) {
          for (let dx = -1; dx <= bw; dx++) {
            const tx = b.gx + dx;
            const ty = b.gy + dy;
            const c = sim.grid[ty]?.[tx];
            if (c && c.path !== 'none') {
              const k = `${tx},${ty}`;
              if (!sim.connectedPathTiles.has(k)) {
                sim.connectedPathTiles.add(k);
                bfsQ.push([tx, ty]);
              }
            }
          }
        }
      }
    }
    let head = 0;
    while (head < bfsQ.length) {
      const [cx, cy] = bfsQ[head++];
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = cx + dx;
        const ny = cy + dy;
        const c = sim.grid[ny]?.[nx];
        if (c && c.path !== 'none') {
          const k = `${nx},${ny}`;
          if (!sim.connectedPathTiles.has(k)) {
            sim.connectedPathTiles.add(k);
            bfsQ.push([nx, ny]);
          }
        }
      }
    }

    for (const b of sim.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const { bw, bh } = worldGetBuildingFootprint(sim, item, b.rotation);

      // Exempt decor, habitats in nature reserves, coaster track segments, and hidden backstage huts from road warning
      if (
        item.category === 'decor' ||
        item.category === 'creature' ||
        item.isBackstage ||
        item.id === 'burrow_house_canon' ||
        item.isFlooPortal ||
        item.isCoasterTrackPiece ||
        item.id === 'black_lake_boats'
      ) {
        sim.connectedBuildingUids.add(b.uid);
      } else {
        let linked = false;
        for (let dy = -1; dy <= bh && !linked; dy++) {
          for (let dx = -1; dx <= bw && !linked; dx++) {
            if (dx >= 0 && dx < bw && dy >= 0 && dy < bh) continue;
            // Orthogonal adjacency to footprint
            if ((dx === -1 || dx === bw) && (dy === -1 || dy === bh)) continue;
            if (sim.connectedPathTiles.has(`${b.gx + dx},${b.gy + dy}`)) {
              linked = true;
            }
          }
        }
        if (linked) {
          sim.connectedBuildingUids.add(b.uid);
        }
      }

      // 2. Map every Queue Slot tile to any Ride!
      if (
        item.category === 'ride' &&
        !item.isCoasterTrackPiece &&
        !item.isFlooPortal
      ) {
        const gates = getBuildingGates(b, bw, bh);
        const slots = traceQueueSlots(sim.grid, gates.entranceGx, gates.entranceGy, 12);
        for (const sl of slots) {
          sim.queueTileToRideUid.set(`${sl.gx},${sl.gy}`, b.uid);
        }
        const tail = slots[slots.length - 1] ?? { gx: gates.entranceGx, gy: gates.entranceGy };
        sim.rideQueueTailSpot.set(b.uid, tail);
      }

      if (item.isCustomCoasterStation) {
        const res = traceCoasterCircuit(sim.grid, sim.state.buildings, b, bw, bh);
        b.coasterStats = res.stats;
        if (res.waypoints.length >= 3) {
          sim.coasterCircuits.set(b.uid, {
            waypoints: res.waypoints,
            isClosed: res.stats.isClosedCircuit,
          });
        }
      }

      if (item.isCreatureHabitat) {
        const bio = evaluateHabitatBiome(sim.grid, sim.state.buildings, b, item);
        b.biomeScore = bio.score;
        sim.biomeCache.set(b.uid, bio);
        if (bio.score >= 80 && !b.hasBabyOffspring && now >= b.constructEndsAt) {
          b.hasBabyOffspring = true;
          if (!sim.isHeadmasterPreview) {
            sim.onToast?.(
              `🐣 Chuồng ${item.creatureName} đạt ${bio.score}% Sinh Thái Lý Tưởng và vừa sinh thêm Thú Non!`,
              '🎉'
            );
          }
        }
      }

      if (item.isBackstage) {
        sim.backstageCache.set(
          b.uid,
          evaluateBackstageShielding(sim.grid, sim.state.buildings, b, bw, bh)
        );
      }
    }

    // 3. Evaluate 12 District Synergy Combos!
    const prevIds = sim.activeSynergies.activeIds;
    sim.activeSynergies = evaluateDistrictSynergies(sim.state.buildings, now);
    if (!sim.isHeadmasterPreview && prevIds.size > 0) {
      for (const id of sim.activeSynergies.activeIds) {
        if (!prevIds.has(id)) {
          const link = sim.activeSynergies.links.find((l) => l.name.length > 0);
          if (link) {
            sim.onToast?.(`✨ Kích hoạt Combo Khu Phố mới: ${link.emoji} ${link.name}!`, '🌟');
          }
          break;
        }
      }
    }
}

export function worldAutoBuildCoasterForStation(sim: ParkSimulation, uid: string): boolean {
    const st = sim.state.buildings.find((b) => b.uid === uid);
    if (!st) return false;
    const item = getCatalogItem(st.itemId);
    if (!item?.isCustomCoasterStation) return false;
    const { bw, bh } = worldGetBuildingFootprint(sim, item, st.rotation);
    const res = buildSampleCoasterLoop(
      sim.grid,
      sim.state.tileOverrides,
      new Set(sim.state.unlockedZones),
      sim.state.sandboxMode,
      st,
      bw,
      bh
    );

    if (res.placedCount === 0) {
      sim.onToast?.(
        'Không đủ ô đất trống quanh Trạm để lắp tự động — bạn có thể tự vẽ Đốt Đường Ray vào ô trống bất kỳ nhé!',
        '🛤️'
      );
      return false;
    }

    if (!sim.state.sandboxMode) {
      const charge = Math.min(sim.state.galleons, res.cost);
      sim.state.galleons -= charge;
      sim.state.finance.constructionSpent += charge;
    }
    worldRebuildGrid(sim, );
    sim.audio.playLevelUp();
    sim.spawnFloatingText(st.gx + 1, st.gy, '🎢 Đã lắp vòng Tàu Lượn Đồi Đá!', '#fde047');
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function worldMoveBuilding(sim: ParkSimulation, 
    uid: string,
    newGx: number,
    newGy: number,
    newRot: 0 | 1 | 2 | 3
  ): { ok: boolean; reason?: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, reason: 'Chế độ Khách Tham Quan — không thể xê dịch công trình vườn bạn!' };
    }
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, reason: 'Không tìm thấy công trình' };
    const item = getCatalogItem(b.itemId);
    if (!item) return { ok: false, reason: 'Dữ liệu không hợp lệ' };

    const check = worldCanPlaceItem(sim, item, newGx, newGy, newRot, uid);
    if (!check.ok) return check;

    b.gx = newGx;
    b.gy = newGy;
    b.rotation = newRot;
    sim.rideQueues.delete(uid);
    worldRebuildGrid(sim, );
    sim.audio.playPlace();
    sim.spawnFloatingText(newGx + 0.5, newGy + 0.5, '✋ Đã di dời!', '#93c5fd');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true };
}

export function worldGetBuildingFootprint(sim: ParkSimulation, item: CatalogItem, rotation: 0 | 1 | 2 | 3): { bw: number; bh: number } {
    return {
      bw: rotation % 2 === 1 ? item.height : item.width,
      bh: rotation % 2 === 1 ? item.width : item.height,
    };
}

export function worldCanPlaceItem(sim: ParkSimulation, 
    item: CatalogItem,
    gx: number,
    gy: number,
    rotation: 0 | 1 | 2 | 3,
    ignoreBuildingUid?: string
  ): { ok: boolean; reason?: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, reason: 'Chế độ Khách Tham Quan — không thể xây/sửa thung lũng của bạn bè!' };
    }
    if (!ignoreBuildingUid) {
      if (!sim.state.sandboxMode && sim.state.level < item.unlockLevel) {
        return { ok: false, reason: `Mở khóa bản vẽ ở Cấp Giải Đố ${item.unlockLevel}` };
      }
      const starCost = sim.getEffectiveItemStarCost(item);
      if (starCost > 0) {
        if (!sim.state.sandboxMode && (sim.state.match3?.stars ?? 0) < starCost) {
          return {
            ok: false,
            reason: `Cần ${starCost} 🌟 Sao Phép Thuật (Vượt Bùa Gặt Honeydukes, Ngũ Ấn Đạo Tặc, Ma Trận Bảo Bối, Cờ Phù Thủy hoặc Nối Hình Sinh Vật để nhận Sao!)`,
          };
        }
      } else if (!sim.state.sandboxMode && sim.state.galleons < item.cost) {
        return { ok: false, reason: `Thiếu Vàng Galleon (${item.cost}G)` };
      }
    }

    const { bw, bh } = worldGetBuildingFootprint(sim, item, rotation);
    if (gx < 0 || gy < 0 || gx + bw > GRID_SIZE || gy + bh > GRID_SIZE) {
      return { ok: false, reason: 'Ngoài ranh giới bản đồ' };
    }

    const unlockedSet = new Set(sim.state.unlockedZones);
    const baseElev = sim.grid[gy][gx].elevation;

    for (let dy = 0; dy < bh; dy++) {
      for (let dx = 0; dx < bw; dx++) {
        const cell = sim.grid[gy + dy][gx + dx];
        if (!sim.state.sandboxMode && !unlockedSet.has(cell.zoneId)) {
          const z = getZoneById(cell.zoneId);
          return { ok: false, reason: `Vùng "${z.name}" đang phủ sương mù` };
        }

        if (item.elevationDelta) {
          const nextE = cell.elevation + item.elevationDelta;
          if (nextE < 0 || nextE > 3) {
            return { ok: false, reason: item.elevationDelta > 0 ? 'Đã đạt đỉnh đồi +3' : 'Đã ở mặt đất 0' };
          }
          if (cell.terrain === 'water' && nextE > 0) {
            return { ok: false, reason: 'Hãy lấp mặt nước trước khi nâng đồi' };
          }
          continue;
        }

        if (item.isCoasterTrackPiece) {
          if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Vướng công trình' };
          }
          continue;
        }

        if (item.isZooFence) {
          if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Vướng công trình' };
          }
          continue;
        }

        if (item.category === 'terrain') {
          if (item.terrainType === 'water' && cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Không thể đào nước dưới công trình' };
          }
          continue;
        }

        if (item.category === 'path') {
          if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Vướng công trình' };
          }
          // All paths can cross water (auto-builds an arched wooden bridge!)
          continue;
        }

        // Multi-tile building checks
        if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
          return { ok: false, reason: 'Ô đất đã có công trình' };
        }
        if (cell.coasterTrack) {
          return { ok: false, reason: 'Ô đất đang có Đường Ray Tàu Lượn' };
        }
        if (cell.terrain === 'water' && item.id !== 'black_lake_boats') {
          return { ok: false, reason: 'Không thể xây trên mặt nước' };
        }
        if (cell.elevation !== baseElev) {
          return { ok: false, reason: 'Cần mặt bằng cùng độ cao để đặt công trình lớn' };
        }
      }
    }

    return { ok: true };
}

export function worldPlaceItem(sim: ParkSimulation, item: CatalogItem, gx: number, gy: number, rotation: 0 | 1 | 2 | 3): boolean {
    const check = worldCanPlaceItem(sim, item, gx, gy, rotation);
    if (!check.ok) return false;

    const key = `${gx},${gy}`;
    const cell = sim.grid[gy][gx];

    // 1. Terrain Elevation Raise / Lower
    if (item.elevationDelta) {
      const nextE = Math.max(0, Math.min(3, cell.elevation + item.elevationDelta));
      if (nextE === cell.elevation) return false;
      if (!sim.state.sandboxMode) {
        sim.state.galleons -= item.cost;
        sim.state.finance.constructionSpent += item.cost;
      }
      cell.elevation = nextE;
      sim.state.tileOverrides[key] = { ...sim.state.tileOverrides[key], elevation: nextE };
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.addXp(item.xpPerCollect);
      sim.audio.playPlace();
      sim.spawnFloatingText(gx, gy, `Độ cao +${nextE}`, '#cbd5e1');
      sim.onUiChange?.();
      return true;
    }

    // 2. Custom Coaster Track Piece
    if (item.isCoasterTrackPiece) {
      if (cell.coasterTrack) return false;
      if (!sim.state.sandboxMode) {
        sim.state.galleons -= item.cost;
        sim.state.finance.constructionSpent += item.cost;
      }
      cell.coasterTrack = true;
      sim.state.tileOverrides[key] = { ...sim.state.tileOverrides[key], coasterTrack: true };
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.addXp(item.xpPerCollect);
      sim.audio.playPlace();
      sim.spawnFloatingText(gx, gy, `🛤️ +${item.xpPerCollect} ⭐`, '#fde047');
      sim.onUiChange?.();
      return true;
    }

    // 3. Zoo Sanctuary Fence
    if (item.isZooFence) {
      if (cell.zooFence) return false;
      if (!sim.state.sandboxMode) {
        sim.state.galleons -= item.cost;
        sim.state.finance.constructionSpent += item.cost;
      }
      cell.zooFence = true;
      sim.state.tileOverrides[key] = { ...sim.state.tileOverrides[key], zooFence: true };
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.addXp(item.xpPerCollect);
      sim.audio.playPlace();
      sim.onUiChange?.();
      return true;
    }

    // 4. Terrain Brush
    if (item.category === 'terrain' && item.terrainType) {
      if (cell.terrain === item.terrainType) return false;
      if (!sim.state.sandboxMode) {
        sim.state.galleons -= item.cost;
        sim.state.finance.constructionSpent += item.cost;
      }
      if (item.terrainType === 'water') {
        cell.elevation = 0;
      }
      cell.terrain = item.terrainType;
      sim.state.tileOverrides[key] = {
        ...sim.state.tileOverrides[key],
        terrain: item.terrainType,
        elevation: cell.elevation,
      };
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.addXp(item.xpPerCollect);
      sim.state.stats.pathsPlaced++;
      sim.recordQuestProgress('place_paths', item.id, 1);
      sim.audio.playPlace();
      sim.spawnFloatingText(gx, gy, `+${item.xpPerCollect} ⭐`, '#fde047');
      sim.onUiChange?.();
      return true;
    }

    // 5. Footpath / Queue / Bridge Brush
    if (item.category === 'path' && item.pathType) {
      if (cell.path === item.pathType) return false;
      if (!sim.state.sandboxMode) {
        sim.state.galleons -= item.cost;
        sim.state.finance.constructionSpent += item.cost;
      }
      sim.state.tileOverrides[key] = {
        ...sim.state.tileOverrides[key],
        path: item.pathType,
      };
      cell.path = item.pathType;
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.addXp(item.xpPerCollect);
      sim.state.stats.pathsPlaced++;
      sim.recordQuestProgress('place_paths', item.id, 1);
      sim.audio.playPlace();
      sim.spawnFloatingText(gx, gy, `+${item.xpPerCollect} ⭐`, '#fde047');
      sim.onUiChange?.();
      return true;
    }

    // 6. Regular Building / Ride / Creature / Decor (Star-only instant build for major blueprints; Gold-only for plots & expandable connectable yards!)
    const starCost = sim.getEffectiveItemStarCost(item);
    if (!sim.state.sandboxMode) {
      if (starCost > 0) {
        if (sim.state.match3) {
          sim.state.match3.stars = Math.max(0, sim.state.match3.stars - starCost);
        }
      } else {
        sim.state.galleons -= item.cost;
        sim.state.finance.constructionSpent += item.cost;
      }
    }

    const now = Date.now();
    const baseBuildSec = Math.max(item.buildDurationSec, computeRealTimeBuildSeconds(item));
    const durMs = sim.state.sandboxMode ? 0 : Math.round(baseBuildSec * 1000);
    const durSecActual = Math.ceil(durMs / 1000);
    const uid = `b_${now}_${Math.floor(Math.random() * 9999)}`;

    // New Thửa Đất Canh Tác always starts as freshly-tilled soil ready for the player to sow seeds!
    const newBuilding: PlacedBuilding = {
      uid,
      itemId: item.id,
      gx,
      gy,
      rotation,
      stars: 1,
      placedAt: now,
      constructEndsAt: now + durMs,
      lastTickAt: now + durMs,
      storedGalleons: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
      cropId: undefined,
      cropPlantedAt: undefined,
      cropReadyAt: undefined,
      cropWateredBoost: false,
      creatureStage: item.isCreatureHabitat
        ? durMs > 0
          ? 'egg'
          : item.id === 'burrow_chicken_coop' || item.id === 'burrow_puffskein_pasture'
            ? 'adult'
            : 'baby'
        : undefined,
      creatureHunger: item.isCreatureHabitat ? 98 : undefined,
      creatureHappiness: item.isCreatureHabitat ? 98 : undefined,
      feedCount: item.isCreatureHabitat ? 0 : undefined,
      creatureBondLevel: item.isCreatureHabitat ? 1 : undefined,
      creatureBondXp: item.isCreatureHabitat ? 0 : undefined,
      creatureMorph: item.isCreatureHabitat ? 'normal' : undefined,
      isEscaped: false,
      builtInSandbox: sim.state.sandboxMode ? true : undefined,
      constructionNotified: durMs <= 0,
    };

    if (item.isCreatureHabitat) {
      sim.registerDiscoveredMorph(item.id, 'normal');
    }

    sim.state.buildings.push(newBuilding);
    worldRebuildGrid(sim, );
    sim.audio.playPlace();
    sim.onBuildingTactile?.(newBuilding.uid);
    if (durMs <= 0 && starCost > 0) {
      sim.audio.playSpell();
      sim.onBuildingCompleted?.(newBuilding.uid);
    }

    if (durMs > 0) {
      const waitLabel = formatDurationCompactVi(durSecActual);
      sim.spawnFloatingText(
        gx + item.width * 0.5,
        gy + item.height * 0.5,
        item.isCreatureHabitat ? `🥚 Ấp trứng (${waitLabel})` : `🔨 Xây dựng (${waitLabel})`,
        '#93c5fd'
      );
    } else if (starCost > 0) {
      if (item.xpPerCollect > 0) {
        sim.addXp(item.xpPerCollect);
      }
      sim.spawnFloatingText(
        gx + item.width * 0.5,
        gy + item.height * 0.5,
        `✨ Xây xong! -${starCost} 🌟`,
        '#fde047'
      );
    } else if (item.xpPerCollect > 0) {
      sim.addXp(item.xpPerCollect);
      sim.spawnFloatingText(gx, gy, `+${item.xpPerCollect} ⭐`, '#fde047');
    }

    sim.recordQuestProgress('build_item', item.id, 1);
    if (
      starCost > 0 ||
      item.category === 'shop' ||
      item.id === 'burrow_house_canon' ||
      item.id === 'molly_apple_bakery'
    ) {
      sim.advanceTutorialStep('build_and_owl_order');
    }
    if (item.category === 'decor') {
      sim.recordQuestProgress('place_paths', item.id, 1);
    }
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function worldUnlockZone(sim: ParkSimulation, zoneId: ZoneId): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể mở khóa đất của bạn bè!' };
    }
    if (sim.state.unlockedZones.includes(zoneId)) {
      return { ok: false, msg: 'Vùng đất này đã mở khóa rồi!' };
    }
    const z = getZoneById(zoneId);
    const zoneStars = getZonePuzzleStarCost(z);
    if (!sim.state.sandboxMode && sim.state.level < z.unlockLevel) {
      return { ok: false, msg: `Cần đạt Cấp ${z.unlockLevel} để phá phong ấn vùng "${z.name}"` };
    }
    if (!sim.state.sandboxMode && (sim.state.match3?.stars ?? 0) < zoneStars) {
      return {
        ok: false,
        msg: `Cần ${zoneStars} 🌟 Sao Phép Thuật để phá phong ấn "${z.name}" (Hãy chơi Màn ${sim.state.match3?.currentLevel ?? 1}!)`,
      };
    }
    if (!sim.state.sandboxMode && sim.state.galleons < z.unlockCost) {
      return { ok: false, msg: `Cần ${z.unlockCost} Vàng Galleon để mở "${z.name}"` };
    }

    if (!sim.state.sandboxMode) {
      sim.state.galleons -= z.unlockCost;
      sim.state.finance.constructionSpent += z.unlockCost;
      sim.state.match3.stars = Math.max(0, sim.state.match3.stars - zoneStars);
    }
    sim.state.unlockedZones.push(zoneId);
    sim.stateRevision++;
    const bonusXp = Math.round(80 + z.unlockLevel * 35);
    sim.addXp(bonusXp);
    sim.recordQuestProgress('unlock_zone', zoneId, 1);
    sim.audio.playLevelUp();

    const cx = (z.x1 + z.x2) * 0.5;
    const cy = (z.y1 + z.y2) * 0.5;
    sim.spawnFloatingText(cx, cy, `✨ Đã mở ${z.name}! +${bonusXp} ⭐`, '#fbbf24');
    sim.onToast?.(`Sương mù tan biến! Chào mừng tới ${z.name}!`, '🗺️');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: `Đã mở khóa ${z.name}!` };
}

export function worldBridgeZoneWithCobblePath(sim: ParkSimulation, zoneId: ZoneId): void {
    const z = getZoneById(zoneId);
    let bestPair: { px: number; py: number; zx: number; zy: number; dist: number } | null = null;
    for (const pk of sim.connectedPathTiles) {
      const [px, py] = pk.split(',').map(Number);
      for (let zy = z.y1; zy <= z.y2; zy++) {
        for (let zx = z.x1; zx <= z.x2; zx++) {
          const cell = sim.grid[zy]?.[zx];
          if (!cell || cell.buildingUid || cell.coasterTrack) continue;
          const dist = Math.abs(zx - px) + Math.abs(zy - py);
          if (dist >= 1 && dist <= 5 && (!bestPair || dist < bestPair.dist)) {
            bestPair = { px, py, zx, zy, dist };
          }
        }
      }
    }
    if (!bestPair) return;
    let cx = bestPair.px;
    let cy = bestPair.py;
    const unlockedSet = new Set(sim.state.unlockedZones);
    while (cx !== bestPair.zx || cy !== bestPair.zy) {
      if (cx !== bestPair.zx) cx += bestPair.zx > cx ? 1 : -1;
      else cy += bestPair.zy > cy ? 1 : -1;
      const cell = sim.grid[cy]?.[cx];
      if (!cell || (!sim.state.sandboxMode && !unlockedSet.has(cell.zoneId))) break;
      if (!cell.buildingUid && !cell.coasterTrack && cell.path === 'none') {
        cell.path = 'cobble';
        sim.state.tileOverrides[`${cx},${cy}`] = {
          ...sim.state.tileOverrides[`${cx},${cy}`],
          path: 'cobble',
        };
      }
    }
    worldRecomputeAllCoastersAndBiomes(sim, );
}

export function worldFindSmartSpotForStoryBuilding(sim: ParkSimulation, item: CatalogItem): { gx: number; gy: number } | null {
    const unlockedSet = new Set(sim.state.unlockedZones);
    const { bw, bh } = worldGetBuildingFootprint(sim, item, 0);

    // Find synergy partner coordinates if already built
    const partnerCenters: Array<{ gx: number; gy: number; maxRadius: number }> = [];
    for (const syn of DISTRICT_SYNERGIES) {
      if (!syn.requiredItems.includes(item.id)) continue;
      const otherId = syn.requiredItems.find((id) => id !== item.id);
      if (!otherId) continue;
      for (const b of sim.state.buildings) {
        if (b.itemId === otherId) {
          partnerCenters.push({ gx: b.gx, gy: b.gy, maxRadius: syn.maxRadius });
        }
      }
    }

    let best: { gx: number; gy: number; score: number; roadAnchor?: [number, number] } | null = null;

    for (let gy = 0; gy <= GRID_SIZE - bh; gy++) {
      for (let gx = 0; gx <= GRID_SIZE - bw; gx++) {
        // Check footprint cells are unlocked, empty, flat, and not overwriting existing paths
        const baseElev = sim.grid[gy][gx].elevation;
        let footprintOk = true;
        for (let dy = 0; dy < bh && footprintOk; dy++) {
          for (let dx = 0; dx < bw; dx++) {
            const c = sim.grid[gy + dy][gx + dx];
            if (!c || (!sim.state.sandboxMode && !unlockedSet.has(c.zoneId))) {
              footprintOk = false;
              break;
            }
            if (
              c.buildingUid ||
              c.coasterTrack ||
              c.zooFence ||
              (c.path !== 'none' && !item.isBench) ||
              c.elevation !== baseElev ||
              (c.terrain === 'water' && item.id !== 'black_lake_boats')
            ) {
              footprintOk = false;
              break;
            }
          }
        }
        if (!footprintOk) continue;

        // Check orthogonal adjacency or short 1..3 tile bridge to connectedPathTiles
        let touchingRoad = false;
        let nearestRoad: [number, number] | undefined;
        let nearestRoadDist = 999;

        for (let dy = -1; dy <= bh; dy++) {
          for (let dx = -1; dx <= bw; dx++) {
            const isCorner = (dx === -1 || dx === bw) && (dy === -1 || dy === bh);
            if (isCorner) continue;
            const isInside = dx >= 0 && dx < bw && dy >= 0 && dy < bh;
            if (isInside) continue;
            const nx = gx + dx;
            const ny = gy + dy;
            if (sim.connectedPathTiles.has(`${nx},${ny}`)) {
              touchingRoad = true;
            }
          }
        }

        if (!touchingRoad) {
          for (const pk of sim.connectedPathTiles) {
            const [px, py] = pk.split(',').map(Number);
            const clX = Math.max(gx, Math.min(gx + bw - 1, px));
            const clY = Math.max(gy, Math.min(gy + bh - 1, py));
            const d = Math.abs(px - clX) + Math.abs(py - clY);
            if (d < nearestRoadDist) {
              nearestRoadDist = d;
              nearestRoad = [px, py];
            }
          }
        }

        if (!touchingRoad && nearestRoadDist > 4) continue;

        let score = touchingRoad ? 1000 : 500 - nearestRoadDist * 60;
        for (const p of partnerCenters) {
          const dist = Math.hypot(gx - p.gx, gy - p.gy);
          if (dist <= p.maxRadius) score += 380;
        }
        // Prefer staying cozy near park roads rather than edge corners
        score -= Math.hypot(gx - 12, gy - 17) * 2;

        if (!best || score > best.score) {
          best = { gx, gy, score, roadAnchor: touchingRoad ? undefined : nearestRoad };
        }
      }
    }

    if (!best) return null;

    // Auto-lay short cobble connector if building is 2-4 tiles off an existing connected road
    if (best.roadAnchor) {
      let [rx, ry] = best.roadAnchor;
      const goalX = best.gx;
      const goalY = best.gy + bh < GRID_SIZE ? best.gy + bh : Math.max(0, best.gy - 1);
      let guard = 0;
      while ((rx !== goalX || ry !== goalY) && guard++ < 8) {
        if (rx !== goalX) rx += goalX > rx ? 1 : -1;
        else ry += goalY > ry ? 1 : -1;
        const c = sim.grid[ry]?.[rx];
        if (!c || (!sim.state.sandboxMode && !unlockedSet.has(c.zoneId))) break;
        if (!c.buildingUid && !c.coasterTrack && c.path === 'none') {
          c.path = 'cobble';
          sim.state.tileOverrides[`${rx},${ry}`] = {
            ...sim.state.tileOverrides[`${rx},${ry}`],
            path: 'cobble',
          };
        }
      }
      worldRecomputeAllCoastersAndBiomes(sim, );
    }

    return { gx: best.gx, gy: best.gy };
}

export function worldRemoveAtTile(sim: ParkSimulation, gx: number, gy: number): boolean {
    if (sim.isVisitingNeighbor) {
      sim.onToast?.('Chế độ Khách Tham Quan — không thể ủi/dọn vườn bạn bè!', '🛡️');
      return false;
    }
    if (gx < 0 || gy < 0 || gx >= GRID_SIZE || gy >= GRID_SIZE) return false;
    const cell = sim.grid[gy][gx];
    const key = `${gx},${gy}`;

    if (cell.hasLitter) {
      cell.hasLitter = false;
      sim.stateRevision++;
      if (sim.state.tileOverrides[key]) {
        sim.state.tileOverrides[key].hasLitter = false;
      }
      sim.addXp(4);
      sim.audio.playSpell();
      sim.spawnFloatingText(gx, gy, 'Scourgify! +4 ⭐', '#67e8f9');
      sim.onUiChange?.();
      return true;
    }

    if (cell.coasterTrack) {
      cell.coasterTrack = false;
      if (sim.state.tileOverrides[key]) {
        sim.state.tileOverrides[key].coasterTrack = false;
      }
      if (!sim.state.sandboxMode) sim.state.galleons += 8;
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.audio.playPlace();
      sim.spawnFloatingText(gx, gy, 'Tháo ray +8 🪙', '#fcd34d');
      sim.onUiChange?.();
      return true;
    }

    if (cell.zooFence) {
      cell.zooFence = false;
      if (sim.state.tileOverrides[key]) {
        sim.state.tileOverrides[key].zooFence = false;
      }
      if (!sim.state.sandboxMode) sim.state.galleons += 5;
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.audio.playPlace();
      sim.onUiChange?.();
      return true;
    }

    if (cell.buildingUid) {
      const idx = sim.state.buildings.findIndex((b) => b.uid === cell.buildingUid);
      if (idx === -1) return false;
      const b = sim.state.buildings[idx];
      if (b.isIndestructible) {
        sim.onToast?.('Nhà Hang Sóc 6 Tầng là tổ ấm trung tâm của gia đình Weasley!', '🏠');
        return false;
      }
      const item = getCatalogItem(b.itemId);
      let refund = 0;
      let starRefund = 0;
      if (!b.builtInSandbox) {
        if (item) {
          const sameItemCount = sim.state.buildings.filter((x) => x.itemId === b.itemId).length;
          const baseStars =
            item.connectableGroup && sameItemCount > 1 ? 0 : getItemPuzzleStarCost(item);
          let totalGoldInvested = baseStars > 0 ? 0 : item.cost;
          let totalStarsInvested = baseStars;
          for (let s = 1; s < b.stars; s++) {
            totalGoldInvested += getUpgradeCost(item, s);
            totalStarsInvested += getUpgradePuzzleStarCost(s, item);
          }
          refund = Math.round(totalGoldInvested * 0.65);
          starRefund = totalStarsInvested;
        } else {
          refund = 15;
        }
      }
      sim.state.buildings.splice(idx, 1);
      sim.rideQueues.delete(b.uid);
      sim.escapedCreatures = sim.escapedCreatures.filter((e) => e.buildingUid !== b.uid);
      if (sim.state.suitcase?.activeIncubation?.habitatUid === b.uid) {
        sim.state.suitcase.activeIncubation = null;
      }
      if (sim.state.suitcase?.activeExpedition?.habitatUid === b.uid) {
        sim.state.suitcase.activeExpedition = null;
      }
      if (!sim.state.sandboxMode && !b.builtInSandbox) {
        sim.state.galleons += refund;
        if (starRefund > 0 && sim.state.match3) {
          sim.state.match3.stars += starRefund;
        }
      }
      worldRebuildGrid(sim, );
      sim.audio.playPlace();
      sim.spawnFloatingText(
        gx,
        gy,
        b.builtInSandbox
          ? 'Đã dọn công trình Sandbox'
          : starRefund > 0 && refund > 0
            ? `Hoàn +${starRefund} 🌟 +${refund} 🪙`
            : starRefund > 0
              ? `Hoàn +${starRefund} 🌟 Sao`
              : `Hoàn +${refund} 🪙`,
        '#fcd34d'
      );
      sim.saveToStorage();
      sim.onUiChange?.();
      return true;
    }

    if (cell.path !== 'none') {
      cell.path = 'none';
      if (sim.state.tileOverrides[key]) {
        sim.state.tileOverrides[key].path = 'none';
      }
      if (!sim.state.sandboxMode) sim.state.galleons += 3;
      worldRecomputeAllCoastersAndBiomes(sim, );
      sim.audio.playPlace();
      sim.onUiChange?.();
      return true;
    }

    return false;
}
