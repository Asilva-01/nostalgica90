/* ============================================================
   NOSTÁLGICA 90 — Service Worker (PWA)
   Cache estático para funcionamento offline e carregamento rápido.
   NUNCA bloqueia o jogo: se falhar, a página carrega normal.
   ============================================================ */
var CACHE = 'nostalgica90-v8';
var ASSETS = [
  './',
  './index.html',
  './styles.css',
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
  './assets/memory/windows-95.svg'
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