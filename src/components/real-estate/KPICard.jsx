import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * KPICard - Reusable KPI card component with icon, value, and clickable navigation
 */
const KPICard = ({ 
  title, 
  value, 
  icon, 
  iconColor = 'text-blue-600', 
  bgGradient = 'from-blue-50 to-blue-100',
  onClick,
  href,
  change,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  const isClickable = href || onClick;

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 p-6 
        transition-all duration-200
        ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-dabang-primary/30 hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${bgGradient} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-2xl ${iconColor}`}>{icon}</span>
          </div>
        )}
      </div>
      {isClickable && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs font-medium text-dabang-primary flex items-center gap-1">
            자세히 보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;








