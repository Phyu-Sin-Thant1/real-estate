import React, { useState } from 'react';
import { addLead } from '../../mock/realEstateData';

const InquiryModal = ({ isOpen, onClose, listing }) => {
  // Don't render if not open
  if (!isOpen) return null;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: '일반 문의',
    visitDate: '',
    message: '',
    consent: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.inquiryType || !formData.message || !formData.consent) {
      alert("필수 항목을 모두 입력하고 동의에 체크해주세요.");
      return;
    }

    try {
      // Add lead to mock data
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        inquiryType: formData.inquiryType,
        visitDate: formData.visitDate,
        message: formData.message,
        propertyName: listing ? listing.title : 'Unknown Property'
      };

      await addLead(leadData);
      
      // Success message
      alert("문의가 접수되었습니다. 담당자가 곧 연락드릴 예정입니다.");
      
      // Reset form and close modal
      setFormData({
        name: '',
        phone: '',
        email: '',
        inquiryType: '일반 문의',
        visitDate: '',
        message: '',
        consent: false
      });
      onClose();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert("문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">매물 문의하기</h2>
          {listing ? (
            <p className="text-sm text-gray-500 mt-1">
              {listing.title} / {listing.address}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              선택된 매물 정보가 없습니다.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력해주세요"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              문의 유형 *
            </label>
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="일반 문의">일반 문의</option>
              <option value="방문 예약">방문 예약</option>
              <option value="계약/조건 상담">계약/조건 상담</option>
            </select>
          </div>

          {/* Visit Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              희망 방문일
            </label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              문의 내용 *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="궁금한 점이나 요청 사항을 자유롭게 작성해주세요."
              rows="5"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Consent */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">
                문의 상담을 위해 개인정보 수집 및 이용에 동의합니다.
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              문의 보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;