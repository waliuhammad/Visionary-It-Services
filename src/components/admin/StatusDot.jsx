/**
 * StatusDot — colored dot + uppercase label.
 *
 * Props:
 *  - color: Tailwind bg class (e.g. "bg-brand-400")
 *  - label: string
 *  - pulse: boolean — whether to animate the dot
 */
export default function StatusDot({ color = 'bg-brand-400', label, pulse = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </span>
    </div>
  )
}
