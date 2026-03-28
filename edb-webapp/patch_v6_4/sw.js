// Service Worker for EDB Portal - V2.1 (Network-First for Index)
const CACHE_NAME = 'edb-portal-v2.1';
const ASSETS = [
    '/',
    '/index.html',
    '/favicon/favicon.png',
    '/favicon/icon-192x192.png',
    '/favicon/icon-512x512.png',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Network-first strategy for the main page to ensure it's always up to date
    if (event.request.mode === 'navigate' || event.request.url.endsWith('index.html') || event.request.url === self.location.origin + '/') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for other assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});
