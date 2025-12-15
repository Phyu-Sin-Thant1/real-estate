import React, { useState } from 'react';
import { analyticsSummary } from '../../mock/adminData';

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [dateRange, setDateRange] = useState('monthly');

  const tabs = [
    { key: 'users', label: 'User Growth' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'listings', label: 'Listings' }
  ];

  const dateRanges = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'yearly', label: 'Yearly' }
  ];

  // Simple bar chart component
  const BarChart = ({ data, dataKey, labelKey, color = 'bg-dabang-primary' }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="h-64 flex items-end space-x-2 pt-4">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item[dataKey] / maxValue) * 90 : 0;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div className="text-xs text-gray-500 mb-1">
                  {typeof item[dataKey] === 'number' 
                    ? item[dataKey].toLocaleString() 
                    : item[dataKey]}
                </div>
                <div 
                  className={`${color} rounded-t w-full hover:opacity-75 transition-opacity`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">
                {item[labelKey]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">View platform analytics and generate reports</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.key
                    ? 'bg-dabang-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            {dateRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setDateRange(range.key)}
                className={`px-3 py-1 text-sm rounded-md ${
                  dateRange === range.key
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {tabs.find(t => t.key === activeTab)?.label} Trend
        </h2>
        <div className="mt-4">
          {activeTab === 'users' && (
            <BarChart 
              data={analyticsSummary.userGrowth} 
              dataKey="users" 
              labelKey="month" 
              color="bg-blue-500"
            />
          )}
          {activeTab === 'revenue' && (
            <BarChart 
              data={analyticsSummary.revenue} 
              dataKey="amount" 
              labelKey="month" 
              color="bg-green-500"
            />
          )}
          {activeTab === 'listings' && (
            <BarChart 
              data={analyticsSummary.listings} 
              dataKey="count" 
              labelKey="month" 
              color="bg-purple-500"
            />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsSummary.userGrowth[analyticsSummary.userGrowth.length - 1]?.users?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +5.2% from last month
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100 text-green-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(analyticsSummary.revenue[analyticsSummary.revenue.length - 1]?.amount || 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +8.7% from last month
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100 text-purple-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsSummary.listings[analyticsSummary.listings.length - 1]?.count?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +3.1% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">User Demographics</div>
            <div className="text-sm text-gray-500 mt-1">Age, location, interests</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">Traffic Sources</div>
            <div className="text-sm text-gray-500 mt-1">Marketing channels performance</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">Conversion Rates</div>
            <div className="text-sm text-gray-500 mt-1">Signup and transaction funnel</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">Export Data</div>
            <div className="text-sm text-gray-500 mt-1">Download reports in CSV/Excel</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;