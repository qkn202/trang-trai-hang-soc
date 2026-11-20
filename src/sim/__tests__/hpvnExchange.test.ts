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

describe('Weekly Alliance #1 Galleons Reward (Friday 17:00 ICT — 200.000 Galleons split evenly)', () => {
  it('computes the exact Friday 17:00 ICT payout timestamp and cycleKey across week boundaries', () => {
    // 2026-11-20 is a Friday. 17:00 ICT = 10:00 UTC.
    const fri1700Utc = Date.UTC(2026, 10, 20, 10, 0, 0, 0);
    const nextFri1700Utc = Date.UTC(2026, 10, 27, 10, 0, 0, 0);

    // Thursday 2026-11-19 23:00 ICT (16:00 UTC) -> targets Friday 2026-11-20 17:00 ICT
    const thuNight = Date.UTC(2026, 10, 19, 16, 0, 0, 0);
    expect(getNextFridayPayoutTimeMs(thuNight)).toBe(fri1700Utc);
    expect(getFridayPayoutCycleKey(thuNight)).toBe('2026-11-20');
    expect(formatCountdownToFridayPayoutVi(fri1700Utc, thuNight)).toBe('Còn 18 giờ');

    // Friday 2026-11-20 16:59:00 ICT (09:59 UTC) -> still targets today's 17:00 ICT
    const fri1659 = Date.UTC(2026, 10, 20, 9, 59, 0, 0);
    expect(getNextFridayPayoutTimeMs(fri1659)).toBe(fri1700Utc);
    expect(formatCountdownToFridayPayoutVi(fri1700Utc, fri1659)).toBe('Còn 1 phút');

    // Exactly Friday 2026-11-20 17:00:00 ICT -> rolls over to Friday 2026-11-27 17:00 ICT
    expect(getNextFridayPayoutTimeMs(fri1700Utc)).toBe(nextFri1700Utc);
    expect(getFridayPayoutCycleKey(fri1700Utc)).toBe('2026-11-27');

    // Saturday 2026-11-21 10:00 ICT (03:00 UTC) -> weekend play counts toward next Friday 2026-11-27
    const satMorning = Date.UTC(2026, 10, 21, 3, 0, 0, 0);
    expect(getNextFridayPayoutTimeMs(satMorning)).toBe(nextFri1700Utc);
    expect(getFridayPayoutCycleKey(satMorning)).toBe('2026-11-27');
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
        payoutWeekdayVn: 5,
        payoutHourVn: 17,
        cycleKey: '2026-11-20',
        qualifiedCount: 8,
        memberBestPlays: 6,
        memberBestDiscipline: 'caro',
        lastPayout: {
          cycleKey: '2026-11-13',
          allianceNameVi: 'Liên Minh Ánh Dương',
          houses: ['Gryffindor', 'Hufflepuff'],
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
    const bannerHtml = buildAllianceWeeklyRewardBannerHtml({
      cup,
      leadingAlliance: leading,
      playerAlliance,
      noHouse: false,
      nowMs: Date.UTC(2026, 10, 20, 4, 0, 0, 0), // Fri 11:00 ICT -> 6h left
    });
    expect(bannerHtml).toContain('200.000 Galleons');
    expect(bannerHtml).toContain('17:00 Thứ Sáu');
    expect(bannerHtml).toContain('~25.000 Galleons/người');
    expect(bannerHtml).toContain('6/5 ván · Dò Mìn');
    expect(bannerHtml).toContain('2026-11-13');

    const ruleHtml = buildAllianceWeeklyRewardRuleHtml(cup);
    expect(ruleHtml).toContain('200.000 Galleons');
    expect(ruleHtml).toContain('17:00 Thứ Sáu');
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
