// Service Worker for Web Push Notifications

self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...')
  event.waitUntil(clients.claim())
})

// Handle push notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Vexim Chat'
  const options = {
    body: data.body || 'Bạn có tin nhắn mới',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'vexim-notification',
    data: {
      url: data.url || '/admin/conversations',
      conversationId: data.conversationId,
    },
    actions: [
      {
        action: 'open',
        title: 'Xem ngay',
      },
      {
        action: 'close',
        title: 'Đóng',
      },
    ],
    requireInteraction: data.urgency === 'high',
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked')
  
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data.url || '/admin/conversations'
  const conversationId = event.notification.data.conversationId
  
  const fullUrl = conversationId 
    ? `${urlToOpen}?id=${conversationId}`
    : urlToOpen

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus().then(() => {
              client.postMessage({
                type: 'NOTIFICATION_CLICKED',
                url: fullUrl,
              })
            })
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(fullUrl)
        }
      })
  )
})

// Handle messages from the client
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
