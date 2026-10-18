// TKGM Uygulamalar — önce ağ, olmazsa önbellek.
// Her açılışta GitHub'daki son sürüm yüklenir; internet yoksa en son görülen sürüm açılır.
const CACHE = 'tkgm-uygulamalar-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
    e.respondWith(
        fetch(req, { cache: 'no-cache' })
            .then((res) => {
                if (res.ok) {
                    const kopya = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, kopya));
                }
                return res;
            })
            .catch(() => caches.match(req))
    );
});
