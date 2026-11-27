import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCandyLevelById } from '../../data/candyHogwartsLevels';
import { MAX_LEVEL, TOTAL_WINS_FOR_MAX_LEVEL } from '../../data/levels';
import {
  getMatch3LevelDef,
  getMaxStageForDiscipline,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
  isMilestoneBossStage,
  MATCH3_ASCENSION_MILESTONE_STAGES,
  MAX_MATCH3_STAGE,
  MAX_MINIGAME_STAGE,
  MILESTONE_BOSS_STAGES,
  TOTAL_MINIGAME_STAGES,
} from '../../data/match3Levels';
import { STORY_QUESTS } from '../../data/quests';
import { MagicalAudio } from '../../engine/audio';
import { CandyHogwartsEngine } from '../candyHogwartsEngine';
import { Match3BoardEngine } from '../match3Engine';
import {
  clearCachedCloudLeaderboards,
  MAX_PUZZLE_TOWER_STAGE,
  SCORED_LEADERBOARD_GAMES,
} from '../minigameLeaderboard';
import {
  getMaxStageForProofGame,
  ProofOfPlayGameId,
  ProofOfPlayRecorder,
  verifyProofOfPlayEnvelope,
} from '../proofOfPlay';
import {
  CaroGameEngine,
  computeAtlasMetrics,
  CreatureOnetEngine,
  FishShooterEngine,
  getJigsawStageArtworkSpec,
  getJigsawStageSpec,
  JIGSAW_ATLAS_MAX_SIDE,
  JIGSAW_MAX_PIECES,
  JIGSAW_MAX_TIME_SEC,
  JigsawPuzzleEngine,
  MasterJigsawEngine,
  MinesweeperEngine,
  RunicBlockPuzzleEngine,
  sanitizeSavedFishShooterSession,
  sanitizeSavedJigsawSession,
  sanitizeSavedMinesweeperSession,
  SudokuPuzzleEngine,
  TileMatchZenEngine,
  WizardChessEngine,
} from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';

const SAVE_KEY = 'burrow_hogsmeade_777_v3';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

const SAMPLE_STAGES = [1, 25, 150, 777, 778, 1500, 4444, 7777] as const;
const ALL_POP_GAMES: readonly ProofOfPlayGameId[] = [
  'match3',
  'caro',
  'sudoku',
  'chess',
  'blocks',
  'jigsaw',
];

function createValidPopEnvelope(gameId: ProofOfPlayGameId, stage: number, sessionScore: number) {
  const startEpoch = 1_760_000_000_000;
  let perfCursor = 1000;
  const recorder = new ProofOfPlayRecorder(gameId, stage, stage * 131 + 7, startEpoch, perfCursor);
  for (let i = 0; i < 12; i++) {
    perfCursor += 550 + (i % 4) * 90;
    recorder.recordMove(((i & 15) << 8) | ((i + 3) & 15), perfCursor);
  }
  return recorder.seal(sessionScore, startEpoch + 12_000, perfCursor + 400);
}

describe('All Minigames 777 → 7777 Stage Cap Upgrade & Legacy Progress Preservation', () => {
  beforeEach(() => {
    storageMap.clear();
    clearCachedCloudLeaderboards();
  });

  describe('1. Shared Constants, Farm Cap & Legacy 1..777 Economy Invariants', () => {
    it('exports unified 7777 caps across all 6 tower disciplines while keeping farm MAX_LEVEL = 100', () => {
      expect(MAX_MINIGAME_STAGE).toBe(7777);
      expect(MAX_MATCH3_STAGE).toBe(7777);
      expect(MAX_PUZZLE_TOWER_STAGE).toBe(7777);
      expect(TOTAL_MINIGAME_STAGES).toBe(7777 * 6);
      expect(TOTAL_MINIGAME_STAGES).toBe(46_662);

      for (const gid of SCORED_LEADERBOARD_GAMES) {
        expect(getMaxStageForDiscipline(gid)).toBe(7777);
      }

      // Farm/estate progression caps stay completely untouched
      expect(MAX_LEVEL).toBe(100);
      expect(TOTAL_WINS_FOR_MAX_LEVEL).toBe(3435);
    });

    it('preserves exact legacy 1,455-star economy across stages 1..777 and clean Ascension curve for 778..7777', () => {
      let sumLegacy = 0;
      for (let s = 1; s <= 777; s++) {
        const reward = getStageStarReward(s);
        expect(Number.isFinite(reward)).toBe(true);
        expect(reward).toBeGreaterThanOrEqual(1);
        sumLegacy += reward;
      }
      expect(sumLegacy).toBe(1455);
      expect(getStageStarReward(777)).toBe(6);

      // Ascension stages 778..7777
      expect(getStageStarReward(778)).toBe(2);
      expect(getStageStarReward(1000)).toBe(6);
      expect(getStageStarReward(4444)).toBe(6);
      expect(getStageStarReward(7777)).toBe(8);

      // Both legacy & Ascension milestone bosses recognized
      expect(MILESTONE_BOSS_STAGES).toEqual([25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 777]);
      for (const bossStage of [...MILESTONE_BOSS_STAGES, ...MATCH3_ASCENSION_MILESTONE_STAGES]) {
        expect(isMilestoneBossStage(bossStage)).toBe(true);
        const meta = getMilestoneBossMeta(bossStage);
        expect(meta).not.toBeNull();
        expect(meta!.stage).toBe(bossStage);
        expect(meta!.bossTitleVi.length).toBeGreaterThan(4);
      }

      for (const s of SAMPLE_STAGES) {
        const tier = getMinigameDifficultyTier(s);
        expect(tier.tierIndex).toBeGreaterThanOrEqual(1);
        expect(tier.tierIndex).toBeLessThanOrEqual(7);
        expect(tier.label.length).toBeGreaterThan(2);
      }
    });
  });

  describe('2. All Minigame Engines Playable Across 1, 25, 150, 777, 778, 1500, 4444, 7777', () => {
    it('initializes match3 (CandyHogwartsEngine & legacy Match3BoardEngine) cleanly across all sample stages', () => {
      for (const stage of SAMPLE_STAGES) {
        const candyDef = getCandyLevelById(stage);
        expect(candyDef.id).toBe(stage);
        expect(candyDef.size).toBeGreaterThanOrEqual(7);
        expect(candyDef.size).toBeLessThanOrEqual(10);
        expect(candyDef.moves).toBeGreaterThanOrEqual(10);
        expect(Number.isFinite(candyDef.starReward)).toBe(true);

        const candyEngine = new CandyHogwartsEngine(null);
        candyEngine.loadLevel(candyDef, { house: 'gryffindor', instantAnimations: true });
        const snap = candyEngine.getHudSnapshot();
        expect(snap).not.toBeNull();
        expect(snap!.level.id).toBe(stage);
        expect(snap!.movesLeft).toBeGreaterThanOrEqual(10);
        expect(Number.isFinite(snap!.score)).toBe(true);
        candyEngine.destroy();

        const legacyDef = getMatch3LevelDef(stage);
        expect(legacyDef.level).toBe(stage);
        expect(legacyDef.moves).toBeGreaterThanOrEqual(10);
        const board = new Match3BoardEngine(legacyDef);
        expect(board.levelDef.level).toBe(stage);
        expect(board.movesLeft).toBeGreaterThanOrEqual(10);
      }
    });

    it('initializes MinesweeperEngine with safe 3x3 opening & <= 25% mine density up to 7777', () => {
      for (const stage of SAMPLE_STAGES) {
        const me = new MinesweeperEngine(stage);
        expect(me.stage).toBe(stage);
        expect(me.rows).toBeGreaterThanOrEqual(8);
        expect(me.cols).toBeGreaterThanOrEqual(8);
        expect(me.totalMines).toBeGreaterThan(0);
        expect(me.totalMines).toBeLessThan(me.rows * me.cols - 9);
        expect(me.totalMines / (me.rows * me.cols)).toBeLessThanOrEqual(0.26);
        expect(Number.isFinite(me.reward.stars)).toBe(true);
        expect(Number.isFinite(me.reward.gold)).toBe(true);

        // Safe first tap guarantees non-mine opening cascade
        const tap = me.tapCell(Math.floor(me.rows / 2), Math.floor(me.cols / 2));
        expect(tap.action).toBe('revealed');
        expect(tap.lost).toBe(false);
        expect(tap.shieldSaved).toBe(false);
        expect(tap.revealedCells.length).toBeGreaterThanOrEqual(1);
        expect(me.status).not.toBe('lost');

        const exported = me.exportSession();
        expect(sanitizeSavedMinesweeperSession(exported, stage)).not.toBeNull();
      }
      // Verify 7777 finale awards bonus sand
      expect(new MinesweeperEngine(7777).reward.sand).toBe(5);
    });

    it('initializes SudokuPuzzleEngine with valid 9x9 unique solutions & sane clue floors up to 7777', () => {
      for (const stage of SAMPLE_STAGES) {
        const se = new SudokuPuzzleEngine(stage);
        expect(se.stage).toBe(stage);
        let blanks = 0;
        for (let r = 0; r < 9; r++) {
          const rowDigits = new Set<number>();
          for (let c = 0; c < 9; c++) {
            const solVal = se.solution[r][c];
            expect(solVal).toBeGreaterThanOrEqual(1);
            expect(solVal).toBeLessThanOrEqual(9);
            rowDigits.add(solVal);
            if (se.grid[r][c] === 0) blanks++;
            else expect(se.grid[r][c]).toBe(solVal);
          }
          expect(rowDigits.size).toBe(9);
        }
        expect(blanks).toBeGreaterThan(0);
        expect(blanks).toBeLessThanOrEqual(59); // >= 22 clues guaranteed
        expect(Number.isFinite(se.reward.stars)).toBe(true);
        expect(Number.isFinite(se.reward.gold)).toBe(true);
      }
    });

    it('initializes FishShooterEngine with playable targets, finite fish physics & valid missions up to 7777', () => {
      for (const stage of SAMPLE_STAGES) {
        const fe = new FishShooterEngine(stage);
        expect(fe.stage).toBe(stage);
        expect(Number.isFinite(fe.targetScore)).toBe(true);
        expect(fe.targetScore).toBeGreaterThan(10_000);
        expect(fe.targetScore).toBeLessThanOrEqual(300_000);
        expect(fe.timeLimitSec).toBe(180);
        expect(fe.missions.length).toBeGreaterThanOrEqual(1);
        expect(fe.missions.length).toBeLessThanOrEqual(3);
        for (const m of fe.missions) {
          expect(m.target).toBeGreaterThan(0);
        }

        fe.tick(0.1);
        expect(fe.fishList.length).toBeGreaterThan(0);
        for (const f of fe.fishList) {
          expect(Number.isFinite(f.x)).toBe(true);
          expect(Number.isFinite(f.y)).toBe(true);
          expect(f.maxHp).toBeGreaterThan(0);
          expect(f.points).toBeGreaterThan(0);
        }

        const saved = fe.exportSession();
        expect(sanitizeSavedFishShooterSession(saved, stage)).not.toBeNull();
      }
      expect(new FishShooterEngine(7777).reward.sand).toBe(5);
    });

    it('initializes CreatureOnetEngine with even solvable boards & finite timers up to 7777', () => {
      for (const stage of SAMPLE_STAGES) {
        const oe = new CreatureOnetEngine(stage);
        expect(oe.stage).toBe(stage);
        expect((oe.rows * oe.cols) % 2).toBe(0);
        expect(oe.totalPairs).toBe((oe.rows * oe.cols) / 2);
        expect(oe.findAnyValidPair()).not.toBeNull();
        expect(Number.isFinite(oe.timeLimitSec)).toBe(true);
        expect(oe.timeLimitSec).toBeGreaterThan(0);
        expect(Number.isFinite(oe.reward.stars)).toBe(true);
      }
    });

    it('initializes MasterJigsawEngine with iOS-safe <=2048px atlas, unique artworks across all 1..7777 & compact sessions', () => {
      for (const stage of SAMPLE_STAGES) {
        const spec = getJigsawStageSpec(stage);
        expect(spec.totalPieces).toBe(spec.rows * spec.cols);
        expect(spec.totalPieces).toBeGreaterThanOrEqual(9);
        expect(spec.totalPieces).toBeLessThanOrEqual(JIGSAW_MAX_PIECES);
        expect(spec.timeLimitSec).toBeGreaterThanOrEqual(150);
        expect(spec.timeLimitSec).toBeLessThanOrEqual(JIGSAW_MAX_TIME_SEC);

        const atlas = computeAtlasMetrics(spec.rows, spec.cols);
        expect(atlas.atlasW).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);
        expect(atlas.atlasH).toBeLessThanOrEqual(JIGSAW_ATLAS_MAX_SIDE);

        const je = new MasterJigsawEngine(stage);
        expect(je.stage).toBe(stage);
        expect(je.totalPieces).toBe(spec.totalPieces);
        expect(je.artwork.stage).toBe(stage);
        expect(Number.isFinite(je.reward.stars)).toBe(true);

        const exported = je.exportSession();
        expect(sanitizeSavedJigsawSession(exported, stage)).not.toBeNull();
      }

      // Verify 7,777 distinct artworks (zero duplicate IDs, titles, or signatures) across ALL 1..7777 stages
      const ids = new Set<string>();
      const titles = new Set<string>();
      const signatures = new Set<string>();
      for (let s = 1; s <= MAX_MINIGAME_STAGE; s++) {
        const art = getJigsawStageArtworkSpec(s);
        expect(art.stage).toBe(s);
        ids.add(art.paintingId);
        titles.add(art.titleVi);
        signatures.add(art.signatureKey);
      }
      expect(ids.size).toBe(7777);
      expect(titles.size).toBe(7777);
      expect(signatures.size).toBe(7777);
    });

    it('initializes CaroGameEngine, WizardChessEngine, and RunicBlockPuzzleEngine (+ legacy blocks helpers) cleanly up to 7777', () => {
      for (const stage of SAMPLE_STAGES) {
        // Caro: 13x13 board, center 3x3 never blocked by rune seals (stone === 3), playable human move
        const caro = new CaroGameEngine(stage);
        expect(caro.stage).toBe(stage);
        expect(caro.grid.length).toBe(13);
        let playableCell: { r: number; c: number } | null = null;
        for (let r = 5; r <= 7; r++) {
          for (let c = 5; c <= 7; c++) {
            expect(caro.grid[r][c]).not.toBe(3); // never sealed in center 3x3
            if (caro.grid[r][c] === 0 && !playableCell) playableCell = { r, c };
          }
        }
        expect(playableCell).not.toBeNull();
        expect(Number.isFinite(caro.reward.stars)).toBe(true);
        expect(caro.playHumanMove(playableCell!.r, playableCell!.c).ok).toBe(true);

        // Chess
        const chess = new WizardChessEngine(stage);
        expect(chess.stage).toBe(stage);
        let whiteKing = false;
        let blackKing = false;
        let hasLegalMove = false;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = chess.board[r][c];
            if (!p) continue;
            if (p.type === 'k' && p.color === 'w') whiteKing = true;
            if (p.type === 'k' && p.color === 'b') blackKing = true;
            if (p.color === chess.turn && chess.getLegalMovesFrom(r, c).length > 0) {
              hasLegalMove = true;
            }
          }
        }
        expect(whiteKing).toBe(true);
        expect(blackKing).toBe(true);
        expect(hasLegalMove).toBe(true);
        expect(Number.isFinite(chess.reward.stars)).toBe(true);

        // Blocks (Tangram / Runic)
        const blocks = new RunicBlockPuzzleEngine(stage);
        expect(blocks.stage).toBe(stage);
        expect(blocks.grid.length).toBe(8);
        expect(blocks.pieces.length).toBeGreaterThan(0);
        expect(Number.isFinite(blocks.reward.stars)).toBe(true);
        expect(Number.isFinite(blocks.reward.gold)).toBe(true);
      }

      // Also sanity-check legacy helper engines in blocksEngine.ts at high Ascension stages
      for (const stage of [1, 777, 778, 7777] as const) {
        const legacyJigsaw = new JigsawPuzzleEngine(stage);
        expect(legacyJigsaw.stage).toBe(stage);
        expect(legacyJigsaw.pieces.length).toBeGreaterThan(0);

        const zen = new TileMatchZenEngine(stage);
        expect(zen.stage).toBe(stage);
        expect(zen.tiles.length).toBeGreaterThan(0);
      }
    });
  });

  describe('3. Existing Player Progress Preservation ("các mốc người chơi đang chơi giữ nguyên ko đụng")', () => {
    it('loads an existing v3 save verbatim (zero resets, zero jumps) across mixed mid-stages & legacy 777-capped stages', () => {
      // Seed a baseline v3 save and craft realistic mixed player progress
      const seedSim = new ParkSimulation(new MagicalAudio());
      const raw = JSON.parse(seedSim.exportSaveJson()) as Record<string, unknown>;
      const claimedStoryIds = STORY_QUESTS.slice(0, 5).map((q) => q.id);

      raw.level = 34;
      raw.galleons = 4321;
      raw.timeSand = 27;
      raw.storyQuestIndex = claimedStoryIds.length;
      raw.storyClaimedIds = claimedStoryIds;

      const stats = raw.stats as Record<string, unknown>;
      stats.minigamesWon = 2000;

      const m3 = raw.match3 as Record<string, unknown>;
      m3.stars = 900;
      m3.totalStarsEarned = 1250;
      m3.currentLevel = 12;
      m3.maxClearedLevel = 11;
      m3.levelsWon = 11;

      const pa = raw.puzzleArcade as Record<string, unknown>;
      pa.arcadeDisciplineRev = 2;
      pa.caroStage = 45;
      pa.caroCleared = 44;
      pa.sudokuStage = 300;
      pa.sudokuCleared = 299;
      pa.chessStage = 777;
      pa.chessCleared = 777; // Legacy 777-capped player!
      pa.blockStage = 128;
      pa.blockCleared = 127;
      pa.jigsawStage = 777;
      pa.jigsawCleared = 777; // Legacy 777-capped player!
      pa.totalPuzzlesSolved = 2000;

      // Claimed achievements / retention milestones
      const retention = raw.retention as Record<string, unknown>;
      retention.achievements = {
        ach_19: { unlockedAt: 1000, claimedAt: 2000, notifiedAt: 1000 },
        ach_20: { unlockedAt: 3000, claimedAt: 4000, notifiedAt: 3000 },
      };

      // Existing leaderboard records
      raw.minigameLeaderboard = {
        records: {
          match3: { bestStage: 11, highScore: 15000, totalWins: 11, bestStreak: 4, bestSessionScore: 4200, updatedAt: 1000 },
          caro: { bestStage: 44, highScore: 22000, totalWins: 44, bestStreak: 6, bestSessionScore: 5200, updatedAt: 1000 },
          sudoku: { bestStage: 299, highScore: 88000, totalWins: 299, bestStreak: 9, bestSessionScore: 7100, updatedAt: 1000 },
          chess: { bestStage: 777, highScore: 195000, totalWins: 777, bestStreak: 12, bestSessionScore: 160000, updatedAt: 1000 },
          blocks: { bestStage: 127, highScore: 41000, totalWins: 127, bestStreak: 7, bestSessionScore: 9500, updatedAt: 1000 },
          jigsaw: { bestStage: 777, highScore: 210000, totalWins: 777, bestStreak: 11, bestSessionScore: 14000, updatedAt: 1000 },
        },
        weekly: {},
      };

      mockLocalStorage.setItem(SAVE_KEY, JSON.stringify(raw));

      const loaded = new ParkSimulation(new MagicalAudio());

      // Farm progress & currencies preserved verbatim
      expect(loaded.state.level).toBe(34);
      expect(loaded.state.match3.stars).toBe(900);
      expect(loaded.state.match3.totalStarsEarned).toBe(1250);
      expect(loaded.state.galleons).toBe(4321);
      expect(loaded.state.timeSand).toBe(27);
      expect(loaded.state.storyQuestIndex).toBe(claimedStoryIds.length);
      expect(loaded.state.storyClaimedIds).toEqual(claimedStoryIds);
      expect(loaded.state.retention?.achievements.ach_19?.claimedAt).toBe(2000);
      expect(loaded.state.retention?.achievements.ach_20?.claimedAt).toBe(4000);

      // Every minigame stage & cleared counter preserved verbatim (zero resets, zero jumps!)
      expect(loaded.state.match3.currentLevel).toBe(12);
      expect(loaded.state.match3.maxClearedLevel).toBe(11);
      expect(loaded.state.puzzleArcade.caroStage).toBe(45);
      expect(loaded.state.puzzleArcade.caroCleared).toBe(44);
      expect(loaded.state.puzzleArcade.sudokuStage).toBe(300);
      expect(loaded.state.puzzleArcade.sudokuCleared).toBe(299);
      expect(loaded.state.puzzleArcade.chessStage).toBe(777);
      expect(loaded.state.puzzleArcade.chessCleared).toBe(777);
      expect(loaded.state.puzzleArcade.blockStage).toBe(128);
      expect(loaded.state.puzzleArcade.blockCleared).toBe(127);
      expect(loaded.state.puzzleArcade.jigsawStage).toBe(777);
      expect(loaded.state.puzzleArcade.jigsawCleared).toBe(777);

      // Legacy 777-capped games are no longer maxed (777 < 7777)
      expect(loaded.getDisciplineStageInfo('chess')).toEqual({
        currentStage: 777,
        clearedStages: 777,
        maxStage: 7777,
        isMaxed: false,
      });
      expect(loaded.getDisciplineStageInfo('jigsaw')).toEqual({
        currentStage: 777,
        clearedStages: 777,
        maxStage: 7777,
        isMaxed: false,
      });

      // Leaderboard bestStage preserved verbatim across all 6 disciplines
      const lb = loaded.ensureMinigameLeaderboard();
      expect(lb.records.match3.bestStage).toBe(11);
      expect(lb.records.caro.bestStage).toBe(44);
      expect(lb.records.sudoku.bestStage).toBe(299);
      expect(lb.records.chess.bestStage).toBe(777);
      expect(lb.records.blocks.bestStage).toBe(127);
      expect(lb.records.jigsaw.bestStage).toBe(777);
    });

    it('lets a legacy 777/777 capped player retain 777 on load and advance cleanly to 778 → 779 on win across both Match-3 and Puzzle Arcade', () => {
      const seedSim = new ParkSimulation(new MagicalAudio());
      const raw = JSON.parse(seedSim.exportSaveJson()) as Record<string, unknown>;
      (raw.stats as Record<string, unknown>).minigamesWon = 1554;
      const m3 = raw.match3 as Record<string, unknown>;
      m3.currentLevel = 777;
      m3.maxClearedLevel = 777;
      m3.levelsWon = 777;
      const pa = raw.puzzleArcade as Record<string, unknown>;
      pa.arcadeDisciplineRev = 2;
      pa.sudokuStage = 777;
      pa.sudokuCleared = 777;
      pa.jigsawStage = 777;
      pa.jigsawCleared = 777;
      pa.totalPuzzlesSolved = 1554;
      mockLocalStorage.setItem(SAVE_KEY, JSON.stringify(raw));

      const sim = new ParkSimulation(new MagicalAudio());

      // Immediately after load: retained at 777 verbatim
      expect(sim.state.match3.currentLevel).toBe(777);
      expect(sim.state.match3.maxClearedLevel).toBe(777);
      expect(sim.state.puzzleArcade.sudokuStage).toBe(777);
      expect(sim.state.puzzleArcade.sudokuCleared).toBe(777);
      expect(sim.state.puzzleArcade.jigsawStage).toBe(777);
      expect(sim.state.puzzleArcade.jigsawCleared).toBe(777);

      // Winning Stage 777 advances cleanly to 778 (never stuck at 777!)
      const m3Win777 = sim.completeMatch3LevelVictory(10, { sessionScore: 80000, completedStage: 777 });
      expect(m3Win777.nextLevel).toBe(778);
      expect(sim.state.match3.currentLevel).toBe(778);
      expect(sim.state.match3.maxClearedLevel).toBe(777);
      expect(sim.getDisciplineStageInfo('match3').isMaxed).toBe(false);

      const m3Win778 = sim.completeMatch3LevelVictory(12, { sessionScore: 92000, completedStage: 778 });
      expect(m3Win778.nextLevel).toBe(779);
      expect(m3Win778.starsEarned).toBeGreaterThanOrEqual(2);
      expect(sim.state.match3.currentLevel).toBe(779);
      expect(sim.state.match3.maxClearedLevel).toBe(778);

      const sudWin777 = sim.completePuzzleArcadeVictory(
        'sudoku',
        new SudokuPuzzleEngine(777).reward,
        { sessionScore: 15000, efficiency: 0, completedStage: 777 }
      );
      expect(sudWin777.nextStage).toBe(778);
      expect(sim.state.puzzleArcade.sudokuStage).toBe(778);
      expect(sim.state.puzzleArcade.sudokuCleared).toBe(777);
      expect(sim.getDisciplineStageInfo('sudoku').isMaxed).toBe(false);

      const sudWin778 = sim.completePuzzleArcadeVictory(
        'sudoku',
        new SudokuPuzzleEngine(778).reward,
        { sessionScore: 16500, efficiency: 0, completedStage: 778 }
      );
      expect(sudWin778.nextStage).toBe(779);
      expect(sudWin778.starsEarned).toBeGreaterThanOrEqual(2);
      expect(sim.state.puzzleArcade.sudokuStage).toBe(779);
      expect(sim.state.puzzleArcade.sudokuCleared).toBe(778);
      expect(sim.ensureMinigameLeaderboard().records.sudoku.bestStage).toBe(778);

      // Reaching 7777 finale cleanly sets isMaxed and leaderboard crown
      sim.state.puzzleArcade.jigsawStage = 7777;
      sim.state.puzzleArcade.jigsawCleared = 7776;
      const jigWin7777 = sim.completePuzzleArcadeVictory(
        'jigsaw',
        new MasterJigsawEngine(7777).reward,
        { sessionScore: 28000, efficiency: 12, completedStage: 7777 }
      );
      expect(jigWin7777.starsEarned).toBeGreaterThanOrEqual(8);
      expect(sim.state.puzzleArcade.jigsawCleared).toBe(7777);
      expect(sim.getDisciplineStageInfo('jigsaw').isMaxed).toBe(true);
      const jigLb = sim.getMinigameLeaderboard('jigsaw', 'valley');
      expect(jigLb.playerEntry.allTimeBestStage).toBe(7777);
      expect(jigLb.playerEntry.allTimeStageDisplayVi).toBe('👑 7777/7777');
    });

    it('round-trips a maxed 7777/7777 save across all 6 disciplines while preserving farm MAX_LEVEL = 100 and leaderboard crowns', () => {
      const seedSim = new ParkSimulation(new MagicalAudio());
      const raw = JSON.parse(seedSim.exportSaveJson()) as Record<string, unknown>;
      raw.level = MAX_LEVEL;
      (raw.stats as Record<string, unknown>).minigamesWon = TOTAL_MINIGAME_STAGES;

      const m3 = raw.match3 as Record<string, unknown>;
      m3.currentLevel = MAX_MATCH3_STAGE;
      m3.maxClearedLevel = MAX_MATCH3_STAGE;
      m3.levelsWon = MAX_MATCH3_STAGE;

      const pa = raw.puzzleArcade as Record<string, unknown>;
      pa.arcadeDisciplineRev = 2;
      pa.caroStage = MAX_MINIGAME_STAGE;
      pa.caroCleared = MAX_MINIGAME_STAGE;
      pa.sudokuStage = MAX_MINIGAME_STAGE;
      pa.sudokuCleared = MAX_MINIGAME_STAGE;
      pa.chessStage = MAX_MINIGAME_STAGE;
      pa.chessCleared = MAX_MINIGAME_STAGE;
      pa.blockStage = MAX_MINIGAME_STAGE;
      pa.blockCleared = MAX_MINIGAME_STAGE;
      pa.jigsawStage = MAX_MINIGAME_STAGE;
      pa.jigsawCleared = MAX_MINIGAME_STAGE;
      pa.totalPuzzlesSolved = TOTAL_MINIGAME_STAGES;

      mockLocalStorage.setItem(SAVE_KEY, JSON.stringify(raw));

      const maxedSim = new ParkSimulation(new MagicalAudio());
      expect(maxedSim.state.level).toBe(100);
      for (const gid of ALL_POP_GAMES) {
        const info = maxedSim.getDisciplineStageInfo(gid);
        expect(info.currentStage).toBe(7777);
        expect(info.clearedStages).toBe(7777);
        expect(info.maxStage).toBe(7777);
        expect(info.isMaxed).toBe(true);
        const lb = maxedSim.getMinigameLeaderboard(gid, 'valley');
        expect(lb.playerEntry.allTimeBestStage).toBe(7777);
        expect(lb.playerEntry.allTimeStageDisplayVi).toBe('👑 7777/7777');
      }
    });
  });

  describe('4. Proof-of-Play Anti-Cheat Stage Bounds (1..7777 Accepted, 7778 Rejected)', () => {
    it('accepts valid envelopes at stages 1, 777, 778, 4444, 7777 and rejects 7778 across all 6 disciplines', () => {
      for (const gameId of ALL_POP_GAMES) {
        expect(getMaxStageForProofGame(gameId)).toBe(7777);

        for (const stage of [1, 777, 778, 4444, 7777]) {
          const score = 15_000 + stage * 12;
          const env = createValidPopEnvelope(gameId, stage, score);
          const check = verifyProofOfPlayEnvelope(env, {
            expectedGameId: gameId,
            claimedPrimaryStage: stage,
          });
          expect(check.ok, `${gameId} stage ${stage} failed: ${check.reason}`).toBe(true);
        }

        // Forged envelope with stage 7778 must be rejected as stage-out-of-bounds
        const base7777 = createValidPopEnvelope(gameId, 7777, 25_000);
        const forged7778 = { ...base7777, stage: 7778 };
        const rejectForgedHigh = verifyProofOfPlayEnvelope(forged7778, {
          expectedGameId: gameId,
        });
        expect(rejectForgedHigh.ok).toBe(false);
        expect(rejectForgedHigh.reason).toBe('stage-out-of-bounds');

        // Claiming stage 7778 against a valid 7777 envelope must also be rejected
        const rejectClaimHigh = verifyProofOfPlayEnvelope(base7777, {
          expectedGameId: gameId,
          claimedPrimaryStage: 7778,
        });
        expect(rejectClaimHigh.ok).toBe(false);
        expect(rejectClaimHigh.reason).toBe('stage-claim-exceeds-proof');

        // Forged stage 0 must also be rejected as stage-out-of-bounds
        const forgedZero = { ...base7777, stage: 0 };
        const rejectZero = verifyProofOfPlayEnvelope(forgedZero, {
          expectedGameId: gameId,
        });
        expect(rejectZero.ok).toBe(false);
        expect(rejectZero.reason).toBe('stage-out-of-bounds');
      }
    });
  });
});
