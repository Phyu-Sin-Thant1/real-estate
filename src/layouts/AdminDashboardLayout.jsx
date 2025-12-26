import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useI18n } from '../context/I18nContext';
import DashboardTopBar from '../components/layout/DashboardTopBar';
import MarketingDropdown from '../components/layout/MarketingDropdown';

const menuItems = [
  { key: 'dashboard', translationKey: 'nav.dashboard', path: '/admin/dashboard', icon: '📊' },
  { key: 'partners', translationKey: 'nav.partners', path: '/admin/partners', icon: '🏢' },
  { key: 'users', translationKey: 'nav.users', path: '/admin/users', icon: '👥' },
  { key: 'realEstate', translationKey: 'nav.realEstateOversight', path: '/admin/real-estate', icon: '🏠' },
  { key: 'delivery', translationKey: 'nav.deliveryOversight', path: '/admin/delivery', icon: '🚚' },
  { key: 'approvals', translationKey: 'nav.approvalsReviews', path: '/admin/approvals', icon: '✅' },
  { key: 'finance', translationKey: 'nav.paymentsSettlement', path: '/admin/finance/settlements', icon: '💰' },
  { key: 'pricing', translationKey: 'nav.commissionsPricing', path: '/admin/finance/rules', icon: '📋' },
  { key: 'support', translationKey: 'nav.supportTickets', path: '/admin/support/tickets', icon: '🎫' },
  { key: 'reports', translationKey: 'nav.reportsAnalytics', path: '/admin/reports', icon: '📈' },
  { key: 'notifications', translationKey: 'nav.notifications', path: '/admin/notifications', icon: '🔔' },
  { key: 'roles', translationKey: 'nav.rolesPermissions', path: '/admin/security/roles', icon: '🔒' },
  { key: 'audit', translationKey: 'nav.auditLogs', path: '/admin/security/audit-logs', icon: '📝' },
  { key: 'system', translationKey: 'nav.systemStatus', path: '/admin/system/status', icon: '⚙️' },
  { key: 'content', translationKey: 'nav.newsContent', path: '/admin/content/news', icon: '📰' },
  { key: 'banners', translationKey: 'nav.banners', path: '/admin/content/banners', icon: '🖼️' },
  { key: 'reviews', translationKey: 'nav.reviews', path: '/admin/reviews', icon: '⭐' },
  { key: 'settings', translationKey: 'nav.settings', path: '/admin/settings', icon: '⚙️' }
];

const marketingItems = [
  { key: 'discounts', translationKey: 'nav.discounts', path: 'discounts', icon: '🎫' },
  { key: 'promotions', translationKey: 'nav.promotions', path: 'promotions', icon: '📢' }
];

const AdminDashboardLayout = () => {
  const { user, logout } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? t(currentItem.translationKey) : t('nav.adminDashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t('nav.adminDashboard')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('nav.adminPanel')}</p>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-dabang-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {t(item.translationKey)}
                </NavLink>
              </li>
            ))}
            {/* Marketing Dropdown */}
            <MarketingDropdown items={marketingItems} basePath="/admin" />
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <DashboardTopBar 
          title={getPageTitle()}
          showSearch={true}
          showViewWebsite={true}
          showNotifications={true}
          user={user}
          onLogout={handleLogout}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;