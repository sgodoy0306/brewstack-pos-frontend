export interface IngredientDTO {
  id: number
  name: string
  currentStock: number
  minimumThreshold: number
  unit: string
}

export interface RestockRequest {
  amount: number
}

export interface StockPage {
  content: IngredientDTO[]
  totalElements: number
  totalPages: number
  number: number
}
