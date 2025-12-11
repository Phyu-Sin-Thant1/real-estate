// Mock data for Real Estate Dashboard

// Dashboard Overview Data
export const dashboardStats = [
  { label: '총 고객 수', value: '1,234', change: '+12%' },
  { label: '이번 달 매출', value: '₩45,678,900', change: '+8%' },
  { label: '진행 중인 계약 수', value: '23', change: '+5' },
  { label: '완료율', value: '94%', change: '+2%' },
];

export const recentActivities = [
  { id: 1, text: '새로운 요청이 접수되었습니다.', time: '2시간 전' },
  { id: 2, text: '계약이 체결되었습니다.', time: '5시간 전' },
  { id: 3, text: '새로운 문의가 도착했습니다.', time: '1일 전' },
  { id: 4, text: '매물이 등록되었습니다.', time: '1일 전' },
  { id: 5, text: '고객이 방문 예약을 했습니다.', time: '2일 전' },
];

// Contracts Data
export const contractStatuses = ['전체', '진행중', '완료', '취소'];

export const contractTypes = ['매매', '전세', '월세'];

// Enhanced contracts with more detailed information
export const contracts = [
  {
    id: 1,
    customer: { 
      name: '김철수', 
      phone: '010-1234-5678', 
      email: 'kim@example.com', 
      type: 'Buyer',
      memo: 'VIP 고객, 빠른 결정 선호'
    },
    listing: { 
      id: 1,
      title: '강남 아파트 A동 101호', 
      type: '아파트', 
      address: '서울특별시 강남구 역삼동 123-45',
      link: '/business/real-estate/listings/1'
    },
    type: '매매',
    contractDate: '2025-12-01',
    moveInDate: '2026-01-15',
    term: '2025-12-01 ~ 2026-01-15',
    salePrice: '300000000',
    deposit: null,
    monthlyRent: null,
    commission: '3000000',
    notes: '계약금 지급 완료, 나머지 금액 2025-12-15까지 지급 예정',
    activityHistory: [
      { id: 1, timestamp: '2025-12-01T10:30:00', actor: '홍길동', message: '계약 생성됨' },
      { id: 2, timestamp: '2025-12-01T14:15:00', actor: '김부장', message: '계약금 입금 확인' },
      { id: 3, timestamp: '2025-12-02T09:00:00', actor: '홍길동', message: '계약서 작성 완료' }
    ],
    attachments: [
      { id: 1, name: '계약서.pdf', size: '2.4MB', uploadDate: '2025-12-01', url: '#' },
      { id: 2, name: '등기부등본.pdf', size: '1.8MB', uploadDate: '2025-12-01', url: '#' }
    ],
    status: '완료',
    createdBy: '홍길동',
    createdAt: '2025-12-01T10:30:00',
    updatedAt: '2025-12-02T09:00:00'
  },
  {
    id: 2,
    customer: { 
      name: '이영희', 
      phone: '010-2345-6789', 
      email: 'lee@example.com', 
      type: 'Tenant',
      memo: '펫 소유자, 반려견 동반 가능한 매물 요청'
    },
    listing: { 
      id: 2,
      title: '송파 오피스텔 B동 502호', 
      type: '오피스텔', 
      address: '서울특별시 송파구 잠실동 67-89',
      link: '/business/real-estate/listings/2'
    },
    type: '전세',
    contractDate: '2025-11-28',
    moveInDate: '2025-12-20',
    term: '2025-11-28 ~ 2026-11-27',
    salePrice: null,
    deposit: '200000000',
    monthlyRent: null,
    commission: '2000000',
    notes: '보증금 2억원, 중도금 1억원 분할 지급 예정',
    activityHistory: [
      { id: 1, timestamp: '2025-11-28T11:20:00', actor: '김부장', message: '계약 생성됨' },
      { id: 2, timestamp: '2025-11-29T15:45:00', actor: '이영희', message: '보증금 1억원 입금' }
    ],
    attachments: [
      { id: 1, name: '임대차계약서.pdf', size: '1.9MB', uploadDate: '2025-11-28', url: '#' }
    ],
    status: '진행중',
    createdBy: '김부장',
    createdAt: '2025-11-28T11:20:00',
    updatedAt: '2025-11-29T15:45:00'
  },
  {
    id: 3,
    customer: { 
      name: '박민수', 
      phone: '010-3456-7890', 
      email: 'park@example.com', 
      type: 'Tenant',
      memo: '대학생, 보증금 지원 필요'
    },
    listing: { 
      id: 3,
      title: '용산 원룸 301호', 
      type: '원룸', 
      address: '서울특별시 용산구 한남동 34-56',
      link: '/business/real-estate/listings/3'
    },
    type: '월세',
    contractDate: '2025-11-25',
    moveInDate: '2025-12-10',
    term: '2025-12-10 ~ 2026-12-09',
    salePrice: null,
    deposit: '50000000',
    monthlyRent: '1500000',
    commission: '1000000',
    notes: '월세 150만원, 관리비 별도 5만원',
    activityHistory: [
      { id: 1, timestamp: '2025-11-25T09:15:00', actor: '홍길동', message: '계약 생성됨' },
      { id: 2, timestamp: '2025-11-26T14:30:00', actor: '박민수', message: '보증금 입금 완료' },
      { id: 3, timestamp: '2025-12-10T10:00:00', actor: '홍길동', message: '입주 완료' }
    ],
    attachments: [
      { id: 1, name: '월세계약서.pdf', size: '1.5MB', uploadDate: '2025-11-25', url: '#' },
      { id: 2, name: '보증금 영수증.pdf', size: '0.8MB', uploadDate: '2025-11-26', url: '#' }
    ],
    status: '완료',
    createdBy: '홍길동',
    createdAt: '2025-11-25T09:15:00',
    updatedAt: '2025-12-10T10:00:00'
  },
  {
    id: 4,
    customer: { 
      name: '최지은', 
      phone: '010-4567-8901', 
      email: 'choi@example.com', 
      type: 'Buyer',
      memo: '해외 거주자, 비대면 계약 선호'
    },
    listing: { 
      id: 4,
      title: '마포 아파트 C동 801호', 
      type: '아파트', 
      address: '서울특별시 마포구 서교동 78-90',
      link: '/business/real-estate/listings/4'
    },
    type: '매매',
    contractDate: '2025-11-20',
    moveInDate: null,
    term: null,
    salePrice: '450000000',
    deposit: null,
    monthlyRent: null,
    commission: '4500000',
    notes: '계약 체결 후 개인 사정으로 취소 요청',
    activityHistory: [
      { id: 1, timestamp: '2025-11-20T13:45:00', actor: '김부장', message: '계약 생성됨' },
      { id: 2, timestamp: '2025-11-22T16:20:00', actor: '최지은', message: '계약 취소 요청' },
      { id: 3, timestamp: '2025-11-25T11:10:00', actor: '김부장', message: '계약 취소 처리 완료' }
    ],
    attachments: [
      { id: 1, name: '매매계약서.pdf', size: '2.1MB', uploadDate: '2025-11-20', url: '#' },
      { id: 2, name: '취소 요청서.pdf', size: '0.5MB', uploadDate: '2025-11-22', url: '#' }
    ],
    status: '취소',
    createdBy: '김부장',
    createdAt: '2025-11-20T13:45:00',
    updatedAt: '2025-11-25T11:10:00'
  },
  {
    id: 5,
    customer: { 
      name: '정하늘', 
      phone: '010-5678-9012', 
      email: 'jung@example.com', 
      type: 'Tenant',
      memo: '신혼부부, 맞벌이 가족'
    },
    listing: { 
      id: 5,
      title: '서초 빌라 2층', 
      type: '빌라', 
      address: '서울특별시 서초구 방배동 45-67',
      link: '/business/real-estate/listings/5'
    },
    type: '전세',
    contractDate: '2025-11-15',
    moveInDate: '2025-12-05',
    term: '2025-12-05 ~ 2026-12-04',
    salePrice: null,
    deposit: '150000000',
    monthlyRent: null,
    commission: '1500000',
    notes: '보증금 1.5억원, 가족 구성원 추가 입주 예정',
    activityHistory: [
      { id: 1, timestamp: '2025-11-15T10:00:00', actor: '홍길동', message: '계약 생성됨' },
      { id: 2, timestamp: '2025-11-16T14:20:00', actor: '정하늘', message: '보증금 입금 예정' }
    ],
    attachments: [],
    status: '진행중',
    createdBy: '홍길동',
    createdAt: '2025-11-15T10:00:00',
    updatedAt: '2025-11-16T14:20:00'
  },
];

// Function to get a contract by ID
export const getContractById = (id) => {
  const contract = contracts.find(c => c.id === parseInt(id));
  return contract || null;
};

// Function to create a new contract
export const createContract = (contractData) => {
  // In a real app, this would be an API call
  console.log('Creating contract with data:', contractData);
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContract = {
        id: contracts.length + 1,
        customerName: contractData.customerName,
        propertyName: contractData.propertyName || 'Property Name',
        type: contractData.contractType,
        price: contractData.salePrice || contractData.deposit || contractData.monthlyRent,
        contractDate: contractData.contractDate,
        status: contractData.contractStatus,
        ...contractData
      };
      
      // In a real app, you would update the contracts array or make an API call
      // For now, we'll just return the new contract
      resolve(newContract);
    }, 500);
  });
};

// Listings Data
export const listingTypes = ['원룸', '투룸', '아파트', '오피스텔', '빌라'];

export const transactionTypes = ['전체', '매매', '전세', '월세'];

export const listingStatuses = ['전체', '노출중', '비노출', '거래완료'];

export const listingRegions = ['서울 전체', '강남구', '송파구', '용산구', '마포구', '서초구'];

export const listings = [
  {
    id: 1,
    thumbnail: '',
    name: '강남 아파트 A동 101호',
    region: '서울특별시 강남구 역삼동',
    type: '아파트',
    transactionType: '매매',
    price: '3억원',
    status: '노출중',
    createdAt: '2025-12-01',
  },
  {
    id: 2,
    thumbnail: '',
    name: '송파 오피스텔 B동 502호',
    region: '서울특별시 송파구 잠실동',
    type: '오피스텔',
    transactionType: '전세',
    price: '보증금 2억원',
    status: '노출중',
    createdAt: '2025-11-28',
  },
  {
    id: 3,
    thumbnail: '',
    name: '용산 원룸 301호',
    region: '서울특별시 용산구 한남동',
    type: '원룸',
    transactionType: '월세',
    price: '보증금 5천만원 / 월 150만원',
    status: '비노출',
    createdAt: '2025-11-25',
  },
  {
    id: 4,
    thumbnail: '',
    name: '마포 아파트 C동 801호',
    region: '서울특별시 마포구 서교동',
    type: '아파트',
    transactionType: '매매',
    price: '4.5억원',
    status: '거래완료',
    createdAt: '2025-11-20',
  },
  {
    id: 5,
    thumbnail: '',
    name: '서초 빌라 2층',
    region: '서울특별시 서초구 방배동',
    type: '빌라',
    transactionType: '전세',
    price: '보증금 1.5억원',
    status: '노출중',
    createdAt: '2025-11-15',
  },
];

// Leads Data
export const leadStatuses = ['전체', '새 문의', '연락 완료', '예약 완료', '보류'];

export const leads = [
  {
    id: 1,
    createdAt: '2025-12-10',
    customerName: '김철수',
    phone: '010-****-1234',
    propertyName: '강남 아파트 A동 101호',
    inquiryType: '일반문의',
    status: '새 문의',
    memo: '가격 협의 가능 여부 문의',
  },
  {
    id: 2,
    createdAt: '2025-12-09',
    customerName: '이영희',
    phone: '010-****-5678',
    propertyName: '송파 오피스텔 B동 502호',
    inquiryType: '방문예약',
    status: '연락 완료',
    memo: '주말 방문 희망',
  },
  {
    id: 3,
    createdAt: '2025-12-08',
    customerName: '박민수',
    phone: '010-****-9012',
    propertyName: '용산 원룸 301호',
    inquiryType: '상담요청',
    status: '예약 완료',
    memo: '계약 관련 상담 요청',
  },
  {
    id: 4,
    createdAt: '2025-12-07',
    customerName: '최지은',
    phone: '010-****-3456',
    propertyName: '마포 아파트 C동 801호',
    inquiryType: '일반문의',
    status: '보류',
    memo: '다른 지역 관심 있음',
  },
  {
    id: 5,
    createdAt: '2025-12-06',
    customerName: '정하늘',
    phone: '010-****-7890',
    propertyName: '서초 빌라 2층',
    inquiryType: '방문예약',
    status: '새 문의',
    memo: '가까운 시간 방문 가능',
  },
];

// Analytics Data
export const monthlyRevenue = [
  { month: '7월', revenue: 35000000 },
  { month: '8월', revenue: 42000000 },
  { month: '9월', revenue: 38000000 },
  { month: '10월', revenue: 45000000 },
  { month: '11월', revenue: 52000000 },
  { month: '12월', revenue: 45678900 },
];

export const monthlyContracts = [
  { month: '7월', count: 12 },
  { month: '8월', count: 15 },
  { month: '9월', count: 14 },
  { month: '10월', count: 18 },
  { month: '11월', count: 21 },
  { month: '12월', count: 23 },
];

export const transactionTypeRatio = [
  { type: '매매', percentage: 40 },
  { type: '전세', percentage: 35 },
  { type: '월세', percentage: 25 },
];

export const topRegions = [
  { region: '강남구', count: 45 },
  { region: '송파구', count: 38 },
  { region: '용산구', count: 32 },
  { region: '마포구', count: 28 },
  { region: '서초구', count: 25 },
];

// Customers Data
export const customers = [
  {
    id: 1,
    name: '김철수',
    phone: '010-****-1234',
    lastActivity: '2025-12-10',
    totalContracts: 2,
    memo: 'VIP 고객',
  },
  {
    id: 2,
    name: '이영희',
    phone: '010-****-5678',
    lastActivity: '2025-12-09',
    totalContracts: 1,
    memo: '반복 문의 고객',
  },
  {
    id: 3,
    name: '박민수',
    phone: '010-****-9012',
    lastActivity: '2025-12-08',
    totalContracts: 3,
    memo: '계약 완료 고객',
  },
  {
    id: 4,
    name: '최지은',
    phone: '010-****-3456',
    lastActivity: '2025-12-07',
    totalContracts: 0,
    memo: '문의만 한 고객',
  },
  {
    id: 5,
    name: '정하늘',
    phone: '010-****-7890',
    lastActivity: '2025-12-06',
    totalContracts: 1,
    memo: '상담 진행 중',
  },
];

// Settings Data
export const officeInfo = {
  businessName: '강남부동산중개사무소',
  representative: '홍길동',
  registrationNumber: '123-45-67890',
  businessRegistrationNumber: '123-45-67890',
  address: '서울특별시 강남구 테헤란로 123',
  contact: '02-1234-5678',
};

export const accountInfo = {
  managerName: '김부장',
  email: 'manager@realestate.com',
};