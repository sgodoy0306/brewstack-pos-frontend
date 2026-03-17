import { useCallback, useState } from 'react'
import { PosLayout } from '../components/layout/PosLayout'
import { ProductGrid } from '../components/pos/ProductGrid'
import { PastriesGrid } from '../components/pos/PastriesGrid'
import { CartPanelContent } from '../components/pos/CartPanel'
import { AddPastryModal } from '../components/pos/AddPastryModal'
import { ProductDetailModal } from '../components/pos/ProductDetailModal'
import { PastryDetailModal } from '../components/pos/PastryDetailModal'
import { useRecipes } from '../hooks/useRecipes'
import { usePastries } from '../hooks/usePastries'
import { useCartStore } from '../store/cartStore'
import { useToast } from '../context/ToastContext'
import type { RecipeDTO } from '../types/recipe'
import type { PastryDTO } from '../types/pastry'
import type { OrderSummaryDTO } from '../types/order'

/** The two catalog tabs available in the POS left panel. */
type ActiveCategory = 'coffees' | 'pastries'

/**
 * Main POS page — the default route ("/").
 *
 * Responsibilities:
 * - Renders category tabs ("Coffees & Infusions" / "Pastries") above the catalog grid.
 * - Fetches the coffee product catalog via useRecipes.
 * - Fetches the pastries catalog via usePastries.
 * - Wires ProductGrid → cart store (addItem on product tap).
 * - PastryCard calls addItem directly from the store (no wiring needed here).
 * - Renders the cart panel with checkout capability.
 * - Delegates success/error feedback to the global toast system (non-blocking).
 * - Opens AddPastryModal when the user taps "+ Add Pastry" in the pastries tab.
 *
 * Barista selection is managed inside CartPanelContent so this page stays
 * free of barista state.
 */
export function PosPage() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('coffees')
  const [isAddPastryModalOpen, setIsAddPastryModalOpen] = useState(false)
  const [detailRecipe, setDetailRecipe] = useState<RecipeDTO | null>(null)
  const [detailPastry, setDetailPastry] = useState<PastryDTO | null>(null)

  const { recipes, isLoading: recipesLoading, isError: recipesError, error: recipesRawError, refetch: refetchRecipes } = useRecipes()
  const { pastries, isLoading: pastriesLoading, isError: pastriesError, error: pastriesRawError, refetch: refetchPastries } = usePastries()

  const addItem = useCartStore((state) => state.addItem)
  const { showSuccess, showError } = useToast()

  const handleProductSelect = useCallback(
    (recipe: RecipeDTO) => {
      addItem(recipe)
    },
    [addItem],
  )

  const handleOrderSuccess = useCallback(
    (summary: OrderSummaryDTO) => {
      const label =
        summary.brewedRecipes.length === 1
          ? '1 item brewed'
          : `${summary.brewedRecipes.length} items brewed`
      showSuccess(`Order complete — ${label}. Total: $${summary.totalRevenue.toFixed(2)}`)
    },
    [showSuccess],
  )

  const handleOrderError = useCallback(
    (message: string) => {
      showError(message)
    },
    [showError],
  )

  // Fired by AddPastryModal on successful creation (before the user dismisses the
  // success screen). Shows the toast immediately so it's visible as the user taps "Done".
  const handlePastryAdded = useCallback(
    (name: string) => {
      showSuccess(`"${name}" has been added to the pastries catalog.`)
    },
    [showSuccess],
  )

  const catalogErrorMessage =
    recipesRawError && 'message' in (recipesRawError as object)
      ? (recipesRawError as { message: string }).message
      : undefined

  const pastriesErrorMessage =
    pastriesRawError && 'message' in (pastriesRawError as object)
      ? (pastriesRawError as { message: string }).message
      : undefined

  return (
    <>
      <PosLayout
        catalog={
          <div className="flex flex-col h-full overflow-hidden">
            {/* ── Category tabs + Add Pastry button ── */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2 shrink-0">
              <button
                type="button"
                className={[
                  'flex-1 min-h-[52px] rounded-xl font-semibold text-sm transition-colors',
                  activeCategory === 'coffees'
                    ? 'bg-amber-500 text-stone-900'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600',
                ].join(' ')}
                onClick={() => setActiveCategory('coffees')}
                aria-pressed={activeCategory === 'coffees'}
              >
                ☕ Coffees & Infusions
              </button>
              <button
                type="button"
                className={[
                  'flex-1 min-h-[52px] rounded-xl font-semibold text-sm transition-colors',
                  activeCategory === 'pastries'
                    ? 'bg-amber-500 text-stone-900'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600',
                ].join(' ')}
                onClick={() => setActiveCategory('pastries')}
                aria-pressed={activeCategory === 'pastries'}
              >
                🥐 Pastries
              </button>

              {/* "+ Add Pastry" button — only visible in the pastries tab */}
              {activeCategory === 'pastries' && (
                <button
                  type="button"
                  onClick={() => setIsAddPastryModalOpen(true)}
                  className={[
                    'min-h-[52px] px-4 rounded-xl font-semibold text-sm transition-colors shrink-0',
                    'bg-stone-700 text-stone-300 hover:bg-stone-600 active:scale-95',
                    'border border-stone-600',
                  ].join(' ')}
                  aria-label="Add a new pastry to the catalog"
                >
                  + Add Pastry
                </button>
              )}
            </div>

            {/* ── Catalog content — fills remaining height ── */}
            <div className="flex-1 min-h-0">
              {activeCategory === 'coffees' ? (
                <ProductGrid
                  recipes={recipes}
                  isLoading={recipesLoading}
                  isError={recipesError}
                  errorMessage={catalogErrorMessage}
                  onRetry={refetchRecipes}
                  onProductSelect={handleProductSelect}
                  onDetail={setDetailRecipe}
                />
              ) : (
                <PastriesGrid
                  pastries={pastries}
                  isLoading={pastriesLoading}
                  isError={pastriesError}
                  errorMessage={pastriesErrorMessage}
                  onRetry={refetchPastries}
                  onDetail={setDetailPastry}
                />
              )}
            </div>
          </div>
        }
        cart={
          <CartPanelContent
            onOrderSuccess={handleOrderSuccess}
            onOrderError={handleOrderError}
          />
        }
      />

      {/* Add Pastry Modal — rendered outside PosLayout to sit above all layers */}
      <AddPastryModal
        isOpen={isAddPastryModalOpen}
        onClose={() => setIsAddPastryModalOpen(false)}
        onSuccess={handlePastryAdded}
      />

      {/* Product Detail Modal — rendered outside PosLayout so z-index stacks correctly */}
      <ProductDetailModal
        recipe={detailRecipe}
        onClose={() => setDetailRecipe(null)}
      />

      {/* Pastry Detail Modal — rendered outside PosLayout so z-index stacks correctly */}
      <PastryDetailModal
        pastry={detailPastry}
        onClose={() => setDetailPastry(null)}
      />
    </>
  )
}
