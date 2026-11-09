import { describe, expect, it } from 'vitest';
import { pickBgmMood } from '../audio';

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
});
