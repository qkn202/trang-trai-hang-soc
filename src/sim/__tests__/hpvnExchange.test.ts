import { beforeEach, describe, expect, it, vi } from 'vitest';

const bridgeMocks = vi.hoisted(() => ({
  request: vi.fn(),
  flushFarmSave: vi.fn().mockResolvedValue(undefined),
  deliverInbox: vi.fn(),
  isStandaloneLocal: false,
}));

vi.mock('../../hpvn/bridge', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../hpvn/bridge')>();
  return {
    ...actual,
    request: bridgeMocks.request,
    flushFarmSave: bridgeMocks.flushFarmSave,
    deliverInbox: bridgeMocks.deliverInbox,
    get isStandaloneLocal() {
      return bridgeMocks.isStandaloneLocal;
    },
  };
});

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
import { applyHouseCup, houseCup, houseCupAllianceStandings } from '../../hpvn/houseCup';
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
});
