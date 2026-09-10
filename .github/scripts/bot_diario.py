#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot diário do desafio Nostálgica → Telegram.
Publica automaticamente o desafio do dia num canal do Telegram
usando GitHub Actions (grátis). FONTE ÚNICA: challenges.json
(o mesmo arquivo usado pelo jogo) — sem POOL duplicado.

Como usar:
1. Crie um bot no Telegram com @BotFather e pegue o TOKEN.
2. Crie um canal e adicione o bot como admin (permissão de postar).
3. Configure os segredos do repositório no GitHub:
   - TELEGRAM_BOT_TOKEN : token do bot
   - TELEGRAM_CHAT_ID   : id do canal (ex: @meucanal)
   - SITE_URL           : url pública do jogo (ex: https://asilva-01.github.io/nostalgica90/)
"""
import os
import sys
import json
import datetime
import urllib.request

# FONTE ÚNICA DE DESAFIOS — mesma do jogo (challenges.json)
AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, '..', '..'))
CHALLENGES_PATH = os.path.join(REPO, 'challenges.json')


def carregar_desafios():
    with open(CHALLENGES_PATH, encoding='utf-8') as f:
        return json.load(f)


POOL = carregar_desafios()

CAT_EMOJI = {"TV": "📺", "GAMES": "🎮", "CINEMA": "🎬", "MÚSICA": "🎵",
             "BRINQUEDOS": "🧸", "TECNOLOGIA": "💻", "CULTURA": "📼"}

# Desafio nº1 = dia 2026-09-06 (mesma referência do jogo)
REF_MS = datetime.datetime(2026, 9, 6, 12, 0, 0).timestamp()
REF_NO = 1


def numero_do_desafio(data):
    delta = int((data.timestamp() - REF_MS) / 86400)
    return max(REF_NO, REF_NO + delta)


def desafio_para(data):
    n = numero_do_desafio(data)
    return n, POOL[(n - 1) % len(POOL)]


def postar_telegram(texto):
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print("ERRO: TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados.")
        return False
    url = "https://api.telegram.org/bot{}/sendMessage".format(token)
    payload = json.dumps({
        "chat_id": chat_id,
        "text": texto,
        "disable_web_page_preview": False,
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read().decode("utf-8"))
            if data.get("ok"):
                print("Telegram OK: mensagem enviada.")
                return True
            else:
                print("Telegram ERRO:", data)
                return False
    except Exception as e:
        print("Telegram exceção:", e)
        return False


def main():
    hoje = datetime.datetime.now()
    n, e = desafio_para(hoje)
    site = os.environ.get("SITE_URL", "")
    primeira = e["pistas"][0]
    texto = (
        "🕹️ NOSTÁLGICA 90 — o desafio diário dos anos 90 chegou!\n\n"
        "📺 Você lembra desse clássico?\n\n"
        "🔎 Pista 1: {}\n\n"
        "🎯 Tente acertar com o menor número de pistas (de 6) e marque pontos!\n"
        "🔥 Volte todos os dias para não quebrar sua sequência.\n\n"
        "👉 JOGAR AGORA:\n{}"
    ).format(primeira, site)
    ok = postar_telegram(texto)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()