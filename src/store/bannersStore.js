// Banners store - manages promotional banners
const STORAGE_KEY = 'tofu-banners';

const safeRead = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
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
    console.warn('Failed to write localStorage value', e);
  }
};

/**
 * Load all banners
 * @returns {Array} Array of banner objects
 */
export const loadBanners = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Add a new banner
 * @param {Object} banner - Banner object
 * @returns {Array} Updated banners array
 */
export const addBanner = (banner) => {
  const banners = loadBanners();
  const newBanner = {
    id: `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    ...banner,
  };
  const nextBanners = [newBanner, ...banners];
  safeWrite(STORAGE_KEY, nextBanners);
  return nextBanners;
};

/**
 * Update banner by ID
 * @param {string} id - Banner ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated banners array
 */
export const updateBanner = (id, patch) => {
  const banners = loadBanners();
  const nextBanners = banners.map((banner) =>
    banner.id === id
      ? { ...banner, ...patch, updatedAt: new Date().toISOString() }
      : banner
  );
  safeWrite(STORAGE_KEY, nextBanners);
  return nextBanners;
};

/**
 * Get active banners by placement within date range
 * @param {string} placement - Banner placement (e.g., 'HOME_TOP', 'HOME_SIDEBAR')
 * @returns {Array} Filtered active banners array
 */
export const getActiveBannersByPlacement = (placement) => {
  const banners = loadBanners();
  const now = new Date();
  
  return banners.filter((banner) => {
    // Must match placement
    if (banner.placement !== placement) return false;
    
    // Must be ACTIVE
    if (banner.status !== 'ACTIVE') return false;
    
    // Check date range
    const startAt = banner.startAt ? new Date(banner.startAt) : null;
    const endAt = banner.endAt ? new Date(banner.endAt) : null;
    
    if (startAt && now < startAt) return false;
    if (endAt && now > endAt) return false;
    
    return true;
  });
};

/**
 * Get banner by ID
 * @param {string} id - Banner ID
 * @returns {Object|null} Banner object or null
 */
export const getBannerById = (id) => {
  const banners = loadBanners();
  return banners.find((banner) => banner.id === id) || null;
};

/**
 * Delete banner by ID
 * @param {string} id - Banner ID
 * @returns {Array} Updated banners array
 */
export const deleteBanner = (id) => {
  const banners = loadBanners();
  const nextBanners = banners.filter((banner) => banner.id !== id);
  safeWrite(STORAGE_KEY, nextBanners);
  return nextBanners;
};

