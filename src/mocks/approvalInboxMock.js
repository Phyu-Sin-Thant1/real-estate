// Mock approval inbox data for Admin Dashboard
// This will be replaced with API calls when backend is ready

const now = new Date();
const getDateOffset = (days) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockApprovalInboxItems = [
  // REAL_ESTATE - Partner Registration
  {
    id: 'approval-re-1',
    domain: 'REAL_ESTATE',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'Ulaan Homes',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(5),
    status: 'APPROVED'
  },
  {
    id: 'approval-re-2',
    domain: 'REAL_ESTATE',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'Seoul Premium Properties',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(2),
    status: 'PENDING'
  },
  {
    id: 'approval-re-3',
    domain: 'REAL_ESTATE',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'Gangnam Realty Group',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(10),
    status: 'REJECTED',
    rejectionReason: 'Incomplete documentation provided. Please resubmit with all required business licenses and registration certificates.'
  },
  
  // REAL_ESTATE - Property Approval
  {
    id: 'approval-re-4',
    domain: 'REAL_ESTATE',
    requestType: 'PROPERTY_APPROVAL',
    requesterName: 'Golden Land Co.',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(1),
    status: 'PENDING'
  },
  {
    id: 'approval-re-5',
    domain: 'REAL_ESTATE',
    requestType: 'PROPERTY_APPROVAL',
    requesterName: 'Premium Housing Solutions',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(3),
    status: 'PENDING'
  },
  {
    id: 'approval-re-6',
    domain: 'REAL_ESTATE',
    requestType: 'PROPERTY_APPROVAL',
    requesterName: 'Luxury Estates Ltd.',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(7),
    status: 'APPROVED'
  },
  {
    id: 'approval-re-7',
    domain: 'REAL_ESTATE',
    requestType: 'PROPERTY_APPROVAL',
    requesterName: 'Metro Real Estate',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(12),
    status: 'REJECTED',
    rejectionReason: 'Property information incomplete. Missing required fields: property images, detailed address, and floor plan.'
  },
  
  // DELIVERY - Partner Registration
  {
    id: 'approval-del-1',
    domain: 'DELIVERY',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'TOFU Express Partner',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(8),
    status: 'REJECTED',
    rejectionReason: 'Business license verification failed. The provided license number does not match our records. Please verify and resubmit.'
  },
  {
    id: 'approval-del-2',
    domain: 'DELIVERY',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'Fast Track Logistics',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(4),
    status: 'PENDING'
  },
  {
    id: 'approval-del-3',
    domain: 'DELIVERY',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'City Delivery Services',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(15),
    status: 'APPROVED'
  },
  
  // DELIVERY - Package Approval
  {
    id: 'approval-del-4',
    domain: 'DELIVERY',
    requestType: 'PACKAGE_APPROVAL',
    requesterName: 'Swift Rider LLC',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(0),
    status: 'PENDING'
  },
  {
    id: 'approval-del-5',
    domain: 'DELIVERY',
    requestType: 'PACKAGE_APPROVAL',
    requesterName: 'Express Courier Co.',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(6),
    status: 'PENDING'
  },
  {
    id: 'approval-del-6',
    domain: 'DELIVERY',
    requestType: 'PACKAGE_APPROVAL',
    requesterName: 'Reliable Transport Inc.',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(9),
    status: 'APPROVED'
  },
  {
    id: 'approval-del-7',
    domain: 'DELIVERY',
    requestType: 'PACKAGE_APPROVAL',
    requesterName: 'Quick Move Services',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(11),
    status: 'REJECTED',
    rejectionReason: 'Pricing structure does not meet platform standards. Base price exceeds maximum allowed threshold. Please adjust pricing and resubmit.'
  },
  
  // Additional mixed entries
  {
    id: 'approval-re-8',
    domain: 'REAL_ESTATE',
    requestType: 'PROPERTY_APPROVAL',
    requesterName: 'Urban Living Realty',
    requesterType: 'Business Real-Estate',
    requestedAt: getDateOffset(13),
    status: 'APPROVED'
  },
  {
    id: 'approval-del-8',
    domain: 'DELIVERY',
    requestType: 'PARTNER_REGISTRATION',
    requesterName: 'Next Day Delivery',
    requesterType: 'Business Delivery',
    requestedAt: getDateOffset(14),
    status: 'PENDING'
  }
];

