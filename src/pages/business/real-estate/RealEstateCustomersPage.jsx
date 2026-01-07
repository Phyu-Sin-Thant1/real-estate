import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getCustomersByPartner, seedMockCustomers, addCustomer } from '../../../store/realEstateCustomersStore';
import { getContractsByPartner, seedMockContracts } from '../../../store/realEstateContractsStore';
import { getListingsByPartner, seedMockListings } from '../../../store/realEstateListingsStore';
import StatusBadge from '../../../components/real-estate/StatusBadge';

const RealEstateCustomersPage = () => {
  const { user } = useUnifiedAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Buyer',
    memo: ''
  });
  const [partnerCustomers, setPartnerCustomers] = useState([]);
  const [partnerContracts, setPartnerContracts] = useState([]);
  const [partnerListings, setPartnerListings] = useState([]);

  // Load partner's data from stores
  useEffect(() => {
    seedMockCustomers();
    seedMockContracts();
    seedMockListings();
    if (user?.email) {
      const customers = getCustomersByPartner(user.email);
      const contracts = getContractsByPartner(user.email);
      const listings = getListingsByPartner(user.email);
      setPartnerCustomers(customers);
      setPartnerContracts(contracts);
      setPartnerListings(listings);
    }
  }, [user?.email]);

  // Get customer stats (linked contracts and properties)
  const getCustomerStats = (customerId) => {
    const contracts = partnerContracts.filter(c => c.customerId === customerId);
    const listings = partnerListings.filter(l => 
      contracts.some(c => c.listingId === l.id)
    );
    return {
      contractCount: contracts.length,
      propertyCount: listings.length,
      contracts,
      listings
    };
  };

  // Get customer contact status
  const getContactStatus = (customer) => {
    const stats = getCustomerStats(customer.id);
    if (stats.contractCount > 0) {
      const hasCompletedContract = stats.contracts.some(c => 
        c.status === 'Completed' || c.status === '완료'
      );
      return hasCompletedContract ? 'Contract Signed' : 'In Discussion';
    }
    return 'New';
  };

  // Get role label
  const getRoleLabel = (role) => {
    const roleMap = {
      'Buyer': '구매자',
      'Tenant': '임차인',
      'Owner': '소유자',
      'Renter': '임차인',
      'Seller': '매도인'
    };
    return roleMap[role] || role || '고객';
  };

  // Handle customer detail view
  const handleViewCustomerDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    return partnerCustomers.filter(customer => 
      customer.name?.includes(searchTerm) || 
      customer.phone?.includes(searchTerm)
    );
  }, [partnerCustomers, searchTerm]);

  // Customer registration handlers
  const handleOpenRegistrationModal = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
    // Reset form
    setCustomerForm({
      name: '',
      phone: '',
      email: '',
      role: 'Buyer',
      memo: ''
    });
  };

  const handleCustomerFormChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!customerForm.name || !customerForm.phone) {
      alert('이름과 연락처는 필수 입력 항목입니다.');
      return;
    }
    
    // Create customer data
    const customerData = {
      id: Date.now(), // Simple ID generation for demo
      ...customerForm,
      role: customerForm.role || 'Buyer',
      lastActivity: new Date().toISOString().split('T')[0],
      totalContracts: 0,
      partnerEmail: user?.email,
      createdBy: user?.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to store
    addCustomer(customerData);
    
    // Refresh customer list
    if (user?.email) {
      const customers = getCustomersByPartner(user.email);
      setPartnerCustomers(customers);
    }
    
    // Show success message
    alert('새 고객이 등록되었습니다.');
    
    // Close modal
    handleCloseRegistrationModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
        </div>
        <button
          onClick={handleOpenRegistrationModal}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
        >
          새 고객 등록
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700 mb-1">
              고객 검색
            </label>
            <input
              type="text"
              id="customer-search"
              placeholder="고객명 또는 연락처로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락 상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연결된 매물
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약 수
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 활동
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">고객 데이터가 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500">새로운 고객을 등록해보세요.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const stats = getCustomerStats(customer.id);
                  const contactStatus = getContactStatus(customer);
                  
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewCustomerDetail(customer)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-dabang-primary to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                            {customer.name?.[0] || '?'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            {customer.email && (
                              <div className="text-xs text-gray-500">{customer.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getRoleLabel(customer.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={contactStatus} type="customer" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stats.propertyCount}</span>
                          <span className="text-gray-500">개</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stats.contractCount}</span>
                          <span className="text-gray-500">개</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastActivity || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomerDetail(customer);
                          }}
                          className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Registration Modal */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">새 고객 등록</h3>
                <button 
                  onClick={handleCloseRegistrationModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCustomerSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerForm.name}
                      onChange={handleCustomerFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={customerForm.phone}
                      onChange={handleCustomerFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="연락처를 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      역할
                    </label>
                    <select
                      name="role"
                      value={customerForm.role}
                      onChange={handleCustomerFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    >
                      <option value="Buyer">구매자</option>
                      <option value="Tenant">임차인</option>
                      <option value="Owner">소유자</option>
                      <option value="Seller">매도인</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerForm.email}
                      onChange={handleCustomerFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="이메일을 입력하세요 (선택)"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모
                    </label>
                    <textarea
                      name="memo"
                      value={customerForm.memo}
                      onChange={handleCustomerFormChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="고객에 대한 메모를 입력하세요"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseRegistrationModal}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
                  >
                    등록하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {isDetailModalOpen && selectedCustomer && (() => {
        const stats = getCustomerStats(selectedCustomer.id);
        const contactStatus = getContactStatus(selectedCustomer);
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={contactStatus} type="customer" />
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getRoleLabel(selectedCustomer.role)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedCustomer(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">연락처 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">전화:</span>
                        <span className="ml-2 text-gray-900">{selectedCustomer.phone}</span>
                      </div>
                      {selectedCustomer.email && (
                        <div>
                          <span className="text-gray-600">이메일:</span>
                          <span className="ml-2 text-gray-900">{selectedCustomer.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">최근 활동:</span>
                        <span className="ml-2 text-gray-900">{selectedCustomer.lastActivity || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">통계</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.propertyCount}</div>
                        <div className="text-xs text-gray-600">연결된 매물</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.contractCount}</div>
                        <div className="text-xs text-gray-600">총 계약 수</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Properties */}
                {stats.listings.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">연결된 매물</h4>
                    <div className="space-y-2">
                      {stats.listings.map((listing) => (
                        <div
                          key={listing.id}
                          onClick={() => navigate(`/business/real-estate/listings/${listing.id}`)}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-dabang-primary hover:shadow-sm cursor-pointer transition-all"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{listing.title}</div>
                            <div className="text-xs text-gray-500">{listing.address}</div>
                          </div>
                          <StatusBadge status={listing.status} type="property" size="small" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Contracts */}
                {stats.contracts.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">계약 내역</h4>
                    <div className="space-y-2">
                      {stats.contracts.map((contract) => (
                        <div
                          key={contract.id}
                          onClick={() => navigate(`/business/real-estate/contracts/${contract.id}`)}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-dabang-primary hover:shadow-sm cursor-pointer transition-all"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{contract.listing?.title || '매물'}</div>
                            <div className="text-xs text-gray-500">{contract.type} · {contract.contractDate}</div>
                          </div>
                          <StatusBadge status={contract.status} type="contract" size="small" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Notes */}
                {selectedCustomer.memo && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">내부 메모</h4>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                      {selectedCustomer.memo}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedCustomer(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    닫기
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/business/real-estate/contracts/new?customerId=${selectedCustomer.id}`);
                    }}
                    className="px-4 py-2 bg-dabang-primary text-white text-sm font-medium rounded-lg hover:bg-dabang-primary/90"
                  >
                    새 계약 생성
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default RealEstateCustomersPage;