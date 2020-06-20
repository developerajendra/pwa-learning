if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/serviceWorker.js')
    .then((register)=>{
        console.log('service worker registerd', register);
    }).catch(error=>{
        console.log('service worker not registerd',error);
    })
}