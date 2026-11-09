import { formatDurationCompactVi } from '../data/catalog';
import { getMilestoneBossMeta, MAX_MINIGAME_STAGE } from '../data/match3Levels';
import { SpriteRegistry } from '../engine/spriteLoader';
import type {
  ChessWorkerRequestMessage,
  ChessWorkerResponseMessage,
} from '../sim/chessAi.worker';
import {
  BLOCK_BOARD_SIZE,
  BlockColorKey,
  CARO_BOARD_SIZE,
  CaroGameEngine,
  CaroStone,
  ChessPiece,
  ChessPieceType,
  ChessSubMode,
  JIGSAW_VIRTUAL_H,
  JIGSAW_VIRTUAL_W,
  LayeredTileCard,
  PolyominoPiece,
  RunicBlockPuzzleEngine,
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
  BuildReductionResult,
  LeaderboardRankChange,
  MinigameRescueContext,
  PuzzleArcadeMode,
} from '../types/game';

const PA_VIRTUAL_W = JIGSAW_VIRTUAL_W; // 692
const PA_VIRTUAL_H = JIGSAW_VIRTUAL_H; // 504

// Sudoku 9x9 virtual layout (inside 692 x 504)
const SUDOKU_BOARD_X = 16;
const SUDOKU_BOARD_Y = 16;
const SUDOKU_CELL_PX = 52; // 9 * 52 = 468
const SUDOKU_BOARD_PX = 9 * SUDOKU_CELL_PX;
const SUDOKU_PAD_X = 498;
const SUDOKU_PAD_Y = 16;
const SUDOKU_PAD_W = 180;
const SUDOKU_PAD_H = 468;

// Caro 13x13 virtual layout (inside 692 x 504)
const CARO_FRAME_X = 12;
const CARO_FRAME_Y = 12;
const CARO_FRAME_PX = 480;
const CARO_ORIGIN_X = 36;
const CARO_ORIGIN_Y = 36;
const CARO_STEP_PX = 36; // 12 intervals * 36 = 432 (36..468)
const CARO_SIDE_X = 504;
const CARO_SIDE_Y = 12;
const CARO_SIDE_W = 178;
const CARO_SIDE_H = 480;

// Wizard's Chess 8x8 virtual layout (inside 692 x 504)
const CHESS_BOARD_X = 18;
const CHESS_BOARD_Y = 16;
const CHESS_CELL_PX = 59; // 8 * 59 = 472
const CHESS_BOARD_PX = 8 * CHESS_CELL_PX;
const CHESS_SIDE_X = 508;
const CHESS_SIDE_Y = 16;
const CHESS_SIDE_W = 176;
const CHESS_SIDE_H = 472;

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
    name: 'Cụ Albus Dumbledore',
    roleVi: 'Vua Gryffindor',
    glyph: '♔',
    spellName: 'Hỏa Phượng Đũa Cơm Nguội',
  },
  wq: {
    name: 'Hermione & Fawkes',
    roleVi: 'Hậu Gryffindor',
    glyph: '♕',
    spellName: 'Ánh Lửa Phượng Hoàng',
  },
  wb: {
    name: 'Harry Potter',
    roleVi: 'Tượng Gryffindor',
    glyph: '♗',
    spellName: 'Thần Hộ Mệnh Bạc',
  },
  wn: {
    name: 'Bằng Mã Buckbeak',
    roleVi: 'Mã Gryffindor',
    glyph: '♘',
    spellName: 'Cánh Gió Kiêu Hãnh',
  },
  wr: {
    name: 'Tháp Lâu Đài Hogwarts',
    roleVi: 'Xe Gryffindor',
    glyph: '♖',
    spellName: 'Thành Trì Cú Tuyết',
  },
  wp: {
    name: 'Gia Tinh Dobby',
    roleVi: 'Tốt Gryffindor',
    glyph: '♙',
    spellName: 'Búng Tay Tất Len',
  },
  bk: {
    name: 'Chúa Tể Voldemort',
    roleVi: 'Vua Slytherin',
    glyph: '♚',
    spellName: 'Tia Chớp Hắc Ám',
  },
  bq: {
    name: 'Bellatrix & Tử Xà',
    roleVi: 'Hậu Slytherin',
    glyph: '♛',
    spellName: 'Lốc Xoáy Tử Xà',
  },
  bb: {
    name: 'Giáo Sư Severus Snape',
    roleVi: 'Tượng Slytherin',
    glyph: '♝',
    spellName: 'Độc Dược Bí Truyền',
  },
  bn: {
    name: 'Vong Mã Thestral',
    roleVi: 'Mã Slytherin',
    glyph: '♞',
    spellName: 'Vó Ngựa Bóng Đêm',
  },
  br: {
    name: 'Azkaban & Giám Ngục',
    roleVi: 'Xe Slytherin',
    glyph: '♜',
    spellName: 'Sương Lạnh Giám Ngục',
  },
  bp: {
    name: 'Tử Thần Thực Tử',
    roleVi: 'Tốt Slytherin',
    glyph: '♟',
    spellName: 'Ấn Xà Hắc Ám',
  },
};

export type SudokuDisplayMode = 'relic_num' | 'relic_only' | 'num_only';

const HP_SUDOKU_RELIC_META: Record<
  number,
  {
    fileKey: string;
    nameVi: string;
    shortVi: string;
    loreVi: string;
    accent: string;
    runeGlyph: string;
  }
> = {
  1: {
    fileKey: 'relic_1',
    nameVi: 'Trái Snitch Vàng',
    shortVi: 'Snitch Vàng',
    loreVi: 'Bảo bối Quidditch cất giấu viên Đá Phục Sinh',
    accent: '#f59e0b',
    runeGlyph: 'ᚠ',
  },
  2: {
    fileKey: 'relic_2',
    nameVi: 'Chiếc Mũ Phân Loại',
    shortVi: 'Mũ Phân Loại',
    loreVi: 'Mũ thông thái của Godric Gryffindor phân viện',
    accent: '#b45309',
    runeGlyph: 'ᚢ',
  },
  3: {
    fileKey: 'relic_3',
    nameVi: 'Đũa Phép Cơm Nguội',
    shortVi: 'Đũa Cơm Nguội',
    loreVi: 'Bảo bối Tử Thần quyền năng nhất giới phù thủy',
    accent: '#3b82f6',
    runeGlyph: 'ᚦ',
  },
  4: {
    fileKey: 'relic_4',
    nameVi: 'Chiếc Cốc Lửa',
    shortVi: 'Cốc Lửa',
    loreVi: 'Ngọn lửa xanh huyền thoại chọn Quán quân',
    accent: '#38bdf8',
    runeGlyph: 'ᚨ',
  },
  5: {
    fileKey: 'relic_5',
    nameVi: 'Vạc Độc Dược Lục Bảo',
    shortVi: 'Vạc Độc Dược',
    loreVi: 'Vạc đồng ủ Phúc Lạc Dược dưới hầm Hogwarts',
    accent: '#10b981',
    runeGlyph: 'ᚱ',
  },
  6: {
    fileKey: 'relic_6',
    nameVi: 'Bản Đồ Đạo Tặc',
    shortVi: 'Bản Đồ Đạo Tặc',
    loreVi: 'Tôi trang trọng thề rằng tôi đang mưu đồ bất chính',
    accent: '#dc2626',
    runeGlyph: 'ᚲ',
  },
  7: {
    fileKey: 'relic_7',
    nameVi: 'Xoay Thời Gian',
    shortVi: 'Xoay Thời Gian',
    loreVi: 'Đồng hồ cát vàng của Hermione xoay ngược giờ',
    accent: '#d97706',
    runeGlyph: 'ᚷ',
  },
  8: {
    fileKey: 'relic_8',
    nameVi: 'Cú Tuyết Hedwig',
    shortVi: 'Cú Hedwig',
    loreVi: 'Sứ giả trung thành mang thư sáp đỏ Hogwarts',
    accent: '#64748b',
    runeGlyph: 'ᚹ',
  },
  9: {
    fileKey: 'relic_9',
    nameVi: 'Phượng Hoàng Fawkes',
    shortVi: 'Phượng Hoàng',
    loreVi: 'Linh điểu bất tử của cụ Albus Dumbledore',
    accent: '#ef4444',
    runeGlyph: 'ᛊ',
  },
};

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

// Block Puzzle virtual layout (inside 692 x 504)
const BLK_BOARD_X = 16;
const BLK_BOARD_Y = 16;
const BLK_CELL_PX = 59; // 8 * 59 = 472
const BLK_BOARD_PX = BLOCK_BOARD_SIZE * BLK_CELL_PX;
const BLK_TRAY_X = 504;
const BLK_TRAY_Y = 16;
const BLK_TRAY_W = 178;
const BLK_TRAY_H = 472;

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

const BLOCK_COLOR_PALETTE: Record<
  BlockColorKey,
  { fillTop: string; fillBot: string; rim: string; lip: string; spriteKey: string }
