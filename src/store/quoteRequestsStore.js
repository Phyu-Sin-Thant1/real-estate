// Quote Requests store - manages all quote requests from users
const STORAGE_KEY = 'tofu-quote-requests';

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
 * Initialize with mock data if empty
 */
const initializeMockData = () => {
  const existing = safeRead(STORAGE_KEY, []);
  if (existing.length === 0) {
    const now = new Date();
    const mockRequests = [
      {
        id: 'quote-1',
        status: 'pending',
        serviceId: 'service-4',
        serviceName: 'Full Packing & Moving',
        serviceType: 'packing-moving',
        agencyId: 'moving-agency-1',
        agencyName: 'Prime Movers',
        customerName: '김철수',
        customerPhone: '010-1234-5678',
        customerEmail: 'kim@example.com',
        pickupAddress: '서울특별시 강남구 역삼동 123-45',
        deliveryAddress: '서울특별시 서초구 방배동 67-89',
        preferredDate: '2025-01-20',
        customerMessage: '피아노가 포함되어 있어서 조심스럽게 다뤄주세요.',
        basePrice: 150000,
        totalPrice: 220000,
        priceBreakdown: {
          basePrice: 150000,
          extraFloors: 40000,
          largeItems: 30000,
          fragileHandling: 0
        },
        extraOptions: {
          extraFloors: 2,
          largeItems: 1,
          itemWeight: '600kg',
          fragileHandling: 0,
          additionalRequests: '피아노 포함, 3층 아파트 엘리베이터 있음'
        },
        serviceLimitations: {
          maxFloors: 3,
          maxWeight: 500,
          maxDistance: 50,
          description: 'This service covers up to 3 floors and up to 500kg of items. Additional floors or heavy items will incur extra fees.'
        },
        createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
        updatedAt: new Date(now.getTime() - 2 * 3600000).toISOString()
      },
      {
        id: 'quote-2',
        status: 'pending',
        serviceId: 'service-1',
        serviceName: 'Standard Home Delivery',
        serviceType: 'home-delivery',
        agencyId: 'moving-agency-1',
        agencyName: 'Prime Movers',
        customerName: '이영희',
        customerPhone: '010-2345-6789',
        customerEmail: 'lee@example.com',
        pickupAddress: '서울특별시 마포구 서교동 34-56',
        deliveryAddress: '서울특별시 용산구 한남동 78-90',
        preferredDate: '2025-01-18',
        customerMessage: '원룸 이사입니다. 물건이 많지 않아요.',
        basePrice: 50000,
        totalPrice: 70000,
        priceBreakdown: {
          basePrice: 50000,
          extraFloors: 20000,
          largeItems: 0,
          fragileHandling: 0
        },
        extraOptions: {
          extraFloors: 1,
          largeItems: 0,
          itemWeight: '250kg',
          fragileHandling: 0,
          additionalRequests: ''
        },
        serviceLimitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 40,
          description: 'This service covers up to 2 floors and up to 300kg of items. Additional floors or heavy items will incur extra fees.'
        },
        createdAt: new Date(now.getTime() - 5 * 3600000).toISOString(), // 5 hours ago
        updatedAt: new Date(now.getTime() - 5 * 3600000).toISOString()
      },
      {
        id: 'quote-3',
        status: 'approved',
        serviceId: 'service-3',
        serviceName: 'Office Relocation Service',
        serviceType: 'office-relocation',
        agencyId: 'moving-agency-1',
        agencyName: 'Prime Movers',
        customerName: '박민수',
        customerPhone: '010-3456-7890',
        customerEmail: 'park@example.com',
        pickupAddress: '서울특별시 송파구 잠실동 56-78',
        deliveryAddress: '서울특별시 강동구 명일동 90-12',
        preferredDate: '2025-01-25',
        customerMessage: '사무실 이사입니다. IT 장비가 많아서 조심스럽게 다뤄주세요.',
        basePrice: 200000,
        totalPrice: 280000,
        priceBreakdown: {
          basePrice: 200000,
          extraFloors: 50000,
          largeItems: 30000,
          fragileHandling: 0
        },
        extraOptions: {
          extraFloors: 2,
          largeItems: 1,
          itemWeight: '700kg',
          fragileHandling: 0,
          additionalRequests: '서버실 장비 포함, 주말 이사 희망'
        },
        serviceLimitations: {
          maxFloors: 4,
          maxWeight: 600,
          maxDistance: 60,
          description: 'This service covers up to 4 floors and up to 600kg of office furniture. Additional floors or heavy items will incur extra fees.'
        },
        adminNotes: '견적 승인 완료. 주말 이사 가능합니다.',
        reviewedBy: 'admin',
        reviewedAt: new Date(now.getTime() - 1 * 3600000).toISOString(), // 1 hour ago
        createdAt: new Date(now.getTime() - 24 * 3600000).toISOString(), // 1 day ago
        updatedAt: new Date(now.getTime() - 1 * 3600000).toISOString()
      },
      {
        id: 'quote-4',
        status: 'rejected',
        serviceId: 'service-2',
        serviceName: 'Express Home Delivery',
        serviceType: 'home-delivery',
        agencyId: 'moving-agency-1',
        agencyName: 'Prime Movers',
        customerName: '최지은',
        customerPhone: '010-4567-8901',
        customerEmail: 'choi@example.com',
        pickupAddress: '서울특별시 종로구 인사동 12-34',
        deliveryAddress: '서울특별시 중구 을지로 56-78',
        preferredDate: '2025-01-15',
        customerMessage: '급하게 이사해야 해서 익스프레스 서비스를 원합니다.',
        basePrice: 80000,
        totalPrice: 150000,
        priceBreakdown: {
          basePrice: 80000,
          extraFloors: 50000,
          largeItems: 20000,
          fragileHandling: 0
        },
        extraOptions: {
          extraFloors: 2,
          largeItems: 0,
          itemWeight: '350kg',
          fragileHandling: 0,
          additionalRequests: '당일 이사 희망'
        },
        serviceLimitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 30,
          description: 'This express service covers up to 2 floors and up to 300kg of items. Additional floors or heavy items will incur extra fees.'
        },
        adminNotes: '무게 제한 초과 및 거리 제한 초과로 인해 거절되었습니다. 다른 서비스 패키지를 추천드립니다.',
        reviewedBy: 'admin',
        reviewedAt: new Date(now.getTime() - 3 * 3600000).toISOString(), // 3 hours ago
        createdAt: new Date(now.getTime() - 6 * 3600000).toISOString(), // 6 hours ago
        updatedAt: new Date(now.getTime() - 3 * 3600000).toISOString()
      },
      {
        id: 'quote-5',
        status: 'pending',
        serviceId: 'service-14',
        serviceName: 'Standard Packing & Moving',
        serviceType: 'packing-moving',
        agencyId: 'moving-agency-4',
        agencyName: 'Friendly Movers',
        customerName: '정하늘',
        customerPhone: '010-5678-9012',
        customerEmail: 'jung@example.com',
        pickupAddress: '서울특별시 성동구 성수동 34-56',
        deliveryAddress: '서울특별시 광진구 구의동 78-90',
        preferredDate: '2025-01-22',
        customerMessage: '가족 이사입니다. 유리 제품이 많아서 포장을 잘 해주세요.',
        basePrice: 120000,
        totalPrice: 150000,
        priceBreakdown: {
          basePrice: 120000,
          extraFloors: 0,
          largeItems: 0,
          fragileHandling: 30000
        },
        extraOptions: {
          extraFloors: 0,
          largeItems: 0,
          itemWeight: '450kg',
          fragileHandling: 3,
          additionalRequests: '유리 제품 3개 포함, 신중한 포장 필요'
        },
        serviceLimitations: {
          maxFloors: 3,
          maxWeight: 500,
          maxDistance: 50,
          description: 'This standard service covers up to 3 floors and up to 500kg of items. Additional floors or heavy items will incur extra fees.'
        },
        createdAt: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
        updatedAt: new Date(now.getTime() - 30 * 60000).toISOString()
      },
      {
        id: 'quote-6',
        status: 'approved',
        serviceId: 'service-6',
        serviceName: 'Premium Home Delivery',
        serviceType: 'home-delivery',
        agencyId: 'moving-agency-2',
        agencyName: 'Quick Transport Services',
        customerName: '한소희',
        customerPhone: '010-6789-0123',
        customerEmail: 'han@example.com',
        pickupAddress: '서울특별시 강남구 청담동 11-22',
        deliveryAddress: '서울특별시 강남구 압구정동 33-44',
        preferredDate: '2025-01-19',
        customerMessage: '프리미엄 서비스로 깔끔하게 이사하고 싶습니다.',
        basePrice: 100000,
        totalPrice: 100000,
        priceBreakdown: {
          basePrice: 100000,
          extraFloors: 0,
          largeItems: 0,
          fragileHandling: 0
        },
        extraOptions: {
          extraFloors: 0,
          largeItems: 0,
          itemWeight: '350kg',
          fragileHandling: 0,
          additionalRequests: ''
        },
        serviceLimitations: {
          maxFloors: 3,
          maxWeight: 400,
          maxDistance: 50,
          description: 'This premium service covers up to 3 floors and up to 400kg of items. Additional floors or heavy items will incur extra fees.'
        },
        adminNotes: '프리미엄 서비스 승인 완료. 화이트 글로브 서비스 제공 가능합니다.',
        reviewedBy: 'admin',
        reviewedAt: new Date(now.getTime() - 12 * 3600000).toISOString(), // 12 hours ago
        createdAt: new Date(now.getTime() - 36 * 3600000).toISOString(), // 1.5 days ago
        updatedAt: new Date(now.getTime() - 12 * 3600000).toISOString()
      }
    ];
    safeWrite(STORAGE_KEY, mockRequests);
    return mockRequests;
  }
  return existing;
};

