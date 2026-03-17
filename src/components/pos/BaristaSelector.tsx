import { useBaristas } from '../../hooks/useBaristas'

interface BaristaSelectorProps {
  /** Currently selected barista ID. Use 0 or undefined for "no barista". */
  value: number
  /** Called whenever the user picks a different barista. */
  onChange: (baristaId: number) => void
  /** Additional Tailwind classes to apply to the root element. */
  className?: string
}

/**
 * Barista assignment picker for the POS cart panel.
 *
 * Renders a native <select> element styled for touch — minimum 60px height,
 * large text, and a clear label. Native select is intentional: it provides
 * the platform's own scroll picker on mobile/tablet (faster than a custom
 * dropdown in a high-pressure environment) and requires no extra dependencies.
 *
 * Behaviour:
 * - Loads barista list via useBaristas (TanStack Query, cached).
 * - Shows a loading skeleton row while data is in flight.
 * - Shows an error hint (non-blocking) if the fetch fails.
 * - The first option is always "No barista assigned" (value 0).
 * - Selecting a barista emits their numeric ID via onChange.
 */
export function BaristaSelector({ value, onChange, className = '' }: BaristaSelectorProps) {
  const { baristas, isLoading, isError } = useBaristas()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label */}
      <label
        htmlFor="barista-select"
        className="text-xs font-semibold uppercase tracking-wide text-stone-500 px-1"
      >
        Barista
      </label>

      {/* Select — touch target is the full min-h-[60px] row */}
      <div className="relative">
        <select
          id="barista-select"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={isLoading}
          aria-label="Assign barista to this order"
          aria-busy={isLoading}
          className={[
            // Size — meets the 60px touch-target standard
            'w-full min-h-[60px] px-4 pr-10',
            // Typography
            'text-base font-medium',
            // Appearance
            'rounded-xl border appearance-none',
            'bg-stone-50 cursor-pointer',
            // Colour states
            isLoading
              ? 'border-stone-200 text-stone-400'
              : isError
                ? 'border-red-300 text-stone-700'
                : 'border-stone-300 text-stone-800 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent',
            // Transition
            'transition-colors duration-100',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Default / unassigned option */}
          <option value={0}>
            {isLoading ? 'Loading baristas…' : '— No barista —'}
          </option>

          {/* Barista options — only rendered once data is available */}
          {!isLoading &&
            !isError &&
            baristas.map((barista) => (
              <option key={barista.id} value={barista.id}>
                {barista.name} (Lv {barista.level})
              </option>
            ))}
        </select>

        {/* Custom chevron icon — hidden from AT */}
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>

      {/* Non-blocking error hint — does not prevent order completion */}
      {isError && (
        <p className="text-xs text-red-500 px-1" role="alert">
          Could not load baristas. You can still complete the order without one.
        </p>
      )}
    </div>
  )
}
