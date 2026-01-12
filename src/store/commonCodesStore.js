// Common Code store - manages unified category codes for Real-Estate and Delivery
const STORAGE_KEY = 'tofu-common-codes';

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
 * Initialize with seed data if empty
 * Creates two fixed parent categories: 100 (Real-Estate) and 200 (Delivery)
 */
const initializeSeedData = () => {
  const existing = safeRead(STORAGE_KEY, []);
  if (existing.length > 0) return existing;

  const now = new Date().toISOString();
  
  // Create two fixed parent categories with numeric codes
  const realEstateParent = {
    id: 'cc-100',
    code: '100',
    name: 'Real-Estate',
    parentCode: null,
    sortOrder: 1,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const deliveryParent = {
    id: 'cc-200',
    code: '200',
    name: 'Delivery',
    parentCode: null,
    sortOrder: 2,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  // Create Real-Estate sub-categories (100-01, 100-02, etc.)
  const realEstateChildren = [
    {
      id: 'cc-100-01',
      code: '100-01',
      name: 'One-room',
      parentCode: '100',
      sortOrder: 10,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cc-100-02',
      code: '100-02',
      name: 'Apartment',
      parentCode: '100',
      sortOrder: 20,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cc-100-03',
      code: '100-03',
      name: 'Villa',
      parentCode: '100',
      sortOrder: 30,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Create Delivery sub-categories (200-01, 200-02, etc.)
  const deliveryChildren = [
    {
      id: 'cc-200-01',
      code: '200-01',
      name: 'Office Moving',
      parentCode: '200',
      sortOrder: 10,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cc-200-02',
      code: '200-02',
      name: 'One-room Moving',
      parentCode: '200',
      sortOrder: 20,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cc-200-03',
      code: '200-03',
      name: 'Overboard',
      parentCode: '200',
      sortOrder: 30,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const seedData = [
    realEstateParent,
    deliveryParent,
    ...realEstateChildren,
    ...deliveryChildren,
  ];

  safeWrite(STORAGE_KEY, seedData);
  return seedData;
};

/**
 * Get all common codes
 * @param {Object} filters - Optional filters
 * @param {string} filters.parentCode - Filter by parent code ("100" or "200")
 * @param {boolean} filters.isActive - Filter by active status
 * @param {string} filters.q - Search query (name or code)
 * @returns {Array} Array of common code objects
 */
export const getCommonCodes = (filters = {}) => {
  let codes = safeRead(STORAGE_KEY, []);
  
  // Initialize seed data if empty
  if (codes.length === 0) {
    codes = initializeSeedData();
  } else {
    // Ensure parent codes exist (in case they were deleted)
    const realEstateParent = codes.find((c) => c.code === '100' && c.parentCode === null);
    const deliveryParent = codes.find((c) => c.code === '200' && c.parentCode === null);
    
    if (!realEstateParent || !deliveryParent) {
      // Re-initialize if parents are missing
      codes = initializeSeedData();
    }
  }

  // Apply filters
  if (filters.parentCode) {
    // Filter by parentCode directly
    codes = codes.filter((c) => c.parentCode === filters.parentCode);
  }

  if (filters.isActive !== undefined) {
    codes = codes.filter((c) => c.isActive === filters.isActive);
  }

  if (filters.q) {
    const query = filters.q.toLowerCase();
    codes = codes.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }

  // Exclude parent rows from results (only return sub-categories)
  codes = codes.filter((c) => c.parentCode !== null);

  // Sort by sortOrder, then by code
  return codes.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.code.localeCompare(b.code);
  });
};

/**
 * Get common code by ID
 * @param {string} id - Code ID
 * @returns {Object|null} Common code object or null
 */
export const getCommonCodeById = (id) => {
  const codes = safeRead(STORAGE_KEY, []);
  return codes.find((c) => c.id === id) || null;
};

/**
 * Get parent by code ("100" or "200")
 * @param {string} parentCode - Parent code ("100" or "200")
 * @returns {Object|null} Parent code or null
 */
export const getParentByCode = (parentCode) => {
  const codes = safeRead(STORAGE_KEY, []);
  // Initialize if empty
  if (codes.length === 0) {
    initializeSeedData();
    return getParentByCode(parentCode);
  }
  return codes.find((c) => c.code === parentCode && c.parentCode === null) || null;
};

/**
 * Get all parent codes (100 and 200)
 * @returns {Array} Array of parent code objects
 */
export const getParentCodes = () => {
  const codes = safeRead(STORAGE_KEY, []);
  // Initialize if empty
  if (codes.length === 0) {
    initializeSeedData();
    return getParentCodes();
  }
  return codes.filter((c) => c.parentCode === null).sort((a, b) => a.sortOrder - b.sortOrder);
};

/**
 * Generate next available sub-category code for a parent
 * @param {string} parentCode - Parent code ("100" or "200")
 * @returns {string} Next available code (e.g., "100-04")
 */
export const generateNextSubCategoryCode = (parentCode) => {
  const codes = safeRead(STORAGE_KEY, []);
  // Initialize if empty
  if (codes.length === 0) {
    initializeSeedData();
    return generateNextSubCategoryCode(parentCode);
  }

  // Get all existing sub-categories for this parent
  const existingCodes = codes
    .filter((c) => c.parentCode === parentCode)
    .map((c) => c.code)
    .filter((code) => code.startsWith(`${parentCode}-`));

  // Extract numbers from codes (e.g., "100-01" -> 1)
  const numbers = existingCodes
    .map((code) => {
      const match = code.match(new RegExp(`^${parentCode}-(\\d+)$`));
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  // Find next available number
  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const nextCode = `${parentCode}-${String(nextNumber).padStart(2, '0')}`;

  return nextCode;
};

/**
 * Create a new common code (sub-category only)
 * @param {Object} codeData - Code data
 * @param {string} codeData.parentCode - Parent code ("100" or "200")
 * @param {string} codeData.name - Sub-category name
 * @param {string} [codeData.code] - Sub-category code (auto-generated if not provided)
 * @param {number} [codeData.sortOrder] - Sort order
 * @param {boolean} [codeData.isActive] - Active status
 * @returns {Object} Created code with id and timestamps
 */
export const createCommonCode = (codeData) => {
  const codes = safeRead(STORAGE_KEY, []);
  const now = new Date().toISOString();

  // Prevent creating parent rows from UI
  if (!codeData.parentCode) {
    throw new Error('Parent code is required. Cannot create parent categories from UI.');
  }

  // Validate parent code
  if (codeData.parentCode !== '100' && codeData.parentCode !== '200') {
    throw new Error(`Parent code must be "100" (Real-Estate) or "200" (Delivery).`);
  }

  // Find parent by code
  const parent = codes.find((c) => c.code === codeData.parentCode && c.parentCode === null);
  if (!parent) {
    throw new Error(`Parent code "${codeData.parentCode}" not found.`);
  }

  // Auto-generate code if not provided
  let subCategoryCode = codeData.code;
  if (!subCategoryCode) {
    subCategoryCode = generateNextSubCategoryCode(codeData.parentCode);
  } else {
    // Validate code format
    const codePattern = new RegExp(`^${codeData.parentCode}-\\d{2}$`);
    if (!codePattern.test(subCategoryCode)) {
      throw new Error(`Code must match format: ${codeData.parentCode}-XX (e.g., ${codeData.parentCode}-01)`);
    }
  }

  // Validate code uniqueness globally
  const existing = codes.find((c) => c.code === subCategoryCode);
  if (existing) {
    throw new Error(`Code "${subCategoryCode}" already exists`);
  }

  const newCode = {
    id: `cc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    code: subCategoryCode,
    name: codeData.name,
    parentCode: codeData.parentCode,
    sortOrder: codeData.sortOrder || 100,
    isActive: codeData.isActive !== false,
    createdAt: now,
    updatedAt: now,
  };

  const nextCodes = [newCode, ...codes];
  safeWrite(STORAGE_KEY, nextCodes);
  return newCode;
};

/**
 * Update common code by ID
 * @param {string} id - Code ID
 * @param {Object} patch - Fields to update
 * @returns {Object|null} Updated code or null if not found
 */
export const updateCommonCode = (id, patch) => {
  const codes = safeRead(STORAGE_KEY, []);
  const codeIndex = codes.findIndex((c) => c.id === id);
  if (codeIndex === -1) return null;

  const existingCode = codes[codeIndex];
  
  // Prevent editing parent rows
  if (existingCode.parentCode === null) {
    throw new Error('Cannot edit parent categories. Only sub-categories can be edited.');
  }

  const updatedCode = {
    ...existingCode,
    updatedAt: new Date().toISOString(),
  };

  // Update fields
  if (patch.name !== undefined) updatedCode.name = patch.name;
  if (patch.code !== undefined) {
    // Validate code format if changed
    if (patch.code !== existingCode.code) {
      const codePattern = new RegExp(`^${existingCode.parentCode}-\\d{2}$`);
      if (!codePattern.test(patch.code)) {
        throw new Error(`Code must match format: ${existingCode.parentCode}-XX (e.g., ${existingCode.parentCode}-01)`);
      }
      
      // Validate uniqueness
      const duplicate = codes.find(
        (c) =>
          c.id !== id &&
          c.code === patch.code
      );
      if (duplicate) {
        throw new Error(`Code "${patch.code}" already exists`);
      }
    }
    updatedCode.code = patch.code;
  }
  if (patch.sortOrder !== undefined) updatedCode.sortOrder = patch.sortOrder;
  if (patch.isActive !== undefined) updatedCode.isActive = patch.isActive;

  codes[codeIndex] = updatedCode;
  safeWrite(STORAGE_KEY, codes);
  return updatedCode;
};

/**
 * Delete common code by ID
 * @param {string} id - Code ID
 * @returns {boolean} Success
 */
export const deleteCommonCode = (id) => {
  const codes = safeRead(STORAGE_KEY, []);
  const code = codes.find((c) => c.id === id);
  
  if (!code) {
    throw new Error('Code not found');
  }

  // Prevent deleting parent rows
  if (code.parentCode === null) {
    throw new Error('Cannot delete parent categories. Only sub-categories can be deleted.');
  }

  // Check if code has children (shouldn't happen with current structure, but check anyway)
  const hasChildren = codes.some((c) => c.parentCode === code.code);
  if (hasChildren) {
    throw new Error('Cannot delete code with children. Delete children first.');
  }

  const filtered = codes.filter((c) => c.id !== id);
  safeWrite(STORAGE_KEY, filtered);
  return filtered.length < codes.length;
};

/**
 * Activate common code
 * @param {string} id - Code ID
 * @returns {Object|null} Updated code or null
 */
export const activateCommonCode = (id) => {
  return updateCommonCode(id, { isActive: true });
};

/**
 * Deactivate common code
 * @param {string} id - Code ID
 * @returns {Object|null} Updated code or null
 */
export const deactivateCommonCode = (id) => {
  return updateCommonCode(id, { isActive: false });
};

/**
 * Get sub-categories by parent code
 * @param {string} parentCode - Parent code ("100" or "200")
 * @param {boolean} [isActive] - Filter by active status
 * @returns {Array} Array of sub-category objects
 */
export const getSubCategoriesByParent = (parentCode, isActive = true) => {
  return getCommonCodes({ parentCode, isActive });
};

