import React from 'react';
import { adminKpis, partners, users, deliveryOrders } from '../../mock/adminData';

const AdminDashboardHomePage = () => {
  // Combine recent activities from partners, users, and orders
  const recentActivities = [
    ...partners.slice(0, 2).map(partner => ({
      id: partner.id,
      type: 'Partner',
      action: 'Registered',
      name: partner.companyName,
      time: partner.createdAt,
      status: partner.status
    })),
    ...users.slice(0, 2).map(user => ({
      id: user.id,
      type: 'User',
      action: 'Signed Up',
      name: user.name,
      time: user.lastLoginAt,
      status: user.status
    })),
    ...deliveryOrders.slice(0, 1).map(order => ({
      id: order.id,
      type: 'Order',
      action: 'Created',
      name: order.orderNo,
      time: order.createdAt,
      status: order.status
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  // KPI Cards
  const KpiCard = ({ title, value, icon, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 p-3 rounded-lg bg-dabang-primary/10 text-dabang-primary">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Recent Activity Item
  const ActivityItem = ({ activity }) => (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-dabang-primary/10 flex items-center justify-center">
            <span className="text-dabang-primary text-sm font-medium">
              {activity.type.charAt(0)}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {activity.type} {activity.action}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {activity.time.split(' ')[0]}
          </p>
        </div>
      </div>
    </li>
  );

  // Simple Bar Chart Component
  const BarChart = () => (
    <div className="h-64 flex items-end space-x-2">
      {[65, 80, 45, 90, 70, 85, 60].map((height, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-dabang-primary rounded-t hover:bg-dabang-primary/80 transition-colors"
            style={{ height: `${height}%` }}
          ></div>
          <span className="text-xs text-gray-500 mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Users" value={adminKpis.totalUsers} icon="👥" />
        <KpiCard title="Total Partners" value={adminKpis.totalPartners} icon="🏢" />
        <KpiCard title="Active Listings" value={adminKpis.activeListings} icon="🏠" subtitle="Real-Estate" />
        <KpiCard title="Today's Orders" value={adminKpis.todayOrders} icon="🚚" subtitle="Delivery" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </ul>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
          <BarChart />
          <div className="mt-4 flex justify-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-dabang-primary mr-2"></div>
              <span className="text-sm text-gray-600">Weekly Performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;