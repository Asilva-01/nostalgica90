#!/usr/bin/env node
/* ============================================================
   Compara a regra da rodada em JS (selecao-rodada.js) e
   Python (.github/scripts/selecao_rodada.py) para várias datas.
   Uso: node tools/test_selecao.js
   ============================================================ */
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const Selecao = require(path.join(ROOT, 'selecao-rodada.js'));
const PY = path.join(ROOT, '.github', 'scripts', 'selecao_rodada.py');
const pool = JSON.parse(fs.readFileSync(path.join(ROOT, 'challenges.json'), 'utf8'));
const POOL = pool.length;
const arteSlugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'arte-propria.json'), 'utf8'));
const TEM_ARTE = Selecao.flagsDeSlugs(pool, arteSlugs);

function rodada(iso) {
  return Selecao.rodadaDoDia(iso, POOL, TEM_ARTE);
}

let passou = 0, falhou = 0;
function check(nome, cond, extra) {
  if (cond) { passou++; console.log('  ✓ ' + nome); }
  else { falhou++; console.log('  ✗ ' + nome + (extra ? ' — ' + extra : '')); }
}

function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

const DATAS = [
  '2026-09-06', // dia 1
  '2026-09-07',
  '2026-09-23', // último dia do 1º ciclo (18 dias: 6..23)
  '2026-09-24', // ciclo 2
  '2026-11-01', // antigo wrap do desafio único
  '2026-11-07',
  '2026-11-08',
  '2026-11-09',
  '2026-11-26',
  '2026-12-31',
  '2027-01-01',
  '2027-09-06'
];

console.log('\n[seleção] pool=' + POOL + ' round=' + Selecao.ROUND_SIZE);

check('dia 1 = 2026-09-06', Selecao.numeroDoDia('2026-09-06') === 1);
check('2026-09-07 = dia 2', Selecao.numeroDoDia('2026-09-07') === 2);
check('2026-11-01 = dia 57', Selecao.numeroDoDia('2026-11-01') === 57, 'foi ' + Selecao.numeroDoDia('2026-11-01'));
check('2026-11-07 = dia 63', Selecao.numeroDoDia('2026-11-07') === 63, 'foi ' + Selecao.numeroDoDia('2026-11-07'));
check('diasPorCiclo(56)=18', Selecao.diasPorCiclo(56) === 18);

const r1 = rodada('2026-09-06');
check('rodada dia 1 tem 3 índices', r1.indices.length === 3);
check('ids = indices+1', r1.ids.every(function (id, i) { return id === r1.indices[i] + 1; }));

check('arte-propria.json tem 28 slugs', arteSlugs.length === 28, 'tem ' + arteSlugs.length);
check('todo slug de arte existe no pool', arteSlugs.every(function (s) { return pool.some(function (c) { return c.slug === s; }); }));
check('flagsDeSlugs marca 28 verdadeiros', TEM_ARTE.filter(Boolean).length === 28, 'n=' + TEM_ARTE.filter(Boolean).length);

// Sem repetir dentro do ciclo
const cicloLen = Selecao.diasPorCiclo(POOL);
const vistos = new Set();
let repetiu = false;
for (let d = 0; d < cicloLen; d++) {
  const iso = addDays('2026-09-06', d);
  const r = rodada(iso);
  r.indices.forEach(function (ix) {
    if (vistos.has(ix)) repetiu = true;
    vistos.add(ix);
  });
}
check('ciclo 1 sem repetir índices', !repetiu && vistos.size === cicloLen * 3, 'únicos=' + vistos.size);
check('ciclo 1 deixa (pool%3) de fora', vistos.size === POOL - (POOL % 3), 'únicos=' + vistos.size);

const p0 = Selecao.permutacaoComCarry(POOL, 0);
const p1 = Selecao.permutacaoComCarry(POOL, 1);
const leftover0 = p0.slice(54);
const unused = [];
for (let i = 0; i < POOL; i++) if (!vistos.has(i)) unused.push(i);
check('leftovers do ciclo 1 = cauda da permutação', leftover0.length === 2 && leftover0.every(function (ix) { return unused.indexOf(ix) !== -1; }), JSON.stringify({ leftover0: leftover0, unused: unused }));
check('ciclo 2 começa com os 2 que sobraram', p1[0] === leftover0[0] && p1[1] === leftover0[1], 'p1=' + p1.slice(0, 3).join(',') + ' leftover=' + leftover0.join(','));

