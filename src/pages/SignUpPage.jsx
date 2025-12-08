import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    console.log('Sign up attempt:', formData)
    // Handle sign up logic here
  }

  const checkEmailDuplicate = () => {
    console.log('Checking email duplicate for:', formData.email)
    // Handle email duplicate check
  }

  const goToLogin = () => {
    navigate('/login')
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-dabang-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-4">
          {/* Sign Up Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">회원가입</h1>
              <p className="text-gray-600 font-body">두부와 함께 완벽한 집을 찾아보세요</p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4 mb-6">
              {/* Email with Duplicate Check */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body"
                    required
                  />
                  <button
                    type="button"
                    onClick={checkEmailDuplicate}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors font-body whitespace-nowrap"
                  >
                    중복확인
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  휴대폰 번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="휴대폰 번호를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body"
                  required
                />
              </div>

              {/* Legal Checkboxes */}
              <div className="space-y-3 pt-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                    required
                  />
                  <span className="text-sm text-gray-700 font-body">
                    <span className="text-red-500">*</span> 이용약관에 동의합니다. {' '}
                    <a href="#" className="text-dabang-primary hover:underline">
                      [보기]
                    </a>
                  </span>
                </label>
                
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                    required
                  />
                  <span className="text-sm text-gray-700 font-body">
                    <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다. {' '}
                    <a href="#" className="text-dabang-primary hover:underline">
                      [보기]
                    </a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!formData.agreeTerms || !formData.agreePrivacy}
                className="w-full bg-dabang-primary hover:bg-dabang-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors font-body"
              >
                회원가입 완료
              </button>
            </form>

            {/* Switch to Login */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 font-body">
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={goToLogin}
                  className="text-dabang-primary hover:text-dabang-primary/80 font-medium transition-colors"
                >
                  로그인
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-6 border-t border-gray-200">
              <button
                onClick={goHome}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-body flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUpPage