import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">1:1 문의</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">문의하기</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      휴대폰 번호
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      문의 유형
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    >
                      <option value="">선택하세요</option>
                      <option value="general">일반 문의</option>
                      <option value="account">계정 관련</option>
                      <option value="service">서비스 이용</option>
                      <option value="bug">버그 신고</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      문의 내용
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-dabang-primary focus:border-dabang-primary"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    문의하기
                  </button>
                </form>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">고객센터 정보</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">운영 시간</h3>
                    <p className="text-gray-600">평일: 오전 9시 ~ 오후 6시</p>
                    <p className="text-gray-600">점심시간: 오후 12시 ~ 오후 1시</p>
                    <p className="text-gray-600 mt-2">토요일: 오전 10시 ~ 오후 4시</p>
                    <p className="text-gray-600">(일요일 및 공휴일 휴무)</p>
                  </div>
                  
                  <div className="p-6 bg-white rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">연락처</h3>
                    <p className="text-gray-600">전화: 1234-5678</p>
                    <p className="text-gray-600">이메일: help@tofu.com</p>
                  </div>
                  
                  <div className="p-6 bg-white rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">자주 묻는 질문</h3>
                    <p className="text-gray-600 mb-4">
                      대부분의 질문은 FAQ에서 빠르게 답변을 찾으실 수 있습니다.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/faq'}
                      className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
                    >
                      FAQ 바로가기 →
                    </button>
                  </div>
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

export default ContactPage;