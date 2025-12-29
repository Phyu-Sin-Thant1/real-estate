// Real-Estate Listings store - manages all property listings
const STORAGE_KEY = 'tofu-realestate-listings';

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
 * Get all listings
 * @returns {Array} Array of listing objects
 */
export const getListings = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get listing by ID
 * @param {string|number} id - Listing ID
 * @returns {Object|null} Listing object or null
 */
export const getListingById = (id) => {
  const listings = getListings();
  return listings.find((listing) => listing.id === id || listing.id === String(id)) || null;
};

/**
 * Add a new listing
 * @param {Object} listing - Listing object
 * @returns {Array} Updated listings array
 */
export const addListing = (listing) => {
  const listings = getListings();
  const nextListings = [listing, ...listings];
  safeWrite(STORAGE_KEY, nextListings);
  return nextListings;
};

/**
 * Update listing by ID
 * @param {string|number} id - Listing ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated listings array
 */
export const updateListing = (id, patch) => {
  const listings = getListings();
  const nextListings = listings.map((listing) =>
    listing.id === id || listing.id === String(id)
      ? { ...listing, ...patch, updatedAt: new Date().toISOString() }
      : listing
  );
  safeWrite(STORAGE_KEY, nextListings);
  return nextListings;
};

/**
 * Get listings filtered by partner email or partnerId
 * @param {string} emailOrPartnerId - Partner email or ID
 * @returns {Array} Filtered listings array
 */
export const getListingsByPartner = (emailOrPartnerId) => {
  const listings = getListings();
  return listings.filter(
    (listing) =>
      listing.partnerEmail === emailOrPartnerId ||
      listing.partnerId === emailOrPartnerId ||
      listing.createdBy === emailOrPartnerId
  );
};

/**
 * Get listings filtered by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered listings array
 */
export const getListingsByStatus = (status) => {
  const listings = getListings();
  return listings.filter((listing) => listing.status === status);
};

/**
 * Seed initial mock listings data
 */
export const seedMockListings = () => {
  const existing = getListings();
  if (existing.length > 0) return existing;

  const now = new Date();
  
  // Helper to get date N days from today
  const getDateFromToday = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const mockListings = [
    // Seoul Real Estate listings
    {
      id: 1,
      title: '강남구 역삼동 프리미엄 아파트',
      propertyType: '아파트',
      transactionType: '매매',
      price: 1250000000,
      address: '서울특별시 강남구 역삼동',
      detailAddress: '역삼동 123-45',
      area: 84.5,
      floor: 15,
      totalFloors: 20,
      rooms: 3,
      bathrooms: 2,
      status: 'LIVE',
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: '서초구 서초동 오피스텔',
      propertyType: '오피스텔',
      transactionType: '전세',
      deposit: 300000000,
      address: '서울특별시 서초구 서초동',
      detailAddress: '서초동 456-78',
      area: 32.5,
      floor: 8,
      totalFloors: 15,
      rooms: 1,
      bathrooms: 1,
      status: 'LIVE',
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      title: '송파구 잠실동 고급 아파트',
      propertyType: '아파트',
      transactionType: '월세',
      deposit: 500000000,
      monthly: 1500000,
      maintenanceFee: 150000,
      address: '서울특별시 송파구 잠실동',
      detailAddress: '잠실동 789-12',
      area: 102.3,
      floor: 12,
      totalFloors: 25,
      rooms: 4,
      bathrooms: 2,
      status: 'COMPLETED',
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      title: '강동구 천호동 주택',
      propertyType: '주택',
      transactionType: '매매',
      price: 800000000,
      address: '서울특별시 강동구 천호동',
      detailAddress: '천호동 234-56',
      area: 156.8,
      floor: 2,
      totalFloors: 2,
      rooms: 5,
      bathrooms: 3,
      status: 'LIVE',
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      title: '마포구 상암동 신축 오피스텔',
      propertyType: '오피스텔',
      transactionType: '전세',
      deposit: 250000000,
      address: '서울특별시 마포구 상암동',
      detailAddress: '상암동 345-67',
      area: 28.5,
      floor: 5,
      totalFloors: 12,
      rooms: 1,
      bathrooms: 1,
      status: 'PENDING',
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Incheon Properties listings
    {
      id: 6,
      title: '인천 남동구 구월동 아파트',
      propertyType: '아파트',
      transactionType: '매매',
      price: 650000000,
      address: '인천광역시 남동구 구월동',
      detailAddress: '구월동 111-22',
      area: 72.3,
      floor: 10,
      totalFloors: 18,
      rooms: 3,
      bathrooms: 2,
      status: 'LIVE',
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 7,
      title: '인천 연수구 송도동 프리미엄 아파트',
      propertyType: '아파트',
      transactionType: '전세',
      deposit: 400000000,
      address: '인천광역시 연수구 송도동',
      detailAddress: '송도동 222-33',
      area: 95.7,
      floor: 20,
      totalFloors: 30,
      rooms: 4,
      bathrooms: 2,
      status: 'LIVE',
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 8,
      title: '인천 부평구 부평동 원룸',
      propertyType: '원룸',
      transactionType: '월세',
      deposit: 10000000,
      monthly: 500000,
      maintenanceFee: 50000,
      address: '인천광역시 부평구 부평동',
      detailAddress: '부평동 333-44',
      area: 18.5,
      floor: 3,
      totalFloors: 5,
      rooms: 1,
      bathrooms: 1,
      status: 'REJECTED',
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 9,
      title: '인천 중구 신포동 상가',
      propertyType: '상가',
      transactionType: '매매',
      price: 350000000,
      address: '인천광역시 중구 신포동',
      detailAddress: '신포동 444-55',
      area: 45.2,
      floor: 1,
      totalFloors: 3,
      rooms: 2,
      bathrooms: 1,
      status: 'PENDING',
      partnerEmail: 'incheonproperties@tofu.com',
      createdBy: 'incheonproperties@tofu.com',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Gwangju Homes listings
    {
      id: 10,
      title: '광주 북구 용봉동 아파트',
      propertyType: '아파트',
      transactionType: '매매',
      price: 420000000,
      address: '광주광역시 북구 용봉동',
      detailAddress: '용봉동 555-66',
      area: 68.9,
      floor: 8,
      totalFloors: 15,
      rooms: 3,
      bathrooms: 2,
      status: 'LIVE',
      partnerEmail: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 11,
      title: '광주 서구 치평동 투룸',
      propertyType: '투룸',
      transactionType: '전세',
      deposit: 150000000,
      address: '광주광역시 서구 치평동',
      detailAddress: '치평동 666-77',
      area: 35.5,
      floor: 4,
      totalFloors: 6,
      rooms: 2,
      bathrooms: 1,
      status: 'LIVE',
      partnerEmail: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 12,
      title: '광주 남구 봉선동 주택',
      propertyType: '주택',
      transactionType: '매매',
      price: 280000000,
      address: '광주광역시 남구 봉선동',
      detailAddress: '봉선동 777-88',
      area: 98.3,
      floor: 1,
      totalFloors: 2,
      rooms: 4,
      bathrooms: 2,
      status: 'COMPLETED',
      partnerEmail: 'gwangjuhomes@tofu.com',
      createdBy: 'gwangjuhomes@tofu.com',
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Real Estate Partner (realestate@tofu.com) listings
    {
      id: 13,
      title: '강남구 논현동 고급 빌라',
      propertyType: '빌라',
      transactionType: '매매',
      price: 950000000,
      address: '서울특별시 강남구 논현동',
      detailAddress: '논현동 888-99',
      area: 78.2,
      floor: 3,
      totalFloors: 4,
      rooms: 3,
      bathrooms: 2,
      status: 'LIVE',
      partnerEmail: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 14,
      title: '서초구 반포동 아파트',
      propertyType: '아파트',
      transactionType: '전세',
      deposit: 500000000,
      address: '서울특별시 서초구 반포동',
      detailAddress: '반포동 999-00',
      area: 88.5,
      floor: 18,
      totalFloors: 22,
      rooms: 3,
      bathrooms: 2,
      status: 'LIVE',
      partnerEmail: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 15,
      title: '송파구 문정동 오피스텔',
      propertyType: '오피스텔',
      transactionType: '월세',
      deposit: 20000000,
      monthly: 800000,
      maintenanceFee: 100000,
      address: '서울특별시 송파구 문정동',
      detailAddress: '문정동 101-11',
      area: 26.8,
      floor: 7,
      totalFloors: 10,
      rooms: 1,
      bathrooms: 1,
      status: 'PENDING',
      partnerEmail: 'realestate@tofu.com',
      createdBy: 'realestate@tofu.com',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  safeWrite(STORAGE_KEY, mockListings);
  return mockListings;
};

