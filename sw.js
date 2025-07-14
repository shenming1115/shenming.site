const CACHE_NAME = 'shenming-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/Assets/psycho-kev-9uYCEzNYZ2A-unsplash.jpg',
  '/Assets/burp-1.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg',
  'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content using Stale-While-Revalidate strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we got a valid response, update the cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        // Return the cached response immediately, while the fetch happens in the background.
        return response || fetchPromise;
      });
    })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
