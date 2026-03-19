import { useState, useEffect, useCallback } from 'react'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import type { BaristaDTO, LevelUpDTO } from '../../types/barista'

interface PracticeModalProps {
  barista: BaristaDTO | null
  isPending: boolean
  /** The level-up result returned after a successful practice submission. */
  levelUpResult: LevelUpDTO | undefined
  onConfirm: (baristaId: number, rating: number) => void
  onClose: () => void
}

/** Valid rating values: integers from 1 to 10. */
const RATING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

/**
 * Returns background + text classes for a rating button.
 * Low (1-4) → red tones, mid (5-7) → amber, high (8-10) → green.
 */
function getRatingColorClasses(rating: number, isSelected: boolean): string {
  const base = 'transition-all duration-100 active:scale-95 select-none cursor-pointer'

  if (rating <= 4) {
    return isSelected
      ? `${base} bg-red-600 text-white border-red-700 shadow-md`
      : `${base} bg-red-50 text-red-700 border-red-200 hover:bg-red-100`
  }
  if (rating <= 7) {
    return isSelected
      ? `${base} bg-amber-500 text-white border-amber-600 shadow-md`
      : `${base} bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100`
  }
  return isSelected
    ? `${base} bg-green-600 text-white border-green-700 shadow-md`
    : `${base} bg-green-50 text-green-700 border-green-200 hover:bg-green-100`
}

/**
 * Modal for recording a practice session rating (1–10) for a barista.
 *
 * - Opens centered over a backdrop; backdrop click closes the modal.
 * - Rating is selected via a 2-row grid of large touch buttons.
 * - After a successful submission the modal enters a "result" state
 *   showing the XP/level update returned by the API before closing.
 * - Resets all local state each time a new barista is opened.
 */
export function PracticeModal({
  barista,
  isPending,
  levelUpResult,
  onConfirm,
  onClose,
}: PracticeModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Reset state and hide the result screen each time a new barista is opened.
  useEffect(() => {
    if (barista) {
      setSelectedRating(null)
      setShowResult(false)
    }
  }, [barista])

  // Show the result screen when a level-up response arrives.
  useEffect(() => {
    if (levelUpResult && barista) {
      setShowResult(true)
    }
  }, [levelUpResult, barista])

  const handleConfirm = useCallback(() => {
    if (selectedRating === null || !barista) return
    onConfirm(barista.id, selectedRating)
  }, [selectedRating, barista, onConfirm])

  const handleResultClose = useCallback(() => {
    setShowResult(false)
    onClose()
  }, [onClose])

  if (!barista) return null

  return (
    /* Backdrop — closes modal on click (only when not pending) */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="practice-modal-title"
      onClick={!isPending && !showResult ? onClose : undefined}
    >
      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Result screen ── */}
        {showResult && levelUpResult ? (
          <>
            <div className="text-center flex flex-col gap-3">
              <div
                className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300
                           flex items-center justify-center mx-auto"
                aria-hidden="true"
              >
                <span className="text-3xl select-none">★</span>
              </div>

              <h2
                id="practice-modal-title"
                className="text-xl font-bold text-stone-900"
              >
                Practice recorded!
              </h2>
              <p className="text-stone-500 text-sm">{levelUpResult.message}</p>
            </div>

            {/* XP / Level result */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col items-center gap-1 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  Total XP
                </span>
                <span className="text-2xl font-bold text-amber-900">
                  {levelUpResult.totalXp}
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                  Level
                </span>
                <span className="text-2xl font-bold text-stone-900">
                  {levelUpResult.newLevel}
                </span>
              </div>
            </div>

            <PosButton variant="primary" fullWidth onClick={handleResultClose}>
              Done
            </PosButton>
          </>
        ) : (
          /* ── Rating selection screen ── */
          <>
            {/* Header */}
            <div>
              <h2
                id="practice-modal-title"
                className="text-xl font-bold text-stone-900"
              >
                Practice session
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Rating for{' '}
                <strong className="text-stone-700">{barista.name}</strong>
              </p>
            </div>

            {/* Rating grid — 5 columns × 2 rows */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-3">
                Select rating (1 – 10)
              </p>
              <div
                className="grid grid-cols-5 gap-2"
                role="group"
                aria-label="Rating selector"
              >
                {RATING_OPTIONS.map((rating) => {
                  const isSelected = selectedRating === rating
                  return (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      disabled={isPending}
                      className={[
                        'min-h-[60px] rounded-xl border-2 font-bold text-lg',
                        getRatingColorClasses(rating, isSelected),
                        isPending ? 'opacity-40 cursor-not-allowed' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-label={`Rating ${rating}`}
                      aria-pressed={isSelected}
                    >
                      {rating}
                    </button>
                  )
                })}
              </div>

              {/* Selected rating label */}
              {selectedRating !== null && (
                <p
                  className="text-center text-sm text-stone-500 mt-2"
                  role="status"
                  aria-live="polite"
                >
                  Selected:{' '}
                  <strong className="text-stone-700">{selectedRating} / 10</strong>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <PosButton
                variant="secondary"
                fullWidth
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </PosButton>
              <PosButton
                variant="primary"
                fullWidth
                onClick={handleConfirm}
                disabled={selectedRating === null || isPending}
                aria-label={
                  selectedRating !== null
                    ? `Submit practice rating ${selectedRating} for ${barista.name}`
                    : 'Select a rating first'
                }
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Saving…
                  </span>
                ) : (
                  'Submit'
                )}
              </PosButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
