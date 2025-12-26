import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { getPromotionRequests, createPromotionRequest } from '../../store/promotionRequestsStore';
import { getPromotionSlots } from '../../store/promotionSlotsStore';
import PromotionDrawer from '../../components/promotions/PromotionDrawer';

const AdminPromotionsPage = () => {
  const { t } = useI18n();
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [slots, setSlots] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setRequests(getPromotionRequests());
      setSlots(getPromotionSlots());
    } catch (error) {
      console.warn('Error loading promotion data:', error);
      setRequests([]);
      setSlots([]);
    }
  };

  const handleOpenDrawer = (item = null) => {
    setEditingItem(item);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingItem(null);
  };

  const handleSavePromotion = (data) => {
    if (editingItem) {
      // Update logic would go here if needed
      console.log('Update promotion:', editingItem.id, data);
    } else {
      // Create new promotion request as admin
      createPromotionRequest({
        ...data,
        partnerId: 'admin',
        partnerName: user?.name || 'Admin',
        partnerType: 'ADMIN',
        status: 'LIVE', // Admin-created promotions can be LIVE immediately
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    loadData();
    handleCloseDrawer();
  };

  const tabs = [
    { key: 'requests', label: t('promotions.tabs.requests') || '신청 목록' },
    { key: 'slots', label: t('promotions.tabs.slots') || '슬롯 관리' },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-dabang-primary/10 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-dabang-primary/20">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
            {t('promotions.title') || '프로모션 관리'}
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            {t('promotions.subtitle') || '프로모션 신청을 검토하고 슬롯을 관리합니다'}
          </p>
        </div>
        {activeTab === 'requests' && (
          <button
            onClick={() => handleOpenDrawer()}
            className="px-5 py-2.5 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-dabang-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('promotions.createPromotion') || '프로모션 만들기'}
            </span>
          </button>
        )}
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

      {/* Premium Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-100/50">
            <h2 className="text-lg font-bold text-gray-900">신청 목록</h2>
          </div>
          <div className="p-6">
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t('promotions.noPromotions') || '등록된 프로모션이 없습니다'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        파트너
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        유형
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.partnerName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.requestType || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.title || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {request.status || 'DRAFT'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-dabang-primary hover:text-dabang-primary/80">
                            {t('promotions.cta.view') || '보기'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Slots Tab */}
      {activeTab === 'slots' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-100/50">
            <h2 className="text-lg font-bold text-gray-900">슬롯 관리</h2>
          </div>
          <div className="p-6">
            {slots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-gray-500 font-medium">등록된 슬롯이 없습니다</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slots.map((slot) => (
                  <div key={slot.id} className="border-2 border-gray-200/50 rounded-2xl p-6 hover:shadow-lg hover:border-dabang-primary/30 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">
                      {slot.slotType || 'Unknown Slot'}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">
                        용량: <span className="text-dabang-primary">{slot.capacity || 0}</span>
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        활성 프로모션: <span className="text-indigo-600">{slot.activePromotionIds?.length || 0}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drawer */}
      {showDrawer && activeTab === 'requests' && (
        <PromotionDrawer
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          onSave={handleSavePromotion}
          promotion={editingItem}
          partnerId="admin"
          partnerType="ADMIN"
        />
      )}
    </div>
  );
};

export default AdminPromotionsPage;


