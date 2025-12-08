import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext.jsx'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTarget = location.state?.from || '/admin'
      navigate(redirectTarget, { replace: true })
    }
  }, [isAuthenticated, location.state, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLogin = (provider) => {
    console.log('Social login with:', provider)

    switch (provider) {
      case 'kakao':
        alert('카카오 로그인이 구현되지 않았습니다. 개발 중입니다.')
        break
      case 'naver':
        alert('네이버 로그인이 구현되지 않았습니다. 개발 중입니다.')
        break
      case 'google':
        alert('구글 로그인이 구현되지 않았습니다. 개발 중입니다.')
        break
      case 'apple':
        alert('애플 로그인이 구현되지 않았습니다. 개발 중입니다.')
        break
      default:
        break
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await login(formData)

    setLoading(false)

    if (!result.success) {
      setError(result.error || '로그인에 실패했습니다.')
      return
    }

    const redirectTarget = location.state?.from || '/admin'
    navigate(redirectTarget, { replace: true })
  }

  const goToSignUp = () => {
    navigate('/signup')
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-dabang-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">로그인</h1>
              <p className="text-gray-600 font-body">두부에 오신 것을 환영합니다</p>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 text-center mb-4 font-body">간편 로그인</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleSocialLogin('kakao')}
                  className="flex items-center justify-center px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-all duration-200 font-body transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C7.03 3 3 6.14 3 10.1c0 2.52 1.65 4.73 4.14 6.05l-.95 3.46c-.06.22.14.39.33.29L10.3 17.9c.56.08 1.13.12 1.7.12 4.97 0 9-3.14 9-7.02S16.97 3 12 3z" />
                  </svg>
                  카카오
                </button>
                <button
                  onClick={() => handleSocialLogin('naver')}
                  className="flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 font-body transform hover:scale-105 active:scale-95"
                >
                  <span className="text-lg font-bold mr-2">N</span>
                  네이버
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-all duration-200 font-body transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  구글
                </button>
                <button
                  onClick={() => handleSocialLogin('apple')}
                  className="flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 font-body transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  애플
                </button>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-body">또는</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  이메일 주소
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  비밀번호
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

              {error && (
                <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors font-body disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="text-center mb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-dabang-primary transition-colors font-body">
                ID/비밀번호 찾기
              </a>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-body">
                계정이 없으신가요?{' '}
                <button onClick={goToSignUp} className="text-dabang-primary hover:text-dabang-primary/80 font-medium transition-colors">
                  회원가입
                </button>
              </p>
            </div>

            <div className="text-center mt-6 pt-6 border-t border-gray-200">
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

export default LoginPage

