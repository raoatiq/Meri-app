const CACHE_NAME = 'mytracker-v2';
const URLS = [
  '/Meri-app/mytracker.html',
  '/Meri-app/manifest.json',
  '/Meri-app/sw.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
];

// Install — sab files cache karo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS);
    })
  );
  self.skipWaiting();
});

// Activate — purana cache delete karo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — pehle cache se do, nahi mila to network se
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Successful response cache mein save karo
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Network bhi nahi — cache se do
        return caches.match('/Meri-app/mytracker.html');
      });
    })
  );
});
