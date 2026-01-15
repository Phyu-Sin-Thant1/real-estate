// Admin Approvals API functions
// These will be replaced with actual API calls when backend is ready
import { updateApproval } from '../../store/approvalsStore';
import { updateApplication } from '../../store/partnerApplicationsStore';
import { createBusinessAccountFromApplication } from '../../store/businessAccountsStore';

const API_BASE = '/api/admin/approvals';

/**
 * Get approvals for admin oversight
 * @param {Object} filters - Filter parameters
 * @param {string} filters.type - Approval type filter (PARTNER_REGISTRATION, etc.)
 * @param {string} filters.status - Status filter (PENDING, APPROVED, REJECTED)
 * @param {number} filters.page - Page number
 * @param {number} filters.pageSize - Page size
 * @returns {Promise<{items: Array, total: number}>}
 */
export const getAdminApprovals = async (filters = {}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would be:
  // const params = new URLSearchParams(filters);
  // const response = await fetch(`${API_BASE}?${params}`);
  // return await response.json();
  
  return {
    success: true,
    data: {
      items: [],
      total: 0
    }
  };
};

/**
 * Get approval detail by ID for review
 * @param {string|number} id - Approval ID
 * @returns {Promise<Object>}
 */
export const getAdminApprovalDetail = async (id) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_BASE}/${id}`);
  // return await response.json();
  
  return {
    success: true,
    data: null
  };
};

/**
 * Approve an approval request
 * @param {string|number} id - Approval ID
 * @param {Object} body - Request body
 * @param {string} body.note - Optional note
 * @returns {Promise<{status: string, reviewedAt: string}>}
 */
export const approveApproval = async (id, body = {}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update store (for now, until real API is ready)
  const reviewedAt = new Date().toISOString();
  updateApproval(id, {
    status: 'APPROVED',
    reviewedAt
  });
  
  // In a real app, this would be:
  // const response = await fetch(`${API_BASE}/${id}/approve`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body)
  // });
  // return await response.json();
  
  return {
    success: true,
    data: {
      status: 'APPROVED',
      reviewedAt
    }
  };
};

/**
 * Reject an approval request
 * @param {string|number} id - Approval ID
 * @param {Object} body - Request body
 * @param {string} body.rejectionReason - Required rejection reason (min length required)
 * @returns {Promise<{status: string, rejectionReason: string, reviewedAt: string}>}
 */
export const rejectApproval = async (id, body) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update store (for now, until real API is ready)
  const reviewedAt = new Date().toISOString();
  updateApproval(id, {
    status: 'REJECTED',
    rejectionReason: body.rejectionReason,
    reviewedAt
  });
  
  // In a real app, this would be:
  // const response = await fetch(`${API_BASE}/${id}/reject`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body)
  // });
  // return await response.json();
  
  return {
    success: true,
    data: {
      status: 'REJECTED',
      rejectionReason: body.rejectionReason,
      reviewedAt
    }
  };
};






