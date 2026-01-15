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
  if (!id) return null;
  const contracts = getContracts();
  // Try multiple matching strategies
  const contract = contracts.find((contract) => {
    // Exact match
    if (contract.id === id) return true;
    // String comparison
    if (String(contract.id) === String(id)) return true;
    // Number comparison
    if (Number(contract.id) === Number(id)) return true;
    return false;
  });
  return contract || null;
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
 * @param {string} userEmail - Optional user email to create contracts for
 */
export const seedMockContracts = (userEmail = 'seoulrealestate@tofu.com') => {
  const existing = getContracts();
  
  // Check if user already has contracts
  if (userEmail) {
    const userContracts = existing.filter(
      (contract) =>
        contract.partnerEmail === userEmail ||
        contract.partnerId === userEmail ||
        contract.createdBy === userEmail
    );
    if (userContracts.length > 0) return existing;
  } else if (existing.length > 0) {
    return existing;
  }

  const now = new Date();
  const baseId = existing.length > 0 ? Math.max(...existing.map(c => Number(c.id) || 0)) + 1 : 1;
  
  const mockContracts = [
    {
      id: baseId,
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
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-12-01T10:30:00',
      updatedAt: '2025-12-15T16:00:00'
    },
    {
      id: baseId + 1,
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
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-10T09:00:00',
      updatedAt: '2025-01-10T15:30:00'
    },
    {
      id: baseId + 2,
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
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-05T10:00:00',
      updatedAt: '2025-01-05T13:00:00'
    },
    {
      id: baseId + 3,
      customerId: 4,
      customer: { 
        name: '최지영', 
        phone: '010-4567-8901', 
        email: 'choi@example.com',
        role: 'Buyer'
      },
      listingId: 4,
      listing: { 
        id: 4,
        title: '마포구 상암동 신축 오피스텔', 
        type: '오피스텔', 
        address: '서울특별시 마포구 상암동 321-67'
      },
      type: '매매',
      contractDate: '2025-01-20',
      moveInDate: '2025-03-01',
      salePrice: 250000000,
      deposit: null,
      monthlyRent: null,
      commission: 2500000,
      paymentHandledOffline: true,
      depositAmount: null,
      paymentMethod: null,
      paymentDate: null,
      notes: '계약 진행 중',
      status: 'Drafted',
      activityHistory: [
        { id: 1, timestamp: '2025-01-20T11:00:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' }
      ],
      attachments: [],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-20T11:00:00',
      updatedAt: '2025-01-20T11:00:00'
    },
    {
      id: baseId + 4,
      customerId: 5,
      customer: { 
        name: '정수진', 
        phone: '010-5678-9012', 
        email: 'jung@example.com',
        role: 'Tenant'
      },
      listingId: 5,
      listing: { 
        id: 5,
        title: '용산구 이촌동 전세 아파트', 
        type: '아파트', 
        address: '서울특별시 용산구 이촌동 654-32'
      },
      type: '전세',
      contractDate: '2025-01-15',
      moveInDate: '2025-02-10',
      salePrice: null,
      deposit: 200000000,
      monthlyRent: null,
      commission: 1000000,
      paymentHandledOffline: true,
      depositAmount: 200000000,
      paymentMethod: 'Transfer',
      paymentDate: '2025-01-15',
      notes: '전세 보증금 입금 완료, 입주 예정',
      status: 'Signed',
      activityHistory: [
        { id: 1, timestamp: '2025-01-15T09:30:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' },
        { id: 2, timestamp: '2025-01-15T14:20:00', actor: '정수진', message: '계약서 서명 완료', type: 'contract' },
        { id: 3, timestamp: '2025-01-15T16:00:00', actor: '홍길동', message: '보증금 입금 확인 (오프라인)', type: 'payment' }
      ],
      attachments: [
        { id: 1, name: '전세계약서.pdf', size: '2.1MB', uploadDate: '2025-01-15', url: '#' }
      ],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-15T09:30:00',
      updatedAt: '2025-01-15T16:00:00'
    },
    {
      id: baseId + 5,
      customerId: 6,
      customer: { 
        name: '한동욱', 
        phone: '010-6789-0123', 
        email: 'han@example.com',
        role: 'Buyer'
      },
      listingId: 6,
      listing: { 
        id: 6,
        title: '강동구 천호동 투룸 원룸', 
        type: '원룸', 
        address: '서울특별시 강동구 천호동 987-65'
      },
      type: '월세',
      contractDate: '2025-01-18',
      moveInDate: '2025-02-05',
      salePrice: null,
      deposit: 10000000,
      monthlyRent: 600000,
      commission: 800000,
      paymentHandledOffline: true,
      depositAmount: 10000000,
      paymentMethod: 'Cash',
      paymentDate: '2025-01-18',
      notes: '보증금 및 첫 달 월세 지급 완료',
      status: 'Completed',
      activityHistory: [
        { id: 1, timestamp: '2025-01-18T10:15:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' },
        { id: 2, timestamp: '2025-01-18T13:30:00', actor: '김부장', message: '계약서 검토 완료', type: 'contract' },
        { id: 3, timestamp: '2025-01-18T15:00:00', actor: '한동욱', message: '계약서 서명 완료', type: 'contract' },
        { id: 4, timestamp: '2025-01-18T15:30:00', actor: '홍길동', message: '보증금 및 월세 입금 확인 (오프라인)', type: 'payment' },
        { id: 5, timestamp: '2025-01-18T16:00:00', actor: '홍길동', message: '계약 완료 처리', type: 'contract' }
      ],
      attachments: [
        { id: 1, name: '월세계약서.pdf', size: '1.7MB', uploadDate: '2025-01-18', url: '#' },
        { id: 2, name: '신분증사본.pdf', size: '0.5MB', uploadDate: '2025-01-18', url: '#' }
      ],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-18T10:15:00',
      updatedAt: '2025-01-18T16:00:00'
    },
    {
      id: baseId + 6,
      customerId: 7,
      customer: { 
        name: '윤서연', 
        phone: '010-7890-1234', 
        email: 'yoon@example.com',
        role: 'Buyer'
      },
      listingId: 7,
      listing: { 
        id: 7,
        title: '노원구 상계동 프리미엄 아파트', 
        type: '아파트', 
        address: '서울특별시 노원구 상계동 147-85'
      },
      type: '매매',
      contractDate: '2025-01-12',
      moveInDate: '2025-02-28',
      salePrice: 450000000,
      deposit: null,
      monthlyRent: null,
      commission: 4500000,
      paymentHandledOffline: true,
      depositAmount: null,
      paymentMethod: null,
      paymentDate: null,
      notes: '계약금 지급 예정, 잔금은 2025-02-20까지',
      status: 'Reviewed',
      activityHistory: [
        { id: 1, timestamp: '2025-01-12T09:00:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' },
        { id: 2, timestamp: '2025-01-12T11:30:00', actor: '김부장', message: '계약서 검토 완료', type: 'contract' }
      ],
      attachments: [
        { id: 1, name: '매매계약서.pdf', size: '2.8MB', uploadDate: '2025-01-12', url: '#' }
      ],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-12T09:00:00',
      updatedAt: '2025-01-12T11:30:00'
    },
    {
      id: baseId + 7,
      customerId: 8,
      customer: { 
        name: '강태현', 
        phone: '010-8901-2345', 
        email: 'kang@example.com',
        role: 'Tenant'
      },
      listingId: 8,
      listing: { 
        id: 8,
        title: '은평구 불광동 신축 원룸', 
        type: '원룸', 
        address: '서울특별시 은평구 불광동 258-41'
      },
      type: '전세',
      contractDate: '2025-01-22',
      moveInDate: '2025-02-15',
      salePrice: null,
      deposit: 150000000,
      monthlyRent: null,
      commission: 750000,
      paymentHandledOffline: true,
      depositAmount: null,
      paymentMethod: null,
      paymentDate: null,
      notes: '계약 진행 중, 보증금 입금 대기',
      status: 'Drafted',
      activityHistory: [
        { id: 1, timestamp: '2025-01-22T10:00:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' }
      ],
      attachments: [],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-22T10:00:00',
      updatedAt: '2025-01-22T10:00:00'
    },
    {
      id: baseId + 8,
      customerId: 9,
      customer: { 
        name: '임지혜', 
        phone: '010-9012-3456', 
        email: 'lim@example.com',
        role: 'Tenant'
      },
      listingId: 9,
      listing: { 
        id: 9,
        title: '관악구 신림동 투룸', 
        type: '투룸', 
        address: '서울특별시 관악구 신림동 369-74'
      },
      type: '월세',
      contractDate: '2025-01-08',
      moveInDate: '2025-01-25',
      salePrice: null,
      deposit: 5000000,
      monthlyRent: 800000,
      commission: 600000,
      paymentHandledOffline: true,
      depositAmount: 5000000,
      paymentMethod: 'Transfer',
      paymentDate: '2025-01-08',
      notes: '보증금 및 첫 달 월세 입금 완료',
      status: 'Signed',
      activityHistory: [
        { id: 1, timestamp: '2025-01-08T09:00:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' },
        { id: 2, timestamp: '2025-01-08T13:00:00', actor: '임지혜', message: '계약서 서명 완료', type: 'contract' },
        { id: 3, timestamp: '2025-01-08T14:30:00', actor: '홍길동', message: '보증금 및 월세 입금 확인 (오프라인)', type: 'payment' }
      ],
      attachments: [
        { id: 1, name: '월세계약서.pdf', size: '1.6MB', uploadDate: '2025-01-08', url: '#' }
      ],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-08T09:00:00',
      updatedAt: '2025-01-08T14:30:00'
    },
    {
      id: baseId + 9,
      customerId: 10,
      customer: { 
        name: '오준호', 
        phone: '010-0123-4567', 
        email: 'oh@example.com',
        role: 'Buyer'
      },
      listingId: 10,
      listing: { 
        id: 10,
        title: '성동구 성수동 랜드마크 오피스텔', 
        type: '오피스텔', 
        address: '서울특별시 성동구 성수동 741-25'
      },
      type: '매매',
      contractDate: '2025-01-25',
      moveInDate: '2025-03-15',
      salePrice: 380000000,
      deposit: null,
      monthlyRent: null,
      commission: 3800000,
      paymentHandledOffline: true,
      depositAmount: null,
      paymentMethod: null,
      paymentDate: null,
      notes: '계약 진행 중',
      status: 'Drafted',
      activityHistory: [
        { id: 1, timestamp: '2025-01-25T11:30:00', actor: '홍길동', message: '계약 초안 작성', type: 'contract' }
      ],
      attachments: [],
      partnerEmail: userEmail,
      createdBy: userEmail,
      createdAt: '2025-01-25T11:30:00',
      updatedAt: '2025-01-25T11:30:00'
    }
  ];

  // Append new contracts to existing ones (don't overwrite)
  const allContracts = [...existing, ...mockContracts];
  safeWrite(STORAGE_KEY, allContracts);
  return allContracts;
};








