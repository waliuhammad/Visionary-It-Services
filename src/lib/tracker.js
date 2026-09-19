// Anonymous storefront analytics: page views + "still here" heartbeats,
// shown live in the admin panel. No cookies, no personal data.
import { API_BASE } from './api'

const SID_KEY = 'vis_sid'
const HEARTBEAT_MS = 30_000
let memorySid = null

function sessionId() {
  try {
    let sid = sessionStorage.getItem(SID_KEY)
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem(SID_KEY, sid)
    }
    return sid
  } catch {
    memorySid ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
    return memorySid
  }
}

function send(endpoint, payload) {
  const body = JSON.stringify({ sid: sessionId(), ...payload })
  fetch(`${API_BASE}/track/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    keepalive: true,
    body,
  }).catch(() => {
    // Analytics must never affect the visitor
  })
}

export function trackPageView(path) {
  send('pageview', {
    path,
    title: document.title.slice(0, 200),
    referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
  })
}

/** Starts the heartbeat; returns a stop function. */
export function startHeartbeat() {
  const beat = () => {
    if (document.visibilityState === 'visible') {
      send('heartbeat', { path: window.location.pathname, title: document.title.slice(0, 200) })
    }
  }
  const timer = setInterval(beat, HEARTBEAT_MS)
  document.addEventListener('visibilitychange', beat)
  return () => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', beat)
  }
}
