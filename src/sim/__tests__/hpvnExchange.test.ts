import { beforeEach, describe, expect, it, vi } from 'vitest';

const bridgeMocks = vi.hoisted(() => ({
  request: vi.fn(),
  flushFarmSave: vi.fn().mockResolvedValue(undefined),
  deliverInbox: vi.fn(),
  isStandaloneLocal: false,
}));

vi.mock('../../hpvn/bridge', () => ({
  request: bridgeMocks.request,
  flushFarmSave: bridgeMocks.flushFarmSave,
  deliverInbox: bridgeMocks.deliverInbox,
  get isStandaloneLocal() {
    return bridgeMocks.isStandaloneLocal;
  },
}));

import {
  computeReverseGalleonsOut,
  DEFAULT_REVERSE_SICKLE_PER_GALLEON,
  exchangeGalleons,
  FarmWallet,
  resetPendingReverseExchangeForTest,
  validateReverseExchangeEligibility,
} from '../../hpvn/exchange';

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
