cacheNAME = "tr-cache";
cacheURLS = [
  'js/b58.js',
  'css/satisfy.css'
];

self.addEventListener("install",function(installEvent){
  installEvent.waitUntil(
    caches.open(cacheNAME).then(function(cache){
      return cache.addAll(cacheURLS);
    })
  );
});

self.addEventListener("fetch",function(e){
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request);
    })
  );
});
