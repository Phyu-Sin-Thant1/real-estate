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
      id: 'discount-partner-re-2',
      code: 'SEOUL25',
      name: '서울 부동산 25% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 25,
      minSpend: 500000,
      maxDiscount: 200000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-partner-re-3',
      code: 'INCHEON50K',
      name: '인천 부동산 5만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 50000,
      minSpend: 300000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-partner-re-4',
      code: 'GWANGJU15',
      name: '광주 부동산 15% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 15,
      minSpend: 400000,
      maxDiscount: 150000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      partnerId: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
      id: 'discount-partner-delivery-2',
      code: 'BUSAN20',
      name: '부산 배달 20% 할인',
      service: 'DELIVERY',
      type: 'PERCENT',
      value: 20,
      minSpend: 80000,
      maxDiscount: 40000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'busandelivery@tofu.com',
      createdBy: 'busandelivery@tofu.com',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-partner-delivery-3',
      code: 'DAEGU10K',
      name: '대구 빠른 배송 1만원 할인',
      service: 'DELIVERY',
      type: 'FIXED',
      value: 10000,
      minSpend: 60000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      partnerId: 'daeguquickmove@tofu.com',
      createdBy: 'daeguquickmove@tofu.com',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
    // More Delivery Discounts
    {
      id: 'discount-delivery-1',
      code: 'MOVE20',
      name: '이사 서비스 20% 할인',
      service: 'DELIVERY',
      type: 'PERCENT',
      value: 20,
      minSpend: 100000,
      maxDiscount: 50000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'delivery@tofu.com',
      createdBy: 'delivery@tofu.com',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-delivery-2',
      code: 'QUICK30',
      name: '빠른 배송 3만원 할인',
      service: 'DELIVERY',
      type: 'FIXED',
      value: 30000,
      minSpend: 150000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'delivery@tofu.com',
      createdBy: 'delivery@tofu.com',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-delivery-3',
      code: 'WEEKEND15',
      name: '주말 배송 15% 할인',
      service: 'DELIVERY',
      type: 'PERCENT',
      value: 15,
      minSpend: 80000,
      maxDiscount: 25000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      partnerId: 'delivery@tofu.com',
      createdBy: 'delivery@tofu.com',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-delivery-4',
      code: 'FIRST5K',
      name: '첫 주문 5천원 할인',
      service: 'DELIVERY',
      type: 'FIXED',
      value: 5000,
      minSpend: 30000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // More Real Estate Discounts
    {
      id: 'discount-re-1',
      code: 'APART10',
      name: '아파트 거래 10% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 10,
      minSpend: 500000,
      maxDiscount: 200000,
      appliesTo: 'CATEGORY',
      appliesToIds: 'apartment',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-2',
      code: 'OFFICE50K',
      name: '오피스텔 5만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 50000,
      minSpend: 300000,
      appliesTo: 'CATEGORY',
      appliesToIds: 'officetel',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-3',
      code: 'NEWLISTING',
      name: '신규 매물 25% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 25,
      minSpend: 1000000,
      maxDiscount: 500000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 33 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      partnerId: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-4',
      code: 'VIP100K',
      name: 'VIP 고객 10만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 100000,
      minSpend: 2000000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      partnerId: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-5',
      code: 'WINTER2024',
      name: '겨울 프로모션 15% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 15,
      minSpend: 800000,
      maxDiscount: 300000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Additional Real Estate Discounts with COMMISSION_DISCOUNT type
    {
      id: 'discount-re-6',
      code: 'COMMISSION30',
      name: '중개 수수료 30% 할인',
      service: 'REAL_ESTATE',
      type: 'COMMISSION_DISCOUNT',
      value: 30,
      minSpend: 1000000,
      maxDiscount: 500000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-7',
      code: 'CONTRACT20',
      name: '계약 할인 20%',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 20,
      minSpend: 500000,
      maxDiscount: 200000,
      appliesTo: 'LISTING',
      appliesToIds: ['LIST-301', 'LIST-302', 'LIST-303'],
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-8',
      code: 'VILLA100K',
      name: '빌라 거래 10만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 100000,
      minSpend: 800000,
      appliesTo: 'CATEGORY',
      appliesToIds: ['villa'],
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-9',
      code: 'FIRSTCONTRACT',
      name: '첫 계약 15% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 15,
      minSpend: 300000,
      maxDiscount: 150000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-10',
      code: 'COMMISSION50',
      name: '중개 수수료 50% 할인',
      service: 'REAL_ESTATE',
      type: 'COMMISSION_DISCOUNT',
      value: 50,
      minSpend: 2000000,
      maxDiscount: 1000000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      partnerId: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-11',
      code: 'ROOM75K',
      name: '원룸 거래 7.5만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 75000,
      minSpend: 200000,
      appliesTo: 'CATEGORY',
      appliesToIds: ['oneroom'],
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      partnerId: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-12',
      code: 'SPECIAL200K',
      name: '특별 매물 20만원 할인',
      service: 'REAL_ESTATE',
      type: 'FIXED',
      value: 200000,
      minSpend: 1500000,
      appliesTo: 'LISTING',
      appliesToIds: ['LIST-401', 'LIST-402'],
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-13',
      code: 'NEWYEAR25',
      name: '신년 프로모션 25% 할인',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 25,
      minSpend: 1000000,
      maxDiscount: 400000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-14',
      code: 'COMMISSION40',
      name: '중개 수수료 40% 할인',
      service: 'REAL_ESTATE',
      type: 'COMMISSION_DISCOUNT',
      value: 40,
      minSpend: 1500000,
      maxDiscount: 800000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      partnerId: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-re-15',
      code: 'EXPIREDRE',
      name: '만료된 부동산 쿠폰',
      service: 'REAL_ESTATE',
      type: 'PERCENT',
      value: 10,
      minSpend: 500000,
      appliesTo: 'ALL',
      startAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'EXPIRED',
      partnerId: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // More Global Discounts
    {
      id: 'discount-global-4',
      code: 'SAVE5K',
      name: '5천원 즉시 할인',
      service: 'ALL',
      type: 'FIXED',
      value: 5000,
      minSpend: 20000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'discount-global-5',
      code: 'BIRTHDAY',
      name: '생일 축하 7% 할인',
      service: 'ALL',
      type: 'PERCENT',
      value: 7,
      minSpend: 50000,
      maxDiscount: 35000,
      appliesTo: 'ALL',
      startAt: now.toISOString(),
      endAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdBy: 'admin@tofu.com',
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  safeWrite(STORAGE_KEY, mockDiscounts);
  return mockDiscounts;
};

