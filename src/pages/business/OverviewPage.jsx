import React from 'react';

const OverviewPage = () => {
  const stats = [
    { label: '총 고객 수', value: '1,234', change: '+12%' },
    { label: '이번 달 매출', value: '₩45,678,900', change: '+8%' },
    { label: '진행 중인 작업', value: '23', change: '+5' },
    { label: '완료율', value: '94%', change: '+2%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className="text-sm text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">새로운 요청이 접수되었습니다</p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
              <button className="text-sm text-dabang-primary hover:text-dabang-primary/80">
                보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

