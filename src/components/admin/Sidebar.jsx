import { NavLink, useLocation } from 'react-router-dom'
import {
  Monitor, LayoutDashboard, Package, FolderOpen, ShoppingCart,
  Receipt, Settings, Mail, Users, ChevronRight, LogOut, ExternalLink, Activity
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { api } from '../../lib/api'
import { auth } from '../../lib/firebase'
import { useRealtime } from '../../context/RealtimeContext'
import LiveIndicator from './LiveIndicator'

const navItems = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Overview',       accent: 'bg-blue-100 text-blue-600' },
  { to: '/admin/activity',     icon: Activity,        label: 'Live Activity',  accent: 'bg-teal-100 text-teal-600' },
  { to: '/admin/products',     icon: Package,         label: 'Products',       accent: 'bg-emerald-100 text-emerald-600' },
  { to: '/admin/categories',   icon: FolderOpen,      label: 'Categories',     accent: 'bg-orange-100 text-orange-600' },
  { to: '/admin/orders',       icon: ShoppingCart,     label: 'Orders',         accent: 'bg-violet-100 text-violet-600' },
  { to: '/admin/transactions', icon: Receipt,         label: 'Transactions',   accent: 'bg-cyan-100 text-cyan-600' },
  { to: '/admin/settings',     icon: Settings,        label: 'Settings',       accent: 'bg-slate-200 text-slate-600' },
  { to: '/admin/messages',     icon: Mail,            label: 'Messages',       accent: 'bg-pink-100 text-pink-600' },
  { to: '/admin/team',         icon: Users,           label: 'Team & Roles',   accent: 'bg-amber-100 text-amber-600' },
]

export default function Sidebar() {
  const location = useLocation()
  const { stats } = useRealtime()
  const badges = {
    '/admin/orders': stats?.pendingOrders,
    '/admin/messages': stats?.unreadMessages,
    '/admin/activity': stats?.liveVisitors,
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      await signOut(auth)
    } catch {
      // Even if the API call fails, redirect
    }
    window.location.href = '/login'
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-neutral-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="bg-[#1890ff] p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Monitor className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">
            <span className="text-neutral-900">Visionary</span>
            <span className="text-white bg-[#1890ff] px-1.5 py-0.5 rounded-md mx-0.5 text-sm">IT</span>
          </span>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 ml-[52px]">
          Command Center • V1.0
        </p>
        <div className="ml-[52px] mt-2">
          <LiveIndicator />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(({ to, icon: Icon, label, accent }) => {
            const isExact = to === '/admin'
            const isActive = isExact
              ? location.pathname === '/admin'
              : location.pathname.startsWith(to)

            return (
              <NavLink
                key={to}
                to={to}
                end={isExact}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? accent
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="flex-1">{label}</span>
                {badges[to] > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {badges[to]}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Divider + Utility Links */}
        <div className="border-t border-neutral-100 mt-4 pt-4 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all"
          >
            <ChevronRight className="w-[18px] h-[18px]" strokeWidth={1.8} />
            <span>Back to Store</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
            <span>Terminal Exit</span>
          </button>
        </div>
      </nav>

      {/* Footer Credit */}
      <div className="px-7 py-4 border-t border-neutral-50">
        <a
          href="https://visionaryitservice.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-neutral-500 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Powered by Visionary IT Services</span>
        </a>
      </div>
    </aside>
  )
}
