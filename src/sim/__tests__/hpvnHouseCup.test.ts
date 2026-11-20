// HPVN: the cup view is a memory copy of server replies; a member reply keeps the week totals it does not carry.
import { expect, it, vi } from 'vitest';
import {
  applyHouseCup,
  computeDisciplineBracketTotals,
  computeHousePointsForLeaderboardRank,
  computeHousePointsFromLeaderboardEntries,
  computeStageDifficultyPoints,
  computeWeeklyStageProgressScore,
  getIsoWeekSerial,
  getWeeklyHouseAlliances,
  HOUSE_CUP_MIN_STAGES_FOR_POINTS,
  houseCup,
  houseCupAlliances,
  houseCupAllianceStandings,
  houseCupDisciplineSummaries,
  houseCupFirstPlaceCounts,
  houseCupStageScoreBands,
  houseWeekPoints,
  rankAndScoreDisciplineFromWeeklyPlayers,
} from '../../hpvn/houseCup';
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
  expect(contentBox.innerHTML).toContain('200.000 Galleons');
  expect(contentBox.innerHTML).not.toContain('hs-cup-intro-rules');
  expect(contentBox.innerHTML).not.toContain('hs-cup-rank-box');

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

it('scores Discipline Medal Bracket independently per discipline so 1-game grinding cannot dominate the House Cup', () => {
  // Ravenclaw has 2 hardcore Match-3 grinders with 50,000 raw pts in Bùa Gặt but barely plays the other 5 disciplines;
  // Gryffindor & Hufflepuff play broadly across all 6 disciplines with zero daily cap.
  const disciplines = {
    match3: { Ravenclaw: 50_000, Gryffindor: 400, Hufflepuff: 300, Slytherin: 200 },
    caro: { Gryffindor: 320, Hufflepuff: 260, Slytherin: 180, Ravenclaw: 0 },
    sudoku: { Hufflepuff: 340, Gryffindor: 240, Slytherin: 200, Ravenclaw: 40 },
    chess: { Gryffindor: 380, Slytherin: 280, Hufflepuff: 220, Ravenclaw: 0 },
    blocks: { Slytherin: 300, Gryffindor: 240, Hufflepuff: 240, Ravenclaw: 60 }, // tie for #2
    jigsaw: { Hufflepuff: 280, Gryffindor: 200, Slytherin: 160, Ravenclaw: 0 },
  };

  const calc = computeDisciplineBracketTotals(disciplines);
  // Ravenclaw gets 100 (match3 #1) + 0 (caro 0pts) + 25 (sudoku #4) + 0 (chess 0pts) + 25 (blocks #4) + 0 (jigsaw 0pts) = 150!
  expect(calc.houses.Ravenclaw).toBe(150);
  // Gryffindor gets 75 + 100 + 75 + 100 + 75 (tied #2) + 75 = 500!
  expect(calc.houses.Gryffindor).toBe(500);
  // Hufflepuff gets 50 + 75 + 100 + 50 + 75 (tied #2) + 100 = 450!
  expect(calc.houses.Hufflepuff).toBe(450);
  // Slytherin gets 25 + 50 + 50 + 75 + 100 + 50 = 350!
  expect(calc.houses.Slytherin).toBe(350);
  expect(calc.firstPlaceCounts).toEqual({
    Gryffindor: 2,
    Hufflepuff: 2,
    Ravenclaw: 1,
    Slytherin: 1,
  });

  // Verify applyHouseCup merges medal mode cleanly & computes totals when server omits pre-summed `houses`
  applyHouseCup({
    weekKey: '2026-W48',
    mode: 'medals',
    unlimited: true,
    disciplines,
    house: 'Gryffindor',
    memberTodayPoints: 180,
    memberDailyCap: 0,
    memberBank: 220,
    memberTier: 3,
    perTier: 300,
  });

  expect(houseCup()).toMatchObject({
    weekKey: '2026-W48',
    mode: 'medals',
    unlimited: true,
    memberTodayPoints: 180,
    memberDailyCap: 0,
  });
  expect(houseWeekPoints('Gryffindor')).toBe(500);
  expect(houseWeekPoints('Ravenclaw')).toBe(150);
  expect(houseCupFirstPlaceCounts().Gryffindor).toBe(2);
  expect(houseCupDisciplineSummaries()).toHaveLength(6);

  // Verify UI renders all 6 discipline arenas, unlimited copy, gap-to-first, and click-to-jump buttons
  const sim = new ParkSimulation(new MagicalAudio());
  sim.lockPlayerHouse('Gryffindor');
  const discHandlers = new Map<string, () => void>();
  const opened: string[] = [];
  const introDlg = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
  const contentBox = {
    innerHTML: '',
    querySelector: () => ({ addEventListener: () => {} }),
    querySelectorAll: (sel: string) => {
      if (sel !== '[data-cup-play]') return [];
      return ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw'].map((id) => ({
        dataset: { cupPlay: id },
        addEventListener: (ev: string, fn: () => void) => {
          if (ev === 'click') discHandlers.set(id, fn);
        },
      }));
    },
  };
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
  expect(contentBox.innerHTML).not.toContain('hs-cup-intro-rules');
  expect(contentBox.innerHTML).not.toContain('hs-cup-rank-box');
  expect(contentBox.innerHTML).toContain('2 nhất môn');
  expect(contentBox.innerHTML).toContain('Dò Mìn');
  expect(contentBox.innerHTML).toContain('Bắn Cá');
  expect(contentBox.innerHTML).toContain('Hạng 1 · +100 đ Cúp');
  expect(contentBox.innerHTML).toContain('Kém 49.600');

  // Clicking a discipline arena card closes the popup and launches that minigame directly
  discHandlers.get('chess')?.();
  expect(introDlg.open).toBe(false);
  expect(opened).toEqual(['chess']);
});

