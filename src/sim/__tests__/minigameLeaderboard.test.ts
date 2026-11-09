import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import { generateNextQuizChallenge } from '../languageQuizEngine';
import {
  ALL_LEADERBOARD_GAMES,
  buildMinigameLeaderboard,
  LEADERBOARD_GAME_META,
} from '../minigameLeaderboard';
import { ParkSimulation } from '../simulation';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('Per-Mini-Game Leaderboards (6 Wizarding Disciplines)', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('provides independent, deterministically sorted leaderboards for all 6 mini-games', () => {
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

      expect(valley.entries.length).toBeGreaterThanOrEqual(16);
      expect(friends.entries.length).toBe(6); // 5 canon neighbors + player

      // Player appears exactly once in each scope
      expect(valley.entries.filter((e) => e.isPlayer).length).toBe(1);
      expect(friends.entries.filter((e) => e.isPlayer).length).toBe(1);

      // Monotonically sorted descending by primaryValue -> ratingScore -> totalWins
      for (let i = 1; i < valley.entries.length; i++) {
        const prev = valley.entries[i - 1];
        const curr = valley.entries[i];
        expect(curr.rank).toBe(prev.rank + 1);
        const okOrder =
          prev.primaryValue > curr.primaryValue ||
          (prev.primaryValue === curr.primaryValue && prev.ratingScore >= curr.ratingScore);
        expect(okOrder).toBe(true);
      }
    }
  });

  it('tracks independent victories, climbs ranks with positive rankUpBy, and preserves other disciplines', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const initialChessRank = sim.getPlayerMinigameRank('chess', 'valley');
    const initialCaroRank = sim.getPlayerMinigameRank('caro', 'valley');

    // Clear Stage 1 & Stage 2 of Match-3
    const m3Win1 = sim.completeMatch3LevelVictory(12, { sessionScore: 2450 });
    expect(m3Win1.leaderboardRankUp).toBeDefined();
    expect(m3Win1.leaderboardRankUp!.gameId).toBe('match3');
    expect(m3Win1.leaderboardRankUp!.rankUpBy).toBeGreaterThanOrEqual(1);

    const m3Win2 = sim.completeMatch3LevelVictory(18, { sessionScore: 3100 });
    expect(m3Win2.leaderboardRankUp!.newRank).toBeLessThanOrEqual(
      m3Win1.leaderboardRankUp!.newRank
    );

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
    expect(lastChessRank).toBeLessThan(initialChessRank);
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

  it('updates Học Viện Thần Chú Đa Ngữ (seedquiz) leaderboard on correct spell incantations', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const quiz = sim.ensureLanguageQuiz();
    const startRank = sim.getPlayerMinigameRank('seedquiz', 'valley');

    for (let i = 0; i < 5; i++) {
      const ch = generateNextQuizChallenge(quiz, sim.state.level);
      const res = sim.completeSeedLanguageQuizAttempt('ottery_wheat', ch, true);
      expect(res.leaderboardRankUp).toBeDefined();
      expect(res.leaderboardRankUp!.gameId).toBe('seedquiz');
    }

    const afterRank = sim.getPlayerMinigameRank('seedquiz', 'valley');
    expect(afterRank).toBeLessThan(startRank);
    expect(sim.ensureMinigameLeaderboard().records.seedquiz.bestStage).toBe(5);
  });

  it('includes newly added Friend Code neighbors in the Friends leaderboard & persists Personal 6-Game Summary', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const beforeFriends = sim.getMinigameLeaderboard('caro', 'friends');
    expect(beforeFriends.totalEntries).toBe(6);

    const addRes = sim.addFriendByCode('HS-VKRM-88', 'Viktor Krum');
    expect(addRes.ok).toBe(true);

    const afterFriends = sim.getMinigameLeaderboard('caro', 'friends');
    expect(afterFriends.totalEntries).toBe(7);
    expect(afterFriends.entries.some((e) => e.friendCode === 'HS-VKRM-88')).toBe(true);

    const summaries = sim.getAllPersonalLeaderboardSummaries();
    expect(summaries).toHaveLength(6);
    const ids = summaries.map((s) => s.gameId);
    expect(ids).toEqual(['match3', 'caro', 'sudoku', 'chess', 'blocks', 'seedquiz']);

    // Verify cloud merge deduplicates player's own friendCode while adding external cloud wizards
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
        name: 'Newt Scamander',
        parkName: 'Vali Sinh Vật Kỳ Bí',
        friendCode: 'HS-NEWT-77',
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
});
