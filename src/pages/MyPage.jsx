import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUserAuth } from '../context/UserAuthContext'
import { useFavorites } from '../hooks/useFavorites'

const MyPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateUser } = useUserAuth()
  const { getFavoriteProperties } = useFavorites()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  // Get favorite properties
  const favoriteProperties = getFavoriteProperties().slice(0, 6)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    // Update user data in context and localStorage
    updateUser({
      ...user,
      name: formData.name,
      phone: formData.phone
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data to current user values
    setFormData({
      name: user?.name || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  const handleViewAllFavorites = () => {
    navigate('/interest-list')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">내 프로필</h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                안녕하세요, {user?.name || '사용자'}님
              </h2>
              <p className="text-gray-600">
                TOFU에 오신 것을 환영합니다. 프로필 정보를 관리하고 관심있는 매물을 확인해보세요.
              </p>
            </div>
            
            {/* Profile Info Section */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">프로필 정보</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    수정하기
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {user?.email || '-'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user?.name || '-'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    휴대폰 번호
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user?.phone || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Favorites Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">관심매물</h2>
                {favoriteProperties.length > 0 && (
                  <button
                    onClick={handleViewAllFavorites}
                    className="text-dabang-primary hover:text-dabang-primary/80 text-sm font-medium"
                  >
                    전체 보기 →
                  </button>
                )}
              </div>
              
              {favoriteProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🤍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">관심목록이 비어있어요</h3>
                  <p className="text-gray-600 mb-6">
                    마음에 드는 매물을 발견하면 하트 버튼을 눌러 저장해보세요
                  </p>
                  <button
                    onClick={() => navigate('/map')}
                    className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    매물 찾아보기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProperties.map((property) => (
                    <div 
                      key={property.id}
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">
                          {property.title}
                        </h3>
                        <p className="text-dabang-primary font-medium mb-2">
                          {property.price}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {property.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Saved Searches Section (Placeholder) */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">저장된 검색</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-gray-900">강남 · 원룸 · 월세 50~80</h3>
                  <p className="text-sm text-gray-600 mt-1">저장일: 2023.11.15</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-gray-900">홍대 · 투룸 · 전세</h3>
                  <p className="text-sm text-gray-600 mt-1">저장일: 2023.11.10</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-gray-900">송파 · 아파트 · 매매</h3>
                  <p className="text-sm text-gray-600 mt-1">저장일: 2023.11.05</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MyPage