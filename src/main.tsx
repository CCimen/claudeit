import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'

import './index.css'
import App from './App.tsx'

if (import.meta.env.PROD) {
  console.log(
    '%c✦ Let me Claude it %c— because someone had to build the passive-aggressive alternative.',
    'color: #c66442; font-size: 14px; font-weight: bold;',
    'color: #8a7560; font-size: 12px;',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
)
