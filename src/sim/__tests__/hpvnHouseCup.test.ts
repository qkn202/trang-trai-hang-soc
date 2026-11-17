// HPVN: the cup view is a memory copy of server replies; a member reply keeps the week totals it does not carry.
import { expect, it, vi } from 'vitest';
import { applyHouseCup, houseCup, houseWeekPoints } from '../../hpvn/houseCup';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';
import { shellMountDOM } from '../../ui/hudShell';
import { questsUiOpenHouseCupIntroDialog, questsUiRenderHouseCupIntroDialog } from '../../ui/hudQuestsAndSettings';

it('keeps only server numbers, merging member replies into the last week totals', () => {
  expect([houseCup(), houseWeekPoints('Gryffindor')]).toEqual([null, 0]);
  applyHouseCup({ weekKey: '2026-W46', houses: { Gryffindor: 95, Ravenclaw: '60', Bogus: 9 }, house: 'Ravenclaw', memberTodayPoints: 60, memberDailyCap: 60, memberBank: 60, memberTier: 1, perTier: 300 });
  expect([houseWeekPoints('Gryffindor'), houseWeekPoints('Ravenclaw'), houseWeekPoints('Slytherin')]).toEqual([95, 60, 0]);
  applyHouseCup({ memberTodayPoints: 20, memberDailyCap: 60, memberBank: 10, memberTier: 4, perTier: 300 }); // a save reply
  expect(houseCup()).toMatchObject({ weekKey: '2026-W46', house: 'Ravenclaw', memberBank: 10, memberTier: 4, memberTodayPoints: 20 });
  applyHouseCup({ house: null, memberTodayPoints: -5 });
  expect(houseCup()).toMatchObject({ house: null, memberTodayPoints: 0, memberTier: 1, perTier: 300 });
});

it('mounts #houseCupIntroDialog and renders House Cup startup popup with live standings, rules, and play/close actions', async () => {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: string, enc: string) => string };
  const path = (await import(/* @vite-ignore */ 'node:' + 'path')) as { resolve: (...parts: string[]) => string };
  const mainTs = fs.readFileSync(path.resolve('src/main.ts'), 'utf8');
  expect(mainTs).toContain('hud.openHouseCupIntroDialog()');

  let mountedHtml = '';
  vi.stubGlobal('document', {
    createElement: () => ({ className: '', innerHTML: '', querySelector: () => ({}) }),
  });
  shellMountDOM({
    root: {
      appendChild: (node: { innerHTML: string }) => { mountedHtml = node.innerHTML; },
      querySelector: () => ({}),
    },
    minimapCanvas: null,
  } as never);
  vi.unstubAllGlobals();
  expect(mountedHtml).toContain('<dialog id="houseCupIntroDialog" closedby="any" aria-labelledby="houseCupIntroDialogTitle">');
  expect(mountedHtml).toContain('id="houseCupIntroDialogContent"');

  applyHouseCup({
    weekKey: '2026-W47',
    houses: { Gryffindor: 420, Slytherin: 380, Ravenclaw: 510, Hufflepuff: 290 },
    house: 'Ravenclaw',
    memberTodayPoints: 40,
    memberDailyCap: 60,
    memberBank: 140,
    memberTier: 2,
    perTier: 300,
  });

  const sim = new ParkSimulation(new MagicalAudio());
  sim.lockPlayerHouse('Ravenclaw');

  const btnHandlers = new Map<string, () => void>();
  const contentBox = {
    innerHTML: '',
    querySelector: (sel: string) => ({
      addEventListener: (ev: string, fn: () => void) => {
        if (ev === 'click') btnHandlers.set(sel, fn);
      },
    }),
  };
  const introDlg = {
    open: false,
    showModal() { this.open = true; },
    close() { this.open = false; },
  };
  const opened: string[] = [];
  const fakeHud = {
    sim,
    hasShownHouseCupIntro: false,
    closeHudPopovers: vi.fn(),
    openMatch3Dialog: () => opened.push('match3'),
    openPuzzleArcadeDialog: (mode?: string) => opened.push(String(mode)),
    root: {
      querySelector: (sel: string) => {
        if (sel === '#houseCupIntroDialog') return introDlg;
        if (sel === '#houseCupIntroDialogContent') return contentBox;
        return null;
      },
    },
  };

  questsUiOpenHouseCupIntroDialog(fakeHud as never);
  expect(fakeHud.hasShownHouseCupIntro).toBe(true);
  expect(fakeHud.closeHudPopovers).toHaveBeenCalledTimes(1);
  expect(introDlg.open).toBe(true);
  expect(contentBox.innerHTML).toContain('Mùa giải Tuần 2026-W47');
  expect(contentBox.innerHTML).toContain('Nhà Ravenclaw');
  expect(contentBox.innerHTML).toContain('Hôm nay: 40/60 đ · Cúp Đợt 2: 140/300 đ');
  expect(contentBox.innerHTML).toContain('crest-ravenclaw.webp');
  expect(contentBox.innerHTML).toContain('510 đ');
  expect(contentBox.innerHTML).toContain('Bùa Gặt');
  expect(contentBox.innerHTML).toContain('Số Học');
  expect(contentBox.innerHTML).toContain('Sinh Vật');
  expect(contentBox.innerHTML).toContain('Tranh Ghép');
  expect(contentBox.innerHTML).toContain('Sickle');
  expect(contentBox.innerHTML).toContain('Cát Thời Gian');

  // Clicking close closes the popup
  btnHandlers.get('#btnCupIntroClose')?.();
  expect(introDlg.open).toBe(false);

  // Clicking "Thi đấu ngay" closes the popup and opens last scored minigame (or match3 fallback)
  sim.setLastPlayedMinigame('sudoku');
  questsUiOpenHouseCupIntroDialog(fakeHud as never);
  expect(introDlg.open).toBe(true);
  btnHandlers.get('#btnCupIntroPlay')?.();
  expect(introDlg.open).toBe(false);
  expect(opened).toEqual(['sudoku']);

  sim.setLastPlayedMinigame('chess');
  questsUiRenderHouseCupIntroDialog(fakeHud as never);
  btnHandlers.get('#btnCupIntroPlay')?.();
  expect(opened).toEqual(['sudoku', 'match3']);

  // House: null shows unsorted notice safely
  applyHouseCup({ house: null, memberTodayPoints: 0, memberDailyCap: 60, memberBank: 0, memberTier: 1, perTier: 300 });
  questsUiRenderHouseCupIntroDialog(fakeHud as never);
  expect(contentBox.innerHTML).toContain('Chưa phân Nhà trên HPVN');
  expect(contentBox.innerHTML).toContain('ui_trophy_cup.webp');
});
