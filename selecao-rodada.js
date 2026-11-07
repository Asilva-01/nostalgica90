/* ============================================================
   NOSTÁLGICA 90 — Regra da rodada diária (fonte única JS)
   Espelho bit-a-bit: .github/scripts/selecao_rodada.py
   Documentação: README.md (seção "Regra da rodada")

   Dia 1 = 2026-09-06 (data civil, sem fuso).
   Rodada = 3 desafios. Pool na ordem de challenges.json.

   Ciclo = floor(pool / 3) dias (18 quando pool=56). Em cada ciclo
   embaralha os índices com LCG 32-bit + Fisher–Yates e entrega
   fatias de 3 SEM repetir enquanto houver desafios sobrando.
   Os (pool % 3) que sobram entram no ciclo seguinte.
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

  function permutacaoCiclo(poolSize, ciclo) {
    var arr = [];
    var i, j, tmp, state;
    for (i = 0; i < poolSize; i++) arr.push(i);
    if (poolSize < 2) return arr;
    state = seedCiclo(ciclo, poolSize);
    for (i = poolSize - 1; i > 0; i--) {
      state = lcgNext(state);
      j = state % (i + 1);
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function rodadaDoDia(iso, poolSize) {
    var size = poolSize | 0;
    if (size < 1) throw new Error('poolSize inválido');
    var n = numeroDoDia(iso);
    var cicloLen = diasPorCiclo(size);
    var idx0 = n - 1;
    if (idx0 < 0) idx0 = 0;
    var ciclo = Math.floor(idx0 / cicloLen);
    var pos = idx0 % cicloLen;
    var perm = permutacaoCiclo(size, ciclo);
    var usados = Math.min(cicloLen * ROUND_SIZE, size);
    var inicio = pos * ROUND_SIZE;
    if (inicio >= usados) inicio = usados - ROUND_SIZE;
    if (inicio < 0) inicio = 0;
    var take = Math.min(ROUND_SIZE, usados - inicio, size);
    var indices = perm.slice(inicio, inicio + take);
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
    rodadaDoDia: rodadaDoDia
  };
});
