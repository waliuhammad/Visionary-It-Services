import { useCallback, useEffect, useState } from 'react'
import { Globe, Monitor, Smartphone, Tablet } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import PillButton from '../../components/admin/PillButton'
import ActivityItem from '../../components/admin/ActivityItem'
import LiveIndicator from '../../components/admin/LiveIndicator'
import { useRealtime } from '../../context/RealtimeContext'
import { api } from '../../lib/api'
import { duration, timeAgo } from '../../lib/format'

const FILTERS = [
  { key: '', label: 'Everything' },
  { key: 'order', label: 'Orders' },
  { key: 'product', label: 'Products' },
  { key: 'user', label: 'Users & logins' },
  { key: 'message', label: 'Messages' },
  { key: 'category', label: 'Categories' },
  { key: 'settings', label: 'Settings' },
  { key: 'upload', label: 'Uploads' },
  { key: 'subscriber', label: 'Newsletter' },
]

const DEVICE_ICON = { mobile: Smartphone, tablet: Tablet, desktop: Monitor }
const PAGE_SIZE = 40

export default function Activity() {
  const { activity: liveActivity, visitors, subscribe } = useRealtime()
  const [filter, setFilter] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [, setTick] = useState(0)

  const load = useCallback(async (before) => {
    const params = new URLSearchParams({ limit: PAGE_SIZE })
    if (filter) params.set('entity', filter)
    if (before) params.set('before', before)
    const res = await api.get(`/admin/activity?${params}`)
    const page = res.data || []
    setItems((prev) => (before ? [...prev, ...page] : page))
    setHasMore(page.length === PAGE_SIZE)
  }, [filter])

  useEffect(() => {
    setLoading(true)
    load().catch((err) => console.error('Failed to load activity', err)).finally(() => setLoading(false))
  }, [load])

  // Prepend new entries as they happen
  useEffect(() => subscribe((event) => {
    if (event.type !== 'activity') return
    if (filter && event.entry.entity !== filter) return
    setItems((prev) => (prev.some((i) => i.id === event.entry.id) ? prev : [event.entry, ...prev]))
  }), [subscribe, filter])

  // Keep relative times ("2m ago") and visit durations fresh
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15_000)
    return () => clearInterval(timer)
  }, [])

  const shown = loading && !items.length ? liveActivity.filter((a) => !filter || a.entity === filter) : items

  return (
    <div>
      <PageHeader
        firstWord="Live" secondWord="Activity" accentColor="text-teal-500"
        subtitle="Everything happening on your store, as it happens"
      >
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm">
          <LiveIndicator />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity log */}
        <section className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  filter === f.key ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && !shown.length ? (
            <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-neutral-50 rounded-xl animate-pulse" />)}</div>
          ) : shown.length === 0 ? (
            <p className="py-12 text-center text-neutral-400">No activity recorded yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {shown.map((entry) => <ActivityItem key={entry.id} entry={entry} />)}
            </div>
          )}

          {hasMore && (
            <div className="pt-4 text-center">
              <PillButton label="Load older activity" variant="secondary" onClick={() => load(items[items.length - 1]?.createdAt)} />
            </div>
          )}
        </section>

        {/* Live visitors */}
        <section className="bg-white rounded-3xl p-6 shadow-sm h-fit xl:sticky xl:top-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-neutral-900">On the site now</h3>
            <span className="text-2xl font-display font-bold text-teal-600">{visitors.length}</span>
          </div>
          {visitors.length === 0 ? (
            <p className="text-sm text-neutral-400 py-6 text-center">No visitors right now.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {visitors.map((v) => {
                const Icon = DEVICE_ICON[v.device] || Globe
                return (
                  <li key={v.id} className="py-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-800 truncate" title={v.path}>{v.path}</p>
                      <p className="text-[11px] text-neutral-400">
                        {v.pageViews} page{v.pageViews === 1 ? '' : 's'} · on site {duration(v.startedAt)}
                        {v.referrer && ` · from ${v.referrer}`}
                      </p>
                      <p className="text-[11px] text-neutral-300">active {timeAgo(v.lastSeen)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
