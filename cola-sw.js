/* Service Worker auxiliar do Minha Cola 2026.
   O SW principal do site (/sw.js) já cobre a navegação.
   Este arquivo fica preparado caso o app seja publicado em escopo próprio. */
const COLA_CACHE = "minha-cola-2026-v1";
const COLA_PRECACHE = [
  "/colinha",
  "/cola-manifest.webmanifest",
  "/cola-icon-192.png",
  "/cola-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(COLA_CACHE).then((cache) => cache.addAll(COLA_PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match("/colinha"))),
  );
});
