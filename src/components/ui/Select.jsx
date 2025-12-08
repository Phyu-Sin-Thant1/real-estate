import React from 'react';

const Select = ({ 
  label, 
  id, 
  options = [], 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1 font-body"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent font-body ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;