import '../styles/puzzleArcadeModal.css';
import { formatDurationCompactVi } from '../data/catalog';
import { getMilestoneBossMeta, MAX_MINIGAME_STAGE } from '../data/match3Levels';
import { SpriteRegistry } from '../engine/spriteLoader';
import {
  createJigsawAtlasBakeCache,
  CREATURE_ONET_SPECIES,
  CreatureOnetEngine,
  FISH_ARENA_H,
  FISH_ARENA_W,
  FISH_SPECIES_CATALOG,
  FishShooterEngine,
  JIGSAW_PIECE_BOARD,
  JIGSAW_PIECE_LOCKED,
  JIGSAW_VIRTUAL_H,
  JIGSAW_VIRTUAL_W,
  JigsawArtAssetProvider,
  JigsawAtlasBakeCache,
  LayeredTileCard,
  MasterJigsawEngine,
  MinesweeperEngine,
  OnetPoint,
  resolveJigsawBoardAspect,
  stepJigsawAtlasBake,
  SudokuPuzzleEngine,
  SwimmingFish,
  syncLockedPiecesToLayer,
  TILE_MATCH_SYMBOLS,
  TILE_TRAY_CAPACITY,
  TileMatchZenEngine,
  TurningPointReview,
  WizardingPortraitKey,
} from '../sim/puzzleArcadeEngine';
import { MAX_DAILY_MINIGAME_RESCUES } from '../sim/neighborSocial';
import {
  isProofOfPlayGameId,
  ProofOfPlayRecorder,
  verifyProofOfPlayEnvelope,
  type ProofOfPlayGameId,
} from '../sim/proofOfPlay';
import { MinigameGpuFxBatcher } from '../render/fx/minigameGpuFx';
import { ParkSimulation } from '../sim/simulation';
import {
  ActiveMinigameResumeRecord,
  BuildReductionResult,
  JigsawTrayFilter,
  LeaderboardRankChange,
  MinigameRescueContext,
  PuzzleArcadeMode,
} from '../types/game';
import {
  clientToLocalNormalized,
  MINIGAME_ZOOM_STEP,
  sharedMinigameViewport,
} from './minigameViewControls';
import { compactSickle, liftToolIcons } from '../hpvn/toolIcons';
import { fillCheck } from '../hpvn/emoji';
import { levelBarHtml, lvIcon, lvStat, LV_MISTAKE } from '../hpvn/levelBar';

