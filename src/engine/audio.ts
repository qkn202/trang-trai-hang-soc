import { WeatherKind } from '../types/game';
import { BgmMood, BgmWeather, pickBgmMood, TimeOfDay } from './bgmMood';
import {
  AudioBusName,
  AudioBusVolumes,
  AudioCeilingController,
  computeSpatialCue,
  FanfareKind,
  getFanfareSequence,
  softClipGain,
} from './audioCeiling';

export { AudioCeilingController, computeSpatialCue, getFanfareSequence, pickBgmMood, softClipGain };
export type { AudioBusName, AudioBusVolumes, BgmMood, BgmWeather, FanfareKind, TimeOfDay };

// Procedural Symphonic Music Box (Celesta & Harp) Fallback Melodies & Basses for 5 Moods
const DAY_MELODY = [
  587.33, 659.25, 783.99, 880.0, 987.77, 880.0, 783.99, 659.25,
  739.99, 880.0, 1174.66, 987.77, 880.0, 783.99, 659.25, 587.33,
];
const DAY_BASS = [293.66, 369.99, 440.0, 329.63, 392.0, 440.0, 369.99, 293.66];

const NIGHT_MELODY = [
  493.88, 659.25, 783.99, 739.99, 659.25, 987.77, 880.0, 739.99,
  659.25, 783.99, 739.99, 622.25, 659.25, 493.88, 587.33, 493.88,
];
const NIGHT_BASS = [246.94, 329.63, 392.0, 369.99, 293.66, 329.63, 246.94, 246.94];

const FESTIVAL_MELODY = [
  783.99, 880.0, 987.77, 1174.66, 1318.51, 1174.66, 987.77, 880.0,
  783.99, 987.77, 1174.66, 1318.51, 1567.98, 1318.51, 1174.66, 1046.5,
];
const FESTIVAL_BASS = [261.63, 392.0, 349.23, 392.0, 261.63, 440.0, 349.23, 392.0];

const STORM_MELODY = [
  293.66, 349.23, 440.0, 392.0, 466.16, 440.0, 349.23, 392.0,
  293.66, 329.63, 349.23, 277.18, 293.66, 220.0, 261.63, 220.0,
];
const STORM_BASS = [73.42, 98.0, 58.27, 55.0, 73.42, 110.0, 58.27, 73.42];

const RAIN_MELODY = [
  440.0, 523.25, 392.0, 349.23, 440.0, 293.66, 329.63, 349.23,
  440.0, 523.25, 659.25, 523.25, 440.0, 392.0, 329.63, 349.23,
];
const RAIN_BASS = [87.31, 130.81, 73.42, 58.27, 87.31, 98.0, 73.42, 87.31];

interface FallbackProfile {
  beatSec: number;
  melody: number[];
  bass: number[];
  melodyType: OscillatorType;
  shimmerType: OscillatorType;
  bassType: OscillatorType;
  melodyGain: number;
  shimmerGain: number;
  bassGain: number;
  bassInterval: number;
}

const FALLBACK_PROFILES: Record<BgmMood, FallbackProfile> = {
  day: {
    beatSec: 0.46,
    melody: DAY_MELODY,
    bass: DAY_BASS,
    melodyType: 'sine',
    shimmerType: 'triangle',
    bassType: 'triangle',
    melodyGain: 0.022,
    shimmerGain: 0.007,
    bassGain: 0.018,
    bassInterval: 2,
  },
  night: {
    beatSec: 0.62,
    melody: NIGHT_MELODY,
    bass: NIGHT_BASS,
    melodyType: 'sine',
    shimmerType: 'triangle',
    bassType: 'triangle',
    melodyGain: 0.02,
    shimmerGain: 0.006,
    bassGain: 0.022,
    bassInterval: 2,
  },
  festival: {
    beatSec: 0.34,
    melody: FESTIVAL_MELODY,
    bass: FESTIVAL_BASS,
    melodyType: 'triangle',
    shimmerType: 'sine',
    bassType: 'triangle',
    melodyGain: 0.024,
    shimmerGain: 0.01,
    bassGain: 0.02,
    bassInterval: 1,
  },
  storm: {
    beatSec: 0.72,
    melody: STORM_MELODY,
    bass: STORM_BASS,
    melodyType: 'sine',
    shimmerType: 'triangle',
    bassType: 'sawtooth',
    melodyGain: 0.024,
    shimmerGain: 0.006,
    bassGain: 0.024,
    bassInterval: 2,
  },
  rain: {
    beatSec: 0.68,
    melody: RAIN_MELODY,
    bass: RAIN_BASS,
    melodyType: 'sine',
    shimmerType: 'sine',
    bassType: 'sine',
    melodyGain: 0.016,
    shimmerGain: 0.004,
    bassGain: 0.016,
    bassInterval: 2,
  },
};

