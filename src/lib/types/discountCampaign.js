/**
 * Shared Discount Campaign Schema
 * Single source of truth for discount/campaign configuration
 */

/**
 * @typedef {Object} DiscountCampaign
 * @property {string} [id] - Campaign ID (optional for create)
 * @property {"PLATFORM" | "PARTNER"} owner - Discount owner/funding mode (required)
 * @property {string} title - Campaign title (required, min 3 chars)
 * @property {string} [description] - Campaign description (optional)
 * @property {"REAL_ESTATE" | "DELIVERY"} scope - Service scope (required)
 * @property {"PERCENT" | "AMOUNT"} discountType - Discount type (required)
 * @property {number} discountValue - Discount value (required, > 0)
 * @property {string} startAt - Start date ISO string (required)
 * @property {string} endAt - End date ISO string (required)
 * @property {"DRAFT" | "ACTIVE" | "PAUSED" | "EXPIRED"} status - Campaign status (required)
 * @property {Targeting} targeting - Targeting configuration
 * @property {Rules} rules - Discount rules
 * @property {string} [targetMode] - Apply target mode for PLATFORM discounts (ALL_USERS, NEW_USERS_ONLY, CATEGORY, SERVICE)
 * @property {string[]} [targetIds] - Target IDs for PLATFORM discounts (when targetMode != ALL_USERS)
 * @property {"ALL_PARTNERS_IN_DOMAIN" | "SELECT_PARTNERS"} [eligiblePartnerMode] - Partner eligibility mode for PARTNER discounts
 * @property {string[]} [partnerIds] - Partner IDs for PARTNER discounts (when eligiblePartnerMode = SELECT_PARTNERS)
 */

/**
 * @typedef {Object} Targeting
 * @property {"ALL" | "CATEGORY" | "ITEM" | "PARTNER" | "USER_SEGMENT"} targetMode - Target mode (required)
 * @property {string[]} [targetIds] - Target IDs (required when targetMode != ALL)
 */

/**
 * @typedef {Object} Rules
 * @property {"NOT_ALLOWED" | "ALLOWED"} stacking - Stacking rule (required)
 * @property {number} [minimumAmount] - Minimum amount (optional, >= 0)
 * @property {number} [maximumDiscount] - Maximum discount (optional, >= 0)
 * @property {number} [usageLimitTotal] - Total usage limit (optional, integer >= 1)
 * @property {number} [usageLimitPerUser] - Per-user usage limit (optional, integer >= 1)
 */

/**
 * Default discount campaign values
 */
export const DEFAULT_DISCOUNT_CAMPAIGN = {
  owner: 'PLATFORM', // Default to PLATFORM
  title: '',
  description: '',
  scope: 'REAL_ESTATE',
  discountType: 'PERCENT',
  discountValue: 0,
  startAt: '',
  endAt: '',
  status: 'DRAFT',
  targeting: {
    targetMode: 'ALL',
    targetIds: [],
  },
  rules: {
    stacking: 'NOT_ALLOWED',
    minimumAmount: undefined,
    maximumDiscount: undefined,
    usageLimitTotal: undefined,
    usageLimitPerUser: undefined,
  },
  // PLATFORM-specific fields
  targetMode: 'ALL_USERS',
  targetIds: [],
  // PARTNER-specific fields
  eligiblePartnerMode: undefined,
  partnerIds: [],
};

/**
 * Validate discount campaign
 * @param {Partial<DiscountCampaign>} campaign - Campaign to validate
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export const validateDiscountCampaign = (campaign) => {
  const errors = {};

  // Title validation
  if (!campaign.title || campaign.title.trim().length < 3) {
    errors.title = '제목은 최소 3자 이상이어야 합니다.';
  }

  // Discount value validation
  if (!campaign.discountValue || campaign.discountValue <= 0) {
    errors.discountValue = '할인 금액은 0보다 커야 합니다.';
  }

  // Percent validation
  if (campaign.discountType === 'PERCENT' && campaign.discountValue > 100) {
    errors.discountValue = '퍼센트 할인은 100%를 초과할 수 없습니다.';
  }

  // Date validation
  if (campaign.startAt && campaign.endAt) {
    const startDate = new Date(campaign.startAt);
    const endDate = new Date(campaign.endAt);
    if (endDate <= startDate) {
      errors.endAt = '종료일은 시작일보다 늦어야 합니다.';
    }
  }

  // Maximum discount validation
  if (campaign.rules?.maximumDiscount !== undefined && campaign.rules.maximumDiscount < 0) {
    errors.maximumDiscount = '최대 할인 금액은 0 이상이어야 합니다.';
  }

  // Minimum amount validation
  if (campaign.rules?.minimumAmount !== undefined && campaign.rules.minimumAmount < 0) {
    errors.minimumAmount = '최소 금액은 0 이상이어야 합니다.';
  }

  // Usage limit validation
  if (campaign.rules?.usageLimitTotal !== undefined) {
    if (!Number.isInteger(campaign.rules.usageLimitTotal) || campaign.rules.usageLimitTotal < 1) {
      errors.usageLimitTotal = '총 사용 한도는 1 이상의 정수여야 합니다.';
    }
  }

  if (campaign.rules?.usageLimitPerUser !== undefined) {
    if (!Number.isInteger(campaign.rules.usageLimitPerUser) || campaign.rules.usageLimitPerUser < 1) {
      errors.usageLimitPerUser = '사용자당 사용 한도는 1 이상의 정수여야 합니다.';
    }
  }

  // Owner validation
  if (!campaign.owner || !['PLATFORM', 'PARTNER'].includes(campaign.owner)) {
    errors.owner = '할인 소유자를 선택해주세요.';
  }

  // Owner-specific validation
  if (campaign.owner === 'PLATFORM') {
    // PLATFORM: targetMode and targetIds validation
    if (campaign.targetMode && campaign.targetMode !== 'ALL_USERS') {
      if (!campaign.targetIds || campaign.targetIds.length === 0) {
        errors.targetIds = '타겟을 선택해주세요.';
      }
    }
  } else if (campaign.owner === 'PARTNER') {
    // PARTNER: eligiblePartnerMode validation
    if (!campaign.eligiblePartnerMode) {
      errors.eligiblePartnerMode = '파트너 선택 모드를 선택해주세요.';
    } else if (campaign.eligiblePartnerMode === 'SELECT_PARTNERS') {
      if (!campaign.partnerIds || campaign.partnerIds.length === 0) {
        errors.partnerIds = '파트너를 선택해주세요.';
      }
    }
  }

  // Legacy targeting validation (for backward compatibility)
  if (campaign.targeting?.targetMode && campaign.targeting.targetMode !== 'ALL') {
    if (!campaign.targeting.targetIds || campaign.targeting.targetIds.length === 0) {
      errors.targetIds = '타겟을 선택해주세요.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Convert legacy discount format to new schema
 * @param {Object} legacy - Legacy discount object
 * @returns {DiscountCampaign}
 */