const ciclo2 = new Set();
for (let d = 0; d < cicloLen; d++) {
  rodada(addDays('2026-09-06', cicloLen + d)).indices.forEach(function (ix) {
    ciclo2.add(ix);
  });
}
check('ciclo 2 também tem 54 únicos', ciclo2.size === 54, 'únicos=' + ciclo2.size);
check('os 2 que sobraram entram no ciclo 2', leftover0.every(function (ix) { return ciclo2.has(ix); }), 'faltou ' + leftover0.filter(function (ix) { return !ciclo2.has(ix); }).join(','));

// Mesma data = mesma rodada
const a = rodada('2026-11-07');
const b = rodada('2026-11-07');
check('determinística (mesma data, mesmo resultado)', JSON.stringify(a.indices) === JSON.stringify(b.indices));

function primeiroTemArteSeHouver(iso) {
  const r = rodada(iso);
  const algum = r.indices.some(function (ix) { return TEM_ARTE[ix]; });
  if (!algum) return true;
  return !!TEM_ARTE[r.indices[0]];
}

let semArtePrimeiro = 0;
const datasArte = [];
for (let d = 0; d <= 54; d++) {
  const iso = addDays('2026-11-07', d);
  datasArte.push(iso);
  if (!primeiroTemArteSeHouver(iso)) semArtePrimeiro++;
}
check('07/11–31/12: 1º da rodada tem arte própria quando o trio tem', semArtePrimeiro === 0, 'falhas=' + semArtePrimeiro);

['2026-11-08', '2026-11-09', '2026-11-26'].forEach(function (iso) {
  const r = rodada(iso);
  const slugs = r.indices.map(function (ix) { return pool[ix].slug; });
  check(iso + ' 1º tem arte própria (' + slugs[0] + ')', !!TEM_ARTE[r.indices[0]], 'trio=' + slugs.join(','));
});

const rot = Selecao.priorizarArte([1, 2, 3], [false, false, true, false]);
check('priorizarArte rotaciona o 1º com arte para a frente', JSON.stringify(rot) === JSON.stringify([2, 3, 1]), JSON.stringify(rot));
const rot0 = Selecao.priorizarArte([1, 2, 3], [false, true, true, true]);
check('priorizarArte não mexe se o 1º já tem arte', JSON.stringify(rot0) === JSON.stringify([1, 2, 3]));
const rotN = Selecao.priorizarArte([1, 2, 3], [false, false, false, false]);
check('priorizarArte sem arte no trio permanece', JSON.stringify(rotN) === JSON.stringify([1, 2, 3]));

console.log('\n[JS vs Python]');
let pyOk = true;
let pyOut;
try {
  pyOut = execFileSync('python3', [PY, '--pool', String(POOL), '--datas', DATAS.join(',')], {
    encoding: 'utf8',
    cwd: ROOT
  });
} catch (e) {
  pyOk = false;
  check('python3 executou selecao_rodada.py', false, e.message);
}

if (pyOk) {
  let pyList;
  try {
    pyList = JSON.parse(pyOut);
    if (!Array.isArray(pyList)) pyList = [pyList];
  } catch (e) {
    check('python devolveu JSON', false, pyOut.slice(0, 200));
    pyList = [];
  }
  check('python devolveu ' + DATAS.length + ' datas', pyList.length === DATAS.length, 'len=' + pyList.length);
  DATAS.forEach(function (iso, i) {
    const js = rodada(iso);
    const py = pyList[i] || {};
    const same =
      js.n === py.n &&
      js.ciclo === py.ciclo &&
      js.posicao === py.posicao &&
      JSON.stringify(js.indices) === JSON.stringify(py.indices) &&
      JSON.stringify(js.ids) === JSON.stringify(py.ids) &&
      js.primeiroId === py.primeiroId;
    check(iso + ' JS=PY n=' + js.n + ' ids=' + js.ids.join(','), same,
      'JS=' + JSON.stringify(js) + ' PY=' + JSON.stringify(py));
  });
}

console.log('\n========================================');
console.log('RESULTADO: ' + passou + ' passaram, ' + falhou + ' falharam');
if (falhou > 0) process.exit(1);
console.log('TESTE DE SELEÇÃO PASS');
