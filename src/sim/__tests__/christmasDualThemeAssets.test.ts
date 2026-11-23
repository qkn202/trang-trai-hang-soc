import { describe, expect, it, vi } from 'vitest';
import {
  CATALOG,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  PASTURE_ANIMALS,
  getCatalogItem,
  getFarmItemIconSrc,
} from '../../data/catalog';
import { getItemPuzzleStarCost } from '../../data/match3Levels';
import { SPRITE_KEYS } from '../../engine/spriteLoader';
import { ParkSimulation, setFarmStore } from '../simulation';
import { yuleCollectionProgress, yuleTaskProgress } from '../yuleEvent';
import type { CatalogItem, FarmCropId, PlacedBuilding } from '../../types/game';

const mockAudio = new Proxy(
  {},
  { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }
) as never;

function findFreeSpot(sim: ParkSimulation, item: CatalogItem): [number, number] {
  for (let gy = 20; gy <= 46; gy += 2) {
    for (let gx = 18; gx <= 50; gx += 2) {
      if (sim.canPlaceItem(item, gx, gy, 0).ok) {
        return [gx, gy];
      }
    }
  }
  throw new Error(`No free placement spot found for ${item.id}`);
}

describe('Dual-Theme Christmas Expansion (Harry Potter + Vietnam — Zero Human Characters)', () => {
  it('registers all 43 + 7 second-frame Christmas beast sprites cleanly in SPRITE_KEYS with zero overlap', () => {
    const unique = new Set<string>(SPRITE_KEYS);
    expect(unique.size).toBe(338);
    for (const crop of Object.values(FARM_CROPS)) {
      expect(unique.has(crop.iconKey)).toBe(true);
      expect(getFarmItemIconSrc(crop.id)).toBe(`/game/trang-trai-hang-soc/sprites/${crop.iconKey}.webp`);
    }
    for (const good of Object.values(FARM_GOODS)) {
      expect(unique.has(good.iconKey)).toBe(true);
    }
    for (const animal of Object.values(PASTURE_ANIMALS)) {
      expect(unique.has(animal.spritePair[0])).toBe(true);
      expect(unique.has(animal.spritePair[1])).toBe(true);
      expect(animal.spritePair[0]).not.toBe(animal.spritePair[1]);
    }
  });

  it('plants & harvests new Harry Potter & Vietnam Christmas crops and tracks Yule crop mastery', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    sim.state.level = 10;
    sim.state.galleons = 20_000;

    const plotItem = getCatalogItem('farmland_plot')!;
    const cropIds: FarmCropId[] = [
      'yule_peppermint_cane',
      'vn_noel_golden_kumquat',
      'vn_highland_coffee_berry',
    ];

    for (const cid of cropIds) {
      expect(sim.buyCropSeedWithGold(cid, 2).ok).toBe(true);
      const [gx, gy] = findFreeSpot(sim, plotItem);
      expect(sim.placeItem(plotItem, gx, gy, 0)).toBe(true);
      const plot = sim.state.buildings.find((b) => b.gx === gx && b.gy === gy)!;
      expect(sim.plantCropOnPlot(plot.uid, cid).ok).toBe(true);
      plot.cropReadyAt = Date.now() - 1000;
      const before = sim.getFarmItemCount(cid);
      const snowBonus = sim.getCurrentWeather().kind === 'snow' ? 1 : 0;
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
      expect(sim.getFarmItemCount(cid)).toBe(before + FARM_CROPS[cid].yieldQty + snowBonus);
    }

    expect(
      yuleTaskProgress(sim.state, {
        id: 'test_yule_crop',
        titleVi: 'Thu hoạch cây mùa đông',
        kind: 'harvest_yule_crop',
        amount: 3,
        rewardSickles: 0,
        rewardXp: 10,
      })
    ).toBeGreaterThanOrEqual(3);
  });

  it('crafts new Harry Potter & Vietnam Christmas dishes cleanly into the Farm Barn', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    sim.state.level = 20;
    sim.state.galleons = 25_000;

    const mkWorkshop = (uid: string, itemId: string, gx: number, gy: number): PlacedBuilding => ({
      uid,
      itemId,
      gx,
      gy,
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
      isIndestructible: true,
    });

    const bakery = mkWorkshop('test_yule_bakery', 'molly_apple_bakery', 10, 10);
    const broom = mkWorkshop('test_yule_broomsticks', 'burrow_broomsticks_canon', 14, 10);
    const honey = mkWorkshop('test_yule_honeydukes', 'burrow_honeydukes_canon', 18, 10);
    sim.state.buildings.push(bakery, broom, honey);
    sim.rebuildGrid();

    const tests: Array<[string, string]> = [
      [bakery.uid, 'rcp_yule_log_cake'],
      [broom.uid, 'rcp_vn_egg_coffee'],
      [honey.uid, 'rcp_vn_pandan_yule_log'],
    ];

    for (const [uid, recipeId] of tests) {
      const rcp = FARM_WORKSHOP_RECIPES.find((r) => r.id === recipeId)!;
      expect(rcp).toBeDefined();
      for (const inp of rcp.inputs) {
        sim.addFarmItemToBarn(inp.itemId, inp.qty * 2);
      }
      expect(sim.enqueueWorkshopRecipe(uid, recipeId).ok).toBe(true);
      const bld = sim.state.buildings.find((b) => b.uid === uid)!;
      bld.workshopQueue![0].endsAt = Date.now() - 500;
      sim.update(0.1);
      expect(bld.readyFarmGoods).toContain(rcp.goodId);
      expect(sim.harvestBuildingBubble(uid)).toBe(true);
      expect(sim.getFarmItemCount(rcp.goodId)).toBeGreaterThanOrEqual(1);
    }
  });

  it('stocks & harvests new Harry Potter & Vietnam Christmas pasture companions', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    sim.state.level = 15;
    sim.state.galleons = 20_000;

    const pastureItem = getCatalogItem('burrow_animal_pasture')!;
    const [x1, y1] = findFreeSpot(sim, pastureItem);
    expect(sim.placeItem(pastureItem, x1, y1, 0)).toBe(true);
    const [x2, y2] = findFreeSpot(sim, pastureItem);
    expect(sim.placeItem(pastureItem, x2, y2, 0)).toBe(true);
    const p1 = sim.state.buildings.find((b) => b.gx === x1 && b.gy === y1)!;
    const p2 = sim.state.buildings.find((b) => b.gx === x2 && b.gy === y2)!;

    expect(sim.stockAnimalOnPasture(p1.uid, 'yule_star_phoenix').ok).toBe(true);
    expect(sim.stockAnimalOnPasture(p2.uid, 'vn_noel_bac_ha_dog').ok).toBe(true);

    p1.pastureReadyAt = Date.now() - 500;
    p2.pastureReadyAt = Date.now() - 500;
    expect(sim.harvestAnimalPasture(p1.uid).ok).toBe(true);
    expect(sim.harvestAnimalPasture(p2.uid).ok).toBe(true);
    expect(sim.getFarmItemCount('yule_flaming_pudding')).toBeGreaterThanOrEqual(1);
    expect(sim.getFarmItemCount('vn_grilled_corn_sweetpotato')).toBeGreaterThanOrEqual(1);
  });

  it('places new vietnam_noel & Harry Potter Christmas decor items at 0 Stars and updates collection progress', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    sim.state.level = 10;
    sim.state.galleons = 50_000;
    const starsBefore = sim.state.match3.stars;

    const cathedral = getCatalogItem('yule_vn_stone_cathedral')!;
    const coffeeCart = getCatalogItem('yule_vn_phin_coffee_cart')!;
    const flooHearth = getCatalogItem('yule_floo_emerald_hearth')!;

    expect(cathedral.yuleCollection).toBe('vietnam_noel');
    expect(getItemPuzzleStarCost(cathedral)).toBe(0);
    expect(getItemPuzzleStarCost(flooHearth)).toBe(0);

    for (const item of [cathedral, coffeeCart, flooHearth]) {
      const [gx, gy] = findFreeSpot(sim, item);
      expect(sim.placeItem(item, gx, gy, 0)).toBe(true);
    }
    expect(sim.state.match3.stars).toBe(starsBefore);

    const vnProgress = yuleCollectionProgress(sim.state, 'vietnam_noel');
    expect(vnProgress.total).toBe(9);
    expect(vnProgress.owned).toBeGreaterThanOrEqual(2);
    expect(CATALOG.filter((it) => it.yuleCollection === 'vietnam_noel')).toHaveLength(9);
  });
});
