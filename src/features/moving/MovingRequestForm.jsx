import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const MovingRequestForm = () => {
  const [formData, setFormData] = useState({
    // 고객 정보
    name: '',
    contact: '',
    email: '',
    
    // 주소 정보
    departureAddress: '',
    departureBuildingType: '',
    departureFloor: '',
    departureElevator: '',
    arrivalAddress: '',
    arrivalFloor: '',
    arrivalElevator: '',
    
    // 이사 / 배송 정보
    movingType: '',
    preferredDate: '',
    preferredTime: '',
    additionalOptions: [],
    memo: '',
    
    // 동의
    privacyAgreement: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'privacyAgreement') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Additional options checkboxes
        setFormData(prev => ({
          ...prev,
          additionalOptions: checked
            ? [...prev.additionalOptions, value]
            : prev.additionalOptions.filter(opt => opt !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 고객 정보
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.contact.trim()) newErrors.contact = '연락처를 입력해주세요.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 주소 정보
    if (!formData.departureAddress.trim()) newErrors.departureAddress = '출발지 주소를 입력해주세요.';
    if (!formData.departureBuildingType) newErrors.departureBuildingType = '건물 유형을 선택해주세요.';
    if (!formData.arrivalAddress.trim()) newErrors.arrivalAddress = '도착지 주소를 입력해주세요.';

    // 이사 / 배송 정보
    if (!formData.movingType) newErrors.movingType = '이사 유형을 선택해주세요.';
    if (!formData.preferredDate) newErrors.preferredDate = '희망 날짜를 선택해주세요.';
    if (!formData.preferredTime) newErrors.preferredTime = '희망 시간대를 선택해주세요.';

    // 동의
    if (!formData.privacyAgreement) newErrors.privacyAgreement = '개인정보 수집 및 이용에 동의해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitMovingRequest = async (formValues) => {
    // This function will be replaced with actual API call in the future
    // For now, just log the payload
    console.log('Moving Request Payload:', formValues);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await submitMovingRequest(formData);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        handleReset();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: '제출 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      departureAddress: '',
      departureBuildingType: '',
      departureFloor: '',
      departureElevator: '',
      arrivalAddress: '',
      arrivalFloor: '',
      arrivalElevator: '',
      movingType: '',
      preferredDate: '',
      preferredTime: '',
      additionalOptions: [],
      memo: '',
      privacyAgreement: false,
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">이사 / 배달 서비스 신청</h2>
      
      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            요청이 접수되었습니다. 담당자가 연락드릴 예정입니다.
          </p>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 고객 정보 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">고객 정보</h3>
          
          <Input
            id="name"
            name="name"
            label="이름"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />
          
          <Input
            id="contact"
            name="contact"
            label="연락처"
            type="tel"
            placeholder="010-1234-5678"
            value={formData.contact}
            onChange={handleInputChange}
            error={errors.contact}
            required
          />
          
          <Input
            id="email"
            name="email"
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
        </div>

        {/* 주소 정보 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">주소 정보</h3>
          
          <Input
            id="departureAddress"
            name="departureAddress"
            label="출발지 주소"
            placeholder="서울시 강남구 테헤란로 123"
            value={formData.departureAddress}
            onChange={handleInputChange}
            error={errors.departureAddress}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출발지 건물 유형 <span className="text-red-500">*</span>
            </label>
            <select
              id="departureBuildingType"
              name="departureBuildingType"
              value={formData.departureBuildingType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent ${
                errors.departureBuildingType ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">선택해주세요</option>
              <option value="아파트">아파트</option>
              <option value="빌라">빌라</option>
              <option value="오피스텔">오피스텔</option>
              <option value="주택">주택</option>
              <option value="기타">기타</option>
            </select>
            {errors.departureBuildingType && (
              <p className="text-sm text-red-600 mt-1">{errors.departureBuildingType}</p>
            )}
          </div>
          
          <Input
            id="departureFloor"
            name="departureFloor"
            label="출발지 층수"
            type="number"
            placeholder="3"
            value={formData.departureFloor}
            onChange={handleInputChange}
            min="1"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              출발지 엘리베이터 유무
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="departureElevator"
                  value="있음"
                  checked={formData.departureElevator === '있음'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">있음</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="departureElevator"
                  value="없음"
                  checked={formData.departureElevator === '없음'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">없음</span>
              </label>
            </div>
          </div>
          
          <Input
            id="arrivalAddress"
            name="arrivalAddress"
            label="도착지 주소"
            placeholder="서울시 서초구 서초대로 456"
            value={formData.arrivalAddress}
            onChange={handleInputChange}
            error={errors.arrivalAddress}
            required
          />
          
          <Input
            id="arrivalFloor"
            name="arrivalFloor"
            label="도착지 층수"
            type="number"
            placeholder="5"
            value={formData.arrivalFloor}
            onChange={handleInputChange}
            min="1"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              도착지 엘리베이터 유무
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="arrivalElevator"
                  value="있음"
                  checked={formData.arrivalElevator === '있음'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">있음</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="arrivalElevator"
                  value="없음"
                  checked={formData.arrivalElevator === '없음'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">없음</span>
              </label>
            </div>
          </div>
        </div>

        {/* 이사 / 배송 정보 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">이사 / 배송 정보</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이사 유형 <span className="text-red-500">*</span>
            </label>
            <select
              id="movingType"
              name="movingType"
              value={formData.movingType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent ${
                errors.movingType ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">선택해주세요</option>
              <option value="원룸">원룸</option>
              <option value="투룸">투룸</option>
              <option value="가족 이사">가족 이사</option>
              <option value="사무실">사무실</option>
              <option value="일반 배송">일반 배송</option>
            </select>
            {errors.movingType && (
              <p className="text-sm text-red-600 mt-1">{errors.movingType}</p>
            )}
          </div>
          
          <Input
            id="preferredDate"
            name="preferredDate"
            label="희망 날짜"
            type="date"
            value={formData.preferredDate}
            onChange={handleInputChange}
            error={errors.preferredDate}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              희망 시간대 <span className="text-red-500">*</span>
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent ${
                errors.preferredTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">선택해주세요</option>
              <option value="오전">오전</option>
              <option value="오후">오후</option>
              <option value="저녁">저녁</option>
            </select>
            {errors.preferredTime && (
              <p className="text-sm text-red-600 mt-1">{errors.preferredTime}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 옵션
            </label>
            <div className="space-y-2">
              {['포장이사', '피아노', '대형 가전', '에어컨 탈부착', '기타'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    name="additionalOptions"
                    value={option}
                    checked={formData.additionalOptions.includes(option)}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요청 사항 / 메모
            </label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              rows={4}
              placeholder="추가 요청사항을 입력해주세요."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 동의 */}
        <div className="space-y-4">
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                name="privacyAgreement"
                checked={formData.privacyAgreement}
                onChange={handleInputChange}
                className="mt-1 mr-2"
              />
              <span className="text-sm text-gray-700">
                개인정보 수집 및 이용에 동의합니다. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.privacyAgreement && (
              <p className="text-sm text-red-600 mt-1">{errors.privacyAgreement}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full sm:w-auto flex-1"
          >
            이사 견적 요청하기
          </Button>
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            초기화
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MovingRequestForm;

