// Firebase Cloud Messaging Background Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js')

// Initialize Firebase compat app inside service worker
firebase.initializeApp({
  apiKey: "AIzaSyCyTqYsNppNJ7ZqLz4eDFOxL-3An-n086M",
  authDomain: "markline-2692c.firebaseapp.com",
  projectId: "markline-2692c",
  storageBucket: "markline-2692c.firebasestorage.app",
  messagingSenderId: "712790076110",
  appId: "1:712790076110:web:1ecee178d291950305fe9f"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'Markline'
  const notificationOptions = {
    body: payload.notification?.body || payload.notification?.message || '',
    icon: payload.notification?.imageUrl || payload.notification?.image || '/favico.ico.ico',
    badge: '/favico.ico.ico',
    data: payload.data || {}
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Listen to notification click events to route users
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const clickAction = event.notification.data?.click_action || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If a window is already open, focus it and navigate
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === clickAction && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});
