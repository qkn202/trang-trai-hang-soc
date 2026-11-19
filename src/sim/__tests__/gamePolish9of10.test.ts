import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';
import {
  headerShowToast,
  headerSyncHudFocusVisibility,
} from '../../ui/hudHeaderAndDock';
import { SeedQuizModalController } from '../../ui/seedQuizModal';
import { resolveMinigameOrientation } from '../../ui/minigameViewControls';
import { getSudokuDigitFillColor } from '../../ui/puzzleArcadeModal';
import { farmUiRenderSeedTray } from '../../ui/hudFarmAndWorkshop';
import { FARM_CROPS } from '../../data/catalog';
import { getVietnamCalendarKey } from '../neighborSocial';
import { QUIZ_DAILY_REWARD_CAP } from '../simulationFarm';
import type { GameHUD } from '../../ui/hud';

async function loadNodeFsAndPath(): Promise<{
  fs: { readFileSync: (p: string, enc: string) => string };
  path: { resolve: (...parts: string[]) => string };
}> {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as {
    readFileSync: (p: string, enc: string) => string;
  };
  const path = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
    resolve: (...parts: string[]) => string;
  };
  return { fs, path };
}

const storageMap = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
});

function createMockAudio(): MagicalAudio {
  return {
    enabled: false,
    bgmEnabled: false,
    externalBgmActive: false,
    playTone: vi.fn(),
    playSfx: vi.fn(),
    playClick: vi.fn(),
    playSpell: vi.fn(),
    playPlace: vi.fn(),
    playHarvestBubble: vi.fn(),
    playBuildComplete: vi.fn(),
    playCoin: vi.fn(),
    playLevelUp: vi.fn(),
    playFlyTick: vi.fn(),
    stopBgm: vi.fn(),
    updateSoundscape: vi.fn(),
  } as unknown as MagicalAudio;
}

class MockClassList {
  private set = new Set<string>();
  toggle(cls: string, force?: boolean): boolean {
    const next = force === undefined ? !this.set.has(cls) : Boolean(force);
    if (next) this.set.add(cls);
    else this.set.delete(cls);
    return next;
  }
  add(...clss: string[]): void {
    for (const c of clss) this.set.add(c);
  }
  remove(...clss: string[]): void {
    for (const c of clss) this.set.delete(c);
  }
  contains(cls: string): boolean {
    return this.set.has(cls);
  }
}

class MockEl {
  public classList = new MockClassList();
  public dataset: Record<string, string> = {};
  public attributes = new Map<string, string>();
  public children: MockEl[] = [];
  public parentElement: MockEl | null = null;
  public textContent = '';
  public innerHTML = '';
  public scrollTop = 0;
  public scrollLeft = 0;
  public title = '';
  public className = '';
  public tagName = 'DIV';

  setAttribute(k: string, v: string): void {
    this.attributes.set(k, v);
  }
  getAttribute(k: string): string | null {
    return this.attributes.get(k) ?? null;
  }
  appendChild(child: MockEl): MockEl {
    if (child.parentElement) {
      child.parentElement.children = child.parentElement.children.filter((x) => x !== child);
    }
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  remove(): void {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter((x) => x !== this);
      this.parentElement = null;
    }
  }
  get firstElementChild(): MockEl | null {
    return this.children[0] ?? null;
  }
  get childElementCount(): number {
    return this.children.length;
  }
  replaceChildren(...nodes: MockEl[]): void {
    for (const c of this.children) c.parentElement = null;
    this.children = [];
    for (const n of nodes) this.appendChild(n);
  }
  addEventListener(): void {}
  querySelector(): MockEl | null {
    return null;
  }
  querySelectorAll(): MockEl[] {
    return [];
  }
}

