import type { PastryDTO } from '../../types/pastry'
import { PosButton } from '../ui/PosButton'

interface PastryDetailModalProps {
  pastry: PastryDTO | null
  onClose: () => void
}

/**
 * Displays the full details of a pastry in a centered modal.
 *
 * - Only renders when `pastry` is non-null.
 * - Backdrop click closes the modal.
 * - Shows name, description (if present), price, and availability status.
 * - Dark card theme (bg-stone-800) matching the ProductDetailModal pattern.
 */
export function PastryDetailModal({ pastry, onClose }: PastryDetailModalProps) {
  if (!pastry) return null

  return (
    /* Backdrop — closes modal on click */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pastry-detail-modal-title"
      onClick={onClose}
    >
      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Name ── */}
        <div>
          <h2
            id="pastry-detail-modal-title"
            className="text-2xl font-bold text-stone-100"
          >
            {pastry.name}
          </h2>

          {/* Description — rendered only when non-empty */}
          {pastry.description.trim().length > 0 && (
            <p className="text-stone-400 text-sm mt-1">{pastry.description}</p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-stone-700" />

        {/* ── Price and Availability ── */}
        <div className="flex gap-4">
          {/* Price */}
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Price
            </span>
            <span className="text-amber-400 font-semibold text-lg">
              ${pastry.price.toFixed(2)}
            </span>
          </div>

          {/* Availability */}
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Status
            </span>
            {pastry.available ? (
              <span className="inline-flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium w-fit">
                Available
              </span>
            ) : (
              <span className="inline-flex items-center bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium w-fit">
                Unavailable
              </span>
            )}
          </div>
        </div>

        {/* ── Close button ── */}
        <PosButton
          variant="secondary"
          fullWidth
          onClick={onClose}
          className="min-h-[56px] bg-stone-700 text-stone-200 hover:bg-stone-600 active:bg-stone-500"
          aria-label={`Close details for ${pastry.name}`}
        >
          Close
        </PosButton>
      </div>
    </div>
  )
}
