const CACHE_NAME = "ajobi-cache-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/favicon.ico",
  "/manifest.json",
  "/images/hero-mark-icon.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Exclude API requests, dev hot-module reloading (webpack-hmr), and chrome-extensions
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes("hot-update")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If we have a cached response:
      if (cachedResponse) {
        // Cache-first for hashed static bundles/images
        if (
          url.pathname.startsWith("/_next/static/") ||
          url.pathname.startsWith("/images/") ||
          url.pathname.endsWith(".png") ||
          url.pathname.endsWith(".ico") ||
          url.pathname.endsWith(".svg")
        ) {
          return cachedResponse;
        }
      }

      // Network-first for pages and other files
      return fetch(event.request)
        .then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Cache new successful GET requests on the fly (except development hot reload or dynamic stuff)
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If offline and request is for page navigation, fallback to root page/shell
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return cachedResponse;
        });
    })
  );
});
