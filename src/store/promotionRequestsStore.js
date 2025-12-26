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

const safeWrite = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Error writing to localStorage:', e);
  }
};

export const getPromotionRequests = () => {
  return safeRead(STORAGE_KEY, []);
};

export const createPromotionRequest = (promotion) => {
  const requests = getPromotionRequests();
  const newPromotion = {
    id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...promotion,
    createdAt: promotion.createdAt || new Date().toISOString(),
    updatedAt: promotion.updatedAt || new Date().toISOString(),
  };
  requests.push(newPromotion);
  safeWrite(STORAGE_KEY, requests);
  return newPromotion;
};

export const updatePromotionRequest = (id, updates) => {
  const requests = getPromotionRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index] = {
      ...requests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    safeWrite(STORAGE_KEY, requests);
    return requests[index];
  }
  return null;
};

export const deletePromotionRequest = (id) => {
  const requests = getPromotionRequests();
  const filtered = requests.filter(r => r.id !== id);
  safeWrite(STORAGE_KEY, filtered);
  return filtered;
};


