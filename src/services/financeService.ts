import apiClient from '../api/axios'
import type { DailyBalanceDTO, FinanceHistoryPage } from '../types/finance'

/** Parameters accepted by the paginated finance history endpoint. */
export interface FinanceHistoryParams {
  page?: number
  size?: number
}

/**
 * Fetches the daily revenue and order summary for the current day.
 * @returns The DailyBalanceDTO for today.
 */
export async function getDailyReport(): Promise<DailyBalanceDTO> {
  const response = await apiClient.get<DailyBalanceDTO>('/finance/daily-report')
  return response.data
}

/**
 * Fetches a paginated history of daily balance records.
 * @param params - Optional pagination parameters.
 * @returns A FinanceHistoryPage with balance records and pagination metadata.
 */
export async function getFinanceHistory(params: FinanceHistoryParams = {}): Promise<FinanceHistoryPage> {
  const { page = 0, size = 30 } = params
  const response = await apiClient.get<FinanceHistoryPage>('/finance/history', {
    params: { page, size },
  })
  return response.data
}
