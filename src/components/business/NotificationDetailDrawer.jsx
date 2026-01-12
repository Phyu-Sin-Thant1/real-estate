import React from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { markNotificationAsRead } from '../../store/partnerNotificationsStore';

const NotificationDetailDrawer = ({ isOpen, onClose, notification, onRead }) => {
  if (!isOpen || !notification) return null;

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      onRead?.();
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'SYSTEM':
        return <Badge variant="default">System</Badge>;
      case 'FEATURE':
        return <Badge variant="primary">Feature</Badge>;
      case 'POLICY':
        return <Badge variant="secondary">Policy</Badge>;
      case 'SECURITY':
        return <Badge variant="danger">Security</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {getTypeBadge(notification.type)}
                {!notification.isRead && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{notification.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(notification.sentAt || notification.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose max-w-none">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {notification.content}
              </p>
            </div>

            {/* CTA Button */}
            {notification.ctaUrl && notification.ctaLabel && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={() => {
                    window.open(notification.ctaUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  {notification.ctaLabel}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end">
              {!notification.isRead && (
                <Button
                  variant="primary"
                  onClick={handleMarkAsRead}
                >
                  Mark as Read
                </Button>
              )}
              {notification.isRead && (
                <span className="text-sm text-gray-500">Read</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailDrawer;


