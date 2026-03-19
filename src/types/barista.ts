export interface BaristaDTO {
  id: number
  name: string
  level: number
  totalXp: number
}

export interface LevelUpDTO {
  newLevel: number
  totalXp: number
  message: string
}

export interface PracticeRequest {
  rating: number
}
