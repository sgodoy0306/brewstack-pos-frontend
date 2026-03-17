import { useState, useEffect, useCallback, useRef } from 'react'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useCreateBarista } from '../../hooks/useBaristas'

interface AddBaristaModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a barista is successfully created. Receives the new barista name. */
  onSuccess?: (name: string) => void
}

/**
 * Two-screen modal for adding a new barista.
 *
 * Screen 1 — Form: single name input + "Add" button.
 * Screen 2 — Success: green checkmark circle + created barista name + "Done" button.
 *
 * Resets all local state each time `isOpen` transitions to true.
 * Backdrop click closes the modal only when no mutation is in flight.
 */
export function AddBaristaModal({ isOpen, onClose, onSuccess }: AddBaristaModalProps) {
  const [name, setName] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdName, setCreatedName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: createBarista, isPending } = useCreateBarista()

  // Reset form state every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setName('')
      setShowSuccess(false)
      setCreatedName('')
    }
  }, [isOpen])

  // Auto-focus the input when the form screen is active.
  useEffect(() => {
    if (isOpen && !showSuccess) {
      // Small delay to let the DOM settle after the modal mounts.
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showSuccess])

  const handleAdd = useCallback(() => {
    const trimmedName = name.trim()
    if (!trimmedName || isPending) return

    createBarista(
      { name: trimmedName },
      {
        onSuccess: (barista) => {
          setCreatedName(barista.name)
          setShowSuccess(true)
          onSuccess?.(barista.name)
        },
      },
    )
  }, [name, isPending, createBarista, onSuccess])

  const handleDone = useCallback(() => {
    setShowSuccess(false)
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback(() => {
    if (!isPending) onClose()
  }, [isPending, onClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleAdd()
    },
    [handleAdd],
  )

  if (!isOpen) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-barista-modal-title"
      onClick={handleBackdropClick}
    >
      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Success screen ── */}
        {showSuccess ? (
          <>
            <div className="text-center flex flex-col items-center gap-3">
              {/* Green checkmark circle */}
              <div
                className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-white text-3xl font-bold select-none">✓</span>
              </div>

              <h2
                id="add-barista-modal-title"
                className="text-xl font-bold text-stone-100"
              >
                Barista added!
              </h2>
              <p className="text-stone-400 text-sm">
                <strong className="text-stone-100">{createdName}</strong> has been added to the team.
              </p>
            </div>

            <PosButton variant="primary" fullWidth onClick={handleDone}>
              Done
            </PosButton>
          </>
        ) : (
          /* ── Form screen ── */
          <>
            {/* Header */}
            <div>
              <h2
                id="add-barista-modal-title"
                className="text-xl font-bold text-stone-100"
              >
                Add Barista
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Enter the name for the new barista.
              </p>
            </div>

            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="barista-name-input"
                className="text-sm font-semibold text-stone-300"
              >
                Name
              </label>
              <input
                ref={inputRef}
                id="barista-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                placeholder="e.g. Alex"
                maxLength={80}
                className={[
                  'min-h-[60px] px-4 rounded-xl text-base text-stone-100',
                  'bg-stone-700 border-2 border-stone-600',
                  'placeholder:text-stone-500',
                  'focus:outline-none focus:border-amber-500',
                  'transition-colors duration-100',
                  isPending ? 'opacity-40 cursor-not-allowed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label="Barista name"
              />
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
                onClick={handleAdd}
                disabled={!name.trim() || isPending}
                aria-label={
                  name.trim()
                    ? `Add barista named ${name.trim()}`
                    : 'Enter a name first'
                }
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Adding…
                  </span>
                ) : (
                  'Add'
                )}
              </PosButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
