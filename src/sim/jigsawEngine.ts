import {
  JigsawTrayFilter,
  SavedJigsawSession,
} from '../types/game';
import {
  MAX_MINIGAME_STAGE,
  PuzzleRewardSpec,
  TurningPointReview,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
  mulberry32,
} from './puzzleShared';
import {
  JigsawArtAssetProvider,
  JigsawStageArtworkSpec,
  getJigsawStageArtworkSpec,
  renderJigsawStagePainting,
} from './jigsawPaintingComposer';

export const JIGSAW_MAX_PIECES = 2000;
export const JIGSAW_MIN_TIME_SEC = 150;
export const JIGSAW_MAX_TIME_SEC = 7200; // Tối đa đúng 2 giờ (7.200 giây)
export const JIGSAW_ATLAS_MAX_SIDE = 2048; // <= 4.19M px (an toàn tuyệt đối cho iOS 16 Safari)
export const JIGSAW_LOCKED_CANVAS_MAX_W = 1280;
export const JIGSAW_LOCKED_CANVAS_MAX_H = 1024;
export const JIGSAW_MAX_LOOSE_CLUSTERS = 64;

export const JIGSAW_PIECE_TRAY = 0;
export const JIGSAW_PIECE_BOARD = 1;
export const JIGSAW_PIECE_LOCKED = 2;

export interface JigsawStageSpec {
  stage: number;
  rows: number;
  cols: number;
  totalPieces: number;
  timeLimitSec: number;
  tierLabelVi: string;
  tierBadgeEmoji: string;
  showGhostDefault: boolean;
  isBreatherStage: boolean;
  isBossStage: boolean;
}

interface GridPreset {
  maxStage: number;
  rows: number;
  cols: number;
  timeLimitSec: number;
  tierLabelVi: string;
}

const STAGE_GRID_PRESETS: readonly GridPreset[] = [
  // Bậc 1: Nhập Môn (Màn 1–15: 9 -> 16 mảnh, 2p30s -> 4p)
  { maxStage: 5, rows: 3, cols: 3, timeLimitSec: 150, tierLabelVi: 'Nhập Môn Khung Gỗ' },
  { maxStage: 10, rows: 3, cols: 4, timeLimitSec: 180, tierLabelVi: 'Nhập Môn Khung Gỗ' },
  { maxStage: 15, rows: 4, cols: 4, timeLimitSec: 240, tierLabelVi: 'Nhập Môn Khung Gỗ' },
  // Bậc 2: Tập Sự (Màn 16–45: 20 -> 36 mảnh, 5p -> 9p)
  { maxStage: 24, rows: 4, cols: 5, timeLimitSec: 300, tierLabelVi: 'Tập Sự Họa Phẩm' },
  { maxStage: 31, rows: 5, cols: 5, timeLimitSec: 360, tierLabelVi: 'Tập Sự Họa Phẩm' },
  { maxStage: 38, rows: 5, cols: 6, timeLimitSec: 450, tierLabelVi: 'Tập Sự Họa Phẩm' },
  { maxStage: 45, rows: 6, cols: 6, timeLimitSec: 540, tierLabelVi: 'Tập Sự Họa Phẩm' },
  // Bậc 3: Khéo Tay (Màn 46–100: 48 -> 100 mảnh, 12p -> 22p)
  { maxStage: 60, rows: 6, cols: 8, timeLimitSec: 720, tierLabelVi: 'Khéo Tay Sảnh Tranh' },
  { maxStage: 78, rows: 8, cols: 8, timeLimitSec: 900, tierLabelVi: 'Khéo Tay Sảnh Tranh' },
  { maxStage: 94, rows: 8, cols: 10, timeLimitSec: 1080, tierLabelVi: 'Khéo Tay Sảnh Tranh' },
  { maxStage: 100, rows: 10, cols: 10, timeLimitSec: 1320, tierLabelVi: 'Khéo Tay Sảnh Tranh' },
  // Bậc 4: Nghệ Nhân (Màn 101–200: 120 -> 270 mảnh, 26p -> 45p)
  { maxStage: 125, rows: 10, cols: 12, timeLimitSec: 1560, tierLabelVi: 'Nghệ Nhân Phục Chế' },
  { maxStage: 149, rows: 12, cols: 12, timeLimitSec: 1800, tierLabelVi: 'Nghệ Nhân Phục Chế' },
  { maxStage: 170, rows: 12, cols: 15, timeLimitSec: 2100, tierLabelVi: 'Nghệ Nhân Phục Chế' },
  { maxStage: 186, rows: 14, cols: 16, timeLimitSec: 2400, tierLabelVi: 'Nghệ Nhân Phục Chế' },
  { maxStage: 200, rows: 15, cols: 18, timeLimitSec: 2700, tierLabelVi: 'Nghệ Nhân Phục Chế' },
  // Bậc 5: Cao Thủ (Màn 201–350: 320 -> 500 mảnh, 50p -> 1h05p)
  { maxStage: 250, rows: 16, cols: 20, timeLimitSec: 3000, tierLabelVi: 'Cao Thủ Bích Họa' },
  { maxStage: 305, rows: 18, cols: 22, timeLimitSec: 3360, tierLabelVi: 'Cao Thủ Bích Họa' },
  { maxStage: 350, rows: 20, cols: 25, timeLimitSec: 3900, tierLabelVi: 'Cao Thủ Bích Họa' },
  // Bậc 6: Đại Sư (Màn 351–550: 616 -> 1.008 mảnh, 1h12p -> 1h36p)
  { maxStage: 405, rows: 22, cols: 28, timeLimitSec: 4320, tierLabelVi: 'Đại Sư Ngàn Mảnh' },
  { maxStage: 460, rows: 25, cols: 30, timeLimitSec: 4800, tierLabelVi: 'Đại Sư Ngàn Mảnh' },
  { maxStage: 510, rows: 25, cols: 36, timeLimitSec: 5400, tierLabelVi: 'Đại Sư Ngàn Mảnh' },
  { maxStage: 550, rows: 28, cols: 36, timeLimitSec: 5760, tierLabelVi: 'Đại Sư Ngàn Mảnh' },
  // Bậc 7: Huyền Thoại (Màn 551–700: 1.200 -> 1.680 mảnh, 1h42p -> 1h54p)
  { maxStage: 605, rows: 30, cols: 40, timeLimitSec: 6120, tierLabelVi: 'Huyền Thoại Tháp Tranh' },
  { maxStage: 655, rows: 32, cols: 45, timeLimitSec: 6480, tierLabelVi: 'Huyền Thoại Tháp Tranh' },
  { maxStage: 700, rows: 35, cols: 48, timeLimitSec: 6840, tierLabelVi: 'Huyền Thoại Tháp Tranh' },
  // Bậc 8: Tuyệt Tác Tối Thượng (Màn 701–777: 1.800 -> 2.000 mảnh, 1h57p -> tối đa 2h00p = 7.200s)
  { maxStage: 730, rows: 36, cols: 50, timeLimitSec: 7020, tierLabelVi: 'Tuyệt Tác Hai Ngàn Mảnh' },
  { maxStage: 755, rows: 38, cols: 50, timeLimitSec: 7110, tierLabelVi: 'Tuyệt Tác Hai Ngàn Mảnh' },
  { maxStage: 777, rows: 40, cols: 50, timeLimitSec: 7200, tierLabelVi: 'Tuyệt Tác Hai Ngàn Mảnh' },
];

const BREATHER_AFTER_BOSS_STAGES = new Set<number>([
  26, 51, 101, 151, 201, 301, 401, 501, 601, 701,
]);

export function getJigsawStageSpec(rawStage: number): JigsawStageSpec {
  const stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(Number(rawStage) || 1)));
  let presetIdx = STAGE_GRID_PRESETS.findIndex((p) => stage <= p.maxStage);
  if (presetIdx < 0) presetIdx = STAGE_GRID_PRESETS.length - 1;

  const isBossStage = Boolean(getMilestoneBossMeta(stage));
  const isBreatherStage = !isBossStage && BREATHER_AFTER_BOSS_STAGES.has(stage);
  if (isBreatherStage && presetIdx > 0) {
    presetIdx -= 1;
  }

  const preset = STAGE_GRID_PRESETS[presetIdx];
  const tier = getMinigameDifficultyTier(stage);
  const rows = preset.rows;
  const cols = preset.cols;
  const totalPieces = rows * cols;
  const timeLimitSec = Math.max(
    JIGSAW_MIN_TIME_SEC,
    Math.min(JIGSAW_MAX_TIME_SEC, preset.timeLimitSec)
  );

  return {
    stage,
    rows,
    cols,
    totalPieces,
    timeLimitSec,
    tierLabelVi: preset.tierLabelVi,
    tierBadgeEmoji: tier.badgeEmoji,
    showGhostDefault: stage <= 35,
    isBreatherStage,
    isBossStage,
  };
}

// ============================================================================
// MÃ HOÁ BITSET BASE64 SIÊU GỌN (2.000 BIT = 250 BYTE -> 336 KÝ TỰ)
// ============================================================================

const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeBitsetBase64(state: Uint8Array, targetVal: number): string {
  const byteLen = Math.ceil(state.length / 8);
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < state.length; i++) {
    if (state[i] === targetVal) {
      bytes[i >> 3] |= 1 << (i & 7);
    }
  }
  let out = '';
  for (let i = 0; i < byteLen; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < byteLen ? bytes[i + 1] : 0;
    const b2 = i + 2 < byteLen ? bytes[i + 2] : 0;
    const trip = (b0 << 16) | (b1 << 8) | b2;
    out += B64_ALPHABET[(trip >> 18) & 63];
    out += B64_ALPHABET[(trip >> 12) & 63];
    out += i + 1 < byteLen ? B64_ALPHABET[(trip >> 6) & 63] : '=';
    out += i + 2 < byteLen ? B64_ALPHABET[trip & 63] : '=';
  }
  return out;
}

export function decodeBitsetBase64(b64: string, totalBits: number): Uint8Array | null {
  if (typeof b64 !== 'string' || b64.length > 1024) return null;
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  if (clean.length === 0 && totalBits > 0) return null;
  const byteLen = Math.ceil(totalBits / 8);
  const bytes = new Uint8Array(byteLen);
  let byteIdx = 0;
  for (let i = 0; i < clean.length && byteIdx < byteLen; i += 4) {
    const c0 = B64_ALPHABET.indexOf(clean[i] ?? 'A');
    const c1 = B64_ALPHABET.indexOf(clean[i + 1] ?? 'A');
    const c2 = clean[i + 2] === '=' ? 0 : B64_ALPHABET.indexOf(clean[i + 2] ?? 'A');
    const c3 = clean[i + 3] === '=' ? 0 : B64_ALPHABET.indexOf(clean[i + 3] ?? 'A');
    if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) return null;
    const trip = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
    if (byteIdx < byteLen) bytes[byteIdx++] = (trip >> 16) & 255;
    if (clean[i + 2] !== '=' && byteIdx < byteLen) bytes[byteIdx++] = (trip >> 8) & 255;
    if (clean[i + 3] !== '=' && byteIdx < byteLen) bytes[byteIdx++] = trip & 255;
  }
  const flags = new Uint8Array(totalBits);
  for (let i = 0; i < totalBits; i++) {
    flags[i] = (bytes[i >> 3] & (1 << (i & 7))) !== 0 ? 1 : 0;
  }
  return flags;
}

// ============================================================================
// ĐƯỜNG CONG BEZIER MẢNH KHỚP CỔ ĐIỂN (INTERLOCKING JIGSAW TABS)
// ============================================================================

export function traceJigsawPiecePath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  top: number,
  right: number,
  bottom: number,
  left: number
): void {
  const minSide = Math.min(w, h);
  const tabDepth = minSide * 0.22;

  ctx.beginPath();
  ctx.moveTo(x, y);

  // Cạnh Trên: (x, y) -> (x + w, y)
  if (top === 0) {
    ctx.lineTo(x + w, y);
  } else {
    const s = -top; // top = +1 nhô lên ngoài (-y), top = -1 lõm vào trong (+y)
    const d = tabDepth * s;
    ctx.lineTo(x + w * 0.35, y);
    ctx.bezierCurveTo(
      x + w * 0.37,
      y + d * 0.15,
      x + w * 0.31,
      y + d,
      x + w * 0.5,
      y + d
    );
    ctx.bezierCurveTo(
      x + w * 0.69,
      y + d,
      x + w * 0.63,
      y + d * 0.15,
      x + w * 0.65,
      y
    );
    ctx.lineTo(x + w, y);
  }

  // Cạnh Phải: (x + w, y) -> (x + w, y + h)
  if (right === 0) {
    ctx.lineTo(x + w, y + h);
  } else {
    const d = tabDepth * right; // right = +1 nhô sang phải (+x)
    ctx.lineTo(x + w, y + h * 0.35);
    ctx.bezierCurveTo(
      x + w + d * 0.15,
      y + h * 0.37,
      x + w + d,
      y + h * 0.31,
      x + w + d,
      y + h * 0.5
    );
    ctx.bezierCurveTo(
      x + w + d,
      y + h * 0.69,
      x + w + d * 0.15,
      y + h * 0.63,
      x + w,
      y + h * 0.65
    );
    ctx.lineTo(x + w, y + h);
  }

  // Cạnh Dưới: (x + w, y + h) -> (x, y + h)
  if (bottom === 0) {
    ctx.lineTo(x, y + h);
  } else {
    const d = tabDepth * bottom; // bottom = +1 nhô xuống dưới (+y)
    ctx.lineTo(x + w * 0.65, y + h);
    ctx.bezierCurveTo(
      x + w * 0.63,
      y + h + d * 0.15,
      x + w * 0.69,
      y + h + d,
      x + w * 0.5,
      y + h + d
    );
    ctx.bezierCurveTo(
      x + w * 0.31,
      y + h + d,
      x + w * 0.37,
      y + h + d * 0.15,
      x + w * 0.35,
      y + h
    );
    ctx.lineTo(x, y + h);
  }

  // Cạnh Trái: (x, y + h) -> (x, y)
  if (left === 0) {
    ctx.lineTo(x, y);
  } else {
    const d = -tabDepth * left; // left = +1 nhô sang trái (-x)
    ctx.lineTo(x, y + h * 0.65);
    ctx.bezierCurveTo(
      x + d * 0.15,
      y + h * 0.63,
      x + d,
      y + h * 0.69,
      x + d,
      y + h * 0.5
    );
    ctx.bezierCurveTo(
      x + d,
      y + h * 0.31,
      x + d * 0.15,
      y + h * 0.37,
      x,
      y + h * 0.35
    );
    ctx.lineTo(x, y);
  }

  ctx.closePath();
}

/**
 * Tính tỷ lệ khung tranh Jigsaw (`boardW / boardH`) thích ứng mượt theo diện tích sân khấu thực tế
 * trên cả màn hình ngang (Desktop / Landscape) lẫn dọc (Mobile Portrait), đồng thời giữ tỷ lệ từng mảnh
 * trong ngưỡng hài hoà `[0.65 .. 1.75]` và làm tròn bậc `0.05` để không re-bake khi co giãn vài pixel.
 */
export function resolveJigsawBoardAspect(
  rows: number,
  cols: number,
  availW: number,
  availH: number
): number {
  const gridAspect = Math.max(1, cols) / Math.max(1, rows);
  const stageAspect = Math.max(80, availW) / Math.max(80, availH);
  const clampedPieceAspect = Math.max(0.65, Math.min(1.75, stageAspect / gridAspect));
  const rawBoardAspect = gridAspect * clampedPieceAspect;
  return Math.max(0.55, Math.min(2.3, Math.round(rawBoardAspect * 20) / 20));
}

