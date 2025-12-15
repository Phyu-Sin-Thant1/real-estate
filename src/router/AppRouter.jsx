import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import FAQPage from '../pages/FAQPage'
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
import RealEstateBusinessLayout from '../layouts/RealEstateBusinessLayout'
import OverviewPage from '../pages/business/OverviewPage'
// New business dashboard pages
import BusinessContractsPage from '../pages/business/contracts/BusinessContractsPage'
import BusinessPropertiesPage from '../pages/business/properties/BusinessPropertiesPage'
import BusinessAdsPage from '../pages/business/ads/BusinessAdsPage'
import BusinessStatsPage from '../pages/business/stats/BusinessStatsPage'
import BusinessMovingRequestsPage from '../pages/business/delivery/BusinessMovingRequestsPage'
import BusinessDeliveryOrdersPage from '../pages/business/delivery/BusinessDeliveryOrdersPage'
import BusinessSchedulePage from '../pages/business/schedule/BusinessSchedulePage'
import BusinessCustomersPage from '../pages/business/delivery/BusinessDeliveryCustomersPage'
import BusinessSettingsPage from '../pages/business/delivery/DeliverySettingsPage'
import BusinessSettlementStatsPage from '../pages/business/delivery/BusinessSettlementStatsPage'

// Real estate specific pages
import RealEstateDashboardOverview from '../pages/business/real-estate/RealEstateDashboardOverview'
import RealEstateContractsPage from '../pages/business/real-estate/RealEstateContractsPage'
import RealEstateListingsPage from '../pages/business/real-estate/RealEstateListingsPage'
import RealEstateLeadsPage from '../pages/business/real-estate/RealEstateLeadsPage'
import RealEstateAnalyticsPage from '../pages/business/real-estate/RealEstateAnalyticsPage'
import RealEstateCustomersPage from '../pages/business/real-estate/RealEstateCustomersPage'
import RealEstateSettingsPage from '../pages/business/real-estate/RealEstateSettingsPage'
import RealEstateContractCreatePage from '../pages/business/real-estate/RealEstateContractCreatePage';
import RealEstateContractDetailPage from '../pages/business/real-estate/RealEstateContractDetailPage';
import RealEstateNewListingPage from '../pages/business/real-estate/RealEstateNewListingPage';

// Reservation pages
import ReservationsListPage from '../pages/business/real-estate/ReservationsListPage';
import ReservationDetailPage from '../pages/business/real-estate/ReservationDetailPage';

// Auth pages
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import AgentSignUpPage from '../pages/AgentSignUpPage'

// Property pages
import PropertyDetailPage from '../pages/PropertyDetailPage'
import ListPropertyPage from '../pages/ListPropertyPage'

// Category pages
import CategoryPage from '../pages/CategoryPage'

// Map page
import MapPage from '../pages/MapPage'

// News pages
import NewsManagementPage from '../pages/NewsManagementPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'

// User protected pages
import UserProtectedRoute from './UserProtectedRoute'
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/moving-service" element={<MovingServicePage />} />
        <Route path="/moving-registration" element={<MovingRegistrationPage />} />
        <Route path="/community" element={<CommunityLandingPage />} />
        <Route path="/price-trends" element={<PriceTrendsPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/list-property" element={<ListPropertyPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/agent-signup" element={<AgentSignUpPage />} />
        
        {/* User protected routes */}
        <Route
          path="/mypage"
          element={
            <UserProtectedRoute allowedRoles={["USER", "BUSINESS_REAL_ESTATE", "BUSINESS_DELIVERY", "ADMIN"]}>
              <MyPage />
            </UserProtectedRoute>
          }
        />
        
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
          <Route path="stats" element={<BusinessSettlementStatsPage />} />
          <Route path="moving-requests" element={<BusinessMovingRequestsPage />} />
          <Route path="delivery-orders" element={<BusinessDeliveryOrdersPage />} />
          <Route path="schedule" element={<BusinessSchedulePage />} />
          <Route path="customers" element={<BusinessCustomersPage />} />
          <Route path="settings" element={<BusinessSettingsPage />} />
        </Route>

        {/* Real Estate Specific Dashboard Route */}
        <Route
          path="/business/real-estate"
          element={
            <UserProtectedRoute allowedRoles={["BUSINESS_REAL_ESTATE", "ADMIN"]}>
              <RealEstateBusinessLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<RealEstateDashboardOverview />} />
          <Route path="dashboard" element={<RealEstateDashboardOverview />} />
          <Route path="contracts" element={<RealEstateContractsPage />} />
          <Route path="contracts/new" element={<RealEstateContractCreatePage />} />
          <Route path="contracts/:id" element={<RealEstateContractDetailPage />} />
          <Route path="listings" element={<RealEstateListingsPage />} />
          <Route path="listings/new" element={<RealEstateNewListingPage />} />
          <Route path="listings/:id/edit" element={<RealEstateNewListingPage />} />
          <Route path="leads" element={<RealEstateLeadsPage />} />
          <Route path="analytics" element={<RealEstateAnalyticsPage />} />
          <Route path="customers" element={<RealEstateCustomersPage />} />
          <Route path="settings" element={<RealEstateSettingsPage />} />
          {/* Reservation routes */}
          <Route path="reservations" element={<ReservationsListPage />} />
          <Route path="reservations/:reservationId" element={<ReservationDetailPage />} />
        </Route>
        
        {/* Redirects for old dashboard URLs */}
        <Route path="/dashboard/real-estate" element={<Navigate to="/business/real-estate" replace />} />
        <Route path="/dashboard/delivery" element={<Navigate to="/business" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter