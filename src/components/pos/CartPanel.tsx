import { useCartStore } from '../../store/cartStore'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { CheckoutButton } from './CheckoutButton'
import type { OrderSummaryDTO } from '../../types/order'

interface CartPanelContentProps {
  /** Barista ID to be passed through to CheckoutButton. */
  baristaId?: number
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
 *   4. CartSummary — subtotal / tax / total (sticky)
 *   5. CheckoutButton — always visible at the bottom (sticky)
 *
 * The sticky footer (summary + button) ensures the primary CTA is always
 * reachable without scrolling, regardless of how many items are in the cart.
 */
export function CartPanelContent({
  baristaId,
  onOrderSuccess,
  onOrderError,
}: CartPanelContentProps) {
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.itemCount)

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

      {/* ── Sticky footer: summary + checkout ──────────────────────── */}
      <div className="shrink-0">
        <CartSummary />
        <div className="px-3 pb-3 pt-2">
          <CheckoutButton
            baristaId={baristaId}
            onSuccess={onOrderSuccess}
            onError={onOrderError}
          />
        </div>
      </div>
    </div>
  )
}
