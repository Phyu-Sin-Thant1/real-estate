// Mock property data
export const mockProperties = [
  {
    id: 1,
    title: '강남구 신축 아파트',
    price: '12억',
    originalPrice: '13억',
    discount: '1억(7.7%)',
    dealType: '매매',
    address: '서울특별시 강남구 역삼동 테헤란로 152',
    tags: ['아파트', '3룸', '2욕실'],
    description: '강남구 역삼동에 위치한 신축 아파트로, 최고급 마감재와 스마트홈 시스템이 적용된 프리미엄 주거공간입니다. 대형 쇼핑몰과 업무지구가 인근에 위치하여 생활 편의성이 매우 우수합니다. 남향으로 조망권이 확보되어 채광이 뛰어나며, 주차공간이 충분히 확보된 단지입니다.',
    options: ['주차 가능', '엘리베이터', '보안 시설', 'CCTV', '경비원 상주'],
    facilities: ['헬스장', '수영장', '어린이 놀이터', '편의점', '카페'],
    amenities: ['에어컨', '냉장고', '세탁기', '전자레인지', 'TV', '인터넷'],
    area: '84㎡',
    rooms: 3,
    bathrooms: 2,
    floor: '15/20',
    direction: '남향',
    builtYear: '2023년',
    coordinates: [37.5010, 127.0374],
    latitude: 37.5010,
    longitude: 127.0374,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format'
    ],
    agent: {
      name: '김프로',
      company: '강남부동산',
      phone: '010-1234-5678',
      email: 'pro.kim@realestate.com'
    },
    // For compatibility with MapPage property cards
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format',
    location: '서울특별시 강남구 역삼동',
    size: '84㎡',
    type: '아파트',
    status: '노출중' // Add status for filtering in public pages
  },  {
    id: 2,
    title: '홍대 원룸 전세',
    price: '1억 5천',
    originalPrice: '1억 6천',
    discount: '1천만원(6.25%)',
    dealType: '전세',
    address: '서울특별시 마포구 홍익로 39',
    tags: ['원룸', '1룸', '1욕실'],
    description: '홍대입구역 도보 5분 거리의 깔끔한 원룸입니다. 풀옵션으로 생활하기 편리하며, 주변에 다양한 맛집과 카페가 있어 젊은 층에게 인기가 많습니다. 방음이 잘 되어 있어 조용하게 생활할 수 있으며, 관리사무소가 상주하고 있어 편리합니다.',
    options: ['풀옵션', '엘리베이터', '인터넷', '케이블TV'],
    facilities: ['세탁기', '냉장고', '전자레인지', '에어컨', '도시가스'],
    amenities: ['에어컨', '냉장고', '세탁기', '전자레인지', 'TV', '인터넷'],
    area: '25㎡',
    rooms: 1,
    bathrooms: 1,
    floor: '3/5',
    direction: '동향',
    builtYear: '2015년',
    coordinates: [37.5563, 126.9236],
    latitude: 37.5563,
    longitude: 126.9236,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format'
    ],
    agent: {
      name: '박상담',
      company: '홍대부동산',
      phone: '010-2345-6789',
      email: 'consult.park@realestate.com'
    },
    // For compatibility with MapPage property cards
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
    location: '서울특별시 마포구 홍익로',
    size: '25㎡',
    type: '원룸',
    status: '노출중' // Add status for filtering in public pages
  },
  {
    id: 3,
    title: '송파구 럭셔리 빌라',
    price: '월세 150/200',
    originalPrice: '월세 150/250',
    discount: '월세 50만원 할인',
    dealType: '월세',
    address: '서울특별시 송파구 잠실동 올림픽로 300',
    tags: ['빌라', '4룸', '3욕실'],
    description: '송파구 잠실동에 위치한 럭셔리 빌라로, 넓은 공간과 고급스러운 인테리어가 특징입니다. 대형 마트와 학교가 가까워 가족 단위 입주에 적합하며, 주변 녹지가 많아 쾌적한 환경에서 생활할 수 있습니다. 지하철역과 버스정류장이 가까워 교통이 매우 편리합니다.',
    options: ['주차 가능', '엘리베이터', '보안 시설', 'CCTV', '경비원 상주'],
    facilities: ['헬스장', '수영장', '어린이 놀이터', '편의점', '카페'],
    amenities: ['에어컨', '냉장고', '세탁기', '전자레인지', 'TV', '인터넷', '헬스장', '수영장'],
    area: '120㎡',
    rooms: 4,
    bathrooms: 3,
    floor: '2/3',
    direction: '남서향',
    builtYear: '2020년',
    coordinates: [37.5133, 127.1028],
    latitude: 37.5133,
    longitude: 127.1028,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format'
    ],
    agent: {
      name: '이럭셔리',
      company: '송파부동산',
      phone: '010-3456-7890',
      email: 'luxury.lee@realestate.com'
    },
    // For compatibility with MapPage property cards
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format',
    location: '서울특별시 송파구 잠실동',
    size: '120㎡',
    type: '빌라',
    status: '노출중' // Add status for filtering in public pages
  },
  {
    id: 4,
    title: '이태원 투룸 월세',
    price: '월세 50/100',
    dealType: '월세',
    address: '서울특별시 용산구 이태원로 27길 16',
    tags: ['오피스텔', '2룸', '1욕실'],
    description: '이태원 한가운데 위치한 투룸 오피스텔로, 외국인 거주객이 많은 지역이라 다문화 환경이 잘 조성되어 있습니다. 다양한 음식점과 술집이 즐비해 있어 야외 활동이 풍부하며, 지하철역이 가까워 교통이 편리합니다. 신축 건물로 관리가 잘 되고 있습니다.',
    options: ['풀옵션', '엘리베이터', '인터넷', '케이블TV'],
    facilities: ['세탁기', '냉장고', '전자레인지', '에어컨', '도시가스'],
    amenities: ['에어컨', '냉장고', '세탁기', '전자레인지', 'TV', '인터넷'],
    area: '45㎡',
    rooms: 2,
    bathrooms: 1,
    floor: '5/12',
    direction: '북향',
    builtYear: '2022년',
    coordinates: [37.5345, 126.9947],
    latitude: 37.5345,
    longitude: 126.9947,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format'
    ],
    agent: {
      name: '최글로벌',
      company: '이태원부동산',
      phone: '010-4567-8901',
      email: 'global.choi@realestate.com'
    },
    // For compatibility with MapPage property cards
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format',
    location: '서울특별시 용산구 이태원로',
    size: '45㎡',
    type: '오피스텔',
    status: '노출중' // Add status for filtering in public pages
  },
  {
    id: 5,
    title: '여의도 오피스텔',
    price: '2억 3천',
    dealType: '전세',
    address: '서울특별시 영등포구 여의도동 국제금융로 10',
    tags: ['오피스텔', '1룸', '1욕실'],
    description: '여의도역에서 도보로 10분 거리에 있는 오피스텔로, 금융업무지구와 가까워 직장인에게 인기가 많습니다. 주변에 다양한 편의시설이 있어 생활이 편리하며, 한강이 가까워 조망권과 채광이 뛰어납니다. 신축 건물로 최신 설비가 갖춰져 있습니다.',
    options: ['풀옵션', '엘리베이터', '인터넷', '케이블TV'],
    facilities: ['세탁기', '냉장고', '전자레인지', '에어컨', '도시가스'],
    amenities: ['에어컨', '냉장고', '세탁기', '전자레인지', 'TV', '인터넷'],
    area: '35㎡',
    rooms: 1,
    bathrooms: 1,
    floor: '20/45',
    direction: '서향',
    builtYear: '2021년',
    coordinates: [37.5219, 126.9245],
    latitude: 37.5219,
    longitude: 126.9245,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format'
    ],
    agent: {
      name: '정프로',
      company: '여의도부동산',
      phone: '010-5678-9012',
      email: 'pro.jung@realestate.com'
    },
    // For compatibility with MapPage property cards
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format',
    location: '서울특별시 영등포구 여의도동',
    size: '35㎡',
    type: '오피스텔',
    status: '노출중' // Add status for filtering in public pages
  }
];

// Mock function to get property by ID
export const getPropertyById = (id) => {
  const property = mockProperties.find(prop => prop.id === parseInt(id));
  
  // If property not found, return null
  if (!property) {
    return null;
  }
  
  // Ensure property has all required fields with safe defaults
  return {
    ...property,
    images: Array.isArray(property.images) ? property.images : [],
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    agent: property.agent || { name: '', phone: '', email: '' }
  };
};

// Mock function to get similar properties
export const getSimilarProperties = (propertyId, count = 4) => {
  // For simplicity, return the first N properties that aren't the current one
  const similar = mockProperties.filter(prop => prop.id !== propertyId).slice(0, count);
  return Array.isArray(similar) ? similar : [];
};