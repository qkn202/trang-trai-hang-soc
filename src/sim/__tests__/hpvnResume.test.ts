// HPVN: the open mini-game marker lives in the farm save, so a reload (F5) reopens the run.
import { expect, it, vi } from 'vitest';
import { setFarmStore, ParkSimulation } from '../simulation';

const audio = new Proxy({}, { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }) as never;

it('keeps activeMinigameResume through a save and a reload', () => {
  let saved: string | null = null;
  setFarmStore({ read: () => saved, write: (j) => { saved = j; } });
  const sim = new ParkSimulation(audio);
  sim.state.activeMinigameResume = { dialog: 'puzzleArcade', mode: 'sudoku', stage: 7, savedAt: 123 };
  sim.saveToStorage();
  const reloaded = new ParkSimulation(audio);
  expect(reloaded.state.activeMinigameResume).toEqual({ dialog: 'puzzleArcade', mode: 'sudoku', stage: 7, savedAt: 123 });
});
