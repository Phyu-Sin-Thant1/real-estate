import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import MapPage from '../pages/MapPage'
import InterestListPage from '../pages/InterestListPage'
import AgentSignUpPage from '../pages/AgentSignUpPage'
import ListPropertyPage from '../pages/ListPropertyPage'
import CategoryPage from '../pages/CategoryPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import NewsManagementPage from '../pages/NewsManagementPage'
import ProfilePage from '../pages/ProfilePage'
import PropertyDetailPage from '../pages/PropertyDetailPage'
import UnifiedProtectedRoute from '../components/layout/UnifiedProtectedRoute'
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute'
import UserProtectedRoute from './UserProtectedRoute'

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
import MovingRegistrationPage from '../pages/MovingRegistrationPage'
import NewsListPage from '../pages/NewsListPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import CommunityLandingPage from '../pages/CommunityLandingPage'
import PriceTrendsPage from '../pages/PriceTrendsPage'
import BusinessDashboardLayout from '../layouts/BusinessDashboardLayout'
import OverviewPage from '../pages/business/OverviewPage'
// New business dashboard pages
import BusinessContractsPage from '../pages/business/contracts/BusinessContractsPage'
import BusinessPropertiesPage from '../pages/business/properties/BusinessPropertiesPage'
import BusinessAdsPage from '../pages/business/ads/BusinessAdsPage'
import BusinessStatsPage from '../pages/business/stats/BusinessStatsPage'
import BusinessMovingRequestsPage from '../pages/business/moving/BusinessMovingRequestsPage'
import BusinessDeliveryOrdersPage from '../pages/business/delivery/BusinessDeliveryOrdersPage'
import BusinessSchedulePage from '../pages/business/schedule/BusinessSchedulePage'
import BusinessCustomersPage from '../pages/business/customers/BusinessCustomersPage'
import BusinessSettingsPage from '../pages/business/settings/BusinessSettingsPage'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/interest-list" element={<InterestListPage />} />
        <Route path="/agent-signup" element={<AgentSignUpPage />} />
        <Route path="/list-property" element={<ListPropertyPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/moving" element={<MovingServicePage />} />
        <Route path="/moving-service" element={<MovingServicePage />} />
        <Route path="/moving/register" element={<MovingRegistrationPage />} />
        <Route path="/community" element={<CommunityLandingPage />} />
        <Route path="/price-trends" element={<PriceTrendsPage />} />
        
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
          <UserProtectedRoute allowedRoles={["USER", "BUSINESS_REAL_ESTATE", "BUSINESS_DELIVERY", "ADMIN"]}>
            <MyPage />
          </UserProtectedRoute>
        } />
        
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <NewsManagementPage />
            </RoleProtectedRoute>
          }
        />
        
        {/* Business Dashboard Route - Single route for all business users */}
        <Route
          path="/business"
          element={
            <UserProtectedRoute allowedRoles={["BUSINESS_REAL_ESTATE", "BUSINESS_DELIVERY", "ADMIN"]}>
              <BusinessDashboardLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="dashboard" element={<OverviewPage />} />
          <Route path="contracts" element={<BusinessContractsPage />} />
          <Route path="properties" element={<BusinessPropertiesPage />} />
          <Route path="ads" element={<BusinessAdsPage />} />
          <Route path="stats" element={<BusinessStatsPage />} />
          <Route path="moving-requests" element={<BusinessMovingRequestsPage />} />
          <Route path="delivery-orders" element={<BusinessDeliveryOrdersPage />} />
          <Route path="schedule" element={<BusinessSchedulePage />} />
          <Route path="customers" element={<BusinessCustomersPage />} />
          <Route path="settings" element={<BusinessSettingsPage />} />
        </Route>
        
        {/* Redirects for old dashboard URLs */}
        <Route path="/dashboard/real-estate" element={<Navigate to="/business" replace />} />
        <Route path="/dashboard/delivery" element={<Navigate to="/business" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter