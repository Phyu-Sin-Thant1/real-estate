// Mock API functions for property data
export const propertyApi = {
  getProperties: async (filters = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock property data
    const mockProperties = [
      {
        id: 1,
        title: '강남구 신축 아파트',
        price: '12억',
        location: '강남구 역삼동 테헤란로 152',
        type: '매매',
        size: '84㎡',
        floor: '15/20쉰',
        maintenance: '관리비 35만원',
        rooms: '3룸',
        coordinates: [37.5010, 127.0374],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: 2,
        title: '홍대 원룸 전세',
        price: '1억 5천',
        location: '마포구 홍익로 39',
        type: '전세',
        size: '25㎡',
        floor: '3/5쉰',
        maintenance: '관리비 8만원',
        rooms: '1룸',
        coordinates: [37.5563, 126.9236],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: 3,
        title: '송파구 럭셔리 빌라',
        price: '18억',
        location: '송파구 잠실동 올림픽로 300',
        type: '매매',
        size: '120㎡',
        floor: '2/3쉰',
        maintenance: '관리비 45만원',
        rooms: '4룸',
        coordinates: [37.5133, 127.1028],
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: 4,
        title: '이태원 투룸 월세',
        price: '150/200',
        location: '용산구 이태원로 27길 16',
        type: '월세',
        size: '45㎡',
        floor: '5/12쉰',
        maintenance: '관리비 12만원',
        rooms: '2룸',
        coordinates: [37.5345, 126.9947],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: 5,
        title: '여의도 오피스텔',
        price: '2억 3천',
        location: '영등포구 여의도동 국제금융로 10',
        type: '전세',
        size: '35㎡',
        floor: '20/45쉰',
        maintenance: '관리비 15만원',
        rooms: '원룸',
        coordinates: [37.5219, 126.9245],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: 6,
        title: '강남 타워팩리스 효령로',
        price: '25억',
        location: '서초구 효령로 335',
        type: '매매',
        size: '98㎡',
        floor: '33/42쉰',
        maintenance: '관리비 55만원',
        rooms: '3룸',
        coordinates: [37.4909, 127.0657],
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop&auto=format'
      }
    ];
    
    // Apply filters if provided
    let filteredProperties = mockProperties;
    
    if (filters.dealType) {
      filteredProperties = filteredProperties.filter(p => p.type === filters.dealType);
    }
    
    if (filters.propertyType) {
      // Simplified filtering logic
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(filters.propertyType.toLowerCase()) ||
        p.type.toLowerCase().includes(filters.propertyType.toLowerCase())
      );
    }
    
    if (filters.region) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.includes(filters.region)
      );
    }
    
    return {
      success: true,
      data: filteredProperties,
      totalCount: filteredProperties.length
    };
  },
  
  getPropertyById: async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a specific property
    const property = {
      id: id,
      title: '강남구 신축 아파트',
      price: '12억',
      location: '강남구 역삼동 테헤란로 152',
      type: '매매',
      size: '84㎡',
      floor: '15/20쉰',
      maintenance: '관리비 35만원',
      rooms: '3룸',
      coordinates: [37.5010, 127.0374],
      description: '강남역 도보 5분 거리의 신축 아파트입니다. 현대적인 설계와 우수한 접근성을 자랑합니다.',
      features: ['에어컨', '냉장고', '세탁기', '전자레인지', '인터넷'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format'
      ]
    };
    
    return {
      success: true,
      data: property
    };
  }
};