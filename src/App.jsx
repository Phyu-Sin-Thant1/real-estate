import React from 'react';
import AppRouter from './router/AppRouter';
import { ListingsProvider } from './context/ListingsContext';
import { ReservationsProvider } from './context/ReservationsContext';
import { DeliveryQuotesProvider } from './context/DeliveryQuotesContext';
import { I18nProvider } from './context/I18nContext';

function App() {
  return (
    <I18nProvider>
      <DeliveryQuotesProvider>
        <ListingsProvider>
          <ReservationsProvider>
            <AppRouter />
          </ReservationsProvider>
        </ListingsProvider>
      </DeliveryQuotesProvider>
    </I18nProvider>
  );
}

export default App