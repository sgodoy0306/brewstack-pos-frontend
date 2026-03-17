import { useMemo } from 'react'
import type { PastryDTO } from '../../types/pastry'
import { PastryCard } from './PastryCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

interface PastriesGridProps {
  pastries: PastryDTO[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry?: () => void
  onDetail: (pastry: PastryDTO) => void
}

/**
 * Grid of pastry cards — mirrors ProductGrid layout and state handling
 * for visual consistency between the two catalog tabs.
 *
 * Grid layout: 3 columns on narrow landscape tablets, 4 on wider screens.
 * Cards are memoized via PastryCard to prevent re-renders on cart updates.
 */
export function PastriesGrid({
  pastries,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onDetail,
}: PastriesGridProps) {
  const stablePastries = useMemo(() => pastries, [pastries])

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // --- Error state ---
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-sm">
          <ErrorMessage
            message={errorMessage ?? 'Could not load pastries. Please try again.'}
            onRetry={onRetry}
          />
        </div>
      </div>
    )
  }

  // --- Empty state ---
  if (stablePastries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400">
        <span className="text-5xl" aria-hidden="true">
          🥐
        </span>
        <p className="text-lg font-medium">No pastries available</p>
        <p className="text-sm">Add pastries using the "+ Add Pastry" button above.</p>
      </div>
    )
  }

  // --- Populated grid ---
  return (
    <section aria-label="Pastries catalog" className="p-4 h-full overflow-y-auto">
      <ul className="grid grid-cols-3 xl:grid-cols-4 gap-4" role="list">
        {stablePastries.map((pastry) => (
          <li key={pastry.id} role="listitem">
            <PastryCard pastry={pastry} onDetail={onDetail} />
          </li>
        ))}
      </ul>
    </section>
  )
}
