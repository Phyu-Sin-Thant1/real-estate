import React, { useEffect, useMemo, useState } from 'react';
import { getApprovals, updateApproval, getApprovalById } from '../../store/approvalsStore';
import { updateListing, getListingById } from '../../store/realEstateListingsStore';
import { getApplicationById, updateApplication } from '../../store/partnerApplicationsStore';
import { createBusinessAccountFromApplication } from '../../store/businessAccountsStore';
import { addNotification } from '../../store/businessNotificationsStore';

const AdminApprovalsPage = () => {
  const [approvals, setApprovals] = useState(() => getApprovals());
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [activeApproval, setActiveApproval] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalToReject, setApprovalToReject] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // Refresh approvals when component mounts
  useEffect(() => {
    setApprovals(getApprovals());
  }, []);

  const handleSelectApproval = (approvalId) => {
    setSelectedApprovals(prev => 
      prev.includes(approvalId) 
        ? prev.filter(id => id !== approvalId)
        : [...prev, approvalId]
    );
  };

  const handleSelectAll = () => {
    const targetIds = filteredApprovals.map((a) => a.id);
    if (selectedApprovals.length === targetIds.length) {
      setSelectedApprovals([]);
    } else {
      setSelectedApprovals(targetIds);
    }
  };

  const handleApprove = (approvalId) => {
    const target = approvals.find((item) => item.id === approvalId);
    if (!target) return;

    const decidedAt = new Date().toISOString();
    
    // Update approval status
    updateApproval(approvalId, { 
      status: 'APPROVED', 
      decidedAt 
    });

    // Handle listing approval
    if (target.type === 'REAL_ESTATE_LISTING_CREATE' && target.entityId) {
      const listing = getListingById(Number(target.entityId));
      if (listing) {
        updateListing(Number(target.entityId), { 
          status: 'LIVE' 
        });
        
        // Add notification to partner
        const partnerEmail = listing.partnerEmail || listing.createdBy;
        if (partnerEmail) {
          addNotification({
            partnerEmail,
            type: 'LISTING_APPROVED',
            title: '매물이 승인되었습니다',
            message: `${listing.title || listing.name || '매물'}이 노출되었습니다.`,
            relatedEntityId: listing.id,
          });
        }
      }
    }

    // Handle partner application approval
    if (target.type === 'PARTNER_APPLICATION' && target.entityId) {
      const app = getApplicationById(target.entityId);
      if (app) {
        // Create business account with temp password (or get existing)
        const { account, tempPassword, dashboardUrl } = createBusinessAccountFromApplication(app);
        
        // Update application status
        updateApplication(app.id, { status: 'APPROVED' });
        
        // Add notification to partner
        addNotification({
          partnerEmail: account.email,
          type: 'ACCOUNT_APPROVED',
          title: '파트너 계정 승인 완료',
          message: '대시보드에 로그인하실 수 있습니다.',
        });
        
        // Show credentials modal
        setCredentials({
          email: account.email,
          tempPassword,
          role: account.role,
          dashboardUrl,
          companyName: account.companyName,
        });
        setShowCredentialsModal(true);
      }
    }

    // Refresh approvals
    setApprovals(getApprovals());
    setSelectedApprovals((prev) => prev.filter((id) => id !== approvalId));
  };

  const openRejectModal = (approvalId) => {
    setApprovalToReject(approvalId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = () => {
    if (!approvalToReject) return;

    const target = approvals.find((item) => item.id === approvalToReject);
    if (!target) return;

    const decidedAt = new Date().toISOString();
    const reason = rejectReason.trim() || undefined;

    // Update approval status
    updateApproval(approvalToReject, { 
      status: 'REJECTED', 
      rejectReason: reason,
      decidedAt 
    });

    // Handle listing rejection
    if (target.type === 'REAL_ESTATE_LISTING_CREATE' && target.entityId) {
      const listing = getListingById(Number(target.entityId));
      if (listing) {
        updateListing(Number(target.entityId), { 
          status: 'REJECTED',
          rejectReason: reason 
        });
        
        // Add notification to partner
        const partnerEmail = listing.partnerEmail || listing.createdBy;
        if (partnerEmail) {
          addNotification({
            partnerEmail,
            type: 'LISTING_REJECTED',
            title: '매물이 반려되었습니다',
            message: reason ? `사유: ${reason}` : '매물이 반려되었습니다.',
            relatedEntityId: listing.id,
          });
        }
      }
    }

    // Handle partner application rejection
    if (target.type === 'PARTNER_APPLICATION' && target.entityId) {
      updateApplication(target.entityId, { status: 'REJECTED', rejectReason: reason });
    }

    // Refresh approvals
    setApprovals(getApprovals());
    setSelectedApprovals((prev) => prev.filter((id) => id !== approvalToReject));
    
    // Close modal
    setShowRejectModal(false);
    setApprovalToReject(null);
    setRejectReason('');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'REAL_ESTATE_LISTING_CREATE': return 'Listing Submission';
      case 'PARTNER_APPLICATION': return 'Partner Application';
      case 'PARTNER_REGISTRATION': return 'Partner Registration';
      case 'LISTING_SUBMISSION': return 'Listing Submission';
      case 'CONTENT_REVIEW': return 'Content Review';
      case 'USER_REPORT': return 'User Report';
      case 'PARTNER_UPDATE': return 'Partner Update';
      default: return type;
    }
  };

  const filteredApprovals = useMemo(() => {
    let filtered = approvals;
    if (filterType === 'PARTNER') {
      filtered = filtered.filter((a) => a.type === 'PARTNER_APPLICATION');
    } else if (filterType === 'LISTING') {
      filtered = filtered.filter((a) => a.type === 'REAL_ESTATE_LISTING_CREATE');
    } else if (filterType === 'REFUND') {
      filtered = filtered.filter((a) => a.type === 'DELIVERY_REFUND_REQUEST');
    }
    return filtered;
  }, [approvals, filterType]);

  const openDetail = (approval) => {
    if (approval.type === 'PARTNER_APPLICATION') {
      const app = getApplicationById(approval.entityId);
      setActiveApproval({ approval, application: app });
    } else if (approval.type === 'REAL_ESTATE_LISTING_CREATE') {
      const listing = getListingById(Number(approval.entityId));
      setActiveApproval({ approval, listing });
    } else {
      setActiveApproval({ approval });
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals & Reviews</h1>
        <p className="text-gray-600 mt-1">Manage pending approvals and reviews</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1 rounded-full text-sm border ${filterType === 'ALL' ? 'bg-dabang-primary text-white border-dabang-primary' : 'border-gray-200 text-gray-700'}`}
        >
          전체
        </button>
        <button
          onClick={() => setFilterType('PARTNER')}
          className={`px-3 py-1 rounded-full text-sm border ${filterType === 'PARTNER' ? 'bg-dabang-primary text-white border-dabang-primary' : 'border-gray-200 text-gray-700'}`}
        >
          파트너 신청
        </button>
        <button
          onClick={() => setFilterType('LISTING')}
          className={`px-3 py-1 rounded-full text-sm border ${filterType === 'LISTING' ? 'bg-dabang-primary text-white border-dabang-primary' : 'border-gray-200 text-gray-700'}`}
        >
          매물 등록
        </button>
        <button
          onClick={() => setFilterType('REFUND')}
          className={`px-3 py-1 rounded-full text-sm border ${filterType === 'REFUND' ? 'bg-dabang-primary text-white border-dabang-primary' : 'border-gray-200 text-gray-700'}`}
        >
          환불 요청
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-100 text-yellow-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {approvals.filter(a => a.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100 text-green-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {approvals.filter(a => a.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {approvals.filter(a => a.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedApprovals.length === filteredApprovals.length && filteredApprovals.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No approvals found
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(approval)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedApprovals.includes(approval.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleSelectApproval(approval.id)}
                        className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getTypeLabel(approval.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {approval.submittedBy || approval.meta?.partnerName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {approval.meta?.partnerName ? 'Partner' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {approval.submittedAt ? new Date(approval.submittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(approval.status)}`}>
                        {approval.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {approval.status === 'PENDING' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(approval.id);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openRejectModal(approval.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeApproval && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-xl border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Approval Detail</p>
                <h3 className="text-lg font-semibold text-gray-900">{getTypeLabel(activeApproval.approval.type)}</h3>
              </div>
              <button
                onClick={() => setActiveApproval(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                닫기
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Status</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(activeApproval.approval.status)}`}>
                  {activeApproval.approval.status}
                </span>
              </div>

              {activeApproval.approval.type === 'PARTNER_APPLICATION' && activeApproval.application && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">파트너 유형</p>
                    <p className="text-sm text-gray-900">{activeApproval.application.type === 'REAL_ESTATE' ? '부동산' : '배송'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">회사명</p>
                    <p className="text-sm text-gray-900">{activeApproval.application.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">담당자</p>
                    <p className="text-sm text-gray-900">{activeApproval.application.contactName}</p>
                    <p className="text-xs text-gray-600">{activeApproval.application.email} / {activeApproval.application.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">주소</p>
                    <p className="text-sm text-gray-900">{activeApproval.application.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">서비스 지역</p>
                    <p className="text-sm text-gray-900">{activeApproval.application.serviceArea}</p>
                  </div>
                  {activeApproval.application.website && (
                    <div>
                      <p className="text-xs text-gray-500">웹사이트/SNS</p>
                      <p className="text-sm text-dabang-primary break-all">{activeApproval.application.website}</p>
                    </div>
                  )}
                  {activeApproval.application.message && (
                    <div>
                      <p className="text-xs text-gray-500">메시지</p>
                      <p className="text-sm text-gray-900 whitespace-pre-line">{activeApproval.application.message}</p>
                    </div>
                  )}
                </div>
              )}

              {activeApproval.approval.type === 'REAL_ESTATE_LISTING_CREATE' && activeApproval.listing && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">제목</p>
                    <p className="text-sm text-gray-900">{activeApproval.listing.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">주소</p>
                    <p className="text-sm text-gray-900">{activeApproval.listing.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">도시</p>
                    <p className="text-sm text-gray-900">{activeApproval.listing.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">가격</p>
                    <p className="text-sm text-gray-900">{activeApproval.listing.price ? `${activeApproval.listing.price}원` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">면적</p>
                    <p className="text-sm text-gray-900">{activeApproval.listing.area ? `${activeApproval.listing.area}㎡` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">파트너</p>
                    <p className="text-sm text-gray-900">{activeApproval.listing.partnerName || activeApproval.listing.partnerEmail || 'N/A'}</p>
                  </div>
                  {activeApproval.listing.description && (
                    <div>
                      <p className="text-xs text-gray-500">설명</p>
                      <p className="text-sm text-gray-900 whitespace-pre-line">{activeApproval.listing.description}</p>
                    </div>
                  )}
                  {activeApproval.listing.rejectReason && (
                    <div>
                      <p className="text-xs text-gray-500">반려 사유</p>
                      <p className="text-sm text-red-600">{activeApproval.listing.rejectReason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {activeApproval.approval.status === 'PENDING' && (
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    openRejectModal(activeApproval.approval.id);
                  }}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  반려
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApprove(activeApproval.approval.id);
                    setActiveApproval(null);
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
                >
                  승인
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">반려 사유 입력</h3>
            <p className="text-sm text-gray-600 mb-4">
              반려 사유를 입력해주세요. (선택사항)
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="반려 사유를 입력하세요..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setApprovalToReject(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                반려
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && credentials && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Partner Account Created</h3>
              <button
                onClick={() => {
                  setShowCredentialsModal(false);
                  setCredentials(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Send this to partner owner:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <div id="credentials-message" className="text-sm text-gray-800 whitespace-pre-line font-mono">
                {`[TOFU Partner Account Approved]

Email: ${credentials.email}
Temporary Password: ${credentials.tempPassword}
Login: /login
Dashboard: ${credentials.dashboardUrl}

Please log in and change your password immediately.`}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  const message = document.getElementById('credentials-message').textContent;
                  navigator.clipboard.writeText(message).then(() => {
                    alert('Credentials copied to clipboard!');
                  }).catch(() => {
                    alert('Failed to copy. Please select and copy manually.');
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => {
                  setShowCredentialsModal(false);
                  setCredentials(null);
                }}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalsPage;