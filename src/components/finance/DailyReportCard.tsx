import { LoadingSpinner } from '../ui/LoadingSpinner'
import type { DailyBalanceDTO } from '../../types/finance'

interface DailyReportCardProps {
  report: DailyBalanceDTO | undefined
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry?: () => void
}

interface StatBlockProps {
  label: string
  value: string
  accent?: boolean
}

/** Single metric block within the daily report card. */
function StatBlock({ label, value, accent = false }: StatBlockProps) {
  return (
    <div className="flex flex-col gap-1 px-8 py-5 flex-1 min-w-[160px]">
      <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">{label}</span>
      <span
        className={[
          'text-3xl font-bold leading-none',
          accent ? 'text-amber-700' : 'text-stone-900',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * Card displaying today's revenue and order count.
 * Refetches every 30 s via the hook — shows a subtle "Live" indicator.
 * All three states (loading, error, data) are handled explicitly.
 */
export function DailyReportCard({
  report,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: DailyReportCardProps) {
  const formattedDate = report
    ? new Date(report.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <div
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
      aria-label="Daily revenue report"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-xl">💰</span>
          <h2 className="text-base font-bold text-stone-800">Today's Report</h2>
          {!isLoading && !isError && (
            <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Live
            </span>
          )}
        </div>
        <span className="text-sm text-stone-500">{formattedDate}</span>
      </div>

      {/* Card body */}
      {isLoading && (
        <div className="flex items-center justify-center h-[100px]">
          <LoadingSpinner size="md" />
        </div>
      )}

      {isError && !isLoading && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 px-8 py-5"
        >
          <p className="text-red-600 text-sm font-medium">
            {errorMessage ?? 'Failed to load daily report.'}
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

      {!isLoading && !isError && report && (
        <div className="flex divide-x divide-stone-100">
          <StatBlock
            label="Total Revenue"
            value={`$${report.totalRevenue.toFixed(2)}`}
            accent
          />
          <StatBlock
            label="Orders"
            value={String(report.totalOrders)}
          />
          <StatBlock
            label="Avg. Order Value"
            value={
              report.totalOrders > 0
                ? `$${(report.totalRevenue / report.totalOrders).toFixed(2)}`
                : '$0.00'
            }
          />
        </div>
      )}
    </div>
  )
}