export function computeAtlasMetrics(
  rows: number,
  cols: number,
  boardAspect?: number
): {
  atlasW: number;
  atlasH: number;
  strideW: number;
  strideH: number;
  cellW: number;
  cellH: number;
  padX: number;
  padY: number;
  sourceW: number;
  sourceH: number;
  boardAspect: number;
} {
  // Đảm bảo tổng kích thước Atlas luôn <= 2048 × 2048 (<= 4.194.304 px)
  const safeCols = Math.max(1, cols);
  const safeRows = Math.max(1, rows);
  const gridAspect = safeCols / safeRows;
  const targetBoardAspect =
    typeof boardAspect === 'number' && Number.isFinite(boardAspect) && boardAspect > 0.25
      ? Math.max(gridAspect * 0.6, Math.min(gridAspect * 1.85, boardAspect))
      : gridAspect;
  const pieceAspect = Math.max(0.6, Math.min(1.85, targetBoardAspect / gridAspect));

  const maxStrideW = Math.min(128, Math.floor(JIGSAW_ATLAS_MAX_SIDE / safeCols));
  const maxStrideH = Math.min(128, Math.floor(JIGSAW_ATLAS_MAX_SIDE / safeRows));

  let strideW = maxStrideW;
  let strideH = Math.round(strideW / pieceAspect);
  if (strideH > maxStrideH) {
    strideH = maxStrideH;
    strideW = Math.round(strideH * pieceAspect);
  }
  strideW = Math.min(maxStrideW, Math.max(16, strideW));
  strideH = Math.min(maxStrideH, Math.max(16, strideH));

  const padX = Math.max(3, Math.floor(strideW * 0.19));
  const padY = Math.max(3, Math.floor(strideH * 0.19));
  const cellW = Math.max(8, strideW - padX * 2);
  const cellH = Math.max(8, strideH - padY * 2);

  const atlasW = safeCols * strideW;
  const atlasH = safeRows * strideH;
  const effectiveBoardAspect = (safeCols * cellW) / Math.max(1, safeRows * cellH);

  let sourceW = Math.min(1600, Math.max(640, safeCols * cellW));
  let sourceH = Math.round(sourceW / effectiveBoardAspect);
  if (sourceH > 1280) {
    sourceH = 1280;
    sourceW = Math.min(1600, Math.max(360, Math.round(sourceH * effectiveBoardAspect)));
  } else if (sourceH < 480) {
    sourceH = 480;
    sourceW = Math.min(1600, Math.max(360, Math.round(sourceH * effectiveBoardAspect)));
  }

  return {
    atlasW,
    atlasH,
    strideW,
    strideH,
    cellW,
    cellH,
    padX,
    padY,
    sourceW,
    sourceH,
    boardAspect: targetBoardAspect,
  };
}

export interface JigsawAtlasBakeCache {
  stage: number;
  rows: number;
  cols: number;
  boardAspect: number;
  sourceCanvas: HTMLCanvasElement;
  atlasCanvas: HTMLCanvasElement;
  lockedCanvas: HTMLCanvasElement;
  metrics: ReturnType<typeof computeAtlasMetrics>;
  bakedPiecesCount: number;
  lockedStampedFlags: Uint8Array;
  waitingOnExternalImage: boolean;
}

// ============================================================================
// ENGINE CHÍNH: MASTER JIGSAW ENGINE (9 -> 2.000 MẢNH, GIỚI HẠN <= 2 GIỜ)
// ============================================================================

export class MasterJigsawEngine {
  public readonly stage: number;
  public readonly seed: number;
  public readonly spec: JigsawStageSpec;
  public readonly artwork: JigsawStageArtworkSpec;
  public readonly rows: number;
  public readonly cols: number;
  public readonly totalPieces: number;
  public readonly reward: PuzzleRewardSpec;

  /** 0 = IN_TRAY, 1 = ON_BOARD, 2 = LOCKED */
  public readonly pieceState: Uint8Array;
  /** 4 cạnh mỗi mảnh: [top, right, bottom, left] ∈ {-1, 0, 1} */
  public readonly pieceEdges: Int8Array;
  /** Thứ tự xáo trộn trên khay mảnh */
  public readonly shuffledTrayOrder: Int16Array;

  /** Union-Find quản lý các cụm mảnh liền kề đã khớp nhau ngoài mặt bàn */
  private readonly ufParent: Int16Array;
  private readonly ufSize: Int16Array;
  /** Độ lệch chuẩn hoá của cụm mảnh so với vị trí đích trên khung tranh (`delta = 0` là khớp đúng vị trí khung!) */
  public readonly clusterDeltaX: Float32Array;
  public readonly clusterDeltaY: Float32Array;
  /** Z-order của cụm mảnh trên mặt bàn để mảnh vừa nhấc luôn nằm trên cùng */
  public readonly clusterZ: Int32Array;
  private nextZ = 10;

  public lockedCount = 0;
  public timeLimitSec: number;
  public timeRemainingSec: number;
  public trayFilter: JigsawTrayFilter = 'all';
  public selectedTrayPieceIdx: number | null = null;
  public showGhostPreview = false;
  public movesCount = 0;
  public combo = 0;
  public maxCombo = 0;
  public score = 0;
  public freeHintsLeft: number;
  public paidHintsLeft = 3;
  public talismanUsed = false;
  public lossReason: 'timeout' | null = null;
  public status: 'playing' | 'won' | 'lost' = 'playing';

  /** Phục vụ Gương Chiếu Hậu Pháp Thuật khi hết giờ / thắng màn */
  private firstEdgeCompletedSec: number | null = null;

  constructor(rawStage: number) {
    this.spec = getJigsawStageSpec(rawStage);
    this.stage = this.spec.stage;
    this.rows = this.spec.rows;
    this.cols = this.spec.cols;
    this.totalPieces = this.spec.totalPieces;
    this.seed = (this.stage * 2654435761 + this.rows * 40503 + this.cols * 12289) >>> 0;
    this.artwork = getJigsawStageArtworkSpec(this.stage);

    this.timeLimitSec = this.spec.timeLimitSec;
    this.timeRemainingSec = this.spec.timeLimitSec;
    this.showGhostPreview = this.spec.showGhostDefault;
    this.freeHintsLeft = this.totalPieces >= 500 ? 3 : this.totalPieces >= 100 ? 2 : 1;

    this.pieceState = new Uint8Array(this.totalPieces);
    this.pieceEdges = new Int8Array(this.totalPieces * 4);
    this.shuffledTrayOrder = new Int16Array(this.totalPieces);
    this.ufParent = new Int16Array(this.totalPieces);
    this.ufSize = new Int16Array(this.totalPieces);
    this.clusterDeltaX = new Float32Array(this.totalPieces);
    this.clusterDeltaY = new Float32Array(this.totalPieces);
    this.clusterZ = new Int32Array(this.totalPieces);

    this.generateDeterministicPieces();

    const stars = getStageStarReward(this.stage);
    const isBoss = this.spec.isBossStage;
    const pieceScaleBonus = Math.min(260, Math.round(Math.sqrt(this.totalPieces) * 5.5));
    this.reward = {
      stars,
      sand: isBoss || this.totalPieces >= 1000 ? 2 : this.stage % 5 === 0 ? 1 : 0,
      gold: 95 + Math.min(220, this.stage * 2) + pieceScaleBonus,
      xp: 80 + Math.min(180, Math.round(this.stage * 1.6)) + Math.round(pieceScaleBonus * 0.7),
      paintingId: this.artwork.paintingId,
      isMasterpiece: isBoss || this.totalPieces >= 500,
    };
  }

  public get hintGoldCost(): number {
    return this.totalPieces >= 500 ? 65 : 45;
  }

  public get remainingPieces(): number {
    return Math.max(0, this.totalPieces - this.lockedCount);
  }

  public get progressPct(): number {
    if (this.totalPieces <= 0) return 100;
    return Math.min(100, Math.round((this.lockedCount / this.totalPieces) * 100));
  }

  public get isTimeCritical(): boolean {
    return (
      this.status === 'playing' &&
      this.timeRemainingSec > 0 &&
      this.timeRemainingSec <= Math.min(60, Math.max(20, this.timeLimitSec * 0.12))
    );
  }

  public get timeProgressRatio(): number {
    if (this.timeLimitSec <= 0) return 1;
    return Math.max(0, Math.min(1, this.timeRemainingSec / this.timeLimitSec));
  }

  public formatRemainingTime(): string {
    const sec = Math.max(0, Math.ceil(this.timeRemainingSec));
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const rem = sec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  }

  private generateDeterministicPieces(): void {
    const rng = mulberry32(this.seed);
    const R = this.rows;
    const C = this.cols;

    const hTabs = new Int8Array(Math.max(0, (R - 1) * C));
    for (let i = 0; i < hTabs.length; i++) {
      hTabs[i] = rng() < 0.5 ? 1 : -1;
    }
    const vTabs = new Int8Array(Math.max(0, R * (C - 1)));
    for (let i = 0; i < vTabs.length; i++) {
      vTabs[i] = rng() < 0.5 ? 1 : -1;
    }

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const idx = r * C + c;
        const base = idx * 4;
        this.pieceEdges[base] = r === 0 ? 0 : -hTabs[(r - 1) * C + c];
        this.pieceEdges[base + 1] = c === C - 1 ? 0 : vTabs[r * (C - 1) + c];
        this.pieceEdges[base + 2] = r === R - 1 ? 0 : hTabs[r * C + c];
        this.pieceEdges[base + 3] = c === 0 ? 0 : -vTabs[r * (C - 1) + (c - 1)];

        this.pieceState[idx] = JIGSAW_PIECE_TRAY;
        this.ufParent[idx] = idx;
        this.ufSize[idx] = 1;
        this.shuffledTrayOrder[idx] = idx;
      }
    }

    for (let i = this.totalPieces - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = this.shuffledTrayOrder[i];
      this.shuffledTrayOrder[i] = this.shuffledTrayOrder[j];
      this.shuffledTrayOrder[j] = tmp;
    }
  }

  public getPieceEdges(pieceIdx: number): { top: number; right: number; bottom: number; left: number } {
    const base = pieceIdx * 4;
    return {
      top: this.pieceEdges[base] ?? 0,
      right: this.pieceEdges[base + 1] ?? 0,
      bottom: this.pieceEdges[base + 2] ?? 0,
      left: this.pieceEdges[base + 3] ?? 0,
    };
  }

  public isEdgePiece(pieceIdx: number): boolean {
    const r = Math.floor(pieceIdx / this.cols);
    const c = pieceIdx % this.cols;
    return r === 0 || r === this.rows - 1 || c === 0 || c === this.cols - 1;
  }

  public isCornerPiece(pieceIdx: number): boolean {
    const r = Math.floor(pieceIdx / this.cols);
    const c = pieceIdx % this.cols;
    return (r === 0 || r === this.rows - 1) && (c === 0 || c === this.cols - 1);
  }

  public matchesTrayFilter(pieceIdx: number, filter: JigsawTrayFilter = this.trayFilter): boolean {
    if (filter === 'all') return true;
    if (filter === 'edges') return this.isEdgePiece(pieceIdx);
    const r = Math.floor(pieceIdx / this.cols);
    const c = pieceIdx % this.cols;
    const isBottomHalf = r >= this.rows * 0.5;
    const isRightHalf = c >= this.cols * 0.5;
    if (filter === 'q0') return !isBottomHalf && !isRightHalf;
    if (filter === 'q1') return !isBottomHalf && isRightHalf;
    if (filter === 'q2') return isBottomHalf && !isRightHalf;
    return isBottomHalf && isRightHalf;
  }

  public getFilteredTrayPieces(): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.totalPieces; i++) {
      const pIdx = this.shuffledTrayOrder[i];
      if (this.pieceState[pIdx] === JIGSAW_PIECE_TRAY && this.matchesTrayFilter(pIdx)) {
        out.push(pIdx);
      }
    }
    return out;
  }

  public getTrayCountForFilter(filter: JigsawTrayFilter): number {
    let count = 0;
    for (let pIdx = 0; pIdx < this.totalPieces; pIdx++) {
      if (this.pieceState[pIdx] === JIGSAW_PIECE_TRAY && this.matchesTrayFilter(pIdx, filter)) {
        count += 1;
      }
    }
    return count;
  }

  // --------------------------------------------------------------------------
  // UNION-FIND QUẢN LÝ CỤM MẢNH TRÊN MẶT BÀN
  // --------------------------------------------------------------------------

  public findClusterRoot(idx: number): number {
    let root = idx;
    while (this.ufParent[root] !== root) {
      root = this.ufParent[root];
    }
    let cur = idx;
    while (cur !== root) {
      const nxt = this.ufParent[cur];
      this.ufParent[cur] = root;
      cur = nxt;
    }
    return root;
  }

  public getClusterMembers(anyMemberIdx: number): number[] {
    const root = this.findClusterRoot(anyMemberIdx);
    const members: number[] = [];
    for (let i = 0; i < this.totalPieces; i++) {
      if (this.pieceState[i] === JIGSAW_PIECE_BOARD && this.findClusterRoot(i) === root) {
        members.push(i);
      }
    }
    return members;
  }

  public getBoardClustersSortedByZ(ascending = true): Array<{ root: number; z: number; members: number[] }> {
    const map = new Map<number, number[]>();
    for (let i = 0; i < this.totalPieces; i++) {
      if (this.pieceState[i] !== JIGSAW_PIECE_BOARD) continue;
      const root = this.findClusterRoot(i);
      let arr = map.get(root);
      if (!arr) {
        arr = [];
        map.set(root, arr);
      }
      arr.push(i);
    }
    const list = Array.from(map.entries()).map(([root, members]) => ({
      root,
      z: this.clusterZ[root] || 1,
      members,
    }));
    list.sort((a, b) => (ascending ? a.z - b.z : b.z - a.z));
    return list;
  }

  /** Toạ độ tâm chuẩn hoá `[0..1]` của mảnh `pieceIdx` trên khung tranh */
  public getTargetNormCenter(pieceIdx: number): { nx: number; ny: number } {
    const r = Math.floor(pieceIdx / this.cols);
    const c = pieceIdx % this.cols;
    return {
      nx: (c + 0.5) / this.cols,
      ny: (r + 0.5) / this.rows,
    };
  }

  /** Toạ độ tâm hiện tại trên khung tranh chuẩn hoá của một mảnh đang nằm trên bàn (`ON_BOARD`) */
  public getBoardPieceNormCenter(pieceIdx: number): { nx: number; ny: number } {
    const target = this.getTargetNormCenter(pieceIdx);
    if (this.pieceState[pieceIdx] === JIGSAW_PIECE_LOCKED) {
      return target;
    }
    const root = this.findClusterRoot(pieceIdx);
    return {
      nx: target.nx + this.clusterDeltaX[root],
      ny: target.ny + this.clusterDeltaY[root],
    };
  }

  /**
   * Dò mảnh đang nằm trên mặt bàn (`ON_BOARD`) tại toạ độ chuẩn hoá `(nx, ny)` (ưu tiên mảnh có Z cao nhất).
   */
  public pickBoardPieceAtNorm(nx: number, ny: number, minHitRadiusNormX = 0, minHitRadiusNormY = 0): number | null {
    if (this.status !== 'playing') return null;
    const halfW = Math.max(minHitRadiusNormX, 0.56 / this.cols);
    const halfH = Math.max(minHitRadiusNormY, 0.56 / this.rows);
    let bestIdx: number | null = null;
    let bestZ = -1;
    for (let i = 0; i < this.totalPieces; i++) {
      if (this.pieceState[i] !== JIGSAW_PIECE_BOARD) continue;
      const root = this.findClusterRoot(i);
      const z = this.clusterZ[root];
      if (z < bestZ) continue;
      const pos = this.getBoardPieceNormCenter(i);
      if (Math.abs(nx - pos.nx) <= halfW && Math.abs(ny - pos.ny) <= halfH) {
        bestZ = z;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  /**
   * Đưa 1 mảnh từ Khay ra mặt bàn tại vị trí chuẩn hoá `(nx, ny)` để bắt đầu kéo hoặc đặt.
   */
  public spawnTrayPieceOntoBoard(pieceIdx: number, nx: number, ny: number): boolean {
    if (this.status !== 'playing') return false;
    if (pieceIdx < 0 || pieceIdx >= this.totalPieces) return false;
    if (this.pieceState[pieceIdx] !== JIGSAW_PIECE_TRAY) return false;

    const target = this.getTargetNormCenter(pieceIdx);
    this.pieceState[pieceIdx] = JIGSAW_PIECE_BOARD;
    this.ufParent[pieceIdx] = pieceIdx;
    this.ufSize[pieceIdx] = 1;
    this.clusterDeltaX[pieceIdx] = nx - target.nx;
    this.clusterDeltaY[pieceIdx] = ny - target.ny;
    this.clusterZ[pieceIdx] = ++this.nextZ;
    if (this.selectedTrayPieceIdx === pieceIdx) {
      this.selectedTrayPieceIdx = null;
    }
    return true;
  }

  public elevateCluster(pieceIdx: number): number {
    const root = this.findClusterRoot(pieceIdx);
    this.clusterZ[root] = ++this.nextZ;
    return root;
  }

  /**
   * Di chuyển cả cụm chứa `pieceIdx` sao cho tâm của mảnh `pieceIdx` nằm ở `(nx, ny)` (chuẩn hoá theo khung tranh).
   */
  public movePieceClusterToNorm(pieceIdx: number, nx: number, ny: number): void {
    if (this.status !== 'playing') return;
    if (this.pieceState[pieceIdx] !== JIGSAW_PIECE_BOARD) return;
    const root = this.findClusterRoot(pieceIdx);
    const target = this.getTargetNormCenter(pieceIdx);
    const clampedNx = Math.max(-0.08, Math.min(1.08, nx));
    const clampedNy = Math.max(-0.08, Math.min(1.08, ny));
    this.clusterDeltaX[root] = clampedNx - target.nx;
    this.clusterDeltaY[root] = clampedNy - target.ny;
  }

  public returnSingleBoardPieceToTray(pieceIdx: number): boolean {
    if (this.pieceState[pieceIdx] !== JIGSAW_PIECE_BOARD) return false;
    const root = this.findClusterRoot(pieceIdx);
    if (this.ufSize[root] > 1) return false;
    this.pieceState[pieceIdx] = JIGSAW_PIECE_TRAY;
    this.ufParent[pieceIdx] = pieceIdx;
    this.ufSize[pieceIdx] = 1;
    this.clusterDeltaX[pieceIdx] = 0;
    this.clusterDeltaY[pieceIdx] = 0;
    return true;
  }

  /**
   * Thu gọn toàn bộ các mảnh đơn lẻ chưa ghép cụm trên bàn về lại khay để rộng chỗ ghép tiếp.
   */
  public tidyLooseSinglePieces(): number {
    let returned = 0;
    for (let i = 0; i < this.totalPieces; i++) {
      if (this.pieceState[i] !== JIGSAW_PIECE_BOARD) continue;
      const root = this.findClusterRoot(i);
      if (this.ufSize[root] <= 1) {
        this.pieceState[i] = JIGSAW_PIECE_TRAY;
        this.ufParent[i] = i;
        this.ufSize[i] = 1;
        this.clusterDeltaX[i] = 0;
        this.clusterDeltaY[i] = 0;
        returned += 1;
      }
    }
    return returned;
  }

  private enforceLooseClusterCap(): void {
    const clusters = this.getBoardClustersSortedByZ(true);
    if (clusters.length <= JIGSAW_MAX_LOOSE_CLUSTERS) return;
    let excess = clusters.length - JIGSAW_MAX_LOOSE_CLUSTERS;
    for (const cl of clusters) {
      if (excess <= 0) break;
      if (cl.members.length === 1) {
        this.returnSingleBoardPieceToTray(cl.members[0]);
        excess -= 1;
      }
    }
  }

  /**
   * Thả mảnh/cụm xuống mặt bàn:
   *  1. Kiểm tra hút khoá vào đúng khung tranh gốc (`delta ≈ 0`).
   *  2. Nếu chưa trùng khung tranh, kiểm tra hút khớp với các mảnh hàng xóm liền kề trên mặt bàn (`Union-Find`).
   */
  public dropClusterAndResolve(
    pieceIdx: number,
    boardPixelW = 600,
    boardPixelH = 480
  ): {
    lockedPieces: number[];
    mergedWithNeighbor: boolean;
    clusterSize: number;
    won: boolean;
  } {
    if (this.status !== 'playing' || this.pieceState[pieceIdx] !== JIGSAW_PIECE_BOARD) {
      return {
        lockedPieces: [],
        mergedWithNeighbor: false,
        clusterSize: 0,
        won: this.status === 'won',
      };
    }

    this.movesCount += 1;
    let root = this.findClusterRoot(pieceIdx);
    const cellPxW = boardPixelW / this.cols;
    const cellPxH = boardPixelH / this.rows;
    const snapPx = Math.max(16, Math.min(34, Math.min(cellPxW, cellPxH) * 0.44));

    const errPx = Math.hypot(
      this.clusterDeltaX[root] * boardPixelW,
      this.clusterDeltaY[root] * boardPixelH
    );

    if (errPx <= snapPx) {
      const members = this.getClusterMembers(root);
      const lockedNow = this.lockPiecesInternal(members);
      return {
        lockedPieces: lockedNow,
        mergedWithNeighbor: false,
        clusterSize: lockedNow.length,
        won: this.lockedCount >= this.totalPieces,
      };
    }

    // Kiểm tra khớp cạnh với mảnh đã khoá kề bên (nếu thả sát cạnh mảnh đã khoá cũng hút vào khung luôn)
    const members = this.getClusterMembers(root);
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const;

    let mergedAny = false;
    const neighborSnapPx = Math.max(14, snapPx * 0.92);

    for (const m of members) {
      const mr = Math.floor(m / this.cols);
      const mc = m % this.cols;
      for (const [dr, dc] of dirs) {
        const nr = mr + dr;
        const nc = mc + dc;
        if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
        const nIdx = nr * this.cols + nc;
        if (this.pieceState[nIdx] !== JIGSAW_PIECE_BOARD) continue;
        const nRoot = this.findClusterRoot(nIdx);
        if (nRoot === root) continue;

        const relErrPx = Math.hypot(
          (this.clusterDeltaX[root] - this.clusterDeltaX[nRoot]) * boardPixelW,
          (this.clusterDeltaY[root] - this.clusterDeltaY[nRoot]) * boardPixelH
        );
        if (relErrPx <= neighborSnapPx) {
          root = this.unionClusters(nRoot, root);
          mergedAny = true;
        }
      }
    }

    if (mergedAny) {
      this.combo += 1;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.score += 35 * Math.min(8, this.combo);
      // Nếu gộp xong mà cụm mới nằm ngay sát khung gốc thì khoá luôn
      const postErrPx = Math.hypot(
        this.clusterDeltaX[root] * boardPixelW,
        this.clusterDeltaY[root] * boardPixelH
      );
      if (postErrPx <= snapPx * 1.1) {
        const mergedMembers = this.getClusterMembers(root);
        const lockedNow = this.lockPiecesInternal(mergedMembers);
        return {
          lockedPieces: lockedNow,
          mergedWithNeighbor: true,
          clusterSize: lockedNow.length,
          won: this.lockedCount >= this.totalPieces,
        };
      }
    } else {
      this.combo = 0;
    }

    this.enforceLooseClusterCap();
    const finalSize = this.ufSize[this.findClusterRoot(pieceIdx)] || 1;
    return {
      lockedPieces: [],
      mergedWithNeighbor: mergedAny,
      clusterSize: finalSize,
      won: false,
    };
  }

  private unionClusters(stationaryRoot: number, movingRoot: number): number {
    const rA = this.findClusterRoot(stationaryRoot);
    const rB = this.findClusterRoot(movingRoot);
    if (rA === rB) return rA;
    // Căn chỉnh về vị trí của cụm đứng yên để khớp khít tuyệt đối 100%
    const anchorDx = this.clusterDeltaX[rA];
    const anchorDy = this.clusterDeltaY[rA];
    const topZ = Math.max(this.clusterZ[rA], this.clusterZ[rB], ++this.nextZ);
    if (this.ufSize[rA] >= this.ufSize[rB]) {
      this.ufParent[rB] = rA;
      this.ufSize[rA] += this.ufSize[rB];
      this.clusterDeltaX[rA] = anchorDx;
      this.clusterDeltaY[rA] = anchorDy;
      this.clusterZ[rA] = topZ;
      return rA;
    }
    this.ufParent[rA] = rB;
    this.ufSize[rB] += this.ufSize[rA];
    this.clusterDeltaX[rB] = anchorDx;
    this.clusterDeltaY[rB] = anchorDy;
    this.clusterZ[rB] = topZ;
    return rB;
  }

  private lockPiecesInternal(indices: readonly number[]): number[] {
    const newlyLocked: number[] = [];
    for (const idx of indices) {
      if (idx < 0 || idx >= this.totalPieces) continue;
      if (this.pieceState[idx] === JIGSAW_PIECE_LOCKED) continue;
      this.pieceState[idx] = JIGSAW_PIECE_LOCKED;
      this.ufParent[idx] = idx;
      this.ufSize[idx] = 1;
      this.clusterDeltaX[idx] = 0;
      this.clusterDeltaY[idx] = 0;
      if (this.selectedTrayPieceIdx === idx) {
        this.selectedTrayPieceIdx = null;
      }
      this.lockedCount += 1;
      newlyLocked.push(idx);
    }

    if (newlyLocked.length > 0) {
      this.combo += 1;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      const clusterMult = newlyLocked.length > 1 ? 1.35 : 1;
      this.score += Math.round(newlyLocked.length * (55 + Math.min(10, this.combo) * 12) * clusterMult);

      if (this.firstEdgeCompletedSec === null && this.areAllEdgesLocked()) {
        this.firstEdgeCompletedSec = Math.max(1, Math.round(this.timeLimitSec - this.timeRemainingSec));
      }

      if (this.lockedCount >= this.totalPieces) {
        this.lockedCount = this.totalPieces;
        const speedBonus = Math.round(this.timeRemainingSec * 1.5);
        this.score += 500 + speedBonus;
        this.status = 'won';
        this.lossReason = null;
      }
    }
    return newlyLocked;
  }

  private areAllEdgesLocked(): boolean {
    for (let c = 0; c < this.cols; c++) {
      if (this.pieceState[c] !== JIGSAW_PIECE_LOCKED) return false;
      if (this.pieceState[(this.rows - 1) * this.cols + c] !== JIGSAW_PIECE_LOCKED) return false;
    }
    for (let r = 1; r < this.rows - 1; r++) {
      if (this.pieceState[r * this.cols] !== JIGSAW_PIECE_LOCKED) return false;
      if (this.pieceState[r * this.cols + (this.cols - 1)] !== JIGSAW_PIECE_LOCKED) return false;
    }
    return true;
  }

  // --------------------------------------------------------------------------
  // ĐỒNG HỒ ĐẾM NGƯỢC, GỢI Ý, BÙA PHƯỢNG HOÀNG & BÁNH TÁO BÀ MOLLY
  // --------------------------------------------------------------------------

  public tickTimer(
    dtSec: number,
    unlimitedMode = false
  ): { timedOut: boolean; wholeSecondChanged: boolean } {
    if (this.status !== 'playing' || unlimitedMode || dtSec <= 0) {
      return { timedOut: false, wholeSecondChanged: false };
    }
    const prevWhole = Math.ceil(this.timeRemainingSec);
    this.timeRemainingSec = Math.max(0, this.timeRemainingSec - dtSec);
    const nextWhole = Math.ceil(this.timeRemainingSec);
    if (this.timeRemainingSec <= 0) {
      this.timeRemainingSec = 0;
      this.status = 'lost';
      this.lossReason = 'timeout';
      this.combo = 0;
      return { timedOut: true, wholeSecondChanged: true };
    }
    return {
      timedOut: false,
      wholeSecondChanged: nextWhole !== prevWhole,
    };
  }

  public addBonusTime(extraSec: number): void {
    if (extraSec <= 0) return;
    this.timeRemainingSec = Math.min(
      JIGSAW_MAX_TIME_SEC,
      Math.max(0, this.timeRemainingSec) + extraSec
    );
    if (this.status === 'lost' && this.lossReason === 'timeout' && this.timeRemainingSec > 0) {
      this.status = 'playing';
      this.lossReason = null;
    }
  }

  private pickPriorityUnlockedPieces(count: number): number[] {
    const candidates: Array<{ idx: number; prio: number }> = [];
    for (let idx = 0; idx < this.totalPieces; idx++) {
      if (this.pieceState[idx] === JIGSAW_PIECE_LOCKED) continue;
      let prio = 4;
      if (this.isCornerPiece(idx)) {
        prio = 0;
      } else if (this.isEdgePiece(idx)) {
        prio = 1;
      } else {
        const r = Math.floor(idx / this.cols);
        const c = idx % this.cols;
        const adjLocked =
          (r > 0 && this.pieceState[(r - 1) * this.cols + c] === JIGSAW_PIECE_LOCKED) ||
          (r + 1 < this.rows && this.pieceState[(r + 1) * this.cols + c] === JIGSAW_PIECE_LOCKED) ||
          (c > 0 && this.pieceState[r * this.cols + (c - 1)] === JIGSAW_PIECE_LOCKED) ||
          (c + 1 < this.cols && this.pieceState[r * this.cols + (c + 1)] === JIGSAW_PIECE_LOCKED);
        if (adjLocked) prio = 2;
      }
      candidates.push({ idx, prio });
    }
    candidates.sort((a, b) => (a.prio !== b.prio ? a.prio - b.prio : a.idx - b.idx));
    return candidates.slice(0, Math.max(1, count)).map((x) => x.idx);
  }

  public useMagicHint(): {
    ok: boolean;
    lockedPieces: number[];
    won: boolean;
    msg: string;
  } {
    if (this.status !== 'playing') {
      return { ok: false, lockedPieces: [], won: this.status === 'won', msg: 'Ván chơi đã kết thúc!' };
    }
    const batchCount =
      this.totalPieces >= 1000
        ? 8
        : this.totalPieces >= 300
          ? 4
          : this.totalPieces >= 65
            ? 2
            : 1;
    const chosen = this.pickPriorityUnlockedPieces(batchCount);
    if (chosen.length === 0) {
      return { ok: false, lockedPieces: [], won: true, msg: 'Bức tranh đã hoàn thiện!' };
    }
    const toLock = new Set<number>();
    for (const pIdx of chosen) {
      if (this.pieceState[pIdx] === JIGSAW_PIECE_BOARD) {
        for (const m of this.getClusterMembers(pIdx)) toLock.add(m);
      } else {
        toLock.add(pIdx);
      }
    }
    const locked = this.lockPiecesInternal(Array.from(toLock));
    return {
      ok: true,
      lockedPieces: locked,
      won: this.lockedCount >= this.totalPieces,
      msg:
        locked.length > 1
          ? `💡 Bùa Chỉ Điểm đã tự khớp chuẩn ${locked.length} mảnh tranh!`
          : '💡 Bùa Chỉ Điểm đã đặt chuẩn xác 1 mảnh tranh vào khung!',
    };
  }

  public applyPhoenixTalisman(): {
    ok: boolean;
    lockedPieces: number[];
    addedSec: number;
    won: boolean;
    msg: string;
  } {
    if (this.status === 'won') {
      return { ok: false, lockedPieces: [], addedSec: 0, won: true, msg: 'Bức tranh đã hoàn thành!' };
    }
    if (this.talismanUsed) {
      return {
        ok: false,
        lockedPieces: [],
        addedSec: 0,
        won: false,
        msg: 'Bạn đã dùng 🔥 Bùa Phượng Hoàng trong ván này rồi!',
      };
    }
    this.talismanUsed = true;
    const bonusSec = Math.min(900, Math.max(180, Math.round(this.timeLimitSec * 0.25)));
    const prevSec = this.timeRemainingSec;
    this.addBonusTime(bonusSec);
    const addedSec = Math.round(this.timeRemainingSec - prevSec);

    const burstCount = Math.max(3, Math.min(25, Math.ceil(this.totalPieces * 0.04)));
    const chosen = this.pickPriorityUnlockedPieces(burstCount);
    const toLock = new Set<number>();
    for (const idx of chosen) {
      if (this.pieceState[idx] === JIGSAW_PIECE_BOARD) {
        for (const m of this.getClusterMembers(idx)) toLock.add(m);
      } else {
        toLock.add(idx);
      }
    }
    const locked = this.lockPiecesInternal(Array.from(toLock));
    const minsLabel = addedSec >= 60 ? `+${Math.round(addedSec / 60)} phút` : `+${addedSec}s`;
    return {
      ok: true,
      lockedPieces: locked,
      addedSec,
      won: this.lockedCount >= this.totalPieces,
      msg: `🔥 Lửa Phượng Hoàng phục chế ${locked.length} mảnh tranh & tiếp sức ${minsLabel}!`,
    };
  }

  public applyApplePieBoost(): {
    addedSec: number;
    lockedPieces: number[];
    won: boolean;
  } {
    const bonusSec = Math.min(300, Math.max(45, Math.round(this.timeLimitSec * 0.1)));
    const prevSec = this.timeRemainingSec;
    this.addBonusTime(bonusSec);
    this.freeHintsLeft += 1;
    const chosen = this.pickPriorityUnlockedPieces(this.totalPieces >= 200 ? 4 : 2);
    const locked = this.lockPiecesInternal(chosen);
    return {
      addedSec: Math.round(this.timeRemainingSec - prevSec),
      lockedPieces: locked,
      won: this.status === 'won',
    };
  }

  public getTurningPointReview(): TurningPointReview | null {
    const edgeLabel = this.firstEdgeCompletedSec !== null
      ? `Khung viền xong ở ${Math.floor(this.firstEdgeCompletedSec / 60)}p${String(this.firstEdgeCompletedSec % 60).padStart(2, '0')}s`
      : 'Chưa khép kín khung viền ngoài';
    return {
      mode: 'jigsaw',
      plyNumber: Math.max(1, this.movesCount),
      outcomeTagVi: this.status === 'won' ? 'Phục Chế Tuyệt Tác' : 'Mẹo Ghép Màn Lớn',
      playedCoordVi: `${this.lockedCount}/${this.totalPieces} mảnh (${edgeLabel})`,
      recommendedCoordVi: 'Lọc 🔲 Mảnh Viền & tách 2 ngón phóng to 300–600%',
      summaryVi:
        'Ghép kín khung viền 4 cạnh trước, sau đó chuyển bộ lọc 🧭 4 Góc Phần Tư và chụm/tách 2 ngón phóng to để khớp cụm nhanh gấp đôi.',
      highlightCells: [],
    };
  }

  // --------------------------------------------------------------------------
  // LƯU & KHÔI PHỤC PHIÊN CHƠI SIÊU GỌN (< 1.5 KB CHO CẢ 2.000 MẢNH)
  // --------------------------------------------------------------------------

  public exportSession(extra?: {
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedJigsawSession {
    this.enforceLooseClusterCap();
    const placedBitsetB64 = encodeBitsetBase64(this.pieceState, JIGSAW_PIECE_LOCKED);
    const clusters = this.getBoardClustersSortedByZ(true);
    const looseClusters: Array<[number, number, number, number[]]> = clusters
      .slice(0, JIGSAW_MAX_LOOSE_CLUSTERS)
      .map((cl) => [
        cl.root,
        Math.round(this.clusterDeltaX[cl.root] * 10000),
        Math.round(this.clusterDeltaY[cl.root] * 10000),
        cl.members,
      ]);

    return {
      stage: this.stage,
      seed: this.seed,
      rows: this.rows,
      cols: this.cols,
      timeLimitSec: this.timeLimitSec,
      timeRemainingSec: Math.round(this.timeRemainingSec * 10) / 10,
      placedBitsetB64,
      looseClusters,
      trayFilter: this.trayFilter,
      movesCount: this.movesCount,
      combo: this.combo,
      maxCombo: this.maxCombo,
      score: this.score,
      freeHintsLeft: this.freeHintsLeft,
      paidHintsLeft: this.paidHintsLeft,
      talismanUsed: this.talismanUsed,
      lossReason: this.lossReason,
      status: this.status === 'lost' ? 'lost' : 'playing',
      companionCharge: extra?.companionCharge,
      snackPieUsed: extra?.snackPieUsed,
      savedAt: Date.now(),
    };
  }

  public restoreSession(saved: SavedJigsawSession | null | undefined): boolean {
    if (!saved || saved.stage !== this.stage) return false;
    if (saved.rows !== this.rows || saved.cols !== this.cols) return false;
    const lockedFlags = decodeBitsetBase64(saved.placedBitsetB64, this.totalPieces);
    if (!lockedFlags) return false;

    this.pieceState.fill(JIGSAW_PIECE_TRAY);
    this.clusterDeltaX.fill(0);
    this.clusterDeltaY.fill(0);
    for (let i = 0; i < this.totalPieces; i++) {
      this.ufParent[i] = i;
      this.ufSize[i] = 1;
      this.clusterZ[i] = 1;
    }

    let locked = 0;
    for (let i = 0; i < this.totalPieces; i++) {
      if (lockedFlags[i] === 1) {
        this.pieceState[i] = JIGSAW_PIECE_LOCKED;
        locked += 1;
      }
    }
    this.lockedCount = locked;

    if (Array.isArray(saved.looseClusters)) {
      let zCounter = 10;
      for (const tuple of saved.looseClusters.slice(0, JIGSAW_MAX_LOOSE_CLUSTERS)) {
        if (!Array.isArray(tuple) || tuple.length < 4 || !Array.isArray(tuple[3])) continue;
        const validMembers = tuple[3].filter(
          (idx): idx is number =>
            typeof idx === 'number' &&
            Number.isInteger(idx) &&
            idx >= 0 &&
            idx < this.totalPieces &&
            this.pieceState[idx] === JIGSAW_PIECE_TRAY
        );
        if (validMembers.length === 0) continue;
        const root = validMembers[0];
        const dx = Math.max(-1.2, Math.min(1.2, Number(tuple[1] || 0) / 10000));
        const dy = Math.max(-1.2, Math.min(1.2, Number(tuple[2] || 0) / 10000));
        for (const m of validMembers) {
          this.pieceState[m] = JIGSAW_PIECE_BOARD;
          this.ufParent[m] = root;
        }
        this.ufSize[root] = validMembers.length;
        this.clusterDeltaX[root] = dx;
        this.clusterDeltaY[root] = dy;
        this.clusterZ[root] = ++zCounter;
        this.nextZ = zCounter + 1;
      }
    }

    this.timeLimitSec = Math.max(
      JIGSAW_MIN_TIME_SEC,
      Math.min(JIGSAW_MAX_TIME_SEC, Math.round(saved.timeLimitSec || this.spec.timeLimitSec))
    );
    this.timeRemainingSec = Math.max(
      0,
      Math.min(this.timeLimitSec, Number(saved.timeRemainingSec ?? this.timeLimitSec))
    );
    const validFilters: readonly JigsawTrayFilter[] = ['all', 'edges', 'q0', 'q1', 'q2', 'q3'];
    this.trayFilter = validFilters.includes(saved.trayFilter) ? saved.trayFilter : 'all';
    this.movesCount = Math.max(0, Math.round(saved.movesCount || 0));
    this.combo = Math.max(0, Math.round(saved.combo || 0));
    this.maxCombo = Math.max(this.combo, Math.round(saved.maxCombo || 0));
    this.score = Math.max(0, Math.round(saved.score || 0));
    this.freeHintsLeft = Math.max(0, Math.min(20, Math.round(saved.freeHintsLeft ?? 1)));
    this.paidHintsLeft = Math.max(0, Math.min(20, Math.round(saved.paidHintsLeft ?? 3)));
    this.talismanUsed = Boolean(saved.talismanUsed);

    if (this.lockedCount >= this.totalPieces) {
      // Phiên thắng dở chưa kịp đóng: trả false để khởi tạo màn mới sạch sẽ
      return false;
    }
    if (saved.status === 'lost' || this.timeRemainingSec <= 0) {
      this.timeRemainingSec = 0;
      this.status = 'lost';
      this.lossReason = 'timeout';
    } else {
      this.status = 'playing';
      this.lossReason = null;
    }
    return true;
  }
}

// ============================================================================
// BỘ BAKE OFFSCREEN ATLAS 1 LẦN & LAYER MẶT BÀN TĨNH 60 FPS (CHUẨN iOS 16+)
// ============================================================================

export function createJigsawAtlasBakeCache(
  engine: MasterJigsawEngine,
  assets?: JigsawArtAssetProvider,
  targetBoardAspect?: number
): JigsawAtlasBakeCache | null {
  if (typeof document === 'undefined') return null;
  const metrics = computeAtlasMetrics(engine.rows, engine.cols, targetBoardAspect);

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = metrics.sourceW;
  sourceCanvas.height = metrics.sourceH;
  const srcCtx = sourceCanvas.getContext('2d');
  if (!srcCtx) return null;

  const { waitingOnExternalImage } = renderJigsawStagePainting(
    srcCtx,
    metrics.sourceW,
    metrics.sourceH,
    engine.stage,
    assets
  );

  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = metrics.atlasW;
  atlasCanvas.height = metrics.atlasH;

  // Kích thước mặt bàn tĩnh giữ <= 1280×1024 đúng tỷ lệ khung tranh thực tế
  const boardAspect = metrics.boardAspect;
  let lockedW = Math.min(JIGSAW_LOCKED_CANVAS_MAX_W, Math.max(480, engine.cols * metrics.cellW));
  let lockedH = Math.round(lockedW / boardAspect);
  if (lockedH > JIGSAW_LOCKED_CANVAS_MAX_H) {
    lockedH = JIGSAW_LOCKED_CANVAS_MAX_H;
    lockedW = Math.round(lockedH * boardAspect);
  }
  const lockedCanvas = document.createElement('canvas');
  lockedCanvas.width = Math.max(64, lockedW);
  lockedCanvas.height = Math.max(64, lockedH);

  return {
    stage: engine.stage,
    rows: engine.rows,
    cols: engine.cols,
    boardAspect,
    sourceCanvas,
    atlasCanvas,
    lockedCanvas,
    metrics,
    bakedPiecesCount: 0,
    lockedStampedFlags: new Uint8Array(engine.totalPieces),
    waitingOnExternalImage,
  };
}

/**
 * Cắt khắc theo lô (`batchSize` mảnh mỗi nhịp rAF) lên 1 `atlasCanvas` duy nhất để màn 2.000 mảnh
 * không bao giờ làm khựng luồng giao diện.
 */
export function stepJigsawAtlasBake(
  cache: JigsawAtlasBakeCache,
  engine: MasterJigsawEngine,
  batchSize = 280
): boolean {
  if (cache.bakedPiecesCount >= engine.totalPieces) return true;
  const ctx = cache.atlasCanvas.getContext('2d');
  if (!ctx) return true;

  const { strideW, strideH, cellW, cellH, padX, padY, sourceW, sourceH } = cache.metrics;
  const srcCellW = sourceW / engine.cols;
  const srcCellH = sourceH / engine.rows;
  const srcScaleX = cellW / srcCellW;
  const srcScaleY = cellH / srcCellH;

  const endIdx = Math.min(engine.totalPieces, cache.bakedPiecesCount + Math.max(1, batchSize));
  for (let idx = cache.bakedPiecesCount; idx < endIdx; idx++) {
    const r = Math.floor(idx / engine.cols);
    const c = idx % engine.cols;
    const edges = engine.getPieceEdges(idx);
    const ox = c * strideW + padX;
    const oy = r * strideH + padY;

    ctx.save();
    traceJigsawPiecePath(ctx, ox, oy, cellW, cellH, edges.top, edges.right, edges.bottom, edges.left);
    ctx.clip();

    // Lấy vùng ảnh nguồn mở rộng phủ trọn phần tai lồi (tab) ở cả 4 phía
    const srcX = Math.max(0, c * srcCellW - padX / srcScaleX);
    const srcY = Math.max(0, r * srcCellH - padY / srcScaleY);
    const srcRight = Math.min(sourceW, (c + 1) * srcCellW + padX / srcScaleX);
    const srcBottom = Math.min(sourceH, (r + 1) * srcCellH + padY / srcScaleY);
    const dstX = ox - (c * srcCellW - srcX) * srcScaleX;
    const dstY = oy - (r * srcCellH - srcY) * srcScaleY;
    const dstW = (srcRight - srcX) * srcScaleX;
    const dstH = (srcBottom - srcY) * srcScaleY;

    ctx.drawImage(cache.sourceCanvas, srcX, srcY, srcRight - srcX, srcBottom - srcY, dstX, dstY, dstW, dstH);
    ctx.restore();

    // Viền gỗ vát sáng ấm cực mảnh giúp nhận biết ranh giới mảnh rõ ràng khi kéo
    ctx.save();
    traceJigsawPiecePath(ctx, ox, oy, cellW, cellH, edges.top, edges.right, edges.bottom, edges.left);
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.42)';
    ctx.lineWidth = Math.max(0.75, Math.min(1.5, cellW * 0.035));
    ctx.stroke();
    ctx.strokeStyle = 'rgba(41, 29, 20, 0.58)';
    ctx.lineWidth = Math.max(0.6, Math.min(1.2, cellW * 0.026));
    ctx.stroke();
    ctx.restore();
  }

  cache.bakedPiecesCount = endIdx;
  return cache.bakedPiecesCount >= engine.totalPieces;
}

/**
 * Đồng bộ các mảnh đã `LOCKED` vào `lockedCanvas` tĩnh — mỗi khung hình 60 FPS chỉ cần 1 lệnh `drawImage(lockedCanvas)`.
 */
export function syncLockedPiecesToLayer(
  cache: JigsawAtlasBakeCache,
  engine: MasterJigsawEngine
): void {
  if (cache.bakedPiecesCount < engine.totalPieces) return;
  const ctx = cache.lockedCanvas.getContext('2d');
  if (!ctx) return;

  const { strideW, strideH, cellW, cellH, padX, padY } = cache.metrics;
  const dstCellW = cache.lockedCanvas.width / engine.cols;
  const dstCellH = cache.lockedCanvas.height / engine.rows;
  const dstPadX = (padX / cellW) * dstCellW;
  const dstPadY = (padY / cellH) * dstCellH;

  for (let idx = 0; idx < engine.totalPieces; idx++) {
    if (engine.pieceState[idx] !== JIGSAW_PIECE_LOCKED) continue;
    if (cache.lockedStampedFlags[idx] === 1) continue;
    cache.lockedStampedFlags[idx] = 1;

    const r = Math.floor(idx / engine.cols);
    const c = idx % engine.cols;
    ctx.drawImage(
      cache.atlasCanvas,
      c * strideW,
      r * strideH,
      strideW,
      strideH,
      c * dstCellW - dstPadX,
      r * dstCellH - dstPadY,
      dstCellW + dstPadX * 2,
      dstCellH + dstPadY * 2
    );
  }
}

export function sanitizeSavedJigsawSession(
  raw: unknown,
  expectedStage: number
): SavedJigsawSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const stage = Math.round(Number(obj.stage) || 0);
  if (stage !== expectedStage || stage < 1 || stage > MAX_MINIGAME_STAGE) return null;

  const spec = getJigsawStageSpec(stage);
  const rows = Math.round(Number(obj.rows) || 0);
  const cols = Math.round(Number(obj.cols) || 0);
  if (rows !== spec.rows || cols !== spec.cols) return null;
  if (typeof obj.placedBitsetB64 !== 'string' || obj.placedBitsetB64.length > 600) return null;

  const totalPieces = rows * cols;
  if (!decodeBitsetBase64(obj.placedBitsetB64, totalPieces)) return null;

  const validFilters: readonly JigsawTrayFilter[] = ['all', 'edges', 'q0', 'q1', 'q2', 'q3'];
  const trayFilter = validFilters.includes(obj.trayFilter as JigsawTrayFilter)
    ? (obj.trayFilter as JigsawTrayFilter)
    : 'all';

  const looseClusters: Array<[number, number, number, number[]]> = [];
  if (Array.isArray(obj.looseClusters)) {
    for (const item of obj.looseClusters.slice(0, JIGSAW_MAX_LOOSE_CLUSTERS)) {
      if (!Array.isArray(item) || item.length < 4 || !Array.isArray(item[3])) continue;
      const members = item[3]
        .filter((m): m is number => typeof m === 'number' && Number.isInteger(m) && m >= 0 && m < totalPieces)
        .slice(0, totalPieces);
      if (members.length === 0) continue;
      looseClusters.push([
        Math.max(0, Math.min(totalPieces - 1, Math.round(Number(item[0]) || members[0]))),
        Math.max(-12000, Math.min(12000, Math.round(Number(item[1]) || 0))),
        Math.max(-12000, Math.min(12000, Math.round(Number(item[2]) || 0))),
        members,
      ]);
    }
  }

  return {
    stage,
    seed: Number(obj.seed) >>> 0,
    rows,
    cols,
    timeLimitSec: spec.timeLimitSec,
    timeRemainingSec: Math.max(0, Math.min(spec.timeLimitSec, Number(obj.timeRemainingSec ?? spec.timeLimitSec))),
    placedBitsetB64: obj.placedBitsetB64,
    looseClusters,
    trayFilter,
    movesCount: Math.max(0, Math.min(999999, Math.round(Number(obj.movesCount) || 0))),
    combo: Math.max(0, Math.min(9999, Math.round(Number(obj.combo) || 0))),
    maxCombo: Math.max(0, Math.min(9999, Math.round(Number(obj.maxCombo) || 0))),
    score: Math.max(0, Math.min(99999999, Math.round(Number(obj.score) || 0))),
    freeHintsLeft: Math.max(0, Math.min(20, Math.round(Number(obj.freeHintsLeft ?? 1)))),
    paidHintsLeft: Math.max(0, Math.min(20, Math.round(Number(obj.paidHintsLeft ?? 3)))),
    talismanUsed: Boolean(obj.talismanUsed),
    lossReason: obj.lossReason === 'timeout' ? 'timeout' : null,
    status: obj.status === 'lost' ? 'lost' : 'playing',
    companionCharge:
      typeof obj.companionCharge === 'number' && Number.isFinite(obj.companionCharge)
        ? Math.max(0, Math.min(50, Math.round(obj.companionCharge)))
        : undefined,
    snackPieUsed: Boolean(obj.snackPieUsed),
    savedAt: Math.max(0, Math.round(Number(obj.savedAt) || Date.now())),
  };
}

export { getJigsawStageArtworkSpec, renderJigsawStagePainting };
export type { JigsawArtAssetProvider, JigsawStageArtworkSpec };
