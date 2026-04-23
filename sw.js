self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('jadi-store').then((cache) => cache.addAll(['/index.html', '/css/styles.css', '/js/core.js']))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
