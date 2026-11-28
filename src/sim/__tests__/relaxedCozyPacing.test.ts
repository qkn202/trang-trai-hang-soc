import { describe, expect, it, vi } from 'vitest';
import {
  computeBalancedSeedCost,
  computeRelaxedCozyCycleSec,
  computeStrategicPlotGrowSeconds,
  FARM_CROPS,
  FARM_WORKSHOP_RECIPES,
  getCatalogItem,
  getMinRemainingBuildFloorSec,
  PASTURE_ANIMALS,
  TIME_SAND_SKIP_SECONDS,
} from '../../data/catalog';
import { LEVELS } from '../../data/levels';
import { ZONES } from '../../data/zones';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';

function createMockAudio(): MagicalAudio {
  return {
    playClick: vi.fn(),
    playPlace: vi.fn(),
    playCash: vi.fn(),
    playLevelUp: vi.fn(),
    playSpell: vi.fn(),
    playHarvestBubble: vi.fn(),
    playWaterSplash: vi.fn(),
    playBuildComplete: vi.fn(),
    playRibbonCut: vi.fn(),
    playMatchPop: vi.fn(),
    playPowerupBlast: vi.fn(),
    playChessClack: vi.fn(),
    playCrateCrack: vi.fn(),
    playTalismanBlast: vi.fn(),
    playFlyTick: vi.fn(),
    playThunder: vi.fn(),
  } as unknown as MagicalAudio;
}

describe('Bước A — Relaxed Cozy Pacing (5m -> 15m -> 1h -> 4h), Positive Seed ROI, Time Sand & Dual-Track Farm XP', () => {
  it('applies differentiated 5m..4h pacing across crops, animals, and recipes with positive seed ROI', () => {
    expect(FARM_CROPS.ottery_wheat.growSec).toBe(300); // 5m
    expect(FARM_CROPS.honey_carrot.growSec).toBe(300); // 5m
    expect(FARM_CROPS.garden_pumpkin.growSec).toBe(900); // 15m
    expect(FARM_CROPS.ruby_strawberry.growSec).toBe(1800); // 30m
    expect(FARM_CROPS.baby_mandrake.growSec).toBe(3600); // 1h
    expect(FARM_CROPS.dried_lavender.growSec).toBe(7200); // 2h
    expect(FARM_CROPS.phoenix_fireflower.growSec).toBe(14400); // 4h

    expect(PASTURE_ANIMALS.burrow_hen.cycleSec).toBe(300);
    expect(PASTURE_ANIMALS.daisy_cow.cycleSec).toBe(900);
    expect(PASTURE_ANIMALS.moon_unicorn.cycleSec).toBe(14400);

    const flourRcp = FARM_WORKSHOP_RECIPES.find((r) => r.id === 'rcp_wheat_flour')!;
    expect(flourRcp.craftSec).toBe(300);

    // Every crop seed must yield positive gross raw ROI (sellValue * yieldQty > seedCost)
    for (const crop of Object.values(FARM_CROPS)) {
      const grossRaw = crop.sellValue * crop.yieldQty;
      expect(crop.seedCost).toBe(computeBalancedSeedCost(crop.sellValue, crop.yieldQty));
      expect(grossRaw).toBeGreaterThan(crop.seedCost);
    }
    expect(computeRelaxedCozyCycleSec(1, 'building')).toBe(900);
  });

  it('rewards family rotation with -20% grow speed instead of punitive 1h -> 6h doubling', () => {
    const mono = computeStrategicPlotGrowSeconds(1, false, 0, 900);
    const rotated = computeStrategicPlotGrowSeconds(1, true, 0, 900);
    expect(rotated.isRotatedBonus).toBe(true);
    expect(rotated.growSec).toBeLessThan(900);
    expect(rotated.growSec).toBeLessThan(mono.growSec);
  });

  it('unlocks Time Sand in normal mode (15m/grain) and removes 1h lock on buildings < 2h', () => {
    expect(TIME_SAND_SKIP_SECONDS).toBe(900);
    expect(getMinRemainingBuildFloorSec(1800)).toBe(0); // < 2h finishes cleanly to 0s
    expect(getMinRemainingBuildFloorSec(7199)).toBe(0);
    expect(getMinRemainingBuildFloorSec(7200)).toBe(1800); // >= 2h max 30m floor

    const sim = new ParkSimulation(createMockAudio());
    sim.state.sandboxMode = false;
    sim.state.level = 10;
    sim.state.unlockedZones = ZONES.map((z) => z.id);
    sim.state.match3.stars = 500;
    sim.state.galleons = 100_000;
    sim.state.timeSand = 3;

    const coop = getCatalogItem('burrow_chicken_coop')!;
    expect(coop).toBeDefined();
    expect(sim.placeItem(coop, 22, 20, 0)).toBe(true);
    const placed = sim.state.buildings.find((b) => b.itemId === 'burrow_chicken_coop')!;
    expect(placed.constructEndsAt).toBeGreaterThan(Date.now());

    // Spending 1 Time Sand reduces build timer cleanly in normal mode
    const beforeEnd = placed.constructEndsAt;
    expect(sim.speedUpWithTimeSand(placed.uid, false)).toBe(true);
    expect(sim.state.timeSand).toBe(2);
    expect(placed.constructEndsAt).toBeLessThan(beforeEnd);
  });

  it('allows Farm Harvest Chests (200 XP) to advance level progress (Dual-Track Progression)', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.level = 1;
    sim.state.xp = 0;
    sim.state.puzzleLevelWinsProgress = 0;

    // Lv.1 needs 1 win -> 1 Farm Harvest Chest levels player smoothly from Lv.1 -> Lv.2
    sim.addXp(200);
    expect(sim.state.level).toBe(2);
    expect(sim.state.puzzleLevelWinsProgress).toBe(0);

    // At Lv.8 (requires 8 wins), Farm Chests contribute up to 50% (4 wins) then cap cleanly
    sim.state.level = 8;
    sim.state.puzzleLevelWinsProgress = 0;
    sim.addXp(200 * 6);
    expect(sim.state.level).toBe(8);
    expect(sim.state.puzzleLevelWinsProgress).toBe(4);

    // Milestone Lv.1 copy matches actual star costs (1 🌟 & 2 🌟)
    expect(LEVELS[0].milestoneNote).toContain('(1 🌟)');
    expect(LEVELS[0].milestoneNote).toContain('(2 🌟)');
  });
});
