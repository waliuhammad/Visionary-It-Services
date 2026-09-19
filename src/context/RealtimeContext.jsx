import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { API_BASE } from '../lib/api'

/**
 * Live connection to the API's admin stream (Server-Sent Events).
 * Provides dashboard stats, live visitors and the activity feed, and lets pages
 * refresh themselves when the data they show changes anywhere.
 */
const RealtimeContext = createContext(null)

const RECONNECT_DELAY_MS = 5000
const MAX_ACTIVITY = 60

// Activity worth a pop-up notification when someone else caused it
const NOTIFY = {
  'order.created': 'New order',
  'contact.received': 'New message',
  'user.registered': 'New customer',
  'newsletter.subscribed': 'New subscriber',
}

export function RealtimeProvider({ userUid, children }) {
  const [status, setStatus] = useState('connecting') // connecting | live | offline
  const [stats, setStats] = useState(null)
  const [visitors, setVisitors] = useState([])
  const [activity, setActivity] = useState([])
  const [toasts, setToasts] = useState([])
  const listeners = useRef(new Set())
  const [attempt, setAttempt] = useState(0)

  const emit = useCallback((event) => {
    listeners.current.forEach((fn) => fn(event))
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const source = new EventSource(`${API_BASE}/admin/stream`, { withCredentials: true })
    let retryTimer

    source.onopen = () => setStatus('live')
    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) {
        // e.g. session expired or API down: retry later with a fresh request
        setStatus('offline')
        retryTimer = setTimeout(() => setAttempt((n) => n + 1), RECONNECT_DELAY_MS)
      } else {
        setStatus('connecting')
      }
    }

    const on = (name, handler) =>
      source.addEventListener(name, (e) => {
        try { handler(JSON.parse(e.data)) } catch { /* ignore malformed event */ }
      })

    on('snapshot', (data) => {
      setStatus('live')
      setStats(data.stats)
      setVisitors(data.visitors || [])
      setActivity(data.activity || [])
      emit({ type: 'resync' })
    })
    on('stats', setStats)
    on('visitors', setVisitors)
    on('change', (change) => emit({ type: 'change', ...change }))
    on('activity', (entry) => {
      setActivity((prev) => [entry, ...prev.filter((a) => a.id !== entry.id)].slice(0, MAX_ACTIVITY))
      emit({ type: 'activity', entry })
      if (NOTIFY[entry.action] && entry.actor?.uid !== userUid) {
        const toast = { id: entry.id, title: NOTIFY[entry.action], body: entry.summary }
        setToasts((prev) => [...prev.slice(-3), toast])
        setTimeout(() => dismissToast(toast.id), 6000)
      }
    })

    return () => {
      clearTimeout(retryTimer)
      source.close()
    }
  }, [attempt, emit, userUid, dismissToast])

  const subscribe = useCallback((fn) => {
    listeners.current.add(fn)
    return () => listeners.current.delete(fn)
  }, [])

  return (
    <RealtimeContext.Provider value={{ status, stats, visitors, activity, toasts, dismissToast, subscribe }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext)
  if (!ctx) throw new Error('useRealtime must be used inside <RealtimeProvider>')
  return ctx
}

/**
 * Re-run `reload` (debounced) whenever any of the given collections changes,
 * e.g. useLiveRefresh(['orders'], loadOrders).
 */
export function useLiveRefresh(collections, reload, delay = 400) {
  const { subscribe } = useRealtime()
  const reloadRef = useRef(reload)
  useEffect(() => {
    reloadRef.current = reload
  })
  const key = collections.join(',')

  useEffect(() => {
    const watched = new Set(key.split(','))
    let timer
    const unsubscribe = subscribe((event) => {
      const relevant = event.type === 'resync' || (event.type === 'change' && watched.has(event.collection))
      if (!relevant) return
      clearTimeout(timer)
      timer = setTimeout(() => reloadRef.current(), delay)
    })
    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [key, subscribe, delay])
}
