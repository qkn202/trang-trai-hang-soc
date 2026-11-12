// Bộ dựng hình Bàn Cờ & Kẹo Phép 3D chuẩn Candy Crush Hogwarts
// Hỗ trợ Khay 7×7 → 10×10, Vật Cản Đa Lớp (1–5 lớp) & 6 Cơ Chế Hắc Ám Độc Quyền Năm 2–7

import {
  CANDY_ASSET_REV,
  CANDY_TILE_TYPES,
  CandyMazeConfig,
  CandyPortalPair,
  CandySpecialType,
} from '../data/candyHogwartsLevels';

export interface CandyBoardPiece {
  id: number;
  color: number;
  special: CandySpecialType | null;
  blocker: 'swirl' | null;
  isIngredient: boolean;
  bombTimer: number | null;
  hasKey: boolean;
  primedWrapped: boolean;
  x: number;
  y: number;
  scale: number;
  alpha: number;
}

export interface CandyBeamVfx {
  r: number;
  c: number;
  dir: 'h' | 'v';
  color: string;
  widthFactor: number;
  life: number;
  maxLife: number;
  cStart?: number;
  cEnd?: number;
  rStart?: number;
  rEnd?: number;
}

export interface CandySeekerVfx {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface CandyArcVfx {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface CandyRingVfx {
  r: number;
  c: number;
  maxRadiusCells: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface CandyParticleVfx {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface CandyPopupVfx {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface CandyVfxBundle {
  particles: CandyParticleVfx[];
  beams: CandyBeamVfx[];
  seekers: CandySeekerVfx[];
  arcs: CandyArcVfx[];
  rings: CandyRingVfx[];
  popups: CandyPopupVfx[];
  shake: number;
}

export interface CandyRenderState {
  size: number;
  mask: number[][];
  jelly: number[][];
  ice: number[][];
  frosting: number[][];
  chocolate: number[][];
  cauldron: number[][];
  lockGrid: number[][];
  petrify: number[][];
  dementor: number[][];
  decree: number[][];
  fiendfyre: number[][];
  horcrux: number[][];
  mazeConfig: CandyMazeConfig | null;
  conveyorLoops: Array<Array<{ r: number; c: number }>>;
  portals: CandyPortalPair[];
  ingredientExitCells: Array<{ r: number; c: number }>;
  grid: Array<Array<CandyBoardPiece | null>>;
  selected: { r: number; c: number } | null;
  kbCursor: { r: number; c: number } | null;
  hintPair: [{ r: number; c: number }, { r: number; c: number }] | null;
  activeBooster: 'hammer' | 'swap' | null;
  vfx: CandyVfxBundle;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export class CandyHogwartsBoardRenderer {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private onSpriteReady?: () => void;
  private dpr: number;
  public boardPx = 468;
  public padding = 14;
  public cellSize = 56;
  private observedCssSize = 0;
  private currentGridSize = 0;
  private currentCssSize = 0;
  private currentZoomStep = 100;
  public viewZoom = 1;
  public netQuarterTurns: 0 | 1 | 2 | 3 = 0;
  private bgCanvas: HTMLCanvasElement | null = null;
  private bgCtx: CanvasRenderingContext2D | null = null;
  private bgDirty = true;
  private lastBgKey = '';
  private sprites: Record<string, HTMLImageElement> = {};
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, onSpriteReady?: () => void) {
    this.canvas = canvas;
    this.ctx = typeof canvas?.getContext === 'function' ? canvas.getContext('2d') : null;
    this.onSpriteReady = onSpriteReady;
    const isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    this.dpr =
      typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.6 : 2.0)
        : 1;

    if (typeof Image !== 'undefined') {
      this.preloadSprites();
    }

    if (
      typeof ResizeObserver !== 'undefined' &&
      typeof Element !== 'undefined' &&
      canvas instanceof Element
    ) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height || w;
          const sz = Math.floor(Math.min(w, h));
          if (sz > 0 && sz !== this.observedCssSize) {
            this.observedCssSize = sz;
            this.bgDirty = true;
          }
        }
        this.onSpriteReady?.();
      });
      this.resizeObserver.observe(canvas);
    }
  }

  public destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private preloadSprites(): void {
    const load = (key: string, url: string) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.bgDirty = true;
        this.onSpriteReady?.();
      };
      img.onerror = () => {
        if (/\.webp(\?.*)?$/.test(url)) {
          img.src = url.replace(/\.webp(\?.*)?$/, '.png$1');
        }
      };
      img.src = url;
      this.sprites[key] = img;
    };

    const q = `?v=${CANDY_ASSET_REV}`;
    for (let i = 0; i < 6; i++) {
      load(`c_${i}`, `/paintings/candy-hogwarts/candy-${i}.webp${q}`);
      load(`c_${i}_sh`, `/paintings/candy-hogwarts/candy-${i}-sh.webp${q}`);
      load(`c_${i}_sv`, `/paintings/candy-hogwarts/candy-${i}-sv.webp${q}`);
      load(`c_${i}_wr`, `/paintings/candy-hogwarts/candy-${i}-wrapped.webp${q}`);
    }
    load('color_bomb', `/paintings/candy-hogwarts/candy-colorbomb.webp${q}`);
    load('chocolate_block', `/paintings/candy-hogwarts/candy-chocolate.webp${q}`);
    load('chocolate_deluxe', `/paintings/candy-hogwarts/candy-chocolate-deluxe.webp${q}`);
    load('frosting_waffle', `/paintings/candy-hogwarts/candy-frosting.webp${q}`);
    load('swirl_piece', `/paintings/candy-hogwarts/candy-swirl.webp${q}`);
  }

  private getSpriteForPiece(piece: CandyBoardPiece): HTMLImageElement | undefined {
    if (piece.special === 'color_bomb') return this.sprites.color_bomb;
    if (piece.special === 'striped_h') return this.sprites[`c_${piece.color}_sh`];
    if (piece.special === 'striped_v') return this.sprites[`c_${piece.color}_sv`];
    if (piece.special === 'wrapped') return this.sprites[`c_${piece.color}_wr`];
    return this.sprites[`c_${piece.color}`];
  }

  public invalidateBg(): void {
    this.bgDirty = true;
  }

  public resize(gridSize: number): void {
    let rawCssSize = this.observedCssSize;
    if (!rawCssSize || rawCssSize <= 0) {
      const cw = this.canvas?.clientWidth ?? 0;
      const ch = this.canvas?.clientHeight ?? 0;
      if (cw > 0) {
        rawCssSize = Math.floor(Math.min(cw, ch || cw));
      } else if (typeof this.canvas?.getBoundingClientRect === 'function') {
        const rect = this.canvas.getBoundingClientRect();
        const z = Math.max(0.25, this.viewZoom || 1);
        rawCssSize = Math.floor(Math.min(rect.width, rect.height || rect.width) / z);
      }
    }
    const cssSize = Math.max(240, rawCssSize || 468);
    const zoomStep = Math.round(Math.max(1, Math.min(2.4, this.viewZoom || 1)) * 100);
    if (
      this.currentGridSize === gridSize &&
      this.currentCssSize === cssSize &&
      this.currentZoomStep === zoomStep
    ) {
      return;
    }
    this.currentGridSize = gridSize;
    this.currentCssSize = cssSize;
    this.currentZoomStep = zoomStep;

    const isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const baseDpr =
      typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.65 : 2.0)
        : 1;
    const maxCanvasPx = isMobile ? 1480 : 1840;
    this.dpr = Math.min(maxCanvasPx / cssSize, baseDpr * (zoomStep / 100));
    const targetW = Math.round(cssSize * this.dpr);
    if (this.canvas && (this.canvas.width !== targetW || this.canvas.height !== targetW)) {
      this.canvas.width = targetW;
      this.canvas.height = targetW;
      this.bgDirty = true;
    }
    this.boardPx = cssSize;
    this.padding = Math.max(4, Math.round(cssSize * 0.008));
    this.cellSize = (cssSize - this.padding * 2) / gridSize;
  }

  public screenToBoardPoint(clientX: number, clientY: number): { x: number; y: number } | null {
    if (typeof this.canvas?.getBoundingClientRect !== 'function') return null;
    const rect = this.canvas.getBoundingClientRect();
    const u = (clientX - rect.left) / Math.max(1, rect.width);
    const v = (clientY - rect.top) / Math.max(1, rect.height);
    let lu = u;
    let lv = v;
    if (this.netQuarterTurns === 1) {
      lu = v;
      lv = 1 - u;
    } else if (this.netQuarterTurns === 2) {
      lu = 1 - u;
      lv = 1 - v;
    } else if (this.netQuarterTurns === 3) {
      lu = 1 - v;
      lv = u;
    }
    const boardDim = this.boardPx > 0 ? this.boardPx : Math.max(1, rect.width);
    return {
      x: lu * boardDim,
      y: lv * boardDim,
    };
  }

  public screenToCell(
    clientX: number,
    clientY: number,
    gridSize: number
  ): { r: number; c: number } | null {
    const pt = this.screenToBoardPoint(clientX, clientY);
    if (!pt) return null;
    const x = pt.x - this.padding;
    const y = pt.y - this.padding;
    const c = Math.floor(x / this.cellSize);
    const r = Math.floor(y / this.cellSize);
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return null;
    return { r, c };
  }

  public cellCenter(r: number, c: number): { x: number; y: number } {
    return {
      x: this.padding + (c + 0.5) * this.cellSize,
      y: this.padding + (r + 0.5) * this.cellSize,
    };
  }

  private renderStaticBg(size: number, mask: number[][], cs: number): void {
    if (typeof document === 'undefined') return;
    if (!this.bgCanvas) {
      this.bgCanvas = document.createElement('canvas');
      this.bgCtx = this.bgCanvas.getContext('2d');
    }
    if (!this.bgCanvas || !this.bgCtx) return;

    const targetW = this.canvas.width;
    const targetH = this.canvas.height;
    if (this.bgCanvas.width !== targetW || this.bgCanvas.height !== targetH) {
      this.bgCanvas.width = targetW;
      this.bgCanvas.height = targetH;
    }

    const bCtx = this.bgCtx;
    bCtx.clearRect(0, 0, targetW, targetH);
    bCtx.save();
    bCtx.scale(this.dpr, this.dpr);

    this.drawBoardTray(bCtx, size, mask, cs);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (mask[r][c] === 0) continue;
        const x = this.padding + c * cs;
        const y = this.padding + r * cs;
        const isEven = (r + c) % 2 === 0;

        bCtx.fillStyle = isEven ? 'rgba(245, 231, 206, 0.96)' : 'rgba(232, 212, 180, 0.95)';
        roundRectPath(bCtx, x + 1, y + 1, cs - 2, cs - 2, cs * 0.15);
        bCtx.fill();

        bCtx.lineWidth = 1.15;
        bCtx.strokeStyle = 'rgba(110, 57, 28, 0.24)';
        bCtx.stroke();
      }
    }
    bCtx.restore();

    this.bgDirty = false;
    this.lastBgKey = `${size}_${this.boardPx}_${this.dpr}`;
  }

  public render(state: CandyRenderState, now: number): void {
    if (!this.ctx) return;
    const {
      size,
      mask,
      jelly,
      ice,
      frosting = [],
      chocolate = [],
      cauldron = [],
      lockGrid = [],
      petrify = [],
      dementor = [],
      decree = [],
      fiendfyre = [],
      horcrux = [],
      mazeConfig = null,
      conveyorLoops = [],
      portals = [],
      ingredientExitCells = [],
      grid,
      selected,
      kbCursor,
      hintPair,
      activeBooster,
      vfx,
    } = state;
    this.resize(size);
    const ctx = this.ctx;
    const cs = this.cellSize;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.clearRect(0, 0, this.boardPx, this.boardPx);

    if (vfx.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * vfx.shake, (Math.random() - 0.5) * vfx.shake);
    }

    const bgKey = `${size}_${this.boardPx}_${this.dpr}`;
    if (this.bgDirty || this.lastBgKey !== bgKey) {
      this.renderStaticBg(size, mask, cs);
    }
    if (this.bgCanvas) {
      ctx.drawImage(this.bgCanvas, 0, 0, this.boardPx, this.boardPx);
    }

    let decreeCenters: Array<{ r: number; c: number }> | null = null;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((decree[r]?.[c] || 0) > 0) {
          if (!decreeCenters) decreeCenters = [];
          decreeCenters.push({ r, c });
        }
      }
    }

    if (mazeConfig && Array.isArray(mazeConfig.rows) && mazeConfig.rows.length > 0) {
      this.drawMazeWindPlates(ctx, mazeConfig, mask, size, cs, now);
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (mask[r][c] === 0) continue;
        const x = this.padding + c * cs;
        const y = this.padding + r * cs;

        if ((jelly[r]?.[c] || 0) > 0) {
          this.drawCandyJelly(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.16, jelly[r][c]);
        }

        if (decreeCenters && !(decree[r]?.[c] > 0)) {
          const inAura = decreeCenters.some(
            (dc) => Math.abs(dc.r - r) <= 1 && Math.abs(dc.c - c) <= 1
          );
          if (inAura) {
            this.drawDecreeAuraCell(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.14);
          }
        }

        const frostLayer = frosting[r]?.[c] || 0;
        if (frostLayer > 0) {
          this.drawRuneFrosting(ctx, x + 2.5, y + 2.5, cs - 5, cs - 5, cs * 0.16, frostLayer);
        }

        const chocoLayer = chocolate[r]?.[c] || 0;
        if (chocoLayer > 0) {
          this.drawSpreadingChocolate(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.16, now);
        }

        const cauldronHp = cauldron[r]?.[c] || 0;
        if (cauldronHp > 0) {
          this.drawMagicCauldron(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.16, cauldronHp, now);
        }

        const dementorHp = dementor[r]?.[c] || 0;
        if (dementorHp > 0) {
          this.drawDementorWraith(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.16, dementorHp, now);
        }

        const decreeHp = decree[r]?.[c] || 0;
        if (decreeHp > 0) {
          this.drawUmbridgeDecreePlaque(
            ctx,
            x + 2,
            y + 2,
            cs - 4,
            cs - 4,
            cs * 0.15,
            decreeHp,
            now
          );
        }

        const fiendfyreHp = fiendfyre[r]?.[c] || 0;
        if (fiendfyreHp > 0) {
          this.drawFiendfyreFlame(
            ctx,
            x + 2,
            y + 2,
            cs - 4,
            cs - 4,
            cs * 0.16,
            fiendfyreHp,
            now
          );
        }

        const horcruxHp = horcrux[r]?.[c] || 0;
        if (horcruxHp > 0) {
          this.drawHorcruxRelic(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.16, horcruxHp, now);
        }

        if (selected && selected.r === r && selected.c === c) {
          roundRectPath(ctx, x + 2, y + 2, cs - 4, cs - 4, cs * 0.16);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
          ctx.fill();
          ctx.lineWidth = 3.2;
          ctx.strokeStyle = '#d97706';
          ctx.stroke();
        } else if (
          hintPair &&
          ((hintPair[0].r === r && hintPair[0].c === c) ||
            (hintPair[1].r === r && hintPair[1].c === c))
        ) {
          const pulse = 0.45 + 0.5 * Math.sin(now * 0.008);
          roundRectPath(ctx, x + 2.5, y + 2.5, cs - 5, cs - 5, cs * 0.16);
          ctx.fillStyle = `rgba(245, 158, 11, ${0.26 * pulse})`;
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = `rgba(180, 83, 9, ${0.45 + 0.55 * pulse})`;
          ctx.stroke();
        }

        if (kbCursor && kbCursor.r === r && kbCursor.c === c) {
          ctx.save();
          roundRectPath(ctx, x + 3.5, y + 3.5, cs - 7, cs - 7, cs * 0.14);
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 2.4;
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    if (conveyorLoops.length > 0) {
      this.drawConveyorPlates(ctx, conveyorLoops, cs, now);
    }

    for (const portal of portals) {
      this.drawFlooPortal(
        ctx,
        portal.from.r,
        portal.from.c,
        cs,
        portal.color || '#10b981',
        true,
        now
      );
      this.drawFlooPortal(
        ctx,
        portal.to.r,
        portal.to.c,
        cs,
        portal.color || '#10b981',
        false,
        now
      );
    }

    for (const ex of ingredientExitCells) {
      if (mask[ex.r]?.[ex.c] === 1) {
        this.drawIngredientExitArrow(ctx, ex.r, ex.c, cs, now);
      }
    }

    if (activeBooster === 'hammer' || activeBooster === 'swap') {
      roundRectPath(
        ctx,
        this.padding - 5,
        this.padding - 5,
        this.boardPx - (this.padding - 5) * 2,
        this.boardPx - (this.padding - 5) * 2,
        20
      );
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 6]);
      ctx.strokeStyle = activeBooster === 'hammer' ? '#fbbf24' : '#38bdf8';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (mask[r][c] === 0) continue;
        const piece = grid[r]?.[c];
        if (!piece) continue;

        const cx = this.padding + (piece.x + 0.5) * cs;
        const cy = this.padding + (piece.y + 0.5) * cs;
        let scale = piece.scale ?? 1;

        if (selected && selected.r === r && selected.c === c) {
          scale *= 1.1 + 0.04 * Math.sin(now * 0.012);
        } else if (
          hintPair &&
          ((hintPair[0].r === r && hintPair[0].c === c) ||
            (hintPair[1].r === r && hintPair[1].c === c))
        ) {
          scale *= 1.05 + 0.05 * Math.sin(now * 0.01);
        } else if (piece.primedWrapped) {
          scale *= 1.12 + 0.08 * Math.sin(now * 0.025);
        } else if (piece.special === 'wrapped') {
          scale *= 1.02 + 0.025 * Math.sin(now * 0.008 + r + c);
        }

        const isPetrified = (petrify[r]?.[c] || 0) > 0;
        this.drawCandyPiece(
          ctx,
          piece,
          cx,
          cy,
          cs * 0.94 * scale,
          isPetrified ? 0.55 : (piece.alpha ?? 1),
          now
        );

        if (isPetrified) {
          const x = this.padding + piece.x * cs + 2;
          const y = this.padding + piece.y * cs + 2;
          this.drawPetrifiedStoneOverlay(ctx, x, y, cs - 4, cs - 4, cs * 0.16, petrify[r][c]);
        }

        if ((ice[r]?.[c] || 0) > 0) {
          const x = this.padding + piece.x * cs + 2;
          const y = this.padding + piece.y * cs + 2;
          this.drawSugarIceLock(ctx, x, y, cs - 4, cs - 4, cs * 0.16, ice[r][c]);
        }

        if ((lockGrid[r]?.[c] || 0) > 0) {
          const x = this.padding + piece.x * cs + 2;
          const y = this.padding + piece.y * cs + 2;
          this.drawGringottsPadlock(ctx, x, y, cs - 4, cs - 4, cs * 0.16, now);
        }
      }
    }

    this.drawVfx(ctx, vfx, cs, size, now);

    ctx.restore();
  }

  private drawLayerBadge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    _h: number,
    count: number,
    bg = '#090d1a',
    border = '#fde047',
    textColor = '#fef08a'
  ): void {
    if (count < 2) return;
    const r = Math.max(6.2, Math.min(9.5, w * 0.2));
    const bx = x + w - r - 1.5;
    const by = y + r + 1.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = border;
    ctx.stroke();

    ctx.font = `900 ${Math.max(8, Math.round(r * 1.18))}px "Be Vietnam Pro", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(String(count), bx, by + 0.5);
    ctx.restore();
  }

  private drawBoardTray(
    ctx: CanvasRenderingContext2D,
    size: number,
    mask: number[][],
    cs: number
  ): void {
    const fillConnectedShape = (expand: number, radius: number) => {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (mask[r][c] === 0) continue;
          const x = this.padding + c * cs - expand;
          const y = this.padding + r * cs - expand;
          const s = cs + expand * 2;
          roundRectPath(ctx, x, y, s, s, radius);
          ctx.fill();

          if (c + 1 < size && mask[r][c + 1] === 1) {
            ctx.fillRect(x + s * 0.5, y, cs, s);
          }
          if (r + 1 < size && mask[r + 1][c] === 1) {
            ctx.fillRect(x, y + s * 0.5, s, cs);
          }
          if (
            r + 1 < size &&
            c + 1 < size &&
            mask[r][c + 1] === 1 &&
            mask[r + 1][c] === 1 &&
            mask[r + 1][c + 1] === 1
          ) {
            ctx.fillRect(x + s * 0.5, y + s * 0.5, cs, cs);
          }
        }
      }
    };

    ctx.save();
    ctx.shadowColor = 'rgba(43, 21, 9, 0.68)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#3b1e0e';
    fillConnectedShape(6.2, cs * 0.24);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#d89e28';
    fillConnectedShape(4.6, cs * 0.22);

    ctx.fillStyle = '#733d1d';
    fillConnectedShape(3.0, cs * 0.19);

    ctx.fillStyle = '#4a2511';
    fillConnectedShape(1.4, cs * 0.16);
    ctx.restore();
  }

  private drawCandyJelly(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    layer: number
  ): void {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    if (layer === 1) {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, 'rgba(244, 63, 94, 0.42)');
      g.addColorStop(0.5, 'rgba(190, 24, 93, 0.34)');
      g.addColorStop(1, 'rgba(157, 23, 77, 0.46)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = 'rgba(157, 23, 77, 0.72)';
      ctx.stroke();
    } else if (layer === 2) {
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, 'rgba(219, 39, 119, 0.78)');
      g.addColorStop(1, 'rgba(112, 26, 117, 0.84)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = '#581c3c';
      ctx.stroke();
    } else {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, layer >= 4 ? 'rgba(190, 24, 93, 0.90)' : 'rgba(147, 51, 234, 0.86)');
      g.addColorStop(1, 'rgba(59, 30, 14, 0.92)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = layer >= 5 ? '#d97706' : '#3b1e0e';
      ctx.stroke();
      this.drawLayerBadge(ctx, x, y, w, h, layer, '#3b1e0e', '#fde047', '#fef08a');
    }

    // Glossy Honeydukes berry-jam highlight arc
    ctx.beginPath();
    ctx.moveTo(x + w * 0.18, y + h * 0.22);
    ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.1, x + w * 0.76, y + h * 0.2);
    ctx.strokeStyle = 'rgba(255, 241, 242, 0.62)';
    ctx.lineWidth = Math.max(1.6, w * 0.045);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  private drawRuneFrosting(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    layer: number
  ): void {
    ctx.save();
    const sprite = this.sprites.frosting_waffle;
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      const pad = -w * 0.03;
      ctx.drawImage(sprite, x + pad, y + pad, w - pad * 2, h - pad * 2);
      if (layer >= 2) {
        roundRectPath(ctx, x + 1.5, y + 1.5, w - 3, h - 3, rad);
        ctx.lineWidth = layer >= 4 ? 3 : 2.2;
        ctx.strokeStyle = layer >= 4 ? '#f59e0b' : 'rgba(236, 72, 153, 0.85)';
        ctx.stroke();
        this.drawLayerBadge(ctx, x, y, w, h, layer, '#3b1e0e', '#fde047', '#fef08a');
      }
      ctx.restore();
      return;
    }

    roundRectPath(ctx, x, y, w, h, rad);
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, '#fde68a');
    g.addColorStop(0.55, '#d97706');
    g.addColorStop(1, '#78350f');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#3b1e0e';
    ctx.stroke();

    if (layer >= 2) {
      this.drawLayerBadge(ctx, x, y, w, h, layer, '#3b1e0e', '#fde047', '#fef08a');
    }
    ctx.restore();
  }

  private drawSpreadingChocolate(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    now: number
  ): void {
    ctx.save();
    const breath = 1 + 0.022 * Math.sin(now * 0.0045 + x * 0.04 + y * 0.04);
    const useDeluxe = (Math.round(x / Math.max(1, w)) + Math.round(y / Math.max(1, h))) % 4 === 3;
    const primary = useDeluxe ? this.sprites.chocolate_deluxe : this.sprites.chocolate_block;
    const sprite =
      primary && primary.complete && primary.naturalWidth > 0
        ? primary
        : this.sprites.chocolate_block;

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const drawW = w * 1.06 * breath;
      const drawH = h * 1.06 * breath;
      ctx.beginPath();
      ctx.ellipse(cx, y + h * 0.88, w * 0.4, h * 0.13, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 30, 14, 0.30)';
      ctx.fill();
      ctx.drawImage(sprite, cx - drawW * 0.5, cy - drawH * 0.5, drawW, drawH);
      ctx.restore();
      return;
    }

    roundRectPath(ctx, x, y, w, h, rad);
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, '#7b3f1d');
    g.addColorStop(0.55, '#5c2c14');
    g.addColorStop(1, '#3b1e0e');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#3b1e0e';
    ctx.stroke();

    const pad = w * 0.15;
    const sq = (w - pad * 2.5) / 2;
    const positions: Array<[number, number]> = [
      [x + pad, y + pad],
      [x + pad * 1.5 + sq, y + pad],
      [x + pad, y + pad * 1.5 + sq],
      [x + pad * 1.5 + sq, y + pad * 1.5 + sq],
    ];
    for (const [sx, sy] of positions) {
      roundRectPath(ctx, sx, sy, sq, sq, 3.5);
      ctx.fillStyle = '#6b3417';
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 230, 138, 0.34)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawPetrifiedStoneOverlay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    layer: number
  ): void {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle = layer >= 2 ? 'rgba(51, 65, 85, 0.72)' : 'rgba(71, 85, 105, 0.52)';
    ctx.fill();
    ctx.lineWidth = layer >= 2 ? 3 : 2.2;
    ctx.strokeStyle = layer >= 3 ? '#fde047' : '#6ee7b7';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w * 0.16, y + h * 0.22);
    ctx.lineTo(x + w * 0.44, y + h * 0.48);
    ctx.lineTo(x + w * 0.28, y + h * 0.82);
    ctx.moveTo(x + w * 0.84, y + h * 0.26);
    ctx.lineTo(x + w * 0.56, y + h * 0.52);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w * 0.17, h * 0.11, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#fde047';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - h * 0.08);
    ctx.lineTo(cx, cy + h * 0.08);
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (layer >= 2) {
      this.drawLayerBadge(ctx, x, y, w, h, layer, '#064e3b', '#6ee7b7', '#fef08a');
    }
    ctx.restore();
  }

  private drawDementorWraith(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    hp: number,
    now: number
  ): void {
    const hover = Math.sin(now * 0.005 + x * 0.04) * 2;
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle = 'rgba(8, 20, 42, 0.92)';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    const cx = x + w * 0.5;
    const cy = y + h * 0.48 + hover;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h * 0.34);
    ctx.quadraticCurveTo(cx + w * 0.34, cy - h * 0.24, cx + w * 0.3, cy + h * 0.24);
    ctx.lineTo(cx + w * 0.14, cy + h * 0.15);
    ctx.lineTo(cx, cy + h * 0.27);
    ctx.lineTo(cx - w * 0.14, cy + h * 0.15);
    ctx.lineTo(cx - w * 0.3, cy + h * 0.24);
    ctx.quadraticCurveTo(cx - w * 0.34, cy - h * 0.24, cx, cy - h * 0.34);
    ctx.closePath();
    ctx.fillStyle = '#020617';
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#7dd3fc';
    ctx.stroke();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(cx - w * 0.08, cy - h * 0.08, Math.max(1.6, w * 0.042), 0, Math.PI * 2);
    ctx.arc(cx + w * 0.08, cy - h * 0.08, Math.max(1.6, w * 0.042), 0, Math.PI * 2);
    ctx.fill();

    const maxPips = Math.max(3, hp);
    const span = w * 0.56;
    for (let i = 0; i < maxPips; i++) {
      const gx = cx - span * 0.5 + (maxPips === 1 ? 0 : (i / (maxPips - 1)) * span);
      const gy = y + h * 0.84;
      ctx.beginPath();
      ctx.arc(gx, gy, Math.max(2, w * 0.052), 0, Math.PI * 2);
      ctx.fillStyle = i < hp ? '#38bdf8' : 'rgba(148, 163, 184, 0.25)';
      ctx.fill();
    }
    ctx.restore();
  }

  private drawMazeWindPlates(
    ctx: CanvasRenderingContext2D,
    mazeConfig: CandyMazeConfig,
    mask: number[][],
    size: number,
    cs: number,
    now: number
  ): void {
    const shift = (((now * 0.002) % 1) + 1) % 1;
    ctx.save();
    mazeConfig.rows.forEach((r, idx) => {
      if (r < 0 || r >= size) return;
      const dir = idx % 2 === 0 ? 1 : -1;
      for (let c = 0; c < size; c++) {
        if (mask[r]?.[c] !== 1) continue;
        const x = this.padding + c * cs + 2;
        const y = this.padding + r * cs + 2;
        const w = cs - 4;
        const h = cs - 4;

        roundRectPath(ctx, x, y, w, h, cs * 0.14);
        ctx.fillStyle = 'rgba(6, 78, 59, 0.34)';
        ctx.fill();
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
        ctx.stroke();

        const cx = x + w * 0.5 + dir * (shift - 0.5) * cs * 0.22;
        const cy = y + h * 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - dir * cs * 0.1, cy - cs * 0.11);
        ctx.lineTo(cx + dir * cs * 0.08, cy);
        ctx.lineTo(cx - dir * cs * 0.1, cy + cs * 0.11);
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.65)';
        ctx.lineWidth = 1.9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  private drawDecreeAuraCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number
  ): void {
    ctx.save();
    roundRectPath(ctx, x + 1, y + 1, w - 2, h - 2, rad);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.11)';
    ctx.fill();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.52)';
    ctx.stroke();
    ctx.restore();
  }

  private drawUmbridgeDecreePlaque(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    hp: number,
    now: number
  ): void {
    const pulse = 0.82 + 0.18 * Math.sin(now * 0.006);
    ctx.save();
    roundRectPath(ctx, x + w * 0.06, y, w * 0.88, h, rad);
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, '#be185d');
    g.addColorStop(0.6, '#831843');
    g.addColorStop(1, '#500724');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = `rgba(253, 224, 71, ${pulse})`;
    ctx.stroke();

    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.24, y + h * 0.28);
    ctx.lineTo(x + w * 0.76, y + h * 0.28);
    ctx.moveTo(x + w * 0.24, y + h * 0.44);
    ctx.lineTo(x + w * 0.72, y + h * 0.44);
    ctx.moveTo(x + w * 0.24, y + h * 0.6);
    ctx.lineTo(x + w * 0.56, y + h * 0.6);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + w * 0.7, y + h * 0.62, w * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();

    this.drawLayerBadge(ctx, x, y, w, h, hp, '#500724', '#f9a8d4', '#fef08a');
    ctx.restore();
  }

  private drawFiendfyreFlame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    hp: number,
    now: number
  ): void {
    const flicker = Math.sin(now * 0.011 + x * 0.1) * (w * 0.045);
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle = 'rgba(67, 20, 7, 0.9)';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = hp >= 2 ? '#fb923c' : '#fde047';
    ctx.stroke();

    const cx = x + w * 0.5;
    const botY = y + h * 0.84;

    ctx.beginPath();
    ctx.moveTo(cx, y + h * 0.12);
    ctx.quadraticCurveTo(cx + w * 0.36 + flicker, y + h * 0.38, cx + w * 0.28, botY);
    ctx.quadraticCurveTo(cx, y + h * 0.92, cx - w * 0.28, botY);
    ctx.quadraticCurveTo(cx - w * 0.36 - flicker, y + h * 0.38, cx, y + h * 0.12);
    ctx.closePath();
    ctx.fillStyle = '#ea580c';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + flicker * 0.4, y + h * 0.3);
    ctx.quadraticCurveTo(cx + w * 0.18, y + h * 0.52, cx + w * 0.14, botY - h * 0.06);
    ctx.quadraticCurveTo(cx, botY, cx - w * 0.14, botY - h * 0.06);
    ctx.quadraticCurveTo(cx - w * 0.18, y + h * 0.52, cx + flicker * 0.4, y + h * 0.3);
    ctx.closePath();
    ctx.fillStyle = hp >= 2 ? '#fef08a' : '#fda4af';
    ctx.fill();

    if (hp >= 2) {
      this.drawLayerBadge(ctx, x, y, w, h, hp, '#431407', '#fb923c', '#fef08a');
    }
    ctx.restore();
  }

  private drawHorcruxRelic(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    hp: number,
    now: number
  ): void {
    const shielded = hp >= 4;
    const pulse = 0.72 + 0.28 * Math.sin(now * 0.008);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    const r = Math.min(w, h) * 0.38;

    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle = shielded ? 'rgba(30, 11, 56, 0.94)' : 'rgba(6, 46, 36, 0.92)';
    ctx.fill();
    ctx.lineWidth = shielded ? 2.8 : 2.2;
    ctx.strokeStyle = shielded ? `rgba(192, 132, 252, ${pulse})` : '#34d399';
    ctx.stroke();

    if (shielded) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#fde047';
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI / 2 + (i * Math.PI) / 3;
      const px = cx + Math.cos(ang) * r * 0.88;
      const py = cy + Math.sin(ang) * r * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = shielded ? '#3b0764' : '#065f46';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = shielded ? '#e879f9' : '#6ee7b7';
    ctx.fill();

    this.drawLayerBadge(
      ctx,
      x,
      y,
      w,
      h,
      hp,
      shielded ? '#581c87' : '#064e3b',
      shielded ? '#fde047' : '#6ee7b7',
      '#ffffff'
    );
    ctx.restore();
  }

  private drawFlooPortal(
    ctx: CanvasRenderingContext2D,
    r: number,
    c: number,
    cs: number,
    color: string,
    isEntrance: boolean,
    now: number
  ): void {
    const x = this.padding + c * cs;
    const y = this.padding + r * cs;
    const cx = x + cs * 0.5;
    const cy = isEntrance ? y + cs - 3 : y + 3;
    const shimmer = 0.65 + 0.3 * Math.sin(now * 0.007 + (isEntrance ? 0 : 1.5));

    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = shimmer;
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cs * 0.38, cs * 0.09, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.globalAlpha = shimmer * 0.32;
    ctx.fill();
    ctx.restore();
  }

  private drawIngredientExitArrow(
    ctx: CanvasRenderingContext2D,
    r: number,
    c: number,
    cs: number,
    now: number
  ): void {
    const center = this.cellCenter(r, c);
    const yBase = this.padding + (r + 1) * cs - 2;
    const bob = Math.sin(now * 0.006) * 2;

    ctx.save();
    ctx.translate(center.x, yBase + bob);
    ctx.beginPath();
    ctx.moveTo(-cs * 0.2, -5);
    ctx.lineTo(cs * 0.2, -5);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();
    ctx.restore();
  }

  private drawSugarIceLock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    layer: number
  ): void {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle =
      layer >= 4
        ? 'rgba(14, 116, 144, 0.52)'
        : layer >= 2
          ? 'rgba(56, 189, 248, 0.36)'
          : 'rgba(125, 211, 252, 0.28)';
    ctx.fill();
    ctx.lineWidth = layer >= 3 ? 3.4 : layer === 2 ? 3 : 2.4;
    ctx.strokeStyle = layer >= 4 ? '#0369a1' : '#0284c7';
    ctx.stroke();

    if (layer >= 2) {
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 5);
      ctx.lineTo(x + w - 5, y + h - 5);
      ctx.moveTo(x + w - 5, y + 5);
      ctx.lineTo(x + 5, y + h - 5);
      ctx.strokeStyle = 'rgba(14, 116, 144, 0.68)';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2.6;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 15);
      ctx.lineTo(x + 15, y + 5);
      ctx.moveTo(x + w - 15, y + h - 5);
      ctx.lineTo(x + w - 5, y + h - 15);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    if (layer >= 3) {
      this.drawLayerBadge(ctx, x, y, w, h, layer, '#083344', '#7dd3fc', '#ffffff');
    }
    ctx.restore();
  }

  private drawCandyPiece(
    ctx: CanvasRenderingContext2D,
    piece: CandyBoardPiece,
    cx: number,
    cy: number,
    drawSize: number,
    alpha = 1,
    now = 0
  ): void {
    if (drawSize <= 2) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    if (piece.isIngredient) {
      this.drawPhilosopherStone(ctx, cx, cy, drawSize, now);
      ctx.restore();
      return;
    }

    if (piece.blocker === 'swirl') {
      this.drawLicoriceSwirl(ctx, cx, cy, drawSize);
      ctx.restore();
      return;
    }

    if (piece.primedWrapped) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, drawSize * 0.56, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.36)';
      ctx.fill();
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = '#fde047';
      ctx.stroke();
      ctx.restore();
    }

    if (piece.special === 'seeker') {
      this.drawGoldenSeekerWings(ctx, cx, cy, drawSize, now);
    }

    const sprite = this.getSpriteForPiece(piece);
    const renderScale = piece.special === 'seeker' ? 0.78 : 1;
    const sSize = drawSize * renderScale;

    ctx.beginPath();
    ctx.ellipse(cx, cy + sSize * 0.39, sSize * 0.33, sSize * 0.11, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 30, 14, 0.25)';
    ctx.fill();

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, cx - sSize / 2, cy - sSize / 2, sSize, sSize);
    } else {
      const r = sSize * 0.4;
      ctx.fillStyle = CANDY_TILE_TYPES[piece.color]?.color || '#ff1e27';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (piece.special === 'seeker') {
      ctx.beginPath();
      ctx.arc(cx, cy, sSize * 0.43, 0, Math.PI * 2);
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();
    }

    if (piece.bombTimer !== null && piece.bombTimer !== undefined) {
      this.drawBombTimerOverlay(ctx, cx, cy, drawSize, piece.bombTimer, now);
    }

    if (piece.hasKey) {
      this.drawSugarKeyBadge(ctx, cx, cy, drawSize, now);
    }

    ctx.restore();
  }

  private drawPhilosopherStone(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    now: number
  ): void {
    const r = size * 0.44;
    const glow = 0.75 + 0.25 * Math.sin(now * 0.006);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(239, 68, 68, ${0.25 * glow})`;
    ctx.fill();

    ctx.beginPath();
    const pts: Array<[number, number]> = [
      [0, -r],
      [r * 0.86, -r * 0.3],
      [r * 0.58, r * 0.88],
      [-r * 0.58, r * 0.88],
      [-r * 0.86, -r * 0.3],
    ];
    pts.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(cx + px, cy + py);
      else ctx.lineTo(cx + px, cy + py);
    });
    ctx.closePath();

    const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#fecaca');
    g.addColorStop(0.35, '#ef4444');
    g.addColorStop(0.8, '#991b1b');
    g.addColorStop(1, '#450a0a');
    ctx.fillStyle = g;
    ctx.fill();

    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#fde047';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.65);
    ctx.lineTo(cx + r * 0.45, cy - r * 0.1);
    ctx.lineTo(cx, cy + r * 0.58);
    ctx.lineTo(cx - r * 0.45, cy - r * 0.1);
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.fill();
    ctx.restore();
  }

  private drawLicoriceSwirl(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ): void {
    const r = size * 0.45;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.82, r * 0.78, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 30, 14, 0.28)';
    ctx.fill();

    const sprite = this.sprites.swirl_piece;
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      const s = size * 0.98;
      ctx.drawImage(sprite, cx - s * 0.5, cy - s * 0.5, s, s);
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#9e6835');
    g.addColorStop(0.65, '#5c2c14');
    g.addColorStop(1, '#3b1e0e');
    ctx.fillStyle = g;
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#3b1e0e';
    ctx.stroke();

    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 3.7; t += 0.22) {
      const rr = (t / (Math.PI * 3.9)) * r * 0.82;
      const px = cx + Math.cos(t) * rr;
      const py = cy + Math.sin(t) * rr;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#f6d59e';
    ctx.lineWidth = Math.max(2.4, size * 0.065);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  private drawGoldenSeekerWings(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    now: number
  ): void {
    const flap = Math.sin(now * 0.016) * 0.22;
    const wingSpan = size * 0.54;

    ctx.save();
    ctx.translate(cx, cy);
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.rotate(flap);
      ctx.beginPath();
      ctx.moveTo(size * 0.14, -size * 0.04);
      ctx.quadraticCurveTo(wingSpan * 0.72, -size * 0.42, wingSpan, -size * 0.18);
      ctx.quadraticCurveTo(wingSpan * 0.76, size * 0.1, size * 0.16, size * 0.1);
      ctx.closePath();
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#b45309';
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  private drawBombTimerOverlay(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    timer: number,
    now: number
  ): void {
    const danger = timer <= 3;
    const pulse = danger ? 1 + 0.1 * Math.sin(now * 0.01) : 1;
    const bx = cx + size * 0.24;
    const by = cy + size * 0.24;
    const br = size * 0.22 * pulse;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx + size * 0.1, cy - size * 0.3);
    ctx.quadraticCurveTo(cx + size * 0.28, cy - size * 0.46, cx + size * 0.34, cy - size * 0.34);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + size * 0.34, cy - size * 0.34, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = danger ? '#ef4444' : '#fef08a';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = danger ? '#991b1b' : '#090d1a';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = danger ? '#fecaca' : '#fde047';
    ctx.stroke();

    ctx.font = `900 ${Math.max(10, Math.round(size * 0.25))}px "Be Vietnam Pro", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(timer), bx, by + 0.5);
    ctx.restore();
  }

  private drawConveyorPlates(
    ctx: CanvasRenderingContext2D,
    conveyorLoops: Array<Array<{ r: number; c: number }>>,
    cs: number,
    now: number
  ): void {
    const phase = (((now * 0.0022) % 1) + 1) % 1;
    ctx.save();
    for (const loop of conveyorLoops) {
      if (!Array.isArray(loop) || loop.length < 2) continue;
      for (let i = 0; i < loop.length; i++) {
        const cur = loop[i];
        const nxt = loop[(i + 1) % loop.length];
        const x = this.padding + cur.c * cs + 2.5;
        const y = this.padding + cur.r * cs + 2.5;
        const w = cs - 5;
        const h = cs - 5;

        roundRectPath(ctx, x, y, w, h, cs * 0.14);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.52)';
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.62)';
        ctx.stroke();

        const dx = nxt.c - cur.c;
        const dy = nxt.r - cur.r;
        const angle = Math.atan2(dy, dx);
        const shift = (phase - 0.5) * cs * 0.22;
        const cx = x + w * 0.5 + Math.cos(angle) * shift;
        const cy = y + h * 0.5 + Math.sin(angle) * shift;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-cs * 0.12, -cs * 0.14);
        ctx.lineTo(cs * 0.08, 0);
        ctx.lineTo(-cs * 0.12, cs * 0.14);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.72)';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  private drawMagicCauldron(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    hp: number,
    now: number
  ): void {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a855f7';
    ctx.stroke();

    const cx = x + w * 0.5;
    const cy = y + h * 0.55;
    const potW = w * 0.68;
    const potH = h * 0.54;

    ctx.beginPath();
    ctx.ellipse(cx, cy + potH * 0.06, potW * 0.5, potH * 0.48, 0, 0, Math.PI * 2);
    const potGrad = ctx.createRadialGradient(
      cx - potW * 0.15,
      cy - potH * 0.1,
      2,
      cx,
      cy,
      potW * 0.55
    );
    potGrad.addColorStop(0, '#4c1d95');
    potGrad.addColorStop(0.65, '#1e1b4b');
    potGrad.addColorStop(1, '#090d1a');
    ctx.fillStyle = potGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fde047';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.34, potW * 0.44, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    const b1 = Math.sin(now * 0.006) * 2.2;
    const b2 = Math.cos(now * 0.007) * 2.2;
    ctx.fillStyle = '#bef264';
    ctx.beginPath();
    ctx.arc(cx - w * 0.11, y + h * 0.28 + b1, w * 0.055, 0, Math.PI * 2);
    ctx.arc(cx + w * 0.12, y + h * 0.25 + b2, w * 0.045, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 3; i++) {
      const gx = cx + (i - 1) * w * 0.19;
      const gy = y + h * 0.8;
      ctx.beginPath();
      ctx.arc(gx, gy, w * 0.062, 0, Math.PI * 2);
      ctx.fillStyle = i < hp ? '#fde047' : 'rgba(148, 163, 184, 0.25)';
      ctx.fill();
    }
    ctx.restore();
  }

  private drawGringottsPadlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    now: number
  ): void {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, rad);
    ctx.fillStyle = 'rgba(120, 53, 15, 0.24)';
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 4, y + 4);
    ctx.lineTo(x + w - 4, y + h - 4);
    ctx.moveTo(x + w - 4, y + 4);
    ctx.lineTo(x + 4, y + h - 4);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    const cx = x + w * 0.5;
    const cy = y + h * 0.54;
    const lw = w * 0.36;
    const lh = h * 0.3;
    const pulse = 0.85 + 0.15 * Math.sin(now * 0.006);

    ctx.beginPath();
    ctx.arc(cx, cy - lh * 0.45, lw * 0.32, Math.PI, 0, false);
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    roundRectPath(ctx, cx - lw * 0.5, cy - lh * 0.45, lw, lh, 4);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = `rgba(254, 240, 138, ${pulse})`;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, lw * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#fef9c3';
    ctx.fill();
    ctx.restore();
  }

  private drawSugarKeyBadge(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    now: number
  ): void {
    const kx = cx - size * 0.24;
    const ky = cy - size * 0.24;
    const kr = size * 0.21;
    const bob = Math.sin(now * 0.009) * 1.6;

    ctx.save();
    ctx.translate(kx, ky + bob);
    ctx.beginPath();
    ctx.arc(0, 0, kr, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-kr * 0.22, -kr * 0.12, kr * 0.28, 0, Math.PI * 2);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(kr * 0.48, kr * 0.36);
    ctx.moveTo(kr * 0.28, kr * 0.22);
    ctx.lineTo(kr * 0.14, kr * 0.42);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  private drawVfx(
    ctx: CanvasRenderingContext2D,
    vfx: CandyVfxBundle,
    cs: number,
    size: number,
    now: number
  ): void {
    for (const b of vfx.beams) {
      const p = 1 - b.life / b.maxLife;
      const alpha = Math.max(0, 1 - p);
      ctx.save();
      ctx.globalAlpha = alpha;
      const center = this.cellCenter(b.r, b.c);
      const thickness = cs * b.widthFactor * (1.05 - p * 0.45);
      if (b.dir === 'h') {
        const cStart = b.cStart ?? 0;
        const cEnd = b.cEnd ?? size - 1;
        const x0 = this.padding + cStart * cs;
        const spanW = Math.max(cs, (cEnd - cStart + 1) * cs);
        const g = ctx.createLinearGradient(
          0,
          center.y - thickness / 2,
          0,
          center.y + thickness / 2
        );
        g.addColorStop(0, 'rgba(255, 255, 255, 0)');
        g.addColorStop(0.25, b.color || '#ff66b3');
        g.addColorStop(0.5, '#ffffff');
        g.addColorStop(0.75, b.color || '#ff66b3');
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(x0, center.y - thickness / 2, spanW, thickness);
      } else {
        const rStart = b.rStart ?? 0;
        const rEnd = b.rEnd ?? size - 1;
        const y0 = this.padding + rStart * cs;
        const spanH = Math.max(cs, (rEnd - rStart + 1) * cs);
        const g = ctx.createLinearGradient(
          center.x - thickness / 2,
          0,
          center.x + thickness / 2,
          0
        );
        g.addColorStop(0, 'rgba(255, 255, 255, 0)');
        g.addColorStop(0.25, b.color || '#ff66b3');
        g.addColorStop(0.5, '#ffffff');
        g.addColorStop(0.75, b.color || '#ff66b3');
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(center.x - thickness / 2, y0, thickness, spanH);
      }
      ctx.restore();
    }

    for (const sk of vfx.seekers || []) {
      const t = Math.min(1, Math.max(0, 1 - sk.life / sk.maxLife));
      const from = this.cellCenter(sk.r1, sk.c1);
      const to = this.cellCenter(sk.r2, sk.c2);
      const midX = (from.x + to.x) * 0.5;
      const midY = Math.min(from.y, to.y) - cs * 1.15;
      const inv = 1 - t;
      const x = inv * inv * from.x + 2 * inv * t * midX + t * t * to.x;
      const y = inv * inv * from.y + 2 * inv * t * midY + t * t * to.y;

      ctx.save();
      this.drawGoldenSeekerWings(ctx, x, y, cs * 0.72, now);
      ctx.beginPath();
      ctx.arc(x, y, cs * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = sk.color || '#fde047';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();
    }

    for (const arc of vfx.arcs) {
      const alpha = Math.max(0, arc.life / arc.maxLife);
      const from = this.cellCenter(arc.r1, arc.c1);
      const to = this.cellCenter(arc.r2, arc.c2);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = arc.color || '#ffeb3b';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      const steps = 5;
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        ctx.lineTo(
          from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 14,
          from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 14
        );
      }
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
    }

    for (const ring of vfx.rings) {
      const p = 1 - ring.life / ring.maxLife;
      const center = this.cellCenter(ring.r, ring.c);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.strokeStyle = ring.color || '#ffffff';
      ctx.lineWidth = Math.max(2, 7 * (1 - p));
      ctx.beginPath();
      ctx.arc(center.x, center.y, cs * (0.3 + p * ring.maxRadiusCells), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (vfx.particles && vfx.particles.length > 0) {
      for (let i = 0; i < vfx.particles.length; i++) {
        const pt = vfx.particles[i];
        const alpha = Math.max(0, pt.life / pt.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    for (const pop of vfx.popups) {
      const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.45);
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.font = `800 ${pop.size}px "Be Vietnam Pro", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 5.5;
      ctx.strokeStyle = '#090514';
      ctx.strokeText(pop.text, pop.x, pop.y);
      ctx.fillStyle = pop.color || '#fde047';
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    }
  }
}
