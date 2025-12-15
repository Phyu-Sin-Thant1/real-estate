# TOFU Application - User Flow & Admin Flow Analysis

## Overview
This document provides a comprehensive analysis of user flows and admin flows in the TOFU application, including authentication, role-based access control, and navigation paths.

---

## Authentication System

### Credentials

#### Admin Account
- **Email**: `admin@tofu.com`
- **Password**: `Admin123!`
- **Role**: `ADMIN`

#### Business Accounts
- **Real Estate Partner**
  - Email: `realestate@tofu.com`
  - Password: `RealEstate123!`
  - Role: `BUSINESS_REAL_ESTATE`

- **Delivery Partner**
  - Email: `delivery@tofu.com`
  - Password: `Delivery123!`
  - Role: `BUSINESS_DELIVERY`

#### Regular Users
- Any email/password combination (accepts any non-empty credentials)
- Role: `USER`

### Authentication Context (`UnifiedAuthContext`)
- **Storage**: Uses `localStorage` with key `tofu-auth-session`
- **Session Data**: Stores user email, name, role, and login timestamp
- **Role Constants**:
  - `USER` - Regular end users
  - `BUSINESS_REAL_ESTATE` - Real estate business partners
  - `BUSINESS_DELIVERY` - Delivery business partners
  - `ADMIN` - System administrators

---

## User Flow (Regular Users)

### Entry Points
1. **Homepage** (`/`)
   - Public access
   - Features: Search hero, service grid, market feed
   - Can navigate to property listings, map, news, etc.

2. **Login Page** (`/login`)
   - Public access
   - Supports social login (Kakao, Naver, Google, Apple) - UI only, not implemented
   - Email/password login
   - Redirects after login based on role

### Post-Login Flow (Regular Users)
After successful login with regular user credentials:
1. Redirected to homepage (`/`)
2. Can access:
   - **MyPage** (`/mypage`) - Profile and activity history
   - **Property Listings** (`/category/:categoryId`)
   - **Property Details** (`/property/:id`)
   - **Map View** (`/map`)
   - **News** (`/news`, `/news/:id`)
   - **Community** (`/community`)
   - **Moving Service** (`/moving-service`, `/moving-registration`)
   - **Price Trends** (`/price-trends`)

### Protected Routes (Regular Users)
- `/mypage` - Requires authentication (any role can access)

### Public Routes (No Authentication Required)
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/faq` - FAQ page
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/property/:id` - Property details
- `/list-property` - List a property
- `/category/:categoryId` - Category listings
- `/map` - Map view
- `/news` - News list
- `/news/:id` - News detail
- `/moving-service` - Moving service info
- `/moving-registration` - Moving registration
- `/community` - Community landing
- `/price-trends` - Price trends

---

## Admin Flow

### Entry Points
1. **Login Page** (`/login`)
   - Enter admin credentials: `admin@tofu.com` / `Admin123!`
   - After login, automatically redirected to `/admin/dashboard`

2. **Direct Admin Routes** (Protected)
   - All routes under `/admin/*` require `ADMIN` role
   - Unauthorized access redirects to login

### Admin Dashboard Layout
**Path**: `/admin/*`
**Layout Component**: `AdminDashboardLayout`

**Sidebar Menu Items**:
1. 📊 **Dashboard** (`/admin/dashboard`) - Overview with KPIs
2. 🏢 **Partners** (`/admin/partners`) - Partner management
3. 👥 **Users** (`/admin/users`) - User management
4. 🏠 **Real-Estate Oversight** (`/admin/real-estate`) - Real estate oversight
5. 🚚 **Delivery Oversight** (`/admin/delivery`) - Delivery oversight
6. ✅ **Approvals & Reviews** (`/admin/approvals`) - Approval management
7. 💰 **Payments & Settlement** (`/admin/finance/settlements`) - Financial settlements
8. 📋 **Commissions & Pricing** (`/admin/finance/rules`) - Pricing rules
9. 🎫 **Support & Tickets** (`/admin/support/tickets`) - Support tickets
10. 📈 **Reports & Analytics** (`/admin/reports`) - Reports
11. 🔔 **Notifications** (`/admin/notifications`) - Notification management
12. 🔒 **Roles & Permissions** (`/admin/security/roles`) - Role management
13. 📝 **Audit Logs** (`/admin/security/audit-logs`) - Audit trail
14. ⚙️ **System Status** (`/admin/system/status`) - System monitoring
15. 📰 **News / Content** (`/admin/content/news`) - Content management
16. ⚙️ **Settings** (`/admin/settings`) - System settings

