import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { createQuoteRequest } from '../../store/quoteRequestsStore';

const ServiceRequestModal = ({ isOpen, onClose, selectedPackage, selectedAgency }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupAddress: '',
    deliveryAddress: '',
    serviceDate: '',
    message: ''
  });

  const [extraOptions, setExtraOptions] = useState({
    extraFloors: 0,
    largeItems: 0,
    fragileHandling: 0,
    priorityDelivery: false,
    packagingType: '',
    numberOfRooms: 0,
    specialInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or package changes
  useEffect(() => {
    if (isOpen && selectedPackage) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        pickupAddress: '',
        deliveryAddress: '',
        serviceDate: '',
        message: ''
      });
      setExtraOptions({
        extraFloors: 0,
        largeItems: 0,
        fragileHandling: 0,
        priorityDelivery: false,
        packagingType: '',
        numberOfRooms: 0,
        specialInstructions: ''
      });
    }
  }, [isOpen, selectedPackage, selectedAgency]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExtraOptionChange = (optionKey, value) => {
    setExtraOptions(prev => ({
      ...prev,
      [optionKey]: typeof value === 'boolean' ? value : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    
    // Use agency's base price if available, otherwise use package price
    const basePrice = selectedAgency?.basePrice || selectedPackage.price;
    let total = basePrice;
    
    // Add-on prices
    if (extraOptions.extraFloors > 0) {
      total += extraOptions.extraFloors * 20000; // ₩20,000 per floor
    }
    if (extraOptions.largeItems > 0) {
      total += extraOptions.largeItems * 30000; // ₩30,000 per item
    }
    if (extraOptions.fragileHandling > 0) {
      total += extraOptions.fragileHandling * 10000; // ₩10,000 per item
    }
    if (extraOptions.priorityDelivery) {
      total += 50000; // ₩50,000 for priority delivery
    }
    if (extraOptions.numberOfRooms > 0 && selectedPackage.id === 'office-relocation') {
      total += extraOptions.numberOfRooms * 40000; // ₩40,000 per room for office relocation
    }
    
    return total;
  };

  const formatPrice = (price) => {
    if (!price) return '₩0';
    if (price >= 10000) {
      return `₩${(price / 10000).toFixed(0)}만`;
    }
    return `₩${price.toLocaleString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.pickupAddress || !formData.deliveryAddress) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = calculateTotalPrice();
      
      // Format extra options text
      const extraOptionsText = Object.entries(extraOptions)
        .filter(([key, value]) => {
          if (key === 'specialInstructions') {
            return value && value.toString().trim().length > 0;
          }
          if (key === 'packagingType') {
            return value && value.toString().trim().length > 0;
          }
          if (key === 'priorityDelivery') {
            return value === true;
          }
          return value > 0;
        })
        .map(([key, value]) => {
          if (key === 'specialInstructions') {
            return `Special Instructions: ${value}`;
          }
          if (key === 'packagingType') {
            return `Packaging Type: ${value}`;
          }
          if (key === 'priorityDelivery') {
            return 'Priority Delivery: Yes';
          }
          if (key === 'extraFloors') {
            return `Extra Floors: ${value} (₩${(value * 20000).toLocaleString()})`;
          }
          if (key === 'largeItems') {
            return `Large Items: ${value} (₩${(value * 30000).toLocaleString()})`;
          }
          if (key === 'fragileHandling') {
            return `Fragile Handling: ${value} items (₩${(value * 10000).toLocaleString()})`;
          }
          if (key === 'numberOfRooms') {
            return `Number of Rooms: ${value} (₩${(value * 40000).toLocaleString()})`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');

      const message = extraOptionsText 
        ? `Additional Options:\n${extraOptionsText}\n\n${formData.message || ''}`
        : formData.message;

      // Create quote request
      createQuoteRequest({
        serviceId: selectedAgency?.serviceId || selectedPackage.id,
        serviceName: selectedPackage.name,
        serviceType: selectedPackage.id,
        agencyId: selectedAgency?.id || null,
        agencyName: selectedAgency?.name || 'To be assigned',
        
        // Customer information
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        
        // Service details
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        preferredDate: formData.serviceDate,
        customerMessage: message,
        
        // Pricing
        basePrice: basePrice,
        totalPrice: totalPrice,
        priceBreakdown: {
          basePrice: basePrice,
          extraFloors: extraOptions.extraFloors > 0 
            ? extraOptions.extraFloors * 20000
            : 0,
          largeItems: extraOptions.largeItems > 0
            ? extraOptions.largeItems * 30000
            : 0,
          fragileHandling: extraOptions.fragileHandling > 0
            ? extraOptions.fragileHandling * 10000
            : 0,
          priorityDelivery: extraOptions.priorityDelivery ? 50000 : 0,
          numberOfRooms: extraOptions.numberOfRooms > 0 && selectedPackage.id === 'office-relocation'
            ? extraOptions.numberOfRooms * 40000
            : 0
        },
        
        // Extra options details
        extraOptions: {
          ...extraOptions
        },
        
        // Service limitations
        serviceLimitations: selectedPackage.limits || null
      });

      alert('서비스 요청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('요청 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPackage) return null;

  const totalPrice = calculateTotalPrice();
  const basePrice = selectedAgency?.basePrice || selectedPackage.price;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Customization">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Agency and Package Info Header */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Selected Agency: {selectedAgency?.name || 'Not Selected'}</h3>
                <p className="text-sm text-gray-700 mt-1">Package: {selectedPackage.name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {formatPrice(basePrice)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Base Price</p>
              </div>
            </div>
            <div className="pt-3 border-t border-orange-200">
              <p className="text-sm font-semibold text-gray-700">Service Limits:</p>
              <p className="text-sm text-gray-600">{selectedPackage.limits}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">고객 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="010-0000-0000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">주소 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                출발지 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="출발지 주소를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                도착지 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="도착지 주소를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                서비스 희망일
              </label>
              <input
                type="date"
                name="serviceDate"
                value={formData.serviceDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Extra Options Based on Service Type */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">추가 옵션</h3>
          <div className="space-y-4">
            {/* Extra Floors - Available for Home Delivery and Office Relocation */}
            {(selectedPackage.id === 'home-delivery' || selectedPackage.id === 'standard-delivery' || selectedPackage.id === 'office-relocation') && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-semibold text-gray-900">추가 층수</label>
                  <span className="text-sm font-medium text-orange-600">₩20,000/층</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={extraOptions.extraFloors}
                  onChange={(e) => handleExtraOptionChange('extraFloors', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="추가 층수"
                />
                {extraOptions.extraFloors > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    +₩{(extraOptions.extraFloors * 20000).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Large Items - Available for all services */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-900">대형 물품</label>
                <span className="text-sm font-medium text-orange-600">₩30,000/개</span>
              </div>
              <input
                type="number"
                min="0"
                max="20"
                value={extraOptions.largeItems}
                onChange={(e) => handleExtraOptionChange('largeItems', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="대형 물품 개수"
              />
              {extraOptions.largeItems > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  +₩{(extraOptions.largeItems * 30000).toLocaleString()}
                </p>
              )}
            </div>

            {/* Fragile Handling - Available for all services */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-900">깨지기 쉬운 물품</label>
                <span className="text-sm font-medium text-orange-600">₩10,000/개</span>
              </div>
              <input
                type="number"
                min="0"
                max="20"
                value={extraOptions.fragileHandling}
                onChange={(e) => handleExtraOptionChange('fragileHandling', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="깨지기 쉬운 물품 개수"
              />
              {extraOptions.fragileHandling > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  +₩{(extraOptions.fragileHandling * 10000).toLocaleString()}
                </p>
              )}
            </div>

            {/* Priority Delivery - Only for Express Delivery */}
            {selectedPackage.id === 'express-delivery' && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extraOptions.priorityDelivery}
                    onChange={(e) => handleExtraOptionChange('priorityDelivery', e.target.checked)}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">당일 배송 (Priority)</span>
                      <span className="text-sm font-medium text-orange-600">+₩50,000</span>
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Packaging Type - Only for Express Delivery */}
            {selectedPackage.id === 'express-delivery' && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block font-semibold text-gray-900 mb-3">포장 유형</label>
                <select
                  value={extraOptions.packagingType}
                  onChange={(e) => handleExtraOptionChange('packagingType', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">선택 안함</option>
                  <option value="standard">표준 포장</option>
                  <option value="premium">프리미엄 포장</option>
                  <option value="fragile">깨지기 쉬운 물품 전용 포장</option>
                </select>
              </div>
            )}

            {/* Number of Rooms - Only for Office Relocation */}
            {selectedPackage.id === 'office-relocation' && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-semibold text-gray-900">추가 방/구역 수</label>
                  <span className="text-sm font-medium text-orange-600">₩40,000/개</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={extraOptions.numberOfRooms}
                  onChange={(e) => handleExtraOptionChange('numberOfRooms', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="추가 방/구역 수"
                />
                {extraOptions.numberOfRooms > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    +₩{(extraOptions.numberOfRooms * 40000).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block font-semibold text-gray-900 mb-3">특별 요청사항</label>
              <textarea
                name="specialInstructions"
                value={extraOptions.specialInstructions}
                onChange={(e) => handleExtraOptionChange('specialInstructions', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="특별한 요청사항이 있으시면 입력해주세요"
              />
            </div>
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            추가 메시지
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="추가로 전달하고 싶은 내용이 있으시면 입력해주세요"
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                기본 가격 {selectedAgency && `(${selectedAgency.name})`}
              </span>
              <span className="font-semibold text-gray-900">{formatPrice(basePrice)}</span>
            </div>
            {extraOptions.extraFloors > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">추가 층수 ({extraOptions.extraFloors}층)</span>
                <span className="font-semibold text-gray-900">
                  +{formatPrice(extraOptions.extraFloors * 20000)}
                </span>
              </div>
            )}
            {extraOptions.largeItems > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">대형 물품 ({extraOptions.largeItems}개)</span>
                <span className="font-semibold text-gray-900">
                  +{formatPrice(extraOptions.largeItems * 30000)}
                </span>
              </div>
            )}
            {extraOptions.fragileHandling > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">깨지기 쉬운 물품 ({extraOptions.fragileHandling}개)</span>
                <span className="font-semibold text-gray-900">
                  +{formatPrice(extraOptions.fragileHandling * 10000)}
                </span>
              </div>
            )}
            {extraOptions.priorityDelivery && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">당일 배송</span>
                <span className="font-semibold text-gray-900">+{formatPrice(50000)}</span>
              </div>
            )}
            {extraOptions.numberOfRooms > 0 && selectedPackage.id === 'office-relocation' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">추가 방/구역 ({extraOptions.numberOfRooms}개)</span>
                <span className="font-semibold text-gray-900">
                  +{formatPrice(extraOptions.numberOfRooms * 40000)}
                </span>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">총 가격</span>
              <span className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              // Navigate to checkout/payment page
              alert('Proceeding to payment page...');
              // In real app: navigate(`/checkout/${selectedAgency?.serviceId || selectedPackage.id}`);
            }}
            className="flex-1 px-6 py-3 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-300"
          >
            Proceed to Buy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceRequestModal;

