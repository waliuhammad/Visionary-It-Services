import { Bell, X } from 'lucide-react'
import { useRealtime } from '../../context/RealtimeContext'

/** Pop-up notifications for important live events (new orders, messages, sign-ups). */
export default function Toasts() {
  const { toasts, dismissToast } = useRealtime()
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-[340px] max-w-[calc(100vw-3rem)]" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="bg-[#001a3d] text-white rounded-2xl shadow-2xl p-4 flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">{t.title}</p>
            <p className="text-sm mt-0.5 break-words">{t.body}</p>
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-white/50 hover:text-white" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
