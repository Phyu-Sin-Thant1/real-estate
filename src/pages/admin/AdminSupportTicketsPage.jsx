import React, { useState, useEffect, useMemo } from 'react';
import { getAllTickets, getTicketById, createTicket, getTicketMessages } from '../../store/supportTicketsStore';
import { mockSupportTickets, mockTicketMessages } from '../../mocks/supportTicketsMock';
import TicketDetailDrawer from '../../components/admin/TicketDetailDrawer';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Toast from '../../components/delivery/Toast';
import { addTicketMessage } from '../../store/supportTicketsStore';

const AdminSupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  // Filter state
  const [activeTab, setActiveTab] = useState('ALL');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [complaintFilter, setComplaintFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize mock data if store is empty
  useEffect(() => {
    const existingTickets = getAllTickets();
    if (existingTickets.length === 0) {
      // Initialize with mock data
      mockSupportTickets.forEach(ticket => {
        const existing = getAllTickets().find(t => t.id === ticket.id);
        if (!existing) {
          createTicket(ticket);
        }
      });
      
      // Initialize messages
      Object.keys(mockTicketMessages).forEach(ticketId => {
        mockTicketMessages[ticketId].forEach(msg => {
          const existing = getTicketMessages(ticketId);
          if (!existing.find(m => m.id === msg.id)) {
            addTicketMessage(msg);
          }
        });
      });
    }
    setTickets(getAllTickets());
  }, []);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Tab filter (status)
    if (activeTab !== 'ALL') {
      filtered = filtered.filter(t => t.status === activeTab);
    }

    // Domain filter
    if (domainFilter !== 'ALL') {
      filtered = filtered.filter(t => t.domain === domainFilter);
    }

    // Complaint filter
    if (complaintFilter === 'COMPLAINTS_ONLY') {
      filtered = filtered.filter(t => t.isComplaint === true);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(query) ||
        (t.userEmail && t.userEmail.toLowerCase().includes(query)) ||
        (t.userName && t.userName.toLowerCase().includes(query)) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(query)) ||
        t.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tickets, activeTab, domainFilter, complaintFilter, priorityFilter, searchQuery]);

  // Calculate stats based on filtered tickets
  const stats = useMemo(() => {
    return {
      open: filteredTickets.filter(t => t.status === 'OPEN').length,
      inProgress: filteredTickets.filter(t => t.status === 'IN_PROGRESS').length,
      waitingUser: filteredTickets.filter(t => t.status === 'WAITING_USER').length,
      resolved: filteredTickets.filter(t => t.status === 'RESOLVED').length
    };
  }, [filteredTickets]);

  const handleViewTicket = (ticketId) => {
    const ticket = getTicketById(ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedTicket(null);
    // Refresh tickets
    setTickets(getAllTickets());
  };

  const handleUpdate = () => {
    // Refresh tickets after update
    setTickets(getAllTickets());
  };

  const getDomainBadge = (domain) => {
    const labels = {
      DELIVERY: { label: '딜리버리', variant: 'primary' },
      REAL_ESTATE: { label: '부동산', variant: 'success' },
      PAYMENT: { label: '결제', variant: 'warning' },
      ACCOUNT: { label: '계정', variant: 'default' },
      BUG_REPORT: { label: '버그 신고', variant: 'danger' },
      ETC: { label: '기타', variant: 'secondary' }
    };
    const config = labels[domain] || { label: domain, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="danger">미처리</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">처리중</Badge>;
      case 'WAITING_USER':
        return <Badge variant="warning">사용자 응답 대기</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">완료</Badge>;
      case 'CLOSED':
        return <Badge>닫힘</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">긴급</Badge>;
      case 'HIGH':
        return <Badge variant="warning">높음</Badge>;
      case 'NORMAL':
        return <Badge variant="default">보통</Badge>;
      case 'LOW':
        return <Badge>낮음</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const tabs = [
    { key: 'ALL', label: '전체' },
    { key: 'OPEN', label: '미처리' },
    { key: 'IN_PROGRESS', label: '처리중' },
    { key: 'WAITING_USER', label: '사용자 응답 대기' },
    { key: 'RESOLVED', label: '완료' }
  ];

  const domains = [
    { value: 'ALL', label: '전체' },
    { value: 'DELIVERY', label: '딜리버리' },
    { value: 'REAL_ESTATE', label: '부동산' },
    { value: 'PAYMENT', label: '결제' },
    { value: 'ACCOUNT', label: '계정' },
    { value: 'BUG_REPORT', label: '버그 신고' },
    { value: 'ETC', label: '기타' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">지원/문의</h1>
        <p className="text-gray-600 mt-1">고객 문의 및 불만 티켓을 관리합니다.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white border-transparent shadow-lg shadow-dabang-primary/30'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">미처리</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">처리중</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-amber-100 text-amber-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">사용자 응답 대기</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.waitingUser}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100 text-green-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">완료</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            id="domain"
            label="도메인"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            options={domains}
          />
          <Select
            id="complaint"
            label="불만"
            value={complaintFilter}
            onChange={(e) => setComplaintFilter(e.target.value)}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'COMPLAINTS_ONLY', label: '불만만' }
            ]}
          />
          <Select
            id="priority"
            label="우선순위"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'URGENT', label: '긴급' },
              { value: 'HIGH', label: '높음' },
              { value: 'NORMAL', label: '보통' },
              { value: 'LOW', label: '낮음' }
            ]}
          />
          <div className="md:col-span-2">
            <Input
              id="search"
              label="검색"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="티켓 ID, 이메일, 참조 ID, 키워드..."
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              setDomainFilter('ALL');
              setComplaintFilter('ALL');
              setPriorityFilter('ALL');
              setSearchQuery('');
            }}
          >
            필터 초기화
          </Button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    티켓이 없습니다
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDomainBadge(ticket.domain)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.isComplaint ? (
                        <Badge variant="danger">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.referenceType && ticket.referenceId
                        ? `${ticket.referenceType}: ${ticket.referenceId}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.assigneeName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleViewTicket(ticket.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Drawer */}
      <TicketDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        ticket={selectedTicket}
        onUpdate={handleUpdate}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AdminSupportTicketsPage;
