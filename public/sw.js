/**
 * Service Worker — Trang Trại Hang Sóc & Thung Lũng Hogsmeade
 * Handcrafted vanilla SW (no workbox dependency)
 * Caching strategies:
 * - App Shell: Precache ('/index.html', '/offline.html', '/manifest.webmanifest')
 * - Navigations: Network-first -> Cache fallback -> Offline fallback ('/offline.html')
 * - Static Media (/sprites/, /paintings/, /audio/, /icons/): Stale-While-Revalidate (~14MB assets)
 * - Build Assets (/assets/*): Cache-first (Vite content-hashed)
 * - Vite Dev / HMR (/src/*, /@*, /node_modules/*): Always bypass SW (network-only)
 */

const CACHE_VERSION = 'v53';
const SHELL_CACHE = `hangsoc-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `hangsoc-static-${CACHE_VERSION}`;
const ASSETS_CACHE = `hangsoc-assets-${CACHE_VERSION}`;
const IS_VITE_DEV_PORT = self.location.port === '5173';
const SCOPE_PATH = new URL('./', self.location.href).pathname;

const PRECACHE_URLS = [
  SCOPE_PATH,
  `${SCOPE_PATH}index.html`,
  `${SCOPE_PATH}offline.html`,
  `${SCOPE_PATH}manifest.webmanifest`,
  `${SCOPE_PATH}fonts/fonts.css`,
];

function isHtmlContentType(response) {
  const ct = (response && response.headers && response.headers.get('content-type')) || '';
  return ct.includes('text/html');
}

// Install: precache app shell and activate immediately (bypass completely on Vite dev port 5173)
self.addEventListener('install', (event) => {
  if (IS_VITE_DEV_PORT) {
    event.waitUntil(self.skipWaiting());
    return;
  }
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then(async (cache) => {
        await Promise.all(
          PRECACHE_URLS.map(async (url) => {
            try {
              await cache.add(url);
            } catch (err) {
              console.warn('[SW] Precache failed for:', url, err);
            }
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old cache versions and claim clients (self-unregister on Vite dev port 5173)
self.addEventListener('activate', (event) => {
  if (IS_VITE_DEV_PORT) {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.matchAll({ type: 'window' }))
        .then((clients) => {
          for (const client of clients) {
            if ('navigate' in client) {
              client.navigate(client.url).catch(() => {});
            }
          }
        })
    );
    return;
  }
  const currentCaches = new Set([SHELL_CACHE, STATIC_CACHE, ASSETS_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.has(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch dispatcher
self.addEventListener('fetch', (event) => {
  if (IS_VITE_DEV_PORT) {
    return;
  }
  const { request } = event;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Only intercept same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  const { pathname, searchParams } = url;
  const relPath = pathname.startsWith(SCOPE_PATH)
    ? `/${pathname.slice(SCOPE_PATH.length)}`
    : pathname;

  // Never intercept API gateways, Vite dev server modules, HMR endpoints, or inline HTML proxies
  if (
    relPath.startsWith('/api/') ||
    relPath.startsWith('/demo-') ||
    relPath.startsWith('/src/') ||
    relPath.startsWith('/@') ||
    relPath.startsWith('/node_modules/') ||
    searchParams.has('html-proxy') ||
    searchParams.has('t') ||
    searchParams.has('import')
  ) {
    return;
  }

  // (a) Navigations (mode 'navigate' or text/html requests)
  // Strategy: Network-first -> Cache fallback -> Final fallback offline.html
  const isNavigation =
    request.mode === 'navigate' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached =
            (await caches.match(request)) ||
            (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match(`${SCOPE_PATH}index.html`));
          if (cached) return cached;

          const offlinePage = await caches.match(`${SCOPE_PATH}offline.html`);
          if (offlinePage) return offlinePage;

          return new Response('Không có kết nối mạng', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
    );
    return;
  }

  // (c) Vite hashed build assets (/assets/*) and immutable self-hosted WOFF2 fonts (/fonts/*)
  // Strategy: Cache-first (excluding SPA text/html fallback responses)
  if (relPath.startsWith('/assets/') || relPath.startsWith('/fonts/')) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        const networkResponse = await fetch(request);
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          !isHtmlContentType(networkResponse)
        ) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }

  // (b) Static heavy media assets (/sprites/*, /paintings/*, /audio/*, /icons/*)
  // Strategy: Stale-While-Revalidate (~14MB assets, excluding SPA text/html fallbacks)
  const isMediaAsset =
    relPath === '/favicon.ico' ||
    relPath.startsWith('/sprites/') ||
    relPath.startsWith('/paintings/') ||
    relPath.startsWith('/audio/') ||
    relPath.startsWith('/icons/');

  if (isMediaAsset) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);

        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              (networkResponse.status === 200 || networkResponse.type === 'opaque') &&
              !isHtmlContentType(networkResponse)
            ) {
              if (networkResponse.status !== 206) {
                cache.put(request, networkResponse.clone());
              }
            }
            return networkResponse;
          })
          .catch((err) => {
            if (!cached) throw err;
          });

        return cached || fetchPromise;
      })
    );
    return;
  }

  // (d) Manifest metadata: Network-first with cache fallback
  if (relPath === '/manifest.webmanifest') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            !isHtmlContentType(networkResponse)
          ) {
            const clone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || Response.error();
        })
    );
  }
});
