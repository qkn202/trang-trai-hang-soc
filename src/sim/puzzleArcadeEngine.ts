import { EXTRA_CHESS_TACTICS } from '../data/chessTacticsPack';
import {
  MAX_MINIGAME_STAGE,
  MilestoneBossMeta,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
} from '../data/match3Levels';
import { PuzzleArcadeMode, PuzzleArcadeState } from '../types/game';

export interface TurningPointReview {
  mode: 'caro' | 'chess' | 'blocks';
  plyNumber: number;
  outcomeTagVi: string;
  playedCoordVi: string;
  recommendedCoordVi: string;
  summaryVi: string;
  highlightCells: Array<{ r: number; c: number; role: 'played' | 'best' }>;
}

export interface PuzzleRewardSpec {
  stars: number;
  sand: number;
  gold: number;
  xp: number;
  paintingId?: string;
  isMasterpiece?: boolean;
}

export function isArcadeSubModeLocked(stage: number): boolean {
  return Math.floor(stage) > 10;
}

export function createInitialPuzzleArcadeState(): PuzzleArcadeState {
  return {
    activeMode: 'caro',
    sudokuStage: 1,
    caroStage: 1,
    chessStage: 1,
    jigsawStage: 1,
    blockStage: 1,
    tileStage: 1,
    sudokuCleared: 0,
    caroCleared: 0,
    chessCleared: 0,
    blockCleared: 0,
    featuredWinsCount: 0,
    restoredPaintings: [],
    totalPuzzlesSolved: 0,
  };
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================================
// 1. GHÉP TRANH MẢNH KHỚP JIGSAW (3x3, 4x4, 5x5 INTERLOCKING HOGWARTS PAINTINGS)
// ============================================================================

export interface JigsawPaintingDef {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  accentColor: string;
}

export const JIGSAW_PAINTINGS: JigsawPaintingDef[] = [
  {
    id: 'p1_hogwarts_express',
    title: 'Tàu Tốc Hành Qua Cầu Đá Hoàng Hôn',
    subtitle: 'Đoàn tàu đỏ thẫm phun khói bụi sao băng qua cầu cạn vùng cao nguyên Scotland.',
    imageUrl: '/paintings/p1_hogwarts_express.jpg',
    accentColor: '#ea580c',
  },
  {
    id: 'p2_great_hall',
    title: 'Đại Sảnh Đường Ngàn Ngọn Nến Bay',
    subtitle: 'Bầu trời đêm đầy sao được phù phép trên vòm trần bên dưới hàng trăm ngọn nến lơ lửng.',
    imageUrl: '/paintings/p2_great_hall.jpg',
    accentColor: '#eab308',
  },
  {
    id: 'p3_hogsmeade_snow',
    title: 'Làng Tuyết Hogsmeade Đêm Đông Ấm Áp',
    subtitle: 'Ánh đèn lồng vàng óng hắt lên con phố đá cuội phủ tuyết trắng trước tiệm kẹo & đũa phép.',
    imageUrl: '/paintings/p3_hogsmeade_snow.jpg',
    accentColor: '#38bdf8',
  },
  {
    id: 'p4_quidditch_snitch',
    title: 'Đấu Trường Quidditch & Trái Snitch Vàng',
    subtitle: 'Cuộc rượt đuổi ngoạn mục giữa các tòa tháp cờ hiệu 4 Nhà rực rỡ nắng vàng.',
    imageUrl: '/paintings/p4_quidditch_snitch.jpg',
    accentColor: '#10b981',
  },
  {
    id: 'p5_unicorn_lake',
    title: 'Độc Giác Thú Bạc Bên Hồ Rừng Cấm',
    subtitle: ' Sinh vật thuần khiết tỏa hào quang lam ngọc giữa thảm nấm phát sáng huyền ảo.',
    imageUrl: '/paintings/p5_unicorn_lake.jpg',
    accentColor: '#06b6d4',
  },
  {
    id: 'p6_phoenix_astronomy',
    title: 'Phượng Hoàng Lửa Trên Đỉnh Tháp Thiên Văn',
    subtitle: 'Chim bất tử khoe bộ lông đỏ vàng rực cháy bên quả cầu thiên체 bằng đồng cổ.',
    imageUrl: '/paintings/p6_phoenix_astronomy.jpg',
    accentColor: '#f43f5e',
  },
  {
    id: 'p7_gringotts_dragon',
    title: 'Rồng Hoàng Kim Canh Giữ Hầm Báu Vật',
    subtitle: 'Kho vàng Galleon và cúp ngọc lấp lánh dưới ngọn đuốc lam sâu trong lòng đất.',
    imageUrl: '/paintings/p7_gringotts_dragon.jpg',
    accentColor: '#f59e0b',
  },
  {
    id: 'p8_hogwarts_moon',
    title: 'Đại Lâu Đài Hogwarts Dưới Ánh Trăng Tròn',
    subtitle: 'Đoàn thuyền đèn lồng lướt nhẹ trên mặt Hồ Đen phẳng lặng như gương.',
    imageUrl: '/paintings/p8_hogwarts_moon.jpg',
    accentColor: '#8b5cf6',
  },
];

export interface JigsawEdges {
  top: -1 | 0 | 1;
  right: -1 | 0 | 1;
  bottom: -1 | 0 | 1;
  left: -1 | 0 | 1;
}

export interface JigsawPiece {
  id: number;
  row: number;
  col: number;
  edges: JigsawEdges;
  /** Center position in virtual canvas space (692 x 504) */
  x: number;
  y: number;
  placed: boolean;
  zOrder: number;
}

export const JIGSAW_VIRTUAL_W = 692;
export const JIGSAW_VIRTUAL_H = 504;
export const JIGSAW_BOARD_X = 16;
export const JIGSAW_BOARD_Y = 16;
export const JIGSAW_BOARD_SIZE = 472;
export const JIGSAW_TRAY_X = 504;
export const JIGSAW_TRAY_Y = 16;
export const JIGSAW_TRAY_W = 178;
export const JIGSAW_TRAY_H = 472;

export class JigsawPuzzleEngine {
  public readonly stage: number;
  public readonly gridSize: 3 | 4 | 5;
  public readonly painting: JigsawPaintingDef;
  public readonly reward: PuzzleRewardSpec;
  public pieces: JigsawPiece[] = [];
  public showGhostGuide = true;
  public freeHintsLeft = 1;
  public movesCount = 0;
  public status: 'playing' | 'won' = 'playing';
  private nextZ = 10;

  constructor(stage: number) {
    this.stage = Math.max(1, Math.floor(stage));
    const paintIdx = (this.stage - 1) % JIGSAW_PAINTINGS.length;
    this.painting = JIGSAW_PAINTINGS[paintIdx];

    // Smooth difficulty progression: 3x3 -> 4x4 -> 5x5, then cycling 3x3 / 4x4 / 5x5
    if (this.stage <= 2) {
      this.gridSize = 3;
    } else if (this.stage <= 5) {
      this.gridSize = 4;
    } else if (this.stage <= 8) {
      this.gridSize = 5;
    } else {
      const mod = this.stage % 3;
      this.gridSize = mod === 1 ? 3 : mod === 2 ? 4 : 5;
    }

    const stars = this.gridSize === 3 ? 1 : this.gridSize === 4 ? 2 : 3;
    const sand = this.gridSize === 3 ? 1 : this.gridSize === 4 ? 2 : 3;
    const gold = (this.gridSize === 3 ? 70 : this.gridSize === 4 ? 120 : 185) + Math.min(80, this.stage * 4);
    const xp = (this.gridSize === 3 ? 60 : this.gridSize === 4 ? 105 : 160) + Math.min(60, this.stage * 3);

    this.reward = {
      stars,
      sand,
      gold,
      xp,
      paintingId: this.painting.id,
      isMasterpiece: this.gridSize === 5,
    };

    this.buildAndScatterPieces();
  }

  public get cellSize(): number {
    return JIGSAW_BOARD_SIZE / this.gridSize;
  }

  public getTargetCenter(row: number, col: number): { x: number; y: number } {
    const cs = this.cellSize;
    return {
      x: JIGSAW_BOARD_X + (col + 0.5) * cs,
      y: JIGSAW_BOARD_Y + (row + 0.5) * cs,
    };
  }

  private buildAndScatterPieces(): void {
    const rng = mulberry32(this.stage * 7919 + this.gridSize * 131);
    const N = this.gridSize;

    // Generate complementary internal horizontal & vertical tab directions (-1 or +1)
    const hTabs: (-1 | 1)[][] = Array.from({ length: N - 1 }, () =>
      Array.from({ length: N }, () => (rng() < 0.5 ? 1 : -1))
    );
    const vTabs: (-1 | 1)[][] = Array.from({ length: N }, () =>
      Array.from({ length: N - 1 }, () => (rng() < 0.5 ? 1 : -1))
    );

    const rawPieces: JigsawPiece[] = [];
    let id = 1;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const edges: JigsawEdges = {
          top: r === 0 ? 0 : ((-hTabs[r - 1][c]) as -1 | 1),
          bottom: r === N - 1 ? 0 : hTabs[r][c],
          left: c === 0 ? 0 : ((-vTabs[r][c - 1]) as -1 | 1),
          right: c === N - 1 ? 0 : vTabs[r][c],
        };
        rawPieces.push({
          id: id++,
          row: r,
          col: c,
          edges,
          x: 0,
          y: 0,
          placed: false,
          zOrder: id,
        });
      }
    }

    // Shuffle scatter order and arrange neatly across the right-hand Tray grid with organic jitter
    const order = rawPieces.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    const trayCols = N === 3 ? 2 : 3;
    const trayRows = Math.ceil(rawPieces.length / trayCols);
    const slotW = (JIGSAW_TRAY_W - 24) / trayCols;
    const slotH = (JIGSAW_TRAY_H - 74) / Math.max(1, trayRows);

    order.forEach((pieceIdx, slotIdx) => {
      const p = rawPieces[pieceIdx];
      const tc = slotIdx % trayCols;
      const tr = Math.floor(slotIdx / trayCols);
      const jx = (rng() - 0.5) * Math.min(6, slotW * 0.08);
      const jy = (rng() - 0.5) * Math.min(4, slotH * 0.07);
      p.x = JIGSAW_TRAY_X + 12 + (tc + 0.5) * slotW + jx;
      p.y = JIGSAW_TRAY_Y + 56 + (tr + 0.5) * slotH + jy;
      p.zOrder = slotIdx + 1;
    });

    this.nextZ = rawPieces.length + 5;
    this.pieces = rawPieces;
  }

  public get placedCount(): number {
    return this.pieces.filter((p) => p.placed).length;
  }

  public pickPieceAt(vx: number, vy: number): JigsawPiece | null {
    if (this.status !== 'playing') return null;
    const half = this.cellSize * 0.54;
    const candidates = this.pieces
      .filter((p) => !p.placed && Math.abs(vx - p.x) <= half && Math.abs(vy - p.y) <= half)
      .sort((a, b) => b.zOrder - a.zOrder);
    const hit = candidates[0] ?? null;
    if (hit) {
      hit.zOrder = ++this.nextZ;
    }
    return hit;
  }

  public movePiece(pieceId: number, vx: number, vy: number): void {
    const p = this.pieces.find((x) => x.id === pieceId);
    if (!p || p.placed || this.status !== 'playing') return;
    const margin = Math.min(36, this.cellSize * 0.4);
    p.x = Math.max(margin, Math.min(JIGSAW_VIRTUAL_W - margin, vx));
    p.y = Math.max(margin, Math.min(JIGSAW_VIRTUAL_H - margin, vy));
  }

  public tryDropPiece(pieceId: number): { snapped: boolean; won: boolean; targetX: number; targetY: number } {
    const p = this.pieces.find((x) => x.id === pieceId);
    if (!p || p.placed) {
      return { snapped: false, won: this.status === 'won', targetX: 0, targetY: 0 };
    }
    const target = this.getTargetCenter(p.row, p.col);
    const snapDist = Math.max(26, this.cellSize * 0.36);
    const dist = Math.hypot(p.x - target.x, p.y - target.y);
    this.movesCount += 1;

    if (dist <= snapDist) {
      p.x = target.x;
      p.y = target.y;
      p.placed = true;
      p.zOrder = 1;
      if (this.pieces.every((x) => x.placed)) {
        this.status = 'won';
      }
      return { snapped: true, won: this.status === 'won', targetX: target.x, targetY: target.y };
    }

    // Keep unplaced piece neatly inside canvas bounds if dropped outside board
    if (p.x < JIGSAW_TRAY_X && p.x > JIGSAW_BOARD_X + JIGSAW_BOARD_SIZE - 15) {
      p.x = JIGSAW_TRAY_X + 42;
    }
    return { snapped: false, won: false, targetX: target.x, targetY: target.y };
  }

  public tryPlacePieceAtGrid(pieceId: number, row: number, col: number): { snapped: boolean; won: boolean } {
    const p = this.pieces.find((x) => x.id === pieceId);
    if (!p || p.placed || this.status !== 'playing') return { snapped: false, won: false };
    this.movesCount += 1;
    if (p.row === row && p.col === col) {
      const target = this.getTargetCenter(row, col);
      p.x = target.x;
      p.y = target.y;
      p.placed = true;
      p.zOrder = 1;
      if (this.pieces.every((x) => x.placed)) {
        this.status = 'won';
      }
      return { snapped: true, won: this.status === 'won' };
    }
    return { snapped: false, won: false };
  }

  public useMagicHint(): { ok: boolean; piece?: JigsawPiece; won: boolean } {
    if (this.status !== 'playing') return { ok: false, won: true };
    const unplaced = this.pieces.filter((p) => !p.placed);
    if (unplaced.length === 0) return { ok: false, won: true };

    // Prioritize corner pieces first, then border pieces, then interior pieces!
    const N = this.gridSize;
    unplaced.sort((a, b) => {
      const score = (q: JigsawPiece) => {
        const isCorner = (q.row === 0 || q.row === N - 1) && (q.col === 0 || q.col === N - 1);
        const isEdge = q.row === 0 || q.row === N - 1 || q.col === 0 || q.col === N - 1;
        return isCorner ? 0 : isEdge ? 1 : 2;
      };
      return score(a) - score(b);
    });

    const chosen = unplaced[0];
    const target = this.getTargetCenter(chosen.row, chosen.col);
    chosen.x = target.x;
    chosen.y = target.y;
    chosen.placed = true;
    chosen.zOrder = 1;
    if (this.pieces.every((x) => x.placed)) {
      this.status = 'won';
    }
    return { ok: true, piece: chosen, won: this.status === 'won' };
  }
}

// ============================================================================
// 2. XẾP KHỐI LẮP HÌNH BLOCK PUZZLE & TANGRAM (8x8 RUNIC BLAST + BLUEPRINT FIT)
// ============================================================================

export type BlockColorKey = 'ruby' | 'sapphire' | 'emerald' | 'topaz' | 'amethyst' | 'wood';

export interface PolyominoPiece {
  uid: number;
  cells: [number, number][]; // [dr, dc] normalized to min 0,0
  color: BlockColorKey;
  /** Used in Tangram mode: solution anchor on 8x8 board */
  solutionAnchor?: { r: number; c: number };
  /** Used in Tangram mode: current placed anchor on 8x8 board (null if in tray) */
  placedAt?: { r: number; c: number } | null;
  used?: boolean; // Used in Block Blast mode
}

export interface BlueprintTemplate {
  name: string;
  mask: string[]; // 8 strings of length 8 ('#' = mold cell, '.' = outside)
}

const TANGRAM_BLUEPRINTS: BlueprintTemplate[] = [
  {
    name: 'Vạc Độc Dược Cổ Đại (20 ô)',
    mask: [
      '........',
      '..####..',
      '.######.',
      '..####..',
      '..####..',
      '...##...',
      '........',
      '........',
    ],
  },
  {
    name: 'Nón Phân Loại Phép Thuật (21 ô)',
    mask: [
      '........',
      '...##...',
      '...##...',
      '..####..',
      '..####..',
      '.######.',
      '...###..',
      '........',
    ],
  },
  {
    name: 'Cúp Lửa Tam Pháp Thuật (22 ô)',
    mask: [
      '........',
      '.######.',
      '..####..',
      '..####..',
      '...##...',
      '...##...',
      '..####..',
      '........',
    ],
  },
  {
    name: 'Khiên Huy Hiệu Hogwarts (24 ô)',
    mask: [
      '........',
      '.######.',
      '.######.',
      '.######.',
      '..####..',
      '...##...',
      '........',
      '........',
    ],
  },
  {
    name: 'Tháp Nhọn Thiên Văn (24 ô)',
    mask: [
      '...##...',
      '..####..',
      '..####..',
      '..####..',
      '..####..',
      '.######.',
      '........',
      '........',
    ],
  },
  {
    name: 'Đôi Cánh Trái Snitch Vàng (22 ô)',
    mask: [
      '........',
      '#......#',
      '##.##.##',
      '.######.',
      '..####..',
      '...##...',
      '........',
      '........',
    ],
  },
];

const BLAST_SHAPES: [number, number][][] = [
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 0]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 1], [0, 2], [1, 0], [1, 1]],
];

const BLAST_HARD_PENTOMINOES: [number, number][][] = [
  // 1x5 & 5x1 staves
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  // 3x3 big corners (5 cells)
  [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  [[0, 2], [1, 2], [2, 0], [2, 1], [2, 2]],
  // Plus (+), U, T5, Z5
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]],
  // 2x3 heavy block (6 cells)
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
];

const PROCEDURAL_MOLD_TITLES = [
  'Ấn Khắc Phượng Hoàng',
  'Mê Cung Đá Cổ Ngữ',
  'Lăng Kính Tháp Thiên Văn',
  'Bản Khắc Hầm Gringotts',
  'Phù Hiệu Tam Pháp Thuật',
  'Trận Đồ Đá Hộ Mệnh',
  ' Mạch Tinh Thể Rừng Cấm',
  'Vương Miện Ravenclaw Cổ',
];

const BLOCK_COLORS: BlockColorKey[] = ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'wood'];

export const BLOCK_BOARD_SIZE = 8;

export class RunicBlockPuzzleEngine {
  public readonly stage: number;
  public readonly subMode: 'tangram' | 'blast';
  public readonly subModeLocked: boolean;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly title: string;
  public readonly reward: PuzzleRewardSpec;
  public readonly assistGoldCost: number;

  /** 8x8 grid: null = empty, BlockColorKey = occupied */
  public grid: (BlockColorKey | null)[][] = [];
  /** For Tangram: true = inside blueprint mold */
  public moldMask: boolean[][] = [];
  /** For Blast: rune stones pre-placed on board */
  public runeMask: boolean[][] = [];
  /** Remaining blast hits required per rune stone (1 = standard gold seal, 2 = 2-layer obsidian seal on stage >= 140) */
  public runeLayers: number[][] = [];
  public obsidianRunesCount = 0;

  public pieces: PolyominoPiece[] = [];
  public linesCleared = 0;
  public targetLines = 0;
  public runesCleared = 0;
  public totalRunes = 0;
  public score = 0;
  public freeHelpsLeft: number;
  public paidHelpsLeft: number;
  public talismanUsed = false;
  public status: 'playing' | 'won' | 'stuck' = 'playing';
  public clearedCellsVfx: { r: number; c: number; color: BlockColorKey }[] = [];

  private rng: () => number;
  private nextUid = 1;

  constructor(stage: number, forceSubMode?: 'tangram' | 'blast') {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    this.rng = mulberry32(this.stage * 104729 + 57);
    const defaultSubMode: 'tangram' | 'blast' = this.stage % 2 === 1 ? 'tangram' : 'blast';
    this.subModeLocked = isArcadeSubModeLocked(this.stage);
    this.subMode = this.subModeLocked ? defaultSubMode : (forceSubMode ?? defaultSubMode);

    const tier = getMinigameDifficultyTier(this.stage);
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    this.difficultyLabel = this.milestoneBoss
      ? `👑 Đại Trùm Mốc ${this.stage}`
      : `${tier.badgeEmoji} ${tier.label}`;
    this.freeHelpsLeft = this.stage <= 12 ? 1 : 0;
    this.paidHelpsLeft = this.stage <= 60 ? 2 : 1;
    this.assistGoldCost = Math.min(260, 85 + Math.floor(this.stage / 6));

    const stars = getStageStarReward(this.stage);
    const effectiveCap = Math.min(this.stage, 260) + Math.floor(Math.max(0, this.stage - 260) * 0.35);
    this.reward = {
      stars,
      sand: this.stage === MAX_MINIGAME_STAGE ? 5 : this.milestoneBoss || this.stage % 10 === 0 ? 2 : 1,
      gold: Math.round(75 + effectiveCap * 3.8 + stars * 18),
      xp: Math.round(55 + effectiveCap * 2.8 + stars * 12),
      isMasterpiece: Boolean(this.milestoneBoss) || this.stage % 10 === 0 || this.stage === MAX_MINIGAME_STAGE,
    };

    this.grid = Array.from({ length: BLOCK_BOARD_SIZE }, () =>
      Array.from({ length: BLOCK_BOARD_SIZE }, () => null)
    );
    this.moldMask = Array.from({ length: BLOCK_BOARD_SIZE }, () =>
      Array.from({ length: BLOCK_BOARD_SIZE }, () => true)
    );
    this.runeMask = Array.from({ length: BLOCK_BOARD_SIZE }, () =>
      Array.from({ length: BLOCK_BOARD_SIZE }, () => false)
    );
    this.runeLayers = Array.from({ length: BLOCK_BOARD_SIZE }, () =>
      Array.from({ length: BLOCK_BOARD_SIZE }, () => 0)
    );

    if (this.subMode === 'tangram') {
      if (this.stage <= 15) {
        const bp = TANGRAM_BLUEPRINTS[Math.floor((this.stage - 1) / 2) % TANGRAM_BLUEPRINTS.length];
        this.title = `Khuôn Ấn Cổ Ngữ: ${bp.name}`;
        this.initTangramBlueprint(bp);
      } else {
        const bp = this.generateProceduralTangramMold();
        this.title = this.milestoneBoss
          ? `👑 ${this.milestoneBoss.bossTitleVi} • ${bp.name}`
          : `Khuôn Đá Runes: ${bp.name}`;
        this.initTangramBlueprint(bp);
      }
    } else {
      this.targetLines =
        this.stage <= 20
          ? 5 + Math.floor(this.stage / 4)
          : this.stage <= 100
            ? 10 + Math.floor((this.stage - 20) / 10)
            : this.stage <= 320
              ? 18 + Math.floor((this.stage - 100) / 24)
              : this.stage <= 580
                ? 27 + Math.floor((this.stage - 320) / 34)
                : Math.min(40, 35 + Math.floor((this.stage - 580) / 40));
      this.initBlockBlastStage();
      const baseBlastTitle =
        this.obsidianRunesCount > 0
          ? `Phá Trận Cổ Ngữ (${this.targetLines} Hàng • ${this.obsidianRunesCount} Đá 2 Lớp)`
          : `Phá Trận Cổ Ngữ (${this.targetLines} Hàng/Cột)`;
      this.title = this.milestoneBoss
        ? `👑 ${this.milestoneBoss.bossTitleVi} • ${baseBlastTitle}`
        : baseBlastTitle;
    }
  }

  private generateProceduralTangramMold(): BlueprintTemplate {
    // Grow mold cell count from 26 cells (stage 16) up to 60 cells (stage 700..777)
    const targetCells = Math.min(
      60,
      26 + Math.floor(((this.stage - 16) / (MAX_MINIGAME_STAGE - 16)) * 34)
    );
    const active = Array.from({ length: BLOCK_BOARD_SIZE }, () =>
      Array<boolean>(BLOCK_BOARD_SIZE).fill(false)
    );
    // Start from symmetric 2x2 center core
    const setSym = (r: number, c: number): number => {
      let added = 0;
      for (const cc of [c, BLOCK_BOARD_SIZE - 1 - c]) {
        if (r >= 0 && r < BLOCK_BOARD_SIZE && cc >= 0 && cc < BLOCK_BOARD_SIZE && !active[r][cc]) {
          active[r][cc] = true;
          added++;
        }
      }
      return added;
    };

    let count = 0;
    count += setSym(3, 3);
    count += setSym(4, 3);

    let guard = 0;
    while (count < targetCells && guard < 300) {
      guard++;
      const frontier: Array<[number, number]> = [];
      for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
        for (let c = 0; c < 4; c++) {
          if (active[r][c]) continue;
          const hasNeighbor =
            (r > 0 && active[r - 1][c]) ||
            (r + 1 < BLOCK_BOARD_SIZE && active[r + 1][c]) ||
            (c > 0 && active[r][c - 1]) ||
            active[r][c + 1];
          if (hasNeighbor) frontier.push([r, c]);
        }
      }
      if (frontier.length === 0) break;
      const [pr, pc] = frontier[Math.floor(this.rng() * frontier.length)];
      count += setSym(pr, pc);
    }

