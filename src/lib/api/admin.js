// Mock API functions for admin data
export const adminApi = {
  getDashboardStats: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock dashboard stats
    const mockStats = [
      {
        label: '총 기사 수',
        value: '1,284',
        delta: '+12.4%',
        tone: 'up',
        description: '지난 30일간 뉴스 및 시장 커버리지',
        emoji: '📰'
      },
      {
        label: '활성 매물',
        value: '842',
        delta: '+5.6%',
        tone: 'up',
        description: '렌탈 및 판매 중인 실시간 목록',
        emoji: '🏡'
      },
      {
        label: '검증된 회사',
        value: '312',
        delta: '+3.2%',
        tone: 'up',
        description: '에이전시 및 개발자 계정',
        emoji: '🏢'
      },
      {
        label: '일일 활성 사용자',
        value: '24,560',
        delta: '+9.8%',
        tone: 'up',
        description: 'KR/MM/EN 간 언어 트래픽',
        emoji: '👥'
      },
      {
        label: '승인 대기',
        value: '37',
        delta: '-4.1%',
        tone: 'down',
        description: '검토를 기다리는 리뷰',
        emoji: '⏳'
      },
      {
        label: '광고 수익',
        value: '₩58.2M',
        delta: '+18.5%',
        tone: 'up',
        description: '프로그램 및 네이티브 (월간)',
        emoji: '💰'
      }
    ];
    
    return {
      success: true,
      data: mockStats
    };
  },
  
  getNewsArticles: async (filters = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock news articles
    const mockNews = [
      {
        id: 'news-1042',
        title: '서울 럭셔리 타워 완공 2단계 확장',
        category: '부동산',
        author: '민지 박',
        publishedAt: '2025-11-10',
        status: 'Published',
        thumbnail: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=240&q=80'
      },
      {
        id: 'news-1041',
        title: '강남 상업 임대 요금 상승',
        category: '경제',
        author: '성호 김',
        publishedAt: '2025-11-08',
        status: 'Draft',
        thumbnail: 'https://images.unsplash.com/photo-1529429617124-aee111b4d5f4?auto=format&fit=crop&w=240&q=80'
      },
      {
        id: 'news-1040',
        title: '정부 주택 대출 보조금 업데이트',
        category: '정치',
        author: '하나 최',
        publishedAt: '2025-11-05',
        status: 'Published',
        thumbnail: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=240&q=80'
      },
      {
        id: 'news-1039',
        title: '스마트 홈 채택률 새 단지에서 두 배 증가',
        category: '기술',
        author: '그레이스 리',
        publishedAt: '2025-10-31',
        status: 'Published',
        thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=240&q=80'
      }
    ];
    
    // Apply filters if provided
    let filteredNews = mockNews;
    
    if (filters.category && filters.category !== 'All') {
      filteredNews = filteredNews.filter(article => article.category === filters.category);
    }
    
    if (filters.status && filters.status !== 'All') {
      filteredNews = filteredNews.filter(article => article.status === filters.status);
    }
    
    return {
      success: true,
      data: filteredNews,
      totalCount: filteredNews.length
    };
  },
  
  createNewsArticle: async (articleData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: '기사가 성공적으로 생성되었습니다.',
      data: {
        id: `news-${Date.now()}`,
        ...articleData
      }
    };
  },
  
  updateNewsArticle: async (id, articleData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: '기사가 성공적으로 업데이트되었습니다.',
      data: {
        id,
        ...articleData
      }
    };
  },
  
  deleteNewsArticle: async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: '기사가 성공적으로 삭제되었습니다.'
    };
  }
};