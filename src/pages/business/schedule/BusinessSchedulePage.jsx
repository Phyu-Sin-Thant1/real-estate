import React, { useState } from 'react';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Modal from '../../../components/delivery/Modal';
import { scheduleItems, vehicles } from '../../../mock/deliveryData';
import { drivers } from '../../../mock/driverData';

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
  // Driver management state
  const [driverList, setDriverList] = useState(drivers);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverStatusFilter, setDriverStatusFilter] = useState('전체');
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);

  const tabs = [
    { key: 'schedule', label: '스케줄' },
    { key: 'vehicle', label: '차량' },
    { key: 'driver', label: '기사 관리' }
  ];

  // Summary cards data
  const today = new Date().toISOString().split('T')[0];
  const todaySchedules = mockScheduleData.filter(item => item.date === today);
  const ongoingSchedules = mockScheduleData.filter(item => item.status === '진행중');
  const completedSchedules = mockScheduleData.filter(item => item.status === '완료');
  const delayedSchedules = mockScheduleData.filter(item => item.status === '지연');

  const summaryCards = [
    { title: '오늘 일정', value: todaySchedules.length, color: 'bg-blue-500' },
    { title: '진행 중', value: ongoingSchedules.length, color: 'bg-yellow-500' },
    { title: '완료', value: completedSchedules.length, color: 'bg-green-500' },
    { title: '지연', value: delayedSchedules.length, color: 'bg-red-500' }
  ];

  // Driver summary cards data
  const totalDrivers = driverList.length;
  const activeDrivers = driverList.filter(driver => driver.status === '활성').length;
  const inactiveDrivers = driverList.filter(driver => driver.status === '휴무').length;
  const retiredDrivers = driverList.filter(driver => driver.status === '퇴사').length;

  const driverSummaryCards = [
    { title: '전체 기사 수', value: totalDrivers, color: 'bg-blue-500' },
    { title: '활성', value: activeDrivers, color: 'bg-green-500' },
    { title: '휴무', value: inactiveDrivers, color: 'bg-yellow-500' },
    { title: '퇴사', value: retiredDrivers, color: 'bg-gray-500' }
  ];

  // Filter schedule data
  const filteredScheduleData = mockScheduleData.filter(item => {
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

  // Filter driver data
  const filteredDriverData = driverList.filter(driver => {
    // Status filter
    if (driverStatusFilter !== '전체' && driver.status !== driverStatusFilter) return false;

    // Search term filter
    if (driverSearchTerm) {
      const lowerSearch = driverSearchTerm.toLowerCase();
      if (!(
        driver.name.toLowerCase().includes(lowerSearch) ||
        driver.phone.toLowerCase().includes(lowerSearch)
      )) return false;
    }

    // Assigned only filter
    if (showAssignedOnly && !driver.assignedVehicleId) return false;

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
    { key: 'assignedVehicle', label: '배정 차량' },
    { key: 'note', label: '메모' },
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
            className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
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

  // Driver management functions
  const handleAddDriver = (newDriver) => {
    const driver = {
      id: driverList.length + 1,
      ...newDriver,
      assignedVehicleName: newDriver.assignedVehicleId 
        ? vehicleList.find(v => v.id === newDriver.assignedVehicleId)?.name || ''
        : ''
    };
    setDriverList(prev => [...prev, driver]);
    setIsAddDriverModalOpen(false);
  };

  const handleUpdateDriver = (updatedDriver) => {
    const driver = {
      ...updatedDriver,
      assignedVehicleName: updatedDriver.assignedVehicleId 
        ? vehicleList.find(v => v.id === updatedDriver.assignedVehicleId)?.name || ''
        : ''
    };
    setDriverList(prev => 
      prev.map(d => 
        d.id === driver.id ? driver : d
      )
    );
    setIsEditDriverModalOpen(false);
    setCurrentDriver(null);
  };

  const handleToggleDriverStatus = (driverId) => {
    setDriverList(prev => 
      prev.map(driver => {
        if (driver.id === driverId) {
          // Toggle between 활성 and 휴무
          const newStatus = driver.status === '활성' ? '휴무' : '활성';
          return { ...driver, status: newStatus };
        }
        return driver;
      })
    );
  };

  const handleRetireDriver = (driverId) => {
    setDriverList(prev => 
      prev.map(driver => {
        if (driver.id === driverId) {
          return { 
            ...driver, 
            status: '퇴사',
            assignedVehicleId: null,
            assignedVehicleName: ''
          };
        }
        return driver;
      })
    );
  };

  const renderVehicleCell = (row, columnKey) => {
    // Test to see if we're getting to the driver column
    if (columnKey === 'driver') {
      return (
        <div>
          <div className="font-medium">{row.driverName || '미지정'}</div>
          {row.driverPhone && (
            <div className="text-xs text-gray-500">{row.driverPhone}</div>
          )}
        </div>
      );
    }
    
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={row.status} type="vehicle" />;
      case 'actions':
        return (
          <button 
            onClick={() => handleEditVehicle(row)}
            className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
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
      case 'assignedVehicle':
        return row.assignedVehicleName || '미배정';
      case 'actions':
        return (
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setCurrentDriver(row);
                setIsEditDriverModalOpen(true);
              }}
              className="text-dabang-primary hover:text-dabang-primary/80 text-sm font-medium"
            >
              수정
            </button>
            {row.status !== '퇴사' && (
              <button 
                onClick={() => handleToggleDriverStatus(row.id)}
                className="text-dabang-primary hover:text-dabang-primary/80 text-sm font-medium"
              >
                {row.status === '활성' ? '휴무' : '활성'}
              </button>
            )}
            {row.status !== '퇴사' && (
              <button 
                onClick={() => {
                  if (window.confirm('정말 이 기사를 퇴사 처리하시겠습니까?')) {
                    handleRetireDriver(row.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                퇴사
              </button>
            )}
          </div>
        );
      default:
        return row[columnKey] || '-';
    }
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
      status: '활성',
      assignedVehicleId: '',
      note: ''
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
      if (!formData.phone.trim()) {
        alert('연락처를 입력해주세요.');
        return;
      }
      onAdd({
        ...formData,
        assignedVehicleId: formData.assignedVehicleId ? parseInt(formData.assignedVehicleId) : null
      });
      setFormData({
        name: '',
        phone: '',
        status: '활성',
        assignedVehicleId: '',
        note: ''
      });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="새 기사 등록" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사명 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 김민수"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
              required
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
              <option value="휴무">휴무</option>
              <option value="퇴사">퇴사</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              배정 차량
            </label>
            <select 
              name="assignedVehicleId"
              value={formData.assignedVehicleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="">미배정</option>
              {vehicleList.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="기사 관련 메모"
              rows="3"
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
      status: driver?.status || '활성',
      assignedVehicleId: driver?.assignedVehicleId || '',
      note: driver?.note || ''
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
      if (!formData.phone.trim()) {
        alert('연락처를 입력해주세요.');
        return;
      }
      onUpdate({
        ...formData,
        id: driver.id,
        assignedVehicleId: formData.assignedVehicleId ? parseInt(formData.assignedVehicleId) : null
      });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="기사 정보 수정" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기사명 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 김민수"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="예: 010-1234-5678"
              required
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
              <option value="휴무">휴무</option>
              <option value="퇴사">퇴사</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              배정 차량
            </label>
            <select 
              name="assignedVehicleId"
              value={formData.assignedVehicleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="">미배정</option>
              {vehicleList.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              placeholder="기사 관련 메모"
              rows="3"
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">스케줄 / 차량 관리</h1>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
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
          <div className="mt-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card, index) => (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                        <div className="h-6 w-6 text-white"></div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex space-x-2">
                  {['오늘', '이번 주', '이번 달'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRangeFilter(range)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        dateRangeFilter === range
                          ? 'bg-dabang-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-dabang-primary focus:border-dabang-primary sm:text-sm rounded-md"
                  >
                    <option value="전체">전체 상태</option>
                    <option value="예정">예정</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                    <option value="지연">지연</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="고객명, 차량, 주소 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-dabang-primary focus:border-dabang-primary sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">스케줄 목록</h2>
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
                    {filteredScheduleData.map((item) => (
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

        {/* Vehicle Tab */}
        {activeTab === 'vehicle' && (
          <div className="mt-6 space-y-6">
            {/* Add Vehicle Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
              >
                새 차량 등록
              </button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">차량 목록</h2>
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
                    {vehicleList.map((vehicle) => {
                      return (
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Driver Tab */}
        {activeTab === 'driver' && (
          <div className="mt-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {driverSummaryCards.map((card, index) => (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                        <div className="h-6 w-6 text-white"></div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <select
                    value={driverStatusFilter}
                    onChange={(e) => setDriverStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-dabang-primary focus:border-dabang-primary sm:text-sm rounded-md"
                  >
                    <option value="전체">전체 상태</option>
                    <option value="활성">활성</option>
                    <option value="휴무">휴무</option>
                    <option value="퇴사">퇴사</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="이름, 연락처 검색..."
                    value={driverSearchTerm}
                    onChange={(e) => setDriverSearchTerm(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-dabang-primary focus:border-dabang-primary sm:text-sm rounded-md"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="assigned-only"
                    type="checkbox"
                    checked={showAssignedOnly}
                    onChange={(e) => setShowAssignedOnly(e.target.checked)}
                    className="h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                  />
                  <label htmlFor="assigned-only" className="ml-2 block text-sm text-gray-700">
                    배정됨만 보기
                  </label>
                </div>
                
                <div className="ml-auto">
                  <button
                    onClick={() => setIsAddDriverModalOpen(true)}
                    className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
                  >
                    새 기사 등록
                  </button>
                </div>
              </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">기사 목록</h2>
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
                    {filteredDriverData.map((driver) => (
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
    </div>
  );
};

export default BusinessSchedulePage;