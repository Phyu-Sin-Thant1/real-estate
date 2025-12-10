import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'
import { useFavorites } from '../hooks/useFavorites'

const MyPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAuthenticated } = useUserAuth()
  const { getFavoriteProperties, toggleFavorite, isFavorite } = useFavorites()
  
  // Get active tab from URL or default to 'profile'
  const activeTab = searchParams.get('tab') || 'profile'
  
  // Validate tab
  const validTabs = ['profile', 'favorites', 'recent', 'settings']
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'profile'
  
  // Tab configuration
  const tabs = [
    { key: 'profile', label: '프로필' },
    { key: 'favorites', label: '관심목록' },
    { key: 'recent', label: '최근 본 매물' },
    { key: 'settings', label: '설정' }
  ]
  
  // Handle tab change
  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey })
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }
  
  // Profile tab content
  const ProfileTab = () => (
    <div className="mt-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
              {user?.name || '-'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
              {user?.email || '-'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
              {user?.phone || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Favorites tab content
  const FavoritesTab = () => {
    const favoriteProperties = getFavoriteProperties()
    
    return (
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">관심목록</h2>
          <p className="text-gray-600 mt-1">저장한 매물을 한 번에 확인해보세요.</p>
        </div>
        
        {favoriteProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🤍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 관심 매물이 없습니다.</h3>
            <p className="text-gray-600 mb-6">
              마음에 드는 매물을 발견하면 하트 버튼을 눌러 저장해보세요
            </p>
            <button
              onClick={() => navigate('/map')}
              className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              매물 보러가기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((property) => (
              <div
                key={property.id}
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
                  {/* Favorite Heart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(property.id)
                    }}
                    className='absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm'
                  >
                    <svg 
                      className={`w-4 h-4 text-red-500`} 
                      fill='currentColor' 
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
      </div>
    )
  }
  
  // Recent tab content (stub)
  const RecentTab = () => (
    <div className="mt-6">
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">최근 본 매물</h2>
        <p className="text-gray-600">
          최근 본 매물 기능은 추후 제공 예정입니다.
        </p>
      </div>
    </div>
  )
  
  // Settings tab content (stub)
  const SettingsTab = () => (
    <div className="mt-6">
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">설정</h2>
        <p className="text-gray-600">
          알림 및 계정 설정은 추후 제공 예정입니다.
        </p>
      </div>
    </div>
  )
  
  // Render active tab content
  const renderActiveTab = () => {
    switch (currentTab) {
      case 'profile':
        return <ProfileTab />
      case 'favorites':
        return <FavoritesTab />
      case 'recent':
        return <RecentTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <ProfileTab />
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-indigo-500 mb-2">마이페이지</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 프로필</h1>
          <p className="text-gray-600">저장한 매물과 계정 정보를 한 곳에서 관리하세요.</p>
        </div>
        
        {/* Tab Bar */}
        <div className="mt-6 flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                currentTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {renderActiveTab()}
      </div>
      
      <Footer />
    </div>
  )
}

export default MyPage