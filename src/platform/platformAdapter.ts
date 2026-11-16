// Track B7: Native Platform Shell Contracts (`PlatformAdapter`).
// Cho phép cùng 1 codebase `ParkSimulation` + `PixiGpuDevice` chạy mượt trên:
//   - Web / PWA (`BrowserPlatformAdapter`)
//   - Desktop Native (`Tauri v2` macOS / Windows / Linux)
//   - Mobile Native (`Capacitor` iOS CoreHaptics / Android Native Haptics + Filesystem + LocalNotifications)

export type PlatformRuntimeKind = 'web' | 'tauri-desktop' | 'capacitor-ios' | 'capacitor-android';

export type PlatformHapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'levelup';

export interface LocalNotificationRequest {
  id: number;
  title: string;
  body: string;
  fireAtMs: number;
}

export interface PlatformAdapter {
  readonly runtimeKind: PlatformRuntimeKind;
  readonly isNativeShell: boolean;
  triggerHaptic(style: PlatformHapticStyle): Promise<void>;
  saveLocalBackup(slotKey: string, jsonPayload: string): Promise<boolean>;
  loadLocalBackup(slotKey: string): Promise<string | null>;
  scheduleNotification(req: LocalNotificationRequest): Promise<boolean>;
}
