// Mock data for Delivery Partner Customer Management

// Customers Data
export const customers = [
  {
    id: 1,
    name: '김철수',
    phone: '010-1234-5678',
    address: '서울특별시 강남구 역삼동 123-45',
    detailAddress: '푸르지오 아파트 101동 501호',
    tag: 'VIP',
    memo: '단골 고객, 항상 빠른 배송 요청',
    totalOrders: 24,
    totalPayment: 450000,
    lastOrderDate: '2025-12-10'
  },
  {
    id: 2,
    name: '이영희',
    phone: '010-2345-6789',
    address: '서울특별시 서초구 방배동 67-89',
    detailAddress: '현대 아파트 202동 1201호',
    tag: '일반',
    memo: '요청사항이 자세하고 까다로움',
    totalOrders: 12,
    totalPayment: 280000,
    lastOrderDate: '2025-12-08'
  },
  {
    id: 3,
    name: '박민수',
    phone: '010-3456-7890',
    address: '서울특별시 송파구 잠실동 56-78',
    detailAddress: '롯데 캐슬 303동 802호',
    tag: '블랙리스트',
    memo: '불만족 표현이 심하고 반복적인 클레임',
    totalOrders: 8,
    totalPayment: 150000,
    lastOrderDate: '2025-11-25'
  },
  {
    id: 4,
    name: '최지은',
    phone: '010-4567-8901',
    address: '서울특별시 종로구 인사동 12-34',
    detailAddress: '한옥주택 2층',
    tag: 'VIP',
    memo: '고가 상품 주문 많음, 패키징에 민감',
    totalOrders: 18,
    totalPayment: 620000,
    lastOrderDate: '2025-12-09'
  },
  {
    id: 5,
    name: '정하늘',
    phone: '010-5678-9012',
    address: '서울특별시 성동구 성수동 34-56',
    detailAddress: '성수 카페 거리 근처',
    tag: '일반',
    memo: '배송 시간을 매우 중요하게 여김',
    totalOrders: 15,
    totalPayment: 320000,
    lastOrderDate: '2025-12-07'
  },
  {
    id: 6,
    name: '한바다',
    phone: '010-6789-0123',
    address: '서울특별시 동작구 흑석동 56-78',
    detailAddress: '흑석 한강 뷰 아파트 401동 1502호',
    tag: '일반',
    memo: '친절하고 항상 감사 인사 남김',
    totalOrders: 9,
    totalPayment: 180000,
    lastOrderDate: '2025-12-05'
  },
  {
    id: 7,
    name: '오솔지',
    phone: '010-7890-1234',
    address: '서울특별시 은평구 갈현동 78-90',
    detailAddress: '새롬 아파트 105동 304호',
    tag: '블랙리스트',
    memo: '무단 반품 요청과 과도한 할인 요구',
    totalOrders: 5,
    totalPayment: 95000,
    lastOrderDate: '2025-11-15'
  },
  {
    id: 8,
    name: '윤샛별',
    phone: '010-8901-2345',
    address: '서울특별시 양천구 목동 90-12',
    detailAddress: '목동 하이츠 201동 901호',
    tag: 'VIP',
    memo: '정기 배송 고객, 매월 고정 주문',
    totalOrders: 32,
    totalPayment: 780000,
    lastOrderDate: '2025-12-08'
  },
  {
    id: 9,
    name: '임하루',
    phone: '010-9012-3456',
    address: '서울특별시 강서구 화곡동 34-56',
    detailAddress: '화곡 제일 빌라 302호',
    tag: '일반',
    memo: '주문 전 항상 여러 번 확인 요청',
    totalOrders: 7,
    totalPayment: 140000,
    lastOrderDate: '2025-12-03'
  },
  {
    id: 10,
    name: '서해린',
    phone: '010-0123-4567',
    address: '서울특별시 구로구 구로동 78-90',
    detailAddress: '디지털 뱅크 아이타워 1501호',
    tag: 'VIP',
    memo: 'B2B 고객, 대량 주문 위주',
    totalOrders: 42,
    totalPayment: 1200000,
    lastOrderDate: '2025-12-10'
  },
  {
    id: 11,
    name: '남가람',
    phone: '010-1234-5679',
    address: '서울특별시 영등포구 여의도동 12-35',
    detailAddress: '여의도 샛별 빌딩 801호',
    tag: '일반',
    memo: '주말 배송만 요청, 평일은 받지 않음',
    totalOrders: 11,
    totalPayment: 250000,
    lastOrderDate: '2025-12-02'
  },
  {
    id: 12,
    name: '도빛나',
    phone: '010-2345-6780',
    address: '서울특별시 마포구 서교동 34-57',
    detailAddress: '프라다 부티크 근처 빌라',
    tag: '일반',
    memo: '특정 시간대에만 받을 수 있음',
    totalOrders: 6,
    totalPayment: 120000,
    lastOrderDate: '2025-11-28'
  }
];

