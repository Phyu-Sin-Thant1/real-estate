import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';

const ApprovalReviewModal = ({
  open,
  item,
  onClose,
  onApprove,
  onReject
}) => {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectMode, setShowRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!item) return null;

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = async () => {
    setIsProcessing(true);
    try {
      await onApprove(item.id);
      setShowApproveConfirm(false);
      handleClose();
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectMode(true);
    setRejectionReason('');
    setRejectionError('');
  };

  const handleRejectSubmit = async () => {
    // Validate rejection reason
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      setRejectionError('Rejection reason must be at least 10 characters.');
      return;
    }

    setIsProcessing(true);
    try {
      await onReject(item.id, rejectionReason.trim());
      setShowRejectMode(false);
      setRejectionReason('');
      handleClose();
    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowApproveConfirm(false);
    setShowRejectMode(false);
    setRejectionReason('');
    setRejectionError('');
    onClose();
  };

  const getDomainBadge = (domain) => {
    switch (domain) {
      case 'REAL_ESTATE':
        return <Badge variant="primary">Real-Estate</Badge>;
      case 'DELIVERY':
        return <Badge variant="secondary">Delivery</Badge>;
      default:
        return <Badge>{domain}</Badge>;
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

  const renderPreviewContent = () => {
    switch (item.requestType) {
      case 'PARTNER_REGISTRATION':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Company name:</span>
              <span className="text-sm font-medium text-gray-900">{item.requesterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Contact:</span>
              <span className="text-sm text-gray-500">contact@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Documents:</span>
              <span className="text-sm text-gray-500">Business license, Registration certificate</span>
            </div>
          </div>
        );
      case 'PROPERTY_APPROVAL':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Property title:</span>
              <span className="text-sm text-gray-500">Luxury Apartment in Gangnam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm text-gray-500">Seoul, Gangnam District</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-sm text-gray-500">₩1,200,000,000</span>
            </div>
          </div>
        );
      case 'PACKAGE_APPROVAL':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Package name:</span>
              <span className="text-sm text-gray-500">Express Delivery Package</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pricing summary:</span>
              <span className="text-sm text-gray-500">Base: ₩120,000 / Per km: ₩5,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Coverage summary:</span>
              <span className="text-sm text-gray-500">Up to 40km, Max 300kg</span>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">Preview information not available</p>;
    }
  };

  // Approve Confirmation Modal
  if (showApproveConfirm) {
    return (
      <Modal
        isOpen={open && showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        title="Confirm Approval"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Once approved, this will be published and visible in the platform. Continue?
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowApproveConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApproveConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? 'Approving...' : 'Confirm Approval'}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Reject Mode
  if (showRejectMode) {
    return (
      <Modal
        isOpen={open && showRejectMode}
        onClose={handleClose}
        title="Reject Approval"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Please provide a reason for rejection. This reason will be visible to the requester.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection reason <span className="text-red-500">*</span>
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
              placeholder="Enter rejection reason (minimum 10 characters)..."
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
                setShowRejectMode(false);
                setRejectionReason('');
                setRejectionError('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleRejectSubmit}
              disabled={isProcessing || !rejectionReason || rejectionReason.trim().length < 10}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Main Review Modal
  return (
    <Modal
      isOpen={open && !showApproveConfirm && !showRejectMode}
      onClose={handleClose}
      title="Review Approval"
      size="lg"
    >
      <div className="space-y-6">
        {/* Top Summary Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Domain</span>
              <div className="mt-1">{getDomainBadge(item.domain)}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Type</span>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {getRequestTypeLabel(item.requestType)}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Requester</span>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {item.requesterName}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Requester Type</span>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {item.requesterType}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Requested At</span>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {item.requestedAt 
                  ? new Date(item.requestedAt).toLocaleString()
                  : 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Current Status</span>
              <div className="mt-1">{getStatusBadge(item.status)}</div>
            </div>
          </div>
        </div>

        {/* Detail Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {renderPreviewContent()}
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {item.status === 'REJECTED' && item.rejectionReason && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Reason</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">{item.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {item.status === 'PENDING' ? (
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
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ApprovalReviewModal;

