// P4 — Platform & Accessibility:
// 1. Gamepad API Controller (Camera pan, D-Pad tile cursor, Radial 8-slice quick menu, Modal confirm/cancel)
// 2. Colorblind Palettes (protanopia / deuteranopia / tritanopia) + Icon/Pattern cues (không chỉ dựa vào màu)
// 3. Font Scale (100% / 125% / 150%), High Contrast, Keyboard Focus & Escape/Back Stack
// 4. 4 Volume Sliders (Master / Music / SFX / Voice) đồng bộ với AudioCeilingController
// 5. Touch Hit-Target Validator (>= 44x44px) & Screen-Reader Canvas Summary

import type { AudioBusVolumes, MagicalAudio } from '../engine/audio';

export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
export type FontScalePreset = 100 | 125 | 150;

export interface PlatformA11ySettings {
  colorblindMode: ColorblindMode;
  fontScale: FontScalePreset;
  highContrast: boolean;
  keyboardFocusVisible: boolean;
  volumes: AudioBusVolumes;
}

export const DEFAULT_PLATFORM_A11Y_SETTINGS: Readonly<PlatformA11ySettings> = {
  colorblindMode: 'none',
  fontScale: 100,
  highContrast: false,
  keyboardFocusVisible: true,
  volumes: {
    master: 0.9,
    music: 0.8,
    sfx: 0.85,
    ambience: 0.75,
    voice: 0.95,
  },
};

export type SemanticCueTier = 'ok' | 'warn' | 'danger' | 'magic';

export interface ColorblindSafeCue {
  color: string;
  symbol: string;
  pattern: 'solid' | 'striped' | 'dotted' | 'diamond';
  labelVi: string;
}

const COLORBLIND_PALETTES: Record<ColorblindMode, Record<SemanticCueTier, ColorblindSafeCue>> = {
  none: {
    ok: { color: '#22c55e', symbol: '✓', pattern: 'solid', labelVi: 'Hợp lệ' },
    warn: { color: '#f59e0b', symbol: '▲', pattern: 'striped', labelVi: 'Chú ý' },
    danger: { color: '#ef4444', symbol: '✕', pattern: 'dotted', labelVi: 'Cảnh báo' },
    magic: { color: '#a855f7', symbol: '✦', pattern: 'diamond', labelVi: 'Phép thuật' },
  },
  protanopia: {
    ok: { color: '#38bdf8', symbol: '✓', pattern: 'solid', labelVi: 'Hợp lệ' },
    warn: { color: '#facc15', symbol: '▲', pattern: 'striped', labelVi: 'Chú ý' },
    danger: { color: '#fb923c', symbol: '✕', pattern: 'dotted', labelVi: 'Cảnh báo' },
    magic: { color: '#818cf8', symbol: '✦', pattern: 'diamond', labelVi: 'Phép thuật' },
  },
  deuteranopia: {
    ok: { color: '#0ea5e9', symbol: '✓', pattern: 'solid', labelVi: 'Hợp lệ' },
    warn: { color: '#eab308', symbol: '▲', pattern: 'striped', labelVi: 'Chú ý' },
    danger: { color: '#f97316', symbol: '✕', pattern: 'dotted', labelVi: 'Cảnh báo' },
    magic: { color: '#6366f1', symbol: '✦', pattern: 'diamond', labelVi: 'Phép thuật' },
  },
  tritanopia: {
    ok: { color: '#10b981', symbol: '✓', pattern: 'solid', labelVi: 'Hợp lệ' },
    warn: { color: '#f43f5e', symbol: '▲', pattern: 'striped', labelVi: 'Chú ý' },
    danger: { color: '#e11d48', symbol: '✕', pattern: 'dotted', labelVi: 'Cảnh báo' },
    magic: { color: '#06b6d4', symbol: '✦', pattern: 'diamond', labelVi: 'Phép thuật' },
  },
};

export function getColorblindSafeBadge(
  tier: SemanticCueTier,
  mode: ColorblindMode = 'none'
): ColorblindSafeCue {
  const table = COLORBLIND_PALETTES[mode] ?? COLORBLIND_PALETTES.none;
  return table[tier];
}

