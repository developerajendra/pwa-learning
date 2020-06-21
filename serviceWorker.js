const staticCacheName = 'site-stattic-v4';
const dynamicCache = 'site-dynamic-v4';

const assets = [
    '/',
    '/index.html',
    '/js/app.js', 
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    'css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v52/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];


//cache size limit function
const limitCacheSize = (name, size) =>{
    caches.open(name).then(cache=>{
        cache.keys().then(keys=>{
            //deleting the cache if limit cross
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        });
    });
};

//service worker
self.addEventListener('install', event=>{
    console.log('service workeer installed', event);
    event.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            console.log('caching shell assets');
            
            cache.addAll(assets);
        })
    ); 
});


//Activeate event;
self.addEventListener('activate',event=>{
    console.log('service worker has been activeted');
    event.waitUntil(
        caches.keys().then(caheedId=>{
            return Promise.all(
                caheedId.map(cache=>{
                    if(cache!==staticCacheName && cache !== dynamicCache){
                       return caches.delete(cache) //deleting the existing cache storage
                    } 
                })
            )
            
        })
    )
});


//Fetch Event
self.addEventListener('fetch', event=>{
    // console.log('fetch event', event);
    if(event.request.url.indexOf('firestore.googleapis.com')<0){ //excluding firebase API'S
        event.respondWith(
            caches.match(event.request).then(cacheRes=>{
                // console.log('cached items', cacheRes;
                
                return cacheRes || fetch(event.request)
                .then(fetchRes=>{
                    return caches.open(dynamicCache)
                    .then(cache=>{
                        cache.put(event.request.url, fetchRes.clone())
                        limitCacheSize(dynamicCache, 15);
                        return fetchRes
                    })
                })
            }).catch(error=>{
                console.log('error', error);
                if(event.request.url.indexOf('.html')>-1){
                    return caches.match('/pages/fallback.html')
                }
                //
            })
        );
    }
}); 