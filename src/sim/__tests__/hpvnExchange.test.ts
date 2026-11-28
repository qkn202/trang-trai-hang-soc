import { beforeEach, describe, expect, it, vi } from 'vitest';

const bridgeMocks = vi.hoisted(() => ({
  request: vi.fn(),
  flushFarmSave: vi.fn().mockResolvedValue(undefined),
  deliverInbox: vi.fn(),
  isStandaloneLocal: false,
  identity: null as { uid: string; displayName: string; house: string; nonce: string; issuedAt: number } | null,
}));

vi.mock('../../hpvn/bridge', () => ({
  request: bridgeMocks.request,
  flushFarmSave: bridgeMocks.flushFarmSave,
  queueFarmSave: vi.fn(),
  enqueueProofOfPlay: vi.fn(),
  deliverInbox: bridgeMocks.deliverInbox,
  shareFarmPhoto: vi.fn().mockResolvedValue(undefined),
  MAX_SAVE_BYTES: 1_000_000,
  get isStandaloneLocal() {
    return bridgeMocks.isStandaloneLocal;
  },
  get identity() {
    return bridgeMocks.identity;
  },
}));

import {
  ALLIANCE_FIRST_SEASON_START_MS,
  ALLIANCE_WEEKLY_MIN_GAMES,
  ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS,
  buildAllianceWeeklyRewardBannerHtml,
  buildAllianceWeeklyRewardRuleHtml,
  computeAllianceWeeklyPrizeSplit,
  computeReverseGalleonsOut,
  DEFAULT_REVERSE_SICKLE_PER_GALLEON,
  evaluateAllianceWeeklyRewardEligibility,
  exchangeGalleons,
  FarmWallet,
  formatCountdownToFridayPayoutVi,
  getAllianceWeeklyScheduleState,
  getFridayPayoutCycleKey,
  getNextFridayPayoutTimeMs,
  resetPendingReverseExchangeForTest,
  validateReverseExchangeEligibility,
} from '../../hpvn/exchange';
import {
  applyHouseCup,
  fetchHouseCup,
  houseCup,
  houseCupAllianceStandings,
  invalidateHouseCupCache,
  resetHouseCupViewForTest,
} from '../../hpvn/houseCup';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';

