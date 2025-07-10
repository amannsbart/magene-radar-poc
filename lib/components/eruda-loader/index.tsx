// components/eruda-loader.tsx
'use client'

import { useEffect } from 'react'

// components/eruda-loader.tsx

export function ErudaLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    if (!isMobile) return

    // Dynamically load eruda script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.async = true
    script.onload = () => {
      // @ts-expect-error no types provided
      eruda.init()
    }
    document.body.appendChild(script)

    // Cleanup on unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      // @ts-expect-error no types provided
      if (window.eruda) {
        // @ts-expect-error no types provided
        eruda.destroy()
      }
    }
  }, [])

  return null
}
