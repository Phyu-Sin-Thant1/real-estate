import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useI18n } from '../context/I18nContext';
import DashboardTopBar from '../components/layout/DashboardTopBar';
import getIconForMenu from '../components/icons/MenuIcon3D';

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
  { key: 'discounts', translationKey: 'nav.discounts', path: '/admin/marketing/discounts', icon: '🎫' },
  { key: 'promotions', translationKey: 'nav.promotions', path: '/admin/marketing/promotions', icon: '📢' },
  { key: 'settings', translationKey: 'nav.settings', path: '/admin/settings', icon: '⚙️' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl border-r border-gray-200/50 flex flex-col backdrop-blur-sm">
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dabang-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-dabang-primary/30">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('nav.adminDashboard')}</h2>
              <p className="text-xs text-gray-500 font-medium">{t('nav.adminPanel')}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg shadow-dabang-primary/30 transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm hover:transform hover:scale-[1.01]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        {getIconForMenu(item.key, isActive)}
                      </span>
                      <span className="flex-1">{t(item.translationKey)}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200/60 bg-gradient-to-b from-white to-gray-50/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300/60 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
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
        <main className="flex-1 overflow-y-auto p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;