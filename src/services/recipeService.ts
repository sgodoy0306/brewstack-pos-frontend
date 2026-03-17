import apiClient from '../api/axios'
import type { RecipeDTO, CreateRecipeRequest } from '../types/recipe'

/**
 * Fetches all recipes from the API.
 * @returns A list of all available recipes.
 */
export async function getRecipes(): Promise<RecipeDTO[]> {
  const response = await apiClient.get<RecipeDTO[]>('/recipes')
  return response.data
}

/**
 * Fetches a single recipe by its ID.
 * @param id - The recipe ID.
 * @returns The matching RecipeDTO.
 */
export async function getRecipeById(id: number): Promise<RecipeDTO> {
  const response = await apiClient.get<RecipeDTO>(`/recipes/${id}`)
  return response.data
}

/**
 * Creates a new recipe.
 * @param payload - The recipe creation payload.
 * @returns The newly created RecipeDTO (HTTP 201).
 */
export async function createRecipe(payload: CreateRecipeRequest): Promise<RecipeDTO> {
  const response = await apiClient.post<RecipeDTO>('/recipes', payload)
  return response.data
}

/**
 * Updates an existing recipe by its ID.
 * @param id - The recipe ID to update.
 * @param payload - The updated recipe data.
 * @returns The updated RecipeDTO.
 */
export async function updateRecipe(id: number, payload: CreateRecipeRequest): Promise<RecipeDTO> {
  const response = await apiClient.put<RecipeDTO>(`/recipes/${id}`, payload)
  return response.data
}

/**
 * Deletes a recipe by its ID.
 * @param id - The recipe ID to delete.
 * @returns void (HTTP 204).
 */
export async function deleteRecipe(id: number): Promise<void> {
  await apiClient.delete(`/recipes/${id}`)
}
