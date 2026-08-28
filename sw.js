// Client OS — service worker
// Naikkan angka versi setiap kali file di repo ini diubah.
const CACHE_NAME = 'inspira-clientos-v3';
const SHELL = [
  'index.html',
  'needs.html',
  'manifest.json',
  'manifest-needs.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(function (c) { return c.addAll(SHELL); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  // Jangan pernah cache Apps Script. Data harus selalu segar.
  if (e.request.url.indexOf('script.google.com') !== -1 ||
      e.request.url.indexOf('googleusercontent.com') !== -1) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).then(function (res) {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
