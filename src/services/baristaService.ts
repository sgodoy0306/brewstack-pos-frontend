import apiClient from '../api/axios'
import type { BaristaDTO, LevelUpDTO, PracticeRequest } from '../types/barista'

/**
 * Fetches all baristas from the API.
 * @returns A list of all baristas.
 */
export async function getBaristas(): Promise<BaristaDTO[]> {
  const response = await apiClient.get<BaristaDTO[]>('/baristas')
  return response.data
}

/**
 * Fetches a single barista by their ID.
 * @param id - The barista ID.
 * @returns The matching BaristaDTO.
 */
export async function getBaristaById(id: number): Promise<BaristaDTO> {
  const response = await apiClient.get<BaristaDTO>(`/baristas/${id}`)
  return response.data
}

/**
 * Creates a new barista.
 * @param payload - The barista creation payload.
 * @returns The newly created BaristaDTO (HTTP 201).
 */
export async function createBarista(payload: Omit<BaristaDTO, 'id'>): Promise<BaristaDTO> {
  const response = await apiClient.post<BaristaDTO>('/baristas', payload)
  return response.data
}

/**
 * Updates an existing barista by their ID.
 * @param id - The barista ID to update.
 * @param payload - The updated barista data.
 * @returns The updated BaristaDTO.
 */
export async function updateBarista(id: number, payload: Omit<BaristaDTO, 'id'>): Promise<BaristaDTO> {
  const response = await apiClient.put<BaristaDTO>(`/baristas/${id}`, payload)
  return response.data
}

/**
 * Deletes a barista by their ID.
 * @param id - The barista ID to delete.
 * @returns void (HTTP 204).
 */
export async function deleteBarista(id: number): Promise<void> {
  await apiClient.delete(`/baristas/${id}`)
}

/**
 * Records a practice session for a barista and returns the XP/level result.
 * @param id - The barista ID.
 * @param payload - The practice payload containing a rating from 1 to 10.
 * @returns The LevelUpDTO with updated XP and level information.
 */
export async function practiceBarista(id: number, payload: PracticeRequest): Promise<LevelUpDTO> {
  const response = await apiClient.post<LevelUpDTO>(`/baristas/${id}/practice`, payload)
  return response.data
}