/**
 * Rendered background music tracks (public/audio/*.mp3). These are real instrument
 * recordings rendered offline by tools/make-bgm.py across 5 adaptive moods.
 */
export const BGM_TRACKS: Record<BgmMood, string> = {
  day: '/audio/bgm_day.mp3',
  night: '/audio/bgm_night.mp3',
  festival: '/audio/bgm_festival.mp3',
  storm: '/audio/bgm_storm.mp3',
  rain: '/audio/bgm_rain.mp3',
};

export type SfxAtlasCueId =
  | 'click'
  | 'place'
  | 'harvest'
  | 'water'
  | 'chess_clack'
  | 'crate_crack'
  | 'match_pop'
  | 'talisman_blast'
  | 'build_complete'
  | 'fanfare_win';

export const SFX_ATLAS_URL = '/audio/sfx_atlas.mp3';

export const SFX_ATLAS_CUES: Record<SfxAtlasCueId, { offset: number; duration: number }> = {
  click: { offset: 0.0, duration: 0.35 },
  place: { offset: 0.6, duration: 0.55 },
  harvest: { offset: 1.4, duration: 0.55 },
  water: { offset: 2.2, duration: 0.65 },
  chess_clack: { offset: 3.1, duration: 0.5 },
  crate_crack: { offset: 3.9, duration: 0.6 },
  match_pop: { offset: 4.8, duration: 0.48 },
  talisman_blast: { offset: 5.6, duration: 0.95 },
  build_complete: { offset: 6.8, duration: 1.05 },
  fanfare_win: { offset: 8.1, duration: 1.45 },
};

interface BgmSlot {
  id: 'A' | 'B';
  audio: HTMLAudioElement | null;
  mood: BgmMood | null;
  gain: number;       // Normalized current gain [0.0 .. 1.0]
  targetGain: number; // Normalized target gain [0.0 .. 1.0]
}

export class MagicalAudio {
  private ctx: AudioContext | null = null;
  public enabled = true; // SFX enabled
  public bgmEnabled = true; // Cozy Symphonic Celesta BGM enabled
  public readonly ceiling = new AudioCeilingController();
  private unlocked = false;
  private streakCount = 0;
  private lastStreakTime = 0;

  private bgmStep = 0;
  private bgmAcc = 0;
  private ambientAcc = 0;

  // Dual <audio> deck architecture for smooth 1.2s crossfading
  private slotA: BgmSlot;
  private slotB: BgmSlot;
  private activeSlotId: 'A' | 'B' = 'A';
  private bgmCurrentMood: BgmMood | null = null;
  private bgmFileAvailable = false;
  private readonly bgmMasterVolume = 0.34;
  private readonly bgmCrossfadeDuration = 1.2; // 1.2s crossfade ramp

  private noiseBuffer: AudioBuffer | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private lastRainLevel = -1;
  private sfxAtlasBuffer: AudioBuffer | null = null;
  private sfxAtlasLoading = false;

