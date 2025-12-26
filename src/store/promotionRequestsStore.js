// Promotion Requests store
const STORAGE_KEY = 'tofu-promotion-requests';

const safeRead = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const getPromotionRequests = () => {
  return safeRead(STORAGE_KEY, []);
};

