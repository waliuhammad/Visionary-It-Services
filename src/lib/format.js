export const formatMoney = (value, currency = 'Rs.') => `${currency} ${Number(value || 0).toLocaleString()}`

export function timeAgo(iso) {
  if (!iso) return ''
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function duration(fromIso) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(fromIso).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
