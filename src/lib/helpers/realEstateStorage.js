// Local storage helpers for real-estate partner listings and admin approvals.
const LISTINGS_KEY = 'tofu-realestate-listings';
const APPROVALS_KEY = 'tofu-approvals-queue';
const PARTNER_APPS_KEY = 'tofu-partner-applications';
const BUSINESS_ACCOUNTS_KEY = 'tofu-business-accounts';

const safeParse = (value, fallback = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.warn('Failed to parse localStorage value', e);
    return fallback;
  }
};

const readFromStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
};

const writeToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to write localStorage value', e);
  }
};

export const loadListings = () => readFromStorage(LISTINGS_KEY, []);
export const saveListings = (listings) => writeToStorage(LISTINGS_KEY, listings);

export const loadApprovals = () => readFromStorage(APPROVALS_KEY, []);
export const saveApprovals = (approvals) => writeToStorage(APPROVALS_KEY, approvals);

export const loadPartnerApplications = () => readFromStorage(PARTNER_APPS_KEY, []);
export const savePartnerApplications = (apps) => writeToStorage(PARTNER_APPS_KEY, apps);

export const loadBusinessAccounts = () => readFromStorage(BUSINESS_ACCOUNTS_KEY, []);
export const saveBusinessAccounts = (accounts) => writeToStorage(BUSINESS_ACCOUNTS_KEY, accounts);

export const addListingWithApproval = ({ listing, approval }) => {
  const listings = loadListings();
  const approvals = loadApprovals();

  const nextListings = [listing, ...listings];
  const nextApprovals = [approval, ...approvals];

  saveListings(nextListings);
  saveApprovals(nextApprovals);

  return { listings: nextListings, approvals: nextApprovals };
};

export const addPartnerApplicationWithApproval = ({ application, approval }) => {
  const apps = loadPartnerApplications();
  const approvals = loadApprovals();

  const nextApps = [application, ...apps];
  const nextApprovals = [approval, ...approvals];

  savePartnerApplications(nextApps);
  saveApprovals(nextApprovals);

  return { applications: nextApps, approvals: nextApprovals };
};

export const updatePartnerApplicationStatus = (applicationId, status, rejectReason) => {
  const apps = loadPartnerApplications();
  const nextApps = apps.map((app) =>
    app.id === applicationId ? { ...app, status, rejectReason, updatedAt: new Date().toISOString() } : app
  );
  savePartnerApplications(nextApps);
  return nextApps;
};

export const addBusinessAccountFromApplication = ({ application, tempPassword }) => {
  const accounts = loadBusinessAccounts();
  const exists = accounts.find((acc) => acc.email === application.email);
  if (exists) return accounts;

  const newAccount = {
    email: application.email,
    role: application.type === 'REAL_ESTATE' ? 'BUSINESS_REAL_ESTATE' : 'BUSINESS_DELIVERY',
    tempPassword,
    companyName: application.companyName,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  const nextAccounts = [newAccount, ...accounts];
  saveBusinessAccounts(nextAccounts);
  return nextAccounts;
};

export const updateListingStatus = (listingId, status) => {
  const listings = loadListings();
  const nextListings = listings.map((listing) =>
    listing.id === listingId ? { ...listing, status, updatedAt: new Date().toISOString() } : listing
  );
  saveListings(nextListings);
  return nextListings;
};

export const updateApprovalStatus = (approvalId, status, extra = {}) => {
  const approvals = loadApprovals();
  const nextApprovals = approvals.map((approval) =>
    approval.id === approvalId ? { ...approval, status, updatedAt: new Date().toISOString(), ...extra } : approval
  );
  saveApprovals(nextApprovals);
  return nextApprovals;
};

