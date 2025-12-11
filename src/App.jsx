import React from 'react';
import AppRouter from './router/AppRouter';
import { ListingsProvider } from './context/ListingsContext';
import { CustomerProvider } from './context/CustomerContext';

function App() {
  return (
    <CustomerProvider>
      <ListingsProvider>
        <AppRouter />
      </ListingsProvider>
    </CustomerProvider>
  );
}

export default App