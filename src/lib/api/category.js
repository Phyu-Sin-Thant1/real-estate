// Mock API functions for category data
export const categoryApi = {
  getCategories: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock category data
    const mockCategories = [
      {
        id: 1,
        name: '아파트',
        icon: '🏢',
        count: 1240,
        description: '전체 아파트 매물'
      },
      {
        id: 2,
        name: '빌라',
        icon: '🏠',
        count: 890,
        description: '단독 및 다가구 빌라'
      },
      {
        id: 3,
        name: '오피스텔',
        icon: '🏢',
        count: 650,
        description: '상가형 생활숙박시설'
      },
      {
        id: 4,
        name: '원룸',
        icon: '🛏️',
        count: 1420,
        description: '싱글 라이프를 위한 방'
      },
      {
        id: 5,
        name: '투룸',
        icon: '🛋️',
        count: 980,
        description: '커플 및 싱글을 위한 방'
      },
      {
        id: 6,
        name: '쓰리룸 이상',
        icon: '👨‍👩‍👧‍👦',
        count: 760,
        description: '가족을 위한 넓은 공간'
      }
    ];
    
    return {
      success: true,
      data: mockCategories
    };
  },
  
  getCategoryById: async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock specific category data
    const categories = {
      1: {
        id: 1,
        name: '아파트',
        icon: '🏢',
        count: 1240,
        description: '전체 아파트 매물',
        popularAreas: ['강남구', '서초구', '송파구', '용산구', '마포구']
      },
      2: {
        id: 2,
        name: '빌라',
        icon: '🏠',
        count: 890,
        description: '단독 및 다가구 빌라',
        popularAreas: ['서초구', '용산구', '마포구', '종로구', '성동구']
      }
    };
    
    return {
      success: true,
      data: categories[id] || null
    };
  }
};