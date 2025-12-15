import React, { useState } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Modal from '../../../components/delivery/Modal';
import { scheduleItems, vehicles, drivers } from '../../../mock/deliveryData';

const BusinessSchedulePage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);

  const tabs = [
    { key: 'schedule', label: '스케줄 캘린더' },
    { key: 'vehicles', label: '차량/기사 관리' }
  ];

  // Schedule columns
  const scheduleColumns = [
    { key: 'dateTime', label: '날짜/시간' },
    { key: 'jobType', label: '작업 유형' },
    { key: 'addressSummary', label: '주소 요약' },
    { key: 'driver', label: '운전자' },
    { key: 'vehicle', label: '차량' },
    { key: 'status', label: '상태' }
  ];

  // Vehicle columns
  const vehicleColumns = [
    { key: 'name', label: '차량명' },
    { key: 'plateNumber', label: '번호판' },
    { key: 'capacity', label: '적재량' },
    { key: 'status', label: '상태' },
    { key: 'actions', label: '작업' }
  ];

  // Driver columns
  const driverColumns = [
    { key: 'name', label: '이름' },
    { key: 'phone', label: '연락처' },
    { key: 'status', label: '상태' },
    { key: 'actions', label: '작업' }
  ];

  const formatDateTime = (date, time) => {
    return `${date} ${time}`;
  };

  const renderScheduleCell = (row, columnKey) => {
    switch (columnKey) {
      case 'dateTime':
        return formatDateTime(row.date, row.time);
      case 'status':
        return <StatusBadge status={row[columnKey]} />;
      default:
        return row[columnKey];
    }
  };

  const renderVehicleCell = (row, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row[columnKey]} type="vehicle" />;
      case 'actions':
        return (
          <button className="text-dabang-primary hover:text-dabang-primary/80 font-medium">
            수정
          </button>
        );
      default:
        return row[columnKey];
    }
  };

  const renderDriverCell = (row, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row[columnKey]} type="driver" />;
      case 'actions':
        return (
          <button className="text-dabang-primary hover:text-dabang-primary/80 font-medium">
            수정
          </button>
        );
      default:
        return row[columnKey];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">스케줄 / 차량 관리</h1>
        <p className="text-gray-600 mt-1">운송 스케줄과 차량/기사를 관리합니다.</p>
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

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">이번 주 스케줄</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {scheduleColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduleItems.map((item) => (
                    <tr 
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailModalOpen(true);
                      }}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      {scheduleColumns.map((column) => (
                        <td
                          key={`${item.id}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {renderScheduleCell(item, column.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles & Drivers Tab */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {/* Vehicles Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">차량 관리</h2>
              <button
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
              >
                차량 추가
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {vehicleColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      {vehicleColumns.map((column) => (
                        <td
                          key={`${vehicle.id}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {renderVehicleCell(vehicle, column.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drivers Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">기사 관리</h2>
              <button
                onClick={() => setIsAddDriverModalOpen(true)}
                className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
              >
                기사 추가
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {driverColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      {driverColumns.map((column) => (
                        <td
                          key={`${driver.id}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {renderDriverCell(driver, column.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title="스케줄 상세"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">날짜</p>
                <p className="font-medium">{selectedItem.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">시간</p>
                <p className="font-medium">{selectedItem.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">작업 유형</p>
                <p className="font-medium">{selectedItem.jobType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">주소 요약</p>
                <p className="font-medium">{selectedItem.addressSummary}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">운전자</p>
                <p className="font-medium">{selectedItem.driver}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">차량</p>
                <p className="font-medium">{selectedItem.vehicle}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">상태</p>
                <p className="font-medium">
                  <StatusBadge status={selectedItem.status} />
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal 
        isOpen={isAddVehicleModalOpen} 
        onClose={() => setIsAddVehicleModalOpen(false)}
        title="차량 추가"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              차량명
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 트럭 4호"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              번호판
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 12가 3456"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              적재량
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 2.5톤"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary">
              <option value="활성">활성</option>
              <option value="점검중">점검중</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddVehicleModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={() => setIsAddVehicleModalOpen(false)}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              추가
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Driver Modal */}
      <Modal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)}
        title="기사 추가"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="기사 이름"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary">
              <option value="근무">근무</option>
              <option value="휴무">휴무</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddDriverModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={() => setIsAddDriverModalOpen(false)}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              추가
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessSchedulePage;