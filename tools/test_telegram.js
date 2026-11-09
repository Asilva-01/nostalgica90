#!/usr/bin/env node
/* ============================================================
   Bot do Telegram — 3 postagens da rodada, sem gabarito.
   Uso: node tools/test_telegram.js
   Roda o script em --dry-run (não dispara o workflow, não posta).
   ============================================================ */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PY = path.join(ROOT, '.github', 'scripts', 'bot_diario.py');
const YML = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'telegram-diario.yml'), 'utf8');
const BOT = fs.readFileSync(PY, 'utf8');
const pool = JSON.parse(fs.readFileSync(path.join(ROOT, 'challenges.json'), 'utf8'));

let passou = 0, falhou = 0;
function check(nome, cond, extra) {
  if (cond) { passou++; console.log('  ✓ ' + nome); }
  else { falhou++; console.log('  ✗ ' + nome + (extra ? ' — ' + extra : '')); }
}

console.log('\n[telegram] workflow');
check('cron 09:00 SP (12:00 UTC)', YML.includes('cron: "0 12 * * *"'));
check('cron 14:00 SP (17:00 UTC)', YML.includes('cron: "0 17 * * *"'));
check('cron 18:00 SP (21:00 UTC)', YML.includes('cron: "0 21 * * *"'));
check('workflow_dispatch com 1/2/3/todas', YML.includes('todas') && YML.includes('options:'));
check('POST_SLOT vem do input ou do cron', YML.includes('github.event.inputs.memoria') && YML.includes('github.event.schedule'));
check('secrets inalterados (nomes)', YML.includes('secrets.TELEGRAM_BOT_TOKEN') && YML.includes('secrets.TELEGRAM_CHAT_ID') && YML.includes('secrets.SITE_URL'));
check('workflow não imprime secrets', !YML.includes('echo') || !/echo.*TELEGRAM/.test(YML));

console.log('\n[telegram] script');
check('não interpola resp/alias na mensagem', !BOT.includes('desafio.get("resp")') && !BOT.includes("desafio['resp']") && !BOT.includes('desafio.get("alias")'));
check('não posta categoria isolada', !BOT.includes('desafio.get("cat")') && !BOT.includes("['cat']"));
check('dry-run existe', BOT.includes('--dry-run') && BOT.includes('DRY_RUN'));
check('três textos distintos por slot', BOT.includes('memória 1 de 3') && BOT.includes('memória 2 de 3') && BOT.includes('memória 3 de 3'));

function dry(slot) {
  return execFileSync('python3', [PY, '--slot', slot, '--dry-run'], {
    encoding: 'utf8',
    env: Object.assign({}, process.env, { SITE_URL: 'https://asilva-01.github.io/nostalgica90/' })
  });
}

console.log('\n[telegram] dry-run das 3 memórias');
const t1 = dry('1');
const t2 = dry('2');
const t3 = dry('3');
check('slot 1 menciona memória 1', t1.includes('memória 1 de 3'));
check('slot 2 menciona memória 2', t2.includes('memória 2 de 3'));
check('slot 3 menciona memória 3', t3.includes('memória 3 de 3'));
check('as três mensagens são diferentes', t1 !== t2 && t2 !== t3 && t1 !== t3);
check('todas levam ao site', [t1, t2, t3].every(t => t.includes('https://asilva-01.github.io/nostalgica90/')));
check('nenhuma diz revelação/gabarito da resposta', [t1, t2, t3].every(t => !/a resposta era/i.test(t) && !t.includes('alias')));

const todas = dry('todas');
check('--slot todas gera as 3', (todas.match(/memória 1 de 3/g) || []).length >= 1 && (todas.match(/memória 2 de 3/g) || []).length >= 1 && (todas.match(/memória 3 de 3/g) || []).length >= 1);

const Selecao = require(path.join(ROOT, 'selecao-rodada.js'));
const arteSlugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'arte-propria.json'), 'utf8'));
const flags = Selecao.flagsDeSlugs(pool, arteSlugs);
const hoje = Selecao.hojeIso();
const rodada = Selecao.rodadaDoDia(hoje, pool.length, flags);
rodada.indices.forEach(function (idx, i) {
  const d = pool[idx];
  const out = i === 0 ? t1 : i === 1 ? t2 : t3;
  check('slot ' + (i + 1) + ' não vaza resp de #' + d.id, !out.toLowerCase().includes(d.resp.toLowerCase()) || (d.pistas[0] || '').toLowerCase().includes(d.resp.toLowerCase()));
  const aliasLongo = (d.alias || []).filter(a => a.length >= 6);
  const vazouAlias = aliasLongo.some(a => out.toLowerCase().includes(a.toLowerCase()) && !(d.pistas[0] || '').toLowerCase().includes(a.toLowerCase()));
  check('slot ' + (i + 1) + ' não vaza alias de #' + d.id, !vazouAlias);
});

console.log('\n========================================');
console.log('RESULTADO: ' + passou + ' passaram, ' + falhou + ' falharam');
if (falhou > 0) process.exit(1);
console.log('TESTE DE TELEGRAM PASS');
