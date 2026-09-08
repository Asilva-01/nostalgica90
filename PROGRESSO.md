# NOSTÁLGICA 90 — PROGRESSO

## FASE 1 — CONCLUÍDA (Fundação V2 + correções críticas)

### O que foi feito
- **Aliases restaurados:** 0/56 → **35/56**. Recuperados do HTML original via histórico git (`27e49c9:index.html`). Testado: Tamagotchi aceita "bichinho virtual", Street Fighter II aceita "sf2"/"street fighter 2", Éramos Seis aceita "eramos seis".
- **Modelo de dados ampliado** (`challenges.json`): cada item agora tem `id` (1..56, estável), `slug` (único, hífen), `categorySlug`, `tags` (mínimas derivadas), `image: null`, `dificuldade: null`. Campos antigos preservados (resp, alias, cat, emoji, ano, curiosidade, pistas).
- **data.js**: adicionado `itemPorId()` e `itemPorSlug()`; interface `item(n)` intacta.
- **Áudio duplicado corrigido:** `musica.js` virou **motor puro** (não cria botão/overlay). `som.js` é o dono da interface. Subpáginas usam novo `audio-ui.js` (1 botão). Limpo bug do `prefs._base`.
- **Categoria MÚSICA**: estrutura pronta (0 desafios — expansão futura, sem conteúdo artificial).
- **Teste de regressão permanente:** `tools/test_core.js` (30 checks, rodar `node tools/test_core.js`).

### Arquivos alterados nesta fase
- `challenges.json` (normalizado)
- `data.js` (itemPorId/itemPorSlug)
- `musica.js` (motor puro)
- `som.js` (limpeza prefs)
- `audio-ui.js` (NOVO — botão para subpáginas)
- `speciais.html`, `novelas.html`, `jogar-de-novo.html` (incluem audio-ui.js)
- `service-worker.js` (cache audio-ui.js)
- `tools/normalize_challenges.py` (NOVO — gerador da normalização)
- `tools/test_core.js` (NOVO — teste de regressão)
- `README.md`, `PROGRESSO.md`

### Próxima fase sugerida
FASE 2 — Nova identidade visual (não iniciada).

---
## Histórico anterior (resumo)
- Evolução SPA: index.html novo (hero/loading/app), challenges.json fonte única, museum.json, assets (WAV/ícones/OG), PWA (manifest+SW), bot lê challenges.json, musica.js com temas.
- Publicado em https://asilva-01.github.io/nostalgica90/ (commit d2daff8).

---

## FASE 0 — VITRINE (local, sem push)

- Placeholder de AdSense removido de `index.html`, `speciais.html`, `novelas.html` e `jogar-de-novo.html`.
- Arte do desafio continua procedural (`artes.js`). Nenhuma imagem gerada.
- `challenges.json` não ganhou item novo: incluir desafio agora mudaria o desafio do dia (`POOL[(N-1) % len]`).
- Cache do service worker: `nostalgica90-v6`.
- Ainda não enviado ao GitHub Pages.

### Fila editorial (Capricho) — 8 objetos que ainda não estão nos 56
Não desenhar ainda. Só entrar no pool quando a vitrine estiver no ar e a rotação do dia for preservada (append no fim, ou calendário explícito).

1. Baby-G
2. Retroprojetor
3. Push Pop
4. Ma Chérie
5. Compaq colorido
6. Campo Minado
7. Galinha Maggi
8. Ponteira laser