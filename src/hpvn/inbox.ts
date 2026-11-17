// HPVN: helps other members gave this farm, Sickles bought at the Gringotts counter (src/hpvn/exchange.ts) and the
// «Cúp Đợt» rewards the server awards for house points (src/hpvn/houseCup.ts) wait on the server (the page owns its
// whole save). The load, every save reply and the exchange reply carry the entries numbered past the save's
// `hpvnInboxSeq`; each applies once, then the number moves on and rides in the next save.
import type { GameState } from '../types/game';

export interface FarmInboxEntry { seq: number; kind: 'help' | 'fire-out' | 'sickles' | 'cup'; uid?: string; name?: string; avatarUrl?: string; at: number; sickle?: number; galleons?: number; tier?: number; xp?: number; sand?: number }
const HELP_MS = 15 * 60 * 1000; // upstream FRIEND_HELP_SPEEDUP_MS, the same cut the helper's page draws

/** Applies the new entries to the home farm (`wallet`: the state holding the player's Sickles, the visited farm's
 * while visiting, synced home on save); returns them (for the toasts; a `cup` entry's XP goes through sim.addXp). */
export function applyFarmInbox(state: GameState, entries: unknown, now = Date.now(), wallet: GameState = state): FarmInboxEntry[] {
  if (!Array.isArray(entries)) return [];
  const fresh = (entries as FarmInboxEntry[])
    .filter((entry) => Number.isSafeInteger(entry?.seq) && entry.seq > (state.hpvnInboxSeq ?? 0))
    .sort((a, b) => a.seq - b.seq);
  for (const entry of fresh) {
    if ((entry.kind === 'sickles' || entry.kind === 'cup') && Number.isSafeInteger(entry.sickle) && entry.sickle! > 0) {
      wallet.galleons += entry.sickle!;
      if (entry.kind === 'cup' && Number.isSafeInteger(entry.sand) && entry.sand! > 0) wallet.timeSand += entry.sand!;
    } else if (entry.kind === 'help') {
      for (const b of state.buildings) {
        if (b.cropId && b.cropReadyAt && now < b.cropReadyAt) {
          b.cropWateredBoost = true;
          b.cropReadyAt = Math.max(now + 30_000, b.cropReadyAt - HELP_MS);
        } else if (b.workshopQueue?.length && now < b.workshopQueue[0].endsAt) {
          b.workshopQueue[0].endsAt = Math.max(now + 20_000, b.workshopQueue[0].endsAt - HELP_MS);
        }
      }
    }
    state.hpvnInboxSeq = entry.seq;
  }
  return fresh;
}
