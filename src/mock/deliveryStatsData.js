// Mock data for Delivery Partner Dashboard - Statistics & Settlement

// KPI Data
export const kpis = {
  monthlySales: {
    value: 24500000,
    delta: 8.2,
    deltaType: 'positive'
  },
  pendingSettlement: {
    value: 3200000,
    delta: -2.1,
    deltaType: 'negative'
  },
  completedSettlement: {
    value: 18700000,
    delta: 12.5,
    deltaType: 'positive'
  },
  refundAmount: {
    value: 150000,
    delta: -5.3,
    deltaType: 'negative'
  }
};

// Daily Revenue Data (last 30 days)
export const dailyRevenue = [
  { date: '2025-11-15', amount: 780000 },
  { date: '2025-11-16', amount: 820000 },
  { date: '2025-11-17', amount: 910000 },
  { date: '2025-11-18', amount: 750000 },
  { date: '2025-11-19', amount: 890000 },
  { date: '2025-11-20', amount: 950000 },
  { date: '2025-11-21', amount: 870000 },
  { date: '2025-11-22', amount: 920000 },
  { date: '2025-11-23', amount: 880000 },
  { date: '2025-11-24', amount: 960000 },
  { date: '2025-11-25', amount: 1020000 },
  { date: '2025-11-26', amount: 980000 },
  { date: '2025-11-27', amount: 910000 },
  { date: '2025-11-28', amount: 870000 },
  { date: '2025-11-29', amount: 930000 },
  { date: '2025-11-30', amount: 990000 },
  { date: '2025-12-01', amount: 1050000 },
  { date: '2025-12-02', amount: 1120000 },
  { date: '2025-12-03', amount: 1080000 },
  { date: '2025-12-04', amount: 1150000 },
  { date: '2025-12-05', amount: 1210000 },
  { date: '2025-12-06', amount: 1180000 },
  { date: '2025-12-07', amount: 1250000 },
  { date: '2025-12-08', amount: 1320000 },
  { date: '2025-12-09', amount: 1280000 },
  { date: '2025-12-10', amount: 1350000 },
  { date: '2025-12-11', amount: 1410000 },
  { date: '2025-12-12', amount: 1380000 },
  { date: '2025-12-13', amount: 1450000 },
  { date: '2025-12-14', amount: 1520000 }
];

// Order Status Distribution
export const orderStatusDistribution = [
  { status: '신규', count: 12, percentage: 15 },
  { status: '연락 완료', count: 8, percentage: 10 },
  { status: '견적 발송', count: 15, percentage: 19 },
  { status: '배차 대기', count: 10, percentage: 12 },
  { status: '배차 완료', count: 18, percentage: 22 },
  { status: '배송 중', count: 11, percentage: 14 },
  { status: '배송 완료', count: 6, percentage: 8 }
];

// Settlement Data (8-12 rows)
export const settlements = [
  {
    id: 'SET-20251215-001',
    period: '2025-12-01 ~ 2025-12-15',
    orderCount: 42,
    totalAmount: 3200000,
    commission: 320000,
    settlementAmount: 2880000,
    status: '정산대기',
    breakdown: [
      { type: '이사 서비스', amount: 2100000, commission: 210000 },
      { type: '배달 서비스', amount: 1100000, commission: 110000 }
    ]
  },
  {
    id: 'SET-20251215-002',
    period: '2025-11-16 ~ 2025-11-30',
    orderCount: 38,
    totalAmount: 2950000,
    commission: 295000,
    settlementAmount: 2655000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 1900000, commission: 190000 },
      { type: '배달 서비스', amount: 1050000, commission: 105000 }
    ]
  },
  {
    id: 'SET-20251130-001',
    period: '2025-11-01 ~ 2025-11-15',
    orderCount: 45,
    totalAmount: 3420000,
    commission: 342000,
    settlementAmount: 3078000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 2200000, commission: 220000 },
      { type: '배달 서비스', amount: 1220000, commission: 122000 }
    ]
  },
  {
    id: 'SET-20251115-001',
    period: '2025-10-16 ~ 2025-10-31',
    orderCount: 36,
    totalAmount: 2780000,
    commission: 278000,
    settlementAmount: 2502000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 1800000, commission: 180000 },
      { type: '배달 서비스', amount: 980000, commission: 98000 }
    ]
  },
  {
    id: 'SET-20251031-001',
    period: '2025-10-01 ~ 2025-10-15',
    orderCount: 41,
    totalAmount: 3150000,
    commission: 315000,
    settlementAmount: 2835000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 2050000, commission: 205000 },
      { type: '배달 서비스', amount: 1100000, commission: 110000 }
    ]
  },
  {
    id: 'SET-20251015-001',
    period: '2025-09-16 ~ 2025-09-30',
    orderCount: 39,
    totalAmount: 2980000,
    commission: 298000,
    settlementAmount: 2682000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 1950000, commission: 195000 },
      { type: '배달 서비스', amount: 1030000, commission: 103000 }
    ]
  },
  {
    id: 'SET-20250930-001',
    period: '2025-09-01 ~ 2025-09-15',
    orderCount: 37,
    totalAmount: 2850000,
    commission: 285000,
    settlementAmount: 2565000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 1850000, commission: 185000 },
      { type: '배달 서비스', amount: 1000000, commission: 100000 }
    ]
  },
  {
    id: 'SET-20250915-001',
    period: '2025-08-16 ~ 2025-08-31',
    orderCount: 44,
    totalAmount: 3320000,
    commission: 332000,
    settlementAmount: 2988000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 2150000, commission: 215000 },
      { type: '배달 서비스', amount: 1170000, commission: 117000 }
    ]
  },
  {
    id: 'SET-20250831-001',
    period: '2025-08-01 ~ 2025-08-15',
    orderCount: 35,
    totalAmount: 2680000,
    commission: 268000,
    settlementAmount: 2412000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 1750000, commission: 175000 },
      { type: '배달 서비스', amount: 930000, commission: 93000 }
    ]
  },
  {
    id: 'SET-20250815-001',
    period: '2025-07-16 ~ 2025-07-31',
    orderCount: 40,
    totalAmount: 3050000,
    commission: 305000,
    settlementAmount: 2745000,
    status: '정산완료',
    breakdown: [
      { type: '이사 서비스', amount: 2000000, commission: 200000 },
      { type: '배달 서비스', amount: 1050000, commission: 105000 }
    ]
  }
];