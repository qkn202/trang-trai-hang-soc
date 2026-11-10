import { describe, expect, it } from 'vitest';
import {
  AudioCeilingController,
  computeSpatialCue,
  getFanfareSequence,
  pickBgmMood,
  softClipGain,
} from '../audio';

describe('Adaptive BGM Mood Engine (pickBgmMood)', () => {
  describe('Festival Priority Overrides', () => {
    it('overrides clear daylight during festival', () => {
      expect(pickBgmMood('day', 'clear', true)).toBe('festival');
    });

    it('overrides severe storm during festival (edge case: festival + storm -> festival)', () => {
      expect(pickBgmMood('day', 'storm', true)).toBe('festival');
    });

    it('overrides nighttime storm during festival', () => {
      expect(pickBgmMood('night', 'storm', true)).toBe('festival');
    });

    it('overrides dusk rain during festival', () => {
      expect(pickBgmMood('dusk', 'rain', true)).toBe('festival');
    });

    it('overrides dawn snow during festival', () => {
      expect(pickBgmMood('dawn', 'snow', true)).toBe('festival');
    });

    it('overrides nighttime fog during festival', () => {
      expect(pickBgmMood('night', 'fog', true)).toBe('festival');
    });

    it('overrides dusk cloudy during festival', () => {
      expect(pickBgmMood('dusk', 'cloudy', true)).toBe('festival');
    });

    it('overrides fireflies night during festival', () => {
      expect(pickBgmMood('night', 'fireflies', true)).toBe('festival');
    });
  });

  describe('Storm Priority (festival inactive)', () => {
    it('selects storm during daytime storm', () => {
      expect(pickBgmMood('day', 'storm', false)).toBe('storm');
    });

    it('selects storm during nighttime storm (storm overrides night)', () => {
      expect(pickBgmMood('night', 'storm', false)).toBe('storm');
    });

    it('selects storm during dusk storm (storm overrides dusk)', () => {
      expect(pickBgmMood('dusk', 'storm', false)).toBe('storm');
    });

    it('selects storm during dawn storm', () => {
      expect(pickBgmMood('dawn', 'storm', false)).toBe('storm');
    });
  });

  describe('Rain / Snow / Fog Weather (weather in [rain, snow, fog])', () => {
    it('maps daytime rain to rain mood', () => {
      expect(pickBgmMood('day', 'rain', false)).toBe('rain');
    });

    it('maps nighttime rain to rain mood', () => {
      expect(pickBgmMood('night', 'rain', false)).toBe('rain');
    });

    it('maps dusk rain to rain mood', () => {
      expect(pickBgmMood('dusk', 'rain', false)).toBe('rain');
    });

    it('maps dawn rain to rain mood', () => {
      expect(pickBgmMood('dawn', 'rain', false)).toBe('rain');
    });

    it('maps daytime snow to rain mood', () => {
      expect(pickBgmMood('day', 'snow', false)).toBe('rain');
    });

    it('maps nighttime snow to rain mood', () => {
      expect(pickBgmMood('night', 'snow', false)).toBe('rain');
    });

    it('maps dusk snow to rain mood', () => {
      expect(pickBgmMood('dusk', 'snow', false)).toBe('rain');
    });

    it('maps dawn snow to rain mood', () => {
      expect(pickBgmMood('dawn', 'snow', false)).toBe('rain');
    });

    it('maps daytime fog to rain mood', () => {
      expect(pickBgmMood('day', 'fog', false)).toBe('rain');
    });

    it('maps nighttime fog to rain mood', () => {
      expect(pickBgmMood('night', 'fog', false)).toBe('rain');
    });

    it('maps dusk fog to rain mood', () => {
      expect(pickBgmMood('dusk', 'fog', false)).toBe('rain');
    });

    it('maps dawn fog to rain mood', () => {
      expect(pickBgmMood('dawn', 'fog', false)).toBe('rain');
    });
  });

  describe('Night & Dusk Time-of-Day (festival & bad weather inactive)', () => {
    it('selects night for clear night', () => {
      expect(pickBgmMood('night', 'clear', false)).toBe('night');
    });

    it('selects night for clear dusk', () => {
      expect(pickBgmMood('dusk', 'clear', false)).toBe('night');
    });

    it('selects night for cloudy night', () => {
      expect(pickBgmMood('night', 'cloudy', false)).toBe('night');
    });

    it('selects night for cloudy dusk', () => {
      expect(pickBgmMood('dusk', 'cloudy', false)).toBe('night');
    });

    it('selects night for night with fireflies', () => {
      expect(pickBgmMood('night', 'fireflies', false)).toBe('night');
    });

    it('selects night for dusk with fireflies', () => {
      expect(pickBgmMood('dusk', 'fireflies', false)).toBe('night');
    });

    it('selects night for sunny weather at night', () => {
      expect(pickBgmMood('night', 'sunny', false)).toBe('night');
    });
  });

  describe('Day & Dawn Peaceful Weather', () => {
    it('selects day for clear day', () => {
      expect(pickBgmMood('day', 'clear', false)).toBe('day');
    });

    it('selects day for clear dawn', () => {
      expect(pickBgmMood('dawn', 'clear', false)).toBe('day');
    });

    it('selects day for cloudy day', () => {
      expect(pickBgmMood('day', 'cloudy', false)).toBe('day');
    });

    it('selects day for cloudy dawn', () => {
      expect(pickBgmMood('dawn', 'cloudy', false)).toBe('day');
    });

    it('selects day for fireflies during day', () => {
      expect(pickBgmMood('day', 'fireflies', false)).toBe('day');
    });

    it('selects day for sunny day (WeatherKind canonical sunny)', () => {
      expect(pickBgmMood('day', 'sunny', false)).toBe('day');
    });
  });

  describe('P2 — Audio Ceiling (5-Bus Mixer, Soft Limiter, Modal Ducking, 3-Stem Intensity, Spatial Cue)', () => {
    it('prevents clipping above headroom via softClipGain', () => {
      expect(softClipGain(0)).toBe(0);
      expect(softClipGain(-1)).toBe(0);
      expect(softClipGain(0.5)).toBeCloseTo(0.5);
      expect(softClipGain(2.5, 0.94)).toBeLessThanOrEqual(0.94);
      expect(softClipGain(10.0, 0.94)).toBeLessThanOrEqual(0.94);
    });

    it('ducks music and ambience smoothly when modal opens and restores when modal closes', () => {
      const ctrl = new AudioCeilingController();
      const baseMusic = ctrl.getEffectiveBusGain('music');
      const baseAmb = ctrl.getEffectiveBusGain('ambience');
      const baseSfx = ctrl.getEffectiveBusGain('sfx');

      ctrl.setModalDucking(true);
      expect(ctrl.isModalDucked()).toBe(true);
      for (let i = 0; i < 10; i++) ctrl.tick(0.05);

      const duckedMusic = ctrl.getEffectiveBusGain('music');
      const duckedAmb = ctrl.getEffectiveBusGain('ambience');
      expect(duckedMusic).toBeLessThan(baseMusic * 0.5);
      expect(duckedAmb).toBeLessThan(baseAmb * 0.6);
      // SFX is not ducked by modal
      expect(ctrl.getEffectiveBusGain('sfx')).toBeCloseTo(baseSfx);

      // Restore modal ducking
      ctrl.setModalDucking(false);
      expect(ctrl.isModalDucked()).toBe(false);
      for (let i = 0; i < 10; i++) ctrl.tick(0.05);
      expect(ctrl.getEffectiveBusGain('music')).toBeCloseTo(baseMusic, 2);
      expect(ctrl.getEffectiveBusGain('ambience')).toBeCloseTo(baseAmb, 2);
    });

    it('transitions 3-stem intensity smoothly on pulse and decays back to baseline without clipping', () => {
      const ctrl = new AudioCeilingController();
      expect(ctrl.getStems().intensity).toBe(0);

      ctrl.triggerIntensityPulse(0.6);
      ctrl.tick(0.2);
      const midIntensity = ctrl.getStems().intensity;
      expect(midIntensity).toBeGreaterThan(0.2);
      expect(ctrl.getEffectiveBusGain('music')).toBeLessThanOrEqual(0.94);

      // Natural decay over several seconds
      for (let i = 0; i < 40; i++) ctrl.tick(0.2);
      expect(ctrl.getStems().intensity).toBe(0);
    });

    it('computes bounded stereo pan [-0.75..0.75] and distance attenuation for spatial cues', () => {
      const leftCue = computeSpatialCue(50, 300, 1000, 600, 1.0);
      const centerCue = computeSpatialCue(500, 300, 1000, 600, 1.0);
      const rightCue = computeSpatialCue(950, 300, 1000, 600, 1.0);

      expect(leftCue.pan).toBeLessThan(0);
      expect(leftCue.pan).toBeGreaterThanOrEqual(-0.75);
      expect(centerCue.pan).toBe(0);
      expect(rightCue.pan).toBeGreaterThan(0);
      expect(rightCue.pan).toBeLessThanOrEqual(0.75);
      expect(centerCue.gainMul).toBeGreaterThan(leftCue.gainMul);
    });

    it('returns non-empty polyphonic fanfare sequences for win, harvest_combo, build_complete, unveil_ribbon', () => {
      expect(getFanfareSequence('win').length).toBeGreaterThanOrEqual(4);
      expect(getFanfareSequence('harvest_combo').length).toBeGreaterThanOrEqual(3);
      expect(getFanfareSequence('build_complete').length).toBeGreaterThanOrEqual(4);
      expect(getFanfareSequence('unveil_ribbon').length).toBeGreaterThanOrEqual(4);
    });
  });
});
