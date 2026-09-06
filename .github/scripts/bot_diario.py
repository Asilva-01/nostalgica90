#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot diário do desafio Nostálgica → Telegram.
Publica automaticamente o desafio do dia (e a resposta do dia anterior)
num canal do Telegram, usando GitHub Actions (grátis).

Como usar:
1. Crie um bot no Telegram com @BotFather e pegue o TOKEN.
2. Crie um canal e adicione o bot como admin (permissão de postar).
3. Configure os segredos do repositório no GitHub:
   - TELEGRAM_BOT_TOKEN : token do bot
   - TELEGRAM_CHAT_ID   : id do canal (ex: @meucanal)
   - SITE_URL           : url pública do jogo (ex: https://asilva-01.github.io/nostalgica90/)
"""
import os
import sys
import json
import hashlib
import datetime
import urllib.request
import urllib.parse

# ---------------------------------------------------------------
# MESMO BANCO DE DESAFIOS DO JOGO (mantenha sincronizado!)
# Ordem = ordem de exibição. O desafio "N" usa POOL[(N-1) % len(POOL)].
# ---------------------------------------------------------------
POOL = [
    {
        "resp": "Tamagotchi",
        "pistas": [
            "Um bichinho de estimação que vivia no seu bolso.",
            "Ele bipava pedindo atenção o dia inteiro, até no meio da aula.",
            "Você precisava alimentar, brincar e limpar a sujeirinha dele.",
            "Se você descuidasse, ele ficava doente. E o pior: podia morrer.",
            "Era um ovinho de plástico com telinha e três botõezinhos.",
            "A febre dos bichinhos virtuais que tomou conta da garotada.",
        ],
    },
    {
        "resp": "TV Colosso",
        "pistas": [
            "Um programa infantil famoso na TV aberta brasileira.",
            "Era apresentado por um cachorro muito grande.",
            "Ele morava num 'canil' cheio de cães que falavam.",
            "A plateia era formada por crianças que iam à gravação.",
            "O apresentador canino recebia convidados e fazia perguntas.",
            "'Au au!' — o cão gigante que comandava a atração da Globo.",
        ],
    },
    {
        "resp": "Tazo",
        "pistas": [
            "Discos de papelão que viraram guerra nos recreios.",
            "Vinham dentro de pacotes de salgadinho.",
            "Você batalhava contra os discos dos colegas no chão.",
            "Ganhava quem fizesse o disco do outro virar de cabeça pra baixo.",
            "Alguns eram brilhantes, raros e valiam 'status' na escola.",
            "A febre dos discos colecionáveis dos anos 90.",
        ],
    },
    {
        "resp": "Super Nintendo",
        "pistas": [
            "Console que dominou as salas de estar no começo dos anos 90.",
            "Usava cartuchos e brigava pelo mercado com um rival da Sega.",
            "Seu controle tinha os botões A, B, X e Y na frente.",
            "Um de seus jogos mais amados era a corrida do encanador bigodudo.",
            "O rival da época respondia pelo nome Mega Drive.",
            "A sigla SNES revela tudo: é o console da Nintendo superpoderoso.",
        ],
    },
    {
        "resp": "Eliana",
        "pistas": [
            "Uma apresentadora loira que reinava aos domingos.",
            "Seu programa tinha plateia, brincadeiras e muita música.",
            "Ela também cantava e fazia sucesso com o público infantil.",
            "Tinha uma assistente que era uma boneca falante.",
            "A garotada repetia seu grito de guerra o tempo todo.",
            "'É pimba!' — dizia a loira mais famosa da TV infantil.",
        ],
    },
    {
        "resp": "Fita VHS",
        "pistas": [
            "Era pra onde iam os filmes antes do streaming existir.",
            "Pra assistir de novo, você precisava rebobinar.",
            "A locadora era o programa de sexta à noite da família.",
            "Esquecer de rebobinar era pecado na locadora.",
            "Era uma caixinha preta retangular com dois carretéis e uma fita.",
            "As iniciais VHS dizem tudo: Video Home System.",
        ],
    },
    {
        "resp": "Discman",
        "pistas": [
            "O jeito portátil de ouvir os seus CDs.",
            "Tocava um disco por vez e cabia (quase) no bolso.",
            "Era o irmão mais novo do aparelho que tocava fitas.",
            "Se você andasse rápido demais, a música pulava.",
            "Antes do MP3 player, era esse o presente dos sonhos.",
            "O nome veio da Sony: 'disc' + 'man', o homem do CD.",
        ],
    },
    {
        "resp": "Walkman",
        "pistas": [
            "O pai de todos os tocadores portáteis de música.",
            "Nele você ouvia as fitinhas cassete.",
            "Você levava pra todo lugar e dividia o fone com o amigo.",
            "Funcionava com duas pilhas AA e um fone de ouvido.",
            "O aparelho que fez a juventude andar 'cantando' pela rua.",
            "O nome em inglês significa literalmente 'homem que caminha'.",
        ],
    },
    {
        "resp": "Kibon",
        "pistas": [
            "Marca de sorvete que mandava no verão brasileiro.",
            "Seu carrinho tocava uma musiquinha que anunciava a chegada.",
            "Todo o bairro corria quando a musiquinha se aproximava.",
            "Os picolés de limão e as paletas eram os campeões de venda.",
            "O nome começa com a letra K.",
            "A gigante dos picolés e sorvetes, parceira da Nestlé no Brasil.",
        ],
    },
    {
        "resp": "Bombril",
        "pistas": [
            "Produto de limpeza que virou estrela da publicidade.",
            "Sua campanha durou anos com o mesmo garoto-propaganda.",
            "O ator aparecia fantasiado de vários personagens famosos.",
            "O slogan garantia que ele tinha 'mil e uma utilidades'.",
            "É a famosa lã de aço que tira o queimado da panela.",
            "O 'palhaço' dos comerciais limpava panelas de verdade.",
        ],
    },
    {
        "resp": "Xuxa",
        "pistas": [
            "A maior rainha do público infantil dos anos 90.",
            "Apresentava um programa de auditório cheio de crianças.",
            "Era cercada por assistentes de roupas coloridas.",
            "Ganhava o mundo: fez sucesso também fora do Brasil.",
            "Seu programa tinha nomes como 'Xou', 'Parque' e 'H'.",
            "Loira dos cabelos compridos, tinha um baú de surpresas.",
        ],
    },
    {
        "resp": "Super Trunfo",
        "pistas": [
            "Jogo de cartas que você levava pra qualquer lugar.",
            "Cada carta trazia desenhos e atributos com números.",
            "Você escolhia uma categoria e desafiava o adversário.",
            "Quem tivesse o maior número na categoria escolhida vencia a rodada.",
            "Existiam versões de carros, dinossauros, animais e times.",
            "O clássico jogo de 'comparar números' das rodas de amigos.",
        ],
    },
    {
        "resp": "Game Boy",
        "pistas": [
            "Console portátil que cabia na palma da mão.",
            "A tela era pequena, esverdeada e sem luz de fundo.",
            "Rodava cartuchos do tamanho de uma caixinha de fósforos.",
            "Um dos jogos mais famosos era o quebra-cabeça de bloquinhos caindo.",
            "Você jogava escondido debaixo da carteira na aula.",
            "Duas palavras em inglês: jogo + menino, da Nintendo.",
        ],
    },
]

# Desafio nº1 = dia 2026-09-06 (data de referência do projeto)
REF_MS = datetime.datetime(2026, 9, 6, 12, 0, 0).timestamp()
REF_NO = 1


def numero_do_desafio(data):
    delta = int((data.timestamp() - REF_MS) / 86400)
    max(REF_NO, REF_NO + delta)


def desafio_para(data):
    n = numero_do_desafio(data)
    return n, POOL[(n - 1) % len(POOL)]


def postar_telegram(texto):
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print("ERRO: TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados.")
        return False
    url = "https://api.telegram.org/bot{}/sendMessage".format(token)
    payload = json.dumps({
        "chat_id": chat_id,
        "text": texto,
        "disable_web_page_preview": False,
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read().decode("utf-8"))
            if data.get("ok"):
                print("Telegram OK: mensagem enviada.")
                return True
            else:
                print("Telegram ERRO:", data)
                return False
    except Exception as e:
        print("Telegram exceção:", e)
        return False


def main():
    hoje = datetime.datetime.now()
    n, e = desafio_para(hoje)
    site = os.environ.get("SITE_URL", "")
    # 1a pista (a mais vaga) + chamada
    primeira = e["pistas"][0]
    texto = (
        "🕹️ NOSTÁLGICA #{} — os anos 90 de volta!\n\n"
        "🧠 DESAFIO DO DIA:\n"
        "{} \n\n"
        "👇 Adivinha qual é? Jogue agora:\n"
        "{}"
    ).format(n, primeira, site)
    ok = postar_telegram(texto)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
