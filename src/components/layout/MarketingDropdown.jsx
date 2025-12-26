import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';

const MarketingDropdown = ({ items, basePath = '' }) => {
  const { t } = useI18n();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-expand if current route is within marketing section
  useEffect(() => {
    const isMarketingRoute = location.pathname.includes('/marketing/') || 
                            location.pathname.includes('/discounts') || 
                            location.pathname.includes('/promotions');
    setIsOpen(isMarketingRoute);
  }, [location.pathname]);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      {/* Parent Menu Item */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
          isOpen
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm'
        }`}
      >
        <span>마케팅</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Child Menu Items */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="pl-5 pt-2 space-y-1">
          {items.map((item) => {
            // Handle path construction: if item.path already includes the full path, use it; otherwise construct it
            let fullPath;
            if (item.path.startsWith('/')) {
              // Already a full path
              fullPath = item.path;
            } else if (basePath) {
              // Construct path with basePath
              fullPath = `${basePath}/marketing/${item.path}`;
            } else {
              // Fallback
              fullPath = item.path;
            }
            
            const isActive = location.pathname === fullPath || 
                           location.pathname.startsWith(fullPath + '/') ||
                           (item.path === 'discounts' && location.pathname.includes('/discounts')) ||
                           (item.path === 'promotions' && location.pathname.includes('/promotions'));
            
            return (
              <li key={item.key}>
                <NavLink
                  to={fullPath}
                  className={({ isActive: navIsActive }) =>
                    `flex items-center px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      navIsActive || isActive
                        ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-md shadow-dabang-primary/30'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm'
                    }`
                  }
                >
                  {item.icon && <span className="mr-2 text-sm">{item.icon}</span>}
                  {t(item.translationKey)}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
};

export default MarketingDropdown;