    const mask = active.map((row) => row.map((v) => (v ? '#' : '.')).join(''));
    const titleStem = PROCEDURAL_MOLD_TITLES[this.stage % PROCEDURAL_MOLD_TITLES.length].trim();
    return {
      name: `${titleStem} (${count} ô)`,
      mask,
    };
  }

  private initTangramBlueprint(bp: BlueprintTemplate): void {
    const unassigned = new Set<string>();
    for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
      for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
        const inside = bp.mask[r]?.[c] === '#';
        this.moldMask[r][c] = inside;
        if (inside) unassigned.add(`${r},${c}`);
      }
    }

    // Partition mold into connected polyominoes (guaranteed 100% solvable!)
    const generated: PolyominoPiece[] = [];
    let colorIdx = 0;
    const minPieceSize = this.stage >= 240 ? 4 : 3;
    const sizeSpan = this.stage >= 420 ? 3 : 3; // 3..5 early, 4..6 late
    while (unassigned.size > 0) {
      const sortedKeys = Array.from(unassigned).sort((a, b) => {
        const [ar, ac] = a.split(',').map(Number);
        const [br, bc] = b.split(',').map(Number);
        return ar !== br ? ar - br : ac - bc;
      });
      const startKey = sortedKeys[0];
      unassigned.delete(startKey);
      const [sr, sc] = startKey.split(',').map(Number);
      const cluster: [number, number][] = [[sr, sc]];
      const targetSize = minPieceSize + Math.floor(this.rng() * sizeSpan);

      while (cluster.length < targetSize) {
        const frontier: [number, number][] = [];
        for (const [cr, cc] of cluster) {
          for (const [dr, dc] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
          ]) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (unassigned.has(`${nr},${nc}`)) {
              frontier.push([nr, nc]);
            }
          }
        }
        if (frontier.length === 0) break;
        const pick = frontier[Math.floor(this.rng() * frontier.length)];
        unassigned.delete(`${pick[0]},${pick[1]}`);
        cluster.push(pick);
      }

      // Merge 1-cell or 2-cell tiny remnants into adjacent piece so late molds have no trivial 1x1 dots
      const minAllowedCluster = this.stage >= 120 ? 2 : 1;
      if (cluster.length <= minAllowedCluster && generated.length > 0) {
        const neighborPiece = generated.find((gp) =>
          cluster.some(([or, oc]) =>
            gp.cells.some(([dr, dc]) => {
              const gr = (gp.solutionAnchor?.r ?? 0) + dr;
              const gc = (gp.solutionAnchor?.c ?? 0) + dc;
              return Math.abs(gr - or) + Math.abs(gc - oc) === 1;
            })
          )
        );
        if (neighborPiece && neighborPiece.solutionAnchor && neighborPiece.cells.length <= 6) {
          const allGlobal: [number, number][] = [
            ...neighborPiece.cells.map(
              ([dr, dc]) =>
                [neighborPiece.solutionAnchor!.r + dr, neighborPiece.solutionAnchor!.c + dc] as [
                  number,
                  number,
                ]
            ),
            ...cluster,
          ];
          const minR = Math.min(...allGlobal.map((x) => x[0]));
          const minC = Math.min(...allGlobal.map((x) => x[1]));
          neighborPiece.solutionAnchor = { r: minR, c: minC };
          neighborPiece.cells = allGlobal.map(([gr, gc]) => [gr - minR, gc - minC]);
          continue;
        }
      }

      const minR = Math.min(...cluster.map((x) => x[0]));
      const minC = Math.min(...cluster.map((x) => x[1]));
      generated.push({
        uid: this.nextUid++,
        cells: cluster.map(([gr, gc]) => [gr - minR, gc - minC]),
        color: BLOCK_COLORS[colorIdx++ % BLOCK_COLORS.length],
        solutionAnchor: { r: minR, c: minC },
        placedAt: null,
      });
    }

    // Shuffle tray order
    for (let i = generated.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [generated[i], generated[j]] = [generated[j], generated[i]];
    }
    this.pieces = generated;
  }

  private initBlockBlastStage(): void {
    // Scale pre-placed symmetrical rune blocks from 6 (early) up to 22 (stages 500..777)
    const pairs =
      this.stage <= 25
        ? 3 + (this.stage % 2)
        : this.stage <= 150
          ? 5 + (this.stage % 3)
          : this.stage <= 420
            ? 7 + (this.stage % 4)
            : 9 + (this.stage % 3);
    const rowSpan = this.stage >= 120 ? 6 : 4;
    const rowStart = this.stage >= 120 ? 1 : 2;
    let placedPairs = 0;
    let attempts = 0;
    const placedCoords: Array<[number, number]> = [];
    while (placedPairs < pairs && attempts < 80) {
      attempts++;
      const r = rowStart + Math.floor(this.rng() * rowSpan);
      const c = Math.floor(this.rng() * 4);
      const mc = BLOCK_BOARD_SIZE - 1 - c;
      if (this.grid[r][c] !== null) continue;
      // Never pre-fill more than 6 cells in any initial row so rows require player action
      const rowFilled = this.grid[r].filter((v) => v !== null).length;
      if (rowFilled >= 6) continue;
      const col = BLOCK_COLORS[(placedPairs + this.stage) % 5];
      this.grid[r][c] = col;
      this.grid[r][mc] = col;
      this.runeMask[r][c] = true;
      this.runeMask[r][mc] = true;
      this.runeLayers[r][c] = 1;
      this.runeLayers[r][mc] = 1;
      placedCoords.push([r, c]);
      placedPairs++;
    }
    // Stages 140..777 (or Milestone Boss >= 100): Upgrade 1..3 symmetric pairs into 2-Layer Obsidian Rune Seals!
    if ((this.stage >= 140 || (this.milestoneBoss && this.stage >= 100)) && placedCoords.length > 0) {
      const targetObsidianPairs = Math.min(
        placedCoords.length,
        this.stage >= 480 ? 3 : this.stage >= 260 ? 2 : 1
      );
      for (let i = 0; i < targetObsidianPairs; i++) {
        const [or, oc] = placedCoords[i];
        const omc = BLOCK_BOARD_SIZE - 1 - oc;
        this.runeLayers[or][oc] = 2;
        this.runeLayers[or][omc] = 2;
      }
      this.obsidianRunesCount = targetObsidianPairs * 2;
    }
    this.totalRunes = this.runeMask.flat().filter(Boolean).length;
    this.dealBlastHand();
  }

  public dealBlastHand(): void {
    const hand: PolyominoPiece[] = [];
    const hardChance =
      this.stage <= 20
        ? 0
        : this.stage <= 120
          ? 0.16
          : this.stage <= 320
            ? 0.28
            : this.stage <= 550
              ? 0.38
              : 0.46;
    const allPool = this.stage > 20 ? [...BLAST_SHAPES, ...BLAST_HARD_PENTOMINOES] : BLAST_SHAPES;

    for (let i = 0; i < 3; i++) {
      const useHard = this.rng() < hardChance;
      const sourcePool = useHard ? BLAST_HARD_PENTOMINOES : BLAST_SHAPES;
      let shape = sourcePool[Math.floor(this.rng() * sourcePool.length)];
      // Rescue first slot only on early/mid stages (or when board has plenty of open room)
      const occupiedCells = this.grid.flat().filter((x) => x !== null).length;
      if (i === 0 && (this.stage <= 180 || occupiedCells <= 34)) {
        const fitting = allPool.filter((sh) => this.anyPlacementForCells(sh));
        if (fitting.length > 0 && !this.anyPlacementForCells(shape)) {
          shape = fitting[Math.floor(this.rng() * fitting.length)];
        }
      }
      hand.push({
        uid: this.nextUid++,
        cells: shape.map(([r, c]) => [r, c]),
        color: BLOCK_COLORS[Math.floor(this.rng() * BLOCK_COLORS.length)],
        used: false,
      });
    }
    this.pieces = hand;
    this.checkBlastStuckState();
  }

  private anyPlacementForCells(cells: [number, number][]): boolean {
    for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
      for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
        if (this.canPlaceCellsAt(cells, r, c)) return true;
      }
    }
    return false;
  }

  public canPlaceCellsAt(cells: [number, number][], anchorR: number, anchorC: number): boolean {
    for (const [dr, dc] of cells) {
      const r = anchorR + dr;
      const c = anchorC + dc;
      if (r < 0 || r >= BLOCK_BOARD_SIZE || c < 0 || c >= BLOCK_BOARD_SIZE) return false;
      if (!this.moldMask[r][c]) return false;
      if (this.grid[r][c] !== null) return false;
    }
    return true;
  }

  public canPlacePiece(pieceUid: number, anchorR: number, anchorC: number): boolean {
    const p = this.pieces.find((x) => x.uid === pieceUid);
    if (!p || p.used || p.placedAt) return false;
    return this.canPlaceCellsAt(p.cells, anchorR, anchorC);
  }

  public pickupTangramPieceAt(r: number, c: number): PolyominoPiece | null {
    if (this.subMode !== 'tangram' || this.status !== 'playing') return null;
    const found = this.pieces.find(
      (p) =>
        p.placedAt &&
        p.cells.some(([dr, dc]) => p.placedAt!.r + dr === r && p.placedAt!.c + dc === c)
    );
    if (!found || !found.placedAt) return null;
    for (const [dr, dc] of found.cells) {
      this.grid[found.placedAt.r + dr][found.placedAt.c + dc] = null;
    }
    found.placedAt = null;
    return found;
  }

  public placePiece(
    pieceUid: number,
    anchorR: number,
    anchorC: number
  ): { ok: boolean; linesBlasted: number; won: boolean } {
    if (this.status === 'won') return { ok: false, linesBlasted: 0, won: true };
    const p = this.pieces.find((x) => x.uid === pieceUid);
    if (!p || p.used || p.placedAt) return { ok: false, linesBlasted: 0, won: false };
    if (!this.canPlaceCellsAt(p.cells, anchorR, anchorC)) {
      return { ok: false, linesBlasted: 0, won: false };
    }

    for (const [dr, dc] of p.cells) {
      this.grid[anchorR + dr][anchorC + dc] = p.color;
    }
    this.score += p.cells.length * 10;

    if (this.subMode === 'tangram') {
      p.placedAt = { r: anchorR, c: anchorC };
      const allMoldFilled = this.moldMask.every((row, r) =>
        row.every((inside, c) => !inside || this.grid[r][c] !== null)
      );
      if (allMoldFilled) {
        this.status = 'won';
      }
      return { ok: true, linesBlasted: 0, won: this.status === 'won' };
    }

    // Block Blast mode: check completed rows & columns simultaneously!
    p.used = true;
    const fullRows: number[] = [];
    const fullCols: number[] = [];
    for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
      if (this.grid[r].every((cell) => cell !== null)) fullRows.push(r);
    }
    for (let c = 0; c < BLOCK_BOARD_SIZE; c++) {
      let ok = true;
      for (let r = 0; r < BLOCK_BOARD_SIZE; r++) {
        if (this.grid[r][c] === null) {
          ok = false;
          break;
        }
      }
      if (ok) fullCols.push(c);
    }

    const toClear = new Set<string>();
    for (const r of fullRows) {
      for (let c = 0; c < BLOCK_BOARD_SIZE; c++) toClear.add(`${r},${c}`);
    }
    for (const c of fullCols) {
      for (let r = 0; r < BLOCK_BOARD_SIZE; r++) toClear.add(`${r},${c}`);
    }

    const linesBlasted = fullRows.length + fullCols.length;
    if (linesBlasted > 0) {
      for (const key of toClear) {
        const [cr, cc] = key.split(',').map(Number);
        const oldCol = this.grid[cr][cc] ?? 'topaz';
        this.clearedCellsVfx.push({ r: cr, c: cc, color: oldCol });
        if (this.runeMask[cr][cc] && (this.runeLayers[cr]?.[cc] ?? 1) > 1) {
          // 2-Layer Obsidian Seal cracks down to 1 layer and remains on board for a 2nd line blast!
          this.runeLayers[cr][cc] -= 1;
          this.grid[cr][cc] = 'amethyst';
        } else {
          this.grid[cr][cc] = null;
          if (this.runeLayers[cr]) this.runeLayers[cr][cc] = 0;
          if (this.runeMask[cr][cc]) {
            this.runeMask[cr][cc] = false;
            this.runesCleared += 1;
          }
        }
      }
      this.linesCleared += linesBlasted;
      this.score += linesBlasted * 120 * linesBlasted;
    }

    if (this.linesCleared >= this.targetLines && this.runesCleared >= this.totalRunes) {
      this.status = 'won';
      return { ok: true, linesBlasted, won: true };
    }

    if (this.pieces.every((hp) => hp.used)) {
      this.dealBlastHand();
    } else {
      this.checkBlastStuckState();
    }

    return { ok: true, linesBlasted, won: false };
  }

  private checkBlastStuckState(): void {
    if (this.subMode !== 'blast' || this.status === 'won') return;
    const avail = this.pieces.filter((p) => !p.used);
    const anyFits = avail.some((p) => this.anyPlacementForCells(p.cells));
    this.status = anyFits ? 'playing' : 'stuck';
  }

  public useMagicAssist(): { ok: boolean; won: boolean; msg: string } {
    if (this.status === 'won') return { ok: false, won: true, msg: 'Đã thắng màn!' };

    if (this.subMode === 'tangram') {
      // Auto-place 1 unplaced (or wrongly placed) piece into its exact true solutionAnchor!
      const targetPiece = this.pieces.find(
        (p) =>
          !p.placedAt ||
          p.placedAt.r !== p.solutionAnchor?.r ||
          p.placedAt.c !== p.solutionAnchor?.c
      );
      if (!targetPiece || !targetPiece.solutionAnchor) {
        return { ok: false, won: false, msg: 'Tất cả khối đã nằm đúng vị trí!' };
      }

      // Lift targetPiece if placed wrongly
      if (targetPiece.placedAt) {
        for (const [dr, dc] of targetPiece.cells) {
          this.grid[targetPiece.placedAt.r + dr][targetPiece.placedAt.c + dc] = null;
        }
        targetPiece.placedAt = null;
      }

      // Lift any other piece currently overlapping targetPiece's solution cells
      const { r: sr, c: sc } = targetPiece.solutionAnchor;
      for (const [dr, dc] of targetPiece.cells) {
        const occ = this.pickupTangramPieceAt(sr + dr, sc + dc);
        void occ;
      }

      const res = this.placePiece(targetPiece.uid, sr, sc);
      return {
        ok: res.ok,
        won: res.won,
        msg: '🪄 Đã lắp tự động 1 khối cổ ngữ vào đúng khuôn bản vẽ!',
      };
    }

    // Blast mode: clear central 4x4 area + deal fresh playable 3-piece hand!
    for (let r = 2; r <= 5; r++) {
      for (let c = 2; c <= 5; c++) {
        if (this.grid[r][c] !== null) {
          this.clearedCellsVfx.push({ r, c, color: this.grid[r][c]! });
          this.grid[r][c] = null;
          this.runeLayers[r][c] = 0;
          if (this.runeMask[r][c]) {
            this.runeMask[r][c] = false;
            this.runesCleared += 1;
          }
        }
      }
    }
    this.linesCleared += 1;
    this.status = 'playing';
    if (this.linesCleared >= this.targetLines && this.runesCleared >= this.totalRunes) {
      this.status = 'won';
      return { ok: true, won: true, msg: '⚡ Tia sét cổ ngữ đã hoàn tất mục tiêu màn!' };
    }
    this.dealBlastHand();
    return {
      ok: true,
      won: false,
      msg: '⚡ Đã dọn vùng 4×4 giữa bàn & cấp 3 khối cổ ngữ mới!',
    };
  }

  public applyPhoenixTalisman(): { ok: boolean; won: boolean; msg: string } {
    if (this.talismanUsed || this.status === 'won') {
      return {
        ok: false,
        won: this.status === 'won',
        msg: 'Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!',
      };
    }

    if (this.subMode === 'tangram') {
      let placedCount = 0;
      let tangramWon = false;
      for (let step = 0; step < 2; step++) {
        const targetPiece = this.pieces.find(
          (p) =>
            !p.placedAt ||
            p.placedAt.r !== p.solutionAnchor?.r ||
            p.placedAt.c !== p.solutionAnchor?.c
        );
        if (!targetPiece || !targetPiece.solutionAnchor) break;

        if (targetPiece.placedAt) {
          for (const [dr, dc] of targetPiece.cells) {
            this.grid[targetPiece.placedAt.r + dr][targetPiece.placedAt.c + dc] = null;
          }
          targetPiece.placedAt = null;
        }

        const { r: sr, c: sc } = targetPiece.solutionAnchor;
        for (const [dr, dc] of targetPiece.cells) {
          const occ = this.pickupTangramPieceAt(sr + dr, sc + dc);
          void occ;
        }

        const res = this.placePiece(targetPiece.uid, sr, sc);
        if (res.ok) placedCount++;
        if (res.won) {
          tangramWon = true;
          break;
        }
      }

      if (placedCount === 0) {
        return { ok: false, won: false, msg: 'Tất cả khối cổ ngữ đã nằm đúng vị trí!' };
      }
      this.talismanUsed = true;
      return {
        ok: true,
        won: tangramWon,
        msg: `🔥 Lửa Phượng Hoàng đã lắp chuẩn ${placedCount} khối cổ ngữ vào khuôn bản vẽ!`,
      };
    }

    // Blast 8x8: Cross-blast rows 3..4 and cols 3..4 through all obsidian rune layers + revive stuck!
    this.talismanUsed = true;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r === 3 || r === 4 || c === 3 || c === 4) {
          if (this.grid[r][c] !== null) {
            this.clearedCellsVfx.push({ r, c, color: this.grid[r][c]! });
            this.grid[r][c] = null;
          }
          this.runeLayers[r][c] = 0;
          if (this.runeMask[r][c]) {
            this.runeMask[r][c] = false;
            this.runesCleared += 1;
          }
        }
      }
    }
    this.linesCleared += 2;
    this.status = 'playing';
    if (this.linesCleared >= this.targetLines && this.runesCleared >= this.totalRunes) {
      this.status = 'won';
      return {
        ok: true,
        won: true,
        msg: '🔥 Bão Lửa Phượng Hoàng quét chữ thập 8×8 và hoàn tất mục tiêu màn!',
      };
    }
    this.dealBlastHand();
    return {
      ok: true,
      won: false,
      msg: '🔥 Bão Lửa Phượng Hoàng đã quét sạch chữ thập trung tâm (+2 hàng) & cấp 3 khối mới!',
    };
  }
}

// ============================================================================
// 3. GHÉP THẺ XẾP CHỒNG 3 Ô (3D LAYERED WIZARDING TILE MATCH / MAHJONG ZEN)
// ============================================================================

export interface TileMatchSymbolDef {
  id: string;
  label: string;
  spriteKey: string;
  accent: string;
}

export const TILE_MATCH_SYMBOLS: TileMatchSymbolDef[] = [
  { id: 'ruby', label: 'Hồng Ngọc', spriteKey: 'm3_gem_ruby', accent: '#ef4444' },
  { id: 'sapphire', label: 'Lam Ngọc', spriteKey: 'm3_gem_sapphire', accent: '#0ea5e9' },
  { id: 'emerald', label: 'Lục Bảo', spriteKey: 'm3_gem_emerald', accent: '#10b981' },
  { id: 'topaz', label: 'Hoàng Ngọc', spriteKey: 'm3_gem_topaz', accent: '#f59e0b' },
  { id: 'amethyst', label: 'Thạch Anh', spriteKey: 'm3_gem_amethyst', accent: '#a855f7' },
  { id: 'candy', label: 'Kẹo Xoáy', spriteKey: 'm3_gem_candy_pink', accent: '#ec4899' },
  { id: 'snitch', label: 'Snitch Vàng', spriteKey: 'm3_sp_snitch', accent: '#eab308' },
  { id: 'scroll', label: 'Cổ Ngữ', spriteKey: 'm3_piece_scroll', accent: '#d97706' },
  { id: 'cauldron', label: 'Vạc Nổ', spriteKey: 'm3_sp_bomb', accent: '#059669' },
  { id: 'rocket', label: 'Pháo Hoa', spriteKey: 'm3_sp_rocket_h', accent: '#f97316' },
];

export interface LayeredTileCard {
  uid: number;
  symbolId: string;
  /** Logical tile-unit coordinates (0..6.5) where 1.0 = 1 full tile width/height */
  gx: number;
  gy: number;
  layer: number; // 0 = bottom, 1, 2, 3 = top
  state: 'board' | 'tray';
}

export const TILE_TRAY_CAPACITY = 7;

export class TileMatchZenEngine {
  public readonly stage: number;
  public readonly reward: PuzzleRewardSpec;
  public tiles: LayeredTileCard[] = [];
  public tray: LayeredTileCard[] = [];
  public undoStack: number[] = [];
  public freeAssistsLeft = 1;
  public status: 'playing' | 'won' | 'tray_full' = 'playing';
  public poppedSymbolVfx: { symbolId: string; slotIdx: number }[] = [];

  private rng: () => number;

  constructor(stage: number) {
    this.stage = Math.max(1, Math.floor(stage));
    this.rng = mulberry32(this.stage * 65537 + 911);

    const diffTier = this.stage % 5 === 0 ? 3 : this.stage >= 3 ? 2 : 1;
    this.reward = {
      stars: diffTier === 3 ? 3 : diffTier === 2 ? 2 : 1,
      sand: diffTier >= 2 ? 2 : 1,
      gold: 75 + diffTier * 30 + Math.min(85, this.stage * 4),
      xp: 60 + diffTier * 25 + Math.min(70, this.stage * 3),
    };

    this.buildLayeredPyramid();
  }

