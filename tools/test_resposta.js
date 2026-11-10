#!/usr/bin/env node
/* ============================================================
   Comparação flexível de respostas (resposta.js)
   Uso: node tools/test_resposta.js
   Casos: acento/caixa, artigo, typo, alias, fragmento curto,
   trecho distintivo, pontuação da alternativa.
   ============================================================ */
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const Resposta = require(path.join(ROOT, 'resposta.js'));
const pool = JSON.parse(fs.readFileSync(path.join(ROOT, 'challenges.json'), 'utf8'));

let passou = 0, falhou = 0;
function check(nome, cond, extra) {
  if (cond) { passou++; console.log('  ✓ ' + nome); }
  else { falhou++; console.log('  ✗ ' + nome + (extra ? ' — ' + extra : '')); }
}

function item(resp) {
  const c = pool.find(x => x.resp === resp);
  if (!c) throw new Error('desafio não encontrado: ' + resp);
  return c;
}
function ok(texto, resp) { return Resposta.corresponde(texto, item(resp), pool); }

console.log('\n[resposta] normalizar / artigos');
check('caixa e acento: FÓRMULA 1 = Fórmula 1', ok('FÓRMULA 1', 'Fórmula 1'));
check('artigo o/a: "o Chaves" acerta Chaves', ok('o Chaves', 'Chaves'));
check('artigo os: "os Cavaleiros do Zodíaco"', ok('os Cavaleiros do Zodíaco', 'Cavaleiros do Zodíaco'));
check('artigo a: "a Copa do Mundo"', ok('a Copa do Mundo', 'Copa do Mundo'));
check('sem artigo continua valendo', ok('Chaves', 'Chaves'));

console.log('\n[resposta] alias');
check('Ayrton Senna acerta Senna', ok('Ayrton Senna', 'Senna'));
check('airton senna (grafia popular) acerta Senna', ok('airton senna', 'Senna'));
check('dbz acerta Dragon Ball Z', ok('dbz', 'Dragon Ball Z'));
check('saint seiya acerta Cavaleiros do Zodíaco', ok('saint seiya', 'Cavaleiros do Zodíaco'));
check('gugu acerta Gugu Liberato', ok('gugu', 'Gugu Liberato'));
const gugu = item('Gugu Liberato');
check('Gugu não tem o nome completo errado', !gugu.alias.some(a => /antonio oliveira/i.test(a)), JSON.stringify(gugu.alias));
check('Gugu aceita o nome civil correto', ok('antonio martins luiz de oliveira', 'Gugu Liberato'));
check('sf2 continua acertando Street Fighter II', ok('sf2', 'Street Fighter II'));
check('bichinho virtual continua acertando Tamagotchi', ok('bichinho virtual', 'Tamagotchi'));

console.log('\n[resposta] typo curto');
check('sena (1 letra) acerta Senna', ok('sena', 'Senna'));
check('titanik acerta Titanic', ok('titanik', 'Titanic'));
check('typo não acerta palpite qualquer', !ok('banana', 'Senna'));

console.log('\n[resposta] fragmento curto / ambíguo rejeitado');
check('"super" NÃO acerta Super Nintendo', !ok('super', 'Super Nintendo'));
check('"super" NÃO acerta Super Trunfo', !ok('super', 'Super Trunfo'));
check('"super" NÃO acerta Super Mario World', !ok('super', 'Super Mario World'));
check('"park" NÃO acerta Jurassic Park', !ok('park', 'Jurassic Park'));
check('"copa" NÃO acerta Copa do Mundo', !ok('copa', 'Copa do Mundo'));
check('"santos" NÃO acerta Silvio Santos', !ok('santos', 'Silvio Santos'));
check('palpite genérico não acerta', !ok('jogo', 'Street Fighter II'));

console.log('\n[resposta] trecho distintivo / substancial');
check('"nintendo" acerta Super Nintendo (alias já existente)', ok('nintendo', 'Super Nintendo'));
check('"jurassic" acerta Jurassic Park', ok('jurassic', 'Jurassic Park'));
check('"silvio" acerta Silvio Santos', ok('silvio', 'Silvio Santos'));
check('"dragon ball" acerta Dragon Ball Z', ok('dragon ball', 'Dragon Ball Z'));
check('"baixinho" acerta Romário', ok('baixinho', 'Romário'));

console.log('\n[resposta] pontuação');
check('digitação pista 1 = 100', Resposta.pontosDaPista(1) === 100);
check('digitação pista 6 = 10', Resposta.pontosDaPista(6) === 10);
check('alternativa é metade da digitação', Resposta.pontosDaAlternativa(1) === 50 && Resposta.pontosDaAlternativa(6) === 5);
check('tabela antiga preservada', JSON.stringify(Resposta.PONTOS) === JSON.stringify({ 1: 100, 2: 80, 3: 60, 4: 40, 5: 20, 6: 10 }));

console.log('\n[resposta] alternativas (4 opções, 1 correta, determinístico)');
const senna = item('Senna');
const a1 = Resposta.alternativasPlausiveis(senna, pool, 3);
const a2 = Resposta.alternativasPlausiveis(senna, pool, 3);
check('sempre 4 opções', a1.length === 4);
check('inclui a correta', a1.indexOf('Senna') >= 0);
check('sem duplicata', new Set(a1).size === 4);
check('embaralho determinístico', a1.join('|') === a2.join('|'));
const cats = a1.filter(n => n !== 'Senna').map(n => pool.find(c => c.resp === n).cat);
check('distratores preferem a mesma categoria', cats.filter(c => c === senna.cat).length >= 1, cats.join(','));
const digimon = item('Digimon');
check('Digimon é TV, não GAMES (não vira distrator de fliperama)', digimon.cat === 'TV' && digimon.categorySlug === 'tv');
const issAlts = Resposta.alternativasPlausiveis(item('ISS Deluxe'), pool, 3);
const snesAlts = Resposta.alternativasPlausiveis(item('Super Nintendo'), pool, 3);
check('Digimon não aparece nas alternativas de ISS Deluxe', issAlts.indexOf('Digimon') < 0, issAlts.join('|'));
check('Digimon não aparece nas alternativas de Super Nintendo', snesAlts.indexOf('Digimon') < 0, snesAlts.join('|'));
check('distratores de ISS Deluxe são GAMES', issAlts.filter(n => n !== 'ISS Deluxe').every(n => pool.find(c => c.resp === n).cat === 'GAMES'), issAlts.join('|'));

console.log('\n[resposta] os 19 antigos têm alias');
const ids19 = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 34];
const faltando = pool.filter(c => ids19.indexOf(c.id) >= 0 && (!c.alias || !c.alias.length));
check('19 antigos com alias', faltando.length === 0, faltando.map(c => c.id).join(','));
check('nenhum desafio sem alias', pool.every(c => Array.isArray(c.alias) && c.alias.length > 0));

console.log('\n========================================');
console.log('RESULTADO: ' + passou + ' passaram, ' + falhou + ' falharam');
if (falhou > 0) process.exit(1);
console.log('TESTE DE RESPOSTA PASS');
