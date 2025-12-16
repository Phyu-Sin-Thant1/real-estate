# Business Dashboards → Admin Dashboard Flow Documentation

## Overview

This document describes the complete flow from **Real-Estate Dashboard** and **Delivery Dashboard** to the **Admin Dashboard**, following the governance model:

- **Admin = Governance & Oversight Only**
- **Business = Operations Only**
- **Users = Consumption & Requests Only**

---

## Table of Contents

1. [Real-Estate Dashboard → Admin Flow](#real-estate-dashboard--admin-flow)
2. [Delivery Dashboard → Admin Flow](#delivery-dashboard--admin-flow)
3. [Partner Application Flow](#partner-application-flow)
4. [Support Ticket Flow](#support-ticket-flow)
5. [Data Storage & Persistence](#data-storage--persistence)
6. [Approval Workflow](#approval-workflow)
7. [Role-Based Access Control](#role-based-access-control)

---

## Real-Estate Dashboard → Admin Flow

### 1. Listing Submission Flow

#### Business Partner Action
**Location**: `/business/real-estate/listings/new`  
**Component**: `RealEstateListingCreatePage.jsx`

**Process**:
1. Real-Estate partner fills out listing form:
   - Title, Address, City
   - Property Type (Apartment, House, Office)
   - Price, Deposit, Monthly Rent
   - Area, Rooms, Bathrooms, Floor
   - Description, Contact Info
   - Images (placeholder for now)

2. On form submission:
   ```javascript
   // Creates listing with PENDING status
   const listing = {
     id: listingId,
     status: 'PENDING',  // ⚠️ Cannot go LIVE without admin approval
     createdAt: now,
     createdBy: partnerEmail,
     // ... listing data
   };

   // Creates approval request
   const approval = {
     id: `approval-${listingId}`,
     type: 'REAL_ESTATE_LISTING_CREATE',
     entityId: listingId,
     status: 'PENDING',
     submittedBy: partnerEmail,
     submittedAt: now,
   };

   // Saves both to localStorage
   addListingWithApproval({ listing, approval });
   ```

3. **Storage**:
   - Listing saved to: `tofu-realestate-listings` (localStorage)
   - Approval saved to: `tofu-approvals-queue` (localStorage)

#### Admin Review Process
**Location**: `/admin/approvals`  
**Component**: `AdminApprovalsPage.jsx`

**Admin Actions**:

1. **View Pending Approvals**:
   - Admin sees all `PENDING` approvals in the queue
   - Filter by type: "전체" or "파트너 신청"
   - View approval details in drawer

2. **Approve Listing**:
   ```javascript
   handleApprove(approvalId) {
     // Updates approval status
     updateApprovalStatus(approvalId, 'APPROVED');
     
     // Updates listing status to LIVE
     if (type === 'REAL_ESTATE_LISTING_CREATE') {
       updateListingStatus(entityId, 'LIVE');
     }
   }
   ```
   - Approval status: `PENDING` → `APPROVED`
   - Listing status: `PENDING` → `LIVE`
   - Listing becomes visible to users

3. **Reject Listing**:
   ```javascript
   handleReject(approvalId) {
     const reason = prompt('반려 사유를 입력하세요');
     updateApprovalStatus(approvalId, 'REJECTED', { rejectReason: reason });
     updateListingStatus(entityId, 'REJECTED');
   }
   ```
   - Approval status: `PENDING` → `REJECTED`
   - Listing status: `PENDING` → `REJECTED`
   - Partner can see rejection reason

#### Business Partner View After Submission

**Location**: `/business/real-estate/listings`  
**Component**: `RealEstateListingsPage.jsx`

- Partner sees their listings with status:
  - `PENDING` - Awaiting admin approval
  - `LIVE` / `노출중` - Approved and visible
  - `REJECTED` - Rejected by admin
- Partner can only edit/delete `LIVE` listings
- Partner cannot self-approve

### 2. Listing Management Flow

#### Business Partner Actions (Operations Only)
- **Create**: Submit new listing → Goes to `PENDING`
- **Edit**: Only allowed for `LIVE` listings
- **Toggle Visibility**: Hide/Show `LIVE` listings
- **Mark Complete**: Mark listing as sold/rented

#### Admin Oversight Actions (Governance Only)
**Location**: `/admin/real-estate` (Oversight Page)

- **View**: All listings (reported/risky ones highlighted)
- **Hide/Unhide**: Toggle listing visibility
- **No Editing**: Cannot edit listing details
- **No Contract Management**: Cannot manage contracts
- **No Booking Operations**: Cannot handle reservations

---

## Delivery Dashboard → Admin Flow

### 1. Delivery Operations Flow

#### Business Partner Actions
**Location**: `/business/delivery-orders`  
**Components**: `BusinessDeliveryOrdersPage.jsx`

**Operations**:
- View delivery orders
- Manage order status
- Assign drivers
- Update schedules

#### Admin Oversight Actions
**Location**: `/admin/delivery` (Oversight Page)

- **View**: Failed/disputed deliveries
- **Read-Only Details**: View delivery information
- **No Driver Assignment**: Cannot assign drivers
- **No Order Lifecycle Control**: Cannot change order status

### 2. Moving Request Flow

#### User Submission
**Location**: `/moving-registration`  
**Component**: `MovingRequestForm.jsx`

**Process**:
1. User submits moving request
2. Request appears in Delivery Partner dashboard
3. Partner can accept/decline (operational)

#### Admin Oversight
- Admin can view all moving requests
- Admin can see dispute/complaint history
- Admin cannot manage day-to-day operations

---

## Partner Application Flow

### 1. Public Application Submission

#### Company Application
**Location**: `/partner/apply` (Public Route)  
**Component**: `PartnerApplyPage.jsx`

**Process**:
1. Company fills application form:
   - Partner Type: Real-Estate or Delivery
   - Company Name, Business Registration No
   - Contact Person, Email, Phone
   - Address, Service Area
   - Website/SNS, Message
   - Terms Agreement

2. On submission:
   ```javascript
   const application = {
     id: `partner-${Date.now()}`,
     type: form.type, // 'REAL_ESTATE' or 'DELIVERY'
     status: 'PENDING',
     // ... application data
   };

   const approval = {
     id: `approval-${applicationId}`,
     type: 'PARTNER_APPLICATION',
     entityId: applicationId,
     status: 'PENDING',
     submittedBy: application.email,
   };

   addPartnerApplicationWithApproval({ application, approval });
   ```

3. **Storage**:
   - Application saved to: `tofu-partner-applications` (localStorage)
   - Approval saved to: `tofu-approvals-queue` (localStorage)

### 2. Admin Approval Process

**Location**: `/admin/approvals`  
**Component**: `AdminApprovalsPage.jsx`

#### Approve Partner Application
```javascript
handleApprove(approvalId) {
  if (type === 'PARTNER_APPLICATION') {
    const app = partnerApps.find(p => p.id === entityId);
    
    // Creates business account
    addBusinessAccountFromApplication({
      application: app,
      tempPassword: 'Temp123!'
    });
    
    // Updates application status
    updatePartnerApplicationStatus(app.id, 'APPROVED');
  }
}
```

**Result**:
- Application status: `PENDING` → `APPROVED`
- Business account created in `tofu-business-accounts`
- Account details:
  - Email: From application
  - Role: `BUSINESS_REAL_ESTATE` or `BUSINESS_DELIVERY`
  - Temp Password: `Temp123!`
  - Status: `ACTIVE`

#### Reject Partner Application
```javascript
handleReject(approvalId) {
  const reason = prompt('반려 사유를 입력하세요');
  updatePartnerApplicationStatus(entityId, 'REJECTED', reason);
}
```

**Result**:
- Application status: `PENDING` → `REJECTED`
- Rejection reason stored
- No business account created

### 3. Partner Login After Approval

**Location**: `/login`  
**Context**: `UnifiedAuthContext.jsx`

**Process**:
1. Partner uses email from application
2. First login: Use temp password `Temp123!`
3. System checks `tofu-business-accounts`:
   ```javascript
   const businessAccounts = loadBusinessAccounts();
   const account = businessAccounts.find(acc => 
     acc.email === normalizedEmail && 
     acc.tempPassword === password
   );
   
   if (account) {
     // Login successful
     // Role: BUSINESS_REAL_ESTATE or BUSINESS_DELIVERY
   }
   ```

4. Redirects to appropriate dashboard:
   - `BUSINESS_REAL_ESTATE` → `/business/real-estate/dashboard`
   - `BUSINESS_DELIVERY` → `/business/dashboard`

---

## Support Ticket Flow

### 1. User Support Request

#### User Submission
**Location**: `/support` (User Route)  
**Component**: `UserSupportPage.jsx`

**Process**:
1. User selects issue type:
   - Delivery
   - Real Estate
   - Account
   - Other

2. If Delivery: Select related order
3. If Real Estate: Select related listing
4. Enter message

5. On submission:
   ```javascript
   const ticket = {
     id: `ticket-${Date.now()}`,
     createdBy: user.email,
     role: 'USER',
     issueType: type, // 'DELIVERY', 'REAL_ESTATE', etc.
     relatedEntityType: 'DELIVERY_ORDER' | 'REAL_ESTATE_LISTING' | 'NONE',
     relatedEntityId: selectedOrderId | selectedListingId | null,
     partnerId: order.partnerId | listing.partnerId | null,
     partnerName: order.partnerName | listing.partnerName | null,
     subject: auto-generated,
     message: userMessage,
     status: 'OPEN',
     createdAt: now,
   };

   createTicket(ticket); // Saves to tofu-support-tickets
   ```

6. **Storage**: `tofu-support-tickets` (localStorage)

### 2. Admin Resolution

**Location**: `/admin/support/tickets`  
**Component**: `AdminSupportTicketsPage.jsx`

**Admin Actions**:
1. **View All Tickets**:
   - Filter by status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
   - Filter by issue type: Delivery, Real Estate, Account, Other
   - View ticket details in drawer

2. **Update Ticket Status**:
   ```javascript
   updateTicket(ticketId, {
     status: 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
     adminNote: 'Internal note (user cannot see)',
     updatedAt: now,
   });
   ```

3. **View Related Entity**:
   - See related order/listing details
   - See partner information
   - Understand context immediately

### 3. User View Updates

**Location**: `/mypage/support`  
**Component**: `MySupportTicketsPage.jsx`

- User sees their tickets
- Status updates reflect admin changes
- User cannot see admin internal notes
- User can create new tickets

---

## Data Storage & Persistence

### LocalStorage Keys

| Key | Purpose | Structure |
|-----|---------|-----------|
| `tofu-realestate-listings` | Real-estate listings | Array of listing objects |
| `tofu-approvals-queue` | Approval requests | Array of approval objects |
| `tofu-partner-applications` | Partner applications | Array of application objects |
| `tofu-business-accounts` | Business partner accounts | Array of account objects |
| `tofu-support-tickets` | Support tickets | Array of ticket objects |
| `tofu-auth-session` | Current user session | Single session object |
| `tofu-lang` | Language preference | String: 'ko' or 'en' |

### Data Flow Diagram

```
Business Partner
    │
    ├─→ Create Listing
    │   └─→ localStorage: tofu-realestate-listings (status: PENDING)
    │       └─→ localStorage: tofu-approvals-queue (type: REAL_ESTATE_LISTING_CREATE)
    │
    ├─→ Submit Partner Application
    │   └─→ localStorage: tofu-partner-applications (status: PENDING)
    │       └─→ localStorage: tofu-approvals-queue (type: PARTNER_APPLICATION)
    │
    └─→ Manage Operations
        └─→ (No approval needed for day-to-day operations)

Admin Dashboard
    │
    ├─→ Review Approvals (/admin/approvals)
    │   ├─→ Approve Listing
    │   │   └─→ Update listing status: PENDING → LIVE
    │   │       └─→ Update approval status: PENDING → APPROVED
    │   │
    │   ├─→ Reject Listing
    │   │   └─→ Update listing status: PENDING → REJECTED
    │   │       └─→ Update approval status: PENDING → REJECTED
    │   │
    │   ├─→ Approve Partner Application
    │   │   └─→ Create business account in tofu-business-accounts
    │   │       └─→ Update application status: PENDING → APPROVED
    │   │
    │   └─→ Reject Partner Application
    │       └─→ Update application status: PENDING → REJECTED
    │
    ├─→ Oversight Pages
    │   ├─→ /admin/real-estate (Read-only oversight)
    │   └─→ /admin/delivery (Read-only oversight)
    │
    └─→ Support Tickets (/admin/support/tickets)
        └─→ Update ticket status and add internal notes

User
    │
    ├─→ Submit Support Ticket
    │   └─→ localStorage: tofu-support-tickets (status: OPEN)
    │
    └─→ View Ticket Status
        └─→ Read from tofu-support-tickets (filtered by user email)
```

---

## Approval Workflow

### Approval States

| State | Description | Who Can See |
|-------|-------------|-------------|
| `PENDING` | Awaiting admin review | Business Partner, Admin |
| `APPROVED` | Approved by admin | Business Partner, Admin |
| `REJECTED` | Rejected by admin | Business Partner, Admin |

### Approval Types

| Type | Entity | Business Action | Admin Action |
|------|--------|----------------|--------------|
| `REAL_ESTATE_LISTING_CREATE` | Listing | Submit listing | Approve → Listing becomes LIVE<br>Reject → Listing becomes REJECTED |
| `PARTNER_APPLICATION` | Application | Submit application | Approve → Create business account<br>Reject → Store rejection reason |

### Approval Process Steps

1. **Submission** (Business Partner)
   - Creates entity with `PENDING` status
   - Creates approval request
   - Both saved to localStorage

2. **Notification** (Admin)
   - Admin sees new approval in `/admin/approvals`
   - Approval appears in queue

3. **Review** (Admin)
   - Admin views details
   - Admin makes decision

4. **Decision** (Admin)
   - **Approve**: Updates entity status, updates approval status
   - **Reject**: Updates entity status, stores rejection reason

5. **Result** (Business Partner)
   - Partner sees updated status in their dashboard
   - Can take next action based on result

---

## Role-Based Access Control

### Route Protection

#### Business Routes
- `/business/*` - Allowed: `BUSINESS_REAL_ESTATE`, `BUSINESS_DELIVERY`
- `/business/real-estate/*` - Allowed: `BUSINESS_REAL_ESTATE`
- **ADMIN is explicitly excluded** from business routes

#### Admin Routes
- `/admin/*` - Allowed: `ADMIN` only
- Admin cannot access `/business/*` routes

### Permission Matrix

| Action | Business Partner | Admin |
|--------|-----------------|-------|
| Create Listing | ✅ Submit (PENDING) | ❌ Cannot create |
| Approve Listing | ❌ Cannot approve | ✅ Approve/Reject |
| Edit Listing | ✅ Edit LIVE listings | ❌ Read-only oversight |
| View All Listings | ❌ Only own listings | ✅ All listings |
| Submit Partner App | ✅ Public route | ❌ Cannot submit |
| Approve Partner App | ❌ Cannot approve | ✅ Approve/Reject |
| Create Business Account | ❌ Cannot create | ✅ On approval |
| Manage Operations | ✅ Full access | ❌ Oversight only |
| View Oversight Data | ❌ No access | ✅ Full access |

### Navigation Rules

#### Business Dashboard Header
- **View Website** button: Navigate to public homepage
- **Language Toggle**: KO/EN switch
- **No Admin Dashboard link**: Business partners cannot access admin

#### Admin Dashboard Header
- **View Website** button: Navigate to public homepage (opens in new tab)
- **Language Toggle**: KO/EN switch
- **No Business Dashboard link**: Admin cannot access business dashboards

---

## Key Principles

### 1. Separation of Concerns
- **Business = Operations**: Day-to-day management, submissions
- **Admin = Governance**: Approvals, oversight, policy enforcement
- **No Overlap**: Business cannot approve, Admin cannot operate

### 2. Approval-Required Actions
All critical actions require admin approval:
- ✅ New listing submissions
- ✅ Partner applications
- ❌ Day-to-day operations (no approval needed)

### 3. Status-Based Workflow
- Entities start as `PENDING`
- Admin action changes status to `APPROVED` or `REJECTED`
- Business partner sees status updates immediately

### 4. Data Persistence
- All data stored in localStorage (mock backend)
- Shared storage keys ensure data consistency
- No API calls (MVP implementation)

### 5. Audit Trail
- All approvals tracked with timestamps
- Rejection reasons stored
- Status changes logged

---

## Implementation Files

### Business Partner Components
- `src/pages/business/real-estate/RealEstateListingCreatePage.jsx` - Listing submission
- `src/pages/business/real-estate/RealEstateListingsPage.jsx` - Listing management
- `src/pages/business/delivery/*` - Delivery operations

### Admin Components
- `src/pages/admin/AdminApprovalsPage.jsx` - Approval management
- `src/pages/admin/AdminSupportTicketsPage.jsx` - Support ticket resolution
- `src/pages/admin/AdminRealEstateOversightPage.jsx` - Real-estate oversight
- `src/pages/admin/AdminDeliveryOversightPage.jsx` - Delivery oversight

### Storage Helpers
- `src/lib/helpers/realEstateStorage.js` - Listing & approval storage
- `src/lib/helpers/supportStorage.js` - Support ticket storage
- `src/store/supportTicketsStore.js` - Centralized ticket store

### Public Components
- `src/pages/PartnerApplyPage.jsx` - Partner application form
- `src/pages/UserSupportPage.jsx` - User support ticket form

---

## Testing Checklist

### Real-Estate Flow
- [ ] Partner can submit listing → Status: PENDING
- [ ] Admin sees approval in queue
- [ ] Admin can approve → Listing becomes LIVE
- [ ] Admin can reject → Listing becomes REJECTED
- [ ] Partner sees status update
- [ ] Partner cannot self-approve

### Partner Application Flow
- [ ] Company can submit application → Status: PENDING
- [ ] Admin sees application in queue
- [ ] Admin can approve → Business account created
- [ ] Admin can reject → Rejection reason stored
- [ ] Approved partner can login with temp password

### Support Ticket Flow
- [ ] User can submit ticket → Status: OPEN
- [ ] Admin sees ticket in support page
- [ ] Admin can update status
- [ ] Admin can add internal notes
- [ ] User sees status updates (not admin notes)

### Access Control
- [ ] Admin cannot access `/business/*` routes
- [ ] Business cannot access `/admin/*` routes
- [ ] Business cannot approve own submissions
- [ ] Admin cannot operate (only oversee)

---

## Future Enhancements

1. **Real API Integration**
   - Replace localStorage with backend API
   - Add authentication tokens
   - Implement real-time updates

2. **Notification System**
   - Email notifications on approval/rejection
   - In-app notifications
   - Push notifications

3. **Audit Logging**
   - Track all admin actions
   - Log status changes
   - Immutable audit trail

4. **Advanced Filtering**
   - Filter approvals by date, type, partner
   - Search functionality
   - Bulk actions

5. **Reporting**
   - Approval metrics
   - Partner performance
   - System health

---

## Conclusion

The flow from Business Dashboards to Admin Dashboard follows a strict governance model:

- **Business partners operate** (create, manage, submit)
- **Admin governs** (approve, reject, oversee)
- **Clear boundaries** (no role overlap)
- **Status-driven workflow** (PENDING → APPROVED/REJECTED)
- **Centralized approvals** (all in `/admin/approvals`)

This ensures proper separation of concerns and maintains system integrity.

