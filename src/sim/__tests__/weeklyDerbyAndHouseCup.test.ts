import { afterEach, describe, expect, it } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { extractFarmDerbySyncPayload } from '../../hpvn/bridge';
import {
  applyHouseCup,
  computeDerbyDisciplineHouseTotals,
  computeDisciplineBracketTotals,
  computeF2AllianceStandingsFromDisciplines,
  computeF2HouseTotals,
  getHouseCupWeeklyCycle,
  getWeeklyHouseAlliances,
  HOUSE_CUP_ALL_DISCIPLINE_ORDER,
  HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS,
  HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS,
  HOUSE_CUP_DISCIPLINE_ORDER,
  houseCupDisciplineSummaries,
  resetHouseCupViewForTest,
} from '../../hpvn/houseCup';
import type { HouseName } from '../../types/game';
import { ParkSimulation } from '../simulation';
import { migrateLoadedState } from '../simulationData';
import {
  DERBY_BONUS_SLOT_SAND_COST,
  DERBY_INSTANT_RESTORE_SAND_COST,
  DERBY_MILESTONES,
  DERBY_TRASH_COOLDOWN_MS,
  MAX_WEEKLY_DERBY_BONUS_TASKS,
  MAX_WEEKLY_DERBY_SCORE,
  MAX_WEEKLY_DERBY_TASKS,
  WEEKLY_DERBY_BOARD_SLOTS,
} from '../weeklyDerbyEngine';

function createFreshSim(): ParkSimulation {
  const sim = new ParkSimulation(new MagicalAudio());
  sim.state.sandboxMode = false;
  sim.state.galleons = 3000;
  sim.state.timeSand = 10;
  sim.state.herbalCompost = 0;
  sim.state.morningDewPhials = 0;
  sim.state.phoenixTalismans = 0;
  sim.state.match3.stars = 10;
  return sim;
}

