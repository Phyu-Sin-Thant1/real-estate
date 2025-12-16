import React, { useMemo } from 'react';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getListingsByPartner } from '../../../store/realEstateListingsStore';

const RealEstateDashboardOverview = () => {
  const { user } = useUnifiedAuth();
  
  // Get partner's listings
  const partnerListings = useMemo(() => {
    if (!user?.email) return [];
    return getListingsByPartner(user.email);
  }, [user?.email]);

  // Calculate stats from partner's actual data
  const stats = useMemo(() => {
    const liveListings = partnerListings.filter(l => l.status === 'LIVE').length;
    const pendingListings = partnerListings.filter(l => l.status === 'PENDING').length;
    const completedListings = partnerListings.filter(l => l.status === 'COMPLETED').length;
    
    return [
      { label: '총 매물 수', value: partnerListings.length.toString(), change: '' },
      { label: '노출 중인 매물', value: liveListings.toString(), change: '' },
      { label: '심사 대기', value: pendingListings.toString(), change: '' },
      { label: '거래 완료', value: completedListings.toString(), change: '' },
    ];
  }, [partnerListings]);

  const hasData = partnerListings.length > 0;

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
            {stat.change && <p className="text-sm text-green-600">{stat.change}</p>}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h2>
        {hasData ? (
          <div className="space-y-3">
            {partnerListings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <p className="text-gray-700">
                  {listing.status === 'PENDING' && '매물이 심사 대기 중입니다.'}
                  {listing.status === 'LIVE' && '매물이 노출되었습니다.'}
                  {listing.status === 'REJECTED' && '매물이 반려되었습니다.'}
                  {listing.status === 'COMPLETED' && '매물 거래가 완료되었습니다.'}
                  {listing.status === 'HIDDEN' && '매물이 비노출되었습니다.'}
                  {listing.title && ` - ${listing.title}`}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">활동 내역이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">새로운 매물을 등록하면 활동 내역이 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateDashboardOverview;