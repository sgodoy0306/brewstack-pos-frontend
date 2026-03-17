import { useCallback } from 'react'
import { PosLayout } from '../components/layout/PosLayout'
import { ProductGrid } from '../components/pos/ProductGrid'
import { useRecipes } from '../hooks/useRecipes'
import type { RecipeDTO } from '../types/recipe'

/**
 * Main POS page — the default route ("/").
 *
 * Wires useRecipes data into ProductGrid.
 * Cart integration (step 3.2) and BaristaSelector (step 3.3) will be added
 * in subsequent phases.
 */
export function PosPage() {
  const { recipes, isLoading, isError, error, refetch } = useRecipes()

  /**
   * Stable callback — will be passed down to ProductCard.
   * Cart dispatch will be added here in step 3.2.
   */
  const handleProductSelect = useCallback((recipe: RecipeDTO) => {
    // TODO (step 3.2): dispatch addItem action to cart store
    console.info('[PosPage] product selected:', recipe.name)
  }, [])

  const errorMessage =
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
          errorMessage={errorMessage}
          onRetry={refetch}
          onProductSelect={handleProductSelect}
        />
      }
      cart={
        <div className="flex items-center justify-center h-full text-stone-400 text-sm px-4 text-center">
          Cart — coming in step 3.2
        </div>
      }
    />
  )
}
