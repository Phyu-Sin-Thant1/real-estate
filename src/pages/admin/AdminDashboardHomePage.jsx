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
        <KpiCard title="Total Users" value={kpis.totalUsers} icon="👥" />
        <KpiCard title="Total Partners" value={kpis.totalPartners} icon="🏢" />
        <KpiCard title="Active Listings" value={kpis.activeListings} icon="🏠" subtitle="Real-Estate" />
        <KpiCard title="Today's Orders" value={kpis.todayOrders} icon="🚚" subtitle="Delivery" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="flow-root">
            {recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
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