export function applyA11ySettingsToDocument(
  settings: PlatformA11ySettings,
  doc: Document | undefined = typeof document !== 'undefined' ? document : undefined
): void {
  if (!doc?.documentElement) return;
  const root = doc.documentElement;
  root.setAttribute('data-colorblind', settings.colorblindMode);
  root.setAttribute('data-font-scale', String(settings.fontScale));
  root.setAttribute('data-high-contrast', settings.highContrast ? 'true' : 'false');
  root.setAttribute('data-kb-focus', settings.keyboardFocusVisible ? 'true' : 'false');
}

export function syncA11yVolumesToAudio(settings: PlatformA11ySettings, audio: MagicalAudio): void {
  audio.ceiling.setAllVolumes(settings.volumes);
}

// --- Gamepad API Controller & 8-Slice Radial Quick Menu ---

export type RadialQuickActionId =
  | 'seeds'
  | 'barn'
  | 'orders'
  | 'match3'
  | 'arcade'
  | 'seedquiz'
  | 'neighbors'
  | 'feast';

export const RADIAL_QUICK_SLICES: ReadonlyArray<{
  index: number;
  actionId: RadialQuickActionId;
  labelVi: string;
  icon: string;
}> = [
  { index: 0, actionId: 'seeds', labelVi: 'Túi Hạt Giống', icon: '🌱' },
  { index: 1, actionId: 'barn', labelVi: 'Kho Nông Sản Đỏ', icon: '🏚️' },
  { index: 2, actionId: 'orders', labelVi: 'Đơn Hàng Cú', icon: '🦉' },
  { index: 3, actionId: 'match3', labelVi: 'Bùa Gặt Honeydukes', icon: '🍬' },
  { index: 4, actionId: 'arcade', labelVi: 'Ngũ Ấn Đạo Tặc', icon: '🗺️' },
  { index: 5, actionId: 'seedquiz', labelVi: 'Học Viện Thần Chú', icon: '🪄' },
  { index: 6, actionId: 'neighbors', labelVi: 'Sổ Hàng Xóm', icon: '🏡' },
  { index: 7, actionId: 'feast', labelVi: 'Đại Tiệc Mùa Gặt', icon: '🥧' },
];

export interface GamepadSnapshotInput {
  axes: readonly number[];
  buttons: ReadonlyArray<{ pressed: boolean; value?: number }>;
}

export interface GamepadFrameOutput {
  connected: boolean;
  panDx: number;
  panDy: number;
  cursorStepGx: number;
  cursorStepGy: number;
  radialOpen: boolean;
  radialSliceIndex: number | null;
  radialActionId: RadialQuickActionId | null;
  confirmJustPressed: boolean;
  cancelJustPressed: boolean;
}

export const GAMEPAD_STICK_DEADZONE = 0.18;

export function applyDeadzone(val: number, deadzone = GAMEPAD_STICK_DEADZONE): number {
  if (!Number.isFinite(val) || Math.abs(val) < deadzone) return 0;
  const sign = val < 0 ? -1 : 1;
  const norm = (Math.abs(val) - deadzone) / Math.max(0.001, 1 - deadzone);
  return Number((sign * Math.min(1, norm)).toFixed(3));
}

export function resolveRadialSliceFromStick(rx: number, ry: number): number | null {
  const mag = Math.hypot(rx, ry);
  if (mag < 0.35) return null;
  // Angle in [0, 2pi), 0 = right, clockwise
  let angle = Math.atan2(ry, rx);
  if (angle < 0) angle += Math.PI * 2;
  const sliceWidth = (Math.PI * 2) / 8;
  const shifted = (angle + sliceWidth * 0.5) % (Math.PI * 2);
  return Math.floor(shifted / sliceWidth) % 8;
}

export class GamepadController {
  private prevConfirm = false;
  private prevCancel = false;
  private prevDpadUp = false;
  private prevDpadDown = false;
  private prevDpadLeft = false;
  private prevDpadRight = false;

