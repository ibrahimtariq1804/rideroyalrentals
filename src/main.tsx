import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { LenisProvider } from './context/LenisProvider.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import './styles/global.css'
import './styles/atelier.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LenisProvider>
          <App />
        </LenisProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
