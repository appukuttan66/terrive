self.addEventListener("install",function(installEvent){
  installEvent.waitUntil(
    caches.open("sw-cache").then(function(cache){
      return cache.add('index.html');
      return cache.add('auth.html');
    })
  );
});

self.addEventListener("fetch",function(fetchEvent){
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(function(r){
      return r || fetch(fetchEvent.request);
    })
  );
});
