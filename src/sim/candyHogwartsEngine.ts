// Engine Match-3 Chiến Thuật chuẩn Playrix Gardenscapes × Hogwarts — 7 Năm Học (777 Màn, Khay 7×7..10×10)
// Đầy đủ Bậc Thang Thuốc Nổ Bán Kính (Pháo Hoa, Bom, Thuốc Nổ, Thùng TNT), Chong Chóng Tầm Thủ 2×2,
// Thanh Nạp 🌈 Cầu Vồng Tích Năng (0–100%), Chạm Đúp Nổ Tại Chỗ, Kéo Đổi Ô Bất Kỳ Để Nổ & Đại Combo Kép!

import { SavedMatch3Piece, SavedMatch3Session } from '../types/game';
import {
  CANDY_COMBO_PRAISES,
  CANDY_TILE_TYPES,
  CandyBombConfig,
  CandyBossConfig,
  CandyHogwartsLevel,
  CandyHouseId,
  CandyMazeConfig,
  CandyObjectiveSpec,
  CandyPortalPair,
  CandySpecialType,
  getGardenscapesBlastRadius,
  getSpecialRainbowChargeGain,
  getWandMasteryForLevel,
  isRadialExplosiveSpecial,
  isSuperRainbowActiveForStreak,
  SUPER_RAINBOW_WIN_STREAK,
} from '../data/candyHogwartsLevels';

export {
  getGardenscapesBlastRadius,
  getSpecialRainbowChargeGain,
  isRadialExplosiveSpecial,
  isSuperRainbowActiveForStreak,
  SUPER_RAINBOW_WIN_STREAK,
};
import {
  CandyBoardPiece,
  CandyHogwartsBoardRenderer,
  CandyRenderState,
  CandyVfxBundle,
} from '../engine/candyHogwartsRenderer';

let NEXT_CANDY_PIECE_ID = 1;

export interface CandyInternalPiece extends CandyBoardPiece {
  primedMega: boolean;
}

export interface CandyObjectiveProgress extends CandyObjectiveSpec {
  current: number;
  remaining: number;
  completed: boolean;
}

export interface CandyBossRuntimeState extends CandyBossConfig {
  hp: number;
  maxHp: number;
  defeated: boolean;
  enraged: boolean;
  effectiveCastInterval: number;
  turnsUntilHex: number;
}

export interface CandyHudStateSnapshot {
  level: CandyHogwartsLevel;
  score: number;
  movesLeft: number;
  movesUsed: number;
  starsEarned: number;
  objectives: CandyObjectiveProgress[];
  activeBooster: 'hammer' | 'swap' | null;
  swapFirstCell: { r: number; c: number } | null;
  selectedSpecial: CandySpecialType | null;
  patronusCharge: number;
  rainbowCharge: number;
  superRainbow: boolean;
  house: CandyHouseId;
  bossState: CandyBossRuntimeState | null;
  talismanUsed: boolean;
  status: 'playing' | 'won' | 'out_of_moves';
  failReason: 'moves' | 'bomb' | null;
}

export interface CandyGameEndPayload {
  won: boolean;
  failReason?: 'moves' | 'bomb';
  levelId: number;
  score: number;
  stars: number;
  leftoverMoves: number;
  bonusCoinsFromLeftoverMoves: number;
  frogsCleared: number;
}

export interface CandyAudioAdapter {
  onSelect?: () => void;
  onSwap?: () => void;
  onInvalid?: () => void;
  onMatch?: (comboStep: number) => void;
  onBeam?: () => void;
  onBomb?: () => void;
  onColorBomb?: () => void;
  onSeeker?: () => void;
  onIceBreak?: () => void;
  onKeyUnlock?: () => void;
  onPortal?: () => void;
  onConveyor?: () => void;
  onChocolateSpread?: () => void;
  onMazeShift?: () => void;
  onPatronus?: () => void;
  onSortingHat?: () => void;
  onBossHex?: () => void;
  onBossEnrage?: () => void;
  onHorcruxShatter?: () => void;
  onVictory?: () => void;
  onDefeat?: () => void;
}

export interface CandyEngineCallbacks {
  onStateChange?: (state: CandyHudStateSnapshot) => void;
  onBoosterConsumed?: (boosterKind: 'hammer' | 'swap' | 'shuffle') => boolean;
  onPlayerMoveCommitted?: (
    movesUsed: number,
    comboCount: number,
    isPowerBlast: boolean
  ) => void;
  onBossEnraged?: (boss: CandyBossRuntimeState) => void;
  onPatronusReady?: () => void;
  onSettled?: () => void;
  onGameEnd?: (payload: CandyGameEndPayload) => void;
  onToast?: (msg: string, icon?: string) => void;
  audio?: CandyAudioAdapter;
}

export interface CandyLoadOptions {
  house?: CandyHouseId;
  winStreak?: number;
  superRainbow?: boolean;
  preBoosters?: Array<'pre_color_bomb' | 'pre_striped_wrapped' | 'pre_lucky_seeker'>;
  instantAnimations?: boolean;
}

interface MatchRun {
  dir: 'h' | 'v' | 'sq';
  color: number;
  len: number;
  cells: Array<{ r: number; c: number }>;
}

interface MatchCluster {
  color: number;
  cells: Array<{ r: number; c: number; count: number }>;
  spawnSpecial: CandySpecialType | null;
}

type SwapSpecialCombo =
  | { type: 'double_color_bomb' }
  | {
      type: 'color_bomb_combo';
      bombPos: { r: number; c: number };
      otherPos: { r: number; c: number };
      targetColor: number;
      otherSpecial: CandySpecialType | null;
    }
  | { type: 'double_seeker'; posA: { r: number; c: number }; posB: { r: number; c: number } }
  | {
      type: 'seeker_payload';
      posA: { r: number; c: number };
      posB: { r: number; c: number };
      seekerPos: { r: number; c: number };
      payload: CandySpecialType;
    }
  | {
      type: 'combined_explosive';
      posA: { r: number; c: number };
      posB: { r: number; c: number };
      center: { r: number; c: number };
      gridRadius: number;
      maxHypot: number;
    }
  | {
      type: 'single_special_swap';
      specialPos: { r: number; c: number };
      normalPos: { r: number; c: number };
    }
  | { type: 'cross_striped'; center: { r: number; c: number } }
  | { type: 'giant_striped_wrapped'; center: { r: number; c: number } };

function nextAnimFrame(cb: (ts: number) => void): void {
  if (typeof requestAnimationFrame === 'undefined') {
    setTimeout(() => cb(Date.now()), 0);
    return;
  }
  let done = false;
  const finish = (ts: number) => {
    if (done) return;
    done = true;
    cb(ts);
  };
  const raf = requestAnimationFrame((now) => {
    clearTimeout(timer);
    finish(now);
  });
  const timer = setTimeout(() => {
    cancelAnimationFrame(raf);
    finish(typeof performance !== 'undefined' ? performance.now() : Date.now());
  }, 24);
}

function nowMs(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export class CandyHogwartsEngine {
  public canvas: HTMLCanvasElement | null;
  public renderer: CandyHogwartsBoardRenderer | null;
  private cb: CandyEngineCallbacks;
  public sessionId = 0;
  public instantAnimations = false;

  public level: CandyHogwartsLevel | null = null;
  public size = 8;
  public numColors = 5;
  public house: CandyHouseId = 'gryffindor';
  public masteryBuffs = { scoreBonusPct: 0, patronusBonusPct: 0, bossDamageBonusPct: 0 };

  public mask: number[][] = [];
  public jelly: number[][] = [];
  public ice: number[][] = [];
  public frosting: number[][] = [];
  public chocolate: number[][] = [];
  public cauldron: number[][] = [];
  private cauldronCharge: number[][] = [];
  private cauldronStunnedThisTurn = new Set<string>();
  public lockGrid: number[][] = [];
  public petrify: number[][] = [];
  public dementor: number[][] = [];
  private dementorCharge: number[][] = [];
  private dementorStunnedThisTurn = new Set<string>();
  public decree: number[][] = [];
  public fiendfyre: number[][] = [];
  private fiendfyreDamagedThisTurn = false;
  public horcrux: number[][] = [];
  public mazeConfig: CandyMazeConfig | null = null;
  public conveyorLoops: Array<Array<{ r: number; c: number }>> = [];
  public portals: CandyPortalPair[] = [];
  public ingredientSpawnCols: number[] = [];
  public ingredientExitCells: Array<{ r: number; c: number }> = [];
  public ingredientTarget = 0;
  public ingredientsCollected = 0;
  public ingredientsSpawned = 0;
  public bombConfig: CandyBombConfig | null = null;
  private pendingBombSpawns = 0;

  public bossConfig: CandyBossConfig | null = null;
  public bossMaxHp = 0;
  public bossHp = 0;
  public bossDefeated = false;
  public bossEnraged = false;
  private pendingBossEnrageBurst = false;
  public bossEffectiveCastInterval = 4;
  public patronusCharge = 0;
  public rainbowCharge = 0;
  public pendingRainbowSpawns = 0;
  public superRainbow = false;

  public grid: Array<Array<CandyInternalPiece | null>> = [];

  public score = 0;
  public movesLeft = 0;
  public movesUsed = 0;
  public leftoverMovesAtWin = 0;
  public bonusCoinsFromLeftoverMoves = 0;
  public talismanUsed = false;
  public status: 'playing' | 'won' | 'out_of_moves' = 'playing';
  public failReason: 'moves' | 'bomb' | null = null;

  public collected: Record<number, number> = {};
  public specialStats: Record<'striped' | 'wrapped' | 'seeker' | 'color_bomb', number> = {
    striped: 0,
    wrapped: 0,
    seeker: 0,
    color_bomb: 0,
  };
  private initialJelly = 0;
  private initialIce = 0;
  private initialFrosting = 0;
  private initialCauldronPots = 0;
  private initialLocks = 0;
  private initialPetrify = 0;
  private initialDementors = 0;
  private initialDecrees = 0;
  private initialHorcruxes = 0;
  private chocolateBrokenThisTurn = false;
  private lastSwapDir: 'h' | 'v' = 'h';
  private maxCascadeThisTurn = 1;
  private specialUsedThisTurn = false;

  public selected: { r: number; c: number } | null = null;
  public kbCursor: { r: number; c: number } | null = null;
  public activeBooster: 'hammer' | 'swap' | null = null;
  public busy = false;
  public ended = false;

  private lastActionAt = nowMs();
  public hintPair: [{ r: number; c: number }, { r: number; c: number }] | null = null;

  public vfx: CandyVfxBundle = {
    beams: [],
    seekers: [],
    arcs: [],
    rings: [],
    particles: [],
    popups: [],
    shake: 0,
  };

  private pointerState: {
    pointerId: number;
    startX: number;
    startY: number;
    cell: { r: number; c: number };
    swiped: boolean;
    pointerType: string;
  } | null = null;
  private rafId: number | null = null;
  private loopActive = false;
  private lastFrameTime = nowMs();

  private onPointerDownBound?: (e: PointerEvent) => void;
  private onPointerMoveBound?: (e: PointerEvent) => void;
  private onPointerUpBound?: (e: PointerEvent) => void;
  private onKeyDownBound?: (e: KeyboardEvent) => void;
  private onVisibilityChangeBound?: () => void;

  constructor(canvas: HTMLCanvasElement | null, callbacks: CandyEngineCallbacks = {}) {
    this.canvas = canvas;
    this.cb = callbacks;
    this.renderer = canvas
      ? new CandyHogwartsBoardRenderer(canvas, () => {
          if (this.level && this.rafId !== null && this.renderer) {
            this.renderer.resize(this.size);
            this.renderer.render(this.getRenderState(), nowMs());
          }
        })
      : null;

    if (this.canvas) {
      this.bindInput();
    }
  }

  private waitMs(ms: number): Promise<void> {
    if (this.instantAnimations || ms <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public attachCanvas(canvas: HTMLCanvasElement): void {
    if (this.canvas === canvas && this.renderer) {
      this.renderer.resize(this.size);
      this.renderer.render(this.getRenderState(), nowMs());
      return;
    }
    this.unbindInput();
    this.renderer?.destroy();
    this.canvas = canvas;
    this.renderer = new CandyHogwartsBoardRenderer(canvas, () => {
      if (this.level && this.renderer) {
        this.renderer.resize(this.size);
        this.renderer.render(this.getRenderState(), nowMs());
      }
    });
    this.bindInput();
    if (this.level) {
      this.renderer.invalidateBg();
      this.renderer.resize(this.size);
      this.renderer.render(this.getRenderState(), nowMs());
      if (!this.ended) {
        this.startLoop();
      }
    }
  }

  public syncViewTransform(viewZoom: number, netQuarterTurns: 0 | 1 | 2 | 3): void {
    if (!this.renderer) return;
    this.renderer.viewZoom = viewZoom;
    this.renderer.netQuarterTurns = netQuarterTurns;
    if (this.level) {
      this.renderer.resize(this.size);
      this.renderer.render(this.getRenderState(), nowMs());
    }
  }

  public destroy(): void {
    this.stopLoop();
    this.unbindInput();
    this.renderer?.destroy();
    this.renderer = null;
    this.canvas = null;
  }

  private unbindInput(): void {
    if (this.canvas) {
      if (this.onPointerDownBound) {
        this.canvas.removeEventListener('pointerdown', this.onPointerDownBound);
      }
      if (this.onPointerMoveBound) {
        this.canvas.removeEventListener('pointermove', this.onPointerMoveBound);
      }
      if (this.onPointerUpBound) {
        this.canvas.removeEventListener('pointerup', this.onPointerUpBound);
        this.canvas.removeEventListener('pointercancel', this.onPointerUpBound);
        this.canvas.removeEventListener('lostpointercapture', this.onPointerUpBound);
      }
      if (this.onKeyDownBound) {
        this.canvas.removeEventListener('keydown', this.onKeyDownBound);
      }
    }
    if (typeof document !== 'undefined' && this.onVisibilityChangeBound) {
      document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
    }
    this.onPointerDownBound = undefined;
    this.onPointerMoveBound = undefined;
    this.onPointerUpBound = undefined;
    this.onKeyDownBound = undefined;
    this.onVisibilityChangeBound = undefined;
  }

  public setHouse(newHouse: CandyHouseId): void {
    if (this.house === newHouse) return;
    this.house = newHouse;
    if (newHouse === 'hufflepuff' && this.movesUsed === 0 && this.patronusCharge < 25) {
      this.patronusCharge = 25;
    }
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    this.cb.onSettled?.();
  }

  public hasStaticBlocker(r: number, c: number): boolean {
    return (
      (this.frosting[r]?.[c] || 0) > 0 ||
      (this.chocolate[r]?.[c] || 0) > 0 ||
      (this.cauldron[r]?.[c] || 0) > 0 ||
      (this.dementor[r]?.[c] || 0) > 0 ||
      (this.decree[r]?.[c] || 0) > 0 ||
      (this.fiendfyre[r]?.[c] || 0) > 0 ||
      (this.horcrux[r]?.[c] || 0) > 0
    );
  }

  public isCellLocked(r: number, c: number): boolean {
    return (
      (this.ice[r]?.[c] || 0) > 0 ||
      (this.lockGrid[r]?.[c] || 0) > 0 ||
      (this.petrify[r]?.[c] || 0) > 0
    );
  }

  public isMatchablePiece(p: CandyInternalPiece | null | undefined): p is CandyInternalPiece {
    return Boolean(p && !p.isIngredient && !p.blocker && !p.special && p.color >= 0);
  }

  public isCellMatchable(r: number, c: number): boolean {
    return (
      this.mask[r]?.[c] === 1 &&
      (this.lockGrid[r]?.[c] || 0) === 0 &&
      (this.petrify[r]?.[c] || 0) === 0 &&
      this.isMatchablePiece(this.grid[r]?.[c])
    );
  }

  public activateCellInteraction(cell: { r: number; c: number } | null): void {
    if (this.busy || this.ended || !this.level || !cell || this.mask[cell.r]?.[cell.c] === 0) {
      return;
    }
    this.resetIdleHint();

    if (this.activeBooster === 'hammer') {
      this.pointerState = null;
      void this.executeHammer(cell.r, cell.c);
      return;
    }

    if ((this.horcrux[cell.r]?.[cell.c] || 0) >= 4) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(cell.r, cell.c, 'Khiên Hồn! Dùng Kẹo Phép hoặc Búa Kẹo!', '#e879f9', 13);
      this.pointerState = null;
      return;
    }

    if (this.hasStaticBlocker(cell.r, cell.c)) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(cell.r, cell.c, 'Ghép kẹo cạnh bên để phá!', '#fde047', 13);
      this.pointerState = null;
      return;
    }

    if ((this.lockGrid[cell.r]?.[cell.c] || 0) > 0) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(cell.r, cell.c, 'Cần ghép Chìa Khoá Vàng!', '#fde047', 13);
      this.pointerState = null;
      return;
    }

    if ((this.petrify[cell.r]?.[cell.c] || 0) > 0) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(cell.r, cell.c, 'Hoá Đá Tử Xà! Ghép cạnh bên!', '#6ee7b7', 13);
      this.pointerState = null;
      return;
    }

    if ((this.ice[cell.r]?.[cell.c] || 0) > 0) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(cell.r, cell.c, 'Đang đóng băng!', '#7dd3fc', 14);
      this.pointerState = null;
      return;
    }

    if (!this.grid[cell.r]?.[cell.c]) {
      this.pointerState = null;
      return;
    }

    if (!this.selected) {
      this.selected = { r: cell.r, c: cell.c };
      this.cb.audio?.onSelect?.();
      this.emitHudState();
    } else if (this.selected.r === cell.r && this.selected.c === cell.c) {
      const piece = this.grid[cell.r]?.[cell.c];
      if (piece?.special && !this.activeBooster) {
        this.selected = null;
        this.pointerState = null;
        void this.tryActivateSpecialInPlace({ r: cell.r, c: cell.c });
      } else {
        this.selected = null;
        this.emitHudState();
      }
    } else if (Math.abs(this.selected.r - cell.r) + Math.abs(this.selected.c - cell.c) === 1) {
      const first = this.selected;
      this.selected = null;
      this.pointerState = null;
      void this.trySwap(first, { r: cell.r, c: cell.c });
    } else {
      this.selected = { r: cell.r, c: cell.c };
      this.cb.audio?.onSelect?.();
      this.emitHudState();
    }
  }

  private findInitialKeyboardCell(): { r: number; c: number } {
    const mid = Math.floor(this.size / 2);
    if (this.mask[mid]?.[mid] === 1) return { r: mid, c: mid };
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.mask[r]?.[c] === 1) return { r, c };
      }
    }
    return { r: 0, c: 0 };
  }

  public hasPlayableCellAtScreen(clientX: number, clientY: number): boolean {
    if (!this.renderer || !this.level) return false;
    const cell = this.renderer.screenToCell(clientX, clientY, this.size);
    if (!cell) return false;
    return this.mask[cell.r]?.[cell.c] === 1;
  }

  private bindInput(): void {
    if (!this.canvas) return;

    this.onPointerDownBound = (e: PointerEvent) => {
      if (e.button !== 0 || this.busy || this.ended || !this.level || !this.renderer || !this.canvas) {
        return;
      }
      if (e.pointerType === 'touch') {
        e.preventDefault?.();
      }
      this.canvas.focus({ preventScroll: true });
      const cell = this.renderer.screenToCell(e.clientX, e.clientY, this.size);
      if (!cell || this.mask[cell.r]?.[cell.c] === 0) return;
      const startPt = this.renderer.screenToBoardPoint(e.clientX, e.clientY) ?? {
        x: e.clientX,
        y: e.clientY,
      };

      this.kbCursor = null;
      try {
        this.canvas.setPointerCapture?.(e.pointerId);
      } catch {
        // synthetic pointer events may not have an active hardware pointerId
      }
      this.pointerState = {
        pointerId: e.pointerId,
        startX: startPt.x,
        startY: startPt.y,
        cell,
        swiped: false,
        pointerType: e.pointerType || 'mouse',
      };
      // Trên màn hình cảm ứng (hoặc khi nhấp chuột lần 2 vào Pháo/Bom đang chọn để nổ tại chỗ hay kéo đi),
      // đợi tới pointerup nếu không vuốt để không kích nổ nhầm khi người chơi định kéo đổi chỗ!
      const isSecondTapOnArmedSpecial = Boolean(
        this.selected &&
          this.selected.r === cell.r &&
          this.selected.c === cell.c &&
          this.grid[cell.r]?.[cell.c]?.special &&
          !this.activeBooster
      );
      if (e.pointerType !== 'touch' && !isSecondTapOnArmedSpecial) {
        this.activateCellInteraction(cell);
      }
    };

    this.onPointerMoveBound = (e: PointerEvent) => {
      if (
        !this.pointerState ||
        e.pointerId !== this.pointerState.pointerId ||
        this.pointerState.swiped ||
        !this.renderer
      ) {
        return;
      }
      if (this.busy || this.ended) return;

      const curPt = this.renderer.screenToBoardPoint(e.clientX, e.clientY) ?? {
        x: e.clientX,
        y: e.clientY,
      };
      const dx = curPt.x - this.pointerState.startX;
      const dy = curPt.y - this.pointerState.startY;
      const threshold =
        e.pointerType === 'touch'
          ? Math.max(14, this.renderer.cellSize * 0.25)
          : Math.max(14, this.renderer.cellSize * 0.28);

      if (Math.hypot(dx, dy) >= threshold) {
        this.pointerState.swiped = true;
        const from = this.pointerState.cell;
        let dr = 0;
        let dc = 0;
        if (Math.abs(dx) > Math.abs(dy)) dc = dx > 0 ? 1 : -1;
        else dr = dy > 0 ? 1 : -1;

        const to = { r: from.r + dr, c: from.c + dc };
        this.selected = null;
        if (this.isValidCell(to.r, to.c) && this.mask[to.r]?.[to.c] === 1) {
          void this.trySwap(from, to);
        }
      }
    };

    this.onPointerUpBound = (e: PointerEvent) => {
      if (this.pointerState && e.pointerId === this.pointerState.pointerId) {
        const prev = this.pointerState;
        this.pointerState = null;
        if (e.type === 'pointercancel' || e.type === 'lostpointercapture') {
          return;
        }
        const deferredMouseSpecialTap = Boolean(
          prev.pointerType !== 'touch' &&
            this.selected &&
            this.selected.r === prev.cell.r &&
            this.selected.c === prev.cell.c &&
            this.grid[prev.cell.r]?.[prev.cell.c]?.special &&
            !this.activeBooster
        );
        if (
          e.type === 'pointerup' &&
          (prev.pointerType === 'touch' || deferredMouseSpecialTap) &&
          !prev.swiped &&
          !this.busy &&
          !this.ended &&
          this.level
        ) {
          this.activateCellInteraction(prev.cell);
        }
      }
    };

    this.onKeyDownBound = (e: KeyboardEvent) => {
      if (this.busy || this.ended || !this.level) return;
      const key = e.key;
      const arrowMap: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };

      if (key === 'p' || key === 'P') {
        if (this.patronusCharge >= 100) {
          e.preventDefault();
          void this.castPatronus();
        }
        return;
      }

      if (arrowMap[key]) {
        e.preventDefault();
        this.resetIdleHint();
        if (!this.kbCursor) {
          this.kbCursor = this.selected ? { ...this.selected } : this.findInitialKeyboardCell();
        }
        const [dr, dc] = arrowMap[key];
        if (e.shiftKey && this.selected) {
          const to = { r: this.selected.r + dr, c: this.selected.c + dc };
          if (this.isValidCell(to.r, to.c) && this.mask[to.r]?.[to.c] === 1) {
            const from = this.selected;
            this.selected = null;
            this.kbCursor = to;
            void this.trySwap(from, to);
          }
          return;
        }
        for (let step = 1; step < this.size; step++) {
          const nr = this.kbCursor.r + dr * step;
          const nc = this.kbCursor.c + dc * step;
          if (!this.isValidCell(nr, nc)) break;
          if (this.mask[nr]?.[nc] === 1) {
            this.kbCursor = { r: nr, c: nc };
            break;
          }
        }
        return;
      }

      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        if (!this.kbCursor) {
          this.kbCursor = this.findInitialKeyboardCell();
        }
        this.activateCellInteraction(this.kbCursor);
        return;
      }

      if (key === 'Escape') {
        if (this.selected || this.activeBooster) {
          e.preventDefault();
          e.stopPropagation();
          this.selected = null;
          this.activeBooster = null;
          this.emitHudState();
        }
      }
    };

    this.canvas.addEventListener('pointerdown', this.onPointerDownBound);
    this.canvas.addEventListener('pointermove', this.onPointerMoveBound);
    this.canvas.addEventListener('pointerup', this.onPointerUpBound);
    this.canvas.addEventListener('pointercancel', this.onPointerUpBound);
    this.canvas.addEventListener('lostpointercapture', this.onPointerUpBound);
    this.canvas.addEventListener('keydown', this.onKeyDownBound);

    if (typeof document !== 'undefined') {
      this.onVisibilityChangeBound = () => {
        if (document.hidden) {
          if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
          }
        } else if (this.loopActive && this.level && !this.ended && this.rafId === null) {
          this.startLoop();
        }
      };
      document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
    }
  }

  public startLoop(): void {
    if (!this.renderer || typeof requestAnimationFrame === 'undefined') return;
    this.loopActive = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.lastFrameTime = nowMs();
    const tick = (now: number) => {
      if (!this.loopActive) {
        this.rafId = null;
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTime) / 1000));
      this.lastFrameTime = now;
      this.update(dt, now);
      if (this.level && this.renderer) {
        this.renderer.render(this.getRenderState(), now);
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  public stopLoop(): void {
    this.sessionId++;
    this.busy = false;
    this.loopActive = false;
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public getRenderState(): CandyRenderState {
    return {
      size: this.size,
      mask: this.mask,
      jelly: this.jelly,
      ice: this.ice,
      frosting: this.frosting,
      chocolate: this.chocolate,
      cauldron: this.cauldron,
      lockGrid: this.lockGrid,
      petrify: this.petrify,
      dementor: this.dementor,
      decree: this.decree,
      fiendfyre: this.fiendfyre,
      horcrux: this.horcrux,
      mazeConfig: this.mazeConfig,
      conveyorLoops: this.conveyorLoops,
      portals: this.portals,
      ingredientExitCells: this.ingredientExitCells,
      grid: this.grid,
      selected: this.selected,
      kbCursor: this.kbCursor,
      hintPair: this.hintPair,
      activeBooster: this.activeBooster,
      superRainbow: this.superRainbow,
      vfx: this.vfx,
    };
  }

  private cloneGridOrZero(src: number[][] | undefined, size: number): number[][] {
    if (!src || src.length === 0) {
      return Array.from({ length: size }, () => Array(size).fill(0));
    }
    return src.map((row) => [...row]);
  }

  public loadLevel(levelData: CandyHogwartsLevel, options: CandyLoadOptions = {}): void {
    this.sessionId++;
    this.level = levelData;
    this.size = levelData.size;
    this.renderer?.invalidateBg();
    this.renderer?.resize(this.size);
    this.numColors = levelData.numColors;
    this.house = options.house || 'gryffindor';
    this.instantAnimations = Boolean(options.instantAnimations);

    const mastery = getWandMasteryForLevel(levelData.id);
    this.masteryBuffs = {
      scoreBonusPct: mastery.scoreBonusPct,
      patronusBonusPct: mastery.patronusBonusPct,
      bossDamageBonusPct: mastery.bossDmgPct,
    };

    this.mask = levelData.mask.map((row) => [...row]);
    this.jelly = this.cloneGridOrZero(levelData.jellyGrid, this.size);
    this.ice = this.cloneGridOrZero(levelData.iceGrid, this.size);
    this.frosting = this.cloneGridOrZero(levelData.frostingGrid, this.size);
    this.chocolate = this.cloneGridOrZero(levelData.chocolateGrid, this.size);
    this.cauldron = this.cloneGridOrZero(levelData.cauldronGrid, this.size);
    this.cauldronCharge = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.cauldronStunnedThisTurn = new Set();
    this.lockGrid = this.cloneGridOrZero(levelData.lockGrid, this.size);
    this.petrify = this.cloneGridOrZero(levelData.petrifyGrid, this.size);
    this.dementor = this.cloneGridOrZero(levelData.dementorGrid, this.size);
    this.dementorCharge = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.dementorStunnedThisTurn = new Set();
    this.decree = this.cloneGridOrZero(levelData.decreeGrid, this.size);
    this.fiendfyre = this.cloneGridOrZero(levelData.fiendfyreGrid, this.size);
    this.fiendfyreDamagedThisTurn = false;
    this.horcrux = this.cloneGridOrZero(levelData.horcruxGrid, this.size);
    this.mazeConfig = levelData.mazeConfig
      ? {
          intervalMoves: levelData.mazeConfig.intervalMoves || 3,
          rows: [...(levelData.mazeConfig.rows || [])],
        }
      : null;
    const swirlGrid = this.cloneGridOrZero(levelData.swirlGrid, this.size);

    this.conveyorLoops = (levelData.conveyorLoops || []).map((loop) =>
      loop.map((pt) => ({ ...pt }))
    );
    this.portals = (levelData.portals || []).map((p) => ({
      from: { ...p.from },
      to: { ...p.to },
      color: p.color || '#10b981',
    }));
    this.ingredientTarget = levelData.ingredientTarget || 0;
    this.ingredientSpawnCols = [...(levelData.ingredientSpawnCols || [])];
    this.ingredientExitCells = (levelData.ingredientExitCells || []).map((e) => ({ ...e }));
    this.ingredientsCollected = 0;
    this.ingredientsSpawned = 0;
    this.bombConfig = levelData.bombConfig ? { ...levelData.bombConfig } : null;
    this.pendingBombSpawns = 0;

    this.bossConfig = levelData.bossConfig ? { ...levelData.bossConfig } : null;
    this.bossMaxHp = this.bossConfig ? this.bossConfig.maxHp : 0;
    this.bossHp = this.bossMaxHp;
    this.bossDefeated = false;
    this.bossEnraged = false;
    this.pendingBossEnrageBurst = false;
    this.bossEffectiveCastInterval = this.bossConfig ? this.bossConfig.castInterval || 4 : 4;
    this.patronusCharge = this.house === 'hufflepuff' ? 25 : 0;
    this.rainbowCharge = 0;
    this.pendingRainbowSpawns = 0;
    this.superRainbow =
      options.superRainbow !== undefined
        ? Boolean(options.superRainbow)
        : isSuperRainbowActiveForStreak(options.winStreak || 0);

    this.initialJelly = this.countGridSum(this.jelly);
    this.initialIce = this.countGridSum(this.ice);
    this.initialFrosting = this.countGridSum(this.frosting);
    this.initialCauldronPots = this.countPositiveCells(this.cauldron);
    this.initialLocks = this.countGridSum(this.lockGrid);
    this.initialPetrify = this.countGridSum(this.petrify);
    this.initialDementors = this.countPositiveCells(this.dementor);
    this.initialDecrees = this.countPositiveCells(this.decree);
    this.initialHorcruxes = this.countPositiveCells(this.horcrux);

    this.score = 0;
    this.movesLeft = levelData.moves;
    this.movesUsed = 0;
    this.leftoverMovesAtWin = 0;
    this.bonusCoinsFromLeftoverMoves = 0;
    this.talismanUsed = false;
    this.status = 'playing';
    this.failReason = null;
    this.chocolateBrokenThisTurn = false;
    this.lastSwapDir = 'h';
    this.collected = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.specialStats = { striped: 0, wrapped: 0, seeker: 0, color_bomb: 0 };
    this.selected = null;
    this.kbCursor = null;
    this.activeBooster = null;
    this.busy = false;
    this.ended = false;
    this.vfx = {
      beams: [],
      seekers: [],
      arcs: [],
      rings: [],
      particles: [],
      popups: [],
      shake: 0,
    };

    this.populateInitialBoard(swirlGrid, options);
    this.resetIdleHint();
    this.emitHudState();
    if (this.renderer) {
      this.startLoop();
      this.renderer.render(this.getRenderState(), nowMs());
    }
  }

  private isExitCell(r: number, c: number): boolean {
    return this.ingredientExitCells.some((ex) => ex.r === r && ex.c === c);
  }

  private isPortalCell(r: number, c: number): boolean {
    return this.portals.some(
      (p) => (p.from.r === r && p.from.c === c) || (p.to.r === r && p.to.c === c)
    );
  }

  private isConveyorCell(r: number, c: number): boolean {
    return this.conveyorLoops.some((loop) => loop.some((pt) => pt.r === r && pt.c === c));
  }

  public countPositiveCells(g: number[][]): number {
    let n = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((g[r]?.[c] || 0) > 0) n++;
      }
    }
    return n;
  }

  public countGridSum(g: number[][]): number {
    let total = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        total += g[r]?.[c] || 0;
      }
    }
    return total;
  }

  private countKeysOnBoard(): number {
    let n = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r]?.[c]?.hasKey) n++;
      }
    }
    return n;
  }

  private ensureSugarKeysOnBoard(desiredMin = 1): void {
    const remLocks = this.countGridSum(this.lockGrid);
    if (remLocks <= 0) return;
    const currentKeys = this.countKeysOnBoard();
    const needed = Math.max(0, Math.min(desiredMin, Math.ceil(remLocks / 2)) - currentKeys);
    if (needed <= 0) return;

    const candidates: CandyInternalPiece[] = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          this.mask[r]?.[c] === 1 &&
          !this.hasStaticBlocker(r, c) &&
          !this.isCellLocked(r, c) &&
          p &&
          this.isMatchablePiece(p) &&
          !p.hasKey &&
          p.bombTimer === null
        ) {
          candidates.push(p);
        }
      }
    }
    candidates.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(needed, candidates.length); i++) {
      candidates[i].hasKey = true;
    }
  }

  private populateInitialBoard(swirlGrid: number[][], options: CandyLoadOptions = {}): void {
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.mask[r]?.[c] === 0) continue;
        if (this.hasStaticBlocker(r, c)) {
          this.ice[r][c] = 0;
          this.lockGrid[r][c] = 0;
          this.petrify[r][c] = 0;
          this.grid[r][c] = null;
          continue;
        }
        if ((swirlGrid[r]?.[c] || 0) > 0) {
          this.ice[r][c] = 0;
          this.lockGrid[r][c] = 0;
          this.petrify[r][c] = 0;
          this.grid[r][c] = this.createSwirlPiece(c, r);
          continue;
        }

        const forbidden = new Set<number>();
        const left1 = this.grid[r]?.[c - 1];
        const left2 = this.grid[r]?.[c - 2];
        if (
          c >= 2 &&
          this.isMatchablePiece(left1) &&
          this.isMatchablePiece(left2) &&
          left1.color === left2.color
        ) {
          forbidden.add(left1.color);
        }
        const up1 = this.grid[r - 1]?.[c];
        const up2 = this.grid[r - 2]?.[c];
        if (
          r >= 2 &&
          this.isMatchablePiece(up1) &&
          this.isMatchablePiece(up2) &&
          up1.color === up2.color
        ) {
          forbidden.add(up1.color);
        }
        const diag = this.grid[r - 1]?.[c - 1];
        if (
          r >= 1 &&
          c >= 1 &&
          this.isMatchablePiece(left1) &&
          this.isMatchablePiece(up1) &&
          this.isMatchablePiece(diag) &&
          left1.color === up1.color &&
          left1.color === diag.color
        ) {
          forbidden.add(left1.color);
        }

        const choices: number[] = [];
        for (let col = 0; col < this.numColors; col++) {
          if (!forbidden.has(col)) choices.push(col);
        }
        const color = choices[Math.floor(Math.random() * choices.length)] ?? 0;
        this.grid[r][c] = this.createPiece(color, c, r);
      }
    }

    if (this.ingredientTarget > 0) {
      const cols =
        this.ingredientSpawnCols.length > 0
          ? this.ingredientSpawnCols
          : [Math.floor(this.size / 2)];
      for (const col of cols) {
        let placed = false;
        for (let r = 0; r < Math.min(2, this.size - 1); r++) {
          const cur = this.grid[r]?.[col];
          if (
            this.mask[r]?.[col] === 1 &&
            !this.hasStaticBlocker(r, col) &&
            !this.isCellLocked(r, col) &&
            !this.isExitCell(r, col) &&
            cur &&
            !cur.blocker
          ) {
            this.grid[r][col] = this.createIngredientPiece(col, r);
            this.ingredientsSpawned = 1;
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }

    if (this.bombConfig && this.bombConfig.initialCount > 0) {
      const candidates: CandyInternalPiece[] = [];
      for (let r = 1; r < this.size - 1; r++) {
        for (let c = 0; c < this.size; c++) {
          const p = this.grid[r]?.[c];
          if (p && this.isMatchablePiece(p) && !this.isCellLocked(r, c) && !p.special) {
            candidates.push(p);
          }
        }
      }
      candidates.sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(this.bombConfig.initialCount, candidates.length); i++) {
        candidates[i].bombTimer = this.bombConfig.startTimer;
      }
    }

    if (this.initialLocks > 0) {
      this.ensureSugarKeysOnBoard(2);
    }

    let guard = 0;
    while (!this.findAnyValidMove(false) && guard < 28) {
      this.shuffleInternal(true);
      guard++;
    }
    if (!this.findAnyValidMove(false)) {
      this.grantEmergencyMovePiece();
    }

    this.applyStartBonuses(options.preBoosters || [], options.winStreak || 0);
  }

  private applyStartBonuses(
    preBoosters: Array<'pre_color_bomb' | 'pre_striped_wrapped' | 'pre_lucky_seeker'>,
    winStreak: number
  ): void {
    if (preBoosters.length === 0 && winStreak <= 0) return;

    const plainCells: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          this.mask[r]?.[c] === 1 &&
          !this.hasStaticBlocker(r, c) &&
          !this.isCellLocked(r, c) &&
          p &&
          this.isMatchablePiece(p) &&
          !p.special &&
          p.bombTimer === null
        ) {
          plainCells.push({ r, c });
        }
      }
    }
    plainCells.sort(() => Math.random() - 0.5);

    const grant = (specialType: CandySpecialType) => {
      const cell = plainCells.pop();
      if (!cell) return;
      const p = this.grid[cell.r]?.[cell.c];
      if (!p) return;
      p.special = specialType;
      p.scale = 1.25;
      this.spawnRing(cell.r, cell.c, 1.25, '#fde047');
    };

    for (const preId of preBoosters) {
      if (preId === 'pre_color_bomb') {
        grant('color_bomb');
      } else if (preId === 'pre_striped_wrapped') {
        grant('firecracker');
        grant('bomb');
      } else if (preId === 'pre_lucky_seeker') {
        grant('seeker');
        grant('seeker');
      }
    }

    if (winStreak >= 1) grant('firecracker');
    if (winStreak >= 2) grant('bomb');
    if (winStreak >= 3) grant('color_bomb');

    if (this.superRainbow) {
      this.spawnCenterBanner(
        winStreak > 0 ? `SIÊU CẦU VỒNG ×${winStreak}!` : 'SIÊU CẦU VỒNG KÍCH HOẠT!'
      );
    } else if (winStreak > 0) {
      this.spawnCenterBanner(`CHUỖI CỐC LỬA ×${winStreak}!`);
    }
  }

  public createPiece(
    color: number,
    x: number,
    y: number,
    special: CandySpecialType | null = null
  ): CandyInternalPiece {
    return {
      id: NEXT_CANDY_PIECE_ID++,
      color,
      special,
      primedWrapped: false,
      primedMega: false,
      isIngredient: false,
      blocker: null,
      bombTimer: null,
      hasKey: false,
      x,
      y,
      scale: 1,
      alpha: 1,
    };
  }

  public createIngredientPiece(x: number, y: number): CandyInternalPiece {
    return {
      id: NEXT_CANDY_PIECE_ID++,
      color: -1,
      special: null,
      primedWrapped: false,
      primedMega: false,
      isIngredient: true,
      blocker: null,
      bombTimer: null,
      hasKey: false,
      x,
      y,
      scale: 1,
      alpha: 1,
    };
  }

  public createSwirlPiece(x: number, y: number): CandyInternalPiece {
    return {
      id: NEXT_CANDY_PIECE_ID++,
      color: -1,
      special: null,
      primedWrapped: false,
      primedMega: false,
      isIngredient: false,
      blocker: 'swirl',
      bombTimer: null,
      hasKey: false,
      x,
      y,
      scale: 1,
      alpha: 1,
    };
  }

  public addRainbowCharge(rawAmount: number): void {
    if (rawAmount <= 0 || this.ended) return;
    this.rainbowCharge = Math.max(0, this.rainbowCharge + rawAmount);
    while (this.rainbowCharge >= 100) {
      this.rainbowCharge -= 100;
      if (this.pendingRainbowSpawns < 4) {
        this.pendingRainbowSpawns++;
      }
    }
    this.rainbowCharge = Math.round(this.rainbowCharge * 10) / 10;
  }

  public pickTopDistinctColorsOnBoard(count = 1, preferredFirstColor = -1): number[] {
    const desired = Math.max(1, Math.floor(count));
    const counts = new Map<number, number>();
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.mask[r]?.[c] === 0 || this.isCellLocked(r, c) || this.hasStaticBlocker(r, c)) {
          continue;
        }
        const p = this.grid[r]?.[c];
        if (p && this.isMatchablePiece(p)) {
          counts.set(p.color, (counts.get(p.color) || 0) + 1);
        }
      }
    }

    const maxColorIdx = Math.max(
      this.numColors,
      ...Array.from(counts.keys(), (k) => k + 1)
    );
    const picked: number[] = [];
    if (
      preferredFirstColor >= 0 &&
      preferredFirstColor < maxColorIdx &&
      (counts.get(preferredFirstColor) || 0) > 0
    ) {
      picked.push(preferredFirstColor);
    }

    const rankedColors: Array<{ color: number; cnt: number }> = [];
    for (let k = 0; k < maxColorIdx; k++) {
      if (picked.includes(k)) continue;
      rankedColors.push({ color: k, cnt: counts.get(k) || 0 });
    }
    rankedColors.sort((a, b) => b.cnt - a.cnt || a.color - b.color);

    for (const entry of rankedColors) {
      if (picked.length >= desired) break;
      if (entry.cnt > 0 || picked.length === 0) {
        picked.push(entry.color);
      }
    }

    if (picked.length === 0) {
      picked.push(preferredFirstColor >= 0 ? preferredFirstColor : 0);
    }
    return picked;
  }

  public pickRainbowTargetColors(preferredFirstColor = -1): number[] {
    return this.pickTopDistinctColorsOnBoard(this.superRainbow ? 2 : 1, preferredFirstColor);
  }

  public pickMostAbundantColorOnBoard(preferredColor = -1): number {
    return this.pickTopDistinctColorsOnBoard(1, preferredColor)[0] ?? 0;
  }

  private async materializePendingRainbowBlasts(session = this.sessionId): Promise<boolean> {
    if (this.pendingRainbowSpawns <= 0 || this.ended || this.status === 'won') return false;
    const plainCells: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          this.mask[r]?.[c] === 1 &&
          !this.hasStaticBlocker(r, c) &&
          !this.isCellLocked(r, c) &&
          p &&
          this.isMatchablePiece(p) &&
          !p.special &&
          p.bombTimer === null
        ) {
          plainCells.push({ r, c });
        }
      }
    }
    if (plainCells.length === 0) return false;
    plainCells.sort(() => Math.random() - 0.5);

    let spawnedAny = false;
    while (this.pendingRainbowSpawns > 0 && plainCells.length > 0) {
      const cell = plainCells.pop()!;
      const p = this.grid[cell.r]?.[cell.c];
      if (!p) continue;
      this.pendingRainbowSpawns--;
      p.special = 'color_bomb';
      p.scale = 1.36;
      spawnedAny = true;
      this.cb.audio?.onColorBomb?.();
      this.spawnArc(0, 0, cell.r, cell.c, '#fde047');
      this.spawnRing(cell.r, cell.c, 1.65, '#fde047');
      this.spawnBurst(cell.r, cell.c, '#fef08a', 14);
      this.spawnPopup(
        cell.r,
        cell.c,
        this.superRainbow ? 'SIÊU CẦU VỒNG!' : 'LUMOS MAXIMA!',
        '#fef08a',
        16
      );
    }

    if (spawnedAny) {
      this.emitHudState();
      this.renderer?.render(this.getRenderState(), nowMs());
      await this.waitMs(150);
      if (session !== this.sessionId) return true;
    }
    return spawnedAny;
  }

  public addPatronusCharge(rawAmount: number): void {
    if (rawAmount <= 0 || this.ended) return;
    const wasReady = this.patronusCharge >= 100;
    const houseBonus = this.house === 'ravenclaw' ? 0.2 : 0;
    const masteryBonus = (this.masteryBuffs.patronusBonusPct || 0) / 100;
    const gained = rawAmount * (1 + houseBonus + masteryBonus);
    this.patronusCharge = Math.min(100, Math.round((this.patronusCharge + gained) * 10) / 10);
    if (!wasReady && this.patronusCharge >= 100) {
      this.cb.onPatronusReady?.();
    }
  }

  public damageBoss(rawDamage: number, isTrueDamage = false): void {
    if (!this.bossConfig || this.bossDefeated || this.bossHp <= 0 || rawDamage <= 0) return;
    let dmg = Math.max(1, Math.round(rawDamage));
    if (!isTrueDamage) {
      const houseMult = this.house === 'gryffindor' ? 1.25 : 1;
      const masteryMult = 1 + (this.masteryBuffs.bossDamageBonusPct || 0) / 100;
      dmg = Math.max(1, Math.round(rawDamage * houseMult * masteryMult));
    }
    this.bossHp = Math.max(0, this.bossHp - dmg);

    const enragePct = this.bossConfig.enrageBelowPct || 0;
    if (
      this.bossHp > 0 &&
      !this.bossEnraged &&
      enragePct > 0 &&
      this.bossHp <= this.bossMaxHp * enragePct
    ) {
      this.bossEnraged = true;
      this.bossEffectiveCastInterval = Math.max(2, (this.bossConfig.castInterval || 4) - 1);
      this.pendingBossEnrageBurst = true;
      const snap = this.buildBossRuntimeState();
      if (snap) {
        this.cb.onBossEnraged?.(snap);
      }
    }

    if (this.bossHp === 0 && !this.bossDefeated) {
      this.bossDefeated = true;
      this.pendingBossEnrageBurst = false;
      this.cb.audio?.onColorBomb?.();
      this.vfx.shake = Math.max(this.vfx.shake, 12);
      this.spawnCenterBanner(`${this.bossConfig.emoji} ĐẠI TRÙM BẠI TRẬN!`);
      this.grantRandomSpecialsOnBoard(['bomb', 'firecracker']);
    }
  }

  private purgeAllDementorsWithPatronus(originR: number, originC: number): number {
    let banished = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.dementor[r]?.[c] || 0) > 0) {
          this.dementor[r][c] = 0;
          if (this.dementorCharge[r]) this.dementorCharge[r][c] = 0;
          banished++;
          this.spawnArc(originR, originC, r, c, '#e0f2fe');
          this.spawnRing(r, c, 1.5, '#7dd3fc');
          this.spawnBurst(r, c, '#bae6fd', 14);
          this.spawnPopup(r, c, 'THANH TẨY!', '#e0f2fe', 14);
        }
      }
    }
    if (banished > 0) {
      this.damageBoss(banished * 180);
      this.addScore(banished * 320, originR, originC, '#bae6fd', true, 'blocker');
    }
    return banished;
  }

  public grantRandomSpecialsOnBoard(specialTypes: CandySpecialType[] = []): void {
    const plainCells: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          this.mask[r]?.[c] === 1 &&
          !this.hasStaticBlocker(r, c) &&
          !this.isCellLocked(r, c) &&
          p &&
          this.isMatchablePiece(p) &&
          !p.special &&
          p.bombTimer === null
        ) {
          plainCells.push({ r, c });
        }
      }
    }
    plainCells.sort(() => Math.random() - 0.5);
    for (const sp of specialTypes) {
      const cell = plainCells.pop();
      if (!cell) break;
      const p = this.grid[cell.r]?.[cell.c];
      if (!p) continue;
      p.special = sp;
      p.scale = 1.28;
      this.spawnRing(cell.r, cell.c, 1.35, '#fde047');
    }
  }

  private unlockWithSugarKey(originR: number, originC: number): void {
    const lockedCells: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.lockGrid[r]?.[c] || 0) > 0) {
          lockedCells.push({ r, c });
        }
      }
    }
    if (lockedCells.length === 0) return;

    lockedCells.sort(() => Math.random() - 0.5);
    const unlockedNow = lockedCells.slice(0, 3);
    this.cb.audio?.onKeyUnlock?.();
    this.addPatronusCharge(8);
    for (const target of unlockedNow) {
      this.lockGrid[target.r][target.c] = 0;
      this.spawnArc(originR, originC, target.r, target.c, '#fde047');
      this.spawnRing(target.r, target.c, 1.35, '#fde047');
      this.spawnPopup(target.r, target.c, 'MỞ KHOÁ!', '#fef08a', 14);
      this.addScore(150, target.r, target.c, '#fef08a', false, 'blocker');
      this.damageBoss(65);
    }
  }

  private recordSpecialTriggered(special: CandySpecialType | null): void {
    if (!special) return;
    this.specialUsedThisTurn = true;
    this.addPatronusCharge(9);
    const rainbowGain = getSpecialRainbowChargeGain(special);
    if (rainbowGain > 0) {
      this.addRainbowCharge(rainbowGain);
    }
    if (special === 'firecracker' || special === 'striped_h' || special === 'striped_v') {
      this.specialStats.striped = (this.specialStats.striped || 0) + 1;
    } else if (
      special === 'bomb' ||
      special === 'dynamite' ||
      special === 'tnt' ||
      special === 'wrapped'
    ) {
      this.specialStats.wrapped = (this.specialStats.wrapped || 0) + 1;
    } else if (special === 'seeker') {
      this.specialStats.seeker = (this.specialStats.seeker || 0) + 1;
    } else if (special === 'color_bomb') {
      this.specialStats.color_bomb = (this.specialStats.color_bomb || 0) + 1;
    }
  }

  public isValidCell(r: number, c: number): boolean {
    return r >= 0 && r < this.size && c >= 0 && c < this.size;
  }

  private resetIdleHint(): void {
    this.lastActionAt = nowMs();
    this.hintPair = null;
  }

  public setBoosterMode(boosterKind: 'hammer' | 'swap' | 'shuffle'): void {
    if (this.busy || this.ended) return;
    if (boosterKind === 'shuffle') {
      void this.executeShuffleBooster();
      return;
    }
    if (this.activeBooster === boosterKind) {
      this.activeBooster = null;
      this.selected = null;
      this.emitHudState();
      return;
    }
    this.activeBooster = boosterKind;
    this.selected = null;
    this.emitHudState();
  }

  public cancelBoosterMode(): void {
    if (!this.activeBooster && !this.selected) return;
    this.activeBooster = null;
    this.selected = null;
    this.emitHudState();
  }

  public addExtraTurnsToBombs(extra = 5): void {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p && p.bombTimer !== null && p.bombTimer !== undefined) {
          p.bombTimer = Math.max(extra + 1, p.bombTimer + extra);
        }
      }
    }
  }

  public addExtraMoves(amount = 5): void {
    if (!this.level || this.status === 'won') return;
    this.ended = false;
    this.busy = false;
    this.status = 'playing';
    this.failReason = null;
    this.movesLeft += amount;
    this.addExtraTurnsToBombs(amount);
    if (this.renderer && this.rafId === null) {
      this.startLoop();
    }
    this.cb.audio?.onColorBomb?.();
    this.spawnCenterBanner(`+${amount} LƯỢT PHÉP THUẬT!`);
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    this.cb.onSettled?.();
  }

  public async applyPhoenixTalisman(): Promise<{ ok: boolean; msg: string }> {
    if (!this.level || this.status === 'won') {
      return { ok: false, msg: 'Màn chơi đã hoàn thành!' };
    }
    if (this.talismanUsed) {
      return { ok: false, msg: 'Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!' };
    }
    this.talismanUsed = true;
    this.ended = false;
    this.status = 'playing';
    this.failReason = null;
    this.activeBooster = null;
    this.selected = null;
    this.movesLeft += 5;
    this.addExtraTurnsToBombs(6);
    if (this.renderer && this.rafId === null) {
      this.startLoop();
    }

    const session = this.sessionId;
    this.busy = true;
    this.cb.audio?.onPatronus?.();
    this.vfx.shake = Math.max(this.vfx.shake, 11);
    this.spawnCenterBanner('🔥 PHƯỢNG HOÀNG TÁI SINH! +5 LƯỢT!');

    const mid = Math.floor(this.size / 2);
    const triggered = new Set<string>();
    const targets = this.pickBestSeekerTargets(3, triggered);
    for (const t of targets) {
      this.spawnArc(mid, mid, t.r, t.c, '#fb923c');
      this.damageCell(t.r, t.c, triggered, true, true);
    }
    this.damageBoss(320);
    this.addPatronusCharge(35);
    this.grantRandomSpecialsOnBoard(['color_bomb', 'seeker']);
    this.emitHudState();

    await this.waitMs(180);
    if (session !== this.sessionId) {
      return { ok: true, msg: '🔥 Phượng Hoàng tái sinh: +5 Lượt, gỡ Bom & ban Cầu Ngũ Sắc + Cánh Vàng!' };
    }
    await this.applyGravityAndRefill(session);
    if (session !== this.sessionId) {
      return { ok: true, msg: '🔥 Phượng Hoàng tái sinh: +5 Lượt, gỡ Bom & ban Cầu Ngũ Sắc + Cánh Vàng!' };
    }
    await this.resolveAllCascades(1, session);
    if (session !== this.sessionId) {
      return { ok: true, msg: '🔥 Phượng Hoàng tái sinh: +5 Lượt, gỡ Bom & ban Cầu Ngũ Sắc + Cánh Vàng!' };
    }

    this.busy = false;
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, false);
    return {
      ok: true,
      msg: '🔥 Phượng Hoàng tái sinh: +5 Lượt, gỡ Bom & ban Cầu Ngũ Sắc + Cánh Vàng Snitch!',
    };
  }

  public triggerFarmCompanion(bondLevel = 1): void {
    if (!this.level || this.status === 'won') return;
    this.ended = false;
    this.busy = false;
    this.status = 'playing';
    this.failReason = null;
    this.movesLeft += 2;
    this.addExtraTurnsToBombs(2);
    this.damageBoss(180 + Math.max(1, bondLevel) * 25);
    const triggered = new Set<string>();
    outerCompanionCleanse: for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.dementor[r]?.[c] || 0) > 0 || (this.horcrux[r]?.[c] || 0) >= 4) {
          this.damageCell(r, c, triggered, true, true);
          break outerCompanionCleanse;
        }
      }
    }
    const gifts: CandySpecialType[] = ['seeker'];
    if (bondLevel >= 3) {
      gifts.push('firecracker');
    }
    this.grantRandomSpecialsOnBoard(gifts);
    if (this.renderer && this.rafId === null) {
      this.startLoop();
    }
    this.vfx.shake = Math.max(this.vfx.shake, 8);
    this.spawnCenterBanner('🐾 BẠN ĐỒNG HÀNH TRỢ CHIẾN!');
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    this.cb.onSettled?.();
  }

  public async instantFreeShuffle(): Promise<void> {
    if (this.busy || this.ended || !this.level) return;
    const session = this.sessionId;
    this.busy = true;
    this.activeBooster = null;
    this.selected = null;
    this.cb.audio?.onSortingHat?.();
    this.spawnCenterBanner('🍺 BIA BƠ ĐẢO BÀN PHÉP!');
    await this.performShuffleAnimation(session);
    if (session !== this.sessionId) return;
    if (this.findMatchClusters().length > 0) {
      await this.resolveAllCascades(1, session);
      if (session !== this.sessionId) return;
    }
    this.busy = false;
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, false);
  }

  public async executeShuffleBooster(): Promise<boolean> {
    if (this.busy || this.ended || !this.level) return false;
    if (this.cb.onBoosterConsumed && !this.cb.onBoosterConsumed('shuffle')) {
      return false;
    }
    const session = this.sessionId;
    this.busy = true;
    this.activeBooster = null;
    this.selected = null;
    this.cb.audio?.onSortingHat?.();
    this.spawnCenterBanner('XOÁY THỜI GIAN!');
    await this.performShuffleAnimation(session);
    if (session !== this.sessionId) return true;
    if (this.findMatchClusters().length > 0) {
      await this.resolveAllCascades(1, session);
      if (session !== this.sessionId) return true;
    }
    this.busy = false;
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, false);
    return true;
  }

  public async executeHammer(r: number, c: number): Promise<boolean> {
    if (this.busy || this.ended || !this.level) return false;
    const piece = this.grid[r]?.[c];
    if (piece?.isIngredient && (this.jelly[r]?.[c] || 0) === 0 && !this.isCellLocked(r, c)) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(r, c, 'Bảo vật bất hoại!', '#fde047', 14);
      return false;
    }
    if (
      !piece &&
      (this.jelly[r]?.[c] || 0) === 0 &&
      (this.ice[r]?.[c] || 0) === 0 &&
      (this.petrify[r]?.[c] || 0) === 0 &&
      !this.hasStaticBlocker(r, c) &&
      (this.lockGrid[r]?.[c] || 0) === 0
    ) {
      return false;
    }
    if (this.cb.onBoosterConsumed && !this.cb.onBoosterConsumed('hammer')) {
      this.activeBooster = null;
      this.emitHudState();
      return false;
    }

    const session = this.sessionId;
    this.busy = true;
    this.activeBooster = null;
    this.selected = null;
    this.emitHudState();

    this.cb.audio?.onBomb?.();
    this.vfx.shake = 7;
    this.spawnRing(r, c, 1.5, '#fbbf24');
    this.spawnBurst(r, c, '#fde047', 22);
    this.spawnPopup(r, c, 'BÚA ĐŨA PHÉP!', '#fff59d', 17);

    const triggered = new Set<string>();
    this.damageCell(r, c, triggered, true, true);
    await this.waitMs(210);
    if (session !== this.sessionId) return true;

    await this.applyGravityAndRefill(session);
    if (session !== this.sessionId) return true;
    await this.resolveAllCascades(1, session);
    if (session !== this.sessionId) return true;

    this.busy = false;
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, false);
    return true;
  }

  public async castPatronus(): Promise<boolean> {
    if (this.busy || this.ended || !this.level || this.patronusCharge < 100) return false;
    const session = this.sessionId;
    this.patronusCharge = 0;
    this.busy = true;
    this.activeBooster = null;
    this.selected = null;
    this.resetIdleHint();
    this.emitHudState();

    this.cb.audio?.onPatronus?.();
    this.vfx.shake = 12;
    const triggered = new Set<string>();
    const mid = Math.floor(this.size / 2);

    this.purgeAllDementorsWithPatronus(mid, mid);

    if (this.house === 'gryffindor') {
      this.spawnCenterBanner('🦌 EXPECTO PATRONUM: HƯƠU BẠC!');
      let targetR = mid;
      let targetC = mid;
      if (this.mask[targetR]?.[targetC] === 0) {
        const fallback = this.findInitialKeyboardCell();
        targetR = fallback.r;
        targetC = fallback.c;
      }
      this.fireRowBeam(targetR, targetC, 0.86, '#f8fafc', triggered, false);
      this.fireColBeam(targetC, targetR, 0.86, '#fde047', triggered, false);
      for (let r = 0; r < this.size; r++) {
        let pierced = false;
        for (let c = 0; c < this.size; c++) {
          if ((this.horcrux[r]?.[c] || 0) >= 4 && !triggered.has(`hx:${r},${c}`)) {
            this.spawnArc(targetR, targetC, r, c, '#fde047');
            this.damageCell(r, c, triggered, true, true);
            pierced = true;
            break;
          }
        }
        if (pierced) break;
      }
      this.damageBoss(450);
      this.addScore(650, targetR, targetC, '#fde047', true, 'special');
      this.grantRandomSpecialsOnBoard(['bomb', 'firecracker']);
    } else if (this.house === 'slytherin') {
      this.spawnCenterBanner('🐍 EXPECTO PATRONUM: RẮN THẦN!');
      const darkTargets: Array<{ r: number; c: number; prio: number }> = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.mask[r]?.[c] === 0) continue;
          let prio = 0;
          if ((this.horcrux[r]?.[c] || 0) > 0) prio = 115;
          else if ((this.fiendfyre[r]?.[c] || 0) > 0) prio = 108;
          else if ((this.decree[r]?.[c] || 0) > 0) prio = 102;
          else if ((this.cauldron[r]?.[c] || 0) > 0) prio = 95;
          else if ((this.chocolate[r]?.[c] || 0) > 0) prio = 90;
          else if ((this.petrify[r]?.[c] || 0) > 0) prio = 88;
          else if ((this.lockGrid[r]?.[c] || 0) > 0) prio = 85;
          else if ((this.frosting[r]?.[c] || 0) > 0) prio = 80;
          else if ((this.ice[r]?.[c] || 0) > 0) prio = 75;
          else if (this.grid[r]?.[c]?.blocker === 'swirl') prio = 70;
          if (prio > 0) darkTargets.push({ r, c, prio: prio + Math.random() * 5 });
        }
      }
      darkTargets.sort((a, b) => b.prio - a.prio);
      for (const t of darkTargets.slice(0, 5)) {
        this.spawnArc(mid, mid, t.r, t.c, '#34d399');
        this.damageCell(t.r, t.c, triggered, true, true);
      }
      this.addExtraTurnsToBombs(3);
      this.damageBoss(360);
      this.addScore(560, mid, mid, '#6ee7b7', true, 'special');
      this.grantRandomSpecialsOnBoard(['color_bomb']);
    } else if (this.house === 'ravenclaw') {
      this.spawnCenterBanner('🦅 EXPECTO PATRONUM: ĐẠI BÀNG!');
      const targets = this.pickBestSeekerTargets(4, triggered);
      for (const t of targets) {
        this.spawnSeekerVfx(mid, mid, t.r, t.c, '#7dd3fc');
      }
      await this.waitMs(210);
      if (session !== this.sessionId) return true;
      for (const t of targets) {
        this.damageCell(t.r, t.c, triggered, true, true);
      }
      this.damageBoss(360);
      this.addScore(600, mid, mid, '#7dd3fc', true, 'special');
    } else {
      this.spawnCenterBanner('🦡 EXPECTO PATRONUM: LỬNG VÀNG!');
      this.movesLeft += 2;
      this.addExtraTurnsToBombs(2);
      for (let r = 0; r < this.size; r++) {
        let pierced = false;
        for (let c = 0; c < this.size; c++) {
          if ((this.horcrux[r]?.[c] || 0) >= 4) {
            this.spawnArc(mid, mid, r, c, '#fde047');
            this.damageCell(r, c, triggered, true, true);
            pierced = true;
            break;
          }
        }
        if (pierced) break;
      }
      this.grantRandomSpecialsOnBoard(['bomb', 'firecracker', 'seeker']);
      this.damageBoss(360);
      this.addScore(520, mid, mid, '#fde047', true, 'special');
    }

    await this.waitMs(220);
    if (session !== this.sessionId) return true;
    await this.applyGravityAndRefill(session);
    if (session !== this.sessionId) return true;
    await this.resolveAllCascades(1, session);
    if (session !== this.sessionId) return true;

    this.busy = false;
    this.resetIdleHint();
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, false);
    return true;
  }

  public async tryActivateSpecialInPlace(cell: { r: number; c: number }): Promise<boolean> {
    if (this.busy || this.ended || !this.level) return false;
    if (!this.isValidCell(cell.r, cell.c) || this.mask[cell.r]?.[cell.c] === 0) return false;

    if (this.hasStaticBlocker(cell.r, cell.c) || this.isCellLocked(cell.r, cell.c)) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(cell.r, cell.c, 'Ô đang bị khoá!', '#fde047', 14);
      return false;
    }

    const piece = this.grid[cell.r]?.[cell.c];
    if (!piece || !piece.special || piece.isIngredient || piece.blocker) {
      return false;
    }

    const session = this.sessionId;
    this.busy = true;
    this.selected = null;
    this.resetIdleHint();
    this.maxCascadeThisTurn = 1;
    this.specialUsedThisTurn = true;

    this.chocolateBrokenThisTurn = false;
    this.fiendfyreDamagedThisTurn = false;
    this.cauldronStunnedThisTurn.clear();
    this.dementorStunnedThisTurn.clear();
    this.movesLeft = Math.max(0, this.movesLeft - 1);
    this.movesUsed++;
    this.emitHudState();

    if (this.extractIngredientsAtExits()) {
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return true;
    }

    const currentPiece = this.grid[cell.r]?.[cell.c];
    if (currentPiece?.special === 'color_bomb') {
      const triggered = new Set<string>([`${cell.r},${cell.c}`]);
      this.cb.audio?.onColorBomb?.();
      this.consumeSwappedPiece(cell, triggered);
      const targetColors = this.pickRainbowTargetColors();
      const targetColorSet = new Set<number>(targetColors);
      const primaryHex = CANDY_TILE_TYPES[targetColors[0]]?.light || '#fde047';
      this.spawnPopup(
        cell.r,
        cell.c,
        targetColors.length >= 2 ? 'SIÊU CẦU VỒNG ×2!' : 'LUMOS MAXIMA!',
        primaryHex,
        19
      );

      const targets: Array<{ r: number; c: number }> = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.mask[r]?.[c] === 0 || this.isCellLocked(r, c) || this.hasStaticBlocker(r, c)) {
            continue;
          }
          const p = this.grid[r]?.[c];
          if (p && this.isMatchablePiece(p) && targetColorSet.has(p.color)) {
            targets.push({ r, c });
            this.spawnArc(
              cell.r,
              cell.c,
              r,
              c,
              CANDY_TILE_TYPES[p.color]?.light || primaryHex
            );
          }
        }
      }
      await this.waitMs(180);
      if (session !== this.sessionId) return true;
      const chainSet = this.cloneSpecialChainGuard(triggered);
      for (const t of targets) {
        this.damageCell(t.r, t.c, chainSet, true);
      }
      this.damageBoss(targetColors.length >= 2 ? 390 : 260);
      this.addScore(
        (targetColors.length >= 2 ? 950 : 650) + targets.length * 90,
        cell.r,
        cell.c,
        primaryHex,
        true,
        'special'
      );
      await this.waitMs(170);
    } else if (currentPiece?.special === 'seeker') {
      const triggered = new Set<string>([`${cell.r},${cell.c}`]);
      const color = currentPiece.color >= 0 ? currentPiece.color : 5;
      this.consumeSwappedPiece(cell, triggered);
      this.cb.audio?.onSeeker?.();
      this.triggerSeekerTakeoff(cell.r, cell.c, triggered);
      const landingSet = this.cloneSpecialChainGuard(triggered);
      const [target] = this.pickBestSeekerTargets(1, landingSet);
      if (target) {
        this.spawnSeekerVfx(
          cell.r,
          cell.c,
          target.r,
          target.c,
          CANDY_TILE_TYPES[color]?.light || '#fde047'
        );
        await this.waitMs(200);
        if (session !== this.sessionId) return true;
        this.damageCell(target.r, target.c, landingSet, true);
      }
      this.damageBoss(145);
      this.addScore(
        380,
        target ? target.r : cell.r,
        target ? target.c : cell.c,
        '#fde047',
        true,
        'special'
      );
      await this.waitMs(110);
    } else if (currentPiece?.special) {
      const triggered = new Set<string>();
      this.damageCell(cell.r, cell.c, triggered, true);
      await this.waitMs(190);
    }

    if (session !== this.sessionId) return true;
    await this.applyGravityAndRefill(session);
    if (session !== this.sessionId) return true;
    await this.resolveAllCascades(2, session);
    if (session !== this.sessionId) return true;

    this.cb.onPlayerMoveCommitted?.(this.movesUsed, this.maxCascadeThisTurn, true);
    this.busy = false;
    this.resetIdleHint();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, true);
    return true;
  }

  public async trySwap(
    a: { r: number; c: number },
    b: { r: number; c: number }
  ): Promise<boolean> {
    if (this.busy || this.ended || !this.level) return false;
    if (!this.isValidCell(a.r, a.c) || !this.isValidCell(b.r, b.c)) return false;
    if (Math.abs(a.r - b.r) + Math.abs(a.c - b.c) !== 1) return false;
    if (this.mask[a.r]?.[a.c] === 0 || this.mask[b.r]?.[b.c] === 0) return false;

    if (this.hasStaticBlocker(a.r, a.c) || this.hasStaticBlocker(b.r, b.c)) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(b.r, b.c, 'Ô đang bị chặn!', '#fde047', 14);
      return false;
    }
    if ((this.lockGrid[a.r]?.[a.c] || 0) > 0 || (this.lockGrid[b.r]?.[b.c] || 0) > 0) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(b.r, b.c, 'Cần Chìa Khoá Vàng!', '#fde047', 14);
      return false;
    }
    if ((this.petrify[a.r]?.[a.c] || 0) > 0 || (this.petrify[b.r]?.[b.c] || 0) > 0) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(b.r, b.c, 'Đang Hoá Đá Tử Xà!', '#6ee7b7', 14);
      return false;
    }
    if ((this.ice[a.r]?.[a.c] || 0) > 0 || (this.ice[b.r]?.[b.c] || 0) > 0) {
      this.cb.audio?.onInvalid?.();
      this.spawnPopup(b.r, b.c, 'Ô bị đóng băng!', '#7dd3fc', 14);
      return false;
    }

    const pA = this.grid[a.r]?.[a.c];
    const pB = this.grid[b.r]?.[b.c];
    if (!pA || !pB) return false;

    const isFreeSwapBooster = this.activeBooster === 'swap';
    if (isFreeSwapBooster && this.cb.onBoosterConsumed) {
      if (!this.cb.onBoosterConsumed('swap')) {
        this.activeBooster = null;
        this.selected = null;
        this.emitHudState();
        return false;
      }
    }

    const session = this.sessionId;
    this.busy = true;
    this.resetIdleHint();
    this.lastSwapDir = a.r === b.r ? 'h' : 'v';
    this.maxCascadeThisTurn = 1;
    this.specialUsedThisTurn = !isFreeSwapBooster && Boolean(pA.special || pB.special);

    this.cb.audio?.onSwap?.();
    await this.animateSwap(a, b, 150, session);
    if (session !== this.sessionId) return false;

    const specialCombo = isFreeSwapBooster ? null : this.detectSwapSpecialCombo(a, b);
    const clusters = specialCombo ? [] : this.findMatchClusters([b, a]);

    if (!specialCombo && clusters.length === 0 && !isFreeSwapBooster) {
      this.cb.audio?.onInvalid?.();
      await this.animateSwap(a, b, 150, session);
      if (session !== this.sessionId) return false;
      this.busy = false;
      this.renderer?.render(this.getRenderState(), nowMs());
      return false;
    }

    this.chocolateBrokenThisTurn = false;
    this.fiendfyreDamagedThisTurn = false;
    this.cauldronStunnedThisTurn.clear();
    this.dementorStunnedThisTurn.clear();
    if (isFreeSwapBooster) {
      this.activeBooster = null;
      this.spawnPopup(b.r, b.c, 'ĐŨA PHÉP ĐỔI KẸO!', '#fff59d', 16);
    } else {
      this.movesLeft = Math.max(0, this.movesLeft - 1);
      this.movesUsed++;
    }
    this.emitHudState();

    if (this.extractIngredientsAtExits()) {
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return true;
    }

    if (specialCombo) {
      this.specialUsedThisTurn = true;
      await this.executeSpecialCombo(specialCombo, a, b, session);
      if (session !== this.sessionId) return true;
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return true;
      await this.resolveAllCascades(2, session);
      if (session !== this.sessionId) return true;
    } else if (clusters.length > 0) {
      await this.clearClusters(clusters, 1, [b, a], session);
      if (session !== this.sessionId) return true;
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return true;
      await this.resolveAllCascades(2, session);
      if (session !== this.sessionId) return true;
    } else {
      await this.resolveAllCascades(1, session);
      if (session !== this.sessionId) return true;
    }

    if (!isFreeSwapBooster) {
      this.cb.onPlayerMoveCommitted?.(
        this.movesUsed,
        this.maxCascadeThisTurn,
        this.specialUsedThisTurn
      );
    }

    this.busy = false;
    this.resetIdleHint();
    this.renderer?.render(this.getRenderState(), nowMs());
    await this.checkPostTurnState(session, !isFreeSwapBooster);
    return true;
  }

  private async animateSwap(
    a: { r: number; c: number },
    b: { r: number; c: number },
    durationMs = 150,
    session = this.sessionId
  ): Promise<void> {
    const pA = this.grid[a.r]?.[a.c];
    const pB = this.grid[b.r]?.[b.c];
    if (!pA || !pB) return;

    if (!this.instantAnimations && this.renderer) {
      const start = nowMs();
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (session !== this.sessionId) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / durationMs);
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          pA.x = a.c + (b.c - a.c) * ease;
          pA.y = a.r + (b.r - a.r) * ease;
          pB.x = b.c + (a.c - b.c) * ease;
          pB.y = b.r + (a.r - b.r) * ease;
          if (t < 1) nextAnimFrame(step);
          else resolve();
        };
        nextAnimFrame(step);
      });
    }

    if (session !== this.sessionId) return;
    this.grid[a.r][a.c] = pB;
    this.grid[b.r][b.c] = pA;
    pA.x = b.c;
    pA.y = b.r;
    pB.x = a.c;
    pB.y = a.r;
  }

  private detectSwapSpecialCombo(
    a: { r: number; c: number },
    b: { r: number; c: number }
  ): SwapSpecialCombo | null {
    const pA = this.grid[a.r]?.[a.c];
    const pB = this.grid[b.r]?.[b.c];
    if (!pA || !pB) return null;
    if (!pA.special && !pB.special) return null;

    if (pA.special === 'color_bomb' && pB.special === 'color_bomb') {
      return { type: 'double_color_bomb' };
    }
    if (pA.special === 'color_bomb' || pB.special === 'color_bomb') {
      const bombPos = pA.special === 'color_bomb' ? a : b;
      const otherPos = pA.special === 'color_bomb' ? b : a;
      const otherPiece = this.grid[otherPos.r]?.[otherPos.c];
      if (!otherPiece) return null;
      const targetColor =
        otherPiece.special || otherPiece.isIngredient || otherPiece.blocker || otherPiece.color < 0
          ? this.pickMostAbundantColorOnBoard()
          : otherPiece.color;
      return {
        type: 'color_bomb_combo',
        bombPos,
        otherPos,
        targetColor,
        otherSpecial: otherPiece.special,
      };
    }

    if (pA.special === 'seeker' && pB.special === 'seeker') {
      return { type: 'double_seeker', posA: a, posB: b };
    }
    if ((pA.special === 'seeker' && pB.special) || (pA.special && pB.special === 'seeker')) {
      const seekerPos = pA.special === 'seeker' ? a : b;
      const payload = (pA.special === 'seeker' ? pB.special : pA.special)!;
      return { type: 'seeker_payload', posA: a, posB: b, seekerPos, payload };
    }

    if (pA.special && pB.special) {
      const isStripedA = pA.special === 'striped_h' || pA.special === 'striped_v';
      const isStripedB = pB.special === 'striped_h' || pB.special === 'striped_v';
      if (isStripedA && isStripedB) return { type: 'cross_striped', center: b };
      if (
        (isStripedA && isRadialExplosiveSpecial(pB.special)) ||
        (isRadialExplosiveSpecial(pA.special) && isStripedB)
      ) {
        return { type: 'giant_striped_wrapped', center: b };
      }
      const radA = getGardenscapesBlastRadius(pA.special);
      const radB = getGardenscapesBlastRadius(pB.special);
      if (radA && radB) {
        const gridRadius = Math.min(5, Math.max(radA.gridRadius, radB.gridRadius) + 1);
        return {
          type: 'combined_explosive',
          posA: a,
          posB: b,
          center: b,
          gridRadius,
          maxHypot: gridRadius + 0.3,
        };
      }
    }

    const specialPos = pB.special ? b : a;
    const normalPos = pB.special ? a : b;
    return { type: 'single_special_swap', specialPos, normalPos };
  }

  private consumeSwappedPiece(pos: { r: number; c: number }, triggeredSet: Set<string>): void {
    const p = this.grid[pos.r]?.[pos.c];
    if (!p || p.isIngredient) return;
    const hadKey = p.hasKey;
    if (p.special) this.recordSpecialTriggered(p.special);
    if (p.special !== 'color_bomb' && p.color >= 0) {
      this.collected[p.color] = (this.collected[p.color] || 0) + 1;
    }
    this.grid[pos.r][pos.c] = null;
    if (hadKey) {
      this.unlockWithSugarKey(pos.r, pos.c);
    }
    const jellyKey = `j:${pos.r},${pos.c}`;
    if (!triggeredSet.has(jellyKey)) {
      triggeredSet.add(jellyKey);
      this.breakJelly(pos.r, pos.c);
    }
  }

  private async executeSpecialCombo(
    combo: SwapSpecialCombo,
    a: { r: number; c: number },
    b: { r: number; c: number },
    session = this.sessionId
  ): Promise<void> {
    const triggered = new Set<string>([`${a.r},${a.c}`, `${b.r},${b.c}`]);

    if (combo.type === 'double_color_bomb') {
      this.cb.audio?.onColorBomb?.();
      this.cb.audio?.onBomb?.();
      this.vfx.shake = this.superRainbow ? 19 : 16;
      this.spawnCenterBanner(
        this.superRainbow ? 'ĐẠI SIÊU CẦU VỒNG ×2 BÀN!' : 'HOGWARTS CRUSH! TOÀN BÀN!'
      );
      this.consumeSwappedPiece(a, triggered);
      this.consumeSwappedPiece(b, triggered);

      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.mask[r]?.[c] === 0) continue;
          this.spawnArc(b.r, b.c, r, c, '#fde047');
        }
      }
      await this.waitMs(200);
      if (session !== this.sessionId) return;
      const wave1Set = this.cloneSpecialChainGuard(triggered);
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.mask[r]?.[c] === 0) continue;
          this.damageCell(r, c, wave1Set, true, true);
        }
      }
      await this.waitMs(140);
      if (session !== this.sessionId) return;
      this.spawnRing(b.r, b.c, Math.max(4.5, this.size * 0.65), '#38bdf8');
      const wave2Set = this.cloneSpecialChainGuard(wave1Set);
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.mask[r]?.[c] === 0) continue;
          this.damageCell(r, c, wave2Set, true, true);
        }
      }
      this.damageBoss(620);
      this.addScore(2800, b.r, b.c, '#fde047', true, 'special');

      if (this.superRainbow) {
        await this.waitMs(180);
        if (session !== this.sessionId) return;
        await this.applyGravityAndRefill(session);
        if (session !== this.sessionId) return;

        this.cb.audio?.onColorBomb?.();
        this.cb.audio?.onBomb?.();
        this.vfx.shake = Math.max(this.vfx.shake, 18);
        this.spawnRing(b.r, b.c, Math.max(5, this.size * 0.72), '#f472b6');
        for (let r = 0; r < this.size; r++) {
          for (let c = 0; c < this.size; c++) {
            if (this.mask[r]?.[c] === 0) continue;
            this.spawnArc(b.r, b.c, r, c, '#f472b6');
          }
        }
        await this.waitMs(170);
        if (session !== this.sessionId) return;
        const wave3Set = new Set<string>();
        for (let r = 0; r < this.size; r++) {
          for (let c = 0; c < this.size; c++) {
            if (this.mask[r]?.[c] === 0) continue;
            this.damageCell(r, c, wave3Set, true, true);
          }
        }
        this.damageBoss(420);
        this.addScore(2200, b.r, b.c, '#f472b6', true, 'special');
      }

      await this.waitMs(220);
      return;
    }

    if (combo.type === 'color_bomb_combo') {
      const { bombPos, otherPos, targetColor, otherSpecial } = combo;
      this.cb.audio?.onColorBomb?.();
      this.consumeSwappedPiece(bombPos, triggered);
      if (otherSpecial) {
        this.consumeSwappedPiece(otherPos, triggered);
      }
      const targetColors = this.pickRainbowTargetColors(otherSpecial ? -1 : targetColor);
      const targetColorSet = new Set<number>(targetColors);
      const isDualRainbow = targetColors.length >= 2;
      const colorHex = CANDY_TILE_TYPES[targetColors[0]]?.light || '#fde047';

      const targets: Array<{ r: number; c: number }> = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (
            this.mask[r]?.[c] === 0 ||
            (this.lockGrid[r]?.[c] || 0) > 0 ||
            (this.petrify[r]?.[c] || 0) > 0 ||
            this.hasStaticBlocker(r, c)
          ) {
            continue;
          }
          const p = this.grid[r]?.[c];
          if (p && this.isMatchablePiece(p) && targetColorSet.has(p.color)) {
            targets.push({ r, c });
            this.spawnArc(
              bombPos.r,
              bombPos.c,
              r,
              c,
              CANDY_TILE_TYPES[p.color]?.light || colorHex
            );
          }
        }
      }

      if (otherSpecial) {
        if (otherSpecial === 'seeker') {
          this.cb.audio?.onSeeker?.();
          this.spawnCenterBanner(
            isDualRainbow ? 'ĐẠI ĐÀN SNITCH ×2 MÀU!' : 'ĐÀN CÁNH VÀNG SNITCH!'
          );
        } else {
          this.cb.audio?.onBomb?.();
          this.spawnCenterBanner(
            isDualRainbow ? 'SIÊU BÃO KẸO PHÉP ×2 MÀU!' : 'ĐẠI TIỆC KẸO PHÉP!'
          );
        }
        for (const t of targets) {
          const piece = this.grid[t.r]?.[t.c];
          if (!piece || this.isCellLocked(t.r, t.c)) continue;
          if (otherSpecial === 'striped_h' || otherSpecial === 'striped_v') {
            piece.special = Math.random() < 0.5 ? 'striped_h' : 'striped_v';
          } else {
            piece.special = otherSpecial;
          }
          piece.scale = 1.28;
        }
        await this.waitMs(230);
        if (session !== this.sessionId) return;
        const armyChainGuard = this.cloneSpecialChainGuard(triggered);
        for (const t of targets) {
          if (!this.grid[t.r]?.[t.c]) continue;
          const blastSet = this.cloneSpecialChainGuard(armyChainGuard);
          this.damageCell(t.r, t.c, blastSet, true);
          for (const k of blastSet) {
            if (!k.includes(':')) armyChainGuard.add(k);
          }
        }
        this.damageBoss(isDualRainbow ? 620 : 420);
        this.addScore(
          (isDualRainbow ? 1950 : 1450) + targets.length * 135,
          bombPos.r,
          bombPos.c,
          '#fde047',
          true,
          'special'
        );
        await this.waitMs(230);
      } else {
        this.spawnPopup(
          bombPos.r,
          bombPos.c,
          isDualRainbow ? 'SIÊU CẦU VỒNG ×2!' : 'LUMOS MAXIMA!',
          colorHex,
          20
        );
        await this.waitMs(200);
        if (session !== this.sessionId) return;
        const chainSet = this.cloneSpecialChainGuard(triggered);
        for (const t of targets) {
          this.damageCell(t.r, t.c, chainSet, true);
        }
        this.damageBoss(isDualRainbow ? 390 : 260);
        this.addScore(
          (isDualRainbow ? 950 : 650) + targets.length * 90,
          bombPos.r,
          bombPos.c,
          colorHex,
          true,
          'special'
        );
        await this.waitMs(180);
      }
      return;
    }

    if (combo.type === 'double_seeker') {
      const { posA, posB } = combo;
      const color = this.grid[posB.r]?.[posB.c]?.color ?? 5;
      this.consumeSwappedPiece(posA, triggered);
      this.consumeSwappedPiece(posB, triggered);
      this.cb.audio?.onSeeker?.();
      this.triggerSeekerTakeoff(posA.r, posA.c, triggered);
      this.triggerSeekerTakeoff(posB.r, posB.c, triggered);
      this.spawnPopup(posB.r, posB.c, '3× TẦM THỦ SNITCH!', '#fde047', 19);
      const landingGuard = this.cloneSpecialChainGuard(triggered);
      const best = this.pickBestSeekerTargets(3, landingGuard);
      for (const t of best) {
        this.spawnSeekerVfx(
          posB.r,
          posB.c,
          t.r,
          t.c,
          CANDY_TILE_TYPES[color]?.light || '#fde047'
        );
      }
      await this.waitMs(220);
      if (session !== this.sessionId) return;
      for (const t of best) {
        this.damageCell(t.r, t.c, landingGuard, true);
      }
      this.damageBoss(260);
      this.addScore(820, posB.r, posB.c, '#fde047', true, 'special');
      await this.waitMs(140);
      return;
    }

    if (combo.type === 'seeker_payload') {
      const { posA, posB, seekerPos, payload } = combo;
      this.consumeSwappedPiece(posA, triggered);
      this.consumeSwappedPiece(posB, triggered);
      this.cb.audio?.onSeeker?.();
      this.triggerSeekerTakeoff(seekerPos.r, seekerPos.c, triggered);
      const landingGuard = this.cloneSpecialChainGuard(triggered);
      const [target] = this.pickBestSeekerTargets(1, landingGuard);
      if (target) {
        this.spawnSeekerVfx(posB.r, posB.c, target.r, target.c, '#fde047');
        await this.waitMs(210);
        if (session !== this.sessionId) return;
        const rad = getGardenscapesBlastRadius(payload);
        if (rad) {
          this.detonateRadialBlast(
            target.r,
            target.c,
            rad.gridRadius,
            rad.maxHypot,
            '#fb923c',
            8 + rad.gridRadius * 2,
            240 + rad.gridRadius * 55,
            780 + rad.gridRadius * 180,
            landingGuard
          );
        } else {
          this.cb.audio?.onBeam?.();
          if (Math.random() < 0.5) {
            this.fireRowBeam(target.r, target.c, 0.72, '#38bdf8', landingGuard, true);
          } else {
            this.fireColBeam(target.c, target.r, 0.72, '#38bdf8', landingGuard, true);
          }
          this.damageBoss(270);
          this.addScore(920, target.r, target.c, '#fde047', true, 'special');
        }
      }
      await this.waitMs(180);
      return;
    }

    if (combo.type === 'combined_explosive') {
      const { posA, posB, center, gridRadius, maxHypot } = combo;
      this.consumeSwappedPiece(posA, triggered);
      this.consumeSwappedPiece(posB, triggered);
      this.spawnCenterBanner('CONFRINGO! ĐẠI NỔ KÉP!');
      const blastGuard = this.cloneSpecialChainGuard(triggered);
      this.detonateRadialBlast(
        center.r,
        center.c,
        gridRadius,
        maxHypot,
        gridRadius >= 4 ? '#ef4444' : '#f97316',
        Math.min(16, 8 + gridRadius * 2),
        260 + gridRadius * 85,
        900 + gridRadius * 240,
        blastGuard
      );
      await this.waitMs(230);
      return;
    }

    if (combo.type === 'single_special_swap') {
      const { specialPos, normalPos } = combo;
      const sideClusters = this.findMatchClusters([normalPos]);
      if (sideClusters.length > 0) {
        await this.clearClusters(sideClusters, 1, [normalPos], session);
        if (session !== this.sessionId) return;
      }

      const spPiece = this.grid[specialPos.r]?.[specialPos.c];
      if (!spPiece || !spPiece.special) return;

      if (spPiece.special === 'seeker') {
        const seekerSet = new Set<string>([`${specialPos.r},${specialPos.c}`]);
        const color = spPiece.color >= 0 ? spPiece.color : 5;
        this.consumeSwappedPiece(specialPos, seekerSet);
        this.cb.audio?.onSeeker?.();
        this.triggerSeekerTakeoff(specialPos.r, specialPos.c, seekerSet);
        const landingGuard = this.cloneSpecialChainGuard(seekerSet);
        const [target] = this.pickBestSeekerTargets(1, landingGuard);
        if (target) {
          this.spawnSeekerVfx(
            specialPos.r,
            specialPos.c,
            target.r,
            target.c,
            CANDY_TILE_TYPES[color]?.light || '#fde047'
          );
          await this.waitMs(200);
          if (session !== this.sessionId) return;
          this.damageCell(target.r, target.c, landingGuard, true);
        }
        this.damageBoss(145);
        this.addScore(
          380,
          target ? target.r : specialPos.r,
          target ? target.c : specialPos.c,
          '#fde047',
          true,
          'special'
        );
        await this.waitMs(110);
      } else {
        const singleSet = new Set<string>();
        this.damageCell(specialPos.r, specialPos.c, singleSet, true);
        await this.waitMs(190);
      }
      return;
    }

    if (combo.type === 'cross_striped') {
      const { r, c } = combo.center;
      this.consumeSwappedPiece(a, triggered);
      this.consumeSwappedPiece(b, triggered);
      this.cb.audio?.onBeam?.();
      this.vfx.shake = 8;
      this.spawnPopup(r, c, 'SECTUMSEMPRA!', '#fff59d', 20);
      const beamSet = this.cloneSpecialChainGuard(triggered);
      this.fireRowBeam(r, c, 0.75, '#38bdf8', beamSet, true);
      this.fireColBeam(c, r, 0.75, '#38bdf8', beamSet, true);
      this.damageBoss(260);
      this.addScore(850, r, c, '#fde047', true, 'special');
      await this.waitMs(230);
      return;
    }

    if (combo.type === 'giant_striped_wrapped') {
      const { r, c } = combo.center;
      this.consumeSwappedPiece(a, triggered);
      this.consumeSwappedPiece(b, triggered);
      this.cb.audio?.onBeam?.();
      this.cb.audio?.onBomb?.();
      this.vfx.shake = 12;
      this.spawnCenterBanner('BOMBARDIA MAXIMA 3×3!');
      const beamSet = this.cloneSpecialChainGuard(triggered);
      for (let d = -1; d <= 1; d++) {
        if (r + d >= 0 && r + d < this.size) {
          this.fireRowBeam(r + d, c, 0.9, '#c084fc', beamSet, false);
        }
        if (c + d >= 0 && c + d < this.size) {
          this.fireColBeam(c + d, r, 0.9, '#c084fc', beamSet, false);
        }
      }
      this.damageBoss(420);
      this.addScore(1500, r, c, '#fde047', true, 'special');
      await this.waitMs(260);
    }
  }

  public findMatchClusters(
    preferredAnchors: Array<{ r: number; c: number }> = []
  ): MatchCluster[] {
    const hRuns: MatchRun[] = [];
    const vRuns: MatchRun[] = [];
    const sqRuns: MatchRun[] = [];

    for (let r = 0; r < this.size; r++) {
      let c = 0;
      while (c < this.size) {
        const p = this.grid[r]?.[c];
        if (!this.isCellMatchable(r, c) || !p || p.primedWrapped) {
          c++;
          continue;
        }
        let end = c + 1;
        while (
          end < this.size &&
          this.isCellMatchable(r, end) &&
          !this.grid[r]?.[end]?.primedWrapped &&
          this.grid[r]?.[end]?.color === p.color
        ) {
          end++;
        }
        if (end - c >= 3) {
          const cells: Array<{ r: number; c: number }> = [];
          for (let k = c; k < end; k++) cells.push({ r, c: k });
          hRuns.push({ dir: 'h', color: p.color, len: end - c, cells });
        }
        c = end;
      }
    }

    for (let c = 0; c < this.size; c++) {
      let r = 0;
      while (r < this.size) {
        const p = this.grid[r]?.[c];
        if (!this.isCellMatchable(r, c) || !p || p.primedWrapped) {
          r++;
          continue;
        }
        let end = r + 1;
        while (
          end < this.size &&
          this.isCellMatchable(end, c) &&
          !this.grid[end]?.[c]?.primedWrapped &&
          this.grid[end]?.[c]?.color === p.color
        ) {
          end++;
        }
        if (end - r >= 3) {
          const cells: Array<{ r: number; c: number }> = [];
          for (let k = r; k < end; k++) cells.push({ r: k, c });
          vRuns.push({ dir: 'v', color: p.color, len: end - r, cells });
        }
        r = end;
      }
    }

    for (let r = 0; r < this.size - 1; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (
          !this.isCellMatchable(r, c) ||
          !this.isCellMatchable(r, c + 1) ||
          !this.isCellMatchable(r + 1, c) ||
          !this.isCellMatchable(r + 1, c + 1)
        ) {
          continue;
        }
        const p00 = this.grid[r]?.[c];
        const p01 = this.grid[r]?.[c + 1];
        const p10 = this.grid[r + 1]?.[c];
        const p11 = this.grid[r + 1]?.[c + 1];
        if (
          p00 &&
          p01 &&
          p10 &&
          p11 &&
          !p00.primedWrapped &&
          !p01.primedWrapped &&
          !p10.primedWrapped &&
          !p11.primedWrapped &&
          p00.color === p01.color &&
          p00.color === p10.color &&
          p00.color === p11.color
        ) {
          sqRuns.push({
            dir: 'sq',
            color: p00.color,
            len: 4,
            cells: [
              { r, c },
              { r, c: c + 1 },
              { r: r + 1, c },
              { r: r + 1, c: c + 1 },
            ],
          });
        }
      }
    }

    const allRuns = [...hRuns, ...vRuns, ...sqRuns];
    if (allRuns.length === 0) return [];

    const visited = new Array<boolean>(allRuns.length).fill(false);
    const clusters: MatchCluster[] = [];

    const shareCell = (runA: MatchRun, runB: MatchRun): boolean => {
      if (runA.color !== runB.color) return false;
      for (const a of runA.cells) {
        for (const b of runB.cells) {
          if (a.r === b.r && a.c === b.c) return true;
        }
      }
      return false;
    };

    for (let i = 0; i < allRuns.length; i++) {
      if (visited[i]) continue;
      visited[i] = true;
      const queue: MatchRun[] = [allRuns[i]];
      const groupRuns: MatchRun[] = [allRuns[i]];

      while (queue.length > 0) {
        const cur = queue.shift()!;
        for (let j = 0; j < allRuns.length; j++) {
          if (!visited[j] && shareCell(cur, allRuns[j])) {
            visited[j] = true;
            queue.push(allRuns[j]);
            groupRuns.push(allRuns[j]);
          }
        }
      }

      const cellMap = new Map<string, { r: number; c: number; count: number }>();
      let maxLineLen = 0;
      let hasH = false;
      let hasV = false;
      let hasSq = false;
      for (const run of groupRuns) {
        if (run.dir === 'h' || run.dir === 'v') {
          if (run.len > maxLineLen) maxLineLen = run.len;
          if (run.dir === 'h') hasH = true;
          if (run.dir === 'v') hasV = true;
        } else if (run.dir === 'sq') {
          hasSq = true;
        }
        for (const cell of run.cells) {
          const key = `${cell.r},${cell.c}`;
          cellMap.set(key, { r: cell.r, c: cell.c, count: (cellMap.get(key)?.count || 0) + 1 });
        }
      }

      const clusterCells = Array.from(cellMap.values());
      const totalCells = clusterCells.length;

      let spawnSpecial: CandySpecialType | null = null;
      if (totalCells >= 7 && (maxLineLen >= 4 || (hasH && hasV))) {
        spawnSpecial = 'tnt';
      } else if (totalCells >= 6 && (maxLineLen >= 4 || (hasH && hasV) || hasSq)) {
        spawnSpecial = 'dynamite';
      } else if (maxLineLen >= 5 || (hasH && hasV)) {
        spawnSpecial = 'bomb';
      } else if (maxLineLen === 4) {
        spawnSpecial = 'firecracker';
      } else if (hasSq) {
        spawnSpecial = 'seeker';
      }

      clusters.push({
        color: groupRuns[0].color,
        cells: clusterCells,
        spawnSpecial,
      });
    }

    return clusters;
  }

  private hasPrimedWrappedCandies(): boolean {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r]?.[c]?.primedWrapped) return true;
      }
    }
    return false;
  }

  private async detonatePrimedWrappedCandies(session = this.sessionId): Promise<boolean> {
    const primedList: Array<{ r: number; c: number; piece: CandyInternalPiece }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p?.primedWrapped) {
          primedList.push({ r, c, piece: p });
        }
      }
    }
    if (primedList.length === 0) return false;

    await this.waitMs(120);
    if (session !== this.sessionId) return true;

    const triggered = new Set<string>();
    this.cb.audio?.onBomb?.();
    this.vfx.shake = Math.max(this.vfx.shake, 10);

    for (const item of primedList) {
      const { r, c, piece } = item;
      if (this.grid[r]?.[c] === piece) {
        this.grid[r][c] = null;
      }
      const radius = piece.primedMega ? 2 : 1;
      this.spawnRing(r, c, radius === 2 ? 3.0 : 2.1, '#fbbf24');
      this.spawnPopup(r, c, 'NỔ KÉP!', '#fde047', 16);
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          this.damageCell(r + dr, c + dc, triggered, true);
        }
      }
      this.damageBoss(piece.primedMega ? 220 : 120);
      this.addScore(piece.primedMega ? 650 : 340, r, c, '#fbbf24', false, 'special');
    }

    this.emitHudState();
    await this.waitMs(180);
    return true;
  }

  private async resolveAllCascades(startCombo = 1, session = this.sessionId): Promise<void> {
    let combo = startCombo;
    let safety = 0;
    while (session === this.sessionId && safety < 40) {
      safety++;
      const clusters = this.findMatchClusters();
      if (clusters.length > 0) {
        this.maxCascadeThisTurn = Math.max(this.maxCascadeThisTurn, combo);
        await this.clearClusters(clusters, combo, [], session);
        if (session !== this.sessionId) return;
        await this.applyGravityAndRefill(session);
        if (session !== this.sessionId) return;
        combo++;
        continue;
      }

      if (this.hasPrimedWrappedCandies()) {
        this.specialUsedThisTurn = true;
        await this.detonatePrimedWrappedCandies(session);
        if (session !== this.sessionId) return;
        await this.applyGravityAndRefill(session);
        if (session !== this.sessionId) return;
        combo++;
        continue;
      }

      break;
    }

    if (session === this.sessionId && !this.ended && this.pendingRainbowSpawns > 0) {
      await this.materializePendingRainbowBlasts(session);
    }
  }

  public isSuppressedByDecree(r: number, c: number): boolean {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if ((this.decree[r + dr]?.[c + dc] || 0) > 0) return true;
      }
    }
    return false;
  }

  private hitPetrifyAt(r: number, c: number): boolean {
    if ((this.petrify[r]?.[c] || 0) <= 0) return false;
    this.petrify[r][c]--;
    this.addPatronusCharge(5);
    this.cb.audio?.onIceBreak?.();
    this.spawnBurst(r, c, '#94a3b8', 11);
    if (this.petrify[r][c] <= 0) {
      this.petrify[r][c] = 0;
      this.spawnPopup(r, c, 'GIẢI HOÁ ĐÁ!', '#6ee7b7', 13);
      this.addScore(130, r, c, '#a7f3d0', false, 'blocker');
      this.damageBoss(55);
    } else {
      this.addScore(80, r, c, '#cbd5e1', false, 'blocker');
      this.damageBoss(30);
    }
    return true;
  }

  private hitDementorAt(r: number, c: number): boolean {
    if ((this.dementor[r]?.[c] || 0) <= 0) return false;
    this.dementor[r][c]--;
    this.dementorStunnedThisTurn.add(`${r},${c}`);
    this.dementorCharge[r][c] = 0;
    this.addPatronusCharge(8);
    if (this.dementor[r][c] <= 0) {
      this.dementor[r][c] = 0;
      this.cb.audio?.onBomb?.();
      this.spawnRing(r, c, 1.5, '#7dd3fc');
      this.spawnBurst(r, c, '#bae6fd', 16);
      this.spawnPopup(r, c, 'TRỤC XUẤT GIÁM NGỤC!', '#e0f2fe', 14);
      this.addScore(260, r, c, '#bae6fd', false, 'blocker');
      this.damageBoss(165);
    } else {
      this.cb.audio?.onIceBreak?.();
      this.spawnBurst(r, c, '#38bdf8', 10);
      this.addScore(105, r, c, '#7dd3fc', false, 'blocker');
      this.damageBoss(50);
    }
    return true;
  }

  private hitDecreeAt(r: number, c: number): boolean {
    if ((this.decree[r]?.[c] || 0) <= 0) return false;
    this.decree[r][c]--;
    this.addPatronusCharge(6);
    if (this.decree[r][c] <= 0) {
      this.decree[r][c] = 0;
      this.cb.audio?.onBomb?.();
      this.spawnRing(r, c, 1.45, '#f472b6');
      this.spawnBurst(r, c, '#f9a8d4', 16);
      this.spawnPopup(r, c, 'BỂ SẮC LỆNH!', '#fbcfe8', 14);
      this.addScore(240, r, c, '#f9a8d4', false, 'blocker');
      this.damageBoss(150);
    } else {
      this.cb.audio?.onIceBreak?.();
      this.spawnBurst(r, c, '#ec4899', 10);
      this.addScore(100, r, c, '#fbcfe8', false, 'blocker');
      this.damageBoss(45);
    }
    return true;
  }

  private hitFiendfyreAt(r: number, c: number): boolean {
    if ((this.fiendfyre[r]?.[c] || 0) <= 0) return false;
    this.fiendfyre[r][c]--;
    this.fiendfyreDamagedThisTurn = true;
    this.addPatronusCharge(6);
    if (this.fiendfyre[r][c] <= 0) {
      this.fiendfyre[r][c] = 0;
      this.cb.audio?.onBomb?.();
      this.spawnRing(r, c, 1.4, '#fb923c');
      this.spawnBurst(r, c, '#f97316', 14);
      this.spawnPopup(r, c, 'DẬP LỬA ĐỊA NGỤC!', '#fed7aa', 14);
      this.addScore(200, r, c, '#fdba74', false, 'blocker');
      this.damageBoss(110);
    } else {
      this.cb.audio?.onIceBreak?.();
      this.spawnBurst(r, c, '#ef4444', 9);
      this.addScore(95, r, c, '#fca5a5', false, 'blocker');
      this.damageBoss(40);
    }
    return true;
  }

  public hitHorcruxAt(r: number, c: number, pierceShield = false): boolean {
    if ((this.horcrux[r]?.[c] || 0) <= 0) return false;
    if (this.horcrux[r][c] >= 4 && !pierceShield) {
      this.cb.audio?.onInvalid?.();
      this.spawnBurst(r, c, '#c084fc', 6);
      this.spawnPopup(r, c, '🛡️ KHIÊN HỒN!', '#e9d5ff', 13);
      return false;
    }
    const wasShielded = this.horcrux[r][c] >= 4;
    this.horcrux[r][c]--;
    this.addPatronusCharge(9);
    if (this.horcrux[r][c] <= 0) {
      this.horcrux[r][c] = 0;
      this.cb.audio?.onHorcruxShatter?.();
      this.vfx.shake = Math.max(this.vfx.shake, 11);
      this.spawnRing(r, c, 2.1, '#10b981');
      this.spawnBurst(r, c, '#a855f7', 22);
      this.spawnPopup(r, c, '💀 DIỆT LINH GIÁ! -600 HP', '#6ee7b7', 16);
      this.addScore(520, r, c, '#6ee7b7', false, 'blocker');
      this.damageBoss(600, true);
    } else if (wasShielded && this.horcrux[r][c] === 3) {
      this.cb.audio?.onIceBreak?.();
      this.spawnRing(r, c, 1.35, '#c084fc');
      this.spawnBurst(r, c, '#e879f9', 14);
      this.spawnPopup(r, c, 'VỠ KHIÊN HỒN!', '#f5d0fe', 14);
      this.addScore(180, r, c, '#f5d0fe', false, 'blocker');
      this.damageBoss(90);
    } else {
      this.cb.audio?.onIceBreak?.();
      this.spawnBurst(r, c, '#34d399', 11);
      this.addScore(140, r, c, '#a7f3d0', false, 'blocker');
      this.damageBoss(75);
    }
    return true;
  }

  private hitCauldronAt(r: number, c: number): void {
    if ((this.cauldron[r]?.[c] || 0) <= 0) return;
    this.cauldron[r][c]--;
    this.cauldronStunnedThisTurn.add(`${r},${c}`);
    this.cauldronCharge[r][c] = 0;
    this.addPatronusCharge(6);
    if (this.cauldron[r][c] <= 0) {
      this.cauldron[r][c] = 0;
      this.cb.audio?.onBomb?.();
      this.spawnRing(r, c, 1.45, '#10b981');
      this.spawnBurst(r, c, '#34d399', 16);
      this.spawnPopup(r, c, 'VỠ VẠC ĐỘC!', '#6ee7b7', 15);
      this.addScore(220, r, c, '#6ee7b7', false, 'blocker');
      this.damageBoss(140);
    } else {
      this.cb.audio?.onIceBreak?.();
      this.spawnBurst(r, c, '#a855f7', 10);
      this.addScore(95, r, c, '#d8b4fe', false, 'blocker');
      this.damageBoss(45);
    }
  }

  private damageAdjacentBlockers(
    clusterCells: Array<{ r: number; c: number }>,
    blockerHitSet: Set<string>
  ): void {
    const dirs: Array<[number, number]> = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const cell of clusterCells) {
      for (const [dr, dc] of dirs) {
        const nr = cell.r + dr;
        const nc = cell.c + dc;
        if (!this.isValidCell(nr, nc) || this.mask[nr]?.[nc] === 0) continue;
        const key = `${nr},${nc}`;
        if (blockerHitSet.has(key)) continue;

        if ((this.horcrux[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.hitHorcruxAt(nr, nc, false);
        } else if ((this.dementor[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.hitDementorAt(nr, nc);
        } else if ((this.decree[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.hitDecreeAt(nr, nc);
        } else if ((this.fiendfyre[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.hitFiendfyreAt(nr, nc);
        } else if ((this.cauldron[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.hitCauldronAt(nr, nc);
        } else if ((this.frosting[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.frosting[nr][nc]--;
          this.addPatronusCharge(5);
          this.damageBoss(35);
          this.cb.audio?.onIceBreak?.();
          this.spawnBurst(nr, nc, '#cbd5e1', 9);
          this.addScore(90, nr, nc, '#e2e8f0', false, 'blocker');
        } else if ((this.chocolate[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.chocolate[nr][nc] = 0;
          this.chocolateBrokenThisTurn = true;
          this.addPatronusCharge(6);
          this.damageBoss(45);
          this.cb.audio?.onIceBreak?.();
          this.spawnBurst(nr, nc, '#a16207', 11);
          this.addScore(120, nr, nc, '#fbbf24', false, 'blocker');
        } else if ((this.petrify[nr]?.[nc] || 0) > 0) {
          blockerHitSet.add(key);
          this.hitPetrifyAt(nr, nc);
        } else if (
          this.grid[nr]?.[nc]?.blocker === 'swirl' &&
          (this.lockGrid[nr]?.[nc] || 0) === 0
        ) {
          blockerHitSet.add(key);
          this.grid[nr][nc] = null;
          this.addPatronusCharge(5);
          this.damageBoss(35);
          this.cb.audio?.onIceBreak?.();
          this.spawnBurst(nr, nc, '#fde047', 10);
          this.addScore(100, nr, nc, '#fde047', false, 'blocker');
        }
      }
    }
  }

  private async clearClusters(
    clusters: MatchCluster[],
    comboStep = 1,
    preferredAnchors: Array<{ r: number; c: number }> = [],
    session = this.sessionId
  ): Promise<void> {
    if (session !== this.sessionId) return;
    this.cb.audio?.onMatch?.(comboStep);
    if (comboStep >= 3) {
      const praise =
        CANDY_COMBO_PRAISES[Math.min(CANDY_COMBO_PRAISES.length - 1, comboStep - 2)];
      this.spawnCenterBanner(`${praise} ×${comboStep}`);
    }

    const triggered = new Set<string>();
    const adjacentBlockerHits = new Set<string>();
    const pendingSpawns: Array<{
      r: number;
      c: number;
      color: number;
      special: CandySpecialType;
    }> = [];
    let decreeWarnedThisWave = false;

    for (const cluster of clusters) {
      let spawnCell: { r: number; c: number } | null = null;
      let suppressedByDecree = false;
      if (cluster.spawnSpecial) {
        suppressedByDecree = cluster.cells.some((ce) => this.isSuppressedByDecree(ce.r, ce.c));
        if (suppressedByDecree) {
          if (!decreeWarnedThisWave) {
            decreeWarnedThisWave = true;
            const mid = cluster.cells[Math.floor(cluster.cells.length / 2)];
            this.spawnPopup(mid.r, mid.c, '📜 CẤM KẾT TINH PHÉP!', '#fbcfe8', 15);
          }
        } else {
          this.specialUsedThisTurn = true;
          this.addPatronusCharge(7);
          for (const anchor of preferredAnchors) {
            const found = cluster.cells.find(
              (ce) => ce.r === anchor.r && ce.c === anchor.c && !this.isCellLocked(ce.r, ce.c)
            );
            if (found) {
              spawnCell = found;
              break;
            }
          }
          if (!spawnCell) {
            const intersection = cluster.cells.find(
              (ce) => ce.count > 1 && !this.isCellLocked(ce.r, ce.c)
            );
            spawnCell =
              intersection ||
              cluster.cells.find((ce) => !this.isCellLocked(ce.r, ce.c)) ||
              cluster.cells[0];
          }
          pendingSpawns.push({
            r: spawnCell.r,
            c: spawnCell.c,
            color: cluster.color,
            special: cluster.spawnSpecial,
          });
        }
      }

      this.damageAdjacentBlockers(cluster.cells, adjacentBlockerHits);

      for (const cell of cluster.cells) {
        this.damageCell(cell.r, cell.c, triggered, false);
      }

      const spawnedSpecialBonus = Boolean(cluster.spawnSpecial && !suppressedByDecree);
      this.addPatronusCharge(cluster.cells.length * 2.8);
      this.damageBoss((cluster.cells.length * 28 + (spawnedSpecialBonus ? 95 : 0)) * comboStep);

      const pts = cluster.cells.length * 60 * comboStep + (spawnedSpecialBonus ? 220 : 0);
      const midCell = cluster.cells[Math.floor(cluster.cells.length / 2)];
      this.addScore(
        pts,
        midCell.r,
        midCell.c,
        CANDY_TILE_TYPES[cluster.color]?.light || '#fde047',
        true,
        'match'
      );
    }

    for (const sp of pendingSpawns) {
      if (!this.isCellLocked(sp.r, sp.c) && !this.hasStaticBlocker(sp.r, sp.c)) {
        if (!this.grid[sp.r]?.[sp.c] || !this.grid[sp.r]?.[sp.c]?.primedWrapped) {
          const piece = this.createPiece(sp.color, sp.c, sp.r, sp.special);
          piece.scale = 1.28;
          this.grid[sp.r][sp.c] = piece;
          this.spawnRing(sp.r, sp.c, 1.15, '#fde047');
        }
      }
    }

    this.emitHudState();
    await this.waitMs(190);
  }

  public damageCell(
    r: number,
    c: number,
    triggeredSet: Set<string>,
    fromSpecialBlast = false,
    bypassLock = false
  ): void {
    if (!this.isValidCell(r, c) || this.mask[r]?.[c] === 0) return;

    if ((this.horcrux[r]?.[c] || 0) > 0) {
      const hxKey = `hx:${r},${c}`;
      if (!triggeredSet.has(hxKey)) {
        triggeredSet.add(hxKey);
        this.hitHorcruxAt(r, c, fromSpecialBlast || bypassLock);
      }
      return;
    }

    if ((this.dementor[r]?.[c] || 0) > 0) {
      const dmKey = `dm:${r},${c}`;
      if (!triggeredSet.has(dmKey)) {
        triggeredSet.add(dmKey);
        this.hitDementorAt(r, c);
      }
      return;
    }

    if ((this.decree[r]?.[c] || 0) > 0) {
      const dcKey = `dc:${r},${c}`;
      if (!triggeredSet.has(dcKey)) {
        triggeredSet.add(dcKey);
        this.hitDecreeAt(r, c);
      }
      return;
    }

    if ((this.fiendfyre[r]?.[c] || 0) > 0) {
      const ffKey = `ff:${r},${c}`;
      if (!triggeredSet.has(ffKey)) {
        triggeredSet.add(ffKey);
        this.hitFiendfyreAt(r, c);
      }
      return;
    }

    if ((this.cauldron[r]?.[c] || 0) > 0) {
      const caKey = `ca:${r},${c}`;
      if (!triggeredSet.has(caKey)) {
        triggeredSet.add(caKey);
        this.hitCauldronAt(r, c);
      }
      return;
    }

    if ((this.frosting[r]?.[c] || 0) > 0) {
      const fKey = `fr:${r},${c}`;
      if (!triggeredSet.has(fKey)) {
        triggeredSet.add(fKey);
        this.frosting[r][c]--;
        this.addPatronusCharge(5);
        this.damageBoss(35);
        this.cb.audio?.onIceBreak?.();
        this.spawnBurst(r, c, '#cbd5e1', 10);
        this.addScore(90, r, c, '#e2e8f0', false, 'blocker');
      }
      return;
    }

    if ((this.chocolate[r]?.[c] || 0) > 0) {
      const cKey = `ch:${r},${c}`;
      if (!triggeredSet.has(cKey)) {
        triggeredSet.add(cKey);
        this.chocolate[r][c] = 0;
        this.chocolateBrokenThisTurn = true;
        this.addPatronusCharge(6);
        this.damageBoss(45);
        this.cb.audio?.onIceBreak?.();
        this.spawnBurst(r, c, '#a16207', 11);
        this.addScore(120, r, c, '#fbbf24', false, 'blocker');
      }
      return;
    }

    if ((this.lockGrid[r]?.[c] || 0) > 0) {
      const lkKey = `lk:${r},${c}`;
      if (!triggeredSet.has(lkKey)) {
        triggeredSet.add(lkKey);
        if (bypassLock) {
          this.lockGrid[r][c] = 0;
          this.cb.audio?.onKeyUnlock?.();
          this.spawnBurst(r, c, '#fde047', 12);
          this.spawnPopup(r, c, 'MỞ KHOÁ!', '#fef08a', 14);
          this.addScore(150, r, c, '#fef08a', false, 'blocker');
          this.damageBoss(65);
        } else {
          this.spawnBurst(r, c, '#fbbf24', 4);
        }
      }
      return;
    }

    if ((this.petrify[r]?.[c] || 0) > 0) {
      const ptKey = `pt:${r},${c}`;
      if (!triggeredSet.has(ptKey)) {
        triggeredSet.add(ptKey);
        this.hitPetrifyAt(r, c);
      }
      return;
    }

    if ((this.ice[r]?.[c] || 0) > 0) {
      const iKey = `ic:${r},${c}`;
      if (!triggeredSet.has(iKey)) {
        triggeredSet.add(iKey);
        this.ice[r][c]--;
        this.addPatronusCharge(5);
        this.damageBoss(30);
        this.cb.audio?.onIceBreak?.();
        this.spawnBurst(r, c, '#bae6fd', 10);
      }
      if (fromSpecialBlast || this.ice[r][c] > 0) return;
    }

    const piece = this.grid[r]?.[c];
    const jellyKey = `j:${r},${c}`;
    if (!piece) {
      if (fromSpecialBlast && !triggeredSet.has(jellyKey)) {
        triggeredSet.add(jellyKey);
        this.breakJelly(r, c);
      }
      return;
    }

    if (piece.isIngredient) {
      if (fromSpecialBlast && !triggeredSet.has(jellyKey)) {
        triggeredSet.add(jellyKey);
        this.breakJelly(r, c);
      }
      return;
    }

    if (piece.primedWrapped) return;

    if (piece.blocker === 'swirl') {
      const sKey = `sw:${r},${c}`;
      if (!triggeredSet.has(sKey)) {
        triggeredSet.add(sKey);
        this.grid[r][c] = null;
        this.addPatronusCharge(5);
        this.damageBoss(35);
        this.cb.audio?.onIceBreak?.();
        this.spawnBurst(r, c, '#fde047', 10);
        this.addScore(100, r, c, '#fde047', false, 'blocker');
      }
      return;
    }

    const key = `${r},${c}`;
    const wasSpecial = piece.special;
    const pieceColor = piece.color;
    const hadKey = piece.hasKey;

    if (wasSpecial !== 'color_bomb' && pieceColor >= 0) {
      this.collected[pieceColor] = (this.collected[pieceColor] || 0) + 1;
    }
    this.grid[r][c] = null;
    this.ice[r][c] = 0;

    if (hadKey) {
      this.unlockWithSugarKey(r, c);
    }

    if (!triggeredSet.has(jellyKey)) {
      triggeredSet.add(jellyKey);
      this.breakJelly(r, c);
    }
    this.spawnBurst(r, c, CANDY_TILE_TYPES[pieceColor]?.light || '#fde047', 11);

    if (wasSpecial && !triggeredSet.has(key)) {
      triggeredSet.add(key);
      this.recordSpecialTriggered(wasSpecial);
      this.triggerSpecialPiece(r, c, pieceColor, wasSpecial, triggeredSet);
    }
  }

  private breakJelly(r: number, c: number): void {
    if ((this.jelly[r]?.[c] || 0) > 0) {
      this.jelly[r][c]--;
      this.addPatronusCharge(4);
      this.damageBoss(25);
      this.spawnBurst(r, c, '#d8b4fe', 9);
      this.addScore(80, r, c, '#e9d5ff', false, 'blocker');
    }
  }

  private cloneSpecialChainGuard(src: Set<string>): Set<string> {
    const next = new Set<string>();
    for (const k of src) {
      if (!k.includes(':')) next.add(k);
    }
    return next;
  }

  private triggerSeekerTakeoff(r: number, c: number, triggeredSet: Set<string>): void {
    this.spawnRing(r, c, 1.35, '#fde047');
    const ortho: Array<[number, number]> = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of ortho) {
      const nr = r + dr;
      const nc = c + dc;
      if (this.isValidCell(nr, nc) && this.mask[nr]?.[nc] === 1) {
        this.damageCell(nr, nc, triggeredSet, true);
      }
    }
  }

  private detonateRadialBlast(
    r: number,
    c: number,
    gridRadius: number,
    maxHypot: number,
    ringColor: string,
    shakePower: number,
    bossDmg: number,
    baseScore: number,
    triggeredSet: Set<string>
  ): void {
    this.cb.audio?.onBomb?.();
    this.vfx.shake = Math.max(this.vfx.shake, shakePower);
    this.spawnRing(r, c, gridRadius + 0.85, ringColor);
    this.spawnBurst(r, c, ringColor, Math.min(24, 10 + gridRadius * 4));
    for (let dr = -gridRadius; dr <= gridRadius; dr++) {
      for (let dc = -gridRadius; dc <= gridRadius; dc++) {
        if (Math.hypot(dr, dc) > maxHypot) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (this.isValidCell(nr, nc) && this.mask[nr]?.[nc] === 1) {
          this.damageCell(nr, nc, triggeredSet, true);
        }
      }
    }
    this.damageBoss(bossDmg);
    this.addScore(baseScore, r, c, ringColor, false, 'special');
  }

  private triggerSpecialPiece(
    r: number,
    c: number,
    color: number,
    special: CandySpecialType,
    triggeredSet: Set<string>
  ): void {
    const beamColor = CANDY_TILE_TYPES[color]?.light || '#fde047';
    if (special === 'firecracker') {
      this.detonateRadialBlast(r, c, 1, 1.45, '#facc15', 7, 135, 340, triggeredSet);
    } else if (special === 'bomb' || special === 'wrapped') {
      this.detonateRadialBlast(r, c, 2, 2.25, '#fb923c', 10, 210, 560, triggeredSet);
    } else if (special === 'dynamite') {
      this.detonateRadialBlast(r, c, 3, 3.2, '#f97316', 13, 310, 820, triggeredSet);
    } else if (special === 'tnt') {
      this.detonateRadialBlast(r, c, 4, 4.25, '#ef4444', 16, 430, 1150, triggeredSet);
    } else if (special === 'striped_h') {
      this.cb.audio?.onBeam?.();
      this.vfx.shake = Math.max(this.vfx.shake, 6);
      this.fireRowBeam(r, c, 0.68, beamColor, triggeredSet, true);
      this.damageBoss(130);
      this.addScore(320, r, c, beamColor, false, 'special');
    } else if (special === 'striped_v') {
      this.cb.audio?.onBeam?.();
      this.vfx.shake = Math.max(this.vfx.shake, 6);
      this.fireColBeam(c, r, 0.68, beamColor, triggeredSet, true);
      this.damageBoss(130);
      this.addScore(320, r, c, beamColor, false, 'special');
    } else if (special === 'seeker') {
      this.cb.audio?.onSeeker?.();
      this.triggerSeekerTakeoff(r, c, triggeredSet);
      const landingGuard = this.cloneSpecialChainGuard(triggeredSet);
      const [target] = this.pickBestSeekerTargets(1, landingGuard);
      if (target) {
        this.spawnSeekerVfx(r, c, target.r, target.c, beamColor);
        this.damageCell(target.r, target.c, landingGuard, true);
        for (const k of landingGuard) {
          if (!k.includes(':')) triggeredSet.add(k);
        }
      }
      this.damageBoss(145);
      this.addScore(380, r, c, '#fde047', false, 'special');
    } else if (special === 'color_bomb') {
      this.cb.audio?.onColorBomb?.();
      const targetColors = this.pickRainbowTargetColors();
      const targetColorSet = new Set<number>(targetColors);
      for (let rr = 0; rr < this.size; rr++) {
        for (let cc = 0; cc < this.size; cc++) {
          const tp = this.grid[rr]?.[cc];
          if (
            this.mask[rr]?.[cc] === 1 &&
            !this.isCellLocked(rr, cc) &&
            !this.hasStaticBlocker(rr, cc) &&
            tp &&
            this.isMatchablePiece(tp) &&
            targetColorSet.has(tp.color)
          ) {
            this.spawnArc(
              r,
              c,
              rr,
              cc,
              CANDY_TILE_TYPES[tp.color]?.light || '#fde047'
            );
            this.damageCell(rr, cc, triggeredSet, true);
          }
        }
      }
      this.damageBoss(targetColors.length >= 2 ? 380 : 250);
      this.addScore(targetColors.length >= 2 ? 1050 : 720, r, c, '#fde047', false, 'special');
    }
  }

  private fireRowBeam(
    r: number,
    originC = Math.floor(this.size / 2),
    widthFactor = 0.68,
    color = '#fde047',
    triggeredSet = new Set<string>(),
    stopOnSwirl = true
  ): void {
    let cStart = 0;
    let cEnd = this.size - 1;

    if (this.isValidCell(r, originC) && this.mask[r]?.[originC] === 1) {
      this.damageCell(r, originC, triggeredSet, true);
    }

    for (let cc = originC - 1; cc >= 0; cc--) {
      if (this.mask[r]?.[cc] === 0) continue;
      const hitSwirl = stopOnSwirl && this.grid[r]?.[cc]?.blocker === 'swirl';
      this.damageCell(r, cc, triggeredSet, true);
      if (hitSwirl) {
        cStart = cc;
        break;
      }
    }

    for (let cc = originC + 1; cc < this.size; cc++) {
      if (this.mask[r]?.[cc] === 0) continue;
      const hitSwirl = stopOnSwirl && this.grid[r]?.[cc]?.blocker === 'swirl';
      this.damageCell(r, cc, triggeredSet, true);
      if (hitSwirl) {
        cEnd = cc;
        break;
      }
    }

    this.vfx.beams.push({
      dir: 'h',
      r,
      c: originC,
      cStart,
      cEnd,
      widthFactor,
      color,
      life: 0.28,
      maxLife: 0.28,
    });
  }

  private fireColBeam(
    c: number,
    originR = Math.floor(this.size / 2),
    widthFactor = 0.68,
    color = '#fde047',
    triggeredSet = new Set<string>(),
    stopOnSwirl = true
  ): void {
    let rStart = 0;
    let rEnd = this.size - 1;

    if (this.isValidCell(originR, c) && this.mask[originR]?.[c] === 1) {
      this.damageCell(originR, c, triggeredSet, true);
    }

    for (let rr = originR - 1; rr >= 0; rr--) {
      if (this.mask[rr]?.[c] === 0) continue;
      const hitSwirl = stopOnSwirl && this.grid[rr]?.[c]?.blocker === 'swirl';
      this.damageCell(rr, c, triggeredSet, true);
      if (hitSwirl) {
        rStart = rr;
        break;
      }
    }

    for (let rr = originR + 1; rr < this.size; rr++) {
      if (this.mask[rr]?.[c] === 0) continue;
      const hitSwirl = stopOnSwirl && this.grid[rr]?.[c]?.blocker === 'swirl';
      this.damageCell(rr, c, triggeredSet, true);
      if (hitSwirl) {
        rEnd = rr;
        break;
      }
    }

    this.vfx.beams.push({
      dir: 'v',
      r: originR,
      c,
      rStart,
      rEnd,
      widthFactor,
      color,
      life: 0.28,
      maxLife: 0.28,
    });
  }

  public pickBestSeekerTargets(
    count = 1,
    excludeSet = new Set<string>()
  ): Array<{ r: number; c: number; priority: number }> {
    const neededColors = new Set<number>();
    let needJelly = false;
    let needFrosting = false;
    let needIce = false;
    let needChoco = false;
    let needCauldron = false;
    let needPetrify = false;
    let needDementor = false;
    let needDecree = false;
    let needFiendfyre = false;
    let needHorcrux = false;
    const remLocks = this.countGridSum(this.lockGrid);

    for (const obj of this.getObjectivesProgress()) {
      if (obj.completed) continue;
      if (obj.type === 'collect' && obj.tileId !== undefined) neededColors.add(obj.tileId);
      if (obj.type === 'jelly') needJelly = true;
      if (obj.type === 'frosting') needFrosting = true;
      if (obj.type === 'ice') needIce = true;
      if (obj.type === 'chocolate') needChoco = true;
      if (obj.type === 'cauldron') needCauldron = true;
      if (obj.type === 'petrify') needPetrify = true;
      if (obj.type === 'dementor') needDementor = true;
      if (obj.type === 'decree') needDecree = true;
      if (obj.type === 'fiendfyre') needFiendfyre = true;
      if (obj.type === 'horcrux') needHorcrux = true;
    }

    const candidates: Array<{ r: number; c: number; priority: number }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.mask[r]?.[c] === 0) continue;
        if (excludeSet.has(`${r},${c}`)) continue;
        if ((this.lockGrid[r]?.[c] || 0) > 0) continue;
        const p = this.grid[r]?.[c];
        if (p?.isIngredient && (this.jelly[r]?.[c] || 0) === 0) continue;
        if (p?.primedWrapped) continue;

        let priority = Math.random() * 25;
        if (p?.bombTimer !== null && p?.bombTimer !== undefined) {
          priority += 1200 + Math.max(0, 20 - p.bombTimer) * 25;
        } else if ((this.horcrux[r]?.[c] || 0) > 0) {
          priority += (this.horcrux[r][c] >= 4 ? 1140 : 1060) + (needHorcrux ? 80 : 0);
        } else if ((this.fiendfyre[r]?.[c] || 0) > 0) {
          priority += needFiendfyre ? 1040 : 930;
        } else if (remLocks > 0 && p?.hasKey) {
          priority += 980;
        } else if ((this.dementor[r]?.[c] || 0) > 0) {
          priority += needDementor ? 970 : 870;
        } else if ((this.cauldron[r]?.[c] || 0) > 0) {
          priority += needCauldron ? 950 : 810;
        } else if ((this.decree[r]?.[c] || 0) > 0) {
          priority += needDecree ? 940 : 820;
        } else if ((this.chocolate[r]?.[c] || 0) > 0) {
          priority += needChoco ? 920 : 760;
        } else if ((this.petrify[r]?.[c] || 0) > 0) {
          priority += needPetrify ? 900 : 720;
        } else if ((this.frosting[r]?.[c] || 0) > 0) {
          priority += needFrosting ? 880 : 620;
        } else if ((this.ice[r]?.[c] || 0) > 0) {
          priority += needIce ? 860 : 580;
        } else if ((this.jelly[r]?.[c] || 0) > 0) {
          priority += needJelly ? 840 : 480;
        } else if (p?.blocker === 'swirl') {
          priority += 520;
        } else if (p && neededColors.has(p.color)) {
          priority += 450;
        } else if (p) {
          priority += 100;
        } else {
          continue;
        }

        candidates.push({ r, c, priority });
      }
    }

    candidates.sort((a, b) => b.priority - a.priority);
    return candidates.slice(0, count);
  }

  private spawnSeekerVfx(r1: number, c1: number, r2: number, c2: number, color = '#fde047'): void {
    this.vfx.seekers.push({ r1, c1, r2, c2, color, life: 0.28, maxLife: 0.28 });
  }

  private extractIngredientsAtExits(): boolean {
    if (this.ingredientExitCells.length === 0) return false;
    let extracted = false;
    for (const ex of this.ingredientExitCells) {
      const p = this.grid[ex.r]?.[ex.c];
      if (p?.isIngredient) {
        this.grid[ex.r][ex.c] = null;
        this.ingredientsCollected++;
        extracted = true;
        this.cb.audio?.onColorBomb?.();
        this.addPatronusCharge(15);
        this.damageBoss(180);
        this.spawnRing(ex.r, ex.c, 1.6, '#10b981');
        this.spawnBurst(ex.r, ex.c, '#34d399', 18);
        this.spawnPopup(ex.r, ex.c, 'THU HỒI ĐÁ PHÙ THỦY!', '#6ee7b7', 16);
        this.addScore(1000, ex.r, ex.c, '#34d399', false);
      }
    }
    if (extracted) this.emitHudState();
    return extracted;
  }

  private countIngredientsOnBoard(): number {
    let n = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r]?.[c]?.isIngredient) n++;
      }
    }
    return n;
  }

  private countBombsOnBoard(): number {
    let n = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p && p.bombTimer !== null && p.bombTimer !== undefined) n++;
      }
    }
    return n;
  }

  private createSpawnedPiece(col: number, targetR: number): CandyInternalPiece {
    if (
      this.ingredientTarget > 0 &&
      this.ingredientsSpawned < this.ingredientTarget &&
      !this.isExitCell(targetR, col) &&
      (this.ingredientSpawnCols.length === 0 || this.ingredientSpawnCols.includes(col))
    ) {
      const remainingToSpawn = this.ingredientTarget - this.ingredientsSpawned;
      const urgent = this.movesLeft <= remainingToSpawn * 3 + 3;
      const activeIng = this.countIngredientsOnBoard();
      const maxSimultaneous = urgent
        ? this.ingredientTarget - this.ingredientsCollected
        : Math.min(2, this.ingredientTarget - this.ingredientsCollected);
      const dropChance = urgent ? 0.9 : 0.32;
      if (activeIng === 0 || (activeIng < maxSimultaneous && Math.random() < dropChance)) {
        this.ingredientsSpawned++;
        return this.createIngredientPiece(col, targetR);
      }
    }

    const color = Math.floor(Math.random() * this.numColors);
    const piece = this.createPiece(color, col, targetR);
    if (this.pendingBombSpawns > 0 && this.bombConfig && !this.ended) {
      this.pendingBombSpawns--;
      piece.bombTimer = this.bombConfig.startTimer;
    } else if (this.countGridSum(this.lockGrid) > 0 && !this.ended) {
      const keysActive = this.countKeysOnBoard();
      if (keysActive === 0 || (keysActive < 2 && Math.random() < 0.24)) {
        piece.hasKey = true;
      }
    }
    return piece;
  }

  private isOpenEmpty(r: number, c: number): boolean {
    return (
      this.isValidCell(r, c) &&
      this.mask[r]?.[c] === 1 &&
      !this.hasStaticBlocker(r, c) &&
      !this.isCellLocked(r, c) &&
      this.grid[r]?.[c] === null
    );
  }

  private canPieceFall(r: number, c: number): boolean {
    return (
      this.isValidCell(r, c) &&
      this.mask[r]?.[c] === 1 &&
      !this.hasStaticBlocker(r, c) &&
      !this.isCellLocked(r, c) &&
      this.grid[r]?.[c] !== null
    );
  }

  public async applyGravityAndRefill(session = this.sessionId): Promise<void> {
    if (session !== this.sessionId) return;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r]?.[c]) {
          if ((this.ice[r]?.[c] || 0) > 0) this.ice[r][c] = 0;
          if ((this.lockGrid[r]?.[c] || 0) > 0) this.lockGrid[r][c] = 0;
          if ((this.petrify[r]?.[c] || 0) > 0) this.petrify[r][c] = 0;
        }
      }
    }

    const startCoords = new Map<number, { x: number; y: number }>();
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p) {
          p.x = c;
          p.y = r;
          startCoords.set(p.id, { x: c, y: r });
        }
      }
    }

    const colSpawnCounts = new Array<number>(this.size).fill(0);
    this.extractIngredientsAtExits();

    let portalPlayed = false;
    const maxTicks = this.size * 4 + 14;

    for (let tick = 0; tick < maxTicks; tick++) {
      let moved = false;

      for (const portal of this.portals) {
        const { from, to, color } = portal;
        if (this.canPieceFall(from.r, from.c) && this.isOpenEmpty(to.r, to.c)) {
          const p = this.grid[from.r][from.c]!;
          this.grid[to.r][to.c] = p;
          this.grid[from.r][from.c] = null;
          startCoords.set(p.id, { x: to.c, y: to.r - 0.65 });
          this.spawnBurst(from.r, from.c, color || '#10b981', 5);
          this.spawnBurst(to.r, to.c, color || '#10b981', 5);
          if (!portalPlayed) {
            this.cb.audio?.onPortal?.();
            portalPlayed = true;
          }
          moved = true;
        }
      }

      for (let r = this.size - 2; r >= 0; r--) {
        for (let c = 0; c < this.size; c++) {
          if (!this.canPieceFall(r, c)) continue;

          let targetR = -1;
          if (this.isOpenEmpty(r + 1, c)) {
            targetR = r + 1;
          } else if (this.mask[r + 1]?.[c] === 0) {
            for (let rr = r + 2; rr < this.size; rr++) {
              if (this.mask[rr]?.[c] === 0) continue;
              if (this.isOpenEmpty(rr, c)) targetR = rr;
              break;
            }
          }

          if (targetR !== -1) {
            this.grid[targetR][c] = this.grid[r][c];
            this.grid[r][c] = null;
            moved = true;
          }
        }
      }

      for (let r = this.size - 2; r >= 0; r--) {
        for (let c = 0; c < this.size; c++) {
          if (!this.canPieceFall(r, c)) continue;
          const dirs = (r + c + tick) % 2 === 0 ? [-1, 1] : [1, -1];
          for (const dc of dirs) {
            const nc = c + dc;
            if (!this.isOpenEmpty(r + 1, nc)) continue;
            if (this.canPieceFall(r, nc)) continue;
            this.grid[r + 1][nc] = this.grid[r][c];
            this.grid[r][c] = null;
            moved = true;
            break;
          }
        }
      }

      for (let c = 0; c < this.size; c++) {
        let topR = -1;
        for (let r = 0; r < this.size; r++) {
          if (this.mask[r]?.[c] === 1) {
            topR = r;
            break;
          }
        }
        if (topR !== -1 && this.isOpenEmpty(topR, c)) {
          colSpawnCounts[c]++;
          const startY = topR - colSpawnCounts[c] - 0.35;
          const newPiece = this.createSpawnedPiece(c, topR);
          this.grid[topR][c] = newPiece;
          startCoords.set(newPiece.id, { x: c, y: startY });
          moved = true;
        }
      }

      if (this.extractIngredientsAtExits()) {
        moved = true;
      }

      if (!moved) break;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.isOpenEmpty(r, c)) {
          const p = this.createPiece(Math.floor(Math.random() * this.numColors), c, r);
          this.grid[r][c] = p;
          startCoords.set(p.id, { x: c, y: r - 0.7 });
        }
      }
    }
    this.extractIngredientsAtExits();

    if (this.countGridSum(this.lockGrid) > 0 && this.countKeysOnBoard() === 0) {
      this.ensureSugarKeysOnBoard(1);
    }

    const animItems: Array<{
      piece: CandyInternalPiece;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
    }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (!p) continue;
        const st = startCoords.get(p.id) || { x: c, y: r };
        if (Math.abs(st.x - c) > 0.01 || Math.abs(st.y - r) > 0.01) {
          p.x = st.x;
          p.y = st.y;
          animItems.push({ piece: p, fromX: st.x, fromY: st.y, toX: c, toY: r });
        } else {
          p.x = c;
          p.y = r;
        }
      }
    }

    if (animItems.length === 0) return;

    if (!this.instantAnimations && this.renderer) {
      const maxDist = Math.max(
        ...animItems.map((m) => Math.hypot(m.toX - m.fromX, m.toY - m.fromY))
      );
      const duration = Math.min(300, Math.max(140, maxDist * 42));
      const start = nowMs();

      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (session !== this.sessionId) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / duration);
          const ease = 1 - Math.pow(1 - t, 2.35);
          for (const m of animItems) {
            m.piece.x = m.fromX + (m.toX - m.fromX) * ease;
            m.piece.y = m.fromY + (m.toY - m.fromY) * ease;
            if (m.piece.scale > 1 && !m.piece.primedWrapped) {
              m.piece.scale = 1 + (m.piece.scale - 1) * (1 - t);
            }
          }
          if (t < 1) nextAnimFrame(step);
          else resolve();
        };
        nextAnimFrame(step);
      });
    }

    if (session !== this.sessionId) return;
    for (const m of animItems) {
      m.piece.x = m.toX;
      m.piece.y = m.toY;
      if (!m.piece.primedWrapped) m.piece.scale = 1;
    }
  }

  private async shiftConveyorBelts(session = this.sessionId): Promise<boolean> {
    if (!this.conveyorLoops || this.conveyorLoops.length === 0) return false;
    const animMoves: Array<{
      piece: CandyInternalPiece;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
    }> = [];

    for (const loop of this.conveyorLoops) {
      const movable = loop.filter(
        (pt) =>
          this.mask[pt.r]?.[pt.c] === 1 &&
          !this.hasStaticBlocker(pt.r, pt.c) &&
          !this.isCellLocked(pt.r, pt.c) &&
          this.grid[pt.r]?.[pt.c]
      );
      if (movable.length < 2) continue;

      const snapshot = movable.map((pt) => this.grid[pt.r][pt.c]);
      for (let i = 0; i < movable.length; i++) {
        const from = movable[i];
        const to = movable[(i + 1) % movable.length];
        const piece = snapshot[i];
        this.grid[to.r][to.c] = piece;
        if (piece) {
          piece.x = from.c;
          piece.y = from.r;
          animMoves.push({ piece, fromX: from.c, fromY: from.r, toX: to.c, toY: to.r });
        }
      }
    }

    if (animMoves.length === 0) return false;
    this.cb.audio?.onConveyor?.();

    if (!this.instantAnimations && this.renderer) {
      const duration = 150;
      const start = nowMs();
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (session !== this.sessionId) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / duration);
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          for (const m of animMoves) {
            m.piece.x = m.fromX + (m.toX - m.fromX) * ease;
            m.piece.y = m.fromY + (m.toY - m.fromY) * ease;
          }
          if (t < 1) nextAnimFrame(step);
          else resolve();
        };
        nextAnimFrame(step);
      });
    }

    if (session !== this.sessionId) return true;
    for (const m of animMoves) {
      m.piece.x = m.toX;
      m.piece.y = m.toY;
    }

    if (this.extractIngredientsAtExits()) {
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return true;
    }
    if (this.findMatchClusters().length > 0) {
      await this.resolveAllCascades(1, session);
    }
    return true;
  }

  public findAnyValidMove(
    preferSpecial = this.house === 'ravenclaw'
  ): [{ r: number; c: number }, { r: number; c: number }] | null {
    const dirs: Array<[number, number]> = [
      [0, 1],
      [1, 0],
    ];
    let fallbackPair: [{ r: number; c: number }, { r: number; c: number }] | null = null;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (
          this.mask[r]?.[c] === 0 ||
          this.isCellLocked(r, c) ||
          this.hasStaticBlocker(r, c) ||
          !this.grid[r]?.[c]
        ) {
          continue;
        }
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            !this.isValidCell(nr, nc) ||
            this.mask[nr]?.[nc] === 0 ||
            this.isCellLocked(nr, nc) ||
            this.hasStaticBlocker(nr, nc) ||
            !this.grid[nr]?.[nc]
          ) {
            continue;
          }
          const pA = this.grid[r][c]!;
          const pB = this.grid[nr][nc]!;

          if (pA.special && pB.special) {
            return [
              { r, c },
              { r: nr, c: nc },
            ];
          }
          if (pA.special || pB.special) {
            if (!fallbackPair) {
              fallbackPair = [
                { r, c },
                { r: nr, c: nc },
              ];
            }
            continue;
          }

          this.grid[r][c] = pB;
          this.grid[nr][nc] = pA;
          const m1 = this.quickCheckMatchQualityAt(r, c);
          const m2 = this.quickCheckMatchQualityAt(nr, nc);
          this.grid[r][c] = pA;
          this.grid[nr][nc] = pB;

          const bestQ = Math.max(m1, m2);
          if (bestQ > 0) {
            const pair: [{ r: number; c: number }, { r: number; c: number }] = [
              { r, c },
              { r: nr, c: nc },
            ];
            if (!preferSpecial || bestQ >= 2) return pair;
            if (!fallbackPair) fallbackPair = pair;
          }
        }
      }
    }

    if (!fallbackPair) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const p = this.grid[r]?.[c];
          if (
            this.mask[r]?.[c] === 1 &&
            !this.isCellLocked(r, c) &&
            !this.hasStaticBlocker(r, c) &&
            p?.special &&
            !p.isIngredient &&
            !p.blocker
          ) {
            return [
              { r, c },
              { r, c },
            ];
          }
        }
      }
    }

    return fallbackPair;
  }

  private quickCheckMatchQualityAt(r: number, c: number): number {
    if (!this.isCellMatchable(r, c)) return 0;
    const col = this.grid[r]?.[c]?.color;
    if (col === undefined) return 0;

    let h = 1;
    for (
      let cc = c - 1;
      cc >= 0 && this.isCellMatchable(r, cc) && this.grid[r]?.[cc]?.color === col;
      cc--
    ) {
      h++;
    }
    for (
      let cc = c + 1;
      cc < this.size && this.isCellMatchable(r, cc) && this.grid[r]?.[cc]?.color === col;
      cc++
    ) {
      h++;
    }

    let v = 1;
    for (
      let rr = r - 1;
      rr >= 0 && this.isCellMatchable(rr, c) && this.grid[rr]?.[c]?.color === col;
      rr--
    ) {
      v++;
    }
    for (
      let rr = r + 1;
      rr < this.size && this.isCellMatchable(rr, c) && this.grid[rr]?.[c]?.color === col;
      rr++
    ) {
      v++;
    }

    if (h >= 4 || v >= 4 || (h >= 3 && v >= 3)) return 2;

    for (const dr of [-1, 0]) {
      for (const dc of [-1, 0]) {
        const r0 = r + dr;
        const c0 = c + dc;
        if (r0 < 0 || c0 < 0 || r0 + 1 >= this.size || c0 + 1 >= this.size) continue;
        if (
          this.isCellMatchable(r0, c0) &&
          this.isCellMatchable(r0, c0 + 1) &&
          this.isCellMatchable(r0 + 1, c0) &&
          this.isCellMatchable(r0 + 1, c0 + 1) &&
          this.grid[r0]?.[c0]?.color === col &&
          this.grid[r0]?.[c0 + 1]?.color === col &&
          this.grid[r0 + 1]?.[c0]?.color === col &&
          this.grid[r0 + 1]?.[c0 + 1]?.color === col
        ) {
          return 2;
        }
      }
    }

    if (h >= 3 || v >= 3) return 1;
    return 0;
  }

  private quickCheckMatchAt(r: number, c: number): boolean {
    return this.quickCheckMatchQualityAt(r, c) > 0;
  }

  private shuffleInternal(avoidImmediateMatches = true): void {
    const coords: Array<{ r: number; c: number }> = [];
    const pieces: CandyInternalPiece[] = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          this.mask[r]?.[c] === 1 &&
          !this.isCellLocked(r, c) &&
          !this.hasStaticBlocker(r, c) &&
          p &&
          !p.isIngredient &&
          !p.blocker
        ) {
          coords.push({ r, c });
          pieces.push(p);
        }
      }
    }
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    coords.forEach((pos, idx) => {
      const p = pieces[idx];
      this.grid[pos.r][pos.c] = p;
      p.x = pos.c;
      p.y = pos.r;
    });

    if (avoidImmediateMatches) {
      for (let pass = 0; pass < 18; pass++) {
        const clusters = this.findMatchClusters();
        if (clusters.length === 0) break;
        let changed = false;
        for (const cl of clusters) {
          for (const cell of cl.cells) {
            const p = this.grid[cell.r]?.[cell.c];
            if (
              !p ||
              this.isCellLocked(cell.r, cell.c) ||
              p.special ||
              !this.isMatchablePiece(p)
            ) {
              continue;
            }
            if (!this.quickCheckMatchAt(cell.r, cell.c)) continue;
            const startCol = Math.floor(Math.random() * this.numColors);
            for (let k = 0; k < this.numColors; k++) {
              const candidate = (startCol + k) % this.numColors;
              if (candidate === p.color) continue;
              p.color = candidate;
              if (!this.quickCheckMatchAt(cell.r, cell.c)) {
                changed = true;
                break;
              }
            }
          }
        }
        if (!changed) break;
      }
    }
  }

  private grantEmergencyMovePiece(): void {
    const dirs: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          !p ||
          p.isIngredient ||
          p.blocker ||
          this.mask[r]?.[c] === 0 ||
          this.isCellLocked(r, c) ||
          this.hasStaticBlocker(r, c)
        ) {
          continue;
        }
        const hasNeighbor = dirs.some(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          return (
            this.isValidCell(nr, nc) &&
            this.mask[nr]?.[nc] === 1 &&
            !this.isCellLocked(nr, nc) &&
            !this.hasStaticBlocker(nr, nc) &&
            this.grid[nr]?.[nc] !== null
          );
        });
        if (hasNeighbor) {
          if (p.color < 0) p.color = 0;
          p.special = 'seeker';
          return;
        }
      }
    }

    for (const allowBossRelics of [false, true]) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const p = this.grid[r]?.[c];
          if (
            !p ||
            p.isIngredient ||
            p.blocker ||
            this.mask[r]?.[c] === 0 ||
            this.isCellLocked(r, c)
          ) {
            continue;
          }
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (!this.isValidCell(nr, nc) || this.mask[nr]?.[nc] === 0) continue;
            if (
              !allowBossRelics &&
              ((this.horcrux[nr]?.[nc] || 0) > 0 ||
                (this.dementor[nr]?.[nc] || 0) > 0 ||
                (this.decree[nr]?.[nc] || 0) > 0 ||
                (this.cauldron[nr]?.[nc] || 0) > 0)
            ) {
              continue;
            }
            this.chocolate[nr][nc] = 0;
            this.frosting[nr][nc] = 0;
            this.cauldron[nr][nc] = 0;
            this.dementor[nr][nc] = 0;
            this.decree[nr][nc] = 0;
            this.fiendfyre[nr][nc] = 0;
            this.horcrux[nr][nc] = 0;
            this.ice[nr][nc] = 0;
            this.lockGrid[nr][nc] = 0;
            this.petrify[nr][nc] = 0;
            if (!this.grid[nr]?.[nc]) {
              this.grid[nr][nc] = this.createPiece(
                Math.floor(Math.random() * this.numColors),
                nc,
                nr
              );
            }
            if (p.color < 0) p.color = 0;
            p.special = 'seeker';
            return;
          }
        }
      }
    }
  }

  private async performShuffleAnimation(session = this.sessionId): Promise<void> {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p && !this.isCellLocked(r, c) && !p.isIngredient && !p.blocker) p.scale = 0.25;
      }
    }
    await this.waitMs(150);
    if (session !== this.sessionId) return;
    let tries = 0;
    do {
      this.shuffleInternal(true);
      tries++;
    } while (!this.findAnyValidMove(false) && tries < 25);

    if (!this.findAnyValidMove(false)) {
      this.grantEmergencyMovePiece();
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p) p.scale = 1;
      }
    }
    await this.waitMs(130);
  }

  private spreadOneChocolate(): boolean {
    if (this.chocolateBrokenThisTurn) return false;
    if (this.house === 'slytherin' && this.movesUsed % 2 === 1) return false;

    const totalChoco = this.countGridSum(this.chocolate);
    if (totalChoco <= 0) return false;

    const dirs: Array<[number, number]> = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const candidates: Array<{ r: number; c: number }> = [];
    const seen = new Set<string>();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.chocolate[r]?.[c] || 0) <= 0) continue;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (!this.isValidCell(nr, nc) || this.mask[nr]?.[nc] === 0) continue;
          if (
            nr === 0 ||
            this.isExitCell(nr, nc) ||
            this.isPortalCell(nr, nc) ||
            this.isConveyorCell(nr, nc)
          ) {
            continue;
          }
          if (this.hasStaticBlocker(nr, nc) || this.isCellLocked(nr, nc)) continue;
          const p = this.grid[nr]?.[nc];
          if (
            !p ||
            !this.isMatchablePiece(p) ||
            p.special ||
            p.bombTimer !== null ||
            p.hasKey
          ) {
            continue;
          }
          const key = `${nr},${nc}`;
          if (!seen.has(key)) {
            seen.add(key);
            candidates.push({ r: nr, c: nc });
          }
        }
      }
    }

    if (candidates.length === 0) return false;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    this.grid[pick.r][pick.c] = null;
    this.chocolate[pick.r][pick.c] = 1;
    this.cb.audio?.onChocolateSpread?.();
    this.spawnBurst(pick.r, pick.c, '#5c2810', 10);
    this.spawnPopup(pick.r, pick.c, 'Sô-cô-la lan!', '#e9d5ff', 14);
    return true;
  }

  private tickCauldrons(): boolean {
    let brewed = false;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.cauldron[r]?.[c] || 0) <= 0) continue;
        if (this.cauldronStunnedThisTurn.has(`${r},${c}`)) continue;

        this.cauldronCharge[r][c] = (this.cauldronCharge[r]?.[c] || 0) + 1;
        if (this.cauldronCharge[r][c] < 3) continue;
        this.cauldronCharge[r][c] = 0;

        const candidates: Array<{ r: number; c: number; dist: number }> = [];
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const dist = Math.abs(dr) + Math.abs(dc);
            if (dist === 0 || dist > 2) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (!this.isValidCell(nr, nc) || this.mask[nr]?.[nc] === 0) continue;
            if (
              nr === 0 ||
              this.isExitCell(nr, nc) ||
              this.isPortalCell(nr, nc) ||
              this.isConveyorCell(nr, nc)
            ) {
              continue;
            }
            if (this.hasStaticBlocker(nr, nc) || this.isCellLocked(nr, nc)) continue;
            const p = this.grid[nr]?.[nc];
            if (
              !p ||
              !this.isMatchablePiece(p) ||
              p.special ||
              p.bombTimer !== null ||
              p.hasKey
            ) {
              continue;
            }
            candidates.push({ r: nr, c: nc, dist });
          }
        }
        if (candidates.length === 0) continue;
        candidates.sort((a, b) => a.dist - b.dist || Math.random() - 0.5);
        const pick = candidates[0];
        if (Math.random() < 0.5) {
          this.ice[pick.r][pick.c] = 1;
        } else {
          this.grid[pick.r][pick.c] = this.createSwirlPiece(pick.c, pick.r);
        }
        brewed = true;
        this.spawnArc(r, c, pick.r, pick.c, '#10b981');
        this.spawnBurst(pick.r, pick.c, '#bef264', 10);
        this.spawnPopup(pick.r, pick.c, 'Độc dược trào!', '#bef264', 13);
      }
    }
    if (brewed) this.cb.audio?.onChocolateSpread?.();
    return brewed;
  }

  private tickDementors(): boolean {
    let activeUnstunned = 0;
    let firstPos: { r: number; c: number } | null = null;
    let chilled = false;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.dementor[r]?.[c] || 0) <= 0) continue;
        if (this.dementorStunnedThisTurn.has(`${r},${c}`)) continue;

        activeUnstunned++;
        if (!firstPos) firstPos = { r, c };

        this.dementorCharge[r][c] = (this.dementorCharge[r]?.[c] || 0) + 1;
        if (this.dementorCharge[r][c] < 3) continue;
        this.dementorCharge[r][c] = 0;

        const candidates: Array<{ r: number; c: number; dist: number }> = [];
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const dist = Math.abs(dr) + Math.abs(dc);
            if (dist === 0 || dist > 2) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (!this.isValidCell(nr, nc) || this.mask[nr]?.[nc] === 0) continue;
            if (
              nr === 0 ||
              this.isExitCell(nr, nc) ||
              this.isPortalCell(nr, nc) ||
              this.isConveyorCell(nr, nc)
            ) {
              continue;
            }
            if (this.hasStaticBlocker(nr, nc) || this.isCellLocked(nr, nc)) continue;
            const p = this.grid[nr]?.[nc];
            if (
              !p ||
              !this.isMatchablePiece(p) ||
              p.special ||
              p.bombTimer !== null ||
              p.hasKey
            ) {
              continue;
            }
            candidates.push({ r: nr, c: nc, dist });
          }
        }
        if (candidates.length === 0) continue;
        candidates.sort((a, b) => a.dist - b.dist || Math.random() - 0.5);
        const pick = candidates[0];
        this.ice[pick.r][pick.c] = Math.min(5, (this.ice[pick.r]?.[pick.c] || 0) + 1);
        chilled = true;
        this.spawnArc(r, c, pick.r, pick.c, '#38bdf8');
        this.spawnBurst(pick.r, pick.c, '#bae6fd', 10);
        this.spawnPopup(pick.r, pick.c, 'Hơi lạnh Azkaban!', '#bae6fd', 13);
      }
    }

    if (activeUnstunned > 0 && this.patronusCharge > 0 && this.patronusCharge < 100) {
      const drain = Math.min(12, activeUnstunned * 5);
      this.patronusCharge = Math.max(0, Math.round((this.patronusCharge - drain) * 10) / 10);
      if (firstPos) {
        this.spawnPopup(firstPos.r, firstPos.c, `👻 HÚT -${drain}% NỘ!`, '#93c5fd', 13);
      }
    }

    if (chilled) this.cb.audio?.onIceBreak?.();
    return chilled || activeUnstunned > 0;
  }

  private tickFiendfyre(): boolean {
    const fireCells: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if ((this.fiendfyre[r]?.[c] || 0) > 0) fireCells.push({ r, c });
      }
    }
    if (fireCells.length === 0) return false;

    let acted = false;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (!p || p.bombTimer === null || p.bombTimer === undefined || p.bombTimer <= 2) {
          continue;
        }
        const nearFire = fireCells.find((fc) => Math.abs(fc.r - r) + Math.abs(fc.c - c) <= 2);
        if (nearFire) {
          p.bombTimer = Math.max(2, p.bombTimer - 1);
          acted = true;
          this.spawnArc(nearFire.r, nearFire.c, r, c, '#f97316');
          this.spawnPopup(r, c, '🔥 NUNG BOM!', '#fdba74', 13);
        }
      }
    }

    if (!this.fiendfyreDamagedThisTurn && this.movesUsed > 0 && this.movesUsed % 2 === 0) {
      const dirs: Array<[number, number]> = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      const candidates: Array<{ r: number; c: number; fromR: number; fromC: number }> = [];
      const seen = new Set<string>();
      for (const fc of fireCells) {
        for (const [dr, dc] of dirs) {
          const nr = fc.r + dr;
          const nc = fc.c + dc;
          if (!this.isValidCell(nr, nc) || this.mask[nr]?.[nc] === 0) continue;
          if (
            nr === 0 ||
            this.isExitCell(nr, nc) ||
            this.isPortalCell(nr, nc) ||
            this.isConveyorCell(nr, nc)
          ) {
            continue;
          }
          if (this.hasStaticBlocker(nr, nc) || this.isCellLocked(nr, nc)) continue;
          const p = this.grid[nr]?.[nc];
          if (
            !p ||
            !this.isMatchablePiece(p) ||
            p.special ||
            p.bombTimer !== null ||
            p.hasKey
          ) {
            continue;
          }
          const key = `${nr},${nc}`;
          if (!seen.has(key)) {
            seen.add(key);
            candidates.push({ r: nr, c: nc, fromR: fc.r, fromC: fc.c });
          }
        }
      }
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        this.grid[pick.r][pick.c] = null;
        this.fiendfyre[pick.r][pick.c] = 2;
        acted = true;
        this.cb.audio?.onChocolateSpread?.();
        this.spawnArc(pick.fromR, pick.fromC, pick.r, pick.c, '#f97316');
        this.spawnBurst(pick.r, pick.c, '#fb923c', 12);
        this.spawnPopup(pick.r, pick.c, '🔥 Lửa Địa Ngục lan!', '#fed7aa', 14);
      }
    }

    return acted;
  }

  private async shiftMazeWindRows(session = this.sessionId): Promise<boolean> {
    const rows = this.mazeConfig?.rows;
    const interval = this.mazeConfig?.intervalMoves || 2;
    if (!Array.isArray(rows) || rows.length === 0) return false;
    if (this.movesUsed <= 0 || this.movesUsed % interval !== 0) return false;

    const animMoves: Array<{
      piece: CandyInternalPiece;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
    }> = [];
    const cycleNum = Math.floor(this.movesUsed / interval);

    rows.forEach((r, idx) => {
      if (r < 0 || r >= this.size) return;
      const movableCols: number[] = [];
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (
          this.mask[r]?.[c] === 1 &&
          !this.hasStaticBlocker(r, c) &&
          !this.isCellLocked(r, c) &&
          p &&
          !p.isIngredient
        ) {
          movableCols.push(c);
        }
      }
      if (movableCols.length < 2) return;

      const dir = (idx + cycleNum) % 2 === 0 ? 1 : -1;
      const snapshot = movableCols.map((c) => this.grid[r][c]);
      const len = movableCols.length;
      for (let i = 0; i < len; i++) {
        const fromC = movableCols[i];
        const toC = movableCols[(i + dir + len) % len];
        const piece = snapshot[i];
        this.grid[r][toC] = piece;
        if (piece) {
          piece.x = fromC;
          piece.y = r;
          animMoves.push({ piece, fromX: fromC, fromY: r, toX: toC, toY: r });
        }
      }
    });

    if (animMoves.length === 0) return false;
    this.cb.audio?.onMazeShift?.();
    const midRow = rows[Math.floor(rows.length / 2)];
    this.spawnPopup(midRow, Math.floor(this.size / 2), '🌪️ GIÓ MÊ CUNG!', '#6ee7b7', 15);

    if (!this.instantAnimations && this.renderer) {
      const duration = 150;
      const start = nowMs();
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (session !== this.sessionId) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / duration);
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          for (const m of animMoves) {
            m.piece.x = m.fromX + (m.toX - m.fromX) * ease;
            m.piece.y = m.fromY + (m.toY - m.fromY) * ease;
          }
          if (t < 1) nextAnimFrame(step);
          else resolve();
        };
        nextAnimFrame(step);
      });
    }

    if (session !== this.sessionId) return true;
    for (const m of animMoves) {
      m.piece.x = m.toX;
      m.piece.y = m.toY;
    }

    if (this.extractIngredientsAtExits()) {
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return true;
    }
    if (this.findMatchClusters().length > 0) {
      await this.resolveAllCascades(1, session);
    }
    return true;
  }

  private castBossHex(forceEnrageBurst = false): boolean {
    if (!this.bossConfig || !this.level || this.bossDefeated || this.bossHp <= 0) return false;
    const interval = this.bossEffectiveCastInterval || this.bossConfig.castInterval || 4;
    if (!forceEnrageBurst && (this.movesUsed <= 0 || this.movesUsed % interval !== 0)) {
      return false;
    }

    const candidates: Array<{ r: number; c: number }> = [];
    for (let r = 2; r <= this.size - 2; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.mask[r]?.[c] === 0) continue;
        if (this.isExitCell(r, c) || this.isPortalCell(r, c) || this.isConveyorCell(r, c)) {
          continue;
        }
        if (this.hasStaticBlocker(r, c) || this.isCellLocked(r, c)) continue;
        const p = this.grid[r]?.[c];
        if (
          !p ||
          !this.isMatchablePiece(p) ||
          p.special ||
          p.bombTimer !== null ||
          p.hasKey
        ) {
          continue;
        }
        candidates.push({ r, c });
      }
    }
    if (candidates.length === 0) return false;
    candidates.sort(() => Math.random() - 0.5);

    const baseCount = this.level.id >= 60 ? 2 : 1;
    const count = forceEnrageBurst
      ? Math.min(candidates.length, (this.level.seasonId || 1) >= 5 ? 3 : 2)
      : Math.min(candidates.length, this.bossEnraged ? baseCount + 1 : baseCount);
    const chosen = candidates.slice(0, count);
    const midC = Math.floor(this.size / 2);

    for (let i = 0; i < chosen.length; i++) {
      const { r, c } = chosen[i];
      const hex = this.bossConfig.hexType;
      this.spawnArc(0, midC, r, c, forceEnrageBurst ? '#f43f5e' : '#c084fc');
      if (hex === 'chocolate') {
        this.grid[r][c] = null;
        this.chocolate[r][c] = 1;
      } else if (hex === 'petrify') {
        this.petrify[r][c] = this.bossEnraged ? 2 : 1;
      } else if (hex === 'fiendfyre') {
        this.grid[r][c] = null;
        this.fiendfyre[r][c] = 2;
      } else if (hex === 'ice') {
        this.ice[r][c] = this.bossEnraged ? 2 : 1;
      } else if (hex === 'dark_curse') {
        if ((this.level.seasonId || 1) >= 2 && i % 3 === 1) {
          this.petrify[r][c] = this.bossEnraged ? 2 : 1;
        } else if (i % 2 === 0) {
          this.ice[r][c] = this.bossEnraged ? 2 : 1;
        } else {
          this.grid[r][c] = this.createSwirlPiece(c, r);
        }
      } else {
        this.grid[r][c] = this.createSwirlPiece(c, r);
      }
      this.spawnBurst(r, c, forceEnrageBurst ? '#fb7185' : '#c084fc', 11);
    }

    if (forceEnrageBurst) {
      this.cb.audio?.onBossEnrage?.();
      this.vfx.shake = Math.max(this.vfx.shake, 11);
      this.spawnCenterBanner(`🔥 ${this.bossConfig.shortTitle.toUpperCase()} CUỒNG NỘ PHA 2!`);
    } else {
      this.cb.audio?.onBossHex?.();
      this.vfx.shake = Math.max(this.vfx.shake, 6);
      this.spawnCenterBanner(`${this.bossConfig.emoji} ${this.bossConfig.hexName.toUpperCase()}!`);
    }
    return true;
  }

  private tickBombsAndCheckExplosion(): { r: number; c: number } | null {
    let explodedCell: { r: number; c: number } | null = null;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.grid[r]?.[c];
        if (p && p.bombTimer !== null && p.bombTimer !== undefined) {
          p.bombTimer = Math.max(0, p.bombTimer - 1);
          if (p.bombTimer <= 0 && !explodedCell) {
            explodedCell = { r, c };
          }
        }
      }
    }

    if (
      this.bombConfig &&
      this.movesUsed > 0 &&
      this.movesUsed % this.bombConfig.intervalMoves === 0 &&
      this.countBombsOnBoard() < 2
    ) {
      this.pendingBombSpawns = 1;
    }

    return explodedCell;
  }

  public getObjectivesProgress(): CandyObjectiveProgress[] {
    if (!this.level) return [];
    const remJelly = this.countGridSum(this.jelly);
    const remIce = this.countGridSum(this.ice);
    const remFrosting = this.countGridSum(this.frosting);
    const remChocolate = this.countGridSum(this.chocolate);
    const remCauldrons = this.countPositiveCells(this.cauldron);
    const remLocks = this.countGridSum(this.lockGrid);
    const remPetrify = this.countGridSum(this.petrify);
    const remDementors = this.countPositiveCells(this.dementor);
    const remDecrees = this.countPositiveCells(this.decree);
    const remFiendfyre = this.countPositiveCells(this.fiendfyre);
    const remHorcruxes = this.countPositiveCells(this.horcrux);

    return this.level.objectives.map((obj) => {
      if (obj.type === 'boss') {
        const dealt = Math.max(0, this.bossMaxHp - this.bossHp);
        return {
          ...obj,
          target: this.bossMaxHp,
          current: dealt,
          remaining: this.bossHp,
          completed: this.bossHp <= 0,
        };
      }
      if (obj.type === 'horcrux') {
        const done = Math.max(0, this.initialHorcruxes - remHorcruxes);
        return {
          ...obj,
          target: this.initialHorcruxes,
          current: done,
          remaining: remHorcruxes,
          completed: remHorcruxes === 0,
        };
      }
      if (obj.type === 'dementor') {
        const done = Math.max(0, this.initialDementors - remDementors);
        return {
          ...obj,
          target: this.initialDementors,
          current: done,
          remaining: remDementors,
          completed: remDementors === 0,
        };
      }
      if (obj.type === 'decree') {
        const done = Math.max(0, this.initialDecrees - remDecrees);
        return {
          ...obj,
          target: this.initialDecrees,
          current: done,
          remaining: remDecrees,
          completed: remDecrees === 0,
        };
      }
      if (obj.type === 'fiendfyre') {
        return {
          ...obj,
          target: remFiendfyre,
          current: remFiendfyre === 0 ? 1 : 0,
          remaining: remFiendfyre,
          completed: remFiendfyre === 0,
        };
      }
      if (obj.type === 'petrify') {
        const done = Math.max(0, this.initialPetrify - remPetrify);
        return {
          ...obj,
          target: this.initialPetrify,
          current: done,
          remaining: remPetrify,
          completed: remPetrify === 0,
        };
      }
      if (obj.type === 'cauldron') {
        const done = Math.max(0, this.initialCauldronPots - remCauldrons);
        return {
          ...obj,
          target: this.initialCauldronPots,
          current: done,
          remaining: remCauldrons,
          completed: remCauldrons === 0,
        };
      }
      if (obj.type === 'key_lock') {
        const done = Math.max(0, this.initialLocks - remLocks);
        return {
          ...obj,
          target: this.initialLocks,
          current: done,
          remaining: remLocks,
          completed: remLocks === 0,
        };
      }
      if (obj.type === 'jelly') {
        const done = Math.max(0, this.initialJelly - remJelly);
        return {
          ...obj,
          target: this.initialJelly,
          current: done,
          remaining: remJelly,
          completed: remJelly === 0,
        };
      }
      if (obj.type === 'ice') {
        const done = Math.max(0, this.initialIce - remIce);
        return {
          ...obj,
          target: this.initialIce,
          current: done,
          remaining: remIce,
          completed: remIce === 0,
        };
      }
      if (obj.type === 'frosting') {
        const done = Math.max(0, this.initialFrosting - remFrosting);
        return {
          ...obj,
          target: this.initialFrosting,
          current: done,
          remaining: remFrosting,
          completed: remFrosting === 0,
        };
      }
      if (obj.type === 'chocolate') {
        return {
          ...obj,
          target: remChocolate,
          current: remChocolate === 0 ? 1 : 0,
          remaining: remChocolate,
          completed: remChocolate === 0,
        };
      }
      if (obj.type === 'ingredient') {
        const tgt = obj.target ?? this.ingredientTarget;
        const cur = this.ingredientsCollected;
        const rem = Math.max(0, tgt - cur);
        return { ...obj, target: tgt, current: cur, remaining: rem, completed: rem === 0 };
      }
      if (obj.type === 'special_order') {
        const tgt = obj.target ?? 1;
        const cur = obj.specialKind ? this.specialStats[obj.specialKind] || 0 : 0;
        const rem = Math.max(0, tgt - cur);
        return { ...obj, target: tgt, current: cur, remaining: rem, completed: rem === 0 };
      }
      if (obj.type === 'score') {
        const tgt = obj.target ?? 1000;
        const rem = Math.max(0, tgt - this.score);
        return {
          ...obj,
          target: tgt,
          current: this.score,
          remaining: rem,
          completed: rem === 0,
        };
      }
      if (obj.type === 'collect') {
        const tgt = obj.target ?? 20;
        const cur = obj.tileId !== undefined ? this.collected[obj.tileId] || 0 : 0;
        const rem = Math.max(0, tgt - cur);
        return { ...obj, target: tgt, current: cur, remaining: rem, completed: rem === 0 };
      }
      return { ...obj, current: 0, remaining: 0, completed: true };
    });
  }

  public areAllObjectivesComplete(): boolean {
    const list = this.getObjectivesProgress();
    return list.length > 0 && list.every((o) => o.completed);
  }

  public getEarnedStars(): number {
    if (!this.level) return 0;
    const [s1, s2, s3] = this.level.stars;
    if (this.score >= s3) return 3;
    if (this.score >= s2) return 2;
    if (this.score >= s1) return 1;
    return 0;
  }

  public async checkPostTurnState(
    session = this.sessionId,
    consumedPlayerTurn = false
  ): Promise<void> {
    if (session !== this.sessionId || !this.level) return;
    this.emitHudState();

    if (this.areAllObjectivesComplete()) {
      await this.finishVictorySequence(session);
      return;
    }

    if (consumedPlayerTurn) {
      if (this.conveyorLoops.length > 0) {
        this.busy = true;
        await this.shiftConveyorBelts(session);
        if (session !== this.sessionId) return;
        this.busy = false;
        if (this.areAllObjectivesComplete()) {
          await this.finishVictorySequence(session);
          return;
        }
      }

      if (
        this.mazeConfig &&
        this.mazeConfig.rows.length > 0 &&
        this.movesUsed > 0 &&
        this.movesUsed % (this.mazeConfig.intervalMoves || 2) === 0
      ) {
        this.busy = true;
        await this.shiftMazeWindRows(session);
        if (session !== this.sessionId) return;
        this.busy = false;
        if (this.areAllObjectivesComplete()) {
          await this.finishVictorySequence(session);
          return;
        }
      }

      this.spreadOneChocolate();
      this.tickCauldrons();
      this.tickDementors();
      this.tickFiendfyre();
      if (this.pendingBossEnrageBurst) {
        this.pendingBossEnrageBurst = false;
        this.castBossHex(true);
      } else {
        this.castBossHex(false);
      }
      const explodedBomb = this.tickBombsAndCheckExplosion();
      if (this.countGridSum(this.lockGrid) > 0 && this.countKeysOnBoard() === 0) {
        this.ensureSugarKeysOnBoard(1);
      }
      this.emitHudState();
      this.renderer?.render(this.getRenderState(), nowMs());

      if (explodedBomb) {
        this.ended = true;
        this.status = 'out_of_moves';
        this.failReason = 'bomb';
        this.selected = null;
        this.hintPair = null;
        this.activeBooster = null;
        this.cb.audio?.onBomb?.();
        this.cb.audio?.onDefeat?.();
        this.vfx.shake = 15;
        this.spawnRing(explodedBomb.r, explodedBomb.c, 3.2, '#ef4444');
        this.spawnBurst(explodedBomb.r, explodedBomb.c, '#ef4444', 28);
        this.spawnCenterBanner('BOM HẮC ÁM PHÁT NỔ!');
        this.emitHudState();
        this.cb.onSettled?.();
        await this.waitMs(340);
        if (session !== this.sessionId) return;
        this.cb.onGameEnd?.({
          won: false,
          failReason: 'bomb',
          levelId: this.level.id,
          score: this.score,
          stars: 0,
          leftoverMoves: this.movesLeft,
          bonusCoinsFromLeftoverMoves: 0,
          frogsCleared: this.collected[4] || 0,
        });
        return;
      }
    } else if (this.pendingBossEnrageBurst) {
      this.pendingBossEnrageBurst = false;
      this.castBossHex(true);
      this.emitHudState();
      this.renderer?.render(this.getRenderState(), nowMs());
    }

    if (this.movesLeft <= 0) {
      this.ended = true;
      this.status = 'out_of_moves';
      this.failReason = 'moves';
      this.selected = null;
      this.hintPair = null;
      this.activeBooster = null;
      this.cb.audio?.onDefeat?.();
      this.emitHudState();
      this.cb.onSettled?.();
      await this.waitMs(280);
      if (session !== this.sessionId) return;
      this.cb.onGameEnd?.({
        won: false,
        failReason: 'moves',
        levelId: this.level.id,
        score: this.score,
        stars: 0,
        leftoverMoves: 0,
        bonusCoinsFromLeftoverMoves: 0,
        frogsCleared: this.collected[4] || 0,
      });
      return;
    }

    let shuffleGuard = 0;
    while (!this.findAnyValidMove(false) && shuffleGuard < 4) {
      shuffleGuard++;
      this.busy = true;
      if (shuffleGuard === 1) {
        this.cb.onToast?.('Hết nước đi — Bùa Xoáy Thời Gian tự động xáo bàn cờ!', '🌪️');
      }
      this.spawnCenterBanner('TỰ ĐỘNG XÁO BÀN!');
      this.cb.audio?.onSortingHat?.();
      await this.performShuffleAnimation(session);
      if (session !== this.sessionId) return;
      if (this.findMatchClusters().length > 0) {
        await this.resolveAllCascades(1, session);
        if (session !== this.sessionId) return;
      }
      this.busy = false;
      this.renderer?.render(this.getRenderState(), nowMs());
      if (this.areAllObjectivesComplete()) {
        await this.finishVictorySequence(session);
        return;
      }
    }
    if (!this.findAnyValidMove(false)) {
      this.grantEmergencyMovePiece();
      this.renderer?.render(this.getRenderState(), nowMs());
    }
    this.cb.onSettled?.();
  }

  private async finishVictorySequence(session = this.sessionId): Promise<void> {
    if (!this.level) return;
    this.ended = true;
    this.busy = true;
    this.selected = null;
    this.hintPair = null;
    this.activeBooster = null;
    this.leftoverMovesAtWin = Math.max(0, this.movesLeft);
    this.bonusCoinsFromLeftoverMoves = this.leftoverMovesAtWin * 5;

    if (this.movesLeft > 0) {
      this.spawnCenterBanner('BERTIE CRUSH!');
      const bonusMoves = this.movesLeft;
      const unlockedCells: Array<{ r: number; c: number }> = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const p = this.grid[r]?.[c];
          if (
            this.mask[r]?.[c] === 1 &&
            !this.isCellLocked(r, c) &&
            !this.hasStaticBlocker(r, c) &&
            p &&
            this.isMatchablePiece(p) &&
            !p.special
          ) {
            unlockedCells.push({ r, c });
          }
        }
      }
      unlockedCells.sort(() => Math.random() - 0.5);
      const partyCount = Math.min(bonusMoves, unlockedCells.length, 8);
      for (let i = 0; i < partyCount; i++) {
        const cell = unlockedCells[i];
        const p = this.grid[cell.r]?.[cell.c];
        if (p) {
          p.special =
            i % 5 === 0
              ? 'tnt'
              : i % 4 === 0
                ? 'dynamite'
                : i % 3 === 0
                  ? 'bomb'
                  : i % 2 === 0
                    ? 'firecracker'
                    : 'seeker';
          p.scale = 1.25;
        }
      }
      this.addScore(
        bonusMoves * 450,
        Math.floor(this.size / 2),
        Math.floor(this.size / 2),
        '#fde047',
        true,
        'special'
      );
      this.movesLeft = 0;
      this.emitHudState();
      await this.waitMs(260);
      if (session !== this.sessionId) return;

      const triggered = new Set<string>();
      for (let i = 0; i < partyCount; i++) {
        const cell = unlockedCells[i];
        this.damageCell(cell.r, cell.c, triggered, true);
      }
      await this.waitMs(240);
      if (session !== this.sessionId) return;
      await this.applyGravityAndRefill(session);
      if (session !== this.sessionId) return;
      await this.resolveAllCascades(1, session);
      if (session !== this.sessionId) return;
    }

    if (this.score < this.level.stars[0]) {
      this.score = this.level.stars[0];
    }
    this.status = 'won';
    this.failReason = null;
    this.busy = false;
    this.emitHudState();
    this.renderer?.render(this.getRenderState(), nowMs());
    this.cb.audio?.onVictory?.();
    await this.waitMs(280);
    if (session !== this.sessionId) return;

    this.cb.onGameEnd?.({
      won: true,
      levelId: this.level.id,
      score: this.score,
      stars: Math.max(1, this.getEarnedStars()),
      leftoverMoves: this.leftoverMovesAtWin,
      bonusCoinsFromLeftoverMoves: this.bonusCoinsFromLeftoverMoves,
      frogsCleared: this.collected[4] || 0,
    });
  }

  public addScore(
    points: number,
    r: number,
    c: number,
    color = '#fde047',
    showPopup = true,
    category: 'normal' | 'special' | 'blocker' | 'match' = 'normal'
  ): void {
    let houseMult = 1;
    if (category === 'special' && this.house === 'gryffindor') houseMult = 1.15;
    else if (category === 'blocker' && this.house === 'slytherin') houseMult = 1.25;
    else if (category === 'match' && this.house === 'hufflepuff') houseMult = 1.12;

    const masteryMult = 1 + (this.masteryBuffs.scoreBonusPct || 0) / 100;
    const finalPoints = Math.max(1, Math.round(points * houseMult * masteryMult));

    this.score += finalPoints;
    if (showPopup && finalPoints >= 80) {
      this.spawnPopup(r, c, `+${finalPoints}`, color, finalPoints >= 500 ? 18 : 14);
    }
  }

  private cellCenterOrVirtual(r: number, c: number): { x: number; y: number } {
    if (this.renderer) {
      return this.renderer.cellCenter(r, c);
    }
    const cellPx = 440 / Math.max(1, this.size);
    return { x: 14 + (c + 0.5) * cellPx, y: 14 + (r + 0.5) * cellPx };
  }

  private spawnBurst(r: number, c: number, color: string, count = 12): void {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const actualCount = isTouch ? Math.min(8, count) : count;
    const maxParticles = isTouch ? 45 : 80;
    if (this.vfx.particles.length > maxParticles) {
      this.vfx.particles.splice(0, this.vfx.particles.length - maxParticles + actualCount);
    }
    const center = this.cellCenterOrVirtual(r, c);
    for (let i = 0; i < actualCount; i++) {
      const angle = (Math.PI * 2 * i) / actualCount + Math.random() * 0.5;
      const speed = 40 + Math.random() * 115;
      this.vfx.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 15,
        size: 2.2 + Math.random() * 3.2,
        color,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.55,
      });
    }
  }

  private spawnRing(r: number, c: number, maxRadiusCells = 1.8, color = '#fde047'): void {
    this.vfx.rings.push({ r, c, maxRadiusCells, color, life: 0.34, maxLife: 0.34 });
  }

  private spawnArc(r1: number, c1: number, r2: number, c2: number, color = '#fde047'): void {
    this.vfx.arcs.push({ r1, c1, r2, c2, color, life: 0.28, maxLife: 0.28 });
  }

  private spawnPopup(r: number, c: number, text: string, color = '#fde047', size = 15): void {
    const center = this.cellCenterOrVirtual(r, c);
    this.vfx.popups.push({
      x: center.x,
      y: center.y,
      vy: -38,
      text,
      color,
      size,
      life: 0.85,
      maxLife: 0.85,
    });
  }

  public spawnCenterBanner(text: string): void {
    const mid = (this.size - 1) / 2;
    this.spawnPopup(mid, mid, text, '#fef08a', 21);
  }

  public buildBossRuntimeState(): CandyBossRuntimeState | null {
    if (!this.bossConfig) return null;
    const effectiveInterval =
      this.bossEffectiveCastInterval || this.bossConfig.castInterval || 4;
    const turnsUntilHex =
      !this.bossDefeated && this.bossHp > 0
        ? effectiveInterval - (this.movesUsed % effectiveInterval)
        : 0;
    return {
      ...this.bossConfig,
      hp: this.bossHp,
      maxHp: this.bossMaxHp,
      defeated: this.bossDefeated,
      enraged: this.bossEnraged,
      effectiveCastInterval: effectiveInterval,
      turnsUntilHex,
    };
  }

  public getHudSnapshot(): CandyHudStateSnapshot | null {
    if (!this.level) return null;
    const selectedPiece = this.selected ? this.grid[this.selected.r]?.[this.selected.c] : null;
    return {
      level: this.level,
      score: this.score,
      movesLeft: this.movesLeft,
      movesUsed: this.movesUsed,
      starsEarned: this.getEarnedStars(),
      objectives: this.getObjectivesProgress(),
      activeBooster: this.activeBooster,
      swapFirstCell: this.activeBooster === 'swap' && this.selected ? { ...this.selected } : null,
      selectedSpecial: selectedPiece?.special ?? null,
      rainbowCharge: Math.min(100, Math.floor(this.rainbowCharge)),
      superRainbow: this.superRainbow,
      patronusCharge: Math.min(100, Math.floor(this.patronusCharge)),
      house: this.house,
      bossState: this.buildBossRuntimeState(),
      talismanUsed: this.talismanUsed,
      status: this.status,
      failReason: this.failReason,
    };
  }

  public emitHudState(): void {
    const snap = this.getHudSnapshot();
    if (snap) {
      this.cb.onStateChange?.(snap);
    }
  }

  public update(dt: number, now: number): void {
    if (this.vfx.shake > 0) {
      this.vfx.shake = Math.max(0, this.vfx.shake - dt * 28);
    }

    for (let r = 0; r < this.size; r++) {
      const row = this.grid[r];
      if (!row) continue;
      for (let c = 0; c < this.size; c++) {
        const piece = row[c];
        if (piece && piece.scale > 1 && !piece.primedWrapped) {
          piece.scale = Math.max(1, piece.scale - dt * 1.4);
        }
      }
    }

    for (let i = this.vfx.particles.length - 1; i >= 0; i--) {
      const pt = this.vfx.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 180 * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.vfx.particles.splice(i, 1);
    }

    for (const list of [this.vfx.beams, this.vfx.seekers, this.vfx.arcs, this.vfx.rings]) {
      for (let i = list.length - 1; i >= 0; i--) {
        list[i].life -= dt;
        if (list[i].life <= 0) list.splice(i, 1);
      }
    }

    for (let i = this.vfx.popups.length - 1; i >= 0; i--) {
      const pop = this.vfx.popups[i];
      pop.y += pop.vy * dt;
      pop.life -= dt;
      if (pop.life <= 0) this.vfx.popups.splice(i, 1);
    }

    const hintDelayMs = this.house === 'ravenclaw' ? 2600 : 4800;
    if (!this.busy && !this.ended && !this.hintPair && now - this.lastActionAt > hintDelayMs) {
      this.hintPair = this.findAnyValidMove();
    }
  }

  public exportSession(extra?: {
    movesMadeThisAttempt?: number;
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedMatch3Session | null {
    if (!this.level || this.busy || this.status === 'won') return null;
    if (this.status !== 'playing' && this.status !== 'out_of_moves') return null;

    const cloneMatrix = (m: number[][]): number[][] =>
      Array.from({ length: this.size }, (_, r) =>
        Array.from({ length: this.size }, (__, c) => m[r]?.[c] ?? 0)
      );

    const gridOut: Array<Array<SavedMatch3Piece | null>> = Array.from(
      { length: this.size },
      (_, r) =>
        Array.from({ length: this.size }, (__, c) => {
          const p = this.grid[r]?.[c];
          if (!p) return null;
          return {
            color: p.color,
            special: p.special,
            blocker: p.blocker,
            isIngredient: p.isIngredient,
            bombTimer: p.bombTimer,
            hasKey: p.hasKey,
            primedWrapped: p.primedWrapped,
            primedMega: Boolean(p.primedMega),
          };
        })
    );

    return {
      levelId: this.level.id,
      size: this.size,
      house: this.house,
      mask: cloneMatrix(this.mask),
      jelly: cloneMatrix(this.jelly),
      ice: cloneMatrix(this.ice),
      frosting: cloneMatrix(this.frosting),
      chocolate: cloneMatrix(this.chocolate),
      cauldron: cloneMatrix(this.cauldron),
      cauldronCharge: cloneMatrix(this.cauldronCharge),
      lockGrid: cloneMatrix(this.lockGrid),
      petrify: cloneMatrix(this.petrify),
      dementor: cloneMatrix(this.dementor),
      dementorCharge: cloneMatrix(this.dementorCharge),
      decree: cloneMatrix(this.decree),
      fiendfyre: cloneMatrix(this.fiendfyre),
      horcrux: cloneMatrix(this.horcrux),
      grid: gridOut,
      ingredientsCollected: this.ingredientsCollected,
      ingredientsSpawned: this.ingredientsSpawned,
      pendingBombSpawns: this.pendingBombSpawns,
      bossHp: this.bossHp,
      bossDefeated: this.bossDefeated,
      bossEnraged: this.bossEnraged,
      pendingBossEnrageBurst: this.pendingBossEnrageBurst,
      bossEffectiveCastInterval: this.bossEffectiveCastInterval,
      patronusCharge: this.patronusCharge,
      rainbowCharge: this.rainbowCharge,
      pendingRainbowSpawns: this.pendingRainbowSpawns,
      superRainbow: this.superRainbow,
      score: this.score,
      movesLeft: this.movesLeft,
      movesUsed: this.movesUsed,
      talismanUsed: this.talismanUsed,
      status: this.status,
      failReason: this.failReason,
      collected: { ...this.collected },
      specialStats: { ...this.specialStats },
      movesMadeThisAttempt: Math.max(0, Math.floor(extra?.movesMadeThisAttempt ?? this.movesUsed)),
      companionCharge: extra?.companionCharge,
      snackPieUsed: extra?.snackPieUsed,
      savedAt: Date.now(),
    };
  }

  public restoreSession(snap: SavedMatch3Session | null | undefined): boolean {
    if (!snap || !this.level) return false;
    if (snap.levelId !== this.level.id || snap.size !== this.size) return false;
    if (snap.status !== 'playing' && snap.status !== 'out_of_moves') return false;

    const sz = this.size;
    const validateMatrix = (raw: unknown, maxVal = 20): number[][] | null => {
      if (!Array.isArray(raw) || raw.length !== sz) return null;
      const out: number[][] = [];
      for (let r = 0; r < sz; r++) {
        const row = raw[r];
        if (!Array.isArray(row) || row.length !== sz) return null;
        const outRow: number[] = [];
        for (let c = 0; c < sz; c++) {
          const v = Number(row[c] ?? 0);
          if (!Number.isFinite(v) || v < 0 || v > maxVal) return null;
          outRow.push(Math.floor(v));
        }
        out.push(outRow);
      }
      return out;
    };

    const nextMask = validateMatrix(snap.mask, 1);
    const nextJelly = validateMatrix(snap.jelly, 10);
    const nextIce = validateMatrix(snap.ice, 10);
    const nextFrosting = validateMatrix(snap.frosting, 10);
    const nextChocolate = validateMatrix(snap.chocolate, 10);
    const nextCauldron = validateMatrix(snap.cauldron, 10);
    const nextCauldronCharge = validateMatrix(snap.cauldronCharge, 20);
    const nextLockGrid = validateMatrix(snap.lockGrid, 10);
    const nextPetrify = validateMatrix(snap.petrify, 10);
    const nextDementor = validateMatrix(snap.dementor, 10);
    const nextDementorCharge = validateMatrix(snap.dementorCharge, 20);
    const nextDecree = validateMatrix(snap.decree, 10);
    const nextFiendfyre = validateMatrix(snap.fiendfyre, 10);
    const nextHorcrux = validateMatrix(snap.horcrux, 10);
    if (
      !nextMask ||
      !nextJelly ||
      !nextIce ||
      !nextFrosting ||
      !nextChocolate ||
      !nextCauldron ||
      !nextCauldronCharge ||
      !nextLockGrid ||
      !nextPetrify ||
      !nextDementor ||
      !nextDementorCharge ||
      !nextDecree ||
      !nextFiendfyre ||
      !nextHorcrux
    ) {
      return false;
    }

    if (!Array.isArray(snap.grid) || snap.grid.length !== sz) return false;
    const validSpecials = new Set<CandySpecialType>([
      'firecracker',
      'bomb',
      'dynamite',
      'tnt',
      'striped_h',
      'striped_v',
      'wrapped',
      'seeker',
      'color_bomb',
    ]);
    const nextGrid: Array<Array<CandyInternalPiece | null>> = [];
    for (let r = 0; r < sz; r++) {
      const row = snap.grid[r];
      if (!Array.isArray(row) || row.length !== sz) return false;
      const nextRow: Array<CandyInternalPiece | null> = [];
      for (let c = 0; c < sz; c++) {
        const cell = row[c];
        if (!cell) {
          nextRow.push(null);
          continue;
        }
        const isIng = Boolean(cell.isIngredient);
        const blocker = cell.blocker === 'swirl' ? 'swirl' : null;
        const color = Number(cell.color);
        if (!Number.isInteger(color) || color < -1 || color >= CANDY_TILE_TYPES.length) {
          return false;
        }
        const special =
          cell.special && validSpecials.has(cell.special) ? cell.special : null;
        const bombTimer =
          cell.bombTimer !== null &&
          cell.bombTimer !== undefined &&
          Number.isFinite(Number(cell.bombTimer))
            ? Math.max(0, Math.min(99, Math.floor(Number(cell.bombTimer))))
            : null;
        nextRow.push({
          id: NEXT_CANDY_PIECE_ID++,
          color,
          special,
          blocker,
          isIngredient: isIng,
          bombTimer,
          hasKey: Boolean(cell.hasKey),
          primedWrapped: Boolean(cell.primedWrapped),
          primedMega: Boolean(cell.primedMega),
          x: c,
          y: r,
          scale: cell.primedWrapped ? 1.18 : 1,
          alpha: 1,
        });
      }
      nextGrid.push(nextRow);
    }

    const validHouses = new Set<CandyHouseId>([
      'gryffindor',
      'slytherin',
      'ravenclaw',
      'hufflepuff',
    ]);
    if (validHouses.has(snap.house)) {
      this.house = snap.house;
    }
    this.mask = nextMask;
    this.jelly = nextJelly;
    this.ice = nextIce;
    this.frosting = nextFrosting;
    this.chocolate = nextChocolate;
    this.cauldron = nextCauldron;
    this.cauldronCharge = nextCauldronCharge;
    this.lockGrid = nextLockGrid;
    this.petrify = nextPetrify;
    this.dementor = nextDementor;
    this.dementorCharge = nextDementorCharge;
    this.decree = nextDecree;
    this.fiendfyre = nextFiendfyre;
    this.horcrux = nextHorcrux;
    this.grid = nextGrid;

    this.ingredientsCollected = Math.max(0, Math.floor(snap.ingredientsCollected || 0));
    this.ingredientsSpawned = Math.max(
      this.ingredientsCollected,
      Math.floor(snap.ingredientsSpawned || 0)
    );
    this.pendingBombSpawns = Math.max(0, Math.floor(snap.pendingBombSpawns || 0));
    this.bossHp = Math.max(0, Math.min(this.bossMaxHp, Math.floor(snap.bossHp ?? this.bossMaxHp)));
    this.bossDefeated = this.bossMaxHp > 0 ? Boolean(snap.bossDefeated || this.bossHp === 0) : false;
    this.bossEnraged = Boolean(snap.bossEnraged);
    this.pendingBossEnrageBurst = Boolean(snap.pendingBossEnrageBurst);
    this.bossEffectiveCastInterval = Math.max(
      2,
      Math.floor(snap.bossEffectiveCastInterval || (this.bossConfig?.castInterval ?? 4))
    );
    this.patronusCharge = Math.max(0, Math.min(100, Number(snap.patronusCharge || 0)));
    this.rainbowCharge = Math.max(0, Math.min(100, Number(snap.rainbowCharge || 0)));
    this.pendingRainbowSpawns = Math.max(
      0,
      Math.min(4, Math.floor(Number(snap.pendingRainbowSpawns || 0)))
    );
    if (snap.superRainbow !== undefined) {
      this.superRainbow = Boolean(snap.superRainbow);
    }
    this.score = Math.max(0, Math.floor(snap.score || 0));
    this.movesLeft = Math.max(0, Math.min(99, Math.floor(snap.movesLeft ?? this.level.moves)));
    this.movesUsed = Math.max(0, Math.floor(snap.movesUsed || 0));
    this.talismanUsed = Boolean(snap.talismanUsed);
    this.status = snap.status;
    this.failReason =
      snap.failReason === 'moves' || snap.failReason === 'bomb' ? snap.failReason : null;
    this.ended = snap.status === 'out_of_moves';
    this.busy = false;
    this.selected = null;
    this.activeBooster = null;
    this.hintPair = null;

    const nextCollected: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (snap.collected && typeof snap.collected === 'object') {
      for (let k = 0; k < CANDY_TILE_TYPES.length; k++) {
        const rawVal = Number(snap.collected[String(k)] ?? snap.collected[k] ?? 0);
        if (Number.isFinite(rawVal) && rawVal > 0) {
          nextCollected[k] = Math.floor(rawVal);
        }
      }
    }
    this.collected = nextCollected;
    this.specialStats = {
      striped: Math.max(0, Math.floor(snap.specialStats?.striped || 0)),
      wrapped: Math.max(0, Math.floor(snap.specialStats?.wrapped || 0)),
      seeker: Math.max(0, Math.floor(snap.specialStats?.seeker || 0)),
      color_bomb: Math.max(0, Math.floor(snap.specialStats?.color_bomb || 0)),
    };

    if (this.areAllObjectivesComplete()) {
      const reloadHouse = this.house;
      const reloadSuper = this.superRainbow;
      this.loadLevel(this.level, { house: reloadHouse, superRainbow: reloadSuper });
      return false;
    }

    this.resetIdleHint();
    this.emitHudState();
    if (this.renderer) {
      if (!this.ended) {
        this.startLoop();
      }
      this.renderer.render(this.getRenderState(), nowMs());
    }
    return true;
  }
}
