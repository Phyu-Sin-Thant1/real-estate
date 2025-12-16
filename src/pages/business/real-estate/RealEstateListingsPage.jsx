import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingTypes, transactionTypes, listingStatuses, listingRegions } from '../../../mock/realEstateData';
import { getListingsByPartner, updateListing } from '../../../store/realEstateListingsStore';
import { getApprovalById } from '../../../store/approvalsStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';

const RealEstateListingsPage = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [storedListings, setStoredListings] = useState([]);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [regionFilter, setRegionFilter] = useState('서울 전체');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [listingToComplete, setListingToComplete] = useState(null);

  // Load partner's listings from store
  useEffect(() => {
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  }, [user?.email]);

  const allListings = useMemo(() => {
    // Only show partner's own listings - no mock data
    return storedListings;
  }, [storedListings]);

  const statusFilterOptions = useMemo(
    () => [...listingStatuses, '심사중', '반려'],
    []
  );

  // Filter listings based on filters
  const filteredListings = allListings.filter(listing => {
    const transactionMatch = transactionTypeFilter === '전체' || listing.transactionType === transactionTypeFilter;
    const statusMatch =
      statusFilter === '전체' ||
      listing.status === statusFilter ||
      statusLabel(listing.status) === statusFilter;
    const regionMatch = regionFilter === '서울 전체' || (listing.address || listing.region || listing.city || '').includes(regionFilter);
    return transactionMatch && statusMatch && regionMatch;
  });

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '노출중':
      case 'LIVE':
        return 'bg-green-100 text-green-800';
      case '비노출':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case '거래완료':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'LIVE':
        return '노출중';
      case 'PENDING':
        return '심사중';
      case 'REJECTED':
        return '반려';
      default:
        return status;
    }
  };

  // Toggle listing status between 노출중 and 비노출
  const toggleListingStatus = (id, currentStatus) => {
    // Only allow toggle for LIVE listings
    if (currentStatus !== 'LIVE' && currentStatus !== '노출중') return;
    if (currentStatus === '거래완료') return;
    
    const newStatus = currentStatus === '노출중' || currentStatus === 'LIVE' ? 'HIDDEN' : 'LIVE';
    updateListing(Number(id), { status: newStatus });
    // Refresh listings
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  };

  // Mark listing as completed
  const markAsCompleted = (id) => {
    if (!id) return;
    updateListing(Number(id), { status: 'COMPLETED' });
    setShowCompleteModal(false);
    setListingToComplete(null);
    // Refresh listings
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  };

  // Get rejection reason from approval if listing is rejected
  const getRejectionReason = (listingId) => {
    const approval = getApprovalById(`approval-${listingId}`);
    return approval?.rejectReason || null;
  };

  // Open confirmation modal for completing a listing
  const openCompleteModal = (id) => {
    setListingToComplete(id);
    setShowCompleteModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매물 관리</h1>
          <p className="text-gray-600 mt-1">승인 완료된 매물만 노출됩니다.</p>
        </div>
        <button 
          onClick={() => navigate('/business/real-estate/listings/new')}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
        >
          매물 등록
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Transaction Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">거래 유형</label>
            <select
              value={transactionTypeFilter}
              onChange={(e) => setTransactionTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              {statusFilterOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              {listingRegions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  썸네일
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  매물명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지역/주소
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  거래유형
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">매물 데이터가 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500">새로운 매물을 등록해보세요.</p>
                    <button
                      onClick={() => navigate('/business/real-estate/listings/create')}
                      className="mt-4 px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
                    >
                      매물 등록하기
                    </button>
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {listing.title || listing.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {listing.address || listing.region || listing.city || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {listing.propertyType || listing.type || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {listing.transactionType || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {listing.price ? `₩${Number(listing.price).toLocaleString()}` : listing.monthly ? `보증금 ${listing.deposit ? Number(listing.deposit).toLocaleString() : 'N/A'} / 월 ${Number(listing.monthly).toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(listing.status)}`}>
                        {statusLabel(listing.status)}
                      </span>
                      {listing.status === 'REJECTED' && getRejectionReason(listing.id) && (
                        <span className="text-xs text-red-600 mt-1" title={getRejectionReason(listing.id)}>
                          반려 사유 있음
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {listing.status === 'PENDING' && (
                        <span className="text-gray-500 text-xs">승인 대기 중</span>
                      )}
                      {listing.status === 'REJECTED' && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs">반려됨</span>
                          {getRejectionReason(listing.id) && (
                            <button
                              onClick={() => alert(`반려 사유: ${getRejectionReason(listing.id)}`)}
                              className="text-red-600 text-xs hover:underline mt-1"
                            >
                              사유 보기
                            </button>
                          )}
                        </div>
                      )}
                      {(listing.status === 'LIVE' || listing.status === '노출중') && (
                        <>
                          <button 
                            onClick={() => navigate(`/business/real-estate/listings/${listing.id}/edit`)}
                            className="text-dabang-primary hover:text-dabang-primary/80"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => toggleListingStatus(listing.id, listing.status)}
                            className="text-dabang-primary hover:text-dabang-primary/80"
                          >
                            {listing.status === '노출중' || listing.status === 'LIVE' ? '비노출' : '노출'}
                          </button>
                          <button 
                            onClick={() => openCompleteModal(listing.id)}
                            className="text-dabang-primary hover:text-dabang-primary/80"
                          >
                            거래완료
                          </button>
                        </>
                      )}
                      {listing.status === '거래완료' && (
                        <button 
                          onClick={() => navigate(`/business/real-estate/listings/${listing.id}`)}
                          className="text-dabang-primary hover:text-dabang-primary/80"
                        >
                          상세보기
                        </button>
                      )}
                    </div>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Completing Listing */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">거래완료 처리</h3>
            <p className="text-gray-600 mb-6">정말 이 매물을 거래완료 상태로 변경하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setListingToComplete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => markAsCompleted(listingToComplete)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateListingsPage;