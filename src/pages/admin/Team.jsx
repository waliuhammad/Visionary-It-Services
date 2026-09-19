import { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Shield, ShieldAlert, Trash2 } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import { api, errorMessage } from '../../lib/api'
import { useLiveRefresh } from '../../context/RealtimeContext'

export default function Team() {
  const { user: currentUser } = useOutletContext()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data || [])
    } catch (err) {
      console.error('Failed to load users', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useLiveRefresh(["users"], load)

  const handleRoleChange = async (uid, newRole) => {
    try {
      await api.post('/auth/role', { uid, role: newRole })
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const handleDelete = async (uid) => {
    if (!window.confirm('Permanently delete this user? This action cannot be undone.')) return
    try {
      await api.del(`/users/${uid}`)
      setUsers(prev => prev.filter(u => u.uid !== uid))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        firstWord="Team &" secondWord="Roles" accentColor="text-amber-500"
        subtitle="Manage access permissions for the command center"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
        <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4" /> Permission Scope
        </h4>
        <p className="text-sm text-amber-700">
          <strong>Admins</strong> have full access to this dashboard, including changing other users' roles. <strong>Editors</strong> can upload images. <strong>Customers</strong> only use the public storefront. Role changes sign the user out so the new permissions apply on their next login.
        </p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-100">
              <th className="px-6 py-4 font-semibold">User Details</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">No users found.</td>
              </tr>
            ) : (
              users.map(u => {
                const isSelf = u.uid === currentUser?.uid
                return (
                  <tr key={u.uid} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold font-display text-lg shrink-0">
                          {(u.fullName || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">
                            {u.fullName || 'Unnamed User'} {isSelf && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                          </p>
                          <p className="text-xs text-neutral-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role || 'customer'}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                        disabled={isSelf}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="customer">Customer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(u.uid)}
                        disabled={isSelf}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={isSelf ? "Cannot delete yourself" : "Delete user"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
