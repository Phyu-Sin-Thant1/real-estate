import React from 'react'

const MarketFeed = () => {
  const newsItems = [
    {
      id: 1,
      title: '서울 아파트 전세가 3개월 연속 상승',
      time: '2시간 전',
      icon: '📈'
    },
    {
      id: 2,
      title: '강남 재건축 단지 분양가 상한제 적용',
      time: '4시간 전',
      icon: '🏗️'
    },
    {
      id: 3,
      title: '정부, 부동산 규제 완화 방안 검토',
      time: '6시간 전',
      icon: '📋'
    },
    {
      id: 4,
      title: '경기도 신도시 개발 계획 발표',
      time: '8시간 전',
      icon: '🌆'
    },
    {
      id: 5,
      title: '금리 인하로 주택담보대출 증가세',
      time: '12시간 전',
      icon: '🏦'
    }
  ]

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
  ]

  return (
    <section className="py-16 bg-white border-t border-gray-200">
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
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="text-2xl mr-4 mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1 hover:text-dabang-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 text-dabang-primary font-medium hover:text-dabang-primary/80 transition-colors">
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
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200"
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