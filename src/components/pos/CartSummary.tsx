import { useCartStore } from '../../store/cartStore'

/**
 * Displays the cart grand total.
 * No tax is applied — total equals the sum of all line items.
 */
export function CartSummary() {
  const total = useCartStore((state) => state.total)

  return (
    <div
      className="px-3 py-3 bg-stone-50 border-t border-stone-200"
      aria-label="Order total"
      role="region"
    >
      <div className="flex justify-between items-center">
        <span className="text-stone-800 font-bold text-base">Total</span>
        <span className="text-amber-700 font-bold text-xl">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
