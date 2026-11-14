import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import {
  computeAtlasMetrics,
  getJigsawStageArtworkSpec,
  getJigsawStageSpec,
  JIGSAW_ATLAS_MAX_SIDE,
  JIGSAW_MAX_PIECES,
  JIGSAW_MAX_TIME_SEC,
  JIGSAW_MIN_TIME_SEC,
  JIGSAW_PAINTINGS,
  JIGSAW_PIECE_BOARD,
  JIGSAW_PIECE_LOCKED,
  JIGSAW_PIECE_TRAY,
  MasterJigsawEngine,
  resolveJigsawBoardAspect,
} from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('MasterJigsawEngine & 777 Harry Potter Paintings ("Tranh Ghép Phép Thuật")', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('scales progressively from 3x3 = 9 pieces (150s) to 40x50 = 2000 pieces (max 7200s = 2 hours) with iOS-safe <= 2048x2048 atlas', () => {
    const lv1 = getJigsawStageSpec(1);
    expect(lv1.rows).toBe(3);
    expect(lv1.cols).toBe(3);
    expect(lv1.totalPieces).toBe(9);
    expect(lv1.timeLimitSec).toBe(150);

    const lv777 = getJigsawStageSpec(777);
    expect(lv777.rows).toBe(40);
    expect(lv777.cols).toBe(50);
    expect(lv777.totalPieces).toBe(2000);
    expect(lv777.timeLimitSec).toBe(7200);

    let prevMainPieces = 0;
    let prevMainTime = 0;
    for (let s = 1; s <= 777; s++) {
      const spec = getJigsawStageSpec(s);
      expect(spec.totalPieces).toBe(spec.rows * spec.cols);
      expect(spec.totalPieces).toBeGreaterThanOrEqual(9);
      expect(spec.totalPieces).toBeLessThanOrEqual(JIGSAW_MAX_PIECES);
      expect(spec.timeLimitSec).toBeGreaterThanOrEqual(JIGSAW_MIN_TIME_SEC);
      expect(spec.timeLimitSec).toBeLessThanOrEqual(JIGSAW_MAX_TIME_SEC);

      if (!spec.isBreatherStage) {
        expect(spec.totalPieces).toBeGreaterThanOrEqual(prevMainPieces);
        expect(spec.timeLimitSec).toBeGreaterThanOrEqual(prevMainTime);
        prevMainPieces = spec.totalPieces;
        prevMainTime = spec.timeLimitSec;
      }

      const atlas = computeAtlasMetrics(spec.rows, spec.cols);
      expect(atlas.atlasW).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
      expect(atlas.atlasH).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
      expect(atlas.atlasW * atlas.atlasH).toBeLessThanOrEqual(4194304);
    }
  });

  it('generates 777 distinct Harry Potter artworks across all 777 stages (zero duplicate titles, IDs, or signatures)', () => {
    expect(JIGSAW_PAINTINGS.length).toBeGreaterThanOrEqual(19);

    const ids = new Set<string>();
    const titles = new Set<string>();
    const signatures = new Set<string>();
    const styles = new Set<string>();

    for (let s = 1; s <= 777; s++) {
      const art = getJigsawStageArtworkSpec(s);
      expect(art.stage).toBe(s);
      expect(art.paintingId.length).toBeGreaterThan(3);
      expect(art.titleVi.length).toBeGreaterThan(5);
      ids.add(art.paintingId);
      titles.add(art.titleVi);
      signatures.add(art.signatureKey);
      styles.add(art.artStyle);
    }

    expect(ids.size).toBe(777);
    expect(titles.size).toBe(777);
    expect(signatures.size).toBe(777);
    expect(styles.size).toBe(8);
  });

  it('supports interlocking tabs, Union-Find neighbor cluster merging, smart tray filters, tidy singletons, timer, and Phoenix Talisman', () => {
    const game = new MasterJigsawEngine(16); // 4x5 = 20 pieces, 300s
    expect(game.rows).toBe(4);
    expect(game.cols).toBe(5);
    expect(game.totalPieces).toBe(20);
    expect(game.timeLimitSec).toBe(300);
    expect(game.formatRemainingTime()).toBe('05:00');

    // Verify outer borders are flat (0) and interior shared edges are exact opposites (+1 / -1)
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        const idx = r * game.cols + c;
        const top = game.pieceEdges[idx * 4];
        const right = game.pieceEdges[idx * 4 + 1];
        const bottom = game.pieceEdges[idx * 4 + 2];
        const left = game.pieceEdges[idx * 4 + 3];
        if (r === 0) expect(top).toBe(0);
        if (r === game.rows - 1) expect(bottom).toBe(0);
        if (c === 0) expect(left).toBe(0);
        if (c === game.cols - 1) expect(right).toBe(0);
        if (c + 1 < game.cols) {
          const rightNeighborLeft = game.pieceEdges[(r * game.cols + (c + 1)) * 4 + 3];
          expect(right + rightNeighborLeft).toBe(0);
          expect(Math.abs(right)).toBe(1);
        }
        if (r + 1 < game.rows) {
          const bottomNeighborTop = game.pieceEdges[((r + 1) * game.cols + c) * 4];
          expect(bottom + bottomNeighborTop).toBe(0);
          expect(Math.abs(bottom)).toBe(1);
        }
      }
    }

    // Verify smart tray filters partition the 20 pieces accurately (14 edge pieces on 4x5, 4 quadrants = 20 total)
    expect(game.getTrayCountForFilter('all')).toBe(20);
    expect(game.getTrayCountForFilter('edges')).toBe(14);
    const qSum =
      game.getTrayCountForFilter('q0') +
      game.getTrayCountForFilter('q1') +
      game.getTrayCountForFilter('q2') +
      game.getTrayCountForFilter('q3');
    expect(qSum).toBe(20);

    // Spawn piece 0 (0,0) and piece 1 (0,1) displaced by exact same delta (+0.35, +0.35) -> merges into 2-piece cluster!
    const t0 = game.getTargetNormCenter(0);
    const t1 = game.getTargetNormCenter(1);
    expect(game.spawnTrayPieceOntoBoard(0, t0.nx + 0.35, t0.ny + 0.35)).toBe(true);
    expect(game.dropClusterAndResolve(0, 600, 480).lockedPieces).toHaveLength(0);

    expect(game.spawnTrayPieceOntoBoard(1, t1.nx + 0.35, t1.ny + 0.35)).toBe(true);
    const mergeDrop = game.dropClusterAndResolve(1, 600, 480);
    expect(mergeDrop.mergedWithNeighbor).toBe(true);
    expect(mergeDrop.clusterSize).toBe(2);
    expect(game.findClusterRoot(0)).toBe(game.findClusterRoot(1));

    // Also drop a loose single piece 19 far from frame; tidyLooseSinglePieces returns piece 19 but keeps cluster {0,1}!
    expect(game.spawnTrayPieceOntoBoard(19, 0.25, 0.25)).toBe(true);
    expect(game.tidyLooseSinglePieces()).toBe(1);
    expect(game.pieceState[19]).toBe(JIGSAW_PIECE_TRAY);
    expect(game.pieceState[0]).toBe(JIGSAW_PIECE_BOARD);
    expect(game.pieceState[1]).toBe(JIGSAW_PIECE_BOARD);

    // Move the merged cluster {0, 1} onto piece 0's target frame -> both pieces lock simultaneously!
    game.movePieceClusterToNorm(0, t0.nx, t0.ny);
    const lockDrop = game.dropClusterAndResolve(0, 600, 480);
    expect(lockDrop.lockedPieces.sort((a, b) => a - b)).toEqual([0, 1]);
    expect(game.lockedCount).toBe(2);
    expect(game.pieceState[0]).toBe(JIGSAW_PIECE_LOCKED);
    expect(game.pieceState[1]).toBe(JIGSAW_PIECE_LOCKED);

    // Timeout & Phoenix Talisman revival
    const tickOut = game.tickTimer(500);
    expect(tickOut.timedOut).toBe(true);
    expect(game.status).toBe('lost');
    expect(game.lossReason).toBe('timeout');

    const talisman = game.applyPhoenixTalisman();
    expect(talisman.ok).toBe(true);
    expect(game.status).toBe('playing');
    expect(game.timeRemainingSec).toBeGreaterThanOrEqual(180);
    expect(game.timeRemainingSec).toBeLessThanOrEqual(JIGSAW_MAX_TIME_SEC);
    expect(game.applyPhoenixTalisman().ok).toBe(false); // Strictly 1 talisman per attempt

    // Complete remaining pieces with Magic Hint / direct frame drops
    const pieBoost = game.applyApplePieBoost();
    expect(pieBoost.lockedPieces.length).toBeGreaterThanOrEqual(1);

    for (let idx = 0; idx < game.totalPieces; idx++) {
      if (game.pieceState[idx] === JIGSAW_PIECE_LOCKED) continue;
      const tc = game.getTargetNormCenter(idx);
      if (game.pieceState[idx] === JIGSAW_PIECE_TRAY) {
        game.spawnTrayPieceOntoBoard(idx, tc.nx, tc.ny);
      } else {
        game.movePieceClusterToNorm(idx, tc.nx, tc.ny);
      }
      game.dropClusterAndResolve(idx, 600, 480);
    }

    expect(game.status).toBe('won');
    expect(game.lockedCount).toBe(20);
    expect(game.remainingPieces).toBe(0);
    expect(game.getTurningPointReview()?.mode).toBe('jigsaw');
  });

  it('persists compact (< 1.8 KB) 2000-piece Stage 777 sessions and integrates with ParkSimulation & Leaderboard', () => {
    const grandmaster = new MasterJigsawEngine(777);
    expect(grandmaster.totalPieces).toBe(2000);
    expect(grandmaster.formatRemainingTime()).toBe('02:00:00');

    // Lock 120 pieces + create a loose 2-piece cluster on board
    for (let i = 0; i < 120; i++) {
      const tc = grandmaster.getTargetNormCenter(i);
      grandmaster.spawnTrayPieceOntoBoard(i, tc.nx, tc.ny);
      grandmaster.dropClusterAndResolve(i, 900, 720);
    }
    const pA = 500;
    const pB = 501;
    const tA = grandmaster.getTargetNormCenter(pA);
    const tB = grandmaster.getTargetNormCenter(pB);
    grandmaster.spawnTrayPieceOntoBoard(pA, tA.nx + 0.15, tA.ny + 0.15);
    grandmaster.spawnTrayPieceOntoBoard(pB, tB.nx + 0.15, tB.ny + 0.15);
    grandmaster.dropClusterAndResolve(pB, 900, 720);
    grandmaster.tickTimer(425); // 01:52:55 remaining

    const exported = grandmaster.exportSession({ companionCharge: 3, snackPieUsed: true });
    const serialized = JSON.stringify(exported);
    expect(serialized.length).toBeLessThan(1800);

    const restored = new MasterJigsawEngine(777);
    expect(restored.restoreSession(exported)).toBe(true);
    expect(restored.lockedCount).toBe(120);
    expect(restored.findClusterRoot(pA)).toBe(restored.findClusterRoot(pB));
    expect(Math.round(restored.timeRemainingSec)).toBe(7200 - 425);

    // ParkSimulation Stage 777 session save/load round-trip + Stage 1 victory & scored leaderboard integration
    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.puzzleArcade.jigsawStage = 777;
    sim.state.puzzleArcade.jigsawCleared = 776;
    sim.state.puzzleArcade.jigsawSession = exported;
    sim.saveToStorage();

    const reloadedSim = new ParkSimulation(new MagicalAudio());
    expect(reloadedSim.loadFromStorage()).toBeTruthy();
    expect(reloadedSim.state.puzzleArcade.jigsawStage).toBe(777);
    expect(reloadedSim.state.puzzleArcade.jigsawSession?.placedBitsetB64).toBe(
      exported.placedBitsetB64
    );
    expect(reloadedSim.state.puzzleArcade.jigsawSession?.looseClusters).toHaveLength(1);

    storageMap.clear();
    const freshSim = new ParkSimulation(new MagicalAudio());
    const lv1Art = getJigsawStageArtworkSpec(1);
    const winSummary = freshSim.completePuzzleArcadeVictory(
      'jigsaw',
      { stars: 2, sand: 1, gold: 125, xp: 40, paintingId: lv1Art.paintingId },
      { sessionScore: 3450, efficiency: 5 }
    );
    expect(winSummary.nextStage).toBe(2);
    expect(freshSim.state.puzzleArcade.jigsawStage).toBe(2);
    expect(freshSim.state.puzzleArcade.jigsawCleared).toBe(1);
    expect(freshSim.state.puzzleArcade.restoredPaintings).toContain(lv1Art.paintingId);
    expect(winSummary.leaderboardRankUp?.gameId).toBe('jigsaw');
    expect(
      freshSim.ensureMinigameLeaderboard().records.jigsaw.bestSessionScore
    ).toBe(3450);
  });

  it('maximizes Jigsaw board aspect ratio across widescreen landscape and mobile portrait while keeping atlas <= 2048x2048', () => {
    // Stage 1 (3x3) expands from cramped 1:1 square to wide ~1.70 panoramic canvas on desktop landscape
    const wideLv1Aspect = resolveJigsawBoardAspect(3, 3, 1180, 690);
    expect(wideLv1Aspect).toBeGreaterThanOrEqual(1.65);
    expect(wideLv1Aspect).toBeLessThanOrEqual(1.75);

    // Stage 1 (3x3) adapts tall (~0.75-0.80) on mobile portrait to fill vertical screen space
    const tallLv1Aspect = resolveJigsawBoardAspect(3, 3, 368, 472);
    expect(tallLv1Aspect).toBeGreaterThanOrEqual(0.75);
    expect(tallLv1Aspect).toBeLessThanOrEqual(0.85);

    // Verify iOS <= 2048x2048 atlas safety across all 777 stages in both landscape and portrait aspects
    for (const s of [1, 16, 100, 350, 600, 777]) {
      const spec = getJigsawStageSpec(s);
      for (const [aw, ah] of [
        [1200, 700],
        [370, 480],
      ] as const) {
        const aspect = resolveJigsawBoardAspect(spec.rows, spec.cols, aw, ah);
        const atlas = computeAtlasMetrics(spec.rows, spec.cols, aspect);
        expect(atlas.atlasW).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
        expect(atlas.atlasH).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
        expect(atlas.atlasW * atlas.atlasH).toBeLessThanOrEqual(4194304);
      }
    }
  });
});