it('rotates 2 Alliances formed from the 4 Houses every week without consecutive repeats and computes combined Alliance Cup standings', () => {
  // 1. Consecutive ISO weeks (including across year boundary 2026-W53 -> 2027-W01) always advance serial by +1
  expect(getIsoWeekSerial('2026-W47') - getIsoWeekSerial('2026-W46')).toBe(1);
  expect(getIsoWeekSerial('2026-W48') - getIsoWeekSerial('2026-W47')).toBe(1);
  expect(getIsoWeekSerial('2027-W01') - getIsoWeekSerial('2026-W53')).toBe(1);

  // 2. Over any 3 consecutive weeks, Gryffindor teams up with all 3 other Houses exactly once
  const w1 = getWeeklyHouseAlliances('2026-W46');
  const w2 = getWeeklyHouseAlliances('2026-W47');
  const w3 = getWeeklyHouseAlliances('2026-W48');
  const gryfAllies = [w1, w2, w3].map((pair) => {
    const all4 = new Set([...pair[0].houses, ...pair[1].houses]);
    expect(all4.size).toBe(4);
    const mine = pair.find((a) => a.houses.includes('Gryffindor'))!;
    return mine.houses.find((h) => h !== 'Gryffindor')!;
  });
  expect(new Set(gryfAllies)).toEqual(new Set(['Hufflepuff', 'Ravenclaw', 'Slytherin']));

  // 3. Alliance standings sum both allied Houses' Cup points & respect optional server custom alliance pairing
  applyHouseCup({
    weekKey: '2026-W48',
    mode: 'medals',
    unlimited: true,
    houses: { Gryffindor: 500, Hufflepuff: 450, Slytherin: 350, Ravenclaw: 150 },
    alliances: [
      { id: 'alliance_a', nameVi: 'Liên Minh Bứt Phá', houses: ['Gryffindor', 'Ravenclaw'] },
      { id: 'alliance_b', nameVi: 'Liên Minh Kiên Cường', houses: ['Hufflepuff', 'Slytherin'] },
    ],
    house: 'Ravenclaw',
    memberTodayPoints: 60,
    memberDailyCap: 0,
    memberBank: 60,
    memberTier: 1,
    perTier: 300,
  });

  expect(houseCupAlliances()[0].nameVi).toBe('Liên Minh Bứt Phá');
  const [topAlly, secondAlly] = houseCupAllianceStandings('Ravenclaw');
  // Hufflepuff (450) + Slytherin (350) = 800 vs Gryffindor (500) + Ravenclaw (150) = 650!
  expect(topAlly.nameVi).toBe('Liên Minh Kiên Cường');
  expect(topAlly.points).toBe(800);
  expect(topAlly.rank).toBe(1);
  expect(secondAlly.nameVi).toBe('Liên Minh Bứt Phá');
  expect(secondAlly.points).toBe(650);
  expect(secondAlly.rank).toBe(2);
  expect(secondAlly.isPlayerAlliance).toBe(true);
  expect(secondAlly.allyHouse).toBe('Gryffindor');

  // 4. UI displays the 2-Alliance matchup & ally House inside #houseCupIntroDialog
  const sim = new ParkSimulation(new MagicalAudio());
  sim.lockPlayerHouse('Ravenclaw');
  const contentBox = {
    innerHTML: '',
    querySelector: () => ({ addEventListener: () => {} }),
    querySelectorAll: () => [],
  };
  const introDlg = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
  questsUiOpenHouseCupIntroDialog({
    sim,
    hasShownHouseCupIntro: false,
    closeHudPopovers: vi.fn(),
    openMatch3Dialog: vi.fn(),
    openPuzzleArcadeDialog: vi.fn(),
    root: {
      querySelector: (sel: string) =>
        sel === '#houseCupIntroDialog' ? introDlg : sel === '#houseCupIntroDialogContent' ? contentBox : null,
    },
  } as never);
  expect(contentBox.innerHTML).toContain('Liên Minh Tuần Này (2 vs 2)');
  expect(contentBox.innerHTML).toContain('Liên Minh Kiên Cường');
  expect(contentBox.innerHTML).toContain('Liên Minh Bứt Phá');
  expect(contentBox.innerHTML).toContain('800 đ');
  expect(contentBox.innerHTML).toContain('650 đ');
  expect(contentBox.innerHTML).toContain('Đồng minh tuần này: Nhà Gryffindor');
});

