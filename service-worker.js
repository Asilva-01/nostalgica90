/* ============================================================
   NOSTÁLGICA 90 — Service Worker (PWA)
   Cache estático para funcionamento offline e carregamento rápido.
   NUNCA bloqueia o jogo: se falhar, a página carrega normal.
   ============================================================ */
var CACHE = 'nostalgica90-v17';
var ASSETS = [
  './',
  './index.html',
  './creditos.html',
  './CREDITS.md',
  './robots.txt',
  './sitemap.xml',
  './styles.css',
  './selecao-rodada.js',
  './resposta.js',
  './arte-propria.json',
  './assets/fonts/local.css',
  './assets/fonts/bungee-400.woff2',
  './assets/fonts/outfit.woff2',
  './assets/fonts/share-tech-mono-400.woff2',
  './data.js',
  './artes.js',
  './museu-artes.js',
  './cenas.js',
  './musica.js',
  './som.js',
  './audio-ui.js',
  './efeitos.js',
  './game.js',
  './challenges.json',
  './museum.json',
  './memories.json',
  './scenes.json',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/og-image.png',
  './assets/audio/ui-click.wav',
  './assets/audio/ui-success.wav',
  './assets/audio/ui-error.wav',
  './assets/audio/ui-reveal.wav',
  './assets/audio/ui-arcade.wav',
  './assets/audio/ui-channel.wav',
  './assets/audio/tamagotchi-bip.wav',
  './assets/audio/tazo-estalo.wav',
  './assets/audio/videolocadora-vhs.wav',
  './assets/audio/orelhao-discar.wav',
  './assets/audio/fliperama-arcade.wav',
  './assets/audio/modem-discada.wav',
  './assets/memory/tamagotchi.svg',
  './assets/memory/tazo.svg',
  './assets/memory/videolocadora.svg',
  './assets/memory/orelhao.svg',
  './assets/memory/street-fighter-2.svg',
  './assets/memory/windows-95.svg',
  './assets/images/revelacao/iss-deluxe.webp',
  './assets/images/revelacao/iss-deluxe.avif',
  './assets/images/revelacao/donkey-kong.webp',
  './assets/images/revelacao/donkey-kong.avif',
  './assets/images/revelacao/donkey-kong-country.webp',
  './assets/images/revelacao/donkey-kong-country.avif',
  './assets/images/revelacao/top-gear.webp',
  './assets/images/revelacao/top-gear.avif',
  './assets/images/revelacao/street-fighter-ii.webp',
  './assets/images/revelacao/street-fighter-ii.avif',
  './assets/images/revelacao/nba-jam.webp',
  './assets/images/revelacao/nba-jam.avif',
  './assets/images/revelacao/super-mario-kart.webp',
  './assets/images/revelacao/super-mario-kart.avif',
  './assets/images/revelacao/resident-evil.webp',
  './assets/images/revelacao/resident-evil.avif',
  './assets/images/revelacao/final-fantasy-vii.webp',
  './assets/images/revelacao/final-fantasy-vii.avif',
  './assets/images/revelacao/goldeneye-007.webp',
  './assets/images/revelacao/goldeneye-007.avif',
  './assets/images/revelacao/castelo-ra-tim-bum.webp',
  './assets/images/revelacao/castelo-ra-tim-bum.avif',
  './assets/images/revelacao/papel-de-carta.webp',
  './assets/images/revelacao/papel-de-carta.avif',
  './assets/images/revelacao/caverna-do-dragao.webp',
  './assets/images/revelacao/caverna-do-dragao.avif',
  './assets/images/revelacao/mortal-kombat.webp',
  './assets/images/revelacao/mortal-kombat.avif',
  './assets/images/revelacao/streets-of-rage.webp',
  './assets/images/revelacao/streets-of-rage.avif',
  './assets/images/revelacao/kibon.webp',
  './assets/images/revelacao/kibon.avif'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // network-first: garante assets atualizados (evita misturar index novo
  // com data.js/cenas.js antigos). Cai no cache apenas se estiver offline.
  e.respondWith(
    fetch(e.request).then(function (net) {
      if (net && net.ok) {
        var copy = net.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
        return net;
      }
      return caches.match(e.request).then(function (res) {
        return res || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined);
      });
    }).catch(function () {
      return caches.match(e.request).then(function (res) {
        return res || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined);
      });
    })
  );
});