const cacheNAME = "tr-cache-v2";
const cacheURL = 'ipfs-404.html'

self.addEventListener("install",function(installEvent){
  installEvent.waitUntil(
    caches.open(cacheNAME).then(function(cache){
      return cache.add(cacheURL);
    })
  );
});

self.addEventListener("fetch",function(e){
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    })
  );
});
