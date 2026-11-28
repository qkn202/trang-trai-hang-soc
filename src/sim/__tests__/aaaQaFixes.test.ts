import { describe, expect, it, vi } from 'vitest';
import { ParkSimulation, setFarmStore } from '../simulation';
import { SudokuPuzzleEngine } from '../sudokuEngine';
import { MasterJigsawEngine } from '../jigsawEngine';
import { FishShooterEngine } from '../fishShooterEngine';
import { MinesweeperEngine } from '../minesweeperEngine';
import { getMinMovesForStage } from '../proofOfPlay';
import { applyFarmInbox } from '../../hpvn/inbox';

function createMockAudio(): ConstructorParameters<typeof ParkSimulation>[0] {
  return new Proxy(
    {},
    {
      get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()),
    }
  ) as unknown as ConstructorParameters<typeof ParkSimulation>[0];
}

describe('AAA QA Regression Suite — Core P0/P1 Fixes', () => {
  it('Sudoku undo preserves cells locked by Magic Hint / Phoenix Talisman', () => {
    const eng = new SudokuPuzzleEngine(1);
    let targetR = -1;
    let targetC = -1;
    for (let r = 0; r < 9 && targetR < 0; r++) {
      for (let c = 0; c < 9; c++) {
        if (!eng.given[r][c] && eng.grid[r][c] === 0) {
          targetR = r;
          targetC = c;
          break;
        }
      }
    }
    expect(targetR).toBeGreaterThanOrEqual(0);
    eng.selectCell(targetR, targetC);
    const wrongVal = (eng.solution[targetR][targetC] % 9) + 1;
    eng.inputDigit(wrongVal);
    const hintRes = eng.useMagicHint();
    expect(hintRes.ok).toBe(true);
    const hr = hintRes.r ?? targetR;
    const hc = hintRes.c ?? targetC;
    expect(eng.given[hr][hc]).toBe(true);
    expect(eng.grid[hr][hc]).toBe(eng.solution[hr][hc]);

    // Undo must NOT blank out a cell locked as given by Magic Hint / Talisman
    eng.undo();
    expect(eng.given[hr][hc]).toBe(true);
    expect(eng.grid[hr][hc]).toBe(eng.solution[hr][hc]);
    expect(eng.grid[hr][hc]).toBeGreaterThan(0);
  });

  it('Jigsaw Apple Pie boost keeps cluster integrity and blocks post-win invocation', () => {
    const eng = new MasterJigsawEngine(1);
    expect(eng.totalPieces).toBeGreaterThanOrEqual(9);
    eng.spawnTrayPieceOntoBoard(0, 0.25, 0.25);
    eng.spawnTrayPieceOntoBoard(1, 0.25, 0.25);
    const boost = eng.applyApplePieBoost();
    expect(boost.lockedPieces.length).toBeGreaterThan(0);

    for (let i = 0; i < eng.totalPieces; i++) {
      if (eng.pieceState[i] === 2) {
        expect(eng.getClusterMembers(i)).toEqual([]);
      } else if (eng.pieceState[i] === 1) {
        const members = eng.getClusterMembers(i);
        expect(members.length).toBeGreaterThanOrEqual(1);
        for (const m of members) {
          expect(eng.pieceState[m]).toBe(1);
        }
      }
    }

    while (eng.status !== 'won') {
      eng.useMagicHint();
    }
    expect(eng.status).toBe('won');
    const postWinBoost = eng.applyApplePieBoost();
    expect(postWinBoost.lockedPieces).toHaveLength(0);
    expect(postWinBoost.addedSec).toBe(0);
    expect(postWinBoost.won).toBe(true);
  });

  it('Fish Shooter blocks post-win Phoenix Talisman & Apple Pie boosts', () => {
    const eng = new FishShooterEngine(1);
    eng.status = 'won';
    expect(eng.applyPhoenixTalisman().ok).toBe(false);
    expect(eng.applyApplePieBoost().ok).toBe(false);
  });

  it('Minesweeper guards post-win boosters and Proof-of-Play allows 1-move clear', () => {
    expect(getMinMovesForStage('caro', 1)).toBe(1);
    const eng = new MinesweeperEngine(1);
    eng.tapCell(Math.floor(eng.rows / 2), Math.floor(eng.cols / 2));
    for (let r = 0; r < eng.rows && eng.status === 'playing'; r++) {
      for (let c = 0; c < eng.cols && eng.status === 'playing'; c++) {
        if (!eng.grid[r][c].hasMine && !eng.grid[r][c].revealed) {
          eng.tapCell(r, c);
        }
      }
    }
    expect(eng.status).toBe('won');
    expect(eng.applyPhoenixTalisman().ok).toBe(false);
    expect(eng.applyApplePieBoost().ok).toBe(false);
  });

  it('Neighbor visit claims persist Sickles & flags back to home state without wiping', () => {
    let saved: string | null = null;
    setFarmStore({ read: () => saved, write: (j) => { saved = j; } });
    const sim = new ParkSimulation(createMockAudio());
    const added = sim.addVerifiedRealFriend({
      userId: 'qa_friend_01',
      friendCode: 'HS-QA-01',
      name: 'Hagrid QA',
      parkName: 'Chòi Hagrid',
      level: 12,
      house: 'Gryffindor',
    });
    expect(added.ok).toBe(true);
    const targetId = added.neighbor!.id;
    const startGalleons = sim.state.galleons;
    const visit = sim.enterNeighborVisit(targetId);
    expect(visit.ok).toBe(true);
    expect(sim.isVisitingNeighbor).toBe(true);

    const loginRes = sim.claimLoginDayReward(1);
    expect(loginRes.ok).toBe(true);
    const expectedHomeGalleons = sim.homeStateWhileVisiting?.galleons ?? 0;
    expect(expectedHomeGalleons).toBeGreaterThan(startGalleons);
    expect(sim.state.galleons).toBe(expectedHomeGalleons);

    // Yule claims while visiting must be safely blocked
    const yuleRes = sim.claimYuleMainDay(1);
    expect(yuleRes.ok).toBe(false);

    sim.exitNeighborVisit(true);
    expect(sim.isVisitingNeighbor).toBe(false);
    expect(sim.state.galleons).toBe(expectedHomeGalleons);
    expect(sim.state.retention?.claimedLoginDays).toContain(1);
  });

  it('cancelLayoutEditMode preserves Sickles earned/spent during layout mode', () => {
    const sim = new ParkSimulation(createMockAudio());
    const start = sim.state.galleons;
    expect(sim.enterLayoutEditMode().ok).toBe(true);
    expect(sim.isLayoutEditModeActive()).toBe(true);
    sim.state.galleons = start + 777;
    sim.cancelLayoutEditMode();
    expect(sim.isLayoutEditModeActive()).toBe(false);
    expect(sim.state.galleons).toBe(start + 777);
  });

  it('applyFarmInbox stand-sale matches strictly by slotIndex when provided', () => {
    const sim = new ParkSimulation(createMockAudio());
    const stand = sim.ensureRoadsideStand();
    stand.slots = [
      {
        slotIndex: 0,
        itemId: 'ottery_wheat',
        qty: 3,
        unitPrice: 34,
        listedAt: Date.now() - 1000,
      },
      {
        slotIndex: 1,
        itemId: 'ottery_wheat',
        qty: 3,
        unitPrice: 34,
        listedAt: Date.now() - 1000,
      },
    ];

    const startGalleons = sim.state.galleons;
    const applied1 = applyFarmInbox(sim.state, [
      { seq: 1, kind: 'stand-sale', itemId: 'ottery_wheat', qty: 3, sickle: 100, slotIndex: 1, at: Date.now() },
    ]);
    expect(applied1).toHaveLength(1);
    expect(stand.slots[1].soldAt).toBeTruthy();
    expect(stand.slots[0].soldAt).toBeUndefined();

    // A second sale referencing slotIndex 1 (already sold) must NOT steal slot 0 with the same itemId
    const applied2 = applyFarmInbox(sim.state, [
      { seq: 2, kind: 'stand-sale', itemId: 'ottery_wheat', qty: 3, sickle: 100, slotIndex: 1, at: Date.now() },
    ]);
    expect(applied2).toHaveLength(1);
    expect(stand.slots[0].soldAt).toBeUndefined();
    expect(sim.state.galleons).toBe(startGalleons + 100);
  });
});
