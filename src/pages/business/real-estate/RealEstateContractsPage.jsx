import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contracts, contractStatuses, contractTypes } from '../../../mock/realEstateData';

const RealEstateContractsPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateRange, setDateRange] = useState('이번 달');

  // Filter contracts based on status
  const filteredContracts = statusFilter === '전체' 
    ? contracts 
    : contracts.filter(contract => contract.status === statusFilter);

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '진행중':
        return 'bg-blue-100 text-blue-800';
      case '완료':
        return 'bg-green-100 text-green-800';
      case '취소':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewContract = () => {
    navigate('/business/real-estate/contracts/new');
  };

  const handleViewDetails = (contractId) => {
    navigate(`/business/real-estate/contracts/${contractId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">계약 내역</h1>
          <p className="text-gray-600 mt-1">완료된 계약과 진행 중인 계약을 확인하세요.</p>
        </div>
        <button 
          onClick={handleNewContract}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
        >
          새 계약 등록
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">상태:</span>
            <div className="flex gap-2">
              {contractStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    statusFilter === status
                      ? 'bg-dabang-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">기간:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="이번 달">이번 달</option>
              <option value="3개월">3개월</option>
              <option value="전체">전체</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  매물명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약일
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.listing.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contract.type === '매매' ? 
                      (contract.salePrice ? new Intl.NumberFormat('ko-KR').format(contract.salePrice) + '원' : '-') :
                     contract.type === '전세' ? 
                      (contract.deposit ? '보증금 ' + new Intl.NumberFormat('ko-KR').format(contract.deposit) + '원' : '-') :
                     contract.type === '월세' ? 
                      (contract.deposit ? 
                        `보증금 ${new Intl.NumberFormat('ko-KR').format(contract.deposit)}원 / 월 ${new Intl.NumberFormat('ko-KR').format(contract.monthlyRent)}원` : 
                        `- / 월 ${new Intl.NumberFormat('ko-KR').format(contract.monthlyRent)}원`) :
                     '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.contractDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => handleViewDetails(contract.id)}
                      className="text-dabang-primary hover:text-dabang-primary/80"
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealEstateContractsPage;