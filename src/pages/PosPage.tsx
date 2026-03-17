import { useCallback } from 'react'
import { PosLayout } from '../components/layout/PosLayout'
import { ProductGrid } from '../components/pos/ProductGrid'
import { CartPanelContent } from '../components/pos/CartPanel'
import { useRecipes } from '../hooks/useRecipes'
import { useCartStore } from '../store/cartStore'
import { useToast } from '../context/ToastContext'
import type { RecipeDTO } from '../types/recipe'
import type { OrderSummaryDTO } from '../types/order'

/**
 * Main POS page — the default route ("/").
 *
 * Responsibilities:
 * - Fetches the product catalog via useRecipes.
 * - Wires ProductGrid → cart store (addItem on product tap).
 * - Renders the cart panel with checkout capability.
 * - Delegates success/error feedback to the global toast system (non-blocking).
 *
 * Barista selection is managed inside CartPanelContent so this page stays
 * free of barista state.
 */
export function PosPage() {
  const { recipes, isLoading, isError, error, refetch } = useRecipes()
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

  const catalogErrorMessage =
    error && 'message' in (error as object)
      ? (error as { message: string }).message
      : undefined

  return (
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
  )
}
