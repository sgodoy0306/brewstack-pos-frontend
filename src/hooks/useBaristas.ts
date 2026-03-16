import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBaristas, getBaristaById, practiceBarista } from '../services/baristaService'
import type { BaristaDTO, LevelUpDTO, PracticeRequest } from '../types/barista'
import type { ApiErrorResponse } from '../types/error'

/**
 * Fetches the full list of baristas.
 * Returns typed data, loading state, and error state — no business logic.
 */
export function useBaristas() {
  const { data, isLoading, isError, error } = useQuery<BaristaDTO[], ApiErrorResponse>({
    queryKey: ['baristas'],
    queryFn: getBaristas,
  })

  return {
    baristas: data ?? [],
    isLoading,
    isError,
    error,
  }
}

/**
 * Fetches a single barista by their numeric ID.
 * The query is disabled when no valid ID is provided.
 *
 * @param id - The barista ID to fetch. Pass undefined or null to skip the query.
 */
export function useBarista(id: number | undefined | null) {
  const { data, isLoading, isError, error } = useQuery<BaristaDTO, ApiErrorResponse>({
    queryKey: ['barista', id],
    queryFn: () => getBaristaById(id as number),
    enabled: id != null,
  })

  return {
    barista: data,
    isLoading,
    isError,
    error,
  }
}

/** Payload shape expected by the usePractice mutation. */
export interface PracticePayload {
  baristaId: number
  request: PracticeRequest
}

/**
 * Mutation to record a practice session for a barista.
 * Invalidates the affected barista query and the full baristas list on success
 * so XP and level values stay in sync across the UI.
 */
export function usePractice() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isError, error, data } = useMutation<
    LevelUpDTO,
    ApiErrorResponse,
    PracticePayload
  >({
    mutationFn: ({ baristaId, request }) => practiceBarista(baristaId, request),
    onSuccess: (_result, variables) => {
      // Refresh the individual barista so their XP/level updates immediately.
      queryClient.invalidateQueries({ queryKey: ['barista', variables.baristaId] })
      // Refresh the full list in case it is rendered elsewhere on screen.
      queryClient.invalidateQueries({ queryKey: ['baristas'] })
    },
  })

  return {
    practice: mutate,
    practiceAsync: mutateAsync,
    levelUpResult: data,
    isPending,
    isError,
    error,
  }
}
