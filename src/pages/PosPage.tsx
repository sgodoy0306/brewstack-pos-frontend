import { PosLayout } from '../components/layout/PosLayout'

/**
 * Main POS page — the default route ("/").
 * CatalogPanel and CartPanel will be populated in Fase 3.
 */
export function PosPage() {
  return (
    <PosLayout
      catalog={
        <div className="flex items-center justify-center h-full text-stone-400 text-lg">
          Product catalog — coming in Fase 3
        </div>
      }
      cart={
        <div className="flex items-center justify-center h-full text-stone-400 text-sm px-4 text-center">
          Cart — coming in Fase 3
        </div>
      }
    />
  )
}
