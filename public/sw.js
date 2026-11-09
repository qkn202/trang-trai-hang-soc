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

const CACHE_VERSION = 'v5';
const SHELL_CACHE = `hangsoc-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `hangsoc-static-${CACHE_VERSION}`;
const ASSETS_CACHE = `hangsoc-assets-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/fonts/fonts.css',
];

function isHtmlContentType(response) {
  const ct = (response && response.headers && response.headers.get('content-type')) || '';
  return ct.includes('text/html');
}

// Install: precache app shell and activate immediately
self.addEventListener('install', (event) => {
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

// Activate: clean up old cache versions and claim clients
self.addEventListener('activate', (event) => {
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

  // Never intercept Vite dev server modules, HMR endpoints, or inline HTML proxies
  if (
    pathname.startsWith('/src/') ||
    pathname.startsWith('/@') ||
    pathname.startsWith('/node_modules/') ||
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
      fetch(request)
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
            (pathname === '/' ? await caches.match('/index.html') : null);
          if (cached) return cached;

          const offlinePage = await caches.match('/offline.html');
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
  if (pathname.startsWith('/assets/') || pathname.startsWith('/fonts/')) {
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
    pathname.startsWith('/sprites/') ||
    pathname.startsWith('/paintings/') ||
    pathname.startsWith('/audio/') ||
    pathname.startsWith('/icons/');

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
  if (pathname === '/manifest.webmanifest') {
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