  private buildLayeredPyramid(): void {
    const slots: { gx: number; gy: number; layer: number }[] = [];

    // Layer 0: 4x4 or 5x4 symmetric base
    const baseCols = this.stage <= 2 ? 4 : 5;
    const baseRows = 4;
    const offX0 = (7 - baseCols) * 0.5;
    const offY0 = 0.5;
    for (let r = 0; r < baseRows; r++) {
      for (let c = 0; c < baseCols; c++) {
        slots.push({ gx: offX0 + c, gy: offY0 + r, layer: 0 });
      }
    }

    // Layer 1: Half-offset inner grid ((baseCols-1) x (baseRows-1))
    for (let r = 0; r < baseRows - 1; r++) {
      for (let c = 0; c < baseCols - 1; c++) {
        slots.push({ gx: offX0 + 0.5 + c, gy: offY0 + 0.5 + r, layer: 1 });
      }
    }

    // Layer 2: Central crown (2x2 or 3x2)
    const l2Cols = this.stage <= 2 ? 2 : 3;
    const offX2 = (7 - l2Cols) * 0.5;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < l2Cols; c++) {
        slots.push({ gx: offX2 + c, gy: 1.5 + r, layer: 2 });
      }
    }

    // Layer 3: Capstone cards on top so total count is an exact multiple of 3!
    while (slots.length % 3 !== 0) {
      const rem = slots.length % 3;
      if (rem === 2) {
        slots.push({ gx: 3.0, gy: 2.0, layer: 3 });
      } else {
        slots.push({ gx: 2.5, gy: 2.0, layer: 3 });
        slots.push({ gx: 3.5, gy: 2.0, layer: 3 });
      }
    }

    const totalTriples = slots.length / 3;
    const symbolPoolCount = Math.min(
      TILE_MATCH_SYMBOLS.length,
      this.stage <= 2 ? 6 : this.stage <= 5 ? 8 : 10
    );

    const symbols: string[] = [];
    for (let t = 0; t < totalTriples; t++) {
      const sym = TILE_MATCH_SYMBOLS[t % symbolPoolCount].id;
      symbols.push(sym, sym, sym);
    }

    // Shuffle symbols cleanly with seeded RNG
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }

    this.tiles = slots.map((s, idx) => ({
      uid: idx + 1,
      symbolId: symbols[idx],
      gx: s.gx,
      gy: s.gy,
      layer: s.layer,
      state: 'board',
    }));
  }

  public isTileFree(tile: LayeredTileCard): boolean {
    if (tile.state !== 'board') return false;
    for (const other of this.tiles) {
      if (other.state !== 'board' || other.layer <= tile.layer) continue;
      if (Math.abs(other.gx - tile.gx) < 0.92 && Math.abs(other.gy - tile.gy) < 0.92) {
        return false;
      }
    }
    return true;
  }

  public get boardRemainingCount(): number {
    return this.tiles.filter((t) => t.state === 'board').length;
  }

  public pickTile(uid: number): {
    ok: boolean;
    matchedSymbol?: string;
    won: boolean;
    trayFull: boolean;
  } {
    if (this.status !== 'playing') {
      return { ok: false, won: this.status === 'won', trayFull: this.status === 'tray_full' };
    }
    if (this.tray.length >= TILE_TRAY_CAPACITY) {
      this.status = 'tray_full';
      return { ok: false, won: false, trayFull: true };
    }

    const tile = this.tiles.find((t) => t.uid === uid);
    if (!tile || !this.isTileFree(tile)) {
      return { ok: false, won: false, trayFull: false };
    }

    tile.state = 'tray';
    // Smart-insert right after any existing tile of the same symbolId in the tray!
    let insertIdx = this.tray.length;
    for (let i = this.tray.length - 1; i >= 0; i--) {
      if (this.tray[i].symbolId === tile.symbolId) {
        insertIdx = i + 1;
        break;
      }
    }
    this.tray.splice(insertIdx, 0, tile);
    this.undoStack.push(tile.uid);

    // Check if 3 of tile.symbolId are now in the tray!
    const matching = this.tray.filter((t) => t.symbolId === tile.symbolId);
    let matchedSymbol: string | undefined;
    if (matching.length >= 3) {
      matchedSymbol = tile.symbolId;
      const removeSet = new Set(matching.slice(0, 3).map((t) => t.uid));
      const firstSlot = this.tray.findIndex((t) => removeSet.has(t.uid));
      this.poppedSymbolVfx.push({ symbolId: tile.symbolId, slotIdx: Math.max(0, firstSlot + 1) });
      this.tray = this.tray.filter((t) => !removeSet.has(t.uid));
      this.undoStack = this.undoStack.filter((id) => !removeSet.has(id));
      // Mark removed tiles permanently cleared by removing from tiles list
      this.tiles = this.tiles.filter((t) => !removeSet.has(t.uid));
    }

    if (this.tiles.length === 0) {
      this.status = 'won';
      return { ok: true, matchedSymbol, won: true, trayFull: false };
    }

    if (this.tray.length >= TILE_TRAY_CAPACITY) {
      this.status = 'tray_full';
      return { ok: true, matchedSymbol, won: false, trayFull: true };
    }

    return { ok: true, matchedSymbol, won: false, trayFull: false };
  }

  public undoLastPick(): boolean {
    if (this.undoStack.length === 0 || this.status === 'won') return false;
    const lastUid = this.undoStack.pop()!;
    const idx = this.tray.findIndex((t) => t.uid === lastUid);
    if (idx < 0) return false;
    const [tile] = this.tray.splice(idx, 1);
    tile.state = 'board';
    if (this.status === 'tray_full') {
      this.status = 'playing';
    }
    return true;
  }

  public shuffleBoardTiles(): boolean {
    const boardTiles = this.tiles.filter((t) => t.state === 'board');
    if (boardTiles.length <= 1) return false;
    const syms = boardTiles.map((t) => t.symbolId);
    for (let i = syms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [syms[i], syms[j]] = [syms[j], syms[i]];
    }
    boardTiles.forEach((t, i) => {
      t.symbolId = syms[i];
    });
    return true;
  }

  public useAutoTripleAssist(): { ok: boolean; won: boolean } {
    if (this.status === 'won') return { ok: false, won: true };

    // Prefer clearing a symbol already cluttering the tray first!
    let targetSym = this.tray[0]?.symbolId;
    if (!targetSym) {
      targetSym = this.tiles[0]?.symbolId;
    }
    if (!targetSym) return { ok: false, won: false };

    const matching = this.tiles.filter((t) => t.symbolId === targetSym).slice(0, 3);
    if (matching.length === 0) return { ok: false, won: false };

    const rmSet = new Set(matching.map((t) => t.uid));
    this.poppedSymbolVfx.push({ symbolId: targetSym, slotIdx: 2 });
    this.tray = this.tray.filter((t) => !rmSet.has(t.uid));
    this.undoStack = this.undoStack.filter((id) => !rmSet.has(id));
    this.tiles = this.tiles.filter((t) => !rmSet.has(t.uid));

    if (this.tiles.length === 0) {
      this.status = 'won';
      return { ok: true, won: true };
    }
    this.status = 'playing';
    return { ok: true, won: false };
  }
}

// ============================================================================
// 4. SUDOKU CỔ NGỮ 9x9 (SEEDED UNIQUE-SOLUTION GENERATOR & PENCIL NOTES)
// ============================================================================

const SUDOKU_X_SEEDS: ReadonlyArray<ReadonlyArray<ReadonlyArray<number>>> = [
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 1, 4, 3, 6, 5, 8, 9, 7],
    [3, 6, 8, 9, 7, 2, 5, 1, 4],
    [5, 9, 7, 8, 1, 4, 6, 3, 2],
    [9, 4, 1, 6, 3, 8, 2, 7, 5],
    [8, 3, 2, 5, 4, 7, 9, 6, 1],
    [6, 7, 5, 2, 9, 1, 3, 4, 8],
  ],
  [
    [1, 4, 7, 2, 5, 8, 3, 6, 9],
    [2, 3, 5, 1, 6, 9, 4, 7, 8],
    [6, 8, 9, 3, 4, 7, 1, 2, 5],
    [3, 1, 2, 4, 7, 5, 8, 9, 6],
    [5, 6, 4, 9, 8, 3, 7, 1, 2],
    [7, 9, 8, 6, 1, 2, 5, 4, 3],
    [9, 7, 3, 5, 2, 1, 6, 8, 4],
    [8, 2, 6, 7, 3, 4, 9, 5, 1],
    [4, 5, 1, 8, 9, 6, 2, 3, 7],
  ],
  [
    [1, 5, 9, 2, 6, 7, 3, 4, 8],
    [2, 3, 4, 1, 5, 8, 6, 7, 9],
    [6, 7, 8, 3, 4, 9, 1, 2, 5],
    [3, 1, 2, 4, 7, 5, 8, 9, 6],
    [5, 4, 6, 8, 9, 1, 7, 3, 2],
    [8, 9, 7, 6, 3, 2, 4, 5, 1],
    [9, 8, 3, 7, 2, 6, 5, 1, 4],
    [7, 2, 1, 5, 8, 4, 9, 6, 3],
    [4, 6, 5, 9, 1, 3, 2, 8, 7],
  ],
  [
    [1, 6, 8, 3, 5, 7, 2, 9, 4],
    [2, 3, 4, 1, 6, 9, 5, 7, 8],
    [5, 7, 9, 2, 4, 8, 1, 3, 6],
    [3, 1, 2, 4, 7, 5, 6, 8, 9],
    [4, 9, 7, 6, 8, 1, 3, 5, 2],
    [8, 5, 6, 9, 3, 2, 4, 1, 7],
    [9, 8, 3, 5, 2, 6, 7, 4, 1],
    [7, 2, 5, 8, 1, 4, 9, 6, 3],
    [6, 4, 1, 7, 9, 3, 8, 2, 5],
  ],
];

function transformSudokuD4(
  seed: ReadonlyArray<ReadonlyArray<number>>,
  sym: number,
  digitPerm: ReadonlyArray<number>
): number[][] {
  const rot = sym & 3;
  const flip = (sym & 4) !== 0;
  return Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (__, c) => {
      const fc = flip ? 8 - c : c;
      let sr = r;
      let sc = fc;
      if (rot === 1) {
        sr = fc;
        sc = 8 - r;
      } else if (rot === 2) {
        sr = 8 - r;
        sc = 8 - fc;
      } else if (rot === 3) {
        sr = 8 - fc;
        sc = r;
      }
      return digitPerm[seed[sr][sc] - 1];
    })
  );
}

function countSudokuSolutions(grid: number[][], limit = 2, diagonalRule = false): number {
  const rowMask = new Int32Array(9);
  const colMask = new Int32Array(9);
  const boxMask = new Int32Array(9);
  let diagMainMask = 0;
  let diagAntiMask = 0;
  const work = grid.map((row) => row.slice());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = work[r][c];
      if (v >= 1 && v <= 9) {
        const bit = 1 << v;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        if ((rowMask[r] & bit) !== 0 || (colMask[c] & bit) !== 0 || (boxMask[b] & bit) !== 0) {
          return 0;
        }
        if (diagonalRule) {
          if (r === c && (diagMainMask & bit) !== 0) return 0;
          if (r + c === 8 && (diagAntiMask & bit) !== 0) return 0;
          if (r === c) diagMainMask |= bit;
          if (r + c === 8) diagAntiMask |= bit;
        }
        rowMask[r] |= bit;
        colMask[c] |= bit;
        boxMask[b] |= bit;
      }
    }
  }

  let solutions = 0;

  const dfs = (): void => {
    if (solutions >= limit) return;

    let bestR = -1;
    let bestC = -1;
    let bestAvail = 0;
    let bestCount = 10;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (work[r][c] !== 0) continue;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        let used = rowMask[r] | colMask[c] | boxMask[b];
        if (diagonalRule) {
          if (r === c) used |= diagMainMask;
          if (r + c === 8) used |= diagAntiMask;
        }
        const avail = 0x3fe & ~used;
        if (avail === 0) return;

        let cnt = 0;
        let tmp = avail;
        while (tmp !== 0) {
          tmp &= tmp - 1;
          cnt++;
        }
        if (cnt < bestCount) {
          bestCount = cnt;
          bestR = r;
          bestC = c;
          bestAvail = avail;
          if (cnt === 1) break;
        }
      }
      if (bestCount === 1) break;
    }

    if (bestR === -1) {
      solutions += 1;
      return;
    }

    const b = Math.floor(bestR / 3) * 3 + Math.floor(bestC / 3);
    const onMain = diagonalRule && bestR === bestC;
    const onAnti = diagonalRule && bestR + bestC === 8;
    for (let d = 1; d <= 9; d++) {
      const bit = 1 << d;
      if ((bestAvail & bit) === 0) continue;
      work[bestR][bestC] = d;
      rowMask[bestR] |= bit;
      colMask[bestC] |= bit;
      boxMask[b] |= bit;
      if (onMain) diagMainMask |= bit;
      if (onAnti) diagAntiMask |= bit;

      dfs();

      work[bestR][bestC] = 0;
      rowMask[bestR] &= ~bit;
      colMask[bestC] &= ~bit;
      boxMask[b] &= ~bit;
      if (onMain) diagMainMask &= ~bit;
      if (onAnti) diagAntiMask &= ~bit;
      if (solutions >= limit) return;
    }
  };

  dfs();
  return solutions;
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class SudokuPuzzleEngine {
  public readonly stage: number;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly reward: PuzzleRewardSpec;
  public maxMistakes: number;
  public readonly hintGoldCost: number;
  /** Sudoku Đường Chéo (Sudoku-X): both main 9-cell diagonals must contain 1..9 uniquely (stage >= 120, even, or boss >= 100) */
  public readonly diagonalRule: boolean;
  /** Ấn Chẵn/Lẻ Cổ Ngữ: watermarked blank cells enforce odd (1) or even (2) digits (stage >= 240, stage % 3 === 1, or boss >= 300) */
  public readonly parityRule: boolean;
  /** 0 = normal, 1 = odd rune (◇), 2 = even rune (◯) */
  public parityMask: (0 | 1 | 2)[][] = [];
  public talismanUsed = false;
  public solution: number[][] = [];
  public given: boolean[][] = [];
  public grid: number[][] = [];
  /** Bitmask (1 << d) for pencil notes 1..9 per cell */
  public notes: number[][] = [];
  public pencilMode = false;
  public eraseMode = false;
  public editHistory: Array<{ r: number; c: number }> = [];
  public selected: { r: number; c: number } | null = null;
  public freeHintsLeft: number;
  public paidHintsLeft: number;
  public mistakesCount = 0;
  public status: 'playing' | 'won' | 'lost' = 'playing';

  constructor(stage: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    const tier = getMinigameDifficultyTier(this.stage);
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    this.difficultyLabel = this.milestoneBoss
      ? `👑 Đại Trùm Mốc ${this.stage}`
      : `${tier.badgeEmoji} ${tier.label}`;
    this.maxMistakes = this.stage <= 15 ? 5 : 3;
    this.freeHintsLeft = this.stage <= 15 ? 1 : 0;
    this.paidHintsLeft = this.stage <= 80 ? 2 : 1;
    this.hintGoldCost = Math.min(260, 85 + Math.floor(this.stage / 6));
    this.diagonalRule =
      (this.stage >= 120 && this.stage % 2 === 0) || Boolean(this.milestoneBoss && this.stage >= 100);
    this.parityRule =
      (this.stage >= 240 && this.stage % 3 === 1) || Boolean(this.milestoneBoss && this.stage >= 300);

    let targetBlanks = 32;
    if (this.stage <= 15) {
      targetBlanks = 31 + Math.floor((this.stage - 1) / 4); // 31..34
    } else if (this.stage <= 60) {
      targetBlanks = 36 + Math.floor((this.stage - 16) / 10); // 36..40
    } else if (this.stage <= 150) {
      targetBlanks = 41 + Math.floor((this.stage - 61) / 18); // 41..45
    } else if (this.stage <= 300) {
      targetBlanks = 46 + Math.floor((this.stage - 151) / 35); // 46..50
    } else if (this.stage <= 500) {
      targetBlanks = 51 + Math.floor((this.stage - 301) / 70); // 51..53
    } else if (this.stage <= 680) {
      targetBlanks = 54 + Math.floor((this.stage - 501) / 100); // 54..55
    } else {
      targetBlanks = this.stage >= 740 ? 57 : 56; // 24..25 givens — Grandmaster unique board
    }

    const stars = getStageStarReward(this.stage);
    const effectiveCap = Math.min(this.stage, 260) + Math.floor(Math.max(0, this.stage - 260) * 0.35);
    this.reward = {
      stars,
      sand: this.stage === MAX_MINIGAME_STAGE ? 5 : this.stage % 10 === 0 ? 2 : 1,
      gold: Math.round(90 + effectiveCap * 4.2 + stars * 20),
      xp: Math.round(60 + effectiveCap * 3.0 + stars * 14),
      isMasterpiece: this.stage % 10 === 0 || this.stage === MAX_MINIGAME_STAGE,
    };

    this.generateUniqueBoard(targetBlanks);
  }

  private generateUniqueBoard(targetBlanks: number): void {
    const rng = mulberry32(this.stage * 104729 + 7919);

    const digitPerm = shuffleWithRng([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);

    if (this.diagonalRule) {
      const seed = SUDOKU_X_SEEDS[this.stage % SUDOKU_X_SEEDS.length];
      const sym = Math.floor(rng() * 8);
      this.solution = transformSudokuD4(seed, sym, digitPerm);
    } else {
      const bandOrder = shuffleWithRng([0, 1, 2], rng);
      const stackOrder = shuffleWithRng([0, 1, 2], rng);

      const rowOrder: number[] = [];
      for (const band of bandOrder) {
        const within = shuffleWithRng([0, 1, 2], rng);
        for (const dr of within) rowOrder.push(band * 3 + dr);
      }

      const colOrder: number[] = [];
      for (const stack of stackOrder) {
        const within = shuffleWithRng([0, 1, 2], rng);
        for (const dc of within) colOrder.push(stack * 3 + dc);
      }

      const transpose = rng() < 0.5;
      this.solution = Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 9 }, (__, c) => {
          const rr = transpose ? colOrder[c] : rowOrder[r];
          const cc = transpose ? rowOrder[r] : colOrder[c];
          const baseIdx = (rr * 3 + Math.floor(rr / 3) + cc) % 9;
          return digitPerm[baseIdx];
        })
      );
    }

    const puzzle = this.solution.map((row) => row.slice());

    // Pass 1: symmetric cell pairs so the Sudoku board looks balanced & classic
    const pairs: Array<Array<[number, number]>> = [];
    for (let idx = 0; idx <= 40; idx++) {
      const r1 = Math.floor(idx / 9);
      const c1 = idx % 9;
      const r2 = 8 - r1;
      const c2 = 8 - c1;
      if (r1 === r2 && c1 === c2) {
        pairs.push([[r1, c1]]);
      } else {
        pairs.push([
          [r1, c1],
          [r2, c2],
        ]);
      }
    }
    shuffleWithRng(pairs, rng);

    let blanks = 0;
    for (const pair of pairs) {
      if (blanks >= targetBlanks) break;
      if (blanks + pair.length > targetBlanks && pair.length === 2 && targetBlanks < 50) continue;
      const saved = pair.map(([r, c]) => puzzle[r][c]);
      for (const [r, c] of pair) puzzle[r][c] = 0;

      if (countSudokuSolutions(puzzle, 2, this.diagonalRule) === 1) {
        blanks += pair.length;
      } else {
        pair.forEach(([r, c], i) => {
          puzzle[r][c] = saved[i];
        });
      }
    }

    // Pass 2: bounded single-cell carving so high stages (300..777) reach 51..57 blanks in < 10ms
    if (blanks < targetBlanks) {
      const singles: Array<[number, number]> = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] !== 0) singles.push([r, c]);
        }
      }
      shuffleWithRng(singles, rng);
      let singleChecks = 0;
      for (const [r, c] of singles) {
        if (blanks >= targetBlanks || singleChecks >= 36) break;
        singleChecks++;
        const saved = puzzle[r][c];
        puzzle[r][c] = 0;
        if (countSudokuSolutions(puzzle, 2, this.diagonalRule) === 1) {
          blanks += 1;
        } else {
          puzzle[r][c] = saved;
        }
      }
    }

    this.grid = puzzle.map((row) => row.slice());
    this.given = puzzle.map((row) => row.map((v) => v !== 0));
    this.notes = Array.from({ length: 9 }, () => Array<number>(9).fill(0));
    this.parityMask = Array.from({ length: 9 }, () => Array<0 | 1 | 2>(9).fill(0));

    if (this.parityRule) {
      const blankCoords: Array<[number, number]> = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!this.given[r][c]) blankCoords.push([r, c]);
        }
      }
      shuffleWithRng(blankCoords, rng);
      const parityCount = Math.min(blankCoords.length, 10 + (this.stage % 5)); // 10..14 clean runes
      for (let i = 0; i < parityCount; i++) {
        const [r, c] = blankCoords[i];
        this.parityMask[r][c] = this.solution[r][c] % 2 === 0 ? 2 : 1;
      }
    }

    // Select first blank cell by default for immediate keyboard/pad play
    outer: for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!this.given[r][c]) {
          this.selected = { r, c };
          break outer;
        }
      }
    }
  }

  public get filledCount(): number {
    let cnt = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.grid[r][c] !== 0) cnt++;
      }
    }
    return cnt;
  }

  public isWrongCell(r: number, c: number): boolean {
    const val = this.grid[r]?.[c] ?? 0;
    if (val === 0 || this.given[r]?.[c]) return false;
    return val !== this.solution[r]?.[c];
  }

  public hasConflict(r: number, c: number): boolean {
    const val = this.grid[r]?.[c] ?? 0;
    if (val === 0) return false;
    if (this.isWrongCell(r, c)) return true;
    for (let i = 0; i < 9; i++) {
      if (i !== c && this.grid[r][i] === val) return true;
      if (i !== r && this.grid[i][c] === val) return true;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        const nr = br + dr;
        const nc = bc + dc;
        if ((nr !== r || nc !== c) && this.grid[nr][nc] === val) return true;
      }
    }
    if (this.diagonalRule) {
      if (r === c) {
        for (let i = 0; i < 9; i++) {
          if (i !== r && this.grid[i][i] === val) return true;
        }
      }
      if (r + c === 8) {
        for (let i = 0; i < 9; i++) {
          if (i !== r && this.grid[i][8 - i] === val) return true;
        }
      }
    }
    const pm = this.parityMask[r]?.[c] ?? 0;
    if (pm === 1 && val % 2 === 0) return true;
    if (pm === 2 && val % 2 !== 0) return true;
    return false;
  }

  public getRemainingDigitCounts(): number[] {
    const placed = new Array<number>(10).fill(0);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = this.grid[r][c];
        if (v >= 1 && v <= 9 && v === this.solution[r][c]) placed[v]++;
      }
    }
    return placed.map((cnt, d) => (d === 0 ? 0 : Math.max(0, 9 - cnt)));
  }

  public moveSelection(dr: number, dc: number): void {
    const cur = this.selected ?? { r: 4, c: 4 };
    this.selected = {
      r: (cur.r + dr + 9) % 9,
      c: (cur.c + dc + 9) % 9,
    };
  }

  private prunePeerNotes(r: number, c: number, digit: number): void {
    const bit = 1 << digit;
    for (let i = 0; i < 9; i++) {
      this.notes[r][i] &= ~bit;
      this.notes[i][c] &= ~bit;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        this.notes[br + dr][bc + dc] &= ~bit;
      }
    }
    if (this.diagonalRule) {
      if (r === c) {
        for (let i = 0; i < 9; i++) this.notes[i][i] &= ~bit;
      }
      if (r + c === 8) {
        for (let i = 0; i < 9; i++) this.notes[i][8 - i] &= ~bit;
      }
    }
  }

  private checkSolved(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.grid[r][c] !== this.solution[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  private recordCellEdit(r: number, c: number): void {
    this.editHistory = this.editHistory.filter((item) => item.r !== r || item.c !== c);
    this.editHistory.push({ r, c });
  }

  public inputDigit(digit: number): {
    changed: boolean;
    conflict: boolean;
    lost: boolean;
    won: boolean;
  } {
    if (this.status !== 'playing' || digit < 1 || digit > 9 || !this.selected) {
      return { changed: false, conflict: false, lost: this.status === 'lost', won: false };
    }
    this.eraseMode = false;
    const { r, c } = this.selected;
    if (this.given[r][c]) {
      return { changed: false, conflict: false, lost: false, won: false };
    }

    if (this.pencilMode) {
      if (this.grid[r][c] !== 0) {
        this.grid[r][c] = 0;
      }
      this.notes[r][c] ^= 1 << digit;
      if (this.notes[r][c] !== 0) {
        this.recordCellEdit(r, c);
      } else {
        this.editHistory = this.editHistory.filter((item) => item.r !== r || item.c !== c);
      }
      return { changed: true, conflict: false, lost: false, won: false };
    }

    if (this.grid[r][c] === digit) {
      this.grid[r][c] = 0;
      this.editHistory = this.editHistory.filter((item) => item.r !== r || item.c !== c);
      return { changed: true, conflict: false, lost: false, won: false };
    }

    this.grid[r][c] = digit;
    this.notes[r][c] = 0;
    this.recordCellEdit(r, c);
    const conflict = digit !== this.solution[r][c] || this.hasConflict(r, c);
    if (conflict) {
      this.mistakesCount += 1;
      if (this.mistakesCount >= this.maxMistakes) {
        this.status = 'lost';
        return { changed: true, conflict: true, lost: true, won: false };
      }
    } else {
      this.prunePeerNotes(r, c, digit);
    }

    if (!conflict && this.checkSolved()) {
      this.status = 'won';
      return { changed: true, conflict: false, lost: false, won: true };
    }
    return { changed: true, conflict, lost: false, won: false };
  }

  public clearCellAt(r: number, c: number): boolean {
    if (this.status !== 'playing' && this.status !== 'lost') return false;
    if (r < 0 || r >= 9 || c < 0 || c >= 9) return false;
    if (this.given[r]?.[c]) return false;
    if (this.grid[r][c] === 0 && this.notes[r][c] === 0) return false;
    this.grid[r][c] = 0;
    this.notes[r][c] = 0;
    this.selected = { r, c };
    this.editHistory = this.editHistory.filter((item) => item.r !== r || item.c !== c);
    if (this.status === 'lost') {
      this.status = 'playing';
      this.mistakesCount = Math.max(0, Math.min(this.mistakesCount, this.maxMistakes - 1));
    }
    return true;
  }

  public clearSelectedCell(): boolean {
    if (this.status !== 'playing' && this.status !== 'lost') return false;
    if (this.selected && this.clearCellAt(this.selected.r, this.selected.c)) {
      return true;
    }
    // 1. Prioritize clearing the most recently edited wrong cell
    for (let i = this.editHistory.length - 1; i >= 0; i--) {
      const { r, c } = this.editHistory[i];
      if (this.isWrongCell(r, c) && this.clearCellAt(r, c)) {
        return true;
      }
    }
    // 2. Any wrong cell on the board
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.isWrongCell(r, c) && this.clearCellAt(r, c)) {
          return true;
        }
      }
    }
    // 3. Most recently user-edited cell in editHistory
    for (let i = this.editHistory.length - 1; i >= 0; i--) {
      const { r, c } = this.editHistory[i];
      if (this.clearCellAt(r, c)) {
        return true;
      }
    }
    // 4. Fallback scan for any user-entered cell on the board
    for (let r = 8; r >= 0; r--) {
      for (let c = 8; c >= 0; c--) {
        if (!this.given[r][c] && (this.grid[r][c] !== 0 || this.notes[r][c] !== 0)) {
          return this.clearCellAt(r, c);
        }
      }
    }
    return false;
  }

  public useMagicHint(): {
    ok: boolean;
    r: number;
    c: number;
    digit: number;
    won: boolean;
  } {
    if (this.status !== 'playing') {
      return { ok: false, r: 0, c: 0, digit: 0, won: this.status === 'won' };
    }

    let target: { r: number; c: number } | null = null;
    if (
      this.selected &&
      !this.given[this.selected.r][this.selected.c] &&
      this.grid[this.selected.r][this.selected.c] !==
        this.solution[this.selected.r][this.selected.c]
    ) {
      target = { ...this.selected };
    } else {
      for (let r = 0; r < 9 && !target; r++) {
        for (let c = 0; c < 9; c++) {
          if (!this.given[r][c] && this.grid[r][c] !== 0 && this.grid[r][c] !== this.solution[r][c]) {
            target = { r, c };
            break;
          }
        }
      }
      for (let r = 0; r < 9 && !target; r++) {
        for (let c = 0; c < 9; c++) {
          if (!this.given[r][c] && this.grid[r][c] === 0) {
            target = { r, c };
            break;
          }
        }
      }
    }

    if (!target) {
      return { ok: false, r: 0, c: 0, digit: 0, won: false };
    }

    const ans = this.solution[target.r][target.c];
    this.grid[target.r][target.c] = ans;
    this.given[target.r][target.c] = true;
    this.notes[target.r][target.c] = 0;
    this.prunePeerNotes(target.r, target.c, ans);
    this.selected = { ...target };

    if (this.checkSolved()) {
      this.status = 'won';
      return { ok: true, r: target.r, c: target.c, digit: ans, won: true };
    }
    return { ok: true, r: target.r, c: target.c, digit: ans, won: false };
  }

  public applyPhoenixTalisman(): {
    ok: boolean;
    revealed: number;
    won: boolean;
    msg: string;
  } {
    if (this.talismanUsed || this.status === 'won') {
      return {
        ok: false,
        revealed: 0,
        won: this.status === 'won',
        msg: 'Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!',
      };
    }

    this.talismanUsed = true;
    this.maxMistakes += 2;
    if (this.status === 'lost') {
      this.status = 'playing';
    }

    const candidates: Array<{ r: number; c: number; priority: number }> = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.given[r][c]) continue;
        if (this.grid[r][c] !== this.solution[r][c]) {
          const isSel = this.selected?.r === r && this.selected?.c === c;
          const isWrong = this.grid[r][c] !== 0;
          candidates.push({
            r,
            c,
            priority: isWrong ? 0 : isSel ? 1 : 2,
          });
        }
      }
    }
    candidates.sort((a, b) => a.priority - b.priority);

    let revealed = 0;
    for (const cell of candidates.slice(0, 3)) {
      const ans = this.solution[cell.r][cell.c];
      this.grid[cell.r][cell.c] = ans;
      this.given[cell.r][cell.c] = true;
      this.notes[cell.r][cell.c] = 0;
      this.prunePeerNotes(cell.r, cell.c, ans);
      this.selected = { r: cell.r, c: cell.c };
      revealed++;
    }

    if (this.checkSolved()) {
      this.status = 'won';
    }

    return {
      ok: true,
      revealed,
      won: this.status === 'won',
      msg: `🔥 Bùa Phượng Hoàng: Khai mở ${revealed} ô cổ ngữ chuẩn xác & cộng +2 khiên chống sai!`,
    };
  }
}

// ============================================================================
// 5. CỜ CARO BÀN GỖ HANG SÓC 13x13 (5-IN-A-ROW GOMOKU VS CANON AI OPPONENTS)
// ============================================================================

export const CARO_BOARD_SIZE = 13;
/**
 * 0 = empty, 1 = Player (Phoenix Seal), 2 = AI (Dark Mark),
 * 3 = Ancient Wax Rune Obstacle (Ấn Chì Cổ Ngữ Hắc Ám — blocks both sides on mid/late stages!)
 */
export type CaroStone = 0 | 1 | 2 | 3;

export type WizardingPortraitKey =
  | 'ron'
  | 'molly'
  | 'arthur'
  | 'hagrid'
  | 'professor'
  | 'deatheater'
  | 'thestral'
  | 'snape'
  | 'bellatrix'
  | 'voldemort';

export interface CaroOpponentProfile {
  name: string;
  title: string;
  emoji: string;
  portraitKey: WizardingPortraitKey;
  quote: string;
  tier: number; // 0..3 tactical depth
}

const CARO_OPPONENTS: ReadonlyArray<CaroOpponentProfile> = [
  {
    name: 'Tử Thần Thực Tử Do Thám',
    title: 'Kẻ Đột Nhập Hành Lang Đêm Hogwarts',
    emoji: '💀',
    portraitKey: 'deatheater',
    quote: 'Dấu chân trên Bản Đồ Đạo Tặc lộ rồi sao? Đừng hòng chặn được 5 Ấn Đầu Lâu Xà của ta!',
    tier: 0,
  },
  {
    name: 'Kỵ Sĩ Hắc Ám Rừng Cấm',
    title: 'Phục Kích Lối Ngầm Hogsmeade',
    emoji: '🦇',
    portraitKey: 'thestral',
    quote: 'Ta sẽ giăng thế chéo đôi Hắc Ám khắp lối mật đạo, Hội Phượng Hoàng đỡ nổi không?',
    tier: 1,
  },
  {
    name: 'Giáo Sư Severus Snape',
    title: 'Bậc Thầy Độc Dược & Bế Quan Bí Thuật',
    emoji: '🧪',
    portraitKey: 'snape',
    quote: 'Kiểm soát tâm trí và chặn kín hai đầu trước khi quá muộn... Đừng để lộ sơ hở trên bản đồ!',
    tier: 1,
  },
  {
    name: 'Bellatrix Lestrange',
    title: 'Tướng Quân Tử Thần Thực Tử',
    emoji: '🐍',
    portraitKey: 'bellatrix',
    quote: 'Hahaha! Ấn Đầu Lâu Xà sẽ nuốt trọn Phòng Sinh Hoạt Chung bằng đòn công bốn ấn liên hoàn!',
    tier: 2,
  },
  {
    name: 'Chúa Tể Voldemort',
    title: 'Chúa Tể Hắc Ám — Thế Trận Priori Incantatem',
    emoji: '⚡',
    portraitKey: 'voldemort',
    quote: 'Hội Phượng Hoàng ư? Hãy xem lửa Phượng Hoàng chống đỡ thế song công năm Ấn Đầu Lâu Xà thế nào!',
    tier: 3,
  },
];

const CARO_AXES: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

const CARO_PRO_OPENINGS: ReadonlyArray<Array<[number, number, 1 | 2]>> = [
  [[6, 6, 1], [5, 5, 2]],
  [[6, 6, 1], [5, 6, 2]],
  [[6, 6, 1], [5, 7, 2]],
  [[6, 6, 1], [7, 7, 2]],
  [[6, 5, 1], [6, 7, 2]],
  [[5, 6, 1], [7, 6, 2]],
  [[5, 5, 1], [6, 6, 2]],
  [[7, 5, 1], [6, 6, 2]],
  [[5, 7, 1], [6, 6, 2]],
  [[7, 7, 1], [6, 6, 2]],
  [[6, 5, 1], [5, 7, 2]],
  [[5, 6, 1], [7, 5, 2]],
  [[6, 7, 1], [5, 5, 2]],
  [[7, 6, 1], [5, 7, 2]],
];

function formatCaroCoordVi(r: number, c: number): string {
  const file = String.fromCharCode(65 + Math.max(0, Math.min(CARO_BOARD_SIZE - 1, c)));
  const rank = CARO_BOARD_SIZE - Math.max(0, Math.min(CARO_BOARD_SIZE - 1, r));
  return `${file}${rank}`;
}

export class CaroGameEngine {
  public readonly stage: number;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly opponent: CaroOpponentProfile;
  public readonly reward: PuzzleRewardSpec;
  public readonly hintGoldCost: number;
  public readonly undoGoldCost: number;
  public grid: CaroStone[][];
  public moveHistory: Array<{ r: number; c: number; stone: 1 | 2 }> = [];
  public initialHistoryLen = 0;
  public runeSealCount = 0;
  public winningLine: Array<{ r: number; c: number }> | null = null;
  public hintCell: { r: number; c: number } | null = null;
  public freeUndosLeft: number;
  public paidUndosLeft: number;
  public freeHintsLeft: number;
  public paidHintsLeft: number;
  public talismanUsed = false;
  public status: 'playing' | 'ai_thinking' | 'won' | 'lost' | 'draw' = 'playing';
  private rng: () => number;
  private humanTurnReviews: Array<{
    plyNumber: number;
    played: { r: number; c: number };
    best: { r: number; c: number };
    playedEval: number;
    bestEval: number;
  }> = [];

  constructor(stage: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    const tier = getMinigameDifficultyTier(this.stage);
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    this.difficultyLabel = this.milestoneBoss
      ? `👑 Đại Trùm Mốc ${this.stage}`
      : `${tier.badgeEmoji} ${tier.label}`;
    // Opponent scales progressively while rotating within each difficulty band; Boss milestones face elite dark wizards
    const oppIdx = this.milestoneBoss
      ? this.stage >= 500
        ? CARO_OPPONENTS.length - 1
        : this.stage >= 200
          ? CARO_OPPONENTS.length - 2
          : 2
      : this.stage === MAX_MINIGAME_STAGE
        ? CARO_OPPONENTS.length - 1
        : this.stage <= 25
          ? (this.stage - 1) % 2
          : this.stage <= 150
            ? 1 + ((this.stage - 1) % 3)
            : 2 + ((this.stage - 1) % 3);
    this.opponent = CARO_OPPONENTS[oppIdx];
    this.rng = mulberry32(this.stage * 65537 + 1337);

    this.freeUndosLeft = this.stage <= 15 ? 1 : 0;
    this.paidUndosLeft = this.stage <= 100 ? 2 : 1;
    this.freeHintsLeft = this.stage <= 12 ? 1 : 0;
    this.paidHintsLeft = this.stage <= 120 ? 1 : 0;
    this.hintGoldCost = Math.min(260, 90 + Math.floor(this.stage / 5));
    this.undoGoldCost = Math.min(220, 65 + Math.floor(this.stage / 7));

    const stars = getStageStarReward(this.stage);
    const effectiveCap = Math.min(this.stage, 260) + Math.floor(Math.max(0, this.stage - 260) * 0.35);
    this.reward = {
      stars,
      sand: this.stage === MAX_MINIGAME_STAGE ? 5 : this.milestoneBoss || this.stage % 10 === 0 ? 2 : 1,
      gold: Math.round(95 + effectiveCap * 4.2 + stars * 20),
      xp: Math.round(62 + effectiveCap * 3.0 + stars * 14),
      isMasterpiece: Boolean(this.milestoneBoss) || this.stage % 10 === 0 || this.stage === MAX_MINIGAME_STAGE,
    };

    this.grid = Array.from({ length: CARO_BOARD_SIZE }, () =>
      Array<CaroStone>(CARO_BOARD_SIZE).fill(0)
    );

    this.seedBoardFormation();
  }

  private seedBoardFormation(): void {
    // Milestone Boss >= 100: symmetric 4-corner Elder Wax Rune Guard around the central Marauder courtyard
    if (this.milestoneBoss && this.stage >= 100) {
      const bossSeals: ReadonlyArray<[number, number]> =
        this.stage >= 500
          ? [
              [3, 3],
              [3, 9],
              [9, 3],
              [9, 9],
              [4, 6],
            ]
          : [
              [4, 4],
              [4, 8],
              [8, 4],
              [8, 8],
            ];
      let placedBoss = 0;
      for (const [r, c] of bossSeals) {
        if (this.grid[r][c] === 0) {
          this.grid[r][c] = 3;
          placedBoss++;
        }
      }
      this.runeSealCount = placedBoss;
    } else {
      // Stages 90..777: place 1..5 Ancient Wax Rune Obstacles (stone = 3) so memorized patterns fail
      const targetSeals =
        this.stage < 90
          ? 0
          : this.stage < 200
            ? 1
            : this.stage < 350
              ? 2
              : this.stage < 520
                ? 3
                : this.stage < 680
                  ? 4
                  : 5;
      let placedSeals = 0;
      let guard = 0;
      while (placedSeals < targetSeals && guard < 80) {
        guard++;
        const r = 3 + Math.floor(this.rng() * 7); // 3..9
        const c = 3 + Math.floor(this.rng() * 7); // 3..9
        // Keep exact center 3x3 partially open for Pro-Renju exchange
        if (Math.abs(r - 6) <= 1 && Math.abs(c - 6) <= 1) continue;
        if (this.grid[r][c] !== 0) continue;
        this.grid[r][c] = 3;
        placedSeals++;
      }
      this.runeSealCount = placedSeals;
    }

    // Stages 16..777: Pro-Renju central exchange (1 Phoenix + 1 Dark Mark) so every stage starts fresh!
    if (this.stage >= 16) {
      const opening = CARO_PRO_OPENINGS[(this.stage * 7 + 3) % CARO_PRO_OPENINGS.length];
      for (const [r, c, st] of opening) {
        if (this.grid[r][c] === 0) {
          this.grid[r][c] = st;
          this.moveHistory.push({ r, c, stone: st });
        }
      }
      this.initialHistoryLen = this.moveHistory.length;
    }
  }

  public get lastMove(): { r: number; c: number; stone: 1 | 2 } | null {
    return this.moveHistory.length > 0 ? this.moveHistory[this.moveHistory.length - 1] : null;
  }

  private isBoardFull(): boolean {
    for (let r = 0; r < CARO_BOARD_SIZE; r++) {
      for (let c = 0; c < CARO_BOARD_SIZE; c++) {
        if (this.grid[r][c] === 0) return false;
      }
    }
    return true;
  }

  private findWinningFive(stone: 1 | 2): Array<{ r: number; c: number }> | null {
    for (let r = 0; r < CARO_BOARD_SIZE; r++) {
      for (let c = 0; c < CARO_BOARD_SIZE; c++) {
        if (this.grid[r][c] !== stone) continue;
        for (const [dr, dc] of CARO_AXES) {
          const pr = r - dr;
          const pc = c - dc;
          if (
            pr >= 0 &&
            pr < CARO_BOARD_SIZE &&
            pc >= 0 &&
            pc < CARO_BOARD_SIZE &&
            this.grid[pr][pc] === stone
          ) {
            continue;
          }
          const line: Array<{ r: number; c: number }> = [];
          let nr = r;
          let nc = c;
          while (
            nr >= 0 &&
            nr < CARO_BOARD_SIZE &&
            nc >= 0 &&
            nc < CARO_BOARD_SIZE &&
            this.grid[nr][nc] === stone
          ) {
            line.push({ r: nr, c: nc });
            nr += dr;
            nc += dc;
          }
          if (line.length >= 5) {
            return line.slice(0, 5);
          }
        }
      }
    }
    return null;
  }

  public playHumanMove(r: number, c: number): {
    ok: boolean;
    won: boolean;
    draw: boolean;
    aiThinking: boolean;
  } {
    if (
      this.status !== 'playing' ||
      r < 0 ||
      r >= CARO_BOARD_SIZE ||
      c < 0 ||
      c >= CARO_BOARD_SIZE ||
      this.grid[r][c] !== 0
    ) {
      return { ok: false, won: false, draw: false, aiThinking: false };
    }

    const bestCandidate = this.computeBestMoveFor(1, 3);
    const playedEval =
      this.scorePlacementAt(r, c, 1) + this.scorePlacementAt(r, c, 2) * 1.15;
    const bestEval =
      this.scorePlacementAt(bestCandidate.r, bestCandidate.c, 1) +
      this.scorePlacementAt(bestCandidate.r, bestCandidate.c, 2) * 1.15;
    this.humanTurnReviews.push({
      plyNumber: Math.max(1, Math.floor((this.moveHistory.length - this.initialHistoryLen) / 2) + 1),
      played: { r, c },
      best: { r: bestCandidate.r, c: bestCandidate.c },
      playedEval,
      bestEval,
    });

    this.grid[r][c] = 1;
    this.moveHistory.push({ r: r, c: c, stone: 1 });
    this.hintCell = null;

    const winLine = this.findWinningFive(1);
    if (winLine) {
      this.winningLine = winLine;
      this.status = 'won';
      return { ok: true, won: true, draw: false, aiThinking: false };
    }

    if (this.isBoardFull()) {
      this.status = 'draw';
      return { ok: true, won: false, draw: true, aiThinking: false };
    }

    this.status = 'ai_thinking';
    return { ok: true, won: false, draw: false, aiThinking: true };
  }

  private getStageAiStrength(): number {
    if (this.stage <= 8) return 0;
    if (this.stage <= 30) return 1;
    if (this.stage <= 95) return 2;
    if (this.stage <= 240) return 3;
    if (this.stage <= 480) return 4;
    return 5;
  }

  public stepAiMove(): {
    r: number;
    c: number;
    aiWon: boolean;
    draw: boolean;
  } | null {
    if (this.status !== 'ai_thinking') return null;

    const strength = this.getStageAiStrength();
    const choice = this.computeBestMoveFor(2, strength);
    this.grid[choice.r][choice.c] = 2;
    this.moveHistory.push({ r: choice.r, c: choice.c, stone: 2 });

    const aiWin = this.findWinningFive(2);
    if (aiWin) {
      this.winningLine = aiWin;
      this.status = 'lost';
      return { r: choice.r, c: choice.c, aiWon: true, draw: false };
    }

    if (this.isBoardFull()) {
      this.status = 'draw';
      return { r: choice.r, c: choice.c, aiWon: false, draw: true };
    }

    this.status = 'playing';
    return { r: choice.r, c: choice.c, aiWon: false, draw: false };
  }

  public undoTurnPair(): boolean {
    if (this.moveHistory.length <= this.initialHistoryLen || this.status === 'won') return false;

    const last = this.moveHistory[this.moveHistory.length - 1];
    if (last.stone === 2 && this.moveHistory.length >= this.initialHistoryLen + 2) {
      const aiMv = this.moveHistory.pop()!;
      this.grid[aiMv.r][aiMv.c] = 0;
      const huMv = this.moveHistory.pop()!;
      this.grid[huMv.r][huMv.c] = 0;
      if (this.humanTurnReviews.length > 0) this.humanTurnReviews.pop();
    } else {
      const mv = this.moveHistory.pop()!;
      this.grid[mv.r][mv.c] = 0;
      if (mv.stone === 1 && this.humanTurnReviews.length > 0) this.humanTurnReviews.pop();
    }

    this.winningLine = null;
    this.hintCell = null;
    this.status = 'playing';
    return true;
  }

  public getTurningPointReview(): TurningPointReview | null {
    if (
      (this.status !== 'won' && this.status !== 'lost' && this.status !== 'draw') ||
      this.humanTurnReviews.length === 0
    ) {
      return null;
    }

    if (this.status === 'won') {
      const forks = this.humanTurnReviews.filter(
        (t) => t.playedEval >= 17_500 && t.playedEval < 900_000
      );
      const chosen =
        forks.length > 0
          ? forks.reduce((a, b) => (b.playedEval >= a.playedEval ? b : a))
          : this.humanTurnReviews[this.humanTurnReviews.length - 1];
      const playedCoord = formatCaroCoordVi(chosen.played.r, chosen.played.c);
      const bestCoord = formatCaroCoordVi(chosen.best.r, chosen.best.c);
      const highlights: Array<{ r: number; c: number; role: 'played' | 'best' }> = [
        { r: chosen.played.r, c: chosen.played.c, role: 'played' },
      ];
      if (chosen.best.r !== chosen.played.r || chosen.best.c !== chosen.played.c) {
        highlights.push({ r: chosen.best.r, c: chosen.best.c, role: 'best' });
      }
      return {
        mode: 'caro',
        plyNumber: chosen.plyNumber,
        outcomeTagVi: '✨ Nước Ấn Phượng Hoàng Quyết Định',
        playedCoordVi: playedCoord,
        recommendedCoordVi: bestCoord,
        summaryVi:
          chosen.playedEval >= 900_000
            ? `Nước #${chosen.plyNumber} tại ${playedCoord} nối liền Ngũ Ấn Phượng Hoàng kết liễu thế trận!`
            : `Nước #${chosen.plyNumber} tại ${playedCoord} mở thế song công chí mạng khiến đối phương không kịp hóa giải.`,
        highlightCells: highlights,
      };
    }

    // Lost or Draw: find steepest missed tactical turn where best != played
    let worst = this.humanTurnReviews[this.humanTurnReviews.length - 1];
    let maxGap = -1;
    for (const rev of this.humanTurnReviews) {
      const same = rev.best.r === rev.played.r && rev.best.c === rev.played.c;
      const gap = same ? 0 : rev.bestEval - rev.playedEval;
      if (gap > maxGap) {
        maxGap = gap;
        worst = rev;
      }
    }
    const playedCoord = formatCaroCoordVi(worst.played.r, worst.played.c);
    const bestCoord = formatCaroCoordVi(worst.best.r, worst.best.c);
    const highlights: Array<{ r: number; c: number; role: 'played' | 'best' }> = [
      { r: worst.played.r, c: worst.played.c, role: 'played' },
    ];
    if (worst.best.r !== worst.played.r || worst.best.c !== worst.played.c) {
      highlights.push({ r: worst.best.r, c: worst.best.c, role: 'best' });
    }
    return {
      mode: 'caro',
      plyNumber: worst.plyNumber,
      outcomeTagVi: '🪞 Điểm Ngoặt Cần Khắc Phục',
      playedCoordVi: playedCoord,
      recommendedCoordVi: bestCoord,
      summaryVi:
        playedCoord === bestCoord
          ? `Lượt #${worst.plyNumber} tại ${playedCoord} giữ vững trung tâm, nhưng thế cờ trượt nhịp ở pha đôi công cuối.`
          : `Ở lượt #${worst.plyNumber}, đóng ấn tại ${bestCoord} (thay vì ${playedCoord}) sẽ khóa mũi công Hắc Ám & giành tiên thủ.`,
      highlightCells: highlights,
    };
  }

  public useBestMoveHint(): { r: number; c: number } | null {
    if (this.status !== 'playing') return null;
    const best = this.computeBestMoveFor(1, 4);
    this.hintCell = best;
    return best;
  }

  public applyPhoenixTalisman(): {
    ok: boolean;
    purified: { r: number; c: number } | null;
    hint: { r: number; c: number } | null;
    msg: string;
  } {
    if (this.talismanUsed || this.status === 'won' || this.status === 'ai_thinking') {
      return {
        ok: false,
        purified: null,
        hint: null,
        msg: 'Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!',
      };
    }

    if (this.status === 'lost' || this.status === 'draw') {
      const last = this.moveHistory[this.moveHistory.length - 1];
      if (last && last.stone === 2) {
        this.moveHistory.pop();
        this.grid[last.r][last.c] = 0;
      }
      this.winningLine = null;
      this.status = 'playing';
    }

    let bestAi: { r: number; c: number; score: number } | null = null;
    for (let r = 0; r < CARO_BOARD_SIZE; r++) {
      for (let c = 0; c < CARO_BOARD_SIZE; c++) {
        if (this.grid[r][c] !== 2) continue;
        this.grid[r][c] = 0;
        const threat = this.scorePlacementAt(r, c, 2) + this.scorePlacementAt(r, c, 1) * 0.35;
        this.grid[r][c] = 2;
        if (!bestAi || threat > bestAi.score) {
          bestAi = { r, c, score: threat };
        }
      }
    }

    let purified: { r: number; c: number } | null = null;
    if (bestAi) {
      this.grid[bestAi.r][bestAi.c] = 0;
      purified = { r: bestAi.r, c: bestAi.c };
      const idx = this.moveHistory.findIndex((m) => m.r === bestAi!.r && m.c === bestAi!.c);
      if (idx >= 0) {
        this.moveHistory.splice(idx, 1);
        if (idx < this.initialHistoryLen) {
          this.initialHistoryLen = Math.max(0, this.initialHistoryLen - 1);
        }
      }
    } else {
      outer: for (let r = 0; r < CARO_BOARD_SIZE; r++) {
        for (let c = 0; c < CARO_BOARD_SIZE; c++) {
          if (this.grid[r][c] === 3) {
            this.grid[r][c] = 0;
            this.runeSealCount = Math.max(0, this.runeSealCount - 1);
            purified = { r, c };
            break outer;
          }
        }
      }
    }

    this.talismanUsed = true;
    const best = this.computeBestMoveFor(1, 5);
    this.hintCell = best;

    return {
      ok: true,
      purified,
      hint: best,
      msg: purified
        ? '🔥 Lửa Phượng Hoàng đã thanh tẩy 1 Ấn Hắc Ám nguy hiểm nhất & chỉ điểm nước công tối ưu!'
        : '🔥 Lửa Phượng Hoàng đã soi sáng nước công tối ưu trên Bản Đồ Đạo Tặc!',
    };
  }

