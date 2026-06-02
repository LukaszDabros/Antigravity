const CACHE_NAME = 'laser-range-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon.png',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=JetBrains+Mono&display=swap',
    'https://assets.mixkit.co/sfx/preview/mixkit-gunshot-731.mp3'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); // Aktualizuj od razu
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Network first, fallback to cache for offline support
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
