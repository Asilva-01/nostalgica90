/* ============================================================
   NOSTÁLGICA 90 — Lógica do jogo
   Preserva o sistema existente (desafio diário, streak, partida
   por dia, arquivo) e adiciona: pontos por pista, curiosidade,
   galeria com filtros, museu, hero, compartilhamento novo.
   ============================================================ */
(function () {
  /* ---------- referências ---------- */
  function el(id) { return document.getElementById(id); }

  /* ---------- datas / desafio diário (preservado) ---------- */
  function hojeData() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function hojeMeiaNoite() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  var REF_MS = new Date(2026, 8, 6).getTime();
  var REF_NO = 1;
  function numeroDesafioPara(ms) { return REF_NO + Math.round((ms - REF_MS) / 86400000); }
  var hojeMs = hojeMeiaNoite();
  var desafioHoje = numeroDesafioPara(hojeMs);
  var desafioAtual = desafioHoje;
  var modoArquivo = false;
  var FIM_ULTIMO_DIA = 7;

  var chave = function (k) { return "nostalgia90_" + k; };

  /* ---------- estado (preservado) ---------- */
  function carregarEstado() {
    var st = localStorage.getItem(chave("stats"));
    return st ? JSON.parse(st) : { seq: 0, max: 0, jogos: 0, acertos: 0, ultimaVitoria: null, ultimaPartida: null, pontos: 0, melhor: 0 };
  }
  var stats = carregarEstado();

  function diaAtualKey() { return "d" + desafioAtual; }
  function getPartida() { var p = localStorage.getItem(chave("partida_" + diaAtualKey())); return p ? JSON.parse(p) : null; }
  function salvarPartida(p) { localStorage.setItem(chave("partida_" + diaAtualKey()), JSON.stringify(p)); }
  var partida = getPartida();

  function entryAtual() { return window.Dados.item(desafioAtual); }

  function normalizar(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }
  function checarResposta(texto) {
    var e = entryAtual();
    var t = normalizar(texto);
    if (t === normalizar(e.resp)) return true;
    return (e.alias || []).some(function (a) { return t === normalizar(a); });
  }

  /* ---------- pontos por pista ---------- */
  var PONTOS = { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20, 6: 10 };
  function pontosDaPista(n) { return PONTOS[n] || 10; }

  function registrarVitoria(pistasUsadas) {
    var hoje = hojeData();
    var ganho = pontosDaPista(pistasUsadas);
    stats.jogos++;
    stats.acertos++;
    stats.pontos = (stats.pontos || 0) + ganho;
    if (ganho > (stats.melhor || 0)) stats.melhor = ganho;
    var ontem = new Date(Date.now() - 86400000);
    var ontemData = ontem.getFullYear() + "-" + String(ontem.getMonth() + 1).padStart(2, "0") + "-" + String(ontem.getDate()).padStart(2, "0");
    if (stats.ultimaVitoria === ontemData) stats.seq++;
    else if (stats.ultimaVitoria !== hoje) stats.seq = 1;
    stats.ultimaVitoria = hoje;
    stats.ultimaPartida = hoje;
    if (stats.seq > stats.max) stats.max = stats.seq;
    localStorage.setItem(chave("stats"), JSON.stringify(stats));
    renderEstatisticas();
    renderSemana();
  }

  function registrarDerrota() {
    var hoje = hojeData();
    stats.jogos++;
    stats.seq = 0;
    stats.ultimaPartida = hoje;
    localStorage.setItem(chave("stats"), JSON.stringify(stats));
    renderEstatisticas();
    renderSemana();
  }

  /* ---------- render ---------- */
  function renderEstatisticas() {
    el("stSeq").textContent = stats.seq;
    el("stMax").textContent = stats.max;
    el("stJog").textContent = stats.jogos;
    el("stVit").textContent = stats.acertos;
    el("stPts").textContent = stats.pontos || 0;
  }

  function renderSemana() {
    var box = el("semana");
    if (!box) return;
    var dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    var hoje = new Date();
    box.innerHTML = "";
    for (var i = 6; i >= 0; i--) {
      var d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
      var diaLabel = dias[d.getDay()];
      var ds = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      var classe = "dia";
      if (ds === hojeData()) classe += " hoje";
      else if (ds > hojeData()) classe += " futuro";
      else if (stats.ultimaVitoria === ds) classe += " feito";
      else classe += " futuro";
      box.innerHTML +=
        '<div class="' + classe + '"><b>' +
        (stats.ultimaVitoria === ds ? "✓" : (ds === hojeData() ? "?" : "·")) +
        '</b><small>' + diaLabel + '</small></div>';
    }
  }

  function catInfo(cat) {
    var emoji = window.Dados.CAT_EMOJI[cat] || "📼";
    var cor = (window.Dados.CAT_COR[cat] || ["#388e3c", "#0b4a1e"]);
    var classe = "cat-" + (cat || "CULTURA").replace(/\s+/g, "");
    return { emoji: emoji, cor: cor, classe: classe };
  }

  function renderChallengeImage(e) {
    var box = el("challengeImg");
    if (!box) return;
    var info = catInfo(e.cat);
    // FASE 2I-A: sistema de artes por categoria (Arte.gerar)
    var html;
    if (window.Arte && window.Arte.gerar) {
      html = window.Arte.gerar(e, info);
    } else {
      html = '<div class="art-fundo ' + (info.classe || "canal-tv") + '"></div>' +
        '<div class="tc-emoji">' + info.emoji + '</div>' +
        '<div class="art-scan"></div>';
    }
    box.innerHTML = html + '<div class="legenda">' + info.emoji + ' ' + (e.cat || "") + ' · ' + (e.ano || "") + '</div>';
  }

  function renderPistas() {
    var e = entryAtual();
    var box = el("listaPistas");
    box.innerHTML = "";
    for (var i = 1; i <= 6; i++) {
      var div = document.createElement("div");
      div.className = "pista-linha";
      div.id = "pista" + i;
      div.innerHTML = '<span class="n">CLUE 0' + i + '</span> <span class="txt"></span>';
      div.querySelector(".txt").textContent = e.pistas[i - 1] || "";
      box.appendChild(div);
    }
  }

  function revelarAte(n) {
    for (var i = 1; i <= 6; i++) {
      var el2 = el("pista" + i);
      if (!el2) continue;
      if (i <= n) {
        el2.classList.add("revelada");
        el2.classList.remove("ativa");
        if (i === n && !partidaFinalizada()) {
          el2.classList.add("ativa");
          // microinteração: pista recém-liberada
          el2.classList.remove("pista-nova");
          void el2.offsetWidth;
          el2.classList.add("pista-nova");
        }
      } else el2.classList.remove("revelada", "ativa");
    }
    var pb = el("pontosBarra");
    if (pb) pb.style.width = ((n - 1) / 5) * 100 + "%";
    var pp = el("pontosPossiveis");
    if (pp) pp.textContent = pontosDaPista(n);
  }

  function partidaFinalizada() { return partida && (partida.venceu === true || partida.perdeu === true); }

  function desenhar() {
    var e = entryAtual();
    // Desafio diário: sempre limpar partida finalizada ao re-entrar, permitindo jogar de novo
    if (!modoArquivo && partidaFinalizada()) {
      localStorage.removeItem(chave("partida_" + diaAtualKey()));
      partida = null;
    }
    renderEstatisticas();
    el("chaveDesafio").textContent = "DESAFIO #" + desafioAtual + (modoArquivo ? " (arquivo)" : "");
    // microinteração: entrada do desafio ("troca de programação")
    var secJogo = el("secJogo");
    if (secJogo) {
      var base = ["cat-TV","cat-GAMES","cat-CINEMA","cat-MÚSICA","cat-BRINQUEDOS","cat-TECNOLOGIA","cat-CULTURA","cat-c","venceu"];
      for (var i = 0; i < base.length; i++) secJogo.classList.remove(base[i]);
      secJogo.classList.add(catInfo(e.cat).classe);
      // reinicia animação de entrada
      secJogo.classList.remove("desafio-render");
      void secJogo.offsetWidth;
      secJogo.classList.add("desafio-render", "entra");
    }
    // atualiza pill de categoria
    var pill = el("catPill");
    if (pill) {
      var info = catInfo(e.cat);
      pill.className = "cat-pill " + info.classe;
      pill.style.background = "";
      pill.innerHTML = '<span class="pill-emoji">' + info.emoji + '</span> ' + (e.cat || "");
    }
    renderChallengeImage(e);
    if (partidaFinalizada()) { mostrarFim(); return; }
    renderPistas();
    revelarAte(partida ? partida.pista : 1);
    var campo = el("campo");
    if (campo) {
      campo.value = "";
      if (!modoArquivo) campo.focus();
    }
    var respMsg = el("respMsg");
    if (respMsg) { respMsg.textContent = ""; respMsg.className = "feedback"; }
    var areaJogo = el("areaJogo");
    if (areaJogo) areaJogo.classList.remove("hidden");
    var areaFim = el("areaFim");
    if (areaFim) areaFim.classList.add("hidden");
    var cb = el("curiosidadeBox");
    if (cb) cb.classList.add("hidden");
  }

  /* ---------- ações ---------- */
  function enviarResposta() {
    if (partidaFinalizada()) return;
    var campo = el("campo");
    var texto = campo.value.trim();
    if (!texto) { toast("Digite uma resposta primeiro!"); return; }
    if (!partida) partida = { pista: 1, tentativas: [], venceu: false, perdeu: false, num: desafioAtual };
    partida.tentativas.push(texto);

    if (checarResposta(texto)) {
      partida.venceu = true;
      salvarPartida(partida);
      registrarVitoria(partida.pista);
      window.Som.tocar('ui-success');
      window.Efeitos.confete();
      // microinteração: card "venceu" + pulso nos pontos
      var sj = el("secJogo");
      if (sj) sj.classList.add("venceu");
      pulsarValor("stPts");
      pulsarValor("stSeq");
      mostrarFim();
    } else {
      var msg = el("respMsg");
      msg.textContent = "❌ NÃO FOI DESSA VEZ! " + (partida.pista < 6 ? "Quer outra pista?" : "Essa era a última pista!");
      msg.className = "feedback errada";
      window.Som.tocar('ui-error');
      window.Efeitos.glitch(msg);
      salvarPartida(partida);
      campo.value = "";
      campo.focus();
    }
  }

  /* microinteração: pulso breve em um valor de placar */
  function pulsarValor(id) {
    var v = el(id);
    if (!v) return;
    v.classList.remove("pulso");
    void v.offsetWidth;
    v.classList.add("pulso");
  }

  function pularPista() {
    if (partidaFinalizada()) return;
    if (!partida) partida = { pista: 1, tentativas: [], venceu: false, perdeu: false, num: desafioAtual };
    var msg = el("respMsg");
    msg.textContent = "";
    msg.className = "feedback";
    if (partida.pista >= 6) {
      partida.perdeu = true;
      salvarPartida(partida);
      registrarDerrota();
      window.Som.tocar('ui-error');
      mostrarFim();
      return;
    }
    partida.pista++;
    salvarPartida(partida);
    window.Som.tocar('ui-reveal');
    window.Efeitos.trocaCanal(el("listaPistas"));
    revelarAte(partida.pista);
    var campo = el("campo");
    if (campo) campo.focus();
  }

  /* ---------- tela final ---------- */
  function emojiGrid(pistasUsadas) {
    var arr = [];
    for (var i = 1; i <= 6; i++) {
      if (i < pistasUsadas) arr.push("🟨");
      else if (i === pistasUsadas) arr.push("🟩");
      else arr.push("⬛");
    }
    return arr.join("");
  }

  var URL_PUBLICA = "https://asilva-01.github.io/nostalgica90/";

  function urlCompartilhar() {
    return URL_PUBLICA;
  }

  function corpoCompartilhamento(win) {
    var e = entryAtual();
    var pts = pontosDaPista(partida.pista);
    var seq = stats.seq || 0;
    var memoria = (e.emoji ? e.emoji + " " : "") + (e.cat || "") + (e.ano ? " \u00b7 " + e.ano : "");
    var head = "📺 NOST\u00c1LGICA 90\n";
    var grid = win ? emojiGrid(partida.pista) : emojiGrid(7).replace("🟩", "\u274c");
    var chamada = "Joga o de hoje e me responde. Ser\u00e1 que voc\u00ea \u00e9 da \u00e9poca?";
    if (win) {
      return head +
        "Eu acertei o desafio de hoje dos anos 90!\n" +
        memoria + "\n" +
        "🎯 " + pts + " pts \u00b7 sequ\u00eancia " + seq + "\n" +
        grid + "\n" +
        chamada;
    }
    return head +
      "Eu joguei o desafio de hoje dos anos 90 e n\u00e3o acertei.\n" +
      memoria + "\n" +
      "🔥 sequ\u00eancia " + seq + "\n" +
      grid + "\n" +
      chamada;
  }

  function textoCompartilhamento(win) {
    return corpoCompartilhamento(win) + "\n👉 " + urlCompartilhar();
  }

  function mostrarFim() {
    var e = entryAtual();
    var area = el("areaJogo");
    var fim = el("areaFim");
    area.classList.add("hidden");
    fim.classList.remove("hidden");
    var win = partida.venceu;

    var lista = el("listaPistas");
    for (var i = 1; i <= 6; i++) {
      var l = el("pista" + i);
      if (!l) continue;
      l.classList.remove("ativa");
      l.classList.add("revelada");
      if (win && i === partida.pista) l.classList.add("vencida");
      if (!win) l.classList.add("perdida");
    }
    revelarAte(6);

    var grid = win ? emojiGrid(partida.pista) : emojiGrid(7).replace("🟩", "❌");
    var arquivoCta = modoArquivo ? '' : (
      '<button type="button" class="fim-arquivo" onclick="Jogo.verArquivo();var _a=document.getElementById(\'secArquivo\');if(_a)_a.scrollIntoView({behavior:\'smooth\',block:\'start\'});">' +
      '<span class="fim-arquivo-titulo">\ud83d\udcfc Sua mem\u00f3ria entrou no Arquivo</span>' +
      '<span class="fim-arquivo-sub">Ver desafios anteriores</span>' +
      '</button>'
    );
    fim.innerHTML =
      '<div class="fim-titulo">' + (win ? "🎉 MEMÓRIA DESBLOQUEADA!" : "📺 NÃO FOI DESSA VEZ!") + '</div>' +
      '<div class="resposta-final">' + e.emoji + ' ' + e.resp + '</div>' +
      '<div class="grid-share" id="gridShare">' + grid + '</div>' +
      '<div class="feedback ' + (win ? "certa" : "errada") + '">' +
      (win ? "VOCÊ LEMBRA! +" + pontosDaPista(partida.pista) + " PONTOS" : "A resposta era acima. Amanhã tem outro!") +
      '</div>' +
      '<div class="curiosidade curiosidade-destaque" id="curiosidadeBox"><div class="tag">💭 VOCÊ LEMBRA DISSO?</div><p>' + (e.curiosidade || "") + '</p></div>' +
      '<div class="fim-acoes">' +
      '<button class="btn btn-whats btn-fim-primario" onclick="Jogo.shareWhats()">📲 COMPARTILHAR</button>' +
      '<div class="fim-acoes-secundarias">' +
      '<button class="btn btn-telegram btn-fim-secundario" onclick="Jogo.shareTelegram()">✈️ Telegram</button>' +
      '<button class="btn btn-azul btn-fim-secundario" onclick="Jogo.copiar()">📋 Copiar</button>' +
      '</div>' +
      arquivoCta +
      '</div>';

    if (!modoArquivo && win) el("voltarAmanha").classList.remove("hidden");
    else el("voltarAmanha").classList.add("hidden");
    window.scrollTo(0, 0);
  }

  /* ---------- compartilhar ---------- */
  function abrirShare(texto, url) {
    if (navigator.share) {
      return navigator.share({ title: "Nost\u00e1lgica 90", text: texto, url: url }).catch(function (err) {
        if (err && err.name === "AbortError") return;
        window.open("https://wa.me/?text=" + encodeURIComponent(texto + "\n👉 " + url), "_blank");
      });
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(texto + "\n👉 " + url), "_blank");
  }
  function shareWhats() {
    var win = !!(partida && partida.venceu);
    var url = urlCompartilhar();
    abrirShare(corpoCompartilhamento(win), url);
  }
  function shareTelegram() {
    var win = !!(partida && partida.venceu);
    var url = urlCompartilhar();
    window.open("https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(corpoCompartilhamento(win)), "_blank");
  }
  function copiar() {
    var win = !!(partida && partida.venceu);
    var texto = textoCompartilhamento(win);
    function ok() { toast("Resultado copiado! Cola no WhatsApp 😉"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok).catch(function () { copiarFallback(texto); });
    } else copiarFallback(texto);
  }
  function copiarFallback(texto) {
    var ta = document.createElement("textarea");
    ta.value = texto; ta.style.position = "fixed"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Resultado copiado! 😉"); } catch (e) { toast("N\u00e3o consegui copiar. Use o WhatsApp!"); }
    document.body.removeChild(ta);
  }

  /* ---------- arquivo / galeria ---------- */
  function verArquivo() {
    abrirSecao("secArquivo", true);
    mostrarGaleria("TODOS");
  }

  function mostrarGaleria(filtro) {
    var box = el("galeria");
    if (!box) return;
    box.innerHTML = "";
    // Arquivo permanente: #1..hoje, sem janela de 7 dias.
    // Teto em Dados.total() evita repetir #1/#2 quando o calendario passar de 56.
    var min = REF_NO;
    var total = (window.Dados && window.Dados.total) ? window.Dados.total() : 56;
    var maxN = Math.min(desafioHoje, total);
    var idx = 0;
    for (var n = min; n <= maxN; n++) {
      var e = window.Dados.item(n);
      if (filtro !== "TODOS" && e.cat !== filtro) continue;
      var r = localStorage.getItem(chave("partida_d" + n));
      var rj = r ? JSON.parse(r) : null;
      var encerrado = !!(rj && (rj.venceu || rj.perdeu));
      var res = "";
      var cls = "";
      var info = catInfo(e.cat);
      if (rj) {
        if (rj.venceu) { res = "\u2b50 " + rj.pista + "/6"; cls = "certa"; }
        else if (rj.perdeu) { res = "\u274c"; cls = "nao"; }
      }
      var visual;
      if (encerrado && window.Arte && window.Arte.gerar) {
        visual = '<div class="gal-thumb" aria-hidden="true">' + window.Arte.gerar(e, info) + '</div>';
      } else {
        visual = '<div class="gal-capa" aria-hidden="true">' + (info.emoji || e.emoji || "\ud83d\udcfa") + '</div>';
      }
      box.innerHTML +=
        '<div class="gal-card ' + info.classe + (encerrado ? " liberado" : " fechado") + '" style="animation-delay:' + (idx * 40) + 'ms" onclick="Jogo.abrirArquivo(' + n + ')">' +
        '<div class="num">#' + n + '</div>' +
        visual +
        '<div class="cat">' + (e.cat || "") + '</div>' +
        '<div class="res ' + cls + '">' + res + '</div>' +
        '</div>';
      idx++;
    }
    // filtros
    var fb = el("filtros");
    if (fb) {
      fb.innerHTML = '<button class="filtro' + (filtro === "TODOS" ? " ativo" : "") + '" onclick="Jogo.mostrarGaleria(\'TODOS\')">TODOS</button>';
      window.Dados.CATEGORIAS.forEach(function (c) {
        var cl = "filtro" + (filtro === c ? " ativo" : "") + " " + catInfo(c).classe;
        fb.innerHTML += '<button class="' + cl + '" onclick="Jogo.mostrarGaleria(\'' + c + '\')">' + (window.Dados.CAT_EMOJI[c] || "") + ' ' + c + '</button>';
      });
    }
  }

  function abrirArquivo(n) {
    desafioAtual = n;
    modoArquivo = true;
    partida = getPartida();
    if (!partida) partida = null;
    window.scrollTo(0, 0);
    document.getElementById("secArquivo").classList.add("hidden");
    document.getElementById("secJogo").classList.remove("hidden");
    el("arquivoNav").classList.remove("hidden");
    desenhar();
  }

  function voltarHoje() {
    desafioAtual = desafioHoje;
    modoArquivo = false;
    partida = getPartida();
    el("arquivoNav").classList.add("hidden");
    desenhar();
  }

  /* ---------- seções colapsáveis ---------- */
  function abrirSecao(id, abrir) {
    var s = el(id);
    if (!s) return;
    if (abrir === undefined) abrir = s.classList.contains("secao-aberta") ? false : true;
    if (abrir) s.classList.add("secao-aberta");
    else s.classList.remove("secao-aberta");
  }

  /* ---------- museu ---------- */
  function mostrarMuseu(cat) {
    var box = el("museuItens");
    var dados = window.Dados.listaMuseu();
    if (!box) return;
    box.innerHTML = "";
    var idx = 0;
    dados.forEach(function (g) {
      if (cat && g.cat !== cat) return;
      var emojiItem = g.emoji || "📼";
      g.itens.forEach(function (it) {
        box.innerHTML +=
          '<div class="museu-item ' + catInfo(g.cat).classe + '" style="animation-delay:' + (idx * 45) + 'ms" onclick="Jogo.abrirMuseuItem(\'' + g.cat + '\',\'' + it.nome.replace(/'/g, "\\'") + '\')">' +
          '<div class="e">' + (it.emoji || emojiItem) + '</div><div class="t">' + it.nome + '</div></div>';
        idx++;
      });
    });
  }

    /* áudio temático por categoria do museu */
  function somMuseu(cat) {
    var sons = {
      'MÚSICA': 'ui-arcade', 'GAMES': 'ui-arcade', 'TECNOLOGIA': 'ui-boot',
      'VHS': 'ui-vhs', 'CULTURA': 'ui-vhs', 'TV': 'ui-channel',
      'CINEMA': 'ui-reveal', 'RÁDIO': 'ui-click', 'BRINQUEDOS': 'ui-success'
    };
    return sons[cat] || 'ui-reveal';
  }

  function abrirMuseuItem(cat, nome) {
    var dados = window.Dados.listaMuseu();
    var alvo = null;
    var emojiCat = "📼";
    dados.forEach(function (g) {
      if (g.cat === cat) emojiCat = g.emoji || emojiCat;
      g.itens.forEach(function (it) { if (g.cat === cat && it.nome === nome) alvo = it; });
    });
    if (!alvo) return;
    var m = el("modal");
    // arte semântica (SVG por item) se disponível; senão emoji
    var arte = (window.MuseuArtes && window.MuseuArtes.artePorItem) ? window.MuseuArtes.artePorItem(alvo) : null;
    var arteHtml = arte ? arte : ('<div class="arte">' + (alvo.emoji || emojiCat) + '</div>');
    el("modalCorpo").innerHTML =
      arteHtml +
      '<h3>' + alvo.nome + '</h3>' +
      '<div class="ano">' + (alvo.ano || "") + ' · ' + cat + '</div>' +
      '<p>' + (alvo.desc || "") + '</p>' +
      '<div class="curio">💭 ' + (alvo.curiosidade || "") + '</div>' +
      '<div class="lembra">VOCÊ LEMBRA DISSO?</div>';
    m.classList.remove("hidden");
    // associação semântica de áudio: MÚSICA toca trilha temática; demais tocam som da categoria
    if (cat === 'MÚSICA') {
      window.Som.ativar();
      if (window.NostalMusica) window.NostalMusica.definirtema('novela');
      if (window.NostalMusica) window.NostalMusica.ligar();
      window.Som.prefs.musica = true;
    } else {
      window.Som.tocar(somMuseu(cat));
    }
  }
  function fecharModal() {
    el("modal").classList.add("hidden");
    // ao fechar, restaura trilha do jogo se estava tocando música
    if (window.NostalMusica && window.Som.prefs.musica) window.NostalMusica.definirtema('desafio');
  }

  /* abre o detalhe de uma memória (piloto 2I-E) no modal */
  function abrirMemoria(m) {
    if (!m) return;
    var modal = el("modal");
    var corpo = el("modalCorpo");
    if (corpo && window.Cenas && window.Cenas.detalheMemoria) {
      corpo.innerHTML = window.Cenas.detalheMemoria(m);
      modal.classList.remove("hidden");
      // som contextual da memória
      if (window.Cenas.tocarSom) window.Cenas.tocarSom(m);
    }
  }

  /* ---------- hero / loading ---------- */
  function iniciarJogo() {
    window.Som.ativar();
    if (window.NostalMusica && window.Som.prefs.musica) NostalMusica.ligar();
    el("hero").classList.add("hidden");
    el("app").classList.remove("hidden");
    desenhar();
  }

  function comecarComSom() {
    iniciarJogo();
    // liga a música se ainda não estava
    if (window.NostalMusica) { window.Som.prefs.musica = true; NostalMusica.ligar(); window.Som.tocar('ui-arcade'); }
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = el("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- easter egg: Konami ---------- */
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var kPos = 0;
  document.addEventListener("keydown", function (ev) {
    if (ev.keyCode === konami[kPos]) { kPos++; if (kPos === konami.length) { kPos = 0; modoCanal90(); } }
    else kPos = 0;
  });
  var crtAtivo = true;
  function modoCanal90() {
    crtAtivo = !crtAtivo;
    document.body.classList.toggle("sem-crt", !crtAtivo);
    el("btnCrt").setAttribute("aria-pressed", String(crtAtivo));
    el("btnCrt").innerHTML = crtAtivo ? "📺" : "🌙";
    toast(crtAtivo ? "📺 90s MODE ON" : "🌙 90s MODE OFF");
    window.Som.tocar('ui-channel');
  }

  /* ---------- init ---------- */
  function init() {
    // toggle CRT
    el("btnCrt").addEventListener("click", modoCanal90);
    // enter
    el("campo").addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { ev.preventDefault(); enviarResposta(); }
    });
    // logo easter egg (5 cliques)
    var logo = el("topoLogo");
    var cliques = 0, tLogo = null;
    logo.addEventListener("click", function () {
      cliques++;
      clearTimeout(tLogo);
      tLogo = setTimeout(function () { cliques = 0; }, 1500);
      if (cliques >= 5) { cliques = 0; modoCanal90(); }
    });
    renderSemana();
    mostrarMuseu();
    // hero actions
    el("btnComecar").addEventListener("click", iniciarJogo);
    el("btnSom").addEventListener("click", comecarComSom);
    // módulos de áudio na UI
    el("btnMusicaToggle").addEventListener("click", function () {
      var on = window.Som.alternarMusica();
      this.setAttribute("aria-pressed", String(on));
      this.innerHTML = on ? "🎵" : "🎵";
      this.classList.toggle("ativo", on);
      toast(on ? "🎵 Música ligada" : "🎵 Música desligada");
    });
    el("btnSfxToggle").addEventListener("click", function () {
      var on = window.Som.alternarSfx();
      this.setAttribute("aria-pressed", String(on));
      this.classList.toggle("ativo", on);
      toast(on ? "🔔 Efeitos ligados" : "🔔 Efeitos desligados");
    });
  }

  window.Jogo = {
    iniciarJogo: iniciarJogo,
    comecarComSom: comecarComSom,
    enviarResposta: enviarResposta,
    pularPista: pularPista,
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
    modoCanal90: modoCanal90
  };

  window.NostalgicaInit = init;
})();