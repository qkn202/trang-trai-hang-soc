import { SavedMinesweeperSession } from '../types/game';
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

export interface MinesweeperCell {
  r: number;
  c: number;
  hasMine: boolean;
  revealed: boolean;
  flagged: boolean;
  defused: boolean;
  adjacentMines: number;
}

export interface MinesweeperTapResult {
  action: 'revealed' | 'chord' | 'flagged' | 'shield_saved' | 'exploded' | 'blocked_flag' | 'noop';
  revealedCells: Array<{ r: number; c: number }>;
  defusedCell?: { r: number; c: number };
  shieldSaved: boolean;
  won: boolean;
  lost: boolean;
}

export interface MinesweeperHintResult {
  ok: boolean;
  cell?: { r: number; c: number };
  revealedCells: Array<{ r: number; c: number }>;
  flaggedMineCell?: { r: number; c: number };
  won: boolean;
}

function getMinesweeperStageSpec(stage: number): {
  rows: number;
  cols: number;
  mines: number;
  baseShields: number;
} {
  const s = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
  const boss = getMilestoneBossMeta(s) !== null;
  let rows = 8;
  let cols = 8;
  let mines = 8;

  if (s <= 10) {
    rows = 8;
    cols = 8;
    mines = 8 + Math.floor((s - 1) / 3);
  } else if (s <= 35) {
    rows = 9;
    cols = 9;
    mines = 11 + Math.floor((s - 11) / 8);
  } else if (s <= 80) {
    rows = 9;
    cols = 12;
    mines = 16 + Math.floor((s - 36) / 14);
  } else if (s <= 160) {
    rows = 10;
    cols = 14;
    mines = 22 + Math.floor((s - 81) / 20);
  } else if (s <= 300) {
    rows = 12;
    cols = 16;
    mines = 32 + Math.floor((s - 161) / 35);
  } else if (s <= 500) {
    rows = 13;
    cols = 18;
    mines = 42 + Math.floor((s - 301) / 50);
  } else {
    rows = 14;
    cols = 20;
    mines = 52 + Math.floor((s - 501) / 70);
  }

  if (boss) {
    mines = Math.min(Math.floor(rows * cols * 0.25), mines + 2);
  }
  const maxSafeMines = Math.max(4, rows * cols - 12);
  mines = Math.min(mines, maxSafeMines);
  const baseShields = (s <= 15 ? 2 : 1) + (boss ? 1 : 0);

  return { rows, cols, mines, baseShields };
}

export function sanitizeSavedMinesweeperSession(
  raw: unknown,
  expectedStage: number
): SavedMinesweeperSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const stage = Math.round(Number(r.stage));
  if (!Number.isFinite(stage) || stage !== expectedStage || stage < 1 || stage > MAX_MINIGAME_STAGE) {
    return null;
  }
  const rows = Math.round(Number(r.rows));
  const cols = Math.round(Number(r.cols));
  if (!Number.isFinite(rows) || !Number.isFinite(cols) || rows < 5 || rows > 20 || cols < 5 || cols > 24) {
    return null;
  }
  const totalCells = rows * cols;
  const totalMines = Math.round(Number(r.totalMines));
  if (!Number.isFinite(totalMines) || totalMines < 1 || totalMines >= totalCells - 9) {
    return null;
  }
  const sanitizeIdxList = (arr: unknown): number[] => {
    if (!Array.isArray(arr)) return [];
    const out: number[] = [];
    const seen = new Set<number>();
    for (const item of arr) {
      const idx = Math.round(Number(item));
      if (Number.isFinite(idx) && idx >= 0 && idx < totalCells && !seen.has(idx)) {
        seen.add(idx);
        out.push(idx);
      }
    }
    return out;
  };
  if (r.status !== 'playing' && r.status !== 'lost') {
    return null;
  }
  const status = r.status;
  const mineIndices = sanitizeIdxList(r.mineIndices);
  const revealedIndices = sanitizeIdxList(r.revealedIndices);
  if (status === 'playing' && Boolean(r.minesGenerated) && revealedIndices.length >= totalCells - totalMines) {
    return null;
  }
  const rawExp = r.explodedIndex;
  const explodedIndex =
    typeof rawExp === 'number' && Number.isFinite(rawExp) && rawExp >= 0 && rawExp < totalCells
      ? Math.round(rawExp)
      : null;

  return {
    v: 1,
    stage,
    rows,
    cols,
    totalMines,
    minesGenerated: Boolean(r.minesGenerated),
    mineIndices,
    revealedIndices,
    flaggedIndices: sanitizeIdxList(r.flaggedIndices),
    defusedIndices: sanitizeIdxList(r.defusedIndices),
    shieldsLeft: Math.max(0, Math.min(9, Math.round(Number(r.shieldsLeft ?? 0)) || 0)),
    explodedIndex,
    flagMode: Boolean(r.flagMode),
    movesCount: Math.max(0, Math.round(Number(r.movesCount ?? 0)) || 0),
    freeHintsLeft: Math.max(0, Math.min(9, Math.round(Number(r.freeHintsLeft ?? 0)) || 0)),
    paidHintsLeft: Math.max(0, Math.min(9, Math.round(Number(r.paidHintsLeft ?? 0)) || 0)),
    talismanUsed: Boolean(r.talismanUsed),
    status,
    companionCharge:
      typeof r.companionCharge === 'number' && Number.isFinite(r.companionCharge)
        ? Math.max(0, Math.round(r.companionCharge))
        : 0,
    snackPieUsed: Boolean(r.snackPieUsed),
  };
}

