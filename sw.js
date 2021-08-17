const cacheNAME = "tr-cache-v2";
const cacheURLS = [
  'fonts/satisfy-v11-latin-regular.woff2',
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
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    })
  );
});
