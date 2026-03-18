export interface BrewOrderRequest {
  recipeIds: number[]
  /** Optional — when omitted or null the order is processed without a barista assignment. */
  baristaId?: number | null
}

export interface OrderSummaryDTO {
  brewedRecipes: string[]
  totalRevenue: number
  totalOrders: number
  baristaXp: number
  baristaLevel: number
}
