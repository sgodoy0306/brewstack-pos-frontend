import { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { CatalogPanel } from './CatalogPanel'
import { CartPanel } from './CartPanel'

interface PosLayoutProps {
  /** Product catalog content rendered in the left 70% panel */
  catalog: ReactNode
  /** Cart/ticket content rendered in the right 30% panel */
  cart: ReactNode
}

/**
 * Root landscape layout for the POS screen.
 *
 * Structure (full viewport, no scroll at the root level):
 *   ┌──────────────────────────────┐
 *   │          NavBar (60px)       │
 *   ├──────────────────┬───────────┤
 *   │  CatalogPanel    │ CartPanel │
 *   │      70%         │    30%    │
 *   └──────────────────┴───────────┘
 */
export function PosLayout({ catalog, cart }: PosLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-cream-50">
      <NavBar />

      {/* Content area: catalog left + cart right, fills remaining height */}
      <div className="flex flex-1 min-h-0">
        <CatalogPanel>{catalog}</CatalogPanel>
        <CartPanel>{cart}</CartPanel>
      </div>
    </div>
  )
}
