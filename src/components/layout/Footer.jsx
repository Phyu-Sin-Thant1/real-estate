import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Top Section: Quick Utility & Trust Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {/* Trust & Partners */}
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center text-gray-600 hover:text-dabang-primary text-sm font-medium transition-colors font-body">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                광고 문의
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-dabang-primary text-sm font-medium transition-colors font-body">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                제휴/파트너
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-dabang-primary text-sm font-medium transition-colors font-body">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM3 3h18v12H3V3z" />
                </svg>
                공지 사항
              </a>
            </div>

            {/* Customer Actions */}
            <div className="flex items-center space-x-4">
              <a href="#" className="bg-dabang-secondary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors font-body flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                방 내놓기
              </a>
              <a href="#" className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors font-body flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                중개사 찾기
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Columns: Information & Service Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column I: Quick Service */}
          <div>
            <h3 className="text-lg font-bold text-dabang-primary mb-6 font-display">주요 서비스</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  지도 검색
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  시세 정보
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  관심 매물
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  커뮤니티
                </a>
              </li>
            </ul>
          </div>

          {/* Column II: Support & Policy */}
          <div>
            <h3 className="text-lg font-bold text-dabang-primary mb-6 font-display">고객 지원</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  이용 약관
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  개인정보 처리방침
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  1:1 문의
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  자주 묻는 질문
                </a>
              </li>
            </ul>
          </div>

          {/* Column III: Company Info - Simplified */}
          <div>
            <h3 className="text-lg font-bold text-dabang-primary mb-6 font-display">회사 소개</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  회사 개요
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  인재 채용
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-dabang-dark-muted hover:text-dabang-primary transition-all duration-200 font-body group hover:underline">
                  <svg className="w-4 h-4 mr-3 text-dabang-accent group-hover:text-dabang-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  오시는 길
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Centered Block: Mobile App Download */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-bold text-dabang-primary mb-3 font-display">두부 모바일 앱 다운로드</h3>
          <p className="text-dabang-muted mb-8 font-body">언제 어디서든 편리하게 매물을 확인해보세요.</p>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="inline-block transform hover:scale-105 transition-all duration-200">
              <div className="bg-black text-white px-6 py-4 rounded-2xl font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300 uppercase tracking-wide">Download on the</div>
                  <div className="text-lg font-semibold leading-tight">App Store</div>
                </div>
              </div>
            </a>
            
            <a href="#" className="inline-block transform hover:scale-105 transition-all duration-200">
              <div className="bg-black text-white px-6 py-4 rounded-2xl font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300 uppercase tracking-wide">Get it on</div>
                  <div className="text-lg font-semibold leading-tight">Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Sophisticated Legal & Copyright */}
      <div className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            {/* Company Registration Info */}
            <div className="text-sm font-body space-y-2">
              <p>
                <span className="font-semibold text-white">두부</span> | 대표: 김두부 | 사업자등록번호: 123-45-67890
              </p>
              <p>통신판매업신고: 2024-서울강남-1234 | 주소: 서울특별시 강남구 테헤란로 123</p>
            </div>
            
            {/* Customer Contact */}
            <div className="text-sm font-body">
              <p className="mb-2">
                <span className="font-semibold text-dabang-accent">고객센터: 1588-1234</span>
              </p>
              <p className="text-xs text-gray-400">(평일 9:00~18:00)</p>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400 font-body">
              Copyright © 2025 두부. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer