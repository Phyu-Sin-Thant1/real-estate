import { useState, useEffect, useMemo } from 'react'
import { mockProperties } from '../mock/properties'

/**
 * Reusable hook for property search with mock data
 * Designed to be easily replaced with real API calls later
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.q - Text search query (지역 / 역 / 아파트명)
 * @param {string} params.dealType - Deal type (전체/매매/전세/월세)
 * @param {string} params.propertyType - Property type (원룸/투룸/아파트/빌라/오피스텔)
 * @param {string|number} params.rooms - Number of rooms
 * @param {number} params.minPrice - Minimum price
 * @param {number} params.maxPrice - Maximum price
 * @param {number} params.minArea - Minimum area in square meters
 * @param {number} params.maxArea - Maximum area in square meters
 * @param {Array<string>} params.options - Selected options
 * @returns {Object} - Search results and loading state
 */
export const usePropertySearch = (params = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Memoize filtered results to avoid unnecessary recalculations
  const filteredProperties = useMemo(() => {
    // Start with all properties
    let results = [...mockProperties]
    
    // Apply text search filter
    if (params.q) {
      const query = params.q.toLowerCase().trim()
      results = results.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Apply property type filter
    if (params.propertyType) {
      results = results.filter(property => 
        property.tags.some(tag => tag.includes(params.propertyType))
      )
    }
    
    // Apply deal type filter
    if (params.dealType && params.dealType !== '전체') {
      results = results.filter(property => property.dealType === params.dealType)
    }
    
    // Apply rooms filter
    if (params.rooms && params.rooms !== '전체') {
      results = results.filter(property => {
        // Convert property rooms to string for comparison
        const propertyRooms = String(property.rooms)
        if (params.rooms === '4') {
          // For "4개 이상" (4 or more)
          return parseInt(propertyRooms) >= 4
        }
        return propertyRooms === String(params.rooms)
      })
    }
    
    // Apply price filters
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      results = results.filter(property => {
        // Extract numeric price from price string
        let price = 0
        
        if (property.dealType === '매매') {
          // For sale properties like "12억"
          const saleMatch = property.price.match(/(\d+)억/)
          if (saleMatch) {
            price = parseInt(saleMatch[1]) * 10000 // Convert 억 to 만원
          }
        } else if (property.dealType === '전세') {
          // For jeonse properties like "1억 5천"
          const jeonseMatch = property.price.match(/(\d+)억\s*(\d+)?천?/)
          if (jeonseMatch) {
            const billion = parseInt(jeonseMatch[1]) || 0
            const thousand = parseInt(jeonseMatch[2]) || 0
            price = billion * 10000 + thousand * 1000
          }
        } else if (property.dealType === '월세') {
          // For monthly rent properties like "월세 50/100" or "월세 150"
          const monthlyMatch = property.price.match(/월세\s*(\d+)(?:\/(\d+))?/)
          if (monthlyMatch) {
            // Use deposit for filtering (first captured group)
            price = parseInt(monthlyMatch[1])
          }
        }
        
        if (params.minPrice !== undefined && price < parseInt(params.minPrice)) return false
        if (params.maxPrice !== undefined && price > parseInt(params.maxPrice)) return false
        return true
      })
    }
    
    // Apply area filters
    if (params.minArea !== undefined || params.maxArea !== undefined) {
      results = results.filter(property => {
        // Extract area from area string (e.g., "84㎡")
        const areaMatch = property.area.match(/(\d+)/)
        if (!areaMatch) return true
        
        const area = parseInt(areaMatch[1]) || 0
        
        if (params.minArea !== undefined && area < parseInt(params.minArea)) return false
        if (params.maxArea !== undefined && area > parseInt(params.maxArea)) return false
        return true
      })
    }
    
    // Apply options filter
    if (params.options && params.options.length > 0) {
      results = results.filter(property => {
        // Check if property has all selected options
        return params.options.every(option => 
          property.options.includes(option) || property.facilities.includes(option)
        )
      })
    }
    
    return results
  }, [params])
  
  // Simulate API call with async behavior
  const [data, setData] = useState([])
  
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    // Simulate network delay
    const timer = setTimeout(() => {
      try {
        setData(filteredProperties)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load properties')
        setIsLoading(false)
      }
    }, 300) // Simulate 300ms network delay
    
    return () => clearTimeout(timer)
  }, [filteredProperties])
  
  return {
    data,
    isLoading,
    error,
    refetch: () => {} // Placeholder for future API refetch functionality
  }
}