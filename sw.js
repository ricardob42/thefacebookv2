const CACHE_NAME = 'thefacebook-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache (adjust paths as needed)
const CACHE_FILES = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event - Caches critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting()) // Activate SW immediately
  );
});

// Activate Event - Cleans up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Remove old caches
          }
        })
      );
    })
  );
});

// Fetch Event - Network-first strategy
self.addEventListener('fetch', (event) => {
  // Handle page navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL)) // Fallback to offline page
    );
  } 
  // Handle other requests (CSS, JS, images)
  else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