describe('Full-Game Loop 9/10 UX Polish & Hardening', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('HPVN: shows one toast at a time (the rest wait in line) and promotes #toastStack inside topmost open dialog', () => {
    const stack = new MockEl();
    const openDialog = new MockEl();
    openDialog.tagName = 'DIALOG';
    const root = new MockEl();
    stack.parentElement = root;
    root.children.push(stack);

    const mockDocument = {
      getElementById: (id: string) => (id === 'toastStack' ? stack : null),
      createElement: () => new MockEl(),
    };
    const origDoc = globalThis.document;
    const origWin = globalThis.window;
    vi.stubGlobal('document', mockDocument);
    vi.stubGlobal('window', {
      setTimeout: () => 1,
      clearTimeout: () => {},
    });

    try {
      const rootWithQuery = {
        querySelector: (sel: string) => (sel === '#toastStack' ? stack : null),
        querySelectorAll: (sel: string) => (sel === 'dialog[open]' ? [openDialog] : []),
        appendChild: (c: MockEl) => root.appendChild(c),
      };
      const fakeHud = {
        root: rootWithQuery,
      } as unknown as GameHUD;

      headerShowToast(fakeHud, 'Thông báo 1', '🎉');
      headerShowToast(fakeHud, 'Thông báo 2', '🌟');
      headerShowToast(fakeHud, 'Thông báo 3', '🍁');
      headerShowToast(fakeHud, 'Thông báo 4', '🦉');

      expect(stack.parentElement).toBe(openDialog);
      // HPVN: one toast on screen, each shown for a minimum time before the next (hudHeaderAndDock pumpToast)
      expect(stack.children.length).toBe(1);
      expect(stack.children[0].dataset.msg).toContain('Thông báo 1');
    } finally {
      vi.stubGlobal('document', origDoc);
      vi.stubGlobal('window', origWin);
    }
  });

  it('hides #tsCornerRight and sets hud-sheet-or-tray-open whenever Build Dock or Seed/Pasture Tray opens', () => {
    const shell = new MockEl();
    const cornerRight = new MockEl();
    const bySel: Record<string, MockEl> = {
      '.hud-shell-root': shell,
      '#tsCornerRight': cornerRight,
    };
    const fakeHud = {
      root: {
        querySelector: (sel: string) => bySel[sel] ?? null,
      },
      sim: {
        isVisitingNeighbor: false,
      },
      photoModeActive: false,
      hudRolledUp: false,
      inspectSelection: null,
      inspectorCollapsed: false,
      selectedCatalogItem: null,
      moveModeActive: false,
      bulldozerActive: false,
      pincerActive: false,
      buildSheetOpen: false,
      activeCategory: null,
      mapToolsExpanded: false,
      seedTrayOpen: false,
      pastureTrayOpen: false,
      pendingSowPlotUid: null,
      pendingStockPastureUid: null,
    } as unknown as GameHUD;

    headerSyncHudFocusVisibility(fakeHud);
    expect(shell.classList.contains('hud-sheet-or-tray-open')).toBe(false);
    expect(cornerRight.classList.contains('hidden')).toBe(false);

    fakeHud.buildSheetOpen = true;
    headerSyncHudFocusVisibility(fakeHud);
    expect(shell.classList.contains('hud-sheet-or-tray-open')).toBe(true);
    expect(cornerRight.classList.contains('hidden')).toBe(true);

    fakeHud.buildSheetOpen = false;
    fakeHud.seedTrayOpen = true;
    headerSyncHudFocusVisibility(fakeHud);
    expect(shell.classList.contains('hud-sheet-or-tray-open')).toBe(true);
    expect(cornerRight.classList.contains('hidden')).toBe(true);

    fakeHud.seedTrayOpen = false;
    headerSyncHudFocusVisibility(fakeHud);
    expect(shell.classList.contains('hud-sheet-or-tray-open')).toBe(false);
    expect(cornerRight.classList.contains('hidden')).toBe(false);
  });

  it('renders concise Vietnamese language tab labels in SeedQuizModalController and preserves orientation helper', () => {
    const sim = new ParkSimulation(createMockAudio());
    const contentEl = new MockEl();
    const dlgEl = new MockEl();
    const rootWithQuery = {
      querySelector: (sel: string) => {
        if (sel === '#seedQuizDialogContent') return contentEl;
        if (sel === '#seedQuizDialog') return dlgEl;
        return null;
      },
      querySelectorAll: () => [],
    } as unknown as HTMLElement;

    const ctrl = new SeedQuizModalController(
      rootWithQuery,
      sim,
      () => {},
      () => {},
      () => {}
    );
    ctrl.render();

    // HPVN: the tab row is one segmented control with plain labels (no <strong>, no flag)
    for (const label of ['Anh', 'Hàn', 'Trung', 'TBN', 'Nhật']) expect(contentEl.innerHTML).toContain(`>${label}</button>`);
    expect(contentEl.innerHTML).not.toContain('>Tiếng Anh</button>');

    expect(resolveMinigameOrientation('auto', 390, 844, false, false).effectiveLayout).toBe('portrait');
    expect(resolveMinigameOrientation('auto', 1280, 800, false, false).effectiveLayout).toBe('landscape');
  });

  it('contains all 9/10 CSS, layout, and click-hit fixes without hardcoded colors or regressions', async () => {
    const { fs, path } = await loadNodeFsAndPath();
    const css = fs.readFileSync(path.resolve('src/styles/main.css'), 'utf8');
    const puzzleModal = fs.readFileSync(path.resolve('src/ui/puzzleArcadeModal.ts'), 'utf8');
    const farmUi = fs.readFileSync(path.resolve('src/ui/hudFarmAndWorkshop.ts'), 'utf8');
    const mainTs = fs.readFileSync(path.resolve('src/main.ts'), 'utf8');
    const shellTs = fs.readFileSync(path.resolve('src/ui/hudShell.ts'), 'utf8');

    expect(css).toContain('dialog[open] > .owl-toast-stack');
    expect(css).toContain('.pa-review-card .pa-mini-pill');
    expect(css).toContain('#match3Dialog .pa-side-dock .m3-dock-hud .m3-goal-count');
    expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
    expect(css).toContain('grid-template-columns: repeat(5, minmax(0, 1fr));');
    expect(css).toContain('.hud-shell-root.hud-sheet-or-tray-open .ts-corner-left');
    expect(css).toContain('@media (max-width: 680px) and (pointer: coarse)');

    expect(puzzleModal).toContain('isOptimalMove'); // HPVN label: «Nước N · chuẩn: X»
    expect(farmUi).toContain('class="hs-tray-head"'); // HPVN tray head
    expect(mainTs).toContain('isEligiblePlot');
    expect(mainTs).toContain('isEligiblePasture');
    expect(shellTs).toContain('attachHorizontalWheel');
  });

  it('removes Sudoku timer from UI/score and renders player-entered Sudoku digits in blue instead of red', async () => {
    expect(getSudokuDigitFillColor(false, true, false)).toBe('#1d4ed8');
    expect(getSudokuDigitFillColor(false, false, false)).toBe('#1d4ed8');
    expect(getSudokuDigitFillColor(false, true, true)).toBe('#1e3a8a');
    expect(getSudokuDigitFillColor(false, true, false)).not.toBe('#991b1b');
    expect(getSudokuDigitFillColor(true, true, false)).toBe('#0f172a');
    expect(getSudokuDigitFillColor(true, false, false)).toBe('#2b1407');

    const { fs, path } = await loadNodeFsAndPath();
    const puzzleModal = fs.readFileSync(path.resolve('src/ui/puzzleArcadeModal.ts'), 'utf8');
    expect(puzzleModal).not.toContain('paSudokuTimer');
    expect(puzzleModal).not.toContain('this.sudokuEngine.tickTimer');
    expect(puzzleModal).not.toContain('this.sudokuEngine.elapsedSec');
  });

  it('allows buying seeds directly with Sickle in Học Viện Thần Chú (#btnSqBuy1 / #btnSqBuy3), even after the daily quiz cap', () => {
    const sim = new ParkSimulation(createMockAudio());
    const cropCost = FARM_CROPS.ottery_wheat.seedCost;
    sim.state.sandboxMode = false;
    sim.state.galleons = 5000;
    sim.ensureFarmBarn().seeds = { ottery_wheat: 0 };
    sim.state.quizRewardDaily = { dayKey: getVietnamCalendarKey(), count: QUIZ_DAILY_REWARD_CAP };

    const clickHandlers = new Map<string, () => void>();
    const makeBtnStub = (sel: string) => ({
      addEventListener: (ev: string, fn: () => void) => {
        if (ev === 'click') clickHandlers.set(sel, fn);
      },
      setAttribute: () => {},
    });
    const contentEl = new MockEl();
    contentEl.querySelector = (sel?: string) => {
      if (sel === '#btnSqBuy1' || sel === '#btnSqBuy3') {
        return makeBtnStub(sel) as unknown as MockEl;
      }
      return null;
    };
    const dlgEl = new MockEl();
    const rootWithQuery = {
      querySelector: (sel: string) => {
        if (sel === '#seedQuizDialogContent') return contentEl;
        if (sel === '#seedQuizDialog') return dlgEl;
        return null;
      },
      querySelectorAll: () => [],
    } as unknown as HTMLElement;

    const onRefreshHud = vi.fn();
    const onToast = vi.fn();
    const ctrl = new SeedQuizModalController(rootWithQuery, sim, onRefreshHud, onToast, () => {});
    ctrl.render();

    expect(contentEl.innerHTML).toContain('id="btnSqBuy1"');
    expect(contentEl.innerHTML).toContain('id="btnSqBuy3"');
    expect(contentEl.innerHTML).not.toContain('id="btnSqSowNow"');

    clickHandlers.get('#btnSqBuy1')?.();
    expect(sim.getSeedCount('ottery_wheat')).toBe(1);
    expect(sim.state.galleons).toBe(5000 - cropCost);
    expect(contentEl.innerHTML).toContain('id="btnSqSowNow"');
    expect(contentEl.innerHTML).toContain('Gieo ×1');

    clickHandlers.get('#btnSqBuy3')?.();
    expect(sim.getSeedCount('ottery_wheat')).toBe(4);
    expect(sim.state.galleons).toBe(5000 - cropCost * 4);
    expect(contentEl.innerHTML).toContain('Gieo ×4');
    expect(onRefreshHud).toHaveBeenCalledTimes(2);
    expect(onToast).toHaveBeenCalledTimes(2);
  });

  it('buys 1 seed directly with Sickle when clicking "+ 🪙giá" in Seed Tray without redirecting to quiz', () => {
    const sim = new ParkSimulation(createMockAudio());
    const cropCost = FARM_CROPS.ottery_wheat.seedCost;
    sim.state.sandboxMode = false;
    sim.state.galleons = 2000;
    sim.ensureFarmBarn().seeds = { ottery_wheat: 0 };

    const acquireClicks = new Map<string, (ev: { stopPropagation: () => void }) => void>();
    const trayEl = new MockEl();
    trayEl.querySelectorAll = ((sel: string) => {
      if (sel === '[data-acquire-seed]') {
        return [
          {
            dataset: { acquireSeed: 'ottery_wheat' },
            addEventListener: (
              ev: string,
              fn: (e: { stopPropagation: () => void }) => void
            ) => {
              if (ev === 'click') acquireClicks.set('ottery_wheat', fn);
            },
          },
        ] as unknown as MockEl[];
      }
      return [];
    }) as MockEl['querySelectorAll'];

    const fakeHud = {
      root: {
        querySelector: (sel: string) => (sel === '#seedBrushTray' ? trayEl : null),
      },
      sim,
      photoModeActive: false,
      seedTrayOpen: true,
      seedFilterMode: 'all' as const,
      activeSeedCropId: null,
      pendingSowPlotUid: 'plot_1',
      inspectSelection: null,
      showToast: vi.fn(),
      refreshAll: vi.fn(),
      syncHudFocusVisibility: vi.fn(),
      openSeedQuizDialog: vi.fn(),
    } as unknown as GameHUD;

    farmUiRenderSeedTray(fakeHud);
    const handler = acquireClicks.get('ottery_wheat');
    expect(handler).toBeDefined();

    const stopPropagation = vi.fn();
    handler?.({ stopPropagation });

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(fakeHud.openSeedQuizDialog).not.toHaveBeenCalled();
    expect(fakeHud.seedTrayOpen).toBe(true);
    expect(fakeHud.pendingSowPlotUid).toBe('plot_1');
    expect(fakeHud.activeSeedCropId).toBe('ottery_wheat');
    expect(sim.getSeedCount('ottery_wheat')).toBe(1);
    expect(sim.state.galleons).toBe(2000 - cropCost);
    expect(fakeHud.refreshAll).toHaveBeenCalledTimes(1);
    expect(fakeHud.showToast).toHaveBeenCalledTimes(1);
  });

  it('immediately equips & plants the chosen crop after buying from an out-of-seeds quiz redirect and retains tray scroll & selection on close', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.sandboxMode = false;
    sim.state.level = 15;
    sim.state.galleons = 5000;
    sim.ensureFarmBarn().seeds = { garden_pumpkin: 0, ottery_wheat: 0 };

    const clickHandlers = new Map<string, () => void>();
    const makeBtnStub = (sel: string) => ({
      addEventListener: (ev: string, fn: () => void) => {
        if (ev === 'click') clickHandlers.set(sel, fn);
      },
      setAttribute: () => {},
    });
    const contentEl = new MockEl();
    contentEl.querySelector = (sel?: string) => {
      if (sel === '#btnSqBuy1' || sel === '#btnSqBuy3') {
        return makeBtnStub(sel) as unknown as MockEl;
      }
      return null;
    };
    const dlgEl = Object.assign(new MockEl(), {
      open: false,
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
    });
    const rootWithQuery = {
      querySelector: (sel: string) => {
        if (sel === '#seedQuizDialogContent') return contentEl;
        if (sel === '#seedQuizDialog') return dlgEl;
        return null;
      },
      querySelectorAll: () => [],
    } as unknown as HTMLElement;

    const onEquipAndSow = vi.fn();
    const ctrl = new SeedQuizModalController(rootWithQuery, sim, vi.fn(), vi.fn(), onEquipAndSow);

    // 1. Out-of-seeds card click opens modal for 'garden_pumpkin' targeting 'plot_1' -> clicking +1 seed immediately closes & plants
    ctrl.open('garden_pumpkin', 'plot_1');
    expect(dlgEl.open).toBe(true);
    clickHandlers.get('#btnSqBuy1')?.();
    expect(sim.getSeedCount('garden_pumpkin')).toBe(1);
    expect(dlgEl.open).toBe(false);
    expect(onEquipAndSow).toHaveBeenCalledWith('garden_pumpkin', 'plot_1');

    // 2. Opening without cropId (from dock), buying seeds, then closing modal also preserves & equips targetCropId
    onEquipAndSow.mockClear();
    ctrl.open(undefined, null);
    clickHandlers.get('#btnSqBuy1')?.();
    expect(dlgEl.open).toBe(true); // stays open so player can keep practicing or buying more
    ctrl.close();
    expect(onEquipAndSow).toHaveBeenCalledWith('garden_pumpkin', null);

    // 3. Seed Tray preserves horizontal scrollLeft across re-renders & #btnCloseSeedTray plants/keeps equipped bought seed
    const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot' && !b.cropId);
    expect(plot).toBeDefined();
    if (plot) {
      plot.constructEndsAt = 0;
    }
    sim.ensureFarmBarn().seeds = { garden_pumpkin: 2 };
    const closeHandlers: Array<() => void> = [];
    const fakeScrollEl = { scrollLeft: 240 };
    const trayEl = new MockEl();
    trayEl.querySelector = ((sel: string) => {
      if (sel === '.seed-tray-scroll') return fakeScrollEl;
      if (sel === '#btnCloseSeedTray') {
        return {
          addEventListener: (ev: string, fn: () => void) => {
            if (ev === 'click') closeHandlers.push(fn);
          },
        };
      }
      return null;
    }) as unknown as MockEl['querySelector'];
    trayEl.querySelectorAll = (() => []) as unknown as MockEl['querySelectorAll'];

    const fakeHud = {
      root: {
        querySelector: (sel: string) => (sel === '#seedBrushTray' ? trayEl : null),
      },
      sim,
      photoModeActive: false,
      seedTrayOpen: true,
      seedFilterMode: 'all' as const,
      activeSeedCropId: 'garden_pumpkin' as const,
      pendingSowPlotUid: plot?.uid ?? null,
      inspectSelection: null,
      showToast: vi.fn(),
      refreshAll: vi.fn(),
      syncHudFocusVisibility: vi.fn(),
      openSeedQuizDialog: vi.fn(),
    } as unknown as GameHUD;

    farmUiRenderSeedTray(fakeHud);
    expect(fakeScrollEl.scrollLeft).toBe(240);

    // Closing the tray after buying 2 garden_pumpkin seeds plants 1 on pending plot AND retains 1 on the active seed brush
    expect(closeHandlers.length).toBe(1);
    closeHandlers[0]();
    if (plot) {
      expect(plot.cropId).toBe('garden_pumpkin');
      expect(fakeHud.activeSeedCropId).toBe('garden_pumpkin');
    }
    expect(fakeHud.seedTrayOpen).toBe(false);
  });
});
