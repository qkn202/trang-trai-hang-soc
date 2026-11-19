import type { GameState } from '../types/game';

export type EconomyAnomalyCode =
  | 'NEGATIVE_BALANCE'
  | 'SICKLE_SPIKE_EXCEEDED'
  | 'COMPOST_SPIKE_EXCEEDED'
  | 'TIME_SAND_SPIKE_EXCEEDED'
  | 'TALISMAN_CAP_EXCEEDED'
  | 'BARN_INJECTION_EXCEEDED'
  | 'LEVEL_JUMP_EXCEEDED';

export interface EconomyBaselineSnapshot {
  capturedAt: number;
  sandboxMode: boolean;
  level: number;
  xp: number;
  galleons: number;
  magicStars: number;
  timeSand: number;
  phoenixTalismans: number;
  herbalCompost: number;
  morningDewPhials: number;
  mugglePlugs: number;
  barnItemTotal: number;
  barnSeedTotal: number;
  buildingCount: number;
}

export interface EconomyIntegrityVerdict {
  ok: boolean;
  exemptSandbox: boolean;
  seal: string;
  flags: EconomyAnomalyCode[];
  elapsedMs: number;
  deltas: {
    sickle: number;
    compost: number;
    timeSand: number;
    phoenixTalismans: number;
    barnItems: number;
    level: number;
  };
}

function sumRecordValues(rec: Record<string, number | undefined> | undefined): number {
  if (!rec) return 0;
  let total = 0;
  for (const val of Object.values(rec)) {
    if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
      total += Math.floor(val);
    }
  }
  return total;
}

function safeInt(val: number | undefined, allowNeg = false): number {
  if (typeof val !== 'number' || !Number.isFinite(val)) return 0;
  return allowNeg ? Math.floor(val) : Math.max(0, Math.floor(val));
}

/**
 * Extracts a lightweight, allocation-minimal snapshot of core economic counters.
 */
export function captureEconomyBaseline(
  state: GameState | EconomyBaselineSnapshot,
  atMs = Date.now()
): EconomyBaselineSnapshot {
  if ('capturedAt' in state && !('buildings' in state)) {
    return { ...state, capturedAt: atMs };
  }
  const gs = state as GameState;
  const barn = gs.farmBarn;
  const barnItemTotal =
    sumRecordValues(barn?.crops as Record<string, number | undefined> | undefined) +
    sumRecordValues(barn?.goods as Record<string, number | undefined> | undefined);
  const barnSeedTotal = sumRecordValues(barn?.seeds as Record<string, number | undefined> | undefined);
  const mugglePlugs = safeInt(barn?.goods?.muggle_plug_kit);

  return {
    capturedAt: atMs,
    sandboxMode: Boolean(gs.sandboxMode),
    level: safeInt(gs.level),
    xp: safeInt(gs.xp),
    galleons: safeInt(gs.galleons, true),
    magicStars: safeInt(gs.match3?.stars),
    timeSand: safeInt(gs.timeSand),
    phoenixTalismans: safeInt(gs.phoenixTalismans),
    herbalCompost: safeInt(gs.herbalCompost),
    morningDewPhials: safeInt(gs.morningDewPhials),
    mugglePlugs,
    barnItemTotal,
    barnSeedTotal,
    buildingCount: Array.isArray(gs.buildings) ? gs.buildings.length : 0,
  };
}

