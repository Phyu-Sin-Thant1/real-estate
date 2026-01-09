import React, { useState, useEffect, useMemo } from 'react';
import { getListings } from '../../store/realEstateListingsStore';
import { getBusinessAccounts } from '../../store/businessAccountsStore';
import RealEstateReviewModal from '../../components/admin/RealEstateReviewModal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Toast from '../../components/delivery/Toast';
import { addAuditLog } from '../../lib/auditLog';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const AdminRealEstateOversightPage = () => {
  const { user } = useUnifiedAuth();
  const [listings, setListings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  // Filters
  const [statusFilter, setStatusFilter] = useState('PENDING_APPROVAL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load listings and filter out DRAFT status (admin shouldn't see drafts)
    const allListings = getListings().filter(l => l.status !== 'DRAFT');
    
    // Map old statuses to new ones for backward compatibility
    const mappedListings = allListings.map(listing => {
      let status = listing.status;
      // Map old statuses to new ones
      if (status === 'PENDING' || status === 'PENDING_REVIEW') {
        status = 'PENDING_APPROVAL';
      } else if (status === 'LIVE') {
        status = 'APPROVED';
      } else if (status === 'HIDDEN') {
        // Keep HIDDEN as is, but we'll treat it as REJECTED for admin oversight
        status = 'REJECTED';
      }
      return { ...listing, status };
    });
    
    setListings(mappedListings);
    
    // Load partners
    const allPartners = getBusinessAccounts().filter(p => p.role === 'BUSINESS_REAL_ESTATE');
    setPartners(allPartners);
  }, []);

  // Filtered listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Partner filter
    if (partnerFilter !== 'ALL') {
      filtered = filtered.filter(listing => 
        listing.partnerEmail === partnerFilter || 
        listing.partnerId === partnerFilter ||
        listing.partnerName === partnerFilter
      );
    }

    // Search filter (title, location, partner name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(listing => {
        const title = (listing.title || '').toLowerCase();
        const location = (listing.address || listing.locationText || listing.city || '').toLowerCase();
        const partnerName = (listing.partnerName || listing.partnerEmail || '').toLowerCase();
        return title.includes(query) || location.includes(query) || partnerName.includes(query);
      });
    }

    return filtered;
  }, [listings, statusFilter, partnerFilter, searchQuery]);

  const handleReview = (property) => {
    setSelectedProperty(property);
    setIsReviewModalOpen(true);
  };

  const handleStatusUpdate = async (updatedProperty) => {
    try {
      // Update local state (store is already updated by API functions)
      setListings(prev => prev.map(p => 
        p.id === updatedProperty.id ? updatedProperty : p
      ));

      // Create audit log entry
      const action = updatedProperty.status === 'APPROVED' ? 'PROPERTY_APPROVED' : 'PROPERTY_REJECTED';
      addAuditLog({
        action,
        targetId: String(updatedProperty.id),
        metadata: {
          partnerId: updatedProperty.partnerId || updatedProperty.partnerEmail,
          partnerName: updatedProperty.partnerName,
          propertyTitle: updatedProperty.title
        },
        user: user?.name || 'Admin',
        details: `${action.replace(/_/g, ' ')}: ${updatedProperty.title}`
      });

      // Show toast
      setToast({
        isVisible: true,
        message: updatedProperty.status === 'APPROVED' 
          ? 'Property approved successfully. It is now visible on the public website.'
          : 'Property rejected successfully.',
        type: updatedProperty.status === 'APPROVED' ? 'success' : 'info'
      });

      // Close modal
      setIsReviewModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error updating property status:', error);
      setToast({
        isVisible: true,
        message: 'Failed to update property status. Please try again.',
        type: 'error'
      });
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('PENDING_APPROVAL');
    setPartnerFilter('ALL');
    setSearchQuery('');
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

  const formatPrice = (listing) => {
    if (listing.transactionType === '매매' && listing.price) {
      const price = typeof listing.price === 'string' 
        ? parseInt(listing.price.replace(/[^0-9]/g, '')) 
        : listing.price;
      return `${price.toLocaleString()}원`;
    }
    if (listing.transactionType === '전세' && listing.deposit) {
      const deposit = typeof listing.deposit === 'string' 
        ? parseInt(listing.deposit.replace(/[^0-9]/g, '')) 
        : listing.deposit;
      return `전세 ${deposit.toLocaleString()}원`;
    }
    if (listing.transactionType === '월세') {
      const parts = [];
      if (listing.deposit) {
        const deposit = typeof listing.deposit === 'string' 
          ? parseInt(listing.deposit.replace(/[^0-9]/g, '')) 
          : listing.deposit;
        parts.push(`보증금 ${deposit.toLocaleString()}원`);
      }
      if (listing.monthly) {
        const monthly = typeof listing.monthly === 'string' 
          ? parseInt(listing.monthly.replace(/[^0-9]/g, '')) 
          : listing.monthly;
        parts.push(`월세 ${monthly.toLocaleString()}원`);
      }
      return parts.join(' / ') || '가격 정보 없음';
    }
    return '가격 정보 없음';
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: listings.length,
      pending: listings.filter(l => l.status === 'PENDING_APPROVAL').length,
      approved: listings.filter(l => l.status === 'APPROVED').length,
      rejected: listings.filter(l => l.status === 'REJECTED').length
    };
  }, [listings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Real-Estate Oversight</h1>
        <p className="text-gray-600 mt-1">Review and approve partner-uploaded properties before publishing.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-amber-100 text-amber-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select
              label="Status"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'REJECTED', label: 'Rejected' }
              ]}
            />
          </div>
          
          <div>
            <Select
              label="Partner"
              id="partner-filter"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Partners' },
                ...partners.map(p => ({
                  value: p.email,
                  label: p.companyName || p.email
                }))
              ]}
            />
          </div>
          
          <div>
            <Input
              label="Search"
              id="search"
              type="text"
              placeholder="Title, location, partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No properties found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{listing.title || 'Untitled Property'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {listing.address || listing.locationText || listing.city || 'No location'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.partnerName || listing.partnerEmail || 'Unknown Partner'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.propertyType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(listing)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.submittedAt || listing.createdAt
                        ? new Date(listing.submittedAt || listing.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleReview(listing)}
                      >
                        Review
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
      <RealEstateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
        onStatusUpdate={handleStatusUpdate}
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

export default AdminRealEstateOversightPage;
