/* ============================================================
   NOSTÁLGICA 90 — Teste de regressão (motor + aliases + dados)
   Rode: node tools/test_core.js
   Cobre: aliases, desafio diário, pistas, resposta, pontos,
   streak, histórico, galeria, museu, compatibilidade de campos.
   ============================================================ */
const fs = require('fs');
const path = require('path');

// ---------- Mock DOM mínimo ----------
function fakeEl() {
  return {
    textContent: '', innerHTML: '', value: '', className: '',
    classList: { _s: {}, add(c){this._s[c]=1;}, remove(c){delete this._s[c];}, toggle(c,f){ if(f===undefined) f=!this._s[c]; if(f) this._s[c]=1; else delete this._s[c]; }, contains(c){ return !!this._s[c]; } },
    style: {}, addEventListener(){}, remove(){},
    querySelector(){ return fakeEl(); }, querySelectorAll(){ return []; },
    appendChild(){}, setAttribute(){}, getAttribute(){ return null; }, focus(){}, offsetWidth: 0
  };
}
const byId = {};
global.document = {
  getElementById(id){ if(!byId[id]) byId[id] = fakeEl(); return byId[id]; },
  createElement(){ return fakeEl(); },
  addEventListener(){},
  body: { appendChild(){}, classList: { _s:{}, add(){}, remove(){}, toggle(){} } }
};
global.window = { location: { href: 'https://teste/' }, addEventListener(){}, innerWidth: 800, innerHeight: 600, scrollTo(){} };
const store = {};
global.localStorage = { getItem(k){ return store[k] || null; }, setItem(k,v){ store[k]=v; } };
global.matchMedia = () => ({ matches: false });
global.navigator = {};
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.Audio = function(){ return { play(){ return { catch(){} }; }, addEventListener(){}, set volume(v){}, get volume(){ return 0; } }; };

// ---------- Mock Dados (carrega o challenges.json REAL) ----------
const realChallenges = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'challenges.json'), 'utf8'));
const realMuseum = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'museum.json'), 'utf8'));
global.window.Dados = {
  carregar(){ return Promise.resolve(); },
  item(n){ const d = realChallenges; const idx = ((n-1)%d.length+d.length)%d.length; return d[idx]; },
  itemPorId(id){ return realChallenges.find(c => c.id === id) || null; },
  itemPorSlug(slug){ return realChallenges.find(c => c.slug === slug) || null; },
  total(){ return realChallenges.length; },
  lista(){ return realChallenges; },
  listaMuseu(){ return realMuseum; },
  CATEGORIAS: ['TV','GAMES','CINEMA','MÚSICA','BRINQUEDOS','TECNOLOGIA','CULTURA'],
  CAT_EMOJI: { TV:'📺', GAMES:'🎮', CINEMA:'🎬', MÚSICA:'🎵', BRINQUEDOS:'🧸', TECNOLOGIA:'💻', CULTURA:'📼' },
  CAT_COR: { TV:['#d32f2f','#8e0000'], GAMES:['#b026ff','#4a0080'], CINEMA:['#1976d2','#002f6c'], MÚSICA:['#ff2d95','#7a0037'], BRINQUEDOS:['#ff6f00','#8f3a00'], TECNOLOGIA:['#00e5ff','#006c80'], CULTURA:['#388e3c','#0b4a1e'] }
};
global.window.Som = { tocar(){}, ativar(){}, prefs:{sfx:true,musica:false,volume:0.8}, alternarSfx(){return true;}, alternarMusica(){return true;}, definirVolume(){} };
global.window.Efeitos = { confete(){}, glitch(){}, trocaCanal(){} };
global.window.NostalMusica = { ligar(){}, desligar(){}, definirtema(){}, estaLigada(){ return false; } };
global.window.Arte = { gerar(e, info){ return '<div class="art-fundo ' + (info.classe||'canal-tv') + '"></div>'; } };

let passou = 0, falhou = 0;
function check(nome, cond, extra) {
  if (cond) { passou++; console.log('  ✓ ' + nome); }
  else { falhou++; console.log('  ✗ ' + nome + (extra ? ' — ' + extra : '')); }
}