  public poll(injectedPad?: GamepadSnapshotInput | null): GamepadFrameOutput {
    let pad: GamepadSnapshotInput | null = injectedPad ?? null;
    if (!pad && typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function') {
      const pads = navigator.getGamepads();
      for (const candidate of pads) {
        if (candidate && candidate.connected) {
          pad = candidate;
          break;
        }
      }
    }

    if (!pad) {
      this.prevConfirm = false;
      this.prevCancel = false;
      this.prevDpadUp = false;
      this.prevDpadDown = false;
      this.prevDpadLeft = false;
      this.prevDpadRight = false;
      return {
        connected: false,
        panDx: 0,
        panDy: 0,
        cursorStepGx: 0,
        cursorStepGy: 0,
        radialOpen: false,
        radialSliceIndex: null,
        radialActionId: null,
        confirmJustPressed: false,
        cancelJustPressed: false,
      };
    }

    const lx = applyDeadzone(pad.axes[0] ?? 0);
    const ly = applyDeadzone(pad.axes[1] ?? 0);
    const rx = applyDeadzone(pad.axes[2] ?? 0);
    const ry = applyDeadzone(pad.axes[3] ?? 0);

    const confirmPressed = Boolean(pad.buttons[0]?.pressed);
    const cancelPressed = Boolean(pad.buttons[1]?.pressed);
    const lbPressed = Boolean(pad.buttons[4]?.pressed);
    const dUp = Boolean(pad.buttons[12]?.pressed);
    const dDown = Boolean(pad.buttons[13]?.pressed);
    const dLeft = Boolean(pad.buttons[14]?.pressed);
    const dRight = Boolean(pad.buttons[15]?.pressed);

    const confirmJustPressed = confirmPressed && !this.prevConfirm;
    const cancelJustPressed = cancelPressed && !this.prevCancel;
    const stepGx = (dRight && !this.prevDpadRight ? 1 : 0) - (dLeft && !this.prevDpadLeft ? 1 : 0);
    const stepGy = (dDown && !this.prevDpadDown ? 1 : 0) - (dUp && !this.prevDpadUp ? 1 : 0);

    this.prevConfirm = confirmPressed;
    this.prevCancel = cancelPressed;
    this.prevDpadUp = dUp;
    this.prevDpadDown = dDown;
    this.prevDpadLeft = dLeft;
    this.prevDpadRight = dRight;

    const radialOpen = lbPressed;
    const radialSliceIndex = radialOpen
      ? resolveRadialSliceFromStick(Math.abs(rx) > 0 ? rx : lx, Math.abs(ry) > 0 ? ry : ly)
      : null;
    const radialActionId =
      radialSliceIndex !== null ? RADIAL_QUICK_SLICES[radialSliceIndex]?.actionId ?? null : null;

    return {
      connected: true,
      panDx: radialOpen ? 0 : lx,
      panDy: radialOpen ? 0 : ly,
      cursorStepGx: stepGx,
      cursorStepGy: stepGy,
      radialOpen,
      radialSliceIndex,
      radialActionId,
      confirmJustPressed,
      cancelJustPressed,
    };
  }
}

// --- Touch Hit-Target & Keyboard Escape/Back Stack ---

export const MIN_TOUCH_TARGET_PX = 44;

export function validateTouchHitTarget(widthPx: number, heightPx: number): boolean {
  return widthPx >= MIN_TOUCH_TARGET_PX && heightPx >= MIN_TOUCH_TARGET_PX;
}

export class EscapeBackStack {
  private stack: Array<{ id: string; onClose: () => void }> = [];

  public push(id: string, onClose: () => void): void {
    this.remove(id);
    this.stack.push({ id, onClose });
  }

  public remove(id: string): void {
    this.stack = this.stack.filter((item) => item.id !== id);
  }

  public popAndCloseTop(): string | null {
    const top = this.stack.pop();
    if (!top) return null;
    top.onClose();
    return top.id;
  }

  public size(): number {
    return this.stack.length;
  }
}
