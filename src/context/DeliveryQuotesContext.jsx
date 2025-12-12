import React, { createContext, useContext, useState } from 'react';

// Mock data for delivery quotes
const initialQuotes = [
  {
    id: 1,
    customerName: '김철수',
    phone: '010-1234-5678',
    pickupAddress: '서울특별시 강남구 역삼동 123-45',
    deliveryAddress: '서울특별시 서초구 방배동 67-89',
    moveType: '가정이사',
    desiredDate: '2025-12-15',
    status: '신규',
    createdAt: '2025-12-10',
    notes: 'fragile items 포함, 3층 아파트 엘리베이터 있음'
  },
  {
    id: 2,
    customerName: '이영희',
    phone: '010-2345-6789',
    pickupAddress: '서울특별시 마포구 서교동 34-56',
    deliveryAddress: '서울특별시 용산구 한남동 78-90',
    moveType: '원룸이사',
    desiredDate: '2025-12-14',
    status: '연락 완료',
    createdAt: '2025-12-09',
    notes: 'small room, 2nd floor without elevator'
  },
  {
    id: 3,
    customerName: '박민수',
    phone: '010-3456-7890',
    pickupAddress: '서울특별시 송파구 잠실동 56-78',
    deliveryAddress: '서울특별시 강동구 명일동 90-12',
    moveType: '사무실이사',
    desiredDate: '2025-12-20',
    status: '견적 발송',
    createdAt: '2025-12-08',
    notes: 'office equipment, 50㎡ space'
  },
  {
    id: 4,
    customerName: '최지은',
    phone: '010-4567-8901',
    pickupAddress: '서울특별시 종로구 인사동 12-34',
    deliveryAddress: '서울특별시 중구 을지로 56-78',
    moveType: '원룸이사',
    desiredDate: '2025-12-12',
    status: '완료',
    createdAt: '2025-12-07',
    notes: 'apartment move, weekend preferred'
  },
  {
    id: 5,
    customerName: '정하늘',
    phone: '010-5678-9012',
    pickupAddress: '서울특별시 성동구 성수동 34-56',
    deliveryAddress: '서울특별시 광진구 구의동 78-90',
    moveType: '가정이사',
    desiredDate: '2025-12-18',
    status: '신규',
    createdAt: '2025-12-06',
    notes: 'large family move, piano included'
  }
];

const DeliveryQuotesContext = createContext();

export const useDeliveryQuotes = () => {
  const context = useContext(DeliveryQuotesContext);
  if (!context) {
    throw new Error('useDeliveryQuotes must be used within a DeliveryQuotesProvider');
  }
  return context;
};

export const DeliveryQuotesProvider = ({ children }) => {
  const [quotes, setQuotes] = useState(initialQuotes);

  const addQuote = (payload) => {
    const newQuote = {
      id: quotes.length + 1,
      ...payload,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotes(prevQuotes => [...prevQuotes, newQuote]);
  };

  const updateQuoteStatus = (id, status) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === id ? { ...quote, status } : quote
      )
    );
  };

  const value = {
    quotes,
    addQuote,
    updateQuoteStatus
  };

  return (
    <DeliveryQuotesContext.Provider value={value}>
      {children}
    </DeliveryQuotesContext.Provider>
  );
};

export default DeliveryQuotesContext;