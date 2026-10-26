/*
 * Civicly service worker.
 * - Pages: try the network first so records stay current, fall back to the
 *   last copy saved on this device, then to the offline page.
 * - Build files under /_next/static never change once published, so they are
 *   served from the cache first.
 * - Everything else on this site (icons, images, feeds) is served from the
 *   cache when available and refreshed in the background.
 */

const VERSION = 'v1'
const PAGES = `civicly-pages-${VERSION}`
const STATIC = `civicly-static-${VERSION}`
const ASSETS = `civicly-assets-${VERSION}`
const OFFLINE_URL = '/offline'

const PRECACHE = [OFFLINE_URL, '/', '/manifest.webmanifest', '/icon.svg', '/pwa-icon/192', '/pwa-icon/512']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  const keep = new Set([PAGES, STATIC, ASSETS])
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('civicly-') && !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

async function networkFirst(request) {
  const cache = await caches.open(PAGES)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request, { ignoreSearch: false })
    return cached || (await cache.match(OFFLINE_URL)) || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(ASSETS)
  const cached = await cache.match(request)
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  if (cached) {
    event.waitUntil(refresh)
    return cached
  }
  return refresh
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // Calendar downloads should always be fresh.
  if (url.pathname.startsWith('/api/calendar/')) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request))
    return
  }
  // Data for client-side page changes: treat like pages so they work offline too.
  if (request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')) {
    event.respondWith(networkFirst(request))
    return
  }
  event.respondWith(staleWhileRevalidate(request, event))
})
