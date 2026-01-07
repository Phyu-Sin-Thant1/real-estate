import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../../../components/common/Modal';
import { 
  getAllCustomerOrders, 
  getCustomerOrderById,
  updateCustomerOrderStatus,
  completeCustomerOrder,
  cancelCustomerOrder
} from '../../../store/customerOrdersStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';

const BusinessCustomerOrdersPage = () => {
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
    const allOrders = getAllCustomerOrders();
    setOrders(allOrders);
  };

  // Get unique packages for filter
  const uniquePackages = useMemo(() => {
    const packages = orders.map(order => order.selectedPackage.name);
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
      if (packageFilter !== 'all' && order.selectedPackage.name !== packageFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.orderId.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.selectedPackage.name.toLowerCase().includes(searchLower) ||
          order.customerPhone.includes(searchTerm)
        );
      }

      // Date range filter
      if (dateRangeFilter !== 'all') {
        const orderDate = new Date(order.orderDate);
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      if (newStatus === 'completed') {
        await completeCustomerOrder(orderId);
      } else if (newStatus === 'canceled') {
        const reason = prompt('취소 사유를 입력하세요:');
        if (reason) {
          await cancelCustomerOrder(orderId, reason);
        } else {
          return;
        }
      } else {
        await updateCustomerOrderStatus(orderId, newStatus);
      }
      loadOrders();
      setIsDetailModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('주문 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: '대기 중', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: '확인됨', color: 'bg-blue-100 text-blue-700' },
      in_progress: { label: '진행 중', color: 'bg-purple-100 text-purple-700' },
      completed: { label: '완료됨', color: 'bg-green-100 text-green-700' },
      canceled: { label: '취소됨', color: 'bg-red-100 text-red-700' }
    };

    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusMap = {
      paid: { label: '결제 완료', color: 'bg-green-100 text-green-700' },
      pending: { label: '결제 대기', color: 'bg-yellow-100 text-yellow-700' },
      refunded: { label: '환불됨', color: 'bg-red-100 text-red-700' }
    };

    const statusInfo = statusMap[paymentStatus] || { label: paymentStatus, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return `₩${price.toLocaleString()}`;
  };

  const columns = [
    { key: 'orderId', label: '주문번호' },
    { key: 'customerName', label: '고객명' },
    { key: 'selectedPackage', label: '선택한 패키지' },
    { key: 'packagePrice', label: '패키지 가격' },
    { key: 'totalPrice', label: '총 가격' },
    { key: 'orderDate', label: '주문일' },
    { key: 'serviceDate', label: '서비스일' },
    { key: 'status', label: '상태' },
    { key: 'paymentStatus', label: '결제 상태' },
    { key: 'actions', label: '작업' }
  ];

  const renderCell = (order, columnKey) => {
    switch (columnKey) {
      case 'selectedPackage':
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{order.selectedPackage.name}</span>
            <span className="text-xs text-gray-500">{order.selectedPackage.category}</span>
          </div>
        );
      case 'packagePrice':
        return <span className="font-semibold text-gray-900">{formatPrice(order.packagePrice)}</span>;
      case 'totalPrice':
        return (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{formatPrice(order.totalPrice)}</span>
            {order.additionalCosts > 0 && (
              <span className="text-xs text-gray-500">+{formatPrice(order.additionalCosts)} 추가</span>
            )}
          </div>
        );
      case 'status':
        return getStatusBadge(order.status);
      case 'paymentStatus':
        return getPaymentStatusBadge(order.paymentStatus);
      case 'actions':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(order);
            }}
            className="px-3 py-1.5 text-dabang-primary hover:bg-dabang-primary/10 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            상세보기
          </button>
        );
      default:
        return order[columnKey] || '-';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 주문 관리</h1>
          <p className="text-sm text-gray-600 mt-1">고객이 구매한 패키지와 주문 내역을 관리하세요</p>
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
              <option value="pending">대기 중</option>
              <option value="confirmed">확인됨</option>
              <option value="in_progress">진행 중</option>
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
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    주문 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order)}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 cursor-pointer"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${order.id}-${column.key}`}
                        className="px-6 py-4 text-sm text-gray-700 font-medium"
                      >
                        {renderCell(order, column.key)}
                      </td>
                    ))}
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
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        title="주문 상세 정보"
        size="large"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Information */}
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
                  <div className="text-base font-medium text-gray-900">{selectedOrder.customerEmail}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">주문번호</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.orderId}</div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주소 정보</h3>
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1">픽업 주소</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.pickupAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">배송 주소</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.deliveryAddress}</div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">패키지 정보</h3>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{selectedOrder.selectedPackage.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedOrder.selectedPackage.description}</div>
                    <div className="text-sm text-gray-600">{selectedOrder.selectedPackage.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">기본 가격</div>
                    <div className="text-xl font-bold text-blue-600">{formatPrice(selectedOrder.packagePrice)}</div>
                  </div>
                </div>

                {/* Add-ons */}
                {selectedOrder.addOns && selectedOrder.addOns.length > 0 && (
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

                {/* Total Price */}
                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">총 가격</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(selectedOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 상세</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">주문일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.orderDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">서비스일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.serviceDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">상태</div>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">결제 상태</div>
                  <div className="mt-1">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrder.specialInstructions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">특별 지시사항</h3>
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-700">{selectedOrder.specialInstructions}</p>
                </div>
              </div>
            )}

            {/* Driver & Vehicle Assignment */}
            {selectedOrder.driver && selectedOrder.vehicle && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배차 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <div className="text-sm text-gray-600">담당 기사</div>
                    <div className="text-base font-medium text-gray-900">{selectedOrder.driver.name}</div>
                    <div className="text-sm text-gray-500">{selectedOrder.driver.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">배정 차량</div>
                    <div className="text-base font-medium text-gray-900">{selectedOrder.vehicle.name}</div>
                    <div className="text-sm text-gray-500">{selectedOrder.vehicle.plateNumber}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {selectedOrder.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
                  >
                    확인하기
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'canceled')}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                  >
                    취소하기
                  </button>
                </>
              )}
              {selectedOrder.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'in_progress')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  진행 시작
                </button>
              )}
              {selectedOrder.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold"
                >
                  완료 처리
                </button>
              )}
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

export default BusinessCustomerOrdersPage;


