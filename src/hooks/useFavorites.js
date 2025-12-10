import { useState, useEffect, useCallback } from 'react'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'
import { mockProperties } from '../mock/properties'

const FAVORITES_STORAGE_PREFIX = 'tofu-favorites'

/**
 * Hook for managing user favorites with localStorage persistence
 * 
 * @returns {Object} Favorites management functions and state
 */
export const useFavorites = () => {
  const { user, isAuthenticated } = useUnifiedAuth()
  const [favorites, setFavorites] = useState([])
  
  // Generate storage key based on user ID
  const getStorageKey = useCallback(() => {
    if (!user?.id) return null
    return `${FAVORITES_STORAGE_PREFIX}-${user.id}`
  }, [user?.id])
  
  // Load favorites from localStorage
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setFavorites([])
      return
    }
    
    const storageKey = getStorageKey()
    if (!storageKey) {
      setFavorites([])
      return
    }
    
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        setFavorites(Array.isArray(parsed) ? parsed : [])
      } else {
        setFavorites([])
      }
    } catch (error) {
      console.warn('Failed to parse favorites from localStorage', error)
      setFavorites([])
    }
  }, [isAuthenticated, user?.id, getStorageKey])
  
  // Save favorites to localStorage
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    
    const storageKey = getStorageKey()
    if (!storageKey) return
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    } catch (error) {
      console.warn('Failed to save favorites to localStorage', error)
    }
  }, [favorites, isAuthenticated, user?.id, getStorageKey])
  
  // Check if a property is favorited
  const isFavorite = useCallback((propertyId) => {
    return favorites.some(fav => 
      typeof fav === 'object' ? fav.propertyId === propertyId : fav === propertyId
    )
  }, [favorites])
  
  // Toggle favorite status
  const toggleFavorite = useCallback((propertyId) => {
    if (!isAuthenticated) {
      // Not logged in - let caller handle redirection
      return false
    }
    
    setFavorites(prev => {
      const isCurrentlyFavorited = isFavorite(propertyId)
      
      if (isCurrentlyFavorited) {
        // Remove from favorites
        return prev.filter(fav => 
          typeof fav === 'object' ? fav.propertyId !== propertyId : fav !== propertyId
        )
      } else {
        // Add to favorites with timestamp
        return [
          ...prev,
          {
            propertyId,
            savedAt: new Date().toISOString()
          }
        ]
      }
    })
    
    return true
  }, [isAuthenticated, isFavorite])
  
  // Remove a specific favorite
  const removeFavorite = useCallback((propertyId) => {
    setFavorites(prev => 
      prev.filter(fav => 
        typeof fav === 'object' ? fav.propertyId !== propertyId : fav !== propertyId
      )
    )
  }, [])
  
  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])
  
  // Get full property objects for favorited items
  const getFavoriteProperties = useCallback(() => {
    return favorites
      .map(fav => {
        const propertyId = typeof fav === 'object' ? fav.propertyId : fav
        return mockProperties.find(prop => prop.id === propertyId)
      })
      .filter(Boolean) // Remove undefined/null values
      .sort((a, b) => {
        // Sort by savedAt (newest first) if available
        const favA = favorites.find(f => 
          typeof f === 'object' ? f.propertyId === a.id : f === a.id
        )
        const favB = favorites.find(f => 
          typeof f === 'object' ? f.propertyId === b.id : f === b.id
        )
        
        const dateA = typeof favA === 'object' ? new Date(favA.savedAt) : new Date(0)
        const dateB = typeof favB === 'object' ? new Date(favB.savedAt) : new Date(0)
        
        return dateB - dateA // Newest first
      })
  }, [favorites])
  
  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    getFavoriteProperties
  }
}