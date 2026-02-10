const CACHE_NAME = 'books-os-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/vite.svg'
  // Removed video from precache to prevent install failure and storage bloat
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // CRITICAL: Bypass Service Worker for video files.
  // Browsers use Range headers (partial content) for streaming video.
  // Basic cache-first strategies break this, causing the video to not load.
  if (event.request.url.endsWith('.mp4') || event.request.destination === 'video') {
    return; // Go directly to network
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});