import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">회사소개</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                TOFU는 대한민국 부동산 정보 플랫폼으로, 사용자에게 최고의 거주 공간을 찾을 수 있도록 돕습니다.
              </p>
              <p className="text-gray-700 mb-4">
                우리는 투명하고 정확한 부동산 정보 제공을 통해 사용자의 삶의 질을 향상시키는 것을 목표로 합니다.
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">비전</h2>
              <p className="text-gray-700 mb-4">
                모든 사람에게 맞춤형 거주 공간을 제공하는 것이 우리의 비전입니다.
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">핵심 가치</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>투명성: 모든 정보는 투명하게 제공됩니다</li>
                <li>정확성: 제공되는 정보의 정확성을 최우선으로 합니다</li>
                <li>사용자 중심: 사용자의 니즈를 가장 중요하게 생각합니다</li>
                <li>혁신: 지속적인 기술 혁신을 추구합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;