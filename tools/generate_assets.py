#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera assets do Nostálgica 90: SFX WAV, ícones PWA e OG image.
100% original, sem copyright. Rode: python tools/generate_assets.py
"""
import math
import os
import struct
import wave

ROOT = os.path.join(os.path.dirname(__file__), '..')
AUDIO = os.path.join(ROOT, 'assets', 'audio')
ICONS = os.path.join(ROOT, 'assets', 'icons')
os.makedirs(AUDIO, exist_ok=True)
os.makedirs(ICONS, exist_ok=True)

SR = 22050


def write_wav(name, samples, sr=SR):
    path = os.path.join(AUDIO, name + '.wav')
    with wave.open(path, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        frames = bytearray()
        for s in samples:
            v = max(-1.0, min(1.0, s))
            frames += struct.pack('<h', int(v * 32767))
        w.writeframes(bytes(frames))
    print('wav:', name, os.path.getsize(path), 'bytes')


def env(i, n, attack=0.02, release=0.25):
    """Envelope simples attack/release."""
    t = i / n
    a = min(1.0, i / max(1, int(n * attack)))
    r = min(1.0, (n - i) / max(1, int(n * release)))
    return max(0.0, min(a, r))


def tone(freq, dur, wave='square', vol=0.5, sr=SR, glide_to=None, slide_speed=0.0):
    n = int(dur * sr)
    out = []
    f = freq
    for i in range(n):
        t = i / sr
        if glide_to is not None:
            k = min(1.0, i / max(1, int(slide_speed * sr)))
            f = freq + (glide_to - freq) * k
        phase = t * f
        if wave == 'square':
            s = 1.0 if (phase % 1.0) < 0.5 else -1.0
        elif wave == 'saw':
            s = 2.0 * (phase % 1.0) - 1.0
        elif wave == 'sine':
            s = math.sin(2 * math.pi * phase)
        else:
            s = 1.0 if (phase % 1.0) < 0.5 else -1.0
        out.append(s * env(i, n) * vol)
    return out


def noise(dur, vol=0.4, sr=SR, lowpass_amt=0.0, seed=42):
    n = int(dur * sr)
    out = []
    last = 0.0
    for i in range(n):
        r = (math.sin(seed + i * 12.9898) * 43758.5453) % 1.0
        r = r * 2 - 1
        last = last * lowpass_amt + r * (1 - lowpass_amt)
        out.append(last * env(i, n) * vol)
    return out


def mix(*tracks):
    n = max(len(t) for t in tracks)
    out = [0.0] * n
    for t in tracks:
        for i, s in enumerate(t):
            out[i] += s
    return out


def concat(*segs):
    return [s for seg in segs for s in seg]


# ---------------- SFX ----------------
# click: breve blip quadrado
write_wav('ui-click', tone(900, 0.06, 'square', 0.35))
# success: arpeggio ascendente C-E-G-C
write_wav('ui-success', concat(
    tone(523, 0.12, 'square', 0.4),
    tone(659, 0.12, 'square', 0.4),
    tone(784, 0.12, 'square', 0.4),
    tone(1046, 0.25, 'square', 0.45),
))
# error: duas notas graves descendentes
write_wav('ui-error', concat(
    tone(220, 0.18, 'square', 0.4, glide_to=196),
    tone(196, 0.30, 'square', 0.4, glide_to=165),
))
# reveal: "troca de canal" - barulho de estática curto + blip
write_wav('ui-reveal', mix(
    noise(0.18, 0.18, lowpass_amt=0.5),
    tone(700, 0.16, 'saw', 0.3, glide_to=1100),
))
# modem: dialup clássico (séries de tons) - homenagem, som sintetizado original
def modem_sfx():
    segs = []
    # toque do discador
    segs.append(tone(440, 0.15, 'sine', 0.3))
    segs.append(tone(350, 0.15, 'sine', 0.3))
    segs.append(tone(440, 0.15, 'sine', 0.3))
    segs.append(tone(350, 0.15, 'sine', 0.3))
    # negociação da conexão
    seq = [(1500, 0.09), (700, 0.07), (1200, 0.05), (500, 0.04), (2000, 0.03), (900, 0.06)]
    for f, d in seq:
        segs.append(tone(f, d, 'square', 0.25, glide_to=f * 1.3, slide_speed=0.3))
    return concat(*segs)
write_wav('ui-modem', modem_sfx())
# vhs: som de fita sendo rebobinada (ruído filtrado crescente)
def vhs_sfx():
    segs = []
    for f, d in [(400, 0.12), (300, 0.12), (200, 0.12), (150, 0.20)]:
        segs.append(noise(d, 0.3, lowpass_amt=0.75))
        segs.append(tone(f, d, 'saw', 0.15))
    return mix(concat(*segs))
write_wav('ui-vhs', vhs_sfx())
# arcade: coin insert - duas notas "blim blom"
write_wav('ui-arcade', concat(
    tone(1318, 0.09, 'square', 0.4),
    tone(1760, 0.25, 'square', 0.45),
))
# boot: som de computador ligando (beep + barulho)
write_wav('ui-boot', mix(
    tone(220, 0.5, 'sine', 0.3, glide_to=110),
    noise(0.5, 0.1, lowpass_amt=0.4),
))
# channel: estática + clique
write_wav('ui-channel', mix(
    noise(0.15, 0.2, lowpass_amt=0.35),
    tone(300, 0.12, 'square', 0.2),
))

# ---------------- OG Image + Icons (Pillow) ----------------
from PIL import Image, ImageDraw, ImageFont

def font_path(size):
    for name in ['arial.ttf', 'segoeui.ttf', 'DejaVuSans.ttf']:
        for base in [r'C:\Windows\Fonts', '/usr/share/fonts/truetype/dejavu']:
            p = os.path.join(base, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
    return ImageFont.load_default()


def draw_retro_background(draw, w, h):
    # grade neon
    step = 40
    for x in range(0, w, step):
        draw.line([(x, 0), (x, h)], fill=(40, 20, 90), width=1)
    for y in range(0, h, step):
        draw.line([(0, y), (w, y)], fill=(40, 20, 90), width=1)
    # círculos neon (like vinyl)
    cx, cy, r = w - 140, h - 140, 90
    for i in range(3):
        draw.ellipse([cx - r - i * 14, cy - r - i * 14, cx + r + i * 14, cy + r + i * 14],
                     outline=(0, 229, 255), width=3)
    draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(255, 45, 149))


def make_og_image():
    w, h = 1200, 630
    img = Image.new('RGB', (w, h), (18, 0, 43))
    draw = ImageDraw.Draw(img)
    draw_retro_background(draw, w, h)
    # scanlines
    for y in range(0, h, 4):
        draw.line([(0, y), (w, y)], fill=(0, 0, 0, 40), width=1)
    big = font_path(90)
    med = font_path(40)
    # Emoji/logo "NOSTÁLGICA" com duas cores (sombra estilo 90s)
    draw.text((60, 70), "NOSTÁLGICA", font=big, fill=(255, 230, 0),
              stroke_width=6, stroke_fill=(255, 45, 149))
    draw.text((60, 220), "O DESAFIO DIÁRIO DOS ANOS 90", font=med, fill=(0, 229, 255))
    draw.text((60, 300), '"Você lembra disso?"  🕹️  📺  🎮', font=font_path(34), fill=(255, 255, 255))
    draw.text((60, 380), "1 desafio por dia • streak • 100% nostalgia", font=font_path(28), fill=(57, 255, 20))
    draw.text((60, 520), "nostalgica.90", font=font_path(30), fill=(176, 38, 255))
    img.save(os.path.join(ROOT, 'assets', 'og-image.png'))
    print('og-image.png', os.path.getsize(os.path.join(ROOT, 'assets', 'og-image.png')), 'bytes')


def make_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # fundo gradiente retrô (roxo -> magenta)
    for y in range(size):
        t = y / size
        r = int(24 + (120 - 24) * t)
        g = int(0 + (20 - 0) * t)
        b = int(60 + (120 - 60) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    # moldura
    draw.rectangle([2, 2, size - 2, size - 2], outline=(255, 230, 0), width=max(2, size // 32))
    # "TV" - tela com estática
    pad = size // 5
    draw.rectangle([pad, pad, size - pad, int(size * 0.62)], fill=(0, 0, 0), outline=(0, 229, 255), width=max(2, size // 40))
    for i in range(pad, int(size * 0.62), max(2, size // 40)):
        draw.line([(pad, i), (size - pad, i)], fill=(30, 30, 30))
    # botões do controle
    r = max(3, size // 22)
    bx = size // 2
    by = int(size * 0.78)
    draw.ellipse([bx - r * 3, by, bx - r, by + r * 2], fill=(255, 45, 149))
    draw.ellipse([bx + r, by, bx + r * 3, by + r * 2], fill=(0, 229, 255))
    # letra N pixel
    if size >= 128:
        f = font_path(size // 2)
        draw.text((pad + 4, int(size * 0.16)), "N", font=f, fill=(255, 230, 0))
    img.save(os.path.join(ICONS, 'icon-{}.png'.format(size)))
    print('icon-{}.png'.format(size), os.path.getsize(os.path.join(ICONS, 'icon-{}.png'.format(size))), 'bytes')


make_og_image()
for s in (192, 512):
    make_icon(s)

print('ASSETS OK')