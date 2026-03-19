import { useEffect, useState } from 'react'

/**
 * Detects the browser's network connectivity status.
 *
 * Uses `navigator.onLine` as the initial value and subscribes to the
 * `online` / `offline` window events to keep the value reactive.
 *
 * Important: `navigator.onLine` can return `true` even when the user has no
 * meaningful connectivity (e.g., connected to a LAN with no internet). For a
 * POS, this is good enough — what we care about is whether the device has
 * lost its WiFi/LAN connection entirely (tablet dropped from the network).
 *
 * @returns `true` when the browser believes it is offline.
 */
export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return isOffline
}
