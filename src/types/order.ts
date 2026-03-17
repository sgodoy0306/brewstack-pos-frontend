export interface BrewOrderRequest {
  recipeIds: number[]
  baristaId: number
}

export interface OrderSummaryDTO {
  brewedRecipes: string[]
  totalRevenue: number
  totalOrders: number
  baristaXp: number
  baristaLevel: number
}
