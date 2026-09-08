/* ============================================================
   NOSTÁLGICA 90 — SISTEMA DE ARTES DOS DESAFIOS (FASE 2I-A)
   Motor procedural de artes com IDENTIDADE por categoria.
   NÃO copia material protegido: compõe objetos/paletas/texturas
   originais inspirados na época. Funciona dentro da TV CRT.

   Estrutura de cada arte:
     FUNDO   → textura/ambiente da categoria
     ELEMENTO→ símbolo central reconhecível em 1s no celular
     FAIXA   → identificação (categoria · ano)
     SELO    → badge da categoria
   A resposta do desafio NUNCA aparece (evita spoiler).
   Se e.image existir, exibe a imagem real no lugar.
   ============================================================ */
window.Arte = (function () {

  /* ---------- identidade por categoria ---------- */
  var CATES = {
    TV: {
      selo: "PROGRAMA", moto: "AO VIVO",
      fundo: "grade-programacao",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="10" y="12" width="96" height="66" rx="6" fill="#0a0f2a" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="16" y="18" width="84" height="54" fill="#0a0f2a"/>' +
          '<g stroke="#4a5480" stroke-width="2" opacity="0.7">' +
          '<line x1="16" y1="26" x2="100" y2="26"/><line x1="16" y1="34" x2="100" y2="34"/>' +
          '<line x1="16" y1="42" x2="100" y2="42"/><line x1="16" y1="50" x2="100" y2="50"/></g>' +
          '<rect x="16" y="54" width="84" height="18" fill="rgba(255,210,30,0.12)"/>' +
          '<text x="20" y="67" font-family="VT323" font-size="11" fill="#ffe600">● NO AR</text>' +
          '<circle cx="138" cy="20" r="7" fill="#ff2d95"/><circle cx="150" cy="20" r="7" fill="#2ecf5b"/>' +
          '<rect x="122" y="34" width="28" height="8" rx="3" fill="#8f93a8" stroke="#e6e9ff" stroke-width="2"/>' +
          '</svg>';
      }
    },
    GAMES: {
      selo: "GAME", moto: "INSERT COIN",
      fundo: "pixel-arcade",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="30" y="16" width="52" height="36" rx="4" fill="#7d3cff" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="38" y="24" width="36" height="20" fill="#3a0fa8"/>' +
          '<text x="46" y="38" font-family="VT323" font-size="12" fill="#ffe600">GAME</text>' +
          '<circle cx="98" cy="34" r="12" fill="#2f6fed" stroke="#e6e9ff" stroke-width="3"/>' +
          '<circle cx="118" cy="34" r="12" fill="#ff2d95" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="30" y="62" width="40" height="10" rx="3" fill="#2a2544" stroke="#e6e9ff" stroke-width="2"/>' +
          '<rect x="120" y="60" width="26" height="14" rx="3" fill="#2a2544" stroke="#e6e9ff" stroke-width="2"/>' +
          '</svg>';
      }
    },
    CINEMA: {
      selo: "FILME", moto: "LOCADORA",
      fundo: "poster-vhs",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="26" y="10" width="46" height="70" rx="3" fill="#2f6fed" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="32" y="18" width="34" height="18" rx="2" fill="#123d8f"/>' +
          '<rect x="32" y="42" width="34" height="6" rx="2" fill="#ffe600"/>' +
          '<rect x="32" y="52" width="24" height="6" rx="2" fill="#e6e9ff" opacity="0.7"/>' +
          '<rect x="88" y="14" width="50" height="62" rx="3" fill="#e6293c" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="96" y="22" width="34" height="22" rx="2" fill="#8e0015"/>' +
          '<rect x="96" y="50" width="26" height="6" rx="2" fill="#ffe600"/>' +
          '</svg>';
      }
    },
    MUSICA: {
      selo: "MÚSICA", moto: "PLAY",
      fundo: "cd-radiante",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<circle cx="55" cy="45" r="28" fill="#dfe6ff" stroke="#e6e9ff" stroke-width="3"/>' +
          '<circle cx="55" cy="45" r="12" fill="#4a5480"/>' +
          '<path d="M20 62 L40 62 L48 30 L62 70 L70 48 L78 60 L92 60" fill="none" stroke="#ffe600" stroke-width="4" stroke-linejoin="round"/>' +
          '<circle cx="118" cy="38" r="20" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="3"/>' +
          '<circle cx="118" cy="38" r="8" fill="#a31358"/>' +
          '</svg>';
      }
    },
    BRINQUEDOS: {
      selo: "BRINQUEDO", moto: "CATÁLOGO",
      fundo: "embalagem-brinquedo",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="30" y="20" width="44" height="44" rx="6" fill="#ff7a1a" stroke="#e6e9ff" stroke-width="3"/>' +
          '<circle cx="52" cy="42" r="10" fill="#fff6e6"/>' +
          '<rect x="26" y="18" width="52" height="10" rx="3" fill="#a34600"/>' +
          '<rect x="92" y="28" width="40" height="30" rx="8" fill="#2ecf5b" stroke="#e6e9ff" stroke-width="3"/>' +
          '<circle cx="112" cy="43" r="8" fill="#ffe600"/>' +
          '<rect x="92" y="66" width="40" height="8" rx="3" fill="#0f7a33"/>' +
          '</svg>';
      }
    },
    TECNOLOGIA: {
      selo: "TEC", moto: "486 DX",
      fundo: "monitor-crt",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="18" y="14" width="92" height="60" rx="6" fill="#2a2e46" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="26" y="22" width="76" height="44" rx="2" fill="#0a0f2a"/>' +
          '<rect x="26" y="22" width="30" height="14" fill="#123d8f"/>' +
          '<line x1="26" y1="40" x2="102" y2="40" stroke="#2f6fed" stroke-width="2"/>' +
          '<line x1="26" y1="48" x2="80" y2="48" stroke="#4a5480" stroke-width="2"/>' +
          '<rect x="60" y="74" width="8" height="8" fill="#2a2e46" stroke="#e6e9ff" stroke-width="2"/>' +
          '<rect x="118" y="20" width="30" height="22" rx="2" fill="#2a2544" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="124" y="26" width="18" height="10" fill="#4a5480"/>' +
          '</svg>';
      }
    },
    CULTURA: {
      selo: "CULTURA", moto: "BANCA",
      fundo: "revista-banca",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="28" y="16" width="40" height="56" rx="2" fill="#ffe600" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="32" y="22" width="32" height="12" fill="#e6293c"/>' +
          '<rect x="32" y="40" width="26" height="4" rx="1" fill="#241d3f"/>' +
          '<rect x="32" y="48" width="32" height="4" rx="1" fill="#241d3f" opacity="0.6"/>' +
          '<rect x="86" y="22" width="46" height="44" rx="2" fill="#2ecf5b" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="92" y="30" width="34" height="14" fill="#0f7a33"/>' +
          '<circle cx="109" cy="56" r="8" fill="#ffe600"/>' +
          '</svg>';
      }
    }
  };

  function infoCategoria(cat) {
    return CATES[cat] || CATES.CULTURA;
  }

  function gerar(e, info) {
    var c = infoCategoria(e.cat);
    var fallbackHtml = (
      '<div class="art-fundo ' + c.fundo + '"></div>' +
      c.elem(e, info) +
      '<div class="art-faixa"><span class="art-selo">' + c.selo + '</span><span class="art-cat">' + (e.cat || "") + '</span><span class="art-ano">' + (e.ano || "") + '</span></div>' +
      '<div class="art-moto">' + c.moto + '</div>' +
      '<div class="art-scan"></div>'
    );
    // se houver imagem real, usa (sem spoiler no alt); fallback procedural se falhar
    if (e.image) {
      return '<img class="img-real" src="' + e.image + '" alt="" loading="lazy" data-fallback="' + _b64(fallbackHtml) + '" onerror="Arte.mostrarFallback(this)">';
    }
    return fallbackHtml;
  }

  function _b64(s) {
    if (window.btoa) return window.btoa(unescape(encodeURIComponent(s)));
    return s;
  }

  function mostrarFallback(img) {
    var fb = img.getAttribute('data-fallback');
    if (!fb) return;
    var html;
    try { html = decodeURIComponent(escape(atob(fb))); } catch (e) { html = fb; }
    img.outerHTML = html;
  }

  return { gerar: gerar, infoCategoria: infoCategoria, mostrarFallback: mostrarFallback };
})();