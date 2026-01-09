import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getListingsByPartner, seedMockListings, getListingById } from '../../../store/realEstateListingsStore';
import { getCustomersByPartner, seedMockCustomers } from '../../../store/realEstateCustomersStore';
import { addContract, seedMockContracts } from '../../../store/realEstateContractsStore';

const initialForm = {
  // Property & Parties
  listingId: '',
  ownerId: '',
  ownerEmail: '',
  ownerPhone: '',
  buyerTenantId: '',
  buyerTenantRole: 'Buyer', // 'Buyer' or 'Tenant'
  buyerTenantEmail: '',
  buyerTenantPhone: '',
  
  // Contract Dates
  contractDate: '',
  paymentDate: '',
  
  // Contract Terms
  contractType: '매매', // '매매', '전세', '월세'
  deposit: '',
  monthlyRent: '',
  maintenance: '',
  contractStartDate: '',
  contractEndDate: '',
  
  // Documents
  contractFile: null,
  
  // Notes & Meta
  internalMemo: '',
  manager: '',
};

const RealEstateContractCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [listings, setListings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchPropertyTerm, setSearchPropertyTerm] = useState('');
  const [searchOwnerTerm, setSearchOwnerTerm] = useState('');
  const [searchBuyerTerm, setSearchBuyerTerm] = useState('');
  const [showPropertyResults, setShowPropertyResults] = useState(false);
  const [showOwnerResults, setShowOwnerResults] = useState(false);
  const [showBuyerResults, setShowBuyerResults] = useState(false);

  const partnerEmail = user?.email || '';
  const createdBy = user?.name || partnerEmail || 'Partner';

  // Load data
  useEffect(() => {
    seedMockListings();
    seedMockCustomers();
    seedMockContracts();
    if (partnerEmail) {
      const partnerListings = getListingsByPartner(partnerEmail);
      const partnerCustomers = getCustomersByPartner(partnerEmail);
      setListings(partnerListings);
      setCustomers(partnerCustomers);
    }
  }, [partnerEmail]);

  // Get selected listing
  const selectedListing = useMemo(() => {
    return form.listingId ? getListingById(form.listingId) : null;
  }, [form.listingId]);

  // Get owner customers (filter by Owner role)
  const ownerCustomers = useMemo(() => {
    return customers.filter(c => c.role === 'Owner' || c.role === '소유자');
  }, [customers]);

  // Filter listings by search term
  const filteredListings = useMemo(() => {
    if (!searchPropertyTerm) return listings;
    const term = searchPropertyTerm.toLowerCase();
    return listings.filter(listing =>
      listing.title?.toLowerCase().includes(term) ||
      listing.address?.toLowerCase().includes(term) ||
      listing.city?.toLowerCase().includes(term)
    );
  }, [listings, searchPropertyTerm]);

  // Filter owner customers by search term
  const filteredOwners = useMemo(() => {
    if (!searchOwnerTerm) return ownerCustomers;
    const term = searchOwnerTerm.toLowerCase();
    return ownerCustomers.filter(customer =>
      customer.name?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term)
    );
  }, [ownerCustomers, searchOwnerTerm]);

  // Filter buyer/tenant customers by search term
  const filteredBuyers = useMemo(() => {
    if (!searchBuyerTerm) return customers;
    const term = searchBuyerTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term)
    );
  }, [customers, searchBuyerTerm]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectProperty = (listingId) => {
    const listing = getListingById(listingId);
    if (listing) {
      setForm(prev => ({ ...prev, listingId }));
      setSearchPropertyTerm('');
      setShowPropertyResults(false);
    }
  };

  const handleSelectOwner = (customerId) => {
    const customer = ownerCustomers.find(c => c.id === customerId || String(c.id) === String(customerId));
    if (customer) {
      setForm(prev => ({
        ...prev,
        ownerId: customerId,
        ownerEmail: customer.email || '',
        ownerPhone: customer.phone || '',
      }));
      setSearchOwnerTerm('');
      setShowOwnerResults(false);
    }
  };

  const handleSelectBuyerTenant = (customerId) => {
    const customer = customers.find(c => c.id === customerId || String(c.id) === String(customerId));
    if (customer) {
      setForm(prev => ({
        ...prev,
        buyerTenantId: customerId,
        buyerTenantEmail: customer.email || '',
        buyerTenantPhone: customer.phone || '',
      }));
      setSearchBuyerTerm('');
      setShowBuyerResults(false);
    }
  };

  const validate = () => {
    const nextErrors = {};
    
    // Property
    if (!form.listingId) nextErrors.listingId = '매물을 선택해주세요.';
    
    // Owner
    if (!form.ownerId) {
      nextErrors.ownerId = '소유자를 선택해주세요.';
    } else {
      if (!form.ownerEmail && !form.ownerPhone) {
        nextErrors.ownerContact = '소유주 이메일 또는 전화번호 중 하나는 필수입니다.';
      }
    }
    
    // Buyer/Tenant
    if (!form.buyerTenantId) {
      nextErrors.buyerTenantId = '구매자/임차인을 선택해주세요.';
    } else {
      if (!form.buyerTenantEmail && !form.buyerTenantPhone) {
        nextErrors.buyerTenantContact = '구매자/임차인 이메일 또는 전화번호 중 하나는 필수입니다.';
      }
    }
    
    // Contract Date
    if (!form.contractDate) nextErrors.contractDate = '계약 체결일을 입력해주세요.';
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    
    if (!validate()) {
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    const contractId = Date.now();
    const now = new Date().toISOString();

    // Get selected customers
    const owner = ownerCustomers.find(c => c.id === form.ownerId || String(c.id) === String(form.ownerId));
    const buyerTenant = customers.find(c => c.id === form.buyerTenantId || String(c.id) === String(form.buyerTenantId));

    const contract = {
      id: contractId,
      createdAt: now,
      updatedAt: now,
      createdBy,
      partnerEmail,
      partnerId: partnerEmail,
      
      // Property
      listingId: form.listingId,
      listing: selectedListing ? {
        id: selectedListing.id,
        title: selectedListing.title,
        address: selectedListing.address,
        city: selectedListing.city,
        propertyType: selectedListing.propertyType,
        transactionType: selectedListing.transactionType,
      } : null,
      
      // Parties
      ownerId: form.ownerId,
      owner: owner ? {
        id: owner.id,
        name: owner.name,
        phone: form.ownerPhone || owner.phone,
        email: form.ownerEmail || owner.email,
      } : null,
      // Contract-specific contact info (separate from customer master)
      ownerEmail: form.ownerEmail || owner?.email || '',
      ownerPhone: form.ownerPhone || owner?.phone || '',
      
      buyerTenantId: form.buyerTenantId,
      buyerTenant: buyerTenant ? {
        id: buyerTenant.id,
        name: buyerTenant.name,
        phone: form.buyerTenantPhone || buyerTenant.phone,
        email: form.buyerTenantEmail || buyerTenant.email,
        role: form.buyerTenantRole,
      } : null,
      // Contract-specific contact info (separate from customer master)
      buyerTenantEmail: form.buyerTenantEmail || buyerTenant?.email || '',
      buyerTenantPhone: form.buyerTenantPhone || buyerTenant?.phone || '',
      customerId: form.buyerTenantId, // For backward compatibility
      customer: buyerTenant ? {
        id: buyerTenant.id,
        name: buyerTenant.name,
        phone: buyerTenant.phone,
        email: buyerTenant.email,
        type: form.buyerTenantRole === 'Buyer' ? 'Buyer' : 'Tenant',
      } : null,
      
      // Contract Dates
      contractDate: form.contractDate,
      paymentDate: form.paymentDate || null,
      
      // Contract Terms
      type: form.contractType,
      contractType: form.contractType,
      deposit: form.deposit ? parseFloat(form.deposit) : null,
      monthlyRent: form.monthlyRent ? parseFloat(form.monthlyRent) : null,
      maintenance: form.maintenance ? parseFloat(form.maintenance) : null,
      contractStartDate: form.contractStartDate || null,
      contractEndDate: form.contractEndDate || null,
      
      // Documents
      contractFile: form.contractFile ? form.contractFile.name : null,
      hasContract: !!form.contractFile,
      attachments: form.contractFile ? [{
        id: 1,
        name: form.contractFile.name,
        size: `${(form.contractFile.size / 1024 / 1024).toFixed(2)}MB`,
        uploadDate: now.split('T')[0],
        url: '#',
      }] : [],
      
      // Notes & Meta
      notes: form.internalMemo || '',
      internalMemo: form.internalMemo || '',
      manager: form.manager || createdBy,
      
      // Status
      status: 'Pending',
      
      // Payment info (offline)
      paymentHandledOffline: true,
      paymentMethod: null,
    };

    try {
      addContract(contract);
      alert('계약이 생성되었습니다.');
      navigate('/business/real-estate/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('계약 생성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/business/real-estate/contracts');
  };

  const getPropertyTypeLabel = (type) => {
    const typeMap = {
      'apartment': '아파트',
      'house': '주택',
      'office': '오피스텔',
      'studio': '원룸',
      'two-room': '투룸',
      'villa': '빌라',
    };
    return typeMap[type] || type || '—';
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">새 계약 등록</h1>
        <p className="text-sm text-gray-600">계약 정보를 입력하여 새로운 계약을 생성합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section A — Property & Parties */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">A. 매물 및 당사자</h2>
          
          <div className="space-y-8">
            {/* A-1. Property Sub-Card */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/30">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                A-1. 매물 <span className="text-red-500">*</span>
              </h3>
              
              {!selectedListing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="매물 검색 (제목, 주소, 지역)"
                    value={searchPropertyTerm}
                    onChange={(e) => {
                      setSearchPropertyTerm(e.target.value);
                      setShowPropertyResults(true);
                    }}
                    onFocus={() => setShowPropertyResults(true)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary"
                  />
                  
                  {/* Search Results List */}
                  {showPropertyResults && filteredListings.length > 0 && (
                    <div className="border border-gray-200 rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto">
                      {filteredListings.map(listing => (
                        <button
                          key={listing.id}
                          type="button"
                          onClick={() => handleSelectProperty(listing.id)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-semibold text-sm text-gray-900">{listing.title || listing.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{listing.address || listing.city || ''}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getPropertyTypeLabel(listing.propertyType)} · {listing.transactionType || listing.dealType || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {errors.listingId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.listingId}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/60 rounded-2xl border border-blue-200/60 shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">매물명</div>
                      <div className="text-base font-bold text-gray-900 mb-3">{selectedListing.title || selectedListing.name}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">주소</div>
                          <div className="text-sm text-gray-700">{selectedListing.address || selectedListing.city || '—'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">유형</div>
                          <div className="text-sm text-gray-700">{getPropertyTypeLabel(selectedListing.propertyType)}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">거래 유형</div>
                          <div className="text-sm text-gray-700">{selectedListing.transactionType || selectedListing.dealType || '—'}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, listingId: '' }));
                        setSearchPropertyTerm('');
                        setShowPropertyResults(false);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      변경
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* A-2 & A-3. Owner Sub-Card */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/30">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                A-2. 소유주 <span className="text-red-500">*</span>
              </h3>
              
              {!form.ownerId ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="소유자 검색 (이름, 전화번호, 이메일)"
                    value={searchOwnerTerm}
                    onChange={(e) => {
                      setSearchOwnerTerm(e.target.value);
                      setShowOwnerResults(true);
                    }}
                    onFocus={() => setShowOwnerResults(true)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary"
                  />
                  
                  {/* Search Results List */}
                  {showOwnerResults && filteredOwners.length > 0 && (
                    <div className="border border-gray-200 rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto">
                      {filteredOwners.map(customer => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectOwner(customer.id)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-semibold text-sm text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {customer.phone && <span>{customer.phone}</span>}
                            {customer.phone && customer.email && <span> · </span>}
                            {customer.email && <span>{customer.email}</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {customer.ownerType === 'Company' || customer.type === 'Company' ? '법인' : '개인'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {errors.ownerId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.ownerId}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Owner Summary - Matching Property Card Style */}
                  {(() => {
                    const owner = ownerCustomers.find(c => c.id === form.ownerId || String(c.id) === String(form.ownerId));
                    return owner ? (
                      <div className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/60 rounded-2xl border border-blue-200/60 shadow-md">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">이름</div>
                            <div className="text-base font-bold text-gray-900 mb-3">{owner.name}</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">고객 유형</div>
                                <div className="text-sm text-gray-700">
                                  {owner.ownerType === 'Company' || owner.type === 'Company' ? '법인' : '개인'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">이메일</div>
                                <div className="text-sm text-gray-700">{form.ownerEmail || owner.email || '—'}</div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">전화번호</div>
                                <div className="text-sm text-gray-700">{form.ownerPhone || owner.phone || '—'}</div>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                ownerId: '',
                                ownerEmail: '',
                                ownerPhone: '',
                              }));
                              setSearchOwnerTerm('');
                              setShowOwnerResults(false);
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            변경
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })()}
                  
                  {/* A-3. Owner Contact Info (Explicit Fields) */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">A-3. 소유주 연락처 정보</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          소유주 이메일
                        </label>
                        <input
                          type="email"
                          name="ownerEmail"
                          value={form.ownerEmail}
                          onChange={onChange}
                          placeholder="owner@example.com"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          소유주 전화번호
                        </label>
                        <input
                          type="tel"
                          name="ownerPhone"
                          value={form.ownerPhone}
                          onChange={onChange}
                          placeholder="010-1234-5678"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      계약서에 사용될 소유주 연락처 정보입니다. 고객 정보와 다를 수 있습니다.
                    </p>
                    {errors.ownerContact && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.ownerContact}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* A-4, A-5 & A-6. Buyer/Tenant Sub-Card */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/30">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                A-4. {form.buyerTenantRole === 'Buyer' ? '구매자' : '임차인'} <span className="text-red-500">*</span>
              </h3>
              
              <div className="space-y-4">
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">역할 선택</label>
                  <select
                    name="buyerTenantRole"
                    value={form.buyerTenantRole}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  >
                    <option value="Buyer">구매자</option>
                    <option value="Tenant">임차인</option>
                  </select>
                </div>
                
                {/* A-5. Buyer/Tenant Selector */}
                {!form.buyerTenantId ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="고객 검색 (이름, 전화번호, 이메일)"
                      value={searchBuyerTerm}
                      onChange={(e) => {
                        setSearchBuyerTerm(e.target.value);
                        setShowBuyerResults(true);
                      }}
                      onFocus={() => setShowBuyerResults(true)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary"
                    />
                    
                    {/* Search Results List */}
                    {showBuyerResults && filteredBuyers.length > 0 && (
                      <div className="border border-gray-200 rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto">
                        {filteredBuyers.map(customer => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => handleSelectBuyerTenant(customer.id)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-semibold text-sm text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {customer.phone && <span>{customer.phone}</span>}
                              {customer.phone && customer.email && <span> · </span>}
                              {customer.email && <span>{customer.email}</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {customer.role === 'Buyer' ? '구매자' : customer.role === 'Tenant' ? '임차인' : customer.role || '고객'}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {errors.buyerTenantId && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.buyerTenantId}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected Buyer/Tenant Summary - Matching Property Card Style */}
                    {(() => {
                      const buyerTenant = customers.find(c => c.id === form.buyerTenantId || String(c.id) === String(form.buyerTenantId));
                      return buyerTenant ? (
                        <div className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/60 rounded-2xl border border-blue-200/60 shadow-md">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">이름</div>
                              <div className="text-base font-bold text-gray-900 mb-3">{buyerTenant.name}</div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">역할</div>
                                  <div className="text-sm text-gray-700">
                                    {form.buyerTenantRole === 'Buyer' ? '구매자' : '임차인'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">이메일</div>
                                  <div className="text-sm text-gray-700">{form.buyerTenantEmail || buyerTenant.email || '—'}</div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">전화번호</div>
                                  <div className="text-sm text-gray-700">{form.buyerTenantPhone || buyerTenant.phone || '—'}</div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setForm(prev => ({
                                  ...prev,
                                  buyerTenantId: '',
                                  buyerTenantEmail: '',
                                  buyerTenantPhone: '',
                                }));
                                setSearchBuyerTerm('');
                                setShowBuyerResults(false);
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              변경
                            </button>
                          </div>
                        </div>
                      ) : null;
                    })()}
                    
                    {/* A-6. Buyer/Tenant Contact Info (Explicit Fields) */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">A-6. {form.buyerTenantRole === 'Buyer' ? '구매자' : '임차인'} 연락처 정보</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            이메일
                          </label>
                          <input
                            type="email"
                            name="buyerTenantEmail"
                            value={form.buyerTenantEmail}
                            onChange={onChange}
                            placeholder="customer@example.com"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            전화번호
                          </label>
                          <input
                            type="tel"
                            name="buyerTenantPhone"
                            value={form.buyerTenantPhone}
                            onChange={onChange}
                            placeholder="010-1234-5678"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        계약 시점의 연락처 정보를 기록합니다.
                      </p>
                      {errors.buyerTenantContact && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.buyerTenantContact}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section B — Contract Dates */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">B. 계약 일자</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract Creation Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                계약 체결일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="contractDate"
                value={form.contractDate}
                onChange={onChange}
                className={`w-full border ${errors.contractDate ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              />
              <p className="mt-2 text-xs text-gray-500">계약이 실제로 체결된 날짜입니다.</p>
              {errors.contractDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.contractDate}
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                결제일 <span className="text-gray-500 text-xs">(선택)</span>
              </label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
              <p className="mt-2 text-xs text-gray-500">결제는 오프라인에서 진행되며, 날짜만 기록합니다.</p>
            </div>
          </div>
        </div>

        {/* Section C — Contract Terms */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">C. 계약 조건</h2>
          
          <div className="space-y-6">
            {/* Contract Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                계약 유형
              </label>
              <select
                name="contractType"
                value={form.contractType}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                <option value="매매">매매</option>
                <option value="전세">전세</option>
                <option value="월세">월세</option>
              </select>
            </div>

            {/* Financial Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {form.contractType !== '매매' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    보증금 <span className="text-gray-500 text-xs">(선택)</span>
                  </label>
                  <input
                    type="number"
                    name="deposit"
                    value={form.deposit}
                    onChange={onChange}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  />
                </div>
              )}
              {form.contractType === '월세' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    월세 <span className="text-gray-500 text-xs">(선택)</span>
                  </label>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={form.monthlyRent}
                    onChange={onChange}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  관리비 <span className="text-gray-500 text-xs">(선택)</span>
                </label>
                <input
                  type="number"
                  name="maintenance"
                  value={form.maintenance}
                  onChange={onChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                />
              </div>
            </div>

            {/* Contract Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  계약 시작일 <span className="text-gray-500 text-xs">(선택)</span>
                </label>
                <input
                  type="date"
                  name="contractStartDate"
                  value={form.contractStartDate}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  계약 종료일 <span className="text-gray-500 text-xs">(선택)</span>
                </label>
                <input
                  type="date"
                  name="contractEndDate"
                  value={form.contractEndDate}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                />
              </div>
            </div>

            {/* Offline Payment Notice */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
              <p className="text-xs font-medium text-amber-900">
                💡 결제 및 입금 처리는 시스템 외부에서 진행됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Section D — Documents */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">D. 계약서</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                계약서 파일 <span className="text-gray-500 text-xs">(선택)</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG (최대 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setForm(prev => ({ ...prev, contractFile: e.target.files[0] }))}
                    />
                  </label>
                </div>
                {form.contractFile && (
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-700">첨부됨</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">{form.contractFile.name}</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">계약서는 나중에 첨부해도 됩니다.</p>
            </div>
          </div>
        </div>

        {/* Section E — Notes & Meta */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-8 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">E. 메모 및 메타 정보</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                내부 메모 <span className="text-gray-500 text-xs">(선택)</span>
              </label>
              <textarea
                name="internalMemo"
                value={form.internalMemo}
                onChange={onChange}
                rows={4}
                placeholder="파트너 전용 메모를 입력하세요..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                담당자
              </label>
              <input
                type="text"
                name="manager"
                value={form.manager || createdBy}
                onChange={onChange}
                placeholder={createdBy}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 left-64 right-0 bg-white border-t border-gray-200/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 shadow-sm hover:shadow-md"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-dabang-primary to-indigo-600 rounded-xl hover:from-dabang-primary/90 hover:to-indigo-600/90 transition-all duration-200 shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-dabang-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '생성 중...' : '계약 생성'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RealEstateContractCreatePage;
