import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = '' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all ${className}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="p-8">
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-display">
                {title}
              </h2>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;