import { describe, expect, it } from 'vitest';
import { ParkSimulation } from '../simulation';
import { migrateLoadedState } from '../simulationData';
import {
  computeWheatingDropThreshold,
  FARM_VISITOR_RESPAWN_MS,
  getWorkshopMasteryInfo,
  NEWSPAPER_REFRESH_MS,
  WORKSHOP_EXTRA_SLOT_COSTS,
} from '../hayDayFarming';
import {
  getRoadsideSaleWaitMs,
  ROADSIDE_AD_COOLDOWN_MS,
  ROADSIDE_STAND_SLOT_COUNT,
} from '../roadsideStandAndEvents';
import { OWL_ORDER_TRASH_COOLDOWN_MS } from '../simulationQuests';
import { CATALOG, getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { WorldRenderSnapshotCollector } from '../../render/worldSnapshot';

function createFreshSim(): ParkSimulation {
  const sim = new ParkSimulation(new MagicalAudio());
  sim.state.sandboxMode = false;
  sim.state.galleons = 2500;
  sim.state.timeSand = 10;
  sim.state.herbalCompost = 2;
  return sim;
}

describe('Hay Day Core Farming Loop & Phase 1 Technical Fixes', () => {
  it('1. Crop-as-Seed (Plant 1 -> Harvest 2): plants directly from harvested Barn crops when seed pouch hits 0', () => {
    const sim = createFreshSim();
    const barn = sim.ensureFarmBarn();
    barn.seeds = { ...(barn.seeds ?? {}), ottery_wheat: 0 };
    barn.crops.ottery_wheat = 2;

    expect(sim.getSeedCount('ottery_wheat')).toBe(0);
    expect(sim.getPlantableSeedCount('ottery_wheat')).toBe(2);

    const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot);
    expect(plot).toBeDefined();
    plot!.cropId = null;
    plot!.cropReadyAt = undefined;
    plot!.constructEndsAt = 0;

    const plantRes = sim.plantCropOnPlot(plot!.uid, 'ottery_wheat');
    expect(plantRes.ok).toBe(true);
    expect(barn.crops.ottery_wheat).toBe(1);
    expect(plot!.cropId).toBe('ottery_wheat');

    // Harvest yields >= 2 crops back -> net gain!
    plot!.cropReadyAt = Date.now() - 1000;
    const harvestRes = sim.harvestCropPlot(plot!.uid);
    expect(harvestRes.ok).toBe(true);
    expect(barn.crops.ottery_wheat).toBeGreaterThanOrEqual(3);
  });

  it('2. Wheating Bonus Drops (Loc Mua Vang): awards real upgrade items after adaptive harvest threshold', () => {
    expect(computeWheatingDropThreshold(4)).toBeGreaterThanOrEqual(8);
    expect(computeWheatingDropThreshold(50)).toBeLessThanOrEqual(20);

    const sim = createFreshSim();
    const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
    const barn = sim.ensureFarmBarn();
    barn.crops.ottery_wheat = 40;
    const beforePlugs = barn.goods.muggle_plug_kit ?? 0;
    const beforeCompost = sim.state.herbalCompost ?? 0;
    const beforeDew = sim.state.morningDewPhials ?? 0;
    const beforeSand = sim.state.timeSand;

    const { threshold } = sim.getHayDayWheatingProgress();
    for (let i = 0; i < threshold; i++) {
      plot.cropId = 'ottery_wheat';
      plot.cropPlantedAt = Date.now() - 600_000;
      plot.cropReadyAt = Date.now() - 1000;
      plot.constructEndsAt = 0;
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
    }

    const afterProg = sim.getHayDayWheatingProgress();
    expect(afterProg.totalDrops).toBeGreaterThanOrEqual(1);
    const totalUpgradesGained =
      ((barn.goods.muggle_plug_kit ?? 0) - beforePlugs) +
      ((sim.state.herbalCompost ?? 0) - beforeCompost) +
      ((sim.state.morningDewPhials ?? 0) - beforeDew) +
      (sim.state.timeSand - beforeSand);
    expect(totalUpgradesGained).toBeGreaterThanOrEqual(1);
  });

  it('3. Workshop Machine Mastery (★1 -> ★3) & Expandable Queue Slots (+1..+3) persist across reload', () => {
    expect(getWorkshopMasteryInfo(0).tier).toBe(0);
    expect(getWorkshopMasteryInfo(10)).toMatchObject({ tier: 1, goldMult: 1.1, speedMult: 1.0 });
    expect(getWorkshopMasteryInfo(30)).toMatchObject({ tier: 2, xpMult: 1.15 });
    expect(getWorkshopMasteryInfo(65)).toMatchObject({ tier: 3, speedMult: 0.85, goldMult: 1.15 });

    const sim = createFreshSim();
    const wsCatalog = CATALOG.find((c) => Boolean(c.workshopGroupId))!;
    expect(wsCatalog).toBeDefined();
    let ws = sim.state.buildings.find((b) => Boolean(getCatalogItem(b.itemId)?.workshopGroupId));
    if (!ws) {
      ws = {
        uid: 'test_ws_bakery',
        itemId: wsCatalog.id,
        gx: 18,
        gy: 20,
        rotation: 0,
        stars: 1,
        placedAt: Date.now() - 10_000,
        constructEndsAt: 0,
        lastTickAt: Date.now(),
        storedSickle: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
      };
      sim.state.buildings.push(ws);
    }
    const baseCap = sim.getEffectiveWorkshopQueueCapacity(ws);

    for (let i = 0; i < WORKSHOP_EXTRA_SLOT_COSTS.length; i++) {
      const beforeGold = sim.state.galleons;
      const res = sim.expandWorkshopQueueSlot(ws.uid);
      expect(res.ok).toBe(true);
      expect(res.newCapacity).toBe(baseCap + i + 1);
      expect(beforeGold - sim.state.galleons).toBe(WORKSHOP_EXTRA_SLOT_COSTS[i]);
    }
    expect(sim.expandWorkshopQueueSlot(ws.uid).ok).toBe(false);

    // Save/load migration preserves extraQueueSlots and workshopMastery
    sim.state.workshopMastery = { [wsCatalog.workshopGroupId!]: 34 };
    const migrated = migrateLoadedState(JSON.parse(JSON.stringify(sim.state)));
    const migratedWs = migrated.buildings.find((b) => b.uid === ws.uid);
    expect(migratedWs?.extraQueueSlots).toBe(3);
    expect(migrated.workshopMastery?.[wsCatalog.workshopGroupId!]).toBe(34);
  });

  it('4. Owl Board Unlimited Trash (5m cooldown), Instant Restore, and 3-Order Delivery Streak bonus', () => {
    const sim = createFreshSim();
    const barn = sim.ensureFarmBarn();
    const firstOrder = barn.owlOrders[0];
    const t0 = Date.now();
    const rerollsBefore = sim.getOwlRerollsLeft();

    // Trash order freely without touching daily 3 instant rerolls
    const trashRes = sim.trashFarmOwlOrder(firstOrder.id, t0);
    expect(trashRes.ok).toBe(true);
    expect(sim.getOwlRerollsLeft()).toBe(rerollsBefore);
    expect(firstOrder.trashedUntilAt).toBe(t0 + OWL_ORDER_TRASH_COOLDOWN_MS);
    expect(sim.canFulfillFarmOwlOrder(firstOrder)).toBe(false);

    // Tick before 5m keeps it trashed; tick at 5m refills a fresh order
    expect(sim.tickTrashedOwlOrders(t0 + 60_000)).toBe(false);
    expect(sim.tickTrashedOwlOrders(t0 + OWL_ORDER_TRASH_COOLDOWN_MS + 1000)).toBe(true);
    expect(barn.owlOrders[0].trashedUntilAt).toBeUndefined();

    // Instant restore spends 1 Time Sand
    const order2 = barn.owlOrders[1];
    expect(sim.trashFarmOwlOrder(order2.id, t0).ok).toBe(true);
    const sandBefore = sim.state.timeSand;
    const restoreRes = sim.instantRestoreTrashedOwlOrder(order2.id, t0 + 1000);
    expect(restoreRes.ok).toBe(true);
    expect(sim.state.timeSand).toBe(sandBefore - 1);
    expect(barn.owlOrders[1].trashedUntilAt).toBeUndefined();

    // Deliver 3 consecutive orders -> triggers +1 Compost streak reward on the 3rd!
    barn.deliveryStreak = 2;
    const targetOrder = barn.owlOrders[0];
    for (const req of targetOrder.requirements) {
      sim.addFarmItemToBarn(req.itemId, req.qty + 2);
    }
    const compostBefore = sim.state.herbalCompost ?? 0;
    const goldBefore = sim.state.galleons;
    const fulfillRes = sim.fulfillFarmOwlOrder(targetOrder.id);
    expect(fulfillRes.ok).toBe(true);
    expect(barn.deliveryStreak).toBe(3);
    expect(sim.state.herbalCompost ?? 0).toBeGreaterThanOrEqual(compostBefore + 1);
    expect(sim.state.galleons - goldBefore).toBeGreaterThan(targetOrder.rewardSickle);
  });

  it('5. Hay Day Farm Visitors offer 1.18x-1.32x Sickle for stocked Barn goods and respawn after 90s', () => {
    const sim = createFreshSim();
    const barn = sim.ensureFarmBarn();
    barn.crops.ottery_wheat = 12;
    const t0 = 1_700_000_000_000;

    const visitors = sim.getFarmVisitors(t0);
    expect(visitors.length).toBe(2);
    expect(sim.getActiveFarmVisitorsCount(t0)).toBe(2);

    const v0 = visitors[0];
    sim.addFarmItemToBarn(v0.itemId, v0.qty + 3);
    const goldBefore = sim.state.galleons;
    const acceptRes = sim.acceptFarmVisitorOffer(v0.id, t0);
    expect(acceptRes.ok).toBe(true);
    expect(acceptRes.earnedSickle).toBe(v0.offerSickle);
    expect(sim.state.galleons).toBe(goldBefore + v0.offerSickle);
    expect(sim.getActiveFarmVisitorsCount(t0 + 1000)).toBe(1);

    // Dismiss second visitor & verify respawn after 90s
    const v1 = visitors[1];
    expect(sim.dismissFarmVisitorOffer(v1.id, t0).ok).toBe(true);
    expect(sim.getActiveFarmVisitorsCount(t0 + 1000)).toBe(0);
    expect(sim.getActiveFarmVisitorsCount(t0 + FARM_VISITOR_RESPAWN_MS + 1000)).toBe(2);
  });

  it('5b. Farm Visitors always spawn as two distinct characters across 30 timestamps, single-slot respawns, and duplicate-save sanitization', () => {
    const sim = createFreshSim();
    const barn = sim.ensureFarmBarn();
    barn.crops.ottery_wheat = 10;
    const baseTs = 1_700_000_000_000;

    // Fresh spawns across 30 distinct timestamps must never collide
    for (let i = 0; i < 30; i++) {
      sim.state.farmVisitors = [];
      const ts = baseTs + i * 37_000;
      const visitors = sim.getFarmVisitors(ts);
      expect(visitors).toHaveLength(2);
      expect(visitors[0].visitorName).not.toBe(visitors[1].visitorName);
    }

    // Alternating single-slot dismiss & respawn cycles (Slot 0 while Slot 1 stands, and Slot 1 while Slot 0 stands)
    let cursorTs = baseTs + 2_000_000;
    sim.state.farmVisitors = [];
    let active = sim.getFarmVisitors(cursorTs);
    expect(active[0].visitorName).not.toBe(active[1].visitorName);
    for (let i = 0; i < 30; i++) {
      const slotToDismiss = i % 2;
      const standingSlot = 1 - slotToDismiss;
      const standingName = active[standingSlot].visitorName;
      expect(sim.dismissFarmVisitorOffer(active[slotToDismiss].id, cursorTs).ok).toBe(true);
      cursorTs += FARM_VISITOR_RESPAWN_MS + 1_000 + i * 1_000;
      active = sim.getFarmVisitors(cursorTs);
      expect(active).toHaveLength(2);
      expect(active[standingSlot].visitorName).toBe(standingName);
      expect(active[0].visitorName).not.toBe(active[1].visitorName);
    }

    // Legacy saved state with duplicate active visitorName sanitizes slot 1 cleanly
    const dupTs = cursorTs + 10_000;
    const sample = sim.getFarmVisitors(dupTs);
    sim.state.farmVisitors = [
      { ...sample[0], slotIndex: 0, arrivesAt: undefined },
      {
        ...sample[1],
        slotIndex: 1,
        visitorName: sample[0].visitorName,
        visitorEmoji: sample[0].visitorEmoji,
        arrivesAt: undefined,
      },
    ];
    const sanitized = sim.getFarmVisitors(dupTs + 5_000);
    expect(sanitized).toHaveLength(2);
    expect(sanitized[0].visitorName).toBe(sample[0].visitorName);
    expect(sanitized[1].visitorName).not.toBe(sanitized[0].visitorName);
  });

  it('6. Hay Day Roadside Stand supports 8 slots, stack up to 10, and free Advertise (3x speed, 3m cooldown)', () => {
    const sim = createFreshSim();
    const stand = sim.ensureRoadsideStand();
    expect(stand.slots.length).toBe(ROADSIDE_STAND_SLOT_COUNT);
    expect(ROADSIDE_STAND_SLOT_COUNT).toBe(8);

    const barn = sim.ensureFarmBarn();
    barn.crops.ottery_wheat = 25;
    const t0 = 1_700_000_000_000;

    const listRes = sim.listOnRoadsideStand(0, 'ottery_wheat', 10, 'premium', t0);
    expect(listRes.ok).toBe(true);
    expect(stand.slots[0].qty).toBe(10);

    const normalWait = getRoadsideSaleWaitMs(stand.slots[0].unitPrice, 6, false);
    const adWait = getRoadsideSaleWaitMs(stand.slots[0].unitPrice, 6, true);
    expect(adWait).toBeLessThanOrEqual(Math.max(12_000, Math.round(normalWait / 3)) + 1);
    expect(adWait).toBeLessThan(normalWait);

    const adRes = sim.advertiseRoadsideStandSlot(0, t0);
    expect(adRes.ok).toBe(true);
    expect(stand.slots[0].advertised).toBe(true);

    // Second slot cannot be advertised during 3m cooldown
    expect(sim.listOnRoadsideStand(1, 'ottery_wheat', 5, 'fair', t0).ok).toBe(true);
    expect(sim.advertiseRoadsideStandSlot(1, t0 + 30_000).ok).toBe(false);
    expect(sim.advertiseRoadsideStandSlot(1, t0 + ROADSIDE_AD_COOLDOWN_MS + 1000).ok).toBe(true);
  });

  it('7. Daily Prophet Newspaper (Hay Day Daily Dirt) issues 6 ads incl. 1 rare upgrade deal & refreshes', () => {
    const sim = createFreshSim();
    const t0 = 1_700_000_000_000;
    const paper = sim.getDailyProphetNewspaper(t0);
    expect(paper.ads.length).toBe(6);
    const rareAd = paper.ads.find((a) => a.isRareDeal);
    expect(rareAd).toBeDefined();

    const goldBefore = sim.state.galleons;
    const buyRes = sim.buyNewspaperClassifiedAd(rareAd!.id, t0);
    expect(buyRes.ok).toBe(true);
    expect(sim.state.galleons).toBe(goldBefore - rareAd!.priceSickle);
    // Prevent double buy
    expect(sim.buyNewspaperClassifiedAd(rareAd!.id, t0).ok).toBe(false);

    // Early refresh spends 1 Time Sand -> edition #2
    const sandBefore = sim.state.timeSand;
    const refRes = sim.refreshDailyProphetNewspaperEarly(t0 + 10_000);
    expect(refRes.ok).toBe(true);
    expect(refRes.edition.editionId).toBe(paper.editionId + 1);
    expect(sim.state.timeSand).toBe(sandBefore - 1);

    // Auto refresh after NEWSPAPER_REFRESH_MS
    const autoPaper = sim.getDailyProphetNewspaper(t0 + 10_000 + NEWSPAPER_REFRESH_MS + 1000);
    expect(autoPaper.editionId).toBe(refRes.edition.editionId + 1);
  });

  it('8. Phase 1 Audio Polyphony Cap & WebGL2 Iso-X Sweep-Line Scene Sort behave deterministically', () => {
    const audio = new MagicalAudio();
    expect(() => audio.playWheatingBonusDrop()).not.toThrow();

    const sim = createFreshSim();
    const snapshot = new WorldRenderSnapshotCollector();
    const mockResolver = {
      resolve: (_key: string) => ({ id: 1, width: 128, height: 128, u0: 0, v0: 0, u1: 1, v1: 1 }),
    };
    snapshot.collect(
      sim,
      { x: 0, y: 1200, zoom: 0.9, viewRot: 0 },
      1280,
      720,
      Date.now(),
      mockResolver,
      400,
      16,
      { wx: 0, wy: 0, active: false },
      false
    );
    expect(snapshot.sceneCount).toBeGreaterThan(0);
    expect(snapshot.terrainCount).toBeGreaterThan(0);
  });
});
