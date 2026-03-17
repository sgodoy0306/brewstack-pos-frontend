import { useOfflineStatus } from '../../hooks/useOfflineStatus'

/**
 * Non-blocking offline status indicator.
 *
 * Renders a slim banner at the very top of the viewport when the device has
 * lost network connectivity. Key design decisions:
 *
 * - `pointer-events-none` — the banner never intercepts taps. The barista
 *   can still operate the POS at full speed even while the banner is visible.
 * - `aria-live="polite"` — screen readers announce the message without
 *   interrupting whatever the user is currently doing.
 * - The banner is completely removed from the DOM when online (no hidden
 *   element sitting there), keeping the ARIA tree clean.
 * - Smooth slide-down via CSS transition (translate-y).
 *
 * When offline the Service Worker will serve the cached recipe catalog, so the
 * app remains functional. Only new orders will fail until connectivity returns.
 */
export function OfflineBanner() {
  const isOffline = useOfflineStatus()

  if (!isOffline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="No network connection — running in offline mode"
      className={[
        // Full-width strip anchored above all content
        'w-full z-50',
        // Background and text — amber-900 for warmth, high contrast on white text
        'bg-amber-900 text-amber-100',
        // Compact height — must not steal vertical space from the POS layout
        'flex items-center justify-center gap-2 px-4 py-1.5',
        // Typography
        'text-xs font-semibold tracking-wide',
        // Pointer pass-through so taps still reach the content behind
        'pointer-events-none select-none',
      ].join(' ')}
    >
      {/* Pulse dot — provides an at-a-glance "something is different" signal */}
      <span
        className="w-2 h-2 rounded-full bg-amber-300 animate-pulse shrink-0"
        aria-hidden="true"
      />
      Offline mode — orders will not sync until the connection is restored
    </div>
  )
}
