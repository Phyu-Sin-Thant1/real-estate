// Service Categories Store
// Manages service categories that admin creates and agencies use for packages

const STORAGE_KEY = 'service_categories';

// Initialize with mock data if empty
const initializeMockData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const mockCategories = [
      {
        id: 'cat-1',
        name: 'Home Delivery',
        nameKo: '홈 배송',
        description: 'Standard home delivery service for household items',
        descriptionKo: '가정용 표준 배송 서비스',
        basePrice: 120000,
        priceRange: {
          min: 100000,
          max: 200000
        },
        defaultLimitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 40,
          description: 'Up to 2 floors, 300kg'
        },
        allowedAddOns: [
          { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: 20000, unit: 'per floor', unitKo: '층당' },
          { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: 30000, unit: 'per item', unitKo: '개당' },
          { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: 10000, unit: 'per item', unitKo: '개당' }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'cat-2',
        name: 'Express Delivery',
        nameKo: '익스프레스 배송',
        description: 'Priority service for fast delivery',
        descriptionKo: '빠른 배송을 위한 우선 서비스',
        basePrice: 150000,
        priceRange: {
          min: 130000,
          max: 250000
        },
        defaultLimitations: {
          maxFloors: 2,
          maxWeight: 300,
          maxDistance: 30,
          description: 'Up to 2 floors, 300kg, priority service'
        },
        allowedAddOns: [
          { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: 25000, unit: 'per floor', unitKo: '층당' },
          { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: 35000, unit: 'per item', unitKo: '개당' },
          { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: 12000, unit: 'per item', unitKo: '개당' }
        ],
        isActive: true,
        createdAt: new Date('2024-01-02').toISOString(),
        updatedAt: new Date('2024-01-02').toISOString()
      },
      {
        id: 'cat-3',
        name: 'Office Relocation',
        nameKo: '사무실 이전',
        description: 'Complete office relocation service',
        descriptionKo: '완전한 사무실 이전 서비스',
        basePrice: 180000,
        priceRange: {
          min: 150000,
          max: 300000
        },
        defaultLimitations: {
          maxFloors: 4,
          maxWeight: 600,
          maxDistance: 60,
          description: 'Up to 4 floors, 600kg'
        },
        allowedAddOns: [
          { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: 25000, unit: 'per floor', unitKo: '층당' },
          { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: 40000, unit: 'per item', unitKo: '개당' },
          { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: 15000, unit: 'per item', unitKo: '개당' }
        ],
        isActive: true,
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-03').toISOString()
      },
      {
        id: 'cat-4',
        name: 'Standard Delivery',
        nameKo: '표준 배송',
        description: 'Standard delivery service with basic features',
        descriptionKo: '기본 기능을 갖춘 표준 배송 서비스',
        basePrice: 100000,
        priceRange: {
          min: 80000,
          max: 150000
        },
        defaultLimitations: {
          maxFloors: 2,
          maxWeight: 250,
          maxDistance: 50,
          description: 'Up to 2 floors, 250kg'
        },
        allowedAddOns: [
          { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: 20000, unit: 'per floor', unitKo: '층당' },
          { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: 30000, unit: 'per item', unitKo: '개당' },
          { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: 10000, unit: 'per item', unitKo: '개당' }
        ],
        isActive: true,
        createdAt: new Date('2024-01-04').toISOString(),
        updatedAt: new Date('2024-01-04').toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
    return mockCategories;
  }
  return JSON.parse(existing);
};

// Get all categories
export const getAllCategories = () => {
  const categories = localStorage.getItem(STORAGE_KEY);
  if (!categories) {
    return initializeMockData();
  }
  return JSON.parse(categories);
};

// Get active categories only
export const getActiveCategories = () => {
  return getAllCategories().filter(cat => cat.isActive);
};

// Get category by ID
export const getCategoryById = (id) => {
  const categories = getAllCategories();
  return categories.find(cat => cat.id === id);
};

// Create a new category
export const createCategory = (categoryData) => {
  const categories = getAllCategories();
  const newCategory = {
    id: `cat-${Date.now()}`,
    ...categoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  categories.push(newCategory);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  return newCategory;
};

// Update a category
export const updateCategory = (id, updates) => {
  const categories = getAllCategories();
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  return categories[index];
};

// Delete a category
export const deleteCategory = (id) => {
  const categories = getAllCategories();
  const filtered = categories.filter(cat => cat.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Toggle category active status
export const toggleCategoryStatus = (id) => {
  const categories = getAllCategories();
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  categories[index].isActive = !categories[index].isActive;
  categories[index].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  return categories[index];
};

// Validate package price against category price range
export const validatePackagePrice = (categoryId, price) => {
  const category = getCategoryById(categoryId);
  if (!category) {
    return { valid: false, message: 'Category not found' };
  }
  if (price < category.priceRange.min || price > category.priceRange.max) {
    return {
      valid: false,
      message: `Price must be between ₩${category.priceRange.min.toLocaleString()} and ₩${category.priceRange.max.toLocaleString()}`
    };
  }
  return { valid: true };
};

// Get packages count for a category
export const getPackagesCountForCategory = (categoryId) => {
  // This will be used with servicePackagesStore
  // For now, return 0 - will be implemented when integrating
  return 0;
};

// Initialize mock data on first load
if (typeof window !== 'undefined') {
  initializeMockData();
}



