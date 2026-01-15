// Real Estate Coupon Toggle Store
// Manages individual coupon enable/disable state for real-estate agencies

const STORAGE_KEY = 'real-estate-coupon-toggles';

const safeRead = (key, fallback = {}) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    return JSON.parse(value);
  } catch (e) {
    console.warn('Failed to parse localStorage value', e);
    return fallback;
  }
};

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write to localStorage', e);
  }
};

/**
 * Get all coupon toggle states
 * @returns {Object} Object mapping coupon IDs to enabled state (default: true for new coupons)
 */
export const getAllRealEstateCouponToggles = () => {
  return safeRead(STORAGE_KEY, {});
};

/**
 * Get toggle state for a specific coupon
 * @param {string} couponId - Coupon ID
 * @returns {boolean} True if enabled, false otherwise (default: true)
 */
export const getRealEstateCouponToggleState = (couponId) => {
  const toggles = getAllRealEstateCouponToggles();
  // Default to true (enabled) if not set
  return toggles[couponId] !== undefined ? toggles[couponId] : true;
};

/**
 * Set toggle state for a specific coupon
 * @param {string} couponId - Coupon ID
 * @param {boolean} enabled - Whether the coupon should be enabled
 */
export const setRealEstateCouponToggleState = (couponId, enabled) => {
  const toggles = getAllRealEstateCouponToggles();
  toggles[couponId] = enabled;
  safeWrite(STORAGE_KEY, toggles);
};

/**
 * Toggle a coupon's state
 * @param {string} couponId - Coupon ID
 * @returns {boolean} The new state after toggling
 */
export const toggleRealEstateCouponState = (couponId) => {
  const currentState = getRealEstateCouponToggleState(couponId);
  const newState = !currentState;
  setRealEstateCouponToggleState(couponId, newState);
  return newState;
};

/**
 * Check if a coupon is enabled (for use in discount engine)
 * @param {string} couponId - Coupon ID
 * @returns {boolean} True if coupon is enabled
 */
export const isRealEstateCouponEnabled = (couponId) => {
  return getRealEstateCouponToggleState(couponId);
};







