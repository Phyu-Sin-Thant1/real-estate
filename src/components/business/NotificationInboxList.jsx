import React, { useState, useMemo } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Select from '../ui/Select';
import NotificationDetailDrawer from './NotificationDetailDrawer';
import { markAllNotificationsAsRead } from '../../store/partnerNotificationsStore';

const NotificationInboxList = ({ notifications, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Tab filter
    if (activeTab === 'UNREAD') {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    return filtered;
  }, [notifications, activeTab, typeFilter]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedNotification(null);
    onUpdate?.();
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length > 0) {
      markAllNotificationsAsRead(unreadIds);
      onUpdate?.();
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white border-transparent shadow-lg shadow-dabang-primary/30'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('UNREAD')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 relative ${
                activeTab === 'UNREAD'
                  ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white border-transparent shadow-lg shadow-dabang-primary/30'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              읽지 않음
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="small"
              onClick={handleMarkAllAsRead}
            >
              모두 읽음 처리
            </Button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Select
          id="typeFilter"
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'SYSTEM', label: 'System' },
            { value: 'FEATURE', label: 'Feature' },
            { value: 'POLICY', label: 'Policy' },
            { value: 'SECURITY', label: 'Security' }
          ]}
        />
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            알림이 없습니다
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeBadge(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(notification.sentAt || notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <NotificationDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        notification={selectedNotification}
        onRead={handleDrawerClose}
      />
    </div>
  );
};

export default NotificationInboxList;


