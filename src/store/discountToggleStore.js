// Discount Toggle Store
// Manages the discount usage toggle state for delivery agencies

const STORAGE_KEY = 'delivery-discount-toggle-enabled';

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
 * Get the current discount toggle state
 * @returns {boolean} True if discounts are enabled, false otherwise
 */
export const getDiscountToggleState = () => {
  return safeRead(STORAGE_KEY, false);
};

/**
 * Set the discount toggle state
 * @param {boolean} enabled - Whether discounts should be enabled
 */
export const setDiscountToggleState = (enabled) => {
  safeWrite(STORAGE_KEY, enabled);
};

/**
 * Toggle the discount state
 * @returns {boolean} The new state after toggling
 */
export const toggleDiscountState = () => {
  const currentState = getDiscountToggleState();
  const newState = !currentState;
  setDiscountToggleState(newState);
  return newState;
};




