// Real Estate Contracts store - manages contract data for real estate partners
const STORAGE_KEY = 'tofu-realestate-contracts';

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
 * Get all contracts
 * @returns {Array} Array of contract objects
 */
export const getContracts = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get contract by ID
 * @param {string|number} id - Contract ID
 * @returns {Object|null} Contract object or null
 */
export const getContractById = (id) => {
  const contracts = getContracts();
  return contracts.find((contract) => contract.id === id || contract.id === String(id)) || null;
};

/**
 * Add a new contract
 * @param {Object} contract - Contract object
 * @returns {Array} Updated contracts array
 */
export const addContract = (contract) => {
  const contracts = getContracts();
  const nextContracts = [contract, ...contracts];
  safeWrite(STORAGE_KEY, nextContracts);
  return nextContracts;
};

/**
 * Update contract by ID
 * @param {string|number} id - Contract ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated contracts array
 */
export const updateContract = (id, patch) => {
  const contracts = getContracts();
  const nextContracts = contracts.map((contract) =>
    contract.id === id || contract.id === String(id)
      ? { ...contract, ...patch, updatedAt: new Date().toISOString() }
      : contract
  );
  safeWrite(STORAGE_KEY, nextContracts);
  return nextContracts;
};

/**
 * Delete contract by ID
 * @param {string|number} id - Contract ID
 * @returns {Array} Updated contracts array
 */
export const deleteContract = (id) => {
  const contracts = getContracts();
  const nextContracts = contracts.filter(
    (contract) => contract.id !== id && contract.id !== String(id)
  );
  safeWrite(STORAGE_KEY, nextContracts);
  return nextContracts;
};

/**
 * Get contracts filtered by partner email or partnerId
 * @param {string} emailOrPartnerId - Partner email or ID
 * @returns {Array} Filtered contracts array
 */
export const getContractsByPartner = (emailOrPartnerId) => {
  const contracts = getContracts();
  return contracts.filter(
    (contract) =>
      contract.partnerEmail === emailOrPartnerId ||
      contract.partnerId === emailOrPartnerId ||
      contract.createdBy === emailOrPartnerId
  );
};

/**
 * Get contracts filtered by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered contracts array
 */
export const getContractsByStatus = (status) => {
  const contracts = getContracts();
  return contracts.filter((contract) => contract.status === status);
};

/**
 * Seed initial mock contracts data
 */
export const seedMockContracts = () => {
  const existing = getContracts();
  if (existing.length > 0) return existing;

  const now = new Date();
  
  const mockContracts = [
    {
      id: 1,
      customerId: 1,
      customer: { 
        name: '김철수', 
        phone: '010-1234-5678', 
        email: 'kim@example.com',
        role: 'Buyer'
      },
      listingId: 1,
      listing: { 
        id: 1,
        title: '강남구 역삼동 프리미엄 아파트', 
        type: '아파트', 
        address: '서울특별시 강남구 역삼동 123-45'
      },
      type: '매매',
      contractDate: '2025-12-01',
      moveInDate: '2026-01-15',
      salePrice: 300000000,
      deposit: null,
      monthlyRent: null,
      commission: 3000000,
      // Payment info (offline)
      paymentHandledOffline: true,
      depositAmount: null,
      paymentMethod: null,
      paymentDate: null,
      notes: '계약금 지급 완료, 나머지 금액 2025-12-15까지 지급 예정',
      status: 'Completed',
      activityHistory: [
        { id: 1, timestamp: '2025-12-01T10:30:00', actor: '홍길동', message: '계약 생성됨', type: 'contract' },
        { id: 2, timestamp: '2025-12-01T14:15:00', actor: '김부장', message: '계약금 입금 확인 (오프라인)', type: 'payment' },
        { id: 3, timestamp: '2025-12-02T09:00:00', actor: '홍길동', message: '계약서 작성 완료', type: 'contract' },
        { id: 4, timestamp: '2025-12-15T16:00:00', actor: '홍길동', message: '계약 완료 처리', type: 'contract' }
      ],
      attachments: [
        { id: 1, name: '계약서.pdf', size: '2.4MB', uploadDate: '2025-12-01', url: '#' },
        { id: 2, name: '등기부등본.pdf', size: '1.8MB', uploadDate: '2025-12-01', url: '#' }
      ],
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: '2025-12-01T10:30:00',
      updatedAt: '2025-12-15T16:00:00'
    },
    {
      id: 2,
      customerId: 2,
      customer: { 
        name: '이영희', 
        phone: '010-2345-6789', 
        email: 'lee@example.com',
        role: 'Tenant'
      },
      listingId: 2,
      listing: { 
        id: 2,
        title: '서초구 서초동 오피스텔', 
        type: '오피스텔', 
        address: '서울특별시 서초구 서초동 456-78'
      },
      type: '전세',
      contractDate: '2025-01-10',
      moveInDate: '2025-02-01',
      salePrice: null,
      deposit: 300000000,
      monthlyRent: null,
      commission: 1500000,
      paymentHandledOffline: true,
      depositAmount: 300000000,
      paymentMethod: 'Transfer',
      paymentDate: '2025-01-10',
      notes: '전세 보증금 입금 완료',
      status: 'Signed',
      activityHistory: [
        { id: 1, timestamp: '2025-01-10T09:00:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' },
        { id: 2, timestamp: '2025-01-10T14:00:00', actor: '이영희', message: '계약서 서명 완료', type: 'contract' },
        { id: 3, timestamp: '2025-01-10T15:30:00', actor: '홍길동', message: '보증금 입금 확인 (오프라인)', type: 'payment' }
      ],
      attachments: [
        { id: 1, name: '전세계약서.pdf', size: '1.9MB', uploadDate: '2025-01-10', url: '#' }
      ],
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: '2025-01-10T09:00:00',
      updatedAt: '2025-01-10T15:30:00'
    },
    {
      id: 3,
      customerId: 3,
      customer: { 
        name: '박민수', 
        phone: '010-3456-7890', 
        email: 'park@example.com',
        role: 'Buyer'
      },
      listingId: 3,
      listing: { 
        id: 3,
        title: '송파구 잠실동 고급 아파트', 
        type: '아파트', 
        address: '서울특별시 송파구 잠실동 789-12'
      },
      type: '월세',
      contractDate: '2025-01-05',
      moveInDate: '2025-01-20',
      salePrice: null,
      deposit: 500000000,
      monthlyRent: 1500000,
      commission: 2000000,
      paymentHandledOffline: true,
      depositAmount: 500000000,
      paymentMethod: 'Cash',
      paymentDate: '2025-01-05',
      notes: '보증금 현금 지급 완료, 월세는 매월 1일 입금',
      status: 'Reviewed',
      activityHistory: [
        { id: 1, timestamp: '2025-01-05T10:00:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' },
        { id: 2, timestamp: '2025-01-05T13:00:00', actor: '김부장', message: '계약서 검토 완료', type: 'contract' }
      ],
      attachments: [],
      partnerEmail: 'seoulrealestate@tofu.com',
      createdBy: 'seoulrealestate@tofu.com',
      createdAt: '2025-01-05T10:00:00',
      updatedAt: '2025-01-05T13:00:00'
    }
  ];

  safeWrite(STORAGE_KEY, mockContracts);
  return mockContracts;
};

