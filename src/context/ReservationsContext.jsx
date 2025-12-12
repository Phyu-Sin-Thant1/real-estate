import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';

const ReservationsContext = createContext(null);

// Status enum
export const RESERVATION_STATUS = {
  NEW: 'NEW',           // 신규
  CONFIRMED: 'CONFIRMED', // 예약 확정
  RESCHEDULE_REQUESTED: 'RESCHEDULE_REQUESTED', // 일정 조율
  COMPLETED: 'COMPLETED', // 방문 완료
  CANCELED: 'CANCELED'    // 취소
};

// Status labels for UI
export const RESERVATION_STATUS_LABELS = {
  [RESERVATION_STATUS.NEW]: '신규',
  [RESERVATION_STATUS.CONFIRMED]: '확정',
  [RESERVATION_STATUS.RESCHEDULE_REQUESTED]: '일정조율',
  [RESERVATION_STATUS.COMPLETED]: '완료',
  [RESERVATION_STATUS.CANCELED]: '취소'
};

// Status badge colors
export const RESERVATION_STATUS_COLORS = {
  [RESERVATION_STATUS.NEW]: 'bg-blue-100 text-blue-800',
  [RESERVATION_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
  [RESERVATION_STATUS.RESCHEDULE_REQUESTED]: 'bg-yellow-100 text-yellow-800',
  [RESERVATION_STATUS.COMPLETED]: 'bg-purple-100 text-purple-800',
  [RESERVATION_STATUS.CANCELED]: 'bg-gray-100 text-gray-800'
};

// Helper function to load reservations from localStorage
const loadReservationsFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('tofu_realestate_reservations_v1');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse reservations from localStorage', error);
    return [];
  }
};

// Helper function to save reservations to localStorage
const saveReservationsToStorage = (reservations) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tofu_realestate_reservations_v1', JSON.stringify(reservations));
  } catch (error) {
    console.warn('Failed to save reservations to localStorage', error);
  }
};

