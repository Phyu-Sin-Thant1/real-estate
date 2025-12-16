import React, { useState, useEffect } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Table from '../../../components/delivery/Table';
import Modal from '../../../components/delivery/Modal';
import { getOrdersByPartner, updateOrder } from '../../../store/deliveryOrdersStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';

const BusinessDeliveryOrdersPage = () => {
  const { user } = useUnifiedAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');
  const [internalMemo, setInternalMemo] = useState('');
  const [assignedDriver, setAssignedDriver] = useState('');
  const [assignedVehicle, setAssignedVehicle] = useState('');

  // Load orders for this partner
  useEffect(() => {
    if (user?.email) {
      const partnerOrders = getOrdersByPartner(user.email);
      setOrders(partnerOrders);
    }
  }, [user?.email]);

  const tabs = [
    { key: '전체', label: '전체' },
    { key: '신규', label: '신규' },
    { key: '배차 대기', label: '배차 대기' },
    { key: '배차 완료', label: '배차 완료' },
    { key: '배송 중', label: '배송 중' },
    { key: '배송 완료', label: '배송 완료' },
    { key: '취소', label: '취소' }
  ];

  const columns = [
    { key: 'id', label: '주문번호' },
    { key: 'createdAt', label: '접수일시' },
    { key: 'pickupAddress', label: '픽업주소' },
    { key: 'deliveryAddress', label: '배송주소' },
    { key: 'customer', label: '고객명/연락처' },
    { key: 'product', label: '상품' },
    { key: 'paymentStatus', label: '결제상태' },
    { key: 'orderStatus', label: '주문상태' },
    { key: 'actions', label: '작업' }
  ];

  const statusSteps = [
    { key: '신규', label: '신규' },
    { key: '배차 대기', label: '배차대기' },
    { key: '배차 완료', label: '배차완료' },
    { key: '배송 중', label: '배송중' },
    { key: '배송 완료', label: '완료' }
  ];

  const drivers = [
    { id: 1, name: '김운전' },
    { id: 2, name: '이기사' },
    { id: 3, name: '박운전' },
    { id: 4, name: '최기사' },
    { id: 5, name: '정운전' }
  ];

  const vehicles = [
    { id: 1, name: '트럭 1호' },
    { id: 2, name: '트럭 2호' },
    { id: 3, name: '트럭 3호' },
    { id: 4, name: '밴 1호' },
    { id: 5, name: '밴 2호' },
    { id: 6, name: '모터 1호' }
  ];

  // Map store statuses to UI statuses for filtering
  const statusMap = {
    'NEW': '신규',
    'IN_PROGRESS': '배차 대기',
    'COMPLETED': '배송 완료',
    'FAILED': '실패',
    'CANCELLED': '취소',
  };

  const filteredOrders = activeTab === '전체' 
    ? orders 
    : orders.filter(order => {
      const uiStatus = statusMap[order.status] || order.status;
      return uiStatus === activeTab || order.status === activeTab;
    });

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setInternalMemo(order.internalMemo || '');
    setAssignedDriver('');
    setAssignedVehicle('');
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedOrder) {
      // Validation: cannot "배송 시작" unless "배차 완료"
      if (newStatus === '배송 중' && selectedOrder.orderStatus !== '배차 완료') {
        alert('배차 완료 상태 이후에 배송 시작이 가능합니다.');
        return;
      }

      // Update order in store
      updateOrder(selectedOrder.id, { 
        status: newStatus === '신규' ? 'NEW' : 
                newStatus === '배차 대기' ? 'IN_PROGRESS' :
                newStatus === '배송 완료' ? 'COMPLETED' :
                newStatus === '취소' ? 'CANCELLED' : 'IN_PROGRESS',
        internalMemo 
      });

      // Refresh orders
      if (user?.email) {
        const partnerOrders = getOrdersByPartner(user.email);
        setOrders(partnerOrders);
      }
      
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, internalMemo });
    }
  };

  const handleMarkFailed = (orderId) => {
    if (window.confirm('이 주문을 실패로 표시하시겠습니까? 관리자에게 알림이 전송됩니다.')) {
      updateOrder(orderId, { 
        status: 'FAILED',
        flagged: true 
      });
      
      // Refresh orders
      if (user?.email) {
        const partnerOrders = getOrdersByPartner(user.email);
        setOrders(partnerOrders);
      }
    }
  };

  const handleOpenDispute = (orderId) => {
    if (window.confirm('이 주문에 대해 분쟁을 열겠습니까? 관리자에게 알림이 전송됩니다.')) {
      updateOrder(orderId, { 
        disputeStatus: 'OPEN',
        flagged: true 
      });
      
      // Refresh orders
      if (user?.email) {
        const partnerOrders = getOrdersByPartner(user.email);
        setOrders(partnerOrders);
      }
    }
  };

  const handleAssignDriver = () => {
    if (selectedOrder && assignedDriver) {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, internalMemo: `${internalMemo}\n[운전자 할당: ${assignedDriver}]` } 
          : order
      );
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, internalMemo: `${internalMemo}\n[운전자 할당: ${assignedDriver}]` });
      setAssignedDriver('');
    }
  };

  const handleAssignVehicle = () => {
    if (selectedOrder && assignedVehicle) {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, internalMemo: `${internalMemo}\n[차량 할당: ${assignedVehicle}]` } 
          : order
      );
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, internalMemo: `${internalMemo}\n[차량 할당: ${assignedVehicle}]` });
      setAssignedVehicle('');
    }
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'orderStatus':
        return <StatusBadge status={row[columnKey]} type="delivery-order" />;
      case 'customer':
        return (
          <div>
            <div className="font-medium">{row.customerName || 'N/A'}</div>
            <div className="text-gray-500 text-sm">{row.customerPhone || 'N/A'}</div>
          </div>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(row);
              }}
              className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
            >
              상세
            </button>
            {(row.status === 'IN_PROGRESS' || row.status === 'COMPLETED') && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkFailed(row.id);
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                  title="실패로 표시"
                >
                  실패
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDispute(row.id);
                  }}
                  className="text-orange-600 hover:text-orange-800 text-xs"
                  title="분쟁 열기"
                >
                  분쟁
                </button>
              </>
            )}
          </div>
        );
      default:
        return row[columnKey];
    }
  };

  const getCurrentStepIndex = () => {
    if (!selectedOrder) return -1;
    return statusSteps.findIndex(step => step.key === selectedOrder.orderStatus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">배달 주문 관리</h1>
        <p className="text-gray-600 mt-1">배달 주문의 전체 lifecycle을 관리합니다.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-dabang-primary text-dabang-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table 
          columns={columns} 
          data={filteredOrders} 
          onRowClick={handleRowClick}
          renderCell={renderCell}
        />
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title="주문 상세"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">주문 상태</h3>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0"></div>
                
                {statusSteps.map((step, index) => {
                  const isCompleted = getCurrentStepIndex() >= index;
                  const isCurrent = selectedOrder.orderStatus === step.key;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-dabang-primary text-white' 
                          : isCurrent 
                            ? 'bg-white border-2 border-dabang-primary text-dabang-primary'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="mt-2 text-xs text-gray-500">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">주문 정보</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">주문번호</p>
                    <p className="font-medium">{selectedOrder.orderNo || selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">접수일시</p>
                    <p className="font-medium">
                      {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">픽업주소</p>
                    <p className="font-medium">{selectedOrder.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">배송주소</p>
                    <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">고객명</p>
                    <p className="font-medium">{selectedOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium">{selectedOrder.customerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">상품</p>
                    <p className="font-medium">{selectedOrder.product || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">결제상태</p>
                    <p className="font-medium">
                      <StatusBadge status={selectedOrder.paymentStatus} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">주문상태</p>
                    <p className="font-medium">
                      <StatusBadge status={selectedOrder.orderStatus} type="delivery-order" />
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">운송 정보</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">고객 요청사항</p>
                    <p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.notes || '없음'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      내부 메모
                    </label>
                    <textarea
                      value={internalMemo}
                      onChange={(e) => setInternalMemo(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="내부 메모를 입력하세요..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        운전자 할당
                      </label>
                      <select
                        value={assignedDriver}
                        onChange={(e) => setAssignedDriver(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      >
                        <option value="">운전자 선택</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.name}>{driver.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignDriver}
                        className="mt-2 w-full px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                      >
                        할당
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        차량 할당
                      </label>
                      <select
                        value={assignedVehicle}
                        onChange={(e) => setAssignedVehicle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      >
                        <option value="">차량 선택</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignVehicle}
                        className="mt-2 w-full px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                      >
                        할당
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">작업</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange('배차 대기')}
                  disabled={selectedOrder.orderStatus === '배차 대기' || selectedOrder.orderStatus === '배차 완료' || selectedOrder.orderStatus === '배송 중' || selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedOrder.orderStatus === '배차 대기' || selectedOrder.orderStatus === '배차 완료' || selectedOrder.orderStatus === '배송 중' || selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  배차하기
                </button>
                <button
                  onClick={() => handleStatusChange('배차 완료')}
                  disabled={selectedOrder.orderStatus === '배차 완료' || selectedOrder.orderStatus === '배송 중' || selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedOrder.orderStatus === '배차 완료' || selectedOrder.orderStatus === '배송 중' || selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                  }`}
                >
                  배차 완료
                </button>
                <button
                  onClick={() => handleStatusChange('배송 중')}
                  disabled={selectedOrder.orderStatus === '배송 중' || selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedOrder.orderStatus === '배송 중' || selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  배송 시작
                </button>
                <button
                  onClick={() => handleStatusChange('배송 완료')}
                  disabled={selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedOrder.orderStatus === '배송 완료' || selectedOrder.orderStatus === '취소'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  배송 완료
                </button>
                <button
                  onClick={() => handleStatusChange('취소')}
                  disabled={selectedOrder.orderStatus === '취소' || selectedOrder.orderStatus === '배송 완료'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedOrder.orderStatus === '취소' || selectedOrder.orderStatus === '배송 완료'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BusinessDeliveryOrdersPage;