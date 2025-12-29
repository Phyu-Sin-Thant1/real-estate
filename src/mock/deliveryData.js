// Mock data for Delivery Partner Dashboard

// Moving/Quote Requests Data
export const movingRequests = [
  {
    id: 1,
    createdAt: '2025-12-10',
    customerName: '김철수',
    phone: '010-1234-5678',
    pickupAddress: '서울특별시 강남구 역삼동 123-45',
    deliveryAddress: '서울특별시 서초구 방배동 67-89',
    moveType: '가정이사',
    desiredDate: '2025-12-15',
    status: '신규',
    notes: ' fragile items 포함, 3층 아파트 엘리베이터 있음',
    customerMemo: '가전제품이 많아서 조심스럽게 운반 부탁드립니다.'
  },
  {
    id: 2,
    createdAt: '2025-12-09',
    customerName: '이영희',
    phone: '010-2345-6789',
    pickupAddress: '서울특별시 마포구 서교동 34-56',
    deliveryAddress: '서울특별시 용산구 한남동 78-90',
    moveType: '원룸이사',
    desiredDate: '2025-12-14',
    status: '연락 완료',
    notes: ' small room, 2nd floor without elevator',
    customerMemo: '가벼운 짐만 있어서 빠른 이사 가능합니다.'
  },
  {
    id: 3,
    createdAt: '2025-12-08',
    customerName: '박민수',
    phone: '010-3456-7890',
    pickupAddress: '서울특별시 송파구 잠실동 56-78',
    deliveryAddress: '서울특별시 강동구 명일동 90-12',
    moveType: '사무실이사',
    desiredDate: '2025-12-20',
    status: '견적 발송',
    notes: ' office equipment, 50㎡ space',
    customerMemo: '회사 이전이라 정확한 시간 준수 부탁드립니다.'
  },
  {
    id: 4,
    createdAt: '2025-12-07',
    customerName: '최지은',
    phone: '010-4567-8901',
    pickupAddress: '서울특별시 종로구 인사동 12-34',
    deliveryAddress: '서울특별시 중구 을지로 56-78',
    moveType: '원룸이사',
    desiredDate: '2025-12-12',
    status: '완료',
    notes: ' apartment move, weekend preferred',
    customerMemo: '주말 이사 가능하면 추가 비용 지불 가능합니다.'
  },
  {
    id: 5,
    createdAt: '2025-12-06',
    customerName: '정하늘',
    phone: '010-5678-9012',
    pickupAddress: '서울특별시 성동구 성수동 34-56',
    deliveryAddress: '서울특별시 광진구 구의동 78-90',
    moveType: '가정이사',
    desiredDate: '2025-12-18',
    status: '신규',
    notes: ' large family move, piano included',
    customerMemo: '피아노 운반이 가능한 업체인지 확인 부탁드립니다.'
  },
  {
    id: 6,
    createdAt: '2025-12-05',
    customerName: '한바다',
    phone: '010-6789-0123',
    pickupAddress: '서울특별시 동작구 흑석동 56-78',
    deliveryAddress: '서울특별시 관악구 봉천동 90-12',
    moveType: '원룸이사',
    desiredDate: '2025-12-13',
    status: '연락 완료',
    notes: ' student move, budget conscious',
    customerMemo: '학생이라 예산이 부족한데 할인 가능한가요?'
  },
  {
    id: 7,
    createdAt: '2025-12-04',
    customerName: '오솔지',
    phone: '010-7890-1234',
    pickupAddress: '서울특별시 은평구 갈현동 78-90',
    deliveryAddress: '서울특별시 서대문구 창천동 12-34',
    moveType: '사무실이사',
    desiredDate: '2025-12-22',
    status: '견적 발송',
    notes: ' small office, 20㎡ space',
    customerMemo: '이삿짐 중 보험 적용 가능한 물품이 따로 있나요?'
  },
  {
    id: 8,
    createdAt: '2025-12-03',
    customerName: '윤샛별',
    phone: '010-8901-2345',
    pickupAddress: '서울특별시 양천구 목동 90-12',
    deliveryAddress: '서울특별시 강서구 화곡동 34-56',
    moveType: '가정이사',
    desiredDate: '2025-12-16',
    status: '완료',
    notes: ' apartment move, 3rd floor with elevator',
    customerMemo: '이사 날짜 변경이 가능한가요?'
  }
];

