// Track B7: Browser / PWA Fallback Implementation of `PlatformAdapter`.

import {
  LocalNotificationRequest,
  PlatformAdapter,
  PlatformHapticStyle,
} from './platformAdapter';

const WEB_VIBRATE_PATTERNS: Record<PlatformHapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 35,
  success: [12, 35, 22],
  warning: [26, 40, 26],
  levelup: [18, 40, 28, 40, 45],
};

export class BrowserPlatformAdapter implements PlatformAdapter {
  public readonly runtimeKind = 'web' as const;
  public readonly isNativeShell = false;

  public async triggerHaptic(style: PlatformHapticStyle): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(WEB_VIBRATE_PATTERNS[style] ?? 10);
      }
    } catch {
      // Ignored on Safari / desktop browsers without Vibration API
    }
  }

  public async saveLocalBackup(slotKey: string, jsonPayload: string): Promise<boolean> {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`hangsoc_native_bak_${slotKey}`, jsonPayload);
        return true;
      }
    } catch {
      // Quota or private-browsing guard
    }
    return false;
  }

  public async loadLocalBackup(slotKey: string): Promise<string | null> {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(`hangsoc_native_bak_${slotKey}`);
      }
    } catch {
      // Ignored
    }
    return null;
  }

  public async scheduleNotification(req: LocalNotificationRequest): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission !== 'granted') return false;
    const delayMs = Math.max(0, req.fireAtMs - Date.now());
    if (delayMs > 6 * 3600 * 1000) return false;
    window.setTimeout(() => {
      try {
        new Notification(req.title, { body: req.body });
      } catch {
        // Ignored
      }
    }, delayMs);
    return true;
  }
}
