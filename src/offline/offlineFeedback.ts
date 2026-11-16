import type { CandyAudioAdapter } from '../sim/candyHogwartsEngine';
import type { OfflineSettingsState } from './offlineTypes';

/**
 * Âm thanh Web Audio tổng hợp nội bộ + Haptics an toàn trên di động.
 * Hoàn toàn không tải file mạng ngoài, không crash trên Safari / iOS / Headless test.
 */
export class OfflineFeedback implements CandyAudioAdapter {
  private ctx: AudioContext | null = null;
  private getSettings: () => OfflineSettingsState;

  constructor(getSettings: () => OfflineSettingsState) {
    this.getSettings = getSettings;
  }

  private ensureAudioContext(): AudioContext | null {
    if (!this.getSettings().sound) return null;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }
    try {
      const AudioCtor =
        typeof window !== 'undefined'
          ? window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
          : undefined;
      if (!AudioCtor) return null;
      this.ctx = new AudioCtor();
      return this.ctx;
    } catch {
      return null;
    }
  }

  public playTone(
    freqHz: number,
    durationSec = 0.08,
    type: OscillatorType = 'triangle',
    gainPeak = 0.06,
    delaySec = 0
  ): void {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    try {
      const start = ctx.currentTime + Math.max(0, delaySec);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(80, Math.min(2400, freqHz)), start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.03, durationSec));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + Math.max(0.04, durationSec + 0.01));
    } catch {
      // Ignore Web Audio errors when autoplay locked
    }
  }

  public vibrate(pattern: number | number[] = 10): void {
    if (!this.getSettings().haptics) return;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Safari / desktop guard
    }
  }

  public tap(): void {
    this.playTone(520, 0.055, 'sine', 0.045);
    this.vibrate(8);
  }

  public success(): void {
    this.playTone(587.33, 0.09, 'triangle', 0.06, 0);
    this.playTone(783.99, 0.12, 'triangle', 0.065, 0.06);
    this.vibrate([10, 24, 14]);
  }

  public winFanfare(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((hz, idx) => {
      this.playTone(hz, 0.16, 'triangle', 0.075, idx * 0.075);
    });
    this.vibrate([16, 30, 18, 30, 26]);
  }

  public error(): void {
    this.playTone(220, 0.11, 'sawtooth', 0.035, 0);
    this.playTone(185, 0.13, 'sawtooth', 0.03, 0.06);
    this.vibrate(18);
  }

  // CandyAudioAdapter implementation for CandyHogwartsEngine
  public onSelect(): void {
    this.tap();
  }

  public onSwap(): void {
    this.playTone(460, 0.06, 'sine', 0.045);
  }

  public onInvalid(): void {
    this.error();
  }

  public onMatch(cascadeDepth: number): void {
    const base = 480 + Math.min(8, Math.max(0, cascadeDepth)) * 55;
    this.playTone(base, 0.09, 'triangle', 0.06);
    this.vibrate(10);
  }

  public onBeam(): void {
    this.playTone(698.46, 0.11, 'triangle', 0.065);
    this.vibrate(12);
  }

  public onBomb(): void {
    this.playTone(261.63, 0.14, 'sawtooth', 0.06, 0);
    this.playTone(523.25, 0.12, 'triangle', 0.055, 0.04);
    this.vibrate([16, 22, 16]);
  }

  public onColorBomb(): void {
    this.winFanfare();
  }

  public onSeeker(): void {
    this.playTone(880, 0.09, 'sine', 0.06);
    this.vibrate(10);
  }

  public onIceBreak(): void {
    this.playTone(987.77, 0.07, 'triangle', 0.05);
  }

  public onPatronus(): void {
    this.winFanfare();
  }

  public onVictory(): void {
    this.winFanfare();
  }

  public onDefeat(): void {
    this.error();
  }
}
