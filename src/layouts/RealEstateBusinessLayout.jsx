import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useI18n } from '../context/I18nContext';
import DashboardTopBar from '../components/layout/DashboardTopBar';

const realEstateMenu = [
  { key: 'dashboard', translationKey: 'nav.dashboard', path: '/business/real-estate/dashboard' },
  { key: 'contracts', translationKey: 'nav.contracts', path: '/business/real-estate/contracts' },
  { key: 'listings', translationKey: 'nav.properties', path: '/business/real-estate/listings' },
  { key: 'reservations', translationKey: 'nav.reservations', path: '/business/real-estate/reservations' },
  { key: 'leads', translationKey: 'nav.leads', path: '/business/real-estate/leads' },
  { key: 'analytics', translationKey: 'nav.analytics', path: '/business/real-estate/analytics' },
  { key: 'customers', translationKey: 'nav.customers', path: '/business/real-estate/customers' },
  { key: 'settings', translationKey: 'nav.settings', path: '/business/real-estate/settings' }
];

const RealEstateBusinessLayout = () => {
  const { user, logout } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const getPageTitle = () => {
    const currentItem = realEstateMenu.find(
      (item) => item.path === location.pathname
    );
    return currentItem ? t(currentItem.translationKey) : t('nav.businessDashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
            <h1 className="text-xl font-bold text-dabang-primary">TOFU Business</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {realEstateMenu.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-dabang-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {t(item.translationKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Business User'}</p>
                <p className="text-xs text-gray-500">{t('nav.realEstatePartner')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="fixed top-0 right-0 left-64 z-10">
          <DashboardTopBar 
            title={getPageTitle()}
            showSearch={false}
            showViewWebsite={true}
            showNotifications={false}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        {/* Content Area */}
        <main className="pt-20 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RealEstateBusinessLayout;