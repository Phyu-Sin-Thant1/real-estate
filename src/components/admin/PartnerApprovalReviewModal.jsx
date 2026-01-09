import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { approveApproval, rejectApproval } from '../../lib/api/adminApprovals';
import { createBusinessAccountFromApplication } from '../../store/businessAccountsStore';
import { updateApplication } from '../../store/partnerApplicationsStore';
import { addNotification } from '../../store/businessNotificationsStore';

const PartnerApprovalReviewModal = ({
  isOpen,
  onClose,
  approval,
  application,
  onStatusUpdate
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState(null);

  if (!approval || !application) return null;

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = async () => {
    setIsApproving(true);
    try {
      const result = await approveApproval(approval.id, {});
      if (result.success) {
        // Create business account with temp password
        const { account, tempPassword, dashboardUrl } = createBusinessAccountFromApplication(application);
        
        // Update application status
        updateApplication(application.id, { status: 'APPROVED' });
        
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
        
        // Update approval status
        onStatusUpdate({
          ...approval,
          status: 'APPROVED',
          reviewedAt: result.data.reviewedAt
        });
        
        setShowApproveConfirm(false);
        onClose();
      } else {
        alert('Failed to approve partner registration. Please try again.');
      }
    } catch (error) {
      console.error('Error approving partner registration:', error);
      alert('Failed to approve partner registration. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectDialog(true);
    setRejectionReason('');
    setRejectionError('');
  };

  const handleRejectSubmit = async () => {
    // Validate rejection reason
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      setRejectionError('Rejection reason must be at least 10 characters.');
      return;
    }

    setIsRejecting(true);
    try {
      const result = await rejectApproval(approval.id, {
        rejectionReason: rejectionReason.trim()
      });
      if (result.success) {
        // Update application status
        updateApplication(application.id, { 
          status: 'REJECTED', 
          rejectReason: result.data.rejectionReason 
        });
        
        // Update approval status
        onStatusUpdate({
          ...approval,
          status: 'REJECTED',
          rejectionReason: result.data.rejectionReason,
          reviewedAt: result.data.reviewedAt
        });
        
        setShowRejectDialog(false);
        setRejectionReason('');
        onClose();
      } else {
        alert('Failed to reject partner registration. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting partner registration:', error);
      alert('Failed to reject partner registration. Please try again.');
    } finally {
      setIsRejecting(false);
    }
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

  const getBusinessTypeLabel = (type) => {
    switch (type) {
      case 'REAL_ESTATE':
        return 'Real Estate Partner';
      case 'DELIVERY':
        return 'Delivery Partner';
      default:
        return type;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showApproveConfirm && !showRejectDialog && !showCredentialsModal}
        onClose={onClose}
        title="Partner Registration Review"
        size="xl"
      >
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{application.companyName || 'Untitled Company'}</h3>
              <p className="text-sm text-gray-500 mt-1">Application ID: {application.id}</p>
            </div>
            {getStatusBadge(approval.status)}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Company Information */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Company Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Company Name:</span>
                    <span className="text-sm font-medium">{application.companyName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Business Type:</span>
                    <span className="text-sm font-medium">{getBusinessTypeLabel(application.type)}</span>
                  </div>
                  {application.businessNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Registration Number:</span>
                      <span className="text-sm font-medium">{application.businessNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Person</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium">{application.contactName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{application.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{application.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Address</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">
                    {application.address || 'No address provided'}
                  </p>
                  {application.serviceArea && (
                    <p className="text-xs text-gray-500 mt-2">
                      Service Area: {application.serviceArea}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Information */}
            <div className="space-y-4">
              {application.website && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Website / SNS</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <a 
                      href={application.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-dabang-primary hover:underline break-all"
                    >
                      {application.website}
                    </a>
                  </div>
                </div>
              )}

              {application.message && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Message</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {application.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              {application.uploadedDocuments && application.uploadedDocuments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {application.uploadedDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{doc.name || `Document ${idx + 1}`}</span>
                        <a
                          href={doc.url || doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-dabang-primary hover:underline"
                        >
                          View / Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {application.submittedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="text-sm font-medium">
                        {new Date(application.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {!application.submittedAt && application.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {new Date(application.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {approval.reviewedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reviewed:</span>
                      <span className="text-sm font-medium">
                        {new Date(approval.reviewedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {approval.status === 'REJECTED' && approval.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Reason</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-900">{approval.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {approval.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleRejectClick}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApproveClick}
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        title="Approve Partner Registration"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Once approved, this partner will gain access to their dashboard. Continue?
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowApproveConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApproveConfirm}
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : 'Confirm Approval'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Dialog */}
      <Modal
        isOpen={showRejectDialog}
        onClose={() => {
          setShowRejectDialog(false);
          setRejectionReason('');
          setRejectionError('');
        }}
        title="Reject Partner Registration"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Please provide a reason for rejection (minimum 10 characters). This reason will be shown to the partner.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setRejectionError('');
              }}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent ${
                rejectionError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter rejection reason..."
            />
            {rejectionError && (
              <p className="text-sm text-red-600 mt-1">{rejectionError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {rejectionReason.length}/10 characters minimum
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setRejectionError('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleRejectSubmit}
              disabled={isRejecting || !rejectionReason || rejectionReason.trim().length < 10}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Credentials Modal */}
      {showCredentialsModal && credentials && (
        <Modal
          isOpen={showCredentialsModal}
          onClose={() => {
            setShowCredentialsModal(false);
            setCredentials(null);
          }}
          title="Partner Account Created"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
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
              <Button
                variant="outline"
                onClick={() => {
                  const message = document.getElementById('credentials-message').textContent;
                  navigator.clipboard.writeText(message).then(() => {
                    alert('Credentials copied to clipboard!');
                  }).catch(() => {
                    alert('Failed to copy. Please select and copy manually.');
                  });
                }}
              >
                Copy to Clipboard
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowCredentialsModal(false);
                  setCredentials(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PartnerApprovalReviewModal;

