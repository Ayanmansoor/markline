"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { requestFcmToken, onForegroundFcmMessage } from "@/lib/firebase/client";

export default function FcmNotificationHandler() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Helper function to register token with our API
    const registerToken = async (token: string, userId?: string | null) => {
      try {
        const savedToken = localStorage.getItem("markline_fcm_token");
        const savedUserId = localStorage.getItem("markline_fcm_user_id");

        // Skip if already registered for the same token and user ID to avoid redundant API hits
        if (savedToken === token && savedUserId === (userId || "guest")) {
          console.log("[FCM Client] Token already registered for this session");
          return;
        }

        const res = await fetch("/api/fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fcm_token: token,
            user_id: userId || null,
            device_type: "web"
          })
        });

        if (res.ok) {
          localStorage.setItem("markline_fcm_token", token);
          localStorage.setItem("markline_fcm_user_id", userId || "guest");
          console.log("[FCM Client] Token registered successfully on backend");
        } else {
          const errData = await res.json();
          console.warn("[FCM Client] Backend registration failed:", errData.error);
        }
      } catch (err) {
        console.error("[FCM Client] Error registering token on backend:", err);
      }
    };

    // Helper to request and register token
    const setupNotifications = async (userId?: string | null) => {
      try {
        // Request token
        const token = await requestFcmToken();
        if (token) {
          await registerToken(token, userId);
        }
      } catch (err) {
        console.error("[FCM Client] Failed to set up FCM:", err);
      }
    };

    // 1. Initial setup for guest or currently logged-in user
    mysupabase.auth.getUser().then(({ data }) => {
      const uId = data.user?.id || null;
      setupNotifications(uId);
    });

    // 2. Listen to authentication state changes (sync token registry with user account)
    const { data: authListener } = mysupabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[FCM Client] Auth State Changed:", event);
      
      const currentToken = localStorage.getItem("markline_fcm_token");
      const currentUserId = session?.user?.id || null;

      if (event === "SIGNED_IN" && session?.user) {
        // User logged in, register token with user_id
        if (currentToken) {
          await registerToken(currentToken, currentUserId);
        } else {
          await setupNotifications(currentUserId);
        }
      } else if (event === "SIGNED_OUT") {
        // User logged out
        const savedToken = localStorage.getItem("markline_fcm_token");
        if (savedToken) {
          try {
            // Decouple user_id on backend by unregistering / cleaning token
            await fetch("/api/fcm-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fcm_token: savedToken,
                action: "unregister"
              })
            });
          } catch (e) {
            console.error("[FCM Client] Error cleaning up token on logout:", e);
          }
        }
        localStorage.removeItem("markline_fcm_token");
        localStorage.removeItem("markline_fcm_user_id");
        
        // Re-register as guest
        setTimeout(() => setupNotifications(null), 1000);
      }
    });

    // 3. Listen to foreground FCM messages
    const unsubscribeForeground = onForegroundFcmMessage((payload) => {
      console.log("[FCM Foreground Message] Received:", payload);
      
      const title = payload.notification?.title || "New Notification";
      const message = payload.notification?.body || payload.notification?.message || "";
      const clickAction = payload.data?.click_action || "/";
      const image = payload.notification?.imageUrl || payload.notification?.image;

      // Show toast alert
      toast(title, {
        description: message,
        duration: 8000,
        position: "top-right",
        action: clickAction ? {
          label: "View",
          onClick: () => {
            window.location.href = clickAction;
          }
        } : undefined
      });
    });

    // Cleanup on unmount
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
    };
  }, []);

  return null; // This component handles side effects and has no UI of its own
}
