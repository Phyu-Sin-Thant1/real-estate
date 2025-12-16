import React, { useEffect, useMemo, useState } from 'react';
import { getAllTickets, updateTicket } from '../../store/supportTicketsStore';

const AdminSupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [issueFilter, setIssueFilter] = useState('ALL');
  const [noteInput, setNoteInput] = useState({});

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  useEffect(() => {
    setTickets(getAllTickets());
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const statusMatch = statusFilter === 'ALL' || ticket.status === statusFilter;
      const issueMatch = issueFilter === 'ALL' || (ticket.issueType || 'OTHER') === issueFilter;
      return statusMatch && issueMatch;
    });
  }, [tickets, statusFilter, issueFilter]);

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const persistTickets = (next) => {
    setTickets(next);
  };

  const handleAssignTicket = (ticketId, agent) => {
    const next = updateTicket(ticketId, { assignedTo: agent, status: 'IN_PROGRESS' });
    persistTickets(next);
  };

  const handleResolveTicket = (ticketId) => {
    const next = updateTicket(ticketId, { status: 'RESOLVED' });
    persistTickets(next);
    setSelectedTickets(prev => prev.filter(id => id !== ticketId));
  };

  const handleStatusChange = (ticketId, status) => {
    const next = updateTicket(ticketId, { status });
    persistTickets(next);
  };

  const handleAddNote = (ticketId) => {
    const note = noteInput[ticketId];
    if (!note || !note.trim()) return;
    const next = updateTicket(ticketId, {
      internalNotes: [
        ...(tickets.find((t) => t.id === ticketId)?.internalNotes || []),
        { at: new Date().toISOString(), note }
      ]
    });
    persistTickets(next);
    setNoteInput((prev) => ({ ...prev, [ticketId]: '' }));
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support & Tickets</h1>
        <p className="text-gray-600 mt-1">Manage customer support tickets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100 text-red-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'OPEN').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'IN_PROGRESS').length}
              </p>
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
              <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'RESOLVED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100 text-purple-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Unassigned</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => !t.assignedTo).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              {['ALL', 'DELIVERY', 'REAL_ESTATE', 'ACCOUNT', 'OTHER'].map((iss) => (
                <option key={iss} value={iss}>
                  {iss === 'ALL' ? 'All Issue Types' : iss.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters Button - Secondary Action */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setIssueFilter('ALL');
            }}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Related
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.issueType || 'OTHER'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.relatedEntityType === 'DELIVERY_ORDER' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                        배송: {ticket.relatedEntityId || '-'}
                      </span>
                    )}
                    {ticket.relatedEntityType === 'REAL_ESTATE_LISTING' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        매물: {ticket.relatedEntityId || '-'}
                      </span>
                    )}
                    {!ticket.relatedEntityType || ticket.relatedEntityType === 'NONE' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">없음</span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.partnerName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
                    <div className="flex items-center space-x-2 justify-end">
                      <select
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className="text-sm rounded border-gray-300 focus:border-dabang-primary focus:ring-dabang-primary"
                        value={ticket.status}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      {ticket.status === 'OPEN' && (
                        <select
                          onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
                          className="text-sm rounded border-gray-300 focus:border-dabang-primary focus:ring-dabang-primary"
                          value={ticket.assignedTo || ''}
                        >
                          <option value="">Assign...</option>
                          <option value="김지원">김지원</option>
                          <option value="이지원">이지원</option>
                          <option value="최지원">최지원</option>
                        </select>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={noteInput[ticket.id] || ''}
                        onChange={(e) => setNoteInput((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                        placeholder="내부 메모"
                        className="w-full text-sm border-gray-300 rounded focus:border-dabang-primary focus:ring-dabang-primary"
                      />
                      <button
                        onClick={() => handleAddNote(ticket.id)}
                        className="px-2 py-1 text-xs text-white bg-dabang-primary rounded"
                      >
                        Add
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportTicketsPage;