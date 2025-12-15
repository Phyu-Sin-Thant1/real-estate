import React, { useState, useEffect } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import FilterChips from '../../../components/delivery/FilterChips';
import Table from '../../../components/delivery/Table';
import Modal from '../../../components/delivery/Modal';
import { movingRequests } from '../../../mock/deliveryData';
import { useDeliveryQuotes } from '../../../context/DeliveryQuotesContext';

const BusinessMovingRequestsPage = () => {
  const { quotes, addQuote } = useDeliveryQuotes();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [notes, setNotes] = useState('');
  const [newRequest, setNewRequest] = useState({
    customerName: '',
    phone: '',
    pickupAddress: '',
    deliveryAddress: '',
    moveType: '',
    desiredDate: '',
    customerMemo: ''
  });

  // Combine quotes from context with mock data
  useEffect(() => {
    setRequests([...quotes, ...movingRequests]);
  }, [quotes]);

  const filters = [
    { key: '전체', label: '전체' },
    { key: '신규', label: '신규' },
    { key: '연락 완료', label: '연락 완료' },
    { key: '견적 발송', label: '견적 발송' },
    { key: '완료', label: '완료' }
  ];

  const columns = [
    { key: 'createdAt', label: '접수일' },
    { key: 'customerName', label: '고객명' },
    { key: 'phone', label: '연락처' },
    { key: 'pickupAddress', label: '출발지' },
    { key: 'deliveryAddress', label: '도착지' },
    { key: 'moveType', label: '이사 유형' },
    { key: 'desiredDate', label: '희망일' },
    { key: 'status', label: '상태' },
    { key: 'actions', label: '작업' }
  ];

  const filteredRequests = activeFilter === '전체' 
    ? requests 
    : requests.filter(request => request.status === activeFilter);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setNotes(request.notes || '');
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedRequest) {
      const updatedRequests = requests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: newStatus, notes } 
          : req
      );
      setRequests(updatedRequests);
      setSelectedRequest({ ...selectedRequest, status: newStatus, notes });
    }
  };

  const handleSaveNotes = () => {
    if (selectedRequest) {
      const updatedRequests = requests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, notes } 
          : req
      );
      setRequests(updatedRequests);
      setSelectedRequest({ ...selectedRequest, notes });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRequest = () => {
    const requestToAdd = {
      ...newRequest,
      id: Date.now(), // Simple ID generation
      status: '신규',
      createdAt: new Date().toISOString().split('T')[0],
      notes: ''
    };
    
    addQuote(requestToAdd);
    setIsAddModalOpen(false);
    setNewRequest({
      customerName: '',
      phone: '',
      pickupAddress: '',
      deliveryAddress: '',
      moveType: '',
      desiredDate: '',
      customerMemo: ''
    });
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row[columnKey]} type="moving-request" />;
      case 'actions':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
            className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
          >
            상세보기
          </button>
        );
      case 'moveType':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row[columnKey]}
          </span>
        );
      default:
        return row[columnKey];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">이사 / 견적 요청</h1>
            <p className="text-gray-600 mt-1">고객의 이사 및 견적 요청을 관리합니다.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
          >
            새 이사/견적 요청
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <FilterChips 
        filters={filters} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table 
          columns={columns} 
          data={filteredRequests} 
          onRowClick={handleRowClick}
          renderCell={renderCell}
        />
      </div>

      {/* Add Request Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="새 이사/견적 요청"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              고객명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={newRequest.customerName}
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
              type="tel"
              name="phone"
              value={newRequest.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="'-' 없이 숫자만 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출발지 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pickupAddress"
              value={newRequest.pickupAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="출발지 주소를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              도착지 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="deliveryAddress"
              value={newRequest.deliveryAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="도착지 주소를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이사 유형 <span className="text-red-500">*</span>
            </label>
            <select
              name="moveType"
              value={newRequest.moveType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="">선택해주세요</option>
              <option value="원룸">원룸</option>
              <option value="가정이사">가정이사</option>
              <option value="사무실이사">사무실이사</option>
              <option value="특수이사">특수이사</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              희망일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="desiredDate"
              value={newRequest.desiredDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요청사항
            </label>
            <textarea
              name="customerMemo"
              value={newRequest.customerMemo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="고객의 요청사항을 입력하세요"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleAddRequest}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
            >
              추가하기
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title="이사 요청 상세"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">요청 정보</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">접수일</p>
                    <p className="font-medium">{selectedRequest.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">고객명</p>
                    <p className="font-medium">{selectedRequest.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">출발지</p>
                    <p className="font-medium">{selectedRequest.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">도착지</p>
                    <p className="font-medium">{selectedRequest.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">이사 유형</p>
                    <p className="font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedRequest.moveType}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">희망일</p>
                    <p className="font-medium">{selectedRequest.desiredDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">상태</p>
                    <p className="font-medium">
                      <StatusBadge status={selectedRequest.status} type="moving-request" />
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">고객 메모</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">고객 요청사항</p>
                  <p className="bg-gray-50 p-3 rounded-lg">{selectedRequest.customerMemo}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내부 메모
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="내부 메모를 입력하세요..."
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                  >
                    메모 저장
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">상태 변경</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange('연락 완료')}
                  disabled={selectedRequest.status === '연락 완료' || selectedRequest.status === '견적 발송' || selectedRequest.status === '완료'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedRequest.status === '연락 완료' || selectedRequest.status === '견적 발송' || selectedRequest.status === '완료'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  연락 완료로 변경
                </button>
                <button
                  onClick={() => handleStatusChange('견적 발송')}
                  disabled={selectedRequest.status === '견적 발송' || selectedRequest.status === '완료'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedRequest.status === '견적 발송' || selectedRequest.status === '완료'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  견적 발송
                </button>
                <button
                  onClick={() => handleStatusChange('완료')}
                  disabled={selectedRequest.status === '완료'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedRequest.status === '완료'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  완료 처리
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BusinessMovingRequestsPage;