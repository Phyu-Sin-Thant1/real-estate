// Mock delivery service data

export const deliveryServiceTypes = [
  {
    id: 'home-delivery',
    name: 'Home Delivery',
    icon: '🏠',
    description: 'For families and personal relocation',
    color: 'from-blue-400 to-blue-600',
    shortDescription: 'Complete home relocation services for families and individuals'
  },
  {
    id: 'office-relocation',
    name: 'Office Relocation',
    icon: '🏢',
    description: 'For business space moves',
    color: 'from-purple-400 to-purple-600',
    shortDescription: 'Professional office and business relocation services'
  },
  {
    id: 'packing-moving',
    name: 'Packing & Moving',
    icon: '📦',
    description: 'Full service packing and moving',
    color: 'from-orange-400 to-orange-600',
    shortDescription: 'Complete packing and moving solutions with professional handling'
  },
  {
    id: 'international-delivery',
    name: 'International Delivery',
    icon: '🌎',
    description: 'For overseas moves',
    color: 'from-green-400 to-green-600',
    shortDescription: 'International relocation and shipping services worldwide'
  },
  {
    id: 'warehouse-delivery',
    name: 'Warehouse Delivery',
    icon: '🏭',
    description: 'Specialized warehouse delivery',
    color: 'from-red-400 to-red-600',
    shortDescription: 'Specialized delivery services for warehouses and storage facilities'
  },
  {
    id: 'storage-moving',
    name: '보관 이사',
    icon: '🗄️',
    description: 'Storage and temporary moving services',
    color: 'from-amber-400 to-amber-600',
    shortDescription: 'Storage and temporary moving services with flexible storage options'
  },
  {
    id: 'studio-moving',
    name: '원룸 이사',
    icon: '🛏️',
    description: 'Studio and one-room moving services',
    color: 'from-teal-400 to-teal-600',
    shortDescription: 'Affordable moving services for studios and one-room apartments'
  },
  {
    id: 'home-moving',
    name: '가정 이사',
    icon: '🏡',
    description: 'Comprehensive home moving services',
    color: 'from-blue-500 to-indigo-600',
    shortDescription: 'Complete home moving services for families with full packing and unpacking'
  },
  {
    id: 'same-day-moving',
    name: '당일 이사',
    icon: '⚡',
    description: 'Express same-day moving services',
    color: 'from-yellow-400 to-orange-500',
    shortDescription: 'Fast same-day moving services for urgent relocations'
  },
  {
    id: 'long-distance-moving',
    name: '장거리 이사',
    icon: '🚛',
    description: 'Long-distance moving services',
    color: 'from-cyan-400 to-blue-600',
    shortDescription: 'Long-distance moving services for intercity and interstate relocations'
  },
  {
    id: 'short-distance-moving',
    name: '단거리 이사',
    icon: '🚚',
    description: 'Short-distance local moving services',
    color: 'from-emerald-400 to-green-600',
    shortDescription: 'Affordable local moving services for nearby relocations'
  },
  {
    id: 'special-items-moving',
    name: '피아노/특수물품 이사',
    icon: '🎹',
    description: 'Specialized moving for heavy and delicate items',
    color: 'from-pink-400 to-rose-600',
    shortDescription: 'Professional moving services for pianos, antiques, and special items'
  },
  {
    id: 'furniture-moving',
    name: '가구 이사',
    icon: '🪑',
    description: 'Furniture-only moving services',
    color: 'from-violet-400 to-purple-600',
    shortDescription: 'Specialized furniture moving and delivery services'
  }
];

