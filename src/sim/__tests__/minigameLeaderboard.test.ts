import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import { generateNextQuizChallenge } from '../languageQuizEngine';
import {
  ALL_HOGWARTS_HOUSES,
  ALL_LEADERBOARD_GAMES,
  buildMinigameLeaderboard,
  clearCachedCloudLeaderboards,
  HOGWARTS_HOUSE_META,
  LEADERBOARD_GAME_META,
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

describe('Per-Mini-Game Leaderboards (6 Wizarding Disciplines — Real Players Only)', () => {
  beforeEach(() => {
    storageMap.clear();
    clearCachedCloudLeaderboards();
  });

  it('contains zero NPCs by default across all 6 mini-games (player only until real players/friends sync)', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    expect(ALL_LEADERBOARD_GAMES).toEqual([
      'match3',
      'caro',
      'sudoku',
      'chess',
      'blocks',
      'seedquiz',
    ]);

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

  it('tracks independent victories, climbs ranks past real online players, and preserves other disciplines', () => {
    const sim = new ParkSimulation(new MagicalAudio());

    // Seed real online players on Match-3 & Chess leaderboards
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

    setCachedCloudLeaderboardEntries('chess', [
      {
        userId: 'real_user_chess_1',
        name: 'Quốc Bảo',
        parkName: 'Tháp Cờ Đá',
        friendCode: 'HS-QBAO-33',
        avatarEmoji: '♟️',
        house: 'Gryffindor',
        primaryValue: 2,
        ratingScore: 360,
        totalWins: 2,
        bestStreak: 2,
        detailLabelVi: '2 thắng • 🔥×2',
        updatedAt: Date.now(),
      },
    ]);

    const initialChessRank = sim.getPlayerMinigameRank('chess', 'valley');
    const initialCaroRank = sim.getPlayerMinigameRank('caro', 'valley');
    expect(initialChessRank).toBe(2);
    expect(initialCaroRank).toBe(1);

    // Clear Stage 1 & Stage 2 of Match-3 -> overtakes real online players!
    const m3Win1 = sim.completeMatch3LevelVictory(12, { sessionScore: 2450 });
    expect(m3Win1.leaderboardRankUp).toBeDefined();
    expect(m3Win1.leaderboardRankUp!.gameId).toBe('match3');
    expect(m3Win1.leaderboardRankUp!.rankUpBy).toBeGreaterThanOrEqual(1);

    const m3Win2 = sim.completeMatch3LevelVictory(18, { sessionScore: 3100 });
    expect(m3Win2.leaderboardRankUp!.newRank).toBe(1);

    // Unplayed disciplines remain untouched at stage 0
    expect(sim.getPlayerMinigameRank('chess', 'valley')).toBe(initialChessRank);
    expect(sim.getPlayerMinigameRank('caro', 'valley')).toBe(initialCaroRank);

    // Win Chess Stage 1..3 with fast checkmate efficiency (6 moves)
    let lastChessRank = initialChessRank;
    for (let s = 0; s < 3; s++) {
      const cw = sim.completePuzzleArcadeVictory(
        'chess',
        { stars: 2, sand: 1, gold: 120, xp: 40 },
        { sessionScore: 2850, efficiency: 6 }
      );
      expect(cw.leaderboardRankUp).toBeDefined();
      lastChessRank = cw.leaderboardRankUp!.newRank;
    }
    expect(lastChessRank).toBe(1);
    expect(sim.ensureMinigameLeaderboard().records.chess.bestEfficiency).toBe(6);

    // Win Sudoku with 0 mistakes
    const sw = sim.completePuzzleArcadeVictory(
      'sudoku',
      { stars: 2, sand: 1, gold: 110, xp: 35 },
      { sessionScore: 2600, efficiency: 0 }
    );
    expect(sw.leaderboardRankUp?.gameId).toBe('sudoku');
    expect(sim.ensureMinigameLeaderboard().records.sudoku.bestEfficiency).toBe(0);
  });

  it('updates Học Viện Thần Chú Đa Ngữ (seedquiz) leaderboard past real online scholars', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    setCachedCloudLeaderboardEntries('seedquiz', [
      {
        userId: 'real_quiz_scholar',
        name: 'Thu Hà',
        parkName: 'Vườn Cổ Ngữ',
        friendCode: 'HS-THHA-44',
        avatarEmoji: '🦉',
        house: 'Ravenclaw',
        primaryValue: 3,
        ratingScore: 150,
        totalWins: 3,
        bestStreak: 3,
        detailLabelVi: '📦 0 từ Hộp 5 • 🔥×3',
        updatedAt: Date.now(),
      },
    ]);

    const quiz = sim.ensureLanguageQuiz();
    const startRank = sim.getPlayerMinigameRank('seedquiz', 'valley');
    expect(startRank).toBe(2);

    for (let i = 0; i < 5; i++) {
      const ch = generateNextQuizChallenge(quiz, sim.state.level);
      const res = sim.completeSeedLanguageQuizAttempt('ottery_wheat', ch, true);
      expect(res.leaderboardRankUp).toBeDefined();
      expect(res.leaderboardRankUp!.gameId).toBe('seedquiz');
    }

    const afterRank = sim.getPlayerMinigameRank('seedquiz', 'valley');
    expect(afterRank).toBe(1);
    expect(sim.ensureMinigameLeaderboard().records.seedquiz.bestStage).toBe(5);
  });

  it('shows honest 0 for unplayed friends, merges real cloud friend scores, and deduplicates valley entries', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const beforeFriends = sim.getMinigameLeaderboard('caro', 'friends');
    expect(beforeFriends.totalEntries).toBe(1);

    const addRes = sim.addFriendByCode('HS-VKRM-88', 'Viktor Krum');
    expect(addRes.ok).toBe(true);

    // Without cloud record yet -> honest 0 score (no fake NPC/hash score)
    const afterFriendsNoCloud = sim.getMinigameLeaderboard('caro', 'friends');
    expect(afterFriendsNoCloud.totalEntries).toBe(2);
    const friendRow0 = afterFriendsNoCloud.entries.find((e) => e.friendCode === 'HS-VKRM-88');
    expect(friendRow0).toBeDefined();
    expect(friendRow0!.primaryValue).toBe(0);
    expect(friendRow0!.ratingScore).toBe(0);

    // Once real cloud record syncs for HS-VKRM-88 -> friends & valley both show real score without duplicating!
    setCachedCloudLeaderboardEntries('caro', [
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

    const afterFriendsSynced = sim.getMinigameLeaderboard('caro', 'friends');
    const friendRowSynced = afterFriendsSynced.entries.find((e) => e.friendCode === 'HS-VKRM-88');
    expect(friendRowSynced!.primaryValue).toBe(42);
    expect(friendRowSynced!.ratingScore).toBe(7850);

    const valleySynced = sim.getMinigameLeaderboard('caro', 'valley');
    expect(valleySynced.entries.filter((e) => e.friendCode === 'HS-VKRM-88').length).toBe(1);

    const summaries = sim.getAllPersonalLeaderboardSummaries();
    expect(summaries).toHaveLength(6);
    const ids = summaries.map((s) => s.gameId);
    expect(ids).toEqual(['match3', 'caro', 'sudoku', 'chess', 'blocks', 'seedquiz']);

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

  it('implements Classic Magical Creatures Onet Connect (777 levels, <=3 segments, outer border, static grid, untimed)', () => {
    expect(CREATURE_ONET_SPECIES.length).toBeGreaterThanOrEqual(15);

    const lv1 = new CreatureOnetEngine(1);
    const lv350 = new CreatureOnetEngine(350);
    const lv777 = new CreatureOnetEngine(777);

    expect(lv1.totalPairs).toBe(24); // 6x8 = 48 tiles right from Stage 1
    expect(lv350.totalPairs).toBe(40); // 8x10 = 80 tiles
    expect(lv777.totalPairs).toBe(54); // 9x12 = 108 tiles
    expect(lv777.speciesCount).toBeGreaterThan(lv1.speciesCount);
    expect(lv1.findAnyValidPair()).not.toBeNull();
    expect(lv777.findAnyValidPair()).not.toBeNull();

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

    // Static board check: clearing a pair NEVER moves neighboring tiles, and stage plays cleanly to 'won'
    const game = new CreatureOnetEngine(5);
    const hintRes = game.useHint();
    expect(hintRes.ok).toBe(true);
    expect(hintRes.pair).not.toBeNull();

    const [pA, pB] = hintRes.pair!;
    // Snapshot all other coordinates before matching [pA, pB]
    const snapshot = game.grid.map((row) => [...row]);
    game.selected = null;
    expect(game.tapCell(pA.r, pA.c).action).toBe('selected');
    const matchStep = game.tapCell(pB.r, pB.c);
    expect(matchStep.action).toBe('matched');
    expect(game.grid[pA.r][pA.c]).toBeNull();
    expect(game.grid[pB.r][pB.c]).toBeNull();
    if (!matchStep.autoShuffled) {
      for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
          if ((r === pA.r && c === pA.c) || (r === pB.r && c === pB.c)) continue;
          expect(game.grid[r][c]).toBe(snapshot[r][c]);
        }
      }
    }

    // Phoenix Talisman clears up to 3 pairs immediately
    const talRes = game.applyPhoenixTalisman();
    expect(talRes.ok).toBe(true);
    expect(talRes.clearedPairs).toBeGreaterThanOrEqual(1);

    // Complete remaining pairs to full victory (guaranteed deadlock-free via auto-shuffle)
    let guard = 0;
    while (game.status === 'playing' && guard < 100) {
      guard += 1;
      const nextPair = game.findAnyValidPair();
      expect(nextPair).not.toBeNull();
      game.tapCell(nextPair!.a.r, nextPair!.a.c);
      game.tapCell(nextPair!.b.r, nextPair!.b.c);
    }
    expect(game.status).toBe('won');
    expect(game.remainingPairs).toBe(0);
    expect(game.getTurningPointReview()?.mode).toBe('blocks');
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
