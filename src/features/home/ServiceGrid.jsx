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
    <section className="w-full">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200/50 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">매물 유형 탐색</p>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            매물 유형 탐색
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            당신의 라이프스타일에 맞는 완벽한 매물 유형을 찾아보세요
          </p>
        </div>

        {/* Main Property Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
          {propertyTypes.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/category/${encodeURIComponent(property.title)}`)}
              className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden cursor-pointer h-full flex flex-col group"
            >
              {property.isNew && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold z-10 shadow-lg">
                  신규 매물
                </div>
              )}
              
              <div className={`bg-gradient-to-br ${property.color} w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                {property.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {property.title}
              </h3>
              
              <p className="text-slate-600 mb-4 flex-grow text-sm leading-relaxed">
                {property.description}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/category/${encodeURIComponent(property.title)}`)
                }}
                className="text-slate-700 font-semibold hover:text-indigo-600 transition-colors mt-auto flex items-center gap-1 group-hover:gap-2"
              >
                매물 보러가기 <span className="text-lg">→</span>
              </button>
            </div>
          ))}

          {/* Additional Service Banner */}
          <Link to="/moving-service" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl border-2 border-orange-400/30 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden cursor-pointer h-full flex flex-col col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1 group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start space-x-4 flex-grow relative z-10">
              <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">🚛</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">이사 서비스</h3>
                <p className="text-orange-100 mb-4 text-sm">1분 무료 견적으로 저렴한 이사 비용</p>
              </div>
            </div>
            <button className="bg-white text-orange-600 font-bold px-4 py-3 rounded-xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl mt-auto w-full h-12 group-hover:scale-105">
              견적 받기
            </button>
          </Link>
        </div>

        {/* Community/News Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                우리 동네 이야기
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                지역 주민들이 공유하는 이야기를 확인해보세요! 지역 인사이트, 로컬 팁, 동네 이야기로 현명한 결정을 내리세요.
              </p>
              <button 
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/community?tab=reviews")}
              >
                커뮤니티 탐색 →
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all border-2 border-slate-100 hover:border-blue-200 hover:-translate-y-1 hover:shadow-md group"
                onClick={() => navigate("/community?tab=news")}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📰</div>
                <h4 className="font-bold text-slate-900 mb-1.5">지역 뉴스</h4>
                <p className="text-sm text-slate-600">동네 개발 소식을 업데이트하세요</p>
              </div>
              <div 
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 cursor-pointer hover:bg-gradient-to-br hover:from-purple-50 hover:to-white transition-all border-2 border-slate-100 hover:border-purple-200 hover:-translate-y-1 hover:shadow-md group"
                onClick={() => navigate("/community?tab=chat")}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💬</div>
                <h4 className="font-bold text-slate-900 mb-1.5">커뮤니티 채팅</h4>
                <p className="text-sm text-slate-600">이웃과 지역 주민들과 소통하세요</p>
              </div>
              <div 
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 cursor-pointer hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white transition-all border-2 border-slate-100 hover:border-yellow-200 hover:-translate-y-1 hover:shadow-md group"
                onClick={() => navigate("/community?tab=reviews")}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⭐</div>
                <h4 className="font-bold text-slate-900 mb-1.5">리뷰</h4>
                <p className="text-sm text-slate-600">주민들의 실제 경험담</p>
              </div>
              <div 
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 cursor-pointer hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white transition-all border-2 border-slate-100 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-md group"
                onClick={() => navigate("/community?tab=tips")}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📍</div>
                <h4 className="font-bold text-slate-900 mb-1.5">로컬 팁</h4>
                <p className="text-sm text-slate-600">숨겨진 명소와 추천 장소</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceGrid