import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { ListingsProvider } from './context/ListingsContext';
import { ReservationsProvider } from './context/ReservationsContext';
import { DeliveryQuotesProvider } from './context/DeliveryQuotesContext';
import { I18nProvider } from './context/I18nContext';
import { BannerProvider } from './context/BannerContext';
import { seedBannersIfEmpty } from './store/bannersStore';

function App() {
  // Initialize banner seed data on app boot
  useEffect(() => {
    seedBannersIfEmpty();
  }, []);

  return (
    <I18nProvider>
      <BannerProvider>
        <DeliveryQuotesProvider>
          <ListingsProvider>
            <ReservationsProvider>
              <AppRouter />
            </ReservationsProvider>
          </ListingsProvider>
        </DeliveryQuotesProvider>
      </BannerProvider>
    </I18nProvider>
  );
}

export default App