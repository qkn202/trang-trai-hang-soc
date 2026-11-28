import { describe, expect, it, vi } from 'vitest';
import { computeAdaptiveDprCap } from '../../engine/rendererShared';
import {
  prepareGpuCanvasForCapture,
  registerGpuBeforeCaptureHook,
} from '../../hpvn/bridge';
import { computeWebGL2AtlasBudget } from '../webgl2/webgl2WorldRenderer';

describe('Sprint 1 — P0 WebGL2 Mobile VRAM, DPR & Capture Invariants', () => {
  it('cuts iOS/mobile WebGL2 atlas VRAM by >60% vs legacy 256 MB while enabling 4-level mipmaps', () => {
    const mobile = computeWebGL2AtlasBudget(true, true);
    expect(mobile.atlasLayers).toBe(4);
    expect(mobile.normalAtlasSize).toBe(1024);
    expect(mobile.albedoMipLevels).toBe(4);
    expect(mobile.spriteMaxDim).toBe(256);
    expect(mobile.useHalfFloatFbo).toBe(false);
    expect(mobile.allocatedAtlasVramMb).toBeLessThanOrEqual(105);

    const desktop = computeWebGL2AtlasBudget(false, true);
    expect(desktop.atlasLayers).toBe(8);
    expect(desktop.normalAtlasSize).toBe(1024);
    expect(desktop.albedoMipLevels).toBe(4);
    expect(desktop.spriteMaxDim).toBe(512);
    expect(desktop.useHalfFloatFbo).toBe(true);
    expect(desktop.allocatedAtlasVramMb).toBeLessThan(210);
  });

  it('respects 30 FPS mobile cap in adaptive DPR instead of permanently degrading phones', () => {
    // Healthy 30 FPS capped phone (~29.5 FPS) must stay at crisp 1.5x DPR, not drop to 1.15x
    expect(computeAdaptiveDprCap(29.5, true, 30)).toBe(1.5);
    // Mild dip on 30 FPS phone (25 FPS) steps down gently to 1.35x
    expect(computeAdaptiveDprCap(25, true, 30)).toBe(1.35);
    // Severe drop (< 22.8 FPS) clamps to 1.15x
    expect(computeAdaptiveDprCap(19, true, 30)).toBe(1.15);

    // Desktop 60 FPS thresholds remain intact
    expect(computeAdaptiveDprCap(58, false, 60)).toBe(2);
    expect(computeAdaptiveDprCap(50, false, 60)).toBe(1.5);
    expect(computeAdaptiveDprCap(40, false, 60)).toBe(1.25);
  });

  it('invokes and cleans up synchronous pre-capture GPU redraw hook safely', () => {
    const spy = vi.fn();
    registerGpuBeforeCaptureHook(spy);
    prepareGpuCanvasForCapture();
    expect(spy).toHaveBeenCalledTimes(1);

    registerGpuBeforeCaptureHook(() => {
      throw new Error('simulated gpu error');
    });
    expect(() => prepareGpuCanvasForCapture()).not.toThrow();

    registerGpuBeforeCaptureHook(null);
  });
});
