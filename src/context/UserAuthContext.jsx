import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

const USER_STORAGE_KEY = 'tofu-user-session'
const FAVORITES_STORAGE_KEY = 'tofu-user-favorites'

const UserAuthContext = createContext(null)

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (error) {
      console.warn('Failed to parse persisted user session', error)
      return null
    }
  })

  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw)
    } catch (error) {
      console.warn('Failed to parse persisted favorites', error)
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const login = useCallback(async ({ email, password }) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // In a real app, this would be an API call to your backend
    // For now, we'll simulate a successful login for any non-empty credentials
    if (!email || !password) {
      return { success: false, error: '이메일과 비밀번호를 입력해주세요.' }
    }

    // Simple validation - in a real app, this would be done on the backend
    const normalizedEmail = email.trim().toLowerCase()
    
    // Create user session
    const session = {
      id: Date.now(), // Simple ID generation - in real app, this would come from backend
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0], // Simple name extraction
      role: 'user',
      loginAt: new Date().toISOString(),
    }

    setUser(session)
    return { success: true, user: session }
  }, [])

  const signup = useCallback(async ({ email, password, name, phone }) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // In a real app, this would be an API call to your backend
    if (!email || !password || !name || !phone) {
      return { success: false, error: '모든 필수 정보를 입력해주세요.' }
    }

    // Simple validation - in real app, this would be done on the backend
    const normalizedEmail = email.trim().toLowerCase()
    
    // Check if user already exists (simplified)
    // In a real app, this would be handled by the backend
    if (normalizedEmail === 'admin@tofu.com') {
      return { success: false, error: '이미 사용중인 이메일입니다.' }
    }

    // Create user session
    const session = {
      id: Date.now(), // Simple ID generation - in real app, this would come from backend
      email: normalizedEmail,
      name,
      phone,
      role: 'user',
      createdAt: new Date().toISOString(),
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

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId)
      } else {
        return [...prev, propertyId]
      }
    })
  }, [])

  const isFavorite = useCallback((propertyId) => {
    return favorites.includes(propertyId)
  }, [favorites])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      favorites,
      login,
      signup,
      logout,
      updateUser,
      toggleFavorite,
      isFavorite,
    }),
    [user, favorites, login, signup, logout, updateUser, toggleFavorite, isFavorite]
  )

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext)
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider')
  }
  return context
}