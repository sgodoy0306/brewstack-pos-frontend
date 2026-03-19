import { useCallback, useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useBrewOrder } from '../../hooks/useBrewOrder'
import type { OrderSummaryDTO } from '../../types/order'

interface CheckoutButtonProps {
  /**
   * ID of the barista assigned to this order.
   * Pass 0 or omit to process the order without a barista assignment.
   */
  baristaId?: number
  /** Called with the server response after a successful order placement. */
  onSuccess?: (summary: OrderSummaryDTO) => void
  /** Called when the order placement fails. */
  onError?: (message: string) => void
}

/**
 * Primary CTA button for completing a sale.
 *
 * Visual requirements (highest priority element on the POS screen):
 * - Full width, minimum 64px tall (exceeds the 60px bar standard)
 * - High-contrast green background for instant recognition
 * - Disabled when cart is empty or an order is in flight
 * - Loading indicator replaces label during the API call — no double-submit
 *
 * On success: places the brew order and clears the cart. The parent can
 * hook into onSuccess to show a confirmation UI (e.g., toast or summary modal).
 */
export function CheckoutButton({
  baristaId = 0,
  onSuccess,
  onError,
}: CheckoutButtonProps) {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total)
  const clearCart = useCartStore((state) => state.clearCart)

  const { placeOrderAsync, isPending } = useBrewOrder()

  // Prevent any interaction while a request is in-flight.
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isDisabled = items.length === 0 || isPending || isSubmitting

  const handleCheckout = useCallback(async () => {
    if (isDisabled) return

    // Flatten cart items into the array of recipe IDs that the API expects.
    // Each recipe appears once per unit (e.g., 2× Cappuccino → [id, id]).
    const recipeIds = items.flatMap((item) =>
      Array.from({ length: item.quantity }, () => item.recipe.id),
    )

    // Normalise: treat 0 as "no barista" and send null so the backend
    // skips XP assignment instead of rejecting the request.
    const resolvedBaristaId = baristaId && baristaId > 0 ? baristaId : null

    setIsSubmitting(true)
    try {
      const summary = await placeOrderAsync({ recipeIds, baristaId: resolvedBaristaId })
      clearCart()
      onSuccess?.(summary)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Order failed. Please try again.'
      onError?.(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [isDisabled, items, baristaId, placeOrderAsync, clearCart, onSuccess, onError])

  const isLoading = isPending || isSubmitting

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isDisabled}
      aria-label={`Complete payment — $${total.toFixed(2)}`}
      aria-busy={isLoading}
      className={[
        // Size — must be the most visually dominant element on screen
        'w-full min-h-[64px] px-6 rounded-xl',
        // Typography
        'font-bold text-lg text-white',
        // Layout
        'flex items-center justify-center gap-3',
        // Transition
        'transition-all duration-100 select-none',
        // Enabled state — high-contrast green
        !isDisabled
          ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-[0.98]'
          : 'bg-stone-300 text-stone-400 cursor-not-allowed',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? (
        <>
          {/* Inline spinner — keeps button layout stable during the request */}
          <span
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          Processing…
        </>
      ) : (
        <>
          <span aria-hidden="true">✓</span>
          Complete Payment
          {total > 0 && (
            <span className="ml-1 font-extrabold text-xl">
              ${total.toFixed(2)}
            </span>
          )}
        </>
      )}
    </button>
  )
}
