import { useState, useEffect, useCallback, useRef } from 'react'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useCreatePastry } from '../../hooks/usePastries'

interface AddPastryModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a pastry is successfully created. Receives the new pastry name. */
  onSuccess?: (name: string) => void
}

/**
 * Two-screen modal for adding a new pastry.
 *
 * Screen 1 — Form: name, price, description, availability toggle + "Add Pastry" button.
 * Screen 2 — Success: green checkmark + created pastry name + "Done" button.
 *
 * Resets all local state each time `isOpen` transitions to true.
 * Backdrop click closes the modal only when no mutation is in flight.
 */
export function AddPastryModal({ isOpen, onClose, onSuccess }: AddPastryModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [available, setAvailable] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdName, setCreatedName] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const { mutate: createPastry, isPending } = useCreatePastry()

  // Reset form state every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setName('')
      setPrice('')
      setDescription('')
      setAvailable(true)
      setShowSuccess(false)
      setCreatedName('')
    }
  }, [isOpen])

  // Auto-focus the name input when the form screen is active.
  useEffect(() => {
    if (isOpen && !showSuccess) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showSuccess])

  const parsedPrice = parseFloat(price)
  const isFormValid = name.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0

  const handleAdd = useCallback(() => {
    if (!isFormValid || isPending) return

    createPastry(
      {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        available,
      },
      {
        onSuccess: (pastry) => {
          setCreatedName(pastry.name)
          setShowSuccess(true)
          onSuccess?.(pastry.name)
        },
      },
    )
  }, [isFormValid, isPending, createPastry, name, description, parsedPrice, available])

  const handleDone = useCallback(() => {
    setShowSuccess(false)
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback(() => {
    if (!isPending) onClose()
  }, [isPending, onClose])

  const handleNameKeyDown = useCallback(
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
      aria-labelledby="add-pastry-modal-title"
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
                id="add-pastry-modal-title"
                className="text-xl font-bold text-stone-100"
              >
                Pastry added!
              </h2>
              <p className="text-stone-400 text-sm">
                <strong className="text-stone-100">{createdName}</strong> is now available in
                the pastries catalog.
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
                id="add-pastry-modal-title"
                className="text-xl font-bold text-stone-100"
              >
                Add Pastry
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Fill in the details for the new pastry item.
              </p>
            </div>

            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="pastry-name-input"
                className="text-sm font-semibold text-stone-300"
              >
                Name <span className="text-red-400">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="pastry-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                disabled={isPending}
                placeholder="e.g. Almond Croissant"
                maxLength={120}
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
                aria-label="Pastry name"
              />
            </div>

            {/* Price input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="pastry-price-input"
                className="text-sm font-semibold text-stone-300"
              >
                Price <span className="text-red-400">*</span>
              </label>
              <input
                id="pastry-price-input"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isPending}
                placeholder="0.00"
                min={0.01}
                step={0.01}
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
                aria-label="Pastry price"
              />
            </div>

            {/* Description textarea */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="pastry-description-input"
                className="text-sm font-semibold text-stone-300"
              >
                Description{' '}
                <span className="text-stone-500 font-normal">(optional)</span>
              </label>
              <textarea
                id="pastry-description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                placeholder="e.g. Buttery, flaky croissant with almond cream"
                maxLength={255}
                rows={2}
                className={[
                  'px-4 py-3 rounded-xl text-base text-stone-100 resize-none',
                  'bg-stone-700 border-2 border-stone-600',
                  'placeholder:text-stone-500',
                  'focus:outline-none focus:border-amber-500',
                  'transition-colors duration-100',
                  isPending ? 'opacity-40 cursor-not-allowed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label="Pastry description"
              />
            </div>

            {/* Available toggle */}
            <div className="flex items-center justify-between min-h-[52px] px-4 rounded-xl bg-stone-700 border-2 border-stone-600">
              <span className="text-sm font-semibold text-stone-300">Available now</span>
              <button
                type="button"
                role="switch"
                aria-checked={available}
                aria-label="Toggle pastry availability"
                disabled={isPending}
                onClick={() => setAvailable((prev) => !prev)}
                className={[
                  // Track
                  'relative inline-flex w-12 h-7 rounded-full border-2 transition-colors duration-200',
                  available
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-stone-600 border-stone-500',
                  isPending ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {/* Thumb */}
                <span
                  className={[
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                    available ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </button>
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
                disabled={!isFormValid || isPending}
                aria-label={isFormValid ? `Add pastry named ${name.trim()}` : 'Fill in name and price first'}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Adding…
                  </span>
                ) : (
                  'Add Pastry'
                )}
              </PosButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