> = {
  ruby: {
    fillTop: '#fb7185',
    fillBot: '#be123c',
    rim: '#ffe4e6',
    lip: '#881337',
    spriteKey: 'm3_gem_ruby',
  },
  sapphire: {
    fillTop: '#38bdf8',
    fillBot: '#0369a1',
    rim: '#e0f2fe',
    lip: '#0c4a6e',
    spriteKey: 'm3_gem_sapphire',
  },
  emerald: {
    fillTop: '#34d399',
    fillBot: '#047857',
    rim: '#d1fae5',
    lip: '#064e3b',
    spriteKey: 'm3_gem_emerald',
  },
  topaz: {
    fillTop: '#facc15',
    fillBot: '#b45309',
    rim: '#fef9c3',
    lip: '#78350f',
    spriteKey: 'm3_gem_topaz',
  },
  amethyst: {
    fillTop: '#c084fc',
    fillBot: '#6d28d9',
    rim: '#f3e8ff',
    lip: '#4c1d95',
    spriteKey: 'm3_gem_amethyst',
  },
  wood: {
    fillTop: '#d97706',
    fillBot: '#78350f',
    rim: '#fde68a',
    lip: '#451a03',
    spriteKey: 'm3_obs_box_1',
  },
};

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
  private sudokuRelicImages = new Map<number, HTMLImageElement>();
  private caroSealImages = new Map<string, HTMLImageElement>();
  private parlorBgImage: HTMLImageElement | null = null;
  private greatHallBgImage: HTMLImageElement | null = null;
  private potionsSudokuBgImage: HTMLImageElement | null = null;
  private marauderCaroBgImage: HTMLImageElement | null = null;

  public mode: PuzzleArcadeMode = 'caro';
  public sudokuDisplayMode: SudokuDisplayMode = 'relic_num';
  public sudokuEngine: SudokuPuzzleEngine | null = null;
  public caroEngine: CaroGameEngine | null = null;
  public chessEngine: WizardChessEngine | null = null;
  public blockEngine: RunicBlockPuzzleEngine | null = null;
  public tileEngine: TileMatchZenEngine | null = null;
  private blockForceSubMode?: 'tangram' | 'blast';
  private chessForceSubMode?: ChessSubMode;
  private aiThinkTimer = 0;
  private sudokuPadRects = new Map<number, { x: number; y: number; w: number; h: number }>();
  private sudokuEraseRect: { x: number; y: number; w: number; h: number } | null = null;
  private sudokuHoverCell: { r: number; c: number } | null = null;
  private sudokuHoverPadDigit: number | null = null;
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

  private victoryClaimed = false;
  public rescueContext: MinigameRescueContext | null = null;
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

  // Block Puzzle interaction
  private draggingBlockUid: number | null = null;
  private selectedBlockUid: number | null = null;
  private draggingBlockOriginTangram: { r: number; c: number } | null = null;
  private traySlotBounds = new Map<number, { x: number; y: number; w: number; h: number }>();
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
    dlg?.addEventListener('close', () => {
      dlg.returnValue = '';
      this.pendingChessWorkerReqId = null;
      this.hitStopTimer = 0;
      this.inspectingTurningPoint = false;
      if (this.caroWinRevealTimer > 0 && !this.victoryClaimed) {
        this.caroWinRevealTimer = 0;
        this.checkAndClaimVictory();
      }
      if (this.rescueContext) {
        this.rescueContext = null;
        this.rescueVictoryOutcome = null;
        this.sudokuEngine = null;
        this.caroEngine = null;
        this.chessEngine = null;
        this.blockEngine = null;
      }
      this.stopLoop();
      this.onParentRefresh();
    });

    window.addEventListener('keydown', (e) => {
      const openDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      if (!openDlg?.open || this.victoryClaimed) return;
      if (this.mode !== 'sudoku' || !this.sudokuEngine || this.sudokuEngine.status !== 'playing') {
        return;
      }
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        this.applySudokuDigit(Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault();
        if (this.sudokuEngine.clearSelectedCell()) {
          this.sim.audio.playClick();
          this.updateLiveCountersOnly();
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        this.sudokuEngine.pencilMode = !this.sudokuEngine.pencilMode;
        this.sim.audio.playClick();
        this.renderDOM();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        this.cycleSudokuDisplayMode();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(-1, 0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(1, 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(0, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.sudokuEngine.moveSelection(0, 1);
      }
    });
  }

  private cycleSudokuDisplayMode(): void {
    this.sudokuDisplayMode =
      this.sudokuDisplayMode === 'relic_num'
        ? 'relic_only'
        : this.sudokuDisplayMode === 'relic_only'
          ? 'num_only'
          : 'relic_num';
    this.sim.audio.playClick();
    this.renderDOM();
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

    const potionsImg = new Image();
    potionsImg.decoding = 'async';
    potionsImg.src = '/paintings/potions_runes_sudoku_bg.jpg';
    this.potionsSudokuBgImage = potionsImg;

    const marauderImg = new Image();
    marauderImg.decoding = 'async';
    marauderImg.src = '/paintings/marauder_caro_bg.jpg';
    this.marauderCaroBgImage = marauderImg;

    for (const key of HP_CHESS_PIECE_KEYS) {
      const pImg = new Image();
      pImg.decoding = 'async';
      pImg.src = `/paintings/chess/${key}.png`;
      this.chessPieceImages.set(key, pImg);
    }

    for (let d = 1; d <= 9; d++) {
      const meta = HP_SUDOKU_RELIC_META[d];
      if (!meta) continue;
      const rImg = new Image();
      rImg.decoding = 'async';
      rImg.src = `/paintings/sudoku/${meta.fileKey}.png`;
      this.sudokuRelicImages.set(d, rImg);
    }

    for (const sealKey of HP_CARO_SEAL_KEYS) {
      const sImg = new Image();
      sImg.decoding = 'async';
      sImg.src = `/paintings/caro/${sealKey}.png`;
      this.caroSealImages.set(sealKey, sImg);
    }

    const spriteKeys = new Set<string>([
      ...Object.values(BLOCK_COLOR_PALETTE).map((v) => v.spriteKey),
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

  private getSudokuRelicImage(digit: number): HTMLImageElement | null {
    const img = this.sudokuRelicImages.get(digit);
    if (img && img.complete && img.naturalWidth > 0) return img;
    return null;
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
    this.ensureEngineForMode(targetMode, false);
    this.lastSeenSosRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;

    const dlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    if (!dlg) return;
    this.renderDOM();
    if (!dlg.open) {
      dlg.showModal();
    }
    this.startLoop();
  }

  public openRescue(ctx: MinigameRescueContext): void {
    if (ctx.kind === 'match3') return;
    const check = this.sim.canRescueNeighborMinigame(ctx.neighborId);
    if (!check.ok) {
      this.showToast(check.reason ?? 'Không thể giải cứu màn này lúc này!', '🦉');
      return;
    }
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
  }

  public switchMode(nextMode: PuzzleArcadeMode): void {
    if (this.caroWinRevealTimer > 0 && !this.victoryClaimed) {
      this.caroWinRevealTimer = 0;
      this.checkAndClaimVictory();
    }
    this.mode = nextMode;
    this.sim.state.puzzleArcade.activeMode = nextMode;
    this.sim.saveToStorage();
    this.resetInteractionState();
    this.ensureEngineForMode(nextMode, false);
    this.renderDOM();
  }

  private resetInteractionState(): void {
    this.activePointerId = null;
    this.draggingBlockUid = null;
    this.selectedBlockUid = null;
    this.draggingBlockOriginTangram = null;
    this.sudokuHoverCell = null;
    this.sudokuHoverPadDigit = null;
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
        this.renderDOM();
      } else {
        this.updateLiveCountersOnly();
      }
    } else if (aiRes?.playerWon) {
      this.checkAndClaimVictory();
    } else {
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
    return null;
  }

  private renderTurningPointCardHtml(rev: TurningPointReview): string {
    return `
      <div class="pa-review-card">
        <div class="pa-review-head">
          <span class="pa-review-title">🪞 Gương Chiếu Hậu Pháp Thuật • ${escapeHtml(rev.outcomeTagVi)} (Lượt ${rev.plyNumber})</span>
          ${
            rev.highlightCells.length > 0
              ? `<button id="btnPaToggleReviewInspect" type="button" class="pa-mini-pill ${this.inspectingTurningPoint ? 'active' : ''}">${
                  this.inspectingTurningPoint ? '🙈 Ẩn Soi Bàn' : '🔍 Soi Nước Ngoặt Trên Bàn'
                }</button>`
              : ''
          }
        </div>
        <p class="pa-review-summary">${escapeHtml(rev.summaryVi)}</p>
        <div class="pa-review-pills">
          <span class="pa-review-pill">⚡ Nước đã đi: <strong>${escapeHtml(rev.playedCoordVi)}</strong></span>
          <span class="pa-review-pill best">✨ Nước chuẩn: <strong>${escapeHtml(rev.recommendedCoordVi)}</strong></span>
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
    return this.blockEngine?.stage ?? pa.blockStage ?? 1;
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
        this.sudokuEngine = new SudokuPuzzleEngine(stage);
      }
    } else if (mode === 'caro') {
      const stage = rescueStage ?? pa.caroStage ?? 1;
      if (
        forceRestart ||
        !this.caroEngine ||
        this.caroEngine.stage !== stage ||
        this.caroEngine.status === 'won'
      ) {
        this.caroEngine = new CaroGameEngine(stage);
      }
    } else if (mode === 'chess') {
      const stage = rescueStage ?? pa.chessStage ?? 1;
      if (
        forceRestart ||
        !this.chessEngine ||
        this.chessEngine.stage !== stage ||
        this.chessEngine.status === 'won'
      ) {
        this.chessEngine = new WizardChessEngine(stage, this.chessForceSubMode);
      }
    } else {
      const stage = rescueStage ?? pa.blockStage ?? 1;
      if (
        forceRestart ||
        !this.blockEngine ||
        this.blockEngine.stage !== stage ||
        this.blockEngine.status === 'won'
      ) {
        this.blockEngine = new RunicBlockPuzzleEngine(stage, this.blockForceSubMode);
      }
    }
  }

  private checkAndClaimVictory(): void {
    if (this.victoryClaimed) return;
    const isWon =
      (this.mode === 'sudoku' && this.sudokuEngine?.status === 'won') ||
      (this.mode === 'caro' && this.caroEngine?.status === 'won') ||
      (this.mode === 'chess' && this.chessEngine?.status === 'won') ||
      (this.mode === 'blocks' && this.blockEngine?.status === 'won');
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
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'sudoku',
        this.sudokuEngine.reward,
        {
          sessionScore: Math.max(1200, 2600 - this.sudokuEngine.mistakesCount * 220),
          efficiency: this.sudokuEngine.mistakesCount,
        }
      );
      this.spawnCelebrationConfetti();
      this.onParentRefresh();
      this.renderDOM();
    } else if (this.mode === 'caro' && this.caroEngine?.status === 'won') {
      this.victoryClaimed = true;
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
    } else if (this.mode === 'blocks' && this.blockEngine?.status === 'won') {
      this.victoryClaimed = true;
      this.victorySummary = this.sim.completePuzzleArcadeVictory(
        'blocks',
        this.blockEngine.reward,
        {
          sessionScore: Math.max(1100, this.blockEngine.score),
          efficiency: Math.max(1, this.blockEngine.linesCleared || this.blockEngine.pieces.length),
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
    modalInner?.classList.toggle('pa-potions-sudoku-mode', this.mode === 'sudoku');
    modalInner?.classList.toggle('pa-marauder-caro-mode', this.mode === 'caro');

    const modalTitle = this.root.querySelector('#puzzleArcadeDialogTitle') as HTMLElement | null;
    if (modalTitle) {
      if (this.mode === 'chess') {
        modalTitle.innerHTML =
          '<img src="/paintings/chess/wk.png" alt="" style="width:28px;height:32px;object-fit:contain;vertical-align:-8px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Đại Sảnh Đường Hogwarts • Cờ Phù Thủy McGonagall';
      } else if (this.mode === 'sudoku') {
        modalTitle.innerHTML =
          '<img src="/paintings/sudoku/relic_1.png" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Hầm Độc Dược &amp; Cổ Ngữ Hogwarts • Ma Trận Cửu Bảo Bối';
      } else if (this.mode === 'caro') {
        modalTitle.innerHTML =
          '<img src="/paintings/caro/phoenix_seal.png" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:-7px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5));" />Bản Đồ Đạo Tặc Hogwarts • Trận Pháp Ngũ Ấn Phượng Hoàng';
      } else {
        modalTitle.innerHTML =
          '<img src="/sprites/m3_piece_scroll.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Lớp Cổ Ngữ Runes Hogwarts • Khảm Đá Cổ Ngữ Phép Thuật';
      }
    }

    const st = this.sim.state;
    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanDisp = st.sandboxMode ? '∞' : String(talismanQty);
    const reqTrial = this.sim.getRequiredLevelTrial();
    const winsProg = this.sim.getWinsProgressForCurrentLevel();
    const curInfo = this.sim.getDisciplineStageInfo(this.mode);
    const activeModeRank = this.sim.getPlayerMinigameRank(this.mode, 'valley');
    const nextCap = Math.min(100, st.level + 1);
    const isFeaturedModeNow = Boolean(
      !curInfo.isMaxed &&
        reqTrial &&
        !st.sandboxMode &&
        !this.sim.isHeadmasterPreview &&
        reqTrial.kind === this.mode &&
        !this.victorySummary
    );

    let stageHeadline = '';
    let stageSubtitle = '';
    let rewardSpec = { stars: 2, sand: 1, gold: 100 };
    let controlsHtml = '';
    let statusBannerHtml = '';

    const socialState = this.sim.ensureNeighborSocial();
    const activeStageNum = this.getActiveEngineStage();
    const bossMeta = getMilestoneBossMeta(activeStageNum);
    if (bossMeta) {
      statusBannerHtml += `
        <div class="pa-boss-strip">
          <span class="pa-boss-crown">👑 ĐẠI TRÙM MỐC ${activeStageNum}</span>
          <span class="pa-boss-text"><strong>${escapeHtml(bossMeta.bossGuardianVi)}</strong> — ${escapeHtml(bossMeta.bossTitleVi)} • <em>${escapeHtml(bossMeta.mechanicTagVi)}</em></span>
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
          <span>⚔️ <strong>GIẢI CỨU MÀN KHÓ (1 lần/ngày/bạn):</strong> Đang vượt hộ <strong>Màn ${this.rescueContext.stage}</strong> giúp ${escapeHtml(this.rescueContext.neighborEmoji)} <strong>${escapeHtml(this.rescueContext.neighborName)}</strong> • Thắng nhận <strong>+3 🍀 + 95G + 45 XP</strong>!</span>
        </div>
      `;
    } else if (mySosArcade) {
      if (mySosArcade.rescuedAt) {
        statusBannerHtml += `
          <div class="pa-trial-strip done">
            <span>🎉 <strong>${escapeHtml(mySosArcade.rescuerEmoji ?? '🦉')} ${escapeHtml(mySosArcade.rescuerName ?? 'Hàng xóm')}</strong> vừa giải cứu xong Màn ${mySosArcade.stage} giúp bạn!</span>
            <button type="button" id="btnPaClaimSosRescue" class="pa-mini-pill active">🎉 Nhận Qua Màn Ngay!</button>
          </div>
        `;
      } else {
        statusBannerHtml += `
          <div class="pa-trial-strip">
            <span>🦉 Đang phát tín hiệu Cú Đưa Thư nhờ hội bạn bè vượt hộ <strong>Màn ${mySosArcade.stage}</strong>...</span>
          </div>
        `;
      }
    }

    if (!this.rescueContext && reqTrial && !st.sandboxMode && !this.sim.isHeadmasterPreview) {
      const isCurrentTrialTab = reqTrial.kind === this.mode;
      if (this.victorySummary) {
        statusBannerHtml += `
          <div class="pa-trial-strip done">
            <span>🎉 <strong>Cấp Giải Đố ${st.level} (${winsProg.current}/${winsProg.required} màn)!</strong> Môn Đề Cử kế tiếp (Cấp ${nextCap}): <strong>${escapeHtml(reqTrial.icon)} ${escapeHtml(reqTrial.shortVi)}</strong></span>
            ${
              !isCurrentTrialTab
                ? `<button type="button" id="btnPaJumpRequiredTrial" class="pa-mini-pill active">▶️ Tới ${escapeHtml(reqTrial.shortVi)} (🔥 Đề cử)</button>`
                : ''
            }
          </div>
        `;
      } else if (curInfo.isMaxed) {
        statusBannerHtml += `
          <div class="pa-trial-strip done">
            <span>👑 <strong>Đã chinh phục Đỉnh 777/777 môn này!</strong> Đấu lại rèn luyện nhận Vàng &amp; XP • Môn Đề Cử gom 🌟 Sao tiếp theo: <strong>${escapeHtml(reqTrial.icon)} ${escapeHtml(reqTrial.shortVi)}</strong></span>
            ${
              !isCurrentTrialTab
                ? `<button type="button" id="btnPaJumpRequiredTrial" class="pa-mini-pill active">▶️ Tới ${escapeHtml(reqTrial.shortVi)} →</button>`
                : ''
            }
          </div>
        `;
      } else if (isCurrentTrialTab) {
        statusBannerHtml += `
          <div class="pa-trial-strip urgent">
            <span>
              🔥 <strong>ĐỀ CỬ CỤ DUMBLEDORE:</strong>
              Thắng màn <strong>${escapeHtml(reqTrial.icon)} ${escapeHtml(reqTrial.shortVi)}</strong> này nhận <strong>🌟 Sao gốc + Thưởng Đề Cử (+🌟 Mốc Cấp/Chuỗi 5, +1 ⏳ Cát, +35% 🪙)</strong> • Cấp ${st.level} → ${nextCap} (${winsProg.current}/${winsProg.required})!
            </span>
          </div>
        `;
      } else {
        statusBannerHtml += `
          <div class="pa-trial-strip">
            <span>
              🎯 Thắng màn này tích lũy <strong>Cấp ${st.level} → ${nextCap} (${winsProg.current}/${winsProg.required} màn)</strong> • Môn Đề Cử cấp này:
              <strong>${escapeHtml(reqTrial.icon)} ${escapeHtml(reqTrial.shortVi)}</strong>
            </span>
            <button type="button" id="btnPaJumpRequiredTrial" class="pa-mini-pill active">▶️ Tới ${escapeHtml(reqTrial.shortVi)} (🔥 Đề cử)</button>
          </div>
        `;
      }
    }

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      const se = this.sudokuEngine;
      rewardSpec = se.reward;
      const dispLbl =
        this.sudokuDisplayMode === 'relic_num'
          ? '🔮 Bảo Bối + Số'
          : this.sudokuDisplayMode === 'relic_only'
            ? '🏺 Thuần Bảo Bối'
            : '🔢 Ưu Tiên Số';
      const variantBadges = [
        se.diagonalRule ? '✕ Đường Chéo Vàng' : '',
        se.parityRule ? '◇Lẻ / ◯Chẵn' : '',
      ]
        .filter(Boolean)
        .map((b) => ` • <strong>${b}</strong>`)
        .join('');
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${se.stage}/${MAX_MINIGAME_STAGE} • Sách Phép Da Rồng 9×9 (${escapeHtml(se.difficultyLabel)})`;
      stageSubtitle = `Khắc đủ <strong>9 Bảo Bối (1: Snitch → 9: Fawkes)</strong>${variantBadges} • Đã khảm: <strong id="paSudokuProgress">${se.filledCount}/81</strong> ô • Sai: <strong id="paSudokuMistakes" class="${se.mistakesCount > 0 ? 'pa-err-inline' : ''}">${se.mistakesCount}/${se.maxMistakes}</strong>`;
      const canSudokuHint =
        se.status === 'playing' && (st.sandboxMode || se.freeHintsLeft + se.paidHintsLeft > 0);
      const canTalisman =
        (se.status === 'playing' || se.status === 'lost') &&
        !se.talismanUsed &&
        (st.sandboxMode || talismanQty > 0);
      const hintCostLbl = st.sandboxMode
        ? '∞'
        : se.freeHintsLeft > 0
          ? `Miễn phí (${se.freeHintsLeft})`
          : se.paidHintsLeft > 0
            ? `${se.hintGoldCost}G (${se.paidHintsLeft})`
            : 'Hết lượt';
      controlsHtml = `
        <button id="btnPaSudokuDisplayMode" type="button" class="pa-tool-btn ${this.sudokuDisplayMode !== 'num_only' ? 'active' : ''}" title="Đổi chế độ hiển thị Hình Bảo Bối / Chữ Số (Phím H)">
          ${dispLbl}
        </button>
        <button id="btnPaSudokuPencil" type="button" class="pa-tool-btn ${se.pencilMode ? 'active' : ''}" ${se.status !== 'playing' ? 'disabled' : ''}>
          🪶 Nháp (N): <strong>${se.pencilMode ? 'Bật' : 'Tắt'}</strong>
        </button>
        <button id="btnPaSudokuClear" type="button" class="pa-tool-btn" ${se.status !== 'playing' ? 'disabled' : ''}>
          🧹 Xóa Ô (Del)
        </button>
        <button id="btnPaSudokuHint" type="button" class="pa-tool-btn gold" ${!canSudokuHint ? 'disabled' : ''}>
          🧪 Phúc Lạc Dược Soi Ô <span class="pa-cost-pill">${hintCostLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="Tối đa 1 lần/lượt thử: Xoá ô sai + Soi 2 ô đáp án + Tăng +1 giới hạn sai (Nhận từ Ôn Ngoại Ngữ, Đơn Cú &amp; Kho Đỏ)">
          🔥 Bùa Phượng Hoàng <span class="pa-cost-pill">${se.talismanUsed ? 'Đã dùng' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Trang Sách Mới
        </button>
      `;
      if (se.status === 'lost') {
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>📕 Sách Phép Da Rồng đã quá giới hạn sai (<strong>${se.mistakesCount}/${se.maxMistakes}</strong>)! ${canTalisman ? 'Triệu hồi <strong>🔥 Bùa Phượng Hoàng</strong> hoặc bấm ' : 'Bấm '}<strong>🔄 Trang Sách Mới</strong> để giải lại (Không tốn Tim!).</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Hồi Sinh Bùa (×${talismanDisp})</button>` : ''}
          </div>
        `;
      }
    } else if (this.mode === 'caro' && this.caroEngine) {
      const ce = this.caroEngine;
      rewardSpec = ce.reward;
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${ce.stage}/${MAX_MINIGAME_STAGE} • Bản Đồ Đạo Tặc 13×13 — ${escapeHtml(ce.opponent.emoji)} ${escapeHtml(ce.opponent.name)} (${escapeHtml(ce.difficultyLabel)})`;
      const sealNote =
        ce.runeSealCount > 0
          ? ` • <strong>🔒 ${ce.runeSealCount} Ấn Chì Cổ Ngữ</strong> khóa giao điểm`
          : '';
      stageSubtitle = `Bạn cầm <strong>🔥 Ấn Phượng Hoàng</strong> nối <strong>5 ấn liên tiếp</strong> chống lại <strong>🐍 Ấn Đầu Lâu Xà</strong>${sealNote} (<strong id="paCaroMoves">${ce.moveHistory.length} nước</strong>)`;
      const canCaroUndo =
        ce.moveHistory.length > ce.initialHistoryLen &&
        ce.status !== 'ai_thinking' &&
        this.caroWinRevealTimer <= 0 &&
        (st.sandboxMode || ce.freeUndosLeft + ce.paidUndosLeft > 0);
      const canCaroHint =
        ce.status === 'playing' && (st.sandboxMode || ce.freeHintsLeft + ce.paidHintsLeft > 0);
      const canTalisman =
        (ce.status === 'playing' || ce.status === 'lost' || ce.status === 'draw') &&
        !ce.talismanUsed &&
        (st.sandboxMode || talismanQty > 0);
      const undoLbl = st.sandboxMode
        ? '∞'
        : ce.freeUndosLeft > 0
          ? `Miễn phí (${ce.freeUndosLeft})`
          : ce.paidUndosLeft > 0
            ? `${ce.undoGoldCost}G (${ce.paidUndosLeft})`
            : 'Hết lượt';
      const hintLbl = st.sandboxMode
        ? '∞'
        : ce.freeHintsLeft > 0
          ? `Miễn phí (${ce.freeHintsLeft})`
          : ce.paidHintsLeft > 0
            ? `${ce.hintGoldCost}G (${ce.paidHintsLeft})`
            : 'Hết lượt';
      controlsHtml = `
        <button id="btnPaCaroUndo" type="button" class="pa-tool-btn" ${!canCaroUndo ? 'disabled' : ''}>
          ↩️ Xoay Thời Gian <span class="pa-cost-pill">${undoLbl}</span>
        </button>
        <button id="btnPaCaroHint" type="button" class="pa-tool-btn gold" ${!canCaroHint ? 'disabled' : ''}>
          🗺️ Bản Đồ Chỉ Nước Đinh <span class="pa-cost-pill">${hintLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="Tối đa 1 lần/lượt thử: Thanh tẩy Ấn Hắc Ám nguy hiểm + Chỉ điểm nước công Phượng Hoàng">
          🔥 Bùa Phượng Hoàng <span class="pa-cost-pill">${ce.talismanUsed ? 'Đã dùng' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Trải Lại Bản Đồ
        </button>
      `;
      if (ce.status === 'lost' || ce.status === 'draw') {
        const caroRev = ce.getTurningPointReview();
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>${
              ce.status === 'lost'
                ? `${escapeHtml(ce.opponent.emoji)} <strong>${escapeHtml(ce.opponent.name)}</strong> vừa kết nối 5 Ấn Đầu Lâu Xà! Dùng <strong>🔥 Bùa Phượng Hoàng</strong>, <strong>↩️ Xoay Thời Gian</strong> hoặc <strong>🔄 Trải Lại Bản Đồ</strong>!`
                : `🤝 Bản Đồ Đạo Tặc đã kín ấn bất phân thắng bại! Bấm <strong>🔄 Trải Lại Bản Đồ</strong> để tái đấu!`
            }</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Hoá Giải Bằng Bùa (×${talismanDisp})</button>` : ''}
          </div>
          ${caroRev ? this.renderTurningPointCardHtml(caroRev) : ''}
        `;
      }
    } else if (this.mode === 'chess' && this.chessEngine) {
      const we = this.chessEngine;
      rewardSpec = we.reward;
      const isTactics = we.subMode === 'tactics';
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${we.stage}/${MAX_MINIGAME_STAGE} • ${escapeHtml(we.title)} (${escapeHtml(we.difficultyLabel)})`;
      stageSubtitle = `${escapeHtml(we.subtitle)} • Phe bạn: <strong>🦁 Hội Phượng Hoàng</strong> (<strong id="paChessTurn">${
        we.status === 'ai_thinking'
          ? `${escapeHtml(we.opponentName)} đang điều quân Slytherin...`
          : we.isInCheck('w')
            ? '⚠️ Cụ Dumbledore (Vua) đang bị chiếu!'
            : 'Lượt của bạn'
      }</strong>)`;
      const canChessUndo =
        we.moveCount > 0 &&
        we.status !== 'ai_thinking' &&
        (st.sandboxMode || we.freeUndosLeft + we.paidUndosLeft > 0);
      const canChessAssist =
        we.status === 'playing' && (st.sandboxMode || we.freeHintsLeft + we.paidAssistsLeft > 0);
      const canTalisman =
        (we.status === 'playing' || we.status === 'lost' || we.status === 'draw') &&
        !we.talismanUsed &&
        (st.sandboxMode || talismanQty > 0);
      const undoLbl = st.sandboxMode
        ? '∞'
        : we.freeUndosLeft > 0
          ? `Miễn phí (${we.freeUndosLeft})`
          : we.paidUndosLeft > 0
            ? `${we.undoGoldCost}G (${we.paidUndosLeft})`
            : 'Hết lượt';
      const hintLbl = st.sandboxMode
        ? '∞'
        : we.freeHintsLeft > 0
          ? `Miễn phí (${we.freeHintsLeft})`
          : we.paidAssistsLeft > 0
            ? `${we.assistGoldCost}G (${we.paidAssistsLeft})`
            : 'Hết lượt';
      controlsHtml = `
        <div class="pa-submode-switch" role="group" aria-label="Kiểu chơi Cờ Phù Thủy" title="${we.subModeLocked ? 'Từ Màn 11/777 thể thức màn được ấn định cố định theo Tháp Giải Đố' : 'Chọn thể thức tập luyện (Màn 1–10)'}">
          <button id="btnPaChessTactics" type="button" class="pa-mini-pill ${isTactics ? 'active' : ''}" ${we.subModeLocked && !isTactics ? 'disabled' : ''}>${we.subModeLocked && !isTactics ? '🔒 ' : '⚡ '}Giải Thế Cờ</button>
          <button id="btnPaChessMatch" type="button" class="pa-mini-pill ${!isTactics ? 'active' : ''}" ${we.subModeLocked && isTactics ? 'disabled' : ''}>${we.subModeLocked && isTactics ? '🔒 ' : '👑 '}Đại Chiến 8×8</button>
        </div>
        <button id="btnPaChessUndo" type="button" class="pa-tool-btn" ${!canChessUndo ? 'disabled' : ''}>
          ↩️ Đi Lại <span class="pa-cost-pill">${undoLbl}</span>
        </button>
        <button id="btnPaChessAssist" type="button" class="pa-tool-btn gold" ${!canChessAssist ? 'disabled' : ''}>
          🪄 Lệnh Nước Tối Ưu <span class="pa-cost-pill">${hintLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="Tối đa 1 lần/lượt thử: Lội ngược thế thua (nếu có) &amp; tung 1 nước chuẩn xác Fawkes">
          🔥 Bùa Phượng Hoàng <span class="pa-cost-pill">${we.talismanUsed ? 'Đã dùng' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          🔄 Bày Lại Quân Cờ
        </button>
      `;
      if (we.status === 'lost' || we.status === 'draw') {
        const chessRev = we.getTurningPointReview();
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>${
              we.status === 'lost'
                ? `🏰 Cụ Dumbledore đã bị chiếu bí trên bàn cờ Đại Sảnh! Bấm <strong>↩️ Đi Lại</strong>, <strong>🔥 Bùa Phượng Hoàng</strong> hoặc <strong>🔄 Bày Lại Quân Cờ</strong>!`
                : `🤝 Trận Cờ Phù Thủy Đại Sảnh Đường bất phân thắng bại! Bấm <strong>🔄 Bày Lại Quân Cờ</strong> để tái đấu!`
            }</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Phản Công Bằng Bùa (×${talismanDisp})</button>` : ''}
          </div>
          ${chessRev ? this.renderTurningPointCardHtml(chessRev) : ''}
        `;
      }
    } else if (this.mode === 'blocks' && this.blockEngine) {
      const be = this.blockEngine;
      rewardSpec = be.reward;
      const isTangram = be.subMode === 'tangram';
      stageHeadline = `${curInfo.isMaxed ? '👑 ' : ''}Màn ${be.stage}/${MAX_MINIGAME_STAGE} • ${escapeHtml(be.title)} (${escapeHtml(be.difficultyLabel)})`;
      if (isTangram) {
        const placedCnt = be.pieces.filter((p) => Boolean(p.placedAt)).length;
        stageSubtitle = `Kéo thả (hoặc chạm chọn) khối ngọc vào khuôn vàng • Nhấp khối trên bàn để nhấc lại (<strong id="paBlockProgress">${placedCnt}/${be.pieces.length}</strong> khối)`;
      } else {
        const obsNote =
          be.obsidianRunesCount > 0
            ? ` • <strong>🔮 ${be.obsidianRunesCount} Đá Hắc Diện ×2 lớp</strong>`
            : '';
        stageSubtitle = `Lấp đầy hàng ngang hoặc cột dọc 8×8 để kích nổ • Đã nổ: <strong id="paBlockProgress">${be.linesCleared}/${be.targetLines}</strong> hàng &amp; <strong>${be.runesCleared}/${be.totalRunes}</strong> ấn cổ ngữ${obsNote}`;
      }
      const canBlockAssist =
        be.status !== 'won' && (st.sandboxMode || be.freeHelpsLeft + be.paidHelpsLeft > 0);
      const canTalisman =
        be.status !== 'won' && !be.talismanUsed && (st.sandboxMode || talismanQty > 0);
      const assistCostLbl = st.sandboxMode
        ? '∞'
        : be.freeHelpsLeft > 0
          ? `Miễn phí (${be.freeHelpsLeft})`
          : be.paidHelpsLeft > 0
            ? `${be.assistGoldCost}G (${be.paidHelpsLeft})`
            : 'Hết lượt';
      controlsHtml = `
        <div class="pa-submode-switch" role="group" aria-label="Kiểu chơi Khảm Đá Cổ Ngữ" title="${be.subModeLocked ? 'Từ Màn 11/777 thể thức màn được ấn định cố định theo Tháp Khảo Thí' : 'Chọn thể thức tập luyện (Màn 1–10)'}">
          <button id="btnPaSubTangram" type="button" class="pa-mini-pill ${isTangram ? 'active' : ''}" ${be.subModeLocked && !isTangram ? 'disabled' : ''}>${be.subModeLocked && !isTangram ? '🔒 ' : '📐 '}Khuôn Ấn Cổ Ngữ</button>
          <button id="btnPaSubBlast" type="button" class="pa-mini-pill ${!isTangram ? 'active' : ''}" ${be.subModeLocked && isTangram ? 'disabled' : ''}>${be.subModeLocked && isTangram ? '🔒 ' : '💥 '}Phá Trận 8×8</button>
        </div>
        <button id="btnPaBlockAssist" type="button" class="pa-tool-btn gold" ${!canBlockAssist ? 'disabled' : ''}>
          ${isTangram ? '🪄 Lắp Đúng 1 Khối' : '⚡ Sét Dọn 4×4'} <span class="pa-cost-pill">${assistCostLbl}</span>
        </button>
        <button id="btnPaPhoenixTalisman" type="button" class="pa-tool-btn talisman" ${!canTalisman ? 'disabled' : ''} title="${isTangram ? 'Tối đa 1 lần/lượt thử: Khớp chuẩn 2 mảnh ngọc vào khuôn' : 'Tối đa 1 lần/lượt thử: Lửa Phượng Hoàng dọn vùng 6×6 trung tâm + nứt Ấn Cổ Ngữ'}">
          🔥 Bùa Phượng Hoàng <span class="pa-cost-pill">${be.talismanUsed ? 'Đã dùng' : `×${talismanDisp}`}</span>
        </button>
        <button id="btnPaRestart" type="button" class="pa-tool-btn">
          ${isTangram ? '🧹 Nhấc Về Khay' : '🔄 Chơi Lại Màn'}
        </button>
      `;
      if (be.status === 'stuck') {
        statusBannerHtml += `
          <div class="pa-alert-strip">
            <span>⚠️ Hết chỗ đặt 3 khối hiện tại trên bàn 8×8! Dùng <strong>🔥 Bùa Phượng Hoàng</strong>, <strong>⚡ Sét Dọn 4×4</strong> hoặc <strong>🔄 Chơi Lại Màn</strong>!</span>
            ${canTalisman ? `<button id="btnPaRescuePhoenixTalisman" type="button" class="pa-tool-btn talisman">🔥 Lửa Phượng Hoàng Dọn Bàn (×${talismanDisp})</button>` : ''}
          </div>
        `;
      }
    }

    if (!this.rescueContext && !this.victorySummary) {
      controlsHtml += mySosArcade?.rescuedAt
        ? `
          <button id="btnPaSideClaimSos" type="button" class="pa-tool-btn active">
            🎉 Nhận Qua Màn Giải Cứu!
          </button>
        `
        : `
          <button id="btnPaAskFriendSos" type="button" class="pa-tool-btn" ${rescuesReceivedLeft <= 0 && !mySosArcade ? 'disabled' : ''} title="Nhờ bạn bè vào vượt hộ màn khó này (tối đa 5 lần/ngày, reset lúc 00:00)">
            ${mySosArcade ? '🦉 Đang gọi bạn...' : `🆘 Nhờ Bạn Qua Màn (${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES})`}
          </button>
        `;
    }

    let victoryOverlayHtml = '';
    if (this.rescueContext && this.rescueVictoryOutcome) {
      const rv = this.rescueVictoryOutcome;
      victoryOverlayHtml = `
        <div class="pa-victory-overlay" role="region" aria-label="Giải cứu thành công">
          <div class="pa-victory-card">
            <div class="pa-victory-title">
              🏆 Giải Cứu Thành Công Cho ${escapeHtml(this.rescueContext.neighborName)}!
            </div>
            <div style="font-size:12.5px;font-weight:800;color:#78350f;">
              Đã vượt hộ <strong>Màn ${this.rescueContext.stage}</strong> giúp ${escapeHtml(this.rescueContext.neighborEmoji)} <strong>${escapeHtml(this.rescueContext.neighborName)}</strong>!
            </div>
            <div class="m3-reward-badges">
              <span class="m3-reward-chip star">+${rv.tokensEarned} 🍀 Huy Hiệu Tình Bạn</span>
              <span class="m3-reward-chip">🪙 +${rv.goldEarned}G</span>
              <span class="m3-reward-chip">⭐ +${rv.xpEarned} XP</span>
              ${
                rv.buildReduction && rv.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">🔨 -${formatDurationCompactVi(rv.buildReduction.reducedSec)} xây ${escapeHtml(rv.buildReduction.targetName ?? 'công trình')}</span>`
                  : rv.buildReduction?.allActiveAtFloor && (rv.buildReduction.activeCount ?? 0) > 0
                    ? `<span class="m3-reward-chip">🔒 Đã chạm mốc tối thiểu ${formatDurationCompactVi(rv.buildReduction.floorSec ?? 3600)}</span>`
                    : ''
              }
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;">
              <button id="btnPaBackToPark" type="button" class="brass-btn gold-cta" style="padding:9px 18px;font-size:13.5px;">
                🏡 Quay Về Vườn / Sổ Hàng Xóm
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.victorySummary) {
      const vs = this.victorySummary;
      const winReview = this.getActiveTurningPointReview();

      if (this.inspectingTurningPoint && winReview) {
        victoryOverlayHtml = `
          <div class="pa-inspect-return-bar" role="region" aria-label="Đang soi Gương Chiếu Hậu Pháp Thuật">
            <span>🪞 <strong>Gương Chiếu Hậu Pháp Thuật:</strong> ${escapeHtml(winReview.summaryVi)}</span>
            <div class="pa-inspect-return-actions">
              <button id="btnPaReturnVictoryCard" type="button" class="brass-btn gold-cta">🏆 Về Bảng Thưởng</button>
              <button id="btnPaNextStage" type="button" class="brass-btn">▶️ Sang Màn ${vs.nextStage}</button>
            </div>
          </div>
        `;
      } else {
        victoryOverlayHtml = `
          <div class="pa-victory-overlay" role="region" aria-label="Hoàn thành màn giải đố">
            <div class="pa-victory-card">
              <div class="pa-victory-title">${
                vs.isMasterReplay
                  ? `👑 Rèn Luyện Đỉnh 777/777 Thành Công!`
                  : curInfo.isMaxed
                    ? `👑 CHINH PHỤC ĐỈNH 777/777!`
                    : `🎉 Tuyệt Đỉnh Trí Tuệ • Cấp ${vs.newMasterLevel ?? st.level}!`
              }</div>
              ${
                vs.featuredBonusApplied
                  ? `<div style="font-size:12.5px;font-weight:900;color:#b45309;background:#fef3c7;border:1.5px solid #f59e0b;border-radius:999px;padding:3px 12px;">🔥 THƯỞNG ĐỀ CỬ CỤ DUMBLEDORE!</div>`
                  : ''
              }
              <div class="m3-reward-badges">
                ${
                  vs.starsEarned > 0
                    ? `<span class="m3-reward-chip star">
                        <img src="/sprites/m3_icon_star.png" alt="" style="width:16px;height:16px;" />
                        +${vs.starsEarned} Sao Phép Thuật${vs.featuredBonusApplied ? ' (🔥 Đề cử)' : ''}
                      </span>`
                    : `<span class="m3-reward-chip">👑 Đã nhận đủ Sao 777/777</span>`
                }
                ${
                  vs.sandEarned > 0
                    ? `<span class="m3-reward-chip" style="border-color:#0284c7;color:#0c4a6e;background:#e0f2fe;">
                        ⏳ +${vs.sandEarned} Cát Xoay Thời Gian
                      </span>`
                    : ''
                }
                <span class="m3-reward-chip">🪙 +${vs.goldEarned}G</span>
                <span class="m3-reward-chip">⭐ +${vs.xpEarned} XP Mùa Gặt</span>
                ${
                  vs.buildReduction && vs.buildReduction.reducedSec > 0
                    ? `<span class="m3-reward-chip">🔨 -${formatDurationCompactVi(vs.buildReduction.reducedSec)} xây ${escapeHtml(vs.buildReduction.targetName ?? 'công trình')}${vs.buildReduction.hitMinFloor ? ' (chạm mốc tối thiểu)' : ''}</span>`
                    : vs.buildReduction?.allActiveAtFloor && (vs.buildReduction.activeCount ?? 0) > 0
                      ? `<span class="m3-reward-chip">🔒 Công trình chạm mốc tối thiểu ${formatDurationCompactVi(vs.buildReduction.floorSec ?? 3600)}</span>`
                      : ''
                }
                ${
                  vs.leaderboardRankUp
                    ? vs.leaderboardRankUp.rankUpBy > 0
                      ? `<span class="lb-rankup-badge">🏆 Hạng #${vs.leaderboardRankUp.newRank} • 🔼 Tăng +${vs.leaderboardRankUp.rankUpBy} bậc!</span>`
                      : `<span class="m3-reward-chip">🏆 Hạng #${vs.leaderboardRankUp.newRank} môn này</span>`
                    : ''
                }
              </div>
              ${winReview ? this.renderTurningPointCardHtml(winReview) : ''}
              <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;">
                <button id="btnPaNextStage" type="button" class="brass-btn gold-cta" style="padding:9px 18px;font-size:13.5px;">
                  ${vs.isMasterReplay || curInfo.isMaxed ? `👑 Đấu Lại Đỉnh 777/777` : `▶️ Sang Màn ${vs.nextStage}/${MAX_MINIGAME_STAGE}`}
                </button>
                <button id="btnPaVictoryLeaderboard" type="button" class="brass-btn" style="padding:9px 14px;font-size:13px;">
                  🏆 Bảng Xếp Hạng (#${activeModeRank})
                </button>
                <button id="btnPaBackToPark" type="button" class="brass-btn" style="padding:9px 14px;font-size:13px;">
                  🏗️ Về Xây Điền Trang (${st.sandboxMode ? '∞' : st.match3.stars} 🌟)
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
      return `<span class="pa-tab-trial" title="Môn Đề Cử thưởng thêm 🌟 Sao Mốc + ⏳ Cát + 35% 🪙">🔥</span>`;
    };

    const fmtTabLv = (kind: PuzzleArcadeMode | 'match3'): string => {
      const inf = this.sim.getDisciplineStageInfo(kind);
      return inf.isMaxed ? `👑777` : `${inf.currentStage}/777`;
    };

    const previewSand = isFeaturedModeNow ? rewardSpec.sand + 1 : rewardSpec.sand;
    const streakCount = st.match3.winStreak ?? 0;

    box.innerHTML = `
      <div class="pa-layout-shell">
        <aside class="pa-side-dock" aria-label="Bảng chọn trò chơi và công cụ">
          <div class="pa-top-bar">
            <div class="pa-dock-head-row">
              <div class="pa-currencies">
                <span class="m3-res-chip" title="Cấp Giải Đố Tổng (${winsProg.current}/${winsProg.required} màn tới Cấp ${nextCap})">
                  <span>🏆</span>
                  <strong>Cấp ${st.level} (${winsProg.current}/${winsProg.required})</strong>
                </span>
                <span class="m3-res-chip" title="Sao Phép Thuật dùng để mở khóa vùng đất &amp; dựng các công trình Điền Trang (0 tốn Vàng!)">
                  <img src="/sprites/m3_icon_star.png" alt="Sao" class="m3-res-icon" />
                  <strong id="paStarsText">${st.sandboxMode ? '∞' : st.match3.stars}</strong>
                </span>
                <span class="m3-res-chip" title="Cát Xoay Thời Gian dùng để thu hoạch ruộng &amp; ra lò bánh tức thì">
                  <span>⏳</span>
                  <strong id="paSandText">${st.sandboxMode ? '∞' : st.timeSand}</strong>
                </span>
                <span class="m3-res-chip" title="Vàng Galleon Điền Trang">
                  <span class="g-coin" style="width:17px;height:17px;font-size:10.5px;">G</span>
                  <strong id="paGoldText">${st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN')}</strong>
                </span>
                <span class="m3-res-chip" title="Bùa Trợ Chiến Phượng Hoàng (tối đa 12; dùng 1 lần/màn — nhận khi Ôn Ngoại Ngữ, Giao Đơn Cú hoặc Rèn tại Kho Đỏ)">
                  <span>🔥</span>
                  <strong id="paTalismanText">${talismanDisp}</strong>
                </span>
                <button id="btnPaOpenLeaderboard" type="button" class="m3-res-chip minigame-lb-chip" title="Mở Bảng Xếp Hạng riêng cho môn đang chọn — Hạng hiện tại của bạn: #${activeModeRank}">
                  <span>🏆</span>
                  <strong id="paRankText">Hạng #${activeModeRank}</strong>
                </button>
                ${
                  streakCount > 0
                    ? `<span class="m3-res-chip" title="Chuỗi Thắng Liên Tiếp dùng chung cho cả 5 môn giải đố!">⚡ <strong>×${streakCount}</strong></span>`
                    : ''
                }
              </div>
              <form method="dialog" class="pa-inline-close-form">
                <button type="submit" class="brass-btn pa-inline-close-btn" title="Đóng sảnh trò chơi (Esc)">✕ Đóng</button>
              </form>
            </div>

            <div class="pa-mode-tabs" role="tablist" aria-label="Chọn môn khảo thí phép thuật Hogwarts" ${this.rescueContext ? 'style="opacity:0.65;pointer-events:none;"' : ''}>
              <button type="button" role="tab" aria-selected="${this.mode === 'caro'}" data-pa-mode="caro" class="pa-mode-tab ${this.mode === 'caro' ? 'active' : ''}" title="Trận Pháp Ngũ Ấn Bản Đồ Đạo Tặc (777 Màn)">
                <span class="pa-tab-name">🗺️ Ngũ Ấn Đạo Tặc</span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('caro')}</span>${trialBadgeFor('caro')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'sudoku'}" data-pa-mode="sudoku" class="pa-mode-tab ${this.mode === 'sudoku' ? 'active' : ''}" title="Ma Trận Cửu Bảo Bối Hầm Độc Dược (777 Màn)">
                <span class="pa-tab-name">🔮 Cửu Bảo Bối</span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('sudoku')}</span>${trialBadgeFor('sudoku')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'chess'}" data-pa-mode="chess" class="pa-mode-tab ${this.mode === 'chess' ? 'active' : ''}" title="Cờ Phù Thủy Đại Sảnh Đường (777 Màn)">
                <span class="pa-tab-name">🏰 Cờ Phù Thủy</span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('chess')}</span>${trialBadgeFor('chess')}</span>
              </button>
              <button type="button" role="tab" aria-selected="${this.mode === 'blocks'}" data-pa-mode="blocks" class="pa-mode-tab ${this.mode === 'blocks' ? 'active' : ''}" title="Khảm Đá Cổ Ngữ Runes (777 Màn)">
                <span class="pa-tab-name">🧱 Khảm Cổ Ngữ</span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('blocks')}</span>${trialBadgeFor('blocks')}</span>
              </button>
              <button id="btnPaGoMatch3" type="button" class="pa-mode-tab switch-m3" title="Chuyển sang Gác Xép Bùa Gặt Honeydukes (777 Màn)">
                <span class="pa-tab-name">🍓 Bùa Gặt Kẹo</span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('match3')}</span>${trialBadgeFor('match3')}</span>
              </button>
            </div>
          </div>

          <div class="pa-stage-banner">
            <div class="pa-stage-meta">
              <div class="pa-stage-title">${stageHeadline}</div>
              <div class="pa-stage-sub">${stageSubtitle}</div>
            </div>
            <div class="pa-reward-preview" title="Phần thưởng khi hoàn thành màn này">
              ${
                curInfo.isMaxed
                  ? `<span>👑 Rèn luyện 777/777:</span><strong>+${ Math.max(18, Math.round(rewardSpec.gold * 0.5)) }G</strong>`
                  : `<span>${isFeaturedModeNow ? '🔥 Đề cử:' : 'Thưởng màn:'}</span>
                     <strong>+${rewardSpec.stars}${isFeaturedModeNow ? '+' : ''} 🌟</strong>
                     <strong>+${previewSand} ⏳</strong>
                     <strong>+${rewardSpec.gold}G</strong>`
              }
            </div>
          </div>

          ${statusBannerHtml}

          <div class="pa-controls-bar">
            ${controlsHtml}
          </div>
        </aside>

        <div class="pa-stage-viewport">
          <div class="pa-canvas-shell">
            <canvas id="paBoardCanvas" width="${PA_VIRTUAL_W}" height="${PA_VIRTUAL_H}" aria-label="Bàn chơi Sảnh Bàn Cờ &amp; Cổ Ngữ Phép Thuật"></canvas>
            ${victoryOverlayHtml}
          </div>
        </div>
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
      const prog = box.querySelector('#paSudokuProgress');
      if (prog) {
        prog.textContent = `${this.sudokuEngine.filledCount}/81`;
      }
      const mistEl = box.querySelector('#paSudokuMistakes');
      if (mistEl) {
        mistEl.textContent = `${this.sudokuEngine.mistakesCount}/${this.sudokuEngine.maxMistakes}`;
        mistEl.classList.toggle('pa-err-inline', this.sudokuEngine.mistakesCount > 0);
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
              ? '⚠️ Cụ Dumbledore (Vua) đang bị chiếu!'
              : 'Lượt Gryffindor';
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
    } else if (this.mode === 'blocks' && this.blockEngine) {
      const prog = box.querySelector('#paBlockProgress');
      if (prog) {
        if (this.blockEngine.subMode === 'tangram') {
          const placed = this.blockEngine.pieces.filter((p) => Boolean(p.placedAt)).length;
          prog.textContent = `${placed}/${this.blockEngine.pieces.length}`;
        } else {
          prog.textContent = `${this.blockEngine.linesCleared}/${this.blockEngine.targetLines}`;
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

    // Sudoku controls
    box.querySelector('#btnPaSudokuDisplayMode')?.addEventListener('click', () => {
      this.cycleSudokuDisplayMode();
    });

    box.querySelector('#btnPaSudokuPencil')?.addEventListener('click', () => {
      if (!this.sudokuEngine) return;
      this.sudokuEngine.pencilMode = !this.sudokuEngine.pencilMode;
      this.sim.audio.playClick();
      this.renderDOM();
    });

    box.querySelector('#btnPaSudokuClear')?.addEventListener('click', () => {
      if (!this.sudokuEngine) return;
      if (this.sudokuEngine.clearSelectedCell()) {
        this.sim.audio.playClick();
        this.updateLiveCountersOnly();
      }
    });

    box.querySelector('#btnPaSudokuHint')?.addEventListener('click', () => {
      if (!this.sudokuEngine || this.sudokuEngine.status !== 'playing') return;
      const se = this.sudokuEngine;
      if (!this.sim.state.sandboxMode && se.freeHintsLeft <= 0 && se.paidHintsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Phúc Lạc Dược soi ô!', '🧪');
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
        this.spawnBurst(cx, cy, '#facc15', 20);
        this.sim.audio.playPowerupBlast();
        if (res.won) {
          this.checkAndClaimVictory();
        } else {
          this.renderDOM();
        }
      }
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
        this.sim.audio.playClick();
        this.renderDOM();
      }
    });

    box.querySelector('#btnPaChessAssist')?.addEventListener('click', () => {
      const we = this.chessEngine;
      if (!we || we.status !== 'playing') return;
      if (!this.sim.state.sandboxMode && we.freeHintsLeft <= 0 && we.paidAssistsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt Lệnh Nước Tối Ưu!', '🪄');
        return;
      }
      if (we.freeHintsLeft > 0) {
        we.freeHintsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(we.assistGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          we.paidAssistsLeft = Math.max(0, we.paidAssistsLeft - 1);
        }
      }
      const res = we.useBestMoveAssist();
      if (res.ok && res.move) {
        const movedPiece =
          we.board[res.move.toR]?.[res.move.toC] ?? { color: 'w', type: 'q' };
        this.triggerChessMoveVfx(
          res.move.fromR,
          res.move.fromC,
          res.move.toR,
          res.move.toC,
          movedPiece,
          Boolean(res.move.captured || res.move.isEnPassant),
          res.won
        );
        this.sim.audio.playPowerupBlast();
        if (res.won) {
          this.checkAndClaimVictory();
        } else if (res.aiThinking) {
          this.aiThinkTimer = 0.42;
          this.renderDOM();
        } else {
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

    box.querySelector('#btnPaRestart')?.addEventListener('click', () => {
      if (
        this.mode === 'blocks' &&
        this.blockEngine &&
        this.blockEngine.subMode === 'tangram' &&
        this.blockEngine.status === 'playing'
      ) {
        // Lift all placed Tangram pieces back to tray cleanly
        for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
          for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
            this.blockEngine.grid[r][c] = null;
          }
        }
        for (const p of this.blockEngine.pieces) {
          p.placedAt = null;
        }
        this.selectedBlockUid = null;
        this.sim.audio.playClick();
        this.updateLiveCountersOnly();
        return;
      }
      this.resetInteractionState();
      this.ensureEngineForMode(this.mode, true);
      this.sim.audio.playClick();
      this.renderDOM();
    });

    // Block controls
    box.querySelector('#btnPaSubTangram')?.addEventListener('click', () => {
      if (this.blockEngine?.subMode === 'tangram') return;
      if (this.blockEngine?.subModeLocked) {
        this.showToast('🔒 Từ Màn 11/777 trở đi, thể thức mỗi màn được ấn định cố định!', '🧱');
        return;
      }
      this.blockForceSubMode = 'tangram';
      this.resetInteractionState();
      this.ensureEngineForMode('blocks', true);
      this.renderDOM();
    });

    box.querySelector('#btnPaSubBlast')?.addEventListener('click', () => {
      if (this.blockEngine?.subMode === 'blast') return;
      if (this.blockEngine?.subModeLocked) {
        this.showToast('🔒 Từ Màn 11/777 trở đi, thể thức mỗi màn được ấn định cố định!', '🧱');
        return;
      }
      this.blockForceSubMode = 'blast';
      this.resetInteractionState();
      this.ensureEngineForMode('blocks', true);
      this.renderDOM();
    });

    box.querySelector('#btnPaBlockAssist')?.addEventListener('click', () => {
      const be = this.blockEngine;
      if (!be || be.status === 'won') return;
      if (!this.sim.state.sandboxMode && be.freeHelpsLeft <= 0 && be.paidHelpsLeft <= 0) {
        this.showToast('Màn này đã dùng hết lượt trợ giúp Cổ Ngữ!', '⚡');
        return;
      }
      if (be.freeHelpsLeft > 0) {
        be.freeHelpsLeft -= 1;
      } else {
        const pay = this.sim.spendPuzzleHelperGold(be.assistGoldCost);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        if (!this.sim.state.sandboxMode) {
          be.paidHelpsLeft = Math.max(0, be.paidHelpsLeft - 1);
        }
      }
      const res = be.useMagicAssist();
      if (res.ok) {
        this.drainBlockBlastVfx();
        this.spawnBurst(BLK_BOARD_X + BLK_BOARD_PX * 0.5, BLK_BOARD_Y + BLK_BOARD_PX * 0.5, '#facc15', 22);
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🪄');
        if (res.won) {
          this.checkAndClaimVictory();
        } else {
          this.renderDOM();
        }
      }
    });

    // Phoenix Talisman (strictly 1 use per stage attempt across all 4 arcade disciplines)
    const handlePhoenixTalisman = () => {
      const activeUsed =
        this.mode === 'sudoku'
          ? this.sudokuEngine?.talismanUsed
          : this.mode === 'caro'
            ? this.caroEngine?.talismanUsed
            : this.mode === 'chess'
              ? this.chessEngine?.talismanUsed
              : this.blockEngine?.talismanUsed;
      if (activeUsed) {
        this.showToast('Mỗi lượt thử màn chỉ được triệu hồi tối đa 1 Bùa Phượng Hoàng!', '🔥');
        return;
      }
      if (!this.sim.state.sandboxMode && this.sim.getPhoenixTalismanCount() <= 0) {
        this.showToast(
          'Chưa có Bùa Phượng Hoàng! Hãy ôn Ngoại Ngữ (8 câu đúng), giao Đơn Cú hoặc rèn tại Kho Đỏ!',
          '🔥'
        );
        return;
      }
      if (!this.sim.consumePhoenixTalisman()) return;

      if (this.mode === 'sudoku' && this.sudokuEngine) {
        const res = this.sudokuEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.grantPhoenixTalisman(1);
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
          this.renderDOM();
        }
      } else if (this.mode === 'caro' && this.caroEngine) {
        const res = this.caroEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.grantPhoenixTalisman(1);
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
        this.onParentRefresh();
        this.renderDOM();
      } else if (this.mode === 'chess' && this.chessEngine) {
        const res = this.chessEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.grantPhoenixTalisman(1);
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
          this.renderDOM();
        } else {
          this.renderDOM();
        }
      } else if (this.mode === 'blocks' && this.blockEngine) {
        const res = this.blockEngine.applyPhoenixTalisman();
        if (!res.ok) {
          this.sim.grantPhoenixTalisman(1);
          this.showToast(res.msg, '🔥');
          return;
        }
        this.drainBlockBlastVfx();
        this.spawnWeasleyFireworks(
          BLK_BOARD_X + BLK_BOARD_PX * 0.5,
          BLK_BOARD_Y + BLK_BOARD_PX * 0.5,
          2
        );
        this.sim.audio.playPowerupBlast();
        this.showToast(res.msg, '🔥');
        this.onParentRefresh();
        if (res.won) {
          this.checkAndClaimVictory();
        } else {
          this.renderDOM();
        }
      }
    };

    box.querySelector('#btnPaPhoenixTalisman')?.addEventListener('click', handlePhoenixTalisman);
    box
      .querySelector('#btnPaRescuePhoenixTalisman')
      ?.addEventListener('click', handlePhoenixTalisman);

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
      const vx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * PA_VIRTUAL_W;
      const vy = ((ev.clientY - rect.top) / Math.max(1, rect.height)) * PA_VIRTUAL_H;
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
      this.caroHoverCell = null;
      this.chessHoverSquare = null;
    });
  }

  // ==========================================================================
  // POINTER HANDLERS FOR ALL 6 PUZZLE MODES
  // ==========================================================================

  private applySudokuDigit(digit: number): void {
    if (!this.sudokuEngine || this.sudokuEngine.status !== 'playing') return;
    const prevRem = this.sudokuEngine.getRemainingDigitCounts()[digit] ?? 0;
    const res = this.sudokuEngine.inputDigit(digit);
    if (!res.changed) {
      this.sim.audio.playClick();
      return;
    }
    const sel = this.sudokuEngine.selected;
    const relicMeta = HP_SUDOKU_RELIC_META[digit];
    if (sel) {
      const cx = SUDOKU_BOARD_X + (sel.c + 0.5) * SUDOKU_CELL_PX;
      const cy = SUDOKU_BOARD_Y + (sel.r + 0.5) * SUDOKU_CELL_PX;
      this.spawnBurst(
        cx,
        cy,
        res.conflict
          ? '#fb7185'
          : this.sudokuEngine.pencilMode
            ? '#93c5fd'
            : (relicMeta?.accent ?? '#facc15'),
        res.conflict ? 9 : 15
      );
      const nextRem = this.sudokuEngine.getRemainingDigitCounts()[digit] ?? 0;
      if (!res.conflict && prevRem === 1 && nextRem === 0) {
        // Completed all 9 instances of this Harry Potter Relic!
        const padRect = this.sudokuPadRects.get(digit);
        if (padRect) {
          this.spawnBurst(
            padRect.x + padRect.w * 0.5,
            padRect.y + padRect.h * 0.5,
            relicMeta?.accent ?? '#fde047',
            22
          );
        }
      }
    }
    if (res.conflict) {
      this.sim.audio.playClick();
    } else {
      this.sim.audio.playMatchPop(1);
    }
    if (res.won) {
      this.checkAndClaimVictory();
    } else if (res.lost) {
      this.showToast(
        `📕 Quá giới hạn sai (${this.sudokuEngine.mistakesCount}/${this.sudokuEngine.maxMistakes}) — Bấm Trang Sách Mới để giải lại!`,
        '📕'
      );
      this.renderDOM();
    } else {
      this.updateLiveCountersOnly();
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
      this.sim.audio.playClick();
      return;
    }
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
      this.updateLiveCountersOnly();
    } else if (res.draw) {
      this.renderDOM();
    } else {
      this.updateLiveCountersOnly();
    }
  }

  private handlePointerDown(vx: number, vy: number): void {
    if (this.mode === 'sudoku' && this.sudokuEngine) {
      if (
        vx >= SUDOKU_BOARD_X &&
        vx <= SUDOKU_BOARD_X + SUDOKU_BOARD_PX &&
        vy >= SUDOKU_BOARD_Y &&
        vy <= SUDOKU_BOARD_Y + SUDOKU_BOARD_PX
      ) {
        const c = Math.min(8, Math.max(0, Math.floor((vx - SUDOKU_BOARD_X) / SUDOKU_CELL_PX)));
        const r = Math.min(8, Math.max(0, Math.floor((vy - SUDOKU_BOARD_Y) / SUDOKU_CELL_PX)));
        this.sudokuEngine.selected = { r, c };
        this.sim.audio.playClick();
        return;
      }

      for (const [digit, rect] of this.sudokuPadRects.entries()) {
        if (vx >= rect.x && vx <= rect.x + rect.w && vy >= rect.y && vy <= rect.y + rect.h) {
          this.applySudokuDigit(digit);
          return;
        }
      }

      if (
        this.sudokuEraseRect &&
        vx >= this.sudokuEraseRect.x &&
        vx <= this.sudokuEraseRect.x + this.sudokuEraseRect.w &&
        vy >= this.sudokuEraseRect.y &&
        vy <= this.sudokuEraseRect.y + this.sudokuEraseRect.h
      ) {
        if (this.sudokuEngine.clearSelectedCell()) {
          this.sim.audio.playClick();
          this.updateLiveCountersOnly();
        }
        return;
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

    if (this.mode === 'blocks' && this.blockEngine) {
      // 1. Check Tray slots first
      for (const [uid, rect] of this.traySlotBounds.entries()) {
        if (vx >= rect.x && vx <= rect.x + rect.w && vy >= rect.y && vy <= rect.y + rect.h) {
          const piece = this.blockEngine.pieces.find((p) => p.uid === uid && !p.used && !p.placedAt);
          if (piece) {
            this.draggingBlockUid = piece.uid;
            this.selectedBlockUid = piece.uid;
            this.draggingBlockOriginTangram = null;
            this.sim.audio.playClick();
            return;
          }
        }
      }

      // 2. Check Board cells
      if (
        vx >= BLK_BOARD_X &&
        vx <= BLK_BOARD_X + BLK_BOARD_PX &&
        vy >= BLK_BOARD_Y &&
        vy <= BLK_BOARD_Y + BLK_BOARD_PX
      ) {
        const c = Math.floor((vx - BLK_BOARD_X) / BLK_CELL_PX);
        const r = Math.floor((vy - BLK_BOARD_Y) / BLK_CELL_PX);

        // If user already click-selected a tray piece, try placing it at (r, c) centered!
        if (this.selectedBlockUid !== null) {
          const selPiece = this.blockEngine.pieces.find(
            (p) => p.uid === this.selectedBlockUid && !p.used && !p.placedAt
          );
          if (selPiece) {
            const anchor = this.computeBestBlockAnchor(selPiece, vx, vy);
            if (this.blockEngine.canPlacePiece(selPiece.uid, anchor.r, anchor.c)) {
              this.commitBlockPlacement(selPiece.uid, anchor.r, anchor.c);
              return;
            }
          }
        }

        // In Tangram mode, allow picking up an already-placed block from the board!
        if (this.blockEngine.subMode === 'tangram' && this.blockEngine.grid[r]?.[c] !== null) {
          const prevPiece = this.blockEngine.pieces.find(
            (p) =>
              p.placedAt &&
              p.cells.some(([dr, dc]) => p.placedAt!.r + dr === r && p.placedAt!.c + dc === c)
          );
          const prevOrigin = prevPiece?.placedAt ? { ...prevPiece.placedAt } : null;
          const lifted = this.blockEngine.pickupTangramPieceAt(r, c);
          if (lifted) {
            this.draggingBlockUid = lifted.uid;
            this.selectedBlockUid = lifted.uid;
            this.draggingBlockOriginTangram = prevOrigin;
            this.sim.audio.playClick();
            this.updateLiveCountersOnly();
          }
        }
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
      return;
    }
    this.sudokuHoverCell = null;
    this.sudokuHoverPadDigit = null;

    if (this.mode === 'caro' && this.caroEngine && this.caroEngine.status === 'playing') {
      const cell = this.getCaroIntersectionAt(vx, vy);
      this.caroHoverCell =
        cell && this.caroEngine.grid[cell.r]?.[cell.c] === 0 ? cell : null;
      return;
    }
    this.caroHoverCell = null;
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

    if (this.mode === 'blocks' && this.blockEngine && this.draggingBlockUid !== null) {
      const uid = this.draggingBlockUid;
      this.draggingBlockUid = null;
      const piece = this.blockEngine.pieces.find((p) => p.uid === uid);
      if (piece && this.hasDragged) {
        const anchor = this.computeBestBlockAnchor(piece, vx, vy);
        if (this.blockEngine.canPlacePiece(uid, anchor.r, anchor.c)) {
          this.commitBlockPlacement(uid, anchor.r, anchor.c);
          return;
        }
        // Dropped outside valid cells: if lifted from Tangram board and dropped back outside tray, leave in tray cleanly!
        this.draggingBlockOriginTangram = null;
        this.updateLiveCountersOnly();
      }
    }
  }

  private computeBestBlockAnchor(
    piece: PolyominoPiece,
    vx: number,
    vy: number
  ): { r: number; c: number } {
    const maxR = Math.max(...piece.cells.map((x) => x[0]));
    const maxC = Math.max(...piece.cells.map((x) => x[1]));
    const centerDr = (maxR + 1) * 0.5;
    const centerDc = (maxC + 1) * 0.5;
    const floatC = (vx - BLK_BOARD_X) / BLK_CELL_PX - centerDc;
    const floatR = (vy - BLK_BOARD_Y) / BLK_CELL_PX - centerDr;
    return {
      r: Math.round(floatR),
      c: Math.round(floatC),
    };
  }

  private commitBlockPlacement(uid: number, anchorR: number, anchorC: number): void {
    if (!this.blockEngine) return;
    const piece = this.blockEngine.pieces.find((p) => p.uid === uid);
    const res = this.blockEngine.placePiece(uid, anchorR, anchorC);
    if (!res.ok) return;

    this.selectedBlockUid = null;
    this.draggingBlockOriginTangram = null;

    if (piece) {
      for (const [dr, dc] of piece.cells) {
        const cx = BLK_BOARD_X + (anchorC + dc + 0.5) * BLK_CELL_PX;
        const cy = BLK_BOARD_Y + (anchorR + dr + 0.5) * BLK_CELL_PX;
        this.spawnBurst(cx, cy, BLOCK_COLOR_PALETTE[piece.color].fillTop, 4);
      }
    }

    if (res.linesBlasted > 0) {
      this.hitStopTimer = 0.035;
      this.drainBlockBlastVfx();
      this.sim.audio.playCrateCrack();
      this.sim.audio.playPowerupBlast();
    } else {
      this.sim.audio.playMatchPop(1);
    }

    if (res.won) {
      this.checkAndClaimVictory();
    } else if (this.blockEngine.status === 'stuck') {
      this.renderDOM();
    } else {
      this.updateLiveCountersOnly();
    }
  }

  private drainBlockBlastVfx(): void {
    if (!this.blockEngine) return;
    while (this.blockEngine.clearedCellsVfx.length > 0) {
      const ev = this.blockEngine.clearedCellsVfx.shift()!;
      const cx = BLK_BOARD_X + (ev.c + 0.5) * BLK_CELL_PX;
      const cy = BLK_BOARD_Y + (ev.r + 0.5) * BLK_CELL_PX;
      this.spawnBurst(cx, cy, BLOCK_COLOR_PALETTE[ev.color].fillTop, 7);
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
      if (this.mode === 'caro' && this.caroWinRevealTimer > 0) {
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

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(targetW / PA_VIRTUAL_W, targetH / PA_VIRTUAL_H);

    if (this.mode === 'chess' && this.chessShakeTimer > 0) {
      const now = performance.now();
      const decay = Math.min(1, this.chessShakeTimer / 0.18);
      const amp = this.chessShakeAmp * decay;
      ctx.translate(Math.sin(now * 0.095) * amp, Math.cos(now * 0.125) * amp * 0.72);
    }

    if (this.mode === 'chess') {
      this.drawGreatHallChessBackdrop(ctx);
    } else if (this.mode === 'sudoku') {
      this.drawPotionsSudokuBackdrop(ctx);
    } else if (this.mode === 'caro') {
      this.drawMarauderCaroBackdrop(ctx);
    } else {
      this.drawParlorTabletopBackdrop(ctx);
    }

    if (this.mode === 'sudoku' && this.sudokuEngine) {
      this.drawSudokuScene(ctx, this.sudokuEngine);
    } else if (this.mode === 'caro' && this.caroEngine) {
      this.drawCaroScene(ctx, this.caroEngine);
    } else if (this.mode === 'chess' && this.chessEngine) {
      this.drawWizardChessScene(ctx, this.chessEngine);
      this.drawChessSpellBeams(ctx);
    } else if (this.mode === 'blocks' && this.blockEngine) {
      this.drawBlocksScene(ctx, this.blockEngine);
    }

    this.drawParticles(ctx);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER: RUNIC BLOCK PUZZLE & TANGRAM BLUEPRINTS
  // --------------------------------------------------------------------------

  private drawBlocksScene(ctx: CanvasRenderingContext2D, engine: RunicBlockPuzzleEngine): void {
    // 1. Outer Board Frame
    ctx.save();
    drawRoundedRect(
      ctx,
      BLK_BOARD_X - 10,
      BLK_BOARD_Y - 10,
      BLK_BOARD_PX + 20,
      BLK_BOARD_PX + 20,
      16
    );
    const boardFrame = ctx.createLinearGradient(0, BLK_BOARD_Y - 10, 0, BLK_BOARD_Y + BLK_BOARD_PX + 10);
    boardFrame.addColorStop(0, '#b45309');
    boardFrame.addColorStop(0.5, '#78350f');
    boardFrame.addColorStop(1, '#451a03');
    ctx.fillStyle = boardFrame;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();
    ctx.restore();

    // Compute live ghost preview if dragging or hovering with selected piece
    let ghostPiece: PolyominoPiece | undefined;
    let ghostAnchor: { r: number; c: number } | null = null;
    let ghostValid = false;
    const previewUid = this.draggingBlockUid ?? this.selectedBlockUid;
    if (previewUid !== null) {
      const cand = engine.pieces.find((p) => p.uid === previewUid && !p.used && !p.placedAt);
      if (
        cand &&
        this.pointerCurrPos.vx >= BLK_BOARD_X - 24 &&
        this.pointerCurrPos.vx <= BLK_BOARD_X + BLK_BOARD_PX + 24 &&
        this.pointerCurrPos.vy >= BLK_BOARD_Y - 24 &&
        this.pointerCurrPos.vy <= BLK_BOARD_Y + BLK_BOARD_PX + 24
      ) {
        ghostPiece = cand;
        ghostAnchor = this.computeBestBlockAnchor(
          cand,
          this.pointerCurrPos.vx,
          this.pointerCurrPos.vy
        );
        ghostValid = engine.canPlaceCellsAt(cand.cells, ghostAnchor.r, ghostAnchor.c);
      }
    }

    // Predict full lines in Blast mode when ghostValid is true
    const predictedRows = new Set<number>();
    const predictedCols = new Set<number>();
    if (engine.subMode === 'blast' && ghostValid && ghostPiece && ghostAnchor) {
      const occupiedGhost = new Set(
        ghostPiece.cells.map(([dr, dc]) => `${ghostAnchor!.r + dr},${ghostAnchor!.c + dc}`)
      );
      for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
        let full = true;
        for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
          if (engine.grid[r][c] === null && !occupiedGhost.has(`${r},${c}`)) {
            full = false;
            break;
          }
        }
        if (full) predictedRows.add(r);
      }
      for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
        let full = true;
        for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
          if (engine.grid[r][c] === null && !occupiedGhost.has(`${r},${c}`)) {
            full = false;
            break;
          }
        }
        if (full) predictedCols.add(c);
      }
    }

    // 2. Draw 8x8 Grid Cells
    for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
      for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
        const cx = BLK_BOARD_X + c * BLK_CELL_PX;
        const cy = BLK_BOARD_Y + r * BLK_CELL_PX;
        const insideMold = engine.moldMask[r][c];
        const cellCol = engine.grid[r][c];

        if (!insideMold) {
          // Recessed warm carved walnut outside Tangram mold
          ctx.fillStyle = '#381b0c';
          ctx.fillRect(cx, cy, BLK_CELL_PX, BLK_CELL_PX);
          ctx.strokeStyle = 'rgba(212, 150, 59, 0.22)';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx + 0.5, cy + 0.5, BLK_CELL_PX - 1, BLK_CELL_PX - 1);
          continue;
        }

        // Active cell cushion
        drawRoundedRect(ctx, cx + 1.5, cy + 1.5, BLK_CELL_PX - 3, BLK_CELL_PX - 3, 7);
        if (engine.subMode === 'tangram') {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#fef3c7' : '#fde68a';
          ctx.fill();
          ctx.strokeStyle = 'rgba(180, 83, 9, 0.42)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#4a2511' : '#592e16';
          ctx.fill();
          ctx.strokeStyle = 'rgba(244, 198, 104, 0.22)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (cellCol) {
          const runeLayers = engine.runeLayers?.[r]?.[c] ?? (engine.runeMask[r][c] ? 1 : 0);
          this.drawJewelBlockCell(
            ctx,
            cx,
            cy,
            BLK_CELL_PX,
            cellCol,
            runeLayers,
            predictedRows.has(r) || predictedCols.has(c)
          );
        }
      }
    }

    // 3. Draw Ghost Placement Preview on Board
    if (ghostPiece && ghostAnchor) {
      ctx.save();
      for (const [dr, dc] of ghostPiece.cells) {
        const gr = ghostAnchor.r + dr;
        const gc = ghostAnchor.c + dc;
        if (gr < 0 || gr >= BLOCK_BOARD_SIZE || gc < 0 || gc >= BLOCK_BOARD_SIZE) continue;
        const gx = BLK_BOARD_X + gc * BLK_CELL_PX;
        const gy = BLK_BOARD_Y + gr * BLK_CELL_PX;
        drawRoundedRect(ctx, gx + 2, gy + 2, BLK_CELL_PX - 4, BLK_CELL_PX - 4, 8);
        ctx.fillStyle = ghostValid ? 'rgba(74, 222, 128, 0.42)' : 'rgba(248, 113, 113, 0.42)';
        ctx.fill();
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = ghostValid ? '#4ade80' : '#f87171';
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Right-hand Polyomino Dock
    ctx.save();
    drawRoundedRect(ctx, BLK_TRAY_X, BLK_TRAY_Y, BLK_TRAY_W, BLK_TRAY_H, 14);
    ctx.fillStyle = 'rgba(58, 29, 12, 0.84)';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#f4c668';
    ctx.stroke();
    ctx.restore();

    this.traySlotBounds.clear();
    const trayPieces = engine.pieces.filter(
      (p) => !p.used && !p.placedAt && p.uid !== this.draggingBlockUid
    );

    const cols = engine.subMode === 'tangram' ? 2 : 1;
    const rows = Math.max(1, Math.ceil(engine.pieces.length / cols));
    const slotW = (BLK_TRAY_W - 16) / cols;
    const slotH = (BLK_TRAY_H - 20) / Math.min(rows, engine.subMode === 'tangram' ? 3 : 3);

    engine.pieces.forEach((p, idx) => {
      if (p.used || p.placedAt || p.uid === this.draggingBlockUid) return;
      const tc = idx % cols;
      const tr = Math.floor(idx / cols);
      const actualSlotH = (BLK_TRAY_H - 20) / Math.max(1, Math.ceil(engine.pieces.length / cols));
      const sx = BLK_TRAY_X + 8 + tc * slotW;
      const sy = BLK_TRAY_Y + 10 + tr * actualSlotH;
      this.traySlotBounds.set(p.uid, { x: sx, y: sy, w: slotW, h: actualSlotH });

      const isSel = p.uid === this.selectedBlockUid;
      if (isSel) {
        drawRoundedRect(ctx, sx + 2, sy + 2, slotW - 4, actualSlotH - 4, 10);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.16)';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const maxR = Math.max(...p.cells.map((x) => x[0])) + 1;
      const maxC = Math.max(...p.cells.map((x) => x[1])) + 1;
      const miniCell = Math.min(
        30,
        (slotW - 18) / Math.max(1, maxC),
        (actualSlotH - 16) / Math.max(1, maxR)
      );
      const ox = sx + (slotW - maxC * miniCell) * 0.5;
      const oy = sy + (actualSlotH - maxR * miniCell) * 0.5;

      for (const [dr, dc] of p.cells) {
        this.drawJewelBlockCell(
          ctx,
          ox + dc * miniCell,
          oy + dr * miniCell,
          miniCell,
          p.color,
          false,
          false
        );
      }
    });
    void trayPieces;
    void slotH;

    // 5. Floating Dragged Polyomino under pointer
    if (this.draggingBlockUid !== null) {
      const dragP = engine.pieces.find((p) => p.uid === this.draggingBlockUid);
      if (dragP) {
        const maxR = Math.max(...dragP.cells.map((x) => x[0])) + 1;
        const maxC = Math.max(...dragP.cells.map((x) => x[1])) + 1;
        const ox = this.pointerCurrPos.vx - maxC * BLK_CELL_PX * 0.5;
        const oy = this.pointerCurrPos.vy - maxR * BLK_CELL_PX * 0.5;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;
        for (const [dr, dc] of dragP.cells) {
          this.drawJewelBlockCell(
            ctx,
            ox + dc * BLK_CELL_PX,
            oy + dr * BLK_CELL_PX,
            BLK_CELL_PX,
            dragP.color,
            false,
            false
          );
        }
        ctx.restore();
      }
    }
  }

  private drawJewelBlockCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: BlockColorKey,
    hasRuneSeal: boolean | number,
    willBlastGlow: boolean
  ): void {
    const runeLayers =
      typeof hasRuneSeal === 'number' ? hasRuneSeal : hasRuneSeal ? 1 : 0;
    const pal = BLOCK_COLOR_PALETTE[color];
    const pad = Math.max(1.2, size * 0.04);
    const bx = x + pad;
    const by = y + pad;
    const bw = size - pad * 2;
    const bh = size - pad * 2;
    const rad = Math.max(4, size * 0.16);

    ctx.save();
    // 3D bottom lip
    drawRoundedRect(ctx, bx, by + 2, bw, bh - 1, rad);
    ctx.fillStyle = pal.lip;
    ctx.fill();

    // Main bevel body
    drawRoundedRect(ctx, bx, by, bw, bh - Math.max(2, size * 0.08), rad);
    const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
    grad.addColorStop(0, pal.fillTop);
    grad.addColorStop(1, pal.fillBot);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.lineWidth = Math.max(1, size * 0.04);
    ctx.strokeStyle = willBlastGlow ? '#fef08a' : runeLayers >= 2 ? '#e879f9' : pal.rim;
    ctx.stroke();

    // Glossy inner specular shine
    drawRoundedRect(ctx, bx + bw * 0.12, by + bh * 0.09, bw * 0.76, bh * 0.26, rad * 0.6);
    ctx.fillStyle = 'rgba(255,255,255,0.34)';
    ctx.fill();

    // Embedded 3D crystal sprite
    const spr = this.getSpriteImage(pal.spriteKey);
    if (spr && size >= 24) {
      const iconSz = size * 0.58;
      ctx.drawImage(spr, x + (size - iconSz) * 0.5, y + (size - iconSz) * 0.46, iconSz, iconSz);
    }

    if (runeLayers >= 2) {
      // 2-Layer Obsidian Rune Seal (Đá Phong Ấn Hắc Diện ×2 — Stage >= 140)
      drawRoundedRect(ctx, bx + 2, by + 2, bw - 4, bh - 4, Math.max(3, rad - 2));
      ctx.fillStyle = 'rgba(46, 16, 101, 0.36)';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.34, 0, Math.PI * 2);
      ctx.stroke();

      if (size >= 34) {
        drawRoundedRect(ctx, x + size - 18, y + size - 15.5, 16, 13.5, 4);
        ctx.fillStyle = '#3b0764';
        ctx.fill();
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = '#fde047';
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = '900 9.5px "Be Vietnam Pro", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×2', x + size - 10, y + size - 8.2);
      }
    } else if (runeLayers === 1) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.34, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (willBlastGlow) {
      drawRoundedRect(ctx, bx, by, bw, bh, rad);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.36)';
      ctx.fill();
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

  private drawParlorTabletopBackdrop(ctx: CanvasRenderingContext2D): void {
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
        PA_VIRTUAL_W,
        PA_VIRTUAL_H
      );
      // Warm sunlit honey-oak glaze so boards & cream parchment cards pop cleanly
      const glaze = ctx.createLinearGradient(0, 0, 0, PA_VIRTUAL_H);
      glaze.addColorStop(0, 'rgba(92, 46, 18, 0.24)');
      glaze.addColorStop(0.5, 'rgba(72, 34, 12, 0.16)');
      glaze.addColorStop(1, 'rgba(54, 25, 9, 0.34)');
      ctx.fillStyle = glaze;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    } else {
      const woodBg = ctx.createLinearGradient(0, 0, 0, PA_VIRTUAL_H);
      woodBg.addColorStop(0, '#c88344');
      woodBg.addColorStop(0.5, '#a86432');
      woodBg.addColorStop(1, '#7c431d');
      ctx.fillStyle = woodBg;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    }

    // Subtle inlaid brass tabletop border & corner studs
    drawRoundedRect(ctx, 6, 6, PA_VIRTUAL_W - 12, PA_VIRTUAL_H - 12, 14);
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

  private drawParchmentSidePanel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ribbonTitle: string
  ): void {
    ctx.save();
    // 1. Warm honey-oak outer frame with 3D drop shadow
    drawRoundedRect(ctx, x, y, w, h, 18);
    const woodGrad = ctx.createLinearGradient(0, y, 0, y + h);
    woodGrad.addColorStop(0, '#8d4c25');
    woodGrad.addColorStop(0.5, '#6e391c');
    woodGrad.addColorStop(1, '#4a240d');
    ctx.fillStyle = woodGrad;
    ctx.shadowColor = 'rgba(28, 12, 3, 0.52)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#f4c668';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // 2. Cream-vellum Playrix Township parchment sheet inset
    drawRoundedRect(ctx, x + 6, y + 6, w - 12, h - 12, 13);
    const sheetGrad = ctx.createLinearGradient(0, y + 6, 0, y + h - 6);
    sheetGrad.addColorStop(0, '#fffdf5');
    sheetGrad.addColorStop(0.65, '#faeccd');
    sheetGrad.addColorStop(1, '#eed6a6');
    ctx.fillStyle = sheetGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#cfa66b';
    ctx.stroke();

    this.drawBrassCornerBrackets(ctx, x + 2, y + 2, w - 4, h - 4, 13);

    // 3. Hogwarts Crimson & Gold header ribbon
    const rx = x + 14;
    const ry = y + 12;
    const rw = w - 28;
    const rh = 25;
    drawRoundedRect(ctx, rx, ry + 2, rw, rh, 12);
    ctx.fillStyle = '#5c1111';
    ctx.fill();
    drawRoundedRect(ctx, rx, ry, rw, rh, 12);
    const ribGrad = ctx.createLinearGradient(0, ry, 0, ry + rh);
    ribGrad.addColorStop(0, '#dc2626');
    ribGrad.addColorStop(0.55, '#991b1b');
    ribGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = ribGrad;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#fde68a';
    ctx.stroke();

    ctx.fillStyle = '#fffbeb';
    ctx.font = '900 12px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ribbonTitle, x + w * 0.5, ry + rh * 0.52, rw - 14);
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
  // RENDERER 4: PHÒNG ĐỘC DƯỢC & CỔ NGỮ HOGWARTS — SÁCH PHÉP DA RỒNG SUDOKU 9x9
  // --------------------------------------------------------------------------

  private drawPotionsSudokuBackdrop(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const bg = this.potionsSudokuBgImage;
    if (bg && bg.complete && bg.naturalWidth > 0) {
      const sw = bg.naturalWidth;
      const sh = bg.naturalHeight;
      ctx.drawImage(
        bg,
        sw * 0.02,
        sh * 0.04,
        sw * 0.96,
        sh * 0.92,
        0,
        0,
        PA_VIRTUAL_W,
        PA_VIRTUAL_H
      );
      const glaze = ctx.createLinearGradient(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
      glaze.addColorStop(0, 'rgba(10, 28, 24, 0.34)');
      glaze.addColorStop(0.5, 'rgba(28, 18, 12, 0.22)');
      glaze.addColorStop(1, 'rgba(16, 24, 34, 0.38)');
      ctx.fillStyle = glaze;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    } else {
      const dungeonGrad = ctx.createLinearGradient(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
      dungeonGrad.addColorStop(0, '#0f2922');
      dungeonGrad.addColorStop(0.5, '#2b1810');
      dungeonGrad.addColorStop(1, '#111827');
      ctx.fillStyle = dungeonGrad;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    }

    // Animated floating Felix Felicis golden rune motes & emerald potion bubbles along outer rim
    const now = performance.now() * 0.001;
    const alchMotes: ReadonlyArray<[number, number, string, number]> = [
      [8, 68, '#fde047', 0.0],
      [9, 224, '#34d399', 1.1],
      [8, 392, '#38bdf8', 2.3],
      [SUDOKU_PAD_X - 7, 16, '#fde047', 0.7],
      [SUDOKU_PAD_X - 7, PA_VIRTUAL_H - 16, '#34d399', 1.8],
      [PA_VIRTUAL_W - 8, 92, '#fde047', 2.6],
      [PA_VIRTUAL_W - 9, 256, '#34d399', 0.4],
      [PA_VIRTUAL_W - 8, 418, '#f59e0b', 1.5],
    ];
    for (const [mx, my, col, phase] of alchMotes) {
      const fy = my + Math.sin(now * 2.1 + phase) * 4.5;
      const glow = ctx.createRadialGradient(mx, fy, 1, mx, fy, 10);
      glow.addColorStop(0, col);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mx, fy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fffbeb';
      this.drawFourPointStar(ctx, mx, fy, 3.2, 1.1);
      ctx.fill();
    }

    drawRoundedRect(ctx, 5, 5, PA_VIRTUAL_W - 10, PA_VIRTUAL_H - 10, 14);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.36)';
    ctx.stroke();
    ctx.restore();
  }

  private drawSudokuScene(ctx: CanvasRenderingContext2D, engine: SudokuPuzzleEngine): void {
    ctx.save();

    // 1. Open Dragon-Hide Grimoire Binding spanning both Left 9x9 Page & Right Relic Page!
    const bookX = SUDOKU_BOARD_X - 10;
    const bookY = SUDOKU_BOARD_Y - 10;
    const bookW = SUDOKU_PAD_X + SUDOKU_PAD_W - SUDOKU_BOARD_X + 20;
    const bookH = SUDOKU_BOARD_PX + 20;

    // Crimson & Slytherin-Emerald silk bookmark ribbons peeking below the open Grimoire
    for (const [rx, col] of [
      [SUDOKU_BOARD_X + 34, '#b91c1c'],
      [SUDOKU_BOARD_X + 62, '#047857'],
    ] as const) {
      ctx.beginPath();
      ctx.moveTo(rx, bookY + bookH - 4);
      ctx.lineTo(rx + 18, bookY + bookH - 4);
      ctx.lineTo(rx + 16, bookY + bookH + 9);
      ctx.lineTo(rx + 9, bookY + bookH + 4);
      ctx.lineTo(rx, bookY + bookH + 9);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.fill();
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = '#fde68a';
      ctx.stroke();
    }

    // Embossed Emerald-Obsidian & Mahogany Dragon-Hide Outer Cover
    drawRoundedRect(ctx, bookX, bookY, bookW, bookH, 18);
    const coverGrad = ctx.createLinearGradient(bookX, bookY, bookX + bookW, bookY + bookH);
    coverGrad.addColorStop(0, '#1e3a2f');
    coverGrad.addColorStop(0.32, '#2d1c12');
    coverGrad.addColorStop(0.5, '#1b110b');
    coverGrad.addColorStop(0.68, '#2d1c12');
    coverGrad.addColorStop(1, '#1e3a2f');
    ctx.fillStyle = coverGrad;
    ctx.shadowColor = 'rgba(8, 5, 3, 0.68)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#f4c668';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Gold stitched dragon-leather seam + 4 ornate brass Grimoire corner clasps
    drawRoundedRect(ctx, bookX + 5, bookY + 5, bookW - 10, bookH - 10, 14);
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.45)';
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawBrassCornerBrackets(ctx, bookX + 2, bookY + 2, bookW - 4, bookH - 4, 17);

    // Central Stitched Grimoire Spine & Brass Rib Clasps between Left & Right Pages
    const spineX = SUDOKU_BOARD_X + SUDOKU_BOARD_PX + 2;
    const spineW = SUDOKU_PAD_X - spineX - 2;
    const spineGrad = ctx.createLinearGradient(spineX, 0, spineX + spineW, 0);
    spineGrad.addColorStop(0, '#1c1008');
    spineGrad.addColorStop(0.5, '#4a2c16');
    spineGrad.addColorStop(1, '#1c1008');
    ctx.fillStyle = spineGrad;
    ctx.fillRect(spineX, bookY + 4, spineW, bookH - 8);
    for (const ry of [bookY + 56, bookY + bookH * 0.5, bookY + bookH - 56]) {
      drawRoundedRect(ctx, spineX - 2, ry - 5, spineW + 4, 10, 4);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();
    }
    ctx.restore();

    const sel = engine.selected;
    const selVal = sel ? engine.grid[sel.r]?.[sel.c] ?? 0 : 0;
    const hoverBoardVal =
      this.sudokuHoverCell ? engine.grid[this.sudokuHoverCell.r]?.[this.sudokuHoverCell.c] ?? 0 : 0;
    const spotlightDigit =
      this.sudokuHoverPadDigit ?? (hoverBoardVal > 0 ? hoverBoardVal : selVal > 0 ? selVal : 1);

    // 2. Left Grimoire Page: 9x9 Enchanted Parchment Cells + 9 Harry Potter Relics
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cx = SUDOKU_BOARD_X + c * SUDOKU_CELL_PX;
        const cy = SUDOKU_BOARD_Y + r * SUDOKU_CELL_PX;
        const boxParity = (Math.floor(r / 3) + Math.floor(c / 3)) % 2;
        const val = engine.grid[r][c];
        const isSel = Boolean(sel && sel.r === r && sel.c === c);
        const isHover = Boolean(
          this.sudokuHoverCell && this.sudokuHoverCell.r === r && this.sudokuHoverCell.c === c
        );
        const onMainDiag = r === c;
        const onAntiDiag = r + c === 8;
        const isDiagCell = engine.diagonalRule && (onMainDiag || onAntiDiag);
        const isPeer = Boolean(
          sel &&
            !isSel &&
            (sel.r === r ||
              sel.c === c ||
              (Math.floor(sel.r / 3) === Math.floor(r / 3) &&
                Math.floor(sel.c / 3) === Math.floor(c / 3)) ||
              (engine.diagonalRule &&
                ((sel.r === sel.c && onMainDiag) || (sel.r + sel.c === 8 && onAntiDiag))))
        );
        const isSameVal = selVal > 0 && val === selVal && !isSel;
        const conflict = engine.hasConflict(r, c) || engine.isWrongCell(r, c);

        if (conflict) {
          ctx.fillStyle = '#ffe4e6';
        } else if (isSel) {
          const lumos = ctx.createRadialGradient(
            cx + SUDOKU_CELL_PX * 0.5,
            cy + SUDOKU_CELL_PX * 0.5,
            3,
            cx + SUDOKU_CELL_PX * 0.5,
            cy + SUDOKU_CELL_PX * 0.5,
            SUDOKU_CELL_PX * 0.75
          );
          lumos.addColorStop(0, '#fffbeb');
          lumos.addColorStop(0.55, '#fde047');
          lumos.addColorStop(1, '#f59e0b');
          ctx.fillStyle = lumos;
        } else if (isSameVal) {
          ctx.fillStyle = '#fde28a';
        } else if (isHover) {
          ctx.fillStyle = '#fef08a';
        } else if (isPeer) {
          ctx.fillStyle = boxParity === 0 ? '#fef3c7' : '#f6e1a4';
        } else {
          ctx.fillStyle = boxParity === 0 ? '#fffdf6' : '#f4e3bc';
        }
        ctx.fillRect(cx, cy, SUDOKU_CELL_PX, SUDOKU_CELL_PX);

        // Sudoku-X Diagonal Gold Wash & Hairline (underneath relics & digits!)
        if (isDiagCell) {
          ctx.save();
          if (!conflict && !isSel) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
            ctx.fillRect(cx, cy, SUDOKU_CELL_PX, SUDOKU_CELL_PX);
          }
          ctx.strokeStyle = 'rgba(180, 83, 9, 0.30)';
          ctx.lineWidth = 1.25;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          if (onMainDiag) {
            ctx.moveTo(cx + 2, cy + 2);
            ctx.lineTo(cx + SUDOKU_CELL_PX - 2, cy + SUDOKU_CELL_PX - 2);
          }
          if (onAntiDiag) {
            ctx.moveTo(cx + SUDOKU_CELL_PX - 2, cy + 2);
            ctx.lineTo(cx + 2, cy + SUDOKU_CELL_PX - 2);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Odd/Even Parity Rune Watermark (1 = Odd ◇, 2 = Even ◯ — top-left corner + subtle inset)
        const pMask = engine.parityMask?.[r]?.[c] ?? 0;
        if (pMask === 1 || pMask === 2) {
          ctx.save();
          const mx = cx + SUDOKU_CELL_PX * 0.5;
          const my = cy + SUDOKU_CELL_PX * 0.5;
          if (pMask === 1) {
            // Odd (1,3,5,7,9): Warm Amber Diamond ◇
            const dr = SUDOKU_CELL_PX * 0.39;
            ctx.beginPath();
            ctx.moveTo(mx, my - dr);
            ctx.lineTo(mx + dr, my);
            ctx.lineTo(mx, my + dr);
            ctx.lineTo(mx - dr, my);
            ctx.closePath();
            ctx.fillStyle = 'rgba(217, 119, 6, 0.09)';
            ctx.fill();
            ctx.lineWidth = 1.25;
            ctx.strokeStyle = 'rgba(180, 83, 9, 0.34)';
            ctx.stroke();

            ctx.fillStyle = 'rgba(146, 64, 14, 0.78)';
            ctx.font = '900 9px "Be Vietnam Pro", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('◇', cx + 3.5, cy + 2.5);
          } else {
            // Even (2,4,6,8): Cool Arcane Teal Circle ◯
            ctx.beginPath();
            ctx.arc(mx, my, SUDOKU_CELL_PX * 0.36, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.09)';
            ctx.fill();
            ctx.lineWidth = 1.25;
            ctx.strokeStyle = 'rgba(3, 105, 161, 0.34)';
            ctx.stroke();

            ctx.fillStyle = 'rgba(3, 105, 161, 0.80)';
            ctx.font = '900 8.5px "Be Vietnam Pro", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('◯', cx + 3.5, cy + 2.5);
          }
          ctx.restore();
        }

        if (val >= 1 && val <= 9) {
          const midCellX = cx + SUDOKU_CELL_PX * 0.5;
          const midCellY = cy + SUDOKU_CELL_PX * 0.5;
          const meta = HP_SUDOKU_RELIC_META[val];
          const relicImg = this.getSudokuRelicImage(val);

          // Subtle enchanted halo ring for given clues or matching relics
          if (engine.given[r][c] || isSameVal) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(midCellX, midCellY, SUDOKU_CELL_PX * 0.39, 0, Math.PI * 2);
            ctx.fillStyle = isSameVal
              ? 'rgba(217, 119, 6, 0.20)'
              : `${meta?.accent ?? '#8a5630'}18`;
            ctx.fill();
            ctx.lineWidth = engine.given[r][c] ? 1.15 : 1;
            ctx.strokeStyle = isSameVal
              ? 'rgba(180, 83, 9, 0.52)'
              : 'rgba(120, 68, 28, 0.22)';
            ctx.stroke();
            ctx.restore();
          }

          if (this.sudokuDisplayMode === 'relic_only' && relicImg) {
            // Pure 2.5D Harry Potter Relic Mode (42x42 centered inside 52x52 cell)
            ctx.save();
            ctx.globalAlpha = conflict ? 0.65 : 1;
            ctx.drawImage(relicImg, cx + 5, cy + 5, 42, 42);
            if (!engine.given[r][c] && !conflict) {
              ctx.fillStyle = '#10b981';
              ctx.beginPath();
              ctx.arc(cx + SUDOKU_CELL_PX - 7, cy + 7, 3.4, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          } else if (this.sudokuDisplayMode === 'relic_num' && relicImg) {
            // Default Hybrid Mode: Large 35x35 2.5D Relic + Crisp Golden Corner Numeral Badge!
            ctx.save();
            ctx.globalAlpha = conflict ? 0.65 : 1;
            ctx.drawImage(relicImg, cx + 4.5, cy + 13, 35, 35);

            // Corner numeral pill at top-right so numbers & icons never overlap
            const badgeX = cx + SUDOKU_CELL_PX - 17.5;
            const badgeY = cy + 2.5;
            drawRoundedRect(ctx, badgeX, badgeY, 15, 15.5, 5);
            ctx.fillStyle = conflict
              ? '#be123c'
              : engine.given[r][c]
                ? 'rgba(69, 26, 3, 0.86)'
                : 'rgba(6, 95, 70, 0.90)';
            ctx.fill();
            ctx.lineWidth = 0.95;
            ctx.strokeStyle = '#fde68a';
            ctx.stroke();

            ctx.fillStyle = conflict ? '#fff1f2' : engine.given[r][c] ? '#fef08a' : '#ecfdf5';
            ctx.font = '900 11.5px "Be Vietnam Pro", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(val), badgeX + 7.5, badgeY + 8.2);
            ctx.restore();
          } else {
            // Number-First Mode ('num_only' or while relic PNG decodes): Large Numeral + Corner Relic Crest
            if (relicImg) {
              ctx.save();
              ctx.globalAlpha = conflict ? 0.45 : 0.85;
              ctx.drawImage(
                relicImg,
                cx + SUDOKU_CELL_PX - 17.5,
                cy + SUDOKU_CELL_PX - 17.5,
                16,
                16
              );
              ctx.restore();
            }
            ctx.save();
            ctx.font = engine.given[r][c]
              ? '900 26px "Playfair Display", Georgia, serif'
              : '800 25px "Be Vietnam Pro", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (!engine.given[r][c] && !conflict) {
              ctx.lineWidth = 2.6;
              ctx.strokeStyle = 'rgba(255, 253, 245, 0.88)';
              ctx.strokeText(String(val), midCellX - 1.5, midCellY + 0.5);
            }
            ctx.fillStyle = conflict
              ? '#be123c'
              : engine.given[r][c]
                ? '#3d1c08'
                : '#065f46';
            ctx.fillText(String(val), midCellX - 1.5, midCellY + 0.5);
            ctx.restore();
          }

          if (conflict) {
            ctx.save();
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 2;
            ctx.strokeRect(cx + 1.5, cy + 1.5, SUDOKU_CELL_PX - 3, SUDOKU_CELL_PX - 3);
            ctx.restore();
          }
        } else {
          // Feather-quill pencil notes (mini relics in relic_only mode, crisp digits otherwise)
          const mask = engine.notes[r][c];
          if (mask !== 0) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            for (let d = 1; d <= 9; d++) {
              if ((mask & (1 << d)) === 0) continue;
              const nr = Math.floor((d - 1) / 3);
              const nc = (d - 1) % 3;
              const nx = cx + (nc + 0.5) * (SUDOKU_CELL_PX / 3);
              const ny = cy + (nr + 0.5) * (SUDOKU_CELL_PX / 3);
              const isMatchNote = selVal === d;
              const miniImg =
                this.sudokuDisplayMode === 'relic_only' ? this.getSudokuRelicImage(d) : null;
              if (miniImg) {
                ctx.globalAlpha = isMatchNote ? 1 : 0.82;
                ctx.drawImage(miniImg, nx - 7, ny - 7, 14, 14);
              } else {
                ctx.font = isMatchNote
                  ? '900 12px "Be Vietnam Pro", system-ui, sans-serif'
                  : '700 11px "Be Vietnam Pro", system-ui, sans-serif';
                ctx.fillStyle = isMatchNote ? '#b45309' : '#6e401d';
                ctx.fillText(String(d), nx, ny);
              }
            }
            ctx.restore();
          }
        }
      }
    }

    // 3. Engraved Ancient Rune Circles inside each 3x3 Palace + Gilded Palace Dividers
    ctx.save();
    const palaceRunes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᛊ'];
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const idx = br * 3 + bc;
        const px = SUDOKU_BOARD_X + (bc * 3 + 1.5) * SUDOKU_CELL_PX;
        const py = SUDOKU_BOARD_Y + (br * 3 + 1.5) * SUDOKU_CELL_PX;
        ctx.beginPath();
        ctx.arc(px, py, 42, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.065)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = 'rgba(120, 53, 15, 0.055)';
        ctx.font = '900 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(palaceRunes[idx], px, py);
      }
    }

    for (let i = 0; i <= 9; i++) {
      const isBold = i % 3 === 0;
      ctx.lineWidth = isBold ? 2.8 : 1;
      ctx.strokeStyle = isBold ? '#451a03' : 'rgba(120, 53, 15, 0.28)';

      const x = SUDOKU_BOARD_X + i * SUDOKU_CELL_PX;
      ctx.beginPath();
      ctx.moveTo(x, SUDOKU_BOARD_Y);
      ctx.lineTo(x, SUDOKU_BOARD_Y + SUDOKU_BOARD_PX);
      ctx.stroke();

      const y = SUDOKU_BOARD_Y + i * SUDOKU_CELL_PX;
      ctx.beginPath();
      ctx.moveTo(SUDOKU_BOARD_X, y);
      ctx.lineTo(SUDOKU_BOARD_X + SUDOKU_BOARD_PX, y);
      ctx.stroke();

      if (isBold && i > 0 && i < 9) {
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.beginPath();
        ctx.moveTo(x, SUDOKU_BOARD_Y + 2);
        ctx.lineTo(x, SUDOKU_BOARD_Y + SUDOKU_BOARD_PX - 2);
        ctx.moveTo(SUDOKU_BOARD_X + 2, y);
        ctx.lineTo(SUDOKU_BOARD_X + SUDOKU_BOARD_PX - 2, y);
        ctx.stroke();
      }
    }

    // Lumos wand-aura frame on selected cell
    if (sel) {
      const sx = SUDOKU_BOARD_X + sel.c * SUDOKU_CELL_PX;
      const sy = SUDOKU_BOARD_Y + sel.r * SUDOKU_CELL_PX;
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = '#b45309';
      ctx.strokeRect(sx + 1.5, sy + 1.5, SUDOKU_CELL_PX - 3, SUDOKU_CELL_PX - 3);
      ctx.fillStyle = '#fffbeb';
      this.drawFourPointStar(ctx, sx + 5, sy + 5, 4.2, 1.4);
      ctx.fill();
      this.drawFourPointStar(ctx, sx + SUDOKU_CELL_PX - 5, sy + SUDOKU_CELL_PX - 5, 4.2, 1.4);
      ctx.fill();
    }
    ctx.restore();

    // 4. Right Grimoire Page: Relic Lore Spotlight + 3x3 Sculpted HP Relic Pad + Erase Seal
    this.drawParchmentSidePanel(
      ctx,
      SUDOKU_PAD_X,
      SUDOKU_PAD_Y,
      SUDOKU_PAD_W,
      SUDOKU_PAD_H,
      '🔮 9 BẢO BỐI HOGWARTS'
    );

    ctx.save();
    // Relic Lore Spotlight Card (shows hovered/selected Harry Potter Relic!)
    const spX = SUDOKU_PAD_X + 10;
    const spY = SUDOKU_PAD_Y + 42;
    const spW = SUDOKU_PAD_W - 20;
    const spH = 52;
    const spotMeta = HP_SUDOKU_RELIC_META[spotlightDigit] ?? HP_SUDOKU_RELIC_META[1];
    const spotImg = this.getSudokuRelicImage(spotlightDigit);

    drawRoundedRect(ctx, spX, spY, spW, spH, 11);
    ctx.fillStyle = engine.pencilMode ? '#ecfdf5' : '#fffaf0';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = engine.pencilMode ? '#059669' : '#cfa66b';
    ctx.stroke();

    if (spotImg) {
      ctx.drawImage(spotImg, spX + 5, spY + 8, 36, 36);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#451a03';
    ctx.font = '900 10.6px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(`${spotlightDigit} • ${spotMeta.nameVi}`, spX + 44, spY + 18, spW - 50);

    ctx.fillStyle = engine.pencilMode ? '#065f46' : '#7c4a21';
    ctx.font = '700 9.1px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(
      engine.pencilMode
        ? '🪶 Đang bật Mực Ghi Nháp (Phím N)'
        : `${spotMeta.loreVi}`,
      spX + 44,
      spY + 36,
      spW - 50
    );

    // 3x3 Harry Potter Relic Pad (1..9)
    this.sudokuPadRects.clear();
    const rem = engine.getRemainingDigitCounts();
    const btnW = 50;
    const btnH = 88;
    const gapX = 5;
    const gapY = 8;
    const startX = SUDOKU_PAD_X + (SUDOKU_PAD_W - (btnW * 3 + gapX * 2)) * 0.5;
    const startY = SUDOKU_PAD_Y + 104;

    for (let d = 1; d <= 9; d++) {
      const pr = Math.floor((d - 1) / 3);
      const pc = (d - 1) % 3;
      const bx = startX + pc * (btnW + gapX);
      const by = startY + pr * (btnH + gapY);
      this.sudokuPadRects.set(d, { x: bx, y: by, w: btnW, h: btnH });

      const done = rem[d] === 0;
      const activeDigit = selVal === d || this.sudokuHoverPadDigit === d;
      const rMeta = HP_SUDOKU_RELIC_META[d];

      drawRoundedRect(ctx, bx, by + 3, btnW, btnH - 2, 12);
      ctx.fillStyle = done ? '#64748b' : activeDigit ? '#7c2d12' : '#6e391c';
      ctx.fill();

      drawRoundedRect(ctx, bx, by, btnW, btnH - 3, 12);
      const bGrad = ctx.createLinearGradient(0, by, 0, by + btnH - 3);
      if (done) {
        bGrad.addColorStop(0, '#ecfdf5');
        bGrad.addColorStop(1, '#d1fae5');
      } else if (activeDigit) {
        bGrad.addColorStop(0, '#fde047');
        bGrad.addColorStop(0.55, '#f59e0b');
        bGrad.addColorStop(1, '#d97706');
      } else {
        bGrad.addColorStop(0, '#fffdf6');
        bGrad.addColorStop(0.6, '#faeccb');
        bGrad.addColorStop(1, '#e8ca8c');
      }
      ctx.fillStyle = bGrad;
      ctx.fill();
      ctx.lineWidth = activeDigit ? 2.2 : 1.5;
      ctx.strokeStyle = done ? '#10b981' : activeDigit ? '#78350f' : '#9d6f3a';
      ctx.stroke();

      const relicImg = this.getSudokuRelicImage(d);
      if (relicImg) {
        ctx.save();
        ctx.globalAlpha = done ? 0.48 : 1;
        ctx.drawImage(relicImg, bx + 3, by + 9, 31, 31);
        ctx.restore();
      }

      ctx.fillStyle = done ? '#047857' : activeDigit ? '#3b1706' : '#4a240d';
      ctx.font = '900 18px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(d), bx + (relicImg ? btnW * 0.77 : btnW * 0.5), by + 24);

      // Short relic name & remaining count pill
      drawRoundedRect(ctx, bx + 3, by + 54, btnW - 6, 22, 7);
      ctx.fillStyle = done
        ? 'rgba(16, 185, 129, 0.2)'
        : activeDigit
          ? 'rgba(69, 26, 3, 0.24)'
          : 'rgba(120, 53, 15, 0.11)';
      ctx.fill();

      ctx.fillStyle = done ? '#047857' : activeDigit ? '#fffbeb' : '#633416';
      ctx.font = '800 8.5px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText(
        done ? `✓ ${rMeta.shortVi}` : `${rMeta.shortVi} (${rem[d]})`,
        bx + btnW * 0.5,
        by + 65.5,
        btnW - 8
      );
    }

    // Howler Wax-Seal Erase Button + Mistake Counter
    const ex = startX;
    const ey = startY + 3 * (btnH + gapY) + 4;
    const ew = btnW * 3 + gapX * 2;
    const eh = 42;
    this.sudokuEraseRect = { x: ex, y: ey, w: ew, h: eh };
    drawRoundedRect(ctx, ex, ey + 2.5, ew, eh - 2, 10);
    ctx.fillStyle = '#4c0519';
    ctx.fill();
    drawRoundedRect(ctx, ex, ey, ew, eh - 2.5, 10);
    const eraseGrad = ctx.createLinearGradient(0, ey, 0, ey + eh);
    eraseGrad.addColorStop(0, '#e11d48');
    eraseGrad.addColorStop(1, '#9f1239');
    ctx.fillStyle = eraseGrad;
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#fde68a';
    ctx.stroke();

    ctx.fillStyle = '#fffbeb';
    ctx.font = '800 11px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `🧹 Xoá Ô (Del) • Sai: ${engine.mistakesCount}/${engine.maxMistakes}`,
      ex + ew * 0.5,
      ey + (eh - 2) * 0.52,
      ew - 12
    );
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 5: PHÒNG SINH HOẠT CHUNG & BẢN ĐỒ ĐẠO TẶC — CỜ CARO 13x13
  // --------------------------------------------------------------------------

  private drawMarauderCaroBackdrop(ctx: CanvasRenderingContext2D): void {
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
        PA_VIRTUAL_W,
        PA_VIRTUAL_H
      );
      const scrim = ctx.createLinearGradient(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
      scrim.addColorStop(0, 'rgba(54, 14, 12, 0.24)');
      scrim.addColorStop(0.5, 'rgba(38, 16, 10, 0.16)');
      scrim.addColorStop(1, 'rgba(28, 12, 8, 0.32)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    } else {
      const warmGrad = ctx.createLinearGradient(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
      warmGrad.addColorStop(0, '#5c1916');
      warmGrad.addColorStop(0.5, '#451a0e');
      warmGrad.addColorStop(1, '#291008');
      ctx.fillStyle = warmGrad;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    }

    // Animated Gryffindor hearth firelight pulse & rising golden embers on left rim
    const now = performance.now() * 0.001;
    const flicker = 0.85 + 0.15 * Math.sin(now * 5.2);
    const hearth = ctx.createRadialGradient(8, 280, 10, 20, 280, 185);
    hearth.addColorStop(0, `rgba(254, 240, 138, ${(0.28 * flicker).toFixed(3)})`);
    hearth.addColorStop(0.5, `rgba(249, 115, 22, ${(0.14 * flicker).toFixed(3)})`);
    hearth.addColorStop(1, 'rgba(185, 28, 28, 0)');
    ctx.fillStyle = hearth;
    ctx.fillRect(0, 0, 220, PA_VIRTUAL_H);

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

    drawRoundedRect(ctx, 5, 5, PA_VIRTUAL_W - 10, PA_VIRTUAL_H - 10, 14);
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

    // 6. Right-hand Order of the Phoenix vs Death Eater Duel Scroll Panel
    this.drawParchmentSidePanel(
      ctx,
      CARO_SIDE_X,
      CARO_SIDE_Y,
      CARO_SIDE_W,
      CARO_SIDE_H,
      '🔥 HỘI PHƯỢNG HOÀNG'
    );

    ctx.save();
    const midX = CARO_SIDE_X + CARO_SIDE_W * 0.5;
    this.drawCharacterPortraitMedallion(
      ctx,
      midX,
      CARO_SIDE_Y + 80,
      31,
      engine.opponent.portraitKey,
      engine.opponent.emoji
    );

    ctx.fillStyle = '#3b1508';
    ctx.font = '900 13.5px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(engine.opponent.name, midX, CARO_SIDE_Y + 130, CARO_SIDE_W - 18);

    ctx.fillStyle = '#065f46';
    ctx.font = '700 10px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(engine.opponent.title, midX, CARO_SIDE_Y + 148, CARO_SIDE_W - 18);

    // Rolled Marauder Parchment Dialogue Scroll
    const scX = CARO_SIDE_X + 12;
    const scY = CARO_SIDE_Y + 166;
    const scW = CARO_SIDE_W - 24;
    const scH = 98;
    drawRoundedRect(ctx, scX - 3, scY - 3, scW + 6, 6, 3);
    ctx.fillStyle = '#78350f';
    ctx.fill();
    drawRoundedRect(ctx, scX - 3, scY + scH - 3, scW + 6, 6, 3);
    ctx.fill();

    drawRoundedRect(ctx, scX, scY, scW, scH, 8);
    ctx.fillStyle = '#fffaf0';
    ctx.fill();
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = '#cfa66b';
    ctx.stroke();

    ctx.fillStyle = '#4a240d';
    ctx.font = '600 10.4px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    this.drawWrappedCanvasText(
      ctx,
      `“${engine.opponent.quote}”`,
      scX + 8,
      scY + 18,
      scW - 16,
      15.2,
      5
    );

    // Recessed Medallion Seal Legend (Order of the Phoenix vs Death Eater Dark Mark)
    const lgX = CARO_SIDE_X + 11;
    const lgY = CARO_SIDE_Y + 280;
    const lgW = CARO_SIDE_W - 22;
    drawRoundedRect(ctx, lgX, lgY, lgW, 74, 12);
    ctx.fillStyle = '#ecd4a4';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#b48347';
    ctx.stroke();

    this.drawCaroStone(ctx, lgX + 19, lgY + 21.5, 1, false, 0.78);
    ctx.fillStyle = '#7f1d1d';
    ctx.font = '800 10.2px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Bạn: Ấn Phượng Hoàng', lgX + 36, lgY + 21.5, lgW - 42);

    this.drawCaroStone(ctx, lgX + 19, lgY + 52.5, 2, false, 0.78);
    ctx.fillStyle = '#064e3b';
    ctx.fillText('Địch: Ấn Đầu Lâu Xà', lgX + 36, lgY + 52.5, lgW - 42);

    // Turn / Priori Incantatem Victory Banner
    let bannerTop = '#fde047';
    let bannerBot = '#eab308';
    let bannerBorder = '#92400e';
    let bannerInk = '#3b1706';
    let bannerText = '🔥 Lượt Hội Phượng Hoàng!';
    if (engine.status === 'ai_thinking') {
      bannerTop = '#a7f3d0';
      bannerBot = '#34d399';
      bannerBorder = '#065f46';
      bannerInk = '#022c22';
      bannerText = `🐍 ${engine.opponent.name} đang đặt ấn...`;
    } else if (engine.status === 'won') {
      bannerTop = '#fde047';
      bannerBot = '#f97316';
      bannerBorder = '#991b1b';
      bannerInk = '#450a0a';
      bannerText = '⚡ Priori Incantatem — 5 Ấn Rực Lửa!';
    } else if (engine.status === 'lost') {
      bannerTop = '#fecdd3';
      bannerBot = '#fb7185';
      bannerBorder = '#9f1239';
      bannerInk = '#4c0519';
      bannerText = '🐍 Lộ 5 Ấn Hắc Ám! Xoay Thời Gian!';
    } else if (engine.status === 'draw') {
      bannerTop = '#e2e8f0';
      bannerBot = '#cbd5e1';
      bannerBorder = '#475569';
      bannerInk = '#1e293b';
      bannerText = '🤝 Kín Bản Đồ — Bấm Trải Lại!';
    }

    const bnY = CARO_SIDE_Y + 370;
    drawRoundedRect(ctx, lgX, bnY + 2.5, lgW, 46, 11);
    ctx.fillStyle = bannerBorder;
    ctx.fill();
    drawRoundedRect(ctx, lgX, bnY, lgW, 46, 11);
    const bnGrad = ctx.createLinearGradient(0, bnY, 0, bnY + 46);
    bnGrad.addColorStop(0, bannerTop);
    bnGrad.addColorStop(1, bannerBot);
    ctx.fillStyle = bnGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = bannerBorder;
    ctx.stroke();

    ctx.fillStyle = bannerInk;
    ctx.font = '800 10.6px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bannerText, midX, bnY + 23.5, lgW - 12);

    ctx.fillStyle = '#7a4b26';
    ctx.font = '700 9.6px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(
      engine.runeSealCount > 0
        ? `🔒 ${engine.runeSealCount} Ấn Chì Cổ Ngữ khóa ô trung tâm`
        : 'Nối 5 ấn liên tiếp ngang / dọc / chéo',
      midX,
      CARO_SIDE_Y + 448,
      CARO_SIDE_W - 16
    );
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
    const drawSz = 34 * scale;
    const rad = 15.4 * scale;

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

  private drawGreatHallChessBackdrop(ctx: CanvasRenderingContext2D): void {
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
        PA_VIRTUAL_W,
        PA_VIRTUAL_H
      );
      const scrim = ctx.createLinearGradient(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
      scrim.addColorStop(0, 'rgba(38, 16, 12, 0.34)');
      scrim.addColorStop(0.5, 'rgba(20, 14, 24, 0.24)');
      scrim.addColorStop(1, 'rgba(10, 26, 22, 0.38)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    } else {
      const hallGrad = ctx.createLinearGradient(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
      hallGrad.addColorStop(0, '#3b1518');
      hallGrad.addColorStop(0.5, '#1e1b2e');
      hallGrad.addColorStop(1, '#0f2924');
      ctx.fillStyle = hallGrad;
      ctx.fillRect(0, 0, PA_VIRTUAL_W, PA_VIRTUAL_H);
    }

    // Subtle animated Great Hall floating candles & enchanted ceiling starlight along outer rim
    const now = performance.now() * 0.001;
    const candleAnchors: ReadonlyArray<[number, number, number]> = [
      [8, 64, 0.0],
      [9, 198, 1.3],
      [8, 354, 2.4],
      [CHESS_SIDE_X - 6, 44, 0.8],
      [CHESS_SIDE_X - 6, PA_VIRTUAL_H - 44, 1.9],
      [PA_VIRTUAL_W - 7, 78, 2.7],
      [PA_VIRTUAL_W - 8, 248, 0.5],
      [PA_VIRTUAL_W - 7, 418, 1.6],
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
    drawRoundedRect(ctx, 5, 5, PA_VIRTUAL_W - 10, PA_VIRTUAL_H - 10, 14);
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
      const outerCol = beam.isWhiteCaster ? '#ef4444' : '#10b981';
      const midCol = beam.isWhiteCaster ? '#f59e0b' : '#34d399';
      const coreCol = beam.isWhiteCaster ? '#fef9c3' : '#ecfdf5';

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
      CHESS_BOARD_X - 13,
      CHESS_BOARD_Y - 13,
      CHESS_BOARD_PX + 26,
      CHESS_BOARD_PX + 26,
      16
    );
    const frameGrad = ctx.createLinearGradient(
      0,
      CHESS_BOARD_Y - 13,
      0,
      CHESS_BOARD_Y + CHESS_BOARD_PX + 13
    );
    frameGrad.addColorStop(0, '#16302b'); // Slytherin obsidian-emerald top
    frameGrad.addColorStop(0.48, '#291d18');
    frameGrad.addColorStop(0.52, '#3d1816');
    frameGrad.addColorStop(1, '#4c1118'); // Gryffindor deep burgundy-oak bottom
    ctx.fillStyle = frameGrad;
    ctx.shadowColor = 'rgba(8, 5, 4, 0.72)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#f4c668';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Subtle inlaid house heraldic trim strips (top Slytherin emerald, bottom Gryffindor scarlet)
    ctx.save();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CHESS_BOARD_X + 12, CHESS_BOARD_Y - 10.5);
    ctx.lineTo(CHESS_BOARD_X + CHESS_BOARD_PX - 12, CHESS_BOARD_Y - 10.5);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.58)';
    ctx.beginPath();
    ctx.moveTo(CHESS_BOARD_X + 12, CHESS_BOARD_Y + CHESS_BOARD_PX + 10.5);
    ctx.lineTo(CHESS_BOARD_X + CHESS_BOARD_PX - 12, CHESS_BOARD_Y + CHESS_BOARD_PX + 10.5);
    ctx.stroke();
    ctx.restore();

    this.drawBrassCornerBrackets(
      ctx,
      CHESS_BOARD_X - 11.5,
      CHESS_BOARD_Y - 11.5,
      CHESS_BOARD_PX + 23,
      CHESS_BOARD_PX + 23,
      15
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

    ctx.font = '800 9.5px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillStyle = '#fde68a';
    for (let i = 0; i < 8; i++) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        String.fromCharCode(97 + i),
        CHESS_BOARD_X + (i + 0.5) * CHESS_CELL_PX,
        CHESS_BOARD_Y + CHESS_BOARD_PX + 7.5
      );
      ctx.fillText(
        String(8 - i),
        CHESS_BOARD_X - 7.5,
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

    // 4. Right-hand Hogwarts Great Hall Strategy Scroll & Harry Potter Character Spotlight
    this.drawParchmentSidePanel(
      ctx,
      CHESS_SIDE_X,
      CHESS_SIDE_Y,
      CHESS_SIDE_W,
      CHESS_SIDE_H,
      '⚡ ĐẠI SẢNH CỜ PHÙ THỦY'
    );

    ctx.save();
    const midX = CHESS_SIDE_X + CHESS_SIDE_W * 0.5;
    const obX = CHESS_SIDE_X + 10;
    const obW = CHESS_SIDE_W - 20;

    // Row 1: Compact Opponent Portrait Medallion + Mission Subtitle
    this.drawCharacterPortraitMedallion(
      ctx,
      CHESS_SIDE_X + 27,
      CHESS_SIDE_Y + 64,
      15.5,
      engine.opponentPortrait,
      engine.opponentEmoji
    );

    ctx.fillStyle = '#4a240d';
    ctx.font = '900 11.4px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(engine.opponentName, CHESS_SIDE_X + 49, CHESS_SIDE_Y + 56, CHESS_SIDE_W - 58);

    ctx.fillStyle = '#991b1b';
    ctx.font = '700 9.4px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(
      engine.subMode === 'tactics' ? `⚡ ${engine.title}` : '👑 Đại Chiến 8×8 • Gryffindor',
      CHESS_SIDE_X + 49,
      CHESS_SIDE_Y + 72,
      CHESS_SIDE_W - 58
    );

    // Row 2: Harry Potter Character Spotlight Card (hovered -> selected -> last moved -> Dumbledore)
    let focusPiece: ChessPiece | null = null;
    if (this.chessHoverSquare) {
      focusPiece = engine.board[this.chessHoverSquare.r]?.[this.chessHoverSquare.c] ?? null;
    }
    if (!focusPiece && sel) {
      focusPiece = engine.board[sel.r]?.[sel.c] ?? null;
    }
    if (!focusPiece && engine.lastMove) {
      focusPiece = engine.board[engine.lastMove.toR]?.[engine.lastMove.toC] ?? null;
    }
    if (!focusPiece) {
      focusPiece = { color: 'w', type: 'k' };
    }

    const focusKey = `${focusPiece.color}${focusPiece.type}`;
    const meta = HP_CHESS_PIECE_META[focusKey] ?? HP_CHESS_PIECE_META.wk;
    const focusIsWhite = focusPiece.color === 'w';

    const spY = CHESS_SIDE_Y + 92;
    const spH = 118;
    drawRoundedRect(ctx, obX, spY, obW, spH, 11);
    const spBg = ctx.createLinearGradient(0, spY, 0, spY + spH);
    if (focusIsWhite) {
      spBg.addColorStop(0, '#fffdf7');
      spBg.addColorStop(1, '#f9e4bc');
    } else {
      spBg.addColorStop(0, '#f4fbf8');
      spBg.addColorStop(1, '#d7ede4');
    }
    ctx.fillStyle = spBg;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = focusIsWhite ? '#d97706' : '#059669';
    ctx.stroke();

    // Left arched showcase alcove with zoomed 2.5D Chibi figurine
    const alcX = obX + 5;
    const alcY = spY + 7;
    const alcW = 54;
    const alcH = spH - 14;
    drawRoundedRect(ctx, alcX, alcY, alcW, alcH, 9);
    const alcGrad = ctx.createLinearGradient(0, alcY, 0, alcY + alcH);
    if (focusIsWhite) {
      alcGrad.addColorStop(0, '#991b1b');
      alcGrad.addColorStop(1, '#450a0a');
    } else {
      alcGrad.addColorStop(0, '#065f46');
      alcGrad.addColorStop(1, '#08201b');
    }
    ctx.fillStyle = alcGrad;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = focusIsWhite ? '#fbbf24' : '#6ee7b7';
    ctx.stroke();

    const focusImg = this.chessPieceImages.get(focusKey);
    if (focusImg && focusImg.complete && focusImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(focusImg, alcX - 2, alcY + 18, 58, 66);
      ctx.restore();
    } else {
      this.drawWizardChessPiece(ctx, alcX + alcW * 0.5, alcY + alcH * 0.58, focusPiece, 1.05, false);
    }

    // Right character lore details
    const tx = alcX + alcW + 6;
    const tw = obW - (alcW + 16);

    // House crest pill
    drawRoundedRect(ctx, tx, spY + 9, tw, 17, 8.5);
    ctx.fillStyle = focusIsWhite ? '#7f1d1d' : '#064e3b';
    ctx.fill();
    ctx.fillStyle = focusIsWhite ? '#fef08a' : '#a7f3d0';
    ctx.font = '800 8.2px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      focusIsWhite ? '🦁 HỘI PHƯỢNG HOÀNG' : '🐍 SLYTHERIN HẮC ÁM',
      tx + tw * 0.5,
      spY + 17.5,
      tw - 6
    );

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = focusIsWhite ? '#4a1807' : '#063328';
    ctx.font = '900 10.6px "Playfair Display", Georgia, serif';
    ctx.fillText(meta.name, tx, spY + 44, tw);

    ctx.fillStyle = focusIsWhite ? '#b91c1c' : '#047857';
    ctx.font = '800 9.6px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(`${meta.glyph} ${meta.roleVi}`, tx, spY + 61, tw);

    ctx.fillStyle = '#5c3317';
    ctx.font = '600 9px "Be Vietnam Pro", system-ui, sans-serif';
    if (engine.subMode === 'tactics') {
      this.drawWrappedCanvasText(ctx, engine.subtitle, tx, spY + 78, tw, 12.5, 3);
    } else {
      ctx.fillText(`✨ ${meta.spellName}`, tx, spY + 79, tw);
      ctx.fillStyle = '#7c4a21';
      ctx.font = '600 8.5px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText('Di chuột xem thông tin quân', tx, spY + 98, tw);
    }

    // Row 3: Captured Harry Potter Figurines Trophy Shelves
    const trY = CHESS_SIDE_Y + 222;
    const trH = 124;
    drawRoundedRect(ctx, obX, trY, obW, trH, 11);
    ctx.fillStyle = '#ecd4a4';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#b48347';
    ctx.stroke();

    ctx.fillStyle = '#064e3b';
    ctx.font = '800 9.4px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('🐍 Phe Hắc Ám bạn đã hạ:', obX + 8, trY + 18);
    this.drawCapturedChessRow(ctx, obX + 12, trY + 41, obW - 24, engine.capturedByWhite, 'b');

    ctx.strokeStyle = 'rgba(138, 86, 48, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(obX + 8, trY + 62);
    ctx.lineTo(obX + obW - 8, trY + 62);
    ctx.stroke();

    ctx.fillStyle = '#7f1d1d';
    ctx.fillText('🦁 Phe Gryffindor đã ngã:', obX + 8, trY + 80);
    this.drawCapturedChessRow(ctx, obX + 12, trY + 103, obW - 24, engine.capturedByBlack, 'w');

    // Row 4: Chunky Turn / Check / Checkmate Banner
    let cTop = '#fde047';
    let cBot = '#eab308';
    let cBorder = '#92400e';
    let cInk = '#3b1706';
    let cText = whiteInCheck
      ? '⚠️ Cụ Dumbledore đang bị chiếu!'
      : '🦁 Lượt bạn • Quân Gryffindor';
    if (engine.status === 'ai_thinking') {
      cTop = '#a7f3d0';
      cBot = '#10b981';
      cBorder = '#065f46';
      cInk = '#022c22';
      cText = `🐍 ${engine.opponentName} đang niệm chú...`;
    } else if (engine.status === 'won') {
      cTop = '#86efac';
      cBot = '#22c55e';
      cBorder = '#166534';
      cInk = '#052e16';
      cText = '🏆 Chiếu bí thế lực Hắc Ám!';
    } else if (engine.status === 'lost') {
      cTop = '#fecdd3';
      cBot = '#fb7185';
      cBorder = '#9f1239';
      cInk = '#4c0519';
      cText = '💥 Gryffindor thất thủ! Đi Lại / Ván Mới';
    } else if (engine.status === 'draw') {
      cTop = '#e2e8f0';
      cBot = '#cbd5e1';
      cBorder = '#475569';
      cInk = '#1e293b';
      cText = '🤝 Hoà cờ tại Đại Sảnh Đường!';
    }

    const cbY = CHESS_SIDE_Y + 358;
    drawRoundedRect(ctx, obX, cbY + 2.5, obW, 44, 11);
    ctx.fillStyle = cBorder;
    ctx.fill();
    drawRoundedRect(ctx, obX, cbY, obW, 44, 11);
    const cbGrad = ctx.createLinearGradient(0, cbY, 0, cbY + 44);
    cbGrad.addColorStop(0, cTop);
    cbGrad.addColorStop(1, cBot);
    ctx.fillStyle = cbGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = cBorder;
    ctx.stroke();

    ctx.fillStyle = cInk;
    ctx.font = '800 10.2px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cText, midX, cbY + 22.5, obW - 10);

    ctx.fillStyle = '#7a4b26';
    ctx.font = '700 9.4px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(
      `Nước đi: ${engine.moveCount} • Chạm hoặc kéo thả quân`,
      midX,
      CHESS_SIDE_Y + 434,
      obW
    );
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
   * Renders a 2.5D Chibi Harry Potter Chess Figurine from `/paintings/chess/{wk..bp}.png`
   * (Gryffindor Scarlet-Gold vs Slytherin Emerald-Silver) with animated levitation aura
   * and an instant pedestal+glyph fallback while sprites decode.
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

    // 1. Ambient ground shadow + house reflection rim so dark Slytherin robes pop on dark marble
    if (isSelected) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 14.5, 19, 7.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? 'rgba(250, 204, 21, 0.38)' : 'rgba(16, 185, 129, 0.38)';
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -now * 0.02;
      ctx.strokeStyle = isWhite ? '#fde047' : '#6ee7b7';
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 14.8, 16.4, 6.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? 'rgba(254, 240, 138, 0.18)' : 'rgba(110, 231, 183, 0.24)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.ellipse(0.6, 15.6, 15.2, 5.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14, 8, 4, 0.46)';
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

    // Lightweight instant fallback while PNG finishes decoding on first frame
    const meta = HP_CHESS_PIECE_META[pieceKey];
    ctx.beginPath();
    ctx.ellipse(0, 12.5, 14, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#b91c1c' : '#065f46';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isWhite ? '#fde047' : '#a7f3d0';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -1, 11.5, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#fffbeb' : '#1e293b';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isWhite ? '#7f1d1d' : '#ecfdf5';
    ctx.font = '900 15px "Apple Symbols", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(meta?.glyph ?? '♔', 0, -0.5);
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