// Delivery Orders Data
export const deliveryOrders = [
  {
    id: 'ORD-20251210-001',
    createdAt: '2025-12-10 09:30',
    pickupAddress: '서울특별시 강남구 역삼동 123-45',
    deliveryAddress: '서울특별시 서초구 방배동 67-89',
    customer: {
      name: '김철수',
      phone: '010-1234-5678'
    },
    product: '가전제품 세트',
    paymentStatus: '결제완료',
    orderStatus: '신규',
    notes: ' fragile items, handle with care',
    internalMemo: '고객이 특별히 조심스럽게 다뤄야 한다고 강조함'
  },
  {
    id: 'ORD-20251209-002',
    createdAt: '2025-12-09 14:15',
    pickupAddress: '서울특별시 마포구 서교동 34-56',
    deliveryAddress: '서울특별시 용산구 한남동 78-90',
    customer: {
      name: '이영희',
      phone: '010-2345-6789'
    },
    product: '서적 및 문서류',
    paymentStatus: '결제완료',
    orderStatus: '배차 대기',
    notes: ' books and documents, keep dry',
    internalMemo: '도서라 습기와 충격에 민감함'
  },
  {
    id: 'ORD-20251208-003',
    createdAt: '2025-12-08 11:45',
    pickupAddress: '서울특별시 송파구 잠실동 56-78',
    deliveryAddress: '서울특별시 강동구 명일동 90-12',
    customer: {
      name: '박민수',
      phone: '010-3456-7890'
    },
    product: '의류 및 잡화',
    paymentStatus: '결제완료',
    orderStatus: '배차 완료',
    notes: ' clothing items, multiple boxes',
    internalMemo: '의류라 주름이 생기지 않도록 포장 필요'
  },
  {
    id: 'ORD-20251207-004',
    createdAt: '2025-12-07 16:20',
    pickupAddress: '서울특별시 종로구 인사동 12-34',
    deliveryAddress: '서울특별시 중구 을지로 56-78',
    customer: {
      name: '최지은',
      phone: '010-4567-8901'
    },
    product: '전자제품',
    paymentStatus: '결제완료',
    orderStatus: '배송 중',
    notes: ' electronics, include padding',
    internalMemo: '전자제품이라 충격 흡수 포장 필수'
  },
  {
    id: 'ORD-20251206-005',
    createdAt: '2025-12-06 10:00',
    pickupAddress: '서울특별시 성동구 성수동 34-56',
    deliveryAddress: '서울특별시 광진구 구의동 78-90',
    customer: {
      name: '정하늘',
      phone: '010-5678-9012'
    },
    product: '가구류',
    paymentStatus: '결제완료',
    orderStatus: '배송 완료',
    notes: ' furniture, disassemble required',
    internalMemo: '가구 분해 후 운반 필요, 추가 인력 배정'
  },
  {
    id: 'ORD-20251205-006',
    createdAt: '2025-12-05 13:30',
    pickupAddress: '서울특별시 동작구 흑석동 56-78',
    deliveryAddress: '서울특별시 관악구 봉천동 90-12',
    customer: {
      name: '한바다',
      phone: '010-6789-0123'
    },
    product: '음식 배달',
    paymentStatus: '결제완료',
    orderStatus: '신규',
    notes: ' food delivery, keep warm',
    internalMemo: '음식이라 시간 엄수 필요, 보온백 사용'
  },
  {
    id: 'ORD-20251204-007',
    createdAt: '2025-12-04 15:45',
    pickupAddress: '서울특별시 은평구 갈현동 78-90',
    deliveryAddress: '서울특별시 서대문구 창천동 12-34',
    customer: {
      name: '오솔지',
      phone: '010-7890-1234'
    },
    product: '꽃다발',
    paymentStatus: '결제완료',
    orderStatus: '배차 대기',
    notes: ' flowers, handle delicately',
    internalMemo: '꽃이라 진동에 민감함, 조심스럽게 운반 필요'
  },
  {
    id: 'ORD-20251203-008',
    createdAt: '2025-12-03 08:15',
    pickupAddress: '서울특별시 양천구 목동 90-12',
    deliveryAddress: '서울특별시 강서구 화곡동 34-56',
    customer: {
      name: '윤샛별',
      phone: '010-8901-2345'
    },
    product: '의료기기',
    paymentStatus: '결제완료',
    orderStatus: '배차 완료',
    notes: ' medical equipment, sterile condition',
    internalMemo: '의료기기라 위생 상태 유지 중요'
  },
  {
    id: 'ORD-20251202-009',
    createdAt: '2025-12-02 12:00',
    pickupAddress: '서울특별시 구로구 구로동 12-34',
    deliveryAddress: '서울특별시 금천구 가산동 56-78',
    customer: {
      name: '임하루',
      phone: '010-9012-3456'
    },
    product: '예술작품',
    paymentStatus: '결제완료',
    orderStatus: '배송 중',
    notes: ' artwork, no tilting',
    internalMemo: '예술작품이라 기울이지 않고 수평 운반 필수'
  },
  {
    id: 'ORD-20251201-010',
    createdAt: '2025-12-01 17:30',
    pickupAddress: '서울특별시 영등포구 여의도동 34-56',
    deliveryAddress: '서울특별시 도봉구 쌍문동 78-90',
    customer: {
      name: '장하늘',
      phone: '010-0123-4567'
    },
    product: '운동기구',
    paymentStatus: '결제완료',
    orderStatus: '취소',
    notes: ' fitness equipment, heavy items',
    internalMemo: '고객 사정으로 인한 주문 취소'
  }
];

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to get date N days from today
const getDateFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Schedule Data
export const scheduleItems = [
  // Today's schedules
  {
    id: 1,
    date: getTodayDate(),
    time: '09:00',
    jobType: '이사',
    addressSummary: '서울시 강남구 역삼동 → 서울시 서초구 반포동',
    driver: '김운전',
    vehicle: '트럭 1호',
    status: '진행중'
  },
  {
    id: 2,
    date: getTodayDate(),
    time: '11:30',
    jobType: '배달',
    addressSummary: '서울시 마포구 상암동 → 서울시 용산구 이태원동',
    driver: '이기사',
    vehicle: '밴 2호',
    status: '진행중'
  },
  {
    id: 3,
    date: getTodayDate(),
    time: '14:00',
    jobType: '이사',
    addressSummary: '서울시 송파구 잠실동 → 서울시 강동구 천호동',
    driver: '박운전',
    vehicle: '트럭 3호',
    status: '예정'
  },
  {
    id: 4,
    date: getTodayDate(),
    time: '16:30',
    jobType: '배달',
    addressSummary: '서울시 종로구 명동 → 서울시 중구 을지로',
    driver: '최기사',
    vehicle: '모터 1호',
    status: '예정'
  },
  // Tomorrow's schedules
  {
    id: 5,
    date: getDateFromToday(1),
    time: '10:00',
    jobType: '이사',
    addressSummary: '서울시 성동구 성수동 → 서울시 광진구 자양동',
    driver: '정운전',
    vehicle: '트럭 2호',
    status: '예정'
  },
  {
    id: 6,
    date: getDateFromToday(1),
    time: '13:00',
    jobType: '배달',
    addressSummary: '서울시 영등포구 여의도 → 서울시 강서구 화곡동',
    driver: '김운전',
    vehicle: '밴 1호',
    status: '예정'
  },
  // Completed schedules (yesterday)
  {
    id: 7,
    date: getDateFromToday(-1),
    time: '09:00',
    jobType: '이사',
    addressSummary: '서울시 노원구 상계동 → 서울시 도봉구 창동',
    driver: '이기사',
    vehicle: '트럭 1호',
    status: '완료'
  },
  {
    id: 8,
    date: getDateFromToday(-1),
    time: '15:00',
    jobType: '배달',
    addressSummary: '서울시 은평구 불광동 → 서울시 서대문구 홍대',
    driver: '박운전',
    vehicle: '밴 2호',
    status: '완료'
  },
  // Delayed schedules
  {
    id: 9,
    date: getDateFromToday(-2),
    time: '10:00',
    jobType: '이사',
    addressSummary: '서울시 양천구 목동 → 서울시 강서구 가양동',
    driver: '최기사',
    vehicle: '트럭 3호',
    status: '지연'
  },
  {
    id: 10,
    date: getDateFromToday(-1),
    time: '14:00',
    jobType: '배달',
    addressSummary: '서울시 구로구 구로동 → 서울시 금천구 가산동',
    driver: '정운전',
    vehicle: '모터 1호',
    status: '지연'
  },
  // More upcoming schedules
  {
    id: 11,
    date: getDateFromToday(2),
    time: '09:30',
    jobType: '이사',
    addressSummary: '서울시 강북구 미아동 → 서울시 성북구 길음동',
    driver: '김운전',
    vehicle: '트럭 1호',
    status: '예정'
  },
  {
    id: 12,
    date: getDateFromToday(2),
    time: '14:30',
    jobType: '배달',
    addressSummary: '서울시 중랑구 면목동 → 서울시 동대문구 장안동',
    driver: '이기사',
    vehicle: '밴 2호',
    status: '예정'
  },
  {
    id: 13,
    date: getDateFromToday(3),
    time: '11:00',
    jobType: '이사',
    addressSummary: '서울시 관악구 신림동 → 서울시 서초구 방배동',
    driver: '박운전',
    vehicle: '트럭 2호',
    status: '예정'
  },
  {
    id: 14,
    date: getDateFromToday(3),
    time: '16:00',
    jobType: '배달',
    addressSummary: '서울시 금천구 독산동 → 서울시 영등포구 당산동',
    driver: '최기사',
    vehicle: '모터 1호',
    status: '예정'
  },
  {
    id: 15,
    date: getDateFromToday(4),
    time: '10:00',
    jobType: '이사',
    addressSummary: '서울시 동작구 상도동 → 서울시 서초구 서초동',
    driver: '정운전',
    vehicle: '트럭 3호',
    status: '예정'
  }
];

