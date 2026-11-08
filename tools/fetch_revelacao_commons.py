#!/usr/bin/env python3
"""Busca fotos de licença livre no Wikimedia Commons para a revelação.

Só aceita Public Domain, CC0, CC BY ou CC BY-SA (verificados via extmetadata
da página do arquivo). Recusa fair use, non-free, logos, capas, screenshots.
Baixa e gera WebP/AVIF locais (~80 KB).
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import time
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "images" / "revelacao"
REPORT = ROOT / "tools" / "revelacao-imagens-report.json"
UA = "Nostalgica90/1.0 (https://github.com/Asilva-01/nostalgica90; revelacao educativa)"
API = "https://commons.wikimedia.org/w/api.php"
WIKI_PT = "https://pt.wikipedia.org/w/api.php"
MAX_BYTES = 80 * 1024

ALLOWED_LICENSES = [
    (re.compile(r"^cc0(\s*1\.0)?$", re.I), "CC0 1.0", "https://creativecommons.org/publicdomain/zero/1.0/"),
    (re.compile(r"public domain|^pd[\s-]|pd-old|pd-us|pd-self|pd-author|cc-pd", re.I), "Public Domain", "https://creativecommons.org/publicdomain/mark/1.0/"),
    (re.compile(r"cc[-\s]?by[-\s]?sa\s*4\.0|attribution-share\s*alike\s*4\.0", re.I), "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"),
    (re.compile(r"cc[-\s]?by[-\s]?sa\s*3\.0|attribution-share\s*alike\s*3\.0", re.I), "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"),
    (re.compile(r"cc[-\s]?by[-\s]?sa\s*2\.5|attribution-share\s*alike\s*2\.5", re.I), "CC BY-SA 2.5", "https://creativecommons.org/licenses/by-sa/2.5/"),
    (re.compile(r"cc[-\s]?by[-\s]?sa\s*2\.0|attribution-share\s*alike\s*2\.0", re.I), "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"),
    (re.compile(r"cc[-\s]?by[-\s]?sa\s*1\.0|attribution-share\s*alike\s*1\.0", re.I), "CC BY-SA 1.0", "https://creativecommons.org/licenses/by-sa/1.0/"),
    (re.compile(r"cc[-\s]?by\s*4\.0|attribution\s*4\.0", re.I), "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"),
    (re.compile(r"cc[-\s]?by\s*3\.0|attribution\s*3\.0", re.I), "CC BY 3.0", "https://creativecommons.org/licenses/by/3.0/"),
    (re.compile(r"cc[-\s]?by\s*2\.5|attribution\s*2\.5", re.I), "CC BY 2.5", "https://creativecommons.org/licenses/by/2.5/"),
    (re.compile(r"cc[-\s]?by\s*2\.0|attribution\s*2\.0", re.I), "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"),
    (re.compile(r"cc[-\s]?by\s*1\.0|attribution\s*1\.0", re.I), "CC BY 1.0", "https://creativecommons.org/licenses/by/1.0/"),
]

REJECT_LICENSE = re.compile(
    r"fair\s*use|non-?free|nonfree|copyrighted|all rights reserved|cc[-\s]?by[-\s]?nc|cc[-\s]?by[-\s]?nd|unlicensed",
    re.I,
)
REJECT_TEXT = re.compile(
    r"screenshot|screen.?shot|title.?screen|box.?art|boxart|cover.?art|"
    r"album.?cover|dvd.?cover|vhs.?cover|movie.?poster|film.?poster|"
    r"video.?game.?cover|game.?cover|logo|wordmark|trademark.?logo|"
    r"fair.?use|non-?free|copyrighted.?work|sprite.?sheet|fan.?art",
    re.I,
)
REJECT_CAT = re.compile(
    r"screenshots of|non-free|fair use|video game covers|film posters|"
    r"album covers|logos of|movie posters|dvd covers|vhs covers|"
    r"television screenshots|anime screenshots|manga covers|"
    r"book covers|magazine covers",
    re.I,
)

# Recusados na revisão do PR: frame de vídeo, logo/tela, Super Pac-Man, trademark.
SKIP_PHOTOS = {
    "eliana",
    "street-fighter-ii",
    "mortal-kombat",
    "pac-man",
    "donkey-kong",
}

# Arquivos preferidos (títulos Commons). Só entram se a licença passar na API.
PREFERRED = {
    "tamagotchi": ["File:Tamagotchi 1997.jpg", "File:Original Tamagotchi.jpg", "File:Tamagotchi.jpg"],
    "tazo": ["File:POGs.jpg", "File:Milkcaps.jpg", "File:Pogs (milk caps).jpg"],
    "super-nintendo": ["File:SNES-Mod1-Console-Set.jpg", "File:Super-Famicom-Console-Set.jpg"],
    "fita-vhs": ["File:VHS cassette with tape.jpg", "File:Vhs tape.jpg", "File:VHS-Video-Tape.jpg"],
    "discman": ["File:Sony D-E307CK.jpg", "File:Sony Discman.jpg", "File:Portable CD player.jpg"],
    "walkman": ["File:Sony Walkman TPS-L2.jpg", "File:Original Sony Walkman TPS-L2.JPG", "File:Walkman.jpg"],
    "bombril": ["File:Steel wool.jpg", "File:Steelwool.jpg"],
    "super-trunfo": ["File:Top Trumps cards.jpg", "File:Quartett karten.jpg", "File:Playing cards stack.jpg"],
    "game-boy": ["File:Game-Boy-FL.jpg", "File:Nintendo-Game-Boy-FL.jpg"],
    "senna": ["File:Ayrton Senna 1988 Canada.jpg", "File:Ayrton Senna 1991.jpg"],
    "formula-1": ["File:Formula 1.jpg", "File:F1 car.jpg"],
    "copa-do-mundo": ["File:FIFA World Cup Trophy.jpg", "File:Jules Rimet Trophy.jpg"],
    "titanic": ["File:RMS Titanic 3.jpg", "File:RMS Titanic.jpg"],
    "orelhao": ["File:Orelhão.jpg", "File:Orelhao.jpg", "File:Telefone público Brasil.jpg"],
    "silvio-santos": ["File:Silvio Santos.jpg", "File:Silvio Santos 2019.jpg"],
    "street-fighter-ii": ["File:Street Fighter II arcade.jpg", "File:Arcade Street Fighter.jpg"],
    "mortal-kombat": ["File:Mortal Kombat arcade.jpg"],
    "internet-discada": ["File:US Robotics Sportster 56K Faxmodem.jpg", "File:56k modem.jpg"],
    "radio-fm": ["File:Portable radio.jpg", "File:FM radio receiver.jpg"],
    "neo-geo": ["File:Neo-Geo-AES-Console-Set.jpg"],
    "pac-man": ["File:PacMan.jpg", "File:Pac-Man arcade.jpg"],
    "donkey-kong": ["File:Donkey Kong arcade.jpg", "File:Nintendo-Donkey-Kong-Arcade.jpg"],
    "papel-de-carta": ["File:Letter writing paper.jpg", "File:Stationery.jpg"],
    "mega-drive": ["File:Sega-Mega-Drive-JP-Mk1-Console-Set.jpg", "File:Sega-Genesis-Mk2-6button.jpg"],
    "master-system": ["File:Sega-Master-System-Set.jpg", "File:Master-System-Console.jpg"],
    "nintendo-64": ["File:Nintendo-64-wController-L.jpg", "File:N64-Console-Set.jpg"],
    "playstation": ["File:PSX-Console-wController.jpg", "File:PlayStation-SCPH-1000-with-controller.jpg"],
}

SEARCHES = {
    "tamagotchi": ["Tamagotchi handheld", "Tamagotchi 1996 toy"],
    "tv-colosso": [],  # programa com personagens protegidos
    "tazo": ["POG milkcaps", "tazo Elma Chips"],
    "super-nintendo": ["Super Nintendo Entertainment System console", "SNES console Evan-Amos"],
    "eliana": ["Eliana apresentadora", "Eliana Michaelichen"],
    "fita-vhs": ["VHS cassette tape", "VHS videocassette"],
    "discman": ["Sony Discman portable CD player", "portable CD player 1990s"],
    "walkman": ["Sony Walkman cassette player TPS-L2", "Walkman cassette"],
    "kibon": [],  # marca / logo
    "bombril": ["steel wool pad", "steel wool close up"],
    "xuxa": ["Xuxa Meneghel", "Xuxa apresentadora"],
    "super-trunfo": ["Top Trumps cards", "Quartett playing cards"],
    "game-boy": ["Game Boy original console", "Nintendo Game Boy gray"],
    "senna": ["Ayrton Senna racing", "Ayrton Senna Formula 1"],
    "formula-1": ["Formula One race car 1990s", "Formula 1 grand prix"],
    "copa-do-mundo": ["FIFA World Cup Trophy", "Brazil national football team 1994"],
    "romario": ["Romário football", "Romario Brazil 1994"],
    "ronaldo": ["Ronaldo Nazário", "Ronaldo Fenômeno Brazil"],
    "dragon-ball-z": [],
    "cavaleiros-do-zodiaco": [],
    "sailor-moon": [],
    "pokemon": [],
    "digimon": [],
    "chaves": ["Estátua El Chavo", "Chespirito Roberto Gómez Bolaños"],
    "videolocadora": ["video rental store", "VHS rental shop interior"],
    "turma-da-monica": ["Mauricio de Sousa", "Maurício de Sousa"],
    "castelo-ra-tim-bum": [],
    "titanic": ["RMS Titanic 1912 photograph", "RMS Titanic ship"],
    "jurassic-park": ["Tyrannosaurus rex skeleton museum", "dinosaur fossil museum exhibit"],
    "orelhao": ["orelhão telefone público Brasil", "Brazilian payphone orelhao"],
    "power-rangers": [],
    "jaspion": [],
    "silvio-santos": ["Silvio Santos apresentador", "Silvio Santos SBT"],
    "gugu-liberato": ["Gugu Liberato", "Augusto Liberato"],
    "street-fighter-ii": ["Street Fighter II arcade cabinet", "Street Fighter arcade machine"],
    "mortal-kombat": ["Mortal Kombat arcade cabinet", "Mortal Kombat arcade machine"],
    "the-king-of-fighters": ["The King of Fighters arcade cabinet", "Neo Geo MVS arcade cabinet"],
    "internet-discada": ["56k dial-up modem", "US Robotics 56K modem"],
    "radio-fm": ["portable FM radio 1990s", "FM radio receiver"],
    "metal-slug": ["Metal Slug arcade cabinet", "Neo Geo arcade cabinet"],
    "neo-geo": ["Neo Geo AES console", "SNK Neo Geo console"],
    "pac-man": ["Pac-Man arcade cabinet", "Pac-Man arcade machine"],
    "donkey-kong": ["Donkey Kong arcade cabinet", "Nintendo Donkey Kong arcade"],
    "papel-de-carta": ["decorative letter paper stationery", "writing paper stationery"],
    "final-fight": ["Final Fight arcade cabinet", "beat em up arcade cabinet"],
    "time-crisis": ["Time Crisis arcade", "light gun arcade cabinet"],
    "vale-tudo": [],
    "roque-santeiro": [],
    "tieta": ["Jorge Amado escritor", "Jorge Amado"],
    "o-rei-do-gado": [],
    "terra-nostra": [],
    "mulheres-de-areia": [],
    "a-viagem": [],
    "chiquititas": [],
    "carrossel": [],
    "eramos-seis": [],
    "mega-drive": ["Sega Mega Drive console", "Sega Genesis console Evan-Amos"],
    "master-system": ["Sega Master System console Evan-Amos", "Master System console"],
    "nintendo-64": ["Nintendo 64 console Evan-Amos", "N64 console controller"],
    "playstation": ["PlayStation SCPH-1000 console Evan-Amos", "original PlayStation console"],
}

WIKI_TITLES = {
    "tamagotchi": "Tamagotchi",
    "tv-colosso": "TV Colosso",
    "tazo": "Tazo",
    "super-nintendo": "Super Nintendo Entertainment System",
    "eliana": "Eliana",
    "fita-vhs": "VHS",
    "discman": "Discman",
    "walkman": "Walkman",
    "kibon": "Kibon",
    "bombril": "Bombril",
    "xuxa": "Xuxa",
    "super-trunfo": "Super Trunfo",
    "game-boy": "Game Boy",
    "senna": "Ayrton Senna",
    "formula-1": "Fórmula 1",
    "copa-do-mundo": "Copa do Mundo FIFA de 1994",
    "romario": "Romário",
    "ronaldo": "Ronaldo Nazário",
    "dragon-ball-z": "Dragon Ball Z",
    "cavaleiros-do-zodiaco": "Os Cavaleiros do Zodíaco",
    "sailor-moon": "Sailor Moon",
    "pokemon": "Pokémon",
    "digimon": "Digimon",
    "chaves": "El Chavo del Ocho",
    "videolocadora": "Videolocadora",
    "turma-da-monica": "Turma da Mônica",
    "castelo-ra-tim-bum": "Castelo Rá-Tim-Bum",
    "titanic": "Titanic (filme de 1997)",
    "jurassic-park": "Jurassic Park",
    "orelhao": "Orelhão",
    "power-rangers": "Power Rangers",
    "jaspion": "Jaspion",
    "silvio-santos": "Silvio Santos",
    "gugu-liberato": "Gugu Liberato",
    "street-fighter-ii": "Street Fighter II",
    "mortal-kombat": "Mortal Kombat",
    "the-king-of-fighters": "The King of Fighters",
    "internet-discada": "Acesso discado",
    "radio-fm": "Frequência modulada",
    "metal-slug": "Metal Slug",
    "neo-geo": "Neo Geo",
    "pac-man": "Pac-Man",
    "donkey-kong": "Donkey Kong (jogo eletrônico de 1981)",
    "papel-de-carta": "Papel de carta",
    "final-fight": "Final Fight",
    "time-crisis": "Time Crisis",
    "vale-tudo": "Vale Tudo (telenovela)",
    "roque-santeiro": "Roque Santeiro",
    "tieta": "Tieta (telenovela)",
    "o-rei-do-gado": "O Rei do Gado",
    "terra-nostra": "Terra Nostra",
    "mulheres-de-areia": "Mulheres de Areia",
    "a-viagem": "A Viagem (telenovela de 1994)",
    "chiquititas": "Chiquititas (Brasil)",
    "carrossel": "Carrossel (telenovela)",
    "eramos-seis": "Éramos Seis (telenovela de 1994)",
}


class _Strip(HTMLParser):
    def __init__(self):
        super().__init__()
        self.out = []

    def handle_data(self, data):
        self.out.append(data)

    def text(self):
        return re.sub(r"\s+", " ", "".join(self.out)).strip()


def strip_html(s: str) -> str:
    if not s:
        return ""
    p = _Strip()
    try:
        p.feed(s)
        return p.text()
    except Exception:
        return re.sub(r"<[^>]+>", "", s).strip()


def api(url: str, params: dict) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json", "formatversion": "2"})
    req = urllib.request.Request(url + "?" + q, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read().decode("utf-8"))


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())


def classify_license(short: str, usage: str, license_url: str) -> tuple[str, str] | None:
    blob = " ".join(x for x in (short, usage, license_url) if x)
    if not blob.strip():
        return None
    if REJECT_LICENSE.search(blob) and not re.search(r"cc[-\s]?by", blob, re.I):
        return None
    # Dual license: aceita se alguma parte for permitida
    chunks = re.split(r"[,;/]| and | e ", blob)
    chunks.append(blob)
    for chunk in chunks:
        for rx, name, default_url in ALLOWED_LICENSES:
            if rx.search(chunk.strip()):
                url = license_url if (license_url or "").startswith("https://") else default_url
                if name.startswith("CC BY") and "NC" in chunk.upper():
                    continue
                if name.startswith("CC BY") and re.search(r"\bND\b", chunk, re.I):
                    continue
                return name, url
    return None


def file_info(title: str) -> dict | None:
    data = api(API, {
        "action": "query",
        "titles": title if title.startswith("File:") else "File:" + title,
        "prop": "imageinfo|categories",
        "iiprop": "url|extmetadata|size|mime|dimensions",
        "iiurlwidth": "960",
        "cllimit": "80",
    })
    pages = data.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        return None
    page = pages[0]
    infos = page.get("imageinfo") or []
    if not infos:
        return None
    info = infos[0]
    meta = info.get("extmetadata") or {}

    def mv(key):
        v = meta.get(key) or {}
        return (v.get("value") or "").strip() if isinstance(v, dict) else str(v or "").strip()

    cats = [c.get("title", "") for c in page.get("categories") or []]
    return {
        "title": page.get("title") or title,
        "url": info.get("url"),
        "thumb": info.get("thumburl") or info.get("url"),
        "mime": info.get("mime") or "",
        "width": info.get("width") or 0,
        "height": info.get("height") or 0,
        "size": info.get("size") or 0,
        "descriptionurl": info.get("descriptionurl") or "",
        "license_short": strip_html(mv("LicenseShortName")),
        "license_url": strip_html(mv("LicenseUrl")),
        "usage": strip_html(mv("UsageTerms")),
        "artist": strip_html(mv("Artist") or mv("Credit")),
        "credit": strip_html(mv("Credit")),
        "restriction": strip_html(mv("Restriction")),
        "copyrighted": strip_html(mv("Copyrighted")),
        "categories": cats,
        "meta_object": mv("ObjectName") + " " + mv("ImageDescription"),
    }


def is_rejected(info: dict) -> str | None:
    blob = " ".join([
        info.get("title") or "",
        info.get("license_short") or "",
        info.get("usage") or "",
        info.get("restriction") or "",
        info.get("meta_object") or "",
        " ".join(info.get("categories") or []),
    ])
    if REJECT_TEXT.search(info.get("title") or ""):
        return "titulo suspeito"
    if REJECT_LICENSE.search(info.get("license_short") or "") or REJECT_LICENSE.search(info.get("usage") or ""):
        # ainda pode ser dual; classify_license decide
        pass
    for cat in info.get("categories") or []:
        if REJECT_CAT.search(cat):
            return "categoria: " + cat
    mime = (info.get("mime") or "").lower()
    if not mime.startswith("image/") or mime in ("image/svg+xml", "image/gif"):
        return "mime " + mime
    if (info.get("width") or 0) < 360:
        return "muito estreita"
    classified = classify_license(info.get("license_short") or "", info.get("usage") or "", info.get("license_url") or "")
    if not classified:
        return "licença não permitida: " + (info.get("license_short") or "?")
    # restrições de marca em foto de console/objeto são comuns; só recusa non-free
    rest = (info.get("restriction") or "").lower()
    if "non-free" in rest or "fair use" in rest:
        return "restrição non-free"
    return None


def search_files(query: str, limit: int = 8) -> list[str]:
    data = api(API, {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": "6",
        "srlimit": str(limit),
    })
    out = []
    for hit in data.get("query", {}).get("search", []):
        title = hit.get("title") or ""
        if title:
            out.append(title)
    return out


def convert_image(src: Path, slug: str) -> dict:
    webp = OUT_DIR / f"{slug}.webp"
    avif = OUT_DIR / f"{slug}.avif"
    work = OUT_DIR / f"{slug}-src{src.suffix.lower() or '.jpg'}"
    if src != work:
        work.write_bytes(src.read_bytes())

    def run(cmd):
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # WebP: tenta qualities decrescentes até caber
    last_err = None
    for q in (72, 62, 52, 42, 32):
        try:
            run([
                "ffmpeg", "-y", "-i", str(work),
                "-vf", "scale='min(960,iw)':-2",
                "-c:v", "libwebp", "-quality", str(q), "-compression_level", "6",
                str(webp),
            ])
            if webp.exists() and webp.stat().st_size <= MAX_BYTES:
                break
        except subprocess.CalledProcessError as e:
            last_err = e
    if not webp.exists() or webp.stat().st_size == 0:
        raise RuntimeError("falha webp: " + str(last_err))
    # se ainda > 80KB, escala menor
    if webp.stat().st_size > MAX_BYTES:
        for w in (720, 560, 420):
            run([
                "ffmpeg", "-y", "-i", str(work),
                "-vf", f"scale='min({w},iw)':-2",
                "-c:v", "libwebp", "-quality", "38", "-compression_level", "6",
                str(webp),
            ])
            if webp.stat().st_size <= MAX_BYTES:
                break

    avif_ok = False
    try:
        run([
            "ffmpeg", "-y", "-i", str(work),
            "-vf", "scale='min(960,iw)':-2",
            "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "38", "-cpu-used", "6",
            str(avif),
        ])
        if avif.exists() and 0 < avif.stat().st_size <= MAX_BYTES:
            avif_ok = True
        elif avif.exists() and avif.stat().st_size > MAX_BYTES:
            run([
                "ffmpeg", "-y", "-i", str(work),
                "-vf", "scale='min(560,iw)':-2",
                "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "45", "-cpu-used", "6",
                str(avif),
            ])
            avif_ok = avif.exists() and 0 < avif.stat().st_size <= MAX_BYTES
            if not avif_ok and avif.exists():
                avif.unlink()
    except subprocess.CalledProcessError:
        if avif.exists():
            avif.unlink()

    try:
        work.unlink()
    except OSError:
        pass
    if src.exists() and src.name.endswith("-dl"):
        try:
            src.unlink()
        except OSError:
            pass

    return {
        "webp": str(webp.relative_to(ROOT)).replace("\\", "/"),
        "webp_bytes": webp.stat().st_size,
        "avif": str(avif.relative_to(ROOT)).replace("\\", "/") if avif_ok else None,
        "avif_bytes": avif.stat().st_size if avif_ok else None,
    }


def wiki_link(slug: str) -> str | None:
    title = WIKI_TITLES.get(slug)
    if not title:
        return None
    data = api(WIKI_PT, {
        "action": "query",
        "titles": title,
        "prop": "info",
        "inprop": "url",
        "redirects": "1",
    })
    pages = data.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        # tenta opensearch
        data = api(WIKI_PT, {"action": "opensearch", "search": title, "limit": "1", "namespace": "0"})
        if isinstance(data, list) and len(data) >= 4 and data[3]:
            return data[3][0]
        return None
    return pages[0].get("fullurl")


def pick_file(slug: str) -> tuple[dict | None, list[str]]:
    tried = []
    titles = []
    for t in PREFERRED.get(slug, []):
        titles.append(t if t.startswith("File:") else "File:" + t)
    for q in SEARCHES.get(slug, []):
        time.sleep(0.15)
        try:
            titles.extend(search_files(q, 8))
        except Exception as e:
            tried.append("search fail " + q + ": " + str(e))
    seen = set()
    uniq = []
    for t in titles:
        k = t.replace(" ", "_").lower()
        if k in seen:
            continue
        seen.add(k)
        uniq.append(t)
    for title in uniq[:18]:
        time.sleep(0.12)
        try:
            info = file_info(title)
        except Exception as e:
            tried.append(title + " erro " + str(e))
            continue
        if not info:
            tried.append(title + " ausente")
            continue
        why = is_rejected(info)
        if why:
            tried.append(title + " recusado: " + why)
            continue
        lic = classify_license(info["license_short"], info["usage"], info["license_url"])
        info["licenca"] = lic[0]
        info["url_licenca"] = lic[1]
        return info, tried
    return None, tried


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--slugs", default="", help="Só estes slugs, separados por vírgula")
    args = parser.parse_args()
    only = {s.strip() for s in args.slugs.split(",") if s.strip()}

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    challenges = json.loads((ROOT / "challenges.json").read_text(encoding="utf-8"))
    report = []
    for c in challenges:
        if only and c["slug"] not in only:
            continue
        slug = c["slug"]
        print("→", c["id"], slug, flush=True)
        link = None
        try:
            link = wiki_link(slug)
        except Exception as e:
            print("  wiki:", e)
        rec = {
            "id": c["id"],
            "slug": slug,
            "resp": c["resp"],
            "link_saiba_mais": link,
            "image": None,
            "skipped": False,
        }
        if slug in SKIP_PHOTOS or (SEARCHES.get(slug) == [] and slug not in PREFERRED):
            rec["skipped"] = True
            rec["motivo"] = (
                "revisão: foto recusada (screenshot/logo/trademark/dúvida)"
                if slug in SKIP_PHOTOS
                else "sem foto livre adequada previsível (programa/marca/screenshot)"
            )
            report.append(rec)
            print("  skip editorial")
            continue
        info, tried = pick_file(slug)
        rec["tentativas"] = tried[:12]
        if not info:
            rec["motivo"] = "nenhum arquivo com licença livre adequada"
            report.append(rec)
            print("  nenhum arquivo")
            continue
        dest_dl = OUT_DIR / f"{slug}-dl"
        url = info.get("thumb") or info.get("url")
        try:
            download(url, dest_dl)
            conv = convert_image(dest_dl, slug)
        except Exception as e:
            rec["motivo"] = "download/conversão: " + str(e)
            report.append(rec)
            print("  falha media", e)
            continue
        autor = info.get("artist") or info.get("credit") or "Autor desconhecido"
        autor = re.sub(r"\s+", " ", autor).strip()[:180]
        rec.update({
            "image": conv["webp"],
            "avif": conv["avif"],
            "webp_bytes": conv["webp_bytes"],
            "avif_bytes": conv["avif_bytes"],
            "credito_imagem": {
                "autor": autor,
                "licenca": info["licenca"],
                "url_licenca": info["url_licenca"],
                "url_origem": info.get("descriptionurl") or ("https://commons.wikimedia.org/wiki/" + urllib.parse.quote(info["title"].replace(" ", "_"))),
            },
            "commons_title": info["title"],
            "commons_license_short": info["license_short"],
        })
        if dest_dl.exists():
            dest_dl.unlink()
        print("  OK", rec["image"], rec["credito_imagem"]["licenca"], rec["webp_bytes"], "b")
        report.append(rec)

    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    com = sum(1 for r in report if r.get("image"))
    print("\nFotos:", com, "/", len(report))
    print("Relatório:", REPORT)


if __name__ == "__main__":
    main()
