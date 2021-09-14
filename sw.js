const CACHE_NAME = "tr-offline";
const CACHE_URL = "offline.html"

self.addEventListener("install",function(installEvent){
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.add(new Request(CACHE_URL, { cache: "reload" }));
    })
  );
  self.skipWaiting()
});

self.addEventListener("activate",function(e){
  e.waitUntil(function(){
      if ("navigationPreload" in self.registration) {
        self.registration.navigationPreload.enable()
      }
    }
  )
  self.clients.claim()
})

self.addEventListener("fetch",function(e){
  e.respondWith(function(){
      try {
        if(e.preloadResponse) {
          return e.preloadResponse
        }
        return fetch(e.request)
      }
      catch (err) {
        console.log(err)
        caches.open(CACHE_NAME).then(function(cache){
          return cache.match(CACHE_URL)
        })
      }
    }
  );
});
