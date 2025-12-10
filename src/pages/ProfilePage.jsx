import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, favorites, logout } = useUserAuth()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleEditProfile = () => {
    // TODO: Implement profile editing functionality
    console.log('Edit profile clicked')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <Footer />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="max-w-md w-full mx-4 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-6xl mb-6">👤</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
              <p className="text-gray-600 mb-8">
                프로필을 확인하려면 먼저 로그인해주세요
              </p>
              <button
                onClick={() => navigate('/login')}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">내 프로필</h1>
              <p className="text-gray-600">계정 정보와 저장한 항목들을 관리하세요</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-dabang-primary/10 flex items-center justify-center mb-4">
                    <span className="text-3xl text-dabang-primary font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name || '사용자'}</h2>
                  <p className="text-gray-600">{user?.email || '이메일 없음'}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">회원가입일</p>
                      <p className="text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">연락처</p>
                      <p className="text-gray-900">{user?.phone || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleEditProfile}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    프로필 수정
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">저장한 항목</h2>
                  <span className="bg-dabang-primary/10 text-dabang-primary px-3 py-1 rounded-full text-sm font-medium">
                    {favorites.length}개
                  </span>
                </div>

                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    <button className="py-3 px-1 border-b-2 border-dabang-primary text-dabang-primary font-medium">
                      관심매물
                    </button>
                    <button className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      최근 본 매물
                    </button>
                  </nav>
                </div>

                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🏡</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">저장한 매물이 없습니다</h3>
                    <p className="text-gray-500 mb-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-gray-900">매물 제목 {item}</h3>
                            <p className="text-sm text-gray-500 mt-1">서울시 강남구 • 84㎡</p>
                            <p className="text-dabang-primary font-medium mt-2">₩{(item * 10000).toLocaleString()}</p>
                          </div>
                          <button className="text-gray-400 hover:text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage