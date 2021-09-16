const CACHE_NAME = "tr-offline-alpha2";
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

// let's do this with smaller variables
self.addEventListener("fetch",function(e){
  console.log(e.request.url)
  e.respondWith(
  async function () {
        try {
          const nr = await fetch(e.request);
          
          return nr;
          
        } catch (er) {
          console.log(er)
          const c = await caches.open(CACHE_NAME),
                cr = await c.match(CACHE_URL);

          return cr;
        }
      }()
  )
});
