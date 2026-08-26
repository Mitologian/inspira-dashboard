// Inspira × Ansaka — Service Worker
// Minimal SW untuk PWA installability
// Tidak cache konten Apps Script — selalu real-time dari Google Sheets

const CACHE_NAME = 'inspira-dashboard-v2';

const SHELL_FILES = [
  '/',
  '/index.html',
  '/input.html',
  '/manifest.json',
  '/manifest-input.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Apps Script — selalu dari network, tidak pernah cache
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Shell files — cache first
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request);
    })
  );
});
