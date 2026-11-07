# Nostálgica 90 — rodada diária dos anos 90

Quiz de retenção diária: **3 memórias por dia**, 6 pistas progressivas, pontuação
da rodada, sequência de dias e grade emoji para compartilhar — sem revelar
respostas. Identidade visual própria (TV de tubo, VHS, fliperama). Sem logos,
personagens, vinhetas ou músicas de marca.

## Publicação (GitHub Pages)

O site é estático (`index.html` na raiz). GitHub Pages: **Settings → Pages →
Deploy from a branch** → `main` → `/ (root)`.

URL: `https://asilva-01.github.io/nostalgica90/`

## Regra da rodada (fonte única)

O jogo (`selecao-rodada.js`) e o bot (`/.github/scripts/selecao_rodada.py`)
implementam **a mesma regra**, comparada em `node tools/test_selecao.js`.

1. **Dia 1** = `2026-09-06` (data civil, sem fuso).  
   `n = 1 + (data - 2026-09-06)` em dias.  
   Ex.: `2026-11-01` = dia 57; `2026-11-07` = dia 63.
2. **Pool** = ordem de `challenges.json` (hoje 56 itens).
3. **Rodada** = 3 desafios.  
   Ciclo = `floor(pool / 3)` dias (**18** quando pool=56).  
   Em cada ciclo, os índices são embaralhados com LCG 32-bit (`a=1664525`,
   `c=1013904223`) + Fisher–Yates, semente `imul32(ciclo+1, 0x9E3779B9) XOR
   imul32(pool, 0x85EBCA77)`.  
   O dia `pos` do ciclo recebe a fatia `[pos*3, pos*3+3)` dessa permutação.
4. **Sem repetir no ciclo** enquanto houver desafios: 18×3 = 54 únicos; os
   `pool % 3` que sobram entram no ciclo seguinte (outro shuffle).
5. Todo mundo vê a **mesma** rodada no mesmo dia civil.
6. O bot posta **só o primeiro** da rodada (pista 1, sem gabarito) e convida
   a jogar as 3 no site.

O ciclo antigo de 1 desafio (`(n-1) % 56`) deixou de valer neste PR. A
numeração do dia (`n`) continua a mesma.

## Bot do Telegram

O workflow `.github/workflows/telegram-diario.yml` **não mudou** (cron
`0 12 * * *` = 09:00 Brasília; mesmos secrets). Só o script passou a usar a
regra da rodada.

Secrets (não commitar, não renomear):

| Nome | Valor |
|---|---|
| `TELEGRAM_BOT_TOKEN` | token do @BotFather |
| `TELEGRAM_CHAT_ID` | id do canal |
| `SITE_URL` | URL pública do jogo |

## Estado local (anti-spoiler)

Chave `nostalgia90_rodada_d{N}` guarda só metadados: ids, pista, venceu/perdeu,
pontos. **Nunca** resposta, alias, pistas ou tentativas.

- Reentrar no dia **não revela gabarito**.
- Se a memória já foi encerrada: “já acertou / já jogou” + **Refazer** ou **Continuar**.
- Pontos e sequência oficiais congelam na **primeira** conclusão de cada memória / da rodada.
- A sequência conta **dias** em que a rodada de hoje foi fechada (pelo menos um acerto).

A grade compartilhada tem 3 linhas de 6 emojis (🟨 pista usada, 🟩 acerto, 🟥
não acertou). Sem nome, categoria ou resposta.

## Formato de `challenges.json`

Campos atuais continuam válidos. Opcionais para os próximos PRs (não quebram os 56):

```json
{
  "id": 1,
  "slug": "tamagotchi",
  "categorySlug": "brinquedos",
  "resp": "Tamagotchi",
  "alias": ["bichinho virtual"],
  "cat": "BRINQUEDOS",
  "emoji": "🥚",
  "ano": "1996",
  "curiosidade": "…",
  "tags": ["brinquedos", "anos-90"],
  "image": null,
  "dificuldade": null,
  "som": null,
  "credito_imagem": {
    "texto": "Ilustração original Nostálgica 90",
    "licenca_url": "https://creativecommons.org/licenses/by/4.0/"
  },
  "pistas": ["…", "…", "…", "…", "…", "…"]
}
```

- `alias`, `dificuldade` (`facil` \| `medio` \| `dificil` ou `null`), `som` e
  `credito_imagem` são opcionais.
- Se `image` existir, `credito_imagem.texto` e `credito_imagem.licenca_url`
  (http/https) são obrigatórios.

Validador:

```bash
node tools/validate_challenges.js
```

Testes:

```bash
node tools/test_selecao.js
node tools/test_core.js
```

## Museu / artes

Edite `museum.json` para o acervo. Artes dos desafios: `artes.js` (procedural
por categoria) ou `image` com crédito. Nada de material oficial de marcas.

Fontes: Bungee, Outfit e Share Tech Mono (OFL), servidas em `assets/fonts/`.

Feito com saudade dos anos 90.
