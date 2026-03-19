type BadgeVariant = 'default' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  label: string | number
  variant?: BadgeVariant
  className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-stone-200 text-stone-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
}

/**
 * Small chip component for quantities, statuses, or counts.
 * Used in cart items, stock alerts, and navigation tabs.
 */
export function Badge({ label, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center',
        'min-w-[24px] h-6 px-2 rounded-full',
        'text-xs font-bold leading-none',
        VARIANT_CLASSES[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  )
}
