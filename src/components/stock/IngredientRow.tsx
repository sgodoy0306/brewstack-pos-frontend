import { Badge } from '../ui/Badge'
import type { IngredientDTO } from '../../types/stock'

interface IngredientRowProps {
  ingredient: IngredientDTO
  /** Callback fired when the barista taps the "Restock" button. */
  onRestockClick: (ingredient: IngredientDTO) => void
}

/**
 * Single row in the stock list table.
 * Displays name, current stock with status badge, minimum threshold, unit,
 * and a touch-optimized "Restock" button (min-h-[60px]).
 */
export function IngredientRow({ ingredient, onRestockClick }: IngredientRowProps) {
  const { name, currentStock, minimumThreshold, unit } = ingredient
  const isLow = currentStock <= minimumThreshold
  const isCritical = currentStock === 0

  const stockBadgeVariant = isCritical ? 'danger' : isLow ? 'warning' : 'success'

  const stockLabel = `${currentStock} ${unit}`

  return (
    <div
      className={[
        'flex items-center gap-4 px-5 py-3 rounded-xl border transition-colors duration-100',
        isLow
          ? 'bg-amber-50 border-amber-200'
          : 'bg-white border-stone-200',
      ].join(' ')}
      role="row"
      aria-label={`${name}, stock: ${currentStock} ${unit}`}
    >
      {/* Ingredient name */}
      <span className="flex-1 text-base font-semibold text-stone-800 min-w-0 truncate">
        {name}
      </span>

      {/* Current stock badge */}
      <div className="flex items-center gap-2 min-w-[120px] justify-end">
        <Badge label={stockLabel} variant={stockBadgeVariant} className="text-sm px-3 h-7" />
      </div>

      {/* Minimum threshold */}
      <span className="text-sm text-stone-500 min-w-[140px] text-right">
        Min: {minimumThreshold} {unit}
      </span>

      {/* Restock button — min-h-[60px] for tablet touch target */}
      <button
        onClick={() => onRestockClick(ingredient)}
        className={[
          'min-h-[60px] min-w-[120px] px-5 rounded-xl font-semibold text-sm',
          'flex items-center justify-center gap-1',
          'transition-all duration-100 select-none cursor-pointer',
          isLow
            ? 'bg-amber-700 text-white hover:bg-amber-800 active:bg-amber-900 active:scale-95'
            : 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400 active:scale-95',
        ].join(' ')}
        aria-label={`Restock ${name}`}
      >
        + Restock
      </button>
    </div>
  )
}
