import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white shadow-lg hover:shadow-xl',
    outlined: 'bg-white border border-gray-200 hover:shadow-sm',
    elevated: 'bg-white shadow-xl hover:shadow-2xl',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;