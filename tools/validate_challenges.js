#!/usr/bin/env node
/* ============================================================
   NOSTÁLGICA 90 — Validador de challenges.json
   Uso: node tools/validate_challenges.js

   Obrigatório em todo item: id, slug, resp, cat, 6 pistas.
   Opcional: alias, dificuldade, som, curiosidade, link_saiba_mais,
   image, credito_imagem, image_avif, image_alt, tags, categorySlug.

   Se image for não-nula/não-vazia, credito_imagem precisa de
   autor, licenca (lista permitida), url_licenca e url_origem (https),
   e o arquivo precisa existir.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'challenges.json');
const DIFICULDADES_OK = new Set([null, undefined, '', 'facil', 'medio', 'dificil', 'fácil', 'médio', 'difícil']);
const LICENCAS_OK = new Set([
  'CC0', 'CC0 1.0',
  'Public Domain', 'PD',
  'CC BY', 'CC BY 1.0', 'CC BY 2.0', 'CC BY 2.5', 'CC BY 3.0', 'CC BY 4.0',
  'CC BY 2.0 br', 'CC BY 3.0 br',
  'CC BY-SA', 'CC BY-SA 1.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5', 'CC BY-SA 3.0', 'CC BY-SA 4.0'
]);

function fail(msg, extra) {
  console.error('  ✗ ' + msg + (extra ? ' — ' + extra : ''));
}

function ok(msg) {
  console.log('  ✓ ' + msg);
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isHttps(v) {
  if (!isNonEmptyString(v)) return false;
  try {
    const u = new URL(v);
    return u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function licencaOk(v) {
  if (!isNonEmptyString(v)) return false;
  const n = v.trim().replace(/\s+/g, ' ');
  if (LICENCAS_OK.has(n)) return true;
  const upper = n.toUpperCase();
  return [...LICENCAS_OK].some(function (okLic) { return okLic.toUpperCase() === upper; });
}

function main() {
  if (!fs.existsSync(FILE)) {
    console.error('Arquivo não encontrado: ' + FILE);
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    console.error('JSON inválido: ' + e.message);
    process.exit(1);
  }
  if (!Array.isArray(data) || data.length === 0) {
    console.error('challenges.json precisa ser um array não vazio.');
    process.exit(1);
  }

  let falhas = 0;
  let comImagem = 0;
  const ids = new Map();
  const slugs = new Map();

  console.log('\n[validador] ' + data.length + ' desafios em challenges.json');

  data.forEach(function (c, i) {
    const where = 'item[' + i + '] id=' + (c && c.id);

    if (!c || typeof c !== 'object') {
      fail('item não é objeto', where);
      falhas++;
      return;
    }
    if (!Number.isInteger(c.id) || c.id < 1) {
      fail('id inteiro ≥ 1 obrigatório', where);
      falhas++;
    } else if (ids.has(c.id)) {
      fail('id duplicado ' + c.id, 'também em índice ' + ids.get(c.id));
      falhas++;
    } else {
      ids.set(c.id, i);
    }

    if (!isNonEmptyString(c.slug)) {
      fail('slug não vazio obrigatório', where);
      falhas++;
    } else if (slugs.has(c.slug)) {
      fail('slug duplicado "' + c.slug + '"', 'também em índice ' + slugs.get(c.slug));
      falhas++;
    } else {
      slugs.set(c.slug, i);
    }

    if (!isNonEmptyString(c.resp)) {
      fail('resp (resposta) não vazia obrigatória', where);
      falhas++;
    }
    if (!isNonEmptyString(c.cat)) {
      fail('cat (categoria) não vazia obrigatória', where);
      falhas++;
    }
    if (!Array.isArray(c.pistas) || c.pistas.length !== 6) {
      fail('precisa de exatamente 6 pistas', where + ' tem ' + (c.pistas && c.pistas.length));
      falhas++;
    } else if (c.pistas.some(function (p) { return !isNonEmptyString(p); })) {
      fail('alguma pista está vazia', where);
      falhas++;
    }

    if (c.alias != null && !Array.isArray(c.alias)) {
      fail('alias, se presente, deve ser array', where);
      falhas++;
    } else if (Array.isArray(c.alias) && c.alias.some(function (a) { return typeof a !== 'string'; })) {
      fail('alias só pode conter strings', where);
      falhas++;
    }

    if (!DIFICULDADES_OK.has(c.dificuldade)) {
      fail('dificuldade inválida', String(c.dificuldade));
      falhas++;
    }

    if (c.som != null) {
      if (typeof c.som === 'string') {
        if (!c.som.trim()) {
          fail('som string vazia', where);
          falhas++;
        }
      } else if (typeof c.som === 'object') {
        if (c.som.arquivo != null && !isNonEmptyString(c.som.arquivo)) {
          fail('som.arquivo vazio', where);
          falhas++;
        }
      } else {
        fail('som deve ser string, objeto ou null', where);
        falhas++;
      }
    }

    if (c.link_saiba_mais != null && c.link_saiba_mais !== '') {
      if (!isHttps(c.link_saiba_mais)) {
        fail('link_saiba_mais precisa ser https', where + ' ' + c.link_saiba_mais);
        falhas++;
      }
    }

    const temImagem = c.image != null && c.image !== '' && c.image !== false;
    if (temImagem) {
      comImagem++;
      if (!isNonEmptyString(c.image)) {
        fail('image precisa ser caminho string', where);
        falhas++;
      } else {
        const imgPath = path.join(ROOT, c.image);
        if (!fs.existsSync(imgPath)) {
          fail('arquivo de image não existe', c.image);
          falhas++;
        } else {
          const st = fs.statSync(imgPath);
          if (st.size > 80 * 1024) {
            fail('image acima de 80 KB', c.image + ' ' + st.size);
            falhas++;
          }
        }
      }
      if (c.image_avif) {
        const av = path.join(ROOT, c.image_avif);
        if (!fs.existsSync(av)) {
          fail('arquivo de image_avif não existe', c.image_avif);
          falhas++;
        }
      }
      const cred = c.credito_imagem;
      if (!cred || typeof cred !== 'object') {
        fail('credito_imagem obrigatório quando há image', where);
        falhas++;
      } else {
        if (!isNonEmptyString(cred.autor)) {
          fail('credito_imagem.autor obrigatório quando há image', where);
          falhas++;
        }
        if (!licencaOk(cred.licenca)) {
          fail('credito_imagem.licenca fora da lista permitida', where + ' ' + cred.licenca);
          falhas++;
        }
        if (!isHttps(cred.url_licenca)) {
          fail('credito_imagem.url_licenca https obrigatório quando há image', where);
          falhas++;
        }
        if (!isHttps(cred.url_origem)) {
          fail('credito_imagem.url_origem https obrigatório quando há image', where);
          falhas++;
        }
      }
    }
  });

  if (falhas === 0) {
    ok('ids únicos');
    ok('slugs únicos');
    ok('6 pistas e resposta em todos');
    ok('créditos de imagem válidos quando há image (' + comImagem + ')');
    ok('arquivos de image existem e cabem em ~80 KB');
    ok('links https (crédito e saiba mais)');
    ok('campos opcionais (alias, dificuldade, som, credito_imagem, link_saiba_mais) aceitos');
    console.log('\nVALIDADOR PASS (' + data.length + ' desafios, ' + comImagem + ' com foto livre)\n');
    process.exit(0);
  }
  console.error('\nVALIDADOR FAIL: ' + falhas + ' erro(s)\n');
  process.exit(1);
}

main();
