import React from 'react';

const ListingsPage = () => {
  const listings = [
    { id: 1, title: '강남구 역삼동 아파트', type: '매매', price: '12억 5천만원', status: '판매중', views: 234 },
    { id: 2, title: '서초구 서초동 오피스텔', type: '전세', price: '3억원', status: '판매중', views: 156 },
    { id: 3, title: '송파구 잠실동 아파트', type: '월세', price: '보증금 5천만원 / 월 150만원', status: '계약완료', views: 89 },
    { id: 4, title: '강동구 천호동 주택', type: '매매', price: '8억원', status: '판매중', views: 312 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매물 관리</h1>
          <p className="text-gray-600 mt-1">등록된 매물을 관리하세요</p>
        </div>
        <button className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors text-sm font-medium">
          새 매물 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">이미지</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">유형</span>
                  <span className="text-sm font-medium text-gray-900">{listing.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">가격</span>
                  <span className="text-sm font-medium text-dabang-primary">{listing.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">조회수</span>
                  <span className="text-sm text-gray-900">{listing.views}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  listing.status === '판매중' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.status}
                </span>
                <button className="text-sm text-dabang-primary hover:text-dabang-primary/80">
                  상세보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;

