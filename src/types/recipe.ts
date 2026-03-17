export interface RecipeIngredient {
  ingredientName: string
  unit: string
  quantityRequired: number
}

export interface RecipeDTO {
  id: number
  name: string
  baseXpReward: number
  price: number
  imageUrl: string
  description: string
  ingredients: RecipeIngredient[]
}

export interface CreateRecipeRequest {
  name: string
  baseXpReward: number
  price: number
  imageUrl: string
  ingredients: { ingredientId: number; quantity: number }[]
}
