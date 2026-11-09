/* ============================================================
   NOSTÁLGICA 90 — Comparação flexível de respostas
   Fonte única usada pelo jogo e pelos testes.

   Ordem: igualdade (após normalizar + artigos) → typo curto →
   trecho substancial → token distintivo. Sem substring insegura.
   Digitacao: 100/80/60/40/20/10. Alternativa (após 2 erros): metade.
   ============================================================ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.Resposta = api;
  if (typeof window !== 'undefined') window.Resposta = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var PONTOS = { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20, 6: 10 };
  var ERROS_PARA_ALTERNATIVAS = 2;
  var MIN_TYPO = 4;
  var MIN_TOKEN = 5;
  var MIN_SUBST = 5;
  var SUBST_RATIO = 0.6;
  var LCG_A = 1664525;
  var LCG_C = 1013904223;

  var ARTIGOS = /^(o|a|os|as|um|uma|uns|umas|el|la|los|las)\s+/;
  var STOP = {
    o: 1, a: 1, os: 1, as: 1, um: 1, uma: 1, uns: 1, umas: 1,
    de: 1, da: 1, do: 1, das: 1, dos: 1, e: 1, em: 1, no: 1, na: 1,
    nos: 1, nas: 1, para: 1, por: 1, com: 1, sem: 1, the: 1, of: 1,
    el: 1, la: 1, los: 1, las: 1
  };
  /* Palavras curtas demais ou que servem para várias respostas. */
  var GENERICOS = {
    super: 1, nintendo: 1, mario: 1, park: 1, mundo: 1, copa: 1,
    santos: 1, boy: 1, game: 1, games: 1, ball: 1, star: 1, show: 1,
    club: 1, mix: 1, kid: 1, kids: 1, country: 1, world: 1, power: 1,
    time: 1, man: 1, men: 1, black: 1, king: 1, street: 1, tv: 1,
    radio: 1, casa: 1, filme: 1, video: 1, fita: 1, serie: 1,
    guerra: 1, ouro: 1, real: 1, nova: 1, novo: 1, grande: 1,
    day: 1, night: 1, city: 1, ranger: 1, force: 1, special: 1,
    aventura: 1, aventuras: 1, historia: 1, programa: 1, novela: 1
  };

  function pontosDaPista(n) { return PONTOS[n] || 10; }
  function pontosDaAlternativa(n) {
    return Math.floor(pontosDaPista(n) / 2);
  }

  function normalizar(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function semArtigosIniciais(s) {
    var t = normalizar(s);
    var prev;
    do {
      prev = t;
      t = t.replace(ARTIGOS, '');
    } while (t !== prev && t);
    return t;
  }

  function tokensDe(s) {
    var t = semArtigosIniciais(s);
    if (!t) return [];
    var parts = t.split(' ');
    var out = [];
    var i;
    for (i = 0; i < parts.length; i++) {
      if (parts[i] && !STOP[parts[i]]) out.push(parts[i]);
    }
    return out;
  }

  function distanciaEdicao(a, b) {
    var i, j, prev, cur, tmp;
    if (a === b) return 0;
    if (!a) return b.length;
    if (!b) return a.length;
    if (a.length > b.length) { tmp = a; a = b; b = tmp; }
    prev = [];
    for (j = 0; j <= a.length; j++) prev[j] = j;
    for (i = 1; i <= b.length; i++) {
      cur = [i];
      for (j = 1; j <= a.length; j++) {
        cur[j] = b.charAt(i - 1) === a.charAt(j - 1)
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
      }
      prev = cur;
    }
    return prev[a.length];
  }

  function maxTypo(len) {
    if (len < MIN_TYPO) return 0;
    if (len >= 10) return 2;
    return 1;
  }

  function candidatosDe(entry) {
    var lista = [];
    var visto = {};
    function add(s) {
      var n = semArtigosIniciais(s);
      if (!n || visto[n]) return;
      visto[n] = 1;
      lista.push(n);
    }
    if (!entry) return lista;
    add(entry.resp);
    (entry.alias || []).forEach(add);
    return lista;
  }

  function indiceTokens(pool) {
    var map = {};
    var i, j, toks, tok, id;
    if (!pool || !pool.length) return map;
    for (i = 0; i < pool.length; i++) {
      id = pool[i].id != null ? pool[i].id : i + 1;
      toks = tokensDe(pool[i].resp);
      (pool[i].alias || []).forEach(function (a) {
        tokensDe(a).forEach(function (t) { toks.push(t); });
      });
      for (j = 0; j < toks.length; j++) {
        tok = toks[j];
        if (!map[tok]) map[tok] = {};
        map[tok][id] = 1;
      }
    }
    return map;
  }

  function tokenDistintivo(tok, id, indice) {
    var donos, n, k;
    if (!tok || tok.length < MIN_TOKEN || GENERICOS[tok]) return false;
    donos = indice[tok];
    if (!donos) return true;
    n = 0;
    for (k in donos) if (Object.prototype.hasOwnProperty.call(donos, k)) n++;
    if (n === 0) return true;
    if (n === 1) return !!donos[id];
    return false;
  }

  function ehPrefixoOuMaior(cands, guessToks) {
    var i, j, toks, ok, primeiro;
    for (i = 0; i < cands.length; i++) {
      toks = [];
      cands[i].split(' ').forEach(function (p) {
        if (p && !STOP[p]) toks.push(p);
      });
      if (!toks.length) continue;
      primeiro = toks[0];
      toks.sort(function (a, b) { return b.length - a.length; });
      ok = false;
      for (j = 0; j < guessToks.length; j++) {
        if (guessToks[j] === toks[0] || guessToks[j] === primeiro) { ok = true; break; }
      }
      if (!ok) continue;
      return { primeiro: primeiro, maior: toks[0] };
    }
    return null;
  }

  function matchSubstancial(guess, cand) {
    var menor, maior, ratio;
    if (!guess || !cand || guess === cand) return guess === cand;
    if (cand.indexOf(guess) !== -1) {
      menor = guess;
      maior = cand;
    } else if (guess.indexOf(cand) !== -1) {
      menor = cand;
      maior = guess;
    } else {
      return false;
    }
    if (menor.length < MIN_SUBST) return false;
    ratio = menor.length / maior.length;
    return ratio >= SUBST_RATIO;
  }

  function matchTypo(guess, cand) {
    var limite, d, menor;
    menor = Math.min(guess.length, cand.length);
    limite = maxTypo(menor);
    if (!limite) return false;
    if (Math.abs(guess.length - cand.length) > limite) return false;
    d = distanciaEdicao(guess, cand);
    return d > 0 && d <= limite;
  }

  function matchTokens(guess, cand, entryId, indice) {
    var gToks = tokensDe(guess);
    var cToks = tokensDe(cand);
    var set = {};
    var i, t, temDistintivo;
    if (!gToks.length || !cToks.length) return false;
    for (i = 0; i < cToks.length; i++) set[cToks[i]] = 1;
    temDistintivo = false;
    for (i = 0; i < gToks.length; i++) {
      t = gToks[i];
      if (!set[t]) return false;
      if (tokenDistintivo(t, entryId, indice)) temDistintivo = true;
    }
    if (temDistintivo) return true;
    /* Token longo que é o primeiro ou o maior da resposta, mesmo
       se o índice ainda não tiver o pool (testes unitários curtos). */
    if (!indice || !Object.keys(indice).length) {
      var meta = ehPrefixoOuMaior([cand], gToks);
      if (meta) {
        for (i = 0; i < gToks.length; i++) {
          if (gToks[i].length >= MIN_TOKEN && (gToks[i] === meta.maior || gToks[i] === meta.primeiro)) {
            return !GENERICOS[gToks[i]];
          }
        }
      }
    }
    return false;
  }

  function corresponde(texto, entry, pool) {
    var guess = semArtigosIniciais(texto);
    var cands, i, indice, id;
    if (!guess || !entry) return false;
    cands = candidatosDe(entry);
    for (i = 0; i < cands.length; i++) {
      if (guess === cands[i]) return true;
    }
    for (i = 0; i < cands.length; i++) {
      if (matchTypo(guess, cands[i])) return true;
    }
    for (i = 0; i < cands.length; i++) {
      if (matchSubstancial(guess, cands[i])) return true;
    }
    id = entry.id != null ? entry.id : 0;
    indice = indiceTokens(pool);
    for (i = 0; i < cands.length; i++) {
      if (matchTokens(guess, cands[i], id, indice)) return true;
    }
    return false;
  }

  function u32(n) { return n >>> 0; }
  function lcgNext(state) { return u32(LCG_A * state + LCG_C); }

  function fisherYates(arr, seed) {
    var i, j, tmp, state, copy;
    copy = arr.slice();
    if (copy.length < 2) return copy;
    state = u32(seed || 1);
    for (i = copy.length - 1; i > 0; i--) {
      state = lcgNext(state);
      j = state % (i + 1);
      tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function alternativasPlausiveis(entry, pool, nDistratores) {
    var n = nDistratores == null ? 3 : nDistratores;
    var mesma = [];
    var outras = [];
    var i, item, seen, picks, d, lista, seed;
    if (!entry || !pool || !pool.length) return [entry && entry.resp].filter(Boolean);
    seed = u32((entry.id || 1) * 2654435761);
    for (i = 0; i < pool.length; i++) {
      item = pool[i];
      if (!item || item.resp === entry.resp) continue;
      if (entry.id != null && item.id === entry.id) continue;
      if (item.cat === entry.cat) mesma.push(item.resp);
      else outras.push(item.resp);
    }
    lista = fisherYates(mesma, seed).concat(fisherYates(outras, seed + 99));
    seen = {};
    seen[entry.resp] = 1;
    picks = [];
    for (i = 0; i < lista.length; i++) {
      d = lista[i];
      if (!d || seen[d]) continue;
      seen[d] = 1;
      picks.push(d);
      if (picks.length >= n) break;
    }
    return fisherYates([entry.resp].concat(picks), seed + 7);
  }

  return {
    PONTOS: PONTOS,
    ERROS_PARA_ALTERNATIVAS: ERROS_PARA_ALTERNATIVAS,
    normalizar: normalizar,
    semArtigosIniciais: semArtigosIniciais,
    distanciaEdicao: distanciaEdicao,
    candidatosDe: candidatosDe,
    corresponde: corresponde,
    alternativasPlausiveis: alternativasPlausiveis,
    pontosDaPista: pontosDaPista,
    pontosDaAlternativa: pontosDaAlternativa
  };
});
