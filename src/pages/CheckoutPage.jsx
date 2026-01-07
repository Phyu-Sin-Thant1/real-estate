import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getServiceById } from '../mock/deliveryServices';
import { getAgencyById } from '../mock/agencies';

const CheckoutPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [agency, setAgency] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupAddress: '',
    deliveryAddress: '',
    serviceDate: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
    specialInstructions: ''
  });

  useEffect(() => {
    const serviceData = getServiceById(serviceId);
    if (!serviceData) {
      navigate('/delivery-services');
      return;
    }
    setService(serviceData);
    
    if (serviceData.agencyId) {
      const agencyData = getAgencyById(serviceData.agencyId, 'moving');
      setAgency(agencyData);
    }
  }, [serviceId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    if (!price) return '₩0';
    return `₩${price.toLocaleString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would process the payment
    alert('결제가 완료되었습니다! 서비스 예약이 확정되었습니다.');
    navigate('/my-page');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">서비스를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li>
                <button 
                  onClick={() => navigate('/delivery-services')} 
                  className="text-sm text-gray-600 hover:text-orange-600"
                >
                  배송 서비스
                </button>
              </li>
              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li>
                <span className="text-sm text-gray-900 font-medium">결제</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">서비스 정보</h2>
                
                {/* Service Details */}
                <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/30 rounded-xl p-6 mb-6 border border-orange-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      {agency && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">제공 업체:</span>
                          <span className="text-sm font-semibold text-gray-900">{agency.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        {formatPrice(service.minPrice)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">시작 가격</p>
                    </div>
                  </div>
                  
                  {service.limitations && (
                    <div className="pt-4 border-t border-orange-200">
                      <p className="text-xs font-semibold text-orange-900 mb-2">서비스 제한사항:</p>
                      <div className="text-xs text-orange-800 space-y-1">
                        {service.limitations.maxFloors && (
                          <p>• 최대 {service.limitations.maxFloors}층</p>
                        )}
                        {service.limitations.maxWeight && (
                          <p>• 최대 {service.limitations.maxWeight}kg</p>
                        )}
                        {service.limitations.maxDistance && service.limitations.maxDistance > 0 && (
                          <p>• {service.limitations.maxDistance}km 이내</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Information Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">결제 방법</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm font-medium text-gray-700">신용카드</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank"
                            checked={formData.paymentMethod === 'bank'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm font-medium text-gray-700">계좌이체</span>
                        </label>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              카드 번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              required={formData.paymentMethod === 'card'}
                              maxLength={19}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                만료일 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="cardExpiry"
                                value={formData.cardExpiry}
                                onChange={handleInputChange}
                                required={formData.paymentMethod === 'card'}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                CVC <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="cardCVC"
                                value={formData.cardCVC}
                                onChange={handleInputChange}
                                required={formData.paymentMethod === 'card'}
                                placeholder="123"
                                maxLength={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              카드 소유자명 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              required={formData.paymentMethod === 'card'}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                              placeholder="카드에 표시된 이름"
                            />
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === 'bank' && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">
                            계좌이체를 선택하시면 주문 확인 후 계좌 정보를 안내해드립니다.
                          </p>
                          <p className="text-xs text-gray-500">
                            입금 확인 후 서비스가 확정됩니다.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      특별 요청사항
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="특별한 요청사항이 있으시면 입력해주세요"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? '결제 처리 중...' : `₩${service.minPrice.toLocaleString()} 결제하기`}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">주문 요약</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">서비스</span>
                    <span className="font-semibold text-gray-900">{service.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">가격</span>
                    <span className="font-semibold text-gray-900">{formatPrice(service.minPrice)}</span>
                  </div>
                  {service.estimatedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">예상 소요시간</span>
                      <span className="font-semibold text-gray-900">{service.estimatedTime}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">총 결제금액</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      {formatPrice(service.minPrice)}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-green-900">안전한 결제</span>
                  </div>
                  <p className="text-xs text-green-700">
                    모든 결제 정보는 암호화되어 안전하게 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;



