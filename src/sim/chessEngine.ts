// Tách tự động từ src/sim/puzzleArcadeEngine.ts (P0.5 — tách puzzle engine theo môn).
import { SavedChessHistoryItem, SavedChessPiece, SavedChessSession } from "../types/game";
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
import {
  CENTER_PST,
  CHESS_MATCH_TABIYA_FENS,
  CHESS_REVIEW_GLYPHS,
  CHESS_TACTIC_PRESETS,
  CHESS_UNIQUE_TACTICS_DECK,
  ChessCastlingRights,
  ChessColor,
  ChessMove,
  ChessPiece,
  ChessPieceType,
  ChessSnapshot,
  ChessSubMode,
  ChessTacticPreset,
  ChessWorkerSearchPayload,
  KNIGHT_PST,
  PAWN_PST,
  PIECE_VALUES,
  ResolvedChessTacticEntry,
  STANDARD_CHESS_FEN,
  cloneChessBoard,
  formatChessMoveReviewVi,
  formatChessSquareVi,
  getChessTacticalOrdinal,
  mirrorFenHorizontally,
} from "./chessPresets";

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
          sub: 'Đại chiến Cờ Phù Thủy 8×8 — Tượng Ngà Vàng đấu Đá Đen, nhập thành & phong Hậu đầy đủ!',
        },
        {
          name: 'Ông Arthur Weasley',
          emoji: '🔧',
          portrait: 'arthur',
          sub: 'Điều Chiến Mã, Tượng Giám Mục & Lính Khiên Đá kiểm soát trung tâm bàn cờ!',
        },
        {
          name: 'Bác Rubeus Hagrid',
          emoji: '🎃',
          portrait: 'hagrid',
          sub: 'Cẩn thận Song Xe & Thiết Mã Đá Đen phản kích từ cánh hậu!',
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

  /**
   * Hiển thị gợi ý nước đi tối ưu (`this.hintMove` + chọn sẵn quân gợi ý) mà KHÔNG tự động đi thay người chơi,
   * đảm bảo bấm "💡 Gợi Ý" không bao giờ tự động qua màn ở các thế cờ chiếu bí 1 nước.
   */
  public useBestMoveHint(): {
    ok: boolean;
    move: ChessMove | null;
    labelVi: string;
  } {
    if (this.status !== 'playing' || this.turn !== 'w') {
      return { ok: false, move: null, labelVi: '' };
    }
    const legal = this.getAllLegalMovesForState(this.board, 'w', this.castling, this.enPassant);
    if (legal.length === 0) {
      return { ok: false, move: null, labelVi: '' };
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
    const chosen = res.move ?? legal[0];
    if (!chosen) {
      return { ok: false, move: null, labelVi: '' };
    }
    this.hintMove = {
      fromR: chosen.fromR,
      fromC: chosen.fromC,
      toR: chosen.toR,
      toC: chosen.toC,
    };
    this.selected = { r: chosen.fromR, c: chosen.fromC };
    return {
      ok: true,
      move: chosen,
      labelVi: formatChessMoveReviewVi(this.board, chosen),
    };
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

  public exportSession(extra?: {
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedChessSession | null {
    if (this.status === 'won') return null;
    const historyTail = this.history.slice(-40).map(
      (snap): SavedChessHistoryItem => ({
        board: cloneChessBoard(snap.board),
        turn: snap.turn,
        castling: { ...snap.castling },
        enPassant: snap.enPassant ? { ...snap.enPassant } : null,
        capturedByWhite: [...snap.capturedByWhite],
        capturedByBlack: [...snap.capturedByBlack],
        lastMove: snap.lastMove ? { ...snap.lastMove } : null,
        halfMoveClock: snap.halfMoveClock,
      })
    );
    return {
      stage: this.stage,
      subMode: this.subMode,
      loadedFen: this.loadedFen,
      board: cloneChessBoard(this.board),
      turn: this.turn,
      castling: { ...this.castling },
      enPassant: this.enPassant ? { ...this.enPassant } : null,
      capturedByWhite: [...this.capturedByWhite],
      capturedByBlack: [...this.capturedByBlack],
      lastMove: this.lastMove ? { ...this.lastMove } : null,
      hintMove: this.hintMove ? { ...this.hintMove } : null,
      selected: this.selected ? { ...this.selected } : null,
      halfMoveClock: this.halfMoveClock,
      moveCount: this.moveCount,
      freeUndosLeft: this.freeUndosLeft,
      paidUndosLeft: this.paidUndosLeft,
      freeHintsLeft: this.freeHintsLeft,
      paidAssistsLeft: this.paidAssistsLeft,
      talismanUsed: this.talismanUsed,
      status: this.status,
      history: historyTail,
      companionCharge: extra?.companionCharge,
      snackPieUsed: extra?.snackPieUsed,
      savedAt: Date.now(),
    };
  }

  private static validateSavedChessBoard(
    raw: unknown
  ): Array<Array<SavedChessPiece | null>> | null {
    if (!Array.isArray(raw) || raw.length !== 8) return null;
    const validTypes = new Set<ChessPieceType>(['p', 'n', 'b', 'r', 'q', 'k']);
    let whiteKings = 0;
    let blackKings = 0;
    const out: Array<Array<SavedChessPiece | null>> = [];
    for (let r = 0; r < 8; r++) {
      const row = raw[r];
      if (!Array.isArray(row) || row.length !== 8) return null;
      const outRow: Array<SavedChessPiece | null> = [];
      for (let c = 0; c < 8; c++) {
        const cell = row[c];
        if (cell === null || cell === undefined) {
          outRow.push(null);
          continue;
        }
        if (
          typeof cell !== 'object' ||
          ((cell as SavedChessPiece).color !== 'w' && (cell as SavedChessPiece).color !== 'b') ||
          !validTypes.has((cell as SavedChessPiece).type)
        ) {
          return null;
        }
        const piece: SavedChessPiece = {
          color: (cell as SavedChessPiece).color,
          type: (cell as SavedChessPiece).type,
        };
        if (piece.type === 'k') {
          if (piece.color === 'w') whiteKings++;
          else blackKings++;
        }
        outRow.push(piece);
      }
      out.push(outRow);
    }
    if (whiteKings !== 1 || blackKings !== 1) return null;
    return out;
  }

  public restoreSession(snap: SavedChessSession | null | undefined): boolean {
    if (!snap || snap.stage !== this.stage || snap.subMode !== this.subMode) return false;
    if (
      snap.status !== 'playing' &&
      snap.status !== 'ai_thinking' &&
      snap.status !== 'lost' &&
      snap.status !== 'draw'
    ) {
      return false;
    }
    if (snap.turn !== 'w' && snap.turn !== 'b') return false;
    const cleanBoard = WizardChessEngine.validateSavedChessBoard(snap.board);
    if (!cleanBoard) return false;

    const validTypes = new Set<ChessPieceType>(['p', 'n', 'b', 'r', 'q', 'k']);
    const sanitizeMove = (
      m: { fromR: number; fromC: number; toR: number; toC: number } | null | undefined
    ): { fromR: number; fromC: number; toR: number; toC: number } | null =>
      m &&
      Number.isInteger(m.fromR) &&
      m.fromR >= 0 &&
      m.fromR < 8 &&
      Number.isInteger(m.fromC) &&
      m.fromC >= 0 &&
      m.fromC < 8 &&
      Number.isInteger(m.toR) &&
      m.toR >= 0 &&
      m.toR < 8 &&
      Number.isInteger(m.toC) &&
      m.toC >= 0 &&
      m.toC < 8
        ? { fromR: m.fromR, fromC: m.fromC, toR: m.toR, toC: m.toC }
        : null;
    const sanitizeSquare = (
      sq: { r: number; c: number } | null | undefined
    ): { r: number; c: number } | null =>
      sq &&
      Number.isInteger(sq.r) &&
      sq.r >= 0 &&
      sq.r < 8 &&
      Number.isInteger(sq.c) &&
      sq.c >= 0 &&
      sq.c < 8
        ? { r: sq.r, c: sq.c }
        : null;

    this.loadedFen = typeof snap.loadedFen === 'string' && snap.loadedFen ? snap.loadedFen : this.loadedFen;
    this.board = cleanBoard;
    this.turn = snap.turn;
    this.castling = {
      wK: Boolean(snap.castling?.wK),
      wQ: Boolean(snap.castling?.wQ),
      bK: Boolean(snap.castling?.bK),
      bQ: Boolean(snap.castling?.bQ),
    };
    this.enPassant = sanitizeSquare(snap.enPassant);
    this.capturedByWhite = Array.isArray(snap.capturedByWhite)
      ? snap.capturedByWhite.filter((t): t is ChessPieceType => validTypes.has(t))
      : [];
    this.capturedByBlack = Array.isArray(snap.capturedByBlack)
      ? snap.capturedByBlack.filter((t): t is ChessPieceType => validTypes.has(t))
      : [];
    this.lastMove = sanitizeMove(snap.lastMove);
    this.hintMove = sanitizeMove(snap.hintMove);
    this.selected = sanitizeSquare(snap.selected);
    this.halfMoveClock = Math.max(0, Math.min(200, Math.floor(snap.halfMoveClock || 0)));
    this.moveCount = Math.max(0, Math.min(500, Math.floor(snap.moveCount || 0)));
    this.freeUndosLeft = Math.max(0, Math.min(10, Math.floor(snap.freeUndosLeft ?? 0)));
    this.paidUndosLeft = Math.max(0, Math.min(10, Math.floor(snap.paidUndosLeft ?? 0)));
    this.freeHintsLeft = Math.max(0, Math.min(10, Math.floor(snap.freeHintsLeft ?? 0)));
    this.paidAssistsLeft = Math.max(0, Math.min(5, Math.floor(snap.paidAssistsLeft ?? 0)));
    this.talismanUsed = Boolean(snap.talismanUsed);
    this.status = snap.status;

    this.history = [];
    if (Array.isArray(snap.history)) {
      for (const h of snap.history.slice(-40)) {
        const hb = WizardChessEngine.validateSavedChessBoard(h?.board);
        if (!hb || (h.turn !== 'w' && h.turn !== 'b')) continue;
        this.history.push({
          board: hb,
          turn: h.turn,
          castling: {
            wK: Boolean(h.castling?.wK),
            wQ: Boolean(h.castling?.wQ),
            bK: Boolean(h.castling?.bK),
            bQ: Boolean(h.castling?.bQ),
          },
          enPassant: sanitizeSquare(h.enPassant),
          capturedByWhite: Array.isArray(h.capturedByWhite)
            ? h.capturedByWhite.filter((t): t is ChessPieceType => validTypes.has(t))
            : [],
          capturedByBlack: Array.isArray(h.capturedByBlack)
            ? h.capturedByBlack.filter((t): t is ChessPieceType => validTypes.has(t))
            : [],
          lastMove: sanitizeMove(h.lastMove),
          halfMoveClock: Math.max(0, Math.min(200, Math.floor(h.halfMoveClock || 0))),
        });
      }
    }
    this.whiteTurnReviews = [];
    this.cachedTurningPoint = null;
    return true;
  }
}

