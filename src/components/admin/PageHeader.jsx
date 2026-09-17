/**
 * PageHeader — shared header for every admin page.
 *
 * Props:
 *  - firstWord: string — black first word (e.g. "Store")
 *  - secondWord: string — colored second word (e.g. "Insights")
 *  - accentColor: string — Tailwind text color for the second word (e.g. "text-blue-500")
 *  - subtitle: string — italic gray subtitle beneath the heading
 *  - children: ReactNode — optional top-right slot (stat card, button, etc.)
 */
export default function PageHeader({ firstWord, secondWord, accentColor = 'text-blue-500', subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          <span className="text-neutral-900">{firstWord} </span>
          <span className={accentColor}>{secondWord}</span>
        </h1>
        {subtitle && (
          <p className="text-neutral-400 text-sm italic mt-1.5">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex-shrink-0">{children}</div>
      )}
    </div>
  )
}
