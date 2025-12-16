// Reviews store - manages user reviews for listings/orders
const STORAGE_KEY = 'tofu-reviews';

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
 * Load all reviews
 * @returns {Array} Array of review objects
 */
export const loadReviews = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Add a new review
 * @param {Object} review - Review object
 * @returns {Array} Updated reviews array
 */
export const addReview = (review) => {
  const reviews = loadReviews();
  const newReview = {
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    ...review,
  };
  const nextReviews = [newReview, ...reviews];
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};

/**
 * Get reviews filtered by partner email
 * @param {string} email - Partner email
 * @returns {Array} Filtered reviews array
 */
export const getReviewsByPartner = (email) => {
  const reviews = loadReviews();
  return reviews.filter((review) => review.partnerEmail === email);
};

/**
 * Get all reviews (for admin)
 * @returns {Array} All reviews array
 */
export const getAllReviews = () => {
  return loadReviews();
};

/**
 * Update review status
 * @param {string} id - Review ID
 * @param {string} status - New status (ACTIVE, HIDDEN)
 * @returns {Array} Updated reviews array
 */
export const updateReviewStatus = (id, status) => {
  const reviews = loadReviews();
  const nextReviews = reviews.map((review) =>
    review.id === id ? { ...review, status, updatedAt: new Date().toISOString() } : review
  );
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};

/**
 * Get review by ID
 * @param {string} id - Review ID
 * @returns {Object|null} Review object or null
 */
export const getReviewById = (id) => {
  const reviews = loadReviews();
  return reviews.find((review) => review.id === id) || null;
};

