const CACHE_NAME = 'ylia-books-pwa-v4';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/install-pwa.js',
  '/pwa-icons/icon-192.png',
  '/pwa-icons/icon-512.png',
  '/books/The-Breath-of-Reality-A-Scientific-and-Spiritual-Guide-to-Breathing-Meditation-and-Manifestation.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .catch(err => console.error('Cache addAll failed:', err))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});