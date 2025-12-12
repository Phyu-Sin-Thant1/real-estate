import React, { useState } from 'react';
import StatusBadge from '../../components/delivery/StatusBadge';
import Table from '../../components/delivery/Table';
import { settlements } from '../../mock/deliveryData';

const BusinessStatsPage = () => {
  const [activeFilter, setActiveFilter] = useState('이번 달');
  const [statusFilter, setStatusFilter] = useState('전체');

  const filters = [
    { key: '이번 달', label: '이번 달' },
    { key: '지난 달', label: '지난 달' },
    { key: '직접', label: '직접' }
  ];

  const statusFilters = [
    { key: '전체', label: '전체' },
    { key: '정산대기', label: '정산대기' },
    { key: '정산완료', label: '정산완료' }
  ];

  const summaryCards = [
    { title: '이번 달 매출', value: '₩2,300,000', change: '+12%' },
    { title: '완료 건수', value: '24건', change: '+8건' },
    { title: '취소 건수', value: '2건', change: '-1건' },
    { title: '정산 예정 금액', value: '₩2,070,000', change: '+12%' }
  ];

  const columns = [
    { key: 'period', label: '기간' },
    { key: 'orderType', label: '주문유형' },
    { key: 'totalAmount', label: '총액' },
    { key: 'commission', label: '수수료' },
    { key: 'settlementAmount', label: '정산금' },
    { key: 'status', label: '상태' }
  ];

  const filteredSettlements = settlements.filter(settlement => {
    if (statusFilter !== '전체' && settlement.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const formatCurrency = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'totalAmount':
      case 'commission':
      case 'settlementAmount':
        return formatCurrency(row[columnKey]);
      case 'status':
        return <StatusBadge status={row[columnKey]} type="settlement" />;
      default:
        return row[columnKey];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산 / 통계</h1>
        <p className="text-gray-600 mt-1">정산 내역과 통계를 확인합니다.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            <p className="text-sm text-green-600 mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeFilter === filter.key
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
        </div>

        {/* Settlements Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table 
            columns={columns} 
            data={filteredSettlements} 
            renderCell={renderCell}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessStatsPage;