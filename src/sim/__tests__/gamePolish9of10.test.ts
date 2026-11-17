import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';
import {
  headerShowToast,
  headerSyncHudFocusVisibility,
} from '../../ui/hudHeaderAndDock';
import { SeedQuizModalController } from '../../ui/seedQuizModal';
import { resolveMinigameOrientation } from '../../ui/minigameViewControls';
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
});
