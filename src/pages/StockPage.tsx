import { NavBar } from '../components/layout/NavBar'

/**
 * Stock management page — route "/stock".
 * Full-screen layout (no cart panel). Populated in Fase 4.
 */
export function StockPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-cream-50">
      <NavBar />
      <main className="flex-1 flex items-center justify-center text-stone-400 text-lg">
        Stock management — coming in Fase 4
      </main>
    </div>
  )
}
