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
import BusinessQuoteRequestsPage from '../pages/business/delivery/BusinessQuoteRequestsPage'
import BusinessServicePackagesPage from '../pages/business/delivery/BusinessServicePackagesPage'
import BusinessOrderHistoryPage from '../pages/business/delivery/BusinessOrderHistoryPage'
import BusinessCustomerOrdersPage from '../pages/business/delivery/BusinessCustomerOrdersPage'
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
import RealEstateListingCreatePage from '../pages/business/real-estate/RealEstateListingCreatePage';
import PartnerApplyPage from '../pages/PartnerApplyPage';
import UserSupportPage from '../pages/UserSupportPage';
import MySupportTicketsPage from '../pages/MySupportTicketsPage';

// Reservation pages
import ReservationsListPage from '../pages/business/real-estate/ReservationsListPage';
import ReservationDetailPage from '../pages/business/real-estate/ReservationDetailPage';

// Auth pages
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import AgentSignUpPage from '../pages/AgentSignUpPage'
import ChangePasswordPage from '../pages/auth/ChangePasswordPage'

// Property pages
import PropertyDetailPage from '../pages/PropertyDetailPage'
import ListPropertyPage from '../pages/ListPropertyPage'
import AgencyProfilePage from '../pages/AgencyProfilePage'

// Category pages
import CategoryPage from '../pages/CategoryPage'

// Delivery service pages
import DeliveryServicesPage from '../pages/DeliveryServicesPage'
import DeliveryServiceCategoryPage from '../pages/DeliveryServiceCategoryPage'
import ServiceDetailPage from '../pages/ServiceDetailPage'
import CheckoutPage from '../pages/CheckoutPage'

// Map page
import MapPage from '../pages/MapPage'

// News pages
import NewsManagementPage from '../pages/NewsManagementPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'

