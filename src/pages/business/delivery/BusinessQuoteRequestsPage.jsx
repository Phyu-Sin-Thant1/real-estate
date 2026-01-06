import React, { useState, useEffect } from 'react';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { 
  getQuoteRequestsByAgency, 
  updateQuoteRequestStatus, 
  getQuoteRequestById,
  deleteQuoteRequest 
} from '../../../store/quoteRequestsStore';
import Modal from '../../../components/common/Modal';

const BusinessQuoteRequestsPage = () => {
  const { user } = useUnifiedAuth();
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [agencyId, setAgencyId] = useState(null);

  useEffect(() => {
    // Get agency ID from user email or use a default
    // In a real app, this would come from user profile
    if (user?.email) {
      // Try to find agency by email or use a default
      const defaultAgencyId = 'moving-agency-1'; // This should come from user profile
      setAgencyId(defaultAgencyId);
      loadQuoteRequests(defaultAgencyId);
    }
  }, [user?.email]);

  const loadQuoteRequests = (agencyId) => {
    const requests = getQuoteRequestsByAgency(agencyId);
    setQuoteRequests(requests);
  };

  useEffect(() => {
    if (agencyId) {
      loadQuoteRequests(agencyId);
    }
  }, [agencyId]);

  const tabs = [
    { key: 'all', label: '전체', count: quoteRequests.length },
    { key: 'pending', label: '대기 중', count: quoteRequests.filter(r => r.status === 'pending').length },
    { key: 'approved', label: '승인됨', count: quoteRequests.filter(r => r.status === 'approved').length },
    { key: 'rejected', label: '거절됨', count: quoteRequests.filter(r => r.status === 'rejected').length }
  ];

  const filteredRequests = activeTab === 'all'
    ? quoteRequests
    : quoteRequests.filter(req => req.status === activeTab);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedRequest) {
      updateQuoteRequestStatus(selectedRequest.id, 'approved', 'Quote approved by admin');
      loadQuoteRequests(agencyId);
      setIsDetailModalOpen(false);
      setSelectedRequest(null);
      alert('견적 요청이 승인되었습니다. 고객에게 알림이 전송됩니다.');
    }
  };

  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedRequest) {
      updateQuoteRequestStatus(selectedRequest.id, 'rejected', rejectReason || 'Quote rejected by admin');
      loadQuoteRequests(agencyId);
      setIsDetailModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectReason('');
      alert('견적 요청이 거절되었습니다. 고객에게 알림이 전송됩니다.');
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000) {
      return `₩${(price / 10000).toFixed(0)}만`;
    }
    return `₩${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: '대기 중', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: '승인됨', color: 'bg-green-100 text-green-800' },
      rejected: { label: '거절됨', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">견적 요청 관리</h1>
        <p className="text-gray-600 mt-1">고객의 견적 요청을 검토하고 승인/거절할 수 있습니다.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-dabang-primary text-dabang-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? 'bg-dabang-primary/20 text-dabang-primary'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Quote Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">견적 요청이 없습니다</h3>
          <p className="text-gray-500">새로운 견적 요청이 들어오면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    요청일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    서비스
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    추가 옵션
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    총 가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr 
                    key={request.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(request)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                      <div className="text-sm text-gray-500">{request.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.serviceName}</div>
                      <div className="text-xs text-gray-500">{request.pickupAddress}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.extraOptions?.extraFloors > 0 && (
                          <div>추가 층수: {request.extraOptions.extraFloors}</div>
                        )}
                        {request.extraOptions?.largeItems > 0 && (
                          <div>대형 물품: {request.extraOptions.largeItems}</div>
                        )}
                        {request.extraOptions?.fragileHandling > 0 && (
                          <div>취급 주의: {request.extraOptions.fragileHandling}</div>
                        )}
                        {!request.extraOptions?.extraFloors && 
                         !request.extraOptions?.largeItems && 
                         !request.extraOptions?.fragileHandling && (
                          <span className="text-gray-400">없음</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-dabang-primary">
                        {formatPrice(request.totalPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        기본: {formatPrice(request.basePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(request);
                        }}
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
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        title={selectedRequest ? `견적 요청 상세: ${selectedRequest.serviceName}` : '견적 요청 상세'}
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">고객 정보</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">이름:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">전화번호:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.customerPhone}</span>
                </div>
                {selectedRequest.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이메일:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRequest.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">서비스 정보</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">서비스명:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">픽업 주소:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">배송 주소:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.deliveryAddress}</span>
                </div>
                {selectedRequest.preferredDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">희망 일자:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRequest.preferredDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Limitations */}
            {selectedRequest.serviceLimitations && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">서비스 제한사항</h3>
                <div className="bg-yellow-50 rounded-lg p-4 space-y-2">
                  {selectedRequest.serviceLimitations.maxFloors && (
                    <div className="text-sm text-gray-700">
                      최대 층수: <strong>{selectedRequest.serviceLimitations.maxFloors}층</strong>
                    </div>
                  )}
                  {selectedRequest.serviceLimitations.maxWeight && (
                    <div className="text-sm text-gray-700">
                      최대 무게: <strong>{selectedRequest.serviceLimitations.maxWeight}kg</strong>
                    </div>
                  )}
                  {selectedRequest.serviceLimitations.maxDistance && selectedRequest.serviceLimitations.maxDistance > 0 && (
                    <div className="text-sm text-gray-700">
                      최대 거리: <strong>{selectedRequest.serviceLimitations.maxDistance}km</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Extra Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">추가 옵션</h3>
              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                {selectedRequest.extraOptions?.extraFloors > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">추가 층수:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedRequest.extraOptions.extraFloors}층 (+{formatPrice(selectedRequest.priceBreakdown?.extraFloors || 0)})
                    </span>
                  </div>
                )}
                {selectedRequest.extraOptions?.largeItems > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">대형 물품:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedRequest.extraOptions.largeItems}개 (+{formatPrice(selectedRequest.priceBreakdown?.largeItems || 0)})
                    </span>
                  </div>
                )}
                {selectedRequest.extraOptions?.fragileHandling > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">취급 주의:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedRequest.extraOptions.fragileHandling}개 (+{formatPrice(selectedRequest.priceBreakdown?.fragileHandling || 0)})
                    </span>
                  </div>
                )}
                {selectedRequest.extraOptions?.itemWeight && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">물품 무게/부피:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRequest.extraOptions.itemWeight}</span>
                  </div>
                )}
                {selectedRequest.extraOptions?.additionalRequests && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <span className="text-sm text-gray-600 block mb-1">추가 요청사항:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.extraOptions.additionalRequests}</span>
                  </div>
                )}
                {!selectedRequest.extraOptions?.extraFloors && 
                 !selectedRequest.extraOptions?.largeItems && 
                 !selectedRequest.extraOptions?.fragileHandling &&
                 !selectedRequest.extraOptions?.itemWeight &&
                 !selectedRequest.extraOptions?.additionalRequests && (
                  <div className="text-sm text-gray-500">추가 옵션이 없습니다.</div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">가격 내역</h3>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">기본 가격:</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(selectedRequest.basePrice)}</span>
                </div>
                {selectedRequest.priceBreakdown?.extraFloors > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">추가 층수:</span>
                    <span className="text-sm font-medium text-dabang-primary">
                      +{formatPrice(selectedRequest.priceBreakdown.extraFloors)}
                    </span>
                  </div>
                )}
                {selectedRequest.priceBreakdown?.largeItems > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">대형 물품:</span>
                    <span className="text-sm font-medium text-dabang-primary">
                      +{formatPrice(selectedRequest.priceBreakdown.largeItems)}
                    </span>
                  </div>
                )}
                {selectedRequest.priceBreakdown?.fragileHandling > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">취급 주의:</span>
                    <span className="text-sm font-medium text-dabang-primary">
                      +{formatPrice(selectedRequest.priceBreakdown.fragileHandling)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">총 가격:</span>
                    <span className="text-xl font-bold text-dabang-primary">
                      {formatPrice(selectedRequest.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Message */}
            {selectedRequest.customerMessage && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">고객 메시지</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.customerMessage}</p>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {selectedRequest.adminNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">관리자 메모</h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedRequest.adminNotes}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedRequest.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  승인
                </button>
                <button
                  onClick={handleRejectClick}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  거절
                </button>
              </div>
            )}

            {selectedRequest.status === 'approved' && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ 이 견적 요청은 승인되었습니다. 고객에게 알림이 전송되었습니다.
                  </p>
                </div>
                <button
                  onClick={() => {
                    // In a real app, this would navigate to payment/booking page
                    alert('결제/예약 페이지로 이동합니다.');
                  }}
                  className="w-full px-4 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  결제/예약 진행
                </button>
              </div>
            )}

            {selectedRequest.status === 'rejected' && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-2">
                    ✗ 이 견적 요청은 거절되었습니다.
                  </p>
                  {selectedRequest.adminNotes && (
                    <p className="text-sm text-red-700">{selectedRequest.adminNotes}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
        }}
        title="견적 요청 거절"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            견적 요청을 거절하시겠습니까? 거절 사유를 입력해주세요.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거절 사유
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="예: 무게 제한 초과, 추가 층수 불가능 등..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleRejectConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              거절 확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessQuoteRequestsPage;

