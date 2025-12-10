import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

const BUSINESS_STORAGE_KEY = 'tofu-business-session'

const BusinessAuthContext = createContext(null)

export const BusinessAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(BUSINESS_STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (error) {
      console.warn('Failed to parse persisted business session', error)
      return null
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(BUSINESS_STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async ({ email, password, accountType }) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // In a real app, this would be an API call to your backend
    if (!email || !password) {
      return { success: false, error: '이메일과 비밀번호를 입력해주세요.' }
    }

    if (!accountType || !['realEstate', 'delivery'].includes(accountType)) {
      return { success: false, error: '유효한 계정 유형을 선택해주세요.' }
    }

    // Simple validation - in real app, this would be done on the backend
    const normalizedEmail = email.trim().toLowerCase()
    
    // Create business partner session
    const session = {
      id: Date.now(),
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      accountType, // 'realEstate' or 'delivery'
      role: 'business',
      loginAt: new Date().toISOString(),
    }

    setUser(session)
    return { success: true, user: session }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, login, logout, updateUser]
  )

  return <BusinessAuthContext.Provider value={value}>{children}</BusinessAuthContext.Provider>
}

export const useBusinessAuth = () => {
  const context = useContext(BusinessAuthContext)
  if (!context) {
    throw new Error('useBusinessAuth must be used within a BusinessAuthProvider')
  }
  return context
}

