// Partner Discounts store - manages partner-owned discounts
const STORAGE_KEY = 'tofu-partner-discounts';

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
 * Load all partner discounts
 * @returns {Array} Array of partner discount objects
 */
export const getPartnerDiscounts = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get partner discounts filtered by partnerId
 * @param {string} partnerId - Partner ID
 * @returns {Array} Filtered discounts
 */
export const getPartnerDiscountsByPartnerId = (partnerId) => {
  const discounts = getPartnerDiscounts();
  return discounts.filter((d) => d.partnerId === partnerId);
};

/**
 * Create a new partner discount
 * @param {Object} discount - Discount object (without id, timestamps)
 * @returns {Object} Created discount with id and timestamps
 */
export const createPartnerDiscount = (discount) => {
  const discounts = getPartnerDiscounts();
  const now = new Date().toISOString();
  const newDiscount = {
    id: `pd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    usedCount: 0,
    status: discount.status || 'DRAFT', // DRAFT, SUBMITTED, APPROVED, REJECTED, ACTIVE
    isActive: false, // Will be true only when status is ACTIVE
    createdAt: now,
    updatedAt: now,
    ...discount,
  };
  const nextDiscounts = [newDiscount, ...discounts];
  safeWrite(STORAGE_KEY, nextDiscounts);
  return newDiscount;
};

/**
 * Update partner discount by ID
 * @param {string} id - Discount ID
 * @param {Object} patch - Fields to update
 * @returns {Object|null} Updated discount or null if not found
 */
export const updatePartnerDiscount = (id, patch) => {
  const discounts = getPartnerDiscounts();
  const discountIndex = discounts.findIndex((d) => d.id === id);
  if (discountIndex === -1) return null;

  const updatedDiscount = {
    ...discounts[discountIndex],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  discounts[discountIndex] = updatedDiscount;
  safeWrite(STORAGE_KEY, discounts);
  return updatedDiscount;
};

/**
 * Delete partner discount by ID
 * @param {string} id - Discount ID
 * @returns {boolean} Success
 */
export const deletePartnerDiscount = (id) => {
  const discounts = getPartnerDiscounts();
  const filtered = discounts.filter((d) => d.id !== id);
  safeWrite(STORAGE_KEY, filtered);
  return filtered.length < discounts.length;
};

/**
 * Toggle partner discount active status
 * @param {string} id - Discount ID
 * @param {boolean} isActive - Active status
 * @returns {Object|null} Updated discount or null
 */
export const togglePartnerDiscount = (id, isActive) => {
  return updatePartnerDiscount(id, { isActive });
};

/**
 * Submit partner discount for approval (change status from DRAFT to SUBMITTED)
 * @param {string} id - Discount ID
 * @returns {Object|null} Updated discount or null
 */
export const submitPartnerDiscount = (id) => {
  return updatePartnerDiscount(id, { status: 'SUBMITTED' });
};

/**
 * Approve partner discount (change status to APPROVED/ACTIVE)
 * @param {string} id - Discount ID
 * @returns {Object|null} Updated discount or null
 */
export const approvePartnerDiscount = (id) => {
  return updatePartnerDiscount(id, { 
    status: 'ACTIVE', 
    isActive: true 
  });
};

/**
 * Reject partner discount (change status to REJECTED)
 * @param {string} id - Discount ID
 * @param {string} adminNote - Rejection reason
 * @returns {Object|null} Updated discount or null
 */
export const rejectPartnerDiscount = (id, adminNote) => {
  return updatePartnerDiscount(id, { 
    status: 'REJECTED', 
    isActive: false,
    adminNote 
  });
};

/**
 * Seed initial partner discounts
 */
export const seedPartnerDiscounts = () => {
  const existing = getPartnerDiscounts();
  if (existing.length > 0) return existing;

  const now = new Date();
  // Helper to get partnerId from email (matching BusinessDeliveryDiscountsPage logic)
  const getPartnerId = (email) => {
    if (!email) return null;
    return `partner-${email.split('@')[0]}`;
  };

  const discounts = [
    {
      id: 'pd-seed-1',
      partnerId: getPartnerId('seoulrealestate@tofu.com'),
      partnerName: 'Seoul Real Estate Co.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 10,
      title: '신규 매물 10% 할인',
      description: '신규 등록 매물에 대한 특별 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 50000,
      maxDiscount: 50000,
      usageLimit: 100,
      usedCount: 12,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-2',
      partnerId: getPartnerId('seoulrealestate@tofu.com'),
      partnerName: 'Seoul Real Estate Co.',
      scope: 'REAL_ESTATE',
      discountType: 'FIXED',
      value: 50000,
      title: '첫 거래 5만원 할인',
      description: '첫 거래 고객 대상 고정 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUBMITTED',
      isActive: false,
      stacking: 'ALLOW',
      relatedEntityType: 'LISTING',
      relatedEntityId: '1',
      listingId: '1',
      listingTitle: '강남 아파트 A동 101호',
      minAmount: 200000,
      usageLimit: 50,
      usedCount: 8,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-3',
      partnerId: getPartnerId('busandelivery@tofu.com'),
      partnerName: 'Busan Delivery Services',
      scope: 'DELIVERY',
      discountType: 'PERCENT',
      value: 15,
      title: '이사 서비스 15% 할인',
      description: '이사 서비스 전반 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'SERVICE',
      relatedEntityId: 'service-1',
      minAmount: 100000,
      maxDiscount: 30000,
      usageLimit: 200,
      usedCount: 45,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-4',
      partnerId: getPartnerId('busandelivery@tofu.com'),
      partnerName: 'Busan Delivery Services',
      scope: 'DELIVERY',
      discountType: 'FIXED',
      value: 20000,
      title: '배송비 2만원 할인',
      description: '배송비 고정 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 50000,
      usageLimit: 100,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-5',
      partnerId: getPartnerId('incheonproperties@tofu.com'),
      partnerName: 'Incheon Properties Ltd.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 20,
      title: '프리미엄 매물 20% 할인',
      description: '프리미엄 매물 특별 할인',
      startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'LISTING',
      relatedEntityId: '2',
      listingId: '2',
      listingTitle: '송파 오피스텔 B동 502호',
      minAmount: 500000,
      maxDiscount: 200000,
      usageLimit: 30,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-6',
      partnerId: getPartnerId('incheonproperties@tofu.com'),
      partnerName: 'Incheon Properties Ltd.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 5,
      title: '전체 매물 5% 할인',
      description: '모든 매물에 적용되는 기본 할인',
      startAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'REJECTED',
      isActive: false,
      adminNote: '할인율이 너무 높습니다',
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 0,
      usageLimit: 500,
      usedCount: 234,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // More Delivery Partner Discounts
    {
      id: 'pd-seed-7',
      partnerId: getPartnerId('delivery@tofu.com'),
      partnerName: 'Fast Delivery Co.',
      scope: 'DELIVERY',
      discountType: 'PERCENT',
      value: 12,
      title: '정기 고객 12% 할인',
      description: '정기적으로 이용하는 고객 대상 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 100000,
      maxDiscount: 40000,
      usageLimit: 300,
      usedCount: 67,
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-8',
      partnerId: getPartnerId('delivery@tofu.com'),
      partnerName: 'Fast Delivery Co.',
      scope: 'DELIVERY',
      discountType: 'FIXED',
      value: 15000,
      title: '주말 특가 1.5만원 할인',
      description: '주말 배송 특가 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUBMITTED',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 80000,
      usageLimit: 150,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-9',
      partnerId: getPartnerId('delivery@tofu.com'),
      partnerName: 'Fast Delivery Co.',
      scope: 'DELIVERY',
      discountType: 'PERCENT',
      value: 8,
      title: '소형 이사 8% 할인',
      description: '소형 이사 전용 할인',
      startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'SERVICE',
      relatedEntityId: 'service-small',
      minAmount: 50000,
      maxDiscount: 20000,
      usageLimit: 200,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // More Real Estate Partner Discounts
    {
      id: 'pd-seed-10',
      partnerId: getPartnerId('seoulrealestate@tofu.com'),
      partnerName: 'Seoul Real Estate Co.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 18,
      title: '프리미엄 매물 18% 할인',
      description: '프리미엄 매물 특별 할인 프로모션',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'LISTING',
      relatedEntityId: '3',
      listingId: '3',
      listingTitle: '강남 펜트하우스',
      minAmount: 1000000,
      maxDiscount: 400000,
      usageLimit: 20,
      usedCount: 5,
      createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-11',
      partnerId: getPartnerId('seoulrealestate@tofu.com'),
      partnerName: 'Seoul Real Estate Co.',
      scope: 'REAL_ESTATE',
      discountType: 'FIXED',
      value: 30000,
      title: '원룸 전용 3만원 할인',
      description: '원룸 매물 거래 시 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'ALLOW',
      relatedEntityType: 'CATEGORY',
      relatedEntityId: 'oneroom',
      minAmount: 200000,
      usageLimit: 100,
      usedCount: 23,
      createdAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-12',
      partnerId: getPartnerId('seoulrealestate@tofu.com'),
      partnerName: 'Seoul Real Estate Co.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 6,
      title: '신규 고객 6% 할인',
      description: '신규 고객 첫 거래 할인',
      startAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUBMITTED',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 300000,
      maxDiscount: 50000,
      usageLimit: 500,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-13',
      partnerId: getPartnerId('incheonproperties@tofu.com'),
      partnerName: 'Incheon Properties Ltd.',
      scope: 'REAL_ESTATE',
      discountType: 'FIXED',
      value: 80000,
      title: '대형 매물 8만원 할인',
      description: '대형 매물 거래 시 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'CATEGORY',
      relatedEntityId: 'large',
      minAmount: 5000000,
      usageLimit: 50,
      usedCount: 12,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-14',
      partnerId: getPartnerId('incheonproperties@tofu.com'),
      partnerName: 'Incheon Properties Ltd.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 12,
      title: '투자용 매물 12% 할인',
      description: '투자용 매물 특별 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 3000000,
      maxDiscount: 600000,
      usageLimit: 30,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-15',
      partnerId: getPartnerId('incheonproperties@tofu.com'),
      partnerName: 'Incheon Properties Ltd.',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 3,
      title: '기본 할인 3%',
      description: '모든 거래에 적용되는 기본 할인',
      startAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'EXPIRED',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 0,
      usageLimit: 1000,
      usedCount: 456,
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Daegu Quick Move Discounts
    {
      id: 'pd-seed-16',
      partnerId: getPartnerId('daeguquickmove@tofu.com'),
      partnerName: 'Daegu Quick Move',
      scope: 'DELIVERY',
      discountType: 'PERCENT',
      value: 18,
      title: '대구 지역 18% 할인',
      description: '대구 지역 배송 특별 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 120000,
      maxDiscount: 50000,
      usageLimit: 150,
      usedCount: 23,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-17',
      partnerId: getPartnerId('daeguquickmove@tofu.com'),
      partnerName: 'Daegu Quick Move',
      scope: 'DELIVERY',
      discountType: 'FIXED',
      value: 25000,
      title: '빠른 배송 2.5만원 할인',
      description: '당일 배송 시 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUBMITTED',
      isActive: false,
      stacking: 'NONE',
      relatedEntityType: 'SERVICE',
      relatedEntityId: 'express',
      minAmount: 150000,
      usageLimit: 80,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Gwangju Homes Discounts
    {
      id: 'pd-seed-18',
      partnerId: getPartnerId('gwangjuhomes@tofu.com'),
      partnerName: 'Gwangju Homes Realty',
      scope: 'REAL_ESTATE',
      discountType: 'PERCENT',
      value: 8,
      title: '광주 신규 고객 8% 할인',
      description: '신규 고객 첫 거래 할인',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      stacking: 'NONE',
      relatedEntityType: 'NONE',
      relatedEntityId: null,
      minAmount: 100000,
      maxDiscount: 80000,
      usageLimit: 200,
      usedCount: 34,
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pd-seed-19',
      partnerId: getPartnerId('gwangjuhomes@tofu.com'),
      partnerName: 'Gwangju Homes Realty',
      scope: 'REAL_ESTATE',
      discountType: 'FIXED',
      value: 100000,
      title: '프리미엄 매물 10만원 할인',
      description: '프리미엄 매물 거래 할인',
      startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      isActive: false,
      stacking: 'ALLOW',
      relatedEntityType: 'CATEGORY',
      relatedEntityId: 'premium',
      minAmount: 10000000,
      usageLimit: 20,
      usedCount: 0,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  safeWrite(STORAGE_KEY, discounts);
  return discounts;
};


