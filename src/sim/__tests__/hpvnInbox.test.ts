// HPVN: helps from other members wait in the server inbox; each applies once and its number rides in the save.
import { expect, it, vi } from 'vitest';
import { setFarmStore, ParkSimulation } from '../simulation';
import { applyFarmInbox } from '../../hpvn/inbox';

const audio = new Proxy({}, { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }) as never;

it('takes 15 minutes off growing crops once per entry and remembers the entry through a save', () => {
  let saved: string | null = null;
  setFarmStore({ read: () => saved, write: (j) => { saved = j; } });
  const sim = new ParkSimulation(audio);
  const now = 1_000_000_000;
  const plot = sim.state.buildings[0];
  Object.assign(plot, { cropId: 'wheat', cropReadyAt: now + 3_600_000 });
  const help = (seq: number) => ({ seq, kind: 'help', uid: `u${seq}`, name: `Bạn ${seq}`, at: now });
  expect(applyFarmInbox(sim.state, [help(2), help(1)], now).map((e) => e.seq)).toEqual([1, 2]);
  expect(plot.cropReadyAt).toBe(now + 3_600_000 - 2 * 900_000);
  expect(plot.cropWateredBoost).toBe(true);
  // the same entries again (an older save reply) change nothing; a crop never ripens faster than 30 s from now
  expect(applyFarmInbox(sim.state, [help(1), help(2)], now)).toEqual([]);
  applyFarmInbox(sim.state, [help(3), help(4), help(5)], now);
  expect(plot.cropReadyAt).toBe(now + 30_000);
  expect(applyFarmInbox(sim.state, 'junk', now)).toEqual([]);
  sim.saveToStorage();
  expect(new ParkSimulation(audio).state.hpvnInboxSeq).toBe(5);
});

it('adds Sickles bought at Gringotts once, into the wallet state (the visited farm while visiting), and keeps them through a save', () => {
  let saved: string | null = null;
  setFarmStore({ read: () => saved, write: (j) => { saved = j; } });
  const sim = new ParkSimulation(audio);
  const start = sim.state.galleons;
  const wallet = { ...sim.state, galleons: 7 } as typeof sim.state;
  const buy = (seq: number, sickle: unknown) => ({ seq, kind: 'sickles', sickle, galleons: 1000, at: 1 });
  applyFarmInbox(sim.state, [buy(1, 17_000)], 1, wallet);
  expect([sim.state.galleons, wallet.galleons, sim.state.hpvnInboxSeq]).toEqual([start, 17_007, 1]);
  // a re-delivered entry (retry reply, older save reply) adds nothing; a malformed one only moves the number
  applyFarmInbox(sim.state, [buy(1, 17_000), buy(2, -5), buy(3, 1.5)], 1);
  expect([sim.state.galleons, sim.state.hpvnInboxSeq]).toEqual([start, 3]);
  applyFarmInbox(sim.state, [buy(4, 1_700)], 1);
  sim.saveToStorage();
  const reloaded = new ParkSimulation(audio).state;
  expect([reloaded.galleons, reloaded.hpvnInboxSeq]).toEqual([start + 1_700, 4]);
});

it('applies a server «Cúp Đợt» reward once (Sickles + Cát Thời Gian; XP goes through sim.addXp in main.ts)', () => {
  let saved: string | null = null;
  setFarmStore({ read: () => saved, write: (j) => { saved = j; } });
  const sim = new ParkSimulation(audio);
  const [sickles, sand] = [sim.state.galleons, sim.state.timeSand];
  const cup = { seq: 1, kind: 'cup', tier: 2, sickle: 92, xp: 220, sand: 1, at: 1 };
  expect(applyFarmInbox(sim.state, [cup], 1).map((e) => e.kind)).toEqual(['cup']);
  expect(applyFarmInbox(sim.state, [cup], 1)).toEqual([]);
  expect([sim.state.galleons, sim.state.timeSand, sim.state.hpvnInboxSeq]).toEqual([sickles + 92, sand + 1, 1]);
});
