"use client"

import { useState, useEffect } from "react"

interface UsePushNotificationReturn {
  isSupported: boolean
  permission: NotificationPermission
  isSubscribed: boolean
  isRegistering: boolean
  subscribeToPush: () => Promise<void>
  unsubscribeFromPush: () => Promise<void>
  testNotification: () => void
}

export function usePushNotification(): UsePushNotificationReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    // Check if browser supports notifications
    if ("Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Check if already subscribed
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("[v0] Error checking subscription:", error)
    }
  }

  const subscribeToPush = async () => {
    if (!isSupported) {
      throw new Error("Push notifications not supported")
    }

    setIsRegistering(true)

    try {
      // Request permission
      const permissionResult = await Notification.requestPermission()
      setPermission(permissionResult)

      if (permissionResult !== "granted") {
        throw new Error("Permission not granted")
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Subscribe to push notifications
      // Note: In production, you would use your VAPID public key here
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        ),
      })

      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      setIsSubscribed(true)
    } catch (error) {
      console.error("[v0] Error subscribing to push:", error)
      throw error
    } finally {
      setIsRegistering(false)
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        
        // Notify server
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
      }

      setIsSubscribed(false)
    } catch (error) {
      console.error("[v0] Error unsubscribing from push:", error)
      throw error
    }
  }

  const testNotification = () => {
    if (permission === "granted") {
      new Notification("Thông báo test", {
        body: "Đây là thông báo push test từ VEXIM GLOBAL",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        tag: "test-notification",
      })
    }
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    isRegistering,
    subscribeToPush,
    unsubscribeFromPush,
    testNotification,
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
