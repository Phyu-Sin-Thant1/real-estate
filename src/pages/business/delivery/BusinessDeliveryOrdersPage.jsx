import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../../../components/common/Modal';
import { 
  getAllCustomerOrders, 
  updateCustomerOrderStatus,
  assignDriverAndVehicle,
  createCustomerOrder
} from '../../../store/customerOrdersStore';
import { drivers } from '../../../mock/deliveryDriversData';
import { vehicles } from '../../../mock/deliveryData';

const BusinessDeliveryOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignVehicleModalOpen, setIsAssignVehicleModalOpen] = useState(false);
  const [isSetScheduleModalOpen, setIsSetScheduleModalOpen] = useState(false);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = getAllCustomerOrders();
    // Show orders that are not completed or canceled (pending, confirmed, in_progress)
    const activeOrders = allOrders.filter(order => 
      order.status !== 'completed' && order.status !== 'canceled'
    );
    setOrders(activeOrders);
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'pending_assignment') {
          // Orders without driver or vehicle
          if (order.driver && order.vehicle) return false;
        } else if (statusFilter === 'assigned') {
          // Orders with both driver and vehicle
          if (!order.driver || !order.vehicle) return false;
        } else if (order.status !== statusFilter) {
          return false;
        }
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          (order.orderId || order.id || '').toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          (order.selectedPackage?.name || order.packageName || '').toLowerCase().includes(searchLower) ||
          (order.customerPhone || '').includes(searchTerm)
        );
      }

      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleAssignDriver = (orderId, driverId) => {
    const driver = drivers.find(d => d.id === parseInt(driverId));
    if (!driver) return;

    const driverInfo = {
      name: driver.name,
      phone: driver.phone,
      id: driver.id
    };

    updateCustomerOrderStatus(orderId, selectedOrder?.status || 'confirmed', {
      driver: driverInfo
    });

    loadOrders();
    setIsAssignDriverModalOpen(false);
    setSelectedOrder(null);
  };

  const handleAssignVehicle = (orderId, vehicleId) => {
    const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
    if (!vehicle) return;

    const vehicleInfo = {
      name: vehicle.name,
      plateNumber: vehicle.plateNumber,
      capacity: vehicle.capacity,
      id: vehicle.id
    };

    updateCustomerOrderStatus(orderId, selectedOrder?.status || 'confirmed', {
      vehicle: vehicleInfo
    });

    loadOrders();
    setIsAssignVehicleModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSetSchedule = (orderId, date, time) => {
    updateCustomerOrderStatus(orderId, selectedOrder?.status || 'confirmed', {
      serviceDate: date,
      deliveryTime: time
    });

    loadOrders();
    setIsSetScheduleModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateCustomerOrderStatus(orderId, newStatus);
    loadOrders();
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: '대기 중', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: '확인됨', color: 'bg-blue-100 text-blue-700' },
      in_progress: { label: '진행 중', color: 'bg-purple-100 text-purple-700' },
      completed: { label: '완료됨', color: 'bg-green-100 text-green-700' },
      canceled: { label: '취소됨', color: 'bg-red-100 text-red-700' },
      delayed: { label: '지연됨', color: 'bg-orange-100 text-orange-700' }
    };

    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return `₩${(price || 0).toLocaleString()}`;
  };

  const columns = [
    { key: 'orderId', label: '주문번호' },
    { key: 'customerName', label: '고객명' },
    { key: 'package', label: '패키지' },
    { key: 'status', label: '상태' },
    { key: 'assignedDriver', label: '담당 기사' },
    { key: 'assignedVehicle', label: '배정 차량' },
    { key: 'deliveryDate', label: '배송일시' },
    { key: 'actions', label: '작업' }
  ];

  const renderCell = (order, columnKey) => {
    switch (columnKey) {
      case 'orderId':
        return <span className="font-medium text-gray-900">{order.orderId || order.id}</span>;
      case 'customerName':
        return (
          <div>
            <div className="font-medium text-gray-900">{order.customerName}</div>
            <div className="text-xs text-gray-500">{order.customerPhone}</div>
          </div>
        );
      case 'package':
        return (
          <div>
            <div className="font-medium text-gray-900">
              {order.selectedPackage?.name || order.packageName || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">{formatPrice(order.totalPrice)}</div>
          </div>
        );
      case 'status':
        return getStatusBadge(order.status);
      case 'assignedDriver':
        return order.driver ? (
          <div>
            <div className="font-medium text-gray-900">{order.driver.name}</div>
            {order.driver.phone && (
              <div className="text-xs text-gray-500">{order.driver.phone}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">미배정</span>
        );
      case 'assignedVehicle':
        return order.vehicle ? (
          <div>
            <div className="font-medium text-gray-900">{order.vehicle.name}</div>
            {order.vehicle.plateNumber && (
              <div className="text-xs text-gray-500">{order.vehicle.plateNumber}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">미배정</span>
        );
      case 'deliveryDate':
        return order.serviceDate ? (
          <div>
            <div className="font-medium text-gray-900">{order.serviceDate}</div>
            {order.deliveryTime && (
              <div className="text-xs text-gray-500">{order.deliveryTime}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">미설정</span>
        );
      case 'actions':
        return (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(order);
                setIsDetailModalOpen(true);
              }}
              className="px-3 py-1.5 text-dabang-primary hover:bg-dabang-primary/10 rounded-lg font-semibold text-sm transition-all duration-200"
            >
              상세보기
            </button>
          </div>
        );
      default:
        return order[columnKey] || '-';
    }
  };

  // Get available drivers (not assigned or available)
  const availableDrivers = useMemo(() => {
    return drivers.filter(driver => {
      // Check if driver is already assigned to another active order
      const assignedToOrder = orders.some(order => 
        order.driver?.id === driver.id && 
        order.id !== selectedOrder?.id &&
        order.status !== 'completed' && 
        order.status !== 'canceled'
      );
      return !assignedToOrder && driver.status === '근무';
    });
  }, [orders, selectedOrder]);

  // Get available vehicles (not assigned or available)
  const availableVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Check if vehicle is already assigned to another active order
      const assignedToOrder = orders.some(order => 
        order.vehicle?.id === vehicle.id && 
        order.id !== selectedOrder?.id &&
        order.status !== 'completed' && 
        order.status !== 'canceled'
      );
      return !assignedToOrder && vehicle.status === '활성';
    });
  }, [orders, selectedOrder]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">배달 주문 관리</h1>
          <p className="text-sm text-gray-600 mt-1">기사와 차량을 배정하고 배송 일정을 관리하세요</p>
        </div>
        <button
          onClick={() => setIsCreateOrderModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-dabang-primary/30 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          주문 생성
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">전체 주문</div>
          <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">배정 대기</div>
          <div className="text-3xl font-bold text-yellow-600">
            {orders.filter(o => !o.driver || !o.vehicle).length}
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">배정 완료</div>
          <div className="text-3xl font-bold text-blue-600">
            {orders.filter(o => o.driver && o.vehicle).length}
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
          <div className="text-sm text-gray-600 mb-1">진행 중</div>
          <div className="text-3xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'in_progress').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary bg-white"
            >
              <option value="all">전체 상태</option>
              <option value="pending_assignment">배정 대기</option>
              <option value="assigned">배정 완료</option>
              <option value="pending">대기 중</option>
              <option value="confirmed">확인됨</option>
              <option value="in_progress">진행 중</option>
              <option value="delayed">지연됨</option>
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
            {/* Order Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">주문번호</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.orderId || selectedOrder.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">상태</div>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">주문일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.orderDate || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">서비스일</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.serviceDate || '미설정'}</div>
                </div>
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
                  <div className="text-base font-medium text-gray-900">{selectedOrder.pickupAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">배송 주소</div>
                  <div className="text-base font-medium text-gray-900">{selectedOrder.deliveryAddress}</div>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">패키지 정보</h3>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedOrder.selectedPackage?.name || selectedOrder.packageName || 'N/A'}
                    </div>
                    {selectedOrder.selectedPackage?.description && (
                      <div className="text-sm text-gray-600 mt-1">{selectedOrder.selectedPackage.description}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">총 가격</div>
                    <div className="text-xl font-bold text-blue-600">{formatPrice(selectedOrder.totalPrice)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">배정 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border-2 ${
                  selectedOrder.driver ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="text-sm text-gray-600 mb-2">담당 기사</div>
                  {selectedOrder.driver ? (
                    <div>
                      <div className="text-base font-bold text-gray-900">{selectedOrder.driver.name}</div>
                      {selectedOrder.driver.phone && (
                        <div className="text-sm text-gray-500">{selectedOrder.driver.phone}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-base font-medium text-yellow-700">미배정</div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAssignDriverModalOpen(true);
                    }}
                    className={`mt-3 w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedOrder.driver
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    {selectedOrder.driver ? '기사 변경' : '기사 배정'}
                  </button>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  selectedOrder.vehicle ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="text-sm text-gray-600 mb-2">배정 차량</div>
                  {selectedOrder.vehicle ? (
                    <div>
                      <div className="text-base font-bold text-gray-900">{selectedOrder.vehicle.name}</div>
                      {selectedOrder.vehicle.plateNumber && (
                        <div className="text-sm text-gray-500">{selectedOrder.vehicle.plateNumber}</div>
                      )}
                      {selectedOrder.vehicle.capacity && (
                        <div className="text-xs text-gray-500 mt-1">적재량: {selectedOrder.vehicle.capacity}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-base font-medium text-yellow-700">미배정</div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAssignVehicleModalOpen(true);
                    }}
                    className={`mt-3 w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedOrder.vehicle
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    {selectedOrder.vehicle ? '차량 변경' : '차량 배정'}
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">배송 일정</h3>
              <div className={`p-4 rounded-xl border-2 ${
                selectedOrder.serviceDate ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {selectedOrder.serviceDate ? (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">배송 일시</div>
                    <div className="text-base font-bold text-gray-900">
                      {selectedOrder.serviceDate} {selectedOrder.deliveryTime ? `(${selectedOrder.deliveryTime})` : ''}
                    </div>
                  </div>
                ) : (
                  <div className="text-base font-medium text-gray-600">배송 일정이 설정되지 않았습니다</div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSetScheduleModalOpen(true);
                  }}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all"
                >
                  {selectedOrder.serviceDate ? '일정 변경' : '일정 설정'}
                </button>
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

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                닫기
              </button>
              {selectedOrder.status === 'confirmed' && selectedOrder.driver && selectedOrder.vehicle && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'in_progress')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  배송 시작
                </button>
              )}
              {selectedOrder.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold"
                >
                  배송 완료
                </button>
              )}
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'canceled' && (
                <button
                  onClick={() => {
                    if (window.confirm('이 주문을 취소하시겠습니까?')) {
                      handleStatusUpdate(selectedOrder.id, 'canceled');
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                >
                  주문 취소
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={isAssignDriverModalOpen}
        onClose={() => {
          setIsAssignDriverModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        availableDrivers={availableDrivers}
        currentDriver={selectedOrder?.driver}
        onAssign={handleAssignDriver}
      />

      {/* Assign Vehicle Modal */}
      <AssignVehicleModal
        isOpen={isAssignVehicleModalOpen}
        onClose={() => {
          setIsAssignVehicleModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        availableVehicles={availableVehicles}
        currentVehicle={selectedOrder?.vehicle}
        onAssign={handleAssignVehicle}
      />

      {/* Set Schedule Modal */}
      <SetScheduleModal
        isOpen={isSetScheduleModalOpen}
        onClose={() => {
          setIsSetScheduleModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSetSchedule={handleSetSchedule}
      />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        availableDrivers={availableDrivers}
        availableVehicles={availableVehicles}
        onCreateOrder={(orderData) => {
          createCustomerOrder(orderData);
          loadOrders();
          setIsCreateOrderModalOpen(false);
        }}
      />
    </div>
  );
};

// Assign Driver Modal Component
const AssignDriverModal = ({ isOpen, onClose, order, availableDrivers, currentDriver, onAssign }) => {
  const [selectedDriverId, setSelectedDriverId] = useState('');

  useEffect(() => {
    if (currentDriver?.id) {
      setSelectedDriverId(currentDriver.id.toString());
    }
  }, [currentDriver]);

  const handleAssign = () => {
    if (!selectedDriverId) {
      alert('기사를 선택해주세요.');
      return;
    }
    onAssign(order.id, selectedDriverId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="기사 배정" size="md">
      <div className="space-y-6">
        {order && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">주문 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호:</span>
                <span className="font-medium">{order.orderId || order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">고객명:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">패키지:</span>
                <span className="font-medium">{order.selectedPackage?.name || order.packageName}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">기사 선택 *</label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">기사를 선택하세요</option>
            {availableDrivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.phone}) - {driver.assignedVehicle || '차량 미배정'}
              </option>
            ))}
          </select>
          {availableDrivers.length === 0 && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-900">사용 가능한 기사가 없습니다.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedDriverId}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            기사 배정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Assign Vehicle Modal Component
const AssignVehicleModal = ({ isOpen, onClose, order, availableVehicles, currentVehicle, onAssign }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    if (currentVehicle?.id) {
      setSelectedVehicleId(currentVehicle.id.toString());
    }
  }, [currentVehicle]);

  const handleAssign = () => {
    if (!selectedVehicleId) {
      alert('차량을 선택해주세요.');
      return;
    }
    onAssign(order.id, selectedVehicleId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="차량 배정" size="md">
      <div className="space-y-6">
        {order && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">주문 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호:</span>
                <span className="font-medium">{order.orderId || order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">고객명:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">패키지:</span>
                <span className="font-medium">{order.selectedPackage?.name || order.packageName}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">차량 선택 *</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">차량을 선택하세요</option>
            {availableVehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} ({vehicle.plateNumber}) - {vehicle.capacity} - {vehicle.driverName || '기사 미배정'}
              </option>
            ))}
          </select>
          {availableVehicles.length === 0 && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-900">사용 가능한 차량이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedVehicleId}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            차량 배정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Set Schedule Modal Component
const SetScheduleModal = ({ isOpen, onClose, order, onSetSchedule }) => {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  useEffect(() => {
    if (order?.serviceDate) {
      setDeliveryDate(order.serviceDate);
    } else {
      // Set default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeliveryDate(tomorrow.toISOString().split('T')[0]);
    }
    if (order?.deliveryTime) {
      setDeliveryTime(order.deliveryTime);
    }
  }, [order]);

  const handleSetSchedule = () => {
    if (!deliveryDate) {
      alert('배송 날짜를 선택해주세요.');
      return;
    }
    onSetSchedule(order.id, deliveryDate, deliveryTime);
  };

  const timeSlots = [
    '09:00 - 12:00',
    '12:00 - 15:00',
    '15:00 - 18:00',
    '18:00 - 21:00'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="배송 일정 설정" size="md">
      <div className="space-y-6">
        {order && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">주문 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호:</span>
                <span className="font-medium">{order.orderId || order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">고객명:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송 주소:</span>
                <span className="font-medium text-right">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">배송 날짜 *</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">배송 시간대</label>
          <select
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">시간대 선택 (선택사항)</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleSetSchedule}
            disabled={!deliveryDate}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            일정 설정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Create Order Modal Component
const CreateOrderModal = ({ isOpen, onClose, availableDrivers, availableVehicles, onCreateOrder }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupAddress: '',
    deliveryAddress: '',
    serviceDate: '',
    deliveryTime: '',
    driverId: '',
    vehicleId: '',
    specialInstructions: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.orderId || !formData.customerName || !formData.customerPhone || !formData.pickupAddress || !formData.deliveryAddress) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const selectedDriver = availableDrivers.find(d => d.id === parseInt(formData.driverId));
    const selectedVehicle = availableVehicles.find(v => v.id === parseInt(formData.vehicleId));

    const orderData = {
      orderId: formData.orderId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      serviceDate: formData.serviceDate,
      deliveryTime: formData.deliveryTime,
      driver: selectedDriver ? {
        name: selectedDriver.name,
        phone: selectedDriver.phone,
        id: selectedDriver.id
      } : null,
      vehicle: selectedVehicle ? {
        name: selectedVehicle.name,
        plateNumber: selectedVehicle.plateNumber,
        capacity: selectedVehicle.capacity,
        id: selectedVehicle.id
      } : null,
      specialInstructions: formData.specialInstructions,
      status: formData.driverId && formData.vehicleId ? 'confirmed' : 'pending',
      paymentStatus: 'pending'
    };

    onCreateOrder(orderData);
    
    // Reset form
    setFormData({
      orderId: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      pickupAddress: '',
      deliveryAddress: '',
      serviceDate: '',
      deliveryTime: '',
      driverId: '',
      vehicleId: '',
      specialInstructions: ''
    });
  };

  const timeSlots = [
    '09:00 - 12:00',
    '12:00 - 15:00',
    '15:00 - 18:00',
    '18:00 - 21:00'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 주문 생성" size="large">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order ID */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h3>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">주문번호 *</label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-mono"
              placeholder="order-001"
              required
            />
            <p className="mt-2 text-xs text-gray-500">주문번호를 입력해주세요. (예: order-001, order-002)</p>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">고객명 *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">연락처 *</label>
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="010-1234-5678"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="customer@example.com"
              />
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">배송 정보</h3>
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">픽업 주소 *</label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="서울특별시 강남구 역삼동 123-45"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">배송 주소 *</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="서울특별시 서초구 방배동 67-89"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">배송 날짜</label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">배송 시간대</label>
                <select
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">시간대 선택</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>


        {/* Driver and Vehicle Assignment */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">기사 및 차량 배정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">담당 기사</label>
              <select
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">기사 선택 (선택사항)</option>
                {availableDrivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.phone}) - {driver.assignedVehicle || '차량 미배정'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">배정 차량</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">차량 선택 (선택사항)</option>
                {availableVehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.plateNumber}) - {vehicle.capacity} - {vehicle.driverName || '기사 미배정'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {/* Special Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">특별 지시사항</h3>
          <div className="p-4 bg-gray-50 rounded-xl">
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="특별한 요청사항이나 지시사항을 입력하세요..."
            />
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl"
          >
            주문 생성하기
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BusinessDeliveryOrdersPage;
