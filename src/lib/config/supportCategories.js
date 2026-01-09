// Support ticket domain and category configuration
// Each category has an isComplaint flag to determine if reference is required

export const supportDomains = [
  { value: 'DELIVERY', label: '딜리버리' },
  { value: 'REAL_ESTATE', label: '부동산' },
  { value: 'PAYMENT', label: '결제' },
  { value: 'ACCOUNT', label: '계정' },
  { value: 'BUG_REPORT', label: '버그 신고' },
  { value: 'ETC', label: '기타' }
];

export const supportCategories = {
  DELIVERY: [
    // Complaint categories
    { value: 'DELAY', label: '배송 지연', isComplaint: true },
    { value: 'DAMAGED_ITEM', label: '물품 손상', isComplaint: true },
    { value: 'WRONG_OR_MISSING', label: '잘못된 배송 / 누락', isComplaint: true },
    { value: 'DRIVER_OR_STAFF_BEHAVIOR', label: '기사/직원 행동', isComplaint: true },
    { value: 'PRICE_DISPUTE', label: '가격 분쟁', isComplaint: true },
    // Inquiry categories
    { value: 'PRICING_QUESTION', label: '가격 문의', isComplaint: false },
    { value: 'SERVICE_USAGE_HELP', label: '서비스 사용 도움', isComplaint: false },
    { value: 'GENERAL', label: '일반 문의', isComplaint: false }
  ],
  REAL_ESTATE: [
    // Complaint categories
    { value: 'LISTING_MISMATCH', label: '매물 정보 불일치', isComplaint: true },
    { value: 'AGENT_BEHAVIOR', label: '중개사 행동', isComplaint: true },
    { value: 'BOOKING_ISSUE', label: '예약 문제', isComplaint: true },
    { value: 'PRICE_DISPUTE', label: '가격 분쟁', isComplaint: true },
    // Inquiry categories
    { value: 'PRICING_QUESTION', label: '가격 문의', isComplaint: false },
    { value: 'SERVICE_USAGE_HELP', label: '서비스 사용 도움', isComplaint: false },
    { value: 'GENERAL', label: '일반 문의', isComplaint: false }
  ],
  PAYMENT: [
    // Complaint categories
    { value: 'CHARGED_BUT_FAILED', label: '결제되었으나 실패', isComplaint: true },
    { value: 'REFUND_REQUEST', label: '환불 요청', isComplaint: true },
    // Inquiry categories
    { value: 'RECEIPT', label: '영수증 문의', isComplaint: false },
    { value: 'GENERAL', label: '일반 문의', isComplaint: false }
  ],
  ACCOUNT: [
    { value: 'LOGIN_ISSUE', label: '로그인 문제', isComplaint: false },
    { value: 'VERIFICATION', label: '인증 문제', isComplaint: false },
    { value: 'PROFILE_UPDATE', label: '프로필 업데이트', isComplaint: false },
    { value: 'GENERAL', label: '일반 문의', isComplaint: false }
  ],
  BUG_REPORT: [
    { value: 'UI_BROKEN', label: 'UI 오류', isComplaint: false },
    { value: 'FEATURE_NOT_WORKING', label: '기능 미작동', isComplaint: false },
    { value: 'CRASH', label: '앱 크래시', isComplaint: false },
    { value: 'GENERAL', label: '일반 문의', isComplaint: false }
  ],
  ETC: [
    { value: 'GENERAL', label: '일반 문의', isComplaint: false }
  ]
};

export const getCategoriesForDomain = (domain) => {
  return supportCategories[domain] || [];
};

export const isComplaintCategory = (domain, category) => {
  const categories = supportCategories[domain] || [];
  const cat = categories.find(c => c.value === category);
  return cat ? cat.isComplaint : false;
};

export const getReferenceTypeForDomain = (domain) => {
  switch (domain) {
    case 'DELIVERY':
      return 'ORDER';
    case 'REAL_ESTATE':
      return null; // Can be PROPERTY or CONTRACT
    case 'PAYMENT':
      return 'PAYMENT';
    default:
      return null;
  }
};
