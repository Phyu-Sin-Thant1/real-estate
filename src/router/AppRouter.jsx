import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import MovingRegistrationPage from '../pages/MovingRegistrationPage'
import NewsListPage from '../pages/NewsListPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import CommunityLandingPage from '../pages/CommunityLandingPage'
import PriceTrendsPage from '../pages/PriceTrendsPage'
import RequireBusinessAuth from '../components/layout/RequireBusinessAuth'
import BusinessDashboardLayout from '../layouts/BusinessDashboardLayout'
import OverviewPage from '../pages/business/OverviewPage'
import CalendarPage from '../pages/business/CalendarPage'
import CustomersPage from '../pages/business/CustomersPage'
import SettlementsPage from '../pages/business/SettlementsPage'
import ListingsPage from '../pages/business/realEstate/ListingsPage'
import InquiriesPage from '../pages/business/realEstate/InquiriesPage'
import ViewingsPage from '../pages/business/realEstate/ViewingsPage'
import DealsPage from '../pages/business/realEstate/DealsPage'
import RequestsPage from '../pages/business/delivery/RequestsPage'
import JobsPage from '../pages/business/delivery/JobsPage'
import PricingPage from '../pages/business/delivery/PricingPage'

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

        {/* Business Dashboard Routes */}
        <Route element={<RequireBusinessAuth />}>
          <Route path="/business" element={<BusinessDashboardLayout />}>
            <Route path="dashboard" element={<OverviewPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="customers" element={<CustomersPage />} />
            {/* Real Estate Routes */}
            <Route path="listings" element={<ListingsPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="viewings" element={<ViewingsPage />} />
            <Route path="deals" element={<DealsPage />} />
            {/* Delivery Routes */}
            <Route path="requests" element={<RequestsPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="pricing" element={<PricingPage />} />
            {/* Sprint 2 - Settlements */}
            {/* <Route path="settlements" element={<SettlementsPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter