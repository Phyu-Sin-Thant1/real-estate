import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'
import { loadFavorites, saveFavorites, loadHistory } from '../lib/helpers/userDataStorage'
import { loadSupportTickets } from '../lib/helpers/supportStorage'

const MyPage = () => {
  const { user, isAuthenticated, isUser } = useUnifiedAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [supportTickets, setSupportTickets] = useState([])

  useEffect(() => {
    const fav = loadFavorites()
    if (fav.length === 0) {
      setFavorites([
        { id: 'fav-1', title: '강남역 인근 신축 오피스텔', location: '서울 강남구', price: '보증금 1억 / 월 90만' },
        { id: 'fav-2', title: '판교역 도보 5분 오피스', location: '경기 성남시', price: '매매 12억' }
      ])
    } else {
      setFavorites(fav)
    }

    const hist = loadHistory()
    if (hist.length === 0) {
      const now = new Date().toISOString()
      setHistory([
        { id: 'view-1', title: '여의도 리버뷰 아파트', viewedAt: now, propertyId: '1' },
        { id: 'view-2', title: '홍대역 근처 원룸', viewedAt: now, propertyId: '2' }
      ])
    } else {
      setHistory(hist)
    }

    const tickets = loadSupportTickets()
    setSupportTickets(tickets)
  }, [])

  const myTickets = useMemo(() => {
    if (!user?.email) return []
    return supportTickets.filter((t) => t.createdBy === user.email)
  }, [supportTickets, user?.email])

  const removeFavorite = (id) => {
    const next = favorites.filter((f) => f.id !== id)
    setFavorites(next)
    saveFavorites(next)
  }

  if (!isAuthenticated) {
    // In a real app, you might want to redirect to login
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">접근 권한 없음</h3>
            <p className="text-red-600 mb-4">이 페이지에 접근하려면 로그인이 필요합니다.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-dabang-primary/10 flex items-center justify-center mr-4">
          <span className="text-xl text-dabang-primary font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name || '사용자'}</h2>
          <p className="text-gray-600">{user?.email || '이메일 정보 없음'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">회원 등급</p>
              <p className="font-medium">일반 회원</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">가입일</p>
              <p className="font-medium">2023년 1월 1일</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">활동 내역</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">찜한 매물</p>
              <p className="font-medium">{favorites.length}개</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">최근 조회</p>
              <p className="font-medium">{history.length}회</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFavorites = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      {favorites.length === 0 && (
        <p className="text-sm text-gray-500">관심목록이 없습니다.</p>
      )}
      {favorites.map((item) => (
        <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">{item.location}</p>
            <p className="text-sm text-gray-900">{item.price}</p>
          </div>
          <button
            onClick={() => removeFavorite(item.id)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  )

  const renderHistory = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
      {history.length === 0 && <p className="text-sm text-gray-500">활동 이력이 없습니다.</p>}
      {history.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500">{new Date(item.viewedAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => window.location.assign(`/property/${item.propertyId || ''}`)}
            className="text-sm text-dabang-primary hover:text-dabang-primary/80"
          >
            상세보기
          </button>
        </div>
      ))}
    </div>
  )

  const renderSupport = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">문의/지원 티켓</h3>
        <button
          onClick={() => window.location.assign('/support')}
          className="px-4 py-2 bg-dabang-primary text-white rounded-md text-sm hover:bg-dabang-primary/90"
        >
          티켓 생성
        </button>
      </div>
      {myTickets.length === 0 && <p className="text-sm text-gray-500">제출된 티켓이 없습니다.</p>}
      {myTickets.map((t) => (
        <div key={t.id} className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">ID: {t.id}</p>
            <p className="font-medium text-gray-900">{t.type}</p>
            <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
          </div>
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {t.status}
          </span>
        </div>
      ))}
    </div>
  )

  const tabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return renderFavorites()
      case 'history':
        return renderHistory()
      case 'support':
        return renderSupport()
      default:
        return renderProfile()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">마이페이지</h1>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            {[
              { key: 'profile', label: '프로필' },
              { key: 'favorites', label: '관심목록' },
              { key: 'history', label: '활동/이력' },
              { key: 'support', label: '문의/지원' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 text-sm font-medium ${
                  activeTab === tab.key
                    ? 'border-dabang-primary text-dabang-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {tabContent()}
      </div>
      <Footer />
    </div>
  )
}

export default MyPage
