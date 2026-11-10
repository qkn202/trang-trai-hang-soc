// Tách tự động từ src/sim/puzzleArcadeEngine.ts (P0.5 — tách puzzle engine theo môn).
import {
  MAX_MINIGAME_STAGE,
  MilestoneBossMeta,
  PuzzleRewardSpec,
  TurningPointReview,
  WizardingPortraitKey,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
  isArcadeSubModeLocked,
  mulberry32,
} from "./puzzleShared";

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

