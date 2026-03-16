import apiClient from '../api/axios'
import type { BrewOrderRequest, OrderSummaryDTO } from '../types/order'

/**
 * Submits a brew order for one or more recipes assigned to a barista.
 * @param payload - The order payload containing recipeIds and baristaId.
 * @returns The OrderSummaryDTO with revenue, XP, and brewed recipe details.
 */
export async function placeBrewOrder(payload: BrewOrderRequest): Promise<OrderSummaryDTO> {
  const response = await apiClient.post<OrderSummaryDTO>('/brew/order', payload)
  return response.data
}
