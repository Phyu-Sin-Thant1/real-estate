import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import { approveProperty, rejectProperty } from '../../lib/api/adminRealEstate';

const RealEstateReviewModal = ({
  isOpen,
  onClose,
  property,
  onStatusUpdate
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  if (!property) return null;

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = async () => {
    setIsApproving(true);
    try {
      const result = await approveProperty(property.id, {});
      if (result.success) {
        onStatusUpdate({
          ...property,
          status: 'APPROVED',
          lastUpdatedAt: result.data.lastUpdatedAt
        });
        setShowApproveConfirm(false);
        onClose();
      } else {
        alert('Failed to approve property. Please try again.');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Failed to approve property. Please try again.');
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
      const result = await rejectProperty(property.id, {
        rejectionReason: rejectionReason.trim()
      });
      if (result.success) {
        onStatusUpdate({
          ...property,
          status: 'REJECTED',
          rejectionReason: result.data.rejectionReason,
          lastUpdatedAt: result.data.lastUpdatedAt
        });
        setShowRejectDialog(false);
        setRejectionReason('');
        onClose();
      } else {
        alert('Failed to reject property. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('Failed to reject property. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  const formatPrice = (property) => {
    if (property.transactionType === '매매' && property.price) {
      return `${Number(property.price).toLocaleString()}원`;
    }
    if (property.transactionType === '전세' && property.deposit) {
      return `전세 ${Number(property.deposit).toLocaleString()}원`;
    }
    if (property.transactionType === '월세') {
      const parts = [];
      if (property.deposit) parts.push(`보증금 ${Number(property.deposit).toLocaleString()}원`);
      if (property.monthly) parts.push(`월세 ${Number(property.monthly).toLocaleString()}원`);
      return parts.join(' / ') || '가격 정보 없음';
    }
    return '가격 정보 없음';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showApproveConfirm && !showRejectDialog}
        onClose={onClose}
        title="Property Review"
        size="xl"
      >
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{property.title || 'Untitled Property'}</h3>
              <p className="text-sm text-gray-500 mt-1">ID: {property.id}</p>
            </div>
            {getStatusBadge(property.status)}
          </div>

          {/* Image Gallery */}
          {property.images && property.images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Images</h4>
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Property ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Key Facts */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Property Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium">{property.propertyType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction:</span>
                    <span className="text-sm font-medium">{property.transactionType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium">{formatPrice(property)}</span>
                  </div>
                  {property.area && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Size:</span>
                      <span className="text-sm font-medium">{property.area}㎡</span>
                    </div>
                  )}
                  {property.rooms && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rooms:</span>
                      <span className="text-sm font-medium">{property.rooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bathrooms:</span>
                      <span className="text-sm font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Floor:</span>
                      <span className="text-sm font-medium">
                        {property.floor}
                        {property.totalFloors ? ` / ${property.totalFloors}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">
                    {property.address || property.locationText || 'N/A'}
                  </p>
                  {property.detailAddress && (
                    <p className="text-xs text-gray-500 mt-1">{property.detailAddress}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Partner Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Partner:</span>
                    <span className="text-sm font-medium">{property.partnerName || property.partnerId || 'N/A'}</span>
                  </div>
                  {property.partnerEmail && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{property.partnerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Description and Contact */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {property.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Owner Info */}
              {(property.ownerName || property.ownerPhone || property.ownerEmail) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Owner Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {property.ownerName && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium">{property.ownerName}</span>
                      </div>
                    )}
                    {property.ownerPhone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium">{property.ownerPhone}</span>
                      </div>
                    )}
                    {property.ownerEmail && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium">{property.ownerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Agent/Contact Info */}
              {(property.agent || property.contactName || property.contactPhone || property.contactEmail) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Agent/Contact Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {(property.agent?.name || property.contactName) && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium">{property.agent?.name || property.contactName}</span>
                      </div>
                    )}
                    {(property.agent?.phone || property.contactPhone) && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium">{property.agent?.phone || property.contactPhone}</span>
                      </div>
                    )}
                    {(property.agent?.email || property.contactEmail) && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium">{property.agent?.email || property.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {property.submittedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="text-sm font-medium">
                        {new Date(property.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {property.lastUpdatedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium">
                        {new Date(property.lastUpdatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {property.status === 'REJECTED' && property.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Reason</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-900">{property.rejectionReason}</p>
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
            {property.status === 'PENDING_APPROVAL' && (
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
        title="Confirm Approval"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Once approved, this property will be visible on the public website. Continue?
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
        title="Reject Property"
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
    </>
  );
};

export default RealEstateReviewModal;






