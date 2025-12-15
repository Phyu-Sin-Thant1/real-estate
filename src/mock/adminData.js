// Mock data for Admin Dashboard

export const partners = [
  {
    id: 1,
    type: 'REAL_ESTATE',
    companyName: '서울부동산 중개소',
    ownerName: '김철수',
    email: 'kim@seoul-re.com',
    phone: '010-1234-5678',
    status: 'ACTIVE',
    createdAt: '2025-10-15'
  },
  {
    id: 2,
    type: 'DELIVERY',
    companyName: '빠른이사 서비스',
    ownerName: '이영희',
    email: 'lee@quick-move.com',
    phone: '010-2345-6789',
    status: 'PENDING',
    createdAt: '2025-11-20'
  },
  {
    id: 3,
    type: 'REAL_ESTATE',
    companyName: '부산 프로퍼티',
    ownerName: '박민수',
    email: 'park@busan-prop.com',
    phone: '010-3456-7890',
    status: 'ACTIVE',
    createdAt: '2025-09-05'
  },
  {
    id: 4,
    type: 'DELIVERY',
    companyName: '안전한짐 운송',
    ownerName: '최지은',
    email: 'choi@safemove.com',
    phone: '010-4567-8901',
    status: 'SUSPENDED',
    createdAt: '2025-08-12'
  },
  {
    id: 5,
    type: 'REAL_ESTATE',
    companyName: '광주 하우징',
    ownerName: '정하늘',
    email: 'jung@gwangju-housing.com',
    phone: '010-5678-9012',
    status: 'ACTIVE',
    createdAt: '2025-12-01'
  }
];

export const users = [
  {
    id: 101,
    name: '홍길동',
    email: 'hong@example.com',
    role: 'USER',
    status: 'ACTIVE',
    lastLoginAt: '2025-12-15 09:30:00'
  },
  {
    id: 102,
    name: '김미영',
    email: 'kim@business.com',
    role: 'BUSINESS_REAL_ESTATE',
    status: 'ACTIVE',
    lastLoginAt: '2025-12-15 10:15:00'
  },
  {
    id: 103,
    name: '이성호',
    email: 'lee@delivery.com',
    role: 'BUSINESS_DELIVERY',
    status: 'INACTIVE',
    lastLoginAt: '2025-12-14 16:45:00'
  },
  {
    id: 104,
    name: '박지현',
    email: 'park@admin.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2025-12-15 11:20:00'
  },
  {
    id: 105,
    name: '최민준',
    email: 'choi@example.com',
    role: 'USER',
    status: 'ACTIVE',
    lastLoginAt: '2025-12-15 08:50:00'
  }
];

export const moderationListings = [
  {
    id: 1001,
    title: '강남 고급 아파트',
    location: '서울특별시 강남구',
    price: '₩1,200,000,000',
    status: 'PENDING_REVIEW',
    reportedCount: 3
  },
  {
    id: 1002,
    title: '신촌 원룸',
    location: '서울특별시 서대문구',
    price: '₩350,000,000',
    status: 'LIVE',
    reportedCount: 0
  },
  {
    id: 1003,
    title: '부산 해운대 빌라',
    location: '부산광역시 해운대구',
    price: '₩800,000,000',
    status: 'HIDDEN',
    reportedCount: 5
  },
  {
    id: 1004,
    title: '제주도 펜션',
    location: '제주특별자치도 제주시',
    price: '₩2,500,000 / 월',
    status: 'LIVE',
    reportedCount: 1
  },
  {
    id: 1005,
    title: '광화문 오피스텔',
    location: '서울특별시 종로구',
    price: '₩700,000,000',
    status: 'PENDING_REVIEW',
    reportedCount: 2
  }
];

export const deliveryOrders = [
  {
    id: 2001,
    orderNo: 'MOVE-20251215-001',
    customerName: '김철수',
    pickup: '서울특별시 강남구 역삼동',
    dropoff: '서울특별시 서초구 방배동',
    status: 'REQUESTED',
    driverName: '',
    driverPhone: '',
    createdAt: '2025-12-15 10:30:00'
  },
  {
    id: 2002,
    orderNo: 'MOVE-20251215-002',
    customerName: '이영희',
    pickup: '서울특별시 마포구 서교동',
    dropoff: '서울특별시 용산구 한남동',
    status: 'ASSIGNED',
    driverName: '박운전',
    driverPhone: '010-1111-2222',
    createdAt: '2025-12-15 09:15:00'
  },
  {
    id: 2003,
    orderNo: 'MOVE-20251214-005',
    customerName: '박민수',
    pickup: '서울특별시 송파구 잠실동',
    dropoff: '서울특별시 강동구 명일동',
    status: 'COMPLETED',
    driverName: '최기사',
    driverPhone: '010-3333-4444',
    createdAt: '2025-12-14 14:20:00'
  },
  {
    id: 2004,
    orderNo: 'MOVE-20251214-003',
    customerName: '최지은',
    pickup: '서울특별시 종로구 인사동',
    dropoff: '서울특별시 중구 을지로',
    status: 'IN_PROGRESS',
    driverName: '정운송',
    driverPhone: '010-5555-6666',
    createdAt: '2025-12-14 11:45:00'
  },
  {
    id: 2005,
    orderNo: 'MOVE-20251213-007',
    customerName: '정하늘',
    pickup: '서울특별시 성동구 성수동',
    dropoff: '서울특별시 광진구 구의동',
    status: 'CANCELLED',
    driverName: '',
    driverPhone: '',
    createdAt: '2025-12-13 16:30:00'
  }
];

