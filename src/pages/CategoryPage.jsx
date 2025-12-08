import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CategoryPage = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  
  // Category name mapping
  const categoryMap = {
    '원룸/투룸': '원룸/투룸',
    '아파트': '아파트',
    '오피스텔': '오피스텔',
    '단독주택/빌라': '단독주택/빌라',
    '분양/신축': '분양/신축'
  }
  
  const displayCategory = categoryMap[categoryName] || categoryName || '매물'
  
  // State for filters
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [selectedPriceRange, setSelectedPriceRange] = useState('전체')
  const [selectedOptions, setSelectedOptions] = useState('전체')
  const [sortBy, setSortBy] = useState('최신순')
  
  // State for sidebar filters
  const [expandedFilters, setExpandedFilters] = useState({
    rooms: true,
    area: false,
    options: false,
    deposit: false
  })
  
  const [roomCount, setRoomCount] = useState([])
  const [minArea, setMinArea] = useState(0)
  const [maxArea, setMaxArea] = useState(200)
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [depositRange, setDepositRange] = useState([0, 100000])
  const [monthlyRentRange, setMonthlyRentRange] = useState([0, 200])
  
  // Sample property data
  const properties = [
    {
      id: 1,
      title: '서울 강남구 역삼동 원룸 풀옵션',
      description: '역삼역 도보 5분, 깔끔한 원룸',
      price: '보증금 1,000만원 / 월세 50만원',
      thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      location: '서울 강남구 역삼동',
      rooms: '1',
      area: '18평',
      features: ['풀옵션', '엘리베이터', '주차장'],
      views: 1234,
      rating: 4.5
    },
    {
      id: 2,
      title: '서울 서초구 서초동 투룸',
      description: '서초역 인근, 조용한 주거환경',
      price: '보증금 2,000만원 / 월세 80만원',
      thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      location: '서울 서초구 서초동',
      rooms: '2',
      area: '28평',
      features: ['풀옵션', '엘리베이터'],
      views: 987,
      rating: 4.3
    },
    {
      id: 3,
      title: '서울 송파구 잠실동 아파트',
      description: '잠실역 도보 3분, 넓은 거실',
      price: '보증금 5,000만원 / 월세 120만원',
      thumbnail: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=300&fit=crop',
      location: '서울 송파구 잠실동',
      rooms: '3',
      area: '45평',
      features: ['풀옵션', '엘리베이터', '주차장', '관리실'],
      views: 2156,
      rating: 4.7
    },
    {
      id: 4,
      title: '서울 마포구 상암동 오피스텔',
      description: '상암동 신축 오피스텔, 풀옵션',
      price: '보증금 3,000만원 / 월세 100만원',
      thumbnail: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',
      location: '서울 마포구 상암동',
      rooms: '1',
      area: '22평',
      features: ['풀옵션', '엘리베이터', '주차장'],
      views: 1456,
      rating: 4.4
    },
    {
      id: 5,
      title: '서울 강동구 천호동 빌라',
      description: '단독주택 느낌의 넓은 빌라',
      price: '보증금 4,000만원 / 월세 90만원',
      thumbnail: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
      location: '서울 강동구 천호동',
      rooms: '3',
      area: '35평',
      features: ['풀옵션', '주차장'],
      views: 876,
      rating: 4.2
    },
    {
      id: 6,
      title: '서울 영등포구 여의도동 원룸',
      description: '여의도 한강뷰 원룸',
      price: '보증금 1,500만원 / 월세 60만원',
      thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
      location: '서울 영등포구 여의도동',
      rooms: '1',
      area: '20평',
      features: ['풀옵션', '엘리베이터'],
      views: 1890,
      rating: 4.6
    },
    {
      id: 7,
      title: '서울 종로구 명륜동 아파트',
      description: '대학로 인근 조용한 아파트',
      price: '보증금 6,000만원 / 월세 150만원',
      thumbnail: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767e?w=400&h=300&fit=crop',
      location: '서울 종로구 명륜동',
      rooms: '4',
      area: '55평',
      features: ['풀옵션', '엘리베이터', '주차장', '관리실'],
      views: 1123,
      rating: 4.5
    },
    {
      id: 8,
      title: '서울 강북구 수유동 투룸',
      description: '수유역 도보 7분, 저렴한 월세',
      price: '보증금 1,200만원 / 월세 45만원',
      thumbnail: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&h=300&fit=crop',
      location: '서울 강북구 수유동',
      rooms: '2',
      area: '25평',
      features: ['풀옵션'],
      views: 654,
      rating: 4.1
    },
    {
      id: 9,
      title: '서울 노원구 상계동 오피스텔',
      description: '상계역 인근 신축 오피스텔',
      price: '보증금 2,500만원 / 월세 70만원',
      thumbnail: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop',
      location: '서울 노원구 상계동',
      rooms: '1',
      area: '19평',
      features: ['풀옵션', '엘리베이터', '주차장'],
      views: 432,
      rating: 4.0
    }
  ]
  
  const regions = ['전체', '강남구', '서초구', '송파구', '마포구', '강동구', '영등포구', '종로구', '강북구', '노원구']
  const priceRanges = ['전체', '월세 50만원 이하', '월세 50-100만원', '월세 100-150만원', '월세 150만원 이상']
  const optionTypes = ['전체', '풀옵션', '엘리베이터', '주차장', '관리실']
  
  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }
  
  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }
  
  const toggleRoomCount = (count) => {
    setRoomCount(prev => 
      prev.includes(count)
        ? prev.filter(c => c !== count)
        : [...prev, count]
    )
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayCategory}
          </h1>
        </div>
        
        {/* Category Menu Buttons (Naver-style) */}
        <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200">
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            가장 인기 있는 카테고리
          </button>
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            추천 필터
          </button>
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            인기 옵션
          </button>
        </div>
        
        {/* Sub-filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          {/* Region Dropdown */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              {regions.map(region => (
                <option key={region} value={region}>지역: {region}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Price Range Dropdown */}
          <div className="relative">
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>가격: {range}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Options Dropdown */}
          <div className="relative">
            <select
              value={selectedOptions}
              onChange={(e) => setSelectedOptions(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              {optionTypes.map(option => (
                <option key={option} value={option}>구조/옵션: {option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Sort Buttons */}
          <div className="flex gap-2 ml-auto">
            {['최신순', '인기순', '가격순'].map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === sort
                    ? 'bg-dabang-primary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              {/* 방 개수 Filter */}
              <div>
                <button
                  onClick={() => toggleFilter('rooms')}
                  className="w-full flex items-center justify-between text-gray-900 font-semibold mb-3"
                >
                  <span>방 개수</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedFilters.rooms ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFilters.rooms && (
                  <div className="space-y-2">
                    {['1', '2', '3', '4+'].map(count => (
                      <label key={count} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roomCount.includes(count)}
                          onChange={() => toggleRoomCount(count)}
                          className="w-4 h-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">{count}개</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 전용면적 Filter */}
              <div>
                <button
                  onClick={() => toggleFilter('area')}
                  className="w-full flex items-center justify-between text-gray-900 font-semibold mb-3"
                >
                  <span>전용면적</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedFilters.area ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFilters.area && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{minArea}평</span>
                      <span>{maxArea}평</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={maxArea}
                      onChange={(e) => setMaxArea(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              
              {/* 옵션 Filter */}
              <div>
                <button
                  onClick={() => toggleFilter('options')}
                  className="w-full flex items-center justify-between text-gray-900 font-semibold mb-3"
                >
                  <span>옵션</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedFilters.options ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFilters.options && (
                  <div className="space-y-2">
                    {['풀옵션', '엘리베이터', '주차장', '관리실'].map(feature => (
                      <label key={feature} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="w-4 h-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 보증금/월세 Filter */}
              <div>
                <button
                  onClick={() => toggleFilter('deposit')}
                  className="w-full flex items-center justify-between text-gray-900 font-semibold mb-3"
                >
                  <span>보증금/월세</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedFilters.deposit ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFilters.deposit && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">보증금 (만원)</label>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{depositRange[0].toLocaleString()}만원</span>
                        <span>{depositRange[1].toLocaleString()}만원</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        value={depositRange[1]}
                        onChange={(e) => setDepositRange([depositRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">월세 (만원)</label>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{monthlyRentRange[0]}만원</span>
                        <span>{monthlyRentRange[1]}만원</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={monthlyRentRange[1]}
                        onChange={(e) => setMonthlyRentRange([monthlyRentRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
          
          {/* Main Content Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group"
                  style={{ borderRadius: '12px' }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={property.thumbnail}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Chip */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-dabang-primary">
                        {displayCategory}
                      </span>
                    </div>
                    {/* Views Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {property.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {property.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-lg font-bold text-dabang-primary">
                        {property.price}
                      </span>
                    </div>
                    
                    {/* Features Icons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {property.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination (optional) */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                이전
              </button>
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-dabang-primary text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                다음
              </button>
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default CategoryPage

