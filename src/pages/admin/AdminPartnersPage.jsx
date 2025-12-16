import React, { useState, useEffect } from 'react';
import { getBusinessAccounts, updateBusinessAccount } from '../../store/businessAccountsStore';

const AdminPartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  useEffect(() => {
    setPartners(getBusinessAccounts());
  }, []);

  const tabs = [
    { key: 'ALL', label: 'All Partners' },
    { key: 'BUSINESS_REAL_ESTATE', label: 'Real Estate' },
    { key: 'BUSINESS_DELIVERY', label: 'Delivery' },
    { key: 'SUSPENDED', label: 'Suspended' }
  ];

  const filteredPartners = partners.filter(partner => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'SUSPENDED') return partner.status === 'SUSPENDED';
    return partner.role === activeTab;
  });

  const handleSelectPartner = (partnerId) => {
    setSelectedPartners(prev => 
      prev.includes(partnerId) 
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPartners.length === filteredPartners.length) {
      setSelectedPartners([]);
    } else {
      setSelectedPartners(filteredPartners.map(p => p.email));
    }
  };

  const handleSuspend = (email) => {
    if (window.confirm('이 파트너를 정지하시겠습니까? 로그인이 차단됩니다.')) {
      updateBusinessAccount(email, { status: 'SUSPENDED' });
      setPartners(getBusinessAccounts());
      if (selectedPartner?.email === email) {
        setSelectedPartner(getBusinessAccounts().find(p => p.email === email));
      }
    }
  };

  const handleReactivate = (email) => {
    if (window.confirm('이 파트너를 재활성화하시겠습니까?')) {
      updateBusinessAccount(email, { status: 'ACTIVE' });
      setPartners(getBusinessAccounts());
      if (selectedPartner?.email === email) {
        setSelectedPartner(getBusinessAccounts().find(p => p.email === email));
      }
    }
  };

  const handleRowClick = (partner) => {
    setSelectedPartner(partner);
    setShowDetailDrawer(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'BUSINESS_REAL_ESTATE': return 'bg-blue-100 text-blue-800';
      case 'BUSINESS_DELIVERY': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'BUSINESS_REAL_ESTATE': return 'Real Estate';
      case 'BUSINESS_DELIVERY': return 'Delivery';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partners Management</h1>
        <p className="text-gray-600 mt-1">Manage real estate and delivery partners</p>
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

      {/* Partners Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPartners.length === filteredPartners.length && filteredPartners.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No partners found
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr 
                    key={partner.email} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(partner)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedPartners.includes(partner.email)}
                        onChange={() => handleSelectPartner(partner.email)}
                        className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{partner.companyName || partner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{partner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(partner.role)}`}>
                        {getRoleLabel(partner.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(partner.status)}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end space-x-2">
                        {partner.status === 'ACTIVE' ? (
                          <button 
                            onClick={() => handleSuspend(partner.email)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReactivate(partner.email)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {showDetailDrawer && selectedPartner && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-xl border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Partner Details</h2>
                <button
                  onClick={() => {
                    setShowDetailDrawer(false);
                    setSelectedPartner(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm font-medium text-gray-900">{selectedPartner.companyName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{selectedPartner.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-medium text-gray-900">{getRoleLabel(selectedPartner.role)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedPartner.status)}`}>
                  {selectedPartner.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPartner.createdAt ? new Date(selectedPartner.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                {selectedPartner.status === 'ACTIVE' ? (
                  <button
                    onClick={() => {
                      handleSuspend(selectedPartner.email);
                      setShowDetailDrawer(false);
                    }}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    Suspend Partner
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleReactivate(selectedPartner.email);
                      setShowDetailDrawer(false);
                    }}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Reactivate Partner
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

export default AdminPartnersPage;
