const CACHE_NAME = "eml-static-cache-v1";
const DYNAMIC_CACHE_NAME = "eml-dynamic-cache-v1";

// Core static pages and stylesheet assets to cache immediately
const PRECACHE_ASSETS = [
  "/",
  "/browse",
  "/escrow",
  "/manifest.json",
  "/favicon.ico",
  "/globals.css"
];

// 1. Install Event: Populate the static cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up stale legacy caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Dual-caching strategies
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategy A: Network-First Fallback to Cache (For live Supabase queries and listings data)
  if (requestUrl.origin === self.location.origin && requestUrl.pathname.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Save a copy of the fresh database query result in the dynamic cache
          return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If offline, serve the last-cached listings query response
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategy B: Stale-While-Revalidate (For structural layout files, icons, and static scripts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => null); // Fail silently on network drop

      return cachedResponse || fetchPromise;
    })
  );
});