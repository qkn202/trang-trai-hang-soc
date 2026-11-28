import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  COMPOST_SHORTAGE_BUYOUT_SICKLE,
  computeEconomicCycleSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FIRST_ECONOMIC_CYCLE_SEC,
  getCatalogItem,
  getSoilTierInfo,
  PASTURE_ANIMALS,
  SOIL_TIERS,
} from '../../data/catalog';
import { CRAFTED_TO_BARN_EQUIV } from '../../data/synergiesAndSupply';
import { createFriendNeighborFromCode } from '../neighborSocial';
import { ParkSimulation, setFarmStore } from '../simulation';

const audio = new Proxy(
  {},
  { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }
) as never;

function newSim(): ParkSimulation {
  setFarmStore({ read: () => null, write: () => {} });
  return new ParkSimulation(audio);
}

describe('4 Pillars of Gameplay Depth (Time & HPVN Price Invariants Preserved)', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  describe('0. Time Rules & Full-Barn HPVN Price Invariants', () => {
    it('preserves relaxed cozy pacing baseline (5m -> 4h max) and gentle +15% repeat curve', () => {
      expect(FIRST_ECONOMIC_CYCLE_SEC).toBe(300);
      expect(FARM_CROPS.ottery_wheat.growSec).toBe(300);
      expect(computeEconomicCycleSeconds(0, FARM_CROPS.ottery_wheat.growSec)).toBe(300);
      expect(computeEconomicCycleSeconds(1, FARM_CROPS.ottery_wheat.growSec)).toBe(345);
      expect(computeEconomicCycleSeconds(2, FARM_CROPS.ottery_wheat.growSec)).toBe(390);
      expect(computeEconomicCycleSeconds(3, FARM_CROPS.ottery_wheat.growSec)).toBe(435);
    });

    it('upgrading soil to Tier V + applying compost never alters crop grow duration', () => {
      const simBase = newSim();
      const plotBase = simBase.state.buildings.find((b) => b.itemId === 'farmland_plot' && !b.cropId)!;
      simBase.addCropSeeds('ottery_wheat', 3);
      expect(simBase.plantCropOnPlot(plotBase.uid, 'ottery_wheat').ok).toBe(true);
      const baseDurMs = (plotBase.cropReadyAt ?? 0) - (plotBase.cropPlantedAt ?? 0);

      const simRich = newSim();
      simRich.state.level = 25;
      simRich.state.galleons = 50_000;
      simRich.state.herbalCompost = 30;
      const plotRich = simRich.state.buildings.find((b) => b.itemId === 'farmland_plot' && !b.cropId)!;
      for (let t = 1; t < 5; t++) {
        expect(simRich.upgradePlotSoilTier(plotRich.uid).ok).toBe(true);
      }
      expect(simRich.fertilizeCropPlotWithCompost(plotRich.uid).ok).toBe(true);
      simRich.addCropSeeds('ottery_wheat', 3);
      expect(simRich.plantCropOnPlot(plotRich.uid, 'ottery_wheat').ok).toBe(true);
      const richDurMs = (plotRich.cropReadyAt ?? 0) - (plotRich.cropPlantedAt ?? 0);

      expect(Math.abs(richDurMs - baseDurMs)).toBeLessThanOrEqual(50);
    });

    it('preserves full-barn harvest parity on Soil Tier V + Compost plots (soldDirect === barn sell)', () => {
      const crop = FARM_CROPS.ottery_wheat;
      const harvestTotal = (full: boolean) => {
        const sim = newSim();
        sim.state.level = 25;
        sim.state.galleons = 50_000;
        sim.state.herbalCompost = 30;
        const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
        for (let t = 1; t < 5; t++) {
          expect(sim.upgradePlotSoilTier(plot.uid).ok).toBe(true);
        }
        expect(sim.fertilizeCropPlotWithCompost(plot.uid).ok).toBe(true);
        Object.assign(plot, { cropId: crop.id, cropReadyAt: Date.now() - 1000 });
        const barn = sim.ensureFarmBarn();
        const startCount = sim.getFarmItemCount(crop.id);
        if (full) barn.capacity = sim.getBarnTotalUsed();
        const before = sim.state.galleons;
        expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
        const expectedAdded = crop.yieldQty + SOIL_TIERS[5].yieldBonus + 2; // 2 + 3 + 2 = 7
        if (!full) {
          const gained = sim.getFarmItemCount(crop.id) - startCount;
          expect(gained).toBe(expectedAdded);
          sim.sellFarmItemFromBarn(crop.id, gained);
        } else {
          expect(sim.getFarmItemCount(crop.id)).toBe(startCount);
        }
        return sim.state.galleons - before;
      };
      expect(harvestTotal(true)).toBe(harvestTotal(false));
    });
  });

  describe('1. Pillar 1 — 5 Bậc Đất Màu Mỡ & Bảo Toàn Khi Dời Ruộng', () => {
    it('gates Soil Tiers I..V by unlockLevel, consumes herbalCompost or buys shortage at 35 Sickle', () => {
      const sim = newSim();
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
      expect(sim.getPlotEffectiveSoilTier(plot)).toBe(1);

      // Tier II requires Lv.3 -> fails at Lv.1
      sim.state.galleons = 500;
      expect(sim.upgradePlotSoilTier(plot.uid).ok).toBe(false);

      // Unlock Tier II at Lv.3 (initial compost = 2; Tier II costs 1 compost + 85 Sickle)
      sim.state.level = SOIL_TIERS[2].unlockLevel;
      const t2 = sim.upgradePlotSoilTier(plot.uid);
      expect(t2.ok).toBe(true);
      expect(t2.newTier).toBe(2);
      expect(sim.state.herbalCompost).toBe(1);

      // Tier III requires Lv.8 -> fails at Lv.3
      const lockedT3 = sim.upgradePlotSoilTier(plot.uid);
      expect(lockedT3.ok).toBe(false);

      // Level up & test shortage buyout: Tier III costs 2 compost + 180 Sickle; player has 1 compost
      sim.state.level = 10;
      sim.state.galleons = 2000;
      const beforeGold = sim.state.galleons;
      const t3 = sim.upgradePlotSoilTier(plot.uid);
      expect(t3.ok).toBe(true);
      expect(t3.newTier).toBe(3);
      expect(sim.state.herbalCompost).toBe(0);
      expect(beforeGold - sim.state.galleons).toBe(
        SOIL_TIERS[3].upgradeSickle + COMPOST_SHORTAGE_BUYOUT_SICKLE
      );
    });

    it('awards +3 crop yield and x1.75 Sickle/XP at Tier V, and preserves soilTier across moveBuilding', () => {
      const sim = newSim();
      sim.skipTutorial();
      sim.state.level = 25;
      sim.state.galleons = 50_000;
      sim.state.herbalCompost = 30;
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
      for (let t = 1; t < 5; t++) {
        expect(sim.upgradePlotSoilTier(plot.uid).ok).toBe(true);
      }
      expect(sim.getPlotEffectiveSoilTier(plot)).toBe(5);
      const oldGx = plot.gx;
      const oldGy = plot.gy;

      // Record fatigue on old tile first
      const crop = FARM_CROPS.ottery_wheat;
      Object.assign(plot, { cropId: crop.id, cropReadyAt: Date.now() - 1000 });
      const beforeGold = sim.state.galleons;
      const beforeXp = sim.state.xp;
      const beforeCropQty = sim.getFarmItemCount(crop.id);
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);

      const harvestedQty = sim.getFarmItemCount(crop.id) - beforeCropQty;
      expect(harvestedQty).toBe(crop.yieldQty + getSoilTierInfo(5).yieldBonus);
      expect(sim.state.galleons - beforeGold).toBe(Math.round(crop.sellValue * 1.75));
      expect(sim.state.xp - beforeXp).toBe(Math.round(crop.xp * 1.75));

      const prevFatigueAtOld = sim.state.plotSoilState?.[`${oldGx},${oldGy}`]?.fatigueStep ?? 0;
      expect(prevFatigueAtOld).toBeGreaterThan(0);

      // Find an empty open buildable spot inside unlocked ga_hogsmeade to move the 2x2 plot
      const item = getCatalogItem(plot.itemId)!;
      let target: { gx: number; gy: number } | null = null;
      for (let gy = 14; gy <= 28 && !target; gy++) {
        for (let gx = 10; gx <= 26; gx++) {
          if ((gx === oldGx && gy === oldGy)) continue;
          if (sim.canPlaceItem(item, gx, gy, 0, plot.uid).ok) {
            target = { gx, gy };
            break;
          }
        }
      }
      expect(target).not.toBeNull();
      const mv = sim.moveBuilding(plot.uid, target!.gx, target!.gy, 0);
      expect(mv.ok).toBe(true);
      expect(plot.soilTier).toBe(5);
      expect(sim.getPlotEffectiveSoilTier(plot)).toBe(5);
      expect(sim.state.plotSoilState?.[`${target!.gx},${target!.gy}`]?.soilTier).toBe(5);
      // Old coordinate fatigue must NOT be wiped (anti-bulldoze/anti-move exploit preserved)
      expect(sim.state.plotSoilState?.[`${oldGx},${oldGy}`]?.fatigueStep).toBe(prevFatigueAtOld);
    });
  });

  describe('2. Pillar 2 — Vòng Tuần Hoàn Ruộng <-> Chuồng Thú <-> Phân Ủ Thảo Dược', () => {
    it('closes loop: pasture (+1/+2 compost) <- gourmet crop feed (-2 crops, x2 yield) -> compost resets fatigue + adds +2 crops', () => {
      const sim = newSim();
      const initialCompost = sim.state.herbalCompost ?? 0;
      expect(initialCompost).toBe(2);

      // Find initial animal pasture and make it ready
      const pasture = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot)!;
      if (!pasture.pastureAnimalId) {
        expect(sim.stockAnimalOnPasture(pasture.uid, 'burrow_hen').ok).toBe(true);
      }
      const animalDef = PASTURE_ANIMALS[pasture.pastureAnimalId!];
      pasture.pastureReadyAt = Date.now() - 1000;
      expect(sim.harvestAnimalPasture(pasture.uid).ok).toBe(true);
      expect(sim.state.herbalCompost).toBe(initialCompost + 1);

      // Gourmet feed requires 2 eligible crops in farmBarn
      sim.ensureFarmBarn().crops.ottery_wheat = 2;
      const beforeReadyAt = pasture.pastureReadyAt!;
      const gRes = sim.feedAnimalPastureGourmet(pasture.uid);
      expect(gRes.ok).toBe(true);
      expect(gRes.cropUsed).toBe('ottery_wheat');
      expect(sim.getFarmItemCount('ottery_wheat')).toBe(0);
      expect(pasture.pastureGourmetBoost).toBe(true);
      expect(pasture.pastureReadyAt!).toBeLessThan(beforeReadyAt);

      // Harvest gourmet-fed pasture -> x2 yield, 1.5x Sickle/XP, +2 compost
      const goodId = animalDef.goodId;
      const beforeGoodQty = sim.getFarmItemCount(goodId);
      const beforeGold = sim.state.galleons;
      const beforeCompost = sim.state.herbalCompost ?? 0;
      pasture.pastureReadyAt = Date.now() - 1000;
      expect(sim.harvestAnimalPasture(pasture.uid).ok).toBe(true);

      expect(sim.getFarmItemCount(goodId) - beforeGoodQty).toBe(animalDef.yieldQty * 2);
      expect(sim.state.galleons - beforeGold).toBe(Math.round(animalDef.sellValue * 1.5));
      expect(sim.state.herbalCompost).toBe(beforeCompost + 2);

      // Fertilize fatigued plot -> resets fatigueStep = 0 and gives +2 crop yield
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
      plot.harvestCycleCount = 3;
      sim.state.plotSoilState = {
        ...(sim.state.plotSoilState ?? {}),
        [`${plot.gx},${plot.gy}`]: {
          lastFamily: 'grain',
          fatigueStep: 3,
          updatedAt: Date.now(),
        },
      };
      const cBefore = sim.state.herbalCompost ?? 0;
      expect(sim.fertilizeCropPlotWithCompost(plot.uid).ok).toBe(true);
      expect(sim.state.herbalCompost).toBe(cBefore - 1);
      expect(plot.harvestCycleCount).toBe(0);
      expect(sim.state.plotSoilState?.[`${plot.gx},${plot.gy}`]?.fatigueStep).toBe(0);

      const wheatBefore = sim.getFarmItemCount('ottery_wheat');
      Object.assign(plot, { cropId: 'ottery_wheat', cropReadyAt: Date.now() - 1000 });
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
      expect(sim.getFarmItemCount('ottery_wheat') - wheatBefore).toBe(FARM_CROPS.ottery_wheat.yieldQty + 2);
    });
  });

  describe('3. Pillar 3 — Tàu Tốc Hành Hogwarts Liên Thông Kho Đỏ & Hàng Xóm / Bác Hagrid Đóng Hộ', () => {
    it('fulfills crates directly from farmBarn and supports Hagrid 1x/day when solo', () => {
      const sim = newSim();
      const trainIdx = sim.state.supply.cargoTrainIndex;
      const crates = sim.state.supply.cargoCrates;
      expect(crates.length).toBe(3);
      for (const c of crates) {
        expect(c.farmItemId).toBeTruthy();
      }

      // Crate 0 fulfilled directly from farmBarn
      const c0 = crates[0];
      const item0 = c0.farmItemId ?? CRAFTED_TO_BARN_EQUIV[c0.goodId];
      const startQty0 = sim.getFarmItemCount(item0);
      sim.addFarmItemToBarn(item0, c0.qtyRequired);
      const stock0 = sim.getCargoCrateStockInfo(c0);
      expect(stock0.canFulfill).toBe(true);
      expect(stock0.preferSource).toBe('barn');
      expect(sim.fulfillCargoCrate(c0.id).ok).toBe(true);
      expect(c0.fulfilled).toBe(true);
      expect(sim.getFarmItemCount(item0)).toBe(startQty0);

      // With neighbors.length === 0, Hagrid helps Crate 1 immediately
      expect(sim.ensureNeighborSocial().neighbors.length).toBe(0);
      const c1 = crates[1];
      const h1 = sim.requestCargoCrateHelp(c1.id);
      expect(h1.ok).toBe(true);
      expect(c1.fulfilled).toBe(true);
      expect(c1.helpedByNeighborName).toBe('Bác Hagrid');

      // Cannot request help for a 2nd crate on the same train
      const c2 = crates[2];
      const h2SameTrain = sim.requestCargoCrateHelp(c2.id);
      expect(h2SameTrain.ok).toBe(false);

      // Fulfill last crate -> train departs & advances cargoTrainIndex
      const item2 = c2.farmItemId ?? CRAFTED_TO_BARN_EQUIV[c2.goodId];
      sim.addFarmItemToBarn(item2, c2.qtyRequired);
      expect(sim.fulfillCargoCrate(c2.id).ok).toBe(true);
      expect(sim.state.supply.cargoTrainIndex).toBe(trainIdx + 1);

      // On the next train the same day, Hagrid already helped once today
      const hNextTrain = sim.requestCargoCrateHelp(sim.state.supply.cargoCrates[0].id);
      expect(hNextTrain.ok).toBe(false);
    });

    it('lets a real/Floo friend fulfill a requested crate asynchronously and departs train if last', () => {
      const sim = newSim();
      const friend = createFriendNeighborFromCode('FLOO1234', 'Luna Lovegood');
      sim.ensureNeighborSocial().neighbors.push(friend);

      const crates = sim.state.supply.cargoCrates;
      for (const c of crates.slice(0, 2)) {
        const iid = c.farmItemId ?? CRAFTED_TO_BARN_EQUIV[c.goodId];
        sim.addFarmItemToBarn(iid, c.qtyRequired);
        expect(sim.fulfillCargoCrate(c.id).ok).toBe(true);
      }

      const startTrain = sim.state.supply.cargoTrainIndex;
      const lastCrate = crates[2];
      const req = sim.requestCargoCrateHelp(lastCrate.id);
      expect(req.ok).toBe(true);
      expect(lastCrate.fulfilled).toBe(false);
      expect(lastCrate.helpRequestedAt).toBeGreaterThan(0);

      // Advance background tick by > 5s -> neighbor fulfills last crate & train departs!
      sim.tickNeighborSocialBackground((lastCrate.helpRequestedAt ?? Date.now()) + 6000);
      expect(sim.state.supply.cargoTrainIndex).toBe(startTrain + 1);
    });
  });

  describe('4. Pillar 4 — Chợ Phiên Hogsmeade (Tiêu Điểm +1🌿/+8⭐ Đơn Cú, 3 Lô Sỉ & 3 Thương Vụ)', () => {
    it('pays +1 herbalCompost, +8 XP & +6 Feast points on spotlight Owl Orders without altering base Sickle, and caps spotlight lots at 3/day', () => {
      const sim = newSim();
      const fair = sim.ensureMarketFairState();
      const barn = sim.ensureFarmBarn();
      expect(fair.deals.length).toBe(3);

      // Put spotlightCropId into Owl Order #0
      const order0 = barn.owlOrders[0];
      order0.requirements = [{ itemId: fair.spotlightCropId, qty: 1 }];
      const bonus = sim.getOwlOrderSpotlightBonus(order0);
      expect(bonus.hasSpotlight).toBe(true);
      expect(bonus.bonusCompost).toBe(1);
      expect(bonus.bonusXp).toBe(8);
      expect(bonus.bonusFeastPoints).toBe(6);

      sim.addFarmItemToBarn(fair.spotlightCropId, 1);
      const baseGold = sim.state.galleons;
      const baseXp = sim.state.xp;
      const baseCompost = sim.state.herbalCompost ?? 0;
      const baseFeastPts = sim.ensureHarvestFeast().points;
      const expectedFeastDelta = (order0.isFeastMarquee ? 30 : 22) + bonus.bonusFeastPoints;
      expect(sim.fulfillFarmOwlOrder(order0.id).ok).toBe(true);
      expect(sim.state.galleons - baseGold).toBe(order0.rewardSickle);
      expect(sim.state.xp - baseXp).toBe(order0.rewardXp + bonus.bonusXp);
      expect(sim.state.herbalCompost).toBe(baseCompost + bonus.bonusCompost);
      expect(sim.ensureHarvestFeast().points - baseFeastPts).toBe(expectedFeastDelta);

      // Spotlight wholesale lots capped at 3/day + grants +1 compost per lot
      sim.addFarmItemToBarn(fair.spotlightCropId, 10);
      const compost0 = sim.state.herbalCompost ?? 0;
      for (let i = 0; i < 3; i++) {
        expect(sim.sellMarketSpotlightLot('crop').ok).toBe(true);
      }
      expect(sim.state.herbalCompost).toBe(compost0 + 3);
      expect(sim.sellMarketSpotlightLot('crop').ok).toBe(false);
    });

    it('claims all 3 deal kinds, limits free reroll to 1/day, and preserves claimed deals after reroll', () => {
      const sim = newSim();
      sim.state.level = 8;
      const fair = sim.ensureMarketFairState();
      expect(fair.deals.map((d) => d.kind)).toEqual(['bulk_buyout', 'seed_barter', 'artisan_plug']);

      // Claim Deal 0 (bulk_buyout)
      const d0 = fair.deals[0];
      sim.addFarmItemToBarn(d0.inputItemId, d0.inputQty);
      const compostBefore = sim.state.herbalCompost ?? 0;
      expect(sim.fulfillMarketFairDeal(d0.id).ok).toBe(true);
      expect(d0.claimed).toBe(true);
      expect(sim.state.herbalCompost).toBe(compostBefore + (d0.rewardCompost ?? 0));

      // Free reroll 1x/day -> preserves claimed Deal 0 while refreshing unclaimed deals
      expect(sim.rerollMarketFairDeals().ok).toBe(true);
      expect(sim.state.marketFair?.rerollsUsed).toBe(1);
      expect(sim.state.marketFair?.deals[0].claimed).toBe(true);
      expect(sim.rerollMarketFairDeals().ok).toBe(false);

      // Claim remaining Deal 1 (seed_barter) & Deal 2 (artisan_plug)
      const dealsAfter = sim.ensureMarketFairState().deals;
      const d1 = dealsAfter[1];
      sim.addFarmItemToBarn(d1.inputItemId, d1.inputQty);
      const dewBefore = sim.state.morningDewPhials ?? 0;
      expect(sim.fulfillMarketFairDeal(d1.id).ok).toBe(true);
      expect(sim.state.morningDewPhials).toBe(dewBefore + (d1.rewardMorningDew ?? 0));

      const d2 = dealsAfter[2];
      sim.addFarmItemToBarn(d2.inputItemId, d2.inputQty);
      const sandBefore = sim.state.timeSand;
      const plugBefore = sim.getFarmItemCount('muggle_plug_kit');
      expect(sim.fulfillMarketFairDeal(d2.id).ok).toBe(true);
      expect(sim.state.timeSand).toBe(sandBefore + (d2.rewardTimeSand ?? 0));
      expect(sim.getFarmItemCount('muggle_plug_kit')).toBe(plugBefore + (d2.rewardMugglePlug ?? 0));
    });
  });

  describe('5. Save / Load Roundtrip Preservation', () => {
    it('preserves soilTier, compost boost, gourmet boost, compost bag, cargo farmItemId & marketFair', () => {
      const sim = newSim();
      sim.state.level = 20;
      sim.state.galleons = 50_000;
      sim.state.herbalCompost = 14;
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
      sim.upgradePlotSoilTier(plot.uid);
      sim.upgradePlotSoilTier(plot.uid);
      sim.fertilizeCropPlotWithCompost(plot.uid);

      const pasture = sim.state.buildings.find(
        (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot && !b.pastureAnimalId
      )!;
      expect(sim.stockAnimalOnPasture(pasture.uid, 'burrow_hen').ok).toBe(true);
      sim.ensureFarmBarn().crops.ottery_wheat = 2;
      expect(sim.feedAnimalPastureGourmet(pasture.uid).ok).toBe(true);

      const fair = sim.ensureMarketFairState();
      sim.addFarmItemToBarn(fair.spotlightCropId, 2);
      sim.sellMarketSpotlightLot('crop');

      const savedJson = sim.exportSaveJson();
      const restored = newSim();
      expect(restored.importSaveJson(savedJson)).toBe(true);

      const restoredPlot = restored.state.buildings.find((b) => b.uid === plot.uid)!;
      expect(restoredPlot.soilTier).toBe(3);
      expect(restoredPlot.cropCompostBoost).toBe(true);

      const restoredPasture = restored.state.buildings.find((b) => b.uid === pasture.uid)!;
      expect(restoredPasture.pastureGourmetBoost).toBe(true);

      expect(restored.state.herbalCompost).toBe(sim.state.herbalCompost);
      const restoredFair = restored.state.marketFair;
      expect(restoredFair?.spotlightLotsSold).toBe(1);
      expect(restoredFair?.spotlightCropId).toBe(fair.spotlightCropId);
      expect(restoredFair && restoredFair.spotlightCropId in FARM_CROPS).toBe(true);
      expect(restoredFair && restoredFair.spotlightGoodId in FARM_GOODS).toBe(true);
      expect(restored.state.supply.cargoCrates[0].farmItemId).toBe(
        sim.state.supply.cargoCrates[0].farmItemId
      );

      // Scan 30 days to ensure unsigned bitshift always yields valid FARM_CROPS/FARM_GOODS spotlights
      for (let d = 1; d <= 30; d++) {
        sim.state.marketFair = {
          ...fair,
          dayKey: `2026-11-${String(d).padStart(2, '0')}`,
          seedOffset: d,
        };
        const checked = sim.ensureMarketFairState();
        expect(checked.spotlightCropId in FARM_CROPS).toBe(true);
        expect(checked.spotlightGoodId in FARM_GOODS).toBe(true);
      }
    });
  });
});
