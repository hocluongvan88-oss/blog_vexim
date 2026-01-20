"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function usePushNotification() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    // Check if browser supports service workers and push notifications
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      setSubscription(existingSubscription)
    } catch (error) {
      console.error("[v0] Error checking subscription:", error)
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const registerServiceWorker = async () => {
    if (!isSupported) {
      throw new Error("Push notifications are not supported")
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("[v0] Service Worker registered:", registration)

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready
      
      return registration
    } catch (error) {
      console.error("[v0] Service Worker registration failed:", error)
      throw error
    }
  }

  const subscribeToPush = async () => {
    if (!isSupported) {
      throw new Error("Push notifications are not supported")
    }

    setIsRegistering(true)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission !== "granted") {
        throw new Error("Notification permission denied")
      }

      // Register service worker
      const registration = await registerServiceWorker()

      // Get VAPID public key from environment or use a default
      // In production, you should generate your own VAPID keys
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
        "BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xYjNBM-S2K2S5c3V5hAJ5SKH0FS8EIpqG7EX3nN7mZ5fF9jLg3hWo"

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      console.log("[v0] Push subscription:", subscription)
      setSubscription(subscription)

      // Save subscription to database
      await saveSubscriptionToDatabase(subscription)

      return subscription
    } catch (error) {
      console.error("[v0] Error subscribing to push:", error)
      throw error
    } finally {
      setIsRegistering(false)
    }
  }

  const saveSubscriptionToDatabase = async (subscription: PushSubscription) => {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Save subscription to database
      const { error } = await supabase
        .from("push_subscriptions")
        .upsert({
          user_id: user.id,
          subscription: subscription.toJSON(),
          endpoint: subscription.endpoint,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        })

      if (error) throw error

      console.log("[v0] Subscription saved to database")
    } catch (error) {
      console.error("[v0] Error saving subscription:", error)
      throw error
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe()
        
        // Remove from database
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("user_id", user.id)
        }
        
        setSubscription(null)
        console.log("[v0] Unsubscribed from push notifications")
      }
    } catch (error) {
      console.error("[v0] Error unsubscribing:", error)
      throw error
    }
  }

  const testNotification = () => {
    if (permission === "granted") {
      new Notification("Vexim Chat", {
        body: "Đây là thông báo test từ hệ thống",
        icon: "/icon-192.png",
        tag: "test-notification",
      })
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    isRegistering,
    isSubscribed: subscription !== null,
    subscribeToPush,
    unsubscribeFromPush,
    testNotification,
  }
}