export class MinesweeperEngine {
  public readonly stage: number;
  public readonly attemptSeed: number;
  public readonly rows: number;
  public readonly cols: number;
  public readonly totalMines: number;
  public readonly reward: PuzzleRewardSpec;
  public readonly milestoneBoss: MilestoneBossMeta | null;

  public grid: MinesweeperCell[][];
  public minesGenerated = false;
  public status: 'playing' | 'won' | 'lost' = 'playing';
  public shieldsLeft: number;
  public explodedCell: { r: number; c: number } | null = null;
  public flagMode = false;
  public movesCount = 0;

  public freeHintsLeft: number;
  public paidHintsLeft: number;
  public readonly hintGoldCost = 45;
  public talismanUsed = false;
  public lastHintCell: { r: number; c: number } | null = null;

  constructor(stage: number, attemptSeed?: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    this.attemptSeed =
      attemptSeed !== undefined && Number.isFinite(attemptSeed)
        ? (Math.floor(attemptSeed) >>> 0) || 1
        : ((Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0) || 1;
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    const tier = getMinigameDifficultyTier(this.stage);
    const spec = getMinesweeperStageSpec(this.stage);
    this.rows = spec.rows;
    this.cols = spec.cols;
    this.totalMines = spec.mines;
    this.shieldsLeft = spec.baseShields;

    const isBoss = Boolean(this.milestoneBoss);
    this.freeHintsLeft = isBoss ? 3 : 2;
    this.paidHintsLeft = 3;

    this.reward = {
      stars: getStageStarReward(this.stage),
      sand: isBoss ? 2 : 1,
      gold: Math.round(52 + tier.tierIndex * 14 + (isBoss ? 45 : 0)),
      xp: Math.round(36 + tier.tierIndex * 10 + (isBoss ? 30 : 0)),
    };

    this.grid = this.createEmptyGrid();
  }

  private createEmptyGrid(): MinesweeperCell[][] {
    const out: MinesweeperCell[][] = [];
    for (let r = 0; r < this.rows; r++) {
      const row: MinesweeperCell[] = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({
          r,
          c,
          hasMine: false,
          revealed: false,
          flagged: false,
          defused: false,
          adjacentMines: 0,
        });
      }
      out.push(row);
    }
    return out;
  }

  public get totalCells(): number {
    return this.rows * this.cols;
  }

  public get safeCellCount(): number {
    return this.totalCells - this.totalMines;
  }

