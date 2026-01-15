import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getContractsByPartner, seedMockContracts } from '../../../store/realEstateContractsStore';
import StatusBadge from '../../../components/real-estate/StatusBadge';

const RealEstateContractsPage = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateRange, setDateRange] = useState('이번 달');
  const [partnerContracts, setPartnerContracts] = useState([]);

  // Load partner's contracts
  useEffect(() => {
    if (user?.email) {
      // Seed mock contracts for the current user
      seedMockContracts(user.email);
      const contracts = getContractsByPartner(user.email);
      setPartnerContracts(contracts);
    }
  }, [user?.email]);

  // Filter contracts based on status
  const filteredContracts = useMemo(() => {
    let filtered = partnerContracts;
    
    if (statusFilter !== '전체') {
      filtered = filtered.filter(contract => {
        const status = contract.status;
        if (statusFilter === 'Drafted' && (status === 'Drafted' || status === '초안')) return true;
        if (statusFilter === 'Reviewed' && (status === 'Reviewed' || status === '검토 완료')) return true;
        if (statusFilter === 'Signed' && (status === 'Signed' || status === '서명 완료')) return true;
        if (statusFilter === 'Completed' && (status === 'Completed' || status === '완료')) return true;
        return status === statusFilter;
      });
    }
    
    return filtered;
  }, [partnerContracts, statusFilter]);

  const handleNewContract = () => {
    navigate('/business/real-estate/contracts/new');
  };

  const handleViewDetails = (contractId) => {
    console.log('Navigating to contract detail:', contractId);
    navigate(`/business/real-estate/contracts/${contractId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">계약 관리</h1>
          <p className="text-gray-600 mt-1">계약을 생성하고 관리하세요. 모든 결제는 오프라인으로 처리됩니다.</p>
        </div>
        <button 
          onClick={handleNewContract}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors font-medium"
        >
          새 계약 등록
        </button>
      </div>

      {/* Offline Payment Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">오프라인 결제 안내</h3>
          <p className="text-sm text-blue-800">모든 결제 및 보증금은 오프라인(대면)으로 처리됩니다. 계약서에 결제 정보를 기록하세요.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">상태:</span>
            <div className="flex flex-wrap gap-2">
              {['전체', 'Drafted', 'Reviewed', 'Signed', 'Completed'].map((status) => {
                const labels = {
                  '전체': '전체',
                  'Drafted': '초안',
                  'Reviewed': '검토 완료',
                  'Signed': '서명 완료',
                  'Completed': '완료'
                };
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      statusFilter === status
                        ? 'bg-dabang-primary text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {labels[status] || status}
                  </button>
                );
              })}
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
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">계약 데이터가 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500 mb-4">새로운 계약을 등록해보세요.</p>
                    <button
                      onClick={handleNewContract}
                      className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors text-sm font-medium"
                    >
                      첫 계약 등록하기
                    </button>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-dabang-primary to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
                          {contract.customer?.name?.[0] || '?'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{contract.customer?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{contract.customer?.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{contract.listing?.title || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{contract.listing?.address || ''}</div>
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
                      {contract.paymentHandledOffline && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          오프라인 결제
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.contractDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={contract.status} type="contract" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleViewDetails(contract.id);
                        }}
                        className="text-dabang-primary hover:text-dabang-primary/80 font-medium cursor-pointer"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealEstateContractsPage;