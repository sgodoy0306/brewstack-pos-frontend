import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  /**
   * Show a toast notification.
   * Auto-dismisses after `durationMs` (default: 4000ms for success/info,
   * 6000ms for error/warning).
   */
  showToast: (message: string, variant?: ToastVariant, durationMs?: number) => void
  /** Convenience shorthand — green success toast */
  showSuccess: (message: string) => void
  /** Convenience shorthand — red error toast */
  showError: (message: string) => void
}

// ─── Context ───────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
}

/**
 * Provides a global toast notification system.
 *
 * Place this at the root of the app (wrapping the router) so any component
 * in the tree can call `useToast()` without prop-drilling.
 *
 * Toasts are stacked vertically at the top-center of the viewport and dismiss
 * automatically. They are `pointer-events-none` so they never block taps on
 * the POS interface behind them.
 *
 * Multiple toasts can coexist (useful if a catalog error and a checkout error
 * fire simultaneously). A maximum of 3 are shown at once to avoid visual noise.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  // Track active timers so we can clear them if the component unmounts
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', durationMs?: number) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const duration = durationMs ?? DEFAULT_DURATION[variant]

      setToasts((prev) => {
        // Cap at 3 visible toasts — drop the oldest if we're at the limit
        const capped = prev.length >= 3 ? prev.slice(1) : prev
        return [...capped, { id, message, variant }]
      })

      const timer = setTimeout(() => dismiss(id), duration)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast],
  )

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast],
  )

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Access the global toast system from any component.
 *
 * @throws If used outside of `<ToastProvider>`.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}

// ─── Toast Stack UI ────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-stone-800 text-white',
}

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

interface ToastStackProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

/**
 * Renders the floating toast stack at the top-center of the viewport.
 * This component is intentionally colocated with the provider so it is not
 * exported and cannot be accidentally rendered elsewhere.
 */
function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className={[
        // Fixed overlay at the top of the viewport
        'fixed top-0 left-0 right-0 z-[9999]',
        // Stack toasts centered, with a small gap between them
        'flex flex-col items-center gap-2 pt-2 px-4',
        // Pass touches through the container area so taps reach the POS below
        'pointer-events-none',
      ].join(' ')}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={[
            // Base pill shape
            'flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg',
            // Allow clicking the dismiss button (the container itself is pointer-events-none)
            'pointer-events-auto',
            // Typography
            'text-sm font-semibold',
            // Max width prevents a very long message from becoming a full-width bar
            'max-w-md',
            // Variant colour
            VARIANT_CLASSES[toast.variant],
          ].join(' ')}
        >
          {/* Variant icon — decorative */}
          <span aria-hidden="true" className="shrink-0 text-base">
            {VARIANT_ICON[toast.variant]}
          </span>

          {/* Message */}
          <span className="flex-1 leading-snug">{toast.message}</span>

          {/* Dismiss button — min 44px touch target */}
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className={[
              'shrink-0 min-w-[44px] min-h-[44px]',
              'flex items-center justify-center',
              'rounded-lg opacity-70 hover:opacity-100',
              'transition-opacity duration-100',
              'cursor-pointer',
            ].join(' ')}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
