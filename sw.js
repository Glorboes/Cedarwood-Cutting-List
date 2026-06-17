/* Cedarwood Cutting List — service worker
   Caches the app shell so it opens with NO internet after the first visit.
   Bump CACHE when you change index.html and want clients to pick it up sooner. */
const CACHE = "cedarwood-cutlist-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Live Google Sheets CSV: never cache it — let it hit the network.
  // When offline the request fails and the app falls back to its embedded list.
  if (url.hostname.indexOf("google.com") !== -1) return;

  // App shell (same origin): serve from cache first for instant + offline load,
  // and refresh the cached copy in the background when online (stale-while-revalidate).
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
