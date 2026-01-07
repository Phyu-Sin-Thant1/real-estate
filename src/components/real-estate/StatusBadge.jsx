import React from 'react';

/**
 * StatusBadge - Reusable status badge component for real estate dashboard
 * Supports property status, contract status, and customer status
 */
const StatusBadge = ({ status, type = 'property', size = 'medium', className = '' }) => {
  const getStatusConfig = () => {
    // Property statuses
    if (type === 'property') {
      switch (status) {
        case 'Draft':
        case 'DRAFT':
          return { label: '초안', color: 'bg-gray-100 text-gray-700', icon: '📝' };
        case 'PENDING':
        case 'Under Review':
          return { label: '심사 중', color: 'bg-amber-100 text-amber-700', icon: '⏳' };
        case 'LIVE':
        case 'Published':
          return { label: '노출 중', color: 'bg-green-100 text-green-700', icon: '✅' };
        case 'COMPLETED':
        case 'Completed':
          return { label: '거래 완료', color: 'bg-blue-100 text-blue-700', icon: '🏁' };
        case 'REJECTED':
        case 'Rejected':
          return { label: '반려됨', color: 'bg-red-100 text-red-700', icon: '❌' };
        case 'HIDDEN':
        case 'Hidden':
          return { label: '비노출', color: 'bg-gray-100 text-gray-600', icon: '👁️' };
        default:
          return { label: status, color: 'bg-gray-100 text-gray-700', icon: '' };
      }
    }
    
    // Contract statuses
    if (type === 'contract') {
      switch (status) {
        case 'Drafted':
        case '초안':
          return { label: '초안', color: 'bg-gray-100 text-gray-700', icon: '📄' };
        case 'Reviewed':
        case '검토 완료':
          return { label: '검토 완료', color: 'bg-blue-100 text-blue-700', icon: '👀' };
        case 'Signed':
        case 'Signed':
        case '서명 완료':
          return { label: '서명 완료', color: 'bg-purple-100 text-purple-700', icon: '✍️' };
        case 'Completed':
        case '완료':
          return { label: '완료', color: 'bg-green-100 text-green-700', icon: '✅' };
        case '진행중':
          return { label: '진행 중', color: 'bg-blue-100 text-blue-700', icon: '🔄' };
        case '취소':
        case 'Cancelled':
          return { label: '취소', color: 'bg-red-100 text-red-700', icon: '❌' };
        default:
          return { label: status, color: 'bg-gray-100 text-gray-700', icon: '' };
      }
    }
    
    // Customer statuses
    if (type === 'customer') {
      switch (status) {
        case 'New':
        case '신규':
          return { label: '신규', color: 'bg-blue-100 text-blue-700', icon: '🆕' };
        case 'In Discussion':
        case '상담 중':
          return { label: '상담 중', color: 'bg-amber-100 text-amber-700', icon: '💬' };
        case 'Contract Signed':
        case '계약 완료':
          return { label: '계약 완료', color: 'bg-green-100 text-green-700', icon: '✅' };
        default:
          return { label: status, color: 'bg-gray-100 text-gray-700', icon: '' };
      }
    }
    
    return { label: status, color: 'bg-gray-100 text-gray-700', icon: '' };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${config.color} ${sizeClasses[size]} ${className}`}
    >
      {config.icon && <span className="text-xs">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;

