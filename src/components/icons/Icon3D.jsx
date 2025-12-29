import React from 'react';

const Icon3D = ({ children, isActive = false, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center transition-all duration-300 w-6 h-6 ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative transition-all duration-300"
        style={{
          transform: isActive
            ? 'rotateY(15deg) rotateX(-8deg) translateZ(15px) scale(1.1)'
            : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform = 'rotateY(8deg) rotateX(-4deg) translateZ(8px) scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
          }
        }}
      >
        {/* Main icon with 3D shadow */}
        <div
          className="relative"
          style={{
            filter: isActive
              ? 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'
              : 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2))',
            transform: isActive ? 'translateZ(10px)' : 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </div>
        
        {/* 3D depth shadow layer */}
        {isActive && (
          <div
            className="absolute inset-0"
            style={{
              transform: 'translateZ(-8px) translateY(3px)',
              filter: 'blur(4px) opacity(0.4)',
              transformStyle: 'preserve-3d',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Icon3D;

