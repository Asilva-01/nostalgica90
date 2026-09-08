/* ============================================================
   NOSTÁLGICA 90 — ARTES SEMÂNTICAS DO MUSEU (FASE 2I-B.4)
   Cada memória tem uma arte SVG original que representa o item
   (não apenas emoji). Associação: TÍTULO + IMAGEM + CATEGORIA.
   Nada é copiado — formas/paletas originais inspiradas na época.
   ============================================================ */
window.MuseuArtes = (function () {

  function wrap(body, c1, c2) {
    return '<svg class="mus-elem" viewBox="0 0 160 100" role="presentation">' +
      '<defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="160" height="100" rx="8" fill="url(#mg)"/>' + body + '</svg>';
  }

  var ARTES = {
    /* ---- BRINQUEDOS ---- */
    'tamagotchi': function () {
      return wrap('<ellipse cx="80" cy="50" rx="30" ry="38" fill="#ff7a1a" stroke="#e6e9ff" stroke-width="3"/>' +
        '<ellipse cx="80" cy="38" rx="16" ry="18" fill="#241d3f"/>' +
        '<ellipse cx="80" cy="38" rx="10" ry="12" fill="#2ecf5b"/>' +
        '<circle cx="76" cy="36" r="2" fill="#0a0f2a"/><circle cx="84" cy="36" r="2" fill="#0a0f2a"/>' +
        '<circle cx="70" cy="66" r="3" fill="#e6e9ff"/><circle cx="80" cy="70" r="3" fill="#e6e9ff"/><circle cx="90" cy="66" r="3" fill="#e6e9ff"/>', '#3a1a08', '#1a0a02');
    },
    'tazo': function () {
      return wrap('<circle cx="80" cy="50" r="30" fill="#ffe600" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="80" cy="50" r="22" fill="none" stroke="#e6293c" stroke-width="2" stroke-dasharray="4 3"/>' +
        '<path d="M62 42 Q80 30 98 42 L92 62 Q80 70 68 62 Z" fill="#2f6fed"/>' +
        '<circle cx="80" cy="50" r="4" fill="#241d3f"/>', '#333a08', '#1a1a02');
    },
    'polly-pocket': function () {
      return wrap('<rect x="50" y="30" width="60" height="46" rx="14" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="58" y="38" width="44" height="30" rx="8" fill="#a31358"/>' +
        '<circle cx="70" cy="52" r="4" fill="#ffe600"/><circle cx="80" cy="52" r="4" fill="#ffe600"/><circle cx="90" cy="52" r="4" fill="#ffe600"/>', '#2a0a1e', '#1a060f');
    },
    'barbie': function () {
      return wrap('<path d="M70 30 Q80 20 90 30 L92 50 Q80 58 68 50 Z" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="3"/>' +
        '<path d="M68 50 L60 86 M92 50 L100 86" stroke="#e6e9ff" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="80" cy="34" r="9" fill="#ffe9c2" stroke="#e6e9ff" stroke-width="2"/>', '#2a0a1e', '#1a060f');
    },
    /* ---- TV ---- */
    'tv-colosso': function () {
      return wrap('<rect x="40" y="20" width="80" height="60" rx="6" fill="#3a3f5c" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="48" y="28" width="64" height="44" rx="3" fill="#0a0f2a"/>' +
        '<ellipse cx="80" cy="50" rx="16" ry="14" fill="#c9a06b"/>' +
        '<ellipse cx="74" cy="46" r="3" fill="#241d3f"/><ellipse cx="86" cy="46" r="3" fill="#241d3f"/>' +
        '<path d="M74 56 Q80 62 86 56" stroke="#241d3f" stroke-width="2" fill="none"/>' +
        '<ellipse cx="66" cy="56" rx="4" ry="6" fill="#a34600"/><ellipse cx="94" cy="56" rx="4" ry="6" fill="#a34600"/>', '#2a1440', '#0a0f2a');
    },
    'sitio-do-picapau-amarelo': function () {
      return wrap('<circle cx="80" cy="50" r="28" fill="#2ecf5b" stroke="#e6e9ff" stroke-width="3"/>' +
        '<path d="M60 50 Q80 30 100 50" stroke="#0f7a33" stroke-width="3" fill="none"/>' +
        '<circle cx="70" cy="44" r="3" fill="#241d3f"/><circle cx="90" cy="44" r="3" fill="#241d3f"/>' +
        '<path d="M72 58 Q80 66 88 58" stroke="#241d3f" stroke-width="2" fill="none"/>', '#0a3315', '#051708');
    },
    'angel-mix': function () {
      return wrap('<circle cx="80" cy="40" r="16" fill="#ffe9c2" stroke="#e6e9ff" stroke-width="3"/>' +
        '<path d="M64 40 Q60 20 80 20 Q100 20 96 40" fill="#ffd21e"/>' +
        '<path d="M60 60 L80 86 L100 60" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="74" cy="48" r="2" fill="#241d3f"/><circle cx="86" cy="48" r="2" fill="#241d3f"/>', '#2a1440', '#1a0a28');
    },
    'band-kids': function () {
      return wrap('<rect x="45" y="30" width="70" height="44" rx="6" fill="#2f6fed" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="53" y="38" width="54" height="28" rx="4" fill="#123d8f"/>' +
        '<text x="58" y="58" font-family="VT323" font-size="16" fill="#ffe600">KIDS</text>', '#0a1a3a', '#050a1a');
    },
    /* ---- GAMES ---- */
    'super-nintendo': function () {
      return wrap('<rect x="30" y="30" width="80" height="40" rx="6" fill="#8f93a8" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="38" y="38" width="14" height="12" rx="3" fill="#241d3f"/><rect x="60" y="38" width="14" height="12" rx="3" fill="#241d3f"/>' +
        '<circle cx="94" cy="44" r="6" fill="#e6293c"/><circle cx="106" cy="44" r="6" fill="#2ecf5b"/>' +
        '<circle cx="52" cy="56" r="8" fill="#241d3f"/>', '#2a2e46', '#14141f');
    },
    'mega-drive': function () {
      return wrap('<rect x="34" y="32" width="92" height="36" rx="6" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="58" cy="50" r="8" fill="#241d3f"/><rect x="74" y="42" width="22" height="16" rx="3" fill="#3a3f5c"/>' +
        '<circle cx="106" cy="46" r="5" fill="#e6293c"/><circle cx="118" cy="46" r="5" fill="#2f6fed"/>', '#0f0f1a', '#08080f');
    },
    'game-boy': function () {
      return wrap('<rect x="52" y="18" width="56" height="72" rx="8" fill="#8f93a8" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="60" y="28" width="40" height="34" rx="3" fill="#0a0f2a"/>' +
        '<circle cx="70" cy="74" r="6" fill="#241d3f"/><circle cx="92" cy="74" r="6" fill="#e6293c"/>', '#2a2e46', '#14141f');
    },
    'master-system': function () {
      return wrap('<rect x="34" y="32" width="92" height="36" rx="6" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="56" cy="50" r="7" fill="#241d3f"/><rect x="72" y="40" width="24" height="20" rx="3" fill="#0a0f2a"/>' +
        '<text x="102" y="55" font-family="VT323" font-size="12" fill="#ffe600">MS</text>', '#0f0f1a', '#08080f');
    },
    'neo-geo': function () {
      return wrap('<rect x="40" y="30" width="80" height="40" rx="6" fill="#5a5480" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="70" cy="50" r="10" fill="#ffe600"/><circle cx="70" cy="50" r="4" fill="#241d3f"/>' +
        '<rect x="88" y="42" width="20" height="16" rx="3" fill="#241d3f"/>', '#2a2440', '#14100f');
    },
    /* ---- MÚSICA ---- */
    'mamonas-assassinas': function () {
      return wrap('<circle cx="80" cy="46" r="18" fill="#ffe600" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="80" cy="46" r="8" fill="#241d3f"/>' +
        '<path d="M64 60 L80 74 L96 60" stroke="#e6293c" stroke-width="4" fill="none"/>' +
        '<path d="M56 80 L104 80" stroke="#e6293c" stroke-width="4"/>', '#3a1a08', '#1a0a02');
    },
    'e-o-tchan': function () {
      return wrap('<circle cx="80" cy="34" r="12" fill="#ffe9c2" stroke="#e6e9ff" stroke-width="2"/>' +
        '<path d="M70 46 L90 46 L96 78 L64 78 Z" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="2"/>' +
        '<circle cx="76" cy="62" r="2" fill="#241d3f"/><circle cx="86" cy="62" r="2" fill="#241d3f"/>' +
        '<path d="M76 70 Q80 74 84 70" stroke="#241d3f" stroke-width="2" fill="none"/>', '#2a0a1e', '#1a060f');
    },
    'so-pra-contrariar': function () {
      return wrap('<rect x="56" y="26" width="48" height="48" rx="6" fill="#2f6fed" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="80" cy="46" r="12" fill="#0a0f2a"/>' +
        '<rect x="60" y="64" width="40" height="6" rx="3" fill="#ffe600"/>', '#0a1a3a', '#050a1a');
    },
    'balao-magico': function () {
      return wrap('<ellipse cx="80" cy="42" rx="20" ry="24" fill="#ff4d9d" stroke="#e6e9ff" stroke-width="3"/>' +
        '<path d="M70 66 L80 74 L90 66" stroke="#241d3f" stroke-width="3" fill="none"/>' +
        '<path d="M60 20 Q70 12 80 18 Q90 12 100 20" stroke="#ffe600" stroke-width="3" fill="none"/>', '#2a0a1e', '#1a060f');
    },
    /* ---- CINEMA ---- */
    'titanic': function () {
      return wrap('<path d="M40 60 L80 40 L120 60" fill="#8f93a8" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="60" y="48" width="40" height="8" rx="2" fill="#3a3f5c"/>' +
        '<rect x="40" y="60" width="80" height="6" fill="#123d8f"/>' +
        '<polygon points="118,44 126,30 130,40" fill="#cfe8ff"/>', '#0a1a3a', '#050a1a');
    },
    'jurassic-park': function () {
      return wrap('<ellipse cx="80" cy="58" rx="26" ry="12" fill="#2ecf5b" stroke="#e6e9ff" stroke-width="3"/>' +
        '<path d="M70 50 L70 30 M74 48 L82 26" stroke="#0f7a33" stroke-width="3"/>' +
        '<circle cx="70" cy="30" r="3" fill="#ffe600"/><circle cx="82" cy="26" r="3" fill="#ffe600"/>' +
        '<circle cx="66" cy="52" r="2" fill="#241d3f"/>', '#0a3315', '#051708');
    },
    'o-rei-leao': function () {
      return wrap('<circle cx="80" cy="44" r="22" fill="#ffd21e" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="72" cy="42" r="3" fill="#241d3f"/><circle cx="88" cy="42" r="3" fill="#241d3f"/>' +
        '<path d="M72 52 Q80 60 88 52" stroke="#241d3f" stroke-width="2" fill="none"/>' +
        '<path d="M58 34 L66 26 M102 34 L94 26" stroke="#a34600" stroke-width="3"/>', '#332a08', '#1a1204');
    },
    'godzilla-1998': function () {
      return wrap('<path d="M60 60 Q80 30 100 60 L96 72 L80 68 L64 72 Z" fill="#2ecf5b" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="68" cy="48" r="3" fill="#ffe600"/><circle cx="92" cy="48" r="3" fill="#ffe600"/>' +
        '<path d="M50 60 L42 54 M110 60 L118 54" stroke="#0f7a33" stroke-width="3"/>', '#0a3315', '#051708');
    },
    /* ---- TECNOLOGIA ---- */
    'windows-95': function () {
      return wrap('<rect x="50" y="24" width="60" height="52" rx="6" fill="#2a2e46" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="58" y="32" width="44" height="36" rx="2" fill="#0a0f2a"/>' +
        '<rect x="58" y="32" width="20" height="14" fill="#123d8f"/>' +
        '<rect x="62" y="36" width="5" height="5" fill="#e6293c"/><rect x="69" y="36" width="5" height="5" fill="#2ecf5b"/>' +
        '<rect x="62" y="43" width="5" height="5" fill="#2f6fed"/><rect x="69" y="43" width="5" height="5" fill="#ffe600"/>', '#0a2430', '#051012');
    },
    'internet-discada': function () {
      return wrap('<rect x="52" y="26" width="56" height="48" rx="6" fill="#2a2544" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="60" y="34" width="40" height="24" rx="2" fill="#0a0f2a"/>' +
        '<path d="M64 40 Q72 34 80 40 Q88 46 96 40" stroke="#2f6fed" stroke-width="2" fill="none"/>' +
        '<rect x="60" y="62" width="40" height="6" rx="2" fill="#3a3f5c"/>', '#14100f', '#080606');
    },
    'disquete': function () {
      return wrap('<rect x="56" y="22" width="48" height="56" rx="4" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="66" y="30" width="28" height="10" rx="2" fill="#e6e9ff"/>' +
        '<rect x="66" y="44" width="28" height="24" rx="2" fill="#5a5480"/>' +
        '<rect x="72" y="54" width="16" height="6" fill="#0a0f2a"/>', '#14100f', '#080606');
    },
    'cd-rom': function () {
      return wrap('<circle cx="80" cy="50" r="30" fill="#dfe6ff" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="80" cy="50" r="12" fill="#4a5480"/>' +
        '<circle cx="80" cy="50" r="4" fill="#0a0f2a"/>' +
        '<path d="M60 42 Q70 36 80 42 Q90 48 100 42" stroke="#4a5480" stroke-width="2" fill="none"/>', '#2a2e46', '#14141f');
    },
    /* ---- VHS ---- */
    'locadora': function () {
      return wrap('<rect x="48" y="26" width="64" height="48" rx="4" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="56" y="34" width="48" height="16" rx="2" fill="#ffe9c2"/>' +
        '<rect x="56" y="56" width="16" height="8" fill="#e6293c"/><rect x="76" y="56" width="16" height="8" fill="#2f6fed"/>', '#14100f', '#080606');
    },
    'videocassete': function () {
      return wrap('<rect x="46" y="30" width="68" height="40" rx="5" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="66" cy="50" r="10" fill="#0a0f2a" stroke="#3a3f5c" stroke-width="2"/>' +
        '<circle cx="94" cy="50" r="10" fill="#0a0f2a" stroke="#3a3f5c" stroke-width="2"/>', '#14100f', '#080606');
    },
    'fita-vhs': function () {
      return wrap('<rect x="46" y="28" width="68" height="44" rx="5" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="54" y="36" width="52" height="18" rx="2" fill="#ffe9c2"/>' +
        '<circle cx="66" cy="62" r="7" fill="#0a0f2a"/><circle cx="94" cy="62" r="7" fill="#0a0f2a"/>', '#14100f', '#080606');
    },
    /* ---- RÁDIO ---- */
    'radio-fm': function () {
      return wrap('<rect x="46" y="30" width="68" height="40" rx="8" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="54" y="38" width="30" height="12" rx="2" fill="#0a0f2a"/>' +
        '<circle cx="96" cy="44" r="8" fill="#ffe600"/><circle cx="96" cy="44" r="3" fill="#241d3f"/>' +
        '<rect x="54" y="56" width="12" height="6" rx="2" fill="#3a3f5c"/>', '#14100f', '#080606');
    },
    'fita-cassete': function () {
      return wrap('<rect x="46" y="32" width="68" height="36" rx="4" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="64" cy="50" r="9" fill="#0a0f2a" stroke="#3a3f5c" stroke-width="2"/>' +
        '<circle cx="96" cy="50" r="9" fill="#0a0f2a" stroke="#3a3f5c" stroke-width="2"/>' +
        '<rect x="56" y="40" width="48" height="4" fill="#ffe9c2"/>', '#14100f', '#080606');
    },
    'radio-a-pilha': function () {
      return wrap('<rect x="46" y="34" width="68" height="30" rx="8" fill="#241d3f" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="66" cy="49" r="6" fill="#ffe600"/><circle cx="82" cy="49" r="6" fill="#2f6fed"/>' +
        '<rect x="94" y="42" width="12" height="14" rx="2" fill="#3a3f5c"/>', '#14100f', '#080606');
    },
    /* ---- CULTURA ---- */
    'senna': function () {
      return wrap('<ellipse cx="80" cy="54" rx="26" ry="8" fill="#e6293c" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="64" y="34" width="12" height="16" fill="#241d3f"/>' +
        '<circle cx="70" cy="32" r="5" fill="#ffe600"/><circle cx="80" cy="30" r="5" fill="#ffe600"/>', '#2a0a0a', '#1a0404');
    },
    'turma-da-monica': function () {
      return wrap('<circle cx="80" cy="48" r="24" fill="#ffe9c2" stroke="#e6e9ff" stroke-width="3"/>' +
        '<circle cx="72" cy="46" r="3" fill="#241d3f"/><circle cx="88" cy="46" r="3" fill="#241d3f"/>' +
        '<path d="M72 56 Q80 62 88 56" stroke="#241d3f" stroke-width="2" fill="none"/>' +
        '<path d="M56 42 Q52 28 64 30 M104 42 Q108 28 96 30" stroke="#241d3f" stroke-width="3"/>', '#2a2e46', '#14141f');
    },
    'castelo-ra-tim-bum': function () {
      return wrap('<path d="M56 80 L56 46 L80 30 L104 46 L104 80 Z" fill="#7d3cff" stroke="#e6e9ff" stroke-width="3"/>' +
        '<rect x="72" y="58" width="16" height="22" fill="#0a0f2a"/>' +
        '<circle cx="80" cy="40" r="6" fill="#ffe600"/>', '#241044', '#120822');
    },
    'kibon': function () {
      return wrap('<rect x="60" y="26" width="40" height="10" rx="3" fill="#2f6fed"/>' +
        '<path d="M64 36 L96 36 L92 80 L68 80 Z" fill="#fff6e6" stroke="#e6e9ff" stroke-width="2"/>' +
        '<circle cx="80" cy="60" r="7" fill="#ff4d9d"/>', '#0a1a3a', '#050a1a');
    },
    'bombril': function () {
      return wrap('<rect x="56" y="26" width="48" height="48" rx="8" fill="#8f93a8" stroke="#e6e9ff" stroke-width="3"/>' +
        '<path d="M64 40 Q80 34 96 40 M64 52 Q80 46 96 52 M64 64 Q80 58 96 64" stroke="#0a0f2a" stroke-width="2" fill="none"/>', '#2a2e46', '#14141f');
    }
  };

  function artePorId(id) {
    if (ARTES[id]) return ARTES[id]();
    return null;
  }

  function artePorItem(it) {
    return artePorId(it && it.id);
  }

  return { artePorId: artePorId, artePorItem: artePorItem };
})();