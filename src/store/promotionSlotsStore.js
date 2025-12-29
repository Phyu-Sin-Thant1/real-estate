// Promotion Slots store
const STORAGE_KEY = 'tofu-promotion-slots';

const safeRead = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const getPromotionSlots = () => {
  return safeRead(STORAGE_KEY, []);
};





