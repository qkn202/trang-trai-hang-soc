#!/usr/bin/env python3
"""
tools/make-sfx.py — Physical-Modeling SFX Atlas Generator
Synthesizes crisp acoustic/physical sound effects (walnut click, timber thud,
sickle harvest snip, Aguamenti water splash, marble chess clack, crate crack,
candy pop, Phoenix flame chime, cottage unveil bell, victory harp fanfare)
into a single zero-latency Web Audio sprite: public/audio/sfx_atlas.mp3.
"""

import math
import os
import subprocess
import tempfile
import wave
import numpy as np

SR = 44100


def env_ad(n: int, attack_s: float, decay_s: float) -> np.ndarray:
    t = np.arange(n, dtype=np.float64) / SR
    att = np.clip(t / max(1e-4, attack_s), 0.0, 1.0)
    dec = np.exp(-np.maximum(0.0, t - attack_s) / max(1e-4, decay_s))
    return att * dec


def bandpass_1pole(sig: np.ndarray, f_lo: float, f_hi: float) -> np.ndarray:
    # Simple FFT zero-phase bandpass for offline synthesis cleanliness
    spec = np.fft.rfft(sig)
    freqs = np.fft.rfftfreq(len(sig), 1.0 / SR)
    mask = np.exp(-0.5 * ((np.maximum(0.0, f_lo - freqs) / max(20.0, f_lo * 0.25)) ** 2))
    mask *= np.exp(-0.5 * ((np.maximum(0.0, freqs - f_hi) / max(40.0, f_hi * 0.22)) ** 2))
    return np.fft.irfft(spec * mask, n=len(sig))


def synth_click(rng: np.random.Generator) -> np.ndarray:
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    # Walnut wood tap modal resonances + felt transient
    modes = (
        0.55 * np.sin(2 * math.pi * 690 * t) * env_ad(n, 0.001, 0.022)
        + 0.35 * np.sin(2 * math.pi * 1340 * t) * env_ad(n, 0.0008, 0.014)
        + 0.22 * np.sin(2 * math.pi * 2480 * t) * env_ad(n, 0.0005, 0.007)
    )
    transient = bandpass_1pole(rng.normal(0, 1, n), 900, 4200) * env_ad(n, 0.0005, 0.006) * 0.35
    return (modes + transient) * 0.72


def synth_place(rng: np.random.Generator) -> np.ndarray:
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    # Warm timber & stone placement thud + peg lock click at +55ms
    sweep = 155 * np.exp(-t * 14) + 72
    body = np.sin(2 * math.pi * np.cumsum(sweep) / SR) * env_ad(n, 0.002, 0.085) * 0.68
    wood = (
        0.38 * np.sin(2 * math.pi * 310 * t) * env_ad(n, 0.002, 0.05)
        + 0.24 * np.sin(2 * math.pi * 520 * t) * env_ad(n, 0.001, 0.035)
    )
    peg = np.zeros(n)
    d = int(0.055 * SR)
    m = n - d
    tp = np.arange(m) / SR
    peg[d:] = (
        0.42 * np.sin(2 * math.pi * 587.33 * tp) * env_ad(m, 0.0015, 0.09)
        + 0.25 * np.sin(2 * math.pi * 880.0 * tp) * env_ad(m, 0.001, 0.06)
    )
    thud_noise = bandpass_1pole(rng.normal(0, 1, n), 120, 950) * env_ad(n, 0.001, 0.025) * 0.32
    return (body + wood + peg + thud_noise) * 0.75


def synth_harvest(rng: np.random.Generator) -> np.ndarray:
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    # Crisp wheat sickle snip + wicker pop + C5 harmonic bell (base C5 = 523.25Hz)
    snip = bandpass_1pole(rng.normal(0, 1, n), 2200, 7500) * env_ad(n, 0.001, 0.018) * 0.42
    pop_f = 280 + 260 * (1 - np.exp(-t * 45))
    pop = np.sin(2 * math.pi * np.cumsum(pop_f) / SR) * env_ad(n, 0.002, 0.055) * 0.35
    d = int(0.028 * SR)
    bell = np.zeros(n)
    tb = np.arange(n - d) / SR
    f0 = 523.25
    bell[d:] = (
        0.52 * np.sin(2 * math.pi * f0 * tb) * env_ad(n - d, 0.003, 0.16)
        + 0.28 * np.sin(2 * math.pi * (f0 * 1.5) * tb) * env_ad(n - d, 0.002, 0.12)
        + 0.16 * np.sin(2 * math.pi * (f0 * 2.0) * tb) * env_ad(n - d, 0.001, 0.08)
    )
    return (snip + pop + bell) * 0.78


def synth_water(rng: np.random.Generator) -> np.ndarray:
    n = int(0.65 * SR)
    # Refreshing Aguamenti water pour + 4 rising droplet bloops
    wash = bandpass_1pole(rng.normal(0, 1, n), 650, 3800) * env_ad(n, 0.025, 0.19) * 0.36
    drops = np.zeros(n)
    for delay_s, f_start, f_end, amp in [
        (0.02, 420, 920, 0.34),
        (0.08, 540, 1180, 0.32),
        (0.15, 660, 1420, 0.28),
        (0.23, 784, 1568, 0.26),
    ]:
        i0 = int(delay_s * SR)
        m = min(int(0.14 * SR), n - i0)
        td = np.arange(m) / SR
        f_inst = f_start + (f_end - f_start) * np.clip(td / 0.075, 0, 1)
        drops[i0 : i0 + m] += np.sin(2 * math.pi * np.cumsum(f_inst) / SR) * env_ad(m, 0.002, 0.045) * amp
    return (wash + drops) * 0.82


def synth_chess_clack(rng: np.random.Generator) -> np.ndarray:
    n = int(0.50 * SR)
    t = np.arange(n) / SR
    # Heavy carved marble chess piece / wax seal clack on stone board
    stone_modes = (
        0.58 * np.sin(2 * math.pi * 196 * t) * env_ad(n, 0.0008, 0.055)
        + 0.44 * np.sin(2 * math.pi * 468 * t) * env_ad(n, 0.0006, 0.032)
        + 0.32 * np.sin(2 * math.pi * 1190 * t) * env_ad(n, 0.0004, 0.016)
        + 0.22 * np.sin(2 * math.pi * 2640 * t) * env_ad(n, 0.0003, 0.008)
    )
    impact = bandpass_1pole(rng.normal(0, 1, n), 500, 5200) * env_ad(n, 0.0004, 0.009) * 0.48
    return (stone_modes + impact) * 0.80


def synth_crate_crack(rng: np.random.Generator) -> np.ndarray:
    n = int(0.60 * SR)
    out = np.zeros(n)
    # 3 staggered crisp pine-slat cracks + warm crystalline release
    for delay_s, fc, amp in [(0.0, 1450, 0.52), (0.038, 1920, 0.44), (0.082, 1180, 0.38)]:
        i0 = int(delay_s * SR)
        m = n - i0
        tm = np.arange(m) / SR
        burst = bandpass_1pole(rng.normal(0, 1, m), fc * 0.45, fc * 2.1) * env_ad(m, 0.0006, 0.022) * amp
        wood = np.sin(2 * math.pi * (fc * 0.28) * tm) * env_ad(m, 0.001, 0.04) * (amp * 0.65)
        out[i0:] += burst + wood
    t = np.arange(n) / SR
    sparkle = 0.22 * np.sin(2 * math.pi * 1046.5 * t) * env_ad(n, 0.015, 0.14)
    return (out + sparkle) * 0.78


def synth_match_pop(rng: np.random.Generator) -> np.ndarray:
    n = int(0.48 * SR)
    t = np.arange(n) / SR
    # Glossy Honeydukes fruit/candy pop tuned to C5 (523.25Hz)
    f_pop = 392.0 + 260.0 * (1.0 - np.exp(-t * 55.0))
    bubble = np.sin(2 * math.pi * np.cumsum(f_pop) / SR) * env_ad(n, 0.0015, 0.05) * 0.45
    chime = (
        0.50 * np.sin(2 * math.pi * 523.25 * t) * env_ad(n, 0.002, 0.13)
        + 0.28 * np.sin(2 * math.pi * 783.99 * t) * env_ad(n, 0.0015, 0.10)
        + 0.14 * np.sin(2 * math.pi * 1567.98 * t) * env_ad(n, 0.001, 0.07)
    )
    fizz = bandpass_1pole(rng.normal(0, 1, n), 3000, 8500) * env_ad(n, 0.001, 0.012) * 0.18
    return (bubble + chime + fizz) * 0.78


def synth_talisman_blast(rng: np.random.Generator) -> np.ndarray:
    n = int(0.95 * SR)
    # Phoenix fire whoosh + ascending golden E-major9 chime arpeggio
    whoosh = bandpass_1pole(rng.normal(0, 1, n), 380, 2900) * env_ad(n, 0.045, 0.26) * 0.42
    chimes = np.zeros(n)
    notes = [329.63, 415.30, 493.88, 659.25, 830.61, 987.77]
    for idx, freq in enumerate(notes):
        i0 = int(idx * 0.042 * SR)
        m = n - i0
        tm = np.arange(m) / SR
        chimes[i0:] += (
            0.34 * np.sin(2 * math.pi * freq * tm) * env_ad(m, 0.003, 0.26)
            + 0.18 * np.sin(2 * math.pi * freq * 2.0 * tm) * env_ad(m, 0.002, 0.16)
        )
    return (whoosh + chimes) * 0.72


