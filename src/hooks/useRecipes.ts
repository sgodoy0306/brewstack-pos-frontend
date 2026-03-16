import { useQuery } from '@tanstack/react-query'
import { getRecipes, getRecipeById } from '../services/recipeService'
import type { RecipeDTO } from '../types/recipe'
import type { ApiErrorResponse } from '../types/error'

/**
 * Fetches the full list of available recipes.
 * Returns typed data, loading state, and error state — no business logic.
 */
export function useRecipes() {
  const { data, isLoading, isError, error } = useQuery<RecipeDTO[], ApiErrorResponse>({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  return {
    recipes: data ?? [],
    isLoading,
    isError,
    error,
  }
}

/**
 * Fetches a single recipe by its numeric ID.
 * The query is disabled when no valid ID is provided.
 *
 * @param id - The recipe ID to fetch. Pass undefined or null to skip the query.
 */
export function useRecipe(id: number | undefined | null) {
  const { data, isLoading, isError, error } = useQuery<RecipeDTO, ApiErrorResponse>({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id as number),
    enabled: id != null,
  })

  return {
    recipe: data,
    isLoading,
    isError,
    error,
  }
}
