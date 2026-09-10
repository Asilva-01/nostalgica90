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

  /* Objeto do desafio, nao a categoria. Sem nome da resposta. */
  var OBJETOS = {
    tazo: {
      selo: "COLEÇÃO", moto: "RECREIO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<ellipse cx="52" cy="50" rx="24" ry="24" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="74" cy="44" rx="26" ry="26" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="98" cy="50" rx="24" ry="24" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="90" cy="46" r="2.5" fill="#241d3f"/><circle cx="106" cy="46" r="2.5" fill="#241d3f"/>' +
          '<path d="M90 58 Q99 64 110 54" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="118" y="18" width="26" height="42" rx="3" fill="#e6293c" stroke="#241d3f" stroke-width="2" transform="rotate(14 131 42)"/>' +
          '</svg>';
      }
    },
    tamagotchi: {
      selo: "BIP", moto: "OVO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<ellipse cx="80" cy="46" rx="34" ry="40" fill="#f4c7d8" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="58" y="28" width="44" height="28" rx="4" fill="#9fe7a2" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="74" cy="40" r="3" fill="#241d3f"/><circle cx="86" cy="40" r="3" fill="#241d3f"/>' +
          '<path d="M72 48 Q80 52 88 48" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="62" cy="72" r="5" fill="#241d3f"/><circle cx="80" cy="74" r="5" fill="#241d3f"/><circle cx="98" cy="72" r="5" fill="#241d3f"/>' +
          '</svg>';
      }
    },
    "super-nintendo": {
      selo: "CARTUCHO", moto: "CONSOLE",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="28" y="28" width="104" height="36" rx="10" fill="#cfc8be" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="40" y="38" width="22" height="16" rx="3" fill="#241d3f"/>' +
          '<circle cx="92" cy="46" r="5" fill="#2f6fed"/><circle cx="106" cy="46" r="5" fill="#e6293c"/>' +
          '<circle cx="99" cy="56" r="4" fill="#2ecf5b"/><circle cx="114" cy="54" r="4" fill="#ffe600"/>' +
          '<rect x="48" y="18" width="18" height="16" rx="2" fill="#6b5cff" stroke="#241d3f" stroke-width="2"/>' +
          '</svg>';
      }
    },
    "fita-vhs": {
      selo: "FITA", moto: "REBOBINA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="24" y="22" width="112" height="52" rx="4" fill="#1c1a24" stroke="#e6e9ff" stroke-width="3"/>' +
          '<rect x="36" y="30" width="34" height="22" rx="2" fill="#d9e2ff"/>' +
          '<rect x="90" y="30" width="34" height="22" rx="2" fill="#d9e2ff"/>' +
          '<circle cx="53" cy="41" r="7" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="107" cy="41" r="7" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="62" y="58" width="36" height="8" rx="2" fill="#ffe600"/>' +
          '</svg>';
      }
    },
    discman: {
      selo: "CD", moto: "PLAY",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="36" y="22" width="72" height="52" rx="8" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="72" cy="48" r="16" fill="#dfe6ff" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="72" cy="48" r="5" fill="#241d3f"/>' +
          '<path d="M108 40 C128 28 136 58 118 62" fill="none" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="122" cy="34" r="6" fill="#241d3f"/><circle cx="128" cy="62" r="6" fill="#241d3f"/>' +
          '</svg>';
      }
    },
    walkman: {
      selo: "FITA", moto: "FONE",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="48" y="24" width="48" height="44" rx="6" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="56" y="32" width="32" height="16" rx="2" fill="#d9e2ff"/>' +
          '<circle cx="64" cy="40" r="4" fill="#241d3f"/><circle cx="80" cy="40" r="4" fill="#241d3f"/>' +
          '<path d="M40 36 C28 36 24 58 36 62" fill="none" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M120 36 C132 36 136 58 124 62" fill="none" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="30" y="58" width="14" height="10" rx="3" fill="#241d3f"/>' +
          '<rect x="116" y="58" width="14" height="10" rx="3" fill="#241d3f"/>' +
          '</svg>';
      }
    },
    kibon: {
      selo: "CAMINHÃO", moto: "SORVETE",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="88" y="14" width="14" height="24" rx="3" fill="#ff7a1a" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="88" y="14" width="14" height="8" rx="3" fill="#ffe600"/>' +
          '<rect x="32" y="34" width="96" height="30" rx="6" fill="#f7f1e4" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="40" y="40" width="20" height="12" rx="2" fill="#7ec8ff" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="78" y="40" width="28" height="14" rx="2" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="32" y="56" width="96" height="8" fill="#ff2d95"/>' +
          '<circle cx="54" cy="70" r="8" fill="#241d3f"/>' +
          '<circle cx="112" cy="70" r="8" fill="#241d3f"/>' +
          '<circle cx="54" cy="70" r="3" fill="#e6e9ff"/>' +
          '<circle cx="112" cy="70" r="3" fill="#e6e9ff"/>' +
          '</svg>';
      }
    },
    "tv-colosso": {
      selo: "FANTOCHE", moto: "BONECO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="76" y="64" width="8" height="14" rx="2" fill="#241d3f"/>' +
          '<ellipse cx="52" cy="34" rx="12" ry="18" fill="#c9844a" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="108" cy="34" rx="12" ry="18" fill="#c9844a" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="80" cy="42" rx="30" ry="24" fill="#c9844a" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="80" cy="52" rx="12" ry="8" fill="#e8b888" stroke="#241d3f" stroke-width="3"/>' +
          '</svg>';
      }
    },
    eliana: {
      selo: "MICROFONE", moto: "AUDITÓRIO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="70" y="16" width="18" height="34" rx="8" fill="#e6e9ff" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="74" y="48" width="10" height="16" fill="#8f93a8"/>' +
          '<rect x="62" y="62" width="34" height="8" rx="3" fill="#241d3f"/>' +
          '<circle cx="40" cy="36" r="8" fill="#ff2d95"/><circle cx="120" cy="32" r="7" fill="#ffe600"/>' +
          '<circle cx="128" cy="52" r="6" fill="#2ecf5b"/>' +
          '</svg>';
      }
    },
    bombril: {
      selo: "ESPONJA", moto: "COZINHA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<path d="M14 50 C22 36 48 32 74 38 C92 30 122 34 146 44 C154 52 148 62 122 66 C96 76 58 70 36 60 C18 58 8 58 14 50 Z" fill="#c8ced8" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M14 50 C22 36 48 32 74 38 C68 46 80 54 70 66 C52 72 22 62 14 50 Z" fill="#ffe14a" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M74 36 C66 46 82 56 68 66" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<ellipse cx="40" cy="50" rx="9" ry="4" fill="#f0c400"/>' +
          '<g fill="none" stroke="#4e5564" stroke-width="1.7" stroke-linecap="round">' +
          '<path d="M88 40 C100 32 114 42 128 36"/>' +
          '<path d="M84 48 C98 42 112 54 130 46"/>' +
          '<path d="M90 56 C102 50 116 62 124 54"/>' +
          '<path d="M96 44 C110 48 118 40 132 50"/>' +
          '<path d="M86 60 C104 58 116 68 120 58"/>' +
          '<path d="M108 38 C116 34 122 46 118 40"/>' +
          '</g>' +
          '<g fill="none" stroke="#5c6270" stroke-width="1.5" stroke-linecap="round">' +
          '<path d="M138 40 C154 32 158 42 146 48"/>' +
          '<path d="M142 50 C156 48 156 60 140 62"/>' +
          '<path d="M128 34 C148 26 152 36 136 40"/>' +
          '<path d="M132 64 C146 72 150 62 138 58"/>' +
          '<path d="M148 44 C158 46 156 54 148 56"/>' +
          '</g>' +
          '</svg>';
      }
    },
    xuxa: {
      selo: "VARINHA", moto: "AUDITÓRIO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<polygon points="14,16 30,16 26,34 18,34" fill="#ffe600" opacity="0.16"/>' +
          '<polygon points="146,16 130,16 134,34 142,34" fill="#ff2d95" opacity="0.14"/>' +
          '<rect x="10" y="6" width="16" height="8" rx="2" fill="#241d3f"/>' +
          '<rect x="134" y="6" width="16" height="8" rx="3" fill="#241d3f"/>' +
          '<circle cx="18" cy="10" r="2" fill="#ffe600"/>' +
          '<circle cx="142" cy="10" r="2" fill="#ff2d95"/>' +
          '<rect x="18" y="58" width="40" height="12" rx="5" fill="#ff2d95" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="24" y="70" width="5" height="10" fill="#241d3f"/>' +
          '<rect x="46" y="70" width="5" height="10" fill="#241d3f"/>' +
          '<rect x="102" y="58" width="40" height="12" rx="5" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="108" y="70" width="5" height="10" fill="#241d3f"/>' +
          '<rect x="128" y="70" width="5" height="10" fill="#241d3f"/>' +
          '<rect x="76" y="30" width="7" height="36" rx="3" fill="#e6e9ff" stroke="#241d3f" stroke-width="2" transform="rotate(16 80 48)"/>' +
          '<polygon points="80,8 85,20 99,20 88,28 92,42 80,34 66,42 70,28 59,20 73,20" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>' +
          '</svg>';
      }
    },
    "super-trunfo": {
      selo: "MAÇO", moto: "CARTAS",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<g transform="rotate(-14 70 48)">' +
          '<rect x="48" y="18" width="34" height="52" rx="3" fill="#f4efe4" stroke="#241d3f" stroke-width="2"/>' +
          '</g>' +
          '<g transform="rotate(10 96 48)">' +
          '<rect x="78" y="18" width="34" height="52" rx="3" fill="#efe6d4" stroke="#241d3f" stroke-width="2"/>' +
          '</g>' +
          '<rect x="62" y="16" width="36" height="56" rx="3" fill="#fff8ea" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="62" y="28" width="9" height="8" fill="#e6293c"/>' +
          '<rect x="71" y="28" width="9" height="8" fill="#ffe600"/>' +
          '<rect x="80" y="28" width="9" height="8" fill="#2ecf5b"/>' +
          '<rect x="89" y="28" width="9" height="8" fill="#2f6fed"/>' +
          '<rect x="68" y="42" width="24" height="4" rx="1" fill="#cfc6b4"/>' +
          '<rect x="68" y="50" width="18" height="4" rx="1" fill="#cfc6b4"/>' +
          '<rect x="68" y="58" width="22" height="4" rx="1" fill="#cfc6b4"/>' +
          '</svg>';
      }
    },
    "game-boy": {
      selo: "TELA", moto: "BOLSO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="58" y="8" width="44" height="74" rx="6" fill="#cfc8be" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="66" y="16" width="28" height="22" rx="2" fill="#9fe7a2" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="70" y="48" width="14" height="6" fill="#241d3f"/>' +
          '<rect x="74" y="44" width="6" height="14" fill="#241d3f"/>' +
          '<circle cx="92" cy="52" r="5" fill="#e6293c" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="100" cy="62" r="5" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/>' +
          '</svg>';
      }
    },
    chaves: {
      selo: "BARRIL", moto: "MADEIRA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<path d="M52 28 C46 42 46 64 52 78 Q80 88 108 78 C114 64 114 42 108 28 Z" fill="#c9a06a" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M48 40 Q80 48 112 40" fill="none" stroke="#5c6570" stroke-width="3"/>' +
          '<path d="M47 56 Q80 64 113 56" fill="none" stroke="#5c6570" stroke-width="3"/>' +
          '<path d="M50 70 Q80 78 110 70" fill="none" stroke="#5c6570" stroke-width="3"/>' +
          '<ellipse cx="80" cy="26" rx="30" ry="12" fill="#e2c9a0" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="80" cy="26" rx="16" ry="6" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '</svg>';
      }
    },
    "copa-do-mundo": {
      selo: "TAÇA", moto: "FINAL",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<ellipse cx="80" cy="84" rx="26" ry="5" fill="#d4a84b" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="62" y="72" width="36" height="10" rx="2" fill="#e8c84a" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="74" y="52" width="12" height="22" rx="2" fill="#e8c84a" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M56 54 Q80 36 104 54 L96 60 Q80 48 64 60 Z" fill="#e8c84a" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="80" cy="26" r="16" fill="#e8c84a" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="80" cy="26" rx="6" ry="15" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<path d="M66 24 Q80 18 94 24" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<path d="M54 78 Q80 70 106 78" fill="none" stroke="#2ecf5b" stroke-width="2.5"/>' +
          '<path d="M56 82 Q80 76 104 82" fill="none" stroke="#ffe600" stroke-width="2"/>' +
          '</svg>';
      }
    },
    "dragon-ball-z": {
      selo: "ESFERA", moto: "ESTRELAS",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<circle cx="80" cy="46" r="34" fill="#ff8a1a" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="80" cy="46" r="30" fill="#ffb03a" opacity="0.35"/>' +
          '<polygon points="80.0,24.5 81.9,29.4 87.1,29.7 83.0,33.0 84.4,38.1 80.0,35.2 75.6,38.1 77.0,33.0 72.9,29.7 78.1,29.4" fill="#e6293c" stroke="#241d3f" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<polygon points="66.0,38.5 67.9,43.4 73.1,43.7 69.0,47.0 70.4,52.1 66.0,49.2 61.6,52.1 63.0,47.0 58.9,43.7 64.1,43.4" fill="#e6293c" stroke="#241d3f" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<polygon points="94.0,38.5 95.9,43.4 101.1,43.7 97.0,47.0 98.4,52.1 94.0,49.2 89.6,52.1 91.0,47.0 86.9,43.7 92.1,43.4" fill="#e6293c" stroke="#241d3f" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<polygon points="80.0,52.5 81.9,57.4 87.1,57.7 83.0,61.0 84.4,66.1 80.0,63.2 75.6,66.1 77.0,61.0 72.9,57.7 78.1,57.4" fill="#e6293c" stroke="#241d3f" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<ellipse cx="66" cy="32" rx="10" ry="5" fill="#fff6e0" opacity="0.55"/>' +
          '<ellipse cx="60" cy="40" rx="4" ry="2.5" fill="#fff6e0" opacity="0.4"/>' +
          '</svg>';
      }
    },
    senna: {
      selo: "CAPACETE", moto: "PISTA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<g transform="rotate(-8 80 48)">' +
          '<path d="M46 50 C46 26 58 10 82 8 C108 10 122 28 120 52 C118 70 100 82 80 84 C58 82 48 68 46 50 Z" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M52 38 C64 30 100 28 114 40 C112 52 98 58 80 57 C60 56 52 48 52 38 Z" fill="#1a1530" stroke="#241d3f" stroke-width="2.5"/>' +
          '<path d="M56 64 C72 70 92 70 106 64" fill="none" stroke="#241d3f" stroke-width="2.5" stroke-linecap="round"/>' +
          '</g>' +
          '</svg>';
      }
    },
    "castelo-ra-tim-bum": {
      selo: "CASTELO", moto: "TORRES",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="28" y="40" width="28" height="40" fill="#b89ad9" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="104" y="40" width="28" height="40" fill="#b89ad9" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="52" y="34" width="56" height="46" fill="#c9b0e8" stroke="#241d3f" stroke-width="3"/>' +
          '<polygon points="28,40 42,18 56,40" fill="#6b3fb8" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<polygon points="104,40 118,18 132,40" fill="#6b3fb8" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<polygon points="52,34 80,8 108,34" fill="#7d3cff" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M64 52 Q64 44 72 44 Q80 44 80 52 L80 62 L64 62 Z" fill="#1a1530" stroke="#241d3f" stroke-width="2"/>' +
          '<path d="M88 52 Q88 44 96 44 Q104 44 104 52 L104 62 L88 62 Z" fill="#1a1530" stroke="#241d3f" stroke-width="2"/>' +
          '</svg>';
      }
    },
    "cavaleiros-do-zodiaco": {
      selo: "ELMO", moto: "ARMADURA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<polygon points="80,6 88,30 72,30" fill="#e8c84a" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M52 34 L68 28 L80 30 L92 28 L108 34 L112 52 L104 74 L88 82 L80 84 L72 82 L56 74 L48 52 Z" fill="#e8c84a" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M58 48 L72 44 L72 56 L60 58 Z" fill="#1a1530" stroke="#241d3f" stroke-width="2"/>' +
          '<path d="M88 44 L102 48 L100 58 L88 56 Z" fill="#1a1530" stroke="#241d3f" stroke-width="2"/>' +
          '<path d="M70 66 L80 70 L90 66" fill="none" stroke="#241d3f" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M48 52 L40 58 L44 70 L56 74" fill="#d4a84b" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M112 52 L120 58 L116 70 L104 74" fill="#d4a84b" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '</svg>';
      }
    },
    pokemon: {
      selo: "BOLA", moto: "BOTÃO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<circle cx="80" cy="46" r="34" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M46 46 A34 34 0 0 1 114 46 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="46" y="42" width="68" height="8" fill="#241d3f"/>' +
          '<circle cx="80" cy="46" r="11" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="80" cy="46" r="5" fill="#241d3f"/>' +
          '</svg>';
      }
    },
    "turma-da-monica": {
      selo: "PELÚCIA", moto: "COELHO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<ellipse cx="58" cy="28" rx="10" ry="26" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="102" cy="28" rx="10" ry="26" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="58" cy="28" rx="4" ry="14" fill="#ff9db8"/>' +
          '<ellipse cx="102" cy="28" rx="4" ry="14" fill="#ff9db8"/>' +
          '<ellipse cx="80" cy="58" rx="28" ry="24" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="80" cy="42" r="20" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="62" cy="62" rx="7" ry="5" fill="#1e5ad4" stroke="#241d3f" stroke-width="2"/>' +
          '<ellipse cx="98" cy="62" rx="7" ry="5" fill="#1e5ad4" stroke="#241d3f" stroke-width="2"/>' +
          '<ellipse cx="70" cy="78" rx="8" ry="5" fill="#2f6fed" stroke="#241d3f" stroke-width="2.5"/>' +
          '<ellipse cx="90" cy="78" rx="8" ry="5" fill="#2f6fed" stroke="#241d3f" stroke-width="2.5"/>' +
          '</svg>';
      }
    },
    "silvio-santos": {
      selo: "MICRO", moto: "PALCO",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<ellipse cx="80" cy="84" rx="30" ry="6" fill="#5c6570" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="76" y="46" width="8" height="38" rx="2" fill="#8f93a8" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="72" y="58" width="16" height="5" rx="1" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>' +
          '<g transform="rotate(28 96 28)">' +
          '<ellipse cx="96" cy="28" rx="18" ry="13" fill="#dfe6ff" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="96" cy="28" rx="11" ry="7" fill="none" stroke="#241d3f" stroke-width="2"/>' +
          '<line x1="88" y1="24" x2="104" y2="24" stroke="#241d3f" stroke-width="1.5"/>' +
          '<line x1="88" y1="28" x2="104" y2="28" stroke="#241d3f" stroke-width="1.5"/>' +
          '<line x1="88" y1="32" x2="104" y2="32" stroke="#241d3f" stroke-width="1.5"/>' +
          '<rect x="90" y="40" width="12" height="12" rx="2" fill="#8f93a8" stroke="#241d3f" stroke-width="2"/>' +
          '</g>' +
          '</svg>';
      }
    },
    "street-fighter-ii": {
      selo: "ARCADE", moto: "MANCHE",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="18" y="20" width="124" height="54" rx="10" fill="#2a2544" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="48" cy="52" r="8" fill="#1a1530" stroke="#241d3f" stroke-width="2"/>' +
          '<rect x="45" y="30" width="6" height="22" rx="2" fill="#8f93a8" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="48" cy="26" r="11" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="88" cy="40" r="8" fill="#e6293c" stroke="#241d3f" stroke-width="2.5"/>' +
          '<circle cx="108" cy="40" r="8" fill="#ffe600" stroke="#241d3f" stroke-width="2.5"/>' +
          '<circle cx="128" cy="40" r="8" fill="#2f6fed" stroke="#241d3f" stroke-width="2.5"/>' +
          '<circle cx="88" cy="58" r="8" fill="#2ecf5b" stroke="#241d3f" stroke-width="2.5"/>' +
          '<circle cx="108" cy="58" r="8" fill="#ff7a1a" stroke="#241d3f" stroke-width="2.5"/>' +
          '<circle cx="128" cy="58" r="8" fill="#ff2d95" stroke="#241d3f" stroke-width="2.5"/>' +
          '</svg>';
      }
    },
    "formula-1": {
      selo: "CARRO", moto: "PISTA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<ellipse cx="42" cy="68" rx="14" ry="14" fill="#1a1530" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="118" cy="68" rx="14" ry="14" fill="#1a1530" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="42" cy="68" rx="6" ry="6" fill="#8f93a8"/>' +
          '<ellipse cx="118" cy="68" rx="6" ry="6" fill="#8f93a8"/>' +
          '<path d="M28 58 L48 52 L78 48 L110 50 L132 56 L128 64 L100 62 L70 60 L46 62 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M20 60 L28 58 L30 64 L18 66 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="124" y="36" width="22" height="6" rx="1" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="132" y="30" width="6" height="28" rx="1" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>' +
          '<ellipse cx="72" cy="50" rx="12" ry="8" fill="#1a1530" stroke="#241d3f" stroke-width="2.5"/>' +
          '<path d="M14 66 L34 64 L36 70 L12 72 Z" fill="#f5f0e8" stroke="#241d3f" stroke-width="2.5" stroke-linejoin="round"/>' +
          '</svg>';
      }
    },
    titanic: {
      selo: "NAVIO", moto: "FUNIS",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<path d="M12 68 L28 58 L140 58 L152 68 L148 74 L16 74 Z" fill="#1a1530" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="36" y="42" width="96" height="16" rx="2" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>' +
          '<rect x="48" y="34" width="18" height="10" fill="#f5f0e8" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="72" y="34" width="18" height="10" fill="#f5f0e8" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="96" y="34" width="18" height="10" fill="#f5f0e8" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="120" y="34" width="14" height="10" fill="#f5f0e8" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="52" y="18" width="10" height="18" rx="1" fill="#e6293c" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="70" y="18" width="10" height="18" rx="1" fill="#e6293c" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="88" y="18" width="10" height="18" rx="1" fill="#e6293c" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="106" y="18" width="10" height="18" rx="1" fill="#e6293c" stroke="#241d3f" stroke-width="2.5"/>' +
          '<path d="M24 58 L28 48 L36 48 L36 58 Z" fill="#f5f0e8" stroke="#241d3f" stroke-width="2.5" stroke-linejoin="round"/>' +
          '</svg>';
      }
    },
  };

  function objetoDo(e) {
    if (!e || !e.slug) return null;
    return OBJETOS[e.slug] || null;
  }
  function infoCategoria(cat) {
    return CATES[cat] || CATES.CULTURA;
  }

  function gerar(e, info) {
    var c = infoCategoria(e.cat);
    var obj = objetoDo(e);
    var selo = obj ? obj.selo : c.selo;
    var moto = obj ? obj.moto : c.moto;
    var elem = obj ? obj.elem(e, info) : c.elem(e, info);
    var fallbackHtml = (
      '<div class="art-fundo ' + c.fundo + '"></div>' +
      elem +
      '<div class="art-faixa"><span class="art-selo">' + selo + '</span><span class="art-cat" hidden>' + (e.cat || "") + '</span><span class="art-ano">' + (e.ano || "") + '</span></div>' +
      '<div class="art-moto">' + moto + '</div>' +
      '<div class="art-scan"></div>'
    );
    // se houver imagem real, usa (sem spoiler no alt); fallback procedural se falhar
    if (e.image && !obj) {
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