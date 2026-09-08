#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 1: Normaliza challenges.json.
- Restaura aliases a partir do HTML antigo (histórico git).
- Adiciona id (estável, 1..N na ordem atual), slug, categorySlug, tags, image, dificuldade.
- NÃO altera ordem, resp, pistas, cat, emoji, ano, curiosidade.
"""
import json
import re
import unicodedata

BASE = r'C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90'
OLD_HTML = BASE + r'\tools\_antigo_index.html'
CHALLENGES = BASE + r'\challenges.json'

def slugify(s):
    s = s.lower()
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

# --- 1. Ler challenges.json atual ---
with open(CHALLENGES, encoding='utf-8') as f:
    desafios = json.load(f)
print('desafios atuais:', len(desafios))

# --- 2. Extrair aliases do HTML antigo (bytes puros via git show) ---
import subprocess
aliases_map = {}
try:
    proc = subprocess.run(
        ['git', '-C', BASE, 'show', '27e49c9:index.html'],
        capture_output=True)
    html_bytes = proc.stdout
except Exception:
    html_bytes = open(OLD_HTML, 'rb').read()
html = html_bytes.decode('utf-8', errors='replace')
# items com alias: { resp: "X", alias: [...], pistas: [...] }
for m in re.finditer(r'\{\s*resp:\s*"([^"]+)"\s*,\s*alias:\s*\[([^\]]*)\]', html):
    resp = m.group(1)
    raw = m.group(2)
    aliases = [a.strip().strip('"') for a in raw.split(',') if a.strip().strip('"')]
    aliases_map[resp] = aliases
print('aliases recuperados do HTML antigo:', len(aliases_map), 'itens')

# --- 3. Mapa categoria -> categorySlug ---
cat_slug = {
    'TV': 'tv', 'GAMES': 'games', 'CINEMA': 'cinema', 'MÚSICA': 'musica',
    'BRINQUEDOS': 'brinquedos', 'TECNOLOGIA': 'tecnologia', 'CULTURA': 'cultura'
}

# --- 4. Montar novo JSON ---
novos = []
ids_usados = set()
slugs_usados = set()
for i, d in enumerate(desafios):
    # id estável: posição atual (1..N). Não existe id anterior; usamos ordem.
    cid = i + 1
    ids_usados.add(cid)
    slug = slugify(d['resp'])
    base_slug = slug
    n = 2
    while slug in slugs_usados:
        slug = base_slug + '-' + str(n)
        n += 1
    slugs_usados.add(slug)
    cat = d['cat']
    cs = cat_slug.get(cat, slugify(cat))
    # tags mínimas derivadas da categoria + resp (sem inventar fatos)
    tags = [cs, 'anos-90', 'brasil', 'nostalgia']
    novo = {
        'id': cid,
        'slug': slug,
        'categorySlug': cs,
        'resp': d['resp'],
        'alias': aliases_map.get(d['resp'], d.get('alias') or []),
        'cat': cat,
        'emoji': d['emoji'],
        'ano': d['ano'],
        'curiosidade': d['curiosidade'],
        'tags': tags,
        'image': d.get('image', None),
        'dificuldade': d.get('dificuldade', None),
        'pistas': d['pistas']
    }
    novos.append(novo)

# --- 5. Validar e salvar ---
assert len(ids_usados) == len(novos), 'ids duplicados!'
assert len(slugs_usados) == len(novos), 'slugs duplicados!'
resps = [d['resp'] for d in novos]
assert len(resps) == len(set(resps)), 'resps duplicadas!'
with open(CHALLENGES, 'w', encoding='utf-8') as f:
    json.dump(novos, f, ensure_ascii=False, indent=2)

print('salvo:', len(novos), 'itens')
print('itens com alias:', sum(1 for d in novos if d['alias']))
print('categorias:', {c: sum(1 for d in novos if d['cat'] == c) for c in set(d['cat'] for d in novos)})
print('OK')