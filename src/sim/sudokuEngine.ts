// Classic 9×9 Sudoku Engine (Unique-Solution Symmetric Generator, Multi-Step Undo, Notes & Timer)
import { SavedSudokuSession } from '../types/game';
import {
  MAX_MINIGAME_STAGE,
  MilestoneBossMeta,
  PuzzleRewardSpec,
  getMilestoneBossMeta,
  getStageStarReward,
  mulberry32,
} from './puzzleShared';

// ============================================================================
// CLASSIC SUDOKU 9×9 (STANDARD ROWS, COLUMNS & 3×3 BOXES — UNIQUE SOLUTION)
// ============================================================================

function countSudokuSolutions(grid: number[][], limit = 2): number {
  const rowMask = new Int32Array(9);
  const colMask = new Int32Array(9);
  const boxMask = new Int32Array(9);
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
        const used = rowMask[r] | colMask[c] | boxMask[b];
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
    for (let d = 1; d <= 9; d++) {
      const bit = 1 << d;
      if ((bestAvail & bit) === 0) continue;
      work[bestR][bestC] = d;
      rowMask[bestR] |= bit;
      colMask[bestC] |= bit;
      boxMask[b] |= bit;

      dfs();

      work[bestR][bestC] = 0;
      rowMask[bestR] &= ~bit;
      colMask[bestC] &= ~bit;
      boxMask[b] &= ~bit;
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

export interface SudokuUndoSnapshot {
  grid: number[][];
  notes: number[][];
  selected: { r: number; c: number } | null;
}

export class SudokuPuzzleEngine {
  public readonly stage: number;
  public readonly classicDifficultyVi: string;
  public readonly difficultyLabel: string;
  public readonly milestoneBoss: MilestoneBossMeta | null;
  public readonly reward: PuzzleRewardSpec;
  public maxMistakes: number;
  public readonly hintGoldCost: number;
  /** Pure Classic 9×9 Sudoku — no non-classic diagonal or odd/even rules */
  public readonly diagonalRule = false;
  public readonly parityRule = false;
  public parityMask: (0 | 1 | 2)[][] = [];
  public talismanUsed = false;
  public solution: number[][] = [];
  /** Original pre-filled black clue cells */
  public initialGiven: boolean[][] = [];
  /** Locked cells (original clues + revealed hints) */
  public given: boolean[][] = [];
  public grid: number[][] = [];
  /** Bitmask (1 << d) for classic 3×3 pencil notes 1..9 per cell */
  public notes: number[][] = [];
  public pencilMode = false;
  public eraseMode = false;
  public editHistory: Array<{ r: number; c: number }> = [];
  public undoStack: SudokuUndoSnapshot[] = [];
  public selected: { r: number; c: number } | null = null;
  /** Highlighted digit (1..9) across the board & notes */
  public highlightDigit = 0;
  public elapsedSec = 0;
  public freeHintsLeft: number;
  public paidHintsLeft: number;
  public mistakesCount = 0;
  public status: 'playing' | 'won' | 'lost' = 'playing';

  constructor(stage: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    this.milestoneBoss = getMilestoneBossMeta(this.stage);

    let targetBlanks = 32;
    if (this.stage <= 25) {
      this.classicDifficultyVi = 'Dễ';
      targetBlanks = 31 + Math.floor((this.stage - 1) / 6); // 31..35
    } else if (this.stage <= 90) {
      this.classicDifficultyVi = 'Trung Bình';
      targetBlanks = 37 + Math.floor((this.stage - 26) / 16); // 37..41
    } else if (this.stage <= 220) {
      this.classicDifficultyVi = 'Khó';
      targetBlanks = 43 + Math.floor((this.stage - 91) / 32); // 43..47
    } else if (this.stage <= 420) {
      this.classicDifficultyVi = 'Chuyên Gia';
      targetBlanks = 48 + Math.floor((this.stage - 221) / 50); // 48..52
    } else if (this.stage <= 620) {
      this.classicDifficultyVi = 'Bậc Thầy';
      targetBlanks = 53 + Math.floor((this.stage - 421) / 90); // 53..55
    } else {
      this.classicDifficultyVi = 'Cực Khó';
      targetBlanks = this.stage >= 720 ? 57 : 56; // 24..25 givens
    }

    this.difficultyLabel = this.milestoneBoss
      ? `👑 Mốc ${this.stage} • ${this.classicDifficultyVi}`
      : this.classicDifficultyVi;

    // Standard Classic Sudoku 3-mistakes limit & 1+ free hint
    this.maxMistakes = 3;
    this.freeHintsLeft = this.stage <= 25 ? 2 : 1;
    this.paidHintsLeft = 2;
    this.hintGoldCost = Math.min(240, 80 + Math.floor(this.stage / 6));

    const stars = getStageStarReward(this.stage);
    const effectiveCap =
      Math.min(this.stage, 260) + Math.floor(Math.max(0, this.stage - 260) * 0.35);
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

    const puzzle = this.solution.map((row) => row.slice());

    // Pass 1: rotational 180° symmetric cell pairs for authentic classic newspaper/app Sudoku balance
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

      if (countSudokuSolutions(puzzle, 2) === 1) {
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
        if (countSudokuSolutions(puzzle, 2) === 1) {
          blanks += 1;
        } else {
          puzzle[r][c] = saved;
        }
      }
    }

    this.grid = puzzle.map((row) => row.slice());
    this.initialGiven = puzzle.map((row) => row.map((v) => v !== 0));
    this.given = puzzle.map((row) => row.map((v) => v !== 0));
    this.notes = Array.from({ length: 9 }, () => Array<number>(9).fill(0));
    this.parityMask = Array.from({ length: 9 }, () => Array<0 | 1 | 2>(9).fill(0));
    this.undoStack = [];
    this.editHistory = [];
    this.elapsedSec = 0;

    // Select first blank cell by default for immediate keyboard/pad play
    outer: for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!this.given[r][c]) {
          this.selected = { r, c };
          break outer;
        }
      }
    }
    this.highlightDigit = 0;
  }

  public tickTimer(dt: number): boolean {
    if (this.status !== 'playing' || dt <= 0) return false;
    const prevWhole = Math.floor(this.elapsedSec);
    this.elapsedSec += dt;
    return Math.floor(this.elapsedSec) !== prevWhole;
  }

  public formatElapsedTime(): string {
    const total = Math.max(0, Math.floor(this.elapsedSec));
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

  public get canUndo(): boolean {
    return this.undoStack.length > 0 && (this.status === 'playing' || this.status === 'lost');
  }

  private pushUndoSnapshot(): void {
    this.undoStack.push({
      grid: this.grid.map((row) => row.slice()),
      notes: this.notes.map((row) => row.slice()),
      selected: this.selected ? { ...this.selected } : null,
    });
    if (this.undoStack.length > 120) {
      this.undoStack.shift();
    }
  }

  public undo(): boolean {
    if (!this.canUndo) return false;
    const snap = this.undoStack.pop()!;
    this.grid = snap.grid.map((row) => row.slice());
    this.notes = snap.notes.map((row) => row.slice());
    this.selected = snap.selected ? { ...snap.selected } : this.selected;
    this.eraseMode = false;

    this.editHistory = this.editHistory.filter(
      ({ r, c }) => !this.given[r][c] && (this.grid[r][c] !== 0 || this.notes[r][c] !== 0)
    );

    if (this.status === 'lost') {
      this.status = 'playing';
      this.mistakesCount = Math.max(0, Math.min(this.mistakesCount, this.maxMistakes - 1));
    }

    const selVal = this.selected ? this.grid[this.selected.r]?.[this.selected.c] ?? 0 : 0;
    this.highlightDigit = selVal > 0 ? selVal : 0;
    return true;
  }

  public selectCell(r: number, c: number): void {
    if (r < 0 || r >= 9 || c < 0 || c >= 9) return;
    this.selected = { r, c };
    const val = this.grid[r][c];
    this.highlightDigit = val >= 1 && val <= 9 ? val : 0;
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
    const nr = (cur.r + dr + 9) % 9;
    const nc = (cur.c + dc + 9) % 9;
    this.selectCell(nr, nc);
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
    if (this.status !== 'playing' || digit < 1 || digit > 9) {
      return { changed: false, conflict: false, lost: this.status === 'lost', won: false };
    }
    this.eraseMode = false;

    if (!this.selected) {
      this.highlightDigit = this.highlightDigit === digit ? 0 : digit;
      return { changed: false, conflict: false, lost: false, won: false };
    }

    const { r, c } = this.selected;
    if (this.given[r][c]) {
      // Tapping a number on the pad while viewing a locked/clue cell highlights all instances of that digit
      this.highlightDigit = digit;
      return { changed: false, conflict: false, lost: false, won: false };
    }

    if (this.pencilMode) {
      // Protect already-valid filled digits from accidental overwrite when Notes mode is ON
      if (this.grid[r][c] !== 0 && !this.isWrongCell(r, c)) {
        this.highlightDigit = digit;
        return { changed: false, conflict: false, lost: false, won: false };
      }
      this.pushUndoSnapshot();
      if (this.grid[r][c] !== 0) {
        this.grid[r][c] = 0;
      }
      this.notes[r][c] ^= 1 << digit;
      if (this.notes[r][c] !== 0) {
        this.recordCellEdit(r, c);
      } else {
        this.editHistory = this.editHistory.filter((item) => item.r !== r || item.c !== c);
      }
      this.highlightDigit = (this.notes[r][c] & (1 << digit)) !== 0 ? digit : 0;
      return { changed: true, conflict: false, lost: false, won: false };
    }

    this.pushUndoSnapshot();

    if (this.grid[r][c] === digit) {
      this.grid[r][c] = 0;
      this.highlightDigit = 0;
      this.editHistory = this.editHistory.filter((item) => item.r !== r || item.c !== c);
      return { changed: true, conflict: false, lost: false, won: false };
    }

    this.grid[r][c] = digit;
    this.notes[r][c] = 0;
    this.highlightDigit = digit;
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
    this.pushUndoSnapshot();
    this.grid[r][c] = 0;
    this.notes[r][c] = 0;
    this.selected = { r, c };
    this.highlightDigit = 0;
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
          if (
            !this.given[r][c] &&
            this.grid[r][c] !== 0 &&
            this.grid[r][c] !== this.solution[r][c]
          ) {
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
    this.highlightDigit = ans;

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
      this.highlightDigit = ans;
      revealed++;
    }

    if (this.checkSolved()) {
      this.status = 'won';
    }

    return {
      ok: true,
      revealed,
      won: this.status === 'won',
      msg: `🔥 Bùa Phượng Hoàng: Điền đúng ${revealed} ô & cộng +2 lượt chống sai!`,
    };
  }

  public exportSession(extra?: {
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedSudokuSession | null {
    if (this.status !== 'playing' && this.status !== 'lost') {
      return null;
    }
    return {
      stage: this.stage,
      solution: this.solution.map((row) => row.slice()),
      initialGiven: this.initialGiven.map((row) => row.slice()),
      given: this.given.map((row) => row.slice()),
      grid: this.grid.map((row) => row.slice()),
      notes: this.notes.map((row) => row.slice()),
      mistakesCount: this.mistakesCount,
      maxMistakes: this.maxMistakes,
      freeHintsLeft: this.freeHintsLeft,
      paidHintsLeft: this.paidHintsLeft,
      talismanUsed: this.talismanUsed,
      pencilMode: this.pencilMode,
      eraseMode: this.eraseMode,
      selected: this.selected ? { ...this.selected } : null,
      highlightDigit: this.highlightDigit,
      elapsedSec: Math.max(0, this.elapsedSec),
      status: this.status,
      editHistory: this.editHistory.slice(-81).map((pt) => ({ ...pt })),
      undoStack: this.undoStack.slice(-60).map((u) => ({
        grid: u.grid.map((row) => row.slice()),
        notes: u.notes.map((row) => row.slice()),
        selected: u.selected ? { ...u.selected } : null,
      })),
      companionCharge: Math.max(0, Math.round(extra?.companionCharge ?? 0)),
      snackPieUsed: Boolean(extra?.snackPieUsed),
      savedAt: Date.now(),
    };
  }

  public restoreSession(snap: SavedSudokuSession | null | undefined): boolean {
    if (!snap || snap.stage !== this.stage) return false;
    if (snap.status !== 'playing' && snap.status !== 'lost') return false;
    if (
      !Array.isArray(snap.solution) ||
      snap.solution.length !== 9 ||
      !Array.isArray(snap.initialGiven) ||
      snap.initialGiven.length !== 9 ||
      !Array.isArray(snap.given) ||
      snap.given.length !== 9 ||
      !Array.isArray(snap.grid) ||
      snap.grid.length !== 9 ||
      !Array.isArray(snap.notes) ||
      snap.notes.length !== 9
    ) {
      return false;
    }

    let alreadySolved = true;
    for (let r = 0; r < 9; r++) {
      if (
        !Array.isArray(snap.solution[r]) ||
        snap.solution[r].length !== 9 ||
        !Array.isArray(snap.initialGiven[r]) ||
        snap.initialGiven[r].length !== 9 ||
        !Array.isArray(snap.given[r]) ||
        snap.given[r].length !== 9 ||
        !Array.isArray(snap.grid[r]) ||
        snap.grid[r].length !== 9 ||
        !Array.isArray(snap.notes[r]) ||
        snap.notes[r].length !== 9
      ) {
        return false;
      }
      for (let c = 0; c < 9; c++) {
        const sol = snap.solution[r][c];
        const gv = snap.grid[r][c];
        const nv = snap.notes[r][c];
        if (typeof sol !== 'number' || sol < 1 || sol > 9) return false;
        if (typeof gv !== 'number' || gv < 0 || gv > 9) return false;
        if (typeof nv !== 'number' || nv < 0 || nv > 0x3fe) return false;
        if ((snap.initialGiven[r][c] || snap.given[r][c]) && gv !== sol) {
          return false;
        }
        if (gv !== sol) {
          alreadySolved = false;
        }
      }
    }
    if (alreadySolved) return false;

    this.solution = snap.solution.map((row) => row.slice());
    this.initialGiven = snap.initialGiven.map((row) => row.map(Boolean));
    this.given = snap.given.map((row) => row.map(Boolean));
    this.grid = snap.grid.map((row) => row.slice());
    this.notes = snap.notes.map((row) => row.map((v) => v & 0x3fe));
    this.maxMistakes = Math.max(3, Math.min(12, Math.round(snap.maxMistakes || 3)));
    this.mistakesCount = Math.max(0, Math.min(this.maxMistakes + 3, Math.round(snap.mistakesCount || 0)));
    this.freeHintsLeft = Math.max(0, Math.round(snap.freeHintsLeft ?? 0));
    this.paidHintsLeft = Math.max(0, Math.round(snap.paidHintsLeft ?? 0));
    this.talismanUsed = Boolean(snap.talismanUsed);
    this.pencilMode = Boolean(snap.pencilMode);
    this.eraseMode = Boolean(snap.eraseMode);
    this.selected =
      snap.selected &&
      snap.selected.r >= 0 &&
      snap.selected.r < 9 &&
      snap.selected.c >= 0 &&
      snap.selected.c < 9
        ? { r: Math.round(snap.selected.r), c: Math.round(snap.selected.c) }
        : null;
    this.highlightDigit =
      typeof snap.highlightDigit === 'number' &&
      snap.highlightDigit >= 0 &&
      snap.highlightDigit <= 9
        ? Math.round(snap.highlightDigit)
        : 0;
    this.elapsedSec = Math.max(0, Number.isFinite(snap.elapsedSec) ? snap.elapsedSec : 0);
    this.status = snap.status;
    this.editHistory = Array.isArray(snap.editHistory)
      ? snap.editHistory
          .filter(
            (pt) =>
              pt &&
              typeof pt.r === 'number' &&
              typeof pt.c === 'number' &&
              pt.r >= 0 &&
              pt.r < 9 &&
              pt.c >= 0 &&
              pt.c < 9
          )
          .slice(-81)
          .map((pt) => ({ r: Math.round(pt.r), c: Math.round(pt.c) }))
      : [];
    this.undoStack = Array.isArray(snap.undoStack)
      ? snap.undoStack
          .filter(
            (u) =>
              u &&
              Array.isArray(u.grid) &&
              u.grid.length === 9 &&
              Array.isArray(u.notes) &&
              u.notes.length === 9
          )
          .slice(-60)
          .map((u) => ({
            grid: u.grid.map((row) => row.slice()),
            notes: u.notes.map((row) => row.slice()),
            selected:
              u.selected &&
              u.selected.r >= 0 &&
              u.selected.r < 9 &&
              u.selected.c >= 0 &&
              u.selected.c < 9
                ? { r: Math.round(u.selected.r), c: Math.round(u.selected.c) }
                : null,
          }))
      : [];
    return true;
  }
}
