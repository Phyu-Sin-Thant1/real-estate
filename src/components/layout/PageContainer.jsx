import React from 'react';

/**
 * Standard centered page container for normal content sections.
 * - Full-width section should wrap this with their own background.
 * - This only controls max content width + horizontal padding.
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;


