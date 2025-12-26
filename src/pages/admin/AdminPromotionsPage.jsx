import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { getPromotionRequests } from '../../store/promotionRequestsStore';
import { getPromotionSlots } from '../../store/promotionSlotsStore';

const AdminPromotionsPage = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [slots, setSlots] = useState([]);

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

  const tabs = [
    { key: 'requests', label: t('promotions.tabs.requests') || '신청 목록' },
    { key: 'slots', label: t('promotions.tabs.slots') || '슬롯 관리' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('promotions.title') || '프로모션 관리'}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('promotions.subtitle') || '프로모션 신청을 검토하고 슬롯을 관리합니다'}
        </p>
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

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">신청 목록</h2>
          </div>
          <div className="p-6">
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t('promotions.noPromotions') || '등록된 프로모션이 없습니다'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
                  <tbody className="bg-white divide-y divide-gray-200">
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

      {/* Slots Tab */}
      {activeTab === 'slots' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">슬롯 관리</h2>
          </div>
          <div className="p-6">
            {slots.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                등록된 슬롯이 없습니다
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map((slot) => (
                  <div key={slot.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {slot.slotType || 'Unknown Slot'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      용량: {slot.capacity || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      활성 프로모션: {slot.activePromotionIds?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;

