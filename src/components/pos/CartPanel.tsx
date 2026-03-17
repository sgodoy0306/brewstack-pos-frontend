import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { CheckoutButton } from './CheckoutButton'
import { BaristaSelector } from './BaristaSelector'
import type { OrderSummaryDTO } from '../../types/order'

interface CartPanelContentProps {
  onOrderSuccess?: (summary: OrderSummaryDTO) => void
  onOrderError?: (message: string) => void
}

/**
 * Full cart content to be rendered inside the layout's CartPanel.
 *
 * Sections (top to bottom):
 *   1. Header — item count badge
 *   2. Item list — scrollable when it overflows
 *   3. Empty state — when there are no items
 *   4. BaristaSelector — assign a barista to this order (above the sticky footer)
 *   5. CartSummary — subtotal / tax / total (sticky)
 *   6. CheckoutButton — always visible at the bottom (sticky)
 *
 * The sticky footer (barista selector + summary + button) ensures the primary
 * CTA is always reachable without scrolling, regardless of how many items are
 * in the cart.
 *
 * Barista selection state lives here — it resets to 0 after a successful order
 * so the next order starts without an accidental carry-over assignment.
 */
export function CartPanelContent({
  onOrderSuccess,
  onOrderError,
}: CartPanelContentProps) {
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.itemCount)

  /** ID of the barista assigned to the current order. 0 = unassigned. */
  const [selectedBaristaId, setSelectedBaristaId] = useState<number>(0)

  /**
   * Wraps the parent success handler to also reset the barista selection.
   * This prevents the same barista from accidentally being pre-selected on
   * the next order when the cashier is moving quickly.
   */
  const handleOrderSuccess = (summary: OrderSummaryDTO) => {
    setSelectedBaristaId(0)
    onOrderSuccess?.(summary)
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200 shrink-0">
        <h2 className="text-stone-700 font-semibold text-sm uppercase tracking-wide">
          Current Order
        </h2>
        {itemCount > 0 && (
          <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </div>

      {/* ── Item list ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400 px-4 text-center">
            <span className="text-4xl" aria-hidden="true">
              🧾
            </span>
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs">Tap a product to add it here.</p>
          </div>
        ) : (
          <ul aria-label="Cart items">
            {items.map((item) => (
              <CartItem key={item.recipe.id} item={item} />
            ))}
          </ul>
        )}
      </div>

      {/* ── Sticky footer: barista selector + summary + checkout ──── */}
      <div className="shrink-0">
        {/* BaristaSelector sits above the financial summary, still in the
            sticky block so it stays visible even when the cart is long. */}
        <div className="px-3 pt-3 pb-2 border-t border-stone-200">
          <BaristaSelector
            value={selectedBaristaId}
            onChange={setSelectedBaristaId}
          />
        </div>
        <CartSummary />
        <div className="px-3 pb-3 pt-2">
          <CheckoutButton
            baristaId={selectedBaristaId}
            onSuccess={handleOrderSuccess}
            onError={onOrderError}
          />
        </div>
      </div>
    </div>
  )
}
