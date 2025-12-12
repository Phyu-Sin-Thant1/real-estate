// Mock data for Delivery Drivers
import { vehicles } from './deliveryData';

export const drivers = [
  {
    id: 1,
    name: '김민수',
    phone: '010-1234-5678',
    status: '활성',
    assignedVehicleId: 1,
    assignedVehicleName: '트럭 1호',
    note: '경력 5년, 신뢰도 높음',
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    name: '이정은',
    phone: '010-2345-6789',
    status: '휴무',
    assignedVehicleId: null,
    assignedVehicleName: '',
    note: '월요일 휴무',
    createdAt: '2025-02-20'
  },
  {
    id: 3,
    name: '박기철',
    phone: '010-3456-7890',
    status: '활성',
    assignedVehicleId: 3,
    assignedVehicleName: '트럭 3호',
    note: '대型 물품 전문',
    createdAt: '2025-03-10'
  },
  {
    id: 4,
    name: '최영희',
    phone: '010-4567-8901',
    status: '활성',
    assignedVehicleId: 4,
    assignedVehicleName: '밴 1호',
    note: '소형 이사 전문',
    createdAt: '2025-04-05'
  },
  {
    id: 5,
    name: '정우성',
    phone: '010-5678-9012',
    status: '퇴사',
    assignedVehicleId: null,
    assignedVehicleName: '',
    note: '퇴사 예정',
    createdAt: '2025-05-12'
  },
  {
    id: 6,
    name: '한지민',
    phone: '010-6789-0123',
    status: '활성',
    assignedVehicleId: 6,
    assignedVehicleName: '모터 1호',
    note: '퀵서비스 전문',
    createdAt: '2025-06-18'
  },
  {
    id: 7,
    name: '오준혁',
    phone: '010-7890-1234',
    status: '휴무',
    assignedVehicleId: null,
    assignedVehicleName: '',
    note: '병가중',
    createdAt: '2025-07-22'
  },
  {
    id: 8,
    name: '윤샛별',
    phone: '010-8901-2345',
    status: '활성',
    assignedVehicleId: 2,
    assignedVehicleName: '트럭 2호',
    note: '신입 기사',
    createdAt: '2025-08-30'
  }
];