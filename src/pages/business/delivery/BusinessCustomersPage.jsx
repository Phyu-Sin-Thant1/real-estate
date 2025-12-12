import React, { useState } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Table from '../../../components/delivery/Table';
import Modal from '../../../components/delivery/Modal';
import { customers, movingRequests, deliveryOrders } from '../../../mock/deliveryData';

const BusinessCustomersPage = () => {
  const [customerList, setCustomerList] = useState(customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    memo: ''
  });

  const columns = [
    { key: 'name', label: '고객명' },
    { key: 'phone', label: '연락처' },
    { key: 'lastRequestDate', label: '최근 요청일' },
    { key: 'requestType', label: '요청 유형' },
    { key: 'status', label: '상태' },
    { key: 'memo', label: '메모' }
  ];

  const requestColumns = [
    { key: 'id', label: '요청번호' },
    { key: 'createdAt', label: '요청일' },
    { key: 'type', label: '유형' },
    { key: 'address', label: '주소' },
    { key: 'status', label: '상태' }
  ];

  const filteredCustomers = customerList.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer = {
        id: customerList.length + 1,
        ...newCustomer,
        lastRequestDate: new Date().toISOString().split('T')[0],
        requestType: '이사/배달',
        status: '활성'
      };
      setCustomerList([...customerList, customer]);
      setNewCustomer({ name: '', phone: '', memo: '' });
      setIsAddModalOpen(false);
    }
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row[columnKey]} type="customer" />;
      case 'memo':
        return (
          <div className="max-w-xs truncate" title={row[columnKey]}>
            {row[columnKey]}
          </div>
        );
      default:
        return row[columnKey];
    }
  };

  const renderRequestCell = (row, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row[columnKey]} type={row.type === '이사' ? 'moving-request' : 'delivery-order'} />;
      case 'address':
        return (
          <div className="max-w-xs truncate" title={row.pickupAddress}>
            {row.pickupAddress}
          </div>
        );
      default:
        return row[columnKey];
    }
  };

  // Get customer requests (both moving and delivery)
  const getCustomerRequests = (customerId) => {
    // In a real app, we would filter by customerId
    // For now, we'll just return a combination of sample requests
    const movingReqs = movingRequests.slice(0, 3).map(req => ({
      ...req,
      id: `M-${req.id}`,
      type: '이사',
      address: req.pickupAddress
    }));
    
    const deliveryReqs = deliveryOrders.slice(0, 3).map(order => ({
      ...order,
      id: order.id,
      type: '배달',
      address: order.pickupAddress
    }));
    
    return [...movingReqs, ...deliveryReqs];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
        <p className="text-gray-600 mt-1">고객 정보를 관리하고 요청 내역을 확인합니다.</p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-dabang-primary focus:border-dabang-primary block w-full pl-10 py-2 border border-gray-300 rounded-md"
              placeholder="고객명 또는 연락처 검색"
            />
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          신규 고객 등록
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table 
          columns={columns} 
          data={filteredCustomers} 
          onRowClick={handleRowClick}
          renderCell={renderCell}
        />
      </div>

      {/* Customer Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title="고객 상세"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Profile */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">고객 프로필</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">고객명</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">연락처</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">최근 요청일</p>
                  <p className="font-medium">{selectedCustomer.lastRequestDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">요청 유형</p>
                  <p className="font-medium">{selectedCustomer.requestType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <p className="font-medium">
                    <StatusBadge status={selectedCustomer.status} type="customer" />
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">메모</p>
                  <p className="font-medium">{selectedCustomer.memo}</p>
                </div>
              </div>
            </div>

            {/* Customer Requests */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">요청 내역</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table 
                  columns={requestColumns} 
                  data={getCustomerRequests(selectedCustomer.id)} 
                  renderCell={renderRequestCell}
                />
              </div>
            </div>

            {/* Add Memo */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">메모 추가</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="메모를 입력하세요..."
                />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium">
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Customer Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="신규 고객 등록"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              고객명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="고객명을 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="연락처를 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <textarea
              value={newCustomer.memo}
              onChange={(e) => setNewCustomer({...newCustomer, memo: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="고객에 대한 메모를 입력하세요"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={handleAddCustomer}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              등록
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessCustomersPage;