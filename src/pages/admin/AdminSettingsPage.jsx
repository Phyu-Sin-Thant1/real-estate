import React, { useState } from 'react';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('platform');

  const tabs = [
    { key: 'platform', label: 'Platform Policy' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'access', label: 'Access Control' },
    { key: 'audit', label: 'Audit Retention' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage platform configuration and policies</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-dabang-primary text-dabang-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Platform Policy Tab */}
      {activeTab === 'platform' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Policy Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms of Service
              </label>
              <textarea
                rows={6}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
                placeholder="Enter terms of service..."
                defaultValue="These terms govern your use of the TOFU platform. By accessing or using our services, you agree to be bound by these terms and all applicable laws and regulations."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Policy
              </label>
              <textarea
                rows={6}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
                placeholder="Enter privacy policy..."
                defaultValue="We are committed to protecting your privacy. This policy describes how we collect, use, and protect your personal information when you use our services."
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Send email notifications for important events</p>
              </div>
              <button
                type="button"
                className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
              >
                <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200">
                  <span className="opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Send SMS notifications for urgent alerts</p>
              </div>
              <button
                type="button"
                className="bg-dabang-primary relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
              >
                <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200">
                  <span className="opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                    <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.708-2.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">In-App Notifications</h3>
                <p className="text-sm text-gray-500">Show notifications within the application</p>
              </div>
              <button
                type="button"
                className="bg-dabang-primary relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
              >
                <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200">
                  <span className="opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                    <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.708-2.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Control Tab */}
      {activeTab === 'access' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Access Control</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Whitelist
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
                placeholder="Enter whitelisted IP addresses, one per line..."
                defaultValue="192.168.1.100&#10;10.0.0.50&#10;203.0.113.0/24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Permissions
              </label>
              <div className="border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Read
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Write
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Admin
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Editor
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Viewer
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Retention Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Audit Log Retention</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retention Period
              </label>
              <select className="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary">
                <option>30 days</option>
                <option selected>90 days</option>
                <option>180 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Audit logs older than the selected period will be automatically deleted.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Types to Retain
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="user-actions"
                    name="user-actions"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                  <label htmlFor="user-actions" className="ml-3 text-sm text-gray-700">
                    User Actions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="system-events"
                    name="system-events"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                  <label htmlFor="system-events" className="ml-3 text-sm text-gray-700">
                    System Events
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="security-events"
                    name="security-events"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                  <label htmlFor="security-events" className="ml-3 text-sm text-gray-700">
                    Security Events
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="api-calls"
                    name="api-calls"
                    type="checkbox"
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                  <label htmlFor="api-calls" className="ml-3 text-sm text-gray-700">
                    API Calls
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;