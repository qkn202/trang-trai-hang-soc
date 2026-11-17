// HPVN: no outside friend server. The farm is saved through the HPVN bridge (src/hpvn/bridge.ts).
import { identity } from '../hpvn/bridge';
import type { VerifiedRealPlayerProfile } from '../types/game';

export async function registerRealPlayerProfileOnline(_state?: Record<string, unknown>): Promise<boolean> {
  return false;
}

export async function lookupRealPlayerByFriendCode(_rawCode: string): Promise<{
  ok: boolean;
  msg: string;
  profile?: VerifiedRealPlayerProfile;
}> {
  return { ok: false, msg: 'Kết bạn bằng Mã Thung Lũng chưa mở trên HPVN.' };
}

// HPVN: upstream's player id and server-save helpers; the member's id is the HPVN handoff (bridge.ts)
export const getOrCreateClientUserId = (): string => identity?.uid ?? 'hpvn-local';
export const setAuthenticatedUserId = (_uid: string): void => {};
export const isUnplayedFreshSave = (_state: Record<string, unknown>): boolean => false;
