interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

/**
 * Inline error display with an optional retry action.
 * Renders a non-blocking message — never a full-screen takeover.
 */
export function ErrorMessage({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-red-50 border border-red-200 text-center"
    >
      <span className="text-red-600 text-2xl" aria-hidden="true">
        ⚠
      </span>
      <p className="text-red-700 text-base font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="min-h-[44px] px-5 rounded-lg bg-red-600 text-white text-sm font-semibold
                     hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-100"
        >
          Retry
        </button>
      )}
    </div>
  )
}