// Vehicles Data
export const vehicles = [
  {
    id: 1,
    name: '트럭 1호',
    plateNumber: '12가 3456',
    capacity: '2.5톤',
    status: '활성',
    driverName: '김민수',
    driverPhone: '010-1234-5678'
  },
  {
    id: 2,
    name: '트럭 2호',
    plateNumber: '23나 4567',
    capacity: '3.5톤',
    status: '점검중',
    driverName: '이정은',
    driverPhone: '010-2345-6789'
  },
  {
    id: 3,
    name: '트럭 3호',
    plateNumber: '34다 5678',
    capacity: '5톤',
    status: '활성',
    driverName: '박기철',
    driverPhone: '010-3456-7890'
  },
  {
    id: 4,
    name: '밴 1호',
    plateNumber: '45라 6789',
    capacity: '1.2톤',
    status: '활성',
    driverName: '최영희',
    driverPhone: '010-4567-8901'
  },
  {
    id: 5,
    name: '밴 2호',
    plateNumber: '56마 7890',
    capacity: '1.5톤',
    status: '활성',
    driverName: '정우성',
    driverPhone: '010-5678-9012'
  },
  {
    id: 6,
    name: '모터 1호',
    plateNumber: '67바 8901',
    capacity: '0.5톤',
    status: '활성',
    driverName: '한지민',
    driverPhone: '010-6789-0123'
  }
];

