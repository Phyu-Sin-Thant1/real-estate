import React, { useState } from 'react'

const SearchHero = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery)
    }
  }

  const handleIconClick = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const handleTagClick = (location) => {
    setSearchQuery(location.name)
    setActiveTag(location.name)
    // Simulate loading results or opening map
    console.log('Loading results for:', location.name)
  }

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-gray-900 via-blue-900 to-dabang-primary overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(26, 35, 126, 0.6)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyMCIgeTI9IjEwODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMUEyMzdFIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzc0MUE5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')`
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center min-h-[400px]">
          {/* Left Column: Search & Action (60% Width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Top Tagline */}
            <div className="text-left">
              <p className="text-lg text-white/80 font-normal font-body mb-4">
                복잡한 부동산 정보, 이제 그만.
              </p>
            </div>

            {/* Main Title */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white mb-4 font-display leading-tight">
                당신에게 꺼 맞는 집을 찾으세요!
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 mb-6 font-normal font-body leading-relaxed">
                빅데이터 기반의 추천과 실시간 시세 정보로 스마트하게 결정하세요.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-lg">
              <div className="search-bar-pill group relative shadow-2xl">
                {/* Search Icon */}
                <button
                  type="button"
                  onClick={handleIconClick}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 search-icon-button z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* Input Field */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="지역, 지하철, 대학, 단지명 또는 매물번호를 입력해주세요"
                  className="w-full pl-6 pr-16 py-3 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent focus:ring-0 text-left placeholder:text-left font-normal font-body"
                />
              </div>
            </form>

            {/* New Listings Counter */}
            <div className="text-left">
              <p className="text-sm md:text-base text-white font-semibold font-body flex items-center">
                <span className="mr-2">🔥</span>
                오늘 등록된 신규 매물 358건
              </p>
            </div>

            {/* Trending Searches Header */}
            <div className="text-left">
              <h3 className="text-white/90 text-sm font-medium mb-3 font-body">
                인기 급상승 검색어
              </h3>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap gap-3 max-w-2xl">
              {[
                { name: '강남역', icon: '🚇', type: 'subway' },
                { name: '홍대입구역', icon: '🚇', type: 'subway' },
                { name: '이태원구', icon: '🏙️', type: 'district' },
                { name: '명동역', icon: '🚇', type: 'subway' },
                { name: '신촌역', icon: '🚇', type: 'subway' },
                { name: '서초구', icon: '🏙️', type: 'district' }
              ].map((location) => {
                const isActive = activeTag === location.name
                return (
                  <button
                    key={location.name}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap font-body ${
                      isActive
                        ? 'bg-dabang-accent text-white border-dabang-accent shadow-lg'
                        : 'bg-dabang-accent/20 text-white border-dabang-accent/30 hover:bg-dabang-accent hover:border-dabang-accent backdrop-blur-sm'
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

          {/* Right Column: Market Data Snapshot (40% Width) */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                오늘의 부동산 시세
              </h3>
              
              <div className="space-y-6">
                {/* Metric 1 */}
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

                {/* Metric 2 */}
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

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors font-body">
                  시세 더보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchHero