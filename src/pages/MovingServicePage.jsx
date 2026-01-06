import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import QuoteRequestModal from '../components/delivery/QuoteRequestModal';
const MovingServicePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    region: '',
    housingType: '',
    movingAmount: ''
  });

  const serviceTypes = [
    {
      id: 1,
      serviceTypeId: 'home-delivery',
      icon: '🏠',
      title: '가정 이사',
      description: '가족 단위의 일반적인 이사 서비스',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      serviceTypeId: 'home-delivery',
      icon: '🛏️',
      title: '원룸 이사',
      description: '싱글 라이프를 위한 컴팩트 이사',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      serviceTypeId: 'office-relocation',
      icon: '🏢',
      title: '사무실 이사',
      description: '비즈니스 공간의 효율적 이전',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      serviceTypeId: 'packing-moving',
      icon: '📦',
      title: '포장이사',
      description: '전문 포장 서비스 포함 이사',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 5,
      serviceTypeId: 'warehouse-delivery',
      icon: '🗄️',
      title: '보관 이사',
      description: '임시 보관이 필요한 이사 서비스',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 6,
      serviceTypeId: 'international-delivery',
      icon: '🌎',
      title: '해외 이사',
      description: '국제 이주를 위한 전문 이사',
      color: 'from-teal-400 to-teal-600'
    }
  ];

  const companies = [
    {
      id: 1,
      name: '한국이사',
      rating: 4.8,
      services: '가정/사무실 이사',
      priceRange: '50만 ~ 200만 원',
      image: 'https://placehold.co/80x80'
    },
    {
      id: 2,
      name: '스피디 이사',
      rating: 4.7,
      services: '원룸/포장 이사',
      priceRange: '30만 ~ 150만 원',
      image: 'https://placehold.co/80x80'
    },
    {
      id: 3,
      name: '글로벌 무브',
      rating: 4.9,
      services: '해외/특수 이사',
      priceRange: '200만 ~ 1000만 원',
      image: 'https://placehold.co/80x80'
    }
  ];

  const checklistItems = [
    '박스 포장',
    '주소 변경',
    '인터넷 이전',
    '관리비 정산',
    '청소',
    '이사 당일 체크'
  ];

  const reviews = [
    {
      id: 1,
      name: '김민수',
      rating: 5,
      comment: '전문적인 포장과 신속한 이사로 매우 만족했습니다. 물품도 하나도 손상되지 않았어요.',
      date: '2023.10.15'
    },
    {
      id: 2,
      name: '이지현',
      rating: 4,
      comment: '친절한 직원들과 합리적인 가격이 좋았습니다. 다음 이사에도 이용할 것 같아요.',
      date: '2023.09.22'
    },
    {
      id: 3,
      name: '박상훈',
      rating: 5,
      comment: '사무실 이사를 맡겼는데 계획도 잘 세워주시고 시간도 정확하게 맞춰주셔서 감사했습니다.',
      date: '2023.08.30'
    }
  ];

  const [estimate, setEstimate] = useState({
    distance: 5,
    items: 3,
    floors: 2
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEstimateChange = (name, value) => {
    setEstimate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateEstimate = () => {
    // Simple calculation formula
    const basePrice = 100000;
    const distanceCost = estimate.distance * 5000;
    const itemsCost = estimate.items * 20000;
    const floorsCost = estimate.floors * 10000;
    const totalPrice = basePrice + distanceCost + itemsCost + floorsCost;
    
    return {
      min: Math.round(totalPrice * 0.8 / 10000),
      max: Math.round(totalPrice * 1.2 / 10000)
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('견적 비교를 시작합니다!');
  };

  const { min, max } = calculateEstimate();

  // Add state for quote modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20 flex flex-col relative">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.03),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.02),transparent_50%)] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom_right,transparent_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <Header />
      
      <main className="flex-1 relative z-10">
        {/* Premium Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Premium Background with Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-orange-50/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.05),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,146,60,0.03),transparent_60%)]"></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
                당신의 이사를<br />
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  더 쉽고 더 똑똑하게
                </span>
              </h1>
              <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto text-gray-600 leading-relaxed">
                복잡한 이사 준비, 이제 스마트하게 해결하세요
              </p>
              
              {/* Status Indicators */}
              <div className="flex items-center justify-center gap-6 mb-8 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>검증된 업체</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>24/7 지원</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>보험 포함</span>
                </div>
              </div>
            </div>
            
            {/* Premium Estimate Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 max-w-5xl mx-auto text-gray-900">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">지역 선택</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white hover:border-gray-300 text-sm font-medium"
                    >
                      <option value="">지역 선택</option>
                      <option value="서울">서울</option>
                      <option value="경기">경기</option>
                      <option value="인천">인천</option>
                      <option value="부산">부산</option>
                      <option value="대구">대구</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">주거 형태</label>
                    <select
                      name="housingType"
                      value={formData.housingType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white hover:border-gray-300 text-sm font-medium"
                    >
                      <option value="">형태 선택</option>
                      <option value="원룸">원룸</option>
                      <option value="투룸">투룸</option>
                      <option value="아파트">아파트</option>
                      <option value="빌라">빌라</option>
                      <option value="단독주택">단독주택</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">짐 양</label>
                    <select
                      name="movingAmount"
                      value={formData.movingAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white hover:border-gray-300 text-sm font-medium"
                    >
                      <option value="">짐 양 선택</option>
                      <option value="소량">소량 (1~2박스)</option>
                      <option value="중간">중간 (3~5박스)</option>
                      <option value="많음">많음 (6박스 이상)</option>
                      <option value="가정집">가정집 전체</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
                    >
                      견적 비교하기
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Divider Section */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200"></div>
          </div>
        </section>

        {/* Premium Service Types Section */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-white">
          {/* Subtle Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.02),transparent_70%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                이사 서비스 <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">종류</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                다양한 이사 상황에 맞춘 전문 서비스를 제공합니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {serviceTypes.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:-translate-y-2 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Premium Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-4xl mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <span className="relative z-10 filter drop-shadow-lg">{service.icon}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-dabang-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <button 
                      onClick={() => navigate(`/delivery-services/${service.serviceTypeId}`)}
                      className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-all duration-300 group-hover:gap-3"
                    >
                      <span>상세 보기</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-bl-full transition-opacity duration-500`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Premium See All Category Button */}
            <div className="text-center mt-10 relative z-10">
              <button
                onClick={() => navigate('/delivery-services')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 cursor-pointer relative z-10"
              >
                <span>전체 카테고리 보기</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Premium Recommended Companies Section */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-white">
          {/* Premium Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.03),transparent_70%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                추천 <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">이사업체</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                엄선된 신뢰할 수 있는 이사업체들입니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company, index) => (
                <div key={company.id} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl p-8 border border-gray-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  {/* Premium Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dabang-primary/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <img 
                          src={company.image} 
                          alt={company.name} 
                          className="w-20 h-20 rounded-2xl object-cover mr-4 border-2 border-gray-200 shadow-lg group-hover:border-dabang-primary transition-colors duration-300"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h3>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(company.rating) ? 'fill-current' : 'fill-none'}`} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-700 font-semibold">{company.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6 space-y-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-dabang-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-bold text-gray-900">제공 서비스:</span> {company.services}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-dabang-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-bold text-gray-900">가격대:</span> {company.priceRange}
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-105">
                      견적 받기
                    </button>
                    
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dabang-primary/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Quick Estimate Calculator Section */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.02),transparent_70%)]"></div>
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  빠른 <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">견적 계산기</span>
                </h2>
                <p className="text-sm text-gray-600">간단한 정보로 예상 비용을 확인하세요</p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700">거리 (km)</label>
                    <span className="text-dabang-primary font-medium">{estimate.distance} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={estimate.distance}
                    onChange={(e) => handleEstimateChange('distance', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dabang-primary"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700">짐의 양</label>
                    <span className="text-dabang-primary font-medium">{estimate.items} 박스</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={estimate.items}
                    onChange={(e) => handleEstimateChange('items', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dabang-primary"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 박스</span>
                    <span>20 박스</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700">층수</label>
                    <span className="text-dabang-primary font-medium">{estimate.floors} 층</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={estimate.floors}
                    onChange={(e) => handleEstimateChange('floors', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dabang-primary"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1층</span>
                    <span>20층</span>
                  </div>
                </div>
                
                <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl p-6 text-center text-white shadow-lg overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  
                  <div className="relative z-10">
                    <p className="text-sm mb-2 font-semibold opacity-90">예상 비용</p>
                    <p className="text-3xl md:text-4xl font-extrabold mb-4">
                      {min}만 ~ {max}만 원
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      정확한 견적 신청하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Moving Checklist Section */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white via-orange-50/15 to-white">
          {/* Premium Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.02),transparent_60%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mb-4 shadow-lg shadow-orange-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                이사 준비 <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">체크리스트</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                놓치지 말고 꼼꼼하게 준비하세요
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {checklistItems.map((item, index) => (
                <div key={index} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl p-6 text-center border border-gray-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  {/* Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dabang-primary/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-2xl font-bold">{index + 1}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors duration-300">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Customer Review Section */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-white">
          {/* Premium Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.02),transparent_60%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mb-4 shadow-lg shadow-orange-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                고객 <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">후기</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                실제로 이용하신 고객님들의 생생한 후기입니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div key={review.id} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl p-8 border border-gray-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  {/* Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-6 h-6 ${i < review.rating ? 'fill-current' : 'fill-none'}`} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{review.comment}"</p>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                      <p className="font-bold text-gray-900">{review.name}</p>
                    </div>
                    
                    {/* Decorative Quote Mark */}
                    <div className="absolute top-4 right-4 text-6xl text-yellow-200/30 font-serif">"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20">
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.04),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.6)_100%)]"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 mb-6 shadow-lg shadow-orange-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 leading-tight">
              지금 바로 이사 견적<br />
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                받아보세요!
              </span>
            </h2>
            <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto text-gray-600 leading-relaxed">
              최대 3개의 견적을 비교해보고 최저가로 이사하세요
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-xl text-base transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105">
              견적 비교하기
            </button>
          </div>
        </section>
      </main>
      
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
      <Footer />
      </div>
    </div>
  );
};

export default MovingServicePage;