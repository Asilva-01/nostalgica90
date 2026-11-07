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
const POOL = JSON.parse(fs.readFileSync(path.join(ROOT, 'challenges.json'), 'utf8')).length;

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

const r1 = Selecao.rodadaDoDia('2026-09-06', POOL);
check('rodada dia 1 tem 3 índices', r1.indices.length === 3);
check('ids = indices+1', r1.ids.every(function (id, i) { return id === r1.indices[i] + 1; }));

// Sem repetir dentro do ciclo
const cicloLen = Selecao.diasPorCiclo(POOL);
const vistos = new Set();
let repetiu = false;
for (let d = 0; d < cicloLen; d++) {
  const iso = addDays('2026-09-06', d);
  const r = Selecao.rodadaDoDia(iso, POOL);
  r.indices.forEach(function (ix) {
    if (vistos.has(ix)) repetiu = true;
    vistos.add(ix);
  });
}
check('ciclo 1 sem repetir índices', !repetiu && vistos.size === cicloLen * 3, 'únicos=' + vistos.size);
check('ciclo 1 deixa (pool%3) de fora', vistos.size === POOL - (POOL % 3), 'únicos=' + vistos.size);

const ciclo2 = new Set();
for (let d = 0; d < cicloLen; d++) {
  Selecao.rodadaDoDia(addDays('2026-09-06', cicloLen + d), POOL).indices.forEach(function (ix) {
    ciclo2.add(ix);
  });
}
check('ciclo 2 também tem 54 únicos', ciclo2.size === 54, 'únicos=' + ciclo2.size);

// Mesma data = mesma rodada
const a = Selecao.rodadaDoDia('2026-11-07', POOL);
const b = Selecao.rodadaDoDia('2026-11-07', POOL);
check('determinística (mesma data, mesmo resultado)', JSON.stringify(a.indices) === JSON.stringify(b.indices));

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
    const js = Selecao.rodadaDoDia(iso, POOL);
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
