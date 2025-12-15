import React from 'react';
import AppRouter from './router/AppRouter';
import { ListingsProvider } from './context/ListingsContext';
import { ReservationsProvider } from './context/ReservationsContext';
import { DeliveryQuotesProvider } from './context/DeliveryQuotesContext';

function App() {
  return (
    <DeliveryQuotesProvider>
      <ListingsProvider>
        <ReservationsProvider>
          <AppRouter />
        </ReservationsProvider>
      </ListingsProvider>
    </DeliveryQuotesProvider>
  );
}

export default App