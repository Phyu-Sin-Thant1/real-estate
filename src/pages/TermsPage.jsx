import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">이용약관</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                본 약관은 TOFU(이하 "회사")가 제공하는 모든 서비스(이하 "서비스")의 이용에 적용됩니다.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 mb-4">
                이 약관은 회사가 제공하는 서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제2조 (정의)</h2>
              <p className="text-gray-700 mb-4">
                이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>"서비스"란 회사가 이용자에게 제공하는 부동산 정보 및 관련 서비스를 의미합니다.</li>
                <li>"이용자"란 이 약관에 따라 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                <li>"회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 의미합니다.</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제3조 (약관의 명시와 개정)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 이 약관의 내용과 상호, 영업소 소재지, 대표자의 성명, 사업자등록번호 등을 이용자가 쉽게 알 수 있도록 초기 서비스 화면에 게시합니다.</li>
                <li>회사는 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「소비자기본법」, 「개인정보 보호법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
                <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제4조 (서비스의 제공 및 변경)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 다음과 같은 업무를 수행합니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>부동산 매물 정보 제공</li>
                    <li>부동산 관련 컨텐츠 제공</li>
                    <li>기타 회사가 정하는 서비스</li>
                  </ol>
                </li>
                <li>회사는 서비스의 내용을 변경하거나 중단할 수 있으며, 이 경우 변경 또는 중단될 서비스의 내용 및 사유와 일시를 이용자에게 통지합니다.</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제5조 (회원가입)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</li>
                <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>가입신청자가 이 약관 제6조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제6조제3항에 의한 회원자격 상실 후 1년이 경과한 자로서 회사의 회원재가입 승낙을 얻은 경우에는 예외로 한다.</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제6조 (회원 탈퇴 및 자격 상실 등)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</li>
                <li>회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                    <li>회사 서비스 이용에 있어서 본 약관을 위반하거나 기타 불량행위를 하는 경우</li>
                    <li>기타 회사가 정한 이용 요금을 정당한 사유 없이 연체하는 경우</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제7조 (개인정보보호)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 최소한의 개인정보를 수집합니다.</li>
                <li>회사는 회원의 개인정보를 수집·이용하는 때에는 당해 회원에게 그 목적을 고지하고 동의를 받습니다.</li>
                <li>회사는 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 회원에게 그 목적을 고지하고 동의를 받습니다.</li>
                <li>회사는 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보보호책임자의 신원(소속, 성명 및 전화번호), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은 자, 제공목적 및 제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.</li>
              </ol>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  공고일자: 2023년 11월 20일<br />
                  시행일자: 2023년 12월 1일
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;