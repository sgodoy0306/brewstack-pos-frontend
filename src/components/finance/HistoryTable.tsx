import { LoadingSpinner } from '../ui/LoadingSpinner'
import type { DailyBalanceDTO } from '../../types/finance'

interface HistoryTableProps {
  records: DailyBalanceDTO[]
  currentPage: number
  totalPages: number
  totalElements: number
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onPageChange: (page: number) => void
  onRetry?: () => void
}

interface TableRowProps {
  record: DailyBalanceDTO
  index: number
}

/** Single row in the history table. */
function TableRow({ record, index }: TableRowProps) {
  const formattedDate = new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const avgOrderValue =
    record.totalOrders > 0
      ? `$${(record.totalRevenue / record.totalOrders).toFixed(2)}`
      : '$0.00'

  return (
    <tr
      className={[
        'border-b border-stone-100 transition-colors duration-75',
        index % 2 === 0 ? 'bg-white' : 'bg-stone-50',
        'hover:bg-amber-50',
      ].join(' ')}
    >
      <td className="px-6 py-4 text-sm text-stone-700 font-medium whitespace-nowrap">
        {formattedDate}
      </td>
      <td className="px-6 py-4 text-sm font-bold text-amber-700 text-right whitespace-nowrap">
        ${record.totalRevenue.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-sm text-stone-700 text-right whitespace-nowrap">
        {record.totalOrders}
      </td>
      <td className="px-6 py-4 text-sm text-stone-500 text-right whitespace-nowrap">
        {avgOrderValue}
      </td>
    </tr>
  )
}

/**
 * Paginated table of daily balance records.
 * Touch-optimised pagination buttons (min-h-[60px]).
 * Handles loading, error, and empty states without blocking navigation.
 */
export function HistoryTable({
  records,
  currentPage,
  totalPages,
  totalElements,
  isLoading,
  isError,
  errorMessage,
  onPageChange,
  onRetry,
}: HistoryTableProps) {
  const hasPrev = currentPage > 0
  const hasNext = currentPage < totalPages - 1

  return (
    <div
      className="flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden"
      aria-label="Finance history table"
    >
      {/* Table header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50 shrink-0">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-xl">📅</span>
          <h2 className="text-base font-bold text-stone-800">Revenue History</h2>
        </div>
        {!isLoading && !isError && totalElements > 0 && (
          <span className="text-sm text-stone-500">
            {totalElements} record{totalElements !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 p-8 text-center"
        >
          <span className="text-red-500 text-2xl" aria-hidden="true">⚠</span>
          <p className="text-red-600 text-sm font-medium">
            {errorMessage ?? 'Failed to load finance history.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="min-h-[44px] px-5 rounded-xl bg-red-600 text-white text-sm font-semibold
                         hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-100 cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && records.length === 0 && (
        <div className="flex items-center justify-center h-48 text-stone-400 text-base">
          No history records found.
        </div>
      )}

      {/* Table — only rendered when data is available */}
      {!isLoading && !isError && records.length > 0 && (
        <div className="overflow-x-auto flex-1">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Avg. Order
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <TableRow key={record.date} record={record} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination footer — only shown when there are multiple pages */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100 bg-stone-50 shrink-0">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={!hasPrev || isLoading}
            className={[
              'min-h-[60px] min-w-[120px] px-5 rounded-xl font-semibold text-sm',
              'transition-all duration-100 select-none',
              !hasPrev || isLoading
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400 active:scale-95 cursor-pointer',
            ].join(' ')}
            aria-label="Previous page"
          >
            Previous
          </button>

          <span className="text-sm text-stone-500 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={!hasNext || isLoading}
            className={[
              'min-h-[60px] min-w-[120px] px-5 rounded-xl font-semibold text-sm',
              'transition-all duration-100 select-none',
              !hasNext || isLoading
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400 active:scale-95 cursor-pointer',
            ].join(' ')}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