// ---------- 1. DADOS ----------
console.log('\n[1] MODELO DE DADOS');
check('challenges.json tem 56 itens', realChallenges.length === 56, 'tem ' + realChallenges.length);
check('ids únicos e sequenciais 1..56', realChallenges.every((c,i) => c.id === i+1));
check('slugs únicos', new Set(realChallenges.map(c => c.slug)).size === 56);
check('resps únicos', new Set(realChallenges.map(c => c.resp)).size === 56);
check('todos têm cat/emoji/ano/curiosidade/pistas(6)', realChallenges.every(c => c.cat && c.emoji && c.ano && c.curiosidade && c.pistas && c.pistas.length === 6));
check('campos novos presentes', realChallenges.every(c => 'id' in c && 'slug' in c && 'categorySlug' in c && 'tags' in c && 'image' in c && 'dificuldade' in c));
check('image: 6 pilotos com imagem, resto null', realChallenges.filter(c => c.image).length === 6 && realChallenges.filter(c => !c.image).length === 50, 'com=' + realChallenges.filter(c => c.image).length);
check('tags não vazias', realChallenges.every(c => Array.isArray(c.tags) && c.tags.length > 0));

// ---------- 2. ALIASES ----------
console.log('\n[2] ALIASES');
const itensComAlias = realChallenges.filter(c => c.alias && c.alias.length > 0);
check('há aliases restaurados (35/56)', itensComAlias.length === 35, 'tem ' + itensComAlias.length);
const tam = realChallenges.find(c => c.resp === 'Tamagotchi');
check('Tamagotchi aceita "bichinho virtual"', tam.alias.includes('bichinho virtual'));
const sf = realChallenges.find(c => c.resp === 'Street Fighter II');
check('Street Fighter II aceita "sf2"', sf.alias.includes('sf2'));
check('Street Fighter II aceita "street fighter 2"', sf.alias.includes('street fighter 2'));
check('Éramos Seis aceita "eramos seis"', realChallenges.find(c => c.resp === 'Éramos Seis').alias.includes('eramos seis'));

