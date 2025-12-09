import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import InteractiveMap from '../features/map/InteractiveMap'
import MapErrorBoundary from '../components/MapErrorBoundary'
import { useUserAuth } from '../context/UserAuthContext'
import { usePropertySearch } from '../hooks/usePropertySearch'
import { useFavorites } from '../hooks/useFavorites'

const MapPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { isAuthenticated } = useUserAuth()
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
          <div className='flex h-full'>
            <div className='relative w-2/3 bg-white'>
              <MapErrorBoundary>
                <InteractiveMap 
                  center={mapCenter}
                  zoom={mapZoom}
                  properties={properties}
                  onCenterChange={setMapCenter}
                  onZoomChange={setMapZoom}
                />
              </MapErrorBoundary>
              {/* Unified Floating Search Control Center */}
              <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4'>
                {/* Single Unified Container with Strong Shadow */}
                <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
                  {/* Search Input Area - Top Row */}
                  <div className='px-6 pt-4 pb-3'>
                    <form onSubmit={handleSearchSubmit} className='flex items-center'>
                      <div className='flex-1 relative'>
                        <input
                          type='text'
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder='지역, 지하철역, 아파트명으로 검색'
                          className='w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center placeholder:text-center text-gray-700'
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
                  
                  {/* Filter Buttons Area - Bottom Row */}
                  <div className='px-6 py-4'>
                    <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide'>
                      <style>{`
                        .scrollbar-hide {
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                        }
                        .scrollbar-hide::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      
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
                                ? 'bg-teal-500 text-white shadow-md border-0'
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
                                ? 'bg-teal-500 text-white shadow-md border-0'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                      
                      {/* Dedicated Advanced Filter Button */}
                      <div className='flex items-center ml-auto flex-shrink-0'>
                        <button className='px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'>
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
              
              {/* Enhanced Map Utility Controls - Bottom Right */}
              <div className='absolute bottom-6 right-6 z-10 space-y-4'>
                {/* Premium Zoom Controls */}
                <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                  <button 
                    onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                    className='block w-12 h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center text-lg font-semibold transition-all duration-200 border-b border-gray-200'
                  >
                    <span style={{ color: '#424242', fontWeight: '600' }}>+</span>
                  </button>
                  <button 
                    onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
                    className='block w-12 h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center text-lg font-semibold transition-all duration-200'
                  >
                    <span style={{ color: '#424242', fontWeight: '600' }}>−</span>
                  </button>
                </div>
                
                {/* Premium "Search Here" Button with Icon */}
                <button
                  onClick={handleMapSearch}
                  className='bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold whitespace-nowrap flex items-center space-x-2 text-sm transition-all duration-200'
                >
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                  </svg>
                  <span style={{ fontWeight: '600' }}>현재 지도에서 재검색</span>
                </button>
              </div>
            </div>
            {/* Premium Listings Area - 35% width with independent scroll */}
            <div className='w-1/3 bg-white border-l border-gray-200 flex flex-col'>
              {/* Enhanced Listings Header */}
              <div className='p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'>
                <div className='flex justify-between items-center mb-3'>
                  <h2 className='text-lg font-semibold text-gray-800'>매물 목록</h2>
                  <span className='text-sm text-gray-500 bg-white px-2 py-1 rounded-full'>{properties.length}개 매물</span>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex space-x-2 text-xs'>
                    <button className='px-3 py-1.5 bg-teal-500 text-white rounded-full font-medium'>추천순</button>
                    <button className='px-3 py-1.5 bg-white text-gray-600 rounded-full hover:bg-gray-50 border border-gray-200 font-medium'>가격순</button>
                    <button className='px-3 py-1.5 bg-white text-gray-600 rounded-full hover:bg-gray-50 border border-gray-200 font-medium'>최신순</button>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button className='px-2 py-1 bg-white text-gray-600 rounded border border-gray-200 hover:bg-gray-50 text-xs'>
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 10h16M4 14h16M4 18h16' />
                      </svg>
                    </button>
                    <button className='px-2 py-1 bg-white text-gray-600 rounded border border-gray-200 hover:bg-gray-50 text-xs'>
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Premium Scrollable Property Listings */}
              <div className='flex-1 overflow-y-auto bg-gray-50'>
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
                  properties.map((property) => (
                    <div key={property.id} className='mx-4 my-4 bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer' style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)' }}>
                      
                      {/* Enhanced Photo Area with Modern Aspect Ratio */}
                      <div className='relative h-48 overflow-hidden'>
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                        />
                        
                        {/* Photo Navigation Overlays */}
                        <div className='absolute inset-0 flex items-center justify-between px-3 opacity-0 hover:opacity-100 transition-opacity duration-200'>
                          <button className='w-8 h-8 bg-black bg-opacity-30 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                            </svg>
                          </button>
                          <button className='w-8 h-8 bg-black bg-opacity-30 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Photo Indicators */}
                        <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                          {[1, 2, 3].map((dot, index) => (
                            <div 
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === 0 ? 'bg-teal-500' : 'bg-white bg-opacity-60'
                              }`}
                              style={{ backgroundColor: index === 0 ? '#00BCD4' : undefined }}
                            />
                          ))}
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
                      
                      {/* Premium Content Section */}
                      <div className='p-5'>
                        {/* Hero Information - Price & Title */}
                        <div className='mb-4'>
                          {/* Prominent Price Display */}
                          <div className='mb-2'>
                            <span className='text-3xl font-bold' style={{ color: '#00BCD4' }}>
                              {property.price}
                            </span>
                          </div>
                          
                          {/* Title with Type Badge */}
                          <div className='flex items-center justify-between mb-2'>
                            <h3 
                              className='text-xl font-semibold text-gray-900 leading-tight hover:text-dabang-primary transition-colors'
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePropertyDetail(property.id)
                              }}
                            >
                              {property.title}
                            </h3>
                            <span className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'>
                              {property.type}
                            </span>
                          </div>
                        </div>
                        
                        {/* Subtle Separator */}
                        <div className='h-px bg-gray-100 mb-4'></div>
                        
                        {/* Location */}
                        <p className='text-sm text-gray-600 mb-4 flex items-center'>
                          <svg className='w-4 h-4 mr-2 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                          </svg>
                          {property.location}
                        </p>
                        
                        {/* Property Specifications - 2-Column Grid */}
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                          <div className='flex items-center space-x-2 text-sm'>
                            <span className='text-lg'>📏</span>
                            <div>
                              <span className='text-gray-500'>Size</span>
                              <p className='font-medium text-gray-800'>{property.size}</p>
                            </div>
                          </div>
                          
                          <div className='flex items-center space-x-2 text-sm'>
                            <span className='text-lg'>🚪</span>
                            <div>
                              <span className='text-gray-500'>Rooms</span>
                              <p className='font-medium text-gray-800'>{property.rooms}</p>
                            </div>
                          </div>
                          
                          <div className='flex items-center space-x-2 text-sm'>
                            <span className='text-lg'>🏢</span>
                            <div>
                              <span className='text-gray-500'>Floor</span>
                              <p className='font-medium text-gray-800'>{property.floor}</p>
                            </div>
                          </div>
                          
                          <div className='flex items-center space-x-2 text-sm'>
                            <span className='text-lg' style={{ color: '#00BCD4' }}>💰</span>
                            <div>
                              <span className='text-gray-500'>Maintenance</span>
                              <p className='font-medium' style={{ color: '#00BCD4' }}>
                                {property.maintenance || '관리비 정보 없음'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Subtle Separator */}
                        <div className='h-px bg-gray-100 mb-4'></div>
                        
                        {/* Action Buttons */}
                        <div className='flex space-x-3'>
                          <button 
                            onClick={() => handlePropertyDetail(property.id)}
                            className='flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 text-sm'
                          >
                            상세보기
                          </button>
                          <button className='px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Load More Button */}
                <div className='p-4'>
                  <button className='w-full py-3 bg-white border-2 border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors'>
                    더 많은 매물 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MapPage