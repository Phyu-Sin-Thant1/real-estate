import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';

const realEstateMenu = [
  { key: 'dashboard', label: '대시보드', path: '/business/real-estate/dashboard' },
  { key: 'contracts', label: '계약 내역', path: '/business/real-estate/contracts' },
  { key: 'listings', label: '매물 관리', path: '/business/real-estate/listings' },
  { key: 'leads', label: '문의 / 리드 관리', path: '/business/real-estate/leads' },
  { key: 'analytics', label: '정산 / 통계', path: '/business/real-estate/analytics' },
  { key: 'customers', label: '고객 관리', path: '/business/real-estate/customers' },
  { key: 'settings', label: '설정', path: '/business/real-estate/settings' }
];

const RealEstateBusinessLayout = () => {
  const { user, logout } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const currentItem = realEstateMenu.find(
      (item) => item.path === location.pathname
    );
    return currentItem ? currentItem.label : '비즈니스 대시보드';
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
                    {item.label}
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
                <p className="text-xs text-gray-500">부동산 파트너</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                웹사이트로 이동
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-10">
          <div className="h-full flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                웹사이트로 이동
              </button>
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-dabang-primary flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RealEstateBusinessLayout;