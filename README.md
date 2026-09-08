# 🕹️ Nostálgica — O desafio diário dos anos 90

Quiz de retenção diária estilo Wordle: 1 desafio novo por dia, streak, e grade
de resultado compartilhável. Feito pra trazer o público de volta todo dia.

## 🚀 Publicação (GitHub Pages)

O site já está em `index.html`. O GitHub Pages serve a raiz do repositório.

1. Crie o repositório (ou use o já criado) com nome `nostalgica90`.
2. Envie os arquivos para a branch `main` ou `master`.
3. No GitHub: **Settings → Pages → Source: Deploy from a branch** → branch `main` (ou `master`) → pasta `/ (root)`.
4. Pronto: seu jogo estará em `https://<usuario>.github.io/nostalgica90/`.

## 🤖 Postagem automática diária no Telegram

O workflow `.github/workflows/telegram-diario.yml` roda todo dia às 09:00 (Brasília)
e posta automaticamente o desafio do dia num canal do Telegram — sem ação sua.

### 1. Criar o bot (2 minutos)
- No Telegram, procure por **@BotFather**.
- Envie `/newbot`, escolha um nome e um username (terminando em `bot`).
- O BotFather te devolve um **TOKEN** (ex: `123456:ABC...`). Guarde-o.

### 2. Criar o canal
- No Telegram: **New Channel**, dê um nome (ex: "Nostálgica — Anos 90").
- Adicione o **bot** como administrador do canal (com permissão de postar mensagens).

### 3. Descobrir o ID do canal
- Mande qualquer mensagem dentro do canal.
- Acesse `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`.
- Procure por `"chat":{"id":` — o valor (ex: `-1001234567890`) é o `TELEGRAM_CHAT_ID`.

### 4. Configurar os segredos no GitHub
No repositório: **Settings → Secrets and variables → Actions → New repository secret**:

| Nome | Valor |
|---|---|
| `TELEGRAM_BOT_TOKEN` | o TOKEN do bot (do passo 1) |
| `TELEGRAM_CHAT_ID` | o id do canal (do passo 3, com o `-100...` completo) |
| `SITE_URL` | a URL do jogo (ex: `https://asilva-01.github.io/nostalgica90/`) |

### 5. Testar
Na aba **Actions** do repositório, abra o workflow *"Postar desafio diário no Telegram"* e
clique em **Run workflow** para rodar manualmente uma vez e confirmar que chega no canal.

Depois disso, a postagem diária é 100% automática.

## ➕ Adicionar mais desafios

**FONTE ÚNICA:** edite `challenges.json` — o jogo (`index.html` via `data.js`) **e**
o bot (`bot_diario.py`) leem o mesmo arquivo. O desafio `N` usa `POOL[(N-1) % len(POOL)]`.

Cada desafio tem os campos:
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
  "curiosidade": "Fato divertido para a seção 'Você lembra?'.",
  "tags": ["brinquedos", "anos-90", "brasil", "nostalgia"],
  "image": null,
  "dificuldade": null,
  "pistas": ["Pista 1 (vaga)", "Pista 2", "...", "Pista 6 (óbvia)"]
}
```

Para regenerar a normalização (aliases a partir do HTML antigo) rode:
```bash
python tools/normalize_challenges.py
```

Para rodar o teste de regressão:
```bash
node tools/test_core.js
```

Para gerar novos assets (SFX WAV, ícones, OG image) rode:
```bash
python tools/generate_assets.py
```

## 🏛️ Museu dos Anos 90
Edite `museum.json` (categorias com itens) para ampliar o acervo.

## 🎨 Sistema de Artes dos Desafios (artes.js)

Cada desafio tem uma **arte procedural com identidade por categoria** gerada por `artes.js`
(fundos/texturas próprios + elemento SVG central + faixa categoria·ano + selo). Nada é copiado
de material protegido — composição original inspirada na época.

Categorias e suas linguagens visuais:
- **TV** → grade de programação (estética "liguei a TV")
- **GAMES** → pixel/arcade ("eu jogava isso")
- **CINEMA** → pôster de VHS/locadora ("eu aluguei esse filme")
- **MÚSICA** → CD/cassete (preparado)
- **BRINQUEDOS** → catálogo/embalagem ("eu queria ter esse")
- **TECNOLOGIA** → monitor CRT ("eu usei isso")
- **CULTURA** → revista/banca ("fazia parte da minha vida")

O campo `image` no `challenges.json` é usado quando houver uma arte real (ex: `assets/images/challenges/001.webp`).
Enquanto `image` for `null`, o motor usa a arte procedural.

---

Feito com 💜 e saudade dos anos 90.
