export const BUSINESS_MENU_KEYS = {
  DASHBOARD: 'dashboard',
  CONTRACTS: 'contracts',
  PROPERTIES: 'properties',
  ADS: 'ads',
  STATS: 'stats',
  MOVING_REQUESTS: 'movingRequests',
  DELIVERY_ORDERS: 'deliveryOrders',
  SCHEDULE: 'schedule',
  CUSTOMERS: 'customers',
  SETTINGS: 'settings',
  RESERVATIONS: 'reservations' // Added reservation menu key
};

export const realEstateMenu = [
  { key: BUSINESS_MENU_KEYS.DASHBOARD, translationKey: 'nav.dashboard', path: '/business/real-estate/dashboard' },
  { key: BUSINESS_MENU_KEYS.CONTRACTS, translationKey: 'nav.contracts', path: '/business/real-estate/contracts' },
  { key: BUSINESS_MENU_KEYS.PROPERTIES, translationKey: 'nav.properties', path: '/business/real-estate/listings' },
  { key: BUSINESS_MENU_KEYS.RESERVATIONS, translationKey: 'nav.reservations', path: '/business/real-estate/reservations' },
  { key: BUSINESS_MENU_KEYS.ADS, translationKey: 'nav.ads', path: '/business/real-estate/ads' },
  { key: BUSINESS_MENU_KEYS.STATS, translationKey: 'nav.analytics', path: '/business/real-estate/stats' },
  { key: BUSINESS_MENU_KEYS.CUSTOMERS, translationKey: 'nav.customers', path: '/business/real-estate/customers' },
  { key: BUSINESS_MENU_KEYS.SETTINGS, translationKey: 'nav.settings', path: '/business/real-estate/settings' }
];

export const deliveryMenu = [
  { key: BUSINESS_MENU_KEYS.DASHBOARD, translationKey: 'nav.dashboard', path: '/business/dashboard' },
  { key: BUSINESS_MENU_KEYS.MOVING_REQUESTS, translationKey: 'nav.movingRequests', path: '/business/moving-requests' },
  { key: BUSINESS_MENU_KEYS.DELIVERY_ORDERS, translationKey: 'nav.deliveryOrders', path: '/business/delivery-orders' },
  { key: BUSINESS_MENU_KEYS.SCHEDULE, translationKey: 'nav.schedule', path: '/business/schedule' },
  { key: BUSINESS_MENU_KEYS.STATS, translationKey: 'nav.analytics', path: '/business/stats' },
  { key: BUSINESS_MENU_KEYS.CUSTOMERS, translationKey: 'nav.customers', path: '/business/customers' },
  { key: BUSINESS_MENU_KEYS.SETTINGS, translationKey: 'nav.settings', path: '/business/settings' }
];

// Admin sees everything (merge without duplicates)
export const adminMenu = [
  // Real estate items
  { key: BUSINESS_MENU_KEYS.DASHBOARD, label: '대시보드', path: '/business/dashboard' },
  { key: BUSINESS_MENU_KEYS.CONTRACTS, label: '계약 내역', path: '/business/contracts' },
  { key: BUSINESS_MENU_KEYS.PROPERTIES, label: '매물 관리', path: '/business/properties' },
  { key: BUSINESS_MENU_KEYS.RESERVATIONS, label: '예약 관리', path: '/business/real-estate/reservations' }, // Added reservation menu for admin
  { key: BUSINESS_MENU_KEYS.ADS, label: '광고 / 프로모션', path: '/business/ads' },
  // Delivery items
  { key: BUSINESS_MENU_KEYS.MOVING_REQUESTS, label: '이사 / 견적 요청', path: '/business/moving-requests' },
  { key: BUSINESS_MENU_KEYS.DELIVERY_ORDERS, label: '배달 주문 관리', path: '/business/delivery-orders' },
  { key: BUSINESS_MENU_KEYS.SCHEDULE, label: '스케줄 / 차량 관리', path: '/business/schedule' },
  // Common items
  { key: BUSINESS_MENU_KEYS.STATS, label: '정산 / 통계', path: '/business/stats' },
  { key: BUSINESS_MENU_KEYS.CUSTOMERS, label: '고객 관리', path: '/business/customers' },
  { key: BUSINESS_MENU_KEYS.SETTINGS, label: '설정', path: '/business/settings' }
];