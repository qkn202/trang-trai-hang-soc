import { describe, expect, it, vi } from 'vitest';
import {
  FARM_WORKSHOP_RECIPES,
  getCatalogItem,
  getWorkshopMaxQueueSlots,
  getWorkshopStarSpeedMultiplier,
} from '../../data/catalog';
import { ParkSimulation, setFarmStore } from '../simulation';
import type { PlacedBuilding } from '../../types/game';

const mockAudio = new Proxy(
  {},
  { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }
) as never;

describe('Cozy-Farm Cohesion Upgrades (No Breakdowns, Staff Dismiss, 5★ Workshop Mastery)', () => {
  it('never randomly breaks healthy buildings over extended simulation ticks', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    for (const b of sim.state.buildings) {
      b.constructEndsAt = 0;
      b.durability = 100;
      b.isBrokenDown = false;
    }

    for (let i = 0; i < 200; i++) {
      sim.update(5);
    }

    for (const b of sim.state.buildings) {
      expect(b.isBrokenDown).toBe(false);
      expect(b.durability).toBe(100);
    }
  });

  it('allows dismissing hired staff via dismissStaff() down to 0 wage', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    expect(sim.getHourlyStaffWage()).toBeGreaterThan(0);

    sim.hireStaff('caretaker');
    const hiredWage = sim.getHourlyStaffWage();
    expect(sim.dismissStaff('caretaker')).toBe(true);
    expect(sim.getHourlyStaffWage()).toBeLessThan(hiredWage);

    for (const role of Object.keys(sim.state.staffHired) as Array<keyof typeof sim.state.staffHired>) {
      while (sim.dismissStaff(role)) {
        // dismiss all assistants
      }
    }
    expect(sim.getHourlyStaffWage()).toBe(0);
    expect(sim.dismissStaff('caretaker')).toBe(false);
  });

  it('scales Workshop queue slots from 3 to 7 and crafting speed up to -32% from 1★ to 5★', () => {
    expect(getWorkshopMaxQueueSlots(1)).toBe(3);
    expect(getWorkshopMaxQueueSlots(3)).toBe(5);
    expect(getWorkshopMaxQueueSlots(5)).toBe(7);

    expect(getWorkshopStarSpeedMultiplier(1)).toBe(1);
    expect(getWorkshopStarSpeedMultiplier(2)).toBe(0.92);
    expect(getWorkshopStarSpeedMultiplier(5)).toBe(0.68);

    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    const bakeryItem = getCatalogItem('molly_apple_bakery')!;
    expect(bakeryItem).toBeDefined();
    sim.state.level = Math.max(sim.state.level, bakeryItem.unlockLevel);

    const mkBakery = (uid: string, stars: number, gx: number, gy: number): PlacedBuilding => ({
      uid,
      itemId: 'molly_apple_bakery',
      gx,
      gy,
      rotation: 0 as const,
      placedAt: Date.now(),
      constructEndsAt: 0,
      stars,
      lastTickAt: Date.now(),
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
      isIndestructible: true,
    });

    const b1 = mkBakery('test_bakery_1', 1, 10, 10);
    const b5 = mkBakery('test_bakery_5', 5, 16, 10);
    sim.state.buildings.push(b1, b5);
    sim.rebuildGrid();

    const recipe = FARM_WORKSHOP_RECIPES.find((r) => r.workshopGroupId === 'molly_kitchen')!;
    expect(recipe).toBeDefined();
    for (const req of recipe.inputs) {
      sim.addFarmItemToBarn(req.itemId, req.qty * 12);
    }

    expect(sim.enqueueWorkshopRecipe('test_bakery_1', recipe.id).ok).toBe(true);
    const dur1Ms = b1.workshopQueue![0].endsAt - b1.workshopQueue![0].startedAt;

    for (let i = 0; i < 7; i++) {
      const res = sim.enqueueWorkshopRecipe('test_bakery_5', recipe.id);
      expect(res.ok).toBe(true);
    }
    expect(b5.workshopQueue?.length).toBe(7);
    expect(sim.enqueueWorkshopRecipe('test_bakery_5', recipe.id).ok).toBe(false);

    const dur5Ms = b5.workshopQueue![0].endsAt - b5.workshopQueue![0].startedAt;
    expect(dur5Ms).toBeLessThanOrEqual(Math.round(dur1Ms * 0.69));
  });
});
