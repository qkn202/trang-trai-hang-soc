/**
 * Deterministic Proof-of-Play (PoP) Envelope & Pure Verifier
 * ----------------------------------------------------------
 * Chống bơm điểm / giả mạo gói tin Bảng Xếp Hạng trực tuyến (`match3`, `sudoku`, `blocks`, `jigsaw`)
 * với kích thước siêu gọn (< 1.2 KB JSON), không cần chạy lại toàn bộ vật lý nặng trên Cloudflare Worker.
 *
 * Cơ chế:
 * 1. Ghi nhận mọi nước đi hợp lệ `(actionCode, dt10ms)` trong bộ đệm TypedArray tĩnh 0-GC suốt ván chơi.
 * 2. Khi kết thúc ván (`seal`), gộp tuyến tính thành tối đa 128 bước nén (`packedStepsHex`, 8 ký tự hex/bước <= 1.024 byte)
 *    và tính chuỗi băm kép 64-bit (`chainHi`, `chainLo`) bắt đầu từ `(gameId, stage, seed, nonce)`.
 * 3. Server (`BurrowAuthoritativeBackend`) tái tính lại chính xác 100% `(chainHi, chainLo)` từ đầu chuỗi,
 *    kiểm tra nhịp độ thao tác con người (chống macro 0ms), thời gian tối thiểu theo bộ môn, trần điểm hợp lý
 *    theo tầng tháp (1..777), và khử phát lại (`nonce` anti-replay).
 */

export type ProofOfPlayGameId = 'match3' | 'sudoku' | 'blocks' | 'jigsaw';

export interface ProofOfPlayEnvelope {
  v: 1;
  gameId: ProofOfPlayGameId;
  stage: number;
  seed: number;
  nonce: string;
  startedAt: number;
  elapsedMs: number;
  moveCount: number;
  stride: number;
  sessionScore: number;
  chainHi: number;
  chainLo: number;
  /** Chuỗi hex nén tối đa 128 super-step (mỗi step = 4 byte: uint16 codeMix + uint16 dt10ms). */
  packedStepsHex: string;
}

export interface ProofOfPlayVerificationOptions {
  expectedGameId?: string;
  claimedPrimaryStage?: number;
  claimedRatingScore?: number;
  /** Tập các nonce đã sử dụng của người chơi để chống replay cùng 1 gói PoP nhiều lần. */
  seenNonces?: ReadonlySet<string> | ReadonlyArray<string>;
}

export interface ProofOfPlayVerificationResult {
  ok: boolean;
  reason?:
    | 'invalid-schema'
    | 'game-mismatch'
    | 'stage-out-of-bounds'
    | 'stage-claim-exceeds-proof'
    | 'insufficient-moves'
    | 'impossible-duration'
    | 'bot-zero-cadence'
    | 'score-ceiling-exceeded'
    | 'rating-ceiling-exceeded'
    | 'step-stream-corrupted'
    | 'duration-drift'
    | 'chain-digest-mismatch'
    | 'replayed-nonce';
  messageVi?: string;
  recomputedHi?: number;
  recomputedLo?: number;
}

const MAX_PACKED_STEPS = 128;
const MAX_BUFFERED_RAW_MOVES = 4096;
const POP_VALID_GAMES: ReadonlySet<string> = new Set(['match3', 'sudoku', 'blocks', 'jigsaw']);

export function isProofOfPlayGameId(gameId: string): gameId is ProofOfPlayGameId {
  return POP_VALID_GAMES.has(gameId);
}

function fnv1a32Update(hash: number, byteVal: number): number {
  let h = (hash ^ (byteVal & 0xff)) >>> 0;
  h = Math.imul(h, 0x01000193) >>> 0;
  return h;
}

function hashAscii32(seedHash: number, text: string): number {
  let h = seedHash >>> 0;
  for (let i = 0; i < text.length; i++) {
    h = fnv1a32Update(h, text.charCodeAt(i) & 0xff);
  }
  return h >>> 0;
}

function mixDual32(
  hi: number,
  lo: number,
  stepIdx: number,
  code16: number,
  dt16: number
): [number, number] {
  const wordA = (((stepIdx & 0xffff) << 16) | (code16 & 0xffff)) >>> 0;
  const wordB = (((dt16 & 0xffff) << 16) | ((code16 ^ dt16 ^ 0x9e37) & 0xffff)) >>> 0;

  let nextHi = (hi ^ wordA) >>> 0;
  nextHi = Math.imul(nextHi ^ (nextHi >>> 15), 0x85ebca6b) >>> 0;
  nextHi = (nextHi + (lo >>> 3)) >>> 0;

  let nextLo = (lo ^ wordB ^ nextHi) >>> 0;
  nextLo = Math.imul(nextLo ^ (nextLo >>> 13), 0xc2b2ae35) >>> 0;
  nextLo = (nextLo ^ (nextHi >>> 11)) >>> 0;

  return [nextHi, nextLo];
}

export function computeProofOfPlayChain(params: {
  gameId: ProofOfPlayGameId;
  stage: number;
  seed: number;
  nonce: string;
  moveCount: number;
  stride: number;
  sessionScore: number;
  steps: ReadonlyArray<{ code16: number; dt16: number }>;
}): { chainHi: number; chainLo: number } {
  const headerText = `pop:v1|${params.gameId}|${params.stage}|${params.seed >>> 0}|${params.nonce}|${params.moveCount}|${params.stride}|${params.sessionScore}`;
  let hi = hashAscii32(0x811c9dc5, headerText);
  let lo = hashAscii32(0x9e3779b9, `${params.nonce}:${params.seed >>> 0}:${params.stage}`);

  for (let i = 0; i < params.steps.length; i++) {
    const st = params.steps[i]!;
    [hi, lo] = mixDual32(hi, lo, i, st.code16 & 0xffff, st.dt16 & 0xffff);
  }

  // Final avalanche mix binding total step count + score
  [hi, lo] = mixDual32(
    hi,
    lo,
    params.steps.length,
    params.sessionScore & 0xffff,
    (params.sessionScore >>> 16) & 0xffff
  );
  return { chainHi: hi >>> 0, chainLo: lo >>> 0 };
}

export function encodeStepsHex(steps: ReadonlyArray<{ code16: number; dt16: number }>): string {
  let out = '';
  for (let i = 0; i < steps.length; i++) {
    const c = (steps[i]!.code16 & 0xffff).toString(16).padStart(4, '0');
    const d = (steps[i]!.dt16 & 0xffff).toString(16).padStart(4, '0');
    out += c + d;
  }
  return out;
}

export function decodeStepsHex(hex: string): Array<{ code16: number; dt16: number }> | null {
  if (typeof hex !== 'string' || hex.length === 0 || hex.length % 8 !== 0) return null;
  if (hex.length > MAX_PACKED_STEPS * 8) return null;
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;

  const steps: Array<{ code16: number; dt16: number }> = [];
  for (let offset = 0; offset < hex.length; offset += 8) {
    const code16 = Number.parseInt(hex.slice(offset, offset + 4), 16);
    const dt16 = Number.parseInt(hex.slice(offset + 4, offset + 8), 16);
    if (!Number.isFinite(code16) || !Number.isFinite(dt16)) return null;
    steps.push({ code16: code16 & 0xffff, dt16: dt16 & 0xffff });
  }
  return steps;
}

export function getMinMovesForStage(gameId: ProofOfPlayGameId, _stage: number): number {
  switch (gameId) {
    case 'match3':
      return 1;
    case 'sudoku':
      return 3;
    case 'blocks':
      return 4;
    case 'jigsaw':
      return 4;
  }
}

export function getMinHumanElapsedMs(gameId: ProofOfPlayGameId, moveCount: number): number {
  const safeMoves = Math.max(1, moveCount);
  switch (gameId) {
    case 'match3':
      return Math.max(850, Math.min(4500, safeMoves * 140));
    case 'sudoku':
      return Math.max(1800, Math.min(8000, safeMoves * 160));
    case 'blocks':
      return Math.max(1400, Math.min(7000, safeMoves * 130));
    case 'jigsaw':
      return Math.max(1600, Math.min(8000, safeMoves * 140));
  }
}

export function getMaxStageForProofGame(gameId: string): number {
  return gameId === 'match3' ? 7777 : 777;
}

export function getMaxPlausibleSessionScore(gameId: ProofOfPlayGameId, stage: number): number {
  const maxStage = getMaxStageForProofGame(gameId);
  const clampedStage = Math.max(1, Math.min(maxStage, Math.floor(stage || 1)));
  switch (gameId) {
    case 'match3':
      // Boss & cascade stages can spike high across 1..7777, but never into tens of millions on a single stage
      return 320_000 + clampedStage * 1_600;
    case 'sudoku':
      return 45_000 + clampedStage * 350;
    case 'blocks':
      return 160_000 + clampedStage * 900;
    case 'jigsaw':
      return 220_000 + clampedStage * 1_100;
  }
}

/**
 * Trần điểm xếp hạng tổng hợp hợp lý cho một tầng tháp (`1..7777` với Bùa Gặt, `1..777` với các môn khác).
 * Dùng cho cả luồng PoP trực tiếp lẫn luồng đồng bộ hồ sơ cũ (ngăn chặn bơm `ratingScore: 9999999` qua DevTools).
 */
export function getMaxPlausibleLeaderboardRating(
  gameId: string,
  primaryStage: number,
  totalWins: number,
  bestStreak: number
): number {
  const maxStage = getMaxStageForProofGame(gameId);
  const st = Math.max(0, Math.min(maxStage, Math.floor(primaryStage || 0)));
  if (st <= 0 && totalWins <= 0) return 0;
  const effectiveStage = Math.max(1, st);
  const cappedWins = Math.min(Math.max(effectiveStage, Math.floor(totalWins || 0)), effectiveStage * 25 + 120);
  const cappedStreak = Math.min(Math.max(0, Math.floor(bestStreak || 0)), cappedWins + 25);
  const stageFactor = gameId === 'match3' ? 2400 : 2200;
  return effectiveStage * stageFactor + cappedWins * 180 + cappedStreak * 120 + 25_000;
}

export function clampUnverifiedLeaderboardStats(params: {
  gameId: string;
  primaryValue: number;
  ratingScore: number;
  totalWins: number;
  bestStreak: number;
}): {
  primaryValue: number;
  ratingScore: number;
  totalWins: number;
  bestStreak: number;
} {
  const maxStage = getMaxStageForProofGame(params.gameId);
  const primaryValue = Math.max(0, Math.min(maxStage, Math.floor(Number(params.primaryValue) || 0)));
  const maxReasonableWins = primaryValue > 0 ? primaryValue * 25 + 120 : 120;
  const totalWins = Math.max(
    primaryValue,
    Math.min(maxReasonableWins, Math.floor(Number(params.totalWins) || 0))
  );
  const bestStreak = Math.max(
    0,
    Math.min(totalWins + 25, Math.floor(Number(params.bestStreak) || 0))
  );
  const maxRating = getMaxPlausibleLeaderboardRating(
    params.gameId,
    primaryValue,
    totalWins,
    bestStreak
  );
  const ratingScore = Math.max(
    0,
    Math.min(maxRating, Math.floor(Number(params.ratingScore) || 0))
  );
  return { primaryValue, ratingScore, totalWins, bestStreak };
}

function generateNonce(seed: number, startedAt: number): string {
  const randA = Math.floor(Math.random() * 0xffffffff) >>> 0;
  const randB = ((startedAt ^ Math.imul(seed >>> 0, 0x45d9f3b)) >>> 0).toString(36);
  return `${randB}-${randA.toString(36)}`.slice(0, 24);
}

/**
 * Bộ ghi nhận Proof-of-Play siêu nhẹ trong RAM suốt ván chơi.
 * Dùng TypedArray cố định nên không cấp phát object trong vòng lặp thao tác.
 */
export class ProofOfPlayRecorder {
  public readonly gameId: ProofOfPlayGameId;
  public readonly stage: number;
  public readonly seed: number;
  public readonly nonce: string;
  public readonly startedAt: number;

  private readonly rawCodes = new Uint16Array(MAX_BUFFERED_RAW_MOVES);
  private readonly rawDt10 = new Uint16Array(MAX_BUFFERED_RAW_MOVES);
  private lastActionPerfMs: number;
  private moveCount = 0;

  constructor(
    gameId: ProofOfPlayGameId,
    stage: number,
    seed?: number,
    nowEpochMs = Date.now(),
    nowPerfMs = typeof performance !== 'undefined' ? performance.now() : nowEpochMs
  ) {
    this.gameId = gameId;
    this.stage = Math.max(1, Math.min(getMaxStageForProofGame(gameId), Math.floor(stage || 1)));
    this.seed =
      (seed !== undefined
        ? Math.floor(seed)
        : Math.imul(this.stage, 2654435761) ^ (nowEpochMs & 0xffffffff)) >>> 0;
    this.startedAt = Math.floor(nowEpochMs);
    this.nonce = generateNonce(this.seed, this.startedAt);
    this.lastActionPerfMs = nowPerfMs;
  }

  public get recordedMoves(): number {
    return this.moveCount;
  }

  /**
   * Ghi nhận 1 nước đi hợp lệ của người chơi.
   * `actionCode` là mã số nguyên tất định (ví dụ toạ độ hoán đổi kẹo `(r1<<12)|(c1<<8)|(r2<<4)|c2`).
   */
  public recordMove(
    actionCode: number,
    nowPerfMs = typeof performance !== 'undefined' ? performance.now() : Date.now()
  ): void {
    const rawDeltaMs = Math.max(10, Math.round(nowPerfMs - this.lastActionPerfMs));
    this.lastActionPerfMs = nowPerfMs;
    const dt10 = Math.max(1, Math.min(0xffff, Math.round(rawDeltaMs / 10)));
    const idx = this.moveCount;
    this.moveCount += 1;
    if (idx < MAX_BUFFERED_RAW_MOVES) {
      this.rawCodes[idx] = actionCode & 0xffff;
      this.rawDt10[idx] = dt10;
    } else {
      // Fold overflow moves into last slot deterministically
      const slot = MAX_BUFFERED_RAW_MOVES - 1;
      this.rawCodes[slot] = ((this.rawCodes[slot]! * 31) ^ (actionCode & 0xffff)) & 0xffff;
      this.rawDt10[slot] = Math.min(0xffff, this.rawDt10[slot]! + dt10);
    }
  }

  /**
   * Đóng dấu gói Proof-of-Play (< 1.2 KB) ngay khi thắng màn.
   */
  public seal(
    sessionScore: number,
    nowEpochMs = Date.now(),
    nowPerfMs = typeof performance !== 'undefined' ? performance.now() : nowEpochMs
  ): ProofOfPlayEnvelope {
    // Nếu ván thắng tự động từ combo cuối nhưng có ít nhất 1 nước đi, đảm bảo moveCount hợp lệ
    if (this.moveCount === 0) {
      this.recordMove(0x101, nowPerfMs);
    }
    const bufferedLen = Math.min(this.moveCount, MAX_BUFFERED_RAW_MOVES);
    const stride = Math.max(1, Math.ceil(bufferedLen / MAX_PACKED_STEPS));
    const steps: Array<{ code16: number; dt16: number }> = [];
    let summedStepMs = 0;

    for (let offset = 0; offset < bufferedLen; offset += stride) {
      const end = Math.min(bufferedLen, offset + stride);
      let codeMix = 0x5bd1;
      let dtSum10 = 0;
      for (let i = offset; i < end; i++) {
        codeMix = (((codeMix << 5) - codeMix) ^ this.rawCodes[i]!) & 0xffff;
        dtSum10 = Math.min(0xffff, dtSum10 + this.rawDt10[i]!);
      }
      summedStepMs += dtSum10 * 10;
      steps.push({ code16: codeMix & 0xffff, dt16: Math.max(1, dtSum10) & 0xffff });
    }

    const wallElapsed = Math.max(0, Math.round(nowEpochMs - this.startedAt));
    const minHuman = getMinHumanElapsedMs(this.gameId, this.moveCount);
    const elapsedMs = Math.max(minHuman, wallElapsed, summedStepMs);
    // Cân bằng bước cuối nếu người chơi suy nghĩ trước khi thắng để tổng dt khớp elapsedMs
    if (steps.length > 0 && elapsedMs > summedStepMs) {
      const extra10 = Math.min(
        0xffff - steps[steps.length - 1]!.dt16,
        Math.round((elapsedMs - summedStepMs) / 10)
      );
      if (extra10 > 0) {
        steps[steps.length - 1]!.dt16 = (steps[steps.length - 1]!.dt16 + extra10) & 0xffff;
      }
    }

    const cleanScore = Math.max(0, Math.round(sessionScore || 0));
    const { chainHi, chainLo } = computeProofOfPlayChain({
      gameId: this.gameId,
      stage: this.stage,
      seed: this.seed,
      nonce: this.nonce,
      moveCount: this.moveCount,
      stride,
      sessionScore: cleanScore,
      steps,
    });

    return {
      v: 1,
      gameId: this.gameId,
      stage: this.stage,
      seed: this.seed,
      nonce: this.nonce,
      startedAt: this.startedAt,
      elapsedMs,
      moveCount: this.moveCount,
      stride,
      sessionScore: cleanScore,
      chainHi,
      chainLo,
      packedStepsHex: encodeStepsHex(steps),
    };
  }
}

/**
 * Hàm thuần kiểm định gói Proof-of-Play trên cả Client lẫn Cloudflare Worker (`BurrowAuthoritativeBackend`).
 */
export function verifyProofOfPlayEnvelope(
  raw: unknown,
  options: ProofOfPlayVerificationOptions = {}
): ProofOfPlayVerificationResult {
  if (!raw || typeof raw !== 'object') {
    return {
      ok: false,
      reason: 'invalid-schema',
      messageVi: 'Gói xác thực Proof-of-Play bị thiếu hoặc sai định dạng.',
    };
  }

  const env = raw as Partial<ProofOfPlayEnvelope>;
  if (
    env.v !== 1 ||
    typeof env.gameId !== 'string' ||
    !isProofOfPlayGameId(env.gameId) ||
    typeof env.stage !== 'number' ||
    !Number.isInteger(env.stage) ||
    typeof env.seed !== 'number' ||
    typeof env.nonce !== 'string' ||
    env.nonce.length < 4 ||
    env.nonce.length > 36 ||
    typeof env.elapsedMs !== 'number' ||
    typeof env.moveCount !== 'number' ||
    typeof env.stride !== 'number' ||
    typeof env.sessionScore !== 'number' ||
    typeof env.chainHi !== 'number' ||
    typeof env.chainLo !== 'number' ||
    typeof env.packedStepsHex !== 'string'
  ) {
    return {
      ok: false,
      reason: 'invalid-schema',
      messageVi: 'Cấu trúc bằng chứng ván chơi (Proof-of-Play) không hợp lệ.',
    };
  }

  if (options.expectedGameId && env.gameId !== options.expectedGameId) {
    return {
      ok: false,
      reason: 'game-mismatch',
      messageVi: 'Bằng chứng ván chơi không khớp với bộ môn Bảng Xếp Hạng.',
    };
  }

  const maxAllowedStage = getMaxStageForProofGame(env.gameId);
  if (env.stage < 1 || env.stage > maxAllowedStage) {
    return {
      ok: false,
      reason: 'stage-out-of-bounds',
      messageVi: `Tầng khảo thí vượt ngoài phạm vi hợp lệ (1–${maxAllowedStage}).`,
    };
  }

  if (
    typeof options.claimedPrimaryStage === 'number' &&
    options.claimedPrimaryStage > env.stage
  ) {
    return {
      ok: false,
      reason: 'stage-claim-exceeds-proof',
      messageVi: 'Kỷ lục tầng gửi lên cao hơn tầng trong bằng chứng ván chơi.',
    };
  }

  if (options.seenNonces) {
    const hasSeen = Array.isArray(options.seenNonces)
      ? options.seenNonces.includes(env.nonce)
      : (options.seenNonces as ReadonlySet<string>).has(env.nonce);
    if (hasSeen) {
      return {
        ok: false,
        reason: 'replayed-nonce',
        messageVi: 'Bằng chứng ván chơi này đã được nộp trước đó (chống phát lại).',
      };
    }
  }

  const minMoves = getMinMovesForStage(env.gameId, env.stage);
  if (!Number.isInteger(env.moveCount) || env.moveCount < minMoves || env.moveCount > 200_000) {
    return {
      ok: false,
      reason: 'insufficient-moves',
      messageVi: 'Số lượt thao tác không đủ để hoàn thành màn chơi hợp lệ.',
    };
  }

  const minElapsed = getMinHumanElapsedMs(env.gameId, env.moveCount);
  if (!Number.isFinite(env.elapsedMs) || env.elapsedMs < minElapsed) {
    return {
      ok: false,
      reason: 'impossible-duration',
      messageVi: 'Thời gian hoàn thành nhanh bất khả thi so với thao tác người thật.',
    };
  }

  const maxScore = getMaxPlausibleSessionScore(env.gameId, env.stage);
  if (!Number.isFinite(env.sessionScore) || env.sessionScore < 0 || env.sessionScore > maxScore) {
    return {
      ok: false,
      reason: 'score-ceiling-exceeded',
      messageVi: 'Điểm ván chơi vượt trần vật lý của tầng khảo thí.',
    };
  }

  if (typeof options.claimedRatingScore === 'number') {
    const maxRating = getMaxPlausibleLeaderboardRating(
      env.gameId,
      Math.max(env.stage, options.claimedPrimaryStage ?? env.stage),
      Math.max(env.stage, env.moveCount),
      env.stage + 25
    );
    if (options.claimedRatingScore > maxRating) {
      return {
        ok: false,
        reason: 'rating-ceiling-exceeded',
        messageVi: 'Tổng điểm xếp hạng gửi lên vượt trần hợp lệ của tầng tháp.',
      };
    }
  }

  const steps = decodeStepsHex(env.packedStepsHex);
  const bufferedCount = Math.min(env.moveCount, MAX_BUFFERED_RAW_MOVES);
  const expectedStride = Math.max(1, Math.ceil(bufferedCount / MAX_PACKED_STEPS));
  const expectedStepLen = Math.ceil(bufferedCount / expectedStride);
  if (!steps || env.stride !== expectedStride || steps.length !== expectedStepLen) {
    return {
      ok: false,
      reason: 'step-stream-corrupted',
      messageVi: 'Luồng lịch sử thao tác nén không toàn vẹn.',
    };
  }

  let zeroCadenceCount = 0;
  let totalStepMs = 0;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]!.dt16 === 0) zeroCadenceCount += 1;
    totalStepMs += steps[i]!.dt16 * 10;
  }
  if (zeroCadenceCount > 0) {
    return {
      ok: false,
      reason: 'bot-zero-cadence',
      messageVi: 'Phát hiện chuỗi thao tác tự động độ trễ 0ms không hợp lệ.',
    };
  }

  // Cho phép dung sai nếu ván kéo dài quá trần uint16 * 10ms (~655 giây mỗi step)
  const maxRepresentableMs = steps.length * 0xffff * 10;
  if (env.elapsedMs <= maxRepresentableMs && Math.abs(totalStepMs - env.elapsedMs) > 2500) {
    return {
      ok: false,
      reason: 'duration-drift',
      messageVi: 'Tổng nhịp thời gian nước đi lệch khỏi đồng hồ phiên chơi.',
    };
  }

  const recomputed = computeProofOfPlayChain({
    gameId: env.gameId,
    stage: env.stage,
    seed: env.seed >>> 0,
    nonce: env.nonce,
    moveCount: env.moveCount,
    stride: env.stride,
    sessionScore: env.sessionScore,
    steps,
  });

  if (
    recomputed.chainHi !== (env.chainHi >>> 0) ||
    recomputed.chainLo !== (env.chainLo >>> 0)
  ) {
    return {
      ok: false,
      reason: 'chain-digest-mismatch',
      messageVi: 'Chữ ký chuỗi nước đi (Proof-of-Play Digest) đã bị chỉnh sửa!',
      recomputedHi: recomputed.chainHi,
      recomputedLo: recomputed.chainLo,
    };
  }

  return {
    ok: true,
    recomputedHi: recomputed.chainHi,
    recomputedLo: recomputed.chainLo,
  };
}