// Drivers Data
export const drivers = [
  {
    id: 1,
    name: '김운전',
    phone: '010-1111-1111',
    status: '근무'
  },
  {
    id: 2,
    name: '이기사',
    phone: '010-2222-2222',
    status: '근무'
  },
  {
    id: 3,
    name: '박운전',
    phone: '010-3333-3333',
    status: '휴무'
  },
  {
    id: 4,
    name: '최기사',
    phone: '010-4444-4444',
    status: '근무'
  },
  {
    id: 5,
    name: '정운전',
    phone: '010-5555-5555',
    status: '근무'
  }
];

// Settlement Data
export const settlements = [
  {
    id: 1,
    period: '2025-12-01 ~ 2025-12-15',
    orderType: '이사',
    totalAmount: 1500000,
    commission: 150000,
    settlementAmount: 1350000,
    status: '정산대기'
  },
  {
    id: 2,
    period: '2025-12-01 ~ 2025-12-15',
    orderType: '배달',
    totalAmount: 800000,
    commission: 80000,
    settlementAmount: 720000,
    status: '정산완료'
  },
  {
    id: 3,
    period: '2025-11-16 ~ 2025-11-30',
    orderType: '이사',
    totalAmount: 1200000,
    commission: 120000,
    settlementAmount: 1080000,
    status: '정산완료'
  },
  {
    id: 4,
    period: '2025-11-16 ~ 2025-11-30',
    orderType: '배달',
    totalAmount: 650000,
    commission: 65000,
    settlementAmount: 585000,
    status: '정산대기'
  },
  {
    id: 5,
    period: '2025-11-01 ~ 2025-11-15',
    orderType: '이사',
    totalAmount: 1800000,
    commission: 180000,
    settlementAmount: 1620000,
    status: '정산완료'
  },
  {
    id: 6,
    period: '2025-11-01 ~ 2025-11-15',
    orderType: '배달',
    totalAmount: 950000,
    commission: 95000,
    settlementAmount: 855000,
    status: '정산완료'
  },
  {
    id: 7,
    period: '2025-10-16 ~ 2025-10-31',
    orderType: '이사',
    totalAmount: 1350000,
    commission: 135000,
    settlementAmount: 1215000,
    status: '정산완료'
  },
  {
    id: 8,
    period: '2025-10-16 ~ 2025-10-31',
    orderType: '배달',
    totalAmount: 720000,
    commission: 72000,
    settlementAmount: 648000,
    status: '정산완료'
  },
  {
    id: 9,
    period: '2025-10-01 ~ 2025-10-15',
    orderType: '이사',
    totalAmount: 1650000,
    commission: 165000,
    settlementAmount: 1485000,
    status: '정산완료'
  },
  {
    id: 10,
    period: '2025-10-01 ~ 2025-10-15',
    orderType: '배달',
    totalAmount: 880000,
    commission: 88000,
    settlementAmount: 792000,
    status: '정산완료'
  },
  {
    id: 11,
    period: '2025-09-16 ~ 2025-09-30',
    orderType: '이사',
    totalAmount: 1420000,
    commission: 142000,
    settlementAmount: 1278000,
    status: '정산완료'
  },
  {
    id: 12,
    period: '2025-09-16 ~ 2025-09-30',
    orderType: '배달',
    totalAmount: 780000,
    commission: 78000,
    settlementAmount: 702000,
    status: '정산완료'
  }
];

