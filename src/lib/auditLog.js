// Audit log helper functions
const STORAGE_KEY = 'tofu-audit-logs';

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
 * Add an audit log entry
 * @param {Object} entry - Audit log entry
 * @param {string} entry.action - Action type (e.g., PROPERTY_APPROVED, PROPERTY_REJECTED)
 * @param {string} entry.targetId - Target ID (property ID)
 * @param {Object} entry.metadata - Additional metadata (partnerId, partnerName, etc.)
 * @param {string} entry.user - User who performed the action (optional, defaults to 'Admin')
 * @returns {Object} Created audit log entry
 */
export const addAuditLog = (entry) => {
  const logs = safeRead(STORAGE_KEY, []);
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  const newLog = {
    id: Date.now(),
    user: entry.user || 'Admin',
    action: entry.action,
    target: entry.targetId || entry.metadata?.partnerName || 'Unknown',
    details: entry.details || `${entry.action.replace(/_/g, ' ')}`,
    timestamp,
    ip: entry.ip || '127.0.0.1',
    ...entry.metadata
  };
  
  const nextLogs = [newLog, ...logs];
  safeWrite(STORAGE_KEY, nextLogs);
  return newLog;
};






