import React, { useState, useEffect, useMemo } from 'react';
import { getOrders, getOrderById, updateOrder } from '../../store/deliveryOrdersStore';
import { addApproval } from '../../store/approvalsStore';

// Helper function to safely parse date
const safeParseDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// Helper function to normalize string for search
const normalizeString = (str) => {
  if (!str) return '';
  return String(str).toLowerCase().trim();
};

const AdminDeliveryOversightPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState('ALL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [disputeFilter, setDisputeFilter] = useState('ALL');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAllOrders(getOrders());
  }, []);

  // Get unique partners from orders
  const uniquePartners = useMemo(() => {
    const partners = new Set();
    allOrders.forEach(order => {
      if (order.partnerName) partners.add(order.partnerName);
      if (order.partnerId) partners.add(order.partnerId);
    });
    return Array.from(partners).sort();
  }, [allOrders]);

  // Filtered orders using useMemo
  const filteredOrders = useMemo(() => {
    let filtered = [...allOrders];

    // Date filter
    if (dateRange !== 'ALL') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = safeParseDate(order.createdAt);
        if (!orderDate) return true; // Include if date is invalid
        
        switch (dateRange) {
          case 'TODAY':
            return orderDate >= today;
          case 'LAST_7_DAYS':
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return orderDate >= sevenDaysAgo;
          case 'LAST_30_DAYS':
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    // Partner filter
    if (partnerFilter !== 'ALL') {
      filtered = filtered.filter(order => 
        order.partnerName === partnerFilter || order.partnerId === partnerFilter
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Dispute status filter
    if (disputeFilter !== 'ALL') {
      if (disputeFilter === 'NONE') {
        filtered = filtered.filter(order => 
          !order.disputeStatus || order.disputeStatus === '' || order.disputeStatus === 'NONE'
        );
      } else {
        filtered = filtered.filter(order => order.disputeStatus === disputeFilter);
      }
    }

    // Flagged only filter
    if (flaggedOnly) {
      filtered = filtered.filter(order => 
        order.flagged === true ||
        order.status === 'FAILED' ||
        order.status === 'CANCELLED' ||
        order.disputeStatus === 'OPEN'
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = normalizeString(searchQuery);
      filtered = filtered.filter(order => {
        return (
          normalizeString(order.orderNo).includes(query) ||
          normalizeString(order.customerName).includes(query) ||
          normalizeString(order.customerPhone).includes(query) ||
          normalizeString(order.pickupAddress).includes(query) ||
          normalizeString(order.dropoffAddress).includes(query)
        );
      });
    }

    return filtered;
  }, [allOrders, dateRange, partnerFilter, statusFilter, disputeFilter, flaggedOnly, searchQuery]);

  const handleRowClick = (order) => {
    const fullOrder = getOrderById(order.id);
    setSelectedOrder(fullOrder);
    setShowDetailDrawer(true);
  };

  const handleResolveDispute = (orderId) => {
    if (window.confirm('이 분쟁을 해결 처리하시겠습니까?')) {
      updateOrder(orderId, { 
        disputeStatus: 'RESOLVED',
        flagged: false 
      });
      setAllOrders(getOrders());
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(getOrderById(orderId));
      }
    }
  };

  const handleResetFilters = () => {
    setDateRange('ALL');
    setPartnerFilter('ALL');
    setStatusFilter('ALL');
    setDisputeFilter('ALL');
    setFlaggedOnly(false);
    setSearchQuery('');
  };

  const handleRequestRefundReview = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return;

    const approval = {
      id: `approval-refund-${orderId}-${Date.now()}`,
      type: 'DELIVERY_REFUND_REQUEST',
      entityId: orderId,
      entityType: 'DELIVERY_ORDER',
      status: 'PENDING',
      submittedBy: 'admin',
      submittedAt: new Date().toISOString(),
      meta: {
        partnerId: order.partnerId,
        partnerName: order.partnerName,
        summary: `Refund request for ${order.orderNo}`,
      },
    };

    addApproval(approval);
    alert('환불 검토 요청이 생성되었습니다. 승인 페이지에서 확인할 수 있습니다.');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisputeStatusBadgeClass = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Oversight</h1>
        <p className="text-gray-600 mt-1">Monitor failed, cancelled, and disputed delivery orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Flagged Orders</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredOrders.filter(o => o.flagged === true || o.status === 'FAILED' || o.status === 'CANCELLED' || o.disputeStatus === 'OPEN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-100 text-orange-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Open Disputes</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredOrders.filter(o => o.disputeStatus === 'OPEN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-100 text-yellow-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Failed Orders</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredOrders.filter(o => o.status === 'FAILED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
            </select>
          </div>

          {/* Partner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
            <select
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              <option value="ALL">All Partners</option>
              {uniquePartners.map(partner => (
                <option key={partner} value={partner}>{partner}</option>
              ))}
            </select>
          </div>

          {/* Order Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              <option value="ALL">All</option>
              <option value="FAILED">FAILED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
            </select>
          </div>

          {/* Dispute Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dispute Status</label>
            <select
              value={disputeFilter}
              onChange={(e) => setDisputeFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              <option value="ALL">All</option>
              <option value="OPEN">OPEN</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="NONE">NONE</option>
            </select>
          </div>

          {/* Flagged Only */}
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flaggedOnly}
                onChange={(e) => setFlaggedOnly(e.target.checked)}
                className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Flagged only</span>
            </label>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Order No, Customer, Address..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            />
          </div>
        </div>

        {/* Reset Filters Button - Secondary Action */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dropoff
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispute Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No orders match the current filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.partnerName || order.partnerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.pickupAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.dropoffAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDisputeStatusBadgeClass(order.disputeStatus)}`}>
                        {order.disputeStatus || 'NONE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {showDetailDrawer && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="bg-white w-full max-w-2xl h-full shadow-xl border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => {
                    setShowDetailDrawer(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order No:</span>
                    <span className="text-sm font-medium">{selectedOrder.orderNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dispute Status:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDisputeStatusBadgeClass(selectedOrder.disputeStatus)}`}>
                      {selectedOrder.disputeStatus || 'NONE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Partner Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Partner Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Partner:</span>
                    <span className="text-sm font-medium">{selectedOrder.partnerName || selectedOrder.partnerId}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{selectedOrder.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Addresses</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-xs text-gray-500">Pickup:</span>
                    <p className="text-sm font-medium">{selectedOrder.pickupAddress}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Dropoff:</span>
                    <p className="text-sm font-medium">{selectedOrder.dropoffAddress}</p>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {selectedOrder.driverName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Driver Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Driver:</span>
                      <span className="text-sm font-medium">{selectedOrder.driverName}</span>
                    </div>
                    {selectedOrder.driverPhone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium">{selectedOrder.driverPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions (Read-only governance) */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                {selectedOrder.disputeStatus === 'OPEN' && (
                  <button
                    onClick={() => {
                      handleResolveDispute(selectedOrder.id);
                    }}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Resolve Dispute
                  </button>
                )}
                {(selectedOrder.status === 'FAILED' || selectedOrder.disputeStatus === 'OPEN') && (
                  <button
                    onClick={() => {
                      handleRequestRefundReview(selectedOrder.id);
                    }}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
                  >
                    Request Refund Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryOversightPage;
