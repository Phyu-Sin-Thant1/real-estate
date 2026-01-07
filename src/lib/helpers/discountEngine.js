import { getPartnerDiscounts } from '../../store/partnerDiscountsStore';
import { getPlatformCampaigns } from '../../store/platformCampaignsStore';
import { getDiscountToggleState } from '../../store/discountToggleStore';
import { isCouponEnabled } from '../../store/couponToggleStore';

/**
 * Get applicable discount for a given context
 * Priority: Platform Campaign > Partner Discount
 * @param {Object} params - Search parameters
 * @param {string} params.partnerId - Partner ID
 * @param {string} params.scope - Scope ('REAL_ESTATE' | 'DELIVERY' | 'ALL')
 * @param {string} params.entityType - Entity type ('LISTING' | 'SERVICE' | 'NONE')
 * @param {string} params.entityId - Entity ID (optional)
 * @param {Date} params.now - Current date (defaults to now)
 * @returns {Object|null} Applicable discount object or null
 */
export function getApplicableDiscount({ partnerId, scope, entityType, entityId, now = new Date() }) {
  if (!partnerId) return null;

  const currentDate = now instanceof Date ? now : new Date(now);

  // Priority 1: Check Platform Campaigns (admin-controlled)
  // For DELIVERY scope, check if discount usage is enabled globally
  if (scope === 'DELIVERY') {
    const isDiscountEnabled = getDiscountToggleState();
    if (!isDiscountEnabled) {
      return null; // Discounts are disabled for delivery
    }
  }

  try {
    const platformCampaigns = getPlatformCampaigns();
    const applicableCampaign = platformCampaigns.find((campaign) => {
      // Must be LIVE
      if (campaign.status !== 'LIVE') return false;

      // Check date range
      const startAt = campaign.startAt ? new Date(campaign.startAt) : null;
      const endAt = campaign.endAt ? new Date(campaign.endAt) : null;
      if (startAt && currentDate < startAt) return false;
      if (endAt && currentDate > endAt) return false;

      // Check scope
      if (campaign.scope !== 'ALL' && campaign.scope !== scope) return false;

      // Check target mode
      if (campaign.targetMode === 'PARTNER_IDS') {
        if (!campaign.partnerIds || !campaign.partnerIds.includes(partnerId)) return false;
      } else if (campaign.targetMode === 'CATEGORY') {
        // Category matching logic (if needed)
        // For now, skip category filtering
      }

      // Check usage limit
      if (campaign.usageLimit && campaign.usedCount >= campaign.usageLimit) return false;

      return true;
    });

    if (applicableCampaign) {
      // Check if this specific coupon is enabled by the delivery agency
      if (!isCouponEnabled(applicableCampaign.id)) {
        // Skip this coupon if it's disabled
        return null;
      }

      return {
        id: applicableCampaign.id,
        title: applicableCampaign.title,
        description: applicableCampaign.description,
        discountType: applicableCampaign.discountType,
        value: applicableCampaign.value,
        minAmount: applicableCampaign.minAmount,
        maxDiscount: applicableCampaign.maxDiscount,
        stacking: applicableCampaign.stacking || 'NONE',
        type: 'PLATFORM_CAMPAIGN',
      };
    }
  } catch (e) {
    // Platform campaigns store might not exist yet
    console.warn('Error reading platform campaigns:', e);
  }

  // Priority 2: Check Partner Discounts
  // For DELIVERY scope, check if discount usage is enabled
  if (scope === 'DELIVERY') {
    const isDiscountEnabled = getDiscountToggleState();
    if (!isDiscountEnabled) {
      return null; // Discounts are disabled for delivery
    }
  }

  try {
    const partnerDiscounts = getPartnerDiscounts();
    const applicableDiscount = partnerDiscounts.find((discount) => {
      // Must match partner (handle different formats)
      // Discounts use format: 'partner-{email-prefix}' (e.g., 'partner-seoulrealestate')
      // Listings use format: email (e.g., 'seoulrealestate@tofu.com') or 'partner-{prefix}'
      const discountPartnerId = discount.partnerId || '';
      const discountPrefix = discountPartnerId.replace('partner-', '');
      const inputPrefix = partnerId.replace('partner-', '').split('@')[0];
      
      // Match if exact match, or if prefixes match
      const isMatch = discount.partnerId === partnerId || 
                      discountPrefix === inputPrefix ||
                      discountPartnerId === partnerId ||
                      (partnerId.includes('@') && partnerId.split('@')[0] === discountPrefix);
      
      if (!isMatch) return false;

      // Must be active (status ACTIVE and isActive true)
      if (discount.status !== 'ACTIVE' || !discount.isActive) return false;

      // Check scope
      if (discount.scope !== scope) return false;

      // Check date range
      const startAt = discount.startAt ? new Date(discount.startAt) : null;
      const endAt = discount.endAt ? new Date(discount.endAt) : null;
      if (startAt && currentDate < startAt) return false;
      if (endAt && currentDate > endAt) return false;

      // Check entity linking
      if (discount.relatedEntityType !== 'NONE') {
        if (discount.relatedEntityType !== entityType) return false;
        // Check both listingId (new) and relatedEntityId (backward compatibility)
        const discountEntityId = discount.listingId || discount.relatedEntityId;
        if (discountEntityId && discountEntityId.toString() !== entityId?.toString()) return false;
      }

      // Check usage limit
      if (discount.usageLimit && discount.usedCount >= discount.usageLimit) return false;

      return true;
    });

    if (applicableDiscount) {
      return {
        id: applicableDiscount.id,
        title: applicableDiscount.title,
        description: applicableDiscount.description,
        discountType: applicableDiscount.discountType,
        value: applicableDiscount.value,
        minAmount: applicableDiscount.minAmount,
        maxDiscount: applicableDiscount.maxDiscount,
        stacking: applicableDiscount.stacking || 'NONE',
        type: 'PARTNER_DISCOUNT',
      };
    }
  } catch (e) {
    console.warn('Error reading partner discounts:', e);
  }

  return null;
}

