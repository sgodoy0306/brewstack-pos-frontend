import { useState } from 'react'
import { NavBar } from '../components/layout/NavBar'
import { DailyReportCard } from '../components/finance/DailyReportCard'
import { HistoryTable } from '../components/finance/HistoryTable'
import { useDailyReport, useFinanceHistory } from '../hooks/useFinance'

const HISTORY_PAGE_SIZE = 15

/**
 * Finance page — route "/finance".
 *
 * Layout: full-screen column split into two sections.
 *   - Top: DailyReportCard — today's revenue summary, auto-refreshes every 30 s.
 *   - Bottom: HistoryTable — paginated list of past daily balance records.
 *
 * Each section manages its own loading/error state independently so a failure
 * in one section does not block the other.
 */
export function FinancePage() {
  const [historyPage, setHistoryPage] = useState(0)

  // Daily report — auto-refreshes via the hook's refetchInterval
  const {
    dailyReport,
    isLoading: isDailyLoading,
    isError: isDailyError,
    error: dailyError,
    refetch: refetchDaily,
  } = useDailyReport()

  // Finance history — paginated
  const {
    records,
    currentPage,
    totalPages,
    totalElements,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
  } = useFinanceHistory({ page: historyPage, size: HISTORY_PAGE_SIZE })

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-100">
      <NavBar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="flex items-center px-6 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-xl">💰</span>
            <h1 className="text-xl font-bold text-stone-900">Finance</h1>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Today's summary — always shown at the top */}
          <DailyReportCard
            report={dailyReport}
            isLoading={isDailyLoading}
            isError={isDailyError}
            errorMessage={
              (dailyError as { message?: string })?.message ??
              'Failed to load daily report.'
            }
            onRetry={refetchDaily}
          />

          {/* Historical records table */}
          <HistoryTable
            records={records}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            isLoading={isHistoryLoading}
            isError={isHistoryError}
            errorMessage={
              (historyError as { message?: string })?.message ??
              'Failed to load finance history.'
            }
            onPageChange={setHistoryPage}
            onRetry={refetchHistory}
          />
        </div>
      </main>
    </div>
  )
}
