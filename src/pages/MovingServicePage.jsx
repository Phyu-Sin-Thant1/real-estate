import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

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
      icon: '🏠',
      title: '가정 이사',
      description: '가족 단위의 일반적인 이사 서비스',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      icon: '🛏️',
      title: '원룸 이사',
      description: '싱글 라이프를 위한 컴팩트 이사',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      icon: '🏢',
      title: '사무실 이사',
      description: '비즈니스 공간의 효율적 이전',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      icon: '📦',
      title: '포장이사',
      description: '전문 포장 서비스 포함 이사',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 5,
      icon: '🗄️',
      title: '보관 이사',
      description: '임시 보관이 필요한 이사 서비스',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 6,
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-dabang-primary to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              당신의 이사를 더 쉽고 더 똑똑하게.
            </h1>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              복잡한 이사 준비, 이제 스마트하게 해결하세요.
            </p>
            
            {/* Estimate Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">지역 선택</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
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
                    <label className="block text-sm font-medium mb-2">주거 형태</label>
                    <select
                      name="housingType"
                      value={formData.housingType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
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
                    <label className="block text-sm font-medium mb-2">짐 양</label>
                    <select
                      name="movingAmount"
                      value={formData.movingAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
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
                      className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      견적 비교하기
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Service Types Section */}
        <section className="py-16 bg-dabang-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">이사 서비스 종류</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                다양한 이사 상황에 맞춘 전문 서비스를 제공합니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceTypes.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                >
                  <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  
                  <button className="text-dabang-primary font-medium hover:text-dabang-primary/80 transition-colors">
                    상세 보기 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Companies Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 이사업체</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                엄선된 신뢰할 수 있는 이사업체들입니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <div key={company.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <img 
                      src={company.image} 
                      alt={company.name} 
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-5 h-5 ${i < Math.floor(company.rating) ? 'fill-current' : 'fill-none'}`} 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">제공 서비스:</span> {company.services}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">가격대:</span> {company.priceRange}
                    </p>
                  </div>
                  
                  <button className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    견적 받기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Estimate Calculator Section */}
        <section className="py-16 bg-dabang-background">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">빠른 견적 계산기</h2>
              
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
                
                <div className="bg-gradient-to-r from-dabang-primary to-blue-700 rounded-xl p-6 text-center text-white">
                  <p className="text-lg mb-2">예상 비용</p>
                  <p className="text-3xl font-bold">
                    {min}만 ~ {max}만 원
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/moving/register')}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
                  >
                    정확한 견적 신청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Moving Checklist Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">이사 준비 체크리스트</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                놓치지 말고 꼼꼼하게 준비하세요
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {checklistItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-dabang-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-dabang-primary text-xl font-bold">{index + 1}</span>
                  </div>
                  <p className="font-medium text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Review Carousel Section */}
        <section className="py-16 bg-dabang-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">고객 후기</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                실제로 이용하신 고객님들의 생생한 후기입니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'fill-none'}`} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                  
                  <p className="font-medium text-gray-900">- {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-dabang-primary to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 이사 견적 받아보세요!
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              최대 3개의 견적을 비교해보고 최저가로 이사하세요
            </p>
            <button className="bg-white text-dabang-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg">
              견적 비교하기
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovingServicePage;