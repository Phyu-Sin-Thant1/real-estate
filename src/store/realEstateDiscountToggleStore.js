// Real Estate Discount Toggle Store
// Manages the discount usage toggle state for real-estate agencies

const STORAGE_KEY = 'real-estate-discount-toggle-enabled';

const safeRead = (key, fallback = false) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    return value === 'true';
  } catch (e) {
    console.warn('Failed to parse localStorage value', e);
    return fallback;
  }
};

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch (e) {
    console.warn('Failed to write to localStorage', e);
  }
};

/**
 * Get the current discount toggle state for real-estate
 * @returns {boolean} True if discounts are enabled, false otherwise
 */
export const getRealEstateDiscountToggleState = () => {
  return safeRead(STORAGE_KEY, false);
};

/**
 * Set the discount toggle state for real-estate
 * @param {boolean} enabled - Whether discounts should be enabled
 */
export const setRealEstateDiscountToggleState = (enabled) => {
  safeWrite(STORAGE_KEY, enabled);
};

/**
 * Toggle the discount state for real-estate
 * @returns {boolean} The new state after toggling
 */
export const toggleRealEstateDiscountState = () => {
  const currentState = getRealEstateDiscountToggleState();
  const newState = !currentState;
  setRealEstateDiscountToggleState(newState);
  return newState;
};







