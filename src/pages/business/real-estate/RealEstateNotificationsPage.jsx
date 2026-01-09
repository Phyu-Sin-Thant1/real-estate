import React, { useState, useEffect } from 'react';
import { getPartnerNotifications } from '../../../store/partnerNotificationsStore';
import NotificationInboxList from '../../../components/business/NotificationInboxList';

const RealEstateNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const partnerNotifications = getPartnerNotifications('BUSINESS_REAL_ESTATE');
    setNotifications(partnerNotifications);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">View notifications sent to you</p>
      </div>

      <NotificationInboxList
        notifications={notifications}
        onUpdate={loadNotifications}
      />
    </div>
  );
};

export default RealEstateNotificationsPage;

