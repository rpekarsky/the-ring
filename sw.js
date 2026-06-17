// Cache version; deploy pipeline replaces __BUILD_HASH__ with the git SHA.
var CACHE_VERSION = '__BUILD_HASH__';
var CACHE_NAME    = 'the-ring-' + CACHE_VERSION;

var PRECACHE = [
    './',
    './out/out.min.js',
    './sprite_en.png',
    './spriteSheet_en.json',
    './font/Comfortaa.fnt',
    './font/Comfortaa_0.png',
    './manifest.webmanifest',
    './192.png',
    './512.png',
    './favicon.png'
];

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(PRECACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.filter(function(k){
                return k !== CACHE_NAME;
            }).map(function(k){
                return caches.delete(k);
            }));
        }).then(function(){
            return self.clients.claim();
        })
    );
});

// Cache-first with runtime caching: sounds and other extras get cached on first hit.
self.addEventListener('fetch', function(event){
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(function(cached){
            if (cached) return cached;
            return fetch(event.request).then(function(response){
                if (response.ok && new URL(event.request.url).origin === self.location.origin) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache){
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function(){
                // Offline + uncached → fall back to root document for navigation requests.
                if (event.request.mode === 'navigate') {
                    return caches.match('./');
                }
            });
        })
    );
});
