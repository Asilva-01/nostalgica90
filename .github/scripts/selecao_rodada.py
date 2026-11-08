#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NOSTÁLGICA 90 — Regra da rodada diária (fonte única Python)
Espelho bit-a-bit: selecao-rodada.js
Documentação: README.md (seção "Regra da rodada")

Dia 1 = 2026-09-06 (data civil, sem fuso).
Rodada = 3 desafios. Pool na ordem de challenges.json.

Ciclo = floor(pool / 3) dias (52 quando pool=156; 18 quando pool=56). Em cada ciclo
embaralha os índices com LCG 32-bit + Fisher–Yates e entrega
fatias de 3 SEM repetir enquanto houver desafios sobrando.
Os (pool % 3) que sobram vão para o INÍCIO da permutação do
ciclo seguinte (garantidos entre os usados do ciclo novo).
Dentro dos 3 do dia, se algum tiver arte própria, ele vai
para a 1ª posição (rotação, determinística).
"""
from __future__ import annotations

import argparse
import json
import os
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

_AQUI = os.path.dirname(os.path.abspath(__file__))
_REPO = os.path.abspath(os.path.join(_AQUI, "..", ".."))
ARTE_PROPRIA_PATH = os.path.join(_REPO, "arte-propria.json")
CHALLENGES_PATH = os.path.join(_REPO, "challenges.json")


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


def fisher_yates(arr: list[int], seed: int) -> list[int]:
    if len(arr) < 2:
        return arr
    state = seed
    for i in range(len(arr) - 1, 0, -1):
        state = lcg_next(state)
        j = state % (i + 1)
        arr[i], arr[j] = arr[j], arr[i]
    return arr


def permutacao_ciclo(pool_size: int, ciclo: int) -> list[int]:
    arr = list(range(pool_size))
    return fisher_yates(arr, seed_ciclo(ciclo, pool_size))


def permutacao_com_carry(pool_size: int, ciclo: int) -> list[int]:
    resto = pool_size % ROUND_SIZE
    if resto == 0:
        return permutacao_ciclo(pool_size, ciclo)
    usados = dias_por_ciclo(pool_size) * ROUND_SIZE
    arr = permutacao_ciclo(pool_size, 0)
    for c in range(1, ciclo + 1):
        leftover = arr[usados:]
        leftover_set = set(leftover)
        rest = [i for i in range(pool_size) if i not in leftover_set]
        fisher_yates(rest, seed_ciclo(c, pool_size))
        arr = leftover + rest
    return arr


def priorizar_arte(indices: list[int], tem_arte: list[bool] | None) -> list[int]:
    if not tem_arte or not indices:
        return list(indices)
    first = -1
    for i, idx in enumerate(indices):
        if 0 <= idx < len(tem_arte) and tem_arte[idx]:
            first = i
            break
    if first <= 0:
        return list(indices)
    return list(indices[first:] + indices[:first])


def flags_de_slugs(lista: list[dict], slugs: list[str] | set[str]) -> list[bool]:
    sset = set(slugs or [])
    return [bool(item.get("slug") in sset) for item in (lista or [])]


def carregar_flags_arte(pool_size: int) -> list[bool] | None:
    if not os.path.isfile(ARTE_PROPRIA_PATH) or not os.path.isfile(CHALLENGES_PATH):
        return None
    with open(ARTE_PROPRIA_PATH, encoding="utf-8") as f:
        slugs = json.load(f)
    with open(CHALLENGES_PATH, encoding="utf-8") as f:
        pool = json.load(f)
    if len(pool) != int(pool_size):
        return None
    return flags_de_slugs(pool, slugs)


def rodada_do_dia(iso: str, pool_size: int, tem_arte: list[bool] | None = None) -> dict:
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
    perm = permutacao_com_carry(size, ciclo)
    usados = min(ciclo_len * ROUND_SIZE, size)
    inicio = pos * ROUND_SIZE
    if inicio >= usados:
        inicio = usados - ROUND_SIZE
    if inicio < 0:
        inicio = 0
    take = min(ROUND_SIZE, usados - inicio, size)
    indices = priorizar_arte(perm[inicio:inicio + take], tem_arte)
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
    parser.add_argument("--pool", type=int, default=None, help="Tamanho do pool (default: len(challenges.json))")
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

    pool = args.pool
    if pool is None:
        with open(CHALLENGES_PATH, encoding="utf-8") as f:
            pool = len(json.load(f))
    flags = carregar_flags_arte(pool)
    resultados = [rodada_do_dia(d, pool, flags) for d in datas]
    print(json.dumps(resultados if len(resultados) > 1 else resultados[0], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
