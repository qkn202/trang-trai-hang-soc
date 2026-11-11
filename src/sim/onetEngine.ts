// Tách tự động từ src/sim/puzzleArcadeEngine.ts (P0.5 — tách puzzle engine theo môn).
import { SavedOnetSession } from '../types/game';
import {
  MAX_MINIGAME_STAGE,
  MilestoneBossMeta,
  PuzzleRewardSpec,
  TurningPointReview,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
  mulberry32,
} from './puzzleShared';

// ============================================================================
// 5. CLASSIC PIKACHU 2003 ONET CONNECT ("PIKACHU CỔ ĐIỂN HANG SÓC" — 777 STAGES)
//    - Authentic Pikachu PC 2003 (Kawai) rules & geometry:
//      * 9 × 16 = 144 tiles (72 pairs) across 36 distinct Hang Sóc icons (4 each).
//      * Connect matching tiles with <= 3 straight orthogonal segments (<= 2 90° turns),
//        including the 1-cell walkable outer border [-1..rows] × [-1..cols].
//      * Classic 9 rotating shift/gravity modes across stages 1..777:
//        1: Static, 2: Down, 3: Up, 4: Left, 5: Right,
//        6: Converge Horizontal, 7: Split Horizontal, 8: Converge Vertical, 9: Split Vertical.
//      * Untimed relaxed play (no countdown bar) + Classic Lives/Shuffle counter (❤️ = 10).
// ============================================================================

export interface OnetPoint {
  r: number;
  c: number;
}

export type OnetShiftMode =
  | 'none'
  | 'down'
  | 'up'
  | 'left'
  | 'right'
  | 'center_h'
  | 'split_h'
  | 'center_v'
  | 'split_v';

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

const CLASSIC_IVORY_TOP = '#fdfaf0';
const CLASSIC_IVORY_BOT = '#f3ead3';
const CLASSIC_BEVEL_BORDER = '#8c7248';
const CLASSIC_RED_ACCENT = '#ef4444';

function definePikachuSpecies(
  id: string,
  nameVi: string,
  spriteKey: string
): OnetSpeciesDef {
  return {
    id,
    nameVi,
    spriteKey,
    bgTop: CLASSIC_IVORY_TOP,
    bgBot: CLASSIC_IVORY_BOT,
    border: CLASSIC_BEVEL_BORDER,
    accent: CLASSIC_RED_ACCENT,
  };
}

/**
 * 36 distinct Hang Sóc creatures, wizarding artifacts & harvest icons (zero duplicate poses).
 * On a 9 × 16 = 144 board, each of the 36 icons appears exactly 4 times (2 pairs).
 */
