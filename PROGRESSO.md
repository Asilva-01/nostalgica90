# NOSTÁLGICA 90 — ESTADO DO PROJETO (retomada)

> Guardado em 2026-09-06 (sessão interrompida).
> Para retomar: `git status` no diretório `C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90`, ler este arquivo e seguir a "PRÓXIMA AÇÃO".

## Resumo da evolução aprovada
Transformar o Nostálgica em "portal de entretenimento da Internet brasileira dos anos 90" mantendo o desafio diário (6 pistas, streak, arquivo). Decisões tomadas:
- Áudio: inicia por gesto explícito via botão hero "LIGAR NOSTALGIA" (sem autoplay automático), persistência em localStorage.
- Dados: refatorar POOL duplicado para **fonte única `challenges.json`** (lido pelo jogo E pelo bot).
- Entrega: tudo em uma passada completa.

## ARQUIVOS CRIADOS/EDITADOS ATÉ AGORA (nesta sessão)

| Arquivo | Status | Observação |
|---|---|---|
| `tools/generate_challenges.py` | ✅ pronto | Gera `challenges.json` lendo POOL do `bot_diario.py` (56 desafios) |
| `challenges.json` | ✅ GERADO | 56 itens, campos: resp, alias, cat, emoji, ano, curiosidade, pistas (6 cada) |
| `tools/generate_assets.py` | ✅ pronto | Gera WAV (SFX), ícones PWA, OG image |
| `assets/audio/*.wav` | ✅ GERADO | ui-click, ui-success, ui-error, ui-reveal, ui-modem, ui-vhs, ui-arcade, ui-boot, ui-channel |
| `assets/icons/icon-192.png`, `icon-512.png` | ✅ GERADO | |
| `assets/og-image.png` | ✅ GERADO | 1200x630, estética neon 90s |
| `museum.json` | ✅ criado | 8 categorias (TV/GAMES/MÚSICA/CINEMA/BRINQUEDOS/TECNOLOGIA/VHS/RÁDIO) |
| `styles.css` | ✅ escrito | Design system completo (hero, loading, challenge, museu, galeria, CRT) |
| `data.js` | ✅ escrito | Carrega challenges.json + museum.json, fallback mínimo, categorias/cores |
| `musica.js` | ✅ editado | Adicionado `ligar()`, `desligar()`, `definirtema()`, `init()` sem autoplay |
| `som.js` | ✅ escrito | AudioManager: SFX WAV + fallback sintetizado, controles SFX/Música/volume, persistência |
| `efeitos.js` | ✅ escrito | Confete pixel (canvas), glitch, troca de canal, reduced-motion |
| `game.js` | ✅ escrito | Lógica completa (desafio diário, streak, pontos, arquivo, galeria, museu, share, Konami) |
| `index.html` | ✅ REESCRITO (novo SPA) | Hero + loading + app com todas as seções + PWA/meta tags |

## NÃO FINALIZADO / PRÓXIMAS AÇÕES (ordem sugerida)

1. **VALIDAR tudo** (ainda não testei!):
   - `node --check` em: game.js, data.js, som.js, efeitos.js, musica.js
   - `python -m py_compile` em bot_diario.py e tools/*.py
   - Abrir `index.html` localmente e conferir console/erros.
2. **FASE 10 (PWA)**: criar `manifest.json` + `service-worker.js` (ainda NÃO criados).
3. **FASE 11 (bot)**: atualizar `.github/scripts/bot_diario.py` para ler `challenges.json` (remove POOL embutido) e melhorar mensagem do Telegram (categoria/emoji/CTA). O workflow já existe.
4. **Índices/links**: conferir que `index.html` referencia os scripts e que `styles.css` está linkado corretamente.
5. **Sub-páginas** (speciais/novelas/jogar-de-novo): decidir se aplica novo visual (fica para depois; já funcionam).
6. **FASE 12**: teste completo (desafio acertar/errar, pista, pontos, streak, arquivo, museu, share, localStorage/reload), refinamento visual, e **commit + push + deploy**.
7. Limpar `tools/_debug.py` (arquivo de depuração temporário).

## Pontos de atenção
- `game.js` expõe `window.Jogo` e `window.NostalgicaInit`; `index.html` chama `NostalgicaInit()` após `Dados.carregar()`.
- `challenges.json` é a fonte única — o `bot_diario.py` PRECISA passar a lê-lo (remover POOL duplicado) para não dessincronizar.
- Git: NADA foi commitado nesta sessão. `git status` mostrará muitos arquivos novos/modificados.
- Diretório de trabalho do repo: `C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90` (remoto: Asilva-01/nostalgica90).

## Como retomar
1. `git -C "C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90" status`
2. Validar arquivos JS/Python.
3. Criar manifest.json + service-worker.js.
4. Atualizar bot_diario.py p/ ler challenges.json.
5. Testar local, refinar visual.
6. Commit + push + verificar Pages.