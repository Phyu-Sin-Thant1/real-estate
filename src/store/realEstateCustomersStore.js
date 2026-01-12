// Real Estate Customers store - manages customer data for real estate partners
const STORAGE_KEY = 'tofu-realestate-customers';

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
 * Get all customers
 * @returns {Array} Array of customer objects
 */
export const getCustomers = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get customer by ID
 * @param {string|number} id - Customer ID
 * @returns {Object|null} Customer object or null
 */
export const getCustomerById = (id) => {
  const customers = getCustomers();
  return customers.find((customer) => customer.id === id || customer.id === String(id)) || null;
};

/**
 * Add a new customer
 * @param {Object} customer - Customer object
 * @returns {Array} Updated customers array
 */
export const addCustomer = (customer) => {
  const customers = getCustomers();
  const nextCustomers = [customer, ...customers];
  safeWrite(STORAGE_KEY, nextCustomers);
  return nextCustomers;
};

/**
 * Update customer by ID
 * @param {string|number} id - Customer ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated customers array
 */
export const updateCustomer = (id, patch) => {
  const customers = getCustomers();
  const nextCustomers = customers.map((customer) =>
    customer.id === id || customer.id === String(id)
      ? { ...customer, ...patch, updatedAt: new Date().toISOString() }
      : customer
  );
  safeWrite(STORAGE_KEY, nextCustomers);
  return nextCustomers;
};

/**
 * Delete customer by ID
 * @param {string|number} id - Customer ID
 * @returns {Array} Updated customers array
 */
export const deleteCustomer = (id) => {
  const customers = getCustomers();
  const nextCustomers = customers.filter(
    (customer) => customer.id !== id && customer.id !== String(id)
  );
  safeWrite(STORAGE_KEY, nextCustomers);
  return nextCustomers;
};

/**
 * Get customers filtered by partner email or partnerId
 * @param {string} emailOrPartnerId - Partner email or ID
 * @returns {Array} Filtered customers array
 */
export const getCustomersByPartner = (emailOrPartnerId) => {
  const customers = getCustomers();
  return customers.filter(
    (customer) =>
      customer.partnerEmail === emailOrPartnerId ||
      customer.partnerId === emailOrPartnerId ||
      customer.createdBy === emailOrPartnerId
  );
};

/**
 * Seed initial mock customers data
 */
export const seedMockCustomers = () => {
  const existing = getCustomers();
  if (existing.length > 0) return existing;

  const now = new Date();
  
  // Helper to get date N days from today
  const getDateFromToday = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const mockCustomers = [
    // Seoul Real Estate customers
    {
      id: 1,
      name: '김철수',
      phone: '010-1234-5678',
      email: 'kim.chulsoo@example.com',
      memo: 'VIP 고객, 빠른 결정 선호, 강남구 아파트 관심',
      lastActivity: getDateFromToday(-5),
      totalContracts: 2,
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      name: '이영희',
      phone: '010-2345-6789',
      email: 'lee.younghee@example.com',
      memo: '신혼부부, 전세 선호, 서초구 오피스텔 관심',
      lastActivity: getDateFromToday(-3),
      totalContracts: 1,
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      name: '박민수',
      phone: '010-3456-7890',
      email: 'park.minsu@example.com',
      memo: '투자용 매물 관심, 송파구 아파트 선호',
      lastActivity: getDateFromToday(-10),
      totalContracts: 3,
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      name: '정수진',
      phone: '010-4567-8901',
      email: 'jung.sujin@example.com',
      memo: '강동구 주택 관심, 자가용 주차 필수',
      lastActivity: getDateFromToday(-1),
      totalContracts: 0,
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      name: '최동현',
      phone: '010-5678-9012',
      email: 'choi.donghyun@example.com',
      memo: '마포구 신축 오피스텔 관심, 주말 방문 가능',
      lastActivity: getDateFromToday(-2),
      totalContracts: 1,
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Incheon Properties customers
    {
      id: 6,
      name: '한미영',
      phone: '010-6789-0123',
      email: 'han.miyoung@example.com',
      memo: '인천 남동구 아파트 관심, 학군 중요',
      lastActivity: getDateFromToday(-4),
      totalContracts: 1,
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 7,
      name: '윤태호',
      phone: '010-7890-1234',
      email: 'yoon.taeho@example.com',
      memo: '송도 프리미엄 아파트 관심, 전세 선호',
      lastActivity: getDateFromToday(-7),
      totalContracts: 2,
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 8,
      name: '강지은',
      phone: '010-8901-2345',
      email: 'kang.jieun@example.com',
      memo: '부평구 원룸 관심, 대학생, 보증금 지원 필요',
      lastActivity: getDateFromToday(-12),
      totalContracts: 0,
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 9,
      name: '송민준',
      phone: '010-9012-3456',
      email: 'song.minjun@example.com',
      memo: '인천 중구 상가 관심, 사업용',
      lastActivity: getDateFromToday(-6),
      totalContracts: 0,
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Gwangju Homes customers
    {
      id: 10,
      name: '임서연',
      phone: '010-0123-4567',
      email: 'lim.seoyeon@example.com',
      memo: '광주 북구 아파트 관심, 가족 거주용',
      lastActivity: getDateFromToday(-8),
      totalContracts: 1,
      partnerEmail: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 11,
      name: '조현우',
      phone: '010-1234-5679',
      email: 'cho.hyunwoo@example.com',
      memo: '서구 투룸 관심, 전세 선호',
      lastActivity: getDateFromToday(-9),
      totalContracts: 1,
      partnerEmail: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 12,
      name: '배수빈',
      phone: '010-2345-6780',
      email: 'bae.soobin@example.com',
      memo: '남구 주택 관심, 정원 있는 집 선호',
      lastActivity: getDateFromToday(-15),
      totalContracts: 1,
      partnerEmail: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Real Estate Partner (realestate@tofu.com) customers
    {
      id: 13,
      name: '오지훈',
      phone: '010-3456-7891',
      email: 'oh.jihun@example.com',
      memo: '강남구 논현동 빌라 관심, 프리미엄 매물 선호',
      lastActivity: getDateFromToday(-11),
      totalContracts: 2,
      partnerEmail: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 14,
      name: '신유나',
      phone: '010-4567-8902',
      email: 'shin.yuna@example.com',
      memo: '서초구 반포동 아파트 관심, 전세 선호',
      lastActivity: getDateFromToday(-6),
      totalContracts: 1,
      partnerEmail: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 15,
      name: '류성민',
      phone: '010-5678-9013',
      email: 'ryu.sungmin@example.com',
      memo: '송파구 문정동 오피스텔 관심, 월세 선호',
      lastActivity: getDateFromToday(-3),
      totalContracts: 0,
      partnerEmail: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  safeWrite(STORAGE_KEY, mockCustomers);
  return mockCustomers;
};












