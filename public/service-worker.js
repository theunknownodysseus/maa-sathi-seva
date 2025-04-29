// Service Worker for offline capabilities
const CACHE_NAME = 'maa-sathi-seva-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - respond with cached resources or fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached response if found
      if (response) {
        return response;
      }
      
      // Otherwise try to fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Don't cache responses that aren't successful or aren't GET requests
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' || event.request.method !== 'GET') {
            return networkResponse;
          }
          
          // Clone the response as it's a stream and can only be consumed once
          const responseToCache = networkResponse.clone();
          
          // Open the cache and store the new response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        })
        .catch(() => {
          // If both cache and network fail, return a fallback
          if (event.request.url.indexOf('/api/') !== -1) {
            // For API requests that fail, return an empty JSON response
            return new Response(JSON.stringify({ error: 'You are offline and this data is not cached.' }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        });
    })
  );
});

// Handle background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-health-data') {
    event.waitUntil(syncHealthData());
  }
});

// Function to sync health data
async function syncHealthData() {
  try {
    // Get data from IndexedDB
    // This would need to be implemented with actual IndexedDB code
    console.log('Syncing health data from background');
    // Perform the sync operation
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
