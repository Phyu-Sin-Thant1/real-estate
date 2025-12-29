import React, { useState } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Modal from '../../../components/delivery/Modal';
import { scheduleItems, vehicles } from '../../../mock/deliveryData';
import { drivers } from '../../../mock/deliveryDriversData';

// Generate more mock schedule data
const generateMockScheduleData = () => {
  const additionalItems = [];
  const statuses = ['예정', '진행중', '완료', '지연'];
  const jobTypes = ['이사', '배달'];
  
  for (let i = 6; i <= 15; i++) {
    const date = `2025-12-${15 + Math.floor(i/3)}`;
    additionalItems.push({
      id: i,
      date,
      time: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 4) * 15}`.padStart(5, '0'),
      jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      addressSummary: `서울시 구${i}동 → 서울시 구${i+5}동`,
      driver: `운전자${i}`,
      vehicle: `차량${i % 3 + 1}호`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return [...scheduleItems, ...additionalItems];
};

const mockScheduleData = generateMockScheduleData();

const BusinessSchedulePage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState('오늘');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleList, setVehicleList] = useState(vehicles);
  const [driverList, setDriverList] = useState(drivers);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [scheduleList, setScheduleList] = useState(mockScheduleData);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);

  const tabs = [
    { key: 'schedule', label: '스케줄' },
    { key: 'vehicle', label: '차량' },
    { key: 'driver', label: '기사 관리' }
  ];

  // Summary cards data
  const today = new Date().toISOString().split('T')[0];
  const todaySchedules = scheduleList.filter(item => item.date === today);
  const ongoingSchedules = scheduleList.filter(item => item.status === '진행중');
  const completedSchedules = scheduleList.filter(item => item.status === '완료');
  const delayedSchedules = scheduleList.filter(item => item.status === '지연');

  const summaryCards = [
    { title: '오늘 일정', value: todaySchedules.length, color: 'bg-blue-500' },
    { title: '진행 중', value: ongoingSchedules.length, color: 'bg-yellow-500' },
    { title: '완료', value: completedSchedules.length, color: 'bg-green-500' },
    { title: '지연', value: delayedSchedules.length, color: 'bg-red-500' }
  ];

  // Filter schedule data
  const filteredScheduleData = scheduleList.filter(item => {
    // Date range filter
    if (dateRangeFilter === '오늘') {
      if (item.date !== today) return false;
    } else if (dateRangeFilter === '이번 주') {
      const itemDate = new Date(item.date);
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (itemDate < weekStart || itemDate > weekEnd) return false;
    } else if (dateRangeFilter === '이번 달') {
      const itemMonth = item.date.substring(0, 7);
      const currentMonth = today.substring(0, 7);
      if (itemMonth !== currentMonth) return false;
    }

    // Status filter
    if (statusFilter !== '전체' && item.status !== statusFilter) return false;

    // Search term filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      if (!(
        item.driver.toLowerCase().includes(lowerSearch) ||
        item.vehicle.toLowerCase().includes(lowerSearch) ||
        item.addressSummary.toLowerCase().includes(lowerSearch)
      )) return false;
    }

    return true;
  });

  // Schedule columns
  const scheduleColumns = [
    { key: 'id', label: '요청번호' },
    { key: 'dateTime', label: '일정일시' },
    { key: 'customerName', label: '고객명' },
    { key: 'pickupAddress', label: '출발지' },
    { key: 'deliveryAddress', label: '도착지' },
    { key: 'vehicleDriver', label: '차량/기사' },
    { key: 'status', label: '상태' },
    { key: 'actions', label: '작업' }
  ];

  // Vehicle columns
  const vehicleColumns = [
    { key: 'name', label: '차량명' },
    { key: 'plateNumber', label: '번호판' },
    { key: 'capacity', label: '적재량' },
    { key: 'driver', label: '담당 기사' },
    { key: 'status', label: '상태' },
    { key: 'actions', label: '작업' }
  ];

  // Driver columns
  const driverColumns = [
    { key: 'name', label: '기사명' },
    { key: 'phone', label: '연락처' },
    { key: 'status', label: '상태' },
    { key: 'assignedVehicle', label: '담당차량' },
    { key: 'actions', label: '작업' }
  ];

  const formatDateTime = (date, time) => {
    return `${date} ${time}`;
  };

  const renderScheduleCell = (row, columnKey) => {
    switch (columnKey) {
      case 'id':
        return `#${row.id}`;
      case 'dateTime':
        return formatDateTime(row.date, row.time);
      case 'customerName':
        return `고객${row.id}`;
      case 'pickupAddress':
        return row.addressSummary.split(' → ')[0] || '-';
      case 'deliveryAddress':
        return row.addressSummary.split(' → ')[1] || '-';
      case 'vehicleDriver':
        return (
          <div>
            <div className="font-medium">{row.vehicle}</div>
            <div className="text-xs text-gray-500">{row.driver}</div>
          </div>
        );
      case 'status':
        return <StatusBadge status={row.status} />;
      case 'actions':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(row);
              setIsDetailModalOpen(true);
            }}
            className="px-3 py-1.5 text-dabang-primary hover:bg-gradient-to-r hover:from-dabang-primary/10 hover:to-indigo-50 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            상세보기
          </button>
        );
      default:
        return row[columnKey] || '-';
    }
  };

  const handleEditVehicle = (vehicle) => {
    setCurrentVehicle(vehicle);
    setIsEditVehicleModalOpen(true);
  };

  const handleAddVehicle = (newVehicle) => {
    const vehicle = {
      id: vehicleList.length + 1,
      ...newVehicle
    };
    setVehicleList(prev => [...prev, vehicle]);
    setIsAddVehicleModalOpen(false);
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicleList(prev => 
      prev.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
    setIsEditVehicleModalOpen(false);
    setCurrentVehicle(null);
  };

  const renderVehicleCell = (row, columnKey) => {
    switch (columnKey) {
      case 'driver':
        return (
          <div>
            <div className="font-medium">{row.driverName}</div>
            {row.driverPhone && (
              <div className="text-xs text-gray-500">{row.driverPhone}</div>
            )}
          </div>
        );
      case 'status':
        return <StatusBadge status={row.status} type="vehicle" />;
      case 'actions':
        return (
          <button 
            onClick={() => handleEditVehicle(row)}
            className="px-3 py-1.5 text-dabang-primary hover:bg-gradient-to-r hover:from-dabang-primary/10 hover:to-indigo-50 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            수정
          </button>
        );
      default:
        return row[columnKey] || '-';
    }
  };

  const renderDriverCell = (row, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row.status} type="driver" />;
      case 'actions':
        return (
          <button 
            onClick={() => handleEditDriver(row)}
            className="px-3 py-1.5 text-dabang-primary hover:bg-gradient-to-r hover:from-dabang-primary/10 hover:to-indigo-50 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            수정
          </button>
        );
      default:
        return row[columnKey] || '-';
    }
  };

  const handleEditDriver = (driver) => {
    setCurrentDriver(driver);
    setIsEditDriverModalOpen(true);
  };

  const handleAddDriver = (newDriver) => {
    const driver = {
      id: driverList.length + 1,
      ...newDriver
    };
    setDriverList(prev => [...prev, driver]);
    setIsAddDriverModalOpen(false);
  };

  const handleUpdateDriver = (updatedDriver) => {
    setDriverList(prev => 
      prev.map(driver => 
        driver.id === updatedDriver.id ? updatedDriver : driver
      )
    );
    setIsEditDriverModalOpen(false);
    setCurrentDriver(null);
  };

  const handleAddSchedule = (newSchedule) => {
    const schedule = {
      id: scheduleList.length > 0 ? Math.max(...scheduleList.map(s => s.id)) + 1 : 1,
      ...newSchedule
    };
    setScheduleList(prev => [...prev, schedule]);
    setIsAddScheduleModalOpen(false);
  };

  // Vehicle Modal Components
  const AddVehicleModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      plateNumber: '',
      capacity: '',
      driverName: '',
      driverPhone: '',
      status: '활성'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.driverName.trim()) {
        alert('담당 기사 이름을 입력해주세요.');
        return;
      }
      onAdd(formData);
      setFormData({
        name: '',
        plateNumber: '',
        capacity: '',
        driverName: '',
        driverPhone: '',
        status: '활성'
      });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="새 차량 등록" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              차량명 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 트럭 4호"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              번호판
            </label>
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
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
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 2.5톤"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당 기사 * <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 김민수"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사 연락처
            </label>
            <input
              type="text"
              name="driverPhone"
              value={formData.driverPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="활성">활성</option>
              <option value="점검중">점검중</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              등록
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  const EditVehicleModal = ({ isOpen, onClose, vehicle, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: vehicle?.name || '',
      plateNumber: vehicle?.plateNumber || '',
      capacity: vehicle?.capacity || '',
      driverName: vehicle?.driverName || '',
      driverPhone: vehicle?.driverPhone || '',
      status: vehicle?.status || '활성'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.driverName.trim()) {
        alert('담당 기사 이름을 입력해주세요.');
        return;
      }
      onUpdate({ ...formData, id: vehicle.id });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="차량 정보 수정" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              차량명 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 트럭 4호"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              번호판
            </label>
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
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
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 2.5톤"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당 기사 * <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 김민수"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사 연락처
            </label>
            <input
              type="text"
              name="driverPhone"
              value={formData.driverPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="활성">활성</option>
              <option value="점검중">점검중</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              저장
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Driver Modal Components
  const AddDriverModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      status: '근무',
      assignedVehicle: '',
      licenseNumber: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        alert('기사명을 입력해주세요.');
        return;
      }
      onAdd(formData);
      setFormData({
        name: '',
        phone: '',
        status: '근무',
        assignedVehicle: '',
        licenseNumber: ''
      });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="새 기사 등록" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사명 * <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 김철수"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="근무">근무</option>
              <option value="휴무">휴무</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당 차량
            </label>
            <input
              type="text"
              name="assignedVehicle"
              value={formData.assignedVehicle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 트럭 1호"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              면허번호
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 12-345678-90"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              등록
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  const EditDriverModal = ({ isOpen, onClose, driver, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: driver?.name || '',
      phone: driver?.phone || '',
      status: driver?.status || '근무',
      assignedVehicle: driver?.assignedVehicle || '',
      licenseNumber: driver?.licenseNumber || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        alert('기사명을 입력해주세요.');
        return;
      }
      onUpdate({ ...formData, id: driver.id });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="기사 정보 수정" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사명 * <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 김철수"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="근무">근무</option>
              <option value="휴무">휴무</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당 차량
            </label>
            <input
              type="text"
              name="assignedVehicle"
              value={formData.assignedVehicle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 트럭 1호"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              면허번호
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 12-345678-90"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              저장
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Schedule Modal Component
  const AddScheduleModal = ({ isOpen, onClose, onAdd, vehicleList, driverList }) => {
    const [formData, setFormData] = useState({
      date: '',
      time: '',
      jobType: '이사',
      pickupAddress: '',
      deliveryAddress: '',
      vehicle: '',
      driver: '',
      status: '예정'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.date || !formData.time) {
        alert('날짜와 시간을 입력해주세요.');
        return;
      }
      if (!formData.pickupAddress || !formData.deliveryAddress) {
        alert('출발지와 도착지를 입력해주세요.');
        return;
      }
      if (!formData.vehicle || !formData.driver) {
        alert('차량과 기사를 선택해주세요.');
        return;
      }
      
      const scheduleData = {
        date: formData.date,
        time: formData.time,
        jobType: formData.jobType,
        addressSummary: `${formData.pickupAddress} → ${formData.deliveryAddress}`,
        vehicle: formData.vehicle,
        driver: formData.driver,
        status: formData.status
      };
      
      onAdd(scheduleData);
      setFormData({
        date: '',
        time: '',
        jobType: '이사',
        pickupAddress: '',
        deliveryAddress: '',
        vehicle: '',
        driver: '',
        status: '예정'
      });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="새 스케줄 등록" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                날짜 *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시간 *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              작업 유형 *
            </label>
            <select 
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              required
            >
              <option value="이사">이사</option>
              <option value="배달">배달</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출발지 *
            </label>
            <input
              type="text"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 서울시 강남구"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              도착지 *
            </label>
            <input
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 서울시 서초구"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              차량 *
            </label>
            <select 
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              required
            >
              <option value="">차량 선택</option>
              {vehicleList.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.name}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사 *
            </label>
            <select 
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              required
            >
              <option value="">기사 선택</option>
              {driverList.map((driver) => (
                <option key={driver.id} value={driver.name}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="예정">예정</option>
              <option value="진행중">진행중</option>
              <option value="완료">완료</option>
              <option value="지연">지연</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
            >
              등록
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-dabang-primary to-indigo-600 bg-clip-text text-transparent">스케줄 / 차량 관리</h1>
          <p className="text-gray-600 mt-2 text-sm font-medium">운송 스케줄과 차량/기사를 관리합니다</p>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200/60 bg-white rounded-t-2xl shadow-sm">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 relative ${
                  activeTab === tab.key
                    ? 'border-dabang-primary text-dabang-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-dabang-primary to-indigo-600"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="mt-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card, index) => {
                const colorConfig = {
                  'bg-blue-500': {
                    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    border: 'border-blue-200/50',
                    hoverBorder: 'hover:border-blue-300'
                  },
                  'bg-yellow-500': {
                    gradient: 'from-yellow-500 via-orange-500 to-amber-600',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    border: 'border-yellow-200/50',
                    hoverBorder: 'hover:border-yellow-300'
                  },
                  'bg-green-500': {
                    gradient: 'from-green-500 via-emerald-500 to-teal-600',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    border: 'border-green-200/50',
                    hoverBorder: 'hover:border-green-300'
                  },
                  'bg-red-500': {
                    gradient: 'from-red-500 via-rose-500 to-pink-600',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    border: 'border-red-200/50',
                    hoverBorder: 'hover:border-red-300'
                  }
                };
                const config = colorConfig[card.color] || colorConfig['bg-blue-500'];
                
                return (
                  <div key={index} className={`group relative bg-white overflow-hidden rounded-2xl border-2 ${config.border} ${config.hoverBorder} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                    {/* Gradient background overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}></div>
                    
                    <div className="px-6 py-6 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{card.title}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-4xl font-bold text-gray-900">{card.value}</div>
                          </dd>
                        </div>
                        <div className={`flex-shrink-0 rounded-xl p-3 bg-gradient-to-br ${config.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <div className="h-6 w-6 text-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex space-x-2">
                  {['오늘', '이번 주', '이번 달'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRangeFilter(range)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        dateRangeFilter === range
                          ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg shadow-dabang-primary/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                
                <div className="min-w-[150px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-dabang-primary/50 focus:border-dabang-primary bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <option value="전체">전체 상태</option>
                    <option value="예정">예정</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                    <option value="지연">지연</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="고객명, 차량, 주소 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-dabang-primary/50 focus:border-dabang-primary bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">스케줄 목록</h2>
                <button
                  onClick={() => setIsAddScheduleModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-dabang-primary/30 transition-all duration-200 text-sm font-semibold"
                >
                  새 스케줄 등록
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/60">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      {scheduleColumns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/40">
                    {filteredScheduleData.map((item) => (
                      <tr 
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailModalOpen(true);
                        }}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200"
                      >
                        {scheduleColumns.map((column) => (
                          <td
                            key={`${item.id}-${column.key}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
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

        {/* Vehicle Tab */}
        {activeTab === 'vehicle' && (
          <div className="mt-6 space-y-6">
            {/* Add Vehicle Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-dabang-primary/30 transition-all duration-200 text-sm font-semibold"
              >
                새 차량 등록
              </button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">차량 목록</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      {vehicleColumns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/40">
                    {vehicleList.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200">
                        {vehicleColumns.map((column) => (
                          <td
                            key={`${vehicle.id}-${column.key}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
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
          </div>
        )}

        {/* Driver Tab */}
        {activeTab === 'driver' && (
          <div className="mt-6 space-y-6">
            {/* Add Driver Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddDriverModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-dabang-primary/30 transition-all duration-200 text-sm font-semibold"
              >
                새 기사 등록
              </button>
            </div>

            {/* Drivers Table */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">기사 목록</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      {driverColumns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/40">
                    {driverList.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200">
                        {driverColumns.map((column) => (
                          <td
                            key={`${driver.id}-${column.key}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
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
      </div>

      {/* Schedule Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title="스케줄 상세"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">요청번호</div>
                    <div className="text-sm font-medium">#{selectedItem.id}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">일정일시</div>
                    <div className="text-sm font-medium">{formatDateTime(selectedItem.date, selectedItem.time)}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">작업 유형</div>
                    <div className="text-sm font-medium">{selectedItem.jobType}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">고객명</div>
                    <div className="text-sm font-medium">고객{selectedItem.id}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">배차 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">차량</div>
                    <div className="text-sm font-medium">{selectedItem.vehicle}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">운전자</div>
                    <div className="text-sm font-medium">{selectedItem.driver}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">상태</div>
                    <div className="text-sm font-medium">
                      <StatusBadge status={selectedItem.status} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">주소 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">출발지</div>
                    <div className="text-sm font-medium">{selectedItem.addressSummary.split(' → ')[0] || '-'}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-500">도착지</div>
                    <div className="text-sm font-medium">{selectedItem.addressSummary.split(' → ')[1] || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">상태 변경</h3>
              <div className="flex flex-wrap gap-2">
                {['예정', '진행중', '완료', '지연'].map((status) => (
                  <button
                    key={status}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedItem.status === status
                        ? 'bg-dabang-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
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
      <AddVehicleModal 
        isOpen={isAddVehicleModalOpen} 
        onClose={() => setIsAddVehicleModalOpen(false)}
        onAdd={handleAddVehicle}
      />

      {/* Edit Vehicle Modal */}
      <EditVehicleModal 
        isOpen={isEditVehicleModalOpen} 
        onClose={() => setIsEditVehicleModalOpen(false)}
        vehicle={currentVehicle}
        onUpdate={handleUpdateVehicle}
      />

      {/* Add Driver Modal */}
      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)}
        onAdd={handleAddDriver}
      />

      {/* Edit Driver Modal */}
      <EditDriverModal 
        isOpen={isEditDriverModalOpen} 
        onClose={() => setIsEditDriverModalOpen(false)}
        driver={currentDriver}
        onUpdate={handleUpdateDriver}
      />

      {/* Add Schedule Modal */}
      <AddScheduleModal 
        isOpen={isAddScheduleModalOpen} 
        onClose={() => setIsAddScheduleModalOpen(false)}
        onAdd={handleAddSchedule}
        vehicleList={vehicleList}
        driverList={driverList}
      />
    </div>
  );
};

export default BusinessSchedulePage;