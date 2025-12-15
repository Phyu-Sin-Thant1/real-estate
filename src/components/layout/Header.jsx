import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUnifiedAuth } from '../../context/UnifiedAuthContext'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

const Header = () => {
  const navigate = useNavigate()
  const { t, i18n: translationInstance } = useTranslation('common')
  const { user, isAuthenticated, isUser, isBusinessRealEstate, isBusinessDelivery, isAdmin, logout } = useUnifiedAuth()

  // Show dashboard button only for partners and admins
  const isPartnerOrAdmin = isBusinessRealEstate || isBusinessDelivery || isAdmin;
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsUserDropdownOpen(false)
    navigate('/')
  }

  const handleProfileClick = () => {
    navigate('/mypage')
    setIsUserDropdownOpen(false)
  }

  const handleGoToDashboard = () => {
    // Updated logic to route users based on their role
    if (isBusinessRealEstate) {
      navigate('/business/real-estate')
    } else if (isBusinessDelivery) {
      navigate('/business')
    } else if (isAdmin) {
      navigate('/admin')
    } else {
      navigate('/login')
    }
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const categories = [
    { name: '원룸/투룸', path: '/category/oneroom' },
    { name: '아파트', path: '/category/apartment' },
    { name: '오피스텔', path: '/category/officetel' },
    { name: '빌라', path: '/category/villa' },
    { name: '분양/신축', path: '/category/presale' }
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* LEFT group */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <div className="bg-dabang-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">TOFU</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-gray-700 hover:text-dabang-primary">
              {t('nav.home')}
            </Link>
            
            <Link to="/map" className="text-gray-700 hover:text-dabang-primary">
              {t('nav.mapSearch')}
            </Link>
            
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="text-gray-700 hover:text-dabang-primary flex items-center"
              >
                {t('nav.listings')}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/moving-service" className="text-gray-700 hover:text-dabang-primary">
              {t('nav.moving')}
            </Link>
            
            <Link to="/community" className="text-gray-700 hover:text-dabang-primary">
              {t('nav.community')}
            </Link>
            
            {/* Admin Dashboard Link - shown only for admins */}
            {isAdmin && (
              <Link to="/admin" className="text-dabang-primary hover:text-dabang-primary/80 font-medium">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* RIGHT group */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeLanguage('ko')}
              className={`px-3 py-1 text-sm rounded-md ${
                translationInstance.language === 'ko' 
                  ? 'bg-dabang-primary text-white' 
                  : 'text-gray-600 hover:text-dabang-primary'
              }`}
            >
              KO
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 text-sm rounded-md ${
                translationInstance.language === 'en' 
                  ? 'bg-dabang-primary text-white' 
                  : 'text-gray-600 hover:text-dabang-primary'
              }`}
            >
              EN
            </button>
          </div>
          
          {/* Go to Dashboard Button - shown only for partners and admins */}
          {isPartnerOrAdmin && (
            <button
              onClick={handleGoToDashboard}
              className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
            >
              대시보드로 이동
            </button>
          )}
          
          {!isAuthenticated ? (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
              >
                회원가입
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-dabang-primary flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="ml-2 text-gray-700 hidden sm:block">{user?.name || '사용자'}</span>
                <svg className="ml-1 w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    내 프로필
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 py-3">
        <div className="flex space-x-4 overflow-x-auto px-4">
          <Link to="/" className="text-gray-700 hover:text-dabang-primary font-medium whitespace-nowrap">
            {t('nav.home')}
          </Link>
          <Link to="/map" className="text-gray-700 hover:text-dabang-primary font-medium whitespace-nowrap">
            {t('nav.mapSearch')}
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="text-gray-700 hover:text-dabang-primary font-medium flex items-center whitespace-nowrap"
            >
              {t('nav.listings')}
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isCategoryDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/moving-service" className="text-gray-700 hover:text-dabang-primary font-medium whitespace-nowrap">
            {t('nav.moving')}
          </Link>
          <Link to="/community" className="text-gray-700 hover:text-dabang-primary font-medium whitespace-nowrap">
            {t('nav.community')}
          </Link>
          {/* Go to Dashboard Button - shown only for partners and admins */}
          {isPartnerOrAdmin && (
            <button
              onClick={handleGoToDashboard}
              className="text-gray-700 hover:text-dabang-primary font-medium whitespace-nowrap"
            >
              대시보드로 이동
            </button>
          )}
          {/* Admin Dashboard Link - shown only for admins */}
          {isAdmin && (
            <Link to="/admin" className="text-dabang-primary hover:text-dabang-primary/80 font-medium whitespace-nowrap">
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header