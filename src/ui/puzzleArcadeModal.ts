import { formatDurationCompactVi } from '../data/catalog';
import { getMilestoneBossMeta, MAX_MINIGAME_STAGE } from '../data/match3Levels';
import { SpriteRegistry } from '../engine/spriteLoader';
import type {
  ChessWorkerRequestMessage,
  ChessWorkerResponseMessage,
} from '../sim/chessAi.worker';
import {
  CARO_BOARD_SIZE,
  CaroGameEngine,
  CaroStone,
  ChessPiece,
  ChessPieceType,
  ChessSubMode,
  CREATURE_ONET_SPECIES,
  CreatureOnetEngine,
  JIGSAW_VIRTUAL_H,
  JIGSAW_VIRTUAL_W,
  LayeredTileCard,
  OnetPoint,
  SudokuPuzzleEngine,
  TILE_MATCH_SYMBOLS,
  TILE_TRAY_CAPACITY,
  TileMatchZenEngine,
  TurningPointReview,
  WizardChessEngine,
  WizardingPortraitKey,
} from '../sim/puzzleArcadeEngine';
import { MAX_DAILY_MINIGAME_RESCUES } from '../sim/neighborSocial';
import { ParkSimulation } from '../sim/simulation';
import {
  ACTIVE_MINIGAME_RESUME_KEY,
  ActiveMinigameResumeRecord,
  BuildReductionResult,
  LeaderboardRankChange,
  MinigameRescueContext,
  PuzzleArcadeMode,
} from '../types/game';

const PA_VIRTUAL_W = JIGSAW_VIRTUAL_W; // 692
const PA_VIRTUAL_H = JIGSAW_VIRTUAL_H; // 504

// Classic Sudoku ("Số Học Huyền Bí") 9x9 virtual layout in Hang Sóc parlor style (662 x 502 desktop, 502 x 568 portrait)
const SUDOKU_BOARD_X = 8;
const SUDOKU_BOARD_Y = 8;
const SUDOKU_CELL_PX = 54; // 9 * 54 = 486
const SUDOKU_BOARD_PX = 9 * SUDOKU_CELL_PX;
const SUDOKU_PAD_X = 505;
const SUDOKU_PAD_Y = 6;
const SUDOKU_PAD_W = 151;
const SUDOKU_PAD_H = 490;
const SUDOKU_DESKTOP_W = 662;
const SUDOKU_DESKTOP_H = 502;
const SUDOKU_MOBILE_W = 502;
const SUDOKU_MOBILE_H = 568;

// Caro 13x13 full-square virtual layout (504 x 504 — 100% board, zero side dead-space)
const CARO_VIRTUAL_PX = 504;
const CARO_FRAME_X = 6;
const CARO_FRAME_Y = 6;
const CARO_FRAME_PX = 492;
const CARO_ORIGIN_X = 24;
const CARO_ORIGIN_Y = 24;
const CARO_STEP_PX = 38; // 12 intervals * 38 = 456 (24..480)

// Wizard's Chess 8x8 full-square virtual layout (504 x 504 — 100% board, zero side dead-space)
const CHESS_VIRTUAL_PX = 504;
const CHESS_BOARD_X = 12;
const CHESS_BOARD_Y = 12;
const CHESS_CELL_PX = 60; // 8 * 60 = 480 (12..492)
const CHESS_BOARD_PX = 8 * CHESS_CELL_PX;

const HP_CHESS_PIECE_KEYS = [
  'wk',
  'wq',
  'wb',
  'wn',
  'wr',
  'wp',
  'bk',
  'bq',
  'bb',
  'bn',
  'br',
  'bp',
] as const;

const HP_CHESS_PIECE_META: Record<
  string,
  { name: string; roleVi: string; glyph: string; spellName: string }
> = {
  wk: {
    name: 'Tượng Vua Hiệp Sĩ',
    roleVi: 'Vua Trắng Ngà',
    glyph: '♚',
    spellName: 'Kiếm Vương Khai Trận',
  },
  wq: {
    name: 'Tượng Hậu Chiến Binh',
    roleVi: 'Hậu Trắng Ngà',
    glyph: '♛',
    spellName: 'Quyền Trượng Hoàng Gia',
  },
  wb: {
    name: 'Tượng Giám Mục Đá',
    roleVi: 'Tượng Trắng Ngà',
    glyph: '♝',
    spellName: 'Trượng Pháp Đường Chéo',
  },
  wn: {
    name: 'Tượng Chiến Mã Giáp Đá',
    roleVi: 'Mã Trắng Ngà',
    glyph: '♞',
    spellName: 'Vó Thiết Mã Xung Phong',
  },
  wr: {
    name: 'Tượng Tháp Thành Trì',
    roleVi: 'Xe Trắng Ngà',
    glyph: '♜',
    spellName: 'Pháo Đài Đá Cẩm Thạch',
  },
  wp: {
    name: 'Tượng Lính Khiên Đá',
    roleVi: 'Tốt Trắng Ngà',
    glyph: '♟',
    spellName: 'Lá Chắn Tiên Phong',
  },
  bk: {
    name: 'Tượng Vua Hiệp Sĩ',
    roleVi: 'Vua Đá Đen',
    glyph: '♚',
    spellName: 'Kiếm Vương Lục Bảo',
  },
  bq: {
    name: 'Tượng Hậu Chiến Binh',
    roleVi: 'Hậu Đá Đen',
    glyph: '♛',
    spellName: 'Quyền Trượng Bạc Đen',
  },
  bb: {
    name: 'Tượng Giám Mục Đá',
    roleVi: 'Tượng Đá Đen',
    glyph: '♝',
    spellName: 'Trượng Ngọc Xuyên Tâm',
  },
  bn: {
    name: 'Tượng Chiến Mã Giáp Đá',
    roleVi: 'Mã Đá Đen',
    glyph: '♞',
    spellName: 'Thiết Mã Huyền Thạch',
  },
  br: {
    name: 'Tượng Tháp Thành Trì',
    roleVi: 'Xe Đá Đen',
    glyph: '♜',
    spellName: 'Pháo Đài Huyền Vũ',
  },
  bp: {
    name: 'Tượng Lính Khiên Đá',
    roleVi: 'Tốt Đá Đen',
    glyph: '♟',
    spellName: 'Khiên Đá Hộ Vệ',
  },
};

export type SudokuDisplayMode = 'relic_num' | 'relic_only' | 'num_only';
type SudokuQuickActionKey = 'undo' | 'erase' | 'notes' | 'hint';

const HP_CARO_SEAL_KEYS = ['phoenix_seal', 'dark_mark_seal'] as const;

const PORTRAIT_SPRITE_CROPS: Record<
  WizardingPortraitKey,
  {
    spriteKey?: string;
    chessPieceKey?: string;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    bgTop: string;
    bgBot: string;
  }
> = {
  ron: {
    spriteKey: 'guest_ron_gnome',
    sx: 0.04,
    sy: 0.01,
    sw: 0.56,
    sh: 0.56,
    bgTop: '#fde68a',
    bgBot: '#b45309',
  },
  molly: {
    spriteKey: 'staff_molly_weasley',
    sx: 0.05,
    sy: 0.0,
    sw: 0.78,
    sh: 0.58,
    bgTop: '#fed7aa',
    bgBot: '#9a3412',
  },
  arthur: {
    spriteKey: 'staff_arthur_weasley',
    sx: 0.06,
    sy: 0.0,
    sw: 0.74,
    sh: 0.56,
    bgTop: '#d9f99d',
    bgBot: '#4d7c0f',
  },
  hagrid: {
    spriteKey: 'staff_hagrid_farm',
    sx: 0.14,
    sy: 0.0,
    sw: 0.78,
    sh: 0.54,
    bgTop: '#fde68a',
    bgBot: '#78350f',
  },
  professor: {
    spriteKey: 'staff_wizard',
    sx: 0.14,
    sy: 0.0,
    sw: 0.68,
    sh: 0.52,
    bgTop: '#fecdd3',
    bgBot: '#881337',
  },
  deatheater: {
    chessPieceKey: 'bp',
    sx: 0.1,
    sy: 0.02,
    sw: 0.8,
    sh: 0.72,
    bgTop: '#6ee7b7',
    bgBot: '#064e3b',
  },
  thestral: {
    chessPieceKey: 'bn',
    sx: 0.08,
    sy: 0.02,
    sw: 0.84,
    sh: 0.72,
    bgTop: '#5eead4',
    bgBot: '#0f172a',
  },
  snape: {
    chessPieceKey: 'bb',
    sx: 0.1,
    sy: 0.02,
    sw: 0.8,
    sh: 0.72,
    bgTop: '#34d399',
    bgBot: '#022c22',
  },
  bellatrix: {
    chessPieceKey: 'bq',
    sx: 0.08,
    sy: 0.02,
    sw: 0.84,
    sh: 0.72,
    bgTop: '#a7f3d0',
    bgBot: '#064e3b',
  },
  voldemort: {
    chessPieceKey: 'bk',
    sx: 0.1,
    sy: 0.02,
    sw: 0.8,
    sh: 0.72,
    bgTop: '#6ee7b7',
    bgBot: '#022c22',
  },
};

// Tile Match 3D virtual layout (inside 680 x 440)
const TILE_CARD_W = 60;
const TILE_CARD_H = 70;
const TILE_GRID_ORIGIN_X = 132;
const TILE_GRID_ORIGIN_Y = 24;
const TILE_STEP_X = 62;
const TILE_STEP_Y = 62;
const TILE_TRAY_X = 104;
const TILE_TRAY_Y = 346;
const TILE_TRAY_SLOT_W = 64;
const TILE_TRAY_W = TILE_TRAY_CAPACITY * TILE_TRAY_SLOT_W + 24; // 472
const TILE_TRAY_H = 78;

interface ArcadeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vRot: number;
  age: number;
  duration: number;
  color: string;
}

interface FlyingTileAnim {
  symbolId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  age: number;
  duration: number;
}

interface ChessMoveAnim {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
  piece: ChessPiece;
  age: number;
  duration: number;
}

interface ChessSpellBeamAnim {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  isWhiteCaster: boolean;
  age: number;
  duration: number;
}

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const rad = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export class PuzzleArcadeModalController {
  private root: HTMLElement;
  private sim: ParkSimulation;
  private onParentRefresh: () => void;
  private showToast: (msg: string, icon?: string) => void;
  private onSwitchToMatch3: () => void;
  public onOpenLeaderboard?: (mode: PuzzleArcadeMode) => void;
  private sprites?: SpriteRegistry;

  private iconImages = new Map<string, HTMLImageElement>();
  private chessPieceImages = new Map<string, HTMLImageElement>();
  private caroSealImages = new Map<string, HTMLImageElement>();
  private parlorBgImage: HTMLImageElement | null = null;
  private greatHallBgImage: HTMLImageElement | null = null;
  private marauderCaroBgImage: HTMLImageElement | null = null;
  private unicornLakeBgImage: HTMLImageElement | null = null;

  public mode: PuzzleArcadeMode = 'caro';
  public sudokuDisplayMode: SudokuDisplayMode = 'num_only';
  public sudokuEngine: SudokuPuzzleEngine | null = null;
  public caroEngine: CaroGameEngine | null = null;
  public chessEngine: WizardChessEngine | null = null;
  public onetEngine: CreatureOnetEngine | null = null;
  public tileEngine: TileMatchZenEngine | null = null;
  private chessForceSubMode?: ChessSubMode;
  private aiThinkTimer = 0;
  private sudokuPadRects = new Map<number, { x: number; y: number; w: number; h: number }>();
  private sudokuActionRects = new Map<
    SudokuQuickActionKey,
    { x: number; y: number; w: number; h: number }
  >();
  private sudokuHoverCell: { r: number; c: number } | null = null;
  private sudokuHoverPadDigit: number | null = null;
  private sudokuHoverAction: SudokuQuickActionKey | null = null;
  private caroHoverCell: { r: number; c: number } | null = null;
  private caroLastMoveAnim: { r: number; c: number; age: number; duration: number } | null = null;
  private caroWinRevealTimer = 0;
  private caroFireworkTimer = 0;
  private chessDragFrom: { r: number; c: number } | null = null;
  private chessHoverSquare: { r: number; c: number } | null = null;
  private chessMoveAnim: ChessMoveAnim | null = null;
  private chessSpellBeams: ChessSpellBeamAnim[] = [];
  private chessShakeTimer = 0;
  private chessShakeAmp = 0;
  private chessWorker: Worker | null = null;
  private chessWorkerReqSeq = 0;
  private pendingChessWorkerReqId: number | null = null;
  private hitStopTimer = 0;
  private inspectingTurningPoint = false;
  private companionCharge = 0;
  private snackPieUsedThisAttempt = false;
  private lossStreakResetForStage = false;
  private sudokuAutoSaveAccumSec = 0;

  private victoryClaimed = false;
  public rescueContext: MinigameRescueContext | null = null;

  public resetSession(): void {
    this.pendingChessWorkerReqId = null;
    this.aiThinkTimer = 0;
    this.sudokuEngine = null;
    this.caroEngine = null;
    this.chessEngine = null;
    this.onetEngine = null;
    this.tileEngine = null;
    this.victoryClaimed = false;
    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    const dlg = this.root.querySelector('#puzzleDialog') as HTMLDialogElement | null;
    if (dlg?.open) {
      dlg.close();
    }
  }
  private rescueVictoryOutcome: {
    tokensEarned: number;
    goldEarned: number;
    xpEarned: number;
    buildReduction?: BuildReductionResult;
  } | null = null;
  private lastSeenSosRescuedAt = 0;
  private victorySummary: {
    starsEarned: number;
    sandEarned: number;
    goldEarned: number;
    xpEarned: number;
    newlyRestoredPainting: boolean;
    nextStage: number;
    featuredBonusApplied?: boolean;
    newMasterLevel?: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
  } | null = null;

  private canvas: HTMLCanvasElement | null = null;
  private rafId = 0;
  private lastFrameTs = 0;
  private particles: ArcadeParticle[] = [];
  private flyingTiles: FlyingTileAnim[] = [];

  // Pointer interaction state
  private activePointerId: number | null = null;
  private pointerDownPos: { vx: number; vy: number } | null = null;
  private pointerCurrPos: { vx: number; vy: number } = { vx: -999, vy: -999 };
  private hasDragged = false;

  // Magical Creatures Onet Connect interaction & VFX
  private onetHoverCell: OnetPoint | null = null;
  private onetCursorCell: OnetPoint | null = null;
  private onetBlockedFlash: { r: number; c: number; age: number; duration: number } | null = null;
  private onetBeams: Array<{
    points: Array<{ x: number; y: number }>;
    accent: string;
    age: number;
    duration: number;
  }> = [];
  private onetSlideAnims = new Map<
    string,
    { fromR: number; fromC: number; age: number; duration: number }
  >();
  private onetWinRevealTimer = 0;
  private hoveredTileUid: number | null = null;

  constructor(
    root: HTMLElement,
    sim: ParkSimulation,
    onParentRefresh: () => void,
    showToast: (msg: string, icon?: string) => void,
    onSwitchToMatch3: () => void,
    sprites?: SpriteRegistry
  ) {
    this.root = root;
    this.sim = sim;
    this.onParentRefresh = onParentRefresh;
    this.showToast = showToast;
    this.onSwitchToMatch3 = onSwitchToMatch3;
    this.sprites = sprites;
    this.preloadAssets();

    const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mql = window.matchMedia('(max-width: 740px)');
      mql.addEventListener?.('change', () => {
        if (dlg?.open) {
          this.renderDOM();
        }
      });
    }
    dlg?.addEventListener('close', () => {
      dlg.returnValue = '';
      this.pendingChessWorkerReqId = null;
      this.hitStopTimer = 0;
      this.inspectingTurningPoint = false;
      if (this.caroWinRevealTimer > 0 && !this.victoryClaimed) {
        this.caroWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (this.onetWinRevealTimer > 0 && !this.victoryClaimed) {
        this.onetWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (this.rescueContext) {
        this.rescueContext = null;
        this.rescueVictoryOutcome = null;
        this.sudokuEngine = null;
        this.caroEngine = null;
        this.chessEngine = null;
        this.onetEngine = null;
      } else {
        this.persistModeSession(this.mode, true);
      }
      if (typeof document === 'undefined' || !document.hidden) {
        this.clearActiveModalResumeMarker();
      }
      this.stopLoop();
      this.onParentRefresh();
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flushArcadeAndModalBeforeHide();
        } else {
          this.lastFrameTs = performance.now();
          const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
          if (openDlg?.open) {
            if (!this.rafId) {
              this.startLoop();
            }
            this.renderDOM();
            this.drawFrame();
          }
        }
      });
    }

    if (typeof window !== 'undefined') {
      const flushOnHide = () => {
        this.flushArcadeAndModalBeforeHide();
      };
      window.addEventListener('pagehide', flushOnHide);
      window.addEventListener('beforeunload', flushOnHide);
      window.addEventListener('hangsoc:before-sw-reload', flushOnHide);
      window.addEventListener('pageshow', () => {
        this.lastFrameTs = performance.now();
        const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
        if (openDlg?.open) {
          if (!this.rafId) {
            this.startLoop();
          }
          this.renderDOM();
          this.drawFrame();
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
      const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      if (!openDlg?.open || this.victoryClaimed) return;

      if (
        this.mode === 'blocks' &&
        this.onetEngine &&
        (this.onetEngine.status === 'playing' || this.onetEngine.status === 'lost')
      ) {
        const oe = this.onetEngine;
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          (this.root.querySelector('#btnPaOnetShuffle') as HTMLButtonElement | null)?.click();
          return;
        }
        if (oe.status === 'playing') {
          if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            (this.root.querySelector('#btnPaOnetHint') as HTMLButtonElement | null)?.click();
            return;
          }
          if (
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight'
          ) {
            e.preventDefault();
            const cur = this.onetCursorCell ?? oe.selected ?? { r: 0, c: 0 };
            const dr = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
            const dc = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
            this.onetCursorCell = {
              r: (cur.r + dr + oe.rows) % oe.rows,
              c: (cur.c + dc + oe.cols) % oe.cols,
            };
            return;
          }
          if ((e.key === 'Enter' || e.key === ' ') && this.onetCursorCell) {
            e.preventDefault();
            this.handleOnetCellTap(this.onetCursorCell.r, this.onetCursorCell.c);
            return;
          }
        }
      }

      if (
        this.mode === 'chess' &&
        this.chessEngine &&
        this.chessEngine.status === 'playing' &&
        (e.key === 'h' || e.key === 'H')
      ) {
        e.preventDefault();
        (this.root.querySelector('#btnPaChessAssist') as HTMLButtonElement | null)?.click();
        return;
      }

      if (
        this.mode !== 'sudoku' ||
        !this.sudokuEngine ||
        (this.sudokuEngine.status !== 'playing' && this.sudokuEngine.status !== 'lost')
      ) {
        return;
      }
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        this.triggerSudokuUndoAction();
      } else if (e.key >= '1' && e.key <= '9' && this.sudokuEngine.status === 'playing') {
        e.preventDefault();
        this.applySudokuDigit(Number(e.key));
      } else if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.code === 'Backspace' ||
        e.code === 'Delete' ||
        e.key === '0' ||
        e.code === 'Digit0' ||
        e.code === 'Numpad0' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'x' ||
        e.key === 'X'
      ) {
        e.preventDefault();
        this.triggerSudokuClearAction(false);
      } else if ((e.key === 'n' || e.key === 'N') && this.sudokuEngine.status === 'playing') {
        e.preventDefault();
        this.sudokuEngine.pencilMode = !this.sudokuEngine.pencilMode;
        if (this.sudokuEngine.pencilMode) {
          this.sudokuEngine.eraseMode = false;
        }
        this.persistSudokuSession(true);
        this.sim.audio.playClick();
        this.renderDOM();
      } else if ((e.key === 'h' || e.key === 'H') && this.sudokuEngine.status === 'playing') {
        e.preventDefault();
        this.triggerSudokuHintAction();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(-1, 0);
        this.persistSudokuSession(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(1, 0);
        this.persistSudokuSession(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(0, -1);
        this.persistSudokuSession(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(0, 1);
        this.persistSudokuSession(false);
      }
      });
    }
  }

  private isMobileBoardLayout(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    if (window.matchMedia('(orientation: landscape) and (max-height: 620px)').matches) {
      return false;
    }
    return window.matchMedia('(max-width: 979px)').matches;
  }

  private getVirtualCanvasSize(): { w: number; h: number } {
    switch (this.mode) {
      case 'caro':
        return { w: CARO_VIRTUAL_PX, h: CARO_VIRTUAL_PX };
      case 'chess':
        return { w: CHESS_VIRTUAL_PX, h: CHESS_VIRTUAL_PX };
      case 'sudoku':
        return this.isMobileBoardLayout()
          ? { w: SUDOKU_MOBILE_W, h: SUDOKU_MOBILE_H }
          : { w: SUDOKU_DESKTOP_W, h: SUDOKU_DESKTOP_H };
      case 'blocks': {
        if (this.canvas && typeof this.canvas.getBoundingClientRect === 'function') {
          const r = this.canvas.getBoundingClientRect();
          if (r.width >= 60 && r.height >= 60) {
            return { w: Math.round(r.width), h: Math.round(r.height) };
          }
        }
        return this.isMobileBoardLayout() ? { w: 540, h: 810 } : { w: 864, h: 540 };
      }
    }
  }

  private preloadAssets(): void {
    const parlorImg = new Image();
    parlorImg.decoding = 'async';
    parlorImg.src = '/paintings/burrow_parlor_bg.jpg';
    this.parlorBgImage = parlorImg;

    const hallImg = new Image();
    hallImg.decoding = 'async';
    hallImg.src = '/paintings/great_hall_chess_bg.jpg';
    this.greatHallBgImage = hallImg;

    const marauderImg = new Image();
    marauderImg.decoding = 'async';
    marauderImg.src = '/paintings/marauder_caro_bg.jpg';
    this.marauderCaroBgImage = marauderImg;

    const unicornLakeImg = new Image();
    unicornLakeImg.decoding = 'async';
    unicornLakeImg.src = '/paintings/p5_unicorn_lake.jpg';
    this.unicornLakeBgImage = unicornLakeImg;

    for (const key of HP_CHESS_PIECE_KEYS) {
      const pImg = new Image();
      pImg.decoding = 'async';
      pImg.src = `/paintings/chess/${key}.png`;
      this.chessPieceImages.set(key, pImg);
    }

    for (const sealKey of HP_CARO_SEAL_KEYS) {
      const sImg = new Image();
      sImg.decoding = 'async';
      sImg.src = `/paintings/caro/${sealKey}.png`;
      this.caroSealImages.set(sealKey, sImg);
    }

    const spriteKeys = new Set<string>([
      ...CREATURE_ONET_SPECIES.map((s) => s.spriteKey),
      ...TILE_MATCH_SYMBOLS.map((s) => s.spriteKey),
      ...Object.values(PORTRAIT_SPRITE_CROPS)
        .map((v) => v.spriteKey)
        .filter((k): k is string => Boolean(k)),
      'm3_icon_star',
      'ui_icon_hammer_wand',
      'ui_icon_golden_sickle',
    ]);
    for (const key of spriteKeys) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/sprites/${key}.png`;
      this.iconImages.set(key, img);
    }
  }

  private getCaroSealImage(stone: 1 | 2): HTMLImageElement | null {
    const key = stone === 1 ? 'phoenix_seal' : 'dark_mark_seal';
    const img = this.caroSealImages.get(key);
    if (img && img.complete && img.naturalWidth > 0) return img;
    return null;
  }

  private getSpriteImage(key: string): HTMLImageElement | null {
    const fromReg = this.sprites?.getRaw(key);
    if (fromReg && fromReg.complete && fromReg.naturalWidth > 0) return fromReg;
    const local = this.iconImages.get(key);
    if (local && local.complete && local.naturalWidth > 0) return local;
    return null;
  }

  public open(initialMode?: PuzzleArcadeMode): void {
    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    const rawMode = initialMode ?? this.sim.state.puzzleArcade?.activeMode ?? 'caro';
    const targetMode: PuzzleArcadeMode =
      rawMode === 'sudoku' ||
      rawMode === 'caro' ||
      rawMode === 'chess' ||
      rawMode === 'blocks'
        ? rawMode
        : 'caro';
    this.mode = targetMode;
    this.sim.state.puzzleArcade.activeMode = targetMode;
    this.sim.setLastPlayedMinigame(targetMode);
    this.ensureEngineForMode(targetMode, false);
    this.lastSeenSosRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;

    const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    if (!dlg) return;
    this.renderDOM();
    if (!dlg.open) {
      dlg.showModal();
    }
    if (!this.rescueContext) {
      this.persistModeSession(targetMode, true);
      this.persistActiveModalResumeMarker();
    } else {
      this.clearActiveModalResumeMarker();
    }
    this.startLoop();
    this.onParentRefresh();
  }

  public openRescue(ctx: MinigameRescueContext): void {
    if (ctx.kind === 'match3') return;
    const check = this.sim.canRescueNeighborMinigame(ctx.neighborId);
    if (!check.ok) {
      this.showToast(check.reason ?? 'Không thể giải cứu màn này lúc này!', '🦉');
      return;
    }
    this.clearActiveModalResumeMarker();
    this.rescueContext = { ...ctx };
    this.rescueVictoryOutcome = null;
    this.mode = ctx.kind;
    this.resetInteractionState();
    this.ensureEngineForMode(ctx.kind, true);

    const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    if (!dlg) return;
    this.renderDOM();
    if (!dlg.open) {
      dlg.showModal();
    }
    this.startLoop();
    this.onParentRefresh();
  }

  public switchMode(nextMode: PuzzleArcadeMode): void {
    if ((this.caroWinRevealTimer > 0 || this.onetWinRevealTimer > 0) && !this.victoryClaimed) {
      this.caroWinRevealTimer = 0;
      this.onetWinRevealTimer = 0;
      this.checkAndClaimVictory();
    }
    if (!this.rescueContext) {
      this.persistModeSession(this.mode, false);
    }
    this.mode = nextMode;
    this.sim.state.puzzleArcade.activeMode = nextMode;
    this.sim.setLastPlayedMinigame(nextMode);
    this.resetInteractionState();
    this.ensureEngineForMode(nextMode, false);
    if (!this.rescueContext) {
      this.persistModeSession(nextMode, false);
      this.persistActiveModalResumeMarker();
    } else {
      this.clearActiveModalResumeMarker();
    }
    this.sim.saveToStorage();
    this.renderDOM();
    this.onParentRefresh();
  }

  private resetInteractionState(): void {
    this.activePointerId = null;
    this.onetHoverCell = null;
    this.onetCursorCell = null;
    this.onetBlockedFlash = null;
    this.onetBeams = [];
    this.onetSlideAnims.clear();
    this.onetWinRevealTimer = 0;
    this.sudokuHoverCell = null;
    this.sudokuHoverPadDigit = null;
    this.sudokuHoverAction = null;
    this.caroHoverCell = null;
    this.caroLastMoveAnim = null;
    this.caroWinRevealTimer = 0;
    this.caroFireworkTimer = 0;
    this.chessDragFrom = null;
    this.chessHoverSquare = null;
    this.chessMoveAnim = null;
    this.chessSpellBeams = [];
    this.chessShakeTimer = 0;
    this.chessShakeAmp = 0;
    this.pendingChessWorkerReqId = null;
    this.hitStopTimer = 0;
    this.inspectingTurningPoint = false;
    this.aiThinkTimer = 0;
    this.particles = [];
    this.flyingTiles = [];
  }

  private ensureChessWorker(): Worker | null {
    if (typeof Worker === 'undefined') return null;
    if (!this.chessWorker) {
      try {
        const w = new Worker(new URL('../sim/chessAi.worker.ts', import.meta.url), {
          type: 'module',
        });
        w.onmessage = (ev: MessageEvent<ChessWorkerResponseMessage>) => {
          this.handleChessWorkerMessage(ev.data);
        };
        w.onerror = () => {
          this.pendingChessWorkerReqId = null;
          this.chessWorker = null;
        };
        this.chessWorker = w;
      } catch {
        this.chessWorker = null;
      }
    }
    return this.chessWorker;
  }

  private applyCompletedChessAiResult(
    aiRes: ReturnType<WizardChessEngine['stepAiMove']>
  ): void {
    if (!this.chessEngine) return;
    if (aiRes?.move) {
      const movedBlack =
        this.chessEngine.board[aiRes.move.toR]?.[aiRes.move.toC] ?? {
          color: 'b' as const,
          type: 'p' as const,
        };
      const didCap = Boolean(aiRes.move.captured || aiRes.move.isEnPassant);
      this.triggerChessMoveVfx(
        aiRes.move.fromR,
        aiRes.move.fromC,
        aiRes.move.toR,
        aiRes.move.toC,
        movedBlack,
        didCap,
        Boolean(aiRes.aiWon)
      );
      this.sim.audio.playChessClack(didCap);
      if (didCap) {
        this.hitStopTimer = 0.035;
        this.sim.audio.playPowerupBlast();
      }
      if (aiRes.playerWon) {
        this.checkAndClaimVictory();
      } else if (aiRes.aiWon || aiRes.draw || this.chessEngine.isInCheck('w')) {
        this.persistModeSession('chess', true);
        this.renderDOM();
      } else {
        this.persistModeSession('chess', true);
        this.updateLiveCountersOnly();
      }
    } else if (aiRes?.playerWon) {
      this.checkAndClaimVictory();
    } else {
      this.persistModeSession('chess', true);
      this.renderDOM();
    }
  }

  private dispatchChessAiTurn(): void {
    if (!this.chessEngine || this.chessEngine.status !== 'ai_thinking') return;
    if (this.pendingChessWorkerReqId !== null) return;
    const worker = this.ensureChessWorker();
    if (worker) {
      try {
        const reqId = ++this.chessWorkerReqSeq;
        this.pendingChessWorkerReqId = reqId;
        const msg: ChessWorkerRequestMessage = {
          reqId,
          payload: this.chessEngine.exportWorkerPayload(),
        };
        worker.postMessage(msg);
        return;
      } catch {
        this.pendingChessWorkerReqId = null;
        this.chessWorker = null;
      }
    }
    const aiRes = this.chessEngine.stepAiMove();
    this.applyCompletedChessAiResult(aiRes);
  }

  private handleChessWorkerMessage(data: ChessWorkerResponseMessage): void {
    if (!data || data.reqId !== this.pendingChessWorkerReqId) return;
    this.pendingChessWorkerReqId = null;
    if (
      this.victoryClaimed ||
      this.mode !== 'chess' ||
      !this.chessEngine ||
      this.chessEngine.status !== 'ai_thinking'
    ) {
      return;
    }
    const aiRes = this.chessEngine.applyChosenAiMove(data.move);
    this.applyCompletedChessAiResult(aiRes);
  }

  private getActiveTurningPointReview(): TurningPointReview | null {
    if (this.mode === 'caro' && this.caroEngine) {
      return this.caroEngine.getTurningPointReview();
    }
    if (this.mode === 'chess' && this.chessEngine) {
      return this.chessEngine.getTurningPointReview();
    }
    if (this.mode === 'blocks' && this.onetEngine) {
      return this.onetEngine.getTurningPointReview();
    }
    return null;
  }

  private renderTurningPointCardHtml(rev: TurningPointReview): string {
    return `
      <div class="pa-review-card">
        <div class="pa-review-head">
          <span class="pa-review-title">🪞 #${rev.plyNumber}</span>
          ${
            rev.highlightCells.length > 0
              ? `<button id="btnPaToggleReviewInspect" type="button" class="pa-mini-pill ${this.inspectingTurningPoint ? 'active' : ''}">${
                  this.inspectingTurningPoint ? '🙈 Ẩn' : '🔍 Soi Bàn'
                }</button>`
              : ''
          }
        </div>
        <div class="pa-review-pills">
          <span class="pa-review-pill">⚡ <strong>${escapeHtml(rev.playedCoordVi)}</strong></span>
          <span class="pa-review-pill best">✨ <strong>${escapeHtml(rev.recommendedCoordVi)}</strong></span>
        </div>
      </div>
    `;
  }

  private getActiveEngineStage(): number {
    if (this.rescueContext && this.rescueContext.kind === this.mode) {
      return this.rescueContext.stage;
    }
    const pa = this.sim.state.puzzleArcade;
    if (this.mode === 'sudoku') return this.sudokuEngine?.stage ?? pa.sudokuStage ?? 1;
    if (this.mode === 'caro') return this.caroEngine?.stage ?? pa.caroStage ?? 1;
    if (this.mode === 'chess') return this.chessEngine?.stage ?? pa.chessStage ?? 1;
    return this.onetEngine?.stage ?? pa.blockStage ?? 1;
  }

  private persistActiveModalResumeMarker(): void {
    if (typeof localStorage === 'undefined' || this.rescueContext || this.victoryClaimed) return;
    try {
      const rec: ActiveMinigameResumeRecord = {
        dialog: 'puzzleArcade',
        mode: this.mode,
        stage: this.getActiveEngineStage(),
        savedAt: Date.now(),
      };
      localStorage.setItem(ACTIVE_MINIGAME_RESUME_KEY, JSON.stringify(rec));
    } catch {
      // Ignore storage quota errors
    }
  }

  private clearActiveModalResumeMarker(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(ACTIVE_MINIGAME_RESUME_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  private persistSudokuSession(saveToDisk = true): void {
    this.persistModeSession('sudoku', saveToDisk);
  }

  private persistModeSession(mode: PuzzleArcadeMode, saveToDisk = true): void {
    if (this.rescueContext) return;
    const pa = this.sim.state.puzzleArcade;
    const extra =
      this.mode === mode
        ? {
            companionCharge: this.companionCharge,
            snackPieUsed: this.snackPieUsedThisAttempt,
          }
        : undefined;

    if (mode === 'sudoku') {
      if (!this.sudokuEngine || this.sudokuEngine.stage !== pa.sudokuStage) return;
      if (this.sudokuEngine.status === 'won' || (this.mode === 'sudoku' && this.victoryClaimed)) {
        if (pa.sudokuSession) {
          pa.sudokuSession = null;
          if (saveToDisk) this.sim.saveToStorage();
        }
        return;
      }
      this.sudokuAutoSaveAccumSec = 0;
      pa.sudokuSession = this.sudokuEngine.exportSession(
        extra ?? {
          companionCharge: pa.sudokuSession?.companionCharge ?? 0,
          snackPieUsed: pa.sudokuSession?.snackPieUsed ?? false,
        }
      );
      if (saveToDisk) this.sim.saveToStorage();
      return;
    }

    if (mode === 'caro') {
      if (!this.caroEngine || this.caroEngine.stage !== pa.caroStage) return;
      if (this.caroEngine.status === 'won' || (this.mode === 'caro' && this.victoryClaimed)) {
        if (pa.caroSession) {
          pa.caroSession = null;
          if (saveToDisk) this.sim.saveToStorage();
        }
        return;
      }
      pa.caroSession = this.caroEngine.exportSession(
        extra ?? {
          companionCharge: pa.caroSession?.companionCharge ?? 0,
          snackPieUsed: pa.caroSession?.snackPieUsed ?? false,
        }
      );
      if (saveToDisk) this.sim.saveToStorage();
      return;
    }

    if (mode === 'chess') {
      if (!this.chessEngine || this.chessEngine.stage !== pa.chessStage) return;
      if (this.chessEngine.status === 'won' || (this.mode === 'chess' && this.victoryClaimed)) {
        if (pa.chessSession) {
          pa.chessSession = null;
          if (saveToDisk) this.sim.saveToStorage();
        }
        return;
      }
      pa.chessSession = this.chessEngine.exportSession(
        extra ?? {
          companionCharge: pa.chessSession?.companionCharge ?? 0,
          snackPieUsed: pa.chessSession?.snackPieUsed ?? false,
        }
      );
      if (saveToDisk) this.sim.saveToStorage();
      return;
    }

    if (!this.onetEngine || this.onetEngine.stage !== pa.blockStage) return;
    if (this.onetEngine.status === 'won' || (this.mode === 'blocks' && this.victoryClaimed)) {
      if (pa.onetSession) {
        pa.onetSession = null;
        if (saveToDisk) this.sim.saveToStorage();
      }
      return;
    }
    pa.onetSession = this.onetEngine.exportSession(
      extra ?? {
        companionCharge: pa.onetSession?.companionCharge ?? 0,
        snackPieUsed: pa.onetSession?.snackPieUsed ?? false,
      }
    );
    if (saveToDisk) this.sim.saveToStorage();
  }

  private flushArcadeAndModalBeforeHide(): void {
    if ((this.caroWinRevealTimer > 0 || this.onetWinRevealTimer > 0) && !this.victoryClaimed) {
      this.caroWinRevealTimer = 0;
      this.onetWinRevealTimer = 0;
      this.checkAndClaimVictory();
    }
    if (!this.rescueContext) {
      this.persistModeSession(this.mode, true);
    }
    const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    if (openDlg?.open && !this.rescueContext && !this.victoryClaimed) {
      this.persistActiveModalResumeMarker();
    }
  }

  private ensureEngineForMode(mode: PuzzleArcadeMode, forceRestart: boolean): void {
    const pa = this.sim.state.puzzleArcade;
    this.victoryClaimed = false;
    this.victorySummary = null;
    this.rescueVictoryOutcome = null;
    this.aiThinkTimer = 0;

    const rescueStage =
      this.rescueContext && this.rescueContext.kind === mode ? this.rescueContext.stage : null;

    if (mode === 'sudoku') {
      const stage = rescueStage ?? pa.sudokuStage ?? 1;
      if (
        forceRestart ||
        !this.sudokuEngine ||
        this.sudokuEngine.stage !== stage ||
        this.sudokuEngine.status === 'won'
      ) {
        if (forceRestart && !rescueStage && pa.sudokuSession) {
          pa.sudokuSession = null;
          this.sim.saveToStorage();
        }
        const nextEngine = new SudokuPuzzleEngine(stage);
        let restored = false;
        if (
          !forceRestart &&
          !rescueStage &&
          pa.sudokuSession &&
          pa.sudokuSession.stage === stage
        ) {
          restored = nextEngine.restoreSession(pa.sudokuSession);
        }
        this.sudokuEngine = nextEngine;
        if (restored && pa.sudokuSession) {
          this.companionCharge = Math.max(0, Math.round(pa.sudokuSession.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(pa.sudokuSession.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('sudoku', true);
          }
        }
      } else if (!rescueStage && pa.sudokuSession?.stage === stage) {
        this.companionCharge = Math.max(0, Math.round(pa.sudokuSession.companionCharge ?? 0));
        this.snackPieUsedThisAttempt = Boolean(pa.sudokuSession.snackPieUsed);
      }
    } else if (mode === 'caro') {
      const stage = rescueStage ?? pa.caroStage ?? 1;
      if (
        forceRestart ||
        !this.caroEngine ||
        this.caroEngine.stage !== stage ||
        this.caroEngine.status === 'won'
      ) {
        if (forceRestart && !rescueStage && pa.caroSession) {
          pa.caroSession = null;
          this.sim.saveToStorage();
        }
        const nextEngine = new CaroGameEngine(stage);
        let restored = false;
        if (
          !forceRestart &&
          !rescueStage &&
          pa.caroSession &&
          pa.caroSession.stage === stage
        ) {
          restored = nextEngine.restoreSession(pa.caroSession);
        }
        this.caroEngine = nextEngine;
        if (restored && pa.caroSession) {
          this.companionCharge = Math.max(0, Math.round(pa.caroSession.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(pa.caroSession.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('caro', true);
          }
        }
      } else if (!rescueStage && pa.caroSession?.stage === stage) {
        this.companionCharge = Math.max(0, Math.round(pa.caroSession.companionCharge ?? 0));
        this.snackPieUsedThisAttempt = Boolean(pa.caroSession.snackPieUsed);
      }
      if (this.caroEngine.status === 'ai_thinking') {
        this.aiThinkTimer = 0.25;
      }
    } else if (mode === 'chess') {
      const stage = rescueStage ?? pa.chessStage ?? 1;
      if (
        forceRestart ||
        !this.chessEngine ||
        this.chessEngine.stage !== stage ||
        this.chessEngine.status === 'won'
      ) {
        const savedChess =
          !forceRestart && !rescueStage && pa.chessSession?.stage === stage
            ? pa.chessSession
            : null;
        if (forceRestart && !rescueStage && pa.chessSession) {
          pa.chessSession = null;
          this.sim.saveToStorage();
        }
        const preferredSubMode = savedChess ? savedChess.subMode : this.chessForceSubMode;
        const nextEngine = new WizardChessEngine(stage, preferredSubMode);
        let restored = false;
        if (savedChess) {
          restored = nextEngine.restoreSession(savedChess);
        }
        this.chessEngine = nextEngine;
        if (restored && savedChess) {
          this.chessForceSubMode = nextEngine.subMode;
          this.companionCharge = Math.max(0, Math.round(savedChess.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(savedChess.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('chess', true);
          }
        }
      } else if (!rescueStage && pa.chessSession?.stage === stage) {
        this.companionCharge = Math.max(0, Math.round(pa.chessSession.companionCharge ?? 0));
        this.snackPieUsedThisAttempt = Boolean(pa.chessSession.snackPieUsed);
      }
      if (this.chessEngine.status === 'ai_thinking') {
        this.aiThinkTimer = 0.25;
      }
    } else {
      const stage = rescueStage ?? pa.blockStage ?? 1;
      if (
        forceRestart ||
        !this.onetEngine ||
        this.onetEngine.stage !== stage ||
        this.onetEngine.status === 'won'
      ) {
        if (forceRestart && !rescueStage && pa.onetSession) {
          pa.onetSession = null;
          this.sim.saveToStorage();
        }
        const nextEngine = new CreatureOnetEngine(stage);
        let restored = false;
        if (
          !forceRestart &&
          !rescueStage &&
          pa.onetSession &&
          pa.onetSession.stage === stage
        ) {
          restored = nextEngine.restoreSession(pa.onetSession);
        }
        this.onetEngine = nextEngine;
        if (restored && pa.onetSession) {
          this.companionCharge = Math.max(0, Math.round(pa.onetSession.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(pa.onetSession.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('blocks', true);
          }
        }
      } else if (!rescueStage && pa.onetSession?.stage === stage) {
        this.companionCharge = Math.max(0, Math.round(pa.onetSession.companionCharge ?? 0));
        this.snackPieUsedThisAttempt = Boolean(pa.onetSession.snackPieUsed);
      }
    }
  }

  private resetStageSynergySession(): void {
    this.companionCharge = 0;
    this.snackPieUsedThisAttempt = false;
    this.lossStreakResetForStage = false;
  }

  private bumpCompanionCharge(): void {
    const comp = this.sim.getActiveMinigameCompanion();
    this.companionCharge = Math.min(comp.chargeEveryMoves, this.companionCharge + 1);
  }

  private checkAndClaimVictory(): void {
    if (this.victoryClaimed) return;
    const isWon =
      (this.mode === 'sudoku' && this.sudokuEngine?.status === 'won') ||
      (this.mode === 'caro' && this.caroEngine?.status === 'won') ||
      (this.mode === 'chess' && this.chessEngine?.status === 'won') ||
      (this.mode === 'blocks' && this.onetEngine?.status === 'won');
    if (!isWon) return;

    if (this.rescueContext && this.rescueContext.kind === this.mode) {
      this.victoryClaimed = true;
      const out = this.sim.completeNeighborMinigameRescue(this.rescueContext);
      this.rescueVictoryOutcome = {
        tokensEarned: out.tokensEarned,
        goldEarned: out.goldEarned,
        xpEarned: out.xpEarned,
        buildReduction: out.buildReduction,
      };
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
      return;
    }

    if (this.mode === 'sudoku' && this.sudokuEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.sudokuSession = null;
      this.clearActiveModalResumeMarker();
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'sudoku',
        this.sudokuEngine.reward,
        {
          sessionScore: Math.max(
            1200,
            2800 -
              this.sudokuEngine.mistakesCount * 220 -
              Math.min(600, Math.floor(this.sudokuEngine.elapsedSec * 1.2))
          ),
          efficiency: this.sudokuEngine.mistakesCount,
        }
      );
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'caro' && this.caroEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.caroSession = null;
      this.clearActiveModalResumeMarker();
      const humanMoves = Math.max(
        1,
        this.caroEngine.moveHistory.filter((m) => m.stone === 1).length
      );
      this.victorySummary = this.sim.completePuzzleArcadeVictory('caro', this.caroEngine.reward, {
        sessionScore: Math.max(1100, 2800 - this.caroEngine.moveHistory.length * 24),
        efficiency: humanMoves,
      });
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'chess' && this.chessEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.chessSession = null;
      this.clearActiveModalResumeMarker();
      this.victorySummary = this.sim.completePuzzleArcadeVictory('chess', this.chessEngine.reward, {
        sessionScore: Math.max(
          1300,
          3000 - this.chessEngine.moveCount * 30 + this.chessEngine.capturedByWhite.length * 80
        ),
        efficiency: Math.max(1, this.chessEngine.moveCount),
      });
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'blocks' && this.onetEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.onetSession = null;
      this.clearActiveModalResumeMarker();
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'blocks',
        this.onetEngine.reward,
        {
          sessionScore: Math.max(1200, this.onetEngine.score),
          efficiency: Math.max(1, this.onetEngine.maxCombo),
        }
      );
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    }
  }

  private spawnBurst(vx: number, vy: number, color: string, count = 16): void {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const spd = 65 + Math.random() * 145;
      this.particles.push({
        x: vx,
        y: vy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 35,
        size: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 8,
        age: 0,
        duration: 0.45 + Math.random() * 0.25,
        color,
      });
    }
  }

  private spawnStoneShatter(vx: number, vy: number, enemyWasBlack: boolean): void {
    const palette = enemyWasBlack
      ? ['#10b981', '#34d399', '#1e293b', '#e2e8f0', '#fde047', '#fb7185']
      : ['#ef4444', '#f59e0b', '#fef08a', '#f5e4c0', '#7dd3fc', '#ffffff'];
    for (let i = 0; i < 30; i++) {
      const ang = (Math.PI * 2 * i) / 30 + (Math.random() - 0.5) * 0.42;
      const spd = 75 + Math.random() * 185;
      this.particles.push({
        x: vx,
        y: vy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 52,
        size: 4 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 12,
        age: 0,
        duration: 0.52 + Math.random() * 0.34,
        color: palette[i % palette.length],
      });
    }
  }

  private triggerChessMoveVfx(
    fromR: number,
    fromC: number,
    toR: number,
    toC: number,
    movedPiece: ChessPiece,
    didCapture: boolean,
    isTerminalMate: boolean
  ): void {
    const x0 = CHESS_BOARD_X + (fromC + 0.5) * CHESS_CELL_PX;
    const y0 = CHESS_BOARD_Y + (fromR + 0.5) * CHESS_CELL_PX;
    const x1 = CHESS_BOARD_X + (toC + 0.5) * CHESS_CELL_PX;
    const y1 = CHESS_BOARD_Y + (toR + 0.5) * CHESS_CELL_PX;
    const isWhite = movedPiece.color === 'w';

    this.chessMoveAnim = {
      fromR,
      fromC,
      toR,
      toC,
      piece: { ...movedPiece },
      age: 0,
      duration: 0.24,
    };

    if (didCapture || isTerminalMate) {
      this.chessSpellBeams.push({
        x0,
        y0: y0 - 8,
        x1,
        y1: y1 - 6,
        isWhiteCaster: isWhite,
        age: 0,
        duration: 0.34,
      });
      this.spawnStoneShatter(x1, y1 - 4, isWhite);
      const reducedMotion =
        typeof window !== 'undefined' &&
        Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
      if (!reducedMotion) {
        this.chessShakeTimer = isTerminalMate ? 0.28 : 0.18;
        this.chessShakeAmp = isTerminalMate ? 4.2 : 2.6;
      }
    } else {
      this.spawnBurst(x1, y1, isWhite ? '#fde047' : '#34d399', 12);
    }
  }

  private spawnWeasleyFireworks(centerX = 224, centerY = 198, bursts = 3): void {
    const palettes: ReadonlyArray<ReadonlyArray<string>> = [
      ['#fde047', '#f97316', '#ef4444', '#fffbeb'],
      ['#f472b6', '#c084fc', '#fde047', '#ffffff'],
      ['#34d399', '#38bdf8', '#facc15', '#ecfdf5'],
    ];
    for (let b = 0; b < bursts; b++) {
      const bx = centerX + (Math.random() - 0.5) * 230;
      const by = Math.max(48, Math.min(340, centerY + (Math.random() - 0.5) * 190));
      const pal = palettes[b % palettes.length];
      for (let i = 0; i < 22; i++) {
        const ang = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.25;
        const spd = 75 + Math.random() * 175;
        this.particles.push({
          x: bx,
          y: by,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 55,
          size: 4.5 + Math.random() * 6,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 11,
          age: 0,
          duration: 0.62 + Math.random() * 0.42,
          color: pal[i % pal.length],
        });
      }
    }
  }

  private spawnCelebrationConfetti(): void {
    const colors = ['#facc15', '#fb7185', '#38bdf8', '#34d399', '#c084fc'];
    for (let i = 0; i < 42; i++) {
      this.particles.push({
        x: 120 + Math.random() * 440,
        y: 80 + Math.random() * 180,
        vx: (Math.random() - 0.5) * 220,
        vy: -80 - Math.random() * 140,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 10,
        age: 0,
        duration: 0.75 + Math.random() * 0.45,
        color: colors[i % colors.length],
      });
    }
  }

  public renderDOM(): void {
    const box = this.root.querySelector('#puzzleArcadeDialogContent') as HTMLElement | null;
    if (!box) return;

    const modalInner = this.root.querySelector(
      '#puzzleArcadeDialog .pa-modal-inner'
    ) as HTMLElement | null;
    modalInner?.classList.toggle('pa-great-hall-mode', this.mode === 'chess');
    modalInner?.classList.remove('pa-potions-sudoku-mode');
    modalInner?.classList.toggle('pa-marauder-caro-mode', this.mode === 'caro');

    const modalTitle = this.root.querySelector('#puzzleArcadeDialogTitle') as HTMLElement | null;
    if (modalTitle) {
      if (this.mode === 'chess') {
        modalTitle.innerHTML =
          '<img src="/paintings/chess/wk.png" alt="" style="width:28px;height:32px;object-fit:contain;vertical-align:-8px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Cờ Phù Thủy';
      } else if (this.mode === 'sudoku') {
        modalTitle.innerHTML =
          '<img src="/sprites/m3_piece_scroll.png" alt="" style="width:26px;height:26px;object-fit:contain;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Số Học Huyền Bí';
      } else if (this.mode === 'caro') {
        modalTitle.innerHTML =
          '<img src="/paintings/caro/phoenix_seal.png" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Ngũ Ấn Đạo Tặc';
      } else {
        modalTitle.innerHTML =
          '<img src="/sprites/beast_niffler.png" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Sinh Vật Huyền Bí';
      }
    }

    const st = this.sim.state;
    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanDisp = st.sandboxMode ? '∞' : String(talismanQty);
    const talismanDaily = this.sim.getPhoenixTalismanDailyStatus();
    const usedTodayInMode = talismanDaily.usedByGame[this.mode] === true;
    const talismanTooltip = usedTodayInMode
      ? `Bùa Phượng Hoàng — Đã dùng 1/1 lượt hôm nay ở môn này (${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay, mở lại sau 00:00)`
      : `Bùa Phượng Hoàng — Tối đa 1 lần/môn/ngày (Đã dùng ${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay)`;
    const reqTrial = this.sim.getRequiredLevelTrial();
    const curInfo = this.sim.getDisciplineStageInfo(this.mode);
    const isScoredMode = this.mode === 'sudoku' || this.mode === 'blocks';
    const activeModeRank = isScoredMode ? this.sim.getPlayerMinigameRank(this.mode, 'valley') : 0;

    let stageHeadline = '';
    let stageSubtitle = '';
    let controlsHtml = '';
    let statusBannerHtml = '';

    const socialState = this.sim.ensureNeighborSocial();
    const activeStageNum = this.getActiveEngineStage();
    const bossMeta = getMilestoneBossMeta(activeStageNum);
    if (bossMeta) {
      statusBannerHtml += `
        <div class="pa-boss-strip">
          <span class="pa-boss-crown">👑 TRÙM MỐC ${activeStageNum}</span>
          <span class="pa-boss-text"><strong>${escapeHtml(bossMeta.bossGuardianVi)}</strong> • <em>${escapeHtml(bossMeta.mechanicTagVi)}</em></span>
        </div>
      `;
    }
    const mySosArcade =
      !this.rescueContext &&
      socialState.playerMinigameSos &&
      !socialState.playerMinigameSos.claimed &&
      socialState.playerMinigameSos.kind === this.mode &&
      socialState.playerMinigameSos.stage === activeStageNum
        ? socialState.playerMinigameSos
        : null;
    const rescuesReceivedLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - socialState.dailyRescuesReceivedCount
    );

    if (this.rescueContext) {
      statusBannerHtml += `
        <div class="pa-trial-strip urgent">
          <span>⚔️ <strong>CỨU MÀN ${this.rescueContext.stage}</strong> (${escapeHtml(this.rescueContext.neighborEmoji)} <strong>${escapeHtml(this.rescueContext.neighborName)}</strong>) • <strong>+3 🍀 + 95G</strong></span>
        </div>
      `;
    } else if (mySosArcade) {
      if (mySosArcade.rescuedAt) {
        statusBannerHtml += `
          <div class="pa-trial-strip done">
            <span>🎉 <strong>${escapeHtml(mySosArcade.rescuerEmoji ?? '🦉')} ${escapeHtml(mySosArcade.rescuerName ?? 'Hàng xóm')}</strong> đã cứu Màn ${mySosArcade.stage}!</span>
            <button type="button" id="btnPaClaimSosRescue" class="pa-mini-pill active">🎉 Qua Màn</button>
          </div>
        `;
      } else {
        statusBannerHtml += `
          <div class="pa-trial-strip">
            <span>🦉 Đang gọi cứu viện <strong>Màn ${mySosArcade.stage}</strong>...</span>
          </div>
        `;
      }
    }

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      const se = this.sudokuEngine;
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${se.stage}/${MAX_MINIGAME_STAGE} • ${se.classicDifficultyVi}`;
      stageSubtitle = `❌ Lỗi: <strong id="paSudokuMistakes" class="${se.mistakesCount > 0 ? 'pa-err-inline' : ''}">${se.mistakesCount}/${se.maxMistakes}</strong> • ⏱ <strong id="paSudokuTimer">${se.formatElapsedTime()}</strong>`;
      const canSudokuHint =
        se.status === 'playing' && (st.sandboxMode || se.freeHintsLeft + se.paidHintsLeft > 0);
      const talismanLocked = se.talismanUsed || usedTodayInMode;
      const canTalisman =
        (se.status === 'playing' || se.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      const hintCostLbl = st.sandboxMode
        ? '∞'
        : se.freeHintsLeft > 0
          ? `${se.freeHintsLeft}`
          : se.paidHintsLeft > 0
            ? `${se.hintGoldCost}G`
            : '0';
      controlsHtml = `
        <button id="btnPaSudokuUndo" type="button" class="pa-tool-btn" ${!se.canUndo ? 'disabled' : ''} title="Hoàn tác bước vừa điền (Z)">
          ↩️ Hoàn Tác
        </button>
        <button id="btnPaSudokuPencil" type="button" class="pa-tool-btn ${se.pencilMode ? 'active' : ''}" aria-pressed="${se.pencilMode}" ${se.status !== 'playing' ? 'disabled' : ''} title="Bật/tắt chế độ ghi chú bút chì 1–9 (N)">
          ✏️ Ghi Chú${se.pencilMode ? ' ✓' : ''}
        </button>
        <button id="btnPaSudokuClear" type="button" class="pa-tool-btn ${se.eraseMode ? 'active' : ''}" aria-pressed="${se.eraseMode}" ${se.status !== 'playing' && se.status !== 'lost' ? 'disabled' : ''} title="Xoá ô đang chọn hoặc bật tẩy (Del / Backspace)">
          🧹 Xoá${se.eraseMode ? ' ✓' : ''}
        </button>
        <button id="btnPaSudokuHint" type="button" class="pa-tool-btn gold" ${!canSudokuHint ? 'disabled' : ''} title="Điền đúng 1 ô trên bảng (H)">
          💡 Gợi Ý <span class="pa-cost-pill">${hintCostLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (se.status === 'lost') {
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>❌ Quá giới hạn lỗi (<strong>${se.mistakesCount}/${se.maxMistakes}</strong>)! Hoàn tác hoặc xoá ô sai để chơi tiếp.</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Bùa (×${talismanDisp})</button>` : ''}
          </div>
        `;
      }
    } else if (this.mode === 'caro' && this.caroEngine) {
      const ce = this.caroEngine;
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${ce.stage}/${MAX_MINIGAME_STAGE} • ${escapeHtml(ce.opponent.emoji)} ${escapeHtml(ce.opponent.name)}`;
      const sealNote =
        ce.runeSealCount > 0
          ? ` • 🔒 ${ce.runeSealCount}`
          : '';
      stageSubtitle = `⚔️ ${escapeHtml(ce.opponent.name)}${sealNote} • <strong id="paCaroMoves">${ce.moveHistory.length} nước</strong>`;
      const canCaroUndo =
        ce.moveHistory.length > ce.initialHistoryLen &&
        ce.status !== 'ai_thinking' &&
        this.caroWinRevealTimer <= 0 &&
        (st.sandboxMode || ce.freeUndosLeft + ce.paidUndosLeft > 0);
      const canCaroHint =
        ce.status === 'playing' && (st.sandboxMode || ce.freeHintsLeft + ce.paidHintsLeft > 0);
      const talismanLocked = ce.talismanUsed || usedTodayInMode;
      const canTalisman =
        (ce.status === 'playing' || ce.status === 'lost' || ce.status === 'draw') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      const undoLbl = st.sandboxMode
        ? '∞'
        : ce.freeUndosLeft > 0
          ? `${ce.freeUndosLeft}`
          : ce.paidUndosLeft > 0
            ? `${ce.undoGoldCost}G`
            : '0';
      const hintLbl = st.sandboxMode
        ? '∞'
        : ce.freeHintsLeft > 0
          ? `${ce.freeHintsLeft}`
          : ce.paidHintsLeft > 0
            ? `${ce.hintGoldCost}G`
            : '0';
      controlsHtml = `
        <button id="btnPaCaroUndo" type="button" class="pa-tool-btn" ${!canCaroUndo ? 'disabled' : ''}>
          ↩️ Lùi <span class="pa-cost-pill">${undoLbl}</span>
        </button>
        <button id="btnPaCaroHint" type="button" class="pa-tool-btn gold" ${!canCaroHint ? 'disabled' : ''}>
          💡 Gợi Ý <span class="pa-cost-pill">${hintLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (ce.status === 'lost' || ce.status === 'draw') {
        const caroRev = ce.getTurningPointReview();
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>${
              ce.status === 'lost'
                ? `${escapeHtml(ce.opponent.emoji)} <strong>${escapeHtml(ce.opponent.name)}</strong> thắng!`
                : `🤝 Hòa cờ!`
            }</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Bùa (×${talismanDisp})</button>` : ''}
          </div>
          ${caroRev ? this.renderTurningPointCardHtml(caroRev) : ''}
        `;
      }
    } else if (this.mode === 'chess' && this.chessEngine) {
      const we = this.chessEngine;
      const isTactics = we.subMode === 'tactics';
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${we.stage}/${MAX_MINIGAME_STAGE}`;
      stageSubtitle = `🦁 <strong id="paChessTurn">${
        we.status === 'ai_thinking'
          ? `${escapeHtml(we.opponentName)} đang đi...`
          : we.isInCheck('w')
            ? '⚠️ Chiếu tướng!'
            : 'Lượt bạn'
      }</strong> • ⚔️ ${escapeHtml(we.opponentName)}`;
      const canChessUndo =
        we.moveCount > 0 &&
        we.status !== 'ai_thinking' &&
        (st.sandboxMode || we.freeUndosLeft + we.paidUndosLeft > 0);
      const canChessAssist =
        we.status === 'playing' && (st.sandboxMode || we.freeHintsLeft + we.paidAssistsLeft > 0);
      const talismanLocked = we.talismanUsed || usedTodayInMode;
      const canTalisman =
        (we.status === 'playing' || we.status === 'lost' || we.status === 'draw') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      const undoLbl = st.sandboxMode
        ? '∞'
        : we.freeUndosLeft > 0
          ? `${we.freeUndosLeft}`
          : we.paidUndosLeft > 0
            ? `${we.undoGoldCost}G`
            : '0';
      const hintLbl = st.sandboxMode
        ? '∞'
        : we.freeHintsLeft > 0
          ? `${we.freeHintsLeft}`
          : we.paidAssistsLeft > 0
            ? `${we.assistGoldCost}G`
            : '0';
      controlsHtml = `
        <div class="pa-submode-switch" role="group" aria-label="Kiểu chơi Cờ Phù Thủy">
          <button id="btnPaChessTactics" type="button" class="pa-mini-pill ${isTactics ? 'active' : ''}" ${we.subModeLocked && !isTactics ? 'disabled' : ''}>${we.subModeLocked && !isTactics ? '🔒 ' : '⚡ '}Thế Cờ</button>
          <button id="btnPaChessMatch" type="button" class="pa-mini-pill ${!isTactics ? 'active' : ''}" ${we.subModeLocked && isTactics ? 'disabled' : ''}>${we.subModeLocked && isTactics ? '🔒 ' : '👑 '}8×8</button>
        </div>
        <button id="btnPaChessUndo" type="button" class="pa-tool-btn" ${!canChessUndo ? 'disabled' : ''}>
          ↩️ Lùi <span class="pa-cost-pill">${undoLbl}</span>
        </button>
        <button id="btnPaChessAssist" type="button" class="pa-tool-btn gold" ${!canChessAssist ? 'disabled' : ''}>
          💡 Gợi Ý <span class="pa-cost-pill">${hintLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (we.status === 'lost' || we.status === 'draw') {
        const chessRev = we.getTurningPointReview();
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>${
              we.status === 'lost'
                ? `🏰 Bị chiếu bí!`
                : `🤝 Hòa cờ!`
            }</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Bùa (×${talismanDisp})</button>` : ''}
          </div>
          ${chessRev ? this.renderTurningPointCardHtml(chessRev) : ''}
        `;
      }
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const oe = this.onetEngine;
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${oe.stage}/${MAX_MINIGAME_STAGE}`;
      stageSubtitle = `❤️ <strong id="paOnetLives" class="${oe.lives <= 2 ? 'pa-err-inline' : ''}">${st.sandboxMode ? '∞' : oe.lives}</strong> • 🧩 <strong id="paOnetProgress">${oe.matchedPairs}/${oe.totalPairs}</strong> cặp • <strong>${escapeHtml(oe.shiftBadgeVi)}</strong>`;
      const canHint =
        oe.status === 'playing' && (st.sandboxMode || oe.freeHintsLeft + oe.paidHintsLeft > 0);
      const canShuffle =
        (oe.status === 'playing' || oe.status === 'lost') &&
        (st.sandboxMode || oe.lives + oe.paidShufflesLeft > 0);
      const talismanLocked = oe.talismanUsed || usedTodayInMode;
      const canTalisman =
        (oe.status === 'playing' || oe.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      const hintCostLbl = st.sandboxMode
        ? '∞'
        : oe.freeHintsLeft > 0
          ? `${oe.freeHintsLeft}`
          : oe.paidHintsLeft > 0
            ? `${oe.hintGoldCost}G`
            : '0';
      const shuffleCostLbl = st.sandboxMode
        ? '❤️∞'
        : oe.lives > 0
          ? `❤️${oe.lives}`
          : oe.paidShufflesLeft > 0
            ? `${oe.shuffleGoldCost}G`
            : '0';
      controlsHtml = `
        <button id="btnPaOnetHint" type="button" class="pa-tool-btn gold" ${!canHint ? 'disabled' : ''} title="Dò Cặp (H)">
          🔍 Dò <span class="pa-cost-pill">${hintCostLbl}</span>
        </button>
        <button id="btnPaOnetShuffle" type="button" class="pa-tool-btn" ${!canShuffle ? 'disabled' : ''} title="Đổi Vị Trí Bàn Cờ (S)">
          🔀 Đổi <span class="pa-cost-pill">${shuffleCostLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (oe.status === 'lost') {
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>💔 Hết đường nối &amp; hết lượt đổi vị trí (<strong>0 ❤️</strong>)!</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Bùa (×${talismanDisp})</button>` : ''}
          </div>
        `;
      }
    }

    if (!this.rescueContext && !this.victorySummary) {
      controlsHtml += mySosArcade?.rescuedAt
        ? `
          <button id="btnPaSideClaimSos" type="button" class="pa-tool-btn active">
            🎉 Qua Màn!
          </button>
        `
        : `
          <button id="btnPaAskFriendSos" type="button" class="pa-tool-btn" ${rescuesReceivedLeft <= 0 && !mySosArcade ? 'disabled' : ''} title="Nhờ bạn bè giải cứu">
            ${mySosArcade ? '🦉 Đang gọi' : `🆘 Cứu ${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}`}
          </button>
        `;
    }

    let inspectReturnBarHtml = '';
    let victoryOverlayHtml = '';
    if (this.rescueContext && this.rescueVictoryOutcome) {
      const rv = this.rescueVictoryOutcome;
      victoryOverlayHtml = `
        <div class="pa-victory-overlay" role="region" aria-label="Giải cứu thành công">
          <div class="pa-victory-card">
            <div class="pa-victory-title">
              🏆 Cứu Thành Công (${escapeHtml(this.rescueContext.neighborName)})!
            </div>
            <div class="m3-reward-badges">
              <span class="m3-reward-chip star">+${rv.tokensEarned} 🍀</span>
              <span class="m3-reward-chip">🪙 +${rv.goldEarned}G</span>
              <span class="m3-reward-chip">⭐ +${rv.xpEarned} XP</span>
              ${
                rv.buildReduction && rv.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">🔨 -${formatDurationCompactVi(rv.buildReduction.reducedSec)}</span>`
                  : ''
              }
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;">
              <button id="btnPaBackToPark" type="button" class="brass-btn gold-cta" style="padding:9px 18px;font-size:13.5px;">
                🏡 Về Vườn
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.victorySummary) {
      const vs = this.victorySummary;
      const winReview = this.getActiveTurningPointReview();

      if (this.inspectingTurningPoint && winReview) {
        inspectReturnBarHtml = `
          <div class="pa-inspect-return-bar" role="region" aria-label="Đang soi Gương Chiếu Hậu Pháp Thuật">
            <span>🪞 ${escapeHtml(winReview.playedCoordVi)} → <strong>${escapeHtml(winReview.recommendedCoordVi)}</strong></span>
            <div class="pa-inspect-return-actions">
              <button id="btnPaReturnVictoryCard" type="button" class="brass-btn gold-cta">🏆 Bảng Thưởng</button>
              <button id="btnPaNextStage" type="button" class="brass-btn">▶️ Màn ${vs.nextStage}</button>
            </div>
          </div>
        `;
      } else {
        victoryOverlayHtml = `
          <div class="pa-victory-overlay" role="region" aria-label="Hoàn thành màn giải đố">
            <div class="pa-victory-card">
              <div class="pa-victory-title">${
                vs.isMasterReplay || curInfo.isMaxed
                  ? `👑 777/777!`
                  : `🎉 Thắng Màn ${activeStageNum}/${MAX_MINIGAME_STAGE}!`
              }</div>
              <div class="m3-reward-badges">
                ${
                  vs.starsEarned > 0
                    ? `<span class="m3-reward-chip star">
                        <img src="/sprites/m3_icon_star.png" alt="" style="width:16px;height:16px;" />
                        +${vs.starsEarned} 🌟
                      </span>`
                    : `<span class="m3-reward-chip star">👑 777/777</span>`
                }
              </div>
              ${winReview ? this.renderTurningPointCardHtml(winReview) : ''}
              <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;">
                <button id="btnPaNextStage" type="button" class="brass-btn gold-cta" style="padding:9px 18px;font-size:13.5px;">
                  ${vs.isMasterReplay || curInfo.isMaxed ? `👑 Chơi Lại` : `▶️ Màn ${vs.nextStage}`}
                </button>
                ${
                  isScoredMode
                    ? `<button id="btnPaVictoryLeaderboard" type="button" class="brass-btn" style="padding:9px 14px;font-size:13px;">
                        🏆 #${activeModeRank}
                      </button>`
                    : ''
                }
                <button id="btnPaBackToPark" type="button" class="brass-btn" style="padding:9px 14px;font-size:13px;">
                  🏡 Về Vườn (${st.sandboxMode ? '∞' : st.match3.stars} 🌟)
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }

    const trialBadgeFor = (kind: PuzzleArcadeMode | 'match3'): string => {
      if (!reqTrial || st.sandboxMode || this.sim.isHeadmasterPreview) return '';
      if (reqTrial.kind !== kind) return '';
      return `<span class="pa-tab-trial" title="Môn Đề Cử">🔥</span>`;
    };

    const fmtTabLv = (kind: PuzzleArcadeMode | 'match3'): string => {
      const inf = this.sim.getDisciplineStageInfo(kind);
      return inf.isMaxed ? `👑777` : `${inf.currentStage}/777`;
    };

    const isFailedNow =
      (this.mode === 'sudoku' && this.sudokuEngine?.status === 'lost') ||
      (this.mode === 'blocks' && this.onetEngine?.status === 'lost') ||
      (this.mode === 'caro' &&
        (this.caroEngine?.status === 'lost' || this.caroEngine?.status === 'draw')) ||
      (this.mode === 'chess' &&
        (this.chessEngine?.status === 'lost' || this.chessEngine?.status === 'draw'));
    if (isFailedNow && !this.lossStreakResetForStage && !this.rescueContext) {
      this.lossStreakResetForStage = true;
      this.sim.resetExamWinStreak();
    }

    const comp = this.sim.getActiveMinigameCompanion();
    const compReady = this.companionCharge >= comp.chargeEveryMoves;
    const compPct = Math.min(100, Math.round((this.companionCharge / Math.max(1, comp.chargeEveryMoves)) * 100));
    const compSpriteMap: Record<string, string> = {
      niffler_den: 'beast_niffler_play',
      hippogriff_glade: 'beast_hippogriff_bow',
      phoenix_perch: 'beast_phoenix_soar',
      dragon_lair: 'beast_dragon_roar',
      unicorn_glade: 'beast_unicorn_prance',
      thestral_grove: 'beast_thestral_wings',
      hagrid_bowtruckle: 'hagrid_bowtruckle',
    };
    const compShortMap: Record<string, string> = {
      niffler_den: 'Niffler',
      hippogriff_glade: 'Bằng Mã',
      phoenix_perch: 'Phượng',
      dragon_lair: 'Rồng Nhỏ',
      unicorn_glade: 'Kỳ Lân',
      thestral_grove: 'Vong Mã',
      hagrid_bowtruckle: 'Bowtruckle',
    };
    const compSpriteKey = compSpriteMap[comp.speciesId] ?? 'beast_niffler_play';
    const compShortName = compShortMap[comp.speciesId] ?? 'Niffler';
    const pieQty = this.sim.getFarmItemCount('cinnamon_apple_pie');
    const paSynergyDockHtml = `
      <div class="aaa-synergy-dock" role="region" aria-label="Bánh Táo và Đồng hành Niffler">
        <button
          id="btnPaSnackApplePie"
          type="button"
          class="aaa-snack-btn"
          ${this.snackPieUsedThisAttempt || this.victoryClaimed || (!st.sandboxMode && pieQty <= 0) ? 'disabled' : ''}
          title="Dùng 1 Bánh Táo Quế từ Kho Đỏ (Xoá 1 lỗi / +1 Lùi hoặc Đảo + 1 Gợi Ý)"
        >
          <img src="/sprites/ui_icon_pie_ready.png" alt="" width="20" height="20" class="aaa-synergy-sprite" />
          <span><span class="aaa-lbl-full">Bánh Táo </span><strong>${this.snackPieUsedThisAttempt ? '✓' : st.sandboxMode ? '∞' : `×${pieQty}`}</strong></span>
        </button>
        <button
          id="btnPaTriggerCompanion"
          type="button"
          class="aaa-companion-pill"
          data-ready="${compReady}"
          ${!compReady || this.victoryClaimed ? 'disabled' : ''}
          title="${escapeHtml(comp.nameVi)} (Cấp ${comp.bondLevel}) — Đầy năng lượng nhận +1 Gợi Ý Miễn Phí & +15G!"
        >
          <img src="/sprites/${compSpriteKey}.png" alt="" width="22" height="22" class="aaa-synergy-sprite" />
          <span class="aaa-comp-name">${escapeHtml(compShortName)}</span>
          <span class="aaa-comp-meter" aria-hidden="true"><span class="aaa-comp-meter-fill" data-pa-comp-meter="1" style="width:${compPct}%"></span></span>
          <span data-pa-comp-charge="1">${compReady ? '⚡' : `${this.companionCharge}/${comp.chargeEveryMoves}`}</span>
        </button>
      </div>
    `;

    box.innerHTML = `
      <div class="pa-layout-shell">
        <aside class="pa-side-dock" aria-label="Bảng chọn trò chơi và công cụ">
          <div class="pa-top-bar">
            <div class="pa-dock-head-row">
              <div class="pa-currencies">
                <span class="m3-res-chip" title="Sao Phép Thuật">
                  <img src="/sprites/m3_icon_star.png" alt="Sao" class="m3-res-icon" />
                  <strong id="paStarsText">${st.sandboxMode ? '∞' : st.match3.stars}</strong>
                </span>
                <span class="m3-res-chip" title="Cát Xoay Thời Gian">
                  <span>⏳</span>
                  <strong id="paSandText">${st.sandboxMode ? '∞' : st.timeSand}</strong>
                </span>
                <span class="m3-res-chip" title="Vàng Galleon">
                  <span class="g-coin" style="width:17px;height:17px;font-size:10.5px;">G</span>
                  <strong id="paGoldText">${st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN')}</strong>
                </span>
                <span class="m3-res-chip" title="Bùa Phượng Hoàng">
                  <span>🔥</span>
                  <strong id="paTalismanText">${talismanDisp}</strong>
                </span>
                <button id="btnPaOpenLeaderboard" type="button" class="m3-res-chip minigame-lb-chip" title="${isScoredMode ? 'Bảng Xếp Hạng môn này' : 'Bảng Xếp Hạng 3 Môn Tính Điểm (Bùa Gặt • Số Học • Sinh Vật)'}">
                  <span>🏆</span>
                  <strong id="paRankText">${isScoredMode ? `#${activeModeRank}` : '3 Môn'}</strong>
                </button>
              </div>
              <form method="dialog" class="pa-inline-close-form">
                <button type="submit" class="brass-btn pa-inline-close-btn" title="Đóng (Esc)" aria-label="Đóng">✕</button>
              </form>
            </div>

            <div class="pa-mode-tabs" role="tablist" aria-label="Chọn môn khảo thí phép thuật Hogwarts" ${this.rescueContext ? 'style="opacity:0.65;pointer-events:none;"' : ''}>
              <button type="button" role="tab" aria-selected="${this.mode === 'caro'}" data-pa-mode="caro" class="pa-mode-tab ${this.mode === 'caro' ? 'active' : ''}" title="Ngũ Ấn Đạo Tặc">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🗺️ Ngũ Ấn Đạo Tặc</span><span class="pa-tab-name-short">🗺️ Ngũ Ấn</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('caro')}</span>${trialBadgeFor('caro')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'sudoku'}" data-pa-mode="sudoku" class="pa-mode-tab ${this.mode === 'sudoku' ? 'active' : ''}" title="Số Học Huyền Bí">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🔢 Số Học Huyền Bí</span><span class="pa-tab-name-short">🔢 Số Học</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('sudoku')}</span>${trialBadgeFor('sudoku')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'chess'}" data-pa-mode="chess" class="pa-mode-tab ${this.mode === 'chess' ? 'active' : ''}" title="Cờ Phù Thủy">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🏰 Cờ Phù Thủy</span><span class="pa-tab-name-short">🏰 Cờ Phù Thủy</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('chess')}</span>${trialBadgeFor('chess')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'blocks'}" data-pa-mode="blocks" class="pa-mode-tab ${this.mode === 'blocks' ? 'active' : ''}" title="Sinh Vật Huyền Bí">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🦄 Sinh Vật Huyền Bí</span><span class="pa-tab-name-short">🦄 Sinh Vật</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('blocks')}</span>${trialBadgeFor('blocks')}</span>
              </button>
              <button id="btnPaGoMatch3" type="button" role="tab" aria-selected="false" class="pa-mode-tab" title="Bùa Gặt Honeydukes">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🍬 Bùa Gặt Honeydukes</span><span class="pa-tab-name-short">🍬 Bùa Gặt</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('match3')}</span>${trialBadgeFor('match3')}</span>
              </button>
            </div>
          </div>

          <div class="pa-stage-banner">
            <div class="pa-stage-meta">
              <div class="pa-stage-title">${stageHeadline}</div>
              <div class="pa-stage-sub">${stageSubtitle}</div>
            </div>
          </div>

          ${statusBannerHtml}
          ${paSynergyDockHtml}
        </aside>

        <div class="pa-stage-viewport">
          <div class="pa-canvas-shell" data-pa-board-mode="${this.mode}">
            <canvas id="paBoardCanvas" width="${this.getVirtualCanvasSize().w}" height="${this.getVirtualCanvasSize().h}" aria-label="Bàn chơi Sảnh Bàn Cờ &amp; Cổ Ngữ Phép Thuật"></canvas>
            ${inspectReturnBarHtml}
          </div>
        </div>

        <div class="pa-controls-bar">
          ${controlsHtml}
        </div>
        ${victoryOverlayHtml}
      </div>
    `;

    this.bindDOMControls(box);
    this.mountCanvas(box);
  }

  private updateLiveCountersOnly(): void {
    const box = this.root.querySelector('#puzzleArcadeDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = this.sim.state;
    const starsEl = box.querySelector('#paStarsText');
    if (starsEl) starsEl.textContent = st.sandboxMode ? '∞' : String(st.match3.stars);
    const sandEl = box.querySelector('#paSandText');
    if (sandEl) sandEl.textContent = st.sandboxMode ? '∞' : String(st.timeSand);
    const goldEl = box.querySelector('#paGoldText');
    if (goldEl) goldEl.textContent = st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN');
    const talEl = box.querySelector('#paTalismanText');
    if (talEl) talEl.textContent = st.sandboxMode ? '∞' : String(this.sim.getPhoenixTalismanCount());

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      const se = this.sudokuEngine;
      const mistEl = box.querySelector('#paSudokuMistakes');
      if (mistEl) {
        mistEl.textContent = `${se.mistakesCount}/${se.maxMistakes}`;
        mistEl.classList.toggle('pa-err-inline', se.mistakesCount > 0);
      }
      const timerEl = box.querySelector('#paSudokuTimer');
      if (timerEl) {
        timerEl.textContent = se.formatElapsedTime();
      }
      const undoBtn = box.querySelector('#btnPaSudokuUndo') as HTMLButtonElement | null;
      if (undoBtn) {
        undoBtn.disabled = !se.canUndo;
      }
      const hintBtn = box.querySelector('#btnPaSudokuHint') as HTMLButtonElement | null;
      if (hintBtn) {
        const canHint =
          se.status === 'playing' && (st.sandboxMode || se.freeHintsLeft + se.paidHintsLeft > 0);
        hintBtn.disabled = !canHint;
        const pill = hintBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '∞'
            : se.freeHintsLeft > 0
              ? `${se.freeHintsLeft}`
              : se.paidHintsLeft > 0
                ? `${se.hintGoldCost}G`
                : '0';
        }
      }
    } else if (this.mode === 'caro' && this.caroEngine) {
      const prog = box.querySelector('#paCaroMoves');
      if (prog) {
        prog.textContent = `${this.caroEngine.moveHistory.length} nước`;
      }
      const undoBtn = box.querySelector('#btnPaCaroUndo') as HTMLButtonElement | null;
      if (undoBtn) {
        undoBtn.disabled =
          this.caroEngine.moveHistory.length <= this.caroEngine.initialHistoryLen ||
          this.caroEngine.status === 'ai_thinking' ||
          (!st.sandboxMode && this.caroEngine.freeUndosLeft + this.caroEngine.paidUndosLeft <= 0);
      }
      const hintBtn = box.querySelector('#btnPaCaroHint') as HTMLButtonElement | null;
      if (hintBtn) {
        hintBtn.disabled =
          this.caroEngine.status !== 'playing' ||
          (!st.sandboxMode && this.caroEngine.freeHintsLeft + this.caroEngine.paidHintsLeft <= 0);
      }
    } else if (this.mode === 'chess' && this.chessEngine) {
      const turnEl = box.querySelector('#paChessTurn');
      if (turnEl) {
        turnEl.textContent =
          this.chessEngine.status === 'ai_thinking'
            ? `${this.chessEngine.opponentName} đang đi...`
            : this.chessEngine.isInCheck('w')
              ? '⚠️ Chiếu tướng!'
              : 'Lượt bạn';
      }
      const undoBtn = box.querySelector('#btnPaChessUndo') as HTMLButtonElement | null;
      if (undoBtn) {
        undoBtn.disabled =
          this.chessEngine.moveCount === 0 ||
          this.chessEngine.status === 'ai_thinking' ||
          (!st.sandboxMode &&
            this.chessEngine.freeUndosLeft + this.chessEngine.paidUndosLeft <= 0);
      }
      const assistBtn = box.querySelector('#btnPaChessAssist') as HTMLButtonElement | null;
      if (assistBtn) {
        assistBtn.disabled =
          this.chessEngine.status !== 'playing' ||
          (!st.sandboxMode &&
            this.chessEngine.freeHintsLeft + this.chessEngine.paidAssistsLeft <= 0);
      }
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const oe = this.onetEngine;
      const livesEl = box.querySelector('#paOnetLives');
      if (livesEl) {
        livesEl.textContent = st.sandboxMode ? '∞' : String(oe.lives);
        livesEl.classList.toggle('pa-err-inline', !st.sandboxMode && oe.lives <= 2);
      }
      const prog = box.querySelector('#paOnetProgress');
      if (prog) {
        prog.textContent = `${oe.matchedPairs}/${oe.totalPairs}`;
      }
      const hintBtn = box.querySelector('#btnPaOnetHint') as HTMLButtonElement | null;
      if (hintBtn) {
        const canHint =
          oe.status === 'playing' && (st.sandboxMode || oe.freeHintsLeft + oe.paidHintsLeft > 0);
        hintBtn.disabled = !canHint;
        const pill = hintBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '∞'
            : oe.freeHintsLeft > 0
              ? String(oe.freeHintsLeft)
              : oe.paidHintsLeft > 0
                ? `${oe.hintGoldCost}G`
                : '0';
        }
      }
      const shufBtn = box.querySelector('#btnPaOnetShuffle') as HTMLButtonElement | null;
      if (shufBtn) {
        const canShuf =
          (oe.status === 'playing' || oe.status === 'lost') &&
          (st.sandboxMode || oe.lives + oe.paidShufflesLeft > 0);
        shufBtn.disabled = !canShuf;
        const pill = shufBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '❤️∞'
            : oe.lives > 0
              ? `❤️${oe.lives}`
              : oe.paidShufflesLeft > 0
                ? `${oe.shuffleGoldCost}G`
                : '0';
        }
      }
    }

    const compBtn = box.querySelector('#btnPaTriggerCompanion') as HTMLButtonElement | null;
    if (compBtn) {
      const comp = this.sim.getActiveMinigameCompanion();
      const compReady = this.companionCharge >= comp.chargeEveryMoves;
      compBtn.dataset.ready = String(compReady);
      compBtn.disabled = !compReady || this.victoryClaimed;
      const chargeSpan = compBtn.querySelector('[data-pa-comp-charge]');
      if (chargeSpan) {
        chargeSpan.textContent = compReady
          ? '⚡'
          : `${this.companionCharge}/${comp.chargeEveryMoves}`;
      }
      const meterFill = compBtn.querySelector('[data-pa-comp-meter]') as HTMLElement | null;
      if (meterFill) {
        const pct = Math.min(100, Math.round((this.companionCharge / Math.max(1, comp.chargeEveryMoves)) * 100));
        meterFill.style.width = `${pct}%`;
      }
    }
  }

  private bindDOMControls(box: HTMLElement): void {
    box.querySelectorAll<HTMLButtonElement>('[data-pa-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const m = btn.dataset.paMode as PuzzleArcadeMode;
        if (m && m !== this.mode) {
          this.switchMode(m);
        }
      });
    });

    box.querySelector('#btnPaGoMatch3')?.addEventListener('click', () => {
      const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      dlg?.close();
      this.onSwitchToMatch3();
    });

    box.querySelector('#btnPaOpenLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.(this.mode);
    });

    box.querySelector('#btnPaVictoryLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.(this.mode);
    });

    box.querySelector('#btnPaJumpRequiredTrial')?.addEventListener('click', () => {
      const req = this.sim.getRequiredLevelTrial();
      if (!req) return;
      if (req.kind === 'match3') {
        const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
        dlg?.close();
        this.onSwitchToMatch3();
      } else {
        this.switchMode(req.kind);
      }
    });

    // Classic Sudoku controls
    box.querySelector('#btnPaSudokuUndo')?.addEventListener('click', () => {
      this.triggerSudokuUndoAction();
    });

    box.querySelector('#btnPaSudokuPencil')?.addEventListener('click', () => {
      if (!this.sudokuEngine || this.sudokuEngine.status !== 'playing') return;
      this.sudokuEngine.pencilMode = !this.sudokuEngine.pencilMode;
      if (this.sudokuEngine.pencilMode) {
        this.sudokuEngine.eraseMode = false;
      }
      this.persistSudokuSession(true);
      this.sim.audio.playClick();
      this.renderDOM();
    });

    box.querySelector('#btnPaSudokuClear')?.addEventListener('click', () => {
      this.triggerSudokuClearAction(true);
    });

    box.querySelector('#btnPaSudokuHint')?.addEventListener('click', () => {
      this.triggerSudokuHintAction();
    });

    // Caro controls
    box.querySelector('#btnPaCaroUndo')?.addEventListener('click', () => {
      const ce = this.caroEngine;
      if (!ce || ce.moveHistory.length <= ce.initialHistoryLen) return;
      if (!this.sim.state.sandboxMode && ce.freeUndosLeft <= 0 && ce.paidUndosLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Xoay Thời Gian!', '⏳');
        return;
      }
      if (ce.freeUndosLeft > 0) {
        ce.freeUndosLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(ce.undoGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          ce.paidUndosLeft = Math.max(0, ce.paidUndosLeft - 1);
        }
      }
      if (ce.undoTurnPair()) {
        this.aiThinkTimer = 0;
        this.inspectingTurningPoint = false;
        this.persistModeSession('caro', true);
        this.sim.audio.playClick();
        this.renderDOM();
      }
    });

    box.querySelector('#btnPaCaroHint')?.addEventListener('click', () => {
      const ce = this.caroEngine;
      if (!ce || ce.status !== 'playing') return;
      if (!this.sim.state.sandboxMode && ce.freeHintsLeft <= 0 && ce.paidHintsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Bản Đồ Chỉ Nước Đinh!', '🗺️');
        return;
      }
      if (ce.freeHintsLeft > 0) {
        ce.freeHintsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(ce.hintGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          ce.paidHintsLeft = Math.max(0, ce.paidHintsLeft - 1);
        }
      }
      const hint = ce.useBestMoveHint();
      if (hint) {
        this.persistModeSession('caro', true);
        const cx = CARO_ORIGIN_X + hint.c * CARO_STEP_PX;
        const cy = CARO_ORIGIN_Y + hint.r * CARO_STEP_PX;
        this.spawnBurst(cx, cy, '#34d399', 16);
        this.sim.audio.playMatchPop(2);
        this.renderDOM();
      }
    });

    // Wizard's Chess controls
    box.querySelector('#btnPaChessTactics')?.addEventListener('click', () => {
      if (this.chessEngine?.subMode === 'tactics') return;
      if (this.chessEngine?.subModeLocked) {
        this.showToast('🔒 Từ Màn 11/777 trở đi, thể thức mỗi màn được ấn định cố định!', '🏰');
        return;
      }
      this.chessForceSubMode = 'tactics';
      this.resetInteractionState();
      this.ensureEngineForMode('chess', true);
      this.renderDOM();
    });

    box.querySelector('#btnPaChessMatch')?.addEventListener('click', () => {
      if (this.chessEngine?.subMode === 'match') return;
      if (this.chessEngine?.subModeLocked) {
        this.showToast('🔒 Từ Màn 11/777 trở đi, thể thức mỗi màn được ấn định cố định!', '🏰');
        return;
      }
      this.chessForceSubMode = 'match';
      this.resetInteractionState();
      this.ensureEngineForMode('chess', true);
      this.renderDOM();
    });

    box.querySelector('#btnPaChessUndo')?.addEventListener('click', () => {
      const we = this.chessEngine;
      if (!we || we.moveCount === 0) return;
      if (!this.sim.state.sandboxMode && we.freeUndosLeft <= 0 && we.paidUndosLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Đi Lại!', '↩️');
        return;
      }
      if (we.freeUndosLeft > 0) {
        we.freeUndosLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(we.undoGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          we.paidUndosLeft = Math.max(0, we.paidUndosLeft - 1);
        }
      }
      if (we.undoTurnPair()) {
        this.pendingChessWorkerReqId = null;
        this.aiThinkTimer = 0;
        this.inspectingTurningPoint = false;
        this.persistModeSession('chess', true);
        this.sim.audio.playClick();
        this.renderDOM();
      }
    });

    box.querySelector('#btnPaChessAssist')?.addEventListener('click', () => {
      const we = this.chessEngine;
      if (!we || we.status !== 'playing' || we.turn !== 'w') return;

      // Nếu đã có gợi ý đang sáng trên bàn cờ hiện tại, chỉ nháy lại hiệu ứng mà không trừ thêm lượt/vàng
      if (we.hintMove) {
        we.selected = { r: we.hintMove.fromR, c: we.hintMove.fromC };
        const x0 = CHESS_BOARD_X + (we.hintMove.fromC + 0.5) * CHESS_CELL_PX;
        const y0 = CHESS_BOARD_Y + (we.hintMove.fromR + 0.5) * CHESS_CELL_PX;
        const x1 = CHESS_BOARD_X + (we.hintMove.toC + 0.5) * CHESS_CELL_PX;
        const y1 = CHESS_BOARD_Y + (we.hintMove.toR + 0.5) * CHESS_CELL_PX;
        this.spawnBurst(x0, y0, '#fde047', 12);
        this.spawnBurst(x1, y1, '#34d399', 16);
        this.sim.audio.playMatchPop(2);
        this.showToast('💡 Quân cờ và ô đích gợi ý đang phát sáng trên bàn cờ!', '💡');
        this.renderDOM();
        return;
      }

      if (!this.sim.state.sandboxMode && we.freeHintsLeft <= 0 && we.paidAssistsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Gợi Ý nước đi!', '💡');
        return;
      }
      let spentFree = false;
      let spentGold = 0;
      if (we.freeHintsLeft > 0) {
        we.freeHintsLeft -= 1;
        spentFree = true;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(we.assistGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        spentGold = we.assistGoldCost;
        if (!this.sim.state.sandboxMode) {
          we.paidAssistsLeft = Math.max(0, we.paidAssistsLeft - 1);
        }
      }
      const res = we.useBestMoveHint();
      if (!res.ok || !res.move) {
        if (spentFree) {
          we.freeHintsLeft += 1;
        } else if (spentGold > 0 && !this.sim.state.sandboxMode) {
          this.sim.state.galleons += spentGold;
          we.paidAssistsLeft += 1;
        }
        return;
      }
      const x0 = CHESS_BOARD_X + (res.move.fromC + 0.5) * CHESS_CELL_PX;
      const y0 = CHESS_BOARD_Y + (res.move.fromR + 0.5) * CHESS_CELL_PX;
      const x1 = CHESS_BOARD_X + (res.move.toC + 0.5) * CHESS_CELL_PX;
      const y1 = CHESS_BOARD_Y + (res.move.toR + 0.5) * CHESS_CELL_PX;
      this.spawnBurst(x0, y0, '#fde047', 14);
      this.spawnBurst(x1, y1, '#34d399', 18);
      this.sim.audio.playMatchPop(2);
      this.persistModeSession('chess', true);
      this.onParentRefresh();
      this.showToast(`💡 Gợi ý: ${res.labelVi} — chạm ô đích sáng ngọc để đi quân!`, '💡');
      this.renderDOM();
    });

    box.querySelector('#btnPaNextStage')?.addEventListener('click', () => {
      this.resetInteractionState();
      this.ensureEngineForMode(this.mode, true);
      this.renderDOM();
    });

    box.querySelector('#btnPaBackToPark')?.addEventListener('click', () => {
      const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      dlg?.close();
    });

    box.querySelector('#btnPaRestart')?.addEventListener('click', () => {
      this.resetInteractionState();
      this.ensureEngineForMode(this.mode, true);
      this.sim.audio.playClick();
      this.renderDOM();
    });

    // Magical Creatures Onet Connect controls
    box.querySelector('#btnPaOnetHint')?.addEventListener('click', () => {
      const oe = this.onetEngine;
      if (!oe || oe.status !== 'playing') return;
      if (!this.sim.state.sandboxMode && oe.freeHintsLeft <= 0 && oe.paidHintsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Dò Cặp Sinh Vật!', '🔍');
        return;
      }
      if (oe.freeHintsLeft > 0) {
        oe.freeHintsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(oe.hintGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          oe.paidHintsLeft = Math.max(0, oe.paidHintsLeft - 1);
        }
      }
      const res = oe.useHint();
      if (res.ok) {
        this.persistModeSession('blocks', true);
        this.sim.audio.playClick();
        this.showToast(res.msg, '🔍');
        this.renderDOM();
      }
    });

    box.querySelector('#btnPaOnetShuffle')?.addEventListener('click', () => {
      const oe = this.onetEngine;
      if (!oe || (oe.status !== 'playing' && oe.status !== 'lost')) return;
      if (this.sim.state.sandboxMode) {
        const res = oe.useManualShuffle(true);
        if (res.ok) {
          this.persistModeSession('blocks', true);
          this.onetSlideAnims.clear();
          const virt = this.getVirtualCanvasSize();
          this.spawnBurst(virt.w * 0.5, virt.h * 0.5, '#ef4444', 22);
          this.sim.audio.playPowerupBlast();
          this.showToast(res.msg, '🔀');
          this.renderDOM();
        }
        return;
      }
      if (oe.lives <= 0 && oe.paidShufflesLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt ❤️ Đổi Bàn!', '🔀');
        return;
      }
      let res: { ok: boolean; msg: string };
      if (oe.lives > 0) {
        res = oe.useManualShuffle(false);
      } else {
        const pay = this.sim.spendPuzzleHelperGold(oe.shuffleGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        oe.paidShufflesLeft = Math.max(0, oe.paidShufflesLeft - 1);
        res = oe.useManualShuffle(true);
      }
      if (res.ok) {
        this.persistModeSession('blocks', true);
        this.onetSlideAnims.clear();
        const virt = this.getVirtualCanvasSize();
        this.spawnBurst(virt.w * 0.5, virt.h * 0.5, '#ef4444', 22);
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔀');
        this.onParentRefresh();
        this.renderDOM();
      }
    });

    // Phoenix Talisman (strictly 1 use per game per day — max 5 uses/day across all 5 games, never resets until next day)
    const handlePhoenixTalisman = () => {
      const gate = this.sim.canUsePhoenixTalismanInGame(this.mode);
      if (!gate.ok) {
        this.showToast(gate.msg, '🔥');
        return;
      }
      const activeUsed =
        this.mode === 'sudoku'
          ? this.sudokuEngine?.talismanUsed
          : this.mode === 'caro'
            ? this.caroEngine?.talismanUsed
            : this.mode === 'chess'
              ? this.chessEngine?.talismanUsed
              : this.onetEngine?.talismanUsed;
      if (activeUsed) {
        this.showToast(
          'Hôm nay bạn đã dùng 🔥 Bùa Phượng Hoàng ở môn này rồi (giới hạn 1 lần/môn/ngày)!',
          '🔥'
        );
        return;
      }
      const pay = this.sim.consumePhoenixTalisman(this.mode);
      if (!pay.ok) {
        this.showToast(pay.msg, '🔥');
        return;
      }

      if (this.mode === 'sudoku' && this.sudokuEngine) {
        const res = this.sudokuEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        this.spawnWeasleyFireworks(
          SUDOKU_BOARD_X + SUDOKU_BOARD_PX * 0.5,
          SUDOKU_BOARD_Y + SUDOKU_BOARD_PX * 0.5,
          2
        );
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.checkAndClaimVictory();
        } else {
          this.persistSudokuSession(true);
          this.renderDOM();
        }
      } else if (this.mode === 'caro' && this.caroEngine) {
        const res = this.caroEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        this.caroWinRevealTimer = 0;
        this.aiThinkTimer = 0;
        this.spawnWeasleyFireworks(
          CARO_ORIGIN_X + 6 * CARO_STEP_PX,
          CARO_ORIGIN_Y + 6 * CARO_STEP_PX,
          2
        );
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.persistModeSession('caro', true);
        this.onParentRefresh();
        this.renderDOM();
      } else if (this.mode === 'chess' && this.chessEngine) {
        const res = this.chessEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        if (res.move) {
          const movedPiece =
            this.chessEngine.board[res.move.toR]?.[res.move.toC] ?? { color: 'w', type: 'q' };
          this.triggerChessMoveVfx(
            res.move.fromR,
            res.move.fromC,
            res.move.toR,
            res.move.toC,
            movedPiece,
            Boolean(res.move.captured || res.move.isEnPassant),
            res.won
          );
        } else {
          this.spawnWeasleyFireworks(
            CHESS_BOARD_X + CHESS_BOARD_PX * 0.5,
            CHESS_BOARD_Y + CHESS_BOARD_PX * 0.5,
            2
          );
        }
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.checkAndClaimVictory();
        } else if (res.aiThinking) {
          this.aiThinkTimer = 0.42;
          this.persistModeSession('chess', true);
          this.renderDOM();
        } else {
          this.persistModeSession('chess', true);
          this.renderDOM();
        }
      } else if (this.mode === 'blocks' && this.onetEngine) {
        const res = this.onetEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        this.drainOnetMatchVfx();
        const virt = this.getVirtualCanvasSize();
        this.spawnWeasleyFireworks(virt.w * 0.38, virt.h * 0.5, 2);
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.onetWinRevealTimer = 0.28;
        } else {
          this.persistModeSession('blocks', true);
          this.renderDOM();
        }
      }
    };

    box.querySelector('#btnPaPhoenixTalisman')?.addEventListener('click', handlePhoenixTalisman);
    box
      .querySelector('#btnPaRescuePhoenixTalisman')
      ?.addEventListener('click', handlePhoenixTalisman);

    box.querySelector('#btnPaTriggerCompanion')?.addEventListener('click', () => {
      if (this.victoryClaimed) return;
      const comp = this.sim.getActiveMinigameCompanion();
      if (this.companionCharge < comp.chargeEveryMoves) return;
      this.companionCharge = 0;
      if (!this.sim.state.sandboxMode) {
        this.sim.state.galleons += 15;
      }
      if (this.mode === 'sudoku' && this.sudokuEngine) {
        this.sudokuEngine.freeHintsLeft += 1;
      } else if (this.mode === 'caro' && this.caroEngine) {
        this.caroEngine.freeHintsLeft += 1;
      } else if (this.mode === 'chess' && this.chessEngine) {
        this.chessEngine.freeHintsLeft += 1;
      } else if (this.mode === 'blocks' && this.onetEngine) {
        this.onetEngine.freeHintsLeft += 1;
        if (
          this.onetEngine.lives < CreatureOnetEngine.INITIAL_LIVES ||
          this.onetEngine.status === 'lost'
        ) {
          this.onetEngine.reviveWithExtraLives(1);
        }
      }
      this.persistModeSession(this.mode, false);
      const virt = this.getVirtualCanvasSize();
      this.spawnWeasleyFireworks(virt.w * 0.45, virt.h * 0.48, 2);
      this.sim.audio.playSpell();
      this.sim.saveToStorage();
      this.onParentRefresh();
      this.showToast(
        `${comp.emoji} ${comp.nameVi} trợ chiến: +1 Lượt Gợi Ý miễn phí & +15G!`,
        comp.emoji
      );
      this.renderDOM();
    });

    box.querySelector('#btnPaSnackApplePie')?.addEventListener('click', () => {
      if (this.victoryClaimed || this.snackPieUsedThisAttempt) return;
      const res = this.sim.consumeMollyMinigameSnack('cinnamon_apple_pie');
      if (!res.ok) {
        this.showToast(res.msg, '🥧');
        return;
      }
      this.snackPieUsedThisAttempt = true;
      if (this.mode === 'sudoku' && this.sudokuEngine) {
        this.sudokuEngine.mistakesCount = Math.max(0, this.sudokuEngine.mistakesCount - 1);
        if (this.sudokuEngine.status === 'lost') {
          this.sudokuEngine.status = 'playing';
        }
        this.sudokuEngine.freeHintsLeft += 1;
      } else if (this.mode === 'caro' && this.caroEngine) {
        this.caroEngine.freeUndosLeft += 1;
        this.caroEngine.freeHintsLeft += 1;
      } else if (this.mode === 'chess' && this.chessEngine) {
        this.chessEngine.freeUndosLeft += 1;
        this.chessEngine.freeHintsLeft += 1;
      } else if (this.mode === 'blocks' && this.onetEngine) {
        this.onetEngine.reviveWithExtraLives(2);
        this.onetEngine.freeHintsLeft += 1;
      }
      this.persistModeSession(this.mode, true);
      this.onParentRefresh();
      this.showToast('🥧 Bánh Táo Quế Bà Molly: hồi phục lượt trợ giúp & +1 Gợi Ý!', '🥧');
      this.renderDOM();
    });

    box.querySelector('#btnPaAskFriendSos')?.addEventListener('click', () => {
      if (this.rescueContext) return;
      const res = this.sim.requestPlayerMinigameSos(this.mode, this.getActiveEngineStage());
      this.showToast(res.msg, res.ok ? '🦉' : '⚠️');
      if (res.ok) {
        this.sim.audio.playClick();
        this.onParentRefresh();
        this.renderDOM();
      }
    });

    const handleClaimSosRescue = () => {
      const res = this.sim.claimPlayerMinigameSosRescue();
      this.showToast(res.msg, res.ok ? '🎉' : '⚠️');
      if (res.ok) {
        this.sim.audio.playLevelUp();
        this.lastSeenSosRescuedAt = 0;
        this.resetInteractionState();
        this.ensureEngineForMode(this.mode, true);
        this.onParentRefresh();
        this.renderDOM();
      }
    };
    box.querySelector('#btnPaClaimSosRescue')?.addEventListener('click', handleClaimSosRescue);
    box.querySelector('#btnPaSideClaimSos')?.addEventListener('click', handleClaimSosRescue);

    box.querySelector('#btnPaToggleReviewInspect')?.addEventListener('click', () => {
      this.inspectingTurningPoint = !this.inspectingTurningPoint;
      this.sim.audio.playClick();
      this.renderDOM();
    });
    box.querySelector('#btnPaReturnVictoryCard')?.addEventListener('click', () => {
      this.inspectingTurningPoint = false;
      this.sim.audio.playClick();
      this.renderDOM();
    });
  }

  private mountCanvas(box: HTMLElement): void {
    const cvs = box.querySelector('#paBoardCanvas') as HTMLCanvasElement | null;
    if (!cvs) return;
    this.canvas = cvs;

    const toVirtual = (ev: PointerEvent): { vx: number; vy: number } => {
      const rect = cvs.getBoundingClientRect();
      const virt = this.getVirtualCanvasSize();
      const vx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * virt.w;
      const vy = ((ev.clientY - rect.top) / Math.max(1, rect.height)) * virt.h;
      return { vx, vy };
    };

    cvs.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0 && ev.pointerType === 'mouse') return;
      if (this.victoryClaimed) return;
      const pos = toVirtual(ev);
      this.activePointerId = ev.pointerId;
      this.pointerDownPos = pos;
      this.pointerCurrPos = pos;
      this.hasDragged = false;
      try {
        cvs.setPointerCapture(ev.pointerId);
      } catch {
        // Ignore synthetic pointer events
      }
      this.handlePointerDown(pos.vx, pos.vy);
    });

    cvs.addEventListener('pointermove', (ev) => {
      const pos = toVirtual(ev);
      this.pointerCurrPos = pos;
      if (this.activePointerId === ev.pointerId && this.pointerDownPos) {
        if (Math.hypot(pos.vx - this.pointerDownPos.vx, pos.vy - this.pointerDownPos.vy) > 6) {
          this.hasDragged = true;
        }
        this.handlePointerDrag(pos.vx, pos.vy);
      } else {
        this.handlePointerHover(pos.vx, pos.vy);
      }
    });

    const finishPointer = (ev: PointerEvent) => {
      if (this.activePointerId !== ev.pointerId) return;
      const pos = toVirtual(ev);
      this.pointerCurrPos = pos;
      this.handlePointerUp(pos.vx, pos.vy);
      this.activePointerId = null;
      this.pointerDownPos = null;
    };

    cvs.addEventListener('pointerup', finishPointer);
    cvs.addEventListener('pointercancel', finishPointer);
    cvs.addEventListener('pointerleave', () => {
      this.hoveredTileUid = null;
      this.sudokuHoverCell = null;
      this.sudokuHoverPadDigit = null;
      this.sudokuHoverAction = null;
      this.caroHoverCell = null;
      this.chessHoverSquare = null;
      this.onetHoverCell = null;
    });
  }

  // ==========================================================================
  // POINTER HANDLERS FOR ALL PUZZLE MODES
  // ==========================================================================

  private triggerSudokuUndoAction(): void {
    const se = this.sudokuEngine;
    if (!se || !se.canUndo) {
      this.sim.audio.playClick();
      return;
    }
    const wasLost = se.status === 'lost';
    if (se.undo()) {
      this.persistSudokuSession(true);
      if (se.selected) {
        const cx = SUDOKU_BOARD_X + (se.selected.c + 0.5) * SUDOKU_CELL_PX;
        const cy = SUDOKU_BOARD_Y + (se.selected.r + 0.5) * SUDOKU_CELL_PX;
        this.spawnBurst(cx, cy, '#fcd34d', 10);
      }
      this.sim.audio.playClick();
      if (wasLost) {
        this.renderDOM();
      } else {
        this.updateLiveCountersOnly();
      }
    }
  }

  private triggerSudokuHintAction(): void {
    if (!this.sudokuEngine || this.sudokuEngine.status !== 'playing') return;
    const se = this.sudokuEngine;
    if (!this.sim.state.sandboxMode && se.freeHintsLeft <= 0 && se.paidHintsLeft <= 0) {
      this.showToast('Màn này đã dùng hết lượt Gợi Ý!', '💡');
      return;
    }
    if (se.freeHintsLeft > 0) {
      se.freeHintsLeft -= 1;
    } else {
      const pay = this.sim.spendPuzzleHelperGold(se.hintGoldCost);
      if (!pay.ok) {
        this.showToast(pay.msg, '🪙');
        return;
      }
      if (!this.sim.state.sandboxMode) {
        se.paidHintsLeft = Math.max(0, se.paidHintsLeft - 1);
      }
    }
    const res = se.useMagicHint();
    if (res.ok) {
      const cx = SUDOKU_BOARD_X + (res.c + 0.5) * SUDOKU_CELL_PX;
      const cy = SUDOKU_BOARD_Y + (res.r + 0.5) * SUDOKU_CELL_PX;
      this.spawnBurst(cx, cy, '#fbbf24', 18);
      this.sim.audio.playPowerupBlast();
      if (res.won) {
        this.checkAndClaimVictory();
      } else {
        this.persistSudokuSession(true);
        this.renderDOM();
      }
    }
  }

  private applySudokuDigit(digit: number): void {
    if (!this.sudokuEngine || this.sudokuEngine.status !== 'playing') return;
    const prevRem = this.sudokuEngine.getRemainingDigitCounts()[digit] ?? 0;
    const res = this.sudokuEngine.inputDigit(digit);
    if (!res.changed) {
      this.persistSudokuSession(false);
      this.sim.audio.playClick();
      return;
    }
    const sel = this.sudokuEngine.selected;
    if (sel) {
      const cx = SUDOKU_BOARD_X + (sel.c + 0.5) * SUDOKU_CELL_PX;
      const cy = SUDOKU_BOARD_Y + (sel.r + 0.5) * SUDOKU_CELL_PX;
      this.spawnBurst(
        cx,
        cy,
        res.conflict ? '#dc2626' : this.sudokuEngine.pencilMode ? '#d97706' : '#fbbf24',
        res.conflict ? 8 : 12
      );
      const nextRem = this.sudokuEngine.getRemainingDigitCounts()[digit] ?? 0;
      if (!res.conflict && prevRem === 1 && nextRem === 0) {
        const padRect = this.sudokuPadRects.get(digit);
        if (padRect) {
          this.spawnBurst(padRect.x + padRect.w * 0.5, padRect.y + padRect.h * 0.5, '#fde047', 18);
        }
      }
    }
    if (res.conflict) {
      this.sim.audio.playClick();
    } else {
      this.bumpCompanionCharge();
      this.sim.audio.playMatchPop(1);
    }
    if (res.won) {
      this.checkAndClaimVictory();
    } else if (res.lost) {
      this.persistSudokuSession(true);
      this.showToast(
        `❌ Đã sai ${this.sudokuEngine.mistakesCount}/${this.sudokuEngine.maxMistakes} lần — Bấm ↩️ Hoàn Tác hoặc 🧹 Xoá để sửa!`,
        '❌'
      );
      this.renderDOM();
    } else {
      this.persistSudokuSession(true);
      this.updateLiveCountersOnly();
    }
  }

  private triggerSudokuClearAction(fromButton = false): void {
    const se = this.sudokuEngine;
    if (!se || (se.status !== 'playing' && se.status !== 'lost')) return;
    const wasLost = se.status === 'lost';
    const wasEraseMode = se.eraseMode;
    if (se.clearSelectedCell()) {
      se.eraseMode = false;
      this.persistSudokuSession(true);
      if (se.selected) {
        const cx = SUDOKU_BOARD_X + (se.selected.c + 0.5) * SUDOKU_CELL_PX;
        const cy = SUDOKU_BOARD_Y + (se.selected.r + 0.5) * SUDOKU_CELL_PX;
        this.spawnBurst(cx, cy, '#e7cba0', 10);
      }
      this.sim.audio.playClick();
      if (wasLost || wasEraseMode) {
        this.renderDOM();
      } else {
        this.updateLiveCountersOnly();
      }
      return;
    }

    if (fromButton) {
      se.eraseMode = !se.eraseMode;
      if (se.eraseMode) {
        se.pencilMode = false;
        this.showToast('🧹 Đã bật tẩy — chạm vào ô bạn đã điền để xoá!', '🧹');
      }
      this.persistSudokuSession(true);
      this.sim.audio.playClick();
      this.renderDOM();
    } else {
      this.sim.audio.playClick();
    }
  }

  private getCaroIntersectionAt(vx: number, vy: number): { r: number; c: number } | null {
    const c = Math.round((vx - CARO_ORIGIN_X) / CARO_STEP_PX);
    const r = Math.round((vy - CARO_ORIGIN_Y) / CARO_STEP_PX);
    if (r < 0 || r >= CARO_BOARD_SIZE || c < 0 || c >= CARO_BOARD_SIZE) return null;
    const ix = CARO_ORIGIN_X + c * CARO_STEP_PX;
    const iy = CARO_ORIGIN_Y + r * CARO_STEP_PX;
    if (Math.hypot(vx - ix, vy - iy) > CARO_STEP_PX * 0.52) return null;
    return { r, c };
  }

  private handleChessSquareAction(r: number, c: number): void {
    if (!this.chessEngine || this.chessEngine.status !== 'playing') return;
    const res = this.chessEngine.clickSquare(r, c);
    if (!res.moved) {
      this.persistModeSession('chess', false);
      this.sim.audio.playClick();
      return;
    }
    this.bumpCompanionCharge();
    const lm = this.chessEngine.lastMove;
    const movedPiece =
      (lm ? this.chessEngine.board[lm.toR]?.[lm.toC] : null) ?? { color: 'w', type: 'p' };
    if (lm) {
      this.triggerChessMoveVfx(lm.fromR, lm.fromC, lm.toR, lm.toC, movedPiece, res.captured, res.won);
    }
    this.sim.audio.playChessClack(res.captured);
    if (res.captured || res.promoted) {
      this.hitStopTimer = 0.035;
      this.sim.audio.playPowerupBlast();
    } else {
      this.sim.audio.playMatchPop(1);
    }
    if (res.won) {
      this.checkAndClaimVictory();
    } else if (res.aiThinking) {
      this.aiThinkTimer = 0.42;
      this.persistModeSession('chess', true);
      this.updateLiveCountersOnly();
    } else if (res.draw) {
      this.persistModeSession('chess', true);
      this.renderDOM();
    } else {
      this.persistModeSession('chess', true);
      this.updateLiveCountersOnly();
    }
  }

  private handlePointerDown(vx: number, vy: number): void {
    if (this.mode === 'sudoku' && this.sudokuEngine) {
      const se = this.sudokuEngine;
      for (const [act, rect] of this.sudokuActionRects.entries()) {
        if (vx >= rect.x && vx <= rect.x + rect.w && vy >= rect.y && vy <= rect.y + rect.h) {
          if (act === 'undo') {
            this.triggerSudokuUndoAction();
          } else if (act === 'erase') {
            this.triggerSudokuClearAction(true);
          } else if (act === 'notes') {
            if (se.status === 'playing') {
              se.pencilMode = !se.pencilMode;
              if (se.pencilMode) se.eraseMode = false;
              this.persistSudokuSession(true);
              this.sim.audio.playClick();
              this.renderDOM();
            } else {
              this.sim.audio.playClick();
            }
          } else if (act === 'hint') {
            this.triggerSudokuHintAction();
          }
          return;
        }
      }

      if (
        vx >= SUDOKU_BOARD_X &&
        vx <= SUDOKU_BOARD_X + SUDOKU_BOARD_PX &&
        vy >= SUDOKU_BOARD_Y &&
        vy <= SUDOKU_BOARD_Y + SUDOKU_BOARD_PX
      ) {
        const c = Math.min(8, Math.max(0, Math.floor((vx - SUDOKU_BOARD_X) / SUDOKU_CELL_PX)));
        const r = Math.min(8, Math.max(0, Math.floor((vy - SUDOKU_BOARD_Y) / SUDOKU_CELL_PX)));
        const isSameSelected = se.selected?.r === r && se.selected?.c === c;
        if (se.eraseMode || (isSameSelected && se.isWrongCell(r, c))) {
          const wasLost = se.status === 'lost';
          const wasErase = se.eraseMode;
          if (se.clearCellAt(r, c)) {
            se.eraseMode = false;
            se.selectCell(r, c);
            this.persistSudokuSession(true);
            const cx = SUDOKU_BOARD_X + (c + 0.5) * SUDOKU_CELL_PX;
            const cy = SUDOKU_BOARD_Y + (r + 0.5) * SUDOKU_CELL_PX;
            this.spawnBurst(cx, cy, '#e7cba0', 10);
            this.sim.audio.playClick();
            if (wasLost || wasErase) {
              this.renderDOM();
            } else {
              this.updateLiveCountersOnly();
            }
            return;
          }
        }
        se.selectCell(r, c);
        this.persistSudokuSession(true);
        this.sim.audio.playClick();
        return;
      }

      for (const [digit, rect] of this.sudokuPadRects.entries()) {
        if (vx >= rect.x && vx <= rect.x + rect.w && vy >= rect.y && vy <= rect.y + rect.h) {
          this.applySudokuDigit(digit);
          return;
        }
      }
      return;
    }

    if (this.mode === 'caro' && this.caroEngine) {
      if (this.caroEngine.status !== 'playing' || this.caroWinRevealTimer > 0) return;
      const cell = this.getCaroIntersectionAt(vx, vy);
      if (!cell) return;
      const res = this.caroEngine.playHumanMove(cell.r, cell.c);
      if (!res.ok) {
        this.sim.audio.playClick();
        return;
      }
      this.bumpCompanionCharge();
      this.caroLastMoveAnim = { r: cell.r, c: cell.c, age: 0, duration: 0.24 };
      const ix = CARO_ORIGIN_X + cell.c * CARO_STEP_PX;
      const iy = CARO_ORIGIN_Y + cell.r * CARO_STEP_PX;
      this.spawnBurst(ix, iy, '#fde047', 16);
      this.sim.audio.playChessClack(res.won);
      if (res.won) {
        this.hitStopTimer = 0.035;
        this.sim.audio.playPowerupBlast();
        this.spawnWeasleyFireworks(ix, iy, 4);
        this.caroFireworkTimer = 0.22;
        this.caroWinRevealTimer = 0.72;
        this.updateLiveCountersOnly();
      } else {
        this.persistModeSession('caro', true);
        this.sim.audio.playMatchPop(1);
        if (res.aiThinking) {
          this.aiThinkTimer = 0.28;
          this.updateLiveCountersOnly();
        } else if (res.draw) {
          this.renderDOM();
        }
      }
      return;
    }

    if (this.mode === 'chess' && this.chessEngine) {
      if (
        vx >= CHESS_BOARD_X &&
        vx <= CHESS_BOARD_X + CHESS_BOARD_PX &&
        vy >= CHESS_BOARD_Y &&
        vy <= CHESS_BOARD_Y + CHESS_BOARD_PX
      ) {
        const c = Math.min(7, Math.max(0, Math.floor((vx - CHESS_BOARD_X) / CHESS_CELL_PX)));
        const r = Math.min(7, Math.max(0, Math.floor((vy - CHESS_BOARD_Y) / CHESS_CELL_PX)));
        const p = this.chessEngine.board[r]?.[c];
        this.chessDragFrom = p && p.color === 'w' ? { r, c } : null;
        this.handleChessSquareAction(r, c);
      }
      return;
    }

    if (this.mode === 'blocks' && this.onetEngine && this.onetEngine.status === 'playing') {
      const m = this.computeOnetBoardMetrics(this.onetEngine);
      if (
        vx >= m.originX &&
        vx <= m.originX + m.boardW &&
        vy >= m.originY &&
        vy <= m.originY + m.boardH
      ) {
        const dc = Math.min(
          m.dispCols - 1,
          Math.max(0, Math.floor((vx - m.originX) / m.cellW))
        );
        const dr = Math.min(
          m.dispRows - 1,
          Math.max(0, Math.floor((vy - m.originY) / m.cellH))
        );
        const r = m.transposed ? dc : dr;
        const c = m.transposed ? dr : dc;
        this.onetCursorCell = { r, c };
        this.handleOnetCellTap(r, c);
      } else {
        this.onetEngine.selected = null;
      }
      return;
    }
  }

  private handlePointerDrag(vx: number, vy: number): void {
    if (this.mode === 'chess' && this.chessEngine) {
      if (
        vx >= CHESS_BOARD_X &&
        vx <= CHESS_BOARD_X + CHESS_BOARD_PX &&
        vy >= CHESS_BOARD_Y &&
        vy <= CHESS_BOARD_Y + CHESS_BOARD_PX
      ) {
        const c = Math.min(7, Math.max(0, Math.floor((vx - CHESS_BOARD_X) / CHESS_CELL_PX)));
        const r = Math.min(7, Math.max(0, Math.floor((vy - CHESS_BOARD_Y) / CHESS_CELL_PX)));
        this.chessHoverSquare = { r, c };
      } else {
        this.chessHoverSquare = null;
      }
      return;
    }
  }

  private handlePointerHover(vx: number, vy: number): void {
    if (this.mode === 'chess' && this.chessEngine) {
      if (
        vx >= CHESS_BOARD_X &&
        vx <= CHESS_BOARD_X + CHESS_BOARD_PX &&
        vy >= CHESS_BOARD_Y &&
        vy <= CHESS_BOARD_Y + CHESS_BOARD_PX
      ) {
        const c = Math.min(7, Math.max(0, Math.floor((vx - CHESS_BOARD_X) / CHESS_CELL_PX)));
        const r = Math.min(7, Math.max(0, Math.floor((vy - CHESS_BOARD_Y) / CHESS_CELL_PX)));
        this.chessHoverSquare = { r, c };
      } else {
        this.chessHoverSquare = null;
      }
      return;
    }
    this.chessHoverSquare = null;

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      if (
        vx >= SUDOKU_BOARD_X &&
        vx <= SUDOKU_BOARD_X + SUDOKU_BOARD_PX &&
        vy >= SUDOKU_BOARD_Y &&
        vy <= SUDOKU_BOARD_Y + SUDOKU_BOARD_PX
      ) {
        const c = Math.min(8, Math.max(0, Math.floor((vx - SUDOKU_BOARD_X) / SUDOKU_CELL_PX)));
        const r = Math.min(8, Math.max(0, Math.floor((vy - SUDOKU_BOARD_Y) / SUDOKU_CELL_PX)));
        this.sudokuHoverCell = { r, c };
      } else {
        this.sudokuHoverCell = null;
      }
      let hoverPad: number | null = null;
      for (const [digit, rect] of this.sudokuPadRects.entries()) {
        if (vx >= rect.x && vx <= rect.x + rect.w && vy >= rect.y && vy <= rect.y + rect.h) {
          hoverPad = digit;
          break;
        }
      }
      this.sudokuHoverPadDigit = hoverPad;

      let hoverAct: SudokuQuickActionKey | null = null;
      for (const [act, rect] of this.sudokuActionRects.entries()) {
        if (vx >= rect.x && vx <= rect.x + rect.w && vy >= rect.y && vy <= rect.y + rect.h) {
          hoverAct = act;
          break;
        }
      }
      this.sudokuHoverAction = hoverAct;
      return;
    }
    this.sudokuHoverCell = null;
    this.sudokuHoverPadDigit = null;
    this.sudokuHoverAction = null;

    if (this.mode === 'caro' && this.caroEngine && this.caroEngine.status === 'playing') {
      const cell = this.getCaroIntersectionAt(vx, vy);
      this.caroHoverCell =
        cell && this.caroEngine.grid[cell.r]?.[cell.c] === 0 ? cell : null;
      return;
    }
    this.caroHoverCell = null;

    if (this.mode === 'blocks' && this.onetEngine && this.onetEngine.status === 'playing') {
      const m = this.computeOnetBoardMetrics(this.onetEngine);
      if (
        vx >= m.originX &&
        vx <= m.originX + m.boardW &&
        vy >= m.originY &&
        vy <= m.originY + m.boardH
      ) {
        const dc = Math.min(
          m.dispCols - 1,
          Math.max(0, Math.floor((vx - m.originX) / m.cellW))
        );
        const dr = Math.min(
          m.dispRows - 1,
          Math.max(0, Math.floor((vy - m.originY) / m.cellH))
        );
        const r = m.transposed ? dc : dr;
        const c = m.transposed ? dr : dc;
        this.onetHoverCell = this.onetEngine.grid[r]?.[c] ? { r, c } : null;
      } else {
        this.onetHoverCell = null;
      }
      return;
    }
    this.onetHoverCell = null;
  }

  private handlePointerUp(vx: number, vy: number): void {
    if (this.mode === 'chess' && this.chessEngine) {
      const from = this.chessDragFrom;
      this.chessDragFrom = null;
      if (
        from &&
        this.hasDragged &&
        this.chessEngine.selected &&
        this.chessEngine.selected.r === from.r &&
        this.chessEngine.selected.c === from.c &&
        vx >= CHESS_BOARD_X &&
        vx <= CHESS_BOARD_X + CHESS_BOARD_PX &&
        vy >= CHESS_BOARD_Y &&
        vy <= CHESS_BOARD_Y + CHESS_BOARD_PX
      ) {
        const c2 = Math.min(7, Math.max(0, Math.floor((vx - CHESS_BOARD_X) / CHESS_CELL_PX)));
        const r2 = Math.min(7, Math.max(0, Math.floor((vy - CHESS_BOARD_Y) / CHESS_CELL_PX)));
        if (r2 !== from.r || c2 !== from.c) {
          this.handleChessSquareAction(r2, c2);
        }
      }
      return;
    }
  }

  private computeOnetBoardMetrics(engine: CreatureOnetEngine): {
    frameX: number;
    frameY: number;
    frameW: number;
    frameH: number;
    originX: number;
    originY: number;
    cellW: number;
    cellH: number;
    outerTrackMargin: number;
    boardW: number;
    boardH: number;
    dispRows: number;
    dispCols: number;
    transposed: boolean;
  } {
    const virt = this.getVirtualCanvasSize();
    // Auto-orient 16 rows × 9 cols whenever canvas is taller than wide so all 144 tiles fill the viewport!
    const transposed = virt.h > virt.w * 1.02 && engine.cols > engine.rows;
    const dispRows = transposed ? engine.cols : engine.rows;
    const dispCols = transposed ? engine.rows : engine.cols;

    const outerTrackMargin = Math.max(
      9,
      Math.min(13, Math.round(Math.min(virt.w, virt.h) * 0.018))
    );
    const boxPad = 2;
    const availW = Math.max(180, virt.w - (outerTrackMargin + boxPad) * 2);
    const availH = Math.max(180, virt.h - (outerTrackMargin + boxPad) * 2);
    const rawCellW = availW / dispCols;
    const rawCellH = availH / dispRows;
    const cellW = Math.min(rawCellW, rawCellH * 1.75);
    const cellH = Math.min(rawCellH, rawCellW * 1.75);
    const boardW = dispCols * cellW;
    const boardH = dispRows * cellH;
    const originX = (virt.w - boardW) * 0.5;
    const originY = (virt.h - boardH) * 0.5;
    return {
      frameX: originX - outerTrackMargin,
      frameY: originY - outerTrackMargin,
      frameW: boardW + outerTrackMargin * 2,
      frameH: boardH + outerTrackMargin * 2,
      originX,
      originY,
      cellW,
      cellH,
      outerTrackMargin,
      boardW,
      boardH,
      dispRows,
      dispCols,
      transposed,
    };
  }

  private onetPointToPixel(
    pt: OnetPoint,
    _engine: CreatureOnetEngine,
    m: ReturnType<PuzzleArcadeModalController['computeOnetBoardMetrics']>
  ): { x: number; y: number } {
    const dr = m.transposed ? pt.c : pt.r;
    const dc = m.transposed ? pt.r : pt.c;
    const borderOffset = Math.round(m.outerTrackMargin * 0.58);
    const px =
      dc < 0
        ? m.originX - borderOffset
        : dc >= m.dispCols
          ? m.originX + m.boardW + borderOffset
          : m.originX + (dc + 0.5) * m.cellW;
    const py =
      dr < 0
        ? m.originY - borderOffset
        : dr >= m.dispRows
          ? m.originY + m.boardH + borderOffset
          : m.originY + (dr + 0.5) * m.cellH;
    return { x: px, y: py };
  }

  private handleOnetCellTap(r: number, c: number): void {
    if (!this.onetEngine || this.onetEngine.status !== 'playing') return;
    const res = this.onetEngine.tapCell(r, c);
    if (
      res.action === 'empty' ||
      res.action === 'selected' ||
      res.action === 'deselected' ||
      res.action === 'switched'
    ) {
      this.persistModeSession('blocks', false);
      this.sim.audio.playClick();
      return;
    }
    if (res.action === 'blocked') {
      this.onetBlockedFlash = { r, c, age: 0, duration: 0.28 };
      this.sim.audio.playClick();
      this.updateLiveCountersOnly();
      return;
    }
    if (res.action === 'matched') {
      this.bumpCompanionCharge();
      this.drainOnetMatchVfx(Boolean(res.autoShuffled));
      const comboLv = Math.min(6, Math.max(1, this.onetEngine.combo));
      this.sim.audio.playMatchPop(comboLv);
      if (this.onetEngine.combo >= 4) {
        this.hitStopTimer = 0.028;
      }
      if ((res.autoShuffled || res.lost) && this.onetEngine.lastAutoShuffleNotice) {
        this.showToast(this.onetEngine.lastAutoShuffleNotice, res.lost ? '💔' : '🔀');
      }
      if (res.won) {
        this.onetWinRevealTimer = 0.3;
        this.updateLiveCountersOnly();
      } else if (res.lost || res.autoShuffled) {
        this.persistModeSession('blocks', true);
        this.renderDOM();
      } else {
        this.persistModeSession('blocks', true);
        this.updateLiveCountersOnly();
      }
    }
  }

  private drainOnetMatchVfx(skipSlideAnims = false): void {
    if (!this.onetEngine) return;
    const m = this.computeOnetBoardMetrics(this.onetEngine);
    while (this.onetEngine.matchVfxQueue.length > 0) {
      const ev = this.onetEngine.matchVfxQueue.shift()!;
      const pts = ev.waypoints.map((wp) => this.onetPointToPixel(wp, this.onetEngine!, m));
      this.onetBeams.push({
        points: pts,
        accent: '#ef4444',
        age: 0,
        duration: 0.3,
      });
      const pFrom = this.onetPointToPixel(ev.from, this.onetEngine, m);
      const pTo = this.onetPointToPixel(ev.to, this.onetEngine, m);
      this.spawnBurst(pFrom.x, pFrom.y, '#ef4444', 10);
      this.spawnBurst(pTo.x, pTo.y, '#ef4444', 10);
    }
    if (skipSlideAnims) {
      this.onetEngine.slideVfxQueue.length = 0;
      this.onetSlideAnims.clear();
      return;
    }
    while (this.onetEngine.slideVfxQueue.length > 0) {
      const sev = this.onetEngine.slideVfxQueue.shift()!;
      this.onetSlideAnims.set(`${sev.toR},${sev.toC}`, {
        fromR: sev.fromR,
        fromC: sev.fromC,
        age: 0,
        duration: 0.19,
      });
    }
  }

  private drainTilePopVfx(): void {
    if (!this.tileEngine) return;
    while (this.tileEngine.poppedSymbolVfx.length > 0) {
      const ev = this.tileEngine.poppedSymbolVfx.shift()!;
      const sym = TILE_MATCH_SYMBOLS.find((s) => s.id === ev.symbolId);
      const sx = TILE_TRAY_X + 12 + (ev.slotIdx + 0.5) * TILE_TRAY_SLOT_W;
      const sy = TILE_TRAY_Y + TILE_TRAY_H * 0.5;
      this.spawnBurst(sx, sy, sym?.accent ?? '#facc15', 24);
    }
  }

  private getTileScreenCenter(t: LayeredTileCard): { x: number; y: number } {
    const lift = t.layer * 4.5;
    return {
      x: TILE_GRID_ORIGIN_X + (t.gx + 0.5) * TILE_STEP_X - lift * 0.6,
      y: TILE_GRID_ORIGIN_Y + (t.gy + 0.5) * TILE_STEP_Y - lift,
    };
  }

  private findTopFreeTileAt(vx: number, vy: number): LayeredTileCard | null {
    if (!this.tileEngine || this.tileEngine.status !== 'playing') return null;
    const freeTiles = this.tileEngine.tiles
      .filter((t) => this.tileEngine!.isTileFree(t))
      .sort((a, b) => (b.layer !== a.layer ? b.layer - a.layer : b.gy - a.gy));

    for (const t of freeTiles) {
      const pos = this.getTileScreenCenter(t);
      if (
        Math.abs(vx - pos.x) <= TILE_CARD_W * 0.5 &&
        Math.abs(vy - pos.y) <= TILE_CARD_H * 0.5
      ) {
        return t;
      }
    }
    return null;
  }

  // ==========================================================================
  // 60FPS ANIMATION & HIGH-DPI CANVAS RENDERING
  // ==========================================================================

  private startLoop(): void {
    this.stopLoop();
    this.lastFrameTs = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTs) / 1000));
      this.lastFrameTs = now;
      if (!this.rescueContext) {
        const curRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
        if (curRescuedAt !== this.lastSeenSosRescuedAt) {
          this.lastSeenSosRescuedAt = curRescuedAt;
          this.renderDOM();
        }
      }
      this.tickAnimations(dt);
      this.drawFrame();
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopLoop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private tickAnimations(dt: number): void {
    if (this.hitStopTimer > 0) {
      this.hitStopTimer = Math.max(0, this.hitStopTimer - dt);
      return;
    }

    if (!this.victoryClaimed) {
      if (this.mode === 'sudoku' && this.sudokuEngine) {
        const isPageHidden = typeof document !== 'undefined' && document.hidden;
        if (!isPageHidden && this.sudokuEngine.tickTimer(dt)) {
          const timerEl = this.root.querySelector('#paSudokuTimer');
          if (timerEl) {
            timerEl.textContent = this.sudokuEngine.formatElapsedTime();
          }
        }
        if (!isPageHidden && !this.rescueContext && this.sudokuEngine.status === 'playing') {
          this.sudokuAutoSaveAccumSec += dt;
          if (this.sudokuAutoSaveAccumSec >= 5) {
            this.sudokuAutoSaveAccumSec = 0;
            this.persistSudokuSession(true);
            this.persistActiveModalResumeMarker();
          }
        }
      } else if (this.mode === 'blocks' && this.onetWinRevealTimer > 0) {
        this.onetWinRevealTimer -= dt;
        if (this.onetWinRevealTimer <= 0) {
          this.onetWinRevealTimer = 0;
          this.checkAndClaimVictory();
        }
      } else if (this.mode === 'caro' && this.caroWinRevealTimer > 0) {
        this.caroWinRevealTimer -= dt;
        this.caroFireworkTimer -= dt;
        if (this.caroFireworkTimer <= 0) {
          this.caroFireworkTimer = 0.24;
          this.spawnWeasleyFireworks(
            CARO_FRAME_X + CARO_FRAME_PX * 0.5,
            CARO_FRAME_Y + CARO_FRAME_PX * 0.45,
            2
          );
        }
        if (this.caroWinRevealTimer <= 0) {
          this.caroWinRevealTimer = 0;
          this.checkAndClaimVictory();
        }
      } else if (
        this.mode === 'caro' &&
        this.caroEngine &&
        this.caroEngine.status === 'ai_thinking'
      ) {
        this.aiThinkTimer -= dt;
        if (this.aiThinkTimer <= 0) {
          const aiRes = this.caroEngine.stepAiMove();
          if (aiRes) {
            this.persistModeSession('caro', true);
            this.caroLastMoveAnim = { r: aiRes.r, c: aiRes.c, age: 0, duration: 0.24 };
            const ix = CARO_ORIGIN_X + aiRes.c * CARO_STEP_PX;
            const iy = CARO_ORIGIN_Y + aiRes.r * CARO_STEP_PX;
            this.spawnBurst(ix, iy, '#34d399', 15);
            this.sim.audio.playChessClack(Boolean(aiRes.aiWon));
            if (aiRes.aiWon || aiRes.draw) {
              this.renderDOM();
            } else {
              this.updateLiveCountersOnly();
            }
          }
        }
      } else if (
        this.mode === 'chess' &&
        this.chessEngine &&
        this.chessEngine.status === 'ai_thinking'
      ) {
        this.aiThinkTimer -= dt;
        if (this.aiThinkTimer <= 0) {
          this.dispatchChessAiTurn();
        }
      }
    }

    if (this.caroLastMoveAnim) {
      this.caroLastMoveAnim.age += dt;
      if (this.caroLastMoveAnim.age >= this.caroLastMoveAnim.duration) {
        this.caroLastMoveAnim = null;
      }
    }

    if (this.chessMoveAnim) {
      this.chessMoveAnim.age += dt;
      if (this.chessMoveAnim.age >= this.chessMoveAnim.duration) {
        this.chessMoveAnim = null;
      }
    }

    for (let i = this.chessSpellBeams.length - 1; i >= 0; i--) {
      const b = this.chessSpellBeams[i];
      b.age += dt;
      if (b.age >= b.duration) {
        this.chessSpellBeams.splice(i, 1);
      }
    }

    if (this.chessShakeTimer > 0) {
      this.chessShakeTimer = Math.max(0, this.chessShakeTimer - dt);
    }

    if (this.onetBlockedFlash) {
      this.onetBlockedFlash.age += dt;
      if (this.onetBlockedFlash.age >= this.onetBlockedFlash.duration) {
        this.onetBlockedFlash = null;
      }
    }

    for (let i = this.onetBeams.length - 1; i >= 0; i--) {
      const b = this.onetBeams[i];
      b.age += dt;
      if (b.age >= b.duration) {
        this.onetBeams.splice(i, 1);
      }
    }

    for (const [key, anim] of this.onetSlideAnims.entries()) {
      anim.age += dt;
      if (anim.age >= anim.duration) {
        this.onetSlideAnims.delete(key);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.duration) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 320 * dt;
      p.rot += p.vRot * dt;
    }

    for (let i = this.flyingTiles.length - 1; i >= 0; i--) {
      const f = this.flyingTiles[i];
      f.age += dt;
      if (f.age >= f.duration) {
        this.flyingTiles.splice(i, 1);
      }
    }
  }

  private drawFrame(): void {
    const cvs = this.canvas;
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;

    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (cvs.width !== targetW || cvs.height !== targetH) {
      cvs.width = targetW;
      cvs.height = targetH;
    }

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const virt = this.getVirtualCanvasSize();
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(targetW / virt.w, targetH / virt.h);

    if (this.mode === 'chess' && this.chessShakeTimer > 0) {
      const now = performance.now();
      const decay = Math.min(1, this.chessShakeTimer / 0.18);
      const amp = this.chessShakeAmp * decay;
      ctx.translate(Math.sin(now * 0.095) * amp, Math.cos(now * 0.125) * amp * 0.72);
    }

    if (this.mode === 'chess') {
      this.drawGreatHallChessBackdrop(ctx, virt.w, virt.h);
    } else if (this.mode === 'sudoku') {
      this.drawClassicSudokuBackdrop(ctx, virt.w, virt.h);
    } else if (this.mode === 'caro') {
      this.drawMarauderCaroBackdrop(ctx, virt.w, virt.h);
    } else {
      this.drawUnicornSanctuaryBackdrop(ctx, virt.w, virt.h);
    }

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      this.drawSudokuScene(ctx, this.sudokuEngine);
    } else if (this.mode === 'caro' && this.caroEngine) {
      this.drawCaroScene(ctx, this.caroEngine);
    } else if (this.mode === 'chess' && this.chessEngine) {
      this.drawWizardChessScene(ctx, this.chessEngine);
      this.drawChessSpellBeams(ctx);
    } else if (this.mode === 'blocks' && this.onetEngine) {
      this.drawCreatureOnetScene(ctx, this.onetEngine);
    }

    this.drawParticles(ctx);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER: CLASSIC MAGICAL CREATURES ONET CONNECT ("NỐI HÌNH SINH VẬT HUYỀN BÍ")
  // --------------------------------------------------------------------------

  private drawUnicornSanctuaryBackdrop(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ): void {
    ctx.save();
    const img = this.unicornLakeBgImage;
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
      const scrim = ctx.createLinearGradient(0, 0, 0, h);
      scrim.addColorStop(0, 'rgba(15, 36, 42, 0.52)');
      scrim.addColorStop(0.5, 'rgba(20, 44, 38, 0.42)');
      scrim.addColorStop(1, 'rgba(24, 18, 12, 0.62)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, w, h);
    } else {
      this.drawParlorTabletopBackdrop(ctx, w, h);
    }
    ctx.restore();
  }

  private drawCreatureOnetScene(
    ctx: CanvasRenderingContext2D,
    engine: CreatureOnetEngine
  ): void {
    const m = this.computeOnetBoardMetrics(engine);
    const now = performance.now();

    // 1. Classic Pikachu Dark Recessed Board Tray (makes ivory 3D tiles & crimson lightning pop!)
    ctx.save();
    drawRoundedRect(ctx, m.frameX, m.frameY, m.frameW, m.frameH, 14);
    const trayGrad = ctx.createLinearGradient(0, m.frameY, 0, m.frameY + m.frameH);
    trayGrad.addColorStop(0, 'rgba(17, 25, 22, 0.94)');
    trayGrad.addColorStop(0.5, 'rgba(12, 18, 16, 0.95)');
    trayGrad.addColorStop(1, 'rgba(8, 13, 12, 0.97)');
    ctx.fillStyle = trayGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Subtle inner corridor guide along the 1-cell walkable outer border
    drawRoundedRect(ctx, m.originX - 3, m.originY - 3, m.boardW + 6, m.boardH + 6, 6);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    const activeRev =
      this.inspectingTurningPoint && engine.status === 'won'
        ? engine.getTurningPointReview()
        : null;

    // 2. Classic 9 × 16 Rectangular 3D Tiles (with smooth gravity/shift sliding)
    for (let r = 0; r < engine.rows; r++) {
      for (let c = 0; c < engine.cols; c++) {
        const dr = m.transposed ? c : r;
        const dc = m.transposed ? r : c;
        let cx = m.originX + dc * m.cellW;
        let cy = m.originY + dr * m.cellH;
        const spId = engine.grid[r][c];

        if (!spId) {
          continue;
        }

        const slide = this.onetSlideAnims.get(`${r},${c}`);
        if (slide && slide.age < slide.duration) {
          const p = Math.min(1, Math.max(0, slide.age / slide.duration));
          const ease = 1 - (1 - p) * (1 - p);
          const fromDr = m.transposed ? slide.fromC : slide.fromR;
          const fromDc = m.transposed ? slide.fromR : slide.fromC;
          const fromX = m.originX + fromDc * m.cellW;
          const fromY = m.originY + fromDr * m.cellH;
          cx = fromX + (cx - fromX) * ease;
          cy = fromY + (cy - fromY) * ease;
        }

        const spDef = CreatureOnetEngine.getSpeciesDef(spId);
        const isSel = Boolean(
          engine.selected && engine.selected.r === r && engine.selected.c === c
        );
        const isHinted = Boolean(
          engine.hintPair &&
            ((engine.hintPair[0].r === r && engine.hintPair[0].c === c) ||
              (engine.hintPair[1].r === r && engine.hintPair[1].c === c))
        );
        const isHov = Boolean(
          (this.onetHoverCell && this.onetHoverCell.r === r && this.onetHoverCell.c === c) ||
            (this.onetCursorCell && this.onetCursorCell.r === r && this.onetCursorCell.c === c)
        );
        const isBlocked =
          this.onetBlockedFlash &&
          this.onetBlockedFlash.r === r &&
          this.onetBlockedFlash.c === c;

        this.drawCreatureOnetCard(
          ctx,
          cx,
          cy,
          m.cellW,
          m.cellH,
          spDef,
          isSel,
          isHinted,
          isHov,
          Boolean(isBlocked),
          now
        );
      }
    }

    // Highlight TurningPointReview cells when inspecting Gương Chiếu Hậu Pháp Thuật
    if (activeRev) {
      ctx.save();
      for (const hc of activeRev.highlightCells) {
        const dr = m.transposed ? hc.c : hc.r;
        const dc = m.transposed ? hc.r : hc.c;
        const hx = m.originX + dc * m.cellW;
        const hy = m.originY + dr * m.cellH;
        drawRoundedRect(ctx, hx + 2, hy + 2, m.cellW - 4, m.cellH - 4, 6);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
        ctx.fill();
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = '#fde047';
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Hint Preview Polyline (if player used 🔍 Dò)
    if (engine.hintPath && engine.hintPath.length >= 2) {
      const hPts = engine.hintPath.map((wp) => this.onetPointToPixel(wp, engine, m));
      const pulse = 0.6 + 0.35 * Math.sin(now * 0.009);
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([7, 5]);
      ctx.lineDashOffset = -(now * 0.032);
      ctx.lineWidth = 3.8;
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulse.toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(hPts[0].x, hPts[0].y);
      for (let i = 1; i < hPts.length; i++) {
        ctx.lineTo(hPts[i].x, hPts[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Iconic Classic Pikachu 2003 Crimson-Red Electric Connection Line (<= 3 segments)
    for (const beam of this.onetBeams) {
      if (beam.points.length < 2) continue;
      const t = Math.min(1, beam.age / beam.duration);
      const alpha = Math.max(0, 1 - t * t);
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer crimson-red electric glow
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = '#dc2626';
      ctx.globalAlpha = alpha * 0.92;
      ctx.lineWidth = 8.5 * (1 - t * 0.3);
      ctx.beginPath();
      ctx.moveTo(beam.points[0].x, beam.points[0].y);
      for (let i = 1; i < beam.points.length; i++) {
        ctx.lineTo(beam.points[i].x, beam.points[i].y);
      }
      ctx.stroke();

      // Mid vivid red body
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ef4444';
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 5 * (1 - t * 0.25);
      ctx.stroke();

      // Hot white-rose lightning core
      ctx.strokeStyle = '#fff1f2';
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2.1 * (1 - t * 0.25);
      ctx.stroke();

      // Electric spark nodes at endpoints & 90° turns
      for (const pt of beam.points) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.8 * (1 - t * 0.35), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2 * (1 - t * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawCreatureOnetCard(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellW: number,
    cellH: number,
    spDef: (typeof CREATURE_ONET_SPECIES)[number],
    isSelected: boolean,
    isHinted: boolean,
    isHovered: boolean,
    isBlockedFlash: boolean,
    nowMs: number
  ): void {
    // Classic Pikachu 2003 tightly-packed 3D bevelled rectangular domino tile
    const seam = 0.75;
    let bx = x + seam;
    const by = y + seam;
    const bw = cellW - seam * 2;
    const bh = cellH - seam * 2;
    const rad = 3.5;
    const lipDepth = 3.2;

    if (isBlockedFlash) {
      bx += Math.sin(nowMs * 0.065) * 2.5;
    }

    ctx.save();

    // 1. Extruded 3D bottom-right block shadow lip (classic Pikachu 3D button feel)
    drawRoundedRect(ctx, bx, by, bw, bh, rad);
    ctx.fillStyle = isBlockedFlash
      ? '#991b1b'
      : isSelected
        ? '#15803d'
        : isHinted
          ? '#b45309'
          : '#988158';
    ctx.fill();

    // 2. Top-left raised ivory-cream tile face
    const faceW = bw - 1.8;
    const faceH = bh - lipDepth;
    drawRoundedRect(ctx, bx + 0.4, by + 0.4, faceW, faceH, Math.max(2, rad - 0.5));
    const faceGrad = ctx.createLinearGradient(bx, by, bx, by + faceH);
    if (isBlockedFlash) {
      faceGrad.addColorStop(0, '#fee2e2');
      faceGrad.addColorStop(1, '#fecaca');
    } else if (isSelected) {
      // Classic Pikachu emerald-lime active tile highlight
      faceGrad.addColorStop(0, '#dcfce7');
      faceGrad.addColorStop(1, '#86efac');
    } else if (isHinted) {
      const p = 0.5 + 0.5 * Math.sin(nowMs * 0.01);
      faceGrad.addColorStop(0, '#fefce8');
      faceGrad.addColorStop(1, p > 0.5 ? '#fde047' : '#fef08a');
    } else if (isHovered) {
      faceGrad.addColorStop(0, '#ffffff');
      faceGrad.addColorStop(1, '#f7eed8');
    } else {
      faceGrad.addColorStop(0, spDef.bgTop);
      faceGrad.addColorStop(1, spDef.bgBot);
    }
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // 3. Crisp top & left white 3D bevel highlight
    ctx.beginPath();
    ctx.moveTo(bx + 1.5, by + faceH - 1.5);
    ctx.lineTo(bx + 1.5, by + 1.5);
    ctx.lineTo(bx + faceW - 1.5, by + 1.5);
    ctx.strokeStyle = isSelected ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // 4. Crisp outer tile seam border
    drawRoundedRect(ctx, bx, by, bw, bh, rad);
    ctx.lineWidth = isSelected || isHinted ? 2.1 : isHovered ? 1.5 : 1;
    ctx.strokeStyle = isBlockedFlash
      ? '#dc2626'
      : isSelected
        ? '#16a34a'
        : isHinted
          ? '#dc2626'
          : isHovered
            ? '#d97706'
            : '#4a3723';
    ctx.stroke();

    // 5. Crisp Hang Sóc Creature / Magical Item Sprite centered cleanly on the ivory tile
    const spr = this.getSpriteImage(spDef.spriteKey);
    if (spr) {
      const maxW = (faceW - 2) * 0.92;
      const maxH = (faceH - 2) * 0.92;
      const aspect = spr.naturalWidth / Math.max(1, spr.naturalHeight);
      let dw = maxW;
      let dh = dw / Math.max(0.2, aspect);
      if (dh > maxH) {
        dh = maxH;
        dw = dh * aspect;
      }
      ctx.drawImage(
        spr,
        bx + 0.4 + (faceW - dw) * 0.5,
        by + 0.4 + (faceH - dh) * 0.5,
        dw,
        dh
      );
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 3: 3D LAYERED TILE MATCH / WIZARDING MAHJONG ZEN
  // --------------------------------------------------------------------------

  private drawTileMatchScene(ctx: CanvasRenderingContext2D, engine: TileMatchZenEngine): void {
    // Subtle golden astrolabe rings on the warm oak table
    ctx.save();
    ctx.strokeStyle = 'rgba(92, 45, 18, 0.2)';
    ctx.lineWidth = 1.6;
    for (const rad of [95, 145, 195]) {
      ctx.beginPath();
      ctx.arc(PA_VIRTUAL_W * 0.5, 172, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 1. Draw Pyramid Board Tiles bottom-to-top
    const boardTiles = engine.tiles
      .filter((t) => t.state === 'board')
      .sort((a, b) => {
        if (a.layer !== b.layer) return a.layer - b.layer;
        if (a.gy !== b.gy) return a.gy - b.gy;
        return a.gx - b.gx;
      });

    for (const tile of boardTiles) {
      const isFree = engine.isTileFree(tile);
      const isHover = isFree && tile.uid === this.hoveredTileUid;
      const pos = this.getTileScreenCenter(tile);
      this.drawMahjongTileCard(
        ctx,
        pos.x,
        pos.y - (isHover ? 4 : 0),
        TILE_CARD_W,
        TILE_CARD_H,
        tile.symbolId,
        isFree,
        isHover
      );
    }

    // 2. Draw 7-Slot Mahjong Collector Rail at bottom
    const danger = engine.tray.length >= TILE_TRAY_CAPACITY - 1;
    ctx.save();
    drawRoundedRect(ctx, TILE_TRAY_X, TILE_TRAY_Y, TILE_TRAY_W, TILE_TRAY_H, 16);
    const railGrad = ctx.createLinearGradient(0, TILE_TRAY_Y, 0, TILE_TRAY_Y + TILE_TRAY_H);
    railGrad.addColorStop(0, '#78350f');
    railGrad.addColorStop(0.5, '#451a03');
    railGrad.addColorStop(1, '#290f02');
    ctx.fillStyle = railGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = danger ? '#f87171' : '#f59e0b';
    ctx.stroke();
    ctx.restore();

    // Draw 7 recessed slots + tray cards
    for (let i = 0; i < TILE_TRAY_CAPACITY; i++) {
      const sx = TILE_TRAY_X + 12 + (i + 0.5) * TILE_TRAY_SLOT_W;
      const sy = TILE_TRAY_Y + TILE_TRAY_H * 0.5;
      drawRoundedRect(ctx, sx - 27, sy - 31, 54, 62, 9);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.52)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 230, 138, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const trayCard = engine.tray[i];
      if (trayCard) {
        this.drawMahjongTileCard(ctx, sx, sy, 54, 62, trayCard.symbolId, true, false);
      }
    }

    // Slot count pill
    ctx.save();
    drawRoundedRect(ctx, TILE_TRAY_X + TILE_TRAY_W - 96, TILE_TRAY_Y - 21, 90, 18, 9);
    ctx.fillStyle = 'rgba(56, 27, 12, 0.85)';
    ctx.fill();
    ctx.fillStyle = danger ? '#fca5a5' : '#fde68a';
    ctx.font = '800 11px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `Khay ${engine.tray.length}/${TILE_TRAY_CAPACITY}`,
      TILE_TRAY_X + TILE_TRAY_W - 51,
      TILE_TRAY_Y - 11.5
    );
    ctx.restore();

    // 3. Flying Tile Animations
    for (const f of this.flyingTiles) {
      const t = Math.min(1, f.age / f.duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const fx = f.fromX + (f.toX - f.fromX) * ease;
      const fy = f.fromY + (f.toY - f.fromY) * ease - Math.sin(t * Math.PI) * 28;
      this.drawMahjongTileCard(ctx, fx, fy, 56, 65, f.symbolId, true, true);
    }
  }

  private drawMahjongTileCard(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    symbolId: string,
    isFree: boolean,
    isHighlighted: boolean
  ): void {
    const x = cx - w * 0.5;
    const y = cy - h * 0.5;
    const depth = 6;
    const sym = TILE_MATCH_SYMBOLS.find((s) => s.id === symbolId) ?? TILE_MATCH_SYMBOLS[0];

    ctx.save();
    // Drop shadow
    drawRoundedRect(ctx, x + 2, y + depth + 2, w, h - 2, 10);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.46)';
    ctx.fill();

    // 3D Ivory/Gold Mahjong base lip
    drawRoundedRect(ctx, x, y + depth, w, h - depth, 10);
    ctx.fillStyle = isFree ? '#d97706' : '#475569';
    ctx.fill();

    // Top Porcelain Card Face
    drawRoundedRect(ctx, x, y, w, h - depth, 10);
    const faceGrad = ctx.createLinearGradient(x, y, x, y + h - depth);
    faceGrad.addColorStop(0, '#fffdf7');
    faceGrad.addColorStop(0.75, '#fef3c7');
    faceGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = faceGrad;
    ctx.fill();

    ctx.lineWidth = isHighlighted ? 2.6 : 1.6;
    ctx.strokeStyle = isHighlighted ? '#facc15' : '#b45309';
    ctx.stroke();

    // Subtle colored halo behind icon
    ctx.beginPath();
    ctx.arc(cx, cy - depth * 0.5, w * 0.31, 0, Math.PI * 2);
    ctx.fillStyle = `${sym.accent}22`;
    ctx.fill();

    // Crisp 3D Sprite Icon
    const spr = this.getSpriteImage(sym.spriteKey);
    const iconSz = Math.min(w, h - depth) * 0.68;
    if (spr) {
      ctx.drawImage(spr, cx - iconSz * 0.5, cy - depth * 0.5 - iconSz * 0.5, iconSz, iconSz);
    } else {
      ctx.fillStyle = sym.accent;
      ctx.beginPath();
      ctx.arc(cx, cy - depth * 0.5, iconSz * 0.36, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dark twilight veil when occluded by upper tiles!
    if (!isFree) {
      drawRoundedRect(ctx, x, y, w, h, 10);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.58)';
      ctx.fill();
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 4: SUDOKU CỔ NGỮ 9x9 (PARCHMENT GRID + RUNE NUMBER PAD)
  // --------------------------------------------------------------------------

  private drawWrappedCanvasText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines = 4
  ): number {
    const words = text.split(/\s+/);
    let line = '';
    let lineIdx = 0;
    for (let i = 0; i < words.length; i++) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, y + lineIdx * lineHeight);
        line = words[i];
        lineIdx++;
        if (lineIdx >= maxLines - 1) {
          const rest = [line, ...words.slice(i + 1)].join(' ');
          ctx.fillText(rest, x, y + lineIdx * lineHeight);
          return y + (lineIdx + 1) * lineHeight;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, y + lineIdx * lineHeight);
      lineIdx++;
    }
    return y + lineIdx * lineHeight;
  }

  // --------------------------------------------------------------------------
  // SHARED CANON HANG SÓC × HOGWARTS TABLETOP & PARCHMENT CRAFTSMANSHIP
  // --------------------------------------------------------------------------

  private drawParlorTabletopBackdrop(
    ctx: CanvasRenderingContext2D,
    virtW = PA_VIRTUAL_W,
    virtH = PA_VIRTUAL_H
  ): void {
    ctx.save();
    const bgImg = this.parlorBgImage;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      // Crop gently toward the sunlit honey-oak parlor tabletop & hearth glow
      const sw = bgImg.naturalWidth;
      const sh = bgImg.naturalHeight;
      ctx.drawImage(
        bgImg,
        sw * 0.08,
        sh * 0.24,
        sw * 0.84,
        sh * 0.72,
        0,
        0,
        virtW,
        virtH
      );
      // Warm sunlit honey-oak glaze so boards & cream parchment cards pop cleanly
      const glaze = ctx.createLinearGradient(0, 0, 0, virtH);
      glaze.addColorStop(0, 'rgba(92, 46, 18, 0.24)');
      glaze.addColorStop(0.5, 'rgba(72, 34, 12, 0.16)');
      glaze.addColorStop(1, 'rgba(54, 25, 9, 0.34)');
      ctx.fillStyle = glaze;
      ctx.fillRect(0, 0, virtW, virtH);
    } else {
      const woodBg = ctx.createLinearGradient(0, 0, 0, virtH);
      woodBg.addColorStop(0, '#c88344');
      woodBg.addColorStop(0.5, '#a86432');
      woodBg.addColorStop(1, '#7c431d');
      ctx.fillStyle = woodBg;
      ctx.fillRect(0, 0, virtW, virtH);
    }

    // Subtle inlaid brass tabletop border & corner studs
    drawRoundedRect(ctx, 6, 6, virtW - 12, virtH - 12, 14);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.32)';
    ctx.stroke();
    ctx.restore();
  }

  private drawFourPointStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outerR: number,
    innerR: number
  ): void {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const ang = (Math.PI / 4) * i - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const px = cx + Math.cos(ang) * r;
      const py = cy + Math.sin(ang) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  private drawBrassCornerBrackets(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    arm = 16
  ): void {
    ctx.save();
    const corners: ReadonlyArray<[number, number, number, number]> = [
      [x, y, 1, 1],
      [x + w, y, -1, 1],
      [x, y + h, 1, -1],
      [x + w, y + h, -1, -1],
    ];
    for (const [cx, cy, sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * 2, cy + sy * arm);
      ctx.lineTo(cx + sx * 2, cy + sy * 2);
      ctx.lineTo(cx + sx * arm, cy + sy * 2);
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#f4c668';
      ctx.stroke();

      // Tiny brass rivet
      ctx.beginPath();
      ctx.arc(cx + sx * 6.5, cy + sy * 6.5, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fffbeb';
      ctx.fill();
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = '#78350f';
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawCharacterPortraitMedallion(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    portraitKey: WizardingPortraitKey,
    fallbackEmoji: string
  ): void {
    const cfg = PORTRAIT_SPRITE_CROPS[portraitKey] ?? PORTRAIT_SPRITE_CROPS.ron;
    const chessImg = cfg.chessPieceKey ? this.chessPieceImages.get(cfg.chessPieceKey) : null;
    const spr =
      chessImg && chessImg.complete && chessImg.naturalWidth > 0
        ? chessImg
        : cfg.spriteKey
          ? this.getSpriteImage(cfg.spriteKey)
          : null;
    const isDarkArts = Boolean(cfg.chessPieceKey);

    ctx.save();
    // Outer drop shadow & gilded/silver portrait ring
    ctx.beginPath();
    ctx.arc(cx, cy + 2.5, radius + 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 10, 6, 0.44)';
    ctx.fill();

    const ringGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    if (isDarkArts) {
      ringGrad.addColorStop(0, '#ecfdf5');
      ringGrad.addColorStop(0.45, '#34d399');
      ringGrad.addColorStop(1, '#065f46');
    } else {
      ringGrad.addColorStop(0, '#fff3b0');
      ringGrad.addColorStop(0.45, '#e09f3e');
      ringGrad.addColorStop(1, '#8c5319');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 3.5, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = isDarkArts ? '#022c22' : '#4a240d';
    ctx.stroke();

    // Inner portrait canvas clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const pBg = ctx.createRadialGradient(cx, cy - radius * 0.25, 2, cx, cy, radius);
    pBg.addColorStop(0, cfg.bgTop);
    pBg.addColorStop(1, cfg.bgBot);
    ctx.fillStyle = pBg;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    if (spr) {
      const sx = spr.naturalWidth * cfg.sx;
      const sy = spr.naturalHeight * cfg.sy;
      const sw = spr.naturalWidth * cfg.sw;
      const sh = spr.naturalHeight * cfg.sh;
      const drawSz = radius * 2.08;
      ctx.drawImage(spr, sx, sy, sw, sh, cx - drawSz * 0.5, cy - drawSz * 0.48, drawSz, drawSz);
    } else {
      ctx.font = `${Math.round(radius * 1.1)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fallbackEmoji, cx, cy + 1);
    }
    ctx.restore();

    // Inner specular highlight ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = isDarkArts ? 'rgba(209, 250, 229, 0.8)' : 'rgba(255, 251, 235, 0.78)';
    ctx.stroke();
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 4: SỐ HỌC HUYỀN BÍ (CLASSIC SUDOKU 9×9 — HANG SÓC WOOD, PARCHMENT & BRASS)
  // --------------------------------------------------------------------------

  private drawClassicSudokuBackdrop(
    ctx: CanvasRenderingContext2D,
    virtW = SUDOKU_DESKTOP_W,
    virtH = SUDOKU_DESKTOP_H
  ): void {
    // Clear to transparent so the full-bleed sunlit Hang Sóc room (burrow_parlor_bg.jpg) shines seamlessly behind the carved walnut & brass board and numpad dock
    ctx.clearRect(0, 0, virtW, virtH);
  }

  private drawSudokuScene(ctx: CanvasRenderingContext2D, engine: SudokuPuzzleEngine): void {
    const isPortraitSudoku = this.isMobileBoardLayout();
    const sel = engine.selected;
    const selVal = sel ? engine.grid[sel.r]?.[sel.c] ?? 0 : 0;
    const activeDigit =
      this.sudokuHoverPadDigit ?? (selVal > 0 ? selVal : engine.highlightDigit > 0 ? engine.highlightDigit : 0);

    // 1. Carved Hang Sóc Mahogany-Oak Frame & Antique Brass Bezel around the 9×9 Board
    const framePad = 5.5;
    const fx = SUDOKU_BOARD_X - framePad;
    const fy = SUDOKU_BOARD_Y - framePad;
    const fw = SUDOKU_BOARD_PX + framePad * 2;
    const fh = SUDOKU_BOARD_PX + framePad * 2;

    ctx.save();
    // 3D bottom lip & tabletop shadow
    drawRoundedRect(ctx, fx, fy + 2.5, fw, fh, 11);
    ctx.fillStyle = 'rgba(24, 10, 4, 0.55)';
    ctx.shadowColor = 'rgba(20, 8, 3, 0.42)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Carved dark walnut-oak frame body
    drawRoundedRect(ctx, fx, fy, fw, fh, 11);
    const frameGrad = ctx.createLinearGradient(0, fy, 0, fy + fh);
    frameGrad.addColorStop(0, '#63371a');
    frameGrad.addColorStop(0.48, '#45230e');
    frameGrad.addColorStop(1, '#2b1407');
    ctx.fillStyle = frameGrad;
    ctx.fill();

    // Antique brass outer rim
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e5a93c';
    ctx.stroke();

    // Inner specular highlight rim
    drawRoundedRect(ctx, fx + 1.8, fy + 1.8, fw - 3.6, fh - 3.6, 9.5);
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
    ctx.stroke();

    // Parchment backing inside frame
    ctx.fillStyle = '#fffdf6';
    ctx.fillRect(SUDOKU_BOARD_X, SUDOKU_BOARD_Y, SUDOKU_BOARD_PX, SUDOKU_BOARD_PX);
    ctx.restore();

    // 2. Classic 9×9 Parchment Cells (Alternating 3×3 Warm Vellum + 4-State Golden-Amber Highlighting)
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cx = SUDOKU_BOARD_X + c * SUDOKU_CELL_PX;
        const cy = SUDOKU_BOARD_Y + r * SUDOKU_CELL_PX;
        const val = engine.grid[r][c];
        const isEvenBox = (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0;
        const isSel = Boolean(sel && sel.r === r && sel.c === c);
        const isHover = Boolean(
          this.sudokuHoverCell && this.sudokuHoverCell.r === r && this.sudokuHoverCell.c === c
        );
        const isPeer = Boolean(
          sel &&
            !isSel &&
            (sel.r === r ||
              sel.c === c ||
              (Math.floor(sel.r / 3) === Math.floor(r / 3) &&
                Math.floor(sel.c / 3) === Math.floor(c / 3)))
        );
        const isSameVal = activeDigit > 0 && val === activeDigit && !isSel;
        const isWrong = engine.isWrongCell(r, c);
        const conflict = engine.hasConflict(r, c);

        if (isSel && conflict) {
          ctx.fillStyle = '#fca5a5';
        } else if (conflict) {
          ctx.fillStyle = '#fde2dc';
        } else if (isSel) {
          const selGrad = ctx.createLinearGradient(0, cy, 0, cy + SUDOKU_CELL_PX);
          selGrad.addColorStop(0, '#fef08a');
          selGrad.addColorStop(1, '#f7c948');
          ctx.fillStyle = selGrad;
        } else if (isSameVal) {
          ctx.fillStyle = '#fbd374';
        } else if (isHover) {
          ctx.fillStyle = '#f9e0a2';
        } else if (isPeer) {
          ctx.fillStyle = isEvenBox ? '#f2e2be' : '#ebd8b0';
        } else {
          ctx.fillStyle = isEvenBox ? '#fffdf6' : '#f7edd6';
        }
        ctx.fillRect(cx, cy, SUDOKU_CELL_PX, SUDOKU_CELL_PX);

        // Subtle tactile ivory top-edge sheen on each parchment tile
        ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.fillRect(cx, cy, SUDOKU_CELL_PX, 1.2);

        if (isSameVal && !conflict) {
          ctx.save();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = 'rgba(180, 83, 9, 0.55)';
          ctx.strokeRect(cx + 1.5, cy + 1.5, SUDOKU_CELL_PX - 3, SUDOKU_CELL_PX - 3);
          ctx.restore();
        }

        if (val >= 1 && val <= 9) {
          const midCellX = cx + SUDOKU_CELL_PX * 0.5;
          const midCellY = cy + SUDOKU_CELL_PX * 0.5 + 1;
          const isInitialClue = Boolean(engine.initialGiven[r]?.[c]);
          ctx.save();
          ctx.font = isInitialClue
            ? '800 30.5px "Be Vietnam Pro", system-ui, -apple-system, sans-serif'
            : '700 30.5px "Be Vietnam Pro", system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Subtle letterpress highlight so numbers sit naturally in the parchment
          ctx.fillStyle = 'rgba(255, 253, 244, 0.72)';
          ctx.fillText(String(val), midCellX, midCellY + 1);

          if (isWrong) {
            ctx.fillStyle = '#b91c1c';
          } else if (isInitialClue) {
            ctx.fillStyle = conflict ? '#991b1b' : '#2b1407';
          } else {
            ctx.fillStyle = conflict ? '#b91c1c' : '#0f5257';
          }
          ctx.fillText(String(val), midCellX, midCellY);
          ctx.restore();
        } else {
          const mask = engine.notes[r][c];
          if (mask !== 0) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const subPx = SUDOKU_CELL_PX / 3;
            for (let d = 1; d <= 9; d++) {
              if ((mask & (1 << d)) === 0) continue;
              const nr = Math.floor((d - 1) / 3);
              const nc = (d - 1) % 3;
              const nx = cx + (nc + 0.5) * subPx;
              const ny = cy + (nr + 0.5) * subPx + 0.5;
              const isMatchNote = activeDigit === d;
              if (isMatchNote) {
                drawRoundedRect(ctx, nx - 7.5, ny - 7.5, 15, 15, 4);
                ctx.fillStyle = '#fde047';
                ctx.fill();
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = '#b45309';
                ctx.stroke();
                ctx.font = '800 12px "Be Vietnam Pro", system-ui, sans-serif';
                ctx.fillStyle = '#7c2d12';
              } else {
                ctx.font = '700 11.5px "Be Vietnam Pro", system-ui, sans-serif';
                ctx.fillStyle = '#6b4423';
              }
              ctx.fillText(String(d), nx, ny);
            }
            ctx.restore();
          }
        }
      }
    }

    // 3. Warm Parchment Cell Gridlines, Carved Walnut 3×3 Box Borders & Brass Corner Brackets
    ctx.save();
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = '#cfb486';
    for (let i = 1; i < 9; i++) {
      if (i % 3 === 0) continue;
      const x = SUDOKU_BOARD_X + i * SUDOKU_CELL_PX;
      const y = SUDOKU_BOARD_Y + i * SUDOKU_CELL_PX;
      ctx.beginPath();
      ctx.moveTo(x, SUDOKU_BOARD_Y);
      ctx.lineTo(x, SUDOKU_BOARD_Y + SUDOKU_BOARD_PX);
      ctx.moveTo(SUDOKU_BOARD_X, y);
      ctx.lineTo(SUDOKU_BOARD_X + SUDOKU_BOARD_PX, y);
      ctx.stroke();
    }

    // Bold 3×3 box dividers in deep carved mahogany-walnut
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#43200d';
    for (const i of [3, 6]) {
      const x = SUDOKU_BOARD_X + i * SUDOKU_CELL_PX;
      const y = SUDOKU_BOARD_Y + i * SUDOKU_CELL_PX;
      ctx.beginPath();
      ctx.moveTo(x, SUDOKU_BOARD_Y);
      ctx.lineTo(x, SUDOKU_BOARD_Y + SUDOKU_BOARD_PX);
      ctx.moveTo(SUDOKU_BOARD_X, y);
      ctx.lineTo(SUDOKU_BOARD_X + SUDOKU_BOARD_PX, y);
      ctx.stroke();
    }

    if (sel) {
      const sx = SUDOKU_BOARD_X + sel.c * SUDOKU_CELL_PX;
      const sy = SUDOKU_BOARD_Y + sel.r * SUDOKU_CELL_PX;
      const selConflict = engine.hasConflict(sel.r, sel.c);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = selConflict ? '#b91c1c' : '#9a3412';
      ctx.strokeRect(sx + 1.25, sy + 1.25, SUDOKU_CELL_PX - 2.5, SUDOKU_CELL_PX - 2.5);
      ctx.lineWidth = 1;
      ctx.strokeStyle = selConflict ? '#fecaca' : 'rgba(255, 251, 235, 0.85)';
      ctx.strokeRect(sx + 3, sy + 3, SUDOKU_CELL_PX - 6, SUDOKU_CELL_PX - 6);
    }

    // Inner recessed wood-brass border around 9×9 field
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#3b1c0a';
    ctx.strokeRect(SUDOKU_BOARD_X, SUDOKU_BOARD_Y, SUDOKU_BOARD_PX, SUDOKU_BOARD_PX);
    ctx.restore();

    // Heirloom brass corner brackets on the outer wooden frame
    this.drawBrassCornerBrackets(ctx, fx + 1, fy + 1, fw - 2, fh - 2, 14);

    const rem = engine.getRemainingDigitCounts();

    // 4a. Portrait / Mobile: Hang Sóc Wood & Brass Single-Row 1–9 Bar below 9×9 Grid
    if (isPortraitSudoku) {
      this.sudokuPadRects.clear();
      this.sudokuActionRects.clear();

      const trayX = fx;
      const trayY = 501;
      const trayW = fw;
      const trayH = 64;

      ctx.save();
      drawRoundedRect(ctx, trayX, trayY, trayW, trayH, 11);
      const trayGrad = ctx.createLinearGradient(0, trayY, 0, trayY + trayH);
      trayGrad.addColorStop(0, '#542d14');
      trayGrad.addColorStop(1, '#2d1507');
      ctx.fillStyle = trayGrad;
      ctx.shadowColor = 'rgba(20, 8, 3, 0.38)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#e5a93c';
      ctx.stroke();

      const barX = SUDOKU_BOARD_X;
      const barY = 505;
      const barW = SUDOKU_BOARD_PX;
      const gap = 4;
      const btnW = (barW - gap * 8) / 9;
      const btnH = 54;

      for (let d = 1; d <= 9; d++) {
        const bx = barX + (d - 1) * (btnW + gap);
        const by = barY;
        this.sudokuPadRects.set(d, { x: bx, y: by, w: btnW, h: btnH });

        const done = rem[d] === 0;
        const isKeyActive = activeDigit === d && !done;
        const isKeyHover = this.sudokuHoverPadDigit === d && !done;

        if (!done) {
          // Tactile 3D dark-walnut bottom lip
          drawRoundedRect(ctx, bx, by + 2.5, btnW, btnH, 8.5);
          ctx.fillStyle = '#1e0d04';
          ctx.fill();
        }

        drawRoundedRect(ctx, bx, by, btnW, btnH, 8.5);
        if (done) {
          ctx.fillStyle = 'rgba(28, 13, 5, 0.55)';
        } else if (isKeyActive) {
          const actGrad = ctx.createLinearGradient(0, by, 0, by + btnH);
          actGrad.addColorStop(0, '#fff3b0');
          actGrad.addColorStop(0.55, '#fbbf24');
          actGrad.addColorStop(1, '#d97706');
          ctx.fillStyle = actGrad;
        } else if (isKeyHover) {
          const hovGrad = ctx.createLinearGradient(0, by, 0, by + btnH);
          hovGrad.addColorStop(0, '#fffef7');
          hovGrad.addColorStop(1, '#fde68a');
          ctx.fillStyle = hovGrad;
        } else {
          const keyGrad = ctx.createLinearGradient(0, by, 0, by + btnH);
          keyGrad.addColorStop(0, '#fffef8');
          keyGrad.addColorStop(0.58, '#f8e9ca');
          keyGrad.addColorStop(1, '#ebd3a4');
          ctx.fillStyle = keyGrad;
        }
        ctx.fill();

        ctx.lineWidth = isKeyActive ? 2 : 1.3;
        ctx.strokeStyle = done
          ? 'rgba(229, 169, 60, 0.25)'
          : isKeyActive
            ? '#fffbeb'
            : '#b87d32';
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 25px "Be Vietnam Pro", system-ui, -apple-system, sans-serif';
        ctx.fillStyle = done
          ? 'rgba(253, 230, 138, 0.35)'
          : isKeyActive
            ? '#3b1806'
            : engine.pencilMode
              ? '#6b4423'
              : '#2b1407';
        ctx.fillText(String(d), bx + btnW * 0.5, by + 20.5);

        // Dark wood count pill at bottom of key
        drawRoundedRect(ctx, bx + 5, by + 35.5, btnW - 10, 14.5, 5);
        ctx.fillStyle = done
          ? 'transparent'
          : isKeyActive
            ? 'rgba(59, 24, 6, 0.82)'
            : 'rgba(67, 32, 13, 0.82)';
        ctx.fill();

        ctx.font = '800 10px "Be Vietnam Pro", system-ui, sans-serif';
        ctx.fillStyle = done ? '#eab308' : '#fde68a';
        ctx.fillText(done ? '✓' : String(rem[d]), bx + btnW * 0.5, by + 43.2);
      }
      ctx.restore();
      return;
    }

    // 4b. Desktop / Landscape: Hang Sóc Carved Wood & Brass Control + 3×3 Numpad Dock on Right
    this.sudokuPadRects.clear();
    this.sudokuActionRects.clear();

    ctx.save();
    // 3D bottom lip & shadow under right dock
    drawRoundedRect(ctx, SUDOKU_PAD_X, SUDOKU_PAD_Y + 2.5, SUDOKU_PAD_W, SUDOKU_PAD_H, 12);
    ctx.fillStyle = 'rgba(24, 10, 4, 0.52)';
    ctx.shadowColor = 'rgba(20, 8, 3, 0.38)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Carved mahogany-oak dock panel
    drawRoundedRect(ctx, SUDOKU_PAD_X, SUDOKU_PAD_Y, SUDOKU_PAD_W, SUDOKU_PAD_H, 12);
    const dockGrad = ctx.createLinearGradient(0, SUDOKU_PAD_Y, 0, SUDOKU_PAD_Y + SUDOKU_PAD_H);
    dockGrad.addColorStop(0, '#5a3116');
    dockGrad.addColorStop(0.5, '#3e200d');
    dockGrad.addColorStop(1, '#261206');
    ctx.fillStyle = dockGrad;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e5a93c';
    ctx.stroke();

    drawRoundedRect(ctx, SUDOKU_PAD_X + 2, SUDOKU_PAD_Y + 2, SUDOKU_PAD_W - 4, SUDOKU_PAD_H - 4, 10);
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.28)';
    ctx.stroke();

    const innerX = SUDOKU_PAD_X + 8;
    const innerW = SUDOKU_PAD_W - 16; // 135px
    const actGap = 6;
    const actW = (innerW - actGap) / 2; // 64.5px
    const actH = 47;
    const actStartY = SUDOKU_PAD_Y + 8; // 14

    const sandbox = this.sim.state.sandboxMode;
    const canHint =
      engine.status === 'playing' && (sandbox || engine.freeHintsLeft + engine.paidHintsLeft > 0);
    const hintBadge = sandbox
      ? '∞'
      : engine.freeHintsLeft > 0
        ? String(engine.freeHintsLeft)
        : engine.paidHintsLeft > 0
          ? `${engine.hintGoldCost}G`
          : '0';

    const quickActions: ReadonlyArray<{
      key: SudokuQuickActionKey;
      icon: string;
      label: string;
      active: boolean;
      disabled: boolean;
      isGoldCta?: boolean;
      badge?: string;
      badgeActive?: boolean;
    }> = [
      {
        key: 'undo',
        icon: '↩️',
        label: 'Hoàn tác',
        active: false,
        disabled: !engine.canUndo,
      },
      {
        key: 'erase',
        icon: '🧹',
        label: 'Xoá',
        active: engine.eraseMode,
        disabled: engine.status !== 'playing' && engine.status !== 'lost',
      },
      {
        key: 'notes',
        icon: '✏️',
        label: 'Ghi chú',
        active: engine.pencilMode,
        disabled: engine.status !== 'playing',
        badge: engine.pencilMode ? 'ON' : 'OFF',
        badgeActive: engine.pencilMode,
      },
      {
        key: 'hint',
        icon: '💡',
        label: 'Gợi ý',
        active: false,
        disabled: !canHint,
        isGoldCta: true,
        badge: hintBadge,
        badgeActive: canHint && (sandbox || engine.freeHintsLeft > 0),
      },
    ];

    quickActions.forEach((act, idx) => {
      const ar = Math.floor(idx / 2);
      const ac = idx % 2;
      const ax = innerX + ac * (actW + actGap);
      const ay = actStartY + ar * (actH + actGap);
      this.sudokuActionRects.set(act.key, { x: ax, y: ay, w: actW, h: actH });

      const isHov = this.sudokuHoverAction === act.key && !act.disabled;

      if (!act.disabled) {
        drawRoundedRect(ctx, ax, ay + 2, actW, actH, 9);
        ctx.fillStyle = '#1a0b04';
        ctx.fill();
      }

      drawRoundedRect(ctx, ax, ay, actW, actH, 9);
      if (act.disabled) {
        ctx.fillStyle = 'rgba(32, 15, 6, 0.55)';
      } else if (act.active) {
        const actGrad = ctx.createLinearGradient(0, ay, 0, ay + actH);
        actGrad.addColorStop(0, '#e04f3e');
        actGrad.addColorStop(0.55, '#b91c1c');
        actGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = actGrad;
      } else if (act.isGoldCta) {
        const goldGrad = ctx.createLinearGradient(0, ay, 0, ay + actH);
        goldGrad.addColorStop(0, isHov ? '#fff3b0' : '#ffe484');
        goldGrad.addColorStop(0.55, '#f5b301');
        goldGrad.addColorStop(1, '#c27c08');
        ctx.fillStyle = goldGrad;
      } else if (isHov) {
        const hovGrad = ctx.createLinearGradient(0, ay, 0, ay + actH);
        hovGrad.addColorStop(0, '#fffef7');
        hovGrad.addColorStop(1, '#fde68a');
        ctx.fillStyle = hovGrad;
      } else {
        const btnGrad = ctx.createLinearGradient(0, ay, 0, ay + actH);
        btnGrad.addColorStop(0, '#fffdf5');
        btnGrad.addColorStop(0.58, '#f7e5be');
        btnGrad.addColorStop(1, '#e8cb94');
        ctx.fillStyle = btnGrad;
      }
      ctx.fill();

      ctx.lineWidth = act.active || isHov ? 1.8 : 1.3;
      ctx.strokeStyle = act.disabled
        ? 'rgba(229, 169, 60, 0.22)'
        : act.active
          ? '#fde047'
          : act.isGoldCta
            ? '#fffbeb'
            : '#b87d32';
      ctx.stroke();

      ctx.save();
      ctx.globalAlpha = act.disabled ? 0.42 : 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText(act.icon, ax + actW * 0.5, ay + 15.5);

      ctx.font = '800 9.8px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillStyle = act.disabled
        ? '#d6be96'
        : act.active
          ? '#fffbeb'
          : '#3b1806';
      ctx.fillText(act.label, ax + actW * 0.5, ay + 35, actW - 6);
      ctx.restore();

      if (act.badge) {
        const bw = Math.max(20, act.badge.length * 5.8 + 7);
        const bh = 13.5;
        const bx = ax + actW - bw - 2.5;
        const by = ay + 2.5;
        drawRoundedRect(ctx, bx, by, bw, bh, 6.5);
        ctx.fillStyle = act.disabled
          ? 'rgba(59, 31, 13, 0.6)'
          : act.badgeActive
            ? '#15803d'
            : '#3b1f0d';
        ctx.fill();
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.6)';
        ctx.stroke();
        ctx.font = '800 8px "Be Vietnam Pro", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = act.disabled ? '#a89070' : '#fef3c7';
        ctx.fillText(act.badge, bx + bw * 0.5, by + bh * 0.54);
      }
    });

    // Ornamental brass divider with 4-point Hogwarts star between Quick Actions and 3×3 Numpad
    const divY = actStartY + actH * 2 + actGap + 8.5;
    const midDockX = innerX + innerW * 0.5;
    ctx.beginPath();
    ctx.moveTo(innerX + 2, divY);
    ctx.lineTo(midDockX - 10, divY);
    ctx.moveTo(midDockX + 10, divY);
    ctx.lineTo(innerX + innerW - 2, divY);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(244, 198, 104, 0.55)';
    ctx.stroke();
    this.drawFourPointStar(ctx, midDockX, divY, 5, 1.8);
    ctx.fillStyle = '#f4c668';
    ctx.fill();

    // 3×3 Tactile Hang Sóc Ivory-Wood Number Pad (1..9)
    const numGapX = 5;
    const numGapY = 6;
    const btnW = (innerW - numGapX * 2) / 3; // ~41.6px
    const btnH = 112;
    const startY = divY + 8.5;

    for (let d = 1; d <= 9; d++) {
      const pr = Math.floor((d - 1) / 3);
      const pc = (d - 1) % 3;
      const bx = innerX + pc * (btnW + numGapX);
      const by = startY + pr * (btnH + numGapY);
      this.sudokuPadRects.set(d, { x: bx, y: by, w: btnW, h: btnH });

      const done = rem[d] === 0;
      const isKeyActive = activeDigit === d && !done;
      const isKeyHover = this.sudokuHoverPadDigit === d && !done;

      if (!done) {
        // Extruded 3D dark-walnut lip
        drawRoundedRect(ctx, bx, by + 3, btnW, btnH, 10);
        ctx.fillStyle = '#1a0b04';
        ctx.fill();
      }

      drawRoundedRect(ctx, bx, by, btnW, btnH, 10);
      if (done) {
        ctx.fillStyle = 'rgba(26, 11, 4, 0.52)';
      } else if (isKeyActive) {
        const actGrad = ctx.createLinearGradient(0, by, 0, by + btnH);
        actGrad.addColorStop(0, '#fff3b0');
        actGrad.addColorStop(0.55, '#fbbf24');
        actGrad.addColorStop(1, '#d97706');
        ctx.fillStyle = actGrad;
      } else if (isKeyHover) {
        const hovGrad = ctx.createLinearGradient(0, by, 0, by + btnH);
        hovGrad.addColorStop(0, '#fffef8');
        hovGrad.addColorStop(1, '#fde68a');
        ctx.fillStyle = hovGrad;
      } else {
        const keyGrad = ctx.createLinearGradient(0, by, 0, by + btnH);
        keyGrad.addColorStop(0, '#fffef8');
        keyGrad.addColorStop(0.58, '#f8e9ca');
        keyGrad.addColorStop(1, '#ebd3a4');
        ctx.fillStyle = keyGrad;
      }
      ctx.fill();

      // Top ivory specular gloss
      if (!done) {
        drawRoundedRect(ctx, bx + 2, by + 1.5, btnW - 4, 14, 7);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }

      ctx.lineWidth = isKeyActive ? 2.1 : 1.4;
      ctx.strokeStyle = done
        ? 'rgba(229, 169, 60, 0.24)'
        : isKeyActive
          ? '#fffbeb'
          : engine.pencilMode
            ? '#d97706'
            : '#b87d32';
      if (engine.pencilMode && !done && !isKeyActive) {
        ctx.setLineDash([3.5, 2.5]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 33px "Be Vietnam Pro", system-ui, -apple-system, sans-serif';
      ctx.fillStyle = done
        ? 'rgba(253, 230, 138, 0.3)'
        : isKeyActive
          ? '#3b1806'
          : engine.pencilMode
            ? '#6b4423'
            : '#2b1407';
      ctx.fillText(String(d), bx + btnW * 0.5, by + 43);

      // Recessed dark-wood count pill at bottom of key (matches 1/777 Hang Sóc pills)
      drawRoundedRect(ctx, bx + 5, by + 76, btnW - 10, 22, 7);
      ctx.fillStyle = done
        ? 'transparent'
        : isKeyActive
          ? 'rgba(59, 24, 6, 0.86)'
          : 'rgba(67, 32, 13, 0.85)';
      ctx.fill();
      if (!done) {
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(244, 198, 104, 0.45)';
        ctx.stroke();
      }

      ctx.font = '800 11.5px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillStyle = done ? '#eab308' : '#fde68a';
      ctx.fillText(done ? '✓' : String(rem[d]), bx + btnW * 0.5, by + 87.5);
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 5: PHÒNG SINH HOẠT CHUNG & BẢN ĐỒ ĐẠO TẶC — CỜ CARO 13x13
  // --------------------------------------------------------------------------

  private drawMarauderCaroBackdrop(
    ctx: CanvasRenderingContext2D,
    virtW = PA_VIRTUAL_W,
    virtH = PA_VIRTUAL_H
  ): void {
    ctx.save();
    const bg = this.marauderCaroBgImage;
    if (bg && bg.complete && bg.naturalWidth > 0) {
      const sw = bg.naturalWidth;
      const sh = bg.naturalHeight;
      ctx.drawImage(
        bg,
        sw * 0.02,
        sh * 0.05,
        sw * 0.96,
        sh * 0.92,
        0,
        0,
        virtW,
        virtH
      );
      const scrim = ctx.createLinearGradient(0, 0, virtW, virtH);
      scrim.addColorStop(0, 'rgba(54, 14, 12, 0.24)');
      scrim.addColorStop(0.5, 'rgba(38, 16, 10, 0.16)');
      scrim.addColorStop(1, 'rgba(28, 12, 8, 0.32)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, virtW, virtH);
    } else {
      const warmGrad = ctx.createLinearGradient(0, 0, virtW, virtH);
      warmGrad.addColorStop(0, '#5c1916');
      warmGrad.addColorStop(0.5, '#451a0e');
      warmGrad.addColorStop(1, '#291008');
      ctx.fillStyle = warmGrad;
      ctx.fillRect(0, 0, virtW, virtH);
    }

    // Animated Gryffindor hearth firelight pulse & rising golden embers on left rim
    const now = performance.now() * 0.001;
    const flicker = 0.85 + 0.15 * Math.sin(now * 5.2);
    const hearth = ctx.createRadialGradient(8, 280, 10, 20, 280, 185);
    hearth.addColorStop(0, `rgba(254, 240, 138, ${(0.28 * flicker).toFixed(3)})`);
    hearth.addColorStop(0.5, `rgba(249, 115, 22, ${(0.14 * flicker).toFixed(3)})`);
    hearth.addColorStop(1, 'rgba(185, 28, 28, 0)');
    ctx.fillStyle = hearth;
    ctx.fillRect(0, 0, 220, virtH);

    for (let i = 0; i < 6; i++) {
      const prog = (now * 0.28 + i * 0.17) % 1;
      const ex = 10 + Math.sin(now * 2.3 + i * 1.4) * 5;
      const ey = 395 - prog * 330;
      const alpha = Math.sin(prog * Math.PI) * 0.75;
      ctx.fillStyle = `rgba(253, 224, 71, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    drawRoundedRect(ctx, 5, 5, virtW - 10, virtH - 10, 14);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.36)';
    ctx.stroke();
    ctx.restore();
  }

  private drawMarauderFootprintStep(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    isRightFoot: boolean,
    alpha: number
  ): void {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.translate(0, isRightFoot ? 2.4 : -2.4);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#4a1d12';
    // Sole
    ctx.beginPath();
    ctx.ellipse(1.6, 0, 2.9, 1.65, 0, 0, Math.PI * 2);
    ctx.fill();
    // Heel
    ctx.beginPath();
    ctx.ellipse(-2.3, 0, 1.5, 1.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawCaroScene(ctx: CanvasRenderingContext2D, engine: CaroGameEngine): void {
    const now = performance.now() * 0.001;

    // 1. Mahogany Gryffindor Table Backing + Unfolded Antique Marauder's Map Parchment!
    ctx.save();
    drawRoundedRect(
      ctx,
      CARO_FRAME_X - 4,
      CARO_FRAME_Y - 4,
      CARO_FRAME_PX + 8,
      CARO_FRAME_PX + 8,
      16
    );
    const rimGrad = ctx.createLinearGradient(
      0,
      CARO_FRAME_Y - 4,
      0,
      CARO_FRAME_Y + CARO_FRAME_PX + 4
    );
    rimGrad.addColorStop(0, '#6b1d1b');
    rimGrad.addColorStop(0.5, '#471512');
    rimGrad.addColorStop(1, '#2b0b09');
    ctx.fillStyle = rimGrad;
    ctx.shadowColor = 'rgba(20, 6, 3, 0.62)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#f4c668';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Unfolded Tri-Panel Marauder's Map Vellum Parchment
    const mapX = CARO_FRAME_X + 4;
    const mapY = CARO_FRAME_Y + 4;
    const mapPx = CARO_FRAME_PX - 8;
    drawRoundedRect(ctx, mapX, mapY, mapPx, mapPx, 11);
    const parchGrad = ctx.createRadialGradient(
      mapX + mapPx * 0.5,
      mapY + mapPx * 0.5,
      24,
      mapX + mapPx * 0.5,
      mapY + mapPx * 0.5,
      mapPx * 0.75
    );
    parchGrad.addColorStop(0, '#fff9e6');
    parchGrad.addColorStop(0.58, '#f5e1b5');
    parchGrad.addColorStop(1, '#dfc086');
    ctx.fillStyle = parchGrad;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#854d27';
    ctx.stroke();

    // Clip inside Marauder's Map parchment for fold creases, Hogwarts castle corridors & animated footprints!
    ctx.save();
    drawRoundedRect(ctx, mapX + 1, mapY + 1, mapPx - 2, mapPx - 2, 10);
    ctx.clip();

    // Authentic tri-fold Marauder's Map paper creases
    for (const fx of [mapX + mapPx * 0.333, mapX + mapPx * 0.666]) {
      ctx.strokeStyle = 'rgba(120, 63, 22, 0.16)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(fx, mapY);
      ctx.lineTo(fx, mapY + mapPx);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 252, 240, 0.42)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx + 1.5, mapY);
      ctx.lineTo(fx + 1.5, mapY + mapPx);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(120, 63, 22, 0.12)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(mapX, mapY + mapPx * 0.5);
    ctx.lineTo(mapX + mapPx, mapY + mapPx * 0.5);
    ctx.stroke();

    // Watermarked Hogwarts Castle Turrets, Secret Passages & Compass Rose in Sepia Marauder Ink
    const centerMapX = CARO_ORIGIN_X + 6 * CARO_STEP_PX;
    const centerMapY = CARO_ORIGIN_Y + 6 * CARO_STEP_PX;
    ctx.strokeStyle = 'rgba(110, 46, 24, 0.11)';
    ctx.lineWidth = 1.2;
    for (const rCompass of [46, 76, 132]) {
      ctx.beginPath();
      ctx.arc(centerMapX, centerMapY, rCompass, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 4 Corner Hogwarts Tower Turrets watermarked on the parchment
    for (const [tx, ty] of [
      [CARO_ORIGIN_X + 1.5 * CARO_STEP_PX, CARO_ORIGIN_Y + 1.5 * CARO_STEP_PX],
      [CARO_ORIGIN_X + 10.5 * CARO_STEP_PX, CARO_ORIGIN_Y + 1.5 * CARO_STEP_PX],
      [CARO_ORIGIN_X + 1.5 * CARO_STEP_PX, CARO_ORIGIN_Y + 10.5 * CARO_STEP_PX],
      [CARO_ORIGIN_X + 10.5 * CARO_STEP_PX, CARO_ORIGIN_Y + 10.5 * CARO_STEP_PX],
    ]) {
      ctx.beginPath();
      ctx.arc(tx, ty, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(tx - 14, ty - 14, 28, 28);
    }

    // Miniature Crimson Marauder Banner at Top Margin of Map
    const mbW = 248;
    const mbX = centerMapX - mbW * 0.5;
    const mbY = mapY + 3.5;
    drawRoundedRect(ctx, mbX, mbY, mbW, 14, 7);
    ctx.fillStyle = 'rgba(153, 27, 27, 0.88)';
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#fffbeb';
    ctx.font = '800 8.5px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🗺️ BẢN ĐỒ ĐẠO TẶC • THÀNH TRÌ HOGWARTS', centerMapX, mbY + 7.5);

    // Animated Disappearing/Appearing Marauder Inked Footprints patrolling the corridors!
    // Bottom secret corridor: Harry Potter walking West -> East
    const p1 = (now * 0.85) % 10;
    for (let s = 0; s < 10; s++) {
      const dist = (p1 - s + 10) % 10;
      const fade = dist < 4.2 ? Math.sin((1 - dist / 4.2) * Math.PI * 0.5) * 0.68 : 0;
      const fx = CARO_ORIGIN_X + 28 + s * 36;
      const fy = CARO_ORIGIN_Y + 12 * CARO_STEP_PX + 12.5;
      this.drawMarauderFootprintStep(ctx, fx, fy, 0, s % 2 === 0, fade);
    }
    const label1X = CARO_ORIGIN_X + 28 + Math.floor(p1) * 36;
    ctx.fillStyle = 'rgba(110, 32, 18, 0.65)';
    ctx.font = 'italic 700 8.5px Georgia, serif';
    ctx.fillText(
      'Harry Potter',
      Math.min(CARO_ORIGIN_X + 398, Math.max(CARO_ORIGIN_X + 36, label1X)),
      CARO_ORIGIN_Y + 12 * CARO_STEP_PX + 5
    );

    // Left secret corridor: Severus Snape patrolling South -> North
    const p2 = (now * 0.72 + 3.5) % 9;
    for (let s = 0; s < 9; s++) {
      const dist = (p2 - s + 9) % 9;
      const fade = dist < 3.8 ? Math.sin((1 - dist / 3.8) * Math.PI * 0.5) * 0.62 : 0;
      const fx = mapX + 10;
      const fy = CARO_ORIGIN_Y + 11 * CARO_STEP_PX - s * 38;
      this.drawMarauderFootprintStep(ctx, fx, fy, -Math.PI * 0.5, s % 2 === 0, fade);
    }

    // Right secret corridor: Sirius Black patrolling North -> South
    const p3 = (now * 0.78 + 6.1) % 9;
    for (let s = 0; s < 9; s++) {
      const dist = (p3 - s + 9) % 9;
      const fade = dist < 3.8 ? Math.sin((1 - dist / 3.8) * Math.PI * 0.5) * 0.62 : 0;
      const fx = mapX + mapPx - 10;
      const fy = CARO_ORIGIN_Y + 1 * CARO_STEP_PX + s * 38;
      this.drawMarauderFootprintStep(ctx, fx, fy, Math.PI * 0.5, s % 2 === 0, fade);
    }

    ctx.restore(); // end parchment clip

    this.drawBrassCornerBrackets(
      ctx,
      CARO_FRAME_X - 2,
      CARO_FRAME_Y - 2,
      CARO_FRAME_PX + 4,
      CARO_FRAME_PX + 4,
      17
    );

    // 2. 13x13 Sepia-Crimson Marauder Ink Intersection Grid
    const endPx = (CARO_BOARD_SIZE - 1) * CARO_STEP_PX;
    ctx.strokeStyle = 'rgba(92, 38, 16, 0.66)';
    ctx.lineWidth = 1.25;
    for (let i = 0; i < CARO_BOARD_SIZE; i++) {
      const gx = CARO_ORIGIN_X + i * CARO_STEP_PX;
      ctx.beginPath();
      ctx.moveTo(gx, CARO_ORIGIN_Y);
      ctx.lineTo(gx, CARO_ORIGIN_Y + endPx);
      ctx.stroke();

      const gy = CARO_ORIGIN_Y + i * CARO_STEP_PX;
      ctx.beginPath();
      ctx.moveTo(CARO_ORIGIN_X, gy);
      ctx.lineTo(CARO_ORIGIN_X + endPx, gy);
      ctx.stroke();
    }
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#6b2714';
    ctx.strokeRect(CARO_ORIGIN_X, CARO_ORIGIN_Y, endPx, endPx);

    // 5 golden inlaid Marauder compass stars at hoshi intersections
    for (const [hr, hc] of [
      [3, 3],
      [3, 9],
      [6, 6],
      [9, 3],
      [9, 9],
    ]) {
      const sx = CARO_ORIGIN_X + hc * CARO_STEP_PX;
      const sy = CARO_ORIGIN_Y + hr * CARO_STEP_PX;
      this.drawFourPointStar(ctx, sx, sy, hr === 6 && hc === 6 ? 7 : 5.2, 2);
      ctx.fillStyle = '#7f1d1d';
      ctx.fill();
      this.drawFourPointStar(ctx, sx, sy, hr === 6 && hc === 6 ? 4.4 : 3.2, 1.2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();
    }

    // 3. Hover preview Phoenix Seal & Marauder Hint Ring
    if (
      this.caroHoverCell &&
      engine.status === 'playing' &&
      this.caroWinRevealTimer <= 0 &&
      engine.grid[this.caroHoverCell.r]?.[this.caroHoverCell.c] === 0
    ) {
      const hx = CARO_ORIGIN_X + this.caroHoverCell.c * CARO_STEP_PX;
      const hy = CARO_ORIGIN_Y + this.caroHoverCell.r * CARO_STEP_PX;
      ctx.save();
      ctx.globalAlpha = 0.52;
      this.drawCaroStone(ctx, hx, hy, 1, false, 1);
      ctx.restore();
    }

    if (engine.hintCell && engine.grid[engine.hintCell.r]?.[engine.hintCell.c] === 0) {
      const hx = CARO_ORIGIN_X + engine.hintCell.c * CARO_STEP_PX;
      const hy = CARO_ORIGIN_Y + engine.hintCell.r * CARO_STEP_PX;
      const pulse = 1 + 0.14 * Math.sin(now * 8);
      ctx.save();
      ctx.beginPath();
      ctx.arc(hx, hy, 17.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.36)';
      ctx.fill();
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = '#b91c1c';
      ctx.stroke();
      this.drawFourPointStar(ctx, hx, hy, 6.2 * pulse, 2 * pulse);
      ctx.fillStyle = '#fffbeb';
      ctx.fill();
      ctx.restore();
    }

    // 4. Placed 2.5D Order of the Phoenix vs Death Eater Dark Mark Medallions
    const last = engine.lastMove;
    for (let r = 0; r < CARO_BOARD_SIZE; r++) {
      for (let c = 0; c < CARO_BOARD_SIZE; c++) {
        const st = engine.grid[r][c];
        if (st === 0) continue;
        const ix = CARO_ORIGIN_X + c * CARO_STEP_PX;
        const iy = CARO_ORIGIN_Y + r * CARO_STEP_PX;
        const isLast = Boolean(last && last.r === r && last.c === c);
        let popScale = 1;
        if (
          this.caroLastMoveAnim &&
          this.caroLastMoveAnim.r === r &&
          this.caroLastMoveAnim.c === c
        ) {
          const t = Math.min(1, this.caroLastMoveAnim.age / this.caroLastMoveAnim.duration);
          popScale = 0.72 + Math.sin(t * Math.PI * 0.78) * 0.38;
        }
        this.drawCaroStone(ctx, ix, iy, st, isLast, popScale);
      }
    }

    // 5. Blazing Priori Incantatem Colliding Wand Spell Beam on 5-in-a-row!
    if (engine.winningLine && engine.winningLine.length >= 2) {
      const first = engine.winningLine[0];
      const end = engine.winningLine[engine.winningLine.length - 1];
      const x1 = CARO_ORIGIN_X + first.c * CARO_STEP_PX;
      const y1 = CARO_ORIGIN_Y + first.r * CARO_STEP_PX;
      const x2 = CARO_ORIGIN_X + end.c * CARO_STEP_PX;
      const y2 = CARO_ORIGIN_Y + end.r * CARO_STEP_PX;
      const isPhoenixWin = engine.status === 'won';
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer Priori Incantatem plasma glow
      ctx.lineWidth = 13;
      ctx.strokeStyle = isPhoenixWin
        ? 'rgba(239, 68, 68, 0.58)'
        : 'rgba(16, 185, 129, 0.58)';
      ctx.shadowColor = isPhoenixWin ? '#facc15' : '#34d399';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Twin-core crackling spell arcs oscillating along the 5-in-a-row beam
      for (const sign of [-1, 1]) {
        ctx.lineWidth = 2.6;
        ctx.strokeStyle = isPhoenixWin ? '#fde047' : '#6ee7b7';
        ctx.beginPath();
        const segs = 10;
        for (let s = 0; s <= segs; s++) {
          const u = s / segs;
          const jitter =
            s === 0 || s === segs
              ? 0
              : Math.sin(now * 24 + s * 2.1 * sign) * 5.2 * sign;
          const px = x1 + dx * u + nx * jitter;
          const py = y1 + dy * u + ny * jitter;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // White-hot Priori Incantatem core line
      ctx.lineWidth = 4.2;
      ctx.strokeStyle = '#fffbeb';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Central Priori Incantatem Golden/Emerald Energy Nexus Sphere
      const mx = (x1 + x2) * 0.5;
      const my = (y1 + y2) * 0.5;
      const nexusR = 14 + 3 * Math.sin(now * 14);
      const nexusGrad = ctx.createRadialGradient(mx, my, 2, mx, my, nexusR);
      nexusGrad.addColorStop(0, '#ffffff');
      nexusGrad.addColorStop(0.45, isPhoenixWin ? '#fde047' : '#34d399');
      nexusGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = nexusGrad;
      ctx.beginPath();
      ctx.arc(mx, my, nexusR, 0, Math.PI * 2);
      ctx.fill();

      for (const pt of engine.winningLine) {
        const px = CARO_ORIGIN_X + pt.c * CARO_STEP_PX;
        const py = CARO_ORIGIN_Y + pt.r * CARO_STEP_PX;
        this.drawFourPointStar(ctx, px, py, 7.2, 2.4);
        ctx.fillStyle = '#fffbeb';
        ctx.fill();
      }
      ctx.restore();
    }

    // 5b. Gương Chiếu Hậu Pháp Thuật (Turning-Point Move Review) Overlay
    const caroReview = engine.getTurningPointReview();
    if (
      caroReview &&
      (this.inspectingTurningPoint || engine.status === 'lost' || engine.status === 'draw')
    ) {
      const pulse = 1 + 0.08 * Math.sin(now * 6.5);
      for (const hc of caroReview.highlightCells) {
        const hx = CARO_ORIGIN_X + hc.c * CARO_STEP_PX;
        const hy = CARO_ORIGIN_Y + hc.r * CARO_STEP_PX;
        const isBest = hc.role === 'best';
        const ringCol = isBest ? '#10b981' : '#f59e0b';
        ctx.save();
        ctx.beginPath();
        ctx.arc(hx, hy, 18.5 * pulse, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = ringCol;
        ctx.shadowColor = isBest ? '#6ee7b7' : '#fde047';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const lbl = isBest ? '✨ Nước Chuẩn' : '⚡ Đã Đi';
        ctx.font = '800 9.2px "Be Vietnam Pro", system-ui, sans-serif';
        const tw = Math.ceil(ctx.measureText(lbl).width) + 10;
        const bx = Math.max(18, Math.min(CARO_FRAME_X + CARO_FRAME_PX - tw - 4, hx - tw * 0.5));
        const by = hy - 29;
        drawRoundedRect(ctx, bx, by, tw, 15, 7);
        ctx.fillStyle = isBest ? '#065f46' : '#78350f';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#fde68a';
        ctx.stroke();
        ctx.fillStyle = '#fffbeb';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lbl, bx + tw * 0.5, by + 7.8);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  private drawCaroStone(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    stone: CaroStone,
    isLast: boolean,
    scale = 1
  ): void {
    if (stone === 0) return;
    const drawSz = 36 * scale;
    const rad = 16.3 * scale;

    ctx.save();
    // Warm parchment contact shadow
    ctx.beginPath();
    ctx.arc(cx + 0.6, cy + 2.4, rad * 0.96, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(38, 16, 6, 0.42)';
    ctx.fill();

    if (stone === 3) {
      // Impassable Ancient Wax Rune Seal (Ấn Chì Cổ Ngữ Hắc Ám — Stage >= 90)
      const waxGrad = ctx.createRadialGradient(cx - 3.2, cy - 3.8, 1.5, cx, cy, rad);
      waxGrad.addColorStop(0, '#64748b');
      waxGrad.addColorStop(0.45, '#334155');
      waxGrad.addColorStop(1, '#0f172a');
      ctx.beginPath();
      ctx.arc(cx, cy, rad - 0.6, 0, Math.PI * 2);
      ctx.fillStyle = waxGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, rad * 0.68, 0, Math.PI * 2);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.62)';
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = `900 ${Math.round(14.5 * scale)}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ᛉ', cx, cy + 0.6);
      ctx.restore();
      return;
    }

    const sealImg = this.getCaroSealImage(stone);
    if (sealImg) {
      ctx.drawImage(sealImg, cx - drawSz * 0.5, cy - drawSz * 0.5 - 0.4, drawSz, drawSz);
    } else {
      // Instant vector fallback while PNG finishes async decode
      const dome = ctx.createRadialGradient(cx - 3.5, cy - 4, 1.5, cx, cy, rad);
      if (stone === 1) {
        dome.addColorStop(0, '#fde047');
        dome.addColorStop(0.45, '#ef4444');
        dome.addColorStop(1, '#7f1d1d');
      } else {
        dome.addColorStop(0, '#6ee7b7');
        dome.addColorStop(0.45, '#065f46');
        dome.addColorStop(1, '#022c22');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, rad - 0.8, 0, Math.PI * 2);
      ctx.fillStyle = dome;
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = stone === 1 ? '#fde68a' : '#a7f3d0';
      ctx.stroke();
    }

    // Pulsing spell ring on latest played seal
    if (isLast) {
      const pulse = 1 + 0.08 * Math.sin(performance.now() * 0.01);
      ctx.beginPath();
      ctx.arc(cx, cy - 0.4, (rad + 1.6) * pulse, 0, Math.PI * 2);
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = stone === 1 ? '#fde047' : '#34d399';
      ctx.stroke();
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 6: CỜ PHÙ THỦY ĐẠI SẢNH ĐƯỜNG HOGWARTS 8x8 (HARRY POTTER CHIBI 2.5D)
  // --------------------------------------------------------------------------

  private drawGreatHallChessBackdrop(
    ctx: CanvasRenderingContext2D,
    virtW = PA_VIRTUAL_W,
    virtH = PA_VIRTUAL_H
  ): void {
    ctx.save();
    const bg = this.greatHallBgImage;
    if (bg && bg.complete && bg.naturalWidth > 0) {
      const sw = bg.naturalWidth;
      const sh = bg.naturalHeight;
      ctx.drawImage(
        bg,
        sw * 0.03,
        sh * 0.04,
        sw * 0.94,
        sh * 0.92,
        0,
        0,
        virtW,
        virtH
      );
      const scrim = ctx.createLinearGradient(0, 0, virtW, virtH);
      scrim.addColorStop(0, 'rgba(38, 16, 12, 0.34)');
      scrim.addColorStop(0.5, 'rgba(20, 14, 24, 0.24)');
      scrim.addColorStop(1, 'rgba(10, 26, 22, 0.38)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, virtW, virtH);
    } else {
      const hallGrad = ctx.createLinearGradient(0, 0, virtW, virtH);
      hallGrad.addColorStop(0, '#3b1518');
      hallGrad.addColorStop(0.5, '#1e1b2e');
      hallGrad.addColorStop(1, '#0f2924');
      ctx.fillStyle = hallGrad;
      ctx.fillRect(0, 0, virtW, virtH);
    }

    // Subtle animated Great Hall floating candles & enchanted ceiling starlight along outer rim
    const now = performance.now() * 0.001;
    const candleAnchors: ReadonlyArray<[number, number, number]> = [
      [8, 64, 0.0],
      [9, 198, 1.3],
      [8, 354, 2.4],
      [virtW - 7, 78, 2.7],
      [virtW - 8, 248, 0.5],
      [virtW - 7, 418, 1.6],
    ];
    for (const [bx, by, phase] of candleAnchors) {
      const cy = by + Math.sin(now * 1.9 + phase) * 3.5;
      const glow = ctx.createRadialGradient(bx, cy - 5, 1, bx, cy - 5, 11);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.78)');
      glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.28)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, cy - 5, 11, 0, Math.PI * 2);
      ctx.fill();

      // Tiny ivory floating taper candle
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(bx - 1.4, cy - 2, 2.8, 9);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.ellipse(bx, cy - 4.4, 1.5, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gilded Hogwarts Great Hall inner border
    drawRoundedRect(ctx, 5, 5, virtW - 10, virtH - 10, 14);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.38)';
    ctx.stroke();
    ctx.restore();
  }

  private drawChessSpellBeams(ctx: CanvasRenderingContext2D): void {
    if (this.chessSpellBeams.length === 0) return;
    ctx.save();
    for (const beam of this.chessSpellBeams) {
      const t = Math.min(1, beam.age / beam.duration);
      const alpha = Math.max(0, 1 - t * t);
      const outerCol = beam.isWhiteCaster ? '#d97706' : '#059669';
      const midCol = beam.isWhiteCaster ? '#fbbf24' : '#6ee7b7';
      const coreCol = beam.isWhiteCaster ? '#fffbeb' : '#f8fafc';

      const dx = beam.x1 - beam.x0;
      const dy = beam.y1 - beam.y0;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Curved Quadratic Bezier Arcane Spell Ribbons + Comet Head
      const midX = (beam.x0 + beam.x1) * 0.5;
      const midY = (beam.y0 + beam.y1) * 0.5;
      const arcBow = Math.min(44, len * 0.24) * (beam.isWhiteCaster ? -1 : 1);
      const ctrlX = midX + nx * arcBow;
      const ctrlY = midY + ny * arcBow - 12;

      ctx.beginPath();
      ctx.moveTo(beam.x0, beam.y0);
      ctx.quadraticCurveTo(ctrlX, ctrlY, beam.x1, beam.y1);
      ctx.strokeStyle = outerCol;
      ctx.lineWidth = 9.5 * (1 - t * 0.45);
      ctx.stroke();

      ctx.strokeStyle = midCol;
      ctx.lineWidth = 5.2 * (1 - t * 0.4);
      ctx.stroke();

      ctx.strokeStyle = coreCol;
      ctx.lineWidth = 2.3;
      ctx.stroke();

      // Secondary counter-bowing harmonic spell thread
      const counterCtrlX = midX - nx * arcBow * 0.45;
      const counterCtrlY = midY - ny * arcBow * 0.45 - 6;
      ctx.beginPath();
      ctx.moveTo(beam.x0, beam.y0);
      ctx.quadraticCurveTo(counterCtrlX, counterCtrlY, beam.x1, beam.y1);
      ctx.strokeStyle = midCol;
      ctx.lineWidth = 1.8 * (1 - t * 0.5);
      ctx.stroke();

      // Traveling Bezier spell comet head
      const headT = Math.min(1, t * 1.45);
      const invH = 1 - headT;
      const hx = invH * invH * beam.x0 + 2 * invH * headT * ctrlX + headT * headT * beam.x1;
      const hy = invH * invH * beam.y0 + 2 * invH * headT * ctrlY + headT * headT * beam.y1;
      this.drawFourPointStar(ctx, hx, hy, 10 * (1 - t * 0.35), 3.4 * (1 - t * 0.35));
      ctx.fillStyle = coreCol;
      ctx.fill();

      // Expanding arcane impact shockwave at captured target square
      const ringR = 8 + t * 28;
      ctx.beginPath();
      ctx.arc(beam.x1, beam.y1, ringR, 0, Math.PI * 2);
      ctx.lineWidth = 2.8 * (1 - t);
      ctx.strokeStyle = midCol;
      ctx.stroke();

      this.drawFourPointStar(ctx, beam.x1, beam.y1, 13 * (1 - t * 0.5), 4 * (1 - t * 0.5));
      ctx.fillStyle = coreCol;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  private drawWizardChessScene(ctx: CanvasRenderingContext2D, engine: WizardChessEngine): void {
    const now = performance.now();
    const pieceScale = CHESS_CELL_PX / 48;

    // 1. Grand Hogwarts Great Hall Carved Stone & Split House Heraldry Frame
    ctx.save();
    drawRoundedRect(
      ctx,
      CHESS_BOARD_X - 10,
      CHESS_BOARD_Y - 10,
      CHESS_BOARD_PX + 20,
      CHESS_BOARD_PX + 20,
      14
    );
    const frameGrad = ctx.createLinearGradient(
      0,
      CHESS_BOARD_Y - 10,
      0,
      CHESS_BOARD_Y + CHESS_BOARD_PX + 10
    );
    frameGrad.addColorStop(0, '#16302b'); // Slytherin obsidian-emerald top
    frameGrad.addColorStop(0.48, '#291d18');
    frameGrad.addColorStop(0.52, '#3d1816');
    frameGrad.addColorStop(1, '#4c1118'); // Gryffindor deep burgundy-oak bottom
    ctx.fillStyle = frameGrad;
    ctx.shadowColor = 'rgba(8, 5, 4, 0.72)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#f4c668';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Subtle inlaid house heraldic trim strips (top Slytherin emerald, bottom Gryffindor scarlet)
    ctx.save();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.42)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(CHESS_BOARD_X + 12, CHESS_BOARD_Y - 8);
    ctx.lineTo(CHESS_BOARD_X + CHESS_BOARD_PX - 12, CHESS_BOARD_Y - 8);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.58)';
    ctx.beginPath();
    ctx.moveTo(CHESS_BOARD_X + 12, CHESS_BOARD_Y + CHESS_BOARD_PX + 8);
    ctx.lineTo(CHESS_BOARD_X + CHESS_BOARD_PX - 12, CHESS_BOARD_Y + CHESS_BOARD_PX + 8);
    ctx.stroke();
    ctx.restore();

    this.drawBrassCornerBrackets(
      ctx,
      CHESS_BOARD_X - 9,
      CHESS_BOARD_Y - 9,
      CHESS_BOARD_PX + 18,
      CHESS_BOARD_PX + 18,
      13
    );

    const sel = engine.selected;
    const legalMoves = sel ? engine.getLegalMovesFrom(sel.r, sel.c) : [];
    const legalMap = new Map<string, { capture: boolean }>();
    for (const mv of legalMoves) {
      legalMap.set(`${mv.toR},${mv.toC}`, {
        capture: Boolean(mv.captured || mv.isEnPassant),
      });
    }

    const whiteInCheck = engine.isInCheck('w');
    const blackInCheck = engine.isInCheck('b');
    const whiteKing = whiteInCheck ? engine.findKing('w') : null;
    const blackKing = blackInCheck ? engine.findKing('b') : null;

    // 2. 8x8 Great Hall Sunlit Alabaster-Gold & Slytherin Emerald-Slate Marble Squares
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sx = CHESS_BOARD_X + c * CHESS_CELL_PX;
        const sy = CHESS_BOARD_Y + r * CHESS_CELL_PX;
        const isLight = (r + c) % 2 === 0;

        const sqGrad = ctx.createLinearGradient(sx, sy, sx + CHESS_CELL_PX, sy + CHESS_CELL_PX);
        if (isLight) {
          sqGrad.addColorStop(0, '#fffaf0');
          sqGrad.addColorStop(1, '#ebd4a6');
        } else {
          sqGrad.addColorStop(0, '#2e5d54');
          sqGrad.addColorStop(1, '#1b3b35');
        }
        ctx.fillStyle = sqGrad;
        ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);

        // Crisp stone bevel on every square
        ctx.strokeStyle = isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(253, 230, 138, 0.16)';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 0.5, sy + 0.5, CHESS_CELL_PX - 1, CHESS_CELL_PX - 1);

        // Last played move golden enchantment wash
        const isLast =
          engine.lastMove &&
          ((engine.lastMove.fromR === r && engine.lastMove.fromC === c) ||
            (engine.lastMove.toR === r && engine.lastMove.toC === c));
        if (isLast) {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.34)';
          ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
          ctx.lineWidth = 1.4;
          ctx.strokeRect(sx + 1, sy + 1, CHESS_CELL_PX - 2, CHESS_CELL_PX - 2);
        }

        // Pointer hover highlight
        if (this.chessHoverSquare && this.chessHoverSquare.r === r && this.chessHoverSquare.c === c) {
          ctx.fillStyle = 'rgba(254, 249, 195, 0.22)';
          ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);
        }

        // Selected Gryffindor square aura + rotating golden runic ring
        if (sel && sel.r === r && sel.c === c) {
          const selGrad = ctx.createRadialGradient(
            sx + CHESS_CELL_PX * 0.5,
            sy + CHESS_CELL_PX * 0.5,
            3,
            sx + CHESS_CELL_PX * 0.5,
            sy + CHESS_CELL_PX * 0.5,
            CHESS_CELL_PX * 0.65
          );
          selGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
          selGrad.addColorStop(1, 'rgba(220, 38, 38, 0.24)');
          ctx.fillStyle = selGrad;
          ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);
          ctx.lineWidth = 2.3;
          ctx.strokeStyle = '#fde047';
          ctx.strokeRect(sx + 1.5, sy + 1.5, CHESS_CELL_PX - 3, CHESS_CELL_PX - 3);
        }

        // Pulsing crimson check warning under Dumbledore or Voldemort
        if (
          (whiteKing && whiteKing.r === r && whiteKing.c === c) ||
          (blackKing && blackKing.r === r && blackKing.c === c)
        ) {
          const pulse = 0.68 + Math.sin(now * 0.008) * 0.2;
          const kGrad = ctx.createRadialGradient(
            sx + CHESS_CELL_PX * 0.5,
            sy + CHESS_CELL_PX * 0.5,
            4,
            sx + CHESS_CELL_PX * 0.5,
            sy + CHESS_CELL_PX * 0.5,
            CHESS_CELL_PX * 0.58
          );
          kGrad.addColorStop(0, `rgba(225, 29, 72, ${pulse.toFixed(2)})`);
          kGrad.addColorStop(1, 'rgba(225, 29, 72, 0.16)');
          ctx.fillStyle = kGrad;
          ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);
        }

        // Hint highlight on origin and destination squares (💡 Gợi Ý)
        if (engine.hintMove && engine.status === 'playing') {
          const isHintFrom = engine.hintMove.fromR === r && engine.hintMove.fromC === c;
          const isHintTo = engine.hintMove.toR === r && engine.hintMove.toC === c;
          if (isHintFrom || isHintTo) {
            const hPulse = 0.78 + 0.22 * Math.sin(now * 0.008);
            ctx.save();
            ctx.fillStyle = isHintTo
              ? `rgba(16, 185, 129, ${(0.34 * hPulse).toFixed(2)})`
              : `rgba(250, 204, 21, ${(0.28 * hPulse).toFixed(2)})`;
            ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);
            ctx.lineWidth = 2.6;
            ctx.strokeStyle = isHintTo ? '#34d399' : '#fde047';
            ctx.strokeRect(sx + 2, sy + 2, CHESS_CELL_PX - 4, CHESS_CELL_PX - 4);
            ctx.restore();
          }
        }

        // Legal move markers (Snitch star for empty square, arcane spell-lock ring for captures)
        const leg = legalMap.get(`${r},${c}`);
        if (leg) {
          const cx = sx + CHESS_CELL_PX * 0.5;
          const cy = sy + CHESS_CELL_PX * 0.5;
          if (leg.capture) {
            ctx.fillStyle = 'rgba(225, 29, 72, 0.22)';
            ctx.fillRect(sx, sy, CHESS_CELL_PX, CHESS_CELL_PX);
            ctx.beginPath();
            ctx.arc(cx, cy + 4, CHESS_CELL_PX * 0.4, 0, Math.PI * 2);
            ctx.lineWidth = 2.8;
            ctx.strokeStyle = '#fb7185';
            ctx.stroke();
            // Corner spell-lock brackets
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2;
            const b = 8;
            ctx.beginPath();
            ctx.moveTo(sx + 3, sy + 3 + b);
            ctx.lineTo(sx + 3, sy + 3);
            ctx.lineTo(sx + 3 + b, sy + 3);
            ctx.moveTo(sx + CHESS_CELL_PX - 3 - b, sy + 3);
            ctx.lineTo(sx + CHESS_CELL_PX - 3, sy + 3);
            ctx.lineTo(sx + CHESS_CELL_PX - 3, sy + 3 + b);
            ctx.moveTo(sx + 3, sy + CHESS_CELL_PX - 3 - b);
            ctx.lineTo(sx + 3, sy + CHESS_CELL_PX - 3);
            ctx.lineTo(sx + 3 + b, sy + CHESS_CELL_PX - 3);
            ctx.moveTo(sx + CHESS_CELL_PX - 3 - b, sy + CHESS_CELL_PX - 3);
            ctx.lineTo(sx + CHESS_CELL_PX - 3, sy + CHESS_CELL_PX - 3);
            ctx.lineTo(sx + CHESS_CELL_PX - 3, sy + CHESS_CELL_PX - 3 - b);
            ctx.stroke();
          } else {
            const starPulse = 1 + Math.sin(now * 0.006 + r + c) * 0.12;
            ctx.beginPath();
            ctx.arc(cx, cy, 8.2 * starPulse, 0, Math.PI * 2);
            ctx.fillStyle = isLight ? 'rgba(217, 119, 6, 0.24)' : 'rgba(253, 224, 71, 0.26)';
            ctx.fill();
            this.drawFourPointStar(ctx, cx, cy, 6.6 * starPulse, 2.3 * starPulse);
            ctx.fillStyle = isLight ? '#b45309' : '#fde047';
            ctx.fill();
          }
        }
      }
    }

    // Inner brass fillet & engraved algebraic coordinates a..h / 8..1
    ctx.strokeStyle = '#f4c668';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(CHESS_BOARD_X, CHESS_BOARD_Y, CHESS_BOARD_PX, CHESS_BOARD_PX);

    ctx.font = '800 9px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillStyle = '#fde68a';
    for (let i = 0; i < 8; i++) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        String.fromCharCode(97 + i),
        CHESS_BOARD_X + (i + 0.5) * CHESS_CELL_PX,
        CHESS_BOARD_Y + CHESS_BOARD_PX + 5.5
      );
      ctx.fillText(
        String(8 - i),
        CHESS_BOARD_X - 5.5,
        CHESS_BOARD_Y + (i + 0.5) * CHESS_CELL_PX
      );
    }

    const activeDragPiece =
      this.chessDragFrom &&
      this.hasDragged &&
      this.pointerCurrPos &&
      sel &&
      sel.r === this.chessDragFrom.r &&
      sel.c === this.chessDragFrom.c
        ? engine.board[this.chessDragFrom.r]?.[this.chessDragFrom.c] ?? null
        : null;

    // 3. 2.5D Chibi Harry Potter Figurines (drawn rank 0 -> 7 for natural 2.5D tabletop overlap!)
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.chessMoveAnim && this.chessMoveAnim.toR === r && this.chessMoveAnim.toC === c) {
          continue;
        }
        const piece = engine.board[r][c];
        if (!piece) continue;
        const cx = CHESS_BOARD_X + (c + 0.5) * CHESS_CELL_PX;
        const cy = CHESS_BOARD_Y + (r + 0.5) * CHESS_CELL_PX;
        const isSelectedPiece = Boolean(sel && sel.r === r && sel.c === c);
        const isBeingDragged = Boolean(
          activeDragPiece && this.chessDragFrom?.r === r && this.chessDragFrom?.c === c
        );

        if (isBeingDragged) {
          ctx.save();
          ctx.globalAlpha = 0.34;
          this.drawWizardChessPiece(ctx, cx, cy, piece, pieceScale, false);
          ctx.restore();
        } else {
          this.drawWizardChessPiece(ctx, cx, cy, piece, pieceScale, isSelectedPiece);
        }

        // Crisp floating duel badge above enemy figurines that can be captured right now
        const leg = legalMap.get(`${r},${c}`);
        if (leg?.capture) {
          ctx.save();
          const bx = cx + 18.5;
          const by = cy - 18.5;
          ctx.beginPath();
          ctx.arc(bx, by, 8.2, 0, Math.PI * 2);
          ctx.fillStyle = '#be123c';
          ctx.fill();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = '#fde047';
          ctx.stroke();
          this.drawFourPointStar(ctx, bx, by, 5, 1.8);
          ctx.fillStyle = '#fffbeb';
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Smooth parabolic levitation glide for the moving figurine
    if (this.chessMoveAnim) {
      const anim = this.chessMoveAnim;
      const t = Math.min(1, anim.age / anim.duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const x0 = CHESS_BOARD_X + (anim.fromC + 0.5) * CHESS_CELL_PX;
      const y0 = CHESS_BOARD_Y + (anim.fromR + 0.5) * CHESS_CELL_PX;
      const x1 = CHESS_BOARD_X + (anim.toC + 0.5) * CHESS_CELL_PX;
      const y1 = CHESS_BOARD_Y + (anim.toR + 0.5) * CHESS_CELL_PX;
      const gx = x0 + (x1 - x0) * ease;
      const gy = y0 + (y1 - y0) * ease - Math.sin(Math.PI * ease) * 16;
      this.drawWizardChessPiece(ctx, gx, gy, anim.piece, pieceScale * 1.06, true);
    }

    // Dragged Gryffindor figurine levitating under cursor
    if (activeDragPiece && this.pointerCurrPos) {
      this.drawWizardChessPiece(
        ctx,
        this.pointerCurrPos.vx,
        this.pointerCurrPos.vy - 7,
        activeDragPiece,
        pieceScale * 1.08,
        true
      );
    }

    // 3a. Magical Hint Guide Arrow & Target Badge (when player clicked 💡 Gợi Ý)
    if (engine.hintMove && engine.status === 'playing' && !this.chessMoveAnim) {
      const hm = engine.hintMove;
      const hx0 = CHESS_BOARD_X + (hm.fromC + 0.5) * CHESS_CELL_PX;
      const hy0 = CHESS_BOARD_Y + (hm.fromR + 0.5) * CHESS_CELL_PX;
      const hx1 = CHESS_BOARD_X + (hm.toC + 0.5) * CHESS_CELL_PX;
      const hy1 = CHESS_BOARD_Y + (hm.toR + 0.5) * CHESS_CELL_PX;
      const dx = hx1 - hx0;
      const dy = hy1 - hy0;
      const dist = Math.hypot(dx, dy);
      if (dist > 4) {
        const ux = dx / dist;
        const uy = dy / dist;
        const startX = hx0 + ux * 12;
        const startY = hy0 + uy * 12;
        const endX = hx1 - ux * 11;
        const endY = hy1 - uy * 11;
        const arrowPulse = 0.8 + 0.2 * Math.sin(now * 0.009);

        ctx.save();
        ctx.globalAlpha = arrowPulse;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Inner golden core line
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrowhead pointing to destination square
        const headLen = 10.5;
        const angle = Math.atan2(dy, dx);
        ctx.fillStyle = '#34d399';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(hx1 - ux * 4, hy1 - uy * 4);
        ctx.lineTo(
          hx1 - ux * 4 - headLen * Math.cos(angle - Math.PI / 6),
          hy1 - uy * 4 - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          hx1 - ux * 4 - headLen * Math.cos(angle + Math.PI / 6),
          hy1 - uy * 4 - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // 3b. Gương Chiếu Hậu Pháp Thuật (Turning-Point Move Review) Overlay on Chessboard
    const chessReview = engine.getTurningPointReview();
    if (
      chessReview &&
      (this.inspectingTurningPoint || engine.status === 'lost' || engine.status === 'draw')
    ) {
      const pulse = 0.85 + 0.15 * Math.sin(now * 0.007);
      for (const hc of chessReview.highlightCells) {
        const sx = CHESS_BOARD_X + hc.c * CHESS_CELL_PX;
        const sy = CHESS_BOARD_Y + hc.r * CHESS_CELL_PX;
        const isBest = hc.role === 'best';
        ctx.save();
        ctx.strokeStyle = isBest ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 3 * pulse;
        ctx.shadowColor = isBest ? '#6ee7b7' : '#fde047';
        ctx.shadowBlur = 10;
        ctx.strokeRect(sx + 2.5, sy + 2.5, CHESS_CELL_PX - 5, CHESS_CELL_PX - 5);
        ctx.shadowBlur = 0;

        const lbl = isBest ? '✨ Chuẩn' : '⚡ Đã Đi';
        ctx.font = '800 8.8px "Be Vietnam Pro", system-ui, sans-serif';
        const tw = Math.ceil(ctx.measureText(lbl).width) + 8;
        const bx = sx + (CHESS_CELL_PX - tw) * 0.5;
        const by = sy + 2;
        drawRoundedRect(ctx, bx, by, tw, 13.5, 6);
        ctx.fillStyle = isBest ? '#065f46' : '#78350f';
        ctx.fill();
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#fffbeb';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lbl, bx + tw * 0.5, by + 7);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  private drawCapturedChessRow(
    ctx: CanvasRenderingContext2D,
    startX: number,
    centerY: number,
    maxW: number,
    captured: ReadonlyArray<ChessPieceType>,
    pieceColor: 'w' | 'b'
  ): void {
    if (captured.length === 0) {
      ctx.save();
      ctx.fillStyle = '#8c5e37';
      ctx.font = '600 10px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Chưa có quân nào bị hạ', startX, centerY);
      ctx.restore();
      return;
    }
    const step = Math.min(21, maxW / Math.max(1, captured.length));
    captured.forEach((t, idx) => {
      this.drawWizardChessPiece(
        ctx,
        startX + 7 + idx * step,
        centerY + 1,
        { color: pieceColor, type: t },
        0.46,
        false
      );
    });
  }

  /**
   * Renders a unified 2.5D Hogwarts Wizard's Chess Armored Stone Figurine from `/paintings/chess/{wk..bp}.png`
   * (Identical sculpt across both sides: Ivory-Gold vs Obsidian-Silver/Emerald) with animated levitation aura
   * and an instant matching-silhouette pedestal+glyph fallback while sprites decode.
   */
  private drawWizardChessPiece(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    piece: ChessPiece,
    scale = 1,
    isSelected = false
  ): void {
    const isWhite = piece.color === 'w';
    const now = performance.now();
    const bob = isSelected ? 3.2 + Math.sin(now * 0.0075) * 1.8 : 0;
    const pieceKey = `${piece.color}${piece.type}`;
    const spr = this.chessPieceImages.get(pieceKey);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 1. Ambient ground shadow + reflection rim so both Ivory-Gold and Obsidian-Emerald pop on every square
    if (isSelected) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 14.5, 19, 7.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? 'rgba(250, 204, 21, 0.38)' : 'rgba(52, 211, 153, 0.38)';
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -now * 0.02;
      ctx.strokeStyle = isWhite ? '#fde047' : '#a7f3d0';
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 14.8, 16.4, 6.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? 'rgba(254, 243, 199, 0.2)' : 'rgba(167, 243, 208, 0.28)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.ellipse(0.6, 15.6, 15.2, 5.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14, 8, 4, 0.48)';
    ctx.fill();

    ctx.translate(0, -bob);

    if (spr && spr.complete && spr.naturalWidth > 0) {
      const drawW = 47;
      const drawH = 53.4;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(spr, -drawW * 0.5, 21.5 - drawH, drawW, drawH);
      ctx.restore();
      return;
    }

    // Lightweight instant fallback while PNG finishes decoding on first frame (identical sculpt glyph, color-only diff)
    const meta = HP_CHESS_PIECE_META[pieceKey];
    ctx.beginPath();
    ctx.ellipse(0, 12.5, 14, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#f5ead4' : '#111827';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isWhite ? '#d97706' : '#6ee7b7';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -1, 11.5, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#fffdf7' : '#1e293b';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isWhite ? '#92400e' : '#ecfdf5';
    ctx.font = '900 15px "Apple Symbols", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(meta?.glyph ?? '♚', 0, -0.5);
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      const alpha = Math.max(0, 1 - p.age / p.duration);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
      ctx.restore();
    }
  }
}
