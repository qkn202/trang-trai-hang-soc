import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCandyLevelById } from '../../data/candyHogwartsLevels';
import { CandyHogwartsEngine } from '../../sim/candyHogwartsEngine';
import { OfflineMiniGameApp } from '../app';
import {
  buildLocalRecordRows,
  OFFLINE_GAME_CATALOG,
} from '../offlineCatalog';
import {
  createDefaultOfflineState,
  loadOfflineStateSync,
  migrateOfflineState,
  OFFLINE_STORAGE_KEY,
  resetOfflineProgress,
  saveOfflineState,
} from '../offlineStorage';

const MAIN_FARM_SAVE_KEY = 'burrow_hogsmeade_777_v3';

interface FakeEvent {
  type: string;
  clientX?: number;
  clientY?: number;
  pointerId?: number;
  pointerType?: string;
  currentTarget?: unknown;
  target?: unknown;
}

class FakeElement {
  public tagName: string;
  public id = '';
  public className = '';
  public textContent = '';
  public hidden = false;
  public disabled = false;
  public open = false;
  public returnValue = '';
  public value = '';
  public width = 360;
  public height = 360;
  public dataset: Record<string, string> = {};
  public style: Record<string, string> = {};
  public attributes = new Map<string, string>();
  public children: FakeElement[] = [];
  public parentElement: FakeElement | null = null;

  private rawHtml = '';
  private listeners = new Map<string, Set<(ev: FakeEvent) => void>>();

  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
  }

  public get classList() {
    const getSet = () => new Set(this.className.split(/\s+/).filter(Boolean));
    return {
      add: (...tokens: string[]) => {
        const s = getSet();
        tokens.forEach((t) => s.add(t));
        this.className = Array.from(s).join(' ');
      },
      remove: (...tokens: string[]) => {
        const s = getSet();
        tokens.forEach((t) => s.delete(t));
        this.className = Array.from(s).join(' ');
      },
      toggle: (token: string, force?: boolean) => {
        const s = getSet();
        const shouldHave = force !== undefined ? force : !s.has(token);
        if (shouldHave) s.add(token);
        else s.delete(token);
        this.className = Array.from(s).join(' ');
        return shouldHave;
      },
      contains: (token: string) => getSet().has(token),
    };
  }

  public get innerHTML(): string {
    return this.rawHtml;
  }

  public set innerHTML(html: string) {
    this.rawHtml = html;
    this.children = parseHtmlIntoFakeTree(html, this);
    this.textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  public setAttribute(name: string, val: string): void {
    this.attributes.set(name, val);
    if (name === 'id') this.id = val;
    if (name === 'class') this.className = val;
    if (name === 'open') this.open = true;
    if (name === 'disabled') this.disabled = true;
    if (name === 'hidden') this.hidden = true;
    if (name.startsWith('data-')) {
      const camel = name
        .slice(5)
        .replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
      this.dataset[camel] = val;
    }
  }

  public getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  public appendChild(child: FakeElement): FakeElement {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  public remove(): void {
    if (!this.parentElement) return;
    const idx = this.parentElement.children.indexOf(this);
    if (idx >= 0) this.parentElement.children.splice(idx, 1);
    this.parentElement = null;
  }

  public addEventListener(type: string, cb: (ev: FakeEvent) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(cb);
  }

  public removeEventListener(type: string, cb: (ev: FakeEvent) => void): void {
    this.listeners.get(type)?.delete(cb);
  }

  public listenerCount(type?: string): number {
    if (type) return this.listeners.get(type)?.size ?? 0;
    let sum = 0;
    for (const set of this.listeners.values()) sum += set.size;
    return sum;
  }

  public dispatchEvent(ev: FakeEvent): boolean {
    ev.currentTarget = this;
    if (!ev.target) ev.target = this;
    const set = this.listeners.get(ev.type);
    if (set) {
      for (const fn of Array.from(set)) {
        fn(ev);
      }
    }
    return true;
  }

  public click(): void {
    if (this.disabled) return;
    this.dispatchEvent({ type: 'click' });
  }

  public showModal(): void {
    this.open = true;
  }

  public close(retVal?: string): void {
    this.open = false;
    if (retVal !== undefined) {
      this.returnValue = retVal;
    }
    this.dispatchEvent({ type: 'close' });
  }

  public getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      right: this.width || 375,
      bottom: this.height || 375,
      width: this.width || 375,
      height: this.height || 375,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
  }

  public setPointerCapture(): void {}
  public releasePointerCapture(): void {}

  public getContext(kind: string) {
    if (kind !== '2d') return null;
    return createFakeCanvas2DContext(this);
  }

  public matchesSelector(selector: string): boolean {
    const sel = selector.trim();
    if (!sel) return false;
    if (sel.startsWith('#')) {
      return this.id === sel.slice(1);
    }
    if (sel.startsWith('.')) {
      return sel
        .split('.')
        .filter(Boolean)
        .every((cls) => this.classList.contains(cls));
    }
    const tagAttrMatch = sel.match(/^([a-zA-Z0-9_-]+)?\[([a-zA-Z0-9_-]+)(?:=["']?([^"'\]]*)["']?)?\]$/);
    if (tagAttrMatch) {
      const [, rawTag, attrName, attrVal] = tagAttrMatch;
      if (rawTag && this.tagName !== rawTag.toUpperCase()) return false;
      if (!this.attributes.has(attrName)) return false;
      if (attrVal !== undefined) {
        return this.attributes.get(attrName) === attrVal;
      }
      return true;
    }
    return this.tagName === sel.toUpperCase();
  }

  public querySelector<T = FakeElement>(selector: string): T | null {
    const all = this.querySelectorAll<T>(selector);
    return all.length > 0 ? all[0] : null;
  }

  public querySelectorAll<T = FakeElement>(selector: string): T[] {
    const results: FakeElement[] = [];
    const visit = (node: FakeElement) => {
      for (const child of node.children) {
        if (child.matchesSelector(selector)) {
          results.push(child);
        }
        visit(child);
      }
    };
    visit(this);
    return results as unknown as T[];
  }
}

