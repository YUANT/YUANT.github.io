// Service Worker用JS
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  workbox.routing.registerRoute(
    '/service_worker/index.html',
    workbox.strategies.staleWhileRevalidate()
  );
  
  workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    workbox.strategies.staleWhileRevalidate()
  );
  
  
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