  constructor() {
    this.slotA = this.initBgmSlot('A');
    this.slotB = this.initBgmSlot('B');

    if (typeof window === 'undefined') return;
    const unlockHandler = () => {
      this.unlocked = true;
      const ctx = this.ensureCtx();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      this.ensureSfxAtlasLoaded();
      // If BGM should be active, trigger play on the currently targeted slot
      if (this.bgmEnabled) {
        const active = this.activeSlotId === 'A' ? this.slotA : this.slotB;
        if (active.audio && active.audio.paused && active.targetGain > 0) {
          active.audio.play().then(() => {
            this.bgmFileAvailable = true;
          }).catch(() => {});
        }
      }
    };
    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
  }

  private ensureSfxAtlasLoaded(): void {
    if (this.sfxAtlasBuffer || this.sfxAtlasLoading || typeof window === 'undefined') return;
    if (typeof fetch !== 'function') return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.sfxAtlasLoading = true;
    fetch(SFX_ATLAS_URL)
      .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error('sfx 404'))))
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        this.sfxAtlasBuffer = decoded;
      })
      .catch(() => {
        // Keep procedural oscillator fallback silently
      })
      .finally(() => {
        this.sfxAtlasLoading = false;
      });
  }

  private playAtlasCue(cue: SfxAtlasCueId, gainVal = 0.28, playbackRate = 1.0): boolean {
    if (!this.enabled || !this.sfxAtlasBuffer) return false;
    const ctx = this.ensureCtx();
    if (!ctx || ctx.state !== 'running') return false;
    const def = SFX_ATLAS_CUES[cue];
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.sfxAtlasBuffer;
    src.playbackRate.setValueAtTime(Math.max(0.5, Math.min(2.4, playbackRate)), now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.max(0.001, gainVal), now);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + Math.max(0.06, def.duration / Math.max(0.6, playbackRate))
    );
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(now, def.offset, def.duration);
    return true;
  }

  private initBgmSlot(id: 'A' | 'B'): BgmSlot {
    let audio: HTMLAudioElement | null = null;
    if (typeof Audio !== 'undefined') {
      try {
        audio = new Audio();
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0;
        audio.addEventListener('error', () => {
          this.bgmFileAvailable = false;
        });
      } catch {
        audio = null;
      }
    }
    return {
      id,
      audio,
      mood: null,
      gain: 0,
      targetGain: 0,
    };
  }

  private ensureCtx(allowAutoCreate = true): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.enabled && !this.bgmEnabled) return null;
    if (!this.ctx && allowAutoCreate) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtor) {
        this.ctx = new AudioCtor();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && this.unlocked) {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Switches background music to the given mood using dual <audio> crossfade.
   * Incoming track ramps up to 1.0 over 1.2s; outgoing track ramps down to 0 and pauses.
   */
  private switchBgmMood(mood: BgmMood): void {
    if (this.bgmCurrentMood === mood) return;

    // The other slot becomes incoming
    const outgoing = this.activeSlotId === 'A' ? this.slotA : this.slotB;
    const incoming = this.activeSlotId === 'A' ? this.slotB : this.slotA;

    outgoing.targetGain = 0;

    incoming.mood = mood;
    incoming.targetGain = 1.0;
    this.activeSlotId = incoming.id;
    this.bgmCurrentMood = mood;

    if (incoming.audio) {
      const trackSrc = BGM_TRACKS[mood];
      if (!incoming.audio.src.endsWith(trackSrc)) {
        incoming.audio.src = trackSrc;
        incoming.audio.currentTime = 0;
      }
      if (incoming.gain <= 0) {
        incoming.audio.volume = 0;
      }
      if (this.unlocked && this.bgmEnabled) {
        incoming.audio
          .play()
          .then(() => {
            this.bgmFileAvailable = true;
          })
          .catch(() => {
            // Browser autoplay restrictions or missing file -> fallback oscillator
            this.bgmFileAvailable = false;
          });
      }
    }
  }

  /**
   * Smoothly updates volume gains for both <audio> decks over 1.2s.
   * Any deck that reaches 0 gain is paused to conserve resources.
   */
  private updateCrossfade(dt: number): void {
    const rampStep = dt / this.bgmCrossfadeDuration;
    const slots = [this.slotA, this.slotB];

    for (const slot of slots) {
      if (slot.gain < slot.targetGain) {
        slot.gain = Math.min(slot.targetGain, slot.gain + rampStep);
      } else if (slot.gain > slot.targetGain) {
        slot.gain = Math.max(slot.targetGain, slot.gain - rampStep);
      }

      if (slot.audio) {
        const musicBus = this.ceiling.getEffectiveBusGain('music');
        const effectiveVol = Math.max(0, Math.min(1, slot.gain * this.bgmMasterVolume * musicBus));
        slot.audio.volume = effectiveVol;

        // "track nào idle thì pause ở 0"
        if (slot.gain <= 0 && slot.targetGain <= 0) {
          if (!slot.audio.paused) {
            slot.audio.pause();
            slot.audio.currentTime = 0;
          }
        } else if (slot.gain > 0 && slot.audio.paused && this.unlocked && this.bgmEnabled) {
          slot.audio.play().catch(() => {});
        }
      }
    }
  }

  /** Fade out all BGM tracks (e.g. when player disables BGM). */
  private stopBgm(): void {
    this.slotA.targetGain = 0;
    this.slotA.gain = 0;
    if (this.slotA.audio && !this.slotA.audio.paused) {
      this.slotA.audio.pause();
      this.slotA.audio.currentTime = 0;
      this.slotA.audio.volume = 0;
    }

    this.slotB.targetGain = 0;
    this.slotB.gain = 0;
    if (this.slotB.audio && !this.slotB.audio.paused) {
      this.slotB.audio.pause();
      this.slotB.audio.currentTime = 0;
      this.slotB.audio.volume = 0;
    }

    this.bgmCurrentMood = null;
    this.bgmFileAvailable = false;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainVal = 0.08,
    delay = 0
  ): void {
    const ctx = this.ensureCtx();
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainVal), now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buf;
    return buf;
  }

  public setRainIntensity(intensity: number): void {
    const level = this.enabled && this.unlocked ? Math.max(0, Math.min(1, intensity)) : 0;
    if (Math.abs(level - this.lastRainLevel) < 0.01) return;
    this.lastRainLevel = level;

    const ctx = this.ensureCtx(level > 0);
    if (!ctx) return;

    if (level > 0 && ctx.state === 'running' && !this.rainSource) {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      src.loop = true;

      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1050;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 4200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);

      src.connect(hp);
      hp.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      this.rainSource = src;
      this.rainGain = gain;
    }

    if (this.rainGain && ctx.state === 'running') {
      const targetGain = Math.max(0.0001, level * 0.036);
      this.rainGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.35);
    }
  }

  public playThunder(intensity = 0.75, delaySec = 0.35): void {
    if (!this.enabled || !this.unlocked) return;
    const ctx = this.ensureCtx();
    if (!ctx || ctx.state !== 'running') return;

    const start = ctx.currentTime + Math.max(0, delaySec);
    const dur = 1.35;
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(390, start);
    lp.frequency.exponentialRampToValueAtTime(68, start + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.002, 0.085 * intensity), start + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    src.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    src.start(start);
    src.stop(start + dur + 0.05);
  }

  public playFlyTick(step = 0): void {
    if (!this.enabled) return;
    const notes = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
    const freq = notes[step % notes.length];
    this.playTone(freq, 0.14, 'sine', 0.048, 0);
  }

  /**
   * Main audio loop called each frame.
   * Maps current world environment to one of 5 adaptive BGM moods, executes 1.2s crossfading
   * between dual <audio> slots, and manages fallback procedural synthesis and spatial soundscape.
   */
  public setModalDucking(active: boolean): void {
    this.ceiling.setModalDucking(active);
  }

  public setBusVolume(bus: AudioBusName, value: number): void {
    this.ceiling.setBusVolume(bus, value);
  }

  public playSpatialSfx(
    cue: 'water' | 'creature' | 'workshop',
    screenX: number,
    screenY: number,
    viewW: number,
    viewH: number,
    zoom = 1
  ): void {
    if (!this.enabled) return;
    const spatial = computeSpatialCue(screenX, screenY, viewW, viewH, zoom);
    const sfxGain = this.ceiling.getEffectiveBusGain('sfx') * spatial.gainMul;
    if (cue === 'water') {
      this.playTone(587.33, 0.14, 'sine', 0.045 * sfxGain, 0);
    } else if (cue === 'creature') {
      this.playTone(783.99, 0.16, 'triangle', 0.05 * sfxGain, 0);
    } else {
      this.playTone(440.0, 0.18, 'triangle', 0.048 * sfxGain, 0);
    }
  }

  public updateSoundscape(
    dt: number,
    isNight: boolean,
    camZoom: number,
    nearStation: boolean,
    weatherKind: WeatherKind = 'sunny',
    isFestival = false,
    timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night'
  ): void {
    this.ceiling.tick(dt);
    if (!this.unlocked) return;

    const rainTarget =
      weatherKind === 'storm'
        ? 0.92
        : weatherKind === 'rain' || weatherKind === 'snow' || weatherKind === 'fog'
        ? 0.52
        : 0;
    this.setRainIntensity(rainTarget);

    // 1. Adaptive 5-Mood Background Music & Crossfade
    if (this.bgmEnabled) {
      const effectiveTime: 'dawn' | 'day' | 'dusk' | 'night' =
        timeOfDay ?? (isNight ? 'night' : 'day');
      const mood = pickBgmMood(
        effectiveTime,
        weatherKind === 'sunny' ? 'clear' : weatherKind,
        isFestival
      );

      this.switchBgmMood(mood);
      this.updateCrossfade(dt);

      // Fallback procedural synthesis: used whenever rendered audio files cannot be decoded/played
      if (!this.bgmFileAvailable) {
        const profile = FALLBACK_PROFILES[mood];
        this.bgmAcc += dt;
        if (this.bgmAcc >= profile.beatSec) {
          this.bgmAcc = 0;
          const ctx = this.ensureCtx();
          if (ctx && ctx.state === 'running') {
            const note = profile.melody[this.bgmStep % profile.melody.length];
            this.playTone(note, profile.beatSec * 1.45, profile.melodyType, profile.melodyGain, 0);
            if (profile.shimmerGain > 0) {
              this.playTone(
                note * 2,
                profile.beatSec * 0.75,
                profile.shimmerType,
                profile.shimmerGain,
                0.01
              );
            }
            if (this.bgmStep % profile.bassInterval === 0) {
              const bNote =
                profile.bass[Math.floor(this.bgmStep / profile.bassInterval) % profile.bass.length];
              this.playTone(bNote, profile.beatSec * 2.4, profile.bassType, profile.bassGain, 0);
            }
            this.bgmStep++;
          }
        }
      }
    } else {
      this.stopBgm();
    }

    // 2. Spatial Ambient Soundscape (Train whistle near station / Owl hoot at night)
    if (this.enabled) {
      this.ambientAcc += dt;
      if (this.ambientAcc >= 14) {
        this.ambientAcc = 0;
        const zoomGain = Math.min(1.2, Math.max(0.3, camZoom * 0.75));
        if (isNight && Math.random() < 0.55) {
          this.playOwlHoot(0.024 * zoomGain);
        } else if (nearStation && Math.random() < 0.6) {
          this.playTrainWhistle(0.022 * zoomGain);
        }
      }
    }
  }

  /**
   * Owl hoot with subtle crisp delivery seal snap ('chát' nhẹ) on conclusion.
   */
  public playOwlHoot(vol = 0.03): void {
    if (!this.enabled) return;
    // Two gentle hoot syllables (high to low)
    this.playTone(587.33, 0.22, 'sine', vol, 0);
    this.playTone(493.88, 0.42, 'sine', vol * 0.9, 0.26);

    // Subtle crisp snap / delivery seal 'chát' right after hoot finishes
    this.playTone(1975.53, 0.06, 'triangle', vol * 0.75, 0.54);
    this.playTone(2637.02, 0.04, 'sine', vol * 0.5, 0.55);
  }

  public playTrainWhistle(vol = 0.025): void {
    if (!this.enabled) return;
    this.playTone(440, 0.45, 'triangle', vol, 0);
    this.playTone(554.37, 0.45, 'triangle', vol * 0.85, 0);
    this.playTone(659.25, 0.45, 'sine', vol * 0.65, 0);
  }

  public playHarvestBubble(): void {
    this.ceiling.triggerIntensityPulse(0.12);
    if (!this.enabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastStreakTime < 900) {
      this.streakCount = Math.min(10, this.streakCount + 1);
    } else {
      this.streakCount = 0;
    }
    this.lastStreakTime = nowMs;
    const scaleNotes = [
      523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98, 1760, 2093,
    ];
    const base = scaleNotes[this.streakCount];
    if (this.playAtlasCue('harvest', 0.34, Math.min(2.0, base / 523.25))) return;
    this.playTone(base, 0.22, 'sine', 0.075, 0);
    this.playTone(base * 1.5, 0.28, 'triangle', 0.04, 0.045);
  }

  public playWaterSplash(): void {
    if (!this.enabled) return;
    if (this.playAtlasCue('water', 0.36, 0.96 + Math.random() * 0.08)) return;
    this.playTone(587.33, 0.14, 'sine', 0.055, 0);
    this.playTone(880.0, 0.18, 'sine', 0.045, 0.06);
  }

  public playChessClack(heavy = false): void {
    if (!this.enabled || typeof window === 'undefined') return;
    const rate = heavy ? 0.86 : 0.97 + Math.random() * 0.07;
    if (this.playAtlasCue('chess_clack', heavy ? 0.42 : 0.32, rate)) return;
    this.playTone(heavy ? 196 : 293.66, 0.09, 'triangle', 0.065, 0);
  }

  public playCrateCrack(): void {
    if (!this.enabled || typeof window === 'undefined') return;
    if (this.playAtlasCue('crate_crack', 0.38, 0.96 + Math.random() * 0.08)) return;
    this.playPowerupBlast();
  }

  public playRibbonCut(): void {
    if (!this.enabled) return;
    if (!this.playAtlasCue('build_complete', 0.42, 1.04)) {
      this.playBuildComplete();
    }
  }

  public playPlace(): void {
    if (!this.enabled) return;
    if (this.playAtlasCue('place', 0.34, 0.97 + Math.random() * 0.06)) return;
    this.playTone(293.66, 0.12, 'triangle', 0.07, 0);
    this.playTone(440.0, 0.18, 'sine', 0.06, 0.05);
  }

  /** Warm ascending celesta arpeggio played the moment a building finishes construction. */
  public playBuildComplete(): void {
    if (!this.enabled) return;
    if (this.playAtlasCue('build_complete', 0.38, 1.0)) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone(n, 0.36, 'sine', 0.062, i * 0.055);
      this.playTone(n * 2, 0.2, 'triangle', 0.014, i * 0.055 + 0.01);
    });
  }

  public playClick(): void {
    if (!this.enabled || typeof window === 'undefined') return;
    if (this.playAtlasCue('click', 0.24, 0.98 + Math.random() * 0.05)) return;
    this.playTone(587.33, 0.08, 'triangle', 0.045, 0);
  }

  public playSpell(): void {
    if (!this.enabled) return;
    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((n, i) => this.playTone(n, 0.24, 'sine', 0.055, i * 0.045));
  }

  /**
   * Phoenix Talisman activation SFX: ascending magical fire chime + fiery noise burst.
   */
  public playTalismanBlast(): void {
    if (!this.enabled) return;
    if (this.playAtlasCue('talisman_blast', 0.44, 1.0)) return;
    // 1. Rapid 4-note ascending fire arpeggio (E4, G#4, B4, E5, G#5)
    const fireNotes = [329.63, 415.3, 493.88, 659.25, 830.61];
    fireNotes.forEach((freq, idx) => {
      this.playTone(freq, 0.26, 'triangle', 0.075, idx * 0.04);
      this.playTone(freq * 1.5, 0.2, 'sine', 0.04, idx * 0.04 + 0.01);
    });

    // 2. Fiery noise burst (whoosh of phoenix flames)
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === 'running') {
      const now = ctx.currentTime;
      const dur = 0.36;
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(650, now);
      bp.frequency.exponentialRampToValueAtTime(2200, now + 0.1);
      bp.frequency.exponentialRampToValueAtTime(400, now + dur);
      bp.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.065, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      src.connect(bp);
      bp.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + dur + 0.02);
    }
  }

  public playCardFound(): void {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((n, i) => this.playTone(n, 0.34, 'sine', 0.068, i * 0.06));
  }

  /**
   * Triumphant level-up fanfare: ascending scale blooming into a bright 3-note major triad fanfare chord.
   */
  public playLevelUp(): void {
    if (!this.enabled) return;
    if (this.playAtlasCue('fanfare_win', 0.42, 1.0)) return;
    // Ascending celebratory scale
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((n, i) => this.playTone(n, 0.42, 'triangle', 0.07, i * 0.075));
    // Triumphant 3-note major fanfare chord (A5, C#6, E6) blossoming at peak
    const fanfareTriad = [880, 1108.73, 1318.51];
    fanfareTriad.forEach((freq) => {
      this.playTone(freq, 0.65, 'sine', 0.045, 0.48);
      this.playTone(freq * 2, 0.35, 'triangle', 0.015, 0.49);
    });
  }

  public playCheekyAlert(): void {
    if (!this.enabled) return;
    this.playTone(392, 0.14, 'triangle', 0.065, 0);
    this.playTone(349.23, 0.14, 'triangle', 0.065, 0.09);
    this.playTone(523.25, 0.2, 'sine', 0.065, 0.18);
  }

  /**
   * Match-3 pop SFX with special celebratory combo-break chimes when combo >= 4.
   */
  public playMatchPop(combo = 1): void {
    if (!this.enabled || typeof window === 'undefined') return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
    const f = scale[Math.min(scale.length - 1, Math.max(0, combo - 1))];
    const playedAtlas = this.playAtlasCue('match_pop', 0.34, Math.min(2.2, f / 523.25));
    if (!playedAtlas) {
      this.playTone(f, 0.16, 'sine', 0.07, 0);
      this.playTone(f * 1.5, 0.18, 'triangle', 0.035, 0.03);
    }

    // Combo-break SFX when combo >= 4: celebratory high sparkle flourish
    if (combo >= 4) {
      const sparkles = [1318.51, 1567.98, 2093.0];
      sparkles.forEach((sFreq, idx) => {
        this.playTone(sFreq, 0.18, 'sine', 0.04, 0.06 + idx * 0.045);
        this.playTone(sFreq * 1.25, 0.12, 'triangle', 0.02, 0.07 + idx * 0.045);
      });
    }
  }

  public playPowerupBlast(): void {
    if (!this.enabled || typeof window === 'undefined') return;
    this.playTone(220, 0.28, 'triangle', 0.085, 0);
    this.playTone(440, 0.24, 'sine', 0.065, 0.03);
    this.playTone(880, 0.3, 'sine', 0.055, 0.07);
  }

  public pause(): void {
    if (this.slotA.audio && !this.slotA.audio.paused) {
      this.slotA.audio.pause();
    }
    if (this.slotB.audio && !this.slotB.audio.paused) {
      this.slotB.audio.pause();
    }
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  public resume(): void {
    if (this.ctx && this.ctx.state === 'suspended' && this.unlocked) {
      this.ctx.resume().catch(() => {});
    }
    if (this.bgmEnabled && this.unlocked) {
      const active = this.activeSlotId === 'A' ? this.slotA : this.slotB;
      if (active.audio && active.audio.paused && (active.gain > 0 || active.targetGain > 0)) {
        active.audio.play().catch(() => {});
      }
    }
  }
}
