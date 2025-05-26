import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext' // Importa el AuthProvider

// Importar fuentes de Google
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto+Condensed:wght@400;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve tu App con AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
)