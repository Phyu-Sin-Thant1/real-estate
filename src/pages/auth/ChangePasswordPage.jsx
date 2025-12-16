import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { findBusinessAccountByEmail, updateBusinessAccountPassword } from '../../store/businessAccountsStore';

const ChangePasswordPage = () => {
  const { user, logout } = useUnifiedAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in or not a business user
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/auth/change-password' } });
      return;
    }
    if (!user.role?.startsWith('BUSINESS_')) {
      // Redirect to appropriate dashboard
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'USER') {
        navigate('/');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return null;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Validate new password
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setErrors({ newPassword: passwordError });
      setSubmitting(false);
      return;
    }

    // Check password match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      setSubmitting(false);
      return;
    }

    // Update password
    if (!user?.email) {
      setErrors({ general: 'User email not found. Please log in again.' });
      setSubmitting(false);
      return;
    }

    try {
      updateBusinessAccountPassword(user.email, formData.newPassword);
      
      // Show success message
      alert('Password changed successfully! Redirecting to dashboard...');
      
      // Redirect based on role
      if (user.role === 'BUSINESS_REAL_ESTATE') {
        navigate('/business/real-estate/dashboard', { replace: true });
      } else if (user.role === 'BUSINESS_DELIVERY') {
        navigate('/business/dashboard', { replace: true });
      } else {
        logout();
        navigate('/login', { 
          state: { 
            message: 'Password changed successfully. Please log in with your new password.',
            email: user.email 
          } 
        });
      }
    } catch (error) {
      setErrors({ general: 'Failed to update password. Please try again.' });
      setSubmitting(false);
    }
  };

  if (!user || !user.role?.startsWith('BUSINESS_')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-600 mt-2">
            Please set a new password for your account
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                errors.newPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
              required
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