/**
 * Apply discount to an amount
 * @param {number} amount - Original amount
 * @param {Object} discount - Discount object
 * @param {string} discount.discountType - 'PERCENT' or 'FIXED'
 * @param {number} discount.value - Discount value (percent 0-100 or fixed amount)
 * @param {number} discount.minAmount - Minimum purchase amount (optional)
 * @param {number} discount.maxDiscount - Maximum discount amount (optional)
 * @returns {Object} { newAmount: number, savedAmount: number }
 */
export function applyDiscount(amount, discount) {
  if (!discount || !amount || amount <= 0) {
    return { newAmount: amount, savedAmount: 0 };
  }

  // Check minimum amount requirement
  if (discount.minAmount && amount < discount.minAmount) {
    return { newAmount: amount, savedAmount: 0 };
  }

  let savedAmount = 0;
  let newAmount = amount;

  if (discount.discountType === 'PERCENT') {
    // Calculate percentage discount
    savedAmount = (amount * discount.value) / 100;
    
    // Apply max discount limit if specified
    if (discount.maxDiscount && savedAmount > discount.maxDiscount) {
      savedAmount = discount.maxDiscount;
    }
    
    newAmount = amount - savedAmount;
  } else if (discount.discountType === 'FIXED') {
    // Fixed amount discount
    savedAmount = Math.min(discount.value, amount);
    newAmount = amount - savedAmount;
  }

  // Ensure new amount is not negative
  if (newAmount < 0) {
    newAmount = 0;
    savedAmount = amount;
  }

  return {
    newAmount: Math.round(newAmount),
    savedAmount: Math.round(savedAmount),
  };
}

/**
 * Get applicable discount for a specific listing
 * @param {string|number} listingId - Listing ID
 * @param {string} partnerId - Partner ID
 * @param {Date} now - Current date (defaults to now)
 * @returns {Object|null} Applicable discount object or null
 */
export function getApplicableDiscountForListing(listingId, partnerId, now = new Date()) {
  if (!listingId || !partnerId) return null;

  return getApplicableDiscount({
    partnerId,
    scope: 'REAL_ESTATE',
    entityType: 'LISTING',
    entityId: listingId.toString(),
    now,
  });
}