  public get revealedSafeCount(): number {
    let cnt = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.revealed && !cell.hasMine) cnt += 1;
      }
    }
    return cnt;
  }

  public get flaggedCount(): number {
    let cnt = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].flagged && !this.grid[r][c].revealed) cnt += 1;
      }
    }
    return cnt;
  }

  public get remainingMinesCount(): number {
    return Math.max(0, this.totalMines - this.flaggedCount);
  }

  public ensureMinesGenerated(safeR: number, safeC: number): void {
    if (this.minesGenerated) return;
    const candidates: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
        candidates.push({ r, c });
      }
    }
    const seed =
      ((this.stage * 0x45d9f3b) ^
        ((safeR * 31 + safeC + 1) * 0x9e3779b9) ^
        Math.imul(this.attemptSeed || 1, 0x85ebca6b)) >>>
      0;
    const rng = mulberry32(seed);
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = candidates[i];
      candidates[i] = candidates[j];
      candidates[j] = tmp;
    }
    const mineTarget = Math.min(this.totalMines, candidates.length);
    for (let i = 0; i < mineTarget; i++) {
      const pt = candidates[i];
      this.grid[pt.r][pt.c].hasMine = true;
    }
    this.recomputeAdjacentCounts();
    this.minesGenerated = true;
  }

  private recomputeAdjacentCounts(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].hasMine) {
          this.grid[r][c].adjacentMines = 0;
          continue;
        }
        let mines = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
              if (this.grid[nr][nc].hasMine) mines += 1;
            }
          }
        }
        this.grid[r][c].adjacentMines = mines;
      }
    }
  }

  private revealSafeFlood(startR: number, startC: number): Array<{ r: number; c: number }> {
    const queue: Array<{ r: number; c: number }> = [{ r: startR, c: startC }];
    const visited = new Set<number>([startR * this.cols + startC]);
    const revealed: Array<{ r: number; c: number }> = [];

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const cell = this.grid[cur.r]?.[cur.c];
      if (!cell || cell.hasMine || cell.revealed) continue;
      cell.revealed = true;
      cell.flagged = false;
      revealed.push({ r: cell.r, c: cell.c });

      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            const idx = nr * this.cols + nc;
            if (visited.has(idx)) continue;
            const nb = this.grid[nr][nc];
            if (!nb.hasMine && !nb.revealed) {
              visited.add(idx);
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }
    return revealed;
  }

  private checkVictoryAndAutoFlag(): boolean {
    if (this.revealedSafeCount < this.safeCellCount) {
      return false;
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.hasMine) {
          cell.flagged = true;
        }
      }
    }
    this.status = 'won';
    this.explodedCell = null;
    this.lastHintCell = null;
    return true;
  }

  public toggleFlag(r: number, c: number): { changed: boolean; flagged: boolean } {
    if (this.status !== 'playing') return { changed: false, flagged: false };
    const cell = this.grid[r]?.[c];
    if (!cell || cell.revealed || cell.defused) return { changed: false, flagged: Boolean(cell?.flagged) };
    cell.flagged = !cell.flagged;
    this.movesCount += 1;
    if (this.lastHintCell && this.lastHintCell.r === r && this.lastHintCell.c === c) {
      this.lastHintCell = null;
    }
    return { changed: true, flagged: cell.flagged };
  }

  public tapCell(r: number, c: number, infiniteShields = false): MinesweeperTapResult {
    const empty: MinesweeperTapResult = {
      action: 'noop',
      revealedCells: [],
      shieldSaved: false,
      won: false,
      lost: false,
    };
    if (this.status !== 'playing') return empty;
    const cell = this.grid[r]?.[c];
    if (!cell) return empty;

    if (this.flagMode && !cell.revealed) {
      const f = this.toggleFlag(r, c);
      if (!f.changed) return empty;
      return { ...empty, action: 'flagged' };
    }

    if (cell.revealed) {
      return this.tryChordReveal(r, c, infiniteShields);
    }

    if (cell.flagged || cell.defused) {
      return { ...empty, action: 'blocked_flag' };
    }

    this.ensureMinesGenerated(r, c);
    this.movesCount += 1;
    if (this.lastHintCell && this.lastHintCell.r === r && this.lastHintCell.c === c) {
      this.lastHintCell = null;
    }

    if (cell.hasMine) {
      if (infiniteShields || this.shieldsLeft > 0) {
        if (!infiniteShields) this.shieldsLeft -= 1;
        cell.defused = true;
        cell.flagged = true;
        return {
          action: 'shield_saved',
          revealedCells: [],
          defusedCell: { r, c },
          shieldSaved: true,
          won: false,
          lost: false,
        };
      }
      cell.revealed = true;
      this.explodedCell = { r, c };
      this.status = 'lost';
      return {
        action: 'exploded',
        revealedCells: [{ r, c }],
        shieldSaved: false,
        won: false,
        lost: true,
      };
    }

    const revealedCells = this.revealSafeFlood(r, c);
    const won = this.checkVictoryAndAutoFlag();
    return {
      action: 'revealed',
      revealedCells,
      shieldSaved: false,
      won,
      lost: false,
    };
  }

  private tryChordReveal(r: number, c: number, infiniteShields = false): MinesweeperTapResult {
    const empty: MinesweeperTapResult = {
      action: 'noop',
      revealedCells: [],
      shieldSaved: false,
      won: false,
      lost: false,
    };
    const center = this.grid[r]?.[c];
    if (!center || !center.revealed || center.adjacentMines <= 0) return empty;

    let flaggedNeighbors = 0;
    const targets: MinesweeperCell[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nb = this.grid[r + dr]?.[c + dc];
        if (!nb) continue;
        if (nb.flagged || nb.defused) flaggedNeighbors += 1;
        else if (!nb.revealed) targets.push(nb);
      }
    }
    if (targets.length === 0 || flaggedNeighbors !== center.adjacentMines) {
      return empty;
    }

    this.movesCount += 1;
    const allRevealed: Array<{ r: number; c: number }> = [];
    let shieldSaved = false;
    let defusedCell: { r: number; c: number } | undefined;

    for (const t of targets) {
      if (t.revealed || t.flagged || t.defused) continue;
      if (t.hasMine) {
        if (infiniteShields || this.shieldsLeft > 0) {
          if (!infiniteShields) this.shieldsLeft -= 1;
          t.defused = true;
          t.flagged = true;
          shieldSaved = true;
          defusedCell = { r: t.r, c: t.c };
          continue;
        }
        t.revealed = true;
        this.explodedCell = { r: t.r, c: t.c };
        this.status = 'lost';
        return {
          action: 'exploded',
          revealedCells: allRevealed.concat([{ r: t.r, c: t.c }]),
          defusedCell,
          shieldSaved,
          won: false,
          lost: true,
        };
      }
      const chunk = this.revealSafeFlood(t.r, t.c);
      for (const p of chunk) allRevealed.push(p);
    }

    const won = this.checkVictoryAndAutoFlag();
    return {
      action: 'chord',
      revealedCells: allRevealed,
      defusedCell,
      shieldSaved,
      won,
      lost: false,
    };
  }

  public useSafeRadarHint(): MinesweeperHintResult {
    if (this.status !== 'playing') {
      return { ok: false, revealedCells: [], won: false };
    }
    if (!this.minesGenerated) {
      this.ensureMinesGenerated(Math.floor(this.rows / 2), Math.floor(this.cols / 2));
    }

    const frontierSafe: MinesweeperCell[] = [];
    const anySafe: MinesweeperCell[] = [];
    const frontierMines: MinesweeperCell[] = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.revealed || cell.defused) continue;
        let nearRevealed = false;
        for (let dr = -1; dr <= 1 && !nearRevealed; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (this.grid[r + dr]?.[c + dc]?.revealed) {
              nearRevealed = true;
              break;
            }
          }
        }
        if (cell.hasMine) {
          if (!cell.flagged && nearRevealed) frontierMines.push(cell);
        } else {
          anySafe.push(cell);
          if (nearRevealed) frontierSafe.push(cell);
        }
      }
    }

    let flaggedMineCell: { r: number; c: number } | undefined;
    if (frontierMines.length > 0) {
      const m = frontierMines[0];
      m.flagged = true;
      flaggedMineCell = { r: m.r, c: m.c };
    }

    const rawPool = frontierSafe.length > 0 ? frontierSafe : anySafe;
    const unflaggedPool = rawPool.filter((cell) => !cell.flagged);
    const pool = unflaggedPool.length > 0 ? unflaggedPool : rawPool;
    if (pool.length === 0) {
      const won = this.checkVictoryAndAutoFlag();
      return { ok: Boolean(flaggedMineCell || won), revealedCells: [], flaggedMineCell, won };
    }

    // Prefer 0-adjacent cells for a satisfying cascade, or lowest adjacent number
    pool.sort((a, b) => a.adjacentMines - b.adjacentMines);
    const chosen = pool[0];
    chosen.flagged = false;
    const revealedCells = this.revealSafeFlood(chosen.r, chosen.c);
    this.lastHintCell = { r: chosen.r, c: chosen.c };
    this.movesCount += 1;
    const won = this.checkVictoryAndAutoFlag();
    return {
      ok: true,
      cell: { r: chosen.r, c: chosen.c },
      revealedCells,
      flaggedMineCell,
      won,
    };
  }

  public applyPhoenixTalisman(): { ok: boolean; msg: string; won: boolean } {
    if (this.talismanUsed) {
      return {
        ok: false,
        msg: 'Bùa Phượng Hoàng chỉ dùng 1 lần/ngày cho Dò Mìn.',
        won: false,
      };
    }
    this.talismanUsed = true;

    if (!this.minesGenerated) {
      this.ensureMinesGenerated(Math.floor(this.rows / 2), Math.floor(this.cols / 2));
    }

    if (this.status === 'lost' && this.explodedCell) {
      const exp = this.grid[this.explodedCell.r]?.[this.explodedCell.c];
      if (exp) {
        exp.revealed = false;
        exp.defused = true;
        exp.flagged = true;
      }
      this.explodedCell = null;
      this.status = 'playing';
    }

    this.shieldsLeft += 1;

    // Flag up to 2 hidden mines and safely uncover up to 2 safe cells
    let flaggedNow = 0;
    for (let r = 0; r < this.rows && flaggedNow < 2; r++) {
      for (let c = 0; c < this.cols && flaggedNow < 2; c++) {
        const cell = this.grid[r][c];
        if (cell.hasMine && !cell.flagged && !cell.defused && !cell.revealed) {
          cell.flagged = true;
          flaggedNow += 1;
        }
      }
    }

    let safeOpened = 0;
    for (let r = 0; r < this.rows && safeOpened < 2; r++) {
      for (let c = 0; c < this.cols && safeOpened < 2; c++) {
        const cell = this.grid[r][c];
        if (!cell.hasMine && !cell.revealed) {
          this.revealSafeFlood(r, c);
          safeOpened += 1;
        }
      }
    }

    const won = this.checkVictoryAndAutoFlag();
    return {
      ok: true,
      msg: won
        ? 'Bùa Phượng Hoàng: gỡ sạch mìn phép và mở thông bãi đá!'
        : 'Bùa Phượng Hoàng: +1 Khiên bảo vệ, khoá 2 mìn & mở an toàn!',
      won,
    };
  }

  public applyApplePieBoost(): { ok: boolean; revived: boolean } {
    let revived = false;
    if (this.status === 'lost' && this.explodedCell) {
      const exp = this.grid[this.explodedCell.r]?.[this.explodedCell.c];
      if (exp) {
        exp.revealed = false;
        exp.defused = true;
        exp.flagged = true;
      }
      this.explodedCell = null;
      this.status = 'playing';
      revived = true;
    }
    this.shieldsLeft += 1;
    this.freeHintsLeft += 1;
    return { ok: true, revived };
  }

  public getTurningPointReview(): TurningPointReview | null {
    if (this.status === 'playing') return null;
    if (this.status === 'lost' && this.explodedCell) {
      const colLabel = String.fromCharCode(65 + (this.explodedCell.c % 26));
      const coord = `${colLabel}${this.explodedCell.r + 1}`;
      return {
        mode: 'caro',
        plyNumber: Math.max(1, this.movesCount),
        outcomeTagVi: 'Vướng bẫy mìn',
        playedCoordVi: `Chạm mìn tại ${coord}`,
        recommendedCoordVi: 'Cắm cờ hoặc dùng Dò An Toàn trước ô nghi ngờ',
        summaryVi: `Bẫy mìn ẩn kích nổ ở ô ${coord} khi còn ${this.safeCellCount - this.revealedSafeCount} ô an toàn.`,
        highlightCells: [{ r: this.explodedCell.r, c: this.explodedCell.c, role: 'played' }],
      };
    }
    return {
      mode: 'caro',
      plyNumber: Math.max(1, this.movesCount),
      outcomeTagVi: 'Thông bãi đá cổ',
      playedCoordVi: `${this.rows}×${this.cols} · ${this.totalMines} mìn`,
      recommendedCoordVi: `Mở đủ ${this.safeCellCount} ô · ${this.movesCount} thao tác`,
      summaryVi: `Mở sạch bãi đá cổ ${this.rows}×${this.cols} với ${this.totalMines} mìn.`,
      highlightCells: [],
    };
  }

  public exportSession(extra?: {
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedMinesweeperSession {
    const mineIndices: number[] = [];
    const revealedIndices: number[] = [];
    const flaggedIndices: number[] = [];
    const defusedIndices: number[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const idx = r * this.cols + c;
        const cell = this.grid[r][c];
        if (cell.hasMine) mineIndices.push(idx);
        if (cell.revealed) revealedIndices.push(idx);
        if (cell.flagged && !cell.revealed) flaggedIndices.push(idx);
        if (cell.defused) defusedIndices.push(idx);
      }
    }
    const explodedIndex = this.explodedCell
      ? this.explodedCell.r * this.cols + this.explodedCell.c
      : null;

    return {
      v: 1,
      stage: this.stage,
      rows: this.rows,
      cols: this.cols,
      totalMines: this.totalMines,
      minesGenerated: this.minesGenerated,
      mineIndices,
      revealedIndices,
      flaggedIndices,
      defusedIndices,
      shieldsLeft: this.shieldsLeft,
      explodedIndex,
      flagMode: this.flagMode,
      movesCount: this.movesCount,
      freeHintsLeft: this.freeHintsLeft,
      paidHintsLeft: this.paidHintsLeft,
      talismanUsed: this.talismanUsed,
      status: this.status,
      companionCharge: extra?.companionCharge ?? 0,
      snackPieUsed: Boolean(extra?.snackPieUsed),
    };
  }

  public restoreSession(raw: unknown): boolean {
    const s = sanitizeSavedMinesweeperSession(raw, this.stage);
    if (!s || s.rows !== this.rows || s.cols !== this.cols || s.totalMines !== this.totalMines) {
      return false;
    }
    if (s.minesGenerated && s.mineIndices.length !== this.totalMines) {
      return false;
    }
    if (!s.minesGenerated && s.mineIndices.length > 0) {
      return false;
    }
    if (s.status === 'playing' && s.minesGenerated) {
      const mineSet = new Set(s.mineIndices);
      for (const revIdx of s.revealedIndices) {
        if (mineSet.has(revIdx)) return false;
      }
    }
    this.grid = this.createEmptyGrid();
    this.minesGenerated = s.minesGenerated;

    for (const idx of s.mineIndices) {
      const r = Math.floor(idx / this.cols);
      const c = idx % this.cols;
      if (this.grid[r]?.[c]) this.grid[r][c].hasMine = true;
    }
    if (this.minesGenerated) {
      this.recomputeAdjacentCounts();
    }
    for (const idx of s.revealedIndices) {
      const r = Math.floor(idx / this.cols);
      const c = idx % this.cols;
      if (this.grid[r]?.[c]) this.grid[r][c].revealed = true;
    }
    for (const idx of s.flaggedIndices) {
      const r = Math.floor(idx / this.cols);
      const c = idx % this.cols;
      if (this.grid[r]?.[c]) this.grid[r][c].flagged = true;
    }
    for (const idx of s.defusedIndices) {
      const r = Math.floor(idx / this.cols);
      const c = idx % this.cols;
      if (this.grid[r]?.[c]) this.grid[r][c].defused = true;
    }

    this.shieldsLeft = s.shieldsLeft;
    this.explodedCell =
      s.explodedIndex !== null
        ? { r: Math.floor(s.explodedIndex / this.cols), c: s.explodedIndex % this.cols }
        : null;
    this.flagMode = s.flagMode;
    this.movesCount = s.movesCount;
    this.freeHintsLeft = s.freeHintsLeft;
    this.paidHintsLeft = s.paidHintsLeft;
    this.talismanUsed = s.talismanUsed;
    this.status = s.status;
    this.lastHintCell = null;
    return true;
  }
}
