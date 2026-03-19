export interface DailyBalanceDTO {
  date: string
  totalRevenue: number
  totalOrders: number
}

export interface FinanceHistoryPage {
  content: DailyBalanceDTO[]
  totalElements: number
  totalPages: number
  number: number
}
