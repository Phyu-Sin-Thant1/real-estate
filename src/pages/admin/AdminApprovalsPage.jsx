import React, { useEffect, useMemo, useState } from 'react';
import { getApprovals } from '../../store/approvalsStore';
import { getApplicationById } from '../../store/partnerApplicationsStore';
import ApprovalReviewModal from '../../components/admin/ApprovalReviewModal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Toast from '../../components/delivery/Toast';
import { addAuditLog } from '../../lib/auditLog';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { mockApprovalInboxItems } from '../../mocks/approvalInboxMock';

const AdminApprovalsPage = () => {
  const { user } = useUnifiedAuth();
  const [approvals, setApprovals] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  
  // Tab state - default to All
  const [activeTab, setActiveTab] = useState('ALL');

  // Use mock data if API is not connected (for now, always use mock)
  useEffect(() => {
    // Try to get real approvals first
    const realApprovals = getApprovals();
    
    // If we have real approvals, use them; otherwise use mock data
    // For MVP, we'll use mock data to demonstrate the UI
    if (realApprovals.length > 0) {
      // Transform real approvals to unified format if needed
      const transformed = realApprovals.map(approval => ({
        id: approval.id,
        domain: approval.meta?.domain || (approval.type === 'PARTNER_APPLICATION' || approval.type === 'PARTNER_REGISTRATION' 
          ? (getApplicationById(approval.entityId)?.type === 'REAL_ESTATE' ? 'REAL_ESTATE' : 'DELIVERY')
          : 'REAL_ESTATE'),
        requestType: approval.type === 'PARTNER_APPLICATION' || approval.type === 'PARTNER_REGISTRATION' 
          ? 'PARTNER_REGISTRATION'
          : approval.type === 'REAL_ESTATE_LISTING_CREATE' 
          ? 'PROPERTY_APPROVAL'
          : 'PACKAGE_APPROVAL',
        requesterName: approval.meta?.partnerName || approval.submittedBy || 'Unknown',
        requesterType: approval.meta?.requesterType || 'Business',
        requestedAt: approval.submittedAt || approval.createdAt || new Date().toISOString(),
        status: approval.status || 'PENDING'
      }));
      setApprovals(transformed);
    } else {
      // Use mock data
      setApprovals(mockApprovalInboxItems);
    }
  }, []);

  // Filter approvals by tab (domain)
  const filteredApprovals = useMemo(() => {
    let filtered = approvals;
    
    if (activeTab === 'REAL_ESTATE') {
      filtered = filtered.filter(a => a.domain === 'REAL_ESTATE');
    } else if (activeTab === 'DELIVERY') {
      filtered = filtered.filter(a => a.domain === 'DELIVERY');
    }
    // ALL tab shows everything (no filter)
    
    return filtered;
  }, [approvals, activeTab]);

  // Calculate stats based on filtered data
  const stats = useMemo(() => {
    return {
      pending: filteredApprovals.filter(a => a.status === 'PENDING').length,
      approved: filteredApprovals.filter(a => a.status === 'APPROVED').length,
      rejected: filteredApprovals.filter(a => a.status === 'REJECTED').length
    };
  }, [filteredApprovals]);

  const handleReview = (approvalItem) => {
    setSelectedItem(approvalItem);
    setIsReviewModalOpen(true);
  };

  const handleApprove = async (id) => {
    // Update local state
    setApprovals(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'APPROVED', rejectionReason: undefined }
        : item
    ));

    // Create audit log entry
    const item = approvals.find(a => a.id === id);
    if (item) {
      addAuditLog({
        action: `${item.requestType}_APPROVED`,
        targetId: String(id),
        metadata: {
          domain: item.domain,
          requestType: item.requestType,
          requesterName: item.requesterName
        },
        user: user?.name || 'Admin',
        details: `${item.requestType} approved: ${item.requesterName}`
      });
    }

    // Show toast
    setToast({
      isVisible: true,
      message: 'Approved successfully',
      type: 'success'
    });
  };

  const handleReject = async (id, reason) => {
    // Update local state
    setApprovals(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'REJECTED', rejectionReason: reason }
        : item
    ));

    // Create audit log entry
    const item = approvals.find(a => a.id === id);
    if (item) {
      addAuditLog({
        action: `${item.requestType}_REJECTED`,
        targetId: String(id),
        metadata: {
          domain: item.domain,
          requestType: item.requestType,
          requesterName: item.requesterName,
          rejectionReason: reason
        },
        user: user?.name || 'Admin',
        details: `${item.requestType} rejected: ${item.requesterName}`
      });
    }

    // Show toast
    setToast({
      isVisible: true,
      message: 'Rejected successfully',
      type: 'success'
    });
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRequestTypeLabel = (requestType) => {
    switch (requestType) {
      case 'PARTNER_REGISTRATION':
        return 'Partner Registration';
      case 'PROPERTY_APPROVAL':
        return 'Property Approval';
      case 'PACKAGE_APPROVAL':
        return 'Delivery Package Approval';
      default:
        return requestType;
    }
  };

  const tabs = [
    { key: 'ALL', label: '전체' },
    { key: 'REAL_ESTATE', label: '부동산' },
    { key: 'DELIVERY', label: '딜리버리' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals & Reviews</h1>
        <p className="text-gray-600 mt-1">Manage pending approvals and reviews</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white border-transparent shadow-lg shadow-dabang-primary/30'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-amber-100 text-amber-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
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
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No approvals found
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((approvalItem) => (
                  <tr key={approvalItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getRequestTypeLabel(approvalItem.requestType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {approvalItem.requesterName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {approvalItem.requesterType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {approvalItem.requestedAt 
                        ? new Date(approvalItem.requestedAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(approvalItem.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant={approvalItem.status === 'PENDING' ? 'primary' : 'outline'}
                        size="small"
                        onClick={() => handleReview(approvalItem)}
                      >
                        {approvalItem.status === 'PENDING' ? 'Review' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <ApprovalReviewModal
        open={isReviewModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedItem(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AdminApprovalsPage;
