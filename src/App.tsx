import { AppRouter } from './router'

/**
 * App root — delegates routing to AppRouter.
 * BrowserRouter and QueryClientProvider are already set up in main.tsx.
 */
function App() {
  return <AppRouter />
}

export default App
