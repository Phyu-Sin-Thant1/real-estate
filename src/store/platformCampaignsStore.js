// Platform Campaigns store - manages admin-owned platform-wide campaigns
const STORAGE_KEY = 'tofu-platform-campaigns';

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
 * Load all platform campaigns
 * @returns {Array} Array of platform campaign objects
 */
export const getPlatformCampaigns = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Create a new platform campaign
 * @param {Object} campaign - Campaign object (without id, timestamps)
 * @returns {Object} Created campaign with id and timestamps
 */
export const createPlatformCampaign = (campaign) => {
  const campaigns = getPlatformCampaigns();
  const now = new Date().toISOString();
  const newCampaign = {
    id: `pc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    usedCount: 0,
    status: campaign.status || 'DRAFT',
    createdAt: now,
    updatedAt: now,
    ...campaign,
  };
  const nextCampaigns = [newCampaign, ...campaigns];
  safeWrite(STORAGE_KEY, nextCampaigns);
  return newCampaign;
};

/**
 * Update platform campaign by ID
 * @param {string} id - Campaign ID
 * @param {Object} patch - Fields to update
 * @returns {Object|null} Updated campaign or null if not found
 */
export const updatePlatformCampaign = (id, patch) => {
  const campaigns = getPlatformCampaigns();
  const campaignIndex = campaigns.findIndex((c) => c.id === id);
  if (campaignIndex === -1) return null;

  const updatedCampaign = {
    ...campaigns[campaignIndex],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  campaigns[campaignIndex] = updatedCampaign;
  safeWrite(STORAGE_KEY, campaigns);
  return updatedCampaign;
};

/**
 * Set campaign status
 * @param {string} id - Campaign ID
 * @param {string} status - New status ('DRAFT' | 'LIVE' | 'PAUSED' | 'ENDED')
 * @returns {Object|null} Updated campaign or null if not found
 */
export const setCampaignStatus = (id, status) => {
  return updatePlatformCampaign(id, { status });
};

/**
 * Delete platform campaign by ID
 * @param {string} id - Campaign ID
 * @returns {boolean} Success
 */
export const deletePlatformCampaign = (id) => {
  const campaigns = getPlatformCampaigns();
  const filtered = campaigns.filter((c) => c.id !== id);
  safeWrite(STORAGE_KEY, filtered);
  return filtered.length < campaigns.length;
};

/**
 * Seed initial platform campaigns
 */
export const seedPlatformCampaigns = () => {
  const existing = getPlatformCampaigns();
  if (existing.length > 0) return existing;

  const now = new Date();
  const campaigns = [
    {
      id: 'pc-seed-1',
      createdBy: 'admin@tofu.com',
      title: '신규 가입자 20% 할인',
      description: '신규 가입 고객 대상 플랫폼 전체 할인',
      scope: 'ALL',
      discountType: 'PERCENT',
      value: 20,
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'LIVE',
      targetMode: 'ALL',
      partnerIds: [],
      categories: [],
      stacking: 'NONE',
      minAmount: 100000,
      usageLimit: 1000,
      usedCount: 234,
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pc-seed-2',
      createdBy: 'admin@tofu.com',
      title: '부동산 특가 프로모션',
      description: '선택 파트너 대상 부동산 할인',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 15,
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'LIVE',
      targetMode: 'PARTNER_IDS',
      partnerIds: ['partner-123', 'partner-456'],
      categories: [],
      stacking: 'ALLOW',
      minAmount: 50000,
      usageLimit: 500,
      usedCount: 89,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pc-seed-3',
      createdBy: 'admin@tofu.com',
      title: '배달 서비스 5만원 할인',
      description: '배달 서비스 고정 할인',
      scope: 'DELIVERY',
      discountType: 'FIXED',
      value: 50000,
      startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      targetMode: 'ALL',
      partnerIds: [],
      categories: [],
      stacking: 'NONE',
      minAmount: 200000,
      usageLimit: 200,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  safeWrite(STORAGE_KEY, campaigns);
  return campaigns;
};


