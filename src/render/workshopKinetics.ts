import { FARM_GOODS } from '../data/catalog';
import type { CatalogItem, PlacedBuilding } from '../types/game';

export interface WorkshopKineticState {
  isActive: boolean;
  scaleX: number;
  scaleY: number;
  extraRotorRad: number;
  activeGoodIconKey: string | null;
  furnaceGlowBoost: number;
  pulsePhase: number;
}

const IDLE_STATE: WorkshopKineticState = {
  isActive: false,
  scaleX: 1,
  scaleY: 1,
  extraRotorRad: 0,
  activeGoodIconKey: null,
  furnaceGlowBoost: 0,
  pulsePhase: 0,
};

/**
 * Computes continuous, area-preserving workshop squash-stretch, smooth additive rotor
 * spin (zero angle jump at job start), warm hearth glow, and active recipe icon key.
 */
export function computeWorkshopKineticState(
  item: CatalogItem,
  b: PlacedBuilding,
  nowMs: number,
  reducedMotion = false
): WorkshopKineticState {
  if (
    !item.workshopGroupId ||
    b.awaitingUnveil ||
    b.isBrokenDown ||
    nowMs < b.constructEndsAt
  ) {
    return IDLE_STATE;
  }

  const slot0 = b.workshopQueue?.[0];
  if (!slot0 || slot0.endsAt <= nowMs) {
    return IDLE_STATE;
  }

  const pulsePhase = reducedMotion ? 0 : nowMs * 0.0055 + b.gx * 1.3 + b.gy * 0.9;
  const stretch = reducedMotion ? 0 : Math.sin(pulsePhase) * 0.026;
  const startedAt = slot0.startedAt > 0 ? slot0.startedAt : nowMs;
  const elapsedMs = Math.max(0, nowMs - startedAt);
  const extraRotorRad = reducedMotion ? 0 : elapsedMs * 0.0018;
  const furnaceGlowBoost = reducedMotion
    ? 0.36
    : 0.42 + 0.14 * Math.sin(nowMs * 0.009 + b.gx);
  const activeGoodIconKey = FARM_GOODS[slot0.goodId]?.iconKey ?? null;

  return {
    isActive: true,
    scaleX: 1 + stretch,
    scaleY: 1 - stretch * 1.05,
    extraRotorRad,
    activeGoodIconKey,
    furnaceGlowBoost,
    pulsePhase,
  };
}
