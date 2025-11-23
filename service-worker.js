const CACHE_NAME = 'ylia-books-pwa-v2';
const OFFLINE_URLS = [
  '/books/',
  '/books/index.html',
  '/books/manifest.json',
  '/books/install-pwa.js',
  '/books/pwa-icons/icon-192.png',
  '/books/pwa-icons/icon-512.png'
];

// Install SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .catch(err => console.error("Cache addAll failed:", err))
  );
  self.skipWaiting();
});

// Fetch handler — cache-first only for GET requests
self.addEventListener('fetch', event => {

  // Only handle GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Cache hit → return cached
        if (cached) return cached;

        // Otherwise → network
        return fetch(event.request)
          .catch(() => caches.match('/index.html'));
      })
  );
});

// Activate & clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});