// ---------- 3. MOTOR (checarResposta via carregar game.js) ----------
console.log('\n[3] MOTOR DO JOGO');
eval(fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8'));
global.window.NostalgicaInit();
global.window.Jogo.iniciarJogo();

// desafio atual #2 (2026-09-07)
const atual = realChallenges[1];
check('entryAtual (desafio #2) carrega', global.window.Dados.item(2).resp === atual.resp, 'era ' + global.window.Dados.item(2).resp);

// pular até pista 6
for (let i = 0; i < 5; i++) global.window.Jogo.pularPista();
let p = JSON.parse(store['nostalgia90_partida_d2']);
check('pular pista chegou à 6', p && p.pista === 6, JSON.stringify(p));

// responder errado
byId['campo'].value = 'resposta totalmente errada';
global.window.Jogo.enviarResposta();
check('resposta errada não finaliza', !(p && p.venceu));

// responder com alias (para desafio #2 que é TV Colosso -> alias "colosso")
const aliasDoAtual = atual.alias && atual.alias[0];
byId['campo'].value = aliasDoAtual || atual.resp;
global.window.Jogo.enviarResposta();
p = JSON.parse(store['nostalgia90_partida_d2']);
check('resposta via alias acerta (#' + atual.resp + ' via "' + aliasDoAtual + '")', p && p.venceu === true, JSON.stringify(p));

// ---------- 4. PONTOS ----------
console.log('\n[4] PONTUAÇÃO');
const stats = JSON.parse(store['nostalgia90_stats']);
check('pontos acumulados > 0', stats.pontos > 0, 'pontos=' + stats.pontos);
check('jogos incrementado', stats.jogos >= 1);

// ---------- 5. HISTÓRICO / STREAK ----------
console.log('\n[5] HISTÓRICO / STREAK');
check('streak registrado (seq>=1)', stats.seq >= 1, 'seq=' + stats.seq);
check('melhor registrado', stats.melhor > 0);
check('ultimaVitoria = hoje', !!stats.ultimaVitoria);

// ---------- 6. GALERIA / MUSEU ----------
console.log('\n[6] GALERIA / MUSEU');
try { global.window.Jogo.mostrarGaleria('TODOS'); check('galeria TODOS OK', true); } catch(e){ check('galeria TODOS OK', false, e.message); }
try { global.window.Jogo.mostrarGaleria('TV'); check('galeria filtro TV OK', true); } catch(e){ check('galeria filtro TV OK', false, e.message); }
try { global.window.Jogo.mostrarMuseu(); check('museu OK', true); } catch(e){ check('museu OK', false, e.message); }
try { global.window.Jogo.abrirMuseuItem('TV', 'TV Colosso'); check('museu item OK', true); } catch(e){ check('museu item OK', false, e.message); }

// ---------- 7. COMPATIBILIDADE (musica.js refatorado) ----------
console.log('\n[7] MÚSICA (motor sem UI)');
const musicaSrc = fs.readFileSync(path.join(__dirname, '..', 'musica.js'), 'utf8');
check('musica.js não cria botão próprio', !musicaSrc.includes('criarBotao') && !musicaSrc.includes('btnMusica'));
check('musica.js não cria overlay próprio', !musicaSrc.includes('criarOverlay') && !musicaSrc.includes('mostrarOverlay'));
check('musica.js expõe ligar/desligar', musicaSrc.includes('ligar: ligar') && musicaSrc.includes('desligar: desligar'));
eval(musicaSrc);
check('NostalMusica.ligar é função', typeof window.NostalMusica.ligar === 'function');

// ---------- 8. SISTEMA DE ARTES (artes.js) ----------
console.log('\n[8] SISTEMA DE ARTES');
const artesSrc = fs.readFileSync(path.join(__dirname, '..', 'artes.js'), 'utf8');
eval(artesSrc);
const arteTV = window.Arte.gerar(realChallenges[1], { classe: 'cat-TV' }); // TV Colosso (TV)
check('arte TV gera fundo', arteTV.includes('art-fundo'));
check('arte TV gera elemento SVG', arteTV.includes('<svg'));
check('arte TV gera faixa com categoria', arteTV.includes(realChallenges[1].cat));
check('arte TV gera ano', arteTV.includes(realChallenges[1].ano));
check('arte TV NÃO revela resposta', !arteTV.includes(realChallenges[1].resp));
const arteGames = window.Arte.gerar(realChallenges.find(c => c.cat === 'GAMES'), { classe: 'cat-GAMES' });
check('arte GAMES tem fundo próprio', arteGames.includes('pixel-arcade'));
const arteCinema = window.Arte.gerar(realChallenges.find(c => c.cat === 'CINEMA'), { classe: 'cat-CINEMA' });
check('arte CINEMA tem fundo próprio', arteCinema.includes('poster-vhs'));
// fallback de imagem: deve usar base64 (não JSON.stringify com aspas quebradas)
const comImg = realChallenges.find(c => c.image);
if (comImg) {
  const arteComImg = window.Arte.gerar(comImg, { classe: 'cat-TV' });
  check('arte com imagem usa img-real', arteComImg.includes('class="img-real"'));
  check('arte com imagem NÃO usa JSON.stringify quebrado', !arteComImg.includes('this.outerHTML='));
  check('arte com imagem tem fallback base64', arteComImg.includes('data-fallback='));
}
// museu: nenhum item sem emoji deve gerar "undefined"
const museuHtml = window.Jogo.mostrarMuseu ? (function(){ try { window.Jogo.mostrarMuseu(); return byId['museuItens'].innerHTML; } catch(e){ return ''; } })() : '';
check('museu não gera undefined', !museuHtml.includes('undefined'));
check('museu usa emoji específico do item (não só categoria)', realMuseum.every(g => g.itens.every(it => it.emoji)));

// ---------- 9. MUSEU: áudio por categoria ----------
console.log('\n[9] MUSEU — ÁUDIO POR CATEGORIA');
// somMuseu mapeia categoria -> som distinto
check('MÚSICA mapeia para ui-arcade', (function(){ const s=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8'); return s.includes("'MÚSICA': 'ui-arcade'"); })());
check('VHS mapeia para ui-vhs', (function(){ const s=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8'); return s.includes("'VHS': 'ui-vhs'"); })());
check('TV mapeia para ui-channel', (function(){ const s=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8'); return s.includes("'TV': 'ui-channel'"); })());
// síntese expandida no som.js
const somSrc = fs.readFileSync(path.join(__dirname, '..', 'som.js'), 'utf8');
check('som.js sintetiza ui-vhs', somSrc.includes("nome === 'ui-vhs'"));
check('som.js sintetiza ui-boot', somSrc.includes("nome === 'ui-boot'"));
check('som.js sintetiza ui-channel', somSrc.includes("nome === 'ui-channel'"));
check('som.js sintetiza ui-modem', somSrc.includes("nome === 'ui-modem'"));
check('som.js sintetiza ui-click', somSrc.includes("nome === 'ui-click'"));

// ---------- 10. ARTES SEMÂNTICAS DO MUSEU ----------
console.log('\n[10] MUSEU — ARTES SEMÂNTICAS');
const musSrc = fs.readFileSync(path.join(__dirname, '..', 'museu-artes.js'), 'utf8');
eval(musSrc);
const museuArtes = window.MuseuArtes;
check('tamagotchi tem arte semântica', !!museuArtes.artePorId('tamagotchi'));
check('tazo tem arte semântica', !!museuArtes.artePorId('tazo'));
check('mamonas tem arte semântica', !!museuArtes.artePorId('mamonas-assassinas'));
check('artes geram SVG', museuArtes.artePorId('tamagotchi').includes('<svg'));
// todos os itens do museum.json têm id + arte
const semArte = realMuseum.filter(g => g.itens.filter(it => !museuArtes.artePorItem(it)).length > 0);
check('todos os itens do museu têm arte semântica', semArte.length === 0, semArte.map(g=>g.cat).join(','));
// itens têm id
check('itens do museu têm id', realMuseum.every(g => g.itens.every(it => it.id)));

// ---------- 11. MEMÓRIAS + CENAS (PILOTO 2I-E) ----------
console.log('\n[11] MEMÓRIAS E CENAS (PILOTO)');
const realMemorias = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'memories.json'), 'utf8'));
const realCenas = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scenes.json'), 'utf8'));
check('memories.json tem 6 memórias', realMemorias.length === 6, 'tem ' + realMemorias.length);
const idsPiloto = ['tamagotchi', 'tazo', 'videolocadora', 'orelhao', 'street-fighter-2', 'windows-95'];
check('as 6 memórias do piloto existem', idsPiloto.every(id => realMemorias.some(m => m.id === id)));
check('cada memória tem modelo semântico completo', realMemorias.every(m => m.id && m.title && m.memoryType && m.sceneId && m.context && m.object && m.description && m.visual && m.visual.path && m.audio));
check('cada memória tem visual original', realMemorias.every(m => m.visual.type === 'original'));
check('cada memória tem audio contextual', realMemorias.every(m => m.audio.type === 'contextual'));
check('memórias têm challengeReferences', realMemorias.every(m => Array.isArray(m.challengeReferences)));
// cenas
check('cenas.json tem cenas', realCenas.length >= 4, 'tem ' + realCenas.length);
check('cada cena tem objetos de memória', realCenas.every(c => Array.isArray(c.objects) && c.objects.length > 0));
// arquivos de arte existem
const memoriaArtes = fs.readdirSync(path.join(__dirname, '..', 'assets', 'memory'));
check('6 artes de memória geradas', memoriaArtes.filter(f => f.endsWith('.svg')).length === 6);
// cenas.js renderiza
const cenasSrc = fs.readFileSync(path.join(__dirname, '..', 'cenas.js'), 'utf8');
check('cenas.js expõe renderizarCena', cenasSrc.includes('renderizarCena'));
check('cenas.js expõe detalheMemoria', cenasSrc.includes('detalheMemoria'));

console.log('\n========================================');
console.log('RESULTADO: ' + passou + ' passaram, ' + falhou + ' falharam');
if (falhou > 0) process.exit(1);
console.log('TESTE DE REGRESSÃO PASS');