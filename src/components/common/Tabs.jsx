import React from 'react';

const Tabs = ({ 
  tabs = [], 
  activeTab, 
  onTabChange,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-2 rounded-full bg-admin-accent/60 p-1 text-sm ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-4 py-1.5 font-semibold transition ${
            activeTab === tab
              ? 'bg-white text-admin-primary shadow'
              : 'text-admin-muted hover:bg-white/60'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;