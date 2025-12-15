// Mock data for Delivery Partner Settings
// Initialize from localStorage if present; otherwise use defaults

const DEFAULT_SETTINGS = {
  // A) 업체 정보 (Company Profile)
  companyProfile: {
    companyName: 'TOFU 배송 서비스',
    representativeName: '홍길동',
    contact: '02-1234-5678',
    email: 'info@tofudelivery.com',
    businessAddress: '서울특별시 강남구 테헤란로 123 TOFU 빌딩'
  },
  
  // B) 정산 정보 (Settlement Preferences)
  settlementPreferences: {
    settlementMethod: '계좌이체', // '계좌이체' or '카드정산'
    bankName: '국민은행',
    accountNumber: '123456-78-123456',
    accountHolder: '홍길동',
    settlementCycle: '월간', // '주간' or '월간'
    taxInvoiceIssuance: true
  },
  
  // C) 알림 설정 (Notifications)
  notificationSettings: {
    newOrderAlert: true,
    dispatchRequestAlert: true,
    deliveryDelayAlert: false,
    settlementCompleteAlert: true,
    channels: {
      email: true,
      sms: true,
      appNotification: true
    }
  },
  
  // D) 운영 설정 (Operations)
  operationSettings: {
    defaultDispatchMode: '자동', // '자동' or '수동'
    delayThreshold: 15, // minutes
    workingHours: {
      startTime: '09:00',
      endTime: '18:00'
    }
  }
};

// Load settings from localStorage or use defaults
export const loadDeliverySettings = () => {
  try {
    const savedSettings = localStorage.getItem('delivery-settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

// Save settings to localStorage
export const saveDeliverySettings = (settings) => {
  try {
    localStorage.setItem('delivery-settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

// Export default settings
export default DEFAULT_SETTINGS;