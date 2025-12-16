import React, { useMemo } from 'react';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { getOrdersByPartner } from '../../store/deliveryOrdersStore';

const OverviewPage = () => {
  const { user } = useUnifiedAuth();
  
  // Get partner's orders
  const partnerOrders = useMemo(() => {
    if (!user?.email) return [];
    return getOrdersByPartner(user.email);
  }, [user?.email]);

  // Calculate stats from partner's actual data
  const stats = useMemo(() => {
    const totalOrders = partnerOrders.length;
    const inProgress = partnerOrders.filter(o => o.status === 'IN_PROGRESS').length;
    const completed = partnerOrders.filter(o => o.status === 'COMPLETED').length;
    const failed = partnerOrders.filter(o => o.status === 'FAILED').length;
    
    return [
      { label: '총 주문 수', value: totalOrders.toString(), change: '' },
      { label: '진행 중인 작업', value: inProgress.toString(), change: '' },
      { label: '완료된 주문', value: completed.toString(), change: '' },
      { label: '실패한 주문', value: failed.toString(), change: '' },
    ];
  }, [partnerOrders]);

  const hasData = partnerOrders.length > 0;

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
            {partnerOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    주문 {order.orderNo} - {order.status === 'NEW' && '새로운 주문이 접수되었습니다'}
                    {order.status === 'IN_PROGRESS' && '주문이 진행 중입니다'}
                    {order.status === 'COMPLETED' && '주문이 완료되었습니다'}
                    {order.status === 'FAILED' && '주문이 실패했습니다'}
                    {order.status === 'CANCELLED' && '주문이 취소되었습니다'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">활동 내역이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">새로운 주문이 접수되면 활동 내역이 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;

