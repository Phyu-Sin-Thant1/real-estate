import React, { useState, useEffect, useMemo } from 'react';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getAllCustomerOrders, getCustomerOrdersByStatus } from '../../../store/customerOrdersStore';
import { getAllQuoteRequests } from '../../../store/quoteRequestsStore';
import { getOrdersByPartner } from '../../../store/deliveryOrdersStore';
import Modal from '../../../components/common/Modal';

const BusinessOrderHistoryPage = () => {
  const { user } = useUnifiedAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    // Get customer orders (completed and canceled orders)
    const customerOrders = getAllCustomerOrders();
    
    // Filter to show only completed and canceled orders for history
    const historicalOrders = customerOrders.filter(order => 
      order.status === 'completed' || order.status === 'canceled'
    );

    // Also include legacy data from quote requests and delivery orders
    const quoteRequests = getAllQuoteRequests();
    const deliveryOrders = getOrdersByPartner(user?.email || '');
    
    const approvedQuotes = quoteRequests
      .filter(q => q.status === 'approved')
      .map(q => ({
        id: q.id,
        orderId: `QUOTE-${q.id}`,
        orderNo: `QUOTE-${q.id}`,
        type: 'quote',
        customerName: q.customerName,
        customerPhone: q.customerPhone,
        customerEmail: q.customerEmail,
        selectedPackage: {
          name: q.serviceName,
          category: q.serviceName,
          basePrice: q.basePrice || 0,
          description: q.serviceName
        },
        packageName: q.serviceName,
        packagePrice: q.basePrice || 0,
        totalPrice: q.totalPrice,
        basePrice: q.basePrice,
        addOns: [],
        additionalCosts: (q.totalPrice || 0) - (q.basePrice || 0),
        pickupAddress: q.pickupAddress,
        deliveryAddress: q.deliveryAddress,
        orderDate: q.createdAt ? new Date(q.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        serviceDate: q.preferredDate || q.createdAt ? new Date(q.preferredDate || q.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        priceBreakdown: q.priceBreakdown,
        extraOptions: q.extraOptions,
        specialInstructions: q.extraOptions?.additionalRequests || '',
        status: 'completed',
        paymentStatus: 'paid',
        driver: q.driver ? (typeof q.driver === 'object' ? q.driver : { name: q.driver, phone: q.driverPhone || '' }) : null,
        vehicle: q.vehicle ? (typeof q.vehicle === 'object' ? q.vehicle : { name: q.vehicle, plateNumber: q.vehiclePlateNumber || '' }) : null,
        driverName: q.driverName,
        driverPhone: q.driverPhone,
        vehicleName: q.vehicleName,
        vehiclePlateNumber: q.vehiclePlateNumber,
        createdAt: q.createdAt,
        completedAt: q.reviewedAt || q.updatedAt
      }));

    // Combine and sort by date (newest first)
    const allOrders = [...historicalOrders, ...approvedQuotes].sort(
      (a, b) => {
        const dateA = new Date(a.orderDate || a.createdAt || 0);
        const dateB = new Date(b.orderDate || b.createdAt || 0);
        return dateB - dateA;
      }
    );

    setOrders(allOrders);
  };

  // Get unique packages for filter
  const uniquePackages = useMemo(() => {
    const packages = orders.map(order => 
      order.selectedPackage?.name || order.packageName || 'N/A'
    );
    return [...new Set(packages)];
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Package filter
      const packageName = order.selectedPackage?.name || order.packageName || 'N/A';
      if (packageFilter !== 'all' && packageName !== packageFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          (order.orderId || order.orderNo || order.id || '').toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          packageName.toLowerCase().includes(searchLower) ||
          (order.customerPhone || '').includes(searchTerm)
        );
      }

      // Date range filter
      if (dateRangeFilter !== 'all') {
        const orderDate = new Date(order.orderDate || order.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateRangeFilter === 'today') {
          const orderDateOnly = new Date(orderDate);
          orderDateOnly.setHours(0, 0, 0, 0);
          return orderDateOnly.getTime() === today.getTime();
        } else if (dateRangeFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateRangeFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
      }

      return true;
    });
  }, [orders, statusFilter, packageFilter, searchTerm, dateRangeFilter]);


  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { label: '완료됨', color: 'bg-green-100 text-green-700' },
      canceled: { label: '취소됨', color: 'bg-red-100 text-red-700' },
      cancelled: { label: '취소됨', color: 'bg-red-100 text-red-700' },
      pending: { label: '대기 중', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: '확인됨', color: 'bg-blue-100 text-blue-700' },
      in_progress: { label: '진행 중', color: 'bg-purple-100 text-purple-700' }
    };

    const statusLower = status?.toLowerCase();
    const statusInfo = statusMap[statusLower] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return `₩${(price || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
          <p className="text-sm text-gray-600 mt-1">완료된 주문과 취소된 주문의 내역을 확인하세요</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">전체 주문</div>
          <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">완료된 주문</div>
          <div className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">취소된 주문</div>
          <div className="text-3xl font-bold text-red-600">
            {orders.filter(o => o.status === 'canceled' || o.status === 'cancelled').length}
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">총 매출</div>
          <div className="text-3xl font-bold text-orange-600">
            {formatPrice(orders
              .filter(o => o.status === 'completed')
              .reduce((sum, o) => sum + (o.totalPrice || 0), 0))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary bg-white"
            >
              <option value="all">전체 상태</option>
              <option value="completed">완료됨</option>
              <option value="canceled">취소됨</option>
            </select>
          </div>

          {/* Package Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">패키지</label>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary bg-white"
            >
              <option value="all">전체 패키지</option>
              {uniquePackages.map(pkg => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">기간</label>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary bg-white"
            >
              <option value="all">전체 기간</option>
              <option value="today">오늘</option>
              <option value="week">최근 7일</option>
              <option value="month">최근 30일</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">검색</label>
            <input
              type="text"
              placeholder="주문번호, 고객명, 패키지명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">주문 목록 ({filteredOrders.length}개)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">주문번호</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">고객명</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">패키지</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">총 가격</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">주문일</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">서비스일</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    주문 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderId || order.orderNo || order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.selectedPackage?.name || order.packageName || order.serviceName || 'N/A'}
                      </div>
                      {order.selectedPackage?.category && (
                        <div className="text-xs text-gray-500">{order.selectedPackage.category}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{formatPrice(order.totalPrice)}</div>
                      {order.additionalCosts > 0 && (
                        <div className="text-xs text-gray-500">+{formatPrice(order.additionalCosts)} 추가</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.orderDate || formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.serviceDate || order.preferredDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRowClick(order)}
                        className="px-3 py-1.5 text-dabang-primary hover:bg-dabang-primary/10 rounded-lg font-semibold text-sm transition-all duration-200"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="주문 상세 정보"
        size="large"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">주문번호</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.orderId || selectedOrder.orderNo || selectedOrder.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">상태</div>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">주문일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.orderDate || formatDate(selectedOrder.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">서비스일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.serviceDate || selectedOrder.preferredDate || 'N/A'}</div>
                </div>
                {selectedOrder.completedAt && (
                  <div>
                    <div className="text-sm text-gray-600">완료일</div>
                    <div className="text-base font-medium text-gray-900">{formatDate(selectedOrder.completedAt)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">이름</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">연락처</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">이메일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.customerEmail || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주소 정보</h3>
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1">픽업 주소</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.pickupAddress || selectedOrder.pickup || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">배송 주소</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.deliveryAddress || selectedOrder.dropoffAddress || selectedOrder.dropoff || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">패키지 정보</h3>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedOrder.selectedPackage?.name || selectedOrder.packageName || selectedOrder.serviceName || 'N/A'}
                    </div>
                    {selectedOrder.selectedPackage?.category && (
                      <div className="text-sm text-gray-600 mt-1">{selectedOrder.selectedPackage.category}</div>
                    )}
                    {selectedOrder.selectedPackage?.description && (
                      <div className="text-sm text-gray-600 mt-1">{selectedOrder.selectedPackage.description}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">기본 가격</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(selectedOrder.packagePrice || selectedOrder.basePrice || selectedOrder.selectedPackage?.basePrice || 0)}
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                {(selectedOrder.addOns && selectedOrder.addOns.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">추가 옵션</div>
                    <div className="space-y-2">
                      {selectedOrder.addOns.map((addOn, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {addOn.name} (×{addOn.quantity})
                          </span>
                          <span className="font-semibold text-gray-900">{formatPrice(addOn.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy Extra Options */}
                {selectedOrder.extraOptions && !selectedOrder.addOns && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">추가 옵션</div>
                    <div className="space-y-2">
                      {selectedOrder.extraOptions.extraFloors > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">추가 층수</span>
                          <span className="font-semibold text-gray-900">{selectedOrder.extraOptions.extraFloors}층</span>
                        </div>
                      )}
                      {selectedOrder.extraOptions.largeItems > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">대형 물품</span>
                          <span className="font-semibold text-gray-900">{selectedOrder.extraOptions.largeItems}개</span>
                        </div>
                      )}
                      {selectedOrder.extraOptions.fragileHandling > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">깨지기 쉬운 물품</span>
                          <span className="font-semibold text-gray-900">{selectedOrder.extraOptions.fragileHandling}개</span>
                        </div>
                      )}
                      {selectedOrder.extraOptions.itemWeight && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">물품 무게</span>
                          <span className="font-semibold text-gray-900">{selectedOrder.extraOptions.itemWeight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Breakdown (Legacy) */}
                {selectedOrder.priceBreakdown && !selectedOrder.addOns && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">가격 내역</div>
                    <div className="space-y-2">
                      {selectedOrder.priceBreakdown.extraFloors > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">추가 층</span>
                          <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.priceBreakdown.extraFloors)}</span>
                        </div>
                      )}
                      {selectedOrder.priceBreakdown.largeItems > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">대형 물품</span>
                          <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.priceBreakdown.largeItems)}</span>
                        </div>
                      )}
                      {selectedOrder.priceBreakdown.fragileHandling > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">깨지기 쉬운 물품 처리</span>
                          <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.priceBreakdown.fragileHandling)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Total Price */}
                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">총 가격</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(selectedOrder.totalPrice || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {(selectedOrder.specialInstructions || selectedOrder.extraOptions?.additionalRequests) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">특별 지시사항</h3>
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-700">
                    {selectedOrder.specialInstructions || selectedOrder.extraOptions?.additionalRequests}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">배송 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                {/* Driver Information */}
                {selectedOrder.driver ? (
                  <div>
                    <div className="text-sm text-gray-600">담당 기사</div>
                    <div className="text-base font-medium text-gray-900">
                      {typeof selectedOrder.driver === 'object' ? selectedOrder.driver.name : selectedOrder.driver}
                    </div>
                    {typeof selectedOrder.driver === 'object' && selectedOrder.driver.phone && (
                      <div className="text-sm text-gray-500">{selectedOrder.driver.phone}</div>
                    )}
                  </div>
                ) : selectedOrder.driverName ? (
                  <div>
                    <div className="text-sm text-gray-600">담당 기사</div>
                    <div className="text-base font-medium text-gray-900">{selectedOrder.driverName}</div>
                    {selectedOrder.driverPhone && (
                      <div className="text-sm text-gray-500">{selectedOrder.driverPhone}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">담당 기사</div>
                    <div className="text-base font-medium text-gray-400">미배정</div>
                  </div>
                )}
                
                {/* Vehicle Information */}
                {selectedOrder.vehicle ? (
                  <div>
                    <div className="text-sm text-gray-600">배정 차량</div>
                    <div className="text-base font-medium text-gray-900">
                      {typeof selectedOrder.vehicle === 'object' ? selectedOrder.vehicle.name : selectedOrder.vehicle}
                    </div>
                    {typeof selectedOrder.vehicle === 'object' && selectedOrder.vehicle.plateNumber && (
                      <div className="text-sm text-gray-500">{selectedOrder.vehicle.plateNumber}</div>
                    )}
                  </div>
                ) : selectedOrder.vehicleName ? (
                  <div>
                    <div className="text-sm text-gray-600">배정 차량</div>
                    <div className="text-base font-medium text-gray-900">{selectedOrder.vehicleName}</div>
                    {selectedOrder.vehiclePlateNumber && (
                      <div className="text-sm text-gray-500">{selectedOrder.vehiclePlateNumber}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">배정 차량</div>
                    <div className="text-base font-medium text-gray-400">미배정</div>
                  </div>
                )}
                
                {/* Service Date */}
                {selectedOrder.serviceDate && (
                  <div>
                    <div className="text-sm text-gray-600">배송일</div>
                    <div className="text-base font-medium text-gray-900">{selectedOrder.serviceDate}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <a
                href={`tel:${selectedOrder.customerPhone}`}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
              >
                고객 연락
              </a>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BusinessOrderHistoryPage;

