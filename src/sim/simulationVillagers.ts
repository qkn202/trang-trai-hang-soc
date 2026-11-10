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

export function villagersHireStaff(sim: ParkSimulation, role: keyof GameState['staffHired']): boolean {
    if (sim.state.staffHired[role] >= MAX_STAFF_PER_ROLE) {
      sim.onToast?.(`Đã tuyển tối đa ${MAX_STAFF_PER_ROLE}/${MAX_STAFF_PER_ROLE} nhân sự cho vị trí này!`, '🧙');
      return false;
    }
    const costs: Record<keyof GameState['staffHired'], number> = {
      caretaker: 90,
      artificer: 140,
      magizoologist: 220,
      auror: 320,
      house_elf: 480,
    };
    const cost = costs[role] * (1 + sim.state.staffHired[role]);
    if (!sim.state.sandboxMode && sim.state.galleons < cost) {
      sim.onToast?.(`Cần ${cost} Galleon để tuyển thêm nhân sự này!`, '🧙');
      return false;
    }
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= cost;
      sim.state.finance.staffWagesPaid += Math.round(cost * 0.25);
    }
    sim.state.staffHired[role] += 1;
    villagersSyncStaffEntities(sim);
    sim.audio.playSpell();
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function villagersGetHourlyStaffWage(sim: ParkSimulation): number {
    const s = sim.state.staffHired;
    return s.caretaker * 4 + s.artificer * 6 + s.magizoologist * 9 + s.auror * 12 + s.house_elf * 3;
}

export function villagersSyncStaffEntities(sim: ParkSimulation): void {
    if (sim.isVisitingNeighbor) {
      sim.staff = [];
      return;
    }
    const roles: Array<{ role: StaffEntity['role']; label: string; count: number; maxCap: number }> = [
      { role: 'caretaker', label: 'Lao Công Phép Thuật', count: sim.state.staffHired.caretaker, maxCap: MAX_STAFF_PER_ROLE },
      { role: 'artificer', label: 'Phù Thủy Bảo Trì', count: sim.state.staffHired.artificer, maxCap: MAX_STAFF_PER_ROLE },
      { role: 'magizoologist', label: 'Nhà Sinh Vật Học', count: sim.state.staffHired.magizoologist, maxCap: MAX_STAFF_PER_ROLE },
      { role: 'auror', label: 'Thần Sáng Bảo An', count: sim.state.staffHired.auror, maxCap: MAX_STAFF_PER_ROLE },
      {
        role: 'house_elf',
        label: 'Gia Tinh Tình Nguyện',
        count:
          sim.state.staffHired.house_elf +
          sim.state.buildings.filter((b) => b.itemId === 'owlery_elf_hut').length,
        maxCap: MAX_STAFF_PER_ROLE + 4,
      },
    ];

    const nextStaff: StaffEntity[] = [];
    for (const r of roles) {
      for (let i = 0; i < Math.min(r.count, r.maxCap); i++) {
        const sid = `${r.role}_${i}`;
        const patrolZoneId = sim.state.staffPatrolZones?.[sid] ?? 'all';
        const existing = sim.staff.find((s) => s.id === sid);
        if (existing) {
          existing.patrolZoneId = patrolZoneId;
          nextStaff.push(existing);
        } else {
          const isMolly = r.role === 'caretaker' && i === 0;
          const isArthur = r.role === 'artificer' && i === 0;
          const isHagrid = r.role === 'magizoologist' && i === 0;
          nextStaff.push({
            id: sid,
            role: r.role,
            name: isMolly
              ? 'Bà Molly Weasley'
              : isArthur
                ? 'Ông Arthur Weasley'
                : isHagrid
                  ? 'Bác Rubeus Hagrid'
                  : `${r.label} #${i + 1}`,
            gx: isMolly ? 13.4 : isArthur ? 14.6 : isHagrid ? 23.4 : 13 + (i % 3),
            gy: isMolly ? 23.5 : isArthur ? 22.9 : isHagrid ? 18.2 : 22,
            targetGx: isMolly ? 13.4 : isArthur ? 14.6 : isHagrid ? 23.4 : 14,
            targetGy: isMolly ? 23.5 : isArthur ? 22.9 : isHagrid ? 18.2 : 22,
            facing: isHagrid ? 'sw' : 'se',
            actionText: isMolly
              ? 'Đang nướng bánh táo & đan áo len'
              : isArthur
                ? 'Đang tinh chỉnh chiếc Ford Anglia'
                : isHagrid
                  ? 'Đang chăm vườn thảo dược & bí ngô'
                  : 'Đang tuần tra trang trại',
            busyTimer: 1.5,
            patrolZoneId,
            patrolCenter: isMolly
              ? { gx: 13.4, gy: 23.5, radius: 0.35 }
              : isArthur
                ? { gx: 14.6, gy: 22.9, radius: 0.35 }
                : isHagrid
                  ? { gx: 23.4, gy: 18.2, radius: 0.38 }
                  : undefined,
          });
        }
      }
    }
    const ronZoneId = sim.state.staffPatrolZones?.['ron_gnome_burrow'] ?? 'all';
    const existingRon = sim.staff.find((s) => s.id === 'ron_gnome_burrow');
    if (existingRon) {
      existingRon.patrolZoneId = ronZoneId;
      nextStaff.push(existingRon);
    } else {
      nextStaff.push({
        id: 'ron_gnome_burrow',
        role: 'caretaker',
        name: 'Ron Weasley',
        gx: 17.1,
        gy: 23.8,
        targetGx: 17.5,
        targetGy: 23.5,
        facing: 'se',
        actionText: 'Đang chăm sóc vườn bí ngô & đàn gà Hang Sóc',
        busyTimer: 1.5,
        patrolZoneId: ronZoneId,
        patrolCenter: { gx: 17.2, gy: 23.7, radius: 0.45 },
      });
    }

    sim.staff = nextStaff;
}

export function villagersSetStaffPatrolZone(sim: ParkSimulation, staffId: string, zone: ZoneId | 'all'): void {
    sim.state.staffPatrolZones[staffId] = zone;
    const st = sim.staff.find((s) => s.id === staffId);
    if (st) st.patrolZoneId = zone;
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function villagersRepairBuilding(sim: ParkSimulation, uid: string, byStaffName?: string): boolean {
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b) return false;
    const it = getCatalogItem(b.itemId);
    b.durability = 100;
    b.isBrokenDown = false;
    b.breakdownReason = undefined;
    sim.state.stats.repairsDone = (sim.state.stats.repairsDone ?? 0) + 1;
    sim.addXp(10);
    sim.audio.playSpell();
    sim.spawnFloatingText(b.gx + 1, b.gy + 1, '🪄 Reparo! 100%', '#67e8f9');
    if (byStaffName) {
      sim.onToast?.(`🔧 ${byStaffName} vừa niệm Reparo sửa xong ${it?.name ?? 'trò chơi'}!`, '🪄');
    } else {
      sim.onToast?.(`🪄 Đã niệm Reparo khôi phục 100% độ bền cho ${it?.name ?? 'công trình'}!`, '✨');
    }
    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function villagersDropPickedEntity(sim: ParkSimulation, 
    kind: 'staff',
    id: string,
    gx: number,
    gy: number
  ): boolean {
    const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, gx));
    const clampedY = Math.max(0, Math.min(GRID_SIZE - 1, gy));
    if (kind === 'staff') {
      const s = sim.staff.find((x) => x.id === id);
      if (!s) return false;
      s.gx = clampedX + 0.5;
      s.gy = clampedY + 0.5;
      s.targetGx = clampedX + 0.5;
      s.targetGy = clampedY + 0.5;
      s.busyTimer = 0;

      // Context-sensitive instant RCT Pincer action!
      const cell = sim.grid[clampedY]?.[clampedX];
      if (s.role === 'caretaker') {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const c = sim.grid[clampedY + dy]?.[clampedX + dx];
            if (c?.hasLitter) {
              c.hasLitter = false;
              const k = `${clampedX + dx},${clampedY + dy}`;
              if (sim.state.tileOverrides[k]) sim.state.tileOverrides[k].hasLitter = false;
              s.actionText = 'Vừa dọn sạch vũng bùa lỗi tại điểm thả!';
            }
          }
        }
      } else if (s.role === 'artificer') {
        const nearRide = sim.state.buildings.find(
          (b) => (b.isBrokenDown || b.durability < 95) && Math.hypot(b.gx + 1 - clampedX, b.gy + 1 - clampedY) <= 3.5
        );
        if (nearRide) {
          villagersRepairBuilding(sim, nearRide.uid, s.name);
          s.actionText = 'Vừa sửa chữa ngay khi được gắp tới!';
        }
      } else if (s.role === 'auror' && sim.escapedCreatures.length > 0) {
        const nearEsc = sim.escapedCreatures.find(
          (e) => Math.hypot(e.gx - clampedX, e.gy - clampedY) <= 3.5
        );
        if (nearEsc) {
          sim.catchEscapedCreature(nearEsc.id);
          s.actionText = 'Vừa tóm gọn thú sổng chuồng!';
        }
      } else if (s.role === 'magizoologist') {
        const nearHab = sim.state.buildings.find(
          (b) =>
            getCatalogItem(b.itemId)?.isCreatureHabitat &&
            Math.hypot(b.gx + 1 - clampedX, b.gy + 1 - clampedY) <= 3.5
        );
        if (nearHab) {
          nearHab.creatureHunger = 100;
          nearHab.creatureHappiness = 100;
          s.actionText = 'Vừa bồi bổ thức ăn cho chuồng thú!';
        }
      } else if (s.role === 'house_elf' && cell?.buildingUid) {
        sim.harvestBuildingBubble(cell.buildingUid);
      }

      sim.audio.playPlace();
      sim.spawnFloatingText(clampedX + 0.5, clampedY + 0.5, `🤏 Đã thả ${s.name}!`, '#fde047');
      sim.onUiChange?.();
      return true;
    }
    return false;
}

export function villagersUpdateStaff(sim: ParkSimulation, dt: number, unlockedSet: Set<string>): void {
    const hasBackstageBoost = sim.state.buildings.some(
      (b) => Boolean(getCatalogItem(b.itemId)?.isBackstage) && Date.now() >= b.constructEndsAt
    );
    const staffSpeed = hasBackstageBoost ? 2.15 : 1.72;

    for (const s of sim.staff) {
      const patrolZone = sim.state.staffPatrolZones?.[s.id] ?? s.patrolZoneId ?? 'all';
      const inPatrol = (gx: number, gy: number): boolean =>
        patrolZone === 'all' ||
        getZoneAt(Math.max(0, Math.floor(gx)), Math.max(0, Math.floor(gy))).id === patrolZone;

      const dist = Math.hypot(s.targetGx - s.gx, s.targetGy - s.gy);
      if (dist > 0.15) {
        const dx = s.targetGx - s.gx;
        const dy = s.targetGy - s.gy;
        s.facing = s.patrolCenter ? s.facing : deltaToFacing(dx, dy, s.facing);
        const curSpd = s.patrolCenter ? 0.28 : staffSpeed;
        s.gx += (dx / dist) * curSpd * dt;
        s.gy += (dy / dist) * curSpd * dt;
        continue;
      }

      if (s.busyTimer > 0) {
        s.busyTimer -= dt;
        continue;
      }
      if (s.patrolCenter) {
        s.busyTimer = 3.2;
        s.targetGx = s.patrolCenter.gx + (Math.random() - 0.5) * s.patrolCenter.radius * 1.4;
        s.targetGy = s.patrolCenter.gy + (Math.random() - 0.5) * s.patrolCenter.radius * 1.4;
        continue;
      }
      s.busyTimer = 1.9;

      // 1. Auror: catch escaped creatures!
      if (s.role === 'auror' && sim.escapedCreatures.length > 0) {
        const targetEsc =
          sim.escapedCreatures.find((e) => inPatrol(e.gx, e.gy)) ?? sim.escapedCreatures[0];
        if (Math.hypot(targetEsc.gx - s.gx, targetEsc.gy - s.gy) < 1.9) {
          sim.catchEscapedCreature(targetEsc.id);
          s.actionText = 'Vừa bắt thú sổng chuồng!';
        } else {
          s.targetGx = targetEsc.gx;
          s.targetGy = targetEsc.gy;
          s.actionText = `Đang đuổi bắt ${targetEsc.name}!`;
        }
        continue;
      }

      // 2. Artificer: repair broken or worn contraptions!
      if (s.role === 'artificer') {
        const brokenList = sim.state.buildings.filter((b) => {
          const it = getCatalogItem(b.itemId);
          return (
            it?.category === 'ride' &&
            !it.isCoasterTrackPiece &&
            Date.now() >= b.constructEndsAt &&
            (b.isBrokenDown || (b.durability ?? 100) < 68)
          );
        });
        brokenList.sort((a, b) => Number(Boolean(b.isBrokenDown)) - Number(Boolean(a.isBrokenDown)) || a.durability - b.durability);
        const targetRide =
          brokenList.find((b) => inPatrol(b.gx, b.gy)) ?? brokenList[0];
        if (targetRide) {
          if (Math.hypot(targetRide.gx + 1 - s.gx, targetRide.gy + 1 - s.gy) < 2.5) {
            villagersRepairBuilding(sim, targetRide.uid, targetRide.isBrokenDown ? s.name : undefined);
            s.actionText = `Vừa niệm Reparo bảo trì ${getCatalogItem(targetRide.itemId)?.name ?? 'trò chơi'}!`;
          } else {
            s.targetGx = targetRide.gx + 1;
            s.targetGy = targetRide.gy + 1;
            s.actionText = `Đang chạy tới sửa ${getCatalogItem(targetRide.itemId)?.name ?? 'trò chơi'}!`;
          }
          continue;
        }
      }

      // 3. House Elf: auto-harvest bubbles!
      if (s.role === 'house_elf') {
        const readyB = sim.state.buildings.find(
          (b) => b.readyBubbles >= 2 && inPatrol(b.gx, b.gy)
        );
        if (readyB) {
          if (Math.hypot(readyB.gx - s.gx, readyB.gy - s.gy) < 2.5) {
            sim.harvestBuildingBubble(readyB.uid);
            s.actionText = 'Gia tinh vừa gom vàng giúp bạn!';
          } else {
            s.targetGx = readyB.gx;
            s.targetGy = readyB.gy;
            s.actionText = 'Chạy đi gom bong bóng vàng';
          }
          continue;
        }
      }

      // 4. Magizoologist: feed hungry creatures!
      if (s.role === 'magizoologist') {
        const hungry = sim.state.buildings.find(
          (b) => (b.creatureHunger ?? 100) < 65 && inPatrol(b.gx, b.gy)
        );
        if (hungry) {
          hungry.creatureHunger = 100;
          hungry.creatureHappiness = 100;
          s.targetGx = hungry.gx;
          s.targetGy = hungry.gy;
          s.actionText = 'Đang chăm sóc thú huyền bí';
          continue;
        }
      }

      // 5. Caretaker: clean litter in patrol zone!
      if (s.role === 'caretaker') {
        let cleaned = false;
        for (let y = 0; y < GRID_SIZE && !cleaned; y++) {
          for (let x = 0; x < GRID_SIZE && !cleaned; x++) {
            if (sim.grid[y][x].hasLitter && inPatrol(x, y)) {
              sim.grid[y][x].hasLitter = false;
              const k = `${x},${y}`;
              if (sim.state.tileOverrides[k]) sim.state.tileOverrides[k].hasLitter = false;
              s.targetGx = x;
              s.targetGy = y;
              s.actionText = 'Vừa hóa giải vũng bùa chú lỗi';
              cleaned = true;
            }
          }
        }
        if (cleaned) continue;
      }

      // Patrol within assigned zone if set!
      if (patrolZone !== 'all') {
        const z = getZoneById(patrolZone);
        s.targetGx = z.x1 + 1 + Math.floor(Math.random() * Math.max(1, z.x2 - z.x1 - 1));
        s.targetGy = z.y1 + 1 + Math.floor(Math.random() * Math.max(1, z.y2 - z.y1 - 1));
        s.actionText = `Tuần tra vùng ${z.name}`;
        continue;
      }

      const spot = getRandomUnlockedPathTile(sim.grid, unlockedSet);
      if (spot) {
        s.targetGx = spot.gx;
        s.targetGy = spot.gy;
      }
    }
}

