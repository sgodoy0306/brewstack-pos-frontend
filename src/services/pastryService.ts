import apiClient from '../api/axios'
import type { PastryDTO, CreatePastryRequest } from '../types/pastry'

/**
 * Fetches all pastries from the API.
 * @returns A list of all available pastries.
 */
export async function getPastries(): Promise<PastryDTO[]> {
  const response = await apiClient.get<PastryDTO[]>('/pastries')
  return response.data
}

/**
 * Creates a new pastry.
 * @param payload - The pastry creation payload.
 * @returns The newly created PastryDTO (HTTP 201).
 */
export async function createPastry(payload: CreatePastryRequest): Promise<PastryDTO> {
  const response = await apiClient.post<PastryDTO>('/pastries', payload)
  return response.data
}
