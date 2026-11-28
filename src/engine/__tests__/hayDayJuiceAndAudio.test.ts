import { afterEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../audio';
import { HarvestFlightFX, JuiceFX } from '../juiceFx';

interface MockAudioRecorder {
  oscillators: Array<{
    type: OscillatorType;
    initialFreq: number | null;
    ramps: number[];
    started: boolean;
    stopped: boolean;
  }>;
  filters: Array<{
    type: BiquadFilterType;
    initialFreq: number | null;
    ramps: number[];
    q: number | null;
  }>;
  panners: Array<{ pan: number }>;
  bufferSources: number;
  ctx: AudioContext;
}

function createMockAudioContext(): MockAudioRecorder {
  const oscillators: MockAudioRecorder['oscillators'] = [];
  const filters: MockAudioRecorder['filters'] = [];
  const panners: MockAudioRecorder['panners'] = [];
  let bufferSources = 0;

  const ctx = {
    state: 'running',
    currentTime: 10,
    sampleRate: 44100,
    destination: { connect: vi.fn() },
    resume: vi.fn(() => Promise.resolve()),
    suspend: vi.fn(() => Promise.resolve()),
    createOscillator: vi.fn(() => {
      const rec = {
        type: 'sine' as OscillatorType,
        initialFreq: null as number | null,
        ramps: [] as number[],
        started: false,
        stopped: false,
      };
      oscillators.push(rec);
      return {
        get type() {
          return rec.type;
        },
        set type(v: OscillatorType) {
          rec.type = v;
        },
        frequency: {
          setValueAtTime: vi.fn((val: number) => {
            rec.initialFreq = val;
          }),
          exponentialRampToValueAtTime: vi.fn((val: number) => {
            rec.ramps.push(val);
          }),
        },
        connect: vi.fn(),
        start: vi.fn(() => {
          rec.started = true;
        }),
        stop: vi.fn(() => {
          rec.stopped = true;
        }),
      };
    }),
    createGain: vi.fn(() => ({
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createBuffer: vi.fn((_ch: number, len: number, sr: number) => ({
      sampleRate: sr,
      length: len,
      getChannelData: () => new Float32Array(len),
    })),
    createBufferSource: vi.fn(() => {
      bufferSources++;
      return {
        buffer: null,
        loop: false,
        playbackRate: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
    }),
    createBiquadFilter: vi.fn(() => {
      const rec = {
        type: 'lowpass' as BiquadFilterType,
        initialFreq: null as number | null,
        ramps: [] as number[],
        q: null as number | null,
      };
      filters.push(rec);
      return {
        get type() {
          return rec.type;
        },
        set type(v: BiquadFilterType) {
          rec.type = v;
        },
        frequency: {
          value: 20000,
          setValueAtTime: vi.fn((val: number) => {
            rec.initialFreq = val;
          }),
          exponentialRampToValueAtTime: vi.fn((val: number) => {
            rec.ramps.push(val);
          }),
          setTargetAtTime: vi.fn(),
        },
        Q: {
          value: 1,
          setValueAtTime: vi.fn((val: number) => {
            rec.q = val;
          }),
        },
        connect: vi.fn(),
      };
    }),
    createStereoPanner: vi.fn(() => {
      const rec = { pan: 0 };
      panners.push(rec);
      return {
        pan: {
          get value() {
            return rec.pan;
          },
          set value(v: number) {
            rec.pan = v;
          },
        },
        connect: vi.fn(),
      };
    }),
  } as unknown as AudioContext;

  return {
    oscillators,
    filters,
    panners,
    get bufferSources() {
      return bufferSources;
    },
    ctx,
  };
}

function createMockCanvasContext() {
  return {
    canvas: { width: 1280, height: 800 },
    globalAlpha: 1,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  } as unknown as CanvasRenderingContext2D;
}

function installMockWindowAudio(mock: MockAudioRecorder): void {
  function MockAudioContext() {
    return mock.ctx;
  }
  (globalThis as unknown as { window: unknown }).window = {
    AudioContext: MockAudioContext,
    addEventListener: vi.fn(),
  };
}

describe('Hay Day Tactile Audio (MagicalAudio)', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalWindow === undefined) {
      delete (globalThis as unknown as { window?: Window }).window;
    } else {
      (globalThis as unknown as { window?: Window }).window = originalWindow;
    }
  });

  it('runs all 4 new SFX methods cleanly headless without throwing', () => {
    delete (globalThis as unknown as { window?: Window }).window;
    const audio = new MagicalAudio();

    expect(() => {
      for (let i = 0; i <= 16; i++) {
        audio.playSwipeHarvestNote(i, (i - 8) * 0.08);
      }
      for (let i = 0; i <= 8; i++) {
        audio.playSwipeSowNote(i, 0.25);
      }
      for (let i = 0; i <= 6; i++) {
        audio.playWorkshopCollectNote(i, -0.3);
      }
      audio.playMailboxRustle(0.4);
      audio.playSwipeHarvestNote(Number.NaN, Number.NaN);
      audio.playSwipeSowNote(-5, 2.5);
      audio.playWorkshopCollectNote(-2, -3);
    }).not.toThrow();
  });

  it('honors enabled = false across all 4 methods without allocating voices or audio nodes', () => {
    const mock = createMockAudioContext();
    installMockWindowAudio(mock);

    const audio = new MagicalAudio();
    const voiceSpy = vi.spyOn(audio, 'canPlaySfxVoice');
    audio.enabled = false;

    audio.playSwipeHarvestNote(0, 0.3);
    audio.playSwipeSowNote(1, -0.2);
    audio.playWorkshopCollectNote(2, 0.1);
    audio.playMailboxRustle(0.4);

    expect(voiceSpy).not.toHaveBeenCalled();
    expect(mock.oscillators.length).toBe(0);
    expect(mock.bufferSources).toBe(0);
    expect(mock.panners.length).toBe(0);
  });

  it('respects canPlaySfxVoice polyphony cap for all 4 methods', () => {
    const mock = createMockAudioContext();
    installMockWindowAudio(mock);

    const audio = new MagicalAudio();
    vi.spyOn(audio, 'canPlaySfxVoice').mockReturnValue(false);

    audio.playSwipeHarvestNote(2, 0.2);
    audio.playSwipeSowNote(2, -0.2);
    audio.playWorkshopCollectNote(1, 0);
    audio.playMailboxRustle(0.1);

    expect(mock.oscillators.length).toBe(0);
    expect(mock.bufferSources).toBe(0);

    // Verify real 5-voice window cap blocks the 6th rapid swipe call
    vi.restoreAllMocks();
    const audio2 = new MagicalAudio();
    let baseTime = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => baseTime);

    for (let i = 0; i < 8; i++) {
      audio2.playSwipeHarvestNote(i, 0);
      baseTime += 5; // all within 120ms window -> only first 5 pass
    }
    expect(mock.bufferSources).toBe(5);
  });

  it('synthesizes C-major pentatonic climb with clamp + shimmer, bandpass swish, and stereo pan', () => {
    const mock = createMockAudioContext();
    installMockWindowAudio(mock);

    const audio = new MagicalAudio();
    vi.spyOn(audio, 'canPlaySfxVoice').mockReturnValue(true);

    const expectedScale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
    const observedFundamentals: number[] = [];

    for (let i = 0; i < expectedScale.length; i++) {
      const prevOscCount = mock.oscillators.length;
      audio.playSwipeHarvestNote(i, 0.35);
      // First oscillator added for each note is the fundamental celesta tone
      observedFundamentals.push(mock.oscillators[prevOscCount].initialFreq ?? 0);
    }
    expect(observedFundamentals).toEqual(expectedScale);

    // Combo beyond top note (e.g. 15) stays clamped at 1318.51 Hz + adds gentle shimmer voice
    const beforeHigh = mock.oscillators.length;
    audio.playSwipeHarvestNote(15, -0.5);
    const addedHigh = mock.oscillators.slice(beforeHigh);
    expect(addedHigh.length).toBe(3); // fundamental + fifth + soft shimmer
    expect(addedHigh[0].initialFreq).toBe(1318.51);

    // Bandpass scythe swish + stereo panning were applied
    const bandpassFilters = mock.filters.filter((f) => f.type === 'bandpass');
    expect(bandpassFilters.length).toBeGreaterThanOrEqual(expectedScale.length + 1);
    expect(mock.panners.some((p) => Math.abs(p.pan - 0.35) < 0.001)).toBe(true);
    expect(mock.panners.some((p) => Math.abs(p.pan + 0.5) < 0.001)).toBe(true);
  });

  it('synthesizes swipe-sow marimba, workshop ceramic pop, and mailbox parchment rustle', () => {
    const mock = createMockAudioContext();
    installMockWindowAudio(mock);

    const audio = new MagicalAudio();
    vi.spyOn(audio, 'canPlaySfxVoice').mockReturnValue(true);

    // Swipe sow: earthy pat (bandpass + low thud) + marimba scale
    const sowScale = [392.0, 440.0, 493.88, 587.33, 659.25, 783.99];
    for (let i = 0; i < sowScale.length; i++) {
      const before = mock.oscillators.length;
      audio.playSwipeSowNote(i, 0.15);
      const added = mock.oscillators.slice(before);
      expect(added.some((o) => o.initialFreq === sowScale[i])).toBe(true);
    }

    // Workshop collect: upward pitch-bent wooden pop + ceramic overtones
    const beforeWork = mock.oscillators.length;
    audio.playWorkshopCollectNote(2, -0.25);
    const workAdded = mock.oscillators.slice(beforeWork);
    expect(workAdded.length).toBeGreaterThanOrEqual(3);
    expect(workAdded[0].ramps).toContain(783.99);

    // Mailbox rustle: latch click + 2-stage bandpass parchment flutter
    const beforeMailNoise = mock.bufferSources;
    const beforeMailOsc = mock.oscillators.length;
    audio.playMailboxRustle(0.2);
    expect(mock.bufferSources - beforeMailNoise).toBe(2);
    expect(mock.oscillators.length - beforeMailOsc).toBe(2);
  });
});

