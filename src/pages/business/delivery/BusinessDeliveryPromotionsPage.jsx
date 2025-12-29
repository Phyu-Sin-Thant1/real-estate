import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../context/I18nContext';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getPromotionRequests } from '../../../store/promotionRequestsStore';
import PromotionDrawer from '../../../components/promotions/PromotionDrawer';

const BusinessDeliveryPromotionsPage = () => {
  const { t } = useI18n();
  const { user } = useUnifiedAuth();
  const [promotions, setPromotions] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const partnerId = user?.email ? `partner-${user.email.split('@')[0]}` : null;

  useEffect(() => {
    loadData();
  }, [partnerId]);

  const loadData = () => {
    try {
      const allRequests = getPromotionRequests();
      if (partnerId) {
        setPromotions(allRequests.filter((p) => p.partnerId === partnerId));
      } else {
        setPromotions([]);
      }
    } catch (error) {
      console.warn('Error loading promotions:', error);
      setPromotions([]);
    }
  };

  const handleOpenDrawer = (promotion = null) => {
    setEditingPromotion(promotion);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingPromotion(null);
  };

  const handleSavePromotion = (data) => {
    // Save logic would go here
    loadData();
    handleCloseDrawer();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('promotions.title') || '광고 / 프로모션'}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('promotions.subtitle') || '노출을 늘려 더 많은 고객을 유입하세요'}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleOpenDrawer()}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90"
        >
          {t('promotions.cta.apply') || '프로모션 신청'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {promotions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {t('promotions.noPromotions') || '등록된 프로모션이 없습니다'}
            </p>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{promotion.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{promotion.requestType}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {promotion.status || 'DRAFT'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDrawer && (
        <PromotionDrawer
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          onSave={handleSavePromotion}
          promotion={editingPromotion}
          partnerId={partnerId}
          partnerType="DELIVERY"
        />
      )}
    </div>
  );
};

export default BusinessDeliveryPromotionsPage;