  private getCandidateCells(): Array<{ r: number; c: number }> {
    const mid = Math.floor(CARO_BOARD_SIZE / 2);
    if (this.moveHistory.length === 0) {
      return this.grid[mid][mid] === 0 ? [{ r: mid, c: mid }] : [{ r: mid - 1, c: mid }];
    }

    const candidates: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < CARO_BOARD_SIZE; r++) {
      for (let c = 0; c < CARO_BOARD_SIZE; c++) {
        if (this.grid[r][c] !== 0) continue;
        let near = false;
        for (let dr = -2; dr <= 2 && !near; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < CARO_BOARD_SIZE &&
              nc >= 0 &&
              nc < CARO_BOARD_SIZE &&
              (this.grid[nr][nc] === 1 || this.grid[nr][nc] === 2)
            ) {
              near = true;
              break;
            }
          }
        }
        if (near) candidates.push({ r, c });
      }
    }
    if (candidates.length > 0) return candidates;
    for (let r = 0; r < CARO_BOARD_SIZE; r++) {
      for (let c = 0; c < CARO_BOARD_SIZE; c++) {
        if (this.grid[r][c] === 0) return [{ r, c }];
      }
    }
    return [{ r: mid, c: mid }];
  }

  private scorePlacementAt(r: number, c: number, stone: 1 | 2): number {
    let total = 0;
    let strongThreats = 0;

    for (const [dr, dc] of CARO_AXES) {
      let forward = 0;
      let nr = r + dr;
      let nc = c + dc;
      while (
        nr >= 0 &&
        nr < CARO_BOARD_SIZE &&
        nc >= 0 &&
        nc < CARO_BOARD_SIZE &&
        this.grid[nr][nc] === stone
      ) {
        forward++;
        nr += dr;
        nc += dc;
      }
      const fOpen =
        nr >= 0 && nr < CARO_BOARD_SIZE && nc >= 0 && nc < CARO_BOARD_SIZE && this.grid[nr][nc] === 0;
      let fJump = 0;
      if (fOpen) {
        let jr = nr + dr;
        let jc = nc + dc;
        while (
          jr >= 0 &&
          jr < CARO_BOARD_SIZE &&
          jc >= 0 &&
          jc < CARO_BOARD_SIZE &&
          this.grid[jr][jc] === stone
        ) {
          fJump++;
          jr += dr;
          jc += dc;
        }
      }

      let backward = 0;
      let br = r - dr;
      let bc = c - dc;
      while (
        br >= 0 &&
        br < CARO_BOARD_SIZE &&
        bc >= 0 &&
        bc < CARO_BOARD_SIZE &&
        this.grid[br][bc] === stone
      ) {
        backward++;
        br -= dr;
        bc -= dc;
      }
      const bOpen =
        br >= 0 && br < CARO_BOARD_SIZE && bc >= 0 && bc < CARO_BOARD_SIZE && this.grid[br][bc] === 0;
      let bJump = 0;
      if (bOpen) {
        let jr = br - dr;
        let jc = bc - dc;
        while (
          jr >= 0 &&
          jr < CARO_BOARD_SIZE &&
          jc >= 0 &&
          jc < CARO_BOARD_SIZE &&
          this.grid[jr][jc] === stone
        ) {
          bJump++;
          jr -= dr;
          jc -= dc;
        }
      }

      // Check if this axis even has 5 unobstructed cells for `stone` (stone=3 blocks both sides!)
      let maxSpan = 1 + forward + backward;
      let tr = nr;
      let tc = nc;
      while (
        maxSpan < 6 &&
        tr >= 0 &&
        tr < CARO_BOARD_SIZE &&
        tc >= 0 &&
        tc < CARO_BOARD_SIZE &&
        (this.grid[tr][tc] === 0 || this.grid[tr][tc] === stone)
      ) {
        maxSpan++;
        tr += dr;
        tc += dc;
      }
      tr = br;
      tc = bc;
      while (
        maxSpan < 6 &&
        tr >= 0 &&
        tr < CARO_BOARD_SIZE &&
        tc >= 0 &&
        tc < CARO_BOARD_SIZE &&
        (this.grid[tr][tc] === 0 || this.grid[tr][tc] === stone)
      ) {
        maxSpan++;
        tr -= dr;
        tc -= dc;
      }
      if (maxSpan < 5) continue;

      const count = 1 + forward + backward;
      const openEnds = (fOpen ? 1 : 0) + (bOpen ? 1 : 0);
      const bestJumpCount = count + Math.max(fJump, bJump);

      if (count >= 5) {
        total += 1_000_000;
      } else if (count === 4 && openEnds === 2) {
        total += 140_000;
        strongThreats += 2;
      } else if (count === 4 && openEnds === 1) {
        total += 22_000;
        strongThreats += 1;
      } else if (bestJumpCount >= 4 && openEnds >= 1) {
        total += 17_500;
        strongThreats += 1;
      } else if (count === 3 && openEnds === 2) {
        total += 9_200;
        strongThreats += 1;
      } else if (bestJumpCount === 3 && openEnds === 2) {
        total += 5_800;
        strongThreats += 1;
      } else if (count === 3 && openEnds === 1) {
        total += 980;
      } else if (count === 2 && openEnds === 2) {
        total += 420;
      } else if (bestJumpCount === 2 && openEnds === 2) {
        total += 240;
      } else if (count === 2 && openEnds === 1) {
        total += 75;
      } else if (openEnds === 2) {
        total += 25;
      }
    }

    if (strongThreats >= 2) {
      total += 52_000;
    }
    return total;
  }

  private computeBestMoveFor(stone: 1 | 2, strength: number): { r: number; c: number } {
    const opp: 1 | 2 = stone === 1 ? 2 : 1;
    const cands = this.getCandidateCells();
    const mid = (CARO_BOARD_SIZE - 1) * 0.5;

    // 1. Immediate winning move
    for (const cell of cands) {
      this.grid[cell.r][cell.c] = stone;
      const win = this.findWinningFive(stone);
      this.grid[cell.r][cell.c] = 0;
      if (win) return cell;
    }

    // 2. Immediate forced block against opponent's 5-in-a-row
    for (const cell of cands) {
      this.grid[cell.r][cell.c] = opp;
      const oppWin = this.findWinningFive(opp);
      this.grid[cell.r][cell.c] = 0;
      if (oppWin) return cell;
    }

    const defWeight =
      strength === 0 ? 0.9 : strength === 1 ? 1.04 : strength === 2 ? 1.12 : strength === 3 ? 1.18 : 1.24;
    const scored = cands.map((cell) => {
      const atk = this.scorePlacementAt(cell.r, cell.c, stone);
      const def = this.scorePlacementAt(cell.r, cell.c, opp);
      const centerBonus = Math.max(0, 18 - Math.hypot(cell.r - mid, cell.c - mid) * 2.4);
      const jitter =
        strength === 0 ? this.rng() * 210 : strength <= 2 ? this.rng() * 14 : this.rng() * 3;
      return {
        r: cell.r,
        c: cell.c,
        score: atk + def * defWeight + centerBonus + jitter,
        urgent: atk >= 16_000 || def >= 16_000,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    // 3. 2-ply / 3-ply tactical fork & VCF lookahead for mid/late stages
    if (strength >= 2 && scored.length > 1) {
      const beamWidth = strength >= 4 ? 9 : 6;
      const top = scored.slice(0, beamWidth);
      let bestCell = top[0];
      let bestCombined = -Infinity;

      for (const cand of top) {
        this.grid[cand.r][cand.c] = stone;
        const nextCands = this.getCandidateCells();
        let worstOppNet = -Infinity;

        // Evaluate opponent's top counter-threats
        const oppScored: Array<{ r: number; c: number; val: number }> = [];
        for (const oc of nextCands) {
          const oppAtk = this.scorePlacementAt(oc.r, oc.c, opp);
          const oppDef = this.scorePlacementAt(oc.r, oc.c, stone);
          oppScored.push({ r: oc.r, c: oc.c, val: oppAtk * 1.1 + oppDef * 0.7 });
        }
        oppScored.sort((a, b) => b.val - a.val);

        if (strength >= 4 && oppScored.length > 0) {
          // 3-ply check across opponent's top 3 replies
          const oppTop = oppScored.slice(0, 3);
          for (const rep of oppTop) {
            this.grid[rep.r][rep.c] = opp;
            const followCands = this.getCandidateCells();
            let bestFollowUp = 0;
            for (const fc of followCands) {
              const fAtk = this.scorePlacementAt(fc.r, fc.c, stone);
              if (fAtk > bestFollowUp) bestFollowUp = fAtk;
            }
            this.grid[rep.r][rep.c] = 0;
            const oppPressure = rep.val - bestFollowUp * (strength >= 5 ? 0.55 : 0.42);
            if (oppPressure > worstOppNet) worstOppNet = oppPressure;
          }
        } else {
          worstOppNet = oppScored[0]?.val ?? 0;
        }
        this.grid[cand.r][cand.c] = 0;

        const net = cand.score - Math.max(0, worstOppNet) * 0.46;
        if (net > bestCombined) {
          bestCombined = net;
          bestCell = cand;
        }
      }
      return { r: bestCell.r, c: bestCell.c };
    }

    if (strength === 0 && !scored[0].urgent && scored.length >= 2 && this.rng() < 0.32) {
      return { r: scored[1].r, c: scored[1].c };
    }

    return { r: scored[0].r, c: scored[0].c };
  }
}

// ============================================================================
// 6. CỜ VUA PHÙ THỦY 8x8 (TACTICAL PUZZLES & FULL 8x8 ALPHA-BETA MATCH)
// ============================================================================

export type ChessColor = 'w' | 'b';
export type ChessPieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type ChessSubMode = 'tactics' | 'match';

export interface ChessPiece {
  color: ChessColor;
  type: ChessPieceType;
}

export interface ChessMove {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
  promotion?: ChessPieceType;
  isCastleKing?: boolean;
  isCastleQueen?: boolean;
  isEnPassant?: boolean;
  captured?: ChessPiece | null;
}

interface ChessCastlingRights {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
}

interface ChessSnapshot {
  board: (ChessPiece | null)[][];
  turn: ChessColor;
  castling: ChessCastlingRights;
  enPassant: { r: number; c: number } | null;
  capturedByWhite: ChessPieceType[];
  capturedByBlack: ChessPieceType[];
  lastMove: { fromR: number; fromC: number; toR: number; toC: number } | null;
  halfMoveClock: number;
}

interface ChessTacticPreset {
  title: string;
  subtitle: string;
  opponentName: string;
  opponentEmoji: string;
  opponentPortrait: WizardingPortraitKey;
  fen: string;
  tier: 1 | 2 | 3;
}

const CHESS_TACTIC_PRESETS: ReadonlyArray<ChessTacticPreset> = [
  // Tier 1: Mate in 1..2 Onboarding
  {
    title: 'Tháp Hogwarts Xuất Kích',
    subtitle: 'Điều Xe Tháp Hogwarts (♖) tung đòn chiếu bí Chúa tể Voldemort ngay trong 1 nước!',
    opponentName: 'Ron Weasley',
    opponentEmoji: '🦁',
    opponentPortrait: 'ron',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    tier: 1,
  },
  {
    title: 'Ánh Lửa Phượng Hoàng Fawkes',
    subtitle: 'Phối hợp Cụ Dumbledore (♔) & Hermione (♕) khóa chặt Voldemort sát góc bàn!',
    opponentName: 'Ông Arthur Weasley',
    opponentEmoji: '👑',
    opponentPortrait: 'arthur',
    fen: '7k/6p1/5K2/8/6Q1/8/8/8 w - - 0 1',
    tier: 1,
  },
  {
    title: 'Song Tháp Lâu Đài Hogwarts',
    subtitle: 'Khóa hàng 7 và điều hai Xe Tháp Hogwarts (♖) dồn chiếu bí trên hàng 8!',
    opponentName: 'Bà Molly Weasley',
    opponentEmoji: '🏰',
    opponentPortrait: 'molly',
    fen: '4k3/R7/8/8/8/8/8/1R4K1 w - - 0 1',
    tier: 1,
  },
  {
    title: 'Nụ Hôn Giám Ngục Ngộp Thở',
    subtitle: 'Nhảy Bằng Mã Buckbeak (♘) chiếu ngộp Vua Đen bị kẹt giữa hàng rào quân mình!',
    opponentName: 'Ron Weasley',
    opponentEmoji: '🐴',
    opponentPortrait: 'ron',
    fen: '6rk/5Npp/8/8/8/8/6PP/6K1 w - - 0 1',
    tier: 1,
  },
  // Tier 2: Mate in 2 & Double-Attack Combinations
  {
    title: 'Liên Kích Harry & Hermione',
    subtitle: 'Lập trận Hermione (♕) + Harry Potter (♗) nhắm thẳng ô cánh Vua (Chiếu bí liên hoàn)!',
    opponentName: 'Bác Rubeus Hagrid',
    opponentEmoji: '🪄',
    opponentPortrait: 'hagrid',
    fen: '5rk1/5p1p/6p1/8/8/5Q2/1B3PPP/6K1 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Đôi Cánh Bằng Mã Buckbeak',
    subtitle: 'Đưa Bằng Mã Buckbeak (♘) khóa đường thoát để Tháp Hogwarts kết liễu góc bàn!',
    opponentName: 'Ron Weasley',
    opponentEmoji: '🦅',
    opponentPortrait: 'ron',
    fen: '7k/1R6/8/p7/4N3/8/6PP/6K1 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Tàn Cuộc Hội Phượng Hoàng',
    subtitle: 'Siết vòng vây Cụ Dumbledore (♔) và Hermione (♕) chiếu bí Voldemort trên hàng 8!',
    opponentName: 'Ông Arthur Weasley',
    opponentEmoji: '✨',
    opponentPortrait: 'arthur',
    fen: '3k4/8/3K4/8/5Q2/8/8/8 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Thần Hộ Mệnh Đại Sảnh Đường',
    subtitle: 'Tận dụng Harry Potter (♗) đường chéo lớn và Hermione (♕) công phá cánh Vua!',
    opponentName: 'Bác Rubeus Hagrid',
    opponentEmoji: '🔥',
    opponentPortrait: 'hagrid',
    fen: '5rk1/5ppp/8/8/8/2B5/4QPPP/3R2K1 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Song Tượng Xuyên Tâm Hẻm Xéo',
    subtitle: 'Hai Tượng Phù Thủy (♗) cắt chéo khóa chặt góc bàn cho Xe dứt điểm!',
    opponentName: 'Giáo Sư Severus Snape',
    opponentEmoji: '🧪',
    opponentPortrait: 'snape',
    fen: '6k1/5p1p/6p1/8/8/1B6/2B2PPP/4R1K1 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Thang Máy Tháp Thiên Văn',
    subtitle: 'Thí Xe mở toang cột biên rồi đưa Hậu trượt dọc kết liễu!',
    opponentName: 'Giáo Sư Severus Snape',
    opponentEmoji: '🌙',
    opponentPortrait: 'snape',
    fen: '5rk1/5ppp/8/8/8/6Q1/5PPP/R5K1 w - - 0 1',
    tier: 2,
  },
  // Tier 3: Deep Sacrifices, Endgame Studies & Middlegame Storms (Stages 140..777)
  {
    title: 'Đại Chiến Hogwarts Của McGonagall',
    subtitle: 'Phối hợp Hermione, Harry, Buckbeak & Tháp Hogwarts phá vỡ phòng tuyến Hắc Ám!',
    opponentName: 'Giáo Sư McGonagall',
    opponentEmoji: '🎩',
    opponentPortrait: 'professor',
    fen: 'r4rk1/ppp2p1p/6p1/4N3/2B5/5Q2/PPP2PPP/4RRK1 w - - 0 1',
    tier: 3,
  },
  {
    title: 'Lưỡi Gươm Gryffindor Phong Hậu',
    subtitle: 'Đột phá hàng Tốt thông qua lưới Xe Đen để phong Hậu giành chiến thắng tuyệt đối!',
    opponentName: 'Bellatrix Lestrange',
    opponentEmoji: '🐍',
    opponentPortrait: 'bellatrix',
    fen: '2r3k1/1P3ppp/4p3/8/8/5N2/5PPP/2R3K1 w - - 0 1',
    tier: 3,
  },
  {
    title: 'Trận Đồ Đá Cẩm Thạch McGonagall',
    subtitle: 'Điều động Song Xe + Mã + Tượng công phá pháo đài Nhập Thành kiên cố!',
    opponentName: 'Bellatrix Lestrange',
    opponentEmoji: '⚡',
    opponentPortrait: 'bellatrix',
    fen: 'r2q1rk1/pp2ppbp/2np2p1/8/3NP3/2N1B3/PPPQ1PPP/2KR3R w - - 0 1',
    tier: 3,
  },
  {
    title: 'Phá Vỡ Trường Sinh Linh Giá',
    subtitle: 'Dùng Hậu và Mã xuyên thủng trung tâm mở toang lá chắn quanh Chúa Tể Hắc Ám!',
    opponentName: 'Chúa Tể Voldemort',
    opponentEmoji: '💀',
    opponentPortrait: 'voldemort',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQR1K1 w - - 0 1',
    tier: 3,
  },
  {
    title: 'Bão Lửa Phượng Hoàng Tàn Cuộc',
    subtitle: 'Tàn cuộc Xe + Mã + Tốt chống Xe + Tượng đòi hỏi tính toán chính xác từng nhịp!',
    opponentName: 'Chúa Tể Voldemort',
    opponentEmoji: '🦅',
    opponentPortrait: 'voldemort',
    fen: '4r1k1/p4ppp/1p2b3/3pN3/3P4/2P5/PP3PPP/4R1K1 w - - 0 1',
    tier: 3,
  },
  {
    title: 'Đỉnh Tháp Sấm Sét Priori Incantatem',
    subtitle: 'Thế cờ cân não giữa Đại Sảnh Đường — chỉ 1 chuỗi phối hợp chuẩn xác mới hạ gục Voldemort!',
    opponentName: 'Chúa Tể Voldemort',
    opponentEmoji: '👑',
    opponentPortrait: 'voldemort',
    fen: '2rq1rk1/pb1nbppp/1p2pn2/3p4/2PP4/1PN1PN2/PB1QBPPP/2R2RK1 w - - 0 1',
    tier: 3,
  },
];

const STANDARD_CHESS_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const CHESS_MATCH_TABIYA_FENS: ReadonlyArray<{ label: string; fen: string }> = [
  { label: 'Khai Cuộc Kinh Điển Đại Sảnh', fen: STANDARD_CHESS_FEN },
  {
    label: 'Thế Trận Ý Giuoco Piano',
    fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  },
  {
    label: 'Gambit Hậu Tháp Ravenclaw',
    fen: 'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  },
  {
    label: 'Phòng Thủ Rồng Hungary (Sicilian)',
    fen: 'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  },
  {
    label: 'Tấn Công Tây Ban Nha Ruy Lopez',
    fen: 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  },
  {
    label: 'Pháo Đài Pháp Đá Phiến',
    fen: 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  },
  {
    label: 'Lá Chắn Ấn Độ Cánh Vua',
    fen: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 3 6',
  },
  {
    label: 'Đối Công Đối Xứng Bốn Mã',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4',
  },
  {
    label: 'Phòng Tuyến Caro-Kann Cổ Ngữ',
    fen: 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 3',
  },
  {
    label: 'Thành Lũy Slav Đá Cẩm Thạch',
    fen: 'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 4',
  },
  {
    label: 'Khai Cuộc Anh Cánh Hậu (English)',
    fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 2 3',
  },
  {
    label: 'Đột Kích Trung Tâm Scotland (Scotch)',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 3',
  },
  {
    label: 'Tháp Nhọn Hệ Thống London',
    fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 2 3',
  },
  {
    label: 'Gọng Kìm Nimzo-Indian Hẻm Xéo',
    fen: 'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
  },
  {
    label: 'Đường Chéo Phượng Hoàng Catalan',
    fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq - 0 4',
  },
  {
    label: 'Mê Cung Scheveningen Slytherin',
    fen: 'r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 6',
  },
];

function mirrorFenHorizontally(fen: string): string {
  const parts = fen.trim().split(/\s+/);
  if ((parts[2] ?? '-') !== '-') return fen; // Only mirror positions without castling rights
  const mirroredRows = parts[0]
    .split('/')
    .map((row) => row.split('').reverse().join(''))
    .join('/');
  return [mirroredRows, parts[1] ?? 'w', '-', '-', parts[4] ?? '0', parts[5] ?? '1'].join(' ');
}

interface ResolvedChessTacticEntry {
  preset: ChessTacticPreset;
  fen: string;
  mirrored: boolean;
}

const CHESS_UNIQUE_TACTICS_DECK: ReadonlyArray<ResolvedChessTacticEntry> = (() => {
  const combined: ReadonlyArray<ChessTacticPreset> = [
    ...CHESS_TACTIC_PRESETS,
    ...(EXTRA_CHESS_TACTICS as ReadonlyArray<ChessTacticPreset>),
  ];
  const seenPlacements = new Set<string>();
  const takeUnique = (items: ReadonlyArray<ChessTacticPreset>, mirror: boolean): ResolvedChessTacticEntry[] => {
    const out: ResolvedChessTacticEntry[] = [];
    for (const preset of items) {
      const fen = mirror ? mirrorFenHorizontally(preset.fen) : preset.fen.trim();
      const placement = fen.split(/\s+/)[0];
      if (seenPlacements.has(placement)) continue;
      seenPlacements.add(placement);
      out.push({ preset, fen, mirrored: mirror });
    }
    return out;
  };

  const t1 = combined.filter((p) => p.tier === 1);
  const t2 = combined.filter((p) => p.tier === 2);
  const t3 = combined.filter((p) => p.tier === 3);

  const u1 = takeUnique(t1, false);
  const u2 = takeUnique(t2, false);
  const u3 = takeUnique(t3, false);
  const m3 = takeUnique(t3, true);
  const m2 = takeUnique(t2, true);
  const m1 = takeUnique(t1, true);

  // Ordinals 0..14 (stage <= 25): Tier 1
  // Ordinals 15..55 (26 <= stage <= 150, 41 stages): Tier 2
  // Ordinals 56..264 (151 <= stage <= 777, 209 stages): Tier 3 + mirrored Tier 3 + advanced Tier 2
  return [
    ...u1.slice(0, 15),
    ...u2.slice(0, 41),
    ...u3,
    ...m3,
    ...u2.slice(41),
    ...m2,
    ...u1.slice(15),
    ...m1,
  ];
})();

function getChessTacticalOrdinal(stage: number): number {
  if (stage <= 10) return Math.max(0, stage - 1); // 0..9
  if ((stage - 13) % 3 === 0) {
    return 10 + Math.floor((stage - 13) / 3); // 10..264 across stages 13..775
  }
  // Fallback for forced 'tactics' in unit tests on non-default stages > 10
  return 265 + stage;
}

const PIECE_VALUES: Record<ChessPieceType, number> = {
  p: 100,
  n: 320,
  b: 335,
  r: 500,
  q: 920,
  k: 20000,
};

const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [14, 14, 22, 32, 32, 22, 14, 14],
  [6, 6, 12, 26, 26, 12, 6, 6],
  [0, 0, 4, 22, 22, 4, 0, 0],
  [4, -4, -8, 4, 4, -8, -4, 4],
  [4, 10, 10, -18, -18, 10, 10, 4],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_PST = [
  [-45, -35, -25, -25, -25, -25, -35, -45],
  [-35, -15, 0, 4, 4, 0, -15, -35],
  [-25, 4, 14, 18, 18, 14, 4, -25],
  [-25, 6, 18, 24, 24, 18, 6, -25],
  [-25, 4, 18, 24, 24, 18, 4, -25],
  [-25, 6, 14, 18, 18, 14, 6, -25],
  [-35, -15, 0, 6, 6, 0, -15, -35],
  [-45, -35, -25, -25, -25, -25, -35, -45],
];

const CENTER_PST = [
  [-18, -10, -10, -8, -8, -10, -10, -18],
  [-10, 0, 4, 6, 6, 4, 0, -10],
  [-10, 4, 10, 12, 12, 10, 4, -10],
  [-8, 6, 12, 16, 16, 12, 6, -8],
  [-8, 6, 12, 16, 16, 12, 6, -8],
  [-10, 4, 10, 12, 12, 10, 4, -10],
  [-10, 0, 4, 6, 6, 4, 0, -10],
  [-18, -10, -10, -8, -8, -10, -10, -18],
];

function cloneChessBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export interface ChessWorkerSearchPayload {
  stage: number;
  board: (ChessPiece | null)[][];
  turn: ChessColor;
  castling: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
  enPassant: { r: number; c: number } | null;
}

const CHESS_REVIEW_GLYPHS: Record<ChessPieceType, string> = {
  p: '♙',
  n: '♘',
  b: '♗',
  r: '♖',
  q: '♕',
  k: '♔',
};

function formatChessSquareVi(r: number, c: number): string {
  const file = String.fromCharCode(97 + Math.max(0, Math.min(7, c)));
  const rank = 8 - Math.max(0, Math.min(7, r));
  return `${file}${rank}`;
}

function formatChessMoveReviewVi(
  boardBefore: (ChessPiece | null)[][],
  mv: ChessMove
): string {
  const piece = boardBefore[mv.fromR]?.[mv.fromC];
  const glyph = piece ? CHESS_REVIEW_GLYPHS[piece.type] : '🪄';
  if (mv.isCastleKing) return `${glyph} 0-0`;
  if (mv.isCastleQueen) return `${glyph} 0-0-0`;
  const sep = mv.captured || mv.isEnPassant ? '×' : '→';
  const promo = mv.promotion ? `=${CHESS_REVIEW_GLYPHS[mv.promotion]}` : '';
  return `${glyph}${formatChessSquareVi(mv.fromR, mv.fromC)}${sep}${formatChessSquareVi(mv.toR, mv.toC)}${promo}`;
}

export class WizardChessEngine {
  public readonly stage: number;
  public readonly subMode: ChessSubMode;
  public readonly subModeLocked: boolean;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly title: string;
  public readonly subtitle: string;
  public readonly opponentName: string;
  public readonly opponentEmoji: string;
  public readonly opponentPortrait: WizardingPortraitKey;
  public readonly reward: PuzzleRewardSpec;
  public readonly assistGoldCost: number;
  public readonly undoGoldCost: number;

  public board: (ChessPiece | null)[][] = [];
  public turn: ChessColor = 'w';
  public castling: ChessCastlingRights = { wK: false, wQ: false, bK: false, bQ: false };
  public enPassant: { r: number; c: number } | null = null;
  public capturedByWhite: ChessPieceType[] = [];
  public capturedByBlack: ChessPieceType[] = [];
  public lastMove: { fromR: number; fromC: number; toR: number; toC: number } | null = null;
  public hintMove: { fromR: number; fromC: number; toR: number; toC: number } | null = null;
  public selected: { r: number; c: number } | null = null;
  public halfMoveClock = 0;
  public moveCount = 0;
  public freeUndosLeft: number;
  public paidUndosLeft: number;
  public freeHintsLeft: number;
  public paidAssistsLeft: number;
  public loadedFen = '';
  public talismanUsed = false;
  public status: 'playing' | 'ai_thinking' | 'won' | 'lost' | 'draw' = 'playing';

  private history: ChessSnapshot[] = [];
  private whiteTurnReviews: Array<{
    plyNumber: number;
    boardBefore: (ChessPiece | null)[][];
    castlingBefore: ChessCastlingRights;
    epBefore: { r: number; c: number } | null;
    playedMove: ChessMove;
    evalBefore: number;
    evalAfter: number;
  }> = [];
  private cachedTurningPoint: TurningPointReview | null = null;

  constructor(stage: number, forceSubMode?: ChessSubMode) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    const defaultSubMode: ChessSubMode =
      this.stage <= 10
        ? this.stage % 2 === 1
          ? 'tactics'
          : 'match'
        : this.stage % 3 === 1
          ? 'tactics'
          : 'match';
    this.subModeLocked = isArcadeSubModeLocked(this.stage);
    this.subMode = this.subModeLocked ? defaultSubMode : (forceSubMode ?? defaultSubMode);

    const tier = getMinigameDifficultyTier(this.stage);
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    this.difficultyLabel = this.milestoneBoss
      ? `👑 Đại Trùm Mốc ${this.stage}`
      : `${tier.badgeEmoji} ${tier.label}`;
    this.freeUndosLeft = this.stage <= 15 ? 1 : 0;
    this.paidUndosLeft = this.stage <= 120 ? 2 : 1;
    this.freeHintsLeft = this.stage <= 10 ? 1 : 0;
    this.paidAssistsLeft = 1; // Strictly max 1 paid assist per stage — no auto-play spamming!
    this.assistGoldCost = Math.min(280, 110 + Math.floor(this.stage / 5));
    this.undoGoldCost = Math.min(220, 65 + Math.floor(this.stage / 7));

    if (this.subMode === 'tactics') {
      const ord = getChessTacticalOrdinal(this.stage);
      const entry = CHESS_UNIQUE_TACTICS_DECK[ord % CHESS_UNIQUE_TACTICS_DECK.length];
      const { preset, fen: fenToLoad, mirrored: useMirrored } = entry;
      this.title = this.milestoneBoss
        ? `👑 ${this.milestoneBoss.bossTitleVi} • ${preset.title}`
        : `Cờ Phù Thủy • ${preset.title}${useMirrored ? ' (Đối Ảnh)' : ''}`;
      this.subtitle = preset.subtitle;
      this.opponentName = this.milestoneBoss ? this.milestoneBoss.bossGuardianVi : preset.opponentName;
      this.opponentEmoji = this.milestoneBoss ? '👑' : preset.opponentEmoji;
      this.opponentPortrait =
        this.milestoneBoss && this.stage >= 500
          ? 'voldemort'
          : this.milestoneBoss && this.stage >= 200
            ? 'professor'
            : preset.opponentPortrait;
      this.loadFen(fenToLoad);
    } else {
      const matchOpponents: ReadonlyArray<{
        name: string;
        emoji: string;
        portrait: WizardingPortraitKey;
        sub: string;
      }> = [
        {
          name: 'Ron Weasley',
          emoji: '🦁',
          portrait: 'ron',
          sub: 'Đại chiến 8×8 Hội Phượng Hoàng đấu Slytherin — Nhập thành & phong Hậu đầy đủ!',
        },
        {
          name: 'Ông Arthur Weasley',
          emoji: '🔧',
          portrait: 'arthur',
          sub: 'Điều Bằng Mã Buckbeak, Harry Potter & Dobby kiểm soát trung tâm bàn cờ!',
        },
        {
          name: 'Bác Rubeus Hagrid',
          emoji: '🎃',
          portrait: 'hagrid',
          sub: 'Cẩn thận Vong Mã Thestral & Tháp Azkaban của phe Slytherin phản kích!',
        },
        {
          name: 'Giáo Sư Severus Snape',
          emoji: '🧪',
          portrait: 'snape',
          sub: 'Chiến thuật phòng ngự phản công sắc lạnh từ bậc thầy Độc Dược!',
        },
        {
          name: 'Giáo Sư McGonagall',
          emoji: '🎩',
          portrait: 'professor',
          sub: 'Đại chiến Cờ Phù Thủy chuẩn mực giữa Đại Sảnh Đường Hogwarts!',
        },
        {
          name: 'Chúa Tể Voldemort',
          emoji: '⚡',
          portrait: 'voldemort',
          sub: 'Trận chiến tối thượng cấp Đại Kiện Tướng — sơ sẩy 1 nước là sụp đổ!',
        },
      ];
      const oppIdx = this.milestoneBoss
        ? this.stage >= 400
          ? matchOpponents.length - 1
          : this.stage >= 150
            ? 4
            : 3
        : this.stage === MAX_MINIGAME_STAGE
          ? matchOpponents.length - 1
          : this.stage <= 30
            ? Math.floor((this.stage - 1) / 2) % 3
            : this.stage <= 220
              ? 2 + (Math.floor((this.stage - 1) / 2) % 3)
              : 3 + (Math.floor((this.stage - 1) / 2) % 3);
      const opp = matchOpponents[oppIdx];
      const tabiya =
        this.stage < 18
          ? CHESS_MATCH_TABIYA_FENS[0]
          : CHESS_MATCH_TABIYA_FENS[this.stage % CHESS_MATCH_TABIYA_FENS.length];
      this.title = this.milestoneBoss
        ? `👑 ${this.milestoneBoss.bossTitleVi} • Đấu Với ${opp.name}`
        : `Cờ Phù Thủy 8×8 • Đấu Với ${opp.name}`;
      this.subtitle = `${tabiya.label} — ${opp.sub}`;
      this.opponentName = opp.name;
      this.opponentEmoji = this.milestoneBoss ? '👑' : opp.emoji;
      this.opponentPortrait = opp.portrait;
      this.loadFen(tabiya.fen);
    }

    const stars = getStageStarReward(this.stage);
    const effectiveCap = Math.min(this.stage, 260) + Math.floor(Math.max(0, this.stage - 260) * 0.35);
    this.reward = {
      stars,
      sand:
        this.stage === MAX_MINIGAME_STAGE
          ? 5
          : this.milestoneBoss || this.stage % 10 === 0 || this.subMode === 'match'
            ? 2
            : 1,
      gold: Math.round(110 + effectiveCap * 4.6 + stars * 22),
      xp: Math.round(70 + effectiveCap * 3.2 + stars * 15),
      isMasterpiece: Boolean(this.milestoneBoss) || this.subMode === 'match' || this.stage % 10 === 0,
    };
  }

  private loadFen(fen: string): void {
    this.loadedFen = fen.trim();
    const parts = this.loadedFen.split(/\s+/);
    const rows = parts[0].split('/');
    this.board = Array.from({ length: 8 }, () => Array<ChessPiece | null>(8).fill(null));

    for (let r = 0; r < 8; r++) {
      let c = 0;
      for (const ch of rows[r] ?? '') {
        if (ch >= '1' && ch <= '8') {
          c += Number(ch);
        } else {
          const color: ChessColor = ch === ch.toUpperCase() ? 'w' : 'b';
          const type = ch.toLowerCase() as ChessPieceType;
          if (c < 8) {
            this.board[r][c] = { color, type };
            c++;
          }
        }
      }
    }

    this.turn = parts[1] === 'b' ? 'b' : 'w';
    const cast = parts[2] ?? '-';
    this.castling = {
      wK: cast.includes('K'),
      wQ: cast.includes('Q'),
      bK: cast.includes('k'),
      bQ: cast.includes('q'),
    };
    const ep = parts[3] ?? '-';
    if (ep.length === 2) {
      const file = ep.charCodeAt(0) - 97;
      const rank = 8 - Number(ep[1]);
      this.enPassant = file >= 0 && file < 8 && rank >= 0 && rank < 8 ? { r: rank, c: file } : null;
    } else {
      this.enPassant = null;
    }
    this.capturedByWhite = [];
    this.capturedByBlack = [];
    this.lastMove = null;
    this.hintMove = null;
    this.selected = null;
    this.halfMoveClock = 0;
    this.moveCount = 0;
    this.history = [];
    this.whiteTurnReviews = [];
    this.cachedTurningPoint = null;
    this.status = 'playing';
  }

  private saveSnapshot(): void {
    this.history.push({
      board: cloneChessBoard(this.board),
      turn: this.turn,
      castling: { ...this.castling },
      enPassant: this.enPassant ? { ...this.enPassant } : null,
      capturedByWhite: [...this.capturedByWhite],
      capturedByBlack: [...this.capturedByBlack],
      lastMove: this.lastMove ? { ...this.lastMove } : null,
      halfMoveClock: this.halfMoveClock,
    });
  }

  private restoreSnapshot(snap: ChessSnapshot): void {
    this.board = cloneChessBoard(snap.board);
    this.turn = snap.turn;
    this.castling = { ...snap.castling };
    this.enPassant = snap.enPassant ? { ...snap.enPassant } : null;
    this.capturedByWhite = [...snap.capturedByWhite];
    this.capturedByBlack = [...snap.capturedByBlack];
    this.lastMove = snap.lastMove ? { ...snap.lastMove } : null;
    this.halfMoveClock = snap.halfMoveClock;
  }

  public findKing(color: ChessColor, board = this.board): { r: number; c: number } | null {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.color === color && p.type === 'k') {
          return { r, c };
        }
      }
    }
    return null;
  }

  public isSquareAttacked(
    board: (ChessPiece | null)[][],
    r: number,
    c: number,
    byColor: ChessColor
  ): boolean {
    // Pawn attacks
    const pawnRow = byColor === 'w' ? r + 1 : r - 1;
    if (pawnRow >= 0 && pawnRow < 8) {
      for (const dc of [-1, 1]) {
        const pc = c + dc;
        if (pc >= 0 && pc < 8) {
          const p = board[pawnRow][pc];
          if (p && p.color === byColor && p.type === 'p') return true;
        }
      }
    }

    // Knight attacks
    const kJumps = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of kJumps) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = board[nr][nc];
        if (p && p.color === byColor && p.type === 'n') return true;
      }
    }

    // King adjacency
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const p = board[nr][nc];
          if (p && p.color === byColor && p.type === 'k') return true;
        }
      }
    }

    // Orthogonal rays (Rook / Queen)
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === byColor && (p.type === 'r' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // Diagonal rays (Bishop / Queen)
    for (const [dr, dc] of [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === byColor && (p.type === 'b' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    return false;
  }

  public isInCheck(color: ChessColor, board = this.board): boolean {
    const k = this.findKing(color, board);
    if (!k) return true;
    const opp: ChessColor = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(board, k.r, k.c, opp);
  }

  private generatePseudoMovesForSquare(
    board: (ChessPiece | null)[][],
    r: number,
    c: number,
    castling: ChessCastlingRights,
    enPassant: { r: number; c: number } | null
  ): ChessMove[] {
    const piece = board[r][c];
    if (!piece) return [];
    const { color, type } = piece;
    const opp: ChessColor = color === 'w' ? 'b' : 'w';
    const moves: ChessMove[] = [];

    if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRank = color === 'w' ? 6 : 1;
      const promoRank = color === 'w' ? 0 : 7;
      const nr = r + dir;

      if (nr >= 0 && nr < 8 && !board[nr][c]) {
        moves.push({
          fromR: r,
          fromC: c,
          toR: nr,
          toC: c,
          promotion: nr === promoRank ? 'q' : undefined,
        });
        const nr2 = r + dir * 2;
        if (r === startRank && !board[nr2][c]) {
          moves.push({ fromR: r, fromC: c, toR: nr2, toC: c });
        }
      }

      for (const dc of [-1, 1]) {
        const nc = c + dc;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) continue;
        const target = board[nr][nc];
        if (target && target.color === opp) {
          moves.push({
            fromR: r,
            fromC: c,
            toR: nr,
            toC: nc,
            captured: target,
            promotion: nr === promoRank ? 'q' : undefined,
          });
        } else if (enPassant && enPassant.r === nr && enPassant.c === nc) {
          const epCap = board[r][nc];
          if (epCap && epCap.color === opp && epCap.type === 'p') {
            moves.push({
              fromR: r,
              fromC: c,
              toR: nr,
              toC: nc,
              isEnPassant: true,
              captured: epCap,
            });
          }
        }
      }
      return moves;
    }

    if (type === 'n') {
      for (const [dr, dc] of [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) continue;
        const tgt = board[nr][nc];
        if (!tgt || tgt.color === opp) {
          moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, captured: tgt });
        }
      }
      return moves;
    }

    if (type === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) continue;
          const tgt = board[nr][nc];
          if (!tgt || tgt.color === opp) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, captured: tgt });
          }
        }
      }

      // Castling
      const homeRow = color === 'w' ? 7 : 0;
      if (r === homeRow && c === 4 && !this.isSquareAttacked(board, homeRow, 4, opp)) {
        const canK = color === 'w' ? castling.wK : castling.bK;
        if (
          canK &&
          !board[homeRow][5] &&
          !board[homeRow][6] &&
          board[homeRow][7]?.color === color &&
          board[homeRow][7]?.type === 'r' &&
          !this.isSquareAttacked(board, homeRow, 5, opp) &&
          !this.isSquareAttacked(board, homeRow, 6, opp)
        ) {
          moves.push({ fromR: homeRow, fromC: 4, toR: homeRow, toC: 6, isCastleKing: true });
        }

        const canQ = color === 'w' ? castling.wQ : castling.bQ;
        if (
          canQ &&
          !board[homeRow][1] &&
          !board[homeRow][2] &&
          !board[homeRow][3] &&
          board[homeRow][0]?.color === color &&
          board[homeRow][0]?.type === 'r' &&
          !this.isSquareAttacked(board, homeRow, 3, opp) &&
          !this.isSquareAttacked(board, homeRow, 2, opp)
        ) {
          moves.push({ fromR: homeRow, fromC: 4, toR: homeRow, toC: 2, isCastleQueen: true });
        }
      }
      return moves;
    }

    const dirs: Array<[number, number]> = [];
    if (type === 'r' || type === 'q') {
      dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    }
    if (type === 'b' || type === 'q') {
      dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }

    for (const [dr, dc] of dirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const tgt = board[nr][nc];
        if (!tgt) {
          moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        } else {
          if (tgt.color === opp) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, captured: tgt });
          }
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
    return moves;
  }

  private applyMoveOnBoard(
    board: (ChessPiece | null)[][],
    castling: ChessCastlingRights,
    mv: ChessMove
  ): {
    nextBoard: (ChessPiece | null)[][];
    nextCastling: ChessCastlingRights;
    nextEp: { r: number; c: number } | null;
  } {
    const nextBoard = cloneChessBoard(board);
    const nextCastling = { ...castling };
    let nextEp: { r: number; c: number } | null = null;

    const moving = nextBoard[mv.fromR][mv.fromC];
    if (!moving) {
      return { nextBoard, nextCastling, nextEp };
    }

    nextBoard[mv.fromR][mv.fromC] = null;
    if (mv.isEnPassant) {
      nextBoard[mv.fromR][mv.toC] = null;
    }

    nextBoard[mv.toR][mv.toC] = {
      color: moving.color,
      type: mv.promotion ?? moving.type,
    };

    if (mv.isCastleKing) {
      nextBoard[mv.fromR][5] = nextBoard[mv.fromR][7];
      nextBoard[mv.fromR][7] = null;
    } else if (mv.isCastleQueen) {
      nextBoard[mv.fromR][3] = nextBoard[mv.fromR][0];
      nextBoard[mv.fromR][0] = null;
    }

    if (moving.type === 'p' && Math.abs(mv.toR - mv.fromR) === 2) {
      nextEp = { r: (mv.fromR + mv.toR) >> 1, c: mv.fromC };
    }

    // Update castling rights if King or corner Rooks move/are captured
    if (moving.type === 'k') {
      if (moving.color === 'w') {
        nextCastling.wK = false;
        nextCastling.wQ = false;
      } else {
        nextCastling.bK = false;
        nextCastling.bQ = false;
      }
    }
    if ((mv.fromR === 7 && mv.fromC === 7) || (mv.toR === 7 && mv.toC === 7)) nextCastling.wK = false;
    if ((mv.fromR === 7 && mv.fromC === 0) || (mv.toR === 7 && mv.toC === 0)) nextCastling.wQ = false;
    if ((mv.fromR === 0 && mv.fromC === 7) || (mv.toR === 0 && mv.toC === 7)) nextCastling.bK = false;
    if ((mv.fromR === 0 && mv.fromC === 0) || (mv.toR === 0 && mv.toC === 0)) nextCastling.bQ = false;

    return { nextBoard, nextCastling, nextEp };
  }

  public getLegalMovesFrom(r: number, c: number): ChessMove[] {
    const p = this.board[r]?.[c];
    if (!p || p.color !== this.turn) return [];
    const pseudo = this.generatePseudoMovesForSquare(
      this.board,
      r,
      c,
      this.castling,
      this.enPassant
    );
    return pseudo.filter((mv) => {
      const { nextBoard } = this.applyMoveOnBoard(this.board, this.castling, mv);
      return !this.isInCheck(p.color, nextBoard);
    });
  }

  private getAllLegalMovesForState(
    board: (ChessPiece | null)[][],
    color: ChessColor,
    castling: ChessCastlingRights,
    ep: { r: number; c: number } | null
  ): ChessMove[] {
    const all: ChessMove[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.color !== color) continue;
        const pseudo = this.generatePseudoMovesForSquare(board, r, c, castling, ep);
        for (const mv of pseudo) {
          const { nextBoard } = this.applyMoveOnBoard(board, castling, mv);
          if (!this.isInCheck(color, nextBoard)) {
            all.push(mv);
          }
        }
      }
    }
    return all;
  }

  private isInsufficientMaterial(board: (ChessPiece | null)[][]): boolean {
    const minors: ChessPieceType[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p || p.type === 'k') continue;
        if (p.type === 'p' || p.type === 'r' || p.type === 'q') return false;
        minors.push(p.type);
      }
    }
    return minors.length <= 1;
  }

  private commitMove(mv: ChessMove): WizardChessEngine['status'] {
    this.saveSnapshot();
    this.cachedTurningPoint = null;
    const moving = this.board[mv.fromR][mv.fromC]!;
    const isWhiteTurn = moving.color === 'w';
    const boardBeforeWhite = isWhiteTurn ? cloneChessBoard(this.board) : null;
    const castlingBeforeWhite = isWhiteTurn ? { ...this.castling } : null;
    const epBeforeWhite = isWhiteTurn && this.enPassant ? { ...this.enPassant } : null;
    const evalBeforeWhite = isWhiteTurn ? this.evaluateBoardWhiteScore(this.board) : 0;

    const { nextBoard, nextCastling, nextEp } = this.applyMoveOnBoard(this.board, this.castling, mv);

    if (mv.captured) {
      if (moving.color === 'w') {
        this.capturedByWhite.push(mv.captured.type);
      } else {
        this.capturedByBlack.push(mv.captured.type);
      }
    }

    this.board = nextBoard;
    this.castling = nextCastling;
    this.enPassant = nextEp;
    this.lastMove = { fromR: mv.fromR, fromC: mv.fromC, toR: mv.toR, toC: mv.toC };
    this.hintMove = null;
    this.selected = null;
    this.moveCount += 1;
    this.halfMoveClock = moving.type === 'p' || mv.captured ? 0 : this.halfMoveClock + 1;
    this.turn = moving.color === 'w' ? 'b' : 'w';

    // Evaluate terminal checkmate / stalemate / draw for the next side to move
    const nextLegal = this.getAllLegalMovesForState(
      this.board,
      this.turn,
      this.castling,
      this.enPassant
    );
    if (nextLegal.length === 0) {
      if (this.isInCheck(this.turn, this.board)) {
        this.status = this.turn === 'b' ? 'won' : 'lost';
      } else {
        this.status = 'draw';
      }
      if (isWhiteTurn && boardBeforeWhite && castlingBeforeWhite) {
        this.whiteTurnReviews.push({
          plyNumber: Math.max(1, Math.ceil(this.moveCount / 2)),
          boardBefore: boardBeforeWhite,
          castlingBefore: castlingBeforeWhite,
          epBefore: epBeforeWhite,
          playedMove: { ...mv },
          evalBefore: evalBeforeWhite,
          evalAfter: this.status === 'won' ? 90000 : 0,
        });
      }
      return this.status;
    }

    if (this.halfMoveClock >= 80 || this.isInsufficientMaterial(this.board)) {
      this.status = 'draw';
      if (isWhiteTurn && boardBeforeWhite && castlingBeforeWhite) {
        this.whiteTurnReviews.push({
          plyNumber: Math.max(1, Math.ceil(this.moveCount / 2)),
          boardBefore: boardBeforeWhite,
          castlingBefore: castlingBeforeWhite,
          epBefore: epBeforeWhite,
          playedMove: { ...mv },
          evalBefore: evalBeforeWhite,
          evalAfter: 0,
        });
      }
      return this.status;
    }

    this.status = this.turn === 'b' ? 'ai_thinking' : 'playing';
    if (isWhiteTurn && boardBeforeWhite && castlingBeforeWhite) {
      this.whiteTurnReviews.push({
        plyNumber: Math.max(1, Math.ceil(this.moveCount / 2)),
        boardBefore: boardBeforeWhite,
        castlingBefore: castlingBeforeWhite,
        epBefore: epBeforeWhite,
        playedMove: { ...mv },
        evalBefore: evalBeforeWhite,
        evalAfter: this.evaluateBoardWhiteScore(this.board),
      });
    }
    return this.status;
  }

  public clickSquare(r: number, c: number): {
    moved: boolean;
    captured: boolean;
    promoted: boolean;
    won: boolean;
    draw: boolean;
    aiThinking: boolean;
  } {
    if (this.status !== 'playing' || this.turn !== 'w' || r < 0 || r >= 8 || c < 0 || c >= 8) {
      return {
        moved: false,
        captured: false,
        promoted: false,
        won: false,
        draw: false,
        aiThinking: false,
      };
    }

    if (this.selected) {
      const legal = this.getLegalMovesFrom(this.selected.r, this.selected.c);
      const chosen = legal.find((m) => m.toR === r && m.toC === c);
      if (chosen) {
        const nextStatus = this.commitMove(chosen);
        return {
          moved: true,
          captured: Boolean(chosen.captured),
          promoted: Boolean(chosen.promotion),
          won: nextStatus === 'won',
          draw: nextStatus === 'draw',
          aiThinking: nextStatus === 'ai_thinking',
        };
      }
    }

    const clickedPiece = this.board[r][c];
    if (clickedPiece && clickedPiece.color === 'w') {
      this.selected =
        this.selected && this.selected.r === r && this.selected.c === c ? null : { r, c };
    } else {
      this.selected = null;
    }
    return {
      moved: false,
      captured: false,
      promoted: false,
      won: false,
      draw: false,
      aiThinking: false,
    };
  }

  private evaluateBoardWhiteScore(board: (ChessPiece | null)[][]): number {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p) continue;
        const pr = p.color === 'w' ? r : 7 - r;
        let pst = 0;
        if (p.type === 'p') pst = PAWN_PST[pr][c];
        else if (p.type === 'n') pst = KNIGHT_PST[pr][c];
        else if (p.type !== 'k') pst = CENTER_PST[pr][c];

        const val = PIECE_VALUES[p.type] + pst;
        score += p.color === 'w' ? val : -val;
      }
    }
    return score;
  }

  private searchAlphaBeta(
    board: (ChessPiece | null)[][],
    color: ChessColor,
    castling: ChessCastlingRights,
    ep: { r: number; c: number } | null,
    depth: number,
    alpha: number,
    beta: number
  ): { score: number; move: ChessMove | null } {
    const legal = this.getAllLegalMovesForState(board, color, castling, ep);
    if (legal.length === 0) {
      if (this.isInCheck(color, board)) {
        // Prefer faster checkmates (`+ depth * 100`)
        const mateScore = color === 'w' ? -90000 - depth * 120 : 90000 + depth * 120;
        return { score: mateScore, move: null };
      }
      return { score: 0, move: null };
    }

    if (depth <= 0) {
      if (this.stage >= 90) {
        return {
          score: this.searchQuiescence(board, color, castling, ep, 2, alpha, beta),
          move: null,
        };
      }
      return { score: this.evaluateBoardWhiteScore(board), move: null };
    }

    // MVV-LVA move ordering for tight Alpha-Beta cutoffs
    legal.sort((a, b) => {
      const sa = (a.captured ? PIECE_VALUES[a.captured.type] * 10 : 0) + (a.promotion ? 8000 : 0);
      const sb = (b.captured ? PIECE_VALUES[b.captured.type] * 10 : 0) + (b.promotion ? 8000 : 0);
      return sb - sa;
    });

    let bestMove: ChessMove | null = legal[0];
    if (color === 'w') {
      let bestScore = -Infinity;
      for (const mv of legal) {
        const { nextBoard, nextCastling, nextEp } = this.applyMoveOnBoard(board, castling, mv);
        const reply = this.searchAlphaBeta(
          nextBoard,
          'b',
          nextCastling,
          nextEp,
          depth - 1,
          alpha,
          beta
        );
        if (reply.score > bestScore) {
          bestScore = reply.score;
          bestMove = mv;
        }
        if (bestScore > alpha) alpha = bestScore;
        if (beta <= alpha) break;
      }
      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      for (const mv of legal) {
        const { nextBoard, nextCastling, nextEp } = this.applyMoveOnBoard(board, castling, mv);
        const reply = this.searchAlphaBeta(
          nextBoard,
          'w',
          nextCastling,
          nextEp,
          depth - 1,
          alpha,
          beta
        );
        if (reply.score < bestScore) {
          bestScore = reply.score;
          bestMove = mv;
        }
        if (bestScore < beta) beta = bestScore;
        if (beta <= alpha) break;
      }
      return { score: bestScore, move: bestMove };
    }
  }

  private searchQuiescence(
    board: (ChessPiece | null)[][],
    color: ChessColor,
    castling: ChessCastlingRights,
    ep: { r: number; c: number } | null,
    qDepth: number,
    alpha: number,
    beta: number
  ): number {
    const standPat = this.evaluateBoardWhiteScore(board);
    if (qDepth <= 0) return standPat;

    if (color === 'w') {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;
    } else {
      if (standPat <= alpha) return alpha;
      if (standPat < beta) beta = standPat;
    }

    const captures = this.getAllLegalMovesForState(board, color, castling, ep).filter(
      (m) => Boolean(m.captured) || Boolean(m.promotion)
    );
    if (captures.length === 0) return standPat;

    captures.sort((a, b) => {
      const sa = (a.captured ? PIECE_VALUES[a.captured.type] : 0) + (a.promotion ? 900 : 0);
      const sb = (b.captured ? PIECE_VALUES[b.captured.type] : 0) + (b.promotion ? 900 : 0);
      return sb - sa;
    });

    if (color === 'w') {
      let best = standPat;
      for (const mv of captures.slice(0, 6)) {
        const { nextBoard, nextCastling, nextEp } = this.applyMoveOnBoard(board, castling, mv);
        const score = this.searchQuiescence(nextBoard, 'b', nextCastling, nextEp, qDepth - 1, alpha, beta);
        if (score > best) best = score;
        if (best > alpha) alpha = best;
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = standPat;
      for (const mv of captures.slice(0, 6)) {
        const { nextBoard, nextCastling, nextEp } = this.applyMoveOnBoard(board, castling, mv);
        const score = this.searchQuiescence(nextBoard, 'w', nextCastling, nextEp, qDepth - 1, alpha, beta);
        if (score < best) best = score;
        if (best < beta) beta = best;
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  public exportWorkerPayload(): ChessWorkerSearchPayload {
    return {
      stage: this.stage,
      board: cloneChessBoard(this.board),
      turn: this.turn,
      castling: { ...this.castling },
      enPassant: this.enPassant ? { ...this.enPassant } : null,
    };
  }

  public computeBestAiMoveOnly(): ChessMove | null {
    if (this.turn !== 'b') return null;
    const legalCount = this.getAllLegalMovesForState(
      this.board,
      'b',
      this.castling,
      this.enPassant
    ).length;
    if (legalCount === 0) return null;
    const depth =
      this.stage <= 15
        ? 2
        : this.stage <= 320
          ? 3
          : legalCount <= 22
            ? 4
            : 3;
    const res = this.searchAlphaBeta(
      this.board,
      'b',
      this.castling,
      this.enPassant,
      depth,
      -Infinity,
      Infinity
    );
    return res.move;
  }

  public applyChosenAiMove(chosenMove: ChessMove | null): {
    move: ChessMove | null;
    aiWon: boolean;
    playerWon: boolean;
    draw: boolean;
  } | null {
    if (this.status !== 'ai_thinking' || this.turn !== 'b') return null;
    const legal = this.getAllLegalMovesForState(this.board, 'b', this.castling, this.enPassant);
    if (legal.length === 0 || !chosenMove) {
      const won = this.isInCheck('b');
      this.status = won ? 'won' : 'draw';
      return { move: null, aiWon: false, playerWon: won, draw: !won };
    }
    const matched =
      legal.find(
        (m) =>
          m.fromR === chosenMove.fromR &&
          m.fromC === chosenMove.fromC &&
          m.toR === chosenMove.toR &&
          m.toC === chosenMove.toC &&
          (m.promotion ?? undefined) === (chosenMove.promotion ?? undefined)
      ) ?? legal[0];
    const nextStatus = this.commitMove(matched);
    return {
      move: matched,
      aiWon: nextStatus === 'lost',
      playerWon: nextStatus === 'won',
      draw: nextStatus === 'draw',
    };
  }

  public static computeAiMoveFromPayload(payload: ChessWorkerSearchPayload): ChessMove | null {
    const probe = new WizardChessEngine(payload.stage, 'match');
    probe.board = cloneChessBoard(payload.board);
    probe.turn = payload.turn;
    probe.castling = { ...payload.castling };
    probe.enPassant = payload.enPassant ? { ...payload.enPassant } : null;
    probe.status = 'ai_thinking';
    return probe.computeBestAiMoveOnly();
  }

  public stepAiMove(): {
    move: ChessMove | null;
    aiWon: boolean;
    playerWon: boolean;
    draw: boolean;
  } | null {
    if (this.status !== 'ai_thinking' || this.turn !== 'b') return null;
    return this.applyChosenAiMove(this.computeBestAiMoveOnly());
  }

  public undoTurnPair(): boolean {
    if (this.history.length === 0 || this.status === 'won') return false;
    if (this.turn === 'w' && this.history.length >= 2) {
      this.history.pop();
      const prevWhiteSnap = this.history.pop()!;
      this.restoreSnapshot(prevWhiteSnap);
      this.moveCount = Math.max(0, this.moveCount - 2);
      if (this.whiteTurnReviews.length > 0) this.whiteTurnReviews.pop();
    } else {
      const snap = this.history.pop()!;
      const wasAfterWhiteMove = this.turn === 'b';
      this.restoreSnapshot(snap);
      this.moveCount = Math.max(0, this.moveCount - 1);
      if (wasAfterWhiteMove && this.whiteTurnReviews.length > 0) {
        this.whiteTurnReviews.pop();
      }
    }
    this.cachedTurningPoint = null;
    this.hintMove = null;
    this.selected = null;
    this.status = 'playing';
    return true;
  }

  public getTurningPointReview(): TurningPointReview | null {
    if (
      (this.status !== 'won' && this.status !== 'lost' && this.status !== 'draw') ||
      this.whiteTurnReviews.length === 0
    ) {
      return null;
    }
    if (this.cachedTurningPoint) return this.cachedTurningPoint;

    if (this.status === 'won') {
      let bestEntry = this.whiteTurnReviews[this.whiteTurnReviews.length - 1];
      let maxGain = -Infinity;
      for (const rev of this.whiteTurnReviews) {
        const gain = rev.evalAfter - rev.evalBefore;
        if (gain >= maxGain) {
          maxGain = gain;
          bestEntry = rev;
        }
      }
      const engineAlt = this.searchAlphaBeta(
        bestEntry.boardBefore,
        'w',
        bestEntry.castlingBefore,
        bestEntry.epBefore,
        2,
        -Infinity,
        Infinity
      ).move;
      const playedLabel = formatChessMoveReviewVi(bestEntry.boardBefore, bestEntry.playedMove);
      const bestLabel = engineAlt
        ? formatChessMoveReviewVi(bestEntry.boardBefore, engineAlt)
        : playedLabel;
      const highlights: Array<{ r: number; c: number; role: 'played' | 'best' }> = [
        { r: bestEntry.playedMove.toR, c: bestEntry.playedMove.toC, role: 'played' },
      ];
      if (
        engineAlt &&
        (engineAlt.toR !== bestEntry.playedMove.toR || engineAlt.toC !== bestEntry.playedMove.toC)
      ) {
        highlights.push({ r: engineAlt.toR, c: engineAlt.toC, role: 'best' });
      }
      this.cachedTurningPoint = {
        mode: 'chess',
        plyNumber: bestEntry.plyNumber,
        outcomeTagVi: '✨ Đòn Phối Hợp Quyết Định',
        playedCoordVi: playedLabel,
        recommendedCoordVi: bestLabel,
        summaryVi:
          bestEntry.evalAfter >= 80000
            ? `Nước #${bestEntry.plyNumber} (${playedLabel}) giáng đòn chiếu bí chuẩn xác khép lại ván cờ!`
            : `Nước #${bestEntry.plyNumber} (${playedLabel}) bẻ gãy phòng tuyến Slytherin và tạo ưu thế quyết định.`,
        highlightCells: highlights,
      };
      return this.cachedTurningPoint;
    }

    // Lost or Draw: locate the 2-ply exchange where White's evaluation dropped the steepest
    let worstIdx = this.whiteTurnReviews.length - 1;
    let worstDrop = Infinity;
    for (let i = 0; i < this.whiteTurnReviews.length; i++) {
      const cur = this.whiteTurnReviews[i];
      const afterReplyEval =
        i + 1 < this.whiteTurnReviews.length
          ? this.whiteTurnReviews[i + 1].evalBefore
          : this.status === 'lost'
            ? -2500
            : 0;
      const swing = afterReplyEval - cur.evalBefore;
      if (swing <= worstDrop) {
        worstDrop = swing;
        worstIdx = i;
      }
    }

    const target = this.whiteTurnReviews[worstIdx];
    const engineBest = this.searchAlphaBeta(
      target.boardBefore,
      'w',
      target.castlingBefore,
      target.epBefore,
      2,
      -Infinity,
      Infinity
    ).move;
    const playedLabel = formatChessMoveReviewVi(target.boardBefore, target.playedMove);
    const bestLabel = engineBest
      ? formatChessMoveReviewVi(target.boardBefore, engineBest)
      : playedLabel;
    const highlights: Array<{ r: number; c: number; role: 'played' | 'best' }> = [
      { r: target.playedMove.toR, c: target.playedMove.toC, role: 'played' },
    ];
    if (
      engineBest &&
      (engineBest.toR !== target.playedMove.toR || engineBest.toC !== target.playedMove.toC)
    ) {
      highlights.push({ r: engineBest.toR, c: engineBest.toC, role: 'best' });
    }
    this.cachedTurningPoint = {
      mode: 'chess',
      plyNumber: target.plyNumber,
      outcomeTagVi: '🪞 Điểm Ngoặt Cần Khắc Phục',
      playedCoordVi: playedLabel,
      recommendedCoordVi: bestLabel,
      summaryVi:
        playedLabel === bestLabel
          ? `Nước #${target.plyNumber} (${playedLabel}) giữ thế cân bằng, nhưng hàng thủ hở sườn ở nhịp phản kích kế tiếp.`
          : `Ở nước #${target.plyNumber}, đi ${bestLabel} (thay vì ${playedLabel}) sẽ hóa giải đòn phản công và giữ vững thế chủ động.`,
      highlightCells: highlights,
    };
    return this.cachedTurningPoint;
  }

  public useBestMoveAssist(): {
    ok: boolean;
    move: ChessMove | null;
    won: boolean;
    draw: boolean;
    aiThinking: boolean;
  } {
    if (this.status !== 'playing' || this.turn !== 'w') {
      return { ok: false, move: null, won: false, draw: false, aiThinking: false };
    }
    const res = this.searchAlphaBeta(
      this.board,
      'w',
      this.castling,
      this.enPassant,
      3,
      -Infinity,
      Infinity
    );
    if (!res.move) {
      return { ok: false, move: null, won: false, draw: false, aiThinking: false };
    }
    const nextStatus = this.commitMove(res.move);
    return {
      ok: true,
      move: res.move,
      won: nextStatus === 'won',
      draw: nextStatus === 'draw',
      aiThinking: nextStatus === 'ai_thinking',
    };
  }

  public applyPhoenixTalisman(): {
    ok: boolean;
    move: ChessMove | null;
    won: boolean;
    draw: boolean;
    aiThinking: boolean;
    msg: string;
  } {
    if (this.talismanUsed || this.status === 'won' || this.status === 'ai_thinking') {
      return {
        ok: false,
        move: null,
        won: this.status === 'won',
        draw: false,
        aiThinking: false,
        msg: 'Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!',
      };
    }

    if (this.status === 'lost' || this.status === 'draw') {
      this.undoTurnPair();
    }
    if (this.status !== 'playing' || this.turn !== 'w') {
      return {
        ok: false,
        move: null,
        won: false,
        draw: false,
        aiThinking: false,
        msg: 'Hiện không ở lượt đi của bạn để kích hoạt Bùa Phượng Hoàng!',
      };
    }

    const legal = this.getAllLegalMovesForState(this.board, 'w', this.castling, this.enPassant);
    if (legal.length === 0) {
      return {
        ok: false,
        move: null,
        won: false,
        draw: false,
        aiThinking: false,
        msg: 'Không còn nước đi hợp lệ trên bàn cờ!',
      };
    }

    const depth = legal.length <= 24 ? 4 : 3;
    const res = this.searchAlphaBeta(
      this.board,
      'w',
      this.castling,
      this.enPassant,
      depth,
      -Infinity,
      Infinity
    );
    if (!res.move) {
      return {
        ok: false,
        move: null,
        won: false,
        draw: false,
        aiThinking: false,
        msg: 'Không tìm được nước đi phù hợp!',
      };
    }

    this.talismanUsed = true;
    this.freeHintsLeft += 1;
    const nextStatus = this.commitMove(res.move);
    return {
      ok: true,
      move: res.move,
      won: nextStatus === 'won',
      draw: nextStatus === 'draw',
      aiThinking: nextStatus === 'ai_thinking',
      msg: '🔥 Phượng Hoàng Fawkes dẫn lối: Đã đi nước cờ Kiện Tướng & tặng thêm +1 Gợi Ý!',
    };
  }
}

// ============================================================================
// 5. CLASSIC MAGICAL CREATURES ONET CONNECT ("NỐI HÌNH SINH VẬT HUYỀN BÍ" — 777 STAGES)
//    - Pure Classic Pikachu / Onet rules: connect matching Magical Creatures
//      with <= 3 straight segments (<= 2 90° turns), including 1-cell outer border.
//    - Relaxed untimed play (no countdown timer), static grid (zero sliding tiles).
// ============================================================================

export interface OnetPoint {
  r: number;
  c: number;
}

export interface OnetSpeciesDef {
  id: string;
  nameVi: string;
  spriteKey: string;
  bgTop: string;
  bgBot: string;
  border: string;
  accent: string;
  rareBadge?: boolean;
}

export const CREATURE_ONET_SPECIES: readonly OnetSpeciesDef[] = [
  {
    id: 'niffler',
    nameVi: 'Đào Mỏ Niffler',
    spriteKey: 'beast_niffler',
    bgTop: '#fef9c3',
    bgBot: '#fde68a',
    border: '#d97706',
    accent: '#f59e0b',
  },
  {
    id: 'phoenix',
    nameVi: 'Phượng Hoàng Fawkes',
    spriteKey: 'beast_phoenix',
    bgTop: '#fee2e2',
    bgBot: '#fecaca',
    border: '#dc2626',
    accent: '#ef4444',
  },
  {
    id: 'unicorn',
    nameVi: 'Kỳ Lân Bạc',
    spriteKey: 'beast_unicorn',
    bgTop: '#e0f2fe',
    bgBot: '#bae6fd',
    border: '#0284c7',
    accent: '#38bdf8',
  },
  {
    id: 'hippogriff',
    nameVi: 'Bằng Mã Buckbeak',
    spriteKey: 'beast_hippogriff',
    bgTop: '#f1f5f9',
    bgBot: '#cbd5e1',
    border: '#475569',
    accent: '#94a3b8',
  },
  {
    id: 'dragon',
    nameVi: 'Rồng Gringotts',
    spriteKey: 'beast_dragon',
    bgTop: '#ffedd5',
    bgBot: '#fed7aa',
    border: '#ea580c',
    accent: '#fb923c',
  },
  {
    id: 'thestral',
    nameVi: 'Vong Mã Thestral',
    spriteKey: 'beast_thestral',
    bgTop: '#f3e8ff',
    bgBot: '#e9d5ff',
    border: '#7e22ce',
    accent: '#a855f7',
  },
  {
    id: 'puffskein',
    nameVi: 'Bông Xù Puffskein',
    spriteKey: 'beast_puffskein',
    bgTop: '#fce7f3',
    bgBot: '#fbcfe8',
    border: '#db2777',
    accent: '#f472b6',
  },
  {
    id: 'bowtruckle',
    nameVi: 'Tinh Cây Bowtruckle',
    spriteKey: 'hagrid_bowtruckle',
    bgTop: '#dcfce7',
    bgBot: '#bbf7d0',
    border: '#16a34a',
    accent: '#4ade80',
  },
  {
    id: 'owl',
    nameVi: 'Cú Tuyết Đưa Thư',
    spriteKey: 'ui_icon_owl_orders',
    bgTop: '#fffbeb',
    bgBot: '#fef08a',
    border: '#ca8a04',
    accent: '#eab308',
  },
  {
    id: 'choc_frog',
    nameVi: 'Ếch Phép Nhảy Nhót',
    spriteKey: 'ui_icon_frog_choc',
    bgTop: '#ede9fe',
    bgBot: '#ddd6fe',
    border: '#5b21b6',
    accent: '#8b5cf6',
  },
  {
    id: 'mandrake',
    nameVi: 'Nhân Sâm Mandrake',
    spriteKey: 'ui_icon_crop_baby_mandrake',
    bgTop: '#ecfccb',
    bgBot: '#d9f99d',
    border: '#65a30d',
    accent: '#84cc16',
  },
  {
    id: 'gnome',
    nameVi: 'Thần Lùn Vườn',
    spriteKey: 'guest_ron_gnome',
    bgTop: '#fef3c7',
    bgBot: '#fcd34d',
    border: '#92400e',
    accent: '#d97706',
  },
  {
    id: 'sheep',
    nameVi: 'Cừu Mây Hang Sóc',
    spriteKey: 'beast_sheep',
    bgTop: '#fafaf9',
    bgBot: '#e7e5e4',
    border: '#78716c',
    accent: '#a8a29e',
  },
  {
    id: 'cow',
    nameVi: 'Bò Sữa Đồng Ottery',
    spriteKey: 'beast_cow',
    bgTop: '#fae8ff',
    bgBot: '#f5d0fe',
    border: '#a21caf',
    accent: '#e879f9',
  },
  {
    id: 'hen',
    nameVi: 'Gà Mái Đẻ Trứng Vàng',
    spriteKey: 'beast_hen',
    bgTop: '#ffe4e6',
    bgBot: '#fecdd3',
    border: '#e11d48',
    accent: '#fb7185',
  },
  {
    id: 'phoenix_soar',
    nameVi: 'Phượng Hoàng Tung Cánh',
    spriteKey: 'beast_phoenix_soar',
    bgTop: '#fef08a',
    bgBot: '#fdba74',
    border: '#b91c1c',
    accent: '#f97316',
    rareBadge: true,
  },
  {
    id: 'dragon_roar',
    nameVi: 'Rồng Lửa Gầm Vang',
    spriteKey: 'beast_dragon_roar',
    bgTop: '#fecaca',
    bgBot: '#fca5a5',
    border: '#991b1b',
    accent: '#dc2626',
    rareBadge: true,
  },
  {
    id: 'unicorn_prance',
    nameVi: 'Kỳ Lân Ánh Sao',
    spriteKey: 'beast_unicorn_prance',
    bgTop: '#cffafe',
    bgBot: '#a5f3fc',
    border: '#0e7490',
    accent: '#06b6d4',
    rareBadge: true,
  },
  {
    id: 'hippogriff_bow',
    nameVi: 'Bằng Mã Cúi Chào',
    spriteKey: 'beast_hippogriff_bow',
    bgTop: '#e2e8f0',
    bgBot: '#94a3b8',
    border: '#1e293b',
    accent: '#64748b',
    rareBadge: true,
  },
  {
    id: 'thestral_wings',
    nameVi: 'Vong Mã Sải Cánh',
    spriteKey: 'beast_thestral_wings',
    bgTop: '#ede9fe',
    bgBot: '#c4b5fd',
    border: '#4c1d95',
    accent: '#7c3aed',
    rareBadge: true,
  },
  {
    id: 'niffler_play',
    nameVi: 'Niffler Ôm Kho Báu',
    spriteKey: 'beast_niffler_play',
    bgTop: '#fef08a',
    bgBot: '#facc15',
    border: '#854d0e',
    accent: '#ca8a04',
    rareBadge: true,
  },
  {
    id: 'puffskein_bounce',
    nameVi: 'Puffskein Tung Tăng',
    spriteKey: 'beast_puffskein_bounce',
    bgTop: '#fbcfe8',
    bgBot: '#f9a8d4',
    border: '#9d174d',
    accent: '#ec4899',
    rareBadge: true,
  },
  {
    id: 'creature_crest',
    nameVi: 'Ấn Linh Thú Rừng Cấm',
    spriteKey: 'ui_icon_creature',
    bgTop: '#d1fae5',
    bgBot: '#6ee7b7',
    border: '#065f46',
    accent: '#10b981',
  },
  {
    id: 'pasture_bell',
    nameVi: 'Chuông Vàng Gọi Thú',
    spriteKey: 'ui_icon_pasture_bell',
    bgTop: '#ffedd5',
    bgBot: '#fdba74',
    border: '#9a3412',
    accent: '#f97316',
  },
];

const ONET_CHAPTER_LOCATIONS_VI: readonly string[] = [
  'Bãi Cỏ Bông Xù Hang Sóc',
  'Trại Chăm Thú Bác Hagrid',
  'Bờ Hồ Kỳ Lân Ánh Bạc',
  'Thung Lũng Đào Mỏ Niffler',
  'Nhà Cú Tuyết Hogsmeade',
  'Rừng Tinh Cây Bowtruckle',
  'Đỉnh Đồi Bằng Mã Buckbeak',
  'Khu Bảo Tồn Rồng Lửa',
  'Đài Phượng Hoàng Fawkes',
  'Thánh Địa Sinh Vật Huyền Bí',
];

export interface OnetMatchVfxEvent {
  from: OnetPoint;
  to: OnetPoint;
  waypoints: OnetPoint[];
  speciesId: string;
  segments: number;
  combo: number;
}

export class CreatureOnetEngine {
  public readonly stage: number;
  public readonly rows: number;
  public readonly cols: number;
  public readonly speciesCount: number;
  public readonly totalPairs: number;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly title: string;
  public readonly reward: PuzzleRewardSpec;
  public readonly hintGoldCost: number;
  public readonly shuffleGoldCost: number;

  /** Static grid [r][c]: speciesId string or null if cleared (tiles NEVER slide/move) */
  public grid: (string | null)[][] = [];
  public selected: OnetPoint | null = null;
  public hintPair: [OnetPoint, OnetPoint] | null = null;
  public hintPath: OnetPoint[] | null = null;

  public matchedPairs = 0;
  public combo = 0;
  public maxCombo = 0;
  public score = 0;
  public movesAttempted = 0;
  public autoShufflesCount = 0;
  public lastAutoShuffleNotice = '';

  public freeHintsLeft: number;
  public paidHintsLeft: number;
  public freeShufflesLeft: number;
  public paidShufflesLeft: number;
  public talismanUsed = false;
  public status: 'playing' | 'won' = 'playing';

  public matchVfxQueue: OnetMatchVfxEvent[] = [];
  private bestTurnPlay: {
    ply: number;
    speciesNameVi: string;
    segments: number;
    combo: number;
    from: OnetPoint;
    to: OnetPoint;
  } | null = null;

  private rng: () => number;

  constructor(stage: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    this.rng = mulberry32(this.stage * 131071 + 911);

    const tier = getMinigameDifficultyTier(this.stage);
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    this.difficultyLabel = this.milestoneBoss
      ? `👑 Đại Trùm Mốc ${this.stage}`
      : `${tier.badgeEmoji} ${tier.label}`;

    // Progressive Classic Pikachu board dimensions (48 -> 108 tiles, rows * cols is ALWAYS even!)
    if (this.milestoneBoss && this.stage >= 100) {
      this.rows = 9;
      this.cols = 12; // 108 tiles = 54 pairs
    } else if (this.stage <= 15) {
      this.rows = 6;
      this.cols = 8; // 48 tiles = 24 pairs (right from Stage 1!)
    } else if (this.stage <= 60) {
      this.rows = 8;
      this.cols = 8; // 64 tiles = 32 pairs
    } else if (this.stage <= 180) {
      this.rows = 8;
      this.cols = 9; // 72 tiles = 36 pairs
    } else if (this.stage <= 420) {
      this.rows = 8;
      this.cols = 10; // 80 tiles = 40 pairs
    } else if (this.stage <= 620) {
      this.rows = 9;
      this.cols = 10; // 90 tiles = 45 pairs
    } else {
      this.rows = 9;
      this.cols = 12; // 108 tiles = 54 pairs
    }

    this.totalPairs = Math.floor((this.rows * this.cols) / 2);

    // Progressive species variety (10 -> 24 distinct Magical Creatures)
    const maxSpeciesPool = this.stage >= 350 ? CREATURE_ONET_SPECIES.length : 17;
    const rawSpecies =
      this.stage <= 15
        ? 10
        : this.stage <= 60
          ? 12 + Math.floor((this.stage - 16) / 22)
          : this.stage <= 180
            ? 14 + Math.floor((this.stage - 61) / 60)
            : this.stage <= 420
              ? 16 + Math.floor((this.stage - 181) / 80)
              : this.stage <= 620
                ? 19 + Math.floor((this.stage - 421) / 70)
                : 22 + Math.floor((this.stage - 621) / 78);
    this.speciesCount = Math.max(
      10,
      Math.min(maxSpeciesPool, this.totalPairs, this.milestoneBoss ? rawSpecies + 2 : rawSpecies)
    );

    const locName =
      ONET_CHAPTER_LOCATIONS_VI[
        Math.floor((this.stage - 1) / 10) % ONET_CHAPTER_LOCATIONS_VI.length
      ];
    this.title = this.milestoneBoss
      ? `👑 ${this.milestoneBoss.bossTitleVi} • ${locName}`
      : locName;

    this.freeHintsLeft = this.stage <= 25 ? 3 : this.stage <= 140 ? 2 : 1;
    this.paidHintsLeft = 2;
    this.freeShufflesLeft = this.stage <= 40 ? 2 : 1;
    this.paidShufflesLeft = 2;
    this.hintGoldCost = Math.min(190, 45 + Math.floor(this.stage / 7));
    this.shuffleGoldCost = Math.min(210, 55 + Math.floor(this.stage / 7));

    const stars = getStageStarReward(this.stage);
    const effectiveCap =
      Math.min(this.stage, 260) + Math.floor(Math.max(0, this.stage - 260) * 0.35);
    this.reward = {
      stars,
      sand:
        this.stage === MAX_MINIGAME_STAGE
          ? 5
          : this.milestoneBoss || this.stage % 10 === 0
            ? 2
            : 1,
      gold: Math.round(75 + effectiveCap * 3.8 + stars * 18),
      xp: Math.round(55 + effectiveCap * 2.8 + stars * 12),
      isMasterpiece:
        Boolean(this.milestoneBoss) ||
        this.stage % 10 === 0 ||
        this.stage === MAX_MINIGAME_STAGE,
    };

    this.populateInitialBoard();
  }

  public get remainingPairs(): number {
    return Math.max(0, this.totalPairs - this.matchedPairs);
  }

  public static getSpeciesDef(id: string): OnetSpeciesDef {
    return (
      CREATURE_ONET_SPECIES.find((s) => s.id === id) ?? CREATURE_ONET_SPECIES[0]
    );
  }

  private populateInitialBoard(): void {
    // Select species pool deterministically for this stage
    const pool = CREATURE_ONET_SPECIES.slice(0, this.speciesCount);
    const deck: string[] = [];
    for (let p = 0; p < this.totalPairs; p++) {
      const sp = pool[p % pool.length].id;
      deck.push(sp, sp);
    }

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      const tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }

    this.grid = Array.from({ length: this.rows }, (_, r) =>
      Array.from({ length: this.cols }, (_, c) => deck[r * this.cols + c])
    );

    // Higher stages scatter adjacent identical pairs further apart to reward L/U/Z pathfinding
    const antiClumpProb =
      this.stage <= 20
        ? 0
        : Math.min(0.86, 0.22 + ((this.stage - 20) / 757) * 0.64);
    if (antiClumpProb > 0) {
      const passes = this.stage >= 300 ? 3 : 2;
      for (let pass = 0; pass < passes; pass++) {
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            const cur = this.grid[r][c];
            if (!cur) continue;
            const sameRight = c + 1 < this.cols && this.grid[r][c + 1] === cur;
            const sameDown = r + 1 < this.rows && this.grid[r + 1][c] === cur;
            if ((sameRight || sameDown) && this.rng() < antiClumpProb) {
              const sr = Math.floor(this.rng() * this.rows);
              const sc = Math.floor(this.rng() * this.cols);
              const other = this.grid[sr][sc];
              if (other && other !== cur) {
                this.grid[r][c] = other;
                this.grid[sr][sc] = cur;
              }
            }
          }
        }
      }
    }

    // Guarantee at least 1 valid connection right from the start
    this.ensurePlayableOrAutoShuffle(true);
  }

  /**
   * Classic Pikachu / Onet 3-segment orthogonal pathfinder (<= 2 90° turns),
   * including the 1-cell walkable border ring [-1..rows] x [-1..cols].
   * Returns compressed corner waypoints [start, ...corners, end] (length 2..4) or null.
   */
  public findConnectionPath(a: OnetPoint, b: OnetPoint): OnetPoint[] | null {
    if (a.r === b.r && a.c === b.c) return null;
    const spA = this.grid[a.r]?.[a.c];
    const spB = this.grid[b.r]?.[b.c];
    if (!spA || !spB || spA !== spB) return null;

    const pRows = this.rows + 2;
    const pCols = this.cols + 2;
    const INF = 1e9;
    const bestCost = new Int32Array(pRows * pCols * 4).fill(INF);
    const prevPr = new Int16Array(pRows * pCols * 4).fill(-99);
    const prevPc = new Int16Array(pRows * pCols * 4).fill(-99);
    const prevDir = new Int8Array(pRows * pCols * 4).fill(-1);

    const idxOf = (pr: number, pc: number, d: number) =>
      ((pr + 1) * pCols + (pc + 1)) * 4 + d;

    const isWalkable = (pr: number, pc: number): boolean => {
      if (pr < -1 || pr > this.rows || pc < -1 || pc > this.cols) return false;
      if (pr === b.r && pc === b.c) return true;
      if (pr < 0 || pr >= this.rows || pc < 0 || pc >= this.cols) return true;
      return this.grid[pr][pc] === null;
    };

    const drs = [-1, 1, 0, 0];
    const dcs = [0, 0, -1, 1];

    interface QueueNode {
      pr: number;
      pc: number;
      d: number;
      turns: number;
      dist: number;
    }

    const queue: QueueNode[] = [];
    for (let d = 0; d < 4; d++) {
      const nr = a.r + drs[d];
      const nc = a.c + dcs[d];
      if (!isWalkable(nr, nc)) continue;
      const k = idxOf(nr, nc, d);
      bestCost[k] = 1;
      prevPr[k] = a.r;
      prevPc[k] = a.c;
      prevDir[k] = -1;
      queue.push({ pr: nr, pc: nc, d, turns: 0, dist: 1 });
    }

    let bestTargetKey = -1;
    let bestTargetCost = INF;
    let bestTargetDir = -1;

    let head = 0;
    while (head < queue.length) {
      const cur = queue[head++];
      const curCost = cur.turns * 1000 + cur.dist;
      const curKey = idxOf(cur.pr, cur.pc, cur.d);
      if (curCost > bestCost[curKey]) continue;
      if (curCost >= bestTargetCost) continue;

      if (cur.pr === b.r && cur.pc === b.c) {
        bestTargetCost = curCost;
        bestTargetKey = curKey;
        bestTargetDir = cur.d;
        continue;
      }

      for (let nd = 0; nd < 4; nd++) {
        // Never reverse 180 degrees
        if ((nd ^ 1) === cur.d) continue;
        const nextTurns = nd === cur.d ? cur.turns : cur.turns + 1;
        if (nextTurns > 2) continue;
        const nr = cur.pr + drs[nd];
        const nc = cur.pc + dcs[nd];
        if (!isWalkable(nr, nc)) continue;
        const nextDist = cur.dist + 1;
        const nextCost = nextTurns * 1000 + nextDist;
        const nk = idxOf(nr, nc, nd);
        if (nextCost < bestCost[nk] && nextCost < bestTargetCost) {
          bestCost[nk] = nextCost;
          prevPr[nk] = cur.pr;
          prevPc[nk] = cur.pc;
          prevDir[nk] = cur.d;
          queue.push({ pr: nr, pc: nc, d: nd, turns: nextTurns, dist: nextDist });
        }
      }
    }

    if (bestTargetKey < 0 || bestTargetDir < 0) return null;

    // Reconstruct cell-by-cell path from b back to a
    const revPoints: OnetPoint[] = [];
    let cr = b.r;
    let cc = b.c;
    let cd = bestTargetDir;
    while (cd !== -1) {
      revPoints.push({ r: cr, c: cc });
      const k = idxOf(cr, cc, cd);
      const pr = prevPr[k];
      const pc = prevPc[k];
      const pd = prevDir[k];
      cr = pr;
      cc = pc;
      cd = pd;
    }
    revPoints.push({ r: a.r, c: a.c });
    revPoints.reverse();

    // Compress collinear points into clean corner waypoints (2..4 points)
    const waypoints: OnetPoint[] = [revPoints[0]];
    for (let i = 1; i < revPoints.length - 1; i++) {
      const prev = waypoints[waypoints.length - 1];
      const curr = revPoints[i];
      const next = revPoints[i + 1];
      const sameRow = prev.r === curr.r && curr.r === next.r;
      const sameCol = prev.c === curr.c && curr.c === next.c;
      if (!sameRow && !sameCol) {
        waypoints.push(curr);
      }
    }
    waypoints.push(revPoints[revPoints.length - 1]);
    return waypoints.length <= 4 ? waypoints : null;
  }

  public findAnyValidPair(): { a: OnetPoint; b: OnetPoint; path: OnetPoint[] } | null {
    const bySpecies = new Map<string, OnetPoint[]>();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const sp = this.grid[r][c];
        if (!sp) continue;
        let list = bySpecies.get(sp);
        if (!list) {
          list = [];
          bySpecies.set(sp, list);
        }
        list.push({ r, c });
      }
    }

    for (const pts of bySpecies.values()) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const path = this.findConnectionPath(pts[i], pts[j]);
          if (path) {
            return { a: pts[i], b: pts[j], path };
          }
        }
      }
    }
    return null;
  }

  public countAvailableValidPairs(): number {
    const bySpecies = new Map<string, OnetPoint[]>();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const sp = this.grid[r][c];
        if (!sp) continue;
        let list = bySpecies.get(sp);
        if (!list) {
          list = [];
          bySpecies.set(sp, list);
        }
        list.push({ r, c });
      }
    }
    let count = 0;
    for (const pts of bySpecies.values()) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          if (this.findConnectionPath(pts[i], pts[j])) {
            count += 1;
          }
        }
      }
    }
    return count;
  }

  /**
   * Shuffles remaining occupied creature tiles IN PLACE (empty spaces never move).
   * Guarantees at least 1 valid connection whenever >= 1 pair remains.
   */
  public shuffleRemainingTilesInPlace(): boolean {
    const coords: OnetPoint[] = [];
    const values: string[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const sp = this.grid[r][c];
        if (sp) {
          coords.push({ r, c });
          values.push(sp);
        }
      }
    }
    if (coords.length < 2) return false;

    this.selected = null;
    this.hintPair = null;
    this.hintPath = null;

    for (let attempt = 0; attempt < 40; attempt++) {
      for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        const tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
      }
      for (let idx = 0; idx < coords.length; idx++) {
        this.grid[coords[idx].r][coords[idx].c] = values[idx];
      }
      if (this.findAnyValidPair()) {
        return true;
      }
    }

    // Deterministic fallback: place two matching tiles on two positions that share an outer-edge / adjacent link
    const bySp = new Map<string, number[]>();
    values.forEach((v, idx) => {
      const arr = bySp.get(v) ?? [];
      arr.push(idx);
      bySp.set(v, arr);
    });
    const dupEntry = [...bySp.entries()].find(([, idxs]) => idxs.length >= 2);
    if (dupEntry) {
      const targetSp = dupEntry[0];
      // Clear grid temporarily to find two coords connectable on current occupancy
      for (let idx = 0; idx < coords.length; idx++) {
        this.grid[coords[idx].r][coords[idx].c] = values[idx];
      }
      outer: for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const origI = this.grid[coords[i].r][coords[i].c]!;
          const origJ = this.grid[coords[j].r][coords[j].c]!;
          // Swap targetSp into i and j to test connectivity
          const kIdx = coords.findIndex(
            (pt, k) => k !== i && k !== j && this.grid[pt.r][pt.c] === targetSp
          );
          if (origI !== targetSp && kIdx >= 0) {
            this.grid[coords[kIdx].r][coords[kIdx].c] = origI;
            this.grid[coords[i].r][coords[i].c] = targetSp;
          }
          const mIdx = coords.findIndex(
            (pt, k) => k !== i && k !== j && this.grid[pt.r][pt.c] === targetSp
          );
          if (this.grid[coords[j].r][coords[j].c] !== targetSp && mIdx >= 0) {
            this.grid[coords[mIdx].r][coords[mIdx].c] =
              this.grid[coords[j].r][coords[j].c]!;
            this.grid[coords[j].r][coords[j].c] = targetSp;
          }
          if (
            this.grid[coords[i].r][coords[i].c] === targetSp &&
            this.grid[coords[j].r][coords[j].c] === targetSp &&
            this.findConnectionPath(coords[i], coords[j])
          ) {
            break outer;
          }
          // Restore values for next pair check
          for (let idx = 0; idx < coords.length; idx++) {
            this.grid[coords[idx].r][coords[idx].c] = values[idx];
          }
          void origJ;
        }
      }
    }
    return Boolean(this.findAnyValidPair());
  }

  private ensurePlayableOrAutoShuffle(silent = false): boolean {
    if (this.remainingPairs <= 0) return false;
    if (this.findAnyValidPair()) return false;
    this.shuffleRemainingTilesInPlace();
    if (!silent) {
      this.autoShufflesCount += 1;
      this.lastAutoShuffleNotice =
        '✨ Hết đường nối trực tiếp — Đàn sinh vật vừa tự đổi vị trí miễn phí để mở đường mới!';
    }
    return true;
  }

  public tapCell(
    r: number,
    c: number
  ): {
    action: 'empty' | 'selected' | 'deselected' | 'switched' | 'blocked' | 'matched';
    matchedSpeciesId?: string;
    waypoints?: OnetPoint[];
    autoShuffled?: boolean;
    won?: boolean;
  } {
    if (this.status !== 'playing') return { action: 'empty' };
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return { action: 'empty' };
    const clickedSp = this.grid[r][c];
    if (!clickedSp) {
      this.selected = null;
      return { action: 'empty' };
    }

    this.lastAutoShuffleNotice = '';

    if (!this.selected) {
      this.selected = { r, c };
      return { action: 'selected' };
    }

    if (this.selected.r === r && this.selected.c === c) {
      this.selected = null;
      return { action: 'deselected' };
    }

    const prev = this.selected;
    const prevSp = this.grid[prev.r]?.[prev.c];
    if (!prevSp) {
      this.selected = { r, c };
      return { action: 'selected' };
    }

    this.movesAttempted += 1;

    if (prevSp !== clickedSp) {
      this.combo = 0;
      this.selected = { r, c };
      return { action: 'switched' };
    }

    // Same species: verify <= 3-segment path!
    const waypoints = this.findConnectionPath(prev, { r, c });
    if (!waypoints) {
      this.combo = 0;
      this.selected = { r, c };
      return { action: 'blocked' };
    }

    // Valid match! Clear both tiles statically (no gravity/sliding!)
    this.grid[prev.r][prev.c] = null;
    this.grid[r][c] = null;
    this.selected = null;
    this.hintPair = null;
    this.hintPath = null;

    this.matchedPairs += 1;
    this.combo += 1;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    const segments = Math.max(1, waypoints.length - 1);
    const pointsEarned = 80 + segments * 25 + Math.min(12, this.combo) * 20;
    this.score += pointsEarned;

    this.matchVfxQueue.push({
      from: prev,
      to: { r, c },
      waypoints,
      speciesId: clickedSp,
      segments,
      combo: this.combo,
    });

    const spMeta = CreatureOnetEngine.getSpeciesDef(clickedSp);
    if (
      !this.bestTurnPlay ||
      segments > this.bestTurnPlay.segments ||
      (segments === this.bestTurnPlay.segments && this.combo > this.bestTurnPlay.combo)
    ) {
      this.bestTurnPlay = {
        ply: this.matchedPairs,
        speciesNameVi: spMeta.nameVi,
        segments,
        combo: this.combo,
        from: prev,
        to: { r, c },
      };
    }

    if (this.matchedPairs >= this.totalPairs) {
      this.status = 'won';
      this.score += 350;
      return {
        action: 'matched',
        matchedSpeciesId: clickedSp,
        waypoints,
        autoShuffled: false,
        won: true,
      };
    }

    const autoShuffled = this.ensurePlayableOrAutoShuffle(false);
    return {
      action: 'matched',
      matchedSpeciesId: clickedSp,
      waypoints,
      autoShuffled,
      won: false,
    };
  }

  public useHint(): {
    ok: boolean;
    pair: [OnetPoint, OnetPoint] | null;
    path: OnetPoint[] | null;
    msg: string;
  } {
    if (this.status !== 'playing') {
      return { ok: false, pair: null, path: null, msg: 'Màn chơi đã hoàn thành!' };
    }
    let found = this.findAnyValidPair();
    if (!found) {
      this.shuffleRemainingTilesInPlace();
      found = this.findAnyValidPair();
    }
    if (!found) {
      return { ok: false, pair: null, path: null, msg: 'Không tìm thấy cặp sinh vật nào!' };
    }
    this.hintPair = [found.a, found.b];
    this.hintPath = found.path;
    this.selected = { ...found.a };
    const sp = this.grid[found.a.r][found.a.c];
    const spName = sp ? CreatureOnetEngine.getSpeciesDef(sp).nameVi : 'Sinh Vật Huyền Bí';
    return {
      ok: true,
      pair: this.hintPair,
      path: this.hintPath,
      msg: `🔍 Đã soi thấy cặp ${spName} nối được trong ${found.path.length - 1} đoạn!`,
    };
  }

  public useManualShuffle(): { ok: boolean; msg: string } {
    if (this.status !== 'playing') {
      return { ok: false, msg: 'Màn chơi đã hoàn thành!' };
    }
    const ok = this.shuffleRemainingTilesInPlace();
    return {
      ok,
      msg: '🔀 Đã đảo vị trí đàn Sinh Vật Huyền Bí để mở thêm đường nối mới!',
    };
  }

  public applyPhoenixTalisman(): {
    ok: boolean;
    clearedPairs: number;
    won: boolean;
    msg: string;
  } {
    if (this.status !== 'playing' || this.talismanUsed) {
      return {
        ok: false,
        clearedPairs: 0,
        won: false,
        msg: 'Bùa Phượng Hoàng đã được triệu hồi trong lượt này!',
      };
    }
    this.talismanUsed = true;
    this.selected = null;
    this.hintPair = null;
    this.hintPath = null;

    let clearedPairs = 0;
    const targetClear = Math.min(3, this.remainingPairs);
    for (let k = 0; k < targetClear; k++) {
      // Clear any matching pair (even blocked ones!) with golden Phoenix fire!
      let pairFound: [OnetPoint, OnetPoint, string] | null = null;
      const valid = this.findAnyValidPair();
      if (valid) {
        const sp = this.grid[valid.a.r][valid.a.c]!;
        pairFound = [valid.a, valid.b, sp];
      } else {
        const seen = new Map<string, OnetPoint>();
        outer: for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            const sp = this.grid[r][c];
            if (!sp) continue;
            const prev = seen.get(sp);
            if (prev) {
              pairFound = [prev, { r, c }, sp];
              break outer;
            }
            seen.set(sp, { r, c });
          }
        }
      }
      if (!pairFound) break;
      const [p1, p2, sp] = pairFound;
      const path = this.findConnectionPath(p1, p2) ?? [p1, p2];
      this.grid[p1.r][p1.c] = null;
      this.grid[p2.r][p2.c] = null;
      this.matchedPairs += 1;
      this.combo += 1;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.score += 150;
      clearedPairs += 1;
      this.matchVfxQueue.push({
        from: p1,
        to: p2,
        waypoints: path,
        speciesId: sp,
        segments: Math.max(1, path.length - 1),
        combo: this.combo,
      });
    }

    if (this.matchedPairs >= this.totalPairs) {
      this.status = 'won';
      this.score += 350;
      return {
        ok: true,
        clearedPairs,
        won: true,
        msg: `🔥 Lửa Phượng Hoàng Fawkes kết nối ${clearedPairs} cặp Sinh Vật & hoàn tất màn chơi!`,
      };
    }

    this.ensurePlayableOrAutoShuffle(true);
    this.freeHintsLeft += 1;
    return {
      ok: true,
      clearedPairs,
      won: false,
      msg: `🔥 Phượng Hoàng Fawkes đã ghép gọn ${clearedPairs} cặp Sinh Vật & tặng thêm +1 🔍 Dò Cặp!`,
    };
  }

  public getTurningPointReview(): TurningPointReview | null {
    if (!this.bestTurnPlay) return null;
    const bp = this.bestTurnPlay;
    const fromCoord = `(${bp.from.r + 1},${bp.from.c + 1})`;
    const toCoord = `(${bp.to.r + 1},${bp.to.c + 1})`;
    return {
      mode: 'blocks',
      plyNumber: bp.ply,
      outcomeTagVi:
        bp.segments >= 3
          ? 'Đường Nối 3 Đoạn Xuất Thần'
          : `Chuỗi Ghép Đôi ×${bp.combo}`,
      playedCoordVi: `${fromCoord} ↔ ${toCoord}`,
      recommendedCoordVi: `${bp.segments} đoạn thẳng`,
      summaryVi: `Ghép đôi ${bp.speciesNameVi} tại ô ${fromCoord} ↔ ${toCoord} qua ${bp.segments} đoạn thẳng (Combo ×${bp.combo})!`,
      highlightCells: [
        { r: bp.from.r, c: bp.from.c, role: 'played' },
        { r: bp.to.r, c: bp.to.c, role: 'best' },
      ],
    };
  }
}
