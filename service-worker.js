// service-worker.js – PWA stays installable, but NO aggressive caching
const CACHE_NAME = 'ylia-books-minimal-v1';

// Required so the PWA can be installed (empty cache is fine)
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

// ALWAYS go to network — never serve stale files
self.addEventListener('fetch', e => {
  // For HTML pages → always fresh from GitHub
  if (e.request.destination === 'document') {
    e.respondWith(fetch(e.request));
  } else {
    // Images, CSS, JS → normal browser cache is enough
    e.respondWith(fetch(e.request));
  }
});