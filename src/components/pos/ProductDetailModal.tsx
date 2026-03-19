import { useState } from 'react'
import type { RecipeDTO } from '../../types/recipe'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useDeleteRecipe } from '../../hooks/useRecipes'

interface ProductDetailModalProps {
  recipe: RecipeDTO | null
  onClose: () => void
  /** Called after the recipe is successfully deleted. */
  onDeleted?: () => void
}

const CONFIRM_KEYWORD = 'confirm'

/**
 * Displays the full details of a recipe in a centered modal.
 *
 * - Only renders when `recipe` is non-null.
 * - Backdrop click closes the modal (unless delete is in flight).
 * - Shows name, description, price, XP reward, and ingredient list.
 * - "Delete Recipe" button reveals an inline confirmation step that requires
 *   the user to type "confirmar" before the destructive action fires.
 */
export function ProductDetailModal({ recipe, onClose, onDeleted }: ProductDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe()

  if (!recipe) return null

  const canDelete = confirmText.toLowerCase() === CONFIRM_KEYWORD

  function handleClose() {
    if (isDeleting) return
    setShowDeleteConfirm(false)
    setConfirmText('')
    onClose()
  }

  function handleDelete() {
    if (!canDelete || isDeleting) return
    deleteRecipe(recipe!.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        setConfirmText('')
        onDeleted?.()
        onClose()
      },
    })
  }

  return (
    /* Backdrop — closes modal on click */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-modal-title"
      onClick={handleClose}
    >
      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header: name + trash icon ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="product-detail-modal-title"
              className="text-2xl font-bold text-stone-100"
            >
              {recipe.name}
            </h2>

            {/* Description — rendered only when non-empty */}
            {recipe.description?.trim().length > 0 && (
              <p className="text-stone-400 text-sm mt-1">{recipe.description}</p>
            )}
          </div>

          {/* Trash button — top-right, icon only */}
          {!showDeleteConfirm && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-red-900/40 hover:bg-red-800/70 text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
              aria-label={`Delete recipe ${recipe.name}`}
            >
              🗑
            </button>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-stone-700" />

        {/* ── Price and XP Reward ── */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Price
            </span>
            <span className="text-amber-400 font-semibold text-lg">
              ${recipe.price.toFixed(2)}
            </span>
          </div>

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

        {/* ── Delete confirmation section ── */}
        {showDeleteConfirm && (
          <>
            <div className="border-t border-red-900/50" />
            <div className="flex flex-col gap-3 bg-red-950/40 rounded-xl p-4 border border-red-900/50">
              <p className="text-red-300 text-sm font-semibold">
                This action cannot be undone. Type{' '}
                <span className="font-mono bg-red-900/50 px-1 rounded text-red-200">confirm</span>{' '}
                to delete this recipe.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="confirm"
                disabled={isDeleting}
                autoFocus
                className={[
                  'w-full min-h-[52px] px-4 rounded-xl text-base',
                  'bg-stone-700 border-2 text-stone-100 placeholder:text-stone-500',
                  'focus:outline-none transition-colors duration-100',
                  canDelete ? 'border-red-500' : 'border-stone-600',
                  isDeleting ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
                aria-label="Type confirmar to confirm deletion"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setConfirmText('') }}
                  disabled={isDeleting}
                  className="flex-1 min-h-[52px] rounded-xl bg-stone-700 text-stone-300 hover:bg-stone-600 font-semibold transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!canDelete || isDeleting}
                  className="flex-1 min-h-[52px] rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  aria-label={`Confirm delete ${recipe.name}`}
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Deleting…
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Footer actions ── */}
        <PosButton
          variant="secondary"
          fullWidth
          onClick={handleClose}
          disabled={isDeleting}
          className="min-h-[56px] bg-stone-700 text-stone-200 hover:bg-stone-600 active:bg-stone-500"
          aria-label={`Close details for ${recipe.name}`}
        >
          Close
        </PosButton>
      </div>
    </div>
  )
}
