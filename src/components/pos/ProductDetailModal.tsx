import type { RecipeDTO } from '../../types/recipe'
import { PosButton } from '../ui/PosButton'

interface ProductDetailModalProps {
  recipe: RecipeDTO | null
  onClose: () => void
}

/**
 * Displays the full details of a recipe in a centered modal.
 *
 * - Only renders when `recipe` is non-null.
 * - Backdrop click closes the modal.
 * - Shows name, description (if present), price, XP reward, and ingredient list.
 * - Dark card theme (bg-stone-800) matching the AddBaristaModal pattern.
 */
export function ProductDetailModal({ recipe, onClose }: ProductDetailModalProps) {
  if (!recipe) return null

  return (
    /* Backdrop — closes modal on click */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-modal-title"
      onClick={onClose}
    >
      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Name ── */}
        <div>
          <h2
            id="product-detail-modal-title"
            className="text-2xl font-bold text-stone-100"
          >
            {recipe.name}
          </h2>

          {/* Description — rendered only when non-empty */}
          {recipe.description.trim().length > 0 && (
            <p className="text-stone-400 text-sm mt-1">{recipe.description}</p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-stone-700" />

        {/* ── Price and XP Reward ── */}
        <div className="flex gap-4">
          {/* Price */}
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Price
            </span>
            <span className="text-amber-400 font-semibold text-lg">
              ${recipe.price.toFixed(2)}
            </span>
          </div>

          {/* XP Reward */}
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              XP Reward
            </span>
            <span className="text-stone-300 font-semibold text-lg">
              ⭐ {recipe.baseXpReward} XP
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-stone-700" />

        {/* ── Ingredients ── */}
        <div>
          <p className="text-stone-300 font-semibold mb-2">Ingredients</p>

          {recipe.ingredients.length === 0 ? (
            <p className="text-stone-500 text-sm">No ingredients listed.</p>
          ) : (
            <ul className="flex flex-col gap-2" role="list">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${ingredient.ingredientName}-${index}`}
                  className="flex items-center justify-between py-2 px-3 bg-stone-700/60 rounded-xl"
                >
                  <span className="text-stone-200 text-sm font-medium">
                    {ingredient.ingredientName}
                  </span>
                  <span className="text-stone-400 text-sm">
                    {ingredient.quantityRequired} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Close button ── */}
        <PosButton
          variant="secondary"
          fullWidth
          onClick={onClose}
          className="min-h-[56px] bg-stone-700 text-stone-200 hover:bg-stone-600 active:bg-stone-500"
          aria-label={`Close details for ${recipe.name}`}
        >
          Close
        </PosButton>
      </div>
    </div>
  )
}
