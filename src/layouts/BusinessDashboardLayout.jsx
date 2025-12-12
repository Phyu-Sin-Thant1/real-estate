import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { realEstateMenu, deliveryMenu, adminMenu } from '../config/businessMenu';
import { DeliveryQuotesProvider } from '../context/DeliveryQuotesContext';

const getMenuForUser = (user) => {
  if (!user) return realEstateMenu;

  if (user.role === 'BUSINESS_REAL_ESTATE') {
    return realEstateMenu;
  }

  if (user.role === 'BUSINESS_DELIVERY') {
    return deliveryMenu;
  }

  if (user.role === 'ADMIN') {
    return adminMenu;
  }

  return realEstateMenu;
};

const BusinessDashboardLayout = () => {
  const { user, logout } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = getMenuForUser(user);

  const getPageTitle = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname && !item.type
    );
    return currentItem ? currentItem.label : '비즈니스 대시보드';
  };

  const getRoleLabel = () => {
    if (user?.role === 'BUSINESS_REAL_ESTATE') return '부동산 파트너';
    if (user?.role === 'BUSINESS_DELIVERY') return '배송 파트너';
    if (user?.role === 'ADMIN') return '관리자';
    return '비즈니스 사용자';
  };

  return (
    <DeliveryQuotesProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">비즈니스 대시보드</h2>
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
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  웹사이트로 이동
                </button>
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </DeliveryQuotesProvider>
  );
};

export default BusinessDashboardLayout;