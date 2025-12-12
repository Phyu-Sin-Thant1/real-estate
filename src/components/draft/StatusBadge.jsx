import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusStyles = () => {
    // Moving Request Status
    if (type === 'moving-request') {
      switch (status) {
        case '신규':
          return 'bg-blue-100 text-blue-800';
        case '연락 완료':
          return 'bg-yellow-100 text-yellow-800';
        case '견적 발송':
          return 'bg-purple-100 text-purple-800';
        case '완료':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Delivery Order Status
    if (type === 'delivery-order') {
      switch (status) {
        case '신규':
          return 'bg-blue-100 text-blue-800';
        case '배차 대기':
          return 'bg-yellow-100 text-yellow-800';
        case '배차 완료':
          return 'bg-indigo-100 text-indigo-800';
        case '배송 중':
          return 'bg-purple-100 text-purple-800';
        case '배송 완료':
          return 'bg-green-100 text-green-800';
        case '취소':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Settlement Status
    if (type === 'settlement') {
      switch (status) {
        case '정산대기':
          return 'bg-yellow-100 text-yellow-800';
        case '정산완료':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Customer Status
    if (type === 'customer') {
      switch (status) {
        case '활성':
          return 'bg-green-100 text-green-800';
        case '완료':
          return 'bg-blue-100 text-blue-800';
        case '취소':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Vehicle Status
    if (type === 'vehicle') {
      switch (status) {
        case '활성':
          return 'bg-green-100 text-green-800';
        case '점검중':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Driver Status
    if (type === 'driver') {
      switch (status) {
        case '근무':
          return 'bg-green-100 text-green-800';
        case '휴무':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Default status
    switch (status) {
      case '완료':
        return 'bg-green-100 text-green-800';
      case '진행중':
        return 'bg-blue-100 text-blue-800';
      case '취소':
        return 'bg-red-100 text-red-800';
      case '예정':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;