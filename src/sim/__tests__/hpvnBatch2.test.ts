// HPVN: batch 2 of the QA fixes (economy loops, house lock, owl rerolls, story quick-build, demolition warning).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FARM_CROPS, getCatalogItem } from '../../data/catalog';
import { ZONES } from '../../data/zones';
import { createInitialLanguageQuizState, generateNextQuizChallenge } from '../languageQuizEngine';
import { QUIZ_DAILY_REWARD_CAP } from '../simulationFarm';
import { setFarmStore, ParkSimulation } from '../simulation';

const audio = new Proxy({}, { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }) as never;

function newSim(): ParkSimulation {
  setFarmStore({ read: () => null, write: () => {} });
  return new ParkSimulation(audio);
}

describe('HPVN batch 2', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('3: the ribbon-cut reward pays once per building type, later cuts only unveil', () => {
    const sim = newSim();
    sim.state.level = 30;
    sim.state.unlockedZones = ZONES.map((z) => z.id);
    sim.state.match3.stars = 1000;
    sim.state.galleons = 50_000;
    const item = getCatalogItem('burrow_cider_apiary')!;
    const cycle = () => {
      expect(sim.placeItem(item, 22, 20, 0)).toBe(true);
      const b = sim.state.buildings.find((x) => x.itemId === item.id)!;
      const nowMs = Date.now();
      b.placedAt = nowMs - 12_000;
      b.constructEndsAt = nowMs - 1_000;
      sim.update(0.5);
      expect(b.awaitingUnveil).toBe(true);
      const gold = sim.state.galleons;
      const feast = sim.ensureHarvestFeast().points;
      const celebration = sim.unveilBuilding(b.uid)!;
      expect(b.awaitingUnveil).toBeUndefined();
      const paid = { sickle: sim.state.galleons - gold, feast: sim.ensureHarvestFeast().points - feast, celebration };
      sim.removeAtTile(22, 20);
      return paid;
    };
    const first = cycle();
    expect(first.sickle).toBeGreaterThan(0);
    expect(first.feast).toBe(25);
    const second = cycle();
    expect(second.sickle).toBe(0);
    expect(second.feast).toBe(0);
    expect(second.celebration.bonusSickle).toBe(0);
    expect(sim.state.ribbonPaidItems).toEqual([item.id]);
  });

  it('4: at most 30 rewarded quiz answers a VN day, then practice; wrong answers give 0 XP', () => {
    const sim = newSim();
    const ch = generateNextQuizChallenge(createInitialLanguageQuizState(), 1);
    const wrong = sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...ch, qId: 'wrong' }, false);
    expect(wrong.xpAwarded).toBe(0);
    expect(wrong.seedsAwarded).toBe(0);
    let last = sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...ch, qId: 'q0' }, true);
    for (let i = 1; i < QUIZ_DAILY_REWARD_CAP; i++) {
      expect(last.practice).toBeUndefined();
      expect(last.seedsAwarded).toBeGreaterThan(0);
      last = sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...ch, qId: `q${i}` }, true);
    }
    expect(last.capReached).toBe(true); // the 30th was still rewarded
    const seeds = sim.getSeedCount('ottery_wheat');
    const xp = sim.state.xp;
    const talisman = sim.state.quizTalismanProgress;
    const practice = sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...ch, qId: 'q31' }, true);
    expect(practice.practice).toBe(true);
    expect(practice.correct).toBe(true);
    expect(practice.seedsAwarded).toBe(0);
    expect(practice.xpAwarded).toBe(0);
    expect(sim.getSeedCount('ottery_wheat')).toBe(seeds);
    expect(sim.state.xp).toBe(xp);
    expect(sim.state.quizTalismanProgress).toBe(talisman);
    expect(sim.state.quizRewardDaily?.count).toBe(QUIZ_DAILY_REWARD_CAP);
    // a new VN day starts the count again
    sim.state.quizRewardDaily = { dayKey: '2000-01-01', count: QUIZ_DAILY_REWARD_CAP };
    const next = sim.completeSeedLanguageQuizAttempt('ottery_wheat', { ...ch, qId: 'q32' }, true);
    expect(next.seedsAwarded).toBeGreaterThan(0);
    expect(sim.state.quizRewardDaily?.count).toBe(1);
  });

  it('5: a harvest into a full Kho never pays more than harvesting and then selling the stock', () => {
    const crop = FARM_CROPS.ottery_wheat;
    const harvestTotal = (full: boolean) => {
      const sim = newSim();
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
      Object.assign(plot, { cropId: crop.id, cropReadyAt: Date.now() - 1000 });
      const barn = sim.ensureFarmBarn();
      if (full) barn.capacity = sim.getBarnTotalUsed();
      const before = sim.state.galleons;
      const before0 = sim.getFarmItemCount(crop.id);
      expect(sim.harvestCropPlot(plot.uid).ok).toBe(true);
      if (!full) sim.sellFarmItemFromBarn(crop.id, crop.yieldQty);
      else expect(sim.getFarmItemCount(crop.id)).toBe(before0);
      return sim.state.galleons - before;
    };
    expect(harvestTotal(true)).toBe(harvestTotal(false));
  });

  it('6: 3 free owl-order rerolls per VN day, delivering does not reset them', () => {
    const sim = newSim();
    const barn = sim.ensureFarmBarn();
    expect(sim.getOwlRerollsLeft()).toBe(3);
    for (let i = 0; i < 3; i++) expect(sim.refreshFarmOwlOrder(barn.owlOrders[0].id)).toBe(true);
    expect(sim.getOwlRerollsLeft()).toBe(0);
    expect(sim.refreshFarmOwlOrder(barn.owlOrders[0].id)).toBe(false);
    // delivering (even a failed attempt here) never touches the count
    sim.fulfillFarmOwlOrder(barn.owlOrders[0].id);
    expect(sim.getOwlRerollsLeft()).toBe(0);
    sim.state.owlRerollDaily = { dayKey: '2000-01-01', count: 3 };
    expect(sim.getOwlRerollsLeft()).toBe(3);
  });

  it('10: a locked HPVN house cannot be changed by the Sorting Hat or by picking', () => {
    const sim = newSim();
    expect(sim.lockPlayerHouse('Slytherin')).toBe('Slytherin');
    expect(sim.getPlayerHouse()).toBe('Slytherin');
    expect(sim.setPlayerHouse('Ravenclaw')).toBe('Slytherin');
    for (let i = 0; i < 10; i++) expect(sim.rollPlayerSortingHat()).toBe('Slytherin');
    expect(sim.getPlayerHouse()).toBe('Slytherin');
  });

  it('11: the story quick-build finds a spot on a fresh farm (no house, no connected road yet)', () => {
    const sim = newSim();
    const preview = sim.getStoryAutoActionPreview();
    expect(preview.starCost).toBe(1);
    expect(preview.shortLabel).toContain('1 🌟');
    const res = sim.completeStoryStepWithStar();
    expect(res.ok).toBe(true);
    expect(sim.state.buildings.some((b) => b.itemId === 'burrow_house_canon')).toBe(true);
  });

  it('12: demolishing a ready crop is flagged for confirmation, an empty plot is not', () => {
    const sim = newSim();
    const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot' && b.cropId)!;
    Object.assign(plot, { cropReadyAt: Date.now() - 1000 });
    expect(sim.getRemovalLossText(plot.gx, plot.gy)).toContain('đã chín');
    const empty = sim.state.buildings.find((b) => b.itemId === 'farmland_plot' && !b.cropId)!;
    expect(sim.getRemovalLossText(empty.gx, empty.gy)).toBeNull();
  });
});
