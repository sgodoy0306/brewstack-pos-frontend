import { memo, useCallback } from 'react'
import { useCartStore } from '../../store/cartStore'
import type { CartItem as CartItemType } from '../../store/cartStore'

interface CartItemProps {
  item: CartItemType
}

/**
 * A single line item row in the sales ticket.
 *
 * Design rules:
 * - Quantity stepper buttons are ≥ 44px to be tappable during busy service.
 * - Line price is always visible and bold — readable at a glance.
 * - The "−" button is styled as danger when quantity is 1 to signal removal.
 */
export const CartItem = memo(function CartItem({ item }: CartItemProps) {
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)

  const handleAdd = useCallback(() => {
    addItem(item.recipe)
  }, [addItem, item.recipe])

  const handleRemove = useCallback(() => {
    removeItem(item.recipe.id)
  }, [removeItem, item.recipe.id])

  const isLastUnit = item.quantity === 1

  return (
    <li className="flex items-center gap-2 py-2 px-3 border-b border-stone-100 last:border-b-0">
      {/* Product name */}
      <div className="flex-1 min-w-0">
        <p className="text-stone-800 font-medium text-sm leading-tight truncate">
          {item.recipe.name}
        </p>
        <p className="text-stone-400 text-xs mt-0.5">
          ${item.recipe.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleRemove}
          aria-label={
            isLastUnit
              ? `Remove ${item.recipe.name} from cart`
              : `Decrease quantity of ${item.recipe.name}`
          }
          className={[
            'min-w-[44px] min-h-[44px] flex items-center justify-center',
            'rounded-lg text-lg font-bold transition-all duration-100 select-none',
            isLastUnit
              ? 'bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300 active:scale-95'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 active:bg-stone-300 active:scale-95',
          ].join(' ')}
        >
          {isLastUnit ? '×' : '−'}
        </button>

        <span
          className="min-w-[28px] text-center text-stone-800 font-semibold text-base"
          aria-label={`Quantity: ${item.quantity}`}
        >
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Increase quantity of ${item.recipe.name}`}
          className={[
            'min-w-[44px] min-h-[44px] flex items-center justify-center',
            'rounded-lg text-lg font-bold transition-all duration-100 select-none',
            'bg-stone-100 text-stone-600 hover:bg-stone-200 active:bg-stone-300 active:scale-95',
          ].join(' ')}
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div className="shrink-0 w-16 text-right">
        <span className="text-stone-800 font-bold text-base">
          ${item.lineTotal.toFixed(2)}
        </span>
      </div>
    </li>
  )
})