/**
 * Get all quote requests
 */
export const getAllQuoteRequests = () => {
  const requests = safeRead(STORAGE_KEY, []);
  // Initialize mock data if empty
  if (requests.length === 0) {
    return initializeMockData();
  }
  return requests;
};

/**
 * Get quote requests by agency/partner
 */
export const getQuoteRequestsByAgency = (agencyId) => {
  const requests = getAllQuoteRequests(); // This will initialize mock data if empty
  if (!agencyId) return requests; // If no agencyId provided, return all
  return requests.filter(req => req.agencyId === agencyId);
};

/**
 * Get quote request by ID
 */
export const getQuoteRequestById = (id) => {
  const requests = getAllQuoteRequests();
  return requests.find(req => req.id === id) || null;
};

/**
 * Create a new quote request
 */
export const createQuoteRequest = (quoteData) => {
  const requests = getAllQuoteRequests();
  const newRequest = {
    id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending', // pending, approved, rejected
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...quoteData
  };
  requests.push(newRequest);
  safeWrite(STORAGE_KEY, requests);
  return newRequest;
};

/**
 * Update quote request status
 */
export const updateQuoteRequestStatus = (id, status, adminNotes = '') => {
  const requests = getAllQuoteRequests();
  const updated = requests.map(req => {
    if (req.id === id) {
      return {
        ...req,
        status,
        adminNotes,
        updatedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin' // In real app, this would be the logged-in admin
      };
    }
    return req;
  });
  safeWrite(STORAGE_KEY, updated);
  return updated.find(req => req.id === id);
};

/**
 * Delete quote request
 */
export const deleteQuoteRequest = (id) => {
  const requests = getAllQuoteRequests();
  const filtered = requests.filter(req => req.id !== id);
  safeWrite(STORAGE_KEY, filtered);
  return true;
};

/**
 * Get quote requests by status
 */
export const getQuoteRequestsByStatus = (status) => {
  const requests = getAllQuoteRequests();
  return requests.filter(req => req.status === status);
};

