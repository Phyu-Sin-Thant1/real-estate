// Business Accounts store - manages business partner accounts
import { generateTempPassword } from '../lib/utils/password';

const STORAGE_KEY = 'tofu-business-accounts';

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
    const now = new Date();
    const mockAccounts = [
      {
        id: 'biz-1',
        email: 'seoulrealestate@tofu.com',
        companyName: 'Seoul Real Estate Co.',
        partnerType: 'REAL_ESTATE',
        role: 'BUSINESS_REAL_ESTATE',
        password: 'SeoulRE123!',
        isTempPassword: false,
        status: 'ACTIVE',
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'biz-2',
        email: 'busandelivery@tofu.com',
        companyName: 'Busan Delivery Services',
        partnerType: 'DELIVERY',
        role: 'BUSINESS_DELIVERY',
        password: 'BusanDel456!',
        isTempPassword: false,
        status: 'ACTIVE',
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'biz-3',
        email: 'incheonproperties@tofu.com',
        companyName: 'Incheon Properties Ltd.',
        partnerType: 'REAL_ESTATE',
        role: 'BUSINESS_REAL_ESTATE',
        password: 'Incheon789!',
        isTempPassword: false,
        status: 'ACTIVE',
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'biz-4',
        email: 'daeguquickmove@tofu.com',
        companyName: 'Daegu Quick Move',
        partnerType: 'DELIVERY',
        role: 'BUSINESS_DELIVERY',
        password: 'DaeguMove321!',
        isTempPassword: false,
        status: 'ACTIVE',
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'biz-5',
        email: 'gwangjuhomes@tofu.com',
        companyName: 'Gwangju Homes Realty',
        partnerType: 'REAL_ESTATE',
        role: 'BUSINESS_REAL_ESTATE',
        password: 'Gwangju654!',
        isTempPassword: false,
        status: 'ACTIVE',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'biz-6',
        email: 'suspendedpartner@tofu.com',
        companyName: 'Suspended Partner Inc.',
        partnerType: 'DELIVERY',
        role: 'BUSINESS_DELIVERY',
        password: 'Suspended123!',
        isTempPassword: false,
        status: 'SUSPENDED',
        createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Suspended 5 days ago
      },
      {
        id: 'biz-7',
        email: 'newpartner@tofu.com',
        companyName: 'New Partner Co.',
        partnerType: 'REAL_ESTATE',
        role: 'BUSINESS_REAL_ESTATE',
        password: 'TempPass789!',
        isTempPassword: true,
        status: 'ACTIVE',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    safeWrite(STORAGE_KEY, mockAccounts);
    return mockAccounts;
  }
  return existing;
};

/**
 * Get all business accounts
 * @returns {Array} Array of account objects
 */
export const getBusinessAccounts = () => {
  return initializeMockData();
};

/**
 * Get business account by email
 * @param {string} email - Account email
 * @returns {Object|null} Account object or null
 */
export const getBusinessAccountByEmail = (email) => {
  const accounts = getBusinessAccounts();
  return accounts.find((acc) => acc.email === email) || null;
};

/**
 * Add a new business account
 * @param {Object} account - Account object
 * @returns {Array} Updated accounts array
 */
export const addBusinessAccount = (account) => {
  const accounts = getBusinessAccounts();
  // Check if account already exists
  const exists = accounts.find((acc) => acc.email === account.email);
  if (exists) return accounts;
  
  const nextAccounts = [account, ...accounts];
  safeWrite(STORAGE_KEY, nextAccounts);
  return nextAccounts;
};

/**
 * Upsert business account (create or update if exists)
 * @param {Object} account - Account object
 * @returns {Object} { account, isNew } - Account object and whether it was newly created
 */
export const upsertBusinessAccount = (account) => {
  const accounts = getBusinessAccounts();
  const existing = accounts.find((acc) => acc.email === account.email);
  
  if (existing) {
    // Update existing account
    const updated = {
      ...existing,
      ...account,
      updatedAt: new Date().toISOString(),
    };
    const nextAccounts = accounts.map((acc) =>
      acc.email === account.email ? updated : acc
    );
    safeWrite(STORAGE_KEY, nextAccounts);
    return { account: updated, isNew: false };
  } else {
    // Create new account
    const nextAccounts = [account, ...accounts];
    safeWrite(STORAGE_KEY, nextAccounts);
    return { account, isNew: true };
  }
};

/**
 * Update business account by email
 * @param {string} email - Account email
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated accounts array
 */
export const updateBusinessAccount = (email, patch) => {
  const accounts = getBusinessAccounts();
  const nextAccounts = accounts.map((acc) =>
    acc.email === email
      ? { ...acc, ...patch, updatedAt: new Date().toISOString() }
      : acc
  );
  safeWrite(STORAGE_KEY, nextAccounts);
  return nextAccounts;
};

/**
 * Get accounts filtered by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered accounts array
 */
export const getBusinessAccountsByStatus = (status) => {
  const accounts = getBusinessAccounts();
  return accounts.filter((acc) => acc.status === status);
};

/**
 * Get accounts filtered by role
 * @param {string} role - Role to filter by
 * @returns {Array} Filtered accounts array
 */
export const getBusinessAccountsByRole = (role) => {
  const accounts = getBusinessAccounts();
  return accounts.filter((acc) => acc.role === role);
};

/**
 * Load business accounts (alias for getBusinessAccounts for compatibility)
 * @returns {Array} Array of account objects
 */
export const loadBusinessAccounts = () => {
  return getBusinessAccounts();
};

/**
 * Save business accounts list
 * @param {Array} accounts - Array of account objects
 */
export const saveBusinessAccounts = (accounts) => {
  safeWrite(STORAGE_KEY, accounts);
};

/**
 * Find business account by email
 * @param {string} email - Account email
 * @returns {Object|null} Account object or null
 */
export const findBusinessAccountByEmail = (email) => {
  return getBusinessAccountByEmail(email);
};


/**
 * Create business account from partner application
 * @param {Object} application - Partner application object
 * @returns {Object} Created account with temp password and dashboard URL
 */
export const createBusinessAccountFromApplication = (application) => {
  const accounts = getBusinessAccounts();
  const existing = accounts.find((acc) => acc.email === application.email);
  
  let account;
  let tempPassword;
  
  if (existing) {
    // Account already exists - use existing password or regenerate if status was pending
    account = existing;
    tempPassword = existing.password;
    
    // Update status to ACTIVE if it was pending
    if (existing.status !== 'ACTIVE') {
      account = {
        ...existing,
        status: 'ACTIVE',
        updatedAt: new Date().toISOString(),
      };
      updateBusinessAccount(existing.email, { status: 'ACTIVE' });
    }
  } else {
    // Create new account
    tempPassword = generateTempPassword();
    const now = new Date().toISOString();
    
    account = {
      id: `biz-${Date.now()}`,
      email: application.email,
      companyName: application.companyName,
      partnerType: application.type, // REAL_ESTATE or DELIVERY
      role: application.type === 'REAL_ESTATE' ? 'BUSINESS_REAL_ESTATE' : 'BUSINESS_DELIVERY',
      password: tempPassword,
      isTempPassword: true,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
    
    addBusinessAccount(account);
  }
  
  // Determine dashboard URL based on role
  const dashboardUrl = account.role === 'BUSINESS_REAL_ESTATE' 
    ? '/business/real-estate/dashboard'
    : '/business/dashboard';
  
  return { 
    account, 
    tempPassword,
    dashboardUrl 
  };
};

/**
 * Update business account password
 * @param {string} email - Account email
 * @param {string} newPassword - New password
 * @returns {Array} Updated accounts array
 */
export const updateBusinessAccountPassword = (email, newPassword) => {
  return updateBusinessAccount(email, {
    password: newPassword,
    isTempPassword: false,
    updatedAt: new Date().toISOString(),
  });
};