describe('Hay Day Parabolic Harvest Flight & Burst FX (JuiceFX)', () => {
  it('pre-allocates zero-GC pools (40 flights, 16 burst rings, 20 twinkles)', () => {
    const juice = new JuiceFX({ reducedMotion: false });
    expect(juice.flights).toBeInstanceOf(HarvestFlightFX);
    expect(juice.flights.pool.length).toBe(40);
    expect(juice.flights.rings.length).toBe(16);
    expect(juice.flights.twinkles.length).toBe(20);
    expect(juice.flights.getActiveFlightCount()).toBe(0);
    expect(juice.flights.getActiveRingCount()).toBe(0);
  });

  it('spawns parabolic harvest flights with leaf pop, zero screen shake, Bezier arc progression, and arrival twinkle', () => {
    const juice = new JuiceFX({ reducedMotion: false });
    const fakeSprite = { width: 32, height: 32 } as unknown as CanvasImageSource;

    const launched = juice.spawnHarvestFlight(420, 460, 120, 70, fakeSprite, '#fde047', 3);
    expect(launched).toBe(3);
    expect(juice.flights.getActiveFlightCount()).toBe(3);
    expect(juice.confetti.getActiveCount()).toBeGreaterThan(0);
    expect(juice.screenShake.intensity).toBe(0);

    const first = juice.flights.pool[0];
    expect(first.active).toBe(true);
    expect(first.startX).toBe(420);
    expect(first.startY).toBe(460);
    expect(first.targetX).toBe(120);
    expect(first.targetY).toBe(70);
    expect(first.ctrlY).toBeLessThan(Math.min(first.startY, first.targetY));
    expect(first.sprite).toBe(fakeSprite);

    // Advance partway along quadratic Bezier curve
    const startPos = HarvestFlightFX.sampleQuadraticBezier(first, 0);
    expect(startPos).toEqual({ x: 420, y: 460 });

    juice.tick(0.25);
    expect(first.t).toBeGreaterThan(0.3);
    expect(first.t).toBeLessThan(0.8);
    const midPos = HarvestFlightFX.sampleQuadraticBezier(first, first.t);
    expect(midPos.x).toBeLessThan(420);
    expect(midPos.x).toBeGreaterThan(120);

    // Render mid-flight with sprite via applyTo
    const mockCtx = createMockCanvasContext();
    juice.applyTo(mockCtx, 1280, 800);
    expect(mockCtx.drawImage).toHaveBeenCalled();

    // Advance until first flight arrives -> deactivates and triggers arrival twinkle
    juice.tick(0.35);
    expect(first.active).toBe(false);
    expect(juice.flights.getActiveTwinkleCount()).toBeGreaterThan(0);

    // Advance through remaining staggered flights and twinkles until everything returns cleanly to pool
    for (let i = 0; i < 60; i++) {
      juice.tick(1 / 30);
    }
    expect(juice.flights.getActiveFlightCount()).toBe(0);
    expect(juice.flights.getActiveTwinkleCount()).toBe(0);
    expect(juice.flights.pool.length).toBe(40);
  });

  it('spawns and expands pooled harvest burst rings cleanly back to inactive', () => {
    const juice = new JuiceFX({ reducedMotion: false });
    juice.spawnHarvestBurstRing(500, 340, '#4ade80');
    expect(juice.flights.getActiveRingCount()).toBe(1);

    const ring = juice.flights.rings[0];
    expect(ring.active).toBe(true);
    expect(ring.color).toBe('#4ade80');
    const initialRadius = ring.radius;

    juice.tick(0.15);
    expect(ring.radius).toBeGreaterThan(initialRadius);

    const mockCtx = createMockCanvasContext();
    juice.applyTo(mockCtx, 1280, 800);
    expect(mockCtx.arc).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();

    // Expire cleanly after maxLife (0.42s)
    juice.tick(0.35);
    expect(ring.active).toBe(false);
    expect(juice.flights.getActiveRingCount()).toBe(0);

    // Saturating ring pool beyond 16 recycles slots without growing array
    for (let i = 0; i < 24; i++) {
      juice.spawnHarvestBurstRing(100 + i * 10, 200, '#38bdf8');
      juice.tick(0.01);
    }
    expect(juice.flights.rings.length).toBe(16);
  });

  it('renders fallback golden-sheaf emblem when sprite is null and recycles saturated flight pool without GC growth', () => {
    const juice = new JuiceFX({ reducedMotion: false });
    for (let i = 0; i < 25; i++) {
      juice.spawnHarvestFlight(300 + i, 400, 100, 80, null, '#fde047', 2);
      juice.tick(0.02);
    }
    expect(juice.flights.pool.length).toBe(40);
    expect(juice.flights.getActiveFlightCount()).toBeLessThanOrEqual(40);

    const mockCtx = createMockCanvasContext();
    juice.applyTo(mockCtx, 1280, 800);
    expect(mockCtx.drawImage).not.toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
  });

  it('strictly honors reducedMotion = true (skips spawning and clears active flights/rings)', () => {
    const reducedJuice = new JuiceFX({ reducedMotion: true });
    expect(reducedJuice.spawnHarvestFlight(400, 400, 100, 100, null, '#fde047', 3)).toBe(0);
    reducedJuice.spawnHarvestBurstRing(400, 400, '#fde047');

    expect(reducedJuice.flights.getActiveFlightCount()).toBe(0);
    expect(reducedJuice.flights.getActiveRingCount()).toBe(0);
    expect(reducedJuice.confetti.getActiveCount()).toBe(0);

    // Toggling reducedMotion at runtime also disables new spawns & clears existing flights/rings on tick
    const dynamicJuice = new JuiceFX({ reducedMotion: false });
    dynamicJuice.spawnHarvestFlight(300, 300, 100, 80, null, '#fde047', 2);
    dynamicJuice.spawnHarvestBurstRing(300, 300, '#4ade80');
    expect(dynamicJuice.flights.getActiveFlightCount()).toBe(2);
    expect(dynamicJuice.flights.getActiveRingCount()).toBe(1);

    dynamicJuice.setReducedMotion(true);
    expect(dynamicJuice.flights.reducedMotion).toBe(true);
    expect(dynamicJuice.spawnHarvestFlight(300, 300, 100, 80)).toBe(0);

    dynamicJuice.tick(1 / 60);
    expect(dynamicJuice.flights.getActiveFlightCount()).toBe(0);
    expect(dynamicJuice.flights.getActiveRingCount()).toBe(0);
    expect(dynamicJuice.flights.getActiveTwinkleCount()).toBe(0);
  });
});
