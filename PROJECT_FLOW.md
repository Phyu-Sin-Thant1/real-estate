# TOFU Platform - Project Flow Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [User Flows](#user-flows)
4. [Route Structure](#route-structure)
5. [Component Hierarchy](#component-hierarchy)
6. [Data Flow](#data-flow)
7. [Authentication Flow](#authentication-flow)

---

## 🎯 Overview

**TOFU** is a multi-service platform combining:
- **Real Estate** listings and management
- **Delivery/Moving** services
- **Business Partner** dashboards
- **Admin** management system

### Tech Stack
- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: Context API, LocalStorage
- **Icons**: Custom 3D SVG Icons
- **Internationalization**: i18n Context

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Context Providers                        │   │
│  │  • I18nProvider                                       │   │
│  │  • DeliveryQuotesProvider                            │   │
│  │  • ListingsProvider                                  │   │
│  │  • ReservationsProvider                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AppRouter.jsx                            │   │
│  │  • Public Routes                                     │   │
│  │  • Auth Routes                                       │   │
│  │  • Protected Routes                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Flows

### 1. Public User Flow

```
┌─────────────┐
│  Homepage   │
│     (/)     │
└──────┬──────┘
       │
       ├──→ Browse Properties (/category/:id, /property/:id)
       ├──→ View Map (/map)
       ├──→ Read News (/news, /news/:id)
       ├──→ Moving Service (/moving-service)
       ├──→ Community (/community)
       ├──→ Price Trends (/price-trends)
       │
       └──→ Login/Signup (/login, /signup)
            │
            └──→ Authenticated User Flow
```

### 2. Authenticated User Flow

```
┌─────────────┐
│   Login     │
│  (/login)   │
└──────┬──────┘
       │
       ├──→ Regular User (USER)
       │   ├──→ MyPage (/mypage)
       │   ├──→ Support (/support)
       │   └──→ Browse & Search Properties
       │
       ├──→ Business Partner (BUSINESS_REAL_ESTATE)
       │   └──→ Real Estate Dashboard (/business/real-estate/*)
       │
       ├──→ Business Partner (BUSINESS_DELIVERY)
       │   └──→ Delivery Dashboard (/business/*)
       │
       └──→ Admin (ADMIN)
           └──→ Admin Dashboard (/admin/*)
```

### 3. Real Estate Partner Flow

```
┌──────────────────────────────┐
│  Real Estate Dashboard       │
│  (/business/real-estate)     │
└──────────────┬───────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Dashboard│ │Contracts│ │Listings│
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Reservations│ │Customers│ │Reviews│
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Analytics│ │Discounts│ │Settings│
└────────┘ └────────┘ └────────┘
```

### 4. Delivery Partner Flow

```
┌──────────────────────┐
│  Delivery Dashboard  │
│    (/business)       │
└──────────┬────────────┘
           │
    ┌──────┼──────┐
    │      │      │
    ▼      ▼      ▼
┌────────┐ ┌────────┐ ┌────────┐
│Dashboard│ │Moving│ │Delivery│
│         │ │Requests│ │Orders │
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Schedule│ │Customers│ │Reviews│
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│  Stats │ │Discounts│ │Settings│
└────────┘ └────────┘ └────────┘
```

### 5. Admin Flow

```
┌──────────────────────┐
│   Admin Dashboard    │
│     (/admin)         │
└──────────┬────────────┘
           │
    ┌──────┼──────┐
    │      │      │
    ▼      ▼      ▼
┌────────┐ ┌────────┐ ┌────────┐
│Dashboard│ │Partners│ │  Users │
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Real Estate│ │Delivery│ │Approvals│
│Oversight│ │Oversight│ │         │
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Finance │ │Support │ │Reports │
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Security│ │System  │ │Content │
└────────┘ └────────┘ └────────┘
```

---

## 🛣️ Route Structure

### Public Routes
```
/                           → HomePage
/about                      → AboutPage
/contact                    → ContactPage
/faq                        → FAQPage
/terms                      → TermsPage
/privacy                    → PrivacyPage
/partner/apply             → PartnerApplyPage
/moving-service             → MovingServicePage
/moving-registration        → MovingRegistrationPage
/community                  → CommunityLandingPage
/price-trends               → PriceTrendsPage
/property/:id               → PropertyDetailPage
/list-property              → ListPropertyPage
/category/:categoryId       → CategoryPage
/map                        → MapPage
/news                       → NewsListPage
/news/:id                   → NewsDetailPage
```

### Authentication Routes
```
/login                      → LoginPage
/signup                     → SignUpPage
/agent-signup               → AgentSignUpPage
/auth/change-password       → ChangePasswordPage (Protected)
```

### User Protected Routes
```
/mypage                     → MyPage (All roles)
/mypage/support             → MySupportTicketsPage (USER only)
/support                    → UserSupportPage (USER only)
```

### Business Dashboard Routes

#### Delivery Partner (`/business/*`)
```
/business                   → OverviewPage
/business/dashboard        → OverviewPage
/business/moving-requests  → BusinessMovingRequestsPage
/business/delivery-orders  → BusinessDeliveryOrdersPage
/business/schedule          → BusinessSchedulePage
/business/stats            → BusinessSettlementStatsPage
/business/customers        → BusinessCustomersPage
/business/reviews          → BusinessReviewsPage
/business/discounts        → BusinessDeliveryDiscountsPage
/business/settings         → BusinessSettingsPage
```

#### Real Estate Partner (`/business/real-estate/*`)
```
/business/real-estate                    → RealEstateDashboardOverview
/business/real-estate/dashboard          → RealEstateDashboardOverview
/business/real-estate/contracts          → RealEstateContractsPage
/business/real-estate/contracts/new      → RealEstateContractCreatePage
/business/real-estate/contracts/:id      → RealEstateContractDetailPage
/business/real-estate/listings           → RealEstateListingsPage
/business/real-estate/listings/new       → RealEstateListingCreatePage
/business/real-estate/listings/:id/edit  → RealEstateNewListingPage
/business/real-estate/reservations       → ReservationsListPage
/business/real-estate/reservations/:id   → ReservationDetailPage
/business/real-estate/leads              → RealEstateLeadsPage
/business/real-estate/analytics          → RealEstateAnalyticsPage
/business/real-estate/customers          → RealEstateCustomersPage
/business/real-estate/reviews            → RealEstateReviewsPage
/business/real-estate/discounts          → BusinessRealEstateDiscountsPage
/business/real-estate/settings           → RealEstateSettingsPage
```

### Admin Dashboard Routes (`/admin/*`)
```
/admin                     → AdminDashboardHomePage
/admin/dashboard           → AdminDashboardHomePage
/admin/partners            → AdminPartnersPage
/admin/users               → AdminUsersPage
/admin/real-estate         → AdminRealEstateOversightPage
/admin/delivery            → AdminDeliveryOversightPage
/admin/approvals           → AdminApprovalsPage
/admin/finance/settlements → AdminSettlementsPage
/admin/finance/rules       → AdminFinanceRulesPage
/admin/support/tickets     → AdminSupportTicketsPage
/admin/reports             → AdminReportsPage
/admin/notifications       → AdminNotificationsPage
/admin/security/roles      → AdminRolesPermissionsPage
/admin/security/audit-logs → AdminAuditLogsPage
/admin/system/status       → AdminSystemStatusPage
/admin/content/news        → NewsManagementPage
/admin/content/banners     → AdminBannersPage
/admin/reviews             → AdminReviewsPage
/admin/marketing/discounts → AdminDiscountsPage
/admin/marketing/promotions→ AdminPromotionsPage
/admin/settings            → AdminSettingsPage
```

---

## 🧩 Component Hierarchy

### Layout Components
```
App.jsx
└── AppRouter.jsx
    ├── Public Routes (No Layout)
    ├── AdminDashboardLayout
    │   ├── Sidebar (Fixed, 3D Icons)
    │   ├── DashboardTopBar
    │   └── Outlet (Admin Pages)
    ├── BusinessDashboardLayout
    │   ├── Sidebar (Fixed, 3D Icons)
    │   ├── DashboardTopBar
    │   └── Outlet (Business Pages)
    └── RealEstateBusinessLayout
        ├── Sidebar (Fixed, 3D Icons)
        ├── DashboardTopBar
        └── Outlet (Real Estate Pages)
```

### Key Components
```
components/
├── icons/
│   ├── Icon3D.jsx          → 3D Icon wrapper
│   └── MenuIcon3D.jsx     → Menu icon mapper
├── layout/
│   ├── DashboardTopBar.jsx → Top navigation bar
│   ├── UserProtectedRoute.jsx
│   └── RoleProtectedRoute.jsx
└── ...
```

---

## 📊 Data Flow

### State Management
```
┌─────────────────────────────────────┐
│      Context Providers              │
│  • UnifiedAuthContext               │
│  • I18nContext                      │
│  • ListingsContext                  │
│  • ReservationsContext              │
│  • DeliveryQuotesContext            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Store Modules                   │
│  • reviewsStore.js                   │
│  • discountsStore.js                 │
│  • partnerDiscountsStore.js          │
│  • platformCampaignsStore.js         │
│  • realEstateListingsStore.js        │
│  • realEstateCustomersStore.js      │
│  • deliveryCustomersData.js         │
│  • deliveryData.js                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      LocalStorage                    │
│  • Persistent mock data              │
│  • User preferences                  │
└─────────────────────────────────────┘
```

### Data Flow Example (Real Estate Listings)
```
User Action
    ↓
RealEstateListingsPage
    ↓
realEstateListingsStore.getListings()
    ↓
localStorage (Mock Data)
    ↓
Component State Update
    ↓
UI Re-render
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   User      │
│  Visits     │
│  Protected  │
│   Route     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ RoleProtectedRoute│
│  or              │
│ UserProtectedRoute│
└──────┬──────────┘
       │
       ├──→ Check Auth Status
       │
       ├──→ Not Authenticated?
       │   └──→ Redirect to /login
       │
       ├──→ Authenticated but Wrong Role?
       │   └──→ Redirect to / (Homepage)
       │
       └──→ Authenticated & Correct Role?
           └──→ Render Protected Component
```

### Role-Based Access Control

| Role | Access Level | Routes |
|------|-------------|--------|
| **USER** | Public + User Pages | `/`, `/mypage`, `/support` |
| **BUSINESS_REAL_ESTATE** | Real Estate Dashboard | `/business/real-estate/*` |
| **BUSINESS_DELIVERY** | Delivery Dashboard | `/business/*` |
| **ADMIN** | Admin Dashboard | `/admin/*` |

---

## 🎨 UI Features

### 3D Sidebar Menu
- **Fixed Position**: Sidebar stays in place during scroll
- **3D Icons**: Custom SVG icons with 3D transform effects
- **Active States**: Icons rotate and scale when active
- **Hover Effects**: Smooth 3D transitions on hover

### Responsive Design
- **Desktop**: Full sidebar + main content
- **Mobile**: Collapsible sidebar (future enhancement)

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Gradients**: Modern gradient backgrounds
- **Shadows**: Layered shadow effects
- **Transitions**: Smooth animations throughout

---

## 📁 Project Structure

```
src/
├── components/          → Reusable components
│   ├── icons/          → Icon components (3D icons)
│   └── layout/         → Layout components
├── contexts/           → React contexts
├── layouts/            → Page layouts
│   ├── AdminDashboardLayout.jsx
│   ├── BusinessDashboardLayout.jsx
│   └── RealEstateBusinessLayout.jsx
├── pages/              → Page components
│   ├── admin/         → Admin pages
│   ├── business/      → Business pages
│   │   ├── delivery/  → Delivery partner pages
│   │   └── real-estate/ → Real estate partner pages
│   └── ...            → Public pages
├── router/             → Routing configuration
│   └── AppRouter.jsx
├── store/              → Data stores (mock data)
├── config/             → Configuration files
│   └── businessMenu.js → Menu configurations
└── App.jsx             → Root component
```

---

## 🔄 Key Workflows

### 1. Property Listing Workflow (Real Estate)
```
1. Partner logs in → /business/real-estate
2. Navigate to Listings → /business/real-estate/listings
3. Click "New Listing" → /business/real-estate/listings/new
4. Fill form → Submit
5. Listing saved to store → Redirect to listings page
6. Listing appears in list
```

### 2. Review Management Workflow
```
1. User/Partner views reviews → /business/real-estate/reviews
2. Click on review → View details
3. Add reply → Submit
4. Reply saved to reviewsStore
5. Reply appears below review
```

### 3. Schedule Management Workflow (Delivery)
```
1. Partner logs in → /business
2. Navigate to Schedule → /business/schedule
3. Click "Create Schedule" → Modal opens
4. Fill schedule form → Submit
5. Schedule added to scheduleList
6. Schedule appears in table
```

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Access Points
- **Public**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (admin@tofu.com / Admin123!)
- **Real Estate**: http://localhost:3000/business/real-estate (seoulrealestate@tofu.com)
- **Delivery**: http://localhost:3000/business (delivery@tofu.com)

---

## 📝 Notes

- All data is currently stored in **localStorage** (mock data)
- Authentication is handled via **UnifiedAuthContext**
- Role-based routing uses **RoleProtectedRoute** and **UserProtectedRoute**
- Sidebar is **fixed** and doesn't scroll with main content
- 3D icons use CSS transforms for visual effects

---

## 🔗 Website-Admin Integration

### Integration Status
The website and admin dashboard integration is **~30% complete**. See `WEBSITE_ADMIN_INTEGRATION_ANALYSIS.md` for detailed analysis.

### Connected Features ✅
- **Banners & Promotions**: Fully integrated via `bannersStore`
- **Discounts**: Admin can create platform-wide and partner discounts
- **News**: Partially connected (needs data source unification)

### Missing Connections ❌
- **Events**: No admin management page (HIGH PRIORITY)
- **Featured Listings**: Cannot feature/unfeature listings (HIGH PRIORITY)
- **KPIs/Trust Metrics**: Static data, no admin management
- **Moving Service Metrics**: Static data, no admin management
- **Announcement Banner**: Component exists but not functional
- **Partner Benefits**: Hardcoded, no admin customization

### Recommendations
1. Create events management system (`eventsStore` + admin page)
2. Add "featured" flag to listings with admin controls
3. Migrate static homepage data to admin-managed stores
4. Implement announcement banner functionality
5. Connect reviews section to `reviewsStore`

For complete analysis, see: **WEBSITE_ADMIN_INTEGRATION_ANALYSIS.md**

---

**Last Updated**: 2024
**Version**: 1.0.0

