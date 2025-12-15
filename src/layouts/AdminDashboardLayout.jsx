import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { key: 'partners', label: 'Partners', path: '/admin/partners', icon: '🏢' },
  { key: 'users', label: 'Users', path: '/admin/users', icon: '👥' },
  { key: 'realEstate', label: 'Real-Estate Oversight', path: '/admin/real-estate', icon: '🏠' },
  { key: 'delivery', label: 'Delivery Oversight', path: '/admin/delivery', icon: '🚚' },
  { key: 'approvals', label: 'Approvals & Reviews', path: '/admin/approvals', icon: '✅' },
  { key: 'finance', label: 'Payments & Settlement', path: '/admin/finance/settlements', icon: '💰' },
  { key: 'pricing', label: 'Commissions & Pricing', path: '/admin/finance/rules', icon: '📋' },
  { key: 'support', label: 'Support & Tickets', path: '/admin/support/tickets', icon: '🎫' },
  { key: 'reports', label: 'Reports & Analytics', path: '/admin/reports', icon: '📈' },
  { key: 'notifications', label: 'Notifications', path: '/admin/notifications', icon: '🔔' },
  { key: 'roles', label: 'Roles & Permissions', path: '/admin/security/roles', icon: '🔒' },
  { key: 'audit', label: 'Audit Logs', path: '/admin/security/audit-logs', icon: '📝' },
  { key: 'system', label: 'System Status', path: '/admin/system/status', icon: '⚙️' },
  { key: 'content', label: 'News / Content', path: '/admin/content/news', icon: '📰' },
  { key: 'settings', label: 'Settings', path: '/admin/settings', icon: '⚙️' }
];

const AdminDashboardLayout = () => {
  const { user, logout } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Admin Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    // Navigate to profile page if exists
    console.log('Profile clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">관리자 패널</p>
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
                  {item.label}
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
              <div className="flex items-center space-x-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Notification Bell */}
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                
                {/* View Website Button */}
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Website
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button className="flex items-center text-sm rounded-full focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-dabang-primary flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <span className="ml-2 text-gray-700 hidden sm:block">{user?.name || 'Admin'}</span>
                    <svg className="ml-1 w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;