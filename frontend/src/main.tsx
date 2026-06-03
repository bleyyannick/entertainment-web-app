import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error("Missing required environment variable: VITE_API_BASE_URL")
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Pas de refetch automatique au focus — les données OMDB ne changent pas
      refetchOnWindowFocus: false,
      // Pas de retry sur erreur réseau pour cette app
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
