import React from 'react';
import AppRouter from './router/AppRouter';
import { ListingsProvider } from './context/ListingsContext';
import { ReservationsProvider } from './context/ReservationsContext';

function App() {
  return (
    <ListingsProvider>
      <ReservationsProvider>
        <AppRouter />
      </ReservationsProvider>
    </ListingsProvider>
  );
}

export default App