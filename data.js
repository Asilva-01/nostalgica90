/* ============================================================
   NOSTÁLGICA 90 — camada de dados
   Carrega challenges.json + museum.json (fonte única).
   Com fallback mínimo para nunca quebrar o jogo.
   ============================================================ */
window.Dados = (function () {
  var desafios = [];
  var museu = [];
  var carregado = false;
  var promessa = null;

  var FALLBACK = [
    { resp: "Tamagotchi", alias: ["tamagotchi", "bichinho virtual"], cat: "BRINQUEDOS", emoji: "🥚", ano: "1996", curiosidade: "A febre dos bichinhos virtuais tomou conta da garotada.", pistas: ["Um bichinho de estimação que vivia no seu bolso.", "Ele bipava pedindo atenção o dia inteiro.", "Você precisava alimentar, brincar e limpar.", "Se você descuidasse, ele ficava doente.", "Era um ovinho de plástico com telinha.", "A febre dos bichinhos virtuais dos anos 90."] },
    { resp: "TV Colosso", alias: ["colosso", "tv colosso"], cat: "TV", emoji: "🐶", ano: "1993", curiosidade: "O programa do cão apresentador fez história na Globo.", pistas: ["Um programa infantil famoso na TV aberta.", "Era apresentado por um cachorro muito grande.", "Ele morava num 'canil' cheio de cães.", "A plateia era formada por crianças.", "O apresentador canino recebia convidados.", "'Au au!' — o cão gigante da Globo."] },
    { resp: "Fita VHS", alias: ["vhs", "fita vhs", "videocassete"], cat: "CULTURA", emoji: "📼", ano: "1970", curiosidade: "Rebobinar antes de devolver era a regra de ouro.", pistas: ["Era pra onde iam os filmes antes do streaming.", "Pra assistir de novo, você precisava rebobinar.", "A locadora era o programa de sexta à noite.", "Esquecer de rebobinar era pecado.", "Uma caixinha preta com dois carretéis.", "VHS: Video Home System."] },
    { resp: "Dragon Ball Z", alias: ["dragon ball z", "dbz"], cat: "TV", emoji: "🐉", ano: "1989", curiosidade: "O 'Kamehameha' virou cultura pop mundial.", pistas: ["Animê que dominava as manhãs da TV.", "O herói soltava o grito 'Kamehameha'.", "Cabelo loiro-elétrico num poder máximo.", "Lutas cheias de transformações.", "A rivalidade com o príncipe dos sayajins.", "Esferas mágicas invocavam um dragão."] },
    { resp: "Street Fighter II", alias: ["street fighter 2", "sf2", "street fighter"], cat: "GAMES", emoji: "🥊", ano: "1991", curiosidade: "O jogo que definiu o gênero de luta nos fliperamas.", pistas: ["O jogo de luta mais famoso dos fliperamas.", "Você escolhia entre lutadores do mundo.", "O personagem soltava o 'Hadouken'.", "Tinha versões Champion Edition e Turbo.", "Dois jogadores disputavam o salão.", "'Hadouken!' e 'Shoryuken!' ecoavam."] },
    { resp: "Vale Tudo", alias: ["vale tudo"], cat: "TV", emoji: "💣", ano: "1988", curiosidade: "O mistério 'Quem matou Odete Roitman?' parou o Brasil.", pistas: ["Novela que todo mundo comentava.", "Tinha a vilã mais marcante da TV.", "'Quem matou Odete Roitman?' virou febre.", "A filha ambiciosa queria dinheiro.", "A mãe vendia comida na praia.", "O mistério durou até o último capítulo."] }
  ];

  function carregar() {
    if (promessa) return promessa;
    promessa = Promise.all([
      fetch('challenges.json').then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); }),
      fetch('museum.json').then(function (r) { if (!r.ok) return []; return r.json(); }).catch(function () { return []; })
    ]).then(function (res) {
      desafios = res[0];
      museu = res[1];
      carregado = true;
    }).catch(function () {
      desafios = FALLBACK;
      museu = [];
      carregado = true;
    });
    return promessa;
  }

  function lista() { return desafios; }
  function total() { return desafios.length; }
  function item(n) {
    var idx = ((n - 1) % desafios.length + desafios.length) % desafios.length;
    return desafios[idx];
  }
  function listaMuseu() { return museu; }

  var CATEGORIAS = ["TV", "GAMES", "CINEMA", "MÚSICA", "BRINQUEDOS", "TECNOLOGIA", "CULTURA"];
  var CAT_EMOJI = { TV: "📺", GAMES: "🎮", CINEMA: "🎬", MÚSICA: "🎵", BRINQUEDOS: "🧸", TECNOLOGIA: "💻", CULTURA: "📼" };
  var CAT_COR = { TV: ["#d32f2f", "#8e0000"], GAMES: ["#b026ff", "#4a0080"], CINEMA: ["#1976d2", "#002f6c"], MÚSICA: ["#ff2d95", "#7a0037"], BRINQUEDOS: ["#ff6f00", "#8f3a00"], TECNOLOGIA: ["#00e5ff", "#006c80"], CULTURA: ["#388e3c", "#0b4a1e"] };

  return {
    carregar: carregar,
    lista: lista,
    total: total,
    item: item,
    listaMuseu: listaMuseu,
    CATEGORIAS: CATEGORIAS,
    CAT_EMOJI: CAT_EMOJI,
    CAT_COR: CAT_COR
  };
})();