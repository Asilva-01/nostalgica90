#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera challenges.json a partir do POOL em bot_diario.py (uma única vez)."""
import json

# Lê o POOL do bot (fonte Python limpa e confiável)
ns = {}
src = open(r'C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90\.github\scripts\bot_diario.py', encoding='utf-8').read()
start = src.index('POOL = [')
depth = 0
end = start
for i in range(start, len(src)):
    if src[i] == '[':
        depth += 1
    elif src[i] == ']':
        depth -= 1
        if depth == 0:
            end = i + 1
            break
exec(src[start:end], ns)
items = ns['POOL']

META = {
    "Tamagotchi": ("BRINQUEDOS","🥚","1996","A febre dos bichinhos virtuais fez a Mídia parar: escolas proibiram os aparelhos porque bipavam durante a aula."),
    "TV Colosso": ("TV","🐶","1993","A 'TV do cão' foi o primeiro programa infantil da Globo feito só para crianças, com plateia de verdade e cachorros dublados."),
    "Tazo": ("BRINQUEDOS","🌀","1998","Os discos vieram dentro de salgadinhos e criaram um mercado próprio: os raros 'brilhantes' valiam verdadeiras fortunas no recreio."),
    "Super Nintendo": ("GAMES","🕹️","1990","O SNES vendeu quase 50 milhões de unidades e trouxe clássicos como Super Mario World e Donkey Kong Country."),
    "Eliana": ("TV","🎤","1991","O bordão 'É pimba!' nasceu de um trocadilho e virou marca registrada da apresentadora no SBT."),
    "Fita VHS": ("CULTURA","📼","1970","A VHS dominou por décadas; rebobinar antes de devolver na locadora era a regra de ouro que todo mundo odiava."),
    "Discman": ("TECNOLOGIA","💿","1984","O Discman da Sony transformou o CD em produto portátil, mas pulava a música se você andasse rápido."),
    "Walkman": ("TECNOLOGIA","🎧","1979","O Walkman mudou a forma de ouvir música e virou sinônimo de tocador portátil por décadas."),
    "Kibon": ("CULTURA","🍦","1941","O caminhãozinho da Kibon tocava uma musiquinha inconfundível que anunciava o verão nas ruas do Brasil."),
    "Bombril": ("TV","🪠","1955","O garoto-propaganda apareceu em mais de 200 comerciais, com perucas e fantasias dos personagens mais famosos do mundo."),
    "Xuxa": ("TV","👑","1986","A Rainha dos Baixinhos levou o Brasil para a TV internacional e criou o maior programa infantil da América Latina."),
    "Super Trunfo": ("BRINQUEDOS","🃏","1972","O jogo de comparar números nasceu na Inglaterra e virou febre nas rodas de amigos e famílias brasileiras."),
    "Game Boy": ("GAMES","🎮","1989","O Game Boy da Nintendo vendia milhões graças a um jogo de blocos que caiam: o Tetris."),
    "Senna": ("CULTURA","🏎️","1990","Ayrton Senna é o maior ídolo do esporte brasileiro; sua morte em 1994 parou o país inteiro."),
    "Fórmula 1": ("CULTURA","🏁","1950","Nos anos 90, a F1 era assistida aos domingos de manhã com café, e o Brasil vibrava com Senna e companhia."),
    "Copa do Mundo": ("CULTURA","⚽","1994","O tetra veio em 1994 na disputa de pênaltis contra a Itália, com a final emocionando o Brasil inteiro."),
    "Romário": ("CULTURA","⚽","1994","O Baixinho foi o artilheiro do tetra em 1994, marcando 5 gols e sendo eleito o melhor do mundo."),
    "Ronaldo": ("CULTURA","⚽","1997","O Fenômeno explodiu no Barcelona e na Inter, e se consagrou em 2002 com o penta."),
    "Dragon Ball Z": ("TV","🐉","1989","O 'Kamehameha' virou cultura pop mundial; a saga Saiyajin dominou as manhãs da TV brasileira."),
    "Cavaleiros do Zodíaco": ("TV","🛡️","1986","O animê de Seiya e companhia foi um dos maiores fenômenos da TV brasileira, com a 'armadura de Pégaso'."),
    "Sailor Moon": ("TV","🌙","1992","A 'guerreira da lua' conquistou o público feminino e abriu espaço para os animês mágicos no Brasil."),
    "Pokémon": ("GAMES","⚡","1996","A febre dos monstrinhos explodiu com 'Preciso pegá-los!' e virou o maior fenômeno de mídia dos anos 90."),
    "Digimon": ("GAMES","🦖","1997","Os monstrinhos digitais rivalizaram com Pokémon e marcaram as manhãs com o dispositivo de pulso."),
    "Chaves": ("TV","🛢️","1972","O seriado mexicano foi reprisado infinitamente na TV brasileira e o 'foi sem querer querendo' virou frase eterna."),
    "Rugrats": ("TV","👶","1991","Os bebês do desenho viviam aventuras secretas que os adultos nunca entendiam."),
    "Turma da Mônica": ("CULTURA","🐰","1963","Mauricio de Sousa criou a turma do Bairro do Limoeiro, que marcou gerações com as revistinhas."),
    "Castelo Rá-Tim-Bum": ("TV","🏰","1994","O programa da TV Cultura com o menino de 300 anos ensinou ciências e português brincando."),
    "Titanic": ("CINEMA","🚢","1997","O filme de James Cameron foi o mais caro de sua época e virou o maior blockbuster de todos os tempos."),
    "Jurassic Park": ("CINEMA","🦕","1993","Spielberg trouxe dinossauros à vida com efeitos revolucionários e fez 'A vida encontra um jeito' famoso."),
    "Friends": ("TV","☕","1994","A sitcom mais famosa do mundo; o café Central Perk e o 'How you doing?' viraram ícones."),
    "Power Rangers": ("TV","⚡","1993","Os heróis de trajes coloridos ensinaram 'É hora de morfar!' e dominaram a TV com os Megazords."),
    "Jaspion": ("TV","🤖","1985","O tokusatsu japonês abriu caminho para Jiraiya e companhia no Brasil, com o robô dourado."),
    "Silvio Santos": ("TV","💰","1963","O dono do SBT e do Baú da Felicidade é o maior apresentador da história da TV brasileira."),
    "Gugu Liberato": ("TV","🎪","1980","Gugu comandou o Domingo Legal e criou quadros inesquecíveis como a 'Garota do Tempo'."),
    "Street Fighter II": ("GAMES","🥊","1991","O jogo que definiu o gênero de luta nos fliperamas, com o Hadouken virando grito universal."),
    "Mortal Kombat": ("GAMES","☠️","1992","O game polêmico com 'Finish Him!' virou caso de polícia no Brasil por causa da violência."),
    "The King of Fighters": ("GAMES","🌪️","1994","O torneio da SNK com times de 3 lutadores dominou os fliperamas com Kyo e Iori."),
    "Fatal Fury": ("GAMES","🐺","1991","Terry Bogard e o 'BUSTA WOLF!' são lendas dos fliperamas, precursores do KOF."),
    "Samurai Shodown": ("GAMES","⚔️","1993","A luta de espadas da SNK com medidor de raiva e golpes finais em câmera lenta."),
    "Metal Slug": ("GAMES","🎖️","1996","O run-and-gun mais frenético dos fliperamas, famoso pelo tanque e pelo 'Heavy Machine Gun!'."),
    "Neo Geo": ("GAMES","👑","1990","O hardware da SNK que era arcade e console, com os cartuchos mais caros da história."),
    "Pac-Man": ("GAMES","🟡","1980","O labirinto amarelo com os fantasmas Blinky, Pinky, Inky e Clyde é o jogo mais famoso da história."),
    "Donkey Kong": ("GAMES","🦍","1981","O jogo que apresentou Mario (então carpinteiro) e o gorila que atirava barris."),
    "Double Dragon": ("GAMES","🥋","1987","A pancadaria dos irmãos Lee que lotava os fliperamas com o modo cooperativo."),
    "Final Fight": ("GAMES","💥","1989","O beat-em-up da Capcom com o prefeito Haggar e o suplex devastador."),
    "Time Crisis": ("GAMES","🔫","1995","O shooter de arma com pedal de cobertura que fez sucesso nos fliperamas."),
    "Vale Tudo": ("TV","💣","1988","A novela com 'Quem matou Odete Roitman?' virou o maior mistério da TV brasileira."),
    "Roque Santeiro": ("TV","🗿","1985","A novela em Asa Branca com o 'morto' que voltou à vida e o coronel Sinhozinho Malta."),
    "Tieta": ("TV","🐐","1989","A obra de Jorge Amado com a protagonista que voltou rica a Santana do Agreste."),
    "O Rei do Gado": ("TV","🐂","1996","Bruno, Luana e a abertura 'Admirável Gado Novo' marcaram a novela de Zeca Pagodinho."),
    "Terra Nostra": ("TV","🚢","1999","O amor de Giuliana e Matteo, imigrantes italianos, é uma das novelas mais bonitas da Globo."),
    "Mulheres de Areia": ("TV","👯","1993","As gêmeas Ruth e Raquel e o inesquecível Tonho da Lua no mar de Pipa."),
    "A Viagem": ("TV","👻","1994","A novela de Glória Perez sobre vida após a morte e reencarnação, com a estrada no céu."),
    "Chiquititas": ("TV","🎈","1997","O orfanato Raio de Luz e a doce Mili emocionaram as crianças do SBT."),
    "Carrossel": ("TV","🏫","1989","A Escola Mundial, a professora Helena e o Cirilo apaixonado pela Maria Joaquina."),
    "Éramos Seis": ("TV","🏠","1994","A família Lemos e a força de uma mãe que criou os filhos sozinha no SBT."),
}

out = []
for it in items:
    meta = META.get(it["resp"], ("CULTURA","📼","1990","Fazia parte do cotidiano dos anos 90."))
    out.append({
        "resp": it["resp"],
        "alias": it.get("alias", []),
        "cat": meta[0],
        "emoji": meta[1],
        "ano": meta[2],
        "curiosidade": meta[3],
        "pistas": it["pistas"],
    })

path = r'C:\Users\admin\AppData\Local\Temp\opencode\nostalgica90\challenges.json'
with open(path, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

from collections import Counter
print("total:", len(out))
print("por categoria:", dict(Counter(c["cat"] for c in out)))
print("amostra ok:", all(len(c["pistas"]) == 6 for c in out))
print("primeiro:", out[0]["resp"], out[0]["cat"], out[0]["pistas"][0][:30])