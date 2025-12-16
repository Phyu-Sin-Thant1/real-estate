// Partner Applications store - manages partner applications
const STORAGE_KEY = 'tofu-partner-applications';

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
 * Get all partner applications
 * @returns {Array} Array of application objects
 */
export const getApplications = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get application by ID
 * @param {string} id - Application ID
 * @returns {Object|null} Application object or null
 */
export const getApplicationById = (id) => {
  const applications = getApplications();
  return applications.find((app) => app.id === id) || null;
};

/**
 * Add a new partner application
 * @param {Object} application - Application object
 * @returns {Array} Updated applications array
 */
export const addApplication = (application) => {
  const applications = getApplications();
  const nextApplications = [application, ...applications];
  safeWrite(STORAGE_KEY, nextApplications);
  return nextApplications;
};

/**
 * Update application by ID
 * @param {string} id - Application ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated applications array
 */
export const updateApplication = (id, patch) => {
  const applications = getApplications();
  const nextApplications = applications.map((app) =>
    app.id === id
      ? { ...app, ...patch, updatedAt: new Date().toISOString() }
      : app
  );
  safeWrite(STORAGE_KEY, nextApplications);
  return nextApplications;
};

/**
 * Get applications filtered by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered applications array
 */
export const getApplicationsByStatus = (status) => {
  const applications = getApplications();
  return applications.filter((app) => app.status === status);
};

/**
 * Update partner application status
 * @param {string} id - Application ID
 * @param {string} status - New status (PENDING, APPROVED, REJECTED)
 * @param {Object} meta - Optional metadata (e.g., rejectReason)
 * @returns {Array} Updated applications array
 */
export const updatePartnerApplicationStatus = (id, status, meta = {}) => {
  return updateApplication(id, {
    status,
    ...meta,
    updatedAt: new Date().toISOString(),
  });
};

