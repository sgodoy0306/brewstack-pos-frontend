import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface PosButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-amber-700 text-white hover:bg-amber-800 active:bg-amber-900 active:scale-95',
  secondary:
    'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400 active:scale-95',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 active:scale-95',
}

/**
 * Touch-optimized button for POS tablet use.
 * Minimum height 60px to ensure reliable tap targets under fast-paced conditions.
 */
export function PosButton({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: PosButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        // Base touch-target size and layout
        'min-h-[60px] px-6 rounded-xl font-semibold text-base',
        'flex items-center justify-center gap-2',
        // Smooth transition for all interactive states
        'transition-all duration-100 select-none',
        // Variant-specific colors and active feedback
        VARIANT_CLASSES[variant],
        // Disabled state
        disabled ? 'opacity-40 cursor-not-allowed active:scale-100' : 'cursor-pointer',
        // Full-width option
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
