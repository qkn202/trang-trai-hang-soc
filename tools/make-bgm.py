#!/usr/bin/env python3
"""
Generates the park's background music tracks as real stereo chamber recordings.

Each track features 4-section arrangements (A - B - C - A', 61-70 seconds) using
physical/acoustic modeled instruments:
  - Felt celesta (tine + felt hammer transient)
  - Concert harp (plucked harmonics + warm soundboard resonance)
  - Wood flute (breath chiff onset + woody harmonics + delayed vibrato)
  - Warm chamber strings (detuned legato viola/violin chord ensemble)
  - Bowed cello (sustained low warmth with natural vibrato)
  - Soft mallet bells

Everything wraps seamlessly around loop boundaries via circular note addition and
decorrelated L/R circular convolution hall reverb, encoded at 44.1 kHz Stereo 96 kbps.

Usage:  python3 tools/make-bgm.py
Output:
  public/audio/bgm_day.mp3      - Sunlit Hogsmeade (~70.0s)
  public/audio/bgm_night.mp3    - After-hours Hogsmeade (~63.3s)
  public/audio/bgm_festival.mp3 - Quidditch Cup / festival (~61.9s)
  public/audio/bgm_storm.mp3    - Gathering Storm (~63.8s)
  public/audio/bgm_rain.mp3     - Cozy Rainfall / Winter Snow (~63.5s)
"""

import math
import os
import subprocess
import wave

import numpy as np

SR = 44100
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "audio")
TMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".bgm-tmp")


# ---------------------------------------------------------------- helpers

def midi_to_hz(m: float) -> float:
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))


NOTE_BASE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def n(name: str) -> int:
    """'C4' -> 60, 'F#3' -> 54. Supports flats too."""
    letter = name[0].upper()
    idx = 1
    acc = 0
    if len(name) > 1 and name[1] in "#b":
        acc = 1 if name[1] == "#" else -1
        idx = 2
    octave = int(name[idx:])
    return 12 * (octave + 1) + NOTE_BASE[letter] + acc


def transpose_note(name: str, semitones: int) -> str:
    letter = name[0].upper()
    idx = 1
    acc = 0
    if len(name) > 1 and name[1] in "#b":
        acc = 1 if name[1] == "#" else -1
        idx = 2
    octave = int(name[idx:])
    m = 12 * (octave + 1) + NOTE_BASE[letter] + acc + semitones
    new_oct = m // 12 - 1
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    return f"{names[m % 12]}{new_oct}"


def pan_add(buf_l: np.ndarray, buf_r: np.ndarray, start: float, sig: np.ndarray,
            gain: float = 1.0, pan: float = 0.0) -> None:
    """Add a mono signal into circular stereo buffers using equal-power panning (-1..+1)."""
    n_samples = len(buf_l)
    start_i = int(round(start * SR)) % n_samples
    idx = (start_i + np.arange(len(sig))) % n_samples
    p = max(-1.0, min(1.0, pan))
    theta = (p + 1.0) * (math.pi * 0.25)
    g_l = gain * math.cos(theta)
    g_r = gain * math.sin(theta)
    np.add.at(buf_l, idx, sig * g_l)
    np.add.at(buf_r, idx, sig * g_r)


def adsr(n_samples: int, attack: float, decay: float, sustain: float, release: float,
         sr: int = SR) -> np.ndarray:
    a = max(1, int(attack * sr))
    d = max(1, int(decay * sr))
    r = max(1, int(release * sr))
    s = max(1, n_samples - a - d - r)
    env = np.concatenate([
        np.linspace(0.0, 1.0, a, endpoint=False),
        np.linspace(1.0, sustain, d, endpoint=False),
        np.full(s, sustain),
        np.linspace(sustain, 0.0, r),
    ])
    if len(env) < n_samples:
        env = np.pad(env, (0, n_samples - len(env)))
    return env[:n_samples]


