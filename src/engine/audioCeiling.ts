// P2 — Audio Ceiling:
// 1. 5-Bus Mixer (master / music / sfx / ambience / voice) + Soft Limiter chống clipping
// 2. 3-Stem Adaptive Layering (ambience / melody / intensity) + Smooth Transition
// 3. Modal Ducking (hạ mượt nhạc nền & âm trường khi mở sảnh khảo thí / hộp thoại, khôi phục chuẩn)
// 4. Spatial Cue (pan trái-phải [-0.75..0.75] & suy hao khoảng cách cho suối nước, thú phép, công trình)
// 5. Chuỗi Fanfare đa âm (win / harvest_combo / build_complete / unveil_ribbon)

export type AudioBusName = 'master' | 'music' | 'sfx' | 'ambience' | 'voice';

export interface AudioBusVolumes {
  master: number;
  music: number;
  sfx: number;
  ambience: number;
  voice: number;
}

export interface AdaptiveStemGains {
  ambience: number;
  melody: number;
  intensity: number;
}

export interface SpatialAudioCue {
  pan: number;     // [-1.0 .. 1.0], clamped safe stereo field
  gainMul: number; // [0.2 .. 1.0], distance + zoom attenuation
}

export type FanfareKind = 'win' | 'harvest_combo' | 'build_complete' | 'unveil_ribbon';

export interface FanfareNote {
  freq: number;
  duration: number;
  delay: number;
  type: OscillatorType;
  gain: number;
}

export const DEFAULT_BUS_VOLUMES: Readonly<AudioBusVolumes> = {
  master: 0.9,
  music: 0.8,
  sfx: 0.85,
  ambience: 0.75,
  voice: 0.95,
};

/**
 * Soft-knee limiter ensuring output gain never exceeds headroom (default 0.94) or 1.0.
 */
export function softClipGain(rawGain: number, headroom = 0.94): number {
  if (!Number.isFinite(rawGain) || rawGain <= 0) return 0;
  const ceiling = Math.max(0.1, Math.min(1.0, headroom));
  if (rawGain <= ceiling * 0.75) {
    return Number(rawGain.toFixed(4));
  }
  const knee = ceiling * 0.75;
  const excess = rawGain - knee;
  const span = ceiling - knee;
  const compressed = knee + span * Math.tanh(excess / Math.max(0.001, span));
  return Number(Math.min(ceiling, Math.max(0, compressed)).toFixed(4));
}

/**
 * Computes stereo pan [-0.75..0.75] and distance gain attenuation [0.25..1.0]
 * for in-world rivers, pasture beasts, and workshops.
 */
export function computeSpatialCue(
  screenX: number,
  screenY: number,
  viewW: number,
  viewH: number,
  zoom = 1
): SpatialAudioCue {
  const safeW = Math.max(1, viewW);
  const safeH = Math.max(1, viewH);
  const normX = (screenX - safeW * 0.5) / (safeW * 0.5);
  const normY = (screenY - safeH * 0.5) / (safeH * 0.5);
  const pan = Number(Math.max(-0.75, Math.min(0.75, Number.isFinite(normX) ? normX * 0.65 : 0)).toFixed(3));
  const dist = Math.hypot(normX, normY);
  const distFactor = Math.max(0.25, Math.min(1, 1 - Math.max(0, dist - 0.15) * 0.55));
  const zoomFactor = Math.max(0.55, Math.min(1.15, Number.isFinite(zoom) ? 0.65 + zoom * 0.35 : 1));
  const gainMul = Number(Math.max(0.2, Math.min(1.0, distFactor * zoomFactor)).toFixed(3));
  return { pan, gainMul };
}

export function getFanfareSequence(kind: FanfareKind): FanfareNote[] {
  switch (kind) {
    case 'win':
      return [
        { freq: 523.25, duration: 0.24, delay: 0.0, type: 'triangle', gain: 0.075 },
        { freq: 659.25, duration: 0.24, delay: 0.07, type: 'triangle', gain: 0.075 },
        { freq: 783.99, duration: 0.28, delay: 0.14, type: 'triangle', gain: 0.08 },
        { freq: 1046.5, duration: 0.55, delay: 0.22, type: 'sine', gain: 0.09 },
        { freq: 1318.51, duration: 0.55, delay: 0.24, type: 'sine', gain: 0.065 },
      ];
    case 'harvest_combo':
      return [
        { freq: 587.33, duration: 0.18, delay: 0.0, type: 'sine', gain: 0.065 },
        { freq: 880.0, duration: 0.22, delay: 0.05, type: 'triangle', gain: 0.06 },
        { freq: 1174.66, duration: 0.28, delay: 0.1, type: 'sine', gain: 0.055 },
      ];
    case 'build_complete':
      return [
        { freq: 523.25, duration: 0.32, delay: 0.0, type: 'sine', gain: 0.065 },
        { freq: 659.25, duration: 0.32, delay: 0.06, type: 'sine', gain: 0.065 },
        { freq: 783.99, duration: 0.36, delay: 0.12, type: 'sine', gain: 0.07 },
        { freq: 1046.5, duration: 0.48, delay: 0.18, type: 'triangle', gain: 0.075 },
      ];
    case 'unveil_ribbon':
      return [
        { freq: 659.25, duration: 0.22, delay: 0.0, type: 'triangle', gain: 0.07 },
        { freq: 783.99, duration: 0.22, delay: 0.06, type: 'triangle', gain: 0.07 },
        { freq: 987.77, duration: 0.26, delay: 0.12, type: 'sine', gain: 0.075 },
        { freq: 1318.51, duration: 0.52, delay: 0.18, type: 'sine', gain: 0.085 },
      ];
  }
}

export class AudioCeilingController {
  private volumes: AudioBusVolumes = { ...DEFAULT_BUS_VOLUMES };
  private modalDuckActive = false;
  private modalDuckDepth = 0;
  private currentDuckMusic = 1.0;
  private currentDuckAmbience = 1.0;

  private stems: AdaptiveStemGains = {
    ambience: 0.75,
    melody: 0.85,
    intensity: 0.0,
  };
  private targetIntensity = 0.0;

  public getVolumes(): AudioBusVolumes {
    return { ...this.volumes };
  }

  public setBusVolume(bus: AudioBusName, value: number): void {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : DEFAULT_BUS_VOLUMES[bus]));
    this.volumes[bus] = Number(clamped.toFixed(3));
  }

  public setAllVolumes(partial: Partial<AudioBusVolumes>): void {
    for (const key of ['master', 'music', 'sfx', 'ambience', 'voice'] as const) {
      if (typeof partial[key] === 'number') {
        this.setBusVolume(key, partial[key]!);
      }
    }
  }

  public setModalDucking(active: boolean): void {
    this.modalDuckActive = Boolean(active);
    this.modalDuckDepth = this.modalDuckActive ? Math.max(1, this.modalDuckDepth) : 0;
  }

  public pushModalDuck(): void {
    this.modalDuckDepth++;
    this.modalDuckActive = true;
  }

  public popModalDuck(): void {
    this.modalDuckDepth = Math.max(0, this.modalDuckDepth - 1);
    this.modalDuckActive = this.modalDuckDepth > 0;
  }

  public isModalDucked(): boolean {
    return this.modalDuckActive;
  }

  public triggerIntensityPulse(delta = 0.25): void {
    const bump = Math.max(0, Math.min(1, Number.isFinite(delta) ? delta : 0.25));
    this.targetIntensity = Number(Math.min(1, this.targetIntensity + bump).toFixed(3));
  }

  public setTargetIntensity(val: number): void {
    this.targetIntensity = Number(Math.max(0, Math.min(1, Number.isFinite(val) ? val : 0)).toFixed(3));
  }

  public getStems(): AdaptiveStemGains {
    return { ...this.stems };
  }

  public tick(rawDt: number): void {
    const dt = Math.max(0, Math.min(0.25, Number.isFinite(rawDt) ? rawDt : 1 / 60));
    if (dt <= 0) return;

    // Smooth ducking ramp (0.35s transition)
    const targetMusicDuck = this.modalDuckActive ? 0.38 : 1.0;
    const targetAmbDuck = this.modalDuckActive ? 0.45 : 1.0;
    const duckStep = dt / 0.35;

    if (this.currentDuckMusic < targetMusicDuck) {
      this.currentDuckMusic = Math.min(targetMusicDuck, this.currentDuckMusic + duckStep);
    } else if (this.currentDuckMusic > targetMusicDuck) {
      this.currentDuckMusic = Math.max(targetMusicDuck, this.currentDuckMusic - duckStep);
    }

    if (this.currentDuckAmbience < targetAmbDuck) {
      this.currentDuckAmbience = Math.min(targetAmbDuck, this.currentDuckAmbience + duckStep);
    } else if (this.currentDuckAmbience > targetAmbDuck) {
      this.currentDuckAmbience = Math.max(targetAmbDuck, this.currentDuckAmbience - duckStep);
    }

    // Smooth 3-stem intensity swell & natural decay
    const intensityRate = this.stems.intensity < this.targetIntensity ? 1.8 : 0.65;
    if (this.stems.intensity < this.targetIntensity) {
      this.stems.intensity = Math.min(
        this.targetIntensity,
        this.stems.intensity + dt * intensityRate
      );
    } else if (this.stems.intensity > this.targetIntensity) {
      this.stems.intensity = Math.max(
        this.targetIntensity,
        this.stems.intensity - dt * intensityRate
      );
    }
    // Natural decay of targetIntensity over time
    this.targetIntensity = Math.max(0, this.targetIntensity - dt * 0.18);
  }

  public getEffectiveBusGain(bus: Exclude<AudioBusName, 'master'>): number {
    const base = this.volumes.master * this.volumes[bus];
    if (bus === 'music') {
      const stemBoost = 1 + this.stems.intensity * 0.12;
      return softClipGain(base * this.currentDuckMusic * stemBoost);
    }
    if (bus === 'ambience') {
      return softClipGain(base * this.currentDuckAmbience * this.stems.ambience);
    }
    return softClipGain(base);
  }
}
