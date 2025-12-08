import React from 'react';

const FilterChip = ({ 
  label, 
  active = false, 
  onClick,
  className = '' 
}) => {
  const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap';
  
  const activeClasses = active 
    ? 'bg-teal-500 text-white shadow-md border-0' 
    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50';
  
  const classes = `${baseClasses} ${activeClasses} ${className}`;
  
  return (
    <button
      onClick={onClick}
      className={classes}
    >
      {label}
    </button>
  );
};

export default FilterChip;