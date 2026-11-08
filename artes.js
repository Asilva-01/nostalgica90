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
    ESPORTE: {
      selo: "JOGO", moto: "APITO",
      fundo: "gramado-90",
      elem: function (e, info) {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="10" y="18" width="140" height="54" rx="4" fill="#2ecf5b" stroke="#e6e9ff" stroke-width="3"/>' +
          '<line x1="80" y1="18" x2="80" y2="72" stroke="#e6e9ff" stroke-width="2"/>' +
          '<circle cx="80" cy="45" r="10" fill="none" stroke="#e6e9ff" stroke-width="2"/>' +
          '<ellipse cx="128" cy="70" rx="16" ry="8" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>' +
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

  function _svgLote1(inner) {
    return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' + inner + '</svg>';
  }
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
    orelhao: {
      selo: "CABINE", moto: "RUA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="62" y="18" width="40" height="60" rx="5" fill="#ff6f00" stroke="#241d3f" stroke-width="3"/>' +
          '<path d="M62 22 C40 22 34 34 34 46 C34 60 42 72 62 74 L62 66 C48 64 44 56 44 46 C44 36 50 30 62 30 Z" fill="#ff8a33" stroke="#241d3f" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="70" y="32" width="24" height="20" rx="3" fill="#eceff1" stroke="#241d3f" stroke-width="2.5"/>' +
          '<rect x="73" y="35" width="5" height="4" rx="0.8" fill="#241d3f"/>' +
          '<rect x="80" y="35" width="5" height="4" rx="0.8" fill="#241d3f"/>' +
          '<rect x="87" y="35" width="5" height="4" rx="0.8" fill="#241d3f"/>' +
          '<rect x="73" y="42" width="5" height="4" rx="0.8" fill="#241d3f"/>' +
          '<rect x="80" y="42" width="5" height="4" rx="0.8" fill="#241d3f"/>' +
          '<rect x="87" y="42" width="5" height="4" rx="0.8" fill="#241d3f"/>' +
          '<rect x="74" y="58" width="16" height="3.5" rx="1" fill="#241d3f"/>' +
          '<rect x="104" y="28" width="16" height="36" rx="8" fill="#455a64" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="112" cy="36" r="5" fill="#78909c" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="112" cy="56" r="5" fill="#78909c" stroke="#241d3f" stroke-width="2"/>' +
          '<path d="M102 34 L104 34" stroke="#241d3f" stroke-width="3" stroke-linecap="round"/>' +
          '</svg>';
      }
    },
    "radio-fm": {
      selo: "DIAL", moto: "FM",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<rect x="22" y="24" width="116" height="48" rx="8" fill="#eceff1" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="52" cy="48" r="17" fill="#37474f" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="52" cy="48" r="10" fill="none" stroke="#90a4ae" stroke-width="2.5"/>' +
          '<circle cx="52" cy="48" r="3.5" fill="#241d3f"/>' +
          '<circle cx="112" cy="46" r="15" fill="#ff8f00" stroke="#241d3f" stroke-width="3"/>' +
          '<circle cx="112" cy="46" r="8" fill="#ffe0b2" stroke="#241d3f" stroke-width="2.5"/>' +
          '<line x1="112" y1="46" x2="112" y2="33" stroke="#241d3f" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="96" cy="62" r="3.5" fill="#90a4ae" stroke="#241d3f" stroke-width="2"/>' +
          '<circle cx="128" cy="62" r="3.5" fill="#90a4ae" stroke="#241d3f" stroke-width="2"/>' +
          '<line x1="124" y1="24" x2="138" y2="10" stroke="#241d3f" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="138" cy="10" r="2.5" fill="#241d3f"/>' +
          '</svg>';
      }
    },
    "papel-de-carta": {
      selo: "FOLHA", moto: "BORDA",
      elem: function () {
        return '<svg class="art-elem" viewBox="0 0 160 90" role="presentation">' +
          '<g transform="rotate(-6 80 48)"><rect x="52" y="8" width="56" height="76" rx="3" fill="#fff8e7" stroke="#241d3f" stroke-width="3"/><rect x="58" y="14" width="44" height="64" rx="2" fill="none" stroke="#7e57c2" stroke-width="2.5"/><circle cx="62" cy="18" r="2.5" fill="#e91e63" stroke="#241d3f" stroke-width="1.5"/><circle cx="98" cy="18" r="2.5" fill="#e91e63" stroke="#241d3f" stroke-width="1.5"/><circle cx="62" cy="74" r="2.5" fill="#e91e63" stroke="#241d3f" stroke-width="1.5"/><circle cx="98" cy="74" r="2.5" fill="#e91e63" stroke="#241d3f" stroke-width="1.5"/><circle cx="62" cy="36" r="2" fill="#ffcc80"/><circle cx="62" cy="48" r="2" fill="#ffcc80"/><circle cx="62" cy="60" r="2" fill="#ffcc80"/><circle cx="98" cy="36" r="2" fill="#ffcc80"/><circle cx="98" cy="48" r="2" fill="#ffcc80"/><circle cx="98" cy="60" r="2" fill="#ffcc80"/><rect x="66" y="28" width="28" height="36" rx="2" fill="#fff3e0" stroke="none"/><path d="M92 8 L108 8 L108 24 Z" fill="#ffe0b2" stroke="#241d3f" stroke-width="2.5" stroke-linejoin="round"/><path d="M92 8 L92 24 L108 24" fill="none" stroke="#241d3f" stroke-width="2"/></g>' +
          '</svg>';
      }
    },
    "bom-dia-cia": {
      selo: "MANHÃ", moto: "SBT",
      elem: function () {
        return _svgLote1('<circle cx="40" cy="28" r="14" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="70" y="18" width="70" height="48" rx="6" fill="#1a1530" stroke="#e6e9ff" stroke-width="3"/><rect x="76" y="24" width="58" height="32" fill="#4fc3f7"/><rect x="92" y="66" width="26" height="8" fill="#8f93a8"/>');
      }
    },
    "sessao-desenho": {
      selo: "BLOCO", moto: "MANHÃ",
      elem: function () {
        return _svgLote1('<rect x="22" y="20" width="18" height="50" rx="2" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="44" y="20" width="18" height="50" rx="2" fill="#ff7a1a" stroke="#241d3f" stroke-width="2"/><rect x="66" y="20" width="18" height="50" rx="2" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/><rect x="100" y="28" width="36" height="28" rx="3" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "caverna-do-dragao": {
      selo: "MASMORRA", moto: "DADO",
      elem: function () {
        return _svgLote1('<path d="M18 78 L40 30 Q80 8 120 30 L142 78 Z" fill="#4a3a2a" stroke="#241d3f" stroke-width="3"/><ellipse cx="80" cy="50" rx="22" ry="28" fill="#1a1530"/><polygon points="118,58 130,70 106,70" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "tiny-toons": {
      selo: "ESCOLA", moto: "WARNER",
      elem: function () {
        return _svgLote1('<rect x="28" y="30" width="48" height="36" rx="4" fill="#7d3cff" stroke="#241d3f" stroke-width="3"/><polygon points="28,30 52,14 76,30" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><rect x="96" y="38" width="36" height="28" rx="8" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "animaniacs": {
      selo: "ESTÚDIO", moto: "TORRE",
      elem: function () {
        return _svgLote1('<rect x="30" y="22" width="40" height="50" rx="3" fill="#cfd8e6" stroke="#241d3f" stroke-width="3"/><rect x="38" y="30" width="10" height="10" fill="#81d4fa"/><rect x="52" y="30" width="10" height="10" fill="#81d4fa"/><path d="M88 70 L100 22 L112 70 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "pica-pau": {
      selo: "TRONCO", moto: "RISADA",
      elem: function () {
        return _svgLote1('<rect x="60" y="14" width="28" height="64" rx="8" fill="#8d6e63" stroke="#241d3f" stroke-width="3"/><circle cx="74" cy="18" r="10" fill="#2e7d32" stroke="#241d3f" stroke-width="2"/><circle cx="50" cy="40" r="4" fill="#1a1530"/><circle cx="50" cy="52" r="4" fill="#1a1530"/><circle cx="50" cy="64" r="4" fill="#1a1530"/>');
      }
    },
    "os-simpsons": {
      selo: "SOFÁ", moto: "TV",
      elem: function () {
        return _svgLote1('<rect x="24" y="48" width="72" height="24" rx="4" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><rect x="30" y="40" width="18" height="12" rx="2" fill="#ffb74d" stroke="#241d3f" stroke-width="2"/><rect x="104" y="20" width="36" height="28" rx="3" fill="#1a1530" stroke="#241d3f" stroke-width="3"/><rect x="110" y="26" width="24" height="16" fill="#4fc3f7"/>');
      }
    },
    "angel-menina-das-flores": {
      selo: "FLOR", moto: "JARDIM",
      elem: function () {
        return _svgLote1('<circle cx="80" cy="38" r="16" fill="#ff2d95" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="38" r="6" fill="#ffe600"/><rect x="76" y="54" width="8" height="22" fill="#2ecf5b" stroke="#241d3f" stroke-width="2"/><path d="M76 64 Q58 58 54 70" fill="none" stroke="#2ecf5b" stroke-width="3"/>');
      }
    },
    "casa-da-angelica": {
      selo: "CASA", moto: "PORTA",
      elem: function () {
        return _svgLote1('<rect x="40" y="36" width="80" height="40" fill="#ffe0b2" stroke="#241d3f" stroke-width="3"/><polygon points="40,36 80,12 120,36" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="70" y="52" width="20" height="24" fill="#6d4c41"/><circle cx="80" cy="28" r="5" fill="#ff2d95"/>');
      }
    },
    "show-maravilha": {
      selo: "PALCO", moto: "ESTRELA",
      elem: function () {
        return _svgLote1('<rect x="20" y="58" width="120" height="16" fill="#7d3cff" stroke="#241d3f" stroke-width="3"/><polygon points="80,10 88,32 112,32 92,46 100,68 80,54 60,68 68,46 48,32 72,32" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "he-man": {
      selo: "ESPADA", moto: "PEDRA",
      elem: function () {
        return _svgLote1('<rect x="76" y="8" width="8" height="50" fill="#cfd8e6" stroke="#241d3f" stroke-width="2"/><polygon points="80,4 92,18 68,18" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><path d="M40 78 Q80 50 120 78 L120 86 L40 86 Z" fill="#6d4c41" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "thundercats": {
      selo: "RAIO", moto: "RUÍNA",
      elem: function () {
        return _svgLote1('<polygon points="88,8 60,40 78,40 56,78 108,36 88,36 112,8" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="18" y="62" width="28" height="16" fill="#8d6e63" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "tartarugas-ninja": {
      selo: "ESGOTO", moto: "PIZZA",
      elem: function () {
        return _svgLote1('<circle cx="52" cy="48" r="22" fill="#90a4ae" stroke="#241d3f" stroke-width="3"/><circle cx="52" cy="48" r="8" fill="#1a1530"/><circle cx="118" cy="48" r="20" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><path d="M104 48 L132 48 M118 34 L118 62" stroke="#e65100" stroke-width="2"/>');
      }
    },
    "ducktales": {
      selo: "BAÚ", moto: "MOEDA",
      elem: function () {
        return _svgLote1('<rect x="44" y="36" width="72" height="40" rx="4" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><rect x="44" y="28" width="72" height="14" rx="4" fill="#e65100" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="56" r="8" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "batman-serie-animada": {
      selo: "NOITE", moto: "PRÉDIO",
      elem: function () {
        return _svgLote1('<rect x="18" y="30" width="18" height="50" fill="#1a1530" stroke="#241d3f" stroke-width="2"/><rect x="42" y="18" width="22" height="62" fill="#263238" stroke="#241d3f" stroke-width="2"/><rect x="70" y="36" width="16" height="44" fill="#1a1530" stroke="#241d3f" stroke-width="2"/><circle cx="128" cy="22" r="12" fill="#cfd8e6" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "x-men-serie-animada": {
      selo: "MANSÃO", moto: "JET",
      elem: function () {
        return _svgLote1('<rect x="24" y="40" width="70" height="32" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><polygon points="24,40 59,18 94,40" fill="#455a64" stroke="#241d3f" stroke-width="3"/><ellipse cx="126" cy="36" rx="22" ry="8" fill="#90caf9" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "capitao-planeta": {
      selo: "GLOBO", moto: "ANÉIS",
      elem: function () {
        return _svgLote1('<circle cx="80" cy="46" r="26" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><ellipse cx="80" cy="46" rx="10" ry="26" fill="none" stroke="#2ecf5b" stroke-width="3"/><path d="M56 40 Q80 28 104 40" fill="none" stroke="#2ecf5b" stroke-width="3"/>');
      }
    },
    "inspetor-bugiganga": {
      selo: "CASACO", moto: "MOLA",
      elem: function () {
        return _svgLote1('<rect x="58" y="28" width="44" height="46" rx="6" fill="#455a64" stroke="#241d3f" stroke-width="3"/><rect x="68" y="12" width="24" height="16" rx="4" fill="#37474f" stroke="#241d3f" stroke-width="2"/><path d="M102 40 C120 28 128 52 112 58" fill="none" stroke="#ffe600" stroke-width="4"/>');
      }
    },
    "disney-club": {
      selo: "CASTELO", moto: "ROLO",
      elem: function () {
        return _svgLote1('<rect x="50" y="40" width="60" height="36" fill="#cfd8e6" stroke="#241d3f" stroke-width="3"/><rect x="44" y="22" width="16" height="54" fill="#90caf9" stroke="#241d3f" stroke-width="2"/><rect x="100" y="16" width="16" height="60" fill="#90caf9" stroke="#241d3f" stroke-width="2"/><polygon points="44,22 52,8 60,22" fill="#e6293c"/><polygon points="100,16 108,4 116,16" fill="#e6293c"/>');
      }
    },
    "passa-ou-repassa": {
      selo: "PROVA", moto: "BOTÃO",
      elem: function () {
        return _svgLote1('<rect x="22" y="30" width="50" height="40" rx="4" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><rect x="88" y="30" width="50" height="40" rx="4" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><circle cx="47" cy="50" r="8" fill="#ffe600"/><circle cx="113" cy="50" r="8" fill="#ffe600"/>');
      }
    },
    "festival-de-desenhos": {
      selo: "VINHETA", moto: "GLOBO",
      elem: function () {
        return _svgLote1('<rect x="36" y="18" width="88" height="54" rx="6" fill="#1a1530" stroke="#e6e9ff" stroke-width="3"/><circle cx="80" cy="45" r="16" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="20" y="70" width="120" height="8" fill="#e6293c"/>');
      }
    },
    "angel-mix": {
      selo: "MESA", moto: "SOL",
      elem: function () {
        return _svgLote1('<rect x="28" y="48" width="104" height="22" rx="4" fill="#7d3cff" stroke="#241d3f" stroke-width="3"/><circle cx="48" cy="36" r="10" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="70" y="30" width="14" height="18" fill="#ff2d95"/><rect x="90" y="30" width="14" height="18" fill="#2ecf5b"/><rect x="110" y="30" width="14" height="18" fill="#2f6fed"/>');
      }
    },
    "changeman": {
      selo: "ESQUADRÃO", moto: "CINCO",
      elem: function () {
        return _svgLote1('<circle cx="28" cy="46" r="12" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><circle cx="54" cy="46" r="12" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="46" r="12" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/><circle cx="106" cy="46" r="12" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><circle cx="132" cy="46" r="12" fill="#ff2d95" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "flashman": {
      selo: "PRISMA", moto: "CLARÃO",
      elem: function () {
        return _svgLote1('<polygon points="80,10 120,78 40,78" fill="#81d4fa" stroke="#241d3f" stroke-width="3"/><polygon points="80,28 100,70 60,70" fill="#ffe600" opacity="0.7"/>');
      }
    },
    "jiraiya": {
      selo: "NINJA", moto: "ESTRELA",
      elem: function () {
        return _svgLote1('<polygon points="80,16 88,36 110,36 92,50 100,72 80,58 60,72 68,50 50,36 72,36" fill="#cfd8e6" stroke="#241d3f" stroke-width="3"/><rect x="20" y="60" width="36" height="10" fill="#e6293c" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "jiban": {
      selo: "AÇO", moto: "DISTINTIVO",
      elem: function () {
        return _svgLote1('<polygon points="80,12 108,28 108,60 80,78 52,60 52,28" fill="#90a4ae" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="46" r="12" fill="#1a1530" stroke="#ffe600" stroke-width="3"/>');
      }
    },
    "shurato": {
      selo: "MANDALA", moto: "GUARDIÃO",
      elem: function () {
        return _svgLote1('<circle cx="80" cy="46" r="28" fill="#7d3cff" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="46" r="16" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><circle cx="80" cy="46" r="6" fill="#e6293c"/>');
      }
    },
    "samurai-warriors": {
      selo: "ARMADURA", moto: "CINCO",
      elem: function () {
        return _svgLote1('<rect x="22" y="30" width="20" height="36" rx="3" fill="#e6293c" stroke="#241d3f" stroke-width="2"/><rect x="46" y="26" width="20" height="40" rx="3" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/><rect x="70" y="22" width="20" height="44" rx="3" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="94" y="26" width="20" height="40" rx="3" fill="#2ecf5b" stroke="#241d3f" stroke-width="2"/><rect x="118" y="30" width="20" height="36" rx="3" fill="#7d3cff" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "yu-yu-hakusho": {
      selo: "ESPÍRITO", moto: "CADERNO",
      elem: function () {
        return _svgLote1('<circle cx="52" cy="40" r="20" fill="#81d4fa" stroke="#241d3f" stroke-width="3" opacity="0.9"/><rect x="88" y="22" width="40" height="52" rx="3" fill="#fff8e7" stroke="#241d3f" stroke-width="3"/><rect x="94" y="32" width="28" height="4" fill="#90a4ae"/><rect x="94" y="42" width="22" height="4" fill="#90a4ae"/>');
      }
    },
    "spielvan": {
      selo: "TEMPO", moto: "VISOR",
      elem: function () {
        return _svgLote1('<path d="M58 16 L102 16 L80 46 Z" fill="#81d4fa" stroke="#241d3f" stroke-width="3"/><path d="M58 76 L102 76 L80 46 Z" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><rect x="118" y="30" width="22" height="16" rx="6" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "black-kamen-rider": {
      selo: "VISOR", moto: "MOTO",
      elem: function () {
        return _svgLote1('<ellipse cx="80" cy="36" rx="24" ry="20" fill="#1a1530" stroke="#ffe600" stroke-width="3"/><rect x="68" y="32" width="24" height="8" rx="2" fill="#e6293c"/><circle cx="48" cy="70" r="12" fill="#37474f" stroke="#241d3f" stroke-width="3"/><circle cx="112" cy="70" r="12" fill="#37474f" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "kamen-rider-black-rx": {
      selo: "SOL", moto: "BIO",
      elem: function () {
        return _svgLote1('<circle cx="80" cy="40" r="22" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="58" y="64" width="44" height="14" rx="4" fill="#1a1530" stroke="#e6293c" stroke-width="3"/>');
      }
    },
    "cybercop": {
      selo: "CIRCUITO", moto: "CAPACETE",
      elem: function () {
        return _svgLote1('<rect x="50" y="18" width="60" height="36" rx="10" fill="#90a4ae" stroke="#241d3f" stroke-width="3"/><rect x="62" y="30" width="36" height="12" rx="3" fill="#00e5ff"/><rect x="40" y="58" width="80" height="16" fill="#1a1530" stroke="#00e5ff" stroke-width="2"/>');
      }
    },
    "winspector": {
      selo: "SIRENE", moto: "RESGATE",
      elem: function () {
        return _svgLote1('<rect x="36" y="36" width="88" height="32" rx="6" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><rect x="56" y="16" width="48" height="20" rx="6" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="26" r="6" fill="#ffe600"/>');
      }
    },
    "solbrain": {
      selo: "LAB", moto: "RESGATE",
      elem: function () {
        return _svgLote1('<rect x="30" y="22" width="28" height="50" rx="4" fill="#81d4fa" stroke="#241d3f" stroke-width="3"/><ellipse cx="104" cy="40" rx="22" ry="18" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="92" y="56" width="24" height="16" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "maskman": {
      selo: "MÁSCARA", moto: "LUZ",
      elem: function () {
        return _svgLote1('<ellipse cx="40" cy="46" r="14" ry="18" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><ellipse cx="70" cy="46" r="14" ry="18" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><ellipse cx="100" cy="46" r="14" ry="18" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><ellipse cx="130" cy="46" r="14" ry="18" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "super-campeoes": {
      selo: "CAMPO", moto: "FAIXA",
      elem: function () {
        return _svgLote1('<rect x="20" y="22" width="120" height="50" rx="4" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="47" r="12" fill="none" stroke="#f5f0e8" stroke-width="3"/><rect x="20" y="44" width="120" height="4" fill="#f5f0e8"/><rect x="58" y="70" width="44" height="10" fill="#e6293c"/>');
      }
    },
    "ultraman": {
      selo: "RAIO", moto: "GIGANTE",
      elem: function () {
        return _svgLote1('<rect x="70" y="8" width="20" height="70" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="64" y="20" width="32" height="12" fill="#cfd8e6" stroke="#241d3f" stroke-width="2"/><circle cx="80" cy="48" r="6" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "national-kid": {
      selo: "CAPA", moto: "RAIO",
      elem: function () {
        return _svgLote1('<path d="M58 20 L80 8 L102 20 L96 78 L64 78 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><polygon points="110,16 98,40 112,40 90,70 130,34 114,34" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "lion-man": {
      selo: "JUBA", moto: "GRUTA",
      elem: function () {
        return _svgLote1('<ellipse cx="80" cy="46" rx="34" ry="24" fill="#8d6e63" stroke="#241d3f" stroke-width="3"/><ellipse cx="80" cy="50" rx="18" ry="14" fill="#1a1530"/><circle cx="52" cy="70" r="6" fill="#ff7a1a"/>');
      }
    },
    "sonic": {
      selo: "TÊNIS", moto: "LOOP",
      elem: function () {
        return _svgLote1('<path d="M30 70 Q80 10 130 70" fill="none" stroke="#2f6fed" stroke-width="8"/><rect x="96" y="58" width="36" height="18" rx="6" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="100" y="70" width="28" height="8" fill="#1a1530"/>');
      }
    },
    "top-gear": {
      selo: "VOLANTE", moto: "BANDEIRA",
      elem: function () {
        return _svgLote1('<circle cx="58" cy="48" r="24" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><circle cx="58" cy="48" r="8" fill="#1a1530"/><rect x="100" y="18" width="36" height="24" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/><rect x="100" y="18" width="18" height="12" fill="#1a1530"/><rect x="118" y="30" width="18" height="12" fill="#1a1530"/>');
      }
    },
    "super-mario-world": {
      selo: "MAPA", moto: "COLINA",
      elem: function () {
        return _svgLote1('<path d="M10 70 Q40 30 70 70 T130 70 L150 86 L10 86 Z" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/><rect x="64" y="22" width="32" height="22" rx="3" fill="#7d3cff" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "donkey-kong-country": {
      selo: "BARRIL", moto: "SELVA",
      elem: function () {
        return _svgLote1('<ellipse cx="80" cy="50" rx="28" ry="30" fill="#a16207" stroke="#241d3f" stroke-width="3"/><path d="M54 40 Q80 32 106 40" fill="none" stroke="#241d3f" stroke-width="3"/><path d="M52 58 Q80 50 108 58" fill="none" stroke="#241d3f" stroke-width="3"/><circle cx="30" cy="22" r="10" fill="#2ecf5b"/>');
      }
    },
    "samurai-shodown": {
      selo: "KATANA", moto: "FLOR",
      elem: function () {
        return _svgLote1('<rect x="28" y="42" width="100" height="8" rx="2" fill="#cfd8e6" stroke="#241d3f" stroke-width="2"/><rect x="20" y="38" width="16" height="16" fill="#6d4c41" stroke="#241d3f" stroke-width="2"/><circle cx="128" cy="24" r="10" fill="#ff2d95" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "fatal-fury": {
      selo: "RINGUE", moto: "JAQUETA",
      elem: function () {
        return _svgLote1('<rect x="24" y="50" width="112" height="24" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="58" y="18" width="44" height="36" rx="4" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "captain-commando": {
      selo: "MOEDA", moto: "QUATRO",
      elem: function () {
        return _svgLote1('<circle cx="36" cy="46" r="14" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="60" y="30" width="18" height="34" rx="4" fill="#e6293c" stroke="#241d3f" stroke-width="2"/><rect x="84" y="30" width="18" height="34" rx="4" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/><rect x="108" y="30" width="18" height="34" rx="4" fill="#2ecf5b" stroke="#241d3f" stroke-width="2"/><rect x="132" y="30" width="18" height="34" rx="4" fill="#ff7a1a" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "cadillacs-e-dinossauros": {
      selo: "CONVERSÍVEL", moto: "OSSO",
      elem: function () {
        return _svgLote1('<path d="M18 58 L70 50 L90 58 L70 70 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><path d="M96 30 L150 24 L150 70 L110 78 Z" fill="#d7ccc8" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "streets-of-rage": {
      selo: "RUA", moto: "PUNHO",
      elem: function () {
        return _svgLote1('<rect x="10" y="50" width="140" height="24" fill="#37474f"/><rect x="20" y="18" width="28" height="32" fill="#1a1530" stroke="#ffe600" stroke-width="2"/><circle cx="110" cy="40" r="16" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "golden-axe": {
      selo: "MACHADO", moto: "POÇÃO",
      elem: function () {
        return _svgLote1('<rect x="74" y="28" width="12" height="50" fill="#6d4c41" stroke="#241d3f" stroke-width="2"/><path d="M50 20 L80 36 L50 52 Z" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><path d="M110 20 L80 36 L110 52 Z" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "super-mario-kart": {
      selo: "KART", moto: "BANDEIRA",
      elem: function () {
        return _svgLote1('<circle cx="48" cy="64" r="12" fill="#1a1530" stroke="#241d3f" stroke-width="3"/><circle cx="108" cy="64" r="12" fill="#1a1530" stroke="#241d3f" stroke-width="3"/><rect x="40" y="40" width="80" height="18" rx="6" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="118" y="12" width="24" height="16" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "iss-deluxe": {
      selo: "CAMPO", moto: "16-BIT",
      elem: function () {
        return _svgLote1('<rect x="18" y="18" width="124" height="54" rx="4" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="45" r="10" fill="none" stroke="#f5f0e8" stroke-width="3"/><rect x="18" y="42" width="124" height="4" fill="#f5f0e8"/><rect x="54" y="72" width="52" height="10" rx="2" fill="#7d3cff"/>');
      }
    },
    "mega-drive": {
      selo: "16-BIT", moto: "SEGA",
      elem: function () {
        return _svgLote1('<rect x="28" y="28" width="104" height="36" rx="8" fill="#1a1530" stroke="#e6e9ff" stroke-width="3"/><rect x="40" y="40" width="28" height="12" rx="2" fill="#2f6fed"/><circle cx="92" cy="46" r="6" fill="#e6293c"/><circle cx="110" cy="46" r="6" fill="#ffe600"/>');
      }
    },
    "master-system": {
      selo: "8-BIT", moto: "TECTOY",
      elem: function () {
        return _svgLote1('<rect x="36" y="22" width="88" height="46" rx="6" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="48" y="32" width="40" height="22" rx="2" fill="#1a1530"/><rect x="96" y="36" width="16" height="16" rx="2" fill="#ffe600"/>');
      }
    },
    "nintendo-64": {
      selo: "CARTUCHO", moto: "ANALÓGICO",
      elem: function () {
        return _svgLote1('<rect x="48" y="14" width="64" height="40" rx="4" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><rect x="60" y="58" width="40" height="22" rx="10" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="69" r="6" fill="#1a1530"/>');
      }
    },
    "playstation": {
      selo: "CD", moto: "SÍMBOLOS",
      elem: function () {
        return _svgLote1('<rect x="30" y="30" width="100" height="36" rx="6" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><circle cx="62" cy="48" r="12" fill="#cfd8e6" stroke="#241d3f" stroke-width="2"/><rect x="96" y="40" width="10" height="10" fill="#e6293c"/><circle cx="114" cy="45" r="6" fill="none" stroke="#2f6fed" stroke-width="3"/>');
      }
    },
    "crash-bandicoot": {
      selo: "CAIXOTE", moto: "ILHA",
      elem: function () {
        return _svgLote1('<rect x="50" y="28" width="44" height="44" fill="#a16207" stroke="#241d3f" stroke-width="3"/><path d="M50 50 L94 50 M72 28 L72 72" stroke="#241d3f" stroke-width="3"/><ellipse cx="128" cy="70" rx="22" ry="10" fill="#2ecf5b"/>');
      }
    },
    "resident-evil": {
      selo: "MANSÃO", moto: "MÁQUINA",
      elem: function () {
        return _svgLote1('<rect x="24" y="30" width="70" height="46" fill="#37474f" stroke="#241d3f" stroke-width="3"/><polygon points="24,30 59,10 94,30" fill="#1a1530" stroke="#241d3f" stroke-width="3"/><rect x="108" y="40" width="32" height="28" fill="#eceff1" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "nba-jam": {
      selo: "CESTA", moto: "FOGO",
      elem: function () {
        return _svgLote1('<rect x="70" y="8" width="8" height="36" fill="#ff7a1a" stroke="#241d3f" stroke-width="2"/><ellipse cx="74" cy="48" rx="22" ry="10" fill="none" stroke="#ff7a1a" stroke-width="4"/><path d="M110 70 Q118 40 130 70 Q118 58 110 70" fill="#ff7a1a" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "sunset-riders": {
      selo: "CHAPÉU", moto: "CÁCTUS",
      elem: function () {
        return _svgLote1('<ellipse cx="56" cy="40" rx="28" ry="8" fill="#6d4c41" stroke="#241d3f" stroke-width="3"/><rect x="44" y="18" width="24" height="22" rx="8" fill="#6d4c41" stroke="#241d3f" stroke-width="2"/><rect x="112" y="36" width="12" height="40" fill="#2ecf5b" stroke="#241d3f" stroke-width="2"/><rect x="100" y="48" width="36" height="8" fill="#2ecf5b"/>');
      }
    },
    "killer-instinct": {
      selo: "COMBO", moto: "BARRA",
      elem: function () {
        return _svgLote1('<rect x="20" y="30" width="120" height="16" rx="4" fill="#1a1530" stroke="#e6293c" stroke-width="3"/><rect x="24" y="34" width="80" height="8" fill="#ffe600"/><rect x="50" y="56" width="24" height="18" rx="4" fill="#e6293c" stroke="#241d3f" stroke-width="2"/><rect x="86" y="56" width="24" height="18" rx="4" fill="#2f6fed" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "mega-man-x": {
      selo: "CÁPSULA", moto: "CANHÃO",
      elem: function () {
        return _svgLote1('<rect x="36" y="16" width="40" height="60" rx="8" fill="#81d4fa" stroke="#241d3f" stroke-width="3"/><rect x="88" y="36" width="48" height="16" rx="6" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "goldeneye-007": {
      selo: "PISTOLA", moto: "N64",
      elem: function () {
        return _svgLote1('<rect x="30" y="40" width="70" height="12" rx="3" fill="#37474f" stroke="#241d3f" stroke-width="3"/><rect x="90" y="28" width="16" height="24" fill="#1a1530" stroke="#241d3f" stroke-width="2"/><rect x="118" y="48" width="28" height="20" rx="8" fill="#eceff1" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "final-fantasy-vii": {
      selo: "ORBE", moto: "REATOR",
      elem: function () {
        return _svgLote1('<circle cx="48" cy="46" r="18" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/><circle cx="78" cy="38" r="12" fill="#7d3cff" stroke="#241d3f" stroke-width="2"/><rect x="108" y="18" width="28" height="54" fill="#455a64" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "art-of-fighting": {
      selo: "DOJO", moto: "KI",
      elem: function () {
        return _svgLote1('<rect x="20" y="50" width="120" height="24" fill="#a16207" stroke="#241d3f" stroke-width="3"/><circle cx="80" cy="32" r="18" fill="#ffe600" stroke="#241d3f" stroke-width="3" opacity="0.85"/><rect x="70" y="22" width="20" height="20" fill="none" stroke="#e6293c" stroke-width="3"/>');
      }
    },
    "guga": {
      selo: "RAQUETE", moto: "SAIBRO",
      elem: function () {
        return _svgLote1('<ellipse cx="70" cy="40" rx="18" ry="24" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="66" y="62" width="8" height="22" fill="#6d4c41"/><rect x="18" y="78" width="124" height="8" fill="#ff7a1a"/>');
      }
    },
    "oscar-schmidt": {
      selo: "CESTA", moto: "TRÊS",
      elem: function () {
        return _svgLote1('<rect x="74" y="8" width="8" height="40" fill="#ff7a1a" stroke="#241d3f" stroke-width="2"/><ellipse cx="78" cy="52" rx="20" ry="8" fill="none" stroke="#ff7a1a" stroke-width="4"/><circle cx="40" cy="40" r="12" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "hortencia": {
      selo: "QUADRA", moto: "CESTA",
      elem: function () {
        return _svgLote1('<circle cx="70" cy="40" r="18" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><rect x="108" y="48" width="28" height="16" rx="6" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "rubens-barrichello": {
      selo: "CAPACETE", moto: "GRID",
      elem: function () {
        return _svgLote1('<ellipse cx="80" cy="42" rx="28" ry="24" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="58" y="38" width="44" height="12" fill="#1a1530"/><rect x="20" y="72" width="120" height="8" fill="#ffe600"/>');
      }
    },
    "palmeiras": {
      selo: "MANTO", moto: "BOLA",
      elem: function () {
        return _svgLote1('<rect x="24" y="18" width="70" height="54" fill="#2ecf5b" stroke="#241d3f" stroke-width="3"/><circle cx="120" cy="50" r="16" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "sao-paulo": {
      selo: "TAÇA", moto: "LISTRAS",
      elem: function () {
        return _svgLote1('<rect x="20" y="20" width="16" height="50" fill="#f5f0e8"/><rect x="36" y="20" width="10" height="50" fill="#e6293c"/><rect x="46" y="20" width="10" height="50" fill="#1a1530"/><rect x="56" y="20" width="16" height="50" fill="#f5f0e8"/><ellipse cx="118" cy="70" rx="18" ry="6" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="110" y="36" width="16" height="34" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "selecao-de-volei": {
      selo: "REDE", moto: "BOLA",
      elem: function () {
        return _svgLote1('<line x1="80" y1="12" x2="80" y2="78" stroke="#241d3f" stroke-width="4"/><path d="M50 20 L110 20 L110 60 L50 60 Z" fill="none" stroke="#cfd8e6" stroke-width="3"/><circle cx="40" cy="70" r="12" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "magic-paula": {
      selo: "PASSE", moto: "FAÍSCA",
      elem: function () {
        return _svgLote1('<circle cx="62" cy="48" r="16" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><polygon points="110,18 116,36 134,36 120,48 126,66 110,54 94,66 100,48 86,36 104,36" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "gustavo-borges": {
      selo: "RAIA", moto: "TOUCA",
      elem: function () {
        return _svgLote1('<rect x="18" y="20" width="124" height="50" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="70" stroke="#f5f0e8" stroke-width="3"/><line x1="80" y1="20" x2="80" y2="70" stroke="#f5f0e8" stroke-width="3"/><line x1="110" y1="20" x2="110" y2="70" stroke="#f5f0e8" stroke-width="3"/><ellipse cx="80" cy="40" rx="10" ry="6" fill="#e6293c"/>');
      }
    },
    "fernando-scherer": {
      selo: "BLOCO", moto: "50M",
      elem: function () {
        return _svgLote1('<rect x="20" y="50" width="120" height="24" fill="#2f6fed" stroke="#241d3f" stroke-width="3"/><rect x="40" y="28" width="36" height="22" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "jackie-silva": {
      selo: "PRAIA", moto: "AREIA",
      elem: function () {
        return _svgLote1('<rect x="0" y="50" width="160" height="40" fill="#ffe082"/><rect x="0" y="20" width="160" height="30" fill="#4fc3f7"/><circle cx="80" cy="48" r="12" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "bebeto": {
      selo: "BERÇO", moto: "GOL",
      elem: function () {
        return _svgLote1('<rect x="44" y="36" width="72" height="28" rx="6" fill="#fff8e7" stroke="#241d3f" stroke-width="3"/><rect x="40" y="28" width="8" height="44" fill="#8d6e63"/><rect x="112" y="28" width="8" height="44" fill="#8d6e63"/><circle cx="128" cy="22" r="8" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "dunga": {
      selo: "FAIXA", moto: "TAÇA",
      elem: function () {
        return _svgLote1('<rect x="36" y="40" width="52" height="18" rx="4" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><ellipse cx="118" cy="70" rx="16" ry="6" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="110" y="28" width="16" height="42" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "taffarel": {
      selo: "LUVA", moto: "GOL",
      elem: function () {
        return _svgLote1('<rect x="18" y="22" width="8" height="50" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/><rect x="18" y="22" width="70" height="8" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/><path d="M100 30 L130 30 L136 70 L94 70 Z" fill="#ffe600" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "rai": {
      selo: "CAMISA", moto: "10",
      elem: function () {
        return _svgLote1('<rect x="48" y="22" width="64" height="50" rx="8" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><rect x="48" y="22" width="64" height="12" fill="#2ecf5b"/><circle cx="120" cy="60" r="14" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "marcelinho-carioca": {
      selo: "FALTA", moto: "CURVA",
      elem: function () {
        return _svgLote1('<path d="M24 70 Q80 10 136 70" fill="none" stroke="#ffe600" stroke-width="5"/><circle cx="136" cy="70" r="10" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "edmundo": {
      selo: "FERA", moto: "CHUTEIRA",
      elem: function () {
        return _svgLote1('<ellipse cx="70" cy="46" rx="28" ry="20" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><rect x="108" y="50" width="32" height="16" rx="6" fill="#1a1530" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "gremio": {
      selo: "LISTRAS", moto: "TAÇA",
      elem: function () {
        return _svgLote1('<rect x="20" y="18" width="18" height="54" fill="#2f6fed"/><rect x="38" y="18" width="18" height="54" fill="#1a1530"/><rect x="56" y="18" width="18" height="54" fill="#f5f0e8"/><ellipse cx="118" cy="72" rx="16" ry="6" fill="#ffe600" stroke="#241d3f" stroke-width="2"/><rect x="110" y="34" width="16" height="38" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "emerson-fittipaldi": {
      selo: "INDY", moto: "QUADRICULADO",
      elem: function () {
        return _svgLote1('<rect x="20" y="18" width="16" height="16" fill="#1a1530"/><rect x="36" y="18" width="16" height="16" fill="#f5f0e8"/><rect x="20" y="34" width="16" height="16" fill="#f5f0e8"/><rect x="36" y="34" width="16" height="16" fill="#1a1530"/><path d="M70 58 L130 50 L140 62 L78 70 Z" fill="#e6293c" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "royce-gracie": {
      selo: "KIMONO", moto: "TATAME",
      elem: function () {
        return _svgLote1('<rect x="0" y="58" width="160" height="32" fill="#e6293c"/><rect x="50" y="16" width="60" height="50" rx="8" fill="#f5f0e8" stroke="#241d3f" stroke-width="3"/><rect x="50" y="30" width="60" height="8" fill="#1a1530"/>');
      }
    },
    "pantanal": {
      selo: "RIO", moto: "GADO",
      elem: function () {
        return _svgLote1('<path d="M0 50 Q40 30 80 50 T160 50 L160 90 L0 90 Z" fill="#2f6fed"/><ellipse cx="50" cy="40" rx="16" ry="10" fill="#eceff1" stroke="#241d3f" stroke-width="2"/><rect x="110" y="28" width="28" height="18" rx="6" fill="#8d6e63" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "explode-coracao": {
      selo: "CRISTAL", moto: "CORAÇÃO",
      elem: function () {
        return _svgLote1('<polygon points="80,12 100,46 80,80 60,46" fill="#81d4fa" stroke="#241d3f" stroke-width="3"/><path d="M110 30 C110 18 128 18 128 32 C128 48 110 58 110 58 C110 58 92 48 92 32 C92 18 110 18 110 30 Z" fill="#e6293c" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "a-proxima-vitima": {
      selo: "CARRO", moto: "?",
      elem: function () {
        return _svgLote1('<rect x="24" y="40" width="80" height="24" rx="6" fill="#2a2a2a" stroke="#241d3f" stroke-width="3"/><rect x="28" y="44" width="28" height="10" fill="#90a4ae"/><circle cx="42" cy="68" r="8" fill="#1a1530"/><circle cx="86" cy="68" r="8" fill="#1a1530"/><text x="124" y="58" font-family="VT323" font-size="36" fill="#cfd8e6">?</text>');
      }
    },
    "renascer": {
      selo: "CACAU", moto: "FAZENDA",
      elem: function () {
        return _svgLote1('<ellipse cx="56" cy="46" rx="18" ry="24" fill="#6d4c41" stroke="#241d3f" stroke-width="3"/><rect x="96" y="30" width="40" height="36" fill="#a16207" stroke="#241d3f" stroke-width="3"/><polygon points="96,30 116,14 136,30" fill="#e6293c" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "vamp": {
      selo: "CAPA", moto: "DENTE",
      elem: function () {
        return _svgLote1('<path d="M40 20 L80 12 L120 20 L112 80 L48 80 Z" fill="#1a1530" stroke="#e6293c" stroke-width="3"/><polygon points="70,44 80,66 90,44" fill="#f5f0e8" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "a-indomada": {
      selo: "FAROL", moto: "VILA",
      elem: function () {
        return _svgLote1('<rect x="70" y="28" width="20" height="50" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><polygon points="66,28 80,8 94,28" fill="#e6293c" stroke="#241d3f" stroke-width="3"/><rect x="24" y="58" width="28" height="20" fill="#ffcc80" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "por-amor": {
      selo: "ANÉIS", moto: "CALÇADA",
      elem: function () {
        return _svgLote1('<circle cx="62" cy="40" r="16" fill="none" stroke="#ffe600" stroke-width="5"/><circle cx="86" cy="40" r="16" fill="none" stroke="#cfd8e6" stroke-width="5"/><path d="M10 70 L40 78 L70 70 L100 78 L130 70 L160 78" fill="none" stroke="#e6e9ff" stroke-width="4"/>');
      }
    },
    "torre-de-babel": {
      selo: "PRÉDIO", moto: "RACHADURA",
      elem: function () {
        return _svgLote1('<rect x="48" y="12" width="64" height="66" fill="#90a4ae" stroke="#241d3f" stroke-width="3"/><path d="M70 18 L84 40 L64 50 L88 78" fill="none" stroke="#e6293c" stroke-width="4"/>');
      }
    },
    "malhacao": {
      selo: "PESO", moto: "ARMÁRIO",
      elem: function () {
        return _svgLote1('<rect x="40" y="40" width="80" height="12" rx="4" fill="#90a4ae" stroke="#241d3f" stroke-width="3"/><circle cx="40" cy="46" r="16" fill="#1a1530" stroke="#241d3f" stroke-width="3"/><circle cx="120" cy="46" r="16" fill="#1a1530" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "marimar": {
      selo: "CABANA", moto: "MAR",
      elem: function () {
        return _svgLote1('<rect x="48" y="36" width="64" height="28" fill="#fff8e7" stroke="#241d3f" stroke-width="3"/><polygon points="48,36 80,16 112,36" fill="#ff7a1a" stroke="#241d3f" stroke-width="3"/><path d="M0 70 Q40 58 80 70 T160 70 L160 90 L0 90 Z" fill="#2f6fed"/>');
      }
    },
    "maria-do-bairro": {
      selo: "TIGELA", moto: "RUA",
      elem: function () {
        return _svgLote1('<ellipse cx="80" cy="50" rx="32" ry="14" fill="#eceff1" stroke="#241d3f" stroke-width="3"/><ellipse cx="80" cy="46" rx="24" ry="8" fill="#ffe082"/><rect x="20" y="64" width="22" height="18" fill="#ffcc80" stroke="#241d3f" stroke-width="2"/><rect x="118" y="60" width="22" height="22" fill="#90caf9" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "xica-da-silva": {
      selo: "DIAMANTE", moto: "JANELA",
      elem: function () {
        return _svgLote1('<polygon points="80,12 100,36 80,60 60,36" fill="#81d4fa" stroke="#241d3f" stroke-width="3"/><rect x="108" y="40" width="36" height="36" fill="#6d4c41" stroke="#241d3f" stroke-width="3"/><rect x="116" y="48" width="20" height="16" fill="#ffe082"/>');
      }
    },
    "ana-raio-e-ze-trovao": {
      selo: "RAIO", moto: "SELA",
      elem: function () {
        return _svgLote1('<polygon points="70,8 48,40 66,40 44,78 96,36 76,36 98,8" fill="#ffe600" stroke="#241d3f" stroke-width="3"/><ellipse cx="124" cy="58" rx="18" ry="12" fill="#6d4c41" stroke="#241d3f" stroke-width="3"/>');
      }
    },
    "rainha-da-sucata": {
      selo: "FERRO", moto: "COROA",
      elem: function () {
        return _svgLote1('<rect x="30" y="48" width="28" height="22" fill="#90a4ae" stroke="#241d3f" stroke-width="2"/><rect x="62" y="40" width="36" height="30" fill="#78909c" stroke="#241d3f" stroke-width="2"/><polygon points="80,8 88,24 104,24 90,34 96,50 80,40 64,50 70,34 56,24 72,24" fill="#ffe600" stroke="#241d3f" stroke-width="2"/>');
      }
    },
    "perola-negra": {
      selo: "JOIA", moto: "COLAR",
      elem: function () {
        return _svgLote1('<circle cx="80" cy="46" r="16" fill="#1a1530" stroke="#cfd8e6" stroke-width="3"/><path d="M40 28 Q80 8 120 28" fill="none" stroke="#ffe600" stroke-width="4"/><circle cx="40" cy="28" r="4" fill="#ffe600"/><circle cx="120" cy="28" r="4" fill="#ffe600"/>');
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
    // A foto livre (e.image) só entra na tela de revelação, depois do
    // acerto/esgotamento. No jogo a arte é sempre original — anti-spoiler.
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

  function temPropria(e) { return !!objetoDo(e); }
  function slugsProprios() { return Object.keys(OBJETOS); }

  return {
    gerar: gerar,
    infoCategoria: infoCategoria,
    mostrarFallback: mostrarFallback,
    temPropria: temPropria,
    slugsProprios: slugsProprios
  };
})();