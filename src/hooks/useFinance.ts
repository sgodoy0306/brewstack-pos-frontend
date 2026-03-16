import { useQuery } from '@tanstack/react-query'
import { getDailyReport, getFinanceHistory } from '../services/financeService'
import type { FinanceHistoryParams } from '../services/financeService'
import type { DailyBalanceDTO, FinanceHistoryPage } from '../types/finance'
import type { ApiErrorResponse } from '../types/error'

/**
 * Fetches the revenue and order summary for the current day.
 * Refetches every 30 seconds so the POS screen stays current during a shift
 * without requiring a manual refresh.
 */
export function useDailyReport() {
  const { data, isLoading, isError, error } = useQuery<DailyBalanceDTO, ApiErrorResponse>({
    queryKey: ['dailyReport'],
    queryFn: getDailyReport,
    refetchInterval: 30_000,
  })

  return {
    dailyReport: data,
    isLoading,
    isError,
    error,
  }
}

/**
 * Fetches a paginated history of daily balance records.
 * Accepts optional pagination parameters; defaults match the service layer.
 *
 * @param params - Optional page and size parameters forwarded to the API.
 */
export function useFinanceHistory(params: FinanceHistoryParams = {}) {
  const { data, isLoading, isError, error } = useQuery<FinanceHistoryPage, ApiErrorResponse>({
    queryKey: ['financeHistory', params],
    queryFn: () => getFinanceHistory(params),
  })

  return {
    historyPage: data,
    records: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.number ?? 0,
    isLoading,
    isError,
    error,
  }
}
