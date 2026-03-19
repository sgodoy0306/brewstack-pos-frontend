import { Routes, Route, Navigate } from 'react-router-dom'
import { PosPage } from './pages/PosPage'
import { StockPage } from './pages/StockPage'
import { FinancePage } from './pages/FinancePage'
import { BaristasPage } from './pages/BaristasPage'

/**
 * Application router.
 * All routes are top-level — no nested layouts here,
 * each page owns its own shell (NavBar + content structure).
 *
 * Routes:
 *   /           → POS main screen (70/30 split)
 *   /stock      → Ingredient stock management
 *   /finance    → Daily report and finance history
 *   /baristas   → Barista profiles and practice sessions
 *   *           → Redirect to POS
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PosPage />} />
      <Route path="/stock" element={<StockPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/baristas" element={<BaristasPage />} />
      {/* Catch-all: redirect unknown paths to POS */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
