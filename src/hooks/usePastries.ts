import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPastries, createPastry } from '../services/pastryService'
import type { PastryDTO, CreatePastryRequest } from '../types/pastry'
import type { ApiErrorResponse } from '../types/error'

/**
 * Fetches the full list of pastries.
 * Returns typed data, loading state, and error state — no business logic.
 */
export function usePastries() {
  const { data, isLoading, isError, error, refetch } = useQuery<PastryDTO[], ApiErrorResponse>({
    queryKey: ['pastries'],
    queryFn: getPastries,
  })

  return {
    pastries: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  }
}

/**
 * Mutation to create a new pastry.
 * Invalidates the pastries list on success so the grid updates immediately.
 */
export function useCreatePastry() {
  const queryClient = useQueryClient()
  return useMutation<PastryDTO, ApiErrorResponse, CreatePastryRequest>({
    mutationFn: (payload) => createPastry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastries'] })
    },
  })
}
