import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import MapPage from '../pages/MapPage'
import PresalesPage from '../pages/PresalesPage'
import InterestListPage from '../pages/InterestListPage'
import AgentSignUpPage from '../pages/AgentSignUpPage'
import ListPropertyPage from '../pages/ListPropertyPage'
import CategoryPage from '../pages/CategoryPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import NewsManagementPage from '../pages/NewsManagementPage'
import ProfilePage from '../pages/ProfilePage'
import PropertyDetailPage from '../pages/PropertyDetailPage'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import UserProtectedRoute from '../components/layout/UserProtectedRoute'

// New pages
import AboutPage from '../pages/AboutPage'
import HowItWorksPage from '../pages/HowItWorksPage'
import NoticesPage from '../pages/NoticesPage'
import FAQPage from '../pages/FAQPage'
import ContactPage from '../pages/ContactPage'
import TermsPage from '../pages/TermsPage'
import PrivacyPage from '../pages/PrivacyPage'
import MyPage from '../pages/MyPage'
import MovingServicePage from '../pages/MovingServicePage'
import NewsListPage from '../pages/NewsListPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import CommunityLandingPage from '../pages/CommunityLandingPage'

const AppRouter = () => {
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
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/moving-service" element={<MovingServicePage />} />
        <Route path="/community" element={<CommunityLandingPage />} />
        
        {/* News routes */}
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        
        {/* New pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* My Page - Protected Route */}
        <Route path="/mypage" element={
          <UserProtectedRoute>
            <MyPage />
          </UserProtectedRoute>
        } />
        
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

export default AppRouter