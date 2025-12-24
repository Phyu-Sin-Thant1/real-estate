// Enhanced mock data for redesigned homepage

export const heroStats = [
  { label: '신규 매물', value: '358', unit: '건', icon: '🏠', color: 'text-blue-600' },
  { label: '파트너', value: '1,234', unit: '개', icon: '🤝', color: 'text-green-600' },
];

export const actionShortcuts = [
  {
    id: 1,
    title: '매물 검색',
    description: '원하는 집을 찾아보세요',
    icon: '🔍',
    link: '/category/all',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: '지도 검색',
    description: '지도에서 위치 확인',
    icon: '🗺️',
    link: '/map',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 3,
    title: '이사 서비스',
    description: '안전한 이사 견적',
    icon: '🚚',
    link: '/moving',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 4,
    title: '특가 할인',
    description: '프로모션 확인',
    icon: '🎁',
    link: '/category/all',
    color: 'from-purple-500 to-purple-600',
  },
];

export const banners = [
  {
    id: 1,
    title: '신규 매물 특가 이벤트',
    subtitle: '이번 달 신규 등록 매물 최대 10% 할인',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    link: '/category/all',
    cta: '지금 확인하기',
    tag: '추천',
    tagColor: 'bg-blue-500',
  },
  {
    id: 2,
    title: '안전한 이사 서비스',
    subtitle: '전문 포장부터 배송까지 원스톱 서비스',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    link: '/moving',
    cta: '견적 받기',
    tag: '프로모션',
    tagColor: 'bg-orange-500',
  },
  {
    id: 3,
    title: '파트너 모집 중',
    subtitle: '부동산/이사 파트너와 함께 성장하세요',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
    link: '/partner/apply',
    cta: '파트너 신청',
    tag: '광고',
    tagColor: 'bg-purple-500',
  },
];

export const trendingListings = [
  {
    id: 1,
    title: '강남구 역삼동 아파트',
    address: '서울시 강남구 역삼동',
    price: '12억 5천만원',
    priceType: '매매',
    area: '84㎡',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    tags: ['신규', '인기'],
    views: 1234,
  },
  {
    id: 2,
    title: '서초구 서초동 오피스텔',
    address: '서울시 서초구 서초동',
    price: '3억원',
    priceType: '전세',
    area: '32㎡',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    tags: ['신규'],
    views: 856,
  },
  {
    id: 3,
    title: '송파구 잠실동 아파트',
    address: '서울시 송파구 잠실동',
    price: '보증금 5천만원 / 월 150만원',
    priceType: '월세',
    area: '59㎡',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400',
    tags: ['인기', '급매'],
    views: 1456,
  },
  {
    id: 4,
    title: '강동구 천호동 주택',
    address: '서울시 강동구 천호동',
    price: '8억원',
    priceType: '매매',
    area: '105㎡',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    tags: ['신규'],
    views: 789,
  },
  {
    id: 5,
    title: '마포구 상암동 오피스텔',
    address: '서울시 마포구 상암동',
    price: '2억 5천만원',
    priceType: '전세',
    area: '28㎡',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    tags: ['인기'],
    views: 623,
  },
  {
    id: 6,
    title: '영등포구 여의도동 아파트',
    address: '서울시 영등포구 여의도동',
    price: '15억원',
    priceType: '매매',
    area: '94㎡',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    tags: ['신규', '인기'],
    views: 1678,
  },
];

export const popularAreas = [
  { name: '강남구', count: 1245, trend: '+12%', link: '/map?area=강남구' },
  { name: '서초구', count: 987, trend: '+8%', link: '/map?area=서초구' },
  { name: '송파구', count: 856, trend: '+5%', link: '/map?area=송파구' },
  { name: '마포구', count: 743, trend: '+15%', link: '/map?area=마포구' },
  { name: '영등포구', count: 612, trend: '+3%', link: '/map?area=영등포구' },
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
  avgResponse: '2.5시간',
  avgRating: '4.8',
  completedJobs: '12,345건',
};

