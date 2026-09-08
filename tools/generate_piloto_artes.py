#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 2I-B — PILOTO: gera 6 artes reais (SVG) para validar o sistema.
Artes 100% originais (formas/paletas/composição inspiradas na época,
sem copiar logos, personagens ou marcas).

Cada arte: 16:9, fundo com textura da categoria + elemento central
reconhecível + faixa (categoria · ano) + selo. Usa as MESMAS classes
CSS do sistema (art-fundo, art-faixa, art-moto) para encaixar na TV CRT.
"""
import os
import json

ROOT = r'C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90'
OUT = os.path.join(ROOT, 'assets', 'images', 'challenges')
os.makedirs(OUT, exist_ok=True)

# helper: SVG wrapper
def svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg>'
            % (w, h, w, h, body))

def grad_svg(d1, d2, idg='g'):
    return ('<defs><linearGradient id="%s" x1="0" y1="0" x2="1" y2="1">'
            '<stop offset="0%%" stop-color="%s"/><stop offset="100%%" stop-color="%s"/>'
            '</linearGradient></defs>' % (idg, d1, d2))

# texturas de fundo por categoria (radial + grade)
def fundo_tv():
    return ('<rect width="640" height="360" fill="url(#f)"/>'
            '<g stroke="#e6293c" stroke-opacity="0.18" stroke-width="2">'
            + ''.join('<line x1="0" y1="%d" x2="640" y2="%d"/>' % (y, y) for y in range(0, 360, 28))
            + '</g>')

def fundo_games():
    return ('<rect width="640" height="360" fill="url(#f)"/>'
            '<g fill="#7d3cff" fill-opacity="0.20">'
            + ''.join('<rect x="%d" y="%d" width="12" height="12"/>' % (x, y)
                      for x in range(0, 640, 20) for y in range(0, 360, 20) if (x // 20 + y // 20) % 2 == 0)
            + '</g>')

def fundo_cinema():
    return ('<rect width="640" height="360" fill="url(#f)"/>'
            '<rect width="640" height="360" fill="url(#f2)" opacity="0.5"/>')

def fundo_brinquedos():
    return ('<rect width="640" height="360" fill="url(#f)"/>'
            '<g fill="#ff7a1a" fill-opacity="0.16">'
            + ''.join('<circle cx="%d" cy="%d" r="5"/>' % (x, y)
                      for x in range(20, 640, 40) for y in range(20, 360, 40))
            + '</g>')

def fundo_tecnologia():
    return ('<rect width="640" height="360" fill="url(#f)"/>'
            '<g stroke="#00c8c8" stroke-opacity="0.20" stroke-width="1">'
            + ''.join('<line x1="0" y1="%d" x2="640" y2="%d"/>' % (y, y) for y in range(0, 360, 3))
            + '</g>')

def fundo_cultura():
    return ('<rect width="640" height="360" fill="url(#f)"/>'
            '<g stroke="#ffd21e" stroke-opacity="0.15" stroke-width="2">'
            + ''.join('<line x1="%d" y1="0" x2="%d" y2="360"/>' % (x, x) for x in range(0, 640, 24))
            + '</g>')

# faixa inferior (categoria · ano) reutilizando classes
def faixa(cat, ano):
    return ('<g transform="translate(200,318)">'
            '<rect width="240" height="26" rx="6" fill="#241d3f"/>'
            '<text x="14" y="18" font-family="Luckiest Guy" font-size="13" fill="#ffe600">%s</text>'
            '<text x="120" y="18" font-family="Luckiest Guy" font-size="13" fill="#ffffff">%s</text>'
            '<text x="180" y="18" font-family="Luckiest Guy" font-size="13" fill="#00e5ff">%s</text>'
            '</g>' % (cat, cat, ano))

def scan():
    return ('<g stroke="#000" stroke-opacity="0.10" stroke-width="1">'
            + ''.join('<line x1="0" y1="%d" x2="640" y2="%d"/>' % (y, y) for y in range(0, 360, 3))
            + '</g>')

# ---------- ELEMENTOS CENTRAIS (originais, estilizados) ----------

def arte_tv_colosso():
    """TV Colosso: cão apresentador (carinha) dentro de tela de TV."""
    body = (grad_svg('#2a1440', '#0a0f2a', 'f') + fundo_tv()
            + '<rect x="170" y="60" width="300" height="210" rx="14" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="4"/>'
            + '<rect x="190" y="80" width="260" height="160" rx="6" fill="#0a0f2a" stroke="#e6e9ff" stroke-width="3"/>'
            # carinha do cachorro
            + '<ellipse cx="320" cy="170" rx="58" ry="48" fill="#c9a06b" stroke="#241d3f" stroke-width="3"/>'
            + '<ellipse cx="300" cy="150" rx="10" ry="12" fill="#241d3f"/>'
            + '<ellipse cx="340" cy="150" rx="10" ry="12" fill="#241d3f"/>'
            + '<ellipse cx="300" cy="152" rx="3" ry="4" fill="#fff"/>'
            + '<ellipse cx="340" cy="152" rx="3" ry="4" fill="#fff"/>'
            + '<ellipse cx="320" cy="180" rx="16" ry="10" fill="#241d3f"/>'
            + '<path d="M310 182 Q320 192 330 182" stroke="#fff" stroke-width="3" fill="none"/>'
            + '<ellipse cx="270" cy="188" rx="14" ry="22" fill="#a34600"/>'
            + '<ellipse cx="370" cy="188" rx="14" ry="22" fill="#a34600"/>'
            + '<circle cx="300" cy="215" r="6" fill="#ff2d95"/>'
            + '<circle cx="340" cy="215" r="6" fill="#2ecf5b"/>'
            + faixa('TV', '1993') + scan())
    return svg(640, 360, body)

def arte_street_fighter():
    """Street Fighter II: dois lutadores + bola de fogo."""
    body = (grad_svg('#221144', '#0a0f2a', 'f') + fundo_games()
            # lutador 1
            + '<circle cx="210" cy="140" r="34" fill="#ffd21e" stroke="#241d3f" stroke-width="3"/>'
            + '<rect x="196" y="170" width="28" height="80" rx="12" fill="#ffd21e" stroke="#241d3f" stroke-width="3"/>'
            + '<rect x="180" y="210" width="14" height="40" rx="7" fill="#ffd21e"/>'
            + '<rect x="226" y="210" width="14" height="40" rx="7" fill="#ffd21e"/>'
            # lutador 2 (frente)
            + '<circle cx="430" cy="150" r="32" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>'
            + '<rect x="418" y="178" width="24" height="72" rx="12" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>'
            + '<rect x="404" y="214" width="13" height="38" rx="6" fill="#e6293c"/>'
            + '<rect x="445" y="214" width="13" height="38" rx="6" fill="#e6293c"/>'
            # bola de fogo (hadouken original)
            + '<circle cx="320" cy="190" r="26" fill="#2f6fed" stroke="#e6e9ff" stroke-width="4"/>'
            + '<circle cx="320" cy="190" r="12" fill="#0a0f2a"/>'
            + faixa('GAMES', '1991') + scan())
    return svg(640, 360, body)

def arte_titanic():
    """Titanic: navio de perfil + iceberg."""
    body = (grad_svg('#12204a', '#0a0f2a', 'f') + fundo_cinema()
            + '<rect x="40" y="250" width="560" height="40" fill="#123d8f"/>'  # mar
            + '<path d="M60 250 L200 190 L250 250 Z" fill="#8f93a8" stroke="#e6e9ff" stroke-width="3"/>'
            + '<rect x="200" y="170" width="320" height="80" rx="6" fill="#5a5480" stroke="#e6e9ff" stroke-width="3"/>'
            + '<rect x="360" y="120" width="120" height="52" rx="4" fill="#8f93a8" stroke="#e6e9ff" stroke-width="3"/>'
            + '<g stroke="#ffe600" stroke-width="3">'
            + '<line x1="220" y1="150" x2="340" y2="150"/>'
            + '<line x1="240" y1="130" x2="320" y2="130"/>'
            + '</g>'
            + '<polygon points="520,230 560,170 585,210" fill="#cfe8ff" opacity="0.85"/>'
            + '<polygon points="540,190 560,140 575,180" fill="#e6f4ff" opacity="0.8"/>'
            + faixa('CINEMA', '1997') + scan())
    return svg(640, 360, body)

def arte_tamagotchi():
    """Tamagotchi: ovo digital com tela."""
    body = (grad_svg('#331a08', '#0a0f2a', 'f') + fundo_brinquedos()
            + '<ellipse cx="320" cy="180" rx="90" ry="120" fill="#ff7a1a" stroke="#e6e9ff" stroke-width="4"/>'
            + '<ellipse cx="320" cy="130" rx="46" ry="52" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>'
            + '<ellipse cx="320" cy="130" rx="30" ry="34" fill="#2ecf5b"/>'
            # bichinho na tela (carinha)
            + '<ellipse cx="320" cy="128" rx="12" ry="12" fill="#0a0f2a"/>'
            + '<circle cx="316" cy="124" r="3" fill="#fff"/>'
            + '<circle cx="324" cy="124" r="3" fill="#fff"/>'
            + '<path d="M314 134 Q320 140 326 134" stroke="#0a0f2a" stroke-width="2" fill="none"/>'
            # botões
            + '<circle cx="280" cy="240" r="9" fill="#e6e9ff" stroke="#241d3f" stroke-width="2"/>'
            + '<circle cx="320" cy="250" r="9" fill="#e6e9ff" stroke="#241d3f" stroke-width="2"/>'
            + '<circle cx="360" cy="240" r="9" fill="#e6e9ff" stroke="#241d3f" stroke-width="2"/>'
            + faixa('BRINQUEDOS', '1996') + scan())
    return svg(640, 360, body)

def arte_discman():
    """Discman: disco + corpo + fone."""
    body = (grad_svg('#0a2430', '#0a0f2a', 'f') + fundo_tecnologia()
            + '<rect x="180" y="120" width="280" height="120" rx="16" fill="#4a5480" stroke="#e6e9ff" stroke-width="4"/>'
            + '<circle cx="280" cy="180" r="44" fill="#dfe6ff" stroke="#e6e9ff" stroke-width="3"/>'
            + '<circle cx="280" cy="180" r="16" fill="#4a5480"/>'
            + '<circle cx="280" cy="180" r="5" fill="#0a0f2a"/>'
            # botões
            + '<rect x="350" y="150" width="18" height="26" rx="4" fill="#2a2e46" stroke="#e6e9ff" stroke-width="2"/>'
            + '<rect x="376" y="150" width="18" height="26" rx="4" fill="#2a2e46" stroke="#e6e9ff" stroke-width="2"/>'
            + '<rect x="402" y="150" width="34" height="14" rx="4" fill="#e6293c"/>'
            + '<rect x="402" y="170" width="34" height="14" rx="4" fill="#e6293c"/>'
            # fone
            + '<path d="M330 150 Q360 90 400 130" stroke="#e6e9ff" stroke-width="4" fill="none"/>'
            + '<circle cx="406" cy="132" r="10" fill="#241d3f"/>'
            + faixa('TECNOLOGIA', '1984') + scan())
    return svg(640, 360, body)

def arte_fita_vhs():
    """Fita VHS: caixinha + etiqueta + carretéis."""
    body = (grad_svg('#332a08', '#0a0f2a', 'f') + fundo_cultura()
            + '<rect x="180" y="80" width="280" height="200" rx="10" fill="#241d3f" stroke="#e6e9ff" stroke-width="4"/>'
            + '<rect x="200" y="100" width="240" height="120" rx="6" fill="#ffe9c2" stroke="#241d3f" stroke-width="3"/>'
            + '<text x="212" y="130" font-family="Luckiest Guy" font-size="18" fill="#e6293c">NOSTÁLGICA</text>'
            + '<text x="212" y="160" font-family="Luckiest Guy" font-size="14" fill="#241d3f">DESAFIO DO DIA</text>'
            + '<text x="212" y="186" font-family="VT323" font-size="16" fill="#5a5480">VHS · LOCADORA · 90s</text>'
            + '<circle cx="260" cy="240" r="22" fill="#0a0f2a" stroke="#e6e9ff" stroke-width="3"/>'
            + '<circle cx="380" cy="240" r="22" fill="#0a0f2a" stroke="#e6e9ff" stroke-width="3"/>'
            + '<circle cx="260" cy="240" r="8" fill="#3a3f5c"/>'
            + '<circle cx="380" cy="240" r="8" fill="#3a3f5c"/>'
            + faixa('CULTURA', '1970') + scan())
    return svg(640, 360, body)

ARTES = {
    2: arte_tv_colosso,
    35: arte_street_fighter,
    28: arte_titanic,
    1: arte_tamagotchi,
    7: arte_discman,
    6: arte_fita_vhs,
}

for cid, fn in ARTES.items():
    nome = 'piloto-%03d.svg' % cid
    with open(os.path.join(OUT, nome), 'w', encoding='utf-8') as f:
        f.write(fn())
    print('gerado:', nome)

print('PILOTO 2I-B OK —', len(ARTES), 'artes')