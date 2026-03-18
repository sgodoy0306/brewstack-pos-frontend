import { useCallback, useState } from 'react'
import { PosLayout } from '../components/layout/PosLayout'
import { ProductGrid } from '../components/pos/ProductGrid'
import { PastriesGrid } from '../components/pos/PastriesGrid'
import { CartPanelContent } from '../components/pos/CartPanel'
import { AddPastryModal } from '../components/pos/AddPastryModal'
import { AddRecipeModal } from '../components/pos/AddRecipeModal'
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
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false)
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

  // Fired by AddRecipeModal on successful creation.
  const handleRecipeAdded = useCallback(
    (name: string) => {
      showSuccess(`"${name}" has been added to the coffees catalog.`)
    },
    [showSuccess],
  )

  const handleRecipeDeleted = useCallback(() => {
    showSuccess('Recipe deleted successfully.')
    setDetailRecipe(null)
  }, [showSuccess])

  const handlePastryDeleted = useCallback(() => {
    showSuccess('Pastry deleted successfully.')
    setDetailPastry(null)
  }, [showSuccess])

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
            {/* ── Category tabs + Add button ── */}
            <div className="flex items-center gap-1 px-3 pt-3 pb-2 shrink-0">
              <div className="flex items-center gap-1 flex-1">
                <button
                  type="button"
                  className={[
                    'flex-1 flex items-center justify-center gap-2 h-[40px] rounded-lg text-sm font-medium transition-all duration-100 select-none active:scale-95 cursor-pointer',
                    activeCategory === 'coffees'
                      ? 'bg-stone-700 text-amber-400 border border-stone-500 shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                      : 'text-stone-500 hover:text-stone-300 border border-stone-700 shadow-[0_2px_6px_rgba(0,0,0,0.35)]',
                  ].join(' ')}
                  onClick={() => setActiveCategory('coffees')}
                  aria-pressed={activeCategory === 'coffees'}
                >
                  ☕ Coffees & Infusions
                </button>
                <button
                  type="button"
                  className={[
                    'flex-1 flex items-center justify-center gap-2 h-[40px] rounded-lg text-sm font-medium transition-all duration-100 select-none active:scale-95 cursor-pointer',
                    activeCategory === 'pastries'
                      ? 'bg-stone-700 text-amber-400 border border-stone-500 shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                      : 'text-stone-500 hover:text-stone-300 border border-stone-700 shadow-[0_2px_6px_rgba(0,0,0,0.35)]',
                  ].join(' ')}
                  onClick={() => setActiveCategory('pastries')}
                  aria-pressed={activeCategory === 'pastries'}
                >
                  🥐 Pastries
                </button>
              </div>

              {/* "+ Add Coffee" button — only visible in the coffees tab */}
              {activeCategory === 'coffees' && (
                <button
                  type="button"
                  onClick={() => setIsAddRecipeModalOpen(true)}
                  className="h-[48px] px-4 rounded-xl text-sm font-medium transition-colors shrink-0 bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-700 hover:border-stone-500 active:scale-95"
                  aria-label="Add a new coffee recipe to the catalog"
                >
                  + Add Coffee
                </button>
              )}

              {/* "+ Add Pastry" button — only visible in the pastries tab */}
              {activeCategory === 'pastries' && (
                <button
                  type="button"
                  onClick={() => setIsAddPastryModalOpen(true)}
                  className="h-[48px] px-4 rounded-xl text-sm font-medium transition-colors shrink-0 bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-700 hover:border-stone-500 active:scale-95"
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

      {/* Add Coffee Modal — rendered outside PosLayout to sit above all layers */}
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        onSuccess={handleRecipeAdded}
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
        onDeleted={handleRecipeDeleted}
      />

      {/* Pastry Detail Modal — rendered outside PosLayout so z-index stacks correctly */}
      <PastryDetailModal
        pastry={detailPastry}
        onClose={() => setDetailPastry(null)}
        onDeleted={handlePastryDeleted}
      />
    </>
  )
}
