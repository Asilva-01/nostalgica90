#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot diário do desafio Nostálgica → Telegram.

Três postagens por dia, cada uma destacando UM desafio da rodada de 3:
  1º às 09:00 America/Sao_Paulo  (cron 0 12 * * * UTC)
  2º às 14:00 America/Sao_Paulo  (cron 0 17 * * * UTC)
  3º às 18:00 America/Sao_Paulo  (cron 0 21 * * * UTC)

O cron do GitHub Actions pode atrasar; o slot NÃO é inferido pela
hora do relógio — vem do cron que disparou (github.event.schedule)
ou do input de workflow_dispatch (1 / 2 / 3 / todas).

FONTE ÚNICA DE DESAFIOS: challenges.json
FONTE ÚNICA DA REGRA: selecao_rodada.py (espelho de selecao-rodada.js)

Não posta gabarito, alias, categoria isolada nem dica que entregue o nome.
Convida a jogar a rodada completa no site.

Segredos do repositório (não alterar nomes, não imprimir):
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_URL
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, '..', '..'))
CHALLENGES_PATH = os.path.join(REPO, 'challenges.json')
sys.path.insert(0, AQUI)

from selecao_rodada import hoje_iso, rodada_do_dia, carregar_flags_arte  # noqa: E402

# github.event.schedule devolve o cron que disparou este job.
CRON_PARA_SLOT = {
    "0 12 * * *": 0,  # 09:00 America/Sao_Paulo
    "0 17 * * *": 1,  # 14:00 America/Sao_Paulo
    "0 21 * * *": 2,  # 18:00 America/Sao_Paulo
}

def carregar_desafios():
    with open(CHALLENGES_PATH, encoding='utf-8') as f:
        return json.load(f)


def postar_telegram(texto, dry_run=False):
    if dry_run:
        print("DRY_RUN — mensagem que seria enviada:\n" + texto)
        return True
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


def montar_texto(n, pista, site, slot):
    """slot é 0, 1 ou 2 — cada postagem destaca um desafio diferente."""
    site = site or ""
    pista = pista or "Abra o site e veja a primeira pista."
    if slot == 0:
        return (
            "🕹️ NOSTÁLGICA 90 — a rodada de hoje chegou!\n"
            "📺 Rodada #{n} · memória 1 de 3\n\n"
            "🔎 Pista 1: {pista}\n\n"
            "🎯 Jogue os 3 no site, some os pontos e mantenha a sequência.\n"
            "📼 As outras duas memórias só aparecem no jogo — sem spoiler aqui.\n\n"
            "👉 JOGAR A RODADA COMPLETA:\n{site}"
        ).format(n=n, pista=pista, site=site)
    if slot == 1:
        return (
            "🕹️ NOSTÁLGICA 90 — memória 2 da rodada de hoje\n"
            "📺 Rodada #{n} · memória 2 de 3\n\n"
            "🔎 Pista 1: {pista}\n\n"
            "🎯 Ainda dá tempo de jogar a rodada completa no site.\n"
            "📼 Sem gabarito aqui — a resposta só no jogo.\n\n"
            "👉 JOGAR A RODADA COMPLETA:\n{site}"
        ).format(n=n, pista=pista, site=site)
    return (
        "🕹️ NOSTÁLGICA 90 — última memória da rodada de hoje\n"
        "📺 Rodada #{n} · memória 3 de 3\n\n"
        "🔎 Pista 1: {pista}\n\n"
        "🎯 Fecha o dia com os 3 desafios no site e mantenha a sequência.\n"
        "📼 Sem gabarito aqui — a resposta só no jogo.\n\n"
        "👉 JOGAR A RODADA COMPLETA:\n{site}"
    ).format(n=n, pista=pista, site=site)


def resolver_slots(raw):
    """Aceita 1/2/3/todas ou o cron string do GitHub Actions."""
    valor = (raw or "").strip().lower()
    if valor in ("todas", "all", "3slots"):
        return [0, 1, 2]
    if valor in ("1", "2", "3"):
        return [int(valor) - 1]
    if valor in CRON_PARA_SLOT:
        return [CRON_PARA_SLOT[valor]]
    return None


def main(argv=None):
    parser = argparse.ArgumentParser(description="Bot diário Nostálgica 90 → Telegram")
    parser.add_argument("--slot", default="", help="1, 2, 3 ou todas")
    parser.add_argument("--dry-run", action="store_true", help="Imprime a mensagem, não posta")
    args = parser.parse_args(argv)

    dry = args.dry_run or os.environ.get("TELEGRAM_DRY_RUN") == "1"
    bruto = args.slot or os.environ.get("POST_SLOT") or ""
    slots = resolver_slots(bruto)
    if slots is None:
        print("ERRO: informe --slot 1|2|3|todas ou POST_SLOT (cron/dispatch).")
        return 1

    pool = carregar_desafios()
    iso = hoje_iso()
    flags = carregar_flags_arte(len(pool))
    rodada = rodada_do_dia(iso, len(pool), flags)
    indices = rodada.get("indices") or []
    site = os.environ.get("SITE_URL", "")

    ok_todos = True
    for i, slot in enumerate(slots):
        if slot < 0 or slot >= len(indices):
            print("ERRO: slot {s} fora da rodada (indices={ids}).".format(s=slot, ids=indices))
            ok_todos = False
            continue
        desafio = pool[indices[slot]]
        pistas = desafio.get("pistas") or [""]
        texto = montar_texto(rodada["n"], pistas[0], site, slot)
        print("Rodada n={n} iso={iso} slot={slot} id={id} (sem gabarito)".format(
            n=rodada["n"], iso=iso, slot=slot + 1, id=desafio.get("id")
        ))
        if not postar_telegram(texto, dry_run=dry):
            ok_todos = False
        if i < len(slots) - 1 and not dry:
            time.sleep(2)
    return 0 if ok_todos else 1


if __name__ == "__main__":
    sys.exit(main())
