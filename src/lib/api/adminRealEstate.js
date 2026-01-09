// Admin Real Estate API functions
// These will be replaced with actual API calls when backend is ready
import { updateListing } from '../../store/realEstateListingsStore';

const API_BASE = '/api/admin/real-estate';

/**
 * Get properties for admin oversight
 * @param {Object} filters - Filter parameters
 * @param {string} filters.status - Status filter (PENDING_APPROVAL, APPROVED, REJECTED)
 * @param {string} filters.partnerId - Partner ID filter
 * @param {string} filters.q - Search query (title, location, partner name)
 * @param {number} filters.page - Page number
 * @param {number} filters.pageSize - Page size
 * @returns {Promise<{items: Array, total: number}>}
 */
export const getAdminProperties = async (filters = {}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would be:
  // const params = new URLSearchParams(filters);
  // const response = await fetch(`${API_BASE}/properties?${params}`);
  // return await response.json();
  
  // For now, return mock data structure
  // This will be replaced with actual store calls in the component
  return {
    success: true,
    data: {
      items: [],
      total: 0
    }
  };
};

/**
 * Get property detail by ID for review
 * @param {string|number} id - Property ID
 * @returns {Promise<Object>}
 */
export const getAdminPropertyDetail = async (id) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_BASE}/properties/${id}`);
  // return await response.json();
  
  return {
    success: true,
    data: null
  };
};

/**
 * Approve a property
 * @param {string|number} id - Property ID
 * @param {Object} body - Request body
 * @param {string} body.note - Optional note
 * @returns {Promise<{status: string, lastUpdatedAt: string}>}
 */
export const approveProperty = async (id, body = {}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update store (for now, until real API is ready)
  updateListing(id, {
    status: 'APPROVED',
    lastUpdatedAt: new Date().toISOString()
  });
  
  // In a real app, this would be:
  // const response = await fetch(`${API_BASE}/properties/${id}/approve`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body)
  // });
  // return await response.json();
  
  return {
    success: true,
    data: {
      status: 'APPROVED',
      lastUpdatedAt: new Date().toISOString()
    }
  };
};

/**
 * Reject a property
 * @param {string|number} id - Property ID
 * @param {Object} body - Request body
 * @param {string} body.rejectionReason - Required rejection reason (min 10 chars)
 * @returns {Promise<{status: string, rejectionReason: string, lastUpdatedAt: string}>}
 */
export const rejectProperty = async (id, body) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update store (for now, until real API is ready)
  updateListing(id, {
    status: 'REJECTED',
    rejectionReason: body.rejectionReason,
    lastUpdatedAt: new Date().toISOString()
  });
  
  // In a real app, this would be:
  // const response = await fetch(`${API_BASE}/properties/${id}/reject`, {
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
      lastUpdatedAt: new Date().toISOString()
    }
  };
};

