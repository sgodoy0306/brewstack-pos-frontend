import apiClient from '../api/axios'
import type { IngredientDTO, RestockRequest, StockPage } from '../types/stock'

/** Parameters accepted by the paginated stock list endpoint. */
export interface StockListParams {
  page?: number
  size?: number
  sort?: string
}

/**
 * Fetches a paginated list of all stock ingredients.
 * @param params - Optional pagination and sorting parameters.
 * @returns A StockPage containing ingredient records and pagination metadata.
 */
export async function getStock(params: StockListParams = {}): Promise<StockPage> {
  const { page = 0, size = 20, sort = 'name' } = params
  const response = await apiClient.get<StockPage>('/stock', {
    params: { page, size, sort },
  })
  return response.data
}

/**
 * Fetches all ingredients whose current stock is below the minimum threshold.
 * @returns A list of low-stock IngredientDTOs.
 */
export async function getLowStock(): Promise<IngredientDTO[]> {
  const response = await apiClient.get<IngredientDTO[]>('/stock/low')
  return response.data
}

/**
 * Restocks a specific ingredient by adding the given amount to its current stock.
 * @param id - The ingredient ID to restock.
 * @param payload - The restock payload containing the amount to add.
 * @returns The updated IngredientDTO.
 */
export async function restockIngredient(id: number, payload: RestockRequest): Promise<IngredientDTO> {
  const response = await apiClient.patch<IngredientDTO>(`/stock/${id}/restock`, payload)
  return response.data
}
