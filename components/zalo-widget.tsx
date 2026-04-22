'use client'

import { useEffect } from 'react'

export function ZaloWidget() {
  useEffect(() => {
    // Check if Zalo SDK is already loaded
    console.log('[v0] Zalo SDK check:', window.ZaloSDK ? 'already loaded' : 'not loaded')
    if (!window.ZaloSDK) {
      const script = document.createElement('script')
      script.src = 'https://sp.zalo.me/plugins/sdk.js'
      script.async = true
      script.onload = () => {
        console.log('[v0] Zalo SDK loaded, reloading widgets')
        // Reload Zalo SDK after script loads
        if (window.ZaloSDK) {
          window.ZaloSDK.reload()
        }
      }
      document.body.appendChild(script)
    } else {
      // SDK already loaded, reload it
      console.log('[v0] Zalo SDK already exists, reloading')
      window.ZaloSDK.reload()
    }
  }, [])

  return (
    <div 
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 50,
      }}
    >
      <div 
        className="zalo-chat-widget" 
        data-oaid="2933050463560569889" 
        data-welcome-message="Xin chào anh chị. Em có thể giúp được gì cho anh chị ạ!" 
        data-autopopup="2" 
        data-width="300" 
        data-height="500"
      />
    </div>
  )
}
