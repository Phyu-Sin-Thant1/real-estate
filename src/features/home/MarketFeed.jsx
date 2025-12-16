import React from 'react';
import { useNavigate } from 'react-router-dom';
import { newsData } from '../../mock/newsData';

const MarketFeed = () => {
  // Get the first 5 news items sorted by newest first
  const newsItems = [...newsData]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const marketStats = [
    {
      id: 1,
      label: '서울 평균 전세가',
      value: '5억 2천만 원',
      change: '+2.3%',
      isPositive: true,
      icon: '🏠'
    },
    {
      id: 2,
      label: '금주 신규 매물',
      value: '1,200건',
      change: '+15%',
      isPositive: true,
      icon: '📊'
    },
    {
      id: 3,
      label: '평균 매매가격',
      value: '12억 8천만 원',
      change: '+1.8%',
      isPositive: true,
      icon: '💰'
    },
    {
      id: 4,
      label: '주간 거래량',
      value: '3,847건',
      change: '-5.2%',
      isPositive: false,
      icon: '📋'
    }
  ];

  const navigate = useNavigate();

  // Format date to relative time (hardcoded for mock data)
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}일 전`;
    return `${Math.floor(diffInDays / 30)}달 전`;
  };

  return (
    <section className="py-16 bg-white border-t border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Real Estate News */}
          <div>
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3">📰</div>
              <h3 className="text-2xl font-bold text-gray-900">
                오늘의 부동산 소식
              </h3>
            </div>
            
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dabang-primary/10 flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-dabang-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 hover:text-dabang-primary transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{formatRelativeTime(item.createdAt)}</p>
                  </div>
                  <div className="flex-shrink-0 text-gray-400 ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="mt-6 text-dabang-primary font-medium hover:text-dabang-primary/80 transition-colors"
              onClick={() => navigate('/community?tab=news')}
            >
              모든 뉴스 보기 →
            </button>
          </div>

          {/* Right Column - Market Statistics */}
          <div>
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3">📊</div>
              <h3 className="text-2xl font-bold text-gray-900">
                실시간 시세 정보
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {marketStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{stat.icon}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.isPositive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    {stat.label}
                  </h4>
                  
                  <p className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-dabang-primary to-blue-700 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2">시세 알림 서비스</h4>
                  <p className="text-blue-100 text-sm">관심 지역의 실시간 시세 변동을 알려드립니다</p>
                </div>
                <button className="bg-white text-dabang-primary font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  알림 설정
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketFeed