// Customer Orders Store
// Manages customer orders with package information

const STORAGE_KEY = 'customerOrders';

const safeRead = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

// Initialize with mock data
const initializeMockData = () => {
  const existing = safeRead(STORAGE_KEY, []);
  if (existing.length === 0) {
    const today = new Date();
    const getDateString = (daysAgo) => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split('T')[0];
    };

    const mockOrders = [
      {
        id: 'CO-001',
        orderId: 'ORD-20251215-001',
        customerName: '김철수',
        customerEmail: 'kim@example.com',
        customerPhone: '010-1234-5678',
        pickupAddress: '서울특별시 강남구 역삼동 123-45',
        deliveryAddress: '서울특별시 서초구 방배동 67-89',
        selectedPackage: {
          id: 'pkg-1',
          name: '홈 배송',
          category: '홈 배송',
          basePrice: 120000,
          description: '가정용 이사 서비스'
        },
        packagePrice: 120000,
        addOns: [
          { name: '추가 층수', quantity: 2, price: 40000 },
          { name: '대형 물품', quantity: 1, price: 30000 }
        ],
        additionalCosts: 70000,
        totalPrice: 190000,
        orderDate: getDateString(5),
        serviceDate: getDateString(0),
        status: 'confirmed',
        paymentStatus: 'paid',
        specialInstructions: '깨지기 쉬운 물품이 있으니 조심스럽게 다뤄주세요.',
        driver: {
          name: '김민수',
          phone: '010-1111-2222'
        },
        vehicle: {
          name: '트럭 1호',
          plateNumber: '12가 3456'
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CO-002',
        orderId: 'ORD-20251214-002',
        customerName: '이영희',
        customerEmail: 'lee@example.com',
        customerPhone: '010-2345-6789',
        pickupAddress: '서울특별시 마포구 서교동 34-56',
        deliveryAddress: '서울특별시 용산구 한남동 78-90',
        selectedPackage: {
          id: 'pkg-2',
          name: '익스프레스 배송',
          category: '익스프레스 배송',
          basePrice: 150000,
          description: '빠른 배송 서비스'
        },
        packagePrice: 150000,
        addOns: [
          { name: '깨지기 쉬운 물품', quantity: 3, price: 63000 }
        ],
        additionalCosts: 63000,
        totalPrice: 213000,
        orderDate: getDateString(6),
        serviceDate: getDateString(1),
        status: 'in_progress',
        paymentStatus: 'paid',
        specialInstructions: '오후 2시 이후 배송 부탁드립니다.',
        driver: {
          name: '이정은',
          phone: '010-2222-3333'
        },
        vehicle: {
          name: '트럭 2호',
          plateNumber: '23나 4567'
        },
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CO-003',
        orderId: 'ORD-20251213-003',
        customerName: '박민수',
        customerEmail: 'park@example.com',
        customerPhone: '010-3456-7890',
        pickupAddress: '서울특별시 송파구 잠실동 56-78',
        deliveryAddress: '서울특별시 강동구 명일동 90-12',
        selectedPackage: {
          id: 'pkg-3',
          name: '오피스 이전',
          category: '오피스 이전',
          basePrice: 180000,
          description: '사무실 이전 서비스'
        },
        packagePrice: 180000,
        addOns: [],
        additionalCosts: 0,
        totalPrice: 180000,
        orderDate: getDateString(7),
        serviceDate: getDateString(2),
        status: 'pending',
        paymentStatus: 'pending',
        specialInstructions: '',
        driver: null,
        vehicle: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CO-004',
        orderId: 'ORD-20251212-004',
        customerName: '최지은',
        customerEmail: 'choi@example.com',
        customerPhone: '010-4567-8901',
        pickupAddress: '서울특별시 강서구 화곡동 12-34',
        deliveryAddress: '서울특별시 양천구 목동 56-78',
        selectedPackage: {
          id: 'pkg-1',
          name: '홈 배송',
          category: '홈 배송',
          basePrice: 120000,
          description: '가정용 이사 서비스'
        },
        packagePrice: 120000,
        addOns: [
          { name: '추가 층수', quantity: 1, price: 20000 }
        ],
        additionalCosts: 20000,
        totalPrice: 140000,
        orderDate: getDateString(8),
        serviceDate: getDateString(3),
        status: 'completed',
        paymentStatus: 'paid',
        specialInstructions: '',
        driver: {
          name: '박서준',
          phone: '010-3333-4444'
        },
        vehicle: {
          name: '트럭 3호',
          plateNumber: '34다 5678'
        },
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CO-005',
        orderId: 'ORD-20251211-005',
        customerName: '정하늘',
        customerEmail: 'jung@example.com',
        customerPhone: '010-5678-9012',
        pickupAddress: '서울특별시 노원구 상계동 90-12',
        deliveryAddress: '서울특별시 도봉구 창동 34-56',
        selectedPackage: {
          id: 'pkg-2',
          name: '익스프레스 배송',
          category: '익스프레스 배송',
          basePrice: 150000,
          description: '빠른 배송 서비스'
        },
        packagePrice: 150000,
        addOns: [
          { name: '대형 물품', quantity: 2, price: 60000 },
          { name: '깨지기 쉬운 물품', quantity: 1, price: 21000 }
        ],
        additionalCosts: 81000,
        totalPrice: 231000,
        orderDate: getDateString(9),
        serviceDate: getDateString(4),
        status: 'canceled',
        paymentStatus: 'refunded',
        specialInstructions: '고객 요청으로 취소됨',
        driver: null,
        vehicle: null,
        canceledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    safeWrite(STORAGE_KEY, mockOrders);
    return mockOrders;
  }
  return existing;
};

// Get all customer orders
export const getAllCustomerOrders = () => {
  return initializeMockData();
};

// Get customer order by ID
export const getCustomerOrderById = (id) => {
  const orders = getAllCustomerOrders();
  return orders.find(order => order.id === id || order.orderId === id);
};

// Get customer orders by status
export const getCustomerOrdersByStatus = (status) => {
  const orders = getAllCustomerOrders();
  return orders.filter(order => order.status === status);
};

// Get customer orders by package
export const getCustomerOrdersByPackage = (packageId) => {
  const orders = getAllCustomerOrders();
  return orders.filter(order => order.selectedPackage.id === packageId);
};

// Update customer order status
export const updateCustomerOrderStatus = (orderId, status, updates = {}) => {
  const orders = getAllCustomerOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId || order.orderId === orderId);
  
  if (orderIndex === -1) {
    throw new Error(`Order ${orderId} not found`);
  }

  const updatedOrder = {
    ...orders[orderIndex],
    status,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  orders[orderIndex] = updatedOrder;
  safeWrite(STORAGE_KEY, orders);
  return updatedOrder;
};

// Assign driver and vehicle to order
export const assignDriverAndVehicle = (orderId, driver, vehicle) => {
  return updateCustomerOrderStatus(orderId, 'confirmed', {
    driver,
    vehicle
  });
};

// Complete order
export const completeCustomerOrder = (orderId) => {
  return updateCustomerOrderStatus(orderId, 'completed', {
    completedAt: new Date().toISOString()
  });
};

// Cancel order
export const cancelCustomerOrder = (orderId, reason) => {
  return updateCustomerOrderStatus(orderId, 'canceled', {
    canceledAt: new Date().toISOString(),
    cancelReason: reason,
    paymentStatus: 'refunded'
  });
};

// Create new customer order
export const createCustomerOrder = (orderData) => {
  const orders = getAllCustomerOrders();
  const today = new Date();
  
  // Use provided order ID or generate one
  const orderId = orderData.orderId || `order-${String(orders.length + 1).padStart(3, '0')}`;
  
  const newOrder = {
    id: `CO-${Date.now()}`,
    orderId: orderId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail || '',
    customerPhone: orderData.customerPhone,
    pickupAddress: orderData.pickupAddress,
    deliveryAddress: orderData.deliveryAddress,
    selectedPackage: orderData.selectedPackage || null,
    packagePrice: orderData.packagePrice || 0,
    addOns: orderData.addOns || [],
    additionalCosts: orderData.additionalCosts || 0,
    totalPrice: orderData.totalPrice || 0,
    orderDate: orderData.orderDate || today.toISOString().split('T')[0],
    serviceDate: orderData.serviceDate || '',
    deliveryTime: orderData.deliveryTime || '',
    status: orderData.status || 'pending',
    paymentStatus: orderData.paymentStatus || 'pending',
    specialInstructions: orderData.specialInstructions || '',
    driver: orderData.driver || null,
    vehicle: orderData.vehicle || null,
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  safeWrite(STORAGE_KEY, orders);
  return newOrder;
};

