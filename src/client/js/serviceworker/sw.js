/* eslint-disable no-restricted-globals */
const filesToCache = [
  '/',
  'index.html',
  // 'offline.html',
  // '404.html',
  // 'js/offline.js',
  // 'favicon.ico',
  // 'manifest.json',
];

const staticCacheName = 'generic-game-cache-v1';

self.addEventListener('install', (event) => {
  // console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(caches.open(staticCacheName).then((cache) => cache.addAll(filesToCache)));
});

self.addEventListener('fetch', (event) => {
  // console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then((res) => {
        if (res) {
          // console.log('Found ', event.request.url, ' in cache');
          return res;
        }
        // console.log('Network request for ', event.request.url);
        return fetch(event.request).then((response) => {
          if (response.status === 404) {
            return caches.match('404.html');
          }
          return caches.open(staticCacheName).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch(() =>
        // console.log('Error, ', error);
        caches.match('offline.html')
      )
  );
});
