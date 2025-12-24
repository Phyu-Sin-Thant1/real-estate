// Discounts/Coupons store - manages discount coupons
const STORAGE_KEY = 'tofu-discounts';

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
 * Load all discounts
 * @returns {Array} Array of discount objects
 */
export const loadDiscounts = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Add a new discount
 * @param {Object} discount - Discount object
 * @returns {Array} Updated discounts array
 */
export const addDiscount = (discount) => {
  const discounts = loadDiscounts();
  const newDiscount = {
    id: `discount-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...discount,
  };
  const nextDiscounts = [newDiscount, ...discounts];
  safeWrite(STORAGE_KEY, nextDiscounts);
  return nextDiscounts;
};

/**
 * Update discount by ID
 * @param {string} id - Discount ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated discounts array
 */
export const updateDiscount = (id, patch) => {
  const discounts = loadDiscounts();
  const nextDiscounts = discounts.map((discount) =>
    discount.id === id
      ? { ...discount, ...patch, updatedAt: new Date().toISOString() }
      : discount
  );
  safeWrite(STORAGE_KEY, nextDiscounts);
  return nextDiscounts;
};

/**
 * Delete discount by ID (soft delete by setting status to DISABLED)
 * @param {string} id - Discount ID
 * @returns {Array} Updated discounts array
 */
export const deleteDiscount = (id) => {
  const discounts = loadDiscounts();
  const nextDiscounts = discounts.filter((discount) => discount.id !== id);
  safeWrite(STORAGE_KEY, nextDiscounts);
  return nextDiscounts;
};

/**
 * Get discount by ID
 * @param {string} id - Discount ID
 * @returns {Object|null} Discount object or null
 */
export const getDiscountById = (id) => {
  const discounts = loadDiscounts();
  return discounts.find((discount) => discount.id === id) || null;
};

/**
 * Get discounts filtered by partner email
 * @param {string} email - Partner email
 * @returns {Array} Filtered discounts array
 */
export const getDiscountsByPartner = (email) => {
  const discounts = loadDiscounts();
  return discounts.filter((discount) => discount.partnerId === email || discount.createdBy === email);
};

/**
 * Get all discounts (for admin)
 * @returns {Array} All discounts array
 */
export const getAllDiscounts = () => {
  return loadDiscounts();
};

/**
 * Seed initial mock data
 */
export const seedMockDiscounts = () => {
  const existing = loadDiscounts();
  if (existing.length > 0) return; // Don't seed if data exists

  const now = new Date();
  const mockDiscounts = [
    // Global coupons
    {
      id: 'discount-global-1',
      code: 'WELCOME10',
      name: '신규 가입 10% 할인',
      service: 'ALL',
      type: 'PERCENT',
      value: 10,
      minSpend: 50000,
      maxDiscount: 50000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-global-2',
      code: 'FREEDELIVERY',
      name: '무료 배송',
      service: 'DELIVERY',
      type: 'FREE_DELIVERY',
      value: 0,
      minSpend: 30000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-global-3',
      code: 'SPRING2024',
      name: '봄 프로모션 5만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 50000,
      minSpend: 100000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Future
      endAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Partner-specific coupons
    {
      id: 'discount-partner-re-1',
      code: 'REPARTNER20',
      name: '부동산 파트너 20% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 20,
      minSpend: 200000,
      maxDiscount: 100000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-partner-delivery-1',
      code: 'DELPARTNER15',
      name: '배달 파트너 15% 할인',
      service: 'DELIVERY',
      type: 'PERCENT',
      value: 15,
      minSpend: 50000,
      maxDiscount: 30000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'delivery@tofu.com',
      createdBy: 'delivery@tofu.com',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-expired-1',
      code: 'OLDCOUPON',
      name: '만료된 쿠폰',
      service: 'ALL',
      type: 'FIXED',
      value: 10000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'EXPIRED',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  safeWrite(STORAGE_KEY, mockDiscounts);
  return mockDiscounts;
};

