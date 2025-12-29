import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useI18n } from '../context/I18nContext';
import DashboardTopBar from '../components/layout/DashboardTopBar';
import getIconForMenu from '../components/icons/MenuIcon3D';

const realEstateMenu = [
  { key: 'dashboard', translationKey: 'nav.dashboard', path: '/business/real-estate/dashboard', group: null },
  { key: 'contracts', translationKey: 'nav.contracts', path: '/business/real-estate/contracts', group: null },
  { key: 'listings', translationKey: 'nav.properties', path: '/business/real-estate/listings', group: null },
  { key: 'reservations', translationKey: 'nav.reservations', path: '/business/real-estate/reservations', group: null },
  { key: 'leads', translationKey: 'nav.leads', path: '/business/real-estate/leads', group: null },
  { key: 'analytics', translationKey: 'nav.analytics', path: '/business/real-estate/analytics', group: null },
  { key: 'customers', translationKey: 'nav.customers', path: '/business/real-estate/customers', group: null },
  { key: 'reviews', translationKey: 'nav.reviews', path: '/business/real-estate/reviews', group: null },
  { key: 'discounts', translationKey: 'nav.discounts', path: '/business/real-estate/discounts', group: null },
  { key: 'settings', translationKey: 'nav.settings', path: '/business/real-estate/settings', group: null }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200/50 shadow-2xl z-10 backdrop-blur-sm">
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="h-20 flex items-center justify-center border-b border-gray-200/60 px-4 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dabang-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-dabang-primary/30">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">TOFU Business</h1>
                <p className="text-xs text-gray-500 font-medium">Real Estate</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1.5">
              {realEstateMenu.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
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

          {/* User Info */}
          <div className="border-t border-gray-200/60 p-4 bg-gradient-to-b from-white to-gray-50/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Business User'}</p>
                <p className="text-xs text-gray-500 font-medium">{t('nav.realEstatePartner')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-200 hover:text-red-700 rounded-xl transition-all duration-200 border border-gray-300/60 bg-white shadow-sm hover:shadow-md"
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
            showNotifications={true}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        {/* Content Area */}
        <main className="pt-20 p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RealEstateBusinessLayout;