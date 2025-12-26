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
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-dabang-primary/10 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-dabang-primary/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
          Partners Management
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Manage real estate and delivery partners</p>
      </div>

      {/* Premium Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-1">
        <nav className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg shadow-dabang-primary/30'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Premium Partners Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPartners.length === filteredPartners.length && filteredPartners.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary focus:ring-2"
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
                    className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 cursor-pointer transition-all duration-200 border-b border-gray-100"
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
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${getRoleClass(partner.role)}`}>
                        {getRoleLabel(partner.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${getStatusClass(partner.status)}`}>
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
                            className="px-3 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReactivate(partner.email)}
                            className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors shadow-sm hover:shadow-md"
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

      {/* Premium Detail Drawer */}
      {showDetailDrawer && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-gray-200/50 flex flex-col">
            <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-dabang-primary/5 to-indigo-50/30">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">Partner Details</h2>
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

            <div className="p-6 border-t border-gray-200/60 bg-gradient-to-b from-gray-50/50 to-white">
              <div className="flex space-x-3">
                {selectedPartner.status === 'ACTIVE' ? (
                  <button
                    onClick={() => {
                      handleSuspend(selectedPartner.email);
                      setShowDetailDrawer(false);
                    }}
                    className="flex-1 px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Suspend Partner
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleReactivate(selectedPartner.email);
                      setShowDetailDrawer(false);
                    }}
                    className="flex-1 px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
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