const PA_VIRTUAL_W = JIGSAW_VIRTUAL_W; // 692
const PA_VIRTUAL_H = JIGSAW_VIRTUAL_H; // 504

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): void {
  const r = Math.max(0, Math.min(radius, w * 0.5, h * 0.5));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

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

export function getSudokuDigitFillColor(
  isInitialClue: boolean,
  isYule: boolean,
  isSelected = false
): string {
  if (isInitialClue) {
    return isYule ? '#0f172a' : '#2b1407';
  }
  return isYule && isSelected ? '#1e3a8a' : '#1d4ed8';
}

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
  private paintingTokenImages = new Map<string, HTMLImageElement>();
  private chessPieceImages = new Map<string, HTMLImageElement>();
  private jigsawPaintingImages = new Map<string, HTMLImageElement>();
  private parlorBgImage: HTMLImageElement | null = null;
  private hogwartsMinesBgImage: HTMLImageElement | null = null;
  private blackLakeUnderwaterBgImage: HTMLImageElement | null = null;
  private blackLakeCreaturesAtlas: HTMLImageElement | null = null;
  private cachedFishBgCanvas: HTMLCanvasElement | null = null;
  private cachedFishBgKey = '';
  private lakeBgImage: HTMLImageElement | null = null;
  private unicornLakeBgImage: HTMLImageElement | null = null;
  private yuleArcadeAssetsLoaded = false;
  private yuleSudokuRelicImages = new Map<number, HTMLImageElement>();
  private yuleGreatHallBgImage: HTMLImageElement | null = null;
  private yuleCaroBgImage: HTMLImageElement | null = null;

  public mode: PuzzleArcadeMode = 'caro';
  public sudokuDisplayMode: SudokuDisplayMode = 'num_only';
  public sudokuEngine: SudokuPuzzleEngine | null = null;
  public minesEngine: MinesweeperEngine | null = null;
  public fishEngine: FishShooterEngine | null = null;
  public onetEngine: CreatureOnetEngine | null = null;
  public jigsawEngine: MasterJigsawEngine | null = null;
  public tileEngine: TileMatchZenEngine | null = null;
  private jigsawBakeCache: JigsawAtlasBakeCache | null = null;
  private jigsawAutoSaveAccumSec = 0;
  private jigsawWinRevealTimer = 0;
  private jigsawTrayPage = 0;
  private jigsawTrayScrollLeft = 0;
  private jigsawFilterScrollLeft = 0;
  private jigsawTrayCollapsed = false;
  private jigsawDragBoardPiece: number | null = null;
  private jigsawDragGrabOffsetNorm: { dx: number; dy: number } = { dx: 0, dy: 0 };
  private jigsawActiveBoardPiece: number | null = null;
  private jigsawTrayDragState: {
    pointerId: number;
    pieceIdx: number;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
    startScrollLeft: number;
    pointerType: string;
    gesture: 'undecided' | 'lift' | 'scroll';
    dragging: boolean;
    ghostEl: HTMLCanvasElement | null;
  } | null = null;
  private sudokuPadRects = new Map<number, { x: number; y: number; w: number; h: number }>();
  private sudokuActionRects = new Map<
    SudokuQuickActionKey,
    { x: number; y: number; w: number; h: number }
  >();
  private sudokuHoverCell: { r: number; c: number } | null = null;
  private sudokuHoverPadDigit: number | null = null;
  private sudokuHoverAction: SudokuQuickActionKey | null = null;
  private minesHoverCell: { r: number; c: number } | null = null;
  private minesWinRevealTimer = 0;
  private minesFireworkTimer = 0;
  private minesLongPressTimer: ReturnType<typeof setTimeout> | null = null;
  private minesLongPressTriggered = false;
  private fishWinRevealTimer = 0;
  private fishAutoSaveAccumSec = 0;
  private fishShakeTimer = 0;
  private fishShakeAmp = 0;
  private hitStopTimer = 0;
  private inspectingTurningPoint = false;
  private companionCharge = 0;
  private snackPieUsedThisAttempt = false;
  private lossStreakResetForStage = false;
  private sudokuAutoSaveAccumSec = 0;

  private victoryClaimed = false;
  public rescueContext: MinigameRescueContext | null = null;

  private cancelMinesLongPress(): void {
    if (this.minesLongPressTimer !== null) {
      clearTimeout(this.minesLongPressTimer);
      this.minesLongPressTimer = null;
    }
  }

  public resetSession(): void {
    this.cancelMinesLongPress();
    this.stopLoop();
    this.cleanupJigsawTrayDrag();
    this.sudokuEngine = null;
    this.minesEngine = null;
    this.fishEngine = null;
    this.onetEngine = null;
    this.jigsawEngine = null;
    this.jigsawBakeCache = null;
    this.tileEngine = null;
    this.victoryClaimed = false;
    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    this.popRecorders.clear();
    const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
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
  private popRecorders = new Map<ProofOfPlayGameId, ProofOfPlayRecorder>();
  private popActionSeq = 0;
  private gpuFx: MinigameGpuFxBatcher | null = null;
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
  private canvasResizeObserver: ResizeObserver | null = null;
  private observedStageCssW = 0;
  private observedStageCssH = 0;
  private observedCanvasCssW = 0;
  private observedCanvasCssH = 0;
  private forceImmediateRedraw = true;
  private idleDrawAccumSec = 0;
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
    bonusTimeSec?: number;
  }> = [];
  private onetSlideAnims = new Map<
    string,
    { fromR: number; fromC: number; age: number; duration: number }
  >();
  private onetWinRevealTimer = 0;
  private onetAutoSaveAccumSec = 0;
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
      if (dlg.open) return;
      dlg.returnValue = '';
      this.cancelMinesLongPress();
      this.hitStopTimer = 0;
      this.inspectingTurningPoint = false;
      this.cleanupJigsawTrayDrag();
      if (this.minesWinRevealTimer > 0 && !this.victoryClaimed) {
        this.minesWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (this.fishWinRevealTimer > 0 && !this.victoryClaimed) {
        this.fishWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (this.onetWinRevealTimer > 0 && !this.victoryClaimed) {
        this.onetWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (this.jigsawWinRevealTimer > 0 && !this.victoryClaimed) {
        this.jigsawWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (typeof document === 'undefined' || !document.hidden) {
        this.clearActiveModalResumeMarker();
      }
      if (this.rescueContext) {
        this.rescueContext = null;
        this.rescueVictoryOutcome = null;
        this.sudokuEngine = null;
        this.minesEngine = null;
        this.fishEngine = null;
        this.onetEngine = null;
        this.jigsawEngine = null;
        this.jigsawBakeCache = null;
        this.sim.saveToStorage();
      } else {
        this.persistModeSession(this.mode, true);
      }
      const modalInner =
        typeof dlg.querySelector === 'function'
          ? (dlg.querySelector('.pa-modal-inner') as HTMLElement | null)
          : null;
      sharedMinigameViewport.unbindStageInteractions('arcade');
      sharedMinigameViewport.clearDialogOrientation(dlg, modalInner);
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
      const handleViewportResize = () => {
        const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
        if (!openDlg?.open) return;
        const modalInner =
          typeof openDlg.querySelector === 'function'
            ? (openDlg.querySelector('.pa-modal-inner') as HTMLElement | null)
            : null;
        const prevLayout = openDlg.dataset?.mgLayout;
        const res = sharedMinigameViewport.applyDialogOrientation(openDlg, modalInner, false);
        if (prevLayout && prevLayout !== res.effectiveLayout) {
          this.renderDOM();
          return;
        }
        this.syncArcadeViewportTransform();
      };
      window.addEventListener('resize', handleViewportResize);
      window.visualViewport?.addEventListener('resize', handleViewportResize);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
      const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      if (!openDlg?.open || this.victoryClaimed) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        sharedMinigameViewport.stepZoom(this.mode, MINIGAME_ZOOM_STEP);
        this.syncArcadeViewportTransform();
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        sharedMinigameViewport.stepZoom(this.mode, -MINIGAME_ZOOM_STEP);
        this.syncArcadeViewportTransform();
        return;
      }
      if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        sharedMinigameViewport.resetView(this.mode);
        this.syncArcadeViewportTransform();
        return;
      }
      this.forceImmediateRedraw = true;

      if (
        this.mode === 'jigsaw' &&
        this.jigsawEngine &&
        (this.jigsawEngine.status === 'playing' || this.jigsawEngine.status === 'lost')
      ) {
        const je = this.jigsawEngine;
        if (je.status === 'playing') {
          if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            (this.root.querySelector('#btnPaJigsawHint') as HTMLButtonElement | null)?.click();
            return;
          }
          if (e.key === 'p' || e.key === 'P' || e.key === 'g' || e.key === 'G') {
            e.preventDefault();
            (this.root.querySelector('#btnPaJigsawPreview') as HTMLButtonElement | null)?.click();
            return;
          }
          if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            (this.root.querySelector('#btnPaJigsawTidy') as HTMLButtonElement | null)?.click();
            return;
          }
          if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            (this.root.querySelector('#btnPaJigsawScatterTray') as HTMLButtonElement | null)?.click();
            return;
          }
          if (
            this.jigsawActiveBoardPiece !== null &&
            je.pieceState[this.jigsawActiveBoardPiece] === JIGSAW_PIECE_BOARD
          ) {
            if (
              e.key === 'ArrowUp' ||
              e.key === 'ArrowDown' ||
              e.key === 'ArrowLeft' ||
              e.key === 'ArrowRight'
            ) {
              e.preventDefault();
              const stepCells = e.shiftKey ? 1 : 0.25;
              const cur = je.getBoardPieceNormCenter(this.jigsawActiveBoardPiece);
              const dnx =
                e.key === 'ArrowLeft'
                  ? -stepCells / je.cols
                  : e.key === 'ArrowRight'
                    ? stepCells / je.cols
                    : 0;
              const dny =
                e.key === 'ArrowUp'
                  ? -stepCells / je.rows
                  : e.key === 'ArrowDown'
                    ? stepCells / je.rows
                    : 0;
              je.movePieceClusterToNorm(this.jigsawActiveBoardPiece, cur.nx + dnx, cur.ny + dny);
              this.persistModeSession('jigsaw', false);
              return;
            }
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.finalizeJigsawBoardClusterDrop(this.jigsawActiveBoardPiece);
              return;
            }
          }
        }
        return;
      }

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
        this.mode === 'caro' &&
        this.minesEngine &&
        this.minesEngine.status === 'playing'
      ) {
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          (this.root.querySelector('#btnPaMinesFlag') as HTMLButtonElement | null)?.click();
          return;
        }
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          (this.root.querySelector('#btnPaMinesHint') as HTMLButtonElement | null)?.click();
          return;
        }
      }

      if (
        this.mode === 'chess' &&
        this.fishEngine &&
        this.fishEngine.status === 'playing'
      ) {
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          (this.root.querySelector('#btnPaFishPower') as HTMLButtonElement | null)?.click();
          return;
        }
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          (this.root.querySelector('#btnPaFishSkill') as HTMLButtonElement | null)?.click();
          return;
        }
        if (e.key === ' ') {
          e.preventDefault();
          this.fireFishShooterAtCanvas(this.fishEngine.aimX, this.fishEngine.aimY, true);
          return;
        }
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

  private syncArcadeViewportTransform(): void {
    const box = this.root.querySelector('#puzzleArcadeDialogContent') as HTMLElement | null;
    if (!box) return;
    const panArea = box.querySelector('.mg-stage-pan-area') as HTMLElement | null;
    const shell = box.querySelector('.pa-canvas-shell') as HTMLElement | null;
    sharedMinigameViewport.applyCanvasStageTransform(this.mode, panArea, shell);
    sharedMinigameViewport.syncToolbarDOM(box, this.mode);
    this.forceImmediateRedraw = true;
    this.drawFrame();
  }

  private isMobileBoardLayout(): boolean {
    return sharedMinigameViewport.getEffectiveLayout(false) === 'portrait';
  }

  private computeMinesBoardMetrics(engine: MinesweeperEngine): {
    frameX: number;
    frameY: number;
    frameW: number;
    frameH: number;
    originX: number;
    originY: number;
    cellSize: number;
    boardW: number;
    boardH: number;
    dispRows: number;
    dispCols: number;
    transposed: boolean;
  } {
    const virt = this.getVirtualCanvasSize();
    const minDim = Math.min(virt.w, virt.h);
    const transposed =
      (virt.h > virt.w * 1.03 && engine.cols > engine.rows) ||
      (virt.w > virt.h * 1.03 && engine.rows > engine.cols) ||
      (Math.abs(virt.h - virt.w) <= virt.w * 0.03 &&
        this.isMobileBoardLayout() &&
        engine.cols > engine.rows);
    const dispRows = transposed ? engine.cols : engine.rows;
    const dispCols = transposed ? engine.rows : engine.cols;

    const framePad = Math.max(6, Math.min(12, Math.round(minDim * 0.018)));
    const topSafe = 28;
    const botSafe = 6;
    const availW = Math.max(160, virt.w - (framePad + 8) * 2);
    const availH = Math.max(150, virt.h - framePad * 2 - topSafe - botSafe);
    const maxCell = this.isMobileBoardLayout() ? 52 : 56;
    const cellSize = Math.max(
      16,
      Math.min(maxCell, Math.floor(Math.min(availW / dispCols, availH / dispRows)))
    );
    const boardW = dispCols * cellSize;
    const boardH = dispRows * cellSize;
    const frameW = boardW + framePad * 2;
    const frameH = boardH + framePad * 2;
    const frameX = Math.round((virt.w - frameW) * 0.5);
    const frameY = Math.max(
      topSafe,
      Math.round(topSafe + (availH + framePad * 2 - frameH) * 0.5)
    );
    return {
      frameX,
      frameY,
      frameW,
      frameH,
      originX: frameX + framePad,
      originY: frameY + framePad,
      cellSize,
      boardW,
      boardH,
      dispRows,
      dispCols,
      transposed,
    };
  }

  private getFishViewportMetrics(virtW: number, virtH: number): {
    scale: number;
    offsetX: number;
    offsetY: number;
    arenaPxW: number;
    arenaPxH: number;
    unitScale: number;
    timerBarX: number;
    timerBarY: number;
    timerBarW: number;
    timerBarH: number;
  } {
    const timerBarH = 20;
    const timerGap = 4;
    const timerTotal = timerBarH + timerGap;
    const availH = Math.max(120, virtH - timerTotal);
    const scale = Math.min(virtW / FISH_ARENA_W, availH / FISH_ARENA_H);
    const arenaPxW = FISH_ARENA_W * scale;
    const arenaPxH = FISH_ARENA_H * scale;
    const timerBarY = Math.max(2, (virtH - (timerTotal + arenaPxH)) * 0.5);
    const offsetX = (virtW - arenaPxW) * 0.5;
    const offsetY = timerBarY + timerTotal;
    const timerBarW = Math.min(virtW - 12, Math.max(Math.min(240, virtW - 12), arenaPxW - 4));
    const timerBarX = (virtW - timerBarW) * 0.5;
    return {
      scale,
      offsetX,
      offsetY,
      arenaPxW,
      arenaPxH,
      unitScale: scale,
      timerBarX,
      timerBarY,
      timerBarW,
      timerBarH,
    };
  }

  private getSudokuLayoutMetrics(
    stageWOverride?: number,
    stageHOverride?: number
  ): {
    variant: 'landscape' | 'portrait-tall' | 'portrait-compact';
    virtW: number;
    virtH: number;
    boardX: number;
    boardY: number;
    cellPx: number;
    boardPx: number;
    framePad: number;
    padX: number;
    padY: number;
    padW: number;
    padH: number;
    trayY: number;
    trayH: number;
  } {
    let sw = stageWOverride && stageWOverride > 40 ? stageWOverride : this.observedStageCssW;
    let sh = stageHOverride && stageHOverride > 40 ? stageHOverride : this.observedStageCssH;
    if (sw <= 40 || sh <= 40) {
      if (typeof window !== 'undefined') {
        const winW = Math.round(window.visualViewport?.width || window.innerWidth || 390);
        const winH = Math.round(window.visualViewport?.height || window.innerHeight || 844);
        if (this.isMobileBoardLayout()) {
          sw = Math.max(260, winW - 18);
          sh = Math.max(300, winH - 188);
        } else {
          sw = Math.max(420, winW - 250);
          sh = Math.max(300, winH - 24);
        }
      } else {
        sw = this.isMobileBoardLayout() ? 372 : 662;
        sh = this.isMobileBoardLayout() ? 520 : 502;
      }
    }

    const wideRatio = sw / Math.max(1, sh);
    const tallRatio = sh / Math.max(1, sw);
    const cellPx = SUDOKU_CELL_PX;
    const boardPx = SUDOKU_BOARD_PX;

    if (wideRatio >= 1.18 || (!this.isMobileBoardLayout() && wideRatio >= 1.06)) {
      const boardX = SUDOKU_BOARD_X;
      const boardY = SUDOKU_BOARD_Y;
      const virtH = SUDOKU_DESKTOP_H;
      const padX = SUDOKU_PAD_X;
      const padY = SUDOKU_PAD_Y;
      const padH = SUDOKU_PAD_H;
      const desiredVirtW = Math.round(
        virtH * Math.min(1.42, Math.max(1.275, wideRatio * 0.985))
      );
      const padW = Math.max(129, Math.min(200, desiredVirtW - padX - 6));
      const virtW = padX + padW + 6;
      return {
        variant: 'landscape',
        virtW,
        virtH,
        boardX,
        boardY,
        cellPx,
        boardPx,
        framePad: 5.5,
        padX,
        padY,
        padW,
        padH,
        trayY: 0,
        trayH: 0,
      };
    }

    const boardX = 5;
    const boardY = 5;
    const virtW = boardPx + boardX * 2; // 496
    const virtH = 578;
    const trayY = boardY + boardPx + 6; // 497
    const trayH = virtH - trayY - 2;
    return {
      variant: 'portrait-compact',
      virtW,
      virtH,
      boardX,
      boardY,
      cellPx,
      boardPx,
      framePad: 4,
      padX: 0,
      padY: 0,
      padW: 0,
      padH: 0,
      trayY,
      trayH,
    };
  }

  private getVirtualCanvasSize(): { w: number; h: number } {
    switch (this.mode) {
      case 'sudoku': {
        const sm = this.getSudokuLayoutMetrics();
        return { w: sm.virtW, h: sm.virtH };
      }
      case 'caro':
      case 'chess':
      case 'blocks':
      case 'jigsaw': {
        if (this.observedCanvasCssW >= 60 && this.observedCanvasCssH >= 60) {
          return { w: Math.round(this.observedCanvasCssW), h: Math.round(this.observedCanvasCssH) };
        }
        if (this.canvas) {
          const cw = this.canvas.clientWidth;
          const ch = this.canvas.clientHeight;
          if (cw >= 60 && ch >= 60) {
            return { w: Math.round(cw), h: Math.round(ch) };
          }
          if (typeof this.canvas.getBoundingClientRect === 'function') {
            const r = this.canvas.getBoundingClientRect();
            const netRot = sharedMinigameViewport.getNetQuarterTurns(this.mode);
            const z = Math.max(0.25, sharedMinigameViewport.getState(this.mode).zoom);
            const rw = (netRot % 2 === 1 ? r.height : r.width) / z;
            const rh = (netRot % 2 === 1 ? r.width : r.height) / z;
            if (rw >= 60 && rh >= 60) {
              return { w: Math.round(rw), h: Math.round(rh) };
            }
          }
        }
        return this.isMobileBoardLayout() ? { w: 540, h: 720 } : { w: 864, h: 540 };
      }
    }
  }

  private preloadAssets(): void {
    const parlorImg = new Image();
    parlorImg.decoding = 'async';
    parlorImg.src = '/game/trang-trai-hang-soc/paintings/burrow_parlor_bg.webp';
    this.parlorBgImage = parlorImg;

    const minesBgImg = new Image();
    minesBgImg.decoding = 'async';
    minesBgImg.onload = () => {
      this.forceImmediateRedraw = true;
    };
    minesBgImg.src = '/game/trang-trai-hang-soc/paintings/hogwarts_mines_bg.webp';
    this.hogwartsMinesBgImage = minesBgImg;

    const blackLakeBgImg = new Image();
    blackLakeBgImg.decoding = 'async';
    blackLakeBgImg.onload = () => {
      this.cachedFishBgKey = '';
      this.forceImmediateRedraw = true;
    };
    blackLakeBgImg.src = '/game/trang-trai-hang-soc/paintings/black_lake_underwater_bg.webp';
    this.blackLakeUnderwaterBgImage = blackLakeBgImg;

    const blackLakeCreaturesImg = new Image();
    blackLakeCreaturesImg.decoding = 'async';
    blackLakeCreaturesImg.onload = () => {
      this.forceImmediateRedraw = true;
    };
    blackLakeCreaturesImg.src = '/game/trang-trai-hang-soc/paintings/black_lake_creatures.webp';
    this.blackLakeCreaturesAtlas = blackLakeCreaturesImg;

    const lakeImg = new Image();
    lakeImg.decoding = 'async';
    lakeImg.src = '/game/trang-trai-hang-soc/paintings/jigsaw_silver_stag_lake.webp';
    this.lakeBgImage = lakeImg;

    const unicornLakeImg = new Image();
    unicornLakeImg.decoding = 'async';
    unicornLakeImg.src = '/game/trang-trai-hang-soc/paintings/p5_unicorn_lake.webp';
    this.unicornLakeBgImage = unicornLakeImg;

    const paintingTokenKeys = [
      'caro/phoenix_seal',
      'caro/dark_mark_seal',
      'caro-yule/phoenix_seal',
      'caro-yule/dark_mark_seal',
      'candy-hogwarts/candy-horcrux',
      'candy-hogwarts/candy-fiendfyre',
    ];
    for (const tk of paintingTokenKeys) {
      const pImg = new Image();
      pImg.decoding = 'async';
      pImg.onload = () => {
        this.forceImmediateRedraw = true;
      };
      pImg.src = `/game/trang-trai-hang-soc/paintings/${tk}.webp`;
      this.paintingTokenImages.set(tk, pImg);
    }

    const spriteKeys = new Set<string>([
      ...CREATURE_ONET_SPECIES.map((s) => s.spriteKey),
      ...TILE_MATCH_SYMBOLS.map((s) => s.spriteKey),
      ...Object.values(PORTRAIT_SPRITE_CROPS)
        .map((v) => v.spriteKey)
        .filter((k): k is string => Boolean(k)),
      'm3_icon_star',
      'm3_sp_bomb',
      'm3_farm_jam_bomb',
      'm3_boost_cannon',
      'm3_sp_snitch',
      'm3_gem_sapphire',
      'ui_lock',
      'ui_icon_hammer_wand',
      'ui_icon_golden_sickle',
    ]);
    for (const key of spriteKeys) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/game/trang-trai-hang-soc/sprites/${key}.webp`;
      this.iconImages.set(key, img);
    }
  }

  private isYuleSkinActive(): boolean {
    return this.sim.isYuleVisualThemeActive();
  }

  private ensureYuleArcadeAssetsLoaded(): void {
    if (this.yuleArcadeAssetsLoaded || typeof Image === 'undefined') return;
    this.yuleArcadeAssetsLoaded = true;

    const markReady = () => {
      this.forceImmediateRedraw = true;
    };

    const yHall = new Image();
    yHall.decoding = 'async';
    yHall.onload = markReady;
    yHall.src = '/game/trang-trai-hang-soc/paintings/yule_great_hall_chess_bg.webp';
    this.yuleGreatHallBgImage = yHall;

    const yCaroBg = new Image();
    yCaroBg.decoding = 'async';
    yCaroBg.onload = markReady;
    yCaroBg.src = '/game/trang-trai-hang-soc/paintings/yule_caro_bg.webp';
    this.yuleCaroBgImage = yCaroBg;

    for (let d = 1; d <= 9; d++) {
      const rImg = new Image();
      rImg.decoding = 'async';
      rImg.onload = markReady;
      rImg.src = `/game/trang-trai-hang-soc/paintings/sudoku-yule/relic_${d}.webp`;
      this.yuleSudokuRelicImages.set(d, rImg);
    }
  }

  private getSudokuRelicImage(digit: number): HTMLImageElement | null {
    if (!this.isYuleSkinActive()) return null;
    this.ensureYuleArcadeAssetsLoaded();
    const img = this.yuleSudokuRelicImages.get(digit);
    if (img && img.complete && img.naturalWidth > 0) return img;
    return null;
  }

  private getSpriteImage(key: string): HTMLImageElement | null {
    const fromReg = this.sprites?.getRaw(key);
    if (fromReg && fromReg.complete && fromReg.naturalWidth > 0) return fromReg;
    let local = this.iconImages.get(key);
    if (!local && typeof Image !== 'undefined') {
      local = new Image();
      local.decoding = 'async';
      local.onload = () => {
        this.forceImmediateRedraw = true;
        if (this.jigsawBakeCache?.waitingOnExternalImage) {
          this.jigsawBakeCache = null;
        }
      };
      local.src = `/game/trang-trai-hang-soc/sprites/${key}.webp`;
      this.iconImages.set(key, local);
    }
    if (local && local.complete && local.naturalWidth > 0) return local;
    return null;
  }

  private getPaintingTokenImage(relKey: string): HTMLImageElement | null {
    let img = this.paintingTokenImages.get(relKey);
    if (!img && typeof Image !== 'undefined') {
      img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.forceImmediateRedraw = true;
      };
      img.src = `/game/trang-trai-hang-soc/paintings/${relKey}.webp`;
      this.paintingTokenImages.set(relKey, img);
    }
    if (img && img.complete && img.naturalWidth > 0) return img;
    return null;
  }

  private getJigsawPaintingImage(url: string): HTMLImageElement | null {
    let img = this.jigsawPaintingImages.get(url);
    if (!img && typeof Image !== 'undefined') {
      img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (this.jigsawBakeCache?.waitingOnExternalImage) {
          this.jigsawBakeCache = null;
          this.forceImmediateRedraw = true;
        }
      };
      img.src = url;
      this.jigsawPaintingImages.set(url, img);
    }
    if (img && img.complete && img.naturalWidth > 0) return img;
    return null;
  }

  private getJigsawSpriteImage(key: string): HTMLImageElement | null {
    const existing = this.getSpriteImage(key);
    if (existing) return existing;
    if (!this.iconImages.has(key) && typeof Image !== 'undefined') {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (this.jigsawBakeCache?.waitingOnExternalImage) {
          this.jigsawBakeCache = null;
          this.forceImmediateRedraw = true;
        }
      };
      img.src = `/game/trang-trai-hang-soc/sprites/${key}.webp`;
      this.iconImages.set(key, img);
    }
    return null;
  }

  private getJigsawArtAssetProvider(): JigsawArtAssetProvider {
    return {
      getPaintingImage: (url) => this.getJigsawPaintingImage(url),
      getSpriteImage: (spriteKey) => this.getJigsawSpriteImage(spriteKey),
    };
  }

  public open(initialMode?: PuzzleArcadeMode): void {
    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    const rawMode = initialMode ?? this.sim.state.puzzleArcade?.activeMode ?? 'caro';
    const targetMode: PuzzleArcadeMode =
      rawMode === 'sudoku' ||
      rawMode === 'caro' ||
      rawMode === 'chess' ||
      rawMode === 'blocks' ||
      rawMode === 'jigsaw'
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
    if (
      (this.minesWinRevealTimer > 0 ||
        this.fishWinRevealTimer > 0 ||
        this.onetWinRevealTimer > 0 ||
        this.jigsawWinRevealTimer > 0) &&
      !this.victoryClaimed
    ) {
      this.minesWinRevealTimer = 0;
      this.fishWinRevealTimer = 0;
      this.onetWinRevealTimer = 0;
      this.jigsawWinRevealTimer = 0;
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
    this.cancelMinesLongPress();
    this.minesLongPressTriggered = false;
    this.cleanupJigsawTrayDrag();
    this.activePointerId = null;
    this.onetHoverCell = null;
    this.onetCursorCell = null;
    this.onetBlockedFlash = null;
    this.onetBeams = [];
    this.onetSlideAnims.clear();
    this.onetWinRevealTimer = 0;
    this.onetAutoSaveAccumSec = 0;
    this.jigsawAutoSaveAccumSec = 0;
    this.jigsawWinRevealTimer = 0;
    this.jigsawTrayPage = 0;
    this.jigsawTrayScrollLeft = 0;
    this.jigsawFilterScrollLeft = 0;
    this.jigsawDragBoardPiece = null;
    this.jigsawActiveBoardPiece = null;
    this.sudokuHoverCell = null;
    this.sudokuHoverPadDigit = null;
    this.sudokuHoverAction = null;
    this.minesHoverCell = null;
    this.minesWinRevealTimer = 0;
    this.minesFireworkTimer = 0;
    this.fishWinRevealTimer = 0;
    this.fishAutoSaveAccumSec = 0;
    this.fishShakeTimer = 0;
    this.fishShakeAmp = 0;
    this.hitStopTimer = 0;
    this.inspectingTurningPoint = false;
    this.particles = [];
    this.flyingTiles = [];
  }

  private getActiveTurningPointReview(): TurningPointReview | null {
    if (this.mode === 'caro' && this.minesEngine) {
      return this.minesEngine.getTurningPointReview();
    }
    if (this.mode === 'chess' && this.fishEngine) {
      return this.fishEngine.getTurningPointReview();
    }
    if (this.mode === 'blocks' && this.onetEngine) {
      return this.onetEngine.getTurningPointReview();
    }
    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      return this.jigsawEngine.getTurningPointReview();
    }
    return null;
  }

  // HPVN: a won jigsaw shows only its data line «9/9 mảnh · viền 1:43»; the loss strip keeps move + advice
  private renderTurningPointCardHtml(rev: TurningPointReview, won = false): string {
    const dataOnly = won && rev.mode === 'jigsaw';
    const isOptimalMove = rev.playedCoordVi.trim() === rev.recommendedCoordVi.trim();
    return `
      <div class="pa-review-card">
        <div class="pa-review-head">
          ${
            rev.highlightCells.length > 0 && !won && rev.mode !== 'caro' // Minesweeper already reveals all mines on the visible board
              ? `<button id="btnPaToggleReviewInspect" type="button" class="pa-mini-pill ${this.inspectingTurningPoint ? 'active' : ''}">${
                  this.inspectingTurningPoint ? 'Ẩn' : 'Soi bàn'
                }</button>`
              : ''
          }
        </div>
        <div class="pa-review-pills">
          ${
            !dataOnly && isOptimalMove
              ? `<span class="pa-review-pill best">Nước ${rev.plyNumber} · chuẩn: ${escapeHtml(rev.recommendedCoordVi)}</span>`
              : `<span class="pa-review-pill">${dataOnly ? '' : `Nước ${rev.plyNumber} · `}${escapeHtml(rev.playedCoordVi)}</span>
          ${dataOnly ? '' : `<span class="pa-review-pill best">Nên: ${escapeHtml(rev.recommendedCoordVi)}</span>`}`
          }
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
    if (this.mode === 'caro') return this.minesEngine?.stage ?? pa.caroStage ?? 1;
    if (this.mode === 'chess') return this.fishEngine?.stage ?? pa.chessStage ?? 1;
    if (this.mode === 'jigsaw') return this.jigsawEngine?.stage ?? pa.jigsawStage ?? 1;
    return this.onetEngine?.stage ?? pa.blockStage ?? 1;
  }

  private persistActiveModalResumeMarker(): void {
    if (this.rescueContext || this.victoryClaimed) return;
    // HPVN: the marker rides in the farm save (no browser storage in the frame), so F5 reopens this run
    this.sim.state.activeMinigameResume = {
        dialog: 'puzzleArcade',
        mode: this.mode,
        stage: this.getActiveEngineStage(),
      savedAt: Date.now(),
    };
  }


  private clearActiveModalResumeMarker(): void {
    delete this.sim.state.activeMinigameResume;
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
      if (!this.minesEngine || this.minesEngine.stage !== pa.caroStage) return;
      if (this.minesEngine.status === 'won' || (this.mode === 'caro' && this.victoryClaimed)) {
        if (pa.minesSession) {
          pa.minesSession = null;
          if (saveToDisk) this.sim.saveToStorage();
        }
        return;
      }
      pa.minesSession = this.minesEngine.exportSession(
        extra ?? {
          companionCharge: pa.minesSession?.companionCharge ?? 0,
          snackPieUsed: pa.minesSession?.snackPieUsed ?? false,
        }
      );
      if (saveToDisk) this.sim.saveToStorage();
      return;
    }

    if (mode === 'chess') {
      if (!this.fishEngine || this.fishEngine.stage !== pa.chessStage) return;
      if (this.fishEngine.status === 'won' || (this.mode === 'chess' && this.victoryClaimed)) {
        if (pa.fishingSession) {
          pa.fishingSession = null;
          if (saveToDisk) this.sim.saveToStorage();
        }
        return;
      }
      this.fishAutoSaveAccumSec = 0;
      pa.fishingSession = this.fishEngine.exportSession(
        extra ?? {
          companionCharge: pa.fishingSession?.companionCharge ?? 0,
          snackPieUsed: pa.fishingSession?.snackPieUsed ?? false,
        }
      );
      if (saveToDisk) this.sim.saveToStorage();
      return;
    }

    if (mode === 'jigsaw') {
      if (!this.jigsawEngine || this.jigsawEngine.stage !== pa.jigsawStage) return;
      if (this.jigsawEngine.status === 'won' || (this.mode === 'jigsaw' && this.victoryClaimed)) {
        if (pa.jigsawSession) {
          pa.jigsawSession = null;
          if (saveToDisk) this.sim.saveToStorage();
        }
        return;
      }
      pa.jigsawSession = this.jigsawEngine.exportSession(
        extra ?? {
          companionCharge: pa.jigsawSession?.companionCharge ?? 0,
          snackPieUsed: pa.jigsawSession?.snackPieUsed ?? false,
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
    if (
      (this.minesWinRevealTimer > 0 ||
        this.fishWinRevealTimer > 0 ||
        this.onetWinRevealTimer > 0 ||
        this.jigsawWinRevealTimer > 0) &&
      !this.victoryClaimed
    ) {
      this.minesWinRevealTimer = 0;
      this.fishWinRevealTimer = 0;
      this.onetWinRevealTimer = 0;
      this.jigsawWinRevealTimer = 0;
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
        !this.minesEngine ||
        this.minesEngine.stage !== stage ||
        this.minesEngine.status === 'won' ||
        this.minesEngine.status === 'lost'
      ) {
        if ((forceRestart || pa.minesSession?.status === 'lost') && !rescueStage && pa.minesSession) {
          pa.minesSession = null;
          this.sim.saveToStorage();
        }
        const nextEngine = new MinesweeperEngine(stage);
        let restored = false;
        if (
          !forceRestart &&
          !rescueStage &&
          pa.minesSession &&
          pa.minesSession.stage === stage &&
          pa.minesSession.status !== 'lost'
        ) {
          restored = nextEngine.restoreSession(pa.minesSession);
        }
        this.minesEngine = nextEngine;
        if (restored && pa.minesSession) {
          this.companionCharge = Math.max(0, Math.round(pa.minesSession.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(pa.minesSession.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('caro', true);
          }
        }
      } else if (!rescueStage && pa.minesSession?.stage === stage) {
        this.companionCharge = Math.max(0, Math.round(pa.minesSession.companionCharge ?? 0));
        this.snackPieUsedThisAttempt = Boolean(pa.minesSession.snackPieUsed);
      }
    } else if (mode === 'chess') {
      const stage = rescueStage ?? pa.chessStage ?? 1;
      if (
        forceRestart ||
        !this.fishEngine ||
        this.fishEngine.stage !== stage ||
        this.fishEngine.status === 'won' ||
        this.fishEngine.status === 'lost'
      ) {
        const savedFish =
          !forceRestart &&
          !rescueStage &&
          pa.fishingSession?.stage === stage &&
          pa.fishingSession.status !== 'lost'
            ? pa.fishingSession
            : null;
        if ((forceRestart || pa.fishingSession?.status === 'lost') && !rescueStage && pa.fishingSession) {
          pa.fishingSession = null;
          this.sim.saveToStorage();
        }
        const nextEngine = new FishShooterEngine(stage);
        let restored = false;
        if (savedFish) {
          restored = nextEngine.restoreSession(savedFish);
        }
        this.fishEngine = nextEngine;
        if (restored && savedFish) {
          this.companionCharge = Math.max(0, Math.round(savedFish.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(savedFish.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('chess', true);
          }
        }
      } else if (!rescueStage && pa.fishingSession?.stage === stage) {
        this.companionCharge = Math.max(0, Math.round(pa.fishingSession.companionCharge ?? 0));
        this.snackPieUsedThisAttempt = Boolean(pa.fishingSession.snackPieUsed);
      }
    } else if (mode === 'jigsaw') {
      const stage = rescueStage ?? pa.jigsawStage ?? 1;
      if (
        forceRestart ||
        !this.jigsawEngine ||
        this.jigsawEngine.stage !== stage ||
        this.jigsawEngine.status === 'won'
      ) {
        if (forceRestart && !rescueStage && pa.jigsawSession) {
          pa.jigsawSession = null;
          this.sim.saveToStorage();
        }
        const nextEngine = new MasterJigsawEngine(stage);
        let restored = false;
        if (
          !forceRestart &&
          !rescueStage &&
          pa.jigsawSession &&
          pa.jigsawSession.stage === stage
        ) {
          restored = nextEngine.restoreSession(pa.jigsawSession);
        }
        this.jigsawEngine = nextEngine;
        this.jigsawBakeCache = null;
        this.jigsawTrayPage = 0;
        this.jigsawTrayScrollLeft = 0;
        this.jigsawFilterScrollLeft = 0;
        this.jigsawTrayCollapsed = false;
        if (restored && pa.jigsawSession) {
          this.companionCharge = Math.max(0, Math.round(pa.jigsawSession.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(pa.jigsawSession.snackPieUsed);
          this.lossStreakResetForStage = false;
        } else {
          this.resetStageSynergySession();
          if (!rescueStage) {
            this.persistModeSession('jigsaw', true);
          }
        }
      } else {
        if (this.jigsawBakeCache && this.jigsawBakeCache.stage !== stage) {
          this.jigsawBakeCache = null;
        }
        if (!rescueStage && pa.jigsawSession?.stage === stage) {
          this.companionCharge = Math.max(0, Math.round(pa.jigsawSession.companionCharge ?? 0));
          this.snackPieUsedThisAttempt = Boolean(pa.jigsawSession.snackPieUsed);
        }
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
    if (isProofOfPlayGameId(this.mode)) {
      const stg =
        this.mode === 'sudoku'
          ? (this.sudokuEngine?.stage ?? 1)
          : this.mode === 'blocks'
            ? (this.onetEngine?.stage ?? 1)
            : (this.jigsawEngine?.stage ?? 1);
      this.popRecorders.set(this.mode, new ProofOfPlayRecorder(this.mode, stg));
    }
  }

  private bumpCompanionCharge(actionHint = 0): void {
    const comp = this.sim.getActiveMinigameCompanion();
    this.companionCharge = Math.min(comp.chargeEveryMoves, this.companionCharge + 1);
    if (isProofOfPlayGameId(this.mode)) {
      let rec = this.popRecorders.get(this.mode);
      const stg =
        this.mode === 'sudoku'
          ? (this.sudokuEngine?.stage ?? 1)
          : this.mode === 'blocks'
            ? (this.onetEngine?.stage ?? 1)
            : (this.jigsawEngine?.stage ?? 1);
      if (!rec || rec.stage !== stg) {
        rec = new ProofOfPlayRecorder(this.mode, stg);
        this.popRecorders.set(this.mode, rec);
      }
      this.popActionSeq = (this.popActionSeq + 1) & 0xffff;
      rec.recordMove(((this.popActionSeq * 131) ^ (actionHint & 0xffff) ^ stg) & 0xffff);
      if (this.mode === 'jigsaw') {
        const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLElement | null;
        if (dlg) {
          if (!this.gpuFx) {
            this.gpuFx = new MinigameGpuFxBatcher(dlg);
          }
          const boardEl = dlg.querySelector('#paBoardCanvas') as HTMLElement | null;
          const rect = boardEl?.getBoundingClientRect();
          const cx = rect ? rect.left + rect.width * 0.5 : (window.innerWidth || 800) * 0.5;
          const cy = rect ? rect.top + rect.height * 0.5 : (window.innerHeight || 600) * 0.5;
          this.gpuFx.spawnStarburst(cx, cy, 24, 0, 0.95);
        }
      }
    }
  }

  private sealValidProofOfPlay(
    gameId: ProofOfPlayGameId,
    sessionScore: number
  ) {
    const rec = this.popRecorders.get(gameId);
    if (!rec || rec.recordedMoves < 1) return undefined;
    const sealed = rec.seal(sessionScore);
    return verifyProofOfPlayEnvelope(sealed, { expectedGameId: gameId }).ok ? sealed : undefined;
  }

  private checkAndClaimVictory(): void {
    if (this.victoryClaimed) return;
    const isWon =
      (this.mode === 'sudoku' && this.sudokuEngine?.status === 'won') ||
      (this.mode === 'caro' && this.minesEngine?.status === 'won') ||
      (this.mode === 'chess' && this.fishEngine?.status === 'won') ||
      (this.mode === 'blocks' && this.onetEngine?.status === 'won') ||
      (this.mode === 'jigsaw' && this.jigsawEngine?.status === 'won');
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
      const sudokuScore = Math.max(
        1200,
        2800 - this.sudokuEngine.mistakesCount * 220
      );
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'sudoku',
        this.sudokuEngine.reward,
        {
          sessionScore: sudokuScore,
          efficiency: this.sudokuEngine.mistakesCount,
          proofOfPlay: this.sealValidProofOfPlay('sudoku', sudokuScore),
        }
      );
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'caro' && this.minesEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.minesSession = null;
      this.clearActiveModalResumeMarker();
      this.victorySummary = this.sim.completePuzzleArcadeVictory('caro', this.minesEngine.reward, {
        sessionScore: Math.max(
          1200,
          2600 + this.minesEngine.totalMines * 25 - this.minesEngine.movesCount * 4
        ),
        efficiency: Math.max(1, this.minesEngine.movesCount),
      });
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'chess' && this.fishEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.fishingSession = null;
      this.clearActiveModalResumeMarker();
      this.victorySummary = this.sim.completePuzzleArcadeVictory('chess', this.fishEngine.reward, {
        sessionScore: Math.max(1200, this.fishEngine.score),
        efficiency: Math.max(1, this.fishEngine.maxCombo),
      });
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'blocks' && this.onetEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.sim.state.puzzleArcade.onetSession = null;
      this.clearActiveModalResumeMarker();
      const onetScore = Math.max(1200, this.onetEngine.score);
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'blocks',
        this.onetEngine.reward,
        {
          sessionScore: onetScore,
          efficiency: Math.max(1, this.onetEngine.maxCombo),
          proofOfPlay: this.sealValidProofOfPlay('blocks', onetScore),
        }
      );
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'jigsaw' && this.jigsawEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.cleanupJigsawTrayDrag();
      this.sim.state.puzzleArcade.jigsawSession = null;
      this.clearActiveModalResumeMarker();
      const jigsawScore = Math.max(1200, this.jigsawEngine.score);
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'jigsaw',
        this.jigsawEngine.reward,
        {
          sessionScore: jigsawScore,
          efficiency: Math.max(1, this.jigsawEngine.maxCombo),
          proofOfPlay: this.sealValidProofOfPlay('jigsaw', jigsawScore),
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

    const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    const modalInner = this.root.querySelector(
      '#puzzleArcadeDialog .pa-modal-inner'
    ) as HTMLElement | null;
    sharedMinigameViewport.applyDialogOrientation(dlg, modalInner, false);
    if (dlg?.dataset) {
      dlg.dataset.paActiveMode = this.mode;
    }
    modalInner?.classList.toggle('pa-great-hall-mode', this.mode === 'chess');
    modalInner?.classList.toggle('pa-potions-sudoku-mode', this.mode === 'sudoku');
    modalInner?.classList.toggle('pa-marauder-caro-mode', this.mode === 'caro');

    const modalTitle = this.root.querySelector('#puzzleArcadeDialogTitle') as HTMLElement | null;
    if (modalTitle) {
      if (this.isYuleSkinActive()) {
      this.ensureYuleArcadeAssetsLoaded();
    }

    if (this.mode === 'chess') {
        modalTitle.innerHTML =
          '<img src="/game/trang-trai-hang-soc/paintings/plimpy_icon.webp" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Bắn Cá Hồ Đen';
      } else if (this.mode === 'sudoku') {
        modalTitle.innerHTML =
          '<img src="/game/trang-trai-hang-soc/sprites/m3_piece_scroll.webp" alt="" style="width:26px;height:26px;object-fit:contain;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Số Học Huyền Bí';
      } else if (this.mode === 'caro') {
        modalTitle.innerHTML =
          '<img src="/game/trang-trai-hang-soc/paintings/caro/phoenix_seal.webp" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Dò Mìn Phép Thuật';
      } else if (this.mode === 'jigsaw') {
        modalTitle.innerHTML =
          '<img src="/game/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Tranh Ghép Phép Thuật';
      } else {
        modalTitle.innerHTML =
          '<img src="/game/trang-trai-hang-soc/sprites/beast_niffler.webp" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Sinh Vật Huyền Bí';
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
    const isScoredMode =
      this.mode === 'sudoku' || this.mode === 'blocks' || this.mode === 'jigsaw';
    const activeModeRank = isScoredMode ? this.sim.getPlayerMinigameRank(this.mode, 'valley') : 0;

    // the level bar (hpvn/levelBar.ts): stage number, one sub line, the figures; a loss sets `stageAlert` (+ the rescue action)
    let stageSub = '';
    let stageStats = '';
    let stageAlert: string | undefined;
    let stageAction = '';
    let canActiveTalisman = false;
    const rescueBtn = (can: boolean): string =>
      can ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman hs-lv-act">Bùa ×${talismanDisp}</button>` : '';
    const timeIcon = lvIcon('res_time_sand');
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
          <span>⚔️ <strong>CỨU MÀN ${this.rescueContext.stage}</strong> (${escapeHtml(this.rescueContext.neighborEmoji)} <strong class="hs-raw">${escapeHtml(this.rescueContext.neighborName)}</strong>) • <strong>+3 🍀 + 95 Sickle</strong></span>
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
      stageSub = escapeHtml(se.classicDifficultyVi);
      stageStats =
        lvStat('Đã điền', `<strong id="paSudokuFilled">${se.filledCount}/81</strong>`) +
        lvStat('Lỗi', `<strong id="paSudokuMistakes" class="${se.mistakesCount > 0 ? 'pa-err-inline' : ''}">${se.mistakesCount}/${se.maxMistakes}</strong>`, LV_MISTAKE);
      const canSudokuHint =
        se.status === 'playing' && (st.sandboxMode || se.freeHintsLeft + se.paidHintsLeft > 0);
      const talismanLocked = se.talismanUsed || usedTodayInMode;
      const canTalisman =
        (se.status === 'playing' || se.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      canActiveTalisman = canTalisman;
      const hintCostLbl = st.sandboxMode
        ? '∞'
        : se.freeHintsLeft > 0
          ? `${se.freeHintsLeft}`
          : se.paidHintsLeft > 0
            ? `${se.hintGoldCost} Sickle`
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
        stageAlert = `Sai ${se.mistakesCount}/${se.maxMistakes} · Hoàn Tác hoặc Xoá`;
        stageAction = rescueBtn(canTalisman);
      } else if (se.fullBoardMismatch) {
        stageAlert = `Kín 81/81 nhưng chưa đúng · ${se.mistakesCount}/${se.maxMistakes}`;
      }
    } else if (this.mode === 'caro' && this.minesEngine) {
      const me = this.minesEngine;
      stageSub = `${me.rows}×${me.cols} · Khiên ${st.sandboxMode ? '∞' : me.shieldsLeft}`;
      stageStats =
        lvStat('Mìn còn', `<strong id="paMinesLeft">${me.remainingMinesCount}</strong>`, lvIcon('m3_sp_bomb')) +
        lvStat('Đã mở', `<strong id="paMinesProgress">${me.revealedSafeCount}/${me.safeCellCount}</strong>`, lvIcon('m3_icon_star'));
      const canMinesHint =
        me.status === 'playing' && (st.sandboxMode || me.freeHintsLeft + me.paidHintsLeft > 0);
      const talismanLocked = me.talismanUsed || usedTodayInMode;
      const canTalisman =
        (me.status === 'playing' || me.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      canActiveTalisman = canTalisman;
      const hintLbl = st.sandboxMode
        ? '∞'
        : me.freeHintsLeft > 0
          ? `${me.freeHintsLeft}`
          : me.paidHintsLeft > 0
            ? `${me.hintGoldCost} Sickle`
            : '0';
      controlsHtml = `
        <button id="btnPaMinesFlag" type="button" class="pa-tool-btn ${me.flagMode ? 'active' : ''}" aria-pressed="${me.flagMode}" ${me.status !== 'playing' ? 'disabled' : ''} title="Bật/tắt Ấn Sáp Phượng Hoàng cắm cờ phong ấn bẫy (F)"><span class="pa-ico"><img class="hs-ico" src="/game/trang-trai-hang-soc/paintings/caro/phoenix_seal.webp" alt="" aria-hidden="true" draggable="false"></span>Cắm Cờ${me.flagMode ? ' ✓' : ''}</button>
        <button id="btnPaMinesHint" type="button" class="pa-tool-btn gold" ${!canMinesHint ? 'disabled' : ''} title="Dò và mở an toàn 1 ô trên Bản Đồ Đạo Tặc (H)">
          🪄 Dò An Toàn <span class="pa-cost-pill">${hintLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (me.status === 'lost') {
        const minesRev = me.getTurningPointReview();
        stageAlert = 'Chạm mìn nổ';
        stageAction = rescueBtn(canTalisman);
        if (minesRev) statusBannerHtml += `<div class="pa-alert-strip">${this.renderTurningPointCardHtml(minesRev)}</div>`;
      }
    } else if (this.mode === 'chess' && this.fishEngine) {
      const fe = this.fishEngine;
      stageSub = `<span id="paFishSub">Đũa ×${fe.cannonTier} · Combo ×${Math.max(1, fe.combo)}</span>`;
      stageStats =
        lvStat('Thời gian', `<strong id="paFishTimer" class="${!st.sandboxMode && fe.isTimeCritical ? 'pa-err-inline' : ''}">${st.sandboxMode ? '∞' : fe.formatRemainingTime()}</strong>`, timeIcon) +
        lvStat('Điểm', `<strong id="paFishScore">${fe.score.toLocaleString('vi-VN')}/${fe.targetScore.toLocaleString('vi-VN')}</strong>`, lvIcon('m3_icon_star')) +
        lvStat('Đạn ngọc', `<strong id="paFishAmmo" class="${!st.sandboxMode && fe.ammo <= 5 ? 'pa-err-inline' : ''}">${st.sandboxMode ? '∞' : fe.ammo}</strong>`, lvIcon('m3_gem_sapphire'));
      const canFishSkill =
        fe.status === 'playing' && (st.sandboxMode || fe.freeSkillsLeft + fe.paidSkillsLeft > 0);
      const talismanLocked = fe.talismanUsed || usedTodayInMode;
      const canTalisman =
        (fe.status === 'playing' || fe.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      canActiveTalisman = canTalisman;
      const skillLbl = st.sandboxMode
        ? '∞'
        : fe.freeSkillsLeft > 0
          ? `${fe.freeSkillsLeft}`
          : fe.paidSkillsLeft > 0
            ? `${fe.skillGoldCost} Sickle`
            : '0';
      controlsHtml = `
        <button id="btnPaFishPower" type="button" class="pa-tool-btn ${fe.cannonTier > 1 ? 'active' : ''}" ${fe.status !== 'playing' ? 'disabled' : ''} title="Đổi bậc Đũa Phép ×1 / ×2 / ×3 (C)"><span class="pa-ico"><img class="hs-ico" src="/game/trang-trai-hang-soc/sprites/ui_icon_hammer_wand.webp" alt="" aria-hidden="true" draggable="false"></span>Đũa Phép <span class="pa-cost-pill">×${fe.cannonTier}</span></button>
        <button id="btnPaFishSkill" type="button" class="pa-tool-btn gold" ${!canFishSkill ? 'disabled' : ''} title="Băng Phong Glacius đóng băng toàn Hồ Đen (H)"><span class="pa-ico"><img class="hs-ico" src="/game/trang-trai-hang-soc/sprites/m3_obs_ice.webp" alt="" aria-hidden="true" draggable="false"></span>Băng Phong <span class="pa-cost-pill">${skillLbl}</span></button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (fe.status === 'lost') {
        const fishRev = fe.getTurningPointReview();
        stageAlert = `Hết giờ · ${fe.score.toLocaleString('vi-VN')}/${fe.targetScore.toLocaleString('vi-VN')} điểm`;
        stageAction = rescueBtn(canTalisman);
        if (fishRev) statusBannerHtml += `<div class="pa-alert-strip">${this.renderTurningPointCardHtml(fishRev)}</div>`;
      }
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const oe = this.onetEngine;
      // the shift direction is the board's rule: it tags the sub line (a fourth cell does not fit 360px beside «Màn 150/777»)
      stageSub = `${oe.rows}×${oe.cols} · <span class="hs-lv-tag">${escapeHtml(oe.shiftBadgeVi)}</span>`;
      stageStats =
        lvStat('Thời gian', `<strong id="paOnetTimer" class="${!st.sandboxMode && oe.isTimeCritical ? 'pa-err-inline' : ''}">${st.sandboxMode ? '∞' : oe.formatRemainingTime()}</strong>`, timeIcon) +
        lvStat('Lượt đổi', `<strong id="paOnetLives" class="${!st.sandboxMode && oe.lives <= 2 ? 'pa-err-inline' : ''}">${st.sandboxMode ? '∞' : oe.lives}</strong>`, lvIcon('m3_icon_heart')) +
        lvStat('Cặp đã nối', `<strong id="paOnetProgress">${oe.matchedPairs}/${oe.totalPairs}</strong>`, lvIcon('ui_icon_jigsaw'));
      const canHint =
        oe.status === 'playing' && (st.sandboxMode || oe.freeHintsLeft + oe.paidHintsLeft > 0);
      const canShuffle =
        (oe.status === 'playing' || (oe.status === 'lost' && oe.lossReason !== 'timeout')) &&
        (st.sandboxMode || oe.lives + oe.paidShufflesLeft > 0);
      const talismanLocked = oe.talismanUsed || usedTodayInMode;
      const canTalisman =
        (oe.status === 'playing' || oe.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      canActiveTalisman = canTalisman;
      const hintCostLbl = st.sandboxMode
        ? '∞'
        : oe.freeHintsLeft > 0
          ? `${oe.freeHintsLeft}`
          : oe.paidHintsLeft > 0
            ? `${oe.hintGoldCost} Sickle`
            : '0';
      const shuffleCostLbl = st.sandboxMode
        ? '❤️∞'
        : oe.lives > 0
          ? `❤️${oe.lives}`
          : oe.paidShufflesLeft > 0
            ? `${oe.shuffleGoldCost} Sickle`
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
        stageAlert = oe.lossReason === 'timeout' ? `Hết giờ · còn ${oe.remainingPairs} cặp` : 'Hết đường nối';
        stageAction = rescueBtn(canTalisman);
      }
    } else if (this.mode === 'jigsaw' && this.jigsawEngine) {
      const je = this.jigsawEngine;
      stageSub = `${je.rows}×${je.cols} · ${escapeHtml(je.artwork.titleVi)}`;
      stageStats =
        lvStat('Thời gian', `<strong id="paJigsawTimer" class="${!st.sandboxMode && je.isTimeCritical ? 'pa-err-inline' : ''}">${st.sandboxMode ? '∞' : je.formatRemainingTime()}</strong>`, timeIcon) +
        lvStat('Mảnh đã ghép', `<strong id="paJigsawProgress">${je.lockedCount.toLocaleString('vi-VN')}/${je.totalPieces.toLocaleString('vi-VN')}</strong>`, lvIcon('ui_icon_jigsaw'));
      const canHint =
        je.status === 'playing' && (st.sandboxMode || je.freeHintsLeft + je.paidHintsLeft > 0);
      const talismanLocked = je.talismanUsed || usedTodayInMode;
      const canTalisman =
        (je.status === 'playing' || je.status === 'lost') &&
        !talismanLocked &&
        (st.sandboxMode || talismanQty > 0);
      canActiveTalisman = canTalisman;
      const hintCostLbl = st.sandboxMode
        ? '∞'
        : je.freeHintsLeft > 0
          ? `${je.freeHintsLeft}`
          : je.paidHintsLeft > 0
            ? `${je.hintGoldCost} Sickle`
            : '0';
      controlsHtml = `
        <button id="btnPaJigsawPreview" type="button" class="pa-tool-btn ${je.showGhostPreview ? 'active' : ''}" aria-pressed="${je.showGhostPreview}" ${je.status !== 'playing' ? 'disabled' : ''} title="Bật/tắt ảnh mẫu mờ trên khung tranh (P)">
          👁️ Mẫu${je.showGhostPreview ? ' ✓' : ''}
        </button>
        <button id="btnPaJigsawHint" type="button" class="pa-tool-btn gold" ${!canHint ? 'disabled' : ''} title="Tự khớp chuẩn mảnh tranh vào khung (H)">
          💡 Gợi Ý <span class="pa-cost-pill">${hintCostLbl}</span>
        </button>
        <button id="btnPaJigsawTidy" type="button" class="pa-tool-btn" ${je.status !== 'playing' ? 'disabled' : ''} title="Thu gọn các mảnh đơn lẻ trên mặt bàn về khay (T)">
          🧹 Gọn Bàn
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${talismanTooltip}">
          🔥 Bùa <span class="pa-cost-pill">${talismanLocked ? '✓ 1/1' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Ván Mới
        </button>
      `;
      if (je.status === 'lost') {
        const jigRev = je.getTurningPointReview();
        stageAlert = `Hết giờ · còn ${je.remainingPieces.toLocaleString('vi-VN')} mảnh`;
        stageAction = rescueBtn(canTalisman);
        if (jigRev) statusBannerHtml += `<div class="pa-alert-strip">${this.renderTurningPointCardHtml(jigRev)}</div>`;
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
              Cứu <span class="hs-raw">${escapeHtml(this.rescueContext.neighborName)}</span> · Xong
            </div>
            <div class="m3-reward-badges">
              <span class="m3-reward-chip star">+${rv.tokensEarned} Huy hiệu</span>
              <span class="m3-reward-chip">+${rv.goldEarned} Sickle</span>
              <span class="m3-reward-chip">+${rv.xpEarned} XP</span>
              ${
                rv.buildReduction && rv.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">Xây −${formatDurationCompactVi(rv.buildReduction.reducedSec)}</span>`
                  : ''
              }
            </div>
            <div class="pa-victory-actions">
              <button id="btnPaBackToPark" type="button" class="brass-btn gold-cta">Về vườn</button>
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
            <span>${escapeHtml(winReview.playedCoordVi)} → <strong>${escapeHtml(winReview.recommendedCoordVi)}</strong></span>
            <div class="pa-inspect-return-actions">
              <button id="btnPaReturnVictoryCard" type="button" class="brass-btn gold-cta">Bảng thưởng</button>
              <button id="btnPaNextStage" type="button" class="brass-btn">Màn ${vs.nextStage}</button>
            </div>
          </div>
        `;
      } else {
        victoryOverlayHtml = `
          <div class="pa-victory-overlay" role="region" aria-label="Hoàn thành màn giải đố">
            <div class="pa-victory-card">
              <div class="pa-victory-title">${
                vs.isMasterReplay || curInfo.isMaxed
                  ? `777/777 · Xong`
                  : `Màn ${activeStageNum} · Xong`
              }</div>
              <div class="m3-reward-badges">
                ${
                  vs.starsEarned > 0
                    ? `<span class="m3-reward-chip star">+${vs.starsEarned} ★</span>`
                    : `<span class="m3-reward-chip star">777/777</span>`
                }
                ${vs.goldEarned > 0 ? `<span class="m3-reward-chip">+${vs.goldEarned} Sickle</span>` : ''} <!-- HPVN: Sickle reward -->
                ${
                  this.mode === 'jigsaw' && this.jigsawEngine
                    ? `<span class="m3-reward-chip pa-victory-art">${escapeHtml(this.jigsawEngine.artwork.titleVi)}</span>`
                    : ''
                }
              </div>
              ${winReview ? this.renderTurningPointCardHtml(winReview, true) : ''}
              <div class="pa-victory-actions">
                <button id="btnPaNextStage" type="button" class="brass-btn gold-cta">
                  ${vs.isMasterReplay || curInfo.isMaxed ? `Chơi lại` : `Màn ${vs.nextStage}`}
                </button>
                ${
                  isScoredMode
                    ? `<button id="btnPaVictoryLeaderboard" type="button" class="brass-btn">Hạng ${activeModeRank}</button>`
                    : ''
                }
                <button id="btnPaBackToPark" type="button" class="brass-btn">Về vườn · ${st.sandboxMode ? '∞' : st.match3.stars} ★</button>
                ${winReview?.highlightCells.length ? '<button id="btnPaVictoryReviewInspect" type="button" class="brass-btn">Soi bàn</button>' : ''}
              </div>
            </div>
          </div>
        `;
      }
    }

    const trialBadgeFor = (kind: PuzzleArcadeMode | 'match3'): string => {
      if (!reqTrial || st.sandboxMode || this.sim.isHeadmasterPreview) return '';
      if (reqTrial.kind !== kind) return '';
      return `<span class="pa-tab-trial" role="img" aria-label="Môn Đề Cử"></span>`; // HPVN: a red dot; the stage line names it
    };

    const fmtTabLv = (kind: PuzzleArcadeMode | 'match3'): string => {
      const inf = this.sim.getDisciplineStageInfo(kind);
      return inf.isMaxed ? `👑${inf.maxStage}` : `${inf.currentStage}/${inf.maxStage}`;
    };

    const isFailedNow =
      (this.mode === 'sudoku' && this.sudokuEngine?.status === 'lost') ||
      (this.mode === 'blocks' && this.onetEngine?.status === 'lost') ||
      (this.mode === 'jigsaw' && this.jigsawEngine?.status === 'lost') ||
      (this.mode === 'caro' && this.minesEngine?.status === 'lost') ||
      (this.mode === 'chess' && this.fishEngine?.status === 'lost');
    if (isFailedNow && !this.lossStreakResetForStage && !this.rescueContext) {
      this.lossStreakResetForStage = true;
      this.sim.resetExamWinStreak();
    }
    if (isFailedNow && !this.victorySummary && !this.rescueVictoryOutcome && !inspectReturnBarHtml) {
      inspectReturnBarHtml = `
        <div class="pa-inspect-return-bar pa-loss-return-bar" role="region" aria-label="Kết thúc lượt chơi">
          <span>${escapeHtml(stageAlert ?? 'Chưa qua màn')} · Màn ${activeStageNum}</span>
          <div class="pa-inspect-return-actions">
            ${canActiveTalisman ? `<button id="btnPaLossTalisman" type="button" class="brass-btn">Bùa ×${talismanDisp}</button>` : ''}
            <button id="btnPaLossRetry" type="button" class="brass-btn gold-cta">Chơi Lại</button>
            <button id="btnPaLossHome" type="button" class="brass-btn">Về vườn</button>
          </div>
        </div>
      `;
    }

    const pieQty = this.sim.getFarmItemCount('cinnamon_apple_pie');
    const paSynergyDockHtml = `
      <div class="aaa-synergy-dock" role="region" aria-label="Bánh Táo Quế tiếp sức">
        <button
          id="btnPaSnackApplePie"
          type="button"
          class="aaa-snack-btn"
          ${this.snackPieUsedThisAttempt || this.victoryClaimed || (!st.sandboxMode && pieQty <= 0) ? 'disabled' : ''}
          title="Dùng 1 Bánh Táo Quế từ Kho Đỏ (Xoá 1 lỗi / +1 Lùi hoặc Đảo + 1 Gợi Ý)"
        >
          <img src="/game/trang-trai-hang-soc/sprites/ui_icon_pie_ready.webp" alt="" width="20" height="20" class="aaa-synergy-sprite" />
          <span><span class="aaa-lbl-full">Bánh Táo </span><strong>${this.snackPieUsedThisAttempt ? '✓' : st.sandboxMode ? '∞' : `×${pieQty}`}</strong></span>
        </button>
      </div>
    `;

    // HPVN: portrait = pie and companion join the tool row under the board, so the board gets their row; desktop (≥980px)
    // too, so the dock keeps room for the game list (main.css «desktop minigame frame»)
    const synergyInControls =
      (this.root.querySelector('#puzzleArcadeDialog') as HTMLElement | null)?.dataset?.mgLayout === 'portrait' ||
      globalThis.matchMedia?.('(min-width: 980px)').matches ||
      globalThis.matchMedia?.('(max-height: 450px) and (orientation: landscape)').matches;

    if (this.mode === 'jigsaw') {
      this.captureJigsawTrayScrollState();
    }

    box.innerHTML = `
      <div class="pa-layout-shell" data-pa-active-mode="${this.mode}">
        <aside class="pa-side-dock" aria-label="Bảng chọn trò chơi và công cụ">
          <div class="pa-top-bar">
            <div class="pa-dock-head-row">
              <div class="pa-currencies">
                <span class="m3-res-chip" title="Sao Phép Thuật">
                  <img src="/game/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="Sao" class="m3-res-icon" />
                  <strong id="paStarsText">${st.sandboxMode ? '∞' : compactSickle(st.match3.stars)}</strong>
                </span>
                <span class="m3-res-chip" title="Cát Xoay Thời Gian">
                  <img src="/game/trang-trai-hang-soc/sprites/res_time_sand.webp" alt="" class="m3-res-icon" />
                  <strong id="paSandText">${st.sandboxMode ? '∞' : st.timeSand}</strong>
                </span>
                <span class="m3-res-chip" title="Sickle">
                  <span class="g-coin" style="font-size:11px;">S</span>
                  <strong id="paGoldText">${st.sandboxMode ? '∞' : compactSickle(st.galleons)}</strong>
                </span>
                <span class="m3-res-chip" title="Bùa Phượng Hoàng">
                  <img src="/game/trang-trai-hang-soc/sprites/beast_phoenix.webp" alt="" class="m3-res-icon" /><!-- HPVN: no emoji -->
                  <strong id="paTalismanText">${talismanDisp}</strong>
                </span>
                <button id="btnPaToggleYuleSkin" type="button" class="m3-res-chip yule-skin-toggle-pill ${this.isYuleSkinActive() ? 'is-yule-active' : ''}" aria-pressed="${this.isYuleSkinActive()}" title="Bật/Tắt giao diện Giáng Sinh">
                  <span>Noel</span>
                </button>
              </div>
              <button id="btnPaOpenLeaderboard" type="button" class="minigame-lb-chip" title="${isScoredMode ? 'Bảng Xếp Hạng môn này' : 'Bảng Xếp Hạng 4 Môn Tính Điểm (Bùa Gặt • Số Học • Sinh Vật • Tranh Ghép)'}">
                <img src="/game/trang-trai-hang-soc/sprites/ui_trophy_cup.webp" alt="" class="m3-res-icon" />
                <strong id="paRankText">${isScoredMode ? `#${compactSickle(activeModeRank)}` : '4 Môn'}</strong>
              </button>
              <form method="dialog" class="pa-inline-close-form">
                <button type="submit" value="close" class="brass-btn pa-inline-close-btn" title="Về Trang Trại (Esc)" aria-label="Về Trang Trại"><img src="/game/trang-trai-hang-soc/sprites/burrow_house_canon.webp" alt="" class="m3-res-icon pa-close-home-ico" aria-hidden="true" /><span class="pa-close-home-lbl">Về vườn</span></button>
              </form>
            </div>

            <div class="pa-mode-tabs" role="tablist"${globalThis.matchMedia?.('(min-width: 980px)').matches ? ' aria-orientation="vertical"' : ''} aria-label="Chọn môn khảo thí phép thuật Hogwarts" ${this.rescueContext ? 'style="opacity:0.65;pointer-events:none;"' : ''}>
              <button type="button" role="tab" aria-selected="${this.mode === 'caro'}" data-pa-mode="caro" class="pa-mode-tab ${this.mode === 'caro' ? 'active' : ''}" title="Dò Mìn Phép Thuật">
                <span class="pa-tab-name"><span class="pa-tab-name-full">Dò Mìn Phép Thuật</span><span class="pa-tab-name-short"><span class="pa-tab-ico"></span> Dò Mìn</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('caro')}</span>${trialBadgeFor('caro')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'sudoku'}" data-pa-mode="sudoku" class="pa-mode-tab ${this.mode === 'sudoku' ? 'active' : ''}" title="Số Học Huyền Bí">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🔢 Số Học Huyền Bí</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🔢</span> Số Học</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('sudoku')}</span>${trialBadgeFor('sudoku')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'chess'}" data-pa-mode="chess" class="pa-mode-tab ${this.mode === 'chess' ? 'active' : ''}" title="Bắn Cá Hồ Đen">
                <span class="pa-tab-name"><span class="pa-tab-name-full">Bắn Cá Hồ Đen</span><span class="pa-tab-name-short"><span class="pa-tab-ico"></span> Bắn Cá</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('chess')}</span>${trialBadgeFor('chess')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'blocks'}" data-pa-mode="blocks" class="pa-mode-tab ${this.mode === 'blocks' ? 'active' : ''}" title="Sinh Vật Huyền Bí">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🦄 Sinh Vật Huyền Bí</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🦄</span> Sinh Vật</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('blocks')}</span>${trialBadgeFor('blocks')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'jigsaw'}" data-pa-mode="jigsaw" class="pa-mode-tab ${this.mode === 'jigsaw' ? 'active' : ''}" title="Tranh Ghép Phép Thuật">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🧩 Tranh Ghép Phép Thuật</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🧩</span> Tranh Ghép</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('jigsaw')}</span>${trialBadgeFor('jigsaw')}</span>
              </button>
              <button id="btnPaGoMatch3" type="button" role="tab" aria-selected="false" class="pa-mode-tab" title="Bùa Gặt Honeydukes">
                <span class="pa-tab-name"><span class="pa-tab-name-full">🍬 Bùa Gặt Honeydukes</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🍬</span> Bùa Gặt</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('match3')}</span>${trialBadgeFor('match3')}</span>
              </button>
            </div>
          </div>

          ${levelBarHtml({
            stage: `Màn ${activeStageNum}/${MAX_MINIGAME_STAGE}`,
            sub: `${trialBadgeFor(this.mode) ? 'Đề cử · ' : ''}${stageSub}`,
            stats: stageStats,
            alert: stageAlert,
            action: stageAction,
          })}

          ${statusBannerHtml}
          ${synergyInControls ? '' : paSynergyDockHtml}
        </aside>

        <div class="pa-stage-viewport ${this.mode === 'jigsaw' ? 'pa-jigsaw-stage-viewport' : ''}">
          <div class="mg-stage-pan-area">
            <div class="pa-canvas-shell" data-pa-board-mode="${this.mode}">
              <canvas id="paBoardCanvas" width="${this.getVirtualCanvasSize().w}" height="${this.getVirtualCanvasSize().h}" aria-label="Bàn chơi Đại Sảnh Khảo Thí Phép Thuật"></canvas>
              ${inspectReturnBarHtml}
            </div>
          </div>
          ${this.mode === 'jigsaw' ? '<div id="paJigsawTrayDock" class="pa-jigsaw-tray-dock" role="region" aria-label="Khay mảnh ghép thông minh"></div>' : ''}
        </div>

        <div class="pa-controls-bar">
          ${controlsHtml}
          ${synergyInControls ? paSynergyDockHtml : ''}
        </div>
        ${victoryOverlayHtml}
      </div>
    `;

    liftToolIcons(box);
    this.bindDOMControls(box);
    this.mountCanvas(box);
  }

  private updateLiveCountersOnly(): void {
    const box = this.root.querySelector('#puzzleArcadeDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = this.sim.state;
    const starsEl = box.querySelector('#paStarsText');
    if (starsEl) starsEl.textContent = st.sandboxMode ? '∞' : compactSickle(st.match3.stars);
    const sandEl = box.querySelector('#paSandText');
    if (sandEl) sandEl.textContent = st.sandboxMode ? '∞' : String(st.timeSand);
    const goldEl = box.querySelector('#paGoldText');
    if (goldEl) goldEl.textContent = st.sandboxMode ? '∞' : compactSickle(st.galleons);
    const talEl = box.querySelector('#paTalismanText');
    if (talEl) talEl.textContent = st.sandboxMode ? '∞' : String(this.sim.getPhoenixTalismanCount());

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      const se = this.sudokuEngine;
      const filledEl = box.querySelector('#paSudokuFilled');
      if (filledEl) {
        filledEl.textContent = `${se.filledCount}/81`;
      }
      const mistEl = box.querySelector('#paSudokuMistakes');
      if (mistEl) {
        mistEl.textContent = `${se.mistakesCount}/${se.maxMistakes}`;
        mistEl.classList.toggle('pa-err-inline', se.mistakesCount > 0);
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
                ? `${se.hintGoldCost} Sickle`
                : '0';
        }
      }
    } else if (this.mode === 'caro' && this.minesEngine) {
      const me = this.minesEngine;
      const leftEl = box.querySelector('#paMinesLeft');
      if (leftEl) {
        leftEl.textContent = String(me.remainingMinesCount);
      }
      const progEl = box.querySelector('#paMinesProgress');
      if (progEl) {
        progEl.textContent = `${me.revealedSafeCount}/${me.safeCellCount}`;
      }
      const flagBtn = box.querySelector('#btnPaMinesFlag') as HTMLButtonElement | null;
      if (flagBtn) {
        flagBtn.disabled = me.status !== 'playing';
        flagBtn.classList.toggle('active', me.flagMode);
        flagBtn.setAttribute('aria-pressed', String(me.flagMode));
      }
      const hintBtn = box.querySelector('#btnPaMinesHint') as HTMLButtonElement | null;
      if (hintBtn) {
        hintBtn.disabled =
          me.status !== 'playing' || (!st.sandboxMode && me.freeHintsLeft + me.paidHintsLeft <= 0);
        const pill = hintBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '∞'
            : me.freeHintsLeft > 0
              ? String(me.freeHintsLeft)
              : me.paidHintsLeft > 0
                ? `${me.hintGoldCost} Sickle`
                : '0';
        }
      }
    } else if (this.mode === 'chess' && this.fishEngine) {
      const fe = this.fishEngine;
      const subEl = box.querySelector('#paFishSub');
      if (subEl) {
        subEl.textContent = `Đũa ×${fe.cannonTier} · Combo ×${Math.max(1, fe.combo)}`;
      }
      const timerEl = box.querySelector('#paFishTimer');
      if (timerEl) {
        timerEl.textContent = st.sandboxMode ? '∞' : fe.formatRemainingTime();
        timerEl.classList.toggle('pa-err-inline', !st.sandboxMode && fe.isTimeCritical);
      }
      const scoreEl = box.querySelector('#paFishScore');
      if (scoreEl) {
        scoreEl.textContent = `${fe.score.toLocaleString('vi-VN')}/${fe.targetScore.toLocaleString('vi-VN')}`;
      }
      const ammoEl = box.querySelector('#paFishAmmo');
      if (ammoEl) {
        ammoEl.textContent = st.sandboxMode ? '∞' : String(fe.ammo);
        ammoEl.classList.toggle('pa-err-inline', !st.sandboxMode && fe.ammo <= 5);
      }
      const powerBtn = box.querySelector('#btnPaFishPower') as HTMLButtonElement | null;
      if (powerBtn) {
        powerBtn.disabled = fe.status !== 'playing';
        powerBtn.classList.toggle('active', fe.cannonTier > 1);
        const pill = powerBtn.querySelector('.pa-cost-pill');
        if (pill) pill.textContent = `×${fe.cannonTier}`;
      }
      const skillBtn = box.querySelector('#btnPaFishSkill') as HTMLButtonElement | null;
      if (skillBtn) {
        skillBtn.disabled =
          fe.status !== 'playing' || (!st.sandboxMode && fe.freeSkillsLeft + fe.paidSkillsLeft <= 0);
        const pill = skillBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '∞'
            : fe.freeSkillsLeft > 0
              ? String(fe.freeSkillsLeft)
              : fe.paidSkillsLeft > 0
                ? `${fe.skillGoldCost} Sickle`
                : '0';
        }
      }
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const oe = this.onetEngine;
      const timerEl = box.querySelector('#paOnetTimer');
      if (timerEl) {
        timerEl.textContent = st.sandboxMode ? '∞' : oe.formatRemainingTime();
        timerEl.classList.toggle('pa-err-inline', !st.sandboxMode && oe.isTimeCritical);
      }
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
                ? `${oe.hintGoldCost} Sickle`
                : '0';
        }
      }
      const shufBtn = box.querySelector('#btnPaOnetShuffle') as HTMLButtonElement | null;
      if (shufBtn) {
        const canShuf =
          (oe.status === 'playing' || (oe.status === 'lost' && oe.lossReason !== 'timeout')) &&
          (st.sandboxMode || oe.lives + oe.paidShufflesLeft > 0);
        shufBtn.disabled = !canShuf;
        const pill = shufBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '❤️∞'
            : oe.lives > 0
              ? `❤️${oe.lives}`
              : oe.paidShufflesLeft > 0
                ? `${oe.shuffleGoldCost} Sickle`
                : '0';
        }
      }
    } else if (this.mode === 'jigsaw' && this.jigsawEngine) {
      const je = this.jigsawEngine;
      const timerEl = box.querySelector('#paJigsawTimer');
      if (timerEl) {
        timerEl.textContent = st.sandboxMode ? '∞' : je.formatRemainingTime();
        timerEl.classList.toggle('pa-err-inline', !st.sandboxMode && je.isTimeCritical);
      }
      const prog = box.querySelector('#paJigsawProgress');
      if (prog) {
        prog.textContent = `${je.lockedCount.toLocaleString('vi-VN')}/${je.totalPieces.toLocaleString('vi-VN')}`;
      }
      const hintBtn = box.querySelector('#btnPaJigsawHint') as HTMLButtonElement | null;
      if (hintBtn) {
        const canHint =
          je.status === 'playing' && (st.sandboxMode || je.freeHintsLeft + je.paidHintsLeft > 0);
        hintBtn.disabled = !canHint;
        const pill = hintBtn.querySelector('.pa-cost-pill');
        if (pill) {
          pill.textContent = st.sandboxMode
            ? '∞'
            : je.freeHintsLeft > 0
              ? String(je.freeHintsLeft)
              : je.paidHintsLeft > 0
                ? `${je.hintGoldCost} Sickle`
                : '0';
        }
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

    box.querySelector('#btnPaToggleYuleSkin')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      const active = this.sim.toggleYuleVisualTheme();
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.yuleTheme = active ? 'true' : 'false';
      }
      if (active) {
        this.ensureYuleArcadeAssetsLoaded();
      }
      this.forceImmediateRedraw = true;
      this.onParentRefresh();
      this.renderDOM();
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

    // Minesweeper ("Dò Mìn Phép Thuật") controls
    box.querySelector('#btnPaMinesFlag')?.addEventListener('click', () => {
      const me = this.minesEngine;
      if (!me || me.status !== 'playing') return;
      me.flagMode = !me.flagMode;
      this.persistModeSession('caro', true);
      this.sim.audio.playClick();
      this.renderDOM();
    });

    box.querySelector('#btnPaMinesHint')?.addEventListener('click', () => {
      const me = this.minesEngine;
      if (!me || me.status !== 'playing') return;
      if (!this.sim.state.sandboxMode && me.freeHintsLeft <= 0 && me.paidHintsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Dò An Toàn!', '💡');
        return;
      }
      if (me.freeHintsLeft > 0) {
        me.freeHintsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(me.hintGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          me.paidHintsLeft = Math.max(0, me.paidHintsLeft - 1);
        }
      }
      const res = me.useSafeRadarHint();
      if (res.ok) {
        this.bumpCompanionCharge();
        const m = this.computeMinesBoardMetrics(me);
        for (const p of res.revealedCells.slice(0, 10)) {
          const dc = m.transposed ? p.r : p.c;
          const dr = m.transposed ? p.c : p.r;
          const cx = m.originX + (dc + 0.5) * m.cellSize;
          const cy = m.originY + (dr + 0.5) * m.cellSize;
          this.spawnBurst(cx, cy, '#34d399', 9);
        }
        this.sim.audio.playMatchPop(2);
        this.onParentRefresh();
        if (res.won) {
          this.minesWinRevealTimer = 0.42;
          this.updateLiveCountersOnly();
        } else {
          this.persistModeSession('caro', true);
          this.renderDOM();
        }
      }
    });

    // Fish Shooter ("Bắn Cá Hồ Đen") controls
    box.querySelector('#btnPaFishPower')?.addEventListener('click', () => {
      const fe = this.fishEngine;
      if (!fe || fe.status !== 'playing') return;
      fe.cycleCannonTier();
      this.persistModeSession('chess', false);
      this.sim.audio.playClick();
      this.updateLiveCountersOnly();
      this.forceImmediateRedraw = true;
    });

    box.querySelector('#btnPaFishSkill')?.addEventListener('click', () => {
      const fe = this.fishEngine;
      if (!fe || fe.status !== 'playing') return;
      if (!this.sim.state.sandboxMode && fe.freeSkillsLeft <= 0 && fe.paidSkillsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Băng Phong!', '💡');
        return;
      }
      if (fe.freeSkillsLeft > 0) {
        fe.freeSkillsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(fe.skillGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          fe.paidSkillsLeft = Math.max(0, fe.paidSkillsLeft - 1);
        }
      }
      const res = fe.useFrostShockwaveSkill();
      if (res.ok) {
        this.bumpCompanionCharge();
        const virt = this.getVirtualCanvasSize();
        this.spawnBurst(virt.w * 0.5, virt.h * 0.45, '#67e8f9', 26);
        this.sim.audio.playPowerupBlast();
        this.showToast('🌟 Băng Phong Hồ Đen: làm chậm toàn đàn cá & +8 Đạn Ngọc!', '✨');
        this.onParentRefresh();
        if (res.won) {
          this.fishWinRevealTimer = 0.42;
          this.updateLiveCountersOnly();
        } else {
          this.persistModeSession('chess', true);
          this.renderDOM();
        }
      }
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

    box.querySelector('#btnPaLossHome')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      dlg?.close();
    });

    const handleRestartStage = () => {
      this.resetInteractionState();
      this.ensureEngineForMode(this.mode, true);
      this.sim.audio.playClick();
      this.renderDOM();
    };
    box.querySelector('#btnPaRestart')?.addEventListener('click', handleRestartStage);
    box.querySelector('#btnPaLossRetry')?.addEventListener('click', handleRestartStage);

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
      if (
        !oe ||
        (oe.status !== 'playing' && !(oe.status === 'lost' && oe.lossReason !== 'timeout'))
      ) {
        return;
      }
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

    // Phoenix Talisman (strictly 1 use per game per day — max 6 uses/day across all 6 games, never resets until next day)
    // Jigsaw Puzzle ("Tranh Ghép Phép Thuật") controls
    box.querySelector('#btnPaJigsawPreview')?.addEventListener('click', () => {
      if (!this.jigsawEngine || this.jigsawEngine.status !== 'playing') return;
      this.jigsawEngine.showGhostPreview = !this.jigsawEngine.showGhostPreview;
      this.forceImmediateRedraw = true;
      this.sim.audio.playClick();
      const btn = box.querySelector('#btnPaJigsawPreview') as HTMLButtonElement | null;
      if (btn) {
        btn.classList.toggle('active', this.jigsawEngine.showGhostPreview);
        btn.setAttribute('aria-pressed', String(this.jigsawEngine.showGhostPreview));
        btn.textContent = `👁️ Mẫu${this.jigsawEngine.showGhostPreview ? ' ✓' : ''}`;
      }
      this.drawFrame();
    });

    box.querySelector('#btnPaJigsawTidy')?.addEventListener('click', () => {
      if (!this.jigsawEngine || this.jigsawEngine.status !== 'playing') return;
      const moved = this.jigsawEngine.tidyLooseSinglePieces();
      this.sim.audio.playClick();
      if (moved > 0) {
        const wasCollapsed = this.jigsawTrayCollapsed;
        if (wasCollapsed && this.jigsawEngine.getBoardClustersSortedByZ(true).length === 0) {
          this.jigsawTrayCollapsed = false;
        }
        this.jigsawActiveBoardPiece = null;
        this.persistModeSession('jigsaw', true);
        this.renderJigsawTrayDockDOM();
        if (wasCollapsed !== this.jigsawTrayCollapsed) {
          this.syncJigsawStageAfterTrayResize();
        }
        this.forceImmediateRedraw = true;
        this.showToast(`🧹 Đã thu gọn ${moved} mảnh đơn lẻ về khay mảnh!`, '🧹');
      } else {
        this.showToast('Mặt bàn đã gọn gàng (các cụm đã ghép được giữ nguyên)!', '✨');
      }
    });

    box.querySelector('#btnPaJigsawHint')?.addEventListener('click', () => {
      const je = this.jigsawEngine;
      if (!je || je.status !== 'playing') return;
      if (!this.sim.state.sandboxMode && je.freeHintsLeft <= 0 && je.paidHintsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt 💡 Bùa Chỉ Điểm!', '💡');
        return;
      }
      if (je.freeHintsLeft > 0) {
        je.freeHintsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(je.hintGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          je.paidHintsLeft = Math.max(0, je.paidHintsLeft - 1);
        }
      }
      const res = je.useMagicHint();
      if (res.ok) {
        this.bumpCompanionCharge();
        const m = this.computeJigsawBoardMetrics(je);
        for (const pIdx of res.lockedPieces.slice(0, 6)) {
          const tc = je.getTargetNormCenter(pIdx);
          this.spawnBurst(m.boardX + tc.nx * m.boardW, m.boardY + tc.ny * m.boardH, '#fde047', 12);
        }
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '💡');
        this.onParentRefresh();
        this.forceImmediateRedraw = true;
        if (res.won) {
          this.jigsawWinRevealTimer = 0.42;
          this.updateLiveCountersOnly();
          this.renderJigsawTrayDockDOM();
        } else {
          this.persistModeSession('jigsaw', true);
          this.updateLiveCountersOnly();
          this.renderJigsawTrayDockDOM();
        }
      }
    });

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
            ? this.minesEngine?.talismanUsed
            : this.mode === 'chess'
              ? this.fishEngine?.talismanUsed
              : this.mode === 'jigsaw'
                ? this.jigsawEngine?.talismanUsed
                : this.onetEngine?.talismanUsed;
      if (activeUsed) {
        this.showToast(
          'Bùa Phượng Hoàng: mỗi môn 1 lần/ngày, hôm nay đã dùng',
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
        const sm = this.getSudokuLayoutMetrics();
        this.spawnWeasleyFireworks(
          sm.boardX + sm.boardPx * 0.5,
          sm.boardY + sm.boardPx * 0.5,
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
      } else if (this.mode === 'caro' && this.minesEngine) {
        const res = this.minesEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        const virt = this.getVirtualCanvasSize();
        this.spawnWeasleyFireworks(virt.w * 0.5, virt.h * 0.5, 2);
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.minesWinRevealTimer = 0.42;
          this.renderDOM();
        } else {
          this.persistModeSession('caro', true);
          this.renderDOM();
        }
      } else if (this.mode === 'chess' && this.fishEngine) {
        const res = this.fishEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        const virt = this.getVirtualCanvasSize();
        this.spawnWeasleyFireworks(virt.w * 0.5, virt.h * 0.45, 3);
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.fishWinRevealTimer = 0.42;
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
      } else if (this.mode === 'jigsaw' && this.jigsawEngine) {
        const res = this.jigsawEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.refundPhoenixTalismanAttempt(this.mode);
          this.showToast(res.msg, '🔥');
          return;
        }
        const m = this.computeJigsawBoardMetrics(this.jigsawEngine);
        this.spawnWeasleyFireworks(m.boardX + m.boardW * 0.5, m.boardY + m.boardH * 0.5, 3);
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.jigsawWinRevealTimer = 0.42;
          this.renderDOM();
        } else {
          this.persistModeSession('jigsaw', true);
          this.renderDOM();
        }
      }
    };

    box.querySelector('#btnPaPhoenixTalisman')?.addEventListener('click', handlePhoenixTalisman);
    box
      .querySelector('#btnPaRescuePhoenixTalisman')
      ?.addEventListener('click', handlePhoenixTalisman);
    box.querySelector('#btnPaLossTalisman')?.addEventListener('click', handlePhoenixTalisman);

    box.querySelector('#btnPaSnackApplePie')?.addEventListener('click', () => {
      if (this.victoryClaimed || this.snackPieUsedThisAttempt) return;
      const res = this.sim.consumeMollyMinigameSnack('cinnamon_apple_pie');
      if (!res.ok) {
        this.showToast(res.msg, '🥧');
        return;
      }
      this.snackPieUsedThisAttempt = true;
      let jigsawWonFromPie = false;
      if (this.mode === 'sudoku' && this.sudokuEngine) {
        this.sudokuEngine.mistakesCount = Math.max(0, this.sudokuEngine.mistakesCount - 1);
        if (this.sudokuEngine.status === 'lost') {
          this.sudokuEngine.status = 'playing';
        }
        this.sudokuEngine.freeHintsLeft += 1;
      } else if (this.mode === 'caro' && this.minesEngine) {
        this.minesEngine.applyApplePieBoost();
      } else if (this.mode === 'chess' && this.fishEngine) {
        this.fishEngine.applyApplePieBoost();
      } else if (this.mode === 'blocks' && this.onetEngine) {
        this.onetEngine.reviveWithExtraLives(2, 35);
        this.onetEngine.freeHintsLeft += 1;
      } else if (this.mode === 'jigsaw' && this.jigsawEngine) {
        const boost = this.jigsawEngine.applyApplePieBoost();
        jigsawWonFromPie = boost.won;
      }
      this.persistModeSession(this.mode, true);
      this.onParentRefresh();
      this.showToast(
        this.mode === 'blocks'
          ? '🥧 Bánh Táo Quế Bà Molly: +35s giờ, +2 ❤️ Đổi Bàn & +1 🔍 Dò Cặp!'
          : this.mode === 'jigsaw'
            ? '🥧 Bánh Táo Quế Bà Molly: cộng thêm giờ, khớp mảnh tranh & +1 💡 Gợi Ý!'
            : this.mode === 'caro'
              ? '🥧 Bánh Táo Quế Bà Molly: +1 Khiên bảo vệ & +1 🪄 Dò An Toàn!'
              : this.mode === 'chess'
                ? '🥧 Bánh Táo Quế Bà Molly: +25s giờ, +20 Đạn Ngọc & +1 🌟 Băng Phong!'
                : '🥧 Bánh Táo Quế Bà Molly: hồi phục lượt trợ giúp & +1 Gợi Ý!',
        '🥧'
      );
      if (jigsawWonFromPie) {
        this.jigsawWinRevealTimer = 0.35;
      }
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

    box.querySelectorAll('#btnPaToggleReviewInspect, #btnPaVictoryReviewInspect').forEach((btn) => btn.addEventListener('click', () => {
      this.inspectingTurningPoint = !this.inspectingTurningPoint;
      this.sim.audio.playClick();
      this.renderDOM();
    }));
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
    this.observedCanvasCssW = 0;
    this.observedCanvasCssH = 0;
    this.forceImmediateRedraw = true;
    if (this.canvasResizeObserver) {
      this.canvasResizeObserver.disconnect();
      this.canvasResizeObserver = null;
    }
    if (
      typeof ResizeObserver !== 'undefined' &&
      typeof Element !== 'undefined' &&
      cvs instanceof Element
    ) {
      this.canvasResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            this.observedCanvasCssW = entry.contentRect.width;
            this.observedCanvasCssH = entry.contentRect.height;
            this.forceImmediateRedraw = true;
          }
        }
      });
      this.canvasResizeObserver.observe(cvs);
    }

    const clientToVirtual = (clientX: number, clientY: number): { vx: number; vy: number } => {
      const rect = cvs.getBoundingClientRect();
      if (cvs.clientWidth > 0 && cvs.clientHeight > 0) {
        this.observedCanvasCssW = cvs.clientWidth;
        this.observedCanvasCssH = cvs.clientHeight;
      }
      const virt = this.getVirtualCanvasSize();
      const netRot = sharedMinigameViewport.getNetQuarterTurns(this.mode);
      const { lu, lv } = clientToLocalNormalized(clientX, clientY, rect, netRot);
      return { vx: lu * virt.w, vy: lv * virt.h };
    };

    const toVirtual = (ev: PointerEvent): { vx: number; vy: number } =>
      clientToVirtual(ev.clientX, ev.clientY);

    const panArea = box.querySelector('.mg-stage-pan-area') as HTMLElement | null;
    const shell = box.querySelector('.pa-canvas-shell') as HTMLElement | null;
    if (panArea && panArea.clientWidth > 24 && panArea.clientHeight > 24) {
      this.observedStageCssW = panArea.clientWidth;
      this.observedStageCssH = panArea.clientHeight;
    }
    sharedMinigameViewport.bindCanvasStageInteractions({
      gameId: this.mode,
      hostKey: 'arcade',
      rootScope: box,
      panAreaEl: panArea,
      canvasShellEl: shell,
      canvasEl: cvs,
      getBoardAspectRatio: (availW, availH) => {
        if (
          this.mode === 'caro' ||
          this.mode === 'chess' ||
          this.mode === 'blocks' ||
          this.mode === 'jigsaw'
        ) {
          return 0;
        }
        if (this.mode === 'sudoku') {
          const sm = this.getSudokuLayoutMetrics(availW, availH);
          return sm.virtW / sm.virtH;
        }
        return 1;
      },
      onStageResized: (availW, availH, boardW, boardH) => {
        this.observedStageCssW = availW;
        this.observedStageCssH = availH;
        this.observedCanvasCssW = boardW;
        this.observedCanvasCssH = boardH;
        this.forceImmediateRedraw = true;
      },
      canSingleFingerPanAt: (clientX, clientY) => {
        if (this.mode === 'jigsaw') {
          if (!this.jigsawEngine || this.jigsawEngine.status !== 'playing') return true;
          const { vx, vy } = clientToVirtual(clientX, clientY);
          const m = this.computeJigsawBoardMetrics(this.jigsawEngine);
          const { nx, ny } = this.virtualToJigsawNorm(vx, vy, m);
          const hitRad = this.getJigsawMinHitRadiusNorm(m);
          if (this.jigsawEngine.pickBoardPieceAtNorm(nx, ny, hitRad.rx, hitRad.ry) !== null) {
            return false;
          }
          if (
            this.jigsawEngine.selectedTrayPieceIdx !== null &&
            nx >= -0.05 &&
            nx <= 1.05 &&
            ny >= -0.05 &&
            ny <= 1.05
          ) {
            return false;
          }
          return true;
        }
        if (this.mode === 'chess' && this.fishEngine?.status === 'playing') {
          return false;
        }
        return true;
      },
      onTransformUpdated: () => {
        this.forceImmediateRedraw = true;
        this.drawFrame();
      },
      onOrientationToggled: () => {
        this.renderDOM();
        this.drawFrame();
      },
      onPlayClick: () => this.sim.audio.playClick(),
    });

    let pendingTouchTap = false;

    cvs.addEventListener('contextmenu', (ev) => {
      if (this.mode === 'caro' && this.minesEngine?.status === 'playing') {
        ev.preventDefault();
        const pos = toVirtual(ev as unknown as PointerEvent);
        const cell = this.getMinesCellAt(pos.vx, pos.vy);
        if (cell) {
          this.handleMinesFlagAt(cell.r, cell.c);
        }
      }
    });

    cvs.addEventListener('pointerdown', (ev) => {
      if (ev.button === 2 && this.mode === 'caro' && this.minesEngine?.status === 'playing') {
        ev.preventDefault();
        const pos = toVirtual(ev);
        const cell = this.getMinesCellAt(pos.vx, pos.vy);
        if (cell) this.handleMinesFlagAt(cell.r, cell.c);
        return;
      }
      if (ev.button !== 0 && ev.pointerType === 'mouse') return;
      if (this.victoryClaimed) return;
      if (ev.pointerType === 'touch' && sharedMinigameViewport.isPinchOrCooldownActive()) {
        return;
      }
      this.forceImmediateRedraw = true;
      const pos = toVirtual(ev);
      this.activePointerId = ev.pointerId;
      this.pointerDownPos = pos;
      this.pointerCurrPos = pos;
      this.hasDragged = false;
      this.minesLongPressTriggered = false;
      this.cancelMinesLongPress();
      if (this.mode === 'jigsaw') {
        try {
          cvs.setPointerCapture(ev.pointerId);
        } catch {
          // Ignore synthetic pointer events
        }
      }

      if (ev.pointerType === 'touch') {
        this.handlePointerHover(pos.vx, pos.vy);
        if (this.mode === 'chess' && this.fishEngine && this.fishEngine.status === 'playing') {
          pendingTouchTap = false;
          this.handlePointerDown(pos.vx, pos.vy);
          return;
        }
        if (this.mode === 'jigsaw' && this.jigsawEngine && this.jigsawEngine.status === 'playing') {
          const m = this.computeJigsawBoardMetrics(this.jigsawEngine);
          const { nx, ny } = this.virtualToJigsawNorm(pos.vx, pos.vy, m);
          const hitRad = this.getJigsawMinHitRadiusNorm(m);
          const hitPiece = this.jigsawEngine.pickBoardPieceAtNorm(nx, ny, hitRad.rx, hitRad.ry);
          if (hitPiece !== null) {
            pendingTouchTap = false;
            this.handlePointerDown(pos.vx, pos.vy);
            return;
          }
        }
        if (this.mode === 'caro' && this.minesEngine && this.minesEngine.status === 'playing') {
          const holdCell = this.getMinesCellAt(pos.vx, pos.vy);
          if (holdCell) {
            this.minesLongPressTimer = setTimeout(() => {
              this.minesLongPressTimer = null;
              if (!this.hasDragged && this.mode === 'caro' && this.minesEngine?.status === 'playing') {
                this.minesLongPressTriggered = true;
                pendingTouchTap = false;
                this.handleMinesFlagAt(holdCell.r, holdCell.c);
                try {
                  globalThis.navigator?.vibrate?.(14);
                } catch {
                  // Ignore unsupported vibrate
                }
              }
            }, 310);
          }
        }
        pendingTouchTap = true;
        return;
      }

      pendingTouchTap = false;
      this.handlePointerDown(pos.vx, pos.vy);
      if (this.mode === 'chess' && ev.pointerType === 'mouse' && (ev.buttons & 1) === 0) {
        this.activePointerId = null;
        this.pointerDownPos = null;
      }
    });

    cvs.addEventListener('pointermove', (ev) => {
      this.forceImmediateRedraw = true;
      const pos = toVirtual(ev);
      this.pointerCurrPos = pos;
      if (
        this.activePointerId === ev.pointerId &&
        ev.pointerType === 'mouse' &&
        (ev.buttons & 1) === 0
      ) {
        this.activePointerId = null;
        this.pointerDownPos = null;
      }
      if (this.activePointerId === ev.pointerId && this.pointerDownPos) {
        if (Math.hypot(pos.vx - this.pointerDownPos.vx, pos.vy - this.pointerDownPos.vy) > 6) {
          this.hasDragged = true;
          this.cancelMinesLongPress();
        }
        this.handlePointerDrag(pos.vx, pos.vy);
      } else {
        this.handlePointerHover(pos.vx, pos.vy);
      }
    });

    const finishPointer = (ev: PointerEvent) => {
      if (this.activePointerId !== ev.pointerId) return;
      this.cancelMinesLongPress();
      this.forceImmediateRedraw = true;
      if (ev.type === 'pointercancel') {
        pendingTouchTap = false;
        this.jigsawDragBoardPiece = null;
        this.activePointerId = null;
        this.pointerDownPos = null;
        return;
      }
      const pos = toVirtual(ev);
      this.pointerCurrPos = pos;
      if (this.minesLongPressTriggered) {
        this.minesLongPressTriggered = false;
        pendingTouchTap = false;
      } else if (pendingTouchTap) {
        pendingTouchTap = false;
        if (!this.hasDragged && !sharedMinigameViewport.isPinchOrCooldownActive()) {
          this.handlePointerDown(pos.vx, pos.vy);
        }
      } else {
        this.handlePointerUp(pos.vx, pos.vy);
      }
      this.activePointerId = null;
      this.pointerDownPos = null;
    };

    cvs.addEventListener('pointerup', finishPointer);
    cvs.addEventListener('pointercancel', finishPointer);
    cvs.addEventListener('pointerleave', () => {
      this.cancelMinesLongPress();
      if (this.mode !== 'jigsaw') {
        this.activePointerId = null;
        this.pointerDownPos = null;
      }
      this.forceImmediateRedraw = true;
      this.hoveredTileUid = null;
      this.sudokuHoverCell = null;
      this.sudokuHoverPadDigit = null;
      this.sudokuHoverAction = null;
      this.minesHoverCell = null;
      this.onetHoverCell = null;
    });

    if (this.mode === 'jigsaw') {
      this.renderJigsawTrayDockDOM();
    }
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
    const wasFullMismatch = se.fullBoardMismatch;
    if (se.undo()) {
      this.persistSudokuSession(true);
      if (se.selected) {
        const sm = this.getSudokuLayoutMetrics();
        const cx = sm.boardX + (se.selected.c + 0.5) * sm.cellPx;
        const cy = sm.boardY + (se.selected.r + 0.5) * sm.cellPx;
        this.spawnBurst(cx, cy, '#fcd34d', 10);
      }
      this.sim.audio.playClick();
      if (wasLost || wasFullMismatch !== se.fullBoardMismatch) {
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
      const sm = this.getSudokuLayoutMetrics();
      const cx = sm.boardX + (res.c + 0.5) * sm.cellPx;
      const cy = sm.boardY + (res.r + 0.5) * sm.cellPx;
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
    const wasFullMismatch = this.sudokuEngine.fullBoardMismatch;
    const prevRem = this.sudokuEngine.getRemainingDigitCounts()[digit] ?? 0;
    const res = this.sudokuEngine.inputDigit(digit);
    if (!res.changed) {
      this.persistSudokuSession(false);
      this.sim.audio.playClick();
      return;
    }
    const sel = this.sudokuEngine.selected;
    const sm = this.getSudokuLayoutMetrics();
    if (res.fullBoardError) {
      // Tuyệt đối không bắn tia đỏ vào ô vừa bấm để tránh hiểu nhầm/lộ vị trí sai — chỉ hiệu ứng trung tính giữa bàn
      this.spawnBurst(sm.boardX + sm.boardPx * 0.5, sm.boardY + sm.boardPx * 0.5, '#f59e0b', 14);
      this.sim.audio.playClick();
    } else {
      if (sel) {
        const cx = sm.boardX + (sel.c + 0.5) * sm.cellPx;
        const cy = sm.boardY + (sel.r + 0.5) * sm.cellPx;
        this.spawnBurst(cx, cy, this.sudokuEngine.pencilMode ? '#d97706' : '#2563eb', 12);
        const nextRem = this.sudokuEngine.getRemainingDigitCounts()[digit] ?? 0;
        if (prevRem === 1 && nextRem === 0) {
          const padRect = this.sudokuPadRects.get(digit);
          if (padRect) {
            this.spawnBurst(padRect.x + padRect.w * 0.5, padRect.y + padRect.h * 0.5, '#fde047', 18);
          }
        }
      }
      this.bumpCompanionCharge();
      this.sim.audio.playMatchPop(1);
    }

    if (res.won) {
      this.checkAndClaimVictory();
    } else if (res.lost) {
      this.persistSudokuSession(true);
      this.renderDOM(); // the level bar states the loss (role=status) — no toast over the HUD
    } else if (res.fullBoardError) {
      this.persistSudokuSession(true);
      this.renderDOM(); // the level bar states the full-board mismatch
    } else {
      this.persistSudokuSession(true);
      if (wasFullMismatch !== this.sudokuEngine.fullBoardMismatch) {
        this.renderDOM();
      } else {
        this.updateLiveCountersOnly();
      }
    }
  }

  private triggerSudokuClearAction(fromButton = false): void {
    const se = this.sudokuEngine;
    if (!se || (se.status !== 'playing' && se.status !== 'lost')) return;
    const wasLost = se.status === 'lost';
    const wasEraseMode = se.eraseMode;
    const wasFullMismatch = se.fullBoardMismatch;
    if (se.clearSelectedCell()) {
      se.eraseMode = false;
      this.persistSudokuSession(true);
      if (se.selected) {
        const sm = this.getSudokuLayoutMetrics();
        const cx = sm.boardX + (se.selected.c + 0.5) * sm.cellPx;
        const cy = sm.boardY + (se.selected.r + 0.5) * sm.cellPx;
        this.spawnBurst(cx, cy, '#e7cba0', 10);
      }
      this.sim.audio.playClick();
      if (wasLost || wasEraseMode || wasFullMismatch !== se.fullBoardMismatch) {
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

  private getMinesCellAt(vx: number, vy: number): { r: number; c: number } | null {
    const me = this.minesEngine;
    if (!me) return null;
    const m = this.computeMinesBoardMetrics(me);
    if (
      vx < m.originX ||
      vx >= m.originX + m.boardW ||
      vy < m.originY ||
      vy >= m.originY + m.boardH
    ) {
      return null;
    }
    const dc = Math.min(m.dispCols - 1, Math.max(0, Math.floor((vx - m.originX) / m.cellSize)));
    const dr = Math.min(m.dispRows - 1, Math.max(0, Math.floor((vy - m.originY) / m.cellSize)));
    const r = m.transposed ? dc : dr;
    const c = m.transposed ? dr : dc;
    return { r, c };
  }

  private handleMinesFlagAt(r: number, c: number): void {
    const me = this.minesEngine;
    if (!me || me.status !== 'playing') return;
    const res = me.toggleFlag(r, c);
    if (!res.changed) return;
    const m = this.computeMinesBoardMetrics(me);
    const dc = m.transposed ? r : c;
    const dr = m.transposed ? c : r;
    const cx = m.originX + (dc + 0.5) * m.cellSize;
    const cy = m.originY + (dr + 0.5) * m.cellSize;
    this.spawnBurst(cx, cy, res.flagged ? '#ef4444' : '#fde047', 10);
    this.sim.audio.playClick();
    this.persistModeSession('caro', true);
    this.updateLiveCountersOnly();
  }

  private handleMinesCellTap(r: number, c: number): void {
    const me = this.minesEngine;
    if (!me || me.status !== 'playing') return;
    const res = me.tapCell(r, c);
    if (res.action === 'noop' || res.action === 'blocked_flag') {
      this.sim.audio.playClick();
      return;
    }
    const m = this.computeMinesBoardMetrics(me);
    if (res.action === 'flagged') {
      const targets = res.revealedCells.length > 0 ? res.revealedCells : [{ r, c }];
      for (const pt of targets.slice(0, 8)) {
        const dc = m.transposed ? pt.r : pt.c;
        const dr = m.transposed ? pt.c : pt.r;
        this.spawnBurst(
          m.originX + (dc + 0.5) * m.cellSize,
          m.originY + (dr + 0.5) * m.cellSize,
          '#ef4444',
          10
        );
      }
      this.sim.audio.playClick();
      this.persistModeSession('caro', true);
      this.updateLiveCountersOnly();
      return;
    }
    this.bumpCompanionCharge();
    if (res.shieldSaved && res.defusedCell) {
      const dc = m.transposed ? res.defusedCell.r : res.defusedCell.c;
      const dr = m.transposed ? res.defusedCell.c : res.defusedCell.r;
      this.spawnBurst(m.originX + (dc + 0.5) * m.cellSize, m.originY + (dr + 0.5) * m.cellSize, '#34d399', 18);
      this.sim.audio.playPowerupBlast();
      this.showToast(`Khiên Bảo Vệ đỡ giúp 1 mìn! Còn ${me.shieldsLeft} khiên`, '✨');
      this.persistModeSession('caro', true);
      this.renderDOM();
      return;
    }
    if (res.lost) {
      const dc = m.transposed ? r : c;
      const dr = m.transposed ? c : r;
      this.spawnBurst(m.originX + (dc + 0.5) * m.cellSize, m.originY + (dr + 0.5) * m.cellSize, '#ef4444', 26);
      this.sim.audio.playCheekyAlert();
      this.persistModeSession('caro', true);
      this.renderDOM();
      return;
    }
    for (const p of res.revealedCells.slice(0, 12)) {
      const dc = m.transposed ? p.r : p.c;
      const dr = m.transposed ? p.c : p.r;
      this.spawnBurst(m.originX + (dc + 0.5) * m.cellSize, m.originY + (dr + 0.5) * m.cellSize, '#fde047', 6);
    }
    this.sim.audio.playMatchPop(res.revealedCells.length > 4 ? 3 : 1);
    if (res.won) {
      this.hitStopTimer = 0.035;
      this.sim.audio.playPowerupBlast();
      this.spawnWeasleyFireworks(m.originX + m.boardW * 0.5, m.originY + m.boardH * 0.45, 3);
      this.minesFireworkTimer = 0.24;
      this.minesWinRevealTimer = 0.48;
      this.updateLiveCountersOnly();
    } else {
      this.persistModeSession('caro', true);
      this.updateLiveCountersOnly();
    }
  }

  private canvasToFishArena(vx: number, vy: number): { ax: number; ay: number } {
    const virt = this.getVirtualCanvasSize();
    const vp = this.getFishViewportMetrics(virt.w, virt.h);
    return {
      ax: (vx - vp.offsetX) / Math.max(0.01, vp.scale),
      ay: (vy - vp.offsetY) / Math.max(0.01, vp.scale),
    };
  }

  private fireFishShooterAtCanvas(
    vxOrAx: number,
    vyOrAy: number,
    alreadyArena = false,
    fromAutoFireHold = false
  ): void {
    const fe = this.fishEngine;
    if (!fe || fe.status !== 'playing') return;
    const { ax, ay } = alreadyArena
      ? { ax: vxOrAx, ay: vyOrAy }
      : this.canvasToFishArena(vxOrAx, vyOrAy);

    // Tapping right on the turret base cycles cannon tier once (never on 60fps auto-fire hold)
    if (!alreadyArena && !fromAutoFireHold && Math.hypot(ax - fe.turretX, ay - fe.turretY) <= 44) {
      fe.cycleCannonTier();
      this.activePointerId = null;
      this.pointerDownPos = null;
      this.sim.audio.playClick();
      this.updateLiveCountersOnly();
      return;
    }

    const res = fe.fireShot(ax, ay, Boolean(this.sim.state.sandboxMode));
    if (res.fired) {
      this.bumpCompanionCharge();
      const virt = this.getVirtualCanvasSize();
      const vp = this.getFishViewportMetrics(virt.w, virt.h);
      const muzzleX = vp.offsetX + (fe.turretX + Math.cos(fe.aimAngle) * 32) * vp.scale;
      const muzzleY = vp.offsetY + (fe.turretY + Math.sin(fe.aimAngle) * 32) * vp.scale;
      this.spawnBurst(muzzleX, muzzleY, res.tier === 3 ? '#fbbf24' : '#38bdf8', 7);
      this.sim.audio.playClick();
      this.updateLiveCountersOnly();
    } else if (res.reason === 'no_ammo') {
      this.sim.audio.playClick();
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

      const sm = this.getSudokuLayoutMetrics();
      if (
        vx >= sm.boardX &&
        vx <= sm.boardX + sm.boardPx &&
        vy >= sm.boardY &&
        vy <= sm.boardY + sm.boardPx
      ) {
        const c = Math.min(8, Math.max(0, Math.floor((vx - sm.boardX) / sm.cellPx)));
        const r = Math.min(8, Math.max(0, Math.floor((vy - sm.boardY) / sm.cellPx)));
        if (se.eraseMode) {
          const wasLost = se.status === 'lost';
          const wasErase = se.eraseMode;
          const wasFullMismatch = se.fullBoardMismatch;
          if (se.clearCellAt(r, c)) {
            se.eraseMode = false;
            se.selectCell(r, c);
            this.persistSudokuSession(true);
            const cx = sm.boardX + (c + 0.5) * sm.cellPx;
            const cy = sm.boardY + (r + 0.5) * sm.cellPx;
            this.spawnBurst(cx, cy, '#e7cba0', 10);
            this.sim.audio.playClick();
            if (wasLost || wasErase || wasFullMismatch !== se.fullBoardMismatch) {
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

    if (this.mode === 'caro' && this.minesEngine) {
      if (this.minesEngine.status !== 'playing' || this.minesWinRevealTimer > 0) return;
      const cell = this.getMinesCellAt(vx, vy);
      if (!cell) return;
      this.handleMinesCellTap(cell.r, cell.c);
      return;
    }

    if (this.mode === 'chess' && this.fishEngine) {
      if (this.fishEngine.status !== 'playing' || this.fishWinRevealTimer > 0) return;
      this.fireFishShooterAtCanvas(vx, vy, false);
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

    if (this.mode === 'jigsaw' && this.jigsawEngine && this.jigsawEngine.status === 'playing') {
      const je = this.jigsawEngine;
      const m = this.computeJigsawBoardMetrics(je);
      const { nx, ny } = this.virtualToJigsawNorm(vx, vy, m);
      const hitRad = this.getJigsawMinHitRadiusNorm(m);
      const hitPiece = je.pickBoardPieceAtNorm(nx, ny, hitRad.rx, hitRad.ry);
      if (hitPiece !== null) {
        je.elevateCluster(hitPiece);
        const pc = je.getBoardPieceNormCenter(hitPiece);
        this.jigsawDragBoardPiece = hitPiece;
        this.jigsawActiveBoardPiece = hitPiece;
        this.jigsawDragGrabOffsetNorm = {
          dx: pc.nx - nx,
          dy: pc.ny - ny,
        };
        this.sim.audio.playClick();
        return;
      }
      if (je.selectedTrayPieceIdx !== null && nx >= -0.05 && nx <= 1.05 && ny >= -0.05 && ny <= 1.05) {
        const trayIdx = je.selectedTrayPieceIdx;
        if (je.spawnTrayPieceOntoBoard(trayIdx, nx, ny)) {
          this.jigsawActiveBoardPiece = trayIdx;
          this.finalizeJigsawBoardClusterDrop(trayIdx);
          this.renderJigsawTrayDockDOM();
        }
      }
      return;
    }
  }

  private handlePointerDrag(vx: number, vy: number): void {
    if (
      this.mode === 'jigsaw' &&
      this.jigsawEngine &&
      this.jigsawEngine.status === 'playing' &&
      this.jigsawDragBoardPiece !== null
    ) {
      const m = this.computeJigsawBoardMetrics(this.jigsawEngine);
      const { nx, ny } = this.virtualToJigsawNorm(vx, vy, m);
      this.jigsawEngine.movePieceClusterToNorm(
        this.jigsawDragBoardPiece,
        nx + this.jigsawDragGrabOffsetNorm.dx,
        ny + this.jigsawDragGrabOffsetNorm.dy
      );
      return;
    }

    if (this.mode === 'chess' && this.fishEngine && this.fishEngine.status === 'playing') {
      const { ax, ay } = this.canvasToFishArena(vx, vy);
      this.fishEngine.aimAt(ax, ay);
      return;
    }
  }

  private handlePointerHover(vx: number, vy: number): void {
    if (this.mode === 'chess' && this.fishEngine && this.fishEngine.status === 'playing') {
      const { ax, ay } = this.canvasToFishArena(vx, vy);
      this.fishEngine.aimAt(ax, ay);
      return;
    }

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      const sm = this.getSudokuLayoutMetrics();
      if (
        vx >= sm.boardX &&
        vx <= sm.boardX + sm.boardPx &&
        vy >= sm.boardY &&
        vy <= sm.boardY + sm.boardPx
      ) {
        const c = Math.min(8, Math.max(0, Math.floor((vx - sm.boardX) / sm.cellPx)));
        const r = Math.min(8, Math.max(0, Math.floor((vy - sm.boardY) / sm.cellPx)));
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

    if (this.mode === 'caro' && this.minesEngine && this.minesEngine.status === 'playing') {
      this.minesHoverCell = this.getMinesCellAt(vx, vy);
      return;
    }
    this.minesHoverCell = null;

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
    if (this.mode === 'jigsaw' && this.jigsawEngine && this.jigsawDragBoardPiece !== null) {
      const draggedPiece = this.jigsawDragBoardPiece;
      this.jigsawDragBoardPiece = null;
      if (this.hasDragged && this.jigsawEngine.status === 'playing') {
        const m = this.computeJigsawBoardMetrics(this.jigsawEngine);
        const { nx, ny } = this.virtualToJigsawNorm(vx, vy, m);
        this.jigsawEngine.movePieceClusterToNorm(
          draggedPiece,
          nx + this.jigsawDragGrabOffsetNorm.dx,
          ny + this.jigsawDragGrabOffsetNorm.dy
        );
      }
      this.finalizeJigsawBoardClusterDrop(draggedPiece);
      return;
    }
  }

  private computeOnetBoardMetrics(engine: CreatureOnetEngine): {
    timerBarX: number;
    timerBarY: number;
    timerBarW: number;
    timerBarH: number;
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
    const minDim = Math.min(virt.w, virt.h);
    // Tự xoay chiều lưới cols × rows theo tỷ lệ thực tế của màn hình mobile dọc / ngang / gập
    const transposed =
      (virt.h > virt.w * 1.03 && engine.cols > engine.rows) ||
      (virt.w > virt.h * 1.03 && engine.rows > engine.cols) ||
      (Math.abs(virt.h - virt.w) <= virt.w * 0.03 &&
        this.isMobileBoardLayout() &&
        engine.cols > engine.rows);
    const dispRows = transposed ? engine.cols : engine.rows;
    const dispCols = transposed ? engine.rows : engine.cols;

    const outerTrackMargin = Math.max(4, Math.min(10, Math.round(minDim * 0.013)));
    const timerHeaderGap = minDim < 360 ? 3 : 4;
    const timerBarH = minDim < 360 ? 14 : 17;
    const timerHeaderTotal = timerBarH + timerHeaderGap;
    const boxPad = minDim < 360 ? 1 : 2;
    const availW = Math.max(140, virt.w - (outerTrackMargin + boxPad) * 2);
    const availH = Math.max(120, virt.h - (outerTrackMargin + boxPad) * 2 - timerHeaderTotal);
    const maxTileSide = this.isMobileBoardLayout() ? 116 : 126;
    const rawCellW = Math.min(maxTileSide, availW / dispCols);
    const rawCellH = Math.min(maxTileSide * 1.08, availH / dispRows);
    const cellW = Math.min(rawCellW, rawCellH * 1.35);
    const cellH = Math.min(rawCellH, rawCellW * 1.35);
    const boardW = dispCols * cellW;
    const boardH = dispRows * cellH;
    const frameW = boardW + outerTrackMargin * 2;
    const frameH = boardH + outerTrackMargin * 2;
    const totalUnitH = timerHeaderTotal + frameH;
    const unitTopY = (virt.h - totalUnitH) * 0.5;
    const frameX = (virt.w - frameW) * 0.5;
    const frameY = unitTopY + timerHeaderTotal;
    const originX = frameX + outerTrackMargin;
    const originY = frameY + outerTrackMargin;
    const timerBarW = Math.min(virt.w - 10, Math.max(Math.min(220, virt.w - 12), frameW));
    const timerBarX = (virt.w - timerBarW) * 0.5;
    const timerBarY = unitTopY;
    return {
      timerBarX,
      timerBarY,
      timerBarW,
      timerBarH,
      frameX,
      frameY,
      frameW,
      frameH,
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
        duration: 0.45,
        bonusTimeSec: ev.bonusTimeSec,
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

  private hasActiveVisualAnimations(): boolean {
    const jigsawBaking =
      this.mode === 'jigsaw' &&
      Boolean(
        this.jigsawEngine &&
          (!this.jigsawBakeCache ||
            this.jigsawBakeCache.bakedPiecesCount < this.jigsawEngine.totalPieces)
      );
    return (
      jigsawBaking ||
      this.hitStopTimer > 0 ||
      this.activePointerId !== null ||
      this.jigsawDragBoardPiece !== null ||
      this.jigsawTrayDragState !== null ||
      this.jigsawWinRevealTimer > 0 ||
      this.minesWinRevealTimer > 0 ||
      this.fishWinRevealTimer > 0 ||
      this.fishShakeTimer > 0 ||
      (this.mode === 'chess' && this.fishEngine?.status === 'playing') ||
      this.onetWinRevealTimer > 0 ||
      this.onetBlockedFlash !== null ||
      this.onetBeams.length > 0 ||
      this.onetSlideAnims.size > 0 ||
      this.particles.length > 0 ||
      this.flyingTiles.length > 0
    );
  }

  private startLoop(): void {
    this.stopLoop();
    this.lastFrameTs = performance.now();
    this.forceImmediateRedraw = true;
    this.idleDrawAccumSec = 0;
    const step = (now: number) => {
      if (typeof document !== 'undefined' && document.hidden) {
        this.lastFrameTs = now;
        this.rafId = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTs) / 1000));
      this.lastFrameTs = now;
      if (!this.rescueContext) {
        const curRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
        if (curRescuedAt !== this.lastSeenSosRescuedAt) {
          this.lastSeenSosRescuedAt = curRescuedAt;
          this.renderDOM();
        }
      }
      const hadAnimsBefore = this.hasActiveVisualAnimations();
      this.tickAnimations(dt);
      const hasAnimsNow = this.hasActiveVisualAnimations();
      this.idleDrawAccumSec += dt;
      if (this.forceImmediateRedraw || hadAnimsBefore || hasAnimsNow || this.idleDrawAccumSec >= 0.125) {
        this.forceImmediateRedraw = false;
        this.idleDrawAccumSec = 0;
        this.drawFrame();
      }
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopLoop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    if (this.canvasResizeObserver) {
      this.canvasResizeObserver.disconnect();
      this.canvasResizeObserver = null;
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
        if (!isPageHidden && !this.rescueContext && this.sudokuEngine.status === 'playing') {
          this.sudokuAutoSaveAccumSec += dt;
          if (this.sudokuAutoSaveAccumSec >= 5) {
            this.sudokuAutoSaveAccumSec = 0;
            this.persistSudokuSession(true);
            this.persistActiveModalResumeMarker();
          }
        }
      } else if (this.mode === 'blocks') {
        if (this.onetWinRevealTimer > 0) {
          this.onetWinRevealTimer -= dt;
          if (this.onetWinRevealTimer <= 0) {
            this.onetWinRevealTimer = 0;
            this.checkAndClaimVictory();
          }
        } else if (this.onetEngine && this.onetEngine.status === 'playing') {
          const isPageHidden = typeof document !== 'undefined' && document.hidden;
          const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
          if (!isPageHidden && openDlg?.open) {
            const tick = this.onetEngine.tickTimer(dt, Boolean(this.sim.state.sandboxMode));
            if (tick.timedOut) {
              this.onetAutoSaveAccumSec = 0;
              this.persistModeSession('blocks', true);
              this.sim.audio.playCheekyAlert();
              if (this.onetEngine.lastAutoShuffleNotice) {
                this.showToast(this.onetEngine.lastAutoShuffleNotice, '⏰');
              }
              this.renderDOM();
            } else {
              if (tick.wholeSecondChanged) {
                this.updateLiveCountersOnly();
              }
              if (!this.rescueContext) {
                this.onetAutoSaveAccumSec += dt;
                if (this.onetAutoSaveAccumSec >= 5) {
                  this.onetAutoSaveAccumSec = 0;
                  this.persistModeSession('blocks', true);
                  this.persistActiveModalResumeMarker();
                }
              }
            }
          }
        }
      } else if (this.mode === 'jigsaw') {
        if (this.jigsawWinRevealTimer > 0) {
          this.jigsawWinRevealTimer -= dt;
          if (this.jigsawWinRevealTimer <= 0) {
            this.jigsawWinRevealTimer = 0;
            this.checkAndClaimVictory();
          }
        } else if (this.jigsawEngine && this.jigsawEngine.status === 'playing') {
          const isPageHidden = typeof document !== 'undefined' && document.hidden;
          const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
          if (!isPageHidden && openDlg?.open) {
            const tick = this.jigsawEngine.tickTimer(dt, Boolean(this.sim.state.sandboxMode));
            if (tick.timedOut) {
              this.jigsawAutoSaveAccumSec = 0;
              this.cleanupJigsawTrayDrag();
              this.persistModeSession('jigsaw', true);
              this.sim.audio.playCheekyAlert();
              this.showToast('Hết giờ ghép tranh · dùng Bùa Phượng Hoàng để tiếp sức', '⏰');
              this.renderDOM();
            } else {
              if (tick.wholeSecondChanged) {
                this.updateLiveCountersOnly();
                this.forceImmediateRedraw = true;
              }
              if (!this.rescueContext) {
                this.jigsawAutoSaveAccumSec += dt;
                if (this.jigsawAutoSaveAccumSec >= 5) {
                  this.jigsawAutoSaveAccumSec = 0;
                  this.persistModeSession('jigsaw', true);
                  this.persistActiveModalResumeMarker();
                }
              }
            }
          }
        }
      } else if (this.mode === 'caro' && this.minesWinRevealTimer > 0) {
        this.minesWinRevealTimer -= dt;
        this.minesFireworkTimer -= dt;
        if (this.minesFireworkTimer <= 0) {
          this.minesFireworkTimer = 0.24;
          const virt = this.getVirtualCanvasSize();
          this.spawnWeasleyFireworks(virt.w * 0.5, virt.h * 0.45, 2);
        }
        if (this.minesWinRevealTimer <= 0) {
          this.minesWinRevealTimer = 0;
          this.checkAndClaimVictory();
        }
      } else if (this.mode === 'chess') {
        if (this.fishWinRevealTimer > 0) {
          this.fishWinRevealTimer -= dt;
          if (this.fishWinRevealTimer <= 0) {
            this.fishWinRevealTimer = 0;
            this.checkAndClaimVictory();
          }
        } else if (this.fishEngine && this.fishEngine.status === 'playing') {
          const isPageHidden = typeof document !== 'undefined' && document.hidden;
          const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
          if (!isPageHidden && openDlg?.open) {
            if (this.activePointerId !== null && this.fishEngine.fireCooldown <= 0) {
              this.fireFishShooterAtCanvas(this.pointerCurrPos.vx, this.pointerCurrPos.vy, false, true);
            }
            const tick = this.fishEngine.tick(dt, Boolean(this.sim.state.sandboxMode));
            const virt = this.getVirtualCanvasSize();
            const vp = this.getFishViewportMetrics(virt.w, virt.h);
            if (tick.wallBounces?.length) {
              for (const wb of tick.wallBounces) {
                this.spawnBurst(vp.offsetX + wb.x * vp.scale, vp.offsetY + wb.y * vp.scale, '#67e8f9', 5);
              }
            }
            for (const ev of tick.caughtEvents) {
              const cx = vp.offsetX + ev.x * vp.scale;
              const cy = vp.offsetY + ev.y * vp.scale;
              this.spawnBurst(cx, cy, ev.isExplosion ? '#fb923c' : '#fde047', ev.isExplosion ? 20 : 11);
              if (ev.isExplosion) {
                this.sim.audio.playPowerupBlast();
                const reducedMotion =
                  typeof window !== 'undefined' &&
                  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
                if (!reducedMotion) {
                  this.fishShakeTimer = 0.2;
                  this.fishShakeAmp = 3.2;
                }
              } else {
                this.sim.audio.playMatchPop(Math.min(6, Math.max(1, this.fishEngine.combo)));
              }
            }
            if (tick.won) {
              this.hitStopTimer = 0.035;
              this.sim.audio.playPowerupBlast();
              this.spawnWeasleyFireworks(virt.w * 0.5, virt.h * 0.45, 3);
              this.fishWinRevealTimer = 0.48;
              this.updateLiveCountersOnly();
            } else if (tick.timedOut) {
              this.fishAutoSaveAccumSec = 0;
              this.persistModeSession('chess', true);
              this.sim.audio.playCheekyAlert();
              this.renderDOM();
            } else {
              if (tick.wholeSecondChanged || tick.caughtEvents.length > 0) {
                this.updateLiveCountersOnly();
              }
              if (!this.rescueContext) {
                this.fishAutoSaveAccumSec += dt;
                if (this.fishAutoSaveAccumSec >= 5) {
                  this.fishAutoSaveAccumSec = 0;
                  this.persistModeSession('chess', true);
                  this.persistActiveModalResumeMarker();
                }
              }
            }
          }
        }
      }
    }

    if (this.fishShakeTimer > 0) {
      this.fishShakeTimer = Math.max(0, this.fishShakeTimer - dt);
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
    let cssW = this.observedCanvasCssW;
    let cssH = this.observedCanvasCssH;
    if (cssW < 10 || cssH < 10) {
      if (cvs.clientWidth >= 10 && cvs.clientHeight >= 10) {
        cssW = cvs.clientWidth;
        cssH = cvs.clientHeight;
        this.observedCanvasCssW = cssW;
        this.observedCanvasCssH = cssH;
      } else if (typeof cvs.getBoundingClientRect === 'function') {
        const rect = cvs.getBoundingClientRect();
        const netRot = sharedMinigameViewport.getNetQuarterTurns(this.mode);
        const z = Math.max(0.25, sharedMinigameViewport.getState(this.mode).zoom);
        cssW = (netRot % 2 === 1 ? rect.height : rect.width) / z;
        cssH = (netRot % 2 === 1 ? rect.width : rect.height) / z;
        if (cssW >= 10 && cssH >= 10) {
          this.observedCanvasCssW = cssW;
          this.observedCanvasCssH = cssH;
        }
      }
    }
    if (cssW < 10 || cssH < 10) return;

    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));
    const baseDpr = Math.min(
      isTouch ? 1.65 : 2.0,
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    );
    const maxDprZoom = this.mode === 'jigsaw' ? 3.2 : 2.4;
    const viewZoom = Math.max(
      1,
      Math.min(maxDprZoom, sharedMinigameViewport.getState(this.mode).zoom)
    );
    const effectiveBaseDpr = this.mode === 'chess' ? Math.min(1.5, baseDpr) : baseDpr;
    const maxCanvasDim = this.mode === 'chess' ? 1360 : isTouch ? 1560 : 1920;
    const dpr = Math.min(maxCanvasDim / Math.max(1, cssW, cssH), effectiveBaseDpr * viewZoom);
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (cvs.width !== targetW || cvs.height !== targetH) {
      cvs.width = targetW;
      cvs.height = targetH;
    }

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const virt = this.getVirtualCanvasSize();
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = this.mode === 'chess' ? 'medium' : 'high';
    ctx.scale(targetW / virt.w, targetH / virt.h);

    if (this.mode === 'chess' && this.fishShakeTimer > 0) {
      const now = performance.now();
      const decay = Math.min(1, this.fishShakeTimer / 0.2);
      const amp = this.fishShakeAmp * decay;
      ctx.translate(Math.sin(now * 0.095) * amp, Math.cos(now * 0.125) * amp * 0.72);
    }

    if (this.isYuleSkinActive()) {
      this.ensureYuleArcadeAssetsLoaded();
    }

    if (this.mode === 'chess') {
      this.drawFishShooterBackdrop(ctx, virt.w, virt.h);
    } else if (this.mode === 'sudoku') {
      this.drawClassicSudokuBackdrop(ctx, virt.w, virt.h);
    } else if (this.mode === 'caro') {
      this.drawHogwartsMinesBackdrop(ctx, virt.w, virt.h);
    } else if (this.mode === 'jigsaw') {
      this.drawParlorTabletopBackdrop(ctx, virt.w, virt.h);
    } else {
      this.drawUnicornSanctuaryBackdrop(ctx, virt.w, virt.h);
    }

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      this.drawSudokuScene(ctx, this.sudokuEngine);
    } else if (this.mode === 'caro' && this.minesEngine) {
      this.drawMinesweeperScene(ctx, this.minesEngine);
    } else if (this.mode === 'chess' && this.fishEngine) {
      this.drawFishShooterScene(ctx, this.fishEngine);
    } else if (this.mode === 'blocks' && this.onetEngine) {
      this.drawCreatureOnetScene(ctx, this.onetEngine);
    } else if (this.mode === 'jigsaw' && this.jigsawEngine) {
      this.drawJigsawScene(ctx, this.jigsawEngine);
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
    const isYule = this.isYuleSkinActive();
    const img = this.unicornLakeBgImage;
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
      const scrim = ctx.createLinearGradient(0, 0, 0, h);
      if (isYule) {
        scrim.addColorStop(0, 'rgba(6, 38, 28, 0.58)');
        scrim.addColorStop(0.5, 'rgba(10, 48, 36, 0.44)');
        scrim.addColorStop(1, 'rgba(28, 12, 16, 0.62)');
      } else {
        scrim.addColorStop(0, 'rgba(15, 36, 42, 0.52)');
        scrim.addColorStop(0.5, 'rgba(20, 44, 38, 0.42)');
        scrim.addColorStop(1, 'rgba(24, 18, 12, 0.62)');
      }
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
    const isSandbox = Boolean(this.sim.state.sandboxMode);

    // 0. Classic Pikachu Sharp Rectangular Countdown Timer Bar right above the Board Tray
    ctx.save();
    const barBg = ctx.createLinearGradient(0, m.timerBarY, 0, m.timerBarY + m.timerBarH);
    barBg.addColorStop(0, 'rgba(20, 29, 25, 0.95)');
    barBg.addColorStop(1, 'rgba(10, 15, 13, 0.98)');
    ctx.fillStyle = barBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1.5;
    ctx.fillRect(m.timerBarX, m.timerBarY, m.timerBarW, m.timerBarH);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 0.85;
    ctx.strokeStyle =
      !isSandbox && engine.isTimeCritical ? 'rgba(239, 68, 68, 0.9)' : 'rgba(217, 119, 6, 0.72)';
    ctx.strokeRect(m.timerBarX + 0.5, m.timerBarY + 0.5, m.timerBarW - 1, m.timerBarH - 1);

    const ratio = isSandbox ? 1 : engine.timeProgressRatio;
    const timeText = isSandbox ? '⏱ ∞' : `⏱ ${engine.formatRemainingTime()}`;
    const sizeText = `${engine.rows}×${engine.cols}`;
    ctx.font = '700 11px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const leftLabelW = Math.ceil(ctx.measureText(timeText).width) + 14;
    const rightLabelW = Math.ceil(ctx.measureText(sizeText).width) + 12;

    ctx.fillStyle =
      !isSandbox && engine.isTimeCritical
        ? 0.5 + 0.5 * Math.sin(now * 0.014) > 0.45
          ? '#fecaca'
          : '#ef4444'
        : '#fef3c7';
    ctx.textAlign = 'left';
    ctx.fillText(timeText, m.timerBarX + 7, m.timerBarY + m.timerBarH * 0.5 + 0.5);

    ctx.fillStyle = 'rgba(253, 230, 138, 0.88)';
    ctx.textAlign = 'right';
    ctx.fillText(sizeText, m.timerBarX + m.timerBarW - 7, m.timerBarY + m.timerBarH * 0.5 + 0.5);

    const trackX = m.timerBarX + leftLabelW;
    const trackW = Math.max(48, m.timerBarW - leftLabelW - rightLabelW);
    const trackH = 8;
    const trackY = m.timerBarY + (m.timerBarH - trackH) * 0.5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
    ctx.fillRect(trackX, trackY, trackW, trackH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(trackX, trackY, trackW, trackH);

    if (ratio > 0.004) {
      const fillW = Math.max(2, Math.min(trackW, trackW * ratio));
      const fillGrad = ctx.createLinearGradient(trackX, trackY, trackX, trackY + trackH);
      if (!isSandbox && engine.isTimeCritical) {
        const pulseRed = 0.72 + 0.28 * Math.sin(now * 0.016);
        fillGrad.addColorStop(0, `rgba(252, 165, 165, ${pulseRed.toFixed(2)})`);
        fillGrad.addColorStop(1, `rgba(220, 38, 38, ${pulseRed.toFixed(2)})`);
      } else if (ratio <= 0.5) {
        fillGrad.addColorStop(0, '#fde047');
        fillGrad.addColorStop(1, '#d97706');
      } else {
        fillGrad.addColorStop(0, '#4ade80');
        fillGrad.addColorStop(1, '#16a34a');
      }
      ctx.fillStyle = fillGrad;
      ctx.fillRect(trackX, trackY, fillW, trackH);

      // Crisp top highlight strip
      ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.fillRect(trackX, trackY, fillW, trackH * 0.38);
    }
    ctx.restore();

    // 1. Classic Pikachu Sharp Rectangular Dark Recessed Board Tray (thin border, zero rounded corners)
    const isYuleOnet = this.isYuleSkinActive();
    ctx.save();
    const trayGrad = ctx.createLinearGradient(0, m.frameY, 0, m.frameY + m.frameH);
    if (isYuleOnet) {
      trayGrad.addColorStop(0, 'rgba(9, 44, 29, 0.95)');
      trayGrad.addColorStop(0.5, 'rgba(6, 32, 22, 0.96)');
      trayGrad.addColorStop(1, 'rgba(15, 23, 42, 0.97)');
    } else {
      trayGrad.addColorStop(0, 'rgba(17, 25, 22, 0.94)');
      trayGrad.addColorStop(0.5, 'rgba(12, 18, 16, 0.95)');
      trayGrad.addColorStop(1, 'rgba(8, 13, 12, 0.97)');
    }
    ctx.fillStyle = trayGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.48)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillRect(m.frameX, m.frameY, m.frameW, m.frameH);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = isYuleOnet ? 1.5 : 1;
    ctx.strokeStyle = isYuleOnet ? 'rgba(251, 191, 36, 0.88)' : 'rgba(217, 119, 6, 0.78)';
    ctx.strokeRect(m.frameX + 0.5, m.frameY + 0.5, m.frameW - 1, m.frameH - 1);

    // Subtle hairline inner corridor guide along the 1-cell walkable outer border
    ctx.strokeStyle = isYuleOnet ? 'rgba(186, 230, 253, 0.28)' : 'rgba(251, 191, 36, 0.16)';
    ctx.lineWidth = 0.65;
    ctx.strokeRect(m.originX - 2, m.originY - 2, m.boardW + 4, m.boardH + 4);
    ctx.restore();

    const activeRev =
      this.inspectingTurningPoint && engine.status === 'won'
        ? engine.getTurningPointReview()
        : null;

    // 2. Classic Sharp-Cornered Rectangular 3D Tiles (with smooth gravity/shift sliding)
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
        ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
        ctx.fillRect(hx + 1, hy + 1, m.cellW - 2, m.cellH - 2);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = '#fde047';
        ctx.strokeRect(hx + 1, hy + 1, m.cellW - 2, m.cellH - 2);
      }
      ctx.restore();
    }

    // 3. Hint Preview Polyline (if player used 🔍 Dò)
    if (engine.hintPath && engine.hintPath.length >= 2) {
      const hPts = engine.hintPath.map((wp) => this.onetPointToPixel(wp, engine, m));
      const pulse = 0.6 + 0.35 * Math.sin(now * 0.009);
      ctx.save();
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -(now * 0.032);
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulse.toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(hPts[0].x, hPts[0].y);
      for (let i = 1; i < hPts.length; i++) {
        ctx.lineTo(hPts[i].x, hPts[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Iconic Classic Pikachu 2003 Crimson-Red Electric Connection Line (<= 3 orthogonal segments)
    for (const beam of this.onetBeams) {
      if (beam.points.length < 2) continue;
      const t = Math.min(1, beam.age / beam.duration);
      const alpha = Math.max(0, 1 - t * t);
      ctx.save();
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';

      // Outer electric glow (Yule golden-ice starlight vs Classic crimson-red)
      ctx.shadowColor = isYuleOnet ? '#f59e0b' : '#dc2626';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = isYuleOnet ? '#f59e0b' : '#dc2626';
      ctx.globalAlpha = alpha * 0.9;
      ctx.lineWidth = 6.2 * (1 - t * 0.3);
      ctx.beginPath();
      ctx.moveTo(beam.points[0].x, beam.points[0].y);
      for (let i = 1; i < beam.points.length; i++) {
        ctx.lineTo(beam.points[i].x, beam.points[i].y);
      }
      ctx.stroke();

      // Mid vivid body
      ctx.shadowBlur = 0;
      ctx.strokeStyle = isYuleOnet ? '#38bdf8' : '#ef4444';
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 3.6 * (1 - t * 0.25);
      ctx.stroke();

      // Hot core
      ctx.strokeStyle = isYuleOnet ? '#fffbeb' : '#fff1f2';
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.5 * (1 - t * 0.25);
      ctx.stroke();

      // Crisp spark nodes at endpoints & 90° turns
      for (const pt of beam.points) {
        const outerR = 3.6 * (1 - t * 0.35);
        const innerR = 1.7 * (1 - t * 0.35);
        ctx.fillStyle = isYuleOnet ? '#fbbf24' : '#ef4444';
        ctx.fillRect(pt.x - outerR, pt.y - outerR, outerR * 2, outerR * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pt.x - innerR, pt.y - innerR, innerR * 2, innerR * 2);
      }

      if (!isSandbox && beam.bonusTimeSec && beam.bonusTimeSec > 0) {
        const endPt = beam.points[beam.points.length - 1];
        const riseY = endPt.y - 8 - t * 18;
        ctx.globalAlpha = Math.max(0, Math.min(1, (1 - t) * 1.35));
        ctx.font = '800 12px "Be Vietnam Pro", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(15, 23, 18, 0.92)';
        const label = `+${Math.round(beam.bonusTimeSec)}s`;
        ctx.strokeText(label, endPt.x, riseY);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(label, endPt.x, riseY);
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
    // Classic Pikachu 2003 sharp-cornered rectangular tile with thin hairline border & subtle bevel
    const seam = 0.25;
    let bx = x + seam;
    const by = y + seam;
    const bw = cellW - seam * 2;
    const bh = cellH - seam * 2;
    const lipRight = 1.1;
    const lipBottom = 1.6;

    if (isBlockedFlash) {
      bx += Math.sin(nowMs * 0.065) * 2.5;
    }

    ctx.save();

    // 1. Subtle 3D bottom-right bevel base (sharp 90° rectangle, zero rounded corners)
    ctx.fillStyle = isBlockedFlash
      ? '#991b1b'
      : isSelected
        ? '#15803d'
        : isHinted
          ? '#b45309'
          : '#b09a72';
    ctx.fillRect(bx, by, bw, bh);

    // 2. Top-left ivory-cream tile face (sharp 90° rectangle)
    const faceW = Math.max(4, bw - lipRight);
    const faceH = Math.max(4, bh - lipBottom);
    const faceGrad = ctx.createLinearGradient(bx, by, bx, by + faceH);
    if (isBlockedFlash) {
      faceGrad.addColorStop(0, '#fee2e2');
      faceGrad.addColorStop(1, '#fecaca');
    } else if (isSelected) {
      faceGrad.addColorStop(0, '#dcfce7');
      faceGrad.addColorStop(1, '#86efac');
    } else if (isHinted) {
      const p = 0.5 + 0.5 * Math.sin(nowMs * 0.01);
      faceGrad.addColorStop(0, '#fefce8');
      faceGrad.addColorStop(1, p > 0.5 ? '#fde047' : '#fef08a');
    } else if (isHovered) {
      faceGrad.addColorStop(0, '#ffffff');
      faceGrad.addColorStop(1, '#f8f0dc');
    } else {
      faceGrad.addColorStop(0, spDef.bgTop);
      faceGrad.addColorStop(1, spDef.bgBot);
    }
    ctx.fillStyle = faceGrad;
    ctx.fillRect(bx, by, faceW, faceH);

    // 3. Delicate 0.8px top & left white bevel highlight
    ctx.beginPath();
    ctx.moveTo(bx + 0.6, by + faceH - 0.6);
    ctx.lineTo(bx + 0.6, by + 0.6);
    ctx.lineTo(bx + faceW - 0.6, by + 0.6);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 4. Thin crisp outer tile border (square corners)
    const isYuleTile = this.isYuleSkinActive();
    if (isYuleTile && !isBlockedFlash) {
      ctx.fillStyle = 'rgba(240, 249, 255, 0.88)';
      ctx.fillRect(bx + 0.8, by + 0.8, Math.max(2, faceW - 1.6), Math.min(3.2, faceH * 0.11));
    }
    ctx.lineWidth = isSelected || isHinted ? 1.35 : isHovered ? 0.95 : 0.6;
    ctx.strokeStyle = isBlockedFlash
      ? '#dc2626'
      : isSelected
        ? '#16a34a'
        : isHinted
          ? '#dc2626'
          : isHovered
            ? '#d97706'
            : isYuleTile
              ? '#14532d'
              : '#7c6848';
    ctx.strokeRect(bx, by, bw, bh);

    // 5. Crisp Hang Sóc Creature / Magical Item Sprite centered cleanly on the sharp tile
    const spr = this.getSpriteImage(spDef.spriteKey);
    if (spr) {
      const maxW = (faceW - 1.6) * 0.9;
      const maxH = (faceH - 1.6) * 0.9;
      const aspect = spr.naturalWidth / Math.max(1, spr.naturalHeight);
      let dw = maxW;
      let dh = dw / Math.max(0.2, aspect);
      if (dh > maxH) {
        dh = maxH;
        dw = dh * aspect;
      }
      ctx.drawImage(
        spr,
        bx + (faceW - dw) * 0.5,
        by + (faceH - dh) * 0.5,
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
    const isYule = this.isYuleSkinActive();
    const bgImg =
      isYule && this.yuleCaroBgImage?.complete && this.yuleCaroBgImage.naturalWidth > 0
        ? this.yuleCaroBgImage
        : this.parlorBgImage;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
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
      const glaze = ctx.createLinearGradient(0, 0, 0, virtH);
      if (isYule) {
        glaze.addColorStop(0, 'rgba(69, 10, 18, 0.34)');
        glaze.addColorStop(0.5, 'rgba(10, 46, 29, 0.24)');
        glaze.addColorStop(1, 'rgba(30, 12, 16, 0.42)');
      } else {
        glaze.addColorStop(0, 'rgba(92, 46, 18, 0.24)');
        glaze.addColorStop(0.5, 'rgba(72, 34, 12, 0.16)');
        glaze.addColorStop(1, 'rgba(54, 25, 9, 0.34)');
      }
      ctx.fillStyle = glaze;
      ctx.fillRect(0, 0, virtW, virtH);
    } else {
      const woodBg = ctx.createLinearGradient(0, 0, 0, virtH);
      woodBg.addColorStop(0, isYule ? '#4c1118' : '#c88344');
      woodBg.addColorStop(0.5, isYule ? '#14532d' : '#a86432');
      woodBg.addColorStop(1, isYule ? '#092418' : '#7c431d');
      ctx.fillStyle = woodBg;
      ctx.fillRect(0, 0, virtW, virtH);
    }

    // Subtle inlaid brass tabletop border & corner studs
    drawRoundedRect(ctx, 6, 6, virtW - 12, virtH - 12, 14);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = isYule ? 'rgba(251, 191, 36, 0.52)' : 'rgba(253, 230, 138, 0.32)';
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
    ctx.clearRect(0, 0, virtW, virtH);
    if (this.isYuleSkinActive()) {
      ctx.save();
      const scrim = ctx.createLinearGradient(0, 0, 0, virtH);
      scrim.addColorStop(0, 'rgba(6, 40, 26, 0.24)');
      scrim.addColorStop(1, 'rgba(28, 12, 16, 0.3)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, virtW, virtH);
      ctx.restore();
    }
  }

  private drawSudokuScene(ctx: CanvasRenderingContext2D, engine: SudokuPuzzleEngine): void {
    const isYuleSudoku = this.isYuleSkinActive();
    const sm = this.getSudokuLayoutMetrics();
    const isPortraitSudoku = sm.variant !== 'landscape';
    const bX = sm.boardX;
    const bY = sm.boardY;
    const cPx = sm.cellPx;
    const bPx = sm.boardPx;
    const sel = engine.selected;
    const selVal = sel ? engine.grid[sel.r]?.[sel.c] ?? 0 : 0;
    const activeDigit =
      this.sudokuHoverPadDigit ?? (selVal > 0 ? selVal : engine.highlightDigit > 0 ? engine.highlightDigit : 0);

    // 1. Carved Hang Sóc Mahogany-Oak (or Yule Holly-Evergreen) Frame & Antique Brass Bezel around the 9×9 Board
    const framePad = sm.framePad;
    const fx = bX - framePad;
    const fy = bY - framePad;
    const fw = bPx + framePad * 2;
    const fh = bPx + framePad * 2;

    ctx.save();
    // 3D bottom lip & tabletop shadow
    drawRoundedRect(ctx, fx, fy + 2.5, fw, fh, 11);
    ctx.fillStyle = isYuleSudoku ? 'rgba(5, 28, 18, 0.62)' : 'rgba(24, 10, 4, 0.55)';
    ctx.shadowColor = 'rgba(20, 8, 3, 0.42)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Carved dark walnut-oak or Yule evergreen-holly frame body
    drawRoundedRect(ctx, fx, fy, fw, fh, 11);
    const frameGrad = ctx.createLinearGradient(0, fy, 0, fy + fh);
    if (isYuleSudoku) {
      frameGrad.addColorStop(0, '#14532d');
      frameGrad.addColorStop(0.48, '#0b3824');
      frameGrad.addColorStop(1, '#062417');
    } else {
      frameGrad.addColorStop(0, '#63371a');
      frameGrad.addColorStop(0.48, '#45230e');
      frameGrad.addColorStop(1, '#2b1407');
    }
    ctx.fillStyle = frameGrad;
    ctx.fill();

    // Antique brass outer rim
    ctx.lineWidth = 2;
    ctx.strokeStyle = isYuleSudoku ? '#fbbf24' : '#e5a93c';
    ctx.stroke();

    // Inner specular highlight rim
    drawRoundedRect(ctx, fx + 1.8, fy + 1.8, fw - 3.6, fh - 3.6, 9.5);
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = isYuleSudoku ? 'rgba(254, 243, 199, 0.42)' : 'rgba(254, 243, 199, 0.35)';
    ctx.stroke();

    // Parchment backing inside frame
    ctx.fillStyle = isYuleSudoku ? '#f8fcff' : '#fffdf6';
    ctx.fillRect(bX, bY, bPx, bPx);
    ctx.restore();

    // 2. Classic 9×9 Parchment Cells (Alternating 3×3 Warm Vellum + 4-State Golden-Amber Highlighting)
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cx = bX + c * cPx;
        const cy = bY + r * cPx;
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

        if (isSel) {
          const selGrad = ctx.createLinearGradient(0, cy, 0, cy + cPx);
          selGrad.addColorStop(0, isYuleSudoku ? '#bae6fd' : '#fef08a');
          selGrad.addColorStop(1, isYuleSudoku ? '#7dd3fc' : '#f7c948');
          ctx.fillStyle = selGrad;
        } else if (isSameVal) {
          ctx.fillStyle = isYuleSudoku ? '#fde68a' : '#fbd374';
        } else if (isHover) {
          ctx.fillStyle = isYuleSudoku ? '#e0f2fe' : '#f9e0a2';
        } else if (isPeer) {
          ctx.fillStyle = isYuleSudoku
            ? isEvenBox
              ? '#e6f4f1'
              : '#dceee9'
            : isEvenBox
              ? '#f2e2be'
              : '#ebd8b0';
        } else {
          ctx.fillStyle = isYuleSudoku
            ? isEvenBox
              ? '#f8fcff'
              : '#ebf5f0'
            : isEvenBox
              ? '#fffdf6'
              : '#f7edd6';
        }
        ctx.fillRect(cx, cy, cPx, cPx);

        // Subtle tactile ivory top-edge sheen on each parchment tile
        ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.fillRect(cx, cy, cPx, 1.2);

        if (isSameVal) {
          ctx.save();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = 'rgba(180, 83, 9, 0.55)';
          ctx.strokeRect(cx + 1.5, cy + 1.5, cPx - 3, cPx - 3);
          ctx.restore();
        }

        if (val >= 1 && val <= 9) {
          const midCellX = cx + cPx * 0.5;
          const midCellY = cy + cPx * 0.5 + 1;
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

          ctx.fillStyle = getSudokuDigitFillColor(isInitialClue, isYuleSudoku, isSel);
          ctx.fillText(String(val), midCellX, midCellY);
          const relicImg = this.getSudokuRelicImage(val);
          if (relicImg && cPx >= 36) {
            const rSz = Math.min(13.5, cPx * 0.27);
            ctx.globalAlpha = 0.88;
            ctx.drawImage(relicImg, cx + cPx - rSz - 1.5, cy + 1.5, rSz, rSz);
          }
          ctx.restore();
        } else {
          const mask = engine.notes[r][c];
          if (mask !== 0) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const subPx = cPx / 3;
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
      const x = bX + i * cPx;
      const y = bY + i * cPx;
      ctx.beginPath();
      ctx.moveTo(x, bY);
      ctx.lineTo(x, bY + bPx);
      ctx.moveTo(bX, y);
      ctx.lineTo(bX + bPx, y);
      ctx.stroke();
    }

    // Bold 3×3 box dividers in deep carved mahogany-walnut
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#43200d';
    for (const i of [3, 6]) {
      const x = bX + i * cPx;
      const y = bY + i * cPx;
      ctx.beginPath();
      ctx.moveTo(x, bY);
      ctx.lineTo(x, bY + bPx);
      ctx.moveTo(bX, y);
      ctx.lineTo(bX + bPx, y);
      ctx.stroke();
    }

    if (sel) {
      const sx = bX + sel.c * cPx;
      const sy = bY + sel.r * cPx;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isYuleSudoku ? '#0284c7' : '#b45309';
      ctx.strokeRect(sx + 1.25, sy + 1.25, cPx - 2.5, cPx - 2.5);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 251, 235, 0.85)';
      ctx.strokeRect(sx + 3, sy + 3, cPx - 6, cPx - 6);
    }

    // Inner recessed wood-brass border around 9×9 field
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#3b1c0a';
    ctx.strokeRect(bX, bY, bPx, bPx);
    ctx.restore();

    // Heirloom brass corner brackets on the outer wooden frame
    this.drawBrassCornerBrackets(ctx, fx + 1, fy + 1, fw - 2, fh - 2, 13);

    const rem = engine.getRemainingDigitCounts();

    // 4a. Portrait / Mobile: Adaptive Keypad (2-Row Thumb Deck on tall phones, Slim 1-Row Bar on compact screens)
    if (isPortraitSudoku) {
      this.sudokuPadRects.clear();
      this.sudokuActionRects.clear();

      const trayX = fx;
      const trayY = sm.trayY;
      const trayW = fw;
      const trayH = sm.trayH;

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

      const barX = bX;
      const barY = trayY + 3.5;
      const barW = bPx;
      const gap = 4;
      const btnW = (barW - gap * 8) / 9;
      const btnH = Math.max(34, trayH - 7);
      const isUltraCompact = btnH < 46;

      for (let d = 1; d <= 9; d++) {
        const bx = barX + (d - 1) * (btnW + gap);
        const by = barY;
        this.sudokuPadRects.set(d, { x: bx, y: by, w: btnW, h: btnH });

        const done = rem[d] === 0;
        const isKeyActive = activeDigit === d && !done;
        const isKeyHover = this.sudokuHoverPadDigit === d && !done;

        if (!done) {
          // Tactile 3D dark-walnut bottom lip
          drawRoundedRect(ctx, bx, by + 2, btnW, btnH, 8);
          ctx.fillStyle = '#1e0d04';
          ctx.fill();
        }

        drawRoundedRect(ctx, bx, by, btnW, btnH, 8);
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
        ctx.font = isUltraCompact
          ? '800 20px "Be Vietnam Pro", system-ui, -apple-system, sans-serif'
          : '800 24px "Be Vietnam Pro", system-ui, -apple-system, sans-serif';
        ctx.fillStyle = done
          ? 'rgba(253, 230, 138, 0.35)'
          : isKeyActive
            ? '#3b1806'
            : engine.pencilMode
              ? '#6b4423'
              : '#2b1407';
        ctx.fillText(
          String(d),
          bx + btnW * 0.5,
          isUltraCompact ? by + btnH * 0.39 : by + btnH * 0.4
        );

        const pillH = isUltraCompact ? 13 : 15;
        const pillY = by + btnH - pillH - 2.5;
        drawRoundedRect(ctx, bx + 4.5, pillY, btnW - 9, pillH, 4.5);
        ctx.fillStyle = done
          ? 'transparent'
          : isKeyActive
            ? 'rgba(59, 24, 6, 0.82)'
            : 'rgba(67, 32, 13, 0.82)';
        ctx.fill();

        ctx.font = '700 11px "Be Vietnam Pro", system-ui, sans-serif';
        ctx.fillStyle = done ? '#eab308' : '#fde68a';
        if (done) fillCheck(ctx, bx + btnW * 0.5, pillY + pillH * 0.5, isUltraCompact ? 7 : 8); else ctx.fillText(String(rem[d]), bx + btnW * 0.5, pillY + pillH * 0.53);
      }
      ctx.restore();
      return;
    }

    // 4b. Desktop / Landscape: Hang Sóc Carved Wood 3×3 Numpad Dock on Right (actions stay solely in DOM .pa-controls-bar)
    this.sudokuPadRects.clear();
    this.sudokuActionRects.clear();

    const padX = sm.padX;
    const padY = sm.padY;
    const padW = sm.padW;
    const padH = sm.padH;

    ctx.save();
    // 3D bottom lip & shadow under right dock
    drawRoundedRect(ctx, padX, padY + 2.5, padW, padH, 12);
    ctx.fillStyle = 'rgba(24, 10, 4, 0.52)';
    ctx.shadowColor = 'rgba(20, 8, 3, 0.38)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Carved mahogany-oak dock panel
    drawRoundedRect(ctx, padX, padY, padW, padH, 12);
    const dockGrad = ctx.createLinearGradient(0, padY, 0, padY + padH);
    dockGrad.addColorStop(0, '#5a3116');
    dockGrad.addColorStop(0.5, '#3e200d');
    dockGrad.addColorStop(1, '#261206');
    ctx.fillStyle = dockGrad;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e5a93c';
    ctx.stroke();

    drawRoundedRect(ctx, padX + 2, padY + 2, padW - 4, padH - 4, 10);
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.28)';
    ctx.stroke();

    const innerX = padX + 7;
    const innerW = padW - 14;
    const numGapX = 5;
    const numGapY = 8;
    const btnW = (innerW - numGapX * 2) / 3;
    const startY = padY + 10;
    const btnH = Math.floor((padH - 20 - numGapY * 2) / 3);

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

      // Top ivory specular gloss (drawn AFTER stroking the outer key so the gloss itself is unbordered)
      if (!done) {
        drawRoundedRect(ctx, bx + 2, by + 1.5, btnW - 4, 14, 7);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const padRelic = this.getSudokuRelicImage(d);
      if (padRelic && !done) {
        ctx.save();
        ctx.globalAlpha = 0.94;
        ctx.drawImage(padRelic, bx + btnW * 0.5 - 11.5, by + 7, 23, 23);
        ctx.restore();
      }
      ctx.font = padRelic && !done
        ? '800 28px "Be Vietnam Pro", system-ui, -apple-system, sans-serif'
        : '800 34px "Be Vietnam Pro", system-ui, -apple-system, sans-serif';
      ctx.fillStyle = done
        ? 'rgba(253, 230, 138, 0.3)'
        : isKeyActive
          ? '#3b1806'
          : engine.pencilMode
            ? '#6b4423'
            : '#2b1407';
      ctx.fillText(String(d), bx + btnW * 0.5, padRelic && !done ? by + btnH * 0.42 + 8 : by + btnH * 0.42);

      // Recessed dark-wood count pill at bottom of key
      const pillH = 24;
      const pillY = by + btnH - pillH - 10;
      drawRoundedRect(ctx, bx + 5, pillY, btnW - 10, pillH, 7);
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

      ctx.font = '700 12px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillStyle = done ? '#eab308' : '#fde68a';
      if (done) fillCheck(ctx, bx + btnW * 0.5, pillY + pillH * 0.5, 9.5); else ctx.fillText(String(rem[d]), bx + btnW * 0.5, pillY + pillH * 0.53);
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 5: DÒ MÌN PHÉP THUẬT — BẢN ĐỒ ĐẠO TẶC & PHÁ BẪY HOGWARTS (777 MÀN)
  // --------------------------------------------------------------------------

  private drawHogwartsMinesBackdrop(
    ctx: CanvasRenderingContext2D,
    virtW = PA_VIRTUAL_W,
    virtH = PA_VIRTUAL_H
  ): void {
    ctx.save();
    const isYule = this.isYuleSkinActive();
    const bgImg =
      this.hogwartsMinesBgImage &&
      this.hogwartsMinesBgImage.complete &&
      this.hogwartsMinesBgImage.naturalWidth > 0
        ? this.hogwartsMinesBgImage
        : isYule && this.yuleCaroBgImage?.complete && this.yuleCaroBgImage.naturalWidth > 0
          ? this.yuleCaroBgImage
          : this.parlorBgImage;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      const scale = Math.max(virtW / bgImg.naturalWidth, virtH / bgImg.naturalHeight);
      const dw = bgImg.naturalWidth * scale;
      const dh = bgImg.naturalHeight * scale;
      ctx.drawImage(bgImg, (virtW - dw) * 0.5, (virtH - dh) * 0.5, dw, dh);
      const glaze = ctx.createRadialGradient(
        virtW * 0.5,
        virtH * 0.52,
        Math.min(virtW, virtH) * 0.18,
        virtW * 0.5,
        virtH * 0.52,
        Math.max(virtW, virtH) * 0.72
      );
      if (isYule) {
        glaze.addColorStop(0, 'rgba(12, 30, 22, 0.14)');
        glaze.addColorStop(1, 'rgba(16, 10, 12, 0.42)');
      } else {
        glaze.addColorStop(0, 'rgba(28, 16, 9, 0.12)');
        glaze.addColorStop(1, 'rgba(15, 9, 5, 0.4)');
      }
      ctx.fillStyle = glaze;
      ctx.fillRect(0, 0, virtW, virtH);
    } else {
      const studyBg = ctx.createLinearGradient(0, 0, 0, virtH);
      studyBg.addColorStop(0, '#2a1810');
      studyBg.addColorStop(0.5, '#1e120c');
      studyBg.addColorStop(1, '#120a06');
      ctx.fillStyle = studyBg;
      ctx.fillRect(0, 0, virtW, virtH);
    }

    // Floating Hogwarts candlelight motes around the study edges
    const nowSec = performance.now() * 0.001;
    for (let i = 0; i < 10; i++) {
      const sideX = i % 2 === 0 ? 0.06 + (i * 0.021) : 0.94 - (i * 0.019);
      const mx = virtW * sideX + Math.sin(nowSec * 1.1 + i * 1.7) * 9;
      const my = virtH * (0.14 + ((i * 19) % 72) / 100) + Math.cos(nowSec * 0.9 + i) * 7;
      const alpha = 0.25 + 0.22 * Math.sin(nowSec * 2.4 + i * 1.3);
      ctx.beginPath();
      ctx.arc(mx, my, 2.2 + (i % 2) * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 224, 71, ${alpha.toFixed(2)})`;
      ctx.fill();
    }

    drawRoundedRect(ctx, 6, 6, virtW - 12, virtH - 12, 14);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = isYule ? 'rgba(251, 191, 36, 0.5)' : 'rgba(244, 198, 104, 0.36)';
    ctx.stroke();
    ctx.restore();
  }

  private drawMinesFlagGlyph(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    sz: number
  ): void {
    const isYule = this.isYuleSkinActive();
    const sealImg =
      this.getPaintingTokenImage(isYule ? 'caro-yule/phoenix_seal' : 'caro/phoenix_seal') ??
      this.getPaintingTokenImage('caro/phoenix_seal');

    ctx.save();
    // Golden Protego runic aura ring
    ctx.beginPath();
    ctx.arc(cx, cy, sz * 0.42, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.72)';
    ctx.lineWidth = Math.max(1.2, sz * 0.045);
    ctx.stroke();

    if (sealImg) {
      const sSz = sz * 0.82;
      ctx.drawImage(sealImg, cx - sSz * 0.5, cy - sSz * 0.5, sSz, sSz);
    } else {
      // Fallback Order of the Phoenix crimson-gold wax seal
      const waxGrad = ctx.createRadialGradient(cx - sz * 0.08, cy - sz * 0.08, sz * 0.05, cx, cy, sz * 0.36);
      waxGrad.addColorStop(0, '#ef4444');
      waxGrad.addColorStop(0.7, '#991b1b');
      waxGrad.addColorStop(1, '#450a0a');
      ctx.beginPath();
      ctx.arc(cx, cy, sz * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = waxGrad;
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = Math.max(1.5, sz * 0.06);
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      this.drawFourPointStar(ctx, cx, cy, sz * 0.2, sz * 0.07);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawMarauderHallowsWatermark(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number
  ): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.17)';
    ctx.lineWidth = Math.max(1, r * 0.14);
    ctx.lineJoin = 'round';
    // Cloak triangle
    const h = r * 1.55;
    const halfW = r * 0.92;
    const topY = cy - h * 0.54;
    const botY = cy + h * 0.46;
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx + halfW, botY);
    ctx.lineTo(cx - halfW, botY);
    ctx.closePath();
    ctx.stroke();
    // Resurrection Stone circle
    const inR = r * 0.44;
    ctx.beginPath();
    ctx.arc(cx, botY - inR, inR, 0, Math.PI * 2);
    ctx.stroke();
    // Elder Wand line
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx, botY);
    ctx.stroke();
    ctx.restore();
  }

  private drawMinesweeperScene(
    ctx: CanvasRenderingContext2D,
    engine: MinesweeperEngine
  ): void {
    const m = this.computeMinesBoardMetrics(engine);
    const now = performance.now();
    const nowSec = now * 0.001;
    const isYule = this.isYuleSkinActive();

    // 1. Hogwarts Gothic Mahogany & Marauder Brass Frame
    ctx.save();
    drawRoundedRect(ctx, m.frameX - 4, m.frameY - 4, m.frameW + 8, m.frameH + 8, 14);
    const frameGrad = ctx.createLinearGradient(0, m.frameY, 0, m.frameY + m.frameH);
    if (isYule) {
      frameGrad.addColorStop(0, '#14532d');
      frameGrad.addColorStop(0.5, '#0c3b22');
      frameGrad.addColorStop(1, '#051f13');
    } else {
      frameGrad.addColorStop(0, '#4a2412');
      frameGrad.addColorStop(0.5, '#2f1509');
      frameGrad.addColorStop(1, '#190a04');
    }
    ctx.fillStyle = frameGrad;
    ctx.shadowColor = 'rgba(8, 4, 2, 0.68)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const isFlagging = engine.flagMode && engine.status === 'playing';
    ctx.lineWidth = isFlagging ? 2.6 : 2.1;
    ctx.strokeStyle = isFlagging ? '#ef4444' : '#f4c668';
    ctx.stroke();

    // Inner filigree brass hairline
    drawRoundedRect(ctx, m.frameX, m.frameY, m.frameW, m.frameH, 11);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isFlagging ? 'rgba(254, 202, 202, 0.5)' : 'rgba(244, 198, 104, 0.42)';
    ctx.stroke();

    // Subtle animated Marauder's Map ink footsteps strolling along the top & bottom brass trim
    if (m.frameW >= 180) {
      const stepCount = 5;
      for (let s = 0; s < stepCount; s++) {
        const phase = (nowSec * 0.55 + s * 0.22) % 1;
        const alpha = Math.sin(phase * Math.PI) * 0.52;
        if (alpha > 0.05) {
          const fx = m.originX + 18 + phase * Math.max(40, m.boardW - 36);
          const fy = m.frameY + (s % 2 === 0 ? 2.4 : 4.2);
          ctx.save();
          ctx.fillStyle = `rgba(253, 230, 138, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.ellipse(fx, fy, 2.4, 1.2, 0.12, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(fx - 3.3, fy, 1.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Recessed Hogwarts dungeon slate & parchment bed
    drawRoundedRect(ctx, m.originX - 2, m.originY - 2, m.boardW + 4, m.boardH + 4, 7);
    ctx.fillStyle = isYule ? '#071f14' : '#1b0e07';
    ctx.fill();

    this.drawBrassCornerBrackets(
      ctx,
      m.frameX - 3,
      m.frameY - 3,
      m.frameW + 6,
      m.frameH + 6,
      14
    );

    // Hogwarts Spell-Ink Number Palette
    const NUMBER_COLORS: Record<number, string> = {
      1: '#1d4ed8', // Ravenclaw Sapphire
      2: '#047857', // Slytherin Emerald
      3: '#b91c1c', // Gryffindor Scarlet
      4: '#6d28d9', // Wizengamot Amethyst
      5: '#9a3412', // Dragonfire Rust
      6: '#0f766e', // Black Lake Teal
      7: '#312e81', // Astronomy Midnight
      8: '#854d0e', // Gringotts Gold
    };

    const darkMarkImg =
      this.getPaintingTokenImage(isYule ? 'caro-yule/dark_mark_seal' : 'caro/dark_mark_seal') ??
      this.getPaintingTokenImage('caro/dark_mark_seal') ??
      this.getSpriteImage('m3_sp_bomb');
    const horcruxShieldImg =
      this.getPaintingTokenImage('candy-hogwarts/candy-horcrux') ??
      this.getSpriteImage('m3_sp_bomb');
    const snitchImg = this.getSpriteImage('m3_sp_snitch') ?? this.getSpriteImage('ui_lock');
    const pad = Math.max(1, Math.round(m.cellSize * 0.04));

    for (let r = 0; r < engine.rows; r++) {
      for (let c = 0; c < engine.cols; c++) {
        const cell = engine.grid[r][c];
        const dc = m.transposed ? r : c;
        const dr = m.transposed ? c : r;
        const cx = m.originX + dc * m.cellSize;
        const cy = m.originY + dr * m.cellSize;
        const innerX = cx + pad;
        const innerY = cy + pad;
        const innerSz = m.cellSize - pad * 2;
        const midX = cx + m.cellSize * 0.5;
        const midY = cy + m.cellSize * 0.5;
        const isHovered =
          engine.status === 'playing' &&
          this.minesHoverCell?.r === r &&
          this.minesHoverCell?.c === c;
        const isHint =
          engine.lastHintCell?.r === r && engine.lastHintCell?.c === c;
        const isExploded =
          engine.explodedCell?.r === r && engine.explodedCell?.c === c;

        if (cell.revealed) {
          if (cell.hasMine) {
            drawRoundedRect(ctx, innerX, innerY, innerSz, innerSz, 5);
            const curseGrad = ctx.createRadialGradient(midX, midY, innerSz * 0.08, midX, midY, innerSz * 0.65);
            if (isExploded) {
              curseGrad.addColorStop(0, '#ef4444');
              curseGrad.addColorStop(0.55, '#991b1b');
              curseGrad.addColorStop(1, '#2b0909');
            } else {
              curseGrad.addColorStop(0, '#134e4a');
              curseGrad.addColorStop(1, '#091e1a');
            }
            ctx.fillStyle = curseGrad;
            ctx.fill();
            ctx.strokeStyle = isExploded ? '#fde047' : '#34d399';
            ctx.lineWidth = isExploded ? 1.8 : 1.2;
            ctx.stroke();

            if (darkMarkImg) {
              const bSz = innerSz * 0.82;
              ctx.drawImage(darkMarkImg, midX - bSz * 0.5, midY - bSz * 0.5, bSz, bSz);
            } else {
              ctx.beginPath();
              ctx.arc(midX, midY, innerSz * 0.28, 0, Math.PI * 2);
              ctx.fillStyle = '#10b981';
              ctx.fill();
            }
          } else {
            // Open Marauder's Map parchment cell
            drawRoundedRect(ctx, innerX, innerY, innerSz, innerSz, 4);
            ctx.fillStyle = (r + c) % 2 === 0 ? '#fbf4e2' : '#f3e5c8';
            ctx.fill();
            ctx.strokeStyle = isHint ? '#10b981' : 'rgba(146, 98, 49, 0.34)';
            ctx.lineWidth = isHint ? 2 : 0.9;
            ctx.stroke();

            if (cell.adjacentMines > 0) {
              const numColor = NUMBER_COLORS[cell.adjacentMines] ?? '#1e293b';
              if (cell.adjacentMines >= 3 && innerSz >= 24) {
                ctx.beginPath();
                ctx.arc(midX, midY, innerSz * 0.36, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(180, 83, 9, 0.18)';
                ctx.lineWidth = 1;
                ctx.stroke();
              }
              ctx.fillStyle = numColor;
              ctx.font = `800 ${Math.max(11, Math.round(innerSz * 0.56))}px "Be Vietnam Pro", system-ui, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(String(cell.adjacentMines), midX, midY + 1);
            }
          }
          continue;
        }

        // Unrevealed Sealed Marauder's Parchment & Ancient Rune Slab
        drawRoundedRect(ctx, innerX, innerY, innerSz, innerSz, 5);
        const tileGrad = ctx.createLinearGradient(innerX, innerY, innerX, innerY + innerSz);
        if (cell.defused) {
          tileGrad.addColorStop(0, '#a7f3d0');
          tileGrad.addColorStop(1, '#10b981');
        } else if (isHovered) {
          tileGrad.addColorStop(0, '#fef9c3');
          tileGrad.addColorStop(1, '#eab308');
        } else if ((r + c) % 2 === 0) {
          tileGrad.addColorStop(0, '#f3dfba');
          tileGrad.addColorStop(1, '#cfa972');
        } else {
          tileGrad.addColorStop(0, '#ead2a7');
          tileGrad.addColorStop(1, '#c39b63');
        }
        ctx.fillStyle = tileGrad;
        ctx.fill();

        ctx.strokeStyle = cell.defused
          ? '#065f46'
          : isHovered
            ? '#fde047'
            : 'rgba(255, 251, 235, 0.76)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (!cell.defused && !cell.flagged && !(engine.status === 'lost' && cell.hasMine) && engine.status !== 'won') {
          if (innerSz >= 24) {
            this.drawMarauderHallowsWatermark(ctx, midX, midY + 1, innerSz * 0.24);
          }
        }

        if (cell.defused) {
          if (horcruxShieldImg) {
            const bSz = innerSz * 0.72;
            ctx.drawImage(horcruxShieldImg, midX - bSz * 0.5, midY - bSz * 0.5, bSz, bSz);
          }
          ctx.fillStyle = '#064e3b';
          fillCheck(
            ctx,
            innerX + innerSz - Math.max(5, innerSz * 0.22),
            innerY + innerSz - Math.max(5, innerSz * 0.22),
            Math.max(7, innerSz * 0.3)
          );
        } else if (engine.status === 'lost' && cell.hasMine && !cell.flagged) {
          drawRoundedRect(ctx, innerX + 1, innerY + 1, innerSz - 2, innerSz - 2, 4);
          ctx.fillStyle = 'rgba(6, 78, 59, 0.58)';
          ctx.fill();
          if (darkMarkImg) {
            const bSz = innerSz * 0.78;
            ctx.save();
            ctx.globalAlpha = 0.92;
            ctx.drawImage(darkMarkImg, midX - bSz * 0.5, midY - bSz * 0.5, bSz, bSz);
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.arc(midX, midY, innerSz * 0.24, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.fill();
          }
        } else if (cell.flagged) {
          this.drawMinesFlagGlyph(ctx, midX, midY, innerSz);
          if (engine.status === 'lost' && !cell.hasMine) {
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = Math.max(2, innerSz * 0.08);
            ctx.beginPath();
            ctx.moveTo(innerX + innerSz * 0.2, innerY + innerSz * 0.2);
            ctx.lineTo(innerX + innerSz * 0.8, innerY + innerSz * 0.8);
            ctx.moveTo(innerX + innerSz * 0.8, innerY + innerSz * 0.2);
            ctx.lineTo(innerX + innerSz * 0.2, innerY + innerSz * 0.8);
            ctx.stroke();
          }
        } else if (engine.status === 'won' && cell.hasMine) {
          if (snitchImg) {
            const sSz = innerSz * 0.76;
            ctx.drawImage(snitchImg, midX - sSz * 0.5, midY - sSz * 0.5, sSz, sSz);
          } else {
            this.drawMinesFlagGlyph(ctx, midX, midY, innerSz);
          }
        }
      }
    }

    // Top Marauder's Map / Order of the Phoenix Crest Ribbon
    const badgeW = Math.min(m.frameW - 4, isFlagging ? 228 : 234);
    const ribbonText =
      badgeW < 205
        ? isFlagging
          ? 'PHONG ẤN • CẮM CỜ'
          : 'BẢN ĐỒ ĐẠO TẶC'
        : isFlagging
          ? 'PHONG ẤN PHƯỢNG HOÀNG • CẮM CỜ'
          : 'BẢN ĐỒ ĐẠO TẶC • PHÁ BẪY HẮC ÁM';
    const badgeH = 18;
    const bx = m.originX + (m.boardW - badgeW) * 0.5;
    const by = Math.max(2, m.frameY - 25);
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, 9);
    ctx.fillStyle = isFlagging
      ? '#991b1b'
      : isYule
        ? 'rgba(8, 42, 26, 0.94)'
        : 'rgba(42, 22, 11, 0.92)';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = isFlagging ? '#fde047' : '#f4c668';
    ctx.stroke();
    ctx.fillStyle = isFlagging ? '#fffbeb' : '#fde68a';
    ctx.font = '800 10px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ribbonText, bx + badgeW * 0.5, by + badgeH * 0.5, Math.max(80, badgeW - 14));

    if (engine.lastHintCell && engine.status === 'playing') {
      const pulse = 0.75 + 0.25 * Math.sin(now * 0.008);
      const hc = engine.lastHintCell;
      const dc = m.transposed ? hc.r : hc.c;
      const dr = m.transposed ? hc.c : hc.r;
      ctx.strokeStyle = `rgba(52, 211, 153, ${pulse.toFixed(2)})`;
      ctx.lineWidth = 2.6;
      drawRoundedRect(
        ctx,
        m.originX + dc * m.cellSize + 1,
        m.originY + dr * m.cellSize + 1,
        m.cellSize - 2,
        m.cellSize - 2,
        5
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 6: BẮN CÁ HỒ ĐEN — THỢ SĂN HỒ ĐEN HOGWARTS (777 MÀN)
  // --------------------------------------------------------------------------

  private drawFishShooterBackdrop(
    ctx: CanvasRenderingContext2D,
    virtW: number,
    virtH: number
  ): void {
    ctx.save();
    const img =
      this.blackLakeUnderwaterBgImage &&
      this.blackLakeUnderwaterBgImage.complete &&
      this.blackLakeUnderwaterBgImage.naturalWidth > 0
        ? this.blackLakeUnderwaterBgImage
        : this.lakeBgImage && this.lakeBgImage.complete && this.lakeBgImage.naturalWidth > 0
          ? this.lakeBgImage
          : this.unicornLakeBgImage;
    const imgReady = Boolean(img && img.complete && img.naturalWidth > 0);
    const cacheKey = `${virtW}x${virtH}:${imgReady ? img!.src : 'grad'}`;
    let drewCached = false;
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      if (!this.cachedFishBgCanvas || this.cachedFishBgKey !== cacheKey) {
        const off = this.cachedFishBgCanvas ?? document.createElement('canvas');
        off.width = Math.max(1, virtW);
        off.height = Math.max(1, virtH);
        const octx = off.getContext('2d');
        if (octx) {
          octx.imageSmoothingEnabled = true;
          octx.imageSmoothingQuality = 'high';
          if (imgReady && img) {
            const scale = Math.max(virtW / img.naturalWidth, virtH / img.naturalHeight);
            const dw = img.naturalWidth * scale;
            const dh = img.naturalHeight * scale;
            octx.drawImage(img, (virtW - dw) * 0.5, (virtH - dh) * 0.5, dw, dh);
            const deepTint = octx.createLinearGradient(0, 0, 0, virtH);
            deepTint.addColorStop(0, 'rgba(4, 42, 54, 0.24)');
            deepTint.addColorStop(0.6, 'rgba(4, 32, 46, 0.28)');
            deepTint.addColorStop(1, 'rgba(3, 16, 28, 0.48)');
            octx.fillStyle = deepTint;
            octx.fillRect(0, 0, virtW, virtH);
          } else {
            const lakeGrad = octx.createLinearGradient(0, 0, 0, virtH);
            lakeGrad.addColorStop(0, '#064e3b');
            lakeGrad.addColorStop(0.5, '#083344');
            lakeGrad.addColorStop(1, '#021724');
            octx.fillStyle = lakeGrad;
            octx.fillRect(0, 0, virtW, virtH);
          }
          this.cachedFishBgCanvas = off;
          this.cachedFishBgKey = cacheKey;
        }
      }
      if (this.cachedFishBgCanvas && this.cachedFishBgKey === cacheKey) {
        ctx.drawImage(this.cachedFishBgCanvas, 0, 0, virtW, virtH);
        drewCached = true;
      }
    }
    if (!drewCached) {
      if (imgReady && img) {
        const scale = Math.max(virtW / img.naturalWidth, virtH / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.drawImage(img, (virtW - dw) * 0.5, (virtH - dh) * 0.5, dw, dh);
        const deepTint = ctx.createLinearGradient(0, 0, 0, virtH);
        deepTint.addColorStop(0, 'rgba(4, 42, 54, 0.24)');
        deepTint.addColorStop(0.6, 'rgba(4, 32, 46, 0.28)');
        deepTint.addColorStop(1, 'rgba(3, 16, 28, 0.48)');
        ctx.fillStyle = deepTint;
        ctx.fillRect(0, 0, virtW, virtH);
      } else {
        const lakeGrad = ctx.createLinearGradient(0, 0, 0, virtH);
        lakeGrad.addColorStop(0, '#064e3b');
        lakeGrad.addColorStop(0.5, '#083344');
        lakeGrad.addColorStop(1, '#021724');
        ctx.fillStyle = lakeGrad;
        ctx.fillRect(0, 0, virtW, virtH);
      }
    }

    const now = performance.now() * 0.001;

    // Shimmering Scottish Black Lake emerald-moonlight shafts
    for (let i = 0; i < 4; i++) {
      const sway = Math.sin(now * 0.65 + i * 1.55) * 26;
      const topX = virtW * (0.16 + i * 0.22) + sway;
      const grad = ctx.createLinearGradient(topX, 0, topX + 34, virtH * 0.84);
      grad.addColorStop(0, 'rgba(110, 231, 183, 0.12)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(topX - 22, 0);
      ctx.lineTo(topX + 22, 0);
      ctx.lineTo(topX + 74, virtH * 0.85);
      ctx.lineTo(topX - 64, virtH * 0.85);
      ctx.closePath();
      ctx.fill();
    }

    // Swaying foreground Cỏ Mang Cá (Gillyweed) fronds on left & right lakebed corners
    const kelpAnchors = [0.04, 0.085, 0.915, 0.96];
    for (let k = 0; k < kelpAnchors.length; k++) {
      const kx = virtW * kelpAnchors[k];
      const kh = virtH * (k === 0 || k === 3 ? 0.34 : 0.26);
      const sway = Math.sin(now * 1.35 + k * 1.2) * 14;
      ctx.beginPath();
      ctx.moveTo(kx, virtH);
      ctx.quadraticCurveTo(kx + sway * 0.6, virtH - kh * 0.55, kx + sway, virtH - kh);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Rising Bubble-Head Charm (Bùa Đầu Bong Bóng) magical bubbles
    for (let i = 0; i < 12; i++) {
      const prog = (now * (0.11 + (i % 4) * 0.032) + i * 0.19) % 1;
      const bx = virtW * (0.07 + ((i * 83) % 86) / 100) + Math.sin(now * 1.9 + i) * 7;
      const by = virtH - prog * (virtH + 20);
      const rad = 2.4 + (i % 3) * 1.4;
      ctx.beginPath();
      ctx.arc(bx, by, rad, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.36)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(224, 242, 254, 0.14)';
      ctx.fill();
    }

    if (this.fishEngine && this.fishEngine.freezeTimer > 0) {
      ctx.fillStyle = 'rgba(125, 211, 252, 0.18)';
      ctx.fillRect(0, 0, virtW, virtH);
      // Drifting Glacius frost stars
      ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
      for (let f = 0; f < 8; f++) {
        const fx = virtW * (0.12 + f * 0.11) + Math.sin(now * 1.4 + f) * 12;
        const fy = virtH * (0.18 + ((f * 29) % 64) / 100);
        this.drawFourPointStar(ctx, fx, fy, 5, 1.8);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private drawFishEntity(
    ctx: CanvasRenderingContext2D,
    fish: SwimmingFish,
    cx: number,
    cy: number,
    unitScale: number,
    frozen: boolean,
    nowSec: number
  ): void {
    const def = FISH_SPECIES_CATALOG[fish.species];
    const r = Math.max(10, fish.radius * unitScale);
    const wag = Math.sin(fish.tailPhase) * 0.32;

    ctx.save();
    ctx.translate(cx, cy);

    // Underwater Black Lake shadow
    ctx.beginPath();
    ctx.ellipse(0, r * 0.74, r * 0.84, r * 0.26, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(2, 14, 22, 0.36)';
    ctx.fill();

    ctx.save();
    ctx.scale(fish.species === 'puffer_bomb' ? 1 : fish.dir, 1);

    const atlas =
      this.blackLakeCreaturesAtlas &&
      this.blackLakeCreaturesAtlas.complete &&
      this.blackLakeCreaturesAtlas.naturalWidth >= 1024
        ? this.blackLakeCreaturesAtlas
        : null;

    if (atlas) {
      // Painterly 2.5D Harry Potter Black Lake Creature Atlas (4×2 of 256×256)
      let cellCol = 0;
      let cellRow = 0;
      let sizeMult = 2.55;
      switch (fish.species) {
        case 'minnow': // Cá Plimpy Lam
          cellCol = 0;
          cellRow = 0;
          sizeMult = 2.5;
          break;
        case 'clown': // Quỷ Nước Grindylow
          cellCol = 1;
          cellRow = 0;
          sizeMult = 2.6;
          break;
        case 'emerald_koi': // Thủy Xà Slytherin
          cellCol = 2;
          cellRow = 0;
          sizeMult = 2.68;
          break;
        case 'moon_jelly': // Linh Quang Hộ Mệnh
          cellCol = 3;
          cellRow = 0;
          sizeMult = 2.62;
          break;
        case 'puffer_bomb': // Thủy Lôi Pháo Hoa Weasley
          cellCol = 0;
          cellRow = 1;
          sizeMult = 2.55;
          break;
        case 'golden_ray': // Snitch Thủy Hoàng Kim
          cellCol = 1;
          cellRow = 1;
          sizeMult = 2.68;
          break;
        case 'leviathan_carp': // Mực Khổng Lồ Hồ Đen (Boss)
          cellCol = 2;
          cellRow = 1;
          sizeMult = 2.95;
          break;
      }

      // Magical species-specific Hogwarts underwater aura behind sprite
      if (fish.species === 'leviathan_carp') {
        ctx.save();
        ctx.rotate(nowSec * 0.75);
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.24, 0, Math.PI * 2);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.76)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      } else if (fish.species === 'puffer_bomb') {
        const pulse = 1 + Math.sin(nowSec * 7.5 + fish.uid) * 0.07;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.12 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.68)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (fish.species === 'golden_ray') {
        for (let s = 1; s <= 3; s++) {
          ctx.beginPath();
          ctx.arc(
            -r * (0.65 + s * 0.28),
            Math.sin(nowSec * 7 + s) * r * 0.14,
            Math.max(1.4, r * (0.09 - s * 0.02)),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(253, 224, 71, 0.68)';
          ctx.fill();
        }
      } else if (fish.species === 'moon_jelly') {
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(186, 230, 253, 0.14)';
        ctx.fill();
      }

      const swimTilt =
        fish.species === 'puffer_bomb'
          ? Math.sin(nowSec * 3.5 + fish.uid) * 0.06
          : Math.sin(fish.tailPhase) * 0.085;
      const squash = 1 + Math.sin(fish.tailPhase * 1.35) * 0.032;
      ctx.save();
      ctx.rotate(swimTilt);
      ctx.scale(squash, 2 - squash);
      const dSz = r * sizeMult;
      ctx.drawImage(
        atlas,
        cellCol * 256,
        cellRow * 256,
        256,
        256,
        -dSz * 0.5,
        -dSz * 0.5,
        dSz,
        dSz
      );
      ctx.restore();

      if (fish.hitFlash > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.02, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(254, 249, 195, 0.36)';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (fish.species === 'leviathan_carp') {
      // BOSS: MỰC KHỔNG LỒ HỒ ĐEN (Giant Squid of Hogwarts)
      ctx.save();
      ctx.rotate(nowSec * 0.75);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.18, 0, Math.PI * 2);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.72)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 7 sweeping undulating tentacles with golden suction dots
      for (let t = -3; t <= 3; t++) {
        const baseY = t * r * 0.17;
        const wave1 = Math.sin(fish.tailPhase + t * 0.65) * r * 0.24;
        const wave2 = Math.cos(fish.tailPhase * 0.9 + t * 0.8) * r * 0.28;
        ctx.beginPath();
        ctx.moveTo(-r * 0.32, baseY);
        ctx.bezierCurveTo(
          -r * 0.85,
          baseY + wave1,
          -r * 1.32,
          baseY - wave2,
          -r * 1.68,
          baseY + wave1 * 0.75
        );
        ctx.strokeStyle = t % 2 === 0 ? '#be123c' : '#881337';
        ctx.lineWidth = Math.max(2.2, r * (0.14 - Math.abs(t) * 0.015));
        ctx.lineCap = 'round';
        ctx.stroke();

        // Golden suction ring spot
        ctx.beginPath();
        ctx.arc(-r * 0.92, baseY + wave1 * 0.45, Math.max(1.4, r * 0.048), 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
      }

      // Spearhead royal squid mantle & lateral fins
      ctx.beginPath();
      ctx.moveTo(r * 1.18, 0);
      ctx.quadraticCurveTo(r * 0.55, -r * 0.92, -r * 0.35, -r * 0.58);
      ctx.lineTo(-r * 0.52, 0);
      ctx.lineTo(-r * 0.35, r * 0.58);
      ctx.quadraticCurveTo(r * 0.55, r * 0.92, r * 1.18, 0);
      ctx.closePath();
      const sqGrad = ctx.createRadialGradient(r * 0.25, -r * 0.18, r * 0.1, 0, 0, r * 1.18);
      sqGrad.addColorStop(0, fish.hitFlash > 0 ? '#ffffff' : '#fda4af');
      sqGrad.addColorStop(0.52, fish.hitFlash > 0 ? '#fde047' : '#be123c');
      sqGrad.addColorStop(1, '#4c0519');
      ctx.fillStyle = sqGrad;
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#facc15';
      ctx.stroke();

      // Golden Hogwarts brow crown mark
      ctx.fillStyle = '#fde047';
      this.drawFourPointStar(ctx, r * 0.72, 0, r * 0.18, r * 0.07);
      ctx.fill();

      // Fierce glowing amber squid eye
      ctx.beginPath();
      ctx.arc(r * 0.28, -r * 0.2, Math.max(3.5, r * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(r * 0.31, -r * 0.2, Math.max(1.4, r * 0.06), Math.max(2.6, r * 0.15), 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
    } else if (fish.species === 'golden_ray') {
      // SNITCH THỦY HOÀNG KIM (Winged Golden Snitch Relic)
      const flutter = Math.sin(fish.tailPhase * 2.1);
      // Trailing golden stardust wake
      for (let s = 1; s <= 3; s++) {
        ctx.beginPath();
        ctx.arc(-r * (0.55 + s * 0.28), Math.sin(nowSec * 7 + s) * r * 0.14, Math.max(1.4, r * (0.09 - s * 0.02)), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(253, 224, 71, 0.65)';
        ctx.fill();
      }

      // Twin feathered silver-gold Snitch wings
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.scale(1, side);
        ctx.rotate(flutter * 0.34);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.22);
        ctx.quadraticCurveTo(-r * 0.55, -r * 1.38, -r * 1.35, -r * 0.98);
        ctx.quadraticCurveTo(-r * 0.85, -r * 0.42, -r * 0.18, -r * 0.12);
        ctx.closePath();
        const wGrad = ctx.createLinearGradient(0, -r * 0.2, -r * 1.25, -r * 1.1);
        wGrad.addColorStop(0, '#fef08a');
        wGrad.addColorStop(0.6, '#f8fafc');
        wGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = wGrad;
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Engraved 24k Golden Snitch sphere
      const coreR = r * 0.54;
      const gGrad = ctx.createRadialGradient(coreR * 0.28, -coreR * 0.28, coreR * 0.1, 0, 0, coreR);
      gGrad.addColorStop(0, fish.hitFlash > 0 ? '#ffffff' : '#fef9c3');
      gGrad.addColorStop(0.55, '#facc15');
      gGrad.addColorStop(1, '#a16207');
      ctx.beginPath();
      ctx.arc(r * 0.12, 0, coreR, 0, Math.PI * 2);
      ctx.fillStyle = gGrad;
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      // Engraved Snitch seam rings
      ctx.beginPath();
      ctx.arc(r * 0.12, 0, coreR * 0.68, -0.9, 0.9);
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else if (fish.species === 'puffer_bomb') {
      // THỦY LÔI PHÁO HOA WEASLEY (Weasleys' Wizard Wheezes Orb — 'W')
      const pulse = 1 + Math.sin(nowSec * 8 + fish.uid) * 0.06;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.12 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Brass studs around the cauldron-mine
      for (let i = 0; i < 8; i++) {
        const ang = (Math.PI / 4) * i + nowSec * 0.8;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * r * 0.88, Math.sin(ang) * r * 0.88, Math.max(2, r * 0.12), 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
      }

      // Royal purple & molten orange Weasley firework sphere
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
      const wOrb = ctx.createRadialGradient(-r * 0.22, -r * 0.24, r * 0.08, 0, 0, r * 0.86);
      wOrb.addColorStop(0, fish.hitFlash > 0 ? '#ffffff' : '#e879f9');
      wOrb.addColorStop(0.55, fish.hitFlash > 0 ? '#fde047' : '#7e22ce');
      wOrb.addColorStop(1, '#3b0764');
      ctx.fillStyle = wOrb;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#facc15';
      ctx.stroke();

      // Fizzing fuse spark on top
      ctx.fillStyle = '#fde047';
      this.drawFourPointStar(ctx, 0, -r * 0.96, r * 0.26 * pulse, r * 0.09);
      ctx.fill();

      // Iconic Golden 'W' (Weasley) crest
      ctx.fillStyle = '#fde047';
      ctx.font = `800 ${Math.max(10, Math.round(r * 0.72))}px "Be Vietnam Pro", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('W', 0, 1);
    } else if (fish.species === 'moon_jelly') {
      // LINH QUANG HỘ MỆNH (Expecto Patronum Silvery Spirit Wisp)
      const pulse = 1 + Math.sin(nowSec * 4.2 + fish.uid) * 0.09;
      for (let t = -2; t <= 2; t++) {
        const ty = t * r * 0.18;
        const wispWave = Math.sin(fish.tailPhase + t * 0.8) * r * 0.26;
        ctx.beginPath();
        ctx.moveTo(-r * 0.1, ty);
        ctx.quadraticCurveTo(-r * 0.72, ty + wispWave, -r * 1.32, ty - wispWave * 0.6);
        ctx.strokeStyle = t % 2 === 0 ? 'rgba(224, 242, 254, 0.85)' : 'rgba(125, 211, 252, 0.68)';
        ctx.lineWidth = Math.max(1.6, r * 0.1);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Translucent Patronus dome
      ctx.beginPath();
      ctx.ellipse(r * 0.12, 0, r * 0.78 * pulse, r * 0.68 * pulse, 0, -Math.PI * 0.55, Math.PI * 0.55);
      ctx.quadraticCurveTo(-r * 0.35, 0, r * 0.12, -r * 0.68 * pulse);
      ctx.closePath();
      const patGrad = ctx.createRadialGradient(r * 0.22, -r * 0.12, r * 0.08, 0, 0, r * 0.9);
      patGrad.addColorStop(0, '#ffffff');
      patGrad.addColorStop(0.55, 'rgba(125, 211, 252, 0.88)');
      patGrad.addColorStop(1, 'rgba(99, 102, 241, 0.55)');
      ctx.fillStyle = patGrad;
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Orbiting Patronus star-spark
      ctx.fillStyle = '#ffffff';
      this.drawFourPointStar(ctx, r * 0.35, 0, r * 0.22, r * 0.07);
      ctx.fill();
    } else if (fish.species === 'emerald_koi') {
      // THỦY XÀ SLYTHERIN (Slytherin Horned Water Serpent)
      // Sinuous segmented emerald-silver body
      for (let seg = 4; seg >= 0; seg--) {
        const sx = -seg * r * 0.32;
        const sy = Math.sin(fish.tailPhase - seg * 0.7) * r * 0.22;
        const sr = r * (0.46 - seg * 0.055);
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(3, sr), 0, Math.PI * 2);
        ctx.fillStyle = seg % 2 === 0 ? '#059669' : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // Serpent head + silver horns + forked scarlet tongue
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(r * 0.88, r * 0.05);
      ctx.lineTo(r * 1.18, r * 0.02 + wag * r * 0.2);
      ctx.lineTo(r * 1.28, -r * 0.06 + wag * r * 0.2);
      ctx.moveTo(r * 1.18, r * 0.02 + wag * r * 0.2);
      ctx.lineTo(r * 1.28, r * 0.1 + wag * r * 0.2);
      ctx.stroke();

      // Silver Slytherin horns
      ctx.beginPath();
      ctx.moveTo(r * 0.22, -r * 0.28);
      ctx.quadraticCurveTo(-r * 0.1, -r * 0.78, -r * 0.42, -r * 0.62);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = Math.max(2, r * 0.1);
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(r * 0.36, 0, r * 0.62, r * 0.44, 0, 0, Math.PI * 2);
      const serpGrad = ctx.createRadialGradient(r * 0.45, -r * 0.12, r * 0.08, r * 0.3, 0, r * 0.65);
      serpGrad.addColorStop(0, fish.hitFlash > 0 ? '#ffffff' : '#6ee7b7');
      serpGrad.addColorStop(0.6, '#047857');
      serpGrad.addColorStop(1, '#022c22');
      ctx.fillStyle = serpGrad;
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Glowing silver-gold serpent eye
      ctx.beginPath();
      ctx.arc(r * 0.56, -r * 0.12, Math.max(2.4, r * 0.14), 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.fillStyle = '#022c22';
      ctx.fillRect(r * 0.55, -r * 0.22, 1.6, r * 0.2);
    } else if (fish.species === 'clown') {
      // QUỶ NƯỚC GRINDYLOW (Black Lake Horned Water Demon)
      // 4 writhing grasping tentacles
      for (let t = -1.5; t <= 1.5; t += 1) {
        const ty = t * r * 0.22;
        const tw = Math.sin(fish.tailPhase * 1.2 + t) * r * 0.26;
        ctx.beginPath();
        ctx.moveTo(-r * 0.2, ty);
        ctx.quadraticCurveTo(-r * 0.78, ty + tw, -r * 1.28, ty - tw * 0.5);
        ctx.strokeStyle = '#4d7c0f';
        ctx.lineWidth = Math.max(1.8, r * 0.11);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Twin dark curved Grindylow horns
      ctx.strokeStyle = '#1a2e05';
      ctx.lineWidth = Math.max(2, r * 0.11);
      ctx.beginPath();
      ctx.moveTo(r * 0.18, -r * 0.36);
      ctx.quadraticCurveTo(-r * 0.08, -r * 0.92, -r * 0.34, -r * 0.78);
      ctx.moveTo(r * 0.36, -r * 0.28);
      ctx.quadraticCurveTo(r * 0.16, -r * 0.82, -r * 0.08, -r * 0.74);
      ctx.stroke();

      // Bulbous pale-green Grindylow head-torso
      ctx.beginPath();
      ctx.ellipse(r * 0.2, 0, r * 0.76, r * 0.58, 0, 0, Math.PI * 2);
      const grGrad = ctx.createRadialGradient(r * 0.32, -r * 0.16, r * 0.08, r * 0.15, 0, r * 0.8);
      grGrad.addColorStop(0, fish.hitFlash > 0 ? '#ffffff' : '#d9f99d');
      grGrad.addColorStop(0.6, fish.hitFlash > 0 ? '#fde047' : '#65a30d');
      grGrad.addColorStop(1, '#365314');
      ctx.fillStyle = grGrad;
      ctx.fill();
      ctx.strokeStyle = '#1a2e05';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Fierce glowing yellow Grindylow eye
      ctx.beginPath();
      ctx.arc(r * 0.52, -r * 0.12, Math.max(2.6, r * 0.18), 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(r * 0.56, -r * 0.12, Math.max(1.2, r * 0.08), 0, Math.PI * 2);
      ctx.fillStyle = '#1a2e05';
      ctx.fill();
    } else {
      // CÁ PLIMPY LAM (Magical Plimpy of the Black Lake — round body + 2 kicking webbed legs!)
      for (const leg of [-1, 1]) {
        const kick = Math.sin(fish.tailPhase * 1.3 + leg) * r * 0.25;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = Math.max(1.8, r * 0.11);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-r * 0.55, leg * r * 0.24);
        ctx.lineTo(-r * 1.05, leg * r * 0.36 + kick);
        ctx.lineTo(-r * 1.28, leg * r * 0.22 + kick);
        ctx.stroke();
      }

      // Glowing dorsal spell-lure antenna
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(r * 0.1, -r * 0.62);
      ctx.quadraticCurveTo(r * 0.45, -r * 1.05, r * 0.68, -r * 0.78);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(r * 0.68, -r * 0.78, Math.max(2, r * 0.13), 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();

      // Plump spherical Plimpy body
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.88, r * 0.74, 0, 0, Math.PI * 2);
      const plGrad = ctx.createRadialGradient(r * 0.22, -r * 0.18, r * 0.08, 0, 0, r * 0.92);
      plGrad.addColorStop(0, fish.hitFlash > 0 ? '#ffffff' : def.bellyColor);
      plGrad.addColorStop(0.58, fish.hitFlash > 0 ? '#fde047' : def.bodyColor);
      plGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = plGrad;
      ctx.fill();
      ctx.strokeStyle = frozen ? '#bae6fd' : '#082f49';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Big expressive Plimpy eye
      ctx.beginPath();
      ctx.arc(r * 0.44, -r * 0.14, Math.max(2.5, r * 0.19), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(r * 0.48, -r * 0.14, Math.max(1.3, r * 0.1), 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
    }

    ctx.restore(); // end flip scale

    // Frost shimmer crystal ring when Glacius is active
    if (frozen) {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.06, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.88)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Mini HP bar above multi-HP damaged creature or Giant Squid boss
    if ((fish.maxHp > 1 && fish.hp < fish.maxHp) || fish.species === 'leviathan_carp') {
      const barW = Math.max(24, r * 1.45);
      const barH = 4.5;
      const bx = -barW * 0.5;
      const topExtentMult =
        fish.species === 'leviathan_carp'
          ? 1.42
          : fish.species === 'golden_ray' || fish.species === 'emerald_koi'
            ? 1.34
            : fish.species === 'moon_jelly' || fish.species === 'clown'
              ? 1.28
              : 1.24;
      const by = -r * topExtentMult - 7;
      const hpRatio = Math.max(0, Math.min(1, fish.hp / Math.max(1, fish.maxHp)));
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
      ctx.fillStyle =
        hpRatio < 0.35 ? '#fb7185' : fish.species === 'leviathan_carp' ? '#facc15' : '#34d399';
      ctx.fillRect(bx, by, barW * hpRatio, barH);
    }

    ctx.restore();
  }

  private drawFishShooterScene(
    ctx: CanvasRenderingContext2D,
    engine: FishShooterEngine
  ): void {
    const virt = this.getVirtualCanvasSize();
    const vp = this.getFishViewportMetrics(virt.w, virt.h);
    const now = performance.now();
    const nowSec = now * 0.001;
    const isSandbox = Boolean(this.sim.state.sandboxMode);
    const toX = (ax: number) => vp.offsetX + ax * vp.scale;
    const toY = (ay: number) => vp.offsetY + ay * vp.scale;

    // 0A. Top Dedicated Countdown Timer Bar right above the lake frame
    ctx.save();
    drawRoundedRect(ctx, vp.timerBarX, vp.timerBarY, vp.timerBarW, vp.timerBarH, 8);
    const tBg = ctx.createLinearGradient(0, vp.timerBarY, 0, vp.timerBarY + vp.timerBarH);
    tBg.addColorStop(0, 'rgba(7, 30, 46, 0.95)');
    tBg.addColorStop(1, 'rgba(4, 18, 30, 0.98)');
    ctx.fillStyle = tBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1.5;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle =
      !isSandbox && engine.isTimeCritical
        ? 'rgba(239, 68, 68, 0.92)'
        : engine.timeFlashTimer > 0
          ? 'rgba(52, 211, 153, 0.92)'
          : 'rgba(103, 232, 249, 0.62)';
    ctx.stroke();

    // Crisp vector stopwatch icon (no emoji)
    const swX = vp.timerBarX + 14;
    const swY = vp.timerBarY + vp.timerBarH * 0.5 + 0.5;
    const swColor =
      !isSandbox && engine.isTimeCritical
        ? '#fca5a5'
        : engine.timeFlashTimer > 0
          ? '#6ee7b7'
          : '#67e8f9';
    ctx.strokeStyle = swColor;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(swX, swY, 5.2, 0, Math.PI * 2);
    ctx.moveTo(swX - 2, swY - 6.8);
    ctx.lineTo(swX + 2, swY - 6.8);
    ctx.moveTo(swX, swY - 5.2);
    ctx.lineTo(swX, swY);
    ctx.lineTo(swX + 2.8, swY + 1.4);
    ctx.stroke();

    const timeText = isSandbox
      ? '∞'
      : `${engine.formatRemainingTime()}${engine.timeFlashTimer > 0 && engine.lastBonusSecAdded > 0 ? ` (+${engine.lastBonusSecAdded}s)` : ''}`;
    const rightText = vp.timerBarW >= 340 ? '+giây khi thu phục' : '+s/thu';
    ctx.font = '800 11px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const timeTextStartX = vp.timerBarX + 24;
    const leftW = 24 + Math.ceil(ctx.measureText(timeText).width) + 10;
    const rightW = Math.ceil(ctx.measureText(rightText).width) + 14;

    ctx.fillStyle =
      !isSandbox && engine.isTimeCritical
        ? 0.5 + 0.5 * Math.sin(now * 0.014) > 0.45
          ? '#fecaca'
          : '#f87171'
        : engine.timeFlashTimer > 0
          ? '#6ee7b7'
          : '#fef3c7';
    ctx.textAlign = 'left';
    ctx.fillText(timeText, timeTextStartX, vp.timerBarY + vp.timerBarH * 0.5);

    ctx.fillStyle = 'rgba(186, 230, 253, 0.9)';
    ctx.font = '700 10px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(rightText, vp.timerBarX + vp.timerBarW - 8, vp.timerBarY + vp.timerBarH * 0.5);

    const trackX = vp.timerBarX + leftW;
    const trackW = Math.max(40, vp.timerBarW - leftW - rightW);
    const trackH = 7;
    const trackY = vp.timerBarY + (vp.timerBarH - trackH) * 0.5;
    drawRoundedRect(ctx, trackX, trackY, trackW, trackH, 3.5);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
    ctx.fill();

    const tRatio = isSandbox ? 1 : engine.timeProgressRatio;
    if (tRatio > 0.005) {
      const fillW = Math.max(4, Math.min(trackW, trackW * tRatio));
      drawRoundedRect(ctx, trackX, trackY, fillW, trackH, 3.5);
      const tFill = ctx.createLinearGradient(trackX, trackY, trackX + fillW, trackY);
      if (!isSandbox && engine.isTimeCritical) {
        tFill.addColorStop(0, '#fca5a5');
        tFill.addColorStop(1, '#dc2626');
      } else if (engine.timeFlashTimer > 0) {
        tFill.addColorStop(0, '#6ee7b7');
        tFill.addColorStop(1, '#10b981');
      } else if (tRatio <= 0.45) {
        tFill.addColorStop(0, '#fde047');
        tFill.addColorStop(1, '#f59e0b');
      } else {
        tFill.addColorStop(0, '#38bdf8');
        tFill.addColorStop(1, '#22c55e');
      }
      ctx.fillStyle = tFill;
      ctx.fill();
    }
    ctx.restore();

    // 0B. Hogwarts Runic Ward Boundary Frame (shows exact spell-ricochet wall limits)
    ctx.save();
    const wardX = toX(10);
    const wardY = toY(12);
    const wardW = (FISH_ARENA_W - 20) * vp.scale;
    const wardH = (FISH_ARENA_H - 30) * vp.scale;
    drawRoundedRect(ctx, wardX, wardY, wardW, wardH, 12);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle =
      engine.freezeTimer > 0
        ? 'rgba(186, 230, 253, 0.65)'
        : 'rgba(244, 198, 104, 0.36)';
    ctx.stroke();
    this.drawBrassCornerBrackets(ctx, wardX, wardY, wardW, wardH, 12);
    ctx.restore();

    // 1. Swimming Black Lake Magical Creatures
    const frozen = engine.freezeTimer > 0;
    for (const fish of engine.fishList) {
      this.drawFishEntity(ctx, fish, toX(fish.x), toY(fish.y), vp.unitScale, frozen, nowSec);
    }

    // 2. Expanding Hogwarts Runic Binding Circles (Incarcerous) & Weasley Firework Blasts
    for (const net of engine.nets) {
      const t = Math.min(1, net.age / net.duration);
      const alpha = Math.max(0, 1 - t);
      const nx = toX(net.x);
      const ny = toY(net.y);
      const rad = net.radius * (0.45 + t * 0.65) * vp.unitScale;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(nx, ny, rad, 0, Math.PI * 2);
      ctx.fillStyle = net.isExplosion
        ? 'rgba(249, 115, 22, 0.28)'
        : net.tier === 3
          ? 'rgba(250, 204, 21, 0.24)'
          : net.tier === 2
            ? 'rgba(192, 132, 252, 0.22)'
            : 'rgba(251, 113, 133, 0.22)';
      ctx.fill();
      ctx.lineWidth = net.isExplosion ? 3.2 : 2.2;
      ctx.strokeStyle = net.isExplosion
        ? '#fde047'
        : net.tier === 3
          ? '#fde047'
          : net.tier === 2
            ? '#e879f9'
            : '#fda4af';
      ctx.stroke();

      if (net.isExplosion) {
        // Weasley Wildfire Whiz-Bang firework rays & stars
        for (let i = 0; i < 8; i++) {
          const ang = (Math.PI / 4) * i + t * 0.8;
          ctx.beginPath();
          ctx.moveTo(nx + Math.cos(ang) * rad * 0.25, ny + Math.sin(ang) * rad * 0.25);
          ctx.lineTo(nx + Math.cos(ang) * rad * 0.96, ny + Math.sin(ang) * rad * 0.96);
          ctx.strokeStyle = i % 2 === 0 ? '#fde047' : '#e879f9';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else {
        // Rotating Hogwarts 6-point Arcane Hexagram & inner rune circle
        ctx.beginPath();
        ctx.arc(nx, ny, rad * 0.68, 0, Math.PI * 2);
        ctx.lineWidth = 1.1;
        ctx.stroke();

        for (let tri = 0; tri < 2; tri++) {
          ctx.beginPath();
          for (let v = 0; v < 3; v++) {
            const ang = t * 1.4 + tri * (Math.PI / 3) + v * ((Math.PI * 2) / 3);
            const vx = nx + Math.cos(ang) * rad * 0.68;
            const vy = ny + Math.sin(ang) * rad * 0.68;
            if (v === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 3. Flying Wand Spell-Bolts (Stupefy / Protego / Expecto Patronum)
    for (const b of engine.bolts) {
      const bx = toX(b.x);
      const by = toY(b.y);
      const rad = (5 + b.tier * 2) * vp.unitScale;
      const ang = Math.atan2(b.vy, b.vx);
      const coreColor = b.tier === 3 ? '#fde047' : b.tier === 2 ? '#c084fc' : '#fb7185';
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(ang);

      // Luminous spell comet trail
      const tailLen = rad * (2.9 + b.tier * 0.55);
      const tailGrad = ctx.createLinearGradient(-tailLen, 0, rad * 0.5, 0);
      tailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      tailGrad.addColorStop(1, coreColor);
      ctx.fillStyle = tailGrad;
      ctx.beginPath();
      ctx.moveTo(-tailLen, 0);
      ctx.lineTo(0, -rad * 0.58);
      ctx.lineTo(0, rad * 0.58);
      ctx.closePath();
      ctx.fill();

      // Blazing spell core
      const orbGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, rad * 1.4);
      orbGrad.addColorStop(0, '#ffffff');
      orbGrad.addColorStop(0.55, coreColor);
      orbGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rad * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 4-point wand spark star at tip
      ctx.fillStyle = '#ffffff';
      this.drawFourPointStar(ctx, rad * 0.2, 0, rad * 0.95, rad * 0.32);
      ctx.fill();
      ctx.restore();
    }

    // 4. Top Black Lake Score & Target Arcane Gauge Bar (drawn ABOVE creatures & bolts so text is never occluded)
    ctx.save();
    const hudW = Math.min(vp.arenaPxW - 24, 440);
    const hudX = vp.offsetX + (vp.arenaPxW - hudW) * 0.5;
    const hudY = vp.offsetY + 6;
    const hudH = 22;
    drawRoundedRect(ctx, hudX, hudY, hudW, hudH, 11);
    ctx.fillStyle = 'rgba(6, 28, 36, 0.92)';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(244, 198, 104, 0.78)';
    ctx.stroke();

    const ratio = Math.max(0, Math.min(1, engine.score / Math.max(1, engine.targetScore)));
    if (ratio > 0.01) {
      drawRoundedRect(ctx, hudX + 3, hudY + 3, Math.max(8, (hudW - 6) * ratio), hudH - 6, 8);
      const barGrad = ctx.createLinearGradient(hudX, hudY, hudX + hudW, hudY);
      barGrad.addColorStop(0, '#059669');
      barGrad.addColorStop(0.55, '#14b8a6');
      barGrad.addColorStop(1, '#facc15');
      ctx.fillStyle = barGrad;
      ctx.fill();
    }

    ctx.fillStyle = '#fffbeb';
    ctx.font = '800 11px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const sep = hudW < 360 ? ' • ' : '  •  ';
    const scoreLbl = `${engine.score.toLocaleString('vi-VN')} / ${engine.targetScore.toLocaleString('vi-VN')} điểm${
      engine.combo >= 2 ? `${sep}COMBO ×${engine.combo}` : ''
    }${engine.freezeTimer > 0 ? `${sep}GLACIUS ${Math.ceil(engine.freezeTimer)}s` : ''}`;
    ctx.fillText(scoreLbl, hudX + hudW * 0.5, hudY + hudH * 0.5, Math.max(120, hudW - 18));
    ctx.restore();

    // 5. Arcane Spell Aim Line & Runic Reticle (when playing)
    const tx = toX(engine.turretX);
    const ty = toY(engine.turretY);
    const ax = toX(engine.aimX);
    const ay = toY(engine.aimY);
    if (engine.status === 'playing') {
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.44)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(ax, ay, 11, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.82)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      this.drawFourPointStar(ctx, ax, ay, 5.5, 1.8);
      ctx.fill();
      ctx.restore();
    }

    // 6. Bottom-Center Hogwarts Elder Wand Arcane Pedestal (Đài Đũa Phép Cơm Nguội)
    ctx.save();
    const baseR = Math.max(22, 26 * vp.unitScale);
    const screenAngle = Math.atan2(ay - ty, ax - tx);
    const wandGemColor =
      engine.cannonTier === 3 ? '#fde047' : engine.cannonTier === 2 ? '#e879f9' : '#fb7185';

    // Rotating Hogwarts runic aura ring on the lakebed plinth
    ctx.save();
    ctx.translate(tx, ty + 2);
    ctx.rotate(nowSec * 0.55);
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 1.34, Math.PI * 1.05, Math.PI * 1.95);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Carved Hogwarts Gothic Brass & Obsidian Dais
    ctx.beginPath();
    ctx.arc(tx, ty + 8, baseR * 1.24, Math.PI, 0);
    ctx.closePath();
    const pedGrad = ctx.createLinearGradient(tx - baseR, ty - baseR, tx + baseR, ty + 14);
    pedGrad.addColorStop(0, '#facc15');
    pedGrad.addColorStop(0.45, '#78350f');
    pedGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = pedGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // Rotating Elder Wand (Đũa Phép Cơm Nguội with sculpted berry knots & spell-crystal tip)
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(screenAngle + Math.PI * 0.5);
    const recoilOffset = engine.cannonRecoil * 7;
    ctx.translate(0, recoilOffset);

    const wandLen = baseR * 1.95;
    const wandAtlas =
      this.blackLakeCreaturesAtlas &&
      this.blackLakeCreaturesAtlas.complete &&
      this.blackLakeCreaturesAtlas.naturalWidth >= 1024
        ? this.blackLakeCreaturesAtlas
        : null;

    if (wandAtlas) {
      const wBox = wandLen * 1.62;
      ctx.drawImage(wandAtlas, 3 * 256, 1 * 256, 256, 256, -wBox * 0.5, -wandLen * 1.24, wBox, wBox);
    } else {
      // Tapered carved elder-wood shaft fallback
      const shaftGrad = ctx.createLinearGradient(-baseR * 0.18, 0, baseR * 0.18, 0);
      shaftGrad.addColorStop(0, '#78350f');
      shaftGrad.addColorStop(0.5, '#d97706');
      shaftGrad.addColorStop(1, '#3f1d0b');
      ctx.fillStyle = shaftGrad;
      ctx.beginPath();
      ctx.moveTo(-baseR * 0.19, baseR * 0.25);
      ctx.lineTo(-baseR * 0.07, -wandLen);
      ctx.lineTo(baseR * 0.07, -wandLen);
      ctx.lineTo(baseR * 0.19, baseR * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      for (const ky of [0.05, -0.38, -0.82, -1.26]) {
        const kr = baseR * (ky > -0.5 ? 0.19 : 0.15);
        ctx.beginPath();
        ctx.arc(0, baseR * ky, kr, 0, Math.PI * 2);
        ctx.fillStyle = '#92400e';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Blazing spell-tip aura at wand tip (color-coded by wand tier ×1/×2/×3)
    const tipGlow = ctx.createRadialGradient(0, -wandLen, 1, 0, -wandLen, baseR * 0.52);
    tipGlow.addColorStop(0, wandAtlas ? 'rgba(255, 255, 255, 0.55)' : '#ffffff');
    tipGlow.addColorStop(0.45, wandGemColor);
    tipGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = tipGlow;
    ctx.beginPath();
    ctx.arc(0, -wandLen, baseR * 0.52, 0, Math.PI * 2);
    ctx.fill();
    if (!wandAtlas) {
      ctx.fillStyle = '#ffffff';
      this.drawFourPointStar(ctx, 0, -wandLen, baseR * 0.28, baseR * 0.09);
      ctx.fill();
    }
    ctx.restore();

    // Tier badge on the Hogwarts wand pedestal
    const badgeW = 68;
    const badgeH = 18;
    drawRoundedRect(ctx, tx - badgeW * 0.5, ty + 6, badgeW, badgeH, 9);
    ctx.fillStyle = '#1c1917';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#fde047';
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = '800 10px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`ĐÀI ĐŨA ×${engine.cannonTier}`, tx, ty + 15);
    ctx.restore();

    // 7. Floating "+Points" Catch Popups
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const pop of engine.popups) {
      const alpha = Math.max(0, 1 - pop.age / pop.duration);
      ctx.globalAlpha = alpha;
      ctx.font = '800 13px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.lineWidth = 3;
      ctx.strokeText(pop.text, toX(pop.x), toY(pop.y));
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, toX(pop.x), toY(pop.y));
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER & SMART TRAY: TRANH GHÉP PHÉP THUẬT (9 -> 2.000 MẢNH, ZOOM 600%)
  // --------------------------------------------------------------------------

  private cleanupJigsawTrayDrag(): void {
    if (this.jigsawTrayDragState?.ghostEl) {
      this.jigsawTrayDragState.ghostEl.remove();
    }
    this.jigsawTrayDragState = null;
  }

  private computeJigsawBoardMetrics(engine: MasterJigsawEngine): {
    timerBarX: number;
    timerBarY: number;
    timerBarW: number;
    timerBarH: number;
    frameX: number;
    frameY: number;
    frameW: number;
    frameH: number;
    boardX: number;
    boardY: number;
    boardW: number;
    boardH: number;
    boardAspect: number;
    cellW: number;
    cellH: number;
  } {
    const virt = this.getVirtualCanvasSize();
    const minDim = Math.min(virt.w, virt.h);
    const timerBarH = minDim < 380 ? 13 : 15;
    const timerGap = 2;
    const timerTotal = timerBarH + timerGap;
    const framePad = Math.max(3, Math.min(6, Math.round(minDim * 0.009)));
    const outerMargin = 2;
    const availW = Math.max(120, virt.w - (outerMargin + framePad) * 2);
    const availH = Math.max(96, virt.h - timerTotal - (outerMargin + framePad) * 2);
    const boardAspect = resolveJigsawBoardAspect(engine.rows, engine.cols, availW, availH);

    let boardW = availW;
    let boardH = boardW / boardAspect;
    if (boardH > availH) {
      boardH = availH;
      boardW = boardH * boardAspect;
    }

    const frameW = boardW + framePad * 2;
    const frameH = boardH + framePad * 2;
    const totalH = timerTotal + frameH;
    const topY = Math.max(1, (virt.h - totalH) * 0.5);
    const frameX = (virt.w - frameW) * 0.5;
    const frameY = topY + timerTotal;
    const boardX = frameX + framePad;
    const boardY = frameY + framePad;
    const timerBarW = Math.min(virt.w - 6, Math.max(Math.min(220, virt.w - 8), frameW));
    const timerBarX = (virt.w - timerBarW) * 0.5;

    return {
      timerBarX,
      timerBarY: topY,
      timerBarW,
      timerBarH,
      frameX,
      frameY,
      frameW,
      frameH,
      boardX,
      boardY,
      boardW,
      boardH,
      boardAspect,
      cellW: boardW / Math.max(1, engine.cols),
      cellH: boardH / Math.max(1, engine.rows),
    };
  }

  private virtualToJigsawNorm(
    vx: number,
    vy: number,
    m: ReturnType<PuzzleArcadeModalController['computeJigsawBoardMetrics']>
  ): { nx: number; ny: number } {
    return {
      nx: (vx - m.boardX) / Math.max(1, m.boardW),
      ny: (vy - m.boardY) / Math.max(1, m.boardH),
    };
  }

  private getJigsawMinHitRadiusNorm(
    m: ReturnType<PuzzleArcadeModalController['computeJigsawBoardMetrics']>
  ): { rx: number; ry: number } {
    const z = Math.max(0.5, sharedMinigameViewport.getState('jigsaw').zoom);
    const minHitCssPx = 19;
    return {
      rx: Math.min(0.16, minHitCssPx / Math.max(40, m.boardW * z)),
      ry: Math.min(0.16, minHitCssPx / Math.max(40, m.boardH * z)),
    };
  }

  private finalizeJigsawBoardClusterDrop(pieceIdx: number): void {
    const je = this.jigsawEngine;
    if (!je || je.status !== 'playing') return;
    const m = this.computeJigsawBoardMetrics(je);
    const zoom = Math.max(1, sharedMinigameViewport.getState('jigsaw').zoom);
    const res = je.dropClusterAndResolve(pieceIdx, m.boardW * zoom, m.boardH * zoom);

    if (res.lockedPieces.length > 0) {
      this.jigsawActiveBoardPiece = null;
      this.bumpCompanionCharge();
      for (const lIdx of res.lockedPieces.slice(0, 8)) {
        const tc = je.getTargetNormCenter(lIdx);
        this.spawnBurst(m.boardX + tc.nx * m.boardW, m.boardY + tc.ny * m.boardH, '#fde047', 10);
      }
      this.sim.audio.playMatchPop(Math.min(6, Math.max(1, je.combo)));
      this.forceImmediateRedraw = true;
      if (res.won) {
        this.hitStopTimer = 0.035;
        this.sim.audio.playPowerupBlast();
        this.spawnWeasleyFireworks(m.boardX + m.boardW * 0.5, m.boardY + m.boardH * 0.45, 4);
        this.jigsawWinRevealTimer = 0.45;
        this.updateLiveCountersOnly();
        this.renderJigsawTrayDockDOM();
      } else {
        this.persistModeSession('jigsaw', true);
        this.updateLiveCountersOnly();
        this.renderJigsawTrayDockDOM();
      }
      return;
    }

    if (res.mergedWithNeighbor) {
      this.bumpCompanionCharge();
      const pc = je.getBoardPieceNormCenter(pieceIdx);
      this.spawnBurst(m.boardX + pc.nx * m.boardW, m.boardY + pc.ny * m.boardH, '#34d399', 12);
      this.sim.audio.playChessClack(false);
    } else {
      this.sim.audio.playClick();
    }
    this.persistModeSession('jigsaw', true);
    this.forceImmediateRedraw = true;
  }

  private ensureJigsawBakeReady(
    engine: MasterJigsawEngine,
    targetBoardAspect?: number
  ): JigsawAtlasBakeCache | null {
    const desiredAspect =
      typeof targetBoardAspect === 'number' && Number.isFinite(targetBoardAspect)
        ? targetBoardAspect
        : this.jigsawBakeCache?.boardAspect ?? this.computeJigsawBoardMetrics(engine).boardAspect;
    if (
      !this.jigsawBakeCache ||
      this.jigsawBakeCache.stage !== engine.stage ||
      this.jigsawBakeCache.rows !== engine.rows ||
      this.jigsawBakeCache.cols !== engine.cols ||
      Math.abs(this.jigsawBakeCache.boardAspect - desiredAspect) > 0.025
    ) {
      this.jigsawBakeCache = createJigsawAtlasBakeCache(
        engine,
        this.getJigsawArtAssetProvider(),
        desiredAspect
      );
    }
    const cache = this.jigsawBakeCache;
    if (!cache) return null;

    if (cache.bakedPiecesCount < engine.totalPieces) {
      const done = stepJigsawAtlasBake(cache, engine, 340);
      if (done) {
        syncLockedPiecesToLayer(cache, engine);
        this.paintVisibleJigsawTrayThumbnails();
      }
    } else {
      syncLockedPiecesToLayer(cache, engine);
    }
    return cache;
  }

  private drawJigsawScene(ctx: CanvasRenderingContext2D, engine: MasterJigsawEngine): void {
    const m = this.computeJigsawBoardMetrics(engine);
    const cache = this.ensureJigsawBakeReady(engine, m.boardAspect);
    const now = performance.now();
    const isSandbox = Boolean(this.sim.state.sandboxMode);
    const zoom = sharedMinigameViewport.getState('jigsaw').zoom;

    // 1. Thanh đồng hồ đếm ngược trên đỉnh khung tranh (tối đa 02:00:00)
    ctx.save();
    const barBg = ctx.createLinearGradient(0, m.timerBarY, 0, m.timerBarY + m.timerBarH);
    barBg.addColorStop(0, 'rgba(58, 36, 23, 0.96)');
    barBg.addColorStop(1, 'rgba(36, 23, 19, 0.98)');
    ctx.fillStyle = barBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.34)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1.5;
    fillRoundRect(ctx, m.timerBarX, m.timerBarY, m.timerBarW, m.timerBarH, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle =
      !isSandbox && engine.isTimeCritical ? 'rgba(239, 68, 68, 0.92)' : 'rgba(207, 160, 82, 0.85)';
    ctx.stroke();

    const ratio = isSandbox ? 1 : engine.timeProgressRatio;
    const timeText = isSandbox ? '⏱ ∞' : `⏱ ${engine.formatRemainingTime()}`;
    const progText = `🧩 ${engine.lockedCount}/${engine.totalPieces}`;
    ctx.font = '700 10.5px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const leftW = Math.ceil(ctx.measureText(timeText).width) + 14;
    const rightW = Math.ceil(ctx.measureText(progText).width) + 14;

    ctx.fillStyle =
      !isSandbox && engine.isTimeCritical
        ? 0.5 + 0.5 * Math.sin(now * 0.014) > 0.45
          ? '#fecaca'
          : '#f87171'
        : '#fef3c7';
    ctx.textAlign = 'left';
    ctx.fillText(timeText, m.timerBarX + 7, m.timerBarY + m.timerBarH * 0.5 + 0.5);

    ctx.fillStyle = '#fde68a';
    ctx.textAlign = 'right';
    ctx.fillText(progText, m.timerBarX + m.timerBarW - 7, m.timerBarY + m.timerBarH * 0.5 + 0.5);

    const trackX = m.timerBarX + leftW;
    const trackW = Math.max(36, m.timerBarW - leftW - rightW);
    const trackH = 7;
    const trackY = m.timerBarY + (m.timerBarH - trackH) * 0.5;
    ctx.fillStyle = 'rgba(18, 10, 5, 0.62)';
    ctx.fillRect(trackX, trackY, trackW, trackH);
    if (ratio > 0.004) {
      const fillW = Math.max(2, Math.min(trackW, trackW * ratio));
      const fillGrad = ctx.createLinearGradient(trackX, trackY, trackX, trackY + trackH);
      if (!isSandbox && engine.isTimeCritical) {
        fillGrad.addColorStop(0, '#fca5a5');
        fillGrad.addColorStop(1, '#dc2626');
      } else if (ratio <= 0.45) {
        fillGrad.addColorStop(0, '#fde047');
        fillGrad.addColorStop(1, '#d97706');
      } else {
        fillGrad.addColorStop(0, '#86efac');
        fillGrad.addColorStop(1, '#16a34a');
      }
      ctx.fillStyle = fillGrad;
      ctx.fillRect(trackX, trackY, fillW, trackH);
    }
    ctx.restore();

    // 2. Khung gỗ sồi viền đồng Hang Sóc (hoặc thông Giáng Sinh mạ vàng) & lòng bảng giấy da ấm
    const isYuleJigsaw = this.isYuleSkinActive();
    ctx.save();
    const frameGrad = ctx.createLinearGradient(m.frameX, m.frameY, m.frameX, m.frameY + m.frameH);
    if (isYuleJigsaw) {
      frameGrad.addColorStop(0, '#14532d');
      frameGrad.addColorStop(0.5, '#7f1d1d');
      frameGrad.addColorStop(1, '#062417');
    } else {
      frameGrad.addColorStop(0, '#6e4526');
      frameGrad.addColorStop(0.5, '#4d2f18');
      frameGrad.addColorStop(1, '#331d0e');
    }
    ctx.fillStyle = frameGrad;
    ctx.shadowColor = 'rgba(20, 10, 4, 0.52)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    fillRoundRect(ctx, m.frameX, m.frameY, m.frameW, m.frameH, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = isYuleJigsaw ? 2 : 1.6;
    ctx.strokeStyle = isYuleJigsaw ? '#fbbf24' : '#cfa052';
    ctx.stroke();

    const matGrad = ctx.createLinearGradient(m.boardX, m.boardY, m.boardX, m.boardY + m.boardH);
    matGrad.addColorStop(0, isYuleJigsaw ? '#f8fcff' : '#f5e7c6');
    matGrad.addColorStop(1, isYuleJigsaw ? '#e6f2ec' : '#e7d1a1');
    ctx.fillStyle = matGrad;
    ctx.fillRect(m.boardX, m.boardY, m.boardW, m.boardH);

    // 3. Ảnh mẫu mờ (Ghost Reference) nếu người chơi bật 👁️ Mẫu
    if (engine.showGhostPreview && cache) {
      ctx.save();
      ctx.globalAlpha = 0.34;
      ctx.drawImage(cache.sourceCanvas, m.boardX, m.boardY, m.boardW, m.boardH);
      ctx.restore();
    }

    // 4. Đường kẻ lưới mảnh dịu mắt (luôn hiện khi <= 400 mảnh hoặc khi phóng to >= 2.1x)
    if (engine.totalPieces <= 400 || zoom >= 2.1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(122, 86, 56, 0.18)';
      ctx.lineWidth = Math.max(0.35, 0.7 / Math.max(1, zoom * 0.7));
      ctx.beginPath();
      for (let c = 1; c < engine.cols; c++) {
        const gx = m.boardX + c * m.cellW;
        ctx.moveTo(gx, m.boardY);
        ctx.lineTo(gx, m.boardY + m.boardH);
      }
      for (let r = 1; r < engine.rows; r++) {
        const gy = m.boardY + r * m.cellH;
        ctx.moveTo(m.boardX, gy);
        ctx.lineTo(m.boardX + m.boardW, gy);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Viền chìm trong lòng khung tranh
    ctx.strokeStyle = 'rgba(74, 44, 22, 0.45)';
    ctx.lineWidth = 1.1;
    ctx.strokeRect(m.boardX + 0.5, m.boardY + 0.5, m.boardW - 1, m.boardH - 1);
    ctx.restore();

    if (!cache) return;

    // 5. Lớp mặt bàn tĩnh: vẽ toàn bộ mảnh đã LOCKED chỉ bằng 1 lệnh drawImage duy nhất!
    if (engine.lockedCount > 0 && cache.bakedPiecesCount >= engine.totalPieces) {
      ctx.drawImage(cache.lockedCanvas, m.boardX, m.boardY, m.boardW, m.boardH);
    }

    // 6. Các cụm mảnh đang nằm tự do trên mặt bàn (ON_BOARD), sắp xếp theo Z-order
    if (cache.bakedPiecesCount >= engine.totalPieces) {
      const { strideW, strideH, cellW: aCellW, cellH: aCellH, padX, padY } = cache.metrics;
      const dstPadX = (padX / aCellW) * m.cellW;
      const dstPadY = (padY / aCellH) * m.cellH;
      const clusters = engine.getBoardClustersSortedByZ(true);
      const draggedRoot =
        this.jigsawDragBoardPiece !== null
          ? engine.findClusterRoot(this.jigsawDragBoardPiece)
          : null;
      const activeRoot =
        this.jigsawActiveBoardPiece !== null &&
        engine.pieceState[this.jigsawActiveBoardPiece] === JIGSAW_PIECE_BOARD
          ? engine.findClusterRoot(this.jigsawActiveBoardPiece)
          : null;

      for (const cl of clusters) {
        const isLifted = cl.root === draggedRoot;
        const isFocused = cl.root === activeRoot;
        ctx.save();
        if (isLifted) {
          ctx.shadowColor = 'rgba(20, 10, 4, 0.55)';
          ctx.shadowBlur = 9;
          ctx.shadowOffsetY = 4;
        } else {
          ctx.shadowColor = 'rgba(28, 16, 8, 0.36)';
          ctx.shadowBlur = 3.5;
          ctx.shadowOffsetY = 1.5;
        }
        for (const pIdx of cl.members) {
          const r = Math.floor(pIdx / engine.cols);
          const c = pIdx % engine.cols;
          const pos = engine.getBoardPieceNormCenter(pIdx);
          const cx = m.boardX + pos.nx * m.boardW;
          const cy = m.boardY + pos.ny * m.boardH;
          ctx.drawImage(
            cache.atlasCanvas,
            c * strideW,
            r * strideH,
            strideW,
            strideH,
            cx - m.cellW * 0.5 - dstPadX,
            cy - m.cellH * 0.5 - dstPadY,
            m.cellW + dstPadX * 2,
            m.cellH + dstPadY * 2
          );
          if (isFocused && !isLifted) {
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
            ctx.lineWidth = Math.max(1, 1.6 / Math.max(1, zoom * 0.6));
            ctx.strokeRect(
              cx - m.cellW * 0.48,
              cy - m.cellH * 0.48,
              m.cellW * 0.96,
              m.cellH * 0.96
            );
          }
        }
        ctx.restore();
      }
    } else {
      // Hiển thị tiến độ cắt khắc 2.000 mảnh mượt mà trong vài khung hình đầu tiên
      const pct = Math.min(99, Math.round((cache.bakedPiecesCount / engine.totalPieces) * 100));
      ctx.save();
      const pillW = Math.min(260, m.boardW * 0.86);
      const pillH = 34;
      const px = m.boardX + (m.boardW - pillW) * 0.5;
      const py = m.boardY + (m.boardH - pillH) * 0.5;
      ctx.fillStyle = 'rgba(46, 29, 16, 0.9)';
      fillRoundRect(ctx, px, py, pillW, pillH, 10);
      ctx.fill();
      ctx.strokeStyle = '#f5b301';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = '#fff6dc';
      ctx.font = '700 11.5px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`🎨 Đang khắc mảnh phép thuật (${pct}%)...`, px + pillW * 0.5, py + pillH * 0.5);
      ctx.restore();
    }
  }

  private syncJigsawStageAfterTrayResize(): void {
    const apply = () => {
      const panArea = this.root.querySelector(
        '#puzzleArcadeDialogContent .mg-stage-pan-area'
      ) as HTMLElement | null;
      if (panArea && panArea.clientWidth > 24 && panArea.clientHeight > 24) {
        this.observedStageCssW = panArea.clientWidth;
        this.observedStageCssH = panArea.clientHeight;
        this.observedCanvasCssW = panArea.clientWidth;
        this.observedCanvasCssH = panArea.clientHeight;
      }
      const liveStrip = this.root.querySelector('#paJigsawTrayStrip') as HTMLElement | null;
      if (liveStrip && !this.jigsawTrayCollapsed && liveStrip.clientWidth > 0) {
        const maxScroll = Math.max(0, liveStrip.scrollWidth - liveStrip.clientWidth);
        liveStrip.scrollLeft = Math.min(this.jigsawTrayScrollLeft, maxScroll);
        this.jigsawTrayScrollLeft = liveStrip.scrollLeft;
      }
      this.forceImmediateRedraw = true;
      this.drawFrame();
    };
    apply();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(apply);
    }
  }

  private captureJigsawTrayScrollState(): void {
    const dock = this.root.querySelector('#paJigsawTrayDock') as HTMLElement | null;
    if (!dock) return;
    const strip = dock.querySelector('#paJigsawTrayStrip') as HTMLElement | null;
    if (strip && !strip.hidden && (strip.clientWidth > 0 || strip.scrollLeft > 0)) {
      this.jigsawTrayScrollLeft = strip.scrollLeft;
    }
    const filterScroll = dock.querySelector('.pa-jigsaw-filter-scroll') as HTMLElement | null;
    if (filterScroll && (filterScroll.clientWidth > 0 || filterScroll.scrollLeft > 0)) {
      this.jigsawFilterScrollLeft = filterScroll.scrollLeft;
    }
  }

  private initJigsawTrayDockDOM(dock: HTMLElement): void {
    const filters: ReadonlyArray<{ id: JigsawTrayFilter; label: string }> = [
      { id: 'all', label: '🧩 Tất Cả' },
      { id: 'edges', label: '🔲 Viền' },
      { id: 'q0', label: '↖ <span class="pa-jig-word">Góc </span>I' },
      { id: 'q1', label: '↗ <span class="pa-jig-word">Góc </span>II' },
      { id: 'q2', label: '↙ <span class="pa-jig-word">Góc </span>III' },
      { id: 'q3', label: '↘ <span class="pa-jig-word">Góc </span>IV' },
    ];

    const filterBtnsHtml = filters
      .map(
        (f) =>
          `<button type="button" class="pa-jigsaw-filter-chip" data-jigsaw-filter="${f.id}" aria-pressed="false">${f.label} <span data-jigsaw-filter-count="${f.id}">· 0</span></button>`
      )
      .join('');

    dock.innerHTML = `
      <div class="pa-jigsaw-filter-bar">
        <div class="pa-jigsaw-filter-scroll" role="group" aria-label="Lọc mảnh ghép">${filterBtnsHtml}</div>
        <div class="pa-jigsaw-bar-actions">
          <div class="pa-jigsaw-pager" role="group" aria-label="Trang khay mảnh" hidden style="display:none;">
            <button type="button" id="btnPaJigsawTrayPrev" class="pa-jigsaw-page-btn" aria-label="Trang mảnh trước">◀</button>
            <span class="pa-jigsaw-page-lbl">1/1</span>
            <button type="button" id="btnPaJigsawTrayNext" class="pa-jigsaw-page-btn" aria-label="Trang mảnh sau">▶</button>
          </div>
          <button type="button" id="btnPaJigsawScatterTray" class="pa-jigsaw-tray-toggle-btn pa-jigsaw-scatter-btn" title="Trải ngẫu nhiên mảnh ghép trong khay ra mặt bàn và thu gọn khay (S)">🔀 Trải Bàn</button>
          <button type="button" id="btnPaJigsawToggleTray" class="pa-jigsaw-tray-toggle-btn" aria-expanded="true" aria-controls="paJigsawTrayStrip">▾ Thu Khay</button>
        </div>
      </div>
      <div id="paJigsawTrayStrip" class="pa-jigsaw-tray-strip" role="list" aria-label="Danh sách mảnh ghép trong khay"></div>
    `;

    const strip = dock.querySelector('#paJigsawTrayStrip') as HTMLElement | null;
    const filterScroll = dock.querySelector('.pa-jigsaw-filter-scroll') as HTMLElement | null;

    filterScroll?.addEventListener(
      'scroll',
      () => {
        if (filterScroll.clientWidth > 0) {
          this.jigsawFilterScrollLeft = filterScroll.scrollLeft;
        }
      },
      { passive: true }
    );

    if (strip) {
      strip.addEventListener(
        'scroll',
        () => {
          if (!strip.hidden && strip.clientWidth > 0) {
            this.jigsawTrayScrollLeft = strip.scrollLeft;
          }
        },
        { passive: true }
      );

      strip.addEventListener(
        'wheel',
        (ev) => {
          if (strip.hidden) return;
          if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX) && strip.scrollWidth > strip.clientWidth) {
            strip.scrollLeft += ev.deltaY;
            this.jigsawTrayScrollLeft = strip.scrollLeft;
            ev.preventDefault();
          }
        },
        { passive: false }
      );

      let bgDrag: { pointerId: number; startX: number; startScrollLeft: number } | null = null;
      strip.addEventListener('pointerdown', (ev) => {
        if (ev.target !== strip || ev.pointerType !== 'mouse' || ev.button !== 0) return;
        bgDrag = {
          pointerId: ev.pointerId,
          startX: ev.clientX,
          startScrollLeft: strip.scrollLeft,
        };
        try {
          strip.setPointerCapture(ev.pointerId);
        } catch {
          // Ignore synthetic pointer capture errors
        }
      });
      strip.addEventListener('pointermove', (ev) => {
        if (!bgDrag || bgDrag.pointerId !== ev.pointerId) return;
        const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
        const nextLeft = Math.max(0, bgDrag.startScrollLeft - (ev.clientX - bgDrag.startX));
        strip.scrollLeft = strip.clientWidth > 0 ? Math.min(nextLeft, maxScroll) : nextLeft;
        this.jigsawTrayScrollLeft = strip.scrollLeft;
      });
      const endBgDrag = (ev: PointerEvent) => {
        if (bgDrag && bgDrag.pointerId === ev.pointerId) {
          bgDrag = null;
        }
      };
      strip.addEventListener('pointerup', endBgDrag);
      strip.addEventListener('pointercancel', endBgDrag);
    }

    dock.querySelector('#btnPaJigsawScatterTray')?.addEventListener('click', () => {
      if (!this.jigsawEngine || this.jigsawEngine.status !== 'playing') return;
      const res = this.jigsawEngine.scatterTrayPiecesOntoBoard();
      if (res.scatteredCount > 0) {
        this.jigsawTrayCollapsed = true;
        this.jigsawActiveBoardPiece = null;
        this.sim.audio.playChessClack(false);
        this.persistModeSession('jigsaw', true);
        this.renderJigsawTrayDockDOM(false);
        this.syncJigsawStageAfterTrayResize();
        this.showToast(
          `🔀 Đã trải ${res.scatteredCount} mảnh ra mặt bàn — kéo ghép trực tiếp trên bàn!`,
          '🔀'
        );
      } else if (res.remainingInTray > 0) {
        this.jigsawTrayCollapsed = true;
        this.sim.audio.playClick();
        this.renderJigsawTrayDockDOM();
        this.syncJigsawStageAfterTrayResize();
        this.showToast('Mặt bàn đang có tối đa mảnh rời — hãy ghép bớt rồi trải tiếp!', '🔀');
      }
    });

    dock.querySelector('#btnPaJigsawToggleTray')?.addEventListener('click', () => {
      this.captureJigsawTrayScrollState();
      this.jigsawTrayCollapsed = !this.jigsawTrayCollapsed;
      this.sim.audio.playClick();
      this.renderJigsawTrayDockDOM();
      this.syncJigsawStageAfterTrayResize();
    });

    dock.querySelectorAll<HTMLButtonElement>('[data-jigsaw-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.jigsawFilter as JigsawTrayFilter | undefined;
        if (!f || !this.jigsawEngine) return;
        this.jigsawEngine.trayFilter = f;
        this.jigsawTrayPage = 0;
        this.jigsawTrayScrollLeft = 0;
        this.jigsawTrayCollapsed = false;
        this.persistModeSession('jigsaw', false);
        this.sim.audio.playClick();
        this.renderJigsawTrayDockDOM(false);
      });
    });

    dock.querySelector('#btnPaJigsawTrayPrev')?.addEventListener('click', () => {
      if (this.jigsawTrayPage > 0) {
        this.jigsawTrayPage -= 1;
        this.jigsawTrayScrollLeft = 0;
        this.sim.audio.playClick();
        this.renderJigsawTrayDockDOM(false);
      }
    });

    dock.querySelector('#btnPaJigsawTrayNext')?.addEventListener('click', () => {
      const jeNow = this.jigsawEngine;
      if (!jeNow) return;
      const totalPagesNow = Math.max(1, Math.ceil(jeNow.getFilteredTrayPieces().length / 24));
      if (this.jigsawTrayPage < totalPagesNow - 1) {
        this.jigsawTrayPage += 1;
        this.jigsawTrayScrollLeft = 0;
        this.sim.audio.playClick();
        this.renderJigsawTrayDockDOM(false);
      }
    });
  }

  private createJigsawTrayPieceButton(pIdx: number, strip: HTMLElement): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pa-jigsaw-piece-btn';
    btn.dataset.jigsawPiece = String(pIdx);
    btn.setAttribute('aria-pressed', 'false');

    const cvs = document.createElement('canvas');
    cvs.className = 'pa-jigsaw-thumb-cvs';
    cvs.width = 56;
    cvs.height = 56;
    cvs.dataset.jigsawCvs = String(pIdx);
    btn.appendChild(cvs);

    btn.addEventListener('keydown', (ke) => {
      if (ke.key === 'Enter' || ke.key === ' ') {
        ke.preventDefault();
        if (!this.jigsawEngine || this.jigsawEngine.status !== 'playing') return;
        if (this.jigsawEngine.selectedTrayPieceIdx === pIdx) {
          // Chạm lần 2 bằng bàn phím: đưa mảnh lên giữa bảng để di chuyển bằng phím mũi tên
          if (this.jigsawEngine.spawnTrayPieceOntoBoard(pIdx, 0.5, 0.5)) {
            this.jigsawActiveBoardPiece = pIdx;
            this.sim.audio.playClick();
            this.forceImmediateRedraw = true;
            this.renderJigsawTrayDockDOM();
          }
        } else {
          this.jigsawEngine.selectedTrayPieceIdx = pIdx;
          this.sim.audio.playClick();
          this.renderJigsawTrayDockDOM();
        }
      }
    });

    btn.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0 && ev.pointerType === 'mouse') return;
      if (!this.jigsawEngine || this.jigsawEngine.status !== 'playing' || this.victoryClaimed) {
        return;
      }
      this.cleanupJigsawTrayDrag();
      this.jigsawTrayDragState = {
        pointerId: ev.pointerId,
        pieceIdx: pIdx,
        startX: ev.clientX,
        startY: ev.clientY,
        currX: ev.clientX,
        currY: ev.clientY,
        startScrollLeft: strip.scrollLeft,
        pointerType: ev.pointerType,
        gesture: 'undecided',
        dragging: false,
        ghostEl: null,
      };
    });

    btn.addEventListener('pointermove', (ev) => {
      const stDrag = this.jigsawTrayDragState;
      if (!stDrag || stDrag.pointerId !== ev.pointerId || stDrag.pieceIdx !== pIdx) return;
      stDrag.currX = ev.clientX;
      stDrag.currY = ev.clientY;
      const dx = ev.clientX - stDrag.startX;
      const dy = ev.clientY - stDrag.startY;
      const dist = Math.hypot(dx, dy);

      if (stDrag.gesture === 'undecided' && dist > 7) {
        const isHorizontalTrayScroll =
          stDrag.pointerType === 'touch'
            ? Math.abs(dx) > Math.abs(dy) * 1.15
            : Math.abs(dx) > Math.abs(dy) * 1.8 && dy > -10;

        if (isHorizontalTrayScroll) {
          stDrag.gesture = 'scroll';
          if (stDrag.pointerType !== 'touch') {
            try {
              btn.setPointerCapture(ev.pointerId);
            } catch {
              // Ignore synthetic pointer capture errors
            }
          }
        } else {
          stDrag.gesture = 'lift';
          stDrag.dragging = true;
          try {
            btn.setPointerCapture(ev.pointerId);
          } catch {
            // Ignore synthetic pointer capture errors
          }
          const ghost = document.createElement('canvas');
          ghost.width = 76;
          ghost.height = 76;
          ghost.className = 'pa-jigsaw-drag-ghost';
          this.paintSingleJigsawPieceCanvas(ghost, pIdx);
          const hostDlg = this.root.querySelector('#puzzleArcadeDialog') ?? document.body;
          hostDlg.appendChild(ghost);
          stDrag.ghostEl = ghost;
        }
      }

      if (stDrag.gesture === 'scroll' && stDrag.pointerType !== 'touch') {
        const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
        const nextLeft = Math.max(0, stDrag.startScrollLeft - dx);
        strip.scrollLeft = strip.clientWidth > 0 ? Math.min(nextLeft, maxScroll) : nextLeft;
        this.jigsawTrayScrollLeft = strip.scrollLeft;
        return;
      }

      if (stDrag.gesture === 'lift' && stDrag.dragging && stDrag.ghostEl) {
        const liftY = stDrag.pointerType === 'touch' ? 24 : 0;
        stDrag.ghostEl.style.left = `${Math.round(ev.clientX - 38)}px`;
        stDrag.ghostEl.style.top = `${Math.round(ev.clientY - 38 - liftY)}px`;
      }
    });

    const finishTrayPointer = (ev: PointerEvent) => {
      const stDrag = this.jigsawTrayDragState;
      if (!stDrag || stDrag.pointerId !== ev.pointerId || stDrag.pieceIdx !== pIdx) return;
      const gesture = stDrag.gesture;
      const wasDragging = stDrag.dragging;
      const pointerType = stDrag.pointerType;
      this.cleanupJigsawTrayDrag();

      if (gesture === 'scroll') {
        if (!strip.hidden && strip.clientWidth > 0) {
          this.jigsawTrayScrollLeft = strip.scrollLeft;
        }
        return;
      }

      if (ev.type === 'pointercancel' || !this.jigsawEngine || this.jigsawEngine.status !== 'playing') {
        return;
      }

      if (!wasDragging) {
        // Thao tác 1 chạm không cần kéo (WCAG / Modern Web Guidance single-pointer alternative)
        this.jigsawEngine.selectedTrayPieceIdx =
          this.jigsawEngine.selectedTrayPieceIdx === pIdx ? null : pIdx;
        this.sim.audio.playClick();
        this.renderJigsawTrayDockDOM();
        return;
      }

      const cvs = this.canvas;
      const panArea = this.root.querySelector(
        '#puzzleArcadeDialogContent .mg-stage-pan-area'
      ) as HTMLElement | null;
      if (!cvs || !panArea) return;

      const liftY = pointerType === 'touch' ? 24 : 0;
      const dropClientX = ev.clientX;
      const dropClientY = ev.clientY - liftY;
      const panRect = panArea.getBoundingClientRect();
      if (
        dropClientX < panRect.left ||
        dropClientX > panRect.right ||
        dropClientY < panRect.top ||
        dropClientY > panRect.bottom
      ) {
        this.sim.audio.playClick();
        return;
      }

      const cRect = cvs.getBoundingClientRect();
      const virt = this.getVirtualCanvasSize();
      const netRot = sharedMinigameViewport.getNetQuarterTurns('jigsaw');
      const { lu, lv } = clientToLocalNormalized(dropClientX, dropClientY, cRect, netRot);
      const vx = lu * virt.w;
      const vy = lv * virt.h;
      const m = this.computeJigsawBoardMetrics(this.jigsawEngine);
      const { nx, ny } = this.virtualToJigsawNorm(vx, vy, m);

      if (this.jigsawEngine.spawnTrayPieceOntoBoard(pIdx, nx, ny)) {
        this.jigsawActiveBoardPiece = pIdx;
        this.finalizeJigsawBoardClusterDrop(pIdx);
        this.renderJigsawTrayDockDOM();
      }
    };

    btn.addEventListener('pointerup', finishTrayPointer);
    btn.addEventListener('pointercancel', finishTrayPointer);
    return btn;
  }

  private renderJigsawTrayDockDOM(preserveScroll = true): void {
    const dock = this.root.querySelector('#paJigsawTrayDock') as HTMLElement | null;
    const je = this.jigsawEngine;
    if (!dock || !je || this.mode !== 'jigsaw') return;

    const existingStrip = dock.querySelector('#paJigsawTrayStrip') as HTMLElement | null;
    if (existingStrip) {
      if (preserveScroll) {
        this.captureJigsawTrayScrollState();
      } else {
        this.jigsawTrayScrollLeft = 0;
      }
    } else {
      this.initJigsawTrayDockDOM(dock);
    }

    const strip = dock.querySelector('#paJigsawTrayStrip') as HTMLElement | null;
    if (!strip) return;

    const filterIds: ReadonlyArray<JigsawTrayFilter> = ['all', 'edges', 'q0', 'q1', 'q2', 'q3'];
    const filtered = je.getFilteredTrayPieces();
    const pageSize = 24;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const prevPage = this.jigsawTrayPage;
    if (this.jigsawTrayPage >= totalPages) {
      this.jigsawTrayPage = totalPages - 1;
    }
    if (this.jigsawTrayPage < 0) {
      this.jigsawTrayPage = 0;
    }
    const pageSteppedBack = prevPage > this.jigsawTrayPage;
    const pageStart = this.jigsawTrayPage * pageSize;
    const pageSlice = filtered.slice(pageStart, pageStart + pageSize);

    for (const fId of filterIds) {
      const chipBtn = dock.querySelector(`[data-jigsaw-filter="${fId}"]`) as HTMLButtonElement | null;
      if (!chipBtn) continue;
      const active = je.trayFilter === fId;
      chipBtn.classList.toggle('active', active);
      chipBtn.setAttribute('aria-pressed', String(active));
      const countEl = chipBtn.querySelector(`[data-jigsaw-filter-count="${fId}"]`) as HTMLElement | null;
      if (countEl) {
        countEl.textContent = `· ${je.getTrayCountForFilter(fId)}`;
      }
    }

    const totalTrayCount = je.getTrayCountForFilter('all');
    const pagerEl = dock.querySelector('.pa-jigsaw-pager') as HTMLElement | null;
    if (pagerEl) {
      const showPager = !this.jigsawTrayCollapsed && totalPages > 1;
      pagerEl.hidden = !showPager;
      pagerEl.style.display = showPager ? 'inline-flex' : 'none';
      const prevBtn = dock.querySelector('#btnPaJigsawTrayPrev') as HTMLButtonElement | null;
      const nextBtn = dock.querySelector('#btnPaJigsawTrayNext') as HTMLButtonElement | null;
      const pageLbl = dock.querySelector('.pa-jigsaw-page-lbl') as HTMLElement | null;
      if (prevBtn) prevBtn.disabled = this.jigsawTrayPage <= 0;
      if (nextBtn) nextBtn.disabled = this.jigsawTrayPage >= totalPages - 1;
      if (pageLbl) pageLbl.textContent = `${this.jigsawTrayPage + 1}/${totalPages}`;
    }

    const scatterBtn = dock.querySelector('#btnPaJigsawScatterTray') as HTMLButtonElement | null;
    if (scatterBtn) {
      scatterBtn.disabled = je.status !== 'playing' || totalTrayCount <= 0;
    }

    const toggleBtn = dock.querySelector('#btnPaJigsawToggleTray') as HTMLButtonElement | null;
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.jigsawTrayCollapsed);
      toggleBtn.setAttribute('aria-expanded', String(!this.jigsawTrayCollapsed));
      toggleBtn.title = this.jigsawTrayCollapsed
        ? 'Mở lại khay mảnh ghép'
        : 'Thu gọn khay mảnh để phóng to tối đa khung tranh';
      toggleBtn.textContent = this.jigsawTrayCollapsed
        ? `▴ Mở Khay (${totalTrayCount})`
        : '▾ Thu Khay';
    }

    dock.dataset.trayCollapsed = String(this.jigsawTrayCollapsed);
    strip.hidden = this.jigsawTrayCollapsed;

    const existingBtns = new Map<number, HTMLButtonElement>();
    strip.querySelectorAll<HTMLButtonElement>('[data-jigsaw-piece]').forEach((btn) => {
      const pIdx = Number(btn.dataset.jigsawPiece);
      if (Number.isInteger(pIdx)) {
        existingBtns.set(pIdx, btn);
      } else {
        btn.remove();
      }
    });

    if (pageSlice.length === 0) {
      existingBtns.forEach((btn) => btn.remove());
      let emptyEl = strip.querySelector('.pa-jigsaw-tray-empty') as HTMLElement | null;
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'pa-jigsaw-tray-empty';
        strip.appendChild(emptyEl);
      }
      emptyEl.textContent =
        je.lockedCount >= je.totalPieces
          ? '🎉 Toàn bộ mảnh ghép đã hoàn thiện!'
          : '✨ Không còn mảnh nào trong bộ lọc này — chuyển sang 🧩 Tất Cả hoặc ghép tiếp các mảnh trên bàn!';
    } else {
      strip.querySelector('.pa-jigsaw-tray-empty')?.remove();
      const targetSet = new Set<number>(pageSlice);
      existingBtns.forEach((btn, pIdx) => {
        if (!targetSet.has(pIdx)) {
          btn.remove();
          existingBtns.delete(pIdx);
        }
      });

      const createdCanvases: Array<{ cvs: HTMLCanvasElement; pIdx: number }> = [];
      for (let i = 0; i < pageSlice.length; i++) {
        const pIdx = pageSlice[i];
        const r = Math.floor(pIdx / je.cols) + 1;
        const c = (pIdx % je.cols) + 1;
        const isSel = je.selectedTrayPieceIdx === pIdx;
        const tag = je.isCornerPiece(pIdx)
          ? 'Mảnh Góc'
          : je.isEdgePiece(pIdx)
            ? 'Mảnh Viền'
            : 'Mảnh Trong';

        let btn = existingBtns.get(pIdx);
        if (!btn) {
          btn = this.createJigsawTrayPieceButton(pIdx, strip);
          const cvs = btn.querySelector('canvas[data-jigsaw-cvs]') as HTMLCanvasElement | null;
          if (cvs) {
            createdCanvases.push({ cvs, pIdx });
          }
        }
        btn.classList.toggle('selected', isSel);
        btn.setAttribute('aria-pressed', String(isSel));
        btn.title = `${tag} (Hàng ${r}, Cột ${c}) — Kéo lên bảng hoặc chạm chọn rồi chạm bảng`;

        const currentAtPos = strip.children[i] ?? null;
        if (currentAtPos !== btn) {
          strip.insertBefore(btn, currentAtPos);
        }
      }

      for (const item of createdCanvases) {
        this.paintSingleJigsawPieceCanvas(item.cvs, item.pIdx);
      }
    }

    const filterScroll = dock.querySelector('.pa-jigsaw-filter-scroll') as HTMLElement | null;
    if (filterScroll) {
      const maxFilterScroll =
        filterScroll.clientWidth > 0
          ? Math.max(0, filterScroll.scrollWidth - filterScroll.clientWidth)
          : Math.max(0, this.jigsawFilterScrollLeft);
      filterScroll.scrollLeft = Math.max(0, Math.min(this.jigsawFilterScrollLeft, maxFilterScroll));
      this.jigsawFilterScrollLeft = filterScroll.scrollLeft;
    }

    if (!this.jigsawTrayCollapsed) {
      const desiredScroll = pageSteppedBack
        ? Math.max(this.jigsawTrayScrollLeft, strip.scrollWidth)
        : this.jigsawTrayScrollLeft;
      const maxTrayScroll =
        strip.clientWidth > 0
          ? Math.max(0, strip.scrollWidth - strip.clientWidth)
          : Math.max(0, desiredScroll);
      strip.scrollLeft = Math.max(0, Math.min(desiredScroll, maxTrayScroll));
      this.jigsawTrayScrollLeft = strip.scrollLeft;

      if (
        this.jigsawTrayScrollLeft > 0 &&
        strip.clientWidth === 0 &&
        typeof requestAnimationFrame === 'function'
      ) {
        requestAnimationFrame(() => {
          const liveStrip = this.root.querySelector('#paJigsawTrayStrip') as HTMLElement | null;
          if (liveStrip && !liveStrip.hidden && liveStrip.clientWidth > 0) {
            const maxS = Math.max(0, liveStrip.scrollWidth - liveStrip.clientWidth);
            liveStrip.scrollLeft = Math.min(this.jigsawTrayScrollLeft, maxS);
            this.jigsawTrayScrollLeft = liveStrip.scrollLeft;
          }
        });
      }
    }
  }

  private paintVisibleJigsawTrayThumbnails(): void {
    const dock = this.root.querySelector('#paJigsawTrayDock') as HTMLElement | null;
    if (!dock || !this.jigsawEngine) return;
    dock.querySelectorAll<HTMLCanvasElement>('canvas[data-jigsaw-cvs]').forEach((cvs) => {
      const idx = Number(cvs.dataset.jigsawCvs);
      if (Number.isInteger(idx)) {
        this.paintSingleJigsawPieceCanvas(cvs, idx);
      }
    });
  }

  private paintSingleJigsawPieceCanvas(cvs: HTMLCanvasElement, pieceIdx: number): void {
    const je = this.jigsawEngine;
    if (!je) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const w = cvs.width;
    const h = cvs.height;
    ctx.clearRect(0, 0, w, h);

    const cache = this.ensureJigsawBakeReady(je);
    if (cache && cache.bakedPiecesCount > pieceIdx) {
      const { strideW, strideH } = cache.metrics;
      const r = Math.floor(pieceIdx / je.cols);
      const c = pieceIdx % je.cols;
      const pad = 3;
      const scale = Math.min((w - pad * 2) / strideW, (h - pad * 2) / strideH);
      const dw = strideW * scale;
      const dh = strideH * scale;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        cache.atlasCanvas,
        c * strideW,
        r * strideH,
        strideW,
        strideH,
        (w - dw) * 0.5,
        (h - dh) * 0.5,
        dw,
        dh
      );
      return;
    }

    ctx.fillStyle = 'rgba(245, 179, 1, 0.28)';
    fillRoundRect(ctx, 10, 10, w - 20, h - 20, 6);
    ctx.fill();
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
