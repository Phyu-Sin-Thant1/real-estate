import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'

const MyPage = () => {
  const { user, isAuthenticated } = useUnifiedAuth()

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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">내 프로필</h1>
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
                  <p className="font-medium">0개</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">최근 조회</p>
                  <p className="font-medium">0회</p>
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

export default MyPage
