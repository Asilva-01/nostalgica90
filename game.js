/* ============================================================
   NOSTÁLGICA 90 — Lógica do jogo (rodada diária de 3)
   Seleção: selecao-rodada.js (mesma regra do bot Python).
   localStorage nunca guarda texto de resposta/pistas/alias.
   Reentrar no dia não revela gabarito; fluxo já acertou / refazer.
   ============================================================ */
(function () {
  function el(id) { return document.getElementById(id); }

  var ROUND_SIZE = (window.SelecaoRodada && window.SelecaoRodada.ROUND_SIZE) || 3;
  var URL_PUBLICA = 'https://asilva-01.github.io/nostalgica90/';
  var PONTOS = { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20, 6: 10 };
  function pontosDaPista(n) { return PONTOS[n] || 10; }

  function chave(k) { return 'nostalgia90_' + k; }

  function hojeIso() {
    if (window.SelecaoRodada && window.SelecaoRodada.hojeIso) return window.SelecaoRodada.hojeIso();
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function ontemIso(iso) {
    var p = iso.split('-').map(Number);
    var dt = new Date(Date.UTC(p[0], p[1] - 1, p[2] - 1));
    return dt.toISOString().slice(0, 10);
  }
  function isoDeDiaN(n) {
    var ref = (window.SelecaoRodada && window.SelecaoRodada.REF_ISO) || '2026-09-06';
    var p = ref.split('-').map(Number);
    var dt = new Date(Date.UTC(p[0], p[1] - 1, p[2] + (n - 1)));
    return dt.toISOString().slice(0, 10);
  }

  function poolSize() {
    var t = (window.Dados && window.Dados.total) ? window.Dados.total() : 0;
    return t > 0 ? t : 156;
  }
  function numeroDoDia(iso) {
    return window.SelecaoRodada.numeroDoDia(iso);
  }
  function flagsArte() {
    var lista = (window.Dados && window.Dados.lista) ? window.Dados.lista() : [];
    if (window.Arte && window.Arte.temPropria) {
      return lista.map(function (c) { return !!window.Arte.temPropria(c); });
    }
    if (window.SelecaoRodada && window.SelecaoRodada.flagsDeSlugs && window.Arte && window.Arte.slugsProprios) {
      return window.SelecaoRodada.flagsDeSlugs(lista, window.Arte.slugsProprios());
    }
    return lista.map(function () { return false; });
  }
  function selecaoPara(iso) {
    return window.SelecaoRodada.rodadaDoDia(iso, poolSize(), flagsArte());
  }

  var isoHoje = hojeIso();
  var desafioHoje = numeroDoDia(isoHoje);
  var rodadaN = desafioHoje;
  var isoAtual = isoHoje;
  var modoArquivo = false;
  var revelarGabarito = false;
  var rodada = null;

  function carregarEstado() {
    var st = localStorage.getItem(chave('stats'));
    var base = { seq: 0, max: 0, jogos: 0, acertos: 0, ultimaVitoria: null, ultimaPartida: null, pontos: 0, melhor: 0, diasJogados: {} };
    if (!st) return base;
    try {
      var o = JSON.parse(st);
      if (!o.diasJogados || typeof o.diasJogados !== 'object') o.diasJogados = {};
      return o;
    } catch (e) { return base; }
  }
  var stats = carregarEstado();

  function salvarStats() {
    localStorage.setItem(chave('stats'), JSON.stringify({
      seq: stats.seq || 0,
      max: stats.max || 0,
      jogos: stats.jogos || 0,
      acertos: stats.acertos || 0,
      ultimaVitoria: stats.ultimaVitoria || null,
      ultimaPartida: stats.ultimaPartida || null,
      pontos: stats.pontos || 0,
      melhor: stats.melhor || 0,
      diasJogados: stats.diasJogados || {}
    }));
  }

  function slotLimpo(id) {
    return { id: id, pista: 1, venceu: false, perdeu: false, pontos: 0, cobrado: false, oficial: null };
  }

  function novaRodada(iso) {
    var sel = selecaoPara(iso);
    var ids = [];
    var lista = window.Dados.lista();
    sel.indices.forEach(function (ix) {
      var item = lista[ix];
      ids.push(item && item.id != null ? item.id : (ix + 1));
    });
    return {
      n: sel.n,
      iso: iso,
      ids: ids,
      indice: 0,
      slots: ids.map(slotLimpo),
      finalizada: false,
      pontosOficiais: 0,
      seqContada: false
    };
  }

  function serializarRodada(r) {
    return {
      n: r.n,
      iso: r.iso,
      ids: r.ids.slice(),
      indice: r.indice | 0,
      slots: r.slots.map(function (s) {
        return {
          id: s.id,
          pista: s.pista || 1,
          venceu: !!s.venceu,
          perdeu: !!s.perdeu,
          pontos: s.pontos || 0,
          cobrado: !!s.cobrado,
          oficial: s.oficial ? { pista: s.oficial.pista, venceu: !!s.oficial.venceu, perdeu: !!s.oficial.perdeu, pontos: s.oficial.pontos || 0 } : null
        };
      }),
      finalizada: !!r.finalizada,
      pontosOficiais: r.pontosOficiais || 0,
      seqContada: !!r.seqContada
    };
  }

  function chaveRodada(n) { return chave('rodada_d' + n); }

  function getRodada(n) {
    var raw = localStorage.getItem(chaveRodada(n));
    if (!raw) return null;
    try {
      var r = JSON.parse(raw);
      if (!r || !Array.isArray(r.slots) || !Array.isArray(r.ids)) return null;
      return r;
    } catch (e) { return null; }
  }

  function salvarRodada() {
    if (!rodada) return;
    localStorage.setItem(chaveRodada(rodada.n), JSON.stringify(serializarRodada(rodada)));
  }

  function garantirRodada(n, iso) {
    if (rodada && rodada.n === n) return rodada;
    var r = getRodada(n);
    if (r && Array.isArray(r.slots) && r.slots.length) {
      rodada = r;
      return rodada;
    }
    rodada = novaRodada(iso);
    return rodada;
  }

  function slotAtual() {
    if (!rodada || !rodada.slots || !rodada.slots.length) return { id: 1, pista: 1 };
    return rodada.slots[rodada.indice] || rodada.slots[0];
  }
  function entryAtual() {
    var s = slotAtual();
    if (window.Dados.itemPorId) {
      var byId = window.Dados.itemPorId(s.id);
      if (byId) return byId;
    }
    var lista = window.Dados.lista();
    for (var i = 0; i < lista.length; i++) if (lista[i].id === s.id) return lista[i];
    return lista[(s.id - 1 + lista.length) % lista.length];
  }

  function slotFinalizado(s) { return !!(s && (s.venceu || s.perdeu)); }
  function partidaFinalizada() { return slotFinalizado(slotAtual()); }

  function normalizar(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function checarResposta(texto) {
    var e = entryAtual();
    var t = normalizar(texto);
    if (t === normalizar(e.resp)) return true;
    return (e.alias || []).some(function (a) { return t === normalizar(a); });
  }

  function registrarSlot(s, venceu) {
    if (s.cobrado) return;
    var ganho = venceu ? pontosDaPista(s.pista) : 0;
    if (!modoArquivo) {
      stats.jogos++;
      if (venceu) {
        stats.acertos++;
        stats.pontos = (stats.pontos || 0) + ganho;
        if (ganho > (stats.melhor || 0)) stats.melhor = ganho;
      }
      salvarStats();
    }
    s.cobrado = true;
    s.pontos = ganho;
    s.oficial = { pista: s.pista, venceu: !!venceu, perdeu: !venceu, pontos: ganho };
    rodada.pontosOficiais = rodada.slots.reduce(function (acc, x) {
      return acc + (x.oficial ? x.oficial.pontos : 0);
    }, 0);
  }

  function registrarRodadaCompleta() {
    if (rodada.seqContada) return;
    if (modoArquivo) {
      rodada.seqContada = true;
      salvarRodada();
      return;
    }
    var hoje = isoHoje;
    var todosOficiais = rodada.slots.every(function (s) { return s.oficial; });
    if (!todosOficiais) return;
    var algumAcerto = rodada.slots.some(function (s) { return s.oficial && s.oficial.venceu; });
    stats.diasJogados = stats.diasJogados || {};
    stats.diasJogados[hoje] = true;
    stats.ultimaPartida = hoje;
    if (algumAcerto) {
      if (stats.ultimaVitoria === ontemIso(hoje)) stats.seq = (stats.seq || 0) + 1;
      else if (stats.ultimaVitoria !== hoje) stats.seq = 1;
      stats.ultimaVitoria = hoje;
    } else {
      stats.seq = 0;
    }
    if (stats.seq > (stats.max || 0)) stats.max = stats.seq;
    rodada.seqContada = true;
    salvarStats();
    renderEstatisticas();
    renderSemana();
  }

  function rodadaTodaFinalizada() {
    return rodada.slots.every(slotFinalizado);
  }

  /* ---------- render ---------- */
  function renderEstatisticas() {
    if (el('stSeq')) el('stSeq').textContent = stats.seq || 0;
    if (el('stMax')) el('stMax').textContent = stats.max || 0;
    if (el('stJog')) el('stJog').textContent = stats.jogos || 0;
    if (el('stVit')) el('stVit').textContent = stats.acertos || 0;
    if (el('stPts')) el('stPts').textContent = (modoArquivo ? (rodada.pontosOficiais || 0) : (stats.pontos || 0));
    if (el('stSlot')) el('stSlot').textContent = (rodada.indice + 1) + '/' + rodada.slots.length;
    if (el('stPtsRodada')) el('stPtsRodada').textContent = rodada.pontosOficiais || 0;
  }

  function renderProgresso() {
    var box = el('rodadaProgresso');
    if (!box) return;
    box.innerHTML = '';
    for (var i = 0; i < rodada.slots.length; i++) {
      var s = rodada.slots[i];
      var d = document.createElement('span');
      d.className = 'vhs-tick';
      if (i === rodada.indice) d.classList.add('atual');
      if (s.venceu) d.classList.add('ok');
      else if (s.perdeu) d.classList.add('no');
      d.setAttribute('aria-label', 'Memória ' + (i + 1) + (s.venceu ? ' acertada' : s.perdeu ? ' encerrada' : i === rodada.indice ? ' atual' : ' a jogar'));
      d.textContent = String(i + 1);
      box.appendChild(d);
    }
  }

  function renderSemana() {
    var box = el('semana');
    if (!box) return;
    var dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    var hoje = new Date();
    box.innerHTML = '';
    for (var i = 6; i >= 0; i--) {
      var d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
      var diaLabel = dias[d.getDay()];
      var ds = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var classe = 'dia';
      var feito = !!(stats.diasJogados && stats.diasJogados[ds]);
      if (ds === isoHoje) classe += ' hoje';
      else if (ds > isoHoje) classe += ' futuro';
      else if (feito) classe += ' feito';
      else classe += ' vazio';
      box.innerHTML +=
        '<div class="' + classe + '"><b>' +
        (feito ? '✓' : (ds === isoHoje ? '?' : '·')) +
        '</b><small>' + diaLabel + '</small></div>';
    }
  }

  function catInfo(cat) {
    var emoji = window.Dados.CAT_EMOJI[cat] || '📼';
    var cor = (window.Dados.CAT_COR[cat] || ['#388e3c', '#0b4a1e']);
    var classe = 'cat-' + (cat || 'CULTURA').replace(/\s+/g, '');
    return { emoji: emoji, cor: cor, classe: classe };
  }

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ehArteOriginal(e) {
    var c = e && e.credito_imagem;
    return !!(c && (c.tipo === 'arte-original' || c.licenca === 'Arte original'));
  }

  function temFotoLivre(e) {
    var c = e && e.credito_imagem;
    if (!(e && e.image && c && c.autor && c.licenca)) return false;
    if (ehArteOriginal(e)) return true;
    return !!(c.url_licenca && c.url_origem);
  }

  function renderChallengeImage(e) {
    var box = el('challengeImg');
    if (!box) return;
    var info = catInfo(e.cat);
    var html;
    if (window.Arte && window.Arte.gerar) html = window.Arte.gerar(e, info);
    else {
      html = '<div class="art-fundo ' + (info.classe || 'canal-tv') + '"></div>' +
        '<div class="tc-emoji">' + info.emoji + '</div>' +
        '<div class="art-scan"></div>';
    }
    box.innerHTML = html + '<div class="legenda">' + info.emoji + ' ' + (e.cat || '') + ' · ' + (e.ano || '') + '</div>';
  }

  function montarCartaoRevelacao(e, win) {
    var selo = win ? 'REVELAÇÃO' : 'ERA ISSO';
    var figura;
    if (temFotoLivre(e)) {
      var cred = e.credito_imagem;
      var original = ehArteOriginal(e);
      var altPadrao = original
        ? ('Ilustração original de ' + e.resp)
        : ('Foto relacionada a ' + e.resp);
      var alt = escHtml(e.image_alt || altPadrao);
      var fonte = '';
      if (e.image_avif) {
        fonte = '<source srcset="' + escHtml(e.image_avif) + '" type="image/avif">';
      }
      var caption = original
        ? 'Arte original Nostálgica 90.'
        : ('Foto: ' + escHtml(cred.autor) +
            ' · <a href="' + escHtml(cred.url_licenca) + '" target="_blank" rel="noopener noreferrer">' + escHtml(cred.licenca) + '</a>' +
            ' · <a href="' + escHtml(cred.url_origem) + '" target="_blank" rel="noopener noreferrer">origem</a>');
      figura =
        '<figure class="revelacao-figura">' +
          '<picture>' + fonte +
            '<img src="' + escHtml(e.image) + '" alt="' + alt + '" loading="lazy" decoding="async" width="960" height="640">' +
          '</picture>' +
          '<figcaption class="revelacao-credito">' + caption + '</figcaption>' +
        '</figure>';
    } else {
      var info = catInfo(e.cat);
      var arte = (window.Arte && window.Arte.gerar) ? window.Arte.gerar(e, info) : '';
      figura =
        '<div class="revelacao-arte" role="img" aria-label="Arte original de ' + escHtml(e.resp) + '">' +
          arte +
          '<p class="revelacao-credito">Arte original Nostálgica 90.</p>' +
        '</div>';
    }
    var curio = e.curiosidade
      ? '<div class="curiosidade curiosidade-destaque"><div class="tag">VOCÊ LEMBRA DISSO?</div><p>' + escHtml(e.curiosidade) + '</p></div>'
      : '';
    var saiba = e.link_saiba_mais
      ? '<a class="revelacao-saiba" href="' + escHtml(e.link_saiba_mais) + '" target="_blank" rel="noopener noreferrer">Saiba mais<span class="sr-only"> (abre em nova aba)</span></a>'
      : '';
    var aviso = linkAvisoErro(e);
    return '<article class="cartao-revelacao' + (win ? ' acerto' : ' esgotou') + '" aria-live="polite">' +
      '<p class="revelacao-selo">' + selo + '</p>' +
      '<h2 class="revelacao-titulo">' + escHtml(e.emoji || '') + ' ' + escHtml(e.resp) + '</h2>' +
      figura + curio + saiba + aviso +
      '</article>';
  }

  function linkAvisoErro(e) {
    var title = 'Erro no desafio #' + e.id;
    var body = 'Desafio: #' + e.id + '\nResposta: ' + (e.resp || '') + '\n\nO que está errado:\n';
    var href = 'https://github.com/Asilva-01/nostalgica90/issues/new?title=' +
      encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
    return '<a class="revelacao-aviso" href="' + escHtml(href) + '" target="_blank" rel="noopener noreferrer">Achou um erro? Avise<span class="sr-only"> (abre uma issue no GitHub, depois da revelação)</span></a>';
  }

  function renderPistas() {
    var box = el('listaPistas');
    if (!box) return;
    box.innerHTML = '';
    box.classList.remove('hidden');
    for (var i = 1; i <= 6; i++) {
      var div = document.createElement('div');
      div.className = 'pista-linha';
      div.id = 'pista' + i;
      div.innerHTML = '<span class="n">PISTA 0' + i + '</span> <span class="txt"></span>';
      box.appendChild(div);
    }
  }

  function revelarAte(n) {
    var e = entryAtual();
    for (var i = 1; i <= 6; i++) {
      var el2 = el('pista' + i);
      if (!el2) continue;
      var txt = el2.querySelector('.txt');
      if (i <= n) {
        if (txt) txt.textContent = (e.pistas && e.pistas[i - 1]) || '';
        el2.classList.add('revelada');
        el2.classList.remove('ativa');
        if (i === n && !partidaFinalizada()) {
          el2.classList.add('ativa');
          el2.classList.remove('pista-nova');
          void el2.offsetWidth;
          el2.classList.add('pista-nova');
        }
      } else {
        if (txt) txt.textContent = '';
        el2.classList.remove('revelada', 'ativa');
      }
    }
    var pb = el('pontosBarra');
    if (pb) pb.style.width = ((n - 1) / 5) * 100 + '%';
    var pp = el('pontosPossiveis');
    if (pp) pp.textContent = pontosDaPista(n);
  }

  function mostrarPainel(idVisivel) {
    ['areaJogo', 'areaFim', 'areaResumo', 'areaRefazer'].forEach(function (id) {
      var n = el(id);
      if (!n) return;
      if (id === idVisivel) n.classList.remove('hidden');
      else n.classList.add('hidden');
    });
  }

  function desenhar() {
    garantirRodada(rodadaN, isoAtual);
    var e = entryAtual();
    renderEstatisticas();
    renderProgresso();
    var chaveEl = el('chaveDesafio');
    if (chaveEl) {
      chaveEl.textContent = (modoArquivo ? 'ARQUIVO · ' : '') + 'RODADA #' + rodada.n + ' · MEMÓRIA ' + (rodada.indice + 1) + '/' + rodada.slots.length;
    }
    var secJogo = el('secJogo');
    if (secJogo) {
      var base = ['cat-TV', 'cat-GAMES', 'cat-CINEMA', 'cat-MÚSICA', 'cat-BRINQUEDOS', 'cat-TECNOLOGIA', 'cat-CULTURA', 'cat-ESPORTE', 'cat-c', 'venceu', 'errou'];
      for (var i = 0; i < base.length; i++) secJogo.classList.remove(base[i]);
      secJogo.classList.add(catInfo(e.cat).classe);
      secJogo.classList.remove('desafio-render');
      void secJogo.offsetWidth;
      secJogo.classList.add('desafio-render', 'entra');
    }
    var pill = el('catPill');
    if (pill) {
      var info = catInfo(e.cat);
      pill.className = 'cat-pill ' + info.classe;
      pill.innerHTML = '<span class="pill-emoji">' + info.emoji + '</span> ' + (e.cat || '');
    }
    renderChallengeImage(e);

    if (el('arquivoNav')) {
      if (modoArquivo) el('arquivoNav').classList.remove('hidden');
      else el('arquivoNav').classList.add('hidden');
    }
    if (el('voltarAmanha')) el('voltarAmanha').classList.add('hidden');
    if (secJogo) secJogo.classList.remove('modo-revelacao');

    if (rodada.finalizada && !revelarGabarito) {
      mostrarResumo(false);
      return;
    }
    if (partidaFinalizada() && revelarGabarito) {
      mostrarFim();
      return;
    }
    if (partidaFinalizada() && !revelarGabarito) {
      mostrarJaJogou();
      return;
    }

    renderPistas();
    revelarAte(slotAtual().pista || 1);
    var campo = el('campo');
    if (campo) {
      campo.value = '';
      if (!modoArquivo) campo.focus();
    }
    var respMsg = el('respMsg');
    if (respMsg) { respMsg.textContent = ''; respMsg.className = 'feedback'; }
    mostrarPainel('areaJogo');
  }

  /* ---------- ações ---------- */
  function enviarResposta() {
    if (partidaFinalizada()) return;
    var campo = el('campo');
    var texto = campo ? campo.value.trim() : '';
    if (!texto) { toast('Digite uma resposta primeiro!'); return; }
    var s = slotAtual();
    if (!s.pista) s.pista = 1;

    if (checarResposta(texto)) {
      s.venceu = true;
      registrarSlot(s, true);
      revelarGabarito = true;
      if (rodadaTodaFinalizada()) {
        rodada.finalizada = true;
        registrarRodadaCompleta();
      }
      salvarRodada();
      if (window.Som) window.Som.tocar('ui-success');
      if (window.Efeitos) window.Efeitos.confete();
      var sj = el('secJogo');
      if (sj) sj.classList.add('venceu');
      pulsarValor('stPts');
      pulsarValor('stSeq');
      if (campo) campo.value = '';
      mostrarFim();
    } else {
      var msg = el('respMsg');
      if (msg) {
        msg.textContent = 'NÃO FOI DESSA VEZ. ' + (s.pista < 6 ? 'Quer outra pista?' : 'Essa era a última pista!');
        msg.className = 'feedback errada';
        if (window.Efeitos) window.Efeitos.glitch(msg);
      }
      if (window.Som) window.Som.tocar('ui-error');
      salvarRodada();
      if (campo) { campo.value = ''; campo.focus(); }
    }
  }

  function pulsarValor(id) {
    var v = el(id);
    if (!v) return;
    v.classList.remove('pulso');
    void v.offsetWidth;
    v.classList.add('pulso');
  }

  function pularPista() {
    if (partidaFinalizada()) return;
    var s = slotAtual();
    if (!s.pista) s.pista = 1;
    var msg = el('respMsg');
    if (msg) { msg.textContent = ''; msg.className = 'feedback'; }
    if (s.pista >= 6) {
      s.perdeu = true;
      registrarSlot(s, false);
      revelarGabarito = true;
      if (rodadaTodaFinalizada()) {
        rodada.finalizada = true;
        registrarRodadaCompleta();
      }
      salvarRodada();
      if (window.Som) window.Som.tocar('ui-error');
      mostrarFim();
      return;
    }
    s.pista++;
    salvarRodada();
    if (window.Som) window.Som.tocar('ui-reveal');
    if (window.Efeitos) window.Efeitos.trocaCanal(el('listaPistas'));
    revelarAte(s.pista);
    var campo = el('campo');
    if (campo) campo.focus();
  }

  function emojiGridOficial(oficial) {
    if (!oficial) return '⬛⬛⬛⬛⬛⬛';
    if (oficial.venceu) {
      var arr = [];
      for (var i = 1; i <= 6; i++) {
        if (i < oficial.pista) arr.push('🟨');
        else if (i === oficial.pista) arr.push('🟩');
        else arr.push('⬛');
      }
      return arr.join('');
    }
    return '🟨🟨🟨🟨🟨🟥';
  }

  function corpoCompartilhamento() {
    var linhas = rodada.slots.map(function (s) { return emojiGridOficial(s.oficial); });
    var seq = stats.seq || 0;
    var pts = rodada.pontosOficiais || 0;
    return '📺 NOSTÁLGICA 90\n' +
      'Rodada #' + rodada.n + ' · 3 memórias\n' +
      linhas.join('\n') + '\n' +
      '🎯 ' + pts + ' pts · sequência ' + seq + '\n' +
      'Você lembra dos anos 90?';
  }

  function textoCompartilhamento() {
    return corpoCompartilhamento() + '\n👉 ' + URL_PUBLICA;
  }

  function mostrarFim() {
    var e = entryAtual();
    var s = slotAtual();
    var fim = el('areaFim');
    var msg = el('respMsg');
    if (msg) { msg.textContent = ''; msg.className = 'feedback'; }
    mostrarPainel('areaFim');
    if (!fim) return;
    var win = !!s.venceu;
    var sj = el('secJogo');
    if (sj) sj.classList.add('modo-revelacao');
    if (el('listaPistas')) el('listaPistas').classList.add('hidden');
    var grid = emojiGridOficial(s.oficial || { pista: s.pista, venceu: win, perdeu: !win });
    var ultimo = rodada.indice >= rodada.slots.length - 1;
    var cta = ultimo
      ? '<button type="button" class="btn btn-verde btn-fim-primario" onclick="Jogo.verResumo()">Ver resumo da rodada</button>'
      : '<button type="button" class="btn btn-verde btn-fim-primario" onclick="Jogo.proximoDesafio()">Próxima memória ➜</button>';
    fim.innerHTML =
      montarCartaoRevelacao(e, win) +
      '<div class="grid-share" aria-hidden="true">' + grid + '</div>' +
      '<div class="feedback ' + (win ? 'certa' : 'errada') + '">' +
      (win ? 'Você lembra! +' + pontosDaPista(s.pista) + ' pts nesta memória' : 'A resposta era essa. Segue a rodada.') +
      '</div>' +
      '<div class="fim-acoes">' + cta +
      '<button type="button" class="btn btn-pular" onclick="Jogo.refazerDesafio()">Refazer esta memória</button>' +
      '</div>';
    renderProgresso();
    renderEstatisticas();
    var cartao = fim.querySelector('.cartao-revelacao');
    if (cartao && cartao.scrollIntoView) {
      try { cartao.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (err) {}
    }
    var prim = fim.querySelector('.btn-fim-primario');
    if (prim && prim.focus) prim.focus();
  }

  function mostrarJaJogou() {
    var s = slotAtual();
    var box = el('areaRefazer');
    var msg = el('respMsg');
    if (msg) { msg.textContent = ''; msg.className = 'feedback'; }
    mostrarPainel('areaRefazer');
    if (el('listaPistas')) el('listaPistas').classList.add('hidden');
    if (!box) return;
    var win = !!s.venceu;
    box.innerHTML =
      '<div class="fim-titulo">VOCÊ JÁ JOGOU ESTA</div>' +
      '<p class="ja-jogou-txt">' + (win ? 'Já acertou esta memória hoje.' : 'Esta memória já foi encerrada.') +
      ' Reentrar não mostra o gabarito.</p>' +
      '<div class="grid-share" aria-hidden="true">' + emojiGridOficial(s.oficial) + '</div>' +
      '<div class="fim-acoes">' +
      '<button type="button" class="btn btn-amarelo btn-fim-primario" onclick="Jogo.refazerDesafio()">Refazer</button>' +
      (rodada.indice < rodada.slots.length - 1
        ? '<button type="button" class="btn btn-verde" onclick="Jogo.proximoDesafio()">Continuar a rodada ➜</button>'
        : '<button type="button" class="btn btn-verde" onclick="Jogo.verResumo()">Ver resumo</button>') +
      '</div>';
  }

  function mostrarResumo(fromCta) {
    revelarGabarito = false;
    rodada.finalizada = rodadaTodaFinalizada();
    salvarRodada();
    var box = el('areaResumo');
    var msg = el('respMsg');
    if (msg) { msg.textContent = ''; msg.className = 'feedback'; }
    if (el('listaPistas')) el('listaPistas').classList.add('hidden');
    mostrarPainel('areaResumo');
    if (!box) return;
    var linhas = rodada.slots.map(function (s, i) {
      var g = emojiGridOficial(s.oficial);
      var tag = s.oficial && s.oficial.venceu ? 'ACERTO' : 'ENCERRADA';
      return '<li class="resumo-item"><span class="resumo-n">FITA ' + (i + 1) + '</span>' +
        '<span class="resumo-grid">' + g + '</span>' +
        '<span class="resumo-tag">' + tag + ' · ' + ((s.oficial && s.oficial.pontos) || 0) + ' pts</span></li>';
    }).join('');
    var amanha = modoArquivo ? '' :
      '<p class="voltar-amanha" id="voltarAmanhaResumo">Amanhã tem outra rodada de 3. Volte pra não perder a sequência.</p>';
    box.innerHTML =
      '<div class="fim-titulo">FIM DA RODADA #' + rodada.n + '</div>' +
      '<p class="resumo-lead">3 memórias · ' + (rodada.pontosOficiais || 0) + ' pts · sequência ' + (stats.seq || 0) + '</p>' +
      '<ul class="resumo-lista">' + linhas + '</ul>' +
      amanha +
      '<div class="fim-acoes">' +
      '<button type="button" class="btn btn-whats btn-fim-primario" onclick="Jogo.shareWhats()">Compartilhar grade</button>' +
      '<div class="fim-acoes-secundarias">' +
      '<button type="button" class="btn btn-telegram btn-fim-secundario" onclick="Jogo.shareTelegram()">Telegram</button>' +
      '<button type="button" class="btn btn-azul btn-fim-secundario" onclick="Jogo.copiar()">Copiar</button>' +
      '</div>' +
      '<button type="button" class="btn btn-pular" onclick="Jogo.refazerRodada()">Refazer a rodada</button>' +
      (modoArquivo ? '' : '<button type="button" class="fim-arquivo" onclick="Jogo.verArquivo();var _a=document.getElementById(\'secArquivo\');if(_a)_a.scrollIntoView({behavior:\'smooth\',block:\'start\'});"><span class="fim-arquivo-titulo">Arquivo da locadora</span><span class="fim-arquivo-sub">Rodadas anteriores, sem gabarito</span></button>') +
      '</div>';
    renderProgresso();
    renderEstatisticas();
    if (fromCta && window.scrollTo) window.scrollTo(0, 0);
  }

  function proximoDesafio() {
    revelarGabarito = false;
    if (rodada.indice < rodada.slots.length - 1) rodada.indice++;
    if (rodadaTodaFinalizada()) {
      rodada.finalizada = true;
      registrarRodadaCompleta();
      salvarRodada();
      mostrarResumo(true);
      return;
    }
    salvarRodada();
    desenhar();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  function refazerDesafio() {
    var s = slotAtual();
    var id = s.id;
    rodada.slots[rodada.indice] = slotLimpo(id);
    rodada.slots[rodada.indice].cobrado = !!s.cobrado;
    rodada.slots[rodada.indice].oficial = s.oficial;
    rodada.slots[rodada.indice].pontos = s.oficial ? s.oficial.pontos : 0;
    rodada.finalizada = false;
    revelarGabarito = false;
    salvarRodada();
    desenhar();
  }

  function refazerRodada() {
    rodada.slots = rodada.ids.map(function (id, i) {
      var old = rodada.slots[i] || slotLimpo(id);
      var n = slotLimpo(id);
      n.cobrado = !!old.cobrado;
      n.oficial = old.oficial;
      n.pontos = old.oficial ? old.oficial.pontos : 0;
      return n;
    });
    rodada.indice = 0;
    rodada.finalizada = false;
    revelarGabarito = false;
    salvarRodada();
    desenhar();
  }

  function verResumo() {
    if (rodadaTodaFinalizada()) {
      rodada.finalizada = true;
      registrarRodadaCompleta();
    }
    mostrarResumo(true);
  }

  function abrirShare(texto, url) {
    if (navigator.share) {
      return navigator.share({ title: 'Nostálgica 90', text: texto, url: url }).catch(function (err) {
        if (err && err.name === 'AbortError') return;
        window.open('https://wa.me/?text=' + encodeURIComponent(texto + '\n👉 ' + url), '_blank');
      });
    }
    window.open('https://wa.me/?text=' + encodeURIComponent(texto + '\n👉 ' + url), '_blank');
  }
  function shareWhats() { abrirShare(corpoCompartilhamento(), URL_PUBLICA); }
  function shareTelegram() {
    window.open('https://t.me/share/url?url=' + encodeURIComponent(URL_PUBLICA) + '&text=' + encodeURIComponent(corpoCompartilhamento()), '_blank');
  }
  function copiar() {
    var texto = textoCompartilhamento();
    function ok() { toast('Grade copiada! Cola no WhatsApp.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok).catch(function () { copiarFallback(texto); });
    } else copiarFallback(texto);
  }
  function copiarFallback(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('Grade copiada.'); } catch (e) { toast('Não consegui copiar. Use o WhatsApp.'); }
    document.body.removeChild(ta);
  }

  /* ---------- arquivo ---------- */
  function verArquivo() {
    abrirSecao('secArquivo', true);
    mostrarGaleria('TODOS');
  }

  function mostrarGaleria(filtro) {
    var box = el('galeria');
    if (!box) return;
    box.innerHTML = '';
    var min = 1;
    var maxN = desafioHoje;
    var idx = 0;
    for (var n = maxN; n >= min; n--) {
      var iso = isoDeDiaN(n);
      var sel = selecaoPara(iso);
      var lista = window.Dados.lista();
      var cats = sel.indices.map(function (ix) { return (lista[ix] || {}).cat; });
      if (filtro !== 'TODOS' && cats.indexOf(filtro) === -1) continue;
      var saved = getRodada(n);
      var ticks = '';
      for (var k = 0; k < ROUND_SIZE; k++) {
        var st = '·';
        var cls = 'tick';
        if (saved && saved.slots && saved.slots[k] && saved.slots[k].oficial) {
          if (saved.slots[k].oficial.venceu) { st = '✓'; cls += ' ok'; }
          else { st = '×'; cls += ' no'; }
        }
        ticks += '<span class="' + cls + '">' + st + '</span>';
      }
      var pts = saved && saved.pontosOficiais ? saved.pontosOficiais + ' pts' : '3 fitas';
      box.innerHTML +=
        '<button type="button" class="gal-card vhs-card" style="animation-delay:' + (idx * 30) + 'ms" onclick="Jogo.abrirArquivo(' + n + ')">' +
        '<div class="num">#' + n + '</div>' +
        '<div class="vhs-lombo" aria-hidden="true"></div>' +
        '<div class="cat">RODADA</div>' +
        '<div class="gal-ticks">' + ticks + '</div>' +
        '<div class="res">' + pts + '</div>' +
        '</button>';
      idx++;
    }
    var fb = el('filtros');
    if (fb) {
      fb.innerHTML = '<button type="button" class="filtro' + (filtro === 'TODOS' ? ' ativo' : '') + '" onclick="Jogo.mostrarGaleria(\'TODOS\')">TODAS</button>';
      window.Dados.CATEGORIAS.forEach(function (c) {
        var cl = 'filtro' + (filtro === c ? ' ativo' : '') + ' ' + catInfo(c).classe;
        fb.innerHTML += '<button type="button" class="' + cl + '" onclick="Jogo.mostrarGaleria(\'' + c + '\')">' + (window.Dados.CAT_EMOJI[c] || '') + ' ' + c + '</button>';
      });
    }
  }

  function abrirArquivo(n) {
    rodadaN = n;
    isoAtual = isoDeDiaN(n);
    modoArquivo = n !== desafioHoje;
    revelarGabarito = false;
    rodada = garantirRodada(n, isoAtual);
    if (window.scrollTo) window.scrollTo(0, 0);
    var arq = el('secArquivo');
    if (arq) arq.classList.add('secao-aberta');
    desenhar();
  }

  function voltarHoje() {
    rodadaN = desafioHoje;
    isoAtual = isoHoje;
    modoArquivo = false;
    revelarGabarito = false;
    rodada = garantirRodada(rodadaN, isoAtual);
    if (el('arquivoNav')) el('arquivoNav').classList.add('hidden');
    desenhar();
  }

  function abrirSecao(id, abrir) {
    var s = el(id);
    if (!s) return;
    if (abrir === undefined) abrir = s.classList.contains('secao-aberta') ? false : true;
    if (abrir) s.classList.add('secao-aberta');
    else s.classList.remove('secao-aberta');
  }

  /* ---------- museu ---------- */
  function mostrarMuseu(cat) {
    var box = el('museuItens');
    var dados = window.Dados.listaMuseu();
    if (!box) return;
    box.innerHTML = '';
    var idx = 0;
    dados.forEach(function (g) {
      if (cat && g.cat !== cat) return;
      var emojiItem = g.emoji || '📼';
      g.itens.forEach(function (it) {
        box.innerHTML +=
          '<div class="museu-item ' + catInfo(g.cat).classe + '" style="animation-delay:' + (idx * 45) + 'ms" onclick="Jogo.abrirMuseuItem(\'' + g.cat + '\',\'' + it.nome.replace(/'/g, "\\'") + '\')">' +
          '<div class="e">' + (it.emoji || emojiItem) + '</div><div class="t">' + it.nome + '</div></div>';
        idx++;
      });
    });
  }

  function somMuseu(cat) {
    var sons = {
      'MÚSICA': 'ui-arcade', 'GAMES': 'ui-arcade', 'TECNOLOGIA': 'ui-boot',
      'VHS': 'ui-vhs', 'CULTURA': 'ui-vhs', 'TV': 'ui-channel',
      'ESPORTE': 'ui-apito',
      'CINEMA': 'ui-reveal', 'RÁDIO': 'ui-click', 'BRINQUEDOS': 'ui-success'
    };
    return sons[cat] || 'ui-reveal';
  }

  function abrirMuseuItem(cat, nome) {
    var dados = window.Dados.listaMuseu();
    var alvo = null;
    var emojiCat = '📼';
    dados.forEach(function (g) {
      if (g.cat === cat) emojiCat = g.emoji || emojiCat;
      g.itens.forEach(function (it) { if (g.cat === cat && it.nome === nome) alvo = it; });
    });
    if (!alvo) return;
    var m = el('modal');
    var arte = (window.MuseuArtes && window.MuseuArtes.artePorItem) ? window.MuseuArtes.artePorItem(alvo) : null;
    var arteHtml = arte ? arte : ('<div class="arte">' + (alvo.emoji || emojiCat) + '</div>');
    el('modalCorpo').innerHTML =
      arteHtml +
      '<h3>' + alvo.nome + '</h3>' +
      '<div class="ano">' + (alvo.ano || '') + ' · ' + cat + '</div>' +
      '<p>' + (alvo.desc || '') + '</p>' +
      '<div class="curio"> ' + (alvo.curiosidade || '') + '</div>' +
      '<div class="lembra">VOCÊ LEMBRA DISSO?</div>';
    m.classList.remove('hidden');
    if (cat === 'MÚSICA') {
      if (window.Som) window.Som.ativar();
      if (window.NostalMusica) window.NostalMusica.definirtema('novela');
      if (window.NostalMusica) window.NostalMusica.ligar();
      if (window.Som) window.Som.prefs.musica = true;
    } else if (window.Som) {
      window.Som.tocar(somMuseu(cat));
    }
  }
  function fecharModal() {
    el('modal').classList.add('hidden');
    if (window.NostalMusica && window.Som && window.Som.prefs.musica) window.NostalMusica.definirtema('desafio');
  }

  function abrirMemoria(m) {
    if (!m) return;
    var modal = el('modal');
    var corpo = el('modalCorpo');
    if (corpo && window.Cenas && window.Cenas.detalheMemoria) {
      corpo.innerHTML = window.Cenas.detalheMemoria(m);
      modal.classList.remove('hidden');
      if (window.Cenas.tocarSom) window.Cenas.tocarSom(m);
    }
  }

  function syncAudioToggles() {
    if (!window.Som) return;
    var sfx = !!window.Som.prefs.sfx;
    var mus = !!window.Som.prefs.musica;
    var bSfx = el('btnSfxToggle');
    var bMus = el('btnMusicaToggle');
    if (bSfx) {
      bSfx.setAttribute('aria-pressed', String(sfx));
      bSfx.classList.toggle('ativo', sfx);
    }
    if (bMus) {
      bMus.setAttribute('aria-pressed', String(mus));
      bMus.classList.toggle('ativo', mus);
    }
  }

  function iniciarJogo() {
    if (window.Som) window.Som.ativar();
    if (window.NostalMusica && window.Som && window.Som.prefs.musica) window.NostalMusica.ligar();
    syncAudioToggles();
    if (el('hero')) el('hero').classList.add('hidden');
    if (el('app')) el('app').classList.remove('hidden');
    isoHoje = hojeIso();
    desafioHoje = numeroDoDia(isoHoje);
    if (!modoArquivo) {
      rodadaN = desafioHoje;
      isoAtual = isoHoje;
    }
    garantirRodada(rodadaN, isoAtual);
    desenhar();
  }

  function entrarSemSom() {
    if (window.Som && window.Som.silenciar) window.Som.silenciar();
    iniciarJogo();
  }

  function comecarComSom() {
    if (window.Som && window.Som.ligarAudioInicial) window.Som.ligarAudioInicial();
    iniciarJogo();
    if (window.NostalMusica && window.Som) {
      window.NostalMusica.ligar();
      window.Som.tocar('ui-arcade');
    }
  }

  function toast(msg) {
    var t = el('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var kPos = 0;
  document.addEventListener('keydown', function (ev) {
    if (ev.keyCode === konami[kPos]) { kPos++; if (kPos === konami.length) { kPos = 0; modoCanal90(); } }
    else kPos = 0;
  });
  var crtAtivo = true;
  function modoCanal90() {
    crtAtivo = !crtAtivo;
    document.body.classList.toggle('sem-crt', !crtAtivo);
    if (el('btnCrt')) {
      el('btnCrt').setAttribute('aria-pressed', String(crtAtivo));
      el('btnCrt').innerHTML = crtAtivo ? '📺' : '🌙';
    }
    toast(crtAtivo ? '90s MODE ON' : '90s MODE OFF');
    if (window.Som) window.Som.tocar('ui-channel');
  }

  function init() {
    if (el('btnCrt')) el('btnCrt').addEventListener('click', modoCanal90);
    if (el('campo')) el('campo').addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); enviarResposta(); }
    });
    var logo = el('topoLogo');
    var cliques = 0, tLogo = null;
    if (logo) logo.addEventListener('click', function () {
      cliques++;
      clearTimeout(tLogo);
      tLogo = setTimeout(function () { cliques = 0; }, 1500);
      if (cliques >= 5) { cliques = 0; modoCanal90(); }
    });
    renderSemana();
    mostrarMuseu();
    if (el('btnComecar')) el('btnComecar').addEventListener('click', entrarSemSom);
    if (el('btnSom')) el('btnSom').addEventListener('click', comecarComSom);
    if (el('btnMusicaToggle')) el('btnMusicaToggle').addEventListener('click', function () {
      if (!window.Som) return;
      var on = window.Som.alternarMusica();
      this.setAttribute('aria-pressed', String(on));
      this.classList.toggle('ativo', on);
      toast(on ? 'Música ligada' : 'Música desligada');
    });
    if (el('btnSfxToggle')) el('btnSfxToggle').addEventListener('click', function () {
      if (!window.Som) return;
      var on = window.Som.alternarSfx();
      this.setAttribute('aria-pressed', String(on));
      this.classList.toggle('ativo', on);
      toast(on ? 'Efeitos ligados' : 'Efeitos desligados');
    });
    var heroMeta = el('heroMetaDia');
    if (heroMeta) heroMeta.textContent = 'Rodada #' + desafioHoje;
  }

  window.Jogo = {
    iniciarJogo: iniciarJogo,
    entrarSemSom: entrarSemSom,
    comecarComSom: comecarComSom,
    enviarResposta: enviarResposta,
    pularPista: pularPista,
    proximoDesafio: proximoDesafio,
    refazerDesafio: refazerDesafio,
    refazerRodada: refazerRodada,
    verResumo: verResumo,
    shareWhats: shareWhats,
    shareTelegram: shareTelegram,
    copiar: copiar,
    verArquivo: verArquivo,
    abrirArquivo: abrirArquivo,
    voltarHoje: voltarHoje,
    mostrarGaleria: mostrarGaleria,
    mostrarMuseu: mostrarMuseu,
    abrirMuseuItem: abrirMuseuItem,
    abrirMemoria: abrirMemoria,
    fecharModal: fecharModal,
    abrirSecao: abrirSecao,
    modoCanal90: modoCanal90,
    temFotoLivre: temFotoLivre,
    montarCartaoRevelacao: montarCartaoRevelacao
  };

  window.NostalgicaInit = init;
})();
