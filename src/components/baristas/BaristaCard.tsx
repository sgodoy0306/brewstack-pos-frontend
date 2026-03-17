import { memo } from 'react'
import type { BaristaDTO } from '../../types/barista'

interface BaristaCardProps {
  barista: BaristaDTO
  /** Callback fired when the barista taps the "Practice" button. */
  onPracticeClick: (barista: BaristaDTO) => void
}

/**
 * Returns the color classes for the level badge based on the barista's level.
 * Levels 1-3: stone (trainee), 4-6: amber (intermediate), 7+: green (expert).
 */
function getLevelBadgeClasses(level: number): string {
  if (level >= 7) return 'bg-green-100 text-green-800 border-green-200'
  if (level >= 4) return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-stone-100 text-stone-700 border-stone-200'
}

/**
 * Returns a human-readable rank label for the given level.
 */
function getRankLabel(level: number): string {
  if (level >= 7) return 'Expert'
  if (level >= 4) return 'Intermediate'
  return 'Trainee'
}

/**
 * Card component representing a single barista.
 * Displays name, current level, rank label, total XP,
 * and a touch-optimized "Practice" button (min-h-[60px]).
 *
 * Memoized to prevent unnecessary re-renders when the list is refreshed
 * but the individual barista data hasn't changed.
 */
export const BaristaCard = memo(function BaristaCard({
  barista,
  onPracticeClick,
}: BaristaCardProps) {
  const { name, level, totalXp } = barista
  const levelBadgeClasses = getLevelBadgeClasses(level)
  const rankLabel = getRankLabel(level)

  return (
    <div
      className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm
                 hover:shadow-md transition-shadow duration-150"
      aria-label={`Barista ${name}, level ${level}, ${totalXp} XP`}
    >
      {/* Header: name + level badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Barista avatar placeholder */}
          <div
            className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300
                       flex items-center justify-center mb-3"
            aria-hidden="true"
          >
            <span className="text-xl font-bold text-amber-700 leading-none select-none">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>

          <h2 className="text-lg font-bold text-stone-900 truncate leading-tight">
            {name}
          </h2>
          <span className="text-sm text-stone-500">{rankLabel}</span>
        </div>

        {/* Level badge */}
        <div
          className={[
            'flex flex-col items-center justify-center',
            'min-w-[56px] h-14 rounded-xl border-2 font-bold select-none',
            levelBadgeClasses,
          ].join(' ')}
          aria-label={`Level ${level}`}
        >
          <span className="text-xs font-semibold leading-none opacity-70">LVL</span>
          <span className="text-2xl leading-tight">{level}</span>
        </div>
      </div>

      {/* XP display */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
          {/*
           * Visual XP bar — shows progress within the current level block.
           * Each level block is 100 XP; the bar fills proportionally.
           * Capped at 100% to avoid overflow on level-up edge cases.
           */}
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${Math.min((totalXp % 100), 100)}%` }}
            role="progressbar"
            aria-valuenow={totalXp % 100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="XP progress in current level"
          />
        </div>
        <span className="text-sm font-semibold text-stone-600 whitespace-nowrap">
          {totalXp} XP
        </span>
      </div>

      {/* Practice button — min-h-[60px] for tablet touch target */}
      <button
        onClick={() => onPracticeClick(barista)}
        className="min-h-[60px] w-full rounded-xl font-semibold text-base
                   bg-amber-700 text-white
                   hover:bg-amber-800 active:bg-amber-900 active:scale-95
                   flex items-center justify-center gap-2
                   transition-all duration-100 select-none cursor-pointer"
        aria-label={`Start practice session for ${name}`}
      >
        Practice
      </button>
    </div>
  )
})