function fnv1a32(seed: number, values: readonly number[]): number {
  let h = seed >>> 0;
  for (let i = 0; i < values.length; i++) {
    const v = Math.trunc(values[i]);
    // Feed 4 bytes little-endian per integer so changes in magnitude alter both hash lanes
    h ^= v & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
    h ^= (v >>> 8) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
    h ^= (v >>> 16) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
    h ^= (v >>> 24) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Computes a deterministic dual-32 FNV-1a state seal (`es1:<hex8>-<hex8>`)
 * over the save's economic core so client/server delta checks share an exact fingerprint.
 */
export function computeEconomyStateSeal(state: GameState | EconomyBaselineSnapshot): string {
  const snap = 'buildings' in state ? captureEconomyBaseline(state, 0) : state;
  const vector = [
    snap.sandboxMode ? 1 : 0,
    snap.level,
    snap.xp,
    snap.galleons,
    snap.magicStars,
    snap.timeSand,
    snap.phoenixTalismans,
    snap.herbalCompost,
    snap.morningDewPhials,
    snap.mugglePlugs,
    snap.barnItemTotal,
    snap.barnSeedTotal,
    snap.buildingCount,
  ];
  const h1 = fnv1a32(0x811c9dc5, vector);
  const h2 = fnv1a32(0x9e3779b1, vector.slice().reverse());
  return `es1:${h1.toString(16).padStart(8, '0')}-${h2.toString(16).padStart(8, '0')}`;
}

/**
 * Pure server/client-ready economy delta verifier.
 * Enforces generous upper bounds across harvest bursts, Market Fair trades, Cargo crates,
 * and Harvest Feast milestones while catching direct console/memory injections.
 */
export function verifyFarmEconomyDelta(
  prev: GameState | EconomyBaselineSnapshot,
  next: GameState,
  elapsedMs: number,
  opts?: { allowInboxSickles?: number; allowInboxSand?: number }
): EconomyIntegrityVerdict {
  const prevSnap = 'buildings' in prev ? captureEconomyBaseline(prev, 0) : prev;
  const nextSnap = captureEconomyBaseline(next, 0);
  const seal = computeEconomyStateSeal(nextSnap);
  const safeElapsedMs = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;

  const deltas = {
    sickle: nextSnap.galleons - prevSnap.galleons,
    compost: nextSnap.herbalCompost - prevSnap.herbalCompost,
    timeSand: nextSnap.timeSand - prevSnap.timeSand,
    phoenixTalismans: nextSnap.phoenixTalismans - prevSnap.phoenixTalismans,
    barnItems: nextSnap.barnItemTotal - prevSnap.barnItemTotal,
    level: nextSnap.level - prevSnap.level,
  };

  if (prevSnap.sandboxMode || nextSnap.sandboxMode) {
    return {
      ok: true,
      exemptSandbox: true,
      seal,
      flags: [],
      elapsedMs: safeElapsedMs,
      deltas,
    };
  }

  const effectiveHours = Math.max(0.25, Math.min(168, safeElapsedMs / 3_600_000));
  const allowSickles = Math.max(0, Math.floor(opts?.allowInboxSickles ?? 0));
  const allowSand = Math.max(0, Math.floor(opts?.allowInboxSand ?? 0));
  const flags: EconomyAnomalyCode[] = [];

  if (nextSnap.galleons < 0) {
    flags.push('NEGATIVE_BALANCE');
  }
  const maxSickleGain =
    18_000 +
    nextSnap.level * 650 +
    allowSickles +
    Math.ceil(effectiveHours * (9_500 + nextSnap.level * 450));
  if (deltas.sickle > maxSickleGain) {
    flags.push('SICKLE_SPIKE_EXCEEDED');
  }
  const maxCompostGain = 45 + Math.ceil(effectiveHours * 36);
  if (deltas.compost > maxCompostGain) {
    flags.push('COMPOST_SPIKE_EXCEEDED');
  }
  const maxSandGain = 35 + allowSand + Math.ceil(effectiveHours * 20);
  if (deltas.timeSand > maxSandGain) {
    flags.push('TIME_SAND_SPIKE_EXCEEDED');
  }
  if (nextSnap.phoenixTalismans > 12 || deltas.phoenixTalismans > 12) {
    flags.push('TALISMAN_CAP_EXCEEDED');
  }
  const maxBarnGain = 320 + Math.ceil(effectiveHours * 260);
  if (deltas.barnItems > maxBarnGain) {
    flags.push('BARN_INJECTION_EXCEEDED');
  }
  const maxLevelJump = Math.max(8, Math.ceil(effectiveHours * 6));
  if (deltas.level > maxLevelJump) {
    flags.push('LEVEL_JUMP_EXCEEDED');
  }

  return {
    ok: flags.length === 0,
    exemptSandbox: false,
    seal,
    flags,
    elapsedMs: safeElapsedMs,
    deltas,
  };
}