export const reviews = [
  {
    id: 1,
    userName: '김민수',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    serviceType: '부동산 거래',
    location: '강남구 역삼동',
    comment: '매우 만족스러운 거래였습니다. 담당자가 친절하고 전문적이었어요. 매물 정보도 정확하고, 중개 과정이 투명해서 신뢰할 수 있었습니다.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: 2,
    userName: '이영희',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    serviceType: '이사 서비스',
    location: '서초구 서초동',
    comment: '빠른 응답과 정확한 정보 제공으로 좋은 경험이었습니다. 이사도 깔끔하게 잘 됐어요. 포장부터 배송까지 모든 과정이 전문적이었습니다.',
    date: '2024-01-08',
    verified: true,
  },
  {
    id: 3,
    userName: '박상훈',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4,
    serviceType: '부동산 거래',
    location: '송파구 잠실동',
    comment: '전반적으로 만족하지만 약간의 개선 여지가 있어 보입니다. 그래도 담당자의 친절함과 빠른 응답은 인상적이었어요.',
    date: '2024-01-05',
    verified: false,
  },
  {
    id: 4,
    userName: '최지은',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    serviceType: '이사 서비스',
    location: '마포구 상암동',
    comment: '처음 이용하는 이사 서비스였는데 정말 만족스러웠습니다. 견적도 합리적이고, 기사분들도 매우 친절하셨어요. 다음에도 꼭 이용하겠습니다!',
    date: '2024-01-03',
    verified: true,
  },
  {
    id: 5,
    userName: '정우진',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    serviceType: '부동산 거래',
    location: '영등포구 여의도동',
    comment: '투명한 거래와 빠른 처리로 만족했습니다. 특히 매물 정보의 정확도가 높아서 좋았어요. 추천합니다!',
    date: '2024-01-01',
    verified: true,
  },
  {
    id: 6,
    userName: '한소영',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    serviceType: '이사 서비스',
    location: '강동구 천호동',
    comment: '이사 날짜가 급했는데도 불구하고 빠르게 매칭해주셔서 감사했습니다. 물건도 하나도 손상 없이 잘 옮겨주셨어요.',
    date: '2023-12-28',
    verified: true,
  },
];

export const partnerBenefits = {
  realEstate: {
    title: '부동산 파트너',
    description: '매물을 등록하고 더 많은 고객을 만나보세요',
    benefits: [
      '무료 매물 등록',
      '실시간 문의 알림',
      '수수료 최저가',
      '전문 대시보드',
    ],
    icon: '🏠',
    color: 'from-blue-500 to-blue-600',
  },
  moving: {
    title: '이사 파트너',
    description: '이사 서비스를 제공하고 수익을 올려보세요',
    benefits: [
      '견적 요청 자동 매칭',
      '작업 일정 관리',
      '정산 자동화',
      '고객 리뷰 관리',
    ],
    icon: '🚚',
    color: 'from-orange-500 to-orange-600',
  },
};

export const platformKPIs = [
  {
    label: '등록 매물',
    value: '45,678',
    unit: '건',
    icon: '🏠',
    color: 'text-blue-600',
  },
  {
    label: '활성 파트너',
    value: '1,234',
    unit: '개',
    icon: '🤝',
    color: 'text-green-600',
  },
  {
    label: '월간 거래',
    value: '3,847',
    unit: '건',
    icon: '📊',
    color: 'text-orange-600',
  },
];

// New: Trust indicators
export const trustIndicators = [
  {
    icon: '🛡️',
    title: '안전한 거래',
    description: '검증된 파트너와의 신뢰할 수 있는 거래',
  },
  {
    icon: '⚡',
    title: '빠른 응답',
    description: '평균 2.5시간 이내 고객 문의 응답',
  },
  {
    icon: '⭐',
    title: '높은 만족도',
    description: '고객 평균 평점 4.8점',
  },
  {
    icon: '📊',
    title: '투명한 정보',
    description: '실시간 시세와 정확한 매물 정보',
  },
];

// Market News (for Market Insight section)
export const marketNews = [
  {
    id: 1,
    headline: '강남구 아파트 전세가 3주 연속 상승세',
    timeAgo: '10분 전',
  },
  {
    id: 2,
    headline: '서초구 신규 매물 급증, 선택지 확대',
    timeAgo: '1시간 전',
  },
  {
    id: 3,
    headline: '송파구 거래량 감소, 관망세 지속',
    timeAgo: '3시간 전',
  },
];

// Market Signals (KPI cards for Market Insight section)
export const marketSignals = [
  {
    id: 1,
    icon: '📈',
    title: '서울 아파트 전세가',
    value: '5억 2천만원',
    change: '+2.3%',
    trend: 'up',
    explanation: '최근 3주 연속 상승',
  },
  {
    id: 2,
    icon: '🏠',
    title: '신규 매물',
    value: '1,200건',
    change: '+15%',
    trend: 'up',
    explanation: '신규 매물 증가로 선택지 확대',
  },
  {
    id: 3,
    icon: '📊',
    title: '주간 거래량',
    value: '3,847건',
    change: '-5.2%',
    trend: 'down',
    explanation: '거래량 감소로 관망세',
  },
  {
    id: 4,
    icon: '💰',
    title: '평균 매매가',
    value: '12억 8천만원',
    change: '+1.8%',
    trend: 'up',
    explanation: '안정적인 상승세 유지',
  },
];
