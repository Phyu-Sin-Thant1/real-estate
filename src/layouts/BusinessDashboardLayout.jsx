import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BASE_MENU = [
  { key: 'overview', label: '대시보드', path: '/business/dashboard' },
  { key: 'calendar', label: '일정', path: '/business/calendar' },
  { key: 'customers', label: '고객 관리', path: '/business/customers' },
];

const REAL_ESTATE_MENU = [
  { key: 'listings', label: '매물 관리', path: '/business/listings' },
  { key: 'inquiries', label: '문의/리드', path: '/business/inquiries' },
  { key: 'viewings', label: '방문 일정', path: '/business/viewings' },
  { key: 'deals', label: '계약 내역', path: '/business/deals' },
];

const DELIVERY_MENU = [
  { key: 'requests', label: '견적/신청 관리', path: '/business/requests' },
  { key: 'jobs', label: '작업/배차 관리', path: '/business/jobs' },
  { key: 'pricing', label: '요금 설정', path: '/business/pricing' },
];

const getMenuForUser = (user) => {
  if (!user) return BASE_MENU;

  if (user.role === 'BUSINESS_REAL_ESTATE') {
    return [...BASE_MENU, ...REAL_ESTATE_MENU];
  }

  if (user.role === 'BUSINESS_DELIVERY') {
    return [...BASE_MENU, ...DELIVERY_MENU];
  }

  if (user.role === 'ADMIN') {
    return [
      ...BASE_MENU,
      { type: 'section', label: '부동산 파트너' },
      ...REAL_ESTATE_MENU,
      { type: 'section', label: '딜리버리 파트너' },
      ...DELIVERY_MENU,
    ];
  }

  return BASE_MENU;
};

const BusinessDashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
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
              {menuItems.map((item, index) => {
                // Render section label
                if (item.type === 'section') {
                  return (
                    <li key={`section-${index}`} className="mt-4 mb-2 first:mt-0">
                      <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.label}
                        </p>
                      </div>
                    </li>
                  );
                }

                // Render menu item
                return (
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
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Business User'}</p>
                <p className="text-xs text-gray-500">{getRoleLabel()}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-10">
          <div className="h-full flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold text-gray-900">비즈니스 대시보드</h2>
            <div className="flex items-center gap-4">
              {/* Notifications placeholder */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
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

export default BusinessDashboardLayout;
