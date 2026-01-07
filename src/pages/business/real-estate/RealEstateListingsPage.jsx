import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingTypes, transactionTypes, listingStatuses, listingRegions } from '../../../mock/realEstateData';
import { getListingsByPartner, updateListing, seedMockListings } from '../../../store/realEstateListingsStore';
import { getApprovalById } from '../../../store/approvalsStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import StatusBadge from '../../../components/real-estate/StatusBadge';
import ActionMenu from '../../../components/real-estate/ActionMenu';

const RealEstateListingsPage = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [storedListings, setStoredListings] = useState([]);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [statusTab, setStatusTab] = useState('전체'); // New status tab filter
  const [regionFilter, setRegionFilter] = useState('서울 전체');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [listingToComplete, setListingToComplete] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [listingToArchive, setListingToArchive] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [listingToDuplicate, setListingToDuplicate] = useState(null);

  // Load partner's listings from store
  useEffect(() => {
    seedMockListings(); // Seed mock data if empty
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  }, [user?.email]);

  const allListings = useMemo(() => {
    // Only show partner's own listings - no mock data
    return storedListings;
  }, [storedListings]);

  const statusFilterOptions = useMemo(
    () => [...listingStatuses, '심사중', '반려'],
    []
  );

  // Normalize status for filtering
  const normalizeStatus = (status) => {
    if (status === 'LIVE' || status === '노출중') return 'Published';
    if (status === 'PENDING' || status === '심사중') return 'Under Review';
    if (status === 'Draft' || status === '초안') return 'Draft';
    if (status === 'HIDDEN' || status === '비노출') return 'Archived';
    if (status === 'COMPLETED' || status === '거래완료') return 'Completed';
    return status;
  };

  // Filter listings based on filters and status tab
  const filteredListings = useMemo(() => {
    return allListings.filter(listing => {
      const transactionMatch = transactionTypeFilter === '전체' || listing.transactionType === transactionTypeFilter;
      const normalizedStatus = normalizeStatus(listing.status);
      
      // Status tab filter (primary filter)
      let statusMatch = true;
      if (statusTab !== '전체') {
        if (statusTab === 'Draft') statusMatch = normalizedStatus === 'Draft';
        else if (statusTab === 'Under Review') statusMatch = normalizedStatus === 'Under Review';
        else if (statusTab === 'Published') statusMatch = normalizedStatus === 'Published';
        else if (statusTab === 'Archived') statusMatch = normalizedStatus === 'Archived';
      }
      
      // Legacy status filter (for backward compatibility)
      if (statusFilter !== '전체' && statusFilter !== statusTab) {
        statusMatch = statusMatch && (
          listing.status === statusFilter || 
          normalizedStatus === statusFilter
        );
      }
      
      const regionMatch = regionFilter === '서울 전체' || (listing.address || listing.region || listing.city || '').includes(regionFilter);
      return transactionMatch && statusMatch && regionMatch;
    });
  }, [allListings, transactionTypeFilter, statusFilter, statusTab, regionFilter]);

  // Check if listing has missing images
  const hasMissingImages = (listing) => {
    return !listing.images || listing.images.length === 0;
  };

  // Check if listing has missing contract
  const hasMissingContract = (listing) => {
    // This would check if there's an associated contract
    // For now, we'll check if status is LIVE but no contract exists
    return listing.status === 'LIVE' && !listing.hasContract;
  };

  // Check if listing is ready to publish
  const isReadyToPublish = (listing) => {
    return !hasMissingImages(listing) && !hasMissingContract(listing) && listing.status === 'PENDING';
  };

  // Get unmet requirements for publishing
  const getUnmetRequirements = (listing) => {
    const requirements = [];
    if (hasMissingImages(listing)) requirements.push('이미지');
    if (hasMissingContract(listing)) requirements.push('계약서');
    return requirements;
  };

  // Format price display
  const formatPrice = (listing) => {
    if (listing.price) {
      return `₩${Number(listing.price).toLocaleString()}`;
    }
    if (listing.monthly) {
      const deposit = listing.deposit ? `보증금 ₩${(Number(listing.deposit) / 1000000).toFixed(0)}M` : '';
      const monthly = `월 ₩${(Number(listing.monthly) / 1000).toFixed(0)}K`;
      return deposit ? `${deposit} · ${monthly}` : monthly;
    }
    return 'Not set';
  };

  // Duplicate listing
  const handleDuplicateListing = (id) => {
    const listing = allListings.find(l => l.id === id);
    if (!listing) return;
    
    const duplicatedListing = {
      ...listing,
      id: Date.now(),
      title: `${listing.title} (복사본)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add duplicated listing (would use store method in real app)
    setShowDuplicateModal(false);
    setListingToDuplicate(null);
    
    // Refresh listings
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  };

  // Archive listing
  const handleArchiveListing = (id) => {
    updateListing(Number(id), { status: 'HIDDEN', archived: true });
    setShowArchiveModal(false);
    setListingToArchive(null);
    
    // Refresh listings
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  };

  // Toggle listing status between 노출중 and 비노출
  const toggleListingStatus = (id, currentStatus) => {
    // Only allow toggle for LIVE listings
    if (currentStatus !== 'LIVE' && currentStatus !== '노출중') return;
    if (currentStatus === '거래완료') return;
    
    const newStatus = currentStatus === '노출중' || currentStatus === 'LIVE' ? 'HIDDEN' : 'LIVE';
    updateListing(Number(id), { status: newStatus });
    // Refresh listings
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  };

  // Mark listing as completed
  const markAsCompleted = (id) => {
    if (!id) return;
    updateListing(Number(id), { status: 'COMPLETED' });
    setShowCompleteModal(false);
    setListingToComplete(null);
    // Refresh listings
    if (user?.email) {
      const partnerListings = getListingsByPartner(user.email);
      setStoredListings(partnerListings);
    }
  };

  // Get rejection reason from approval if listing is rejected
  const getRejectionReason = (listingId) => {
    const approval = getApprovalById(`approval-${listingId}`);
    return approval?.rejectReason || null;
  };

  // Open confirmation modal for completing a listing
  const openCompleteModal = (id) => {
    setListingToComplete(id);
    setShowCompleteModal(true);
  };


  return (
    <div className="space-y-8 pb-20">
      {/* Zone 1: Header - Premium Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl border border-gray-200/60 p-8 shadow-lg shadow-blue-100/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-dabang-primary/10 to-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Property Management
            </h1>
            <p className="text-gray-600 text-lg font-medium">Only approved properties are visible to customers.</p>
          </div>
          <button
            onClick={() => navigate('/business/real-estate/listings/create')}
            className="relative px-8 py-4 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:from-dabang-primary/90 hover:to-indigo-600/90 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40 hover:-translate-y-0.5 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>
      </div>

      {/* Zone 2: Filter & Status Control - Premium Design */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
        {/* Status Tabs - Premium */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex space-x-2 px-6 py-2">
            {['전체', 'Draft', 'Under Review', 'Published', 'Archived'].map((tab) => {
              const labels = {
                '전체': '전체',
                'Draft': '초안',
                'Under Review': '심사 중',
                'Published': '게시됨',
                'Archived': '보관됨'
              };
              const isActive = statusTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`relative px-6 py-3.5 text-sm font-semibold rounded-t-xl transition-all duration-300 ${
                    isActive
                      ? 'text-dabang-primary bg-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {labels[tab] || tab}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-dabang-primary to-indigo-600"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters - Premium */}
        <div className="p-6 bg-gradient-to-b from-white to-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Transaction Type Filter */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Transaction Type</label>
              <div className="relative">
                <select
                  value={transactionTypeFilter}
                  onChange={(e) => setTransactionTypeFilter(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-dabang-primary/20 focus:border-dabang-primary transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                >
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Property Status Filter */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Property Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-dabang-primary/20 focus:border-dabang-primary transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                >
                  {statusFilterOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Region Filter */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Region</label>
              <div className="relative">
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-dabang-primary/20 focus:border-dabang-primary transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                >
                  {listingRegions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 3: Property List */}

      {/* Property List Table - Premium Design */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
        {filteredListings.length === 0 ? (
          // Empty State - Premium
          <div className="px-6 py-20 text-center">
            {statusTab === '전체' && allListings.length === 0 ? (
              <>
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200/30">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No properties yet</h3>
                <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">Upload your first property to get started and showcase your listings to potential customers.</p>
                <button
                  onClick={() => navigate('/business/real-estate/listings/create')}
                  className="px-8 py-4 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:from-dabang-primary/90 hover:to-indigo-600/90 transition-all duration-300 font-semibold shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40 hover:-translate-y-0.5"
                >
                  Upload your first property
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No properties match these filters</h3>
                <p className="text-sm text-gray-600">Try adjusting your filters to see more results.</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredListings.map((listing) => (
                  <tr 
                    key={listing.id} 
                    onClick={() => navigate(`/business/real-estate/listings/${listing.id}`)}
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-dabang-primary"
                  >
                    {/* Property Preview + Core Info */}
                    <td className="px-8 py-5">
                      <div className="flex items-start gap-5">
                        {/* Thumbnail - Premium */}
                        <div className="relative flex-shrink-0">
                          {listing.image || listing.images?.[0] ? (
                            <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                              <img 
                                src={listing.image || listing.images[0]} 
                                alt={listing.title || 'Property'}
                                className="w-16 h-16 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center shadow-inner group-hover:border-gray-400 transition-colors">
                              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {hasMissingImages(listing) && (
                            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg" title="Images required to publish">
                              <span className="text-white text-xs font-bold">!</span>
                            </span>
                          )}
                        </div>

                        {/* Core Info - Premium */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-dabang-primary transition-colors">
                                {listing.title || listing.name || 'Untitled Property'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {listing.address || listing.region || listing.city || 'Address not set'}
                              </p>
                              
                              {/* Validation Indicators - Premium */}
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                {hasMissingImages(listing) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/business/real-estate/listings/${listing.id}/edit?tab=images`);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm hover:shadow-md border border-red-200/50"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Images required to publish
                                    <span className="text-red-600 font-bold">→</span>
                                  </button>
                                )}
                                {hasMissingContract(listing) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/business/real-estate/listings/${listing.id}/edit?tab=contract`);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 hover:from-amber-100 hover:to-amber-200 transition-all duration-200 shadow-sm hover:shadow-md border border-amber-200/50"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Contract missing
                                    <span className="text-amber-600 font-bold">→</span>
                                  </button>
                                )}
                                {isReadyToPublish(listing) && (
                                  <span 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border border-green-200/50 shadow-sm"
                                    title={`Ready to publish. All requirements met: Images ✓, Contract ✓`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Ready to publish
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Property Meta - Premium */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-bold text-gray-900 mb-1">{listing.propertyType || listing.type || 'Not set'}</div>
                        <div className="text-xs text-gray-500 font-medium">{listing.transactionType || 'Not set'}</div>
                      </div>
                    </td>

                    {/* Price Summary - Premium */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-base font-bold text-gray-900">
                        {formatPrice(listing)}
                      </div>
                    </td>

                    {/* Status - Premium */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={listing.status} type="property" />
                        {listing.status === 'PENDING' && (
                          <span className="text-xs text-gray-500 font-medium">Awaiting admin review</span>
                        )}
                        {listing.status === 'REJECTED' && getRejectionReason(listing.id) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Rejection reason: ${getRejectionReason(listing.id)}`);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium text-left"
                          >
                            View reason
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions - Premium */}
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          listing={listing}
                          onEdit={() => navigate(`/business/real-estate/listings/${listing.id}/edit`)}
                          onUploadImages={() => navigate(`/business/real-estate/listings/${listing.id}/edit?tab=images`)}
                          onAttachContract={() => navigate(`/business/real-estate/listings/${listing.id}/edit?tab=contract`)}
                          onDuplicate={() => {
                            setListingToDuplicate(listing.id);
                            setShowDuplicateModal(true);
                          }}
                          onArchive={() => {
                            setListingToArchive(listing.id);
                            setShowArchiveModal(true);
                          }}
                          onComplete={() => openCompleteModal(listing.id)}
                          onToggleVisibility={() => toggleListingStatus(listing.id, listing.status)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Completing Listing - Premium */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200/60 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">거래완료 처리</h3>
            <p className="text-gray-600 mb-8 text-center">정말 이 매물을 거래완료 상태로 변경하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setListingToComplete(null);
                }}
                className="px-6 py-3 border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                취소
              </button>
              <button
                onClick={() => markAsCompleted(listingToComplete)}
                className="px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal - Premium */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200/60 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">매물 보관</h3>
            <p className="text-gray-600 mb-8 text-center">이 매물을 보관하시겠습니까? 보관된 매물은 비노출 상태로 변경됩니다.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setListingToArchive(null);
                }}
                className="px-6 py-3 border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                취소
              </button>
              <button
                onClick={() => handleArchiveListing(listingToArchive)}
                className="px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40"
              >
                보관하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Confirmation Modal - Premium */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200/60 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">매물 복제</h3>
            <p className="text-gray-600 mb-8 text-center">이 매물을 복제하여 새 매물로 만들겠습니까? 복제된 매물은 초안 상태로 생성됩니다.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setListingToDuplicate(null);
                }}
                className="px-6 py-3 border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                취소
              </button>
              <button
                onClick={() => handleDuplicateListing(listingToDuplicate)}
                className="px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-dabang-primary to-indigo-600 hover:from-dabang-primary/90 hover:to-indigo-600/90 transition-all duration-200 shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40"
              >
                복제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateListingsPage;