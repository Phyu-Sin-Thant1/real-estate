import { useContext } from 'react';
import { UnifiedAuthContext } from '../context/UnifiedAuthContext';

export const useAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an UnifiedAuthProvider');
  }
  return context;
};