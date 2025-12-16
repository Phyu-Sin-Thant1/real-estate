// Real-Estate Listings store - manages all property listings
const STORAGE_KEY = 'tofu-realestate-listings';

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
 * Get all listings
 * @returns {Array} Array of listing objects
 */
export const getListings = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get listing by ID
 * @param {string|number} id - Listing ID
 * @returns {Object|null} Listing object or null
 */
export const getListingById = (id) => {
  const listings = getListings();
  return listings.find((listing) => listing.id === id || listing.id === String(id)) || null;
};

/**
 * Add a new listing
 * @param {Object} listing - Listing object
 * @returns {Array} Updated listings array
 */
export const addListing = (listing) => {
  const listings = getListings();
  const nextListings = [listing, ...listings];
  safeWrite(STORAGE_KEY, nextListings);
  return nextListings;
};

/**
 * Update listing by ID
 * @param {string|number} id - Listing ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated listings array
 */
export const updateListing = (id, patch) => {
  const listings = getListings();
  const nextListings = listings.map((listing) =>
    listing.id === id || listing.id === String(id)
      ? { ...listing, ...patch, updatedAt: new Date().toISOString() }
      : listing
  );
  safeWrite(STORAGE_KEY, nextListings);
  return nextListings;
};

/**
 * Get listings filtered by partner email or partnerId
 * @param {string} emailOrPartnerId - Partner email or ID
 * @returns {Array} Filtered listings array
 */
export const getListingsByPartner = (emailOrPartnerId) => {
  const listings = getListings();
  return listings.filter(
    (listing) =>
      listing.partnerEmail === emailOrPartnerId ||
      listing.partnerId === emailOrPartnerId ||
      listing.createdBy === emailOrPartnerId
  );
};

/**
 * Get listings filtered by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered listings array
 */
export const getListingsByStatus = (status) => {
  const listings = getListings();
  return listings.filter((listing) => listing.status === status);
};