def _bandpass_noise(length: int, f_lo: float, f_hi: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    noise = rng.normal(0.0, 1.0, length)
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(length, 1.0 / SR)
    mask = np.exp(-0.5 * ((np.maximum(0.0, f_lo - freqs) / max(30.0, f_lo * 0.35)) ** 2))
    mask *= np.exp(-0.5 * ((np.maximum(0.0, freqs - f_hi) / max(60.0, f_hi * 0.3)) ** 2))
    return np.fft.irfft(spec * mask, n=length)


# ---------------------------------------------------------------- instruments

def render_celesta(midi: float, dur: float) -> np.ndarray:
    """Felt-hammer celesta: warm tine partials + subtle felt mallet onset."""
    f = midi_to_hz(midi)
    partials = [(1.0, 1.0, 1.0), (2.0, 0.38, 0.62), (3.01, 0.19, 0.42),
                (4.18, 0.09, 0.26), (5.43, 0.04, 0.16)]
    total = int((dur + 2.2) * SR)
    out = np.zeros(total)
    t = np.arange(total) / SR
    for mult, amp, decay_scale in partials:
        fq = f * mult
        if fq > SR * 0.44:
            continue
        decay = min(2.4, dur * 0.9 + 0.5) * decay_scale
        env = np.exp(-t / max(0.05, decay)) * (1.0 - np.exp(-t / 0.0045))
        out += amp * np.sin(2 * np.pi * fq * t) * env
    # Soft felt hammer thud (2.5ms)
    hammer = _bandpass_noise(total, 650.0, 2200.0, int(midi * 17)) * np.exp(-t / 0.008) * 0.09
    out += hammer
    fade = min(64, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_harp(midi: float, dur: float) -> np.ndarray:
    """Plucked concert harp string + wooden soundboard body resonance."""
    f = midi_to_hz(midi)
    total = int((dur + 1.0) * SR)
    t = np.arange(total) / SR
    out = np.zeros(total)
    for k in range(1, 9):
        fq = f * k
        if fq > SR * 0.44:
            continue
        amp = 1.0 / (k ** 1.38)
        out += amp * np.sin(2 * np.pi * fq * t + k * 0.28)
    # Warm wooden box resonance near 215 Hz on pluck onset
    body = 0.16 * np.sin(2 * np.pi * 215.0 * t) * np.exp(-t / 0.075)
    env = np.exp(-t / 0.46) * (1.0 - np.exp(-t / 0.003))
    out = out * env + body * (1.0 - np.exp(-t / 0.002))
    fade = min(64, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_cello(midi: float, dur: float) -> np.ndarray:
    """Sustained bowed cello with gentle bow rosin onset and lyrical vibrato."""
    f = midi_to_hz(midi)
    total = int((dur + 0.42) * SR)
    t = np.arange(total) / SR
    vib_depth = np.clip((t - 0.14) / 0.25, 0.0, 1.0) * 0.0045
    vib = 1.0 + vib_depth * np.sin(2 * np.pi * 5.1 * t)
    phase = 2 * np.pi * np.cumsum(f * vib) / SR
    out = np.zeros(total)
    for k in range(1, 10):
        fq = f * k
        if fq > SR * 0.44:
            break
        amp = 1.0 / (k ** 1.62)
        out += amp * np.sin(k * phase)
    env = adsr(total, 0.10, 0.26, 0.74, 0.32)
    rosin = _bandpass_noise(total, 420.0, 1600.0, int(midi * 23)) * np.exp(-t / 0.05) * 0.04
    out = out * env + rosin * env
    fade = min(180, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_wood_flute(midi: float, dur: float) -> np.ndarray:
    """Warm wooden chamber flute with breathy onset, woody partials & delayed vibrato."""
    f = midi_to_hz(midi)
    total = int((dur + 0.30) * SR)
    t = np.arange(total) / SR
    vib_amt = np.clip((t - 0.16) / 0.22, 0.0, 1.0) * 0.0055
    inst_f = f * (1.0 + vib_amt * np.sin(2 * np.pi * 5.3 * t))
    phase = 2 * np.pi * np.cumsum(inst_f) / SR
    harmonics = [(1, 1.0), (2, 0.44), (3, 0.20), (4, 0.07)]
    tone = np.zeros(total)
    for k, amp in harmonics:
        if f * k < SR * 0.44:
            tone += amp * np.sin(k * phase)
    breath_env = np.exp(-t / 0.045) * (1.0 - np.exp(-t / 0.006))
    breath = _bandpass_noise(total, max(350.0, f * 0.8), min(5200.0, f * 4.5), int(midi * 31)) * breath_env * 0.22
    sustained_air = _bandpass_noise(total, f * 1.2, min(4800.0, f * 3.8), int(midi * 37)) * 0.032
    env = adsr(total, 0.068, 0.14, 0.78, 0.22)
    out = (tone + sustained_air) * env + breath
    fade = min(120, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_warm_strings(tones_midi: list[float], dur: float) -> np.ndarray:
    """Legato chamber viola/violin ensemble chord pad (detuned voices +/-3.5 cents)."""
    total = int((dur + 0.65) * SR)
    t = np.arange(total) / SR
    out = np.zeros(total)
    detunes = [2.0 ** (-3.5 / 1200.0), 2.0 ** (3.5 / 1200.0)]
    for midi in tones_midi:
        f_base = midi_to_hz(midi)
        for d_idx, det in enumerate(detunes):
            f = f_base * det
            vib = 1.0 + 0.003 * np.sin(2 * np.pi * (4.6 + 0.3 * d_idx) * t + d_idx * 1.4)
            ph = 2 * np.pi * np.cumsum(f * vib) / SR
            voice = np.zeros(total)
            for k in range(1, 7):
                if f * k < SR * 0.42:
                    voice += (1.0 / (k ** 1.85)) * np.sin(k * ph + d_idx * 0.6)
            out += voice
    out /= max(1.0, len(tones_midi) * 2.0)
    env = adsr(total, 0.30, 0.25, 0.72, 0.50)
    out *= env
    fade = min(220, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_bell(midi: float, dur: float, gain: float = 1.0) -> np.ndarray:
    """Soft mallet bell for phrasing sparkle."""
    f = midi_to_hz(midi)
    total = int((dur + 1.4) * SR)
    t = np.arange(total) / SR
    out = np.zeros(total)
    for mult, amp, dec in [(1.0, 1.0, 1.0), (2.76, 0.26, 0.6), (5.4, 0.09, 0.35)]:
        if f * mult < SR * 0.45:
            out += amp * np.sin(2 * np.pi * f * mult * t) * np.exp(-t / (1.1 * dec))
    out *= (1.0 - np.exp(-t / 0.002))
    fade = min(64, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out * gain


# ---------------------------------------------------------------- stereo reverb

def make_ir_pair(seconds: float = 1.9, decay: float = 3.2) -> tuple[np.ndarray, np.ndarray]:
    """Decorrelated L/R hall impulse responses with warm early reflections."""
    n_s = int(seconds * SR)
    t = np.arange(n_s) / SR
    rng_l = np.random.default_rng(7)
    rng_r = np.random.default_rng(19)
    ir_l = rng_l.normal(0, 1, n_s) * np.exp(-t * decay)
    ir_r = rng_r.normal(0, 1, n_s) * np.exp(-t * decay)
    for delay_ms, g in [(17, 0.42), (29, 0.31), (43, 0.24), (67, 0.16)]:
        dl = int(delay_ms * SR / 1000)
        dr = int((delay_ms + 3.5) * SR / 1000)
        if dl < n_s:
            ir_l[dl] += g
        if dr < n_s:
            ir_r[dr] += g
    ir_l[0] += 1.0
    ir_r[0] += 1.0
    ir_l /= np.sqrt(np.sum(ir_l ** 2))
    ir_r /= np.sqrt(np.sum(ir_r ** 2))
    return ir_l, ir_r


def circular_reverb_stereo(
    dry_l: np.ndarray, dry_r: np.ndarray, ir_pair: tuple[np.ndarray, np.ndarray], mix: float
) -> tuple[np.ndarray, np.ndarray]:
    """Circular stereo convolution + subtle cross-feed so loops wrap click-free."""
    n_s = len(dry_l)
    ir_l, ir_r = ir_pair
    pad_l = np.zeros(n_s)
    pad_r = np.zeros(n_s)
    m = min(len(ir_l), n_s)
    pad_l[:m] = ir_l[:m]
    pad_r[:m] = ir_r[:m]
    wet_l = np.fft.irfft(np.fft.rfft(dry_l) * np.fft.rfft(pad_l), n=n_s)
    wet_r = np.fft.irfft(np.fft.rfft(dry_r) * np.fft.rfft(pad_r), n=n_s)
    # Cross-bleed 18% of opposite room tail for coherent acoustic space
    room_l = wet_l * 0.82 + wet_r * 0.18
    room_r = wet_r * 0.82 + wet_l * 0.18
    return dry_l * (1.0 - mix) + room_l * mix, dry_r * (1.0 - mix) + room_r * mix


def normalize_stereo(left: np.ndarray, right: np.ndarray, peak: float = 0.86) -> tuple[np.ndarray, np.ndarray]:
    m = max(float(np.max(np.abs(left))), float(np.max(np.abs(right))))
    if m < 1e-9:
        return left, right
    scale = peak / m
    k = 1.05
    nl = np.tanh(left * scale * k) / np.tanh(k)
    nr = np.tanh(right * scale * k) / np.tanh(k)
    return nl, nr


def write_wav_stereo(path: str, left: np.ndarray, right: np.ndarray) -> None:
    interleaved = np.empty((len(left), 2), dtype="<i2")
    interleaved[:, 0] = (np.clip(left, -1.0, 1.0) * 32767.0).astype("<i2")
    interleaved[:, 1] = (np.clip(right, -1.0, 1.0) * 32767.0).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(interleaved.tobytes())


def encode_mp3(wav_path: str, mp3_path: str, bitrate: str = "96k") -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
         "-codec:a", "libmp3lame", "-b:a", bitrate, "-ar", "44100",
         "-ac", "2", mp3_path],
        check=True,
    )


# ---------------------------------------------------------------- stereo ensemble voices

bpm_holder = {"bpm": 96}


def _beat_to_sec(beat: float) -> float:
    return beat * 60.0 / bpm_holder["bpm"]


def mix_voice(buf_l: np.ndarray, buf_r: np.ndarray, events, renderer, dur_scale: float,
              gain: float, pan: float) -> None:
    for (beat, dur, midi, vel) in events:
        sig = renderer(midi, dur * dur_scale)
        pan_add(buf_l, buf_r, _beat_to_sec(beat), sig, gain * vel, pan)


def mix_strings(buf_l: np.ndarray, buf_r: np.ndarray, pad_events, gain: float) -> None:
    for (beat, dur, tones_midi, vel) in pad_events:
        sig = render_warm_strings(tones_midi, _beat_to_sec(dur * 0.98))
        # Wide stereo string choir
        pan_add(buf_l, buf_r, _beat_to_sec(beat), sig, gain * vel, -0.35)
        pan_add(buf_l, buf_r, _beat_to_sec(beat) + 0.014, sig, gain * vel * 0.85, 0.35)


# ---------------------------------------------------------------- 5 adaptive 4-section BGM arrangements

def build_day():
    """Mood 1 - Sunlit Hogsmeade (bgm_day.mp3):
    4-Section Pastoral Chamber Piece (A - B - C - A'), 96 BPM, 112 beats = 70.0s.
    Features felt celesta, wooden flute response, concert harp, cello & warm legato strings.
    """
    bpm = 96
    bpm_holder["bpm"] = bpm
    beats_total = 112
    length = int(beats_total * 60.0 / bpm * SR)
    buf_l = np.zeros(length)
    buf_r = np.zeros(length)

    # Progressions: A (C-G-Am-F x2), B (F-C-Dm-G x2), C (Am-F-C-G x2), A' (C-G-Am-F + C)
    sec_chords = [
        ("C", ["C4", "E4", "G4"], "C3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("C", ["C4", "E4", "G4"], "C3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        # Section B (bars 8..15)
        ("F", ["A3", "C4", "F4"], "F2"), ("C", ["G3", "C4", "E4"], "C3"),
        ("Dm", ["F3", "A3", "D4"], "D3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("F", ["A3", "C4", "F4"], "F2"), ("C", ["G3", "C4", "E4"], "C3"),
        ("Dm", ["F3", "A3", "D4"], "D3"), ("G", ["B3", "D4", "G4"], "G2"),
        # Section C (bars 16..23)
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("C", ["C4", "E4", "G4"], "C3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("Dm", ["F3", "A3", "D4"], "D3"), ("G", ["B3", "D4", "G4"], "G2"),
        # Section A' (bars 24..27)
        ("C", ["C4", "E4", "G4"], "C3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("F", ["A3", "C4", "F4"], "F2"), ("C", ["C4", "E4", "G4"], "C3"),
    ]

    motif_a = [
        (0.0, 1.0, "E5"), (1.0, 1.0, "G5"), (2.0, 2.0, "C6"),
        (4.0, 1.0, "B5"), (5.0, 1.0, "A5"), (6.0, 2.0, "G5"),
        (8.0, 1.0, "F5"), (9.0, 1.0, "E5"), (10.0, 2.0, "D5"),
        (12.0, 1.0, "E5"), (13.0, 1.0, "G5"), (14.0, 2.0, "A5"),
    ]
    motif_b = [
        (0.0, 1.5, "A5"), (1.5, 0.5, "G5"), (2.0, 2.0, "F5"),
        (4.0, 1.5, "E5"), (5.5, 0.5, "F5"), (6.0, 2.0, "G5"),
        (8.0, 1.0, "F5"), (9.0, 1.0, "A5"), (10.0, 2.0, "D5"),
        (12.0, 1.0, "E5"), (13.0, 1.0, "F5"), (14.0, 2.0, "G5"),
    ]

    celesta = []
    flute = []
    # Section A (beats 0..31): Bright celesta + playful flute echoes
    for (b, d, note) in motif_a:
        celesta.append((b, d, n(note), 0.92))
        celesta.append((b + 16, d, n(transpose_note(note, 3)) if d < 2 else n(note), 0.88))
    flute.extend([(24.0, 2.0, n("A5"), 0.72), (26.0, 2.0, n("G5"), 0.68), (28.0, 3.5, n("C6"), 0.76)])

    # Section B (beats 32..63): Wood flute takes lead melody, celesta sprinkles arpeggios
    for (b, d, note) in motif_b:
        flute.append((32.0 + b, d, n(note), 0.86))
        flute.append((48.0 + b, d, n(transpose_note(note, 2)) if b < 8 else n(note), 0.90))
        celesta.append((32.0 + b + 0.5, 0.5, n(note) + 12, 0.35))

    # Section C (beats 64..95): Warm soaring strings + celesta/flute duet
    for (b, d, note) in motif_a:
        celesta.append((64.0 + b, d, n(note), 0.90))
        flute.append((80.0 + b, d, n(note) - 12, 0.82))

    # Section A' (beats 96..111): Gentle return home
    for (b, d, note) in motif_a:
        celesta.append((96.0 + b, d, n(note), 0.84 if b < 12 else 0.90))
    flute.append((108.0, 3.8, n("C5"), 0.72))

    harp = []
    cello = []
    strings = []
    for bar, (_, tones, root) in enumerate(sec_chords):
        for eighth in range(8):
            tone = tones[(eighth + bar) % len(tones)]
            harp.append((bar * 4 + eighth * 0.5, 0.5, n(tone) + (12 if eighth % 2 == 0 else 0),
                         0.28 if eighth % 2 == 0 else 0.18))
        cello.append((bar * 4.0, 3.8, n(root), 0.52))
        cello.append((bar * 4.0 + 2.0, 1.8, n(root) + 7, 0.30))
        if 8 <= bar < 24:
            strings.append((bar * 4.0, 3.9, [float(n(t)) for t in tones], 0.62 if bar >= 16 else 0.44))

    bells = [
        (0.0, 1.0, n("C6"), 0.24), (32.0, 1.0, n("F5") + 12, 0.22),
        (64.0, 1.0, n("A5"), 0.25), (96.0, 1.2, n("C6"), 0.26), (110.0, 1.5, n("G5") + 12, 0.18),
    ]

    mix_voice(buf_l, buf_r, celesta, render_celesta, 0.92, 0.44, 0.0)
    mix_voice(buf_l, buf_r, flute, render_wood_flute, 0.95, 0.34, 0.24)
    mix_voice(buf_l, buf_r, harp, render_harp, 0.90, 0.21, -0.24)
    mix_voice(buf_l, buf_r, cello, render_cello, 0.98, 0.34, 0.15)
    mix_voice(buf_l, buf_r, bells, render_bell, 1.0, 0.18, -0.18)
    mix_strings(buf_l, buf_r, strings, 0.22)

    return circular_reverb_stereo(buf_l, buf_r, make_ir_pair(1.8, 3.3), 0.27)


def build_night():
    """Mood 2 - After-hours Hogsmeade (bgm_night.mp3):
    4-Section Nocturne (A - B - C - A'), 72 BPM, 76 beats = 63.3s.
    """
    bpm = 72
    bpm_holder["bpm"] = bpm
    beats_total = 76
    length = int(beats_total * 60.0 / bpm * SR)
    buf_l = np.zeros(length)
    buf_r = np.zeros(length)

    chords = [
        # A (bars 0..4)
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("C", ["G3", "C4", "E4"], "C3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("Am", ["A3", "C4", "E4"], "A2"),
        # B (bars 5..9)
        ("Dm", ["F3", "A3", "D4"], "D3"), ("F", ["A3", "C4", "F4"], "F2"),
        ("Em", ["G3", "B3", "E4"], "E2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("G", ["B3", "D4", "G4"], "G2"),
        # C (bars 10..14)
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("C", ["G3", "C4", "E4"], "C3"), ("Dm", ["F3", "A3", "D4"], "D3"),
        ("E7", ["G#3", "B3", "E4"], "E2"),
        # A' (bars 15..18)
        ("Am", ["A3", "C4", "E4"], "A2"), ("F", ["A3", "C4", "F4"], "F2"),
        ("G", ["B3", "D4", "G4"], "G2"), ("Am", ["A3", "C4", "E4"], "A2"),
    ]

    motif_a = [
        (0.0, 2.0, "A4"), (2.0, 2.0, "C5"), (4.0, 4.0, "E5"),
        (8.0, 2.0, "D5"), (10.0, 2.0, "C5"), (12.0, 4.0, "A4"),
        (16.0, 3.5, "E5"),
    ]
    motif_b = [
        (20.0, 2.0, "F5"), (22.0, 2.0, "E5"), (24.0, 4.0, "D5"),
        (28.0, 2.0, "B4"), (30.0, 2.0, "D5"), (32.0, 3.5, "C5"),
        (36.0, 3.5, "B4"),
    ]
    motif_c = [
        (40.0, 2.0, "E5"), (42.0, 2.0, "A5"), (44.0, 4.0, "G5"),
        (48.0, 2.0, "F5"), (50.0, 2.0, "E5"), (52.0, 4.0, "D5"),
        (56.0, 3.5, "E5"),
    ]
    motif_ap = [
        (60.0, 2.0, "C5"), (62.0, 2.0, "A4"), (64.0, 4.0, "G4"),
        (68.0, 2.0, "B4"), (70.0, 2.0, "C5"), (72.0, 3.8, "A4"),
    ]

    celesta = [(b, d, n(note), 0.85) for (b, d, note) in (motif_a + motif_ap)]
    flute = [(b, d, n(note), 0.78) for (b, d, note) in (motif_b + motif_c)]

    harp = []
    cello = []
    strings = []
    for bar, (_, tones, root) in enumerate(chords):
        for eighth in range(8):
            if eighth % 2 == 0:
                tone = tones[(eighth // 2 + bar) % len(tones)]
                harp.append((bar * 4 + eighth * 0.5, 1.0, n(tone) + (12 if eighth % 4 == 0 else 0), 0.19))
        cello.append((bar * 4.0, 3.9, n(root), 0.52))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.28))
        if bar >= 5 and bar < 16:
            strings.append((bar * 4.0, 3.9, [float(n(t)) for t in tones], 0.55 if bar >= 10 else 0.38))

    bells = [
        (0.0, 1.2, n("A5"), 0.22), (20.0, 1.2, n("D5") + 12, 0.20),
        (40.0, 1.2, n("E5") + 12, 0.22), (72.0, 1.5, n("E5"), 0.20),
    ]

    mix_voice(buf_l, buf_r, celesta, render_celesta, 0.94, 0.40, 0.0)
    mix_voice(buf_l, buf_r, flute, render_wood_flute, 0.96, 0.32, 0.22)
    mix_voice(buf_l, buf_r, harp, render_harp, 0.95, 0.18, -0.24)
    mix_voice(buf_l, buf_r, cello, render_cello, 0.98, 0.38, 0.14)
    mix_voice(buf_l, buf_r, bells, render_bell, 1.0, 0.18, -0.16)
    mix_strings(buf_l, buf_r, strings, 0.24)

    return circular_reverb_stereo(buf_l, buf_r, make_ir_pair(2.4, 2.6), 0.34)


def build_festival():
    """Mood 3 - Quidditch Cup / Harvest Festival (bgm_festival.mp3):
    4-Section Spirited Country Reel, 124 BPM, 128 beats = 61.9s.
    """
    bpm = 124
    bpm_holder["bpm"] = bpm
    beats_total = 128
    length = int(beats_total * 60.0 / bpm * SR)
    buf_l = np.zeros(length)
    buf_r = np.zeros(length)

    prog = [
        ("C", ["C4", "E4", "G4"], "C3"), ("G", ["B3", "D4", "G4"], "G2"),
        ("F", ["A3", "C4", "F4"], "F2"), ("G", ["B3", "D4", "G4"], "G2"),
        ("C", ["C4", "E4", "G4"], "C3"), ("Am", ["A3", "C4", "E4"], "A2"),
        ("F", ["A3", "C4", "F4"], "F2"), ("G", ["B3", "D4", "G4"], "G2"),
    ] * 4  # 32 bars

    celesta = []
    flute = []
    scale = ["G4", "A4", "B4", "D5", "E5", "G5", "D5", "B4"]
    for i in range(124):
        beat = i * 1.0
        sec = i // 32
        degree = [0, 2, 4, 5, 4, 2, 1, 2][i % 8] if sec % 2 == 0 else [4, 5, 6, 4, 2, 4, 1, 0][i % 8]
        if i % 8 == 7:
            continue
        note = scale[degree % len(scale)]
        if sec in (0, 2, 3):
            celesta.append((beat, 0.9, n(note), 0.85))
        if sec in (1, 2):
            flute.append((beat, 0.95, n(note), 0.88 if sec == 1 else 0.72))
    celesta.extend([(124.0, 1.0, n("D5"), 0.9), (125.0, 1.0, n("E5"), 0.92), (126.0, 1.8, n("C5"), 0.98)])
    flute.append((126.0, 1.8, n("G5"), 0.78))

    harp = []
    cello = []
    strings = []
    for bar in range(32):
        _, tones, root = prog[bar]
        for eighth in range(8):
            harp.append((bar * 4 + eighth * 0.5, 0.45, n(tones[eighth % len(tones)]) + 12, 0.22))
        cello.append((bar * 4.0, 1.9, n(root), 0.45))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.35))
        if 16 <= bar < 28:
            strings.append((bar * 4.0, 3.8, [float(n(t)) for t in tones], 0.56))

    bells = [(bar * 8.0, 1.0, n("C6" if bar % 2 == 0 else "G5"), 0.23) for bar in range(16)]

    mix_voice(buf_l, buf_r, celesta, render_celesta, 0.92, 0.42, 0.0)
    mix_voice(buf_l, buf_r, flute, render_wood_flute, 0.92, 0.34, 0.24)
    mix_voice(buf_l, buf_r, harp, render_harp, 0.88, 0.22, -0.24)
    mix_voice(buf_l, buf_r, cello, render_cello, 0.95, 0.30, 0.14)
    mix_voice(buf_l, buf_r, bells, render_bell, 1.0, 0.20, -0.18)
    mix_strings(buf_l, buf_r, strings, 0.21)

    return circular_reverb_stereo(buf_l, buf_r, make_ir_pair(1.4, 3.6), 0.22)


def build_storm():
    """Mood 4 - Gathering Storm (bgm_storm.mp3):
    4-Section Dramatic D-minor Chamber Piece, 64 BPM, 68 beats = 63.75s.
    """
    bpm = 64
    bpm_holder["bpm"] = bpm
    beats_total = 68
    length = int(beats_total * 60.0 / bpm * SR)
    buf_l = np.zeros(length)
    buf_r = np.zeros(length)

    chords = [
        ("Dm", ["D3", "F3", "A3"], "D2"), ("Gm", ["D3", "G3", "Bb3"], "G2"),
        ("Bb", ["D3", "F3", "Bb3"], "A#1"), ("A7", ["C#3", "E3", "A3"], "A1"),
        ("Dm", ["D3", "F3", "A3"], "D2"), ("Gm", ["D3", "G3", "Bb3"], "G2"),
        ("C", ["C3", "E3", "G3"], "C2"), ("A7", ["C#3", "E3", "A3"], "A1"),
        ("Dm", ["D3", "F3", "A3"], "D2"), ("Bb", ["D3", "F3", "Bb3"], "A#1"),
        ("Gm", ["D3", "G3", "Bb3"], "G2"), ("A7", ["C#3", "E3", "A3"], "A1"),
        ("Dm", ["D3", "F3", "A3"], "D2"), ("Gm", ["D3", "G3", "Bb3"], "G2"),
        ("Bb", ["D3", "F3", "Bb3"], "A#1"), ("A7", ["C#3", "E3", "A3"], "A1"),
        ("Dm", ["D3", "F3", "A3"], "D2"),
    ]  # 17 bars = 68 beats

    celesta = [
        (0.0, 3.0, n("D4"), 0.85), (3.0, 1.0, n("F4"), 0.80), (4.0, 4.0, n("G4"), 0.86),
        (8.0, 3.0, n("F4"), 0.85), (11.0, 1.0, n("D4"), 0.82), (12.0, 3.8, n("C#4"), 0.88),
        (52.0, 2.0, n("A4"), 0.84), (54.0, 2.0, n("G4"), 0.82), (56.0, 4.0, n("F4"), 0.86),
        (60.0, 3.0, n("E4"), 0.84), (64.0, 3.8, n("D4"), 0.90),
    ]
    flute = [
        (16.0, 3.0, n("A4"), 0.84), (19.0, 1.0, n("Bb4"), 0.80), (20.0, 4.0, n("G4"), 0.86),
        (24.0, 2.0, n("E4"), 0.82), (26.0, 2.0, n("F4"), 0.82), (28.0, 3.8, n("A4"), 0.88),
        (32.0, 3.0, n("D5"), 0.88), (35.0, 1.0, n("C5"), 0.82), (36.0, 4.0, n("Bb4"), 0.88),
        (40.0, 2.0, n("G4"), 0.82), (42.0, 2.0, n("Bb4"), 0.84), (44.0, 3.8, n("A4"), 0.88),
    ]

    harp = []
    cello = []
    strings = []
    for bar, (_, tones, root) in enumerate(chords):
        for eighth in range(8):
            tone = tones[(eighth + bar) % len(tones)]
            harp.append((bar * 4 + eighth * 0.5, 0.7, n(tone), 0.21 if eighth % 2 == 0 else 0.14))
        cello.append((bar * 4.0, 3.9, n(root), 0.62))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.38))
        if 4 <= bar < 15:
            strings.append((bar * 4.0, 3.9, [float(n(t)) for t in tones], 0.56 if bar >= 8 else 0.40))

    bells = [(b, 1.5, n(nt), 0.28) for b, nt in [(0.0, "D4"), (16.0, "A3"), (32.0, "D4"), (48.0, "A3"), (64.0, "D4")]]

    mix_voice(buf_l, buf_r, celesta, render_celesta, 0.94, 0.40, 0.0)
    mix_voice(buf_l, buf_r, flute, render_wood_flute, 0.96, 0.32, -0.18)
    mix_voice(buf_l, buf_r, harp, render_harp, 0.92, 0.23, 0.22)
    mix_voice(buf_l, buf_r, cello, render_cello, 0.98, 0.48, -0.14)
    mix_voice(buf_l, buf_r, bells, render_bell, 1.0, 0.20, 0.20)
    mix_strings(buf_l, buf_r, strings, 0.25)

    return circular_reverb_stereo(buf_l, buf_r, make_ir_pair(2.7, 2.3), 0.35)


def build_rain():
    """Mood 5 - Cozy Rainfall / Winter Snow (bgm_rain.mp3):
    4-Section Hearthside Warmth (A - B - C - A'), 68 BPM, 72 beats = 63.5s.
    """
    bpm = 68
    bpm_holder["bpm"] = bpm
    beats_total = 72
    length = int(beats_total * 60.0 / bpm * SR)
    buf_l = np.zeros(length)
    buf_r = np.zeros(length)

    chords = [
        ("Fmaj7", ["F3", "A3", "C4", "E4"], "F2"), ("C/E", ["E3", "G3", "C4"], "E2"),
        ("Dm7", ["D3", "F3", "A3", "C4"], "D2"), ("Bb", ["D3", "F3", "Bb3"], "A#1"),
        ("Fmaj7", ["F3", "A3", "C4", "E4"], "F2"), ("Gm7", ["D3", "G3", "Bb3", "F4"], "G2"),
        ("Dm7", ["D3", "F3", "A3", "C4"], "D2"), ("C7", ["E3", "G3", "Bb3", "C4"], "C2"),
        ("F", ["F3", "A3", "C4"], "F2"),
    ] * 2  # 18 bars = 72 beats

    celesta = [
        (0.0, 2.5, n("A4"), 0.72), (4.0, 2.5, n("C5"), 0.74), (8.0, 3.5, n("G4"), 0.70),
        (16.0, 2.0, n("F4"), 0.72), (18.0, 2.0, n("A4"), 0.74), (20.0, 3.5, n("D4"), 0.70),
        (52.0, 2.5, n("A4"), 0.72), (56.0, 2.5, n("G4"), 0.70), (60.0, 2.0, n("F4"), 0.72),
        (64.0, 2.5, n("E4"), 0.70), (68.0, 3.8, n("F4"), 0.75),
    ]
    flute = [
        (24.0, 2.0, n("E4"), 0.72), (26.0, 2.0, n("G4"), 0.74), (28.0, 3.8, n("A4"), 0.76),
        (32.0, 2.5, n("C5"), 0.78), (36.0, 2.5, n("D5"), 0.76), (40.0, 3.5, n("A4"), 0.78),
        (44.0, 2.0, n("Bb4"), 0.76), (46.0, 2.0, n("A4"), 0.74), (48.0, 3.8, n("G4"), 0.72),
    ]

    harp = []
    cello = []
    strings = []
    for bar, (_, tones, root) in enumerate(chords):
        for eighth in range(8):
            if eighth % 2 == 0:
                tone = tones[(eighth // 2 + bar) % len(tones)]
                harp.append((bar * 4 + eighth * 0.5, 0.85, n(tone) + 12, 0.16))
        cello.append((bar * 4.0, 3.9, n(root), 0.48))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.28))
        if 4 <= bar < 16:
            strings.append((bar * 4.0, 3.9, [float(n(t)) for t in tones], 0.52 if bar >= 9 else 0.36))

    bells = [(0.0, 1.2, n("C5"), 0.18), (32.0, 1.2, n("F5"), 0.18), (68.0, 1.5, n("A4"), 0.18)]

    mix_voice(buf_l, buf_r, celesta, render_celesta, 0.95, 0.36, 0.0)
    mix_voice(buf_l, buf_r, flute, render_wood_flute, 0.95, 0.30, 0.22)
    mix_voice(buf_l, buf_r, harp, render_harp, 0.95, 0.17, -0.22)
    mix_voice(buf_l, buf_r, cello, render_cello, 0.98, 0.44, 0.14)
    mix_voice(buf_l, buf_r, bells, render_bell, 1.0, 0.16, -0.15)
    mix_strings(buf_l, buf_r, strings, 0.24)

    return circular_reverb_stereo(buf_l, buf_r, make_ir_pair(2.2, 2.9), 0.31)


TRACKS = {
    "bgm_day": build_day,
    "bgm_night": build_night,
    "bgm_festival": build_festival,
    "bgm_storm": build_storm,
    "bgm_rain": build_rain,
}


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(TMP_DIR, exist_ok=True)
    for name, builder in TRACKS.items():
        print(f"  rendering stereo {name} ...")
        left, right = builder()
        left, right = normalize_stereo(left, right)
        wav_path = os.path.join(TMP_DIR, name + ".wav")
        mp3_path = os.path.join(OUT_DIR, name + ".mp3")
        write_wav_stereo(wav_path, left, right)
        encode_mp3(wav_path, mp3_path, bitrate="96k")
        size_kb = os.path.getsize(mp3_path) / 1024.0
        dur_s = len(left) / SR
        print(f"    -> {mp3_path}  ({size_kb:.1f} KB, {dur_s:.1f}s)")
        assert dur_s >= 60.0, f"{name} duration {dur_s:.1f}s is less than 60s!"
        assert 400.0 <= size_kb <= 980.0, f"{name} size {size_kb:.1f} KB outside 400..980 KB!"
    for f in os.listdir(TMP_DIR):
        os.remove(os.path.join(TMP_DIR, f))
    os.rmdir(TMP_DIR)
    print("✨ All 5 stereo 4-section adaptive BGM tracks rendered successfully!")


if __name__ == "__main__":
    main()
