// Delivery Orders store - manages all delivery orders
const STORAGE_KEY = 'tofu-delivery-orders';

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
 * Initialize with mock data if empty
 */
const initializeMockData = () => {
  const existing = safeRead(STORAGE_KEY, []);
  if (existing.length === 0) {
    const mockOrders = [
      {
        id: 'order-1',
        orderNo: 'MOVE-001',
        status: 'COMPLETED',
        disputeStatus: 'NONE',
        flagged: false,
        partnerId: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        customerName: 'John Doe',
        customerPhone: '010-1234-5678',
        pickupAddress: '123 Main St, Seoul',
        dropoffAddress: '456 Park Ave, Seoul',
        driverName: 'Kim Driver',
        driverPhone: '010-9876-5432',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 'order-2',
        orderNo: 'MOVE-002',
        status: 'FAILED',
        disputeStatus: 'OPEN',
        flagged: true,
        partnerId: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        customerName: 'Jane Smith',
        customerPhone: '010-2345-6789',
        pickupAddress: '789 Oak St, Seoul',
        dropoffAddress: '321 Elm St, Seoul',
        driverName: 'Lee Driver',
        driverPhone: '010-8765-4321',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: 'order-3',
        orderNo: 'MOVE-003',
        status: 'IN_PROGRESS',
        disputeStatus: 'NONE',
        flagged: false,
        partnerId: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        customerName: 'Bob Johnson',
        customerPhone: '010-3456-7890',
        pickupAddress: '555 Pine St, Seoul',
        dropoffAddress: '777 Maple St, Seoul',
        driverName: 'Park Driver',
        driverPhone: '010-7654-3210',
        createdAt: new Date().toISOString(),
      },
    ];
    safeWrite(STORAGE_KEY, mockOrders);
    return mockOrders;
  }
  return existing;
};

/**
 * Get all orders
 * @returns {Array} Array of order objects
 */
export const getOrders = () => {
  return initializeMockData();
};

/**
 * Get order by ID
 * @param {string} id - Order ID
 * @returns {Object|null} Order object or null
 */
export const getOrderById = (id) => {
  const orders = getOrders();
  return orders.find((order) => order.id === id) || null;
};

/**
 * Update order by ID
 * @param {string} id - Order ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated orders array
 */
export const updateOrder = (id, patch) => {
  const orders = getOrders();
  const nextOrders = orders.map((order) =>
    order.id === id
      ? { ...order, ...patch, updatedAt: new Date().toISOString() }
      : order
  );
  safeWrite(STORAGE_KEY, nextOrders);
  return nextOrders;
};

/**
 * Get flagged orders (failed, cancelled, or disputed)
 * @returns {Array} Filtered orders array
 */
export const getFlaggedOrders = () => {
  const orders = getOrders();
  return orders.filter(
    (order) =>
      order.flagged === true ||
      order.status === 'FAILED' ||
      order.status === 'CANCELLED' ||
      order.disputeStatus === 'OPEN'
  );
};

/**
 * Get orders filtered by partner
 * @param {string} partnerId - Partner ID or email
 * @returns {Array} Filtered orders array
 */
export const getOrdersByPartner = (partnerId) => {
  const orders = getOrders();
  return orders.filter(
    (order) => order.partnerId === partnerId || order.partnerEmail === partnerId
  );
};

