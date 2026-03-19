import { useState, useCallback } from 'react'
import { NavBar } from '../components/layout/NavBar'
import { BaristaCard } from '../components/baristas/BaristaCard'
import { PracticeModal } from '../components/baristas/PracticeModal'
import { AddBaristaModal } from '../components/baristas/AddBaristaModal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { PosButton } from '../components/ui/PosButton'
import { useBaristas, usePractice } from '../hooks/useBaristas'
import { useToast } from '../context/ToastContext'
import type { BaristaDTO } from '../types/barista'

/**
 * Baristas management page — route "/baristas".
 *
 * Displays a responsive grid of all baristas with their level and XP.
 * Tapping "Practice" on a card opens the PracticeModal for that barista.
 * After submitting a rating, the modal shows the XP/level result returned
 * by the API before closing. Practice outcome is also echoed via toast.
 */
export function BaristasPage() {
  const [selectedBarista, setSelectedBarista] = useState<BaristaDTO | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { baristas, isLoading, isError, error, refetch } = useBaristas()
  const { practice, isPending, levelUpResult } = usePractice()
  const { showSuccess, showError } = useToast()

  // Stable callbacks — prevent unnecessary child re-renders.
  const handlePracticeClick = useCallback((barista: BaristaDTO) => {
    setSelectedBarista(barista)
  }, [])

  const handleModalClose = useCallback(() => {
    if (!isPending) setSelectedBarista(null)
  }, [isPending])

  const handlePracticeConfirm = useCallback(
    (baristaId: number, rating: number) => {
      const baristaName = selectedBarista?.name ?? 'Barista'
      practice(
        { baristaId, request: { rating } },
        {
          onSuccess: (result) => {
            // LevelUpDTO.message already describes the outcome (e.g. "Level up!" or XP earned)
            showSuccess(`${baristaName} — ${result.message} (Level ${result.newLevel})`)
          },
          onError: (err) => {
            const message =
              (err as { message?: string })?.message ?? 'Practice session failed. Please try again.'
            showError(message)
          },
        },
      )
    },
    [practice, selectedBarista, showSuccess, showError],
  )

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-100">
      <NavBar />

      <main className="flex-1 flex flex-col overflow-hidden" aria-label="Barista management">
        {/* Page header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-xl">👤</span>
            <h1 className="text-xl font-bold text-stone-900">Baristas</h1>
            {!isLoading && !isError && baristas.length > 0 && (
              <span className="text-sm text-stone-400 font-medium">
                {baristas.length} barista{baristas.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <PosButton variant="primary" onClick={() => setIsAddOpen(true)}>
            + Add Barista
          </PosButton>
        </div>

        {/* Content area — scrollable barista grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <ErrorMessage
              message={
                (error as { message?: string })?.message ??
                'Failed to load baristas. Please try again.'
              }
              onRetry={refetch}
            />
          )}

          {/* Empty state */}
          {!isLoading && !isError && baristas.length === 0 && (
            <div className="flex items-center justify-center h-48 text-stone-400 text-lg">
              No baristas found.
            </div>
          )}

          {/* Barista grid — 2 cols on small, 3 on medium, 4 on wide landscape tablets */}
          {!isLoading && !isError && baristas.length > 0 && (
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              role="list"
              aria-label="Barista list"
            >
              {baristas.map((barista) => (
                <div key={barista.id} role="listitem">
                  <BaristaCard
                    barista={barista}
                    onPracticeClick={handlePracticeClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Practice modal — rendered at page level so it overlays everything */}
      <PracticeModal
        barista={selectedBarista}
        isPending={isPending}
        levelUpResult={levelUpResult}
        onConfirm={handlePracticeConfirm}
        onClose={handleModalClose}
      />

      {/* Add barista modal */}
      <AddBaristaModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={(newName) => showSuccess(`${newName} has been added to the team.`)}
      />
    </div>
  )
}
