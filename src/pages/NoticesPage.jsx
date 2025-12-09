import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const NoticesPage = () => {
  const notices = [
    {
      id: 1,
      title: '시스템 점검 안내',
      date: '2023-11-20',
      content: '서비스 개선을 위해 11월 25일 새벽 2시부터 5시까지 시스템 점검이 진행됩니다. 점검 시간 동안 서비스 이용이 불가능하오니 양해 부탁드립니다.'
    },
    {
      id: 2,
      title: '개인정보 처리방침 변경 안내',
      date: '2023-11-15',
      content: '개인정보 보호법 개정에 따라 당사의 개인정보 처리방침이 일부 변경됩니다. 자세한 내용은 개인정보 처리방침 페이지에서 확인하실 수 있습니다.'
    },
    {
      id: 3,
      title: '새로운 매물 등록 기능 추가',
      date: '2023-11-10',
      content: '중개사 회원을 위한 새로운 매물 등록 기능이 추가되었습니다. 더욱 편리하게 매물을 등록하고 관리해보세요.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">공지사항</h1>
            <div className="space-y-6">
              {notices.map((notice) => (
                <div key={notice.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{notice.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{notice.date}</p>
                  <p className="text-gray-700">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NoticesPage;