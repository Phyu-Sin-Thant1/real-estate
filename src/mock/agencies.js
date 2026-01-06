// Mock agency data for real estate and moving services

export const realEstateAgencies = [
  {
    id: 'agency-1',
    name: '강남부동산',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format',
    description: '강남 지역 최고의 부동산 중개 전문 업체입니다. 20년 이상의 경험과 신뢰를 바탕으로 고객 만족을 최우선으로 합니다.',
    phone: '02-1234-5678',
    email: 'contact@gangnam-realestate.com',
    address: '서울특별시 강남구 테헤란로 123',
    verified: true,
    establishedYear: 2003,
    totalListings: 245,
    activeListings: 89,
    soldListings: 120,
    rentedListings: 36,
    rating: 4.8,
    reviewCount: 342
  },
  {
    id: 'agency-2',
    name: '홍대부동산',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop&auto=format',
    description: '홍대 인근 지역의 원룸, 투룸 전문 중개사입니다. 젊은 층을 위한 최적의 매물을 제공합니다.',
    phone: '02-2345-6789',
    email: 'info@hongdae-realestate.com',
    address: '서울특별시 마포구 홍익로 39',
    verified: true,
    establishedYear: 2015,
    totalListings: 156,
    activeListings: 45,
    soldListings: 78,
    rentedListings: 33,
    rating: 4.6,
    reviewCount: 189
  },
  {
    id: 'agency-3',
    name: '송파부동산',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop&auto=format',
    description: '송파구 지역의 프리미엄 부동산 중개 서비스를 제공합니다. 가족 단위 고객을 위한 최적의 매물을 선별합니다.',
    phone: '02-3456-7890',
    email: 'sales@songpa-realestate.com',
    address: '서울특별시 송파구 잠실동 올림픽로 300',
    verified: true,
    establishedYear: 2010,
    totalListings: 198,
    activeListings: 67,
    soldListings: 95,
    rentedListings: 36,
    rating: 4.7,
    reviewCount: 256
  },
  {
    id: 'agency-4',
    name: '이태원글로벌부동산',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format',
    description: '이태원 지역의 다문화 부동산 전문 중개사입니다. 외국인 고객을 위한 맞춤 서비스를 제공합니다.',
    phone: '02-4567-8901',
    email: 'global@itaewon-realestate.com',
    address: '서울특별시 용산구 이태원로 27길 16',
    verified: false,
    establishedYear: 2018,
    totalListings: 89,
    activeListings: 23,
    soldListings: 45,
    rentedListings: 21,
    rating: 4.3,
    reviewCount: 98
  },
  {
    id: 'agency-5',
    name: '서초프리미엄부동산',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop&auto=format',
    description: '서초구 고급 아파트 전문 중개사입니다. 프리미엄 매물을 중심으로 한 맞춤형 서비스를 제공합니다.',
    phone: '02-5678-9012',
    email: 'premium@seocho-realestate.com',
    address: '서울특별시 서초구 서초대로 396',
    verified: true,
    establishedYear: 2005,
    totalListings: 312,
    activeListings: 112,
    soldListings: 156,
    rentedListings: 44,
    rating: 4.9,
    reviewCount: 421
  }
];

export const movingAgencies = [
  {
    id: 'moving-agency-1',
    name: '한국이사',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format',
    description: '전국 어디서나 안전하고 빠른 이사 서비스를 제공합니다. 15년 이상의 경험으로 고객 만족을 보장합니다.',
    phone: '1588-1234',
    email: 'contact@korea-moving.com',
    address: '서울특별시 강남구 테헤란로 456',
    verified: true,
    establishedYear: 2008,
    totalServices: 5234,
    completedServices: 4890,
    activeServices: 344,
    rating: 4.7,
    reviewCount: 1234
  },
  {
    id: 'moving-agency-2',
    name: '스피드이사',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop&auto=format',
    description: '빠르고 정확한 이사 서비스로 유명합니다. 당일 이사도 가능하며, 전문 포장 서비스를 제공합니다.',
    phone: '1588-2345',
    email: 'info@speed-moving.com',
    address: '서울특별시 마포구 홍익로 100',
    verified: true,
    establishedYear: 2012,
    totalServices: 3456,
    completedServices: 3201,
    activeServices: 255,
    rating: 4.6,
    reviewCount: 876
  },
  {
    id: 'moving-agency-3',
    name: '프리미엄이사',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format',
    description: '럭셔리 이사 서비스 전문 업체입니다. 고급 가구와 예술품 이사를 전문으로 합니다.',
    phone: '1588-3456',
    email: 'premium@premium-moving.com',
    address: '서울특별시 서초구 서초대로 500',
    verified: true,
    establishedYear: 2015,
    totalServices: 1890,
    completedServices: 1756,
    activeServices: 134,
    rating: 4.9,
    reviewCount: 567
  },
  {
    id: 'moving-agency-4',
    name: '친절이사',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop&auto=format',
    description: '고객 만족을 최우선으로 하는 친절한 이사 서비스입니다. 합리적인 가격과 세심한 서비스를 제공합니다.',
    phone: '1588-4567',
    email: 'kind@kind-moving.com',
    address: '서울특별시 송파구 잠실동 200',
    verified: false,
    establishedYear: 2019,
    totalServices: 987,
    completedServices: 856,
    activeServices: 131,
    rating: 4.4,
    reviewCount: 234
  }
];

// Helper functions
export const getAgencyById = (id, type = 'realEstate') => {
  const agencies = type === 'realEstate' ? realEstateAgencies : movingAgencies;
  return agencies.find(agency => agency.id === id) || null;
};

export const getAllAgencies = (type = 'realEstate') => {
  return type === 'realEstate' ? realEstateAgencies : movingAgencies;
};

export const getVerifiedAgencies = (type = 'realEstate') => {
  const agencies = type === 'realEstate' ? realEstateAgencies : movingAgencies;
  return agencies.filter(agency => agency.verified);
};

