import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { approveDeliveryPackage, rejectDeliveryPackage } from '../../lib/api/adminDelivery';

const DeliveryPackageReviewModal = ({
  isOpen,
  onClose,
  package: pkg,
  onStatusUpdate
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  if (!pkg) return null;

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = async () => {
    setIsApproving(true);
    try {
      const result = await approveDeliveryPackage(pkg.id, {});
      if (result.success) {
        onStatusUpdate({
          ...pkg,
          status: 'APPROVED',
          lastUpdatedAt: result.data.lastUpdatedAt
        });
        setShowApproveConfirm(false);
        onClose();
      } else {
        alert('Failed to approve package. Please try again.');
      }
    } catch (error) {
      console.error('Error approving package:', error);
      alert('Failed to approve package. Please try again.');
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
      const result = await rejectDeliveryPackage(pkg.id, {
        rejectionReason: rejectionReason.trim()
      });
      if (result.success) {
        onStatusUpdate({
          ...pkg,
          status: 'REJECTED',
          rejectionReason: result.data.rejectionReason,
          lastUpdatedAt: result.data.lastUpdatedAt
        });
        setShowRejectDialog(false);
        setRejectionReason('');
        onClose();
      } else {
        alert('Failed to reject package. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting package:', error);
      alert('Failed to reject package. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  const formatPricing = (pkg) => {
    if (!pkg.price) return 'Price information not available';
    
    const basePrice = typeof pkg.price === 'number' ? pkg.price : parseInt(pkg.price) || 0;
    const parts = [`Base: ${basePrice.toLocaleString()}원`];
    
    // Add per-km pricing if available
    if (pkg.pricingRules?.perKm) {
      parts.push(`Per km: ${pkg.pricingRules.perKm.toLocaleString()}원`);
    }
    
    // Add per-kg pricing if available
    if (pkg.pricingRules?.perKg) {
      parts.push(`Per kg: ${pkg.pricingRules.perKg.toLocaleString()}원`);
    }
    
    return parts.join(' / ');
  };

  const formatCoverage = (pkg) => {
    if (pkg.limitations?.maxDistance) {
      return `Up to ${pkg.limitations.maxDistance}km`;
    }
    if (pkg.coverageArea) {
      return pkg.coverageArea;
    }
    return 'Coverage information not available';
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

  const getServiceTypeLabel = (serviceType) => {
    const labels = {
      'home-delivery': 'Home Delivery',
      'office-relocation': 'Office Relocation',
      'express': 'Express',
      'bike': 'Bike',
      'car': 'Car',
      'truck': 'Truck',
      'standard': 'Standard'
    };
    return labels[serviceType] || serviceType;
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showApproveConfirm && !showRejectDialog}
        onClose={onClose}
        title="Delivery Package Review"
        size="xl"
      >
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{pkg.name || pkg.nameKo || 'Untitled Package'}</h3>
              <p className="text-sm text-gray-500 mt-1">ID: {pkg.id}</p>
            </div>
            {getStatusBadge(pkg.status)}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Key Facts */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Package Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service Type:</span>
                    <span className="text-sm font-medium">{getServiceTypeLabel(pkg.serviceType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pricing:</span>
                    <span className="text-sm font-medium">{formatPricing(pkg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coverage:</span>
                    <span className="text-sm font-medium">{formatCoverage(pkg)}</span>
                  </div>
                  {pkg.limitations?.maxWeight && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Weight:</span>
                      <span className="text-sm font-medium">{pkg.limitations.maxWeight}kg</span>
                    </div>
                  )}
                  {pkg.limitations?.maxFloors && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Floors:</span>
                      <span className="text-sm font-medium">{pkg.limitations.maxFloors}</span>
                    </div>
                  )}
                  {pkg.estimatedTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Est. Delivery Time:</span>
                      <span className="text-sm font-medium">{pkg.estimatedTime}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Partner Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Partner:</span>
                    <span className="text-sm font-medium">{pkg.partnerName || pkg.agencyId || 'N/A'}</span>
                  </div>
                  {pkg.partnerEmail && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{pkg.partnerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Description and Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {pkg.description || pkg.descriptionKo || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Pricing Rules */}
              {pkg.pricingRules && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Rules</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {pkg.pricingRules.basePrice && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base Price:</span>
                        <span className="text-sm font-medium">{pkg.pricingRules.basePrice.toLocaleString()}원</span>
                      </div>
                    )}
                    {pkg.pricingRules.perKm && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Per Kilometer:</span>
                        <span className="text-sm font-medium">{pkg.pricingRules.perKm.toLocaleString()}원</span>
                      </div>
                    )}
                    {pkg.pricingRules.perKg && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Per Kilogram:</span>
                        <span className="text-sm font-medium">{pkg.pricingRules.perKg.toLocaleString()}원</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {pkg.addOns && pkg.addOns.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Add-ons</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {pkg.addOns.map((addon, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-sm text-gray-600">{addon.name || addon.nameKo}:</span>
                        <span className="text-sm font-medium">
                          {addon.price?.toLocaleString()}원 {addon.unit ? `(${addon.unit})` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {pkg.features && pkg.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="list-disc list-inside space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-900">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* SLA / Notes */}
              {(pkg.sla || pkg.notes) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">SLA / Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {pkg.sla || pkg.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {pkg.submittedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="text-sm font-medium">
                        {new Date(pkg.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {pkg.lastUpdatedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium">
                        {new Date(pkg.lastUpdatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {!pkg.submittedAt && pkg.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {new Date(pkg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {pkg.status === 'REJECTED' && pkg.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Reason</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-900">{pkg.rejectionReason}</p>
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
            {pkg.status === 'PENDING_APPROVAL' && (
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
            Once approved, this delivery package will be available on the public platform. Continue?
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
        title="Reject Package"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Please provide a reason for rejection (minimum 10 characters). This reason will be shown to the delivery partner.
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

export default DeliveryPackageReviewModal;

