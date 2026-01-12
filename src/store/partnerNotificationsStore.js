// Partner Notifications store - manages notifications for partners
// Filters notifications based on recipient group and surface
const STORAGE_KEY = 'tofu-partner-notifications-read'; // Track read status
const ADMIN_NOTIFICATIONS_KEY = 'tofu-admin-notifications'; // Source from admin notifications

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
 * Get read status for notifications
 * @returns {Object} Map of notification ID to read status
 */
const getReadStatus = () => {
  return safeRead(STORAGE_KEY, {});
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 */
export const markNotificationAsRead = (notificationId) => {
  const readStatus = getReadStatus();
  readStatus[notificationId] = true;
  safeWrite(STORAGE_KEY, readStatus);
};

/**
 * Mark all notifications as read
 * @param {Array<string>} notificationIds - Array of notification IDs
 */
export const markAllNotificationsAsRead = (notificationIds) => {
  const readStatus = getReadStatus();
  notificationIds.forEach(id => {
    readStatus[id] = true;
  });
  safeWrite(STORAGE_KEY, readStatus);
};

/**
 * Get notifications for a partner based on their role
 * @param {string} partnerRole - 'BUSINESS_REAL_ESTATE' | 'BUSINESS_DELIVERY'
 * @returns {Array} Filtered notifications with read status
 */
export const getPartnerNotifications = (partnerRole) => {
  // Get all admin notifications
  const allNotifications = safeRead(ADMIN_NOTIFICATIONS_KEY, []);
  const readStatus = getReadStatus();

  // Determine recipient and surface filters based on role
  let recipientFilter = [];
  let surfaceFilter = [];

  if (partnerRole === 'BUSINESS_REAL_ESTATE') {
    recipientFilter = ['REAL_ESTATE_PARTNERS', 'ALL'];
    surfaceFilter = ['REAL_ESTATE_DASHBOARD', 'ALL_SURFACES'];
  } else if (partnerRole === 'BUSINESS_DELIVERY') {
    recipientFilter = ['DELIVERY_PARTNERS', 'ALL'];
    surfaceFilter = ['DELIVERY_DASHBOARD', 'ALL_SURFACES'];
  } else {
    return [];
  }

  // Filter notifications
  const filtered = allNotifications
    .filter(n => {
      // Only show SENT notifications
      if (n.status !== 'SENT') return false;
      
      // Filter by recipient
      if (!recipientFilter.includes(n.recipients)) return false;
      
      // Filter by surface
      if (!surfaceFilter.includes(n.surface)) return false;
      
      return true;
    })
    .map(n => ({
      ...n,
      isRead: readStatus[n.id] || false
    }))
    .sort((a, b) => new Date(b.sentAt || b.createdAt) - new Date(a.sentAt || a.createdAt));

  return filtered;
};

/**
 * Get unread count for a partner
 * @param {string} partnerRole - 'BUSINESS_REAL_ESTATE' | 'BUSINESS_DELIVERY'
 * @returns {number} Unread count
 */
export const getUnreadCount = (partnerRole) => {
  const notifications = getPartnerNotifications(partnerRole);
  return notifications.filter(n => !n.isRead).length;
};


