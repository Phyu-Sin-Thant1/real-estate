import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { usePropertySearch } from '../hooks/usePropertySearch'
import { useFavorites } from '../hooks/useFavorites'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'

const CategoryPage = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { isAuthenticated } = useUserAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  
  // Category tabs configuration
  const CATEGORY_TABS = [
    { key: "oneroom", label: "원룸/투룸" },
    { key: "apartment", label: "아파트" },
    { key: "officetel", label: "오피스텔" },
    { key: "villa", label: "빌라" },
    { key: "presale", label: "분양/신축" },
  ];
  
  // Slug to property type mapping
  const categoryMapping = {
    'oneroom': '원룸',
    'tworoom': '투룸',
    'apartment': '아파트',
    'villa': '빌라',
    'officetel': '오피스텔',
    'presale': '분양/신축'
  }
  
  const displayCategory = categoryMapping[categoryName] || categoryName || '매물'
  
  // State for filters from URL
  const [selectedDealType, setSelectedDealType] = useState(searchParams.get('dealType') || '전체')
  const [selectedRooms, setSelectedRooms] = useState(searchParams.get('rooms') || '전체')
  const [minArea, setMinArea] = useState(searchParams.get('minArea') || '')
  const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '최신순')
  
  // Parse options from URL
  useEffect(() => {
    const optionsParam = searchParams.get('options')
    if (optionsParam) {
      setSelectedOptions(optionsParam.split(','))
    }
  }, [])
  
  // Search hook with parameters
  const searchParamsObj = {
    propertyType: categoryMapping[categoryName],
    dealType: selectedDealType !== '전체' ? selectedDealType : undefined,
    rooms: selectedRooms !== '전체' ? selectedRooms : undefined,
    minArea: minArea ? parseInt(minArea) : undefined,
    maxArea: maxArea ? parseInt(maxArea) : undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    options: selectedOptions.length > 0 ? selectedOptions : undefined
  }
  
  const { data: properties, error } = usePropertySearch(searchParamsObj)
  
  // Apply sorting
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case '가격 낮은순':
        // Simple price comparison - in a real app, you'd parse the price strings properly
        return a.price.localeCompare(b.price, undefined, { numeric: true })
      case '가격 높은순':
        return b.price.localeCompare(a.price, undefined, { numeric: true })
      case '최신순':
      default:
        // Assuming properties have an id that represents creation order
        return b.id - a.id
    }
  })
  
  // Update URL when filters change
  const updateSearchParams = (newParams) => {
    const params = {}
    
    // Preserve existing params
    for (let [key, value] of searchParams.entries()) {
      params[key] = value
    }
    
    // Update with new params
    Object.keys(newParams).forEach(key => {
      if (newParams[key] !== undefined && newParams[key] !== '' && newParams[key] !== '전체') {
        params[key] = newParams[key]
      } else {
        delete params[key]
      }
    })
    
    setSearchParams(params)
  }
  
  const handleOptionToggle = (option) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(opt => opt !== option)
      : [...selectedOptions, option]
    
    setSelectedOptions(newOptions)
    updateSearchParams({ options: newOptions.join(',') })
  }
  
  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`)
  }
  
  const handleToggleFavorite = (propertyId) => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login')
      return
    }
    
    toggleFavorite(propertyId)
  }
  
  // For mock data, we don't need to show loading spinner since it's instant
  // Only show error state if there is an error
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">오류 발생</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
        <Footer />
      </div>
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
          <p className="text-sm text-gray-500">원하는 매물 유형을 바로 선택해보세요.</p>
        </div>
        
        {/* Category Tab Bar */}
        <div className="mt-4 flex flex-wrap gap-2 mb-6">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => navigate(`/category/${tab.key}`)}
              className={
                tab.key === categoryName
                  ? "px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white border border-indigo-600 shadow-sm"
                  : "px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
              }
            >
              {tab.label}
            </button>
          ))}
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
          {/* Deal Type Dropdown */}
          <div className="relative">
            <select
              value={selectedDealType}
              onChange={(e) => {
                setSelectedDealType(e.target.value)
                updateSearchParams({ dealType: e.target.value })
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              <option value="전체">거래유형: 전체</option>
              <option value="매매">매매</option>
              <option value="전세">전세</option>
              <option value="월세">월세</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Rooms Dropdown */}
          <div className="relative">
            <select
              value={selectedRooms}
              onChange={(e) => {
                setSelectedRooms(e.target.value)
                updateSearchParams({ rooms: e.target.value })
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              <option value="전체">방 개수: 전체</option>
              <option value="1">1개</option>
              <option value="2">2개</option>
              <option value="3">3개</option>
              <option value="4">4개 이상</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Area Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="최소 면적"
              value={minArea}
              onChange={(e) => {
                setMinArea(e.target.value)
                updateSearchParams({ minArea: e.target.value })
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <span className="text-gray-500">~</span>
            <input
              type="number"
              placeholder="최대 면적"
              value={maxArea}
              onChange={(e) => {
                setMaxArea(e.target.value)
                updateSearchParams({ maxArea: e.target.value })
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <span className="text-gray-500">㎡</span>
          </div>
          
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="최소 가격"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                updateSearchParams({ minPrice: e.target.value })
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <span className="text-gray-500">~</span>
            <input
              type="number"
              placeholder="최대 가격"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                updateSearchParams({ maxPrice: e.target.value })
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <span className="text-gray-500">만원</span>
          </div>
          
          {/* Sort Buttons */}
          <div className="flex gap-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                updateSearchParams({ sortBy: e.target.value })
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              <option value="최신순">최신순</option>
              <option value="가격 낮은순">가격 낮은순</option>
              <option value="가격 높은순">가격 높은순</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex gap-8">
          {/* Left Sidebar - Options Filter */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">옵션</h3>
              <div className="space-y-3">
                {['주차 가능', '엘리베이터', '풀옵션', '반려동물 가능', '보안 시설', 'CCTV', '관리비 포함'].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionToggle(option)}
                      className="w-4 h-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Main Content Grid */}
          <main className="flex-1">
            {sortedProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">조건에 맞는 매물이 없습니다</h3>
                <p className="text-gray-500 mb-6">
                  다른 조건으로 검색해보세요
                </p>
                <button
                  onClick={() => {
                    setSelectedDealType('전체')
                    setSelectedRooms('전체')
                    setMinArea('')
                    setMaxArea('')
                    setMinPrice('')
                    setMaxPrice('')
                    setSelectedOptions([])
                    setSortBy('최신순')
                    setSearchParams({})
                  }}
                  className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProperties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => handlePropertyClick(property.id)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group"
                    style={{ borderRadius: '12px' }}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Category Chip */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-dabang-primary">
                          {displayCategory}
                        </span>
                      </div>
                      {/* Favorite Heart Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(property.id)
                        }}
                        className='absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm'
                      >
                        <svg 
                          className={`w-4 h-4 ${isFavorite(property.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`} 
                          fill={isFavorite(property.id) ? 'currentColor' : 'none'} 
                          stroke='currentColor' 
                          viewBox='0 0 24 24'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="mb-3">
                        <span className="text-lg font-bold text-dabang-primary">
                          {property.price}
                        </span>
                      </div>
                      
                      {/* Location & Details */}
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.location}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{property.size}</span>
                        <span>{property.rooms}개 방</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination (optional) */}
            {sortedProperties.length > 0 && (
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
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default CategoryPage