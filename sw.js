cacheNAME = "tr-cache";
cacheURLS = [
  '/',
  'index.html',
  'js/main.js',
  'js/b58.js',
  'css/main.css'
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
