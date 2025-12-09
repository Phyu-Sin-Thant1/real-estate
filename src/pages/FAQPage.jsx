import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: '회원가입은 어떻게 하나요?',
      answer: '홈페이지 상단의 "회원가입" 버튼을 클릭하시면 회원가입 페이지로 이동합니다. 이메일 주소와 비밀번호, 기본 정보를 입력하시면 가입이 완료됩니다.'
    },
    {
      question: '매물 정보는 어떻게 업데이트되나요?',
      answer: '저희는 다양한 중개사들과 협력하여 실시간으로 매물 정보를 업데이트하고 있습니다. 새로운 매물이 등록되거나 기존 매물의 정보가 변경되면 즉시 반영됩니다.'
    },
    {
      question: '관심목록은 어떻게 사용하나요?',
      answer: '매물 목록이나 상세 페이지에서 하트 아이콘을 클릭하시면 관심목록에 추가됩니다. 마이페이지에서 저장된 관심목록을 확인하고 관리할 수 있습니다.'
    },
    {
      question: '중개사와 어떻게 연락하나요?',
      answer: '매물 상세 페이지 하단의 "문의하기" 버튼을 통해 중개사와 직접 연락할 수 있습니다. 전화, 카카오톡, 방문 예약 등 다양한 방식으로 상담이 가능합니다.'
    },
    {
      question: '회원 정보를 수정하고 싶어요',
      answer: '마이페이지에서 회원 정보를 수정할 수 있습니다. 로그인 후 우측 상단의 프로필 아이콘을 클릭하여 "내 프로필"로 이동하시면 정보 수정이 가능합니다.'
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">자주 묻는 질문</h1>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    className="flex justify-between items-center w-full p-6 text-left"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-white rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">다른 질문이 있으신가요?</h2>
              <p className="text-gray-600 mb-4">
                위의 질문들 외에도 도움이 필요하시면 1:1 문의를 통해 언제든지 저희에게 연락주세요.
              </p>
              <button className="px-4 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors">
                1:1 문의하기
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;