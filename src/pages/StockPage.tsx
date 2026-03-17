import { useState, useCallback } from 'react'
import { NavBar } from '../components/layout/NavBar'
import { IngredientRow } from '../components/stock/IngredientRow'
import { RestockModal } from '../components/stock/RestockModal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Badge } from '../components/ui/Badge'
import { useStock, useRestock, useLowStock } from '../hooks/useStock'
import { useToast } from '../context/ToastContext'
import type { IngredientDTO } from '../types/stock'

const PAGE_SIZE = 15

/**
 * Stock management page — route "/stock".
 *
 * Displays a paginated list of all ingredients with their current stock levels.
 * Low-stock items are highlighted and a summary alert is shown at the top.
 * Tapping "Restock" on any row opens the RestockModal.
 * Restock success/error feedback is delivered via the global toast system.
 */
export function StockPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDTO | null>(null)

  const {
    ingredients,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
  } = useStock({ page: currentPage, size: PAGE_SIZE, sort: 'name' })

  const {
    lowStockIngredients,
    hasLowStock,
  } = useLowStock()

  const { restock, isPending: isRestocking } = useRestock()
  const { showSuccess, showError } = useToast()

  // Stable callbacks — prevent unnecessary child re-renders.
  const handleRestockClick = useCallback((ingredient: IngredientDTO) => {
    setSelectedIngredient(ingredient)
  }, [])

  const handleModalClose = useCallback(() => {
    if (!isRestocking) setSelectedIngredient(null)
  }, [isRestocking])

  const handleRestockConfirm = useCallback(
    (ingredientId: number, amount: number) => {
      const ingredientName = selectedIngredient?.name ?? 'Ingredient'
      restock(
        { ingredientId, request: { amount } },
        {
          onSuccess: () => {
            setSelectedIngredient(null)
            showSuccess(`${ingredientName} restocked successfully (+${amount})`)
          },
          onError: (err) => {
            const message =
              (err as { message?: string })?.message ?? 'Restock failed. Please try again.'
            showError(message)
          },
        },
      )
    },
    [restock, selectedIngredient, showSuccess, showError],
  )

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-100">
      <NavBar />

      <main className="flex-1 flex flex-col overflow-hidden" aria-label="Stock management">
        {/* Page header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-xl">📦</span>
            <h1 className="text-xl font-bold text-stone-900">Stock</h1>
            {hasLowStock && (
              <Badge
                label={`${lowStockIngredients.length} low`}
                variant="warning"
                className="text-sm px-3 h-7"
              />
            )}
          </div>

          {/* Low-stock alert banner — non-blocking, informational only */}
          {hasLowStock && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-300"
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">⚠</span>
              <span className="text-sm font-semibold text-amber-800">
                {lowStockIngredients.length} ingredient
                {lowStockIngredients.length !== 1 ? 's' : ''} below minimum threshold
              </span>
            </div>
          )}
        </div>

        {/* Content area — scrollable ingredient list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {isError && !isLoading && (
            <ErrorMessage
              message={
                (error as { message?: string })?.message ??
                'Failed to load stock. Please try again.'
              }
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && ingredients.length === 0 && (
            <div className="flex items-center justify-center h-48 text-stone-400 text-lg">
              No ingredients found.
            </div>
          )}

          {!isLoading && !isError && ingredients.length > 0 && (
            <div className="flex flex-col gap-2" role="table" aria-label="Ingredient stock list">
              {ingredients.map((ingredient) => (
                <IngredientRow
                  key={ingredient.id}
                  ingredient={ingredient}
                  onRestockClick={handleRestockClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-stone-200 shrink-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0 || isLoading}
              className={[
                'min-h-[60px] min-w-[120px] px-5 rounded-xl font-semibold text-sm',
                'transition-all duration-100 select-none',
                currentPage === 0 || isLoading
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400 active:scale-95 cursor-pointer',
              ].join(' ')}
              aria-label="Go to previous page"
            >
              Previous
            </button>

            <span className="text-sm text-stone-500 font-medium" aria-live="polite">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className={[
                'min-h-[60px] min-w-[120px] px-5 rounded-xl font-semibold text-sm',
                'transition-all duration-100 select-none',
                currentPage >= totalPages - 1 || isLoading
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400 active:scale-95 cursor-pointer',
              ].join(' ')}
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Restock modal — rendered at page level so it overlays everything */}
      <RestockModal
        ingredient={selectedIngredient}
        isPending={isRestocking}
        onConfirm={handleRestockConfirm}
        onClose={handleModalClose}
      />
    </div>
  )
}
