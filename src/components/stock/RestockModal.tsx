import { useState, useEffect, useRef } from 'react'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import type { IngredientDTO } from '../../types/stock'

interface RestockModalProps {
  ingredient: IngredientDTO | null
  isPending: boolean
  onConfirm: (ingredientId: number, amount: number) => void
  onClose: () => void
}

/**
 * Modal dialog for restocking a single ingredient.
 * Opens as a centered overlay with a numeric input and a confirm button.
 * The amount field is auto-focused and cleared on each open so the barista
 * can type quickly without clearing previous values.
 *
 * Closes on backdrop click or the Cancel button.
 * The Confirm button is disabled until a valid positive integer is entered.
 */
export function RestockModal({
  ingredient,
  isPending,
  onConfirm,
  onClose,
}: RestockModalProps) {
  const [amount, setAmount] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset amount and focus input whenever a new ingredient is opened.
  useEffect(() => {
    if (ingredient) {
      setAmount('')
      // Small delay to allow the modal DOM to mount before focusing.
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [ingredient])

  if (!ingredient) return null

  const parsedAmount = parseInt(amount, 10)
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0

  function handleConfirm() {
    if (!isAmountValid || !ingredient) return
    onConfirm(ingredient.id, parsedAmount)
  }

  /** Allow submitting via Enter key for keyboard-capable tablets. */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && isAmountValid) {
      handleConfirm()
    }
  }

  return (
    /* Backdrop — closes modal on click */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restock-modal-title"
      onClick={onClose}
    >
      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <h2
            id="restock-modal-title"
            className="text-xl font-bold text-stone-900"
          >
            Restock ingredient
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            {ingredient.name} — current stock:{' '}
            <strong className="text-stone-700">
              {ingredient.currentStock} {ingredient.unit}
            </strong>
          </p>
        </div>

        {/* Amount input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="restock-amount"
            className="text-sm font-semibold text-stone-700"
          >
            Amount to add ({ingredient.unit})
          </label>
          <input
            ref={inputRef}
            id="restock-amount"
            type="number"
            inputMode="numeric"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            placeholder="e.g. 50"
            className={[
              'w-full min-h-[60px] px-4 rounded-xl border text-lg font-semibold text-stone-900',
              'focus:outline-none focus:ring-2 focus:ring-amber-500',
              'transition-colors duration-100',
              !isAmountValid && amount !== ''
                ? 'border-red-400 bg-red-50'
                : 'border-stone-300 bg-stone-50',
              isPending ? 'opacity-40 cursor-not-allowed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
          {!isAmountValid && amount !== '' && (
            <p className="text-xs text-red-600" role="alert">
              Please enter a positive number.
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
            disabled={!isAmountValid || isPending}
            aria-label={`Confirm restock of ${ingredient.name}`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Saving…
              </span>
            ) : (
              'Confirm'
            )}
          </PosButton>
        </div>
      </div>
    </div>
  )
}
