/**
 * PillButton — pill-shaped button with optional icon.
 *
 * Props:
 *  - icon: LucideIcon component (optional)
 *  - label: string
 *  - onClick: function
 *  - variant: 'primary' | 'secondary' | 'danger' (default: 'primary')
 *  - className: string — additional classes
 *  - type: string — button type
 */
export default function PillButton({ icon: Icon, label, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) {
  const variants = {
    primary:   'bg-[#1890ff] text-white hover:bg-[#096dd9] shadow-lg shadow-brand-500/20',
    secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
    danger:    'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    success:   'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
      <span>{label}</span>
    </button>
  )
}
