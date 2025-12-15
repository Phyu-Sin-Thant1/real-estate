const FAVORITES_KEY = 'tofu-user-favorites';
const HISTORY_KEY = 'tofu-user-history';

const safeParse = (val, fallback = []) => {
  try {
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const read = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
};

const write = (key, data) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(data));
};

export const loadFavorites = () => read(FAVORITES_KEY, []);
export const saveFavorites = (items) => write(FAVORITES_KEY, items);

export const loadHistory = () => read(HISTORY_KEY, []);
export const saveHistory = (items) => write(HISTORY_KEY, items);

