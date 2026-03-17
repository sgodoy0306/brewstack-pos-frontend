import { memo } from 'react'
import type { RecipeDTO } from '../../types/recipe'

interface ProductCardProps {
  recipe: RecipeDTO
  onSelect: (recipe: RecipeDTO) => void
}

/**
 * Touchable product card displayed in the catalog grid.
 *
 * Design rules:
 * - Minimum 60px touch target (entire card is the tap area)
 * - Name ≥ 16px, price ≥ 18px bold — readable at a glance under bar conditions
 * - Immediate visual feedback via active:scale-95 + active:bg-amber-50
 * - Image load failure falls back to a neutral placeholder area
 */
export const ProductCard = memo(function ProductCard({ recipe, onSelect }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(recipe)}
      aria-label={`Add ${recipe.name} to cart — $${recipe.price.toFixed(2)}`}
      className={[
        // Card shell
        'flex flex-col w-full rounded-2xl overflow-hidden',
        'bg-white border border-stone-200 shadow-sm',
        // Touch feedback
        'transition-all duration-100 select-none cursor-pointer',
        'hover:border-amber-400 hover:shadow-md',
        'active:scale-95 active:bg-amber-50 active:border-amber-500',
        // Focus ring for keyboard / accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      {/* Product image */}
      <div className="w-full aspect-square bg-cream-100 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image; the placeholder background shows through
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          // Fallback icon when no imageUrl is provided
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-5xl">
            ☕
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-1 p-3 min-h-[60px]">
        <span className="text-stone-800 font-semibold text-base leading-tight line-clamp-2">
          {recipe.name}
        </span>
        <span className="text-amber-700 font-bold text-lg mt-auto">
          ${recipe.price.toFixed(2)}
        </span>
      </div>
    </button>
  )
})
