// Admin Notifications store - manages platform notifications
const STORAGE_KEY = 'tofu-admin-notifications';

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
 * Get all notifications
 * @returns {Array} Array of notification objects
 */
export const getAllNotifications = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get notification by ID
 * @param {string} id - Notification ID
 * @returns {Object|null} Notification object or null
 */
export const getNotificationById = (id) => {
  const notifications = getAllNotifications();
  return notifications.find(n => n.id === id) || null;
};

/**
 * Create a new notification
 * @param {Object} notification - Notification object
 * @returns {Array} Updated notifications array
 */
export const createNotification = (notification) => {
  const notifications = getAllNotifications();
  const newNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...notification,
  };
  const nextNotifications = [newNotification, ...notifications];
  safeWrite(STORAGE_KEY, nextNotifications);
  return nextNotifications;
};

/**
 * Update a notification
 * @param {string} id - Notification ID
 * @param {Object} updates - Updates to apply
 * @returns {Array} Updated notifications array
 */
export const updateNotification = (id, updates) => {
  const notifications = getAllNotifications();
  const nextNotifications = notifications.map(n =>
    n.id === id
      ? { ...n, ...updates, updatedAt: new Date().toISOString() }
      : n
  );
  safeWrite(STORAGE_KEY, nextNotifications);
  return nextNotifications;
};

/**
 * Resend a notification (creates a new sent notification)
 * @param {string} id - Notification ID to resend
 * @returns {Array} Updated notifications array
 */
export const resendNotification = (id) => {
  const notification = getNotificationById(id);
  if (!notification) return getAllNotifications();

  const newNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    scheduledAt: null,
    createdAt: new Date().toISOString(),
  };

  const notifications = getAllNotifications();
  const nextNotifications = [newNotification, ...notifications];
  safeWrite(STORAGE_KEY, nextNotifications);
  return nextNotifications;
};


