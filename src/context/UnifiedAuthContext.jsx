import { loadBusinessAccounts } from '../lib/helpers/realEstateStorage';
import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'tofu-auth-session'

// Define role constants
const ROLES = {
  USER: 'USER',
  BUSINESS_REAL_ESTATE: 'BUSINESS_REAL_ESTATE',
  BUSINESS_DELIVERY: 'BUSINESS_DELIVERY',
  ADMIN: 'ADMIN'
}

// Business account credentials
const BUSINESS_ACCOUNTS = {
  'realestate@tofu.com': {
    password: 'RealEstate123!',
    role: ROLES.BUSINESS_REAL_ESTATE,
    name: 'Real Estate Partner'
  },
  'delivery@tofu.com': {
    password: 'Delivery123!',
    role: ROLES.BUSINESS_DELIVERY,
    name: 'Delivery Partner'
  }
}

// Admin account credentials
const ADMIN_ACCOUNT = {
  email: 'admin@tofu.com',
  password: 'Admin123!',
  name: 'TOFU Admin',
  role: ROLES.ADMIN
}

// Demo user
const DEMO_USER = {
  email: 'user@tofu.com',
  password: 'User123!',
  role: ROLES.USER,
  name: 'Demo User'
};

const UnifiedAuthContext = createContext(null)

const readStoredSession = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Failed to parse persisted auth session', error)
    return null
  }
}

export const UnifiedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredSession())

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const normalizedEmail = email.trim().toLowerCase()

    // Check for business accounts
    if (BUSINESS_ACCOUNTS[normalizedEmail]) {
      const businessAccount = BUSINESS_ACCOUNTS[normalizedEmail]
      if (password !== businessAccount.password) {
        return { success: false, error: '잘못된 계정 정보입니다.' }
      }

      const session = {
        email: normalizedEmail,
        name: businessAccount.name,
        role: businessAccount.role,
        loginAt: new Date().toISOString(),
      }

      setUser(session)
      return { success: true, user: session }
    }

    // Check for admin account
    const expectedEmail = ADMIN_ACCOUNT.email.trim().toLowerCase()
    const expectedPassword = ADMIN_ACCOUNT.password

    if (normalizedEmail === expectedEmail && password === expectedPassword) {
      const session = {
        email: expectedEmail,
        name: ADMIN_ACCOUNT.name,
        role: ADMIN_ACCOUNT.role,
        loginAt: new Date().toISOString(),
      }

      setUser(session)
      return { success: true, user: session }
    }

    // Demo user
    if (normalizedEmail === DEMO_USER.email && password === DEMO_USER.password) {
      const session = {
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        role: DEMO_USER.role,
        loginAt: new Date().toISOString(),
      };
      setUser(session);
      return { success: true, user: session };
    }

    // Check stored business accounts
    const storedAccounts = loadBusinessAccounts();
    const matchedAccount = storedAccounts.find(
      (acct) => acct.email.trim().toLowerCase() === normalizedEmail
    );
    if (matchedAccount) {
      const expectedPwd = matchedAccount.tempPassword || matchedAccount.password;
      if (password === expectedPwd) {
        const session = {
          email: matchedAccount.email,
          name: matchedAccount.companyName || matchedAccount.email.split('@')[0],
          role: matchedAccount.role,
          loginAt: new Date().toISOString(),
        };
        setUser(session);
        return { success: true, user: session };
      }
      return { success: false, error: '잘못된 계정 정보입니다.' };
    }

    // Regular user login (for now, accept any non-empty credentials)
    if (!email || !password) {
      return { success: false, error: '이메일과 비밀번호를 입력해주세요.' }
    }

    // Create user session
    const session = {
      id: Date.now(),
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: ROLES.USER,
      loginAt: new Date().toISOString(),
    }

    setUser(session)
    return { success: true, user: session }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  // Helper functions to check roles
  const isUser = useMemo(() => user?.role === ROLES.USER, [user])
  const isBusinessRealEstate = useMemo(() => user?.role === ROLES.BUSINESS_REAL_ESTATE, [user])
  const isBusinessDelivery = useMemo(() => user?.role === ROLES.BUSINESS_DELIVERY, [user])
  const isAdmin = useMemo(() => user?.role === ROLES.ADMIN, [user])
  const isAuthenticated = useMemo(() => Boolean(user), [user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isUser,
      isBusinessRealEstate,
      isBusinessDelivery,
      isAdmin,
      login,
      logout,
      roles: ROLES
    }),
    [user, isAuthenticated, isUser, isBusinessRealEstate, isBusinessDelivery, isAdmin, login, logout]
  )

  return <UnifiedAuthContext.Provider value={value}>{children}</UnifiedAuthContext.Provider>
}

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext)
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider')
  }
  return context
}