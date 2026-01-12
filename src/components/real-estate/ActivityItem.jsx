import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ActivityItem - Component for displaying recent activity items
 */
const ActivityItem = ({ 
  type, // 'property', 'contract', 'customer'
  title,
  description,
  timestamp,
  href,
  onClick,
  icon
}) => {
  const navigate = useNavigate();

  const getTypeIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'property':
        return '🏠';
      case 'contract':
        return '📄';
      case 'customer':
        return '👤';
      default:
        return '📌';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'property':
        return 'bg-green-50 border-green-200';
      case 'contract':
        return 'bg-blue-50 border-blue-200';
      case 'customer':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div
      onClick={href || onClick ? handleClick : undefined}
      className={`
        flex items-start gap-3 p-4 rounded-lg border transition-all duration-200
        ${getTypeColor()}
        ${href || onClick ? 'cursor-pointer hover:shadow-sm' : ''}
      `}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg">
        {getTypeIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
        {description && (
          <p className="text-xs text-gray-600 mb-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{formatTimestamp(timestamp)}</span>
          {(href || onClick) && (
            <button className="text-xs font-medium text-dabang-primary hover:text-dabang-primary/80">
              상세보기 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;




