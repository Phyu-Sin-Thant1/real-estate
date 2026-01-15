// Partner Discount Usage store - manages partner enable/disable toggle for PARTNER discounts
const STORAGE_KEY = 'tofu-partner-discount-usage';

const safeRead = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.warn('Failed to parse localStorage value', e);
    return fallback;
  }
};

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write localStorage value', e);
  }
};

/**
 * Get all partner discount usage records
 * @returns {Array} Array of usage records
 */
export const getPartnerDiscountUsages = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get usage record for a specific discount and partner
 * @param {string} discountId - Discount ID
 * @param {string} partnerId - Partner ID (email or partner identifier)
 * @returns {Object|null} Usage record or null
 */
export const getPartnerDiscountUsage = (discountId, partnerId) => {
  const usages = getPartnerDiscountUsages();
  return usages.find(
    (u) => u.discountId === discountId && u.partnerId === partnerId
  ) || null;
};

/**
 * Check if a discount is enabled for a partner
 * @param {string} discountId - Discount ID
 * @param {string} partnerId - Partner ID
 * @returns {boolean} True if enabled
 */
export const isDiscountEnabledForPartner = (discountId, partnerId) => {
  const usage = getPartnerDiscountUsage(discountId, partnerId);
  return usage ? usage.isEnabled : false; // Default to false (OFF)
};

/**
 * Initialize usage records for a new PARTNER discount
 * Creates default records (isEnabled=false) for all eligible partners
 * @param {string} discountId - Discount ID
 * @param {string} scope - Discount scope (REAL_ESTATE or DELIVERY)
 * @param {"ALL_PARTNERS_IN_DOMAIN" | "SELECT_PARTNERS"} eligiblePartnerMode - Partner eligibility mode
 * @param {string[]} [partnerIds] - Partner IDs if SELECT_PARTNERS
 */
export const initializeDiscountUsage = (discountId, scope, eligiblePartnerMode, partnerIds = []) => {
  const usages = getPartnerDiscountUsages();
  
  // Get all business accounts filtered by scope
  const { getBusinessAccounts } = require('./businessAccountsStore');
  const allPartners = getBusinessAccounts();
  
  // Filter partners by scope
  const roleFilter = scope === 'REAL_ESTATE' ? 'BUSINESS_REAL_ESTATE' : 'BUSINESS_DELIVERY';
  const scopePartners = allPartners.filter(
    (p) => p.role === roleFilter && p.status === 'ACTIVE'
  );
  
  // Determine which partners are eligible
  let eligiblePartners = [];
  if (eligiblePartnerMode === 'ALL_PARTNERS_IN_DOMAIN') {
    eligiblePartners = scopePartners;
  } else if (eligiblePartnerMode === 'SELECT_PARTNERS') {
    eligiblePartners = scopePartners.filter((p) => 
      partnerIds.includes(p.email) || partnerIds.includes(p.id)
    );
  }
  
  // Create usage records for eligible partners (only if they don't exist)
  const now = new Date().toISOString();
  eligiblePartners.forEach((partner) => {
    const partnerId = partner.email || partner.id;
    const existing = usages.find(
      (u) => u.discountId === discountId && u.partnerId === partnerId
    );
    
    if (!existing) {
      usages.push({
        id: `pdu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        discountId,
        partnerId,
        isEnabled: false, // Default OFF
        enabledAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  });
  
  safeWrite(STORAGE_KEY, usages);
  return usages;
};

/**
 * Enable a discount for a partner
 * @param {string} discountId - Discount ID
 * @param {string} partnerId - Partner ID
 * @returns {Object|null} Updated usage record or null
 */
export const enableDiscountForPartner = (discountId, partnerId) => {
  const usages = getPartnerDiscountUsages();
  let usage = usages.find(
    (u) => u.discountId === discountId && u.partnerId === partnerId
  );
  
  const now = new Date().toISOString();
  
  if (usage) {
    usage.isEnabled = true;
    usage.enabledAt = now;
    usage.updatedAt = now;
  } else {
    // Create new usage record
    usage = {
      id: `pdu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      discountId,
      partnerId,
      isEnabled: true,
      enabledAt: now,
      createdAt: now,
      updatedAt: now,
    };
    usages.push(usage);
  }
  
  safeWrite(STORAGE_KEY, usages);
  return usage;
};

/**
 * Disable a discount for a partner
 * @param {string} discountId - Discount ID
 * @param {string} partnerId - Partner ID
 * @returns {Object|null} Updated usage record or null
 */
export const disableDiscountForPartner = (discountId, partnerId) => {
  const usages = getPartnerDiscountUsages();
  const usage = usages.find(
    (u) => u.discountId === discountId && u.partnerId === partnerId
  );
  
  if (!usage) return null;
  
  usage.isEnabled = false;
  usage.enabledAt = null;
  usage.updatedAt = new Date().toISOString();
  
  safeWrite(STORAGE_KEY, usages);
  return usage;
};

/**
 * Toggle discount for a partner
 * @param {string} discountId - Discount ID
 * @param {string} partnerId - Partner ID
 * @returns {Object|null} Updated usage record or null
 */
export const toggleDiscountForPartner = (discountId, partnerId) => {
  const current = isDiscountEnabledForPartner(discountId, partnerId);
  if (current) {
    return disableDiscountForPartner(discountId, partnerId);
  } else {
    return enableDiscountForPartner(discountId, partnerId);
  }
};

/**
 * Get all discounts enabled for a partner
 * @param {string} partnerId - Partner ID
 * @returns {Array} Array of discount IDs
 */
export const getEnabledDiscountsForPartner = (partnerId) => {
  const usages = getPartnerDiscountUsages();
  return usages
    .filter((u) => u.partnerId === partnerId && u.isEnabled)
    .map((u) => u.discountId);
};

/**
 * Get all usage records for a discount
 * @param {string} discountId - Discount ID
 * @returns {Array} Array of usage records
 */
export const getUsageRecordsForDiscount = (discountId) => {
  const usages = getPartnerDiscountUsages();
  return usages.filter((u) => u.discountId === discountId);
};

/**
 * Delete all usage records for a discount (when discount is deleted)
 * @param {string} discountId - Discount ID
 * @returns {boolean} Success
 */
export const deleteUsageRecordsForDiscount = (discountId) => {
  const usages = getPartnerDiscountUsages();
  const filtered = usages.filter((u) => u.discountId !== discountId);
  safeWrite(STORAGE_KEY, filtered);
  return filtered.length < usages.length;
};





