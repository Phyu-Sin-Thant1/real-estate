// Banners store - manages promotional banners with localStorage
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
 * Seed initial banners if storage is empty
 * Returns empty array - no mock data seeded
 */
export const seedBannersIfEmpty = () => {
  const existing = getAllBanners();
  if (existing.length > 0) return existing;

  // Initialize with empty array - no mock banners
  const seedBanners = [];
  safeWrite(STORAGE_KEY, seedBanners);
  return seedBanners;
};

/**
 * Load all banners
 * @returns {Array} Array of banner objects
 */
export const getAllBanners = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Load all banners (alias for getAllBanners for backward compatibility)
 * @returns {Array} Array of banner objects
 */
export const loadBanners = () => {
  return getAllBanners();
};

/**
 * Get active banners filtered by placement, service scope, and date
 * @param {Object} options - Filter options
 * @param {string} options.placement - Banner placement
 * @param {string} options.serviceScope - Service scope filter ('ALL', 'REAL_ESTATE', 'DELIVERY')
 * @param {string} options.lang - Language code ('ko' or 'en')
 * @param {Date} options.now - Current date (defaults to now)
 * @returns {Array} Filtered and sorted active banners
 */
export const getActiveBanners = ({ placement, serviceScope, lang = 'ko', now = new Date() }) => {
  const banners = getAllBanners();
  const nowDate = now instanceof Date ? now : new Date(now);

  const filtered = banners.filter((banner) => {
    // Must match placement
    if (banner.placement !== placement) return false;

    // Must be ACTIVE
    if (banner.status !== 'ACTIVE') return false;

    // Check service scope
    if (serviceScope && banner.serviceScope !== 'ALL' && banner.serviceScope !== serviceScope) {
      return false;
    }

    // Check date range
    const startAt = banner.startAt ? new Date(banner.startAt) : null;
    const endAt = banner.endAt ? new Date(banner.endAt) : null;

    if (startAt && nowDate < startAt) return false;
    if (endAt && nowDate > endAt) return false;

    return true;
  });

  // Sort by priority (higher first), then createdAt (newer first)
  return filtered.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

/**
 * Create a new banner
 * @param {Object} banner - Banner object (without id, createdAt)
 * @returns {Object} Created banner with id and timestamps
 */
export const createBanner = (banner) => {
  const banners = getAllBanners();
  const newBanner = {
    id: `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: banner.status || 'PENDING',
    createdAt: new Date().toISOString(),
    createdBy: banner.createdBy || 'user',
    ...banner,
  };
  const nextBanners = [newBanner, ...banners];
  safeWrite(STORAGE_KEY, nextBanners);
  return newBanner;
};

/**
 * Add a new banner (alias for createBanner for backward compatibility)
 * @param {Object} banner - Banner object (without id, createdAt)
 * @returns {Object} Created banner with id and timestamps
 */
export const addBanner = (banner) => {
  return createBanner(banner);
};

/**
 * Update banner by ID
 * @param {string} id - Banner ID
 * @param {Object} patch - Fields to update
 * @returns {Object|null} Updated banner or null if not found
 */
export const updateBanner = (id, patch) => {
  const banners = getAllBanners();
  const bannerIndex = banners.findIndex((b) => b.id === id);
  if (bannerIndex === -1) return null;

  const updatedBanner = {
    ...banners[bannerIndex],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  banners[bannerIndex] = updatedBanner;
  safeWrite(STORAGE_KEY, banners);
  return updatedBanner;
};

/**
 * Remove banner (soft delete - set to DISABLED)
 * @param {string} id - Banner ID
 * @returns {Object|null} Updated banner or null if not found
 */
export const removeBanner = (id) => {
  return updateBanner(id, { status: 'DISABLED' });
};

/**
 * Delete banner (alias for removeBanner for backward compatibility)
 * @param {string} id - Banner ID
 * @returns {Object|null} Updated banner or null if not found
 */
export const deleteBanner = (id) => {
  return removeBanner(id);
};

/**
 * Get banner by ID
 * @param {string} id - Banner ID
 * @returns {Object|null} Banner object or null
 */
export const getBannerById = (id) => {
  const banners = getAllBanners();
  return banners.find((banner) => banner.id === id) || null;
};
