# 🧠 NOSTÁLGICA 90 — ARQUITETURA DE MEMÓRIA BRASILEIRA (FASE 2I-D)

> **Status:** proposta de arquitetura. **Nenhuma arte nova produzida.**
> Base: `PESQUISA-EDITORIAL.md` (Fase 2I-C) — direção editorial aprovada.
> Objetivo: transformar uma **memória brasileira dos anos 90** em
> `MEMÓRIA → CONTEXTO → OBJETOS → VISUAL → SOM → INTERAÇÃO`,
> sem depender de "cards genéricos".

---

## 1. PRINCÍPIO FUNDAMENTAL

A unidade fundamental **não é a categoria** (TV, GAMES, BRINQUEDOS...).

A unidade fundamental é a **MEMÓRIA**.

> **Categoria** é apenas um rótulo de navegação.
> **Memória** é o que provoca "EU LEMBRO DISSO!".

Uma memória é uma **cena da vida cotidiana brasileira dos anos 90**, composta por
**objetos**, um **contexto**, um **som** e um **gancho emocional**.

---

## 2. MODELO SEMÂNTICO PROPOSTO

### 2.1 Estrutura de uma Memória (`memory.json`)

```json
{
  "id": "tamagotchi",
  "title": "Tamagotchi",
  "yearRange": "1996–1999",
  "category": "brinquedos",

  "memoryType": "objeto",            // objeto|lugar|habito|situacao|tecnologia|programa|musica|filme|jogo|brinquedo|alimento|midia|cultura-popular

  "context": "escola",               // referência à cena (sceneId)
  "sceneId": "escola",
  "scenePosition": { "x": 0.62, "y": 0.34, "z": 2 },
  "sceneLayer": "front",
  "interactionType": "hover",        // hover|click|none

  "object": "Aparelho eletrônico portátil em formato de ovo, com tela de cristal líquido e três botões.",
  "description": "Bichinho virtual que bipava na aula e precisava de atenção o dia inteiro.",
  "emotionalHook": "Escolas proibiam porque não parava de bipar no recreio.",

  "visual": {
    "type": "original",              // real|licensed|public-domain|user-provided|original|contextual-illustration|unavailable
    "source": "ilustração própria (contextual)",
    "path": "assets/memory/tamagotchi.svg",
    "alt": "Aparelho Tamagotchi com tela mostrando um bichinho"
  },

  "audio": {
    "type": "contextual",            // contextual|licensed|user-provided|unavailable
    "source": "síntese original (bip), sem música licenciada",
    "path": "assets/audio/tamagotchi-bip.wav",
    "unavailableMessage": null
  },

  "relatedMemories": ["tazo", "polly-pocket", "barbie"],
  "challengeReferences": [1, 3, 12]
}
```

### 2.2 Regras do modelo

- **`memoryType`** diz o que a memória É (objeto, lugar, hábito...). Ajuda a criar
  interações e visual diferentes para cada tipo.
- **`sceneId`** liga a memória a um **cenário reutilizável** (quarto, escola, locadora...).
  Um mesmo cenário pode conter várias memórias.
- **`scenePosition` / `sceneLayer` / `interactionType`** posicionam a memória dentro da cena
  e definem como o usuário interage (hover/click).
- **`visual.type`** obriga a decidir a origem da imagem. Se `unavailable` ou sem fonte
  legal, usa `original` (ilustração contextual).
- **`audio.type`** separa **som contextual** (síntese/efeito) de **música real licenciada**.
  Se não houver música licenciada, **não substituir por beep fingindo ser a música** —
  usar `unavailableMessage: "Trecho indisponível"` ou oferecer só o visual/contexto.

### 2.3 Categoria ≠ Memória

A categoria **não substitui** a memória. Exemplo:

| ❌ Ruim (categoria) | ✅ Bom (memória) |
|---|---|
| TECNOLOGIA → ícone de computador | "Chegar em casa e ligar o PC pra entrar na internet." — quarto de 1997, PC CRT + teclado + modem + telefone + CD-ROM |
| BRINQUEDOS → ícone de ursinho | "Tamagotchi bipando na aula." — escola, ovo eletrônico |
| GAMES → ícone de joystick | "Moeda na máquina do fliperama do bairro." — fliperama, arcade |

---

## 3. MATRIZ DE CENAS (`scenes.json`)

Uma **cena** é um ambiente reutilizável que agrupa memórias. Cada cena tem:
`id, title, contextDescription, background (visual), objects[] (lista de memórias), audio`.

