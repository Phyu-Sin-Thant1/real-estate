import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchBannersForPage } from '../lib/api/banners';

const BannerContext = createContext();

export const useBannerContext = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBannerContext must be used within BannerProvider');
  }
  return context;
};

/**
 * BannerProvider - Provides banner data and caching
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const BannerProvider = ({ children }) => {
  const [bannerCache, setBannerCache] = useState({});
  const [loading, setLoading] = useState({});

  /**
   * Get banners for a page (with caching)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Banners object
   */
  const getBannersForPage = useCallback(async (params) => {
    const cacheKey = `${params.surface || 'USER_WEB'}_${params.pageScope}_${params.domain || 'ALL'}_${params.device || 'ALL'}_${params.language || 'KO'}`;

    // Return cached data if available
    if (bannerCache[cacheKey]) {
      return bannerCache[cacheKey];
    }

    // Check if already loading
    if (loading[cacheKey]) {
      // Wait for existing request
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          if (bannerCache[cacheKey]) {
            clearInterval(checkCache);
            resolve(bannerCache[cacheKey]);
          }
        }, 50);
      });
    }

    // Set loading state
    setLoading(prev => ({ ...prev, [cacheKey]: true }));

    try {
      const result = await fetchBannersForPage(params);
      
      // Cache the result
      setBannerCache(prev => ({
        ...prev,
        [cacheKey]: result,
      }));

      return result;
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      return { slots: {} };
    } finally {
      setLoading(prev => {
        const next = { ...prev };
        delete next[cacheKey];
        return next;
      });
    }
  }, [bannerCache, loading]);

  /**
   * Clear banner cache (useful when banners are updated)
   */
  const clearCache = useCallback(() => {
    setBannerCache({});
  }, []);

  const value = {
    getBannersForPage,
    clearCache,
    loading,
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};

