import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import InteractiveMap from '../features/map/InteractiveMap'
import MapErrorBoundary from '../components/MapErrorBoundary'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'
import { usePropertySearch } from '../hooks/usePropertySearch'
import { useFavorites } from '../hooks/useFavorites'

const MapSearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearchSubmit, 
  selectedDealType, 
  setSelectedDealType,
  selectedPropertyType,
  setSelectedPropertyType,
  updateSearchParams
}) => {
  return (
    <div className='z-10 w-full px-4'>
      <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
        {/* Search Input Area */}
        <div className='px-6 pt-4 pb-3'>
          <form onSubmit={handleSearchSubmit} className='flex items-center'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='지역, 지하철역, 아파트명으로 검색'
                className='w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent text-center placeholder:text-center text-gray-700'
              />
              <button 
                type='submit'
                className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors'
              >
                <svg className='w-5 h-5 text-gray-400 hover:text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Visual Separator */}
        <div className='px-6'>
          <div className='h-px bg-gray-100'></div>
        </div>
        
        {/* Filter Buttons Area */}
        <div className='px-6 py-4'>
          <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide'>
            {/* Deal Type Group */}
            <div className='flex gap-2 flex-shrink-0'>
              {['전체', '매매', '전세', '월세'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedDealType(filter)
                    updateSearchParams({ dealType: filter })
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedDealType === filter
                      ? 'bg-dabang-primary text-white shadow-md border-0'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Subtle Separator */}
            <div className='w-px h-6 bg-gray-200 flex-shrink-0'></div>
            
            {/* Property Type Group */}
            <div className='flex gap-2 flex-shrink-0'>
              {['전체', '원룸', '투룸', '아파트', '빌라', '오피스텔'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedPropertyType(filter)
                    updateSearchParams({ propertyType: filter })
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedPropertyType === filter
                      ? 'bg-dabang-primary text-white shadow-md border-0'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Dedicated Advanced Filter Button */}
            <div className='flex items-center ml-auto flex-shrink-0'>
              <button className='px-4 py-2 bg-dabang-secondary text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
                </svg>
                <span>필터</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapPropertyCard = ({ 
  property, 
  isFavorite, 
  handleToggleFavorite, 
  handlePropertyDetail,
  isAuthenticated,
  navigate
}) => {
  return (
    <div className='mx-4 my-4 bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-100'>
      {/* Property Image */}
      <div className='relative h-48 overflow-hidden'>
        <img 
          src={property.image} 
          alt={property.title}
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
        />
        
        {/* Property Type Label */}
        <span className='absolute top-3 left-3 px-3 py-1 bg-dabang-primary text-white rounded-full text-xs font-medium'>
          {property.type}
        </span>
        
        {/* Favorite Heart Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            if (!isAuthenticated) {
              navigate('/login')
              return
            }
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
      
      {/* Property Content */}
      <div className='p-5'>
        {/* Price and Title */}
        <div className='mb-3'>
          <div className='mb-2'>
            <span className='text-2xl font-bold text-dabang-primary'>
              {property.price}
            </span>
          </div>
          
          <h3 
            className='text-lg font-semibold text-gray-900 leading-tight hover:text-dabang-primary transition-colors'
            onClick={(e) => {
              e.stopPropagation()
              handlePropertyDetail(property.id)
            }}
          >
            {property.title}
          </h3>
        </div>
        
        {/* Location */}
        <p className='text-sm text-gray-600 mb-4 flex items-center'>
          <svg className='w-4 h-4 mr-2 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
          </svg>
          {property.location}
        </p>
        
        {/* Property Specs */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div className='flex items-center space-x-2 text-sm'>
            <span className='text-gray-500'>크기</span>
            <p className='font-medium text-gray-800'>{property.size}</p>
          </div>
          
          <div className='flex items-center space-x-2 text-sm'>
            <span className='text-gray-500'>방</span>
            <p className='font-medium text-gray-800'>{property.rooms}</p>
          </div>
          
          <div className='flex items-center space-x-2 text-sm'>
            <span className='text-gray-500'>층</span>
            <p className='font-medium text-gray-800'>{property.floor}</p>
          </div>
          
          <div className='flex items-center space-x-2 text-sm'>
            <span className='text-gray-500'>관리비</span>
            <p className='font-medium text-gray-800'>
              {property.maintenance || '정보 없음'}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className='flex space-x-3'>
          <button 
            onClick={() => handlePropertyDetail(property.id)}
            className='flex-1 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors text-sm'
          >
            상세보기
          </button>
          <button className='px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact property card for grid view
const MapPropertyCardCompact = ({ 
  property, 
  isFavorite, 
  handleToggleFavorite, 
  handlePropertyDetail,
  isAuthenticated,
  navigate
}) => {
  return (
    <div className='bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-100'>
      {/* Property Image */}
      <div className='relative h-32 overflow-hidden'>
        <img 
          src={property.image} 
          alt={property.title}
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
        />
        
        {/* Property Type Label */}
        <span className='absolute top-2 left-2 px-2 py-1 bg-dabang-primary text-white rounded-full text-xs font-medium'>
          {property.type}
        </span>
        
        {/* Favorite Heart Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            if (!isAuthenticated) {
              navigate('/login')
              return
            }
            handleToggleFavorite(property.id)
          }}
          className='absolute top-2 right-2 w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm'
        >
          <svg 
            className={`w-3 h-3 ${isFavorite(property.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`} 
            fill={isFavorite(property.id) ? 'currentColor' : 'none'} 
            stroke='currentColor' 
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
          </svg>
        </button>
      </div>
      
      {/* Property Content */}
      <div className='p-3'>
        {/* Price */}
        <div className='mb-1'>
          <span className='text-lg font-bold text-dabang-primary'>
            {property.price}
          </span>
        </div>
        
        {/* Title */}
        <h3 
          className='text-sm font-semibold text-gray-900 leading-tight hover:text-dabang-primary transition-colors mb-2 line-clamp-1'
          onClick={(e) => {
            e.stopPropagation()
            handlePropertyDetail(property.id)
          }}
        >
          {property.title}
        </h3>
        
        {/* Location */}
        <p className='text-xs text-gray-600 mb-2 flex items-center'>
          <svg className='w-3 h-3 mr-1 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
          </svg>
          <span className='truncate'>{property.location}</span>
        </p>
        
        {/* Property Specs */}
        <div className='flex justify-between text-xs text-gray-500'>
          <span>{property.size}</span>
          <span>{property.rooms}</span>
          <span>{property.floor}</span>
        </div>
      </div>
    </div>
  );
};

const MapPropertyList = ({ 
  properties, 
  isFavorite, 
  handleToggleFavorite, 
  handlePropertyDetail,
  isAuthenticated,
  navigate,
  setSearchQuery,
  setSelectedDealType,
  setSelectedPropertyType,
  setSearchParams
}) => {
  // State for view mode
  const [viewMode, setViewMode] = useState("list");
  
  return (
    <div className='w-full lg:w-1/3'>
      <div className='lg:h-[calc(100vh-220px)] rounded-2xl bg-white shadow-sm lg:overflow-y-auto'>
        {/* List Header */}
        <div className='p-4 border-b border-gray-200 bg-white sticky top-0 z-10'>
          <div className='flex justify-between items-center mb-3'>
            <h2 className='text-lg font-semibold text-gray-800'>매물 목록</h2>
            <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>{properties.length}개 매물</span>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex space-x-2 text-xs'>
              <button className='px-3 py-1.5 bg-dabang-primary text-white rounded-full font-medium'>추천순</button>
              <button className='px-3 py-1.5 bg-white text-gray-600 rounded-full hover:bg-gray-50 border border-gray-200 font-medium'>가격순</button>
              <button className='px-3 py-1.5 bg-white text-gray-600 rounded-full hover:bg-gray-50 border border-gray-200 font-medium'>최신순</button>
            </div>
            <div className='flex items-center space-x-2'>
              {/* List View Button */}
              <button 
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "inline-flex items-center justify-center w-9 h-9 rounded-full bg-dabang-primary text-white"
                    : "inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                }
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 10h16M4 14h16M4 18h16' />
                </svg>
              </button>
              {/* Grid View Button */}
              <button 
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "inline-flex items-center justify-center w-9 h-9 rounded-full bg-dabang-primary text-white"
                    : "inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                }
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Property List */}
        <div className='flex-1 overflow-y-auto bg-white'>
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">조건에 맞는 매물이 없습니다</h3>
              <p className="text-gray-500 mb-6">
                다른 조건으로 검색해보세요
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedDealType('전체')
                  setSelectedPropertyType('전체')
                  setSearchParams({})
                }}
                className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            // Conditional rendering based on viewMode
            viewMode === "list" ? (
              // List view - vertical layout
              <div className='space-y-4 py-4'>
                {properties.map((property) => (
                  <MapPropertyCard 
                    key={property.id}
                    property={property}
                    isFavorite={isFavorite}
                    handleToggleFavorite={handleToggleFavorite}
                    handlePropertyDetail={handlePropertyDetail}
                    isAuthenticated={isAuthenticated}
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : (
              // Grid view - 2 columns layout
              <div className='grid grid-cols-2 gap-4 p-4'>
                {properties.map((property) => (
                  <MapPropertyCardCompact 
                    key={property.id}
                    property={property}
                    isFavorite={isFavorite}
                    handleToggleFavorite={handleToggleFavorite}
                    handlePropertyDetail={handlePropertyDetail}
                    isAuthenticated={isAuthenticated}
                    navigate={navigate}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const MapPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { isAuthenticated } = useUnifiedAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  
  // State for map
  const [mapCenter, setMapCenter] = useState([37.5219, 126.9245]) // 여의도 중심
  const [mapZoom, setMapZoom] = useState(13)
  
  // State for search filters from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedDealType, setSelectedDealType] = useState(searchParams.get('dealType') || '전체')
  const [selectedPropertyType, setSelectedPropertyType] = useState(searchParams.get('propertyType') || '전체')
  
  // Search hook with parameters from URL
  const searchParamsObj = {
    q: searchParams.get('q') || undefined,
    dealType: searchParams.get('dealType') || undefined,
    propertyType: searchParams.get('propertyType') || undefined
  }
  
  const { data: properties, error } = usePropertySearch(searchParamsObj)

  // Update URL when search filters change
  const updateSearchParams = (newParams) => {
    const params = {}
    
    if (searchQuery || newParams.q) {
      params.q = newParams.q || searchQuery
    }
    
    if (selectedDealType !== '전체' || newParams.dealType) {
      params.dealType = newParams.dealType || selectedDealType
    }
    
    if (selectedPropertyType !== '전체' || newParams.propertyType) {
      params.propertyType = newParams.propertyType || selectedPropertyType
    }
    
    setSearchParams(params)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    updateSearchParams({ q: searchQuery })
  }

  const handleMapSearch = () => {
    console.log('Re-search in current map area')
    // In a real app, this would trigger a new API call with the current map bounds
  }

  const handlePropertyDetail = (propertyId) => {
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
      <div className='min-h-screen bg-white'>
        <Header />
        <div className='container mx-auto p-4' style={{ height: 'calc(100vh - 140px)' }}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
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
    <div className='min-h-screen bg-white'>
      <Header />
      <div className='container mx-auto p-4'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden' style={{ height: 'calc(100vh - 140px)' }}>
          <div className='flex flex-col h-full'>
            {/* Search Bar */}
            <MapSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
              selectedDealType={selectedDealType}
              setSelectedDealType={setSelectedDealType}
              selectedPropertyType={selectedPropertyType}
              setSelectedPropertyType={setSelectedPropertyType}
              updateSearchParams={updateSearchParams}
            />
            
            {/* Main Content Area */}
            <section className="mt-4 flex-grow">
              <div className="flex flex-col lg:flex-row gap-4 h-full">
                {/* Map column */}
                <div className="w-full lg:w-2/3">
                  <div className="h-[320px] lg:h-[calc(100vh-220px)] rounded-2xl bg-gray-100 overflow-hidden relative">
                    <MapErrorBoundary>
                      <InteractiveMap 
                        center={mapCenter}
                        zoom={mapZoom}
                        properties={properties}
                        onCenterChange={setMapCenter}
                        onZoomChange={setMapZoom}
                        onPropertyClick={(property) => {
                          // Handle property click if needed
                          console.log('Property clicked:', property)
                        }}
                        className="w-full h-full"
                      />
                    </MapErrorBoundary>
                    
                    {/* Controls overlay */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-stretch gap-3">
                      {/* Zoom card */}
                      <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden">
                        <button 
                          onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                          className='block w-12 h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center text-lg font-semibold transition-all duration-200 border-b border-gray-200'
                        >
                          <span className='font-bold'>+</span>
                        </button>
                        <button 
                          onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
                          className='block w-12 h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center text-lg font-semibold transition-all duration-200'
                        >
                          <span className='font-bold'>−</span>
                        </button>
                      </div>

                      {/* Re-search button - Desktop only */}
                      <button
                        onClick={handleMapSearch}
                        className="hidden lg:inline-flex items-center justify-center px-4 py-2 rounded-full bg-dabang-primary text-white text-sm font-medium shadow-md hover:bg-dabang-primary/90 transition-colors"
                      >
                        현재 지도에서 재검색
                      </button>
                    </div>

                    {/* Mobile re-search button */}
                    <button
                      onClick={handleMapSearch}
                      className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-dabang-primary text-white text-sm font-medium shadow-md hover:bg-dabang-primary/90 transition-colors"
                    >
                      현재 지도에서 재검색
                    </button>
                  </div>
                </div>

                {/* List column */}
                <MapPropertyList 
                  properties={properties}
                  isFavorite={isFavorite}
                  handleToggleFavorite={handleToggleFavorite}
                  handlePropertyDetail={handlePropertyDetail}
                  isAuthenticated={isAuthenticated}
                  navigate={navigate}
                  setSearchQuery={setSearchQuery}
                  setSelectedDealType={setSelectedDealType}
                  setSelectedPropertyType={setSelectedPropertyType}
                  setSearchParams={setSearchParams}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MapPage