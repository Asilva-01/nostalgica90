/* ============================================================
   NOSTÁLGICA 90 — MOTOR DE CENAS (FASE 2I-E PILOTO)
   Renderiza uma MEMÓRIA dentro de um CONTEXTO/CENA, com objetos
   posicionados e interação. Não é um card genérico.
   ============================================================ */
window.Cenas = (function () {

  function carregar() {
    return window.Dados.carregar();
  }

  function cena(id) { return window.Dados.cenaPorId(id); }
  function memoria(id) { return window.Dados.memoriaPorId(id); }
  function memoriasDaCena(id) {
    var c = cena(id);
    if (!c) return [];
    return (c.objects || []).map(memoria).filter(Boolean);
  }

  /* Renderiza a cena inteira: fundo + objetos (memory SVGs embutidos). */
  function renderizarCena(id, container) {
    var c = cena(id);
    if (!c) return '<div class="cena-vazia">Cena não encontrada.</div>';
    var html = '<div class="cena" data-cena="' + id + '">';

    // fundo da cena (ilustração contextual)
    var visual = c.visual || {};
    if (visual.path) {
      html += '<div class="cena-fundo"><img src="' + visual.path + '" alt="' + (c.title || '') + '" loading="lazy"></div>';
    } else {
      html += '<div class="cena-fundo cena-fundo-cor" style="background:linear-gradient(160deg,#1a1440,#0a0f2a)"></div>';
    }

    // objetos (memórias) posicionados sobre o fundo, dentro da composição
    (c.objects || []).forEach(function (mid) {
      var m = memoria(mid);
      if (!m) return;
      html += objetoHtml(m, c);
    });

    html += '</div>';
    return html;
  }

  /* Um objeto = memória embutida inline (sem fundo próprio) + área de interação.
     scenePosition determina a posição dentro da cena; sceneLayer define a camada.
     Se hotspotOnly=true, a arte já está desenhada DENTRO do cenário e o objeto
     vira apenas uma área clicável invisível (sem arte sobreposta). */
  function objetoHtml(m, c) {
    var pos = m.scenePosition || {};
    var x = Math.round((pos.x || 0.5) * 100);
    var y = Math.round((pos.y || 0.5) * 100);
    var layer = m.sceneLayer || 'front';
    var z = pos.z != null ? pos.z : (layer === 'background' ? 1 : 2);
    var visual = m.visual || {};
    var hotspot = m.hotspotOnly === true;

    var html = '<button class="cena-objeto camada-' + layer + (hotspot ? ' hotspot' : '') + '" data-memoria="' + m.id + '" ' +
      'data-caminho="' + (visual.path || '') + '" ' +
      'style="left:' + x + '%;top:' + y + '%;z-index:' + z + '" ' +
      'aria-label="' + (m.title || '') + '">';

    if (hotspot) {
      // hotspot invisível: a memória já está integrada ao fundo da cena
      html += '<span class="cena-objeto-cor"></span>';
    } else if (visual.path) {
      // arte da memória embutida via <svg> inline (removido o fundo do card)
      html += '<span class="cena-objeto-svg" data-src="' + visual.path + '" aria-hidden="true"></span>';
    } else {
      html += '<div class="cena-objeto-cor"></div>';
    }

    // etiqueta (hover) para acessibilidade e contexto
    html += '<span class="cena-objeto-tag">' + (m.title || '') + '</span>';

    html += '</button>';
    return html;
  }

  /* Embute o memory SVG inline dentro do placeholder e remove o fundo do card.
     Retorna true se o SVG foi integrado. */
  function integrarObjeto(el) {
    if (!el) return false;
    var holder = el.querySelector('.cena-objeto-svg');
    if (!holder) return false;
    var src = holder.getAttribute('data-src');
    if (!src) return false;

    if (window.fetch && typeof window.fetch === 'function') {
      fetch(src).then(function (r) {
        if (!r.ok) return;
        return r.text();
      }).then(function (txt) {
        if (!txt || !window.DOMParser) return;
        var doc = new window.DOMParser().parseFromString(txt, 'image/svg+xml');
        var svg = doc.documentElement;
        if (!svg || svg.nodeName.toLowerCase() !== 'svg') return;
        limparFundo(svg);
        holder.innerHTML = '';
        holder.appendChild(svg);
      }).catch(function () {});
    }
    return true;
  }

  /* Remove o(s) elementos de fundo do card da memória (gradiente de fundo,
     faixas de parede/chão em tela cheia), deixando apenas o símbolo central. */
  function limparFundo(svg) {
    var gradientIds = [];
    var defsToCheck = svg.querySelector('defs');
    if (defsToCheck) {
      defsToCheck.querySelectorAll('linearGradient, radialGradient').forEach(function (g) {
        var id = g.getAttribute('id');
        if (id) gradientIds.push(id);
      });
    }
    var removes = [];
    svg.querySelectorAll('rect, path, circle, ellipse, polygon').forEach(function (n) {
      var fill = n.getAttribute('fill') || '';
      var isBgGrad = false;
      gradientIds.forEach(function (gid) {
        if (fill.indexOf('url(#' + gid + ')') !== -1) isBgGrad = true;
      });
      var w = parseFloat(n.getAttribute('width') || '0');
      var h = parseFloat(n.getAttribute('height') || '0');
      var x = parseFloat(n.getAttribute('x') || '0');
      // fundo: gradiente de tela cheia OU faixa de cor sólida em largura total (parede/chão)
      if ((isBgGrad && w >= 630) || (w >= 600 && (h < 300 || n.tagName.toLowerCase() !== 'circle'))) {
        removes.push(n);
      }
    });
    removes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    // remove <defs>/gradientes que só serviam ao fundo
    if (defsToCheck) {
      defsToCheck.querySelectorAll('linearGradient, radialGradient').forEach(function (g) {
        var id = g.getAttribute('id');
        if (!id) { if (g.parentNode) g.parentNode.removeChild(g); return; }
        var used = false;
        svg.querySelectorAll('[fill], [stroke]').forEach(function (n) {
          var f = n.getAttribute('fill') || '';
          var s = n.getAttribute('stroke') || '';
          if (f.indexOf('url(#' + id + ')') !== -1 || s.indexOf('url(#' + id + ')') !== -1) used = true;
        });
        if (!used && g.parentNode) g.parentNode.removeChild(g);
      });
    }
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
  }

  /* Card de detalhe de uma memória (modal de memória) */
  function detalheMemoria(m) {
    if (!m) return '';
    var visual = m.visual || {};
    var arte = visual.path
      ? '<img class="memoria-arte" src="' + visual.path + '" alt="' + (m.title || '') + '">'
      : '';
    return (
      '<div class="memoria-detalhe">' +
      arte +
      '<h3 class="memoria-titulo">' + (m.title || '') + '</h3>' +
      '<div class="memoria-meta">' + (m.yearRange || '') + ' · ' + (m.memoryType || '') + '</div>' +
      '<p class="memoria-contexto">' + (m.context || '') + '</p>' +
      '<p class="memoria-descricao">' + (m.description || '') + '</p>' +
      '<div class="memoria-gancho">💭 ' + (m.emotionalHook || '') + '</div>' +
      '<div class="memoria-relacionadas">' +
        (m.relatedMemories || []).map(function (r) { var rm = memoria(r); return rm ? '<span class="memoria-rel">' + (rm.title || r) + '</span>' : ''; }).join('') +
      '</div>' +
      '</div>'
    );
  }

  function tocarSom(m) {
    if (!m || !m.audio) return;
    var a = m.audio;
    if (a.type === 'contextual' && a.path) {
      // extrai nome do arquivo sem extensão
      var nome = (a.path.split('/').pop() || '').replace(/\.wav$/i, '');
      if (window.Som && window.Som.tocar) window.Som.tocar(nome);
    } else if (a.type === 'unavailable') {
      if (window.Som && window.Som.tocar) window.Som.tocar('ui-click');
    }
  }

  return {
    carregar: carregar,
    cena: cena,
    memoria: memoria,
    memoriasDaCena: memoriasDaCena,
    renderizarCena: renderizarCena,
    integrarObjetos: function (container) {
      if (!container) return;
      var els = container.querySelectorAll('.cena-objeto');
      els.forEach(integrarObjeto);
    },
    detalheMemoria: detalheMemoria,
    tocarSom: tocarSom
  };
})();