import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'tofu-admin-session'

const defaultAdmin = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@tofu.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'Admin123!',
  name: import.meta.env.VITE_ADMIN_NAME || 'TOFU Admin',
}

const AuthContext = createContext(null)

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

export const AuthProvider = ({ children }) => {
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
    const expectedEmail = defaultAdmin.email.trim().toLowerCase()
    const expectedPassword = defaultAdmin.password

    if (normalizedEmail !== expectedEmail || password !== expectedPassword) {
      return { success: false, error: '잘못된 관리자 계정 정보입니다.' }
    }

    const session = {
      email: expectedEmail,
      name: defaultAdmin.name,
      role: 'ADMIN', // Updated to uppercase for consistency
      loginAt: new Date().toISOString(),
    }

    setUser(session)

    return { success: true, user: session }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


