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
// 5. CỜ CARO BÀN GỖ HANG SÓC 13x13 (5-IN-A-ROW GOMOKU VS CANON AI OPPONENTS)
// ============================================================================

export const CARO_BOARD_SIZE = 13;
/**
 * 0 = empty, 1 = Player (Phoenix Seal), 2 = AI (Dark Mark),
 * 3 = Ancient Wax Rune Obstacle (Ấn Chì Cổ Ngữ Hắc Ám — blocks both sides on mid/late stages!)
 */
export type CaroStone = 0 | 1 | 2 | 3;

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

