import React from 'react';

/**
 * Blue Verified Badge Component
 * Displays a blue checkmark badge for verified delivery agencies
 * 
 * @param {Object} props
 * @param {boolean} props.isVerified - Whether the agency is verified
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.size] - Badge size: 'sm' | 'md' | 'lg'
 */
const VerifiedBadge = ({ isVerified, className = '', size = 'md' }) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="img"
      aria-label="Verified by TOFU"
      title="TOFU 인증"
    >
      <svg
        className={`${iconSize} text-blue-500 fill-blue-500`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
  );
};

export default VerifiedBadge;

