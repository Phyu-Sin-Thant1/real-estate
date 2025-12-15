import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useDeliveryQuotes } from '../../context/DeliveryQuotesContext';

const QuoteRequestModal = ({ isOpen, onClose }) => {
  const { addQuote } = useDeliveryQuotes();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    departureAddress: '',
    deliveryAddress: '',
    movingDate: '',
    movingAmount: '',
    memo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = '연락처를 입력해주세요.';
    }

    if (!formData.departureAddress.trim()) {
      newErrors.departureAddress = '출발지 주소를 입력해주세요.';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = '도착지 주소를 입력해주세요.';
    }

    if (!formData.movingDate) {
      newErrors.movingDate = '이사 날짜를 선택해주세요.';
    }

    if (!formData.movingAmount) {
      newErrors.movingAmount = '짐의 양을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const payload = {
        customerName: formData.name,
        phone: formData.contact,
        email: formData.email,
        pickupAddress: formData.departureAddress,
        deliveryAddress: formData.deliveryAddress,
        desiredDate: formData.movingDate,
        moveType: formData.movingAmount,
        createdAt: new Date().toISOString().split('T')[0],
        status: '신규',
        notes: formData.memo || '',
        customerMemo: formData.memo || ''
      };

      addQuote(payload);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    }, 500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="정확한 견적 신청하기">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료</h3>
            <p className="text-gray-600">견적 신청이 접수되었습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="이름을 입력하세요"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="'-' 없이 숫자만 입력"
              />
              {errors.contact && <p className="text-sm text-red-600 mt-1">{errors.contact}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                출발지 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="departureAddress"
                value={formData.departureAddress}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.departureAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="서울시 강남구 테헤란로 123"
              />
              {errors.departureAddress && <p className="text-sm text-red-600 mt-1">{errors.departureAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                도착지 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.deliveryAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="서울시 서초구 서초대로 456"
              />
              {errors.deliveryAddress && <p className="text-sm text-red-600 mt-1">{errors.deliveryAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이사 날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="movingDate"
                value={formData.movingDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.movingDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.movingDate && <p className="text-sm text-red-600 mt-1">{errors.movingDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                짐의 양 <span className="text-red-500">*</span>
              </label>
              <select
                name="movingAmount"
                value={formData.movingAmount}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                  errors.movingAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">선택해주세요</option>
                <option value="소">소</option>
                <option value="중">중</option>
                <option value="대">대</option>
                <option value="특대">특대</option>
              </select>
              {errors.movingAmount && <p className="text-sm text-red-600 mt-1">{errors.movingAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요청사항
              </label>
              <textarea
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="추가 요청사항을 입력해주세요"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? '신청 중...' : '견적 신청하기'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default QuoteRequestModal;