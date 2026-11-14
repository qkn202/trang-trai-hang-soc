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

    // Force Level 16 where getRequiredLevelTrial() rotates to 'chess' (across 6 disciplines)
    sim.state.level = 16;
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

    // 6 normal candies + 6 Gardenscapes colorless power-ups (firecracker, bomb, dynamite, tnt, seeker, rainbow) + 4 obstacles = 16
    expect(instances).toHaveLength(16);
    const srcs = instances.map((im) => im.src);
    expect(srcs).toContain(`/paintings/candy-hogwarts/powerup-firecracker.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/powerup-bomb.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/powerup-dynamite.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/powerup-tnt.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/powerup-seeker.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-chocolate.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-chocolate-deluxe.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-frosting.webp?v=${CANDY_ASSET_REV}`);
    expect(srcs).toContain(`/paintings/candy-hogwarts/candy-swirl.webp?v=${CANDY_ASSET_REV}`);
    // Ensure old Candy Crush striped/wrapped sprites are NOT loaded on the board
    expect(srcs.some((s) => /-sh\.webp|-sv\.webp|-wrapped\.webp|candy-colorbomb\.webp/.test(s))).toBe(false);

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
    expect(contentEl.innerHTML).toContain('btnM3RainbowMeter');
    expect(contentEl.innerHTML).toContain('m3RainbowProgressBar');
    expect(contentEl.innerHTML).toContain('m3RainbowFill');
    expect(contentEl.innerHTML).toContain('m3RainbowPctVal');
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

  it('implements Playrix Gardenscapes radial Power-Up ladder (4->firecracker, 5->bomb, 6->dynamite, 7+->tnt, 2x2->seeker) and colorless match immunity', () => {
    const lv = getCandyLevelById(12);
    const engine = new CandyHogwartsEngine(null);
    engine.loadLevel(lv, { instantAnimations: true });

    const resetCleanBoard = () => {
      for (let r = 0; r < engine.size; r++) {
        for (let c = 0; c < engine.size; c++) {
          engine.mask[r][c] = 1;
          engine.ice[r][c] = 0;
          engine.frosting[r][c] = 0;
          engine.lockGrid[r][c] = 0;
          engine.petrify[r][c] = 0;
          engine.decree[r][c] = 0;
          engine.grid[r][c] = engine.createPiece((r * 2 + c) % 4, c, r, null);
        }
      }
    };

    // 1. Match-4 -> firecracker
    resetCleanBoard();
    for (let c = 1; c <= 4; c++) engine.grid[2][c]!.color = 5;
    let clusters = engine.findMatchClusters([{ r: 2, c: 2 }]);
    expect(clusters.find((cl) => cl.color === 5)?.spawnSpecial).toBe('firecracker');

    // 2. Match-5 -> bomb (NOT direct color_bomb!)
    resetCleanBoard();
    for (let c = 1; c <= 5; c++) engine.grid[2][c]!.color = 5;
    clusters = engine.findMatchClusters([{ r: 2, c: 3 }]);
    expect(clusters.find((cl) => cl.color === 5)?.spawnSpecial).toBe('bomb');

    // 3. Match-6 -> dynamite
    resetCleanBoard();
    for (let c = 1; c <= 6; c++) engine.grid[2][c]!.color = 5;
    clusters = engine.findMatchClusters([{ r: 2, c: 3 }]);
    expect(clusters.find((cl) => cl.color === 5)?.spawnSpecial).toBe('dynamite');

    // 4. Match-7 -> tnt
    resetCleanBoard();
    for (let c = 0; c <= 6; c++) engine.grid[2][c]!.color = 5;
    clusters = engine.findMatchClusters([{ r: 2, c: 3 }]);
    expect(clusters.find((cl) => cl.color === 5)?.spawnSpecial).toBe('tnt');

    // 5. 2x2 Square -> seeker (Chong Chóng)
    resetCleanBoard();
    engine.grid[3][3]!.color = 5;
    engine.grid[3][4]!.color = 5;
    engine.grid[4][3]!.color = 5;
    engine.grid[4][4]!.color = 5;
    clusters = engine.findMatchClusters([{ r: 3, c: 3 }]);
    expect(clusters.find((cl) => cl.color === 5)?.spawnSpecial).toBe('seeker');

    // 6. Colorless immunity: Power-Ups do not accidentally dissolve in 3-matches of plain tiles
    resetCleanBoard();
    engine.grid[5][2]!.color = 5;
    engine.grid[5][3] = engine.createPiece(5, 3, 5, 'bomb');
    engine.grid[5][4]!.color = 5;
    expect(engine.findMatchClusters()).toHaveLength(0);

    engine.destroy();
  });

  it('supports Gardenscapes double-tap in place, swap-with-any-neighbor detonation, Gardening Glove free swap, Mega Combos, and chargeable Rainbow Blast meter', async () => {
    const lv = getCandyLevelById(25);
    const engine = new CandyHogwartsEngine(null);
    engine.loadLevel(lv, { instantAnimations: true });

    const prepareDeterministicGrid = () => {
      for (let r = 0; r < engine.size; r++) {
        for (let c = 0; c < engine.size; c++) {
          engine.mask[r][c] = 1;
          engine.jelly[r][c] = 0;
          engine.ice[r][c] = 0;
          engine.frosting[r][c] = 0;
          engine.chocolate[r][c] = 0;
          engine.cauldron[r][c] = 0;
          engine.lockGrid[r][c] = 0;
          engine.petrify[r][c] = 0;
          engine.dementor[r][c] = 0;
          engine.decree[r][c] = 0;
          engine.fiendfyre[r][c] = 0;
          engine.horcrux[r][c] = 0;
          engine.grid[r][c] = engine.createPiece((r * 2 + c) % 4, c, r, null);
        }
      }
      // Keep an incomplete score goal high enough that the stage doesn't auto-win mid-test
      engine.level = {
        ...engine.level!,
        objectives: [{ type: 'score', target: 9_999_999 }],
      };
    };

    // A) Swap Power-Up with ANY non-matching neighbor detonates at destination & charges Rainbow Meter
    prepareDeterministicGrid();
    const startMoves = engine.movesLeft;
    engine.grid[3][3] = engine.createPiece(0, 3, 3, 'firecracker');
    engine.frosting[2][4] = 1; // Within 3x3 of destination (3,4), outside 3x3 of (3,2)
    engine.grid[2][4] = null;

    const swapped = await engine.trySwap({ r: 3, c: 3 }, { r: 3, c: 4 });
    expect(swapped).toBe(true);
    expect(engine.movesLeft).toBe(startMoves - 1);
    expect(engine.frosting[2][4]).toBe(0);
    expect(engine.rainbowCharge).toBeGreaterThanOrEqual(28);

    // B) Gardening Glove ('swap' booster) repositions a Power-Up for 0 moves WITHOUT detonating it
    prepareDeterministicGrid();
    engine.rainbowCharge = 0;
    const movesBeforeGlove = engine.movesLeft;
    engine.grid[4][2] = engine.createPiece(0, 2, 4, 'bomb');
    engine.setBoosterMode('swap');
    const gloveSwapped = await engine.trySwap({ r: 4, c: 2 }, { r: 4, c: 3 });
    expect(gloveSwapped).toBe(true);
    expect(engine.movesLeft).toBe(movesBeforeGlove);
    expect(engine.grid[4][3]?.special).toBe('bomb');
    expect(engine.rainbowCharge).toBe(0);

    // C) Double-tapping an armed Power-Up detonates it in place and crosses 100% Rainbow Charge -> spawns color_bomb!
    engine.rainbowCharge = 70; // 70 + 45 (bomb) = 115 -> 1 Rainbow Blast + 15% carry-over!
    engine.frosting[4][5] = 1; // distance 2 from (4,3) -> inside Bomb radius-2 blast!
    engine.grid[4][5] = null;

    // 1st tap selects the Bomb
    (engine as unknown as { activateCellInteraction: (c: { r: number; c: number }) => void }).activateCellInteraction({
      r: 4,
      c: 3,
    });
    expect(engine.getHudSnapshot()?.selectedSpecial).toBe('bomb');

    // 2nd tap on the same cell detonates it in place
    const detonatedInPlace = await engine.tryActivateSpecialInPlace({ r: 4, c: 3 });
    expect(detonatedInPlace).toBe(true);
    expect(engine.frosting[4][5]).toBe(0);
    expect(engine.rainbowCharge).toBeGreaterThanOrEqual(15);

    let spawnedColorBombs = 0;
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        if (engine.grid[r][c]?.special === 'color_bomb') spawnedColorBombs++;
      }
    }
    expect(spawnedColorBombs).toBeGreaterThanOrEqual(1);

    // Round-trip session persistence for new Gardenscapes specials & Rainbow Charge
    engine.grid[1][1] = engine.createPiece(0, 1, 1, 'tnt');
    const saved = engine.exportSession();
    expect(saved?.rainbowCharge).toBe(engine.rainbowCharge);
    const engine2 = new CandyHogwartsEngine(null);
    engine2.loadLevel(engine.level!, { instantAnimations: true });
    expect(engine2.restoreSession(saved)).toBe(true);
    expect(engine2.grid[1][1]?.special).toBe('tnt');
    expect(engine2.rainbowCharge).toBe(engine.rainbowCharge);
    engine2.destroy();

    // D) Double Color Bomb strips 2 layers across the entire board in one turn
    prepareDeterministicGrid();
    engine.frosting[0][0] = 2;
    engine.grid[0][0] = null;
    engine.frosting[6][6] = 2;
    engine.grid[6][6] = null;
    engine.grid[3][3] = engine.createPiece(-1, 3, 3, 'color_bomb');
    engine.grid[3][4] = engine.createPiece(-1, 4, 3, 'color_bomb');
    await engine.trySwap({ r: 3, c: 3 }, { r: 3, c: 4 });
    expect(engine.frosting[0][0]).toBe(0);
    expect(engine.frosting[6][6]).toBe(0);

    // E) Spinner + Bomb carrier combo flies to remote obstacle and detonates radius-2 blast there
    prepareDeterministicGrid();
    engine.level = {
      ...engine.level!,
      objectives: [
        { type: 'frosting', target: 5 },
        { type: 'score', target: 9_999_999 },
      ],
    };
    engine.frosting[0][6] = 1;
    engine.grid[0][6] = null;
    engine.frosting[1][6] = 1; // neighbor of (0,6), destroyed by carried Bomb radius!
    engine.grid[1][6] = null;
    engine.grid[6][1] = engine.createPiece(0, 1, 6, 'seeker');
    engine.grid[6][2] = engine.createPiece(0, 2, 6, 'bomb');
    await engine.trySwap({ r: 6, c: 1 }, { r: 6, c: 2 });
    expect(engine.frosting[0][6]).toBe(0);
    expect(engine.frosting[1][6]).toBe(0);

    engine.destroy();
  });

  it('activates Gardenscapes 2026 Super Rainbow Blast at winStreak >= 5 (clears 2 colors, dual-color Power-Up army, double board-refill wipe, and resets on loss)', async () => {
    const { sanitizeSavedMatch3Session } = await import('../simulationData');
    const lv = getCandyLevelById(30);
    const engine = new CandyHogwartsEngine(null);

    const setupControlledBoard = () => {
      for (let r = 0; r < engine.size; r++) {
        for (let c = 0; c < engine.size; c++) {
          engine.mask[r][c] = 1;
          engine.jelly[r][c] = 0;
          engine.ice[r][c] = 0;
          engine.frosting[r][c] = 0;
          engine.chocolate[r][c] = 0;
          engine.cauldron[r][c] = 0;
          engine.lockGrid[r][c] = 0;
          engine.petrify[r][c] = 0;
          engine.dementor[r][c] = 0;
          engine.decree[r][c] = 0;
          engine.fiendfyre[r][c] = 0;
          engine.horcrux[r][c] = 0;
          // Colors 0..3 with no initial 3-in-a-row
          engine.grid[r][c] = engine.createPiece((r * 2 + c) % 4, c, r, null);
        }
      }
      engine.collected = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      engine.level = {
        ...engine.level!,
        objectives: [{ type: 'score', target: 99_999_999 }],
      };
    };

    // 1. Streak 4 (< 5): Standard Rainbow Blast clears ONLY 1 color
    engine.loadLevel(lv, { winStreak: 4, instantAnimations: true });
    expect(engine.superRainbow).toBe(false);
    setupControlledBoard();
    // Place two isolated color-4 pieces and three isolated color-5 pieces so no cascade matches form
    engine.grid[1][1] = engine.createPiece(4, 1, 1, null);
    engine.grid[5][5] = engine.createPiece(4, 5, 5, null);
    engine.grid[0][4] = engine.createPiece(5, 4, 0, null);
    engine.grid[2][6] = engine.createPiece(5, 6, 2, null);
    engine.grid[6][2] = engine.createPiece(5, 2, 6, null);
    engine.grid[1][0] = engine.createPiece(-1, 0, 1, 'color_bomb');

    // Mock refill to only spawn colors 0..3 so cascade cannot collect 4 or 5
    let dropIdx = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.05, 0.22, 0.38, 0.55];
      return vals[dropIdx++ % vals.length];
    });
    await engine.trySwap({ r: 1, c: 0 }, { r: 1, c: 1 });
    vi.restoreAllMocks();
    expect(engine.collected[4]).toBe(2);
    expect(engine.collected[5]).toBe(0);

    // 2. Streak 5 (>= SUPER_RAINBOW_WIN_STREAK): Super Rainbow Blast clears BOTH swapped color AND top abundant color!
    engine.loadLevel(lv, { winStreak: 5, instantAnimations: true });
    expect(engine.superRainbow).toBe(true);
    setupControlledBoard();
    // Make color 5 strictly the most abundant color on board, and swap Super Rainbow with color 4
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < engine.size; c++) {
        if ((r + c) % 2 === 0) {
          engine.grid[r][c] = engine.createPiece(5, c, r, null);
        }
      }
    }
    engine.grid[6][2] = engine.createPiece(4, 2, 6, null);
    engine.grid[6][5] = engine.createPiece(4, 5, 6, null);
    engine.grid[6][1] = engine.createPiece(-1, 1, 6, 'color_bomb');

    dropIdx = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.05, 0.22, 0.38, 0.55];
      return vals[dropIdx++ % vals.length];
    });
    await engine.trySwap({ r: 6, c: 1 }, { r: 6, c: 2 });
    vi.restoreAllMocks();
    // Both color 4 AND color 5 were wiped simultaneously!
    expect(engine.collected[4]).toBeGreaterThanOrEqual(2);
    expect(engine.collected[5]).toBeGreaterThanOrEqual(20);

    // 3. Double-tapping Super Rainbow in place clears top 2 distinct colors simultaneously
    setupControlledBoard();
    engine.grid[3][3] = engine.createPiece(-1, 3, 3, 'color_bomb');
    dropIdx = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.72, 0.88]; // colors 4 & 5 on refill
      return vals[dropIdx++ % vals.length];
    });
    await engine.tryActivateSpecialInPlace({ r: 3, c: 3 });
    vi.restoreAllMocks();
    const clearedInitialColors = [0, 1, 2, 3].filter((k) => (engine.collected[k] || 0) >= 8);
    expect(clearedInitialColors.length).toBeGreaterThanOrEqual(2);

    // 4. Super Rainbow + Bomb converts TWO colors across the board into Bombs and detonates them
    setupControlledBoard();
    engine.specialStats.wrapped = 0;
    engine.grid[2][2] = engine.createPiece(-1, 2, 2, 'color_bomb');
    engine.grid[2][3] = engine.createPiece(0, 3, 2, 'bomb');
    await engine.trySwap({ r: 2, c: 2 }, { r: 2, c: 3 });
    // On a 7x7 4-color board (~12 tiles per color), converting 2 colors spawns >20 bombs!
    expect(engine.specialStats.wrapped).toBeGreaterThanOrEqual(18);

    // 5. Super Rainbow + Super Rainbow wipes board, refills, and wipes a 2nd time (stripping 3 obstacle layers!)
    setupControlledBoard();
    engine.frosting[0][0] = 3; // Normal double color_bomb only strips 2 layers; Super strips 3!
    engine.grid[0][0] = null;
    engine.grid[3][3] = engine.createPiece(-1, 3, 3, 'color_bomb');
    engine.grid[3][4] = engine.createPiece(-1, 4, 3, 'color_bomb');
    await engine.trySwap({ r: 3, c: 3 }, { r: 3, c: 4 });
    expect(engine.frosting[0][0]).toBe(0);

    // 5. Session save -> sanitize -> restore preserves superRainbow
    const rawSaved = engine.exportSession();
    expect(rawSaved?.superRainbow).toBe(true);
    const sanitized = sanitizeSavedMatch3Session(rawSaved, engine.level!.id);
    expect(sanitized?.superRainbow).toBe(true);
    const restoredEngine = new CandyHogwartsEngine(null);
    restoredEngine.loadLevel(engine.level!, { winStreak: 0, instantAnimations: true });
    expect(restoredEngine.superRainbow).toBe(false);
    expect(restoredEngine.restoreSession(sanitized)).toBe(true);
    expect(restoredEngine.superRainbow).toBe(true);
    restoredEngine.destroy();

    // 6. Losing a level resets ParkSimulation match3.winStreak to 0 -> deactivates Super Rainbow
    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.sandboxMode = false;
    sim.state.match3.winStreak = 6;
    sim.loseMatch3Heart();
    expect(sim.state.match3.winStreak).toBe(0);

    engine.destroy();
  });
});
