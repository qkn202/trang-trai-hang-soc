/**
 * Service Worker cho Hang Sóc Mini-games Offline (`offline-sw`)
 * - Độc lập hoàn toàn với Service Worker của bản nông trại chính.
 * - Precache 100% shell, JS/CSS chunks, font, icon, tranh ghép và sprite mini-game
 *   ngay khi cài đặt để bật Airplane Mode chơi được tức thì.
 * - Tuyệt đối không gọi API online.
 */

const CACHE_VERSION = 'offline-v1';
const CACHE_NAME = `hangsoc-offline-${CACHE_VERSION}`;
const SCOPE_URL = new URL('./', self.location.href);
const SCOPE_PATH = SCOPE_URL.pathname;

const CORE_SHELL_URLS = [
  SCOPE_PATH,
  `${SCOPE_PATH}index.html`,
  `${SCOPE_PATH}offline.html`,
  `${SCOPE_PATH}manifest.webmanifest`,
  `${SCOPE_PATH}fonts/fonts.css`,
];

// Danh sách toàn bộ chunk + asset được `vite.offline.config.ts` điền tự động sau khi build
const PRECACHE_MANIFEST = [/* __OFFLINE_PRECACHE_MANIFEST__ */];

function toScopedUrl(relPath) {
  const clean = String(relPath || '').replace(/^\.\//, '').replace(/^\//, '');
  return `${SCOPE_PATH}${clean}`;
}

async function precacheInBatches(cache, urls, batchSize) {
  for (let i = 0; i < urls.length; i += batchSize) {
    const slice = urls.slice(i, i + batchSize);
    await Promise.all(
      slice.map(async (u) => {
        try {
          await cache.add(u);
        } catch {
          // Bỏ qua asset lẻ nếu môi trường preview cục bộ thiếu file phụ
        }
      })
    );
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        const allSet = new Set(CORE_SHELL_URLS);
        for (const rel of PRECACHE_MANIFEST) {
          allSet.add(toScopedUrl(rel));
        }
        await precacheInBatches(cache, Array.from(allSet), 24);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('hangsoc-offline-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Bản offline tuyệt đối không bao giờ gọi API backend
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/api/')) {
    event.respondWith(new Response(null, { status: 404, statusText: 'Offline Standalone Mode' }));
    return;
  }

  // Navigation: ưu tiên mở ngay từ cache (Airplane Mode instant boot), fallback offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedIndex =
          (await cache.match(`${SCOPE_PATH}index.html`, { ignoreSearch: true })) ||
          (await cache.match(SCOPE_PATH, { ignoreSearch: true }));
        if (cachedIndex) {
          return cachedIndex;
        }
        try {
          const netRes = await fetch(request);
          if (netRes && netRes.ok) {
            cache.put(`${SCOPE_PATH}index.html`, netRes.clone());
          }
          return netRes;
        } catch {
          const fallback = await cache.match(`${SCOPE_PATH}offline.html`, { ignoreSearch: true });
          return (
            fallback ||
            new Response('Offline', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          );
        }
      })()
    );
    return;
  }

  // Static assets (JS, CSS, fonts, paintings, sprites, icons): Cache-First
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const netRes = await fetch(request);
        if (netRes && netRes.status === 200) {
          cache.put(request, netRes.clone());
        }
        return netRes;
      } catch {
        return new Response(null, { status: 504, statusText: 'Offline Cache Miss' });
      }
    })()
  );
});
