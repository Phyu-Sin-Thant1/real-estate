// Business Notifications store - manages notifications for business partners
const STORAGE_KEY = 'tofu-business-notifications';

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
 * Load all notifications
 * @returns {Array} Array of notification objects
 */
export const loadNotifications = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Add a new notification
 * @param {Object} notification - Notification object
 * @returns {Array} Updated notifications array
 */
export const addNotification = (notification) => {
  const notifications = loadNotifications();
  const newNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
  const nextNotifications = [newNotification, ...notifications];
  safeWrite(STORAGE_KEY, nextNotifications);
  return nextNotifications;
};

/**
 * Get notifications filtered by partner email
 * @param {string} email - Partner email
 * @returns {Array} Filtered notifications array
 */
export const getNotificationsByPartner = (email) => {
  const notifications = loadNotifications();
  return notifications.filter((notif) => notif.partnerEmail === email);
};

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Array} Updated notifications array
 */
export const markAsRead = (id) => {
  const notifications = loadNotifications();
  const nextNotifications = notifications.map((notif) =>
    notif.id === id ? { ...notif, read: true } : notif
  );
  safeWrite(STORAGE_KEY, nextNotifications);
  return nextNotifications;
};

/**
 * Mark all notifications as read for a partner
 * @param {string} email - Partner email
 * @returns {Array} Updated notifications array
 */
export const markAllAsRead = (email) => {
  const notifications = loadNotifications();
  const nextNotifications = notifications.map((notif) =>
    notif.partnerEmail === email && !notif.read
      ? { ...notif, read: true }
      : notif
  );
  safeWrite(STORAGE_KEY, nextNotifications);
  return nextNotifications;
};

/**
 * Get unread count for a partner
 * @param {string} email - Partner email
 * @returns {number} Unread count
 */
export const getUnreadCount = (email) => {
  const notifications = getNotificationsByPartner(email);
  return notifications.filter((notif) => !notif.read).length;
};

