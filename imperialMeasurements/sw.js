let cacheName = "im-0.5"
let filesToCache = [
  "/imperialMeasurements/index.html",
  "/imperialMeasurements/favicon.ico"
]

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request)
    })
  )
})