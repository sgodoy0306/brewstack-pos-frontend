export interface PastryDTO {
  id: number
  name: string
  description: string
  price: number
  available: boolean
}

export interface CreatePastryRequest {
  name: string
  description: string
  price: number
  available: boolean
}
