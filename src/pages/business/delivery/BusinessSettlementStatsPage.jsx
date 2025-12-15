import React, { useState } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Modal from '../../../components/delivery/Modal';
import { kpis, dailyRevenue, orderStatusDistribution, settlements } from '../../../mock/deliveryStatsData';

const BusinessSettlementStatsPage = () => {
  const [activeDateRange, setActiveDateRange] = useState('이번 달');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const dateRangeFilters = [
    { key: '오늘', label: '오늘' },
    { key: '이번 주', label: '이번 주' },
    { key: '이번 달', label: '이번 달' },
    { key: '사용자 지정', label: '사용자 지정' }
  ];

  const statusFilters = [
    { key: '전체', label: '전체' },
    { key: '정산대기', label: '정산 예정' },
    { key: '정산완료', label: '정산 완료' },
    { key: '보류', label: '보류' }
  ];

  // Filter settlements based on filters
  const filteredSettlements = settlements.filter(settlement => {
    if (statusFilter !== '전체' && settlement.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      if (!(
        settlement.id.toLowerCase().includes(lowerSearch) ||
        settlement.period.toLowerCase().includes(lowerSearch)
        // Since we don't have customer name or address in the mock data,
        // we'll keep it simple with what we have
      )) {
        return false;
      }
    }
    
    return true;
  });

  const formatCurrency = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const handleViewDetails = (settlement) => {
    setSelectedSettlement(settlement);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { key: 'id', label: '정산번호' },
    { key: 'period', label: '기간' },
    { key: 'orderCount', label: '주문 건수' },
    { key: 'totalAmount', label: '매출 합계' },
    { key: 'commission', label: '수수료' },
    { key: 'settlementAmount', label: '정산 금액' },
    { key: 'status', label: '상태' },
    { key: 'actions', label: '작업' }
  ];

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'totalAmount':
      case 'commission':
      case 'settlementAmount':
        return formatCurrency(row[columnKey]);
      case 'status':
        return <StatusBadge status={row[columnKey]} type="settlement" />;
      case 'actions':
        return (
          <button
            onClick={() => handleViewDetails(row)}
            className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
          >
            상세
          </button>
        );
      default:
        return row[columnKey];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산 / 통계</h1>
        <p className="text-gray-600 mt-1">정산 현황과 운영 지표를 확인하세요.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">이번 달 매출</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(kpis.monthlySales.value)}</p>
          <p className={`text-sm mt-1 ${kpis.monthlySales.deltaType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {kpis.monthlySales.deltaType === 'positive' ? '+' : ''}{kpis.monthlySales.delta}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">이번 달 정산 예정</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(kpis.pendingSettlement.value)}</p>
          <p className={`text-sm mt-1 ${kpis.pendingSettlement.deltaType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {kpis.pendingSettlement.deltaType === 'positive' ? '+' : ''}{kpis.pendingSettlement.delta}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">이번 달 정산 완료</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(kpis.completedSettlement.value)}</p>
          <p className={`text-sm mt-1 ${kpis.completedSettlement.deltaType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {kpis.completedSettlement.deltaType === 'positive' ? '+' : ''}{kpis.completedSettlement.delta}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">취소/환불 금액</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(kpis.refundAmount.value)}</p>
          <p className={`text-sm mt-1 ${kpis.refundAmount.deltaType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {kpis.refundAmount.deltaType === 'positive' ? '+' : ''}{kpis.refundAmount.delta}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
            <div className="flex flex-wrap gap-2">
              {dateRangeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveDateRange(filter.key)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeDateRange === filter.key
                      ? 'bg-dabang-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    statusFilter === filter.key
                      ? 'bg-dabang-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <input
              type="text"
              placeholder="주문번호/고객명/주소 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Revenue Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">일별 매출 추이</h3>
            <div className="space-y-2">
              {dailyRevenue.slice(-10).map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-500">{item.date.split('-')[2]}</div>
                  <div className="flex-1 ml-2">
                    <div 
                      className="h-6 bg-dabang-primary rounded"
                      style={{ width: `${(item.amount / Math.max(...dailyRevenue.map(d => d.amount))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">상태별 주문 비율</h3>
            <div className="space-y-3">
              {orderStatusDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{item.status}</div>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-dabang-primary h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium">
                    {formatPercentage(item.percentage)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settlements Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">정산 내역</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSettlements.map((settlement) => (
                <tr key={settlement.id}>
                  {columns.map((column) => (
                    <td
                      key={`${settlement.id}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {renderCell(settlement, column.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="정산 상세"
        size="lg"
      >
        {selectedSettlement && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">정산번호</div>
                    <div className="text-sm font-medium">{selectedSettlement.id}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">정산 기간</div>
                    <div className="text-sm font-medium">{selectedSettlement.period}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">주문 건수</div>
                    <div className="text-sm font-medium">{selectedSettlement.orderCount}건</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">상태</div>
                    <div className="text-sm font-medium">
                      <StatusBadge status={selectedSettlement.status} type="settlement" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">금액 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">매출 합계</div>
                    <div className="text-sm font-medium">{formatCurrency(selectedSettlement.totalAmount)}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">수수료</div>
                    <div className="text-sm font-medium">{formatCurrency(selectedSettlement.commission)}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">정산 금액</div>
                    <div className="text-sm font-medium text-lg font-bold text-dabang-primary">
                      {formatCurrency(selectedSettlement.settlementAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">내역 상세</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        서비스 유형
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        매출
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        수수료
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedSettlement.breakdown.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.commission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BusinessSettlementStatsPage;