describe('Weekly House Derby & 7-Discipline House Cup Integration', () => {
  afterEach(() => {
    resetHouseCupViewForTest();
  });

  describe('1. Weekly Derby Board Generation, Week Rollover & Save Migration', () => {
    it('generates 8 slots (6 farm + 2 Hybrid Combo tasks at 290-320 pts) and resets cleanly on Friday 17:00 VN week rollover', () => {
      const sim = createFreshSim();
      // Saturday 2026-11-21 17:00 VN (inside Week 48 cycle)
      const week1Ms = Date.UTC(2026, 10, 21, 10, 0, 0);
      // Saturday 2026-11-28 17:00 VN (next weekly cycle after Friday 17:00 VN rollover)
      const week2Ms = Date.UTC(2026, 10, 28, 10, 0, 0);

      const cycle1 = getHouseCupWeeklyCycle(week1Ms);
      const cycle2 = getHouseCupWeeklyCycle(week2Ms);
      expect(cycle2.weekKey).not.toBe(cycle1.weekKey);

      const derby1 = sim.ensureWeeklyDerby(week1Ms);
      expect(derby1.weekKey).toBe(cycle1.weekKey);
      expect(derby1.boardTasks).toHaveLength(WEEKLY_DERBY_BOARD_SLOTS);

      const hybridTasks = derby1.boardTasks.filter((t) => t.isHybridCombo);
      const farmTasks = derby1.boardTasks.filter((t) => !t.isHybridCombo);
      expect(farmTasks).toHaveLength(6);
      expect(hybridTasks).toHaveLength(2);
      for (const h of hybridTasks) {
        expect(h.points).toBeGreaterThanOrEqual(290);
        expect(h.points).toBeLessThanOrEqual(320);
        expect(h.objectives.length).toBeGreaterThanOrEqual(2);
      }

      // Mutate progress during Week 1
      derby1.points = 620;
      derby1.tasksCompleted = 3;
      derby1.bonusSlotUnlocked = true;
      derby1.claimedMilestones = [1, 2];
      expect(sim.acceptWeeklyDerbyTask(derby1.boardTasks[0].id, week1Ms).ok).toBe(true);
      expect(derby1.activeTask).not.toBeNull();

      // Rollover into Week 2 resets all weekly counters, milestones & active task cleanly
      const derby2 = sim.ensureWeeklyDerby(week2Ms);
      expect(derby2.weekKey).toBe(cycle2.weekKey);
      expect(derby2.points).toBe(0);
      expect(derby2.tasksCompleted).toBe(0);
      expect(derby2.bonusSlotUnlocked).toBe(false);
      expect(derby2.claimedMilestones).toEqual([]);
      expect(derby2.activeTask).toBeNull();
      expect(derby2.boardTasks).toHaveLength(WEEKLY_DERBY_BOARD_SLOTS);
    });

    it('persists weeklyDerby across save/load migration and clamps tampered values', () => {
      const sim = createFreshSim();
      const now = Date.UTC(2026, 10, 21, 10, 0, 0);
      const derby = sim.ensureWeeklyDerby(now);
      derby.points = 980;
      derby.tasksCompleted = 4;
      derby.bonusSlotUnlocked = false;
      derby.claimedMilestones = [1, 2, 3];
      expect(sim.acceptWeeklyDerbyTask(derby.boardTasks[6].id, now).ok).toBe(true);
      sim.recordWeeklyDerbyProgress('harvest_crop', 3, now);

      const migrated = migrateLoadedState(JSON.parse(JSON.stringify(sim.state)));
      expect(migrated.weeklyDerby).toBeDefined();
      expect(migrated.weeklyDerby!.weekKey).toBe(derby.weekKey);
      expect(migrated.weeklyDerby!.points).toBe(980);
      expect(migrated.weeklyDerby!.tasksCompleted).toBe(4);
      expect(migrated.weeklyDerby!.claimedMilestones).toEqual([1, 2, 3]);
      expect(migrated.weeklyDerby!.boardTasks).toHaveLength(8);
      expect(migrated.weeklyDerby!.activeTask).not.toBeNull();
      expect(migrated.weeklyDerby!.activeTask!.objectives[0].progress).toBe(3);

      // Tampered payload gets clamped to anti-cheat bounds
      const tampered = JSON.parse(JSON.stringify(sim.state));
      tampered.weeklyDerby.points = 99999;
      tampered.weeklyDerby.tasksCompleted = 42;
      tampered.weeklyDerby.bonusSlotUnlocked = false;
      const sanitized = migrateLoadedState(tampered);
      expect(sanitized.weeklyDerby!.points).toBe(MAX_WEEKLY_DERBY_SCORE);
      expect(sanitized.weeklyDerby!.tasksCompleted).toBe(MAX_WEEKLY_DERBY_TASKS);
    });
  });

  describe('2. Gameplay Event Hooks — Pure Farm Tasks & Hybrid Farm+Minigame Combo Tasks', () => {
    it('tracks and completes pure farm tasks via real harvestCropPlot, fulfillFarmOwlOrder, acceptFarmVisitorOffer & workshop completion', () => {
      const sim = createFreshSim();
      const now = Date.now();
      const derby = sim.ensureWeeklyDerby(now);

      // 2a. harvest_crop via real sim.harvestCropPlot
      const cropTask = derby.boardTasks.find((t) =>
        t.objectives.every((o) => o.eventKind === 'harvest_crop')
      )!;
      expect(cropTask).toBeDefined();
      expect(sim.acceptWeeklyDerbyTask(cropTask.id, now).ok).toBe(true);
      derby.activeTask!.objectives[0].target = 2; // fast 2-harvest check

      const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
      for (let i = 0; i < 2; i++) {
        plot.constructEndsAt = 0;
        plot.cropId = 'ottery_wheat';
        plot.cropPlantedAt = now - 60_000;
        plot.cropReadyAt = now - 1_000;
        expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
      }
      expect(derby.activeTask!.objectives[0].progress).toBe(2);
      expect(derby.activeTask!.completedAt).toBeDefined();
      const submitCrop = sim.completeWeeklyDerbyActiveTask(now);
      expect(submitCrop.ok).toBe(true);
      expect(submitCrop.pointsEarned).toBe(cropTask.points);
      expect(derby.tasksCompleted).toBe(1);

      // 2b. owl_order via real sim.fulfillFarmOwlOrder
      const owlTask = derby.boardTasks.find((t) =>
        t.objectives.every((o) => o.eventKind === 'owl_order')
      )!;
      expect(sim.acceptWeeklyDerbyTask(owlTask.id, now).ok).toBe(true);
      derby.activeTask!.objectives[0].target = 1;
      const barn = sim.ensureFarmBarn();
      const order = barn.owlOrders[0];
      for (const req of order.requirements) {
        sim.addFarmItemToBarn(req.itemId, req.qty + 2);
      }
      expect(sim.fulfillFarmOwlOrder(order.id).ok).toBe(true);
      expect(derby.activeTask!.objectives[0].progress).toBe(1);
      expect(sim.completeWeeklyDerbyActiveTask(now).ok).toBe(true);
      expect(derby.tasksCompleted).toBe(2);

      // 2c. visitor_sale via real sim.acceptFarmVisitorOffer
      const visTask = derby.boardTasks.find((t) =>
        t.objectives.every((o) => o.eventKind === 'visitor_sale')
      )!;
      expect(sim.acceptWeeklyDerbyTask(visTask.id, now).ok).toBe(true);
      derby.activeTask!.objectives[0].target = 1;
      const visitors = sim.getFarmVisitors(now);
      const vis = visitors[0];
      sim.addFarmItemToBarn(vis.itemId, vis.qty + 2);
      expect(sim.acceptFarmVisitorOffer(vis.id, now).ok).toBe(true);
      expect(derby.activeTask!.objectives[0].progress).toBe(1);
      expect(sim.completeWeeklyDerbyActiveTask(now).ok).toBe(true);
      expect(derby.tasksCompleted).toBe(3);

      // 2d. workshop_batch via real workshop queue completion tick
      const wsTask = derby.boardTasks.find((t) =>
        t.objectives.every((o) => o.eventKind === 'workshop_batch')
      )!;
      expect(sim.acceptWeeklyDerbyTask(wsTask.id, now).ok).toBe(true);
      derby.activeTask!.objectives[0].target = 1;
      const bakeryItem = getCatalogItem('molly_apple_bakery')!;
      sim.state.buildings.push({
        uid: 'ws_derby_test',
        itemId: bakeryItem.id,
        gx: 18,
        gy: 20,
        rotation: 0,
        stars: 1,
        placedAt: now - 60_000,
        constructEndsAt: 0,
        lastTickAt: now - 60_000,
        storedSickle: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        workshopQueue: [
          {
            goodId: 'cinnamon_apple_pie',
            startedAt: now - 120_000,
            endsAt: now - 1_000,
          },
        ],
      });
      sim.tickProductionToTimestamp(now, true, false);
      expect(derby.activeTask!.objectives[0].progress).toBe(1);
      expect(sim.completeWeeklyDerbyActiveTask(now).ok).toBe(true);
      expect(derby.tasksCompleted).toBe(4);
    });

    it('tracks and completes Hybrid Combo tasks (harvest_crop + minigame_win) and molly_supply hook', () => {
      const sim = createFreshSim();
      const now = Date.now();
      const derby = sim.ensureWeeklyDerby(now);

      // Slot 6 is always Hybrid Combo #1: harvest_crop + minigame_win
      const hybridTask = derby.boardTasks[6];
      expect(hybridTask.isHybridCombo).toBe(true);
      expect(hybridTask.objectives.some((o) => o.eventKind === 'harvest_crop')).toBe(true);
      expect(hybridTask.objectives.some((o) => o.eventKind === 'minigame_win')).toBe(true);

      expect(sim.acceptWeeklyDerbyTask(hybridTask.id, now).ok).toBe(true);
      for (const obj of derby.activeTask!.objectives) {
        obj.target = 1;
      }

      // 1) Harvest 1 crop -> partial progress (not complete yet)
      const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
      plot.constructEndsAt = 0;
      plot.cropId = 'ottery_wheat';
      plot.cropPlantedAt = now - 60_000;
      plot.cropReadyAt = now - 1_000;
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
      expect(sim.completeWeeklyDerbyActiveTask(now).ok).toBe(false);

      // 2) Win a Match-3 level -> completes the Hybrid Combo!
      sim.completeMatch3LevelVictory(5, { sessionScore: 1800, completedStage: 1 });
      expect(derby.activeTask!.completedAt).toBeDefined();
      const submitHybrid = sim.completeWeeklyDerbyActiveTask(now);
      expect(submitHybrid.ok).toBe(true);
      expect(submitHybrid.pointsEarned).toBe(hybridTask.points);
      expect(derby.points).toBe(hybridTask.points);

      // 3) Verify consumeMollySupplyKit wires molly_supply progress
      sim.addFarmItemToBarn('cinnamon_apple_pie', 3);
      derby.activeTask = {
        ...hybridTask,
        acceptedAt: now,
        expiresAt: now + 3_600_000,
        objectives: [{ eventKind: 'molly_supply', labelVi: 'Dùng Gói Tiếp Tế Bà Molly', target: 1, progress: 0 }],
      };
      const supplyRes = sim.consumeMollySupplyKit('match3');
      expect(supplyRes.ok).toBe(true);
      expect(derby.activeTask.objectives[0].progress).toBe(1);
    });
  });

  describe('3. Trash 15m Cooldown, 1-Sand Restore, 7+1 Task Cap, 2500 Cap & 5 Horseshoe Milestones', () => {
    it('trashes a board task for 15m, auto-refills after 15m, and supports 1 Time Sand instant restore', () => {
      const sim = createFreshSim();
      const t0 = Date.UTC(2026, 10, 21, 10, 0, 0);
      const derby = sim.ensureWeeklyDerby(t0);

      const slot0Before = derby.boardTasks[0];
      const trashRes = sim.trashWeeklyDerbyBoardTask(slot0Before.id, t0);
      expect(trashRes.ok).toBe(true);
      expect(derby.boardTasks[0].trashedUntilAt).toBe(t0 + DERBY_TRASH_COOLDOWN_MS);
      // Cannot accept a trashed slot while cooling down
      expect(sim.acceptWeeklyDerbyTask(slot0Before.id, t0 + 60_000).ok).toBe(false);

      // Instant restore spends 1 Time Sand and swaps in a fresh non-duplicate task
      const sandBefore = sim.state.timeSand;
      const restoreRes = sim.instantRestoreWeeklyDerbySlot(slot0Before.id, t0 + 60_000);
      expect(restoreRes.ok).toBe(true);
      expect(sim.state.timeSand).toBe(sandBefore - DERBY_INSTANT_RESTORE_SAND_COST);
      expect(derby.boardTasks[0].trashedUntilAt).toBeUndefined();
      expect(derby.boardTasks[0].id).not.toBe(slot0Before.id);

      // Auto-refill after 15m cooldown without spending Time Sand
      const slot1Before = derby.boardTasks[1];
      expect(sim.trashWeeklyDerbyBoardTask(slot1Before.id, t0).ok).toBe(true);
      sim.ensureWeeklyDerby(t0 + DERBY_TRASH_COOLDOWN_MS + 1_000);
      expect(derby.boardTasks[1].trashedUntilAt).toBeUndefined();
      expect(derby.boardTasks[1].id).not.toBe(slot1Before.id);
    });

    it('enforces 7-task weekly base cap, unlocks 8th bonus slot for 2 Time Sand, caps score at 2500 & awards all 5 milestones', () => {
      const sim = createFreshSim();
      const t0 = Date.UTC(2026, 10, 21, 10, 0, 0);
      const derby = sim.ensureWeeklyDerby(t0);

      // Complete 7 tasks -> hits base weekly cap
      derby.tasksCompleted = MAX_WEEKLY_DERBY_TASKS;
      derby.points = 2350;
      expect(sim.acceptWeeklyDerbyTask(derby.boardTasks[0].id, t0).ok).toBe(false);

      // Unlock bonus 8th slot for 2 Time Sand
      const sandBefore = sim.state.timeSand;
      const unlockRes = sim.unlockBonusWeeklyDerbySlot(t0);
      expect(unlockRes.ok).toBe(true);
      expect(sim.state.timeSand).toBe(sandBefore - DERBY_BONUS_SLOT_SAND_COST);
      expect(derby.bonusSlotUnlocked).toBe(true);
      expect(sim.getWeeklyDerbySummary(t0).maxTasks).toBe(MAX_WEEKLY_DERBY_BONUS_TASKS);

      // Accept & complete 8th task (300 pts) -> hard-capped at 2500 (earns 150)
      const hybrid8 = derby.boardTasks[6];
      expect(sim.acceptWeeklyDerbyTask(hybrid8.id, t0).ok).toBe(true);
      for (const o of derby.activeTask!.objectives) {
        o.progress = o.target;
      }
      const complete8 = sim.completeWeeklyDerbyActiveTask(t0);
      expect(complete8.ok).toBe(true);
      expect(derby.points).toBe(MAX_WEEKLY_DERBY_SCORE);
      expect(complete8.pointsEarned).toBe(150);
      expect(derby.tasksCompleted).toBe(MAX_WEEKLY_DERBY_BONUS_TASKS);

      // 9th task blocked permanently for the week
      expect(sim.acceptWeeklyDerbyTask(derby.boardTasks[0].id, t0).ok).toBe(false);

      // All 5 Horseshoe Milestones are claimable at 2500 pts and grant exact rewards once each
      expect(sim.getWeeklyDerbySummary(t0).claimableMilestonesCount).toBe(5);
      const barn = sim.ensureFarmBarn();
      const beforeSickle = sim.state.galleons;
      const beforePlugs = barn.goods.muggle_plug_kit ?? 0;
      const beforeCompost = sim.state.herbalCompost ?? 0;
      const beforeDew = sim.state.morningDewPhials ?? 0;
      const beforeSand = sim.state.timeSand;
      const beforeTal = sim.state.phoenixTalismans ?? 0;
      const beforeStars = sim.state.match3.stars;

      for (const m of DERBY_MILESTONES) {
        expect(sim.claimWeeklyDerbyMilestone(m.tier, t0).ok).toBe(true);
        // Double claim rejected
        expect(sim.claimWeeklyDerbyMilestone(m.tier, t0).ok).toBe(false);
      }

      const expectedSickle = DERBY_MILESTONES.reduce((s, m) => s + m.rewardSickle, 0);
      const expectedPlugs = DERBY_MILESTONES.reduce((s, m) => s + (m.rewardPlug ?? 0), 0);
      const expectedCompost = DERBY_MILESTONES.reduce((s, m) => s + (m.rewardCompost ?? 0), 0);
      const expectedDew = DERBY_MILESTONES.reduce((s, m) => s + (m.rewardDew ?? 0), 0);
      const expectedSand = DERBY_MILESTONES.reduce((s, m) => s + (m.rewardSand ?? 0), 0);
      const expectedTal = DERBY_MILESTONES.reduce((s, m) => s + (m.rewardTalisman ?? 0), 0);
      const expectedStars = DERBY_MILESTONES.reduce((s, m) => s + (m.rewardStars ?? 0), 0);

      expect(sim.state.galleons - beforeSickle).toBe(expectedSickle);
      expect((barn.goods.muggle_plug_kit ?? 0) - beforePlugs).toBe(expectedPlugs);
      expect((sim.state.herbalCompost ?? 0) - beforeCompost).toBe(expectedCompost);
      expect((sim.state.morningDewPhials ?? 0) - beforeDew).toBe(expectedDew);
      expect(sim.state.timeSand - beforeSand).toBe(expectedSand);
      expect((sim.state.phoenixTalismans ?? 0) - beforeTal).toBe(expectedTal);
      expect(sim.state.match3.stars - beforeStars).toBe(expectedStars);
      expect(sim.getWeeklyDerbySummary(t0).claimableMilestonesCount).toBe(0);
    });
  });

  describe('4. 7-Discipline House Cup & Bridge Farm Derby Save Sync', () => {
    const sixDisciplines: Record<
      'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'jigsaw',
      Record<HouseName, number>
    > = {
      match3: { Gryffindor: 400, Slytherin: 300, Ravenclaw: 200, Hufflepuff: 100 },
      caro: { Gryffindor: 100, Slytherin: 400, Ravenclaw: 300, Hufflepuff: 200 },
      sudoku: { Gryffindor: 200, Slytherin: 100, Ravenclaw: 400, Hufflepuff: 300 },
      chess: { Gryffindor: 300, Slytherin: 200, Ravenclaw: 100, Hufflepuff: 400 },
      blocks: { Gryffindor: 350, Slytherin: 250, Ravenclaw: 150, Hufflepuff: 50 },
      jigsaw: { Gryffindor: 50, Slytherin: 150, Ravenclaw: 250, Hufflepuff: 350 },
    };

    it('keeps legacy 6-discipline payloads at exact length 6 while scoring 7-discipline payloads incl. derby in Medal Bracket & F2 Alliance Standings', () => {
      expect(HOUSE_CUP_DISCIPLINE_ORDER).toHaveLength(6);
      expect(HOUSE_CUP_ALL_DISCIPLINE_ORDER).toHaveLength(7);
      expect(HOUSE_CUP_ALL_DISCIPLINE_ORDER[6]).toBe('derby');

      // Legacy 6-discipline server reply -> length 6
      applyHouseCup({
        weekKey: '2026-W48',
        mode: 'medals',
        disciplines: sixDisciplines,
        house: 'Gryffindor',
        memberTodayPoints: 0,
        memberDailyCap: 0,
        memberBank: 0,
        memberTier: 1,
        perTier: 300,
      });
      const legacySummaries = houseCupDisciplineSummaries();
      expect(legacySummaries).toHaveLength(6);
      expect(legacySummaries.some((s) => s.id === 'derby')).toBe(false);
      const legacyBracket = computeDisciplineBracketTotals(sixDisciplines);
      expect(legacyBracket.summaries).toHaveLength(6);

      // 7-discipline server reply including derby
      const sevenDisciplines = {
        ...sixDisciplines,
        derby: { Gryffindor: 180, Slytherin: 240, Ravenclaw: 320, Hufflepuff: 460 },
      };
      applyHouseCup({
        weekKey: '2026-W48',
        mode: 'medals',
        disciplines: sevenDisciplines,
        house: 'Hufflepuff',
        memberTodayPoints: 0,
        memberDailyCap: 0,
        memberBank: 0,
        memberTier: 1,
        perTier: 300,
      });
      const sevenSummaries = houseCupDisciplineSummaries();
      expect(sevenSummaries).toHaveLength(7);
      const derbySummary = sevenSummaries.find((s) => s.id === 'derby')!;
      expect(derbySummary.leaderHouse).toBe('Hufflepuff');
      expect(derbySummary.byHouse.Hufflepuff.cupPoints).toBe(100);
      expect(derbySummary.byHouse.Ravenclaw.cupPoints).toBe(75);
      expect(derbySummary.byHouse.Slytherin.cupPoints).toBe(50);
      expect(derbySummary.byHouse.Gryffindor.cupPoints).toBe(25);

      // F2 direct totals & alliance standings include Môn #7 cleanly
      const f2Totals = computeF2HouseTotals(sevenDisciplines);
      expect(f2Totals.summaries).toHaveLength(7);
      expect(f2Totals.houses.Hufflepuff).toBe(
        computeF2HouseTotals(sixDisciplines).houses.Hufflepuff + 460
      );

      const alliances = getWeeklyHouseAlliances('2026-W48');
      const f2Standings = computeF2AllianceStandingsFromDisciplines(sevenDisciplines, alliances, {
        playerHouse: 'Hufflepuff',
      });
      expect(f2Standings.summaries).toHaveLength(7);
      expect(f2Standings.standings[0].rawPoints + f2Standings.standings[1].rawPoints).toBe(
        f2Totals.houses.Gryffindor +
          f2Totals.houses.Slytherin +
          f2Totals.houses.Ravenclaw +
          f2Totals.houses.Hufflepuff
      );
    });

    it('computeDerbyDisciplineHouseTotals enforces minTasks=2 and caps weekly member score at 2500', () => {
      expect(HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS).toBe(2500);
      expect(HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS).toBe(2);

      const result = computeDerbyDisciplineHouseTotals([
        // Tampered score 9999 gets capped to 2500 -> ties Rank 1 with legit 2500!
        { house: 'Gryffindor', weeklyDerbyScore: 9999, weeklyDerbyTasks: 7 },
        { house: 'Hufflepuff', weeklyDerbyScore: 2500, weeklyDerbyTasks: 8 },
        // Legit Rank 3 player
        { house: 'Ravenclaw', weeklyDerbyScore: 1400, weeklyDerbyTasks: 5 },
        // Disqualified: only 1 task completed (< minTasks = 2)
        { house: 'Slytherin', weeklyDerbyScore: 2500, weeklyDerbyTasks: 1 },
        // Disqualified: 0 points despite >= 2 tasks
        { house: 'Slytherin', weeklyDerbyScore: 0, weeklyDerbyTasks: 3 },
      ]);

      expect(result.qualifiedCounts).toEqual({
        Gryffindor: 1,
        Hufflepuff: 1,
        Ravenclaw: 1,
        Slytherin: 0,
      });
      expect(result.ranked).toHaveLength(3);
      // Both Gryffindor (capped 9999 -> 2500) and Hufflepuff (2500) tie at Rank 1 (+100 each)
      expect(result.ranked[0].cappedScore).toBe(2500);
      expect(result.ranked[1].cappedScore).toBe(2500);
      expect(result.ranked[0].rank).toBe(1);
      expect(result.ranked[1].rank).toBe(1);
      expect(result.ranked[2].rank).toBe(3);
      expect(result.houses.Gryffindor).toBe(100);
      expect(result.houses.Hufflepuff).toBe(100);
      expect(result.houses.Ravenclaw).toBe(65);
      expect(result.houses.Slytherin).toBe(0);
    });

    it('extractFarmDerbySyncPayload extracts and clamps farmDerby safely from serialized save JSON', () => {
      expect(extractFarmDerbySyncPayload('')).toBeNull();
      expect(extractFarmDerbySyncPayload('{bad json')).toBeNull();
      expect(extractFarmDerbySyncPayload(JSON.stringify({ level: 1 }))).toBeNull();
      expect(
        extractFarmDerbySyncPayload(JSON.stringify({ weeklyDerby: { weekKey: '', points: 100, tasksCompleted: 1 } }))
      ).toBeNull();

      const valid = extractFarmDerbySyncPayload(
        JSON.stringify({
          weeklyDerby: {
            weekKey: '2026-W48',
            points: 1240,
            tasksCompleted: 4,
          },
        })
      );
      expect(valid).toEqual({
        weekKey: '2026-W48',
        points: 1240,
        tasksCompleted: 4,
      });

      const clamped = extractFarmDerbySyncPayload(
        JSON.stringify({
          weeklyDerby: {
            weekKey: '2026-W48',
            points: 99999,
            tasksCompleted: 42,
          },
        })
      );
      expect(clamped).toEqual({
        weekKey: '2026-W48',
        points: 2500,
        tasksCompleted: 8,
      });
    });
  });
});
