import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useI18n } from '../context/I18nContext';
import { realEstateMenu, deliveryMenu } from '../config/businessMenu';
import DashboardTopBar from '../components/layout/DashboardTopBar';

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
    return currentItem ? t(currentItem.translationKey) : t('nav.businessDashboard');
  };

  const getRoleLabel = () => {
    if (user?.role === 'BUSINESS_REAL_ESTATE') return t('nav.realEstatePartner');
    if (user?.role === 'BUSINESS_DELIVERY') return t('nav.deliveryPartner');
    if (user?.role === 'ADMIN') return t('nav.adminPanel');
    return t('nav.businessUser');
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
          <h2 className="text-xl font-bold text-gray-900">{t('nav.businessDashboard')}</h2>
          <p className="text-sm text-gray-500 mt-1">{getRoleLabel()}</p>
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
                  {t(item.translationKey)}
                </NavLink>
              </li>
            ))}
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
          showSearch={false}
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

export default BusinessDashboardLayout;