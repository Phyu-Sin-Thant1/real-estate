import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보 처리방침</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                TOFU(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 
                이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제1조 (개인정보의 처리 목적)</h2>
              <p className="text-gray-700 mb-4">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 
                이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 
                필요한 조치를 이행할 예정입니다.
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회원 가입 및 관리
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
                    <li>서비스 부정이용 방지</li>
                  </ol>
                </li>
                <li>서비스 제공
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>부동산 정보 제공, 관심목록 제공</li>
                    <li>맞춤 서비스 제공</li>
                  </ol>
                </li>
                <li>고충처리
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제2조 (개인정보의 처리 및 보유 기간)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 
                    개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
                <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>회원 가입 및 관리: 이용 종료 시까지</li>
                    <li>서비스 제공: 서비스 종료 시까지</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제3조 (처리하는 개인정보의 항목)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 서비스 제공을 위해 아래와 같은 개인정보를 처리하고 있습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>필수항목: 이메일 주소, 비밀번호, 이름, 휴대전화번호</li>
                    <li>자동 수집항목: IP주소, 쿠키, 서비스 이용 기록</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제4조 (개인정보의 제3자 제공)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
                    정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 
                    경우에만 개인정보를 제3자에게 제공합니다.</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제5조 (개인정보처리의 위탁)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>위탁받는 자: AWS</li>
                    <li>위탁하는 업무의 내용: 데이터 저장 및 서버 운영</li>
                  </ol>
                </li>
                <li>회사는 위탁계약 체결시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 
                    기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 
                    계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
                <li>제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 
                    모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</li>
                <li>제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 
                    이 경우 "개인정보 처리 방법에 관한 고시" 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제7조 (처리하는 개인정보의 파기절차)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                    지체없이 해당 개인정보를 파기합니다.</li>
                <li>정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 
                    다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 
                    옮기거나 보관장소를 달리하여 보존합니다.</li>
                <li>개인정보 파기의 절차 및 방법은 다음과 같습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>파기절차: 파기 대상 개인정보는 내부 방침 및 기타 관련 법령에 따라 파기합니다.</li>
                    <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제8조 (개인정보의 안전성 확보조치)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>개인정보 취급 직원의 최소화 및 교육</li>
                    <li>개인정보에 대한 접근 제한</li>
                    <li>개인정보의 암호화</li>
                    <li>접속기록의 보관 및 위변조 방지</li>
                  </ol>
                </li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제9조 (개인정보 보호책임자)</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
                    불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
                  <ol className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>개인정보 보호책임자
                      <ul className="list-disc pl-6 mt-1">
                        <li>성명: 개인정보 보호책임자</li>
                        <li>직책: 개인정보 보호책임자</li>
                        <li>연락처: help@tofu.com</li>
                      </ul>
                    </li>
                  </ol>
                </li>
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

export default PrivacyPage;