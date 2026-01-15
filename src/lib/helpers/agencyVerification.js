/**
 * Helper functions for agency verification status
 * Maps agency data to business accounts to get verification status
 */

import { getBusinessAccounts } from '../../store/businessAccountsStore';

/**
 * Get verification status for a delivery agency
 * @param {Object} agency - Agency object from agencies.js
 * @returns {boolean} Whether the agency is verified
 */
export const getAgencyVerificationStatus = (agency) => {
  if (!agency) return false;
  
  // For delivery agencies, check business accounts
  const businessAccounts = getBusinessAccounts();
  
  // Try to find matching business account by company name or email
  const matchingAccount = businessAccounts.find(
    acc => acc.role === 'BUSINESS_DELIVERY' && 
    (acc.companyName === agency.name || 
     acc.email?.toLowerCase().includes(agency.name.toLowerCase()) ||
     agency.name.toLowerCase().includes(acc.companyName?.toLowerCase()) ||
     acc.companyName?.toLowerCase().includes(agency.name.toLowerCase()))
  );
  
  if (matchingAccount) {
    return matchingAccount.isVerified || false;
  }
  
  // Fallback to agency.verified if no business account match
  return agency.verified || false;
};

/**
 * Get all verified delivery agencies
 * @param {Array} agencies - Array of agency objects
 * @returns {Array} Filtered array of verified agencies
 */
export const getVerifiedAgencies = (agencies) => {
  return agencies.filter(agency => getAgencyVerificationStatus(agency));
};




