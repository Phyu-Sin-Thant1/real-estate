import React, { useEffect, useState } from 'react';
import { getPromotionSlots } from '../../store/promotionSlotsStore';
import { getPromotionRequests } from '../../store/promotionRequestsStore';

/**
 * PromotionBanner - Read-only component that displays active promotion from HOME_HERO_BANNER slot
 * 
 * Architecture:
 * - READ-ONLY: Only reads data, never modifies or seeds
 * - Safe for SSR: Handles missing data gracefully
 * - Deterministic: Same inputs produce same outputs
 */
const PromotionBanner = () => {
  const [activePromotion, setActivePromotion] = useState(null);

  useEffect(() => {
    // Safely read promotion data (no side effects, no seeding)
    try {
      const slots = getPromotionSlots();
      if (!Array.isArray(slots) || slots.length === 0) {
        return; // No slots available
      }

      // Find HOME_HERO_BANNER slot
      const heroSlot = slots.find((s) => s?.slotType === 'HOME_HERO_BANNER');
      if (!heroSlot || !Array.isArray(heroSlot.activePromotionIds) || heroSlot.activePromotionIds.length === 0) {
        return; // No active promotions in slot
      }

      // Get promotion requests
      const requests = getPromotionRequests();
      if (!Array.isArray(requests) || requests.length === 0) {
        return; // No requests available
      }

      // Find the first active promotion ID
      const promotionId = heroSlot.activePromotionIds[0];
      if (!promotionId) {
        return; // Invalid promotion ID
      }

      // Find matching promotion request
      const promotion = requests.find((r) => r?.id === promotionId && r?.status === 'LIVE');
      if (!promotion) {
        return; // No active promotion found
      }

      // Validate date range
      if (!promotion.startAt || !promotion.endAt) {
        return; // Missing date range
      }

      const now = new Date();
      const startAt = new Date(promotion.startAt);
      const endAt = new Date(promotion.endAt);

      // Check if promotion is currently active
      if (now >= startAt && now <= endAt) {
        setActivePromotion(promotion);
      }
    } catch (error) {
      // Silently fail in production (safe for SSR/build)
      if (process.env.NODE_ENV === 'development') {
        console.warn('PromotionBanner: Error reading promotion data', error);
      }
    }
  }, []);

  // Render null if no active promotion (safe guard)
  if (!activePromotion) {
    return null;
  }

  // Extract display content safely
  const headline = activePromotion.creative?.headline || activePromotion.title || '';
  const subtext = activePromotion.creative?.subtext;

  // Don't render if no headline
  if (!headline) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex-1 text-center">
          <p className="font-semibold text-sm md:text-base">
            {headline}
          </p>
          {subtext && (
            <p className="text-xs md:text-sm opacity-90 mt-1">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;

