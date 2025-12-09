import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ServiceGrid = () => {
  const navigate = useNavigate()
  
  const propertyTypes = [
    {
      id: 1,
      title: '원룸/투룸',
      description: '싱글과 커플에게 완벽한 공간',
      icon: '🏠',
      isNew: false,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      title: '아파트',
      description: '가족 친화적인 주거 공간',
      icon: '🏢',
      isNew: true,
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      title: '단독주택/빌라',
      description: '프라이버시가 보장된 넓은 주택',
      icon: '🏘️',
      isNew: false,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      title: '오피스텔',
      description: '현대적인 사무실-주거 복합 공간',
      icon: '🏬',
      isNew: false,
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 5,
      title: '분양/신축',
      description: '새로운 건설 기회',
      icon: '🏗️',
      isNew: false,
      color: 'from-red-400 to-red-600'
    }
  ]

  return (
    <section className="py-16 bg-dabang-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            매물 유형 탐색
          </h2>
          <p className="text-lg text-gray-600">
            당신의 라이프스타일에 맞는 완벽한 매물 유형을 찾아보세요
          </p>
        </div>

        {/* Main Property Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {propertyTypes.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/category/${encodeURIComponent(property.title)}`)}
              className="category-card hover:scale-105 transform transition-all duration-200 relative overflow-hidden cursor-pointer"
            >
              {property.isNew && (
                <div className="absolute top-4 right-4 bg-dabang-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                  신규 매물
                </div>
              )}
              
              <div className={`bg-gradient-to-br ${property.color} w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {property.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {property.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {property.description}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/category/${encodeURIComponent(property.title)}`)
                }}
                className="text-dabang-primary font-medium hover:text-dabang-primary/80 transition-colors"
              >
                매물 보러가기 →
              </button>
            </div>
          ))}

          {/* Additional Service Banner */}
          <Link to="/moving-service" className="category-card bg-gradient-to-br from-dabang-secondary to-orange-600 text-white col-span-1 md:col-span-2 lg:col-span-1 hover:scale-105 transform transition-all duration-200 relative overflow-hidden cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🚛</div>
              <div>
                <h3 className="text-xl font-bold mb-2">이사 서비스</h3>
                <p className="text-orange-100 mb-4">1분 무료 견적으로 저렴한 이사 비용</p>
                <button className="bg-white text-dabang-secondary font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  견적 받기
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Community/News Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                우리 동네 이야기
              </h3>
              <p className="text-gray-600 mb-6">
                지역 주민들이 공유하는 이야기를 확인해보세요! 지역 인사이트, 로컬 팁, 동네 이야기로 현명한 결정을 내리세요.
              </p>
              <button 
                className="btn-primary"
                onClick={() => navigate("/community?tab=reviews")}
              >
                커뮤니티 탐색
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/community?tab=news")}
              >
                <div className="text-2xl mb-2">📰</div>
                <h4 className="font-medium text-gray-900 mb-1">지역 뉴스</h4>
                <p className="text-sm text-gray-600">동네 개발 소식을 업데이트하세요</p>
              </div>
              <div 
                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/community?tab=chat")}
              >
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-medium text-gray-900 mb-1">커뮤니티 채팅</h4>
                <p className="text-sm text-gray-600">이웃과 지역 주민들과 소통하세요</p>
              </div>
              <div 
                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/community?tab=reviews")}
              >
                <div className="text-2xl mb-2">⭐</div>
                <h4 className="font-medium text-gray-900 mb-1">리뷰</h4>
                <p className="text-sm text-gray-600">주민들의 실제 경험담</p>
              </div>
              <div 
                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/community?tab=tips")}
              >
                <div className="text-2xl mb-2">📍</div>
                <h4 className="font-medium text-gray-900 mb-1">로컬 팁</h4>
                <p className="text-sm text-gray-600">숨겨진 명소와 추천 장소</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceGrid