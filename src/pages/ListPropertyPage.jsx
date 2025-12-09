import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const ListPropertyPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    propertyType: '',
    address: '',
    detailAddress: '',
    area: '',
    floor: '',
    totalFloors: '',
    rooms: '',
    bathrooms: '',
    price: '',
    priceType: '',
    deposit: '',
    monthlyRent: '',
    maintenanceFee: '',
    title: '',
    description: '',
    amenities: [],
    photos: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    agentLicense: '',
    agreeTerms: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Property listing:', formData)
    // Handle property listing submission
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
            step <= currentStep ? 'bg-dabang-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-dabang-primary' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">기본 정보</h3>
      
      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          매물 유형 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['아파트', '오피스텔', '빌라', '원룸'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({...prev, propertyType: type}))}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.propertyType === type
                  ? 'border-dabang-primary bg-dabang-primary text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="도로명주소를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상세 주소
          </label>
          <input
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleInputChange}
            placeholder="동/호수 등 상세주소"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
          />
        </div>
      </div>

      {/* Area and Floor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전용면적 (㎡) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="84"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            층수 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            placeholder="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            총 층수 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="totalFloors"
            value={formData.totalFloors}
            onChange={handleInputChange}
            placeholder="15"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 개수 <span className="text-red-500">*</span>
          </label>
          <select
            name="rooms"
            value={formData.rooms}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          >
            <option value="">선택하세요</option>
            <option value="원룸">원룸</option>
            <option value="1.5룸">1.5룸</option>
            <option value="2룸">2룸</option>
            <option value="3룸">3룸</option>
            <option value="4룸">4룸</option>
            <option value="5룸이상">5룸 이상</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            욕실 개수 <span className="text-red-500">*</span>
          </label>
          <select
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          >
            <option value="">선택하세요</option>
            <option value="1개">1개</option>
            <option value="2개">2개</option>
            <option value="3개">3개</option>
            <option value="4개이상">4개 이상</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">가격 정보</h3>
      
      {/* Price Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          거래 유형 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['매매', '전세', '월세'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({...prev, priceType: type}))}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.priceType === type
                  ? 'border-dabang-primary bg-dabang-primary text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Price Fields */}
      {formData.priceType === '매매' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            매매가 (만원) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="50000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
      )}

      {formData.priceType === '전세' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전세금 (만원) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="deposit"
            value={formData.deposit}
            onChange={handleInputChange}
            placeholder="30000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
      )}

      {formData.priceType === '월세' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              보증금 (만원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
              placeholder="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월세 (만원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="monthlyRent"
              value={formData.monthlyRent}
              onChange={handleInputChange}
              placeholder="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              required
            />
          </div>
        </div>
      )}

      {/* Maintenance Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          관리비 (만원)
        </label>
        <input
          type="number"
          name="maintenanceFee"
          value={formData.maintenanceFee}
          onChange={handleInputChange}
          placeholder="5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">상세 정보</h3>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          매물 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="예: 강남역 도보 5분, 신축 아파트"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상세 설명
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          placeholder="매물에 대한 자세한 설명을 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          편의시설
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['엘리베이터', '주차장', '베란다', '냉난방', '보안시설', '헬스장', '수영장', '놀이터'].map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          매물 사진
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600 mb-2">사진을 업로드하세요</p>
          <button className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            사진 선택
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">연락처 정보</h3>
      
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            담당자 성명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            placeholder="실명을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연락처 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="010-0000-0000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이메일 주소
        </label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="이메일을 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
        />
      </div>

      {/* Agent License */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          중개사 등록번호 (중개사인 경우)
        </label>
        <input
          type="text"
          name="agentLicense"
          value={formData.agentLicense}
          onChange={handleInputChange}
          placeholder="예: 11001-2023-00001"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
        />
      </div>

      {/* Terms Agreement */}
      <div className="pt-6 border-t border-gray-200">
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
            <span className="text-red-500">*</span> 매물 등록 이용약관 및 개인정보처리방침에 동의합니다. {' '}
            <a href="#" className="text-dabang-primary hover:underline">
              [약관 보기]
            </a>
          </span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">매물 등록</h1>
            <p className="text-gray-600">간단한 정보 입력으로 매물을 등록하세요</p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    다음
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!formData.agreeTerms}
                    className="px-6 py-3 bg-dabang-primary hover:bg-dabang-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    매물 등록 완료
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default ListPropertyPage