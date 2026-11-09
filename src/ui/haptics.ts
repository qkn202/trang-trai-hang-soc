/**
 * Haptic feedback wrapper for mobile devices using navigator.vibrate.
 * Safely guards against environments without vibration support (iOS Safari, desktop).
 */

export type HapticType = 'light' | 'success' | 'harvest' | 'levelup';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 15,
  success: [20, 40, 20],
  harvest: [30, 40, 30],
  levelup: [40, 60, 40],
};

export function haptic(type: HapticType): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return false;
  }
  try {
    const pattern = HAPTIC_PATTERNS[type] ?? 15;
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}