### Admin Dashboard Features

#### Dashboard Overview (`/admin/dashboard`)
- **KPIs Display**:
  - Total Users
  - Total Partners
  - Active Listings (Real-Estate)
  - Today's Orders (Delivery)
- **Recent Activity Feed**: Shows recent partner registrations, user signups, order creations
- **Performance Charts**: Weekly performance visualization

#### Admin Capabilities
1. **Partner Management** (`/admin/partners`)
   - View all business partners
   - Approve/reject partner applications
   - Manage partner status

2. **User Management** (`/admin/users`)
   - View all registered users
   - Manage user accounts
   - View user activity

3. **Real Estate Oversight** (`/admin/real-estate`)
   - Monitor real estate listings
   - Review contracts
   - Oversee real estate partner activities

4. **Delivery Oversight** (`/admin/delivery`)
   - Monitor delivery orders
   - Track delivery partner performance
   - Manage delivery operations

5. **Approvals & Reviews** (`/admin/approvals`)
   - Review pending approvals
   - Approve/reject partner applications
   - Manage content approvals

6. **Financial Management**
   - **Settlements** (`/admin/finance/settlements`): View and process financial settlements
   - **Pricing Rules** (`/admin/finance/rules`): Configure commission and pricing rules

7. **Support Management** (`/admin/support/tickets`)
   - View support tickets
   - Respond to customer inquiries
   - Track ticket status

8. **Reports & Analytics** (`/admin/reports`)
   - Generate system reports
   - View analytics dashboards
   - Export data

9. **Content Management** (`/admin/content/news`)
   - Create/edit news articles
   - Manage content
   - Publish/unpublish content

10. **Security & System**
    - **Roles & Permissions** (`/admin/security/roles`): Manage user roles and permissions
    - **Audit Logs** (`/admin/security/audit-logs`): View system audit trail
    - **System Status** (`/admin/system/status`): Monitor system health

### Admin Navigation Flow

```
Login (/login)
  ↓
Admin Dashboard (/admin/dashboard)
  ↓
[Sidebar Navigation]
  ├─ Partners Management
  ├─ User Management
  ├─ Real Estate Oversight
  ├─ Delivery Oversight
  ├─ Approvals
  ├─ Finance (Settlements, Rules)
  ├─ Support Tickets
  ├─ Reports
  ├─ Notifications
  ├─ Security (Roles, Audit Logs)
  ├─ System Status
  ├─ Content Management
  └─ Settings
```

### Admin Access to Business Features
Admins can also access business dashboard features:
- **Business Dashboard** (`/business/*`) - Has access to all business menu items
- Can view both real estate and delivery partner dashboards
- Admin menu includes combined features from both business types

---

## Business Partner Flows

### Real Estate Partner Flow

**Credentials**: `realestate@tofu.com` / `RealEstate123!`

**Dashboard Path**: `/business/real-estate/*`

**Menu Items**:
1. 대시보드 (`/business/real-estate/dashboard`) - Overview
2. 계약 내역 (`/business/real-estate/contracts`) - Contracts
3. 매물 관리 (`/business/real-estate/listings`) - Property listings
4. 예약 관리 (`/business/real-estate/reservations`) - Reservations
5. 광고 / 프로모션 (`/business/real-estate/ads`) - Ads/Promotions
6. 정산 / 통계 (`/business/real-estate/stats`) - Settlement/Statistics
7. 고객 관리 (`/business/real-estate/customers`) - Customer management
8. 설정 (`/business/real-estate/settings`) - Settings

### Delivery Partner Flow

**Credentials**: `delivery@tofu.com` / `Delivery123!`

**Dashboard Path**: `/business/*`

**Menu Items**:
1. 대시보드 (`/business/dashboard`) - Overview
2. 이사 / 견적 요청 (`/business/moving-requests`) - Moving/Quote requests
3. 배달 주문 관리 (`/business/delivery-orders`) - Delivery orders
4. 스케줄 / 차량 관리 (`/business/schedule`) - Schedule/Vehicle management
5. 정산 / 통계 (`/business/stats`) - Settlement/Statistics
6. 고객 관리 (`/business/customers`) - Customer management
7. 설정 (`/business/settings`) - Settings

---

## Route Protection System

### Protection Components

1. **RoleProtectedRoute** (`src/components/layout/RoleProtectedRoute.jsx`)
   - Requires specific roles
   - Redirects to login if not authenticated
   - Redirects to appropriate dashboard if wrong role

2. **UserProtectedRoute** (`src/router/UserProtectedRoute.jsx`)
   - Accepts `allowedRoles` array
   - Redirects to login if not authenticated
   - Redirects home if wrong role

### Route Protection Matrix

| Route Pattern | Required Role(s) | Redirect if Unauthorized |
|--------------|-----------------|-------------------------|
| `/admin/*` | `ADMIN` | `/login` → `/admin/dashboard` |
| `/business/*` | `BUSINESS_REAL_ESTATE`, `BUSINESS_DELIVERY`, `ADMIN` | `/login` → `/business` |
| `/business/real-estate/*` | `BUSINESS_REAL_ESTATE`, `ADMIN` | `/login` → `/business/real-estate` |
| `/mypage` | `USER`, `BUSINESS_REAL_ESTATE`, `BUSINESS_DELIVERY`, `ADMIN` | `/login` → `/mypage` |
| All other routes | Public | N/A |

---

## Login Flow Diagram

```
User visits protected route
  ↓
Not authenticated?
  ↓ YES
Redirect to /login (with return path in state)
  ↓
User enters credentials
  ↓
UnifiedAuthContext.login()
  ↓
Check credentials:
  ├─ Admin? → Set ADMIN role
  ├─ Business account? → Set BUSINESS_REAL_ESTATE or BUSINESS_DELIVERY
  └─ Regular user? → Set USER role
  ↓
Store session in localStorage
  ↓
Redirect based on role:
  ├─ ADMIN → /admin/dashboard
  ├─ BUSINESS_REAL_ESTATE → /business/real-estate/dashboard
  ├─ BUSINESS_DELIVERY → /business/dashboard
  └─ USER → / (homepage)
```

---

## Session Management

### Session Storage
- **Key**: `tofu-auth-session`
- **Data Structure**:
  ```json
  {
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER|BUSINESS_REAL_ESTATE|BUSINESS_DELIVERY|ADMIN",
    "loginAt": "2024-01-01T00:00:00.000Z"
  }
  ```

### Session Persistence
- Sessions persist across page refreshes
- Sessions cleared on logout
- No expiration mechanism (in current implementation)

---

## Key Features by Role

### Regular User (USER)
- ✅ Browse properties
- ✅ View property details
- ✅ Search on map
- ✅ Read news
- ✅ Access community features
- ✅ View price trends
- ✅ Access MyPage
- ❌ Access admin dashboard
- ❌ Access business dashboard

### Real Estate Partner (BUSINESS_REAL_ESTATE)
- ✅ All regular user features
- ✅ Access real estate business dashboard
- ✅ Manage property listings
- ✅ Manage contracts
- ✅ Manage reservations
- ✅ View analytics
- ✅ Manage customers
- ❌ Access admin dashboard (unless also admin)
- ❌ Access delivery dashboard

