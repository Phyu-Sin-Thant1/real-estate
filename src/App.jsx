import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MapPage from './pages/MapPage'
import PresalesPage from './pages/PresalesPage'
import InterestListPage from './pages/InterestListPage'
import AgentSignUpPage from './pages/AgentSignUpPage'
import ListPropertyPage from './pages/ListPropertyPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NewsManagementPage from './pages/NewsManagementPage'
import CategoryPage from './pages/CategoryPage'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/presales" element={<PresalesPage />} />
        <Route path="/interest-list" element={<InterestListPage />} />
        <Route path="/agent-signup" element={<AgentSignUpPage />} />
        <Route path="/list-property" element={<ListPropertyPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <NewsManagementPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App