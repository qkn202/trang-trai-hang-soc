import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import {
  computeAtlasMetrics,
  getJigsawStageArtworkSpec,
  getJigsawStageSpec,
  JIGSAW_ATLAS_MAX_SIDE,
  JIGSAW_MAX_LOOSE_CLUSTERS,
  JIGSAW_MAX_PIECES,
  JIGSAW_MAX_TIME_SEC,
  JIGSAW_MIN_TIME_SEC,
  JIGSAW_PAINTINGS,
  JIGSAW_PIECE_BOARD,
  JIGSAW_PIECE_LOCKED,
  JIGSAW_PIECE_TRAY,
  MasterJigsawEngine,
  resolveJigsawBoardAspect,
} from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';
import { PuzzleArcadeModalController } from '../../ui/puzzleArcadeModal';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('MasterJigsawEngine & 777 Harry Potter Paintings ("Tranh Ghép Phép Thuật")', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('scales progressively from 3x3 = 9 pieces (150s) to 40x50 = 2000 pieces (max 7200s = 2 hours) with iOS-safe <= 2048x2048 atlas', () => {
    const lv1 = getJigsawStageSpec(1);
    expect(lv1.rows).toBe(3);
    expect(lv1.cols).toBe(3);
    expect(lv1.totalPieces).toBe(9);
    expect(lv1.timeLimitSec).toBe(150);

    const lv777 = getJigsawStageSpec(777);
    expect(lv777.rows).toBe(40);
    expect(lv777.cols).toBe(50);
    expect(lv777.totalPieces).toBe(2000);
    expect(lv777.timeLimitSec).toBe(7200);

    let prevMainPieces = 0;
    let prevMainTime = 0;
    for (let s = 1; s <= 777; s++) {
      const spec = getJigsawStageSpec(s);
      expect(spec.totalPieces).toBe(spec.rows * spec.cols);
      expect(spec.totalPieces).toBeGreaterThanOrEqual(9);
      expect(spec.totalPieces).toBeLessThanOrEqual(JIGSAW_MAX_PIECES);
      expect(spec.timeLimitSec).toBeGreaterThanOrEqual(JIGSAW_MIN_TIME_SEC);
      expect(spec.timeLimitSec).toBeLessThanOrEqual(JIGSAW_MAX_TIME_SEC);

      if (!spec.isBreatherStage) {
        expect(spec.totalPieces).toBeGreaterThanOrEqual(prevMainPieces);
        expect(spec.timeLimitSec).toBeGreaterThanOrEqual(prevMainTime);
        prevMainPieces = spec.totalPieces;
        prevMainTime = spec.timeLimitSec;
      }

      const atlas = computeAtlasMetrics(spec.rows, spec.cols);
      expect(atlas.atlasW).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
      expect(atlas.atlasH).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
      expect(atlas.atlasW * atlas.atlasH).toBeLessThanOrEqual(4194304);
    }
  });

  it('generates 777 distinct Harry Potter artworks across all 777 stages (zero duplicate titles, IDs, or signatures)', () => {
    expect(JIGSAW_PAINTINGS.length).toBeGreaterThanOrEqual(19);

    const ids = new Set<string>();
    const titles = new Set<string>();
    const signatures = new Set<string>();
    const styles = new Set<string>();

    for (let s = 1; s <= 777; s++) {
      const art = getJigsawStageArtworkSpec(s);
      expect(art.stage).toBe(s);
      expect(art.paintingId.length).toBeGreaterThan(3);
      expect(art.titleVi.length).toBeGreaterThan(5);
      ids.add(art.paintingId);
      titles.add(art.titleVi);
      signatures.add(art.signatureKey);
      styles.add(art.artStyle);
    }

    expect(ids.size).toBe(777);
    expect(titles.size).toBe(777);
    expect(signatures.size).toBe(777);
    expect(styles.size).toBe(8);
  });

  it('supports interlocking tabs, Union-Find neighbor cluster merging, smart tray filters, tidy singletons, timer, and Phoenix Talisman', () => {
    const game = new MasterJigsawEngine(16); // 4x5 = 20 pieces, 300s
    expect(game.rows).toBe(4);
    expect(game.cols).toBe(5);
    expect(game.totalPieces).toBe(20);
    expect(game.timeLimitSec).toBe(300);
    expect(game.formatRemainingTime()).toBe('05:00');

    // Verify outer borders are flat (0) and interior shared edges are exact opposites (+1 / -1)
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        const idx = r * game.cols + c;
        const top = game.pieceEdges[idx * 4];
        const right = game.pieceEdges[idx * 4 + 1];
        const bottom = game.pieceEdges[idx * 4 + 2];
        const left = game.pieceEdges[idx * 4 + 3];
        if (r === 0) expect(top).toBe(0);
        if (r === game.rows - 1) expect(bottom).toBe(0);
        if (c === 0) expect(left).toBe(0);
        if (c === game.cols - 1) expect(right).toBe(0);
        if (c + 1 < game.cols) {
          const rightNeighborLeft = game.pieceEdges[(r * game.cols + (c + 1)) * 4 + 3];
          expect(right + rightNeighborLeft).toBe(0);
          expect(Math.abs(right)).toBe(1);
        }
        if (r + 1 < game.rows) {
          const bottomNeighborTop = game.pieceEdges[((r + 1) * game.cols + c) * 4];
          expect(bottom + bottomNeighborTop).toBe(0);
          expect(Math.abs(bottom)).toBe(1);
        }
      }
    }

    // Verify smart tray filters partition the 20 pieces accurately (14 edge pieces on 4x5, 4 quadrants = 20 total)
    expect(game.getTrayCountForFilter('all')).toBe(20);
    expect(game.getTrayCountForFilter('edges')).toBe(14);
    const qSum =
      game.getTrayCountForFilter('q0') +
      game.getTrayCountForFilter('q1') +
      game.getTrayCountForFilter('q2') +
      game.getTrayCountForFilter('q3');
    expect(qSum).toBe(20);

    // Spawn piece 0 (0,0) and piece 1 (0,1) displaced by exact same delta (+0.35, +0.35) -> merges into 2-piece cluster!
    const t0 = game.getTargetNormCenter(0);
    const t1 = game.getTargetNormCenter(1);
    expect(game.spawnTrayPieceOntoBoard(0, t0.nx + 0.35, t0.ny + 0.35)).toBe(true);
    expect(game.dropClusterAndResolve(0, 600, 480).lockedPieces).toHaveLength(0);

    expect(game.spawnTrayPieceOntoBoard(1, t1.nx + 0.35, t1.ny + 0.35)).toBe(true);
    const mergeDrop = game.dropClusterAndResolve(1, 600, 480);
    expect(mergeDrop.mergedWithNeighbor).toBe(true);
    expect(mergeDrop.clusterSize).toBe(2);
    expect(game.findClusterRoot(0)).toBe(game.findClusterRoot(1));

    // Also drop a loose single piece 19 far from frame; tidyLooseSinglePieces returns piece 19 but keeps cluster {0,1}!
    expect(game.spawnTrayPieceOntoBoard(19, 0.25, 0.25)).toBe(true);
    expect(game.tidyLooseSinglePieces()).toBe(1);
    expect(game.pieceState[19]).toBe(JIGSAW_PIECE_TRAY);
    expect(game.pieceState[0]).toBe(JIGSAW_PIECE_BOARD);
    expect(game.pieceState[1]).toBe(JIGSAW_PIECE_BOARD);

    // Move the merged cluster {0, 1} onto piece 0's target frame -> both pieces lock simultaneously!
    game.movePieceClusterToNorm(0, t0.nx, t0.ny);
    const lockDrop = game.dropClusterAndResolve(0, 600, 480);
    expect(lockDrop.lockedPieces.sort((a, b) => a - b)).toEqual([0, 1]);
    expect(game.lockedCount).toBe(2);
    expect(game.pieceState[0]).toBe(JIGSAW_PIECE_LOCKED);
    expect(game.pieceState[1]).toBe(JIGSAW_PIECE_LOCKED);

    // Timeout & Phoenix Talisman revival
    const tickOut = game.tickTimer(500);
    expect(tickOut.timedOut).toBe(true);
    expect(game.status).toBe('lost');
    expect(game.lossReason).toBe('timeout');

    const talisman = game.applyPhoenixTalisman();
    expect(talisman.ok).toBe(true);
    expect(game.status).toBe('playing');
    expect(game.timeRemainingSec).toBeGreaterThanOrEqual(180);
    expect(game.timeRemainingSec).toBeLessThanOrEqual(JIGSAW_MAX_TIME_SEC);
    expect(game.applyPhoenixTalisman().ok).toBe(false); // Strictly 1 talisman per attempt

    // Complete remaining pieces with Magic Hint / direct frame drops
    const pieBoost = game.applyApplePieBoost();
    expect(pieBoost.lockedPieces.length).toBeGreaterThanOrEqual(1);

    for (let idx = 0; idx < game.totalPieces; idx++) {
      if (game.pieceState[idx] === JIGSAW_PIECE_LOCKED) continue;
      const tc = game.getTargetNormCenter(idx);
      if (game.pieceState[idx] === JIGSAW_PIECE_TRAY) {
        game.spawnTrayPieceOntoBoard(idx, tc.nx, tc.ny);
      } else {
        game.movePieceClusterToNorm(idx, tc.nx, tc.ny);
      }
      game.dropClusterAndResolve(idx, 600, 480);
    }

    expect(game.status).toBe('won');
    expect(game.lockedCount).toBe(20);
    expect(game.remainingPieces).toBe(0);
    expect(game.getTurningPointReview()?.mode).toBe('jigsaw');
  });

  it('persists compact (< 1.8 KB) 2000-piece Stage 777 sessions and integrates with ParkSimulation & Leaderboard', () => {
    const grandmaster = new MasterJigsawEngine(777);
    expect(grandmaster.totalPieces).toBe(2000);
    expect(grandmaster.formatRemainingTime()).toBe('02:00:00');

    // Lock 120 pieces + create a loose 2-piece cluster on board
    for (let i = 0; i < 120; i++) {
      const tc = grandmaster.getTargetNormCenter(i);
      grandmaster.spawnTrayPieceOntoBoard(i, tc.nx, tc.ny);
      grandmaster.dropClusterAndResolve(i, 900, 720);
    }
    const pA = 500;
    const pB = 501;
    const tA = grandmaster.getTargetNormCenter(pA);
    const tB = grandmaster.getTargetNormCenter(pB);
    grandmaster.spawnTrayPieceOntoBoard(pA, tA.nx + 0.15, tA.ny + 0.15);
    grandmaster.spawnTrayPieceOntoBoard(pB, tB.nx + 0.15, tB.ny + 0.15);
    grandmaster.dropClusterAndResolve(pB, 900, 720);
    grandmaster.tickTimer(425); // 01:52:55 remaining

    const exported = grandmaster.exportSession({ companionCharge: 3, snackPieUsed: true });
    const serialized = JSON.stringify(exported);
    expect(serialized.length).toBeLessThan(1800);

    const restored = new MasterJigsawEngine(777);
    expect(restored.restoreSession(exported)).toBe(true);
    expect(restored.lockedCount).toBe(120);
    expect(restored.findClusterRoot(pA)).toBe(restored.findClusterRoot(pB));
    expect(Math.round(restored.timeRemainingSec)).toBe(7200 - 425);

    // ParkSimulation Stage 777 session save/load round-trip + Stage 1 victory & scored leaderboard integration
    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.puzzleArcade.jigsawStage = 777;
    sim.state.puzzleArcade.jigsawCleared = 776;
    sim.state.puzzleArcade.jigsawSession = exported;
    sim.saveToStorage();

    const reloadedSim = new ParkSimulation(new MagicalAudio());
    expect(reloadedSim.loadFromStorage()).toBeTruthy();
    expect(reloadedSim.state.puzzleArcade.jigsawStage).toBe(777);
    expect(reloadedSim.state.puzzleArcade.jigsawSession?.placedBitsetB64).toBe(
      exported.placedBitsetB64
    );
    expect(reloadedSim.state.puzzleArcade.jigsawSession?.looseClusters).toHaveLength(1);

    storageMap.clear();
    const freshSim = new ParkSimulation(new MagicalAudio());
    const lv1Art = getJigsawStageArtworkSpec(1);
    const winSummary = freshSim.completePuzzleArcadeVictory(
      'jigsaw',
      { stars: 2, sand: 1, gold: 125, xp: 40, paintingId: lv1Art.paintingId },
      { sessionScore: 3450, efficiency: 5 }
    );
    expect(winSummary.nextStage).toBe(2);
    expect(freshSim.state.puzzleArcade.jigsawStage).toBe(2);
    expect(freshSim.state.puzzleArcade.jigsawCleared).toBe(1);
    expect(freshSim.state.puzzleArcade.restoredPaintings).toContain(lv1Art.paintingId);
    expect(winSummary.leaderboardRankUp?.gameId).toBe('jigsaw');
    expect(
      freshSim.ensureMinigameLeaderboard().records.jigsaw.bestSessionScore
    ).toBe(3450);
  });

  it('maximizes Jigsaw board aspect ratio across widescreen landscape and mobile portrait while keeping atlas <= 2048x2048', () => {
    // Stage 1 (3x3) expands from cramped 1:1 square to wide ~1.70 panoramic canvas on desktop landscape
    const wideLv1Aspect = resolveJigsawBoardAspect(3, 3, 1180, 690);
    expect(wideLv1Aspect).toBeGreaterThanOrEqual(1.65);
    expect(wideLv1Aspect).toBeLessThanOrEqual(1.75);

    // Stage 1 (3x3) adapts tall (~0.75-0.80) on mobile portrait to fill vertical screen space
    const tallLv1Aspect = resolveJigsawBoardAspect(3, 3, 368, 472);
    expect(tallLv1Aspect).toBeGreaterThanOrEqual(0.75);
    expect(tallLv1Aspect).toBeLessThanOrEqual(0.85);

    // Verify iOS <= 2048x2048 atlas safety across all 777 stages in both landscape and portrait aspects
    for (const s of [1, 16, 100, 350, 600, 777]) {
      const spec = getJigsawStageSpec(s);
      for (const [aw, ah] of [
        [1200, 700],
        [370, 480],
      ] as const) {
        const aspect = resolveJigsawBoardAspect(spec.rows, spec.cols, aw, ah);
        const atlas = computeAtlasMetrics(spec.rows, spec.cols, aspect);
        expect(atlas.atlasW).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
        expect(atlas.atlasH).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
        expect(atlas.atlasW * atlas.atlasH).toBeLessThanOrEqual(4194304);
      }
    }
  });

  it('P1-5: preserves bonus timeRemainingSec > timeLimitSec across session serialize/deserialize up to JIGSAW_MAX_TIME_SEC', () => {
    const game = new MasterJigsawEngine(1); // timeLimitSec = 150
    expect(game.timeLimitSec).toBe(150);
    game.timeRemainingSec = 240; // Bonus time earned above stage limit
    const saved = game.exportSession();
    const restored = new MasterJigsawEngine(1);
    expect(restored.restoreSession(saved)).toBe(true);
    expect(restored.timeRemainingSec).toBe(240);
  });

  it('preserves Jigsaw tray scrollLeft in place across piece selection, board spawn, collapse toggle, and resets on filter change', () => {
    class MiniDomClassList {
      private cls = new Set<string>();
      add(...items: string[]): void {
        for (const it of items) {
          for (const part of it.split(/\s+/)) {
            if (part) this.cls.add(part);
          }
        }
      }
      remove(...items: string[]): void {
        for (const it of items) this.cls.delete(it);
      }
      toggle(it: string, force?: boolean): boolean {
        const next = force === undefined ? !this.cls.has(it) : Boolean(force);
        if (next) this.cls.add(it);
        else this.cls.delete(it);
        return next;
      }
      contains(it: string): boolean {
        return this.cls.has(it);
      }
    }

    class MiniDomEl {
      public tagName = 'DIV';
      public id = '';
      public type = '';
      public className = '';
      public classList = new MiniDomClassList();
      public dataset: Record<string, string> = {};
      public attributes = new Map<string, string>();
      public style: Record<string, string> = {};
      public children: MiniDomEl[] = [];
      public parentElement: MiniDomEl | null = null;
      public textContent = '';
      public title = '';
      public disabled = false;
      public hidden = false;
      public width = 0;
      public height = 0;
      public clientWidth = 0;
      public scrollWidth = 0;
      public scrollLeft = 0;
      private listeners = new Map<string, Array<(ev: unknown) => void>>();

      constructor(tagName = 'DIV') {
        this.tagName = tagName.toUpperCase();
      }
      setAttribute(k: string, v: string): void {
        this.attributes.set(k, v);
        if (k === 'id') this.id = v;
        if (k === 'hidden') this.hidden = true;
        if (k.startsWith('data-')) {
          const camel = k
            .slice(5)
            .replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
          this.dataset[camel] = v;
        }
      }
      getAttribute(k: string): string | null {
        return this.attributes.get(k) ?? null;
      }
      appendChild(child: MiniDomEl): MiniDomEl {
        if (child.parentElement) {
          child.parentElement.children = child.parentElement.children.filter((x) => x !== child);
        }
        child.parentElement = this;
        this.children.push(child);
        return child;
      }
      insertBefore(child: MiniDomEl, refNode: MiniDomEl | null): MiniDomEl {
        if (child.parentElement) {
          child.parentElement.children = child.parentElement.children.filter((x) => x !== child);
        }
        child.parentElement = this;
        if (!refNode) {
          this.children.push(child);
          return child;
        }
        const idx = this.children.indexOf(refNode);
        if (idx === -1) this.children.push(child);
        else this.children.splice(idx, 0, child);
        return child;
      }
      remove(): void {
        if (this.parentElement) {
          this.parentElement.children = this.parentElement.children.filter((x) => x !== this);
          this.parentElement = null;
        }
      }
      setPointerCapture(): void {}
      getContext(): null {
        return null;
      }
      addEventListener(type: string, cb: (ev: unknown) => void): void {
        const list = this.listeners.get(type) ?? [];
        list.push(cb);
        this.listeners.set(type, list);
      }
      dispatch(type: string, ev: Record<string, unknown> = {}): void {
        const eventObj = {
          type,
          target: this,
          preventDefault: () => {},
          ...ev,
        };
        for (const cb of this.listeners.get(type) ?? []) {
          cb(eventObj);
        }
      }
      private matches(sel: string): boolean {
        if (sel.startsWith('#')) return this.id === sel.slice(1);
        if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
        const attrMatch = sel.match(/^([a-z]*)\[([^=\]]+)(?:="([^"]*)")?\]$/i);
        if (attrMatch) {
          const [, tag, attr, val] = attrMatch;
          if (tag && this.tagName !== tag.toUpperCase()) return false;
          const got = this.attributes.get(attr);
          if (got === undefined) {
            if (attr.startsWith('data-')) {
              const camel = attr
                .slice(5)
                .replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
              const dVal = this.dataset[camel];
              return val !== undefined ? dVal === val : dVal !== undefined;
            }
            return false;
          }
          return val !== undefined ? got === val : true;
        }
        return false;
      }
      querySelector(sel: string): MiniDomEl | null {
        for (const c of this.children) {
          if (c.matches(sel)) return c;
          const nested = c.querySelector(sel);
          if (nested) return nested;
        }
        return null;
      }
      querySelectorAll(sel: string): MiniDomEl[] {
        const out: MiniDomEl[] = [];
        for (const c of this.children) {
          if (c.matches(sel)) out.push(c);
          out.push(...c.querySelectorAll(sel));
        }
        return out;
      }
      set innerHTML(html: string) {
        this.children = [];
        const stack: MiniDomEl[] = [this];
        const tagRe = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
        let match: RegExpExecArray | null;
        while ((match = tagRe.exec(html)) !== null) {
          const full = match[0];
          const tag = match[1];
          const attrsStr = match[2];
          if (full.startsWith('</')) {
            if (stack.length > 1) stack.pop();
            continue;
          }
          const el = new MiniDomEl(tag);
          const attrRe = /([a-zA-Z0-9-]+)(?:="([^"]*)")?/g;
          let am: RegExpExecArray | null;
          while ((am = attrRe.exec(attrsStr)) !== null) {
            const k = am[1];
            const v = am[2] ?? '';
            if (k === 'class') el.classList.add(v);
            else el.setAttribute(k, v);
          }
          stack[stack.length - 1].appendChild(el);
          if (!full.endsWith('/>')) stack.push(el);
        }
      }
    }

    const bodyEl = new MiniDomEl('body');
    const dockEl = new MiniDomEl('div');
    dockEl.setAttribute('id', 'paJigsawTrayDock');
    const rootEl = new MiniDomEl('div');
    rootEl.appendChild(dockEl);

    const mockAudio = {
      enabled: false,
      bgmEnabled: false,
      playClick: vi.fn(),
      playMatchPop: vi.fn(),
      playChessClack: vi.fn(),
      playPowerupBlast: vi.fn(),
      playLevelUp: vi.fn(),
    } as unknown as MagicalAudio;
    const sim = new ParkSimulation(mockAudio);

    vi.stubGlobal('document', {
      createElement: (tag: string) => new MiniDomEl(tag),
      body: bodyEl,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    vi.stubGlobal(
      'Image',
      class {
        public decoding = '';
        public src = '';
        public complete = false;
        public naturalWidth = 0;
      }
    );

    try {
      const ctrl = new PuzzleArcadeModalController(
        rootEl as unknown as HTMLElement,
        sim,
        vi.fn(),
        vi.fn(),
        vi.fn()
      ) as unknown as {
        mode: string;
        jigsawEngine: MasterJigsawEngine;
        renderJigsawTrayDockDOM: (preserveScroll?: boolean) => void;
      };
      const je = new MasterJigsawEngine(16); // 4x5 = 20 pieces in tray
      ctrl.mode = 'jigsaw';
      ctrl.jigsawEngine = je;
      ctrl.renderJigsawTrayDockDOM();

      const strip = dockEl.querySelector('#paJigsawTrayStrip')!;
      expect(strip).not.toBeNull();
      strip.clientWidth = 320;
      strip.scrollWidth = 1280;
      expect(strip.querySelectorAll('[data-jigsaw-piece]').length).toBe(20);

      // Player scrolls tray strip to 360px
      strip.scrollLeft = 360;
      strip.dispatch('scroll');

      // Taking piece out onto the board + re-rendering must keep same strip node & exact scrollLeft = 360
      const trayPiecesBefore = je.getFilteredTrayPieces();
      const keptBtn = strip.querySelector(`[data-jigsaw-piece="${trayPiecesBefore[7]}"]`)!;
      expect(je.spawnTrayPieceOntoBoard(trayPiecesBefore[5], 0.5, 0.5)).toBe(true);
      ctrl.renderJigsawTrayDockDOM();
      expect(dockEl.querySelector('#paJigsawTrayStrip')).toBe(strip);
      expect(strip.querySelector(`[data-jigsaw-piece="${trayPiecesBefore[7]}"]`)).toBe(keptBtn);
      expect(strip.querySelectorAll('[data-jigsaw-piece]').length).toBe(19);
      expect(strip.scrollLeft).toBe(360);

      // Selecting & spawning a second piece also keeps scrollLeft at 360
      keptBtn.dispatch('pointerdown', { pointerId: 1, button: 0, clientX: 200, clientY: 500, pointerType: 'mouse' });
      keptBtn.dispatch('pointerup', { pointerId: 1, button: 0, clientX: 200, clientY: 500, pointerType: 'mouse' });
      expect(je.selectedTrayPieceIdx).toBe(trayPiecesBefore[7]);
      expect(strip.scrollLeft).toBe(360);

      expect(je.spawnTrayPieceOntoBoard(trayPiecesBefore[7], 0.4, 0.4)).toBe(true);
      ctrl.renderJigsawTrayDockDOM();
      expect(strip.querySelectorAll('[data-jigsaw-piece]').length).toBe(18);
      expect(strip.scrollLeft).toBe(360);

      // Horizontal mouse drag along a piece button scrolls tray and stops at target without creating ghost
      const dragBtn = strip.querySelector(`[data-jigsaw-piece="${trayPiecesBefore[10]}"]`)!;
      dragBtn.dispatch('pointerdown', { pointerId: 2, button: 0, clientX: 250, clientY: 500, pointerType: 'mouse' });
      dragBtn.dispatch('pointermove', { pointerId: 2, button: 0, clientX: 160, clientY: 502, pointerType: 'mouse' });
      expect(bodyEl.querySelector('.pa-jigsaw-drag-ghost')).toBeNull();
      expect(strip.scrollLeft).toBe(450);
      dragBtn.dispatch('pointerup', { pointerId: 2, button: 0, clientX: 160, clientY: 502, pointerType: 'mouse' });
      expect(strip.scrollLeft).toBe(450);

      // Collapsing and re-opening tray preserves scrollLeft = 450
      const toggleBtn = dockEl.querySelector('#btnPaJigsawToggleTray')!;
      toggleBtn.dispatch('click');
      expect(strip.hidden).toBe(true);
      toggleBtn.dispatch('click');
      expect(strip.hidden).toBe(false);
      expect(strip.scrollLeft).toBe(450);

      // Switching filter resets scrollLeft intentionally to 0 for the newly filtered list
      const edgesChip = dockEl.querySelector('[data-jigsaw-filter="edges"]')!;
      edgesChip.dispatch('click');
      expect(je.trayFilter).toBe('edges');
      expect(strip.scrollLeft).toBe(0);

      // Clicking "Trải Bàn" scatters all tray pieces onto the board, collapses the tray, and disables the scatter button
      const jeScatter = new MasterJigsawEngine(16);
      ctrl.jigsawEngine = jeScatter;
      ctrl.renderJigsawTrayDockDOM(false);
      const scatterBtn = dockEl.querySelector('#btnPaJigsawScatterTray')!;
      expect(scatterBtn.disabled).toBe(false);

      scatterBtn.dispatch('click');
      expect(jeScatter.getTrayCountForFilter('all')).toBe(0);
      expect(jeScatter.getBoardClustersSortedByZ(true)).toHaveLength(20);
      expect(dockEl.dataset.trayCollapsed).toBe('true');
      expect(strip.hidden).toBe(true);
      expect(scatterBtn.disabled).toBe(true);

      // Picking a scattered piece directly from the board works without opening the tray
      const pickPos = jeScatter.getBoardPieceNormCenter(0);
      expect(jeScatter.pickBoardPieceAtNorm(pickPos.nx, pickPos.ny)).toBe(0);

      // Opening the tray back & tidying returns all loose singletons to the tray
      toggleBtn.dispatch('click');
      expect(strip.hidden).toBe(false);
      const tidied = jeScatter.tidyLooseSinglePieces();
      expect(tidied).toBe(20);
      ctrl.renderJigsawTrayDockDOM();
      expect(scatterBtn.disabled).toBe(false);
      expect(strip.querySelectorAll('[data-jigsaw-piece]').length).toBe(20);
    } finally {
      vi.unstubAllGlobals();
      vi.stubGlobal('localStorage', mockLocalStorage);
    }
  });

  it('scatterTrayPiecesOntoBoard distributes scrambled pieces on the board away from their target slots and respects loose cap', () => {
    // Stage 16 (4x5 = 20 pieces): scatters 100% of pieces cleanly out of order
    const game20 = new MasterJigsawEngine(16);
    const res20 = game20.scatterTrayPiecesOntoBoard(123456);
    expect(res20.scatteredCount).toBe(20);
    expect(res20.remainingInTray).toBe(0);
    expect(game20.lockedCount).toBe(0);

    const looseClusters = game20.getBoardClustersSortedByZ(true);
    expect(looseClusters).toHaveLength(20);
    for (const cl of looseClusters) {
      expect(cl.members).toHaveLength(1);
    }

    const boardOrderByPos: Array<{ idx: number; nx: number; ny: number }> = [];
    for (let idx = 0; idx < 20; idx++) {
      expect(game20.pieceState[idx]).toBe(JIGSAW_PIECE_BOARD);
      const pos = game20.getBoardPieceNormCenter(idx);
      const target = game20.getTargetNormCenter(idx);
      expect(pos.nx).toBeGreaterThanOrEqual(0.05);
      expect(pos.nx).toBeLessThanOrEqual(0.95);
      expect(pos.ny).toBeGreaterThanOrEqual(0.05);
      expect(pos.ny).toBeLessThanOrEqual(0.95);
      expect(Math.hypot(pos.nx - target.nx, pos.ny - target.ny)).toBeGreaterThanOrEqual(0.15);
      boardOrderByPos.push({ idx, nx: pos.nx, ny: pos.ny });
    }

    // Visual tabletop order must be scrambled (not monotonic 0, 1, 2, ..., 19)
    const sortedByScreenPos = [...boardOrderByPos]
      .sort((a, b) => a.ny - b.ny || a.nx - b.nx)
      .map((item) => item.idx);
    expect(sortedByScreenPos).not.toEqual(Array.from({ length: 20 }, (_, i) => i));

    // Picking every scattered piece from the board and dragging to target locks cleanly
    const samplePos = game20.getBoardPieceNormCenter(7);
    expect(game20.pickBoardPieceAtNorm(samplePos.nx, samplePos.ny)).not.toBeNull();
    const target7 = game20.getTargetNormCenter(7);
    game20.movePieceClusterToNorm(7, target7.nx, target7.ny);
    const dropRes = game20.dropClusterAndResolve(7, 600, 480);
    expect(dropRes.lockedPieces).toContain(7);

    // Stage 100 (10x10 = 100 pieces): fits completely under JIGSAW_MAX_LOOSE_CLUSTERS = 100
    const game100 = new MasterJigsawEngine(100);
    const res100 = game100.scatterTrayPiecesOntoBoard(99991);
    expect(res100.scatteredCount).toBe(100);
    expect(res100.remainingInTray).toBe(0);

    // Stage 200 (270 pieces): respects JIGSAW_MAX_LOOSE_CLUSTERS batch cap
    const game200 = new MasterJigsawEngine(200);
    const res200 = game200.scatterTrayPiecesOntoBoard(424242);
    expect(res200.scatteredCount).toBe(JIGSAW_MAX_LOOSE_CLUSTERS);
    expect(res200.remainingInTray).toBe(game200.totalPieces - JIGSAW_MAX_LOOSE_CLUSTERS);
  });
});
