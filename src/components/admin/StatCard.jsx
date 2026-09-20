/**
 * StatCard — rounded white card with icon chip, optional badge, label, and value.
 *
 * Props:
 *  - icon: LucideIcon component
 *  - iconBg: Tailwind bg class for the icon chip (e.g. "bg-brand-100")
 *  - iconColor: Tailwind text class for the icon (e.g. "text-brand-500")
 *  - label: string — uppercase label
 *  - value: string | number — big bold value
 *  - badge: string | null — optional top-right badge text (e.g. "LIVE")
 *  - badgeColor: Tailwind classes for the badge
 */
export default function StatCard({ icon: Icon, iconBg, iconColor, label, value, badge, badgeColor = 'bg-brand-100 text-brand-600' }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.8} />
        </div>
        {badge && (
          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-neutral-900">{value}</p>
    </div>
  )
}
