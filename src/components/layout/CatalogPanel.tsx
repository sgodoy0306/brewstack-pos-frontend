import { ReactNode } from 'react'

interface CatalogPanelProps {
  children: ReactNode
}

/**
 * Left panel — 70% of the screen width.
 * Contains the scrollable product catalog grid.
 * Overflow is vertical-only; horizontal scroll is disabled.
 */
export function CatalogPanel({ children }: CatalogPanelProps) {
  return (
    <main
      className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-cream-50"
      aria-label="Product catalog"
    >
      {children}
    </main>
  )
}