const SELF_CLOSING_TAGS = new Set(['img', 'input', 'br', 'hr', 'source', 'meta', 'link']);

function parseHtmlIntoFakeTree(html: string, rootParent: FakeElement): FakeElement[] {
  const topChildren: FakeElement[] = [];
  const stack: FakeElement[] = [rootParent];
  const tagRe = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const attrPart = match[2] || '';
    const textBefore = html.slice(lastIdx, match.index).trim();
    if (textBefore && stack.length > 1) {
      stack[stack.length - 1].textContent +=
        (stack[stack.length - 1].textContent ? ' ' : '') + textBefore;
    }
    lastIdx = tagRe.lastIndex;

    if (fullTag.startsWith('</')) {
      while (stack.length > 1) {
        const popped = stack.pop()!;
        if (popped.tagName.toLowerCase() === tagName) break;
      }
      continue;
    }

    const el = new FakeElement(tagName);
    const attrRe = /([a-zA-Z0-9_:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let am: RegExpExecArray | null;
    while ((am = attrRe.exec(attrPart)) !== null) {
      const aName = am[1];
      if (aName === '/') continue;
      const aVal = am[2] ?? am[3] ?? am[4] ?? '';
      el.setAttribute(aName, aVal);
    }

    const currentParent = stack[stack.length - 1];
    el.parentElement = currentParent;
    if (currentParent === rootParent) {
      topChildren.push(el);
    } else {
      currentParent.children.push(el);
    }

    const isSelfClosing = fullTag.endsWith('/>') || SELF_CLOSING_TAGS.has(tagName);
    if (!isSelfClosing) {
      stack.push(el);
    }
  }

  return topChildren;
}

function createFakeCanvas2DContext(canvas: FakeElement) {
  const grad = { addColorStop: () => {} };
  return {
    canvas,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    font: '12px sans-serif',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    shadowColor: 'transparent',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    save: () => {},
    restore: () => {},
    scale: () => {},
    translate: () => {},
    rotate: () => {},
    setTransform: () => {},
    resetTransform: () => {},
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    arcTo: () => {},
    ellipse: () => {},
    rect: () => {},
    roundRect: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    setLineDash: () => {},
    drawImage: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: (t: string) => ({ width: t.length * 7 }),
    createLinearGradient: () => grad,
    createRadialGradient: () => grad,
  };
}

describe('Hang Sóc Mini-games Offline Standalone App (§9 OFFLINE_MINIGAME_HANDOFF)', () => {
  const storageMap = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => storageMap.get(k) ?? null,
    setItem: (k: string, v: string) => {
      storageMap.set(k, String(v));
    },
    removeItem: (k: string) => {
      storageMap.delete(k);
    },
    clear: () => storageMap.clear(),
  };

  const docListeners = new Map<string, Set<(ev: FakeEvent) => void>>();
  const winListeners = new Map<string, Set<(ev: FakeEvent) => void>>();
  let visibilityState: 'visible' | 'hidden' = 'visible';
  let onlineStatus = true;
  let assignedUrl: string | null = null;
  let forbiddenFetchSpy: ReturnType<typeof vi.fn>;
  let forbiddenBeaconSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    storageMap.clear();
    docListeners.clear();
    winListeners.clear();
    visibilityState = 'visible';
    onlineStatus = true;
    assignedUrl = null;

    forbiddenFetchSpy = vi.fn(() => {
      throw new Error('Network fetch() is strictly forbidden in Offline Mini-game App!');
    });
    forbiddenBeaconSpy = vi.fn(() => {
      throw new Error('navigator.sendBeacon() is strictly forbidden in Offline Mini-game App!');
    });

    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('fetch', forbiddenFetchSpy);

    const fakeDoc = {
      get visibilityState() {
        return visibilityState;
      },
      createElement: (tag: string) => new FakeElement(tag),
      getElementById: () => null,
      addEventListener: (type: string, cb: (ev: FakeEvent) => void) => {
        if (!docListeners.has(type)) docListeners.set(type, new Set());
        docListeners.get(type)!.add(cb);
      },
      removeEventListener: (type: string, cb: (ev: FakeEvent) => void) => {
        docListeners.get(type)?.delete(cb);
      },
      dispatchEvent: (ev: FakeEvent) => {
        for (const fn of docListeners.get(ev.type) ?? []) fn(ev);
        return true;
      },
    };

    const fakeWin = {
      devicePixelRatio: 2,
      location: {
        port: '4173',
        href: 'https://mini-game.hangsoc.example/',
        assign: (u: string) => {
          assignedUrl = u;
        },
        reload: () => {},
      },
      setTimeout: () => 1,
      clearTimeout: () => {},
      setInterval: () => 1,
      clearInterval: () => {},
      addEventListener: (type: string, cb: (ev: FakeEvent) => void) => {
        if (!winListeners.has(type)) winListeners.set(type, new Set());
        winListeners.get(type)!.add(cb);
      },
      removeEventListener: (type: string, cb: (ev: FakeEvent) => void) => {
        winListeners.get(type)?.delete(cb);
      },
      dispatchEvent: (ev: FakeEvent) => {
        for (const fn of winListeners.get(ev.type) ?? []) fn(ev);
        return true;
      },
    };

    vi.stubGlobal('document', fakeDoc);
    vi.stubGlobal('window', fakeWin);
    vi.stubGlobal('navigator', {
      get onLine() {
        return onlineStatus;
      },
      vibrate: vi.fn(() => true),
      sendBeacon: forbiddenBeaconSpy,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('1. Mở app với localStorage rỗng: khởi tạo state v1 độc lập và không đụng tới save game chính', () => {
    storageMap.set(MAIN_FARM_SAVE_KEY, '{"parkName":"MainFarmUntouched","level":42}');

    const root = new FakeElement('div');
    const app = new OfflineMiniGameApp(root as unknown as HTMLElement, { storage: mockStorage });

    expect(app.state.version).toBe(1);
    expect(app.state.coins).toBe(450);
    expect(app.currentRoute).toBe('home');
    expect(OFFLINE_GAME_CATALOG).toHaveLength(5);
    expect(root.querySelectorAll('.off-game-card')).toHaveLength(5);

    // Main farm save key remains 100% untouched
    expect(storageMap.get(MAIN_FARM_SAVE_KEY)).toBe('{"parkName":"MainFarmUntouched","level":42}');
    expect(forbiddenFetchSpy).not.toHaveBeenCalled();
    expect(forbiddenBeaconSpy).not.toHaveBeenCalled();

    app.destroy();
  });

  it('2. Chơi một ván Match-3 và reload: giữ nguyên high score, màn đã mở và cả phiên chơi dở', () => {
    const root1 = new FakeElement('div');
    const app1 = new OfflineMiniGameApp(root1 as unknown as HTMLElement, { storage: mockStorage });

    app1.navigateTo('match3');
    expect(app1.currentRoute).toBe('match3');
    app1.navigateTo('home');

    // Simulate playing moves on CandyHogwartsEngine (Stage 4) and saving mid-game session
    const engine = new CandyHogwartsEngine(null, {});
    engine.loadLevel(getCandyLevelById(4), { instantAnimations: true });
    engine.score = 2850;
    engine.movesLeft = 14;
    const midSession = engine.exportSession();
    expect(midSession).not.toBeNull();
    app1.state.match3 = midSession;
    app1.state.match3Progress.highScore = 2850;
    app1.state.match3Progress.maxClearedLevel = 3;
    app1.state.match3Progress.currentLevel = 4;
    app1.state.coins = 710;
    app1.saveCheckpoint();
    app1.destroy();

    // Reload fresh app instance from localStorage
    const root2 = new FakeElement('div');
    const app2 = new OfflineMiniGameApp(root2 as unknown as HTMLElement, { storage: mockStorage });

    expect(app2.state.match3Progress.highScore).toBe(2850);
    expect(app2.state.match3Progress.maxClearedLevel).toBe(3);
    expect(app2.state.match3Progress.currentLevel).toBe(4);
    expect(app2.state.coins).toBe(710);
    expect(app2.state.match3?.score).toBe(2850);

    const rows = buildLocalRecordRows(app2.state);
    expect(rows.find((r) => r.gameId === 'match3')?.highScoreLabel).toContain('2.850');

    app2.destroy();
  });

  it('3. Clear local save: đặt lại toàn bộ tiến trình về mặc định mà không ảnh hưởng game chính', () => {
    storageMap.set(MAIN_FARM_SAVE_KEY, '{"parkName":"MainFarmSafe"}');

    const root = new FakeElement('div');
    const app = new OfflineMiniGameApp(root as unknown as HTMLElement, { storage: mockStorage });
    app.state.coins = 9999;
    app.state.xp = 1500;
    app.state.match3Progress.highScore = 45000;
    app.state.puzzleArcade.jigsaw.restoredPaintings = ['p1_hogwarts_express'];
    app.saveCheckpoint();

    app.performResetProgress();

    const defaults = createDefaultOfflineState();
    expect(app.state.coins).toBe(defaults.coins);
    expect(app.state.xp).toBe(0);
    expect(app.state.match3Progress.highScore).toBe(0);
    expect(app.state.puzzleArcade.jigsaw.restoredPaintings).toEqual([]);
    expect(storageMap.get(MAIN_FARM_SAVE_KEY)).toBe('{"parkName":"MainFarmSafe"}');

    // Direct helper check
    const fresh = resetOfflineProgress(mockStorage);
    expect(fresh.version).toBe(1);
    expect(loadOfflineStateSync(mockStorage).state.coins).toBe(defaults.coins);

    app.destroy();
  });

  it('4. Save hỏng JSON hoặc sai kiểu dữ liệu: tự phục hồi sang state mới, không trắng trang hay throw', () => {
    storageMap.set(OFFLINE_STORAGE_KEY, '{corrupted_json_payload:::');

    const syncCheck = loadOfflineStateSync(mockStorage);
    expect(syncCheck.recoveredFromCorruption).toBe(true);
    expect(syncCheck.state.version).toBe(1);

    const root = new FakeElement('div');
    expect(() => {
      const app = new OfflineMiniGameApp(root as unknown as HTMLElement, { storage: mockStorage });
      expect(root.querySelectorAll('.off-game-card')).toHaveLength(5);
      // Corrupted JSON in storage was automatically healed
      expect(() => JSON.parse(storageMap.get(OFFLINE_STORAGE_KEY)!)).not.toThrow();
      app.destroy();
    }).not.toThrow();

    // Array or primitive payloads also migrate safely
    expect(migrateOfflineState([1, 2, 3]).version).toBe(1);
    expect(migrateOfflineState(null).version).toBe(1);
  });

  it('5. Chuyển qua lại giữa cả 5 mini-game không rò state hay listener', () => {
    const root = new FakeElement('div');
    const app = new OfflineMiniGameApp(root as unknown as HTMLElement, { storage: mockStorage });
    const mount = root.querySelector('#offScreenMount')!;

    for (const gameId of ['match3', 'jigsaw', 'sudoku', 'blocks', 'seedQuiz'] as const) {
      app.navigateTo(gameId);
      expect(app.currentRoute).toBe(gameId);
      expect(app.isSafeToReloadForSwUpdate()).toBe(false);
      expect(mount.children.length).toBe(1);
    }

    app.navigateTo('home');
    expect(app.currentRoute).toBe('home');
    expect(app.isSafeToReloadForSwUpdate()).toBe(true);
    expect(mount.querySelectorAll('.off-game-card')).toHaveLength(5);
    expect(winListeners.get('online')?.size ?? 0).toBeLessThanOrEqual(1);

    app.destroy();
  });

  it('6. Hỗ trợ touch/pointer input trên các màn chơi mà không phụ thuộc chuột phải hay hover', () => {
    const root = new FakeElement('div');
    const app = new OfflineMiniGameApp(root as unknown as HTMLElement, { storage: mockStorage });

    // 6a. Touch tap on Jigsaw tray piece -> touch pointerdown/pointerup on board canvas
    app.navigateTo('jigsaw');
    const firstTrayPiece = root.querySelector<FakeElement>('.off-tray-piece');
    expect(firstTrayPiece).not.toBeNull();
    firstTrayPiece!.click();

    const jigsawCanvas = root.querySelector<FakeElement>('#offPuzzleCanvas')!;
    expect(jigsawCanvas).not.toBeNull();
    jigsawCanvas.dispatchEvent({
      type: 'pointerdown',
      pointerId: 1,
      pointerType: 'touch',
      clientX: 180,
      clientY: 180,
    });
    jigsawCanvas.dispatchEvent({
      type: 'pointermove',
      pointerId: 1,
      pointerType: 'touch',
      clientX: 195,
      clientY: 195,
    });
    jigsawCanvas.dispatchEvent({
      type: 'pointerup',
      pointerId: 1,
      pointerType: 'touch',
      clientX: 195,
      clientY: 195,
    });
    expect(app.state.puzzleArcade.jigsaw.activeSession).not.toBeNull();

    // 6b. Touch pointerdown on Blocks (Creature Onet) canvas
    app.navigateTo('blocks');
    const onetCanvas = root.querySelector<FakeElement>('#offPuzzleCanvas')!;
    expect(() => {
      onetCanvas.dispatchEvent({
        type: 'pointerdown',
        pointerId: 2,
        pointerType: 'touch',
        clientX: 80,
        clientY: 80,
      });
    }).not.toThrow();

    // 6c. Touch tap on Sudoku cell + digit pad
    app.navigateTo('sudoku');
    const editableCell = root.querySelector<FakeElement>('.off-sdk-cell.editable');
    const digitBtn = root.querySelector<FakeElement>('[data-sdk-digit="5"]');
    expect(editableCell).not.toBeNull();
    expect(digitBtn).not.toBeNull();
    editableCell!.click();
    digitBtn!.click();
    expect(app.state.puzzleArcade.sudoku.activeSession).not.toBeNull();

    app.destroy();
  });

  it('7. Sự kiện visibilitychange (hidden) và pagehide tự động lưu checkpoint vào storage', () => {
    const root = new FakeElement('div');
    const app = new OfflineMiniGameApp(root as unknown as HTMLElement, { storage: mockStorage });
    app.navigateTo('sudoku');

    // Mutate state in memory before backgrounding
    app.state.coins = 1234;
    storageMap.delete(OFFLINE_STORAGE_KEY);
    expect(storageMap.has(OFFLINE_STORAGE_KEY)).toBe(false);

    visibilityState = 'hidden';
    for (const fn of docListeners.get('visibilitychange') ?? []) {
      fn({ type: 'visibilitychange' });
    }
    expect(storageMap.has(OFFLINE_STORAGE_KEY)).toBe(true);
    expect(loadOfflineStateSync(mockStorage).state.coins).toBe(1234);

    // Test pagehide checkpoint as well
    app.state.coins = 2345;
    for (const fn of winListeners.get('pagehide') ?? []) {
      fn({ type: 'pagehide' });
    }
    expect(loadOfflineStateSync(mockStorage).state.coins).toBe(2345);

    app.destroy();
  });

  it('8 & 9. Airplane Mode (navigator.onLine = false): cả 5 mini-game chạy mượt không throw, không gọi bất kỳ API nào', () => {
    onlineStatus = false;

    const root = new FakeElement('div');
    const app = new OfflineMiniGameApp(root as unknown as HTMLElement, {
      storage: mockStorage,
      mainFarmUrl: 'https://hangsoc.example/',
    });

    const badge = root.querySelector<FakeElement>('#offlineNetBadge');
    expect(badge?.attributes.get('data-offline')).toBe('true');

    // Tapping "Về game chính" while offline never navigates away or throws
    app.openMainFarmApp();
    expect(assignedUrl).toBeNull();

    // Open and exercise every single mini-game while completely offline
    for (const route of ['match3', 'jigsaw', 'sudoku', 'blocks', 'seedQuiz'] as const) {
      expect(() => app.navigateTo(route)).not.toThrow();
    }

    // Answer a Seed Quiz question offline and confirm XP/streak persists locally
    const choiceBtn = root.querySelector<FakeElement>('[data-choice-idx="0"]');
    if (choiceBtn) {
      choiceBtn.click();
      expect(app.state.seedQuiz.totalAnswered).toBe(1);
    }

    // Save helper handles quota errors without throwing
    const quotaStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
    };
    expect(saveOfflineState(app.state, quotaStorage)).toBe(false);

    // Zero network calls throughout the entire offline session
    expect(forbiddenFetchSpy).not.toHaveBeenCalled();
    expect(forbiddenBeaconSpy).not.toHaveBeenCalled();

    app.destroy();
  });
});