export const deliveryServices = [
  // Prime Movers Services
  {
    id: 'service-1',
    agencyId: 'moving-agency-1',
    serviceType: 'home-delivery',
    name: 'Standard Home Delivery',
    price: 'From ₩50,000',
    description: 'Standard delivery service for household items with careful handling',
    features: ['Careful handling', 'Insurance included', 'Tracking available'],
    estimatedTime: '3-5 business days',
    minPrice: 50000,
    limitations: {
      maxFloors: 2,
      maxWeight: 300,
      maxDistance: 40,
      description: 'This service covers up to 2 floors and up to 300kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-2',
    agencyId: 'moving-agency-1',
    serviceType: 'home-delivery',
    name: 'Express Home Delivery',
    price: 'From ₩80,000',
    description: 'Fastest delivery option for urgent home relocations',
    features: ['Same-day delivery', 'Priority handling', 'Real-time tracking'],
    estimatedTime: '1-2 business days',
    minPrice: 80000,
    limitations: {
      maxFloors: 2,
      maxWeight: 300,
      maxDistance: 30,
      description: 'This express service covers up to 2 floors and up to 300kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 25000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 35000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 12000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-3',
    agencyId: 'moving-agency-1',
    serviceType: 'office-relocation',
    name: 'Office Relocation Service',
    price: 'From ₩200,000',
    description: 'Complete office relocation with minimal downtime',
    features: ['Weekend service available', 'IT equipment handling', 'Setup assistance'],
    estimatedTime: '5-7 business days',
    minPrice: 200000,
    limitations: {
      maxFloors: 4,
      maxWeight: 600,
      maxDistance: 60,
      description: 'This service covers up to 4 floors and up to 600kg of office furniture. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 25000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 40000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-4',
    agencyId: 'moving-agency-1',
    serviceType: 'packing-moving',
    name: 'Full Packing & Moving',
    price: 'From ₩150,000',
    description: 'Complete packing and moving service with professional packers',
    features: ['Professional packing', 'Fragile item handling', 'Unpacking service'],
    estimatedTime: '4-6 business days',
    minPrice: 150000,
    limitations: {
      maxFloors: 3,
      maxWeight: 500, // kg
      maxDistance: 50, // km for local service
      description: 'This service covers up to 3 floors and up to 500kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Quick Transport Services
  {
    id: 'service-5',
    agencyId: 'moving-agency-2',
    serviceType: 'home-delivery',
    name: 'Quick Home Delivery',
    price: 'From ₩60,000',
    description: 'Fast and efficient home delivery service',
    features: ['Quick turnaround', 'Flexible scheduling', 'Online tracking'],
    estimatedTime: '2-3 business days',
    minPrice: 60000,
    limitations: {
      maxFloors: 2,
      maxWeight: 300,
      maxDistance: 40,
      description: 'This service covers up to 2 floors and up to 300kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-6',
    agencyId: 'moving-agency-2',
    serviceType: 'home-delivery',
    name: 'Premium Home Delivery',
    price: 'From ₩100,000',
    description: 'Premium service with white-glove treatment',
    features: ['Premium handling', 'Assembly service', 'Cleaning service'],
    estimatedTime: '2-4 business days',
    minPrice: 100000,
    limitations: {
      maxFloors: 3,
      maxWeight: 400,
      maxDistance: 50,
      description: 'This premium service covers up to 3 floors and up to 400kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 25000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 35000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-7',
    agencyId: 'moving-agency-2',
    serviceType: 'packing-moving',
    name: 'Express Packing & Moving',
    price: 'From ₩180,000',
    description: 'Fast packing and moving for urgent relocations',
    features: ['24/7 service', 'Express handling', 'Priority support'],
    estimatedTime: '2-3 business days',
    minPrice: 180000,
    limitations: {
      maxFloors: 2,
      maxWeight: 400,
      maxDistance: 30,
      description: 'This express service covers up to 2 floors and up to 400kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 25000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 35000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 12000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-8',
    agencyId: 'moving-agency-2',
    serviceType: 'international-delivery',
    name: 'International Shipping',
    price: 'From ₩500,000',
    description: 'International shipping and relocation services',
    features: ['Customs handling', 'Documentation support', 'Global tracking'],
    estimatedTime: '10-15 business days',
    minPrice: 500000,
    limitations: {
      maxWeight: 1000,
      maxDistance: 0, // International - no distance limit
      description: 'This international service covers up to 1000kg of items. Additional weight or special handling will incur extra fees.'
    },
    extraOptions: {
      largeItems: { price: 50000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 20000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Global Movers Services
  {
    id: 'service-9',
    agencyId: 'moving-agency-3',
    serviceType: 'home-delivery',
    name: 'Luxury Home Delivery',
    price: 'From ₩120,000',
    description: 'Premium home delivery for high-value items',
    features: ['Luxury handling', 'Climate control', 'Security escort'],
    estimatedTime: '3-5 business days',
    minPrice: 120000,
    limitations: {
      maxFloors: 3,
      maxWeight: 400,
      maxDistance: 50,
      description: 'This luxury service covers up to 3 floors and up to 400kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 30000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 40000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 20000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-10',
    agencyId: 'moving-agency-3',
    serviceType: 'office-relocation',
    name: 'Corporate Relocation',
    price: 'From ₩300,000',
    description: 'Enterprise-level office relocation services',
    features: ['Project management', 'Minimal downtime', 'Employee assistance'],
    estimatedTime: '7-10 business days',
    minPrice: 300000,
    limitations: {
      maxFloors: 5,
      maxWeight: 800,
      maxDistance: 80,
      description: 'This corporate service covers up to 5 floors and up to 800kg of office furniture. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 30000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 50000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 20000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-11',
    agencyId: 'moving-agency-3',
    serviceType: 'warehouse-delivery',
    name: 'Warehouse Distribution',
    price: 'From ₩250,000',
    description: 'Specialized warehouse delivery and distribution',
    features: ['Bulk handling', 'Inventory management', 'Distribution network'],
    estimatedTime: '5-7 business days',
    minPrice: 250000,
    limitations: {
      maxWeight: 2000,
      maxDistance: 100,
      description: 'This warehouse service covers up to 2000kg of items within 100km. Additional weight or distance will incur extra fees.'
    },
    extraOptions: {
      largeItems: { price: 40000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  // Friendly Movers Services
  {
    id: 'service-13',
    agencyId: 'moving-agency-4',
    serviceType: 'home-delivery',
    name: 'Budget Home Delivery',
    price: 'From ₩40,000',
    description: 'Affordable home delivery service',
    features: ['Budget-friendly', 'Reliable service', 'Basic insurance'],
    estimatedTime: '4-6 business days',
    minPrice: 40000,
    limitations: {
      maxFloors: 2,
      maxWeight: 250,
      maxDistance: 30,
      description: 'This budget service covers up to 2 floors and up to 250kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 15000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 25000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 8000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-14',
    agencyId: 'moving-agency-4',
    serviceType: 'packing-moving',
    name: 'Standard Packing & Moving',
    price: 'From ₩120,000',
    description: 'Standard packing and moving service',
    features: ['Professional service', 'Careful handling', 'Tracking included'],
    estimatedTime: '5-7 business days',
    minPrice: 120000,
    limitations: {
      maxFloors: 3,
      maxWeight: 500,
      maxDistance: 50,
      description: 'This standard service covers up to 3 floors and up to 500kg of items. Additional floors or heavy items will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Storage Moving Services
  {
    id: 'service-15',
    agencyId: 'moving-agency-1',
    serviceType: 'storage-moving',
    name: '보관 이사 서비스',
    price: 'From ₩80,000',
    description: '임시 보관이 필요한 이사 서비스로, 보관소에 일시 보관 후 배송 가능합니다',
    features: ['Temporary storage', 'Flexible delivery', 'Secure storage', 'Monthly storage option'],
    estimatedTime: '3-5 business days',
    minPrice: 80000,
    limitations: {
      maxFloors: 2,
      maxWeight: 400,
      maxDistance: 50,
      maxStorageMonths: 6,
      description: 'This storage moving service covers up to 2 floors and up to 400kg of items. Storage available for up to 6 months. Additional floors or extended storage will incur extra fees.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-16',
    agencyId: 'moving-agency-2',
    serviceType: 'storage-moving',
    name: '프리미엄 보관 이사',
    price: 'From ₩120,000',
    description: '프리미엄 보관 시설을 이용한 고급 보관 이사 서비스',
    features: ['Premium storage', 'Climate control', 'Insurance included', 'Long-term storage'],
    estimatedTime: '2-4 business days',
    minPrice: 120000,
    limitations: {
      maxFloors: 3,
      maxWeight: 500,
      maxDistance: 60,
      maxStorageMonths: 12,
      description: 'This premium storage service covers up to 3 floors and up to 500kg of items. Storage available for up to 12 months with climate control.'
    },
    extraOptions: {
      extraFloors: { price: 25000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 35000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Studio Moving Services
  {
    id: 'service-17',
    agencyId: 'moving-agency-1',
    serviceType: 'studio-moving',
    name: '원룸 이사 서비스',
    price: 'From ₩40,000',
    description: '원룸 전용 저렴한 이사 서비스로, 소량의 짐을 빠르고 안전하게 이동합니다',
    features: ['Budget-friendly', 'Quick service', 'Small items handling', 'Same-day available'],
    estimatedTime: '1-3 business days',
    minPrice: 40000,
    limitations: {
      maxFloors: 2,
      maxWeight: 200,
      maxDistance: 30,
      description: 'This studio moving service covers up to 2 floors and up to 200kg of items. Perfect for studio apartments with minimal furniture.'
    },
    extraOptions: {
      extraFloors: { price: 15000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 25000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 8000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-18',
    agencyId: 'moving-agency-4',
    serviceType: 'studio-moving',
    name: '익스프레스 원룸 이사',
    price: 'From ₩60,000',
    description: '원룸 이사를 위한 빠른 당일 서비스',
    features: ['Same-day service', 'Express handling', 'Quick turnaround', 'Priority booking'],
    estimatedTime: 'Same day',
    minPrice: 60000,
    limitations: {
      maxFloors: 2,
      maxWeight: 250,
      maxDistance: 25,
      description: 'This express studio service covers up to 2 floors and up to 250kg of items. Same-day service available for urgent moves.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-19',
    agencyId: 'moving-agency-2',
    serviceType: 'studio-moving',
    name: '스마트 원룸 이사',
    price: 'From ₩55,000',
    description: '원룸 이사를 위한 스마트한 포장 및 이동 서비스',
    features: ['Smart packing', 'Efficient loading', 'Online tracking', 'Weekend service'],
    estimatedTime: '2-3 business days',
    minPrice: 55000,
    limitations: {
      maxFloors: 2,
      maxWeight: 220,
      maxDistance: 35,
      description: 'This smart studio service covers up to 2 floors and up to 220kg of items. Includes professional packing for studio moves.'
    },
    extraOptions: {
      extraFloors: { price: 18000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 28000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 9000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Home Moving Services (가정 이사)
  {
    id: 'service-20',
    agencyId: 'moving-agency-1',
    serviceType: 'home-moving',
    name: '가정 이사 서비스',
    price: 'From ₩150,000',
    description: '가족 단위의 종합 이사 서비스로 포장, 이동, 정리를 포함한 완전한 이사 솔루션',
    features: ['Full packing service', 'Unpacking service', 'Furniture assembly', 'Cleaning service'],
    estimatedTime: '4-6 business days',
    minPrice: 150000,
    limitations: {
      maxFloors: 3,
      maxWeight: 600,
      maxDistance: 50,
      description: 'This home moving service covers up to 3 floors and up to 600kg of household items. Includes full packing and unpacking services.'
    },
    extraOptions: {
      extraFloors: { price: 25000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 35000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-21',
    agencyId: 'moving-agency-2',
    serviceType: 'home-moving',
    name: '프리미엄 가정 이사',
    price: 'From ₩200,000',
    description: '프리미엄 가정 이사 서비스로 고급 포장재와 전문 정리 서비스 포함',
    features: ['Premium packing materials', 'Professional organizing', 'White glove service', 'Insurance coverage'],
    estimatedTime: '3-5 business days',
    minPrice: 200000,
    limitations: {
      maxFloors: 4,
      maxWeight: 800,
      maxDistance: 60,
      description: 'This premium home moving service covers up to 4 floors and up to 800kg. Includes premium packing materials and professional organizing.'
    },
    extraOptions: {
      extraFloors: { price: 30000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 40000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 20000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Same-Day Moving Services (당일 이사)
  {
    id: 'service-22',
    agencyId: 'moving-agency-1',
    serviceType: 'same-day-moving',
    name: '당일 이사 서비스',
    price: 'From ₩100,000',
    description: '급하게 필요한 당일 이사 서비스로 빠른 이동이 가능합니다',
    features: ['Same-day service', 'Quick response', 'Fast loading', 'Priority handling'],
    estimatedTime: 'Same day',
    minPrice: 100000,
    limitations: {
      maxFloors: 2,
      maxWeight: 300,
      maxDistance: 20,
      description: 'This same-day service covers up to 2 floors and up to 300kg. Available for urgent moves within the same day.'
    },
    extraOptions: {
      extraFloors: { price: 30000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 40000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-23',
    agencyId: 'moving-agency-4',
    serviceType: 'same-day-moving',
    name: '익스프레스 당일 이사',
    price: 'From ₩120,000',
    description: '초고속 당일 이사 서비스로 3시간 내 완료 가능',
    features: ['3-hour service', 'Express handling', 'Dedicated team', 'Rush delivery'],
    estimatedTime: '3 hours',
    minPrice: 120000,
    limitations: {
      maxFloors: 2,
      maxWeight: 250,
      maxDistance: 15,
      description: 'This express same-day service covers up to 2 floors and up to 250kg. Can be completed within 3 hours.'
    },
    extraOptions: {
      extraFloors: { price: 35000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 45000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 20000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Long-Distance Moving Services (장거리 이사)
  {
    id: 'service-24',
    agencyId: 'moving-agency-2',
    serviceType: 'long-distance-moving',
    name: '장거리 이사 서비스',
    price: 'From ₩300,000',
    description: '도시 간 장거리 이사 서비스로 안전한 장거리 운송을 제공합니다',
    features: ['Long-distance transport', 'Secure loading', 'GPS tracking', 'Multi-day service'],
    estimatedTime: '3-7 business days',
    minPrice: 300000,
    limitations: {
      maxFloors: 3,
      maxWeight: 1000,
      maxDistance: 500,
      description: 'This long-distance service covers up to 3 floors and up to 1000kg. Suitable for intercity moves up to 500km.'
    },
    extraOptions: {
      extraFloors: { price: 30000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 50000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 25000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-25',
    agencyId: 'moving-agency-3',
    serviceType: 'long-distance-moving',
    name: '프리미엄 장거리 이사',
    price: 'From ₩400,000',
    description: '프리미엄 장거리 이사 서비스로 전국 어디든 안전하게 이동',
    features: ['Nationwide service', 'Climate-controlled transport', 'Full insurance', 'Door-to-door service'],
    estimatedTime: '5-10 business days',
    minPrice: 400000,
    limitations: {
      maxFloors: 4,
      maxWeight: 1500,
      maxDistance: 1000,
      description: 'This premium long-distance service covers up to 4 floors and up to 1500kg. Available for nationwide moves with climate-controlled transport.'
    },
    extraOptions: {
      extraFloors: { price: 35000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 60000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 30000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Short-Distance Moving Services (단거리 이사)
  {
    id: 'service-26',
    agencyId: 'moving-agency-1',
    serviceType: 'short-distance-moving',
    name: '단거리 이사 서비스',
    price: 'From ₩60,000',
    description: '근거리 이사 서비스로 저렴하고 빠른 이동이 가능합니다',
    features: ['Local service', 'Affordable pricing', 'Quick service', 'Small truck'],
    estimatedTime: '1-2 business days',
    minPrice: 60000,
    limitations: {
      maxFloors: 2,
      maxWeight: 300,
      maxDistance: 10,
      description: 'This short-distance service covers up to 2 floors and up to 300kg. Perfect for local moves within 10km.'
    },
    extraOptions: {
      extraFloors: { price: 15000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 25000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 8000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  {
    id: 'service-27',
    agencyId: 'moving-agency-4',
    serviceType: 'short-distance-moving',
    name: '경제형 단거리 이사',
    price: 'From ₩50,000',
    description: '가장 저렴한 단거리 이사 서비스로 소량의 짐 이동에 적합',
    features: ['Budget-friendly', 'Basic service', 'Self-packing option', 'Flexible timing'],
    estimatedTime: '1-2 business days',
    minPrice: 50000,
    limitations: {
      maxFloors: 1,
      maxWeight: 200,
      maxDistance: 5,
      description: 'This budget short-distance service covers up to 1 floor and up to 200kg. Perfect for minimal moves within 5km.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Items' },
      fragileHandling: { price: 10000, unit: 'per item', label: 'Fragile Handling' }
    }
  },
  
  // Special Items Moving Services (피아노/특수물품 이사)
  {
    id: 'service-28',
    agencyId: 'moving-agency-2',
    serviceType: 'special-items-moving',
    name: '피아노 이사 서비스',
    price: 'From ₩200,000',
    description: '피아노 전용 전문 이사 서비스로 전문 장비와 기술로 안전하게 이동',
    features: ['Piano specialists', 'Special equipment', 'Careful handling', 'Insurance included'],
    estimatedTime: '2-3 business days',
    minPrice: 200000,
    limitations: {
      maxFloors: 3,
      maxWeight: 500,
      maxDistance: 50,
      description: 'This piano moving service covers up to 3 floors. Includes specialized equipment and professional piano movers.'
    },
    extraOptions: {
      extraFloors: { price: 50000, unit: 'per floor', label: 'Extra Floors' },
      fragileHandling: { price: 30000, unit: 'per item', label: 'Extra Care' }
    }
  },
  {
    id: 'service-29',
    agencyId: 'moving-agency-3',
    serviceType: 'special-items-moving',
    name: '특수물품 이사 서비스',
    price: 'From ₩150,000',
    description: '골동품, 예술품 등 특수물품 전용 이사 서비스',
    features: ['Antique specialists', 'Art handling', 'Climate control', 'White glove service'],
    estimatedTime: '3-5 business days',
    minPrice: 150000,
    limitations: {
      maxFloors: 2,
      maxWeight: 300,
      maxDistance: 40,
      description: 'This special items service covers up to 2 floors and up to 300kg. Specialized handling for antiques and artwork.'
    },
    extraOptions: {
      extraFloors: { price: 40000, unit: 'per floor', label: 'Extra Floors' },
      fragileHandling: { price: 25000, unit: 'per item', label: 'Extra Care' }
    }
  },
  
  // Furniture Moving Services (가구 이사)
  {
    id: 'service-30',
    agencyId: 'moving-agency-1',
    serviceType: 'furniture-moving',
    name: '가구 이사 서비스',
    price: 'From ₩80,000',
    description: '가구만 전문적으로 이동하는 서비스로 가구 보호에 특화',
    features: ['Furniture protection', 'Disassembly service', 'Assembly service', 'Careful handling'],
    estimatedTime: '2-4 business days',
    minPrice: 80000,
    limitations: {
      maxFloors: 3,
      maxWeight: 500,
      maxDistance: 40,
      description: 'This furniture moving service covers up to 3 floors and up to 500kg of furniture. Includes disassembly and assembly.'
    },
    extraOptions: {
      extraFloors: { price: 20000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 30000, unit: 'per item', label: 'Large Furniture' },
      fragileHandling: { price: 15000, unit: 'per item', label: 'Extra Protection' }
    }
  },
  {
    id: 'service-31',
    agencyId: 'moving-agency-4',
    serviceType: 'furniture-moving',
    name: '가구 배송 서비스',
    price: 'From ₩70,000',
    description: '새 가구 배송 및 설치 서비스',
    features: ['New furniture delivery', 'Installation service', 'Packaging removal', 'Waste disposal'],
    estimatedTime: '1-3 business days',
    minPrice: 70000,
    limitations: {
      maxFloors: 2,
      maxWeight: 400,
      maxDistance: 30,
      description: 'This furniture delivery service covers up to 2 floors and up to 400kg. Includes installation and packaging removal.'
    },
    extraOptions: {
      extraFloors: { price: 18000, unit: 'per floor', label: 'Extra Floors' },
      largeItems: { price: 28000, unit: 'per item', label: 'Large Furniture' },
      fragileHandling: { price: 12000, unit: 'per item', label: 'Extra Protection' }
    }
  }
];

// Helper functions
export const getServiceTypeById = (id) => {
  return deliveryServiceTypes.find(type => type.id === id) || null;
};

export const getServicesByType = (serviceTypeId) => {
  return deliveryServices.filter(service => service.serviceType === serviceTypeId);
};

export const getServicesByAgency = (agencyId) => {
  return deliveryServices.filter(service => service.agencyId === agencyId);
};

export const getServicesByTypeAndAgency = (serviceTypeId, agencyId) => {
  if (!serviceTypeId && !agencyId) return deliveryServices;
  if (!serviceTypeId) return getServicesByAgency(agencyId);
  if (!agencyId) return getServicesByType(serviceTypeId);
  return deliveryServices.filter(
    service => service.serviceType === serviceTypeId && service.agencyId === agencyId
  );
};

export const getServiceById = (id) => {
  return deliveryServices.find(service => service.id === id) || null;
};

export const getMinPriceForServiceType = (serviceTypeId) => {
  const services = getServicesByType(serviceTypeId);
  if (services.length === 0) return null;
  const prices = services.map(s => s.minPrice).filter(p => p > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
};

