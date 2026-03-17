import { useCallback, useState } from 'react'
import { PosLayout } from '../components/layout/PosLayout'
import { ProductGrid } from '../components/pos/ProductGrid'
import { CartPanelContent } from '../components/pos/CartPanel'
import { useRecipes } from '../hooks/useRecipes'
import { useCartStore } from '../store/cartStore'
import type { RecipeDTO } from '../types/recipe'
import type { OrderSummaryDTO } from '../types/order'

/**
 * Main POS page — the default route ("/").
 *
 * Responsibilities:
 * - Fetches the product catalog via useRecipes.
 * - Wires ProductGrid → cart store (addItem on product tap).
 * - Renders the cart panel with checkout capability.
 * - Handles order success/error feedback (banner-level, non-blocking).
 *
 * Barista selection is managed inside CartPanelContent (step 3.3) so this
 * page stays free of barista state.
 */
export function PosPage() {
  const { recipes, isLoading, isError, error, refetch } = useRecipes()
  const addItem = useCartStore((state) => state.addItem)

  // Lightweight success/error banners — non-blocking, auto-dismiss via timeout.
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleProductSelect = useCallback(
    (recipe: RecipeDTO) => {
      addItem(recipe)
    },
    [addItem],
  )

  const handleOrderSuccess = useCallback((summary: OrderSummaryDTO) => {
    const label =
      summary.brewedRecipes.length === 1
        ? `1 item brewed`
        : `${summary.brewedRecipes.length} items brewed`
    setSuccessMessage(`Order complete — ${label}. Total: $${summary.totalRevenue.toFixed(2)}`)
    setErrorMessage(null)
    // Auto-dismiss after 4 seconds.
    setTimeout(() => setSuccessMessage(null), 4000)
  }, [])

  const handleOrderError = useCallback((message: string) => {
    setErrorMessage(message)
    setSuccessMessage(null)
    setTimeout(() => setErrorMessage(null), 5000)
  }, [])

  const catalogErrorMessage =
    error && 'message' in (error as object)
      ? (error as { message: string }).message
      : undefined

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden">
      {/* ── Non-blocking notification banners ─────────────────────────── */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="mt-2 mx-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl shadow-lg">
            {successMessage}
          </div>
        </div>
      )}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="mt-2 mx-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl shadow-lg">
            {errorMessage}
          </div>
        </div>
      )}

      {/* ── Main POS layout ────────────────────────────────────────────── */}
      <PosLayout
        catalog={
          <ProductGrid
            recipes={recipes}
            isLoading={isLoading}
            isError={isError}
            errorMessage={catalogErrorMessage}
            onRetry={refetch}
            onProductSelect={handleProductSelect}
          />
        }
        cart={
          <CartPanelContent
            onOrderSuccess={handleOrderSuccess}
            onOrderError={handleOrderError}
          />
        }
      />
    </div>
  )
}
