import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';

const ListingsContext = createContext(null);

// Helper function to generate a unique ID
const generateId = () => Date.now();

// Helper function to load listings from localStorage
const loadListingsFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('tofu-listings');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse listings from localStorage', error);
    return [];
  }
};

// Helper function to save listings to localStorage
const saveListingsToStorage = (listings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tofu-listings', JSON.stringify(listings));
  } catch (error) {
    console.warn('Failed to save listings to localStorage', error);
  }
};

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState(() => loadListingsFromStorage());

  // Save listings to localStorage whenever they change
  useEffect(() => {
    saveListingsToStorage(listings);
  }, [listings]);

  // Add a new listing
  const addListing = useCallback((listingData) => {
    const newListing = {
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      ...listingData
    };

    setListings(prev => [newListing, ...prev]);
    return newListing;
  }, []);

  // Update an existing listing
  const updateListing = useCallback((id, listingData) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === id 
          ? { ...listing, ...listingData, updatedAt: new Date().toISOString() }
          : listing
      )
    );
  }, []);

  // Get a listing by ID
  const getListingById = useCallback((id) => {
    return listings.find(listing => listing.id === parseInt(id));
  }, [listings]);

  // Delete a listing
  const deleteListing = useCallback((id) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      listings,
      addListing,
      updateListing,
      getListingById,
      deleteListing
    }),
    [listings, addListing, updateListing, getListingById, deleteListing]
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};