// Customer Orders Map
export const customerOrders = {
  1: [
    {
      id: 'ORD-20251210-001',
      date: '2025-12-10',
      status: '배송 완료',
      amount: 25000
    },
    {
      id: 'ORD-20251205-002',
      date: '2025-12-05',
      status: '배송 완료',
      amount: 18000
    },
    {
      id: 'ORD-20251128-003',
      date: '2025-11-28',
      status: '배송 완료',
      amount: 32000
    },
    {
      id: 'ORD-20251120-004',
      date: '2025-11-20',
      status: '배송 완료',
      amount: 22000
    },
    {
      id: 'ORD-20251112-005',
      date: '2025-11-12',
      status: '배송 완료',
      amount: 28000
    }
  ],
  2: [
    {
      id: 'ORD-20251208-006',
      date: '2025-12-08',
      status: '배송 완료',
      amount: 15000
    },
    {
      id: 'ORD-20251201-007',
      date: '2025-12-01',
      status: '배송 완료',
      amount: 20000
    },
    {
      id: 'ORD-20251124-008',
      date: '2025-11-24',
      status: '배송 완료',
      amount: 17000
    },
    {
      id: 'ORD-20251117-009',
      date: '2025-11-17',
      status: '배송 완료',
      amount: 19000
    },
    {
      id: 'ORD-20251110-010',
      date: '2025-11-10',
      status: '배송 완료',
      amount: 16000
    }
  ],
  3: [
    {
      id: 'ORD-20251125-011',
      date: '2025-11-25',
      status: '배송 완료',
      amount: 12000
    },
    {
      id: 'ORD-20251118-012',
      date: '2025-11-18',
      status: '배송 완료',
      amount: 14000
    },
    {
      id: 'ORD-20251110-013',
      date: '2025-11-10',
      status: '배송 완료',
      amount: 13000
    },
    {
      id: 'ORD-20251103-014',
      date: '2025-11-03',
      status: '배송 완료',
      amount: 15000
    },
    {
      id: 'ORD-20251027-015',
      date: '2025-10-27',
      status: '배송 완료',
      amount: 11000
    }
  ],
  4: [
    {
      id: 'ORD-20251209-016',
      date: '2025-12-09',
      status: '배송 완료',
      amount: 45000
    },
    {
      id: 'ORD-20251202-017',
      date: '2025-12-02',
      status: '배송 완료',
      amount: 38000
    },
    {
      id: 'ORD-20251125-018',
      date: '2025-11-25',
      status: '배송 완료',
      amount: 42000
    },
    {
      id: 'ORD-20251118-019',
      date: '2025-11-18',
      status: '배송 완료',
      amount: 39000
    },
    {
      id: 'ORD-20251111-020',
      date: '2025-11-11',
      status: '배송 완료',
      amount: 41000
    }
  ],
  5: [
    {
      id: 'ORD-20251207-021',
      date: '2025-12-07',
      status: '배송 완료',
      amount: 22000
    },
    {
      id: 'ORD-20251130-022',
      date: '2025-11-30',
      status: '배송 완료',
      amount: 20000
    },
    {
      id: 'ORD-20251123-023',
      date: '2025-11-23',
      status: '배송 완료',
      amount: 24000
    },
    {
      id: 'ORD-20251116-024',
      date: '2025-11-16',
      status: '배송 완료',
      amount: 21000
    },
    {
      id: 'ORD-20251109-025',
      date: '2025-11-09',
      status: '배송 완료',
      amount: 19000
    }
  ],
  6: [
    {
      id: 'ORD-20251205-026',
      date: '2025-12-05',
      status: '배송 완료',
      amount: 15000
    },
    {
      id: 'ORD-20251128-027',
      date: '2025-11-28',
      status: '배송 완료',
      amount: 16000
    },
    {
      id: 'ORD-20251121-028',
      date: '2025-11-21',
      status: '배송 완료',
      amount: 14000
    },
    {
      id: 'ORD-20251114-029',
      date: '2025-11-14',
      status: '배송 완료',
      amount: 17000
    },
    {
      id: 'ORD-20251107-030',
      date: '2025-11-07',
      status: '배송 완료',
      amount: 13000
    }
  ],
  7: [
    {
      id: 'ORD-20251115-031',
      date: '2025-11-15',
      status: '배송 완료',
      amount: 10000
    },
    {
      id: 'ORD-20251108-032',
      date: '2025-11-08',
      status: '배송 완료',
      amount: 12000
    },
    {
      id: 'ORD-20251101-033',
      date: '2025-11-01',
      status: '배송 완료',
      amount: 11000
    },
    {
      id: 'ORD-20251025-034',
      date: '2025-10-25',
      status: '배송 완료',
      amount: 9000
    },
    {
      id: 'ORD-20251018-035',
      date: '2025-10-18',
      status: '배송 완료',
      amount: 10500
    }
  ],
  8: [
    {
      id: 'ORD-20251208-036',
      date: '2025-12-08',
      status: '배송 완료',
      amount: 35000
    },
    {
      id: 'ORD-20251201-037',
      date: '2025-12-01',
      status: '배송 완료',
      amount: 32000
    },
    {
      id: 'ORD-20251124-038',
      date: '2025-11-24',
      status: '배송 완료',
      amount: 34000
    },
    {
      id: 'ORD-20251117-039',
      date: '2025-11-17',
      status: '배송 완료',
      amount: 31000
    },
    {
      id: 'ORD-20251110-040',
      date: '2025-11-10',
      status: '배송 완료',
      amount: 33000
    }
  ],
  9: [
    {
      id: 'ORD-20251203-041',
      date: '2025-12-03',
      status: '배송 완료',
      amount: 14000
    },
    {
      id: 'ORD-20251126-042',
      date: '2025-11-26',
      status: '배송 완료',
      amount: 13000
    },
    {
      id: 'ORD-20251119-043',
      date: '2025-11-19',
      status: '배송 완료',
      amount: 15000
    },
    {
      id: 'ORD-20251112-044',
      date: '2025-11-12',
      status: '배송 완료',
      amount: 12000
    },
    {
      id: 'ORD-20251105-045',
      date: '2025-11-05',
      status: '배송 완료',
      amount: 11000
    }
  ],
  10: [
    {
      id: 'ORD-20251210-046',
      date: '2025-12-10',
      status: '배송 완료',
      amount: 65000
    },
    {
      id: 'ORD-20251203-047',
      date: '2025-12-03',
      status: '배송 완료',
      amount: 62000
    },
    {
      id: 'ORD-20251126-048',
      date: '2025-11-26',
      status: '배송 완료',
      amount: 64000
    },
    {
      id: 'ORD-20251119-049',
      date: '2025-11-19',
      status: '배송 완료',
      amount: 61000
    },
    {
      id: 'ORD-20251112-050',
      date: '2025-11-12',
      status: '배송 완료',
      amount: 63000
    }
  ],
  11: [
    {
      id: 'ORD-20251202-051',
      date: '2025-12-02',
      status: '배송 완료',
      amount: 18000
    },
    {
      id: 'ORD-20251125-052',
      date: '2025-11-25',
      status: '배송 완료',
      amount: 17000
    },
    {
      id: 'ORD-20251118-053',
      date: '2025-11-18',
      status: '배송 완료',
      amount: 19000
    },
    {
      id: 'ORD-20251111-054',
      date: '2025-11-11',
      status: '배송 완료',
      amount: 16000
    },
    {
      id: 'ORD-20251104-055',
      date: '2025-11-04',
      status: '배송 완료',
      amount: 15000
    }
  ],
  12: [
    {
      id: 'ORD-20251128-056',
      date: '2025-11-28',
      status: '배송 완료',
      amount: 12000
    },
    {
      id: 'ORD-20251121-057',
      date: '2025-11-21',
      status: '배송 완료',
      amount: 13000
    },
    {
      id: 'ORD-20251114-058',
      date: '2025-11-14',
      status: '배송 완료',
      amount: 11000
    },
    {
      id: 'ORD-20251107-059',
      date: '2025-11-07',
      status: '배송 완료',
      amount: 14000
    },
    {
      id: 'ORD-20251031-060',
      date: '2025-10-31',
      status: '배송 완료',
      amount: 12500
    }
  ]
};

// Summary Data
export const customerSummary = {
  totalCustomers: customers.length,
  newCustomersThisMonth: customers.filter(c => c.lastOrderDate.startsWith('2025-12')).length,
  blacklistedCustomers: customers.filter(c => c.tag === '블랙리스트').length
};