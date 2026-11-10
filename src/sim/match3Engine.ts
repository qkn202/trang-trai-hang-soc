import {
  GEM_COLORS,
  GEM_META,
  GemColor,
  getWinStreakGifts,
  MATCH3_BOARD_SIZE,
  Match3GoalDef,
  Match3LevelDef,
  SpecialKind,
} from '../data/match3Levels';
import { Match3BoosterId } from '../types/game';

export interface Match3Piece {
  id: number;
  kind: 'gem' | 'scroll';
  color: GemColor;
  special: SpecialKind;
  bombPrimed?: boolean;
  secondBlastRadius?: number;
  // Visual interpolation coordinates (in grid units 0..7) for 60fps Canvas rendering
  visR: number;
  visC: number;
  scale: number;
  vy?: number;
  squash?: number;
}

export interface Match3Cell {
  r: number;
  c: number;
  hole: boolean;
  ice: number; // 0..2
  box: number; // 0..3
  web: boolean;
  honey: boolean;
  piece: Match3Piece | null;
}

export interface Match3GoalProgress extends Match3GoalDef {
  current: number;
}

export type Match3VfxEvent =
  | {
      kind: 'pop';
      r: number;
      c: number;
      color: string;
      subkind?: 'gem' | 'ice' | 'box' | 'web' | 'scroll' | 'honey';
      gemColor?: GemColor;
      goalKind?: Match3GoalDef['kind'];
    }
  | { kind: 'beam_row'; r: number }
  | { kind: 'beam_col'; c: number }
  | { kind: 'shockwave'; r: number; c: number; radius: number }
  | { kind: 'lightning'; fromR: number; fromC: number; toR: number; toC: number }
  | { kind: 'text'; r: number; c: number; text: string; color: string };

export type Match3SessionStatus = 'playing' | 'won' | 'out_of_moves';

const PRAISE_WORDS = [
  '',
  '',
  '✨ Tuyệt Diệu!',
  '🔥 Xuất Thần!',
  '⚡ Siêu Phàm!',
  '🌟 Phép Màu Hogwarts!',
];

export class Match3BoardEngine {
  public readonly levelDef: Match3LevelDef;
  public grid: Match3Cell[][];
  public movesLeft: number;
  public score = 0;
  public goals: Match3GoalProgress[];
  public status: Match3SessionStatus = 'playing';
  public lastComboChain = 0;
  public bonusCoinsFromLeftoverMoves = 0;
  public leftoverMovesConverted = 0;
  public talismanUsed = false;
  public vfxQueue: Match3VfxEvent[] = [];

  private nextPieceId = 1;
  private scrollsSpawned = 0;
  private scrollsOnBoard = 0;
  private honeyClearedThisTurn = 0;
  private sugarCrushTriggered = false;

  constructor(levelDef: Match3LevelDef, winStreak = 0) {
    this.levelDef = levelDef;
    this.movesLeft = levelDef.moves;
    this.goals = levelDef.goals.map((g) => ({ ...g, current: 0 }));

    this.grid = Array.from({ length: MATCH3_BOARD_SIZE }, (_, r) =>
      Array.from({ length: MATCH3_BOARD_SIZE }, (__, c) => {
        const bp = levelDef.cells[r]?.[c] ?? {};
        return {
          r,
          c,
          hole: Boolean(bp.hole),
          ice: bp.ice ?? 0,
          box: bp.box ?? 0,
          web: Boolean(bp.web),
          honey: Boolean(bp.honey),
          piece: null,
        };
      })
    );

    this.populateInitialBoard(winStreak);
    this.syncHoneyGoalProgress();
  }

  private randomColor(): GemColor {
    const arr = this.levelDef.activeColors;
    return arr[Math.floor(Math.random() * arr.length)] ?? GEM_COLORS[0];
  }

  private makePiece(
    r: number,
    c: number,
    kind: 'gem' | 'scroll' = 'gem',
    color: GemColor = this.randomColor(),
    special: SpecialKind = 'none',
    spawnR = r
  ): Match3Piece {
    return {
      id: this.nextPieceId++,
      kind,
      color,
      special,
      visR: spawnR,
      visC: c,
      scale: 1,
    };
  }

  private pushVfx(ev: Match3VfxEvent): void {
    if (this.vfxQueue.length > 80) this.vfxQueue.shift();
    this.vfxQueue.push(ev);
  }

