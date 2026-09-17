import { useState, useEffect } from 'react'
import { Check, Trash2, Mail } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import { api } from '../../lib/api'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/contact')
        // Sort newest first
        const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setMessages(sorted)
      } catch (err) {
        console.error('Failed to load messages', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleMarkDone = async (id) => {
    try {
      await api.patch(`/contact/${id}`, { read: true })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    } catch (err) {
      alert('Failed to mark message as read')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete message?')) return
    try {
      await api.del(`/contact/${id}`)
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      alert('Failed to delete message')
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="max-w-5xl">
      <PageHeader
        firstWord="Contact" secondWord="Messages" accentColor="text-pink-500"
        subtitle="Inquiries from the storefront contact form"
      >
        <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
          <Mail className="w-4 h-4" />
          {unreadCount === 0 ? 'NOTHING WAITING' : `${unreadCount} NEW`}
        </div>
      </PageHeader>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-neutral-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm text-neutral-500">No messages found.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 transition-all ${msg.read ? 'border-l-neutral-200' : 'border-l-pink-500 shadow-md'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="text-sm text-pink-600 hover:underline">{msg.email}</a>
                  <p className="text-[11px] text-neutral-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {!msg.read && (
                    <button onClick={() => handleMarkDone(msg.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <Check className="w-3.5 h-3.5" /> Mark Done
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-neutral-700 text-sm whitespace-pre-wrap bg-neutral-50 p-4 rounded-xl">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
