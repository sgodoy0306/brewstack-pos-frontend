import { ReactNode } from 'react'

interface CartPanelProps {
  children: ReactNode
}

/**
 * Right panel — fixed 30% of the screen width.
 * Cart / sales ticket. Height is constrained to the viewport; internal
 * scrolling is allowed so the checkout button stays anchored at the bottom.
 */
export function CartPanel({ children }: CartPanelProps) {
  return (
    <aside
      className="w-[30%] shrink-0 flex flex-col overflow-hidden bg-white border-l border-stone-200"
      aria-label="Cart"
    >
      {children}
    </aside>
  )
}
