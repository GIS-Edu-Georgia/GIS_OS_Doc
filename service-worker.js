// ======================================================
// GIS OS Docs — Service Worker (PWA ოფლაინ მხარდაჭერა)
// ======================================================
// ⚠️ ეს ფაილი root-ში უნდა იყოს (docs/service-worker.js),
// რომ scope охватывал მთელ საიტს.
// რეგისტრაცია ხდება: docs/js/service-worker-register.js-ის მეშვეობით.

var CACHE_NAME = 'gis-os-docs-v1';

// ოფლაინ-ის შემთხვევაში fallback გვერდი
var OFFLINE_URL = './';

// ==================== INSTALL ====================
self.addEventListener('install', function (event) {
  // skipWaiting პირდაპირ — install ჩავარდნა არ მოხდეს
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // catch: GitHub Pages redirect-ები cache.add()-ს ანგრევს
      return cache.add(OFFLINE_URL).catch(function () {});
    })
  );
});

// ==================== ACTIVATE ====================
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            // ძველი cache ვერსიები წაიშალოს
            return name !== CACHE_NAME;
          })
          .map(function (name) {
            return caches.delete(name);
          })
      );
    })
  );
  // SW დაუყოვნებლივ კლიენტებს გადაეცეს
  self.clients.claim();
});

// ==================== FETCH ====================
self.addEventListener('fetch', function (event) {
  // მხოლოდ GET მოთხოვნები
  if (event.request.method !== 'GET') return;

  // chrome-extension და სხვა non-http სქემები გამოვტოვოთ
  if (!event.request.url.startsWith('http')) return;

  // მხოლოდ საიტი და Google Fonts (ფონტები ოფლაინშიც რომ გამოჩნდეს)
  var url = new URL(event.request.url);
  var allowed = url.origin === self.location.origin ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';
  if (!allowed) return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      // Cache-ში პასუხი იქნება — დავაბრუნოთ, ფონში განვაახლოთ
      if (cachedResponse) {
        fetch(event.request)
          .then(function (networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(function () {});
        return cachedResponse;
      }

      // Cache-ში არ არის — ქსელიდან მოვიტანოთ და შევინახოთ
      return fetch(event.request)
        .then(function (networkResponse) {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === 'opaque'
          ) {
            return networkResponse;
          }

          var responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(function () {
          // ქსელი მიუწვდომელია — navigation-ისთვის offline გვერდი
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});