def synth_build_complete(rng: np.random.Generator) -> np.ndarray:
    n = int(1.05 * SR)
    # Ribbon snip + warm celesta & brass cottage completion chord
    snip = bandpass_1pole(rng.normal(0, 1, n), 2400, 7800) * env_ad(n, 0.001, 0.016) * 0.32
    out = snip.copy()
    notes = [(0.02, 523.25), (0.08, 659.25), (0.14, 783.99), (0.20, 1046.50), (0.28, 1318.51)]
    for d_s, freq in notes:
        i0 = int(d_s * SR)
        m = n - i0
        tm = np.arange(m) / SR
        out[i0:] += (
            0.34 * np.sin(2 * math.pi * freq * tm) * env_ad(m, 0.004, 0.34)
            + 0.16 * np.sin(2 * math.pi * freq * 2.0 * tm) * env_ad(m, 0.002, 0.20)
            + 0.09 * np.sin(2 * math.pi * freq * 3.0 * tm) * env_ad(m, 0.002, 0.12)
        )
    return out * 0.72


def synth_fanfare_win(_rng: np.random.Generator) -> np.ndarray:
    n = int(1.45 * SR)
    out = np.zeros(n)
    # Harp glissando + warm French horn & celesta major triad bloom
    gliss = [440.0, 493.88, 554.37, 659.25, 739.99, 880.0, 987.77, 1108.73, 1318.51]
    for idx, freq in enumerate(gliss):
        i0 = int(idx * 0.045 * SR)
        m = n - i0
        tm = np.arange(m) / SR
        out[i0:] += (
            0.24 * np.sin(2 * math.pi * freq * tm) * env_ad(m, 0.003, 0.32)
            + 0.11 * np.sin(2 * math.pi * freq * 2.0 * tm) * env_ad(m, 0.002, 0.18)
        )
    # Warm chord at 0.42s (A4, E5, A5, C#6, E6)
    i_ch = int(0.42 * SR)
    mc = n - i_ch
    tc = np.arange(mc) / SR
    for freq, amp in [(440.0, 0.24), (659.25, 0.22), (880.0, 0.26), (1108.73, 0.22), (1318.51, 0.24)]:
        out[i_ch:] += (
            amp * np.sin(2 * math.pi * freq * tc) * env_ad(mc, 0.018, 0.52)
            + (amp * 0.35) * np.sin(2 * math.pi * freq * 2.0 * tc) * env_ad(mc, 0.01, 0.30)
        )
    return out * 0.68


def main() -> None:
    rng = np.random.default_rng(7772026)
    # Fixed offsets matching SFX_ATLAS_CUES in src/engine/audio.ts
    cues = [
        ("click", 0.0, synth_click(rng)),
        ("place", 0.6, synth_place(rng)),
        ("harvest", 1.4, synth_harvest(rng)),
        ("water", 2.2, synth_water(rng)),
        ("chess_clack", 3.1, synth_chess_clack(rng)),
        ("crate_crack", 3.9, synth_crate_crack(rng)),
        ("match_pop", 4.8, synth_match_pop(rng)),
        ("talisman_blast", 5.6, synth_talisman_blast(rng)),
        ("build_complete", 6.8, synth_build_complete(rng)),
        ("fanfare_win", 8.1, synth_fanfare_win(rng)),
    ]

    total_sec = 9.8
    total_samples = int(total_sec * SR)
    left = np.zeros(total_samples, dtype=np.float64)
    right = np.zeros(total_samples, dtype=np.float64)

    for name, offset_s, mono in cues:
        i0 = int(round(offset_s * SR))
        end = min(total_samples, i0 + len(mono))
        seg = mono[: end - i0]
        # Subtle 8ms Haas stereo warmth on reverb tail
        left[i0:end] += seg
        right[i0:end] += seg * 0.96
        delay = int(0.008 * SR)
        if i0 + delay < total_samples:
            r_end = min(total_samples, i0 + delay + len(seg))
            right[i0 + delay : r_end] += seg[: r_end - (i0 + delay)] * 0.14
        print(f"  cue {name:16s} @ {offset_s:4.2f}s  ({len(seg)/SR:.2f}s)")

    peak = max(1e-6, float(max(np.max(np.abs(left)), np.max(np.abs(right)))))
    scale = 0.88 / peak
    stereo = np.empty((total_samples, 2), dtype=np.int16)
    stereo[:, 0] = np.clip(left * scale * 32767.0, -32767, 32767).astype(np.int16)
    stereo[:, 1] = np.clip(right * scale * 32767.0, -32767, 32767).astype(np.int16)

    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "audio")
    os.makedirs(out_dir, exist_ok=True)
    out_mp3 = os.path.join(out_dir, "sfx_atlas.mp3")

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        wav_path = tmp.name
    try:
        with wave.open(wav_path, "wb") as wf:
            wf.setnchannels(2)
            wf.setsampwidth(2)
            wf.setframerate(SR)
            wf.writeframes(stereo.tobytes())

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                wav_path,
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "128k",
                out_mp3,
            ],
            check=True,
        )
    finally:
        if os.path.exists(wav_path):
            os.remove(wav_path)

    size_kb = os.path.getsize(out_mp3) / 1024.0
    print(f"Generated {out_mp3} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