### Delivery Partner (BUSINESS_DELIVERY)
- ✅ All regular user features
- ✅ Access delivery business dashboard
- ✅ Manage moving requests
- ✅ Manage delivery orders
- ✅ Manage schedule/vehicles
- ✅ View settlement stats
- ❌ Access admin dashboard (unless also admin)
- ❌ Access real estate dashboard

### Admin (ADMIN)
- ✅ All regular user features
- ✅ Access admin dashboard
- ✅ Access all business dashboards
- ✅ Manage partners
- ✅ Manage users
- ✅ Oversee real estate operations
- ✅ Oversee delivery operations
- ✅ Manage approvals
- ✅ Financial management
- ✅ Content management
- ✅ System administration
- ✅ Security management

---

## Navigation Patterns

### Public Site Header Navigation
The header (`Header.jsx`) provides role-aware navigation:

**For Unauthenticated Users**:
- Login button → `/login`
- Signup button → `/signup`
- Public navigation links (Home, Map, Listings, Moving, Community)

**For Authenticated Regular Users**:
- Profile dropdown with:
  - "내 프로필" (My Profile) → `/mypage`
  - "로그아웃" (Logout) → Logs out and redirects to `/`
- Public navigation links remain accessible

**For Business Partners & Admins**:
- "대시보드로 이동" (Go to Dashboard) button:
  - Real Estate Partners → `/business/real-estate`
  - Delivery Partners → `/business`
  - Admins → `/admin`
- Profile dropdown with same options as regular users
- Public navigation links remain accessible

### Admin Navigation
- **Primary**: Admin dashboard sidebar
- **Secondary**: Top bar with search, notifications, profile
- **Quick Access**: "View Website" button to return to public site

### Business Partner Navigation
- **Primary**: Business dashboard sidebar (role-specific menu)
- **Secondary**: Top bar with page title and "웹사이트로 이동" button
- **Logout**: Sidebar footer button

### Regular User Navigation
- **Primary**: Header navigation (public site)
- **Secondary**: Footer links
- **User Actions**: MyPage access via header profile dropdown

---

## Security Considerations

### Current Implementation
- ✅ Role-based access control
- ✅ Route protection
- ✅ Session persistence
- ⚠️ No session expiration
- ⚠️ No password strength validation
- ⚠️ No rate limiting on login
- ⚠️ Social login not implemented (UI only)

### Recommendations for Production
1. Implement session expiration
2. Add password strength requirements
3. Implement rate limiting on login attempts
4. Add CSRF protection
5. Implement proper backend authentication
6. Add audit logging for sensitive actions
7. Implement two-factor authentication for admin accounts

---

## Testing Scenarios

### Admin Flow Testing
1. Login with `admin@tofu.com` / `Admin123!`
2. Verify redirect to `/admin/dashboard`
3. Navigate through all admin menu items
4. Verify access to business dashboards
5. Test logout functionality

### User Flow Testing
1. Login with any email/password
2. Verify redirect to homepage
3. Access MyPage
4. Browse properties
5. Test protected route access

### Business Partner Flow Testing
1. Login with business credentials
2. Verify redirect to appropriate dashboard
3. Test role-specific menu items
4. Verify cannot access admin routes
5. Test logout functionality

---

## Summary

The TOFU application implements a comprehensive role-based access control system with four distinct user roles:

1. **Regular Users** - Public-facing features, property browsing, community access
2. **Real Estate Partners** - Property management, contracts, reservations
3. **Delivery Partners** - Moving requests, delivery orders, scheduling
4. **Admin** - Full system oversight, partner/user management, financial controls

The authentication system uses a unified context (`UnifiedAuthContext`) that manages sessions via localStorage, with role-based route protection ensuring users only access appropriate features.