describe('HPVN Gringotts Reverse Exchange (Cách 1 — 1.000.000 Sickle → 100.000 Galleons)', () => {
  beforeEach(() => {
    bridgeMocks.request.mockReset();
    bridgeMocks.flushFarmSave.mockReset().mockResolvedValue(undefined);
    bridgeMocks.deliverInbox.mockReset();
    resetPendingReverseExchangeForTest();
  });

  it('converts 1,000,000 Sickle to exactly 100,000 Galleons at default 10:1 rate and floors fractions cleanly', () => {
    expect(DEFAULT_REVERSE_SICKLE_PER_GALLEON).toBe(10);
    expect(computeReverseGalleonsOut(1_000_000)).toBe(100_000);
    expect(computeReverseGalleonsOut(500_000)).toBe(50_000);
    expect(computeReverseGalleonsOut(9)).toBe(0);
    expect(computeReverseGalleonsOut(-100)).toBe(0);
    expect(computeReverseGalleonsOut(1_000_000, 20)).toBe(50_000);
  });

  it('enforces reverseEnabled, anti-cheat reverseFlagged, minLevel, Sickle balance, and daily/weekly caps', () => {
    const baseWallet: FarmWallet = {
      enabled: true,
      sicklePerGalleon: 1,
      packs: [100, 500],
      balance: 200_000,
      reverseEnabled: true,
      reverseSicklePerGalleon: 10,
      reversePacks: [1_000_000],
      reverseMinLevel: 10,
      reverseDailyCapGalleons: 100_000,
      reverseTodayGalleons: 0,
      reverseWeeklyCapGalleons: 300_000,
      reverseWeekGalleons: 0,
      reverseFlagged: false,
    };

    // Valid eligible exchange
    expect(validateReverseExchangeEligibility(baseWallet, 1_250_000, 12, 1_000_000)).toEqual({
      ok: true,
      galleonsOut: 100_000,
    });

    // Disabled reverse exchange
    expect(
      validateReverseExchangeEligibility({ ...baseWallet, reverseEnabled: false }, 2_000_000, 20, 1_000_000).ok
    ).toBe(false);

    // Flagged abnormal Sickle spike
    const flagged = validateReverseExchangeEligibility(
      { ...baseWallet, reverseFlagged: true, reverseBlockedReason: 'Cảnh báo Sickle bất thường' },
      2_000_000,
      20,
      1_000_000
    );
    expect(flagged.ok).toBe(false);
    expect(flagged.reason).toContain('Cảnh báo Sickle bất thường');

    // Farm level below minimum gate
    const lowLv = validateReverseExchangeEligibility(baseWallet, 2_000_000, 9, 1_000_000);
    expect(lowLv.ok).toBe(false);
    expect(lowLv.reason).toContain('Cấp 10');

    // Insufficient Sickles in farm
    const lowSickle = validateReverseExchangeEligibility(baseWallet, 999_999, 15, 1_000_000);
    expect(lowSickle.ok).toBe(false);

    // Daily cap hit
    const dailyHit = validateReverseExchangeEligibility(
      { ...baseWallet, reverseTodayGalleons: 100_000 },
      2_000_000,
      15,
      1_000_000
    );
    expect(dailyHit.ok).toBe(false);
    expect(dailyHit.reason).toContain('hạn mức ngày');

    // Weekly cap hit
    const weeklyHit = validateReverseExchangeEligibility(
      { ...baseWallet, reverseWeekGalleons: 250_000 },
      2_000_000,
      15,
      1_000_000
    );
    expect(weeklyHit.ok).toBe(false);
    expect(weeklyHit.reason).toContain('hạn mức tuần');
  });

  it('flushes farm save before calling op:galleons and reuses the same requestId on retry after a failed call', async () => {
    bridgeMocks.request
      .mockRejectedValueOnce(new Error('Kết nối HPVN gián đoạn'))
      .mockResolvedValueOnce({
        balance: 300_000,
        galleons: 100_000,
        sicklesDeducted: 1_000_000,
        remainingSickles: 250_000,
        inbox: [{ id: 'receipt-1' }],
      });

    await expect(exchangeGalleons(1_000_000)).rejects.toThrow('Kết nối HPVN gián đoạn');
    const firstCallPayload = bridgeMocks.request.mock.calls[0]?.[1] as {
      op: string;
      sickles: number;
      requestId: string;
    };
    expect(firstCallPayload.op).toBe('galleons');
    expect(firstCallPayload.sickles).toBe(1_000_000);
    expect(typeof firstCallPayload.requestId).toBe('string');

    // Retrying the same pack reuses the exact same requestId so server never double-debits
    const res = await exchangeGalleons(1_000_000);
    const secondCallPayload = bridgeMocks.request.mock.calls[1]?.[1] as {
      op: string;
      sickles: number;
      requestId: string;
    };
    expect(secondCallPayload.requestId).toBe(firstCallPayload.requestId);
    expect(bridgeMocks.flushFarmSave).toHaveBeenCalledTimes(2);
    expect(bridgeMocks.deliverInbox).toHaveBeenCalledWith([{ id: 'receipt-1' }]);
    expect(res.galleons).toBe(100_000);
    expect(res.remainingSickles).toBe(250_000);
  });
});

