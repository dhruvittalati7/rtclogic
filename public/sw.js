self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('message', event => {
  if (event.data) {
    showNotification(event)
  }
})

let notificationUrl
function showNotification(event) {
  const data = event.data
  notificationUrl = data.url
  event.waitUntil(self.registration.showNotification(data.title, data.options))
}

//notification url redirect event click
self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function(clientList) {
        if (clients.openWindow) {
          return clients.openWindow(notificationUrl)
        }
      })
  )
})
