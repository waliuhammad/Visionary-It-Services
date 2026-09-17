import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import { useAdminAuth } from '../hooks/useAdminAuth'

export default function AdminLayout() {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-[#1890ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">Verifying admin access…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Sidebar />
      <main className="ml-[280px] p-8 pt-10 min-h-screen">
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}
