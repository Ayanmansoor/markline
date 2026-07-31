import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App if configured
let app: any;
try {
  if (firebaseConfig.apiKey) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
} catch (err) {
  console.error("[Firebase App Client] Initialization error:", err);
}

/**
 * Initialize Client Firebase Messaging
 */
export function getFirebaseMessaging(): Messaging | null {
  if (!app) return null;
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      return getMessaging(app);
    } catch (err: any) {
      console.warn("[Firebase Client] Messaging initialization warning:", err.message);
      return null;
    }
  }
  return null;
}

/**
 * Request notification permission and return FCM registration token
 */
export async function requestFcmToken(vapidKey?: string): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FCM Permission] Notification permission denied by user");
      return null;
    }

    const messaging = getFirebaseMessaging();
    if (!messaging) {
      console.warn("[FCM Client] Messaging not initialized. Check Firebase env keys.");
      return null;
    }

    // Register custom service worker to handle background notifications
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: vapidKey || "BFXzVlHn5g72rE6eDqXk-3P65kZ6rKxXw-R96x6jZ38" // Default Web Push VAPID Key (or custom)
    });

    if (token) {
      console.log("[FCM Client] FCM Token retrieved successfully:", token);
      return token;
    }
  } catch (err: any) {
    console.error("[FCM Client] Error getting FCM Token:", err.message);
  }

  return null;
}

/**
 * Listen for foreground FCM push messages
 */
export function onForegroundFcmMessage(callback: (payload: any) => void) {
  const messaging = getFirebaseMessaging();
  if (messaging) {
    return onMessage(messaging, (payload) => {
      console.log("[FCM Foreground Message] Received:", payload);
      callback(payload);
    });
  }
  return () => {};
}
