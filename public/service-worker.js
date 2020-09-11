const CACHE_NAME = 'moodtracker-cache';
const toCache = [
  '/',
  '/index.html',
  '/images/icon.png',
  '/images/splash_screen.png',
  '/images/maskable_icon.png',
  '/javascripts/pwa.js',
  '/javascripts/status.js',
  '/javascripts/pwa.webmanifest',
  '/javascripts/bootstrap.min.js',
  '/javascripts/bootstrap.min.js.map',
  '/javascripts/jquery.min.js',
  '/stylesheets/style.css',
  '/stylesheets/bootstrap.min.css',
  '/stylesheets/bootstrap.min.css.map'

];




self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})

self.addEventListener('fetch', function(event) {
 event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(event.request)
          })
      })
  )

})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
})