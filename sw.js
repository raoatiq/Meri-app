const CACHE = 'mt-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => 
      Promise.allSettled([
        c.add('/Meri-app/mytracker-14.html'),
        c.add('/Meri-app/manifest.json'),
        c.add('/Meri-app/index.html'),
        c.add('https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js'),
        c.add('https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js')
      ])
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => 
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(r => {
      if(r) return r;
      return fetch(e.request).then(res => {
        if(res && res.status === 200 && res.type !== 'opaque'){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/Meri-app/mytracker-14.html', {ignoreSearch: true}));
    })
  );
});
