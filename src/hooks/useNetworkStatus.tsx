import { useEffect, useState } from 'react'

function useNetworkStatus() {
  const [status, setStatus] = useState<'online' | 'offline'>(navigator.onLine ? 'online' : 'offline')
  const [wasOffline, setWasOffline] = useState(false)

  function updateConnectionStatus(e: any) {
    const status = e.type
    setStatus(status)
    if (status === 'offline') {
      setWasOffline(true)
    }
  }
  useEffect(() => {
    window.addEventListener('offline', updateConnectionStatus)
    window.addEventListener('online', updateConnectionStatus)
    return () => {
      window.removeEventListener('offline', updateConnectionStatus)
      window.removeEventListener('online', updateConnectionStatus)
    }
  })

  return { status, wasOffline }
}

export { useNetworkStatus }
