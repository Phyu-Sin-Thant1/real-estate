import React, { useEffect, useMemo, useState } from 'react';
import { approvalsQueue } from '../../mock/adminData';
import {
  loadApprovals,
  saveApprovals,
  updateApprovalStatus,
  updateListingStatus,
  loadPartnerApplications,
  updatePartnerApplicationStatus,
  addBusinessAccountFromApplication
} from '../../lib/helpers/realEstateStorage';

const AdminApprovalsPage = () => {
  const [approvals, setApprovals] = useState(() => loadApprovals().length ? loadApprovals() : approvalsQueue);
  const [partnerApps, setPartnerApps] = useState(() => loadPartnerApplications());
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [activeApproval, setActiveApproval] = useState(null);

  useEffect(() => {
    saveApprovals(approvals);
  }, [approvals]);

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
    const nextApprovals = updateApprovalStatus(approvalId, 'APPROVED');

    if (target?.type === 'REAL_ESTATE_LISTING_CREATE' && target.entityId) {
      updateListingStatus(target.entityId, 'LIVE');
    }
    if (target?.type === 'PARTNER_APPLICATION' && target.entityId) {
      const app = partnerApps.find((p) => p.id === target.entityId);
      if (app) {
        const tempPassword = 'Temp123!';
        addBusinessAccountFromApplication({ application: app, tempPassword });
        const nextApps = updatePartnerApplicationStatus(app.id, 'APPROVED');
        setPartnerApps(nextApps);
      }
    }

    setApprovals(nextApprovals);
    setSelectedApprovals((prev) => prev.filter((id) => id !== approvalId));
  };

  const handleReject = (approvalId) => {
    const target = approvals.find((item) => item.id === approvalId);
    const reason = window.prompt('반려 사유를 입력하세요 (선택)', '') || undefined;
    const nextApprovals = updateApprovalStatus(approvalId, 'REJECTED', { rejectReason: reason });

    if (target?.type === 'REAL_ESTATE_LISTING_CREATE' && target.entityId) {
      updateListingStatus(target.entityId, 'REJECTED');
    }
    if (target?.type === 'PARTNER_APPLICATION' && target.entityId) {
      const nextApps = updatePartnerApplicationStatus(target.entityId, 'REJECTED', reason);
      setPartnerApps(nextApps);
    }

    setApprovals(nextApprovals);
    setSelectedApprovals((prev) => prev.filter((id) => id !== approvalId));
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
    if (filterType === 'ALL') return approvals;
    if (filterType === 'PARTNER') return approvals.filter((a) => a.type === 'PARTNER_APPLICATION');
    return approvals;
  }, [approvals, filterType]);

  const openDetail = (approval) => {
    if (approval.type === 'PARTNER_APPLICATION') {
      const app = partnerApps.find((p) => p.id === approval.entityId);
      setActiveApproval({ approval, application: app });
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
              {filteredApprovals.map((approval) => (
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
                    {approval.requester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {approval.requesterType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {approval.requestedAt}
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
                          onClick={() => handleApprove(approval.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(approval.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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
            </div>

            {activeApproval.approval.status === 'PENDING' && (
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleReject(activeApproval.approval.id);
                    setActiveApproval(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  반려
                </button>
                <button
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
    </div>
  );
};

export default AdminApprovalsPage;