import { describe, expect, it } from 'vitest';
import {
  generateCandyHogwartsLevel,
  getCandyBossForLevel,
} from '../../data/candyHogwartsLevels';
import { getMatch3LevelDef } from '../../data/match3Levels';
import { loadLanguageQuizPack } from '../../data/languageQuizBank';
import { CaroGameEngine } from '../caroEngine';
import { WizardChessEngine } from '../chessEngine';
import { CreatureOnetEngine, getOnetStageConfig } from '../onetEngine';
import { RunicBlockPuzzleEngine, TileMatchZenEngine } from '../blocksEngine';
import { MasterJigsawEngine, getJigsawStageSpec } from '../jigsawEngine';
import { SudokuPuzzleEngine } from '../sudokuEngine';
import {
  computeTargetBand,
  createInitialLanguageQuizState,
  generateNextQuizChallenge,
  recordQuizAttempt,
} from '../languageQuizEngine';

describe('Minigame Difficulty Upgrade (except Sudoku)', () => {
  it('keeps Sudoku completely untouched across all classic tiers', () => {
    const countBlanks = (eng: SudokuPuzzleEngine): number =>
      eng.grid.flat().filter((v) => v === 0).length;

    const s1 = new SudokuPuzzleEngine(1);
    expect(s1.maxMistakes).toBe(3);
    expect(s1.freeHintsLeft).toBe(1);
    expect(s1.paidHintsLeft).toBe(1);
    expect(s1.classicDifficultyVi).toBe('Khó Vừa');
    expect(countBlanks(s1)).toBe(41);

    const s15 = new SudokuPuzzleEngine(15);
    expect(s15.classicDifficultyVi).toBe('Khó Vừa');
    expect(countBlanks(s15)).toBe(43);

    const s25 = new SudokuPuzzleEngine(25);
    expect(s25.freeHintsLeft).toBe(0);
    expect(s25.classicDifficultyVi).toBe('Khó');
    expect(countBlanks(s25)).toBe(45);

    const s100 = new SudokuPuzzleEngine(100);
    expect(s100.classicDifficultyVi).toBe('Chuyên Gia');
    expect(countBlanks(s100)).toBe(51);

    const s400 = new SudokuPuzzleEngine(400);
    expect(s400.classicDifficultyVi).toBe('Đại Pháp Sư');
    expect(countBlanks(s400)).toBe(56);

    const s777 = new SudokuPuzzleEngine(777);
    expect(s777.classicDifficultyVi).toBe('Cực Khó');
    expect(countBlanks(s777)).toBe(56);
  });

  it('tightens Candy Hogwarts moves, raises Boss HP (+25%) & cast speed, and escalates legacy Match-3', () => {
    const lv1 = generateCandyHogwartsLevel(1);
    expect(lv1.moves).toBe(16);
    expect(lv1.objectives).toEqual([
      { type: 'collect', tileId: 4, target: 28 },
      { type: 'collect', tileId: 0, target: 28 },
    ]);

    const lv20 = generateCandyHogwartsLevel(20);
    expect(lv20.bombConfig).not.toBeNull();
    expect(lv20.bombConfig?.startTimer).toBeLessThanOrEqual(10);

    const boss10 = getCandyBossForLevel(10);
    const boss777 = getCandyBossForLevel(777);
    expect(boss10).not.toBeNull();
    expect(boss10!.maxHp).toBe(1950); // 1550 * 1.25 rounded to 50
    expect(boss10!.castInterval).toBeLessThanOrEqual(3);
    expect(boss10!.enrageBelowPct).toBeGreaterThanOrEqual(0.55);
    expect(boss777).not.toBeNull();
    expect(boss777!.castInterval).toBe(2);

    for (let id = 1; id <= 777; id++) {
      const lv = generateCandyHogwartsLevel(id);
      expect(lv.moves).toBeGreaterThanOrEqual(13);
    }

    const legacy300 = getMatch3LevelDef(300);
    expect(legacy300.moves).toBeGreaterThanOrEqual(13);
    expect(legacy300.moves).toBeLessThanOrEqual(28);
  });

  it('upgrades Caro AI strength to >= 2, blocks open-four immediately, and seeds early runes safely', () => {
    const c1 = new CaroGameEngine(1);
    expect(c1.freeUndosLeft).toBe(1);
    expect(c1.freeHintsLeft).toBe(1);
    expect(c1.runeSealCount).toBe(0);
    expect(c1.moveHistory.length).toBe(0);

    // Stage 1: AI responds promptly with stronger lookahead
    c1.playHumanMove(6, 5);
    c1.stepAiMove();
    expect(c1.moveHistory.length).toBe(2);

    const c8 = new CaroGameEngine(8);
    expect(c8.freeUndosLeft).toBe(0);
    expect(c8.freeHintsLeft).toBe(0);
    expect(c8.initialHistoryLen).toBeGreaterThanOrEqual(2);

    const c25 = new CaroGameEngine(25);
    expect(c25.runeSealCount).toBeGreaterThanOrEqual(1);

    const c90 = new CaroGameEngine(90);
    expect(c90.paidUndosLeft).toBe(0);
    expect(c90.paidHintsLeft).toBe(0);

    // Open-Four immediate block verification on stage 1
    const forkTest = new CaroGameEngine(1);
    forkTest.grid[6][4] = 1;
    forkTest.grid[6][5] = 1;
    forkTest.grid[6][6] = 1;
    forkTest.grid[6][7] = 1;
    const res = forkTest.playHumanMove(2, 2); // player plays elsewhere so AI turns on Open-Four
    expect(res.ok).toBe(true);
    const aiReply = forkTest.stepAiMove();
    expect(aiReply).not.toBeNull();
    expect([3, 8]).toContain(aiReply!.c);
    expect(aiReply!.r).toBe(6);
  });

  it('hardens Wizard Chess assists, enables quiescence from stage 1, and preserves valid search', () => {
    const ch1 = new WizardChessEngine(1);
    expect(ch1.freeUndosLeft).toBe(1);
    expect(ch1.freeHintsLeft).toBe(1);

    const ch6 = new WizardChessEngine(6);
    expect(ch6.freeUndosLeft).toBe(0);
    expect(ch6.freeHintsLeft).toBe(0);

    const ch70 = new WizardChessEngine(70);
    expect(ch70.paidUndosLeft).toBe(0);

    // Play 1. e4 on stage 2 match mode and verify AI responds promptly
    const chMatch = new WizardChessEngine(2); // even stages default to match
    chMatch.clickSquare(6, 4);
    const pMove = chMatch.clickSquare(4, 4);
    expect(pMove.moved).toBe(true);
    const aiBest = chMatch.computeBestAiMoveOnly();
    expect(aiBest).not.toBeNull();
  });

  it('tightens Pikachu Onet & Runic Blocks/Tile Match while keeping Stage 1 Onet baseline intact', () => {
    const cfg1 = getOnetStageConfig(1);
    expect(cfg1.rows).toBe(4);
    expect(cfg1.cols).toBe(6);
    expect(cfg1.timeLimitSec).toBe(1200);
    expect(cfg1.matchBonusSec).toBe(20);
    expect(cfg1.speciesCount).toBe(6);
    expect(cfg1.maxLives).toBe(6);

    const cfg4 = getOnetStageConfig(4);
    expect(cfg4.speciesCount).toBe(12);
    expect(cfg4.timeLimitSec).toBe(1200);
    expect(cfg4.matchBonusSec).toBe(20);

    const cfg50 = getOnetStageConfig(50);
    expect(cfg50.maxLives).toBe(5);
    const eng50 = new CreatureOnetEngine(50);
    expect(eng50.freeHintsLeft).toBe(0);

    // Same-species blocked mismatch deducts 2s from stage 4+
    const eng4 = new CreatureOnetEngine(4);
    const before = eng4.timeRemainingSec;
    // Find two identical tiles whose direct path is blocked if any exist
    outer: for (let r1 = 0; r1 < eng4.rows; r1++) {
      for (let c1 = 0; c1 < eng4.cols; c1++) {
        const sp = eng4.grid[r1][c1];
        if (!sp) continue;
        for (let r2 = 0; r2 < eng4.rows; r2++) {
          for (let c2 = 0; c2 < eng4.cols; c2++) {
            if (r1 === r2 && c1 === c2) continue;
            if (eng4.grid[r2][c2] === sp && !eng4.findConnectionPath({ r: r1, c: c1 }, { r: r2, c: c2 })) {
              eng4.tapCell(r1, c1);
              const step2 = eng4.tapCell(r2, c2);
              if (step2.action === 'blocked') {
                expect(eng4.timeRemainingSec).toBe(before - 2);
                break outer;
              }
            }
          }
        }
      }
    }

    const blk2 = new RunicBlockPuzzleEngine(2, 'blast');
    expect(blk2.targetLines).toBe(7);

    const blk46 = new RunicBlockPuzzleEngine(46, 'blast');
    expect(blk46.obsidianRunesCount).toBeGreaterThan(0);

    const zen2 = new TileMatchZenEngine(2);
    expect(zen2.tiles.length).toBeGreaterThanOrEqual(30);
  });

  it('tightens Master Jigsaw timers, ghost defaults, hints, and snap tolerance while preserving milestones', () => {
    expect(getJigsawStageSpec(1)).toMatchObject({ rows: 3, cols: 3, timeLimitSec: 150 });
    expect(getJigsawStageSpec(16)).toMatchObject({ rows: 4, cols: 5, timeLimitSec: 300 });
    expect(getJigsawStageSpec(777)).toMatchObject({ rows: 40, cols: 50, timeLimitSec: 7200 });

    expect(getJigsawStageSpec(8).showGhostDefault).toBe(true);
    expect(getJigsawStageSpec(9).showGhostDefault).toBe(false);
    expect(getJigsawStageSpec(200).timeLimitSec).toBe(2100);

    const j10 = new MasterJigsawEngine(10);
    expect(j10.freeHintsLeft).toBe(0);
    expect(j10.paidHintsLeft).toBe(2);

    const j777 = new MasterJigsawEngine(777);
    expect(j777.freeHintsLeft).toBe(2);
    const hintRes = j777.useMagicHint();
    expect(hintRes.lockedPieces.length).toBe(5);

    // Check tightened snap threshold on 4x4 (stage 15): 28px delta no longer snaps on 600x480
    const j15 = new MasterJigsawEngine(15);
    const target = j15.getTargetNormCenter(0);
    j15.spawnTrayPieceOntoBoard(0, target.nx + 28 / 600, target.ny);
    const dropRes = j15.dropClusterAndResolve(0, 600, 480);
    expect(dropRes.lockedPieces.length).toBe(0);
  });

  it('raises Học Viện Thần Chú Đa Ngữ quiz difficulty (harder progression, 4 pairs at band >= 2)', async () => {
    await loadLanguageQuizPack('en');
    const state = createInitialLanguageQuizState();
    state.activeLang = 'en';

    const c1 = generateNextQuizChallenge(state, 1);
    const outOk1 = recordQuizAttempt(state, c1, true);
    expect(outOk1.newMasteryScore).toBe(15 + 3); // beginner default 15 + 3 gain
    expect(outOk1.tierAutoPromoted).toBeUndefined();

    // Wrong answer applies -7 penalty and drops to Leitner Box 1 (due + 2)
    const outErr = recordQuizAttempt(state, c1, false);
    expect(outErr.newMasteryScore).toBe(11);
    expect(outErr.newSrsBox).toBe(1);
    expect(state.profiles.en.srsBoxes![c1.qId].dueAtTurn).toBe(
      state.profiles.en.totalAnswered + 2
    );

    // Band >= 2 match_pairs generates 4 pairs
    state.profiles.en.masteryScore = 25;
    state.preferredFormat = 'match_pairs';
    expect(computeTargetBand(state.profiles.en, 20)).toBeGreaterThanOrEqual(2);
    const pairChallenge = generateNextQuizChallenge(state, 20);
    expect(pairChallenge.leftCards?.length).toBe(4);
  });
});