it('awards rank-tiered House points to any player clearing >= 5 stages (higher rank = more points, < 5 stages = 0)', () => {
  expect(HOUSE_CUP_MIN_STAGES_FOR_POINTS).toBe(5);

  // Under 5 stages earns 0 House points regardless of rank
  expect(computeHousePointsForLeaderboardRank(1, 0)).toBe(0);
  expect(computeHousePointsForLeaderboardRank(1, 4)).toBe(0);

  // Reaching 5+ stages guarantees points; higher rank earns strictly more points
  expect(computeHousePointsForLeaderboardRank(1, 5)).toBe(100);
  expect(computeHousePointsForLeaderboardRank(2, 5)).toBe(80);
  expect(computeHousePointsForLeaderboardRank(3, 5)).toBe(65);
  expect(computeHousePointsForLeaderboardRank(4, 5)).toBe(50);
  expect(computeHousePointsForLeaderboardRank(5, 5)).toBe(50);
  expect(computeHousePointsForLeaderboardRank(6, 5)).toBe(35);
  expect(computeHousePointsForLeaderboardRank(10, 5)).toBe(35);
  expect(computeHousePointsForLeaderboardRank(11, 5)).toBe(20);
  expect(computeHousePointsForLeaderboardRank(20, 5)).toBe(20);
  expect(computeHousePointsForLeaderboardRank(99, 5)).toBe(20);

  // 2 solo grinders (#1 + #2 = 180 pts) cannot outscore a House with 8 active players clearing >= 5 stages!
  const agg = computeHousePointsFromLeaderboardEntries([
    { house: 'Ravenclaw', rank: 1, clearedStages: 300 },
    { house: 'Ravenclaw', rank: 2, clearedStages: 240 },
    { house: 'Gryffindor', rank: 3, clearedStages: 18 },
    { house: 'Gryffindor', rank: 4, clearedStages: 14 },
    { house: 'Gryffindor', rank: 6, clearedStages: 10 },
    { house: 'Gryffindor', rank: 8, clearedStages: 9 },
    { house: 'Gryffindor', rank: 12, clearedStages: 7 },
    { house: 'Gryffindor', rank: 15, clearedStages: 6 },
    { house: 'Gryffindor', rank: 22, clearedStages: 5 },
    { house: 'Gryffindor', rank: 30, clearedStages: 5 },
    { house: 'Hufflepuff', rank: 5, clearedStages: 4 }, // < 5 stages -> 0 pts
  ]);
  expect(agg.houses.Ravenclaw).toBe(180);
  expect(agg.houses.Gryffindor).toBe(65 + 50 + 35 + 35 + 20 + 20 + 20 + 20); // 265 > 180!
  expect(agg.houses.Hufflepuff).toBe(0);
  expect(agg.qualifiedCounts).toEqual({ Gryffindor: 8, Ravenclaw: 2, Slytherin: 0, Hufflepuff: 0 });
});

