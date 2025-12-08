import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-semibold';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-dabang-primary text-white',
    secondary: 'bg-dabang-secondary text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  };
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;