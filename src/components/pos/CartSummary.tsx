import { useCartStore } from '../../store/cartStore'

/**
 * Displays the cart financial breakdown: subtotal, tax, and grand total.
 *
 * This component reads directly from the Zustand store so it always reflects
 * the latest computed values without prop drilling.
 *
 * Layout: three rows separated by a divider before the grand total, styled for
 * quick visual parsing under bar conditions (total is largest and boldest).
 */
export function CartSummary() {
  const subtotal = useCartStore((state) => state.subtotal)
  const tax = useCartStore((state) => state.tax)
  const total = useCartStore((state) => state.total)

  return (
    <div className="px-3 py-3 bg-stone-50 border-t border-stone-200">
      {/* Subtotal row */}
      <div className="flex justify-between items-center py-1">
        <span className="text-stone-500 text-sm">Subtotal</span>
        <span className="text-stone-700 text-sm font-medium">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      {/* Tax row */}
      <div className="flex justify-between items-center py-1">
        <span className="text-stone-500 text-sm">Tax (8%)</span>
        <span className="text-stone-700 text-sm font-medium">
          ${tax.toFixed(2)}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-stone-300 my-2" />

      {/* Grand total row — largest and most prominent */}
      <div className="flex justify-between items-center">
        <span className="text-stone-800 font-bold text-base">Total</span>
        <span className="text-amber-700 font-bold text-xl">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
