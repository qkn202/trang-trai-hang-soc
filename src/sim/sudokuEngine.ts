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

