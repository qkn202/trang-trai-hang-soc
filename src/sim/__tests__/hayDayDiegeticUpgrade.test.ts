import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import {
  drawHayDayDiegeticWorldOverlay,
  type HayDaySwipeVisualState,
} from '../../engine/hayDayWorldOverlay';
import type { Camera } from '../../engine/isometric';
import { JuiceFX } from '../../engine/juiceFx';
import { IsometricRenderer } from '../../engine/renderer';
import { SpriteRegistry } from '../../engine/spriteLoader';
import {
  HayDayDiegeticOverlayUI,
  type HayDayRadialWheelCallbacks,
} from '../../ui/hayDayRadialWheel';
import type { FarmCropId, FarmGoodId } from '../../types/game';
import { ParkSimulation } from '../simulation';

// ============================================================================
// MOCK CANVAS & MINIMAL PARSING DOM HARNESS (node Vitest environment)
// ============================================================================

function createMockCanvas2d(omitOptionalMethods = false) {
  const calls: string[] = [];
  const ctx: Record<string, unknown> = {
    canvas: { width: 1280, height: 800 },
    globalAlpha: 1,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    font: '12px "Be Vietnam Pro", sans-serif',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    clearRect: vi.fn(() => calls.push('clearRect')),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(() => calls.push('fill')),
    stroke: vi.fn(() => calls.push('stroke')),
    clip: vi.fn(),
    fillRect: vi.fn(() => calls.push('fillRect')),
    strokeRect: vi.fn(),
    drawImage: vi.fn(() => calls.push('drawImage')),
    measureText: vi.fn((txt: string) => ({ width: txt.length * 7 })),
    fillText: vi.fn(() => calls.push('fillText')),
    strokeText: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  };
  if (!omitOptionalMethods) {
    ctx.rotate = vi.fn();
    ctx.scale = vi.fn();
    ctx.ellipse = vi.fn();
    ctx.roundRect = vi.fn();
    ctx.rect = vi.fn();
    ctx.arcTo = vi.fn();
    ctx.transform = vi.fn();
  }
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

class MiniStyle {
  private readonly props = new Map<string, string>();
  public left = '';
  public top = '';
  public width = '';
  public height = '';
  public setProperty(name: string, value: string): void {
    this.props.set(name, value);
  }
  public getPropertyValue(name: string): string {
    return this.props.get(name) ?? '';
  }
}

class MiniClassList {
  private readonly set = new Set<string>();
  constructor(initial = '') {
    for (const token of initial.split(/\s+/)) {
      if (token) this.set.add(token);
    }
  }
  public add(...tokens: string[]): void {
    for (const t of tokens) if (t) this.set.add(t);
  }
  public remove(...tokens: string[]): void {
    for (const t of tokens) this.set.delete(t);
  }
  public toggle(token: string, force?: boolean): boolean {
    if (force === undefined) {
      if (this.set.has(token)) {
        this.set.delete(token);
        return false;
      }
      this.set.add(token);
      return true;
    }
    if (force) this.set.add(token);
    else this.set.delete(token);
    return force;
  }
  public contains(token: string): boolean {
    return this.set.has(token);
  }
}

function camelFromDataAttr(attrName: string): string {
  return attrName
    .slice(5)
    .replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

class MiniElement {
  public tagName: string;
  public parentNode: MiniElement | null = null;
  public children: MiniElement[] = [];
  public attributes = new Map<string, string>();
  public dataset: Record<string, string> = {};
  public style = new MiniStyle();
  public classList = new MiniClassList();
  public hidden = false;
  public disabled = false;
  public textContent = '';
  public clientWidth = 0;
  public clientHeight = 0;
  private _className = '';
  private _innerHTML = '';
  private readonly listeners = new Map<string, Array<(ev: unknown) => void>>();

  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
  }

  public get className(): string {
    return this._className;
  }

  public set className(val: string) {
    this._className = val;
    this.classList = new MiniClassList(val);
  }

  public get innerHTML(): string {
    return this._innerHTML;
  }

  public set innerHTML(html: string) {
    this._innerHTML = html;
    this.children = [];
    this.textContent = '';
    parseHtmlInto(html, this);
  }

  public setAttribute(name: string, value: string): void {
    const key = name.toLowerCase();
    this.attributes.set(key, value);
    if (key === 'class') {
      this.className = value;
    } else if (key === 'disabled') {
      this.disabled = true;
    } else if (key.startsWith('data-')) {
      this.dataset[camelFromDataAttr(key)] = value;
    } else if (key === 'style') {
      for (const decl of value.split(';')) {
        const [rawK, rawV] = decl.split(':');
        if (!rawK || !rawV) continue;
        const k = rawK.trim();
        const v = rawV.trim();
        if (k === 'left') this.style.left = v;
        if (k === 'top') this.style.top = v;
        if (k === 'width') this.style.width = v;
        if (k === 'height') this.style.height = v;
        this.style.setProperty(k, v);
      }
    }
  }

  public getAttribute(name: string): string | null {
    const key = name.toLowerCase();
    if (key === 'class') return this._className;
    if (key.startsWith('data-')) {
      const dsKey = camelFromDataAttr(key);
      if (dsKey in this.dataset) return this.dataset[dsKey];
    }
    return this.attributes.has(key) ? this.attributes.get(key)! : null;
  }

  public appendChild(child: MiniElement): MiniElement {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  public remove(): void {
    if (!this.parentNode) return;
    const idx = this.parentNode.children.indexOf(this);
    if (idx >= 0) this.parentNode.children.splice(idx, 1);
    this.parentNode = null;
  }

  public contains(node: unknown): boolean {
    if (node === this) return true;
    for (const c of this.children) {
      if (c.contains(node)) return true;
    }
    return false;
  }

  public getBoundingClientRect(): { left: number; top: number; width: number; height: number } {
    const w = Number.parseFloat(this.style.width) || 0;
    const h = Number.parseFloat(this.style.height) || 0;
    return { left: 0, top: 0, width: w, height: h };
  }

  public addEventListener(type: string, fn: (ev: unknown) => void): void {
    const list = this.listeners.get(type) ?? [];
    list.push(fn);
    this.listeners.set(type, list);
  }

  public removeEventListener(type: string, fn: (ev: unknown) => void): void {
    const list = this.listeners.get(type);
    if (!list) return;
    const idx = list.indexOf(fn);
    if (idx >= 0) list.splice(idx, 1);
  }

  public dispatchEvent(ev: Record<string, unknown>): void {
    const type = String(ev.type ?? '');
    const eventObj = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
      target: this,
      currentTarget: this,
      ...ev,
    };
    const list = [...(this.listeners.get(type) ?? [])];
    for (const fn of list) {
      fn(eventObj);
    }
  }

  public matchesSelector(sel: string): boolean {
    const s = sel.trim();
    if (s.startsWith('.')) {
      return this.classList.contains(s.slice(1));
    }
    const attrEq = s.match(/^\[([a-z0-9-]+)="([^"]*)"\]$/i);
    if (attrEq) {
      return this.getAttribute(attrEq[1]) === attrEq[2];
    }
    const attrHas = s.match(/^\[([a-z0-9-]+)\]$/i);
    if (attrHas) {
      return this.getAttribute(attrHas[1]) !== null;
    }
    return this.tagName === s.toUpperCase();
  }

  public querySelector(sel: string): MiniElement | null {
    for (const c of this.children) {
      if (c.matchesSelector(sel)) return c;
      const found = c.querySelector(sel);
      if (found) return found;
    }
    return null;
  }

  public querySelectorAll(sel: string): MiniElement[] {
    const out: MiniElement[] = [];
    const walk = (node: MiniElement): void => {
      for (const c of node.children) {
        if (c.matchesSelector(sel)) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
}

const VOID_TAGS = new Set(['img', 'br', 'hr', 'input']);

function parseHtmlInto(html: string, parent: MiniElement): void {
  const stack: MiniElement[] = [parent];
  const tokenRe = /<(\/?)([a-zA-Z0-9-]+)([^>]*?)(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(html)) !== null) {
    if (m[5] !== undefined) {
      const text = m[5];
      if (text.trim()) {
        const cur = stack[stack.length - 1];
        cur.textContent = cur.textContent ? `${cur.textContent} ${text.trim()}` : text.trim();
      }
      continue;
    }
    const isClose = m[1] === '/';
    const tag = m[2].toLowerCase();
    const attrsRaw = m[3] ?? '';
    const selfClose = m[4] === '/' || VOID_TAGS.has(tag);

    if (isClose) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const el = new MiniElement(tag);
    const attrRe = /([a-zA-Z0-9:-]+)(?:\s*=\s*"([^"]*)")?/g;
    let am: RegExpExecArray | null;
    while ((am = attrRe.exec(attrsRaw)) !== null) {
      el.setAttribute(am[1], am[2] ?? '');
    }
    stack[stack.length - 1].appendChild(el);
    if (!selfClose) {
      stack.push(el);
    }
  }
}

function installMiniDom(viewportW = 1280, viewportH = 800) {
  const docListeners = new Map<string, Array<(ev: unknown) => void>>();
  const winListeners = new Map<string, Array<(ev: unknown) => void>>();
  const intervals = new Map<number, () => void>();
  let nextTimerId = 1;

  const mockDocument = {
    createElement: (tag: string) => new MiniElement(tag),
    addEventListener: (type: string, fn: (ev: unknown) => void) => {
      const list = docListeners.get(type) ?? [];
      list.push(fn);
      docListeners.set(type, list);
    },
    removeEventListener: (type: string, fn: (ev: unknown) => void) => {
      const list = docListeners.get(type);
      if (!list) return;
      const idx = list.indexOf(fn);
      if (idx >= 0) list.splice(idx, 1);
    },
    dispatchEvent: (ev: Record<string, unknown>) => {
      const list = [...(docListeners.get(String(ev.type ?? '')) ?? [])];
      const eventObj = { preventDefault: vi.fn(), stopPropagation: vi.fn(), ...ev };
      for (const fn of list) fn(eventObj);
    },
  };

  const mockWindow = {
    innerWidth: viewportW,
    innerHeight: viewportH,
    visualViewport: { width: viewportW, height: viewportH },
    getComputedStyle: () => ({
      paddingTop: '10px',
      paddingRight: '12px',
      paddingBottom: '12px',
      paddingLeft: '12px',
    }),
    setInterval: (fn: () => void) => {
      const id = nextTimerId++;
      intervals.set(id, fn);
      return id;
    },
    clearInterval: (id: number) => {
      intervals.delete(id);
    },
    addEventListener: (type: string, fn: (ev: unknown) => void) => {
      const list = winListeners.get(type) ?? [];
      list.push(fn);
      winListeners.set(type, list);
    },
    removeEventListener: (type: string, fn: (ev: unknown) => void) => {
      const list = winListeners.get(type);
      if (!list) return;
      const idx = list.indexOf(fn);
      if (idx >= 0) list.splice(idx, 1);
    },
    dispatchEvent: (ev: Record<string, unknown>) => {
      const list = [...(winListeners.get(String(ev.type ?? '')) ?? [])];
      const eventObj = { preventDefault: vi.fn(), stopPropagation: vi.fn(), ...ev };
      for (const fn of list) fn(eventObj);
    },
  };

  vi.stubGlobal('document', mockDocument);
  vi.stubGlobal('window', mockWindow);

  const mount = new MiniElement('div');
  mount.clientWidth = viewportW;
  mount.clientHeight = viewportH;

  return {
    mount: mount as unknown as HTMLElement,
    mountNode: mount,
    mockDocument,
    mockWindow,
    intervals,
  };
}

function createMockAudioContext() {
  const oscillators: Array<{ freq: number | null; ramps: number[] }> = [];
  const panners: number[] = [];
  let bufferSources = 0;

  const ctx = {
    state: 'running',
    currentTime: 5,
    sampleRate: 44100,
    destination: { connect: vi.fn() },
    resume: vi.fn(() => Promise.resolve()),
    suspend: vi.fn(() => Promise.resolve()),
    createOscillator: vi.fn(() => {
      const rec = { freq: null as number | null, ramps: [] as number[] };
      oscillators.push(rec);
      return {
        type: 'sine',
        frequency: {
          setValueAtTime: vi.fn((v: number) => {
            rec.freq = v;
          }),
          exponentialRampToValueAtTime: vi.fn((v: number) => {
            rec.ramps.push(v);
          }),
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
    }),
    createGain: vi.fn(() => ({
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createBuffer: vi.fn((_ch: number, len: number, sr: number) => ({
      sampleRate: sr,
      length: len,
      getChannelData: () => new Float32Array(len),
    })),
    createBufferSource: vi.fn(() => {
      bufferSources++;
      return {
        buffer: null,
        loop: false,
        playbackRate: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
    }),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass',
      frequency: {
        value: 1000,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      },
      Q: { value: 1, setValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
    createStereoPanner: vi.fn(() => {
      let panVal = 0;
      return {
        pan: {
          get value() {
            return panVal;
          },
          set value(v: number) {
            panVal = v;
            panners.push(v);
          },
        },
        connect: vi.fn(),
      };
    }),
  } as unknown as AudioContext;

  return {
    ctx,
    oscillators,
    panners,
    get bufferSources() {
      return bufferSources;
    },
  };
}

function createFreshSim(): ParkSimulation {
  const sim = new ParkSimulation(new MagicalAudio());
  sim.state.sandboxMode = false;
  sim.state.galleons = 3000;
  sim.state.morningDewPhials = 3;
  return sim;
}

function createRendererOnMockCanvas(omitOptionalMethods = false) {
  const { ctx, calls } = createMockCanvas2d(omitOptionalMethods);
  const fakeCanvas = {
    width: 1280,
    height: 800,
    clientWidth: 1280,
    clientHeight: 800,
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 800 }),
  } as unknown as HTMLCanvasElement;
  const renderer = new IsometricRenderer(fakeCanvas, new SpriteRegistry());
  return { renderer, ctx, calls };
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Hay Day Diegetic Upgrade — World Overlay, Radial UI & Juice/Audio Integration', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('1. drawHayDayDiegeticWorldOverlay & WebGL2/Canvas2D Parity', () => {
    it('draws cleanly on mock Canvas2D (even minimal ctx) and registers stand, newspaper & visitor hotspots at home', () => {
      const sim = createFreshSim();
      const now = Date.now();
      const barn = sim.ensureFarmBarn();
      barn.crops.ottery_wheat = 12;

      // Populate roadside stand with listed + sold + advertised slots, newspaper, visitors & workshop shelf
      sim.listOnRoadsideStand(0, 'ottery_wheat', 4, 'fair', now - 10_000);
      sim.advertiseRoadsideStandSlot(0, now - 10_000);
      sim.listOnRoadsideStand(1, 'ottery_wheat', 3, 'fair', now - 60_000);
      const stand = sim.ensureRoadsideStand();
      stand.slots[1].soldAt = now - 1_000;
      sim.getDailyProphetNewspaper(now);
      const visitors = sim.getFarmVisitors(now);
      expect(visitors.length).toBe(2);

      // Place a completed workshop with mastery ★2 and 5 ready goods to exercise mastery crest & shelf overflow
      const bakeryItem = getCatalogItem('molly_apple_bakery')!;
      sim.state.workshopMastery = { ...(sim.state.workshopMastery ?? {}), [bakeryItem.workshopGroupId!]: 35 };
      sim.state.buildings.push({
        uid: 'ws_bakery_test',
        itemId: bakeryItem.id,
        gx: 18,
        gy: 20,
        rotation: 0,
        stars: 2,
        placedAt: now - 60_000,
        constructEndsAt: 0,
        lastTickAt: now,
        storedSickle: 0,
        storedXp: 0,
        readyBubbles: 1,
        durability: 100,
        visitorsServed: 0,
        readyFarmGoods: [
          'cinnamon_apple_pie',
          'cinnamon_apple_pie',
          'cinnamon_apple_pie',
          'cinnamon_apple_pie',
          'cinnamon_apple_pie',
        ],
      });

      // Mark one farmland plot ripe so golden shimmer runs
      const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
      plot.constructEndsAt = 0;
      plot.cropId = 'ottery_wheat';
      plot.cropPlantedAt = now - 60_000;
      plot.cropReadyAt = now - 1_000;

      const swipeState: HayDaySwipeVisualState = {
        active: true,
        tool: 'sickle',
        cropId: null,
        x: 640,
        y: 400,
        points: [
          { sx: 580, sy: 410, at: now - 90 },
          { sx: 610, sy: 405, at: now - 45 },
          { sx: 640, sy: 400, at: now },
        ],
        comboCount: 3,
      };

      // Test with minimal mock ctx (missing rotate, scale, ellipse, roundRect, rect)
      const { renderer, calls } = createRendererOnMockCanvas(true);
      const cam: Camera = { x: 0, y: 650, zoom: 1.0, viewRot: 0 };
      renderer.hotspots = [];

      expect(() =>
        drawHayDayDiegeticWorldOverlay(renderer, sim, cam, 1280, 800, now, false, swipeState)
      ).not.toThrow();

      expect(calls.length).toBeGreaterThan(0);

      const standHs = renderer.hotspots.filter((h) => h.kind === 'hayday_stand');
      const paperHs = renderer.hotspots.filter((h) => h.kind === 'hayday_newspaper');
      const visitorHs = renderer.hotspots.filter((h) => h.kind === 'hayday_visitor');

      expect(standHs.length).toBe(1);
      expect(standHs[0].id).toBe('hayday_roadside_stand');
      expect(paperHs.length).toBe(1);
      expect(paperHs[0].id).toBe('hayday_daily_prophet');
      expect(visitorHs.length).toBe(2);
      expect(visitorHs.map((h) => h.id).sort()).toEqual(visitors.map((v) => v.id).sort());

      // Regression guard: once visitors arrive (now + 4000ms), all 4 courtyard hotspots have zero pairwise overlap
      renderer.hotspots = [];
      drawHayDayDiegeticWorldOverlay(renderer, sim, cam, 1280, 800, now + 4_000, false, null);
      const courtyardHs = renderer.hotspots.filter(
        (h) =>
          h.kind === 'hayday_stand' ||
          h.kind === 'hayday_newspaper' ||
          h.kind === 'hayday_visitor'
      );
      expect(courtyardHs.length).toBe(4);
      for (let i = 0; i < courtyardHs.length; i++) {
        for (let j = i + 1; j < courtyardHs.length; j++) {
          const a = courtyardHs[i];
          const b = courtyardHs[j];
          const dist = Math.hypot(a.sx - b.sx, a.sy - b.sy);
          expect(dist).toBeGreaterThan(a.radius + b.radius);
        }
      }
    });

    it('suppresses stand, newspaper & visitor hotspots when visiting a neighbor', () => {
      const sim = createFreshSim();
      const now = Date.now();
      sim.getFarmVisitors(now);
      sim.activeVisitNeighborId = 'hagrid_valley';
      sim.homeStateWhileVisiting = sim.state;
      expect(sim.isVisitingNeighbor).toBe(true);

      const { renderer } = createRendererOnMockCanvas(false);
      const cam: Camera = { x: 0, y: 650, zoom: 1.0, viewRot: 0 };
      renderer.hotspots = [];

      expect(() =>
        drawHayDayDiegeticWorldOverlay(renderer, sim, cam, 1280, 800, now, false, null)
      ).not.toThrow();

      expect(renderer.hotspots.some((h) => h.kind === 'hayday_stand')).toBe(false);
      expect(renderer.hotspots.some((h) => h.kind === 'hayday_newspaper')).toBe(false);
      expect(renderer.hotspots.some((h) => h.kind === 'hayday_visitor')).toBe(false);
    });

    it('achieves WebGL2 (renderWorldUiOverlays) & Canvas2D (render) parity for Hay Day diegetic hotspots', () => {
      const sim = createFreshSim();
      sim.getFarmVisitors(Date.now());
      const cam: Camera = { x: 0, y: 650, zoom: 1.0, viewRot: 0 };

      // Canvas2D path
      const c2d = createRendererOnMockCanvas(false);
      c2d.renderer.render(sim, cam, null, null, 0, false, null);
      const c2dKinds = new Set(c2d.renderer.hotspots.map((h) => h.kind));

      // WebGL2 overlay path
      const wgl = createRendererOnMockCanvas(false);
      wgl.renderer.renderWorldUiOverlays(sim, cam, null, null, false, false);
      const wglKinds = new Set(wgl.renderer.hotspots.map((h) => h.kind));

      for (const requiredKind of ['hayday_stand', 'hayday_newspaper', 'hayday_visitor'] as const) {
        expect(c2dKinds.has(requiredKind)).toBe(true);
        expect(wglKinds.has(requiredKind)).toBe(true);
      }
    });
  });

  describe('2. HayDayDiegeticOverlayUI — Radial Wheels, Crop-as-Seed Arc & Visitor Popover', () => {
    function createCallbacks() {
      return {
        onStartSwipeTool: vi.fn<HayDayRadialWheelCallbacks['onStartSwipeTool']>(),
        onTapQuickAction: vi.fn<HayDayRadialWheelCallbacks['onTapQuickAction']>(),
        onOpenFullSeedTray: vi.fn<HayDayRadialWheelCallbacks['onOpenFullSeedTray']>(),
        onOpenPlotInspector: vi.fn<HayDayRadialWheelCallbacks['onOpenPlotInspector']>(),
        onUseMorningDew: vi.fn<HayDayRadialWheelCallbacks['onUseMorningDew']>(),
        onVisitorAccepted: vi.fn<HayDayRadialWheelCallbacks['onVisitorAccepted']>(),
        onVisitorDismissed: vi.fn<HayDayRadialWheelCallbacks['onVisitorDismissed']>(),
      };
    }

    it('opens Ripe Sickle Wheel and triggers tap quick-action, >8px swipe drag, and inspector callbacks', () => {
      const dom = installMiniDom(1280, 800);
      const sim = createFreshSim();
      const cb = createCallbacks();
      const ui = new HayDayDiegeticOverlayUI(dom.mount, sim, cb);

      const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
      plot.constructEndsAt = 0;
      plot.cropId = 'ottery_wheat';
      plot.cropReadyAt = Date.now() - 2_000;

      // 1) Tap sickle handle
      ui.openPlotWheel(plot.uid, 600, 420);
      expect(ui.isOpen()).toBe(true);
      const rootEl = dom.mountNode.children[0];
      expect(rootEl.dataset.hdMode).toBe('ripe');

      const sickleBtn = rootEl.querySelector('[data-hd-drag-tool="sickle"]');
      expect(sickleBtn).not.toBeNull();
      sickleBtn!.dispatchEvent({ type: 'pointerdown', pointerType: 'touch', button: 0, pointerId: 7, clientX: 600, clientY: 360 });
      dom.mockWindow.dispatchEvent({ type: 'pointerup', pointerId: 7, clientX: 602, clientY: 361 });

      expect(cb.onTapQuickAction).toHaveBeenCalledWith('sickle', null, plot.uid);
      expect(cb.onStartSwipeTool).not.toHaveBeenCalled();
      expect(ui.isOpen()).toBe(false);

      // 2) Drag >8px from sickle handle triggers onStartSwipeTool
      ui.openPlotWheel(plot.uid, 600, 420);
      const sickleBtn2 = rootEl.querySelector('[data-hd-drag-tool="sickle"]')!;
      sickleBtn2.dispatchEvent({ type: 'pointerdown', pointerType: 'touch', button: 0, pointerId: 9, clientX: 600, clientY: 360 });
      dom.mockWindow.dispatchEvent({ type: 'pointermove', pointerId: 9, clientX: 625, clientY: 360 });

      expect(cb.onStartSwipeTool).toHaveBeenCalledWith('sickle', null, 625, 360, 9, plot.uid);
      expect(ui.isOpen()).toBe(false);

      // 3) Inspector pill opens plot inspector
      ui.openPlotWheel(plot.uid, 600, 420);
      rootEl.querySelector('[data-hd-action="inspector"]')!.dispatchEvent({ type: 'click' });
      expect(cb.onOpenPlotInspector).toHaveBeenCalledWith(plot.uid);

      ui.destroy();
    });

    it('opens Growing Water Wheel with live countdown, Water drag/tap, Morning Dew CTA & watered state', () => {
      const dom = installMiniDom(1280, 800);
      const sim = createFreshSim();
      sim.state.morningDewPhials = 4;
      const cb = createCallbacks();
      const ui = new HayDayDiegeticOverlayUI(dom.mount, sim, cb);

      const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
      plot.constructEndsAt = 0;
      plot.cropId = 'ottery_wheat';
      plot.cropReadyAt = Date.now() + 90_000;
      plot.cropWateredBoost = false;

      ui.openPlotWheel(plot.uid, 500, 400);
      const rootEl = dom.mountNode.children[0];
      expect(rootEl.dataset.hdMode).toBe('growing');
      expect(rootEl.querySelector('[data-hd-countdown]')).not.toBeNull();
      expect(dom.intervals.size).toBe(1);

      // Water handle tap
      const waterBtn = rootEl.querySelector('[data-hd-drag-tool="water"]');
      expect(waterBtn).not.toBeNull();
      waterBtn!.dispatchEvent({ type: 'click' });
      expect(cb.onTapQuickAction).toHaveBeenCalledWith('water', null, plot.uid);
      expect(dom.intervals.size).toBe(0);

      // Morning Dew button
      ui.openPlotWheel(plot.uid, 500, 400);
      const dewBtn = rootEl.querySelector('[data-hd-action="morning-dew"]');
      expect(dewBtn).not.toBeNull();
      dewBtn!.dispatchEvent({ type: 'click' });
      expect(cb.onUseMorningDew).toHaveBeenCalledWith(plot.uid);

      // Already watered plot swaps handle for watered badge
      plot.cropWateredBoost = true;
      ui.openPlotWheel(plot.uid, 500, 400);
      expect(rootEl.querySelector('[data-hd-drag-tool="water"]')).toBeNull();
      expect(rootEl.querySelector('.hs-radial-watered-badge')).not.toBeNull();

      ui.destroy();
    });

    it('opens Empty 6-Crop Seed Arc Wheel sorted by Crop-as-Seed getPlantableSeedCount and clamps cleanly at 390px mobile', () => {
      const dom = installMiniDom(390, 844);
      const sim = createFreshSim();
      sim.state.level = 25; // Unlock >= 6 crops
      const barn = sim.ensureFarmBarn();
      // Zero seed pouch for ottery_wheat, but 7 harvested wheat crops in Barn (Crop-as-Seed!)
      barn.seeds = {};
      for (const k of Object.keys(barn.crops)) {
        barn.crops[k as FarmCropId] = 0;
      }
      barn.crops.ottery_wheat = 7;
      barn.crops.honey_carrot = 3;
      expect(sim.getSeedCount('ottery_wheat')).toBe(0);
      expect(sim.getPlantableSeedCount('ottery_wheat')).toBe(7);

      const cb = createCallbacks();
      const ui = new HayDayDiegeticOverlayUI(dom.mount, sim, cb);

      const plot = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot)!;
      plot.constructEndsAt = 0;
      plot.cropId = null;
      plot.cropReadyAt = undefined;

      // Anchor near extreme left/top edge on 390x844 iPhone viewport to test safe clamping
      ui.openPlotWheel(plot.uid, 8, 12);
      const rootEl = dom.mountNode.children[0];
      expect(rootEl.dataset.hdMode).toBe('empty');

      const seedTiles = rootEl.querySelectorAll('[data-hd-drag-tool="seed"]');
      expect(seedTiles.length).toBe(6);

      // Highest Crop-as-Seed count comes first, with drag enabled; 0-stock crops are marked empty-stock
      expect(seedTiles[0].dataset.hdCropId).toBe('ottery_wheat');
      expect(seedTiles[0].dataset.hdCanDrag).toBe('1');
      expect(seedTiles[0].querySelector('.hs-seed-arc-count')?.textContent).toBe('×7');
      expect(seedTiles[1].dataset.hdCropId).toBe('honey_carrot');
      expect(seedTiles[1].dataset.hdCanDrag).toBe('1');

      const emptyStockTile = seedTiles.find((t) => t.dataset.hdCanDrag === '0');
      expect(emptyStockTile).toBeDefined();
      expect(emptyStockTile!.classList.contains('is-empty-stock')).toBe(true);

      // Verify clamping inside mobile 390x844 safe viewport bounds
      const arcEl = rootEl.querySelector('.hs-radial-seed-arc')!;
      const leftPx = Number.parseFloat(arcEl.style.left);
      const topPx = Number.parseFloat(arcEl.style.top);
      const widthPx = Number.parseFloat(arcEl.style.width);
      expect(leftPx).toBeGreaterThanOrEqual(12);
      expect(leftPx + widthPx).toBeLessThanOrEqual(390 - 12);
      expect(topPx).toBeGreaterThanOrEqual(64);

      // Dragging stocked seed tile >8px starts seed swipe
      seedTiles[0].dispatchEvent({ type: 'pointerdown', pointerType: 'touch', button: 0, pointerId: 3, clientX: 80, clientY: 160 });
      dom.mockWindow.dispatchEvent({ type: 'pointermove', pointerId: 3, clientX: 98, clientY: 165 });
      expect(cb.onStartSwipeTool).toHaveBeenCalledWith('seed', 'ottery_wheat', 98, 165, 3, plot.uid);

      // All-seeds pill opens full tray
      ui.openPlotWheel(plot.uid, 200, 400);
      rootEl.querySelector('[data-hd-action="all-seeds"]')!.dispatchEvent({ type: 'click' });
      expect(cb.onOpenFullSeedTray).toHaveBeenCalledWith(plot.uid);

      ui.destroy();
    });

    it('opens Visitor Quick-Offer Popover with stock gating, accept/dismiss callbacks & Escape/outside close', () => {
      const dom = installMiniDom(393, 852);
      const sim = createFreshSim();
      const now = Date.now();
      const visitors = sim.getFarmVisitors(now);
      const v0 = visitors[0];
      expect(v0).toBeDefined();

      // Clear stock first so accept button is disabled
      const barn = sim.ensureFarmBarn();
      for (const k of Object.keys(barn.crops)) {
        barn.crops[k as FarmCropId] = 0;
      }
      for (const k of Object.keys(barn.goods)) {
        barn.goods[k as FarmGoodId] = 0;
      }

      const cb = createCallbacks();
      const ui = new HayDayDiegeticOverlayUI(dom.mount, sim, cb);

      ui.openVisitorPopover(v0.id, 385, 18);
      const rootEl = dom.mountNode.children[0];
      expect(rootEl.dataset.hdMode).toBe('visitor');

      const acceptDisabledBtn = rootEl.querySelector('[data-hd-action="visitor-accept"]')!;
      expect(acceptDisabledBtn.disabled).toBe(true);
      acceptDisabledBtn.dispatchEvent({ type: 'click' });
      expect(cb.onVisitorAccepted).not.toHaveBeenCalled();

      // Verify popover clamped cleanly inside 393px viewport
      const card = rootEl.querySelector('.hs-visitor-popover')!;
      const cardLeft = Number.parseFloat(card.style.left);
      const cardTop = Number.parseFloat(card.style.top);
      expect(cardLeft).toBeGreaterThanOrEqual(12);
      expect(cardTop).toBeGreaterThanOrEqual(64);

      // Escape key closes popover
      dom.mockDocument.dispatchEvent({ type: 'keydown', key: 'Escape' });
      expect(ui.isOpen()).toBe(false);

      // Restock requested item -> accept button enabled and fires onVisitorAccepted
      sim.addFarmItemToBarn(v0.itemId, v0.qty + 2);
      ui.openVisitorPopover(v0.id, 200, 320);
      const acceptEnabledBtn = rootEl.querySelector('[data-hd-action="visitor-accept"]')!;
      expect(acceptEnabledBtn.disabled).toBe(false);
      acceptEnabledBtn.dispatchEvent({ type: 'click' });
      expect(cb.onVisitorAccepted).toHaveBeenCalledWith(v0.id);
      expect(ui.isOpen()).toBe(false);

      // Dismiss button fires onVisitorDismissed
      ui.openVisitorPopover(v0.id, 200, 320);
      rootEl.querySelector('[data-hd-action="visitor-dismiss"]')!.dispatchEvent({ type: 'click' });
      expect(cb.onVisitorDismissed).toHaveBeenCalledWith(v0.id);
      expect(ui.isOpen()).toBe(false);

      // Outside pointerdown closes popover
      ui.openVisitorPopover(v0.id, 200, 320);
      expect(ui.isOpen()).toBe(true);
      dom.mockDocument.dispatchEvent({ type: 'pointerdown', target: new MiniElement('canvas') });
      expect(ui.isOpen()).toBe(false);

      ui.destroy();
    });
  });

  describe('3. JuiceFX.spawnHarvestFlight + MagicalAudio.playSwipeHarvestNote Integration', () => {
    it('chains real multi-plot harvest with ascending pentatonic audio, stereo pan & parabolic flights to Barn anchor', () => {
      const mockAudio = createMockAudioContext();
      function MockAudioContext() {
        return mockAudio.ctx;
      }
      vi.stubGlobal('window', {
        AudioContext: MockAudioContext,
        addEventListener: vi.fn(),
      });

      const audio = new MagicalAudio();
      vi.spyOn(audio, 'canPlaySfxVoice').mockReturnValue(true);
      const sim = new ParkSimulation(audio);
      sim.state.sandboxMode = false;

      const juice = new JuiceFX({ reducedMotion: false });
      const existingPlots = sim.state.buildings.filter(
        (b) => getCatalogItem(b.itemId)?.isFarmlandPlot
      );
      expect(existingPlots.length).toBeGreaterThanOrEqual(1);
      while (existingPlots.length < 3) {
        const idx = existingPlots.length;
        const extra = {
          ...existingPlots[0],
          uid: `test_swipe_plot_${idx}`,
          gx: existingPlots[0].gx + idx + 2,
          gy: existingPlots[0].gy,
        };
        sim.state.buildings.push(extra);
        existingPlots.push(extra);
      }
      const ripePlots = existingPlots.slice(0, 3);

      const now = Date.now();
      for (const p of ripePlots) {
        p.constructEndsAt = 0;
        p.cropId = 'ottery_wheat';
        p.cropPlantedAt = now - 60_000;
        p.cropReadyAt = now - 1_000;
      }

      const barnAnchor = { x: 140, y: 740 };
      const cropSprite = { width: 32, height: 32 } as unknown as CanvasImageSource;
      const fundamentalFreqs: number[] = [];

      ripePlots.forEach((p, comboIdx) => {
        const res = sim.harvestCropPlot(p.uid);
        expect(res.ok).toBe(true);
        const beforeOsc = mockAudio.oscillators.length;
        const pan = (comboIdx - 1) * 0.4;
        sim.audio.playSwipeHarvestNote(comboIdx, pan);
        fundamentalFreqs.push(mockAudio.oscillators[beforeOsc].freq ?? 0);

        const launched = juice.spawnHarvestFlight(
          480 + comboIdx * 55,
          360,
          barnAnchor.x,
          barnAnchor.y,
          cropSprite,
          '#fde047',
          2
        );
        expect(launched).toBe(2);
        juice.spawnHarvestBurstRing(480 + comboIdx * 55, 360, '#fde047');
      });

      // Ascending C-major pentatonic climb (C5 -> D5 -> E5) + zero screen shake
      expect(fundamentalFreqs).toEqual([523.25, 587.33, 659.25]);
      expect(juice.flights.getActiveFlightCount()).toBe(6);
      expect(juice.flights.getActiveRingCount()).toBe(3);
      expect(juice.screenShake.intensity).toBe(0);

      // Tick & render mid-flight onto mock canvas, then complete cleanly back to pool
      const { ctx } = createMockCanvas2d(false);
      juice.tick(0.24);
      juice.applyTo(ctx, 1280, 800);
      expect(ctx.drawImage).toHaveBeenCalled();

      for (let i = 0; i < 45; i++) {
        juice.tick(1 / 30);
      }
      expect(juice.flights.getActiveFlightCount()).toBe(0);
      expect(juice.flights.getActiveRingCount()).toBe(0);

      // Also verify mailbox rustle & workshop collect audio integrate cleanly
      const prevBuffers = mockAudio.bufferSources;
      sim.audio.playMailboxRustle(0.15);
      sim.audio.playWorkshopCollectNote(1, -0.2);
      expect(mockAudio.bufferSources).toBeGreaterThan(prevBuffers);
    });
  });
});
