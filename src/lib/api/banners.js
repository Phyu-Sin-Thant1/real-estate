// Banner API functions (mock implementation)
// In production, these would call actual API endpoints

import { getActiveBannerForSlot, getActiveBannersForPage } from '../../store/bannersStore';

/**
 * Track banner impression
 * @param {string} bannerId - Banner ID
 */
export const trackBannerImpression = async (bannerId) => {
  // In production: POST /public/banners/:id/impression
  // For now, just log it
  console.log('Banner impression:', bannerId);
  
  // Store in localStorage for analytics
  const impressions = JSON.parse(localStorage.getItem('banner_impressions') || '[]');
  impressions.push({
    bannerId,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('banner_impressions', JSON.stringify(impressions.slice(-1000))); // Keep last 1000
};

/**
 * Track banner click
 * @param {string} bannerId - Banner ID
 */
export const trackBannerClick = async (bannerId) => {
  // In production: POST /public/banners/:id/click
  // For now, just log it
  console.log('Banner click:', bannerId);
  
  // Store in localStorage for analytics
  const clicks = JSON.parse(localStorage.getItem('banner_clicks') || '[]');
  clicks.push({
    bannerId,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('banner_clicks', JSON.stringify(clicks.slice(-1000))); // Keep last 1000
};

/**
 * Fetch banners for a page
 * @param {Object} params - Query parameters
 * @param {string} params.surface - Surface
 * @param {string} params.pageScope - Page scope
 * @param {string} [params.domain] - Domain
 * @param {string} [params.device] - Device
 * @param {string} [params.language] - Language
 * @returns {Promise<Object>} Object with slots and banners
 */
export const fetchBannersForPage = async (params) => {
  // In production: GET /public/banners?surface=USER_WEB&pageScope=HOME&domain=REAL_ESTATE&device=DESKTOP&lang=KO
  // For now, use store functions
  
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  
  const slots = getActiveBannersForPage({
    surface: params.surface || 'USER_WEB',
    pageScope: params.pageScope,
    domain: params.domain,
    device: params.device,
    language: params.language,
  });

  return { slots };
};

