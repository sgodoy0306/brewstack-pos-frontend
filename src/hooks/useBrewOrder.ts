import { useMutation, useQueryClient } from '@tanstack/react-query'
import { placeBrewOrder } from '../services/brewService'
import type { BrewOrderRequest, OrderSummaryDTO } from '../types/order'
import type { ApiErrorResponse } from '../types/error'

/**
 * Mutation to submit a brew order.
 *
 * On success it invalidates:
 * - 'stock' and 'lowStock' — ingredients are consumed by the order.
 * - 'baristas' and any individual 'barista' entries — XP is awarded to the
 *   assigned barista.
 * - 'dailyReport' — revenue totals change with every order.
 *
 * Components call `placeOrder` with a BrewOrderRequest and receive an
 * OrderSummaryDTO describing revenue, XP gained, and brewed recipes.
 */
export function useBrewOrder() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isError, error, data } = useMutation<
    OrderSummaryDTO,
    ApiErrorResponse,
    BrewOrderRequest
  >({
    mutationFn: placeBrewOrder,
    onSuccess: (_result, variables) => {
      // Stock levels drop when ingredients are consumed by the brew.
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['lowStock'] })

      // Refresh the assigned barista's record only when one was provided.
      // When baristaId is null/undefined the order had no barista — skip the
      // individual record invalidation to avoid a redundant cache miss.
      if (variables.baristaId != null) {
        queryClient.invalidateQueries({ queryKey: ['barista', variables.baristaId] })
      }
      queryClient.invalidateQueries({ queryKey: ['baristas'] })

      // Revenue for the day changes after every order.
      queryClient.invalidateQueries({ queryKey: ['dailyReport'] })
    },
  })

  return {
    placeOrder: mutate,
    placeOrderAsync: mutateAsync,
    orderSummary: data,
    isPending,
    isError,
    error,
  }
}
