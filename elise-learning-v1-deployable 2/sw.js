const C="elise-v2-6-20261006-fix1";
const ASSETS=["./","index.html","app.js","v23.js","v24.js","v25.js","v26.js","manifest.webmanifest"];
self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)));
});
self.addEventListener("activate",e=>{
  e.waitUntil(Promise.all([
    clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k))))
  ]));
});
self.addEventListener("fetch",e=>{
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{
      const copy=r.clone();caches.open(C).then(c=>c.put("index.html",copy));return r;
    }).catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{
    const copy=r.clone();caches.open(C).then(c=>c.put(e.request,copy));return r;
  }).catch(()=>caches.match(e.request)));
});