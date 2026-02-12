import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from '@/routes'
import { Toaster } from '@/components/ui/sonner'
import { PersonaModeProvider } from '@/lib/personaModeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersonaModeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </PersonaModeProvider>
  </StrictMode>,
)
