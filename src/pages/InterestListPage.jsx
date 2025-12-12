import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'

const InterestListPage = () => {
  const { isAuthenticated } = useUnifiedAuth()

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">관심 목록</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">관심 목록이 비어 있습니다</h3>
          <p className="text-gray-500 mb-6">
            마음에 드는 매물을 관심 목록에 추가해 보세요
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default InterestListPage
