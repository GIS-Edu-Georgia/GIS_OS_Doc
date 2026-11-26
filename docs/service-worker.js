// ======================================================
// GIS OS Docs — Service Worker (PWA ოფლაინ მხარდაჭერა)
// ======================================================
// ⚠️ ეს ფაილი root-ში უნდა იყოს (docs/service-worker.js),
// რომ scope მთელ საიტს მოიცავდეს.
// რეგისტრაცია ხდება: docs/js/service-worker-register.js-ის მეშვეობით.

// v2: საიტის ფაილები network-first (ძველი ვერსია აღარ ჩანს); v1 cache activate-ზე იშლება
var CACHE_NAME = 'gis-os-docs-v2';

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
// სტრატეგია:
//  • საიტის ფაილები (HTML, JS, CSS, ქვიზის მონაცემები): network-first.
//    ყოველთვის ახალი ვერსია მოდის ქსელიდან; cache მხოლოდ ოფლაინისთვისაა.
//    cache: 'no-cache' ბრაუზერის HTTP ქეშსაც (GitHub Pages: max-age=600) გადაამოწმებინებს.
//  • Google Fonts: cache-first (ფონტები არ იცვლება, ოფლაინშიც ჩანს).
function putInCache(request, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return;
  var copy = response.clone();
  caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
}

function networkFirst(request) {
  return fetch(request, { cache: 'no-cache' })
    .then(function (response) {
      putInCache(request, response);
      return response;
    })
    .catch(function () {
      // ქსელი მიუწვდომელია: შენახული ვერსია, navigation-ზე offline გვერდი
      return caches.match(request).then(function (cached) {
        if (cached) return cached;
        if (request.mode === 'navigate') return caches.match(OFFLINE_URL);
        return Response.error();
      });
    });
}

function cacheFirst(request) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      putInCache(request, response);
      return response;
    });
  });
}

self.addEventListener('fetch', function (event) {
  // მხოლოდ GET მოთხოვნები
  if (event.request.method !== 'GET') return;

  // chrome-extension და სხვა non-http სქემები გამოვტოვოთ
  if (!event.request.url.startsWith('http')) return;

  var url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(event.request));
  }
  // სხვა დომენები: service worker არ ერევა
});
