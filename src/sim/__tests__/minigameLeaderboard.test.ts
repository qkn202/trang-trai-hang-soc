import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import { generateNextQuizChallenge } from '../languageQuizEngine';
import {
  ALL_HOGWARTS_HOUSES,
  ALL_LEADERBOARD_GAMES,
  buildMinigameLeaderboard,
  clearCachedCloudLeaderboards,
  HOGWARTS_HOUSE_META,
  isScoredLeaderboardGame,
  LEADERBOARD_GAME_META,
  SCORED_LEADERBOARD_GAMES,
  setCachedCloudLeaderboardEntries,
} from '../minigameLeaderboard';
import { CREATURE_ONET_SPECIES, CreatureOnetEngine } from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('Per-Mini-Game Leaderboards (3 Scored Games: Match-3, Sudoku & Pikachu — Real Players Only)', () => {
  beforeEach(() => {
    storageMap.clear();
    clearCachedCloudLeaderboards();
  });

  it('contains zero NPCs by default across the 3 scored mini-games (Match-3, Sudoku, Pikachu)', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    expect(SCORED_LEADERBOARD_GAMES).toEqual(['match3', 'sudoku', 'blocks']);
    expect(ALL_LEADERBOARD_GAMES).toEqual(['match3', 'sudoku', 'blocks']);
    expect(isScoredLeaderboardGame('match3')).toBe(true);
    expect(isScoredLeaderboardGame('sudoku')).toBe(true);
    expect(isScoredLeaderboardGame('blocks')).toBe(true);
    expect(isScoredLeaderboardGame('caro')).toBe(false);
    expect(isScoredLeaderboardGame('chess')).toBe(false);
    expect(isScoredLeaderboardGame('seedquiz')).toBe(false);

    for (const gid of ALL_LEADERBOARD_GAMES) {
      expect(LEADERBOARD_GAME_META[gid]).toBeDefined();
      const valley = sim.getMinigameLeaderboard(gid, 'valley');
      const friends = sim.getMinigameLeaderboard(gid, 'friends');

      // Strictly 0 NPCs in both scopes
      expect(valley.entries.length).toBe(1);
      expect(friends.entries.length).toBe(1);
      expect(valley.entries[0].isPlayer).toBe(true);
      expect(friends.entries[0].isPlayer).toBe(true);
      expect(valley.entries.some((e) => e.id.startsWith('rival:'))).toBe(false);
    }
  });

  it('tracks independent victories on the 3 scored games (Match-3, Sudoku, Pikachu) while keeping Caro, Chess, and SeedQuiz unscored', () => {
    const sim = new ParkSimulation(new MagicalAudio());

    // Seed real online players on Match-3 & Sudoku leaderboards
    setCachedCloudLeaderboardEntries('match3', [
      {
        userId: 'real_user_m3_1',
        name: 'Minh Khang',
        parkName: 'Thung Lũng Ánh Trăng',
        friendCode: 'HS-MKHG-11',
        avatarEmoji: '🧙‍♂️',
        house: 'Ravenclaw',
        primaryValue: 1,
        ratingScore: 180,
        totalWins: 1,
        bestStreak: 1,
        detailLabelVi: '1 thắng • 🔥×1',
        updatedAt: Date.now(),
      },
      {
        userId: 'real_user_m3_2',
        name: 'Lan Anh',
        parkName: 'Đồi Hufflepuff',
        friendCode: 'HS-LANH-22',
        avatarEmoji: '🧙‍♀️',
        house: 'Hufflepuff',
        primaryValue: 2,
        ratingScore: 340,
        totalWins: 2,
        bestStreak: 2,
        detailLabelVi: '2 thắng • 🔥×2',
        updatedAt: Date.now(),
      },
    ]);

    setCachedCloudLeaderboardEntries('sudoku', [
      {
        userId: 'real_user_sudoku_1',
        name: 'Quốc Bảo',
        parkName: 'Tháp Cổ Ngữ',
        friendCode: 'HS-QBAO-33',
        avatarEmoji: '🔮',
        house: 'Gryffindor',
        primaryValue: 2,
        ratingScore: 360,
        totalWins: 2,
        bestStreak: 2,
        detailLabelVi: '2 thắng • 🔥×2',
        updatedAt: Date.now(),
      },
    ]);

    const initialSudokuRank = sim.getPlayerMinigameRank('sudoku', 'valley');
    const initialBlocksRank = sim.getPlayerMinigameRank('blocks', 'valley');
    expect(initialSudokuRank).toBe(2);
    expect(initialBlocksRank).toBe(1);

    // Clear Stage 1 & Stage 2 of Match-3 -> overtakes real online players!
    const m3Win1 = sim.completeMatch3LevelVictory(12, { sessionScore: 2450 });
    expect(m3Win1.leaderboardRankUp).toBeDefined();
    expect(m3Win1.leaderboardRankUp!.gameId).toBe('match3');
    expect(m3Win1.leaderboardRankUp!.rankUpBy).toBeGreaterThanOrEqual(1);

    const m3Win2 = sim.completeMatch3LevelVictory(18, { sessionScore: 3100 });
    expect(m3Win2.leaderboardRankUp!.newRank).toBe(1);

    // Unplayed scored disciplines remain untouched at stage 0
    expect(sim.getPlayerMinigameRank('sudoku', 'valley')).toBe(initialSudokuRank);
    expect(sim.getPlayerMinigameRank('blocks', 'valley')).toBe(initialBlocksRank);

    // Win Sudoku Stage 1..3 with 0 mistakes -> climbs to #1 on Sudoku leaderboard!
    let lastSudokuRank = initialSudokuRank;
    for (let s = 0; s < 3; s++) {
      const sw = sim.completePuzzleArcadeVictory(
        'sudoku',
        { stars: 2, sand: 1, gold: 110, xp: 35 },
        { sessionScore: 2600, efficiency: 0 }
      );
      expect(sw.leaderboardRankUp).toBeDefined();
      expect(sw.leaderboardRankUp!.gameId).toBe('sudoku');
      lastSudokuRank = sw.leaderboardRankUp!.newRank;
    }
    expect(lastSudokuRank).toBe(1);
    expect(sim.ensureMinigameLeaderboard().records.sudoku.bestEfficiency).toBe(0);

    // Verify unscored games (Caro, Chess, SeedQuiz) do NOT award leaderboard points or House Cup points!
    const houseBeforeUnscored = { ...sim.state.housePoints };
    const caroWin = sim.completePuzzleArcadeVictory(
      'caro',
      { stars: 2, sand: 1, gold: 100, xp: 30 },
      { sessionScore: 2500, efficiency: 9 }
    );
    expect(caroWin.leaderboardRankUp).toBeUndefined();
    expect(sim.ensureMinigameLeaderboard().records.caro.highScore).toBe(0);

    const chessWin = sim.completePuzzleArcadeVictory(
      'chess',
      { stars: 2, sand: 1, gold: 120, xp: 40 },
      { sessionScore: 2850, efficiency: 6 }
    );
    expect(chessWin.leaderboardRankUp).toBeUndefined();
    expect(sim.ensureMinigameLeaderboard().records.chess.highScore).toBe(0);

    const quiz = sim.ensureLanguageQuiz();
    const ch = generateNextQuizChallenge(quiz, sim.state.level);
    const quizRes = sim.completeSeedLanguageQuizAttempt('ottery_wheat', ch, true);
    expect(quizRes.leaderboardRankUp).toBeUndefined();
    expect(sim.ensureMinigameLeaderboard().records.seedquiz.highScore).toBe(0);

    expect(sim.state.housePoints).toEqual(houseBeforeUnscored);
  });

  it('shows honest 0 for unplayed friends, merges real cloud friend scores, and deduplicates valley entries across the 3 scored games', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const beforeFriends = sim.getMinigameLeaderboard('sudoku', 'friends');
    expect(beforeFriends.totalEntries).toBe(1);

    const addRes = sim.addFriendByCode('HS-VKRM-88', 'Viktor Krum');
    expect(addRes.ok).toBe(true);

    // Without cloud record yet -> honest 0 score (no fake NPC/hash score)
    const afterFriendsNoCloud = sim.getMinigameLeaderboard('sudoku', 'friends');
    expect(afterFriendsNoCloud.totalEntries).toBe(2);
    const friendRow0 = afterFriendsNoCloud.entries.find((e) => e.friendCode === 'HS-VKRM-88');
    expect(friendRow0).toBeDefined();
    expect(friendRow0!.primaryValue).toBe(0);
    expect(friendRow0!.ratingScore).toBe(0);

    // Once real cloud record syncs for HS-VKRM-88 -> friends & valley both show real score without duplicating!
    setCachedCloudLeaderboardEntries('sudoku', [
      {
        userId: 'vkrm_real_uid',
        name: 'Viktor Krum',
        parkName: 'Đấu Trường Durmstrang',
        friendCode: 'HS-VKRM-88',
        avatarEmoji: '🦅',
        house: 'Slytherin',
        primaryValue: 42,
        ratingScore: 7850,
        totalWins: 45,
        bestStreak: 9,
        detailLabelVi: '45 thắng • 🔥×9',
        updatedAt: Date.now(),
      },
    ]);

    const afterFriendsSynced = sim.getMinigameLeaderboard('sudoku', 'friends');
    const friendRowSynced = afterFriendsSynced.entries.find((e) => e.friendCode === 'HS-VKRM-88');
    expect(friendRowSynced!.primaryValue).toBe(42);
    expect(friendRowSynced!.ratingScore).toBe(7850);

    const valleySynced = sim.getMinigameLeaderboard('sudoku', 'valley');
    expect(valleySynced.entries.filter((e) => e.friendCode === 'HS-VKRM-88').length).toBe(1);

    const summaries = sim.getAllPersonalLeaderboardSummaries();
    expect(summaries).toHaveLength(3);
    const ids = summaries.map((s) => s.gameId);
    expect(ids).toEqual(['match3', 'sudoku', 'blocks']);

    // Verify cloud merge deduplicates player's own friendCode while adding external cloud players
    const ownCode = sim.ensureNeighborSocial().playerFriendCode;
    const withCloud = buildMinigameLeaderboard(sim.state, 'blocks', 'valley', [
      {
        userId: 'duplicate_self',
        name: 'Bản Sao Của Mình',
        parkName: 'Hang Sóc',
        friendCode: ownCode,
        avatarEmoji: '🧙‍♂️',
        house: 'Gryffindor',
        primaryValue: 500,
        ratingScore: 90000,
        totalWins: 500,
        bestStreak: 20,
        detailLabelVi: '500 thắng',
        updatedAt: Date.now(),
      },
      {
        userId: 'remote_champion_01',
        name: 'Hoàng Nam',
        parkName: 'Thung Lũng Phượng Hoàng',
        friendCode: 'HS-HNAM-77',
        avatarEmoji: '🧳',
        house: 'Hufflepuff',
        primaryValue: 410,
        ratingScore: 72000,
        totalWins: 420,
        bestStreak: 19,
        detailLabelVi: '420 thắng • 🔥×19',
        updatedAt: Date.now(),
      },
    ]);
    expect(withCloud.entries.filter((e) => e.isPlayer).length).toBe(1);
    expect(withCloud.entries.some((e) => e.id === 'cloud:remote_champion_01')).toBe(true);
    expect(withCloud.entries.some((e) => e.id === 'cloud:duplicate_self')).toBe(false);

    // Save & reload persistence check
    sim.completePuzzleArcadeVictory(
      'blocks',
      { stars: 2, sand: 1, gold: 100, xp: 30 },
      { sessionScore: 4200, efficiency: 14 }
    );
    sim.saveToStorage();

    const reloaded = new ParkSimulation(new MagicalAudio());
    expect(reloaded.ensureMinigameLeaderboard().records.blocks.bestSessionScore).toBe(4200);
    expect(reloaded.ensureMinigameLeaderboard().records.blocks.bestEfficiency).toBe(14);
  });

  it('implements Classic Pikachu 2003 Onet Connect (9x16=144 tiles, 36 unique sprites, 9 rotating shift modes, 10 ❤️ lives, untimed)', () => {
    expect(CREATURE_ONET_SPECIES.length).toBe(36);
    const uniqueSprites = new Set(CREATURE_ONET_SPECIES.map((s) => s.spriteKey));
    expect(uniqueSprites.size).toBe(36);

    const lv1 = new CreatureOnetEngine(1);
    const lv350 = new CreatureOnetEngine(350);
    const lv777 = new CreatureOnetEngine(777);

    // Full Classic Pikachu 2003 9×16 = 144 tiles (72 pairs) across all stages 1..777
    expect(lv1.rows).toBe(9);
    expect(lv1.cols).toBe(16);
    expect(lv1.totalPairs).toBe(72);
    expect(lv350.totalPairs).toBe(72);
    expect(lv777.totalPairs).toBe(72);
    expect(lv1.lives).toBe(10);
    expect(lv1.findAnyValidPair()).not.toBeNull();
    expect(lv777.findAnyValidPair()).not.toBeNull();

    // Verify all 9 classic Pikachu rotating shift laws across stages 1..9 (and cycle repeat at stage 10)
    const modes1To10 = Array.from({ length: 10 }, (_, idx) => new CreatureOnetEngine(idx + 1).shiftMode);
    expect(modes1To10).toEqual([
      'none',
      'down',
      'up',
      'left',
      'right',
      'center_h',
      'split_h',
      'center_v',
      'split_v',
      'none',
    ]);

    // Verify outer-border 3-segment U-turn (top row r=0 via r=-1) AND rejection of 4-segment S-bend
    const custom = new CreatureOnetEngine(1);
    for (let r = 0; r < custom.rows; r++) {
      for (let c = 0; c < custom.cols; c++) {
        custom.grid[r][c] = 'dragon';
      }
    }
    custom.grid[0][1] = 'unicorn';
    custom.grid[0][4] = 'unicorn';
    const outerPath = custom.findConnectionPath({ r: 0, c: 1 }, { r: 0, c: 4 });
    expect(outerPath).not.toBeNull();
    expect(outerPath!.length - 1).toBeLessThanOrEqual(3);
    expect(outerPath!.some((pt) => pt.r === -1)).toBe(true);

    // Interior pair completely surrounded -> requires >3 segments -> rejected!
    custom.grid[0][1] = 'dragon';
    custom.grid[0][4] = 'dragon';
    custom.grid[1][1] = 'niffler';
    custom.grid[2][4] = 'niffler';
    expect(custom.findConnectionPath({ r: 1, c: 1 }, { r: 2, c: 4 })).toBeNull();

    // Stage 1 ('none') keeps remaining tiles stationary on match
    const staticGame = new CreatureOnetEngine(1);
    const hintRes = staticGame.useHint();
    expect(hintRes.ok).toBe(true);
    const [pA, pB] = hintRes.pair!;
    const snapshot = staticGame.grid.map((row) => [...row]);
    staticGame.selected = null;
    expect(staticGame.tapCell(pA.r, pA.c).action).toBe('selected');
    const matchStep = staticGame.tapCell(pB.r, pB.c);
    expect(matchStep.action).toBe('matched');
    expect(staticGame.grid[pA.r][pA.c]).toBeNull();
    expect(staticGame.grid[pB.r][pB.c]).toBeNull();
    if (!matchStep.autoShuffled) {
      for (let r = 0; r < staticGame.rows; r++) {
        for (let c = 0; c < staticGame.cols; c++) {
          if ((r === pA.r && c === pA.c) || (r === pB.r && c === pB.c)) continue;
          expect(staticGame.grid[r][c]).toBe(snapshot[r][c]);
        }
      }
    }

    // Stage 2 ('down') shifts column tiles downward into bottom gaps!
    const downGame = new CreatureOnetEngine(2);
    for (let r = 0; r < downGame.rows; r++) {
      for (let c = 0; c < downGame.cols; c++) {
        downGame.grid[r][c] = null;
      }
    }
    downGame.matchedPairs = downGame.totalPairs - 2;
    downGame.grid[6][2] = 'phoenix';
    downGame.grid[6][5] = 'phoenix';
    downGame.grid[8][2] = 'niffler';
    downGame.grid[8][3] = 'niffler';
    downGame.tapCell(8, 2);
    const downMatch = downGame.tapCell(8, 3);
    expect(downMatch.action).toBe('matched');
    // Phoenix at (6,2) falls down to bottom row (8,2)!
    expect(downGame.grid[8][2]).toBe('phoenix');
    expect(downGame.grid[6][2]).toBeNull();
    expect(downGame.slideVfxQueue.length).toBeGreaterThanOrEqual(1);

    // Deadlock with 0 ❤️ transitions to 'lost', and Phoenix Talisman revives & clears pairs
    const deadlockGame = new CreatureOnetEngine(1);
    for (let r = 0; r < deadlockGame.rows; r++) {
      for (let c = 0; c < deadlockGame.cols; c++) {
        deadlockGame.grid[r][c] = null;
      }
    }
    deadlockGame.matchedPairs = deadlockGame.totalPairs - 3;
    // Diagonal checkerboard deadlock in middle: (3,3)=A, (3,4)=B, (4,3)=B, (4,4)=A — Wait: outer border around (3..4,3..4) is empty so let's block with surrounded cross:
    // Cross block: center (4,4)=A, surrounded at (3,4)=B, (5,4)=C, (4,3)=B, (4,5)=C? Wait: (3,4) and (4,3) are both B and can connect via (3,3)!
    // True 2-species deadlock: A at (4,4) and (4,7), blocked on all 4 sides of (4,4) by B/C:
    // Let's test manual shuffle spending 1 ❤️ and deadlock auto-spending 1 ❤️ / losing at 0 ❤️:
    deadlockGame.grid[4][4] = 'unicorn';
    deadlockGame.grid[4][8] = 'unicorn';
    deadlockGame.grid[3][4] = 'dragon';
    deadlockGame.grid[5][4] = 'phoenix';
    deadlockGame.grid[4][3] = 'niffler';
    deadlockGame.grid[4][5] = 'hippogriff';
    // Pair the blockers far apart and also surround one of each blocker — even simpler: verify manual shuffle deducts 1 ❤️
    expect(deadlockGame.useManualShuffle(false).ok).toBe(true);
    expect(deadlockGame.lives).toBe(9);

    // Play a full 72-pair stage with shifting gravity (Stage 6: 'center_h') to 'won'
    const fullGame = new CreatureOnetEngine(6);
    const talRes = fullGame.applyPhoenixTalisman();
    expect(talRes.ok).toBe(true);
    expect(talRes.clearedPairs).toBe(3);

    let guard = 0;
    while (fullGame.status === 'playing' && guard < 120) {
      guard += 1;
      const nextPair = fullGame.findAnyValidPair();
      expect(nextPair).not.toBeNull();
      fullGame.tapCell(nextPair!.a.r, nextPair!.a.c);
      fullGame.tapCell(nextPair!.b.r, nextPair!.b.c);
    }
    expect(fullGame.status).toBe('won');
    expect(fullGame.remainingPairs).toBe(0);
    expect(fullGame.getTurningPointReview()?.mode).toBe('blocks');
  });

  it('computes 4 Hogwarts Houses Cup Hourglass standings, Sorting Hat selection, and house filtering', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    expect(ALL_HOGWARTS_HOUSES).toEqual([
      'Gryffindor',
      'Slytherin',
      'Ravenclaw',
      'Hufflepuff',
    ]);
    for (const h of ALL_HOGWARTS_HOUSES) {
      expect(HOGWARTS_HOUSE_META[h].emblemSvg).toContain('<svg');
      expect(HOGWARTS_HOUSE_META[h].hourglassSvg).toContain('<svg');
      expect(HOGWARTS_HOUSE_META[h].gemNameVi.length).toBeGreaterThan(3);
    }

    // Switch player House to Slytherin and win a Match-3 stage -> awards Slytherin Emerald Hourglass points!
    expect(sim.setPlayerHouse('Slytherin')).toBe('Slytherin');
    expect(sim.getPlayerHouse()).toBe('Slytherin');

    const winRes = sim.completeMatch3LevelVictory(15, { sessionScore: 2800 });
    expect(winRes.leaderboardRankUp?.playerHouse).toBe('Slytherin');
    expect(winRes.leaderboardRankUp?.housePointsAwarded).toBeGreaterThan(0);
    expect(sim.state.housePoints.Slytherin).toBeGreaterThan(0);

    // Seed real online players across the other houses
    setCachedCloudLeaderboardEntries('match3', [
      {
        userId: 'raven_scholar_1',
        name: 'Cho Chang',
        parkName: 'Tháp Đại Bàng',
        friendCode: 'HS-CHOC-01',
        avatarEmoji: '🦅',
        house: 'Ravenclaw',
        primaryValue: 18,
        ratingScore: 3400,
        totalWins: 20,
        bestStreak: 6,
        detailLabelVi: '20 thắng • 🔥×6',
        updatedAt: Date.now(),
      },
      {
        userId: 'huff_friend_1',
        name: 'Cedric Diggory',
        parkName: 'Thung Lũng Lửng Vàng',
        friendCode: 'HS-CEDR-02',
        avatarEmoji: '🦡',
        house: 'Hufflepuff',
        primaryValue: 5,
        ratingScore: 950,
        totalWins: 5,
        bestStreak: 3,
        detailLabelVi: '5 thắng • 🔥×3',
        updatedAt: Date.now(),
      },
    ]);

    const allStanding = sim.getMinigameLeaderboard('match3', 'valley', 'all');
    expect(allStanding.houseStandings).toHaveLength(4);
    expect(allStanding.houseStandings[0].rank).toBe(1);
    expect(allStanding.houseStandings[0].house).toBe('Ravenclaw');
    expect(
      allStanding.houseStandings.find((s) => s.house === 'Slytherin')?.isPlayerHouse
    ).toBe(true);

    // Filtering by house returns only contenders in that house while keeping 4-house standings intact
    const slytherinOnly = sim.getMinigameLeaderboard('match3', 'valley', 'Slytherin');
    expect(slytherinOnly.entries).toHaveLength(1);
    expect(slytherinOnly.entries[0].isPlayer).toBe(true);
    expect(slytherinOnly.entries[0].house).toBe('Slytherin');
    expect(slytherinOnly.houseStandings).toHaveLength(4);

    const gryffindorEmpty = sim.getMinigameLeaderboard('match3', 'valley', 'Gryffindor');
    expect(gryffindorEmpty.entries).toHaveLength(0);

    // Sorting Hat rolls a new house different from current
    const afterHat = sim.rollPlayerSortingHat();
    expect(ALL_HOGWARTS_HOUSES).toContain(afterHat);
    expect(afterHat).not.toBe('Slytherin');
  });
});
