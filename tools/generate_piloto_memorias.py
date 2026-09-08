#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 2I-E — PILOTO: ilustrações contextuais originais das 6 memórias.
Cada SVG representa a MEMÓRIA com contexto (não apenas um objeto isolado).
Tudo original — formas/paletas próprias, sem copiar logos, personagens ou marcas.
"""
import os

BASE = r'C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90'
MEM = os.path.join(BASE, 'assets', 'memory')
SC = os.path.join(BASE, 'assets', 'scenes')
os.makedirs(MEM, exist_ok=True)
os.makedirs(SC, exist_ok=True)


def svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg>'
            % (w, h, w, h, body))


def grad(idg, d1, d2):
    return ('<defs><linearGradient id="%s" x1="0" y1="0" x2="1" y2="1">'
            '<stop offset="0%%" stop-color="%s"/><stop offset="100%%" stop-color="%s"/>'
            '</linearGradient></defs>' % (idg, d1, d2))


def fundo(c1, c2, idg='f'):
    return grad(idg, c1, c2) + '<rect width="640" height="360" fill="url(#%s)"/>' % idg


# ---------- 1. TAMAGOTCHI (escola: carteira + caderno + estojo + aparelho) ----------
def tamagotchi():
    b = fundo('#3a1a08', '#1a0a02')
    # mesa/carteira
    b += '<rect x="0" y="240" width="640" height="120" fill="#8a6d14"/>'
    # caderno aberto
    b += '<rect x="90" y="200" width="180" height="60" rx="6" fill="#fff6e6" stroke="#241d3f" stroke-width="3"/>'
    b += '<line x1="120" y1="218" x2="250" y2="218" stroke="#5a5480" stroke-width="2"/>'
    b += '<line x1="120" y1="232" x2="250" y2="232" stroke="#5a5480" stroke-width="2"/>'
    # estojo
    b += '<rect x="330" y="224" width="120" height="28" rx="8" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/>'
    # canetas
    b += '<rect x="360" y="206" width="8" height="18" fill="#e6293c"/><rect x="376" y="206" width="8" height="18" fill="#2f6fed"/>'
    # aparelho Tamagotchi (formato de ovo) sobre a mesa
    b += '<ellipse cx="300" cy="150" rx="70" ry="95" fill="#ff7a1a" stroke="#e6e9ff" stroke-width="5"/>'
    b += '<ellipse cx="300" cy="95" rx="38" ry="44" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<ellipse cx="300" cy="95" rx="24" ry="28" fill="#2ecf5b"/>'
    b += '<ellipse cx="300" cy="92" rx="9" ry="9" fill="#0a0f2a"/>'
    b += '<circle cx="296" cy="89" r="2" fill="#fff"/><circle cx="304" cy="89" r="2" fill="#fff"/>'
    b += '<path d="M294 96 Q300 102 306 96" stroke="#0a0f2a" stroke-width="2" fill="none"/>'
    b += '<circle cx="268" cy="200" r="7" fill="#e6e9ff" stroke="#241d3f" stroke-width="2"/>'
    b += '<circle cx="300" cy="212" r="7" fill="#e6e9ff" stroke="#241d3f" stroke-width="2"/>'
    b += '<circle cx="332" cy="200" r="7" fill="#e6e9ff" stroke="#241d3f" stroke-width="2"/>'
    # som/bip visual
    b += '<path d="M250 120 Q230 100 250 80" stroke="#ffe600" stroke-width="3" fill="none"/>'
    b += '<circle cx="248" cy="74" r="5" fill="#ffe600"/>'
    return svg(640, 360, b)


# ---------- 2. TAZO (escola: salgadinho + tazos espalhados + caderno) ----------
def tazo():
    b = fundo('#333a08', '#1a1a02')
    b += '<rect x="0" y="250" width="640" height="110" fill="#8a6d14"/>'
    # pacote de salgadinho
    b += '<rect x="120" y="170" width="110" height="80" rx="10" fill="#e6293c" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<rect x="132" y="184" width="86" height="14" fill="#ffe600"/>'
    b += '<rect x="132" y="206" width="60" height="8" fill="#fff" opacity="0.7"/>'
    # tazos espalhados (disquinhos)
    for (cx, cy, r, cor) in [(320, 240, 26, '#2f6fed'), (380, 250, 26, '#7d3cff'), (300, 190, 22, '#ffe600'), (360, 190, 22, '#2ecf5b')]:
        b += '<circle cx="%d" cy="%d" r="%d" fill="%s" stroke="#e6e9ff" stroke-width="3"/>' % (cx, cy, r, cor)
        b += '<circle cx="%d" cy="%d" r="%d" fill="none" stroke="#0a0f2a" stroke-width="2" stroke-dasharray="4 3"/>' % (cx, cy, r - 5)
    # tazo principal em destaque (holográfico)
    b += '<circle cx="300" cy="120" r="46" fill="#00e5ff" stroke="#e6e9ff" stroke-width="4"/>'
    b += '<circle cx="300" cy="120" r="34" fill="none" stroke="#ffe600" stroke-width="3" stroke-dasharray="5 4"/>'
    b += '<circle cx="300" cy="120" r="6" fill="#241d3f"/>'
    return svg(640, 360, b)


# ---------- 3. VIDEOLOCADORA (prateleiras + fitas + balcão + TV + pôster) ----------
def videolocadora():
    b = fundo('#14100f', '#080606')
    # parede com prateleiras
    for py in (60, 120, 180):
        b += '<rect x="40" y="%d" width="380" height="10" fill="#3a3f5c"/>' % py
        for px in range(50, 410, 44):
            cor = ['#e6293c', '#2f6fed', '#ff7a1a', '#2ecf5b'][ (px // 44) % 4 ]
            b += '<rect x="%d" y="%d" width="36" height="52" rx="3" fill="#241d3f" stroke="#e6e9ff" stroke-width="2"/>' % (px, py - 54)
            b += '<rect x="%d" y="%d" width="28" height="20" rx="2" fill="%s"/>' % (px + 4, py - 50, cor)
    # TV de vitrine
    b += '<rect x="450" y="70" width="150" height="110" rx="8" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="4"/>'
    b += '<rect x="462" y="82" width="126" height="86" fill="#0a0f2a"/>'
    b += '<text x="480" y="130" font-family="VT323" font-size="22" fill="#ffe600">NOSTÁLGICA</text>'
    # balcão
    b += '<rect x="40" y="250" width="560" height="70" fill="#5a5480" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<rect x="60" y="270" width="180" height="30" rx="4" fill="#241d3f"/>'
    # pôster
    b += '<rect x="240" y="210" width="120" height="60" rx="3" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<rect x="252" y="220" width="96" height="18" fill="#a31358"/>'
    b += '<rect x="252" y="244" width="60" height="8" fill="#ffe600"/>'
    return svg(640, 360, b)


# ---------- 4. ORELHÃO (rua + cabine + fone + teclado + ficha) ----------
def orelhao():
    b = fundo('#0a1a3a', '#050a1a')
    # calçada / rua
    b += '<rect x="0" y="280" width="640" height="80" fill="#3a3f5c"/>'
    b += '<rect x="0" y="280" width="640" height="10" fill="#5a5480"/>'
    # poste/estrutura do orelhão
    b += '<rect x="120" y="40" width="20" height="260" fill="#2f6fed" stroke="#e6e9ff" stroke-width="2"/>'
    # cabine do orelhão
    b += '<rect x="140" y="90" width="180" height="170" rx="8" fill="#2a2e46" stroke="#e6e9ff" stroke-width="4"/>'
    b += '<rect x="156" y="110" width="148" height="120" rx="4" fill="#0a0f2a"/>'
    # fone
    b += '<path d="M170 130 L230 130 L230 170" stroke="#e6e9ff" stroke-width="4" fill="none"/>'
    b += '<circle cx="230" cy="176" r="10" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>'
    # teclado
    b += '<rect x="250" y="150" width="60" height="50" rx="3" fill="#e6293c" stroke="#e6e9ff" stroke-width="2"/>'
    for r in range(3):
        for c in range(3):
            b += '<rect x="%d" y="%d" width="12" height="8" rx="2" fill="#ffe600"/>' % (256 + c * 16, 156 + r * 14)
    # ficha caindo
    b += '<circle cx="300" cy="260" r="12" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>'
    # ambiente urbano (prédio)
    b += '<rect x="480" y="120" width="120" height="160" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="2"/>'
    for wy in range(140, 260, 40):
        for wx in range(496, 584, 30):
            b += '<rect x="%d" y="%d" width="20" height="18" fill="#ffe600" opacity="0.5"/>' % (wx, wy)
    return svg(640, 360, b)


# ---------- 5. STREET FIGHTER II / FLIPERAMA (máquina arcade + joystick + botões + fichas) ----------
def street_fighter():
    b = fundo('#0a0f2a', '#050a1a')
    # ambiente escuro de fliperama (luzes de máquinas)
    for (x, y) in [(40, 40), (560, 60), (80, 250), (520, 220)]:
        b += '<circle cx="%d" cy="%d" r="8" fill="#ff2d95" opacity="0.6"/>' % (x, y)
    # máquina arcade (corpo)
    b += '<rect x="180" y="50" width="280" height="250" rx="12" fill="#241d3f" stroke="#e6e9ff" stroke-width="5"/>'
    # marquee (topo)
    b += '<rect x="180" y="50" width="280" height="40" rx="12" fill="#e6293c" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<text x="240" y="78" font-family="Luckiest Guy" font-size="22" fill="#ffe600">STREET FIGHTER</text>'
    # tela CRT
    b += '<rect x="205" y="110" width="230" height="140" rx="4" fill="#0a0f2a" stroke="#e6e9ff" stroke-width="4"/>'
    # dois lutadores (silhuetas originais)
    b += '<circle cx="265" cy="170" r="22" fill="#ffd21e" stroke="#241d3f" stroke-width="3"/>'
    b += '<rect x="253" y="190" width="24" height="40" rx="10" fill="#ffd21e"/>'
    b += '<circle cx="375" cy="175" r="20" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>'
    b += '<rect x="364" y="193" width="22" height="38" rx="10" fill="#e6293c"/>'
    b += '<circle cx="320" cy="180" r="20" fill="#2f6fed" stroke="#e6e9ff" stroke-width="3"/>'
    # painel de controle (joystick + botões)
    b += '<rect x="180" y="255" width="280" height="45" rx="4" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<rect x="210" y="266" width="10" height="20" rx="3" fill="#e6e9ff"/>'
    b += '<circle cx="215" cy="264" r="8" fill="#e6e9ff"/>'
    for i in range(6):
        b += '<circle cx="%d" cy="274" r="8" fill="#ff2d95" stroke="#e6e9ff" stroke-width="2"/>' % (300 + i * 24)
    # fichas
    b += '<circle cx="150" cy="300" r="10" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>'
    b += '<circle cx="490" cy="300" r="10" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>'
    # moeda
    b += '<text x="140" y="120" font-family="VT323" font-size="18" fill="#ffe600">INSERT COIN</text>'
    return svg(640, 360, b)


# ---------- 6. WINDOWS 95 / INTERNET (PC CRT + teclado + mouse + modem + telefone + mesa) ----------
def windows_95():
    b = fundo('#0a2430', '#051012')
    # parede do quarto
    b += '<rect x="0" y="0" width="640" height="240" fill="#1a1440"/>'
    b += '<rect x="0" y="240" width="640" height="120" fill="#241d3f"/>'
    # mesa
    b += '<rect x="40" y="240" width="560" height="20" fill="#5a5480" stroke="#e6e9ff" stroke-width="2"/>'
    b += '<rect x="60" y="260" width="20" height="80" fill="#3a3f5c"/><rect x="560" y="260" width="20" height="80" fill="#3a3f5c"/>'
    # monitor CRT
    b += '<rect x="120" y="60" width="260" height="180" rx="10" fill="#2a2e46" stroke="#e6e9ff" stroke-width="5"/>'
    b += '<rect x="150" y="90" width="200" height="130" rx="4" fill="#0a0f2a"/>'
    # janela estilo 95 (barras)
    b += '<rect x="160" y="100" width="180" height="16" fill="#2f6fed"/>'
    b += '<rect x="160" y="116" width="180" height="90" fill="#3a3f5c"/>'
    b += '<rect x="166" y="124" width="40" height="34" fill="#123d8f"/>'
    b += '<rect x="166" y="124" width="10" height="10" fill="#e6293c"/><rect x="178" y="124" width="10" height="10" fill="#2ecf5b"/>'
    b += '<rect x="166" y="136" width="10" height="10" fill="#2f6fed"/><rect x="178" y="136" width="10" height="10" fill="#ffe600"/>'
    # teclado
    b += '<rect x="100" y="250" width="240" height="24" rx="6" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="2"/>'
    # mouse
    b += '<ellipse cx="380" cy="258" rx="16" ry="12" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="2"/>'
    # modem
    b += '<rect x="430" y="150" width="80" height="40" rx="6" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<circle cx="446" cy="166" r="4" fill="#2ecf5b"/>'
    b += '<circle cx="460" cy="166" r="4" fill="#ffe600"/>'
    # telefone fixo
    b += '<rect x="440" y="210" width="90" height="40" rx="10" fill="#e6293c" stroke="#e6e9ff" stroke-width="3"/>'
    b += '<circle cx="470" cy="228" r="8" fill="#241d3f"/>'
    # fio do modem
    b += '<path d="M430 170 Q380 170 380 250" stroke="#e6e9ff" stroke-width="3" fill="none"/>'
    # som visual de modem
    b += '<path d="M520 120 Q540 100 520 80" stroke="#00e5ff" stroke-width="3" fill="none"/>'
    b += '<circle cx="518" cy="74" r="5" fill="#00e5ff"/>'
    return svg(640, 360, b)


ARTES = {
    'tamagotchi': tamagotchi,
    'tazo': tazo,
    'videolocadora': videolocadora,
    'orelhao': orelhao,
    'street-fighter-2': street_fighter,
    'windows-95': windows_95,
}

for nome, fn in ARTES.items():
    with open(os.path.join(MEM, nome + '.svg'), 'w', encoding='utf-8') as f:
        f.write(fn())
    print('memoria:', nome, 'OK')

print('PILOTO MEMORIAS OK —', len(ARTES))