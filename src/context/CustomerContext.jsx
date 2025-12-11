import React, { createContext, useContext, useReducer } from 'react';
import { customers } from '../mock/realEstateData';

// Action types
const ADD_CUSTOMER = 'ADD_CUSTOMER';

// Initial state
const initialState = {
  customers: [...customers],
};

// Reducer
const customerReducer = (state, action) => {
  switch (action.type) {
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    default:
      return state;
  }
};

// Create context
const CustomerContext = createContext();

// Provider component
export const CustomerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  // Action to add a customer
  const addCustomer = (customerData) => {
    const newCustomer = {
      id: state.customers.length + 1,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || '',
      lastActivity: new Date().toISOString().split('T')[0], // Today's date
      totalContracts: 0,
      memo: customerData.memo || '',
      propertyName: customerData.propertyName || ''
    };
    
    dispatch({
      type: ADD_CUSTOMER,
      payload: newCustomer,
    });
    
    return newCustomer;
  };

  return (
    <CustomerContext.Provider value={{ customers: state.customers, addCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the customer context
export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export default CustomerContext;