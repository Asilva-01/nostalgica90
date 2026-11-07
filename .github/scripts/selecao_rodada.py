#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NOSTÁLGICA 90 — Regra da rodada diária (fonte única Python)
Espelho bit-a-bit: selecao-rodada.js
Documentação: README.md (seção "Regra da rodada")

Dia 1 = 2026-09-06 (data civil, sem fuso).
Rodada = 3 desafios. Pool na ordem de challenges.json.

Ciclo = floor(pool / 3) dias (18 quando pool=56). Em cada ciclo
embaralha os índices com LCG 32-bit + Fisher–Yates e entrega
fatias de 3 SEM repetir enquanto houver desafios sobrando.
Os (pool % 3) que sobram entram no ciclo seguinte.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None  # type: ignore

REF_ISO = "2026-09-06"
ROUND_SIZE = 3
LCG_A = 1664525
LCG_C = 1013904223
MIX_A = 0x9E3779B9
MIX_B = 0x85EBCA77
U32 = 0xFFFFFFFF


def u32(n: int) -> int:
    return n & U32


def imul32(a: int, b: int) -> int:
    # Equivale a Math.imul + bits baixos: (a * b) módulo 2^32.
    return (int(a) * int(b)) & U32


def lcg_next(state: int) -> int:
    # JS: (Math.imul(LCG_A, state) + LCG_C) >>> 0
    return (imul32(LCG_A, state) + LCG_C) & U32


def parse_iso(iso: str) -> date:
    parts = str(iso).split("-")
    if len(parts) != 3:
        raise ValueError("data ISO inválida: " + iso)
    y, m, d = int(parts[0]), int(parts[1]), int(parts[2])
    return date(y, m, d)


def hoje_iso(agora: datetime | None = None) -> str:
    if agora is not None:
        return agora.date().isoformat()
    if ZoneInfo is not None:
        try:
            return datetime.now(ZoneInfo("America/Sao_Paulo")).date().isoformat()
        except Exception:
            pass
    return date.today().isoformat()


def numero_do_dia(iso: str) -> int:
    a = parse_iso(iso)
    r = parse_iso(REF_ISO)
    return 1 + (a - r).days


def dias_por_ciclo(pool_size: int) -> int:
    n = pool_size // ROUND_SIZE
    return n if n > 0 else 1


def seed_ciclo(ciclo: int, pool_size: int) -> int:
    a = imul32(ciclo + 1, MIX_A)
    b = imul32(pool_size, MIX_B)
    return u32(a ^ b)


def permutacao_ciclo(pool_size: int, ciclo: int) -> list[int]:
    arr = list(range(pool_size))
    if pool_size < 2:
        return arr
    state = seed_ciclo(ciclo, pool_size)
    for i in range(pool_size - 1, 0, -1):
        state = lcg_next(state)
        j = state % (i + 1)
        arr[i], arr[j] = arr[j], arr[i]
    return arr


def rodada_do_dia(iso: str, pool_size: int) -> dict:
    size = int(pool_size)
    if size < 1:
        raise ValueError("poolSize inválido")
    n = numero_do_dia(iso)
    ciclo_len = dias_por_ciclo(size)
    idx0 = n - 1
    if idx0 < 0:
        idx0 = 0
    ciclo = idx0 // ciclo_len
    pos = idx0 % ciclo_len
    perm = permutacao_ciclo(size, ciclo)
    usados = min(ciclo_len * ROUND_SIZE, size)
    inicio = pos * ROUND_SIZE
    if inicio >= usados:
        inicio = usados - ROUND_SIZE
    if inicio < 0:
        inicio = 0
    take = min(ROUND_SIZE, usados - inicio, size)
    indices = perm[inicio:inicio + take]
    ids = [i + 1 for i in indices]
    return {
        "n": n,
        "iso": iso,
        "ciclo": ciclo,
        "posicao": pos,
        "diasPorCiclo": ciclo_len,
        "indices": indices,
        "ids": ids,
        "primeiroIndice": indices[0],
        "primeiroId": ids[0],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Seleção da rodada diária Nostálgica 90")
    parser.add_argument("--datas", default="", help="Datas ISO separadas por vírgula")
    parser.add_argument("--pool", type=int, default=56, help="Tamanho do pool")
    parser.add_argument("--json", action="store_true", dest="as_json", help="Imprime JSON")
    parser.add_argument("data", nargs="?", help="Uma data ISO (atalho)")
    args = parser.parse_args(argv)

    datas = []
    if args.datas:
        datas.extend([d.strip() for d in args.datas.split(",") if d.strip()])
    if args.data:
        datas.append(args.data)
    if not datas:
        datas.append(hoje_iso())

    resultados = [rodada_do_dia(d, args.pool) for d in datas]
    print(json.dumps(resultados if len(resultados) > 1 else resultados[0], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