// Initial mock data
const initialMockReservations = [
  {
    id: 'res-1',
    createdAt: '2025-12-10',
    appointmentDate: '2025-12-15',
    appointmentTime: '14:00',
    customerName: '김철수',
    customerPhone: '010-1234-5678',
    customerEmail: 'kim@example.com',
    listingId: 1,
    listingTitle: '강남 아파트 A동 101호',
    listingAddress: '서울특별시 강남구 역삼동 123-45',
    requestMessage: '가능한 빠른 시간에 방문하고 싶습니다.',
    status: RESERVATION_STATUS.NEW,
    agentNote: '고객이 빠른 결정을 선호함',
    replyHistory: []
  },
  {
    id: 'res-2',
    createdAt: '2025-12-09',
    appointmentDate: '2025-12-14',
    appointmentTime: '11:00',
    customerName: '이영희',
    customerPhone: '010-2345-6789',
    customerEmail: 'lee@example.com',
    listingId: 2,
    listingTitle: '송파 오피스텔 B동 502호',
    listingAddress: '서울특별시 송파구 잠실동 67-89',
    requestMessage: '주말 방문이 가능할까요?',
    status: RESERVATION_STATUS.CONFIRMED,
    agentNote: '',
    replyHistory: [
      {
        at: '2025-12-10T10:30:00',
        by: '시스템',
        message: '상태 변경: 신규 → 확정',
        nextStatus: RESERVATION_STATUS.CONFIRMED
      }
    ]
  },
  {
    id: 'res-3',
    createdAt: '2025-12-08',
    appointmentDate: '2025-12-13',
    appointmentTime: '16:00',
    customerName: '박민수',
    customerPhone: '010-3456-7890',
    customerEmail: 'park@example.com',
    listingId: 3,
    listingTitle: '용산 원룸 301호',
    listingAddress: '서울특별시 용산구 한남동 34-56',
    requestMessage: '계약 관련 상담도 함께 부탁드립니다.',
    status: RESERVATION_STATUS.RESCHEDULE_REQUESTED,
    agentNote: '고객이 다른 일정 요청함',
    replyHistory: [
      {
        at: '2025-12-09T14:15:00',
        by: '시스템',
        message: '상태 변경: 신규 → 일정조율',
        nextStatus: RESERVATION_STATUS.RESCHEDULE_REQUESTED
      }
    ]
  },
  {
    id: 'res-4',
    createdAt: '2025-12-07',
    appointmentDate: '2025-12-12',
    appointmentTime: '10:00',
    customerName: '최지은',
    customerPhone: '010-4567-8901',
    customerEmail: 'choi@example.com',
    listingId: 4,
    listingTitle: '마포 아파트 C동 801호',
    listingAddress: '서울특별시 마포구 서교동 78-90',
    requestMessage: '가족과 함께 방문할 예정입니다.',
    status: RESERVATION_STATUS.COMPLETED,
    agentNote: '방문 완료, 계약 진행 중',
    replyHistory: [
      {
        at: '2025-12-08T09:00:00',
        by: '시스템',
        message: '상태 변경: 신규 → 확정',
        nextStatus: RESERVATION_STATUS.CONFIRMED
      },
      {
        at: '2025-12-12T11:30:00',
        by: '시스템',
        message: '상태 변경: 확정 → 완료',
        nextStatus: RESERVATION_STATUS.COMPLETED
      }
    ]
  },
  {
    id: 'res-5',
    createdAt: '2025-12-06',
    appointmentDate: '2025-12-11',
    appointmentTime: '15:00',
    customerName: '정하늘',
    customerPhone: '010-5678-9012',
    customerEmail: 'jung@example.com',
    listingId: 5,
    listingTitle: '서초 빌라 2층',
    listingAddress: '서울특별시 서초구 방배동 45-67',
    requestMessage: '가까운 시간에 방문 가능할까요?',
    status: RESERVATION_STATUS.CANCELED,
    agentNote: '고객 개인 사정으로 취소',
    replyHistory: [
      {
        at: '2025-12-07T16:45:00',
        by: '시스템',
        message: '상태 변경: 신규 → 취소',
        nextStatus: RESERVATION_STATUS.CANCELED
      }
    ]
  }
];

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const storedReservations = loadReservationsFromStorage();
    // If no stored data, initialize with mock data
    return storedReservations.length > 0 ? storedReservations : initialMockReservations;
  });

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    saveReservationsToStorage(reservations);
  }, [reservations]);

  // Add a new reservation
  const addReservation = useCallback((reservationData) => {
    const newReservation = {
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: RESERVATION_STATUS.NEW,
      agentNote: '',
      replyHistory: [],
      ...reservationData
    };

    setReservations(prev => [newReservation, ...prev]);
    return newReservation;
  }, []);

  // Update reservation status
  const updateReservationStatus = useCallback((id, status, message = '') => {
    setReservations(prev => 
      prev.map(reservation => {
        if (reservation.id === id) {
          const updatedReservation = {
            ...reservation,
            status,
            replyHistory: [
              ...reservation.replyHistory,
              {
                at: new Date().toISOString(),
                by: '시스템',
                message: `상태 변경: ${RESERVATION_STATUS_LABELS[reservation.status]} → ${RESERVATION_STATUS_LABELS[status]}`,
                nextStatus: status
              }
            ]
          };

          // Add custom message if provided
          if (message) {
            updatedReservation.replyHistory.push({
              at: new Date().toISOString(),
              by: '파트너',
              message: message,
              nextStatus: status
            });
          }

          return updatedReservation;
        }
        return reservation;
      })
    );
  }, []);

  // Add reservation reply
  const addReservationReply = useCallback((id, message, status = null) => {
    setReservations(prev => 
      prev.map(reservation => {
        if (reservation.id === id) {
          const updatedReservation = { ...reservation };
          
          // If status is provided, update the status
          if (status) {
            updatedReservation.status = status;
            updatedReservation.replyHistory = [
              ...reservation.replyHistory,
              {
                at: new Date().toISOString(),
                by: '파트너',
                message: message,
                nextStatus: status
              },
              {
                at: new Date().toISOString(),
                by: '시스템',
                message: `상태 변경: ${RESERVATION_STATUS_LABELS[reservation.status]} → ${RESERVATION_STATUS_LABELS[status]}`,
                nextStatus: status
              }
            ];
          } else {
            // Just add the message
            updatedReservation.replyHistory = [
              ...reservation.replyHistory,
              {
                at: new Date().toISOString(),
                by: '파트너',
                message: message
              }
            ];
          }

          return updatedReservation;
        }
        return reservation;
      })
    );
  }, []);

  // Update reservation fields
  const updateReservationFields = useCallback((id, patch) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, ...patch }
          : reservation
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      reservations,
      addReservation,
      updateReservationStatus,
      addReservationReply,
      updateReservationFields
    }),
    [reservations, addReservation, updateReservationStatus, addReservationReply, updateReservationFields]
  );

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
};

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationsProvider');
  }
  return context;
};