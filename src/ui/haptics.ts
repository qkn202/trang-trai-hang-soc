/**
 * Haptic feedback wrapper routed through `PlatformAdapter` (Track B7):
 * - Native Capacitor iOS / Android: invokes `CoreHaptics` / native tactile impacts.
 * - Browser / PWA: invokes `navigator.vibrate` with user-activation guard.
 */

import { getPlatformAdapter } from '../platform/nativeAdapter';
import type { PlatformHapticStyle } from '../platform/platformAdapter';

export type HapticType = 'light' | 'success' | 'harvest' | 'levelup';

const HAPTIC_STYLE_MAP: Record<HapticType, PlatformHapticStyle> = {
  light: 'light',
  success: 'success',
  harvest: 'medium',
  levelup: 'levelup',
};

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 15,
  success: [20, 40, 20],
  harvest: [30, 40, 30],
  levelup: [40, 60, 40],
};

export function haptic(type: HapticType): boolean {
  const adapter = getPlatformAdapter();
  if (adapter.isNativeShell) {
    void adapter.triggerHaptic(HAPTIC_STYLE_MAP[type] ?? 'light');
    return true;
  }

  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return false;
  }
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive?: boolean } })
    .userActivation;
  if (ua && !ua.hasBeenActive) {
    return false;
  }
  try {
    const pattern = HAPTIC_PATTERNS[type] ?? 15;
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}
