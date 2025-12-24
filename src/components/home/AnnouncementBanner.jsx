import React, { useState } from 'react'

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-sm font-bold text-white">특별 이벤트</span>
            </div>
            <p className="text-sm md:text-base text-white font-medium">
              신규 회원 가입 시 <span className="font-bold text-yellow-300">첫 거래 수수료 50% 할인</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/register'}
              className="px-4 py-1.5 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-all text-sm whitespace-nowrap"
            >
              지금 가입하기
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBanner

