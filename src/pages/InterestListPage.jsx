import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

import { useNavigate } from 'react-router-dom'

const InterestListPage = () => {
  const navigate = useNavigate()
  const [isLoggedIn] = useState(false) // This would be managed by auth context in real app
  const [groupBy, setGroupBy] = useState('date')

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
              <div className="text-2xl font-bold text-dabang-primary mb-1">12</div>
              <div className="text-sm text-gray-600">전체 관심매물</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">3</div>
              <div className="text-sm text-gray-600">이번주 추가</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">₩2.4억</div>
              <div className="text-sm text-gray-600">평균 관심가격</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">강남구</div>
              <div className="text-sm text-gray-600">관심지역 TOP</div>
            </div>
          </div>

          {/* Property Cards */}
          <div className="space-y-6">
            {/* Date Group */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                최근 저장 (이번주)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">🏠</span>
                      </div>
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
                        <span className="text-red-500">❤️</span>
                      </button>
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {item + 2}일 전 저장
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        아파트 {item}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        서울시 강남구 • 84㎡ • 3층/15층
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-dabang-primary">
                            ₩{((item + 2) * 100000).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="text-lg">📞</span>
                          </button>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <span className="text-lg">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Another Date Group */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                지난주 저장
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[4, 5, 6].map((item) => (
                  <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">🏠</span>
                      </div>
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
                        <span className="text-red-500">❤️</span>
                      </button>
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {item + 4}일 전 저장
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        오피스텔 {item}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        서울시 서초구 • 42㎡ • 7층/20층
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-dabang-primary">
                            ₩{((item + 1) * 80000).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="text-lg">📞</span>
                          </button>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
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
        </div>
      </main>
    </div>
  )
}

export default InterestListPage