import React, { useEffect, useState } from 'react';
import { getPromotionSlots } from '../../store/promotionSlotsStore';
import { getPromotionRequests } from '../../store/promotionRequestsStore';

const PromotionBanner = () => {
  const [activePromotion, setActivePromotion] = useState(null);

  useEffect(() => {
    // Get active promotion from HOME_HERO_BANNER slot
    const slots = getPromotionSlots();
    const heroSlot = slots.find((s) => s.slotType === 'HOME_HERO_BANNER');
    
    if (heroSlot && heroSlot.activePromotionIds.length > 0) {
      const requests = getPromotionRequests();
      const promotionId = heroSlot.activePromotionIds[0];
      const promotion = requests.find((r) => r.id === promotionId && r.status === 'LIVE');
      
      if (promotion) {
        const now = new Date();
        const startAt = new Date(promotion.startAt);
        const endAt = new Date(promotion.endAt);
        
        if (now >= startAt && now <= endAt) {
          setActivePromotion(promotion);
        }
      }
    }
  }, []);

  if (!activePromotion) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex-1 text-center">
          <p className="font-semibold text-sm md:text-base">
            {activePromotion.creative?.headline || activePromotion.title}
          </p>
          {activePromotion.creative?.subtext && (
            <p className="text-xs md:text-sm opacity-90 mt-1">
              {activePromotion.creative.subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;