describe('Weekly Alliance #1 Galleons Reward (Start Fri 17:00 → End next Fri 16:00 ICT — 200.000 Galleons)', () => {
  it('tracks all 3 schedule phases: upcoming (before Fri 17:00 launch), active (Fri 17:00 → next Fri 16:00), and 1h break (Fri 16:00 → 17:00)', () => {
    // First season launch: Fri 2026-11-20 17:00 ICT = 10:00 UTC
    const fri20Start1700 = Date.UTC(2026, 10, 20, 10, 0, 0, 0);
    // First season end: Fri 2026-11-27 16:00 ICT = 09:00 UTC
    const fri27End1600 = Date.UTC(2026, 10, 27, 9, 0, 0, 0);
    // Second season start: Fri 2026-11-27 17:00 ICT = 10:00 UTC
    const fri27Start1700 = Date.UTC(2026, 10, 27, 10, 0, 0, 0);
    // Second season end: Fri 2026-12-04 16:00 ICT = 09:00 UTC
    const fri04End1600 = Date.UTC(2026, 11, 4, 9, 0, 0, 0);

    expect(ALLIANCE_FIRST_SEASON_START_MS).toBe(fri20Start1700);

    // 1. Before launch: Fri 2026-11-20 12:30 ICT (05:30 UTC) -> countdown to START at 17:00 Fri 20/11
    const fri20Noon = Date.UTC(2026, 10, 20, 5, 30, 0, 0);
    const up = getAllianceWeeklyScheduleState(fri20Noon);
    expect(up.phase).toBe('upcoming');
    expect(up.targetAt).toBe(fri20Start1700);
    expect(up.endsAt).toBe(fri27End1600);
    expect(up.cycleKey).toBe('2026-11-27');
    expect(up.labelVi).toBe('Bắt đầu 17:00 Thứ Sáu');
    expect(formatCountdownToFridayPayoutVi(up.targetAt, fri20Noon)).toBe('Còn 4 giờ 30 phút');

    // 2. Active right at 17:00 ICT Fri 20/11 -> countdown to END at 16:00 Fri 27/11 (6d 23h)
    const activeStart = getAllianceWeeklyScheduleState(fri20Start1700);
    expect(activeStart.phase).toBe('active');
    expect(activeStart.targetAt).toBe(fri27End1600);
    expect(activeStart.cycleKey).toBe('2026-11-27');
    expect(activeStart.labelVi).toBe('Kết thúc 16:00 Thứ Sáu');
    expect(formatCountdownToFridayPayoutVi(activeStart.targetAt, fri20Start1700)).toBe('Còn 6 ngày 23 giờ');
    expect(getNextFridayPayoutTimeMs(fri20Start1700)).toBe(fri27End1600);
    expect(getFridayPayoutCycleKey(fri20Start1700)).toBe('2026-11-27');

    // 3. Active mid-week: Sat 2026-11-21 10:00 ICT (03:00 UTC)
    const satMorning = Date.UTC(2026, 10, 21, 3, 0, 0, 0);
    expect(getAllianceWeeklyScheduleState(satMorning).phase).toBe('active');
    expect(getFridayPayoutCycleKey(satMorning)).toBe('2026-11-27');

    // 4. Break hour: Fri 2026-11-27 16:15 ICT (09:15 UTC) -> ended at 16:00, counts down 45m to 17:00 next week start
    const fri27Break = Date.UTC(2026, 10, 27, 9, 15, 0, 0);
    const brk = getAllianceWeeklyScheduleState(fri27Break);
    expect(brk.phase).toBe('break');
    expect(brk.targetAt).toBe(fri27Start1700);
    expect(brk.endsAt).toBe(fri04End1600);
    expect(brk.cycleKey).toBe('2026-12-04');
    expect(brk.labelVi).toBe('Bắt đầu 17:00 Thứ Sáu');
    expect(formatCountdownToFridayPayoutVi(brk.targetAt, fri27Break)).toBe('Còn 45 phút');

    // 5. Next season active at 17:00 ICT Fri 27/11 -> ends Fri 04/12 16:00 ICT
    const activeWeek2 = getAllianceWeeklyScheduleState(fri27Start1700);
    expect(activeWeek2.phase).toBe('active');
    expect(activeWeek2.endsAt).toBe(fri04End1600);
    expect(activeWeek2.cycleKey).toBe('2026-12-04');
  });

  it('splits 200,000 Galleons evenly among all eligible members of the #1 Alliance', () => {
    expect(ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS).toBe(200_000);
    expect(ALLIANCE_WEEKLY_MIN_GAMES).toBe(5);
    expect(computeAllianceWeeklyPrizeSplit(8)).toEqual({
      poolGalleons: 200_000,
      qualifiedMembers: 8,
      perMemberGalleons: 25_000,
      remainderGalleons: 0,
    });
    expect(computeAllianceWeeklyPrizeSplit(7)).toEqual({
      poolGalleons: 200_000,
      qualifiedMembers: 7,
      perMemberGalleons: 28_571,
      remainderGalleons: 3,
    });
    expect(computeAllianceWeeklyPrizeSplit(0)).toEqual({
      poolGalleons: 200_000,
      qualifiedMembers: 0,
      perMemberGalleons: 0,
      remainderGalleons: 200_000,
    });
  });

  it('requires at least 5 matches in ANY ONE single minigame (scattered plays across games do not qualify)', () => {
    // 2 + 2 + 1 = 5 scattered across 3 minigames -> NOT qualified!
    const scattered = evaluateAllianceWeeklyRewardEligibility({ match3: 2, caro: 2, sudoku: 1 });
    expect(scattered).toEqual({
      qualified: false,
      bestPlays: 2,
      bestDiscipline: 'match3',
      remainingGames: 3,
    });

    // 5 matches in Dò Mìn (caro) -> QUALIFIED!
    const qualified = evaluateAllianceWeeklyRewardEligibility({ match3: 1, caro: 5, jigsaw: 0 });
    expect(qualified).toEqual({
      qualified: true,
      bestPlays: 5,
      bestDiscipline: 'caro',
      remainingGames: 0,
    });
  });

  it('parses server allianceReward in applyHouseCup and renders weekly prize banner & rule HTML', () => {
    applyHouseCup({
      weekKey: '2026-W47',
      mode: 'medals',
      unlimited: true,
      houses: { Gryffindor: 250, Hufflepuff: 200, Slytherin: 175, Ravenclaw: 150 },
      house: 'Gryffindor',
      memberTodayPoints: 80,
      memberDailyCap: 0,
      memberBank: 80,
      memberTier: 1,
      perTier: 300,
      allianceReward: {
        enabled: true,
        poolAmount: 200_000,
        minGamesAnyMinigame: 5,
        startWeekdayVn: 5,
        startHourVn: 17,
        payoutWeekdayVn: 5,
        payoutHourVn: 16,
        cycleKey: '2026-11-27',
        qualifiedCount: 8,
        memberBestPlays: 6,
        memberBestDiscipline: 'caro',
        lastPayout: {
          cycleKey: '2026-11-20-launch',
          allianceNameVi: 'Liên Minh Lửa & Trí',
          houses: ['Ravenclaw', 'Gryffindor'],
          poolAmount: 200_000,
          qualifiedCount: 10,
          perMemberAmount: 20_000,
        },
      },
    });

    const cup = houseCup();
    expect(cup?.allianceReward?.poolAmount).toBe(200_000);
    expect(cup?.allianceReward?.estimatedPerMember).toBe(25_000);
    expect(cup?.allianceReward?.memberQualified).toBe(true);
    expect(cup?.allianceReward?.lastPayout?.perMemberAmount).toBe(20_000);

    const [leading, trailing] = houseCupAllianceStandings('Gryffindor');
    const playerAlliance = leading.isPlayerAlliance ? leading : trailing;
    // Before Fri 20/11 17:00 ICT -> shows "Bắt đầu 17:00 Thứ Sáu"
    const preLaunchBanner = buildAllianceWeeklyRewardBannerHtml({
      cup,
      leadingAlliance: leading,
      playerAlliance,
      noHouse: false,
      nowMs: Date.UTC(2026, 10, 20, 4, 0, 0, 0), // Fri 11:00 ICT -> 6h until 17:00 start
    });
    expect(preLaunchBanner).toContain('200.000 Galleons');
    expect(preLaunchBanner).toContain('Bắt đầu 17:00 Thứ Sáu · Còn 6 giờ');
    expect(preLaunchBanner).toContain('~25.000 Galleons/người');
    expect(preLaunchBanner).toContain('6/5 ván · Dò Mìn');
    expect(preLaunchBanner).toContain('2026-11-20-launch');

    // During active season: Wed 25/11 16:00 ICT -> shows "Kết thúc 16:00 Thứ Sáu · Còn 2 ngày 0 giờ"
    const activeBanner = buildAllianceWeeklyRewardBannerHtml({
      cup,
      leadingAlliance: leading,
      playerAlliance,
      noHouse: false,
      nowMs: Date.UTC(2026, 10, 25, 9, 0, 0, 0),
    });
    expect(activeBanner).toContain('Kết thúc 16:00 Thứ Sáu · Còn 2 ngày 0 giờ');

    const ruleHtml = buildAllianceWeeklyRewardRuleHtml(cup);
    expect(ruleHtml).toContain('200.000 Galleons');
    expect(ruleHtml).toContain('17:00 Thứ Sáu');
    expect(ruleHtml).toContain('16:00 Thứ Sáu');
    expect(ruleHtml).toContain('5 ván');
  });

  it('tracks completed minigame plays accurately on both wins and natural losses without off-by-one', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    // 1st Match-3 win -> exactly 1 play
    sim.completeMatch3LevelVictory(0);
    expect(sim.state.minigamePlays?.match3).toBe(1);
    // Natural Match-3 loss -> 2 plays
    sim.recordMinigamePlay('match3');
    expect(sim.state.minigamePlays?.match3).toBe(2);
    // Puzzle arcade victory + natural loss in Minesweeper (caro) -> 2 plays
    sim.completePuzzleArcadeVictory('caro', { stars: 1, gold: 50, xp: 20, sand: 0 });
    expect(sim.state.minigamePlays?.caro).toBe(1);
    sim.recordMinigamePlay('caro');
    expect(sim.state.minigamePlays?.caro).toBe(2);
    // Rescued victory with skipPlayCount: true does not double-count the already recorded loss
    sim.completePuzzleArcadeVictory('caro', { stars: 1, gold: 50, xp: 20, sand: 0 }, { skipPlayCount: true });
    expect(sim.state.minigamePlays?.caro).toBe(2);
  });

  it('persists farm save BEFORE calling flushFarmSave() on victory across all 6 House Cup minigames', async () => {
    const { setFarmStore } = await import('../simulationLifecycle');
    let latestJson = '';
    const flushedSnapshots: Array<Record<string, any>> = [];
    bridgeMocks.identity = {
      uid: 'test-wizard-cup',
      displayName: 'Test Wizard',
      house: 'gryffindor',
      nonce: 'test-nonce',
      issuedAt: Date.now(),
    };
    setFarmStore({
      read: () => latestJson || null,
      write: (json) => {
        latestJson = json;
      },
    });
    bridgeMocks.flushFarmSave.mockImplementation(async () => {
      flushedSnapshots.push(latestJson ? JSON.parse(latestJson) : {});
    });

    try {
      const sim = new ParkSimulation(new MagicalAudio());
      flushedSnapshots.length = 0;

      sim.completeMatch3LevelVictory(0);
      expect(flushedSnapshots.length).toBeGreaterThanOrEqual(1);
      const m3Snap = flushedSnapshots[flushedSnapshots.length - 1]!;
      expect(m3Snap.match3.maxClearedLevel).toBe(1);
      expect(m3Snap.minigameLeaderboard.records.match3.bestStage).toBe(1);
      expect(m3Snap.minigamePlays.match3).toBe(1);

      const fieldByMode = {
        caro: 'caroCleared',
        sudoku: 'sudokuCleared',
        chess: 'chessCleared',
        blocks: 'blockCleared',
        jigsaw: 'jigsawCleared',
      } as const;

      for (const mode of ['caro', 'sudoku', 'chess', 'blocks', 'jigsaw'] as const) {
        flushedSnapshots.length = 0;
        sim.completePuzzleArcadeVictory(mode, { stars: 1, gold: 50, xp: 20, sand: 0 });
        expect(flushedSnapshots.length, `${mode} must call flushFarmSave on victory`).toBeGreaterThanOrEqual(1);
        const snap = flushedSnapshots[flushedSnapshots.length - 1]!;
        expect(snap.puzzleArcade.arcadeDisciplineRev).toBe(2);
        expect(snap.puzzleArcade[fieldByMode[mode]], `${mode} cleared must be written before flush`).toBe(1);
        expect(snap.minigameLeaderboard.records[mode].bestStage, `${mode} leaderboard must be written before flush`).toBe(1);
        expect(snap.minigamePlays[mode], `${mode} plays must be written before flush`).toBe(1);
      }
    } finally {
      bridgeMocks.identity = null;
      setFarmStore({
        read: () => globalThis.localStorage?.getItem('hangsoc_valley_save_v1') ?? null,
        write: (json) => globalThis.localStorage?.setItem('hangsoc_valley_save_v1', json),
      });
    }
  });

  it('awaits flushFarmSave() BEFORE requesting op: cup and does not cache failed cup requests', async () => {
    resetHouseCupViewForTest();
    const order: string[] = [];
    let releaseFlush!: () => void;
    bridgeMocks.flushFarmSave.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          order.push('flush-start');
          releaseFlush = () => {
            order.push('flush-done');
            // Simulate a save reply without full disciplines clearing the 60s cache
            invalidateHouseCupCache();
            resolve();
          };
        })
    );
    bridgeMocks.request.mockImplementationOnce(async (_action: string, data?: { op?: string }) => {
      order.push(`req:${data?.op ?? ''}`);
      return {
        weekKey: '2026-W48',
        mode: 'medals',
        unlimited: true,
        disciplines: {
          chess: { Gryffindor: 100, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 },
        },
        house: 'Gryffindor',
        memberTodayPoints: 100,
        memberDailyCap: 0,
        memberBank: 100,
        memberTier: 1,
        perTier: 300,
      };
    });

    const pendingCup = fetchHouseCup();
    await Promise.resolve();
    expect(order).toEqual(['flush-start']);
    expect(bridgeMocks.request).not.toHaveBeenCalled();

    releaseFlush();
    const view = await pendingCup;
    expect(order).toEqual(['flush-start', 'flush-done', 'req:cup']);
    expect(view?.disciplines?.chess?.Gryffindor).toBe(100);

    // Within 60s without invalidation, fetchHouseCup serves cached view without hitting server
    bridgeMocks.request.mockClear();
    const cached = await fetchHouseCup();
    expect(cached).toBe(view);
    expect(bridgeMocks.request).not.toHaveBeenCalled();

    // After invalidation + transient error, cache must NOT stay poisoned for 60s
    invalidateHouseCupCache();
    bridgeMocks.request.mockRejectedValueOnce(new Error('network blip'));
    await expect(fetchHouseCup()).rejects.toThrow('network blip');

    bridgeMocks.request.mockResolvedValueOnce({
      weekKey: '2026-W48',
      mode: 'medals',
      disciplines: {
        chess: { Gryffindor: 180, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 },
      },
      house: 'Gryffindor',
      memberTodayPoints: 120,
      memberDailyCap: 0,
      memberBank: 120,
      memberTier: 1,
      perTier: 300,
    });
    const retried = await fetchHouseCup();
    expect(retried?.disciplines?.chess?.Gryffindor).toBe(180);
    resetHouseCupViewForTest();
  });

  it('fetches op: board with period: all_time (limit 3) for Xếp Hạng Tổng and safely routes legacy non-weekly board replies to overall cache only', async () => {
    const {
      clearCachedCloudLeaderboards,
      fetchCloudLeaderboardEntries,
      fetchCloudOverallLeaderboardEntries,
      getCachedCloudLeaderboardEntries,
      getCachedCloudOverallLeaderboardEntries,
      isCloudLeaderboardLegacyFallback,
    } = await import('../minigameLeaderboard');

    clearCachedCloudLeaderboards();
    bridgeMocks.identity = {
      uid: 'uid-board-qa',
      displayName: 'QA Wizard',
      house: 'Ravenclaw',
      nonce: 'n-qa',
      issuedAt: Date.now(),
    };

    try {
      // 1. Legacy server reply on weekly fetch (no period/weekKey/weeklyScore): must NOT pollute weekly cache, MUST hydrate overall cache
      bridgeMocks.request.mockResolvedValueOnce({
        entries: [
          {
            userId: 'legacy_top1',
            name: 'Aries',
            parkName: 'Tháp Ravenclaw',
            friendCode: 'HS-ARIE-01',
            avatarEmoji: '🧙',
            house: 'Ravenclaw',
            primaryValue: 790,
            ratingScore: 150000,
            totalWins: 790,
            bestStreak: 12,
            detailLabelVi: '790 màn',
            updatedAt: 1700000000000,
          },
        ],
      });
      const weeklyFromLegacy = await fetchCloudLeaderboardEntries('match3');
      expect(weeklyFromLegacy).toEqual([]);
      expect(getCachedCloudLeaderboardEntries('match3')).toEqual([]);
      expect(isCloudLeaderboardLegacyFallback('match3')).toBe(true);
      expect(getCachedCloudOverallLeaderboardEntries('match3').map((e) => e.userId)).toEqual(['legacy_top1']);

      // 2. Upgraded server reply on period: 'all_time' fetch -> sends limit: 3 and stores Top 3 all-time entries
      bridgeMocks.request.mockClear();
      bridgeMocks.request.mockResolvedValueOnce({
        period: 'all_time',
        entries: [
          {
            userId: 'all_1',
            name: 'Aries',
            parkName: 'Tháp',
            friendCode: '',
            avatarEmoji: '🧙',
            house: 'Ravenclaw',
            bestStage: 810,
            primaryValue: 810,
            ratingScore: 810,
            totalWins: 810,
            bestStreak: 0,
            detailLabelVi: '810 màn tích luỹ',
            updatedAt: 1700000000000,
          },
          {
            userId: 'all_2',
            name: 'Nguyên',
            parkName: 'Hầm',
            friendCode: '',
            avatarEmoji: '🧙',
            house: 'Slytherin',
            bestStage: 785,
            primaryValue: 785,
            ratingScore: 785,
            totalWins: 785,
            bestStreak: 0,
            detailLabelVi: '785 màn tích luỹ',
            updatedAt: 1700000000000,
          },
          {
            userId: 'all_3',
            name: 'i_love_hp_forever',
            parkName: 'Vườn',
            friendCode: '',
            avatarEmoji: '🧙',
            house: 'Hufflepuff',
            bestStage: 755,
            primaryValue: 755,
            ratingScore: 755,
            totalWins: 755,
            bestStreak: 0,
            detailLabelVi: '755 màn tích luỹ',
            updatedAt: 1700000000000,
          },
        ],
      });
      const overall = await fetchCloudOverallLeaderboardEntries('chess');
      expect(bridgeMocks.request).toHaveBeenCalledWith('farm', {
        op: 'board',
        game: 'chess',
        period: 'all_time',
        limit: 3,
      });
      expect(overall).toHaveLength(3);
      expect(overall.map((e) => [e.name, e.bestStage])).toEqual([
        ['Aries', 810],
        ['Nguyên', 785],
        ['i_love_hp_forever', 755],
      ]);

      // 3. Fallback when server responds with weekly entries carrying bestStage
      bridgeMocks.request.mockResolvedValueOnce({
        period: 'weekly',
        weekKey: '2026-W48',
        entries: [
          {
            userId: 'wk_with_best',
            name: 'Minh Khang',
            parkName: 'Hang Sóc',
            friendCode: '',
            avatarEmoji: '🧙',
            house: 'Gryffindor',
            weekKey: '2026-W48',
            weeklyCleared: 6,
            weeklyScore: 180,
            bestStage: 62,
            primaryValue: 6,
            ratingScore: 180,
            totalWins: 6,
            bestStreak: 4,
            detailLabelVi: '6 màn tuần',
            updatedAt: 1700000000000,
          },
          {
            userId: 'wk_without_best',
            name: 'Chưa Có BestStage',
            parkName: 'Hang Sóc',
            friendCode: '',
            avatarEmoji: '🧙',
            house: 'Slytherin',
            weekKey: '2026-W48',
            weeklyCleared: 10,
            weeklyScore: 300,
            primaryValue: 10,
            ratingScore: 300,
            totalWins: 10,
            bestStreak: 5,
            detailLabelVi: '10 màn tuần',
            updatedAt: 1700000000000,
          },
        ],
      });
      const extracted = await fetchCloudOverallLeaderboardEntries('jigsaw');
      expect(extracted.map((e) => e.userId)).toEqual(['wk_with_best']);
    } finally {
      bridgeMocks.identity = null;
      clearCachedCloudLeaderboards();
    }
  });
});
