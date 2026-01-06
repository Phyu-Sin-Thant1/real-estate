import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useI18n } from '../context/I18nContext';
import { realEstateMenu, deliveryMenu } from '../config/businessMenu';
import DashboardTopBar from '../components/layout/DashboardTopBar';
import getIconForMenu from '../components/icons/MenuIcon3D';

const getMenuForUser = (user) => {
  if (!user) return realEstateMenu;

  if (user.role === 'BUSINESS_REAL_ESTATE') {
    return realEstateMenu;
  }

  if (user.role === 'BUSINESS_DELIVERY') {
    return deliveryMenu;
  }

  return realEstateMenu;
};

const BusinessDashboardLayout = () => {
  const { user, logout } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const menuItems = getMenuForUser(user);

  const getPageTitle = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname && !item.type
    );
    return currentItem ? t(currentItem.translationKey) : t('businessDashboard');
  };

  const getRoleLabel = () => {
    if (user?.role === 'BUSINESS_REAL_ESTATE') return t('realEstatePartner');
    if (user?.role === 'BUSINESS_DELIVERY') return t('deliveryPartner');
    if (user?.role === 'ADMIN') return t('adminPanel');
    return t('businessUser');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex overflow-hidden">
      {/* Sidebar - Fixed */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-2xl border-r border-gray-200/50 flex flex-col backdrop-blur-sm z-50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dabang-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-dabang-primary/30">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('businessDashboard')}</h2>
              <p className="text-xs text-gray-500 font-medium">{getRoleLabel()}</p>
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
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Bar - Fixed */}
        <div className="flex-shrink-0 z-40">
          <DashboardTopBar 
            title={getPageTitle()}
            showSearch={false}
            showViewWebsite={true}
            showNotifications={true}
            user={user}
            onLogout={handleLogout}
          />
        </div>
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboardLayout;