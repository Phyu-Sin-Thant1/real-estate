// Shared approvals store - single source of truth for all approval requests
const STORAGE_KEY = 'tofu-approvals-queue';

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
 * Get all approvals
 * @returns {Array} Array of approval objects
 */
export const getApprovals = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Add a new approval request
 * @param {Object} approval - Approval object
 * @returns {Array} Updated approvals array
 */
export const addApproval = (approval) => {
  const approvals = getApprovals();
  const nextApprovals = [approval, ...approvals];
  safeWrite(STORAGE_KEY, nextApprovals);
  return nextApprovals;
};

/**
 * Update an approval by ID
 * @param {string} id - Approval ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated approvals array
 */
export const updateApproval = (id, patch) => {
  const approvals = getApprovals();
  const nextApprovals = approvals.map((approval) =>
    approval.id === id
      ? { ...approval, ...patch, updatedAt: new Date().toISOString() }
      : approval
  );
  safeWrite(STORAGE_KEY, nextApprovals);
  return nextApprovals;
};

/**
 * Get approvals filtered by status
 * @param {string} status - Status to filter by (PENDING, APPROVED, REJECTED)
 * @returns {Array} Filtered approvals array
 */
export const getApprovalsByStatus = (status) => {
  const approvals = getApprovals();
  return approvals.filter((approval) => approval.status === status);
};

/**
 * Get approvals filtered by type
 * @param {string} type - Type to filter by
 * @returns {Array} Filtered approvals array
 */
export const getApprovalsByType = (type) => {
  const approvals = getApprovals();
  return approvals.filter((approval) => approval.type === type);
};

/**
 * Get approval by ID
 * @param {string} id - Approval ID
 * @returns {Object|null} Approval object or null
 */
export const getApprovalById = (id) => {
  const approvals = getApprovals();
  return approvals.find((approval) => approval.id === id) || null;
};

