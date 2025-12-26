import React, { useMemo } from 'react';
import { getApprovals } from '../../store/approvalsStore';
import { getListings } from '../../store/realEstateListingsStore';
import { getFlaggedOrders } from '../../store/deliveryOrdersStore';
import { getBusinessAccounts } from '../../store/businessAccountsStore';
import { getAllTickets } from '../../store/supportTicketsStore';

const AdminDashboardHomePage = () => {
  // Get data from stores
  const approvals = getApprovals();
  const listings = getListings();
  const flaggedOrders = getFlaggedOrders();
  const businessAccounts = getBusinessAccounts();
  const tickets = getAllTickets();

  // Calculate KPIs from stores
  const kpis = useMemo(() => {
    const activeListings = listings.filter(l => l.status === 'LIVE').length;
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = flaggedOrders.filter(o => 
      o.createdAt && o.createdAt.startsWith(today)
    ).length;

    return {
      totalUsers: 150, // Mock - would come from user store
      totalPartners: businessAccounts.length,
      activeListings,
      todayOrders,
    };
  }, [listings, flaggedOrders, businessAccounts]);

  // Build recent activities from stores
  const recentActivities = useMemo(() => {
    const activities = [];

    // Partner applications submitted
    const recentApprovals = approvals
      .filter(a => a.status === 'PENDING')
      .slice(0, 3)
      .map(approval => ({
        id: approval.id,
        type: approval.type === 'PARTNER_APPLICATION' ? 'Partner Application' : 'Listing Submission',
        action: 'Submitted',
        name: approval.meta?.partnerName || approval.submittedBy,
        time: approval.submittedAt,
        status: approval.status,
      }));

    // Disputes created
    const recentDisputes = flaggedOrders
      .filter(o => o.disputeStatus === 'OPEN')
      .slice(0, 2)
      .map(order => ({
        id: order.id,
        type: 'Dispute',
        action: 'Created',
        name: order.orderNo,
        time: order.createdAt,
        status: order.disputeStatus,
      }));

    // Tickets submitted
    const recentTickets = tickets
      .filter(t => t.status === 'OPEN')
      .slice(0, 2)
      .map(ticket => ({
        id: ticket.id,
        type: 'Ticket',
        action: 'Submitted',
        name: ticket.subject || `Ticket #${ticket.id.slice(-6)}`,
        time: ticket.createdAt,
        status: ticket.status,
      }));

    return [...recentApprovals, ...recentDisputes, ...recentTickets]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }, [approvals, flaggedOrders, tickets]);

  // KPI Cards
  const KpiCard = ({ title, value, icon, subtitle, gradient }) => {
    const gradients = gradient || 'from-blue-500 to-blue-600';
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
        {/* Decorative gradient overlay */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
        
        <div className="flex items-center relative z-10">
          <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${gradients} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Recent Activity Item
  const ActivityItem = ({ activity }) => (
    <li className="py-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent rounded-xl px-3 transition-all duration-200 -mx-3">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-dabang-primary to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">
              {activity.type.charAt(0)}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {activity.name}
          </p>
          <p className="text-sm text-gray-600 truncate mt-0.5">
            {activity.type} {activity.action}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">
            {activity.time.split(' ')[0]}
          </p>
        </div>
      </div>
    </li>
  );

  // Simple Bar Chart Component
  const BarChart = () => (
    <div className="h-64 flex items-end space-x-3">
      {[65, 80, 45, 90, 70, 85, 60].map((height, index) => (
        <div key={index} className="flex flex-col items-center flex-1 group">
          <div 
            className="w-full bg-gradient-to-t from-dabang-primary to-indigo-500 rounded-t-lg hover:from-indigo-600 hover:to-dabang-primary transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            style={{ height: `${height}%` }}
          ></div>
          <span className="text-xs text-gray-600 font-medium mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-dabang-primary/10 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-dabang-primary/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Welcome to your admin dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Users" value={kpis.totalUsers} icon="👥" gradient="from-blue-500 to-blue-600" />
        <KpiCard title="Total Partners" value={kpis.totalPartners} icon="🏢" gradient="from-emerald-500 to-emerald-600" />
        <KpiCard title="Active Listings" value={kpis.activeListings} icon="🏠" subtitle="Real-Estate" gradient="from-purple-500 to-purple-600" />
        <KpiCard title="Today's Orders" value={kpis.todayOrders} icon="🚚" subtitle="Delivery" gradient="from-orange-500 to-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="flow-root">
            {recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200/60">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="font-medium">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-dabang-primary to-indigo-600"></div>
              <span className="text-xs font-semibold text-gray-700">Weekly Performance</span>
            </div>
          </div>
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;