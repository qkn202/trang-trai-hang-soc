// Track B7: Native Shell Bridge (`Tauri v2` Desktop + `Capacitor` iOS CoreHaptics / Android)
// Tự động phát hiện runtime thông qua `window.__TAURI_INTERNALS__` hoặc `window.Capacitor`
// mà không ép cài cứng dependency native vào bundle web!

import { BrowserPlatformAdapter } from './browserAdapter';
import {
  LocalNotificationRequest,
  PlatformAdapter,
  PlatformHapticStyle,
  PlatformRuntimeKind,
} from './platformAdapter';

interface CapacitorGlobalBridge {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: {
    Haptics?: {
      impact?: (opts: { style: 'LIGHT' | 'MEDIUM' | 'HEAVY' }) => Promise<void>;
      notification?: (opts: { type: 'SUCCESS' | 'WARNING' | 'ERROR' }) => Promise<void>;
    };
    Filesystem?: {
      writeFile?: (opts: {
        path: string;
        data: string;
        directory: string;
        encoding: string;
      }) => Promise<unknown>;
      readFile?: (opts: {
        path: string;
        directory: string;
        encoding: string;
      }) => Promise<{ data?: string }>;
    };
    LocalNotifications?: {
      schedule?: (opts: {
        notifications: Array<{
          id: number;
          title: string;
          body: string;
          schedule: { at: Date };
        }>;
      }) => Promise<unknown>;
    };
  };
}

interface TauriGlobalBridge {
  invoke?: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
}

export function detectPlatformRuntime(win: unknown = typeof window !== 'undefined' ? window : undefined): PlatformRuntimeKind {
  if (!win || typeof win !== 'object') return 'web';
  const w = win as {
    __TAURI_INTERNALS__?: TauriGlobalBridge;
    __TAURI__?: unknown;
    Capacitor?: CapacitorGlobalBridge;
  };
  if (w.__TAURI_INTERNALS__ || w.__TAURI__) {
    return 'tauri-desktop';
  }
  const cap = w.Capacitor;
  if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) {
    const plat = cap.getPlatform?.().toLowerCase();
    if (plat === 'ios') return 'capacitor-ios';
    if (plat === 'android') return 'capacitor-android';
  }
  return 'web';
}

export class NativePlatformAdapter implements PlatformAdapter {
  public readonly runtimeKind: PlatformRuntimeKind;
  public readonly isNativeShell = true;
  private readonly fallback = new BrowserPlatformAdapter();
  private readonly winRef: {
    __TAURI_INTERNALS__?: TauriGlobalBridge;
    Capacitor?: CapacitorGlobalBridge;
  };

  constructor(
    runtimeKind: Exclude<PlatformRuntimeKind, 'web'>,
    winRef: unknown = typeof window !== 'undefined' ? window : {}
  ) {
    this.runtimeKind = runtimeKind;
    this.winRef = (winRef ?? {}) as {
      __TAURI_INTERNALS__?: TauriGlobalBridge;
      Capacitor?: CapacitorGlobalBridge;
    };
  }

  public async triggerHaptic(style: PlatformHapticStyle): Promise<void> {
    const haptics = this.winRef.Capacitor?.Plugins?.Haptics;
    if (haptics) {
      try {
        if (style === 'success' || style === 'levelup') {
          if (haptics.notification) {
            await haptics.notification({ type: 'SUCCESS' });
            return;
          }
        } else if (style === 'warning') {
          if (haptics.notification) {
            await haptics.notification({ type: 'WARNING' });
            return;
          }
        } else if (haptics.impact) {
          const capStyle =
            style === 'heavy' ? 'HEAVY' : style === 'medium' ? 'MEDIUM' : 'LIGHT';
          await haptics.impact({ style: capStyle });
          return;
        }
      } catch {
        // Fallback cleanly
      }
    }
    await this.fallback.triggerHaptic(style);
  }

  public async saveLocalBackup(slotKey: string, jsonPayload: string): Promise<boolean> {
    const safeFile = `hangsoc_${slotKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    if (this.runtimeKind === 'tauri-desktop' && this.winRef.__TAURI_INTERNALS__?.invoke) {
      try {
        await this.winRef.__TAURI_INTERNALS__.invoke('plugin:fs|write_text_file', {
          path: safeFile,
          contents: jsonPayload,
        });
        return true;
      } catch {
        // Fallback to web storage
      }
    }
    const fsPlugin = this.winRef.Capacitor?.Plugins?.Filesystem;
    if (fsPlugin?.writeFile) {
      try {
        await fsPlugin.writeFile({
          path: safeFile,
          data: jsonPayload,
          directory: 'DOCUMENTS',
          encoding: 'utf8',
        });
        return true;
      } catch {
        // Fallback to web storage
      }
    }
    return this.fallback.saveLocalBackup(slotKey, jsonPayload);
  }

  public async loadLocalBackup(slotKey: string): Promise<string | null> {
    const safeFile = `hangsoc_${slotKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    if (this.runtimeKind === 'tauri-desktop' && this.winRef.__TAURI_INTERNALS__?.invoke) {
      try {
        const res = await this.winRef.__TAURI_INTERNALS__.invoke('plugin:fs|read_text_file', {
          path: safeFile,
        });
        if (typeof res === 'string') return res;
      } catch {
        // Fallback
      }
    }
    const fsPlugin = this.winRef.Capacitor?.Plugins?.Filesystem;
    if (fsPlugin?.readFile) {
      try {
        const out = await fsPlugin.readFile({
          path: safeFile,
          directory: 'DOCUMENTS',
          encoding: 'utf8',
        });
        if (typeof out?.data === 'string') return out.data;
      } catch {
        // Fallback
      }
    }
    return this.fallback.loadLocalBackup(slotKey);
  }

  public async scheduleNotification(req: LocalNotificationRequest): Promise<boolean> {
    const localNotif = this.winRef.Capacitor?.Plugins?.LocalNotifications;
    if (localNotif?.schedule) {
      try {
        await localNotif.schedule({
          notifications: [
            {
              id: req.id,
              title: req.title,
              body: req.body,
              schedule: { at: new Date(Math.max(Date.now() + 1000, req.fireAtMs)) },
            },
          ],
        });
        return true;
      } catch {
        // Fallback
      }
    }
    return this.fallback.scheduleNotification(req);
  }
}

let singletonAdapter: PlatformAdapter | null = null;

export function createPlatformAdapterForWindow(win?: unknown): PlatformAdapter {
  const kind = detectPlatformRuntime(win);
  if (kind === 'web') {
    return new BrowserPlatformAdapter();
  }
  return new NativePlatformAdapter(kind, win);
}

export function getPlatformAdapter(): PlatformAdapter {
  if (!singletonAdapter) {
    singletonAdapter = createPlatformAdapterForWindow();
  }
  return singletonAdapter;
}
