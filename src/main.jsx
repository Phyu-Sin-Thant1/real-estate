import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserAuthProvider } from './context/UserAuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </AuthProvider>
  </React.StrictMode>
)