// Admin dashboard pages
import AdminDashboardLayout from '../layouts/AdminDashboardLayout'
import AdminDashboardHomePage from '../pages/admin/AdminDashboardHomePage'
import AdminPartnersPage from '../pages/admin/AdminPartnersPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminDeliveryOversightPage from '../pages/admin/AdminDeliveryOversightPage'
import AdminCategoryManagementPage from '../pages/admin/AdminCategoryManagementPage'
import AdminRealEstateOversightPage from '../pages/admin/AdminRealEstateOversightPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'
// New admin pages
import AdminApprovalsPage from '../pages/admin/AdminApprovalsPage'
import AdminSettlementsPage from '../pages/admin/AdminSettlementsPage'
import AdminFinanceRulesPage from '../pages/admin/AdminFinanceRulesPage'
import AdminSupportTicketsPage from '../pages/admin/AdminSupportTicketsPage'
import AdminReportsPage from '../pages/admin/AdminReportsPage'
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage'
import AdminRolesPermissionsPage from '../pages/admin/AdminRolesPermissionsPage'
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage'
import AdminSystemStatusPage from '../pages/admin/AdminSystemStatusPage'
import AdminReviewsPage from '../pages/admin/AdminReviewsPage'
import AdminBannersPage from '../pages/admin/AdminBannersPage'
import AdminDiscountsPage from '../pages/admin/AdminDiscountsPage'
import AdminPromotionsPage from '../pages/admin/AdminPromotionsPage'
import RealEstateReviewsPage from '../pages/business/real-estate/RealEstateReviewsPage'
import BusinessReviewsPage from '../pages/business/delivery/BusinessReviewsPage'
import BusinessRealEstateDiscountsPage from '../pages/business/real-estate/BusinessRealEstateDiscountsPage'
import BusinessDeliveryDiscountsPage from '../pages/business/delivery/BusinessDeliveryDiscountsPage'

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
        <Route path="/partner/apply" element={<PartnerApplyPage />} />
        <Route path="/moving-service" element={<MovingServicePage />} />
        <Route path="/moving-registration" element={<MovingRegistrationPage />} />
        <Route path="/community" element={<CommunityLandingPage />} />
        <Route path="/price-trends" element={<PriceTrendsPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/agency/:type/:id" element={<AgencyProfilePage />} />
        <Route path="/list-property" element={<ListPropertyPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/delivery-services" element={<DeliveryServicesPage />} />
        <Route path="/delivery-services/:serviceTypeId" element={<DeliveryServiceCategoryPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/checkout/:serviceId" element={<CheckoutPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route
          path="/support"
          element={
            <UserProtectedRoute allowedRoles={["USER"]}>
              <UserSupportPage />
            </UserProtectedRoute>
          }
        />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/agent-signup" element={<AgentSignUpPage />} />
        <Route
          path="/auth/change-password"
          element={
            <UserProtectedRoute allowedRoles={["BUSINESS_REAL_ESTATE", "BUSINESS_DELIVERY"]}>
              <ChangePasswordPage />
            </UserProtectedRoute>
          }
        />
        
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
          path="/mypage/support"
          element={
            <UserProtectedRoute allowedRoles={["USER"]}>
              <MySupportTicketsPage />
            </UserProtectedRoute>
          }
        />
        
        {/* Admin Dashboard Route */}
        <Route
          path="/admin/*"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardHomePage />} />
          <Route path="partners" element={<AdminPartnersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="real-estate" element={<AdminRealEstateOversightPage />} />
          <Route path="delivery" element={<AdminDeliveryOversightPage />} />
          <Route path="delivery/categories" element={<AdminCategoryManagementPage />} />
          <Route path="approvals" element={<AdminApprovalsPage />} />
          <Route path="finance/settlements" element={<AdminSettlementsPage />} />
          <Route path="finance/rules" element={<AdminFinanceRulesPage />} />
          <Route path="support/tickets" element={<AdminSupportTicketsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="security/roles" element={<AdminRolesPermissionsPage />} />
          <Route path="security/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="system/status" element={<AdminSystemStatusPage />} />
          <Route path="content/news" element={<NewsManagementPage />} />
          <Route path="content/banners" element={<AdminBannersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="marketing/discounts" element={<AdminDiscountsPage />} />
          <Route path="marketing/promotions" element={<AdminPromotionsPage />} />
          {/* Legacy routes for backward compatibility */}
          <Route path="discounts" element={<AdminDiscountsPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        
        {/* Keep existing admin route for backward compatibility */}
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
            <UserProtectedRoute allowedRoles={["BUSINESS_REAL_ESTATE", "BUSINESS_DELIVERY"]}>
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
          <Route path="quote-requests" element={<BusinessQuoteRequestsPage />} />
          <Route path="service-packages" element={<BusinessServicePackagesPage />} />
          <Route path="customer-orders" element={<BusinessCustomerOrdersPage />} />
          <Route path="order-history" element={<BusinessOrderHistoryPage />} />
          <Route path="schedule" element={<BusinessSchedulePage />} />
          <Route path="customers" element={<BusinessCustomersPage />} />
          <Route path="reviews" element={<BusinessReviewsPage />} />
          <Route path="marketing/discounts" element={<BusinessDeliveryDiscountsPage />} />
          {/* Legacy routes for backward compatibility */}
          <Route path="discounts" element={<BusinessDeliveryDiscountsPage />} />
          <Route path="settings" element={<BusinessSettingsPage />} />
        </Route>

        {/* Real Estate Specific Dashboard Route */}
        <Route
          path="/business/real-estate"
          element={
            <UserProtectedRoute allowedRoles={["BUSINESS_REAL_ESTATE"]}>
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
          <Route path="listings/new" element={<RealEstateListingCreatePage />} />
          <Route path="listings/:id/edit" element={<RealEstateNewListingPage />} />
          <Route path="leads" element={<RealEstateLeadsPage />} />
          <Route path="analytics" element={<RealEstateAnalyticsPage />} />
          <Route path="customers" element={<RealEstateCustomersPage />} />
          <Route path="reviews" element={<RealEstateReviewsPage />} />
          <Route path="marketing/discounts" element={<BusinessRealEstateDiscountsPage />} />
          {/* Legacy routes for backward compatibility */}
          <Route path="discounts" element={<BusinessRealEstateDiscountsPage />} />
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