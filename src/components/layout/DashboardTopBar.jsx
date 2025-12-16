import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';
import LanguageToggle from '../common/LanguageToggle';
import NotificationBell from '../business/NotificationBell';

const DashboardTopBar = ({ 
  title, 
  showSearch = false, 
  showViewWebsite = true,
  showNotifications = false,
  user,
  onLogout
}) => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {/* Debug checkpoint */}
            <span className="text-xs text-gray-400">lang: {lang}</span>
            
            {/* Search Input */}
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Notification Bell */}
            {showNotifications && <NotificationBell />}
            
            {/* Language Toggle */}
            <LanguageToggle />
            
            {/* View Website Button */}
            {showViewWebsite && (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('common.viewWebsite')}
              </button>
            )}
            
            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-dabang-primary flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="ml-2 text-gray-700 hidden sm:block">{user?.name || 'User'}</span>
                  <svg className="ml-1 w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;

