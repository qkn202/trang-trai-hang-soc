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
import {
  CREATURE_ONET_SPECIES,
  CreatureOnetEngine,
  getOnetStageConfig,
} from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';
import {
  clampMinigamePan,
  clampMinigameZoom,
  clientToLocalNormalized,
  combineQuarterTurns,
  computeBoardFitScale,
  MINIGAME_ZOOM_MAX,
  MINIGAME_ZOOM_MIN,
  MinigameViewportManager,
  resolveMinigameOrientation,
  screenDeltaToViewportDelta,
} from '../../ui/minigameViewControls';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('Per-Mini-Game Leaderboards (All 6 Scored Games: Match-3, Minesweeper/Caro, Sudoku, FishShooter/Chess, Onet/Blocks & Jigsaw — Real Players Only)', () => {
  beforeEach(() => {
    storageMap.clear();
    clearCachedCloudLeaderboards();
  });

  it('contains zero NPCs by default across all 6 scored mini-games (Match-3, Caro/Mines, Sudoku, Chess/Fish, Blocks, Jigsaw)', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    expect(SCORED_LEADERBOARD_GAMES).toEqual(['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw']);
    expect(ALL_LEADERBOARD_GAMES).toEqual(['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw']);
    expect(isScoredLeaderboardGame('match3')).toBe(true);
    expect(isScoredLeaderboardGame('caro')).toBe(true);
    expect(isScoredLeaderboardGame('sudoku')).toBe(true);
    expect(isScoredLeaderboardGame('chess')).toBe(true);
    expect(isScoredLeaderboardGame('blocks')).toBe(true);
    expect(isScoredLeaderboardGame('jigsaw')).toBe(true);
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

  it('tracks independent victories on all 6 scored games (including Minesweeper/caro & FishShooter/chess) while keeping SeedQuiz unscored', () => {
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

    // Verify Dò Mìn (caro) & Bắn Cá (chess) now award full leaderboard & House Cup records, while SeedQuiz stays unscored!
    const caroWin = sim.completePuzzleArcadeVictory(
      'caro',
      { stars: 2, sand: 1, gold: 100, xp: 30 },
      { sessionScore: 2500, efficiency: 9 }
    );
    expect(caroWin.leaderboardRankUp).toBeDefined();
    expect(caroWin.leaderboardRankUp!.gameId).toBe('caro');
    expect(sim.ensureMinigameLeaderboard().records.caro.bestStage).toBe(1);
    expect(sim.ensureMinigameLeaderboard().records.caro.highScore).toBeGreaterThan(0);

    const chessWin = sim.completePuzzleArcadeVictory(
      'chess',
      { stars: 2, sand: 1, gold: 120, xp: 40 },
      { sessionScore: 2850, efficiency: 6 }
    );
    expect(chessWin.leaderboardRankUp).toBeDefined();
    expect(chessWin.leaderboardRankUp!.gameId).toBe('chess');
    expect(sim.ensureMinigameLeaderboard().records.chess.bestStage).toBe(1);
    expect(sim.ensureMinigameLeaderboard().records.chess.highScore).toBeGreaterThan(0);

    const quiz = sim.ensureLanguageQuiz();
    const ch = generateNextQuizChallenge(quiz, sim.state.level);
    const quizRes = sim.completeSeedLanguageQuizAttempt('ottery_wheat', ch, true);
    expect(quizRes.leaderboardRankUp).toBeUndefined();
    expect(sim.ensureMinigameLeaderboard().records.seedquiz.highScore).toBe(0);

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
    expect(summaries).toHaveLength(6);
    const ids = summaries.map((s) => s.gameId);
    expect(ids).toEqual(['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw']);

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

  it('deduplicates Floo friends & HPVN cloud entries by remoteUserId/userId even when friendCodes differ or are empty', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    sim.setPlayerHouse('Gryffindor');

    const synced = sim.syncFlooDirectoryMembers(
      [
        {
          uid: 'hpvn_aries',
          username: 'Aries',
          parkName: 'Thung Lũng Aries',
          house: 'Gryffindor',
          level: 25,
          growing: 2,
        },
        {
          uid: 'hpvn_love_hp',
          username: 'i_love_hp_forever',
          parkName: 'Vườn Hufflepuff',
          house: 'Hufflepuff',
          level: 22,
          growing: 1,
        },
      ],
      'hpvn_self_uid'
    );
    expect(synced).toHaveLength(2);
    expect(synced[0].friendCode.startsWith('FLOO-')).toBe(true);

    setCachedCloudLeaderboardEntries('match3', [
      {
        userId: 'hpvn_aries',
        name: 'Aries',
        parkName: 'Thung Lũng Aries',
        friendCode: '',
        avatarEmoji: '🧙',
        house: 'Ravenclaw',
        primaryValue: 566,
        ratingScore: 259248,
        totalWins: 566,
        bestStreak: 12,
        detailLabelVi: '566 thắng',
        updatedAt: Date.now(),
      },
      {
        userId: 'hpvn_aries',
        name: 'Aries',
        parkName: 'Thung Lũng Aries',
        friendCode: '',
        avatarEmoji: '🧙',
        house: 'Gryffindor',
        primaryValue: 120,
        ratingScore: 24000,
        totalWins: 120,
        bestStreak: 3,
        detailLabelVi: '120 thắng',
        updatedAt: Date.now() - 10_000,
      },
      {
        userId: 'hpvn_love_hp',
        name: 'i_love_hp_forever',
        parkName: 'Vườn Hufflepuff',
        friendCode: 'HS-OTHER-99',
        avatarEmoji: '🧙',
        house: 'Hufflepuff',
        primaryValue: 529,
        ratingScore: 223636,
        totalWins: 529,
        bestStreak: 9,
        detailLabelVi: '529 thắng',
        updatedAt: Date.now(),
      },
      {
        userId: 'hpvn_ext_1',
        name: 'Cao Thủ Ẩn Danh 1',
        parkName: 'Hầm Slytherin 1',
        friendCode: '',
        avatarEmoji: '🐍',
        house: 'Slytherin',
        primaryValue: 180,
        ratingScore: 42000,
        totalWins: 180,
        bestStreak: 5,
        detailLabelVi: '180 thắng',
        updatedAt: Date.now(),
      },
      {
        userId: 'hpvn_ext_2',
        name: 'Cao Thủ Ẩn Danh 2',
        parkName: 'Hầm Slytherin 2',
        friendCode: '',
        avatarEmoji: '🐍',
        house: 'Slytherin',
        primaryValue: 160,
        ratingScore: 39000,
        totalWins: 160,
        bestStreak: 4,
        detailLabelVi: '160 thắng',
        updatedAt: Date.now(),
      },
    ]);

    const valley = sim.getMinigameLeaderboard('match3', 'valley');
    const ariesRows = valley.entries.filter((e) => e.name === 'Aries');
    expect(ariesRows).toHaveLength(1);
    expect(ariesRows[0].isFriend).toBe(true);
    expect(ariesRows[0].house).toBe('Ravenclaw');
    expect(ariesRows[0].ratingScore).toBe(259248);
    expect(ariesRows[0].primaryValue).toBe(566);

    const loveHpRows = valley.entries.filter((e) => e.name === 'i_love_hp_forever');
    expect(loveHpRows).toHaveLength(1);
    expect(loveHpRows[0].isFriend).toBe(true);
    expect(loveHpRows[0].ratingScore).toBe(223636);
    expect(loveHpRows[0].primaryValue).toBe(529);

    expect(valley.entries.some((e) => e.id === 'cloud:hpvn_ext_1')).toBe(true);
    expect(valley.entries.some((e) => e.id === 'cloud:hpvn_ext_2')).toBe(true);
    const slytherinHouse = valley.houseStandings.find((h) => h.house === 'Slytherin');
    expect(slytherinHouse?.members).toBe(2);

    // Duplicate neighbor record in save with same remoteUserId -> deduplicated in friends & valley
    const social = sim.ensureNeighborSocial();
    social.neighbors.push({
      ...social.neighbors[0],
      id: 'floo_dup_aries',
      friendCode: 'HS-DUP-999',
      remoteUserId: 'hpvn_aries',
    });
    const friendsAfterDup = sim.getMinigameLeaderboard('match3', 'friends');
    expect(friendsAfterDup.entries.filter((e) => e.name === 'Aries')).toHaveLength(1);
    const valleyAfterDup = sim.getMinigameLeaderboard('match3', 'valley');
    expect(valleyAfterDup.entries.filter((e) => e.name === 'Aries')).toHaveLength(1);
    expect(sim.ensureNeighborSocial().neighbors.filter((n) => n.remoteUserId === 'hpvn_aries')).toHaveLength(1);
  });

  it('implements progressive Pikachu Onet Connect (24 -> 160 tiles across 12 tiers, 36 unique sprites, 9 shift modes, and countdown timer)', () => {
    expect(CREATURE_ONET_SPECIES.length).toBe(36);
    const uniqueSprites = new Set(CREATURE_ONET_SPECIES.map((s) => s.spriteKey));
    expect(uniqueSprites.size).toBe(36);

    const lv1 = new CreatureOnetEngine(1);
    const lv10 = new CreatureOnetEngine(10);
    const lv35 = new CreatureOnetEngine(35);
    const lv100 = new CreatureOnetEngine(100);
    const lv250 = new CreatureOnetEngine(250);
    const lv777 = new CreatureOnetEngine(777);

    // Progressive board sizes: low levels have fewer tiles, higher levels have progressively more tiles
    expect(lv1.rows).toBe(4);
    expect(lv1.cols).toBe(6);
    expect(lv1.totalPairs).toBe(12); // 24 tiles
    expect(lv1.speciesCount).toBe(6);
    expect(lv1.lives).toBe(6);

    expect(lv10.rows * lv10.cols).toBe(40); // 5×8 = 40 tiles (20 pairs)
    expect(lv35.rows * lv35.cols).toBe(72); // 6×12 = 72 tiles (36 pairs)
    expect(lv100.rows * lv100.cols).toBe(112); // 8×14 = 112 tiles (56 pairs)
    expect(lv250.rows).toBe(9);
    expect(lv250.cols).toBe(16);
    expect(lv250.totalPairs).toBe(72); // Classic 144 tiles
    expect(lv777.rows).toBe(10);
    expect(lv777.cols).toBe(16);
    expect(lv777.totalPairs).toBe(80); // Grandmaster 160 tiles

    // Monotonic non-decreasing tile count, even cell count, fixed 20-minute timer & +20s match bonus across all 777 stages
    let prevTiles = 0;
    for (let s = 1; s <= 777; s++) {
      const cfg = getOnetStageConfig(s);
      expect(cfg.totalTiles % 2).toBe(0);
      expect(cfg.totalTiles).toBeGreaterThanOrEqual(prevTiles);
      expect(cfg.timeLimitSec).toBe(1200);
      expect(cfg.matchBonusSec).toBe(20);
      prevTiles = cfg.totalTiles;
    }

    expect(lv1.findAnyValidPair()).not.toBeNull();
    expect(lv250.findAnyValidPair()).not.toBeNull();
    expect(lv777.findAnyValidPair()).not.toBeNull();

    // Countdown timer mechanics: 20:00 at every level, tick, +20s match refill, timeout loss, and bonus-time revival
    expect(lv1.timeLimitSec).toBe(1200);
    expect(lv777.timeLimitSec).toBe(1200);
    expect(lv1.formatRemainingTime()).toBe('20:00');
    const tick1 = lv1.tickTimer(15.4);
    expect(tick1.timedOut).toBe(false);
    expect(tick1.wholeSecondChanged).toBe(true);
    expect(lv1.formatRemainingTime()).toBe('19:45');

    // Sandbox / infiniteTime keeps clock full
    const sandboxGame = new CreatureOnetEngine(1);
    expect(sandboxGame.tickTimer(500, true).timedOut).toBe(false);
    expect(sandboxGame.status).toBe('playing');
    expect(sandboxGame.timeRemainingSec).toBe(sandboxGame.timeLimitSec);

    // Expiring countdown transitions to status='lost' with lossReason='timeout' & blocks manual shuffle
    const timeoutGame = new CreatureOnetEngine(1);
    const tickOut = timeoutGame.tickTimer(timeoutGame.timeLimitSec + 1);
    expect(tickOut.timedOut).toBe(true);
    expect(timeoutGame.status).toBe('lost');
    expect(timeoutGame.lossReason).toBe('timeout');
    expect(timeoutGame.formatRemainingTime()).toBe('00:00');
    expect(timeoutGame.useManualShuffle(false).ok).toBe(false);

    // Reviving with extra time (e.g. Apple Pie / Companion) restores 'playing'
    timeoutGame.reviveWithExtraLives(2, 35);
    expect(timeoutGame.status).toBe('playing');
    expect(timeoutGame.lossReason).toBeNull();
    expect(timeoutGame.timeRemainingSec).toBe(35);

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

    // Stage 1 ('none') keeps remaining tiles stationary on match and adds exact +20s per successful connection (accumulating above 20:00)
    const staticGame = new CreatureOnetEngine(1);
    staticGame.tickTimer(10);
    const timeBeforeMatch = staticGame.timeRemainingSec;
    expect(timeBeforeMatch).toBe(1190);
    const hintRes = staticGame.useHint();
    expect(hintRes.ok).toBe(true);
    const [pA, pB] = hintRes.pair!;
    const snapshot = staticGame.grid.map((row) => [...row]);
    staticGame.selected = null;
    expect(staticGame.tapCell(pA.r, pA.c).action).toBe('selected');
    const matchStep = staticGame.tapCell(pB.r, pB.c);
    expect(matchStep.action).toBe('matched');
    expect(staticGame.timeRemainingSec).toBe(timeBeforeMatch + 20);
    expect(staticGame.formatRemainingTime()).toBe('20:10');
    const exportedAbove20Min = staticGame.exportSession();
    const restoredAbove20Min = new CreatureOnetEngine(1);
    expect(restoredAbove20Min.restoreSession(exportedAbove20Min)).toBe(true);
    expect(restoredAbove20Min.timeRemainingSec).toBe(1210);
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

    // Stage 2 ('down', 4×6) shifts column tiles downward into bottom gaps!
    const downGame = new CreatureOnetEngine(2);
    const bottomR = downGame.rows - 1;
    for (let r = 0; r < downGame.rows; r++) {
      for (let c = 0; c < downGame.cols; c++) {
        downGame.grid[r][c] = null;
      }
    }
    downGame.matchedPairs = downGame.totalPairs - 2;
    downGame.grid[1][2] = 'phoenix';
    downGame.grid[1][4] = 'phoenix';
    downGame.grid[bottomR][2] = 'niffler';
    downGame.grid[bottomR][3] = 'niffler';
    downGame.tapCell(bottomR, 2);
    const downMatch = downGame.tapCell(bottomR, 3);
    expect(downMatch.action).toBe('matched');
    expect(downGame.grid[bottomR][2]).toBe('phoenix');
    expect(downGame.grid[1][2]).toBeNull();
    expect(downGame.slideVfxQueue.length).toBeGreaterThanOrEqual(1);

    // Manual shuffle spends 1 ❤️
    const shuffleGame = new CreatureOnetEngine(250);
    const startLives = shuffleGame.lives;
    expect(shuffleGame.useManualShuffle(false).ok).toBe(true);
    expect(shuffleGame.lives).toBe(startLives - 1);

    // Play a full stage with shifting gravity (Stage 6: 'center_h', 4×8 = 32 tiles) to 'won'
    const fullGame = new CreatureOnetEngine(6);
    fullGame.tickTimer(fullGame.timeLimitSec + 5); // force timeout first
    expect(fullGame.status).toBe('lost');
    const talRes = fullGame.applyPhoenixTalisman(); // Phoenix Talisman revives timeout + adds bonus time + clears 3 pairs!
    expect(talRes.ok).toBe(true);
    expect(talRes.clearedPairs).toBe(3);
    expect(fullGame.status).toBe('playing');
    expect(fullGame.timeRemainingSec).toBeGreaterThanOrEqual(45);

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
    expect('housePoints' in sim.state).toBe(false); // HPVN: house points are the server's, never the page's

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

  it('supports zoom in/out, pan clamping, portrait/landscape orientation, and inverse pointer rotation across all 6 mini-games', () => {
    expect(clampMinigameZoom(0.2)).toBe(MINIGAME_ZOOM_MIN);
    expect(clampMinigameZoom(5.0)).toBe(MINIGAME_ZOOM_MAX);
    expect(clampMinigameZoom(1.3)).toBe(1.3);

    // Portrait-locked phone (390×844) switched to Landscape rotates modal 90° CW
    const mobLand = resolveMinigameOrientation('landscape', 390, 844, false, false);
    expect(mobLand.effectiveLayout).toBe('landscape');
    expect(mobLand.dialogQuarterTurn).toBe(1);

    // Landscape phone (844×390) switched to Portrait rotates modal 270° CW (-90°)
    const mobPort = resolveMinigameOrientation('portrait', 844, 390, false, false);
    expect(mobPort.effectiveLayout).toBe('portrait');
    expect(mobPort.dialogQuarterTurn).toBe(3);

    // Wide desktop (1440×900) switched to Portrait keeps upright frame (0°) and switches layout to portrait
    const deskPort = resolveMinigameOrientation('portrait', 1440, 900, false, false);
    expect(deskPort.effectiveLayout).toBe('portrait');
    expect(deskPort.dialogQuarterTurn).toBe(0);

    // Inverse pointer mapping for 0°, 90°, 180°, 270°
    // Local point (lu=0.25, lv=0.75) inside a 200×100 element rotated 90° CW (visual rect 100×200 at (10, 20)):
    // Forward 90° CW maps (lu, lv) -> visual (u = 1 - lv = 0.25, v = lu = 0.25) -> screen (10 + 25, 20 + 50) = (35, 70)
    const inv90 = clientToLocalNormalized(35, 70, { left: 10, top: 20, width: 100, height: 200 }, 1);
    expect(inv90.lu).toBeCloseTo(0.25, 5);
    expect(inv90.lv).toBeCloseTo(0.75, 5);

    const inv180 = clientToLocalNormalized(160, 45, { left: 10, top: 20, width: 200, height: 100 }, 2);
    expect(inv180.lu).toBeCloseTo(0.25, 5);
    expect(inv180.lv).toBeCloseTo(0.75, 5);

    const inv270 = clientToLocalNormalized(85, 170, { left: 10, top: 20, width: 100, height: 200 }, 3);
    expect(inv270.lu).toBeCloseTo(0.25, 5);
    expect(inv270.lv).toBeCloseTo(0.75, 5);

    expect(screenDeltaToViewportDelta(12, -8, 1)).toEqual({ vx: -8, vy: -12 });
    expect(combineQuarterTurns(1, 3)).toBe(0);
    expect(computeBoardFitScale(600, 400, 600, 400, 1)).toBeCloseTo(400 / 600, 4);
    expect(clampMinigamePan(999, -999, 500, 500, 500, 500, 1, 0)).toEqual({ panX: 0, panY: 0 });

    const mgr = new MinigameViewportManager();
    const allSeven = ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw', 'seedquiz'] as const;
    for (const gid of allSeven) {
      expect(mgr.getState(gid).zoom).toBe(1);
      mgr.setZoom(gid, 2.2);
      expect(mgr.getState(gid).zoom).toBe(2.2);
      // upstream 0d0f32b: no zoom buttons in the DOM, zooming is finger pinch only
      expect(mgr.renderToolbarHtml(gid)).toBe('');
      mgr.resetView(gid);
      expect(mgr.getState(gid).zoom).toBe(1);
      expect(mgr.getState(gid).panX).toBe(0);
      expect(mgr.getState(gid).panY).toBe(0);
    }
    mgr.setZoom('jigsaw', 5.4);
    expect(mgr.getState('jigsaw').zoom).toBe(5.4);
  });
});
