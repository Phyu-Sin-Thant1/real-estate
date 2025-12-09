import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">이용 방법</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                TOFU를 통해 손쉽게 원하는 부동산을 찾는 방법을 알려드립니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-dabang-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">회원가입</h3>
                  <p className="text-gray-600">
                    TOFU에 회원가입하여 다양한 서비스를 이용하세요. 간단한 정보 입력으로 즉시 시작할 수 있습니다.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-dabang-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">매물 검색</h3>
                  <p className="text-gray-600">
                    지도 검색 또는 카테고리별 검색을 통해 원하는 조건의 매물을 찾아보세요.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-dabang-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">상세 확인</h3>
                  <p className="text-gray-600">
                    관심 있는 매물의 상세 정보를 확인하고, 관심목록에 추가하거나 중개사와 연락하세요.
                  </p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">추가 기능</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>관심목록</strong>: 마음에 드는 매물을 저장하여 쉽게 다시 확인할 수 있습니다</li>
                <li><strong>매물 알림</strong>: 조건에 맞는 새로운 매물이 등록되면 알림을 받을 수 있습니다</li>
                <li><strong>비교 기능</strong>: 여러 매물을 비교하여 선택 결정을 도와줍니다</li>
                <li><strong>전문가 상담</strong>: 경험 많은 중개사와 직접 상담할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;