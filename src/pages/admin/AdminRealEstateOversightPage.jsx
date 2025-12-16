import React, { useState, useEffect } from 'react';
import { getListings, updateListing } from '../../store/realEstateListingsStore';
import { getBusinessAccounts } from '../../store/businessAccountsStore';

const AdminRealEstateOversightPage = () => {
  const [listings, setListings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedListings, setSelectedListings] = useState([]);
  const [dateRange, setDateRange] = useState('ALL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    setListings(getListings());
    setPartners(getBusinessAccounts().filter(p => p.role === 'BUSINESS_REAL_ESTATE'));
  }, []);

  const statuses = ['ALL', 'LIVE', 'HIDDEN', 'PENDING', 'REJECTED'];

  // Filter listings based on filters
  const filteredListings = listings.filter(listing => {
    const statusMatch = statusFilter === 'ALL' || listing.status === statusFilter;
    const partnerMatch = partnerFilter === 'ALL' || listing.partnerEmail === partnerFilter || listing.partnerId === partnerFilter;
    return statusMatch && partnerMatch;
  });

  const handleSelectListing = (listingId) => {
    setSelectedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map(l => l.id));
    }
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setIsDrawerOpen(true);
  };

  const handleToggleVisibility = (listingId) => {
    const listing = listings.find(l => l.id === listingId || String(l.id) === String(listingId));
    if (!listing) return;

    const newStatus = listing.status === 'HIDDEN' ? 'LIVE' : 'HIDDEN';
    updateListing(listingId, { status: newStatus });
    setListings(getListings());
    if (selectedListing && (selectedListing.id === listingId || String(selectedListing.id) === String(listingId))) {
      setSelectedListing({ ...selectedListing, status: newStatus });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'HIDDEN': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_REVIEW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'LIVE': return '노출중';
      case 'HIDDEN': return '비노출';
      case 'PENDING_REVIEW': return '검토중';
      default: return status;
    }
  };

  // Calculate summary stats
  const totalListings = listings.length;
  const pendingListings = listings.filter(l => l.status === 'PENDING').length;
  const hiddenListings = listings.filter(l => l.status === 'HIDDEN').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Real-Estate Oversight</h1>
        <p className="text-gray-600 mt-1">Monitor and moderate property listings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m8 0V9m0 4v4m-4-4v4m8-4v4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
              <p className="text-2xl font-semibold text-gray-900">{pendingListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-100 text-yellow-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Hidden Listings</h3>
              <p className="text-2xl font-semibold text-gray-900">{hiddenListings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
            <select
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              <option value="ALL">All Partners</option>
              {partners.map(partner => (
                <option key={partner.email} value={partner.email}>
                  {partner.companyName || partner.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setDateRange('ALL');
                setPartnerFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
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
                    No listings found
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(listing)}>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={() => handleSelectListing(listing.id)}
                        className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                      />
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{listing.title || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{listing.partnerName || listing.partnerEmail || 'Unknown Partner'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listing.address || listing.city || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listing.price ? `${listing.price}원` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(listing.status)}`}>
                      {getStatusLabel(listing.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listing.partnerName || listing.partnerEmail || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewDetails(listing)}
                        className="text-dabang-primary hover:text-dabang-primary/80"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleToggleVisibility(listing.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        {listing.status === 'HIDDEN' ? 'Unhide' : 'Hide'}
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {isDrawerOpen && selectedListing && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsDrawerOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Listing Details</h2>
                        <button
                          onClick={() => setIsDrawerOpen(false)}
                          className="ml-3 h-7 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                        >
                          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Title</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedListing.title || 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedListing.address || selectedListing.city || 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Price</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedListing.price ? `${selectedListing.price}원` : 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedListing.status)}`}>
                              {getStatusLabel(selectedListing.status)}
                            </span>
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Partner</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedListing.partnerName || selectedListing.partnerEmail || 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Description</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedListing.description || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Close
                    </button>
                    {(selectedListing.status === 'LIVE' || selectedListing.status === 'HIDDEN') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(selectedListing.id);
                        }}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        {selectedListing.status === 'HIDDEN' ? 'Unhide Listing' : 'Hide Listing'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRealEstateOversightPage;