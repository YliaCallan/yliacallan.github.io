self.addEventListener('fetch', event => {
  if (event.request.url.includes('/wp-content/uploads/') && 
      (event.request.url.endsWith('.mp3') || event.request.url.endsWith('.jpg'))) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
