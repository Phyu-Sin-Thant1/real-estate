import React, { useState, useEffect } from 'react';
import { leads as initialLeads, leadStatuses } from '../../../mock/realEstateData';
import LeadDetailsModal from '../../../components/real-estate/LeadDetailsModal';

const RealEstateLeadsPage = () => {
  const [statusFilter, setStatusFilter] = useState('전체');
  const [propertyFilter, setPropertyFilter] = useState('전체');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);

  // Initialize leads from mock data
  useEffect(() => {
    setLeads([...initialLeads]);
  }, []);

  // Filter leads based on filters
  const filteredLeads = statusFilter === '전체' 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '새 문의':
        return 'bg-blue-100 text-blue-800';
      case '연락 완료':
        return 'bg-green-100 text-green-800';
      case '예약 완료':
        return 'bg-purple-100 text-purple-800';
      case '보류':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
    
    // Update selectedLead if it's the one being changed
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  // Handle memo edit
  const handleMemoEdit = (id, e) => {
    e.stopPropagation();
    console.log(`Edit memo for lead ${id}`);
    // In a real app, this would open a modal to edit the memo
  };

  // Handle row click
  const handleRowClick = (lead, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">문의 / 리드 관리</h1>
        <p className="text-gray-600 mt-1">웹사이트에서 접수된 문의와 관심 고객을 관리하세요.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">상태:</span>
            <div className="flex gap-2">
              {leadStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    statusFilter === status
                      ? 'bg-dabang-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Property Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">매물:</span>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="전체">전체</option>
              <option value="강남 아파트 A동 101호">강남 아파트 A동 101호</option>
              <option value="송파 오피스텔 B동 502호">송파 오피스텔 B동 502호</option>
              <option value="용산 원룸 301호">용산 원룸 301호</option>
              <option value="마포 아파트 C동 801호">마포 아파트 C동 801호</option>
              <option value="서초 빌라 2층">서초 빌라 2층</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  접수일
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관심 매물
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  문의 타입
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  메모
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => {
                const handleRowClickEvent = (e) => {
                  handleRowClick(lead, e);
                };

                return (
                  <tr
                    key={lead.id}
                    onClick={handleRowClickEvent}
                    onMouseDown={(e) => {
                      // Prevent any default browser behavior
                      if (e.target.closest('button') || e.target.closest('a')) {
                        return;
                      }
                      e.preventDefault();
                    }}
                    className="group hover:bg-blue-50/30 transition-colors duration-200 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRowClickEvent(e);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lead.propertyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.inquiryType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(lead.status)}`}
                        >
                          {lead.status}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => handleMemoEdit(lead.id, e)}
                        className="text-dabang-primary hover:text-dabang-primary/80"
                      >
                        {lead.memo}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
        availableStatuses={leadStatuses}
      />
    </div>
  );
};

export default RealEstateLeadsPage;