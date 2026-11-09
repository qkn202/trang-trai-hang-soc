#!/usr/bin/env python3
"""
Generates the park's background music tracks as real audio files.

The engine used to synthesise every note with Web Audio oscillators, which
sounds thin and electronic. This script renders warm, seamless-looping
celesta + harp + cello tracks to WAV and encodes them to MP3 with ffmpeg.

Everything is built so the loops are seamless: notes are rendered with
wrap-around tails (so a note starting near the end continues into the start
of the buffer) and the reverb is applied as a *circular* convolution, which
keeps the reverb tail continuous across the loop point as well.

Usage:  python3 tools/make-bgm.py
Output:
  public/audio/bgm_day.mp3      - Sunlit Hogsmeade (cozy, warm, bright)
  public/audio/bgm_night.mp3    - After-hours Hogsmeade (wistful, quiet)
  public/audio/bgm_festival.mp3 - Quidditch Cup / festival (lively, upbeat)
  public/audio/bgm_storm.mp3    - Bad weather / storm (darker, solemn, heavy low cello)
  public/audio/bgm_rain.mp3     - Rain / winter / snow (gentle, slow pads, sparse melody)
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


def add(buf: np.ndarray, start: float, sig: np.ndarray, gain: float = 1.0) -> None:
    """Add a signal into a circular buffer, wrapping around the end."""
    n = len(buf)
    start_i = int(round(start * SR)) % n
    idx = (start_i + np.arange(len(sig))) % n
    np.add.at(buf, idx, sig * gain)


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


def render_celesta(midi: float, dur: float) -> np.ndarray:
    """Bell-like struck tine: fundamental plus inharmonic partials."""
    f = midi_to_hz(midi)
    partials = [(1.0, 1.0, 1.0), (2.0, 0.42, 0.62), (3.01, 0.22, 0.42),
                (4.18, 0.11, 0.28), (5.43, 0.05, 0.18)]
    total = int((dur + 2.2) * SR)
    out = np.zeros(total)
    t = np.arange(total) / SR
    for mult, amp, decay_scale in partials:
        fq = f * mult
        if fq > SR * 0.45:
            continue
        decay = min(2.4, dur * 0.9 + 0.5) * decay_scale
        env = np.exp(-t / max(0.05, decay)) * (1.0 - np.exp(-t / 0.004))
        out += amp * np.sin(2 * np.pi * fq * t) * env
    # Soften the very front so the attack doesn't click.
    fade = min(64, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_harp(midi: float, dur: float) -> np.ndarray:
    """Plucked string: rich but short, quick decay."""
    f = midi_to_hz(midi)
    total = int((dur + 0.9) * SR)
    t = np.arange(total) / SR
    out = np.zeros(total)
    for k in range(1, 9):
        amp = 1.0 / (k ** 1.35)
        out += amp * np.sin(2 * np.pi * f * k * t + k * 0.3)
    env = np.exp(-t / 0.42) * (1.0 - np.exp(-t / 0.003))
    out *= env
    fade = min(64, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_cello(midi: float, dur: float) -> np.ndarray:
    """Sustained bowed low string with gentle vibrato."""
    f = midi_to_hz(midi)
    total = int((dur + 0.35) * SR)
    t = np.arange(total) / SR
    vib = 1.0 + 0.004 * np.sin(2 * np.pi * 5.2 * t)
    out = np.zeros(total)
    for k in range(1, 10):
        amp = 1.0 / (k ** 1.6)
        out += amp * np.sin(2 * np.pi * f * k * t * vib)
    env = adsr(total, 0.09, 0.25, 0.72, 0.28)
    out *= env
    fade = min(200, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out


def render_bell(midi: float, dur: float, gain: float = 1.0) -> np.ndarray:
    """Soft mallet bell for accents."""
    f = midi_to_hz(midi)
    total = int((dur + 1.4) * SR)
    t = np.arange(total) / SR
    out = np.zeros(total)
    for mult, amp, dec in [(1.0, 1.0, 1.0), (2.76, 0.28, 0.6), (5.4, 0.1, 0.35)]:
        out += amp * np.sin(2 * np.pi * f * mult * t) * np.exp(-t / (1.1 * dec))
    out *= (1.0 - np.exp(-t / 0.002))
    fade = min(64, len(out))
    out[:fade] *= np.linspace(0, 1, fade)
    return out * gain


def circular_reverb(dry: np.ndarray, ir: np.ndarray, mix: float) -> np.ndarray:
    """Circular convolution so reverb tails wrap seamlessly around the loop."""
    n = len(dry)
    # FFT sizes must match: zero-pad the IR to the dry buffer length.
    ir_padded = np.zeros(n)
    m = min(len(ir), n)
    ir_padded[:m] = ir[:m]
    wet = np.fft.irfft(np.fft.rfft(dry) * np.fft.rfft(ir_padded), n=n)
    return dry * (1.0 - mix) + wet * mix


def make_ir(seconds: float = 1.9, decay: float = 3.2) -> np.ndarray:
    rng = np.random.default_rng(7)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * decay)
    # A few early reflections give the hall a sense of size.
    for delay_ms, gain in [(17, 0.42), (29, 0.31), (43, 0.24), (67, 0.16)]:
        d = int(delay_ms * SR / 1000)
        if d < n:
            ir[d] += gain
    ir[0] += 1.0
    ir /= np.sqrt(np.sum(ir ** 2))
    return ir


def normalize(buf: np.ndarray, peak: float = 0.86) -> np.ndarray:
    m = np.max(np.abs(buf))
    if m < 1e-9:
        return buf
    buf = buf / m * peak
    # Gentle soft-clip to catch peaks without hard digital distortion.
    return np.tanh(buf * 1.05) / np.tanh(1.05)


def write_wav(path: str, mono: np.ndarray) -> None:
    data = np.clip(mono, -1.0, 1.0)
    pcm = (data * 32767.0).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def encode_mp3(wav_path: str, mp3_path: str, bitrate: str = "48k") -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
         "-codec:a", "libmp3lame", "-b:a", bitrate, "-ar", "44100",
         "-ac", "1", mp3_path],
        check=True,
    )


# ---------------------------------------------------------------- voices

def celesta_voice(events, length, gain=1.0):
    buf = np.zeros(length)
    for (beat, dur, midi, vel) in events:
        sig = render_celesta(midi, dur * 0.92)
        add(buf, beat * 60.0 / bpm_holder["bpm"], sig, gain * vel)
    return buf


def harp_voice(events, length, gain=1.0):
    buf = np.zeros(length)
    for (beat, dur, midi, vel) in events:
        sig = render_harp(midi, dur * 0.9)
        add(buf, beat * 60.0 / bpm_holder["bpm"], sig, gain * vel)
    return buf


def cello_voice(events, length, gain=1.0):
    buf = np.zeros(length)
    for (beat, dur, midi, vel) in events:
        sig = render_cello(midi, dur * 0.98)
        add(buf, beat * 60.0 / bpm_holder["bpm"], sig, gain * vel)
    return buf


def bell_voice(events, length, gain=1.0):
    buf = np.zeros(length)
    for (beat, dur, midi, vel) in events:
        sig = render_bell(midi, dur)
        add(buf, beat * 60.0 / bpm_holder["bpm"], sig, gain * vel)
    return buf


bpm_holder = {"bpm": 96}


# ---------------------------------------------------------------- tracks

def build_day():
    """Mood 1 - Sunlit Hogsmeade (bgm_day.mp3):
    Cozy, pastoral, sun-drenched day. Bright celesta melody, harp arpeggios, warm cello.
    Tempo: 96 BPM, 64 beats = 40.0s (seamless loop >= 30s).
    """
    bpm = 96
    bpm_holder["bpm"] = bpm
    beats_total = 64
    length = int(beats_total * 60.0 / bpm * SR)

    # Chord loop: C - G - Am - F, four beats each.
    chords = [
        ("C", ["C4", "E4", "G4"], "C3"),
        ("G", ["B3", "D4", "G4"], "G2"),
        ("Am", ["A3", "C4", "E4"], "A2"),
        ("F", ["A3", "C4", "F4"], "F2"),
    ]

    # 16-beat motif, repeated with transposition for a 64-beat phrase.
    motif = [
        (0.0, 1.0, "E5"), (1.0, 1.0, "G5"), (2.0, 2.0, "C6"),
        (4.0, 1.0, "B5"), (5.0, 1.0, "A5"), (6.0, 2.0, "G5"),
        (8.0, 1.0, "F5"), (9.0, 1.0, "E5"), (10.0, 2.0, "D5"),
        (12.0, 1.0, "E5"), (13.0, 1.0, "G5"), (14.0, 2.0, "A5"),
    ]

    def transpose(name, amount):
        letter = name[0]
        idx = 1
        acc = 0
        if len(name) > 1 and name[1] in "#b":
            acc = 1 if name[1] == "#" else -1
            idx = 2
        octave = int(name[idx:])
        m = 12 * (octave + 1) + NOTE_BASE[letter] + acc + amount
        new_oct = m // 12 - 1
        names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        nn = names[m % 12]
        if nn.endswith("#"):
            return f"{nn[0]}#{new_oct}"
        return f"{nn}{new_oct}"

    melody = []
    for (b, d, note) in motif:
        melody.append((b, d, n(note), 0.95))
    # Phrase 2: lift the motif a third for contrast.
    for (b, d, note) in motif:
        melody.append((b + 16, d, n(transpose(note, 3)), 0.9))
    # Phrase 3: settle back down.
    for (b, d, note) in motif:
        melody.append((b + 32, d, n(transpose(note, -2)), 0.85))
    # Phrase 4: restate the opening, ending on the tonic.
    for (b, d, note) in motif:
        melody.append((b + 48, d, n(note), 0.92))
    melody.append((62.0, 2.0, n("C6"), 1.0))

    # Harp arpeggios: eighth notes through each chord.
    harp = []
    for bar in range(16):
        chord_name, tones, _ = chords[bar % 4]
        for eighth in range(8):
            tone = tones[(eighth + bar) % len(tones)]
            if eighth % 2 == 0:
                harp.append((bar * 4 + eighth * 0.5, 0.5, n(tone) + 12, 0.3))
            else:
                harp.append((bar * 4 + eighth * 0.5, 0.5, n(tone), 0.2))

    # Cello: root on bar start, fifth halfway.
    cello = []
    for bar in range(16):
        _, _, root = chords[bar % 4]
        cello.append((bar * 4.0, 3.8, n(root), 0.5))
        cello.append((bar * 4.0 + 2.0, 1.8, n(root) + 7, 0.3))

    bells = [
        (0.0, 1.0, n("C6"), 0.30),
        (16.0, 1.0, n("G5") + 12, 0.26),
        (32.0, 1.0, n("E5") + 12, 0.24),
        (48.0, 1.0, n("C6"), 0.30),
        (60.0, 1.0, n("G5") + 12, 0.22),
    ]

    dry = (celesta_voice(melody, length, 0.52)
           + harp_voice(harp, length, 0.20)
           + cello_voice(cello, length, 0.34)
           + bell_voice(bells, length, 0.20))
    return circular_reverb(dry, make_ir(1.7, 3.4), 0.26)


def build_night():
    """Mood 2 - After-hours Hogsmeade (bgm_night.mp3):
    Calm, nostalgic, wistful evening under the stars.
    Tempo: 74 BPM, 40 beats = 32.4s (seamless loop >= 30s).
    """
    bpm = 74
    bpm_holder["bpm"] = bpm
    beats_total = 40
    length = int(beats_total * 60.0 / bpm * SR)

    # 10 bars: Am - F - C - G - Am - Dm - F - Em - F - G
    chords = [
        ("Am", ["A3", "C4", "E4"], "A2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("C",  ["G3", "C4", "E4"], "C3"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("Am", ["A3", "C4", "E4"], "A2"),
        ("Dm", ["F3", "A3", "D4"], "D3"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("Em", ["G3", "B3", "E4"], "E2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("G",  ["B3", "D4", "G4"], "G2"),
    ]

    motif = [
        (0.0, 2.0, "A4"), (2.0, 2.0, "C5"), (4.0, 4.0, "E5"),
        (8.0, 2.0, "D5"), (10.0, 2.0, "C5"), (12.0, 4.0, "A4"),
        (16.0, 2.0, "G4"), (18.0, 2.0, "B4"), (20.0, 4.0, "D5"),
        (24.0, 2.0, "C5"), (26.0, 2.0, "A4"), (28.0, 4.0, "G4"),
        (32.0, 2.0, "F4"), (34.0, 2.0, "G4"), (36.0, 3.5, "E4"),
    ]
    melody = [(b, d, n(note), 0.9) for (b, d, note) in motif]

    harp = []
    for bar in range(10):
        _, tones, _ = chords[bar]
        for eighth in range(8):
            tone = tones[(eighth // 2 + bar) % len(tones)]
            if eighth % 4 == 0:
                harp.append((bar * 4 + eighth * 0.5, 1.0, n(tone) + 12, 0.22))
            elif eighth % 2 == 0:
                harp.append((bar * 4 + eighth * 0.5, 0.5, n(tone), 0.13))

    cello = []
    for bar in range(10):
        _, _, root = chords[bar]
        cello.append((bar * 4.0, 3.9, n(root), 0.55))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.28))

    bells = [
        (0.0, 1.0, n("A5"), 0.26),
        (16.0, 1.0, n("D5") + 12, 0.20),
        (28.0, 1.0, n("G5"), 0.18),
        (36.0, 1.0, n("E5"), 0.22),
    ]

    dry = (celesta_voice(melody, length, 0.44)
           + harp_voice(harp, length, 0.17)
           + cello_voice(cello, length, 0.40)
           + bell_voice(bells, length, 0.20))
    return circular_reverb(dry, make_ir(2.4, 2.6), 0.34)


def build_festival():
    """Mood 3 - Quidditch Cup / Harvest Festival (bgm_festival.mp3):
    Lively, spirited, upbeat celebration with dancing bells and bouncy harp.
    Tempo: 124 BPM, 64 beats = 31.0s (seamless loop >= 30s).
    """
    bpm = 124
    bpm_holder["bpm"] = bpm
    beats_total = 64
    length = int(beats_total * 60.0 / bpm * SR)

    # 16 bars: C - G - F - G, C - Am - F - G, C - G - F - G, F - G - F - G
    chords = [
        ("C",  ["C4", "E4", "G4"], "C3"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("C",  ["C4", "E4", "G4"], "C3"),
        ("Am", ["A3", "C4", "E4"], "A2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("C",  ["C4", "E4", "G4"], "C3"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("G",  ["B3", "D4", "G4"], "G2"),
        ("F",  ["A3", "C4", "F4"], "F2"),
        ("G",  ["B3", "D4", "G4"], "G2"),
    ]

    melody = []
    scale = ["G4", "A4", "B4", "D5", "E5", "D5", "B4", "A4"]
    for i in range(60):
        beat = i * 1.0
        degree = [0, 2, 4, 7, 4, 2, 0, 2][i % 8]
        note = scale[degree % len(scale)]
        if i % 8 == 7:
            continue
        melody.append((beat, 0.95, n(note), 0.9))
    melody.append((60.0, 1.0, n("D5"), 0.95))
    melody.append((61.0, 1.0, n("E5"), 0.95))
    melody.append((62.0, 1.8, n("C5"), 1.0))

    harp = []
    for bar in range(16):
        _, tones, _ = chords[bar]
        for eighth in range(8):
            harp.append((bar * 4 + eighth * 0.5, 0.45, n(tones[eighth % len(tones)]) + 12, 0.22))

    cello = []
    for bar in range(16):
        _, _, root = chords[bar]
        cello.append((bar * 4.0, 1.9, n(root), 0.45))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.35))

    bells = [(bar * 8.0, 1.0, n("C6" if bar % 2 == 0 else "G5"), 0.24) for bar in range(8)]

    dry = (celesta_voice(melody, length, 0.46)
           + harp_voice(harp, length, 0.22)
           + cello_voice(cello, length, 0.30)
           + bell_voice(bells, length, 0.22))
    return circular_reverb(dry, make_ir(1.3, 3.8), 0.20)


def build_storm():
    """Mood 4 - Gathering Storm / Bad Weather (bgm_storm.mp3):
    Darker, solemn, slower tempo with deep resonant cello pedal points,
    rolling lower harp arpeggios, and moody low-register celesta motif.
    Tempo: 64 BPM, 36 beats = 33.75s (seamless loop >= 30s).
    """
    bpm = 64
    bpm_holder["bpm"] = bpm
    beats_total = 36
    length = int(beats_total * 60.0 / bpm * SR)

    # 9 bars in D minor: Dm - Dm - Gm - Gm - Bb - Bb - A7 - A7 - Dm
    chords = [
        ("Dm", ["D3", "F3", "A3"], "D2"),
        ("Dm", ["D3", "F3", "A3"], "D2"),
        ("Gm", ["D3", "G3", "Bb3"], "G2"),
        ("Gm", ["D3", "G3", "Bb3"], "G2"),
        ("Bb", ["D3", "F3", "Bb3"], "A#1"),
        ("Bb", ["D3", "F3", "Bb3"], "A#1"),
        ("A7", ["C#3", "E3", "A3"], "A1"),
        ("A7", ["C#3", "E3", "A3"], "A1"),
        ("Dm", ["D3", "F3", "A3"], "D2"),
    ]

    # Solemn, dark minor melody in low register
    motif = [
        (0.0, 3.0, "D4"), (3.0, 1.0, "F4"), (4.0, 4.0, "A4"),
        (8.0, 3.0, "G4"), (11.0, 1.0, "Bb4"), (12.0, 4.0, "A4"),
        (16.0, 2.0, "F4"), (18.0, 2.0, "G4"), (20.0, 4.0, "D4"),
        (24.0, 2.0, "E4"), (26.0, 2.0, "F4"), (28.0, 3.0, "C#4"),
        (32.0, 3.5, "D4"),
    ]
    melody = [(b, d, n(note), 0.88) for (b, d, note) in motif]

    # Deep rolling harp in low register
    harp = []
    for bar in range(9):
        _, tones, _ = chords[bar]
        for eighth in range(8):
            tone = tones[(eighth + bar) % len(tones)]
            # Low, rumbling roll
            harp.append((bar * 4 + eighth * 0.5, 0.7, n(tone), 0.20 if eighth % 2 == 0 else 0.14))

    # Heavy, deep sustained cello drone
    cello = []
    for bar in range(9):
        _, _, root = chords[bar]
        cello.append((bar * 4.0, 3.9, n(root), 0.65))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.40))

    # Distant mallet bell on ominous changes
    bells = [
        (0.0, 1.5, n("D4"), 0.32),
        (8.0, 1.5, n("G3"), 0.28),
        (16.0, 1.5, n("Bb3"), 0.26),
        (24.0, 1.5, n("A3"), 0.30),
        (32.0, 2.0, n("D4"), 0.35),
    ]

    dry = (celesta_voice(melody, length, 0.42)
           + harp_voice(harp, length, 0.24)
           + cello_voice(cello, length, 0.52)
           + bell_voice(bells, length, 0.24))
    # Larger, cavernous circular hall reverb for thunderstorm ambience
    return circular_reverb(dry, make_ir(2.8, 2.2), 0.36)


def build_rain():
    """Mood 5 - Cozy Rainfall / Winter Snow (bgm_rain.mp3):
    Gentle, slow, rich warm cello pads, sparse delicate celesta raindrops,
    and soft lulling harp droplets. Cozy warmth by the Burrow fireplace.
    Tempo: 68 BPM, 36 beats = 31.76s (seamless loop >= 30s).
    """
    bpm = 68
    bpm_holder["bpm"] = bpm
    beats_total = 36
    length = int(beats_total * 60.0 / bpm * SR)

    # 9 bars: Fmaj7 - C/E - Dm7 - Bb - Fmaj7 - Gm7 - Dm7 - C7 - F
    chords = [
        ("Fmaj7", ["F3", "A3", "C4", "E4"], "F2"),
        ("C/E",   ["E3", "G3", "C4"],       "E2"),
        ("Dm7",   ["D3", "F3", "A3", "C4"], "D2"),
        ("Bb",    ["D3", "F3", "Bb3"],      "A#1"),
        ("Fmaj7", ["F3", "A3", "C4", "E4"], "F2"),
        ("Gm7",   ["D3", "G3", "Bb3", "F4"],"G2"),
        ("Dm7",   ["D3", "F3", "A3", "C4"], "D2"),
        ("C7",    ["E3", "G3", "Bb3", "C4"],"C2"),
        ("F",     ["F3", "A3", "C4"],       "F2"),
    ]

    # Sparse, gentle celesta notes like slow raindrops on autumn leaves
    motif = [
        (0.0, 2.5, "A4"), (4.0, 2.5, "C5"),
        (8.0, 3.5, "G4"),
        (16.0, 2.0, "F4"), (18.0, 2.0, "A4"),
        (20.0, 3.5, "D4"),
        (26.0, 2.0, "E4"), (28.0, 3.0, "G4"),
        (32.0, 3.8, "F4"),
    ]
    melody = [(b, d, n(note), 0.72) for (b, d, note) in motif]

    # Delicate, quiet harp arpeggios (like gentle drops)
    harp = []
    for bar in range(9):
        _, tones, _ = chords[bar]
        for eighth in range(8):
            if eighth % 2 == 0:
                tone = tones[(eighth // 2 + bar) % len(tones)]
                harp.append((bar * 4 + eighth * 0.5, 0.8, n(tone) + 12, 0.16))

    # Rich, warm, sustained bowed cello pads
    cello = []
    for bar in range(9):
        _, _, root = chords[bar]
        cello.append((bar * 4.0, 3.9, n(root), 0.50))
        cello.append((bar * 4.0 + 2.0, 1.9, n(root) + 7, 0.30))

    # Very soft accents
    bells = [
        (0.0, 1.2, n("C5"), 0.18),
        (16.0, 1.2, n("F5"), 0.16),
        (32.0, 1.5, n("A4"), 0.18),
    ]

    dry = (celesta_voice(melody, length, 0.38)
           + harp_voice(harp, length, 0.18)
           + cello_voice(cello, length, 0.48)
           + bell_voice(bells, length, 0.16))
    # Soft, diffuse warm room convolution
    return circular_reverb(dry, make_ir(2.2, 3.0), 0.30)


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
        print(f"  rendering {name} ...")
        audio = normalize(builder())
        wav_path = os.path.join(TMP_DIR, name + ".wav")
        mp3_path = os.path.join(OUT_DIR, name + ".mp3")
        write_wav(wav_path, audio)
        encode_mp3(wav_path, mp3_path, bitrate="48k")
        size_kb = os.path.getsize(mp3_path) / 1024.0
        dur_s = len(audio) / SR
        print(f"    -> {mp3_path}  ({size_kb:.1f} KB, {dur_s:.1f}s)")
        assert dur_s >= 30.0, f"{name} duration {dur_s:.1f}s is less than 30s!"
        assert size_kb <= 250.0, f"{name} size {size_kb:.1f} KB exceeds 250 KB!"
    # Clean up the intermediate wavs.
    for f in os.listdir(TMP_DIR):
        os.remove(os.path.join(TMP_DIR, f))
    os.rmdir(TMP_DIR)
    print("✨ All 5 adaptive BGM tracks rendered successfully!")


if __name__ == "__main__":
    main()
