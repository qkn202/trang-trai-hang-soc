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
import { EXTRA_CHESS_TACTICS } from "../data/chessTacticsPack";

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

export interface ChessCastlingRights {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
}

export interface ChessSnapshot {
  board: (ChessPiece | null)[][];
  turn: ChessColor;
  castling: ChessCastlingRights;
  enPassant: { r: number; c: number } | null;
  capturedByWhite: ChessPieceType[];
  capturedByBlack: ChessPieceType[];
  lastMove: { fromR: number; fromC: number; toR: number; toC: number } | null;
  halfMoveClock: number;
}

export interface ChessTacticPreset {
  title: string;
  subtitle: string;
  opponentName: string;
  opponentEmoji: string;
  opponentPortrait: WizardingPortraitKey;
  fen: string;
  tier: 1 | 2 | 3;
}

export const CHESS_TACTIC_PRESETS: ReadonlyArray<ChessTacticPreset> = [
  // Tier 1: Mate in 1..2 Onboarding
  {
    title: 'Tháp Hogwarts Xuất Kích',
    subtitle: 'Điều Xe Tháp Thành Trì (♖) tung đòn chiếu bí Vua Đen ngay trong 1 nước!',
    opponentName: 'Ron Weasley',
    opponentEmoji: '🦁',
    opponentPortrait: 'ron',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    tier: 1,
  },
  {
    title: 'Song Kiếm Vương & Hậu',
    subtitle: 'Phối hợp Vua Hiệp Sĩ (♔) & Hậu Chiến Binh (♕) khóa chặt Vua Đen sát góc bàn!',
    opponentName: 'Ông Arthur Weasley',
    opponentEmoji: '👑',
    opponentPortrait: 'arthur',
    fen: '7k/6p1/5K2/8/6Q1/8/8/8 w - - 0 1',
    tier: 1,
  },
  {
    title: 'Song Tháp Lâu Đài Hogwarts',
    subtitle: 'Khóa hàng 7 và điều hai Xe Tháp Thành Trì (♖) dồn chiếu bí trên hàng 8!',
    opponentName: 'Bà Molly Weasley',
    opponentEmoji: '🏰',
    opponentPortrait: 'molly',
    fen: '4k3/R7/8/8/8/8/8/1R4K1 w - - 0 1',
    tier: 1,
  },
  {
    title: 'Thiết Mã Chiếu Ngộp',
    subtitle: 'Nhảy Chiến Mã Giáp Đá (♘) chiếu ngộp Vua Đen bị kẹt giữa hàng rào quân mình!',
    opponentName: 'Ron Weasley',
    opponentEmoji: '🐴',
    opponentPortrait: 'ron',
    fen: '6rk/5Npp/8/8/8/8/6PP/6K1 w - - 0 1',
    tier: 1,
  },
  // Tier 2: Mate in 2 & Double-Attack Combinations
  {
    title: 'Liên Kích Hậu & Tượng Đá',
    subtitle: 'Lập trận Hậu Chiến Binh (♕) + Tượng Giám Mục (♗) nhắm thẳng ô cánh Vua!',
    opponentName: 'Bác Rubeus Hagrid',
    opponentEmoji: '🪄',
    opponentPortrait: 'hagrid',
    fen: '5rk1/5p1p/6p1/8/8/5Q2/1B3PPP/6K1 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Vó Thiết Mã Khóa Góc',
    subtitle: 'Đưa Chiến Mã Giáp Đá (♘) khóa đường thoát để Xe Tháp kết liễu góc bàn!',
    opponentName: 'Ron Weasley',
    opponentEmoji: '🦅',
    opponentPortrait: 'ron',
    fen: '7k/1R6/8/p7/4N3/8/6PP/6K1 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Tàn Cuộc Vương Quyền',
    subtitle: 'Siết vòng vây Vua Hiệp Sĩ (♔) và Hậu Chiến Binh (♕) chiếu bí Vua Đen trên hàng 8!',
    opponentName: 'Ông Arthur Weasley',
    opponentEmoji: '✨',
    opponentPortrait: 'arthur',
    fen: '3k4/8/3K4/8/5Q2/8/8/8 w - - 0 1',
    tier: 2,
  },
  {
    title: 'Trận Đồ Chéo Đại Sảnh Đường',
    subtitle: 'Tận dụng Tượng Giám Mục (♗) đường chéo lớn và Hậu Chiến Binh (♕) công phá cánh Vua!',
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
    title: 'Đại Chiến Bàn Cờ Đá McGonagall',
    subtitle: 'Phối hợp Hậu, Tượng, Chiến Mã & Song Xe phá vỡ phòng tuyến Đá Đen!',
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

export const STANDARD_CHESS_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const CHESS_MATCH_TABIYA_FENS: ReadonlyArray<{ label: string; fen: string }> = [
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

export function mirrorFenHorizontally(fen: string): string {
  const parts = fen.trim().split(/\s+/);
  if ((parts[2] ?? '-') !== '-') return fen; // Only mirror positions without castling rights
  const mirroredRows = parts[0]
    .split('/')
    .map((row) => row.split('').reverse().join(''))
    .join('/');
  return [mirroredRows, parts[1] ?? 'w', '-', '-', parts[4] ?? '0', parts[5] ?? '1'].join(' ');
}

export interface ResolvedChessTacticEntry {
  preset: ChessTacticPreset;
  fen: string;
  mirrored: boolean;
}

export const CHESS_UNIQUE_TACTICS_DECK: ReadonlyArray<ResolvedChessTacticEntry> = (() => {
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

export function getChessTacticalOrdinal(stage: number): number {
  if (stage <= 10) return Math.max(0, stage - 1); // 0..9
  if ((stage - 13) % 3 === 0) {
    return 10 + Math.floor((stage - 13) / 3); // 10..264 across stages 13..775
  }
  // Fallback for forced 'tactics' in unit tests on non-default stages > 10
  return 265 + stage;
}

export const PIECE_VALUES: Record<ChessPieceType, number> = {
  p: 100,
  n: 320,
  b: 335,
  r: 500,
  q: 920,
  k: 20000,
};

export const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [14, 14, 22, 32, 32, 22, 14, 14],
  [6, 6, 12, 26, 26, 12, 6, 6],
  [0, 0, 4, 22, 22, 4, 0, 0],
  [4, -4, -8, 4, 4, -8, -4, 4],
  [4, 10, 10, -18, -18, 10, 10, 4],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const KNIGHT_PST = [
  [-45, -35, -25, -25, -25, -25, -35, -45],
  [-35, -15, 0, 4, 4, 0, -15, -35],
  [-25, 4, 14, 18, 18, 14, 4, -25],
  [-25, 6, 18, 24, 24, 18, 6, -25],
  [-25, 4, 18, 24, 24, 18, 4, -25],
  [-25, 6, 14, 18, 18, 14, 6, -25],
  [-35, -15, 0, 6, 6, 0, -15, -35],
  [-45, -35, -25, -25, -25, -25, -35, -45],
];

export const CENTER_PST = [
  [-18, -10, -10, -8, -8, -10, -10, -18],
  [-10, 0, 4, 6, 6, 4, 0, -10],
  [-10, 4, 10, 12, 12, 10, 4, -10],
  [-8, 6, 12, 16, 16, 12, 6, -8],
  [-8, 6, 12, 16, 16, 12, 6, -8],
  [-10, 4, 10, 12, 12, 10, 4, -10],
  [-10, 0, 4, 6, 6, 4, 0, -10],
  [-18, -10, -10, -8, -8, -10, -10, -18],
];

export function cloneChessBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export interface ChessWorkerSearchPayload {
  stage: number;
  board: (ChessPiece | null)[][];
  turn: ChessColor;
  castling: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
  enPassant: { r: number; c: number } | null;
}

export const CHESS_REVIEW_GLYPHS: Record<ChessPieceType, string> = {
  p: '♙',
  n: '♘',
  b: '♗',
  r: '♖',
  q: '♕',
  k: '♔',
};

export function formatChessSquareVi(r: number, c: number): string {
  const file = String.fromCharCode(97 + Math.max(0, Math.min(7, c)));
  const rank = 8 - Math.max(0, Math.min(7, r));
  return `${file}${rank}`;
}

export function formatChessMoveReviewVi(
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

