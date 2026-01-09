// Service Packages Store for Delivery Agencies
// Manages service packages that agencies can create and manage

const STORAGE_KEY = 'service_packages';

// Initialize with mock data if empty
const initializeMockData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const mockPackages = [
      {
        id: 'pkg-1',
        agencyId: 'moving-agency-1',
        name: 'Home Delivery',
        nameKo: '홈 배송',
        description: 'Standard home delivery service for household items',
        descriptionKo: '가정용 표준 배송 서비스',
        price: 120000,
        serviceType: 'home-delivery',
        limitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 40,
          description: 'Up to 2 floors, 300kg'
        },
        addOns: [
          { id: 'addon-1', name: 'Extra Floors', nameKo: '추가 층', price: 20000, unit: 'per floor', unitKo: '층당' },
          { id: 'addon-2', name: 'Large Items', nameKo: '대형 물품', price: 30000, unit: 'per item', unitKo: '개당' },
          { id: 'addon-3', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: 10000, unit: 'per item', unitKo: '개당' }
        ],
        features: ['Careful handling', 'Insurance included', 'Tracking available'],
        isActive: true,
        status: 'APPROVED', // For existing mock data, mark as approved
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
        submittedAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 'pkg-2',
        agencyId: 'moving-agency-1',
        name: 'Express Delivery',
        nameKo: '익스프레스 배송',
        description: 'Priority service for fast delivery',
        descriptionKo: '빠른 배송을 위한 우선 서비스',
        price: 150000,
        serviceType: 'home-delivery',
        limitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 30,
          description: 'Up to 2 floors, 300kg, priority service'
        },
        addOns: [
          { id: 'addon-1', name: 'Extra Floors', nameKo: '추가 층', price: 25000, unit: 'per floor', unitKo: '층당' },
          { id: 'addon-2', name: 'Large Items', nameKo: '대형 물품', price: 35000, unit: 'per item', unitKo: '개당' },
          { id: 'addon-3', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: 12000, unit: 'per item', unitKo: '개당' }
        ],
        features: ['Same-day delivery', 'Priority handling', 'Real-time tracking'],
        isActive: true,
        status: 'APPROVED',
        createdAt: new Date('2024-01-16').toISOString(),
        updatedAt: new Date('2024-01-16').toISOString(),
        submittedAt: new Date('2024-01-16').toISOString()
      },
      {
        id: 'pkg-3',
        agencyId: 'moving-agency-1',
        name: 'Office Relocation',
        nameKo: '사무실 이전',
        description: 'Complete office relocation service',
        descriptionKo: '완전한 사무실 이전 서비스',
        price: 180000,
        serviceType: 'office-relocation',
        limitations: {
          maxFloors: 4,
          maxWeight: 600,
          maxDistance: 60,
          description: 'Up to 4 floors, 600kg'
        },
        addOns: [
          { id: 'addon-1', name: 'Extra Floors', nameKo: '추가 층', price: 25000, unit: 'per floor', unitKo: '층당' },
          { id: 'addon-2', name: 'Large Items', nameKo: '대형 물품', price: 40000, unit: 'per item', unitKo: '개당' },
          { id: 'addon-3', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: 15000, unit: 'per item', unitKo: '개당' }
        ],
        features: ['Weekend service available', 'IT equipment handling', 'Setup assistance'],
        isActive: true,
        status: 'APPROVED',
        createdAt: new Date('2024-01-17').toISOString(),
        updatedAt: new Date('2024-01-17').toISOString(),
        submittedAt: new Date('2024-01-17').toISOString()
      },
      {
        id: 'pkg-4',
        agencyId: 'moving-agency-2',
        name: 'Home Delivery',
        nameKo: '홈 배송',
        description: 'Standard home delivery service',
        descriptionKo: '표준 홈 배송 서비스',
        price: 125000,
        serviceType: 'home-delivery',
        limitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 40,
          description: 'Up to 2 floors, 300kg'
        },
        addOns: [
          { id: 'addon-1', name: 'Extra Floors', nameKo: '추가 층', price: 22000, unit: 'per floor', unitKo: '층당' },
          { id: 'addon-2', name: 'Large Items', nameKo: '대형 물품', price: 32000, unit: 'per item', unitKo: '개당' },
          { id: 'addon-3', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: 11000, unit: 'per item', unitKo: '개당' }
        ],
        features: ['Careful handling', 'Insurance included', 'Tracking available'],
        isActive: true,
        status: 'PENDING_APPROVAL', // Add one pending for testing
        createdAt: new Date('2024-01-18').toISOString(),
        updatedAt: new Date('2024-01-18').toISOString(),
        submittedAt: new Date('2024-01-18').toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPackages));
    return mockPackages;
  }
  return JSON.parse(existing);
};

// Get all packages
export const getAllPackages = () => {
  const packages = localStorage.getItem(STORAGE_KEY);
  if (!packages) {
    return initializeMockData();
  }
  return JSON.parse(packages);
};

// Get packages by agency
export const getPackagesByAgency = (agencyId) => {
  const packages = getAllPackages();
  return packages.filter(pkg => pkg.agencyId === agencyId);
};

// Get package by ID
export const getPackageById = (id) => {
  const packages = getAllPackages();
  return packages.find(pkg => pkg.id === id);
};

// Create a new package
export const createPackage = (packageData) => {
  const packages = getAllPackages();
  const now = new Date().toISOString();
  const newPackage = {
    id: `pkg-${Date.now()}`,
    ...packageData,
    status: packageData.status || 'PENDING_APPROVAL', // Default to pending approval
    createdAt: now,
    updatedAt: now,
    submittedAt: packageData.submittedAt || now
  };
  packages.push(newPackage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  return newPackage;
};

// Update a package
export const updatePackage = (id, updates) => {
  const packages = getAllPackages();
  const index = packages.findIndex(pkg => pkg.id === id);
  if (index === -1) {
    throw new Error('Package not found');
  }
  packages[index] = {
    ...packages[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  return packages[index];
};

// Delete a package
export const deletePackage = (id) => {
  const packages = getAllPackages();
  const filtered = packages.filter(pkg => pkg.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Get packages by service type
export const getPackagesByServiceType = (serviceType) => {
  const packages = getAllPackages();
  return packages.filter(pkg => pkg.serviceType === serviceType && pkg.isActive);
};

// Toggle package active status
export const togglePackageStatus = (id) => {
  const packages = getAllPackages();
  const index = packages.findIndex(pkg => pkg.id === id);
  if (index === -1) {
    throw new Error('Package not found');
  }
  packages[index].isActive = !packages[index].isActive;
  packages[index].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  return packages[index];
};

// Initialize mock data on first load
if (typeof window !== 'undefined') {
  initializeMockData();
}