export const adminKpis = {
  totalUsers: 12480,
  totalPartners: 312,
  activeListings: 8420,
  todayOrders: 37
};

// New mock data

export const approvalsQueue = [
  {
    id: 3001,
    type: 'PARTNER_REGISTRATION',
    requester: '서울부동산 중개소',
    requesterType: 'REAL_ESTATE',
    requestedAt: '2025-12-15 09:15:00',
    status: 'PENDING'
  },
  {
    id: 3002,
    type: 'LISTING_SUBMISSION',
    requester: '김철수',
    requesterType: 'USER',
    requestedAt: '2025-12-15 10:30:00',
    status: 'PENDING'
  },
  {
    id: 3003,
    type: 'CONTENT_REVIEW',
    requester: '뉴스 편집팀',
    requesterType: 'ADMIN',
    requestedAt: '2025-12-15 11:45:00',
    status: 'APPROVED'
  },
  {
    id: 3004,
    type: 'USER_REPORT',
    requester: '이영희',
    requesterType: 'USER',
    requestedAt: '2025-12-15 12:20:00',
    status: 'PENDING'
  },
  {
    id: 3005,
    type: 'PARTNER_UPDATE',
    requester: '빠른이사 서비스',
    requesterType: 'DELIVERY',
    requestedAt: '2025-12-15 13:10:00',
    status: 'REJECTED'
  }
];

export const settlements = [
  {
    id: 4001,
    partner: '서울부동산 중개소',
    period: '2025-12-01 ~ 2025-12-15',
    amount: '₩2,500,000',
    transactions: 42,
    status: 'PAID',
    paidAt: '2025-12-16'
  },
  {
    id: 4002,
    partner: '빠른이사 서비스',
    period: '2025-12-01 ~ 2025-12-15',
    amount: '₩1,800,000',
    transactions: 28,
    status: 'PENDING',
    paidAt: null
  },
  {
    id: 4003,
    partner: '부산 프로퍼티',
    period: '2025-12-01 ~ 2025-12-15',
    amount: '₩3,200,000',
    transactions: 35,
    status: 'PROCESSING',
    paidAt: null
  },
  {
    id: 4004,
    partner: '안전한짐 운송',
    period: '2025-12-01 ~ 2025-12-15',
    amount: '₩1,200,000',
    transactions: 19,
    status: 'FAILED',
    paidAt: null
  }
];

export const commissionRules = [
  {
    id: 5001,
    name: '부동산 기본 수수료',
    type: 'REAL_ESTATE',
    rate: '3.0%',
    minAmount: '₩500,000',
    maxAmount: '₩2,000,000',
    status: 'ACTIVE'
  },
  {
    id: 5002,
    name: '이사 기본 수수료',
    type: 'DELIVERY',
    rate: '5.0%',
    minAmount: '₩100,000',
    maxAmount: '₩500,000',
    status: 'ACTIVE'
  },
  {
    id: 5003,
    name: '프리미엄 부동산 수수료',
    type: 'REAL_ESTATE',
    rate: '2.5%',
    minAmount: '₩1,000,000',
    maxAmount: '₩5,000,000',
    status: 'INACTIVE'
  },
  {
    id: 5004,
    name: '대형 이사 특별 수수료',
    type: 'DELIVERY',
    rate: '4.5%',
    minAmount: '₩500,000',
    maxAmount: '₩2,000,000',
    status: 'ACTIVE'
  }
];

export const supportTickets = [
  {
    id: 6001,
    subject: '로그인 문제',
    requester: '홍길동',
    priority: 'HIGH',
    status: 'OPEN',
    assignedTo: '김지원',
    createdAt: '2025-12-15 09:30:00'
  },
  {
    id: 6002,
    subject: '결제 오류',
    requester: '김미영',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedTo: '이지원',
    createdAt: '2025-12-15 10:15:00'
  },
  {
    id: 6003,
    subject: '매물 등록 문의',
    requester: '박민수',
    priority: 'LOW',
    status: 'RESOLVED',
    assignedTo: '최지원',
    createdAt: '2025-12-15 11:20:00'
  },
  {
    id: 6004,
    subject: '앱 크래시 문제',
    requester: '최지은',
    priority: 'CRITICAL',
    status: 'OPEN',
    assignedTo: '',
    createdAt: '2025-12-15 12:45:00'
  }
];

export const analyticsSummary = {
  userGrowth: [
    { month: 'Jul', users: 8420 },
    { month: 'Aug', users: 9120 },
    { month: 'Sep', users: 10340 },
    { month: 'Oct', users: 11280 },
    { month: 'Nov', users: 11960 },
    { month: 'Dec', users: 12480 }
  ],
  revenue: [
    { month: 'Jul', amount: 42000000 },
    { month: 'Aug', amount: 48500000 },
    { month: 'Sep', amount: 53200000 },
    { month: 'Oct', amount: 58700000 },
    { month: 'Nov', amount: 61200000 },
    { month: 'Dec', amount: 64500000 }
  ],
  listings: [
    { month: 'Jul', count: 6840 },
    { month: 'Aug', count: 7210 },
    { month: 'Sep', count: 7650 },
    { month: 'Oct', count: 8020 },
    { month: 'Nov', count: 8240 },
    { month: 'Dec', count: 8420 }
  ]
};

export const notificationsHistory = [
  {
    id: 7001,
    title: '시스템 점검 안내',
    content: '2025년 12월 16일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다.',
    type: 'SYSTEM',
    recipients: 'ALL_USERS',
    sentAt: '2025-12-15 14:30:00',
    status: 'SENT'
  },
  {
    id: 7002,
    title: '새로운 기능 추가',
    content: '이사 서비스에 실시간 위치 추적 기능이 추가되었습니다.',
    type: 'FEATURE',
    recipients: 'DELIVERY_PARTNERS',
    sentAt: '2025-12-15 11:15:00',
    status: 'SENT'
  },
  {
    id: 7003,
    title: '정책 변경 안내',
    content: '부동산 중개 수수료 관련 정책이 변경되었습니다.',
    type: 'POLICY',
    recipients: 'REAL_ESTATE_PARTNERS',
    sentAt: '2025-12-15 09:45:00',
    status: 'SENT'
  },
  {
    id: 7004,
    title: '보안 업데이트',
    content: '보안 패치가 적용되었습니다. 재로그인을 권장합니다.',
    type: 'SECURITY',
    recipients: 'ALL_USERS',
    sentAt: '2025-12-14 16:20:00',
    status: 'SENT'
  }
];

export const rolesPermissions = [
  {
    id: 8001,
    roleName: 'ADMIN',
    description: '시스템 관리자',
    permissions: ['FULL_ACCESS', 'USER_MANAGEMENT', 'PARTNER_MANAGEMENT', 'CONTENT_MANAGEMENT'],
    userCount: 3
  },
  {
    id: 8002,
    roleName: 'EDITOR',
    description: '콘텐츠 편집자',
    permissions: ['CONTENT_MANAGEMENT', 'NEWS_PUBLISH'],
    userCount: 5
  },
  {
    id: 8003,
    roleName: 'PARTNER_MANAGER',
    description: '파트너 관리자',
    permissions: ['PARTNER_MANAGEMENT', 'APPROVALS', 'SETTLEMENTS'],
    userCount: 2
  },
  {
    id: 8004,
    roleName: 'SUPPORT_AGENT',
    description: '고객 지원 담당',
    permissions: ['SUPPORT_TICKETS', 'USER_COMMUNICATION'],
    userCount: 8
  }
];

export const auditLogs = [
  {
    id: 9001,
    user: '박지현',
    action: 'USER_ROLE_CHANGED',
    target: '김미영',
    details: 'Role changed from BUSINESS_REAL_ESTATE to ADMIN',
    timestamp: '2025-12-15 14:20:00',
    ip: '192.168.1.100'
  },
  {
    id: 9002,
    user: '박지현',
    action: 'PARTNER_APPROVED',
    target: '서울부동산 중개소',
    details: 'Approved partner registration',
    timestamp: '2025-12-15 13:45:00',
    ip: '192.168.1.100'
  },
  {
    id: 9003,
    user: '이성호',
    action: 'LOGIN',
    target: 'Self',
    details: 'Successful login',
    timestamp: '2025-12-15 12:30:00',
    ip: '203.0.113.5'
  },
  {
    id: 9004,
    user: '홍길동',
    action: 'PROPERTY_LISTED',
    target: '강남 고급 아파트',
    details: 'New property listing created',
    timestamp: '2025-12-15 11:15:00',
    ip: '198.51.100.22'
  }
];

export const systemStatus = {
  api: { status: 'OPERATIONAL', responseTime: '42ms' },
  database: { status: 'OPERATIONAL', responseTime: '18ms' },
  cache: { status: 'OPERATIONAL', responseTime: '5ms' },
  queue: { status: 'OPERATIONAL', pendingJobs: 0 },
  storage: { status: 'OPERATIONAL', usage: '65%' },
  lastUpdated: '2025-12-15 14:45:00'
};