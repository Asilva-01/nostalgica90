/* ============================================================
   NOSTÁLGICA 90 — Regra da rodada diária (fonte única JS)
   Espelho bit-a-bit: .github/scripts/selecao_rodada.py
   Documentação: README.md (seção "Regra da rodada")

   Dia 1 = 2026-09-06 (data civil, sem fuso).
   Rodada = 3 desafios. Pool na ordem de challenges.json.

   Ciclo = floor(pool / 3) dias (18 quando pool=56). Em cada ciclo
   embaralha os índices com LCG 32-bit + Fisher–Yates e entrega
   fatias de 3 SEM repetir enquanto houver desafios sobrando.
   Os (pool % 3) que sobram vão para o INÍCIO da permutação do
   ciclo seguinte (garantidos entre os 54 usados).
   Dentro dos 3 do dia, se algum tiver arte própria, ele vai
   para a 1ª posição (rotação, determinística).
   ============================================================ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SelecaoRodada = api;
  if (typeof window !== 'undefined') window.SelecaoRodada = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var REF_ISO = '2026-09-06';
  var ROUND_SIZE = 3;
  var LCG_A = 1664525;
  var LCG_C = 1013904223;
  var MIX_A = 0x9E3779B9;
  var MIX_B = 0x85EBCA77;

  function u32(n) { return n >>> 0; }
  function imul32(a, b) { return Math.imul(a, b); }
  function lcgNext(state) { return u32(imul32(LCG_A, state) + LCG_C); }

  function parseIso(iso) {
    var p = String(iso).split('-');
    var y = +p[0], m = +p[1], d = +p[2];
    if (!y || !m || !d) throw new Error('data ISO inválida: ' + iso);
    return { y: y, m: m, d: d };
  }

  function hojeIso(dateObj) {
    var d = dateObj || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function numeroDoDia(iso) {
    var a = parseIso(iso);
    var r = parseIso(REF_ISO);
    var msA = Date.UTC(a.y, a.m - 1, a.d);
    var msR = Date.UTC(r.y, r.m - 1, r.d);
    return 1 + Math.round((msA - msR) / 86400000);
  }

  function diasPorCiclo(poolSize) {
    var n = Math.floor(poolSize / ROUND_SIZE);
    return n > 0 ? n : 1;
  }

  function seedCiclo(ciclo, poolSize) {
    var a = imul32(ciclo + 1, MIX_A);
    var b = imul32(poolSize, MIX_B);
    return u32(a ^ b);
  }

  function fisherYates(arr, seed) {
    var i, j, tmp, state;
    if (arr.length < 2) return arr;
    state = seed;
    for (i = arr.length - 1; i > 0; i--) {
      state = lcgNext(state);
      j = state % (i + 1);
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function permutacaoCiclo(poolSize, ciclo) {
    var arr = [];
    var i;
    for (i = 0; i < poolSize; i++) arr.push(i);
    return fisherYates(arr, seedCiclo(ciclo, poolSize));
  }

  /* Ciclo 0: shuffle completo. Ciclo N>0: os (pool%3) não usados
     do ciclo anterior entram no começo; o resto é reembaralhado. */
  function permutacaoComCarry(poolSize, ciclo) {
    var resto = poolSize % ROUND_SIZE;
    if (resto === 0) return permutacaoCiclo(poolSize, ciclo);
    var usados = diasPorCiclo(poolSize) * ROUND_SIZE;
    var arr = permutacaoCiclo(poolSize, 0);
    var c, leftover, set, rest, i;
    for (c = 1; c <= ciclo; c++) {
      leftover = arr.slice(usados);
      set = Object.create(null);
      for (i = 0; i < leftover.length; i++) set[leftover[i]] = 1;
      rest = [];
      for (i = 0; i < poolSize; i++) if (!set[i]) rest.push(i);
      fisherYates(rest, seedCiclo(c, poolSize));
      arr = leftover.concat(rest);
    }
    return arr;
  }

  /* Rotação: o primeiro índice com arte própria vai para a posição 0.
     Ordem relativa dos demais se mantém. Sem arte no trio: inalterado. */
  function priorizarArte(indices, temArte) {
    if (!temArte || !temArte.length || !indices || !indices.length) {
      return indices ? indices.slice() : [];
    }
    var i, first = -1;
    for (i = 0; i < indices.length; i++) {
      if (temArte[indices[i]]) { first = i; break; }
    }
    if (first <= 0) return indices.slice();
    return indices.slice(first).concat(indices.slice(0, first));
  }

  function flagsDeSlugs(lista, slugs) {
    var set = Object.create(null);
    var i;
    if (slugs) {
      for (i = 0; i < slugs.length; i++) set[slugs[i]] = 1;
    }
    return (lista || []).map(function (c) {
      return !!(c && c.slug && set[c.slug]);
    });
  }

  function rodadaDoDia(iso, poolSize, temArte) {
    var size = poolSize | 0;
    if (size < 1) throw new Error('poolSize inválido');
    var n = numeroDoDia(iso);
    var cicloLen = diasPorCiclo(size);
    var idx0 = n - 1;
    if (idx0 < 0) idx0 = 0;
    var ciclo = Math.floor(idx0 / cicloLen);
    var pos = idx0 % cicloLen;
    var perm = permutacaoComCarry(size, ciclo);
    var usados = Math.min(cicloLen * ROUND_SIZE, size);
    var inicio = pos * ROUND_SIZE;
    if (inicio >= usados) inicio = usados - ROUND_SIZE;
    if (inicio < 0) inicio = 0;
    var take = Math.min(ROUND_SIZE, usados - inicio, size);
    var indices = priorizarArte(perm.slice(inicio, inicio + take), temArte);
    var ids = indices.map(function (i) { return i + 1; });
    return {
      n: n,
      iso: iso,
      ciclo: ciclo,
      posicao: pos,
      diasPorCiclo: cicloLen,
      indices: indices,
      ids: ids,
      primeiroIndice: indices[0],
      primeiroId: ids[0]
    };
  }

  return {
    REF_ISO: REF_ISO,
    ROUND_SIZE: ROUND_SIZE,
    hojeIso: hojeIso,
    numeroDoDia: numeroDoDia,
    diasPorCiclo: diasPorCiclo,
    seedCiclo: seedCiclo,
    permutacaoCiclo: permutacaoCiclo,
    permutacaoComCarry: permutacaoComCarry,
    priorizarArte: priorizarArte,
    flagsDeSlugs: flagsDeSlugs,
    rodadaDoDia: rodadaDoDia
  };
});
