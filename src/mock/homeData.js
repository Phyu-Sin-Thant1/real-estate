// Mock data for homepage sections

export const banners = [
  {
    id: 1,
    title: '신규 매물 특가 이벤트',
    subtitle: '이번 달 신규 등록 매물 최대 10% 할인',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    link: '/category/all',
    cta: '지금 확인하기',
  },
  {
    id: 2,
    title: '안전한 이사 서비스',
    subtitle: '전문 포장부터 배송까지 원스톱 서비스',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    link: '/moving',
    cta: '견적 받기',
  },
  {
    id: 3,
    title: '파트너 모집 중',
    subtitle: '부동산/이사 파트너와 함께 성장하세요',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
    link: '/partner/apply',
    cta: '파트너 신청',
  },
];

export const listings = [
  {
    id: 1,
    title: '강남구 역삼동 아파트',
    address: '서울시 강남구 역삼동',
    price: '12억 5천만원',
    priceType: '매매',
    area: '84㎡',
    roomType: '3룸 2욕',
    floor: '15층/20층',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    likes: 234,
    views: 1234,
    isNew: true,
  },
  {
    id: 2,
    title: '서초구 서초동 오피스텔',
    address: '서울시 서초구 서초동',
    price: '3억원',
    priceType: '전세',
    area: '32㎡',
    roomType: '원룸',
    floor: '8층/15층',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    likes: 189,
    views: 856,
    isNew: false,
  },
  {
    id: 3,
    title: '송파구 잠실동 아파트',
    address: '서울시 송파구 잠실동',
    price: '보증금 5천만원 / 월 150만원',
    priceType: '월세',
    area: '59㎡',
    roomType: '2룸 1욕',
    floor: '10층/25층',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400',
    likes: 312,
    views: 1456,
    isNew: true,
  },
  {
    id: 4,
    title: '강동구 천호동 주택',
    address: '서울시 강동구 천호동',
    price: '8억원',
    priceType: '매매',
    area: '105㎡',
    roomType: '4룸 2욕',
    floor: '단독주택',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    likes: 167,
    views: 789,
    isNew: false,
  },
  {
    id: 5,
    title: '마포구 상암동 오피스텔',
    address: '서울시 마포구 상암동',
    price: '2억 5천만원',
    priceType: '전세',
    area: '28㎡',
    roomType: '원룸',
    floor: '12층/20층',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    likes: 145,
    views: 623,
    isNew: true,
  },
  {
    id: 6,
    title: '영등포구 여의도동 아파트',
    address: '서울시 영등포구 여의도동',
    price: '15억원',
    priceType: '매매',
    area: '94㎡',
    roomType: '3룸 2욕',
    floor: '18층/30층',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    likes: 298,
    views: 1678,
    isNew: false,
  },
];

export const popularAreas = [
  { name: '강남구', count: 1245, trend: '+12%' },
  { name: '서초구', count: 987, trend: '+8%' },
  { name: '송파구', count: 856, trend: '+5%' },
  { name: '마포구', count: 743, trend: '+15%' },
  { name: '영등포구', count: 612, trend: '+3%' },
];

export const reviews = [
  {
    id: 1,
    userName: '김민수',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    property: '강남구 역삼동 아파트',
    comment: '매우 만족스러운 거래였습니다. 담당자가 친절하고 전문적이었어요.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: 2,
    userName: '이영희',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    property: '서초구 서초동 오피스텔',
    comment: '빠른 응답과 정확한 정보 제공으로 좋은 경험이었습니다.',
    date: '2024-01-08',
    verified: true,
  },
  {
    id: 3,
    userName: '박상훈',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4,
    property: '송파구 잠실동 아파트',
    comment: '전반적으로 만족하지만 약간의 개선 여지가 있어 보입니다.',
    date: '2024-01-05',
    verified: false,
  },
];

export const trustKPIs = [
  {
    label: '파트너 수',
    value: '1,234',
    unit: '개',
    description: '인증된 부동산/이사 파트너',
  },
  {
    label: '등록 매물',
    value: '45,678',
    unit: '건',
    description: '실시간 등록된 매물',
  },
  {
    label: '평균 응답 시간',
    value: '2.5',
    unit: '시간',
    description: '고객 문의 평균 응답 시간',
  },
];

export const movingSteps = [
  {
    step: 1,
    title: '견적 요청',
    description: '간단한 정보 입력으로 빠른 견적',
    icon: '📝',
  },
  {
    step: 2,
    title: '파트너 매칭',
    description: '전문 파트너와 빠른 매칭',
    icon: '🤝',
  },
  {
    step: 3,
    title: '안전한 이사',
    description: '전문 포장부터 배송까지',
    icon: '🚚',
  },
];

export const movingMetrics = {
  completedJobs: '12,345',
  avgRating: '4.8',
  responseTime: '2시간',
};


