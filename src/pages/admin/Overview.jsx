import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import { api } from '../../lib/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function Overview() {
  const { user } = useOutletContext()
  const [stats, setStats] = useState(null)
  const [chartDataRaw, setChartDataRaw] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/dashboard/chart?days=7'),
        ])
        setStats(statsRes.data || null)
        setChartDataRaw(chartRes.data || [])
      } catch {
        console.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Chart data
  const chartData = {
    labels: chartDataRaw.map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Revenue (Rs.)',
        data: chartDataRaw.map(d => d.revenue),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#1890ff',
      },
      {
        label: 'Orders',
        data: chartDataRaw.map(d => d.orders),
        borderColor: '#00aeef',
        backgroundColor: 'rgba(0, 174, 239, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#00aeef',
        yAxisID: 'y1',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#001a3d',
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => {
            if (ctx.datasetIndex === 0) return `Revenue: Rs. ${ctx.parsed.y.toLocaleString()}`
            return `Orders: ${ctx.parsed.y}`
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      y: {
        position: 'left',
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { family: 'Inter', size: 11 }, callback: v => `Rs.${(v/1000).toFixed(0)}k` }
      },
      y1: {
        position: 'right',
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } }
      },
    },
  }

  if (loading) {
    return (
      <div>
        <PageHeader firstWord="Store" secondWord="Insights" accentColor="text-blue-500" subtitle="Your command center for everything Visionary IT" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1,2,3,4].map(i => (
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
        {/* Top-right floating stat card */}
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Total Orders</p>
            <p className="text-lg font-display font-bold text-neutral-900">{stats?.orderCount || 0}</p>
          </div>
        </div>
      </PageHeader>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={DollarSign}
          iconBg="bg-emerald-100" iconColor="text-emerald-500"
          label="Revenue" value={`Rs. ${(stats?.revenue || 0).toLocaleString()}`}
          badge="LIVE" badgeColor="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={ShoppingCart}
          iconBg="bg-violet-100" iconColor="text-violet-500"
          label="Orders" value={stats?.orderCount || 0}
        />
        <StatCard
          icon={Package}
          iconBg="bg-orange-100" iconColor="text-orange-500"
          label="Products" value={stats?.productCount || 0}
          badge={`${stats?.stockLevel || 0}% IN STOCK`}
          badgeColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Users}
          iconBg="bg-pink-100" iconColor="text-pink-500"
          label="Registered Users" value={stats?.userCount || 0}
        />
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <Line data={chartData} options={chartOptions} />
          </div>
          <p className="text-[10px] text-neutral-400 mt-3 italic">
            Live chart data from GET /admin/dashboard/chart
          </p>
        </div>

        {/* Store Summary Dark Panel */}
        <div className="bg-[#001a3d] rounded-3xl p-6 text-white">
          <h3 className="font-display font-bold text-lg mb-6">Store Summary</h3>
          <div className="space-y-5">
            {[
              { label: 'Total Revenue',    value: `Rs. ${(stats?.revenue || 0).toLocaleString()}`, color: 'text-emerald-400' },
              { label: 'Total Orders',     value: stats?.orderCount || 0,  color: 'text-violet-400' },
              { label: 'Total Products',   value: stats?.productCount || 0, color: 'text-orange-400' },
              { label: 'Registered Users', value: stats?.userCount || 0,   color: 'text-pink-400' },
              { label: 'Stock Level',      value: `${stats?.stockLevel || 0}%`, color: 'text-cyan-400' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                <span className="text-neutral-400 text-sm">{row.label}</span>
                <span className={`font-display font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
