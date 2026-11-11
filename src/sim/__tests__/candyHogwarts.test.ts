import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CANDY_ASSET_REV,
  CANDY_HOGWARTS_TOTAL_CHAPTERS,
  CANDY_HOGWARTS_TOTAL_LEVELS,
  CANDY_HOUSES,
  CANDY_OBSTACLE_ICONS,
  CANDY_TILE_TYPES,
  generateCandyHogwartsLevel,
  getCandyChapterForLevel,
  getCandyLevelById,
  getCandySeasonByLevel,
  HOGWARTS_SEASONS,
  toCandyHouseId,
  toEstateHouseName,
} from '../../data/candyHogwartsLevels';
import { CandyHogwartsBoardRenderer } from '../../engine/candyHogwartsRenderer';
import { Match3ModalController } from '../../ui/match3Modal';
import { PuzzleArcadeModalController } from '../../ui/puzzleArcadeModal';
import { MILESTONE_BOSS_STAGES } from '../../data/match3Levels';
import { MagicalAudio } from '../../engine/audio';
import { CandyHogwartsEngine } from '../candyHogwartsEngine';
import { ParkSimulation } from '../simulation';

describe('Candy Crush Hogwarts 7-Year × 777 Stages Generator & Engine', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it('generates all 777 stages cleanly across 7 Hogwarts Years, 77 Chapters, and 1,455 Magic Stars', () => {
    expect(CANDY_HOGWARTS_TOTAL_LEVELS).toBe(777);
    expect(CANDY_HOGWARTS_TOTAL_CHAPTERS).toBe(77);
    expect(HOGWARTS_SEASONS).toHaveLength(7);

    let starSum = 0;
    let hasTenByTen = false;
    const seenChapters = new Set<number>();

    for (let id = 1; id <= 777; id++) {
      const lv = generateCandyHogwartsLevel(id);
      expect(lv.id).toBe(id);
      expect(lv.size).toBeGreaterThanOrEqual(7);
      expect(lv.size).toBeLessThanOrEqual(10);
      if (lv.size === 10) hasTenByTen = true;
      expect(lv.moves).toBeGreaterThanOrEqual(12);
      expect(lv.objectives.length).toBeGreaterThanOrEqual(1);
      expect(lv.stars[2]).toBeGreaterThan(lv.stars[0]);

      const season = getCandySeasonByLevel(id);
      const chapter = getCandyChapterForLevel(id);
      expect(lv.seasonId).toBe(season.id);
      expect(lv.globalChapterId).toBe(chapter.globalChapterId);
      seenChapters.add(chapter.globalChapterId);
      starSum += lv.starReward;
    }

    expect(seenChapters.size).toBe(77);
    expect(hasTenByTen).toBe(true);
    expect(starSum).toBe(1455);

    // Verify all milestone boss stages and 7 Year Finales have 2-phase bossConfig
    for (const bossStage of [...MILESTONE_BOSS_STAGES, 111, 222, 333, 444, 555, 666, 777]) {
      const lv = getCandyLevelById(bossStage);
      expect(lv.isBoss).toBe(true);
      expect(lv.bossConfig).not.toBeNull();
      expect(lv.bossConfig!.maxHp).toBeGreaterThan(0);
    }

    const finale777 = getCandyLevelById(777);
    expect(finale777.isSeasonFinale).toBe(true);
    expect(finale777.bossConfig?.name).toContain('Voldemort');
  });

  it('spawns Year 2–7 signature mechanics in their respective Hogwarts Years', () => {
    const sumGrid = (g: number[][]) => g.reduce((acc, r) => acc + r.reduce((a, b) => a + b, 0), 0);

    // Year 2 (112..222): Petrify
    expect(sumGrid(getCandyLevelById(112).petrifyGrid)).toBeGreaterThan(0);
    // Year 3 (223..333): Dementors
    expect(sumGrid(getCandyLevelById(223).dementorGrid)).toBeGreaterThan(0);
    // Year 4 (334..444): Maze Wind & 10x10 Grand Board
    const y4Exam = getCandyLevelById(334);
    expect(y4Exam.mazeConfig).not.toBeNull();
    expect(y4Exam.mazeConfig!.rows.length).toBeGreaterThan(0);
    // Year 5 (445..555): Umbridge Decree
    expect(sumGrid(getCandyLevelById(445).decreeGrid)).toBeGreaterThan(0);
    // Year 6 (556..666): Fiendfyre
    expect(sumGrid(getCandyLevelById(556).fiendfyreGrid)).toBeGreaterThan(0);
    // Year 7 (667..777): Horcruxes with Soul Shield (HP >= 4)
    const y7Exam = getCandyLevelById(667);
    expect(sumGrid(y7Exam.horcruxGrid)).toBeGreaterThan(0);
    expect(y7Exam.horcruxGrid.some((row) => row.some((hp) => hp >= 4))).toBe(true);
  });

  it('crystallizes a Golden Snitch Seeker from a 2×2 square match and blocks special creation inside Year 5 Decree 3×3 aura', async () => {
    const baseLv = getCandyLevelById(1);
    const engine = new CandyHogwartsEngine(null);
    engine.loadLevel(baseLv, { house: 'gryffindor', instantAnimations: true });

    // Set up deterministic non-matching background
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        const p = engine.grid[r][c];
        if (p) {
          p.color = (r * 2 + c) % 4;
          p.special = null;
        }
      }
    }
    // Create a 2×2 square swap at (2,2)-(3,3) by swapping (2,1) into (2,2)
    engine.grid[2][1]!.color = 4;
    engine.grid[2][2]!.color = 1;
    engine.grid[2][3]!.color = 4;
    engine.grid[3][2]!.color = 4;
    engine.grid[3][3]!.color = 4;

    const swapped = await engine.trySwap({ r: 2, c: 1 }, { r: 2, c: 2 });
    expect(swapped).toBe(true);

    let hasSeeker = false;
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        if (engine.grid[r][c]?.special === 'seeker') {
          hasSeeker = true;
        }
      }
    }
    expect(hasSeeker || engine.specialStats.seeker > 0).toBe(true);

    // Now place a Year 5 Umbridge Decree at (4,4) and make a 4-match right next to it at row 3 cols 3..6
    engine.loadLevel(baseLv, { house: 'gryffindor', instantAnimations: true });
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        const p = engine.grid[r][c];
        if (p) {
          p.color = (r * 2 + c) % 4;
          p.special = null;
        }
      }
    }
    engine.decree[4][4] = 3;
    engine.grid[4][4] = null;
    // Swap (2,4) down into (3,4) to form horizontal 4-in-a-row at (3,3..6) within 3×3 aura of (4,4)
    engine.grid[2][4]!.color = 5;
    engine.grid[3][3]!.color = 5;
    engine.grid[3][4]!.color = 1;
    engine.grid[3][5]!.color = 5;
    engine.grid[3][6]!.color = 5;

    await engine.trySwap({ r: 2, c: 4 }, { r: 3, c: 4 });
    // Decree should take 1 adjacent damage (3 -> 2), and NO striped candy should crystallize at (3,4)
    expect(engine.decree[4][4]).toBe(2);
    expect(engine.specialStats.striped).toBe(0);
    engine.destroy();
  });

  it('enforces Year 7 Horcrux Soul Shield (HP >= 4) against normal matches, shatters via Hammer/Patronus for -600 Boss HP, and purges Year 3 Dementors', async () => {
    const bossLv = getCandyLevelById(777);
    const engine = new CandyHogwartsEngine(null);
    engine.loadLevel(bossLv, { house: 'gryffindor', instantAnimations: true });

    // Place a shielded Horcrux (HP = 4) at (3,3) and a Dementor at (1,1)
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        engine.mask[r][c] = 1;
        engine.horcrux[r][c] = 0;
        engine.dementor[r][c] = 0;
        engine.ice[r][c] = 0;
        engine.lockGrid[r][c] = 0;
        engine.petrify[r][c] = 0;
        engine.frosting[r][c] = 0;
        engine.chocolate[r][c] = 0;
        engine.cauldron[r][c] = 0;
        engine.decree[r][c] = 0;
        engine.fiendfyre[r][c] = 0;
      }
    }
    engine.horcrux[3][3] = 4;
    engine.grid[3][3] = null;
    engine.dementor[1][1] = 3;
    engine.grid[1][1] = null;

    // Normal adjacent match at (2,2)-(2,4) next to Horcrux (3,3) must bounce off HP >= 4 Soul Shield
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        if ((r === 3 && c === 3) || (r === 1 && c === 1)) continue;
        const p = engine.grid[r][c];
        if (p) {
          p.color = (r * 2 + c) % 4;
          p.special = null;
        }
      }
    }
    let seq = 0;
    const deterministicDrops = [0.88, 0.96, 0.88, 0.96, 0.88, 0.96, 0.88, 0.96];
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = deterministicDrops[seq % deterministicDrops.length];
      seq += 1;
      return v;
    });
    engine.grid[1][3]!.color = 4;
    engine.grid[2][2]!.color = 4;
    engine.grid[2][3]!.color = 1;
    engine.grid[2][4]!.color = 4;
    await engine.trySwap({ r: 1, c: 3 }, { r: 2, c: 3 });
    vi.restoreAllMocks();
    expect(engine.horcrux[3][3]).toBe(4);

    // Charge Patronus to 100% -> purges Dementor at (1,1) and Gryffindor Stag pierces Horcrux Soul Shield (4 -> 3)
    engine.patronusCharge = 100;
    const casted = await engine.castPatronus();
    expect(casted).toBe(true);
    expect(engine.dementor[1][1]).toBe(0);
    expect(engine.horcrux[3][3]).toBeLessThan(4);

    // Reduce Horcrux to 1 HP and smash with Hammer -> shatters for -600 true Boss HP
    engine.horcrux[3][3] = 1;
    const bossHpBefore = engine.bossHp;
    await engine.executeHammer(3, 3);
    expect(engine.horcrux[3][3]).toBe(0);
    expect(engine.bossHp).toBeLessThanOrEqual(Math.max(0, bossHpBefore - 600));
    engine.destroy();
  });

  it('charges Swap booster only on 2nd cell, enforces 1 Phoenix Talisman per attempt, and syncs 4 Houses with ParkSimulation', async () => {
    const consumed: string[] = [];
    const engine = new CandyHogwartsEngine(null, {
      onBoosterConsumed: (kind) => {
        consumed.push(kind);
        return true;
      },
    });
    const lv = getCandyLevelById(5);
    engine.loadLevel(lv, { house: 'hufflepuff', instantAnimations: true });
    // Hufflepuff passive starts at 25% Patronus
    expect(engine.patronusCharge).toBe(25);

    const startMoves = engine.movesLeft;
    engine.setBoosterMode('swap');
    expect(consumed).toHaveLength(0);

    // Pick two adjacent matchable cells dynamically
    let swapA = { r: 0, c: 0 };
    let swapB = { r: 0, c: 1 };
    let bombCell = { r: 0, c: 0 };
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size - 1; c++) {
        if (
          engine.isCellMatchable(r, c) &&
          engine.isCellMatchable(r, c + 1) &&
          !engine.isCellLocked(r, c) &&
          !engine.isCellLocked(r, c + 1)
        ) {
          swapA = { r, c };
          swapB = { r, c: c + 1 };
          break;
        }
      }
    }

    // Pick 1st cell -> still not consumed
    engine.activateCellInteraction(swapA);
    expect(consumed).toHaveLength(0);

    // Pick 2nd adjacent cell -> free swap executes, consumes booster, does NOT spend a move
    await engine.trySwap(swapA, swapB);
    expect(consumed).toEqual(['swap']);
    expect(engine.movesLeft).toBe(startMoves);

    // Put a countdown bomb on a live candy and test Phoenix Talisman (+5 moves, +6 bomb turns, max 1 use)
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        if (engine.grid[r][c] && !engine.grid[r][c]!.blocker) {
          bombCell = { r, c };
        }
      }
    }
    const trackedPiece = engine.grid[bombCell.r][bombCell.c]!;
    trackedPiece.bombTimer = 2;
    const firstTalisman = await engine.applyPhoenixTalisman();
    expect(firstTalisman.ok).toBe(true);
    expect(engine.talismanUsed).toBe(true);
    expect(engine.movesLeft).toBe(startMoves + 5);
    expect(trackedPiece.bombTimer ?? 8).toBeGreaterThanOrEqual(7);

    const secondTalisman = await engine.applyPhoenixTalisman();
    expect(secondTalisman.ok).toBe(false);

    // Verify bidirectional House sync with ParkSimulation
    const mockStorage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => mockStorage.get(k) ?? null,
      setItem: (k: string, v: string) => mockStorage.set(k, String(v)),
      removeItem: (k: string) => mockStorage.delete(k),
      clear: () => mockStorage.clear(),
    });
    const sim = new ParkSimulation(new MagicalAudio());
    for (const hId of ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'] as const) {
      const estateName = toEstateHouseName(hId);
      sim.setPlayerHouse(estateName, 'match3');
      expect(toCandyHouseId(sim.getPlayerHouse())).toBe(hId);
      expect(CANDY_HOUSES[hId].houseName).toBe(estateName);
    }
    const rolled = sim.rollPlayerSortingHat('match3');
    expect(['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff']).toContain(rolled);

    engine.destroy();
  });

  it('persists lastPlayedMinigame across saves, never forces Wizard Chess at Level 14, and groups Hagrid HUD layout cleanly', async () => {
    const { GameHUD } = await import('../../ui/hud');
    const { shellMountDOM } = await import('../../ui/hudShell');

    const mockStorage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => mockStorage.get(k) ?? null,
      setItem: (k: string, v: string) => mockStorage.set(k, String(v)),
      removeItem: (k: string) => mockStorage.delete(k),
      clear: () => mockStorage.clear(),
    });

    const sim = new ParkSimulation(new MagicalAudio());
    expect(sim.getLastPlayedMinigame()).toBe('match3');

    // Force Level 14 where legacy getRequiredLevelTrial() used to mandate 'chess'
    sim.state.level = 14;
    expect(sim.getRequiredLevelTrial()?.kind).toBe('chess');
    expect(sim.getLastPlayedMinigame()).toBe('match3');

    // Verify GameHUD.openTrialMinigame() with no args opens lastPlayedMinigame instead of 'chess'
    const openedCalls: string[] = [];
    const fakeHud = {
      sim,
      closeHudPopovers: () => {},
      openMatch3Dialog: () => openedCalls.push('match3'),
      openPuzzleArcadeDialog: (mode?: string) => openedCalls.push(`arcade:${mode}`),
      openSeedQuizDialog: () => openedCalls.push('seedquiz'),
    } as unknown as InstanceType<typeof GameHUD>;

    fakeHud.openLastPlayedMinigame = GameHUD.prototype.openLastPlayedMinigame.bind(fakeHud);
    const openTrial = GameHUD.prototype.openTrialMinigame.bind(fakeHud);

    openTrial();
    expect(openedCalls).toEqual(['match3']);

    sim.setLastPlayedMinigame('caro');
    sim.saveToStorage();

    const reloadedSim = new ParkSimulation(new MagicalAudio());
    expect(reloadedSim.getLastPlayedMinigame()).toBe('caro');

    (fakeHud as unknown as { sim: ParkSimulation }).sim = reloadedSim;
    openTrial();
    expect(openedCalls).toEqual(['match3', 'arcade:caro']);

    reloadedSim.setLastPlayedMinigame('seedquiz');
    openTrial();
    expect(openedCalls).toEqual(['match3', 'arcade:caro', 'seedquiz']);

    // Verify Hagrid HUD structural layout produced by shellMountDOM
    let mountedHtml = '';
    vi.stubGlobal('document', {
      createElement: () => ({
        className: '',
        innerHTML: '',
      }),
    });
    shellMountDOM({
      questCollapsed: false,
      minimapCollapsed: true,
      root: {
        appendChild: (el: { innerHTML: string }) => {
          mountedHtml = el.innerHTML;
        },
        querySelector: () => null,
      },
    } as unknown as InstanceType<typeof GameHUD>);

    const menuStart = mountedHtml.indexOf('id="managePopoverMenu"');
    const menuEnd = mountedHtml.indexOf('</nav>', menuStart);
    const menuMarkup = mountedHtml.slice(menuStart, menuEnd);
    expect(menuMarkup).toContain('id="btnOpenWorldMap"');

    const leftStart = mountedHtml.indexOf('id="tsCornerLeft"');
    const leftEnd = mountedHtml.indexOf('</div>', leftStart);
    const leftMarkup = mountedHtml.slice(leftStart, leftEnd);
    expect(leftMarkup).toContain('id="btnOpenQuests"');
    expect(leftMarkup).toContain('id="btnOpenSeedSilo"');
    expect(leftMarkup).toContain('id="btnOpenPastureTray"');
    expect(leftMarkup).toContain('id="btnToggleBuildDock"');
    expect(leftMarkup).not.toContain('id="btnOpenWorldMap"');

    const rightStart = mountedHtml.indexOf('id="tsCornerRight"');
    const rightEnd = mountedHtml.indexOf('</div>', rightStart);
    const rightMarkup = mountedHtml.slice(rightStart, rightEnd);
    expect(rightMarkup).toContain('id="btnCornerPlayPuzzle"');
    expect(rightMarkup).toContain('hg-hero-play-btn');
    expect(rightMarkup).not.toContain('id="btnToggleBuildDock"');
    expect(rightMarkup).not.toContain('id="btnOpenWorldMap"');
  });

  it('wires Hang Sóc 2.5D candy, chocolate frog, spreading chocolate, frosting waffle & caramel swirl sprites with cache-busting', () => {
    expect(CANDY_TILE_TYPES).toHaveLength(6);
    for (const tile of CANDY_TILE_TYPES) {
      expect(tile.webp).toContain(`?v=${CANDY_ASSET_REV}`);
      expect(tile.png).toContain(`?v=${CANDY_ASSET_REV}`);
    }
    expect(CANDY_TILE_TYPES[4].name).toContain('Ếch Sô-cô-la');
    expect(CANDY_OBSTACLE_ICONS.chocolate).toContain(`candy-chocolate.webp?v=${CANDY_ASSET_REV}`);
    expect(CANDY_OBSTACLE_ICONS.frosting).toContain(`candy-frosting.webp?v=${CANDY_ASSET_REV}`);
    expect(CANDY_OBSTACLE_ICONS.swirl).toContain(`candy-swirl.webp?v=${CANDY_ASSET_REV}`);

    const loadedUrls: string[] = [];
    class FakeImage {
      public decoding = '';
      public src = '';
      public onload: (() => void) | null = null;
      public onerror: (() => void) | null = null;
      constructor() {
        loadedUrls.push('');
      }
    }
    const instances: FakeImage[] = [];
    vi.stubGlobal(
      'Image',
      class extends FakeImage {
        constructor() {
          super();
          instances.push(this);
        }
      }
    );

    const renderer = new CandyHogwartsBoardRenderer({
      width: 468,
      height: 468,
      getContext: () => null,
    } as unknown as HTMLCanvasElement);

    // 6*4 candy variants + color_bomb + chocolate_block + chocolate_deluxe + frosting_waffle + swirl_piece = 29
    expect(instances).toHaveLength(29);
    const srcs = instances.map((im) => im.src);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-chocolate.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-chocolate-deluxe.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-frosting.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-swirl.webp?v=${CANDY_ASSET_REV}`);

    // Verify query-preserving .png fallback on .webp error
    const firstImg = instances[0];
    firstImg.onerror?.();
    expect(firstImg.src).toBe(`/paintings/candy-hogwarts/candy-0.png?v=${CANDY_ASSET_REV}`);
    renderer.destroy();
  });

  it('completely removes the House / Sorting Hat / Patronus Rage panel from Match3ModalController DOM', () => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => storage.get(k) ?? null,
      setItem: (k: string, v: string) => storage.set(k, v),
      removeItem: (k: string) => storage.delete(k),
      clear: () => storage.clear(),
    });

    const contentEl = {
      innerHTML: '',
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    const dialogEl = {
      open: false,
      returnValue: '',
      addEventListener: () => {},
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
    };
    const rootStub = {
      querySelector: (sel: string) => {
        if (sel === '#match3Dialog') return dialogEl;
        if (sel === '#match3DialogContent') return contentEl;
        return null;
      },
    } as unknown as HTMLElement;

    const sim = new ParkSimulation(new MagicalAudio());
    const ctrl = new Match3ModalController(rootStub, sim, () => {}, () => {});
    ctrl.open(15);

    expect(contentEl.innerHTML).toContain('pa-layout-shell');
    expect(contentEl.innerHTML).toContain('pa-side-dock');
    expect(contentEl.innerHTML).toContain('m3-dock-hud');
    expect(contentEl.innerHTML).toContain('m3-booster-row');
    expect(contentEl.innerHTML).not.toContain('m3-layout-shell');
    expect(contentEl.innerHTML).not.toContain('m3-patronus-box');
    expect(contentEl.innerHTML).not.toContain('btnM3RollSortingHat');
    expect(contentEl.innerHTML).not.toContain('m3PatronusMeter');
    expect(contentEl.innerHTML).not.toContain('btnM3CastPatronus');
    expect(contentEl.innerHTML).not.toContain('data-m3-house');
    expect(contentEl.innerHTML).not.toContain('Nộ Hộ Mệnh');
    expect(contentEl.innerHTML).not.toContain('Gọi Hươu Bạc');

    // Verify simplified synergy dock (ONLY Bánh Táo + Niffler) and removed clutter badges
    expect(contentEl.innerHTML).toContain('btnM3SnackApplePie');
    expect(contentEl.innerHTML).toContain('btnM3TriggerCompanion');
    expect(contentEl.innerHTML).not.toContain('btnM3SnackButterbeer');
    expect(contentEl.innerHTML).not.toContain('aaa-sawtooth-tag');
    expect(contentEl.innerHTML).not.toContain('Tiến độ Lv.');
    expect(contentEl.innerHTML).not.toContain('m3-diff-pill');

    // Verify all 4 modes of PuzzleArcadeModalController apply the exact same cleanup
    vi.stubGlobal('window', {
      addEventListener: () => {},
      removeEventListener: () => {},
      matchMedia: () => ({ matches: false, addEventListener: () => {} }),
      devicePixelRatio: 1,
    });
    vi.stubGlobal('requestAnimationFrame', () => 1);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal(
      'Image',
      class {
        src = '';
      }
    );
    const paContentEl = {
      innerHTML: '',
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    const paDialogEl = {
      open: false,
      returnValue: '',
      addEventListener: () => {},
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
    };
    const paRootStub = {
      querySelector: (sel: string) => {
        if (sel === '#puzzleArcadeDialog') return paDialogEl;
        if (sel === '#puzzleArcadeDialogContent') return paContentEl;
        return null;
      },
    } as unknown as HTMLElement;

    const paCtrl = new PuzzleArcadeModalController(
      paRootStub,
      sim,
      () => {},
      () => {},
      () => {}
    );
    for (const mode of ['caro', 'sudoku', 'chess', 'blocks'] as const) {
      paCtrl.open(mode);
      expect(paContentEl.innerHTML).toContain('btnPaSnackApplePie');
      expect(paContentEl.innerHTML).toContain('btnPaTriggerCompanion');
      expect(paContentEl.innerHTML).not.toContain('btnPaSnackButterbeer');
      expect(paContentEl.innerHTML).not.toContain('aaa-sawtooth-tag');
      expect(paContentEl.innerHTML).not.toContain('Tiến độ Lv.');
      expect(paContentEl.innerHTML).not.toContain('pa-reward-preview');
    }

    // Verify victory overlay keeps ONLY the Magic Stars earned badge
    const overlayMountEl = {
      innerHTML: '',
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    (contentEl as unknown as { querySelector: (s: string) => unknown }).querySelector = (
      sel: string
    ) => (sel === '#m3OverlayMount' ? overlayMountEl : null);
    (rootStub as unknown as { querySelector: (s: string) => unknown }).querySelector = (
      sel: string
    ) => {
      if (sel === '#match3Dialog') return dialogEl;
      if (sel === '#match3DialogContent') return contentEl;
      if (sel === '#m3OverlayMount') return overlayMountEl;
      return null;
    };

    ctrl.engine!.status = 'won';
    (ctrl as unknown as { handleEngineGameEnd: (p: unknown) => void }).handleEngineGameEnd({
      won: true,
      levelId: 15,
      score: 47211,
      stars: 3,
      movesLeft: 4,
      bonusCoinsFromLeftoverMoves: 20,
      failReason: null,
    });

    expect(overlayMountEl.innerHTML).toContain('m3-reward-chip star');
    expect(overlayMountEl.innerHTML).toContain('🌟');
    expect(overlayMountEl.innerHTML).not.toContain('Điểm phép:');
    expect(overlayMountEl.innerHTML).not.toContain('XP');
    expect(overlayMountEl.innerHTML).not.toContain('Gryffindor');
    ctrl.resetSession();
  });
});
