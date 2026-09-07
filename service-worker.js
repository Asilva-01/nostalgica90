/* ============================================================
   NOSTÁLGICA 90 — Service Worker (PWA)
   Cache estático para funcionamento offline e carregamento rápido.
   NUNCA bloqueia o jogo: se falhar, a página carrega normal.
   ============================================================ */
var CACHE = 'nostalgica90-v1';
var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './data.js',
  './musica.js',
  './som.js',
  './efeitos.js',
  './game.js',
  './challenges.json',
  './museum.json',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/og-image.png',
  './assets/audio/ui-click.wav',
  './assets/audio/ui-success.wav',
  './assets/audio/ui-error.wav',
  './assets/audio/ui-reveal.wav',
  './assets/audio/ui-arcade.wav',
  './assets/audio/ui-channel.wav'
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
  e.respondWith(
    caches.match(e.request).then(function (res) {
      if (res) return res;
      return fetch(e.request).then(function (net) {
        // cache dinâmico para navegação/JSONs
        if (net && net.ok) {
          var copy = net.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
        }
        return net;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});