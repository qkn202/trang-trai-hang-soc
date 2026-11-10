import { describe, expect, it } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import {
  applyA11ySettingsToDocument,
  applyDeadzone,
  DEFAULT_PLATFORM_A11Y_SETTINGS,
  EscapeBackStack,
  GamepadController,
  getColorblindSafeBadge,
  RADIAL_QUICK_SLICES,
  resolveRadialSliceFromStick,
  syncA11yVolumesToAudio,
  validateTouchHitTarget,
} from '../../ui/accessibility';

describe('P4 — Platform & Accessibility (Gamepad API, Radial Menu, Colorblind Safe Cues, Font Scale, Volume & Hit Target)', () => {
  it('polls Gamepad API with stick deadzone, D-pad edge steps, and 8-slice radial quick menu', () => {
    expect(applyDeadzone(0.08)).toBe(0);
    expect(applyDeadzone(0.5)).toBeGreaterThan(0.3);

    const padCtrl = new GamepadController();
    const idleFrame = padCtrl.poll(null);
    expect(idleFrame.connected).toBe(false);

    // Pan left stick + press D-pad right & Confirm (A)
    const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
    buttons[0].pressed = true; // Confirm
    buttons[15].pressed = true; // D-pad right
    const frame1 = padCtrl.poll({
      axes: [0.6, -0.4, 0, 0],
      buttons,
    });
    expect(frame1.connected).toBe(true);
    expect(frame1.panDx).toBeGreaterThan(0.4);
    expect(frame1.panDy).toBeLessThan(-0.2);
    expect(frame1.cursorStepGx).toBe(1);
    expect(frame1.confirmJustPressed).toBe(true);

    // Holding buttons on next frame should NOT re-trigger edge events
    const frame2 = padCtrl.poll({
      axes: [0.6, -0.4, 0, 0],
      buttons,
    });
    expect(frame2.cursorStepGx).toBe(0);
    expect(frame2.confirmJustPressed).toBe(false);

    // Hold LB (button 4) + push right stick right (angle 0 -> slice 0 'seeds')
    buttons[4].pressed = true;
    const radialFrame = padCtrl.poll({
      axes: [0, 0, 0.9, 0],
      buttons,
    });
    expect(radialFrame.radialOpen).toBe(true);
    expect(radialFrame.radialSliceIndex).toBe(0);
    expect(radialFrame.radialActionId).toBe('seeds');
    expect(RADIAL_QUICK_SLICES.length).toBe(8);
    expect(resolveRadialSliceFromStick(0.1, 0.1)).toBeNull();
  });

  it('provides non-color-only symbols and patterns across all 4 colorblind modes', () => {
    for (const mode of ['none', 'protanopia', 'deuteranopia', 'tritanopia'] as const) {
      const ok = getColorblindSafeBadge('ok', mode);
      const warn = getColorblindSafeBadge('warn', mode);
      const danger = getColorblindSafeBadge('danger', mode);
      const magic = getColorblindSafeBadge('magic', mode);

      // Distinct symbols and patterns so player never relies on color alone
      expect(new Set([ok.symbol, warn.symbol, danger.symbol, magic.symbol]).size).toBe(4);
      expect(new Set([ok.pattern, warn.pattern, danger.pattern, magic.pattern]).size).toBe(4);
    }
  });

  it('applies font scale, high contrast, colorblind attributes, syncs 4 volume sliders, and validates touch targets & escape stack', () => {
    const attrs = new Map<string, string>();
    const fakeDoc = {
      documentElement: {
        setAttribute: (k: string, v: string) => attrs.set(k, v),
      },
    } as unknown as Document;

    applyA11ySettingsToDocument(
      {
        ...DEFAULT_PLATFORM_A11Y_SETTINGS,
        colorblindMode: 'deuteranopia',
        fontScale: 150,
        highContrast: true,
      },
      fakeDoc
    );
    expect(attrs.get('data-colorblind')).toBe('deuteranopia');
    expect(attrs.get('data-font-scale')).toBe('150');
    expect(attrs.get('data-high-contrast')).toBe('true');

    const audio = new MagicalAudio();
    syncA11yVolumesToAudio(
      {
        ...DEFAULT_PLATFORM_A11Y_SETTINGS,
        volumes: { master: 0.5, music: 0.4, sfx: 0.6, ambience: 0.5, voice: 0.8 },
      },
      audio
    );
    expect(audio.ceiling.getVolumes().master).toBe(0.5);
    expect(audio.ceiling.getVolumes().voice).toBe(0.8);

    expect(validateTouchHitTarget(48, 44)).toBe(true);
    expect(validateTouchHitTarget(32, 44)).toBe(false);

    const closedOrder: string[] = [];
    const escStack = new EscapeBackStack();
    escStack.push('settings', () => closedOrder.push('settings'));
    escStack.push('codex', () => closedOrder.push('codex'));
    expect(escStack.size()).toBe(2);
    expect(escStack.popAndCloseTop()).toBe('codex');
    expect(escStack.popAndCloseTop()).toBe('settings');
    expect(closedOrder).toEqual(['codex', 'settings']);
  });
});