export const CREATURE_ONET_SPECIES: readonly OnetSpeciesDef[] = [
  // 1–12: Magical & Farm Creatures (12)
  definePikachuSpecies('niffler', 'Đào Mỏ Niffler', 'beast_niffler'),
  definePikachuSpecies('phoenix', 'Phượng Hoàng Fawkes', 'beast_phoenix'),
  definePikachuSpecies('unicorn', 'Kỳ Lân Ánh Bạc', 'beast_unicorn'),
  definePikachuSpecies('hippogriff', 'Bằng Mã Buckbeak', 'beast_hippogriff'),
  definePikachuSpecies('dragon', 'Rồng Lửa Gringotts', 'beast_dragon'),
  definePikachuSpecies('thestral', 'Vong Mã Thestral', 'beast_thestral'),
  definePikachuSpecies('puffskein', 'Bông Xù Puffskein', 'beast_puffskein'),
  definePikachuSpecies('bowtruckle', 'Tinh Cây Bowtruckle', 'hagrid_bowtruckle'),
  definePikachuSpecies('sheep', 'Cừu Mây Hang Sóc', 'beast_sheep'),
  definePikachuSpecies('cow', 'Bò Sữa Đồng Ottery', 'beast_cow'),
  definePikachuSpecies('hen', 'Gà Mái Trứng Vàng', 'beast_hen'),
  definePikachuSpecies('gnome', 'Thần Lùn Vườn', 'guest_ron_gnome'),

  // 13–24: Iconic Wizarding & Burrow Specialties (12)
  definePikachuSpecies('owl', 'Cú Tuyết Đưa Thư', 'ui_icon_owl_orders'),
  definePikachuSpecies('choc_frog', 'Ếch Sô-cô-la', 'ui_icon_frog_choc'),
  definePikachuSpecies('snitch', 'Trái Snitch Vàng', 'm3_sp_snitch'),
  definePikachuSpecies('apple_pie', 'Bánh Táo Bà Molly', 'ui_icon_pie_ready'),
  definePikachuSpecies('butterbeer', 'Bia Bơ Sủi Bọt', 'ui_icon_butterbeer'),
  definePikachuSpecies('honey_jar', 'Hũ Mật Ong Rừng', 'ui_icon_honey_jar'),
  definePikachuSpecies('herb_elixir', 'Độc Dược Thảo Mộc', 'ui_icon_herb_elixir'),
  definePikachuSpecies('sweater', 'Áo Len Chữ W', 'ui_icon_sweater_ready'),
  definePikachuSpecies('egg_basket', 'Giỏ Trứng Trang Trại', 'ui_icon_egg_basket'),
  definePikachuSpecies('watering_can', 'Bình Tưới Phép', 'ui_icon_watering_can'),
  definePikachuSpecies('suitcase', 'Vali Sinh Vật Newt', 'ui_icon_suitcase'),
  definePikachuSpecies('pasture_bell', 'Chuông Vàng Đồng Cỏ', 'ui_icon_pasture_bell'),

  // 25–36: Harvest Crops, Fruits & Magical Flowers (12)
  definePikachuSpecies('mandrake', 'Nhân Sâm Mandrake', 'ui_icon_crop_baby_mandrake'),
  definePikachuSpecies('glow_mushroom', 'Nấm Đèn Đom Đóm', 'ui_icon_crop_glow_mushroom'),
  definePikachuSpecies('pumpkin', 'Bí Ngô Khổng Lồ', 'ui_icon_crop_garden_pumpkin'),
  definePikachuSpecies('strawberry', 'Dâu Tây Hồng Ngọc', 'ui_icon_crop_ruby_strawberry'),
  definePikachuSpecies('burrow_apple', 'Táo Đỏ Hang Sóc', 'ui_icon_crop_burrow_apple'),
  definePikachuSpecies('blueberry', 'Việt Quất Sương Mai', 'ui_icon_crop_dew_blueberry'),
  definePikachuSpecies('golden_corn', 'Bắp Vàng Mùa Gặt', 'ui_icon_crop_golden_corn'),
  definePikachuSpecies('honey_carrot', 'Cà Rốt Mật Ngọt', 'ui_icon_crop_honey_carrot'),
  definePikachuSpecies('english_rose', 'Hoa Hồng Nước Anh', 'ui_icon_crop_english_rose'),
  definePikachuSpecies('sunflower', 'Hoa Hướng Dương', 'ui_icon_crop_hedge_sunflower'),
  definePikachuSpecies('lavender', 'Oải Hương Tím', 'ui_icon_crop_dried_lavender'),
  definePikachuSpecies('moonlight_flower', 'Hoa Ánh Trăng', 'ui_icon_crop_moonlight_flower'),
];

const CLASSIC_SHIFT_CYCLE: ReadonlyArray<{
  mode: OnetShiftMode;
  badgeVi: string;
}> = [
  { mode: 'none', badgeVi: '⏹️ Đứng Yên' },
  { mode: 'down', badgeVi: '⬇️ Rơi Xuống' },
  { mode: 'up', badgeVi: '⬆️ Dồn Lên' },
  { mode: 'left', badgeVi: '⬅️ Dồn Trái' },
  { mode: 'right', badgeVi: '➡️ Dồn Phải' },
  { mode: 'center_h', badgeVi: '➡️⬅️ Gom Tâm Ngang' },
  { mode: 'split_h', badgeVi: '⬅️➡️ Tách Hai Biên' },
  { mode: 'center_v', badgeVi: '⬇️⬆️ Gom Tâm Dọc' },
  { mode: 'split_v', badgeVi: '⬆️⬇️ Tách Đỉnh Đáy' },
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

export interface OnetSlideVfxEvent {
  speciesId: string;
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
}

export class CreatureOnetEngine {
  public static readonly CLASSIC_ROWS = 9;
  public static readonly CLASSIC_COLS = 16;
  public static readonly INITIAL_LIVES = 10;

  public readonly stage: number;
  public readonly rows: number;
  public readonly cols: number;
  public readonly speciesCount: number;
  public readonly totalPairs: number;
  public readonly shiftMode: OnetShiftMode;
  public readonly shiftBadgeVi: string;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly title: string;
  public readonly reward: PuzzleRewardSpec;
  public readonly hintGoldCost: number;
  public readonly shuffleGoldCost: number;

  /** Classic 9 × 16 grid [r][c]: speciesId string or null if cleared */
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

  /** Classic Pikachu Lives / Shuffle counter (❤️ starts at 10) */
  public lives: number;
  public freeHintsLeft: number;
  public paidHintsLeft: number;
  public paidShufflesLeft: number;
  public talismanUsed = false;
  public status: 'playing' | 'won' | 'lost' = 'playing';

  public matchVfxQueue: OnetMatchVfxEvent[] = [];
  public slideVfxQueue: OnetSlideVfxEvent[] = [];
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

    // Authentic Classic Pikachu 2003 board: 9 rows × 16 cols = 144 tiles (72 pairs, 36 icons × 4)
    this.rows = CreatureOnetEngine.CLASSIC_ROWS;
    this.cols = CreatureOnetEngine.CLASSIC_COLS;
    this.totalPairs = Math.floor((this.rows * this.cols) / 2);
    this.speciesCount = CREATURE_ONET_SPECIES.length; // 36

    const shiftSpec = CLASSIC_SHIFT_CYCLE[(this.stage - 1) % CLASSIC_SHIFT_CYCLE.length];
    this.shiftMode = shiftSpec.mode;
    this.shiftBadgeVi = shiftSpec.badgeVi;

    const locName =
      ONET_CHAPTER_LOCATIONS_VI[
        Math.floor((this.stage - 1) / 9) % ONET_CHAPTER_LOCATIONS_VI.length
      ];
    this.title = this.milestoneBoss
      ? `👑 ${this.milestoneBoss.bossTitleVi} • ${locName}`
      : locName;

    this.lives = CreatureOnetEngine.INITIAL_LIVES;
    this.freeHintsLeft = this.stage <= 25 ? 3 : this.stage <= 140 ? 2 : 1;
    this.paidHintsLeft = 3;
    this.paidShufflesLeft = 3;
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
      gold: Math.round(85 + effectiveCap * 3.8 + stars * 18),
      xp: Math.round(60 + effectiveCap * 2.8 + stars * 12),
      isMasterpiece:
        Boolean(this.milestoneBoss) ||
        this.stage % 10 === 0 ||
        this.stage === MAX_MINIGAME_STAGE,
    };

    this.populateInitialBoard();
  }

  /** Alias kept for compatibility with helper UI counters */
  public get freeShufflesLeft(): number {
    return this.lives;
  }

  public set freeShufflesLeft(val: number) {
    this.lives = Math.max(0, Math.floor(val));
  }

  public get remainingPairs(): number {
    return Math.max(0, this.totalPairs - this.matchedPairs);
  }

  public static getSpeciesDef(id: string): OnetSpeciesDef {
    return CREATURE_ONET_SPECIES.find((s) => s.id === id) ?? CREATURE_ONET_SPECIES[0];
  }

  private populateInitialBoard(): void {
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

    // Higher stages scatter adjacent identical pairs slightly to reward 2- and 3-segment paths
    const antiClumpProb =
      this.stage <= 9
        ? 0
        : Math.min(0.75, 0.18 + ((this.stage - 9) / 768) * 0.57);
    if (antiClumpProb > 0) {
      const passes = this.stage >= 300 ? 2 : 1;
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

    // Guarantee at least 1 valid connection right from start without costing a life
    if (!this.findAnyValidPair()) {
      this.shuffleRemainingTilesInPlace();
    }
  }

  /**
   * Applies the active Classic Pikachu 2003 shift/gravity law after tiles are cleared,
   * recording smooth tile transitions in `slideVfxQueue`.
   */
  public applyStageShift(): OnetSlideVfxEvent[] {
    if (this.shiftMode === 'none') return [];

    const slides: OnetSlideVfxEvent[] = [];

    const compactColSegment = (
      c: number,
      rStart: number,
      rEnd: number,
      towardBottom: boolean
    ) => {
      const items: Array<{ sp: string; origR: number }> = [];
      for (let r = rStart; r <= rEnd; r++) {
        const sp = this.grid[r][c];
        if (sp) items.push({ sp, origR: r });
        this.grid[r][c] = null;
      }
      if (towardBottom) {
        let writeR = rEnd;
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          this.grid[writeR][c] = it.sp;
          if (it.origR !== writeR) {
            slides.push({
              speciesId: it.sp,
              fromR: it.origR,
              fromC: c,
              toR: writeR,
              toC: c,
            });
          }
          writeR -= 1;
        }
      } else {
        let writeR = rStart;
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          this.grid[writeR][c] = it.sp;
          if (it.origR !== writeR) {
            slides.push({
              speciesId: it.sp,
              fromR: it.origR,
              fromC: c,
              toR: writeR,
              toC: c,
            });
          }
          writeR += 1;
        }
      }
    };

    const compactRowSegment = (
      r: number,
      cStart: number,
      cEnd: number,
      towardRight: boolean
    ) => {
      const items: Array<{ sp: string; origC: number }> = [];
      for (let c = cStart; c <= cEnd; c++) {
        const sp = this.grid[r][c];
        if (sp) items.push({ sp, origC: c });
        this.grid[r][c] = null;
      }
      if (towardRight) {
        let writeC = cEnd;
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          this.grid[r][writeC] = it.sp;
          if (it.origC !== writeC) {
            slides.push({
              speciesId: it.sp,
              fromR: r,
              fromC: it.origC,
              toR: r,
              toC: writeC,
            });
          }
          writeC -= 1;
        }
      } else {
        let writeC = cStart;
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          this.grid[r][writeC] = it.sp;
          if (it.origC !== writeC) {
            slides.push({
              speciesId: it.sp,
              fromR: r,
              fromC: it.origC,
              toR: r,
              toC: writeC,
            });
          }
          writeC += 1;
        }
      }
    };

    switch (this.shiftMode) {
      case 'down':
        for (let c = 0; c < this.cols; c++) {
          compactColSegment(c, 0, this.rows - 1, true);
        }
        break;
      case 'up':
        for (let c = 0; c < this.cols; c++) {
          compactColSegment(c, 0, this.rows - 1, false);
        }
        break;
      case 'left':
        for (let r = 0; r < this.rows; r++) {
          compactRowSegment(r, 0, this.cols - 1, false);
        }
        break;
      case 'right':
        for (let r = 0; r < this.rows; r++) {
          compactRowSegment(r, 0, this.cols - 1, true);
        }
        break;
      case 'center_h': {
        const midLeftEnd = Math.floor(this.cols / 2) - 1;
        const midRightStart = Math.floor(this.cols / 2);
        for (let r = 0; r < this.rows; r++) {
          if (midLeftEnd >= 0) compactRowSegment(r, 0, midLeftEnd, true);
          if (midRightStart < this.cols) compactRowSegment(r, midRightStart, this.cols - 1, false);
        }
        break;
      }
      case 'split_h': {
        const midLeftEnd = Math.floor(this.cols / 2) - 1;
        const midRightStart = Math.floor(this.cols / 2);
        for (let r = 0; r < this.rows; r++) {
          if (midLeftEnd >= 0) compactRowSegment(r, 0, midLeftEnd, false);
          if (midRightStart < this.cols) compactRowSegment(r, midRightStart, this.cols - 1, true);
        }
        break;
      }
      case 'center_v': {
        const midTopEnd = Math.floor(this.rows / 2);
        const midBotStart = midTopEnd + 1;
        for (let c = 0; c < this.cols; c++) {
          compactColSegment(c, 0, midTopEnd, true);
          if (midBotStart < this.rows) compactColSegment(c, midBotStart, this.rows - 1, false);
        }
        break;
      }
      case 'split_v': {
        const midTopEnd = Math.floor(this.rows / 2) - 1;
        const midBotStart = Math.floor(this.rows / 2);
        for (let c = 0; c < this.cols; c++) {
          if (midTopEnd >= 0) compactColSegment(c, 0, midTopEnd, false);
          if (midBotStart < this.rows) compactColSegment(c, midBotStart, this.rows - 1, true);
        }
        break;
      }
    }

    if (slides.length > 0) {
      this.slideVfxQueue.push(...slides);
    }
    return slides;
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
   * Shuffles remaining occupied tiles IN PLACE (preserving the shifted silhouette).
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

    const bySp = new Map<string, number[]>();
    values.forEach((v, idx) => {
      const arr = bySp.get(v) ?? [];
      arr.push(idx);
      bySp.set(v, arr);
    });
    const dupEntry = [...bySp.entries()].find(([, idxs]) => idxs.length >= 2);
    if (dupEntry) {
      const targetSp = dupEntry[0];
      for (let idx = 0; idx < coords.length; idx++) {
        this.grid[coords[idx].r][coords[idx].c] = values[idx];
      }
      outer: for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const origI = this.grid[coords[i].r][coords[i].c]!;
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
          for (let idx = 0; idx < coords.length; idx++) {
            this.grid[coords[idx].r][coords[idx].c] = values[idx];
          }
        }
      }
    }
    return Boolean(this.findAnyValidPair());
  }

  /**
   * Checks whether at least 1 valid pair remains; if deadlocked:
   * - If `lives > 0`, spends 1 ❤️ life and shuffles remaining tiles in place.
   * - If `lives <= 0`, transitions board `status` to `'lost'`.
   */
  private resolveDeadlockWithClassicLives(): {
    autoShuffled: boolean;
    lost: boolean;
  } {
    if (this.remainingPairs <= 0) return { autoShuffled: false, lost: false };
    if (this.findAnyValidPair()) return { autoShuffled: false, lost: false };

    if (this.lives > 0) {
      this.lives -= 1;
      this.shuffleRemainingTilesInPlace();
      this.autoShufflesCount += 1;
      this.lastAutoShuffleNotice = `🔀 Hết nước đi — Tự dùng 1 ❤️ đổi vị trí bàn cờ (còn ${this.lives} ❤️)!`;
      return { autoShuffled: true, lost: false };
    }

    this.status = 'lost';
    this.lastAutoShuffleNotice =
      '💔 Đã hết lượt đổi vị trí (0 ❤️) và không còn cặp nối hợp lệ!';
    return { autoShuffled: false, lost: true };
  }

  public tapCell(
    r: number,
    c: number
  ): {
    action: 'empty' | 'selected' | 'deselected' | 'switched' | 'blocked' | 'matched';
    matchedSpeciesId?: string;
    waypoints?: OnetPoint[];
    autoShuffled?: boolean;
    lost?: boolean;
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

    const waypoints = this.findConnectionPath(prev, { r, c });
    if (!waypoints) {
      this.combo = 0;
      this.selected = { r, c };
      return { action: 'blocked' };
    }

    // Valid match! Clear both tiles, emit red lightning beam, then apply stage shift law!
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
        lost: false,
        won: true,
      };
    }

    // Apply classic 9-mode Pikachu gravity/sliding!
    this.applyStageShift();

    const dl = this.resolveDeadlockWithClassicLives();
    return {
      action: 'matched',
      matchedSpeciesId: clickedSp,
      waypoints,
      autoShuffled: dl.autoShuffled,
      lost: dl.lost,
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
      return { ok: false, pair: null, path: null, msg: 'Ván chơi không ở trạng thái đang mở!' };
    }
    const found = this.findAnyValidPair();
    if (!found) {
      return { ok: false, pair: null, path: null, msg: 'Không còn cặp nối trực tiếp — hãy Đổi Bàn!' };
    }
    this.hintPair = [found.a, found.b];
    this.hintPath = found.path;
    this.selected = { ...found.a };
    const sp = this.grid[found.a.r][found.a.c];
    const spName = sp ? CreatureOnetEngine.getSpeciesDef(sp).nameVi : 'Hình';
    return {
      ok: true,
      pair: this.hintPair,
      path: this.hintPath,
      msg: `🔍 Soi thấy cặp ${spName} nối được trong ${found.path.length - 1} đoạn!`,
    };
  }

  public useManualShuffle(free = false): { ok: boolean; msg: string } {
    if (this.status === 'won') {
      return { ok: false, msg: 'Màn chơi đã hoàn thành!' };
    }
    if (!free) {
      if (this.lives <= 0) {
        return { ok: false, msg: 'Đã hết lượt đổi bàn (0 ❤️)!' };
      }
      this.lives -= 1;
    }
    if (this.status === 'lost') {
      this.status = 'playing';
    }
    const ok = this.shuffleRemainingTilesInPlace();
    return {
      ok,
      msg: free
        ? `🔀 Đã đổi vị trí bàn cờ miễn phí (còn ${this.lives} ❤️)!`
        : `🔀 Đã dùng 1 ❤️ đổi vị trí bàn cờ (còn ${this.lives} ❤️)!`,
    };
  }

  public reviveWithExtraLives(extraLives = 2): void {
    this.lives += Math.max(1, Math.floor(extraLives));
    if (this.status === 'lost') {
      this.status = 'playing';
    }
    if (this.remainingPairs > 0 && !this.findAnyValidPair()) {
      this.shuffleRemainingTilesInPlace();
    }
  }

  public applyPhoenixTalisman(): {
    ok: boolean;
    clearedPairs: number;
    won: boolean;
    msg: string;
  } {
    if ((this.status !== 'playing' && this.status !== 'lost') || this.talismanUsed) {
      return {
        ok: false,
        clearedPairs: 0,
        won: false,
        msg: 'Bùa Phượng Hoàng đã được triệu hồi trong lượt này!',
      };
    }
    this.talismanUsed = true;
    this.status = 'playing';
    this.selected = null;
    this.hintPair = null;
    this.hintPath = null;

    let clearedPairs = 0;
    const targetClear = Math.min(3, this.remainingPairs);
    for (let k = 0; k < targetClear; k++) {
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
      this.applyStageShift();
    }

    if (this.matchedPairs >= this.totalPairs) {
      this.status = 'won';
      this.score += 350;
      return {
        ok: true,
        clearedPairs,
        won: true,
        msg: `🔥 Lửa Phượng Hoàng Fawkes kết nối ${clearedPairs} cặp & hoàn tất màn chơi!`,
      };
    }

    this.lives += 2;
    this.freeHintsLeft += 1;
    if (!this.findAnyValidPair()) {
      this.shuffleRemainingTilesInPlace();
    }
    return {
      ok: true,
      clearedPairs,
      won: false,
      msg: `🔥 Phượng Hoàng Fawkes đã ghép ${clearedPairs} cặp, tặng +2 ❤️ Đổi Bàn & +1 🔍 Dò Cặp!`,
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

  public exportSession(extra?: {
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedOnetSession | null {
    if (this.status === 'won') return null;
    return {
      stage: this.stage,
      rows: this.rows,
      cols: this.cols,
      grid: this.grid.map((row) => [...row]),
      selected: this.selected ? { r: this.selected.r, c: this.selected.c } : null,
      hintPair: this.hintPair
        ? [
            { r: this.hintPair[0].r, c: this.hintPair[0].c },
            { r: this.hintPair[1].r, c: this.hintPair[1].c },
          ]
        : null,
      hintPath: this.hintPath ? this.hintPath.map((pt) => ({ r: pt.r, c: pt.c })) : null,
      matchedPairs: this.matchedPairs,
      combo: this.combo,
      maxCombo: this.maxCombo,
      score: this.score,
      movesAttempted: this.movesAttempted,
      autoShufflesCount: this.autoShufflesCount,
      lives: this.lives,
      freeHintsLeft: this.freeHintsLeft,
      paidHintsLeft: this.paidHintsLeft,
      paidShufflesLeft: this.paidShufflesLeft,
      talismanUsed: this.talismanUsed,
      status: this.status,
      companionCharge: extra?.companionCharge,
      snackPieUsed: extra?.snackPieUsed,
      savedAt: Date.now(),
    };
  }

  public restoreSession(snap: SavedOnetSession | null | undefined): boolean {
    if (!snap || snap.stage !== this.stage || snap.rows !== this.rows || snap.cols !== this.cols) {
      return false;
    }
    if (snap.status !== 'playing' && snap.status !== 'lost') return false;
    if (!Array.isArray(snap.grid) || snap.grid.length !== this.rows) return false;

    const validSpecies = new Set(CREATURE_ONET_SPECIES.map((s) => s.id));
    let remainingTiles = 0;
    const nextGrid: Array<Array<string | null>> = [];
    for (let r = 0; r < this.rows; r++) {
      const row = snap.grid[r];
      if (!Array.isArray(row) || row.length !== this.cols) return false;
      const nextRow: Array<string | null> = [];
      for (let c = 0; c < this.cols; c++) {
        const val = row[c];
        if (val === null || val === undefined) {
          nextRow.push(null);
        } else if (typeof val === 'string' && validSpecies.has(val)) {
          nextRow.push(val);
          remainingTiles++;
        } else {
          return false;
        }
      }
      nextGrid.push(nextRow);
    }

    if (remainingTiles < 2 || remainingTiles % 2 !== 0) return false;
    const expectedMatched = this.totalPairs - remainingTiles / 2;
    if (expectedMatched < 0 || expectedMatched >= this.totalPairs) return false;

    const validCell = (pt: { r: number; c: number } | null | undefined): OnetPoint | null =>
      pt &&
      Number.isInteger(pt.r) &&
      pt.r >= 0 &&
      pt.r < this.rows &&
      Number.isInteger(pt.c) &&
      pt.c >= 0 &&
      pt.c < this.cols
        ? { r: pt.r, c: pt.c }
        : null;

    this.grid = nextGrid;
    const sel = validCell(snap.selected);
    this.selected = sel && this.grid[sel.r]?.[sel.c] ? sel : null;
    const hp0 = Array.isArray(snap.hintPair) ? validCell(snap.hintPair[0]) : null;
    const hp1 = Array.isArray(snap.hintPair) ? validCell(snap.hintPair[1]) : null;
    this.hintPair =
      hp0 && hp1 && this.grid[hp0.r]?.[hp0.c] && this.grid[hp1.r]?.[hp1.c] ? [hp0, hp1] : null;
    this.hintPath =
      this.hintPair && Array.isArray(snap.hintPath)
        ? snap.hintPath
            .filter(
              (pt) =>
                pt &&
                Number.isInteger(pt.r) &&
                pt.r >= -1 &&
                pt.r <= this.rows &&
                Number.isInteger(pt.c) &&
                pt.c >= -1 &&
                pt.c <= this.cols
            )
            .map((pt) => ({ r: pt.r, c: pt.c }))
        : null;
    this.matchedPairs = expectedMatched;
    this.combo = Math.max(0, Math.min(200, Math.floor(snap.combo || 0)));
    this.maxCombo = Math.max(this.combo, Math.min(200, Math.floor(snap.maxCombo || 0)));
    this.score = Math.max(0, Math.floor(snap.score || 0));
    this.movesAttempted = Math.max(0, Math.floor(snap.movesAttempted || 0));
    this.autoShufflesCount = Math.max(0, Math.floor(snap.autoShufflesCount || 0));
    this.lives = Math.max(0, Math.min(30, Math.floor(snap.lives ?? CreatureOnetEngine.INITIAL_LIVES)));
    this.freeHintsLeft = Math.max(0, Math.min(15, Math.floor(snap.freeHintsLeft ?? 0)));
    this.paidHintsLeft = Math.max(0, Math.min(15, Math.floor(snap.paidHintsLeft ?? 0)));
    this.paidShufflesLeft = Math.max(0, Math.min(15, Math.floor(snap.paidShufflesLeft ?? 0)));
    this.talismanUsed = Boolean(snap.talismanUsed);
    this.status = snap.status;
    this.matchVfxQueue = [];
    this.slideVfxQueue = [];
    this.lastAutoShuffleNotice = '';
    this.bestTurnPlay = null;
    return true;
  }
}
