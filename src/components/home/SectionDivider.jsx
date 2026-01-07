import React from 'react';

/**
 * SectionDivider - A visual divider component for separating sections
 * Can be used between major sections on the homepage
 */
const SectionDivider = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent',
    thick: 'h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent',
    dotted: 'h-px border-t border-dashed border-slate-200',
  };

  return (
    <div className={`w-full ${variants[variant] || variants.default} ${className}`} />
  );
};

export default SectionDivider;











