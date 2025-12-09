import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { useFavorites } from '../hooks/useFavorites'

const InterestListPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useUserAuth()
  const { favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites, getFavoriteProperties } = useFavorites()
  const [groupBy, setGroupBy] = useState('date')

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  // Get full property objects for favorites
  const favoriteProperties = getFavoriteProperties()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <Footer />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="max-w-md w-full mx-4 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-6xl mb-6">🔐</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
              <p className="text-gray-600 mb-8">
                관심목록을 확인하려면 먼저 로그인해주세요
              </p>
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                로그인하기
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Footer />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">관심목록</h1>
              <p className="text-gray-600">찜한 매물들을 확인하고 관리하세요</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {favoriteProperties.length > 0 && (
                <button
                  onClick={clearFavorites}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  모두 삭제
                </button>
              )}
              <label className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary text-sm"
              >
                <option value="date">저장날짜순</option>
                <option value="location">지역별</option>
                <option value="price">가격순</option>
                <option value="type">매물유형별</option>
              </select>
            </div>
          </div>

          {/* Interest Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-dabang-primary mb-1">{favoriteProperties.length}</div>
              <div className="text-sm text-gray-600">전체 관심매물</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">0</div>
              <div className="text-sm text-gray-600">이번주 추가</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">₩0</div>
              <div className="text-sm text-gray-600">평균 관심가격</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">-</div>
              <div className="text-sm text-gray-600">관심지역 TOP</div>
            </div>
          </div>

          {/* Empty State */}
          {favoriteProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-6">🤍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">관심목록이 비어있어요</h3>
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
            /* Property Cards */
            <div className="space-y-6">
              {/* Date Group */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  관심매물
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProperties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <button 
                          onClick={() => removeFavorite(property.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                        >
                          <span className="text-red-500">❤️</span>
                        </button>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {property.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {property.location} • {property.size} • {property.floor}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-dabang-primary">
                              {property.price}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <span className="text-lg">📞</span>
                            </button>
                            <button 
                              onClick={() => removeFavorite(property.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <span className="text-lg">🗑️</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default InterestListPage