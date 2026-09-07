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
    {
        "resp": "Senna",
        "pistas": [
            "O maior ídolo do automobilismo brasileiro de todos os tempos.",
            "Foi tricampeão mundial de Fórmula 1 nos anos 90.",
            "Corria pela equipe da McLaren de 1988 a 1993.",
            "A rivalidade com o piloto francês 'Professor' ficou mundial.",
            "Na chuva, diziam que ele enxergava o que ninguém via.",
            "Em Interlagos, venceu a corrida de 1991 emocionando o país.",
        ],
    },
    {
        "resp": "Fórmula 1",
        "pistas": [
            "A categoria máxima do automobilismo mundial nos anos 90.",
            "No Brasil, era assistida aos domingos de manhã com empolgação.",
            "O mundial era disputado por escuderias como Ferrari e McLaren.",
            "O campeonato de 1994 teve um fim trágico em Ímola.",
            "Era transmitida e comentada com paixão por um locutor brasileiro.",
            "Schumacher, Prost e Senna marcaram a década.",
        ],
    },
    {
        "resp": "Copa do Mundo",
        "pistas": [
            "O evento que parava o Brasil inteiro a cada quatro anos.",
            "Nos anos 90, era assistido em quase toda casa aos domingos.",
            "A edição de 1994 terminou numa decisão nos pênaltis.",
            "Em 1998 foi na França e terminou num final sonhado, mas perdido.",
            "A taça, as músicas de incentivo e os enfeites de louro.",
            "O Brasil sonhava com o pentacampeonato a cada edição.",
        ],
    },
    {
        "resp": "Romário",
        "pistas": [
            "Atacante baixinho que foi o herói do tetra em 1994.",
            "Diziam que ele 'parava a bola' com a ponta da chuteira.",
            "Vivia na área e era um dos maiores finalizadores da história.",
            "Suas frases polêmicas também faziam parte do show.",
            "Marcava gol até parecendo parado, movendo só o pé.",
            "Artilheiro da seleção que conquistou a Copa dos EUA.",
        ],
    },
    {
        "resp": "Ronaldo",
        "pistas": [
            "Atacante que explodiu como 'Fenômeno' ainda muito jovem.",
            "Brilhou na Copa de 1998 antes da final em que passou mal.",
            "Ganhou a Copa de 2002 com o cabelo raspado.",
            "Rápido, forte e letal, vestia a camisa 9.",
            "Passou por PSV, Barcelona, Inter de Milão e Real Madrid.",
            "Reinventou a função de centroavante nos anos 90.",
        ],
    },
    {
        "resp": "Dragon Ball Z",
        "pistas": [
            "Animê que dominava as manhãs da TV brasileira.",
            "O herói soltava o grito 'Kamehameha' ao atacar.",
            "Cabelo que ficava loiro-elétrico num estado de poder máximo.",
            "Lutas e mais lutas cheias de transformações de poder.",
            "A rivalidade com o príncipe dos sayajins movia a saga.",
            "As esferas mágicas invocavam um dragão que atendia pedidos.",
        ],
    },
    {
        "resp": "Cavaleiros do Zodíaco",
        "pistas": [
            "Animê de cinco guerreiros com armaduras douradas.",
            "Seiya usava a armadura de Pégaso.",
            "Cada guerreiro representava uma constelação.",
            "Lutavam em nome da deusa Atena.",
            "Golpes épicos como 'Meteoro de Pégaso'.",
            "Santuário, Poseidon e Hades eram as grandes sagas.",
        ],
    },
    {
        "resp": "Sailor Moon",
        "pistas": [
            "Animê de garotas mágicas que conquistou o público feminino.",
            "A protagonista se transformava com um broche.",
            "Sua roupa de batalha era azul e branca, com laço.",
            "Cada guerreira tinha um planeta do sistema solar.",
            "Um gato lunar de duas cores era sua companheira.",
            "Ela lutava 'em nome da lua' pela justiça e pelo amor.",
        ],
    },
    {
        "resp": "Pokémon",
        "pistas": [
            "A febre dos monstrinhos que explodiu no fim dos anos 90.",
            "O treinador queria ser o 'melhor de todos'.",
            "Um ratinho elétrico amarelo virou símbolo mundial.",
            "Cada criatura tinha um tipo e evoluía ao subir de nível.",
            "Pokébolas e ginásios dominavam a rotina das crianças.",
            "'Preciso pegá-los!' era o lema da geração.",
        ],
    },
    {
        "resp": "Digimon",
        "pistas": [
            "Monstrinhos digitais, a rival da febre japonesa do fim dos anos 90.",
            "Digimolevavam para formas cada vez mais fortes.",
            "O principal era um dinossaurozinho que virava um dragão.",
            "As crianças entravam num 'mundo digital'.",
            "Usavam um dispositivo de pulso para os monstrinhos.",
            "A abertura nacional fez sucesso nas manhãs de TV.",
        ],
    },
    {
        "resp": "Chaves",
        "pistas": [
            "A turma de uma vila muito pobre que divertia a garotada.",
            "O menino morava num barril.",
            "A senhora brava, a menina inocente e o magro desempregado.",
            "As piadas giravam em torno de comida e 'essas pessoas'.",
            "Era reprisado infinitamente na TV brasileira.",
            "'Foi sem querer querendo!' era o grito mais famoso.",
        ],
    },
    {
        "resp": "Rugrats",
        "pistas": [
            "Desenho sobre um grupo de bebês com aventuras secretas.",
            "O primo com óculos e cabelo espetado era o 'chefinho'.",
            "Os adultos nunca entendiam o que os bebês faziam.",
            "Imaginavam o quarto como um mundo gigante.",
            "Um dos bebês só falava 'Gaa' e era tido como gênio.",
            "Fraldas, potinhos e mamadeiras eram os 'equipamentos'.",
        ],
    },
    {
        "resp": "Turma da Mônica",
        "pistas": [
            "As histórias em quadrinhos infantis mais famosas do Brasil.",
            "Criadas pela desenhista brasileira mais renomada.",
            "A menina de vestido vermelho era a dona da rua.",
            "O coelhinho branco sempre aparecia com uma cenoura.",
            "O menino que trocava R por L chamava-se Cebolinha.",
            "A turma morava no Bairro do Limoeiro.",
        ],
    },
    {
        "resp": "Castelo Rá-Tim-Bum",
        "pistas": [
            "Programa infantil gravado num castelo roxo.",
            "Um menino de 300 anos morava lá ensinando brincando.",
            "Tinha uma fada madrinha e amigos mágicos.",
            "Ensinava português, matemática e ciências de forma divertida.",
            "Era produção da TV Cultura de São Paulo.",
            "Sua abertura marcou a infância de milhões no Brasil.",
        ],
    },
    {
        "resp": "Titanic",
        "pistas": [
            "O filme mais comentado do fim dos anos 90.",
            "Um romance impossível entre um rapaz pobre e uma moça rica.",
            "'Eu sou o rei do mundo!' — dizia o herói na proa.",
            "O navio choca contra um iceberg no Atlântico.",
            "A música tema, cantada por Celine Dion, virou hino.",
            "O coração de um passageiro sobrevivia ao naufrágio.",
        ],
    },
    {
        "resp": "Jurassic Park",
        "pistas": [
            "Filme que trouxe os dinossauros de volta à vida.",
            "Um parque criado numa ilha remota.",
            "O temido T-Rex era o destaque da trama.",
            "O lema 'A vida encontra um jeito' ficou famoso.",
            "Resultado da mente do diretor de 'Tubarão' e 'ET'.",
            "Uma família corria dos dinossauros no parque.",
        ],
    },
    {
        "resp": "Friends",
        "pistas": [
            "Série de comédia americana que virou fenômeno mundial.",
            "Seis amigos moravam perto um do outro em Nova York.",
            "Central Perk era a cafeteria onde se encontravam.",
            "Joey, Chandler, Ross, Rachel, Monica e Phoebe.",
            "O casal Ross e Rachel era o fio condutor da história.",
            "'How you doing?' era o charme de Joey.",
        ],
    },
    {
        "resp": "Power Rangers",
        "pistas": [
            "Heróis americanos baseados num tokusatsu japonês.",
            "Cada um usava um traje colorido e um robô ancestral.",
            "O vermelho era o líder do time.",
            "Os monstros cresciam quando perdiam em tamanho pequeno.",
            "Os Megazords combinavam os robôs de todos.",
            "'É hora de morfar!' virou grito de guerra infantil.",
        ],
    },
    {
        "resp": "Jaspion",
        "pistas": [
            "O tokusatsu japonês que conquistou o Brasil.",
            "O herói usava uma espada e pilotava um robô dourado.",
            "Sua nave tinha nome de uma criatura mítica japonesa.",
            "Surgiu no fim dos anos 80 e marcou gerações.",
            "Abril caminho para outros tokusatsus na TV aberta.",
            "Formava dupla de heróis com um guardião.",
        ],
    },
    {
        "resp": "Silvio Santos",
        "pistas": [
            "Maior apresentador e dono de uma emissora brasileira.",
            "'Quem quer dinheiro?' era sua pergunta mais famosa.",
            "Sorteados, brincadeiras e o 'gato' Maia no palco.",
            "A plateia gritava seu nome como torcida.",
            "Comandava o próprio canal por décadas.",
            "As moças da plateia eram as dançarinas do programa.",
        ],
    },
    {
        "resp": "Gugu Liberato",
        "pistas": [
            "Apresentador que rivalizava com Silvio Santos aos domingos.",
            "Comandava o 'Domingo Legal' no SBT.",
            "Quadros de dança, brincadeiras e muita música.",
            "Sua 'Garota do Tempo' marcou época.",
            "Mudou de emissora e desafiou a audiência dominical.",
            "Seu nome era de um personagem japonês da sogra.",
        ],
    },
    {
        "resp": "Street Fighter II",
        "pistas": [
            "O jogo de luta mais famoso de todos os fliperamas.",
            "Você escolhia entre lutadores do mundo inteiro.",
            "O personagem da capa soltava o golpe 'Hadouken'.",
            "Tinha versões Champion Edition e Turbo.",
            "Dois jogadores se enfrentavam disputando o salão.",
            "'Hadouken!' e 'Shoryuken!' ecoavam pelo fliperama.",
        ],
    },
    {
        "resp": "Mortal Kombat",
        "pistas": [
            "O jogo de luta mais polêmico dos anos 90.",
            "Foi o primeiro a popularizar sangue nos fliperamas.",
            "'Finish Him!' soava antes do golpe final.",
            "Sub-Zero congelava o adversário para o golpe fatal.",
            "Scorpion, Raiden e Liu Kang estavam no elenco.",
            "No Brasil, o jogo até virou caso de polícia e foi apreendido.",
        ],
    },
    {
        "resp": "The King of Fighters",
        "pistas": [
            "A luta da SNK que dominava os fliperamas nos anos 90.",
            "Você montava um time com 3 lutadores.",
            "Dava pra trocar de personagem no meio da luta.",
            "Kyo, Iori e a rivalidade das famílias centenárias.",
            "As versões '96, '98 e '2002 são as mais lembradas.",
            "No final, um chefe soltava raios e esmagava o chão.",
        ],
    },
    {
        "resp": "Fatal Fury",
        "pistas": [
            "A série de luta da SNK que veio antes do KOF.",
            "O herói lutava ao lado do irmão mais novo.",
            "O golpe 'Power Wave' deslizava pelo chão.",
            "O protagonista era loiro e usava jaqueta vermelha.",
            "O vilão de cabelo branco atirava do alto do prédio.",
            "'Are you okay? BUSTA WOLF!' era sua fala de vitória.",
        ],
    },
    {
        "resp": "Samurai Shodown",
        "pistas": [
            "Luta com espadas no Japão feudal, pela SNK.",
            "Os samurais podiam quebrar a lâmina do rival.",
            "Os golpes finais eram mostrados em câmera lenta.",
            "O guerreiro da capa usava uma espada lendária.",
            "Uma guerreira indígena lutava com um falcão ao lado.",
            "O medidor de raiva enchia quando você apanhava.",
        ],
    },
    {
        "resp": "Metal Slug",
        "pistas": [
            "O jogo de tiro mais frenético dos fliperamas.",
            "Dois soldados avançavam por campos de guerra.",
            "O tanque 'Metal Slug' era o prêmio de cada fase.",
            "Reféns resgatados soltavam itens e armas.",
            "'Heavy Machine Gun!' tocava ao pegar a arma.",
            "A animação era tão boa que você morria só de admirar.",
        ],
    },
    {
        "resp": "Neo Geo",
        "pistas": [
            "O sistema da SNK que era fliperama E videogame.",
            "Os jogos do salão eram os mesmos de casa.",
            "Era o hardware mais potente da época.",
            "Os cartuchos custavam mais que o próprio console.",
            "KOF, Metal Slug e Samurai Shodown nasceram nele.",
            "'100 Mega Shock!' era o seu grito de guerra.",
        ],
    },
    {
        "resp": "Pac-Man",
        "pistas": [
            "O círculo amarelo que virou símbolo do fliperama.",
            "Ele corria por um labirinto comendo bolinhas.",
            "Quatro fantasmas coloridos o caçavam.",
            "A bolinha maior o deixava invencível por instantes.",
            "Os fantasmas tinham nome: Blinky, Pinky, Inky e Clyde.",
            "Foi criado pra atrair as meninas pros fliperamas.",
        ],
    },
    {
        "resp": "Donkey Kong",
        "pistas": [
            "O jogo que apresentou o maior herói dos videogames.",
            "Um macaco gigante segurava a moça no topo.",
            "O herói pulava barris rolando pelo cenário.",
            "Na época, o herói era um simples carpinteiro.",
            "O macaco era o grande vilão da trama.",
            "O gorila foi batizado em homenagem a um primata famoso.",
        ],
    },
    {
        "resp": "Double Dragon",
        "pistas": [
            "A briga de rua que lotava os fliperamas.",
            "Dois irmãos mestres em artes marciais.",
            "A missão era resgatar a namorada de uma gangue.",
            "Billy e Jimmy eram os irmãos protagonistas.",
            "Dava pra jogar em dupla... e acertar o colega.",
            "Nunchaku, chutes e muito 'soco na cara'.",
        ],
    },
    {
        "resp": "Final Fight",
        "pistas": [
            "A pancadaria da Capcom nas ruas de Metro City.",
            "Três heróis: dois lutadores e o prefeito fortão.",
            "O objetivo era resgatar a filha do prefeito.",
            "Nasceu de um projeto que seria um 'Street Fighter'.",
            "O prefeito Haggar usava um suplex devastador.",
            "Uma gangue de rua tomava conta da cidade.",
        ],
    },
    {
        "resp": "Time Crisis",
        "pistas": [
            "O jogo de tiro com arma de plástico do fliperama.",
            "Um pedal no chão fazia você se esconder.",
            "Cada fase terminava num duelo contra um vilão.",
            "O vilão 'Wild Dog' atirava de qualquer canto.",
            "Se não se escondesse, morria em segundos.",
            "O relógio e a tensão eram o tempero da diversão.",
        ],
    },
    {
        "resp": "Vale Tudo",
        "pistas": [
            "Novela da Globo que todo mundo comentava no dia seguinte.",
            "Tinha a vilã mais marcante da TV brasileira.",
            "'Quem matou Odete Roitman?' virou febre nacional.",
            "A filha ambiciosa queria ganhar dinheiro a qualquer custo.",
            "A mãe vendia comida na praia pra sobreviver.",
            "A pergunta do século ficou guardada até o último capítulo.",
        ],
    },
    {
        "resp": "Roque Santeiro",
        "pistas": [
            "Novela ambientada numa cidade chamada Asa Branca.",
            "Um herói da cidade era dado como morto... mas estava vivo.",
            "O vilão era dono de tudo e se chamava Sinhozinho Malta.",
            "A viúva mais famosa da TV morava na cidade.",
            "O bordão da época brincava: 'Quem matou o Roque?'",
            "Marcou gerações com a disputa entre o herói e o coronel.",
        ],
    },
    {
        "resp": "Tieta",
        "pistas": [
            "Novela baseada em obra de Jorge Amado.",
            "A cidade era Santana do Agreste.",
            "A protagonista voltou rica de São Paulo pra se vingar.",
            "O irmão dela era o delegado 'cheiroso' da cidade.",
            "Os caprinos eram os personagens mais 'cheirosos' da trama.",
            "Uma das novelas mais libertadoras e divertidas da Globo.",
        ],
    },
    {
        "resp": "O Rei do Gado",
        "pistas": [
            "Novela com disputa de terras e uma história de amor.",
            "O protagonista era dono de milhares de cabeças de gado.",
            "A moça por quem ele se apaixonou tinha um passado de luta.",
            "Antônio Fagundes vivia o personagem principal.",
            "A música 'Admirável Gado Novo' marcou a abertura.",
            "Boi, terra, paixão e muita lágrima na Globo dos anos 90.",
        ],
    },
    {
        "resp": "Terra Nostra",
        "pistas": [
            "Novela sobre imigrantes italianos que chegaram ao Brasil.",
            "O amor começou durante a travessia de navio.",
            "Giuliana e Matteo eram o casal da história.",
            "Mostrava o trabalho árduo nas fazendas de café.",
            "A música tema cantava sobre saudade e esperança.",
            "Uma das novelas mais bonitas e marcantes do fim dos anos 90.",
        ],
    },
    {
        "resp": "Mulheres de Areia",
        "pistas": [
            "Novela com duas irmãs gêmeas de personalidades opostas.",
            "Uma era boazinha, a outra maquiavélica.",
            "As duas eram apaixonadas pelo mesmo homem.",
            "O personagem Tonho da Lua era um sonhador inesquecível.",
            "O mar, a praia e a lua eram cenário constante.",
            "A pergunta era sempre: qual das duas você vai encontrar?",
        ],
    },
    {
        "resp": "A Viagem",
        "pistas": [
            "Novela de Glória Perez sobre o que existe depois da morte.",
            "Abordava reencarnação e vida espiritual.",
            "Um romance atravessado por um espírito vingativo.",
            "Foi exibida na faixa das 18h da Globo.",
            "A abertura mostrava uma estrada no céu.",
            "Mexia com fé, medo e a crença de milhões de telespectadores.",
        ],
    },
    {
        "resp": "Chiquititas",
        "pistas": [
            "Novela infantil que emocionou o SBT.",
            "As crianças viviam num orfanato chamado Raio de Luz.",
            "A protagonista era a doce Mili.",
            "Tinha mensagens de amizade e esperança em cada capítulo.",
            "As meninas usavam roupinhas combinando.",
            "A música de abertura virou hino das crianças dos anos 90.",
        ],
    },
    {
        "resp": "Carrossel",
        "pistas": [
            "Novela infantil exibida no SBT com grande sucesso.",
            "A turma estudava na Escola Mundial.",
            "A professora chamava-se Helena e era adorada.",
            "Cirilo vivia apaixonado pela Maria Joaquina.",
            "'Bate, bate no coração' marcava a abertura.",
            "Valeu, professora! Era o grito mais famoso da garotada.",
        ],
    },
    {
        "resp": "Éramos Seis",
        "pistas": [
            "Novela baseada no livro de Maria José Dupré.",
            "A família Lemos era o centro da história.",
            "A mãe dedicada criava os filhos com muito sacrifício.",
            "Foi exibida pelo SBT em meados dos anos 90.",
            "A casa e a mesa da família eram cenário de toda a trama.",
            "Uma história simples e emocionante de família brasileira.",
        ],
    },
]

# Desafio nº1 = dia 2026-09-06 (data de referência do projeto)
REF_MS = datetime.datetime(2026, 9, 6, 12, 0, 0).timestamp()
REF_NO = 1


def numero_do_desafio(data):
    delta = int((data.timestamp() - REF_MS) / 86400)
    return max(REF_NO, REF_NO + delta)


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
