#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 2I-E — PILOTO: sons contextuais originais das 6 memórias.
Síntese própria (sem música licenciada). WAV 16-bit mono.
"""
import os
import math
import struct
import wave

BASE = r'C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90'
AUDIO = os.path.join(BASE, 'assets', 'audio')
os.makedirs(AUDIO, exist_ok=True)
SR = 22050


def write_wav(name, samples):
    path = os.path.join(AUDIO, name + '.wav')
    with wave.open(path, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        frames = bytearray()
        for s in samples:
            v = max(-1.0, min(1.0, s))
            frames += struct.pack('<h', int(v * 32767))
        w.writeframes(bytes(frames))
    print('wav:', name, os.path.getsize(path), 'bytes')


def env(i, n, attack=0.01, release=0.3):
    a = min(1.0, i / max(1, int(n * attack)))
    r = min(1.0, (n - i) / max(1, int(n * release)))
    return max(0.0, min(a, r))


def tone(freq, dur, vol=0.4, sr=SR, glide_to=None, wave='square'):
    n = int(dur * sr)
    out = []
    for i in range(n):
        t = i / sr
        f = freq
        if glide_to is not None:
            k = min(1.0, i / n)
            f = freq + (glide_to - freq) * k
        ph = t * f
        s = 1.0 if (ph % 1.0) < 0.5 else -1.0
        if wave == 'saw':
            s = 2.0 * (ph % 1.0) - 1.0
        elif wave == 'sine':
            s = math.sin(2 * math.pi * ph)
        out.append(s * env(i, n, attack=0.02, release=0.4) * vol)
    return out


def noise(dur, vol=0.3, sr=SR, lp=0.5):
    n = int(dur * sr); out = []; last = 0.0
    for i in range(n):
        r = (math.sin(i * 12.9898) * 43758.5453) % 1.0
        r = r * 2 - 1
        last = last * lp + r * (1 - lp)
        out.append(last * env(i, n, 0.02, 0.5) * vol)
    return out


def concat(*segs):
    return [s for seg in segs for s in seg]


# Tamagotchi: bip agudo intermitente
write_wav('tamagotchi-bip', concat(
    tone(1200, 0.08, 0.35), [0]*int(0.05*SR), tone(1200, 0.08, 0.35), [0]*int(0.05*SR), tone(1400, 0.1, 0.35)))

# Tazo: estalo de ficha virando no chão
write_wav('tazo-estalo', concat(
    noise(0.05, 0.5, lp=0.1), tone(500, 0.12, 0.3, glide_to=180), [0]*int(0.03*SR)))

# Videolocadora: som de VHS (deslize de rebobinar)
def vhs():
    segs = []
    for f, d in [(300, 0.12), (220, 0.12), (160, 0.12), (120, 0.25)]:
        segs.append(noise(d, 0.25, lp=0.8))
        segs.append(tone(f, d, 0.2, glide_to=f*0.6, wave='saw'))
    return concat(*segs)
write_wav('videolocadora-vhs', vhs())

# Orelhão: discar + tom de ocupado
def orelhao():
    segs = []
    for _ in range(3):
        segs.append(tone(440, 0.12, 0.3, wave='sine'))
        segs.append([0]*int(0.12*SR))
    segs.append(tone(440, 0.3, 0.3, wave='sine'))
    segs.append(tone(480, 0.3, 0.3, wave='sine'))
    return concat(*segs)
write_wav('orelhao-discar', orelhao())

# Fliperama: insert coin (arcade)
write_wav('fliperama-arcade', concat(
    tone(1318, 0.09, 0.4), tone(1760, 0.22, 0.45)))

# Modem discada: negociação
def modem():
    segs = []
    for f, d in [(1500, 0.1), (700, 0.08), (1200, 0.06), (500, 0.05), (2000, 0.04), (900, 0.06)]:
        segs.append(tone(f, d, 0.28, glide_to=f*1.3, wave='square'))
    return concat(*segs)
write_wav('modem-discada', modem())

print('PILOTO SONS OK')