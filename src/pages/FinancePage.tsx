import { NavBar } from '../components/layout/NavBar'

/**
 * Finance / daily report page — route "/finance".
 * Full-screen layout. Populated in Fase 4.
 */
export function FinancePage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-cream-50">
      <NavBar />
      <main className="flex-1 flex items-center justify-center text-stone-400 text-lg">
        Finance reports — coming in Fase 4
      </main>
    </div>
  )
}
