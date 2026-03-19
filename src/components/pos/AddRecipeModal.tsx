import { useState, useEffect, useCallback, useRef } from 'react'
import { PosButton } from '../ui/PosButton'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useCreateRecipe } from '../../hooks/useRecipes'
import { useStock } from '../../hooks/useStock'

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a recipe is successfully created. Receives the new recipe name. */
  onSuccess?: (name: string) => void
}

/** A single row in the dynamic ingredients list. */
interface IngredientRow {
  /** Unique key used only as React list key — not persisted. */
  rowKey: number
  ingredientId: string
  quantity: string
}

let nextRowKey = 1
function makeEmptyRow(): IngredientRow {
  return { rowKey: nextRowKey++, ingredientId: '', quantity: '' }
}

/**
 * Two-screen modal for adding a new coffee recipe.
 *
 * Screen 1 — Form: name, price, XP reward, description, image URL, dynamic
 *   ingredient rows with a native <select> + quantity input.
 * Screen 2 — Success: green checkmark + recipe name + "Done" button.
 *
 * Resets all local state each time `isOpen` transitions to true.
 * The card uses max-h-[85vh] + overflow-y-auto so it scrolls gracefully on
 * smaller tablets without blocking the rest of the UI.
 */
export function AddRecipeModal({ isOpen, onClose, onSuccess }: AddRecipeModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [baseXpReward, setBaseXpReward] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([makeEmptyRow()])
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdName, setCreatedName] = useState('')

  const nameInputRef = useRef<HTMLInputElement>(null)

  const { mutate: createRecipe, isPending } = useCreateRecipe()

  // Fetch a large page of ingredients so the selects have all options without pagination.
  const { ingredients } = useStock({ page: 0, size: 100 })

  // Reset all form state every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setName('')
      setPrice('')
      setBaseXpReward('')
      setDescription('')
      setImageUrl('')
      setIngredientRows([makeEmptyRow()])
      setShowSuccess(false)
      setCreatedName('')
    }
  }, [isOpen])

  // Auto-focus name input when the form screen becomes active.
  useEffect(() => {
    if (isOpen && !showSuccess) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showSuccess])

  // Derived validation
  const parsedPrice = parseFloat(price)
  const parsedXp = parseInt(baseXpReward, 10)

  const ingredientsValid =
    ingredientRows.length > 0 &&
    ingredientRows.every(
      (row) =>
        row.ingredientId !== '' &&
        parseFloat(row.quantity) > 0 &&
        !isNaN(parseFloat(row.quantity)),
    )

  const isFormValid =
    name.trim().length > 0 &&
    !isNaN(parsedPrice) &&
    parsedPrice > 0 &&
    !isNaN(parsedXp) &&
    parsedXp >= 0 &&
    ingredientsValid

  // Ingredient row handlers
  const handleAddIngredientRow = useCallback(() => {
    setIngredientRows((prev) => [...prev, makeEmptyRow()])
  }, [])

  const handleRemoveIngredientRow = useCallback((rowKey: number) => {
    setIngredientRows((prev) => prev.filter((r) => r.rowKey !== rowKey))
  }, [])

  const handleIngredientIdChange = useCallback((rowKey: number, value: string) => {
    setIngredientRows((prev) =>
      prev.map((r) => (r.rowKey === rowKey ? { ...r, ingredientId: value } : r)),
    )
  }, [])

  const handleIngredientQuantityChange = useCallback((rowKey: number, value: string) => {
    setIngredientRows((prev) =>
      prev.map((r) => (r.rowKey === rowKey ? { ...r, quantity: value } : r)),
    )
  }, [])

  const handleAdd = useCallback(() => {
    if (!isFormValid || isPending) return

    createRecipe(
      {
        name: name.trim(),
        price: parsedPrice,
        baseXpReward: parsedXp,
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        ingredients: ingredientRows.map((row) => ({
          ingredientId: parseInt(row.ingredientId, 10),
          quantity: parseFloat(row.quantity),
        })),
      },
      {
        onSuccess: (recipe) => {
          setCreatedName(recipe.name)
          setShowSuccess(true)
          onSuccess?.(recipe.name)
        },
      },
    )
  }, [
    isFormValid,
    isPending,
    createRecipe,
    name,
    parsedPrice,
    parsedXp,
    description,
    imageUrl,
    ingredientRows,
    onSuccess,
  ])

  const handleDone = useCallback(() => {
    setShowSuccess(false)
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback(() => {
    if (!isPending) onClose()
  }, [isPending, onClose])

  // Shared input class builder to keep JSX concise.
  const inputClass = (extra = '') =>
    [
      'min-h-[52px] px-4 rounded-xl text-base text-stone-100',
      'bg-stone-700 border-2 border-stone-600',
      'placeholder:text-stone-500',
      'focus:outline-none focus:border-amber-500',
      'transition-colors duration-100',
      isPending ? 'opacity-40 cursor-not-allowed' : '',
      extra,
    ]
      .filter(Boolean)
      .join(' ')

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-recipe-modal-title"
      onClick={handleBackdropClick}
    >
      {/* Card */}
      <div
        className="bg-stone-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">

          {/* Success screen */}
          {showSuccess ? (
            <>
              <div className="text-center flex flex-col items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-white text-3xl font-bold select-none">&#10003;</span>
                </div>

                <h2
                  id="add-recipe-modal-title"
                  className="text-xl font-bold text-stone-100"
                >
                  Coffee added!
                </h2>
                <p className="text-stone-400 text-sm">
                  <strong className="text-stone-100">{createdName}</strong> is now available
                  in the coffees catalog.
                </p>
              </div>

              <PosButton variant="primary" fullWidth onClick={handleDone}>
                Done
              </PosButton>
            </>
          ) : (
            /* Form screen */
            <>
              {/* Header */}
              <div>
                <h2
                  id="add-recipe-modal-title"
                  className="text-xl font-bold text-stone-100"
                >
                  Add Coffee
                </h2>
                <p className="text-sm text-stone-400 mt-1">
                  Fill in the details for the new coffee recipe.
                </p>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="recipe-name-input" className="text-sm font-semibold text-stone-300">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="recipe-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  placeholder="e.g. Flat White"
                  maxLength={120}
                  className={inputClass()}
                  aria-label="Recipe name"
                />
              </div>

              {/* Price + XP side by side */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="recipe-price-input" className="text-sm font-semibold text-stone-300">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="recipe-price-input"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isPending}
                    placeholder="0.00"
                    min={0.01}
                    step={0.01}
                    className={inputClass()}
                    aria-label="Recipe price"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="recipe-xp-input" className="text-sm font-semibold text-stone-300">
                    Base XP Reward <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="recipe-xp-input"
                    type="number"
                    value={baseXpReward}
                    onChange={(e) => setBaseXpReward(e.target.value)}
                    disabled={isPending}
                    placeholder="10"
                    min={0}
                    step={1}
                    className={inputClass()}
                    aria-label="Base XP reward"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label htmlFor="recipe-description-input" className="text-sm font-semibold text-stone-300">
                  Description{' '}
                  <span className="text-stone-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="recipe-description-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  placeholder="Optional description"
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
                  aria-label="Recipe description"
                />
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-2">
                <label htmlFor="recipe-image-input" className="text-sm font-semibold text-stone-300">
                  Image URL{' '}
                  <span className="text-stone-500 font-normal">(optional)</span>
                </label>
                <input
                  id="recipe-image-input"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isPending}
                  placeholder="https://..."
                  className={inputClass()}
                  aria-label="Recipe image URL"
                />
              </div>

              {/* Ingredients section */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Ingredients <span className="text-red-400">*</span>
                  <span className="text-stone-500 font-normal ml-1">(at least one required)</span>
                </span>

                {ingredientRows.map((row, index) => (
                  <div key={row.rowKey} className="flex gap-2 items-center">
                    {/* Ingredient selector */}
                    <select
                      value={row.ingredientId}
                      onChange={(e) => handleIngredientIdChange(row.rowKey, e.target.value)}
                      disabled={isPending}
                      aria-label={`Ingredient ${index + 1}`}
                      className={[
                        'flex-1 min-h-[52px] px-3 rounded-xl text-base',
                        'bg-stone-700 border-2 border-stone-600',
                        'focus:outline-none focus:border-amber-500',
                        'transition-colors duration-100',
                        isPending ? 'opacity-40 cursor-not-allowed' : '',
                        row.ingredientId === '' ? 'text-stone-500' : 'text-stone-100',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <option value="" disabled>
                        Select ingredient...
                      </option>
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={String(ing.id)} className="text-stone-100 bg-stone-700">
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </select>

                    {/* Quantity input */}
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleIngredientQuantityChange(row.rowKey, e.target.value)}
                      disabled={isPending}
                      placeholder="Qty"
                      min={0.01}
                      step={0.01}
                      aria-label={`Quantity for ingredient ${index + 1}`}
                      className={[
                        'w-24 min-h-[52px] px-3 rounded-xl text-base text-stone-100 text-center',
                        'bg-stone-700 border-2 border-stone-600',
                        'placeholder:text-stone-500',
                        'focus:outline-none focus:border-amber-500',
                        'transition-colors duration-100',
                        isPending ? 'opacity-40 cursor-not-allowed' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />

                    {/* Remove row button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredientRow(row.rowKey)}
                      disabled={isPending || ingredientRows.length === 1}
                      aria-label={`Remove ingredient row ${index + 1}`}
                      className={[
                        'min-h-[52px] min-w-[44px] px-3 rounded-xl font-bold text-lg',
                        'bg-stone-700 border-2 border-stone-600 text-stone-400',
                        'hover:bg-red-900/40 hover:border-red-700 hover:text-red-400',
                        'active:scale-95 transition-all duration-100',
                        isPending || ingredientRows.length === 1
                          ? 'opacity-30 cursor-not-allowed'
                          : 'cursor-pointer',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      x
                    </button>
                  </div>
                ))}

                {/* Add ingredient row */}
                <button
                  type="button"
                  onClick={handleAddIngredientRow}
                  disabled={isPending}
                  className={[
                    'min-h-[48px] px-4 rounded-xl text-sm font-semibold',
                    'bg-stone-700 border-2 border-dashed border-stone-600',
                    'text-stone-400 hover:text-stone-200 hover:border-stone-500',
                    'active:scale-95 transition-all duration-100',
                    isPending ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  + Add Ingredient
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
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
                      ? `Add coffee recipe named ${name.trim()}`
                      : 'Fill in all required fields first'
                  }
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Adding...
                    </span>
                  ) : (
                    'Add Coffee'
                  )}
                </PosButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
