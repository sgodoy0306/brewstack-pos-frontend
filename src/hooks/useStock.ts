import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getStock, getLowStock, restockIngredient } from '../services/stockService'
import type { StockListParams } from '../services/stockService'
import type { IngredientDTO, RestockRequest, StockPage } from '../types/stock'
import type { ApiErrorResponse } from '../types/error'

/**
 * Fetches a paginated list of all stock ingredients.
 * Accepts optional pagination/sort parameters; defaults match the service layer.
 *
 * @param params - Optional page, size, and sort parameters forwarded to the API.
 */
export function useStock(params: StockListParams = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery<StockPage, ApiErrorResponse>({
    queryKey: ['stock', params],
    queryFn: () => getStock(params),
  })

  return {
    stockPage: data,
    ingredients: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.number ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  }
}

/**
 * Fetches all ingredients whose current stock is below the minimum threshold.
 * This query refetches every 60 seconds to surface low-stock alerts promptly
 * without requiring a manual refresh from the barista.
 */
export function useLowStock() {
  const { data, isLoading, isError, error } = useQuery<IngredientDTO[], ApiErrorResponse>({
    queryKey: ['lowStock'],
    queryFn: getLowStock,
    refetchInterval: 60_000,
  })

  return {
    lowStockIngredients: data ?? [],
    hasLowStock: (data?.length ?? 0) > 0,
    isLoading,
    isError,
    error,
  }
}

/** Payload shape expected by the useRestock mutation. */
export interface RestockPayload {
  ingredientId: number
  request: RestockRequest
}

/**
 * Mutation to restock a specific ingredient.
 * Invalidates both the paginated stock list and the low-stock list on success
 * so all views reflect the updated quantities immediately.
 */
export function useRestock() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isError, error, data } = useMutation<
    IngredientDTO,
    ApiErrorResponse,
    RestockPayload
  >({
    mutationFn: ({ ingredientId, request }) => restockIngredient(ingredientId, request),
    onSuccess: () => {
      // Invalidate all stock query variants regardless of pagination params.
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['lowStock'] })
    },
  })

  return {
    restock: mutate,
    restockAsync: mutateAsync,
    updatedIngredient: data,
    isPending,
    isError,
    error,
  }
}
