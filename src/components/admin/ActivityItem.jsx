import {
  ShoppingCart, Package, FolderOpen, User, Mail, Settings, LogIn, LogOut,
  Image as ImageIcon, Newspaper, Activity,
} from 'lucide-react'
import { timeAgo } from '../../lib/format'

const ENTITY_STYLE = {
  order: { icon: ShoppingCart, cls: 'bg-brand-100 text-brand-600' },
  product: { icon: Package, cls: 'bg-brand-100 text-brand-600' },
  category: { icon: FolderOpen, cls: 'bg-brand-100 text-brand-600' },
  user: { icon: User, cls: 'bg-brand-100 text-brand-600' },
  message: { icon: Mail, cls: 'bg-brand-100 text-brand-600' },
  settings: { icon: Settings, cls: 'bg-brand-200 text-brand-600' },
  upload: { icon: ImageIcon, cls: 'bg-sky-100 text-sky-600' },
  subscriber: { icon: Newspaper, cls: 'bg-brand-100 text-brand-600' },
}

const ACTION_ICON = { 'auth.login': LogIn, 'auth.logout': LogOut }

export default function ActivityItem({ entry, compact = false }) {
  const style = ENTITY_STYLE[entry.entity] || { icon: Activity, cls: 'bg-neutral-100 text-neutral-500' }
  const Icon = ACTION_ICON[entry.action] || style.icon

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.cls}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-neutral-800 ${compact ? 'text-[13px] leading-snug' : 'text-sm'}`}>{entry.summary}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          {entry.actor?.name || 'System'}
          {entry.actor?.role && entry.actor.role !== 'guest' && <span className="uppercase tracking-wider"> · {entry.actor.role}</span>}
          {' · '}
          <time dateTime={entry.createdAt} title={new Date(entry.createdAt).toLocaleString()}>{timeAgo(entry.createdAt)}</time>
        </p>
      </div>
    </div>
  )
}