export function villagersEnsureTutorialState(sim: ParkSimulation): TutorialState {
    if (!sim.state.tutorial) {
      sim.state.tutorial = createInitialTutorialState(true);
    }
    return sim.state.tutorial;
}

export function villagersIsTutorialActive(sim: ParkSimulation): boolean {
    if (sim.isHeadmasterPreview || sim.isVisitingNeighbor) return false;
    const tut = sim.state.tutorial;
    return Boolean(tut && tut.active && !tut.skipped && tut.stepId !== 'completed');
}

export function villagersGetCurrentTutorialStep(sim: ParkSimulation): TutorialStepDef | null {
    if (!villagersIsTutorialActive(sim)) return null;
    const tut = villagersEnsureTutorialState(sim);
    return TUTORIAL_STEPS[tut.stepIndex] ?? null;
}

export function villagersGetTutorialWorldTarget(sim: ParkSimulation): {
    uid: string;
    gx: number;
    gy: number;
    bw: number;
    bh: number;
    label: string;
  } | null {
    const step = villagersGetCurrentTutorialStep(sim);
    if (!step) return null;
    const now = Date.now();

    if (step.id === 'harvest_wheat') {
      const ripePlot =
        sim.state.buildings.find(
          (b) =>
            b.uid === 'burrow_plot_wheat' &&
            getCatalogItem(b.itemId)?.isFarmlandPlot &&
            b.cropId &&
            b.cropReadyAt &&
            now >= b.cropReadyAt
        ) ??
        sim.state.buildings.find(
          (b) =>
            getCatalogItem(b.itemId)?.isFarmlandPlot &&
            b.cropId &&
            b.cropReadyAt &&
            now >= b.cropReadyAt
        ) ??
        sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot && Boolean(b.cropId));
      if (!ripePlot) return null;
      const item = getCatalogItem(ripePlot.itemId)!;
      const { bw, bh } = sim.getBuildingFootprint(item, ripePlot.rotation);
      return {
        uid: ripePlot.uid,
        gx: ripePlot.gx,
        gy: ripePlot.gy,
        bw,
        bh,
        label:
          ripePlot.cropReadyAt && now >= ripePlot.cropReadyAt
            ? '👆 Nhấp gặt Lúa Mì!'
            : '💧 Chờ chín & thu hoạch!',
      };
    }

    if (step.id === 'sow_and_merge_plot') {
      const emptyPlot =
        sim.state.buildings.find(
          (b) =>
            b.uid === 'burrow_plot_empty' &&
            getCatalogItem(b.itemId)?.isFarmlandPlot &&
            !b.cropId
        ) ??
        sim.state.buildings.find(
          (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && !b.cropId
        );
      if (!emptyPlot) return null;
      const item = getCatalogItem(emptyPlot.itemId)!;
      const { bw, bh } = sim.getBuildingFootprint(item, emptyPlot.rotation);
      return {
        uid: emptyPlot.uid,
        gx: emptyPlot.gx,
        gy: emptyPlot.gy,
        bw,
        bh,
        label: '🌱 Gieo hạt vào ô này!',
      };
    }

    if (step.id === 'pasture_harvest_and_stock') {
      const readyPasture = sim.state.buildings.find(
        (b) =>
          getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt
      );
      if (readyPasture && !sim.state.tutorial?.pastureHarvestedInStep3) {
        const item = getCatalogItem(readyPasture.itemId)!;
        const { bw, bh } = sim.getBuildingFootprint(item, readyPasture.rotation);
        return {
          uid: readyPasture.uid,
          gx: readyPasture.gx,
          gy: readyPasture.gy,
          bw,
          bh,
          label: '👆 Thu hoạch Trứng Gà!',
        };
      }
      const emptyPasture =
        sim.state.buildings.find(
          (b) =>
            b.uid === 'burrow_pasture_empty' &&
            getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
            !b.pastureAnimalId
        ) ??
        sim.state.buildings.find(
          (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot && !b.pastureAnimalId
        );
      if (!emptyPasture) return null;
      const item = getCatalogItem(emptyPasture.itemId)!;
      const { bw, bh } = sim.getBuildingFootprint(item, emptyPasture.rotation);
      return {
        uid: emptyPasture.uid,
        gx: emptyPasture.gx,
        gy: emptyPasture.gy,
        bw,
        bh,
        label: '🐾 Thả thú vào Đồng Cỏ!',
      };
    }

    return null;
}

export function villagersAdvanceTutorialStep(sim: ParkSimulation, expectedStepId?: TutorialStepId): boolean {
    if (!villagersIsTutorialActive(sim)) return false;
    const tut = villagersEnsureTutorialState(sim);
    const curStep = TUTORIAL_STEPS[tut.stepIndex];
    if (!curStep) return false;
    if (expectedStepId && curStep.id !== expectedStepId) return false;

    const alreadyClaimed = tut.claimedSteps.includes(curStep.index);
    if (!alreadyClaimed) {
      tut.claimedSteps.push(curStep.index);
      if (curStep.rewardGalleons > 0) {
        sim.state.galleons += curStep.rewardGalleons;
        sim.state.finance.harvestRevenue += curStep.rewardGalleons;
        sim.onRewardFly?.('galleons', curStep.rewardGalleons);
      }
      if (curStep.rewardXp > 0) {
        sim.addXp(curStep.rewardXp);
      }
      if (curStep.rewardStars && curStep.rewardStars > 0) {
        sim.state.match3.stars += curStep.rewardStars;
        sim.state.match3.totalStarsEarned += curStep.rewardStars;
        sim.onRewardFly?.('stars', curStep.rewardStars);
      }
      if (curStep.rewardTimeSand && curStep.rewardTimeSand > 0) {
        sim.state.timeSand += curStep.rewardTimeSand;
        sim.onRewardFly?.('sand', curStep.rewardTimeSand);
      }
      if (curStep.rewardTalismans && curStep.rewardTalismans > 0) {
        sim.grantPhoenixTalisman(curStep.rewardTalismans);
      }
      if (curStep.rewardSeedCropId && (curStep.rewardSeedQty ?? 0) > 0) {
        sim.addCropSeeds(curStep.rewardSeedCropId, curStep.rewardSeedQty!);
      }
      if (curStep.rewardGoodId && (curStep.rewardGoodQty ?? 0) > 0) {
        sim.addFarmItemToBarn(curStep.rewardGoodId, curStep.rewardGoodQty!);
      }
    }

    const nextIdx = tut.stepIndex + 1;
    if (nextIdx >= TUTORIAL_STEPS.length) {
      tut.stepIndex = TUTORIAL_STEPS.length;
      tut.stepId = 'completed';
      tut.active = false;
      tut.skipped = false;
      tut.completedAt = Date.now();
      sim.audio.playLevelUp();
      sim.launchFireworksShow(8);
      sim.onToast?.(
        alreadyClaimed
          ? '🎉 Bạn đã hoàn thành ôn tập Cẩm Nang Trang Trại Hang Sóc cùng Bà Molly!'
          : '🎉 Chúc mừng Tốt Nghiệp Tân Thủ Hang Sóc! Bà Molly tặng +150G, +2 🌟 Sao & +1 🔥 Bùa Phượng Hoàng!',
        '🥧'
      );
      sim.onTutorialStepChanged?.('completed');
    } else {
      const nextStep = TUTORIAL_STEPS[nextIdx];
      tut.stepIndex = nextIdx;
      tut.stepId = nextStep.id;
      if (nextStep.id === 'pasture_harvest_and_stock') {
        tut.pastureHarvestedInStep3 = false;
      }
      sim.audio.playMatchPop(2);
      if (!alreadyClaimed) {
        sim.onToast?.(
          `✨ Xong Bước ${curStep.index + 1}/6! Bà Molly thưởng ${curStep.rewardLabel}`,
          '🥧'
        );
      }
      sim.onTutorialStepChanged?.(nextStep.id);
    }

    sim.saveToStorage();
    sim.onUiChange?.();
    return true;
}

export function villagersSkipTutorial(sim: ParkSimulation): void {
    const tut = villagersEnsureTutorialState(sim);
    tut.active = false;
    tut.skipped = true;
    sim.audio.playClick();
    sim.onToast?.(
      '📖 Đã tạm ẩn hướng dẫn — bạn có thể mở lại bất cứ lúc nào trong ⚙️ Cài Đặt!',
      '📖'
    );
    sim.onTutorialStepChanged?.(tut.stepId);
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function villagersRestartTutorial(sim: ParkSimulation): void {
    if (sim.isHeadmasterPreview) {
      sim.toggleHeadmasterPreview(100);
    }
    if (sim.isVisitingNeighbor) {
      sim.exitNeighborVisit(true);
    }
    const tut = villagersEnsureTutorialState(sim);
    tut.active = true;
    tut.skipped = false;
    tut.stepIndex = 0;
    tut.stepId = TUTORIAL_STEPS[0].id;
    tut.pastureHarvestedInStep3 = false;

    // Ensure Step 1 always has at least one ripe farmland plot so replaying at any level never soft-locks!
    const now = Date.now();
    const hasRipePlot = sim.state.buildings.some(
      (b) =>
        getCatalogItem(b.itemId)?.isFarmlandPlot &&
        b.cropId &&
        b.cropReadyAt &&
        now >= b.cropReadyAt
    );
    if (!hasRipePlot) {
      const growingPlot = sim.state.buildings.find(
        (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && Boolean(b.cropId)
      );
      if (growingPlot) {
        growingPlot.cropReadyAt = now - 1000;
      } else {
        const emptyPlot = sim.state.buildings.find(
          (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && !b.cropId
        );
        if (emptyPlot) {
          emptyPlot.cropId = 'ottery_wheat';
          emptyPlot.cropPlantedAt = now - 30_000;
          emptyPlot.cropReadyAt = now - 1000;
          emptyPlot.cropWateredBoost = false;
        }
      }
    }

    sim.audio.playSpell();
    sim.onTutorialStepChanged?.(tut.stepId);
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function villagersCollectVillagerWalkSpots(sim: ParkSimulation): Array<{ gx: number; gy: number; isPoi: boolean }> {
    const unlockedSet = new Set(sim.state.unlockedZones);
    const spots: Array<{ gx: number; gy: number; isPoi: boolean }> = [];
    const seen = new Set<string>();

    const pushSpot = (gx: number, gy: number, isPoi: boolean): void => {
      if (gx < 1 || gy < 1 || gx >= GRID_SIZE - 1 || gy >= GRID_SIZE - 1) return;
      const cell = sim.grid[gy]?.[gx];
      if (!cell || !unlockedSet.has(cell.zoneId) || cell.terrain === 'water') return;
      if (cell.buildingUid) return;
      const k = `${gx},${gy}`;
      if (seen.has(k)) return;
      seen.add(k);
      spots.push({ gx: gx + 0.5, gy: gy + 0.5, isPoi });
    };

    // 1. Prefer connected cobblestone/dirt path tiles first
    for (let gy = 1; gy < GRID_SIZE - 1; gy++) {
      for (let gx = 1; gx < GRID_SIZE - 1; gx++) {
        const cell = sim.grid[gy]?.[gx];
        if (cell && cell.path !== 'none' && unlockedSet.has(cell.zoneId) && !cell.buildingUid) {
          pushSpot(gx, gy, false);
        }
      }
    }

    // 2. Also include cozy doorstep grass/courtyard spots right around active farmstead buildings & plots
    for (const b of sim.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it || it.category === 'decor' || it.isCoasterTrackPiece) continue;
      const { bw, bh } = sim.getBuildingFootprint(it, b.rotation);
      pushSpot(b.gx + Math.floor(bw * 0.5), b.gy + bh, true);
      pushSpot(b.gx - 1, b.gy + Math.floor(bh * 0.5), true);
      pushSpot(b.gx + bw, b.gy + Math.floor(bh * 0.5), true);
    }

    if (spots.length === 0) {
      pushSpot(16, 24, true);
      pushSpot(18, 27, true);
      pushSpot(14, 24, true);
    }
    return spots;
}

export function villagersSyncValleyVillagers(sim: ParkSimulation): void {
    const effLevel =
      sim.isHeadmasterPreview || sim.state.sandboxMode || sim.isVisitingNeighbor
        ? 100
        : Math.max(1, sim.state.level);
    const spots = villagersCollectVillagerWalkSpots(sim);
    const existingById = new Map<ValleyVillagerId, ValleyVillagerEntity>(
      sim.villagers.map((v) => [v.id, v])
    );

    const nextList: ValleyVillagerEntity[] = [];
    VALLEY_VILLAGER_PROFILES.forEach((prof, idx) => {
      if (prof.unlockLevel > effLevel) return;
      const prev = existingById.get(prof.id);
      if (prev) {
        const cell = sim.grid[Math.floor(prev.gy)]?.[Math.floor(prev.gx)];
        if (cell && cell.terrain !== 'water' && !cell.buildingUid) {
          nextList.push(prev);
          return;
        }
      }
      const startSpot = spots[(idx * 3) % spots.length] ?? { gx: 16.5 + idx, gy: 24.5, isPoi: true };
      const targetSpot = spots[(idx * 3 + 2) % spots.length] ?? startSpot;
      nextList.push({
        id: prof.id,
        nameVi: prof.nameVi,
        titleVi: prof.titleVi,
        idleSprite: prof.idleSprite,
        walkSprite: prof.walkSprite,
        gx: startSpot.gx,
        gy: startSpot.gy,
        targetGx: targetSpot.gx,
        targetGy: targetSpot.gy,
        facingLeft: targetSpot.gx < startSpot.gx,
        state: 'walking',
        pauseTimer: 0.8 + (idx % 3) * 0.7,
        speed: 0.88 + (idx % 3) * 0.06,
        moodBubble: prof.moodBubble,
        bubbleTimer: idx === 0 ? 3.8 : 0,
        greetCooldownSec: 0,
        favoriteItemIds: [...prof.favoriteItemIds],
        walkPhase: idx * 1.35,
      });
    });

    sim.villagers = nextList;
}

export function villagersUpdateValleyVillagers(sim: ParkSimulation, dt: number, unlockedSet: Set<string>): void {
    if (sim.villagers.length === 0) {
      villagersSyncValleyVillagers(sim);
    }
    let cachedSpots: Array<{ gx: number; gy: number; isPoi: boolean }> | null = null;

    for (let i = 0; i < sim.villagers.length; i++) {
      const v = sim.villagers[i];
      if (v.bubbleTimer > 0) {
        v.bubbleTimer = Math.max(0, v.bubbleTimer - dt);
      }
      if (v.greetCooldownSec > 0) {
        v.greetCooldownSec = Math.max(0, v.greetCooldownSec - dt);
      }

      const dx = v.targetGx - v.gx;
      const dy = v.targetGy - v.gy;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.12 && v.state === 'walking') {
        const isoScreenDx = dx - dy;
        if (Math.abs(isoScreenDx) > 0.04) {
          v.facingLeft = isoScreenDx < 0;
        }
        const step = Math.min(dist, v.speed * dt);
        const nx = v.gx + (dx / dist) * step;
        const ny = v.gy + (dy / dist) * step;
        const nextCell = sim.grid[Math.floor(ny)]?.[Math.floor(nx)];
        if (nextCell && nextCell.terrain !== 'water') {
          v.gx = nx;
          v.gy = ny;
          v.walkPhase = (v.walkPhase + dt * 6.4) % (Math.PI * 20);
        } else {
          v.state = 'admiring';
          v.pauseTimer = 0.6;
        }
        continue;
      }

      v.state = 'admiring';
      if (v.pauseTimer > 0) {
        v.pauseTimer -= dt;
        continue;
      }

      // Pick next cozy stroll destination along paths or building doorsteps!
      const curGx = Math.floor(v.gx);
      const curGy = Math.floor(v.gy);
      const curCell = sim.grid[curGy]?.[curGx];
      if (curCell && curCell.path !== 'none' && Math.random() < 0.72) {
        const adjPaths: Array<{ gx: number; gy: number }> = [];
        for (const [ox, oy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const ax = curGx + ox;
          const ay = curGy + oy;
          const ac = sim.grid[ay]?.[ax];
          if (ac && ac.path !== 'none' && unlockedSet.has(ac.zoneId) && !ac.buildingUid) {
            adjPaths.push({ gx: ax, gy: ay });
          }
        }
        if (adjPaths.length > 0) {
          const pickAdj = adjPaths[Math.floor(Math.random() * adjPaths.length)];
          v.targetGx = pickAdj.gx + 0.5;
          v.targetGy = pickAdj.gy + 0.5;
          v.state = 'walking';
          v.pauseTimer = 1.6 + ((i * 7) % 5) * 0.45;
          continue;
        }
      }

      if (!cachedSpots) {
        cachedSpots = villagersCollectVillagerWalkSpots(sim);
      }
      if (cachedSpots.length > 0) {
        const nearby = cachedSpots.filter(
          (s) => Math.hypot(s.gx - v.gx, s.gy - v.gy) >= 1.5 && Math.hypot(s.gx - v.gx, s.gy - v.gy) <= 9.5
        );
        const pool = nearby.length > 0 ? nearby : cachedSpots;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        v.targetGx = pick.gx;
        v.targetGy = pick.gy;
        v.state = 'walking';
        v.pauseTimer = pick.isPoi ? 2.8 + (i % 3) * 0.8 : 1.4;
        if (pick.isPoi && v.bubbleTimer <= 0 && Math.random() < 0.42) {
          v.bubbleTimer = 3.2;
        }
      } else {
        v.pauseTimer = 2.5;
      }
    }
}

export function villagersGreetVillager(sim: ParkSimulation, id: ValleyVillagerId): { ok: boolean; msg: string; bonusGalleons: number } {
    const v = sim.villagers.find((x) => x.id === id);
    const prof = VALLEY_VILLAGER_PROFILES.find((p) => p.id === id);
    if (!v || !prof) {
      return { ok: false, msg: 'Không tìm thấy cư dân thung lũng!', bonusGalleons: 0 };
    }

    const now = Date.now();
    const nextReadyAt = sim.villagerGreetCooldown.get(id) ?? 0;
    const canReward = now >= nextReadyAt && !sim.isVisitingNeighbor;
    const quote = prof.greetingsVi[Math.floor(now / 5000) % prof.greetingsVi.length];

    v.state = 'admiring';
    v.pauseTimer = 3.6;
    v.moodBubble = prof.moodBubble;
    v.bubbleTimer = 4.8;

    let bonusGalleons = 0;
    if (canReward) {
      sim.villagerGreetCooldown.set(id, now + 45_000);
      v.greetCooldownSec = 45;
      bonusGalleons = 2;
      sim.state.galleons += bonusGalleons;
      sim.state.finance.harvestRevenue += bonusGalleons;
      sim.addXp(4);
      sim.addHarvestFeastPoints(3);
      sim.recordQuestProgress('cast_spells', undefined, 1);
      sim.audio.playHarvestBubble();
      sim.onRewardFly?.('galleons', bonusGalleons, v.gx, v.gy);
      sim.spawnFloatingText(v.gx, v.gy, `${prof.moodBubble} +${bonusGalleons}G +4⭐`, '#fde047');
    } else {
      sim.audio.playClick();
      sim.spawnFloatingText(v.gx, v.gy, `${prof.moodBubble} ${prof.nameVi}`, '#fef08a');
    }

    const msg = canReward
      ? `${prof.moodBubble} ${prof.nameVi}: "${quote}" (+${bonusGalleons}G, +4 ⭐, +3 🍁)`
      : `${prof.moodBubble} ${prof.nameVi}: "${quote}"`;
    sim.onToast?.(msg, prof.moodBubble);
    if (canReward) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
    return { ok: true, msg, bonusGalleons };
}
