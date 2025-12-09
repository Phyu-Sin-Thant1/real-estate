import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const AgentSignUpPage = () => {
  const [formData, setFormData] = useState({
    agentName: '',
    companyName: '',
    licenseNumber: '',
    businessNumber: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    agreeTerms: false,
    agreeMarketing: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Agent registration:', formData)
    // Handle agent registration logic
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">중개사 가입</h1>
            <p className="text-xl text-gray-600 mb-8">
              두부와 함께 더 많은 고객을 만나고 매출을 늘려보세요
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">매출 증대</h3>
                <p className="text-gray-600 text-sm">더 많은 잠재 고객과 연결되어 매출 기회를 확대하세요</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">타겟 마케팅</h3>
                <p className="text-gray-600 text-sm">정확한 고객 타겟팅으로 효율적인 마케팅이 가능합니다</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">빠른 매칭</h3>
                <p className="text-gray-600 text-sm">AI 기반 매칭 시스템으로 빠른 거래 성사를 지원합니다</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">중개사 등록 신청</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    중개사 성명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    placeholder="실명을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    소속 공인중개사무소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="중개사무소명을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  />
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    중개사 등록번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="예: 11001-2023-00001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  />
                </div>

                {/* Business Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사업자등록번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleInputChange}
                    placeholder="000-00-00000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사무소 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="중개사무소 주소를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  중개업 경력 <span className="text-red-500">*</span>
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  required
                >
                  <option value="">경력을 선택하세요</option>
                  <option value="1년미만">1년 미만</option>
                  <option value="1-3년">1-3년</option>
                  <option value="3-5년">3-5년</option>
                  <option value="5-10년">5-10년</option>
                  <option value="10년이상">10년 이상</option>
                </select>
              </div>

              {/* Legal Agreements */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <span className="text-red-500">*</span> 중개사 이용약관 및 개인정보처리방침에 동의합니다. {' '}
                    <a href="#" className="text-dabang-primary hover:underline">
                      [약관 보기]
                    </a>
                  </span>
                </label>
                
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!formData.agreeTerms}
                className="w-full bg-dabang-primary hover:bg-dabang-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors"
              >
                중개사 가입 신청
              </button>
            </form>
          </div>

          {/* Pricing Information */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">요금제 안내</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">베이직</h4>
                <p className="text-3xl font-bold text-dabang-primary mb-4">월 99,000원</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매물 등록 20개</li>
                  <li>• 기본 분석 리포트</li>
                  <li>• 이메일 지원</li>
                </ul>
              </div>
              
              <div className="border-2 border-dabang-primary rounded-lg p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-dabang-primary text-white px-4 py-1 rounded-full text-sm">
                  추천
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">프로</h4>
                <p className="text-3xl font-bold text-dabang-primary mb-4">월 199,000원</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매물 등록 무제한</li>
                  <li>• 고급 분석 리포트</li>
                  <li>• 우선 고객 매칭</li>
                  <li>• 전화 지원</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">엔터프라이즈</h4>
                <p className="text-3xl font-bold text-dabang-primary mb-4">맞춤 견적</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 모든 프로 기능</li>
                  <li>• 전담 계정 관리자</li>
                  <li>• 맞춤형 솔루션</li>
                  <li>• 24/7 지원</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default AgentSignUpPage