import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const EnhancedSearchHero = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/category/all?q=${searchQuery}`)
    }
  }

  const handleTagClick = (location) => {
    setSearchQuery(location.name)
    setActiveTag(location.name)
    navigate(`/map?area=${location.name}`)
  }

  return (
    <section className="relative min-h-[650px] bg-gradient-to-br from-[#0B163F] via-[#1A237E] to-[#1D2E7A] overflow-hidden m-0 mt-0 pt-0" style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Radial highlight behind search area */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent pointer-events-none" 
           style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
      
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center min-h-[500px]">
          {/* Left Column: Search & Action */}
          <div className="lg:col-span-3 space-y-6">
            <div className="text-left">
              <p className="text-base md:text-lg text-white/80 font-normal font-body mb-4">
                {t('home.hero.eyebrow')}
              </p>
            </div>

            <div className="text-left max-w-[720px]">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 font-display leading-[1.05] tracking-tight">
                <span className="break-keep">{t('home.hero.title').replace('요!', '\u00A0요!')}</span>
              </h1>
              
              <p className="text-base md:text-lg text-white/80 mb-8 font-normal font-body max-w-xl">
                {t('home.hero.subtitle')}
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-lg">
              <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-2 group focus-within:ring-2 focus-within:ring-white/30 focus-within:shadow-2xl transition-all">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="p-3 text-gray-400 hover:text-dabang-primary transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder={t('home.searchPlaceholder')}
                    className="flex-1 px-2 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent font-normal font-body"
                  />
                </div>
              </div>
            </form>

            {/* Primary CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/category/all')}
                className="h-12 px-6 bg-white text-dabang-primary rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                매물 검색
              </button>
              <button
                onClick={() => navigate('/moving')}
                className="h-12 px-6 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/20 transition-all font-medium"
              >
                이사 견적 받기
              </button>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap gap-3 max-w-2xl">
              {[
                { name: '강남역', icon: '🚇', type: 'subway' },
                { name: '홍대입구역', icon: '🚇', type: 'subway' },
                { name: '이태원구', icon: '🏙️', type: 'district' },
                { name: '명동역', icon: '🚇', type: 'subway' },
              ].map((location) => {
                const isActive = activeTag === location.name
                return (
                  <button
                    key={location.name}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap font-body ${
                      isActive
                        ? 'bg-dabang-accent text-white border-dabang-accent shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:border-white/30'
                    }`}
                    onClick={() => handleTagClick(location)}
                  >
                    <span className="text-base">{location.icon}</span>
                    <span>{location.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Market Data Snapshot */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 font-display">
                오늘의 부동산 시세
              </h3>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-2 font-body">
                    서울 아파트 평균 전세가
                  </p>
                  <p className="text-3xl font-bold text-gray-900 font-display">
                    5억 2천만 원
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm font-medium flex items-center font-body">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      +2.3%
                    </span>
                    <span className="text-gray-500 text-sm ml-2 font-body">전주 대비</span>
                  </div>
                </div>

                <div className="pb-4">
                  <p className="text-sm text-gray-600 mb-2 font-body">
                    금주 거래량
                  </p>
                  <p className="text-3xl font-bold text-gray-900 font-display">
                    3,847건
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-red-600 text-sm font-medium flex items-center font-body">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      -5.2%
                    </span>
                    <span className="text-gray-500 text-sm ml-2 font-body">전주 대비</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => navigate("/price-trends")}
                  className="w-full h-12 bg-dabang-primary hover:bg-dabang-primary/90 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  {t('home.priceMore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EnhancedSearchHero

