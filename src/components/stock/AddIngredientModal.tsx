import { useState, useEffect, useCallback, useRef } from 'react'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useCreateIngredient } from '../../hooks/useStock'

interface AddIngredientModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after an ingredient is successfully created. Receives the new ingredient name. */
  onSuccess?: (name: string) => void
}

/**
 * Two-screen modal for adding a new stock ingredient.
 *
 * Screen 1 — Form: name, unit, initial stock, and minimum threshold inputs + "Add" button.
 * Screen 2 — Success: green checkmark circle + created ingredient name + "Done" button.
 *
 * Resets all local state each time `isOpen` transitions to true.
 * Backdrop click closes the modal only when no mutation is in flight.
 */
export function AddIngredientModal({ isOpen, onClose, onSuccess }: AddIngredientModalProps) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [currentStock, setCurrentStock] = useState('')
  const [minimumThreshold, setMinimumThreshold] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdName, setCreatedName] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const { createIngredient, isPending } = useCreateIngredient()

  // Reset form state every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setName('')
      setUnit('')
      setCurrentStock('')
      setMinimumThreshold('')
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

  const isFormValid =
    name.trim() !== '' &&
    unit.trim() !== '' &&
    currentStock !== '' &&
    minimumThreshold !== '' &&
    Number(currentStock) >= 0 &&
    Number(minimumThreshold) >= 0

  const handleAdd = useCallback(() => {
    if (!isFormValid || isPending) return

    createIngredient(
      {
        name: name.trim(),
        unit: unit.trim(),
        currentStock: Number(currentStock),
        minimumThreshold: Number(minimumThreshold),
      },
      {
        onSuccess: (ingredient) => {
          setCreatedName(ingredient.name)
          setShowSuccess(true)
          onSuccess?.(ingredient.name)
        },
      },
    )
  }, [isFormValid, isPending, createIngredient, name, unit, currentStock, minimumThreshold, onSuccess])

  const handleDone = useCallback(() => {
    setShowSuccess(false)
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback(() => {
    if (!isPending) onClose()
  }, [isPending, onClose])

  /** Shared input class builder — reduces repetition across the four fields. */
  const inputClasses = (disabled: boolean) =>
    [
      'min-h-[60px] px-4 rounded-xl text-base text-stone-100',
      'bg-stone-700 border-2 border-stone-600',
      'placeholder:text-stone-500',
      'focus:outline-none focus:border-amber-500',
      'transition-colors duration-100',
      disabled ? 'opacity-40 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ')

  if (!isOpen) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-ingredient-modal-title"
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
                id="add-ingredient-modal-title"
                className="text-xl font-bold text-stone-100"
              >
                Ingredient added!
              </h2>
              <p className="text-stone-400 text-sm">
                <strong className="text-stone-100">{createdName}</strong> has been added to stock.
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
                id="add-ingredient-modal-title"
                className="text-xl font-bold text-stone-100"
              >
                Add Ingredient
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Fill in the details for the new stock ingredient.
              </p>
            </div>

            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="ingredient-name-input" className="text-sm font-semibold text-stone-300">
                Name
              </label>
              <input
                ref={nameInputRef}
                id="ingredient-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                placeholder="e.g. Whole Milk"
                maxLength={100}
                className={inputClasses(isPending)}
                aria-label="Ingredient name"
                aria-required="true"
              />
            </div>

            {/* Unit input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="ingredient-unit-input" className="text-sm font-semibold text-stone-300">
                Unit
              </label>
              <input
                id="ingredient-unit-input"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={isPending}
                placeholder="e.g. ml, g, units"
                maxLength={20}
                className={inputClasses(isPending)}
                aria-label="Ingredient unit of measure"
                aria-required="true"
              />
            </div>

            {/* Initial stock + Minimum threshold — side by side */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="ingredient-stock-input"
                  className="text-sm font-semibold text-stone-300"
                >
                  Initial stock
                </label>
                <input
                  id="ingredient-stock-input"
                  type="number"
                  min={0}
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  disabled={isPending}
                  placeholder="0"
                  className={inputClasses(isPending)}
                  aria-label="Initial stock quantity"
                  aria-required="true"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="ingredient-threshold-input"
                  className="text-sm font-semibold text-stone-300"
                >
                  Min. threshold
                </label>
                <input
                  id="ingredient-threshold-input"
                  type="number"
                  min={0}
                  value={minimumThreshold}
                  onChange={(e) => setMinimumThreshold(e.target.value)}
                  disabled={isPending}
                  placeholder="0"
                  className={inputClasses(isPending)}
                  aria-label="Minimum stock threshold"
                  aria-required="true"
                />
              </div>
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
                aria-label={
                  isFormValid
                    ? `Add ingredient named ${name.trim()}`
                    : 'Fill in all required fields first'
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
