import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Filler, Tooltip, Legend
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { DollarSign, ShoppingCart, Package, Users, Eye, Clock, Mail, Radio, ArrowRight } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import ActivityItem from '../../components/admin/ActivityItem'
import LiveIndicator from '../../components/admin/LiveIndicator'
import { useRealtime, useLiveRefresh } from '../../context/RealtimeContext'
import { api } from '../../lib/api'
import { formatMoney } from '../../lib/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend)

const dayLabel = (date) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })

export default function Overview() {
  const { stats: liveStats, activity, visitors } = useRealtime()
  const [fetchedStats, setFetchedStats] = useState(null)
  const [chartDataRaw, setChartDataRaw] = useState([])
  const [traffic, setTraffic] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadCharts = useCallback(async () => {
    const [chartRes, trafficRes] = await Promise.all([
      api.get('/admin/dashboard/chart?days=7'),
      api.get('/admin/analytics?days=7'),
    ])
    setChartDataRaw(chartRes.data || [])
    setTraffic(trafficRes.data || null)
  }, [])

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard/stats').then((r) => setFetchedStats(r.data)), loadCharts()])
      .catch((err) => console.error('Failed to load dashboard data', err))
      .finally(() => setLoading(false))
  }, [loadCharts])

  // Sales chart follows new/updated orders; traffic refreshes when visitors come and go
  useLiveRefresh(['orders'], loadCharts, 1500)
  useEffect(() => {
    const timer = setInterval(() => api.get('/admin/analytics?days=7').then((r) => setTraffic(r.data)).catch(() => {}), 60_000)
    return () => clearInterval(timer)
  }, [])

  const stats = liveStats || fetchedStats

  const salesChart = {
    labels: chartDataRaw.map((d) => dayLabel(d.date)),
    datasets: [
      {
        label: 'Revenue (Rs.)',
        data: chartDataRaw.map((d) => d.revenue),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.08)',
        fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#1890ff',
      },
      {
        label: 'Orders',
        data: chartDataRaw.map((d) => d.orders),
        borderColor: '#00aeef',
        backgroundColor: 'rgba(0, 174, 239, 0.08)',
        fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#00aeef',
        yAxisID: 'y1',
      },
    ],
  }

  const tooltip = {
    backgroundColor: '#001a3d',
    titleFont: { family: 'Inter', weight: '600' },
    bodyFont: { family: 'Inter' },
    padding: 12,
    cornerRadius: 12,
  }

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltip,
        callbacks: {
          label: (ctx) => (ctx.datasetIndex === 0 ? `Revenue: Rs. ${ctx.parsed.y.toLocaleString()}` : `Orders: ${ctx.parsed.y}`),
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      y: {
        position: 'left',
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { family: 'Inter', size: 11 }, callback: (v) => (v >= 1000 ? `Rs.${(v / 1000).toFixed(0)}k` : `Rs.${v}`) },
      },
      y1: { position: 'right', beginAtZero: true, grid: { display: false }, ticks: { precision: 0, font: { family: 'Inter', size: 11 } } },
    },
  }

  const trafficChart = {
    labels: (traffic?.daily || []).map((d) => dayLabel(d.date)),
    datasets: [
      { label: 'Page views', data: (traffic?.daily || []).map((d) => d.pageViews), backgroundColor: '#14b8a6', borderRadius: 6 },
      { label: 'Visitors', data: (traffic?.daily || []).map((d) => d.visitors), backgroundColor: '#99f6e4', borderRadius: 6 },
    ],
  }

  const trafficOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { precision: 0, font: { family: 'Inter', size: 11 } } },
    },
  }

  if (loading && !stats) {
    return (
      <div>
        <PageHeader firstWord="Store" secondWord="Insights" accentColor="text-blue-500" subtitle="Your command center for everything Visionary IT" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
              <div className="w-11 h-11 rounded-2xl bg-neutral-100 mb-4" />
              <div className="h-3 w-20 bg-neutral-100 rounded mb-2" />
              <div className="h-7 w-24 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        firstWord="Store"
        secondWord="Insights"
        accentColor="text-blue-500"
        subtitle="Your command center for everything Visionary IT"
      >
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
            <Radio className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">On site now</p>
            <p className="text-lg font-display font-bold text-neutral-900">{stats?.liveVisitors ?? visitors.length}</p>
          </div>
          <div className="pl-4 border-l border-neutral-100">
            <LiveIndicator />
          </div>
        </div>
      </PageHeader>

      {/* Primary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <StatCard
          icon={DollarSign} iconBg="bg-emerald-100" iconColor="text-emerald-500"
          label="Revenue (paid)" value={formatMoney(stats?.revenue)}
          badge="LIVE" badgeColor="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={ShoppingCart} iconBg="bg-violet-100" iconColor="text-violet-500"
          label="Orders" value={stats?.orderCount || 0}
          badge={stats?.todayOrders ? `+${stats.todayOrders} TODAY` : null} badgeColor="bg-violet-100 text-violet-600"
        />
        <StatCard
          icon={Package} iconBg="bg-orange-100" iconColor="text-orange-500"
          label="Products" value={stats?.productCount || 0}
          badge={`${stats?.stockLevel || 0}% IN STOCK`} badgeColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Users} iconBg="bg-pink-100" iconColor="text-pink-500"
          label="Registered Users" value={stats?.userCount || 0}
        />
      </div>

      {/* Needs attention */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { to: '/admin/orders', icon: Clock, label: 'Pending orders', value: stats?.pendingOrders || 0, cls: 'text-amber-600 bg-amber-50' },
          { to: '/admin/messages', icon: Mail, label: 'Unread messages', value: stats?.unreadMessages || 0, cls: 'text-pink-600 bg-pink-50' },
          { to: '/admin/activity', icon: Eye, label: 'Page views (7 days)', value: traffic?.totals?.pageViews || 0, cls: 'text-teal-600 bg-teal-50' },
        ].map(({ to, icon: Icon, label, value, cls }) => (
          <Link key={to} to={to} className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">{label}</p>
              <p className="text-xl font-display font-bold text-neutral-900">{value.toLocaleString()}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-neutral-900">Last 7 Days Sales</h3>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1890ff]" />
                <span className="text-xs text-neutral-500 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00aeef]" />
                <span className="text-xs text-neutral-500 font-medium">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <Line data={salesChart} options={salesOptions} />
          </div>
        </div>

        {/* Live activity feed */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-neutral-900">Live Activity</h3>
            <Link to="/admin/activity" className="text-xs font-bold text-teal-600 hover:underline">View all</Link>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-neutral-400 py-10 text-center">Waiting for activity…</p>
          ) : (
            <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[300px] -mr-2 pr-2">
              {activity.slice(0, 12).map((entry) => <ActivityItem key={entry.id} entry={entry} compact />)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-neutral-900">Website Traffic</h3>
            <div className="flex items-center gap-5">
              <span className="text-xs text-neutral-500 font-medium">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500 mr-1.5" />Page views ({traffic?.totals?.pageViews || 0})
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-200 mr-1.5" />Visitors ({traffic?.totals?.visitors || 0})
              </span>
            </div>
          </div>
          <div className="h-[240px]">
            <Bar data={trafficChart} options={trafficOptions} />
          </div>
        </div>

        {/* Top pages + store summary */}
        <div className="bg-[#001a3d] rounded-3xl p-6 text-white">
          <h3 className="font-display font-bold text-lg mb-4">Top Pages (7 days)</h3>
          {traffic?.topPages?.length ? (
            <ul className="space-y-2 mb-6">
              {traffic.topPages.slice(0, 6).map((p) => (
                <li key={p.key} className="flex justify-between gap-3 text-sm">
                  <span className="text-neutral-300 truncate" title={p.key}>{p.key}</span>
                  <span className="font-bold text-cyan-300">{p.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400 mb-6">No page views recorded yet.</p>
          )}
          <div className="space-y-3 border-t border-white/10 pt-4">
            {[
              { label: "Today's revenue", value: formatMoney(stats?.todayRevenue), color: 'text-emerald-400' },
              { label: 'Out of stock', value: stats?.outOfStock || 0, color: 'text-orange-400' },
              { label: 'Newsletter subscribers', value: stats?.subscribers || 0, color: 'text-pink-400' },
              { label: 'Admins online', value: stats?.adminsOnline || 0, color: 'text-cyan-400' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-neutral-400">{row.label}</span>
                <span className={`font-display font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
