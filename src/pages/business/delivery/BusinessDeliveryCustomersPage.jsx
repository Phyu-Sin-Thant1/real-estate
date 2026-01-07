import React, { useState, useMemo } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Modal from '../../../components/delivery/Modal';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { customers, customerOrders } from '../../../mock/deliveryCustomersData';

const BusinessDeliveryCustomersPage = () => {
  const { user } = useUnifiedAuth();
  // Partner's customers - using mock data
  const [customerList, setCustomerList] = useState(customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('전체');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    tag: '일반',
    memo: ''
  });

  // Summary cards data - calculated from partner's customers
  const summaryCards = useMemo(() => [
    {
      title: '전체 고객 수',
      value: customerList.length,
      change: null
    },
    {
      title: '이번 달 신규 고객',
      value: customerList.filter(c => {
        const created = new Date(c.createdAt || c.lastOrderDate);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      change: null
    },
    {
      title: '블랙리스트 고객 수',
      value: customerList.filter(c => c.tag === '블랙리스트').length,
      change: null
    }
  ], [customerList]);

  // Tag filter options
  const tagFilters = [
    { key: '전체', label: '전체' },
    { key: 'VIP', label: 'VIP' },
    { key: '일반', label: '일반' },
    { key: '블랙리스트', label: '블랙리스트' }
  ];

  // Filter customers based on search and tag filter
  const filteredCustomers = customerList.filter(customer => {
    const matchesSearch = (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.includes(searchTerm)
    );
    
    const matchesTag = tagFilter === '전체' || customer.tag === tagFilter;
    
    return matchesSearch && matchesTag;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  // Handle customer selection for detail view
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  // Handle add new customer
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      detailAddress: '',
      tag: '일반',
      memo: ''
    });
    setIsAddEditModalOpen(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      detailAddress: customer.detailAddress || '',
      tag: customer.tag,
      memo: customer.memo || ''
    });
    setIsAddEditModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tag checkbox change
  const handleTagChange = (tag) => {
    setFormData(prev => ({
      ...prev,
      tag: prev.tag === tag ? '일반' : tag
    }));
  };

  // Save customer (add or edit)
  const handleSaveCustomer = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('고객명, 연락처, 기본 주소는 필수 입력 항목입니다.');
      return;
    }

    if (editingCustomer) {
      // Edit existing customer
      setCustomerList(prev => prev.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...formData }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {
        id: customerList.length > 0 ? Math.max(...customerList.map(c => c.id)) + 1 : 1,
        ...formData,
        totalOrders: 0,
        totalPayment: 0,
        lastOrderDate: new Date().toISOString().split('T')[0]
      };
      setCustomerList(prev => [...prev, newCustomer]);
    }

    setIsAddEditModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      address: '',
      detailAddress: '',
      tag: '일반',
      memo: ''
    });
  };

  // Toggle VIP status
  const toggleVIPStatus = () => {
    if (selectedCustomer) {
      const newTag = selectedCustomer.tag === 'VIP' ? '일반' : 'VIP';
      const updatedCustomer = { ...selectedCustomer, tag: newTag };
      
      setSelectedCustomer(updatedCustomer);
      setCustomerList(prev => 
        prev.map(customer => 
          customer.id === selectedCustomer.id 
            ? updatedCustomer 
            : customer
        )
      );
    }
  };

  // Toggle blacklist status
  const toggleBlacklistStatus = () => {
    if (selectedCustomer) {
      const newTag = selectedCustomer.tag === '블랙리스트' ? '일반' : '블랙리스트';
      const updatedCustomer = { ...selectedCustomer, tag: newTag };
      
      setSelectedCustomer(updatedCustomer);
      setCustomerList(prev => 
        prev.map(customer => 
          customer.id === selectedCustomer.id 
            ? updatedCustomer 
            : customer
        )
      );
    }
  };

  // Table columns
  const columns = [
    { key: 'name', label: '고객명' },
    { key: 'phone', label: '연락처' },
    { key: 'address', label: '기본 주소' },
    { key: 'lastOrderDate', label: '최근 주문일' },
    { key: 'totalOrders', label: '총 주문 수' },
    { key: 'totalPayment', label: '총 결제 금액' },
    { key: 'tag', label: '태그' },
    { key: 'actions', label: '작업' }
  ];

  // Render table cell content
  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'address':
        return (
          <div className="max-w-xs truncate" title={row.address}>
            {row.address}
          </div>
        );
      case 'totalPayment':
        return formatCurrency(row.totalPayment);
      case 'tag':
        return <StatusBadge status={row.tag} type="customer" />;
      case 'actions':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewDetails(row)}
              className="text-dabang-primary hover:text-dabang-primary/80 font-medium text-sm"
            >
              상세
            </button>
            <button
              onClick={() => handleEditCustomer(row)}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              수정
            </button>
          </div>
        );
      default:
        return row[columnKey];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
        <p className="text-gray-600 mt-1">배달 고객 정보를 관리하고 이력을 확인하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            {/* Search Input */}
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
                  placeholder="고객명/연락처/주소 검색"
                />
              </div>
            </div>
            
            {/* Tag Filter */}
            <div className="w-40">
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="focus:ring-dabang-primary focus:border-dabang-primary block w-full py-2 border border-gray-300 rounded-md"
              >
                {tagFilters.map(filter => (
                  <option key={filter.key} value={filter.key}>{filter.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Add Customer Button */}
          <button
            onClick={handleAddCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            신규 고객 등록
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">고객 목록</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                {columns.map(column => (
                  <td
                    key={`${customer.id}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {renderCell(customer, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">고객 데이터가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">검색 조건을 변경하거나 새로운 고객을 등록해보세요.</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="고객 상세"
        size="large"
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
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">기본 주소</p>
                  <p className="font-medium">{selectedCustomer.address}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">상세 주소</p>
                  <p className="font-medium">{selectedCustomer.detailAddress || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">태그</p>
                  <p className="font-medium">
                    <StatusBadge status={selectedCustomer.tag} type="customer" />
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">메모</p>
                  <p className="font-medium">{selectedCustomer.memo || '-'}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">최근 주문 5개</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        주문번호
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        날짜
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(customerOrders[selectedCustomer.id] || []).slice(0, 5).map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <StatusBadge status={order.status} type="delivery-order" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(order.amount)}
                        </td>
                      </tr>
                    ))}
                    {(!customerOrders[selectedCustomer.id] || customerOrders[selectedCustomer.id].length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          주문 내역이 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={toggleVIPStatus}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCustomer.tag === 'VIP'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedCustomer.tag === 'VIP' ? 'VIP 해제' : 'VIP 지정'}
              </button>
              <button
                onClick={toggleBlacklistStatus}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCustomer.tag === '블랙리스트'
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedCustomer.tag === '블랙리스트' ? '블랙리스트 해제' : '블랙리스트 지정'}
              </button>
              <button
                onClick={() => handleEditCustomer(selectedCustomer)}
                className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
              >
                정보 수정
              </button>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingCustomer ? "고객 정보 수정" : "신규 고객 등록"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              고객명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="연락처를 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기본 주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="기본 주소를 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세 주소
            </label>
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="상세 주소를 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              태그
            </label>
            <div className="flex space-x-4 pt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tag === 'VIP'}
                  onChange={() => handleTagChange('VIP')}
                  className="rounded border-gray-300 text-dabang-primary focus:ring-dabang-primary"
                />
                <span className="ml-2">VIP</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tag === '블랙리스트'}
                  onChange={() => handleTagChange('블랙리스트')}
                  className="rounded border-gray-300 text-dabang-primary focus:ring-dabang-primary"
                />
                <span className="ml-2">블랙리스트</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="고객에 대한 메모를 입력하세요"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={handleSaveCustomer}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              {editingCustomer ? '수정' : '등록'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessDeliveryCustomersPage;