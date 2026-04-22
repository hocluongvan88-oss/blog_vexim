'use client'

import { useEffect } from 'react'

export function ZaloWidget() {
  useEffect(() => {
    // Load Zalo SDK
    const script = document.createElement('script')
    script.src = 'https://sp.zalo.me/plugins/sdk.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div 
      className="zalo-chat-widget" 
      data-oaid="2933050463560569889" 
      data-welcome-message="Xin chào anh chị. Em có thể giúp được gì cho anh chị ạ!" 
      data-autopopup="2" 
      data-width="300" 
      data-height="500"
    />
  )
}
