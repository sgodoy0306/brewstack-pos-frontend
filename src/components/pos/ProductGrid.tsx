import { useMemo } from 'react'
import type { RecipeDTO } from '../../types/recipe'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

interface ProductGridProps {
  recipes: RecipeDTO[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry?: () => void
  onProductSelect: (recipe: RecipeDTO) => void
}

/**
 * Virtualization note: React's default DOM rendering is sufficient for the
 * typical coffee menu size (< 50 items). A windowing library would add bundle
 * weight with negligible gain. Revisit if the catalog grows beyond ~100 items.
 *
 * Grid layout: 3 columns on narrow landscape tablets, 4 on wider screens.
 * All items are memoized via ProductCard to prevent unnecessary re-renders
 * when the cart state updates.
 */
export function ProductGrid({
  recipes,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onProductSelect,
}: ProductGridProps) {
  /**
   * Stable reference for the recipe list — avoids grid re-mounts when the
   * parent re-renders for unrelated reasons (e.g., cart updates).
   */
  const stableRecipes = useMemo(() => recipes, [recipes])

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // --- Error state ---
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-sm">
          <ErrorMessage
            message={errorMessage ?? 'Could not load the product catalog. Please try again.'}
            onRetry={onRetry}
          />
        </div>
      </div>
    )
  }

  // --- Empty state ---
  if (stableRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400">
        <span className="text-5xl" aria-hidden="true">
          ☕
        </span>
        <p className="text-lg font-medium">No products available</p>
        <p className="text-sm">Add recipes from the back-office to start selling.</p>
      </div>
    )
  }

  // --- Populated catalog ---
  return (
    <section aria-label="Product catalog" className="p-4 h-full overflow-y-auto">
      <ul
        className="grid grid-cols-3 xl:grid-cols-4 gap-4"
        role="list"
      >
        {stableRecipes.map((recipe) => (
          <li key={recipe.id} role="listitem">
            <ProductCard recipe={recipe} onSelect={onProductSelect} />
          </li>
        ))}
      </ul>
    </section>
  )
}