  private populateInitialBoard(winStreak: number): void {
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const cell = this.grid[r][c];
        if (cell.hole || cell.box > 0) continue;

        // Avoid pre-existing 3-in-a-row on initial board
        const forbidden = new Set<GemColor>();
        if (
          c >= 2 &&
          this.grid[r][c - 1].piece?.kind === 'gem' &&
          this.grid[r][c - 2].piece?.kind === 'gem' &&
          this.grid[r][c - 1].piece!.color === this.grid[r][c - 2].piece!.color
        ) {
          forbidden.add(this.grid[r][c - 1].piece!.color);
        }
        if (
          r >= 2 &&
          this.grid[r - 1][c].piece?.kind === 'gem' &&
          this.grid[r - 2][c].piece?.kind === 'gem' &&
          this.grid[r - 1][c].piece!.color === this.grid[r - 2][c].piece!.color
        ) {
          forbidden.add(this.grid[r - 1][c].piece!.color);
        }

        const choices = this.levelDef.activeColors.filter((col) => !forbidden.has(col));
        const chosen =
          choices.length > 0
            ? choices[Math.floor(Math.random() * choices.length)]
            : this.randomColor();
        cell.piece = this.makePiece(r, c, 'gem', chosen, 'none', r - 2);
      }
    }

    // Place initial falling scrolls near top rows if level requires scrolls (preferring open lanes!)
    if (this.levelDef.scrollsTotal > 0) {
      const initialToPlace = Math.min(2, this.levelDef.scrollsTotal);
      const openLaneCandidates: Array<[number, number]> = [];
      const fallbackCandidates: Array<[number, number]> = [];
      for (let r = 0; r <= 1; r++) {
        for (let c = 1; c <= 6; c++) {
          const cell = this.grid[r][c];
          if (!cell.hole && cell.box === 0 && !cell.web && cell.piece?.kind === 'gem') {
            const hasBoxBelow = this.grid.some((row, rr) => rr > r && row[c].box > 0);
            if (!hasBoxBelow) openLaneCandidates.push([r, c]);
            else fallbackCandidates.push([r, c]);
          }
        }
      }
      const pool =
        openLaneCandidates.length >= initialToPlace
          ? openLaneCandidates
          : [...openLaneCandidates, ...fallbackCandidates];
      for (let i = 0; i < initialToPlace && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const [sr, sc] = pool.splice(idx, 1)[0];
        this.grid[sr][sc].piece = this.makePiece(sr, sc, 'scroll', 'topaz', 'none', sr - 2);
        this.scrollsSpawned++;
        this.scrollsOnBoard++;
      }
    }

    // Apply Butler's Win Streak starter gifts!
    const gifts = getWinStreakGifts(winStreak);
    if (gifts.length > 0) {
      const movableCells: Match3Cell[] = [];
      for (let r = 1; r < MATCH3_BOARD_SIZE - 1; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          const cell = this.grid[r][c];
          if (
            !cell.hole &&
            cell.box === 0 &&
            !cell.web &&
            cell.piece?.kind === 'gem' &&
            cell.piece.special === 'none'
          ) {
            movableCells.push(cell);
          }
        }
      }
      for (const sp of gifts) {
        if (movableCells.length === 0) break;
        const idx = Math.floor(Math.random() * movableCells.length);
        const targetCell = movableCells.splice(idx, 1)[0];
        if (targetCell.piece) {
          targetCell.piece.special = sp;
          targetCell.piece.scale = 1.25;
        }
      }
    }

    this.ensurePlayableMoveExists();
  }

  public canInteractCell(r: number, c: number): boolean {
    const cell = this.grid[r]?.[c];
    if (!cell || cell.hole || cell.box > 0 || cell.web || !cell.piece) return false;
    return true;
  }

  private hasUnfinishedGoal(kind: Match3GoalDef['kind'], color?: GemColor): boolean {
    return this.goals.some(
      (g) => g.kind === kind && g.current < g.target && (kind !== 'gem' || g.color === color)
    );
  }

  private addGoalProgress(kind: Match3GoalDef['kind'], amount = 1, color?: GemColor): void {
    for (const g of this.goals) {
      if (g.kind !== kind) continue;
      if (kind === 'gem' && g.color !== color) continue;
      g.current = Math.min(g.target, g.current + amount);
    }
  }

  public countHoneyOnBoard(): number {
    let cnt = 0;
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        if (this.grid[r][c].honey) cnt++;
      }
    }
    return cnt;
  }

  private syncHoneyGoalProgress(): void {
    const rem = this.countHoneyOnBoard();
    for (const g of this.goals) {
      if (g.kind !== 'honey') continue;
      if (rem === 0) {
        g.current = g.target;
      } else {
        g.current = Math.max(0, Math.min(g.target - 1, g.target - rem));
      }
    }
  }

  private maybeSpreadHoneyAfterTurn(): void {
    this.syncHoneyGoalProgress();
    if (this.areAllGoalsComplete() || this.honeyClearedThisTurn > 0) {
      return;
    }
    const currentHoney = this.countHoneyOnBoard();
    if (currentHoney <= 0 || currentHoney >= 18) return;

    const plainNeighbors: Match3Cell[] = [];
    const specialNeighbors: Match3Cell[] = [];
    const seen = new Set<string>();
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        if (!this.grid[r][c].honey) continue;
        for (const [dr, dc] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nr = r + dr;
          const nc = c + dc;
          const nb = this.grid[nr]?.[nc];
          if (!nb || nb.hole || nb.box > 0 || nb.web || nb.honey || nb.piece?.kind !== 'gem') {
            continue;
          }
          const k = `${nr},${nc}`;
          if (seen.has(k)) continue;
          seen.add(k);
          if (nb.piece.special === 'none') plainNeighbors.push(nb);
          else specialNeighbors.push(nb);
        }
      }
    }

    const pool = plainNeighbors.length > 0 ? plainNeighbors : specialNeighbors;
    if (pool.length === 0) return;

    const target = pool[Math.floor(Math.random() * pool.length)];
    target.honey = true;
    this.pushVfx({
      kind: 'pop',
      r: target.r,
      c: target.c,
      color: '#f59e0b',
      subkind: 'honey',
    });
    this.pushVfx({
      kind: 'text',
      r: target.r,
      c: target.c,
      text: '🍯 Sáp mật lan!',
      color: '#fbbf24',
    });
    this.syncHoneyGoalProgress();
  }

  public areAllGoalsComplete(): boolean {
    return this.goals.every((g) => g.current >= g.target);
  }

  // ==================== CLASSIC CANDY CRUSH: NO TAP-IN-PLACE DETONATION ====================

  public tryTapCellSpecial(_r: number, _c: number): { acted: boolean; comboCount: number } {
    // Classic Candy Crush rule: Special Candies only detonate when matched 3+ by color,
    // swapped with another Special Candy, or zapped by a Color Bomb / chain explosion.
    return { acted: false, comboCount: 0 };
  }

  // ==================== SWAP TWO ADJACENT CELLS ====================

  public trySwap(
    r1: number,
    c1: number,
    r2: number,
    c2: number
  ): { valid: boolean; comboCount: number; createdSpecial?: SpecialKind } {
    if (this.status !== 'playing' || this.movesLeft <= 0) {
      return { valid: false, comboCount: 0 };
    }
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) {
      return { valid: false, comboCount: 0 };
    }
    if (!this.canInteractCell(r1, c1) || !this.canInteractCell(r2, c2)) {
      return { valid: false, comboCount: 0 };
    }

    const cellA = this.grid[r1][c1];
    const cellB = this.grid[r2][c2];
    const pA = cellA.piece!;
    const pB = cellB.piece!;

    // Perform swap
    cellA.piece = pB;
    cellB.piece = pA;

    // 1. Double Special Combo!
    if (
      pA.kind === 'gem' &&
      pB.kind === 'gem' &&
      pA.special !== 'none' &&
      pB.special !== 'none'
    ) {
      this.honeyClearedThisTurn = 0;
      this.movesLeft -= 1;
      this.executeDoubleSpecialCombo(r1, c1, pB, r2, c2, pA);
      const comboCount = 1 + this.runGravityAndCascadeLoop();
      this.maybeSpreadHoneyAfterTurn();
      this.finalizeTurnState(comboCount);
      return { valid: true, comboCount };
    }

    // 2. Single Snitch + Colored Gem!
    if (
      (pA.special === 'snitch' && pB.kind === 'gem') ||
      (pB.special === 'snitch' && pA.kind === 'gem')
    ) {
      this.honeyClearedThisTurn = 0;
      this.movesLeft -= 1;
      const snitchAtB = pA.special === 'snitch'; // pA moved into cellB (r2,c2)
      const sr = snitchAtB ? r2 : r1;
      const sc = snitchAtB ? c2 : c1;
      const targetColor = snitchAtB ? pB.color : pA.color;
      this.grid[sr][sc].piece = null;
      this.damageUnderlayIce(sr, sc);
      this.triggerSnitchColorZap(sr, sc, targetColor);
      const comboCount = 1 + this.runGravityAndCascadeLoop();
      this.maybeSpreadHoneyAfterTurn();
      this.finalizeTurnState(comboCount);
      return { valid: true, comboCount };
    }

    // 3. Standard Match Check (Candy Crush: pass swap direction so Match-4 spawns striped candy along swap axis)
    const swapDir: 'h' | 'v' = r1 === r2 ? 'h' : 'v';
    const matchInfo = this.detectMatches(
      [
        [r2, c2],
        [r1, c1],
      ],
      swapDir
    );

    if (matchInfo.matchedKeys.size === 0) {
      // Revert invalid swap — costs 0 moves!
      cellA.piece = pA;
      cellB.piece = pB;
      return { valid: false, comboCount: 0 };
    }

    this.honeyClearedThisTurn = 0;
    this.movesLeft -= 1;
    const createdSpecial = matchInfo.spawns[0]?.special;
    this.applyMatchWave(matchInfo, 1);
    const comboCount = 1 + this.runGravityAndCascadeLoop();
    this.maybeSpreadHoneyAfterTurn();
    this.finalizeTurnState(comboCount);
    return { valid: true, comboCount, createdSpecial };
  }

  // ==================== 3 CLASSIC BOOSTERS (FREE OF MOVE COST!) ====================

  public canUseBooster(
    boosterId: Match3BoosterId,
    targetR?: number,
    targetC?: number
  ): { ok: boolean; msg: string } {
    if (this.status !== 'playing') {
      return { ok: false, msg: 'Ván đấu đã kết thúc.' };
    }
    if (boosterId === 'alohomora_shuffle') {
      return { ok: true, msg: '' };
    }
    if (
      targetR === undefined ||
      targetC === undefined ||
      targetR < 0 ||
      targetR >= MATCH3_BOARD_SIZE ||
      targetC < 0 ||
      targetC >= MATCH3_BOARD_SIZE
    ) {
      return { ok: false, msg: 'Hãy chạm vào một ô trên bàn cờ để niệm bùa!' };
    }

    const cell = this.grid[targetR][targetC];
    if (cell.hole) {
      return { ok: false, msg: 'Ô trống không thể dùng bùa — hãy chọn ô có ngọc hoặc chướng ngại vật!' };
    }

    if (boosterId === 'reparo_hammer') {
      if (cell.box === 0 && !cell.web && cell.ice === 0 && !cell.honey && !cell.piece) {
        return { ok: false, msg: 'Ô này đang trống!' };
      }
      if (
        cell.box === 0 &&
        !cell.web &&
        cell.ice === 0 &&
        !cell.honey &&
        cell.piece?.kind === 'scroll'
      ) {
        return {
          ok: false,
          msg: '📜 Cuộn Cổ Ngữ không thể đập vỡ — hãy phá các ô bên dưới để cuộn rơi xuống đáy bàn cờ!',
        };
      }
      return { ok: true, msg: '' };
    }

    if (boosterId === 'row_col_cannon') {
      let hasBreakable = false;
      for (let i = 0; i < MATCH3_BOARD_SIZE; i++) {
        const rc = this.grid[targetR][i];
        const cc = this.grid[i][targetC];
        if (
          (!rc.hole && (rc.box > 0 || rc.web || rc.ice > 0 || rc.honey || rc.piece?.kind === 'gem')) ||
          (!cc.hole && (cc.box > 0 || cc.web || cc.ice > 0 || cc.honey || cc.piece?.kind === 'gem'))
        ) {
          hasBreakable = true;
          break;
        }
      }
      if (!hasBreakable) {
        return { ok: false, msg: 'Hàng và cột này không có mục tiêu nào để quét!' };
      }
      return { ok: true, msg: '' };
    }

    return { ok: false, msg: 'Bùa không hợp lệ.' };
  }

  public useBooster(
    boosterId: Match3BoosterId,
    targetR?: number,
    targetC?: number
  ): { ok: boolean; msg: string } {
    const check = this.canUseBooster(boosterId, targetR, targetC);
    if (!check.ok) return check;

    if (boosterId === 'alohomora_shuffle') {
      this.shuffleMovableGems(true);
      this.pushVfx({
        kind: 'text',
        r: 3.5,
        c: 3.5,
        text: '🌪️ Alohomora Xáo Bàn!',
        color: '#fde047',
      });
      const extra = this.runGravityAndCascadeLoop();
      this.finalizeTurnState(extra);
      return { ok: true, msg: '🌪️ Đã xáo mới bàn cờ & triệu hồi thêm 1 Pháo Hoa!' };
    }

    const r = targetR!;
    const c = targetC!;

    if (boosterId === 'reparo_hammer') {
      this.pushVfx({ kind: 'shockwave', r, c, radius: 1.1 });
      this.hitSingleCellDirect(r, c, new Set());
      const extra = this.runGravityAndCascadeLoop();
      this.finalizeTurnState(1 + extra);
      return { ok: true, msg: '🔨 Búa Phép Reparo đã đập vỡ mục tiêu!' };
    }

    if (boosterId === 'row_col_cannon') {
      this.pushVfx({ kind: 'beam_row', r });
      this.pushVfx({ kind: 'beam_col', c });
      const targets = new Set<string>();
      for (let col = 0; col < MATCH3_BOARD_SIZE; col++) targets.add(`${r},${col}`);
      for (let row = 0; row < MATCH3_BOARD_SIZE; row++) targets.add(`${row},${c}`);
      this.resolveExplosionSet(targets, new Set());
      const extra = this.runGravityAndCascadeLoop();
      this.finalizeTurnState(1 + extra);
      return { ok: true, msg: '⚡ Tia Chớp Đại Bác quét sạch hàng & cột!' };
    }

    return { ok: false, msg: 'Bùa không hợp lệ.' };
  }

  public addExtraMoves(count: number): void {
    this.movesLeft += count;
    if (this.status === 'out_of_moves') {
      this.status = 'playing';
    }
  }

  public applyPhoenixTalisman(): { ok: boolean; msg: string } {
    if (this.talismanUsed || this.status === 'won') {
      return {
        ok: false,
        msg: 'Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!',
      };
    }

    this.talismanUsed = true;
    this.addExtraMoves(5);

    // 1. Purify up to 2 obstacles on board (honey > web > ice > box)
    let purified = 0;
    for (let r = 0; r < MATCH3_BOARD_SIZE && purified < 2; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE && purified < 2; c++) {
        const cell = this.grid[r][c];
        if (cell.hole) continue;
        if (cell.honey || cell.ice > 0) {
          this.damageUnderlayIce(r, c);
          purified++;
        } else if (cell.web) {
          cell.web = false;
          this.addGoalProgress('web', 1);
          this.pushVfx({ kind: 'pop', r, c, color: '#fde047', subkind: 'web', goalKind: 'web' });
          purified++;
        } else if (cell.box > 0) {
          cell.box -= 1;
          this.addGoalProgress('box', 1);
          this.pushVfx({ kind: 'pop', r, c, color: '#f59e0b', subkind: 'box', goalKind: 'box' });
          purified++;
        }
      }
    }

    // 2. Imbue 1 Snitch + 1 Bomb onto movable plain gems!
    const plainCells: Match3Cell[] = [];
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const cell = this.grid[r][c];
        if (!cell.hole && cell.box === 0 && !cell.web && cell.piece?.kind === 'gem' && cell.piece.special === 'none') {
          plainCells.push(cell);
        }
      }
    }
    const specials: SpecialKind[] = ['snitch', 'bomb'];
    for (const sp of specials) {
      if (plainCells.length === 0) break;
      const idx = Math.floor(Math.random() * plainCells.length);
      const chosen = plainCells.splice(idx, 1)[0];
      if (chosen.piece) {
        chosen.piece.special = sp;
        chosen.piece.scale = 1.35;
        this.pushVfx({ kind: 'shockwave', r: chosen.r, c: chosen.c, radius: 1.3 });
      }
    }

    this.pushVfx({
      kind: 'text',
      r: 3.3,
      c: 3.5,
      text: '🔥 PHƯỢNG HOÀNG TRỢ CHIẾN!',
      color: '#fde047',
    });

    const extra = this.runGravityAndCascadeLoop();
    this.syncHoneyGoalProgress();
    this.finalizeTurnState(extra);

    return {
      ok: true,
      msg: '🔥 Bùa Phượng Hoàng: +5 Lượt, triệu hồi Chong Chóng + Hũ Mứt Nổ & thanh tẩy chướng ngại!',
    };
  }

  // ==================== DOUBLE SPECIAL COMBOS ====================

  private executeDoubleSpecialCombo(
    r1: number,
    c1: number,
    pAt1: Match3Piece,
    r2: number,
    c2: number,
    pAt2: Match3Piece
  ): void {
    const s1 = pAt1.special;
    const s2 = pAt2.special;
    // Consume the two swapped specials first so they don't re-trigger infinitely
    this.grid[r1][c1].piece = null;
    this.grid[r2][c2].piece = null;
    this.damageUnderlayIce(r1, c1);
    this.damageUnderlayIce(r2, c2);

    // 1. Snitch + Snitch => Clear entire 8x8 board!
    if (s1 === 'snitch' && s2 === 'snitch') {
      this.pushVfx({ kind: 'shockwave', r: 3.5, c: 3.5, radius: 6 });
      this.pushVfx({
        kind: 'text',
        r: 3.5,
        c: 3.5,
        text: '🌟 ĐẠI HỒNG THỦY ÁNH SAO!',
        color: '#fde047',
      });
      const all = new Set<string>();
      for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          if (!this.grid[r][c].hole) all.add(`${r},${c}`);
        }
      }
      this.resolveExplosionSet(all, new Set());
      this.score += 1200;
      return;
    }

    // 2. Snitch + Rocket/Bomb => Transform all gems of the partner special's color into Rockets/Bombs and detonate!
    if (s1 === 'snitch' || s2 === 'snitch') {
      const otherPiece = s1 === 'snitch' ? pAt2 : pAt1;
      const other = otherPiece.special;
      const hasPartnerColorOnBoard = this.grid.some((row) =>
        row.some(
          (c) =>
            c.piece?.kind === 'gem' &&
            c.piece.special !== 'snitch' &&
            c.piece.color === otherPiece.color
        )
      );
      const targetColor = hasPartnerColorOnBoard ? otherPiece.color : this.pickBestColorForSnitch();
      const transformed = new Set<string>();
      if (!this.grid[r2][c2].hole && this.grid[r2][c2].box === 0) {
        const originSpecial: SpecialKind =
          other === 'bomb' ? 'bomb' : other === 'rocket_v' ? 'rocket_v' : 'rocket_h';
        this.grid[r2][c2].piece = this.makePiece(r2, c2, 'gem', targetColor, originSpecial, r2);
        transformed.add(`${r2},${c2}`);
      }
      for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          const cell = this.grid[r][c];
          if (
            cell.piece?.kind === 'gem' &&
            cell.piece.special !== 'snitch' &&
            cell.piece.color === targetColor
          ) {
            this.pushVfx({ kind: 'lightning', fromR: r2, fromC: c2, toR: r, toC: c });
            cell.piece.special =
              other === 'bomb' ? 'bomb' : (r + c) % 2 === 0 ? 'rocket_h' : 'rocket_v';
            transformed.add(`${r},${c}`);
          }
        }
      }
      this.resolveExplosionSet(transformed, new Set());
      this.score += 850;
      return;
    }

    // 3. Bomb + Bomb => Double Mega 5x5 blast (1st 5x5 now, then gravity drop, then 2nd 5x5)!
    if (s1 === 'bomb' && s2 === 'bomb') {
      this.pushVfx({ kind: 'shockwave', r: r2, c: c2, radius: 3.2 });
      const area = new Set<string>();
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = r2 + dr;
          const nc = c2 + dc;
          if (nr >= 0 && nr < MATCH3_BOARD_SIZE && nc >= 0 && nc < MATCH3_BOARD_SIZE) {
            area.add(`${nr},${nc}`);
          }
        }
      }
      this.resolveExplosionSet(area, new Set());
      if (!this.grid[r2][c2].hole && this.grid[r2][c2].box === 0) {
        const primed = this.makePiece(r2, c2, 'gem', pAt1.color, 'bomb', r2);
        primed.bombPrimed = true;
        primed.secondBlastRadius = 2;
        primed.scale = 1.45;
        this.grid[r2][c2].piece = primed;
      }
      this.score += 550;
      return;
    }

    // 4. Rocket + Bomb => Giant 3-Row + 3-Col Cross Blast!
    if (s1 === 'bomb' || s2 === 'bomb') {
      const cross = new Set<string>();
      for (let d = -1; d <= 1; d++) {
        const rr = r2 + d;
        const cc = c2 + d;
        if (rr >= 0 && rr < MATCH3_BOARD_SIZE) {
          this.pushVfx({ kind: 'beam_row', r: rr });
          for (let c = 0; c < MATCH3_BOARD_SIZE; c++) cross.add(`${rr},${c}`);
        }
        if (cc >= 0 && cc < MATCH3_BOARD_SIZE) {
          this.pushVfx({ kind: 'beam_col', c: cc });
          for (let r = 0; r < MATCH3_BOARD_SIZE; r++) cross.add(`${r},${cc}`);
        }
      }
      this.resolveExplosionSet(cross, new Set());
      this.score += 600;
      return;
    }

    // 5. Rocket + Rocket => Full Row + Full Col Cross Blast!
    this.pushVfx({ kind: 'beam_row', r: r2 });
    this.pushVfx({ kind: 'beam_col', c: c2 });
    const cross = new Set<string>();
    for (let c = 0; c < MATCH3_BOARD_SIZE; c++) cross.add(`${r2},${c}`);
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) cross.add(`${r},${c2}`);
    this.resolveExplosionSet(cross, new Set());
    this.score += 360;
  }

  private pickBestColorForSnitch(): GemColor {
    // Prefer an unfinished gem goal color present on board, else most abundant color
    for (const g of this.goals) {
      if (g.kind === 'gem' && g.color && g.current < g.target) {
        const hasAny = this.grid.some((row) =>
          row.some((c) => c.piece?.kind === 'gem' && c.piece.color === g.color)
        );
        if (hasAny) return g.color;
      }
    }
    const counts = new Map<GemColor, number>();
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const p = this.grid[r][c].piece;
        if (p?.kind === 'gem' && p.special !== 'snitch') {
          counts.set(p.color, (counts.get(p.color) ?? 0) + 1);
        }
      }
    }
    let best: GemColor = this.levelDef.activeColors[0] ?? 'ruby';
    let bestCnt = -1;
    for (const [col, cnt] of counts.entries()) {
      if (cnt > bestCnt) {
        bestCnt = cnt;
        best = col;
      }
    }
    return best;
  }

  private triggerSnitchColorZap(fromR: number, fromC: number, targetColor: GemColor): void {
    const targets = new Set<string>();
    const adjacentBoxes = new Set<string>();
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const p = this.grid[r][c].piece;
        if (p?.kind === 'gem' && p.color === targetColor) {
          this.pushVfx({ kind: 'lightning', fromR, fromC, toR: r, toC: c });
          targets.add(`${r},${c}`);
          for (const [dr, dc] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const nb = this.grid[r + dr]?.[c + dc];
            if (nb && nb.box > 0) adjacentBoxes.add(`${r + dr},${c + dc}`);
          }
        }
      }
    }
    this.resolveExplosionSet(targets, adjacentBoxes);
    this.score += targets.size * 35;
  }

  // ==================== MATCH DETECTION & POWER-UP SPAWNING ====================

  private detectMatches(
    preferredAnchors: Array<[number, number]> = [],
    swapDir?: 'h' | 'v'
  ): {
    matchedKeys: Set<string>;
    spawns: Array<{ r: number; c: number; color: GemColor; special: SpecialKind }>;
  } {
    interface Run {
      dir: 'h' | 'v';
      color: GemColor;
      cells: Array<[number, number]>;
    }
    const runs: Run[] = [];

    // Horizontal runs
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      let c = 0;
      while (c < MATCH3_BOARD_SIZE) {
        const p = this.grid[r][c].piece;
        if (
          !p ||
          p.kind !== 'gem' ||
          p.special === 'snitch' ||
          p.bombPrimed ||
          this.grid[r][c].box > 0
        ) {
          c++;
          continue;
        }
        let end = c + 1;
        while (
          end < MATCH3_BOARD_SIZE &&
          this.grid[r][end].box === 0 &&
          this.grid[r][end].piece?.kind === 'gem' &&
          this.grid[r][end].piece!.special !== 'snitch' &&
          !this.grid[r][end].piece!.bombPrimed &&
          this.grid[r][end].piece!.color === p.color
        ) {
          end++;
        }
        if (end - c >= 3) {
          const cells: Array<[number, number]> = [];
          for (let k = c; k < end; k++) cells.push([r, k]);
          runs.push({ dir: 'h', color: p.color, cells });
        }
        c = end;
      }
    }

    // Vertical runs
    for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
      let r = 0;
      while (r < MATCH3_BOARD_SIZE) {
        const p = this.grid[r][c].piece;
        if (
          !p ||
          p.kind !== 'gem' ||
          p.special === 'snitch' ||
          p.bombPrimed ||
          this.grid[r][c].box > 0
        ) {
          r++;
          continue;
        }
        let end = r + 1;
        while (
          end < MATCH3_BOARD_SIZE &&
          this.grid[end][c].box === 0 &&
          this.grid[end][c].piece?.kind === 'gem' &&
          this.grid[end][c].piece!.special !== 'snitch' &&
          !this.grid[end][c].piece!.bombPrimed &&
          this.grid[end][c].piece!.color === p.color
        ) {
          end++;
        }
        if (end - r >= 3) {
          const cells: Array<[number, number]> = [];
          for (let k = r; k < end; k++) cells.push([k, c]);
          runs.push({ dir: 'v', color: p.color, cells });
        }
        r = end;
      }
    }

    const matchedKeys = new Set<string>();
    const spawns: Array<{ r: number; c: number; color: GemColor; special: SpecialKind }> = [];
    if (runs.length === 0) return { matchedKeys, spawns };

    // Group intersecting runs of the same color into connected components
    const usedRun = new Array(runs.length).fill(false);
    for (let i = 0; i < runs.length; i++) {
      if (usedRun[i]) continue;
      usedRun[i] = true;
      const compRuns: Run[] = [runs[i]];
      const compCells = new Map<string, [number, number]>();
      for (const pt of runs[i].cells) compCells.set(`${pt[0]},${pt[1]}`, pt);

      let changed = true;
      while (changed) {
        changed = false;
        for (let j = 0; j < runs.length; j++) {
          if (usedRun[j] || runs[j].color !== runs[i].color) continue;
          if (runs[j].cells.some((pt) => compCells.has(`${pt[0]},${pt[1]}`))) {
            usedRun[j] = true;
            compRuns.push(runs[j]);
            for (const pt of runs[j].cells) compCells.set(`${pt[0]},${pt[1]}`, pt);
            changed = true;
          }
        }
      }

      for (const k of compCells.keys()) matchedKeys.add(k);

      const maxSingleRun = Math.max(...compRuns.map((rn) => rn.cells.length));
      const hasH = compRuns.some((rn) => rn.dir === 'h');
      const hasV = compRuns.some((rn) => rn.dir === 'v');

      let specialToSpawn: SpecialKind = 'none';
      if (maxSingleRun >= 5) {
        specialToSpawn = 'snitch';
      } else if (hasH && hasV && compCells.size >= 5) {
        specialToSpawn = 'bomb';
      } else if (maxSingleRun === 4) {
        const run4 = compRuns.find((rn) => rn.cells.length === 4)!;
        if (swapDir) {
          specialToSpawn = swapDir === 'h' ? 'rocket_h' : 'rocket_v';
        } else {
          specialToSpawn = run4.dir === 'h' ? 'rocket_v' : 'rocket_h';
        }
      }

      if (specialToSpawn !== 'none') {
        let anchor: [number, number] | undefined = preferredAnchors.find(([ar, ac]) => {
          const k = `${ar},${ac}`;
          return compCells.has(k) && !this.grid[ar][ac].web;
        });
        if (!anchor) {
          for (const pt of compCells.values()) {
            if (!this.grid[pt[0]][pt[1]].web) {
              anchor = pt;
              break;
            }
          }
        }
        if (anchor) {
          spawns.push({
            r: anchor[0],
            c: anchor[1],
            color: runs[i].color,
            special: specialToSpawn,
          });
        }
      }
    }

    return { matchedKeys, spawns };
  }

  private applyMatchWave(
    matchInfo: {
      matchedKeys: Set<string>;
      spawns: Array<{ r: number; c: number; color: GemColor; special: SpecialKind }>;
    },
    comboIndex: number
  ): void {
    // Collect orthogonally adjacent boxes next to matched cells
    const adjacentBoxKeys = new Set<string>();
    for (const key of matchInfo.matchedKeys) {
      const [r, c] = key.split(',').map(Number);
      for (const [dr, dc] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nb = this.grid[r + dr]?.[c + dc];
        if (nb && nb.box > 0) {
          adjacentBoxKeys.add(`${r + dr},${c + dc}`);
        }
      }
    }

    const spawnMap = new Map<string, { color: GemColor; special: SpecialKind }>();
    for (const sp of matchInfo.spawns) {
      spawnMap.set(`${sp.r},${sp.c}`, { color: sp.color, special: sp.special });
    }

    this.resolveExplosionSet(matchInfo.matchedKeys, adjacentBoxKeys, spawnMap);
    this.score += matchInfo.matchedKeys.size * 20 * comboIndex;

    if (comboIndex >= 2) {
      const word = PRAISE_WORDS[Math.min(PRAISE_WORDS.length - 1, comboIndex)];
      if (word) {
        this.pushVfx({ kind: 'text', r: 3.2, c: 3.5, text: word, color: '#fde047' });
      }
    }
  }

  private damageUnderlayIce(r: number, c: number): void {
    const cell = this.grid[r]?.[c];
    if (!cell) return;
    if (cell.ice > 0) {
      const countsGoal = this.hasUnfinishedGoal('ice');
      cell.ice -= 1;
      this.addGoalProgress('ice', 1);
      this.pushVfx({
        kind: 'pop',
        r,
        c,
        color: '#38bdf8',
        subkind: 'ice',
        goalKind: countsGoal ? 'ice' : undefined,
      });
      this.score += 30;
    }
    if (cell.honey) {
      const countsHoney = this.hasUnfinishedGoal('honey');
      cell.honey = false;
      this.honeyClearedThisTurn += 1;
      this.syncHoneyGoalProgress();
      this.pushVfx({
        kind: 'pop',
        r,
        c,
        color: '#f59e0b',
        subkind: 'honey',
        goalKind: countsHoney ? 'honey' : undefined,
      });
      this.score += 35;
    }
  }

  private resolveExplosionSet(
    initialKeys: Set<string>,
    adjacentBoxKeys: Set<string>,
    spawnAfter?: Map<string, { color: GemColor; special: SpecialKind }>
  ): void {
    const queue = Array.from(initialKeys);
    const processed = new Set<string>();
    const damagedBoxes = new Set<string>();

    // Damage adjacent boxes from color match
    for (const bk of adjacentBoxKeys) {
      if (damagedBoxes.has(bk)) continue;
      damagedBoxes.add(bk);
      const [br, bc] = bk.split(',').map(Number);
      const bCell = this.grid[br]?.[bc];
      if (bCell && bCell.box > 0) {
        const countsGoal = this.hasUnfinishedGoal('box');
        bCell.box -= 1;
        this.addGoalProgress('box', 1);
        this.pushVfx({
          kind: 'pop',
          r: br,
          c: bc,
          color: '#d97706',
          subkind: 'box',
          goalKind: countsGoal ? 'box' : undefined,
        });
        this.score += 35;
      }
    }

    while (queue.length > 0) {
      const key = queue.shift()!;
      if (processed.has(key)) continue;
      processed.add(key);

      const [r, c] = key.split(',').map(Number);
      this.hitSingleCellDirect(r, c, damagedBoxes, queue, spawnAfter?.get(key));
    }
  }

  private hitSingleCellDirect(
    r: number,
    c: number,
    damagedBoxes: Set<string>,
    chainQueue?: string[],
    spawnReplacement?: { color: GemColor; special: SpecialKind }
  ): void {
    const cell = this.grid[r]?.[c];
    if (!cell || cell.hole) return;
    const key = `${r},${c}`;

    // 1. Solid Honeydukes Box takes 1 layer of damage
    if (cell.box > 0) {
      if (!damagedBoxes.has(key)) {
        const countsGoal = this.hasUnfinishedGoal('box');
        damagedBoxes.add(key);
        cell.box -= 1;
        this.addGoalProgress('box', 1);
        this.pushVfx({
          kind: 'pop',
          r,
          c,
          color: '#d97706',
          subkind: 'box',
          goalKind: countsGoal ? 'box' : undefined,
        });
        this.score += 35;
      }
      return;
    }

    // 2. Forbidden Forest Spiderweb breaks first, freeing the gem inside!
    if (cell.web) {
      const countsGoal = this.hasUnfinishedGoal('web');
      cell.web = false;
      this.addGoalProgress('web', 1);
      this.pushVfx({
        kind: 'pop',
        r,
        c,
        color: '#e2e8f0',
        subkind: 'web',
        goalKind: countsGoal ? 'web' : undefined,
      });
      this.score += 30;
      return;
    }

    // 3. Falling Scrolls are immune to destruction — clear underlay ice only
    if (cell.piece?.kind === 'scroll') {
      this.damageUnderlayIce(r, c);
      return;
    }

    // 4. Crack underlay Ice
    this.damageUnderlayIce(r, c);

    const p = cell.piece;
    if (!p) {
      if (spawnReplacement) {
        cell.piece = this.makePiece(r, c, 'gem', spawnReplacement.color, spawnReplacement.special, r);
        cell.piece.scale = 1.32;
        cell.piece.squash = 0.22;
      }
      return;
    }
    if (p.bombPrimed) {
      return;
    }

    // Count gem toward color goal & pop VFX
    const countsGemGoal = p.special !== 'snitch' && this.hasUnfinishedGoal('gem', p.color);
    if (p.special !== 'snitch') {
      this.addGoalProgress('gem', 1, p.color);
    }
    this.pushVfx({
      kind: 'pop',
      r,
      c,
      color: GEM_META[p.color]?.fillPrimary ?? '#fde047',
      subkind: 'gem',
      gemColor: p.color,
      goalKind: countsGemGoal ? 'gem' : undefined,
    });

    // Remove piece (or replace with newly formed power-up, or keep primed Wrapped Bomb for 2nd 3x3 blast!)
    const oldSpecial = p.special;
    const oldColor = p.color;
    if (spawnReplacement) {
      cell.piece = this.makePiece(r, c, 'gem', spawnReplacement.color, spawnReplacement.special, r);
      cell.piece.scale = 1.3;
    } else if (oldSpecial === 'bomb') {
      const primed = this.makePiece(r, c, 'gem', oldColor, 'bomb', r);
      primed.bombPrimed = true;
      primed.secondBlastRadius = 1;
      primed.scale = 1.38;
      cell.piece = primed;
    } else {
      cell.piece = null;
    }

    // 5. Chain-detonate existing Special if this cell held one!
    if (oldSpecial !== 'none' && chainQueue) {
      if (oldSpecial === 'rocket_h') {
        this.pushVfx({ kind: 'beam_row', r });
        for (let cc = 0; cc < MATCH3_BOARD_SIZE; cc++) chainQueue.push(`${r},${cc}`);
      } else if (oldSpecial === 'rocket_v') {
        this.pushVfx({ kind: 'beam_col', c });
        for (let rr = 0; rr < MATCH3_BOARD_SIZE; rr++) chainQueue.push(`${rr},${c}`);
      } else if (oldSpecial === 'bomb') {
        this.pushVfx({ kind: 'shockwave', r, c, radius: 1.8 });
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < MATCH3_BOARD_SIZE && nc >= 0 && nc < MATCH3_BOARD_SIZE) {
              chainQueue.push(`${nr},${nc}`);
            }
          }
        }
      } else if (oldSpecial === 'snitch') {
        const col = this.pickBestColorForSnitch();
        for (let rr = 0; rr < MATCH3_BOARD_SIZE; rr++) {
          for (let cc = 0; cc < MATCH3_BOARD_SIZE; cc++) {
            if (this.grid[rr][cc].piece?.kind === 'gem' && this.grid[rr][cc].piece!.color === col) {
              this.pushVfx({ kind: 'lightning', fromR: r, fromC: c, toR: rr, toC: cc });
              chainQueue.push(`${rr},${cc}`);
            }
          }
        }
      }
    }
  }

  private detonatePrimedBombs(): boolean {
    const primedList: Array<{ r: number; c: number; radius: number; color: GemColor }> = [];
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const p = this.grid[r][c].piece;
        if (p?.kind === 'gem' && p.bombPrimed) {
          primedList.push({
            r,
            c,
            radius: p.secondBlastRadius ?? 1,
            color: p.color,
          });
          this.grid[r][c].piece = null;
        }
      }
    }
    if (primedList.length === 0) return false;

    const targets = new Set<string>();
    for (const pb of primedList) {
      this.pushVfx({
        kind: 'shockwave',
        r: pb.r,
        c: pb.c,
        radius: pb.radius === 2 ? 3.2 : 2.1,
      });
      this.pushVfx({
        kind: 'pop',
        r: pb.r,
        c: pb.c,
        color: GEM_META[pb.color]?.fillPrimary ?? '#fb7185',
        subkind: 'gem',
        gemColor: pb.color,
      });
      this.score += pb.radius === 2 ? 300 : 120;
      for (let dr = -pb.radius; dr <= pb.radius; dr++) {
        for (let dc = -pb.radius; dc <= pb.radius; dc++) {
          const nr = pb.r + dr;
          const nc = pb.c + dc;
          if (nr >= 0 && nr < MATCH3_BOARD_SIZE && nc >= 0 && nc < MATCH3_BOARD_SIZE) {
            targets.add(`${nr},${nc}`);
          }
        }
      }
    }
    this.resolveExplosionSet(targets, new Set());
    return true;
  }

  // ==================== GRAVITY (VERTICAL + DIAGONAL SLIDE), SCROLL EXIT & CASCADES ====================

  private isColumnShadowedAbove(r: number, c: number): boolean {
    let spawnRow = 0;
    while (spawnRow < MATCH3_BOARD_SIZE && this.grid[spawnRow][c].hole) spawnRow++;
    if (r <= spawnRow) return true;
    for (let rr = r - 1; rr >= spawnRow; rr--) {
      const cur = this.grid[rr][c];
      if (cur.hole || cur.box > 0 || cur.web) return true;
      if (cur.piece !== null) return false;
      if (rr === spawnRow) return false;
    }
    return true;
  }

  private applyGravityAndRefill(): void {
    let moved = true;
    let safety = 0;
    while (moved && safety++ < 24) {
      moved = false;

      // 1. Collect any Scroll sitting on the lowest non-hole row of its column
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        let bottomRow = MATCH3_BOARD_SIZE - 1;
        while (bottomRow >= 0 && this.grid[bottomRow][c].hole) bottomRow--;
        if (bottomRow >= 0 && this.grid[bottomRow][c].piece?.kind === 'scroll') {
          const countsGoal = this.hasUnfinishedGoal('scroll');
          this.grid[bottomRow][c].piece = null;
          this.scrollsOnBoard = Math.max(0, this.scrollsOnBoard - 1);
          this.addGoalProgress('scroll', 1);
          this.score += 120;
          this.pushVfx({
            kind: 'pop',
            r: bottomRow,
            c,
            color: '#facc15',
            subkind: 'scroll',
            goalKind: countsGoal ? 'scroll' : undefined,
          });
          this.pushVfx({
            kind: 'text',
            r: bottomRow,
            c,
            text: '📜 +1 Cổ Ngữ!',
            color: '#fde047',
          });
          moved = true;
        }
      }

      // 2. Step pieces downward 1 cell (let scrolls perched on boxes slide into open lanes, then vertical, then diagonal)
      for (let r = MATCH3_BOARD_SIZE - 1; r >= 1; r--) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          const dst = this.grid[r][c];
          if (dst.hole || dst.box > 0 || dst.piece !== null) continue;

          let slidScroll = false;
          for (const dc of [-1, 1]) {
            const diag = this.grid[r - 1][c + dc];
            const belowDiag = this.grid[r][c + dc];
            if (
              diag &&
              !diag.hole &&
              diag.box === 0 &&
              !diag.web &&
              diag.piece?.kind === 'scroll' &&
              belowDiag &&
              (belowDiag.hole || belowDiag.box > 0 || belowDiag.web)
            ) {
              dst.piece = diag.piece;
              diag.piece = null;
              moved = true;
              slidScroll = true;
              break;
            }
          }
          if (slidScroll) continue;

          const above = this.grid[r - 1][c];
          if (!above.hole && above.box === 0 && !above.web && above.piece) {
            dst.piece = above.piece;
            above.piece = null;
            moved = true;
            continue;
          }

          // Candy Crush Diagonal Slide: if column above is shadowed by a blocker (hole/box/web), slide diagonally!
          if (this.isColumnShadowedAbove(r, c)) {
            for (const dc of [-1, 1]) {
              const diag = this.grid[r - 1][c + dc];
              if (diag && !diag.hole && diag.box === 0 && !diag.web && diag.piece) {
                dst.piece = diag.piece;
                diag.piece = null;
                moved = true;
                break;
              }
            }
          }
        }
      }

      // 3. Spawn new pieces into empty top-row playable cells
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        // Find highest non-hole cell in column if row 0 is a decorative cutout hole
        let spawnRow = 0;
        while (spawnRow < MATCH3_BOARD_SIZE && this.grid[spawnRow][c].hole) spawnRow++;
        if (spawnRow >= MATCH3_BOARD_SIZE) continue;

        const topCell = this.grid[spawnRow][c];
        if (topCell.box === 0 && topCell.piece === null) {
          const scrollsRemaining = this.levelDef.scrollsTotal - this.scrollsSpawned;
          const maxOnBoard = Math.min(3, Math.max(2, Math.ceil(this.levelDef.scrollsTotal * 0.75)));
          const urgentScroll =
            this.scrollsOnBoard === 0 || this.movesLeft <= scrollsRemaining * 5 + 4;
          const colHasBox = this.grid.some((row, rr) => rr > spawnRow && row[c].box > 0);
          const shouldSpawnScroll =
            scrollsRemaining > 0 &&
            this.scrollsOnBoard < maxOnBoard &&
            ((c >= 1 && c <= 6 && !colHasBox) || urgentScroll) &&
            (urgentScroll || Math.random() < 0.5);

          if (shouldSpawnScroll) {
            topCell.piece = this.makePiece(spawnRow, c, 'scroll', 'topaz', 'none', spawnRow - 1.4);
            this.scrollsSpawned++;
            this.scrollsOnBoard++;
          } else {
            topCell.piece = this.makePiece(
              spawnRow,
              c,
              'gem',
              this.randomColor(),
              'none',
              spawnRow - 1.4
            );
          }
          moved = true;
        }
      }
    }
  }

  private runGravityAndCascadeLoop(): number {
    let cascades = 0;
    while (cascades < 18) {
      this.applyGravityAndRefill();
      if (this.detonatePrimedBombs()) {
        cascades++;
        continue;
      }
      const matchInfo = this.detectMatches();
      if (matchInfo.matchedKeys.size === 0) break;
      cascades++;
      this.applyMatchWave(matchInfo, cascades + 1);
    }
    return cascades;
  }

  private triggerSugarCrushFinale(): void {
    if (this.sugarCrushTriggered) return;
    this.sugarCrushTriggered = true;

    this.pushVfx({
      kind: 'text',
      r: 3.5,
      c: 3.5,
      text: '🍬 SUGAR CRUSH!',
      color: '#fde047',
    });

    // 1. Detonate any existing Special Candies remaining on the board
    const detonateRemainingSpecials = () => {
      const remainingSpecials = new Set<string>();
      for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          const cell = this.grid[r][c];
          if (!cell.hole && cell.box === 0 && !cell.web && cell.piece?.kind === 'gem') {
            if (cell.piece.special === 'snitch') {
              const col = this.pickBestColorForSnitch();
              cell.piece = null;
              this.damageUnderlayIce(r, c);
              this.triggerSnitchColorZap(r, c, col);
            } else if (cell.piece.special !== 'none') {
              remainingSpecials.add(`${r},${c}`);
            }
          }
        }
      }
      if (remainingSpecials.size > 0) {
        this.resolveExplosionSet(remainingSpecials, new Set());
        this.runGravityAndCascadeLoop();
      }
    };

    detonateRemainingSpecials();

    // 2. Convert leftover moves into Striped Candies (rocket_h / rocket_v) and detonate them!
    const leftover = Math.max(0, this.movesLeft);
    this.leftoverMovesConverted = leftover;
    this.bonusCoinsFromLeftoverMoves = leftover * 10;
    this.score += leftover * 250;
    this.movesLeft = 0;

    if (leftover > 0) {
      const plainCells: Match3Cell[] = [];
      for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          const cell = this.grid[r][c];
          if (
            !cell.hole &&
            cell.box === 0 &&
            !cell.web &&
            cell.piece?.kind === 'gem' &&
            cell.piece.special === 'none'
          ) {
            plainCells.push(cell);
          }
        }
      }

      for (let i = plainCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [plainCells[i], plainCells[j]] = [plainCells[j], plainCells[i]];
      }

      const spawnCount = Math.min(leftover, 12, plainCells.length);
      const sugarRockets = new Set<string>();
      for (let i = 0; i < spawnCount; i++) {
        const target = plainCells[i];
        if (target.piece) {
          target.piece.special = i % 2 === 0 ? 'rocket_h' : 'rocket_v';
          target.piece.scale = 1.35;
          sugarRockets.add(`${target.r},${target.c}`);
        }
      }

      if (sugarRockets.size > 0) {
        this.resolveExplosionSet(sugarRockets, new Set());
        this.runGravityAndCascadeLoop();
      }
      detonateRemainingSpecials();
    }
  }

  private finalizeTurnState(comboCount: number): void {
    this.lastComboChain = comboCount;
    this.syncHoneyGoalProgress();
    if (this.areAllGoalsComplete()) {
      this.triggerSugarCrushFinale();
      this.status = 'won';
      return;
    }
    if (this.movesLeft <= 0) {
      this.status = 'out_of_moves';
      return;
    }
    this.ensurePlayableMoveExists();
  }

  // ==================== HINT FINDER & AUTO-SHUFFLE ====================

  public findBestHintMove(): { r1: number; c1: number; r2: number; c2: number } | null {
    // Classic Candy Crush: only adjacent swaps that form a 3+ match, double special combo, or Snitch zap
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        if (!this.canInteractCell(r, c)) continue;
        const p1 = this.grid[r][c].piece!;
        for (const [dr, dc] of [
          [0, 1],
          [1, 0],
        ]) {
          const r2 = r + dr;
          const c2 = c + dc;
          if (!this.canInteractCell(r2, c2)) continue;
          const p2 = this.grid[r2][c2].piece!;

          if (
            (p1.kind === 'gem' && p2.kind === 'gem' && p1.special !== 'none' && p2.special !== 'none') ||
            (p1.special === 'snitch' && p2.kind === 'gem') ||
            (p2.special === 'snitch' && p1.kind === 'gem')
          ) {
            return { r1: r, c1: c, r2, c2 };
          }

          // Test swap
          this.grid[r][c].piece = p2;
          this.grid[r2][c2].piece = p1;
          const hasMatch = this.detectMatches().matchedKeys.size > 0;
          this.grid[r][c].piece = p1;
          this.grid[r2][c2].piece = p2;
          if (hasMatch) {
            return { r1: r, c1: c, r2, c2 };
          }
        }
      }
    }

    return null;
  }

  private ensurePlayableMoveExists(): void {
    if (this.findBestHintMove()) return;
    this.shuffleMovableGems(false);
    this.pushVfx({
      kind: 'text',
      r: 3.5,
      c: 3.5,
      text: '✨ Tự động xáo bàn!',
      color: '#93c5fd',
    });
  }

  public shuffleMovableGems(grantBonusRocket: boolean): void {
    const slots: Match3Cell[] = [];
    const pieces: Match3Piece[] = [];
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const cell = this.grid[r][c];
        if (!cell.hole && cell.box === 0 && !cell.web && cell.piece?.kind === 'gem') {
          slots.push(cell);
          pieces.push(cell.piece);
        }
      }
    }
    if (slots.length < 3) return;

    for (let attempt = 0; attempt < 15; attempt++) {
      for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
      }
      for (let i = 0; i < slots.length; i++) {
        slots[i].piece = pieces[i];
      }
      if (this.detectMatches().matchedKeys.size === 0 && this.findBestHintMove()) {
        break;
      }
    }

    // Guarantee at least 1 valid swap if board is super tight: imbue a Color Bomb (Snitch) on a cell with an adjacent neighbor
    if (!this.findBestHintMove() && slots.length >= 1) {
      const slotWithNeighbor =
        slots.find((s) =>
          [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
          ].some(([dr, dc]) => this.canInteractCell(s.r + dr, s.c + dc))
        ) ?? slots[0];
      if (slotWithNeighbor?.piece) {
        slotWithNeighbor.piece.special = 'snitch';
        slotWithNeighbor.piece.scale = 1.3;
      }
    } else if (grantBonusRocket) {
      const normalSlot = slots.find((s) => s.piece && s.piece.special === 'none');
      if (normalSlot?.piece) {
        normalSlot.piece.special = Math.random() < 0.5 ? 'rocket_h' : 'rocket_v';
        normalSlot.piece.scale = 1.3;
      }
    }
  }

  // Smoothly interpolate visual coordinates toward logical (r, c) at 60fps with juicy candy bounce!
  public stepVisualTweens(dt: number): void {
    const slideSpeed = Math.min(1, dt * 16);
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const p = this.grid[r][c].piece;
        if (!p) continue;

        // Horizontal tween (swaps & diagonal slides)
        p.visC += (c - p.visC) * slideSpeed;
        if (Math.abs(c - p.visC) < 0.008) p.visC = c;

        // Vertical tween: gravity acceleration when dropping downward, smooth ease when swapping upward
        if (r > p.visR + 0.012) {
          p.vy = Math.min(24, (p.vy ?? 4.2) + dt * 42);
          p.visR += p.vy * dt;
          if (p.visR >= r) {
            p.visR = r;
            p.squash = Math.min(0.24, 0.08 + p.vy * 0.007);
            p.vy = 0;
          }
        } else {
          p.vy = 0;
          p.visR += (r - p.visR) * slideSpeed;
          if (Math.abs(r - p.visR) < 0.008) p.visR = r;
        }

        if (p.squash && p.squash > 0.004) {
          p.squash *= Math.max(0, 1 - dt * 11);
        } else {
          p.squash = 0;
        }

        p.scale += (1 - p.scale) * Math.min(1, dt * 11);
      }
    }
  }
}
