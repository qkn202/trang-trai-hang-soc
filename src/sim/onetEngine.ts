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

