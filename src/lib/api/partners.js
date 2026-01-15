/**
 * API functions for partner management
 * Mock implementation using localStorage stores
 */

import { 
  getBusinessAccounts, 
  getBusinessAccountByEmail,
  getDeliveryPartners,
  updateDeliveryPartnerVerification 
} from '../../store/businessAccountsStore';

/**
 * Get all delivery partners
 * @returns {Promise<Array>} Array of delivery partner objects
 */
export const getDeliveryPartnersAPI = async () => {
  try {
    const partners = getDeliveryPartners();
    return {
      success: true,
      data: partners,
    };
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch delivery partners',
      data: [],
    };
  }
};

/**
 * Update delivery partner verification status
 * @param {string} partnerId - Partner email or ID
 * @param {boolean} isVerified - Verification status
 * @param {string} verifiedBy - Admin user identifier
 * @returns {Promise<Object>} Updated partner object
 */
export const updateDeliveryPartnerVerificationAPI = async (partnerId, isVerified, verifiedBy) => {
  try {
    // Find partner by email or ID
    const partner = getBusinessAccountByEmail(partnerId) || 
                    getBusinessAccounts().find(p => p.id === partnerId);
    
    if (!partner) {
      return {
        success: false,
        error: 'Partner not found',
      };
    }
    
    // Validate: Only DELIVERY partners can be verified
    if (partner.role !== 'BUSINESS_DELIVERY') {
      return {
        success: false,
        error: 'Verification only available for delivery partners',
      };
    }
    
    // Validate: Can only verify if status is ACTIVE
    if (isVerified && partner.status !== 'ACTIVE') {
      return {
        success: false,
        error: `Cannot verify partner with status: ${partner.status}. Status must be ACTIVE.`,
      };
    }
    
    const updated = updateDeliveryPartnerVerification(partner.email, isVerified, verifiedBy);
    
    if (!updated) {
      return {
        success: false,
        error: 'Failed to update verification status',
      };
    }
    
    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error('Error updating partner verification:', error);
    return {
      success: false,
      error: error.message || 'Failed to update verification status',
    };
  }
};