it('Cách A: weights weekly stage clears by difficulty bands so Stage 60 players compete fairly against Stage 5 players', () => {
  // Exact difficulty band values: 1-15 -> 20, 16-40 -> 25, 41-80 -> 30, 81+ -> 35
  expect(computeStageDifficultyPoints(1)).toBe(20);
  expect(computeStageDifficultyPoints(15)).toBe(20);
  expect(computeStageDifficultyPoints(16)).toBe(25);
  expect(computeStageDifficultyPoints(40)).toBe(25);
  expect(computeStageDifficultyPoints(41)).toBe(30);
  expect(computeStageDifficultyPoints(60)).toBe(30);
  expect(computeStageDifficultyPoints(80)).toBe(30);
  expect(computeStageDifficultyPoints(81)).toBe(35);
  expect(computeStageDifficultyPoints(500)).toBe(35);

  // Crossing band boundary 14 -> 17: stage 15 (20) + stage 16 (25) + stage 17 (25) = 70
  expect(computeWeeklyStageProgressScore(14, 17)).toEqual({ deltaStages: 3, weightedScore: 70 });

  // Anti-spike clamp: max 10 stages counted per save request
  expect(computeWeeklyStageProgressScore(0, 25, 10)).toEqual({ deltaStages: 10, weightedScore: 200 });

  // Worked example: Player A at Stage 60 clears 5 stages (60 -> 65) = 5 * 30 = 150 weekly pts
  const playerA = computeWeeklyStageProgressScore(60, 65);
  expect(playerA).toEqual({ deltaStages: 5, weightedScore: 150 });

  // Player B at Stage 5 clears 7 stages (5 -> 12) = 7 * 20 = 140 weekly pts (< 150)
  const playerB7 = computeWeeklyStageProgressScore(5, 12);
  expect(playerB7).toEqual({ deltaStages: 7, weightedScore: 140 });

  // Player C at Stage 5 clears 8 stages (5 -> 13) = 8 * 20 = 160 weekly pts (> 150)
  const playerC8 = computeWeeklyStageProgressScore(5, 13);
  expect(playerC8).toEqual({ deltaStages: 8, weightedScore: 160 });

  // Player D at Stage 60 clears only 4 stages (60 -> 64) = 120 pts, but < 5 stages -> 0 House points!
  const playerD4 = computeWeeklyStageProgressScore(60, 64);
  expect(playerD4).toEqual({ deltaStages: 4, weightedScore: 120 });

  const scored = rankAndScoreDisciplineFromWeeklyPlayers([
    { house: 'Ravenclaw', weeklyCleared: playerA.deltaStages, weeklyWeightedScore: playerA.weightedScore },
    { house: 'Gryffindor', weeklyCleared: playerB7.deltaStages, weeklyWeightedScore: playerB7.weightedScore },
    { house: 'Hufflepuff', weeklyCleared: playerC8.deltaStages, weeklyWeightedScore: playerC8.weightedScore },
    { house: 'Slytherin', weeklyCleared: playerD4.deltaStages, weeklyWeightedScore: playerD4.weightedScore },
  ]);

  // Ranking: #1 Hufflepuff (160 -> +100), #2 Ravenclaw (150 -> +80), #3 Gryffindor (140 -> +65), Slytherin disqualified (< 5)
  expect(scored.ranked.map((r) => [r.house, r.rank, r.contributionPoints])).toEqual([
    ['Hufflepuff', 1, 100],
    ['Ravenclaw', 2, 80],
    ['Gryffindor', 3, 65],
  ]);
  expect(scored.houses).toEqual({ Hufflepuff: 100, Ravenclaw: 80, Gryffindor: 65, Slytherin: 0 });
  expect(scored.qualifiedCounts).toEqual({ Hufflepuff: 1, Ravenclaw: 1, Gryffindor: 1, Slytherin: 0 });

  // Server custom stageScoreBands override via applyHouseCup
  applyHouseCup({
    weekKey: '2026-W48',
    stageScoreBands: [
      { maxStage: 20, pointsPerStage: 10, labelVi: 'Màn 1–20' },
      { maxStage: null, pointsPerStage: 20, labelVi: 'Màn 21+' },
    ],
    memberTodayPoints: 0,
    memberDailyCap: 0,
    memberBank: 0,
    memberTier: 1,
    perTier: 300,
  });
  expect(houseCupStageScoreBands()).toEqual([
    { maxStage: 20, pointsPerStage: 10, labelVi: 'Màn 1–20' },
    { maxStage: null, pointsPerStage: 20, labelVi: 'Màn 21+' },
  ]);
});