// Customers Data (derived from requests and orders)
export const customers = [
  {
    id: 1,
    name: '김철수',
    phone: '010-1234-5678',
    lastRequestDate: '2025-12-10',
    requestType: '이사/배달',
    status: '활성',
    memo: 'VIP 고객, 자주 이용함'
  },
  {
    id: 2,
    name: '이영희',
    phone: '010-2345-6789',
    lastRequestDate: '2025-12-09',
    requestType: '이사',
    status: '활성',
    memo: '학생, 예산이 부족한 고객'
  },
  {
    id: 3,
    name: '박민수',
    phone: '010-3456-7890',
    lastRequestDate: '2025-12-08',
    requestType: '이사/배달',
    status: '활성',
    memo: '사무실 이사, 정확한 시간 준수 요구'
  },
  {
    id: 4,
    name: '최지은',
    phone: '010-4567-8901',
    lastRequestDate: '2025-12-07',
    requestType: '이사',
    status: '완료',
    memo: '가전제품 운반, 특별히 조심스러움'
  },
  {
    id: 5,
    name: '정하늘',
    phone: '010-5678-9012',
    lastRequestDate: '2025-12-06',
    requestType: '이사/배달',
    status: '활성',
    memo: '가구류 운반, 추가 인력 필요'
  },
  {
    id: 6,
    name: '한바다',
    phone: '010-6789-0123',
    lastRequestDate: '2025-12-05',
    requestType: '배달',
    status: '활성',
    memo: '음식 배달, 시간 엄수 필요'
  },
  {
    id: 7,
    name: '오솔지',
    phone: '010-7890-1234',
    lastRequestDate: '2025-12-04',
    requestType: '이사',
    status: '완료',
    memo: '도서 운반, 습기와 충격에 민감'
  },
  {
    id: 8,
    name: '윤샛별',
    phone: '010-8901-2345',
    lastRequestDate: '2025-12-03',
    requestType: '이사',
    status: '완료',
    memo: '의료기기 운반, 위생 상태 유지 중요'
  },
  {
    id: 9,
    name: '임하루',
    phone: '010-9012-3456',
    lastRequestDate: '2025-12-02',
    requestType: '배달',
    status: '완료',
    memo: '예술작품 운반, 기울이지 않고 수평 운반'
  },
  {
    id: 10,
    name: '장하늘',
    phone: '010-0123-4567',
    lastRequestDate: '2025-12-01',
    requestType: '배달',
    status: '취소',
    memo: '운동기구 운반, 고객 사정으로 취소'
  },
  {
    id: 11,
    name: '서해린',
    phone: '010-1234-5679',
    lastRequestDate: getTodayDate(),
    requestType: '이사',
    status: '활성',
    memo: '신규 고객, 오늘 이사 예정, 조심스럽게 다뤄달라고 요청'
  },
  {
    id: 12,
    name: '남가람',
    phone: '010-2345-6780',
    lastRequestDate: getTodayDate(),
    requestType: '배달',
    status: '활성',
    memo: '정기 배달 고객, 매주 화요일 배달'
  },
  {
    id: 13,
    name: '도빛나',
    phone: '010-3456-7891',
    lastRequestDate: getDateFromToday(-1),
    requestType: '이사/배달',
    status: '완료',
    memo: '사무실 이사 완료, 다음 달에도 예정'
  },
  {
    id: 14,
    name: '배하영',
    phone: '010-4567-8902',
    lastRequestDate: getDateFromToday(-2),
    requestType: '이사',
    status: '완료',
    memo: '가구가 많아 추가 차량 필요했음, 만족도 높음'
  },
  {
    id: 15,
    name: '강민지',
    phone: '010-5678-9013',
    lastRequestDate: getDateFromToday(-3),
    requestType: '배달',
    status: '완료',
    memo: '음식 배달, 온도 유지 중요, 잘 처리됨'
  },
  {
    id: 16,
    name: '송지우',
    phone: '010-6789-0124',
    lastRequestDate: getDateFromToday(-5),
    requestType: '이사',
    status: '완료',
    memo: '피아노 운반, 전문 업체와 협업 필요했음'
  },
  {
    id: 17,
    name: '유서연',
    phone: '010-7890-1235',
    lastRequestDate: getDateFromToday(-7),
    requestType: '배달',
    status: '완료',
    memo: '화물 배달, 대량 주문 고객'
  },
  {
    id: 18,
    name: '조민준',
    phone: '010-8901-2346',
    lastRequestDate: getDateFromToday(-10),
    requestType: '이사/배달',
    status: '활성',
    memo: '다음 주 재이사 예정, 연락 대기 중'
  },
  {
    id: 19,
    name: '황수빈',
    phone: '010-9012-3457',
    lastRequestDate: getDateFromToday(-12),
    requestType: '이사',
    status: '완료',
    memo: '원룸 이사, 짐이 적어 소형 차량으로 충분'
  },
  {
    id: 20,
    name: '문예준',
    phone: '010-0123-4568',
    lastRequestDate: getDateFromToday(-15),
    requestType: '배달',
    status: '완료',
    memo: '생일 선물 배달, 포장에 신경 써달라고 요청'
  },
  {
    id: 21,
    name: '신다은',
    phone: '010-1234-5670',
    lastRequestDate: getDateFromToday(-18),
    requestType: '이사',
    status: '완료',
    memo: '학생 이사, 예산이 제한적이었음'
  },
  {
    id: 22,
    name: '오지훈',
    phone: '010-2345-6781',
    lastRequestDate: getDateFromToday(-20),
    requestType: '이사/배달',
    status: '활성',
    memo: '사업 확장으로 인한 이사, 다음 달 추가 이사 예정'
  },
  {
    id: 23,
    name: '전소율',
    phone: '010-3456-7892',
    lastRequestDate: getDateFromToday(-22),
    requestType: '배달',
    status: '완료',
    memo: '정기 배달 고객, 매월 말 배달'
  },
  {
    id: 24,
    name: '류현우',
    phone: '010-4567-8903',
    lastRequestDate: getDateFromToday(-25),
    requestType: '이사',
    status: '완료',
    memo: '가전제품 많음, 포장 상태 확인 중요'
  },
  {
    id: 25,
    name: '나예린',
    phone: '010-5678-9014',
    lastRequestDate: getDateFromToday(-28),
    requestType: '배달',
    status: '완료',
    memo: '화물 배달, 무거운 물건 주의 필요'
  },
  {
    id: 26,
    name: '백준호',
    phone: '010-6789-0125',
    lastRequestDate: getDateFromToday(-30),
    requestType: '이사',
    status: '완료',
    memo: '오피스텔 이사, 엘리베이터 사용 가능'
  },
  {
    id: 27,
    name: '심채원',
    phone: '010-7890-1236',
    lastRequestDate: getDateFromToday(-1),
    requestType: '배달',
    status: '활성',
    memo: '신규 고객, 오늘 첫 배달 예정'
  },
  {
    id: 28,
    name: '안도현',
    phone: '010-8901-2347',
    lastRequestDate: getDateFromToday(-3),
    requestType: '이사',
    status: '완료',
    memo: '반려동물 동반 이사, 조용한 환경 유지 필요'
  },
  {
    id: 29,
    name: '진서아',
    phone: '010-9012-3458',
    lastRequestDate: getDateFromToday(-6),
    requestType: '이사/배달',
    status: '완료',
    memo: '가구가 많아 2일 소요, 만족도 높음'
  },
  {
    id: 30,
    name: '허민서',
    phone: '010-0123-4569',
    lastRequestDate: getDateFromToday(-8),
    requestType: '배달',
    status: '완료',
    memo: '음식 배달, 시간 엄수 잘 됨'
  }
];

// Settings Data
export const deliverySettings = {
  notifications: {
    email: true,
    sms: true,
    push: false
  },
  businessInfo: {
    companyName: 'TOFU 배송 서비스',
    phone: '02-1234-5678'
  },
  workingHours: {
    startTime: '09:00',
    endTime: '18:00'
  }
};

// Helper functions
export const updateMovingRequestStatus = (requestId, newStatus) => {
  // In a real app, this would update the state
  console.log(`Updating request ${requestId} status to ${newStatus}`);
};

export const updateDeliveryOrderStatus = (orderId, newStatus) => {
  // In a real app, this would update the state
  console.log(`Updating order ${orderId} status to ${newStatus}`);
};

export const assignDriverToOrder = (orderId, driverId) => {
  // In a real app, this would update the state
  console.log(`Assigning driver ${driverId} to order ${orderId}`);
};

export const assignVehicleToOrder = (orderId, vehicleId) => {
  // In a real app, this would update the state
  console.log(`Assigning vehicle ${vehicleId} to order ${orderId}`);
};