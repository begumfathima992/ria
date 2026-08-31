import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CommerceProvider } from './context/CommerceContext'
import './index.css'

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CommerceProvider>
        <App />
      </CommerceProvider>
    </AuthProvider>
  </BrowserRouter>
)