| Cena | id | Contexto | Objetos (memórias) |
|---|---|---|---|
| **Quarto de 1997** | `quarto-1997` | quarto/escritório doméstico | TV CRT, videocassete, videogame, revistas, CDs, telefone, som, fitas, controles, objetos escolares |
| **Videolocadora** | `videolocadora` | locadora de VHS da sexta à noite | prateleiras de VHS, balcão, TV, caixas de filmes, rebobinador, fichas/cadastro, cartazes |
| **Escola** | `escola` | recreio e sala de aula | carteira, caderno, estojo, papel de carta, Tazo, canetas, mochila, revistas |
| **Fliperama** | `fliperama` | salão escuro de máquinas | arcade, joystick, botões, fichas, banco, máquinas |
| **Banca de jornal** | `banca` | banca de rua | revistas, gibis, jornais, cards, colecionáveis, revistas de games/TV |
| **Sala com TV** | `sala-tv` | sala de estar, novela das 19h | TV CRT, sofá, VHS, controle remoto, som, objetos cotidianos |

> **Princípio:** a cena é o **palco**; as memórias são os **objetos** que entram nele.
> O mesmo cenário é reutilizado por várias memórias (Tamagotchi e Tazo vivem na **escola**).

---

## 4. MATRIZ DE MEMÓRIAS (prioridade editorial)

Extraída de `PESQUISA-EDITORIAL.md`. Prioridade **Nível 1** (cotidiano) > Nível 2 (cultura) > Nível 3 (nichos).

### NÍVEL 1 — COTIDIANO BRASILEIRO (máxima prioridade)

| Memória | memoryType | sceneId | Objeto central | Som contextual |
|---|---|---|---|---|
| Videolocadora | lugar | `videolocadora` | prateleiras de VHS + balcão | som de VHS/estática |
| Banca de jornal | lugar | `banca` | revistas + gibis + cards | som de rua/folhear |
| Orelhão | objeto | `quarto-1997` | orelhão com ficha | som de discar/ocupado |
| Fita VHS | objeto | `sala-tv` | caixinha preta com carretéis | rebobinar |
| Fita cassete | objeto | `quarto-1997` | fita com dois carretéis | som de fita |
| Caderno | objeto | `escola` | caderno pautado | folhear papel |
| Papel de carta | objeto | `escola` | papel decorado | — |
| Escola (recreio) | lugar | `escola` | pátio + tazos | sino/recreio |
| Fliperama | lugar | `fliperama` | arcade + joystick | insert coin |
| Telefone fixo | objeto | `quarto-1997` | telefone com fio | toque/ocupado |
| Caminhão de sorvete | hábito | `sala-tv` | carrinho da Kibon | musiquinha |
| Sorvete Kibon | alimento | `sala-tv` | Chicabon/Eskibon/Tablito | — |

### NÍVEL 2 — CULTURA POPULAR

| Memória | memoryType | sceneId |
|---|---|---|
| Programa de auditório | programa | `sala-tv` |
| Novela das 19h | programa | `sala-tv` |
| Vinheta de canal | mídia | `sala-tv` |
| Desenho infantil | programa | `sala-tv` |
| Música da época | música | `quarto-1997` |
| Revista de games | mídia | `banca` |
| Futebol | cultura-popular | `sala-tv` |

### NÍVEL 3 — NICHOS

| Memória | memoryType | sceneId |
|---|---|---|
| Super Nintendo | jogo | `quarto-1997` |
| Mega Drive | jogo | `quarto-1997` |
| Game Boy | jogo | `escola` |
| Neo Geo | jogo | `fliperama` |
| Street Fighter II | jogo | `fliperama` |
| Windows 95 / internet discada | tecnologia | `quarto-1997` |
| Anime | programa | `sala-tv` |
| Colecionáveis (Tazo, figurinhas) | brinquedo | `escola` |

---

## 5. ARQUITETURA DE ÁUDIO

### 5.1 Separação rigorosa

```
AUDIO
 ├── CONTEXTUAL (síntese/efeito, SEM direitos)
 │     └── bip de Tamagotchi, som de discar, VHS, insert coin, estática
 └── MÚSICA REAL (licenciada)
       └── SÓ se houver licença. Senão → unavailableMessage
```

### 5.2 Regras

- **`audio.type = contextual`** → usar síntese original (Web Audio / WAV próprio).
- **`audio.type = licensed`** → só com licença. **Nunca substituir** uma música famosa
  por um beep e fingir que é a música.
- **`audio.type = unavailable`** → mostrar `"Trecho indisponível"` OU oferecer só o
  visual/contexto. A memória **não depende** do áudio para funcionar.
- **`audio.source`** registra de onde veio (para rastreabilidade).

### 5.3 Mapa de som contextual (síntese já suportada no `som.js`)

| Memória | som |
|---|---|
| Tamagotchi | bip agudo intermitente |
| Orelhão / telefone | discar + ocupado |
| Fita VHS | rebobinar (deslize) |
| Fliperama | insert coin (arcade) |
| Windows 95 / modem | negociação de modem |
| TV / canal | troca de canal |

---

## 6. ARQUITETURA DE VISUAIS

### 6.1 Tipos de visual

```json
"visual": {
  "type": "real" | "licensed" | "public-domain" | "user-provided" | "original" | "contextual-illustration" | "unavailable",
  "source": "de onde veio"
}
```

- **`real` / `licensed` / `public-domain`** → só com fonte legal registrada.
- **`original` / `contextual-illustration`** → ilustração própria que **representa a
  memória corretamente** (não um "ícone genérico retrô").
- **`unavailable`** → sem imagem; usar só o contexto/descrição.

### 6.2 Regra crítica de qualidade (antes de desenhar)

> **"Se eu esconder o título, uma pessoa que viveu os anos 90 entende o que está sendo representado?"**

- Tamagotchi → deve parecer **aparelho eletrônico portátil em formato de ovo**, não "bichinho fofo".
- Tazo → deve parecer **disquinho colecionável**, não "disco colorido genérico".
- Videolocadora → deve transmitir **prateleiras de VHS + balcão + locação**, não "prédio retrô".

### 6.3 Estrutura de arquivo

```
assets/
  memory/
    tamagotchi.svg
    tazo.svg
    ...
  scenes/
    escola.svg        (fundo de cena)
    fliperama.svg
    videolocadora.svg
  audio/
    tamagotchi-bip.wav
    ...
```

---

## 7. DESAFIO E CENAS COMPARTILHANDO O MESMO MODELO

### 7.1 Fonte única de dados

Criar **um único arquivo de dados de memória** que alimenta **ambos**:

- O **desafio diário** (pergunta/pistas)
- As **cenas do museu** (coleção explorável)

```
memory.json  (fonte única: id, title, object, context, visual, audio, challengeReferences)
   │
   ├──> Desafio diário (usa title + object + pistas + emotionalHook)
   └──> Cena (usa context/sceneId + visual + audio + interactionType)
```

### 7.2 Vantagem

- **Uma memória, duas experiências.** O mesmo Tamagotchi é um desafio (pistas → adivinhar)
  E um objeto na cena "escola" (explorar → "EU LEMBRO").
- **`challengeReferences`** liga memória ↔ desafios (id no `challenges.json`).
- **`sceneId`** agrupa memórias no mesmo ambiente, reutilizando o fundo da cena.
- Elimina a duplicação atual entre `challenges.json` (desafio) e `museum.json` (card).

### 7.3 Transição proposta (para fase futura)

1. Unificar em `memory.json` (memórias) com `challengeReferences`.
2. O desafio diário continua usando o `challenges.json` (pistas/pontuação), mas a **arte**
   e o **contexto** passam a vir da memória.
3. O museu deixa de ser "grade de cards" e vira **cenas exploráveis** (`scenes.json`).

---

## 8. PILOTO FUTURO (6 memórias — não executado ainda)

Para validar o modelo, escolher 6 memórias propositalmente diferentes:

| Memória | memoryType | O que valida |
|---|---|---|
| **Tamagotchi** | objeto | aparelho portátil específico |
| **Tazo** | colecionável | disquinho colecionável |
| **Videolocadora** | lugar | ambiente com prateleiras + balcão |
| **Orelhão** | hábito | objeto/cotidiano urbano |
| **Street Fighter II / Fliperama** | jogo | arcade + contexto |
| **Windows 95 / Internet discada** | tecnologia | quarto/PC CRT + modem |

Se o modelo funcionar nesses 6 casos (objeto, colecionável, lugar, hábito, jogo, tecnologia),
podemos escalar.

---

## 9. CRITÉRIO DE ACEITE

Esta fase está concluída quando a arquitetura demonstra **como** transformar uma memória
brasileira dos anos 90 em:

```
MEMÓRIA → CONTEXTO → OBJETOS → VISUAL → SOM → INTERAÇÃO
```

**sem depender de cards genéricos.**

> **PRIMEIRO PENSAR. DEPOIS MODELAR. SÓ ENTÃO PRODUZIR.**
>
> Nenhuma arte nova foi criada nesta fase. Nenhum SVG novo. Nenhum asset substituído.
