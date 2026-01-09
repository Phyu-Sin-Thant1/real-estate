import React, { useState, useEffect, useMemo } from 'react';
import { getAllNotifications, createNotification, resendNotification } from '../../store/adminNotificationsStore';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Toast from '../../components/delivery/Toast';
import Modal from '../../components/common/Modal';

const AdminNotificationsPage = () => {
  const { user } = useUnifiedAuth();
  const [notifications, setNotifications] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'SYSTEM',
    recipients: 'ALL',
    surface: 'ALL_SURFACES',
    ctaLabel: '',
    ctaUrl: '',
    sendOption: 'NOW', // 'NOW' or 'SCHEDULE'
    scheduledAt: ''
  });
  const [showCta, setShowCta] = useState(false);
  const [errors, setErrors] = useState({});

  // Load notifications and initialize mock data if empty
  useEffect(() => {
    let loadedNotifications = getAllNotifications();
    
    // Initialize with mock data if store is empty
    if (loadedNotifications.length === 0) {
      const mockNotifications = [
        {
          id: 'notif-1',
          title: '시스템 점검 안내',
          content: '2025년 12월 16일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다.',
          type: 'SYSTEM',
          recipients: 'ALL',
          surface: 'ALL_SURFACES',
          ctaLabel: null,
          ctaUrl: null,
          status: 'SENT',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          scheduledAt: null,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin@tofu.com'
        },
        {
          id: 'notif-2',
          title: '새로운 기능 추가',
          content: '이사 서비스에 실시간 위치 추적 기능이 추가되었습니다.',
          type: 'FEATURE',
          recipients: 'DELIVERY_PARTNERS',
          surface: 'DELIVERY_DASHBOARD',
          ctaLabel: '자세히 보기',
          ctaUrl: 'https://tofu.com/features',
          status: 'SENT',
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          scheduledAt: null,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin@tofu.com'
        },
        {
          id: 'notif-3',
          title: '정책 변경 안내',
          content: '부동산 중개 수수료 관련 정책이 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
          type: 'POLICY',
          recipients: 'REAL_ESTATE_PARTNERS',
          surface: 'REAL_ESTATE_DASHBOARD',
          ctaLabel: '공지사항 보기',
          ctaUrl: 'https://tofu.com/notices',
          status: 'SENT',
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          scheduledAt: null,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin@tofu.com'
        },
        {
          id: 'notif-4',
          title: '보안 업데이트',
          content: '보안 강화를 위해 비밀번호를 변경해주시기 바랍니다.',
          type: 'SECURITY',
          recipients: 'ALL',
          surface: 'ALL_SURFACES',
          ctaLabel: null,
          ctaUrl: null,
          status: 'SCHEDULED',
          sentAt: null,
          scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin@tofu.com'
        }
      ];
      
      mockNotifications.forEach(notif => {
        createNotification(notif);
      });
      
      loadedNotifications = getAllNotifications();
    }
    
    setNotifications(loadedNotifications);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalSent: notifications.filter(n => n.status === 'SENT').length,
      scheduled: notifications.filter(n => n.status === 'SCHEDULED').length,
      system: notifications.filter(n => n.type === 'SYSTEM').length,
      feature: notifications.filter(n => n.type === 'FEATURE').length,
      security: notifications.filter(n => n.type === 'SECURITY').length
    };
  }, [notifications]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = '제목은 최소 3자 이상 입력해주세요.';
    }

    if (!formData.content.trim() || formData.content.trim().length < 10) {
      newErrors.content = '내용은 최소 10자 이상 입력해주세요.';
    }

    if (formData.ctaUrl && formData.ctaUrl.trim()) {
      try {
        new URL(formData.ctaUrl);
      } catch {
        newErrors.ctaUrl = '유효한 URL을 입력해주세요.';
      }
    }

    if (formData.sendOption === 'SCHEDULE') {
      if (!formData.scheduledAt) {
        newErrors.scheduledAt = '예약 시간을 선택해주세요.';
      } else {
        const scheduled = new Date(formData.scheduledAt);
        if (scheduled <= new Date()) {
          newErrors.scheduledAt = '예약 시간은 미래여야 합니다.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateNotification = () => {
    if (!validateForm()) {
      return;
    }

    const notification = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      type: formData.type,
      recipients: formData.recipients,
      surface: formData.surface,
      ctaLabel: formData.ctaLabel.trim() || null,
      ctaUrl: formData.ctaUrl.trim() || null,
      status: formData.sendOption === 'NOW' ? 'SENT' : 'SCHEDULED',
      scheduledAt: formData.sendOption === 'SCHEDULE' ? formData.scheduledAt : null,
      sentAt: formData.sendOption === 'NOW' ? new Date().toISOString() : null,
      createdBy: user?.email || 'admin',
    };

    createNotification(notification);
    setNotifications(getAllNotifications());

    setToast({
      isVisible: true,
      message: formData.sendOption === 'NOW' 
        ? '알림이 전송되었습니다.' 
        : '알림이 예약되었습니다.',
      type: 'success'
    });

    // Reset form
    setFormData({
      title: '',
      content: '',
      type: 'SYSTEM',
      recipients: 'ALL',
      surface: 'ALL_SURFACES',
      ctaLabel: '',
      ctaUrl: '',
      sendOption: 'NOW',
      scheduledAt: ''
    });
    setShowCta(false);
    setErrors({});
    setIsCreating(false);
  };

  const handleResend = (notificationId) => {
    resendNotification(notificationId);
    setNotifications(getAllNotifications());
    setToast({
      isVisible: true,
      message: '알림이 재전송되었습니다.',
      type: 'success'
    });
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

  const getRecipientsLabel = (recipients) => {
    const labels = {
      ALL: '전체',
      CUSTOMERS: '고객',
      REAL_ESTATE_PARTNERS: '부동산 파트너',
      DELIVERY_PARTNERS: '딜리버리 파트너',
      ADMINS: '관리자'
    };
    return labels[recipients] || recipients;
  };

  const getSurfaceLabel = (surface) => {
    const labels = {
      ALL_SURFACES: '전체 표면',
      USER_WEB: '사용자 웹/앱',
      REAL_ESTATE_DASHBOARD: '부동산 대시보드',
      DELIVERY_DASHBOARD: '딜리버리 대시보드'
    };
    return labels[surface] || surface;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="default">초안</Badge>;
      case 'SCHEDULED':
        return <Badge variant="warning">예약됨</Badge>;
      case 'SENT':
        return <Badge variant="success">전송됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
          <p className="text-gray-600 mt-1">Manage and send platform notifications</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreating(true)}
        >
          <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Notification
        </Button>
      </div>

      {/* Create Notification Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setFormData({
            title: '',
            content: '',
            type: 'SYSTEM',
            recipients: 'ALL',
            surface: 'ALL_SURFACES',
            ctaLabel: '',
            ctaUrl: '',
            sendOption: 'NOW',
            scheduledAt: ''
          });
          setShowCta(false);
          setErrors({});
        }}
        title="Create New Notification"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            id="title"
            label="Title"
            required
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            placeholder="Enter notification title"
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (errors.content) setErrors({ ...errors, content: null });
              }}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent ${
                errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter notification content"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length}/10 characters minimum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="type"
              label="Type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'SYSTEM', label: 'System' },
                { value: 'FEATURE', label: 'Feature' },
                { value: 'POLICY', label: 'Policy' },
                { value: 'SECURITY', label: 'Security' }
              ]}
            />

            <Select
              id="recipients"
              label="Recipients"
              required
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              options={[
                { value: 'ALL', label: 'All' },
                { value: 'CUSTOMERS', label: 'Customers' },
                { value: 'REAL_ESTATE_PARTNERS', label: 'Real-Estate Partners' },
                { value: 'DELIVERY_PARTNERS', label: 'Delivery Partners' },
                { value: 'ADMINS', label: 'Admins' }
              ]}
            />
          </div>

          <Select
            id="surface"
            label="Surface"
            required
            value={formData.surface}
            onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
            options={[
              { value: 'ALL_SURFACES', label: 'All Surfaces' },
              { value: 'USER_WEB', label: 'User Web/App' },
              { value: 'REAL_ESTATE_DASHBOARD', label: 'Real-Estate Dashboard' },
              { value: 'DELIVERY_DASHBOARD', label: 'Delivery Dashboard' }
            ]}
          />

          {/* CTA Section */}
          <div>
            <button
              type="button"
              onClick={() => setShowCta(!showCta)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <svg
                className={`h-4 w-4 mr-2 transition-transform ${showCta ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              CTA Link (Optional)
            </button>
            {showCta && (
              <div className="mt-2 space-y-3 pl-6 border-l-2 border-gray-200">
                <Input
                  id="ctaLabel"
                  label="CTA Label"
                  value={formData.ctaLabel}
                  onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                  placeholder="e.g., View Details, Learn More"
                />
                <Input
                  id="ctaUrl"
                  label="CTA URL"
                  type="url"
                  value={formData.ctaUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, ctaUrl: e.target.value });
                    if (errors.ctaUrl) setErrors({ ...errors, ctaUrl: null });
                  }}
                  placeholder="https://example.com"
                  error={errors.ctaUrl}
                />
              </div>
            )}
          </div>

          {/* Send Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send Option</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sendOption"
                  value="NOW"
                  checked={formData.sendOption === 'NOW'}
                  onChange={(e) => setFormData({ ...formData, sendOption: e.target.value, scheduledAt: '' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Send Now</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sendOption"
                  value="SCHEDULE"
                  checked={formData.sendOption === 'SCHEDULE'}
                  onChange={(e) => setFormData({ ...formData, sendOption: e.target.value })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Schedule</span>
              </label>
            </div>
            {formData.sendOption === 'SCHEDULE' && (
              <div className="mt-3">
                <Input
                  id="scheduledAt"
                  label="Scheduled Date & Time"
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => {
                    setFormData({ ...formData, scheduledAt: e.target.value });
                    if (errors.scheduledAt) setErrors({ ...errors, scheduledAt: null });
                  }}
                  error={errors.scheduledAt}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setFormData({
                  title: '',
                  content: '',
                  type: 'SYSTEM',
                  recipients: 'ALL',
                  surface: 'ALL_SURFACES',
                  ctaLabel: '',
                  ctaUrl: '',
                  sendOption: 'NOW',
                  scheduledAt: ''
                });
                setShowCta(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateNotification}
            >
              {formData.sendOption === 'NOW' ? 'Send Notification' : 'Schedule Notification'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Sent</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-amber-100 text-amber-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100 text-gray-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">System</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.system}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100 text-purple-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Feature</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.feature}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h6v2a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Security</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.security}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surface
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At / Scheduled At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {notification.content}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(notification.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRecipientsLabel(notification.recipients)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSurfaceLabel(notification.surface)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(notification.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.status === 'SENT' 
                        ? formatDate(notification.sentAt)
                        : notification.status === 'SCHEDULED'
                        ? formatDate(notification.scheduledAt)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {notification.status === 'SENT' && (
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleResend(notification.id)}
                        >
                          Resend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AdminNotificationsPage;
