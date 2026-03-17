import { memo, useCallback } from 'react'
import type { PastryDTO } from '../../types/pastry'
import type { RecipeDTO } from '../../types/recipe'
import { useCartStore } from '../../store/cartStore'

interface PastryCardProps {
  pastry: PastryDTO
}

/**
 * Touchable pastry card displayed in the pastries catalog grid.
 *
 * Design rules:
 * - Same dimensions and proportions as ProductCard to keep the grid homogeneous
 * - No imageUrl on PastryDTO: always shows a stone placeholder with the first
 *   letter of the name as a visual identifier
 * - Unavailable pastries are visually dimmed and non-interactive
 * - Adapts PastryDTO to a RecipeDTO-compatible shape before calling addItem,
 *   since the cart store only knows about RecipeDTO
 */
export const PastryCard = memo(function PastryCard({ pastry }: PastryCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleSelect = useCallback(() => {
    if (!pastry.available) return

    // Adapt PastryDTO to the RecipeDTO shape expected by the cart store.
    // Fields absent in PastryDTO are set to safe zero/empty defaults.
    const asRecipe: RecipeDTO = {
      id: pastry.id,
      name: pastry.name,
      price: pastry.price,
      baseXpReward: 0,
      imageUrl: '',
      ingredients: [],
    }
    addItem(asRecipe)
  }, [pastry, addItem])

  const isDisabled = !pastry.available

  return (
    <button
      type="button"
      onClick={handleSelect}
      disabled={isDisabled}
      aria-label={
        isDisabled
          ? `${pastry.name} — unavailable`
          : `Add ${pastry.name} to cart — $${pastry.price.toFixed(2)}`
      }
      className={[
        // Card shell — mirrors ProductCard structure
        'flex flex-col w-full rounded-2xl overflow-hidden',
        'bg-white border border-stone-200 shadow-sm',
        // Touch feedback (only when available)
        'transition-all duration-100 select-none',
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : [
              'cursor-pointer',
              'hover:border-amber-400 hover:shadow-md',
              'active:scale-95 active:bg-amber-50 active:border-amber-500',
            ].join(' '),
        // Focus ring for keyboard / accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Placeholder area — stone background with first letter of name */}
      <div className="w-full aspect-square bg-stone-700 overflow-hidden relative flex items-center justify-center">
        <span
          className="text-4xl font-bold text-stone-400 uppercase select-none"
          aria-hidden="true"
        >
          {pastry.name.charAt(0)}
        </span>

        {/* Unavailable overlay badge */}
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="bg-stone-800/90 text-stone-300 text-xs font-semibold px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Pastry info */}
      <div className="flex flex-col gap-1 p-3 min-h-[60px]">
        <span className="text-stone-800 font-semibold text-base leading-tight line-clamp-1">
          {pastry.name}
        </span>
        {pastry.description && (
          <span className="text-stone-500 text-xs leading-tight line-clamp-1">
            {pastry.description}
          </span>
        )}
        <span className="text-amber-700 font-bold text-lg mt-auto">
          ${pastry.price.toFixed(2)}
        </span>
      </div>
    </button>
  )
})