export const convertLegacyToCampaign = (legacy) => {
  // Determine owner: if partnerId exists, it's likely a PARTNER discount, otherwise PLATFORM
  const owner = legacy.owner || (legacy.partnerId ? 'PARTNER' : 'PLATFORM');
  
  return {
    id: legacy.id,
    owner: owner,
    title: legacy.title || legacy.name || '',
    description: legacy.description || '',
    scope: legacy.scope || 'REAL_ESTATE',
    discountType: legacy.discountType || legacy.type || 'PERCENT',
    discountValue: legacy.value || legacy.discountValue || 0,
    startAt: legacy.startAt || '',
    endAt: legacy.endAt || '',
    status: legacy.status || 'DRAFT',
    targeting: {
      targetMode: legacy.targetMode || legacy.appliesTo || 'ALL',
      targetIds: legacy.targetIds || legacy.partnerIds || legacy.categories || legacy.appliesToIds || [],
    },
    rules: {
      stacking: legacy.stacking === 'ALLOW' || legacy.stacking === 'ALLOWED' ? 'ALLOWED' : 'NOT_ALLOWED',
      minimumAmount: legacy.minAmount || legacy.minSpend || undefined,
      maximumDiscount: legacy.maxDiscount || undefined,
      usageLimitTotal: legacy.usageLimit || undefined,
      usageLimitPerUser: undefined, // Not in legacy format
    },
    // PLATFORM-specific fields
    targetMode: owner === 'PLATFORM' ? (legacy.targetMode || 'ALL_USERS') : undefined,
    targetIds: owner === 'PLATFORM' ? (legacy.targetIds || []) : undefined,
    // PARTNER-specific fields
    eligiblePartnerMode: owner === 'PARTNER' ? (legacy.eligiblePartnerMode || (legacy.partnerIds?.length > 0 ? 'SELECT_PARTNERS' : 'ALL_PARTNERS_IN_DOMAIN')) : undefined,
    partnerIds: owner === 'PARTNER' ? (legacy.partnerIds || []) : undefined,
  };
};

/**
 * Convert new schema to legacy format (for backward compatibility)
 * @param {DiscountCampaign} campaign - Campaign object
 * @returns {Object}
 */
export const convertCampaignToLegacy = (campaign) => {
  // Map AMOUNT back to FIXED for legacy compatibility
  let discountType = campaign.discountType;
  if (discountType === 'AMOUNT') discountType = 'FIXED';
  
  // Map targetMode back to appliesTo if needed
  let appliesTo = campaign.targeting?.targetMode || campaign.targetMode || 'ALL';
  if (appliesTo === 'ITEM') appliesTo = 'ORDER'; // Map ITEM back to ORDER for delivery
  
  return {
    id: campaign.id,
    owner: campaign.owner || 'PLATFORM', // Preserve owner field
    title: campaign.title,
    name: campaign.title, // For delivery discounts
    description: campaign.description,
    scope: campaign.scope,
    service: campaign.scope, // For delivery discounts
    discountType: discountType,
    type: discountType, // For delivery discounts
    value: campaign.discountValue || campaign.value,
    startAt: campaign.startAt,
    endAt: campaign.endAt,
    status: campaign.status,
    targetMode: campaign.targetMode || campaign.targeting?.targetMode || 'ALL',
    appliesTo: appliesTo, // For delivery discounts
    partnerIds: campaign.partnerIds || (campaign.targeting?.targetMode === 'PARTNER' ? campaign.targeting.targetIds : []),
    categories: campaign.targeting?.targetMode === 'CATEGORY' ? campaign.targeting.targetIds : [],
    appliesToIds: campaign.targetIds || (campaign.targeting?.targetMode !== 'ALL' ? campaign.targeting?.targetIds : []),
    stacking: campaign.rules?.stacking === 'ALLOWED' ? 'ALLOW' : 'NONE',
    minAmount: campaign.rules?.minimumAmount,
    minSpend: campaign.rules?.minimumAmount, // For delivery discounts
    maxDiscount: campaign.rules?.maximumDiscount,
    usageLimit: campaign.rules?.usageLimitTotal,
    // PARTNER-specific fields
    eligiblePartnerMode: campaign.eligiblePartnerMode,
  };
};

