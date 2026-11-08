#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot diário do desafio Nostálgica → Telegram.
Publica automaticamente o PRIMEIRO desafio da rodada de 3
num canal do Telegram usando GitHub Actions (grátis).

FONTE ÚNICA DE DESAFIOS: challenges.json
FONTE ÚNICA DA REGRA: selecao_rodada.py (espelho de selecao-rodada.js)

Não posta gabarito. Convida a jogar a rodada completa no site.

Segredos do repositório (não alterar nomes):
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_URL
"""
import os
import sys
import json
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, '..', '..'))
CHALLENGES_PATH = os.path.join(REPO, 'challenges.json')
sys.path.insert(0, AQUI)

from selecao_rodada import hoje_iso, rodada_do_dia, carregar_flags_arte  # noqa: E402


def carregar_desafios():
    with open(CHALLENGES_PATH, encoding='utf-8') as f:
        return json.load(f)


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
            print("Telegram ERRO:", data)
            return False
    except Exception as e:
        print("Telegram exceção:", e)
        return False


def montar_texto(n, pista, site):
    return (
        "🕹️ NOSTÁLGICA 90 — a rodada de hoje chegou!\n"
        "📺 Rodada #{n} · 3 memórias dos anos 90\n\n"
        "Começa por esta (é a primeira da rodada):\n"
        "🔎 Pista 1: {pista}\n\n"
        "🎯 Jogue os 3 no site, some os pontos e mantenha a sequência.\n"
        "📼 As outras duas memórias só aparecem no jogo — sem spoiler aqui.\n\n"
        "👉 JOGAR A RODADA COMPLETA:\n{site}"
    ).format(n=n, pista=pista, site=site)


def main():
    pool = carregar_desafios()
    iso = hoje_iso()
    flags = carregar_flags_arte(len(pool))
    rodada = rodada_do_dia(iso, len(pool), flags)
    idx = rodada["primeiroIndice"]
    primeiro = pool[idx]
    site = os.environ.get("SITE_URL", "")
    pistas = primeiro.get("pistas") or [""]
    texto = montar_texto(rodada["n"], pistas[0], site)
    print("Rodada n={n} iso={iso} ids={ids} primeiro={slug}".format(
        n=rodada["n"], iso=iso, ids=rodada["ids"], slug=primeiro.get("slug")
    ))
    ok = postar_telegram(texto)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
