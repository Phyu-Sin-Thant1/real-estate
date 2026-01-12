// Mock support tickets data for Admin Dashboard
// This will be replaced with API calls when backend is ready

const now = new Date();
const getDateOffset = (days, hours = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

export const mockSupportTickets = [
  {
    id: 'TICKET-001',
    userId: 'user-1',
    userName: '김철수',
    userEmail: 'kim@example.com',
    domain: 'DELIVERY',
    serviceContext: 'DELIVERY',
    category: 'DELAY',
    isComplaint: true,
    referenceType: 'ORDER',
    referenceId: 'MOVE-1001',
    message: '주문한 배송이 예정 시간보다 3시간 늦게 도착했습니다. 배송 기사가 연락도 안 되고 있어서 매우 불편했습니다. 다음에는 이런 일이 없도록 해주세요.',
    attachments: [
      { url: '#', name: 'screenshot1.png', type: 'image/png' }
    ],
    status: 'OPEN',
    priority: 'HIGH',
    assigneeId: null,
    assigneeName: null,
    createdAt: getDateOffset(2, 3),
    updatedAt: getDateOffset(2, 3)
  },
  {
    id: 'TICKET-002',
    userId: 'user-2',
    userName: '이영희',
    userEmail: 'lee@example.com',
    domain: 'REAL_ESTATE',
    category: 'LISTING_MISMATCH',
    isComplaint: true,
    referenceType: 'PROPERTY',
    referenceId: 'LIST-301',
    message: '매물 정보가 실제와 다릅니다. 사진에서는 2층이라고 나와있는데 실제로는 3층이고, 방 개수도 다릅니다. 이렇게 잘못된 정보로 시간을 낭비하게 되어 매우 화가 납니다.',
    attachments: [],
    status: 'IN_PROGRESS',
    priority: 'NORMAL',
    assigneeId: 'admin-1',
    assigneeName: '김지원',
    createdAt: getDateOffset(5, 2),
    updatedAt: getDateOffset(1, 5)
  },
  {
    id: 'TICKET-003',
    userId: 'user-3',
    userName: '박민수',
    userEmail: 'park@example.com',
    domain: 'DELIVERY',
    serviceContext: 'MOVING',
    category: 'DAMAGED_ITEM',
    isComplaint: true,
    referenceType: 'ORDER',
    referenceId: 'MOVE-1002',
    message: '이사 중에 가구가 손상되었습니다. 책상 모서리가 깨졌고, 냉장고 문도 찌그러졌습니다. 보상이 필요합니다.',
    attachments: [
      { url: '#', name: 'damage1.jpg', type: 'image/jpeg' },
      { url: '#', name: 'damage2.jpg', type: 'image/jpeg' }
    ],
    status: 'WAITING_USER',
    priority: 'URGENT',
    assigneeId: 'admin-2',
    assigneeName: '이지원',
    createdAt: getDateOffset(1, 8),
    updatedAt: getDateOffset(0, 2)
  },
  {
    id: 'TICKET-004',
    userId: 'user-4',
    userName: '최지은',
    userEmail: 'choi@example.com',
    domain: 'PAYMENT',
    category: 'CHARGED_BUT_FAILED',
    isComplaint: true,
    referenceType: 'PAYMENT',
    referenceId: 'PAY-12345',
    message: '결제는 되었는데 서비스가 제공되지 않았습니다. 환불 요청합니다.',
    attachments: [],
    status: 'OPEN',
    priority: 'HIGH',
    assigneeId: null,
    assigneeName: null,
    createdAt: getDateOffset(0, 5),
    updatedAt: getDateOffset(0, 5)
  },
  {
    id: 'TICKET-005',
    userId: 'user-5',
    userName: '정하늘',
    userEmail: 'jung@example.com',
    domain: 'ACCOUNT',
    category: 'LOGIN_ISSUE',
    isComplaint: false,
    referenceType: null,
    referenceId: null,
    message: '로그인이 안 됩니다. 비밀번호를 재설정했는데도 계속 오류가 발생합니다.',
    attachments: [],
    status: 'IN_PROGRESS',
    priority: 'NORMAL',
    assigneeId: 'admin-1',
    assigneeName: '김지원',
    createdAt: getDateOffset(3, 1),
    updatedAt: getDateOffset(2, 3)
  },
  {
    id: 'TICKET-006',
    userId: 'user-6',
    userName: '한바다',
    userEmail: 'han@example.com',
    domain: 'REAL_ESTATE',
    category: 'AGENT_BEHAVIOR',
    isComplaint: true,
    referenceType: 'PROPERTY',
    referenceId: 'LIST-302',
    message: '중개사가 약속 시간에 늦었고, 매물 설명도 제대로 안 해줬습니다. 태도도 불친절했습니다.',
    attachments: [],
    status: 'RESOLVED',
    priority: 'NORMAL',
    assigneeId: 'admin-2',
    assigneeName: '이지원',
    createdAt: getDateOffset(10, 4),
    updatedAt: getDateOffset(8, 2)
  },
  {
    id: 'TICKET-007',
    userId: 'user-7',
    userName: '오솔지',
    userEmail: 'oh@example.com',
    domain: 'DELIVERY',
    serviceContext: 'DELIVERY',
    category: 'PRICING_QUESTION',
    isComplaint: false,
    referenceType: null,
    referenceId: null,
    message: '배송 비용이 어떻게 계산되는지 궁금합니다. 거리에 따라 다른가요?',
    attachments: [],
    status: 'RESOLVED',
    priority: 'LOW',
    assigneeId: 'admin-1',
    assigneeName: '김지원',
    createdAt: getDateOffset(7, 6),
    updatedAt: getDateOffset(6, 8)
  },
  {
    id: 'TICKET-008',
    userId: 'user-8',
    userName: '윤샛별',
    userEmail: 'yoon@example.com',
    domain: 'BUG_REPORT',
    category: 'UI_BROKEN',
    isComplaint: false,
    referenceType: null,
    referenceId: null,
    message: '모바일 앱에서 매물 상세 페이지가 깨져서 보입니다. 이미지가 로드되지 않습니다.',
    attachments: [
      { url: '#', name: 'bug_screenshot.png', type: 'image/png' }
    ],
    status: 'OPEN',
    priority: 'NORMAL',
    assigneeId: null,
    assigneeName: null,
    createdAt: getDateOffset(0, 12),
    updatedAt: getDateOffset(0, 12)
  },
  {
    id: 'TICKET-009',
    userId: 'user-9',
    userName: '강민호',
    userEmail: 'kang@example.com',
    domain: 'PAYMENT',
    category: 'REFUND_REQUEST',
    isComplaint: true,
    referenceType: 'PAYMENT',
    referenceId: 'PAY-67890',
    message: '서비스를 취소했는데 환불이 아직 안 들어왔습니다. 언제 환불되는지 알려주세요.',
    attachments: [],
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assigneeId: 'admin-2',
    assigneeName: '이지원',
    createdAt: getDateOffset(4, 7),
    updatedAt: getDateOffset(3, 2)
  },
  {
    id: 'TICKET-010',
    userId: 'user-10',
    userName: '서지훈',
    userEmail: 'seo@example.com',
    domain: 'ETC',
    category: 'GENERAL',
    isComplaint: false,
    referenceType: null,
    referenceId: null,
    message: '일반적인 문의사항이 있습니다. 플랫폼 사용 방법에 대해 더 자세한 안내를 받고 싶습니다.',
    attachments: [],
    status: 'OPEN',
    priority: 'LOW',
    assigneeId: null,
    assigneeName: null,
    createdAt: getDateOffset(1, 15),
    updatedAt: getDateOffset(1, 15)
  },
  {
    id: 'TICKET-011',
    userId: 'user-11',
    userName: '임수진',
    userEmail: 'lim@example.com',
    domain: 'DELIVERY',
    serviceContext: 'MOVING',
    category: 'DRIVER_OR_STAFF_BEHAVIOR',
    isComplaint: true,
    referenceType: 'ORDER',
    referenceId: 'MOVE-1003',
    message: '이사 기사가 물건을 너무 거칠게 다뤘습니다. 소중한 물건이 깨질까봐 걱정이 됩니다.',
    attachments: [],
    status: 'OPEN',
    priority: 'NORMAL',
    assigneeId: null,
    assigneeName: null,
    createdAt: getDateOffset(0, 8),
    updatedAt: getDateOffset(0, 8)
  },
  {
    id: 'TICKET-012',
    userId: 'user-12',
    userName: '배현우',
    userEmail: 'bae@example.com',
    domain: 'REAL_ESTATE',
    category: 'BOOKING_ISSUE',
    isComplaint: true,
    referenceType: 'CONTRACT',
    referenceId: 'CONTRACT-001',
    message: '예약한 방문 시간에 매물을 볼 수 없었습니다. 중개사가 다른 약속이 있다고 취소했습니다.',
    attachments: [],
    status: 'WAITING_USER',
    priority: 'NORMAL',
    assigneeId: 'admin-1',
    assigneeName: '김지원',
    createdAt: getDateOffset(6, 3),
    updatedAt: getDateOffset(5, 10)
  }
];

export const mockTicketMessages = {
  'TICKET-002': [
    {
      id: 'msg-1',
      ticketId: 'TICKET-002',
      authorType: 'ADMIN',
      authorName: '김지원',
      body: '안녕하세요. 매물 정보 불일치에 대해 죄송합니다. 확인 후 정확한 정보로 수정하겠습니다.',
      attachments: [],
      createdAt: getDateOffset(4, 2),
      isInternal: false
    },
    {
      id: 'msg-2',
      ticketId: 'TICKET-002',
      authorType: 'ADMIN',
      authorName: '김지원',
      body: '파트너에게 확인 요청했습니다. 답변 대기 중입니다.',
      attachments: [],
      createdAt: getDateOffset(3, 5),
      isInternal: true
    }
  ],
  'TICKET-003': [
    {
      id: 'msg-3',
      ticketId: 'TICKET-003',
      authorType: 'ADMIN',
      authorName: '이지원',
      body: '손상된 물품에 대해 깊이 사과드립니다. 보상 절차를 진행하겠습니다. 손상된 물품의 사진을 추가로 보내주실 수 있나요?',
      attachments: [],
      createdAt: getDateOffset(1, 6),
      isInternal: false
    },
    {
      id: 'msg-4',
      ticketId: 'TICKET-003',
      authorType: 'USER',
      authorName: '박민수',
      body: '네, 추가 사진 보내드리겠습니다. 보상은 언제까지 받을 수 있나요?',
      attachments: [],
      createdAt: getDateOffset(0, 18),
      isInternal: false
    }
  ],
  'TICKET-006': [
    {
      id: 'msg-5',
      ticketId: 'TICKET-006',
      authorType: 'ADMIN',
      authorName: '이지원',
      body: '중개사에게 교육을 실시하고 재발 방지 조치를 취하겠습니다. 불편을 드려 죄송합니다.',
      attachments: [],
      createdAt: getDateOffset(9, 3),
      isInternal: false
    }
  ]
};


