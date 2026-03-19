import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { OfflineBanner } from './components/ui/OfflineBanner'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Non-blocking offline indicator — always at the top of the viewport */}
        <OfflineBanner />
        {/* Global toast notification system — wraps the whole app */}
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  </StrictMode>,
)
