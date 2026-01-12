import React, { useState, useEffect, useMemo } from 'react';
import { getAllPackages } from '../../store/servicePackagesStore';
import { getBusinessAccounts } from '../../store/businessAccountsStore';
import DeliveryPackageReviewModal from '../../components/admin/DeliveryPackageReviewModal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Toast from '../../components/delivery/Toast';
import { addAuditLog } from '../../lib/auditLog';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const AdminDeliveryPackageOversightPage = () => {
  const { user } = useUnifiedAuth();
  const [packages, setPackages] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  // Filters
  const [statusFilter, setStatusFilter] = useState('PENDING_APPROVAL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load packages and filter out DRAFT status (admin shouldn't see drafts)
    const allPackages = getAllPackages().filter(p => p.status !== 'DRAFT');
    
    // Map packages to include status and partner info
    // Default status to PENDING_APPROVAL if not set (for backward compatibility)
    const mappedPackages = allPackages.map(pkg => {
      let status = pkg.status;
      if (!status) {
        // If no status, default based on isActive
        status = pkg.isActive ? 'APPROVED' : 'PENDING_APPROVAL';
      }
      return { ...pkg, status };
    });
    
    setPackages(mappedPackages);
    
    // Load delivery partners
    const allPartners = getBusinessAccounts().filter(p => p.role === 'BUSINESS_DELIVERY');
    setPartners(allPartners);
  }, []);

  // Get unique service types
  const serviceTypes = useMemo(() => {
    const types = new Set();
    packages.forEach(pkg => {
      if (pkg.serviceType) types.add(pkg.serviceType);
    });
    return Array.from(types).sort();
  }, [packages]);

  // Map agencyId to partner info
  const getPartnerInfo = (agencyId) => {
    // Try to find partner by agencyId or email
    const partner = partners.find(p => 
      p.id === agencyId || 
      p.email === agencyId ||
      p.companyName === agencyId
    );
    return partner ? {
      id: partner.id || partner.email,
      name: partner.companyName || partner.email,
      email: partner.email
    } : {
      id: agencyId,
      name: agencyId,
      email: null
    };
  };

  // Filtered packages
  const filteredPackages = useMemo(() => {
    let filtered = [...packages];

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(pkg => pkg.status === statusFilter);
    }

    // Partner filter
    if (partnerFilter !== 'ALL') {
      filtered = filtered.filter(pkg => {
        const partnerInfo = getPartnerInfo(pkg.agencyId);
        return partnerInfo.id === partnerFilter || partnerInfo.email === partnerFilter;
      });
    }

    // Service type filter
    if (serviceTypeFilter !== 'ALL') {
      filtered = filtered.filter(pkg => pkg.serviceType === serviceTypeFilter);
    }

    // Search filter (package name, partner name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(pkg => {
        const packageName = (pkg.name || pkg.nameKo || '').toLowerCase();
        const partnerInfo = getPartnerInfo(pkg.agencyId);
        const partnerName = (partnerInfo.name || '').toLowerCase();
        return packageName.includes(query) || partnerName.includes(query);
      });
    }

    return filtered;
  }, [packages, statusFilter, partnerFilter, serviceTypeFilter, searchQuery, partners]);

  const handleReview = (pkg) => {
    const partnerInfo = getPartnerInfo(pkg.agencyId);
    setSelectedPackage({
      ...pkg,
      partnerName: partnerInfo.name,
      partnerEmail: partnerInfo.email,
      partnerId: partnerInfo.id
    });
    setIsReviewModalOpen(true);
  };

  const handleStatusUpdate = async (updatedPackage) => {
    try {
      // Update local state (store is already updated by API functions)
      setPackages(prev => prev.map(p => 
        p.id === updatedPackage.id ? updatedPackage : p
      ));

      // Create audit log entry
      const action = updatedPackage.status === 'APPROVED' 
        ? 'DELIVERY_PACKAGE_APPROVED' 
        : 'DELIVERY_PACKAGE_REJECTED';
      addAuditLog({
        action,
        targetId: String(updatedPackage.id),
        metadata: {
          partnerId: updatedPackage.partnerId || updatedPackage.agencyId,
          partnerName: updatedPackage.partnerName,
          packageName: updatedPackage.name || updatedPackage.nameKo
        },
        user: user?.name || 'Admin',
        details: `${action.replace(/_/g, ' ')}: ${updatedPackage.name || updatedPackage.nameKo}`
      });

      // Show toast
      setToast({
        isVisible: true,
        message: updatedPackage.status === 'APPROVED' 
          ? 'Delivery package approved successfully. It is now available on the public platform.'
          : 'Delivery package rejected successfully.',
        type: updatedPackage.status === 'APPROVED' ? 'success' : 'info'
      });

      // Close modal
      setIsReviewModalOpen(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error updating package status:', error);
      setToast({
        isVisible: true,
        message: 'Failed to update package status. Please try again.',
        type: 'error'
      });
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('PENDING_APPROVAL');
    setPartnerFilter('ALL');
    setServiceTypeFilter('ALL');
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

  const formatPricing = (pkg) => {
    if (!pkg.price) return 'Price information not available';
    const price = typeof pkg.price === 'number' ? pkg.price : parseInt(pkg.price) || 0;
    return `${price.toLocaleString()}원`;
  };

  const formatCoverage = (pkg) => {
    if (pkg.limitations?.maxDistance) {
      return `Up to ${pkg.limitations.maxDistance}km`;
    }
    return 'Coverage information not available';
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

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: packages.length,
      pending: packages.filter(p => p.status === 'PENDING_APPROVAL').length,
      approved: packages.filter(p => p.status === 'APPROVED').length,
      rejected: packages.filter(p => p.status === 'REJECTED').length
    };
  }, [packages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Oversight</h1>
        <p className="text-gray-600 mt-1">Review and approve delivery packages before they go live.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Packages</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  value: p.id || p.email,
                  label: p.companyName || p.email
                }))
              ]}
            />
          </div>
          
          <div>
            <Select
              label="Service Type"
              id="service-type-filter"
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Types' },
                ...serviceTypes.map(type => ({
                  value: type,
                  label: getServiceTypeLabel(type)
                }))
              ]}
            />
          </div>
          
          <div>
            <Input
              label="Search"
              id="search"
              type="text"
              placeholder="Package name, partner..."
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

      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price / Pricing Rule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage
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
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No packages found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => {
                  const partnerInfo = getPartnerInfo(pkg.agencyId);
                  return (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.name || pkg.nameKo || 'Untitled Package'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {partnerInfo.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getServiceTypeLabel(pkg.serviceType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPricing(pkg)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCoverage(pkg)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(pkg.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pkg.submittedAt || pkg.createdAt
                          ? new Date(pkg.submittedAt || pkg.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleReview(pkg)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <DeliveryPackageReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedPackage(null);
        }}
        package={selectedPackage}
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

export default AdminDeliveryPackageOversightPage;


