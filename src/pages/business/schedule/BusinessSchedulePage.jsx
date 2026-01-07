import React, { useState, useEffect, useMemo } from 'react';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import StatusBadge from '../../../components/delivery/StatusBadge';
import Modal from '../../../components/common/Modal';
import { scheduleItems, vehicles } from '../../../mock/deliveryData';
import { drivers } from '../../../mock/deliveryDriversData';
import { getQuoteRequestsByAgency } from '../../../store/quoteRequestsStore';
import { getOrdersByPartner } from '../../../store/deliveryOrdersStore';
import { getAllCustomerOrders, getCustomerOrderById } from '../../../store/customerOrdersStore';

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
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [isAssignVehicleModalOpen, setIsAssignVehicleModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState('오늘');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleList, setVehicleList] = useState(() => 
    vehicles.map(v => ({
      ...v,
      lastMaintenanceDate: v.lastMaintenanceDate || '2025-11-15',
      nextMaintenanceDate: v.nextMaintenanceDate || '2026-02-15',
      assignedOrders: []
    }))
  );
  const [driverList, setDriverList] = useState(drivers);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [scheduleList, setScheduleList] = useState(mockScheduleData);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [agencyId] = useState('moving-agency-1');
  const [driverStatusFilter, setDriverStatusFilter] = useState('전체');
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const [isAssignDriverVehicleModalOpen, setIsAssignDriverVehicleModalOpen] = useState(false);
  const [isUpdateDriverStatusModalOpen, setIsUpdateDriverStatusModalOpen] = useState(false);
  const [isCreateOrAssignScheduleModalOpen, setIsCreateOrAssignScheduleModalOpen] = useState(false);

  const tabs = [
    { key: 'schedule', label: '스케줄 관리' },
    { key: 'vehicle', label: '차량 관리' },
    { key: 'driver', label: '기사 관리' }
  ];

  // Load pending orders for vehicle assignment
  useEffect(() => {
    if (user?.email) {
      const quoteRequests = getQuoteRequestsByAgency(agencyId);
      const deliveryOrders = getOrdersByPartner(user.email);
      
      // Get pending/approved orders that need vehicle assignment
      const pending = [
        ...quoteRequests
          .filter(q => (q.status === 'approved' || q.status === 'pending') && !q.vehicleId)
          .map(q => ({
            id: `quote-${q.id}`,
            type: 'quote',
            customerName: q.customerName,
            serviceName: q.serviceName,
            pickupAddress: q.pickupAddress,
            deliveryAddress: q.deliveryAddress,
            preferredDate: q.preferredDate,
            status: q.status,
            totalPrice: q.totalPrice
          })),
        ...deliveryOrders
          .filter(o => (o.orderStatus === '신규' || o.orderStatus === '배차 대기') && !o.vehicleId)
          .map(o => ({
            id: o.id,
            type: 'order',
            customerName: o.customer?.name || '고객',
            serviceName: o.product || '배달',
            pickupAddress: o.pickupAddress,
            deliveryAddress: o.deliveryAddress,
            preferredDate: o.createdAt,
            status: o.orderStatus,
            totalPrice: o.totalPrice || 0
          }))
      ];
      
      setPendingOrders(pending);
    }
  }, [user?.email, agencyId]);

  // Calculate vehicle availability and assigned orders
  const vehiclesWithAvailability = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return vehicleList.map(vehicle => {
      // Get schedules assigned to this vehicle
      const assignedSchedules = scheduleList.filter(s => s.vehicle === vehicle.name);
      
      // Get active schedules (today or future, not completed)
      const activeSchedules = assignedSchedules.filter(s => {
        const scheduleDate = new Date(s.date);
        const todayDate = new Date(today);
        return scheduleDate >= todayDate && s.status !== '완료';
      });
      
      // Determine availability status
      let availabilityStatus = 'Available';
      if (vehicle.status === '점검중' || vehicle.status === 'Under Maintenance') {
        availabilityStatus = 'Under Maintenance';
      } else if (activeSchedules.length > 0) {
        const hasOngoing = activeSchedules.some(s => s.status === '진행중');
        availabilityStatus = hasOngoing ? 'In Use' : 'Assigned';
      }
      
      // Get next available slot
      const upcomingSchedules = activeSchedules
        .filter(s => s.status === '예정')
        .sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
      
      const nextAvailableSlot = upcomingSchedules.length > 0 
        ? `${upcomingSchedules[upcomingSchedules.length - 1].date} ${upcomingSchedules[upcomingSchedules.length - 1].time} 이후`
        : '즉시 가능';
      
      return {
        ...vehicle,
        availabilityStatus,
        assignedOrders: activeSchedules.map(s => ({
          id: s.id,
          date: s.date,
          time: s.time,
          address: s.addressSummary,
          status: s.status
        })),
        nextAvailableSlot,
        assignedCount: activeSchedules.length
      };
    });
  }, [vehicleList, scheduleList]);

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
    { key: 'availability', label: '가용성' },
    { key: 'assignedOrders', label: '배정된 주문' },
    { key: 'maintenance', label: '정비 일정' },
    { key: 'driver', label: '담당 기사' },
    { key: 'actions', label: '작업' }
  ];

  // Driver columns
  const driverColumns = [
    { key: 'name', label: '기사명' },
    { key: 'assignedVehicle', label: '담당 차량' },
    { key: 'status', label: '상태' },
    { key: 'nextAvailableTime', label: '다음 가용 시간' },
    { key: 'rating', label: '평점' },
    { key: 'assignedOrders', label: '배정된 주문' },
    { key: 'actions', label: '작업' }
  ];

  // Calculate driver availability and assigned orders
  const driversWithAvailability = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return driverList.map(driver => {
      // Get schedules assigned to this driver
      const assignedSchedules = scheduleList.filter(s => s.driver === driver.name);
      
      // Get active schedules (today or future, not completed)
      const activeSchedules = assignedSchedules.filter(s => {
        const scheduleDate = new Date(s.date);
        const todayDate = new Date(today);
        return scheduleDate >= todayDate && s.status !== '완료';
      });
      
      // Determine availability status
      let availabilityStatus = 'Available';
      if (driver.status === '휴무' || driver.status === 'Unavailable') {
        availabilityStatus = 'Unavailable';
      } else if (activeSchedules.length > 0) {
        const hasOngoing = activeSchedules.some(s => s.status === '진행중');
        availabilityStatus = hasOngoing ? 'Working' : 'Assigned';
      }
      
      // Get next available slot
      const upcomingSchedules = activeSchedules
        .filter(s => s.status === '예정')
        .sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
      
      const nextAvailableSlot = upcomingSchedules.length > 0 
        ? `${upcomingSchedules[upcomingSchedules.length - 1].date} ${upcomingSchedules[upcomingSchedules.length - 1].time} 이후`
        : '즉시 가능';
      
      // Get assigned vehicle details
      const assignedVehicle = vehicleList.find(v => v.name === driver.assignedVehicle || v.driverName === driver.name);
      
      return {
        ...driver,
        availabilityStatus,
        assignedOrders: activeSchedules.map(s => ({
          id: s.id,
          date: s.date,
          time: s.time,
          address: s.addressSummary,
          vehicle: s.vehicle,
          status: s.status
        })),
        nextAvailableSlot,
        assignedCount: activeSchedules.length,
        vehicleId: assignedVehicle?.id || null,
        rating: driver.rating || (4.5 + Math.random() * 0.5).toFixed(1) // Mock rating if not exists
      };
    });
  }, [driverList, scheduleList, vehicleList]);

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
    const vehicle = vehiclesWithAvailability.find(v => v.id === row.id) || row;
    
    switch (columnKey) {
      case 'availability':
        const statusColors = {
          'Available': 'bg-green-100 text-green-700 border-green-300',
          'In Use': 'bg-yellow-100 text-yellow-700 border-yellow-300',
          'Assigned': 'bg-blue-100 text-blue-700 border-blue-300',
          'Under Maintenance': 'bg-red-100 text-red-700 border-red-300'
        };
        const statusLabels = {
          'Available': '사용 가능',
          'In Use': '사용 중',
          'Assigned': '배정됨',
          'Under Maintenance': '정비 중'
        };
        return (
          <div className="flex flex-col gap-1">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColors[vehicle.availabilityStatus] || statusColors['Available']}`}>
              {statusLabels[vehicle.availabilityStatus] || vehicle.availabilityStatus}
            </span>
            {vehicle.nextAvailableSlot && (
              <span className="text-xs text-gray-500">{vehicle.nextAvailableSlot}</span>
            )}
          </div>
        );
      case 'assignedOrders':
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">{vehicle.assignedCount || 0}개</span>
            {vehicle.assignedOrders && vehicle.assignedOrders.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentVehicle(vehicle);
                  setIsDetailModalOpen(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                상세보기
              </button>
            )}
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex flex-col gap-1 text-xs">
            {vehicle.lastMaintenanceDate && (
              <div>
                <span className="text-gray-500">마지막 정비:</span>
                <span className="ml-1 font-medium text-gray-700">{vehicle.lastMaintenanceDate}</span>
              </div>
            )}
            {vehicle.nextMaintenanceDate && (
              <div>
                <span className="text-gray-500">다음 정비:</span>
                <span className={`ml-1 font-medium ${
                  new Date(vehicle.nextMaintenanceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}>
                  {vehicle.nextMaintenanceDate}
                </span>
              </div>
            )}
          </div>
        );
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
          <div className="flex gap-2">
          <button 
              onClick={(e) => {
                e.stopPropagation();
                handleEditVehicle(row);
              }}
            className="px-3 py-1.5 text-dabang-primary hover:bg-gradient-to-r hover:from-dabang-primary/10 hover:to-indigo-50 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            수정
          </button>
            {vehicle.availabilityStatus === 'Available' && pendingOrders.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentVehicle(vehicle);
                  setIsAssignVehicleModalOpen(true);
                }}
                className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg font-semibold text-sm transition-all duration-200"
              >
                배정
              </button>
            )}
          </div>
        );
      default:
        return row[columnKey] || '-';
    }
  };

  const renderDriverCell = (row, columnKey) => {
    const driver = driversWithAvailability.find(d => d.id === row.id) || row;
    
    switch (columnKey) {
      case 'assignedVehicle':
        const vehicle = vehicleList.find(v => v.name === driver.assignedVehicle || v.driverName === driver.name);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-900">
              {driver.assignedVehicle || vehicle?.name || '-'}
            </span>
            {vehicle && (
              <span className="text-xs text-gray-500">{vehicle.plateNumber}</span>
            )}
          </div>
        );
      case 'assignedOrders':
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">{driver.assignedCount || 0}개</span>
            {driver.assignedOrders && driver.assignedOrders.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentDriver(driver);
                  setIsDetailModalOpen(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                상세보기
              </button>
            )}
          </div>
        );
      case 'rating':
        const rating = parseFloat(driver.rating || '4.5');
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : star <= rating
                      ? 'text-yellow-400 fill-current opacity-50'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
          </div>
        );
      case 'status':
        const statusColors = {
          'Available': 'bg-green-100 text-green-700 border-green-300',
          'Working': 'bg-yellow-100 text-yellow-700 border-yellow-300',
          'On Duty': 'bg-yellow-100 text-yellow-700 border-yellow-300',
          'Assigned': 'bg-blue-100 text-blue-700 border-blue-300',
          'Unavailable': 'bg-red-100 text-red-700 border-red-300',
          'Off Duty': 'bg-red-100 text-red-700 border-red-300'
        };
        const statusLabels = {
          'Available': '사용 가능',
          'Working': '작업 중',
          'On Duty': '근무 중',
          'Assigned': '배정됨',
          'Unavailable': '휴무',
          'Off Duty': '휴무'
        };
        // Map driver status to display status
        let displayStatus = driver.availabilityStatus;
        if (driver.status === '휴무' || driver.status === 'Off Duty') {
          displayStatus = 'Off Duty';
        } else if (driver.availabilityStatus === 'Working') {
          displayStatus = 'On Duty';
        } else if (driver.availabilityStatus === 'Available') {
          displayStatus = 'Available';
        }
        
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColors[displayStatus] || statusColors['Available']}`}>
            {statusLabels[displayStatus] || displayStatus}
          </span>
        );
      case 'nextAvailableTime':
        return (
          <div className="text-sm text-gray-700">
            {driver.nextAvailableSlot || '즉시 가능'}
          </div>
        );
      case 'actions':
        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentDriver(driver);
                setIsAssignDriverVehicleModalOpen(true);
              }}
              className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg font-semibold text-sm transition-all duration-200"
            >
              차량 배정
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentDriver(driver);
                setIsDetailModalOpen(true);
              }}
            className="px-3 py-1.5 text-dabang-primary hover:bg-gradient-to-r hover:from-dabang-primary/10 hover:to-indigo-50 rounded-lg font-semibold text-sm transition-all duration-200"
          >
              상세보기
          </button>
          </div>
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

  const handleAssignDriverVehicle = (driverId, vehicleId) => {
    const vehicle = vehicleList.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const driver = driverList.find(d => d.id === driverId);
    if (!driver) return;

    // Update driver's assigned vehicle
    setDriverList(prev => prev.map(d => 
      d.id === driverId 
        ? { ...d, assignedVehicle: vehicle.name }
        : d
    ));

    // Update vehicle's assigned driver
    setVehicleList(prev => prev.map(v => {
      // Remove driver from previous vehicle if any
      if (v.driverName === driver.name && v.id !== vehicleId) {
        return {
          ...v,
          driverName: '',
          driverPhone: ''
        };
      }
      // Assign driver to new vehicle
      if (v.id === vehicleId) {
        return {
          ...v,
          driverName: driver.name,
          driverPhone: driver.phone
        };
      }
      return v;
    }));

    setIsAssignDriverVehicleModalOpen(false);
    setCurrentDriver(null);
  };

  const handleUpdateDriverStatus = (driverId, newStatus, notes) => {
    setDriverList(prev => prev.map(driver => {
      if (driver.id === driverId) {
        let status = '근무';
        if (newStatus === 'Off Duty') {
          status = '휴무';
        }
        return {
          ...driver,
          status,
          notes: notes || driver.notes
        };
      }
      return driver;
    }));

    setIsUpdateDriverStatusModalOpen(false);
    setCurrentDriver(null);
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
        status: '활성',
        lastMaintenanceDate: '',
        nextMaintenanceDate: ''
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
        email: '',
        status: '근무',
        assignedVehicle: '',
        licenseNumber: '',
        joinDate: new Date().toISOString().split('T')[0]
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
    <div className="py-6 w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-dabang-primary to-indigo-600 bg-clip-text text-transparent">스케줄 / 차량 관리</h1>
          <p className="text-gray-600 mt-2 text-sm font-medium">운송 스케줄과 차량/기사를 관리합니다</p>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200/60 bg-white rounded-t-2xl shadow-sm w-full overflow-x-hidden">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
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
          <div className="mt-6 space-y-6 w-full">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full">
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
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm w-full">
              <div className="flex flex-wrap items-center gap-4 w-full">
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

            {/* View Mode Toggle */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white shadow-lg rounded-2xl border border-gray-200/50 p-4 mb-4 w-full">
              <h2 className="text-lg font-bold text-gray-900">스케줄 관리</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  목록 보기
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  캘린더 보기
                </button>
              </div>
            </div>

            {/* Schedule Table or Calendar */}
            {viewMode === 'list' ? (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden w-full">
                <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">스케줄 목록</h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsCreateOrAssignScheduleModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-dabang-primary/30 transition-all duration-200 text-sm font-semibold whitespace-nowrap flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      스케줄 생성 또는 배정
                      {pendingOrders.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {pendingOrders.length}
                        </span>
                      )}
                    </button>
              </div>
                </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200/60">
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
            ) : (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden p-6">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">캘린더 보기</p>
                  <p className="text-sm mt-2">캘린더 뷰는 곧 제공될 예정입니다.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vehicle Tab */}
        {activeTab === 'vehicle' && (
          <div className="mt-6 space-y-6 w-full">
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
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden w-full">
              <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">차량 목록</h2>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200">
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
                    {vehiclesWithAvailability.map((vehicle) => (
                      <tr 
                        key={vehicle.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          setCurrentVehicle(vehicle);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        {vehicleColumns.map((column) => (
                          <td
                            key={`${vehicle.id}-${column.key}`}
                            className="px-6 py-4 text-sm text-gray-700 font-medium"
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
          <div className="mt-6 space-y-6 w-full">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">기사 관리</h2>
                <p className="text-sm text-gray-600 mt-1">기사를 관리하고 차량을 배정하세요</p>
              </div>
              <button
                onClick={() => setIsAddDriverModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-dabang-primary/30 transition-all duration-200 text-sm font-semibold"
              >
                새 기사 등록
              </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">상태 필터</label>
                  <select
                    value={driverStatusFilter}
                    onChange={(e) => setDriverStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary bg-white"
                  >
                    <option value="전체">전체 상태</option>
                    <option value="Available">사용 가능</option>
                    <option value="On Duty">근무 중</option>
                    <option value="Off Duty">휴무</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">검색</label>
                  <input
                    type="text"
                    placeholder="기사명 또는 차량명 검색..."
                    value={driverSearchTerm}
                    onChange={(e) => setDriverSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dabang-primary focus:border-dabang-primary"
                  />
                </div>
              </div>
            </div>

            {/* Filtered Drivers */}
            {(() => {
              let filteredDrivers = driversWithAvailability;

              // Status filter
              if (driverStatusFilter !== '전체') {
                filteredDrivers = filteredDrivers.filter(driver => {
                  if (driverStatusFilter === 'Off Duty') {
                    return driver.status === '휴무' || driver.availabilityStatus === 'Unavailable';
                  } else if (driverStatusFilter === 'On Duty') {
                    return driver.availabilityStatus === 'Working' || driver.availabilityStatus === 'Assigned';
                  } else if (driverStatusFilter === 'Available') {
                    return driver.availabilityStatus === 'Available';
                  }
                  return true;
                });
              }

              // Search filter
              if (driverSearchTerm) {
                const searchLower = driverSearchTerm.toLowerCase();
                filteredDrivers = filteredDrivers.filter(driver => 
                  driver.name.toLowerCase().includes(searchLower) ||
                  (driver.assignedVehicle && driver.assignedVehicle.toLowerCase().includes(searchLower)) ||
                  driver.phone.includes(driverSearchTerm)
                );
              }

              return (
                <div className="bg-white shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden w-full">
                  <div className="px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">기사 목록 ({filteredDrivers.length}명)</h2>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
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
                        {filteredDrivers.length === 0 ? (
                          <tr>
                            <td colSpan={driverColumns.length} className="px-6 py-12 text-center text-gray-500">
                              조건에 맞는 기사가 없습니다.
                            </td>
                          </tr>
                        ) : (
                          filteredDrivers.map((driver) => (
                            <tr 
                              key={driver.id} 
                              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 cursor-pointer"
                              onClick={() => {
                                setCurrentDriver(driver);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              {driverColumns.map((column) => (
                                <td
                                  key={`${driver.id}-${column.key}`}
                                  className="px-6 py-4 text-sm text-gray-700 font-medium"
                                >
                                  {renderDriverCell(driver, column.key)}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Schedule/Vehicle/Driver Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedItem(null);
          setCurrentVehicle(null);
          setCurrentDriver(null);
        }}
        title={currentVehicle ? "차량 상세 정보" : currentDriver ? "기사 상세 정보" : "스케줄 상세"}
        size="large"
      >
        {currentDriver ? (
          /* Driver Detail View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기사 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">이름:</div>
                    <div className="text-sm font-medium">{currentDriver.name}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">연락처:</div>
                    <div className="text-sm font-medium">{currentDriver.phone}</div>
                  </div>
                  {currentDriver.email && (
                    <div className="flex">
                      <div className="w-32 text-sm text-gray-600">이메일:</div>
                      <div className="text-sm font-medium">{currentDriver.email}</div>
                    </div>
                  )}
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">면허번호:</div>
                    <div className="text-sm font-medium">{currentDriver.licenseNumber || '-'}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">입사일:</div>
                    <div className="text-sm font-medium">{currentDriver.joinDate || '-'}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">평점:</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(parseFloat(currentDriver.rating || '4.5'))
                                ? 'text-yellow-400 fill-current'
                                : star <= parseFloat(currentDriver.rating || '4.5')
                                ? 'text-yellow-400 fill-current opacity-50'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{parseFloat(currentDriver.rating || '4.5').toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배차 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">담당 차량:</div>
                    <div className="text-sm font-medium">{currentDriver.assignedVehicle || '-'}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">가용성:</div>
                    <div className="text-sm font-medium">
                      <span className={`px-2 py-1 rounded ${
                        currentDriver.availabilityStatus === 'Available' ? 'bg-green-100 text-green-700' :
                        currentDriver.availabilityStatus === 'Working' ? 'bg-yellow-100 text-yellow-700' :
                        currentDriver.availabilityStatus === 'Unavailable' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {currentDriver.availabilityStatus === 'Available' ? '사용 가능' :
                         currentDriver.availabilityStatus === 'Working' ? '작업 중' :
                         currentDriver.availabilityStatus === 'Unavailable' ? '휴무' :
                         '배정됨'}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">다음 가용 시간:</div>
                    <div className="text-sm font-medium">{currentDriver.nextAvailableSlot || '즉시 가능'}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">상태:</div>
                    <div className="text-sm font-medium">
                      <StatusBadge status={currentDriver.status} type="driver" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {currentDriver.assignedOrders && currentDriver.assignedOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배정된 주문 ({currentDriver.assignedOrders.length}개)</h3>
                <div className="space-y-2">
                  {currentDriver.assignedOrders.map(order => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">주문 #{order.id}</div>
                          <div className="text-xs text-gray-600 mt-1">{order.date} {order.time}</div>
                          <div className="text-xs text-gray-500 mt-1">{order.address}</div>
                          {order.vehicle && (
                            <div className="text-xs text-gray-500 mt-1">차량: {order.vehicle}</div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === '진행중' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === '완료' ? 'bg-green-100 text-green-700' :
                          order.status === '지연' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Driver Schedule Calendar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">작업 일정</h3>
              <div className="grid grid-cols-7 gap-2">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="text-center font-bold text-gray-700 py-2 text-sm">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay() + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const daySchedules = scheduleList.filter(s => 
                    s.driver === currentDriver.name && s.date === dateStr
                  );
                  const isToday = dateStr === today;
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-[80px] border-2 rounded-lg p-2 ${
                        isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map(schedule => (
                          <div
                            key={schedule.id}
                            className={`text-xs p-1 rounded ${
                              schedule.status === '진행중' ? 'bg-yellow-100 text-yellow-800' :
                              schedule.status === '완료' ? 'bg-green-100 text-green-800' :
                              schedule.status === '지연' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            <div className="font-medium">{schedule.time}</div>
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{daySchedules.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setCurrentDriver(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setCurrentDriver(currentDriver);
                  setIsAssignDriverVehicleModalOpen(true);
                  setIsDetailModalOpen(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                차량 배정
              </button>
              <button
                onClick={() => {
                  setCurrentDriver(currentDriver);
                  setIsUpdateDriverStatusModalOpen(true);
                  setIsDetailModalOpen(false);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
              >
                상태 변경
              </button>
              <button
                onClick={() => {
                  handleEditDriver(currentDriver);
                  setIsDetailModalOpen(false);
                }}
                className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
              >
                정보 수정
              </button>
            </div>
          </div>
        ) : currentVehicle ? (
          /* Vehicle Detail View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">차량 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">차량명:</div>
                    <div className="text-sm font-medium">{currentVehicle.name}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">번호판:</div>
                    <div className="text-sm font-medium">{currentVehicle.plateNumber}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">적재량:</div>
                    <div className="text-sm font-medium">{currentVehicle.capacity}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">가용성:</div>
                    <div className="text-sm font-medium">
                      <span className={`px-2 py-1 rounded ${
                        currentVehicle.availabilityStatus === 'Available' ? 'bg-green-100 text-green-700' :
                        currentVehicle.availabilityStatus === 'In Use' ? 'bg-yellow-100 text-yellow-700' :
                        currentVehicle.availabilityStatus === 'Under Maintenance' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {currentVehicle.availabilityStatus === 'Available' ? '사용 가능' :
                         currentVehicle.availabilityStatus === 'In Use' ? '사용 중' :
                         currentVehicle.availabilityStatus === 'Under Maintenance' ? '정비 중' :
                         '배정됨'}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">다음 가용 시간:</div>
                    <div className="text-sm font-medium">{currentVehicle.nextAvailableSlot}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">정비 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">마지막 정비일:</div>
                    <div className="text-sm font-medium">{currentVehicle.lastMaintenanceDate || '-'}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">다음 정비일:</div>
                    <div className={`text-sm font-medium ${
                      currentVehicle.nextMaintenanceDate && 
                      new Date(currentVehicle.nextMaintenanceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? 'text-red-600 font-bold'
                        : ''
                    }`}>
                      {currentVehicle.nextMaintenanceDate || '-'}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">담당 기사:</div>
                    <div className="text-sm font-medium">{currentVehicle.driverName}</div>
                  </div>
                  <div className="flex">
                    <div className="w-32 text-sm text-gray-600">기사 연락처:</div>
                    <div className="text-sm font-medium">{currentVehicle.driverPhone}</div>
                  </div>
                </div>
              </div>
            </div>

            {currentVehicle.assignedOrders && currentVehicle.assignedOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배정된 주문 ({currentVehicle.assignedOrders.length}개)</h3>
                <div className="space-y-2">
                  {currentVehicle.assignedOrders.map(order => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-900">주문 #{order.id}</div>
                          <div className="text-xs text-gray-600 mt-1">{order.date} {order.time}</div>
                          <div className="text-xs text-gray-500 mt-1">{order.address}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === '진행중' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === '완료' ? 'bg-green-100 text-green-700' :
                          order.status === '지연' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setCurrentVehicle(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  handleEditVehicle(currentVehicle);
                  setIsDetailModalOpen(false);
                }}
                className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
              >
                수정
              </button>
            </div>
          </div>
        ) : selectedItem && (
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
        onClose={() => {
          setIsEditDriverModalOpen(false);
          setCurrentDriver(null);
        }}
        driver={currentDriver}
        onUpdate={handleUpdateDriver}
        vehicleList={vehicleList}
      />

      {/* Assign Vehicle to Driver Modal */}
      <AssignVehicleToDriverModal
        isOpen={isAssignDriverVehicleModalOpen}
        onClose={() => {
          setIsAssignDriverVehicleModalOpen(false);
          setCurrentDriver(null);
        }}
        driver={currentDriver}
        vehicleList={vehiclesWithAvailability.filter(v => v.availabilityStatus === 'Available' || !v.driverName || v.driverName === currentDriver?.name)}
        onAssign={handleAssignDriverVehicle}
      />

      {/* Create or Assign Schedule Modal */}
      <CreateOrAssignScheduleModal
        isOpen={isCreateOrAssignScheduleModalOpen}
        onClose={() => setIsCreateOrAssignScheduleModalOpen(false)}
        pendingOrders={pendingOrders}
        vehicleList={vehiclesWithAvailability}
        driverList={driverList}
        onAssign={(orderId, vehicleId, driverId, scheduleData) => {
          // Add schedule for the assigned order
          const newSchedule = {
            id: scheduleList.length > 0 ? Math.max(...scheduleList.map(s => s.id)) + 1 : 1,
            date: scheduleData.date,
            time: scheduleData.time,
            jobType: scheduleData.jobType || '이사',
            addressSummary: `${scheduleData.pickupAddress} → ${scheduleData.deliveryAddress}`,
            vehicle: vehicleList.find(v => v.id === vehicleId)?.name || '',
            driver: driverList.find(d => d.id === driverId)?.name || '',
            status: '예정',
            orderId: orderId
          };
          setScheduleList(prev => [...prev, newSchedule]);
          setIsCreateOrAssignScheduleModalOpen(false);
        }}
        onCreateSchedule={(scheduleData) => {
          handleAddSchedule(scheduleData);
          setIsCreateOrAssignScheduleModalOpen(false);
        }}
      />

      {/* Add Schedule Modal */}
      <AddScheduleModal 
        isOpen={isAddScheduleModalOpen} 
        onClose={() => setIsAddScheduleModalOpen(false)}
        onAdd={handleAddSchedule}
        vehicleList={vehicleList}
        driverList={driverList}
      />

      {/* Assign Vehicle to Order Modal */}
      <AssignVehicleModal
        isOpen={isAssignVehicleModalOpen}
        onClose={() => {
          setIsAssignVehicleModalOpen(false);
          setCurrentVehicle(null);
          setSelectedOrderForAssignment(null);
        }}
        vehicle={currentVehicle}
        pendingOrders={pendingOrders}
        vehicleList={vehiclesWithAvailability}
        driverList={driverList}
        onAssign={(orderId, vehicleId, driverId, scheduleData) => {
          // Add schedule for the assigned order
          const newSchedule = {
            id: scheduleList.length > 0 ? Math.max(...scheduleList.map(s => s.id)) + 1 : 1,
            date: scheduleData.date,
            time: scheduleData.time,
            jobType: scheduleData.jobType || '이사',
            addressSummary: `${scheduleData.pickupAddress} → ${scheduleData.deliveryAddress}`,
            vehicle: vehicleList.find(v => v.id === vehicleId)?.name || '',
            driver: driverList.find(d => d.id === driverId)?.name || '',
            status: '예정',
            orderId: orderId
          };
          setScheduleList(prev => [...prev, newSchedule]);
          setIsAssignVehicleModalOpen(false);
          setCurrentVehicle(null);
          setSelectedOrderForAssignment(null);
        }}
      />

      {/* Assign Vehicle to Driver Modal */}
      <AssignVehicleToDriverModal
        isOpen={isAssignDriverVehicleModalOpen}
        onClose={() => {
          setIsAssignDriverVehicleModalOpen(false);
          setCurrentDriver(null);
        }}
        driver={currentDriver}
        vehicleList={vehiclesWithAvailability}
        onAssign={handleAssignDriverVehicle}
      />

      {/* Update Driver Status Modal */}
      <UpdateDriverStatusModal
        isOpen={isUpdateDriverStatusModalOpen}
        onClose={() => {
          setIsUpdateDriverStatusModalOpen(false);
          setCurrentDriver(null);
        }}
        driver={currentDriver}
        onUpdate={handleUpdateDriverStatus}
      />
    </div>
  );
};

// Assign Vehicle to Driver Modal Component
const AssignVehicleToDriverModal = ({ isOpen, onClose, driver, vehicleList, onAssign }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    if (driver?.assignedVehicle) {
      const vehicle = vehicleList.find(v => v.name === driver.assignedVehicle);
      if (vehicle) {
        setSelectedVehicleId(vehicle.id);
      }
    }
  }, [driver, vehicleList]);

  const handleAssign = () => {
    if (!selectedVehicleId) {
      alert('차량을 선택해주세요.');
      return;
    }

    onAssign(driver.id, parseInt(selectedVehicleId));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="기사에 차량 배정" size="md">
      <div className="space-y-6">
        {/* Driver Info */}
        {driver && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">기사 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">이름:</span>
                <span className="font-medium">{driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">연락처:</span>
                <span className="font-medium">{driver.phone}</span>
              </div>
              {driver.assignedVehicle && (
                <div className="flex justify-between">
                  <span className="text-gray-600">현재 차량:</span>
                  <span className="font-medium">{driver.assignedVehicle}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">차량 선택 *</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">차량을 선택하세요</option>
            {vehicleList.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.plateNumber}) - {v.availabilityStatus === 'Available' ? '사용 가능' : v.driverName ? `${v.driverName} 담당` : '사용 가능'}
              </option>
            ))}
          </select>
          {selectedVehicleId && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                선택한 차량이 이 기사에게 배정됩니다. 기존 차량 배정이 있다면 변경됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedVehicleId}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            차량 배정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Update Driver Status Modal Component
const UpdateDriverStatusModal = ({ isOpen, onClose, driver, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (driver) {
      // Map availability status to form status
      if (driver.status === '휴무' || driver.availabilityStatus === 'Unavailable') {
        setSelectedStatus('Off Duty');
      } else if (driver.availabilityStatus === 'Working' || driver.availabilityStatus === 'Assigned') {
        setSelectedStatus('On Duty');
      } else {
        setSelectedStatus('Available');
      }
    }
  }, [driver]);

  const handleUpdate = () => {
    if (!selectedStatus) {
      alert('상태를 선택해주세요.');
      return;
    }
    onUpdate(driver.id, selectedStatus, notes);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="기사 상태 변경" size="md">
      <div className="space-y-6">
        {driver && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">기사 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">기사명:</span>
                <span className="font-medium">{driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">현재 상태:</span>
                <span className="font-medium">
                  {driver.status === '휴무' ? '휴무' : driver.availabilityStatus === 'Working' ? '근무 중' : '사용 가능'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">새 상태 *</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">상태를 선택하세요</option>
            <option value="Available">사용 가능</option>
            <option value="On Duty">근무 중</option>
            <option value="Off Duty">휴무</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">메모 (선택사항)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            placeholder="상태 변경 사유나 메모를 입력하세요..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleUpdate}
            disabled={!selectedStatus}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            상태 변경하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Assign Vehicle to Order Modal Component
const AssignVehicleModal = ({ isOpen, onClose, vehicle, pendingOrders, vehicleList, driverList, onAssign }) => {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    if (vehicle?.id) {
      setSelectedVehicleId(vehicle.id.toString());
    }
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
  }, [vehicle]);

  const handleAssign = () => {
    if (!selectedOrderId || !selectedVehicleId || !selectedDriverId || !scheduleDate) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const order = pendingOrders.find(o => o.id === selectedOrderId);
    if (!order) return;

    const scheduleData = {
      date: scheduleDate,
      time: scheduleTime || '09:00',
      jobType: order.serviceName || '이사',
      pickupAddress: order.pickupAddress || '',
      deliveryAddress: order.deliveryAddress || ''
    };

    onAssign(selectedOrderId, parseInt(selectedVehicleId), parseInt(selectedDriverId), scheduleData);
  };

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="주문에 차량 배정" size="md">
      <div className="space-y-6">
        {vehicle && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">차량 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">차량명:</span>
                <span className="font-medium">{vehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">번호판:</span>
                <span className="font-medium">{vehicle.plateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">적재량:</span>
                <span className="font-medium">{vehicle.capacity}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">주문 선택 *</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">주문을 선택하세요</option>
            {pendingOrders.map(order => (
              <option key={order.id} value={order.id}>
                {order.customerName} - {order.serviceName} ({order.preferredDate || order.deliveryDate || '날짜 미정'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">차량 선택 *</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">차량을 선택하세요</option>
            {vehicleList.filter(v => v.availabilityStatus === 'Available' || v.id === parseInt(selectedVehicleId)).map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.plateNumber}) - {v.capacity}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">기사 선택 *</label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">기사를 선택하세요</option>
            {driverList.filter(d => d.status === '근무').map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.phone}) - {driver.assignedVehicle || '차량 미배정'}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">배송 날짜 *</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">배송 시간</label>
            <select
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">시간 선택</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedOrderId || !selectedVehicleId || !selectedDriverId || !scheduleDate}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            배정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Create or Assign Schedule Modal Component
const CreateOrAssignScheduleModal = ({ isOpen, onClose, pendingOrders, vehicleList, driverList, onAssign, onCreateSchedule }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setOrderNumber('');
      setSelectedOrder(null);
      setSelectedDriverId('');
      setNotes('');
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  // Fetch order data when order number is entered
  useEffect(() => {
    if (orderNumber.trim()) {
      // Search in pending orders first
      let foundOrder = pendingOrders.find(o => 
        o.id === orderNumber || 
        o.orderId === orderNumber ||
        o.id?.toString() === orderNumber ||
        o.orderId?.toString() === orderNumber
      );

      // If not found in pending orders, search in all customer orders
      if (!foundOrder) {
        const allOrders = getAllCustomerOrders();
        foundOrder = allOrders.find(o => 
          o.id === orderNumber || 
          o.orderId === orderNumber ||
          o.id?.toString() === orderNumber ||
          o.orderId?.toString() === orderNumber
        );
      }

      // If still not found, try with quote requests
      if (!foundOrder) {
        const quoteRequests = getQuoteRequestsByAgency('moving-agency-1');
        foundOrder = quoteRequests.find(q => 
          q.id === orderNumber || 
          q.id?.toString() === orderNumber
        );
      }

      if (foundOrder) {
        setSelectedOrder(foundOrder);
        // Auto-populate delivery date if available
        if (foundOrder.preferredDate || foundOrder.serviceDate || foundOrder.deliveryDate) {
          setScheduleDate(foundOrder.preferredDate || foundOrder.serviceDate || foundOrder.deliveryDate);
        }
      } else {
        setSelectedOrder(null);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [orderNumber, pendingOrders]);

  const selectedDriver = driverList.find(d => d.id === parseInt(selectedDriverId));
  const selectedDriverVehicle = selectedDriver?.assignedVehicle 
    ? vehicleList.find(v => v.name === selectedDriver.assignedVehicle)
    : null;

  const handleSubmit = () => {
    if (!selectedDriverId || !scheduleDate) {
      alert('기사와 배송 날짜를 입력해주세요.');
      return;
    }

    if (!selectedDriverVehicle) {
      alert('선택한 기사에게 배정된 차량이 없습니다.');
      return;
    }

    if (selectedOrder) {
      // Assign driver and vehicle to existing order
      const scheduleData = {
        date: scheduleDate,
        time: '09:00',
        jobType: selectedOrder.serviceName || selectedOrder.selectedPackage?.name || '이사',
        pickupAddress: selectedOrder.pickupAddress || '',
        deliveryAddress: selectedOrder.deliveryAddress || '',
        notes: notes.trim()
      };

      const orderId = selectedOrder.id || selectedOrder.orderId;
      onAssign(orderId, selectedDriverVehicle.id, parseInt(selectedDriverId), scheduleData);
    } else {
      // Create new schedule without order
      const scheduleData = {
        date: scheduleDate,
        time: '09:00',
        jobType: '이사',
        addressSummary: '',
        vehicle: selectedDriverVehicle.name,
        driver: selectedDriver.name,
        status: '예정',
        notes: notes.trim()
      };

      onCreateSchedule(scheduleData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="스케줄 생성 또는 배정" size="large">
      <div className="space-y-6">
        {/* Order Number Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">주문번호 (선택사항)</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="주문번호를 입력하세요 (예: order-001, quote-1234)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {orderNumber && !selectedOrder && (
            <p className="mt-2 text-sm text-red-600">주문을 찾을 수 없습니다. 주문번호를 확인해주세요.</p>
          )}
        </div>

        {/* Order Information - Auto-populated */}
        {selectedOrder && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">주문 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호:</span>
                <span className="font-medium">{selectedOrder.orderId || selectedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">고객명:</span>
                <span className="font-medium">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">가격:</span>
                <span className="font-medium">₩{(selectedOrder.totalPrice || selectedOrder.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송 날짜:</span>
                <span className="font-medium">{selectedOrder.preferredDate || selectedOrder.serviceDate || selectedOrder.deliveryDate || '미정'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Driver Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">기사 선택 *</label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">기사를 선택하세요</option>
            {driverList.filter(d => d.status === '근무').map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.phone}) - {driver.assignedVehicle || '차량 미배정'}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Vehicle Display */}
        {selectedDriver && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">기사 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">기사명:</span>
                <span className="font-medium">{selectedDriver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">연락처:</span>
                <span className="font-medium">{selectedDriver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배정 차량:</span>
                <span className="font-medium">
                  {selectedDriverVehicle 
                    ? `${selectedDriverVehicle.name} (${selectedDriverVehicle.plateNumber}) - ${selectedDriverVehicle.capacity}`
                    : '차량 미배정'
                  }
                </span>
              </div>
            </div>
            {!selectedDriverVehicle && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-900">
                  ⚠️ 이 기사에게 배정된 차량이 없습니다. 먼저 차량을 배정해주세요.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">배송 날짜 *</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        {/* Notes Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">메모 (선택사항)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="추가 지시사항이나 특별 요청사항을 입력하세요"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>

        {/* Action Buttons - Side by Side */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={!selectedDriverId || !scheduleDate || !selectedDriverVehicle}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedOrder ? '기사 및 차량 배정' : '스케줄 생성'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BusinessSchedulePage;